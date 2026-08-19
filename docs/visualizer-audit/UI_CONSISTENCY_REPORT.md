# Algo Flow — UI Consistency & Design System Audit Report

Date: **2026-08-19**

## 1. Layout & Alignment Rules

All visualizer workspace pages follow a strict 8-part UI layout hierarchy:
1. **Primary Header**: Visualizer title, category breadcrumb, difficulty badge (`easy`/`medium`/`hard`), priority badge (`P0`/`P1`/`P2`)
2. **Control Bar**: Primary input group -> Secondary input group -> Apply/Build -> Presets -> Playback -> Speed -> Progress
3. **Canvas Workspace**: High-contrast visual renderer with responsive SVG/Canvas container
4. **Legend Strip**: Color-coded badges for visual states (`Current`, `Compared`, `Swapped`, `Visited`, `Found`, `Sorted`, `Error`, `Pointer`)
5. **Pseudocode Panel**: Active line highlighting synced to `currentStepIndex`
6. **Multi-Language Code Panel**: Tabs for JavaScript, Python, C++, Java synced via `CodeLineMapping`
7. **Explanation & Variable Panel**: Natural language step explanation and variable state inspection table
8. **Step Log Panel**: Interactive log history allowing jump-to-step on click

## 2. Tested Responsive Breakpoints

| Breakpoint | Target Device | Audit Status |
|---|---|---|
| **360 px** | Mobile (Small - iPhone SE) | ✅ Pass (Wrapped controls, scrolling canvas) |
| **390 px** | Mobile (Standard - iPhone 14) | ✅ Pass |
| **768 px** | Tablet (Portrait - iPad) | ✅ Pass (Stacked code & explanation) |
| **1024 px** | Tablet (Landscape / Small Laptop) | ✅ Pass |
| **1280 px** | Desktop (Standard) | ✅ Pass (Side-by-side workspace) |
| **1440 px** | Desktop (Large) | ✅ Pass |
| **1920 px** | Desktop (Full HD) | ✅ Pass |

## 3. High-Contrast Visual State Legend

Visual states are distinguishable via both distinct colors and accessible labels:
- **Current / Active**: Primary Blue (`#3B82F6` / `bg-primary`)
- **Compared**: Amber / Yellow (`#F59E0B` / `bg-warning`)
- **Swapped / Inserted**: Purple (`#8B5CF6` / `bg-purple-500`)
- **Visited / Path**: Cyan (`#06B6D4` / `bg-cyan-500`)
- **Found / Success / Sorted**: Emerald Green (`#10B981` / `bg-success`)
- **Error / Invalid / Overflow**: Rose Red (`#F43F5E` / `bg-error`)
- **Pointer**: Indigo Pointer Arrow / Badge (`#6366F1`)
