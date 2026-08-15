# PHASE 2 MASTER SPECIFICATION
## OS-Style Portfolio Website — Implementation Contract

**Version**: 1.0  
**Date**: 2026-08-15  
**Status**: Complete — Ready for Phase 3 Implementation

---

## Table of Contents

1. [Base OS Understanding](#1-base-os-understanding)
2. [Preserved Components](#2-preserved-components)
3. [Replaced Components](#3-replaced-components)
4. [Added Components](#4-added-components)
5. [Modified Components](#5-modified-components)
6. [Complete Component Hierarchy](#6-complete-component-hierarchy)
7. [Visual Specifications](#7-visual-specifications)
8. [Interaction Specifications](#8-interaction-specifications)
9. [Motion Specifications](#9-motion-specifications)
10. [Responsive Specifications](#10-responsive-specifications)
11. [Asset Requirements](#11-asset-requirements)
12. [State Architecture](#12-state-architecture)
13. [Technology Decision](#13-technology-decision)
14. [Integration Architecture](#14-integration-architecture)
15. [QA Requirements](#15-qa-requirements)
16. [Known Uncertainties](#16-known-uncertainties)
17. [Phase 3 Implementation Rules](#17-phase-3-implementation-rules)

---

## 1. Base OS Understanding

**Source**: irfannaikwade.in — macOS-style portfolio desktop environment.

The base OS provides a complete windowed desktop environment with:
- **Fixed viewport** (`100vw × 100vh`, `overflow: hidden`)
- **Layered z-index architecture** (wallpaper → desktop → windows → dock → overlays)
- **28px top menu bar** with dynamic app name, status tray, and live clock
- **Desktop icon grid** (`grid-flow-col`, 92px columns, 104px rows, 48×48 icons)
- **Floating windows** with glassmorphic chrome (`blur(28px) saturate(180%)`), traffic light controls (close/minimize/maximize), drag, resize, focus management
- **6 applications**: Terminal, Projects, About, Finder, Settings, Mail
- **Context menus**, **Spotlight search** (Cmd+K), **keyboard shortcuts**
- **Dark/Light theme** with localStorage persistence
- **Responsive system**: desktop (≥768px) → mobile bottom sheets (<768px)
- **Sound system**: procedural Web Audio synthesis for UI events

> **Full specification**: [base-site-reverse-engineering.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/base-site-reverse-engineering.md)

---

## 2. Preserved Components (KEEP — 16 components)

These components are reconstructed faithfully from the base OS without modification:

| Component | Purpose | Layer |
|-----------|---------|-------|
| DesktopCanvas | Root surface, click/right-click/marquee | z-10 |
| DesktopGrid | Auto-flow icon grid | z-10 |
| DesktopIcon | Launchable app shortcuts | z-10 |
| SelectionMarquee | Rubber-band multi-select | z-10 |
| WindowFrame | Floating window container | z-20–49 |
| TrafficLights | Close/minimize/maximize buttons | In WindowFrame |
| TopMenuBar | Dynamic menu bar | z-50 |
| ControlCenter | Settings popover | z-9995 |
| SpotlightSearch | Cmd+K command palette | z-9995 |
| ContextMenu | Right-click menus | z-9995 |
| TerminalApp | Interactive CLI | In Window |
| ProjectsApp | Project gallery | In Window |
| AboutApp | Bio/timeline/skills | In Window |
| FinderApp | File browser | In Window |
| MailApp | Contact form | In Window |
| MobileBottomSheet | iOS-style sheets (mobile) | Mobile |

---

## 3. Replaced Components (REPLACE — 2 components)

| Removed | Replacement | Source | Rationale |
|---------|-------------|--------|-----------|
| Base Dock (z-40, simple glassmorphic bar) | Luca Parabolic Dock (z-9990, Cosine Bell magnification, spring physics) | LUCA | User directive: `BASE TASKBAR → REMOVE \| LUCA TASKBAR → INTEGRATE` |
| Static Wallpaper-only Layer 0 | KineticHeroStage + Wallpaper (interactive typography behind glass) | MICHAL | User directive: integrate kinetic typography as living wallpaper |

> **Luca full spec**: [luca-taskbar-analysis.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/luca-taskbar-analysis.md)

---

## 4. Added Components (ADD — 18 components)

| Component | Source | Purpose | Layer |
|-----------|--------|---------|-------|
| KineticHeroStage | MICHAL | Full-bleed interactive typography wallpaper | z-0 |
| SplitText | MICHAL | Per-character particle physics | z-0 |
| AmbientHarmonicWave | MICHAL | Idle text oscillation | z-0 |
| KineticCursor | MICHAL | Dual-tier cursor controller | z-9999 |
| CursorPrecisionDot | MICHAL | 4px zero-lag dot | z-9999 |
| CursorAuraRing | MICHAL | 24-80px difference-blend ring | z-9999 |
| CursorStateMachine | MICHAL | Context-aware cursor FSM | Logic |
| DockTooltip | LUCA | Spring-animated label pills | z-9990 |
| DockDivider | LUCA | Section separators | z-9990 |
| MusicPlayerDockPill | NIDAL | Compact player in dock | z-9990 |
| AudioDeckExpandedCard | NIDAL | Full glassmorphic music player | z-9992 |
| VinylDiscAssembly | NIDAL | Spinning vinyl with art | z-9992 |
| AudioVisualizerCanvas | NIDAL | FFT frequency bars | z-9992 |
| InteractiveScrubber | NIDAL | Draggable progress bar | z-9992 |
| MediaSessionController | NIDAL | OS media controls integration | Logic |
| GlobalAudioManager | NIDAL+BASE | Singleton AudioContext + ducking | Logic |
| useMusicStore | NIDAL | Music playback state | Logic |
| MobileStickyAudioBar | NIDAL | 44px mobile player bar | Mobile |

> **Michal full spec**: [michal-interaction-analysis.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/michal-interaction-analysis.md)  
> **Nidal full spec**: [nidal-player-analysis.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/nidal-player-analysis.md)

---

## 5. Modified Components (MODIFY — 9 components)

| Component | Change | Reason |
|-----------|--------|--------|
| ActiveDotIndicator | Visual upgrade (3px glowing dot) | Luca's enhanced treatment |
| SettingsApp | Added panels: dock magnification, ambient mode, music prefs | New feature controls |
| ShortcutRegistry | Added `Cmd+Option+M` (ambient mode) | New keyboard shortcut |
| useOSStore | Added `desktopMode`, `setDesktopMode` | Workspace/ambient mode state |
| SoundSynthesizer | Routes through GlobalAudioManager FX bus | Unified audio pipeline |
| GestureEngine | Added touch ripple, gyroscope, music swipe | Mobile interaction expansion |
| MobileTabBar | Icons from Luca set, magnification disabled | Dock → tab bar conversion |
| MobileStatusBar | Unchanged visual, may include ambient indicator | Contextual status |
| Wallpaper Layer | Now includes KineticHeroStage overlay | Dual-layer wallpaper system |

---

## 6. Complete Component Hierarchy

```
Root (100vw × 100vh)
├── Layer 0 (z-0)
│   ├── Wallpaper (object-cover + tint overlay)
│   └── KineticHeroStage
│       ├── SplitText (per-character spans)
│       └── AmbientHarmonicWave (idle state)
├── Layer 1 (z-10)
│   ├── DesktopCanvas
│   ├── DesktopGrid
│   │   └── DesktopIcon × N
│   └── SelectionMarquee
├── Layer 2 (z-20..49)
│   └── WindowFrame × N
│       ├── TrafficLights
│       └── App Content (Terminal/Projects/About/Finder/Settings/Mail)
├── Layer 3 (z-50)
│   └── TopMenuBar
│       ├── Apple Logo + App Name + Menus
│       └── Status Tray + Clock
├── Layer 4 (z-9990)
│   └── Dock (Luca)
│       ├── DockItem × N (with ActiveDotIndicator)
│       ├── DockDivider
│       ├── MusicPlayerDockPill
│       └── DockTooltip (AnimatePresence)
├── Layer 5 (z-9992)
│   └── AudioDeckExpandedCard
│       ├── VinylDiscAssembly
│       ├── Transport Controls
│       ├── InteractiveScrubber
│       ├── Volume Slider
│       └── AudioVisualizerCanvas
├── Layer 6 (z-9995)
│   ├── SpotlightSearch
│   ├── ContextMenu
│   └── ControlCenter
└── Layer 7 (z-9999)
    └── KineticCursor
        ├── CursorPrecisionDot
        └── CursorAuraRing
```

---

## 7. Visual Specifications

All component visual specs with exact values (positions, dimensions, colors, typography, glassmorphism, shadows) are documented in:

> **[visual-system.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/visual-system.md)**

Key design tokens:
- Dark background: `#000000`, Light: `#f5f5f7`
- Window glass: `blur(28px) saturate(180%)`, Dark body: `rgba(24,24,28,0.95)`
- Dock glass: `blur(20px) saturate(190%)`, chassis: `rgba(18,18,22,0.70)`
- Traffic lights: Red `#FF5F56`, Yellow `#FFBD2E`, Green `#27C93F`
- Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif`
- Hero font: Inter Variable, `clamp(4.5rem, 14vw+1rem, 18.5rem)`

---

## 8. Interaction Specifications

Complete interaction matrix (100+ entries) covering all inputs → conditions → actions → results:

> **[interaction-map.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/interaction-map.md)**

Critical interactions:
- **Dock magnification**: Cosine Bell `W(d) = 44 + 24·(1+cos(πd/150))/2`, spring(mass:0.1, stiff:420, damp:26)
- **Typography physics**: Spring-mass-damper ODE, k=280, c=24, m=1.0, semi-implicit Euler
- **Window drag**: Clamped `y ≥ 28`, 100px minimum visible overhang
- **Audio ducking**: Duck to 20% over 40ms, restore over 250ms
- **Music**: No autoplay. AudioContext created on first user gesture.

---

## 9. Motion Specifications

Every animation with trigger, properties, timing, easing, spring params, interruptibility:

> **[motion-system.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/motion-system.md)**

25 animations documented including:
- Window open/close/maximize/minimize (280ms/180ms/320ms/320ms)
- Dock magnification (spring), press squash (0.88x), tooltip entrance
- Cursor aura follow (lerp λ=0.15), collapse (100ms), magnetic snap
- Typography spring physics (ζ≈0.717 underdamped)
- Vinyl spin (3s linear infinite), equalizer bars (staggered keyframes)

---

## 10. Responsive Specifications

Breakpoint behavior for every component with mouse → mobile equivalent mapping:

> **[responsive-system.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/responsive-system.md)**

Critical threshold: **768px**
- ≥768px: Full desktop OS (windows, dock magnification, cursor, typography physics)
- <768px: Mobile (bottom sheets, tab bar, sticky audio bar, gyroscope parallax)

---

## 11. Asset Requirements

Complete asset registry with source, type, format, license, and programmatic capability:

> **[asset-registry.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/asset-registry.md)**

Summary: ~15 external files needed (wallpapers, fonts, sample audio, artwork, metadata), ~37 elements rendered programmatically (CSS/SVG/Canvas). All icons via Lucide React. UI sounds via Web Audio synthesis.

---

## 12. State Architecture

TypeScript interfaces and state flow for all stateful systems:

> **[state-architecture.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/state-architecture.md)**

Two primary stores:
- **useOSStore** (Zustand): windows, activeWindowId, desktopMode, theme, wallpaper, sound
- **useMusicStore** (Zustand): playlist, currentIndex, status, volume, shuffle, repeat

Plus: CursorStateMachine (FSM), AudioPipelineState (singleton), cross-system communication graph.

---

## 13. Technology Decision

> **[technology-decision.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/implementation/technology-decision.md)**

| Category | Decision |
|----------|----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Custom Properties |
| Animation | Framer Motion + requestAnimationFrame |
| State | Zustand |
| Audio | Web Audio API + HTML5 Audio |
| Icons | Lucide React |
| Testing | Vitest + Playwright |

---

## 14. Integration Architecture

9 systems with defined responsibilities and communication boundaries:

> **[application-architecture.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/application-architecture.md)**

Systems: Core OS → Window System → Desktop → Navigation → Taskbar → Widgets → Interaction Engine → Audio System → Responsive Layer

No circular dependencies. Communication via Zustand stores or direct props within system boundaries.

---

## 15. QA Requirements

### Visual QA (64 criteria)
> **[visual-reference-matrix.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/qa/visual-reference-matrix.md)**

### Functional QA (90 test cases)
> **[interaction-validation-matrix.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/qa/interaction-validation-matrix.md)**

Covering: desktop, windows, dock, music, cursor, typography, keyboard shortcuts, responsive, audio ducking, persistence.

---

## 16. Known Uncertainties

| # | Item | Confidence | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | Dock chassis gap between items | PROBABLE (6px) | Low — adjustable in CSS | Test visually, match Luca reference |
| 2 | Dock divider height | PROBABLE (32px) | Low | Adjust to match visual reference |
| 3 | Audio Deck expanded dimensions | PROBABLE (340×480px) | Medium — affects layout | Prototype and adjust |
| 4 | Vinyl disc dimensions | PROBABLE (200×200px) | Low | Scale to fit deck |
| 5 | Ambient wave amplitude/frequency | PROBABLE (2-4px, 0.5-1Hz) | Low | Tune by feel |
| 6 | Cursor force multiplier k_force | PROBABLE (~50-100) | Medium — affects displacement intensity | Tune to match Michal feel |
| 7 | Gaussian σ for cursor falloff | PROBABLE (~104px) | Medium | R/2.5 estimate, tune by feel |
| 8 | Context menu mobile activation (long-press timing) | PROBABLE (500ms) | Low | Standard iOS convention |
| 9 | Desktop mode transition duration | PROBABLE (400ms) | Low | Tune by feel |
| 10 | Aura ring border spec | PROBABLE (2px, rgba(255,255,255,0.6)) | Low | Adjust to match reference |
| 11 | PP Neue Montreal font | PROPRIETARY — cannot use | Medium — affects hero feel | Use Inter Variable (supports variable weight 100-900) |
| 12 | Control Center mobile behavior | PROBABLE (half-sheet) | Low | Follow iOS convention |
| 13 | Navigation/URL behavior | PROBABLE (hash routing) | Low | Implement SPA routing if needed |

---

## 17. Phase 3 Implementation Rules

### MUST Follow
1. **Implement components in sprint order** (Sprint 1→5 per [implementation-spec.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/implementation/implementation-spec.md))
2. **Use exact values from this spec** — no arbitrary color, size, timing, or easing choices
3. **Match source interactions precisely** — dock magnification must be Cosine Bell, typography must be spring-mass-damper, windows must have correct shadow system
4. **Audio must not auto-start** — AudioContext created inside user gesture handler only
5. **All PROBABLE values are starting points** — tune against source references but document any changes
6. **No global state leakage** — useOSStore for windows, useMusicStore for music, never cross-contaminate
7. **Performance budget**: <1.5ms JS per frame for kinetic typography, 60fps minimum for all animations
8. **Accessibility**: `prefers-reduced-motion` support, focus trapping, ARIA labels

### MUST NOT Do
1. ❌ **Do not redesign** any component — reproduce exactly from source
2. ❌ **Do not merge** unrelated systems (music state into OS store, cursor into window state)
3. ❌ **Do not invent** interactions not documented here
4. ❌ **Do not skip** the GlobalAudioManager singleton — all audio must route through it
5. ❌ **Do not ignore** responsive breakpoints — mobile behavior is fully specified
6. ❌ **Do not use** PP Neue Montreal (proprietary) — use Inter Variable
7. ❌ **Do not assume** UNKNOWN values — mark as TODO and match visually against reference

### Quality Gates
- [ ] Sprint 1 complete: Desktop renders with menu bar, icons, wallpaper, theme switching
- [ ] Sprint 2 complete: Windows open/close/drag/resize with all animations
- [ ] Sprint 3 complete: Luca dock magnifies, music plays, deck expands
- [ ] Sprint 4 complete: Typography responds to cursor, cursor has dual-tier + states
- [ ] Sprint 5 complete: Mobile responsive, 60fps verified, all 90 test cases pass

---

## Document Index

### /research
- [base-site-reverse-engineering.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/base-site-reverse-engineering.md) — Complete base OS specification
- [luca-taskbar-analysis.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/luca-taskbar-analysis.md) — Luca dock magnification, spring physics, glassmorphism
- [michal-interaction-analysis.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/michal-interaction-analysis.md) — Kinetic typography physics, cursor system, variable font
- [nidal-player-analysis.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/nidal-player-analysis.md) — Music player, audio pipeline, states, Media Session API
- [asset-registry.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/asset-registry.md) — All assets with source, format, license

### /design
- [design-philosophy-analysis.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/design-philosophy-analysis.md) — design.md conflicts and resolutions
- [visual-system.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/visual-system.md) — Color tokens, component dimensions, typography
- [motion-system.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/motion-system.md) — All 25 animations with exact params
- [responsive-system.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/responsive-system.md) — Breakpoint behavior, mobile equivalents

### /architecture
- [component-map.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/component-map.md) — 46 components with full metadata
- [integration-map.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/integration-map.md) — KEEP/REPLACE/MODIFY/ADD/REMOVE classification
- [state-architecture.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/state-architecture.md) — TypeScript interfaces, persistence, cross-system comms
- [interaction-map.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/interaction-map.md) — Complete interaction matrix
- [application-architecture.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/application-architecture.md) — 9 system architecture with boundaries

### /implementation
- [technology-decision.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/implementation/technology-decision.md) — Stack choices with rationale
- [implementation-spec.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/implementation/implementation-spec.md) — 5-sprint build plan

### /qa
- [visual-reference-matrix.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/qa/visual-reference-matrix.md) — 64 visual comparison criteria
- [interaction-validation-matrix.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/qa/interaction-validation-matrix.md) — 90 functional test cases

---

**This document is the implementation contract. Phase 3 must follow this specification without improvisation.**

