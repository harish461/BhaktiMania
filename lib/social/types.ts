export type SocialPlatform = "facebook" | "youtube";

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  title: string;
  excerpt?: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  duration?: string;
  isMockData?: boolean;
}
