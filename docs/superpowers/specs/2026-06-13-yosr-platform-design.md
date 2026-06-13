# Yosr Platform Design

**Date:** 2026-06-13

**Status:** Approved for documentation review
**Implementation:** Not started

## Summary

Yosr is an Arabic-first, mobile-first, curated educational platform. It supports school subjects and broader course categories such as programming, UI/UX, technology, academic learning, and practical skills.

The MVP is an Admin-operated academy, not a marketplace. Customers discover and purchase one Course at a time, verified payment creates Enrollment, and Learners consume protected video lessons while Yosr tracks progress.

## Approved Product Boundaries

- Authenticated roles: Customer and Admin.
- One Learner profile per Customer.
- Mentors are non-authenticated content records.
- Email/password authentication with verification and password reset.
- Data-driven Course Categories.
- Optional school and general-skill metadata.
- Paymob hosted checkout first.
- Provider-aware payment architecture for future Fawry.
- VdoCipher primary video provider after an Egypt pilot.
- Bunny Stream fallback if cost or playback quality requires it.
- WhatsApp and email support only in MVP.
- No marketplace, mentor dashboard, payouts, family accounts, cart, subscriptions, quizzes, live chat, chatbot, or advanced analytics.

## Architecture

Use a stateless Next.js modular monolith on Vercel with TypeScript, Tailwind CSS, shadcn/ui, Supabase PostgreSQL/Auth/Storage, Prisma, VdoCipher, Paymob, transactional email, and Sentry.

Modules:

- Identity.
- Catalog.
- Commerce.
- Enrollment.
- Learning.
- Media.
- Administration.
- Support integration boundary.

The browser does not directly access commerce or learning tables. Server-side services enforce role, ownership, status, and Enrollment authorization.

## Core Data Flow

### Purchase

1. Customer selects a published Course.
2. Server creates a provider-neutral Order and Paymob Payment Attempt.
3. Customer completes hosted checkout.
4. Verified provider event is stored idempotently.
5. A transaction marks Payment succeeded, Order paid, and creates one Enrollment.
6. Enrollment dates are calculated from the Order's access-policy snapshot.

### Learning

1. Customer opens an enrolled Course.
2. Server verifies active Enrollment.
3. Server creates short-lived VdoCipher authorization.
4. Player events update progress.
5. Required Lesson completion determines Course progress.

### Refund

1. Admin confirms the refund through the provider or merchant process.
2. Admin records the refund reference and reason.
3. Payment and Order become refunded.
4. Admin confirms Enrollment revocation.
5. Active playback ends and an audit record is created.

## Reliability and Scale

- Database uniqueness constraints enforce one Learner per Customer, one Enrollment per Learner-Course, and idempotent provider events.
- Payment state changes are monotonic and transaction-safe.
- Public catalog reads are cached and revalidated.
- Per-user authorization and playback responses are private and uncached.
- Runtime database traffic uses serverless-compatible pooling.
- Lists are paginated.
- Video is delivered by the provider CDN.
- Structured logs, Sentry, reconciliation, backups, and runbooks are MVP requirements.

## Security

- Server-only provider credentials.
- Verified payment signatures.
- Server-authoritative prices and access.
- Short-lived video authorization.
- Production domain restrictions.
- Masked viewer-specific watermark.
- Three trusted devices and one concurrent playback session.
- Private signed resources.
- Rate limits and audit records for sensitive operations.
- Minimal collection of learner and device data.

## Detailed Documents

- Product authority: `docs/PRODUCT-BRIEF.md`
- Scope: `docs/MVP-SCOPE.md`
- Journeys: `docs/USER-JOURNEYS.md`
- Architecture: `docs/TECHNICAL-ARCHITECTURE.md`
- Decisions: `docs/adr/`
- Data: `docs/DATA-MODEL.md`
- Payments: `docs/PAYMENT-FLOW.md`
- Video: `docs/VIDEO-SECURITY.md`
- Operations: `docs/ADMIN-OPERATIONS.md`
- Delivery: `docs/STAGED-IMPLEMENTATION-PLAN.md`
- Launch: `docs/LAUNCH-CHECKLIST.md`

## Review Gate

Application implementation must not begin until the documentation set is reviewed and any requested changes are incorporated. After approval, each delivery stage should receive a separate execution-level implementation plan.
