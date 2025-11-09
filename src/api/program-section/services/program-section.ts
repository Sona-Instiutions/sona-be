/**
 * program-section service
 */

import { factories } from "@strapi/strapi";

const DEFAULT_POPULATE = {
  icon: true,
  program: true,
};

type FindParams = Record<string, unknown> & { populate?: unknown };

const resolvePopulate = (populate: unknown) => (populate ?? DEFAULT_POPULATE) as typeof DEFAULT_POPULATE | unknown;

export default factories.createCoreService("api::program-section.program-section", () => ({
  async find(params: FindParams = {}) {
    const { populate, ...rest } = params;
    const populatedParams = {
      ...rest,
      populate: resolvePopulate(populate),
    };

    return super.find(populatedParams);
  },

  async findOne(entityId, params: FindParams = {}) {
    const { populate, ...rest } = params;
    const populatedParams = {
      ...rest,
      populate: resolvePopulate(populate),
    };

    return super.findOne(entityId, populatedParams);
  },
}));

