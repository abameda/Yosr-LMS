# Stage 0 and Stage 1 Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Use `superpowers:test-driven-development` for behavior changes. Do not commit without explicit user approval.

**Goal:** Establish Yosr's project standards, application foundation, and secure Customer/Admin identity system without implementing catalog, learning, video, or payments.

**Architecture:** Build a root-level, single-package Next.js App Router modular monolith. Use server-side Prisma access for application data and Supabase Auth for cookie-based identity, with protected application tables unavailable through the browser-facing Supabase Data API.

**Tech Stack:** Node.js 24.x, npm, Next.js, TypeScript, Tailwind CSS, shadcn/ui, Prisma 7, Supabase PostgreSQL/Auth, Cloudflare R2 for future non-video assets, Vitest, Playwright, GitHub Actions, Resend, Sentry, and Vercel.

**Provider correction:** Paymob remains a future payment candidate, while video hosting remains provider-neutral until the secure-video stage. No paid-provider contract, credentials, subscription, callback domains, or dashboard validation are required for Stage 0 or Stage 1.

**Storage decision:** Supabase remains the PostgreSQL and Auth provider. Cloudflare R2 is selected for future course images, thumbnails, PDFs, attachments, and uploaded assets. Supabase Storage/Buckets are not used, video bytes are excluded from R2, and no storage SDK or bucket configuration is required in Stage 0 or Stage 1.

---

## Verified Baseline

- The repository is clean on `master` at its only commit, `9d929fc`.
- The repository contains documentation only; no application, migration, CI, or package manifest exists.
- Node.js `24.16.0` and npm `11.13.0` are available.
- Docker, Supabase CLI, GitHub CLI, pnpm, a Git remote, and provider credentials are absent.
- Resend, npm, Node 24, GitHub Actions, Vercel, and a hybrid local/cloud Supabase strategy are the selected defaults.
- The staged roadmap still lists Paymob sandbox and VdoCipher development access under Stage 0. That delivery document must be corrected before application work begins.
- Missing Paymob or VdoCipher access is not a blocker for Stage 0 or Stage 1.

## Stage 0

### Task 0.1: Align Delivery Documentation

**Goal**

Record the revised provider sequencing in the authoritative delivery roadmap before implementation starts.

**Relevant documentation references**

- `docs/README.md` document authority
- `docs/PRODUCT-BRIEF.md` confirmed provider decisions
- `docs/adr/ADR-005-provider-aware-payments.md`
- `docs/adr/ADR-007-vdocipher-primary-video.md`
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Delivery Rules and Stages 0, 4, and 5

**Verified prerequisites**

- The user approved the provider-timing correction.
- Paymob and VdoCipher remain the intended providers; only their readiness gates move.

**Current repository findings**

- Stage 0 currently lists Paymob sandbox merchant access and VdoCipher development access as deliverables.
- The user has no Paymob contract and no VdoCipher subscription.

**In scope**

- Update Stage 0 to require only written Paymob and VdoCipher provider strategy.
- State that missing provider access does not block Stage 0 or Stage 1.
- Add VdoCipher readiness as an entry gate before Stage 4.
- Add Paymob readiness as an entry gate before Stage 5.

**Out of scope**

- Changing the approved provider choices.
- Creating provider accounts or integrations.
- Adding credentials, callback domains, SDKs, or runtime configuration.

**Expected files or module boundaries**

- Modify: `docs/STAGED-IMPLEMENTATION-PLAN.md`
- Do not modify other authoritative documents unless review discovers a direct contradiction.

**Acceptance criteria**

- Stage 0 no longer requires real Paymob or VdoCipher access.
- Stage 4 cannot begin until VdoCipher access and domain readiness are validated.
- Stage 5 cannot begin until Paymob contracting, sandbox access, and callback requirements are validated.
- Stage 0 and Stage 1 remain executable without either provider.

**Required tests or verification commands**

- `git diff --check`
- `rg -n "Paymob|VdoCipher|Stage 0|Stage 4|Stage 5" docs/STAGED-IMPLEMENTATION-PLAN.md`
- Manually compare the changed roadmap with ADR-005 and ADR-007.

**Security and review notes**

- Do not record credentials or secret-shaped placeholders.
- This is a sequencing correction, not a provider architecture change.

**Human review required before moving forward**

Yes. Approve the delivery-document correction before Task 0.2.

### Task 0.2: Scaffold the Empty Application

**Goal**

Create the deployable empty application required by Stage 0.

**Relevant documentation references**

- `docs/TECHNICAL-ARCHITECTURE.md` Recommended Stack and System Shape
- `docs/adr/ADR-003-modular-monolith-managed-services.md`
- `docs/adr/ADR-004-supabase-platform-prisma.md`
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 0

**Verified prerequisites**

- Task 0.1 is approved.
- Node.js and npm are installed.

**Current repository findings**

- No application files, package manifest, lockfile, framework configuration, or source directory exist.

**In scope**

- Root-level Next.js App Router project.
- TypeScript strict mode.
- `src/` source directory.
- Tailwind CSS.
- ESLint with Next.js Core Web Vitals and TypeScript rules.
- npm lockfile and Node `24.x` engine declaration.
- `@/*` import alias.
- Neutral readiness page.

**Out of scope**

- Authentication.
- Prisma models or migrations.
- Provider SDKs.
- Product routes or final visual shaping.

**Expected files or module boundaries**

- Create root project configuration and package files.
- Create `src/app/` and `public/`.
- Preserve `docs/` except for separately approved documentation tasks.

**Acceptance criteria**

- `npm run dev` serves a neutral application page.
- The application builds without provider credentials.
- No product feature code is introduced.
- The repository remains a single deployable application rather than a monorepo.

**Required tests or verification commands**

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Start `npm run dev` and request `http://localhost:3000/`.

**Security and review notes**

- Review every generated dependency and file.
- Remove unrequested generated examples and telemetry-facing sample code.
- Do not add Paymob or VdoCipher packages.

**Human review required before moving forward**

Yes. New dependencies and generated configuration require review.

### Task 0.3: Establish Test and Formatting Standards

**Goal**

Provide repeatable local formatting, static-analysis, unit-test, and browser-test gates.

**Relevant documentation references**

- `docs/STAGED-IMPLEMENTATION-PLAN.md` Delivery Rules and Stage 0
- `docs/TECHNICAL-ARCHITECTURE.md` Security Baseline

**Verified prerequisites**

- The empty application builds successfully.

**Current repository findings**

- No formatter, unit-test framework, browser-test framework, or verification scripts exist.

**In scope**

- Prettier and format checking.
- Vitest for unit and service tests.
- React Testing Library for components.
- Playwright for browser workflows.
- Smoke unit and browser tests.
- Aggregate `verify` script.

**Out of scope**

- Identity behavior tests.
- Database integration tests.
- Product journey tests.

**Expected files or module boundaries**

- Test and formatting configuration at the project root.
- Shared unit-test setup under `src/test/`.
- Browser tests under `tests/e2e/`.

**Acceptance criteria**

- A unit smoke test passes.
- A page smoke test passes.
- Formatting, lint, type-checking, unit tests, browser tests, and build have dedicated scripts.
- `npm run verify` runs all non-destructive local quality gates.

**Required tests or verification commands**

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run build`
- `npm run verify`

**Security and review notes**

- Browser tests use only synthetic, non-sensitive fixtures.
- Test reports and traces must not capture secrets.

**Human review required before moving forward**

No separate gate beyond normal code and dependency review.

### Task 0.4: Add GitHub Actions Quality Gates

**Goal**

Run the local quality contract automatically for pull requests and `master`.

**Relevant documentation references**

- `docs/TECHNICAL-ARCHITECTURE.md` Security Baseline
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Continuous Integration deliverable

**Verified prerequisites**

- Local verification scripts pass.
- GitHub Actions is the selected CI provider.

**Current repository findings**

- No Git remote or workflow exists.
- GitHub CLI is not installed, but it is not required to author the workflow.

**In scope**

- Node 24 workflow.
- Deterministic `npm ci`.
- Formatting, linting, type-checking, unit tests, build, and Playwright smoke tests.
- Dependency caching through the supported setup-node mechanism.

**Out of scope**

- Database tests until the Supabase foundation exists.
- Deploying migrations.
- Production deployment.

**Expected files or module boundaries**

- Create `.github/workflows/ci.yml`.

**Acceptance criteria**

- The workflow runs on pull requests and pushes to `master`.
- No repository secrets are required for the Stage 0 jobs.
- A successful run is recorded after the GitHub remote is configured.

**Required tests or verification commands**

- Run `npm run verify` locally.
- Push a review branch after explicit approval and confirm all GitHub Actions jobs pass.

**Security and review notes**

- Do not expose environment files or production values.
- Pin official actions to reviewed major versions or immutable commit SHAs according to repository policy.

**Human review required before moving forward**

Yes. Review the workflow before making it a required branch check.

### Task 0.5: Define Environment and Secret Contracts

**Goal**

Define local, cloud-development, preview/staging, and production configuration without requiring future payment or video credentials.

**Relevant documentation references**

- `docs/TECHNICAL-ARCHITECTURE.md` Environment Strategy, Data Access, and Security Baseline
- `docs/PAYMENT-FLOW.md` Security
- `docs/VIDEO-SECURITY.md` Security and Privacy

**Verified prerequisites**

- Application scaffold exists.

**Current repository findings**

- No environment template, runtime validation, or secret inventory exists.

**In scope**

- Supabase project URL and publishable key.
- Supabase server secret key where a privileged server operation is explicitly required.
- Pooled runtime database URL.
- Direct migration database URL.
- Optional shadow database URL for cloud-development migrations.
- Resend, Sentry, application URL, and test variables.
- Environment ownership and Vercel scope documentation.
- Optional documented future variable names for R2, the payment provider, and the video provider only when useful.

**Out of scope**

- Real R2, payment-provider, or video-provider variables.
- Requiring future provider variables during build, test, runtime validation, or deployment.
- Production credentials in tracked files.

**Expected files or module boundaries**

- Create `.env.example`.
- Create `docs/operations/ENVIRONMENTS.md`.
- Create a server-only environment validation module when application code begins.

**Acceptance criteria**

- Required Stage 0/1 variables are classified as public or server-only.
- Preview and staging cannot receive production secrets.
- Runtime fails clearly when an active Stage 0/1 variable is missing.
- R2, payment-provider, and video-provider values are optional and unused until their future entry gates.

**Required tests or verification commands**

- Environment-validation unit tests.
- `git grep -n -I -E "(sb_secret_|service_role|R2_.*=.+|PAYMOB.*=.+|VDOCIPHER.*=.+)" -- . ':!package-lock.json'`
- `git diff --check`

**Security and review notes**

- Do not place realistic secret-shaped values in `.env.example`.
- Browser-visible names must never contain database, Resend, Sentry-auth, Supabase-secret, R2, payment-provider, or video-provider secrets.

**Human review required before moving forward**

Yes. Environment and secret configuration is a mandatory review area.

### Task 0.6: Define Logging and Data-Handling Rules

**Goal**

Establish safe logging and data-minimization rules before identity data is introduced.

**Relevant documentation references**

- `docs/TECHNICAL-ARCHITECTURE.md` Observability
- `docs/DATA-MODEL.md` Retention
- `docs/PAYMENT-FLOW.md` Security
- `docs/VIDEO-SECURITY.md` Security and Privacy

**Verified prerequisites**

- Environment classes and secret ownership are documented.

**Current repository findings**

- No logging, redaction, retention, or sensitive-field policy exists.

**In scope**

- Correlation identifiers.
- Safe entity identifier allowlist.
- Prohibited log fields.
- Learner-data minimization.
- Error-monitoring filtering.
- Retention expectations for identity and security logs.

**Out of scope**

- Payment events.
- Playback sessions.
- Product analytics.

**Expected files or module boundaries**

- Create `docs/operations/LOGGING-AND-DATA-HANDLING.md`.

**Acceptance criteria**

- Passwords, tokens, signatures, card data, full webhook payloads, playback authorization, and unnecessary child data are prohibited.
- Full email addresses are excluded from routine structured logs.
- The future logger contract uses explicit fields rather than arbitrary object serialization.

**Required tests or verification commands**

- Manual documentation review.
- Later logger tests must prove nested secret and personal-data redaction.

**Security and review notes**

- This policy applies even before payment and video modules exist.
- Data retention must remain limited and purpose-specific.

**Human review required before moving forward**

Yes. Privacy and security review is mandatory.

### Task 0.7: Validate the Supabase Development Strategy

**Goal**

Establish an isolated Auth and PostgreSQL environment for Stage 1.

**Relevant documentation references**

- `docs/adr/ADR-004-supabase-platform-prisma.md`
- `docs/TECHNICAL-ARCHITECTURE.md` Data Access and Environment Strategy
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 0

**Verified prerequisites**

- Supabase environment variables and ownership are defined.

**Current repository findings**

- Docker and Supabase CLI are not installed.
- The approved strategy prefers local Supabase but permits a dedicated cloud-development fallback.

**In scope**

- Add the Supabase CLI as a pinned development dependency.
- Initialize local Supabase configuration.
- Prefer Docker-backed local Supabase.
- When Docker is unavailable, use a dedicated development project plus a separate shadow database for migration development.
- Keep staging and production isolated.

**Out of scope**

- Identity schema.
- Prisma migrations.
- Supabase Storage/Buckets, Cloudflare R2, Edge Functions, payment, or video configuration.

**Expected files or module boundaries**

- Create `supabase/config.toml`.
- Add npm scripts for supported Supabase lifecycle commands.
- Update `docs/operations/ENVIRONMENTS.md`.

**Acceptance criteria**

- One approved path provides isolated Auth and PostgreSQL for Stage 1.
- Neither staging nor production is used as a developer scratch database.
- Local Auth email can be captured with Mailpit when the local stack is used.
- Docker absence does not block work if the cloud-development fallback is available.

**Required tests or verification commands**

- Local path: `npx supabase start`, `npx supabase status`, and `npx supabase stop`.
- Cloud fallback: documented connection, Auth redirect, and shadow-database checks.

**Security and review notes**

- Supabase secret/service-role credentials remain server-only.
- Use current publishable and secret key terminology for new projects.

**Human review required before moving forward**

Yes. Approve project isolation, region, credential ownership, and migration access.

### Task 0.8: Prepare Active Stage 0/1 Services

**Goal**

Prepare only the external services needed for identity development, CI, observability, and preview verification.

**Relevant documentation references**

- `docs/TECHNICAL-ARCHITECTURE.md`
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stages 0 and 1

**Verified prerequisites**

- Environment strategy is approved.
- Resend, GitHub Actions, and Vercel are the selected defaults.

**Current repository findings**

- Supabase, Resend, Sentry, GitHub, and Vercel project configuration is not evidenced.
- R2, payment-provider, and video-provider access is intentionally absent and irrelevant to this task.

**In scope**

- Supabase development and staging strategy.
- Resend sender-domain and Supabase Auth SMTP plan.
- Sentry project and environment plan.
- GitHub remote and Actions availability.
- Vercel preview, staging, and production environment separation.

**Out of scope**

- Cloudflare R2 provisioning or payment/video-provider account creation.
- Payment callbacks.
- Video domains.
- Provider SDK installation.

**Expected files or module boundaries**

- Create `docs/operations/FOUNDATION-SERVICE-READINESS.md`.
- External dashboard changes are performed manually by authorized owners.

**Acceptance criteria**

- Each active service has an owner, environment mapping, and approved secret-storage location.
- Resend can deliver non-production Auth messages.
- GitHub Actions and Vercel can operate without R2, payment-provider, or video-provider variables.

**Required tests or verification commands**

- Non-production Supabase connectivity check.
- Controlled Resend or Supabase Auth email delivery.
- Successful GitHub Actions run.
- Vercel preview build using only Stage 0/1 variables.

**Security and review notes**

- Documentation stores identifiers and status, never credentials.
- Production credentials must not be exposed to preview deployments.

**Human review required before moving forward**

Yes. Service and environment readiness requires owner confirmation.

### Task 0.9: Document Future Provider Gates

**Goal**

Preserve the approved R2 storage decision and provider-neutral payment/video boundaries without blocking foundation work.

**Relevant documentation references**

- `docs/PRODUCT-BRIEF.md`
- `docs/PAYMENT-FLOW.md`
- `docs/VIDEO-SECURITY.md`
- `docs/adr/ADR-005-provider-aware-payments.md`
- `docs/adr/ADR-004-supabase-platform-prisma.md`
- `docs/adr/ADR-007-vdocipher-primary-video.md`

**Verified prerequisites**

- Task 0.1 aligned the delivery roadmap.

**Current repository findings**

- Cloudflare R2 is selected for future non-video assets, but Stage 0 and Stage 1 require no bucket or credentials.
- The user has not contracted with Paymob or another payment provider.
- The user has not selected or contracted a video provider.

**In scope**

- R2 asset-storage boundary and intended provider boundaries.
- Deferred account and credential inventories.
- Future readiness checklists and owners.
- Stage-specific blocker language.

**Out of scope**

- Contracts, subscriptions, credentials, callbacks, domains, dashboard validation, SDKs, or integration tests.

**Expected files or module boundaries**

- Create `docs/operations/FUTURE-PROVIDER-READINESS.md`.

**Acceptance criteria**

- R2 readiness blocks only the Stage 2 asset-upload work.
- Video-provider readiness blocks only Stage 4.
- Payment-provider readiness blocks only Stage 5.
- Missing access does not affect Stage 0 or Stage 1 completion.
- Future tasks retain provider-neutral application boundaries.

**Required tests or verification commands**

- Cross-check this document with the Stage 4 and Stage 5 entry gates.
- `rg -n "block|Stage 2|Stage 4|Stage 5|R2|payment provider|video provider" docs/operations/FUTURE-PROVIDER-READINESS.md docs/STAGED-IMPLEMENTATION-PLAN.md`

**Security and review notes**

- Add no real or realistic sample secrets.
- Do not install provider packages as placeholders.

**Human review required before moving forward**

Yes. Product and architecture review is required.

### Task 0.10: Stage 0 Exit Review

**Goal**

Prove Stage 0's exit criteria before identity implementation.

**Relevant documentation references**

- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 0 Validation

**Verified prerequisites**

- Tasks 0.1 through 0.9 are complete.

**Current repository findings**

- Stage 0 is currently unstarted.

**In scope**

- Consolidated application, test, CI, environment, documentation, and active-service review.

**Out of scope**

- Stage 1 identity behavior.
- R2, payment-provider, or video-provider validation.

**Expected files or module boundaries**

- Stage 0 evidence documents only.
- No additional feature modules.

**Acceptance criteria**

- Developers can run the empty application and test suite.
- CI passes.
- Preview and production secrets are separated.
- Supabase development is usable.
- Active Stage 0/1 services are ready.
- R2 and payment/video-provider absence is recorded as non-blocking.

**Required tests or verification commands**

- `npm run verify`
- Successful GitHub Actions run.
- Review environment and service-readiness documents.

**Security and review notes**

- Confirm no production secret is present in the repository, CI logs, or previews.

**Human review required before moving forward**

Yes. Human Stage 0 approval is mandatory before Stage 1.

## Stage 1

### Task 1.1: Create the Arabic-First Application Shell

**Goal**

Establish the identity-page shell without final visual design.

**Relevant documentation references**

- `docs/PRODUCT-BRIEF.md` Arabic-first and mobile-first principles
- `docs/MVP-SCOPE.md` Accounts and Arabic/mobile scope
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 1

**Verified prerequisites**

- Stage 0 has passed human review.

**Current repository findings**

- No application UI currently exists.

**In scope**

- Root `lang="ar"` and `dir="rtl"`.
- Public, authenticated, and Admin route groups.
- Foundational shadcn configuration.
- Only components required by identity forms.
- Loading and error states.

**Out of scope**

- Catalog.
- Checkout.
- Learning.
- Admin operations.
- Final branding or broad component library.

**Expected files or module boundaries**

- `src/app/`
- `src/components/ui/`
- Global styles and identity-only layout components.

**Acceptance criteria**

- Shell renders correctly at 360px.
- Mixed Arabic, English, email, numbers, and references remain readable.
- Keyboard focus is visible.
- No product routes beyond the identity foundation are introduced.

**Required tests or verification commands**

- Component tests for direction and document language.
- Playwright smoke tests in Chromium and WebKit.
- `npm run test:unit`
- `npm run test:e2e`

**Security and review notes**

- UI components do not make authorization decisions.

**Human review required before moving forward**

Yes. Arabic, RTL, mobile, and basic accessibility review is required.

### Task 1.2: Create the Identity Data Model and First Migration

**Goal**

Implement the minimum relational identity foundation.

**Relevant documentation references**

- `docs/DATA-MODEL.md` Identity and AdminAuditEvent
- `docs/adr/ADR-002-customer-and-admin-roles.md`
- `docs/adr/ADR-004-supabase-platform-prisma.md`
- `docs/TECHNICAL-ARCHITECTURE.md` Data Access

**Verified prerequisites**

- An isolated Supabase database workflow is available.
- Stage 0 database strategy has passed review.

**Current repository findings**

- No Prisma schema, generated client, migration, or database tests exist.

**In scope**

- Prisma 7 and the PostgreSQL driver adapter.
- `UserRole` with `CUSTOMER` and `ADMIN`.
- `UserStatus` with `ACTIVE` and `DISABLED`.
- `User` with internal UUID, unique Supabase Auth UUID, normalized email, role, status, verification timestamp, and UTC timestamps.
- `LearnerProfile` with a unique User reference, display name, optional educational-level label, and UTC timestamps.
- Minimal `AdminAuditEvent` needed to audit initial Admin role creation.
- RLS enabled with no browser policies on protected tables.

**Out of scope**

- Category, Mentor, Course, Enrollment, Order, Payment, Video, Resource, Progress, Device, PlaybackSession, RefundRecord, or OperationalNote.

**Expected files or module boundaries**

- `prisma/schema.prisma`
- `prisma.config.ts`
- Generated Prisma client output under a server-only generated directory.
- `prisma/migrations/`
- Database tests under `supabase/tests/database/`.

**Acceptance criteria**

- Supabase Auth UUID is unique.
- Normalized email is unique.
- `LearnerProfile.userId` is unique.
- Database constraints enforce at most one Learner profile per User.
- Protected tables reject browser Data API access.

**Required tests or verification commands**

- Write failing database constraint and RLS tests first.
- `npx prisma validate`
- `npx prisma generate`
- `npx prisma migrate dev --name identity_foundation`
- `npx supabase test db`
- Run identity database integration tests.

**Security and review notes**

- Runtime uses a pooled URL.
- Migration development uses a direct URL and, for cloud development, a dedicated shadow database.
- Review generated SQL; do not rely only on the Prisma model.

**Human review required before moving forward**

Yes. Database migrations and RLS are mandatory review areas.

### Task 1.3: Add Server-Only Prisma Access

**Goal**

Ensure application data is accessed only through trusted server code.

**Relevant documentation references**

- `docs/TECHNICAL-ARCHITECTURE.md` Data Access and Authorization
- `docs/adr/ADR-004-supabase-platform-prisma.md`

**Verified prerequisites**

- Identity migration is approved and applies cleanly.

**Current repository findings**

- No database client or repository boundary exists.

**In scope**

- Minimum server-only database environment validation before runtime code
  consumes `DATABASE_URL`, plus `TEST_DATABASE_URL` validation only for
  database integration tests.
- PostgreSQL adapter-backed Prisma client.
- Development-safe singleton behavior.
- Server-only import boundary.
- Identity repositories for User and LearnerProfile persistence.

**Out of scope**

- Broad application environment validation for Auth, application URLs, email,
  Sentry, Vercel deployment guards, privileged Supabase access, or deferred
  providers.
- Browser Prisma access.
- Browser Supabase table queries.
- Generic repository abstraction for future modules.

**Expected files or module boundaries**

- `src/lib/environment/database.ts`
- `src/lib/database/`
- `src/modules/identity/repositories/`
- Generated Prisma client remains server-only.

**Acceptance criteria**

- Missing, empty, malformed, non-PostgreSQL, or direct Supabase
  `DATABASE_URL` values fail before Prisma Client construction without
  exposing the value.
- Database integration tests require an explicit `TEST_DATABASE_URL` and do
  not fall back to `DATABASE_URL`.
- Client Components cannot import database modules.
- Identity repositories expose only operations required by Stage 1.
- Browser publishable credentials cannot read or modify protected tables.

**Required tests or verification commands**

- Write failing repository and import-boundary tests.
- Run database integration tests.
- Verify anonymous and authenticated Data API requests are denied.
- `npm run typecheck`
- `npm run test:unit`

**Security and review notes**

- Never expose `DATABASE_URL`, direct database credentials, or Supabase server secrets to browser bundles.

**Human review required before moving forward**

Yes. Database access boundaries require review.

### Task 1.4: Add Supabase SSR Authentication

**Goal**

Establish trusted cookie-based authentication and session refresh.

**Relevant documentation references**

- `docs/adr/ADR-002-customer-and-admin-roles.md`
- `docs/TECHNICAL-ARCHITECTURE.md` Authorization and Data Access
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 1

**Verified prerequisites**

- Supabase Auth development configuration is available.
- Database access boundaries pass tests.

**Current repository findings**

- No authentication code, cookie refresh proxy, or protected routes exist.

**In scope**

- Supabase browser Auth client.
- Supabase server Auth client.
- Cookie refresh through Next.js `proxy.ts`.
- Trusted claim validation.
- Dynamic rendering for authenticated routes.
- Server-only privileged client only for narrowly controlled tests or administrative provisioning.

**Out of scope**

- OAuth.
- Phone or OTP authentication.
- Direct browser application-table access.

**Expected files or module boundaries**

- `src/lib/supabase/`
- Root `proxy.ts`
- `src/modules/identity/session/`

**Acceptance criteria**

- Valid sessions refresh correctly.
- Forged, expired, or stale cookies do not authorize protected operations.
- Authenticated responses are not publicly cached.

**Required tests or verification commands**

- Write failing cookie and claims-validation tests first.
- Unit tests for cookie propagation.
- Playwright tests for expired sessions.
- `npm run test:unit`
- `npm run test:e2e`

**Security and review notes**

- Do not use server-side `getSession()` as the authorization decision.
- Validate trusted claims on protected requests.

**Human review required before moving forward**

Yes. Authentication code requires mandatory review.

### Task 1.5: Implement Registration and Idempotent Customer Provisioning

**Goal**

Register a Customer and create exactly one Learner profile.

**Relevant documentation references**

- `docs/PRODUCT-BRIEF.md` Accounts
- `docs/USER-JOURNEYS.md` Journey 3
- `docs/adr/ADR-002-customer-and-admin-roles.md`
- `docs/DATA-MODEL.md` Identity

**Verified prerequisites**

- Supabase SSR Auth and identity repositories are available.
- Registration email delivery is available through Mailpit or the approved development email path.

**Current repository findings**

- Registration and local identity synchronization are unimplemented.

**In scope**

- Arabic email/password registration form.
- Server-side schema validation.
- Supabase Auth signup.
- Idempotent `provisionCustomer(authIdentity)` transaction.
- Default `CUSTOMER` role and `ACTIVE` status.
- Single LearnerProfile creation.

**Out of scope**

- Phone/OTP.
- Multiple Learners.
- School, address, exact birth date, or other unnecessary child data.

**Expected files or module boundaries**

- Registration route and Server Action.
- `src/modules/identity/services/`
- Identity repository tests and integration fixtures.

**Acceptance criteria**

- A new Auth user receives one local User and one LearnerProfile.
- Repeated provisioning repairs partial failure without duplicates.
- Existing email guidance directs the user to login or password reset.
- The browser cannot choose role, status, or owner identifiers.

**Required tests or verification commands**

- Write failing service and transaction tests first.
- Run the focused test and confirm the expected failure.
- Implement the smallest provisioning behavior.
- Run unit, integration, and registration E2E tests.
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:e2e`

**Security and review notes**

- Never log passwords, Auth tokens, or full registration payloads.
- Normalize email consistently before persistence.

**Human review required before moving forward**

Yes. Authentication and identity-data changes require review.

### Task 1.6: Implement Email Verification and Session Lifecycle

**Goal**

Complete email verification, login, logout, and password reset.

**Relevant documentation references**

- `docs/MVP-SCOPE.md` Accounts
- `docs/USER-JOURNEYS.md` Journey 3
- `docs/PRODUCT-BRIEF.md` confirmed authentication decision

**Verified prerequisites**

- Registration and Customer provisioning pass tests.
- Local Mailpit or Resend-backed non-production email is available.

**Current repository findings**

- No auth routes, callbacks, email templates, or reset flow exist.

**In scope**

- Email-confirmation callback.
- Resend-verification action.
- Login.
- Logout through a state-changing server operation.
- Forgot-password request.
- Password-reset callback and update.
- Arabic success and failure messaging.

**Out of scope**

- OAuth.
- Application transactional emails unrelated to Auth.
- Support ticketing.

**Expected files or module boundaries**

- Auth route group.
- `/auth/callback`
- Identity Server Actions and validation utilities.

**Acceptance criteria**

- Verified users can log in.
- Unverified users receive clear Arabic guidance.
- Expired verification links can be replaced.
- Password reset completes through a valid callback.
- Auth redirects cannot send users to untrusted external URLs.

**Required tests or verification commands**

- Write failing redirect-validation and auth-flow tests first.
- Playwright flows through Mailpit for local execution.
- Controlled staging email verification.
- `npm run test:unit`
- `npm run test:e2e`

**Security and review notes**

- Allow only relative, explicitly accepted redirect destinations.
- Auth callback tokens must not enter logs.
- Authenticated routes must be dynamic and private.

**Human review required before moving forward**

Yes. Authentication flows require mandatory review.

### Task 1.7: Centralize Principal and Role Enforcement

**Goal**

Enforce authentication, account status, email verification, and role rules server-side.

**Relevant documentation references**

- `docs/TECHNICAL-ARCHITECTURE.md` Authorization
- `docs/ADMIN-OPERATIONS.md` Access and Accountability
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 1 Required Tests

**Verified prerequisites**

- Auth-to-local-User synchronization is reliable.

**Current repository findings**

- No Principal model, authorization policies, protected layouts, or Admin bootstrap process exists.

**In scope**

- `Principal` containing trusted Auth and local User context.
- `requirePrincipal`.
- `requireActiveCustomer`.
- `requireVerifiedCustomer`.
- `requireAdmin`.
- Protected account and Admin layouts.
- One-time Admin bootstrap script with reason and AdminAuditEvent.

**Out of scope**

- Admin product operations.
- Granular Admin permissions.
- Checkout implementation.
- Payment status.

**Expected files or module boundaries**

- `src/modules/identity/authorization/`
- Protected route layouts.
- `scripts/bootstrap-admin.ts`

**Acceptance criteria**

- Customer cannot access Admin routes or operations.
- Disabled account cannot access protected operations.
- Unverified Customer fails the future checkout precondition without requiring checkout code.
- Client-supplied role, status, or verification values are ignored.
- Initial Admin creation is explicit and audited.

**Required tests or verification commands**

- Write failing tests for every Stage 1 authorization invariant.
- Customer versus Admin route tests.
- Disabled-account tests.
- Unverified-Customer policy test.
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:e2e`

**Security and review notes**

- The bootstrap script requires an explicit email, reason, direct database access, and confirmation that no initial Admin exists.
- Shared Admin accounts are prohibited.

**Human review required before moving forward**

Yes. Authorization and role changes require mandatory review.

### Task 1.8: Implement Owned Learner Profile Operations

**Goal**

Allow Customers to read and update only their own Learner profile.

**Relevant documentation references**

- `docs/PRODUCT-BRIEF.md` Customer and Learner definitions
- `docs/MVP-SCOPE.md` Accounts
- `docs/DATA-MODEL.md` LearnerProfile

**Verified prerequisites**

- Principal and Customer guards pass.

**Current repository findings**

- No account page or profile behavior exists.

**In scope**

- Read the profile owned by the authenticated Customer.
- Edit display name.
- Edit optional educational-level label.
- Derive User ownership from the trusted Principal.

**Out of scope**

- Birth year unless separately justified.
- Precise birth date.
- School, address, family accounts, or additional Learners.

**Expected files or module boundaries**

- Customer account route.
- Identity profile service and repository methods.
- Focused account components.

**Acceptance criteria**

- No action accepts a client-supplied owner User ID.
- A Customer cannot read or modify another Customer's LearnerProfile.
- A second LearnerProfile cannot be created for the same Customer.

**Required tests or verification commands**

- Write failing ownership and uniqueness tests first.
- Run service and database integration tests.
- Run account-page Playwright tests.
- `npm run test:integration`
- `npm run test:e2e`

**Security and review notes**

- Minimize learner data.
- Use safe generic references in logs and errors.

**Human review required before moving forward**

Yes. Ownership and learner privacy require review.

### Task 1.9: Add Structured Logging and Sentry Baseline

**Goal**

Make identity operations observable without leaking sensitive information.

**Relevant documentation references**

- `docs/TECHNICAL-ARCHITECTURE.md` Observability
- `docs/DATA-MODEL.md` Retention
- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 1
- Stage 0 logging and data-handling policy

**Verified prerequisites**

- Logging policy and Sentry environment ownership are approved.

**Current repository findings**

- No structured logger, correlation ID utility, or Sentry integration exists.

**In scope**

- Server-only structured logger.
- Correlation IDs.
- Explicit safe identifier fields.
- Redaction tests.
- Sentry client, server, and edge initialization.
- Controlled synthetic verification event.

**Out of scope**

- Session Replay.
- Product analytics.
- Payment or playback telemetry.

**Expected files or module boundaries**

- `src/lib/observability/`
- Sentry instrumentation and configuration files.
- Verification script or protected non-production test path.

**Acceptance criteria**

- Auth failures and authorization denials are traceable.
- Passwords, tokens, full email addresses, child data, and secrets are absent.
- Preview, staging, and production use distinct Sentry environment labels.

**Required tests or verification commands**

- Write failing redaction tests first.
- Logger unit tests.
- Mocked Sentry transport tests.
- Send one synthetic staging event and inspect its sanitized fields.

**Security and review notes**

- Disable default PII transmission.
- Do not enable Session Replay in Stage 1.

**Human review required before moving forward**

Yes. Observability and data filtering require review.

### Task 1.10: Expand CI for Database and Identity Tests

**Goal**

Run migrations and identity security tests in an isolated CI environment.

**Relevant documentation references**

- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 1 Required Tests
- `docs/TECHNICAL-ARCHITECTURE.md` Security Baseline

**Verified prerequisites**

- The complete local identity suite passes.
- The migration and RLS policy have passed review.

**Current repository findings**

- Stage 0 CI has no database or identity jobs.

**In scope**

- Start isolated Supabase in GitHub Actions.
- Apply reviewed Prisma migrations.
- Run pgTAP tests.
- Run application integration tests.
- Run Playwright identity flows.

**Out of scope**

- Applying migrations to staging or production.
- R2, payment-provider, or video-provider environment variables.

**Expected files or module boundaries**

- Extend `.github/workflows/ci.yml` or add a focused database workflow.
- Add deterministic CI fixtures only.

**Acceptance criteria**

- All five required Stage 1 security tests execute in CI:
  - Customer cannot access Admin operations.
  - Unverified Customer cannot satisfy the future checkout guard.
  - Customer cannot access another Customer's Learner profile.
  - One Customer cannot create multiple Learner profiles.
  - Disabled account cannot access protected operations.
- Tests fail when the corresponding protection is deliberately removed.
- CI requires no remote provider credentials.

**Required tests or verification commands**

- `npm run test:unit`
- `npm run test:integration`
- `npx supabase test db`
- `npm run test:e2e`
- Confirm a successful GitHub Actions run from a clean clone.

**Security and review notes**

- CI uses local generated Supabase credentials.
- Upload failure artifacts only after confirming they contain no tokens or email contents.

**Human review required before moving forward**

Yes. Workflow and database-test configuration require review.

### Task 1.11: Preview Deployment and Stage 1 Exit Gate

**Goal**

Prove the identity and role boundaries in a production-like non-production environment.

**Relevant documentation references**

- `docs/STAGED-IMPLEMENTATION-PLAN.md` Stage 1 Exit Criteria
- `docs/TECHNICAL-ARCHITECTURE.md` Environment Strategy
- `docs/LAUNCH-CHECKLIST.md` Authentication and Authorization

**Verified prerequisites**

- Tasks 1.1 through 1.10 pass all tests and review gates.

**Current repository findings**

- No Vercel or staging deployment exists.

**In scope**

- Stable staging deployment.
- Staging Supabase project.
- Resend SMTP for staging Auth email.
- Staging Sentry environment.
- Stage 1 exit evidence.

**Out of scope**

- Cloudflare R2.
- Payment providers.
- Video providers.
- Catalog, enrollment, learning, payments, or media.

**Expected files or module boundaries**

- Vercel environment configuration outside the repository.
- Create `docs/operations/STAGE-1-EXIT-EVIDENCE.md`.

**Acceptance criteria**

- Registration, verification, login, logout, and password reset work in staging.
- Customer ownership and Admin denial work.
- Disabled accounts lose protected access.
- Browser Data API access to protected tables fails.
- No production secret is present in preview or staging.
- Stage 1 works with no R2 bucket, payment-provider account, video-provider subscription, or related credential.

**Required tests or verification commands**

- `npm run verify`
- `npx supabase test db`
- `npm run test:integration`
- `npm run test:e2e`
- Run the staging identity smoke suite and record evidence.

**Security and review notes**

- Confirm Auth redirect URLs exactly match approved local and staging origins.
- Confirm authenticated responses are private and not CDN-cached.

**Human review required before moving forward**

Yes. Human Stage 1 approval is mandatory before any Stage 2 planning or work.

## Deferred Provider Gates

### Before Stage 2 Asset Uploads: Cloudflare R2 Readiness

The first R2-backed asset task must not begin until:

- A Cloudflare account and non-production R2 bucket or approved isolated prefix exist.
- Server-side R2 credentials and ownership are defined.
- Public asset delivery and private signed-URL behavior are documented.
- Course images, thumbnails, PDFs, attachments, and uploaded assets are covered.

Until this gate, no R2 credentials, environment variables, SDK, bucket, or dashboard validation is required.

### Before Stage 4: Video Provider Readiness

Stage 4 must not begin until:

- A video provider is selected and any required commercial agreement is approved.
- Development credentials and staging domains are available.
- Server-side authorization and credential-storage requirements are understood.
- Provider cost and Egypt pilot prerequisites have an owner.

Until this gate, no video-provider credentials, environment variables, SDK, dashboard validation, or subscription is required.

### Before Stage 5: Payment Provider Readiness

Stage 5 must not begin until:

- A payment provider is selected and contracted, with sandbox merchant access available.
- HMAC/signature verification requirements are confirmed.
- Return and callback domain ownership is ready.
- Sandbox and production environment separation is documented.
- Reconciliation and support contacts have owners.

Until this gate, no payment-provider credentials, environment variables, SDK, callback endpoint, dashboard validation, or merchant access is required.

Failure to provision R2 or contract payment/video providers does not invalidate or block Stage 0 or Stage 1.

## Implementation Rules

- Execute one task at a time.
- Use failing tests before behavioral implementation.
- Stop at every mandatory human-review gate.
- Do not begin Stage 2 or beyond.
- Do not add deferred models, SDKs, placeholders, or abstractions as future-proofing.
- Keep frontend presentation tasks separate from domain and security tasks.
- Review migrations, dependencies, authentication, authorization, environment configuration, and secret handling manually.
- Do not commit unless the user explicitly requests a commit.
- Use current official guidance for Next.js, Supabase SSR and local development, Prisma, Sentry, Vercel, and Playwright when executing the plan.
