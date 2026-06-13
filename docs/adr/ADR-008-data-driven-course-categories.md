# ADR-008: Data-Driven Course Categories

**Status:** Accepted
**Date:** 2026-06-13

## Context

Yosr must support school subjects and general educational content without hard-coding the platform around one curriculum type.

## Decision

Categories are database records with optional hierarchy. A Course has one primary Category and optional audience metadata.

School level and general skill level are optional Course fields. Neither is required globally.

## Consequences

- New categories do not require code changes.
- School and non-school Courses share the same Course, Order, Enrollment, and learning model.
- Launch filtering remains simple.
- Complex taxonomy, tags, curriculum standards, and multiple-category assignment are deferred until demand is demonstrated.
