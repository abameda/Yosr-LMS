# ADR-005: Provider-Aware Payment Model

**Status:** Accepted
**Date:** 2026-06-13

## Context

Paymob is the first provider, while Fawry may be added for asynchronous reference payments. Coupling Orders directly to Paymob would make later providers and reconciliation difficult.

## Decision

Use provider-neutral Orders and provider-aware Payment Attempts and Payment Events.

Paymob hosted checkout is implemented first. Provider adapters normalize checkout creation, event verification, status mapping, and reconciliation.

Enrollment is created only after a verified successful provider event or successful provider reconciliation.

## Consequences

- Fawry can be introduced without changing Order or Enrollment semantics.
- Payment events require idempotency and explicit state transitions.
- Pending and expiry are first-class states.
- Provider-specific references remain available for support.
- Browser redirects cannot grant access.
