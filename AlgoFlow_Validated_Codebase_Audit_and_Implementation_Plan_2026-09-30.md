# AlgoFlow — Validated Audit Findings & Complete Engineering Implementation Plan

**Repository:** `Nightmare-026/Algo-Flow`

**Document date:** 30 September 2026

**Document status:** Validation-grade engineering audit and remediation plan

**Scope rule:** This document separates facts that are already evidenced from the earlier AlgoFlow audit, technical facts independently validated against authoritative documentation, and repository/database claims that cannot honestly be verified without direct GitHub/Supabase source access.

---

## 1. Executive Summary

AlgoFlow already has substantial product breadth: a large interactive visualizer library, a multi-language code presentation model, a curriculum, quizzes, account-oriented features, and a combined learning/visualization experience.

The highest-value engineering work is **not a rewrite**. It is to establish a strict source of truth, make visualization state deterministic, harden user-data authorization, eliminate content/navigation drift, and add automated regression controls so that the product stays internally consistent as the visualizer count and curriculum grow.

The previous AlgoFlow audit recorded a current public inventory of **138 visualizers across 12 categories** and documented several confirmed public/content inconsistencies. It also explicitly distinguished backend/security/runtime areas that were not verifiable in that environment. Those distinctions are preserved here. [Source: previous AlgoFlow audit material]

### Core conclusions

1. **Visualizer inventory must have one canonical registry.** Counts, slugs, metadata, category membership, quiz mappings, learning mappings, and public/legal copy should derive from that registry.
2. **The visualizer engine should be execution-state driven.** A deterministic step sequence should be the authoritative source for rendering, code highlighting, state inspection, explanations, and playback.
3. **The backend must remain authoritative for security-sensitive state.** Clients must not be trusted for ownership, score, completion, role, or other security decisions.
4. **Supabase RLS must be treated as an actual enforcement boundary and tested as such.** Table existence alone is not evidence of isolation. Supabase currently documents that grants are checked before RLS and that secret keys bypass RLS. [Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
5. **The current Supabase key model should be planned for migration.** Supabase states that legacy `anon` and `service_role` keys are being deprecated by the end of 2026 in favor of publishable and secret keys. [Supabase API key migration](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys)
6. **Browser storage must not be treated as a security boundary.** OWASP explicitly advises against storing authentication tokens, session IDs, JWTs, refresh tokens, or credentials in localStorage/sessionStorage because JavaScript running in the origin can access them. [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
7. **Analytics/privacy wording needs correction.** Google documents a pseudonymous browser/device identifier and default collection including approximate geolocation and browser/device information. [Google Analytics data collection](https://support.google.com/analytics/answer/11593727)
8. **HIPAA/SOC2 language must be deployment-specific.** Supabase states that HIPAA compliance requires the customer to sign a BAA and configure the required HIPAA controls; Supabase SOC2 compliance does not automatically make the customer's own environment or application SOC2 compliant. [Supabase HIPAA](https://supabase.com/docs/guides/security/hipaa-compliance), [Supabase shared responsibility](https://supabase.com/docs/guides/deployment/shared-responsibility-model)
9. **Accessibility and performance numbers previously labelled as scores must not be treated as measured production metrics.** They remain risk assessments until automated/runtime testing provides actual results.
10. **GitHub Actions should be hardened around least privilege, immutable third-party actions, protected environments, and software provenance.** GitHub currently recommends explicitly declaring minimal permissions and pinning third-party actions to full commit SHAs. [GitHub Actions security](https://docs.github.com/en/actions/reference/security/secure-use)

---

# 2. Evidence & Validation Model

To avoid false certainty, every finding in this document uses one of these statuses.

| Status | Meaning |
|---|---|
| **CONFIRMED — prior audit evidence** | Directly evidenced in the saved AlgoFlow audit dated 23 September 2026. It is a validated historical/public finding, but it is not a fresh source-code inspection. |
| **VALIDATED — technical rule** | The underlying technical interpretation was checked against current authoritative documentation/standards. |
| **UNVERIFIED — repository** | Requires direct GitHub source-tree/commit access. It must not be presented as an observed code defect. |
| **UNVERIFIED — Supabase** | Requires actual project schema, policy, grant, function, storage, or auth configuration access. |
| **UNVERIFIED — runtime** | Requires browser, deployed-response, device, or authenticated runtime testing. |
| **RECOMMENDATION** | Engineering target, not a claim about the current implementation. |

### Critical limitation

The current environment does **not** expose a connected GitHub repository reader or Supabase project/database connector for this repository. The GitHub repository URL alone was not sufficient to obtain a line-by-line source tree through an authorized connected source. Therefore this document intentionally does **not** fabricate:

- exact file names that are unused,
- exact duplicate components,
- exact dependency problems,
- exact source-level vulnerabilities,
- actual RLS policies or grants,
- exact database tables/columns/indexes/functions,
- exact GitHub workflow contents,
- exact commit history findings.

Those items are represented as a concrete verification backlog later in this document.

---

# 3. Previously Confirmed AlgoFlow Findings

The following were recorded as confirmed in the saved AlgoFlow audit evidence.

## AF-001 — Visualizer count drift in legal/product copy

**Status:** CONFIRMED — prior audit evidence

**Priority:** P0

**Recorded finding:** The public inventory reconciled to **138 visualizers** across 12 categories, while privacy/terms/license copy still referenced **137**.

Recorded category totals:

| Category | Count |
|---|---:|
| Array | 32 |
| Linked List | 13 |
| Doubly Linked List | 6 |
| Circular Linked List | 4 |
| Stack | 12 |
| Queue | 10 |
| Tree | 14 |
| Graph | 9 |
| Hash Table | 12 |
| Hash Set | 5 |
| Matrix | 10 |
| String | 11 |
| **Total** | **138** |

### Engineering interpretation

The problem is not merely a stale number. It is evidence that product metadata is duplicated across multiple surfaces.

### Required fix

Introduce a canonical visualizer registry and derive:

- category totals,
- homepage count,
- library count,
- legal copy count,
- sitemap inventory,
- search inventory,
- quiz mappings,
- learning mappings.

CI must fail if any generated or manually maintained count disagrees with the registry.

**Evidence:** previous AlgoFlow audit. See `AF-001` in the saved audit.

---

## AF-002 — Footer learning links routing to the homepage

**Status:** CONFIRMED — prior audit evidence

**Priority:** P0

The saved audit recorded that the footer links named:

- How it works
- Multi-Language Code
- Study Features

were followed to destinations that landed on the homepage rather than dedicated intended pages.

### Engineering interpretation

This is a navigation integrity problem and a strong indicator that link destinations are not governed centrally enough.

### Required fix

Either:

1. create real destination pages, or
2. remove the links until those pages exist.

Do not retain placeholder links that visually imply completed functionality.

Add automated internal-link tests.

**Evidence:** previous AlgoFlow audit.

---

## AF-003 — Homepage taxonomy/filter claim mismatch

**Status:** CONFIRMED — prior audit evidence

**Priority:** P1

The saved audit recorded that homepage wording described filters including Sorting, Search, Trees, Graphs and DP, while the observed library UI exposed a different filter taxonomy and did not expose a matching DP filter.

### Required fix

Choose one authoritative taxonomy.

Preferred approach:

```text
Category
  ├── Array
  ├── Linked List
  ├── Stack
  ├── Queue
  ├── Tree
  ├── Graph
  ├── Hash
  ├── Matrix
  └── String

Concept / Operation / Paradigm
  ├── Sorting
  ├── Searching
  ├── Graph traversal
  ├── Dynamic programming
  └── etc.
```

Then generate both UI filters and marketing/product copy from the same metadata model.

**Evidence:** previous AlgoFlow audit.

---

## AF-004 — Stale curriculum review label

**Status:** CONFIRMED — prior audit evidence

**Priority:** P1

The saved audit recorded curriculum pages displaying a label such as “Reviewed & Verified (2024 Syllabus)” while the audit date was in 2026.

### Engineering interpretation

The label is not automatically proof that the content is incorrect. The actual defect is weak content-governance metadata and unclear freshness.

### Required fix

Use explicit metadata:

```text
Curriculum version: <version>
Last technical review: <date>
Last curriculum review: <date>
Review status: Reviewed / Needs review
Reviewer: <name or role>
```

CI can then detect stale review metadata.

**Evidence:** previous AlgoFlow audit.

---

## AF-005 — Complexity thresholds presented too deterministically

**Status:** CONFIRMED — prior audit evidence

**Priority:** P1

The saved audit identified curriculum language suggesting that input-size thresholds immediately dictate algorithmic complexity, with fixed heuristic rules such as `n <= 500 -> O(n^3)` and `n >= 10^9 -> O(log n) or O(1)`.

### Technical validation

This is best understood as a **competitive-programming heuristic**, not a mathematical law. Actual feasibility depends on the full problem: operation cost, number of test cases, constants, language/runtime, time limit, memory limit, data distribution, and implementation details.

### Required wording

Prefer:

> “Typical competitive-programming heuristic. The exact feasible complexity depends on the time limit, language, constant factors, number of test cases, memory limits, and operation costs.”

Do not teach learners to mechanically infer complexity from `n` alone.

**Evidence:** previous audit + technical reasoning.

---

## AF-006 — Pointer-chasing/O(n) memory latency wording

**Status:** CONFIRMED — prior audit evidence

**Priority:** P1

The saved audit recorded the phrase “pointer-chasing O(n) memory latency”.

### Technical validation

In standard asymptotic algorithm analysis, a single pointer/reference dereference is normally modeled as an O(1) operation. Pointer-heavy traversals can have poorer cache locality and higher practical latency, but that is a **microarchitectural/performance property**, not the same thing as saying one pointer dereference is O(n).

### Required replacement

> “Pointer-heavy structures may experience worse practical performance because of cache misses and memory-access patterns. In the standard RAM model, one pointer dereference is treated as O(1); a traversal over n nodes is O(n).”

**Evidence:** previous audit + standard complexity model reasoning.

---

## AF-007 — Boolean described as a physical single-bit representation

**Status:** CONFIRMED — prior audit evidence

**Priority:** P2

The saved audit recorded wording equivalent to “Single-bit logical states ({0,1})”.

### Technical validation

A Boolean has two logical states, but physical representation is language/runtime/compiler dependent. A logical two-state domain does not imply one physical bit of memory in a general-purpose language.

### Required replacement

> “Boolean values represent two logical states, such as true/false or 1/0. Their physical memory representation is implementation-dependent.”

**Evidence:** previous audit + technical language/runtime principle.

---

## AF-008 — UTF-8 described as variable-width code points

**Status:** CONFIRMED — prior audit evidence; terminology independently validated

**Priority:** P2

Unicode specifies UTF-8 as an encoding form that maps each Unicode scalar value to an unsigned byte sequence of one to four bytes. UTF-8 is therefore a **variable-length byte encoding** rather than “variable-width code points”. [Unicode Core Specification](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/)

### Required replacement

> “UTF-8 is a variable-length byte encoding of Unicode scalar values.”

Optionally explain that a Unicode code point is an abstract value while UTF-8 is an encoding form.

---

## AF-009 — “1 second ≈ 10^8 operations” needs qualification

**Status:** CONFIRMED — prior audit evidence

**Priority:** P2

The saved audit recorded use of a roughly `10^8 operations/second` rule.

### Engineering interpretation

Useful as a very rough competitive-programming intuition, but it is not a universal machine-performance law.

### Required wording

> “A rough contest heuristic sometimes used for first-pass complexity estimation. Real execution depends strongly on hardware, language/runtime, operation type, compiler optimization, I/O, cache behavior, and the judge environment.”

Do not use it as a guaranteed benchmark.

---

## AF-010 — Cycle detection description lacks algorithm-specific precision

**Status:** CONFIRMED — prior audit evidence

**Priority:** P2

The saved audit identified a generic description saying “Cycle Detection in Graph” detects cycles in both directed and undirected graphs using “3-color DFS”.

### Technical validation

Three-color DFS is a standard approach for detecting back edges/cycles in **directed** graphs. Undirected DFS requires different handling, typically considering a parent edge or equivalent logic. A single generic statement can therefore teach the wrong invariant.

### Required implementation/content correction

Separate:

```text
Directed graph cycle detection
    WHITE / GRAY / BLACK
    back edge to GRAY => cycle
```

from:

```text
Undirected graph cycle detection
    DFS/BFS + parent tracking
    visited neighbor != parent => cycle
```

Or explicitly present two separate algorithms.

---

# 4. Privacy & Security Findings That Are Technically Validated

## AF-011 — GA4 described as anonymous

**Status:** CONFIRMED — prior audit copy issue + independently validated technical interpretation

**Priority:** P1

Google's current documentation states that Google Analytics can collect, by default, user/session counts, session statistics, approximate geolocation, and browser/device information. For websites, Analytics stores a client ID in a first-party `_ga` cookie to distinguish users and sessions; Google's Device ID documentation describes the website identifier as a **unique, pseudonymous** website user/device identifier. [Google Analytics data collection](https://support.google.com/analytics/answer/11593727), [GA4 Device ID](https://support.google.com/analytics/answer/9356035)

### Required correction

Avoid categorical wording such as:

> “GA4 provides anonymous analytics.”

Prefer:

> “AlgoFlow uses Google Analytics for website analytics. Google Analytics may use pseudonymous identifiers and collect information such as session statistics, approximate geolocation, and browser/device information depending on configuration. The site's actual consent, retention, and event configuration should be documented accurately.”

Then make the policy match the actual implementation.

---

## AF-012 — localStorage described as secure storage

**Status:** CONFIRMED — prior audit copy issue + independently validated

**Priority:** P1

OWASP states that localStorage/sessionStorage are accessible to JavaScript executing in the same origin and recommends **not** storing authentication tokens, session IDs, JWTs, refresh tokens, or credentials there. OWASP also notes that a single XSS vulnerability can expose or modify the stored data. [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

### Required correction

Call localStorage:

> “client-side persistent storage”

not:

> “secure storage mechanism”.

Suitable uses can include non-sensitive preferences or local UI state. Authentication secrets and other sensitive credentials must not depend on it.

---

## AF-013 — Privacy Shield wording is outdated

**Status:** CONFIRMED — prior audit copy issue + independently validated current EU source

**Priority:** P1

The European Commission lists an adequacy decision for the **EU-US Data Privacy Framework dated 10 July 2023**. [European Commission adequacy decisions](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en)

### Required correction

Do not continue to describe the superseded EU-US “Privacy Shield” as though it is the current adequacy framework.

The policy should identify the **actual transfer mechanism applicable to the service's current data flows**, not merely replace one phrase with another without legal review.

---

## AF-014 — Supabase HIPAA claim requires scope

**Status:** CONFIRMED — prior audit copy issue + independently validated current Supabase documentation

**Priority:** P1

Supabase currently states that customers handling PHI must sign a BAA with Supabase and configure required HIPAA controls. Supabase's shared-responsibility model lists customer responsibilities including access management, data protection, security controls, MFA for relevant accounts, SSL enforcement, network restrictions, point-in-time recovery, connection logging, and appropriate storage handling. [Supabase HIPAA](https://supabase.com/docs/guides/security/hipaa-compliance), [Supabase shared responsibility](https://supabase.com/docs/guides/deployment/shared-responsibility-model)

### Required correction

Do not claim simply:

> “Supabase is HIPAA compliant, therefore AlgoFlow is HIPAA compliant.”

A deployment-specific statement must reflect the application's own configuration, contractual requirements, and whether the application actually handles PHI.

For AlgoFlow, which is a DSA education product, HIPAA should generally **not be part of the product's marketing/security claims unless the project genuinely handles regulated PHI and has implemented the required controls**.

---

## AF-015 — Blanket legal/security-control claims need deployment evidence

**Status:** UNVERIFIED — deployment/configuration

**Priority:** P1

The previous audit identified policy language asserting details such as:

- TLS 1.3 everywhere,
- RLS on every personal-data table,
- specific cookie attributes,
- immediate deletion,
- rate limiting,
- anti-cheat controls.

These can be true, but they cannot be validated from policy text alone.

### Required engineering control

Maintain a security control register:

```text
Control ID
Control description
Implementation location
Owner
Evidence source
Test method
Last verified
Status
```

A policy should not claim a technical control unless the control is actually deployed or explicitly described as intended.

---

## AF-016 — Exhaustive cookie/storage inventory is unverified

**Status:** UNVERIFIED — runtime

**Priority:** P2

The policy should only call an inventory “complete/exhaustive” after a clean-browser runtime capture across the major states of the application.

Required capture states:

```text
Fresh visitor
Guest navigation
Visualizer
Learning page
Quiz
Login
OAuth callback
Authenticated dashboard
Logout
Password reset
Error page
```

Capture:

- cookies,
- localStorage,
- sessionStorage,
- IndexedDB if used,
- analytics initialization,
- third-party requests,
- event payloads that could contain user-identifying data.

---

# 5. Runtime, Accessibility, and UX Findings

## AF-017 — Client-side visualizer/bootstrap stages

**Status:** CONFIRMED — prior runtime/public evidence

**Priority:** P2

The saved audit observed initial states such as:

- “Loading visualizer…”
- “Loading syntax highlighter…”
- “Preparing step explanation…”

### Interpretation

These loading states are not automatically defects. They show that the visualizer workstation has client-side bootstrapping dependencies.

### Required architecture

Server-render stable page information first:

```text
Title
Description
Complexity
Learning context
Basic controls/instructions
```

Then progressively enhance:

```text
Interactive renderer
Code highlighting
Animation/playback
State inspector
```

Measure actual LCP/INP/TBT before optimizing based on assumptions.

---

## AF-018 — Quiz experience requires post-answer verification

**Status:** UNVERIFIED — runtime beyond initial route evidence

**Priority:** P2

The saved audit recorded dedicated quiz routes with five-question flows and four answer choices, but initial HTML did not prove the quality of post-answer feedback.

### Acceptance requirement

After a submitted answer, the system should verify:

```text
correct/incorrect state
correct answer
explanation
why the selected option is wrong (when applicable)
next-question behavior
retry behavior
related visualizer/chapter link
mastery/progress update
```

Do not assume that a working route equals a complete teaching loop.

---

## AF-019 — Curriculum is reference-dense

**Status:** CONFIRMED — prior UX evidence

**Priority:** P2

The saved audit recorded a 62-chapter curriculum and commonly long chapters. The problem is not “too much information”; the issue is **progressive disclosure and learner flow**.

### Preferred chapter pattern

```text
1. Intuition
2. Tiny example
3. Visual model
4. Core invariant
5. Step-by-step execution
6. Pseudocode
7. Code
8. Complexity
9. Common mistakes
10. Guided practice
11. Quiz
12. Advanced notes
```

Keep advanced detail, but do not force beginner users to absorb it all before interacting.

---

## AF-020 — Mental Math can compete with the primary DSA journey

**Status:** CONFIRMED — prior IA concern

**Priority:** P2

The saved audit identified Mental Math as a potential competing primary module on a product whose core value is DSA learning.

### Recommended IA

```text
LEARN
   ↓
VISUALIZE
   ↓
PRACTICE
   ↓
QUIZ
   ↓
MASTERY
```

Mental Math can remain a first-class module, but it should have a clearly separated product identity rather than being interwoven with the primary DSA progression.

---

# 6. Technical Findings Reclassified as Verification Gaps

These are critical, but they are **not current confirmed defects** without source/database evidence.

| Area | Current status | What must be verified |
|---|---|---|
| Supabase RLS | UNVERIFIED | Every user-owned table has RLS enabled and correct policies |
| RLS grants | UNVERIFIED | Role grants are least privilege and sufficient for intended operations |
| Service/secret key exposure | UNVERIFIED | No server-only credential reaches client bundles |
| Auth/session implementation | UNVERIFIED | Actual session/cookie lifecycle and refresh behavior |
| Cross-user authorization | UNVERIFIED | User A cannot read/write User B's rows |
| Score authorization | UNVERIFIED | Client cannot set authoritative score/result fields |
| Anti-cheat | UNVERIFIED | Server-side validation and replay/double-submit handling |
| Rate limiting | UNVERIFIED | Protected mutation/auth endpoints enforce appropriate limits |
| Account deletion | UNVERIFIED | Cascades, sign-out, post-delete access, retention/backups behavior |
| Storage policies | UNVERIFIED | Public/private buckets and object-level access are correct |
| DB normalization | UNVERIFIED | Actual schema must be inspected |
| Index quality | UNVERIFIED | Query patterns must be matched to indexes |
| Database duplication | UNVERIFIED | Actual columns/constraints must be inspected |
| Functions/views security | UNVERIFIED | SECURITY INVOKER/DEFINER, grants, and RLS interactions |
| GitHub Actions permissions | UNVERIFIED | Actual workflow YAML required |
| Third-party Action pinning | UNVERIFIED | Actual action references required |
| Secret scanning | UNVERIFIED | Actual repository/CI configuration required |
| Dependency vulnerabilities | UNVERIFIED | Current lockfile/package manifests required |
| Dead files | UNVERIFIED | Full repository tree + references required |
| Dead dependencies | UNVERIFIED | Package manifests + source graph required |
| Duplicate components | UNVERIFIED | Source tree required |
| Exact AI-generated code patterns | UNVERIFIED | Source history and code needed |

---

# 7. Canonical Frontend Architecture

The target architecture should be feature-oriented and should preserve the existing product rather than forcing an unnecessary rewrite.

```text
app/
├── (public)/
│   ├── page.tsx
│   ├── visualizers/
│   ├── visualizer/[slug]/
│   ├── learnings/
│   ├── quizzes/
│   └── legal/
│
├── (auth)/
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   └── callback/
│
├── (account)/
│   ├── dashboard/
│   ├── bookmarks/
│   ├── history/
│   └── settings/
│
├── (admin)/
│   └── ...
│
└── api/
    └── only-when-server-route-is-appropriate/

features/
├── visualizer/
│   ├── engine/
│   ├── playback/
│   ├── synchronization/
│   ├── registry/
│   ├── renderers/
│   └── components/
├── quiz/
├── learning/
├── progress/
├── bookmarks/
└── search/

lib/
├── auth/
├── db/
├── validation/
├── security/
├── analytics/
├── errors/
└── utils/

content/
├── visualizers/
├── learning/
└── quizzes/

supabase/
├── migrations/
├── seed.sql
└── tests/

tests/
├── unit/
├── integration/
├── security/
├── e2e/
├── accessibility/
├── performance/
└── visual-regression/
```

### Architecture rule

A React component should not simultaneously own:

- raw DB access,
- authorization,
- validation,
- business rules,
- analytics side effects,
- rendering,
- and persistence.

Preferred flow:

```text
UI
 ↓
Action / controller
 ↓
Validation
 ↓
Domain service
 ↓
Repository
 ↓
Supabase
```

---

# 8. Canonical Visualizer Registry

The registry is the single most important structural refactor.

Suggested conceptual contract:

```ts
export interface VisualizerDefinition<TInput, TState> {
  id: string
  slug: string
  metadata: VisualizerMetadata

  validateInput(input: unknown): TInput

  generateSteps(input: TInput): readonly ExecutionStep<TState>[]

  getComplexity(): ComplexityMetadata

  code: {
    javascript: LanguageCode
    python: LanguageCode
    cpp: LanguageCode
    java: LanguageCode
  }

  quizId?: string
  learningChapterIds?: string[]
}
```

Metadata should contain, at minimum:

```text
id
slug
title
category
subcategory
difficulty
status
operations
supportedLanguages
renderer key
step-generator key
complexity
quiz mapping
learning mapping
content version
review date
```

### Registry-driven outputs

The same registry should drive:

- route generation,
- library cards,
- category counts,
- filters,
- search metadata,
- sitemap entries,
- SEO metadata,
- quiz links,
- learning links,
- legal/product counts,
- dashboard references.

No hardcoded `137`, `138`, `100+`, or similar counters should remain where the value can be computed.

---

# 9. Visualizer Execution-State Architecture

The visualizer should be modeled as deterministic execution data rather than a loose collection of UI state changes.

```text
User Input
   ↓
Validate / Normalize
   ↓
Pure Step Generator
   ↓
ExecutionStep[]
   ↓
┌─────────────┬──────────────┬──────────────┬───────────────┐
│ Canvas      │ Code         │ State        │ Explanation   │
│ renderer    │ highlighting │ inspector    │ panel         │
└─────────────┴──────────────┴──────────────┴───────────────┘
```

An execution step can conceptually include:

```ts
interface ExecutionStep<TState> {
  index: number
  state: TState
  operation: string
  variables?: Record<string, unknown>
  highlight?: SourceMap
  explanation?: string
  visualHints?: VisualHints
}
```

This makes synchronization deterministic.

---

# 10. Multi-Language Source Mapping

Do not infer synchronization from line positions.

Use explicit source mappings:

```ts
interface SourceMap {
  javascript?: number[]
  python?: number[]
  cpp?: number[]
  java?: number[]
}
```

For each step:

```text
Step 42
 ├── algorithm state
 ├── operation
 ├── variables
 ├── explanation
 └── language-specific highlighted lines
```

This allows the same execution event to be represented in different code layouts without assuming line-number equality.

---

# 11. Visualizer Contract Test System

Every registered visualizer must pass a contract suite.

### Mandatory checks

```text
[ ] Unique id
[ ] Unique slug
[ ] Metadata present
[ ] Category valid
[ ] Difficulty valid
[ ] Supported-language set valid
[ ] Renderer exists
[ ] Input validator exists
[ ] Step generator exists
[ ] Complexity metadata exists
[ ] Quiz mapping valid when declared
[ ] Learning mapping valid when declared
[ ] Step sequence terminates
[ ] Final state correct
[ ] State shape remains valid
```

### Fixture classes

```text
empty input
single element
normal input
duplicate values
already sorted
reverse sorted
negative values
boundary values
minimum accepted input
maximum accepted input
invalid input
large input
```

For each representative fixture validate:

```text
final result
step count
state transitions
highlight mapping
completion state
explanation mapping
```

---

# 12. Backend Architecture

The backend should be domain-authoritative:

```text
Browser
  ↓
Next.js server/action/route
  ↓
Zod/shared validation
  ↓
Authentication
  ↓
Authorization
  ↓
Domain service
  ↓
Supabase repository / RPC
  ↓
Postgres
```

Security-sensitive fields should be derived server-side.

Do not trust client payloads such as:

```json
{
  "userId": "...",
  "score": 100,
  "completed": true,
  "role": "admin"
}
```

as authoritative values.

The server/database must determine ownership and authoritative state.

---

# 13. Supabase API-Key Architecture

Supabase currently documents this key model:

- publishable key for client/public application use,
- secret key for server-controlled privileged access.

Supabase also states that legacy `anon` and `service_role` keys are being deprecated by the end of 2026. [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Migration guide](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys)

### Target

```text
Browser
  ↓
publishable key
  ↓
RLS

Server
  ↓
secret key
  ↓
explicit application authorization
```

### Critical rule

Supabase states that secret/service-role access bypasses RLS. It is therefore not a substitute for authorization checks; it is an elevated credential that must remain server-side and must only be used by trusted code. [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)

### Migration task

Audit all occurrences of:

```text
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
anon
service_role
```

Then migrate server/client usage according to the current Supabase key model and rotate any key whose exposure cannot be confidently ruled out.

---

# 14. RLS Security Model

Supabase currently documents:

- `anon` for unauthenticated requests,
- `authenticated` for signed-in users,
- Postgres grants being evaluated before RLS,
- RLS policies controlling row visibility/mutation,
- secret/service-role access bypassing RLS. [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Required policy matrix

For every user-owned table:

| Actor | SELECT own | SELECT other | INSERT own | INSERT other | UPDATE own | UPDATE other | DELETE own | DELETE other |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| anon | deny | deny | deny | deny | deny | deny | deny | deny |
| user A | allow | deny | allow | deny | allow | deny | allow | deny |
| user B | allow | deny | allow | deny | allow | deny | allow | deny |
| admin | explicitly defined | explicitly defined | explicitly defined | explicitly defined | explicitly defined | explicitly defined | explicitly defined | explicitly defined |

Use `WITH CHECK` for ownership-sensitive insert/update policies where appropriate.

### Do not stop at tables

Audit:

```text
tables
views
functions
RPC endpoints
triggers
grant statements
storage buckets
storage object policies
```

Supabase currently warns that views can bypass RLS by default because they are commonly created with the owner's privileges; `security_invoker` can make the querying role's permissions/RLS apply to underlying tables. [Supabase Views](https://supabase.com/docs/guides/database/views)

---

# 15. Target Database Model

Because the exact current schema is not available, the following is a **target architecture**, not a claim about the current database.

```text
auth.users
   │
   └── profiles
         │
         ├── user_preferences
         ├── bookmarks
         ├── user_progress
         ├── quiz_attempts
         │      └── quiz_attempt_answers
         ├── daily_activity
         └── activity_events
```

## `profiles`

```text
id UUID PK → auth.users.id

display_name
avatar_url
created_at
updated_at
```

Supabase's user-management guidance recommends public user tables referencing `auth.users` with `ON DELETE CASCADE`, appropriate grants, and RLS. [Supabase User Management](https://supabase.com/docs/guides/auth/managing-user-data)

## `bookmarks`

```text
id UUID PK
user_id UUID FK
visualizer_id TEXT
created_at

UNIQUE(user_id, visualizer_id)
```

## `user_progress`

Preferred logical key:

```text
PK(user_id, visualizer_id)
```

with fields such as:

```text
status
first_seen_at
last_seen_at
completed_at
completion_count
updated_at
```

## `quiz_attempts`

```text
id UUID PK
user_id UUID FK
quiz_id TEXT
mode
started_at
submitted_at
score
max_score
duration_ms
```

## `quiz_attempt_answers`

```text
attempt_id UUID FK
question_id TEXT
selected_answer
is_correct
answered_at

PK(attempt_id, question_id)
```

## `daily_activity`

```text
user_id UUID FK
activity_date DATE
visualizer_completions INT
quiz_completions INT
learning_events INT
created_at

PK(user_id, activity_date)
```

---

# 16. Database Integrity Rules

Where applicable, every relation should have explicit:

```text
PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
CHECK
DEFAULT
INDEX
ON DELETE behavior
```

Examples:

```sql
CHECK (score >= 0)
CHECK (max_score > 0)
CHECK (score <= max_score)
UNIQUE (user_id, visualizer_id)
```

### Avoid

```text
comma-separated IDs
free-text foreign keys
repeated names in user-state tables
authoritative booleans controlled solely by clients
authoritative scores controlled solely by clients
JSON relationships that should be relational tables
redundant copies of category names
```

### Normalization principle

Normalize **identity and relationship data** while avoiding pathological over-normalization.

For example:

```text
visualizer_id → registry metadata
```

is preferable to repeating:

```text
visualizer_id
visualizer_title
category_name
category_label
visualizer_slug
```

through every user table.

---

# 17. Authentication Hardening

OWASP recommends keeping sensitive session credentials out of browser storage such as localStorage/sessionStorage because same-origin JavaScript can access them. [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

Audit and test:

```text
signup
email verification
login
OAuth callback
session refresh
expired session
logout
logout in another tab
password reset
account deletion
re-login after deletion
```

Also test:

```text
open redirect
OAuth callback allowlist
CSRF/state handling where applicable
session fixation
stale session reuse
privilege escalation
```

---

# 18. Quiz Security / Anti-Tampering

The client must not be authoritative for scoring.

Preferred flow:

```text
Question selection on server
        ↓
Question/options to client
        ↓
Answer submission
        ↓
Server validates attempt ownership
        ↓
Server evaluates correctness
        ↓
Server records result
        ↓
Server returns result
```

Protect against:

```text
duplicate submission
replay
changing attempt owner
changing score
changing max score
changing question IDs
submitting after an attempt is closed
answer-key exposure where it matters
rapid automated submissions
```

If answer keys are shipped entirely to the browser, treat them as extractable and do not claim strong anti-cheat guarantees.

---

# 19. Rate Limiting

Rate limiting is a **verification target**, not a confirmed current control.

At minimum consider limits for:

```text
login-related endpoints
password reset initiation
quiz submission
progress mutation
feedback/contact
search APIs if server-backed
admin operations
analytics ingestion if custom
```

Use route-appropriate limits rather than a single global threshold.

Possible keys:

```text
IP
user ID
route
session/device identifier
```

Avoid trusting a client-provided IP header without a trusted proxy configuration.

---

# 20. XSS & Content Security

OWASP notes that modern frameworks reduce many XSS risks through auto-escaping, but unsafe APIs can reintroduce vulnerabilities. [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

AlgoFlow contains code/explanation/content surfaces, so review all uses of:

```text
dangerouslySetInnerHTML
raw HTML renderers
markdown renderers
syntax-highlighted HTML
URL interpolation
query-parameter rendering
```

### Required pattern

```text
raw content
 ↓
trusted schema
 ↓
sanitize where HTML is intentionally allowed
 ↓
render
```

Do not use sanitization as an excuse to accept arbitrary executable HTML.

### CSP

Implement CSP as defense-in-depth after mapping actual dependencies.

Do not blindly copy a strict CSP that breaks:

- Supabase,
- OAuth,
- analytics,
- fonts,
- code highlighting,
- images,
- WebGL/Three.js resources.

---

# 21. Security Headers

Verify the deployed application for at least:

```text
Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
frame-ancestors/clickjacking protection
```

For Next.js, response headers can be configured using the official `headers` mechanism in `next.config`. [Next.js headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)

Do not consider presence of headers sufficient; validate their effective behavior.

---

# 22. GitHub Actions Security

This area is not source-verified yet, but the implementation target is concrete.

GitHub currently recommends:

- explicitly declaring minimal workflow permissions,
- pinning third-party Actions to full commit SHAs,
- restricting which Actions may run. [GitHub Actions security](https://docs.github.com/en/actions/reference/security/secure-use), [Protect against threats](https://docs.github.com/en/code-security/tutorials/secure-your-organization/protect-against-threats)

### Required baseline

```yaml
permissions:
  contents: read
```

Grant additional permissions only in the job that needs them.

### Avoid

```text
permissions: write-all
pull_request_target without a carefully designed trust model
unreviewed third-party actions
mutable Action tags for sensitive supply-chain steps
long-lived cloud credentials where OIDC can be used
secrets exposed to untrusted forked PR execution
```

### Artifact provenance

GitHub's current artifact attestation feature creates signed provenance claims that connect an artifact to repository/workflow/environment/commit context. Attestation improves provenance and integrity guarantees but is not a guarantee that the artifact itself is secure. [GitHub artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)

Use attestations for release artifacts where they provide practical value.

---

# 23. Target CI/CD Pipeline

```text
Pull Request
    │
    ├── Install dependencies
    ├── Lockfile validation
    ├── TypeScript typecheck
    ├── ESLint
    ├── Unit tests
    ├── Visualizer contract tests
    ├── Algorithm fixture tests
    ├── Dead-code/dependency checks
    ├── Secret scan
    ├── Dependency vulnerability scan
    ├── Database migration validation
    ├── Supabase/RLS integration tests
    ├── Production build
    ├── Accessibility checks
    ├── Playwright E2E
    └── Performance smoke
             │
             ▼
       Vercel Preview
             │
             ▼
      Preview smoke tests
             │
             ▼
        Branch protection
             │
             ▼
           staging
             │
             ▼
      protected production
```

Suggested workflow separation:

```text
.github/workflows/
├── ci.yml
├── security.yml
├── database.yml
├── e2e.yml
├── accessibility.yml
├── performance.yml
├── deploy-preview.yml
├── deploy-production.yml
└── dependency-update.yml
```

---

# 24. Dead Code / Duplication / AI-Code Smell Audit

These are **verification targets**, not current confirmed findings.

### Search for

```text
unused files
unused exports
unused dependencies
unused devDependencies
duplicate utilities
duplicate constants
duplicate metadata
duplicate components
duplicate hooks
duplicate routes
feature flags with no live consumer
stale comments
ignored TypeScript errors
unnecessary `any`
overuse of `useMemo`/`useCallback`
overly generic abstractions
large multi-responsibility files
```

Useful analysis tooling may include:

```bash
npx knip
npx tsc --noEmit
npm run lint
npm run build
npx jscpd .
```

Static findings must be validated before deletion.

### AI-generated-code indicators

No source-level claim that AlgoFlow is AI-generated is made here.

However, during repository review specifically inspect for patterns such as:

```text
three nearly identical services
three nearly identical hooks
one-off generic abstractions
boilerplate error handling repeated mechanically
large files with unrelated responsibilities
unused “future-proof” layers
comments describing obvious code instead of design intent
many `any` escapes
large duplicated constant registries
UI and backend independently implementing the same business rule
```

These are **engineering smells**, not proof of AI authorship.

The correct objective is to remove unnecessary redundancy, regardless of how the code was produced.

---

# 25. Navigation Architecture

Create typed route builders instead of scattering string literals:

```ts
export const routes = {
  home: () => '/',
  visualizers: () => '/visualizers',
  visualizer: (slug: string) => `/visualizer/${slug}`,
  learnings: () => '/learnings',
  quiz: (slug: string) => `/quizzes/${slug}`,
  dashboard: () => '/dashboard',
} as const
```

Every internal link should be testable.

### Route integrity test

For every internal route reference:

```text
path exists
path is intentional
no accidental homepage fallback
no stale path alias
no malformed dynamic segment
```

---

# 26. Learning Architecture

Make the primary learning loop explicit:

```text
Concept
  ↓
Learn
  ↓
Visualize
  ↓
Practice
  ↓
Quiz
  ↓
Mastery/progress
```

Every concept should be able to link bidirectionally or through an obvious pathway to:

- relevant visualizers,
- quizzes,
- problem sets,
- prerequisite concepts,
- next concepts.

The result should be a concept graph rather than disconnected content collections.

---

# 27. Content Governance

Recommended metadata contract:

```ts
interface ContentMeta {
  slug: string
  version: string
  status: 'published' | 'draft' | 'review'
  syllabusVersion?: string
  lastTechnicallyReviewedAt?: string
  lastEditoriallyReviewedAt?: string
  reviewer?: string
}
```

CI should verify:

```text
[ ] required metadata exists
[ ] review date is parseable
[ ] route exists
[ ] referenced visualizer exists
[ ] referenced quiz exists
[ ] no stale generated count
```

---

# 28. Accessibility Validation Plan

The previous audit identified these as unresolved runtime checks:

- keyboard access,
- visible focus,
- canvas alternatives,
- color-independent state communication,
- reduced motion,
- 200% zoom/reflow,
- dynamic announcements.

These remain verification targets unless actual browser testing has since been run.

W3C's WCAG material requires a visible keyboard-focus mode, and WCAG 2.2 also includes requirements around focus not being obscured. [W3C Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible), [W3C WCAG 2.2 changes](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

W3C guidance also discusses reflow and the interaction of zoom/sticky content with accessible operation. [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)

### Test matrix

```text
keyboard only
visible focus
screen reader
200% zoom
narrow mobile width
reduced motion
color-only state removal
live announcements
canvas alternative
modal focus
focus return
sticky overlays
```

### Canvas rule

Important algorithm information should have an accessible textual/semantic representation independent of pixels.

---

# 29. Performance Validation Plan

No invented Lighthouse/Core Web Vitals numbers should be used as a production fact.

Measure representative surfaces:

```text
/
/visualizers
/visualizer/bubble-sort
/learnings
/representative-learning-chapter
/quizzes/representative
/dashboard
```

Measure:

```text
LCP
INP
CLS
TBT
JavaScript payload
hydration time
initial render
visualizer boot time
step transition latency
memory growth
```

### Interactive performance matters

Do not stop at page-load tests. Explicitly test:

```text
play
pause
step
reset
speed changes
scrubbing
large inputs
dense graphs
deep trees
repeated mount/unmount
```

---

# 30. Complete Test Suite

## 30.1 Unit Tests

### Domain/algorithm

```text
algorithm correctness
input validation
step generation
final-state calculation
termination
complexity metadata
edge cases
```

### UI/domain helpers

```text
filters
sorting/search helpers
quiz scoring
streak calculations
progress calculations
route builders
formatters
```

---

## 30.2 Visualizer Contract Tests

Every registered algorithm must be tested against the registry contract.

---

## 30.3 Integration Tests

```text
Supabase repository methods
authentication/profile creation
progress persistence
bookmark persistence
quiz attempt persistence
activity aggregation
account deletion
```

---

## 30.4 Security Tests

```text
RLS isolation
IDOR
cross-user reads
cross-user writes
privilege escalation
admin boundary
secret exposure
XSS
CSRF/open-redirect scenarios where applicable
rate limits
replay protection
duplicate submissions
session expiry/logout behavior
```

---

## 30.5 E2E Tests

### Guest

```text
home
library/category
visualizer
learning chapter
quiz
404
legal pages
```

### Authenticated

```text
signup
verification
login
OAuth
logout
dashboard
bookmark
progress
quiz attempt
history
settings
delete account
```

---

## 30.6 Accessibility Tests

Automated:

```text
axe
heading structure
labels
landmarks
contrast
ARIA
```

Manual/runtime:

```text
keyboard
screen reader
focus
zoom
reflow
reduced motion
canvas alternative
```

---

## 30.7 Visual Regression Tests

Start with representative categories rather than snapshotting all visualizers blindly.

```text
Array
Linked List
Stack
Queue
Tree
Graph
Hash
Matrix
String
```

Test states:

```text
default
playing
paused
step
completed
invalid input
mobile
desktop
```

---

# 31. Database Migration Strategy

All schema changes should be versioned migrations.

Preferred process:

```text
Requirement
 ↓
Schema/constraint design
 ↓
Migration
 ↓
Seed/update data
 ↓
RLS/grants
 ↓
Database tests
 ↓
Application changes
 ↓
Integration tests
 ↓
Deploy
```

Do not make manual production database edits that cannot be reconstructed from repository migrations.

---

# 32. Observability

Minimum production observability target:

```text
Sentry or equivalent error monitoring
structured server logs
request/correlation ID
DB error classification
auth security events
admin audit events
performance telemetry
```

Never log:

```text
passwords
access tokens
refresh tokens
secret keys
OAuth secrets
unnecessary sensitive user data
```

---

# 33. Phased Implementation Plan

## Phase P0 — Correctness and Security Foundation

**Goal:** eliminate the highest-risk consistency/security unknowns.

### Work

1. Build canonical visualizer registry.
2. Derive counts everywhere.
3. Fix 137/138 drift.
4. Fix invalid footer destinations.
5. Fix library/homepage taxonomy mismatch.
6. Add route-integrity tests.
7. Add visualizer contract tests.
8. Add algorithm final-state fixtures.
9. Add source-map synchronization tests.
10. Inventory environment variables.
11. Scan repository for secrets.
12. Inspect all Supabase tables/policies/grants.
13. Verify cross-user isolation.
14. Verify score authority.
15. Verify account deletion.
16. Correct privacy/security wording.
17. Remove unsupported HIPAA/security claims unless evidence exists.

### Exit criteria

```text
zero count drift
zero known broken internal links
all published visualizers pass contract tests
RLS tests pass for every user-owned table
no server secret is client-accessible
quiz score cannot be forged client-side
```

---

## Phase P1 — Architecture Hardening

**Goal:** establish maintainable boundaries.

### Work

1. Separate domain logic from components.
2. Introduce service/repository boundaries.
3. Centralize validation.
4. Centralize route builders.
5. Normalize user-state schema where needed.
6. Add explicit DB constraints.
7. Harden authentication/session handling.
8. Implement route-specific rate limiting where justified.
9. Implement role-based admin authorization.
10. Harden storage policies.
11. Implement security headers/CSP.
12. Add structured errors.
13. Add Sentry/observability.
14. Add database integration test environment.
15. Add automated RLS tests.

### Exit criteria

```text
security boundary clearly defined
business rules have one authoritative layer
DB constraints enforce core invariants
admin access is explicit
production errors are observable
```

---

## Phase P2 — Product & Learning Quality

**Goal:** improve the learning system without adding random feature volume.

### Work

1. Progressive learning chapters.
2. Explicit Learn → Visualize → Practice → Quiz connections.
3. Stronger quiz explanations.
4. Better mastery/progress mapping.
5. Mobile visualizer optimization.
6. Runtime performance profiling.
7. Search/filter improvements.
8. Content review metadata.
9. Automated curriculum integrity checks.
10. Accessibility improvements.

---

## Phase P3 — Cleanup & Polish

**Goal:** reduce technical debt after correctness is stable.

### Work

1. Remove dead files.
2. Remove unused dependencies.
3. Remove duplicate components.
4. Simplify unnecessary abstractions.
5. Improve naming consistency.
6. Reduce unnecessary client components.
7. Reduce hydration footprint.
8. Optimize code splitting.
9. Improve error boundaries.
10. Improve developer documentation.

---

# 34. Production Acceptance Criteria

AlgoFlow should be treated as production-hardened only when all of the following are true.

## Product/data consistency

```text
[ ] One canonical visualizer registry
[ ] All public counts derive from registry
[ ] Legal pages derive current product facts
[ ] No broken global links
[ ] No duplicate visualizer slugs
[ ] No orphan quiz mappings
[ ] No orphan learning mappings
```

## Algorithm engine

```text
[ ] Every published visualizer satisfies the engine contract
[ ] Edge-case fixtures pass
[ ] Final states are correct
[ ] Execution steps are deterministic
[ ] Code highlighting has explicit mapping
[ ] Visual state and code state remain synchronized
```

## Database/security

```text
[ ] Every user-owned table has tested RLS
[ ] Grants are least privilege
[ ] Cross-user access tests pass
[ ] Views/functions have been reviewed
[ ] Storage policies are tested
[ ] Secret keys are server-only
[ ] Legacy Supabase keys are migrated or intentionally tracked during transition
[ ] Admin authorization is server-authoritative
[ ] Quiz scoring is server-authoritative
[ ] Rate limits are implemented where required
[ ] Account deletion is tested
```

## CI/CD

```text
[ ] Typecheck
[ ] Lint
[ ] Unit tests
[ ] Integration tests
[ ] RLS/security tests
[ ] E2E
[ ] Accessibility
[ ] Build
[ ] Secret scanning
[ ] Dependency scanning
[ ] Action permissions minimized
[ ] Third-party Actions pinned
[ ] Production environment protected
[ ] Migration validation
```

## Accessibility

```text
[ ] Keyboard operation
[ ] Visible focus
[ ] Focus not obscured
[ ] Screen reader smoke tests
[ ] Canvas semantic alternative
[ ] Reduced motion
[ ] 200% zoom/reflow
[ ] Color is not sole state indicator
```

## Performance

```text
[ ] Representative pages measured
[ ] Core Web Vitals recorded
[ ] Interactive latency measured
[ ] Large-input stress tests pass
[ ] Memory-growth tests pass
```

## Governance

```text
[ ] Privacy policy matches implementation
[ ] Cookie/storage inventory matches runtime
[ ] Technical claims have evidence
[ ] Content review dates are trustworthy
[ ] No unsupported compliance claim
```

---

# 35. Repository-Level Verification Protocol When Direct Access Is Available

This is the exact order to use once the GitHub source is connected.

## Step 1 — Repository inventory

Collect:

```text
full tree
package.json
lockfile
next.config.*
tsconfig
eslint config
vitest/jest config
playwright config
.github/workflows/*
supabase/*
.env.example
README/docs
```

## Step 2 — Runtime dependencies

Identify:

```text
framework versions
React version
Next.js version
Supabase SDK version
UI/animation libraries
syntax-highlighting libraries
analytics
monitoring
state management
```

## Step 3 — Code graph

Build a reference map of:

```text
routes → components → hooks → services → repositories → DB
```

## Step 4 — Dead-code analysis

Run:

```bash
npx knip
npx tsc --noEmit
npm run lint
npm run build
npx jscpd .
```

Manually validate all reported dead code before deletion.

## Step 5 — Visualizer inventory

Compare:

```text
filesystem registry
routes
renderer registry
category metadata
quiz mappings
learning mappings
```

## Step 6 — Supabase inventory

Inspect:

```text
tables
columns
PK/FK
indexes
unique constraints
check constraints
views
functions
triggers
roles/grants
RLS policies
storage buckets
storage policies
auth configuration
```

## Step 7 — Security review

Search for:

```text
secret keys
service-role usage
localStorage token usage
dangerouslySetInnerHTML
unvalidated SQL/RPC input
client-side authorization
role checks
hardcoded admin identity
raw HTML
URL redirects
unrestricted DB reads
```

## Step 8 — CI review

Inspect:

```text
workflow permissions
checkout behavior
third-party Action references
secrets availability
fork PR behavior
deployment environments
production approvals
cache trust
artifact handling
```

## Step 9 — Tests

Create a matrix connecting each discovered route/feature to its unit, integration, E2E, security, accessibility, and performance coverage.

---

# 36. Specific Questions the Source Audit Must Answer

When the repository and Supabase project become directly readable, the next audit should answer these with evidence, not assumptions.

### Frontend

```text
Which components are duplicated?
Which components are never imported?
Which hooks have stale dependencies?
Which effects lack cleanup?
Are there hydration hazards?
Are animations leaking listeners/timers?
Are heavy libraries dynamically loaded?
Which pages are unnecessarily client components?
Are route strings duplicated?
Are loading/error/empty states consistent?
```

### Visualizer engine

```text
Does every renderer implement the same contract?
Are algorithms deterministic?
Can a malformed input crash a visualizer?
Are step arrays unnecessarily copied?
Are large traces causing memory pressure?
Does playback create timers that are always cleaned up?
Can fast input changes race with playback state?
Can reset occur during an active transition?
Are code highlights based on explicit mapping?
```

### Backend

```text
Are all mutations validated server-side?
Are authorization decisions server-side?
Are any user IDs accepted directly from the client?
Can a user update another user's row?
Can a user change their own role?
Can a user forge quiz score/completion?
Can a user replay a mutation indefinitely?
Are errors leaking internal details?
```

### Database

```text
What are the actual tables?
Which are user-owned?
Which tables have RLS?
Which have missing/overbroad policies?
Which grants exist?
Are there duplicate representations of the same entity?
Which FK relationships lack cascade behavior?
Which columns have no useful indexes?
Are there redundant denormalized fields?
Are there views that expose protected rows?
Are SECURITY DEFINER functions reviewed?
```

### CI/CD

```text
Do workflows run with excessive permissions?
Are Actions pinned?
Can forked PR code receive secrets?
Is production deployment protected?
Do migrations run automatically?
Does CI test the database?
Are security scans blocking on meaningful severities?
Are preview deployments tested?
```

---

# 37. What Should Not Be Done

Avoid these remediation mistakes.

### Do not rewrite the entire application merely to improve structure

Preserve working product functionality while refactoring boundaries.

### Do not move all content into the database without a reason

Static educational content can remain code/content-managed unless an editor workflow genuinely requires a CMS.

### Do not duplicate business rules in UI and backend

The domain/server layer must be authoritative.

### Do not rely on RLS alone for privileged server operations

A secret key bypasses RLS. Server code using elevated access must perform explicit authorization.

### Do not call localStorage secure storage

It is persistent client-side storage, not a credential vault.

### Do not claim “secure”, “HIPAA compliant”, “SOC2 compliant”, “anti-cheat”, or similar guarantees without evidence

Claims must map to deployed controls.

### Do not label AI-looking code as proof of AI authorship

Refactor actual engineering problems rather than attempting to detect authorship from appearance alone.

---

# 38. Final Architecture Target

```text
                         ┌──────────────────────────┐
                         │ Canonical Content Model  │
                         │ + Visualizer Registry    │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │ Domain / Visualizer      │
                         │ Execution Engine         │
                         └────────────┬─────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                ▼                     ▼                     ▼
          Visualizer                Quiz                 Learning
                │                     │                     │
                └─────────────────────┼─────────────────────┘
                                      ▼
                         ┌──────────────────────────┐
                         │ Next.js Server Boundary  │
                         │ Validation + AuthZ       │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │ Supabase/Postgres        │
                         │ Constraints + RLS        │
                         └────────────┬─────────────┘
                                      │
                    ┌─────────────────┼──────────────────┐
                    ▼                 ▼                  ▼
                 User data         Auth             Observability
```

The architectural objective is simple:

> **One source of truth + deterministic execution + server-authoritative mutations + database-enforced ownership + automated regression control.**

---

# 39. Validation Summary

| Finding/area | Final status |
|---|---|
| 138 vs 137 count drift | **Confirmed prior audit finding** |
| Footer link destination problem | **Confirmed prior audit finding** |
| Homepage taxonomy mismatch | **Confirmed prior audit finding** |
| Curriculum review metadata drift | **Confirmed prior audit finding** |
| Complexity-threshold wording | **Confirmed prior audit finding; technical interpretation valid** |
| Pointer-chasing wording | **Confirmed prior audit finding; technical interpretation valid** |
| Boolean representation wording | **Confirmed prior audit finding; technical interpretation valid** |
| UTF-8 wording | **Confirmed and independently validated** |
| 10^8 ops heuristic | **Confirmed prior finding; requires qualification** |
| Directed/undirected cycle detection wording | **Confirmed prior finding; algorithm distinction valid** |
| GA4 “anonymous” wording | **Confirmed copy issue; independently validated as over-categorical** |
| localStorage “secure” wording | **Confirmed copy issue; independently validated as unsafe terminology** |
| Privacy Shield reference | **Confirmed stale terminology; current EU DPF source verified** |
| Supabase HIPAA blanket claim | **Confirmed copy issue; current Supabase scope verified** |
| TLS/RLS/rate-limit/anti-cheat claims | **Unverified until deployment controls are inspected** |
| Cookie/storage exhaustiveness | **Unverified runtime claim** |
| Visualizer loading stages | **Previously observed; performance impact needs measurement** |
| Quiz feedback quality | **Unverified beyond initial route behavior** |
| Curriculum density | **Confirmed prior UX observation** |
| Mental Math IA competition | **Confirmed prior IA concern** |
| Actual source-level unused files | **Unverified** |
| Actual duplicated components | **Unverified** |
| Actual AI-generated code patterns | **Unverified** |
| Actual Supabase RLS correctness | **Unverified** |
| Actual DB normalization/integrity | **Unverified** |
| Actual CI workflow security | **Unverified** |
| Actual security headers | **Unverified runtime/deployment** |
| Actual Core Web Vitals | **Unverified measurement** |

---

# 40. Final Engineering Decision

**Retain the existing AlgoFlow product and harden it in place.**

The correct sequence is:

```text
1. Establish source of truth
2. Prove algorithm correctness
3. Prove database ownership/security
4. Stabilize backend boundaries
5. Establish automated regression testing
6. Correct educational/privacy claims
7. Measure runtime performance/accessibility
8. Remove dead/duplicated code
9. Optimize UX and learning flow
10. Polish after correctness is stable
```

The product's biggest long-term risk is not feature shortage. It is **drift**: duplicated facts, duplicated business rules, duplicated metadata, untested assumptions, and security claims that may outpace actual controls.

The implementation should therefore optimize for **internal consistency, deterministic behavior, security-by-enforcement, and regression resistance**.

---

# 41. Authoritative Validation References

These references were used to validate the technical interpretations in this document.

1. **Supabase — Row Level Security**  
   https://supabase.com/docs/guides/database/postgres/row-level-security

2. **Supabase — API Keys**  
   https://supabase.com/docs/guides/getting-started/api-keys

3. **Supabase — Migrating to publishable/secret keys**  
   https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys

4. **Supabase — User Management**  
   https://supabase.com/docs/guides/auth/managing-user-data

5. **Supabase — Views and RLS**  
   https://supabase.com/docs/guides/database/views

6. **Supabase — HIPAA Compliance**  
   https://supabase.com/docs/guides/security/hipaa-compliance

7. **Supabase — Shared Responsibility Model**  
   https://supabase.com/docs/guides/deployment/shared-responsibility-model

8. **Google Analytics — Data Collection**  
   https://support.google.com/analytics/answer/11593727

9. **Google Analytics — Device ID**  
   https://support.google.com/analytics/answer/9356035

10. **OWASP — Session Management**  
    https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

11. **OWASP — HTML5 Security**  
    https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html

12. **OWASP — Cross-Site Scripting Prevention**  
    https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

13. **GitHub — Secure use of GitHub Actions**  
    https://docs.github.com/en/actions/reference/security/secure-use

14. **GitHub — Protect against threats / Actions hardening**  
    https://docs.github.com/en/code-security/tutorials/secure-your-organization/protect-against-threats

15. **GitHub — Artifact attestations**  
    https://docs.github.com/en/actions/concepts/security/artifact-attestations

16. **Next.js — Response headers**  
    https://nextjs.org/docs/app/api-reference/config/next-config-js/headers

17. **W3C — Focus Visible**  
    https://www.w3.org/WAI/WCAG22/Understanding/focus-visible

18. **W3C — WCAG 2.2 changes**  
    https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

19. **W3C — Reflow**  
    https://www.w3.org/WAI/WCAG22/Understanding/reflow.html

20. **Unicode — UTF-8 encoding form**  
    https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/

21. **European Commission — Adequacy Decisions / EU-US Data Privacy Framework**  
    https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en

---

# 42. Evidence Source for Prior AlgoFlow Findings

The confirmed AlgoFlow-specific findings in this document are based on the saved internal audit artifact:

**`AlgoFlow_Deep_Audit_Report_2026-09-23.md`**

The saved audit itself states that public inventory totaled 138, identified the stale 137 legal count, recorded the footer-link problem, identified taxonomy/content inconsistencies, and explicitly marked backend/security/runtime controls such as RLS enforcement, Core Web Vitals, security headers, rate limiting, anti-cheat, authenticated flows, and account deletion as verification gaps.

This distinction is intentional: a validated engineering document is more useful when it clearly separates **observed defects**, **validated technical interpretation**, and **required future verification** than when it fills missing evidence with assumptions.
