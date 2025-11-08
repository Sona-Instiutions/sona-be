import type { Core } from "@strapi/strapi";

/**
 * Ensures the public role has read permissions for the about-institute collection.
 *
 * @param strapi - Strapi instance used to interact with the permission tables.
 */
async function ensureAboutInstitutePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
    populate: { permissions: true },
  });

  if (!publicRole) {
    strapi.log.warn("Public role not found. Skipping about-institute permission setup.");
    return;
  }

  const requiredActions = ["find", "findOne"];

  await Promise.all(
    requiredActions.map(async (action) => {
      const permissionAction = `api::about-institute.about-institute.${action}`;

      const existingPermission = await strapi
        .db
        .query("plugin::users-permissions.permission")
        .findOne({
          where: {
            action: permissionAction,
            role: publicRole.id,
          },
        });

      if (!existingPermission) {
        await strapi.db.query("plugin::users-permissions.permission").create({
          data: {
            action: permissionAction,
            role: publicRole.id,
            enabled: true,
          },
        });
      } else if (!existingPermission.enabled) {
        await strapi.db.query("plugin::users-permissions.permission").update({
          where: { id: existingPermission.id },
          data: { enabled: true },
        });
      }
    }),
  );
}

export default {
  /**
   * An asynchronous register function that runs before
   * the application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * the application gets started.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureAboutInstitutePublicPermissions(strapi);
  },
};
