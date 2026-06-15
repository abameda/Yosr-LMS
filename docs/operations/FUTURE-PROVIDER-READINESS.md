# Future Provider Readiness

## Purpose

Define when future Cloudflare R2, video-provider, and payment-provider work may
begin without making those providers prerequisites for the application
foundation.

This document records gates and evidence only. It does not provision accounts,
credentials, buckets, domains, callbacks, SDKs, subscriptions, or integrations.
No provider secret or secret-shaped example belongs in this document.

## Gate Summary

| Provider boundary | Final stage-entry approval boundary | Work directly blocked without final stage-entry approval | Work not directly blocked by this provider gate |
| --- | --- | --- | --- |
| Cloudflare R2 | Stage 2 asset-upload implementation | Only course-image, thumbnail, PDF, attachment, and other non-video upload work that requires R2 | Stage 0, Stage 1, and Stage 2 catalog work that does not require asset uploads |
| Video provider | Stage 4 entry | All Stage 4 secure-video implementation | Work outside Stage 4, subject to normal roadmap ordering and other gates |
| Payment provider | Stage 5 entry | All Stage 5 payment-provider implementation | Work outside Stage 5, subject to normal roadmap ordering and other gates |

Missing R2, payment-provider, or video-provider access does not block Stage 0 or
Stage 1 completion. Future provider variables remain absent from active Stage
0/1 configuration and must not be required by unrelated install, build, tests,
application startup, preview, or deployment.

## Gate Preparation and Implementation Sequence

Task 0.9 is documentation only. It does not provision or configure current
accounts, credentials, buckets, domains, callbacks, provider dashboards, SDKs,
subscriptions, or integrations.

Every future readiness gate has two distinct checkpoints:

1. **Preparation authorization.** This checkpoint passes only after the proposed
   provider or configuration scope, accountable owners, environment isolation,
   and secret-storage plan are reviewed. Where a provider must be selected and
   commercially approved, that decision is part of this checkpoint. This is the
   documented readiness-gate authorization required by
   `docs/operations/ENVIRONMENTS.md` before any provider configuration exists.
   It permits only the minimum non-production provider-side setup needed to
   gather evidence: account, bucket, or merchant access; least-privilege
   credentials issued into approved secret stores; provider dashboard settings;
   and domain registration or validation.
2. **Final stage-entry approval.** This checkpoint passes only after the full
   provider checklist and its evidence are validated. It permits the applicable
   Stage 2 asset-upload work, Stage 4, or Stage 5 to begin. It does not make
   unrelated work depend on the provider.

Before preparation authorization, no provider-side setup may be performed for
gate evidence. Preparation may define the selected adapter's eventual
conditional variable contract and validation or test requirements, but future
provider variables remain absent from active Stage 0/1 configuration and
unrelated builds and tests. Credential values must never appear in
documentation, source control, `.env.example`, or review evidence.

After final stage-entry approval, the later implementation task may install
provider SDKs and implement application adapters, callback endpoints, provider
flows, and integration tests. Provider-side setup strictly needed as gate
evidence is completed only under preparation authorization and is not deferred
to the implementation task.

## Accountable Roles

Roles may be held by the same person, but each checkpoint decision must name
the people acting in these roles before that checkpoint is approved:

| Role | Accountability |
| --- | --- |
| Product owner | Confirms provider selection, scope, operating fit, and acceptable cost. |
| Architecture owner | Confirms the application boundary remains provider-neutral where required. |
| Platform and security owner | Owns account access, least-privilege credentials, environment separation, and secret storage. |
| Content operations owner | Owns the R2 asset workflow and the selected video-provider publishing workflow. |
| Commerce operations owner | Owns merchant operations, reconciliation, payment support, and provider escalation paths. |

The product owner and architecture owner must approve this readiness document
before later-stage checkpoint decisions rely on it.

## Cloudflare R2 Gate

### Boundary Rules

- R2 is selected only for course images, thumbnails, PDFs, attachments, and
  other uploaded non-video assets.
- Video bytes are excluded from R2.
- Supabase Storage and Supabase Buckets are not used.
- Public assets may use CDN-backed public delivery without application
  mediation. Protected or private assets require application authorization and
  short-lived signed URLs.
- Domain records should depend on internal asset references and metadata, not
  R2 response shapes or credentials.

### Deferred Inventory

The following inventory is intentionally deferred until Stage 2 asset-upload
gate preparation:

- Cloudflare account owner and approved operators.
- Non-production R2 bucket or approved isolated prefix.
- Production bucket or isolation decision when production planning requires it.
- Credential classes and least-privilege capabilities for server-side upload,
  read, delete, and signed access.
- Approved secret-storage locations for each environment.
- Public asset delivery policy and private signed-URL policy.
- Rotation, revocation, billing, and incident owners.

Inventory records may contain owner names, account or bucket identifiers, and
status. They must never contain credential values.

### Preparation Authorization Checklist

- [ ] Product and architecture owners confirm the R2 boundary above.
- [ ] Platform and security owner is named.
- [ ] Content operations owner is named.
- [ ] The proposed non-production bucket or isolated-prefix scope, environment isolation, credential ownership, least-privilege capabilities, and approved secret-storage plan are reviewed.
- [ ] Public delivery, private signed access, rotation, revocation, billing, and incident plans are reviewed.

Preparation authorization permits only the minimum non-production R2 setup
needed to collect the final evidence below.

### Final Stage-Entry Approval Checklist

- [ ] The R2 account exists, configured development access is available, and an existing non-production bucket or approved isolated prefix and credential owner are documented.
- [ ] Least-privilege credential capabilities and approved storage locations are documented.
- [ ] Public delivery and private signed-access behavior are documented.
- [ ] Environment separation, rotation, revocation, billing, and incident ownership are documented.
- [ ] The approved adapter's eventual conditional variable contract, validation rules, tests, and blank `.env.example` update are scoped without adding active Stage 0/1 requirements.

Without final stage-entry approval, this provider gate directly blocks only
R2-dependent Stage 2 asset-upload work. Other Stage 2 catalog work may continue.

## Video-Provider Gate

### Boundary Rules

- Video hosting remains provider-neutral and unselected during the foundation
  stages.
- A provider is selected and commercially approved during future gate
  preparation as part of preparation authorization. Selection does not wait
  for final Stage 4 entry approval.
- VdoCipher, Bunny Stream, and other services remain candidates until that
  selection; none is assumed.
- Enrollment and learning rules depend on an internal playback-authorization
  boundary, not provider payloads.
- Provider-specific authorization, identifiers, readiness states, player
  events, and errors are normalized inside a media adapter.
- Provider credentials remain server-only, and video bytes do not move into R2.

### Deferred Inventory

The following inventory is intentionally deferred until Stage 4 gate
preparation:

- Approved provider decision and commercial agreement owner.
- Development and later production account owners.
- Development, staging, and production credential classes and storage
  locations.
- Approved playback domains and non-production origin policy.
- Required authorization, token, watermark, player-event, and support
  capabilities.
- Egypt device/network pilot owner, cost owner, and provider escalation contact.
- Rotation, revocation, billing, and incident owners.

Inventory records may contain owner names, provider account identifiers, domain
names, and status. They must never contain credentials, playback tokens, or
authorization payloads.

### Preparation Authorization Checklist

- [ ] Product owner records the selected provider and approved commercial decision.
- [ ] Architecture owner confirms the provider-neutral media boundary.
- [ ] Platform and security owner is named.
- [ ] Content operations owner is named.
- [ ] Development, staging, and production isolation and the server-only secret-storage plan are reviewed.
- [ ] The non-production account, access, dashboard, and playback-domain setup needed for final evidence is scoped.

Preparation authorization permits only that minimum non-production provider
setup, including development access and domain registration or validation.

### Final Stage-Entry Approval Checklist

- [ ] The selected and commercially approved provider remains the recorded decision.
- [ ] Development access is available, and environment isolation is approved.
- [ ] Playback-domain requirements are documented and the required non-production domains are validated.
- [ ] Server authorization, credential storage, and token-handling requirements are approved.
- [ ] The selected provider can enforce the accepted `docs/VIDEO-SECURITY.md` policies: a playback authorization lifetime of approximately five to ten minutes, up to three trusted devices per Customer, and one active playback session at a time.
- [ ] Required watermarking, player events, support data, and Egypt pilot capabilities are confirmed.
- [ ] Cost, billing, escalation, rotation, revocation, and incident owners are documented.
- [ ] The selected adapter's eventual conditional variable contract, validation rules, tests, and blank `.env.example` update are scoped without adding active Stage 0/1 requirements.

Stage 4 must not begin without final stage-entry approval. This provider gate
directly blocks only Stage 4; normal roadmap ordering and other stage gates
still apply.

## Payment-Provider Gate

### Boundary Rules

- No payment provider is selected or assumed to be contracted during the
  foundation stages. Paymob is the current candidate only.
- Orders and Enrollment behavior remain provider-neutral.
- Payment Attempts and Payment Events remain provider-aware.
- A provider adapter owns checkout creation, authenticity verification, state
  mapping, stable references, and reconciliation.
- Browser redirects never grant access. Only a verified provider event or
  successful provider reconciliation may confirm payment.

### Deferred Inventory

The following inventory is intentionally deferred until Stage 5 gate
preparation:

- Approved provider decision, contract owner, and commercial contacts.
- Sandbox and later production merchant account owners.
- Credential and signature-verification material classes and approved
  server-only storage locations.
- Return and callback domain ownership and environment-specific registration
  status.
- Sandbox, staging, and production separation.
- Reconciliation owner, finance/support contacts, and provider escalation path.
- Rotation, revocation, billing, and incident owners.

Inventory records may contain owner names, merchant or account identifiers,
registered domains, and status. They must never contain credentials, signature
material, or complete provider payloads.

### Preparation Authorization Checklist

- [ ] Product owner records the selected and contracted payment provider.
- [ ] Architecture owner confirms provider-neutral Orders and provider-aware Payment Attempts and Events.
- [ ] Platform and security owner is named.
- [ ] Commerce operations owner is named.
- [ ] Sandbox, staging, and production isolation and the server-only credential and signature-material storage plan are reviewed.
- [ ] The sandbox merchant, dashboard, return-domain, and callback-domain setup needed for final evidence is scoped.
- [ ] The callback authenticity, idempotency, amount/currency/merchant/environment mismatch, and reconciliation test plan and required coverage are defined and reviewed.

Preparation authorization permits only the minimum non-production merchant and
domain setup needed to collect the final evidence below.

### Final Stage-Entry Approval Checklist

- [ ] Sandbox merchant access is active, and environment isolation is approved.
- [ ] Callback authenticity and signature-verification requirements are documented.
- [ ] Return and callback domain ownership and registration requirements are validated.
- [ ] Reconciliation, finance support, escalation, rotation, revocation, billing, and incident owners are documented.
- [ ] The selected adapter's eventual conditional variable contract, validation rules, and blank `.env.example` update are scoped without adding active Stage 0/1 requirements.

Actual application integration tests for callback authenticity, idempotency,
mismatch rejection, and reconciliation are implemented and run by the
post-approval Stage 5 implementation task, not during gate preparation.

Stage 5 must not begin without final stage-entry approval. This provider gate
directly blocks only Stage 5; normal roadmap ordering and other stage gates
still apply.

## Gate Approval Record

Each future checkpoint review must record:

- the checkpoint name: preparation authorization or final stage-entry approval;
- decision date and target stage;
- named accountable roles;
- completed checkpoint checklist evidence;
- approved provider or R2 configuration scope;
- unresolved risks and any explicit waivers;
- product, architecture, and security approvals; and
- the documentation and environment-contract changes authorized by the
  checkpoint.

Waivers may record accepted residual risks, but they cannot replace any
mandatory checklist item or entry criterion. An exception to a mandatory
criterion requires the governing plan or ADR to be amended through normal
review before final stage-entry approval.

Checkpoint authority and sequencing follow
`Gate Preparation and Implementation Sequence` above. Neither checkpoint
authorizes secrets in documentation, source control, `.env.example`, or review
evidence, and Task 0.9 provisions or configures none of these provider
resources.

## Current Status

As of June 14, 2026, preparation authorization and final stage-entry approval
remain deferred for all three provider gates. No R2 bucket or credential,
payment-provider contract or merchant access, or video-provider selection or
access is required for Stage 0 or Stage 1.

This document requires product and architecture review before Task 0.9 is
accepted for forward stage planning.
