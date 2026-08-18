# Algo Flow — Architectural Design Decisions (ADR)

## Decision 1: Consolidation into Exactly Two Themes (Light & Dark)
- **Context**: The existing application used four theme preferences (`light-edu`, `dark-neon`, `nature-cinematic`, `system`) which caused design fragmentation, inconsistent contrast, and broken color references in components.
- **Decision**: Standardize on **Light Neumorphic** and **Dark Neumorphic**. In `ThemeProvider.tsx`, the system preference maps cleanly to `light` or `dark` based on the user's OS preference (`prefers-color-scheme`). Remove all third theme options from the UI.
- **Consequence**: Both themes become first-class, fully tested, accessible design environments with zero stray colors or inverted backgrounds.

---

## Decision 2: Accessible Neumorphism with 1px Structural Boundaries
- **Context**: Pure neumorphism (shadows with zero borders) often suffers from low contrast and poor boundary definition, failing accessibility guidelines (WCAG 2.2 AA).
- **Decision**: Combine soft dual-direction shadows with explicit 1px semi-transparent borders (`border: 1px solid var(--border)` or `border: 1px solid rgba(255, 255, 255, 0.8)`). Interactive surfaces feature clear active, hover, and focus ring states (`outline: 2px solid var(--border-focus); outline-offset: 2px;`).
- **Consequence**: Delivers a rich, tactile, physical feel while maintaining razor-sharp contrast and accessibility compliance.

---

## Decision 3: Multi-Panel Visualizer Layout Architecture
- **Context**: Visualizers contain multiple concurrent data streams: canvas animation, step description, step log, speed control, timeline scrubber, custom input generator, pseudocode highlight, and multi-language source code.
- **Decision**: Structure the visualizer screen as an IDE-style workstation:
  - Header: Breadcrumbs, metadata badges, quick actions (Quiz, Practice, Bookmark, Save, Share, Fullscreen).
  - Main Area: Flex split between the Interactive Canvas (with controls & legend above) and the Tabbed Right Inspector (Pseudocode/Code and Explanation/Step Log).
  - Bottom Dock: Tactile playback transport controls, interactive timeline scrubber, and speed multiplier.
- **Consequence**: Maximizes canvas viewing area on both desktop and mobile while keeping synchronized code and explanations instantly accessible.

---

## Decision 4: Non-Destructive Presentation Refactoring
- **Context**: Algo Flow contains 133 carefully tested algorithm implementations, step generators, code examples in 4+ languages, and Supabase database interactions.
- **Decision**: Complete overhaul of the visual and component layers without modifying the mathematical algorithm logic, step generation invariants, or API contracts.
- **Consequence**: 100% preservation of test passing status across all 25 test suites (797 tests).
