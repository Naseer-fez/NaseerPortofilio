# Implementation Specification — Sprint Plan
## Phase 2 Implementation Document

---

## Sprint Overview

| Sprint | Focus | Estimated Complexity |
|--------|-------|---------------------|
| Sprint 1 | Core OS Framework | Foundation — all others depend on this |
| Sprint 2 | Window Manager & Apps | Primary user-facing feature |
| Sprint 3 | Luca Dock + Nidal Music | Navigation + widget |
| Sprint 4 | Michal Typography & Cursor | Interaction polish |
| Sprint 5 | Mobile & Polish | Responsive + performance |

---

## Sprint 1: Core OS Framework

### 1.1 Project Initialization
- Initialize Next.js 14+ with App Router, TypeScript, Tailwind CSS
- Configure `tailwind.config.ts`: extend theme with OS tokens (colors, border-radius, backdrop-blur, z-index scale)
- Set up `globals.css` with CSS custom properties for all light/dark tokens from `visual-system.md`
- Import Inter Variable + JetBrains Mono via `next/font`
- Reference: [visual-system.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/visual-system.md)

### 1.2 useOSStore (Zustand)
- Implement complete window manager state per `state-architecture.md` TypeScript interfaces
- Actions: `openWindow`, `closeWindow`, `minimizeWindow`, `toggleMaximize`, `focusWindow`, `updatePosition`, `updateSize`, `setDesktopMode`, `setTheme`, `setWallpaper`
- localStorage middleware for: `theme`, `wallpaperId`, `soundEnabled`, `desktopMode`
- Reference: [state-architecture.md](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/state-architecture.md)

### 1.3 Root Layout & Theme
- `layout.tsx`: Apply system font stack, `overflow: hidden`, `user-select: none`, `100vw × 100vh`
- Theme: Read localStorage → apply `.dark` class on `<html>` → CSS variables toggle
- SEO: Title, meta description, OG tags

### 1.4 DesktopCanvas + Wallpaper
- Full viewport minus 28px (menu bar height), z-index 10
- Wallpaper: `object-cover` with tint overlay (dark: `bg-black/25`, light: `bg-black/10`)
- Wallpaper swap: 700ms crossfade
- Reference: [base-site-reverse-engineering.md § 2](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/base-site-reverse-engineering.md)

### 1.5 DesktopGrid + DesktopIcon
- Grid: `grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 p-4`
- Icons: 48×48, 11px labels, hover scale(1.05), double-click → `openWindow()`
- Single click: 300ms disambiguation timer before select
- Reference: [base-site-reverse-engineering.md § 3](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/base-site-reverse-engineering.md)

### 1.6 TopMenuBar
- 28px fixed bar, blur-2xl, dynamic app name from `activeWindowId`
- Left: Apple logo + app name + menus (hidden <640px)
- Right: Status icons + LiveClock (format: `Sat Aug 15 12:51 PM`)
- Reference: [base-site-reverse-engineering.md § 5](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/base-site-reverse-engineering.md)

### 1.7 ShortcutRegistry
- Global `keydown` listener in root layout
- Map: `Cmd+K` → Spotlight, `Cmd+W` → close, `Cmd+M` → minimize, `Escape` → dismiss, `Cmd+Shift+D` → theme toggle, `Cmd+Option+M` → desktop mode
- Reference: [interaction-map.md § Keyboard](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/interaction-map.md)

---

## Sprint 2: Window Manager & Apps

### 2.1 WindowFrame
- Glassmorphic: `blur(28px) saturate(180%)`, `rounded-xl`, shadow system (4 variants)
- Header: 36px, grab cursor, drag to move
- Drag clamping: `x_clamped = max(-(w-100), min(x, vw-100))`, `y ≥ 28`
- Cascade spawning: offset 24px per open window
- Reference: [base-site-reverse-engineering.md § 4](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/base-site-reverse-engineering.md)

### 2.2 TrafficLights
- 12px circles, 8px gap, hover glyphs (✕, −, ⤢)
- Click handlers: close/minimize/maximize
- Unfocused state: gray dots
- Reference: [base-site-reverse-engineering.md § 4.2](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/base-site-reverse-engineering.md)

### 2.3 Window Animations (Framer Motion)
- Open: scale [0.85→1], opacity [0→1], blur [8→0], 280ms, spring(380,30,0.8)
- Close: scale [1→0.88], opacity [1→0], blur [0→4], 180ms
- Maximize: bounds + radius transition, 320ms
- Minimize: scale→0.1, y→dockY, 320ms
- Reference: [motion-system.md § Window](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/design/motion-system.md)

### 2.4 Window Resize
- 8-direction handles (6px edge, 12px corner)
- Min size enforcement: 360×240
- Reference: [base-site-reverse-engineering.md § 4.7](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/base-site-reverse-engineering.md)

### 2.5 Application Components
- **Terminal**: Monospace (JetBrains Mono), command input, Neofetch display, command history, Easter eggs
- **Projects**: Filterable gallery, category pills, project cards with tech stack tags
- **About**: Bio section, career timeline, skill visualization, PDF resume link
- **Finder**: Left sidebar tree, main pane file list, preview panel
- **Settings**: Wallpaper picker grid, theme toggle, dock magnification slider, sound FX toggle
- **Mail**: Contact form (name, email, subject, message), validation, paper airplane send animation

### 2.6 Context Menu
- Right-click → glassmorphic popover, ~220px, clamped to viewport
- Menu items: 32px rows, hover highlight, icons left-aligned
- Dismiss: click outside, Escape

### 2.7 Spotlight Search
- Cmd+K → centered modal, backdrop blur overlay
- Search input with icon, live filtered results
- Arrow key navigation, Enter to launch, Escape to dismiss

---

## Sprint 3: Luca Dock + Nidal Music

### 3.1 Dock Chassis
- Fixed bottom center, z-9990, pill shape (rounded-full)
- Glassmorphism: blur(20px) saturate(190%), specular hairline
- Flex row, align-items: flex-end (grow upward)
- Reference: [luca-taskbar-analysis.md § 2-3](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/luca-taskbar-analysis.md)

### 3.2 DockItem + Magnification
- Shared `mouseX` MotionValue from Dock root
- Per-item: `useTransform(mouseX, [range], [sizes])` → `useSpring(transformed, {mass:0.1, stiff:420, damp:26})`
- Cosine Bell: `W(d) = 44 + 24·(1+cos(πd/150))/2`
- Reference: [luca-taskbar-analysis.md § 5](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/luca-taskbar-analysis.md)

### 3.3 DockTooltip
- AnimatePresence with spring entrance, fade exit
- Reference: [luca-taskbar-analysis.md § 8](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/luca-taskbar-analysis.md)

### 3.4 ActiveDotIndicator
- 3px circle below icon, glow effect
- Bind to `useOSStore.windows` — show when app open, dim when minimized

### 3.5 GlobalAudioManager
- Singleton pattern (module-level or lazy init)
- Creates AudioContext on first user gesture
- Audio graph: MediaElementSource → musicGain → masterGain → destination
- FX path: OscillatorNode → fxGain → masterGain → destination
- Duck: musicGain.setTargetAtTime(0.20, now, 0.040) on FX trigger, restore(0.250)
- Reference: [nidal-player-analysis.md § 5, 10](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/nidal-player-analysis.md)

### 3.6 useMusicStore (Zustand)
- State: playlist, currentIndex, status, currentTime, duration, volume, isMuted, isShuffled, repeatMode, isDeckExpanded
- localStorage: currentIndex, currentTime, volume, isMuted, isShuffled, repeatMode
- Reference: [state-architecture.md § 2](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/architecture/state-architecture.md)

### 3.7 MusicPlayerDockPill
- 120px in dock, after divider
- Mini artwork, truncated title, 3-bar equalizer, play/pause
- Click → toggle isDeckExpanded

### 3.8 AudioDeckExpandedCard
- Positioned above dock, z-9992
- Vinyl disc (200px, 3s spin), album art card overlay
- Transport controls: shuffle, prev, play/pause (44px), next, repeat
- Progress scrubber: 4px track, 12px handle on hover, time labels
- Volume slider
- Canvas FFT visualizer (fftSize: 64)
- Reference: [nidal-player-analysis.md § 3-5](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/nidal-player-analysis.md)

### 3.9 MediaSessionController
- Set metadata (title, artist, album, artwork)
- Bind action handlers: play, pause, previoustrack, nexttrack, seekto

### 3.10 SoundSynthesizer (Modified)
- Route through GlobalAudioManager.fxGain instead of independent AudioContext
- Trigger ducking on each FX play

---

## Sprint 4: Michal Typography & Cursor

### 4.1 KineticHeroStage
- Layer 0 (z-0), 100vw × 100dvh
- Text content: configurable hero text
- Workspace mode: opacity 0.35, reduced physics
- Ambient mode: opacity 1.0, full physics
- Reference: [michal-interaction-analysis.md § 1](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/michal-interaction-analysis.md)

### 4.2 SplitText + PhysicsEngine
- Split source text into per-character `<span>` elements
- Cache rest positions in Float32Array on mount + resize
- Semi-implicit Euler integration per frame:
  - `a = (-k(x-x0) - c·v + F_cursor) / m`
  - `v += a · dt`, `x += v · dt`
- Cursor force: Gaussian falloff `α(d) = exp(-d²/2σ²)`, R=260px, σ≈104px
- Variable font modulation: wght 400→900, wdth 100→125%, slant -15→+15deg
- GPU promotion: `will-change: transform` on all character spans
- Reference: [michal-interaction-analysis.md § 3-7](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/michal-interaction-analysis.md)

### 4.3 Ambient Harmonic Wave
- Active when cursor not present or on mobile
- Horizontal wave: `dx = A·sin(2π·f·t + phase_i)`, A=2-4px, f=0.5-1Hz

### 4.4 KineticCursor
- Precision dot: 4px, white, instant position tracking
- Aura ring: 24-80px, lerp follow (λ=0.15 at 60Hz), `mix-blend-mode: difference`
- Velocity tracking: EMA with β=0.75
- Reference: [michal-interaction-analysis.md § 2](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/michal-interaction-analysis.md)

### 4.5 CursorStateMachine
- Read `data-cursor` attributes on hovered DOM elements
- States: kinetic-hero (default), precision-drag (resize/drag handles), magnetic-dock (dock items), disabled (touch)
- Magnetic: aura morphs to squircle, spring(stiff:500, damp:28) snap to item bounds
- Reference: [michal-interaction-analysis.md § 2](file:///d:/CODE/Html/Showcase/portfolio_research/phase2/research/michal-interaction-analysis.md)

### 4.6 Gyroscope Fallback
- `DeviceOrientationEvent` API
- iOS 13+ permission request on first tap
- Map β (front-back) and γ (left-right) to text displacement
- Fallback: ambient wave if permission denied

---

## Sprint 5: Mobile & Polish

### 5.1 MobileBottomSheet
- 92vh height, full width, rounded top 20px, grab handle
- Swipe-to-dismiss: track translateY, threshold 140px, spring physics
- Internal scroll protection: only dismiss when scrollTop === 0

### 5.2 MobileTabBar
- 52px + safe-area-inset-bottom
- 5 core app icons (Finder, Terminal, Projects, About, Mail)
- Single tap → open bottom sheet

### 5.3 MobileStickyAudioBar
- 44px, positioned above tab bar
- Mini artwork (28px), title, play/pause
- Tap → fullscreen music player sheet

### 5.4 Responsive Breakpoint Hook
- `useBreakpoint()` → `{ isMobile, isTablet, isDesktop, hasPointer, hasHover }`
- Uses `matchMedia` for live updates

### 5.5 Performance Audit
- 60fps budget: <16.67ms per frame for all animation loops
- Kinetic typography: target <1.5ms JS per frame
- Lighthouse: target 90+ Performance score
- Test on: Chrome, Safari, Firefox, iOS Safari, Chrome Android

### 5.6 Accessibility
- `prefers-reduced-motion`: disable kinetic typography displacement, reduce window animations to opacity-only, disable dock magnification
- Focus trap within active window
- ARIA: `role="dialog"` on windows, `role="navigation"` on dock, `aria-label` on all interactive elements
- Unique IDs on all interactive elements

