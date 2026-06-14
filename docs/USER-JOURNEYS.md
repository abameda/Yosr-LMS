# Yosr User Journeys

## Journey Principles

- Arabic is the default language and RTL is the default direction.
- Every journey must work on mobile.
- Payment redirects are not proof of payment.
- Access decisions are made on the server.
- Pending and error states must explain what happened and what the customer should do next.

## 1. Browse Courses

**Actor:** Visitor

1. The Visitor opens the homepage.
2. Yosr presents a focused selection of published courses and categories.
3. The Visitor opens the course listing.
4. The Visitor filters by category.
5. Course cards communicate title, mentor, audience, price, and key outcome.
6. The Visitor opens a course detail page.

**Outcome:** The Visitor understands whether a course is relevant before registering.

## 2. Evaluate a Course

**Actor:** Visitor

The course detail page presents:

- Course purpose and learning outcomes.
- Intended audience.
- Category.
- Optional school level or general skill level.
- Mentor identity and credibility.
- Curriculum structure.
- Duration and lesson count.
- Access duration or fixed access end date.
- Price.
- Preview content when available.
- Support, payment, and refund expectations.

**Outcome:** The Visitor has enough information to make a purchase decision without contacting support.

## 3. Create an Account

**Actor:** Visitor

1. The Visitor provides email and password.
2. Yosr creates a Customer account and one Learner profile.
3. Yosr sends an email verification message.
4. The Customer verifies the email.
5. The Customer may edit the Learner display name and optional learning information.

**Failure handling:**

- Existing email: direct the Customer to login or password reset.
- Expired verification link: offer a new verification email.
- Unverified login: explain that verification is required.

## 4. Buy a Course

**Actor:** Customer

1. The Customer selects Buy on a published course.
2. Yosr requires authentication and verified email.
3. Yosr confirms the course, Learner, price, and access terms.
4. The server creates an Order and a Payment Attempt for the selected provider.
5. The Customer is redirected to the selected provider's hosted checkout.
6. The provider returns the Customer to a Yosr payment-status page.
7. The page displays pending until Yosr has processed a verified provider event.

**Outcomes:**

- Success: show access confirmation and a Start Learning action.
- Pending: explain that confirmation may take time and refresh status safely.
- Failure or expiry: offer another payment attempt without duplicating the Order purchase intent.

## 5. Receive Course Access

**Actor:** System

1. The selected payment provider sends a callback/webhook.
2. Yosr verifies authenticity and provider references.
3. Yosr stores the event idempotently.
4. Yosr updates the Payment Attempt.
5. When payment is successful, Yosr marks the Order paid.
6. Yosr creates or restores exactly one Enrollment for the Learner and Course.
7. The Enrollment start time is the confirmed payment time.
8. The Enrollment end time is calculated from the Course access policy.
9. Yosr sends a transactional confirmation.

**Invariant:** Browser navigation, query parameters, and client-side state cannot create access.

## 6. Start or Continue Learning

**Actor:** Learner

1. The Learner opens My Courses.
2. Yosr shows active courses and their progress.
3. The Learner selects Start or Continue Learning.
4. The server verifies that the Enrollment is active and not expired.
5. The course player opens the last active or first incomplete lesson.
6. The lesson list shows completed, current, and remaining lessons.

**Access exceptions:**

- Expired: show access end date and support contacts.
- Revoked: show a neutral support message.
- Payment pending: return to payment status rather than the player.

## 7. Watch a Video Lesson

**Actor:** Learner

1. The learning page requests playback authorization.
2. The server verifies session, role, Enrollment, Course, and Lesson.
3. The server requests a short-lived authorization from the selected video provider.
4. The player displays a viewer-specific moving watermark.
5. Playback events update resume position and covered viewing time.
6. The system marks the lesson complete when completion rules are satisfied.
7. The Learner proceeds to the next lesson.

**Failure handling:**

- Token expired: request a new token after reauthorization.
- Concurrent playback limit: stop the newer or older session according to policy and explain the support route.
- Provider failure: show retry and support options with a trace reference.

## 8. Access a Resource

**Actor:** Learner

1. The Learner selects a course resource.
2. The server verifies active Enrollment and lesson visibility.
3. Yosr generates a short-lived signed Cloudflare R2 resource URL.
4. The Learner downloads or opens the resource.

Public permanent storage links are not used for paid resources.

## 9. Admin Creates and Publishes a Course

**Actor:** Admin

1. The Admin creates or selects a Category.
2. The Admin creates a Mentor content record.
3. The Admin creates the Course as Draft.
4. The Admin enters audience, outcome, pricing, and access-policy information.
5. The Admin creates Sections and ordered Lessons.
6. The Admin attaches selected-provider video IDs and Cloudflare R2-backed private resources.
7. The Admin verifies that required videos are ready.
8. The Admin previews the course.
9. The Admin publishes the Course.

Publication is blocked when required commercial or learning information is missing.

## 10. Admin Resolves a Payment

**Actor:** Admin

1. Support receives an Order reference.
2. The Admin opens the Order timeline.
3. The Admin reviews Payment Attempts and verified events.
4. The Admin requests or runs provider reconciliation when status is unclear.
5. The Admin records an operational note.
6. Enrollment changes occur only from confirmed provider status or an explicit manual grant.

The Admin must not mark a payment successful based only on a customer screenshot.

## 11. Manual Refund and Access Revocation

**Actor:** Admin

1. The refund is approved under the published policy.
2. The Admin completes or confirms the refund in the payment provider or merchant process.
3. The Admin records provider reference, amount, reason, and confirmation time.
4. Yosr marks the Payment and Order refunded.
5. The Admin confirms access revocation.
6. Yosr revokes the Enrollment and terminates active playback sessions.
7. Yosr records the action in the audit log.
8. The Customer receives a confirmation through email or support.

Refund status and access status are separate fields but are changed together by the documented workflow.

## 12. Support Through WhatsApp or Email

**Actor:** Customer or Admin

1. The Customer opens a visible WhatsApp or email support action.
2. The message template includes a safe public Order or Course reference when relevant.
3. Support identifies the Customer in the Admin dashboard.
4. The Admin adds an internal note to the relevant Order, Enrollment, or Customer record.
5. The Admin resolves the issue or escalates it to engineering/provider support.

Future chat or AI support must use the same account, order, and enrollment references instead of inventing a separate support identity model.
