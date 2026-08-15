## 2026-08-15T12:11:08Z
You are Explorer 2 on the macOS Portfolio OS UX & Visual Refactor project.
Working directory: d:/CODE/Html/Showcase/.agents/explorer_refactor_2/
Project root: d:/CODE/Html/Showcase

Read:
- d:/CODE/Html/Showcase/.agents/ORIGINAL_REQUEST.md
- d:/CODE/Html/Showcase/.agents/orchestrator_refactor/plan.md
- d:/CODE/Html/Showcase/.agents/orchestrator_refactor/context.md
- d:/CODE/Html/Showcase/src/components/music/AudioDeckExpandedCard.tsx
- d:/CODE/Html/Showcase/src/components/music/VinylDiscAssembly.tsx
- d:/CODE/Html/Showcase/src/components/music/InteractiveScrubber.tsx
- d:/CODE/Html/Showcase/src/components/dock/MusicPlayerDockPill.tsx
- d:/CODE/Html/Showcase/src/lib/audio/GlobalAudioManager.ts
- d:/CODE/Html/Showcase/src/hooks/useMusicStore.ts
- d:/CODE/Html/Showcase/src/lib/constants/wallpapers.ts

Investigate and produce a detailed analysis and implementation blueprint in `d:/CODE/Html/Showcase/.agents/explorer_refactor_2/analysis.md` and `d:/CODE/Html/Showcase/.agents/explorer_refactor_2/handoff.md` covering:
1. Retro Cassette Player Widget Architecture:
   - Replacement of `AudioDeckExpandedCard` and `MusicPlayerDockPill` with a freely draggable floating retro SONY-style cassette tape widget (`RetroCassettePlayer.tsx`).
   - Drag constraints, bounds clamping within viewport, smooth drag physics using Framer Motion (`drag`, `dragMomentum={false}`, `dragConstraints`).
   - Detailed visual design: SONY Walkman / cassette styling with plastic cassette body, vintage label sticker with track name and artist, dual transparent tape windows, magnetic tape ribbon, dual tape reels with spoke holes.
2. Spinning Tape Reels Animation:
   - Dual reels (left feed spool, right take-up spool).
   - Smooth rotation animation (e.g. CSS keyframe rotation or Framer Motion `animate={{ rotate: isPlaying ? 360 : 0 }}`) active ONLY when `isPlaying` is true.
   - Dynamic tape thickness effect (left spool starts full and shrinks as track advances, right spool starts empty and grows) or realistic reel spinning.
3. Audio Controls & GlobalAudioManager Wiring:
   - Full transport controls: Play/Pause toggle, Previous Track, Next Track, Progress Scrubber / timeline, Volume slider, Mute toggle.
   - Seamless integration with `useMusicStore` and `GlobalAudioManager` singleton.
4. Dynamic Wallpaper Color Matching:
   - How the cassette body color, accent lines, and label dynamically match/extract dominant colors from the currently active desktop wallpaper in `useOSStore`.
   - Modular track configuration in `src/config/music.ts` with placeholder MP3 paths, titles, artists, durations, and album art.
5. Test Strategy:
   - Unit tests for cassette player render, drag capability, transport controls, reel rotation state tied to `isPlaying`, and dynamic wallpaper theme application.

Write your report to `d:/CODE/Html/Showcase/.agents/explorer_refactor_2/handoff.md` and send a completion message back to orchestrator.
