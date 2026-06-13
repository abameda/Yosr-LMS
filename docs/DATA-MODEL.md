# Yosr Data Model

## Modeling Principles

- Use relational constraints for business invariants.
- Keep provider-specific fields out of core Order and Enrollment logic.
- Snapshot commercial terms at purchase time.
- Store calculated enrollment dates so later Course edits do not change existing access.
- Prefer append-oriented payment events and audit records.
- Keep optional school metadata from constraining general skill courses.
- Use UTC timestamps and display them in the user’s locale.

## Identity

### User

Represents an authenticated account.

Important attributes:

- Supabase Auth identifier.
- Email.
- Role: Customer or Admin.
- Account status.
- Email verification status reference.
- Created and updated timestamps.

Constraints and indexes:

- Unique Auth identifier.
- Unique normalized email.
- Index by role and account status for Admin operations.

### LearnerProfile

Represents the learner attached to a Customer.

Important attributes:

- Owning User.
- Display name.
- Optional educational level label.
- Optional birth-year or age-band only if legally justified.
- Created and updated timestamps.

Constraints:

- Exactly one Learner profile per Customer in MVP.
- Unique User reference.

Avoid collecting school name, precise birth date, address, or other child data unless a verified product and legal requirement emerges.

## Catalog

### Category

Supports school and general education.

Important attributes:

- Arabic name.
- Slug.
- Optional parent Category.
- Description.
- Display order.
- Active state.

Examples include School Subjects, Programming, UI/UX, Technology, and Skills. Category rows, not code changes, expand the catalog.

Constraints and indexes:

- Unique slug.
- Index by parent and active state.
- Prevent category cycles through application validation.

### Mentor

A public content record with no authentication.

Important attributes:

- Arabic display name.
- Biography.
- Credentials.
- Profile image.
- Optional public links.
- Active state.

### Course

Important attributes:

- Arabic title and slug.
- Short and full descriptions.
- Primary Category.
- Primary Mentor.
- Learning outcomes.
- Prerequisites.
- Audience description.
- Optional school-level label.
- Optional general skill level.
- Thumbnail and optional trailer reference.
- Current price and currency.
- Draft, published, or archived state.
- Access policy type.
- Access duration in calendar months when duration-based.
- Fixed access end time when date-based.
- Publication timestamp.
- Cached duration and lesson count.

Access policy:

- Default: duration from purchase, 12 calendar months.
- Optional: a different positive month duration.
- Optional: a fixed Course access end date.

An Enrollment stores its own calculated dates.

Indexes:

- Unique slug.
- Published state and publication time.
- Category and published state.
- Mentor and state.

### Section

Important attributes:

- Course.
- Title.
- Optional description.
- Display position.

Constraint:

- Unique display position within a Course.

### Lesson

Important attributes:

- Section.
- Title and optional description.
- Type: video or resource.
- Display position.
- Preview flag.
- Required flag.
- Estimated duration.
- Draft or published state.

Constraints and indexes:

- Unique display position within a Section.
- Index by Section and state.

### Video

Provider-neutral metadata for a video Lesson.

Important attributes:

- Lesson.
- Provider.
- External video identifier.
- Processing state.
- Duration.
- Optional poster reference.
- Security profile version.

Constraints:

- One active Video per video Lesson.
- Unique provider plus external identifier.

### Resource

Important attributes:

- Lesson.
- Private storage object path.
- Display label.
- MIME type.
- File size.
- Display position.
- Active state.

## Commerce

### Order

Represents the Customer's intent to buy one Course.

Important attributes:

- Public reference.
- Customer User.
- Learner snapshot.
- Pending payment, paid, cancelled, or refunded state.
- Currency.
- Total amount.
- Course access-policy snapshot.
- Created, paid, and refunded timestamps.

Indexes:

- Unique public reference.
- Customer and creation time.
- Status and creation time.

### OrderItem

Stores the purchased Course and commercial snapshot.

Important attributes:

- Order.
- Course.
- Course title snapshot.
- Unit price.
- Quantity fixed to one.

MVP invariant:

- Exactly one Order Item per Order.

Keeping Order Item separate preserves a clean commercial record without adding a cart or multi-course checkout.

### PaymentAttempt

Represents one attempt to pay an Order.

Important attributes:

- Order.
- Provider: Paymob or future Fawry.
- Initiated, pending, succeeded, failed, expired, or refunded state.
- Provider intention/payment/reference identifiers.
- Local checkout-creation idempotency key.
- Amount and currency.
- Provider checkout expiry.
- Failure code and safe failure message.
- Created, updated, succeeded, and refunded timestamps.

Constraints and indexes:

- Unique provider plus provider payment identifier when present.
- Unique local checkout-creation idempotency key.
- Index by Order and creation time.
- Index by provider, state, and updated time for reconciliation.

### PaymentEvent

Durably records provider callbacks and reconciliation observations.

Important attributes:

- Provider.
- Unique provider event key or deterministic event hash.
- Event type.
- Related Payment Attempt when resolved.
- Authenticity-verification result.
- Processing state.
- Safe payload or encrypted/redacted payload reference.
- Received and processed timestamps.
- Failure details.

Constraints and indexes:

- Unique provider plus event key.
- Index by processing state and received time.
- Index by Payment Attempt.

### RefundRecord

Represents a manual refund decision and provider confirmation.

Important attributes:

- Order.
- Payment Attempt.
- Amount.
- Reason.
- Provider refund reference.
- Confirmed time.
- Admin actor.
- Access revocation decision.

MVP refunds cover the full Order amount. Partial refunds require a separate product and accounting decision.

## Access and Learning

### Enrollment

Grants one Learner access to one Course.

Important attributes:

- Learner.
- Course.
- Source: purchase or manual Admin grant.
- Active, expired, or revoked state.
- Start time.
- End time or null only when an explicitly supported non-expiring policy is introduced.
- Originating Order when purchased.
- Revocation reason and time.
- Admin actor for manual changes.

Constraints and indexes:

- Unique Learner plus Course.
- Index by Learner and state.
- Index by Course and state.
- Index by state and end time for expiry processing.

A later repurchase may restore the existing Enrollment and replace access dates according to an explicitly approved renewal rule. The MVP purchase flow should prevent accidental duplicate active purchases.

### LessonProgress

Important attributes:

- Learner.
- Lesson.
- Last playback position.
- Covered duration.
- Duration snapshot.
- Not started, in progress, or complete state.
- Started, last activity, and completed timestamps.

Constraints:

- Unique Learner plus Lesson.

Completion:

- Video Lesson: at least 90 percent covered, with reasonable heartbeat validation.
- Resource Lesson: explicit completion when required.
- Course progress: completed required Lessons divided by total required Lessons.

### Device

Represents a privacy-conscious trusted browser/device record.

Important attributes:

- User.
- Hashed random device identifier.
- User-editable or derived generic label.
- Trusted, revoked, or blocked state.
- First and last seen timestamps.

Do not store invasive hardware fingerprints.

### PlaybackSession

Important attributes:

- User.
- Learner.
- Course.
- Lesson.
- Device.
- Provider session or trace reference.
- Started, last heartbeat, and ended timestamps.
- Active or ended state.
- End reason.
- Coarse network risk information when justified.

Indexes:

- User and active state.
- Lesson and start time.
- Last heartbeat for stale-session cleanup.

## Operations

### AdminAuditEvent

Important attributes:

- Admin User.
- Action type.
- Target entity type and identifier.
- Before/after summary for sensitive fields.
- Reason.
- Correlation ID.
- Timestamp.

Audit at minimum:

- Course publication and archival.
- Manual Enrollment grant, revoke, and restore.
- Refund recording.
- Payment status override, if ever permitted.
- Device reset.
- Admin role changes.

### OperationalNote

Optional internal note attached to a Customer, Order, Payment, or Enrollment.

Important attributes:

- Admin author.
- Target type and identifier.
- Note text.
- Timestamp.

This supports WhatsApp and email cases without building an internal ticketing product.

## Retention

- Commercial and payment records follow accounting and legal retention requirements.
- Authentication and security logs use a defined limited retention period.
- Raw provider payloads are minimized, redacted, encrypted where needed, and retained only as long as operationally necessary.
- Learner data is minimized and removed or anonymized according to approved privacy policy and legal obligations.
