# Original User Request for worker_refactor_1

## 2026-08-15T12:15:00Z

<USER_REQUEST>
You are the Implementation Worker on the macOS Portfolio OS UX & Visual Refactor project.
Working directory: d:/CODE/Html/Showcase/.agents/worker_refactor_1/
Project root: d:/CODE/Html/Showcase

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. A Forensic Auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.

Carefully read all requirements and architectural blueprints:
- `d:/CODE/Html/Showcase/.agents/ORIGINAL_REQUEST.md`
- `d:/CODE/Html/Showcase/.agents/explorer_refactor_1/analysis.md` and `handoff.md`
- `d:/CODE/Html/Showcase/.agents/explorer_refactor_2/analysis.md` and `handoff.md`
- `d:/CODE/Html/Showcase/.agents/explorer_refactor_3/analysis.md` and `handoff.md`

Execute the complete implementation following these specifications:

1. Central Configuration System:
   - `src/config/wallpapers.ts`: Modular wallpaper definitions with structured color palettes (`primary`, `secondary`, `accent`, `surface`, `border`, `labelBg`, `labelText`, `shadow`). Re-export from `src/lib/constants/wallpapers.ts` for backward compatibility.
   - `src/config/music.ts`: Central track definitions with title, artist, duration, cover, and MP3 paths. Re-export in `tests/fixtures/playlist.fixture.ts`.
   - `src/config/apps.ts`: Central app definitions, icon mappings, and window bounds.

2. Lock Screen (R1):
   - `src/components/os/LockScreen.tsx`: Fullscreen layer (`z-[10000]`) on initial load.
   - Real-time live clock (HH:MM) and date ("Weekday, Month DD") with client-side hydration guard.
   - "Welcome to" header text and "Irfan.dev" brand title in script font.
   - `src/components/typography/KineticBrandTitle.tsx` applying Euler ODE physics and variable font weight displacement to "Irfan.dev".
   - Background driven by active modular wallpaper config.
   - Smooth slide-up dismiss transition (`y: -100%`, opacity fade, spring easing) on user click or touch.
   - State management: `isLocked: boolean` (default `true`), `unlock()`, `lock()` in `src/hooks/useOSStore.ts`.
   - Cursor z-index: Update `CursorPrecisionDot.tsx`, `CursorAuraRing.tsx`, and `tailwind.config.ts` to `z-[10001]` so magnetic cursor operates smoothly on top of Lock Screen and Desktop.
   - Mount `<LockScreen />` in `src/app/page.tsx`.

3. Retro SONY Cassette Music Player Widget (R2):
   - `src/components/music/RetroCassettePlayer.tsx` and `src/components/music/CassetteReel.tsx`.
   - Replace `AudioDeckExpandedCard` and `MusicPlayerDockPill` (remove pill from `Dock.tsx`, remove `AudioDeckExpandedCard` from `page.tsx`, mount `RetroCassettePlayer` in `page.tsx`).
   - Freely draggable Framer Motion container (`drag`, `dragMomentum={false}`, viewport bounds clamping).
   - Authentic retro SONY cassette styling: plastic chassis, 4 corner screws, paper sticker label with track and artist, dual transparent tape windows, magnetic tape ribbon.
   - Dual spinning tape reels with 6-toothed star hubs, rotational animation active ONLY when `isPlaying` is true (`animationPlayState: isPlaying ? 'running' : 'paused'`).
   - Dynamic tape thickness mathematics based on area conservation ($R(p) = \sqrt{R_{\min}^2 + (R_{\max}^2 - R_{\min}^2) \times \text{weight}}$).
   - Full transport controls (Play/Pause, Prev, Next, Scrubber, Volume slider, Mute) wired to `useMusicStore` and `GlobalAudioManager` (with tactile click audio FX).
   - Dynamic wallpaper color matching: Extract dominant theme from active wallpaper in `useOSStore` to tint chassis, accent stripe, paper label, and LED glow.

4. Dock & Desktop Icon Overhaul (R3 & R4):
   - Create `src/components/icons/`:
     - `TerminalIcon.tsx`
     - `ProjectsIcon.tsx`
     - `AboutIcon.tsx`
     - `FinderIcon.tsx`
     - `SettingsIcon.tsx`
     - `MailIcon.tsx`
     - `AppleLogo.tsx`
     - `AppIcon.tsx`
     - `index.ts`
   - High-fidelity macOS squircle vector icons (`rx="28"`, `128x128`), multi-stop gradients, bevel highlights, inner shadow, depth.
   - Update `DockItem.tsx` and `DesktopIcon.tsx` to render `<AppIcon appId={app.id} />`.
   - Update `DesktopIcon.tsx` to single-click app launch (`onClick`), preserving marquee selection.
   - Update Parabolic Dock fisheye magnification formula in `src/lib/physics/springUtils.ts` and `DockItem.tsx` ($2.0\text{x}$ hovered, $0.70\text{x}$ relative step for immediate neighbors, $0.85\text{x}$ next neighbors).
   - Add idle breathing animation (`.animate-dock-breathe` in `globals.css` or Tailwind/Framer) for dock icons when unhovered.
   - Replace inlined Apple logo in `TopMenuBar.tsx` with `<AppleLogo />`.

5. Test Suite Updates & Verification:
   - Update existing test files that asserted double-click or old audio deck:
     - `tests/components/DesktopIcon.test.tsx`
     - `tests/components/DesktopGrid.test.tsx`
     - `tests/tier1-features/desktop.test.tsx`
     - `tests/stress/ui-interactions-stress.test.tsx`
     - `tests/tier4-scenarios/user-workflows.test.tsx`
     - `tests/tier1-features/music.test.tsx`
   - Add new test suites:
     - `tests/components/LockScreen.test.tsx`
     - `tests/components/RetroCassettePlayer.test.tsx`
     - `tests/components/SquircleIcons.test.tsx`
     - `tests/config/wallpapers.test.ts`
     - `tests/config/music.test.ts`
   - Run tests (`npx vitest run`), type check (`npm run type-check`), and build (`npm run build`). Ensure 100% tests pass.

Document all changes, commands, and test outputs in `d:/CODE/Html/Showcase/.agents/worker_refactor_1/handoff.md` and send a completion message back to orchestrator.
</USER_REQUEST>
