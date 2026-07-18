# Frontend redesign route inventory

Last verified: 2026-07-18 on branch `chore/production-readiness` at baseline commit `0eac5af` plus the preserved working tree.

## Architecture summary

Algo Flow is a Next.js 16.2.10 App Router application. Pages live under `src/app`, shared UI under `src/components`, visualizer implementations under `src/visualizers`, catalog metadata under `src/data/seed`, Zustand owns playback state, and Supabase server/client helpers own authenticated persistence. The canonical publication surface is the intersection validated by `publicationRegistry`: 105 published catalog entries, 105 registered implementations, ten renderer/control families, and four required code languages.

`design.md` was not present anywhere in the supplied repository. The attached brief's explicit palette, typography, elevation, accessibility, and motion requirements are therefore the token authority. The Stitch URL was opened but its iframe did not expose a stable inspectable render in the available browser session; this is recorded as a reference limitation, not silently inferred.

## Static and dynamic routes

| Route | Source | Access | Purpose / data | Shared UI | Baseline condition | Redesign | Test |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | Public | Product landing; catalog-derived counts | Navbar, Footer, landing sections | Hydration gate could leave a blank first render | Complete | Browser + route smoke |
| `/visualizers` | `src/app/visualizers/page.tsx` | Public | Search/filter all published data structures and algorithms | Navbar, Footer, cards/forms | Dark UI and weaker filtering hierarchy | Complete | Browser + route smoke |
| `/visualizers/[category]` | `src/app/visualizers/[category]/page.tsx` | Public | Ten category pages from seed/catalog data | Navbar, Footer, filter/card primitives | Inconsistent cards and filters | Complete | Ten-category generation + smoke |
| `/visualizer/[slug]` | `src/app/visualizer/[slug]/page.tsx` | Public; persistence actions degrade for guests | 105 algorithm workspaces from registry, Zustand, feature APIs | VisualizerLayout, controls, renderers, code/learning panels | Reset could produce misleading playback behavior; placeholder fallbacks | Complete | 105-slug registry + Playwright suite |
| `/dashboard` | `src/app/dashboard/page.tsx` | Protected; redirects guests to `/login` | Supabase profile, streak, progress, bookmarks, sessions, activity, challenge | Navbar, Footer, cards | Functional protected route with old visual surface | Complete through shared system | Redirect smoke; authenticated content requires credentials |
| `/login` | `src/app/(auth)/login/page.tsx` | Public | Supabase password authentication | AuthShell, PasswordField, Navbar, Footer | Old dark form; redirect intent supported | Complete | Browser + form smoke |
| `/signup` | `src/app/(auth)/signup/page.tsx` | Public | First name, last name, gender, email, password, confirmation | AuthShell, PasswordField | Required fields present; visual hierarchy inconsistent | Complete | Browser + form smoke |
| `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | Public | Supabase reset email | AuthShell | Old dark form | Complete | Route smoke |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | Public with recovery session | Supabase password update | AuthShell, PasswordField | Old dark form | Complete | Route smoke; token completion requires email flow |
| `/verify-email` | `src/app/(auth)/verify-email/page.tsx` | Public | Verification guidance/status | AuthShell | Old dark status UI | Complete | Route smoke |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Public callback | Exchanges Supabase auth code and preserves safe internal `next` | None | Backend route; no visual surface | Preserved | Build/type contract |
| `/quizzes/[algorithmId]` | `src/app/quizzes/[algorithmId]/page.tsx` | Public; persistence degrades for guests | Algorithm quiz and progress APIs | Navbar, Footer, QuizClient | Existing functionality, old tokens | Complete through shared system | Representative link/route smoke |
| `/privacy` | `src/app/privacy/page.tsx` | Public | Legal content | Navbar, Footer | Old theme; stale date | Complete | Route smoke |
| `/terms` | `src/app/terms/page.tsx` | Public | Legal content | Navbar, Footer | Old theme; stale date | Complete | Route smoke |
| not found | `src/app/not-found.tsx` | Public | Missing route recovery | Shared token layer | Old theme | Complete | Next route behavior |
| loading | `src/app/loading.tsx` | Public | App loading state | Shared token layer | Existing | Complete through tokens | Build + browser |
| route error | `src/app/error.tsx` | Public | Recoverable route error | Shared token layer | Existing | Complete through tokens | Build/type contract |
| global error | `src/app/global-error.tsx` | Public | Root recovery UI | Standalone | Existing | Complete through tokens | Build/type contract |

Category values generated by `generateStaticParams` are `array`, `linked-list`, `stack`, `queue`, `tree`, `graph`, `hash-table`, `hash-set`, `matrix`, and `string`. Counts are derived at runtime from published catalog data: Array 32, Stack 7, Linked List 10, Tree 9, Graph 2, Hash Table 12, Matrix 11, String 11, Queue 6, Hash Set 5.

## Programmatic visualizer inventory

Source of truth: `algorithms.filter(algorithm => algorithm.isPublished)` joined to `algorithmRegistry` and `publicationRegistry`. The inventory command was executed with `npx tsx`; registry validation independently reports 105 catalog entries and 105 implementations.

Published slugs (105):

`access-by-index`, `random-access`, `forward-traversal`, `reverse-traversal`, `range-traversal`, `insert-beginning`, `insert-end`, `insert-index`, `delete-beginning`, `delete-end`, `delete-index`, `delete-value`, `update-by-index`, `update-by-value`, `merge-sorted-arrays`, `reverse-array`, `left-rotation`, `right-rotation`, `remove-duplicates`, `linear-search`, `binary-search`, `jump-search`, `interpolation-search`, `bubble-sort`, `selection-sort`, `insertion-sort`, `merge-sort`, `quick-sort`, `heap-sort`, `counting-sort`, `radix-sort`, `stack-push`, `stack-pop`, `sll-traversal`, `sll-search`, `sll-insert-head`, `sll-insert-tail`, `sll-delete`, `inorder-traversal`, `preorder-traversal`, `postorder-traversal`, `level-order-traversal`, `bst-insertion`, `bst-search`, `bfs`, `dfs`, `chaining-insert`, `chaining-search`, `chaining-delete`, `probing-insert`, `probing-search`, `probing-delete`, `row-wise-traversal`, `col-wise-traversal`, `matrix-search`, `matrix-row-traversal`, `spiral-traversal`, `row-column-sorted-search`, `transpose-matrix`, `rotate-matrix-90`, `matrix-multiplication`, `matrix-addition`, `matrix-subtraction`, `string-forward-traversal`, `string-reverse-traversal`, `string-palindrome`, `string-naive-search`, `string-kmp-search`, `string-rabin-karp`, `reverse-string`, `string-insert`, `string-delete`, `string-replace`, `string-change-case`, `access`, `array-stack`, `stack-peek`, `stack-is-empty`, `stack-is-full`, `stack-size`, `simple-queue`, `circular-queue`, `queue-enqueue`, `queue-dequeue`, `queue-peek`, `queue-front-rear`, `linked-list-types`, `sll-insert-position`, `sll-delete-head`, `sll-reverse`, `sll-detect-cycle`, `heap-insert`, `trie-insert-word`, `build-segment-tree`, `division-hash-method`, `hash-insert`, `hash-search`, `hash-delete`, `linear-probing`, `rehashing`, `hash-set-insert`, `hash-set-search`, `hash-set-delete`, `set-union`, `set-intersection`.

## Route acceptance contract

- Existing slugs, auth callbacks, Supabase calls, algorithm generators, and public interfaces remain intact.
- Every public visualizer must initialize at `Step 1 / N` where `N > 0`; unavailable canvases are test failures, not accepted placeholders.
- Guest access must not break the learning surface when persistence is unavailable.
- Dashboard remains protected and preserves its `/login` redirect.
- Internal navigation uses real routes only; provider buttons are hidden when configuration cannot be proven.
- Desktop and mobile layouts retain 44px controls, focus visibility, semantic labels, reduced-motion behavior, and readable contrast.

