/**
 * case-study controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::case-study.case-study', ({ strapi }) => ({
  /**
   * Custom action to increment view count
   */
  async incrementViewCount(ctx) {
    const { id } = ctx.params;
    
    // @ts-ignore
    const entity = await strapi.service('api::case-study.case-study').findOne(id);
    
    if (!entity) {
      return ctx.notFound('Case study not found');
    }

    // @ts-ignore
    const updatedEntity = await strapi.service('api::case-study.case-study').update(id, {
      data: {
        viewCount: (entity.viewCount || 0) + 1,
      },
    });

    return this.transformResponse(updatedEntity);
  },

  /**
   * Custom action to add a comment
   */
  async addComment(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!data) {
      return ctx.badRequest('Missing comment data');
    }

    // @ts-ignore
    const entity = await strapi.service('api::case-study.case-study').findOne(id, {
      populate: ['comments'],
    });

    if (!entity) {
      return ctx.notFound('Case study not found');
    }

    const newComment = {
      ...data,
      publishedAt: new Date(),
      status: 'pending', // Pending moderation
      likes: 0,
    };

    const updatedComments = [...(entity.comments || []), newComment];

    // @ts-ignore
    const updatedEntity = await strapi.service('api::case-study.case-study').update(id, {
      data: {
        comments: updatedComments,
      },
    });

    return this.transformResponse(updatedEntity);
  },
}));
