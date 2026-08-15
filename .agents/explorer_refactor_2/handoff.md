# Handoff Report: Retro Cassette Player Widget Architecture & Specification

## 1. Observation
1. **Legacy Component Implementation**:
   - `src/components/music/AudioDeckExpandedCard.tsx` (lines 49-59) renders a stationary bottom-right card with `fixed bottom-20 right-6 w-[340px]`, embedding `VinylDiscAssembly.tsx`, `AudioVisualizerCanvas.tsx`, and `InteractiveScrubber.tsx`.
   - `src/components/dock/MusicPlayerDockPill.tsx` (lines 26-35) renders a 120px mini-pill embedded inside `src/components/dock/Dock.tsx` (lines 60-66).
2. **Audio Store & Engine Wiring**:
   - `src/hooks/useMusicStore.ts` (lines 40-77, 80-138) provides full transport methods: `play`, `pause`, `togglePlay`, `nextTrack`, `previousTrack`, `seekTo`, `setVolume`, `toggleMute`, `toggleShuffle`, `cycleRepeat`, which wire directly to `GlobalAudioManager.getInstance()` (`src/lib/audio/GlobalAudioManager.ts`, lines 44-79).
   - Currently, `useMusicStore.ts` (line 3) imports `mockPlaylist` from `../../tests/fixtures/playlist.fixture`.
3. **Wallpaper & Theme Configuration**:
   - `src/lib/constants/wallpapers.ts` (lines 16-87) defines 7 wallpapers (`sonoma-dark`, `sonoma-light`, `sequoia-dark`, `ventura`, `monterey`, `cyberpunk-neon`, `minimal-noir`) with `accentColor` and gradient properties.
   - `src/hooks/useOSStore.ts` (lines 41, 421-426) tracks `wallpaperId` and exposes `setWallpaper(id)`.
4. **Test Suite Baseline**:
   - Running `npm test` executes Vitest across 28 test files and 281 tests, all currently passing (100% green).
   - `tests/tier1-features/music.test.tsx` (lines 10-205) tests audio deck playback, expansion, scrubbing, volume, track advance, and vinyl rotation.

## 2. Logic Chain
1. **From Observation 1**: Replacing `AudioDeckExpandedCard` and `MusicPlayerDockPill` requires building `RetroCassettePlayer.tsx` and `CassetteReel.tsx` as a floating draggable widget positioned at Layer 5 (`z-[9992]`), removing the dock pill from `Dock.tsx`, and mounting the cassette widget on the desktop surface in `src/app/page.tsx`.
2. **From Observation 2**: Integrating `RetroCassettePlayer` directly with `useMusicStore` preserves the entire existing playback infrastructure without breaking state contracts. The tactile buttons trigger both state changes and `GlobalAudioManager.getInstance().playFx('click')`.
3. **From Observation 3**: Extracting a structured color palette mapping `WALLPAPERS[i].id` to cassette body, border, label paper, accent, and LED glow colors creates a dynamic visual pairing when the user switches wallpapers in SettingsApp.
4. **From Observation 2 & Rule user_global**: Migrating track definitions into `src/config/music.ts` satisfies the modular configuration requirement without hardcoded paths in components, while re-exporting from `playlist.fixture.ts` ensures backward compatibility for test fixtures.
5. **From Observation 4**: Refactoring `music.test.tsx` and adding a new test suite `tests/components/RetroCassettePlayer.test.tsx` will verify that drag constraints, reel spinning state (active only when `isPlaying`), tape thickness calculations, transport controls, and dynamic wallpaper color application function without regressions.

## 3. Caveats
1. **Mobile Experience**: On mobile screens (<768px), `MobileStickyAudioBar.tsx` remains mounted at the bottom of the viewport; `RetroCassettePlayer.tsx` can either hide on mobile breakpoints (`hidden md:block` or `!isMobile`) or adaptively scale down to avoid occluding mobile sheets.
2. **Audio Autoplay Browser Policies**: In real browser environments, `AudioContext` requires a user gesture before starting playback. `GlobalAudioManager.init()` and `togglePlay()` already handle this asynchronously.

## 4. Conclusion
The proposed Retro Cassette Player architecture provides a complete, robust replacement for the legacy audio deck. It features:
- Freely draggable Framer Motion container with bounds clamping and tactile grab/drop sound FX.
- Authentic SONY Walkman industrial design with plastic chassis, corner screws, paper sticker label, clear acrylic window, and magnetic tape ribbon.
- Dual spinning reels with 6-toothed star hubs, rotational animation tied to `isPlaying`, and dynamic tape thickness mathematically derived from area conservation ($R(p) = \sqrt{R_{\min}^2 + (R_{\max}^2 - R_{\min}^2) \times \text{weight}}$).
- Full transport controls and scrubber wired to `useMusicStore` and `GlobalAudioManager`.
- Dynamic color theme extraction responding to active wallpapers.
- Modular track configuration in `src/config/music.ts`.

## 5. Verification Method
1. **Unit & Integration Tests**:
   - Run: `npm test`
   - Run specifically: `npx vitest run tests/tier1-features/music.test.tsx tests/components/RetroCassettePlayer.test.tsx`
   - All 281 existing tests plus new cassette tests must pass.
2. **Build Verification**:
   - Run: `npm run build` or `npm run type-check` to verify TypeScript compile integrity.
3. **File Inspections**:
   - `src/config/music.ts`
   - `src/components/music/RetroCassettePlayer.tsx`
   - `src/components/music/CassetteReel.tsx`
   - `src/components/dock/Dock.tsx`
   - `src/app/page.tsx`
