# Yosr Payment Flow Specification

## Purpose

Define a reliable, provider-aware payment flow that implements Paymob first and can add Fawry without changing Order, Enrollment, or learning behavior.

## Principles

- An Order is Yosr's commercial record.
- A Payment Attempt is a provider-specific attempt to pay an Order.
- A Payment Event is an immutable provider observation.
- A browser redirect never grants access.
- Provider events are authenticated, idempotent, and reconciled.
- Enrollment creation is a consequence of confirmed payment, not checkout initiation.
- One Course is purchased per Order in the MVP.

## Provider Boundary

Each payment provider integration is responsible for:

- Creating a hosted checkout or payment request.
- Mapping provider states to Yosr states.
- Verifying callback or webhook authenticity.
- Extracting stable provider references.
- Querying payment status for reconciliation.
- Normalizing safe customer-facing failure information.
- Supporting refund confirmation data when available.

Core Order and Enrollment services do not parse Paymob- or Fawry-specific payloads.

## States

### Order

- `PENDING_PAYMENT`: created but not successfully paid.
- `PAID`: confirmed successful payment and access processing completed.
- `CANCELLED`: no longer payable.
- `REFUNDED`: a confirmed manual refund has been recorded.

### Payment Attempt

- `INITIATED`: local record exists and provider creation is in progress or complete.
- `PENDING`: provider accepted the request but payment is not final.
- `SUCCEEDED`: provider confirms successful payment.
- `FAILED`: provider reports a final failure.
- `EXPIRED`: the checkout or payment reference expired.
- `REFUNDED`: the successful payment was refunded.

State transitions must be monotonic unless a provider documents a corrective event. A succeeded payment cannot become failed because an older callback arrives.

## Paymob Checkout Flow

1. The Customer selects a published Course.
2. The server confirms:
   - Authenticated and active Customer.
   - Verified email.
   - Existing Learner profile.
   - Published and purchasable Course.
   - No active Enrollment for the same Course.
3. The server reads the authoritative Course price and access policy.
4. The server creates:
   - One `Order`.
   - One `OrderItem`.
   - One Paymob `PaymentAttempt`.
5. The server creates a Paymob hosted-checkout intention using:
   - Local Order public reference.
   - Payment Attempt reference.
   - Amount and currency.
   - Customer contact fields required by the provider.
   - Registered callback and return URLs.
6. The server stores provider intention/reference identifiers.
7. The Customer is redirected to Paymob.
8. The Customer returns to Yosr's payment-status page.
9. The page reads status from Yosr and may poll with bounded backoff.
10. Only a verified provider event or successful reconciliation can mark payment successful.

## Callback/Webhook Processing

### Acceptance

For every provider event:

1. Generate a correlation ID.
2. Enforce request size and content-type limits.
3. Parse required provider fields.
4. Verify HMAC, signature, or documented authenticity method before trusting state.
5. Derive a stable provider event key.
6. Insert the Payment Event under a uniqueness constraint.

If the event already exists, return the provider's expected success response without repeating business effects.

### Resolution

After authenticity verification:

1. Resolve the Payment Attempt through trusted local and provider identifiers.
2. Confirm amount and currency match local records.
3. Confirm the event applies to the correct merchant and environment.
4. Map the provider state to a Yosr Payment Attempt state.
5. Ignore stale transitions.
6. Process the transition in a database transaction.

### Successful Payment Transaction

The transaction must:

1. Mark the Payment Attempt `SUCCEEDED`.
2. Mark the Order `PAID`.
3. Store confirmation timestamps and provider references.
4. Create or restore the unique Learner-Course Enrollment.
5. Calculate Enrollment dates from the Order's access-policy snapshot.
6. Record an audit/domain event for the access grant.

If an active Enrollment already exists, the transaction must not create another Enrollment or silently extend access. It should record the conflict for Admin review.

### Non-Critical Side Effects

After the transaction commits:

- Send payment confirmation email.
- Send course-access email.
- Refresh Customer dashboard data.
- Record product analytics where configured.

Failure of these effects must not reverse successful payment or Enrollment.

## Pending and Asynchronous Payments

The model supports long-lived pending states required by providers such as Fawry.

Rules:

- A pending Payment Attempt does not grant access.
- The payment-status page shows provider-appropriate instructions and expiry.
- The Customer may leave and return later.
- A later verified callback can complete the same Payment Attempt.
- Reconciliation checks unresolved attempts after a provider-specific delay.
- Expired attempts remain historical records.
- A new attempt may be created for an unpaid Order when permitted.

## Fawry Readiness

Fawry should reuse the same Order and Enrollment flow through a separate provider adapter.

Expected Fawry-specific behavior:

- Payment/reference code creation.
- Customer instructions and expiry time.
- Long-lived pending status.
- Callback/notification verification.
- Status inquiry for reconciliation.
- Mapping paid, failed, expired, and refunded states.

Fawry implementation is approved for a later launch increment only after credentials, callback behavior, customer instructions, and operational reconciliation are tested.

## Reconciliation

Reconciliation protects against delayed or missed callbacks.

### Automatic

A scheduled process selects:

- Pending attempts older than the provider's normal callback window.
- Successful provider events whose local transaction failed.
- Recently paid Orders without active Enrollment.
- Attempts with conflicting provider and local states.

It queries the provider using stable references and records the observation as a Payment Event before applying normal state-transition logic.

### Manual

Admins can request reconciliation from an Order or Payment Attempt. The action:

- Calls the provider status inquiry.
- Stores the response as a reconciliation event.
- Uses the same transition rules as a webhook.
- Records the Admin actor and reason.

No direct "mark paid" button should exist in normal operations. Exceptional manual access is handled as a separately audited manual Enrollment grant.

## Retry Rules

- Provider checkout creation may be retried with a local idempotency key.
- Webhook business processing may be retried from the stored Payment Event.
- Duplicate callbacks are safe.
- Database deadlocks or transient failures use bounded retries.
- External email failures use independent retry behavior.
- The Customer may create a new Payment Attempt for a still-unpaid Order after the prior attempt fails or expires.

## Refund Workflow

Refunds are manual in the MVP.

The MVP supports full-Order refunds only. Partial refunds require a later product, accounting, and access-policy decision.

1. Support validates the request against the published refund policy.
2. An authorized Admin approves the refund.
3. The merchant completes or confirms the full-Order refund through Paymob or the applicable provider process.
4. The Admin records:
   - Refund amount.
   - Provider refund reference.
   - Reason.
   - Confirmation time.
5. Yosr marks the Payment Attempt `REFUNDED`.
6. Yosr marks the Order `REFUNDED`.
7. The Admin confirms Enrollment revocation.
8. Yosr revokes access and active playback sessions.
9. Yosr records an audit event.
10. The Customer receives written confirmation.

A refund is not recorded as complete before provider or financial confirmation. Access revocation is explicit so exceptional partial-refund policies can be introduced later without corrupting payment history.

## Security

- Provider secrets and HMAC keys remain server-only.
- Compare signatures using timing-safe methods.
- Never trust amount, currency, success, or Order identity from the browser.
- Store only payment information required for operations; never store card details.
- Separate sandbox and production credentials and callback URLs.
- Rate-limit checkout creation and status polling.
- Alert on signature failures, amount mismatches, repeated processing failures, and paid Orders without Enrollment.

## Operational Metrics

Track:

- Checkout creation success.
- Payment success by provider and method.
- Pending duration.
- Callback authenticity failures.
- Duplicate callback count.
- Payment-event processing failures.
- Paid Orders without active Enrollment.
- Reconciliation corrections.
- Refund count and amount.

## Acceptance Criteria

- A successful Paymob callback creates exactly one Enrollment.
- Duplicate callbacks produce no duplicate Order, Payment, or Enrollment effects.
- A success redirect without a successful provider event grants no access.
- Amount or currency mismatch grants no access and creates an alert.
- A delayed success event can complete a pending Order.
- An expired attempt can be followed by a new attempt.
- Reconciliation can recover a missed callback.
- A confirmed manual refund can revoke access and terminates playback.
- Fawry can be added through a provider adapter without changing core Order or Enrollment rules.
