# Handoff Report: macOS Squircle Icons, Single-Click Desktop, Fisheye Dock & Test Audit

**Agent ID**: Explorer 3 (`explorer_refactor_3`)  
**Project Root**: `d:/CODE/Html/Showcase`  
**Date**: 2026-08-15  
**Milestone**: macOS Portfolio OS UX & Visual Refactor  

---

## 1. Observation

Direct observations from the investigation of the codebase and test suite:

1. **Dock Item & Desktop Icon Rendering**:
   - `src/components/dock/DockItem.tsx` (lines 62–67): Currently renders plain single-letter text inside a generic gradient:
     ```tsx
     <div
       data-testid={`dock-icon-${app.id}`}
       className="w-full h-full rounded-2xl flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md text-white font-bold text-base"
     >
       {app.title.charAt(0)}
     </div>
     ```
   - `src/components/os/DesktopIcon.tsx` (lines 140–151): Renders Lucide dynamic icon inside a basic gradient container rather than authentic squircle SVG icons.
   - `src/components/icons/`: Directory does not currently exist.

2. **Desktop Interaction Mechanics**:
   - `src/components/os/DesktopIcon.tsx` (lines 44–59): Uses a 300ms click timer (`clickTimeoutRef`) requiring a second click to open:
     ```tsx
     const handleClick = (e: React.MouseEvent) => {
       e.stopPropagation();
       if (clickTimeoutRef.current) {
         clearTimeout(clickTimeoutRef.current);
         clickTimeoutRef.current = null;
         handleOpen(app.id);
       } else {
         handleSelect(app.id);
         clickTimeoutRef.current = setTimeout(() => {
           clickTimeoutRef.current = null;
         }, 300);
       }
     };
     ```
   - `src/components/os/DesktopCanvas.tsx` (lines 38–46): Contains a boundary guard that ignores pointer clicks on buttons (`target.closest('button')`), ensuring marquee selection starts only when dragging on the desktop canvas surface, not when clicking icons.

3. **Dock Magnification & Physics**:
   - `src/lib/physics/springUtils.ts` (lines 7–19): Uses `calculateCosineBellWidth` with `baseWidth: 44`, `maxWidth: 68`, `radius: 150`. Peak scale is $68/44 = 1.54\text{x}$, whereas R3 specifies $1.8\text{x} - 2.2\text{x}$ (nominal $2.0\text{x}$), immediate neighbors $\sim 0.70\text{x}$ step, next neighbors $\sim 0.85\text{x}$ step.
   - `src/components/dock/Dock.tsx` (lines 37–50): Only computes width when `mouseX !== null`, without idle breathing animations when unhovered.

4. **Top Menu Bar & Apple Logo**:
   - `src/components/os/TopMenuBar.tsx` (lines 76–88): Inlines `AppleLogo` directly inside `TopMenuBar.tsx` instead of importing a swappable component from `@/components/icons/AppleLogo`.

5. **Test Suite Baseline & Impact**:
   - `npx vitest run`: Baseline verified at **28 test files, 281 tests passing (100%)**.
   - Specific tests asserting double-click behavior:
     - `tests/components/DesktopIcon.test.tsx` (line 62): Asserts 300ms double-click.
     - `tests/components/DesktopGrid.test.tsx` (line 26): Asserts `fireEvent.doubleClick(terminalIcon)`.
     - `tests/tier1-features/desktop.test.tsx` (lines 87 & 97): Asserts double-click launch and single-click non-launch.
     - `tests/stress/ui-interactions-stress.test.tsx` (lines 297–454): 8 tests stressing the 300ms disambiguation timer.
     - `tests/tier4-scenarios/user-workflows.test.tsx` (line 67): Asserts `fireEvent.doubleClick(termIcon)`.

---

## 2. Logic Chain

1. **Squircle Icons Overhaul** (Obs 1):
   - To achieve genuine macOS visual fidelity, create `src/components/icons/` with dedicated SVG squircle components (`TerminalIcon`, `ProjectsIcon`, `AboutIcon`, `FinderIcon`, `SettingsIcon`, `MailIcon`) and a central `AppIcon` dispatcher.
   - Each component features SVG `linearGradient`/`radialGradient`, inner bevel glow, drop shadow, and vector iconography on a `128x128` coordinate system with `rx="28"`.
   - `DockItem.tsx` and `DesktopIcon.tsx` will consume `<AppIcon appId={app.id} />`.

2. **Single-Click Desktop Launch** (Obs 2):
   - Removing the 300ms `clickTimeoutRef` from `DesktopIcon.tsx` and calling `handleSelect(app.id)` and `handleOpen(app.id)` directly in `onClick` provides instantaneous app launching.
   - Retaining `onDoubleClick` as an idempotent alias ensures safety under rapid double-clicking.
   - Because `DesktopCanvas.tsx` guards marquee creation against button targets (`target.closest('button')`), marquee selection remains completely functional when dragging on the canvas surface.

3. **Parabolic Fisheye Magnification & Idle Breathing** (Obs 3):
   - Upgrading the magnification function to `calculateFisheyeWidth` with $S_{\text{max}} = 2.0\text{x}$ ($88\text{px}$ width), influence radius $R = 140\text{px}$, and parabolic exponent $p = 2.2$ delivers the required scale profile (hovered $2.0\text{x}$, immediate neighbor $1.69\text{x}$ / $0.70\text{x}$ relative step, next neighbor $1.16\text{x}$).
   - When `mouseX === null`, dock items apply `.animate-dock-breathe` keyframe animation with staggered delay `index * 0.15s` for gentle vertical floating ($\Delta y = -2.5\text{px}$) and scale pulse ($1.025\text{x}$). When `mouseX !== null`, the animation is disabled for instantaneous cursor tracking.

4. **Apple Logo & Modular Config** (Obs 4):
   - Extracting `AppleLogo` to `src/components/icons/AppleLogo.tsx` enables swappable branding.
   - Unifying app configurations in `src/config/apps.ts` / `src/lib/constants/apps.ts` centralizes icon mapping and window defaults.

5. **Test Migration & New Coverage** (Obs 5):
   - Updating the 5 test files asserting double-click ensures 100% test integrity without regression.
   - Introducing `tests/components/SquircleIcons.test.tsx` validates SVG structure, gradient defs, and fallback dispatching.

---

## 3. Caveats

- **Marquee Selection Threshold**: Single-click on a desktop icon launches the app immediately; multi-selection of desktop icons is performed by dragging a marquee box on the desktop wallpaper canvas across the icons.
- **Mobile Breakpoint**: On mobile devices (`isMobile: true`), the Dock is hidden by design in `src/components/dock/Dock.tsx` (line 13). Mobile view utilizes responsive drawer/grid navigation.
- **Browser Compatibility**: SVG gradients and clip-paths use standard SVG 1.1 / 2.0 specs supported across all modern browsers (Safari, Chrome, Firefox, Edge).

---

## 4. Conclusion

The blueprint in `d:/CODE/Html/Showcase/.agents/explorer_refactor_3/analysis.md` provides an end-to-end, complete implementation plan for:
1. 6 bespoke macOS squircle SVG icon components + `AppleLogo` + `AppIcon` dispatcher.
2. Single-click desktop icon launch with selection preservation.
3. Parabolic fisheye dock physics ($2.0\text{x}$ peak, $0.70\text{x}$ curve step) and idle breathing animation.
4. Test suite updates across 5 test files plus new squircle unit tests, preserving 100% test pass rate across all suites.

---

## 5. Verification Method

To independently verify the implementation:

1. **Run Full Test Suite**:
   ```powershell
   npx vitest run
   ```
   **Expected**: All 28+ test suites pass (281+ tests, zero failures).

2. **Verify Squircle Icon Rendering**:
   - Inspect DOM elements with `data-testid="icon-terminal-svg"`, `data-testid="icon-projects-svg"`, `data-testid="icon-about-svg"`, `data-testid="icon-finder-svg"`, `data-testid="icon-settings-svg"`, `data-testid="icon-mail-svg"`.
   - Verify SVG root element, viewBox `0 0 128 128`, and inner gradient `<defs>`.

3. **Verify Desktop Single-Click Launch**:
   - Run `npx vitest run tests/components/DesktopIcon.test.tsx tests/components/DesktopGrid.test.tsx tests/tier1-features/desktop.test.tsx`.
   - Verify single click triggers `openWindow` immediately without waiting 300ms.

4. **Verify Dock Fisheye Scaling & Breathing**:
   - Run `npx vitest run tests/tier1-features/dock.test.tsx`.
   - Verify hovered icon scale reaches $2.0\text{x}$ ($88\text{px}$) on pointer move, neighbors scale according to parabolic curve, and idle breathing class applies when unhovered.

5. **Static Build Check**:
   ```powershell
   npm run build
   ```
   **Expected**: Successful Next.js compilation with zero TypeScript or lint errors.
