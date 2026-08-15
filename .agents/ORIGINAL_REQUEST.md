# Original User Request

## Initial Request — 2026-08-15T11:32:19Z

<USER_REQUEST>
Implement a comprehensive UX and visual refactor of an existing Next.js macOS-style portfolio OS showcase, including a new lock screen experience, a retro cassette music player widget, and an overhaul of the dock and desktop icons.

Working directory: d:\CODE\Html\Showcase
Integrity mode: development

## Requirements

### R1. Lock Screen (NEW Component)
Create a fullscreen lock screen layer (`z-[10000]`) that appears on initial load. It must display the live time (HH:MM), date ("Weekday, Month DD"), "Welcome to" text, and the brand "Irfan.dev" in a script font. The lock screen background must be driven by a new modular wallpaper config. The lock screen must include a magnetic cursor and kinetic typography applied to the "Irfan.dev" text. Clicking anywhere should trigger a smooth, slide-up dismiss transition to reveal the desktop.

### R2. Retro Cassette Music Player Widget
Replace the existing `AudioDeckExpandedCard` and `MusicPlayerDockPill` with a freely draggable retro SONY-style cassette tape widget. It must feature transport controls wired to the existing `GlobalAudioManager`, spinning tape reels that animate only during active playback, and a color scheme that dynamically extracts and matches the desktop wallpaper's dominant colors. Playback tracks must be defined via a config file with placeholder MP3 paths.

### R3. Dock & Desktop Icon Overhaul
Replace existing basic letter icons with macOS-style squircle icons containing SVG graphics with gradients and depth for Terminal, Projects, About, Finder, Settings, and Mail. Change interactions from double-click to single-click to open apps. Implement a fisheye magnification hover effect for the dock (hovered icon scales 1.8-2.2x, immediate neighbors scale 0.7x, next neighbors 0.85x) and an idle breathing animation for all dock icons when not hovered.

### R4. Core System Updates
- Replace the top menu bar Apple logo with a proper, swappable SVG.
- Ensure the magnetic cursor and kinetic typography systems are portable utilities capable of being used on both the lock screen and desktop.
- Create a central configuration system for wallpapers, music tracks, and icons, removing hardcoded values.

## Acceptance Criteria

### Verification
- [ ] Automated tests (Vitest/RTL): Ensure the existing 281 tests pass. Write new tests for the lock screen render/dismiss, cassette player playback state, and config loading.
- [ ] Manual visual verification: The fisheye dock effect operates smoothly without layout thrashing; the cassette color dynamically matches the wallpaper; the lock screen slide-up transition is performant.
</USER_REQUEST>
