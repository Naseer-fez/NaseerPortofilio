## 2026-08-15T09:45:10Z
<USER_REQUEST>
You are Worker 1 for Milestones 2-5 (Applications, WindowManager & Full Showcase Assembly).
Working Directory: d:\CODE\Html\Showcase\.agents\worker_m2_1\
Scope Document: d:\CODE\Html\Showcase\.agents\sub_orch_m2\SCOPE.md
Project Spec: d:\CODE\Html\Showcase\PROJECT.md
Explorer 1 Analysis: d:\CODE\Html\Showcase\.agents\explorer_m2_1\analysis.md
Explorer 2 Analysis: d:\CODE\Html\Showcase\.agents\explorer_m2_2\analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Implement the 6 Applications in `src/components/apps/`:
   - `TerminalApp.tsx`: Interactive CLI with Neofetch banner, commands (`help`, `about`, `projects`, `skills`, `clear`, `neofetch`, `theme`, `date`, `contact`, `sudo`, `cat`, `matrix`), command history with up/down arrows, tab completion, sound FX via `GlobalAudioManager.getInstance().playFx('click')`, Matrix digital rain canvas mode.
   - `ProjectsApp.tsx`: Interactive project showcase with category filter pills (`All`, `Full Stack`, `AI / ML`, `Systems`, `Creative`), real-time search input, 6 rich project cards with tech tags, and Project Detail Modal with live links.
   - `AboutApp.tsx`: Interactive developer profile, bio section, quick stats grid, career timeline tab, skills matrix tab with animated proficiency bars, PDF resume download action.
   - `FinderApp.tsx`: macOS-style Finder with sidebar tree (Applications, Documents, Pictures, Downloads), file view (Grid / List toggle), breadcrumbs, and file preview pane with metadata and quick view.
   - `SettingsApp.tsx`: macOS System Settings with Wallpaper picker grid (with thumbnail preview & instant swap calling `setWallpaper`), Appearance (Dark / Light toggle calling `setTheme`), Dock magnification slider & toggle, Sound FX toggle, Typography Ambient Mode toggle.
   - `MailApp.tsx`: macOS Mail contact client with fields (Name, Email, Subject, Message), validation rules, interactive paper airplane send button with spring animation and UI sound trigger, success screen.

2. Update `src/components/window/WindowFrame.tsx`:
   - Set content body wrapper to `flex-1 overflow-hidden relative flex flex-col p-0` so apps can render sidebars flush and control their own scrolling.

3. Update `src/components/window/WindowManager.tsx`:
   - Register the 6 app components in `APP_REGISTRY` and render the matching component inside `WindowFrame` based on `win.id`.

4. Update `src/app/page.tsx`:
   - Assemble all 8 z-index layers and mobile components cleanly:
     - Layer 0: `Wallpaper` + `KineticHeroStage`
     - Layer 1: `DesktopCanvas` + `DesktopGrid`
     - Layer 2: `WindowManager`
     - Layer 3: `TopMenuBar`
     - Layer 4: `Dock`
     - Layer 5: `AudioDeckExpandedCard`
     - Layer 6: `SpotlightSearch` + `ContextMenu`
     - Layer 7: `KineticCursor`
     - Global: `GlobalKeyboardListener`
     - Mobile: `MobileBottomSheet` (for open windows) + `MobileTabBar` + `MobileStickyAudioBar`

5. Verify:
   - Run `npx vitest run` and `npm run build` via `run_command`. Ensure 0 compilation errors and all tests pass.
   - Document verification commands and full outputs in `d:\CODE\Html\Showcase\.agents\worker_m2_1\handoff.md`.
   - Report back to sub-orchestrator conversation ID 1d2e6d11-03e5-49a4-aef8-4b8b6bad9315 via `send_message`.
</USER_REQUEST>
