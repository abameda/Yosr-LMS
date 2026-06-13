# ADR-004: Supabase Platform with Prisma

**Status:** Accepted
**Date:** 2026-06-13

## Context

The MVP needs PostgreSQL, authentication, and private resource storage with minimal vendor and operational overhead. The application also needs an explicit relational schema and migration workflow.

## Decision

Use:

- Supabase PostgreSQL.
- Supabase Auth.
- Supabase private Storage.
- Prisma for server-side data access and migrations.

The browser will not directly query commerce or learning tables. Application services enforce authorization.

## Consequences

- Database, identity, and storage are available through one managed platform.
- Prisma provides a well-understood schema and migration workflow.
- Runtime traffic must use connection pooling suitable for serverless execution.
- Direct database and service-role credentials remain server-only.
- Replacing one Supabase capability later requires preserving the application boundary around it.
