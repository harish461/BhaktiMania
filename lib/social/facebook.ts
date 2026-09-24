import { SocialPost } from "./types";
import { socialConfig } from "./config";

/**
 * Facebook Social Data Adapter for BhaktiMania
 * 
 * Future Integration Note:
 * To connect live Facebook Page posts, use the Facebook Graph API:
 * GET https://graph.facebook.com/v20.0/{page-id}/feed?fields=id,message,created_time,full_picture,permalink_url
 * The API access token must remain in server-side environment variables and NEVER be exposed in client bundles.
 */

// Original BhaktiMania Facebook Reels & Posts (latest 6 from official BhaktiMania page)
export const realFacebookPosts: SocialPost[] = [
  {
    id: "fb-reel-1886742162295292",
    platform: "facebook",
    title: "जैसे शुद्ध सोने का आभूषण नहीं बन सकता। #shorts #radheradhe",
    excerpt: "जैसे शुद्ध सोने का आभूषण नहीं बन सकता...",
    thumbnail: "/images/social/HkCwpx4ccFc.jpg",
    publishedAt: "2 hours ago",
    url: "https://www.facebook.com/reel/1886742162295292/",
    isMockData: false,
  },
  {
    id: "fb-reel-2344322869710709",
    platform: "facebook",
    title: "ऐसी शक्ति हमें देना दाता, मन का विश्वास कमजोर हो ना। #shorts #radheradhe",
    excerpt: "ऐसी शक्ति हमें देना दाता...",
    thumbnail: "/images/social/-_qYL1xpAVQ.jpg",
    publishedAt: "1 day ago",
    url: "https://www.facebook.com/reel/2344322869710709/",
    isMockData: false,
  },
  {
    id: "fb-reel-4826608964328374",
    platform: "facebook",
    title: "पीड़ा हो तो ऐसी😂😂😂 #shorts #radheradhe #bhaktimania",
    excerpt: "पीड़ा हो तो ऐसी😂😂😂...",
    thumbnail: "/images/social/wYaKsGDcDTk.jpg",
    publishedAt: "2 days ago",
    url: "https://www.facebook.com/reel/4826608964328374/",
    isMockData: false,
  },
  {
    id: "fb-reel-1385574993745476",
    platform: "facebook",
    title: "Krishna Krishna kehte kehte Krishna ke hi ho gaye #shorts",
    excerpt: "Krishna Krishna kehte kehte...",
    thumbnail: "/images/social/D9hTFTHjF5w.jpg",
    publishedAt: "3 days ago",
    url: "https://www.facebook.com/reel/1385574993745476/",
    isMockData: false,
  },
  {
    id: "fb-reel-1417482973253556",
    platform: "facebook",
    title: "ओ, मैंने तेरे ही भरोसे, हनुमान… #shorts #bhaktimania",
    excerpt: "ओ, मैंने तेरे ही भरोसे, हनुमान…",
    thumbnail: "/images/social/NDeZu2g5ff8.jpg",
    publishedAt: "4 days ago",
    url: "https://www.facebook.com/reel/1417482973253556/",
    isMockData: false,
  },
  {
    id: "fb-post-story-02p7J5",
    platform: "facebook",
    title: "राधे राधे — भक्ति भाव एवं पावन दर्शन #radheradhe #bhaktimania",
    excerpt: "राधे राधे पावन दर्शन...",
    thumbnail: "/images/social/kqtsZ8UYQsk.jpg",
    publishedAt: "4 days ago",
    url: "https://www.facebook.com/permalink.php?story_fbid=pfbid02p7J5SvDf4kjFtRgFLCh2QdHHy8bnVw3WfuVj1a5T44EUpkgHXSbg7Q9p7g1GkJhkl&id=61590598324054",
    isMockData: false,
  },
];

export const mockFacebookPosts = realFacebookPosts;

export async function getLatestFacebookPosts(): Promise<SocialPost[]> {
  // Returns exactly the 6 latest original posts/reels
  return realFacebookPosts.slice(0, 6);
}
