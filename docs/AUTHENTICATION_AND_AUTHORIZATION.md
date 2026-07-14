# Authentication and Authorization Baseline

> Status: source and deployed-route inspection only. No real account lifecycle or remote Supabase configuration was exercised.

## Implemented flows

- Email/password sign-up and login through Supabase Auth.
- Google and GitHub OAuth initiation.
- OAuth/password-reset callback at `/auth/callback`.
- Forgot-password and password update.
- Sign-out.
- Session refresh in `src/lib/supabase/middleware.ts`.
- `/dashboard` protection in `src/proxy.ts` plus a page-level `getUser()` check.

## Authorization boundaries

- Proxy redirects unauthenticated dashboard requests to `/login?next=/dashboard`.
- The dashboard re-validates the user server-side; proxy is not the only authorization layer.
- Database ownership is intended to be enforced by RLS, not client route state.

## Baseline risks

1. Auth inputs are cast from `FormData` without schema validation or server-side length/domain rules.
2. Login and sign-up messages can reveal account verification/registration state.
3. No application-level rate limiting is present for login, sign-up, OAuth, or reset-email requests.
4. OAuth origin construction trusts the request `Origin`; callback handling uses `x-forwarded-host` without an application allowlist.
5. Account deletion, session revocation, and personal-data export are absent.
6. OAuth allowlists, provider secrets, email templates, JWT lifetime, and disabled/deleted-account behavior are remote and unverified.

## Required Phase 4 verification

- Test sign-up, verification, immediate login, expiry, refresh, reset, both OAuth providers, cancellation, duplicate email, and logout.
- Test redirect allowlists and malicious `Origin`, `Host`, `x-forwarded-host`, and `next` inputs.
- Test owner and cross-user access at the database boundary.
- Use generic public errors and structured secret-free server logs.

