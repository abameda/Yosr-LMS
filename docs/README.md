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

The product design and Stage 0 foundation are approved for Stage 1. The
root-level Next.js application scaffold and Task 1.1 Arabic-first application
shell are implemented. Task 0.7's Supabase database strategy and Task 1.1's
human review gates were approved by the project owner on 2026-06-15. Task 1.2's
Prisma identity schema and first migration are implemented and locally
verified, with mandatory migration and RLS review pending. The remaining Stage
1 identity behavior has not started.

## Working Rule

Every implementation task must cite the relevant requirement or decision from these documents. Changes to product scope or architecture should update the documentation before code is changed.
