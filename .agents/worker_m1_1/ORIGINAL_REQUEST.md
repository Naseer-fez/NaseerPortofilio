## 2026-08-15T09:12:25Z
You are Worker 1 for Milestone 1 (Core OS Framework).
Your working directory is: d:\CODE\Html\Showcase\.agents\worker_m1_1\

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
All 3 Explorers have delivered detailed specifications and analysis reports:
- Explorer 1 (Build, Config, Tokens, Fonts, Vitest): `d:\CODE\Html\Showcase\.agents\explorer_m1_1\analysis.md` and `handoff.md`
- Explorer 2 (State Architecture, useOSStore, Shortcuts): `d:\CODE\Html\Showcase\.agents\explorer_m1_2\analysis.md` and `handoff.md`
- Explorer 3 (DesktopCanvas, Wallpaper, DesktopGrid/Icon, TopMenuBar, App integration): `d:\CODE\Html\Showcase\.agents\explorer_m1_3\analysis.md` and `handoff.md`
- Global specifications: `PROJECT.md`, `portfolio_research\phase2\PHASE_2_MASTER_SPEC.md`, `portfolio_research\phase2\design\visual-system.md`, `portfolio_research\phase2\architecture\state-architecture.md`, `portfolio_research\phase2\implementation\implementation-spec.md`

## Your Implementation Tasks (in d:\CODE\Html\Showcase\):
1. **Initialize Project & Config**:
   - `package.json`: Next.js 14+ (or latest 14/15), React 18/19, TypeScript, Tailwind CSS, Framer Motion, Zustand, Lucide React, clsx, tailwind-merge, vitest, jsdom, @testing-library/react, @testing-library/jest-dom, etc.
   - Install dependencies (using npm install / whatever package manager is available).
   - `tsconfig.json`: Next.js path aliases (`@/*` -> `./src/*`), strict typechecking.
   - `tailwind.config.ts`: Extend theme with macOS OS tokens (colors, border-radius, backdrop-blur scale 20px-40px, z-index scale 0-9999, shadows).
   - `postcss.config.js` or `postcss.config.mjs`.
   - `next.config.mjs` (or `next.config.js`).
   - `vitest.config.ts` and `vitest.setup.ts`.

2. **Styling & Tokens**:
   - `src/app/globals.css`: Complete CSS custom properties for light (`:root`) and dark (`.dark`) themes from `visual-system.md`, glassmorphic tokens, 100vw/100vh viewport locks, `overflow: hidden`, `user-select: none`.
   - `src/lib/utils/cn.ts`: `clsx` and `twMerge` utility.

3. **Types & Constants**:
   - `src/types/os.ts`: Complete TypeScript interfaces for `AppWindow`, `WindowState`, `OSStore`, `ContextMenuItem`, `DesktopMode`, `ThemeMode`, etc.
   - `src/lib/constants/apps.ts`: Initial app registry for the 6 core apps (Terminal, Projects, About, Finder, Settings, Mail) with dimensions, minSize (360x240), icons, positions.
   - `src/lib/constants/wallpapers.ts`: Catalog of wallpapers with names, dark/light variations, and fallback CSS gradients.
   - `src/lib/constants/shortcuts.ts`: Keyboard shortcut registry map.

4. **State Management & Hooks**:
   - `src/hooks/useOSStore.ts`: Zustand store with complete actions (`openWindow`, `closeWindow`, `minimizeWindow`, `toggleMaximize`, `focusWindow`, `updatePosition`, `updateSize`, `setDesktopMode`, `setTheme`, `setWallpaper`, `setSoundEnabled`, `setContextMenu`, `setSpotlightOpen`, `selectIcon`, `clearSelectedIcons`), z-index promotion logic, window focus cascades, and localStorage persistence for persistent fields.
   - `src/hooks/useKeyboardShortcuts.ts`: Global keyboard shortcut listener (`Cmd+K`, `Cmd+W`, `Cmd+M`, `Cmd+Shift+D`, `Cmd+Option+M`, `Escape`).

5. **Desktop & OS Components**:
   - `src/components/os/Wallpaper.tsx`: Layer 0 (`z-0`) wallpaper with 700ms crossfade transitions between wallpaper changes and dark/light tint overlays.
   - `src/components/os/DesktopCanvas.tsx`: Layer 1 (`z-10`) interaction surface, handling click to clear icon selection, right-click desktop context menu, double-click ambient/workspace mode toggle.
   - `src/components/os/DesktopGrid.tsx` & `src/components/os/DesktopIcon.tsx`: macOS auto-flow vertical grid layout (`grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 p-4`), 48x48 icon wrapper, 11px white label with drop shadow and 2-line clamp, hover `bg-white/15`, selection indicator, double-click launch with 300ms disambiguation timer, touch single tap.
   - `src/components/os/TopMenuBar.tsx`: 28px fixed bar (`z-50`), `blur(40px)`, Apple logo menu, dynamic active app name (`activeWindowId`), menus (File, Edit, View, Window, Help), status tray icons (WiFi, Battery, Control Center, Search), hydration-safe LiveClock (`Sat Aug 15 12:51 PM` format).
   - `src/app/layout.tsx`: Root layout with font configuration (Inter Variable and JetBrains Mono), meta tags, theme class synchronization, shortcut listener.
   - `src/app/page.tsx`: Main page assembling Wallpaper, DesktopCanvas, DesktopGrid, TopMenuBar.

6. **Unit and Component Tests**:
   - Create unit tests under `tests/` or `src/__tests__/`:
     - `useOSStore.test.ts`: Test openWindow, closeWindow, focusWindow zIndex bumping, minimize/maximize, theme toggle, desktopMode toggle, persistence.
     - `useKeyboardShortcuts.test.ts`: Test shortcut key combinations (Cmd+K, Cmd+W, Cmd+M, Cmd+Shift+D, Cmd+Option+M, Escape).
     - `TopMenuBar.test.tsx`: Test 28px bar, live clock format, active app name binding, Apple menu.
     - `DesktopIcon.test.tsx` & `DesktopGrid.test.tsx`: Test 300ms double-click vs single-click selection, icon rendering.
     - `Wallpaper.test.tsx`: Test wallpaper rendering and crossfade.
     - `DesktopCanvas.test.tsx`: Test click to clear selection, right click, double click mode toggle.

7. **Verification**:
   - Run the TypeScript check (`npx tsc --noEmit` or `npm run type-check`).
   - Run the unit tests (`npm test` or `npx vitest run`).
   - Run the Next.js build (`npm run build`).
   - Ensure all checks pass with 0 errors.

8. **Output**:
   - Write your handoff report to `d:\CODE\Html\Showcase\.agents\worker_m1_1\handoff.md` and progress to `d:\CODE\Html\Showcase\.agents\worker_m1_1\progress.md`.
   - Send a completion message to the Milestone 1 Sub-Orchestrator.
