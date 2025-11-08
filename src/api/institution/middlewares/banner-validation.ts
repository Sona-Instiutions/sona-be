/**
 * Banner validation middleware for institution endpoints.
 * Validates banner data on create and update operations.
 */

import { validateBannerData, sanitizeBannerTitle, sanitizeBannerSubtitle } from "../utils/banner-helpers";

interface BannerData {
  bannerTitle?: string;
  bannerSubtitle?: string | null;
  bannerImage?: unknown;
}

interface RequestContext {
  body?: {
    data?: BannerData;
  };
}

/**
 * Validates and sanitizes banner data in request body.
 * Runs on POST (create) and PUT (update) operations.
 */
export async function validateBannerMiddleware(ctx: RequestContext) {
  const bannerData = ctx.body?.data;

  // Skip validation if no banner data present (e.g., updating only non-banner fields)
  if (!bannerData || (!bannerData.bannerTitle && !bannerData.bannerImage)) {
    return;
  }

  try {
    // Validate banner fields
    const validated = validateBannerData(bannerData);

    // Sanitize string fields
    const sanitized = {
      bannerTitle: sanitizeBannerTitle(validated.bannerTitle),
      bannerSubtitle: validated.bannerSubtitle ? sanitizeBannerSubtitle(validated.bannerSubtitle) : null,
      bannerImage: validated.bannerImage,
    };

    // Update request body with validated/sanitized data
    if (ctx.body && ctx.body.data) {
      ctx.body.data.bannerTitle = sanitized.bannerTitle;
      ctx.body.data.bannerSubtitle = sanitized.bannerSubtitle;
      ctx.body.data.bannerImage = sanitized.bannerImage;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Banner validation failed";
    throw new Error(`Banner validation error: ${message}`);
  }
}
