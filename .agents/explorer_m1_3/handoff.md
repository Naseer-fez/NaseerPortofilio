# Handoff Report: Milestone 1 — Visual, Layout & Component Specifications

## 1. Observation
- **Specification Source 1**: `d:\CODE\Html\Showcase\PROJECT.md:13-22` dictates exact 8-layer Z-index hierarchy: Layer 0 (`z-0`) Wallpaper + KineticHeroStage; Layer 1 (`z-10`) DesktopCanvas + DesktopGrid + SelectionMarquee; Layer 2 (`z-20..49`) Windows; Layer 3 (`z-50`) TopMenuBar; Layer 4 (`z-9990`) Dock; Layer 5 (`z-9992`) AudioDeck; Layer 6 (`z-9995`) Spotlight + ContextMenu + ControlCenter; Layer 7 (`z-9999`) KineticCursor.
- **Specification Source 2**: `d:\CODE\Html\Showcase\portfolio_research\phase2\design\visual-system.md:60-80` confirms Top Menu Bar metrics: Height 28px (`h-7`), `fixed top-0 left-0 right-0`, `z-50`, `blur(40px)` (`backdrop-blur-2xl`), Apple Logo 14×14px SVG, Active App Title `12.5px font-semibold tracking-tight`, Clock `12px font-medium tracking-tight`, Status Tray Gap 10px (`gap-2.5`).
- **Specification Source 3**: `d:\CODE\Html\Showcase\portfolio_research\phase2\research\base-site-reverse-engineering.md:49-83` confirms Wallpaper overlay in dark mode (`bg-black/25`) and light mode (`bg-black/10`), 700ms crossfade duration, and Desktop Grid layout: `grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 p-4`, 48×48px icon wrapper with `drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]`, 11px white label with `line-clamp-2 max-w-[84px]`, hover `bg-white/15`, double-click launch with 300ms disambiguation timer, touch single-tap direct launch.
- **Specification Source 4**: `d:\CODE\Html\Showcase\portfolio_research\phase2\architecture\interaction-map.md:8-18` confirms DesktopCanvas interactions: click empty area to deselect/dismiss menus, right click for context menu, double click for ambient/workspace toggle (`Cmd+Option+M`).

## 2. Logic Chain
1. **Z-Index Layer Alignment**: All desktop components must respect strict layer indices so windows (`z-20..49`), top menu bar (`z-50`), dock (`z-9990`), context menus (`z-9995`), and cursor (`z-9999`) sit in precise stacking context over DesktopCanvas (`z-10`) and Wallpaper (`z-0`).
2. **Spatial Isolation**: DesktopCanvas must occupy `top-7` (`28px`) to prevent covering the fixed TopMenuBar, ensuring native pointer events and menu clicks register without z-index fighting.
3. **Resilience & Fallback**: High-resolution wallpaper images may take time to load or may be unavailable locally; hence `lib/constants/wallpapers.ts` must provide multi-stop CSS mesh gradients as immediate render fallbacks beneath `framer-motion` crossfade transitions.
4. **Interaction Disambiguation**: On desktop devices, double-click to launch requires a 300ms timer to differentiate single-click icon selection from app launching. On mobile/touch devices (`onTouchEnd`), single tap launches directly to avoid latency.
5. **SSR Hydration Safety**: Time-dependent components (`LiveClock`) and theme state can cause React hydration mismatches if server and client render different strings. A mounted-state check for `LiveClock` and an inline `<head>` script for initial theme class resolve this deterministically.

## 3. Caveats
- `SelectionMarquee` (multi-select dragging) is architecturally scoped within Layer 1 (`DesktopCanvas`), but its full bounding-box collision detection can be enhanced incrementally without blocking icon launches.
- High-res wallpaper image assets (`.webp`/`.avif`) can be added to `/public/wallpapers/` as static assets; until then, procedural CSS mesh gradients render instantly.

## 4. Conclusion
The visual, layout, and component specifications are fully analyzed and codified into implementation-ready designs:
- `lib/constants/wallpapers.ts`: Catalog of 7 curated wallpapers with fallback gradients, theme preferences, and overlays.
- `components/os/Wallpaper.tsx`: Layer 0 700ms crossfader with dark/light mode tint overlays.
- `components/os/DesktopCanvas.tsx`: Layer 1 interaction surface with click-to-deselect, context menu dispatch, and double-click ambient toggle.
- `components/os/DesktopGrid.tsx` & `DesktopIcon.tsx`: macOS auto-flow vertical grid with 48×48 icons, 11px labels, 300ms disambiguation, and touch support.
- `components/os/TopMenuBar.tsx`: 28px glassmorphic bar with Apple menu, dynamic active app name, standard menus, status tray, and hydration-safe LiveClock.
- Complete integration recipes provided for `src/app/layout.tsx` and `src/app/page.tsx`.

## 5. Verification Method
1. **File Inspection**:
   - Inspect `d:\CODE\Html\Showcase\.agents\explorer_m1_3\analysis.md` for complete code contracts and component definitions.
2. **Vitest / Component Test Validation**:
   - Run `npm run test` or `npx vitest run` on component test suite:
     - `Wallpaper.test.tsx` (verifies 700ms crossfade, theme overlays, fallback gradients)
     - `DesktopCanvas.test.tsx` (verifies click-outside, context menu, double-click ambient mode toggle)
     - `DesktopIcon.test.tsx` (verifies 300ms single vs double click, touch tap, hover, selection)
     - `TopMenuBar.test.tsx` (verifies 28px fixed bar, Apple menu, dynamic app title, LiveClock format `Sat Aug 15 12:51 PM`)
3. **Visual & Layout Layout Compliance**:
   - Check `h-[calc(100vh-28px)]` bounds for DesktopCanvas.
   - Verify `backdrop-blur-2xl` and `bg-white/70 dark:bg-black/40` in browser.
