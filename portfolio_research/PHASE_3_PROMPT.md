# PHASE 3 — IMPLEMENTATION PROMPT
## macOS-Style Portfolio Desktop — Full Build

---

## ROLE
Senior full-stack developer specializing in Next.js, React, TypeScript, Framer Motion, Web Audio API, and high-performance interactive UI. You are building a macOS-style portfolio desktop environment from a complete technical specification.

**Core Directive:** Execute PHASE_2_MASTER_SPEC.md as an implementation contract. Every visual value, animation parameter, interaction behavior, and architecture decision is pre-defined — your job is faithful execution, not design.

---

## CONTEXT

You are building a macOS-style portfolio website that combines features from 4 source websites:
1. **Base OS** (irfannaikwade.in) — The complete desktop environment: windows, menu bar, icons, apps
2. **Luca Felix** (luca-felix.com) — Parabolic dock with spring magnification (REPLACES base dock)
3. **Michal Grzebisz** (michalgrzebisz.com) — Kinetic typography + custom dual-tier cursor (ADDED as Layer 0 + Layer 7)
4. **Nidal** (nidal.dev) — Music player widget with vinyl disc, FFT visualizer (ADDED as dock pill + expanded deck)

All specifications, values, formulas, and architecture are documented in Phase 2. **Do not invent or guess — look it up in the spec.**

---

## MANDATORY REFERENCE FILES

Before writing ANY code, you MUST read and internalize these specification documents. They are your single source of truth:

### Primary Contract
- `d:\CODE\Html\Showcase\portfolio_research\phase2\PHASE_2_MASTER_SPEC.md` — **READ FIRST**. Contains component hierarchy, integration decisions, known uncertainties, and implementation rules.

### Research (Exact Values)
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\base-site-reverse-engineering.md` — Z-index layers, window system, icon grid, menu bar, shadows, animations, responsive, sound
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\luca-taskbar-analysis.md` — Dock DOM, glassmorphism, Cosine Bell formula, spring params, tooltips, dividers, active dots
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\michal-interaction-analysis.md` — Typography physics ODE (k=280, c=24, m=1.0), cursor system, variable font, EMA velocity, mobile fallback
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\nidal-player-analysis.md` — Dual-state player, audio pipeline, controls, states, Media Session API, ducking formula
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\asset-registry.md` — All assets with source, format, license, programmatic flag

### Design System (Visual Tokens)
- `d:\CODE\Html\Showcase\portfolio_research\phase2\design\visual-system.md` — **ALL color tokens (light/dark), component dimensions, typography, glassmorphism values**
- `d:\CODE\Html\Showcase\portfolio_research\phase2\design\motion-system.md` — **ALL 25 animations with exact trigger, easing, spring params, interruptibility**
- `d:\CODE\Html\Showcase\portfolio_research\phase2\design\responsive-system.md` — Breakpoint behavior, mouse→mobile equivalents
- `d:\CODE\Html\Showcase\portfolio_research\phase2\design\design-philosophy-analysis.md` — design.md conflicts and resolutions

### Architecture (Structure)
- `d:\CODE\Html\Showcase\portfolio_research\phase2\architecture\component-map.md` — 46 components with full metadata
- `d:\CODE\Html\Showcase\portfolio_research\phase2\architecture\integration-map.md` — KEEP/REPLACE/MODIFY/ADD/REMOVE classification
- `d:\CODE\Html\Showcase\portfolio_research\phase2\architecture\state-architecture.md` — TypeScript interfaces, state flow, persistence rules
- `d:\CODE\Html\Showcase\portfolio_research\phase2\architecture\interaction-map.md` — Complete input→condition→action→result matrix
- `d:\CODE\Html\Showcase\portfolio_research\phase2\architecture\application-architecture.md` — 9 systems, boundaries, dependency graph

### Implementation Plan
- `d:\CODE\Html\Showcase\portfolio_research\phase2\implementation\technology-decision.md` — Stack, rationale, directory structure
- `d:\CODE\Html\Showcase\portfolio_research\phase2\implementation\implementation-spec.md` — Sprint plan with per-component instructions

### QA Criteria
- `d:\CODE\Html\Showcase\portfolio_research\phase2\qa\visual-reference-matrix.md` — 64 visual criteria (P0/P1/P2)
- `d:\CODE\Html\Showcase\portfolio_research\phase2\qa\interaction-validation-matrix.md` — 90 functional test cases

### Design Authority
- `d:\CODE\Html\Showcase\design.md` — Apple design principles (applied where they don't conflict with source replicas — see design-philosophy-analysis.md for conflict resolutions)

---

## TECHNOLOGY STACK

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 14+ |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS + CSS Custom Properties | 3.4+ |
| Animation (declarative) | Framer Motion | 11+ |
| Animation (imperative) | `requestAnimationFrame` (manual loop) | — |
| State Management | Zustand | 4.5+ |
| Audio | Web Audio API + HTML5 `<audio>` | Browser native |
| Icons | Lucide React | Latest |
| Fonts | Inter Variable, JetBrains Mono (via next/font) | — |

**Initialize**: `npx -y create-next-app@latest ./ --typescript --tailwind --app --src-dir --eslint --no-turbopack`
Then: `npm install framer-motion zustand lucide-react`

---

## PROJECT DIRECTORY STRUCTURE

```
d:\CODE\Html\Showcase\   (workspace root)
└── src/
    ├── app/
    │   ├── layout.tsx               # Root: fonts, theme provider, cursor/native-cursor, overflow:hidden
    │   ├── page.tsx                 # Desktop entry: layers 0-7 composition
    │   └── globals.css              # Design tokens, Tailwind base, dark/light CSS vars
    ├── components/
    │   ├── os/                      # Core OS chrome
    │   │   ├── DesktopCanvas.tsx     # Root surface, wallpaper, click/right-click/marquee
    │   │   ├── DesktopGrid.tsx       # Auto-flow icon grid container
    │   │   ├── DesktopIcon.tsx       # Individual app launcher icon
    │   │   ├── TopMenuBar.tsx        # 28px fixed bar, dynamic app name, clock
    │   │   ├── ContextMenu.tsx       # Right-click glassmorphic popover
    │   │   ├── SpotlightSearch.tsx   # Cmd+K command palette modal
    │   │   └── ControlCenter.tsx     # Settings popover from status tray
    │   ├── window/                  # Window system
    │   │   ├── WindowFrame.tsx       # Glassmorphic floating window w/ drag/resize/focus
    │   │   ├── TrafficLights.tsx     # Close/Min/Max buttons (12px circles)
    │   │   └── WindowManager.tsx     # Renders all open windows from useOSStore
    │   ├── dock/                    # Luca parabolic dock
    │   │   ├── Dock.tsx             # Root chassis, mouseX MotionValue, glassmorphism
    │   │   ├── DockItem.tsx         # Magnifiable icon w/ spring physics
    │   │   ├── DockTooltip.tsx      # AnimatePresence label pill
    │   │   └── DockDivider.tsx      # 1px vertical separator
    │   ├── music/                   # Nidal music player
    │   │   ├── MusicPlayerDockPill.tsx   # 120px compact pill in dock
    │   │   ├── AudioDeckExpanded.tsx     # Full glassmorphic deck (z-9992)
    │   │   ├── VinylDisc.tsx            # Spinning disc w/ album art center
    │   │   ├── AudioVisualizer.tsx       # Canvas FFT frequency bars
    │   │   ├── ProgressScrubber.tsx      # Draggable progress bar
    │   │   └── TransportControls.tsx     # Play/pause/next/prev/shuffle/repeat
    │   ├── cursor/                  # Michal dual-tier cursor
    │   │   ├── KineticCursor.tsx     # Controller: position, velocity, state dispatch
    │   │   ├── CursorDot.tsx         # 4px zero-lag precision dot
    │   │   └── CursorAura.tsx        # 24-80px difference-blend ring
    │   ├── typography/              # Michal kinetic hero
    │   │   ├── KineticHeroStage.tsx  # Layer 0 full-bleed container
    │   │   └── SplitText.tsx         # Per-character particle system + physics loop
    │   ├── apps/                    # Application content
    │   │   ├── TerminalApp.tsx       # CLI w/ Neofetch, command history
    │   │   ├── ProjectsApp.tsx       # Filterable project gallery
    │   │   ├── AboutApp.tsx          # Bio, timeline, skills
    │   │   ├── FinderApp.tsx         # File tree browser
    │   │   ├── SettingsApp.tsx       # Wallpaper, theme, dock, sound prefs
    │   │   └── MailApp.tsx           # Contact form
    │   └── mobile/                  # Responsive mobile components
    │       ├── MobileBottomSheet.tsx  # 92vh swipe-to-dismiss sheet
    │       ├── MobileTabBar.tsx      # 52px bottom tab navigation
    │       └── MobileAudioBar.tsx    # 44px sticky mini player
    ├── stores/
    │   ├── useOSStore.ts            # Window manager, theme, desktop mode state
    │   └── useMusicStore.ts         # Audio playback, playlist, volume state
    ├── systems/
    │   ├── GlobalAudioManager.ts    # Singleton AudioContext, gain routing, ducking
    │   ├── SoundSynthesizer.ts      # Procedural Web Audio FX (via GlobalAudioManager)
    │   ├── ShortcutRegistry.ts      # Global keyboard shortcut dispatcher
    │   ├── CursorStateMachine.ts    # FSM: kinetic-hero / precision-drag / magnetic-dock / disabled
    │   └── MediaSessionController.ts # W3C Media Session API bridge
    ├── hooks/
    │   ├── useWindowDrag.ts         # Pointer drag w/ clamping logic
    │   ├── useWindowResize.ts       # 8-direction resize handles
    │   ├── useBreakpoint.ts         # Responsive: isMobile, hasPointer, hasHover
    │   └── useGyroscope.ts          # DeviceOrientationEvent w/ iOS permission
    └── lib/
        ├── physics.ts               # Spring-mass-damper integrator (k=280, c=24, m=1)
        ├── magnification.ts         # Cosine Bell formula: W(d) = Wbase + ΔW·(1+cos(πd/R))/2
        └── constants.ts             # All configurable values from config/env
```

---

## IMPLEMENTATION ORDER (5 SPRINTS)

Execute in this exact order. Each sprint depends on the previous.

---

### SPRINT 1 — Core OS Framework

**Goal**: Desktop renders with menu bar, icons, wallpaper, theme switching.

**Steps** (execute in order):

1. **Initialize project** at `d:\CODE\Html\Showcase\` with Next.js + TypeScript + Tailwind + App Router + src dir
2. **Install deps**: `framer-motion`, `zustand`, `lucide-react`
3. **Configure `globals.css`**: Implement ALL CSS custom properties from `visual-system.md` — both light and dark mode tokens. Include glassmorphism utility classes. Dark mode via `.dark` class on `<html>`.
4. **Configure `tailwind.config.ts`**: Extend theme with OS z-index scale (`{10, 20, 30, 40, 50, 9990, 9992, 9995, 9999}`), backdrop-blur values (`{os-window: '28px', os-dock: '20px', os-menu: '40px', os-deck: '32px'}`), custom colors from tokens.
5. **Import fonts** via `next/font/google`: Inter (variable, weight 100-900) and JetBrains_Mono. Apply to `<html>`.
6. **Build `useOSStore.ts`**: Implement the full Zustand store matching the TypeScript interface in `state-architecture.md`. Include all actions: `openWindow`, `closeWindow`, `minimizeWindow`, `toggleMaximize`, `focusWindow`, `updatePosition`, `updateSize`, `setDesktopMode`, `setTheme`, `setWallpaper`. Add `persist` middleware for `theme`, `wallpaperId`, `soundEnabled`, `desktopMode`.
7. **Build `layout.tsx`**: Root layout with font application, `overflow: hidden`, `user-select: none`, `100vw × 100vh`, viewport meta, SEO tags (title, description, OG).
8. **Build `TopMenuBar.tsx`**: 28px fixed bar at z-50, glassmorphic background per theme, Apple logo SVG (14×14), dynamic app name from `useOSStore.activeWindowId`, menu items (File/Edit/View/Window/Help — hidden below 640px), status tray (Wi-Fi/Battery/Volume icons from Lucide), LiveClock displaying `Day Mon DD H:MM AM/PM`.
9. **Build `DesktopCanvas.tsx`**: Full viewport container at z-10, positioned `top: 28px`, `height: calc(100vh - 28px)`. Renders wallpaper image (`object-cover`) with tint overlay (`bg-black/25` dark, `bg-black/10` light). Handles click-to-deselect, right-click for context menu.
10. **Build `DesktopGrid.tsx` + `DesktopIcon.tsx`**: Grid with `grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 p-4`. Icons: 48×48px with `drop-shadow`, 11px white label with text-shadow, max 84px width 2-line clamp. Hover: `scale(1.05)` 150ms. Click logic: 300ms disambiguation timer — single click selects, double click launches app via `openWindow()`.
11. **Build `ShortcutRegistry.ts`**: Global `keydown` listener. Map: `Cmd/Ctrl+K` → toggle Spotlight, `Cmd/Ctrl+W` → close active window, `Cmd/Ctrl+M` → minimize active window, `Escape` → dismiss modals/menus, `Cmd/Ctrl+Shift+D` → toggle theme, `Cmd/Ctrl+Option/Alt+M` → toggle desktop mode. Detect Mac vs Windows for Cmd vs Ctrl.
12. **Build `page.tsx`**: Compose all layers — KineticHeroStage (placeholder div for now at z-0), DesktopCanvas+Grid at z-10, WindowManager placeholder, TopMenuBar at z-50, Dock placeholder.

**Sprint 1 Quality Gate**: Desktop renders with correct wallpaper, 28px glassmorphic menu bar with live clock, icon grid with hover effects, dark/light theme toggle via Cmd+Shift+D, state persists across reload.

---

### SPRINT 2 — Window Manager & Applications

**Goal**: Windows open/close/drag/resize with all animations and traffic light controls. All 6 app contents rendered.

**Steps**:

1. **Build `WindowFrame.tsx`**: 
   - Glassmorphic container: `backdrop-filter: blur(28px) saturate(180%)`, `border-radius: 12px` (0 when maximized), body bg per theme from `visual-system.md`
   - 36px header with grab cursor, title (12px semibold) + icon (16×16), TrafficLights component
   - Header bottom border: `border-black/10 dark:border-white/10`
   - Shadow system: 4 variants (active/inactive × light/dark) from `visual-system.md`. Transition `duration-200`
   - Positioned `absolute` with `left`/`top` in pixels from `useOSStore.windows[id].position`

2. **Build `useWindowDrag.ts` hook**:
   - `pointerdown` on header starts drag, `pointermove` updates position, `pointerup` ends
   - Clamping: `x = max(-(width - 100), min(x, viewportWidth - 100))`, `y = max(28, min(y, viewportHeight - 60))`
   - Cursor: `cursor-grab` default, `cursor-grabbing` while dragging
   - Don't drag if maximized

3. **Build `useWindowResize.ts` hook**:
   - 8 handles: N/S (6px height, full width minus 8px), E/W (6px width, full height minus 8px), corners (12×12px)
   - Correct cursors: `ns-resize`, `ew-resize`, `nesw-resize`, `nwse-resize`
   - Min size enforcement: 360×240px
   - Don't resize if maximized

4. **Build `TrafficLights.tsx`**:
   - 3× 12px circles with 8px gap: Red `#FF5F56` (border `#E0443E`), Yellow `#FFBD2E` (border `#DEA123`), Green `#27C93F` (border `#1AAB29`)
   - Hover glyphs: `✕` (red), `−` (yellow), `⤢` (green) — shown only on parent group hover, glyph color 75% opacity dark
   - Click: red → `closeWindow(id)`, yellow → `minimizeWindow(id)`, green → `toggleMaximize(id)`
   - Unfocused: all three become `#D4D4D8` gray with no glyphs

5. **Window animations (Framer Motion)**:
   - **Open**: Wrap in `motion.div` with `initial={{ scale: 0.85, opacity: 0, filter: 'blur(8px)' }}`, `animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}`, spring `stiffness: 380, damping: 30, mass: 0.8`
   - **Close**: `exit={{ scale: 0.88, opacity: 0, filter: 'blur(4px)' }}`, duration 180ms, `cubic-bezier(0.4, 0, 0.6, 1)`
   - **Maximize**: Animate `x`, `y`, `width`, `height` to fill viewport, `borderRadius` from 12→0, 320ms, `cubic-bezier(0.2, 0.9, 0.2, 1)`. Store `prevBounds` before maximizing.
   - **Minimize**: `scale → 0.1`, `opacity → 0`, `y → dockY`, 320ms. Use `AnimatePresence`.
   - **Focus change**: `box-shadow` transition 150ms ease-out

6. **Window cascade**: `spawnX = baseX + (N_open × 24) % (vw - width)`, `spawnY = baseY + (N_open × 24) % (vh - height - 28)`

7. **Build `WindowManager.tsx`**: Reads `useOSStore.windows`, renders `<AnimatePresence>` wrapping all open, non-minimized windows as `<WindowFrame>` components, z-ordered by state.

8. **Build all 6 app components** (content inside windows):
   - **`TerminalApp.tsx`**: JetBrains Mono font, green-on-dark theme, command input, Neofetch ASCII art display, command history with up/down arrows, basic commands (help, clear, whoami, ls, cd, cat), Easter eggs
   - **`ProjectsApp.tsx`**: Category filter pills (All, Web, Mobile, Design), project cards with thumbnail, title, description, tech stack tags. Filterable grid/list.
   - **`AboutApp.tsx`**: Bio section with photo placeholder, career timeline (vertical), skill categories with visual bars or radar, PDF resume download link
   - **`FinderApp.tsx`**: 3-column: left sidebar (folder tree), center (file list with icons + names + sizes + dates), right (preview pane). Navigable folder structure.
   - **`SettingsApp.tsx`**: Left sidebar categories (General, Appearance, Dock, Sound). Panels: wallpaper picker grid, dark/light/system toggle, dock magnification on/off + size slider, sound FX toggle
   - **`MailApp.tsx`**: Contact form (Name, Email, Subject, Message textarea), field validation, submit button with paper airplane animation on send

9. **Build `ContextMenu.tsx`**: Right-click creates menu at position clamped to viewport bounds. ~220px wide, glassmorphic bg, 32px row height, Lucide icons, hover highlight. Click outside or Escape dismisses. `AnimatePresence` entrance: `scale(0.95) → 1`, `opacity 0 → 1`, ~150ms.

10. **Build `SpotlightSearch.tsx`**: Cmd+K toggles. Centered modal with backdrop blur overlay. Search input with magnifying glass icon. Live fuzzy filter of app names/descriptions. Arrow key navigation through results, Enter launches, Escape dismisses.

**Sprint 2 Quality Gate**: Can open/close/drag/resize any of 6 app windows, traffic lights work, cascade positioning, correct shadow transitions on focus, window animations smooth at 60fps.

---

### SPRINT 3 — Luca Dock + Nidal Music Player

**Goal**: Parabolic dock with spring magnification, music pill, expanded audio deck.

**Steps**:

1. **Build `Dock.tsx`** (chassis):
   - `position: fixed; bottom: 0; left: 0; right: 0; z-index: 9990; pointer-events: none`
   - Inner wrapper: `display: flex; justify-content: center; padding-bottom: max(16px, env(safe-area-inset-bottom))`
   - Chassis div: `pointer-events: auto; display: flex; flex-direction: row; align-items: flex-end; gap: 6px; padding: 12px 12px 8px 12px; border-radius: 9999px`
   - Glassmorphism: `bg: rgba(18,18,22,0.70)`, `backdrop-filter: blur(20px) saturate(190%) contrast(105%)`, `border: 1px solid rgba(255,255,255,0.12)`, `box-shadow: inset 0 1px 1px 0 rgba(255,255,255,0.22), 0 12px 36px -4px rgba(0,0,0,0.55), 0 4px 16px -2px rgba(0,0,0,0.35)`
   - Create shared `mouseX = useMotionValue(0)`. On `onMouseMove`, set `mouseX` to `e.clientX`. On `onMouseLeave`, set `mouseX` to `Infinity` (all items return to base size).

2. **Build `DockItem.tsx`**:
   - Receives `mouseX` MotionValue, `itemRef` for position measurement
   - Calculate distance: `useTransform(mouseX, (val) => val - itemBoundsCenter)` 
   - Apply Cosine Bell: `useTransform(distance, [-150, 0, 150], [44, 68, 44])` → pipe through `useSpring({ mass: 0.1, stiffness: 420, damping: 26 })`
   - Apply spring-driven `width` and `height` to `motion.button`
   - Icon surface: squircle (`border-radius: 22%`), gradient background per-app, 60% SVG icon, gloss overlay (`linear-gradient(rgba(255,255,255,0.15) 0%, transparent 60%)`)
   - Press: `whileTap={{ scale: 0.88 }}` with `transition: { type: 'spring', stiffness: 600, damping: 20 }`
   - Click: if app closed → `openWindow(appId)` + bounce animation (`animate: { y: [0, -12, 0, -8, 0, -4, 0] }`). If app open → `focusWindow(appId)`. If minimized → restore.
   - Add `data-cursor="magnetic-dock"` attribute for cursor FSM

3. **Build `DockTooltip.tsx`**: `AnimatePresence mode="wait"`. On hover, show label positioned above icon, `initial={{ y: 8, opacity: 0, scale: 0.9 }}`, `animate={{ y: 0, opacity: 1, scale: 1 }}`, spring transition. `exit={{ opacity: 0 }}` 100ms. Styling: `bg: rgba(24,24,28,0.88)`, `backdrop-blur(12px)`, `border-radius: 6px`, `padding: 4px 10px`, `font: 11.5px/500`, 5px CSS triangle arrow.

4. **Build `DockDivider.tsx`**: `<div role="separator" aria-orientation="vertical" />`, 1px × 32px, `rgba(255,255,255,0.12)`, margin `0 4px`.

5. **Build `ActiveDotIndicator`** (within DockItem): 3px circle below icon (`bottom: -6px`), `rgba(255,255,255,0.85)`, `box-shadow: 0 0 4px rgba(255,255,255,0.4)`. Show when app has open window, dim (`opacity: 0.4`) when minimized, hide when closed.

6. **Build `GlobalAudioManager.ts`** (singleton):
   ```
   class GlobalAudioManager {
     private ctx: AudioContext | null = null;
     private masterGain: GainNode;
     private musicGain: GainNode;
     private fxGain: GainNode;
     
     initialize() { /* Create AudioContext on first user gesture */ }
     connectMusicSource(audio: HTMLAudioElement): MediaElementAudioSourceNode { /* Bridge HTML5 audio */ }
     getAnalyser(): AnalyserNode { /* For FFT visualizer */ }
     triggerDuck() { /* musicGain.setTargetAtTime(0.20, now, 0.040); schedule restore at 0.250 */ }
     getFxGain(): GainNode { /* For SoundSynthesizer routing */ }
   }
   ```

7. **Build `useMusicStore.ts`**: Full Zustand store matching `state-architecture.md § 2`. Playlist of 3 sample tracks (configure paths in constants). Actions: `play()`, `pause()`, `togglePlayPause()`, `nextTrack()`, `prevTrack()`, `seekTo(time)`, `setVolume(v)`, `toggleMute()`, `toggleShuffle()`, `cycleRepeat()`, `toggleDeckExpanded()`. `persist` middleware for: currentIndex, currentTime, volume, isMuted, isShuffled, repeatMode.

8. **Build `MusicPlayerDockPill.tsx`**: 120px base width in dock (after DockDivider). Contains: album art thumbnail (28×28, rounded 6px), track title (11px truncated), 3 equalizer bars (CSS keyframe animation — bar heights staggered at 0.8s/1.2s/0.6s, running when PLAYING, paused otherwise), play/pause toggle button (24×24). Click body → `toggleDeckExpanded()`.

9. **Build `AudioDeckExpanded.tsx`** (z-9992):
   - Positioned above dock, centered. ~340×480px.
   - Glassmorphism: `blur(32px) saturate(200%)`, `rgba(18,18,22,0.70)`, `border-radius: 20px`, deep shadow
   - `AnimatePresence`: `initial={{ y: 20, opacity: 0 }}`, `animate={{ y: 0, opacity: 1 }}` spring, `exit={{ y: 12, opacity: 0 }}` 200ms
   - Header: "NOW PLAYING" badge with animated green dot, queue toggle, collapse (chevron-down)
   - VinylDisc + album art card (overlapping)
   - Track title (16px/600) + artist (13px/400 muted)
   - ProgressScrubber
   - TransportControls (shuffle, prev, play/pause 44px, next, repeat)
   - Volume slider (3px track, 10px handle)
   - AudioVisualizer canvas

10. **Build `VinylDisc.tsx`**: 200px circle, concentric groove rings via `radial-gradient`, 60px center label with album art. `animation: spin 3s linear infinite` when PLAYING, `animation-play-state: paused` when PAUSED. Track change: slide out (`translateX(-20px), opacity 0`) → slide in.

11. **Build `AudioVisualizer.tsx`**: `<canvas>` with `requestAnimationFrame` loop. Read `AnalyserNode.getByteFrequencyData()` (fftSize: 64, 32 bins). Draw vertical bars with track accent color at varying opacity. Full width, ~60px height.

12. **Build `ProgressScrubber.tsx`**: 4px track (6px on hover), accent fill, 12px handle visible on hover. Drag to seek. Hover shows timestamp tooltip. Time labels: elapsed (left) and remaining (right) in `mm:ss`.

13. **Build `SoundSynthesizer.ts`** (modified): Route oscillator → `GlobalAudioManager.getFxGain()` (not own AudioContext). Call `GlobalAudioManager.triggerDuck()` before each FX play. Sounds: window open (short chime), close (whoosh), error (dissonant).

14. **Build `MediaSessionController.ts`**: Set `navigator.mediaSession.metadata`, bind `setActionHandler` for play/pause/previoustrack/nexttrack/seekto.

**Sprint 3 Quality Gate**: Dock magnifies smoothly at 60fps, music plays on click (never auto-starts), vinyl spins, FFT visualizer responds to audio, AudioContext created only on first user gesture, dock active dots reflect window state, ducking audible when UI sound plays during music.

---

### SPRINT 4 — Michal Kinetic Typography & Cursor

**Goal**: Per-character physics typography on Layer 0, dual-tier cursor with context FSM.

**Steps**:

1. **Build `KineticHeroStage.tsx`**: Layer 0 (z-0), `100vw × 100dvh`, centered content. Configurable hero text (e.g., "CREATIVE\nDEVELOPER" or portfolio owner's name). Font: Inter Variable, `clamp(4.5rem, 14vw + 1rem, 18.5rem)`, uppercase, white, `line-height: 0.85-1.0`. Opacity: `0.35` in workspace mode, `1.0` in ambient-hero mode (read from `useOSStore.desktopMode`). Transition opacity over 400ms.

2. **Build `SplitText.tsx` + `physics.ts`**:
   - On mount: split source text into per-character `<span>` elements. Each span gets `will-change: transform; display: inline-block`.
   - Cache rest positions: `Float32Array(charCount × 8)` — fields: `[x0, y0, x, y, vx, vy, ax, ay]` per character. Computed via `getBoundingClientRect()` on mount and `resize`.
   - `requestAnimationFrame` loop with `performance.now()` delta-time:
     ```
     For each character i:
       dx = x[i] - x0[i]
       dy = y[i] - y0[i]
       d_cursor = distance(cursor, rest[i])
       
       // Cursor force (Gaussian falloff)
       if d_cursor < 260:
         alpha = exp(-d_cursor² / (2 × 104²))
         F = forceMultiplier × alpha × unitVectorAway
       else:
         F = 0
       
       // Spring-mass-damper
       ax = (-280 × dx - 24 × vx + Fx) / 1.0
       ay = (-280 × dy - 24 × vy + Fy) / 1.0
       
       // Semi-implicit Euler
       vx += ax × dt
       vy += ay × dt
       x[i] += vx × dt
       y[i] += vy × dt
       
       // Clamp max displacement
       displacement = sqrt(dx² + dy²)
       if displacement > 65: scale back to 65
       
       // Apply transform
       span.style.transform = `translate(${x[i]-x0[i]}px, ${y[i]-y0[i]}px)`
       
       // Variable font modulation
       weight = 400 + (900-400) × alpha
       span.style.fontVariationSettings = `'wght' ${weight}`
     ```
   - Cursor position shared via `ref` from KineticCursor (NOT React state — no re-renders in animation loop)
   - GPU promotion: `transform: translateZ(0)` on container

3. **Build ambient harmonic wave** (in SplitText): When no cursor present (mouse left viewport) or on mobile, apply: `dx[i] = amplitude × sin(2π × freq × time + phaseOffset[i])`. Amplitude: 3px, freq: 0.7Hz, phase offset: `i × 0.15`.

4. **Build `KineticCursor.tsx`**: Controller component at z-9999. Tracks mouse via `pointermove` on `document`. Stores position in `useRef` (not state). Computes velocity via EMA: `V_smooth = 0.75 × V_smooth_prev + 0.25 × V_instant`. Speed: `|V_smooth|`. Passes position/velocity to CursorDot and CursorAura via refs. Invisible on touch devices (check `matchMedia('(pointer: fine)')`).

5. **Build `CursorDot.tsx`**: 4px white circle, `position: fixed`, `pointer-events: none`, `z-index: 9999`. Directly follows mouse position (zero lag — reads position ref each frame or uses CSS `left`/`top` updated in `pointermove`).

6. **Build `CursorAura.tsx`**: 
   - Lerp-follows cursor: each frame `auraPos += (cursorPos - auraPos) × λ` where `λ = 1 - (1-0.15)^(dt/16.67)`
   - Radius: `24 + 0.08 × speed` (clamped to 80px max)
   - Style: `mix-blend-mode: difference`, `border: 2px solid rgba(255,255,255,0.6)`, white fill or border-only circle
   - `pointer-events: none`, `position: fixed`

7. **Build `CursorStateMachine.ts`**: On `pointermove`, check `event.target` for `data-cursor` attribute:
   - `data-cursor="precision-drag"` → collapse aura (`scale: 0, opacity: 0`, 100ms)
   - `data-cursor="magnetic-dock"` → morph aura to squircle, snap to item bounds (spring: stiff 500, damp 28)
   - No attribute / `data-cursor="kinetic-hero"` → full aura ring, difference blend
   - Touch device → disabled (no elements rendered)

8. **Add `data-cursor` attributes** to interactive elements:
   - Window header → `data-cursor="precision-drag"`
   - Resize handles → `data-cursor="precision-drag"`
   - Dock items → `data-cursor="magnetic-dock"`
   - Desktop canvas → `data-cursor="kinetic-hero"`

9. **Gyroscope fallback** (`useGyroscope.ts`): For mobile, request `DeviceOrientationEvent.requestPermission()` on first tap (iOS 13+). Map `β` (front-back tilt, ±45°) and `γ` (left-right tilt, ±45°) to character displacement vector. Fallback to ambient wave if permission denied.

**Sprint 4 Quality Gate**: Characters displace with snappy underdamped spring feel (overshoot visible), cursor dot has zero lag, aura ring visibly trails, difference blend inverts colors, aura collapses over resize handles, magnetizes over dock items, idle wave plays when cursor leaves viewport. <1.5ms JS per frame measured in DevTools.

---

### SPRINT 5 — Mobile Responsive & Polish

**Goal**: Full mobile experience, performance verified, accessibility, final polish.

**Steps**:

1. **Build `useBreakpoint.ts` hook**: Returns `{ isMobile: boolean, isTablet: boolean, isDesktop: boolean, hasPointer: boolean, hasHover: boolean }`. Uses `matchMedia` with live listeners. Mobile: `<768px`. Pointer: `(pointer: fine)`. Hover: `(hover: hover)`.

2. **Build `MobileBottomSheet.tsx`**: 
   - `height: 92vh`, full width, `border-radius: 20px 20px 0 0`, grab handle (40px × 4px centered bar, `bg-white/30`)
   - Swipe-to-dismiss: track `pointerdown` → `pointermove` → `pointerup`. If `scrollTop === 0` and `deltaY > 0`, translate sheet down. Release: if `deltaY > 140px` → dismiss (spring to `translateY(100vh)`), else → snap back (spring to 0).
   - Internal scroll: `overscroll-behavior: contain`. Don't trigger dismiss if content is scrolled.

3. **Build `MobileTabBar.tsx`**: `position: fixed; bottom: 0; height: calc(52px + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom)`. 5 app icons (Finder, Terminal, Projects, About, Mail) equally spaced. Single tap → open app as bottom sheet. Active app icon highlighted.

4. **Build `MobileAudioBar.tsx`**: 44px, positioned `bottom: calc(52px + env(safe-area-inset-bottom))`. Mini album art (28px), truncated title, play/pause button. Tap → expand fullscreen music player bottom sheet with all controls.

5. **Responsive adaptations** (add conditions throughout existing components):
   - Windows: if `isMobile` → render as `MobileBottomSheet` instead of `WindowFrame`
   - Dock: if `isMobile` → render `MobileTabBar` instead of floating dock (magnification disabled)
   - KineticCursor: if `!hasPointer` → don't render
   - KineticHeroStage: if `!hasPointer` → use gyroscope/ambient wave instead of cursor physics
   - DesktopGrid: if `isMobile` → hide
   - TopMenuBar: if `isMobile` → simplified (Apple logo, centered clock, search icon only)
   - ContextMenu: if `isMobile` → trigger on long-press (500ms) instead of right-click
   - SpotlightSearch: if `isMobile` → search icon in header, full-screen sheet instead of modal

6. **Performance optimization**:
   - Verify 60fps for dock magnification (Framer Motion MotionValue must run outside React reconciliation)
   - Verify <1.5ms JS per frame for kinetic typography (use `Float32Array`, avoid GC, direct DOM style mutation)
   - Add `will-change: transform` on animated elements
   - Lazy-load app contents (dynamic import with `next/dynamic`)
   - Optimize wallpaper images: serve WebP/AVIF, responsive srcset

7. **Accessibility**:
   - `prefers-reduced-motion`: disable kinetic typography displacement (static text), reduce window animations to opacity-only (no scale/blur), disable dock magnification (fixed size)
   - Focus trap within active window (Tab cycles through window content)
   - ARIA: `role="dialog"` + `aria-label` on windows, `role="navigation"` on dock, `role="menubar"` on TopMenuBar, `aria-label` on all buttons
   - Skip-to-content link (hidden, shows on focus)
   - All interactive elements have unique `id` attributes for testing

8. **Final integration testing** against QA matrices:
   - Run through all 64 visual criteria from `visual-reference-matrix.md`
   - Run through all 90 functional test cases from `interaction-validation-matrix.md`
   - Test browsers: Chrome, Safari, Firefox, iOS Safari, Chrome Android
   - Test viewports: 1440px, 1024px, 768px, 420px, 375px

**Sprint 5 Quality Gate**: All 90 interaction test cases pass. Mobile sheets swipe correctly. Tab bar navigation works. Music plays on mobile. No cursor elements on touch devices. Lighthouse performance ≥90. `prefers-reduced-motion` respected.

---

## CRITICAL RULES

### MUST Follow
1. **Read the spec files before coding.** Every value is documented — do not guess colors, dimensions, timing, easing, or spring parameters.
2. **Use exact values from visual-system.md** for all colors, dimensions, typography, glassmorphism.
3. **Use exact values from motion-system.md** for all animation durations, easing curves, spring configs.
4. **Match interaction-map.md** for all input→action→result behaviors.
5. **Audio must NEVER auto-start.** AudioContext created inside user gesture handler only.
6. **Maintain store isolation**: `useOSStore` for windows/OS, `useMusicStore` for audio. Never cross-contaminate.
7. **Performance**: Dock magnification via Framer Motion MotionValue (outside React render). Typography physics via RAF + Float32Array (outside React render). No `useState` in animation loops.
8. **Test each sprint** before proceeding to the next.
9. **All configurable values** (wallpaper paths, audio file paths, hero text, force multipliers) must live in `constants.ts` or environment variables — never hardcoded in component files.

### MUST NOT Do
1. ❌ Do not redesign any component — reproduce source exactly
2. ❌ Do not merge unrelated stores (music into OS store, cursor into window state)
3. ❌ Do not invent interactions not in the spec
4. ❌ Do not skip GlobalAudioManager — all audio routes through it
5. ❌ Do not use PP Neue Montreal (proprietary) — use Inter Variable
6. ❌ Do not use `useState` or `useEffect` for 60fps animation loops — use `requestAnimationFrame` + refs
7. ❌ Do not create multiple AudioContexts — one singleton via GlobalAudioManager
8. ❌ Do not ignore mobile responsive — it's fully specified
9. ❌ Do not hardcode file paths, model paths, or API endpoints in source code — use config files or environment variables

### Known PROBABLE Values (Tune by Feel)
These values are best-estimates from Phase 1. Implement as specified, but adjust if visual/interaction feel doesn't match the reference:
- Dock gap: 6px
- Dock divider height: 32px
- Audio deck dimensions: 340×480px
- Vinyl disc: 200×200px
- Ambient wave: amplitude 3px, frequency 0.7Hz
- Cursor force multiplier: ~75
- Gaussian σ: ~104px
- Context menu long-press: 500ms
- Desktop mode transition: 400ms

---

## ASSETS TO ACQUIRE BEFORE SPRINT 1

1. **Wallpapers**: 4-6 high-resolution images (3840×2160 or larger) in WebP format. Source from Unsplash/Pexels (royalty-free). Store in `public/wallpapers/`.
2. **Sample audio tracks**: 3 royalty-free ambient/lofi tracks (2-4 min each) in MP3 format. Store in `public/audio/tracks/`.
3. **Album artwork**: 3 placeholder album covers (512×512px) in WebP. Store in `public/audio/artwork/`.
4. **Fonts**: Inter Variable and JetBrains Mono load via `next/font/google` (no manual download needed).
5. **Icons**: All via Lucide React (no external icon files).

---

## SUCCESS CRITERIA

Phase 3 is complete when:
- [ ] Desktop OS renders with glassmorphic menu bar, wallpaper, icon grid
- [ ] 6 windows open/close/drag/resize with correct spring animations
- [ ] Traffic lights (close/minimize/maximize) work with focus-aware styling
- [ ] Luca dock magnifies with Cosine Bell curve at 60fps
- [ ] Music plays (user-initiated only), vinyl spins, FFT visualizer responds
- [ ] Audio ducking works (music ducks when UI sound plays)
- [ ] Kinetic typography displaces per-character with spring physics at 60fps
- [ ] Custom cursor (dot + aura) tracks with difference blend and contextual FSM
- [ ] Dark/light theme toggles correctly, persists across reload
- [ ] Mobile: bottom sheets, tab bar, sticky audio bar all functional
- [ ] All keyboard shortcuts work (Cmd+K, Cmd+W, Cmd+M, Cmd+Shift+D, Cmd+Option+M, Escape)
- [ ] `prefers-reduced-motion` disables physics and reduces animations
- [ ] Lighthouse performance ≥90
- [ ] All 90 interaction test cases from QA matrix pass
