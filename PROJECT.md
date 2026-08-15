# Project: macOS-Style Portfolio OS Showcase

## Architecture
- **Framework**: Next.js 14.2.5 (App Router), React 18+, TypeScript
- **Styling**: Tailwind CSS + CSS Custom Properties + PostCSS
- **Animation & Physics**: Framer Motion + requestAnimationFrame + custom Semi-Implicit Euler ODE solver
- **State Management**: Zustand (isolated stores: `useOSStore`, `useMusicStore`)
- **Audio Engine**: Web Audio API singleton (`GlobalAudioManager`) with routing for HTMLAudioElement + SoundSynthesizer procedural audio with ducking
- **Icons**: Lucide React
- **Typography**: Inter Variable + JetBrains Mono
- **Testing**: Vitest + React Testing Library + Web Audio / Canvas / DOM mocks

### Z-Index Layers
- Layer 0 (`z-0`): Wallpaper + `KineticHeroStage` (interactive typography)
- Layer 1 (`z-10`): `DesktopCanvas` + `DesktopGrid` (icons) + `SelectionMarquee`
- Layer 2 (`z-20..49`): `WindowFrame` instances (`TerminalApp`, `ProjectsApp`, `AboutApp`, `FinderApp`, `SettingsApp`, `MailApp`)
- Layer 3 (`z-50`): `TopMenuBar`
- Layer 4 (`z-[9990]`): `Dock` (Luca parabolic dock + `MusicPlayerDockPill` + `ActiveDotIndicator` + `DockTooltip`)
- Layer 5 (`z-[9992]`): `AudioDeckExpandedCard`
- Layer 6 (`z-[9995]`): `SpotlightSearch` + `ContextMenu` + `ControlCenter`
- Layer 7 (`z-[9999]`): `KineticCursor` (Dot + Aura Ring)
- Mobile Layer: `MobileBottomSheet`, `MobileTabBar`, `MobileStickyAudioBar`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Independent requirement-driven test suite (Tiers 1-4, 90 interaction + 64 visual tests) | none | DONE |
| 1 | M1: Core OS Framework | Next.js, Tailwind tokens, useOSStore, DesktopCanvas, Wallpaper, DesktopGrid, TopMenuBar, ShortcutRegistry | none | DONE |
| 2 | M2: Window System & Apps | WindowFrame, TrafficLights, 6 Apps, ContextMenu, SpotlightSearch | M1 | DONE |
| 3 | M3: Parabolic Dock & Audio | Luca Dock (Cosine Bell spring), GlobalAudioManager, useMusicStore, AudioDeckExpandedCard | M1 | DONE |
| 4 | M4: Kinetic Typography & Cursor | KineticHeroStage (Euler physics ODE), Dual-tier KineticCursor, CursorStateMachine | M1 | DONE |
| 5 | M5: Mobile & Polish | MobileBottomSheet, MobileTabBar, MobileStickyAudioBar, touch/gyroscope, 60fps, a11y | M1-M4 | DONE |
| 6 | M6: Full E2E & Hardening | 100% pass on E2E test suite (28 suites, 281 tests) + static build | M1-M5, E2E | DONE |

## Complete Showcase Deliverables Summary
1. **Desktop Canvas & Wallpaper**: 700ms crossfade, selection marquee, responsive auto-flow grid.
2. **Window System**: Glassmorphic chrome (`blur(28px) saturate(180%)`), traffic lights with glyph hover, $y \ge 28$ drag clamping, 8-direction resize handles (360x240 min bounds), cascade spawning.
3. **6 Applications**:
   - `TerminalApp`: Neofetch, 12 commands, history navigation, tab completion, sound FX, Matrix rain mode.
   - `ProjectsApp`: 5 category pills, search filter, rich project cards, metrics modal.
   - `AboutApp`: Bio, stats, 4-milestone career timeline, interactive skill proficiency bars, resume download.
   - `FinderApp`: Sidebar tree, grid/list view switcher, search, inspector pane.
   - `SettingsApp`: Wallpaper picker grid with live preview, appearance dark/light toggle, dock magnification slider, sound volume slider, ambient mode toggle.
   - `MailApp`: Contact form, validation, paper plane spring send animation, sound FX.
4. **Luca Parabolic Dock**: Cosine Bell magnification $W(d) = 44 + 24\cdot(1+\cos(\pi d/150))/2$, spring physics (mass:0.1, stiff:420, damp:26), launch bounce, tooltips, glowing active dots.
5. **Nidal Audio Engine**: `GlobalAudioManager` singleton, procedural UI sound synthesizer, automatic ducking to 20% over 40ms with 250ms recovery, `AudioDeckExpandedCard` with 200px 3s spinning vinyl disc, 64-bin FFT canvas visualizer, interactive scrubber, MediaSession API.
6. **Michal Kinetic Typography**: `KineticHeroStage`, `SplitText` spans, semi-implicit Euler integration ODE solver, Gaussian force falloff $\sigma \approx 104px$, variable font weight modulation (400->900), ambient harmonic wave.
7. **Dual-Tier Kinetic Cursor**: 4px zero-lag precision dot, difference-blend aura ring, velocity-scaled expansion, `CursorStateMachine` reading `data-cursor`.
8. **Mobile Responsiveness**: 92vh `MobileBottomSheet` with swipe-to-dismiss (>140px), `MobileTabBar`, `MobileStickyAudioBar`, gyroscope text parallax.
9. **Global Shortcuts**: `Cmd+K` Spotlight, `Cmd+W` close, `Cmd+M` minimize, `Cmd+Shift+D` theme, `Cmd+Option+M` ambient mode, `Escape` dismiss.
10. **Testing & QA**: 28 test suites, 281 passing tests (100%), Next.js 14.2.5 static compilation passing with 0 errors.
