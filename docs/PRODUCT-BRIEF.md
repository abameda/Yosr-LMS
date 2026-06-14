# Yosr Product Brief

## Product

**Name:** Yosr / يُسر

**One-liner:** Yosr is an Arabic-first platform where learners can discover, purchase, and complete trusted educational video courses through a simple, secure learning experience.

## Product Restatement

Yosr is a curated, admin-operated digital academy for Arabic-speaking learners. It supports school subjects and broader educational categories such as programming, UI/UX, technology, academic learning, and practical skills.

Yosr is not a public marketplace. The internal team selects mentors, manages content, controls publication, handles payments, and supports learners. Mentors are public content records in the MVP, not authenticated platform users.

## Problem

Arabic-speaking learners and parents often encounter one or more of these problems:

- Course discovery lacks trust and local context.
- Learning platforms feel designed for global marketplaces rather than focused education.
- Payment methods and support are poorly adapted to Egyptian customers.
- Purchased content is delivered through fragmented or insecure channels.
- Learners cannot easily resume lessons or understand their progress.

Yosr should combine trusted course presentation, local payment, protected video, and a calm learning experience in one product.

## Target Users

### Customer

The authenticated account holder. Depending on the course, this may be:

- A student.
- A parent or guardian buying for a learner.
- An adult learner buying for themselves.

Each Customer account has exactly one Learner profile in the MVP.

### Learner

The person consuming the course. The Learner profile stores learning identity and progress separately from account and payment details.

### Admin

An internal operator who manages courses, mentors, students, payments, enrollments, video references, resources, and support exceptions.

### Mentor

A public content record associated with courses. Mentors do not authenticate, upload content, manage students, receive platform payouts, or access dashboards in the MVP.

## Product Principles

1. **Arabic first:** Arabic and RTL behavior are the default design condition.
2. **Mobile first:** Core purchase and learning journeys must work well on common mobile devices and variable connections.
3. **Trust before novelty:** Clear outcomes, mentor credibility, payment confidence, and reliable support matter more than gamification.
4. **Curated operations:** Admins control quality and publication.
5. **Secure enough to operate:** Use realistic deterrence, authorization, and traceability without claiming perfect anti-piracy protection.
6. **Small product surface, strong foundations:** Avoid unnecessary v1 features while designing critical workflows for production traffic and reliability.
7. **Provider-aware boundaries:** External payment and video providers must be isolated behind clear application boundaries.

## Confirmed Product Decisions

- The platform supports school and non-school educational courses.
- Launch categories are limited, but categories are data-driven and expandable.
- The only authenticated roles are Customer and Admin.
- One Customer owns one Learner profile in the MVP.
- Authentication uses email/password, email verification, and password reset.
- Phone/OTP authentication is deferred.
- Course access is configurable per course.
- Default access is 12 calendar months after successful purchase.
- Paymob is the current first-payment candidate, but integration starts only after contracting and readiness are approved.
- Payment records are provider-aware so Fawry can be added without restructuring orders or enrollments.
- Full-Order refunds are handled manually in the MVP.
- A confirmed refund can revoke course access.
- Cloudflare R2 is the main non-video storage provider for course images, thumbnails, PDFs, attachments, and uploaded assets.
- Video hosting remains a future provider abstraction. VdoCipher, Bunny Stream, or another provider may be evaluated later; none is assumed to be contracted.
- WhatsApp and email are the MVP support channels.
- Live chat, chatbot, AI support, and helpdesk integrations are future capabilities only.

## MVP Goal

The MVP must prove that:

- Learners or guardians will buy curated Arabic educational courses.
- A verified payment reliably creates the correct enrollment once.
- Learners can securely watch purchased lessons and resume progress.
- Admins can operate courses and support customers without engineering help.
- The experience works well in Arabic on mobile devices.
- The architecture can absorb traffic growth without a product rewrite.

## Success Measures

Initial product measures:

- Course detail to checkout conversion.
- Checkout completion rate.
- Payment-to-enrollment reliability.
- Time from successful payment to course access.
- First lesson start rate.
- Seven-day return rate after purchase.
- Lesson and course completion rates.
- Playback failure rate.
- Refund and support-contact rates.

The MVP does not require an advanced analytics product. These measures may initially be derived from operational data and provider dashboards.

## Experience Direction

Yosr should feel:

- Warm, trustworthy, professional, and local.
- Friendly to younger learners without becoming toy-like.
- Reassuring to parents and credible to adult learners.
- Focused on learning rather than dashboard mechanics.
- Clear and patient in payment, processing, and error states.

## Support Direction

MVP support uses:

- WhatsApp for rapid customer communication.
- Email for formal support, payment records, and longer conversations.

Future support may introduce:

- Live chat.
- A rules-based chatbot.
- An AI support assistant with approved knowledge and human escalation.
- Ticketing/helpdesk integration.

No live support software is part of the MVP application.
