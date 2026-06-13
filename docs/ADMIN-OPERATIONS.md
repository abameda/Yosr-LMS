# Yosr Admin Operations

## Purpose

Define the smallest operational system required to run Yosr safely without a mentor dashboard, marketplace tooling, or advanced analytics.

## Admin Responsibilities

Admins manage:

- Categories.
- Mentor content records.
- Courses and curriculum.
- Video and resource references.
- Publication.
- Customers and Learners.
- Orders, payments, and reconciliation.
- Enrollments and access exceptions.
- Refund recording.
- Device support.
- WhatsApp and email support context.

## Access and Accountability

- Admin access uses the same authentication system with an Admin role.
- Sensitive operations require a recent authenticated session.
- Admin actions must be server-authorized.
- Manual grants, revocations, refunds, publication changes, and device resets require an audit record.
- Shared Admin accounts are prohibited.
- The MVP may have one Admin permission level; granular staff permissions are deferred.

## Dashboard Summary

Show operational counts rather than advanced analytics:

- Published and draft Courses.
- Recent Orders.
- Pending or failed Payment Attempts.
- Paid Orders without active Enrollment.
- Enrollments expiring soon.
- Recent playback authorization errors.
- Recent manual Admin actions.

Every count links to a filtered operational list.

## Course Operations

### Create

1. Confirm or create Category.
2. Confirm or create Mentor.
3. Create Course in Draft.
4. Enter commercial, audience, outcome, and access-policy information.
5. Add Sections and Lessons.
6. Attach video IDs and resources.
7. Verify totals and preview content.

### Publication Checklist

Before publication:

- Title, slug, descriptions, and Category exist.
- Mentor information is complete.
- Intended audience and outcomes are clear.
- Price and currency are valid.
- Access policy is explicit.
- At least one published Section and Lesson exist.
- Required video Lessons are ready.
- Preview settings are intentional.
- Course image and support/refund information are present.
- Mobile and Arabic presentation are reviewed.

### Update

- Price changes affect future Orders only.
- Access-policy changes affect future Enrollments only.
- Existing purchased terms remain in Order and Enrollment snapshots.
- Lesson edits must not remove progress history unexpectedly.
- Archiving removes the Course from new purchase while preserving existing learning access unless separately revoked.

## Mentor Operations

Mentors are content records only.

Admins:

- Create biography and credentials.
- Verify name and public claims.
- Store approved profile imagery.
- Associate Courses.
- Disable public display when needed.

Mentors do not receive accounts, upload access, analytics, payouts, or student information.

## Video and Resource Operations

- Upload source video through the approved provider process.
- Record the VdoCipher video ID.
- Confirm processing state and duration.
- Test secure playback from a Customer account with an Enrollment.
- Verify watermark and progress events.
- Store paid resources in private storage.
- Confirm resource MIME type, size, label, and access.
- Do not expose source video or private resource URLs.

## Customer and Learner Support

Admins can:

- Search by email or safe public Order reference.
- View the Customer and Learner relationship.
- View active, expired, and revoked Enrollments.
- View recent Orders, Payment Attempts, and playback failures.
- Add internal Operational Notes.
- Reset trusted devices after identity verification.
- Resend appropriate transactional email where supported.

Admins should not edit provider payment facts to match customer claims.

## Payment Operations

### Pending Payment

1. Locate the Order.
2. Review the latest Payment Attempt and expiry.
3. Review verified Payment Events.
4. Run reconciliation when the normal callback window has passed.
5. Explain pending or expiry status to the Customer.
6. Allow a new attempt only when the previous attempt is failed or expired.

### Payment Claimed but Not Confirmed

1. Request the safe Order or provider reference.
2. Do not accept screenshots as final proof.
3. Run provider reconciliation.
4. Escalate to provider support if status remains inconsistent.
5. Record an Operational Note.
6. Use a manual Enrollment grant only as an explicitly authorized business exception.

### Paid Without Enrollment

This is a priority incident:

1. Confirm the successful Payment Attempt.
2. Review payment-event processing error.
3. Retry the stored event through the normal domain flow.
4. Confirm unique Enrollment.
5. Notify the Customer.
6. Record incident cause.

## Manual Enrollment

Allowed reasons:

- Authorized complimentary access.
- Migration from a prior sales channel.
- Resolution of an approved operational incident.

Required fields:

- Learner.
- Course.
- Start and end dates.
- Reason.
- Admin actor.
- Related Order or support reference when applicable.

Manual grants do not create fake successful payments.

## Refund and Revocation

1. Validate refund eligibility.
2. Obtain authorized approval.
3. Complete or confirm the full-Order refund with the provider/merchant process.
4. Record a Refund Record and provider reference.
5. Mark Payment and Order refunded.
6. Confirm Enrollment revocation.
7. End active playback sessions.
8. Record audit event and Operational Note.
9. Send written confirmation.

Restoring access after a refund requires a new documented Admin decision or new purchase.

Partial refunds are not supported in the MVP operational workflow.

## Device Reset

1. Verify Customer identity using approved support information.
2. Review recent device and playback activity.
3. Revoke old trusted devices.
4. End active playback sessions.
5. Record the reason and Admin actor.
6. Tell the Customer to sign in again.

## Support Channels

### MVP

- WhatsApp link with optional prefilled safe reference.
- Support email.
- Internal Operational Notes tied to relevant records.

### Future

Potential integrations:

- Live chat widget.
- Helpdesk/ticket platform.
- Rules-based chatbot.
- AI support assistant grounded in approved documentation.

Future systems should receive stable Customer, Order, Payment, Enrollment, Course, and trace references through a dedicated integration boundary. They must not receive unnecessary learner or payment data.

## Incident Categories

Maintain simple runbooks for:

- Authentication/email delivery failure.
- Checkout creation failure.
- Delayed or invalid webhook.
- Paid Order without Enrollment.
- VdoCipher outage or playback failure.
- Progress not saving.
- Unexpected access expiry.
- Suspected account sharing.
- Data exposure or secret leak.

## Daily and Weekly Operations

### Daily

- Review failed payment-event processing.
- Review paid Orders without Enrollment.
- Review support messages.
- Review provider and application incidents.

### Weekly

- Reconcile unresolved Payment Attempts.
- Review refund and manual-grant records.
- Review upcoming Enrollment expiries.
- Review video cost and playback errors.
- Review Admin audit events.
- Confirm recent database backups.

## Prohibited MVP Operations

- Mentor self-service.
- Manual editing of raw payment events.
- Granting access from browser redirect status.
- Public file links for paid resources.
- Shared Admin credentials.
- Unrecorded refunds, grants, or revocations.
- Automatic permanent bans based on a single suspicious playback signal.
