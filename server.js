
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Helper: parse ISO 8601 duration
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}


async function fetchCourses(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(
    query + " full course tutorial lecture"
  )}&key=${YOUTUBE_API_KEY}`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  if (searchData.error) {
    console.error("YouTube search API error:", searchData.error);
    return [];
  }

  const unwanted = /roadmap|song|music|intro/i;

  const videoIds = searchData.items
    .filter(
      (item) =>
        item.id.videoId &&
        !unwanted.test(item.snippet.title)
    )
    .map((item) => item.id.videoId);

  if (videoIds.length === 0) return [];

  // Fetch details + stats + snippet for language
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(
    ","
  )}&key=${YOUTUBE_API_KEY}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  return searchData.items
    .map((item) => {
      const details = detailsData.items.find((s) => s.id === item.id.videoId);
      const duration = details ? parseDuration(details.contentDetails.duration) : 0;
      const views = parseInt(details?.statistics.viewCount || 0);
      const likes = parseInt(details?.statistics.likeCount || 0);
      const score = views > 0 ? likes / views : 0;

      // Extract language from snippet.defaultAudioLanguage or fallback to empty string
      const language = details?.snippet?.defaultAudioLanguage || "";

      return {
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        url: 'https://www.youtube.com/watch?v=${item.id.videoId}',
        views,
        likes,
        score,
        duration,
        language, // new field here
      };
    })
    // Filter: at least 2 min (avoid Shorts) + 50k views
    .filter((video) => video.duration >= 120 && video.views >= 50000)
    .sort((a, b) => b.score - a.score);
}


async function fetchPlaylists(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=20&q=${encodeURIComponent(
    query + " full course tutorial lecture"
  )}&key=${YOUTUBE_API_KEY}`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  if (searchData.error) {
    console.error("YouTube API error (playlists):", searchData.error);
    return [];
  }

  const unwanted = /roadmap|song|music|intro/i;

  return searchData.items
    .filter((item) => !unwanted.test(item.snippet.title))
    .map((item) => ({
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
    }));
}

app.get("/api/courses", async (req, res) => {
  const query = req.query.query || "";
  try {
    const videos = await fetchCourses(query);
    const playlists = await fetchPlaylists(query);
    res.json({ videos, playlists });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ CoDeadUs Backend running at http://localhost:${PORT}`);
});



