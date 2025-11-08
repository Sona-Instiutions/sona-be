/**
 * Banner helper utilities for institution queries and responses.
 * Provides utilities for constructing API queries with banner population
 * and normalizing response structures.
 */

/**
 * Constructs a Strapi query object that populates banner image.
 * Used internally by services and controllers for fetching institutions with banners.
 */
export function getBannerPopulateQuery() {
  return {
    populate: ["bannerImage"],
  };
}

/**
 * Constructs a Strapi query for fetching institution by slug with banner.
 * Combines slug filter with banner population.
 */
export function getInstitutionBySlugQuery(slug: string) {
  return {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: ["bannerImage"],
  };
}

/**
 * Normalizes institution response to ensure banner fields are present.
 * Validates that required banner fields exist in response.
 */
export function normalizeBannerResponse(institution: Record<string, unknown>): Record<string, unknown> {
  if (!institution) {
    throw new Error("Institution data not found");
  }

  // Ensure banner fields exist
  if (!("bannerTitle" in institution)) {
    throw new Error("Missing required bannerTitle field");
  }

  if (!("bannerImage" in institution)) {
    throw new Error("Missing required bannerImage field");
  }

  // Ensure banner image has URL
  const bannerImage = institution.bannerImage as Record<string, unknown> | null;
  if (bannerImage && !bannerImage.url) {
    throw new Error("Banner image missing URL");
  }

  return institution;
}

/**
 * Builds image URL with absolute path.
 * Handles both relative paths and full URLs from Strapi.
 */
export function buildImageUrl(imageUrl: string, baseUrl?: string): string {
  // If already absolute URL, return as-is
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // Construct absolute URL with base
  const base = baseUrl || process.env.STRAPI_URL || "http://localhost:1337";
  return `${base}${imageUrl}`;
}

/**
 * Extracts banner metadata from media object.
 * Provides structured access to image properties.
 */
export function extractBannerMetadata(bannerImage: Record<string, unknown>): {
  id: number;
  url: string;
  width?: number;
  height?: number;
  mime: string;
  size: number;
  name: string;
  alternativeText?: string;
} {
  return {
    id: bannerImage.id as number,
    url: bannerImage.url as string,
    width: bannerImage.width as number | undefined,
    height: bannerImage.height as number | undefined,
    mime: bannerImage.mime as string,
    size: bannerImage.size as number,
    name: bannerImage.name as string,
    alternativeText: bannerImage.alternativeText as string | undefined,
  };
}

/**
 * Validates banner image has minimum required properties.
 * Ensures image is suitable for display in frontend.
 */
export function validateBannerImageMetadata(bannerImage: Record<string, unknown>): boolean {
  const errors: string[] = [];

  if (!bannerImage.id) {
    errors.push("Image must have an ID");
  }

  if (!bannerImage.url) {
    errors.push("Image must have a URL");
  }

  if (!bannerImage.mime) {
    errors.push("Image must have a MIME type");
  }

  if (!bannerImage.size) {
    errors.push("Image must have a size");
  }

  if (errors.length > 0) {
    throw new Error(`Banner image validation failed: ${errors.join(", ")}`);
  }

  return true;
}

/**
 * Validates banner title field to ensure non-empty string and length constraint.
 */
export function validateBannerTitle(title: unknown): string {
  if (typeof title !== "string") {
    throw new Error("Banner title must be a string");
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    throw new Error("Banner title cannot be empty");
  }

  if (trimmedTitle.length > 255) {
    throw new Error("Banner title must not exceed 255 characters");
  }

  return trimmedTitle;
}

/**
 * Validates optional banner subtitle, enforcing max length constraint.
 */
export function validateBannerSubtitle(subtitle: unknown): string | null {
  if (subtitle === null || subtitle === undefined) {
    return null;
  }

  if (typeof subtitle !== "string") {
    throw new Error("Banner subtitle must be a string");
  }

  const trimmedSubtitle = subtitle.trim();

  if (trimmedSubtitle.length === 0) {
    return null;
  }

  if (trimmedSubtitle.length > 500) {
    throw new Error("Banner subtitle must not exceed 500 characters");
  }

  return trimmedSubtitle;
}

/**
 * Validates banner image object contains required fields and allowed MIME types.
 */
export function validateBannerImage(image: unknown): boolean {
  if (!image) {
    throw new Error("Banner image is required");
  }

  const mediaObj = image as Record<string, unknown>;

  if (!mediaObj.id || typeof mediaObj.id !== "number") {
    throw new Error("Banner image must have a valid ID");
  }

  if (!mediaObj.url || typeof mediaObj.url !== "string") {
    throw new Error("Banner image must have a valid URL");
  }

  if (!mediaObj.mime || typeof mediaObj.mime !== "string") {
    throw new Error("Banner image must have a valid MIME type");
  }

  const validImageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validImageMimes.includes(mediaObj.mime as string)) {
    throw new Error(`Banner image must be an image file. Received: ${mediaObj.mime}`);
  }

  return true;
}

/**
 * Validates complete banner payload by running field validations sequentially.
 */
export function validateBannerData(bannerData: unknown): {
  bannerTitle: string;
  bannerSubtitle: string | null;
  bannerImage: unknown;
} {
  if (!bannerData || typeof bannerData !== "object") {
    throw new Error("Banner data must be an object");
  }

  const data = bannerData as Record<string, unknown>;

  const bannerTitle = validateBannerTitle(data.bannerTitle);
  const bannerSubtitle = validateBannerSubtitle(data.bannerSubtitle);

  validateBannerImage(data.bannerImage);

  return {
    bannerTitle,
    bannerSubtitle,
    bannerImage: data.bannerImage,
  };
}

/**
 * Sanitizes banner title by trimming whitespace and escaping HTML-sensitive characters.
 */
export function sanitizeBannerTitle(title: string): string {
  return title
    .trim()
    .replace(/[<>]/g, "")
    .replace(/["']/g, (match) => (match === '"' ? "&quot;" : "&#39;"))
    .substring(0, 255);
}

/**
 * Sanitizes banner subtitle while preserving line breaks and enforcing length constraint.
 */
export function sanitizeBannerSubtitle(subtitle: string): string {
  return subtitle
    .trim()
    .replace(/[<>]/g, "")
    .replace(/["']/g, (match) => (match === '"' ? "&quot;" : "&#39;"))
    .substring(0, 500);
}

/**
 * Formats banner data for API response.
 * Ensures consistent structure across all endpoints.
 */
export function formatBannerResponse(institution: Record<string, unknown>): Record<string, unknown> {
  return {
    id: institution.id,
    name: institution.name,
    slug: institution.slug,
    bannerTitle: institution.bannerTitle,
    bannerSubtitle: institution.bannerSubtitle,
    bannerImage: institution.bannerImage,
    createdAt: institution.createdAt,
    updatedAt: institution.updatedAt,
  };
}

/**
 * Checks if institution has complete banner data.
 * Useful for validation before returning to frontend.
 */
export function hasBannerData(institution: Record<string, unknown>): boolean {
  return (
    "bannerTitle" in institution &&
    institution.bannerTitle !== null &&
    "bannerImage" in institution &&
    institution.bannerImage !== null
  );
}

/**
 * Creates a cache key for banner queries.
 * Useful for implementing caching strategies.
 */
export function getBannerCacheKey(slug: string): string {
  return `institution:banner:${slug}`;
}

/**
 * Calculates image aspect ratio from dimensions.
 * Useful for frontend responsive image sizing.
 */
export function calculateImageAspectRatio(width?: number, height?: number): string {
  if (!width || !height) {
    return "16/9"; // Default to 16:9
  }

  const ratio = width / height;

  // Return common aspect ratios
  if (Math.abs(ratio - 16 / 9) < 0.01) return "16/9";
  if (Math.abs(ratio - 4 / 3) < 0.01) return "4/3";
  if (Math.abs(ratio - 1) < 0.01) return "1/1";
  if (Math.abs(ratio - 3 / 2) < 0.01) return "3/2";

  // Return custom ratio
  return `${width}/${height}`;
}
