# ADR-003: Modular Monolith on Managed Services

**Status:** Accepted
**Date:** 2026-06-13

## Context

Yosr needs production reliability and future scale, but a small team should not operate distributed services prematurely.

## Decision

Build one stateless Next.js application organized into bounded modules and deploy it on Vercel. Use managed Postgres, authentication, storage, video delivery, email, and monitoring services.

Do not begin with microservices.

## Consequences

- Transactions across payment and enrollment remain straightforward.
- Deployment and local reasoning stay manageable for AI-assisted development.
- Scale comes first from caching, indexes, pooled database connections, CDN delivery, and stateless instances.
- Payment processing, reconciliation, or media integration may be extracted later because module boundaries are explicit.
