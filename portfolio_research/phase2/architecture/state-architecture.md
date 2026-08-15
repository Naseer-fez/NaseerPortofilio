# State Architecture — Stateful Systems Specification
## Phase 2 Architecture Document

---

## 1. Window Manager State (useOSStore)

```typescript
interface OSStore {
  // Window Manager
  windows: Record<string, AppWindow>;
  activeWindowId: string | null;
  baseZIndex: number;             // 20
  
  // Desktop Mode
  desktopMode: 'workspace' | 'ambient-hero';
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Sound
  soundEnabled: boolean;
  soundVolume: number;            // 0.0 – 1.0
  
  // Wallpaper
  wallpaperId: string;
  
  // Context Menu
  contextMenu: { x: number; y: number; items: ContextMenuItem[] } | null;
  
  // Spotlight
  spotlightOpen: boolean;
}
```

| State | Type | Owner | Consumers | Mutation Source | Persistence | Reset |
|-------|------|-------|-----------|---------------|-------------|-------|
| windows | `Record<string, AppWindow>` | useOSStore | WindowFrame, Dock, TopMenuBar, MobileTabBar | openWindow, closeWindow, minimizeWindow, toggleMaximize, focusWindow, updatePosition, updateSize | No | Page reload |
| activeWindowId | `string \| null` | useOSStore | TopMenuBar (dynamic menus), WindowFrame (focus styling) | focusWindow, closeWindow | No | Page reload |
| desktopMode | `'workspace' \| 'ambient-hero'` | useOSStore | KineticHeroStage (opacity), SplitText (physics intensity), Dock (visibility) | setDesktopMode (Cmd+Option+M, double-click desktop) | localStorage | Page reload restores |
| theme | `'light' \| 'dark' \| 'system'` | useOSStore | All visual components (CSS variables) | SettingsApp, ControlCenter, Cmd+Shift+D | localStorage | Persists |
| soundEnabled | `boolean` | useOSStore | SoundSynthesizer | SettingsApp, ControlCenter | localStorage | Persists |
| wallpaperId | `string` | useOSStore | Wallpaper Layer | SettingsApp, ContextMenu | localStorage | Persists |
| contextMenu | `object \| null` | useOSStore | ContextMenu component | Right-click handlers, long-press | No | Dismissed on click/Escape |
| spotlightOpen | `boolean` | useOSStore | SpotlightSearch | Cmd+K shortcut | No | Page reload |

### AppWindow Interface
```typescript
interface AppWindow {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };  // default: 360×240
  prevBounds?: { x: number; y: number; width: number; height: number };
  defaultPosition?: { x: number; y: number };
  defaultSize: { width: number; height: number };
}
```

---

## 2. Music Player State (useMusicStore)

```typescript
interface MusicStore {
  // Playlist
  playlist: Track[];
  currentIndex: number;
  
  // Playback
  status: 'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'ended' | 'error';
  currentTime: number;           // seconds
  duration: number;              // seconds
  
  // Controls
  volume: number;                // 0.0 – 1.0
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  
  // UI State
  isDeckExpanded: boolean;
  isQueueVisible: boolean;
  
  // Web Audio References (non-serializable)
  audioElement: HTMLAudioElement | null;
  analyserNode: AnalyserNode | null;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverArt: string;
  audioSrc: string;
  duration: number;
  themeColor?: string;           // accent for visualizer
}
```

| State | Owner | Consumers | Mutation Source | Persistence | Reset |
|-------|-------|-----------|---------------|-------------|-------|
| playlist | useMusicStore | AudioDeck, Queue | Config/API | No | — |
| currentIndex | useMusicStore | Pill, Deck, MediaSession | play/next/prev/shuffle | localStorage | Persists |
| status | useMusicStore | Pill (eq anim), Deck (controls), Vinyl (spin) | Audio events (canplay, play, pause, ended, error, stall) | No | IDLE |
| currentTime | useMusicStore | Scrubber, TimeLabels | timeupdate event + seek | localStorage | Persists |
| volume | useMusicStore | VolumeSlider, GlobalAudioManager | Volume control drag | localStorage | Persists |
| isMuted | useMusicStore | Volume icon | Mute toggle | localStorage | Persists |
| isShuffled | useMusicStore | Shuffle button | Shuffle toggle | localStorage | Persists |
| repeatMode | useMusicStore | Repeat button | Repeat cycle | localStorage | Persists |
| isDeckExpanded | useMusicStore | Pill (click), Deck visibility | Pill click, collapse button | No | false |

---

## 3. Cursor State Machine

```typescript
interface CursorState {
  variant: 'kinetic-hero' | 'precision-drag' | 'magnetic-dock' | 'disabled';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  smoothVelocity: { x: number; y: number };  // EMA-smoothed
  speed: number;                               // |smoothVelocity|
  auraRadius: number;                          // 24–80px
  auraTarget: { x: number; y: number };        // lerp target
  magnetTarget?: { x: number; y: number; width: number; height: number }; // squircle morph
}
```

| State | Owner | Consumers | Mutation Source | Persistence | Reset |
|-------|-------|-----------|---------------|-------------|-------|
| variant | CursorStateMachine | CursorAuraRing (shape/blend), CursorPrecisionDot | DOM data-cursor attr on hovered element | No | kinetic-hero |
| position | KineticCursor | PrecisionDot, physics engine | pointermove event | No | Center |
| velocity | KineticCursor | AuraRing (radius), SplitText (font slant) | Computed from position delta | No | 0,0 |
| auraTarget | KineticCursor | AuraRing renderer | FR-independent lerp from position | No | position |

---

## 4. Audio Pipeline State

```typescript
interface AudioPipelineState {
  contextState: 'suspended' | 'running' | 'closed';
  isDucked: boolean;
  musicGain: number;              // 0.0 – 1.0 (normal: 1.0, ducked: 0.20)
  fxGain: number;                 // 0.0 – 1.0
  masterGain: number;             // 0.0 – 1.0
}
```

| State | Owner | Consumers | Mutation Source | Persistence | Reset |
|-------|-------|-----------|---------------|-------------|-------|
| contextState | GlobalAudioManager | All audio | User gesture creates/resumes context | No | suspended |
| isDucked | GlobalAudioManager | Music gain node | SoundSynthesizer.playFX() triggers duck | No | false |
| musicGain | GlobalAudioManager | Music GainNode | Volume slider + ducking | No | 1.0 |

---

## 5. Settings State (subset of useOSStore)

| Setting | Type | Default | Persistence |
|---------|------|---------|-------------|
| theme | `'light' \| 'dark' \| 'system'` | `'dark'` | localStorage |
| wallpaperId | `string` | `'sonoma-dark'` | localStorage |
| soundEnabled | `boolean` | `true` | localStorage |
| soundVolume | `number` | `0.5` | localStorage |
| dockMagnification | `boolean` | `true` | localStorage |
| dockBaseSize | `number` | `44` | localStorage |

---

## 6. Cross-System Communication

```
useOSStore ─── activeWindowId ──► TopMenuBar (dynamic app name)
           ─── windows ──────────► Dock (active dots, minimize targets)
           ─── desktopMode ──────► KineticHeroStage (opacity, physics toggle)
           ─── theme ────────────► CSS variables (:root .dark class)

useMusicStore ── status ──────────► MusicPill (equalizer), VinylDisc (spin)
              ── isDeckExpanded ──► AudioDeck (visibility)
              ── volume ──────────► GlobalAudioManager.musicGain

GlobalAudioManager ── duck event ──► useMusicStore.musicGain (temporary)
SoundSynthesizer ──── playFX() ──► GlobalAudioManager.triggerDuck()

CursorStateMachine ── variant ────► CursorAuraRing (shape morphing)
                   ── position ───► SplitText (proximity force field)
```

