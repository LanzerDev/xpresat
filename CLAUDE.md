# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

XpresaT is a **pnpm + Turborepo** monorepo with two apps:

- **`apps/cms`** — Payload CMS v3 on Next.js. Serves the admin panel at `/admin` and the REST API at `/api`. Also handles media storage via Vercel Blob.
- **`apps/web`** — Astro (SSR, Vercel adapter). Fetches all content from the CMS at build/request time via `src/data/cms.ts`.

## Commands

Run from the monorepo root:

```bash
pnpm install          # install all dependencies
pnpm dev              # start both apps concurrently via Turborepo
pnpm build            # build both apps
pnpm lint             # lint both apps
```

Run from `apps/cms` only:

```bash
pnpm dev              # CMS dev server (generates importmap first, runs on :3000)
pnpm devsafe          # same but clears .next cache first
pnpm generate:types   # regenerate payload-types.ts from the current config
pnpm test:int         # Vitest integration tests (tests/int/**/*.int.spec.ts)
pnpm test:e2e         # Playwright E2E tests (tests/e2e/)
```

Run from `apps/web` only:

```bash
pnpm dev              # Astro dev server
pnpm build            # SSR build
pnpm preview          # preview the built output
```

## Environment Setup

Copy `apps/cms/.env.example` to `apps/cms/.env` and set:

- `DATABASE_URL` — PostgreSQL connection string (uses `@payloadcms/db-postgres`)
- `PAYLOAD_SECRET` — secret for signing tokens
- `BLOB_READ_WRITE_TOKEN` — (optional) Vercel Blob token; if unset, local storage is used

The web app reads `PAYLOAD_API_URL` (defaults to `http://localhost:3000`) to know where to fetch CMS data.

## Architecture

### Data Flow

```
Astro (web) → HTTP fetch → Payload REST API (cms) → PostgreSQL
                                                   → Vercel Blob (media)
```

`apps/web/src/data/cms.ts` is the sole integration point. It exports `getLandingPage()` and `getProjects()`, both of which call Payload's REST API with `depth=2` and fix up relative media URLs via `resolveUrls()`.

### CMS Structure (`apps/cms/src/`)

- `payload.config.ts` — root config: registers collections, globals, plugins, DB adapter
- `collections/Users.ts` — auth-enabled user collection
- `collections/Media.ts` — media upload collection (Vercel Blob in prod)
- `collections/Projects.ts` — portfolio projects with slug auto-generation hook and a `mediaGallery` array supporting images, uploaded videos, and external video URLs
- `globals/LandingPage.ts` — single-instance global with all homepage sections (hero, about, team, clients, services, process, contact)
- `payload-types.ts` — **auto-generated** by `pnpm generate:types`; do not edit manually

### Web Structure (`apps/web/src/`)

- `data/cms.ts` — typed fetch helpers; types mirror the CMS fields
- `pages/index.astro` — homepage, renders all landing page sections
- `pages/proyectos.astro` — projects gallery page
- `components/` — one `.astro` component per section (Hero, About, Services, Clients, ProjectsGrid, ProjectModal, Navbar, Footer)

### Payload CMS Skill

When working in `apps/cms/`, the `payload` skill is available. Consult `.claude/skills/payload/SKILL.md` for Payload-specific patterns (hooks, access control, field types, migrations).

## Testing

Integration tests (`tests/int/`) bootstrap a real Payload instance against the configured database — they need a live `DATABASE_URL`. Run them from `apps/cms/`.

E2E tests (`tests/e2e/`) use Playwright against a running dev server. The `test.env` sets `NODE_OPTIONS` for compatibility.

CMS default admin credentials (seed): `admin@xpresat.com` / `adminpassword123`  
E2E test user credentials: `dev@payloadcms.com` / `test`

## Deployment

The project targets **Vercel** for both apps. See `docs/adr/0001-vercel-neon-blob-deployment.md` for the infrastructure decisions (Neon for PostgreSQL, Vercel Blob for media).
