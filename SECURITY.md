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
- Every table storing user data (`profiles`, `bookmarks`, `mental_math_sessions`, `user_progress`) has strict **PostgreSQL Row Level Security (RLS)** policies enabled.
- Data queries are cryptographically restricted to the authenticated user ID (`auth.uid() = user_id`). Unauthenticated users cannot read or write private user records.

### 2. Transport & Session Security
- All edge and origin communications require **HTTPS (TLS 1.3)**.
- Authentication tokens are handled via **Supabase Auth** with strict `HttpOnly`, `SameSite=Lax`, and `Secure` cookie attributes, mitigating cross-site scripting (XSS) token theft and CSRF attacks.

### 3. HTTP Security Headers
Configured via `src/proxy.ts` (dynamic nonce-based CSP) and `next.config.ts` (static transport headers):
- `Content-Security-Policy` (CSP Level 3 with per-request cryptographically secure nonce and `strict-dynamic`; `'unsafe-eval'` disallowed in production)
- `Strict-Transport-Security` (HSTS: max-age 2 years, includeSubDomains, preload)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`
- `X-Permitted-Cross-Domain-Policies: none`

### 4. Secret & Key Hygiene
- Production secrets, service role keys, and API tokens are never committed to version control.
- Secrets are injected exclusively via encrypted runtime environment variables (`.env.local` ignored in `.gitignore`).
- If any credential is accidentally exposed, it must be revoked and rotated immediately before Git history cleaning.

---

## In-Scope vs. Out-of-Scope

### In-Scope:
- Authentication or authorization bypass (Supabase Auth / RLS).
- Cross-site scripting (XSS) impacting authenticated users.
- Server-side request forgery (SSRF) or remote code execution.
- SQL injection or unauthorized database read/write.
- Rate limit evasion on anti-cheat daily challenge endpoints.

### Out-of-Scope:
- Denial of Service (DoS/DDoS) attacks against public cloud infrastructure.
- Social engineering, phishing, or physical attacks.
- Attacks requiring physical access to a compromised client device.
- Issues related to outdated third-party browser extensions.
