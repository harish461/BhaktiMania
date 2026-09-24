/**
 * Shared validation utilities for Affiliate Products.
 * Safe to import in both Client Components and Server Actions / Server Components.
 */

export interface AffiliateUrlValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates that an affiliate URL is direct, outbound, and compliant with Amazon Associates policies.
 * Strictly rejects cloaking (/go/...), javascript:, data:, and malformed protocols.
 */
export function validateAffiliateUrl(
  url: string | null | undefined
): AffiliateUrlValidationResult {
  if (!url || typeof url !== "string" || !url.trim()) {
    return { isValid: false, error: "Affiliate URL is required." };
  }

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return {
      isValid: false,
      error: "Unsafe URL scheme detected (javascript/data protocols are prohibited).",
    };
  }

  if (lower.startsWith("/go/") || lower.includes("/go/")) {
    return {
      isValid: false,
      error:
        "Internal redirect or cloaking URLs (/go/...) are strictly prohibited by Amazon policy.",
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        isValid: false,
        error: "Affiliate URL must use http:// or https:// protocol.",
      };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Affiliate URL is malformed." };
  }
}

/**
 * Validates optional image URLs.
 */
export function validateImageUrl(
  url: string | null | undefined
): AffiliateUrlValidationResult {
  if (!url || typeof url !== "string" || !url.trim()) {
    return { isValid: true };
  }

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return {
      isValid: false,
      error: "Image URL must use http:// or https:// protocol.",
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        isValid: false,
        error: "Image URL must use http:// or https:// protocol.",
      };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Image URL is malformed." };
  }
}
