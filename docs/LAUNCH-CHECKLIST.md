# Yosr MVP Launch Checklist

Launch requires every blocking item to be complete or explicitly waived by the responsible owner with a documented reason.

## Foundation Documentation Progress

| Task | Implementation status | Required review |
| --- | --- | --- |
| Task 0.7: Validate Supabase Development Strategy | Pinned CLI, lifecycle scripts, local configuration, Windows-safe ports, environment strategy, and local start/status/health/stop evidence are present. | Approved by the project owner for Stage 1 on 2026-06-15. |
| Task 0.8: Prepare Active Stage 0/1 Services | Readiness register, environment mappings, ownership roles, evidence rules, and external verification procedures are present. Local Supabase evidence is recorded as unverified pending signoff. | Active-service owner confirmations and external checks remain pending. |
| Task 0.9: Document Future Provider Gates | Readiness boundaries, deferred inventories, owners, checklists, and blocker scope are documented. | Product and architecture review pending. |

## Stage 1 Foundation Progress

| Task | Implementation status | Required review |
| --- | --- | --- |
| Task 1.1: Create the Arabic-First Application Shell | Arabic/RTL document defaults, public/authenticated/admin route groups, shadcn-compatible RTL configuration, identity shell and form primitives, Arabic loading/error states, mixed-direction boundaries, and Chromium/WebKit smoke coverage are implemented. Automated tests verify the shell at 360px without horizontal overflow and verify visible focus treatment. | Approved by the project owner on 2026-06-15. |
| Task 1.2: Create the Identity Data Model and First Migration | Prisma 7.8.0, the PostgreSQL adapter, the identity schema, generated-client configuration, the first reviewed SQL migration, and pgTAP coverage are implemented. The migration creates only User, LearnerProfile, and AdminAuditEvent, enforces identity uniqueness, enables RLS, and defines no browser policies. A targeted npm override resolves the Prisma CLI's vulnerable transitive `@hono/node-server` dependency to patched version 1.19.13; `npm audit` reports zero vulnerabilities. Local verification includes 16 passing database assertions, an applied migration with no schema drift, and the full project verification gate. | Approved by the project owner on 2026-06-15. |
| Task 1.3: Add Server-Only Prisma Access | Minimum `DATABASE_URL` and `TEST_DATABASE_URL` validation, a PostgreSQL adapter-backed development singleton, server-only import enforcement, focused User and LearnerProfile repositories, and database integration coverage are implemented. The ignored server-only Prisma client is regenerated before TypeScript, unit/integration test, and production build commands so clean CI checkouts do not depend on local generated files. Local verification includes 24 passing unit tests, 3 passing repository integration tests, 16 passing database assertions, and expected HTTP 503 route unavailability for anonymous and authenticated browser Data API requests while Auth remains healthy. See `docs/operations/TASK-1-3-DATABASE-ACCESS-EVIDENCE.md`. | Approved by the project owner on 2026-06-15. Hosted environment Data API denial remains a later environment-specific verification requirement. |
| Task 1.4: Add Supabase SSR Authentication | Supabase browser, server, proxy, and narrowly scoped privileged clients are implemented with explicit environment validation. `src/proxy.ts` refreshes cookie-backed Auth through trusted `getClaims()` validation, propagates refreshed cookies to request and response state, and prevents Auth-cookie responses from being publicly cached. Authenticated and Admin route groups force dynamic rendering. Local verification includes 51 passing unit tests, 8 passing Playwright tests across Chromium and WebKit when local Auth is available, live refresh of a synthetic valid stale session, credential-free CI verification with the live refresh cases skipped, stale-cookie cache checks, and a production build that reports the active Proxy middleware. | Approved by the project owner on 2026-06-15 through the instruction to commit and push after successful plan verification. |
| Task 1.5: Implement Registration and Idempotent Customer Provisioning | Arabic email/password registration, server-side validation, Supabase Auth signup, duplicate-email guidance, and transaction-backed Customer provisioning are implemented. Provisioning normalizes email, assigns only server-controlled `CUSTOMER`/`ACTIVE` defaults, creates exactly one LearnerProfile, preserves existing role/status and verified state, and repairs a missing profile without duplication. Local verification includes 61 passing unit tests, 5 passing integration tests, 16 passing database assertions, and 12 passing live Playwright tests across Chromium and WebKit with Mailpit confirmation-email evidence. | Authentication and identity-data review pending. |

## Stage 0 Readiness

**Status: APPROVED FOR STAGE 1 / EXTERNAL VERIFICATION REMAINS OPEN as of
2026-06-15.** The project owner accepted the visible residual external checks
and authorized Stage 1 to begin. See
`docs/operations/STAGE-0-EXIT-EVIDENCE.md`.

- [x] Empty application scaffold, lint, type-checking, unit tests, Playwright smoke test, production build, and full `npm.cmd run verify` are locally evidenced.
- [x] Task 0.7 Supabase strategy, pinned CLI, lifecycle scripts, tracked configuration, and sanitized local lifecycle evidence are present.
- [x] Task 0.8 foundation-service readiness register and external verification procedures are present.
- [x] Task 0.9 future-provider readiness gates are present.
- [x] `.env.example` contains only active Stage 0/1 variables with blank or example-safe values.
- [x] `docs/operations/ENVIRONMENTS.md` reflects the current scaffold and test-runner state.
- [x] `AGENTS.md` formatting and trailing whitespace are clean without semantic changes.
- [x] Playwright/e2e completes reliably after a clean dependency and browser installation; repeated direct runs and the full verification run terminated normally.
- [x] HISTORICAL CI: GitHub Actions run `27490886232` passed the complete `Quality Gates` job on synthetic PR merge commit `569e39eafe85ce9df1724d89c1cecc53d5dbbd6f`, merging head `005d9104c5790f039341ea4fc5520363e289b714` into base `9d929fc9f07ca45d8f1890a0d330d43060d63bd4`; it did not directly test the head commit.
- [x] CI-LOG REVIEW: decoded job `81255640354` masked GitHub tokens as `***`; no application/provider credential, production environment value, or secret-shaped assignment was visible in the reviewed job log.
- [ ] HUMAN/EXTERNAL VERIFICATION REQUIRED: named owners and reviewers for active Stage 0/1 services.
- [ ] HUMAN/EXTERNAL VERIFICATION REQUIRED: current-commit GitHub Actions success after the local commits are pushed.
- [ ] HUMAN/EXTERNAL VERIFICATION REQUIRED: Vercel Preview build and preview/production variable-scope isolation.
- [ ] HUMAN/EXTERNAL VERIFICATION REQUIRED: Preview Supabase isolation, controlled non-production Auth email, and Sentry settings.
- [ ] HUMAN/EXTERNAL VERIFICATION REQUIRED: production credentials and data are absent from every non-production scope.
- [x] R2, payment-provider, and video-provider accounts and credentials are correctly non-blocking until their documented future entry gates.
- [x] HUMAN GATE: project owner approved Stage 0 and authorized Stage 1 to begin on 2026-06-15; open external checks remain pending and must not be reported as verified.

## Product and Content

- [ ] Launch Categories are intentional and limited.
- [ ] Every launch Course has complete Arabic copy.
- [ ] Every launch Course states audience, outcomes, prerequisites, price, and access policy.
- [ ] School Courses display relevant school-level information.
- [ ] General Courses display relevant skill-level information where useful.
- [ ] Mentor biographies and credentials are approved.
- [ ] Curriculum order is correct.
- [ ] Required videos and resources are ready.
- [ ] Preview content is intentional.
- [ ] No draft or archived Course is publicly purchasable.

## Authentication and Authorization

- [x] Registration works.
- [ ] Email verification works.
- [ ] Login and logout work.
- [ ] Password reset works.
- [x] One Customer maps to one Learner profile.
- [ ] Customer and Admin permissions are enforced server-side.
- [ ] Customers cannot access other Customers' records.
- [ ] Disabled accounts lose protected access.
- [ ] Admin accounts are individual and protected.

## Payments

- [ ] The selected payment provider is contracted and its production merchant configuration is approved.
- [ ] Production callback and return URLs are correct.
- [ ] Provider secrets are server-only.
- [ ] Successful payment flow is tested.
- [ ] Failed payment flow is tested.
- [ ] Pending payment flow is tested.
- [ ] Expired payment flow is tested.
- [ ] Duplicate callbacks are tested.
- [ ] Delayed callbacks are tested.
- [ ] Out-of-order callbacks are tested.
- [ ] Invalid signature is rejected and alerted.
- [ ] Amount and currency mismatch is rejected.
- [ ] Browser redirect cannot grant access.
- [ ] Reconciliation is tested.
- [ ] Paid Order without Enrollment alert is tested.
- [ ] Payment status messaging is clear in Arabic.

## Enrollment and Access

- [ ] Successful payment creates exactly one Enrollment.
- [ ] Default access is 12 calendar months.
- [ ] Course-specific duration works.
- [ ] Fixed access end date works.
- [ ] Existing Enrollment dates do not change when Course policy changes.
- [ ] Expired Enrollment prevents access.
- [ ] Revoked Enrollment prevents access.
- [ ] Manual grant is audited.
- [ ] Manual revoke and restore are audited.
- [ ] Duplicate active purchase is prevented.

## Refunds

- [ ] Refund policy is published.
- [ ] Authorized refund approvers are named internally.
- [ ] Manual provider refund procedure is documented.
- [ ] Refund workflow accepts full-Order refunds only.
- [ ] Refund Record captures amount, reason, reference, Admin, and time.
- [ ] Refunded Order and Payment states are tested.
- [ ] Access revocation after refund is tested.
- [ ] Active playback ends after revocation.
- [ ] Customer refund confirmation template is ready.

## Video Security

- [ ] The selected video-provider production account and domains are configured.
- [ ] Playback authorization requires active Enrollment.
- [ ] Tokens are short-lived.
- [ ] Production token responses are not publicly cached.
- [ ] Provider secrets never reach the browser.
- [ ] Dynamic masked watermark is visible.
- [ ] Watermark exposes no sensitive learner data.
- [ ] Trusted-device limit works.
- [ ] Concurrent playback limit works.
- [ ] Device reset works.
- [ ] Suspicious authorization activity is logged.
- [ ] Direct paid-video access without Yosr authorization fails.

## Egypt Playback Pilot

- [ ] Supported Android devices tested.
- [ ] Supported iPhone/iPad devices tested.
- [ ] Desktop Chrome tested.
- [ ] Desktop Safari or supported macOS browser tested.
- [ ] Home broadband tested.
- [ ] Major Egyptian mobile networks tested.
- [ ] Low-bandwidth behavior tested.
- [ ] Startup and buffering are acceptable.
- [ ] Quality adaptation is acceptable.
- [ ] Token refresh is reliable.
- [ ] Progress survives interrupted connectivity.
- [ ] Playback failure message includes support route and trace reference.
- [ ] Selected video-provider operating cost is accepted.
- [ ] Replacement-provider decision is documented if the pilot fails.

## Learning

- [ ] My Courses shows active Courses.
- [ ] Continue Learning opens the expected Lesson.
- [ ] Lesson ordering is correct.
- [ ] Resume position works.
- [ ] Progress saves periodically.
- [ ] Seek-to-end does not falsely complete a video.
- [ ] Required resource completion works where used.
- [ ] Course progress is correct.
- [ ] Private Cloudflare R2 resources require authorization and short-lived signed URLs.
- [ ] Expired and revoked states explain support options.

## Admin Operations

- [ ] Admin can manage Categories.
- [ ] Admin can manage Mentor records.
- [ ] Admin can create, preview, publish, archive, and update Courses.
- [ ] Admin can order Sections and Lessons.
- [ ] Admin can attach and verify video IDs.
- [ ] Admin can upload course images, thumbnails, PDFs, attachments, and other non-video assets to Cloudflare R2.
- [ ] Admin can attach private R2 resources.
- [ ] Admin can find Customer, Order, Payment, and Enrollment records.
- [ ] Admin can request reconciliation.
- [ ] Admin can grant, revoke, and restore access.
- [ ] Admin can record refunds.
- [ ] Admin can reset devices.
- [ ] Sensitive actions create audit records.
- [ ] Operational lists are paginated.

## Arabic, Mobile, and Accessibility

- [x] Arabic is the default language.
- [ ] RTL layout works across public and protected pages.
- [ ] Mixed Arabic, English, numbers, prices, emails, and references render correctly.
- [ ] Core journeys work at 360px width.
- [ ] Touch targets are usable.
- [ ] Forms provide clear Arabic labels and errors.
- [ ] Keyboard navigation works.
- [x] Focus states are visible for the Task 1.1 identity primitives and public skip link.
- [ ] Contrast meets the agreed accessibility target.
- [ ] Video captions are supported where content provides them.
- [ ] Reduced-motion preference is respected.

## Security

- [ ] Security review covers identity, payments, enrollments, resources, and playback.
- [ ] Sensitive endpoints are rate-limited.
- [ ] CSRF protections are appropriate for mutations.
- [ ] Security headers and content security policy are active.
- [ ] Dependencies are scanned.
- [ ] Secrets are scanned.
- [ ] Logs contain no credentials, card data, playback tokens, or unnecessary child data.
- [ ] Preview deployments cannot use production secrets.
- [ ] Service-role and direct database credentials are server-only.
- [ ] R2 credentials are server-only and Supabase Storage/Buckets are not configured.
- [ ] Data retention and deletion procedures are documented.
- [ ] Privacy and child-data obligations have local legal review.

## Performance and Scale

- [ ] Runtime database traffic uses suitable connection pooling.
- [ ] Required indexes are reviewed against production queries.
- [ ] Public catalog caching works.
- [ ] Admin and customer lists paginate.
- [ ] No unbounded high-volume queries are known.
- [ ] Video delivery bypasses application bandwidth.
- [ ] Public and private non-video asset delivery uses Cloudflare R2.
- [ ] Payment callback duration is within provider limits.
- [ ] Basic load test covers catalog, login, status polling, and playback authorization.

## Monitoring and Recovery

- [ ] Sentry production environment is active.
- [ ] Structured logs include correlation identifiers.
- [ ] Alerts exist for failed payment events.
- [ ] Alerts exist for paid Orders without Enrollment.
- [ ] Alerts exist for elevated playback authorization failures.
- [ ] Provider incident contacts are documented.
- [ ] Database backups are enabled.
- [ ] Backup restoration has been tested.
- [ ] Payment reconciliation runbook is tested.
- [ ] Critical incident runbooks have named owners.

## Support

- [ ] WhatsApp support link works.
- [ ] Support email works.
- [ ] Support hours and response expectations are stated.
- [ ] Safe public Order references appear where needed.
- [ ] Support can find a Customer from an approved reference.
- [ ] Payment, access, refund, and device runbooks are rehearsed.
- [ ] Future chat/chatbot features are not accidentally exposed in MVP.

## Legal and Commercial

- [ ] Terms of use are published.
- [ ] Privacy policy is published.
- [ ] Refund policy is published.
- [ ] Payment and invoicing obligations are reviewed.
- [ ] Mentor content rights and agreements are complete.
- [ ] Course claims and credentials are approved.
- [ ] Data processing and cross-border provider use are reviewed.

## Final Go/No-Go

- [ ] All blocking defects are closed.
- [ ] Production deployment is tagged and recoverable.
- [ ] Admin operators have completed a full rehearsal.
- [ ] A real end-to-end purchase has been tested with controlled production credentials.
- [ ] A Learner can purchase, receive access, watch, resume, and complete a Course.
- [ ] Launch owner records the final go decision.
