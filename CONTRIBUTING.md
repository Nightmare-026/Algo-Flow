# Contributing

## Workflow

1. Branch from the approved base and preserve unrelated working-tree changes.
2. Keep changes focused and update progress/decision documents when behavior or architecture changes.
3. Do not publish incomplete visualizers; public entries must satisfy the complete contract and correctness suite.
4. Add happy-path, edge, adversarial, and regression tests.
5. Run registry validation, typecheck, lint, format check, tests, coverage, and production build before review.

## Security and data

- Never commit secrets or production data.
- Validate untrusted input on the server.
- Treat authentication and authorization as separate checks.
- Database changes require versioned up/down migrations, RLS tests, backup/rollback planning, and owner confirmation before production execution.

## Merge gate

A failing build, registry, algorithm correctness, auth/RLS, public route, accessibility blocker, secret scan, or confirmed high/critical security finding blocks merge.

