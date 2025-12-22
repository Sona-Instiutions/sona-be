# Work Item: Events Module - Backend Development

**IDs:**

- WI-004-BE-EVENTS — Create Event Content Type & APIs _(Status: Not Started)_
- WI-005-BE-EVENT-CATEGORIES — Create Event Category Content Type & Relations _(Status: Not Started)_
- WI-006-BE-EVENT-TAGS — Create Event Tag Content Type & Relations _(Status: Not Started)_
- WI-007-BE-EVENT-COMMENTS — Create Event Comment Content Type & Moderation _(Status: Not Started)_
  **Priority:** High  
  **Milestone:** Phase 2 - Content & Engagement  
  **Owner:** Backend Team

---

## Overview

Build a comprehensive Events module in Strapi that supports event listing, detail pages, categorization (Student Events, Industry Events, All Events), tagging, search functionality, and user comments with moderation. This module will power the `/events` listing page and `/events/[slug]` detail pages on the frontend.

**Important Note:** This work item focuses exclusively on **Events**. While the frontend design references a blog details page layout (shared during development for visual reference), we are **only implementing Events functionality**, not blogs.

---

## Requirements

### Event Content Type (WI-004)

#### Functional Requirements

- Create `event` collection type with the following attributes:
  - `title` (required string, max 200 characters) — Event title
  - `slug` (required string, unique, max 250 characters) — URL-friendly identifier
  - `eventType` (required enumeration: `student`, `industry`, `all`) — Event category for filtering
  - `eventDate` (required date) — Date when the event occurs/occurred
  - `excerpt` (optional text, max 300 characters) — Short description for listing pages
  - `content` (required rich text) — Full event description and details
  - `featuredImage` (required single media, images only) — Hero image for detail page
  - `thumbnailImage` (optional single media, images only) — Smaller image for listing cards
  - `author` (optional string, max 100 characters) — Event author/organizer name
  - `publishedDate` (required datetime) — When the event article was published
  - `featured` (boolean, default false) — Flag for highlighting important events
  - `viewCount` (integer, default 0) — Track event detail page views
  - `metaTitle` (optional string, max 70 characters) — SEO title override
  - `metaDescription` (optional text, max 160 characters) — SEO description
  - `categories` (many-to-many relation) — Link to event-category
  - `tags` (many-to-many relation) — Link to event-tag
  - `relatedEvents` (many-to-many relation, self-referential) — Manually curated related events
- Enable draft and publish workflow
- Enforce slug uniqueness and auto-generation from title if not provided
- Expose REST endpoints:
  - `GET /api/events` — List events with filtering, search, pagination, sorting
  - `GET /api/events/:id` — Single event by ID
  - `GET /api/events?filters[slug][$eq]=<slug>` — Single event by slug
  - `POST /api/events/:id/increment-view` — Increment view count (public endpoint)
- Configure public read permissions for published events
- Admin-only permissions for create, update, delete, and draft management

#### Non-Functional Requirements

- Event listing endpoint responds in < 200ms with pagination (25 items per page default)
- Event detail endpoint responds in < 100ms with full population
- Full-text search across title, excerpt, and content fields
- Automatic slug sanitization and validation
- Image optimization with multiple formats (thumbnail, small, medium, large)
- Proper indexing on slug, eventType, eventDate, publishedDate, and featured fields

### Event Category Content Type (WI-005)

#### Functional Requirements

- Create `event-category` collection type with attributes:
  - `name` (required string, unique, max 100 characters) — Category display name
  - `slug` (required string, unique, max 120 characters) — URL-friendly identifier
  - `description` (optional text, max 500 characters) — Category description
  - `color` (optional string, max 50 characters) — Tailwind class or hex color for UI badges
  - `icon` (optional relation to icon-badge) — Visual icon for category
  - `order` (optional integer, default 0) — Display order in UI
  - `events` (many-to-many relation) — Linked events
- Expose REST endpoints:
  - `GET /api/event-categories` — List all categories with event counts
  - `GET /api/event-categories/:id` — Single category with related events
- Configure public read permissions, admin-only write permissions

#### Non-Functional Requirements

- Category listing includes event count aggregation
- Categories sorted by order field (ascending) then name (alphabetically)
- Slug auto-generation from name if not provided

### Event Tag Content Type (WI-006)

#### Functional Requirements

- Create `event-tag` collection type with attributes:
  - `name` (required string, unique, max 50 characters) — Tag display name
  - `slug` (required string, unique, max 60 characters) — URL-friendly identifier
  - `events` (many-to-many relation) — Linked events
- Expose REST endpoints:
  - `GET /api/event-tags` — List all tags with usage counts
  - `GET /api/event-tags/:id` — Single tag with related events
- Configure public read permissions, admin-only write permissions
- Support tag creation during event creation/editing

#### Non-Functional Requirements

- Tags sorted alphabetically by name
- Tag listing includes usage count (number of events using the tag)
- Automatic slug generation and sanitization

### Event Comment Content Type (WI-007)

#### Functional Requirements

- Create `event-comment` collection type with attributes:
  - `event` (required many-to-one relation) — Parent event
  - `authorName` (required string, max 100 characters) — Commenter's name
  - `authorEmail` (required email) — Commenter's email (not exposed publicly)
  - `content` (required text, max 2000 characters) — Comment text
  - `status` (required enumeration: `pending`, `approved`, `rejected`, `spam`) — Moderation status
  - `ipAddress` (optional string, max 45 characters) — Commenter's IP for spam detection
  - `userAgent` (optional text, max 500 characters) — Browser info for spam detection
  - `parentComment` (optional many-to-one relation, self-referential) — For nested replies
  - `replies` (one-to-many relation, self-referential) — Child comments
- Expose REST endpoints:
  - `GET /api/event-comments?filters[event][id][$eq]=<eventId>&filters[status][$eq]=approved` — Approved comments for an event
  - `POST /api/event-comments` — Submit new comment (public, creates with `pending` status)
  - `PUT /api/event-comments/:id` — Update comment status (admin only)
  - `DELETE /api/event-comments/:id` — Delete comment (admin only)
- Configure public read permissions for approved comments only
- Public create permission (auto-set to pending status)
- Admin-only permissions for status updates and deletion

#### Non-Functional Requirements

- Comments default to `pending` status requiring admin approval
- Email validation on submission
- Rate limiting on comment submission (consider Strapi middleware or plugin)
- Support for nested replies (1 level deep recommended)
- Spam detection hooks (optional: integrate Akismet or similar)

---

## Technical Specifications

### File Structure

```
/sona-be/
├── src/
│   └── api/
│       ├── event/
│       │   ├── content-types/
│       │   │   └── event/
│       │   │       └── schema.json
│       │   ├── controllers/
│       │   │   └── event.ts
│       │   ├── routes/
│       │   │   └── event.ts
│       │   └── services/
│       │       └── event.ts
│       ├── event-category/
│       │   ├── content-types/
│       │   │   └── event-category/
│       │   │       └── schema.json
│       │   ├── controllers/
│       │   │   └── event-category.ts
│       │   ├── routes/
│       │   │   └── event-category.ts
│       │   └── services/
│       │       └── event-category.ts
│       ├── event-tag/
│       │   ├── content-types/
│       │   │   └── event-tag/
│       │   │       └── schema.json
│       │   ├── controllers/
│       │   │   └── event-tag.ts
│       │   ├── routes/
│       │   │   └── event-tag.ts
│       │   └── services/
│       │       └── event-tag.ts
│       └── event-comment/
│           ├── content-types/
│           │   └── event-comment/
│           │       └── schema.json
│           ├── controllers/
│           │   └── event-comment.ts
│           ├── routes/
│           │   └── event-comment.ts
│           └── services/
│               └── event-comment.ts
└── specs/
    └── work-items/
        └── events-development.md (this file)
```

### Schema Definitions

#### Event Schema Fields

- Collection name: `events`
- Display name: `Event`
- Draft and publish: Enabled
- Timestamps: Enabled
- All attributes as specified in functional requirements above

#### Event Category Schema Fields

- Collection name: `event_categories`
- Display name: `Event Category`
- Draft and publish: Disabled
- Timestamps: Enabled
- All attributes as specified in functional requirements above

#### Event Tag Schema Fields

- Collection name: `event_tags`
- Display name: `Event Tag`
- Draft and publish: Disabled
- Timestamps: Enabled
- All attributes as specified in functional requirements above

#### Event Comment Schema Fields

- Collection name: `event_comments`
- Display name: `Event Comment`
- Draft and publish: Disabled
- Timestamps: Enabled
- All attributes as specified in functional requirements above

### Custom Controllers & Services

#### Event Controller Extensions

- Custom endpoint to increment view count
- Override find method to support search and enhanced filtering
- Override findOne to populate related data
- Search implementation across title, excerpt, and content fields
- Default population of related entities

#### Event Comment Controller

- Override create to enforce pending status and capture metadata
- Override find to only show approved comments to public users
- IP address and user agent capture on submission
- Admin notification trigger for moderation queue

### Custom Routes

- `POST /api/events/:id/increment-view` — Public endpoint to increment view count

### API Query Examples

#### List Events with Filters

- All events, paginated: `GET /api/events?pagination[page]=1&pagination[pageSize]=25&populate=*`
- Student events only: `GET /api/events?filters[eventType][$eq]=student&populate=*`
- Industry events only: `GET /api/events?filters[eventType][$eq]=industry&populate=*`
- Featured events: `GET /api/events?filters[featured][$eq]=true&populate=*`
- Search events: `GET /api/events?search=innovation&populate=*`
- Events by category: `GET /api/events?filters[categories][slug][$eq]=technology&populate=*`
- Events by tag: `GET /api/events?filters[tags][slug][$eq]=ai&populate=*`
- Sort by event date (newest first): `GET /api/events?sort[0]=eventDate:desc&populate=*`
- Sort by view count (most viewed): `GET /api/events?sort[0]=viewCount:desc&populate=*`

#### Get Single Event

- By slug: `GET /api/events?filters[slug][$eq]=annual-robotics-championship-2025&populate[0]=featuredImage&populate[1]=thumbnailImage&populate[2]=categories.icon&populate[3]=tags&populate[4]=relatedEvents.thumbnailImage&populate[5]=comments.replies&filters[comments][status][$eq]=approved`
- By ID: `GET /api/events/1?populate=*`

#### Increment View Count

- `POST /api/events/1/increment-view`

#### List Categories with Event Counts

- `GET /api/event-categories?populate=events`

#### List Tags with Usage Counts

- `GET /api/event-tags?populate=events`

#### Submit Comment

- `POST /api/event-comments` with JSON body containing event ID, author name, email, and content

#### Get Approved Comments for Event

- `GET /api/event-comments?filters[event][id][$eq]=1&filters[status][$eq]=approved&populate=replies`

---

## Implementation Steps

### Phase 1: Core Event Content Type (WI-004)

1. [ ] Create event content type schema with all required fields
2. [ ] Generate event API endpoints via Strapi CLI
3. [ ] Implement custom controller methods (incrementView, enhanced find/findOne)
4. [ ] Add custom route for view count increment
5. [ ] Configure permissions (public read for published, admin write)
6. [ ] Test CRUD operations via Strapi admin panel
7. [ ] Test API endpoints with curl/Postman
8. [ ] Seed sample event data (10-15 events across different types)
9. [ ] Validate search functionality
10. [ ] Validate filtering by eventType
11. [ ] Validate sorting and pagination
12. [ ] Document API endpoints and query patterns

### Phase 2: Categories & Tags (WI-005, WI-006)

1. [ ] Create event-category content type schema
2. [ ] Create event-tag content type schema
3. [ ] Generate API endpoints for both content types
4. [ ] Configure many-to-many relations with events
5. [ ] Configure permissions (public read, admin write)
6. [ ] Seed sample categories (5-8 categories)
7. [ ] Seed sample tags (15-20 tags)
8. [ ] Link categories and tags to existing events
9. [ ] Test category filtering on events endpoint
10. [ ] Test tag filtering on events endpoint
11. [ ] Validate event count aggregation for categories
12. [ ] Validate usage count aggregation for tags
13. [ ] Document category and tag API patterns

### Phase 3: Comments & Moderation (WI-007)

1. [ ] Create event-comment content type schema
2. [ ] Generate comment API endpoints
3. [ ] Implement custom comment controller (auto-pending, metadata capture)
4. [ ] Configure permissions (public create/read approved, admin moderate)
5. [ ] Test comment submission flow
6. [ ] Test comment approval workflow in admin panel
7. [ ] Test nested replies (parent-child relationship)
8. [ ] Validate only approved comments visible to public
9. [ ] Test comment filtering by event
10. [ ] Add rate limiting middleware (optional)
11. [ ] Document comment submission and moderation workflows

### Phase 4: Testing & Optimization

1. [ ] Performance test event listing endpoint (target < 200ms)
2. [ ] Performance test event detail endpoint (target < 100ms)
3. [ ] Validate full-text search performance
4. [ ] Test image optimization and format generation
5. [ ] Validate slug uniqueness enforcement
6. [ ] Test draft/publish workflow
7. [ ] Validate all relation populations
8. [ ] Test error handling for invalid requests
9. [ ] Security audit (SQL injection, XSS prevention)
10. [ ] Load test with 100+ events
11. [ ] Document performance benchmarks
12. [ ] Create admin user guide for event management

---

## Definition of Done

### Event Content Type (WI-004)

- [ ] Event schema created with all specified fields
- [ ] CRUD endpoints functional and tested
- [ ] Custom incrementView endpoint working
- [ ] Search functionality operational across title/excerpt/content
- [ ] Filtering by eventType working (student/industry/all)
- [ ] Sorting by eventDate, publishedDate, viewCount operational
- [ ] Pagination working with configurable page size
- [ ] Draft/publish workflow functional
- [ ] Slug auto-generation and uniqueness enforced
- [ ] Image uploads and format generation working
- [ ] Public permissions configured correctly
- [ ] Sample data seeded (10-15 events)
- [ ] API documentation complete
- [ ] Performance targets met (< 200ms list, < 100ms detail)

### Event Categories (WI-005)

- [ ] Event-category schema created
- [ ] Many-to-many relation with events working
- [ ] Category listing includes event counts
- [ ] Category filtering on events endpoint functional
- [ ] Sorting by order field working
- [ ] Sample categories seeded (5-8 categories)
- [ ] Public read permissions configured
- [ ] API documentation complete

### Event Tags (WI-006)

- [ ] Event-tag schema created
- [ ] Many-to-many relation with events working
- [ ] Tag listing includes usage counts
- [ ] Tag filtering on events endpoint functional
- [ ] Sample tags seeded (15-20 tags)
- [ ] Public read permissions configured
- [ ] API documentation complete

### Event Comments (WI-007)

- [ ] Event-comment schema created
- [ ] Comment submission creates pending status
- [ ] IP address and user agent captured
- [ ] Admin moderation workflow functional
- [ ] Only approved comments visible to public
- [ ] Nested replies working (parent-child)
- [ ] Comment filtering by event operational
- [ ] Public create permission configured
- [ ] Admin-only status update permission configured
- [ ] API documentation complete
- [ ] Moderation guide created for admins

---

## Testing Checklist

### Event API Testing

- [ ] Create event via admin panel with all fields populated
- [ ] Verify slug auto-generation from title
- [ ] Test duplicate slug rejection
- [ ] Upload featured and thumbnail images
- [ ] Verify image format generation (thumbnail, small, medium, large)
- [ ] Publish event and verify public visibility
- [ ] Save event as draft and verify not publicly visible
- [ ] Test event listing with pagination (page 1, 2, 3)
- [ ] Filter events by eventType (student, industry, all)
- [ ] Search events by keyword in title
- [ ] Search events by keyword in content
- [ ] Sort events by eventDate descending
- [ ] Sort events by viewCount descending
- [ ] Increment view count and verify update
- [ ] Test related events population
- [ ] Verify performance benchmarks

### Category & Tag Testing

- [ ] Create categories via admin panel
- [ ] Assign categories to events
- [ ] Filter events by category slug
- [ ] Verify event count on category listing
- [ ] Create tags via admin panel
- [ ] Assign multiple tags to single event
- [ ] Filter events by tag slug
- [ ] Verify usage count on tag listing
- [ ] Test category icon population

### Comment Testing

- [ ] Submit comment as public user
- [ ] Verify comment status is pending
- [ ] Verify comment not visible on public endpoint
- [ ] Approve comment as admin
- [ ] Verify approved comment visible publicly
- [ ] Submit nested reply to existing comment
- [ ] Verify reply relationship
- [ ] Reject comment as admin
- [ ] Mark comment as spam
- [ ] Filter comments by event ID
- [ ] Verify IP and user agent captured

---

## Architecture Alignment

- Strapi v4+ collection types and component architecture
- RESTful API design with standard Strapi conventions
- Public read, admin write permission model
- Draft/publish workflow for content moderation
- Relational data modeling (many-to-many, one-to-many)
- Custom controller extensions for business logic
- Middleware support for rate limiting and security
- Media library integration with format optimization

---

## Dependencies

- Strapi v4+ installed and running
- PostgreSQL or MySQL database configured
- Strapi media library configured with upload provider
- Admin user account for testing
- Existing icon-badge content type (for category icons)
- Environment variables configured (.env)

---

## Related Documents

- `specs/blueprints/prd.md`
- `sona-ui/specs/work-items/events-development.md` (Frontend counterpart)
- Strapi documentation: https://docs.strapi.io/

---

## Notes

- **Design Reference:** During development, a blog details page image will be shared as a visual reference for the event detail page layout. However, **we are only implementing Events functionality**, not blogs.
- Event types (student/industry/all) align with the three tabs shown in the Events listing page design
- Consider implementing Akismet or similar spam detection for comments in production
- Rate limiting on comment submission recommended to prevent abuse
- View count increment should be throttled per user/session to prevent artificial inflation
- Related events can be manually curated or auto-suggested based on shared categories/tags
- Consider adding email notifications for comment moderation queue
- Image optimization should generate multiple formats for responsive design
- Full-text search may require database-specific configuration (PostgreSQL full-text search, MySQL FULLTEXT index)
- Consider adding event capacity, registration links, or location fields in future iterations
- Archive old events after a certain period to maintain performance
