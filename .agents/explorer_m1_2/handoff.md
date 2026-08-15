# Handoff Report — Explorer 2 (Milestone 1: Core OS Framework)

**Date**: 2026-08-15  
**From**: Explorer 2 (`.agents/explorer_m1_2/`)  
**To**: Sub-Orchestrator Milestone 1 (`.agents/sub_orch_m1/`)  
**Subject**: State Architecture, Types, App Registry, Zustand Store, & Keyboard Shortcut Specifications

---

## 1. Observation

Direct observations from project specifications and Phase 2 research artifacts:

1. **State Interfaces & Contracts** (`PROJECT.md:34-43`, `state-architecture.md:8-65`):
   - `useOSStore` requires: `windows: Record<string, AppWindow>`, `activeWindowId: string | null`, `baseZIndex: number` (20), `desktopMode: 'workspace' | 'ambient' | 'ambient-hero'`, `theme: 'dark' | 'light' | 'system'`, `wallpaperId: string`, `soundEnabled: boolean`, `soundVolume: number`, `contextMenu: { x: number; y: number; items: ContextMenuItem[] } | null`, `spotlightOpen: boolean`, `controlCenterOpen: boolean`, `selectedIconIds: string[]`.
   - `AppWindow` interface requires: `id`, `title`, `icon`, `isOpen`, `isMinimized`, `isMaximized`, `isFocused`, `zIndex`, `position: { x, y }`, `size: { width, height }`, `minSize: { width, height }` (default: 360×240), `defaultPosition`, `defaultSize`, `prevBounds`.
   - Persistence matrix (`state-architecture.md:36-46`): `theme`, `wallpaperId`, `soundEnabled`, `desktopMode` persist to `localStorage`. `windows`, `activeWindowId`, `contextMenu`, and `spotlightOpen` reset on reload.

2. **Core 6 Applications** (`base-site-reverse-engineering.md:205-215`):
   - `finder` (700×500, min 420×300, pos 80,60, icon: Folder, category: system)
   - `terminal` (640×400, min 380×240, pos 120,80, icon: Terminal, category: system)
   - `projects` (800×550, min 450×320, pos 160,70, icon: Briefcase, category: portfolio)
   - `about` (700×500, min 420×300, pos 200,100, icon: User, category: portfolio)
   - `settings` (600×450, min 400×300, pos 240,120, icon: Settings, category: system)
   - `mail` (550×400, min 380×260, pos 280,90, icon: Mail, category: portfolio)

3. **Window Drag Clamping & Cascade Geometry** (`base-site-reverse-engineering.md:137-150`):
   - Drag clamping: `x_clamped = max(-(width - 100), min(x, viewportWidth - 100))`, `y_clamped = max(28, min(y, viewportHeight - 60))`.
   - Spawning: `spawnX = baseX + (N_open * 26) mod maxOffset`, `spawnY = baseY + (N_open * 26) mod maxOffset`.

4. **Keyboard Shortcuts Matrix** (`interaction-map.md:88-98`, `implementation-spec.md:56-60`):
   - `Cmd/Ctrl + K`: Toggle Spotlight search.
   - `Cmd/Ctrl + W`: Close active window.
   - `Cmd/Ctrl + M`: Minimize active window.
   - `Cmd/Ctrl + Shift + D`: Toggle theme (dark ↔ light).
   - `Cmd/Ctrl + Option + M`: Toggle desktop mode (workspace ↔ ambient).
   - `Cmd/Ctrl + Option + T`: Open/focus Terminal app.
   - `Escape`: Dismiss context menu / spotlight / control center.

---

## 2. Logic Chain

1. From **Observation 1**, `useOSStore` must handle both persistent settings (`theme`, `wallpaperId`, `soundEnabled`, `soundVolume`, `desktopMode`) and ephemeral runtime window states. Using Zustand's `persist` middleware with `partialize` cleanly isolates persistent keys without serializing window instances.
2. From **Observation 1 & 3**, z-index ordering starts at `baseZIndex = 20`. To maintain consistent focus promotion without unbounded growth, each window focus operation calculates `maxZIndex = maxZIndex + 1`, sets the target window's `zIndex = maxZIndex`, sets `isFocused = true`, and unfocuses other windows.
3. When an active window is closed or minimized, user expectation in macOS is that the next topmost open window inherits focus. The store implementation sorts remaining open, non-minimized windows by descending `zIndex` and promotes the highest one. If no windows remain, `activeWindowId` becomes `null`.
4. From **Observation 2**, the 6 core apps have explicit default dimensions, minimum size constraints, and default positions that must be registered in `lib/constants/apps.ts` and initialized into `useOSStore`.
5. From **Observation 4**, global shortcuts must distinguish between typing inside form inputs (`<input>`, `<textarea>`, `contenteditable`) versus desktop navigation. `Escape` and `Cmd+K` are allowed globally, while single-key or window-closing shortcuts (`Cmd+W`, `Cmd+M`) are suppressed during active text entry to avoid accidental window destruction.
6. Cross-platform support requires checking `navigator.platform` for macOS (`metaKey`) vs. Windows/Linux (`ctrlKey`), while intercepting with `e.preventDefault()` to prevent default browser behavior (e.g., closing browser tabs or focusing address bar).

---

## 3. Caveats

1. **Hydration Timing**: Next.js App Router performs initial server rendering. When using `localStorage` persistence in Zustand, hydration occurs on client mount. A hydration safety hook (`useHydrated`) or initial script must be used to ensure no mismatch warnings occur when reading `theme` or `wallpaperId`.
2. **Audio Separation**: `useOSStore` only controls `soundEnabled` and `soundVolume` (settings). Audio playback, streaming, and visualizer nodes belong exclusively to `useMusicStore` and `GlobalAudioManager` (Milestone 3).

---

## 4. Conclusion

All contracts, types, app registries, Zustand actions, and keyboard shortcut listeners for Milestone 1 are completely specified and ready for implementation by Worker 2:
- `src/types/os.ts`: Complete TypeScript interfaces.
- `src/lib/constants/apps.ts`: Initial app registry (Terminal, Projects, About, Finder, Settings, Mail), cascading calculations, and initial state factories.
- `src/lib/constants/shortcuts.ts`: Shortcut definitions and metadata.
- `src/hooks/useOSStore.ts`: Complete Zustand store with actions, geometry clamping, and selective persistence.
- `src/hooks/useKeyboardShortcuts.ts`: Global keyboard event listener with input safety and cross-platform key mapping.
- `src/hooks/useHydrated.ts`: SSR hydration safety helper.

See detailed code in `d:\CODE\Html\Showcase\.agents\explorer_m1_2\analysis.md`.

---

## 5. Verification Method

1. **Type Verification**:
   - Run `npx tsc --noEmit` after Worker 2 implements `src/types/os.ts`, `src/lib/constants/apps.ts`, `src/hooks/useOSStore.ts`, and `src/hooks/useKeyboardShortcuts.ts`.
2. **Store Unit Tests** (`vitest`):
   - Test `openWindow('terminal')`: verify `isOpen: true`, `isFocused: true`, `activeWindowId === 'terminal'`, `zIndex > 20`.
   - Test `closeWindow('terminal')`: verify `isOpen: false`, `isFocused: false`, focus delegates to next topmost window.
   - Test `toggleMaximize('terminal')`: verify bounds save to `prevBounds`, size expands to viewport, and second toggle restores previous position & size.
   - Test `updatePosition('terminal', { x: -500, y: 10 })`: verify `y` is clamped to `>= 28` and `x` retains at least 100px visible.
   - Test persistence: verify `theme` persists across store recreation while `windows` resets to default.
3. **Shortcut Event Tests**:
   - Trigger `keydown` with `Cmd+K`: verify `spotlightOpen` toggles.
   - Trigger `keydown` with `Cmd+W`: verify active window closes.
   - Trigger `keydown` inside an `<input>` element: verify `Cmd+W` does NOT close the active window.
