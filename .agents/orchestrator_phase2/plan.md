# Orchestration Plan — Phase 2 Implementation

## 1. Objective
Deliver a production-ready, high-fidelity macOS-style portfolio desktop environment in `d:\CODE\Html\Showcase\` integrating:
- Irfan Naikwade base OS (Window management, 6 apps, top menu bar, shortcuts, theme, desktop canvas)
- Luca Felix dock (Cosine Bell magnification, spring physics, glassmorphic chassis, tooltips, active dots)
- Michal Grzebisz kinetic typography & cursor (Physics-based ODE particle typography, variable font modulation, dual-tier cursor with FSM)
- Nidal music player (Web Audio API singleton GlobalAudioManager, audio ducking, expanded deck, vinyl disc, canvas FFT visualizer)
- Mobile responsiveness (Bottom sheets, tab bar, sticky audio bar, touch/gyroscope)
- Comprehensive test coverage with 100% verification against QA matrices.

## 2. Milestone Decomposition & Dependency Graph

```
                   ┌────────────────────────────────────────┐
                   │        E2E Testing Track               │
                   │ (Tiers 1-4 Test Harness & Suites)     │
                   └──────────────────┬─────────────────────┘
                                      │
                                      ▼ (TEST_READY.md)
┌───────────────────────┐             │
│ Milestone 1 (M1)      │             │
│ Core OS Framework     │             │
└──────────┬────────────┘             │
           │                          │
           ├──────────────────────────┼──────────────────────────┐
           ▼                          ▼                          ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│ Milestone 2 (M2)      │  │ Milestone 3 (M3)      │  │ Milestone 4 (M4)      │
│ Window System & Apps  │  │ Luca Dock & Audio Deck│  │ Kinetic Typography    │
└──────────┬────────────┘  └──────────┬────────────┘  │ & Custom Cursor       │
           │                          │               └──────────┬────────────┘
           └──────────────────────────┼──────────────────────────┘
                                      ▼
                           ┌───────────────────────┐
                           │ Milestone 5 (M5)      │
                           │ Mobile & Optimization │
                           └──────────┬────────────┘
                                      │
                                      ▼
                           ┌───────────────────────┐
                           │ Milestone 6 (M6)      │
                           │ Final E2E & Hardening │
                           └───────────────────────┘
```

## 3. Sub-Orchestrator Execution Strategy
1. **E2E Testing Track**:
   - Sub-orchestrator `sub_orch_e2e` establishes Vitest / Playwright / Component test harness.
   - Implements Tier 1 (Feature Coverage), Tier 2 (Boundary & Corner), Tier 3 (Cross-Feature Combinations), Tier 4 (Real-world scenarios).
   - Generates `TEST_INFRA.md` and `TEST_READY.md`.

2. **Milestone 1: Core OS Framework**:
   - Sub-orchestrator `sub_orch_m1` coordinates Explorer -> Worker -> Reviewer -> Challenger -> Forensic Auditor cycle.
   - Next.js setup, Tailwind tokens, CSS custom properties, useOSStore (Zustand), DesktopCanvas, Wallpaper crossfade, DesktopGrid, TopMenuBar, ShortcutRegistry.

3. **Milestone 2: Window System & 6 Applications**:
   - Sub-orchestrator `sub_orch_m2`. WindowFrame with glassmorphism and shadow variants, TrafficLights, drag clamping, cascade spawning, resize handles, 6 apps (Terminal, Projects, About, Finder, Settings, Mail), ContextMenu, Spotlight.

4. **Milestone 3: Luca Parabolic Dock & Audio Engine**:
   - Sub-orchestrator `sub_orch_m3`. Dock chassis, Cosine Bell spring magnification, DockItem, DockTooltip, ActiveDotIndicator, GlobalAudioManager singleton with FX ducking, useMusicStore, MusicPlayerDockPill, AudioDeckExpandedCard (vinyl disc, FFT visualizer, scrubber, volume, MediaSession).

5. **Milestone 4: Michal Kinetic Typography & Custom Cursor**:
   - Sub-orchestrator `sub_orch_m4`. KineticHeroStage, SplitText with semi-implicit Euler spring-mass-damper ODE, Gaussian cursor force falloff, Inter Variable font modulation, Ambient harmonic wave, Dual-tier KineticCursor (4px dot + difference aura), CursorStateMachine FSM (`data-cursor`).

6. **Milestone 5: Mobile & Polish**:
   - Sub-orchestrator `sub_orch_m5`. MobileBottomSheet (swipe to dismiss), MobileTabBar, MobileStickyAudioBar, touch & gyroscope support, 60fps performance profiling, `prefers-reduced-motion`, a11y focus trapping & ARIA.

7. **Milestone 6: Final Verification & Adversarial Hardening**:
   - Sub-orchestrator `sub_orch_m6`. Phase 1: 100% E2E test suite pass (Tiers 1-4). Phase 2: Tier 5 white-box adversarial testing, challenger gap analysis, Lighthouse score verification >= 90.
