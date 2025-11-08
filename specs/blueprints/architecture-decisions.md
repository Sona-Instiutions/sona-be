# Backend Architecture Decisions & Blueprint

> This document outlines the architectural decisions and blueprint for the Sona backend, built on Strapi. It serves as the single source of truth for backend development patterns, content type conventions, and API design principles.

---

## Architecture Decision Records

### ADR 001 — Use Strapi v5 OSS As Headless CMS

- **Date:** 2025-11-08
- **Status:** Accepted
- **Context:** We need a flexible, API-first content management system that can be deployed independently and serve multiple frontends (web, mobile, etc.).
- **Decision:** Adopt Strapi v5 OSS running on Node.js 22 with SQLite for local development and PostgreSQL for production.
- **Consequences:** Enables rapid content type iteration, built-in REST API, and admin UI for content management. Provides flexibility to scale data sources later.

### ADR 002 — Content Type Slug Pattern For Route Generation

- **Date:** 2025-11-08
- **Status:** Accepted
- **Context:** Frontend routes are determined by URL slugs derived from content types. We need a consistent, unique slug pattern across all content types.
- **Decision:** All primary content types use a UID field named `slug` (Strapi's UID generates unique, URL-friendly identifiers). The slug is derived from a human-readable field (e.g., `name` for institutions) and must be unique within its collection.
- **Consequences:** Enables predictable, SEO-friendly URLs; simplifies frontend routing logic; ensures no collisions between routes.

### ADR 003 — Public Read Access For Frontend Consumption

- **Date:** 2025-11-08
- **Status:** Accepted
- **Context:** The frontend needs to fetch content without authentication. We want to protect write operations while allowing public reads.
- **Decision:** Configure Strapi permissions to allow public (unauthenticated) access to `find` and `findOne` endpoints for all public content types. Restrict write operations (`create`, `update`, `delete`) to authenticated admin users or API tokens.
- **Consequences:** Frontend can fetch data without token management; reduces complexity on initial page loads; admin panel remains secured; future authenticated endpoints can be restricted separately.

### ADR 004 — Consistent API Response Structure

- **Date:** 2025-11-08
- **Status:** Accepted
- **Context:** Multiple frontends and services consume our API. We need predictable, consistent response shapes to reduce client-side error handling.
- **Decision:** All API responses follow Strapi's default structure: `{ data: <entity | entity[]>, meta?: <pagination> }`. Custom error responses follow: `{ error: { status, name, message, details? } }`.
- **Consequences:** Standardizes error handling across frontends; enables consistent TanStack Query configurations; simplifies documentation.

### ADR 005 — Content Type Folder Organization

- **Date:** 2025-11-08
- **Status:** Accepted
- **Context:** Strapi auto-generates API files. We need a consistent structure for custom logic and easy discoverability.
- **Decision:** Each content type lives under `/src/api/<type-name>/` containing:
  - `content-types/<type-name>/schema.json` — Strapi-generated schema
  - `controllers/<type-name>.ts` — Request handlers (if custom logic needed)
  - `services/<type-name>.ts` — Business logic and data access
  - `routes/<type-name>.ts` — Route definitions (if custom routes needed)
- **Consequences:** Predictable structure mirrors Strapi conventions; easier to locate and extend content types; new developers can onboard quickly.

### ADR 006 — Validation & Error Handling

- **Date:** 2025-11-08
- **Status:** Accepted
- **Context:** We need robust validation at the API boundary and consistent error reporting to frontends.
- **Decision:** Use Strapi's built-in attribute validators (e.g., `required: true`, `unique: true`). For complex business logic validation, implement middleware or custom services that return normalized errors matching ADR 004.
- **Consequences:** Shifts validation left to schema definition; reduces boilerplate code; frontend receives predictable error shapes.

---

## Backend System Overview

- **Framework:** Strapi v5 OSS on Node.js 22
- **Database:** SQLite for local development, PostgreSQL for production
- **API Surface:** REST endpoints auto-generated from content types
- **Admin Panel:** Available at `http://localhost:1337/admin` (local development)
- **Content Types Location:** `/src/api/` organized by feature/domain
- **Environment Management:** `.env` file for database and secrets

### Core Principles

1. **Content First** — Define content types as the source of truth; APIs are derived from types.
2. **DRY APIs** — Leverage Strapi's auto-generated endpoints; customize only when business logic demands it.
3. **Type Safety** — Document Strapi response shapes and maintain parity with frontend type definitions.
4. **Secure By Default** — Public read, protected write; use API tokens for admin/internal operations.
5. **Scalability** — Design types and relationships to support future growth without major refactoring.

---

## Naming Conventions

- **Content Types:** Singular, lowercase (e.g., `institution`, `article`, `category`)
- **Collection Field:** Named `slug`, type UID, derived from the primary display field (e.g., `name`)
- **Timestamps:** Strapi auto-includes `createdAt`, `updatedAt`; no manual timestamp fields
- **Relationships:** Use clear, plural names for collections (e.g., `articles` for reverse relation)
- **Status/Lifecycle:** Use enum fields (e.g., `status: enum['draft', 'published']`) when applicable

### ADR 007 — JSDoc Documentation Standards

- **Date:** 2025-11-08
- **Status:** Accepted
- **Context:** Consistent and concise documentation improves code readability and maintainability across the team.
- **Decision:** Every function, method, and exported entity must have JSDoc comments. JSDoc descriptions must not exceed 2 lines; use `@param`, `@returns`, and `@throws` tags for detailed specifications. Use `@example` tags for complex functions.
- **Consequences:** Ensures predictable documentation, reduces cognitive load when reading code, and enables IDE intellisense support.

---

## API Response Contract

### Success Response
All successful API responses follow a consistent envelope structure with the entity data and optional metadata.

### Collection Response
Collection endpoints return an array of entities with pagination metadata including page number, page size, total page count, and total item count.

### Error Response
Error responses include a status code, error name, descriptive message, and optional details object for additional context about the error.

---

## Change Management

- Document all new ADRs in this file using the format above
- Update content type schemas directly in Strapi admin or via migration scripts
- Maintain this document as the authoritative guide for backend patterns
- Link migration tasks and schema changes to work items in `specs/work-items/`

