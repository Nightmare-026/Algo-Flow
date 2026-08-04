# Release Checklist

> Current verdict: **BLOCKED**. This is a live checklist; unchecked items are not implied complete.

## Repository and build

- [ ] Clean, reviewed release commit
- [ ] Registry validator returns controlled success
- [ ] Typecheck passes
- [ ] Lint passes with zero warnings
- [ ] Format check passes
- [ ] Unit/integration/E2E/database/accessibility suites pass
- [ ] Production build and bundle budget pass
- [ ] Dedicated secret scan and dependency policy pass

## Product

- [ ] Every public visualizer satisfies the complete contract
- [ ] Every public algorithm has correctness and synchronization evidence
- [ ] No placeholder, dead route, fake control, or unsupported claim remains
- [ ] Dark and light themes pass responsive/accessibility review

## Backend and security

- [ ] Remote migrations match version control
- [ ] RLS/grants pass anonymous, owner, and cross-user tests
- [ ] Auth lifecycle and abuse controls pass
- [ ] Required security headers pass
- [ ] No confirmed high/critical vulnerability remains

## Release operations

- [ ] Preview/staging smoke passes
- [ ] Backup and rollback are tested
- [ ] Owner approves irreversible actions
- [ ] Production smoke passes
- [ ] Release tag includes SHA, timestamp, environment, QA link, and rollback command
- [ ] Monitoring window completes healthy

