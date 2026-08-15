# Scope: Milestone 1 — Core OS Framework

## Objective
Initialize the Next.js 14+ (App Router) project with TypeScript, Tailwind CSS, Framer Motion, Zustand, Lucide React, and build the foundational Core OS layers:
1. Next.js initialization & package setup (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`).
2. CSS Custom Properties and design tokens in `src/app/globals.css` matching `visual-system.md` (dark/light themes, glassmorphism, blur tokens).
3. Font configuration (Inter Variable + JetBrains Mono).
4. `useOSStore` (Zustand) with complete TypeScript interfaces from `state-architecture.md` (window state, activeWindowId, desktopMode, theme, wallpaper, soundEnabled, persistence).
5. `DesktopCanvas` (Layer 1, z-10, full viewport minus 28px menu bar, click/right-click/marquee handlers).
6. `Wallpaper` component with 700ms crossfade transitions and theme tint overlays.
7. `DesktopGrid` & `DesktopIcon` (auto-flow 92px columns, 104px rows, 48x48 icons, double click to open, 300ms disambiguation timer).
8. `TopMenuBar` (28px fixed bar, blur-2xl, Apple logo, dynamic active app name, status icons, live clock format `Sat Aug 15 12:51 PM`).
9. `ShortcutRegistry` / `useKeyboardShortcuts` global listener (Cmd+K, Cmd+W, Cmd+M, Escape, Cmd+Shift+D, Cmd+Option+M).

## Specifications to Follow
- `d:\CODE\Html\Showcase\portfolio_research\phase2\PHASE_2_MASTER_SPEC.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\design\visual-system.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\architecture\state-architecture.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\base-site-reverse-engineering.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\implementation\implementation-spec.md` (Sprint 1)

## Instructions for Sub-Orchestrator
- Working directory: `d:\CODE\Html\Showcase\.agents\sub_orch_m1\`
- Spawn Explorers, Workers, Reviewers, Challengers, and Forensic Auditors per iteration loop.
- Ensure all builds and unit tests pass before completing milestone gate.
