# Technology Decision
## Phase 2 Implementation Document

---

## Stack Overview

| Category | Decision | Version |
|----------|----------|---------|
| Framework | Next.js (App Router) | 14+ |
| Language | TypeScript | 5.x |
| Build Tool | Next.js built-in (Turbopack dev, Webpack prod) | — |
| Styling | Tailwind CSS + CSS Custom Properties | 3.4+ |
| Animation (declarative) | Framer Motion | 11+ |
| Animation (imperative) | `requestAnimationFrame` + manual | — |
| State Management | Zustand | 4.5+ |
| Audio | Web Audio API + HTML5 `<audio>` | Browser native |
| Icons | Lucide React | Latest |
| Testing (Unit) | Vitest | Latest |
| Testing (E2E) | Playwright | Latest |

---

## Rationale

### Next.js + React 18
- **Why**: The base OS (irfannaikwade.in) uses React/Next.js. Preserving the same framework avoids architecture conflicts.
- **App Router**: Modern React patterns (Server Components for static shell, Client Components for interactive OS).
- **SSR**: Initial page load can server-render the desktop shell, wallpaper, and skeleton — reducing Time to Interactive.
- **File-based routing**: Not heavily used (SPA desktop), but useful for potential future deep-linking.

### TypeScript
- **Why**: Complex state machines (window manager, cursor FSM, audio pipeline, music player states) benefit from type contracts. Phase 1 already defined TypeScript interfaces for `AppWindow`, `WindowManagerStore`, `MusicStore`.
- **Critical for**: Ensuring `focusWindow(id)`, `openWindow(id)` type-safely reference known app IDs.

### Tailwind CSS + CSS Custom Properties
- **Why**: Base OS uses Tailwind extensively (Phase 1 confirmed: `backdrop-blur-2xl`, `bg-white/70`, `rounded-xl`). CSS custom properties handle dynamic theming (`--os-menubar-bg`, `--os-window-body-bg`).
- **Design tokens**: All color tokens from visual-system.md map to CSS custom properties toggled via `.dark` class.

### Framer Motion
- **Why**: Spring-based animations are central to the project (dock magnification, window open/close, cursor aura, tooltip entrance). Framer Motion provides:
  - `useSpring` / `MotionValue`: Dock magnification runs outside React render (critical for 60fps).
  - `AnimatePresence`: Tooltip enter/exit, window mount/unmount.
  - Spring configs with `mass`, `stiffness`, `damping` — exact values from Phase 1.
- **Limitation**: Kinetic typography physics (spring-mass-damper ODE) runs in manual `requestAnimationFrame` loop, NOT Framer Motion — too many particles (100+ characters) for React-based animation.

### requestAnimationFrame (Manual)
- **Why**: Two systems require frame-level control outside React:
  1. **Kinetic typography**: 100+ character particles each with position/velocity/force — must use SoA `Float32Array` and direct DOM transform updates.
  2. **Audio visualizer**: Canvas 2D FFT bar rendering at 60fps.
- **Pattern**: `useEffect` sets up RAF loop with cleanup. Uses `performance.now()` delta for frame-rate independence.

### Zustand
- **Why**: Lightweight (~1KB), supports subscriptions without re-rendering unrelated components, middleware for persistence, devtools.
- **Two stores**: `useOSStore` (windows, theme, desktop mode) and `useMusicStore` (playlist, status, volume). Isolation prevents music state from re-rendering windows.
- **Over Redux**: Less boilerplate. OS state doesn't need action types/reducers — simple mutators suffice.
- **Over Context**: Context would cause re-render cascades on window focus changes (every window re-renders). Zustand's selector subscriptions avoid this.

### Web Audio API + HTML5 Audio
- **Why**:
  - HTML5 `<audio>`: Handles streaming, hardware decode, media session. No need to manually decode audio buffers.
  - Web Audio API: Required for FFT visualizer (`AnalyserNode`), gain routing (`GainNode` for ducking), and procedural UI sound synthesis (`OscillatorNode`).
  - `MediaElementSourceNode` bridges the two: routes `<audio>` through the Web Audio graph.
- **Singleton AudioContext**: One shared context for both music and UI sounds. Browser limits concurrent contexts.

### Lucide React
- **Why**: Base OS uses `lucide-react` for iconography. Consistent icon set with tree-shaking. Pixel-perfect at 24px.

### Vitest + Playwright
- **Why**: Vitest for unit-testing state stores (window manager logic, music player state transitions, cursor FSM). Playwright for E2E: window drag, dock magnification, music playback, responsive mode switching.

---

## Directory Structure [PROBABLE]

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout, theme provider, font loading
│   ├── page.tsx                 # Desktop entry point
│   └── globals.css              # CSS tokens, Tailwind base
├── components/
│   ├── os/                      # Core OS components
│   │   ├── DesktopCanvas.tsx
│   │   ├── DesktopGrid.tsx
│   │   ├── DesktopIcon.tsx
│   │   ├── TopMenuBar.tsx
│   │   ├── ContextMenu.tsx
│   │   ├── SpotlightSearch.tsx
│   │   └── ControlCenter.tsx
│   ├── window/                  # Window system
│   │   ├── WindowFrame.tsx
│   │   ├── TrafficLights.tsx
│   │   └── MobileBottomSheet.tsx
│   ├── dock/                    # Luca dock
│   │   ├── Dock.tsx
│   │   ├── DockItem.tsx
│   │   ├── DockTooltip.tsx
│   │   └── DockDivider.tsx
│   ├── music/                   # Nidal music
│   │   ├── MusicPlayerDockPill.tsx
│   │   ├── AudioDeckExpandedCard.tsx
│   │   ├── VinylDiscAssembly.tsx
│   │   ├── AudioVisualizerCanvas.tsx
│   │   ├── InteractiveScrubber.tsx
│   │   └── MobileStickyAudioBar.tsx
│   ├── cursor/                  # Michal cursor
│   │   ├── KineticCursor.tsx
│   │   ├── CursorPrecisionDot.tsx
│   │   └── CursorAuraRing.tsx
│   ├── typography/              # Michal typography
│   │   ├── KineticHeroStage.tsx
│   │   ├── SplitText.tsx
│   │   └── PhysicsEngine.ts
│   └── apps/                    # Application content
│       ├── TerminalApp.tsx
│       ├── ProjectsApp.tsx
│       ├── AboutApp.tsx
│       ├── FinderApp.tsx
│       ├── SettingsApp.tsx
│       └── MailApp.tsx
├── stores/
│   ├── useOSStore.ts
│   └── useMusicStore.ts
├── systems/
│   ├── GlobalAudioManager.ts
│   ├── SoundSynthesizer.ts
│   ├── ShortcutRegistry.ts
│   ├── CursorStateMachine.ts
│   └── MediaSessionController.ts
├── hooks/
│   ├── useWindowDrag.ts
│   ├── useWindowResize.ts
│   ├── useBreakpoint.ts
│   └── useGyroscope.ts
└── lib/
    ├── physics.ts               # Spring-mass-damper integrator
    ├── magnification.ts         # Cosine Bell formula
    └── constants.ts             # Config values (from .env or config)
```

