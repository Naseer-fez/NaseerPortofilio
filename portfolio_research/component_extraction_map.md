# Phase 1 Deliverable: Unified Component Extraction & Architecture Map

**Project**: Next-Generation OS-Style Portfolio Website  
**Phase**: Phase 1 — Reverse Engineering, Component Extraction & Architectural Synthesis  
**Target References**:
1. **Base WebOS Environment**: Irfan Naikwade (`https://irfannaikwade.in/`)
2. **Interactive Taskbar / Dock**: Luca Felix (`https://luca-felix.com/`)
3. **Monolithic Typography & Kinetic Cursor**: Michal Grzebisz (`https://www.michalgrzebisz.com/`)
4. **Ambient Multimedia Music Player**: Nidal (`https://www.nidal.dev/`)

**Document Target**: `d:\CODE\Html\Showcase\portfolio_research\component_extraction_map.md`  
**Status**: COMPLETE ARCHITECTURAL SPECIFICATION & TAXONOMY  

---

## 1. Executive Architectural Overview & Synthesis Taxonomy

The goal of this architectural synthesis is to unite the four disparate, best-in-class interactive web experiences into a single, cohesive, ultra-high-performance **Virtual Desktop Operating System (WebOS)** portfolio website.

Rather than stacking these reference experiences as disjointed scrolling sections, the architecture organizes them into a **Single-Page Layered Virtual Desktop Environment (VDE)** operating at `100vw x 100vh` (`100dvh`). Each reference website contributes a vital subsystem to the global OS architecture:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                UNIFIED PORTFOLIO OS ENVIRONMENT                                 │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [TOP BAR]  Finder  File  Edit  View  Window  Help           [100% 🔋] [📶] [Sat Aug 15 12:51]   │ (Irfan Top Bar)
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│  [DESKTOP SHORTCUTS]                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                                                        │
│  │ Projects │  │ Terminal │  │  About   │                                                        │
│  └──────────┘  └──────────┘  └──────────┘                                                        │
│                                                                                                  │
│  [AMBIENT WALLPAPER / HERO STAGE]                                                                │
│                                                                                                  │
│        M   I   C   H   A   L       G   R   Z   E   B   I   S   Z                                 │ (Michal Kinetic Hero)
│        (Ambient Interactive Typography Wallpaper with Spring Physics & Cursor Warping)          │
│                                                                                                  │
│  [MULTI-WINDOW ACTIVE WORKSPACE]                                                                 │
│                ┌─────────────────────────────────────────────────────────┐                       │
│                │ 🔴 🟡 🟢  Projects Showcase — IrfanOS                   │                       │ (Irfan Multi-Window)
│                ├─────────────────────────────────────────────────────────┤                       │
│                │  [All]  [Full-Stack]  [AI / ML]  [Systems]              │                       │
│                │  ┌──────────────────┐  ┌──────────────────┐             │                       │
│                │  │ Next.js WebOS v2 │  │ Real-Time Audio  │             │                       │
│                │  └──────────────────┘  └──────────────────┘             │                       │
│                └─────────────────────────────────────────────────────────┘                       │
│                                                                                                  │
│                                           ┌────────────────────────────────────────┐             │
│                                           │ 🎵 NOW PLAYING: Midnight Terminal      │             │ (Nidal Audio Deck)
│                                           │ ┌──────┐ ┌──────┐ 01:45 ════○══ 03:42 │             │
│                                           │ │Vinyl │ │Art   │ [🔀][⏮][⏸][⏭][🔁]     │             │
│                                           │ └──────┘ └──────┘ 🔊 ═══════○ 80%      │             │
│                                           └────────────────────────────────────────┘             │
│                                                                                                  │
│                                [LUCA FELIX PARABOLIC DOCK]                                       │
│       ┌──────────────────────────────────────────────────────────────────────────────────┐       │
│       │ [Finder] [Terminal] [Projects] [About] [Mail] │ [🎵 Music Pill] │ [Theme] [Trash]│       │ (Luca Dock + Nidal Pill)
│       └──────────────────────────────────────────────────────────────────────────────────┘       │
│                                                                                                  │
│  [KINETIC CURSOR LAYER] ──► (• Instant Precision Dot) + (◯ Trailing Dynamic Difference Ring)     │ (Michal Dual Cursor)
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Master Source Attribution & Component Taxonomy Matrix

The table below maps every target feature and subsystem in the synthesized portfolio to its primary reference origin, secondary enhancement source, and target implementation component:

| Subsystem / Feature | Primary Origin | Secondary Origin | Target React Component | Functional Responsibilities & Attribution Details |
|---|---|---|---|---|
| **Virtual Desktop Manager** | Irfan Naikwade | — | `<DesktopCanvas />`, `<WindowManager />` | Window z-index stacking, cascade spawning, focus bumping, clamping drag boundaries, minimize suction physics. |
| **Window Frame & Controls** | Irfan Naikwade | Apple macOS HIG | `<WindowFrame />`, `<TrafficLights />` | 8-directional edge/corner resizing, drag header, close/minimize/maximize buttons with authentic hover glyphs. |
| **Top Menu & Status Bar** | Irfan Naikwade | Apple macOS HIG | `<TopMenuBar />`, `<ControlCenter />` | Pinned 28px height, dynamic active-app menu binding (` AppName`), real-time clock, status tray, brightness/sound popover. |
| **Parabolic Taskbar / Dock** | Luca Felix | Irfan Naikwade | `<Dock />`, `<DockItem />` | Cosine bell proximity magnification ($1.0\times \to 1.55\times$ over $150\text{px}$ radius), spring dynamics (`mass: 0.1, stiffness: 420`), squircle icons, active dot indicators. |
| **Kinetic Hero Typography** | Michal Grzebisz | — | `<KineticHeroStage />`, `<SplitText />` | Full-bleed monumental typography (`clamp(4.5rem, 14vw, 18.5rem)`), accessible split-text particle grid, variable font modulation ($wght, wdth$), ambient idle harmonic wave. |
| **Multi-Tier Kinetic Cursor** | Michal Grzebisz | Irfan Naikwade | `<KineticCursor />`, `<CursorAura />` | Zero-latency hardware dot ($r=4\text{px}$) + frame-rate independent lerp trailing aura ($r=24\text{px}\to80\text{px}$) with `mix-blend-mode: difference` and magnetic snap states. |
| **Multimedia Music Player** | Nidal | Apple Music | `<MusicPlayerPill />`, `<AudioDeckModal />` | Dual-state mini dock pill + expandable glassmorphic audio deck, 360° spinning vinyl disc ejection, real-time Canvas FFT frequency visualizer, `localStorage` persistence. |
| **Global Audio Pipeline** | Nidal | Irfan Naikwade | `<AudioContextManager />`, `<SoundFX />` | Unified Web Audio API `AudioContext` routing, background audio ducking (to 20% on UI sounds/video), procedural synthesized UI chimes (window poofs, trash crumple). |
| **Terminal CLI Application** | Irfan Naikwade | Unix / Zsh | `<TerminalApp />`, `<CLICommandEngine />` | Sandboxed interactive shell, Neofetch ASCII art, theme switcher, command history, tab autocomplete, Easter eggs. |
| **Projects Showcase App** | Irfan Naikwade | Luca Felix | `<ProjectsApp />`, `<ProjectDetailModal />` | Multi-category filterable project gallery, 3D spotlight cards, tech stack pills, case study reader, live demo links. |
| **About Me & Resume Viewer** | Irfan Naikwade | Michal Grzebisz | `<AboutApp />`, `<ResumeViewer />` | Career timeline accordion, interactive skill radar matrix, embedded PDF resume viewer with instant download. |
| **Virtual File Explorer** | Irfan Naikwade | macOS Finder | `<FinderApp />`, `<VirtualFS />` | Recursive hierarchical folder tree traversal, file path breadcrumbs, markdown/image file previewer. |
| **System Settings App** | Irfan Naikwade | Apple macOS | `<SettingsApp />` | Wallpaper gallery selector, dark/light/auto appearance switch, dock size/magnification toggles, sound FX toggles. |
| **Contact & Mailer App** | Irfan Naikwade | — | `<MailApp />` | macOS Mail compose view, real-time form validation, animated paper airplane send transitions, REST endpoint dispatch. |
| **Spotlight Command Palette** | Irfan Naikwade | macOS Spotlight | `<SpotlightSearch />` | Global `Cmd+K` launcher, fuzzy app/file/project indexing, keyboard navigation, rapid actions. |
| **Desktop Context Menus** | Irfan Naikwade | — | `<ContextMenu />` | Viewport-clamped right-click context menus with dynamic actions (wallpaper change, terminal launch, cleanup). |
| **Mobile Adaptive Paradigm** | Irfan Naikwade | Luca / Nidal / Michal | `<MobileSheet />`, `<MobileTabBar />` | Responsive breakpoint ($< 768\text{px}$) transformation into iOS-style bottom modal sheets with touch swipe-to-dismiss ($140\text{px}$ threshold) and sticky audio pill. |

---

## 3. Unified React Component Tree & DOM Layering Hierarchy

The synthesized application runs inside a single, zero-scroll container (`100vw x 100vh`) with 8 strictly isolated spatial layers governed by a rigorous z-index matrix:

```
<AppRoot> (100vw x 100vh, overflow-hidden, bg-black)
│
├── [LAYER 0: Z-INDEX 0] <AmbientWallpaperLayer>
│   ├── <WallpaperCanvas /> (WebP/AVIF dynamic wallpaper with day/night shift)
│   ├── <KineticHeroStage /> (Michal Grzebisz Split-Text kinetic typography stage)
│   └── <WallpaperTintOverlay /> (Dark/Light glassmorphism tint backdrop)
│
├── [LAYER 1: Z-INDEX 10] <DesktopCanvas>
│   ├── <DesktopGrid>
│   │   └── <DesktopIconItem /> (Double-click launch, marquee selectable)
│   └── <SelectionMarquee /> (Rubberband rectangular selection canvas)
│
├── [LAYER 2: Z-INDEX 20–49] <WindowManagerCanvas>
│   └── <AnimatePresence>
│       ├── <WindowFrame id="finder"> <FinderApp /> </WindowFrame>
│       ├── <WindowFrame id="terminal"> <TerminalApp /> </WindowFrame>
│       ├── <WindowFrame id="projects"> <ProjectsApp /> </WindowFrame>
│       ├── <WindowFrame id="about"> <AboutApp /> </WindowFrame>
│       ├── <WindowFrame id="settings"> <SettingsApp /> </WindowFrame>
│       └── <WindowFrame id="mail"> <MailApp /> </WindowFrame>
│
├── [LAYER 3: Z-INDEX 50] <TopMenuBar>
│   ├── <AppMenuDropdowns /> (Dynamic menus matching activeWindowId)
│   ├── <ControlCenterToggle />
│   └── <LiveClockDisplay />
│
├── [LAYER 4: Z-INDEX 9990] <DockRootContainer> (Fixed bottom-5, pointer-events-none)
│   └── <DockChassis> (pointer-events-auto, glassmorphic capsule)
│       ├── <DockItem id="finder" />
│       ├── <DockItem id="terminal" />
│       ├── <DockItem id="projects" />
│       ├── <DockItem id="about" />
│       ├── <DockItem id="mail" />
│       ├── <DockDivider />
│       ├── <MusicPlayerDockPill /> (Nidal mini pill integrated into dock)
│       ├── <DockDivider />
│       ├── <DockItem id="settings" />
│       └── <DockItem id="trash" />
│
├── [LAYER 5: Z-INDEX 9992] <MusicDeckModalContainer> (Expandable Nidal Audio Deck)
│   └── <AudioDeckExpandedCard /> (Vinyl spin disc, canvas FFT visualizer, queue)
│
├── [LAYER 6: Z-INDEX 9995] <SystemPortals>
│   ├── <ContextMenuPortal /> (Right-click clamped context menu)
│   ├── <ControlCenterModal /> (Brightness, volume, wallpaper quick controls)
│   ├── <SpotlightSearchModal /> (Cmd+K global command launcher)
│   └── <ToastNotificationCenter /> (System alerts and audio feedback)
│
├── [LAYER 7: Z-INDEX 9999] <KineticCursorLayer> (Pointer-events-none, desktop-only)
│   ├── <CursorPrecisionDot /> (Zero-lag hardware tracking dot)
│   └── <CursorAuraRing /> (Elastic spring follower with difference blend inversion)
│
└── [LAYER 8: MOBILE VIEWPORT] <MobileSubsystemContainer> (Active on < 768px)
    ├── <MobileStatusBar />
    ├── <MobileBottomSheetWrapper /> (Swipe-to-dismiss gesture container)
    └── <MobileStickyAudioBar />
```

---

## 4. Component Boundaries & TypeScript Interface Contracts

### 4.1 Global OS State Store Contract (`useOSStore.ts`)

```typescript
// Core System State & Window Manager Store
export type AppId = 'finder' | 'terminal' | 'projects' | 'about' | 'settings' | 'mail' | 'music' | 'notes';
export type ThemeMode = 'dark' | 'light' | 'auto';
export type DesktopMode = 'workspace' | 'ambient-hero'; // Toggle between Multi-Window & Michal Hero focus

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppWindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
  minSize: WindowSize;
  maxSize?: WindowSize;
  prevBounds?: WindowBounds;
}

export interface GlobalOSStore {
  // Desktop & Mode
  desktopMode: DesktopMode;
  theme: ThemeMode;
  accentColor: string;
  wallpaper: string;
  isMuted: boolean;
  masterVolume: number;
  
  // Window Registry
  windows: Record<AppId, AppWindowState>;
  activeWindowId: AppId | null;
  minimizedWindows: AppId[];
  
  // System Modals
  isSpotlightOpen: boolean;
  isControlCenterOpen: boolean;
  activeContextMenu: { x: number; y: number; items: ContextMenuItem[] } | null;
  
  // Actions
  setDesktopMode: (mode: DesktopMode) => void;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  restoreWindow: (id: AppId) => void;
  toggleMaximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updateWindowBounds: (id: AppId, pos?: Partial<WindowPosition>, size?: Partial<WindowSize>) => void;
  setTheme: (theme: ThemeMode) => void;
  setWallpaper: (url: string) => void;
  setSpotlightOpen: (open: boolean) => void;
  setControlCenterOpen: (open: boolean) => void;
  showContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  hideContextMenu: () => void;
}
```

---

### 4.2 Luca Felix Dock & Taskbar Contract (`dock.types.ts`)

```typescript
import { ReactNode } from 'react';
import { MotionValue } from 'framer-motion';

export interface DockItemConfig {
  id: string;
  label: string;
  icon: ReactNode;
  badgeCount?: number;
  isOpen?: boolean;
  isMinimized?: boolean;
  isCustomWidget?: boolean;
  dividerAfter?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export interface DockProps {
  items: DockItemConfig[];
  activeItemId?: string | null;
  baseWidth?: number;           // Default: 44px
  magnifiedWidth?: number;      // Default: 68px
  distanceThreshold?: number;   // Default: 150px
  className?: string;
}

export interface DockItemProps {
  item: DockItemConfig;
  mouseX: MotionValue<number>;
  baseWidth: number;
  magnifiedWidth: number;
  distanceThreshold: number;
  isActive?: boolean;
}
```

---

### 4.3 Michal Grzebisz Kinetic Cursor & Hero Contract (`kinetic.types.ts`)

```typescript
export type CursorVariant = 'default' | 'pointer' | 'text' | 'drag' | 'resize-ew' | 'resize-ns' | 'resize-nwse' | 'resize-nesw' | 'magnetic-pill' | 'disabled';

export interface CursorState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  targetRadius: number;
  variant: CursorVariant;
  isDown: boolean;
  isHoveringInteractive: boolean;
  isOverWindowDragHandle: boolean;
  velocity: { vx: number; vy: number; speed: number };
}

export interface SplitTextCharData {
  char: string;
  lineIndex: number;
  wordIndex: number;
  charIndex: number;
  x0: number; // Rest anchor X
  y0: number; // Rest anchor Y
  x: number;  // Current physics X
  y: number;  // Current physics Y
  vx: number; // Velocity X
  vy: number; // Velocity Y
  weight: number; // Variable font weight [400 - 900]
  width: number;  // Variable font width [100 - 125%]
  slant: number;  // Variable font slant [-15deg to +15deg]
}

export interface KineticHeroProps {
  lines: string[];
  influenceRadius?: number;      // Default: 260px
  maxDisplacement?: number;      // Default: 65px
  springStiffness?: number;      // Default: 280 N/m
  dampingCoefficient?: number;   // Default: 24 Ns/m
  enableDifferenceBlend?: boolean;
  enableAmbientIdleWave?: boolean;
}
```

---

### 4.4 Nidal Music Player Contract (`music.types.ts`)

```typescript
export type PlaybackStatus = 'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'ended' | 'error';
export type RepeatMode = 'off' | 'all' | 'one';

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  src: string;      // .mp3 / .webm / .m4a URL
  coverArt: string; // Album artwork URL
  themeColor: string; // Accent color hex
}

export interface MusicPlayerStore {
  playlist: TrackMetadata[];
  currentIndex: number;
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isExpandedDeckOpen: boolean;
  isQueueOpen: boolean;
  isSeeking: boolean;
  
  // Web Audio Graph References
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
  
  // Actions
  playTrack: (index?: number) => Promise<void>;
  pauseTrack: () => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (timeInSeconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setExpandedDeckOpen: (open: boolean) => void;
  setQueueOpen: (open: boolean) => void;
}
```

---

## 5. Comprehensive Inter-Component Data Flow & State Machine

```
                              ┌────────────────────────┐
                              │  Global OS Event Bus   │
                              └───────────┬────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        ▼                                 ▼                                 ▼
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│ Window Manager Focus  │       │ Kinetic Cursor Engine │       │ Global Audio Pipeline │
│ State Machine         │       │ State Machine         │       │ State Machine         │
└──────────┬────────────┘       └──────────┬────────────┘       └──────────┬────────────┘
           │                               │                               │
           ├─► Window Click                ├─► Hover Drag Handle           ├─► Modal Video Plays
           │   - Bump zIndex to Top        │   - Morph to System Native    │   - Duck Music to 20%
           │   - Update TopMenuBar Title   │   - Disable Elastic Aura Lag  │   - AudioContext Shared
           │                               │                               │
           ├─► Minimize Click              ├─► Hover Dock Icon             ├─► Window Close Poof
           │   - Calc Vector to Dock       │   - Magnetic Pill Snap        │   - Trigger Web Audio
           │   - Animate Scale/Glide       │   - Enlarge Ring Radius       │   - Procedural Chime
           │                               │                               │
           └─► App Launch Bounce           └─► Canvas Hover                └─► Track Ends
               - Trigger Dock Bounce           - Trigger Kinetic Wave          - Advance Next Track
               - Open App Window               - Difference Inversion          - MediaSession Sync
```

---

## 6. Unified Design Token System

The synthesized portfolio adopts a unified token system combining Apple macOS Sequoia/Sonoma glassmorphism with Michal Grzebisz brutalist typography and Nidal neon accents.

### 6.1 Color Palettes (Light & Dark)

```css
:root {
  /* Dark Mode Palettes (Default) */
  --os-bg-canvas: #09090b;
  --os-bg-glass: rgba(18, 18, 22, 0.70);
  --os-bg-glass-heavy: rgba(14, 14, 18, 0.88);
  --os-bg-glass-subtle: rgba(255, 255, 255, 0.05);
  
  --os-border-glass: rgba(255, 255, 255, 0.12);
  --os-border-glass-highlight: rgba(255, 255, 255, 0.22);
  --os-border-subtle: rgba(255, 255, 255, 0.06);

  --os-text-primary: #f5f5f7;
  --os-text-secondary: rgba(235, 235, 245, 0.65);
  --os-text-muted: rgba(235, 235, 245, 0.40);
  --os-text-on-accent: #ffffff;

  /* Accent Colors */
  --os-accent-blue: #0a84ff;
  --os-accent-purple: #5e5ce6;
  --os-accent-green: #30d158;
  --os-accent-orange: #ff9f0a;
  --os-accent-red: #ff453a;

  /* macOS Traffic Light Colors */
  --os-traffic-close: #ff5f56;
  --os-traffic-close-border: #e0443e;
  --os-traffic-minimize: #ffbd2e;
  --os-traffic-minimize-border: #dea123;
  --os-traffic-maximize: #27c93f;
  --os-traffic-maximize-border: #1aab29;
}

.light {
  /* Light Mode Palettes */
  --os-bg-canvas: #f2f2f7;
  --os-bg-glass: rgba(255, 255, 255, 0.72);
  --os-bg-glass-heavy: rgba(255, 255, 255, 0.92);
  --os-bg-glass-subtle: rgba(0, 0, 0, 0.04);

  --os-border-glass: rgba(0, 0, 0, 0.08);
  --os-border-glass-highlight: rgba(255, 255, 255, 0.85);
  --os-border-subtle: rgba(0, 0, 0, 0.05);

  --os-text-primary: #1d1d1f;
  --os-text-secondary: #6e6e73;
  --os-text-muted: #86868b;
  --os-text-on-accent: #ffffff;
}
```

---

### 6.2 Glassmorphism Optical Filters & Elevation Tiers

```css
:root {
  /* Glass Backdrop Blurs */
  --glass-blur-dock: blur(20px) saturate(190%) contrast(105%);
  --glass-blur-window: blur(28px) saturate(180%);
  --glass-blur-menubar: blur(20px) saturate(160%);
  --glass-blur-modal: blur(32px) saturate(200%);
  --glass-blur-tooltip: blur(12px) saturate(160%);

  /* Elevation Box Shadows (Dark Mode) */
  --elevation-dock: 0 12px 36px -4px rgba(0, 0, 0, 0.55),
                    0 4px 16px -2px rgba(0, 0, 0, 0.35),
                    inset 0 1px 1px 0 rgba(255, 255, 255, 0.22);

  --elevation-window-inactive: 0 10px 30px -10px rgba(0, 0, 0, 0.45),
                              0 0 0 1px rgba(255, 255, 255, 0.08);

  --elevation-window-active: 0 25px 60px -15px rgba(0, 0, 0, 0.75),
                            0 0 0 1px rgba(255, 255, 255, 0.18),
                            0 0 35px 2px rgba(10, 132, 255, 0.15);

  --elevation-audio-deck: 0 24px 48px -12px rgba(0, 0, 0, 0.70),
                          0 0 0 1px rgba(255, 255, 255, 0.12),
                          inset 0 1px 1px 0 rgba(255, 255, 255, 0.20);
}
```

---

### 6.3 Typography Scale Specifications

```css
:root {
  /* Font Family Stacks */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif;
  --font-mono: "SF Mono", "JetBrains Mono", "Fira Code", Menlo, monospace;
  --font-display-hero: "PP Neue Montreal", "Monument Extended", -apple-system, sans-serif;

  /* Typographic Scales */
  --text-hero-giant: clamp(4.5rem, 14vw + 1rem, 18.5rem);
  --text-hero-sub: clamp(1.25rem, 3vw, 3.5rem);
  --text-window-title: 13px;
  --text-menubar: 12px;
  --text-dock-tooltip: 11.5px;
  --text-app-body: 13.5px;
  --text-terminal-code: 12.5px;
  --text-status-badge: 10px;
}
```

---

### 6.4 Spring Motion Dynamics & Easing Curves

```typescript
export const MOTION_TOKENS = {
  // Apple HIG Standard Curves
  easeAppleSpring: [0.16, 1, 0.3, 1] as const,
  easeAppleClose: [0.4, 0, 0.6, 1] as const,
  easeAppleMaximize: [0.2, 0.9, 0.2, 1] as const,

  // Framer Motion Physics Presets
  springDockMagnify: { mass: 0.1, stiffness: 420, damping: 26 },
  springWindowSpawn: { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 },
  springWindowMinimize: { duration: 0.32, ease: [0.25, 1, 0.5, 1] },
  springCursorFollower: { mass: 0.15, stiffness: 350, damping: 28 },
  springTactileSquash: { stiffness: 600, damping: 20 },
  
  // Michal Second-Order Kinetic Physics
  kineticTypography: {
    k: 280.0, // Spring stiffness (N/m)
    c: 24.0,  // Damping coefficient (Ns/m)
    m: 1.0,   // Mass (kg)
    zeta: 0.76 // Damping ratio (Underdamped with snappy settle)
  }
};
```

---

## 7. Phase 2 Component Directory Scaffold Specification

```
src/
├── components/
│   ├── os/
│   │   ├── DesktopCanvas.tsx          # Absolute desktop canvas, background click handler
│   │   ├── DesktopGrid.tsx            # Auto-flow icon shortcut grid
│   │   ├── DesktopIcon.tsx            # Single/double click disambiguation, selection state
│   │   ├── SelectionMarquee.tsx       # Rubberband bounding box drag selection
│   │   ├── WindowFrame.tsx            # Floating window frame, zIndex promotion, 8-way resize
│   │   ├── TrafficLights.tsx          # macOS close/minimize/maximize buttons with hover glyphs
│   │   ├── TopMenuBar.tsx             # 28px macOS menu bar with dynamic app binding & clock
│   │   ├── ContextMenu.tsx            # Clamped right-click context menus
│   │   ├── SpotlightSearch.tsx        # Cmd+K global command palette
│   │   └── ControlCenter.tsx          # macOS Control Center popover (volume, brightness, theme)
│   ├── dock/
│   │   ├── Dock.tsx                   # Central floating navigation dock container
│   │   ├── DockItem.tsx               # Parabolic Cosine scaling item with spring width
│   │   ├── DockTooltip.tsx            # Floating tooltip popover capsule
│   │   ├── DockDivider.tsx            # Hairline vertical section separator
│   │   └── ActiveDotIndicator.tsx     # Glowing active/minimized app indicator dot
│   ├── hero/
│   │   ├── KineticHeroStage.tsx       # Michal Grzebisz full-bleed kinetic typography stage
│   │   ├── SplitText.tsx              # Accessible character-by-character particle grid
│   │   └── AmbientHarmonicWave.ts     # Idle harmonic wave equation engine
│   ├── cursor/
│   │   ├── KineticCursor.tsx          # Dual-tier cursor controller (Dot + Aura Ring)
│   │   ├── CursorPrecisionDot.tsx     # Zero-lag hardware tracking point
│   │   ├── CursorAuraRing.tsx         # Trailing difference-blended elastic aura
│   │   └── CursorStateMachine.ts      # Cursor state transitions (precision vs magnetic)
│   ├── music/
│   │   ├── MusicPlayerDockPill.tsx    # Compact mini pill embedded in Luca Dock
│   │   ├── AudioDeckExpandedCard.tsx  # Full glassmorphic deck modal with queue
│   │   ├── VinylDiscAssembly.tsx      # 360° spinning vinyl disc with slide ejection
│   │   ├── AudioVisualizerCanvas.tsx  # Real-time Web Audio FFT frequency canvas
│   │   ├── InteractiveScrubber.tsx    # Precision progress bar with hover tooltips
│   │   └── MediaSessionController.ts  # W3C Media Session API lockscreen integration
│   ├── apps/
│   │   ├── Terminal/                  # Terminal CLI with Neofetch & command parser
│   │   ├── Projects/                  # Filterable project showcase gallery
│   │   ├── About/                     # Bio overview, timeline & PDF resume viewer
│   │   ├── Finder/                    # Virtual filesystem tree explorer
│   │   ├── Settings/                  # Wallpaper picker & OS customization preferences
│   │   └── Mail/                      # Contact mailer with client validation & animations
│   └── mobile/
│       ├── MobileBottomSheet.tsx      # iOS full-screen bottom modal with swipe-to-dismiss
│       ├── MobileStickyAudioBar.tsx   # Slim sticky 56px audio player bar
│       ├── MobileStatusBar.tsx        # Compact iOS status bar (Clock & battery)
│       └── MobileTabBar.tsx           # Mobile-optimized bottom tab bar
├── core/
│   ├── store/
│   │   ├── useOSStore.ts              # Zustand central window manager & desktop state
│   │   └── useMusicStore.ts           # Audio playback state & playlist store
│   ├── audio/
│   │   ├── GlobalAudioManager.ts      # Web Audio routing & background music ducking
│   │   └── SoundSynthesizer.ts        # Procedural Web Audio UI sound effects
│   ├── physics/
│   │   ├── SpringSolvers.ts           # Semi-Implicit Euler & Verlet numerical integrators
│   │   ├── VelocityTracker.ts         # Exponential Moving Average (EMA) cursor velocity
│   │   └── GeometryCache.ts           # Struct-of-Arrays (SoA) TypedArray spatial buffers
│   └── events/
│       ├── ShortcutRegistry.ts        # Global keyboard shortcuts dispatcher
│       └── GestureEngine.ts           # Touch swipe & pointer event handlers
└── styles/
    ├── globals.css                    # Tailwind imports, CSS variables, glassmorphic filters
    └── animations.css                 # Apple HIG cubic-bezier animation keyframes
```

---

*End of Component Extraction & Unified Architecture Map (Phase 1 Deliverable).*
