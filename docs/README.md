# Yosr Documentation

This directory defines the approved product and architecture direction for Yosr before application development begins.

## Document Authority

When documents appear to conflict, use this order:

1. `PRODUCT-BRIEF.md` for product purpose and confirmed decisions.
2. `MVP-SCOPE.md` for launch boundaries.
3. Architecture Decision Records in `adr/` for technical decisions.
4. Focused specifications for detailed behavior.
5. `STAGED-IMPLEMENTATION-PLAN.md` for delivery order.

## Documents

- [Product Brief](PRODUCT-BRIEF.md)
- [MVP Scope](MVP-SCOPE.md)
- [User Journeys](USER-JOURNEYS.md)
- [Technical Architecture](TECHNICAL-ARCHITECTURE.md)
- [Architecture Decision Records](adr/README.md)
- [Data Model](DATA-MODEL.md)
- [Payment Flow Specification](PAYMENT-FLOW.md)
- [Video Security Specification](VIDEO-SECURITY.md)
- [Admin Operations](ADMIN-OPERATIONS.md)
- [Staged Implementation Plan](STAGED-IMPLEMENTATION-PLAN.md)
- [Launch Checklist](LAUNCH-CHECKLIST.md)
- [Consolidated Design Record](superpowers/specs/2026-06-13-yosr-platform-design.md)

## Current Status

The product design is approved for documentation. Application code, database migrations, infrastructure provisioning, and UI implementation have not started.

## Working Rule

Every implementation task must cite the relevant requirement or decision from these documents. Changes to product scope or architecture should update the documentation before code is changed.
