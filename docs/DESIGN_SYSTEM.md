# Design System Baseline

> Status: current tokens only; visual redesign is not part of Phase 0.

## Current foundations

- Tailwind CSS 4 with CSS custom properties in `src/app/globals.css`.
- Dark default token set (`dark-neon`) and a separate `nature-cinematic` dark landing set.
- Semantic colors exist for surfaces, text, borders, feedback, and visualizer states.
- Shared primitives exist for buttons, cards, inputs, labels, popovers, switches, badges, and submit buttons.
- Reduced-motion CSS exists for both OS preference and `data-reduced-motion=true`.

## Blocking gaps

1. `ThemeProvider` resolves `light-edu`, but no `[data-theme="light-edu"]` token block exists. Light mode therefore is not implemented.
2. Theme preference is localStorage-only; authenticated cross-device persistence is not wired.
3. The provider hides the whole application until mount, which delays first visible content and can harm LCP.
4. Landing and app themes can compete (`nature-cinematic` versus provider-owned theme).
5. Typography, spacing, radius, motion, and z-index scales are not fully expressed as semantic tokens.

## Target token groups

Background/surface, text, border/divider, interactive, focus, feedback, visualization state, code highlighting, shadow/glow, radius, spacing, typography, motion, and z-index must be documented once and reused across both dark and light themes.

