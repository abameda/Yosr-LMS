# LMS Project Agent Instructions

## Core rule

This repository is documentation-driven. Do not treat any single file as the only source of truth.

Before implementing a task, inspect the current repository state and read the relevant project documentation.

## Required reading before implementation

For any staged implementation task, start with the execution plan that matches the current stage being worked on.

Examples:

* `docs/execution/STAGE-0-1-EXECUTION-PLAN.md`
* `docs/execution/STAGE-2-EXECUTION-PLAN.md`
* `docs/execution/STAGE-3-EXECUTION-PLAN.md`

If multiple stage execution plans exist, identify the active stage from the repository state and use the corresponding execution plan before implementing changes.

* `STAGED-IMPLEMENTATION-PLAN.md`
* `MVP-SCOPE.md`
* `docs/operations/ENVIRONMENTS.md`
* `docs/operations/LOGGING-AND-DATA-HANDLING.md`
* Relevant ADRs under `docs/adr/`

Use the execution plan as the task-level guide, but use ADRs and operations docs as architectural and environment constraints.

## Conflict handling

If files conflict with each other, stop before coding and report the conflict clearly.

Do not silently choose one direction when documentation disagrees.

## Scope discipline

Only implement the specific task requested by the user.

Do not work ahead into future tasks.

Do not modify unrelated files.

Do not introduce new providers, services, environment variables, or architecture changes unless the relevant ADR or operations document allows it.

## Current architecture constraints

* Keep the project aligned with the documented Supabase platform direction.
* Do not introduce Supabase Buckets unless the documentation explicitly changes.
* Respect the latest R2 storage direction and environment contract.
* Do not add premature provider variables.
* Keep payments provider-aware and aligned with the payment ADR.
* Keep video handling aligned with the VdoCipher ADR.

## Verification

After changes, run the project’s required verification commands when available.

Prefer:

* `npm ci` when dependencies need validation
* `CI=true npm run verify` for full verification
* any task-specific tests mentioned in the execution plan

If a command cannot run, explain why.

## Final response format

At the end of each task, summarize:

1. What was implemented
2. Files changed
3. Verification commands run
4. Results
5. Blockers or risks
6. Whether the worktree is clean or has pending changes

## Safety

Do not discard local work.

Do not use destructive Git commands unless the user explicitly asks.

Do not remove docs or rewrite project direction without confirmation.
