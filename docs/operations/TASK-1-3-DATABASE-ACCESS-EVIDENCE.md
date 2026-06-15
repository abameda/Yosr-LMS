# Task 1.3 Database Access Evidence

**Verification date:** 2026-06-15

**Environment:** Local Supabase CLI development stack

**Human review:** Approved by the project owner on 2026-06-15

## Scope

This record covers the Task 1.3 server-only Prisma boundary, minimum database
environment validation, identity repositories, and local browser Data API
interpretation. It does not approve or verify Auth flows, hosted Supabase
configuration, R2, payments, video, or later-stage features.

## Data API Interpretation

The tracked `supabase/config.toml` sets `[api].enabled = false`. The gateway
remains running for Supabase Auth, but PostgREST is not started.

The local verification observed:

- required local containers healthy: Auth, PostgreSQL, gateway, Mailpit, and
  transaction pooler;
- no PostgREST container running;
- Auth health endpoint returned HTTP `200`;
- anonymous `/rest/v1/users?select=id` returned HTTP `503`; and
- a locally signed JWT with the `authenticated` role received HTTP `503` for
  the same route.

The HTTP `503` result is expected for this tracked local configuration. It
proves the browser Data API route is unavailable and therefore not
client-consumable locally; it does not indicate a failure of the required local
services.

This route-level result is combined with 16 passing pgTAP assertions that prove
the application tables have RLS enabled, expose no browser policies, and revoke
table access from `anon` and `authenticated`. Hosted development, preview, and
staging environments still require their own browser Data API denial evidence.

## Verification Results

- `npm ci`: passed; zero reported vulnerabilities.
- `CI=true npm run verify`: passed.
  - 24 unit tests passed.
  - 4 Playwright tests passed.
  - formatting, lint, type-checking, and production build passed.
- `npm run test:integration`: 3 repository and singleton tests passed against
  local PostgreSQL.
- `npx supabase test db`: 16 database assertions passed.
- `git diff --check`: passed.

## Review Decision

The project owner approved Task 1.3's database-boundary and dependency review
on 2026-06-15 after clarification of the expected local HTTP `503` behavior.
