# Foundation Service Readiness

## Purpose

This register governs the external services required for Yosr Stage 0 and
Stage 1 identity development, continuous integration, observability, and
preview verification. It applies the environment and secret rules in
`docs/operations/ENVIRONMENTS.md` and the privacy rules in
`docs/operations/LOGGING-AND-DATA-HANDLING.md`.

This document records service identifiers, ownership, configuration status,
and verification evidence. It must never contain credentials, database
connection strings, tokens, SMTP passwords, complete email addresses, or
environment-variable values.

External dashboard changes and the checks marked for owner execution are
performed manually by authorized owners. A service is not ready merely because
its intended configuration is documented here.

## Scope

Active in this register:

- Supabase PostgreSQL and Auth for non-production identity development.
- Resend sender configuration and Supabase Auth custom SMTP.
- Sentry project and environment planning.
- The GitHub remote and GitHub Actions quality gates.
- Vercel Preview, staging, and production isolation.

Not required for Stage 0 or Stage 1:

- Cloudflare R2 accounts, buckets, domains, credentials, or SDKs.
- Payment-provider accounts, credentials, callbacks, or SDKs.
- Video-provider accounts, credentials, playback domains, or SDKs.

The absence of those future-provider variables must not block installation,
GitHub Actions, Vercel builds, preview deployments, or Stage 0/1 runtime
startup.

## Status Convention

Requirement state and readiness state are recorded separately.

| Field       | Value          | Meaning                                                                                                            |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| Requirement | `ACTIVE`       | The service or control is required for Stage 0/1.                                                                  |
| Requirement | `DEFERRED`     | The service is governed by a later-stage entry gate and is not required now.                                       |
| Readiness   | `PLANNED`      | The approved configuration is described, but no external setup is evidenced.                                       |
| Readiness   | `UNVERIFIED`   | Repository evidence or an owner report exists, but the required external check and owner signoff are not recorded. |
| Readiness   | `VERIFIED`     | An authorized owner performed the check, recorded safe evidence, and a reviewer confirmed the result.              |
| Readiness   | `BLOCKED`      | A concrete dependency prevents the required setup or check. The blocker and owner must be recorded.                |
| Readiness   | `NOT_REQUIRED` | The item is intentionally outside the active Stage 0/1 gate.                                                       |

Only an authorized owner or reviewer may change a readiness state to
`VERIFIED`. Record the verification date, environment, result, and evidence
reference at the same time.

The normal readiness progression is:

1. `PLANNED` while the check and evidence requirements are defined but no
   setup evidence or owner report exists.
2. `UNVERIFIED` once repository evidence or an owner report exists, but the
   required external check or reviewer signoff is incomplete.
3. `VERIFIED` only after the required check, safe evidence record, owner
   confirmation, and reviewer confirmation are complete.

An item may remain `PLANNED` until all evidence is available, or move to
`BLOCKED` when a concrete dependency prevents progress. Status does not advance
merely because a procedure is documented.

The check-and-environment rows in the Canonical Evidence Register are the only
editable readiness statuses in this document. Service summaries are derived
roll-ups and owner setup records contain no readiness status.

For a roll-up containing more than one active check:

1. `BLOCKED` applies if any included check is `BLOCKED`.
2. Otherwise `PLANNED` applies if any included check is `PLANNED`.
3. Otherwise `UNVERIFIED` applies if any included check is `UNVERIFIED`.
4. `VERIFIED` applies only when every included check is `VERIFIED`.

`NOT_REQUIRED` is used only for a deferred boundary with no active check.

## Environment Terminology

Use the environment names and `APP_ENV` values from
`docs/operations/ENVIRONMENTS.md` without aliases:

| Environment name  | `APP_ENV` value     |
| ----------------- | ------------------- |
| Local             | `local`             |
| Cloud development | `cloud-development` |
| Preview           | `preview`           |
| Staging           | `staging`           |
| Production        | `production`        |

## Repository Evidence Snapshot

Snapshot date: `2026-06-15`

Snapshot base: integrated Stage 0 task branches on local `main`; final
remediation commit pending.

The repository currently proves only the following:

- Git remote `origin` is configured for the GitHub repository
  `abameda/Yosr-LMS`.
- `.github/workflows/ci.yml` defines a read-only `Quality Gates` job for pull
  requests and pushes to `main` or `master`.
- The workflow runs `npm run verify` without service credentials.
- No tracked Supabase, Resend, Sentry, or Vercel project linkage or successful
  external verification result was found.
- The pinned Supabase CLI `2.106.0` successfully started the tracked local
  stack on Windows-safe ports. The database, pooler, Auth gateway, and Mailpit
  containers reported healthy; the Auth and Mailpit HTTP checks returned
  `200`; and `supabase stop` completed. No generated local credential is
  retained in this document.
- No tracked R2, payment-provider, or video-provider configuration is required
  by the current application or CI workflow.

Repository configuration does not prove that GitHub Actions is enabled, a
workflow run succeeded, a provider dashboard is configured, or a Vercel
deployment completed.

## Readiness Summary

This table is read-only. Derive each status from the listed canonical check
IDs using the roll-up rule above. The staging connectivity check is excluded
from the Task 0.8 Supabase roll-up because it belongs to the Stage 1 exit gate.

| Service or boundary                      | Requirement | Accountable owner role                                                  | Canonical Task 0.8 check IDs   | Derived readiness |
| ---------------------------------------- | ----------- | ----------------------------------------------------------------------- | ------------------------------ | ----------------- |
| Supabase PostgreSQL and Auth             | `ACTIVE`    | Platform owner, with database owner for connection and migration access | `SUP-DEV`, `SUP-PREVIEW`       | `PLANNED`         |
| Resend and Supabase Auth SMTP            | `ACTIVE`    | Email owner                                                             | `EMAIL-NONPROD`                | `PLANNED`         |
| Sentry                                   | `ACTIVE`    | Observability owner, with privacy/security reviewer                     | `SENTRY-NONPROD`               | `PLANNED`         |
| GitHub remote and Actions                | `ACTIVE`    | Release owner                                                           | `GITHUB-ACTIONS`               | `UNVERIFIED`      |
| Vercel                                   | `ACTIVE`    | Platform/release owner                                                  | `VERCEL-PREVIEW`               | `PLANNED`         |
| Production isolation across services     | `ACTIVE`    | Security reviewer and service owners                                    | `NONPROD-ISOLATION`            | `PLANNED`         |
| R2, payment provider, and video provider | `DEFERRED`  | Future provider owners                                                  | No active check until its gate | `NOT_REQUIRED`    |

## Owner Confirmation Register

Role ownership is assigned below. A named authorized owner must accept each
role before the corresponding service becomes `VERIFIED`.

| Service                                   | Accountable role       | Named owner or team identifier | Acceptance date          | Role-acceptance reviewer |
| ----------------------------------------- | ---------------------- | ------------------------------ | ------------------------ | ------------------------ |
| Supabase project and Auth configuration   | Platform owner         | Fill during owner review       | Fill during owner review | Fill during owner review |
| Supabase database and migration access    | Database owner         | Fill during owner review       | Fill during owner review | Fill during owner review |
| Resend sender and SMTP configuration      | Email owner            | Fill during owner review       | Fill during owner review | Fill during owner review |
| Sentry configuration and retention        | Observability owner    | Fill during owner review       | Fill during owner review | Fill during owner review |
| GitHub repository and Actions settings    | Release owner          | Fill during owner review       | Fill during owner review | Fill during owner review |
| Vercel projects and environment variables | Platform/release owner | Fill during owner review       | Fill during owner review | Fill during owner review |
| Production secret-boundary review         | Security reviewer      | Fill during owner review       | Fill during owner review | Fill during owner review |

Named owners confirm least-privilege access, backup ownership, and an access
removal path. This table stores names, team names, or account handles only,
never authentication details.

## Approved Evidence

Evidence recorded in this document may include:

- provider organization, project, site, or repository identifiers;
- an approved sender domain or subdomain;
- a non-secret region or environment label;
- a commit SHA, GitHub Actions run URL, or Vercel deployment URL;
- a verification timestamp and pass/fail result;
- a restricted ticket, change record, or dashboard-review reference; and
- the name or handle of the owner and reviewer.

Do not record:

- database URLs or any URL containing embedded credentials;
- Supabase secret keys, Resend API keys, SMTP passwords, Sentry auth tokens, or
  Vercel tokens;
- secret values copied from GitHub, Vercel, Supabase, Resend, or Sentry;
- DSN values, even when a browser DSN is technically public;
- full recipient email addresses, email bodies, reset links, or verification
  links; or
- screenshots or logs that expose environment values, headers, cookies,
  personal data, or provider credentials.

Where provider evidence contains sensitive detail, record only the restricted
evidence location and a sanitized result.

## Supabase Plan

Supabase is limited to PostgreSQL and Auth. Supabase Storage and Buckets are
not part of Stage 0/1 and must not be configured for Yosr application use.

### Environment Mapping

| Environment       | Required resource and use                                                                                                                                                                                                                                                                                 | Approved configuration storage                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Local             | Prefer the Docker-backed local Supabase stack when available. Use synthetic data and the local mail catcher.                                                                                                                                                                                              | Untracked `.env.local`; local Supabase state; approved developer-local secret storage.                                          |
| Cloud development | Dedicated development Supabase project used only when local Supabase is unavailable. A distinct shadow database is required before cloud `prisma migrate dev` is allowed. Synthetic data only.                                                                                                            | Owner-issued values in untracked `.env.local`; direct and shadow access only in approved migration storage.                     |
| Preview           | Require a preview-only Supabase project. An exception requires documented and security-reviewed isolation covering PostgreSQL data, Auth identities, publishable and secret keys, redirect allowlists, and Supabase Auth SMTP configuration. Database-only isolation is insufficient. Data is disposable. | Vercel Preview target in the non-production preview project. Direct and shadow database credentials are excluded.               |
| Staging           | Dedicated staging Supabase project with fixed staging Auth redirect URLs and synthetic or sanitized data.                                                                                                                                                                                                 | Dedicated staging Vercel project's Production target. Migration access uses protected CI or owner-controlled migration storage. |
| Production        | Dedicated production Supabase project with production-only Auth redirects and customer data.                                                                                                                                                                                                              | Production Vercel project's Production target and approved production provider dashboards only.                                 |

`DATABASE_URL` is the pooled runtime connection. `DIRECT_URL` is used only by
approved migration or administrative commands. `SHADOW_DATABASE_URL` is
non-production only. `SUPABASE_SECRET_KEY` remains absent until a specific
privileged server operation requires it.

### Owner Setup Record

| Field                                              | Recorded value           |
| -------------------------------------------------- | ------------------------ |
| Development project identifier and region          | Fill during owner review |
| Preview project or isolation identifier and region | Fill during owner review |
| Staging project identifier and region              | Fill during owner review |
| Production project identifier and region           | Fill during owner review |
| Cloud-development shadow target identifier         | Fill during owner review |

The database owner must prove that cloud-development shadow identity is
different from both pooled and direct development database identity. Different
URL strings alone are not proof.

## Resend and Supabase Auth SMTP Plan

Resend is the selected transactional email provider. Stage 0/1 first requires
controlled non-production Auth delivery for verification and password-reset
messages.

### Environment Mapping

| Environment       | Delivery plan                                                                                                                                    | Approved secret storage                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Local             | Use the local Supabase mail catcher by default. External delivery is not required for routine local work.                                        | Local Supabase configuration; no production Resend credential.                                                           |
| Cloud development | Use an approved non-production sender domain or subdomain and a development-specific Resend credential. Restrict testing to approved recipients. | Supabase development project custom-SMTP settings. Application API keys, when activated, use untracked `.env.local`.     |
| Preview           | Use only non-production sender identity and credentials. Never use the production sender or production key.                                      | Preview Supabase project custom-SMTP settings; matching Vercel Preview variables only when application email is enabled. |
| Staging           | Use a staging sender identity or approved non-production sender with a staging-specific credential.                                              | Staging Supabase project custom-SMTP settings and the staging Vercel project's Production target.                        |
| Production        | Use the approved production sender and production-specific credentials only after domain and security review.                                    | Production Supabase project custom-SMTP settings and production Vercel project's Production target.                      |

Supabase Auth SMTP credentials belong in the matching Supabase project
dashboard. `RESEND_API_KEY` and `RESEND_FROM_EMAIL` belong in the matching
application environment only when `EMAIL_PROVIDER=resend`. Use separate
credentials for production and non-production; use narrower per-environment
credentials when the provider supports them.

### Owner Setup Record

| Field                                              | Recorded value           |
| -------------------------------------------------- | ------------------------ |
| Approved non-production sender domain or subdomain | Fill during owner review |
| Development SMTP target identifier                 | Fill during owner review |
| Preview SMTP target identifier                     | Fill during owner review |
| Staging SMTP target identifier                     | Fill during owner review |
| Production sender domain or subdomain              | Fill during owner review |

Do not record the controlled test recipient. Record only that the recipient was
an approved owner-controlled mailbox or alias.

## Sentry Plan

Sentry is enabled only after the environment-specific project, privacy
filtering, access, and retention settings are approved. Until application
instrumentation exists, `SENTRY_ENABLED=false` with no DSNs is valid.

### Environment Mapping

| Environment       | Project and activation plan                                                                     | Approved secret storage                                  |
| ----------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Local             | Disabled by default. If explicitly enabled for SDK development, use a development-only project. | Untracked `.env.local`; no production DSN or auth token. |
| Cloud development | Disabled or routed to a dedicated development project with synthetic data only.                 | Untracked `.env.local`.                                  |
| Preview           | Dedicated preview project and `SENTRY_ENVIRONMENT=preview`.                                     | Vercel Preview target.                                   |
| Staging           | Dedicated staging project and `SENTRY_ENVIRONMENT=staging`.                                     | Dedicated staging Vercel project's Production target.    |
| Production        | Dedicated production project and `SENTRY_ENVIRONMENT=production`.                               | Production Vercel project's Production target.           |

Before any environment is enabled:

- apply the filtering rules in
  `docs/operations/LOGGING-AND-DATA-HANDLING.md`;
- disable session replay and attachments unless separately reviewed;
- do not send user email, name, IP address, request bodies, headers, cookies,
  or arbitrary exception context;
- set a fixed retention period, access group, and deletion-verification method;
  and
- keep `SENTRY_AUTH_TOKEN` in a protected source-map upload job or use the
  Sentry Vercel integration. Application runtime code must not read it.

### Owner Setup Record

| Field                                               | Recorded value           |
| --------------------------------------------------- | ------------------------ |
| Development project identifier or disabled decision | Fill during owner review |
| Preview project identifier                          | Fill during owner review |
| Staging project identifier                          | Fill during owner review |
| Production project identifier                       | Fill during owner review |
| Fixed retention duration                            | Fill during owner review |
| Approved access group                               | Fill during owner review |
| Source-map upload method                            | Fill during owner review |

## GitHub and Actions Plan

The repository remote and workflow definition exist. The release owner must
still verify repository settings and record a successful GitHub-hosted run.

### Repository and Environment Mapping

| Scope                            | Required configuration                                                                                                                                       | Approved secret storage                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Repository                       | `abameda/Yosr-LMS`; Actions must be enabled; workflow permissions remain read-only unless an approved job needs more.                                        | Repository settings contain no credential values in documentation.                              |
| Pull requests                    | `.github/workflows/ci.yml` is defined to run `Quality Gates` for every pull request. The release owner must configure required checks and branch protection. | GitHub repository or environment secrets only when a future non-production check requires them. |
| Main branch                      | The same quality gate is defined for pushes to `main` or `master`.                                                                                           | No production deployment credential is required by the current workflow.                        |
| Non-production integration tests | Future database or deployment checks use a protected non-production GitHub environment with least-privilege credentials.                                     | GitHub environment secrets; never plaintext workflow YAML or logs.                              |
| Production                       | Routine pull-request CI does not receive production credentials. Production release credentials require a separately approved protected environment.         | GitHub production environment secrets with reviewer controls, if later required.                |

The current `npm run verify` workflow must continue to succeed without R2,
payment-provider, or video-provider variables.

### Owner Setup Record

| Field                 | Recorded value             |
| --------------------- | -------------------------- |
| Repository identifier | `abameda/Yosr-LMS`         |
| Workflow path         | `.github/workflows/ci.yml` |

## Vercel Plan

Separate Vercel projects for staging and production are the default isolation
boundary.

### Environment Mapping

| Environment       | Vercel topology                                                                                                                                                                        | Approved secret storage                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Local             | No public deployment tier. Developers may pull only non-production Development values when approved.                                                                                   | Untracked `.env.local`; optional Vercel Development values from a non-production project.     |
| Cloud development | Not a public Vercel environment. It uses the dedicated development Supabase project from the developer workstation.                                                                    | Untracked `.env.local`; no staging or production values.                                      |
| Preview           | Vercel Preview target in a non-production preview project. Automatic system environment variables must be enabled. `APP_ENV=preview`; branch URL resolution follows `ENVIRONMENTS.md`. | Preview target only. Production-target values and production branch overrides are prohibited. |
| Staging           | Dedicated staging Vercel project using its Production target. `APP_ENV=staging` and a fixed staging `APP_URL`.                                                                         | Staging project's Production target only.                                                     |
| Production        | Dedicated production Vercel project using its Production target. `APP_ENV=production` and a fixed production `APP_URL`.                                                                | Production project's Production target only. Never select Preview for production secrets.     |

The Preview build receives only active Stage 0/1 configuration. Automatic
Vercel system variables must be enabled so deployment validation can inspect
`VERCEL`, `VERCEL_ENV`, `VERCEL_TARGET_ENV`, and `VERCEL_BRANCH_URL`.

### Owner Setup Record

| Field                                     | Recorded value           |
| ----------------------------------------- | ------------------------ |
| Non-production Preview project identifier | Fill during owner review |
| Staging project identifier                | Fill during owner review |
| Production project identifier             | Fill during owner review |
| Linked Git repository identifier          | Fill during owner review |
| Preview branch-override policy            | Fill during owner review |

If separate staging and production projects are not used, readiness is
`BLOCKED` until a human security review proves that Preview and branch-specific
overrides cannot resolve any production credential.

## Stage 0/1 Configuration Boundary

The active variable contract is defined in
`docs/operations/ENVIRONMENTS.md`. The service owners must apply these
boundaries:

- Public runtime configuration is limited to
  `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and, when browser monitoring is
  enabled, `NEXT_PUBLIC_SENTRY_DSN`.
- Server runtime configuration may include `APP_ENV`, `APP_URL`,
  `DATABASE_URL`, conditional Resend values, and conditional Sentry values.
- `DIRECT_URL`, `SHADOW_DATABASE_URL`, and `SENTRY_AUTH_TOKEN` are
  operation-specific and are not ordinary application runtime requirements.
- `SUPABASE_SECRET_KEY` is absent until an implemented privileged server
  operation requires it.
- `TEST_DATABASE_URL` and `E2E_BASE_URL` are restricted to the corresponding
  non-production test command.

No R2, payment-provider, or video-provider variable is part of this boundary.
Do not create empty required placeholders in provider dashboards, GitHub
Actions, or Vercel. Their future absence is a valid and required Stage 0/1
state.

## Canonical Evidence Register

These check-and-environment rows are the canonical readiness record. Update a
row as one unit: status, owner identity and confirmation time, reviewer identity
and review time, and safe evidence reference. Do not update a service summary
directly.

The required Task 0.8 execution checks are exactly `SUP-DEV`,
`EMAIL-NONPROD`, `GITHUB-ACTIONS`, and `VERCEL-PREVIEW`. The Task 0.8 service
and security review also requires `SUP-PREVIEW`, `SENTRY-NONPROD`, and
`NONPROD-ISOLATION`. `SUP-STAGING` is tracked now for continuity but belongs to
the Stage 1 exit gate and does not block Task 0.8.

| ID                  | Check and environment                                                         | Gate         | Status       | Owner confirmation, UTC date | Reviewer confirmation, UTC review date | Evidence or review reference                                                                          |
| ------------------- | ----------------------------------------------------------------------------- | ------------ | ------------ | ---------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `SUP-DEV`           | Supabase connectivity in Local or Cloud development                           | Task 0.8     | `UNVERIFIED` | Not recorded                 | Not recorded                           | Local repository check passed on 2026-06-15 using Supabase CLI `2.106.0`; owner and reviewer confirmation remain required. |
| `SUP-PREVIEW`       | Full Supabase resource isolation for Preview                                  | Task 0.8     | `PLANNED`    | Not recorded                 | Not recorded                           | Not recorded                                                                                          |
| `SUP-STAGING`       | Supabase connectivity in Staging                                              | Stage 1 exit | `PLANNED`    | Not recorded                 | Not recorded                           | Not recorded                                                                                          |
| `EMAIL-NONPROD`     | Supabase Auth email through Resend in one approved non-production environment | Task 0.8     | `PLANNED`    | Not recorded                 | Not recorded                           | Not recorded                                                                                          |
| `SENTRY-NONPROD`    | Sentry project and settings readiness for Preview and Staging                 | Task 0.8     | `PLANNED`    | Not recorded                 | Not recorded                           | Not recorded                                                                                          |
| `GITHUB-ACTIONS`    | GitHub remote, Actions availability, and successful quality-gate run          | Task 0.8     | `UNVERIFIED` | Not recorded                 | Not recorded                           | Historical run `27490886232` passed a synthetic merge for head `005d910`; the current local approval state is unpushed and has no hosted run. |
| `VERCEL-PREVIEW`    | Vercel Preview build using only active Stage 0/1 variables                    | Task 0.8     | `PLANNED`    | Not recorded                 | Not recorded                           | Not recorded                                                                                          |
| `NONPROD-ISOLATION` | Production credential and data isolation from every non-production scope      | Task 0.8     | `PLANNED`    | Not recorded                 | Not recorded                           | Not recorded                                                                                          |

A `VERIFIED` row must identify both people or authorized teams and both UTC
dates. The evidence column must contain a safe run, deployment, ticket, change,
or restricted dashboard-review reference. A reviewer must be independent of
the recorded owner for production isolation and any exception to the default
Preview or staging topology.

## Verification Procedures

Run checks only against non-production resources. Commands and evidence must
report variable names or safe outcomes, never secret values.

### `SUP-DEV`: Development Connectivity

Verify either Local or Cloud development connectivity for Task 0.8. Record
which environment was used; verification of one does not claim that the other
was checked.

1. Start a fresh temporary process or shell used only for this check. Do not
   reuse a long-lived development terminal or persist values in a profile,
   history, script, or command argument.
2. Obtain an owner-approved least-privilege credential scoped to the selected
   non-production database.
3. Set only the required libpq variables in that temporary process, such as
   `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, and `PGSSLMODE`,
   without echoing their values.
4. Run
   `psql -v ON_ERROR_STOP=1 -c "select 1 as connectivity_check;"`.
5. In a `finally` path, clear every libpq credential variable immediately,
   including `PGPASSWORD`, and close the temporary process. Confirm the
   variable names are absent without printing their former values.

Record the selected environment, UTC timestamp, safe result, least-privilege
credential class, owner, reviewer, and restricted run reference.

### `SUP-STAGING`: Staging Connectivity

At the Stage 1 exit gate, repeat the complete temporary-process,
least-privilege, and immediate-cleanup procedure from `SUP-DEV` against the
dedicated Staging database. Record separate staging evidence, owner
confirmation, and reviewer confirmation. This later check cannot be satisfied
by the Task 0.8 development result.

If `psql` is unavailable, the database owner may run
`select 1 as connectivity_check;` in the matching Supabase SQL editor. Record
the method and sanitized result; do not paste SQL editor output containing
project or account details.

### `SUP-PREVIEW`: Preview Resource Isolation

Confirm a Preview-only Supabase project. An exception must have a restricted,
security-reviewed record proving separate Preview scope for all of:

- PostgreSQL data and connection identities;
- Supabase Auth identities and data;
- publishable and secret keys;
- Auth redirect and site URL allowlists; and
- Supabase Auth SMTP configuration and credentials.

Database-only isolation does not satisfy this check. Record the Preview project
identifier or approved exception reference, scope review date, owner, and
reviewer without recording keys or connection values.

### `EMAIL-NONPROD`: Controlled Auth Email

In one approved Cloud development, Preview, or Staging environment, trigger one
controlled signup-verification or password-reset message to an owner-controlled
non-production mailbox. Confirm the approved non-production sender identity,
receipt, and one-time-link behavior. Do not record the recipient, message body,
or link. Record environment, UTC timestamp, flow type, sanitized delivery
result, owner, reviewer, and restricted provider-log reference.

### `SENTRY-NONPROD`: Sentry Settings

Confirm Preview and Staging project identifiers, environment labels, access
group, filtering controls, fixed retention, deletion-verification method, and
source-map upload method. No application event is required until the SDK
baseline exists. Record both environment reviews, owner, reviewer, UTC review
date, and restricted settings reference.

### `GITHUB-ACTIONS`: Hosted Quality Gate

Confirm `origin` identifies the approved GitHub repository, Actions is enabled,
and `.github/workflows/ci.yml` succeeds on a pull request or approved review
branch at the recorded commit. Confirm the workflow and install do not request
R2, payment-provider, or video-provider variables. Record commit SHA, run URL,
conclusion, UTC timestamp, owner, and reviewer.

### `VERCEL-PREVIEW`: Preview Build

Deploy the recorded commit from the approved non-production Vercel project with
only active Stage 0/1 variables. Confirm `APP_ENV=preview`, required Vercel
system variables, the effective Preview URL, and the absence of production
hostnames, production credential scopes, R2 variables, payment-provider
variables, and video-provider variables. Review project-level and
branch-specific overrides without exposing values. Record commit SHA,
deployment URL, project identifier, UTC timestamp, sanitized variable-name
review, owner, and reviewer.

## Non-Production Isolation Review

`NONPROD-ISOLATION` covers every non-production scope below. Each cell must be
reviewed for both credentials and data. No production credential, production
identity dataset, production learner data, or other production service data
may be attached, copied, queried, or routed into these scopes.

| Environment       | Supabase                                                                                                                               | Resend and Auth SMTP                                                                                      | Sentry                                                                                  | GitHub                                                                                                  | Vercel                                                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local             | Local stack or approved development project only; synthetic data; no production URLs, keys, Auth identities, or database data.         | Local mail catcher or development sender only; no production SMTP or Resend credential.                   | Disabled or development project only; no production DSN, token, project, or data.       | Developer files and local tooling contain no production GitHub environment or provider credential.      | Only non-production Development values may be pulled; no production project values or production data.                                                         |
| Cloud development | Dedicated development project and isolated shadow target; synthetic data; no production URLs, keys, Auth identities, or database data. | Development sender and credentials only; no production sender credential or recipient data.               | Disabled or development project only; no production DSN, token, project, or data.       | Development automation uses only a protected non-production environment; no production secrets or data. | Not a deployment tier; developer configuration contains no staging or production values.                                                                       |
| Preview           | Preview-only project or approved full-resource exception under `SUP-PREVIEW`; disposable data; no production resources or identities.  | Preview non-production SMTP and sender scope only; no production key, sender credential, or message data. | Preview project and environment only; no production DSN, token, project, or event data. | Pull-request workflows and non-production environments receive no production secrets or data.           | Preview target and every branch override contain only Preview values; no production target values, credentials, domains, or data.                              |
| Staging           | Dedicated staging project; synthetic or sanitized data; no production URLs, keys, Auth identities, or database data.                   | Staging sender and credentials only; no production key, sender credential, or message data.               | Staging project and environment only; no production DSN, token, project, or event data. | Protected staging environment contains staging-only secrets and no production credentials or data.      | Dedicated staging project's Production target has `APP_ENV=staging`; target values and all branch overrides contain no production-project credentials or data. |

Record one restricted review reference that identifies the service scopes
checked, UTC date, service-owner confirmations, and independent security
reviewer. Any unchecked cell keeps `NONPROD-ISOLATION` below `VERIFIED`.

## Invalidation and Revalidation

After any trigger below, immediately move every affected `VERIFIED` canonical
row back to `UNVERIFIED`, mark its prior evidence as superseded, and recompute
the derived summary. Keep the old evidence reference for audit history.

| Trigger                                                                                                                                                                                 | Affected canonical checks                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Supabase project, database, Auth identity scope, publishable or secret key scope, connection role, redirect allowlist, site URL, or SMTP configuration changes                          | `SUP-DEV`, `SUP-PREVIEW`, `SUP-STAGING`, `EMAIL-NONPROD`, `NONPROD-ISOLATION` as applicable |
| Resend sender domain, sender identity, API or SMTP credential, recipient restriction, or credential scope changes                                                                       | `EMAIL-NONPROD`, `NONPROD-ISOLATION`                                                        |
| Sentry project, environment label, DSN scope, filtering, retention, deletion, access, integration, or source-map upload changes                                                         | `SENTRY-NONPROD`, `NONPROD-ISOLATION`                                                       |
| Git remote, repository, workflow, action version, event filter, permission, branch protection, required check, Actions setting, or GitHub secret/environment changes                    | `GITHUB-ACTIONS`, `NONPROD-ISOLATION` as applicable                                         |
| Vercel project linkage, build settings, domain, target, system-variable exposure, environment-variable name or scope, branch override, staging topology, or production topology changes | `VERCEL-PREVIEW`, `SUP-PREVIEW`, `NONPROD-ISOLATION` as applicable                          |
| Any credential rotation, environment remapping, access-policy change, or production/non-production data-source change                                                                   | Every check whose target, access, or evidence is affected                                   |

Reverification requires a fresh execution or settings review, new UTC
timestamp, new safe evidence reference, renewed owner confirmation, and renewed
reviewer confirmation. A stale verification cannot be restored by changing
only the status cell. Use `BLOCKED` if a concrete dependency prevents the new
check.

## Human Review Gate

Task 0.8 service readiness is approved only when:

- every active service has a named owner who accepted the role;
- every environment mapping and approved secret store has been confirmed;
- `SUP-DEV`, `SUP-PREVIEW`, `EMAIL-NONPROD`, `SENTRY-NONPROD`,
  `GITHUB-ACTIONS`, `VERCEL-PREVIEW`, and `NONPROD-ISOLATION` are all
  `VERIFIED`;
- `GITHUB-ACTIONS` and `VERCEL-PREVIEW` evidence proves that neither path
  requires R2, payment-provider, or video-provider variables;
- every canonical `VERIFIED` row contains owner identity and date, reviewer
  identity and review date, and a safe evidence reference; and
- evidence contains identifiers and sanitized outcomes only, never
  credentials or personal data.

`SUP-STAGING` is evaluated separately at the Stage 1 exit gate and is not a
Task 0.8 approval condition.

Final decision:

| Field                               | Recorded value           |
| ----------------------------------- | ------------------------ |
| Decision                            | `NOT REVIEWED`           |
| Review date                         | Fill during human review |
| Service owners represented          | Fill during human review |
| Security reviewer                   | Fill during human review |
| Evidence record or change reference | Fill during human review |
| Conditions or blockers              | Fill during human review |

Until this gate is approved, this document is a readiness plan and register,
not evidence that the external services are operational.
