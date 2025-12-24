import type { Core } from "@strapi/strapi";
import { seedEvents } from "./scripts/seed-events";
import { seedBlogs } from "./scripts/seed-blogs";
import { seedCaseStudies } from "./scripts/seed-case-studies";

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

      const existingPermission = await strapi.db.query("plugin::users-permissions.permission").findOne({
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
    })
  );
}

/**
 * Ensures the public role has read permissions for the value-proposition collection.
 *
 * @param strapi - Strapi instance used to interact with the permission tables.
 */
async function ensureValuePropositionPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
    populate: { permissions: true },
  });

  if (!publicRole) {
    strapi.log.warn("Public role not found. Skipping value-proposition permission setup.");
    return;
  }

  const requiredActions = ["find", "findOne"];

  await Promise.all(
    requiredActions.map(async (action) => {
      const permissionAction = `api::value-proposition.value-proposition.${action}`;

      const existingPermission = await strapi.db.query("plugin::users-permissions.permission").findOne({
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
    })
  );
}

/**
 * Ensures the public role has read permissions for the achievement collection.
 *
 * @param strapi - Strapi instance used to interact with the permission tables.
 */
async function ensureAchievementPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
    populate: { permissions: true },
  });

  if (!publicRole) {
    strapi.log.warn("Public role not found. Skipping achievement permission setup.");
    return;
  }

  const requiredActions = ["find", "findOne"];

  await Promise.all(
    requiredActions.map(async (action) => {
      const permissionAction = `api::achievement.achievement.${action}`;

      const existingPermission = await strapi.db.query("plugin::users-permissions.permission").findOne({
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
    })
  );
}

/**
 * Ensures the public role has read permissions for the campus-gallery-section collection.
 *
 * @param strapi - Strapi instance used to interact with the permission tables.
 */
async function ensureCampusGallerySectionPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
    populate: { permissions: true },
  });

  if (!publicRole) {
    strapi.log.warn("Public role not found. Skipping campus-gallery-section permission setup.");
    return;
  }

  const requiredActions = ["find", "findOne"];

  await Promise.all(
    requiredActions.map(async (action) => {
      const permissionAction = `api::campus-gallery-section.campus-gallery-section.${action}`;

      const existingPermission = await strapi.db.query("plugin::users-permissions.permission").findOne({
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
    })
  );
}

/**
 * Ensures the public role has permissions for the Events module.
 *
 * @param strapi - Strapi instance used to interact with the permission tables.
 */
async function ensureEventsModulePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
    populate: { permissions: true },
  });

  if (!publicRole) {
    strapi.log.warn("Public role not found. Skipping events module permission setup.");
    return;
  }

  const configs = [
    { type: "event", actions: ["find", "findOne", "incrementView"] },
    { type: "event-category", actions: ["find", "findOne"] },
    { type: "event-tag", actions: ["find", "findOne"] },
    { type: "event-comment", actions: ["create", "find"] }, // Create is public, Find allows fetching approved comments
  ];

  await Promise.all(
    configs.map(async (config) => {
      await Promise.all(
        config.actions.map(async (action) => {
          const permissionAction = `api::${config.type}.${config.type}.${action}`;

          const existingPermission = await strapi.db.query("plugin::users-permissions.permission").findOne({
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
        })
      );
    })
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
    await ensureValuePropositionPublicPermissions(strapi);
    await ensureAchievementPublicPermissions(strapi);
    await ensureCampusGallerySectionPublicPermissions(strapi);
    await ensureEventsModulePublicPermissions(strapi);

    // Check for seed data environment variable
    if (process.env.STRAPI_SEED_DATA === "true") {
      strapi.log.info("🚀 STRAPI_SEED_DATA is true, starting data seeding...");
      
      try {
        await seedEvents(strapi);
        await seedBlogs(strapi);
        await seedCaseStudies(strapi);
        strapi.log.info("✅ All data seeding completed successfully!");
      } catch (error) {
        strapi.log.error("❌ Data seeding failed:", error);
      }
    }
  },
};
