const fs = require('fs');
const path = require('path');

// Helper to load API key from .secrets
function getYouTubeApiKey() {
  const secretsPath = path.resolve(__dirname, '../../.secrets');
  const secrets = fs.readFileSync(secretsPath, 'utf-8');
  const match = secrets.match(/YOUTUBE_API_KEY\s*=\s*(.*)/);
  if (!match) throw new Error('YOUTUBE_API_KEY not found in .secrets');
  return match[1].trim();
}

// Helper to extract playlist ID from URL
function getPlaylistId(url) {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : url;
}

async function fetchPlaylistItems(playlistId, apiKey) {
  let videos = [];
  let nextPageToken = '';
  do {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}` +
      (nextPageToken ? `&pageToken=${nextPageToken}` : '');
    const fetch = (await import('node-fetch')).default;
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (!data.items) break;
    videos = videos.concat(data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      date: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description,
    })));
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);
  return videos;
}

module.exports = async function () {
  const apiKey = getYouTubeApiKey();

  // TODO: Load playlist URLs from your CMS data (for now, hardcode for testing)
  const playlistUrls = [
    // Example: 'https://www.youtube.com/playlist?list=PLynWqC2nK7U4zQ8p2A8KJk9r-v2XzR4dP'
  ];

  // If your playlist URLs are in a JSON or Markdown file, require or read them here
  // const playlistUrls = require('../videos/playlists.json'); // Example

  let allVideos = [];
  for (const url of playlistUrls) {
    const playlistId = getPlaylistId(url);
    const videos = await fetchPlaylistItems(playlistId, apiKey);
    allVideos = allVideos.concat(videos);
  }

  return allVideos;
};