/**
 * Central Google AdSense configuration and helper module.
 *
 * Enforces strict environment-driven activation without hardcoding publisher IDs
 * or fabricating credentials.
 */

export interface AdSenseConfig {
  /**
   * Google AdSense publisher ID (e.g., ca-pub-XXXXXXXXXXXXXXXX).
   * Omitted or empty in development and pre-approval environments.
   */
  publisherId: string;
  /**
   * Master feature toggle. Evaluates to true strictly when
   * NEXT_PUBLIC_ADSENSE_ENABLED === "true" AND a non-empty publisherId is present.
   */
  enabled: boolean;
}

const rawPublisherId = (process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "").trim();
const isEnabledFlag = (process.env.NEXT_PUBLIC_ADSENSE_ENABLED ?? "").trim().toLowerCase() === "true";

export const adsenseConfig: AdSenseConfig = {
  publisherId: rawPublisherId,
  enabled: isEnabledFlag && Boolean(rawPublisherId),
};

/**
 * Normalizes publisher ID to the standard Google 'ca-pub-...' format.
 */
export function getAdSenseClient(publisherId: string = adsenseConfig.publisherId): string {
  if (!publisherId) return "";
  return publisherId.startsWith("ca-pub-") ? publisherId : `ca-pub-${publisherId}`;
}
