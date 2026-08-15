# UX and Visual Refactor Plan

## Overview
Comprehensive UX and visual refactor of the Next.js macOS-style portfolio OS showcase as specified in ORIGINAL_REQUEST.md.

## Requirements Breakdown

### R1. Lock Screen (NEW Component)
- Fullscreen layer (`z-[10000]`) displayed on initial load.
- Live time (HH:MM format) & live date ("Weekday, Month DD").
- "Welcome to" header text, brand "Irfan.dev" in distinctive script/serif font.
- Dynamic wallpaper background driven by modular wallpaper config.
- Portable magnetic cursor interaction + kinetic typography applied to "Irfan.dev".
- Smooth slide-up dismiss transition (`y: -100%`, opacity, spring easing) on user click to reveal desktop.

### R2. Retro Cassette Music Player Widget
- Replace `AudioDeckExpandedCard` and `MusicPlayerDockPill` with a freely draggable retro SONY-style cassette tape widget.
- Transport controls (Play/Pause, Prev, Next, Scrubber, Volume) wired to `GlobalAudioManager` / `useMusicStore`.
- Spinning tape reels (dual reels with spokes) animating smoothly ONLY during active playback.
- Dynamic wallpaper color matching (extract/tint cassette body or accents based on active wallpaper's dominant palette).
- Modular track configuration with placeholder/sample MP3 paths.

### R3. Dock & Desktop Icon Overhaul
- macOS-style squircle icons with rich SVG graphics, subtle gradients, border lighting, and depth for:
  - Terminal
  - Projects
  - About
  - Finder
  - Settings
  - Mail
- Interaction update: Single-click to open apps (replacing double-click requirement on desktop icons).
- Fisheye magnification hover effect on dock:
  - Hovered icon: 1.8x - 2.2x scale
  - Immediate neighbors: ~0.7x scale ratio (relative step)
  - Next neighbors: ~0.85x scale ratio
  - Smooth spring transitions
- Idle breathing animation for all dock icons when not hovered (subtle pulse/float).

### R4. Core System Updates
- Replace top menu bar Apple logo with a swappable SVG component.
- Central configuration system for:
  - Wallpapers (metadata, colors, paths)
  - Music tracks (title, artist, duration, cover, audio source)
  - Icons (name, icon component/svg, colors, default size)
- Portable magnetic cursor & kinetic typography utilities usable across both Lock Screen and Desktop.

### R5. Acceptance Criteria & Test Suite
- Ensure existing test suites pass or are cleanly updated for refactored components (e.g. single click vs double click, cassette widget vs audio deck).
- Add new unit/integration tests for:
  - Lock screen rendering, clock updates, and slide-up dismiss interaction.
  - Retro cassette player transport controls, reel spinning state, and wallpaper color matching.
  - Central config loading & fallback defaults.
  - Dock fisheye magnification calculations and icon rendering.
- Verify 100% pass on Vitest test suite and static build compilation (`npm run build`).

## Execution Phases & Delegation
1. **Phase 1: Exploration & Technical Architecture**
   - Dispatch 3 parallel Explorers:
     - Explorer 1: Codebase architecture, configs, lock screen & typography/cursor integration.
     - Explorer 2: Audio player architecture, cassette tape widget design, color extraction & transport controls.
     - Explorer 3: Dock & Desktop icons, click interaction changes, fisheye magnification physics & tests.
2. **Phase 2: Implementation**
   - Dispatch Worker to implement all changes in a unified, cohesive pass:
     - Configs (`src/config/*` or `src/lib/constants/*`).
     - Lock Screen (`src/components/os/LockScreen.tsx`).
     - Retro Cassette Player (`src/components/music/RetroCassettePlayer.tsx` / `CassetteReel.tsx`).
     - SVG Squircle Icons (`src/components/icons/*`).
     - Dock & Desktop icon interaction updates.
     - TopMenuBar SVG update.
     - Test updates & new test suites.
     - Build verification (`npm run build` and `npm run test`).
3. **Phase 3: Review & Verification**
   - Dispatch 2 independent Reviewers to verify correctness, visual smoothness, test results, and compliance.
4. **Phase 4: Adversarial Stress Testing & Forensic Audit**
   - Dispatch 2 Challengers for empirical stress testing and edge cases.
   - Dispatch 1 Forensic Auditor for integrity verification.
5. **Phase 5: Final Synthesized Report & Victory Audit Notification**
   - Synthesize results, update `PROJECT.md`, notify Sentinel / caller.
