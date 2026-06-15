# Environment and Secret Contract

## Purpose

This document defines configuration ownership and isolation for Yosr local
development, cloud development, preview, staging, and production environments.
It implements the environment, data-access, payment-security, and
video-security rules in the approved architecture.

The tracked `.env.example` is a name-and-shape contract only. It must never
contain working credentials or realistic secret-shaped placeholders.

## Non-Negotiable Rules

- Browser-visible variables contain only values explicitly classified as
  public. A `NEXT_PUBLIC_` name is a release decision because its value is
  embedded in browser assets.
- Database URLs, privileged Supabase keys, Resend keys, Sentry auth tokens, and
  all future storage, payment, and video credentials are server-only.
- Runtime Prisma Client construction consumes `DATABASE_URL`, which must be a
  pooled Supabase connection. Prisma 7 CLI, migration, and administrative
  database commands use `DIRECT_URL` through `prisma.config.ts`.
- Preview and staging use non-production projects, databases, keys, email
  configuration, and Sentry environments. They never receive production
  secrets or production learner data.
- Production credentials exist only in the production service dashboard or an
  approved production secret store. They are never copied to local files,
  preview deployments, CI logs, documentation, or issue trackers.
- R2, payment-provider, and video-provider configuration is absent until its
  documented readiness gate passes. Builds, tests, and deployments must not
  require those future variables.

## Environment Classes

| Environment | Purpose and data | Configuration source | Vercel mapping |
| --- | --- | --- | --- |
| Local | Daily development against local Supabase when available. Synthetic data only. | Untracked `.env.local`, populated from `.env.example`. | Vercel Development values may be pulled only when they belong to a non-production development project. |
| Cloud development | Fallback when the local Supabase stack is unavailable. Uses a dedicated development Supabase project and, when needed, a separate shadow database. Synthetic data only. | Untracked `.env.local` plus owner-issued development credentials. | Not a public deployment tier. Do not use staging or production as a developer database. |
| Preview | Ephemeral branch verification. Uses preview-only Supabase, email, and Sentry resources. Data is disposable. | Vercel Preview target in a non-production project. Enable automatic Vercel system environment variables. | `VERCEL_ENV=preview`, `APP_ENV=preview`. Use a branch-specific `APP_URL` when configured; otherwise derive it from `https://${VERCEL_BRANCH_URL}`. Never attach production-target values to Preview. |
| Staging | Stable pre-production verification with explicit callback and redirect URLs. Uses staging-only resources and sanitized or synthetic data. | Prefer a dedicated staging Vercel project and its Production target, so staging values cannot leak to arbitrary previews. | `VERCEL_ENV=production`, `APP_ENV=staging` in the staging project. |
| Production | Live customer traffic and production data. | Production Vercel project, Production target, and approved production provider dashboards. | `VERCEL_ENV=production`, `APP_ENV=production`. |

Using separate Vercel projects for staging and production is the default
isolation boundary. If that topology changes, a human security review must
prove that the Preview target and branch overrides cannot resolve any production
credential before the change is accepted.

## Supabase Development Operating Strategy

Docker-backed local Supabase is the preferred Stage 1 environment. A dedicated
cloud-development project is the approved fallback when a Docker-compatible
runtime is unavailable. Both paths provide isolated Supabase Auth and Postgres;
neither path may use Preview, staging, or production as a developer scratch
environment.

### Preferred Path: Local Supabase

The repository pins the Supabase CLI as an npm development dependency. Use the
npm scripts so every developer runs the repository version. Start and inspect
the local stack first:

```powershell
npm ci
npm run supabase:start
npm run supabase:status
```

The equivalent acceptance commands are `npx supabase start` and
`npx supabase status`. The local stack requires Docker Desktop or another
Docker-compatible runtime with a running daemon.

Supabase CLI and Docker may publish the Auth, database, Mailpit, and pooler
ports on host interfaces rather than enforce loopback-only binding. Run this
stack only on a trusted development network or on a host whose firewall blocks
inbound access to the configured ports. Treat all reported local keys and
passwords as shared development credentials, not as secrets suitable for remote
access or production use. Stop the stack after use as required below.

The tracked `supabase/config.toml` enables only the local services needed for
Stage 1:

The local ports use the `5532x` range to avoid Windows dynamic port exclusions
that can reserve the Supabase CLI defaults.

| Service | Local address | Purpose |
| --- | --- | --- |
| Supabase Auth gateway | `http://localhost:55321` | Base URL for local Auth routes such as `/auth/v1`; it is not a general Data API endpoint. |
| PostgreSQL direct connection | `localhost:55322` | `DIRECT_URL` and migration or administrative access. |
| PostgreSQL transaction pooler | `localhost:55329` | Runtime `DATABASE_URL`. |
| Mailpit | `http://localhost:55324` | Captures local Auth confirmation and recovery email; it does not deliver mail externally. |

After startup, use `npm run supabase:status` to confirm the running services and
obtain generated local keys and database details. Put the resulting values only
in untracked `.env.local`:

- `APP_ENV=local` and `APP_URL=http://localhost:3000`.
- `NEXT_PUBLIC_SUPABASE_URL=http://localhost:55321` points to the tracked local
  Auth gateway. Do not treat this base URL as a generic API surface.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` receives the reported browser-safe
  local publishable key.
- `DATABASE_URL` derives from the reported direct database URL but uses port
  `55329`, the tenant-qualified local user `postgres.pooler-dev`, and
  `sslmode=disable`. Keep the password reported by the local CLI.
- `DIRECT_URL` uses the direct local database endpoint on port `55322`.
- `SHADOW_DATABASE_URL` is not required for the local path; the CLI-managed
  shadow database uses the configured local shadow port.

Start the Next.js application at `http://localhost:3000`. To check local Auth
email, create a disposable local user or request a password reset, then confirm
that the message appears in Mailpit and that its link returns only to an allowed
`http://localhost:3000` path. Do not configure external SMTP for this check.

After the application, Auth, redirect, and Mailpit checks are complete, stop the
local stack as the final teardown step:

```powershell
npm run supabase:stop
```

The equivalent teardown command is `npx supabase stop`.

The browser-facing Data API, PostgREST, and GraphQL endpoint are disabled in the
tracked local configuration for this Stage 0/1 foundation. Storage, Buckets,
Realtime, Studio, Analytics, and Edge Functions are also disabled because they
are outside the Stage 0/1 boundary.

With `[api].enabled = false`, the local gateway remains available for Auth while
the PostgREST service is not started. An HTTP `503` response from a local
`/rest/v1/*` request is therefore the expected unavailable-route result and
satisfies the local "not exposed / not client-consumable" boundary. It is not a
table-level authorization result and does not replace the migration assertions
that RLS is enabled, browser roles have no grants, and no browser policies
exist. A hosted development, preview, or staging project must record its own
browser Data API denial evidence because its service topology may differ.

### Approved Fallback: Cloud Development

Docker absence must not block Stage 1 when the platform owner has provisioned
both of these non-production resources:

1. One dedicated Supabase development project for application Auth and
   PostgreSQL.
2. One separate, disposable PostgreSQL shadow database. Prefer a second
   development-only Supabase project so its project identity is unambiguous.

The two resources must not be a staging or production project, must contain
only synthetic data, and must not share credentials with Preview, staging, or
production. Store owner-issued values in untracked `.env.local` with
`APP_ENV=cloud-development`:

- Use the development project's URL and publishable key for
  `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Use the development project's transaction pooler connection for the runtime
  `DATABASE_URL`.
- For `DIRECT_URL`, use the development project's direct database endpoint when
  the developer network has IPv6 connectivity or the project has the Supabase
  IPv4 add-on. On an IPv4-only network without that add-on, use the development
  project's Shared Pooler in session mode on port `5432`.
- Apply the same network-dependent choice to `SHADOW_DATABASE_URL` for the
  separate shadow resource: its direct endpoint with IPv6 or the IPv4 add-on,
  otherwise its Shared Pooler session-mode endpoint on port `5432`.
- Add `SUPABASE_SECRET_KEY` only when an implemented server-only operation
  requires it. Never expose it to browser code or prefix it with
  `NEXT_PUBLIC_`.

The direct database endpoint is IPv6 unless the project has the IPv4 add-on.
The Shared Pooler session-mode connection is the approved migration and
administrative alternative for IPv4-only developer networks. Do not substitute
transaction mode for `DIRECT_URL` or `SHADOW_DATABASE_URL`.

The verified local stack runs PostgreSQL `17.6`, and the tracked
`supabase/config.toml` therefore sets `db.major_version = 17`. Before selecting
or linking a cloud-development project, obtain the PostgreSQL major version
through each candidate `DATABASE_URL`, `DIRECT_URL`, and `SHADOW_DATABASE_URL`
connection. The development runtime, development migration/admin, and shadow
connections must all report the same PostgreSQL major version because migration
behavior can be version-dependent. Fail closed if any version cannot be
determined or if any major version differs. No cloud project version is assumed
verified by this document. If the selected development project's major version
differs from `17`, either select a version-17 project or deliberately update
`db.major_version` to match the linked remote project, restart local Supabase,
and reverify the local stack before approval. The shadow resource must then use
that same major version.

Use current Supabase publishable-key and secret-key terminology for newly
created projects. Do not copy key or database values into commands saved in
shell history, documentation, logs, tickets, or screenshots.

Complete these checks before cloud migration development:

Use a credential-safe database client or a future repository preflight wrapper
that reads `DATABASE_URL`, `DIRECT_URL`, and `SHADOW_DATABASE_URL` from the
process environment internally. It must not place full URLs or passwords in
command arguments or shell history, and it must emit only the sanitized fields
approved below. This task does not create that future wrapper. Through each
connection, execute the equivalent of:

```sql
select
  current_database() as database_name,
  current_setting('server_version') as server_version;
```

All three connections must succeed using the approved connection mode for each
URL: transaction pooler for `DATABASE_URL`, and either the reachable direct
endpoint or Shared Pooler session mode on port `5432` for `DIRECT_URL` and
`SHADOW_DATABASE_URL`. Record the database name and PostgreSQL major version
reported for each connection, and require all three major versions to match.
Fail closed on a connection failure, an unavailable version, or a major-version
mismatch. A client or wrapper may inspect `current_user` transiently as
connectivity evidence, but it must not emit or retain that value.

SQL output alone cannot prove Supabase project identity because
`current_database()` and `current_user` commonly return the same values across
projects. Separately inspect URL metadata without printing or recording a full
URL, password, or other credential:

1. For a Supabase direct endpoint matching
   `db.<project-ref>.supabase.co`, normalize `<project-ref>` from the host.
2. For a Supabase Shared Pooler endpoint, normalize `<project-ref>` from the
   `postgres.<project-ref>` username. Do not use the pooler host as project
   identity.
3. Normalize the database name from the URL path and classify the connection
   mode as transaction pooler, direct, or Shared Pooler session mode.
4. Require `DATABASE_URL` and `DIRECT_URL` to resolve to the same normalized
   development project reference and database name. Their connection modes are
   expected to differ.
5. Require `SHADOW_DATABASE_URL` to resolve to a project or resource identity
   different from both development URLs. Record its database name and
   PostgreSQL major version as well.

A non-Supabase shadow database does not have, and must not be assumed to have, a
Supabase project reference. Its accepted identity is an immutable provider
control-plane resource, cluster, or database ID obtained by the accountable
database owner from the authenticated provider dashboard or provider API.
Compare that ID with the provisioned shadow target and environment inventory to
prove that the resource is dedicated to cloud development, disposable, not
staging or production, and distinct from the Supabase development project or
resource. SQL database, user, and version values prove connectivity and version
only; they do not prove resource identity. If the provider cannot expose an
immutable control-plane identity or the accountable owner cannot verify it,
reject the shadow target. Reject migration access if development identity or
database-name equality is not established, or if shadow separation cannot be
proven. URL string inequality is insufficient.

Keep only sanitized preflight evidence: the normalized Supabase project
reference, or for a non-Supabase shadow its provider label and sanitized
immutable resource ID, plus the database name, connection mode, and PostgreSQL
major version for each connection. Never retain full URLs, passwords, tokens,
database users, or unredacted command output.

In the cloud-development project's Auth URL Configuration:

1. Set Site URL to the explicit cloud-development `APP_URL`.
2. Add only the required cloud-development callback paths. Do not add staging
   or production callbacks.
3. Request a disposable confirmation, magic-link, or recovery email with that
   redirect target.
4. Confirm the link is accepted for the development URL and that a staging or
   production redirect target is rejected.

The fallback is ready only when the database owner records the successful
connection and identity checks without recording credentials, and the Auth
owner records the redirect result without recording tokens.

### Required Human Approval

Before Stage 1 uses either path, reviewers must approve:

- local versus cloud-development isolation and confirm no developer command
  targets Preview, staging, or production;
- ownership and rotation responsibility for the credentials used by the
  selected path; and
- development Auth Site URL, allowed redirects, and local email-capture or
  cloud email-delivery ownership, as applicable.

Only when the cloud fallback is used or provisioned, reviewers must also
approve:

- the cloud project name, project reference, organization, and region;
- equality of the PostgreSQL major versions reported by `DATABASE_URL`,
  `DIRECT_URL`, and `SHADOW_DATABASE_URL`, plus the development project's match
  with local `db.major_version`, with approval denied on any mismatch or
  unverifiable version;
- transaction pooler use and network reachability for runtime `DATABASE_URL`;
- the selected migration and administrative connection mode for `DIRECT_URL`,
  including IPv6 or IPv4 add-on reachability for a direct endpoint, or Shared
  Pooler session mode on port `5432` for an IPv4-only network without the
  add-on; and
- when a separate shadow resource is provisioned, its sanitized Supabase
  project reference or non-Supabase provider label and immutable resource ID,
  database name, PostgreSQL major version, connection mode and network
  reachability, credential ownership, least-privilege access, and evidence that
  it is separate and disposable. Do not record additional non-Supabase
  control-plane metadata.

## Active Stage 0/1 Variables

### Public

These values may be embedded in browser code. Public does not mean
environment-independent: every environment receives its own values.

| Variable | Required when | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Every application runtime | URL of the environment's Supabase project. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Every application runtime | Browser-safe publishable key. It does not replace server-side authorization. |
| `NEXT_PUBLIC_SENTRY_DSN` | Browser monitoring is active | Presence is the browser activation gate. A DSN is a routing identifier, not a Sentry auth token, and must match the environment's Sentry project. |

No other Stage 0/1 variable is browser-visible.

### Non-Public Configuration

| Variable | Required when | Scope and handling |
| --- | --- | --- |
| `APP_ENV` | Every application runtime | One of `local`, `cloud-development`, `preview`, `staging`, or `production`. Server-readable deployment classification. |
| `APP_URL` | Local, cloud-development, staging, and production runtime; optional override for Preview | Canonical absolute URL for redirects and server-generated links. Staging and production require fixed domains. Preview resolution is defined below. |
| `DATABASE_URL` | Every application runtime | Pooled Supabase PostgreSQL URL consumed when constructing the runtime Prisma Client. |
| `DIRECT_URL` | A Prisma CLI migration or approved administrative database command runs | Migration/admin PostgreSQL URL mapped to `datasource.url` in Prisma 7 `prisma.config.ts`. For cloud development, use the reachable direct endpoint or the approved Shared Pooler session-mode fallback. Keep it out of ordinary application execution where possible. |
| `SHADOW_DATABASE_URL` | Cloud-development migration tooling requires a shadow database | Optional, non-production, and isolated. Use the shadow resource's reachable direct endpoint or approved Shared Pooler session-mode fallback. Mapped to `datasource.shadowDatabaseUrl` in Prisma 7 `prisma.config.ts` after migration preflight. |
| `SUPABASE_SECRET_KEY` | An implemented server operation explicitly requires privileged Supabase access | Optional by default. Read only inside the server-only privileged adapter; never use it as a general application credential. |
| `EMAIL_PROVIDER` | Every application runtime | `disabled` until email delivery is active; `resend` activates the Resend requirements below. |
| `RESEND_API_KEY` | `EMAIL_PROVIDER=resend` | Server-only Resend credential for the current environment. |
| `RESEND_FROM_EMAIL` | `EMAIL_PROVIDER=resend` | Approved sender identity for the current environment. Do not use the production sender for uncontrolled previews. |
| `SENTRY_ENABLED` | Every application runtime | Boolean activation switch. `false` is valid before the Sentry entry point. |
| `SENTRY_ENVIRONMENT` | `SENTRY_ENABLED=true` | Must equal the effective application environment label. |
| `SENTRY_DSN` | Server/edge Sentry is active | Presence activates server/edge monitoring for the environment's Sentry project. |
| `SENTRY_ORG` | Source maps are uploaded | Sentry organization identifier; not a credential. |
| `SENTRY_PROJECT` | Source maps are uploaded | Sentry project identifier; not a credential. |
| `SENTRY_AUTH_TOKEN` | Source maps are uploaded without the Sentry Vercel integration | Prefer a dedicated CI upload job or the Sentry Vercel integration. If stored as a Vercel project variable for the build, it may also be available during Function execution; application code must never read it. |
| `TEST_DATABASE_URL` | Database integration tests run | Dedicated non-production test database. Tests must not fall back to `DATABASE_URL`. |
| `E2E_BASE_URL` | Browser tests run | Absolute URL of the local, preview, or staging target. It must never target production from routine CI. |

`VERCEL`, `VERCEL_ENV`, `VERCEL_TARGET_ENV`, and `VERCEL_BRANCH_URL` are Vercel
system variables and are not copied into `.env.example`. They must be enabled
in each Vercel project through "Automatically expose System Environment
Variables." Future validation uses them as deployment guards, not as the
application's sole environment classification.

## Prisma 7 Connection Mapping

Runtime and migration connections are separate contracts:

- Runtime Prisma Client construction uses only the pooled `DATABASE_URL`.
- The Stage 1 root-level `prisma.config.ts` will explicitly import
  `dotenv/config`.
- Its Prisma 7 `datasource.url` value comes from `DIRECT_URL`.
- Its optional `datasource.shadowDatabaseUrl` value comes from
  `SHADOW_DATABASE_URL`.
- Do not add `directUrl` to the Prisma schema datasource or to Prisma config;
  that property was removed in Prisma 7.

The future root config follows this mapping without requiring direct credentials
for CLI commands that do not access the database:

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL ?? "",
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
```

Every migration or administrative wrapper must validate `DIRECT_URL` before
invoking a Prisma CLI command that accesses the database. Cloud-development
`prisma migrate dev` must also validate `SHADOW_DATABASE_URL`. Non-database
commands such as client generation must not force migration/admin or shadow
credentials into a Vercel application build merely because Prisma loads its
config file.

## Application URL Resolution

The application computes one effective application URL before startup:

1. Local and cloud development require an explicit `APP_URL`.
2. Preview first uses a validated branch-specific `APP_URL` when one is
   configured for that Preview branch.
3. Otherwise Preview requires automatic Vercel system variables,
   `VERCEL=1`, `VERCEL_ENV=preview`, and a non-empty `VERCEL_BRANCH_URL`, then
   derives the URL as `https://${VERCEL_BRANCH_URL}`.
4. Staging and production require explicit fixed-domain `APP_URL` values.
   Neither may derive its canonical URL from a Vercel-generated domain.

Because Vercel is the approved host, Preview, staging, and production validation
also requires `VERCEL=1`, `VERCEL_ENV`, and `VERCEL_TARGET_ENV`. Preview requires
the Preview target. The separate staging and production projects use their
Production targets, with `APP_ENV` distinguishing the two projects. Any future
custom Vercel environment must use its exact `VERCEL_TARGET_ENV` name and pass a
new human review before use.

The resolver must reject user information, query strings, fragments, unexpected
paths, non-HTTPS Vercel URLs, and any Preview URL that resolves to a staging or
production hostname. When running on Vercel, missing or inconsistent system
variables fail startup or build validation rather than falling back to
localhost, a production URL, or `VERCEL_PROJECT_PRODUCTION_URL`.

## Shadow Database Preflight

String inequality between database URLs is not evidence of isolation: a pooled
URL and a direct URL can identify the same Supabase project and database.
Before a cloud-development migration uses a shadow database, a preflight must:

1. Normalize the Supabase project identity from a
   `db.<project-ref>.supabase.co` direct host or a
   `postgres.<project-ref>` Shared Pooler username, and normalize the database
   name from each URL.
2. Compare the shadow identity against both `DIRECT_URL` and `DATABASE_URL`.
3. Obtain the PostgreSQL major version through `DATABASE_URL`, `DIRECT_URL`,
   and `SHADOW_DATABASE_URL`. Require equality among the development runtime,
   development migration/admin, and shadow connections, and fail closed when a
   version is unavailable or differs because migration behavior can be
   version-dependent.
4. For a non-Supabase shadow, accept only an immutable provider control-plane
   resource, cluster, or database ID obtained by the accountable database owner
   from the authenticated provider dashboard or provider API. Compare it with
   the provisioned shadow target and environment inventory, and require the
   resource to be dedicated to cloud development, disposable, not staging or
   production, and distinct from the Supabase development project or resource.
5. Treat SQL database, user, and version values only as connectivity and
   version evidence, never as resource identity. Reject the shadow target if
   the provider cannot expose an immutable control-plane identity or the
   accountable owner cannot verify it.
6. Refuse the migration when identities match, the shadow target is staging or
   production, the PostgreSQL majors differ, or distinct identity cannot be
   proven.

The shadow database contains no customer data and is disposable. A plain URL
string comparison is never an acceptable preflight. Retain only the sanitized
Supabase project reference, or for a non-Supabase shadow its provider label and
immutable resource ID, plus the database name, connection mode, and PostgreSQL
major version as evidence. Do not retain the database user.

## Sentry Activation Matrix

`SENTRY_ENABLED` is the server-side policy switch. DSN presence activates the
corresponding SDK; no public boolean is added.

| Configuration | Result |
| --- | --- |
| `SENTRY_ENABLED=false`, no DSNs | Monitoring disabled. |
| `SENTRY_ENABLED=false`, either DSN present | Invalid configuration; reject it. |
| `SENTRY_ENABLED=true`, only `SENTRY_DSN` present | Server/edge monitoring only. |
| `SENTRY_ENABLED=true`, only `NEXT_PUBLIC_SENTRY_DSN` present | Browser monitoring only. |
| `SENTRY_ENABLED=true`, both DSNs present | Server/edge and browser monitoring. |
| `SENTRY_ENABLED=true`, no DSNs | Invalid configuration; reject it. |

`SENTRY_ENVIRONMENT` is required whenever Sentry is enabled. Browser
initialization checks only validated `NEXT_PUBLIC_SENTRY_DSN` presence. The
public DSN is routing configuration, not an auth token.

## Activation and Failure Contract

When the application scaffold exists, add one server-only validation module and
unit tests before any runtime begins consuming these variables. Validation must
happen at the process boundary and report variable names without printing
values.

Validation may be introduced incrementally as Stage 1 modules begin consuming
configuration. Task 1.3 validates only `DATABASE_URL` before Prisma Client
construction and `TEST_DATABASE_URL` when database integration tests run. It
does not activate or validate application URL, Supabase Auth, email, Sentry,
Vercel, privileged Supabase, or deferred-provider configuration. Those
requirements remain mandatory before the corresponding runtime boundary begins
consuming them.

The validator must:

1. Require `APP_ENV`, an effective application URL,
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   `DATABASE_URL`, `EMAIL_PROVIDER`, and `SENTRY_ENABLED` for application
   startup.
2. Require `RESEND_API_KEY` and `RESEND_FROM_EMAIL` only when
   `EMAIL_PROVIDER=resend`.
3. Enforce the Sentry activation matrix above. Require `SENTRY_ENVIRONMENT`
   when enabled, use DSN presence for each SDK, and validate
   `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` only in the
   source-map upload process.
4. Validate `DIRECT_URL` only when migration or administrative tooling starts,
   `SHADOW_DATABASE_URL` only when cloud migration development requests it, and
   `TEST_DATABASE_URL` or `E2E_BASE_URL` only in the corresponding test command.
5. Validate `SUPABASE_SECRET_KEY` at the privileged adapter boundary, so normal
   application startup does not require it.
6. Reject invalid URLs, unsupported enum values, empty required strings,
   inconsistent Vercel system variables, invalid Preview URL resolution,
   `APP_ENV=production` under `VERCEL_ENV=preview`, production targets in
   routine test commands, and any shadow database whose distinct identity
   cannot be proven by the migration preflight.
7. Export a separate public object containing only the approved
   `NEXT_PUBLIC_` values. Server configuration must never be serialized into
   browser props, responses, telemetry, or logs.

Required unit tests must cover every unconditional missing variable, each
conditional activation path, malformed URLs, public/server separation, the
preview URL fallback and fail-closed cases, all Sentry matrix combinations,
shadow identity equality and indeterminate cases, the preview-production guard,
non-production test guards, and successful minimal local, preview, staging, and
production configurations.

The application scaffold, package manifest, and test runners now exist. The
server-only environment validation module and its unit tests are introduced in
stages as Stage 1 begins consuming variables. Task 1.3 owns the database-only
subset. Stage 0 configuration and the empty application do not read the
remaining variables at runtime.

## Ownership and Storage

| Configuration | Accountable owner | Approved storage |
| --- | --- | --- |
| Supabase project URL and publishable key | Platform owner | Untracked local environment or matching Vercel Development, Preview, Production, or custom target. |
| Supabase secret key | Backend/security owner | Matching Vercel Development, Preview, Production, or custom target, or an approved local secret store, only where privileged operations exist. |
| Runtime and migration/admin database URLs | Database owner | Transaction pooler URL in the matching application target; direct or Shared Pooler session-mode URL in local migration storage or a protected CI migration environment. |
| Shadow database URL | Database owner | Developer-local secret storage or protected cloud-development migration environment. |
| Resend key and sender identity | Email owner | Matching non-production or production Vercel target; dashboard ownership remains restricted. |
| Sentry DSNs and environment label | Observability owner | Matching Vercel target. Browser DSN may be public; server DSN remains server-configured. |
| Sentry auth token | Observability/release owner | Prefer a protected CI source-map upload or Sentry Vercel integration. If a Vercel project variable is unavoidable, target only the required environment and prohibit runtime reads in application code. |
| Test database and E2E target | Test/release owner | Local secret storage or protected CI environment for non-production targets. |

Owners grant least privilege, document rotations without recording values, and
remove access when responsibilities change. Secret changes require a redeploy
of the affected environment and a targeted verification that does not echo the
secret.

## Vercel Target Checklist

Before adding or changing a Vercel variable:

1. Confirm the Vercel project is development/staging or production.
2. Confirm the variable classification in this document.
3. Select only the intended Development, Preview, Production, or approved
   custom target.
4. For production secrets, confirm Preview is not selected and no
   preview-branch override contains the value.
5. Enable automatic Vercel system environment variables and verify `VERCEL`,
   `VERCEL_ENV`, `VERCEL_TARGET_ENV`, and Preview `VERCEL_BRANCH_URL`.
6. Mark supported credentials as sensitive and restrict dashboard access.
7. Remember that Vercel project variables may be readable during both the build
   step and Function execution; code-level server-only boundaries still apply.
8. Redeploy only the affected environment.
9. Verify the application reports the intended `APP_ENV`, effective application
   URL, and service environment without logging configuration values.

Vercel preview builds must succeed using only active Stage 0/1 variables.
Database migrations must run as a separate controlled operation; application
builds and startup must not silently apply migrations.

## Future Provider Gates

R2, payment-provider, and video-provider variable names are intentionally not
reserved in `.env.example`. Their exact contracts depend on approved provider
adapters, credential types, callback/domain policies, and least-privilege
capabilities.

At each future readiness gate:

- add only the variables required by the approved adapter;
- keep every credential server-only;
- use separate sandbox/staging and production credentials;
- make the variables conditionally required only when that adapter is enabled;
- add validation tests before enabling the adapter; and
- update this inventory and `.env.example` with blank values only.

Until then, no R2, payment-provider, or video-provider variable may be required
by install, build, unit tests, integration tests, runtime startup, preview, or
deployment.

## Human Review

Environment and secret configuration is a mandatory review area. Before Stage
0/1 service provisioning or application validation is accepted, reviewers must
confirm:

- public and server-only classifications;
- Vercel project and target isolation;
- non-production Supabase and test targets;
- conditional email, Sentry, migration, and privileged-operation requirements;
- absence of production credentials and realistic secret-shaped placeholders;
  and
- continued absence of active R2, payment-provider, and video-provider
  requirements.
