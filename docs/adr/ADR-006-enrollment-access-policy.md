# ADR-006: Enrollment-Based Course Access

**Status:** Accepted
**Date:** 2026-06-13

## Context

Courses need configurable access periods. Changing a Course later must not silently alter existing customer access.

## Decision

A Course defines an access policy. The default is 12 calendar months from confirmed purchase. A Course may use a different month duration or a fixed access end date.

At purchase, the policy is copied into the Order. At successful payment, calculated start and end dates are stored in the Enrollment.

## Consequences

- Existing purchase terms remain stable.
- Authorization can check Enrollment dates without recalculating from mutable Course data.
- Refunds revoke the Enrollment explicitly.
- Renewal, lifetime access, and access extensions require separate approved rules.
