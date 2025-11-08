# Work Item: Institution Content & Banner Platform

**IDs:**

- WI-001-BE-INSTITUTIONS — Create Institution Content Type & APIs _(Status: In Progress)_
- WI-002-BE-INSTITUTION-BANNER — Enhance Institution Schema with Banner Fields and API Integration _(Status: Completed)_  
  **Priority:** High  
  **Milestone:** Phase 1 Foundation  
  **Owner:** Backend Team

---

## Overview

Unify the backend foundation for institution detail experiences by delivering a Strapi-powered content model, REST APIs, and operational tooling that support dynamic institution pages and the reusable banner module. This combined work item covers the core institution collection type, banner schema enhancements, permissions, setup guidance, and the complete API contract consumed by frontend services.

---

## Requirements

### Content Type Foundation (WI-001)

#### Functional Requirements

- Create the `institution` content type in Strapi with fields `id`, `name`, and `slug`.
- Enforce uniqueness and required validation on `name` and `slug`, with automatic timestamping.
- Expose REST endpoints:
  - `GET /api/institutions` with pagination support.
  - `GET /api/institutions/:id` for single record retrieval.
  - Slug-based filtering via query parameters (`filters[slug][$eq]`).
- Configure public read permissions and admin-only write permissions across all endpoints.
- Provide typed, documented API responses for frontend integration.

#### Non-Functional Requirements

- Slug lookups respond in < 100ms; list endpoint < 200ms under nominal load.
- Documentation accompanies schema and API contracts.
- CRUD flows validated through Strapi admin and automated/manual API tests.

### Banner Schema & API Enhancements (WI-002)

#### Functional Requirements

- Add banner-specific fields to the `institution` content type:
  - `bannerImage` (required media, images only).
  - `bannerTitle` (required string, max 255 characters).
  - `bannerSubtitle` (optional text, max 500 characters).
- Return populated banner media objects via `?populate=bannerImage` in list and detail endpoints.
- Preserve backward compatibility for consumers that do not request banner fields.
- Guarantee public read access to banner data, with admin-only write operations.
- Maintain complete Strapi media metadata (URL, formats, dimensions, MIME type) in responses.

#### Non-Functional Requirements

- Media field indexed and optimized for performant queries and responsive formats.
- Data integrity via Strapi-managed media lifecycle, cascading deletes, and relational constraints.
- Schema additions documented with migration guidance and sample data.
- Security posture unchanged: no sensitive information exposed, write access restricted to admins.

### Operational Requirements

- Provide step-by-step setup instructions for administrators to verify schema, configure permissions, populate banner data, and test APIs.
- Supply troubleshooting guidance for common Strapi issues (missing fields, upload failures, null banner data).
- Document performance, caching, and maintenance recommendations for media assets.

---

## Technical Specifications

### Schema Definition

Combined collection type definition highlighting banner attributes:

```json
{
  "kind": "collectionType",
  "collectionName": "institutions",
  "info": {
    "singularName": "institution",
    "pluralName": "institutions",
    "displayName": "Institution"
  },
  "options": {
    "increments": true,
    "timestamps": true,
    "draftAndPublish": false
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 255
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true,
      "unique": true
    },
    "bannerImage": {
      "type": "media",
      "multiple": false,
      "required": true,
      "allowedTypes": ["images"]
    },
    "bannerTitle": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "bannerSubtitle": {
      "type": "text",
      "required": false,
      "maxLength": 500
    }
  }
}
```

### File Structure

```
/Users/vishal/Developer/sona/sona-be/src/api/institution/
├── content-types/
│   └── institution/
│       └── schema.json
├── controllers/
│   └── institution.ts
├── services/
│   └── institution.ts
└── routes/
    └── institution.ts
```

### Backend Components

- **Controller:** Uses Strapi core controller factory (`createCoreController`) to expose standard CRUD operations.
- **Service:** Extends Strapi core service (`createCoreService`) for any custom business logic or population defaults.
- **Router:** Generated via Strapi core router (`createCoreRouter`) to register REST endpoints.
- **Middleware / Utilities:** Banner validation housed in `sona-be/src/api/institution/middlewares/banner-validation.ts` and shared utilities in `sona-be/src/api/institution/utils/banner-helpers.ts`.

### Permissions Configuration

| Endpoint                       | Public | Authenticated | Admin |
| ------------------------------ | ------ | ------------- | ----- |
| `GET /api/institutions`        | ✓      | ✓             | ✓     |
| `GET /api/institutions/:id`    | ✓      | ✓             | ✓     |
| `POST /api/institutions`       | ✗      | ✗             | ✓     |
| `PUT /api/institutions/:id`    | ✗      | ✗             | ✓     |
| `DELETE /api/institutions/:id` | ✗      | ✗             | ✓     |

Banner fields inherit the same permission model as the parent content type.

### Media Field Integration

- Banner images are uploaded to Strapi's media library (`/public/uploads`).
- Strapi generates responsive formats (`thumbnail`, `small`, `medium`, `large`) automatically.
- Media metadata (id, name, alternativeText, width, height, MIME type, size, URLs) is serialized for frontend consumption.
- Updating a banner image replaces the previous media asset, honoring Strapi's lifecycle hooks.

### API Architecture

- **Base URL:** `http://localhost:1337/api`
- REST endpoints adhere to ADR 004 with `{ data, meta }` envelopes.
- Banner population is opt-in via `populate=bannerImage` to maintain control over payload size.
- Slug-based lookup performed with filter query `filters[slug][$eq]=<slug>`.

---

## Implementation Steps

### Content Type Foundation (In Progress)

1. [ ] Create institution content type schema with `name` and `slug` definitions.
2. [ ] Generate default controller, service, and router via Strapi CLI or manual configuration.
3. [ ] Configure public read permissions (find, findOne) within Strapi admin.
4. [ ] Seed sample institutions for local development and testing.
5. [ ] Document API contracts within this work item.
6. [ ] Obtain peer review and approval.

### Banner Enhancements (Completed)

1. [x] Extend schema with `bannerImage`, `bannerTitle`, and `bannerSubtitle`.
2. [x] Validate media uploads and enforce length constraints via schema and middleware.
3. [x] Ensure `populate=bannerImage` returns full media object metadata.
4. [x] Document schema, API responses, and migration guidance.
5. [x] Verify Strapi admin surfaces the new fields with required validation.
6. [x] Update backend utilities and middlewares for banner validation.

### Setup & Verification Workflow

1. Verify schema changes through Strapi Content-Type Builder.
2. Configure public and authenticated role permissions for find/findOne actions.
3. Confirm Super Admin retains full CRUD privileges.
4. Populate banner data for existing institutions (image, title, optional subtitle).
5. Test REST endpoints via curl/Postman with population and slug filters.
6. Validate frontend integration by loading `/institutions/<slug>` once environment variables are configured.

---

## Definition of Done

### WI-001-BE-INSTITUTIONS

- [ ] Institution content type available and visible in Strapi with required validations.
- [ ] CRUD flows operate without errors via admin and REST API.
- [ ] Slug filtering operational and performant.
- [ ] Public read endpoints accessible without authentication.
- [ ] Frontend fetches institutions by slug using standardized response structure.
- [ ] Documentation (this file) reflects latest contract and setup steps.
- [ ] Strapi logs free of errors during smoke tests.

### WI-002-BE-INSTITUTION-BANNER (Completed)

- [x] Banner schema fields deployed and enforced.
- [x] Banner media populated and returned via REST API.
- [x] Validation prevents missing required banner data.
- [x] Frontend banner module renders using populated data.
- [x] Documentation includes schema updates, API reference, and setup instructions.
- [x] Regression tests confirm no impact to existing endpoints.

---

## Setup & Configuration Guide

### Prerequisites

- Strapi v5 OSS running locally or in development.
- Admin credentials with Super Admin privileges.
- At least one institution record for validation.

### Step 1: Verify Schema Changes

1. Open **Settings → Content-Types Builder → Institution**.
2. Confirm fields: `name`, `slug`, `bannerImage`, `bannerTitle`, `bannerSubtitle`.
3. Restart Strapi if fields do not appear, then hard refresh the browser.

### Step 2: Configure Permissions

- **Public Role:** Enable `find` and `findOne` for Institution.
- **Authenticated Role:** Enable `find` and `findOne`.
- **Super Admin Role:** Ensure all CRUD permissions remain enabled.

### Step 3: Populate Banner Data

1. Navigate to **Content Manager → Institution**.
2. Edit each institution:
   - Upload banner image (recommended 1920x1080, < 500KB).
   - Enter banner title (≤ 255 characters).
   - Optionally enter banner subtitle (≤ 500 characters).
3. Save records to persist banner data.

### Step 4: Test API Endpoints

```bash
# List institutions with banner media
curl -X GET http://localhost:1337/api/institutions?populate=bannerImage

# Retrieve single institution by ID with banner
curl -X GET http://localhost:1337/api/institutions/1?populate=bannerImage

# Retrieve institution by slug with banner
curl -X GET "http://localhost:1337/api/institutions?filters[slug][$eq]=sona-tech-school&populate=bannerImage"
```

Validate that `bannerImage.url` resolves at `http://localhost:1337/uploads/...`.

### Step 5: Test Frontend Integration

1. Ensure environment variables are set:

```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_SERVER_URL=http://localhost:1337
```

2. Visit `http://localhost:3050/institutions/sona-tech-school`.
3. Confirm banner renders with image, title, subtitle, and responsive behavior without console errors.

### Validation Checklist

- Schema includes all banner fields with correct constraints.
- Admin UI enforces required fields and max lengths.
- REST endpoints return populated banner data with public access.
- Frontend consumes banner data successfully.

---

## API Reference

### Base URL

```
http://localhost:1337/api
```

### Endpoints

#### List All Institutions

```
GET /institutions?populate=bannerImage
```

- Supports pagination (`pagination[page]`, `pagination[pageSize]`), sorting, and filters.
- Returns array of institutions with populated banner media.

#### Get Institution by ID

```
GET /institutions/:id?populate=bannerImage
```

- Retrieves single institution with banner fields.

#### Get Institution by Slug

```
GET /institutions?filters[slug][$eq]=<slug>&populate=bannerImage
```

- Primary lookup for frontend server-side rendering.

#### Create Institution (Admin)

```
POST /institutions
Authorization: Bearer <api-token>
Content-Type: application/json
```

```json
{
  "data": {
    "name": "SONA Finishing School",
    "bannerTitle": "Welcome to SONA FINISHING SCHOOL",
    "bannerSubtitle": "Excellence in Professional Development",
    "bannerImage": 3
  }
}
```

#### Update Institution (Admin)

```
PUT /institutions/:id
Authorization: Bearer <api-token>
```

```json
{
  "data": {
    "bannerTitle": "Updated Banner Title",
    "bannerSubtitle": "Updated subtitle text",
    "bannerImage": 4
  }
}
```

#### Delete Institution (Admin)

```
DELETE /institutions/:id
Authorization: Bearer <api-token>
```

### Response Structure Example

```json
{
  "data": [
    {
      "id": 1,
      "name": "SONA Tech School",
      "slug": "sona-tech-school",
      "bannerTitle": "Welcome to SONA TECH SCHOOL",
      "bannerSubtitle": "Pioneering Technology Education for Tomorrow's Digital Leaders",
      "bannerImage": {
        "id": 1,
        "name": "banner-tech-school.jpg",
        "alternativeText": "SONA Tech School Campus",
        "caption": "Main campus building with students",
        "width": 1920,
        "height": 1080,
        "mime": "image/jpeg",
        "size": 245760,
        "url": "/uploads/banner_abc123def456.jpg",
        "formats": {
          "thumbnail": { "...": "..." },
          "small": { "...": "..." },
          "medium": { "...": "..." },
          "large": { "...": "..." }
        },
        "provider": "local",
        "related": [],
        "createdAt": "2025-11-08T10:00:00.000Z",
        "updatedAt": "2025-11-08T10:00:00.000Z"
      },
      "createdAt": "2025-11-08T10:00:00.000Z",
      "updatedAt": "2025-11-08T10:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

### Field Specifications

- **bannerImage (Media, required):** Accepts single image; metadata described above.
- **bannerTitle (String, required):** ≤ 255 characters.
- **bannerSubtitle (Text, optional):** ≤ 500 characters; supports multiline text.

### Error Responses

- **400 ValidationError:** Missing required banner fields or invalid payload.
- **401 Unauthorized:** Missing/invalid auth token for write endpoints.
- **403 Forbidden:** Insufficient permissions.
- **404 Not Found:** Institution does not exist.
- **409 Conflict:** Duplicate unique field (name or slug).
- **500 ApplicationError:** Server-side failure.

### Query Examples

- `GET /institutions?populate=bannerImage&sort=name:asc`
- `GET /institutions?populate=bannerImage&pagination[page]=2&pagination[pageSize]=10`
- `GET /institutions?filters[name][$contains]=SONA&populate=bannerImage`
- `GET /institutions/1`
- `GET /institutions?filters[slug][$eq]=sona-tech-school&populate=bannerImage`

### Rate Limits & CORS

- No rate limiting in development; target 100 read and 10 write requests per minute per IP in production.
- Default CORS headers allow all origins and standard methods/headers.

### Versioning

- Current API implicitly v1; future iterations will adopt `/api/v2/institutions`.

---

## Testing Checklist

- [ ] Schema contains banner fields with correct validation and media constraints.
- [ ] Admin UI enforces required fields and max lengths.
- [ ] Public `GET` endpoints return banner data when populated.
- [ ] Slug-based filter returns correct institution.
- [ ] CRUD operations validated via Strapi admin and curl/Postman.
- [ ] Banner image URLs resolve and serve optimized formats.
- [ ] Frontend renders banner without console errors.
- [ ] Error handling tested for missing banner data and permission changes.

---

## Troubleshooting

- **Schema fields not visible:** Restart Strapi, clear cache, hard refresh, inspect browser console.
- **Image upload fails:** Verify file format (JPG/PNG/WebP), size (< 10MB), permissions, and disk space.
- **API returns `bannerImage: null`:** Confirm image upload, populate parameter, media library status, and consider restarting Strapi.
- **Frontend banner missing:** Check console errors, environment variables, absolute URL construction, and CORS configuration.
- **403 Forbidden responses:** Reconfirm public role permissions for institution endpoints.

---

## Performance Optimization

- Pre-optimize images (resize to 1920x1080, compress with ImageOptim/TinyPNG, prefer WebP).
- Configure reverse proxy caching for `/uploads` (e.g., 30-day immutable cache headers).
- Monitor Strapi logs for query performance and media usage.

---

## Maintenance

- Monitor media library size and prune unused assets regularly.
- Include banner data checks in routine QA.
- Backup database and uploads directory prior to schema changes.
- Track API usage through Strapi logs (`GET /api/institutions?populate=bannerImage`).

---

## Dependencies

- Strapi v5 OSS on Node.js 22 with SQLite (dev) or PostgreSQL (prod).
- Strapi media library plugin (default).
- Backend ADRs (001–006) for architecture guidance.
- Frontend consumer located in `sona-ui` for verification.

---

## Related Documents

- `specs/blueprints/architecture-decisions.md`
- `specs/blueprints/prd.md`
- `specs/work-items/institution-development.md` (frontend)
- `specs/work-items/institution-banner-api-development.md` (historical reference)
- `specs/blueprints/institution-api-reference.md` (superseded)
- `specs/blueprints/institution-banner-setup-guide.md` (superseded)

---

## Notes

- Slug UID derives from `name`; ensure descriptive institution names.
- When replacing banner images, Strapi removes old media references.
- Consider future enhancements such as multiple banner variants or cropping pipelines.
- Document any environment-specific URL handling to keep frontend integrations aligned.

## Additional Resources

- Strapi Media Library: https://docs.strapi.io/user-docs/media-library
- Content-Type Builder: https://docs.strapi.io/user-docs/content-types-builder
- Permissions Documentation: https://docs.strapi.io/user-docs/users-roles-permissions
