# Integration Map — Component Classification
## Phase 2 Architecture Document

---

## Summary Table

| # | Component | Classification | Source | Target Layer |
|---|-----------|---------------|--------|-------------|
| 1 | DesktopCanvas | **KEEP** | BASE | Layer 1 (z-10) |
| 2 | DesktopGrid | **KEEP** | BASE | Layer 1 |
| 3 | DesktopIcon | **KEEP** | BASE | Layer 1 |
| 4 | SelectionMarquee | **KEEP** | BASE | Layer 1 |
| 5 | WindowFrame | **KEEP** | BASE | Layer 2 (z-20–49) |
| 6 | TrafficLights | **KEEP** | BASE | Layer 2 (within WindowFrame) |
| 7 | TopMenuBar | **KEEP** | BASE | Layer 3 (z-50) |
| 8 | ControlCenter | **KEEP** | BASE | Layer 6 (z-[9995]) |
| 9 | SpotlightSearch | **KEEP** | BASE | Layer 6 (z-[9995]) |
| 10 | ContextMenu | **KEEP** | BASE | Layer 6 (z-[9995]) |
| 11 | Base Dock | **REMOVE** | BASE | — (replaced by Luca) |
| 12 | Dock (Luca) | **REPLACE** | LUCA | Layer 4 (z-[9990]) |
| 13 | DockItem | **REPLACE** | LUCA | Layer 4 |
| 14 | DockTooltip | **ADD** | LUCA | Layer 4 |
| 15 | DockDivider | **ADD** | LUCA | Layer 4 |
| 16 | ActiveDotIndicator | **MODIFY** | BASE+LUCA | Layer 4 |
| 17 | KineticHeroStage | **ADD** | MICHAL | Layer 0 (z-0) |
| 18 | SplitText | **ADD** | MICHAL | Layer 0 |
| 19 | AmbientHarmonicWave | **ADD** | MICHAL | Layer 0 |
| 20 | KineticCursor | **ADD** | MICHAL | Layer 7 (z-[9999]) |
| 21 | CursorPrecisionDot | **ADD** | MICHAL | Layer 7 |
| 22 | CursorAuraRing | **ADD** | MICHAL | Layer 7 |
| 23 | CursorStateMachine | **ADD** | MICHAL | — (logic) |
| 24 | MusicPlayerDockPill | **ADD** | NIDAL | Layer 4 (in Dock) |
| 25 | AudioDeckExpandedCard | **ADD** | NIDAL | Layer 5 (z-[9992]) |
| 26 | VinylDiscAssembly | **ADD** | NIDAL | Layer 5 |
| 27 | AudioVisualizerCanvas | **ADD** | NIDAL | Layer 5 |
| 28 | InteractiveScrubber | **ADD** | NIDAL | Layer 5 |
| 29 | MediaSessionController | **ADD** | NIDAL | — (logic) |
| 30 | GlobalAudioManager | **ADD** | NIDAL+BASE | — (singleton) |
| 31 | SoundSynthesizer | **MODIFY** | BASE | — (routes through GlobalAudioManager) |
| 32 | TerminalApp | **KEEP** | BASE | Layer 2 |
| 33 | ProjectsApp | **KEEP** | BASE | Layer 2 |
| 34 | AboutApp | **KEEP** | BASE | Layer 2 |
| 35 | FinderApp | **KEEP** | BASE | Layer 2 |
| 36 | SettingsApp | **MODIFY** | BASE | Layer 2 |
| 37 | MailApp | **KEEP** | BASE | Layer 2 |
| 38 | MobileBottomSheet | **KEEP** | BASE | Mobile Layer |
| 39 | MobileStickyAudioBar | **ADD** | NIDAL | Mobile Layer |
| 40 | MobileStatusBar | **KEEP** | BASE | Mobile Layer |
| 41 | MobileTabBar | **MODIFY** | BASE+LUCA | Mobile Layer |
| 42 | ShortcutRegistry | **MODIFY** | BASE | — (add ambient mode shortcuts) |
| 43 | GestureEngine | **MODIFY** | BASE | — (add gyroscope, touch ripple) |
| 44 | useOSStore | **MODIFY** | BASE | — (add desktopMode, music integration) |
| 45 | useMusicStore | **ADD** | NIDAL | — (state store) |
| 46 | Wallpaper Layer | **MODIFY** | BASE | Layer 0 (now includes KineticHeroStage) |

---

## Detailed Justifications

### REMOVE Decisions

#### Base Dock (Irfan's Original)
- **Rationale**: User explicitly specified `BASE TASKBAR → REMOVE | LUCA TASKBAR → INTEGRATE`
- **What's lost**: Simple glassmorphic dock at z-40
- **What's preserved**: App launcher functionality transferred to Luca Dock, running app indicators preserved via ActiveDotIndicator

### REPLACE Decisions

#### Dock → Luca Felix Parabolic Dock
- **Rationale**: Luca's dock provides superior UX — proximity magnification, spring physics, specular glassmorphism, tactile press feedback
- **Base features preserved in replacement**: App icons, click-to-launch/focus, minimize-to-dock, active dot indicators
- **New features added**: Cosine Bell magnification, spring dynamics, tooltip pills, divider sections, Nidal music pill integration

### MODIFY Decisions

#### ActiveDotIndicator
- **Rationale**: Concept exists in base dock; visual treatment upgraded to Luca's glowing 3px dot with states (open/minimized)

#### SettingsApp
- **Rationale**: Must add controls for new features — dock magnification size, ambient mode toggle, kinetic typography sensitivity, music player preferences

#### ShortcutRegistry
- **Rationale**: Add `Cmd+Option+M` for ambient hero mode toggle

#### useOSStore
- **Rationale**: Add `desktopMode: 'workspace' | 'ambient-hero'` state, add `setDesktopMode` action

#### SoundSynthesizer
- **Rationale**: Procedural UI sounds now route through GlobalAudioManager's FX GainNode instead of creating independent AudioContexts

#### GestureEngine
- **Rationale**: Add touch ripple handling (Michal mobile fallback), gyroscope parallax event forwarding, bottom sheet swipe gestures for music player

#### MobileTabBar
- **Rationale**: Base dock converts to tab bar on mobile; must include Luca's icon set with magnification disabled

#### Wallpaper Layer
- **Rationale**: Layer 0 now combines static wallpaper image (fallback/tint) with Michal KineticHeroStage overlay

### ADD Decisions

All Michal, Nidal, and Luca-exclusive components are new additions with clear boundaries documented in the component map.

---

## Classification Statistics

| Classification | Count |
|---------------|-------|
| KEEP | 16 |
| REPLACE | 2 |
| MODIFY | 9 |
| ADD | 18 |
| REMOVE | 1 |
| **TOTAL** | **46** |

