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
| `DIRECT_URL` | A Prisma CLI migration or approved administrative database command runs | Direct PostgreSQL URL mapped to `datasource.url` in Prisma 7 `prisma.config.ts`. Keep it out of ordinary application execution where possible. |
| `SHADOW_DATABASE_URL` | Cloud-development migration tooling requires a shadow database | Optional, non-production, and isolated. Mapped to `datasource.shadowDatabaseUrl` in Prisma 7 `prisma.config.ts` after migration preflight. |
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
- Root-level `prisma.config.ts` explicitly imports `dotenv/config`.
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
commands such as client generation must not force direct or shadow credentials
into a Vercel application build merely because Prisma loads its config file.

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

1. Normalize the Supabase project identity from the direct host or pooler
   username and normalize the database name from each URL.
2. Compare the shadow identity against both `DIRECT_URL` and `DATABASE_URL`.
3. When URL parsing cannot prove identity, connect with least privilege and
   compare authoritative live database metadata or a provisioned immutable
   environment identity.
4. Refuse the migration when identities match, the shadow target is staging or
   production, or distinct identity cannot be proven.

The shadow database contains no customer data and is disposable. A plain URL
string comparison is never an acceptable preflight.

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

The repository currently has no application scaffold, package manifest,
environment module, or test runner. Therefore this validation module and its
unit tests are deliberately deferred to the first application task rather than
fabricating infrastructure in Task 0.5.

## Ownership and Storage

| Configuration | Accountable owner | Approved storage |
| --- | --- | --- |
| Supabase project URL and publishable key | Platform owner | Untracked local environment or matching Vercel Development, Preview, Production, or custom target. |
| Supabase secret key | Backend/security owner | Matching Vercel Development, Preview, Production, or custom target, or an approved local secret store, only where privileged operations exist. |
| Pooled and direct database URLs | Database owner | Pooled URL in the matching application target; direct URL in local migration storage or a protected CI migration environment. |
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
