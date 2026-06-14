# Logging and Data-Handling Policy

## Purpose

This document defines the minimum privacy and security rules for operational
logs, error monitoring, and future durable audit records before identity data
is introduced. It applies in every environment and to application code,
provider adapters, background work, deployment output, support diagnostics, and
monitoring integrations.

The policy applies before payment and video modules exist. Future payment,
playback, and analytics designs must comply with it, but their event and session
schemas are outside this document.

## Non-Negotiable Rules

- Collect only data required for an approved operational, security, or audit
  purpose.
- Use opaque correlation and entity identifiers instead of names, contact
  details, request content, or complete domain objects.
- Full email addresses are excluded from routine structured logs and error
  reports.
- Passwords, credentials, tokens, signatures, card data, complete webhook
  payloads, playback authorization, and child-specific personal information
  must never be logged.
- Logger calls use an event name and explicit, schema-approved fields. They must
  not serialize arbitrary objects.
- Error-monitoring filters run before an event leaves the application boundary.
- Every retained data class has a documented purpose, accountable owner, fixed
  retention period, and deletion or anonymization behavior. Indefinite or
  vendor-default retention is not acceptable.
- Human privacy and security review is mandatory before production logging is
  enabled and whenever fields, destinations, or retention rules change.

## Correlation Identifiers

Every request, asynchronous operation, or externally initiated event should
have one opaque correlation identifier:

1. Accept an incoming identifier only from a trusted internal boundary.
2. Otherwise generate a high-entropy, non-semantic identifier at the first
   server boundary.
3. Propagate it through internal calls, logs, error reports, and approved audit
   references.
4. Return it to the caller when useful for support, without exposing internal
   data.

A correlation identifier must not contain or be derived from an email address,
phone number, name, credential, provider signature, network address, device
identifier, or other personal or secret value. Correlation identifiers support
tracing; they are not authentication or authorization credentials.

## Safe Structured-Field Allowlist

The table below governs application-supplied event fields. Routine operational
logs may contain only these fields, or a narrower event-specific subset
approved through privacy and security review:

| Field | Rule |
| --- | --- |
| `correlation_id` | Opaque value following the correlation rules above. |
| `request_type` or `event_type` | Low-cardinality, code-defined name; never a raw URL, request body, or user-supplied label. |
| `user_id` | Opaque internal identifier only. Do not attach email, name, role claims, or profile data. |
| `order_id` | Opaque internal identifier or approved public reference only. |
| `payment_id` | Opaque internal identifier or approved non-secret provider reference only. |
| `enrollment_id` | Opaque internal identifier only. |
| `course_id` | Opaque internal identifier or non-sensitive slug only. |
| `lesson_id` | Opaque internal identifier or non-sensitive slug only. |
| `provider` | Code-defined provider name, never credentials or configuration. |
| `provider_reference` | A reviewed non-secret operational reference; never a token, signature, authorization value, or complete provider object. |
| `outcome` | Code-defined result such as success, denied, invalid, or failed. |
| `duration_ms` | Numeric operation duration without timestamps or behavioral detail beyond the approved purpose. |
| `error_code` | Stable application or provider code that contains no submitted data. |

The logging system may add a fixed envelope of code-defined or system-defined
operational metadata: timestamp, severity or level, application or service,
environment, and release or version. Envelope keys and sources must be
explicitly configured. This permission does not allow serialization of process
state, environment variables, configuration objects, deployment metadata, or
other arbitrary runtime data.

The allowlist is permission to use a field only when the event needs it. It is
not permission to attach every safe identifier to every log. Identifiers that
are unnecessary for the stated purpose must be omitted.

Opaque user, order, payment, and enrollment identifiers are pseudonymous,
linkable data. Course, lesson, provider, and correlation identifiers may also
be linkable in context. They remain subject to purpose minimization,
least-privilege access, approved retention, and export restrictions. "Safe"
means approved for a stated observability purpose relative to direct personal
data; it does not mean non-personal, anonymous, or unrestricted.

## Prohibited Log and Monitoring Data

The following data must not appear in logs, Sentry events, breadcrumbs,
deployment output, support exports, or routine audit metadata:

- passwords, password hashes, password-reset values, one-time codes, security
  answers, or recovery material;
- session identifiers, cookies, authorization headers, authentication tokens,
  API keys, database credentials, provider credentials, HMAC keys, encryption
  keys, or other secrets;
- webhook signatures, signature bases, full webhook payloads, or unredacted raw
  provider payloads;
- payment card numbers, security codes, magnetic-stripe or chip data, cardholder
  authentication data, or complete payment instrument details;
- video playback tokens, signed URLs, DRM or license responses, playback
  authorization payloads, or provider playback credentials;
- complete request or response bodies, complete headers, cookies, form data,
  arbitrary query strings, or serialized request and response objects;
- full email addresses, phone numbers, full legal names, postal addresses,
  birth dates, government identifiers, or free-form profile and support text;
- child-specific personal, educational, family, health, location, contact, or
  behavioral information;
- precise IP addresses, invasive device fingerprints, exact location, or raw
  device data unless a separately approved security control explicitly
  requires a minimized form; and
- arbitrary database records, user objects, learner profiles, error context
  objects, provider responses, or other nested application objects.

Server-authoritative payment or enrollment state may eventually produce a
code-defined outcome, but browser-supplied or unverified provider facts must not
be logged as authoritative. This statement is a policy boundary, not a payment
event schema.

## Learner-Data Minimization

Routine observability should identify a learner relationship only through the
minimum approved opaque identifiers. It must not duplicate learner profile
fields into logs or monitoring.

- Do not place a learner's name, email address, phone number, age, birth date,
  school, guardian details, support narrative, or lesson behavior in
  observability systems. If an approved legal or operational purpose requires
  one of those fields, store it in a separately governed domain record with its
  own access and retention rules.
- Do not infer or record that a learner is a child in routine logs.
- Use synthetic data in local, preview, and staging environments. Production
  learner data must not be copied into non-production logs or error projects.
- Minimize IP and device data. Coarse location may be collected only for an
  approved risk-review purpose when legally justified.
- Remove or anonymize learner data under the approved privacy policy and legal
  obligations. Operational logs must not become a secondary learner record.

## Future Logger Contract

The application logger must expose explicit structured operations, conceptually
equivalent to:

```ts
logger.info("identity.login_succeeded", {
  correlation_id,
  user_id,
  outcome: "success",
  duration_ms,
});
```

Each event has a reviewed field schema. Callers pass only those named scalar
fields. The logger must reject unknown fields in development and test. In
production it must drop an unknown field and emit, at most, a safe
metadata-only diagnostic that cannot recursively invoke the same logger path.
It must not accept object spreads, complete domain models, request or response
objects, error context bags, or arbitrary object serialization.

Central filtering is defense in depth, not permission to submit sensitive data.
When the application logger is implemented, automated tests must prove that
known sensitive keys are recursively removed or redacted in nested objects,
arrays, error causes, breadcrumbs, URLs, request metadata, and provider-shaped
data. Tests must use recognizable canary secret and personal-data values to
prove those values do not survive across those structures. They must cover
every prohibited category introduced by an active module. Unsafe fields, or
the whole event, must be dropped when sanitization cannot be guaranteed.

## Error Monitoring

Sentry and any future error-monitoring destination must use environment-specific
projects and filtering appropriate to browser, server, edge, and background
execution, following the environment isolation rules in
`docs/operations/ENVIRONMENTS.md`.

Allowed exception context is limited to:

- correlation identifier;
- approved safe entity identifiers required to investigate the error;
- environment, release, operation type, stable error code, outcome, and
  duration; and
- an approved exception class, a code-defined or deliberately sanitized
  message where practical, and a stack trace only after the controls below.

Application code must not construct exception messages from user-submitted,
provider-supplied, request, response, configuration, credential, or other
unreviewed values. Prefer stable code-defined messages and error codes. Generic
filtering cannot prove that every arbitrary exception message or stack frame is
free of sensitive data.

Before transmission, filtering must:

- remove request and response bodies, headers, cookies, authorization data, and
  arbitrary query strings;
- remove full email addresses and other personal profile fields;
- omit Sentry user email, name, IP address, and unreviewed custom context;
- recursively remove or redact known sensitive keys and known prohibited values
  from nested objects, arrays, causes, breadcrumbs, URLs, attachments, and
  metadata, including secrets, tokens, signatures, credentials, payment data,
  playback authorization, and personal data;
- omit arbitrary exception messages, stack frames, fields, or the entire event
  when their sanitization cannot be guaranteed; and
- retain URLs only as reviewed, code-defined route templates. Otherwise omit
  the URL or replace it with such a template; removing only the query string
  and fragment does not make an arbitrary path safe.

Future monitoring tests must place canary secret and personal-data values in
nested objects, arrays, causes, breadcrumbs, URL path segments, URL query
strings, URL fragments, and metadata, then verify that no transmitted event
contains them. Sensitive-key filtering and canary tests are complementary
controls; neither permits arbitrary values to be added to exceptions or
monitoring context.

Sampling must not be used as a privacy control. A prohibited value is prohibited
even when an event is sampled, transient, restricted to administrators, or
expected to expire quickly.

## Retention and Deletion

Retention is limited and purpose-specific. Before collection begins, the
accountable owner must record a concrete duration and deletion behavior for
each enabled class below. A class with no approved duration remains disabled.

| Data class | Retention expectation |
| --- | --- |
| Routine operational logs | Short, fixed retention sufficient for reliability and support diagnosis. Safe identifiers only; no use as a durable customer history. |
| Authentication and security logs | Defined, limited retention sufficient for abuse detection, incident investigation, and approved legal obligations. The purpose and access group must be documented. |
| Error-monitoring events | The shortest fixed period needed to diagnose and verify application failures, after filtering. Attachments and session replay remain disabled unless separately reviewed. |
| Durable domain audit records | May outlive operational logs only for approved administrative or security accountability. Store explicit audit facts, not log copies or request payloads, under a separately approved retention schedule. |
| Raw provider material | Avoid collection. When temporarily required for an active integration, minimize, redact, encrypt where needed, restrict access, and delete as soon as the operational purpose ends. |
| Learner-related data | Avoid duplicating it into observability systems. Remove or anonymize retained learner data according to approved privacy policy and legal obligations. |

Deletion must cover primary storage, searchable indexes, exports, attachments,
and vendor-managed copies within the documented capability of each service.
Each retention record must document backup and archive residual periods, legal
hold behavior, delayed or unsupported deletion paths, and the method and
frequency used to verify configured deletion settings. Vendor limitations do
not justify an unspecified primary retention period and must be accepted
through human privacy and security review. Access to retained identity and
security logs is least-privilege and itself reviewable. Retention extensions
require a documented incident, legal, or security purpose and human approval;
they must not silently become the default.

## Deferred Boundaries

This policy deliberately does not define:

- payment event names, fields, payload storage, or processing behavior;
- playback session events, device enforcement, or playback-security retention
  duration; or
- product analytics events, identity joins, consent, or analytics retention.

Future payment work must keep provider secrets and HMAC keys server-only, never
store card details, and treat verified server state as authoritative. Future
video work must keep provider credentials and playback authorization
server-only, minimize IP and device data, and approve a limited
playback-security retention period before collection. Product analytics needs a
separate data-minimization and privacy review.

These deferred modules may use the safe identifiers in this policy only after
their own designs are approved. They may not weaken the prohibited-field,
filtering, or human-review requirements.

## Human Review

Logging and data handling is a mandatory privacy and security review area.
Before production identity logging or error monitoring is accepted, reviewers
must confirm:

- every event has a stated purpose and explicit field schema;
- fields are limited to the safe allowlist and unnecessary identifiers are
  absent;
- pseudonymous and linkable identifiers have purpose, access, retention, and
  export controls;
- full email addresses, child data, secrets, payment data, provider payloads,
  and playback authorization are absent;
- browser, server, edge, and background error filtering is active before
  transmission;
- recursive sensitive-key filtering and nested canary-value tests exist and
  pass once logger code is introduced;
- each enabled retention class has an owner, fixed duration, access boundary,
  deletion behavior, vendor residual-period record, and verification method;
  and
- payment events, playback sessions, and product analytics have not been
  introduced through this policy without their separate approved designs.
