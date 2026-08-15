# Context: macOS Portfolio OS Architecture

## Existing File Structure & Key Modules
- `src/app/page.tsx`: Main OS entry point, currently mounts `TopMenuBar`, `DesktopCanvas`, `WindowManager`, `Dock`, `AudioDeckExpandedCard`, `SpotlightSearch`, `ContextMenu`, `KineticCursor`.
- `src/components/os/TopMenuBar.tsx`: Menu bar with Apple logo (currently Lucide `Apple` icon or character). Needs swappable SVG.
- `src/components/os/DesktopCanvas.tsx`, `DesktopGrid.tsx`, `DesktopIcon.tsx`: Icons on desktop currently require double-click (`onDoubleClick={handleOpenApp}`). Needs update to single-click.
- `src/components/dock/Dock.tsx`, `DockItem.tsx`, `MusicPlayerDockPill.tsx`: Parabolic dock using Framer Motion springs. DockItem needs fisheye formula update (1.8-2.2x hovered, 0.7x immediate neighbor, 0.85x next neighbor) and idle breathing animation. `MusicPlayerDockPill` to be replaced / refactored.
- `src/components/music/AudioDeckExpandedCard.tsx`, `VinylDiscAssembly.tsx`: To be replaced by freely draggable retro SONY-style cassette tape widget.
- `src/components/typography/KineticHeroStage.tsx`, `SplitText.tsx`: Kinetic typography using Euler physics solver. Need to make utilities portable for LockScreen as well.
- `src/components/cursor/KineticCursor.tsx`, `CursorPrecisionDot.tsx`, `CursorAuraRing.tsx`: Magnetic cursor system with `data-cursor` state machine.
- `src/lib/constants/wallpapers.ts`, `apps.ts`: Hardcoded configs to be generalized into central modular config.
- `src/lib/audio/GlobalAudioManager.ts`: Web Audio API singleton with HTMLAudioElement and SoundSynthesizer.
- `src/hooks/useOSStore.ts`, `useMusicStore.ts`: Zustand stores for OS and Audio state.

## Target Refactor Changes
1. **LockScreen Component**:
   - Layer: `z-[10000]`.
   - Initial state: visible on page load.
   - Dismiss: slide up `y: -100%` on click or key press.
   - Elements: live HH:MM time, full date string, "Welcome to" header, "Irfan.dev" with kinetic typography & magnetic cursor.
   - Wallpaper: driven by modular wallpaper config.

2. **Retro Cassette Player Widget**:
   - Draggable container (using Framer Motion `drag` or mouse event drag).
   - Retro SONY-style cassette tape aesthetic with plastic shell, label sticker, dual transparent windows, dual tape reels with spoke holes.
   - Reel spinning animation active only when `isPlaying` is true in `useMusicStore`.
   - Controls: Play/Pause, Skip Back, Skip Forward, Progress Scrubber, Volume Slider.
   - Dynamic theme/color extraction from active wallpaper's dominant palette.
   - Modular track list defined in central config.

3. **Squircle Icons & Dock Overhaul**:
   - 6 core apps: Terminal, Projects, About, Finder, Settings, Mail.
   - Rich SVG squircle icons with layered gradients, bevel highlights, inner shadow, depth.
   - Desktop icon single-click interaction to launch.
   - Dock fisheye magnification: scale factors conforming to specification (hovered 1.8-2.2x, immediate neighbor 0.7x ratio, next 0.85x ratio).
   - Idle breathing animation on dock items when idle.

4. **Central Configuration**:
   - Wallpapers: array of wallpaper definitions with name, path/gradient, dominant palette colors (primary, accent, border).
   - Music Tracks: array of track definitions (title, artist, duration, cover, src).
   - Icons / Apps: metadata for apps with SVG components, descriptions, default window bounds.
   - Top menu bar: customizable/swappable SVG logo.

5. **Test Strategy**:
   - Preserve test integrity across the 281 existing tests.
   - Update tests where signatures or interactions changed (e.g. desktop single-click vs double-click, cassette player replacing old audio deck).
   - Add new test suites for LockScreen, Retro Cassette Player, Central Configs, and Dock Magnification.
