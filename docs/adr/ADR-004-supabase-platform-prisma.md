# ADR-004: Supabase, Cloudflare R2, and Prisma

**Status:** Accepted
**Date:** 2026-06-13

## Context

The MVP needs PostgreSQL, authentication, and object storage with explicit provider boundaries. The application also needs an explicit relational schema and migration workflow.

## Decision

Use:

- Supabase PostgreSQL.
- Supabase Auth.
- Cloudflare R2 for course images, thumbnails, PDFs, attachments, and uploaded assets.
- Prisma for server-side data access and migrations.

Supabase Storage and Supabase Buckets are not used. Video bytes are excluded from R2 and remain behind a future video-provider abstraction.

The browser will not directly query commerce or learning tables. Application services enforce authorization and issue short-lived upload or download access for protected R2 objects.

## Consequences

- Database and identity remain on Supabase while object storage is independently replaceable.
- Prisma provides a well-understood schema and migration workflow.
- Runtime traffic must use connection pooling suitable for serverless execution.
- Direct database, Supabase secret, and R2 credentials remain server-only.
- Public assets may use CDN-backed public delivery; paid resources require authorization and short-lived signed URLs.
- R2 account, bucket, and credential setup is deferred until the first course-asset implementation stage.
