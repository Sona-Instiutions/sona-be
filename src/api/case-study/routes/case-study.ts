/**
 * case-study router
 */

import { factories } from '@strapi/strapi';

// @ts-ignore - Content type will be available at runtime
export default factories.createCoreRouter('api::case-study.case-study');

