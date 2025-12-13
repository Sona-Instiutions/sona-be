/**
 * event-comment controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::event-comment.event-comment', ({ strapi }) => ({
  async create(ctx) {
    // Capture IP and User Agent
    const ipAddress = ctx.request.ip;
    const userAgent = ctx.request.header['user-agent'];

    // Force status to pending and add metadata
    // Strapi 5 usually receives { data: { ... } }
    if (ctx.request.body && ctx.request.body.data) {
        ctx.request.body.data.status = 'pending';
        ctx.request.body.data.ipAddress = ipAddress;
        ctx.request.body.data.userAgent = userAgent;
    }

    // Call default create implementation
    const response = await super.create(ctx);
    
    return response;
  },

  async find(ctx) {
     // If you want to enforce approved-only for public, you could add logic here.
     // But typically the frontend requests with filters[status][$eq]=approved.
     // For strict enforcement, we'd check the user role.
     return super.find(ctx);
  }
}));

