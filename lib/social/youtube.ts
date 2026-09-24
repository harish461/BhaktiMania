import { SocialPost } from "./types";
import { socialConfig } from "./config";

/**
 * YouTube Social Data Adapter for BhaktiMania
 * 
 * Future Integration Note:
 * Structured around YouTube Data API v3 Uploads Playlist:
 * 1. Retrieve the uploads playlist ID: GET channels?part=contentDetails&id={CHANNEL_ID}
 * 2. Retrieve the latest video items: GET playlistItems?part=snippet&playlistId={UPLOADS_PLAYLIST_ID}&maxResults=6
 * The YOUTUBE_API_KEY must remain in server-side environment variables and NEVER be exposed in client bundles.
 */

// Original BhaktiMania YouTube Shorts (latest 6 uploads from channel @BhaktiMania1630)
export const realYouTubeShorts: SocialPost[] = [
  {
    id: "yt-HkCwpx4ccFc",
    platform: "youtube",
    title: "जैसे शुद्ध सोने का आभूषण नहीं बन सकता। #shorts #shortvideo #shortsfeed #radheradhe",
    thumbnail: "/images/social/HkCwpx4ccFc.jpg",
    publishedAt: "2 hours ago",
    duration: "0:30",
    url: "https://www.youtube.com/shorts/HkCwpx4ccFc",
    isMockData: false,
  },
  {
    id: "yt--_qYL1xpAVQ",
    platform: "youtube",
    title: "ऐसी शक्ति हमें देना दाता, मन का विश्वास कमजोर हो ना। #shorts #viral",
    thumbnail: "/images/social/-_qYL1xpAVQ.jpg",
    publishedAt: "1 day ago",
    duration: "0:45",
    url: "https://www.youtube.com/shorts/-_qYL1xpAVQ",
    isMockData: false,
  },
  {
    id: "yt-wYaKsGDcDTk",
    platform: "youtube",
    title: "पीड़ा हो तो ऐसी😂😂😂 #shorts #shortsfeed #shortsviral",
    thumbnail: "/images/social/wYaKsGDcDTk.jpg",
    publishedAt: "2 days ago",
    duration: "0:25",
    url: "https://www.youtube.com/shorts/wYaKsGDcDTk",
    isMockData: false,
  },
  {
    id: "yt-D9hTFTHjF5w",
    platform: "youtube",
    title: "Krishna Krishna kehte kehte #shorts #shortvideo #shortsfeed #shortsviral",
    thumbnail: "/images/social/D9hTFTHjF5w.jpg",
    publishedAt: "3 days ago",
    duration: "0:35",
    url: "https://www.youtube.com/shorts/D9hTFTHjF5w",
    isMockData: false,
  },
  {
    id: "yt-NDeZu2g5ff8",
    platform: "youtube",
    title: "ओ, मैंने तेरे ही भरोसे, हनुमान… #shorts #shortvideo #hanuman",
    thumbnail: "/images/social/NDeZu2g5ff8.jpg",
    publishedAt: "4 days ago",
    duration: "0:40",
    url: "https://www.youtube.com/shorts/NDeZu2g5ff8",
    isMockData: false,
  },
  {
    id: "yt-kqtsZ8UYQsk",
    platform: "youtube",
    title: "Radhe Radhe #shorts #shortvideo #shortsfeed #bhaktiras",
    thumbnail: "/images/social/kqtsZ8UYQsk.jpg",
    publishedAt: "5 days ago",
    duration: "0:30",
    url: "https://www.youtube.com/shorts/kqtsZ8UYQsk",
    isMockData: false,
  },
];

export const mockYouTubeVideos = realYouTubeShorts;

export async function getLatestYouTubeVideos(): Promise<SocialPost[]> {
  // Returns exactly the 6 latest original shorts
  return realYouTubeShorts.slice(0, 6);
}
