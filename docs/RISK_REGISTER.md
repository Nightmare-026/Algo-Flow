# Risk Register

| ID | Priority | Risk / trigger | Owner / phase | Mitigation and closure evidence | Status |
|---|---|---|---|---|---|
| RISK-001 | P0 | Public entries can appear complete while 522 genuine authored registry artifacts remain missing after 18 array entries passed. | Phase 3 | Executable composed readiness, complete or prune entries, route/catalog/sitemap parity. | Open |
| RISK-002 | P0 | Insertion-sort reads beyond the element array after swapping the last pair and returns HTTP 500. | Phase 3 / P3-T01 | Captured values before swap; 6 unit regressions, typecheck, focused route, and 105-route audit pass. | Closed 2026-07-15 |
| RISK-003 | P0 | Educational output, pseudocode, animations, complexity, or four-language code can disagree. | Phase 3 / P3-T02-T06 | Shared fixtures, invariants, mapping checks, parsing/compilation/execution, truthful verification labels. | Open |
| RISK-004 | P0 | Auth, grants, RLS, RPC, trigger, or redirect drift permits privilege escalation or cross-user access. | Phase 4 | Least privilege; anonymous/owner/cross-user matrices; server-side authorization; current Supabase advisors. | Open |
| RISK-005 | P0 | Persistent migration or deployment causes data loss, incompatibility, or outage. | Phases 4 and 10 (T3) | Preview/dry-run, backup/restore evidence, exact confirmation, idempotent execution, health checks, rollback/forward recovery. | Open |
| RISK-006 | P0 | Low automated coverage permits regressions across shared visualizer and private-data paths. | Phase 8 | Risk-prioritized unit/integration/E2E/database suites and enforced release threshold. | Open |
| RISK-007 | P0 | Contrast, keyboard, focus, screen-reader, zoom, responsive, or motion failures block users. | Phases 5-6 | WCAG 2.2 AA automated and manual evidence at required viewports/states. | Open |
| RISK-008 | P1 | Current local performance baseline does not prove production behavior or INP. | Phase 7 | Production-like Lighthouse/bundle testing plus field monitoring after release. | Open |
| RISK-009 | P1 | Moderate transitive PostCSS advisories or future dependency drift remain exploitable. | Security / CI | Monitor official Next release, audit on every change, document time-bound exception, upgrade when compatible. | Open |
| RISK-010 | P1 | Failures remain invisible or recovery ownership is unclear. | Phases 9-10 | Redacted structured logs, metrics, alerts, runbooks, incident ownership, smoke and rollback drills. | Open |
| RISK-011 | P2 | Running `next build` while reusing a dev server corrupts local `.next` state and creates misleading browser failures. | All local phases | Use a clean dev server after builds; classify the observed failure as environment-related. | Mitigated |

P0/P1 risks cannot be silently waived. Closure requires evidence in `docs/PROJECT_STATE.md`, the owning phase contract, and the relevant test/security/operations record.
