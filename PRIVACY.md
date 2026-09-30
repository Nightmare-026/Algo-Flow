# Algo Flow — Privacy Policy

**Effective Date**: October 1, 2026  
**Version**: 2026-10-01  
**Maintainer**: Nightmare / Algo Flow Team  
**Contact**: [ganeshsharma7114@gmail.com](mailto:ganeshsharma7114@gmail.com)  
**Web Version**: [https://algo-flow.vercel.app/privacy](https://algo-flow.vercel.app/privacy)

---

## 1. Privacy Principles at a Glance

- **Zero Commercial Data Selling**: We never sell, rent, or monetize your personal information or practice telemetry with advertisers.
- **Zero Third-Party Ad Trackers**: We do not load advertising scripts, invasive cross-site cookies, or surveillance beacons.
- **Privacy-Focused Analytics**: We use Google Analytics 4 (GA4) solely for aggregate traffic analysis and feature adoption metrics. GA4 data is never used for advertising, remarketing, or behavioral profiling.
- **Anonymous Guest Exploration**: You can access all 138 visualizers, code execution panels, curriculum chapters, and calculation sandboxes without creating an account or providing personal details.
- **PostgreSQL Row-Level Security (RLS)**: User data stored in Supabase is cryptographically restricted to your authenticated user ID.
- **Self-Service GDPR Account Deletion**: Immediate, self-service account deletion directly from the Student Dashboard or via API, cascading an irreversible purge across all user database partitions.

---

## 2. Information We Collect

### A. Information You Provide (Optional Account Creation)
- **Account Identity**: Email address, hashed password (managed by Supabase Auth), chosen username, and profile avatar URL if signing in with Google or GitHub OAuth.
- **Study & Progress Data**: Visualizer completion history, topic mastery, study streaks, experience points (XP), bookmarks, and quiz scores.
- **Server-Authoritative Quiz & Learning Evaluations**: To prevent answer tampering and maintain academic integrity, quiz answers submitted by the client are evaluated server-side against canonical answer keys.
- **Mental Math Telemetry**: Calculation solve times, accuracy ratings, speed records, and daily challenge entries.

### B. Client-Side Preferences (Stored Locally on Device)
- Theme preference (Dark / Light).
- Sound effects toggle and volume.
- Preferred code language in the inspector (Python, C++, Java, JavaScript).
- Timeline playback speed preference.
- Reduced motion preference.

### C. Pseudonymous Analytics Data
- Google Analytics 4 (GA4) collects pseudonymous, aggregate usage metrics such as page views, session duration, referral sources, browser type, and geographic region (country-level) via randomized client identifiers. This data cannot be linked to your personal identity or Algo Flow account.

### D. Technical & Security Logs
- Standard HTTP request metadata (IP address, user-agent, timestamp) used solely for rate limiting, edge DDoS mitigation, anti-abuse token verification, and error diagnostics.

---

## 3. Third-Party Authentication (Sign in with Google & GitHub)

When you authenticate via **Google OAuth 2.0** or **GitHub OAuth**:
- We request access only to **standard non-sensitive identity scopes**: `email`, `profile`, and `openid` (Google) or `read:user`, `user:email` (GitHub).
- We receive your email, display name, and avatar picture to construct your user profile.
- We **never** access, request, or store your private Google data (such as Google Drive, Gmail, or contacts) or private GitHub repositories.
- Tokens are encrypted in transit via TLS 1.3.

---

## 4. Legal Bases for Processing (GDPR Article 6)

1. **Contractual Necessity**: To deliver your personalized study dashboard, save bookmarks, and compute XP streaks.
2. **Legitimate Interests**: To safeguard system availability, prevent cheating on global leaderboards, enforce rate limits, and patch security vulnerabilities.
3. **Consent**: For optional browser-stored layout, motion, and audio preferences.

---

## 5. Security & Row-Level Security (RLS)

- **Database-Level Isolation**: Supabase PostgreSQL uses Row-Level Security (RLS) on all user tables (`profiles`, `bookmarks`, `mental_math_sessions`, `user_progress`, `user_streaks`, `chapter_progress`). Direct inserts/updates on sensitive progress tables are restricted to authenticated users via server-managed `SECURITY DEFINER` RPCs.
- **Distributed Rate Limiting**: Upstash Serverless Redis enforces token-bucket rate limits on authentication, password reset, and account deletion endpoints to prevent brute-force attacks.
- **Transport Encryption**: All traffic is enforced over HTTPS with TLS 1.3 and HSTS preloading.
- **Strict Cookie Security**: Authentication cookies use `HttpOnly`, `SameSite=Lax`, and `Secure` flags.

---

## 6. Trusted Infrastructure Subprocessors

| Subprocessor | Role & Services | Compliance Certifications |
| :--- | :--- | :--- |
| **Supabase Inc.** | PostgreSQL Database, Auth, RLS Storage | SOC 2 Type II, ISO 27001 (HIPAA support available via Enterprise BAA) |
| **Vercel Inc.** | Edge CDN, Global Serverless Hosting & Cookie-less Web Analytics | SOC 2 Type II, ISO 27001, Cookie-less Telemetry |
| **Upstash Inc.** | Serverless Redis (Distributed Rate Limiting & Anti-Abuse Token Store) | SOC 2 Type II, ISO 27001, GDPR DPA compliant |
| **Google LLC** | Google OAuth 2.0 Identity Provider; Google Analytics 4 (aggregate traffic analytics) | SOC 2, ISO 27001, EU-U.S. Data Privacy Framework (DPF) / Standard Contractual Clauses (SCCs) |
| **GitHub Inc. / Microsoft** | GitHub OAuth 2.0 Identity Provider | SOC 2, ISO 27001, Microsoft Enterprise DPA |

---

## 7. Your Statutory Rights (GDPR & CCPA/CPRA)

Regardless of your geographic location, you hold the following rights:
- **Right of Access & Portability**: View and inspect your saved study data, bookmarks, and quiz records directly from your Student Dashboard.
- **Right to Rectification**: Correct or update your email, display name, or preferences.
- **Right to Erasure (Right to be Forgotten)**: You have the right to permanently delete your account and all associated personal data at any time. You can trigger an immediate self-service account deletion from the **Student Dashboard** via the "Delete Account" action (requiring a double-confirmation phrase) or programmatically via `DELETE /api/account/delete` with an active authenticated session. This immediately and irreversibly cascades deletion across all user data (`user_progress`, `user_streaks`, `bookmarks`, `preferences`, `profiles`, `quiz_attempts`, `activity_timeline`, `chapter_progress`, and your `auth.users` authentication identity).
- **Right to Restrict or Object**: Explore the platform anonymously in guest mode without creating an account.

---

## 8. Children's Privacy (COPPA)

Algo Flow is designed for computer science students and professionals. We do not knowingly collect personal information from children under 13 (or under 16 in the EEA) without verifiable parental consent. If we learn that an account belongs to an unaccompanied minor under 13, it will be promptly deleted.

---

## 9. Contact Us

If you have questions, data subject requests, or privacy concerns:  
**Email**: [ganeshsharma7114@gmail.com](mailto:ganeshsharma7114@gmail.com)
