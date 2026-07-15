# Algo Flow Repository Contract

This is a production-readiness program. Apply the smallest process that controls the actual risk, and classify work before editing:

- T0: trivial, isolated, low-risk.
- T1: bounded module or component work.
- T2: cross-module, security-sensitive, data-sensitive, or release-program work.
- T3: production deployment, persistent migration, access-control change, deletion, or another material external action.

The active program is **T2, Phase 3 - Visualizer Correctness**. Persistent Supabase changes and deployment are T3 and require an action-specific preview, recovery evidence, and explicit confirmation.

## Required reading

For T2/T3 work, read `docs/SRS.md`, `docs/PROJECT_STATE.md`, the active file under `docs/phases/`, and the relevant architecture, decision, risk, test, security, or operations records before editing. Repository, runtime, database, and test evidence override stale documentation.

## Project commands

- Install: `npm ci`
- Develop: `npm run dev`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format check: `npm run format:check`
- Unit tests: `npm test -- --runInBand`
- Coverage: `npm run test:coverage -- --runInBand`
- Browser tests: `npm run test:e2e`
- Runtime registry contract: `npm run validate:registry`
- Publication readiness: `npm run validate:registry:readiness`
- Migrated four-language examples: `npm run verify:code-examples` (use `-- --require-all` for the release gate)
- Production build: `npm run build`

Do not report an unexecuted check as passing. Classify failures as change-caused, pre-existing, flaky, environment-related, blocked, or unknown.

## Documentation map

- Requirements and traceability: `docs/SRS.md`
- Current phase, blockers, evidence, next action: `docs/PROJECT_STATE.md`
- Architecture: `docs/ARCHITECTURE.md`
- Decisions: `docs/DECISIONS.md`
- Risks: `docs/RISK_REGISTER.md`
- Version-sensitive research: `docs/RESEARCH.md`
- Detailed historical tracker: `docs/PROGRESS_TRACKER.md`
- Test strategy equivalent: `docs/TESTING_STRATEGY.md`
- Security equivalents: `docs/SECURITY_THREAT_MODEL.md`, `docs/SECURITY_AUDIT.md`, and root `SECURITY.md`
- Operations equivalents: `docs/DEPLOYMENT_AND_ROLLBACK.md` and `docs/RELEASE_CHECKLIST.md`
- Active phase contracts: `docs/phases/`
- Restart record: `docs/sessions/SESSION-LATEST.md`
- AI evaluation: not applicable; the shipped product does not contain an LLM or autonomous agent. Create `docs/EVALUATION.md` only if that scope changes.

## Boundaries and safety

- Browser/UI code is under `src/app`, `src/components`, and `src/features`; reusable data and validation boundaries belong in `src/lib` or the owning feature.
- Supabase migrations and recovery scripts live under `supabase/migrations` and `supabase/rollbacks`.
- Never read, print, commit, or document secret values. Client code may receive only public environment variables; never expose a service-role credential.
- Preserve unrelated working-tree changes. Avoid unrelated refactors and dependency additions.
- Use stable requirement, task, decision, and risk IDs in T2/T3 records.
- Keep one active write phase. Serialize schemas, migrations, authorization, and deployment work.
- Read-only, local, reversible checks are allowed. Destructive, billable, production, access-control, bulk, and irreversible actions require exact user approval.
- A phase closes only with acceptance evidence, matching documentation, usable recovery, and no unresolved P0/P1 blocker.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16.2.10. APIs, conventions, and file structure may differ from prior versions. Read the relevant installed guide in `node_modules/next/dist/docs/` before changing Next.js behavior, and heed deprecation notices.
<!-- END:nextjs-agent-rules -->
