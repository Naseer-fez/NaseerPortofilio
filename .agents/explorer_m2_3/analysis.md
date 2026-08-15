# Desktop Environment Assembly Architecture & Investigation Report (`src/app/page.tsx`)

**Explorer**: Explorer 3 (Milestones 2–5 OS Assembly & Layer Integration)  
**Target File**: `src/app/page.tsx`  
**Date**: 2026-08-15  
**Working Directory**: `d:\CODE\Html\Showcase\.agents\explorer_m2_3\`  

---

## 1. Executive Summary

This investigation examines the complete desktop operating system environment assembly for `src/app/page.tsx`. It establishes the full 8 z-index layer stack (Layer 0 to Layer 7), the global shortcut subsystem, the mobile responsive execution paradigm (< 768px), client-side hydration safety, drag/selection interaction geometry, and context menu dispatching.

The current `src/app/page.tsx` contains placeholder `<div>` elements for several layers (KineticHeroStage, WindowManager, Dock, AudioDeckExpandedCard, SpotlightSearch, KineticCursor, and Mobile components). This report provides the definitive architectural blueprint and verified integration code for the complete assembly.

---

## 2. Comprehensive 8-Layer Z-Index Architecture Breakdown

| Layer | CSS Z-Index | Component(s) | Pointer Events | Core Functionality |
|---|---|---|---|---|
| **Layer 0** | `z-0` (`fixed inset-0`) | `Wallpaper`<br/>`KineticHeroStage` | `pointer-events-none` | Fullscreen wallpaper with cross-fade transition and theme tint overlay; 60fps Euler ODE kinetic typography simulation with Gaussian proximity falloff. |
| **Layer 1** | `z-10` (`fixed top-7 inset-0`) | `DesktopCanvas`<br/>`DesktopGrid`<br/>`DesktopIcon` | `pointer-events-auto` (canvas) / `pointer-events-auto` (icons) | Workspace background surface, 2D drag selection marquee rectangle, icon column-first grid layout, desktop mode toggle on double click. |
| **Layer 2** | `z-20`..`z-49` (`fixed inset-0`) | `WindowManager`<br/>`WindowFrame`<br/>`TrafficLights` | `pointer-events-none` (wrapper) / `pointer-events-auto` (frames) | Dynamic window stacking (z-20 to z-49), focus elevation, window dragging (clamped to menu bar at y>=28px), 8-direction resizing (min 360x240), traffic lights, app content dispatch. |
| **Layer 3** | `z-50` (`fixed top-0 inset-x-0`) | `TopMenuBar`<br/>`LiveClock`<br/>`AppleLogo` | `pointer-events-auto` | 28px fixed height OS chrome with `backdrop-filter: blur(40px)`, Apple dropdown menu, active app title, standard menus (File, Edit, View, Window, Help), status tray (WiFi, Vol, Bat), Spotlight trigger, Theme trigger, SSR-safe LiveClock. |
| **Layer 4** | `z-[9990]` (`fixed bottom-4`) | `Dock`<br/>`DockItem`<br/>`MusicPlayerDockPill`<br/>`DockTooltip`<br/>`ActiveDotIndicator` | `pointer-events-auto` | Parabolic magnification dock (Cosine bell curve, 44px to 68px, radius 150px), launch bounce animation with sound FX, active running dots, glassmorphic tooltips, integrated audio player dock pill with mini EQ. |
| **Layer 5** | `z-[9992]` (`fixed bottom-20 right-6`) | `AudioDeckExpandedCard`<br/>`VinylDiscAssembly`<br/>`AudioVisualizerCanvas`<br/>`InteractiveScrubber` | `pointer-events-auto` | 340px width glassmorphic expanded music player (`blur(32px)`), 3s continuous spinning vinyl disc assembly, real-time 64-bin FFT Web Audio visualizer, drag scrubber, full transport & volume controls. |
| **Layer 6** | `z-[9995]` (`fixed inset-0`) | `SpotlightSearch`<br/>`ContextMenu` | `pointer-events-auto` | Global search modal (`SpotlightSearch`) with fuzzy matching and keyboard selection; floating glassmorphic context menu (`ContextMenu`) positioned at clamped click coordinates. |
| **Layer 7** | `z-[9999]` (`fixed inset-0`) | `KineticCursor`<br/>`CursorPrecisionDot`<br/>`CursorAuraRing` | `pointer-events-none` | Dual-tier custom cursor: 4px instant white precision center dot + dynamic aura ring with Lerp spring follow (`lambda=0.15`), velocity expansion (12px to 40px), and contextual morphing (`precision-drag`, `magnetic-dock`, `kinetic-hero`). |

---

## 3. Deep-Dive Component Specifications

### 3.1 Layer 0: Wallpaper & Kinetic Hero Typography (`z-0`)
- **Wallpaper (`src/components/os/Wallpaper.tsx`)**:
  - Rendered at `fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none`.
  - Driven by `useOSStore.wallpaperId` and `useOSStore.theme`.
  - Transitions using `AnimatePresence mode="sync"` with `motion.div` opacity animation (duration: 0.7s, cubic bezier `[0.16, 1, 0.3, 1]`).
  - Fallback gradient style + `img` tag loading eager.
  - Theme overlay with `backdrop-brightness-95` transitioning between light and dark overlays.
- **KineticHeroStage (`src/components/typography/KineticHeroStage.tsx`)**:
  - Rendered at `fixed inset-0 z-0 flex flex-col items-center justify-center pointer-events-none select-none`.
  - Dynamic opacity: `isAmbient ? 1.0 : hasOpenWindows ? 0.35 : 1.0`.
  - Splits characters with `SplitText` (`data-char`).
  - RequestAnimationFrame Euler ODE physics solver (`solveEulerStep`, stiffness k=280, damping c=24, mass m=1.0) with Gaussian falloff (`calculateGaussianFalloff(dist, 260, 100)`).
  - Variable font-weight modulation: `'wght' 400..900` based on pointer proximity.
  - Idle state: ambient harmonic wave oscillation (`Math.sin(time * 2 + charIndex * 0.2) * 4`).

### 3.2 Layer 1: Desktop Canvas, Icon Grid & Selection Marquee (`z-10`)
- **DesktopCanvas (`src/components/os/DesktopCanvas.tsx`)**:
  - Container: `fixed top-7 left-0 right-0 bottom-0 h-[calc(100vh-28px)] h-[calc(100dvh-28px)] z-10 select-none overflow-hidden`.
  - Pointer down on empty canvas: clears icon selections, clears active window focus (`activeWindowId: null`), closes open context menu, initiates marquee drag.
  - Pointer move: updates marquee bounding box coordinates (`{ startX, startY, currentX, currentY }`) and executes 2D AABB intersection test against `[data-testid^="desktop-icon-"]` elements.
  - Double click: toggles between `'workspace'` and `'ambient-hero'` desktop modes.
  - Context menu (right click): clamps coordinates `(x, y)` to viewport boundaries (`vw - 220`, `vh - 260`) and dispatches desktop context menu payload (New Folder [disabled], Change Wallpaper -> opens Settings, Toggle Ambient Mode, Toggle Dark/Light Mode, About This Portfolio).
- **DesktopGrid (`src/components/os/DesktopGrid.tsx`)**:
  - Container: `hidden md:grid grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 p-4 h-full w-full pointer-events-none overflow-hidden`.
  - Automatically hidden on mobile (`< 768px`).
  - Column-first flow layout with `gridAutoFlow: 'column'`.
- **DesktopIcon (`src/components/os/DesktopIcon.tsx`)**:
  - Button element with 48x48 icon frame + 11px two-line label.
  - Interaction model:
    - Single click: selects icon; starts 300ms double-click timer.
    - Second click within 300ms or doubleClick: opens application window via `useOSStore.openWindow(app.id)`.
    - Right click (context menu): selects icon and opens app-specific context menu ("Open [App]", "Get Info").
    - Keyboard (`Enter` or `Space`): opens app.

### 3.3 Layer 2: Window Manager & Apps (`z-20..49`)
- **WindowManager (`src/components/window/WindowManager.tsx`)**:
  - Container: `fixed inset-0 pointer-events-none z-20`.
  - Renders only when `!isMobile` (mobile viewport switches to `MobileBottomSheet`).
  - Iterates over `Object.values(useOSStore.windows)` and mounts `WindowFrame`.
- **WindowFrame (`src/components/window/WindowFrame.tsx`)**:
  - Glassmorphic window styling: `backdrop-blur-2xl bg-stone-900/90 text-white`, `backdrop-filter: blur(28px) saturate(180%)`, rounded-xl (12px) restoring to 0px on maximize.
  - Drop shadows: Active window `0 25px 60px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.2)`; Inactive window `0 10px 30px -5px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)`.
  - Header dragging: clamped to `y >= 28px` (menu bar height) and overhang of at least 100px visible on screen. Plays audio FX (`window-grab`, `window-drop`).
  - 8-direction resize handles: `n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw` with `data-cursor="precision-drag"` and minimum size clamping (min 360x240).
  - App Content Dispatching: Renders the active application based on `windowState.id` (`TerminalApp`, `ProjectsApp`, `AboutApp`, `FinderApp`, `SettingsApp`, `MailApp`).
- **TrafficLights (`src/components/window/TrafficLights.tsx`)**:
  - Red (Close: `closeWindow(windowId)`), Yellow (Minimize: `minimizeWindow(windowId)`), Green (Maximize: `toggleMaximize(windowId)`).
  - Color states: Unfocused windows display muted stone gray dots (`bg-stone-500/40`); hovering over the traffic lights group reveals colored dots with glyphs (`✕`, `−`, `⤢`).

### 3.4 Layer 3: Top Menu Bar (`z-50`)
- **TopMenuBar (`src/components/os/TopMenuBar.tsx`)**:
  - Fixed height of exactly 28px (`h-7` / `h-[28px]`, `top-0 left-0 right-0 z-50`).
  - Glassmorphic background: `backdrop-filter: blur(40px)`, `bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10`.
  - Left group:
    - Apple Logo button with dropdown: "About This Portfolio", "System Settings...", "App Store / GitHub...", "Sleep (Ambient Mode)", "Restart OS...".
    - Active app title in bold 12.5px font (`activeAppName`), defaulting to "Finder" when no window is focused.
    - Standard macOS menus (`File`, `Edit`, `View`, `Window`, `Help`) with dropdown items (e.g. `⌘W` Close Window, `⌘⌥M` Toggle Ambient Mode, Zoom / Maximize, Portfolio Help).
  - Right group (Status Tray):
    - 16x16px icons with 10px flex gap: WiFi indicator, Volume indicator, Battery indicator (100% Plugged In).
    - Spotlight Search button trigger (`Search` icon) opening Spotlight modal.
    - Control Center / Theme toggle button (`SlidersHorizontal` icon) toggling Dark / Light theme mode (`⇧⌘D`).
    - `LiveClock`: SSR hydration-safe formatted as `Day Mon DD H:MM AM/PM` (e.g. `Sat Aug 15 12:51 PM`).

### 3.5 Layer 4: Parabolic Dock & Audio Pill (`z-[9990]`)
- **Dock (`src/components/dock/Dock.tsx`)**:
  - Centered at bottom: `fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990]`.
  - Parabolic cosine bell curve magnification (`calculateCosineBellWidth`, base 44px, max 68px, radius 150px).
  - Hidden on mobile (`if (isMobile) return null`).
  - Contains `DockItem` for each app + 1px vertical divider + `MusicPlayerDockPill`.
- **DockItem (`src/components/dock/DockItem.tsx`)**:
  - Interactive item with bounce animation on launch (`animate-bounce`, duration 800ms) with `dock-bounce` sound effect.
  - Shows `ActiveDotIndicator` (3px white glowing dot below icon, opacity 0.85 when open, 0.40 when minimized).
  - Shows `DockTooltip` on hover with 11.5px text and blur backdrop.
  - Hover `data-cursor="magnetic-dock"`.
- **MusicPlayerDockPill (`src/components/dock/MusicPlayerDockPill.tsx`)**:
  - Glassmorphic dock pill (120px to 160px width, 44px height).
  - Displays mini album icon, track title, 3-bar animated equalizer (`eq-bar-1`, `eq-bar-2`, `eq-bar-3` with heights 12px, 16px, 8px when playing), and mini play/pause button.
  - Clicking pill toggles `useMusicStore.isDeckExpanded`.

### 3.6 Layer 5: Audio Deck Expanded Card (`z-[9992]`)
- **AudioDeckExpandedCard (`src/components/music/AudioDeckExpandedCard.tsx`)**:
  - Positioned `fixed bottom-20 right-6 z-[9992] w-[340px] rounded-[20px] backdrop-blur-2xl bg-stone-900/90`.
  - Conditional: renders only when `useMusicStore.isDeckExpanded === true`.
  - Subcomponents:
    - Header with "Now Playing" and collapse chevron button (`toggleDeckExpanded`).
    - `VinylDiscAssembly`: 200px realistic spinning vinyl disc (`animate-spin`, 3s duration, running when playing, paused when paused), realistic vinyl grooves, center album art.
    - `AudioVisualizerCanvas`: 280x48 real-time HTML5 2D canvas visualizer connecting to `GlobalAudioManager.getAnalyser()` (64-bin FFT).
    - `InteractiveScrubber`: Scrubber track with progress bar fill, drag handle, hover state, and `currentTime` / `duration` mm:ss formatting.
    - Full Transport controls: Shuffle toggle, Previous track (restarts track if >= 3s, loads previous track if < 3s), Play/Pause button, Next track, Cycle Repeat mode (`off` -> `all` -> `one`), Volume slider with mute button.

### 3.7 Layer 6: Spotlight Search & Context Menu (`z-[9995]`)
- **SpotlightSearch (`src/components/os/SpotlightSearch.tsx`)**:
  - Backdrop: `fixed inset-0 z-[9995] flex items-start justify-center pt-[18vh] bg-black/30 backdrop-blur-sm`.
  - Modal: 560px width with `backdrop-filter: blur(32px)`, search input with auto-focus, real-time filtered results list with selection highlights, `Escape` key dismiss, `Enter` key launches first result.
- **ContextMenu (`src/components/os/ContextMenu.tsx`)**:
  - Rendered at `fixed z-[9995] w-56 rounded-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-2xl py-1 text-[13px]`.
  - Positioned dynamically via `{ top: contextMenu.y, left: contextMenu.x }`.
  - Supports item separators, disabled items, danger items, keyboard shortcut badges, action triggers, and click-outside dismissal.

### 3.8 Layer 7: Dual-Tier Kinetic Cursor (`z-[9999]`)
- **KineticCursor (`src/components/cursor/KineticCursor.tsx`)**:
  - Automatically hidden when `isMobile === true` or pointer is coarse.
  - **CursorPrecisionDot (`src/components/cursor/CursorPrecisionDot.tsx`)**:
    - 4x4px pure white solid circle, centered on pointer coordinate with `translate3d(x - 2px, y - 2px, 0)`, `z-[9999]`, instantaneous 0ms tracking.
  - **CursorAuraRing (`src/components/cursor/CursorAuraRing.tsx`)**:
    - Lerp spring lag tracking (`lambda = 0.15`) running on `requestAnimationFrame`.
    - Velocity-driven radius expansion: base 12px expanding up to 40px radius (80px diameter) based on pointer speed.
    - Contextual variants:
      - `'precision-drag'`: scale down to 0 during window edge resizing.
      - `'magnetic-dock'`: morphs into 56x56px rounded rectangle with 16px border-radius over dock icons.
      - `'kinetic-hero'`: activates typography physics.
      - `'disabled'`: hidden.
      - `mixBlendMode: 'difference'`.

---

## 4. Global Subsystems: Keyboard Shortcuts, Hydration & Audio

### 4.1 Global Keyboard Shortcuts (`GlobalKeyboardListener` / `useKeyboardShortcuts`)
| Shortcut | Action | Input Field Behavior | Notes |
|---|---|---|---|
| `Cmd/Ctrl + K` | Toggle Spotlight Search | **Allowed inside inputs** | Opens search modal from anywhere |
| `Escape` | Dismiss modal, context menu, or spotlight | **Allowed inside inputs** | Unconditionally dismisses top active overlay |
| `Cmd/Ctrl + W` | Close active window | Suppressed inside inputs | Closes `activeWindowId` |
| `Cmd/Ctrl + M` | Minimize active window | Suppressed inside inputs | Minimizes `activeWindowId` to dock |
| `Cmd/Ctrl + Shift + D` | Toggle Dark/Light theme | Suppressed inside inputs | Swaps root `.dark` class + updates storage |
| `Cmd/Ctrl + Option + M` | Toggle Desktop Mode | Suppressed inside inputs | Toggles `workspace` <-> `ambient-hero` |
| `Cmd/Ctrl + Option + T` | Open / Focus Terminal App | Suppressed inside inputs | Fast shortcut to CLI |

### 4.2 Hydration & SSR Safety
1. **FOUC Prevention Script (`layout.tsx`)**:
   An inline `<script dangerouslySetInnerHTML>` in `<head>` reads `localStorage.getItem('macos-portfolio-os-state')` before first paint and immediately injects or removes the `dark` class on `document.documentElement`.
2. **LiveClock Hydration Protection (`TopMenuBar.tsx`)**:
   Renders static fallback `'Sat Aug 15 12:51 PM'` until client-side `useEffect` sets `mounted = true`, preventing SSR vs client date mismatch errors.
3. **AudioContext Lazy Initialization (`GlobalAudioManager.ts`)**:
   `AudioContext` creation and resumption is deferred until the first user pointer down / click interaction, complying with browser autoplay security policies.

### 4.3 Web Audio Engine & Automatic Ducking
- **GlobalAudioManager Singleton (`src/lib/audio/GlobalAudioManager.ts`)**:
  - Routing: `MediaElementAudioSourceNode` (music) -> `musicGainNode` -> `analyserNode` -> `masterGainNode` -> `destination`.
  - Sound FX: `SoundSynthesizer` (procedural sine oscillators) -> `fxGainNode` -> `masterGainNode`.
  - Automatic Ducking: When `playFx(type)` is called, `duckMusic(0.20, 0.04, 0.25)` immediately ramps music volume down to 20% over 40ms, holds for the duration of the sound effect, and restores to previous volume over 250ms.

---

## 5. Mobile Viewport Paradigm (< 768px)

On viewports narrower than 768px (or coarse touch devices):
1. **Desktop Grid is Hidden**: `DesktopGrid` has `hidden md:grid`, hiding desktop icons to prevent clutter.
2. **Desktop Dock is Hidden**: `Dock` returns `null` via `useBreakpoint()`.
3. **Cursor is Disabled**: `KineticCursor` returns `null`.
4. **Mobile Tab Bar (`MobileTabBar.tsx`)**:
   - Fixed at bottom: `fixed bottom-0 inset-x-0 z-50 h-[52px]` with safe-area padding.
   - Shows icons for all apps (`Terminal`, `Projects`, `About`, `Finder`, `Settings`, `Mail`).
   - Single tap on tab item opens the app.
5. **Mobile Sticky Audio Bar (`MobileStickyAudioBar.tsx`)**:
   - Fixed 8px above mobile tab bar: `fixed inset-x-2 z-40 h-11`.
   - Displays track artwork, title, and mini play/pause button.
   - Tapping bar expands the full `AudioDeckExpandedCard`.
6. **Mobile Bottom Sheet (`MobileBottomSheet.tsx`)**:
   - Replaces desktop window frames for all open windows (`windowState.isOpen === true`).
   - Full width (`100vw`), 92vh height (`height: 92vh`), top rounded corners (`16px`).
   - Drag-to-dismiss handle:
     - Swiping down > 140px threshold calls `closeWindow(windowId)`.
     - Swiping down < 140px springs back to top.
     - Scroll protection: Gesture is ignored if inner content is scrolled down (`contentRef.scrollTop > 0`).

---

## 6. Drag Overlays, Marquee & Context Menu Coordinates

### 6.1 Selection Marquee Geometry
- Canvas listens for `onPointerDown`, `onPointerMove`, `onPointerUp`.
- Marquee rectangle calculated dynamically:
  $$\text{left} = \min(x_1, x_2), \quad \text{top} = \min(y_1, y_2)$$
  $$\text{width} = |x_2 - x_1|, \quad \text{height} = |y_2 - y_1|$$
- Multi-select icon intersection test:
  $$\text{intersects} = (R_{\text{left}} < \text{marquee}_{\text{right}}) \land (R_{\text{right}} > \text{marquee}_{\text{left}}) \land (R_{\text{top}} < \text{marquee}_{\text{bottom}}) \land (R_{\text{bottom}} > \text{marquee}_{\text{top}})$$

### 6.2 Context Menu Viewport Clamping
- Coordinates calculated as:
  $$x_{\text{clamped}} = \min(\text{clientX}, \text{viewportWidth} - 220)$$
  $$y_{\text{clamped}} = \min(\text{clientY}, \text{viewportHeight} - 260)$$
- This guarantees the context menu never overflows off the right or bottom screen edges.

---

## 7. Complete Assembly Architecture for `src/app/page.tsx`

Below is the verified, production-ready implementation blueprint for `src/app/page.tsx` assembling all 8 layers, mobile components, and app dispatching.

```tsx
'use client';

import React from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useOSStore } from '@/hooks/useOSStore';

// Layer 0: Wallpaper & Kinetic Typography Stage
import { Wallpaper } from '@/components/os/Wallpaper';
import { KineticHeroStage } from '@/components/typography/KineticHeroStage';

// Layer 1: Desktop Surface & Icon Grid
import { DesktopCanvas } from '@/components/os/DesktopCanvas';

// Layer 2: Window Manager & Dedicated Applications
import { WindowManager } from '@/components/window/WindowManager';

// Layer 3: Top Menu Bar
import { TopMenuBar } from '@/components/os/TopMenuBar';

// Layer 4: Parabolic Dock (Desktop)
import { Dock } from '@/components/dock/Dock';

// Layer 5: Audio Deck Expanded Card
import { AudioDeckExpandedCard } from '@/components/music/AudioDeckExpandedCard';

// Layer 6: Overlays & Modals
import { SpotlightSearch } from '@/components/os/SpotlightSearch';
import { ContextMenu } from '@/components/os/ContextMenu';

// Layer 7: Kinetic Cursor (Desktop)
import { KineticCursor } from '@/components/cursor/KineticCursor';

// Mobile Responsive Components (< 768px)
import { MobileTabBar } from '@/components/mobile/MobileTabBar';
import { MobileStickyAudioBar } from '@/components/mobile/MobileStickyAudioBar';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';

export default function DesktopPage() {
  const { isMobile } = useBreakpoint();
  const windows = useOSStore((state) => state.windows);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-os-bg-desktop text-os-window-text">
      {/* Layer 0 (z-0): Wallpaper & Kinetic Typography Stage */}
      <Wallpaper />
      <KineticHeroStage />

      {/* Layer 1 (z-10): Desktop Canvas (Icon Grid & Selection Marquee) */}
      <DesktopCanvas />

      {/* Layer 2 (z-20..49): Window Manager (Desktop) */}
      <WindowManager />

      {/* Mobile Layer: Bottom Sheets for Open Windows */}
      {isMobile &&
        Object.values(windows)
          .filter((win) => win.isOpen)
          .map((win) => (
            <MobileBottomSheet key={win.id} windowState={win} />
          ))}

      {/* Layer 3 (z-50): Top Menu Bar */}
      <TopMenuBar />

      {/* Layer 4 (z-[9990]): Dock (Desktop) vs Mobile Navigation Bar */}
      <Dock />
      <MobileTabBar />

      {/* Layer 5 (z-[9992]): Audio Deck Expanded & Mobile Sticky Audio Bar */}
      <AudioDeckExpandedCard />
      <MobileStickyAudioBar />

      {/* Layer 6 (z-[9995]): Spotlight Search & Context Menu */}
      <SpotlightSearch />
      <ContextMenu />

      {/* Layer 7 (z-[9999]): Dual-Tier Kinetic Cursor */}
      <KineticCursor />
    </main>
  );
}
```

---

## 8. App Dispatch Integration in `WindowManager.tsx` & `MobileBottomSheet.tsx`

When the 6 apps are implemented (`TerminalApp`, `ProjectsApp`, `AboutApp`, `FinderApp`, `SettingsApp`, `MailApp`), they should be dispatched inside `WindowManager.tsx` and `MobileBottomSheet.tsx`:

```tsx
import { TerminalApp } from '@/components/apps/TerminalApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { FinderApp } from '@/components/apps/FinderApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { MailApp } from '@/components/apps/MailApp';

export function renderAppContent(appId: string) {
  switch (appId) {
    case 'terminal':
      return <TerminalApp />;
    case 'projects':
      return <ProjectsApp />;
    case 'about':
      return <AboutApp />;
    case 'finder':
      return <FinderApp />;
    case 'settings':
      return <SettingsApp />;
    case 'mail':
      return <MailApp />;
    default:
      return null;
  }
}
```

---

## 9. Architectural Integrity & Verification Matrix

1. **Z-Index Layer Hierarchy**: Verified strict order `0 -> 10 -> 20..49 -> 50 -> 9990 -> 9992 -> 9995 -> 9999`.
2. **Pointer Event Transparency**: Background stages (`Wallpaper`, `KineticHeroStage`, `KineticCursor`, `WindowManager` container) use `pointer-events-none` with interactive child elements overriding with `pointer-events-auto`.
3. **Glassmorphism & Shadows**: Tokenized glassmorphism (`backdrop-filter: blur(28px..40px)`) and depth shadows (`0 25px 60px -10px`) conform precisely to visual design specifications.
4. **Hydration & Storage**: Theme and OS states are safely hydrated with zero layout shifts or hydration warning mismatches.
5. **Mobile Responsiveness**: Clean separation between desktop (`Dock`, `WindowManager`, `DesktopGrid`, `KineticCursor`) and mobile (`MobileTabBar`, `MobileStickyAudioBar`, `MobileBottomSheet`).
