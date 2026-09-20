/**
 * Validates an optional avatar URL to ensure only safe http/https schemes are permitted.
 * Strictly rejects javascript:, data:, file:, or malformed schemes.
 */
export function validateAvatarUrl(url?: string | null): { valid: boolean; error?: string } {
  if (!url || !url.trim()) {
    return { valid: true };
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        valid: false,
        error: "Avatar URL must use a secure 'https://' or 'http://' protocol. Unsafe schemes (javascript:, data:, file:) are prohibited.",
      };
    }
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: "Please enter a valid URL for the avatar (must start with https:// or http://).",
    };
  }
}
