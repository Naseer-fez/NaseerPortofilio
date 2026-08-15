# Handoff Report — Explorer 2: Window System & Application Dispatch Architecture

**Author**: Explorer 2  
**Date**: 2026-08-15  
**Target**: Sub-Orchestrator M2 (`1d2e6d11-03e5-49a4-aef8-4b8b6bad9315`)

---

## 1. Observation

1. **WindowManager Current Implementation** (`src/components/window/WindowManager.tsx:1-22`):
   - `WindowManager` renders `WindowFrame` components for all entries in `windows` from `useOSStore`.
   - Currently lacks application dispatching: renders `WindowFrame` with no `children`, resulting in default placeholder text ("Application window content for...").
   - Returns `null` when `isMobile` is true via `useBreakpoint()`.

2. **WindowFrame Layout Issue** (`src/components/window/WindowFrame.tsx:161-168`):
   ```tsx
   {/* Body Content */}
   <div className="flex-1 overflow-auto p-4 bg-black/40 text-sm">
     {children || (
       <div data-testid={`window-body-${windowState.id}`} className="space-y-3">
         <h2 className="text-base font-semibold">{windowState.title}</h2>
         <p className="text-white/60">Application window content for {windowState.title}.</p>
       </div>
     )}
   </div>
   ```
   - The body container has hardcoded `p-4 overflow-auto`, which prevents edge-to-edge layouts required by `FinderApp` (sidebar navigation) and `SettingsApp` (category list) and `TerminalApp` (full bleed CLI).

3. **useOSStore Architecture** (`src/hooks/useOSStore.ts:50-387`):
   - `openWindow`, `closeWindow`, `minimizeWindow`, `toggleMaximize`, `focusWindow`, `updatePosition`, `updateSize` are fully implemented with cascade spawning, overhang boundary clamping, and z-index normalization within the `20..49` range.
   - `activeWindowId` is properly synchronized with window focus and fallback when windows close/minimize.

4. **TrafficLights Implementation** (`src/components/window/TrafficLights.tsx:1-81`):
   - Traffic lights implement close (`#FF5F56`), minimize (`#FFBD2E`), and maximize (`#27C93F`) with hover glyphs (✕, −, ⤢).
   - Properly dims buttons to gray when the window is unfocused and unhovered.

5. **Desktop Page Assembly** (`src/app/page.tsx:26-29`):
   - Layer 2 is currently an empty placeholder div: `<div id="window-layer" className="absolute inset-0 pointer-events-none z-20" />`. `WindowManager` is not yet mounted in `page.tsx`.

---

## 2. Logic Chain

1. **From Observation 1 & 2**: `WindowManager.tsx` must instantiate each of the 6 application components (`TerminalApp`, `ProjectsApp`, `AboutApp`, `FinderApp`, `SettingsApp`, `MailApp`) based on `win.id` and pass them as children to `WindowFrame`.
2. **From Observation 2**: `WindowFrame.tsx` body container must change from `p-4 overflow-auto` to `p-0 overflow-hidden flex flex-col flex-1 relative` so each app component has full control over its internal sidebars, toolbars, and scroll containers.
3. **From Observation 3**: The existing `useOSStore` actions already provide robust z-index clamping (20..49), cascade positioning with 24px step, and viewport overhang clamping (leaving 100px visible on screen).
4. **From Observation 4**: TrafficLights integrate directly with `useOSStore` actions and can trigger procedural audio effects via `GlobalAudioManager.getInstance().playFx(...)`.
5. **From Observation 5**: `WindowManager` must be mounted inside `src/app/page.tsx` at Layer 2 (`z-20..49`), ensuring full visibility and interaction between DesktopCanvas (z-10), TopMenuBar (z-50), and Dock (z-9990).

---

## 3. Caveats

1. **Mobile Bottom Sheet Rendering**: On mobile (<768px), `WindowManager` yields rendering. The sub-orchestrator and implementers should verify that `MobileBottomSheet` in `page.tsx` handles app dispatch similarly if mobile sheet rendering is active.
2. **Dynamic Audio Permissions**: Audio playback via `GlobalAudioManager` requires an initial user interaction to resume AudioContext from suspended state. This is already handled in `GlobalAudioManager.playFx`.

---

## 4. Conclusion

- An `APP_REGISTRY` dispatch map in `WindowManager.tsx` mapping `terminal`, `projects`, `about`, `finder`, `settings`, `mail` to their respective components solves application rendering cleanly and performantly.
- Updating `WindowFrame.tsx` to use a `p-0` full-bleed content container enables pixel-perfect macOS app layouts (Finder sidebars, Settings panes, Terminal CLI).
- Mounting `<WindowManager />` at Layer 2 in `src/app/page.tsx` connects the windowing subsystem into the live OS environment.

---

## 5. Verification Method

1. **Source Inspection**:
   - Inspect `src/components/window/WindowManager.tsx` to verify `APP_REGISTRY` contains all 6 apps.
   - Inspect `src/components/window/WindowFrame.tsx` to verify `p-0` full-bleed body wrapper and `data-testid="window-${windowState.id}"`.
   - Inspect `src/components/window/TrafficLights.tsx` to verify close/minimize/maximize buttons and hover glyphs.
2. **Build Verification**:
   - `npm run build` — must compile Next.js project with zero TypeScript or bundling errors.
3. **Test Suite Verification**:
   - `npx vitest run` — must pass all interaction and unit tests for window management and store actions.
