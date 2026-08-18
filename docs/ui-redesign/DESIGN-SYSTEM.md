# Algo Flow — Design System Specification (v2.0)

## 1. Design Philosophy: Tactile Developer Workstation

Algo Flow's design system is engineered around the concept of a **tactile developer workstation**. It combines the precision and density of modern IDEs with the visual delight and intuitive depth of modern tactile neumorphism.

### Core Pillars
1. **Mathematical Spatial Rhythm**: 4px/8px modular grid scale.
2. **Accessible Neumorphism**: Subtle dual-direction lighting with crisp 1px structural borders and AAA-level text contrast.
3. **Strict Two-Theme Architecture**: Light Neumorphic (Studio Slate & Jade) and Dark Neumorphic (Obsidian Carbon & Cyber Jade).
4. **Information Density without Visual Clutter**: Tight, deliberate padding, tabular numbers, and clear typographic hierarchy.

---

## 2. Semantic Token Reference

### A. Color & Surface Tokens

| Token | Light Neumorphic | Dark Neumorphic | Description |
|---|---|---|---|
| `--bg-base` | `#F4F7F5` | `#0B0F13` | Root canvas background |
| `--bg-surface` | `#FFFFFF` | `#131920` | Primary raised card surface |
| `--bg-surface-raised` | `#FFFFFF` | `#182028` | Elevated floating panels |
| `--bg-surface-inset` | `#EAF0EC` | `#080C0F` | Recessed input fields, sliders & code wells |
| `--bg-surface-hover` | `#F0FDF4` | `#1B2631` | Hover state background |
| `--border` | `#DBE4DE` | `#222D37` | Standard component border |
| `--border-subtle` | `rgba(15, 23, 42, 0.06)` | `rgba(255, 255, 255, 0.06)` | Subtle dividers |
| `--border-focus` | `#16A34A` | `#22C55E` | Active focus indicator |
| `--text-primary` | `#0F172A` (Slate 900) | `#F1F5F9` (Slate 100) | Main heading & body text |
| `--text-secondary` | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Subtitles, descriptions |
| `--text-muted` | `#64748B` (Slate 500) | `#64748B` (Slate 500) | Captions, metadata, hints |
| `--primary` | `#15803D` | `#22C55E` | Primary brand accent |
| `--primary-hover` | `#166534` | `#16A34A` | Primary button hover |
| `--primary-muted` | `#DCFCE7` | `#14532D` | Primary pill background |
| `--secondary` | `#0F766E` | `#2DD4BF` | Secondary accent |
| `--success` | `#15803D` | `#22C55E` | Success states & Easy badges |
| `--warning` | `#B45309` | `#FBBF24` | Warning states & Medium badges |
| `--error` | `#B91C1C` | `#F87171` | Error states & Hard badges |

### B. Tactile Neumorphic Elevation Tokens

| Token | Light Specification | Dark Specification | Usage |
|---|---|---|---|
| `--neu-shadow-raised` | `6px 6px 16px rgba(15,23,42,0.06), -6px -6px 16px rgba(255,255,255,0.95)` | `8px 8px 20px rgba(0,0,0,0.65), -5px -5px 15px rgba(255,255,255,0.03)` | Standard cards, header, panels |
| `--neu-shadow-raised-sm` | `3px 3px 8px rgba(15,23,42,0.05), -3px -3px 8px rgba(255,255,255,0.9)` | `4px 4px 10px rgba(0,0,0,0.55), -3px -3px 8px rgba(255,255,255,0.025)` | Buttons, badges, small controls |
| `--neu-shadow-inset` | `inset 3px 3px 6px rgba(15,23,42,0.06), inset -3px -3px 6px rgba(255,255,255,0.9)` | `inset 3px 3px 8px rgba(0,0,0,0.75), inset -2px -2px 6px rgba(255,255,255,0.03)` | Input fields, code wells, track |
| `--neu-shadow-float` | `0 20px 50px rgba(15,23,42,0.12), 0 1px 0 rgba(255,255,255,0.8) inset` | `0 24px 60px rgba(0,0,0,0.8)` | Modals, dropdowns, hero preview |

### C. Typography Scale

- **Display 1**: `Manrope`, 56px - 72px / line-height: 1.05 / weight: 800 (Hero Headlines)
- **Display 2**: `Manrope`, 36px - 48px / line-height: 1.1 / weight: 800 (Page Titles)
- **Heading 1**: `Manrope`, 28px - 32px / line-height: 1.2 / weight: 700 (Section Headers)
- **Heading 2**: `Manrope`, 20px - 24px / line-height: 1.3 / weight: 700 (Card Titles)
- **Body Large**: `Inter`, 18px / line-height: 1.6 / weight: 400-500 (Hero Subtitles)
- **Body Regular**: `Inter`, 15px - 16px / line-height: 1.5 / weight: 400-500 (Default Body)
- **Body Small**: `Inter`, 13px - 14px / line-height: 1.4 / weight: 400-500 (Metadata & Controls)
- **Code / Monospace**: `JetBrains Mono`, 13px - 14px / line-height: 1.5 / weight: 500-700 (Code Lines, Time/Space Complexity)

### D. Motion Tokens
- Instant: `100ms cubic-bezier(0.2, 0, 0, 1)` (Button clicks, active toggles)
- Fast: `180ms cubic-bezier(0.2, 0.8, 0.2, 1)` (Hover transitions, border glows)
- Normal: `240ms cubic-bezier(0.16, 1, 0.3, 1)` (Drawer expand, panel collapse)
- Slow: `360ms cubic-bezier(0.22, 1, 0.36, 1)` (Card reveals, page entrances)
- *All motion gracefully collapses to 0.01ms under `prefers-reduced-motion: reduce`.*
