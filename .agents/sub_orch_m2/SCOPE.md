# Scope: Milestones 2-5 Implementation & Full Integration

## Objective
Implement all 6 application components, wire them into WindowManager, assemble the complete desktop OS in `src/app/page.tsx`, and ensure all visual and interaction specifications are met:

### 1. 6 Dedicated Applications (`src/components/apps/`)
- `TerminalApp.tsx`: Interactive CLI with Neofetch banner, commands (`help`, `about`, `projects`, `skills`, `clear`, `neofetch`, `theme`, `date`, `contact`, `sudo`, `cat`, `matrix`), command history with up/down arrows, tab completion, sound FX on command execute.
- `ProjectsApp.tsx`: Interactive project showcase with category filter pills (All, Full Stack, AI / ML, Systems, Creative), interactive cards with tags, modal / external preview links, search filter.
- `AboutApp.tsx`: Interactive developer profile, bio section, interactive career timeline, interactive skills matrix with animated proficiency bars, PDF resume download action.
- `FinderApp.tsx`: macOS-style Finder with sidebar tree (Applications, Documents, Pictures, Downloads), file view (Grid / List toggle), file preview pane with metadata and preview content.
- `SettingsApp.tsx`: macOS System Settings with Wallpaper picker grid (with thumbnail preview & instant swap), Appearance (Dark / Light toggle), Dock magnification slider & toggle, Sound FX toggle, Typography Ambient Mode toggle.
- `MailApp.tsx`: macOS Mail contact client with fields (Name, Email, Subject, Message), validation, interactive paper airplane send button with spring animation and UI sound trigger.

### 2. WindowManager & App Dispatch
- Update `src/components/window/WindowManager.tsx` to render the 6 apps inside their respective `WindowFrame` components based on `win.id`.

### 3. Full Desktop Assembly (`src/app/page.tsx`)
- Wire all 8 z-index layers:
  - Layer 0: `Wallpaper` + `KineticHeroStage`
  - Layer 1: `DesktopCanvas` + `DesktopGrid`
  - Layer 2: `WindowManager`
  - Layer 3: `TopMenuBar`
  - Layer 4: `Dock` (with `MusicPlayerDockPill` + `ActiveDotIndicator` + `DockTooltip`)
  - Layer 5: `AudioDeckExpandedCard`
  - Layer 6: `SpotlightSearch` + `ContextMenu`
  - Layer 7: `KineticCursor`
  - Global: `GlobalKeyboardListener`
  - Mobile: `MobileBottomSheet`, `MobileTabBar`, `MobileStickyAudioBar`

### 4. Build & Unit Test Verification
- Run `npm run build` and `npx vitest run` to verify all components compile and tests pass.
