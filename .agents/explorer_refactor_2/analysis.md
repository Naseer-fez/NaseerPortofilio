# Comprehensive Technical Analysis & Implementation Blueprint: Retro Cassette Player Widget

## 1. Executive Summary & Scope Definition

This report provides the architectural specification, visual design system, mechanical animation mathematics, audio engine integration, dynamic wallpaper theming, and test strategy for the **Retro Cassette Player Widget** (`RetroCassettePlayer.tsx` and `CassetteReel.tsx`).

### Core Objectives
1. **Retire & Replace Legacy Cards**: Replace the stationary `AudioDeckExpandedCard` and the dock-embedded `MusicPlayerDockPill` with a freely draggable, floating retro SONY Walkman-style cassette tape widget.
2. **Authentic Vintage SONY Industrial Design**: Model a high-fidelity compact audio cassette with a textured plastic chassis, perimeter hex/cross screws, vintage paper label sticker, clear acrylic dual-spool window, magnetic tape ribbon bridge, and mechanical bottom head notch.
3. **Dual Spinning Spool Mechanics**: Implement dual rotating tape reels (left feed spool, right take-up spool) with 6-toothed star hubs, rotational animation tied strictly to `isPlaying`, and dynamic tape cake thickness calculated using volume-conserving square-root equations.
4. **Full Transport Surface & Engine Wiring**: Wire tactile chrome push-buttons, precision scrubber, volume slider, mute toggle, shuffle, and repeat modes directly to `useMusicStore` and the Web Audio API `GlobalAudioManager` singleton.
5. **Dynamic Wallpaper Color Matching**: Dynamically extract and apply theme palettes (chassis color, accent stripes, sticker paper tint, LED glow) based on the active desktop wallpaper in `useOSStore`.
6. **Centralized Modular Configuration**: Create `src/config/music.ts` to hold track playlists and metadata, eliminating hardcoded values per user rule `RULE[user_global]`.
7. **100% Test Integrity**: Establish a comprehensive unit and integration test suite ensuring the existing 281 tests pass without regression and new cassette capabilities are rigorously verified.

---

## 2. Legacy Audio Subsystem Audit & Transition Plan

### Current Audio Files & Roles
| File Path | Current Role | Refactor Action |
|---|---|---|
| `src/components/music/AudioDeckExpandedCard.tsx` | 340px fixed bottom-right glass card with spinning vinyl disc | **Replace** with `RetroCassettePlayer.tsx` floating widget |
| `src/components/music/VinylDiscAssembly.tsx` | 200px rotating vinyl record component | **Replace** with `CassetteReel.tsx` dual-spool assembly |
| `src/components/music/InteractiveScrubber.tsx` | Timeline scrubber bar with pointer drag events | **Reuse / Enhance** inside `RetroCassettePlayer.tsx` |
| `src/components/dock/MusicPlayerDockPill.tsx` | 120px mini-pill embedded inside Luca Dock | **Remove / Decouple** from Dock chassis (freely floating widget on desktop) |
| `src/lib/audio/GlobalAudioManager.ts` | Web Audio API singleton with gain nodes, FX synthesizer, and ducking | **Preserve & Wire** to cassette transport controls and tactile sound FX |
| `src/hooks/useMusicStore.ts` | Zustand store managing playback state, volume, track queue, and expansion | **Update track source** to import from `src/config/music.ts` |
| `tests/fixtures/playlist.fixture.ts` | Static mock playlist for test assertions | **Re-export** from `src/config/music.ts` for backward compatibility |

---

## 3. Retro Cassette Player Component Architecture (`RetroCassettePlayer.tsx`)

### 3.1 Draggable Geometry & Physics
The cassette player floats at Layer 5 (`z-[9992]`), above desktop windows and dock, enabling unhindered movement across the workspace.

- **Framer Motion Drag Implementation**:
  ```tsx
  <motion.div
    drag
    dragMomentum={false}
    dragElastic={0.08}
    dragConstraints={{
      top: 32,
      left: 16,
      right: typeof window !== 'undefined' ? window.innerWidth - 380 : 1000,
      bottom: typeof window !== 'undefined' ? window.innerHeight - 280 : 600,
    }}
    whileDrag={{ scale: 1.02, cursor: 'grabbing', filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.65))' }}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="fixed select-none cursor-grab active:cursor-grabbing ..."
  >
  ```
- **Initial Spawn Placement**: Default position `bottom-24 right-8` or `{ x: window.innerWidth - 400, y: window.innerHeight - 340 }`.
- **Haptic Audio Feedback**:
  - `onDragStart`: Calls `GlobalAudioManager.getInstance().playFx('window-grab')`.
  - `onDragEnd`: Calls `GlobalAudioManager.getInstance().playFx('window-drop')`.

### 3.2 Detailed Visual Design (SONY Walkman Aesthetic)
Standard Compact Cassette dimensions (aspect ratio ~1.6:1, dimensions `360px` × `226px`):

```
+-------------------------------------------------------------------+
| (*) [SONY] STEREO CASSETTE DECK / HF 90               [---] [X] (*)|
| +---------------------------------------------------------------+ |
| | [SIDE A]  Midnight in Cupertino — Synthesizer Society   [EQ]  | |
| +---------------------------------------------------------------+ |
| | +-----------------------------------------------------------+ | |
| | |  ( Left Spool )       | 00 - 50 - 100 |     ( Right Spool )| | |
| | |  [=====( * )=====]    |---------------|     [====( * )====]| | |
| | |         \___________ Tape Ribbon Bridge __________/       | | |
| | +-----------------------------------------------------------+ | |
| +---------------------------------------------------------------+ |
|        / \_______[ Tape Head / Pressure Pad Area ]_______/ \      |
|                                                                   |
| [⏮]  [ ◀ / ⏸ ]  [⏭]  | [01:24] ━━━━━●━━━━━━ [03:04] | [🔀] [🔁] [🔊] |
+-------------------------------------------------------------------+
```

#### Layered Visual Elements:
1. **Outer Cassette Shell (Chassis)**:
   - Rounded rectangular body (`rounded-[18px]`) with beveled 3D inset borders (`box-shadow: inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.7), 0 20px 40px -10px rgba(0,0,0,0.8)`).
   - 4 Corner Screws: 4 small metallic rivets (`w-2.5 h-2.5 rounded-full bg-stone-500/40 border border-stone-400/30 flex items-center justify-center text-[7px] text-stone-300 font-mono select-none`).
   - Side Grip Ribs: Textured vertical notches on the left and right outer borders.
2. **Vintage Paper Label (Sticker)**:
   - Textured paper substrate with wallpaper-matched tint (`#f8fafc`, `#fef3c7`, `#fdfbf7`, etc.) and printed double pin-stripes.
   - Left: Red/Blue accent block with bold `"SIDE A"` or `"SIDE B"`.
   - Center: Track title (`font-bold text-sm tracking-tight truncate`) and Artist (`font-mono text-xs opacity-75 truncate`).
   - Right: Vintage technical typography: `"TYPE I [NORMAL BIAS] / 120µs EQ"`.
3. **Clear Acrylic Tape Window & Well**:
   - Recessed viewing window (`w-[280px] h-[82px] rounded-lg bg-black/70 border border-white/10 mx-auto relative overflow-hidden backdrop-blur-sm`).
   - Center Tape Counter / Ruler: Printed hash marks (`| 00 | 50 | 100 |`) with center reference line.
   - Acrylic Reflection Glare: Diagonal highlight layer (`linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.06) 100%)`).
4. **Bottom Mechanical Wedge & Read Head Area**:
   - Classic trapezoidal notch cut into the bottom shell.
   - Simulated brass tape guide rollers and magnetic read head block.
5. **Integrated Transport Controls Bar**:
   - Tactile vintage chrome buttons with recessed housing.
   - Multi-segment LED playback indicator (green/cyan/amber glow when playing).
   - Mini high-contrast scrubber timeline with digital time display.

---

## 4. Spinning Tape Reels Physics & Animation Subsystem (`CassetteReel.tsx`)

### 4.1 Dual Spool Anatomy & Geometry
Each cassette spool consists of three concentric radial layers:
1. **Magnetic Tape Cake (Dark Brown/Black Ribbon)**:
   - Color: `#1f1510` with subtle concentric groove rings.
   - Dynamic Radius ($R$): Changes continuously with track playback position.
2. **White 6-Tooth Star Hub (Drive Spline)**:
   - Outer diameter: `26px` (radius `13px`).
   - Color: Ivory/White `#f8f6f0` with 6 radial drive teeth projecting inward.
   - Spoke cutout holes for visual rotational feedback.
3. **Center Spindle Hole**:
   - Diameter: `10px` (radius `5px`), black hollow capstan hole (`#09090b`).

```
          [ Tape Ribbon Cake (Dynamic Radius R) ]
                    /                  \
            +----------------------------------+
            |      [ White 6-Tooth Hub ]       |
            |            /        \            |
            |       +------------------+       |
            |       | (•) Center Hole  |       |
            |       +------------------+       |
            |                                  |
            +----------------------------------+
```

### 4.2 Dynamic Tape Thickness Mathematics
In a compact cassette, the linear tape speed is constant ($4.76\text{ cm/s}$), meaning total tape cross-sectional volume is conserved:
$$\text{Area}_{\text{left}} + \text{Area}_{\text{right}} = \text{Constant}$$

Given minimum hub radius $R_{\min} = 13\text{px}$ and maximum full spool radius $R_{\max} = 29\text{px}$:
- **Progress Ratio**: $p = \frac{\text{currentTime}}{\text{duration}} \in [0, 1]$
- **Left Feed Spool Tape Radius**:
  $$R_{\text{left}}(p) = \sqrt{R_{\min}^2 + (R_{\max}^2 - R_{\min}^2) \times (1 - p)}$$
- **Right Take-Up Spool Tape Radius**:
  $$R_{\text{right}}(p) = \sqrt{R_{\min}^2 + (R_{\max}^2 - R_{\min}^2) \times p}$$

When $p = 0$: $R_{\text{left}} = 29\text{px}$ (full), $R_{\text{right}} = 13\text{px}$ (empty hub).
When $p = 1$: $R_{\text{left}} = 13\text{px}$ (empty hub), $R_{\text{right}} = 29\text{px}$ (full).

### 4.3 Reel Rotation Engine
- **Rotation Direction**: Counter-clockwise (standard Side A cassette rotation).
- **CSS Keyframe Specification**:
  ```css
  @keyframes spin-spool-ccw {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
  ```
- **Play State Freezing**:
  ```tsx
  style={{
    animation: 'spin-spool-ccw 2.4s linear infinite',
    animationPlayState: isPlaying ? 'running' : 'paused',
  }}
  ```
  Using `animationPlayState: 'running' | 'paused'` ensures the hub freezes instantaneously at its exact angular position upon pausing, without snapping to zero.

---

## 5. Audio Controls & GlobalAudioManager Wiring

### 5.1 Transport Controls Specification
| Control | Icon | Action / Trigger | Visual State |
|---|---|---|---|
| **Play / Pause** | `Play` / `Pause` | `togglePlay()` | Active LED glow (amber/cyan), button depressed highlight |
| **Previous Track** | `SkipBack` | `previousTrack()` | Click feedback, resets to 0s if `currentTime >= 3s`, loads previous track if `< 3s` |
| **Next Track** | `SkipForward` | `nextTrack()` | Advances `currentIndex`, resets `currentTime` to 0 |
| **Scrubber Track** | Range / Pointer Bar | `seekTo(seconds)` | Smooth progress fill (`width: progress%`), dragging thumb |
| **Volume Slider** | `input[type=range]` | `setVolume(level)` | 0.0 to 1.0 range, persists to `localStorage['music-volume']` |
| **Mute Toggle** | `Volume2` / `VolumeX` | `toggleMute()` | Sliders zeroed visually, state toggled in `useMusicStore` |
| **Shuffle Toggle** | `Shuffle` | `toggleShuffle()` | Highlighted color badge when `isShuffled: true` |
| **Repeat Cycle** | `Repeat` / `Repeat1` | `cycleRepeat()` | Cycles `'off'` $\to$ `'all'` $\to$ `'one'` $\to$ `'off'` |

### 5.2 Tactile UI Sound Integration
Each button click on the cassette player triggers tactile mechanical sound synthesis through `GlobalAudioManager.getInstance().playFx('click')`.

---

## 6. Dynamic Wallpaper Color Matching & Modular Configuration

### 6.1 Wallpaper Color Extraction Matrix
Theme colors are dynamically queried from `useOSStore.getState().wallpaperId`:

| Wallpaper ID | Wallpaper Name | Chassis Body (`bodyBg`) | Accent Color (`accent`) | Sticker Label (`labelBg` / `labelText`) | Spool / Hub | LED Glow (`ledGlow`) |
|---|---|---|---|---|---|---|
| `sonoma-dark` | macOS Sonoma Dark | `#111420` (Midnight Slate) | `#3b82f6` (Sonoma Blue) | `#f1f5f9` / `#0f172a` (Studio Off-white) | `#f8fafc` | `#38bdf8` (Cyan Blue) |
| `sonoma-light` | macOS Sonoma Light | `#2b2638` (Warm Plum) | `#8b5cf6` (Pastel Violet) | `#fdfbf7` / `#18181b` (Warm Cream) | `#ffffff` | `#ec4899` (Magenta Rose) |
| `sequoia-dark` | macOS Sequoia | `#1c1815` (Redwood Umber) | `#f97316` (Sequoia Amber) | `#fef3c7` / `#451a03` (Aged Paper) | `#fffbeb` | `#fbbf24` (Amber Gold) |
| `ventura` | macOS Ventura | `#161a29` (Deep Twilight) | `#ea580c` (Tangerine Orange) | `#f8fafc` / `#0f172a` (Crisp White) | `#f8fafc` | `#f97316` (Sunset Orange) |
| `monterey` | macOS Monterey | `#1f132b` (Deep Berry) | `#ec4899` (Monterey Hot Pink) | `#faf5ff` / `#3b0764` (Lavender Tint) | `#fdf4ff` | `#f472b6` (Pink Violet) |
| `cyberpunk-neon`| Cyberpunk Horizon | `#0b0f19` (Obsidian Tech) | `#06b6d4` (Neon Cyan) | `#0f172a` / `#38bdf8` (Dark Synth Grid) | `#e2e8f0` | `#10b981` (Emerald Green)|
| `minimal-noir` | Minimalist Noir | `#121214` (Brushed Titanium)| `#a1a1aa` (Monochrome Silver) | `#f4f4f5` / `#18181b` (Pure White) | `#fafafa` | `#ffffff` (Pure White) |

### 6.2 Modular Music Configuration (`src/config/music.ts`)
```ts
export interface MusicTrackConfig {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  src: string;      // MP3 audio asset path
  coverArt: string; // Album artwork image path
  cassetteSide?: 'A' | 'B';
  trackNumber?: number;
}

export const MUSIC_PLAYLIST: MusicTrackConfig[] = [
  {
    id: 'track-1',
    title: 'Midnight in Cupertino',
    artist: 'Synthesizer Society',
    album: 'Silicon Dreams',
    duration: 184,
    src: '/audio/midnight-cupertino.mp3',
    coverArt: '/images/covers/silicon-dreams.jpg',
    cassetteSide: 'A',
    trackNumber: 1,
  },
  {
    id: 'track-2',
    title: 'Aqua Motion',
    artist: 'Liquid Glass',
    album: 'Aqua Motion',
    duration: 210,
    src: '/audio/aqua-motion.mp3',
    coverArt: '/images/covers/aqua-motion.jpg',
    cassetteSide: 'A',
    trackNumber: 2,
  },
  {
    id: 'track-3',
    title: 'Kinetic Reverie',
    artist: 'Euler & The Waves',
    album: 'Physics of Sound',
    duration: 165,
    src: '/audio/kinetic-reverie.mp3',
    coverArt: '/images/covers/physics-sound.jpg',
    cassetteSide: 'A',
    trackNumber: 3,
  },
  {
    id: 'track-4',
    title: 'Parabolic Horizon',
    artist: 'Luca Cosine',
    album: 'Smooth Curves',
    duration: 198,
    src: '/audio/parabolic-horizon.mp3',
    coverArt: '/images/covers/smooth-curves.jpg',
    cassetteSide: 'B',
    trackNumber: 4,
  },
  {
    id: 'track-5',
    title: 'Tape Deck Memories',
    artist: '80s Walkman Boy',
    album: 'Cassette Nostalgia',
    duration: 225,
    src: '/audio/tape-deck-memories.mp3',
    coverArt: '/images/covers/cassette-nostalgia.jpg',
    cassetteSide: 'B',
    trackNumber: 5,
  },
];
```

---

## 7. Component Implementation Blueprint

### 7.1 Cassette Reel Subcomponent (`src/components/music/CassetteReel.tsx`)
```tsx
import React from 'react';

interface CassetteReelProps {
  isPlaying: boolean;
  progress: number; // 0 to 1
  isLeft: boolean;
  spoolColor: string;
  tapeColor: string;
}

export function CassetteReel({
  isPlaying,
  progress,
  isLeft,
  spoolColor = '#f8fafc',
  tapeColor = '#221812',
}: CassetteReelProps) {
  // Constant area conservation formula
  const rMin = 13;
  const rMax = 29;
  const tapeWeight = isLeft ? 1 - progress : progress;
  const currentRadius = Math.sqrt(rMin * rMin + (rMax * rMax - rMin * rMin) * Math.max(0, Math.min(1, tapeWeight)));

  return (
    <div
      data-testid={isLeft ? 'cassette-reel-left' : 'cassette-reel-right'}
      className="relative flex items-center justify-center"
      style={{ width: '64px', height: '64px' }}
    >
      {/* Tape Cake Wound on Spool */}
      <div
        data-testid={isLeft ? 'cassette-tape-left' : 'cassette-tape-right'}
        className="rounded-full absolute transition-all duration-300 pointer-events-none"
        style={{
          width: `${currentRadius * 2}px`,
          height: `${currentRadius * 2}px`,
          backgroundColor: tapeColor,
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.5)',
        }}
      />

      {/* 6-Toothed Star Drive Spool Hub */}
      <div
        data-testid={isLeft ? 'cassette-spool-left' : 'cassette-spool-right'}
        className="w-[28px] h-[28px] rounded-full relative z-10 flex items-center justify-center shadow-inner pointer-events-none"
        style={{
          backgroundColor: spoolColor,
          animation: 'spin-spool-ccw 2.4s linear infinite',
          animationPlayState: isPlaying ? 'running' : 'paused',
          boxShadow: '0 0 2px rgba(0,0,0,0.4), inset 0 0 2px rgba(0,0,0,0.3)',
        }}
      >
        {/* 6 Radial Teeth / Splines */}
        {[0, 60, 120, 180, 240, 300].map(deg => (
          <div
            key={deg}
            className="absolute w-[3px] h-[6px] bg-stone-700/60 rounded-sm"
            style={{
              transform: `rotate(${deg}deg) translateY(-8px)`,
            }}
          />
        ))}

        {/* 3 Cutout Spoke Windows */}
        {[0, 120, 240].map(deg => (
          <div
            key={`spoke-${deg}`}
            className="absolute w-[4px] h-[4px] rounded-full bg-stone-900/40"
            style={{
              transform: `rotate(${deg}deg) translateY(-5px)`,
            }}
          />
        ))}

        {/* Center Capstan Hole */}
        <div className="w-[10px] h-[10px] rounded-full bg-stone-950 border border-stone-800 absolute inset-0 m-auto" />
      </div>
    </div>
  );
}
```

### 7.2 Main Cassette Player Widget (`src/components/music/RetroCassettePlayer.tsx`)
```tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMusicStore } from '@/hooks/useMusicStore';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { CassetteReel } from './CassetteReel';
import { InteractiveScrubber } from './InteractiveScrubber';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  GripHorizontal,
  Minus,
} from 'lucide-react';
import { getCassetteTheme } from '@/lib/constants/wallpapers';

export function RetroCassettePlayer() {
  const isDeckExpanded = useMusicStore(state => state.isDeckExpanded);
  const toggleDeckExpanded = useMusicStore(state => state.toggleDeckExpanded);
  const playlist = useMusicStore(state => state.playlist);
  const currentIndex = useMusicStore(state => state.currentIndex);
  const status = useMusicStore(state => state.status);
  const togglePlay = useMusicStore(state => state.togglePlay);
  const nextTrack = useMusicStore(state => state.nextTrack);
  const previousTrack = useMusicStore(state => state.previousTrack);
  const volume = useMusicStore(state => state.volume);
  const setVolume = useMusicStore(state => state.setVolume);
  const isMuted = useMusicStore(state => state.isMuted);
  const toggleMute = useMusicStore(state => state.toggleMute);
  const isShuffled = useMusicStore(state => state.isShuffled);
  const toggleShuffle = useMusicStore(state => state.toggleShuffle);
  const repeatMode = useMusicStore(state => state.repeatMode);
  const cycleRepeat = useMusicStore(state => state.cycleRepeat);
  const currentTime = useMusicStore(state => state.currentTime);
  const duration = useMusicStore(state => state.duration);

  const wallpaperId = useOSStore(state => state.wallpaperId);
  const theme = getCassetteTheme(wallpaperId);

  const track = playlist[currentIndex] || {
    title: 'Unknown Track',
    artist: 'Unknown Artist',
    album: '',
    coverArt: '',
  };

  const isPlaying = status === 'playing';
  const progress = duration > 0 ? currentTime / duration : 0;

  const handleButtonClick = (action: () => void) => {
    GlobalAudioManager.getInstance().playFx('click');
    action();
  };

  return (
    <motion.div
      data-testid="retro-cassette-player"
      drag
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={{
        top: 28,
        left: 0,
        right: typeof window !== 'undefined' ? window.innerWidth - 380 : 1000,
        bottom: typeof window !== 'undefined' ? window.innerHeight - 280 : 600,
      }}
      whileDrag={{
        scale: 1.02,
        cursor: 'grabbing',
        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.85)',
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      onDragStart={() => GlobalAudioManager.getInstance().playFx('window-grab')}
      onDragEnd={() => GlobalAudioManager.getInstance().playFx('window-drop')}
      className="fixed bottom-24 right-8 z-[9992] select-none cursor-grab active:cursor-grabbing"
      style={{
        width: '360px',
      }}
    >
      {/* 3D Cassette Shell */}
      <div
        data-testid="cassette-body"
        className="rounded-[20px] p-3.5 border-2 text-white shadow-2xl relative overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: theme.bodyBg,
          borderColor: theme.bodyBorder,
          boxShadow:
            '0 24px 48px -12px rgba(0,0,0,0.75), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.7)',
        }}
      >
        {/* 4 Corner Screws */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-stone-500/50 border border-stone-400/40 flex items-center justify-center text-[6px] text-stone-300 font-mono">+</div>
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-stone-500/50 border border-stone-400/40 flex items-center justify-center text-[6px] text-stone-300 font-mono">+</div>
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-stone-500/50 border border-stone-400/40 flex items-center justify-center text-[6px] text-stone-300 font-mono">+</div>
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-stone-500/50 border border-stone-400/40 flex items-center justify-center text-[6px] text-stone-300 font-mono">+</div>

        {/* Top Header & Branding Bar */}
        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[11px] tracking-wider text-white uppercase font-mono">
              SONY
            </span>
            <span className="text-[9px] font-mono tracking-tighter text-white/60">
              STEREO CASSETTE DECK
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Playback LED Indicator */}
            <div className="flex items-center space-x-1">
              <span
                data-testid="cassette-led"
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  backgroundColor: theme.ledGlow,
                  boxShadow: isPlaying ? `0 0 8px ${theme.ledGlow}` : 'none',
                }}
              />
              <span className="text-[8px] font-mono uppercase text-white/50">
                {isPlaying ? 'PLAY' : 'STOP'}
              </span>
            </div>

            {/* Drag Handle Indicator */}
            <GripHorizontal size={14} className="text-white/40" />
          </div>
        </div>

        {/* Vintage Paper Label Sticker */}
        <div
          data-testid="cassette-label"
          className="my-2 p-2 rounded-md border shadow-inner relative overflow-hidden transition-colors duration-500"
          style={{
            backgroundColor: theme.labelBg,
            borderColor: theme.labelBorder,
            color: theme.labelText,
          }}
        >
          {/* Accent Color Line Top Banner */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: theme.accent }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span
                className="text-[9px] font-black px-1 py-0.5 rounded text-white tracking-wider"
                style={{ backgroundColor: theme.accent }}
              >
                SIDE A
              </span>
              <div className="min-w-0 flex-1">
                <h4
                  data-testid="music-track-title"
                  className="text-xs font-bold truncate leading-tight tracking-tight"
                  style={{ color: theme.labelText }}
                >
                  {track.title}
                </h4>
                <p
                  data-testid="music-track-artist"
                  className="text-[10px] opacity-70 truncate font-mono"
                  style={{ color: theme.labelText }}
                >
                  {track.artist}
                </p>
              </div>
            </div>

            <div className="text-[8px] font-mono opacity-60 text-right">
              <div>TYPE I</div>
              <div>120µs EQ</div>
            </div>
          </div>
        </div>

        {/* Clear Acrylic Tape Window & Well */}
        <div
          data-testid="cassette-window"
          className="relative w-full h-[76px] rounded-lg bg-black/75 border border-white/15 overflow-hidden flex items-center justify-between px-6 my-2 shadow-inner"
        >
          {/* Acrylic Reflection Gradient */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.05) 100%)',
            }}
          />

          {/* Left Feed Spool */}
          <CassetteReel
            isPlaying={isPlaying}
            progress={progress}
            isLeft={true}
            spoolColor={theme.spoolColor}
            tapeColor={theme.tapeColor}
          />

          {/* Center Tape Counter & Scale Ticks */}
          <div className="flex flex-col items-center justify-center text-white/40 font-mono text-[8px] z-10 select-none">
            <div className="flex space-x-2 mb-1 tracking-widest">
              <span>00</span>
              <span>50</span>
              <span>100</span>
            </div>
            <div className="w-16 h-[1px] bg-white/20" />
            <div className="text-[7px] text-white/30 mt-1">INDEX TAPE</div>
          </div>

          {/* Right Take-up Spool */}
          <CassetteReel
            isPlaying={isPlaying}
            progress={progress}
            isLeft={false}
            spoolColor={theme.spoolColor}
            tapeColor={theme.tapeColor}
          />

          {/* Magnetic Tape Ribbon Bridge Across Bottom */}
          <div
            data-testid="cassette-tape-ribbon"
            className="absolute bottom-1 left-12 right-12 h-[3px] rounded-sm pointer-events-none"
            style={{ backgroundColor: theme.tapeColor }}
          />
        </div>

        {/* Scrubber Timeline */}
        <div className="my-2">
          <InteractiveScrubber />
        </div>

        {/* Mechanical Transport Control Buttons */}
        <div className="flex items-center justify-between px-1 pt-1 border-t border-white/10">
          {/* Shuffle */}
          <button
            data-testid="music-shuffle-btn"
            aria-label="Toggle Shuffle"
            onClick={() => handleButtonClick(toggleShuffle)}
            className={`p-1.5 rounded-md transition-colors ${
              isShuffled ? 'text-white bg-white/20' : 'text-white/50 hover:text-white'
            }`}
          >
            <Shuffle size={14} />
          </button>

          {/* Prev */}
          <button
            data-testid="music-prev-btn"
            aria-label="Previous Track"
            onClick={() => handleButtonClick(previousTrack)}
            className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <SkipBack size={16} />
          </button>

          {/* Play / Pause */}
          <button
            data-testid="music-play-btn"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={() => handleButtonClick(togglePlay)}
            className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{
              boxShadow: isPlaying
                ? `0 0 14px ${theme.accent}`
                : '0 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>

          {/* Next */}
          <button
            data-testid="music-next-btn"
            aria-label="Next Track"
            onClick={() => handleButtonClick(nextTrack)}
            className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <SkipForward size={16} />
          </button>

          {/* Repeat */}
          <button
            data-testid="music-repeat-btn"
            aria-label="Cycle Repeat Mode"
            onClick={() => handleButtonClick(cycleRepeat)}
            className={`p-1.5 rounded-md transition-colors ${
              repeatMode !== 'off' ? 'text-white bg-white/20' : 'text-white/50 hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
          </button>

          {/* Volume Control */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-white/10">
            <button
              data-testid="music-mute-btn"
              aria-label="Toggle Mute"
              onClick={() => handleButtonClick(toggleMute)}
              className="text-white/60 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <input
              data-testid="music-volume-slider"
              aria-label="Volume Control"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 accent-white cursor-pointer bg-white/20 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

---

## 8. Test Strategy & Verification Matrix

### 8.1 Protection of Existing 281 Tests
- In `tests/tier1-features/music.test.tsx`:
  - Update tests referencing `AudioDeckExpandedCard` and `MusicPlayerDockPill` to test `RetroCassettePlayer` controls directly.
  - All 11 music tests will continue to pass.
- In `tests/tier3-cross-feature/cross-feature.test.tsx` and `tests/tier4-scenarios/user-workflows.test.tsx`:
  - Ensure `RetroCassettePlayer` responds seamlessly to theme swaps and user workflows.

### 8.2 New Test Suite (`tests/components/RetroCassettePlayer.test.tsx`)
```tsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { RetroCassettePlayer } from '@/components/music/RetroCassettePlayer';
import { useMusicStore } from '@/hooks/useMusicStore';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';

describe('RetroCassettePlayer Component', () => {
  beforeEach(() => {
    useMusicStore.setState({
      status: 'idle',
      currentIndex: 0,
      currentTime: 0,
      duration: 184,
      volume: 0.8,
      isMuted: false,
      isShuffled: false,
      repeatMode: 'off',
      isDeckExpanded: true,
    });
    useOSStore.setState({
      wallpaperId: 'sonoma-dark',
    });
  });

  it('renders retro SONY Walkman cassette player structure', () => {
    const { getByTestId, getByText } = render(<RetroCassettePlayer />);

    expect(getByTestId('retro-cassette-player')).toBeInTheDocument();
    expect(getByTestId('cassette-body')).toBeInTheDocument();
    expect(getByTestId('cassette-label')).toBeInTheDocument();
    expect(getByTestId('cassette-window')).toBeInTheDocument();
    expect(getByTestId('cassette-reel-left')).toBeInTheDocument();
    expect(getByTestId('cassette-reel-right')).toBeInTheDocument();
    expect(getByText('SONY')).toBeInTheDocument();
    expect(getByText('SIDE A')).toBeInTheDocument();
  });

  it('displays track title and artist on vintage sticker label', () => {
    const { getByTestId } = render(<RetroCassettePlayer />);

    expect(getByTestId('music-track-title')).toHaveTextContent('Midnight in Cupertino');
    expect(getByTestId('music-track-artist')).toHaveTextContent('Synthesizer Society');
  });

  it('animates tape reels ONLY when isPlaying is true', () => {
    useMusicStore.setState({ status: 'playing' });
    const { getByTestId, rerender } = render(<RetroCassettePlayer />);

    const leftSpool = getByTestId('cassette-spool-left');
    expect(leftSpool).toHaveStyle({ animationPlayState: 'running' });

    useMusicStore.setState({ status: 'paused' });
    rerender(<RetroCassettePlayer />);
    expect(leftSpool).toHaveStyle({ animationPlayState: 'paused' });
  });

  it('calculates dynamic tape thickness between feed and take-up spools', () => {
    // At start (currentTime = 0): Left spool thick, Right spool thin
    useMusicStore.setState({ currentTime: 0, duration: 184 });
    const { getByTestId, rerender } = render(<RetroCassettePlayer />);

    const leftTapeStart = getByTestId('cassette-tape-left');
    const rightTapeStart = getByTestId('cassette-tape-right');
    const leftStartWidth = parseFloat(leftTapeStart.style.width);
    const rightStartWidth = parseFloat(rightTapeStart.style.width);

    expect(leftStartWidth).toBeGreaterThan(rightStartWidth);

    // At end (currentTime = 184): Right spool thick, Left spool thin
    useMusicStore.setState({ currentTime: 184, duration: 184 });
    rerender(<RetroCassettePlayer />);

    const leftTapeEnd = getByTestId('cassette-tape-left');
    const rightTapeEnd = getByTestId('cassette-tape-right');
    const leftEndWidth = parseFloat(leftTapeEnd.style.width);
    const rightEndWidth = parseFloat(rightTapeEnd.style.width);

    expect(rightEndWidth).toBeGreaterThan(leftEndWidth);
  });

  it('toggles playback and triggers sound FX on play button click', async () => {
    const playFxSpy = vi.spyOn(GlobalAudioManager.getInstance(), 'playFx');
    const { getByTestId } = render(<RetroCassettePlayer />);

    await act(async () => {
      fireEvent.click(getByTestId('music-play-btn'));
    });

    expect(useMusicStore.getState().status).toBe('playing');
    expect(playFxSpy).toHaveBeenCalledWith('click');
  });

  it('dynamically matches color palette when active wallpaper changes', () => {
    const { getByTestId, rerender } = render(<RetroCassettePlayer />);

    // Default sonoma-dark
    expect(getByTestId('cassette-body')).toHaveStyle({ backgroundColor: 'rgb(17, 20, 32)' });

    // Switch to sequoia-dark
    useOSStore.setState({ wallpaperId: 'sequoia-dark' });
    rerender(<RetroCassettePlayer />);
    expect(getByTestId('cassette-body')).toHaveStyle({ backgroundColor: 'rgb(28, 24, 21)' });
  });
});
```

---

## 9. Conclusion

The Retro Cassette Player architecture provides a rich, tactile, and faithful reproduction of vintage SONY Walkman industrial design, perfectly blended with modern Framer Motion direct-manipulation drag physics, Web Audio API integration, and dynamic wallpaper color harmony.
