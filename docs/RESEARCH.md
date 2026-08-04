# Research Record

Research is version-sensitive and must be revalidated when the dependency, environment, or decision changes.

## 2026-07-14 - Next.js 16.2.10 route recovery conventions

- **Source:** installed authoritative documentation under `node_modules/next/dist/docs/` for App Router error handling, loading UI, not-found handling, and dynamic route parameters.
- **Environment/version:** Next.js 16.2.10, React 19.2.4, App Router.
- **Finding:** route parameters are async; server validation can call `notFound()`; route error boundaries are client components; current recovery uses `unstable_retry` where a retry should invalidate cached work.
- **Decision impact:** `/visualizer/[slug]` was split into server validation and a client interaction component; root error, global-error, loading, and not-found boundaries were added.
- **Revalidation trigger:** Next.js upgrade or route architecture change.

## 2026-07-14 - Lighthouse baseline

- **Tool/version:** Lighthouse 13.4.0 desktop preset against the local production-like route.
- **Finding:** home scored 98 performance, 96 accessibility, 100 best practices, and 100 SEO; LCP 1.0 s, CLS 0, TBT 10 ms, transfer 358 KiB. The CLI produced a Windows temporary-directory cleanup EPERM after saving valid JSON/HTML reports.
- **Decision impact:** performance is a baseline rather than release proof; remaining contrast/accessibility work stays assigned to Phases 5-7.
- **Evidence:** `docs/lighthouse-phase0-home.report.json` and `.html`.

## Pending before Phase 4 T3 start

- Revalidate current official Supabase documentation and changelog for CLI/MCP migration behavior, generated types, RLS policy performance, security-definer/invoker functions, Auth redirect allowlists, rate limits, backups, and point-in-time recovery for project `mylzlhevgffgkwpeerzh`.
- Record exact source URLs, access date, applicable product tier/version, and decision impact before persistent mutation.

## 2026-07-15 - Local language verification toolchains

- **Environment:** Windows workspace used for Phase 3 code-example verification.
- **Available:** Node.js v24.14.0, MinGW g++ 6.3.0, and javac 1.8.0_482.
- **Python discovery correction:** `python --version` resolves only to the Microsoft Store application alias and exits nonzero, but the Windows `py -3` launcher provides Python 3.14.3. WSL is access-denied in this environment; Docker 29.4.0 is installed but is not needed for this gate.
- **Decision impact:** JavaScript and Python can be executed and C++/Java can be compiled/run locally. Verification discovers `python` first and then `py -3`. Toolchain age and language compatibility must be considered when authoring fixtures.
- **Revalidation trigger:** toolchain installation/version change or use of a CI/preview verification environment.
- **Windows execution note:** Device Guard can race freshly linked MinGW executables. Running from `C:\tmp` and waiting a bounded 750 ms after a successful link produced a clean 40/40 strict run; compile/output failures remain fatal.
