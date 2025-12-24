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
    const comments = (event.comments || []).filter((c: any) => c.status === "approved");

    return { data: comments };
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

  async find(ctx) {
    // Enhanced find can be added here if needed, or rely on default filtering
    // For now, using default implementation which supports filters/sort/pagination
    return super.find(ctx);
  },

  async findOne(ctx) {
    return super.findOne(ctx);
  },
}));
