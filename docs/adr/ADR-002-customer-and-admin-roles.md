# ADR-002: Customer and Admin Roles

**Status:** Accepted
**Date:** 2026-06-13

## Context

The account holder may be a student, guardian, or adult learner. Separate Parent and Student roles would create family-account and delegated-access complexity.

## Decision

The only authenticated roles are Customer and Admin.

Each Customer owns exactly one Learner profile in the MVP. The Customer may purchase and learn directly or manage the account for the Learner.

Authentication uses email/password, email verification, and password reset. Phone/OTP authentication is deferred.

## Consequences

- Authorization remains simple.
- Learning data remains distinct from commercial account data.
- Multiple Learners, family management, and delegated guardian access require a later model change.
- The identity boundary must permit an additional authentication method later without changing the User role model.
