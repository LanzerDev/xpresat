# 1. Deploy on Vercel with Neon Postgres and Vercel Blob storage

Date: 2026-06-12

## Status

Accepted

## Context

The XpresaT landing page consists of two apps in a pnpm monorepo: a Payload CMS v3 app (`apps/cms`, Next.js) and an Astro SSR frontend (`apps/web`). The agency has no infrastructure of its own, and the portfolio requires editors to upload high-quality images and MP4 videos without code changes.

Two hosting paths were considered:

- **Vercel (serverless)**: zero-ops, git-push deploys, free tiers for both apps plus Neon. Constraints: ephemeral filesystem (local disk uploads do not survive) and a 4.5 MB request body limit on serverless functions, which blocks direct MP4 uploads through the API.
- **Node server (VPS / Railway / Render)**: local disk uploads work and there is no body limit, but it requires server management the agency does not want.

The existing `apps/cms` is the official Payload `blank` template. The official `with-vercel-postgres` template was evaluated as a replacement; its only meaningful deltas are the Vercel Blob storage plugin and a Vercel-flavored Postgres adapter. Replacing the folder would discard local assets (Payload skill docs, Playwright/Vitest tests) to gain ~15 lines of config.

## Decision

- Deploy both apps to Vercel as two separate projects: `apps/cms` (Next.js) and `apps/web` (Astro with `@astrojs/vercel` adapter).
- Use Neon Postgres as the database, connecting through Neon's **pooled** connection string (`-pooler` endpoint) to avoid connection exhaustion in serverless.
- Keep the existing `@payloadcms/db-postgres` adapter; Neon is standard Postgres and no adapter swap is needed.
- Add `@payloadcms/storage-vercel-blob` with `clientUploads: true` so media files upload from the browser directly to Vercel Blob, bypassing the 4.5 MB serverless body limit.
- Extend the existing blank template in place; do not replace it with the `with-vercel-postgres` template.

## Consequences

- Media binaries live in Vercel Blob; Postgres stores only media metadata. Blob storage is the first cost to grow as the video portfolio expands (free tier: 1 GB).
- `clientUploads: true` is load-bearing: removing it silently breaks any upload over 4.5 MB.
- Two Vercel projects must be configured (env vars, build settings) instead of one server.
- Local development can keep using Docker Postgres or point at a Neon branch.
