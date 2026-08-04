# Accessibility Audit Baseline

> Target: WCAG 2.2 AA. Phase 0 evidence is limited to DOM inspection and screenshots at 1440x900 and 390x844; no axe, screen-reader, 200% zoom, or complete keyboard run was available.

## Observed positives

- One H1 is present on the sampled landing, catalog, and bubble-sort routes.
- The sampled documents did not horizontally overflow at 1440px or 390px.
- Icon-only visualizer buttons expose accessible names through title/ARIA in the sampled DOM.
- Reduced-motion CSS is present.
- Unknown routes return 404 and the protected dashboard redirects predictably.

## Findings requiring remediation or verification

| Severity | Finding |
|---|---|
| High | No skip-navigation link was observed in the sampled landing DOM. |
| High | Complex visualizations lack a verified text alternative and step-change live-region contract. |
| High | Mobile bubble-sort controls and array items wrap tightly; touch targets and logical tab order need manual verification. |
| Medium | Landing H1 accessible text concatenates `StructuresThrough` without whitespace in the DOM. |
| Medium | Full keyboard operation, focus trapping/restoration, and visible focus have not been tested. |
| Medium | Color contrast, non-color state cues, 200% zoom/reflow, and light-theme contrast are unverified. |
| Blocker | A complete light theme does not exist, so light-theme accessibility cannot pass. |

## Required next evidence

Run axe/Lighthouse accessibility, keyboard-only navigation, NVDA or equivalent screen-reader checks, 200% zoom, reduced-motion, and every required width from 320 through 1920 pixels.

