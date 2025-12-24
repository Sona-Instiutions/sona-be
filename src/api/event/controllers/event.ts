/**
 * event controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::event.event", ({ strapi }) => ({
  async incrementView(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.documents("api::event.event").findOne({
      documentId: id,
    });

    if (!entity) {
      return ctx.notFound("Event not found");
    }

    const updatedEntity = await strapi.documents("api::event.event").update({
      documentId: id,
      data: {
        viewCount: (entity.viewCount || 0) + 1,
      },
    });

    return updatedEntity;
  },

  /**
   * Get all approved comments for an event.
   * Comments are stored as nested components.
   */
  async getComments(ctx) {
    const { id } = ctx.params;

    const event = await strapi.documents("api::event.event").findOne({
      documentId: id,
      populate: ["comments"],
    });

    if (!event) {
      return ctx.notFound("Event not found");
    }

    // Return only approved comments
    const approvedComments = (event.comments || []).filter((c: any) => c.status === "approved");

    // Nest comments
    const commentMap = new Map();
    const rootComments = [];

    // First pass: Add all comments to map
    approvedComments.forEach((comment: any) => {
      comment.replies = [];
      commentMap.set(comment.documentId || comment.id.toString(), comment);
    });

    // Second pass: Link children to parents
    approvedComments.forEach((comment: any) => {
      if (comment.parentComment && commentMap.has(comment.parentComment)) {
        const parent = commentMap.get(comment.parentComment);
        parent.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    return { data: rootComments };
  },

  /**
   * Add a new comment to an event.
   * Comments are appended to the repeatable component array.
   */
  async addComment(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!data || !data.authorName || !data.authorEmail || !data.content) {
      return ctx.badRequest("Missing required comment fields");
    }

    const event = await strapi.documents("api::event.event").findOne({
      documentId: id,
      populate: ["comments"],
    });

    if (!event) {
      return ctx.notFound("Event not found");
    }

    const newComment = {
      ...data,
      status: "pending", // Always pending for moderation
      createdAt: new Date().toISOString(),
    };

    const updatedEvent = await strapi.documents("api::event.event").update({
      documentId: id,
      data: {
        comments: [...(event.comments || []), newComment],
      },
    });

    return { data: newComment };
  },

  /**
   * Get search suggestions for events.
   * Optimized for lightweight autocomplete.
   */
  async suggestions(ctx) {
    const q = ctx.query.q;
    const limit = parseInt(ctx.query.limit as string) || 8;

    if (typeof q !== "string" || q.length < 3) {
      return { data: [] };
    }

    const searchTerm = q as string;

    const entities = await strapi.documents("api::event.event").findMany({
      filters: {
        $or: [{ title: { $containsi: searchTerm } }, { excerpt: { $containsi: searchTerm } }],
      },
      fields: ["title", "slug", "eventDate", "excerpt"],
      populate: {
        thumbnailImage: {
          fields: ["url", "formats"],
        },
      },
      limit: limit,
      sort: { eventDate: "desc" },
    });

    return { data: entities };
  },

  async find(ctx) {
    // Enhanced find can be added here if needed, or rely on default filtering
    // For now, using default implementation which supports filters/sort/pagination
    return super.find(ctx);
  },

  async findOne(ctx) {
    return super.findOne(ctx);
  },
}));
