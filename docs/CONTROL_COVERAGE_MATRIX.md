# Control Coverage Matrix

> Status: UI-presence baseline. Functional and deterministic behavior remains unverified unless stated.

| Control | Present on deployed bubble sort | Verification |
|---|---|---|
| Play / pause | Yes | DOM and screenshot only |
| Previous / next | Yes | Initial disabled/enabled state observed |
| Restart / reset | Yes | Initial disabled state observed |
| Skip to end | Yes | DOM only |
| Timeline / current and total step | Yes | `Step 1 / 23` observed |
| Speed | Yes | 0.5x, 1x, 2x observed; duplicated button set exists in desktop DOM |
| Custom/random/sorted/reverse input | Yes | UI only |
| Explanation / step log | Yes | UI only |
| Pseudocode / code tabs | Yes | UI only |
| Practice mode | Yes | UI only |
| Reduced motion | Yes | UI only |
| Fullscreen | Yes | UI only |
| Keyboard shortcuts | Unknown | No documented or tested contract |
| Zoom/pan | Family-specific | Not audited |
| Copy code | Unknown | Not audited |

Structure-specific control components exist for array, graph, hash set, hash table, linked list, matrix, queue, stack, string, and tree; graph/tree also have editor modals. Applicability and end-to-end behavior must be recorded per public slug in Phase 3.

