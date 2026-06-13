# Yosr Video Security Specification

## Purpose

Provide practical protection for paid video lessons while preserving reliable playback for learners in Egypt.

## Provider Decision

VdoCipher is the primary MVP provider because it combines:

- DRM-backed playback.
- Short-lived playback authorization.
- Viewer-specific dynamic watermarking.
- Domain and playback policy controls.
- Player events for progress tracking.
- Viewer and playback analytics useful for support.

An Egypt playback pilot is a production launch gate. Bunny Stream remains the fallback when VdoCipher cost or playback quality is unacceptable for the target audience.

## Threat Model

Yosr should deter and detect:

- Sharing direct video links.
- Reusing playback credentials.
- Casual account sharing.
- Simultaneous playback from multiple devices.
- Easy browser-based downloading.
- Repeated authorization requests suggesting automation.
- Leaked course footage that can be traced to an account session.

Yosr cannot fully prevent:

- Recording the screen with another device.
- Credential sharing between trusted people.
- Determined editing or cropping of watermarks.
- Reproduction of visible or audible content.

The security promise is controlled access and practical deterrence, not perfect copy prevention.

## Playback Authorization

1. The Learner opens a video Lesson.
2. The browser requests playback authorization from Yosr.
3. The server verifies:
   - Valid authenticated session.
   - Active User account.
   - Ownership of the Learner profile.
   - Published Course and Lesson.
   - Active, unexpired Enrollment.
   - Device is not revoked or blocked.
   - Concurrent playback policy.
4. The server requests a VdoCipher OTP/playback authorization.
5. The server returns only the short-lived data required by the player.
6. The provider delivers the video through its CDN.

Provider API secrets never reach the browser.

## Token Policy

- Playback authorization should expire after approximately five to ten minutes.
- A token authorizes a specific video and intended viewer context.
- Expired tokens require a new server-side authorization.
- Tokens are not logged.
- Authorization endpoints are rate-limited by account, device, and network.
- The response must not be publicly cached.

## Domain Policy

Allow playback only from:

- Approved production domains.
- Explicit staging domains during testing.
- Local development origins only in non-production provider configuration.

Preview-deployment wildcards should not be accepted in production.

## Watermark Policy

Use a moving viewer-specific watermark containing:

- A masked account reference.
- A short session or playback reference.
- Optionally a coarse timestamp.

Do not display:

- Full email address.
- Phone number.
- Full legal name.
- Child-specific personal details.

The watermark should move periodically, remain visible against varied content, and avoid covering essential lesson material.

## Device and Session Policy

MVP policy:

- Up to three trusted devices per Customer account.
- One active video playback session at a time.
- Device identity uses a random persistent identifier stored by the application and hashed on the server.
- Do not use invasive hardware fingerprinting.
- Admins can reset trusted devices after identity verification.

Enforcement should begin with clear customer messaging. Repeated conflicts, rapid geographic changes, or excessive authorization requests may block playback and require support review.

## Playback Session Lifecycle

1. Authorization creates a Playback Session.
2. Player heartbeats update last activity.
3. A new session checks for an existing active session.
4. Stale sessions expire after a short inactivity window.
5. Normal player end, navigation, logout, revocation, or timeout closes the session.
6. Refund or Enrollment revocation invalidates access and closes active sessions.

## Progress Tracking

Use player events to record:

- Playback started.
- Current position.
- Covered intervals or accumulated covered time.
- Pause.
- Seek.
- End.
- Playback errors.

Persistence rules:

- Save progress periodically, not on every event.
- Save on pause, navigation, and page exit when possible.
- Accept out-of-order updates only when they do not reduce confirmed covered progress.
- Resume from the latest valid position, with a small rewind for context.
- Mark a video Lesson complete after at least 90 percent of duration has been covered.
- Seeking directly to the end does not count as full coverage.

Progress data is educational state, not a security control. Playback access always rechecks Enrollment.

## Suspicious Activity

Log and evaluate:

- Excessive playback-token requests.
- Concurrent sessions.
- Frequent device registration.
- Rapid network/country changes.
- Repeated authorization denials.
- Unusual playback across many videos in a short period.
- Repeated provider DRM or token failures.

Initial response options:

- End the conflicting session.
- Require login again.
- Temporarily deny playback.
- Ask the Customer to contact support.
- Admin device reset or account review.

Avoid automatic permanent account bans in the MVP.

## Video Operations

Admins:

- Upload videos through the approved provider workflow.
- Attach the provider video ID to a Lesson.
- Confirm processing and playback readiness.
- Verify watermark behavior.
- Test the Lesson through a non-Admin Customer Enrollment.
- Never publish provider dashboard credentials or raw source files publicly.

## Egypt Playback Pilot

Before production launch, test:

- Common Android phones, iPhones, and desktop browsers.
- Chrome, Safari, and a supported Android browser.
- Home broadband and mobile networks from major Egyptian carriers.
- Low, medium, and high bandwidth conditions.
- Startup time, buffering, quality adaptation, seek behavior, and token refresh.
- Watermark legibility in Arabic and mixed-direction content.
- Captions if used.
- Support visibility when playback fails.

Pilot success requires:

- No systematic provider or DRM incompatibility on supported devices.
- Acceptable startup and buffering for the target course audience.
- Progress events remain reliable under interrupted connectivity.
- Monthly cost remains within the approved operating forecast.

If the pilot fails materially, evaluate Bunny Stream using the same lesson, networks, and device matrix before changing provider.

## Provider Portability

The application stores:

- Provider name.
- External video identifier.
- Duration and readiness.
- Internal Lesson relationship.
- Security profile version.

Learning pages and Enrollment logic depend on an internal playback-authorization interface, not VdoCipher payload shapes. This permits a later provider migration without pretending providers are functionally identical.

## Security and Privacy

- Minimize IP and device data.
- Use coarse location only for risk review when legally justified.
- Define retention for playback security logs.
- Keep provider credentials server-only.
- Filter tokens and personal data from error reports.
- Include video monitoring and watermarking practices in customer-facing terms and privacy information.

## Acceptance Criteria

- An unauthenticated or unenrolled user cannot obtain playback authorization.
- Expired or revoked Enrollment immediately prevents new authorization.
- Refund-linked revocation ends active access.
- Tokens are short-lived and video-specific.
- Production playback is domain-restricted.
- Watermarks identify a session without exposing sensitive learner data.
- Concurrent playback is limited according to policy.
- Progress resumes and cannot be completed by a simple seek to the end.
- The Egypt pilot is completed and documented before launch.
