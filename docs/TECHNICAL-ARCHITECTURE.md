# Yosr Technical Architecture

## Architecture Goal

Build a production-minded modular monolith that can launch quickly, scale through managed services, and preserve clear boundaries around identity, commerce, learning, and external providers.

The MVP should not use microservices. Scale is achieved first through stateless application instances, managed Postgres, caching, CDN delivery, indexes, provider isolation, and operational visibility.

## Recommended Stack

- **Application:** Next.js App Router.
- **Language:** TypeScript.
- **UI foundation:** Tailwind CSS and shadcn/ui.
- **Database:** Supabase PostgreSQL.
- **ORM and migrations:** Prisma.
- **Authentication:** Supabase Auth.
- **Object storage:** Cloudflare R2 for course images, thumbnails, PDFs, attachments, and uploaded assets.
- **Video:** Future provider abstraction; no provider is selected or implemented during the foundation stages.
- **Payments:** Provider-aware boundary; Paymob is the current first-provider candidate pending contracting and readiness approval.
- **Hosting:** Vercel.
- **Transactional email:** A dedicated email provider such as Resend or Postmark.
- **Error monitoring:** Sentry.
- **Operational logs:** Structured Vercel logs plus durable domain audit records.

## System Shape

Yosr is one deployable application with bounded modules:

### Identity

- Customer and Admin identity.
- Email verification and password reset.
- Learner profile ownership.
- Role and account-status checks.

### Catalog

- Categories.
- Mentors as content records.
- Courses, sections, lessons, and resources.
- Publication and archive state.
- Public catalog queries.

### Commerce

- Orders and order items.
- Payment attempts and provider events.
- Approved payment-provider integration.
- Future Fawry adapter.
- Refund records and reconciliation.

### Enrollment

- Access grants.
- Access policy calculation.
- Active, expired, and revoked states.
- Manual grants and refund-linked revocation.

### Learning

- Lesson visibility.
- Progress and completion.
- Resume behavior.
- Course completion calculation.

### Media

- Provider-neutral video records.
- Selected-provider playback authorization in a future video stage.
- Playback sessions.
- Cloudflare R2 asset and private-resource authorization.

### Administration

- Operational workflows.
- Sensitive-action audit log.
- Customer, payment, and enrollment support.

### Support Boundary

- WhatsApp and email links.
- Safe public references for Customer communication.
- Future integration point for chat and helpdesk systems.

## Request Boundaries

Use:

- Server-rendered or cached public catalog reads where appropriate.
- Server actions for authenticated first-party mutations when they provide a clear fit.
- Route handlers for payment callbacks, payment-status endpoints, playback authorization, scheduled reconciliation, and provider integrations.

Business rules belong in domain services, not UI components or route handlers. Route handlers authenticate, validate, call a domain operation, and translate the result into an HTTP response.

## Data Access

- The browser does not query commercial or learning tables directly.
- Prisma accesses Postgres from server-side application code.
- Supabase Auth provides identity; application services enforce authorization.
- Supabase service-role credentials remain server-only.
- Supabase Storage and Supabase Buckets are not used.
- R2 credentials remain server-only.
- Public course images and thumbnails use R2-backed CDN delivery.
- Private PDFs, attachments, and paid resources are delivered through short-lived R2 signed URLs after authorization.
- Runtime database traffic uses Supabase connection pooling.
- Migration and administrative operations use a direct database connection.

## Authorization

Every protected operation checks:

1. Authenticated session.
2. Active User record.
3. Required role.
4. Ownership or Admin permission.
5. Relevant resource status.

Playback additionally checks an active, unexpired Enrollment for the Lesson's Course.

Client-provided role, price, payment status, course ownership, or access dates are never authoritative.

## Scalability

### Application

- Keep instances stateless.
- Store durable state in Postgres or external providers.
- Avoid in-memory sessions and process-local locks.
- Use idempotency and database constraints for concurrency safety.

### Database

- Use foreign keys, uniqueness constraints, and explicit indexes.
- Paginate admin and catalog lists.
- Avoid unbounded queries.
- Keep payment events append-oriented.
- Use transactions for payment-to-enrollment changes.
- Monitor slow queries and connection utilization.

### Caching

- Cache published category, mentor, course-list, and course-detail reads.
- Revalidate affected public pages after Admin publication changes.
- Do not cache per-user enrollment or playback authorization responses publicly.
- Use immutable or versioned URLs for public images.

### Video and Files

- Video bytes are delivered by the video provider CDN, not Vercel.
- Video bytes are not stored in R2 under the application asset-storage strategy.
- Course images, thumbnails, PDFs, attachments, and uploaded assets use Cloudflare R2.
- Public images use optimized R2-backed CDN delivery.
- Paid resources use private R2 objects and short-lived signed URLs.

### Growth Path

If volume requires it, the current module boundaries allow:

- Moving webhook/event processing to a durable queue.
- Moving reconciliation to a dedicated worker.
- Adding read replicas or a separate analytics store.
- Extracting payment or media integration services.
- Replacing Supabase Auth, R2, or the selected video provider behind existing boundaries.

These are migration options, not MVP infrastructure.

## Payment Event Processing

The webhook endpoint:

1. Captures a correlation ID.
2. Validates request size and required fields.
3. Verifies provider authenticity.
4. Inserts a unique Payment Event.
5. Processes the event through a transaction-safe domain operation.
6. Returns a provider-compatible response.

Duplicate events must return success after confirming the original event was accepted. Email and non-critical side effects should not block payment confirmation.

## Observability

Logs should contain:

- Correlation ID.
- Request or event type.
- Safe User, Order, Payment, Enrollment, Course, and Lesson identifiers.
- Provider and provider reference.
- Outcome and duration.

Logs must not contain:

- Passwords or authentication tokens.
- Payment card data.
- Video playback secrets.
- Full webhook secrets or signatures.
- Sensitive child information.

Sentry should capture application exceptions with secrets and personal data filtered. Domain audit records should capture Admin actions even when application logs expire.

## Environment Strategy

Use separate local, preview/staging, and production environments.

Each environment must have separate:

- Supabase project or isolated database configuration.
- Auth redirect URLs.
- R2 buckets or isolated prefixes, credentials, and public asset domains once the storage stage begins.
- Payment-provider credentials and callback URLs only after a provider is contracted and its readiness gate passes.
- Video-provider credentials and domain settings only after a provider is selected and its readiness gate passes.
- Email configuration.
- Sentry environment.

Production secrets must never be exposed to preview deployments.

## Security Baseline

- Secure, HTTP-only session handling.
- CSRF-aware mutation patterns.
- Server-side schema validation.
- Rate limiting for login-sensitive, checkout, playback-token, and webhook endpoints.
- Strict security headers and content security policy compatible with payment and video providers.
- Dependency and secret scanning in continuous integration.
- Least-privilege provider credentials.
- Audit logs for manual grants, revocations, refunds, publication, and device resets.

## Performance Targets

Initial service targets:

- Cached public pages should be responsive on mobile networks.
- Payment callbacks should complete within provider timeout limits.
- Payment success should produce access within one minute under normal conditions.
- Playback authorization should normally complete within two seconds, excluding provider incidents.
- Admin lists must use pagination from the first release.

These targets guide measurement; they are not promises to customers.
