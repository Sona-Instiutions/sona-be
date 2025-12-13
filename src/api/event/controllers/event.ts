/**
 * event controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  async incrementView(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.documents('api::event.event').findOne({
        documentId: id,
    });
    
    if (!entity) {
      return ctx.notFound('Event not found');
    }

    const updatedEntity = await strapi.documents('api::event.event').update({
        documentId: id,
        data: {
            viewCount: (entity.viewCount || 0) + 1,
        }
    });

    return updatedEntity;
  },

  async find(ctx) {
      // Enhanced find can be added here if needed, or rely on default filtering
      // For now, using default implementation which supports filters/sort/pagination
      return super.find(ctx);
  },

  async findOne(ctx) {
      return super.findOne(ctx);
  }
}));

