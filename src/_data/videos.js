const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Helper to load API key from .secrets
function getYouTubeApiKey() {
  // First, check environment variable (for cloud)
  if (process.env.YOUTUBE_API_KEY) {
    console.log("[videos.js] Using YOUTUBE_API_KEY from environment variable");
    return process.env.YOUTUBE_API_KEY;
  }
  // Fallback to .secrets file (for local dev)
  const secretsPath = path.resolve(__dirname, "../../.secrets");
  if (fs.existsSync(secretsPath)) {
    console.log("[videos.js] Loading YOUTUBE_API_KEY from .secrets file");
    const secrets = fs.readFileSync(secretsPath, "utf-8");
    const match = secrets.match(/YOUTUBE_API_KEY\s*=\s*(.*)/);
    if (match) return match[1].trim();
  }
  console.error("[videos.js] ERROR: YOUTUBE_API_KEY not found");
  throw new Error("YOUTUBE_API_KEY not found in environment or .secrets file");
}

// Helper to resolve username to channel ID
async function resolveChannelId(youtube, username) {
  console.log(`[videos.js] Resolving channel ID for username: ${username}`);
  try {
    // Remove @ if present and handle full URL
    let cleanUsername = username.startsWith('@') 
      ? username.slice(1) 
      : username.includes('youtube.com/@') 
        ? username.split('/@')[1] 
        : username;

    // Use YouTube Data API to search for the channel
    const response = await youtube.search.list({
      part: 'id,snippet',
      type: 'channel',
      q: cleanUsername,
      maxResults: 1
    });

    if (response.data.items.length === 0) {
      throw new Error(`No channel found for username: ${cleanUsername}`);
    }

    const channelId = response.data.items[0].id.channelId;
    console.log(`[videos.js] Resolved channel ID: ${channelId}`);
    return channelId;
  } catch (err) {
    console.error(`[videos.js] Failed to resolve channel ID for username: ${username}`, err);
    throw err;
  }
}

// Helper to fetch channel videos
async function fetchChannelVideos(channelId, apiKey) {
  console.log(`[videos.js] Fetching videos for channel: ${channelId}`);
  
  // Initialize YouTube API client
  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
  });

  try {
    // Resolve username to channel ID if needed
    const resolvedChannelId = channelId.startsWith('@') || channelId.includes('youtube.com/@')
      ? await resolveChannelId(youtube, channelId)
      : channelId;

    // Fetch uploads playlist
    const channelResponse = await youtube.channels.list({
      part: 'contentDetails',
      id: resolvedChannelId
    });

    if (channelResponse.data.items.length === 0) {
      throw new Error(`No channel found with ID: ${resolvedChannelId}`);
    }

    const uploadsPlaylistId = 
      channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Fetch videos from uploads playlist
    const playlistItemsResponse = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 50
    });

    // Map video data
    const mapped = playlistItemsResponse.data.items.map((item) => {
      const snippet = item.snippet;
      return {
        id: snippet.resourceId.videoId,
        title: snippet.title,
        date: snippet.publishedAt,
        thumbnail: 
          snippet.thumbnails.medium?.url || 
          snippet.thumbnails.default?.url || 
          null,
        description: snippet.description,
      };
    });

    console.log(`[videos.js] Fetched ${mapped.length} videos from channel ${resolvedChannelId}`);
    return mapped;
  } catch (err) {
    console.error(`[videos.js] Failed to fetch videos for channel: ${channelId}`, err);
    return [];
  }
}

module.exports = async function () {
  console.log("[videos.js] Starting YouTube channel video fetcher...");
  let apiKey;
  try {
    apiKey = getYouTubeApiKey();
  } catch (err) {
    console.error("[videos.js] Could not get API key:", err);
    return [];
  }

  // Channel ID or username
  const channelId = '@taylorbelanger7982'; // Replace with actual YouTube channel
  
  const videos = await fetchChannelVideos(channelId, apiKey);
  
  console.log(`[videos.js] Final video array: ${videos.length} videos`);
  if (videos.length > 0) {
    console.log(`[videos.js] First video: ${videos[0].title}`);
    console.log(`[videos.js] Last video: ${videos[videos.length - 1].title}`);
  } else {
    console.log('[videos.js] No videos found');
  }

  // return the videos
  return videos;
};
