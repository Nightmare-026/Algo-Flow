# Testing Strategy

## Current baseline

- Jest + jsdom + Testing Library.
- Four test files, 29 tests: 24 pass and 5 registry-contract tests fail.
- Global configured threshold: 85% statements, branches, functions, and lines.
- Measured coverage: 7.57% statements, 2.91% branches, 4.04% functions, 8.19% lines.
- Playwright is installed but there are no E2E specifications.
- No RLS, migration, visual-regression, accessibility, property-based, or cross-language execution suite exists.

## Layered target

1. Static: typecheck, lint with zero warnings, format, registry/environment/schema validation, dead links, secret scan, dependency audit.
2. Unit: validators, playback reducer/store, every algorithm and step generator, metadata and line mappings.
3. Integration: registry-to-renderer/control/code synchronization; auth-to-profile; bookmark/progress/session/theme persistence.
4. Database: migrations, constraints, triggers, grants, RLS owner/cross-user/anonymous matrices.
5. E2E: every public route and visualizer smoke test, playback, input, language switching, auth, protected routes, dashboard, 404.
6. Visual/accessibility: dark/light, loading/error/empty, required breakpoints, axe plus manual keyboard/screen reader.
7. Cross-language: run JavaScript/Python and compile/run C++/Java fixtures where toolchains are valid.

## Release policy

No failing type, registry, correctness, auth, RLS, route, accessibility-blocker, or high/critical security test may be waived for production.

