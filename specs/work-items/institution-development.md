# Work Item: Institution Platform & Value Proposition APIs

**IDs:**

- WI-001-BE-INSTITUTIONS — Create Institution Content Type & APIs _(Status: In Progress)_
- WI-002-BE-INSTITUTION-BANNER — Enhance Institution Schema with Banner Fields and API Integration _(Status: Completed)_
- WI-003-BE-INSTITUTION-VALUE-PROPOSITION — Introduce value proposition content type, relations, and REST endpoints _(Status: In Progress)_
  **Priority:** High  
  **Milestone:** Phase 1 Foundation  
  **Owner:** Backend Team

---

## Overview

Unify the backend foundation for comprehensive institution detail experiences by delivering a Strapi-powered content model, REST APIs, and operational tooling that support dynamic institution pages, the reusable banner module, and the value proposition hero section. This combined work item covers the core institution collection type, banner schema enhancements, value proposition content type with color-aware fields, permissions, setup guidance, and complete API contracts consumed by frontend services.

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

### Value Proposition Content Type (WI-003)

#### Functional Requirements

- Create `value-proposition` collection type with attributes:
  - `institution` (many-to-one relation) — required
  - `titlePrefix`, `titlePrefixColor` — optional string fields (≤ 100 / 50 chars)
  - `titleHighlight`, `titleHighlightColor` — optional string fields (≤ 100 / 50 chars)
  - `subtitle` — optional text (≤ 500 chars)
  - `backgroundImage` — optional single media (images only)
  - `propositions` — repeatable component `content.value-proposition-item`
- Create `content.value-proposition-item` component with:
  - `title` (required string, ≤ 100 chars)
  - `titleColor` (optional string, ≤ 50 chars)
  - `description` (required rich text)
  - `icon` (one-to-one relation `icon-badge`)
  - `order` (optional integer)
- Expose REST endpoints via Strapi core router/controller/service.
- Update `institution` content type with `valuePropositions` one-to-many relation.
- Configure public read permissions (`find`, `findOne`) while keeping write permissions admin-only.

#### Non-Functional Requirements

- Preserve performance parity with existing institution endpoints.
- Enforce validation for string length and relation requirements.
- Ensure color fields support CSS values or Tailwind class tokens without introducing security issues.
- Document schema, permissions, and setup steps for content editors.

### Operational Requirements (All Items)

- Provide step-by-step setup instructions for administrators to verify schema, configure permissions, populate data, and test APIs.
- Supply troubleshooting guidance for common Strapi issues (missing fields, upload failures, null data).
- Bootstrap public permissions automatically on Strapi startup (mirroring about-institute setup).
- Provide sample curl commands to verify API responses.
- Document performance, caching, and maintenance recommendations for media assets.

---

## Technical Specifications

### Institution Schema Definition

Combined collection type definition highlighting institution, banner, and value proposition attributes:

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
    },
    "valuePropositions": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::value-proposition.value-proposition"
    }
  }
}
```

### Value Proposition Schema Definition

```json
{
  "kind": "collectionType",
  "collectionName": "value_propositions",
  "info": {
    "singularName": "value-proposition",
    "pluralName": "value-propositions",
    "displayName": "Value Proposition"
  },
  "options": {
    "increments": true,
    "timestamps": true,
    "draftAndPublish": false
  },
  "attributes": {
    "institution": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::institution.institution",
      "required": true
    },
    "titlePrefix": {
      "type": "string",
      "maxLength": 100
    },
    "titlePrefixColor": {
      "type": "string",
      "maxLength": 50,
      "default": "white"
    },
    "titleHighlight": {
      "type": "string",
      "maxLength": 100
    },
    "titleHighlightColor": {
      "type": "string",
      "maxLength": 50,
      "default": "#fbbf24"
    },
    "subtitle": {
      "type": "text",
      "maxLength": 500
    },
    "backgroundImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "propositions": {
      "type": "component",
      "repeatable": true,
      "component": "content.value-proposition-item"
    }
  }
}
```

### Value Proposition Item Component

```json
{
  "collectionName": "components_content_value_proposition_items",
  "info": {
    "displayName": "Value Proposition Item",
    "icon": "square"
  },
  "options": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "titleColor": {
      "type": "string",
      "maxLength": 50
    },
    "description": {
      "type": "richtext",
      "required": true
    },
    "icon": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::icon-badge.icon-badge"
    },
    "order": {
      "type": "integer"
    }
  }
}
```

### Achievements & Recognition Schemas

- **Achievement collection type (`achievement`):** one-to-one with `institution`, supports title prefix/highlight colors, markdown description, and a repeatable `content.achievement-item` component (statistic, title, optional description, order).
- **Recognition section (`recognition-section`):** one-to-one with `institution`, exposes configurable background color and repeatable `content.recognition-item` entries (icon badge relation, title, description, order).
- Both schemas inherit public read permissions (`find`, `findOne`) configured during bootstrap.
- Sample data seeding is provided via `scripts/seed-institution-achievements.ts` to generate curl templates for achievements and recognition sections.

### Backend Components

#### Institution API
- **Controller:** Uses Strapi core controller factory (`createCoreController`) to expose standard CRUD operations.
- **Service:** Extends Strapi core service (`createCoreService`) for custom business logic or population defaults.
- **Router:** Generated via Strapi core router (`createCoreRouter`) to register REST endpoints.
- **Middleware / Utilities:** Banner validation in `middlewares/banner-validation.ts` and shared utilities in `utils/banner-helpers.ts`.

#### Value Proposition API
- **Controller:** Strapi core controller factory for CRUD operations with relation population.
- **Service:** Custom service to handle complex queries with nested population (propositions → icons).
- **Router:** Core router registering value proposition endpoints.

### Permissions Configuration

| Endpoint | Public | Authenticated | Admin |
| --- | --- | --- | --- |
| `GET /api/institutions` | ✓ | ✓ | ✓ |
| `GET /api/institutions/:id` | ✓ | ✓ | ✓ |
| `POST /api/institutions` | ✗ | ✗ | ✓ |
| `PUT /api/institutions/:id` | ✗ | ✗ | ✓ |
| `DELETE /api/institutions/:id` | ✗ | ✗ | ✓ |
| `GET /api/value-propositions` | ✓ | ✓ | ✓ |
| `GET /api/value-propositions/:id` | ✓ | ✓ | ✓ |
| `POST /api/value-propositions` | ✗ | ✗ | ✓ |
| `PUT /api/value-propositions/:id` | ✗ | ✗ | ✓ |
| `DELETE /api/value-propositions/:id` | ✗ | ✗ | ✓ |

Banner and value proposition fields inherit the same permission model as their parent content types.

### Media Field Integration

- Banner and value proposition images are uploaded to Strapi's media library (`/public/uploads`).
- Strapi generates responsive formats (`thumbnail`, `small`, `medium`, `large`) automatically.
- Media metadata (id, name, alternativeText, width, height, MIME type, size, URLs) is serialized for frontend consumption.
- Updating media replaces the previous asset, honoring Strapi's lifecycle hooks.

### API Architecture

- **Base URL:** `http://localhost:1337/api`
- REST endpoints adhere to ADR 004 with `{ data, meta }` envelopes.
- Banner population is opt-in via `populate=bannerImage` to maintain control over payload size.
- Value proposition population uses nested queries: `populate[propositions][populate]=icon&populate=backgroundImage`.
- Slug-based lookup performed with filter query `filters[slug][$eq]=<slug>`.
- Relations automatically surface on both ends (institution → valuePropositions and vice versa).

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

### Value Proposition Content Type (In Progress)

1. [ ] Create value-proposition collection type schema with all attributes.
2. [ ] Create value-proposition-item repeatable component schema.
3. [ ] Generate controller, service, and router for value-proposition API.
4. [ ] Update institution schema with `valuePropositions` one-to-many relation.
5. [ ] Configure public read permissions for value-proposition endpoints.
6. [ ] Bootstrap permissions on Strapi startup in `src/index.ts`.
7. [ ] Document schema, API responses, and setup guidance.
8. [ ] Seed sample value propositions with varied colors and icon relations.
9. [ ] Obtain peer review and approval.

### Achievement Content Type
1. [ ] Create `achievement` collection type and `content.achievement-item` component.
2. [ ] Link achievement to institution via one-to-one relation.
3. [ ] Enable public role read permissions (`find`, `findOne`).
4. [ ] Document API contract and seed workflow.

### Recognition Section Content Type
1. [ ] Create `recognition-section` collection type and `content.recognition-item` component.
2. [ ] Link recognition section to institution via one-to-one relation.
3. [ ] Enable public role read permissions (`find`, `findOne`).
4. [ ] Document API contract and seed workflow.

### Setup & Verification Workflow

1. Verify schema changes through Strapi Content-Type Builder.
2. Configure public and authenticated role permissions for find/findOne actions on both institution and value-proposition.
3. Confirm Super Admin retains full CRUD privileges.
4. Populate banner data for existing institutions (image, title, optional subtitle).
5. Populate value proposition data (title variants, colors, propositions with icons).
6. Populate achievement section with statistic cards and description copy.
7. Populate recognition section with icon badges, titles, and descriptions.
8. Test REST endpoints via curl/Postman with population and slug filters.
9. Validate frontend integration by loading `/institutions/<slug>` once environment variables are configured.

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

### WI-003-BE-INSTITUTION-VALUE-PROPOSITION

- [ ] Strapi Content-Type Builder displays the new collection type and component with correct validations.
- [ ] Public `GET /api/value-propositions` returns populated propositions, icons, and media.
- [ ] Admin role can create/edit value propositions with color fields and background imagery.
- [ ] Institution relation surfaces on both ends (content manager + API).
- [ ] Documentation (this file) includes setup, API reference, and troubleshooting notes.
- [ ] Smoke tests confirm public access without authentication errors.

### WI-004-BE-INSTITUTION-ACHIEVEMENTS

- [ ] Achievement content type and component available in Strapi with validations enforced.
- [ ] Public `GET /api/achievements` returns populated statistic cards.
- [ ] Admin role can create/edit achievements with markdown description and ordered cards.
- [ ] Institution relation exposes achievements in admin UI and API responses.
- [ ] Seed helper and API examples updated to cover achievements.

### WI-005-BE-INSTITUTION-RECOGNITION

- [ ] Recognition section content type available with background color and icon relation fields.
- [ ] Public `GET /api/recognition-sections` returns populated recognitions with icons.
- [ ] Admin role can create/edit recognition entries with custom colors.
- [ ] Institution relation exposes recognition sections in admin UI and API responses.
- [ ] Documentation updated with API reference and seeding guidance.

---

## Setup & Configuration Guide

### Prerequisites

- Strapi v5 OSS running locally or in development.
- Admin credentials with Super Admin privileges.
- At least one institution record for validation.
- Icon-badge content type already configured and populated.

### Step 1: Verify Schema Changes

1. Open **Settings → Content-Types Builder → Institution**.
2. Confirm fields: `name`, `slug`, `bannerImage`, `bannerTitle`, `bannerSubtitle`, `achievements`, `recognitions`, `valuePropositions`.
3. Open **Settings → Content-Types Builder → Value Proposition**.
4. Confirm fields: `institution`, `titlePrefix`, `titlePrefixColor`, `titleHighlight`, `titleHighlightColor`, `subtitle`, `backgroundImage`, `propositions`.
5. Open **Settings → Content-Types Builder → Achievement** to verify section attributes and the `Achievements` component fields.
6. Open **Settings → Content-Types Builder → Recognition Section** to verify background color and recognition component fields.
7. Restart Strapi if fields do not appear, then hard refresh the browser.

### Step 2: Configure Permissions

- **Public Role:** Enable `find` and `findOne` for Institution, Value Proposition, Achievement, and Recognition Section.
- **Authenticated Role:** Enable `find` and `findOne` for all public collections.
- **Super Admin Role:** Ensure all CRUD permissions remain enabled.

### Step 3: Populate Banner Data

1. Navigate to **Content Manager → Institution**.
2. Edit each institution:
   - Upload banner image (recommended 1920x1080, < 500KB).
   - Enter banner title (≤ 255 characters).
   - Optionally enter banner subtitle (≤ 500 characters).
3. Save records to persist banner data.

### Step 4: Populate Value Proposition Data

1. Navigate to **Content Manager → Value Proposition**.
2. Create new value proposition entries:
   - Select institution relation (required).
   - Enter title prefix (optional, default: "white" color).
   - Enter title highlight (optional, default: "#fbbf24" color).
   - Enter subtitle (optional, ≤ 500 chars).
   - Upload background image (optional, recommended 1920x1080).
   - Add 4–6 proposition items (repeatable):
     - Enter title (required, ≤ 100 chars).
     - Select color (optional).
     - Enter description as rich text (required).
     - Select icon from icon-badge (optional).
     - Set order (optional, for sorting).
3. Save records to persist value proposition data.

### Step 5: Test API Endpoints

```bash
# List institutions with banner media
curl -X GET http://localhost:1337/api/institutions?populate=bannerImage

# Retrieve single institution by ID with banner
curl -X GET http://localhost:1337/api/institutions/1?populate=bannerImage

# Retrieve institution by slug with banner
curl -X GET "http://localhost:1337/api/institutions?filters[slug][$eq]=sona-tech-school&populate=bannerImage"

# List value propositions with nested population
curl -X GET "http://localhost:1337/api/value-propositions?populate[propositions][populate]=icon&populate=backgroundImage"

# Retrieve value proposition by institution slug
curl -X GET "http://localhost:1337/api/value-propositions?filters[institution][slug][$eq]=sona-tech-school&populate[propositions][populate]=icon"

# Retrieve achievements for institution
curl -X GET "http://localhost:1337/api/achievements?filters[institution][slug][$eq]=sona-tech-school"

# Retrieve recognition section with icons populated
curl -X GET "http://localhost:1337/api/recognition-sections?filters[institution][slug][$eq]=sona-tech-school&populate[recognitions][populate]=icon"
```

Validate that `bannerImage.url` and `backgroundImage.url` resolve at `http://localhost:1337/uploads/...`.

### Step 6: Test Frontend Integration

1. Ensure environment variables are set:

```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_SERVER_URL=http://localhost:1337
```

2. Visit `http://localhost:3050/institutions/sona-tech-school`.
3. Confirm banner renders with image, title, subtitle, and responsive behavior without console errors.
4. Confirm value propositions section renders with cards, colors, and icons without console errors.

### Validation Checklist

- Schema includes all institution and value proposition fields with correct constraints.
- Admin UI enforces required fields and max lengths.
- REST endpoints return populated data with public access.
- Frontend consumes data successfully.
- Color overrides apply correctly in value proposition cards.

---

## API Reference

### Base URL

```
http://localhost:1337/api
```

### Institution Endpoints

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

#### Get Institution with Value Propositions

```
GET /institutions/:id?populate=bannerImage&populate=valuePropositions
```

- Retrieves institution with nested value propositions.

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

### Value Proposition Endpoints

#### List All Value Propositions

```
GET /value-propositions?populate[propositions][populate]=icon&populate=backgroundImage
```

- Supports pagination, sorting, and filters.
- Returns array of value propositions with nested propositions and icons.

#### Get Value Proposition by ID

```
GET /value-propositions/:id?populate[propositions][populate]=icon&populate=backgroundImage
```

- Retrieves single value proposition with nested structure.

#### Get Value Propositions by Institution Slug

```
GET /value-propositions?filters[institution][slug][$eq]=<slug>&populate[propositions][populate]=icon&populate=backgroundImage
```

- Frontend lookup for institution value proposition section.

#### Create Value Proposition (Admin)

```
POST /value-propositions
Authorization: Bearer <api-token>
Content-Type: application/json
```

```json
{
  "data": {
    "institution": 1,
    "titlePrefix": "Our",
    "titlePrefixColor": "white",
    "titleHighlight": "Unique Value",
    "titleHighlightColor": "#fbbf24",
    "subtitle": "What makes us different",
    "backgroundImage": 2,
    "propositions": [
      {
        "title": "Expert Faculty",
        "titleColor": "#3b82f6",
        "description": "<p>Industry-leading educators</p>",
        "icon": 1,
        "order": 1
      }
    ]
  }
}
```

#### Update Value Proposition (Admin)

```
PUT /value-propositions/:id
Authorization: Bearer <api-token>
```

#### Delete Value Proposition (Admin)

```
DELETE /value-propositions/:id
Authorization: Bearer <api-token>
```

### Achievement Endpoints

#### List Achievements by Institution

```
GET /achievements?filters[institution][slug][$eq]=<slug>
```

- Returns the single achievement section for the specified institution.
- Includes ordered achievement cards.

#### Get Achievement by ID

```
GET /achievements/:id
```

- Retrieves a single achievement section with nested cards.

#### Create Achievement (Admin)

```
POST /achievements
Authorization: Bearer <api-token>
Content-Type: application/json
```

#### Update Achievement (Admin)

```
PUT /achievements/:id
Authorization: Bearer <api-token>
```

#### Delete Achievement (Admin)

```
DELETE /achievements/:id
Authorization: Bearer <api-token>
```

### Recognition Section Endpoints

#### List Recognition Sections by Institution

```
GET /recognition-sections?filters[institution][slug][$eq]=<slug>&populate[recognitions][populate]=icon
```

- Returns the recognition section for the specified institution with icon metadata populated.

#### Get Recognition Section by ID

```
GET /recognition-sections/:id?populate[recognitions][populate]=icon
```

#### Create Recognition Section (Admin)

```
POST /recognition-sections
Authorization: Bearer <api-token>
Content-Type: application/json
```

#### Update Recognition Section (Admin)

```
PUT /recognition-sections/:id
Authorization: Bearer <api-token>
```

#### Delete Recognition Section (Admin)

```
DELETE /recognition-sections/:id
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

### Value Proposition Response Example

```json
{
  "data": [
    {
      "id": 1,
      "institution": {
        "id": 1,
        "name": "SONA Tech School",
        "slug": "sona-tech-school"
      },
      "titlePrefix": "Our",
      "titlePrefixColor": "white",
      "titleHighlight": "Unique Value",
      "titleHighlightColor": "#fbbf24",
      "subtitle": "What makes us different",
      "backgroundImage": {
        "id": 2,
        "name": "vp-bg.jpg",
        "url": "/uploads/vp_bg_123.jpg",
        "formats": { "...": "..." }
      },
      "propositions": [
        {
          "id": 1,
          "title": "Expert Faculty",
          "titleColor": "#3b82f6",
          "description": "<p>Industry-leading educators with decades of experience</p>",
          "icon": {
            "id": 1,
            "name": "faculty-icon",
            "image": { "url": "/uploads/icon_faculty.svg" }
          },
          "order": 1
        }
      ],
      "createdAt": "2025-11-08T10:00:00.000Z",
      "updatedAt": "2025-11-08T10:00:00.000Z"
    }
  ],
  "meta": { "pagination": { "...": "..." } }
}
```

### Field Specifications

**Institution Fields:**
- **bannerImage (Media, required):** Accepts single image; metadata described above.
- **bannerTitle (String, required):** ≤ 255 characters.
- **bannerSubtitle (Text, optional):** ≤ 500 characters; supports multiline text.

**Value Proposition Fields:**
- **institution (Relation, required):** Many-to-one relation to institution.
- **titlePrefix (String, optional):** ≤ 100 characters.
- **titlePrefixColor (String, optional):** ≤ 50 characters; supports CSS colors or Tailwind tokens; default: "white".
- **titleHighlight (String, optional):** ≤ 100 characters.
- **titleHighlightColor (String, optional):** ≤ 50 characters; default: "#fbbf24".
- **subtitle (Text, optional):** ≤ 500 characters.
- **backgroundImage (Media, optional):** Accepts single image.
- **propositions (Component, repeatable):** Array of value-proposition-item components.

**Proposition Item Fields:**
- **title (String, required):** ≤ 100 characters.
- **titleColor (String, optional):** ≤ 50 characters; supports CSS colors or Tailwind tokens.
- **description (Rich Text, required):** Markdown/HTML formatted text.
- **icon (Relation, optional):** One-to-one relation to icon-badge.
- **order (Integer, optional):** Sorting order; null treated as last.

### Error Responses

- **400 ValidationError:** Missing required fields or invalid payload.
- **401 Unauthorized:** Missing/invalid auth token for write endpoints.
- **403 Forbidden:** Insufficient permissions.
- **404 Not Found:** Resource does not exist.
- **409 Conflict:** Duplicate unique field (name or slug).
- **500 ApplicationError:** Server-side failure.

### Query Examples

```bash
# Institution queries
GET /institutions?populate=bannerImage&sort=name:asc
GET /institutions?populate=bannerImage&pagination[page]=2&pagination[pageSize]=10
GET /institutions?filters[name][$contains]=SONA&populate=bannerImage
GET /institutions/1
GET /institutions?filters[slug][$eq]=sona-tech-school&populate=bannerImage
GET /institutions/1?populate=valuePropositions

# Value proposition queries
GET /value-propositions?populate[propositions][populate]=icon&populate=backgroundImage
GET /value-propositions?filters[institution][slug][$eq]=sona-tech-school&populate[propositions][populate]=icon
GET /value-propositions/1?populate[propositions][populate]=icon
GET /value-propositions?sort=createdAt:desc
```

### Rate Limits & CORS

- No rate limiting in development; target 100 read and 10 write requests per minute per IP in production.
- Default CORS headers allow all origins and standard methods/headers.

### Versioning

- Current API implicitly v1; future iterations will adopt `/api/v2/institutions` and `/api/v2/value-propositions`.

---

## Testing Checklist

- [ ] Schema contains all institution and value proposition fields with correct validation and media constraints.
- [ ] Admin UI enforces required fields and max lengths.
- [ ] Public `GET` endpoints return data when populated.
- [ ] Slug-based filter returns correct institution.
- [ ] CRUD operations validated via Strapi admin and curl/Postman.
- [ ] Banner and background image URLs resolve and serve optimized formats.
- [ ] Value proposition relations (institution, icons) populate correctly.
- [ ] Frontend renders institution detail and value proposition sections without console errors.
- [ ] Error handling tested for missing data and permission changes.
- [ ] Color fields accept CSS and Tailwind values without errors.

---

## Troubleshooting

**Schema fields not visible:**
- Restart Strapi, clear cache, hard refresh, inspect browser console.

**Image upload fails:**
- Verify file format (JPG/PNG/WebP), size (< 10MB), permissions, and disk space.

**API returns null fields:**
- Confirm image/background upload, populate parameter, media library status.
- Consider restarting Strapi and rebuilding the admin panel.

**Frontend sections missing:**
- Check console errors, environment variables, absolute URL construction, and CORS configuration.

**403 Forbidden responses:**
- Reconfirm public role permissions for institution and value-proposition endpoints.

**Missing propositions in response:**
- Ensure `populate[propositions][populate]=icon` is supplied; verify component data exists.

**Color not applied:**
- Check for trailing spaces or invalid tokens; defaults apply when trimmed value is empty.

**Permissions denied on new content type:**
- Re-run Strapi bootstrap or manually enable public read permission for the new content type in Settings → Users & Permissions → Roles → Public.

---

## Performance Optimization

- Pre-optimize images (resize to 1920x1080, compress with ImageOptim/TinyPNG, prefer WebP).
- Configure reverse proxy caching for `/uploads` (e.g., 30-day immutable cache headers).
- Monitor Strapi logs for query performance and media usage.
- Use nested population carefully; avoid over-populating relations in list endpoints.

---

## Maintenance

- Monitor media library size and prune unused assets regularly.
- Include data checks in routine QA.
- Backup database and uploads directory prior to schema changes.
- Track API usage through Strapi logs.

---

## Dependencies

- Strapi v5 OSS on Node.js 22 with SQLite (dev) or PostgreSQL (prod).
- Strapi media library plugin (default).
- Icon-badge content type (prerequisite for value proposition items).
- Backend ADRs (001–006) for architecture guidance.
- Frontend consumer located in `sona-ui` for verification.

---

## Related Documents

- `specs/blueprints/architecture-decisions.md`
- `specs/blueprints/prd.md`
- `specs/work-items/institution-development.md` (frontend)
- Frontend counterpart: `../../sona-ui/specs/work-items/institution-development.md`
- Historical references:
  - `specs/work-items/institution-banner-api-development.md`
  - `specs/blueprints/institution-api-reference.md`
  - `specs/blueprints/institution-banner-setup-guide.md`

---

## Notes

- Slug UID derives from `name`; ensure descriptive institution names.
- When replacing media, Strapi removes old references.
- Color fields support CSS (hex, rgba) and Tailwind tokens; frontend handles validation.
- Consider future enhancements such as multiple banner variants, cropping pipelines, or advanced proposition filtering.
- Document any environment-specific URL handling to keep frontend integrations aligned.
- Value propositions are optional; institutions without value propositions should not break rendering.

## Additional Resources

- Strapi Media Library: https://docs.strapi.io/user-docs/media-library
- Content-Type Builder: https://docs.strapi.io/user-docs/content-types-builder
- Permissions Documentation: https://docs.strapi.io/user-docs/users-roles-permissions
- Relations Documentation: https://docs.strapi.io/dev-docs/backend/models/entity-service-api
