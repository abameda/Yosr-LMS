# Stage 0 Exit Evidence

## Decision

**Overall status:** REPOSITORY REMEDIATION COMPLETE; EXTERNAL VERIFICATION REQUIRED

**Approval status:** NOT APPROVED

**Review date:** 2026-06-15

**Reviewed branch:** local `main`, based on integrated task-branch merge
`6ddd7b8` plus the remediation changes recorded by this review

The repository blockers reported by the original Task 0.10 review are resolved.
Stage 0 is ready for human and external evidence collection and re-review, but
it is not ready for final approval until the active-service checks below are
confirmed by authorized owners and reviewers. Stage 1 must not begin before a
human records the Stage 0 approval.

Cloudflare R2, payment-provider, and video-provider accounts, credentials, and
configuration remain deferred and non-blocking for Stage 0 and Stage 1.

## Reconciliation

- `codex/task-0-7-supabase-strategy` was preserved as commit `e6682a7` and
  merged into `main`.
- `codex/task-0-8-service-readiness` was preserved as commit `dd10a20` and
  merged into `main`.
- `codex/task-0-9-future-provider-gates` at commit `f9f67cd` was merged into
  `main`.
- The original dirty `main` work was saved in the named stash
  `pre-stage-0-remediation-main-2026-06-15`, reapplied with `stash apply`, and
  retained as a backup.
- The older Task 0.5 stash was not applied wholesale. Only its `.env.example`
  contract was recovered and reconciled.
- Reapplying the backup produced expected conflicts in `AGENTS.md` and
  `docs/LAUNCH-CHECKLIST.md`. The current instruction semantics and both
  checklist evidence sections were preserved.

## Acceptance Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Developers can install, build, and run the empty test suite. | PASS | `npm.cmd ci`, lint, type-checking, 3 unit tests, Playwright smoke, production build, and the aggregate verification contract pass. |
| Playwright terminates reliably. | PASS | A clean dependency/browser installation was followed by the npm e2e command, two direct Playwright runs, and the aggregate verification run. Every run completed and no port `3100` listener or surviving Node process remained. |
| Supabase development strategy is usable. | PASS LOCALLY; HUMAN SIGNOFF REQUIRED | Supabase CLI `2.106.0` is pinned. The tracked local stack started on Windows-safe `5532x` ports; database, pooler, Auth, and Mailpit were healthy; Auth and Mailpit HTTP checks returned `200`; and teardown completed. Generated local credentials were not retained. |
| Active Stage 0/1 service readiness is documented. | PASS FOR REPOSITORY ARTIFACT; EXTERNAL CHECKS REQUIRED | `docs/operations/FOUNDATION-SERVICE-READINESS.md` defines owners, environments, secret storage, evidence rules, and canonical checks. Dashboard-dependent checks remain unverified. |
| Future provider absence is non-blocking. | PASS | `docs/operations/FUTURE-PROVIDER-READINESS.md` and the staged roadmap defer R2 to the Stage 2 asset-upload gate, video to Stage 4, and payments to Stage 5. |
| Active environment contract is present and safe. | PASS | `.env.example` contains only current Stage 0/1 names with blank or example-safe values. It contains no future provider variables or real credentials. |
| Environment documentation matches the repository. | PASS | The obsolete statement that no scaffold, package manifest, or test runner exists was replaced with the current Stage 0/Stage 1 boundary. |
| Preview and production secrets are separated. | DOCUMENTED; HUMAN/EXTERNAL VERIFICATION REQUIRED | The contract requires separate scopes and prohibits production values in Preview. Vercel and provider dashboards were not available for confirmation. |
| CI passes for the approval commit. | HUMAN/EXTERNAL VERIFICATION REQUIRED | Historical GitHub Actions run `27490886232` passed a synthetic merge for head `005d910`. The current local approval state is unpushed and therefore has no hosted run. |

## Verification Results

Commands were run from the repository root on 2026-06-15.

| Command or check | Result |
| --- | --- |
| `npm.cmd ci` | PASS: 449 packages installed from the lockfile. |
| `npm.cmd run lint` | PASS. |
| `npm.cmd run typecheck` | PASS. |
| `npm.cmd run test:unit` | PASS: 2 files and 3 tests. |
| `npm.cmd run test:e2e` | PASS: 1 Chromium smoke test; command terminated normally. |
| `npx.cmd playwright test` repeated twice | PASS: 1 smoke test on each run; both commands terminated normally. |
| `npm.cmd run build` | PASS: Next.js production build completed and prerendered `/`. |
| `npm.cmd run verify` | PASS: formatting, lint, type-checking, unit tests, e2e, and build all completed. |
| `git diff --check` | PASS. |
| `git diff --cached --check` | PASS. |
| Required tracked-value grep | PASS WITH DOCUMENTATION-ONLY MATCH: the sole match is the grep command text in the execution plan. |
| Broader repository secret-pattern scan | PASS: no private-key marker, common token pattern, Supabase secret-shaped value, or populated tracked/example secret assignment was found. |
| Supabase CLI version | PASS: `2.106.0`. |
| Initial `npm.cmd run supabase:start` | EXPECTED ENVIRONMENT FAILURE: Windows excluded TCP range `54260-54359` covered the default local ports. |
| Revised local Supabase lifecycle | PASS: `supabase:start`, `supabase:status`, Auth/Mailpit health checks, and `supabase:stop` completed using tracked `5532x` ports. |

No dedicated `gitleaks` or `trufflehog` executable is installed in the local
environment. The repository's documented grep and the broader pattern scan
were used instead.

## Security Review

- `.env.example` contains blank or example-safe active values only.
- Future R2, payment-provider, and video-provider variables are absent.
- No production credential was added to source control, documentation, test
  configuration, or local evidence.
- Local Supabase status output contains generated development credentials by
  design; those values were not copied into tracked evidence.
- Supabase Storage/Buckets remain disabled, and no storage SDK or bucket
  configuration was added.
- Historical CI job `81255640354` masked GitHub tokens and showed no visible
  application/provider credential in the prior review. Current CI and Vercel
  logs still require external review.

## Remaining Human and External Checks

The following are active Stage 0/1 checks, not future-provider requirements:

1. Record named owners and independent reviewers in
   `docs/operations/FOUNDATION-SERVICE-READINESS.md`.
2. Review and confirm the sanitized local Supabase result, Preview Supabase
   isolation, and approved credential ownership.
3. Confirm one controlled non-production Supabase Auth email delivery through
   the approved non-production email path.
4. Confirm Sentry Preview/Staging project settings, filtering, access,
   retention, deletion verification, and source-map method.
5. Push only after explicit authorization, then record a successful GitHub
   Actions run for the proposed approval commit.
6. Record a Vercel Preview build using only active Stage 0/1 variables and
   review project and branch scopes for production-secret exclusion.
7. Complete the cross-service non-production credential and data-isolation
   review.
8. Complete product and architecture review of the future-provider readiness
   document.
9. Record explicit human Stage 0 approval.

## Deferred Providers

No Cloudflare R2 purchase, bucket, credential, or dashboard validation is
required until the Stage 2 asset-upload entry gate. No video-provider
selection, subscription, credential, or domain validation is required until
the Stage 4 gate. No Paymob or other payment-provider contract, merchant
access, credential, callback, or dashboard validation is required until the
Stage 5 gate.

Their absence does not block Stage 0 or Stage 1.

## Human Gate

**Stage 0 has not been approved by this review. The repository is prepared for
human/external verification and re-review. Stage 1 identity implementation must
not begin until the remaining active checks are recorded and a human explicitly
approves the Stage 0 exit.**
