# Algo Flow — Production Readiness Master Plan

> Status: **Phase 0 in progress (baseline complete, blocking question pending).**
> Owner: Solo practitioner session.
> Last updated: 2026-07-14.

---

## 1. Scope statement

Transform the existing Algo Flow codebase and deployed application into a complete, secure, scalable, and production-ready Data Structures & Algorithms visualization platform that satisfies every "Definition of Done" item in the master specification.

## 2. Hard constraints (non-negotiable)

- **No destructive refactor** without an explicit phase gate and prior evidence.
- **No secrets in the repository.** Service-role keys, JWT secrets, and database passwords live in Vercel / Supabase / local `.env.local` only.
- **No fabricated backend responses.** Empty `Step 0 / 0` and "Structural Properties" placeholders are *not* acceptable as final output.
- **No claim of "verified" without evidence.** Track-build, parse, compile, execute, lint, typecheck.
- **No reduction of accessibility for visual polish.**
- **No replacement of `any`-typed registry contracts with weaker typing.**
- **No partial registry entries published.** If a visualizer is incomplete, it does not appear in the public catalog.

## 3. Staged phases

Each phase ends with a documented gate, evidence-based reports, and an explicit "Are you ready for Phase X+1?" question. Phases cannot be collapsed.

| Phase | Goal | Output |
|---|---|---|
| 0 | Repository safety + baseline | docs, branch, baseline metrics, blocking question resolved |
| 1 | Codebase audit (architecture, product, runtime, responsive) | CURRENT_STATE_AUDIT.md with classified findings |
| 2 | Architecture + folder restructuring | Restructured src/, no behavior regression |
| 3 | Visualizer engine typed contract + registry enforcement | Build-time registry validator, new contract types |
| 4 | Backend / database / RLS audit + fixes | DATABASE_SCHEMA.md, SECURITY_THREAT_MODEL.md, fixed migrations |
| 5 | Design system + premium UI + theme | DESIGN_SYSTEM.md, semantic tokens, dark/light parity |
| 6 | UX improvements + dashboard | Updated layouts, onboarding, empty/error states |
| 7 | Performance engineering | PERFORMANCE_AUDIT.md, budget enforcement |
| 8 | Testing strategy | TESTING_STRATEGY.md, layered suite, coverage gating |
| 9 | Observability + error handling | Correlation IDs, safe server logs, Sentry-ready |
| 10 | Deployment + release engineering | DEPLOYMENT_AND_ROLLBACK.md, env-first config |
| 11 | CI quality gates | Gate definitions, blocking rules |

## 4. Working agreements

- One blocking question per round.
- Each phase ends with a "Phase X Completion Report" matching the protocol template.
- `PROGRESS_TRACKER.md` is updated after every meaningful change.
- `DECISIONS.md` records every choice that closes alternatives (with rationale).
- `SECRET_INVENTORY.md` lists every variable name (never a value).

## 5. Stop conditions for the session

Work pauses if:

- A blocking question is unanswered for more than the current round.
- A phase's tests fail and the failure is not localizable in the same round.
- A destructive change is needed without explicit user consent.
- An external resource (Vercel, Supabase, browser) is unavailable.

## 6. Out of scope for v1

- New algorithms beyond the current 107 catalog slugs (gating question required before adding).
- iOS/Android native wrappers.
- Enterprise SSO providers beyond Google + GitHub.
- Real-time multi-user collaboration (already outside feature surface).
- Mobile app distribution.

---

See `PROGRESS_TRACKER.md` for live status and `CURRENT_STATE_AUDIT.md` for the Phase-1 baseline inventory.
