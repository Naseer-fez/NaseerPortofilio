# Scope: Milestone 3 — Luca Parabolic Dock & Nidal Music Player

## Objective
Implement Luca Felix parabolic dock with Cosine Bell spring magnification and Nidal full audio engine:
1. `Dock` Chassis (fixed bottom center, z-9990, `blur(20px) saturate(190%)`, pill shape, specular hairline).
2. `DockItem` Magnification:
   - Shared `mouseX` MotionValue.
   - Cosine Bell equation: `W(d) = 44 + 24·(1 + cos(πd/150)) / 2` for |d| <= 150.
   - Spring physics: `mass: 0.1, stiffness: 420, damping: 26`.
3. `DockTooltip` (spring-animated label pill, `AnimatePresence`).
4. `ActiveDotIndicator` (3px glowing dot below active apps).
5. `GlobalAudioManager` (Singleton AudioContext + MediaElementSource + SoundSynthesizer procedural FX with 20% ducking over 40ms, restoring over 250ms).
6. `useMusicStore` (Zustand: playlist, playback status, duration, currentTime, volume, shuffle, repeat, deck expansion, localStorage persistence).
7. `MusicPlayerDockPill` (120px pill in dock, mini artwork, scrolling title, 3-bar equalizer, toggle deck).
8. `AudioDeckExpandedCard` (z-9992, glassmorphic card above dock, 200px spinning vinyl disc assembly, 64-bin FFT canvas visualizer, interactive scrubber, transport controls, volume slider).
9. `MediaSessionController` (Media Session API integration for OS-level lock screen and media key controls).
10. `SoundSynthesizer` updates to route all UI sound FX through `GlobalAudioManager`.

## Specifications to Follow
- `d:\CODE\Html\Showcase\portfolio_research\phase2\PHASE_2_MASTER_SPEC.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\luca-taskbar-analysis.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\nidal-player-analysis.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\design\motion-system.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\architecture\state-architecture.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\implementation\implementation-spec.md` (Sprint 3)
