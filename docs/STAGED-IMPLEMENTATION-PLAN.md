# Yosr Staged Implementation Plan

## Purpose

Define the order in which Yosr should be implemented after the documentation is approved.

This is a delivery roadmap, not an execution-level coding plan. Before each stage begins, create a small task-level plan with exact acceptance tests and file ownership. Do not ask an AI coding agent to implement multiple stages in one prompt.

## Delivery Rules

- Keep the application deployable at the end of each stage.
- Implement vertical behavior with tests, not disconnected layers.
- Use test-driven development for domain rules and security boundaries.
- Keep frontend presentation tasks separate from backend/domain tasks.
- Review generated migrations, dependencies, authentication, authorization, payments, and playback code manually.
- Update documentation and ADRs before changing an approved decision.
- Use small commits aligned to one behavior.
- Do not implement deferred features as "future-proofing."

## Stage 0: Project Standards and Provider Validation

### Goal

Prepare an implementation environment with clear conventions and validate external assumptions before product development.

### Deliverables

- Repository structure decision.
- Environment naming and secret inventory.
- Formatting, linting, type-checking, and testing standards.
- Continuous integration quality gates.
- Supabase development and production strategy.
- Paymob sandbox merchant access.
- VdoCipher development access.
- Transactional email provider choice.
- Sentry project setup plan.
- Written data-handling and log-redaction rules.

### Validation

- Developers can run the empty application and test suite.
- Preview and production secrets are separated.
- Provider credentials and callback domains are understood.
- No product feature code is required to complete this stage.

## Stage 1: Application Foundation and Identity

### Goal

Establish the application shell, database workflow, authentication, authorization, and Customer/Learner relationship.

### Deliverables

- Next.js and TypeScript foundation.
- Tailwind CSS and shadcn/ui foundation without final visual shaping.
- Prisma connection and migration workflow.
- Supabase Auth integration.
- Email/password registration.
- Email verification.
- Login, logout, and password reset.
- User synchronization and role enforcement.
- One Learner profile per Customer.
- Admin route protection.
- Structured logging and Sentry baseline.

### Required Tests

- Customer cannot access Admin operations.
- Unverified Customer cannot start checkout.
- Customer cannot access another Customer's Learner profile.
- One Customer cannot create multiple Learner profiles.
- Disabled account cannot access protected operations.

### Exit Criteria

Identity and role boundaries work in preview with no direct browser access to protected database records.

## Stage 2: Catalog and Admin Content Operations

### Goal

Allow Admins to create and publish a flexible course catalog.

### Deliverables

- Categories with optional hierarchy.
- Mentor content records.
- Course draft model.
- Optional school and skill metadata.
- Access-policy configuration with 12-month default.
- Sections, Lessons, Videos, and Resources metadata.
- Admin course editor and ordering.
- Publication validation.
- Public course listing and detail pages.
- Public catalog caching and revalidation.

### Required Tests

- New Categories require data changes, not code changes.
- General Courses do not require school metadata.
- School Courses do not require general skill level.
- Draft and archived Courses are not purchasable.
- Course price and access policy validate before publication.
- Public cache revalidates after publication changes.

### Exit Criteria

An Admin can publish a complete Course and a Visitor can evaluate it on mobile in Arabic.

## Stage 3: Enrollment and Learning Without Payments

### Goal

Build the complete protected learning journey using audited manual Enrollment grants before payment complexity is introduced.

### Deliverables

- Enrollment domain rules.
- Manual Admin grant, revoke, and restore.
- Access start and end dates.
- My Courses.
- Course learning page.
- Lesson navigation.
- Private resource authorization.
- Lesson progress and completion.
- Course completion calculation.
- Expired and revoked access states.
- Admin audit events.

### Required Tests

- Only active, unexpired Enrollment grants access.
- Course edits do not change existing Enrollment dates.
- A Learner cannot access another Learner's progress.
- Resource links require current authorization.
- Duplicate grants do not create duplicate Enrollments.
- Completion rules resist seek-to-end behavior at the domain level.

### Exit Criteria

An Admin can grant access and a Customer can complete the learning journey without payment integration.

## Stage 4: Secure Video Playback

### Goal

Integrate VdoCipher behind the internal media boundary.

### Deliverables

- Video readiness synchronization or Admin validation.
- Server-side playback authorization.
- Short-lived token policy.
- Production domain restrictions.
- Moving masked watermark.
- Trusted device records.
- One concurrent playback policy.
- Playback Sessions and heartbeat behavior.
- Player event mapping to progress.
- Playback error logging and support references.

### Required Tests

- Unauthenticated, unenrolled, expired, and revoked requests are denied.
- Provider secrets never enter browser-visible configuration.
- Token responses are not publicly cached.
- Concurrent session rules are deterministic.
- Device reset invalidates prior trust.
- Refund-style revocation ends access.
- Progress updates are idempotent and monotonic.

### Exit Criteria

The learning journey uses protected VdoCipher playback and supports observable failures.

## Stage 5: Orders and Paymob

### Goal

Implement a reliable paid enrollment flow.

### Deliverables

- Orders and one-item Order records.
- Provider-aware Payment Attempts.
- Payment Events.
- Paymob hosted checkout creation.
- Payment-status page.
- Verified Paymob callback/webhook.
- Transactional payment-to-enrollment flow.
- Retry-safe event processing.
- Scheduled and manual reconciliation.
- Confirmation email.
- Admin payment timeline.

### Required Tests

- Browser redirect cannot grant access.
- Duplicate callback creates one payment effect and one Enrollment.
- Amount, currency, merchant, or environment mismatch denies payment success.
- Out-of-order callbacks cannot regress final status.
- Delayed success completes pending payment.
- Paid Order without Enrollment is detectable and recoverable.
- Customer with active Enrollment cannot accidentally buy the same Course again.

### Exit Criteria

A Paymob sandbox purchase reliably creates access once and can recover from delayed or repeated callbacks.

## Stage 6: Refunds, Support, and Operational Hardening

### Goal

Make the MVP operable by the internal team.

### Deliverables

- Manual refund records.
- Confirmed refund state transitions.
- Access revocation and playback termination.
- WhatsApp and email support links.
- Safe public Order references.
- Operational Notes.
- Device reset workflow.
- Admin dashboard operational counts.
- Daily and weekly runbooks.
- Alerts for payment and enrollment inconsistencies.

### Required Tests

- Refund workflow preserves financial history.
- Revoked Enrollment prevents new playback and resource access.
- Sensitive Admin operations create audit records.
- Support references reveal no sensitive sequential database identifiers.
- Admin lists are paginated.

### Exit Criteria

Admins can resolve common payment, access, refund, and device cases without database access.

## Stage 7: Security, Performance, RTL, and Accessibility

### Goal

Harden the complete product before pilot traffic.

### Deliverables

- Rate limits on sensitive endpoints.
- Security headers and provider-compatible content security policy.
- Secret and dependency scanning.
- Query and index review.
- Public catalog cache verification.
- Arabic copy review.
- RTL and mixed-direction review.
- Keyboard and screen-reader review.
- Mobile device and network testing.
- Backup and restore exercise.
- Privacy, terms, refund, and support policies.

### Required Tests

- Authorization tests cover every protected operation.
- No sensitive data appears in logs or error reports.
- Critical pages meet agreed accessibility checks.
- Common mobile widths remain usable.
- Backup restoration succeeds in a controlled environment.

### Exit Criteria

The product passes internal security, mobile, Arabic, operational, and recovery review.

## Stage 8: Egypt Playback and Payment Pilot

### Goal

Validate the complete production-like experience with a small controlled audience.

### Deliverables

- VdoCipher device/network pilot.
- Paymob production-like end-to-end payment tests.
- Callback timing and reconciliation observations.
- Video cost estimate from measured watch time.
- Support response rehearsal.
- Incident runbook rehearsal.
- Defect and launch-decision report.

### Exit Criteria

- No material playback incompatibility on supported target devices.
- Payment-to-access is reliable.
- Critical incidents have an owner and recovery path.
- Video cost is acceptable.
- Pilot defects required for launch are closed.

## Optional Stage 9: Fawry

### Entry Condition

Start only when Paymob is stable and Fawry is commercially required for launch or the first post-launch increment.

### Deliverables

- Fawry provider adapter.
- Reference-code instructions.
- Pending and expiry user experience.
- Callback verification.
- Status inquiry and reconciliation.
- Provider-specific support runbook.

### Required Tests

- Long-lived pending status grants no access.
- Paid notification creates access exactly once.
- Expired references remain historical.
- Reconciliation recovers missed notification.
- Paymob behavior is unchanged.

## AI-Assisted Task Format

Every execution task should contain:

- One behavioral goal.
- Relevant document links.
- Explicit in-scope and out-of-scope items.
- Exact acceptance criteria.
- Trust boundaries and security constraints.
- Required failing tests before implementation.
- Files or module boundary permitted to change.
- Verification commands.
- Expected review focus.

Avoid prompts such as "build payments," "build the dashboard," or "finish the LMS." Split work until one agent can reason about the behavior without loading the whole system.

## Review Gates

Human review is mandatory before merging:

- Database migrations.
- Authentication and authorization.
- Payment signature verification and state transitions.
- Enrollment date calculations.
- Refund and manual grant behavior.
- VdoCipher token generation.
- Device/session enforcement.
- Environment and secret configuration.
- New dependencies.

## Post-MVP Candidates

Post-MVP planning may consider:

- Fawry if not launched earlier.
- Multiple Learners per account.
- Phone/OTP authentication.
- Live chat and helpdesk.
- AI support assistant.
- Quizzes and certificates.
- Mentor tools.

Each requires a separate product decision and must not be smuggled into MVP stages.
