# Work Item: Institution Content Type Development

**ID:** WI-001-BE-INSTITUTIONS  
**Title:** Create Institution Content Type & APIs  
**Priority:** High  
**Status:** In Progress  
**Milestone:** Phase 1 Foundation  
**Owner:** Backend Team  

---

## Overview

Create a Strapi content type for institutions with slug-based routing support. This foundation enables the frontend to fetch institution data dynamically for the institutions detail page.

---

## Requirements

### Functional Requirements

1. **Content Type Definition**
   - Create `institution` content type in Strapi
   - Define fields: `id`, `name`, `slug`
   - Apply constraints: `slug` and `name` must be unique
   - Auto-generate timestamps (`createdAt`, `updatedAt`)

2. **API Endpoints**
   - `GET /api/institutions` — List all institutions (paginated)
   - `GET /api/institutions/:id` — Get single institution by ID
   - Support slug-based filtering via query parameters

3. **Permissions**
   - Public read access (find, findOne endpoints)
   - Admin-only write access (create, update, delete endpoints)

4. **Data Validation**
   - `name`: required, unique, max length 255 characters
   - `slug`: required, unique, URL-friendly (derived from name)

### Non-Functional Requirements

1. **Performance**
   - Slug lookups < 100ms
   - List endpoint with pagination < 200ms

2. **Documentation**
   - Document API endpoint contracts
   - Provide Strapi admin setup instructions
   - Include sample data format

3. **Testing**
   - Test all CRUD operations via Strapi admin
   - Verify public read permissions
   - Confirm slug uniqueness enforcement

---

## Technical Specifications

### Schema Definition

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
  "pluginOptions": {},
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
    }
  }
}
```

### File Structure

```
/sona-be/src/api/institution/
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

### Permission Configuration

| Endpoint | Public | Authenticated | Admin |
|----------|--------|---------------|-------|
| `GET /api/institutions` | ✓ | ✓ | ✓ |
| `GET /api/institutions/:id` | ✓ | ✓ | ✓ |
| `POST /api/institutions` | ✗ | ✗ | ✓ |
| `PUT /api/institutions/:id` | ✗ | ✗ | ✓ |
| `DELETE /api/institutions/:id` | ✗ | ✗ | ✓ |

---

## Implementation Steps

1. [ ] Create institution content type in Strapi with schema as defined
2. [ ] Generate default controller, service, and routes
3. [ ] Configure public read permissions in Strapi admin
4. [ ] Test via Strapi admin UI (CRUD operations)
5. [ ] Test via REST API (curl/Postman)
6. [ ] Create seed data with sample institutions
7. [ ] Document API contracts in this file
8. [ ] Get peer review and approval

---

## Definition of Done

- [ ] Institution content type created and verified in Strapi
- [ ] All CRUD operations functional via Strapi admin
- [ ] Public read endpoints accessible without authentication
- [ ] Slug field is unique and URL-friendly
- [ ] Frontend can successfully fetch institution by slug
- [ ] All API responses match standard response format (ADR 004)
- [ ] No errors in Strapi logs
- [ ] Documentation complete and linked to this work item

---

## Dependencies

- Strapi v5 OSS running locally
- Database schema migrations applied
- Backend architecture decisions finalized (refer to `specs/blueprints/architecture-decisions.md`)

---

## Related Documents

- **Architecture Decision Records:** `specs/blueprints/architecture-decisions.md`
- **Product Requirements:** `specs/blueprints/prd.md`
- **Frontend Work Item:** `sona-ui/specs/work-items/institution-development.md`

---

## Notes

- Use Strapi's built-in UID field type for slug generation (auto-derives from `name`)
- Ensure slug is properly indexed in the database for fast lookups
- Frontend will use slug-based filtering; test this query pattern: `GET /api/institutions?filters[slug][$eq]=example-slug`

