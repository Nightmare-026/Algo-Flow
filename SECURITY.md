# Security Policy

Algo Flow takes the security and privacy of its users, algorithmic workstations, and database infrastructure with utmost seriousness. This document outlines our vulnerability disclosure process, supported versions, and architectural security controls.

---

## Supported Versions

Only the latest active release branch receives security patches and vulnerability remediation:

| Version / Branch | Supported | Security Maintenance Status |
| :--- | :--- | :--- |
| `main` (Latest Production) | :white_check_mark: Yes | Actively monitored and patched |
| Prior Releases / Forks | :x: No | Please upgrade to the latest `main` commit |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities via public GitHub issues, discussions, or pull requests.**

If you discover a security vulnerability, privilege escalation, authentication bypass, data leakage risk, or potential attack vector in Algo Flow:

1. **Email Privately**: Send a detailed advisory directly to the lead maintainer at **[ganeshsharma7114@gmail.com](mailto:ganeshsharma7114@gmail.com)**.
2. **Subject Line**: `[SECURITY DISCLOSURE] Algo Flow - <Brief Vulnerability Title>`
3. **Information to Include**:
   - Clear description of the vulnerability and attack vector.
   - Exact steps to reproduce (proof of concept code, HTTP request samples, or screenshots).
   - The affected route, component, or database table.
   - Any suggested remediations or mitigations if known.

### Response Timeline & SLA

- **Initial Acknowledgment**: Within **48 hours** of receiving your report.
- **Triage & Assessment**: Within **5 business days**, confirming reproduction and assigning a severity rating (CVSS v3).
- **Remediation & Patch**: Target patch deployment within **14 days** for critical/high vulnerabilities.
- **Public Disclosure**: Coordinated disclosure after the patch has been verified and deployed to production.

---

## Architectural Security Controls

Algo Flow enforces defense-in-depth principles across its full stack:

### 1. Database & Row-Level Security (RLS)
- Persistent storage is powered by **Supabase PostgreSQL**.
- Every table storing user data (`profiles`, `bookmarks`, `preferences`, `mental_math_sessions`, `user_progress`, `user_streaks`, `chapter_progress`, `quiz_attempts`, `activity_timeline`) has strict **PostgreSQL Row Level Security (RLS)** policies enabled using `(SELECT auth.uid()) = user_id`.
- Unauthenticated users cannot read or write private user records.
- Critical progress tables (`user_progress` and `user_streaks`) are hardened with `FOR SELECT` and `FOR DELETE` policies; direct `INSERT` and `UPDATE` tampering is restricted, and state transitions are channeled strictly through server-side `SECURITY DEFINER` RPCs (`touch_user_streak` and `mark_algorithm_completed`).

### 2. GDPR Self-Service Account & Data Deletion
- Authenticated users have immediate self-service account deletion access via the Student Dashboard (`/dashboard`) requiring a double-confirmation phrase, or programmatically via `DELETE /api/account/delete`.
- The deletion handler executes a cascade purge across all 9 user partitions and revokes the `auth.users` identity immediately, leaving zero orphaned PII or progress records.

### 3. Server-Authoritative Quiz & Scoring Verification
- Quiz evaluation is completely server-authoritative (`submitEvaluatedQuizAttemptAction`).
- Client-submitted selected answers are evaluated server-side against canonical question banks, preventing client score manipulation or answer-key extraction from HTTP payloads.

### 4. Edge Rate Limiting & Anti-Abuse
- Critical endpoints (authentication, account deletion, password resets, and high-frequency calculation submissions) are protected by **Upstash Distributed Redis** token-bucket rate limiting.
- Anti-cheat validation ensures calculation times on competitive leaderboards cannot be spoofed by headless scripts or automated bots.

### 5. Transport & Session Security
- All edge and origin communications require **HTTPS (TLS 1.3)**.
- Authentication tokens are handled via **Supabase Auth** with strict `HttpOnly`, `SameSite=Lax`, and `Secure` cookie attributes, mitigating cross-site scripting (XSS) token theft and CSRF attacks.

### 6. HTTP Security Headers
Configured harmoniously across `src/middleware.ts` and `next.config.ts`:
- `Content-Security-Policy` (Defense-in-depth CSP enforcing strict frame, origin, and object controls with edge-compatible static script execution; `'unsafe-eval'` disallowed in production)
- `Strict-Transport-Security` (HSTS: max-age 2 years, includeSubDomains, preload)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`
- `X-Permitted-Cross-Domain-Policies: none`

### 7. CI/CD Hardening & Supply Chain Security
- GitHub Actions workflows enforce least privilege with top-level `permissions: contents: read`.
- All third-party actions are pinned to immutable full commit SHAs.
- Automated secret scanning is enforced on every commit and pull request via TruffleHog.

### 8. Secret & Key Hygiene
- Production secrets, service role keys, and API tokens are never committed to version control.
- Secrets are injected exclusively via encrypted runtime environment variables (`.env.local` ignored in `.gitignore`).

---

## In-Scope vs. Out-of-Scope

### In-Scope:
- Authentication or authorization bypass (Supabase Auth / RLS).
- Cross-site scripting (XSS) impacting authenticated users.
- Server-side request forgery (SSRF) or remote code execution.
- SQL injection or unauthorized database read/write.
- Rate limit evasion or score forgery on quiz and anti-cheat endpoints.
- Incomplete account deletion or PII retention violations.

### Out-of-Scope:
- Denial of Service (DoS/DDoS) attacks against public cloud infrastructure.
- Social engineering, phishing, or physical attacks.
- Attacks requiring physical access to a compromised client device.
- Issues related to outdated third-party browser extensions.
