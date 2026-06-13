# ADR-007: VdoCipher Primary Video Provider

**Status:** Accepted
**Date:** 2026-06-13

## Context

Paid educational video needs short-lived authorization, practical download deterrence, watermarking, and progress events. No browser delivery can fully prevent recording.

## Decision

Use VdoCipher as the primary MVP provider. Require an Egypt playback and cost pilot before production launch.

Use Bunny Stream as the documented fallback if VdoCipher is materially unsuitable for target devices, networks, or budget.

## Consequences

- Playback authorization remains server-side and Enrollment-gated.
- Viewer-specific watermarks and concurrency policy are part of MVP security.
- Provider payloads are isolated behind a media boundary.
- Production launch is blocked until pilot results are acceptable.
- A fallback migration requires re-uploading or synchronizing video assets.
