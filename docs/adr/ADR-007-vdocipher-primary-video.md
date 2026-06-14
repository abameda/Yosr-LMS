# ADR-007: Deferred Provider-Neutral Video Hosting

**Status:** Accepted
**Date:** 2026-06-13

## Context

Paid educational video needs short-lived authorization, practical download deterrence, watermarking, and progress events. No browser delivery can fully prevent recording.

## Decision

Keep video hosting behind a provider-neutral media boundary. Do not select, contract, configure, or implement a video provider during the current foundation stages.

Before the secure-video stage begins, evaluate candidate providers against playback reliability in Egypt, authorization controls, watermarking, event support, operating cost, and contract readiness. VdoCipher and Bunny Stream may be evaluated, but neither is assumed to be selected or contracted.

## Consequences

- Playback authorization remains server-side and Enrollment-gated.
- Watermarking and concurrency requirements are expressed as provider capabilities, not provider-specific payloads.
- Provider payloads are isolated behind a media boundary.
- Secure-video implementation is blocked until a provider decision and readiness gate are approved.
- Production launch is blocked until the selected provider passes the Egypt playback and cost pilot.
- Video bytes are not stored in Cloudflare R2 as part of the application asset-storage decision.
