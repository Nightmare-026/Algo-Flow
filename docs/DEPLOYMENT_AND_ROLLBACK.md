# Deployment and Rollback Baseline

> No deployment, migration, tag, or remote setting was changed in Phase 0.

## Current evidence

- Declared production URL: `https://algo-flow-night-sigma.vercel.app/`.
- Production serves Next.js through Vercel and sampled routes are reachable.
- Git `main`, `origin/main`, and the production-readiness branch started at `672f9a8`.
- The connected Vercel account exposes one team but zero projects, so deployment ownership/configuration cannot be verified through the connector.
- No `vercel.json` or committed `.vercel/project.json` is present.
- Supabase remote migration state is unavailable.

## Environment model

- Local: developer machine and ignored `.env.local`.
- Preview/staging: required but not verified.
- Production: owner-controlled Vercel and Supabase projects.

## Required pre-deploy sequence

1. Clean reviewed commit and passing CI gates.
2. Verified preview deployment using non-production secrets/data.
3. Database backup and tested up/down migration for any schema change.
4. Owner confirmation for production migration/deployment.
5. Deploy, run route/auth/visualizer/RLS smoke tests, then monitor.

## Rollback contract

- Application: redeploy the last known-good Vercel deployment or revert the release commit.
- Database: execute the tested down migration only after confirming application compatibility and backup availability.
- Secrets: revoke/rotate at the provider, update Vercel/Supabase secret stores, invalidate sessions where applicable, and redeploy.

Exact project IDs, deployment IDs, backup commands, migration down scripts, release tag, and monitoring window remain pending owner-visible remote access.

