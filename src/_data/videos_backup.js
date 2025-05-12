// const YouTube = require("simple-youtube-api");
// const fs = require("fs");
// const path = require("path");

// // helpers
// //
// // Helper to load API key from .secrets
// function getYouTubeApiKey() {
//   // First, check environment variable (for cloud)
//   if (process.env.YOUTUBE_API_KEY) {
//     console.log("[videos.js] Using YOUTUBE_API_KEY from environment variable");
//     return process.env.YOUTUBE_API_KEY;
//   }
//   // Fallback to .secrets file (for local dev)
//   const secretsPath = path.resolve(__dirname, "../../.secrets");
//   if (fs.existsSync(secretsPath)) {
//     console.log("[videos.js] Loading YOUTUBE_API_KEY from .secrets file");
//     const secrets = fs.readFileSync(secretsPath, "utf-8");
//     const match = secrets.match(/YOUTUBE_API_KEY\s*=\s*(.*)/);
//     if (match) return match[1].trim();
//   }
//   console.error("[videos.js] ERROR: YOUTUBE_API_KEY not found");
//   throw new Error("YOUTUBE_API_KEY not found in environment or .secrets file");
// }

// // Helper to extract playlist ID from URL
// function getPlaylistId(url) {
//   const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
//   if (match) {
//     console.log(
//       `[videos.js] Extracted playlist ID: ${match[1]} from URL: ${url}`
//     );
//     return match[1];
//   } else {
//     console.warn(
//       `[videos.js] No playlist ID found in URL, using raw input: ${url}`
//     );
//     return url;
//   }
// }

// // Helper to fetch playlist items
// async function fetchPlaylistItems(playlistId, apiKey) {
//   console.log(`[videos.js] Fetching playlist: ${playlistId}`);
//   const youtube = new YouTube(apiKey);
//   let playlist, videos;
//   try {
//     playlist = await youtube.getPlaylistByID(playlistId);
//     console.log(`[videos.js] Playlist title: ${playlist.title}`);
//   } catch (err) {
//     console.error(`[videos.js] Failed to fetch playlist: ${playlistId}`, err);
//     return [];
//   }
//   try {
//     videos = await playlist.getVideos();
//     console.log(
//       `[videos.js] Fetched ${videos.length} videos from playlist ${playlistId}`
//     );
//   } catch (err) {
//     console.error(
//       `[videos.js] Failed to fetch videos for playlist: ${playlistId}`,
//       err
//     );
//     return [];
//   }
//   const mapped = videos.map((video) => {
//     let thumb =
//       video.thumbnails && video.thumbnails.medium
//         ? video.thumbnails.medium.url
//         : video.thumbnails && video.thumbnails.default
//         ? video.thumbnails.default.url
//         : null;
//     if (!thumb) console.warn(`[videos.js] No thumbnail for video ${video.id}`);
//     return {
//       id: video.id,
//       title: video.title,
//       date: video.publishedAt,
//       thumbnail: thumb,
//       description: video.description,
//     };
//   });
//   console.log(`[videos.js] Mapped video data for playlist ${playlistId}`);
//   return mapped;
// }

// //https://stackoverflow.com/questions/5311334/what-is-the-purpose-of-node-js-module-exports-and-how-do-you-use-it
// //module.exports is the object that's actually returned as the result of a require call.
// module.exports = async function () {
//   console.log("[videos.js] Starting YouTube playlist fetcher...");
//   let apiKey;
//   try {
//     apiKey = getYouTubeApiKey();
//   } catch (err) {
//     console.error("[videos.js] Could not get API key:", err);
//     return [];
//   }


//   async function loadPlaylistUrlsFromFiles() {
//     const playlistDir = path.join(__dirname, "../../src/playlists");
//     console.log(`[videos.js] Looking for playlists in: ${playlistDir}`);

//     // Get all markdown files in the playlists directory
//     const files = fs
//       .readdirSync(playlistDir)
//       .filter((file) => file.endsWith(".md"));

//     console.log(`[videos.js] Found ${files.length} playlist files`);
//     const matter = require("gray-matter");

//     const urls = [];
//     for (const file of files) {
//       const filePath = path.join(playlistDir, file);
//       const content = fs.readFileSync(filePath, "utf-8");

//       const data = matter(content);
//       const url = data.data.url;

//       urls.push(url);
//       // console.log(`[videos.js] Added URL from ${file}: ${url}`);
//     }


//     return urls;
//   }

//   const playlistUrls = await loadPlaylistUrlsFromFiles();
//   console.log(
//     `[videos.js] Loaded ${playlistUrls.length} playlist URLs from files`
//   );

//   let allVideos = [];
  
//   for (const url of playlistUrls) {
//     console.log(`[videos.js] Processing playlist URL: ${url}`);
//     const playlistId = getPlaylistId(url);
//     const videos = await fetchPlaylistItems(playlistId, apiKey);
//     allVideos = allVideos.concat(videos);
//     console.log(`[videos.js] Current total videos: ${allVideos.length}`);
//   }

//   console.log(`[videos.js] Final video array: ${allVideos.length} videos`);
//   if (allVideos.length > 0) {
//     console.log(`[videos.js] First video: ${allVideos[0].title}`);
//     console.log(`[videos.js] Last video: ${allVideos[allVideos.length - 1].title}`);
//   } else {
//     console.log('[videos.js] No videos found');
//   }

//   // return the videos
//   return allVideos;
// };
