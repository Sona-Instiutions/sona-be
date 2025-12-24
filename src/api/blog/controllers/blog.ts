/**
 * blog controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::blog.blog", ({ strapi }) => ({
  async incrementView(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.documents("api::blog.blog").findOne({
      documentId: id,
    });

    if (!entity) {
      return ctx.notFound("Blog not found");
    }

    const updatedEntity = await strapi.documents("api::blog.blog").update({
      documentId: id,
      data: {
        viewCount: (entity.viewCount || 0) + 1,
      },
    });

    return updatedEntity;
  },

  /**
   * Get all approved comments for a blog.
   * Comments are stored as nested components.
   */
  async getComments(ctx) {
    const { id } = ctx.params;

    const blog = await strapi.documents("api::blog.blog").findOne({
      documentId: id,
      populate: ["comments"],
    });

    if (!blog) {
      return ctx.notFound("Blog not found");
    }

    // Return only approved comments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const approvedComments = (blog.comments || []).filter((c: any) => c.status === "approved");

    const commentMap = new Map();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootComments: any[] = [];

    // First pass: Add all comments to map
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    approvedComments.forEach((comment: any) => {
      comment.replies = [];
      commentMap.set(comment.documentId || comment.id.toString(), comment);
    });

    // Second pass: Link children to parents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
   * Add a new comment to a blog.
   * Comments are appended to the repeatable component array.
   */
  async addComment(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!data || !data.authorName || !data.authorEmail || !data.content) {
      return ctx.badRequest("Missing required comment fields");
    }

    const blog = await strapi.documents("api::blog.blog").findOne({
      documentId: id,
      populate: ["comments"],
    });

    if (!blog) {
      return ctx.notFound("Blog not found");
    }

    const newComment = {
      ...data,
      status: "pending", // Always pending for moderation
      createdAt: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedBlog = await strapi.documents("api::blog.blog").update({
      documentId: id,
      data: {
        comments: [...(blog.comments || []), newComment],
      },
    });

    return { data: newComment };
  },

  /**
   * Get search suggestions for blogs.
   * Optimized for lightweight autocomplete.
   */
  async suggestions(ctx) {
    const q = ctx.query.q;
    const limit = parseInt(ctx.query.limit as string) || 8;

    if (typeof q !== "string" || q.length < 3) {
      return { data: [] };
    }

    const searchTerm = q as string;

    const entities = await strapi.documents("api::blog.blog").findMany({
      filters: {
        $or: [{ title: { $containsi: searchTerm } }, { excerpt: { $containsi: searchTerm } }],
      },
      fields: ["title", "slug", "publishedDate", "excerpt"],
      populate: {
        thumbnail: {
          fields: ["url", "formats"],
        },
      },
      limit: limit,
      sort: { publishedDate: "desc" },
    });

    return { data: entities };
  },
}));
