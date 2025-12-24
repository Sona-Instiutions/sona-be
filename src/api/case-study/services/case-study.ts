/**
 * case-study service
 */

import { factories } from '@strapi/strapi';

// @ts-ignore - Content type will be available at runtime
export default factories.createCoreService('api::case-study.case-study');

