/**
 * BhaktiMania — Server-Side Devotional Image Validation Utility
 * 
 * Enforces strict security boundaries on uploaded media:
 * - Max file size: 5 MB (5,242,880 bytes)
 * - Supported formats: WebP, JPEG, PNG only
 * - Magic byte inspection (rejecting spoofed MIME types, SVG, GIF, PDF, executables)
 * - Safe file extension verification
 * - Image dimension parsing (advisory resolution: 1200 x 630 or larger)
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const RECOMMENDED_WIDTH = 1200;
export const RECOMMENDED_HEIGHT = 630;

export type SupportedImageFormat = "jpeg" | "png" | "webp";

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  format?: SupportedImageFormat;
  extension?: string;
  mimeType?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  isRecommendedResolution?: boolean;
  dimensionAdvisory?: string;
}

const ALLOWED_EXTENSIONS: Record<string, SupportedImageFormat> = {
  jpg: "jpeg",
  jpeg: "jpeg",
  png: "png",
  webp: "webp",
};

/**
 * Validates an image buffer server-side.
 */
export function validateImageBuffer(
  buffer: Buffer,
  originalFilename: string = "image"
): ImageValidationResult {
  // 1. Check size limit
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: "Empty or missing file." };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (buffer.length / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds the maximum allowed limit of 5 MB.`,
    };
  }

  // 2. Validate file extension
  const cleanFilename = originalFilename.trim().toLowerCase();
  const extMatch = cleanFilename.match(/\.([a-z0-9]+)$/);
  const ext = extMatch ? extMatch[1] : "";

  if (ext === "svg") {
    return {
      valid: false,
      error: "SVG files are not permitted for security reasons. Please upload WebP, JPEG, or PNG.",
    };
  }

  if (ext === "gif") {
    return {
      valid: false,
      error: "GIF animated files are not supported. Please use WebP, JPEG, or PNG.",
    };
  }

  if (!ext || !ALLOWED_EXTENSIONS[ext]) {
    return {
      valid: false,
      error: "Only WebP, JPG/JPEG, and PNG image files are supported.",
    };
  }

  // 3. Reject forbidden file formats by explicit signature checks
  // SVG text check
  const snippet = buffer.subarray(0, Math.min(buffer.length, 512)).toString("utf-8", 0, Math.min(buffer.length, 512));
  if (
    snippet.includes("<svg") ||
    snippet.includes("<?xml") ||
    snippet.includes("xmlns=\"http://www.w3.org/2000/svg\"")
  ) {
    return {
      valid: false,
      error: "SVG files are not permitted for security reasons.",
    };
  }

  // PDF check (%PDF-)
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { valid: false, error: "PDF documents cannot be uploaded as featured images." };
  }

  // GIF check (GIF87a or GIF89a)
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { valid: false, error: "GIF animated files are not supported. Please use WebP, JPEG, or PNG." };
  }

  // Executable checks (MZ / PE Windows, or ELF Linux)
  if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return { valid: false, error: "Invalid binary file content." };
  }
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x7f &&
    buffer[1] === 0x45 &&
    buffer[2] === 0x4c &&
    buffer[3] === 0x46
  ) {
    return { valid: false, error: "Invalid binary file content." };
  }

  // 4. Validate magic bytes and extract dimensions
  let detectedFormat: SupportedImageFormat | null = null;
  let dimensions: { width: number; height: number } | undefined;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    detectedFormat = "png";
    // IHDR chunk: starts at offset 12 ("IHDR"), width at offset 16, height at offset 20 (4 bytes big-endian)
    if (
      buffer[12] === 0x49 &&
      buffer[13] === 0x48 &&
      buffer[14] === 0x44 &&
      buffer[15] === 0x52
    ) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      if (width > 0 && height > 0) {
        dimensions = { width, height };
      }
    }
  }

  // JPEG: FF D8 (SOI marker)
  else if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    detectedFormat = "jpeg";
    dimensions = parseJpegDimensions(buffer);
  }

  // WebP: RIFF (bytes 0-3) + WEBP (bytes 8-11)
  else if (
    buffer.length >= 16 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    detectedFormat = "webp";
    dimensions = parseWebpDimensions(buffer);
  }

  if (!detectedFormat) {
    return {
      valid: false,
      error: "File content does not match a valid WebP, JPEG, or PNG image format.",
    };
  }

  const mimeMap: Record<SupportedImageFormat, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  const safeExtension = detectedFormat === "jpeg" ? "jpg" : detectedFormat;

  let isRecommendedResolution = true;
  let dimensionAdvisory: string | undefined;

  if (dimensions) {
    if (dimensions.width < RECOMMENDED_WIDTH || dimensions.height < RECOMMENDED_HEIGHT) {
      isRecommendedResolution = false;
      dimensionAdvisory = `Recommended: 1200 × 630 or larger (current: ${dimensions.width} × ${dimensions.height}).`;
    }
  }

  return {
    valid: true,
    format: detectedFormat,
    extension: safeExtension,
    mimeType: mimeMap[detectedFormat],
    dimensions,
    isRecommendedResolution,
    dimensionAdvisory,
  };
}

/**
 * Helper: Parse JPEG dimensions by scanning markers until SOF0 (0xFFC0) or SOF2 (0xFFC2).
 */
function parseJpegDimensions(
  buffer: Buffer
): { width: number; height: number } | undefined {
  let offset = 2; // Skip SOI marker (0xFFD8)

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = buffer[offset + 1];

    // SOF0 (Baseline DCT) or SOF2 (Progressive DCT)
    if (marker === 0xc0 || marker === 0xc2) {
      if (offset + 9 < buffer.length) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        if (width > 0 && height > 0) {
          return { width, height };
        }
      }
      break;
    }

    // Skip to next marker using length header (if marker has length)
    if (
      marker === 0xd9 || // EOI
      marker === 0xda // SOS (Start of Scan)
    ) {
      break;
    }

    if (offset + 3 < buffer.length) {
      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    } else {
      break;
    }
  }

  return undefined;
}

/**
 * Helper: Parse WebP dimensions for VP8 (lossy), VP8L (lossless), or VP8X (extended).
 */
function parseWebpDimensions(
  buffer: Buffer
): { width: number; height: number } | undefined {
  if (buffer.length < 30) return undefined;

  const chunkType = buffer.toString("ascii", 12, 16);

  // VP8X (Extended format)
  if (chunkType === "VP8X" && buffer.length >= 30) {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    if (width > 0 && height > 0) return { width, height };
  }

  // VP8 (Simple lossy format)
  if (chunkType === "VP8 " && buffer.length >= 30) {
    // Keyframe signature check: 0x9D 0x01 0x2A at offset 23
    if (buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
      const width = buffer.readUInt16LE(26) & 0x3fff;
      const height = buffer.readUInt16LE(28) & 0x3fff;
      if (width > 0 && height > 0) return { width, height };
    }
  }

  // VP8L (Lossless format)
  if (chunkType === "VP8L" && buffer.length >= 25) {
    if (buffer[20] === 0x2f) {
      const b1 = buffer[21];
      const b2 = buffer[22];
      const b3 = buffer[23];
      const b4 = buffer[24];
      const width = 1 + (((b2 & 0x3f) << 8) | b1);
      const height = 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
      if (width > 0 && height > 0) return { width, height };
    }
  }

  return undefined;
}
