# Session latest

- Date: 2026-07-19
- Objective: verify and repair production signup, sign-in, callback, recovery, session, and profile provisioning flow.
- Tier: T3
- Outcome: local fix verified; production deployment and schema change not executed.
- Changed contracts: shared auth-origin resolver, signup/reset callback configuration, callback return-path validation, Auth provisioning migration/trigger, and regression tests.
- Verification: focused 18/18; full Jest 183/183; TypeScript pass; targeted ESLint pass; registry 105/105; production build pass outside the restricted Windows worker sandbox.
- Production evidence: invalid password path behaves safely; Google and reset submissions currently hit deployed server errors; correct Supabase account exists but has no recorded completed app sign-in; live profile schema is behind the canonical contract.
- Blockers: owning Vercel project and correct Supabase Management access are not connected; user interaction is required for provider consent and mailbox callback.
- Git state: auth/database readiness changes are uncommitted; unrelated files were preserved.
- Next safe action: connect the exact projects, run migration backup/preview and deployment diff, then request action-specific approval.
