# Window System Architecture & Application Dispatch Integration Analysis

**Author**: Explorer 2 (Milestones 2-5)  
**Date**: 2026-08-15  
**Target Files**:
- `src/components/window/WindowManager.tsx`
- `src/components/window/WindowFrame.tsx`
- `src/components/window/TrafficLights.tsx`
- `src/hooks/useOSStore.ts`
- `src/components/apps/*` (`TerminalApp`, `ProjectsApp`, `AboutApp`, `FinderApp`, `SettingsApp`, `MailApp`)

---

## 1. System Architecture & Component Hierarchy

The macOS Portfolio OS windowing subsystem operates at **Layer 2 (z-20..49)**, orchestrating application windows above the Desktop canvas and below the TopMenuBar and Dock.

```
┌────────────────────────────────────────────────────────────────────────┐
│ DesktopPage (src/app/page.tsx)                                         │
│                                                                        │
│  Layer 0: Wallpaper + KineticHeroStage (z-0)                           │
│  Layer 1: DesktopCanvas + DesktopGrid + SelectionMarquee (z-10)        │
│                                                                        │
│  Layer 2: WindowManager (z-20..49)                                      │
│   ├── WindowFrame (id: "terminal", zIndex: 24, isFocused: true)        │
│   │    ├── HeaderBar (TrafficLights + Title + DoubleClick Maximize)   │
│   │    ├── ContentContainer (p-0 full bleed flex container)           │
│   │    │    └── TerminalApp (CLI, Neofetch, command history)          │
│   │    └── ResizeHandles (8 directions: n, s, e, w, nw, ne, sw, se)   │
│   ├── WindowFrame (id: "projects", zIndex: 23, isFocused: false)       │
│   │    └── ProjectsApp (Filter pills, project cards, modals)          │
│   ├── WindowFrame (id: "about", zIndex: 22)                            │
│   │    └── AboutApp (Bio, timeline, skills radar, resume PDF)         │
│   ├── WindowFrame (id: "finder", zIndex: 21)                           │
│   │    └── FinderApp (Sidebar tree, grid/list view, preview pane)     │
│   ├── WindowFrame (id: "settings", zIndex: 20)                         │
│   │    └── SettingsApp (Wallpapers, theme, sound, dock settings)      │
│   └── WindowFrame (id: "mail", zIndex: 20)                             │
│        └── MailApp (Contact form, validation, paper plane animation)  │
│                                                                        │
│  Layer 3: TopMenuBar (z-50)                                            │
│  Layer 4: Dock + MusicPlayerDockPill + ActiveDotIndicator (z-9990)     │
│  Layer 5: AudioDeckExpandedCard (z-9992)                               │
│  Layer 6: SpotlightSearch + ContextMenu (z-9995)                       │
│  Layer 7: KineticCursor (z-9999)                                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Coordination with `useOSStore`

The window system is entirely driven by `useOSStore` (Zustand with localStorage hydration). The coordination rules are:

### 2.1 State Subscriptions
| State Field | Type | Consumed By | Purpose |
|---|---|---|---|
| `windows` | `Record<string, AppWindow>` | `WindowManager`, `Dock`, `DesktopGrid` | Master list of all registered windows, positions, sizes, open/minimized/maximized states |
| `activeWindowId` | `string \| null` | `WindowFrame`, `TopMenuBar`, `Dock` | Identifies which window has primary focus, updates TopMenuBar app title |
| `baseZIndex` | `number` (20) | `useOSStore` internal | Baseline z-index for windows |
| `maxZIndex` | `number` (20..49) | `useOSStore` internal | Current highest allocated z-index |
| `desktopMode` | `'workspace' \| 'ambient-hero'` | WindowManager / WindowFrame | In ambient mode, windows fade out (`opacity: 0, pointer-events: none`) |
| `theme` | `'dark' \| 'light' \| 'system'` | WindowFrame & Apps | Selects glassmorphism tokens, border contrast, and text colors |

### 2.2 Store Actions Contract
- `openWindow(id: string, initialConfig?: Partial<AppWindow>)`:
  - If window exists and is open: brings to front via `focusWindow(id)`.
  - If window exists and is closed: positions with `calculateCascadePosition(defaultPosition, openCount, vw, vh, w, h)`, sets `isOpen = true, isMinimized = false, isFocused = true`, allocates `maxZIndex + 1`.
  - Sets `activeWindowId = id`.
  - Closes any active context menus.
- `closeWindow(id: string)`:
  - Sets `isOpen = false, isFocused = false, isMaximized = false`.
  - If closed window was active, automatically sets `activeWindowId` to the highest z-index remaining open/unminimized window.
  - Plays sound effect `window-close`.
- `minimizeWindow(id: string)`:
  - Sets `isMinimized = true, isFocused = false`.
  - Transfers `activeWindowId` to highest remaining unminimized open window.
- `restoreWindow(id: string)` / `focusWindow(id: string)`:
  - Unfocuses other windows (`isFocused = false`).
  - Sets target window `isOpen = true, isMinimized = false, isFocused = true`.
  - Increments and assigns `zIndex = Math.min(maxZIndex + 1, 49)`. If `nextZIndex > 49`, runs `normalizeZIndices` to re-compact open window stack between 20 and 49.
- `toggleMaximize(id: string)`:
  - If currently maximized: restores `prevBounds` (`{ x, y, width, height }`), sets `isMaximized = false`.
  - If not maximized: stores current bounds in `prevBounds`, sets `isMaximized = true`, sets position to `{ x: 0, y: 28 }`, size to `{ width: 100vw, height: calc(100vh - 28px) }`.
- `updatePosition(id: string, position: Position)`:
  - Enforces macOS overhang clamping:
    - `clampedX = Math.max(-(size.width - 100), Math.min(position.x, window.innerWidth - 100))`
    - `clampedY = Math.max(28, Math.min(position.y, window.innerHeight - 40))`
- `updateSize(id: string, size: Size)`:
  - Enforces minSize: `clampedWidth = Math.max(size.width, minSize.width || 360)`, `clampedHeight = Math.max(size.height, minSize.height || 240)`.

---

## 3. Application Dispatch Architecture in `WindowManager.tsx`

### 3.1 App Registry Design
All 6 applications must be registered in an explicit dispatch map in `WindowManager.tsx`. Each application component receives a standard `AppProps` interface.

```typescript
// src/components/apps/types.ts or in WindowManager
export interface AppProps {
  windowState: AppWindow;
}
```

### 3.2 App Component Mapping
```typescript
import { TerminalApp } from '@/components/apps/TerminalApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { FinderApp } from '@/components/apps/FinderApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { MailApp } from '@/components/apps/MailApp';

export const APP_REGISTRY: Record<string, React.ComponentType<AppProps>> = {
  terminal: TerminalApp,
  projects: ProjectsApp,
  about: AboutApp,
  finder: FinderApp,
  settings: SettingsApp,
  mail: MailApp,
};
```

### 3.3 Dispatch Implementation in `WindowManager.tsx`
```tsx
import React from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { WindowFrame } from './WindowFrame';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { TerminalApp } from '@/components/apps/TerminalApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { FinderApp } from '@/components/apps/FinderApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { MailApp } from '@/components/apps/MailApp';
import { AppProps } from '@/types/apps';

const APP_REGISTRY: Record<string, React.ComponentType<AppProps>> = {
  terminal: TerminalApp,
  projects: ProjectsApp,
  about: AboutApp,
  finder: FinderApp,
  settings: SettingsApp,
  mail: MailApp,
};

export function WindowManager() {
  const windows = useOSStore(state => state.windows);
  const desktopMode = useOSStore(state => state.desktopMode);
  const { isMobile } = useBreakpoint();

  // On mobile (<768px), window rendering is handled by MobileBottomSheet
  if (isMobile) return null;

  const windowList = Object.values(windows || {});

  return (
    <div
      data-testid="window-manager"
      className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-300 ${
        desktopMode === 'ambient-hero' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-auto">
        {windowList.map((win) => {
          if (!win.isOpen || win.isMinimized) return null;
          const Component = APP_REGISTRY[win.id];
          return (
            <WindowFrame key={win.id} windowState={win}>
              {Component ? (
                <Component windowState={win} />
              ) : (
                <div data-testid={`window-fallback-${win.id}`} className="p-4 space-y-2">
                  <h3 className="font-medium text-white">{win.title}</h3>
                  <p className="text-white/60 text-sm">Application content unavailable.</p>
                </div>
              )}
            </WindowFrame>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 4. `WindowFrame.tsx` Refinements & Content Layout Isolation

### 4.1 Content Wrapper Layout Fix (CRITICAL)
Currently, `WindowFrame.tsx` line 161 has:
```tsx
<div className="flex-1 overflow-auto p-4 bg-black/40 text-sm">
```
**Problem**: Hardcoding `p-4` forces a 16px border around all apps. For Finder (with a left sidebar tree) and Settings (with a sidebar), this completely breaks the macOS flush sidebar aesthetic.
**Fix**: The content container must be full bleed (`p-0 overflow-hidden flex flex-col flex-1 relative`). Each app manages its own padding, sidebars, toolbars, and scroll containers.

```tsx
{/* Window Body Container */}
<div
  data-testid={`window-body-${windowState.id}`}
  className="flex-1 overflow-hidden relative flex flex-col bg-stone-950/80 text-white select-text"
>
  {children}
</div>
```

### 4.2 Glassmorphism & Shadow Tokens
- **Focused State**:
  - `box-shadow`: `0 25px 60px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.18)`
  - Header: `bg-white/[0.07] border-white/15`
  - Title: `text-white/90 font-semibold`
- **Inactive State**:
  - `box-shadow`: `0 10px 30px -5px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)`
  - Header: `bg-white/[0.03] border-white/5`
  - Title: `text-white/50 font-normal`
- **Glass Filter**:
  - `backdropFilter: 'blur(28px) saturate(180%)'`
  - `WebkitBackdropFilter: 'blur(28px) saturate(180%)'`

### 4.3 8-Direction Resize Handles
Resize handles must exist on all 4 edges and 4 corners with `data-cursor="precision-drag"`:
- `n`: top 6px (`cursor-n-resize`)
- `s`: bottom 6px (`cursor-s-resize`)
- `w`: left 6px (`cursor-w-resize`)
- `e`: right 6px (`cursor-e-resize`)
- `nw`: top-left 12×12px (`cursor-nw-resize`)
- `ne`: top-right 12×12px (`cursor-ne-resize`)
- `sw`: bottom-left 12×12px (`cursor-sw-resize`)
- `se`: bottom-right 12×12px (`cursor-se-resize`)

When `windowState.isMaximized === true`, resize handles are conditionally omitted from the DOM.

### 4.4 Pointer Drag & Boundary Clamping
- Header bar pointer down captures coordinates (`clientX`, `clientY`).
- Header double-click calls `toggleMaximize(windowState.id)`.
- If maximized, pointer drag is disabled.
- On drag start: `GlobalAudioManager.getInstance().playFx('window-grab')`.
- On drag release: `GlobalAudioManager.getInstance().playFx('window-drop')`.
- Window `pointermove` and `pointerup` handlers ensure dragging continues smoothly outside window bounds.

---

## 5. `TrafficLights.tsx` Refinements

### 5.1 Structure & Styling
- 3 buttons of 12×12px with 8px spacing:
  1. **Close Button** (`#FF5F56` / `#E0443E` active):
     - `data-testid={`traffic-light-close-${windowId}`}`
     - Symbol on hover: `✕` (7px font size, black/70)
     - Action: `closeWindow(windowId)` + `GlobalAudioManager.getInstance().playFx('window-close')`
  2. **Minimize Button** (`#FFBD2E` / `#DEA123` active):
     - `data-testid={`traffic-light-minimize-${windowId}`}`
     - Symbol on hover: `−` (9px font size, black/70)
     - Action: `minimizeWindow(windowId)` + `GlobalAudioManager.getInstance().playFx('dock-bounce')`
  3. **Maximize / Zoom Button** (`#27C93F` / `#1AAB29` active):
     - `data-testid={`traffic-light-maximize-${windowId}`}`
     - Symbol on hover: `⤢` (8px font size, black/70)
     - Action: `toggleMaximize(windowId)` + `GlobalAudioManager.getInstance().playFx('click')`

### 5.2 Unfocused State Behavior
When the window is not focused (`isFocused === false`) and the traffic lights cluster is not hovered:
- Background: `bg-stone-500/30`
- Border: `border border-white/5`
- Text: `text-transparent`
When hovered (mouse enters cluster):
- All 3 buttons instantly illuminate in their native macOS colors and reveal their glyphs!

---

## 6. App Component Specifications for Integration

| App ID | Title | Default / Min Size | Layout & Functional Highlights |
|---|---|---|---|
| `terminal` | Terminal | 640×400 / 380×240 | JetBrains Mono font, Neofetch banner on launch, command interpreter (`help`, `about`, `projects`, `skills`, `clear`, `neofetch`, `theme`, `date`, `contact`, `sudo`, `cat`, `matrix`), up/down arrow history, tab completion, sound FX on execute. |
| `projects` | Projects | 800×550 / 450×320 | Top category filter bar (All, Full Stack, AI / ML, Systems, Creative), live search filter, card grid with tech stack pills, external demo/repo buttons, detail preview modal. |
| `about` | About Me | 700×500 / 420×300 | Header with avatar, bio, career timeline with interactive milestone cards, skills matrix with animated proficiency bars, resume download button. |
| `finder` | Finder | 700×500 / 420×300 | Dual-pane macOS Finder: Left sidebar (Applications, Documents, Pictures, Downloads, Trash), top navigation bar with breadcrumbs & Grid/List view toggle, right file inspector pane with metadata and quick preview. |
| `settings` | Settings | 600×450 / 400×300 | Left sidebar categories (Wallpaper, Appearance, Sound, Dock, About), Wallpaper picker grid with instant crossfade swap, Dark/Light appearance toggle, Sound volume slider & toggle, Ambient mode toggle. |
| `mail` | Mail | 550×400 / 380×260 | Contact form (Name, Email, Subject, Message), field validation, send button with paper airplane spring animation and sound trigger (`playFx('dock-bounce')`), success toast. |

---

## 7. Integration Plan for Milestones 2-5

1. **Implement 6 Application Components** in `src/components/apps/`:
   - `TerminalApp.tsx`
   - `ProjectsApp.tsx`
   - `AboutApp.tsx`
   - `FinderApp.tsx`
   - `SettingsApp.tsx`
   - `MailApp.tsx`
2. **Update `src/components/window/WindowFrame.tsx`**:
   - Change content wrapper to `flex-1 overflow-hidden relative flex flex-col p-0`.
   - Ensure pointer events inside the window call `focusWindow(windowState.id)`.
   - Double click header triggers `toggleMaximize(windowState.id)`.
3. **Update `src/components/window/WindowManager.tsx`**:
   - Import all 6 apps and register in `APP_REGISTRY`.
   - Dispatch `win.id` to corresponding App component inside `WindowFrame`.
   - Add ambient-mode fade out transition.
4. **Mount `WindowManager` in `src/app/page.tsx`**:
   - Replace empty `#window-layer` with `<WindowManager />`.
5. **Verify Build & Run Tests**:
   - `npm run build`
   - `npx vitest run`

---

## 8. Risk Analysis & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Hydration mismatch from window positions | High | Ensure initial window states in store use deterministic default coordinates; `useHydrated` guards if needed. |
| Z-index collision with TopMenuBar / Dock | Medium | TopMenuBar is fixed at `z-50`, Dock at `z-9990`. Store normalizes window z-indices to `20..49`, guaranteeing windows never overlay system chrome. |
| Nested scroll conflict in Finder/Terminal | Medium | WindowFrame body uses `overflow-hidden`; each individual app implements its own `overflow-y-auto` scroll container with momentum scrolling. |
| Rapid drag losing pointer focus | Low | Pointer events use window-level move/up listeners attached on `onPointerDown` and detached on `onPointerUp`. |
