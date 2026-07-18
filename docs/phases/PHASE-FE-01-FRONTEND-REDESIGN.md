# Frontend redesign phase contract

- ID: `PHASE-FE-01`
- Tier: T2
- Status: implementation verified; release conditional on correct live Supabase access and explicit deployment approval
- Last updated: 2026-07-18

## Objective

Deliver a repository-wide Soft Green Neumorphism redesign and a complete authored visualizer publication contract without changing public route slugs or fabricating placeholder schemas, semantics, mappings, legends, or traces.

## Acceptance status

- `FE-R01` Tokenized white/green neumorphic system across public routes: passed.
- `FE-R02` Landing hierarchy and interactive learning presentation: passed.
- `FE-R03` Library/category content uses the published catalog: passed.
- `FE-R04` All 105 public visualizers initialize with real traces and synchronized panels: passed.
- `FE-R05` Auth uses accessible in-field labels, server validation, and safe redirects: passed locally.
- `FE-R06` Guest dashboard protection: passed; authenticated persistence remains an external-account boundary.
- `FE-R07` Keyboard, focus, labels, reduced motion, responsive overflow, and mobile layout: passed automated and visual checks.
- `FE-R08` No registry placeholder or missing authored artifact: passed.
- `FE-R09` Every visualizer has authored schema, fixture, semantic cases, mappings, and legend: passed 105/105.
- `FE-R10` TypeScript, lint, formatting, unit, build, and browser gates: passed.

## Decisions

- `FE-D01`: The supplied Soft Green Neumorphism direction and inspected Stitch auth composition are the visual authorities.
- `FE-D02`: CSS variables are canonical tokens; compatibility aliases avoid unrelated churn.
- `FE-D03`: CSS and Framer Motion provide purposeful interaction feedback with reduced-motion handling. Remotion/HeyGen media was not added because rendered video would not improve step-by-step manipulation and no billable generation was authorized.
- `FE-D04`: Publication artifacts are authored by algorithm family and operation semantics; generic fallbacks are prohibited.
- `FE-D05`: Cross-language executable verification remains a real compiler/runtime gate.
- `FE-D06`: The profile schema is an additive canonical superset; the auth trigger preserves names, gender, email, username, and avatar data across fresh and audited environments.

## Exit evidence

Passed on 2026-07-18:

- Registry: 105 catalog entries, 105 implementations, 0 errors, 0 warnings.
- Readiness: 105 published, 105 composed, 0 authored-artifact gaps.
- Step coordination: 105 visualizers; 0 pseudocode, code mapping, legend/highlight, or family errors.
- Executable examples: 72 passed across JavaScript, Python, C++, and Java; 0 failed/skipped.
- Static checks: TypeScript, ESLint, and Prettier passed.
- Unit: 14 suites, 174 tests passed.
- Production build: Next.js 16.2.10 compiled, typed, and generated all routes.
- Browser: 105/105 published visualizer routes passed with real traces and no uncaught/console errors.
- Focused production browser: 5/5 route, synchronization, mobile, auth-label, and accessibility cases passed.
- Backend contract: 9/9 profile/trigger/RLS/signup regression tests passed.

## Remaining external boundary

The workspace `.env.local` targets Supabase project `mylzlhevgffgkwpeerzh`. The connected Supabase tool exposes a different project, `oopzijymptsicbfqsppj`, which is inactive and times out. The local migration was not applied to any live database. Production deployment and migration require explicit approval, access to the correct project, a preview/dry run, backup evidence, and post-deploy smoke checks.
