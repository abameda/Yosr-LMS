# Yosr MVP Scope

## Scope Rule

The MVP is a curated course-selling and learning platform. A feature belongs in v1 only when it is required to publish courses, collect payment, grant controlled access, deliver learning, or operate customer support.

## Included

### Public Experience

- Arabic-first, RTL public website.
- Homepage.
- Published course listing.
- Basic filtering by category.
- Course detail pages.
- Mentor information displayed on courses.
- Course curriculum preview.
- Optional preview lesson or trailer.
- About, contact, support, privacy, terms, and refund pages.

### Accounts

- Customer registration with email and password.
- Email verification.
- Login and logout.
- Password reset.
- One Learner profile per Customer account.
- Basic account and Learner profile editing.
- Customer and Admin roles only.

### Catalog and Course Structure

- Data-driven categories supporting school and general learning.
- Courses with optional school-specific metadata.
- Courses with optional general skill-level metadata.
- Course sections.
- Video lessons.
- Resource lessons or downloadable lesson resources.
- Course images, thumbnails, PDFs, attachments, and uploaded assets stored in Cloudflare R2.
- Ordered curriculum.
- Draft, published, and archived course states.
- Configurable access policy per course.
- Default access duration of 12 calendar months.

### Commerce

- One course per checkout.
- Server-authoritative prices.
- Provider-neutral orders.
- Provider-aware payment attempts and events.
- Hosted checkout through the approved payment provider; Paymob is the current candidate pending contracting and readiness approval.
- Pending, asynchronous, expired, failed, successful, and refunded payment states.
- Verified webhook/callback handling.
- Idempotent enrollment creation.
- Payment reconciliation support.
- Payment status pages.
- Manual full-order refund recording.
- Access revocation after a confirmed refund.
- Architecture ready for a future Fawry adapter.

### Learning

- My Courses.
- Continue Learning.
- Enrollment-gated course access.
- Secure playback through a future selected video provider.
- Lesson navigation.
- Resume position.
- Lesson progress.
- Required lesson completion.
- Course completion percentage.
- Secure resource access.
- Expired and revoked access states.

### Administration

- Operational dashboard summary.
- Category management.
- Mentor record management.
- Course creation and editing.
- Section and lesson ordering.
- Selected-provider video ID attachment and readiness status.
- Resource attachment.
- Course publication and archival.
- Customer and Learner lookup.
- Order, payment, and payment-event inspection.
- Enrollment grant, revoke, restore, and expiry inspection.
- Manual refund workflow.
- Device reset for support.
- Admin audit records for sensitive actions.

### Operations and Reliability

- Structured application logs.
- Error monitoring.
- Payment and playback correlation identifiers.
- Database backups and recovery procedure.
- Appropriate database indexes.
- Public catalog caching and revalidation.
- Server-side authorization.
- Cloudflare R2 public asset delivery and private signed resource access.
- Secret separation between runtime and administrative access.
- Egypt playback pilot before production launch.

### Support

- Visible WhatsApp support entry points.
- Support email entry points.
- Order and enrollment references that customers can share with support.
- Documented future path for live chat, chatbot, AI support, and helpdesk integration.

## Explicitly Excluded

- Public mentor registration.
- Mentor authentication or dashboards.
- Self-service course upload.
- Mentor payouts, commissions, balances, or revenue sharing.
- Public marketplace behavior.
- Family accounts or multiple Learner profiles.
- Shopping cart or multiple courses per order.
- Subscriptions, memberships, installments, or bundles.
- Coupons, referrals, and affiliate tracking.
- Fawry implementation unless separately approved for launch readiness.
- Automated refunds.
- Partial refunds.
- Quizzes, assignments, grading, or certificates.
- Live classes, forums, comments, or mentor chat.
- Reviews and ratings.
- Recommendations or personalized discovery.
- Gamification, badges, points, or leaderboards.
- Native mobile apps or offline downloads.
- Advanced analytics dashboards.
- Live chat, chatbot, AI support, or ticketing integration.
- Multi-language localization beyond Arabic-first foundations.

## Launch Content Constraint

Launch with a small set of complete, high-quality courses. The data model may support many categories, but the launch catalog should not imply breadth the operations team cannot maintain.

## Payment Provider Boundary

No payment provider is assumed to be contracted during the foundation stages. Paymob is the current first-provider candidate and becomes a launch dependency only after contracting and readiness approval. Fawry is a planned provider, not an automatic MVP commitment. Fawry enters the launch scope only if:

- Credentials and merchant configuration are ready.
- Sandbox and production callbacks are validated.
- Pending and expiry support is operationally tested.
- Reconciliation and customer instructions are documented.
- Adding it does not delay the first-provider launch.

## Definition of MVP Complete

The MVP is complete when an Admin can publish a course, a Customer can pay through the approved payment provider, a verified payment creates one valid enrollment, the Learner can securely watch and resume lessons through the selected video provider, and the Admin can resolve payment, access, refund, and device-support cases.
