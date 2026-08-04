# Algo Flow Software Requirements Specification

- **Status:** Active production-readiness source of truth
- **Version:** 1.0
- **Owner / acceptance owner:** Project owner
- **Last reconciled:** 2026-07-15
- **Repository state:** `chore/production-readiness` at base commit `c87547f` plus the documented working-tree changes
- **Authoritative source:** attached master specification, SHA-256 `3CBB6B4FC69044E1EF9859CC066F1A42D071B166548907F59074D70040D8B8F1`

## Product outcome

Algo Flow is an educational web application that must present truthful, deterministic, accessible algorithm visualizations and safely persist each authenticated learner's private progress. Production readiness requires evidence across visual correctness, security, data integrity, accessibility, performance, tests, observability, deployment, and recovery.

### Goals

1. Publish only complete, correct, testable visualizers.
2. Keep playback, code, pseudocode, explanations, and rendered state synchronized.
3. Enforce authentication and ownership at server and database boundaries.
4. Meet WCAG 2.2 AA and defined web-performance targets.
5. Ship through repeatable CI, preview, migration, monitoring, and recovery gates.

### Non-goals

- Quantity-driven catalog expansion.
- Placeholder or misleading interactive routes.
- An LLM or autonomous-agent feature in the shipped application.
- Direct production changes without an action-specific T3 approval.

## Users and permissions

- **Anonymous visitor:** read the public educational catalog and use public visualizers; no access to private learner data.
- **Authenticated learner:** manage only their own profile, preferences, bookmarks, progress, quiz attempts, saved sessions, streak, and activity.
- **Project administrator/service:** server-only least-privilege operational access; no browser exposure of administrative credentials.

## Requirements

| ID | Priority | Requirement and measurable acceptance | Status |
|---|---|---|---|
| FR-REG-001 | P0 | Every public catalog slug resolves to exactly one complete registry definition; build fails on missing required publication artifacts. | In progress |
| FR-VIS-001 | P0 | Step generation and playback are deterministic; restart, previous/next, and replay preserve valid state and identifier references. | In progress |
| FR-VIS-002 | P1 | Each visualizer exposes every applicable global and structure-specific control, hides inapplicable controls, validates input, and reports clear errors. | In progress |
| FR-CODE-001 | P0 | Published entries include equivalent JavaScript, Python, C++, and Java implementations, pseudocode, complexity, tests, legend, and code-line mappings; verification status reflects actual execution/compilation. | In progress |
| FR-CAT-001 | P1 | Incomplete entries are removed from catalog, sitemap, and public inventories until they satisfy FR-REG-001 and FR-CODE-001. | In progress |
| FR-AUTH-001 | P0 | Sign-up, verification, login, logout, reset, OAuth callback, session expiry/revocation, and protected-route behavior fail safely and are tested. | Pending |
| FR-DATA-001 | P0 | Schema constraints, grants, indexes, triggers, RPCs, and RLS enforce same-user ownership and deny anonymous/cross-user access. | Prepared; live verification pending |
| FR-ACCOUNT-001 | P1 | Account export and deletion are authenticated, explicit, auditable, idempotent where needed, and recover safely. | Pending |
| FR-UX-001 | P1 | Dashboard, legal, empty/loading/error/permission states, navigation, and responsive user journeys are complete and consistent. | Pending |
| FR-THEME-001 | P1 | Light/dark/system themes and reduced-motion behavior are complete, persistent, and accessible. | Pending |
| NFR-SEC-001 | P0 | No unresolved critical/high security finding; secrets remain server-only; inputs, redirects, headers, dependencies, rate limits, CSP, and abuse paths are verified. | In progress |
| NFR-A11Y-001 | P0 | Applicable flows meet WCAG 2.2 AA with automated and manual keyboard, focus, screen-reader, contrast, zoom, and reduced-motion evidence. | Pending |
| NFR-PERF-001 | P1 | Production-like key routes meet LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 and have reviewed bundle/runtime costs. | Baseline only |
| NFR-TEST-001 | P0 | Static, unit, invariant, integration, route, E2E, database/RLS, accessibility, visual, and regression gates cover the changed risk surface; global coverage reaches the approved release threshold. | In progress |
| NFR-OBS-001 | P1 | Structured redacted logs, error reporting, health signals, metrics, alerts, ownership, and incident procedures cover critical paths. | Pending |
| NFR-CI-001 | P0 | CI enforces type, lint, format, registry, tests, build, dependency/security, and relevant browser/database gates. | Pending |
| NFR-REL-001 | P0 | Preview, backup, migration recovery, deployment, smoke, monitoring, and rollback/forward-recovery evidence exist before production release. | Pending |

## Data and security rules

- Validate all browser, route, query, cookie, database, and tool-output boundaries.
- Use schema constraints and parameterized Supabase APIs; enforce ownership in RLS rather than UI alone.
- Private learner data is retained only for the product purpose and is exportable/deletable through authenticated flows.
- Avoid persisting oversized generated visualizer state; define and enforce payload limits during Phase 4.
- Administrative credentials are server-only, least privilege, rotated on exposure, and never recorded in repository memory.

## Failure and recovery journeys

- Invalid visualizer slug: render the custom not-found path; never a fake interactive canvas.
- Runtime visualizer failure: render a recoverable error boundary with retry/home paths and no internal details.
- Invalid algorithm input: reject before generation, preserve last valid state, and explain the correction.
- Authentication or authorization failure: deny by default without leaking resource existence.
- Migration interruption: validate target state and use the reviewed rollback only when data-safe; otherwise execute forward recovery.
- Deployment health failure: stop promotion or restore the last known-good application while preserving database compatibility.

## Traceability

| Requirement | Phase / tasks | Primary verification | Risk |
|---|---|---|---|
| FR-REG-001, FR-CAT-001 | Phase 3 / P3-T03, P3-T06 | registry readiness + catalog parity + route audit | RISK-001 |
| FR-VIS-001 | Phase 3 / P3-T01, P3-T02 | invariant/unit/replay tests + all-route audit | RISK-002 |
| FR-VIS-002 | Phase 3 / P3-T05 | control coverage matrix + browser tests | RISK-001 |
| FR-CODE-001 | Phase 3 / P3-T04, P3-T06 | parsers/compilers/runners + mapping tests | RISK-003 |
| FR-AUTH-001, FR-DATA-001, FR-ACCOUNT-001 | Phase 4 | migration/RLS/RPC/auth/E2E suites | RISK-004, RISK-005 |
| FR-UX-001, FR-THEME-001, NFR-A11Y-001 | Phases 5-6 | responsive/axe/manual accessibility/visual tests | RISK-007 |
| NFR-PERF-001 | Phase 7 | Lighthouse and production-like field/lab checks | RISK-008 |
| NFR-TEST-001, NFR-CI-001 | Phase 8 + CI | coverage and required pipeline gates | RISK-006 |
| NFR-SEC-001 | Phases 4, 8, security gate | threat model, validated findings, dependency/secret scans | RISK-004, RISK-009 |
| NFR-OBS-001 | Phase 9 | injected failure, log/redaction, alert tests | RISK-010 |
| NFR-REL-001 | Phase 10 | preview, backup/restore, smoke, rollback evidence | RISK-005, RISK-010 |

## Phased roadmap

Phases 0-2 are verified complete. Phase 3 is active. Phases 4-10 and CI/Definition-of-Done remain gated in dependency order. Phase 4 contains a prepared Supabase migration, but persistent application is a later T3 action and cannot bypass Phase 3 or its own approval gate.

## Definition of done

The program is complete only when all P0/P1 requirements are implemented or explicitly accepted/deferred by the owner, their mapped checks pass with evidence, no release-blocking security/accessibility/correctness failure remains, migration and rollback assets are usable, preview and production health are verified, operational monitoring is active, and the persistent project records match the deployed reality.

## Open items

- Supabase backup/restore capability and exact persistent-migration approval are required in Phase 4.
- Final public domain is required before Plausible production analytics configuration.
- Any major catalog expansion requires owner approval; completing or pruning current entries does not.
