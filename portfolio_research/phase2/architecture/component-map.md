# Component Map — Complete Component Registry
## Phase 2 Architecture Document

---

### DesktopCanvas
- **Source**: BASE
- **Purpose**: Root desktop surface behind all windows
- **Visual**: Full viewport minus menu bar height, background color/wallpaper
- **Behavioral**: Click to deselect icons, dismiss menus, double-click for ambient mode, right-click for context menu, drag for selection marquee
- **Dependencies**: useOSStore, ContextMenu, SelectionMarquee
- **States**: Default, selection-active, context-menu-open
- **Responsive**: Full viewport on all sizes; mobile: no selection marquee
- **Integration Target**: Layer 1 (z-10)
- **Construction**: Reconstructed from BASE
- **Confidence**: CONFIRMED

### DesktopGrid
- **Source**: BASE
- **Purpose**: Auto-flow grid layout for desktop shortcut icons
- **Visual**: `grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 p-4`
- **Behavioral**: Contains DesktopIcon children
- **Dependencies**: DesktopIcon
- **States**: Default
- **Responsive**: Visible ≥768px; hidden on mobile (apps via tab bar)
- **Integration Target**: Layer 1 (z-10)
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### DesktopIcon
- **Source**: BASE
- **Purpose**: Launchable application shortcut on desktop
- **Visual**: 48×48px icon, 11px label, hover highlight `bg-white/15`
- **Behavioral**: Single click: select (300ms timer). Double click: launch app. Touch: single tap launches.
- **Dependencies**: useOSStore.openWindow, IconInteractionController
- **States**: Default, selected, active-press
- **Responsive**: Hidden <768px
- **Integration Target**: Layer 1
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### SelectionMarquee
- **Source**: BASE
- **Purpose**: Rubber-band rectangle for multi-selecting desktop icons
- **Visual**: Semi-transparent blue rectangle with border
- **Behavioral**: Drag on empty desktop creates selection box, intersection test against icon bounds
- **Dependencies**: DesktopCanvas, DesktopIcon
- **States**: Hidden, active-dragging
- **Responsive**: Desktop only (≥768px)
- **Integration Target**: Layer 1
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### WindowFrame
- **Source**: BASE
- **Purpose**: Floating application window container with chrome
- **Visual**: Glassmorphic (`blur(28px) saturate(180%)`), `rounded-xl` (12px), 36px header, shadow system
- **Behavioral**: Header drag (clamped), 8-way resize, double-click header to maximize, z-index promotion on focus
- **Dependencies**: TrafficLights, useOSStore, ShortcutRegistry
- **States**: Open, minimized, maximized, focused, unfocused
- **Responsive**: Floating window ≥768px; 92vh bottom sheet <768px
- **Integration Target**: Layer 2 (z-20–49)
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### TrafficLights
- **Source**: BASE
- **Purpose**: macOS-style close/minimize/maximize window controls
- **Visual**: 3× 12px circles (red #FF5F56, yellow #FFBD2E, green #27C93F), hover glyphs
- **Behavioral**: Close, minimize, maximize/restore window
- **Dependencies**: useOSStore.closeWindow/minimizeWindow/toggleMaximize
- **States**: Default (colored dots), hover (show glyphs), unfocused (gray dots)
- **Responsive**: Same across breakpoints (within window frame)
- **Integration Target**: Within WindowFrame header
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### TopMenuBar
- **Source**: BASE
- **Purpose**: Persistent macOS-style menu bar with app context and status tray
- **Visual**: 28px height, `bg-white/70 dark:bg-black/40`, `backdrop-blur-2xl`, 12px text
- **Behavioral**: Dynamic app name binding from activeWindowId, menu dropdowns, clock display
- **Dependencies**: useOSStore.activeWindowId, ControlCenter
- **States**: Default, dropdown-open
- **Responsive**: Full menus ≥640px; simplified (clock + status only) <640px
- **Integration Target**: Layer 3 (z-50)
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### ControlCenter
- **Source**: BASE
- **Purpose**: macOS Control Center popover (volume, brightness, theme)
- **Visual**: Glassmorphic popover, grid of toggle cards
- **Behavioral**: Toggle theme, adjust volume, change wallpaper
- **Dependencies**: useOSStore, GlobalAudioManager
- **States**: Hidden, visible
- **Responsive**: Same across breakpoints
- **Integration Target**: Layer 6 (z-[9995])
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### SpotlightSearch
- **Source**: BASE
- **Purpose**: Global command palette and app launcher
- **Visual**: Centered modal with search input, results list, glassmorphic backdrop
- **Behavioral**: Cmd+K activation, fuzzy search apps/files/projects, keyboard navigation, Enter to launch
- **Dependencies**: useOSStore, app registry
- **States**: Hidden, visible-empty, visible-with-results
- **Responsive**: Full modal ≥768px; search icon in header <768px
- **Integration Target**: Layer 6 (z-[9995])
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### ContextMenu
- **Source**: BASE
- **Purpose**: Right-click contextual action menus
- **Visual**: ~220px wide, glassmorphic, clamped to viewport bounds
- **Behavioral**: Right-click shows, click/Escape dismisses, viewport edge clamping
- **Dependencies**: useOSStore.activeContextMenu
- **States**: Hidden, visible
- **Responsive**: Right-click ≥768px; long-press <768px
- **Integration Target**: Layer 6 (z-[9995])
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### Dock (Luca)
- **Source**: LUCA (REPLACES base dock)
- **Purpose**: Primary floating navigation dock with parabolic magnification
- **Visual**: Glassmorphic pill (`blur(20px) saturate(190%)`), specular hairline, centered bottom
- **Behavioral**: Proximity-based Cosine Bell magnification (R=150px, 44→68px), houses app launchers + music pill
- **Dependencies**: DockItem, MusicPlayerDockPill, DockDivider, useOSStore, useMusicStore
- **States**: Mouse-inside (magnification active), mouse-outside (base sizes)
- **Responsive**: Full dock ≥768px; tab bar <768px (magnification disabled)
- **Integration Target**: Layer 4 (z-[9990])
- **Construction**: Reconstructed from Luca reference
- **Confidence**: CONFIRMED

### DockItem
- **Source**: LUCA
- **Purpose**: Individual magnifiable dock icon with spring physics
- **Visual**: 44px base → 68px magnified, squircle surface (22% radius), icon + gloss overlay
- **Behavioral**: Spring-driven width (mass:0.1, stiff:420, damp:26), press squash (0.88x), click launches/focuses app
- **Dependencies**: Dock mouseX MotionValue, useOSStore
- **States**: Default, hover-magnified, pressed, active (dot visible), minimized (dot dimmed)
- **Responsive**: Fixed size on mobile (no magnification)
- **Integration Target**: Layer 4
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### DockTooltip
- **Source**: LUCA
- **Purpose**: Floating label above hovered dock item
- **Visual**: `blur(12px)`, 11.5px text, capsule shape (6px radius), arrow pointer
- **Behavioral**: Spring entrance (y:[8→0], opacity:[0→1]), fade exit (100ms)
- **Dependencies**: DockItem hover state
- **States**: Hidden, visible
- **Responsive**: Hidden on mobile (no hover)
- **Integration Target**: Layer 4
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### DockDivider
- **Source**: LUCA
- **Purpose**: Visual separator between dock sections
- **Visual**: 1px × 32px, `rgba(255,255,255,0.12)`
- **Behavioral**: None (decorative)
- **Dependencies**: None
- **States**: Default only
- **Responsive**: Same on all sizes
- **Integration Target**: Layer 4
- **Construction**: New (simple CSS)
- **Confidence**: CONFIRMED

### ActiveDotIndicator
- **Source**: BASE + LUCA (MODIFIED)
- **Purpose**: Running/minimized app status dot below dock icon
- **Visual**: 3px circle, white 85% opacity, glow `0 0 4px rgba(255,255,255,0.4)`
- **Behavioral**: Appears when app is open, dims when minimized, hidden when closed
- **Dependencies**: useOSStore.windows
- **States**: Hidden, visible-open, visible-minimized (dimmed)
- **Responsive**: Same across breakpoints
- **Integration Target**: Layer 4 (within DockItem)
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### KineticHeroStage
- **Source**: MICHAL
- **Purpose**: Full-bleed interactive kinetic typography wallpaper
- **Visual**: 100vw × 100dvh, monumental text `clamp(4.5rem, 14vw, 18.5rem)`, white on dark
- **Behavioral**: Characters respond to cursor proximity via spring-mass-damper physics (k=280, c=24, m=1.0)
- **Dependencies**: SplitText, CursorState, useOSStore.desktopMode
- **States**: Workspace mode (opacity 0.35, reduced physics), Ambient hero mode (opacity 1.0, full physics)
- **Responsive**: Same layout all sizes; cursor interaction desktop only, gyroscope/wave on mobile
- **Integration Target**: Layer 0 (z-0)
- **Construction**: Reconstructed from Michal reference
- **Confidence**: CONFIRMED

### SplitText
- **Source**: MICHAL
- **Purpose**: Character-level particle system for kinetic typography
- **Visual**: Individual `<span>` per character with variable font axes
- **Behavioral**: Each glyph is physics particle with rest position, velocity, spring forces. SoA Float32Array cache for geometry.
- **Dependencies**: KineticHeroStage, GeometryCache
- **States**: Resting, displaced, returning-to-rest
- **Responsive**: Same text, font clamp scales naturally
- **Integration Target**: Layer 0
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### AmbientHarmonicWave
- **Source**: MICHAL
- **Purpose**: Gentle text oscillation when cursor is absent
- **Visual**: 2-4px horizontal wave displacement across characters
- **Behavioral**: Harmonic wave function, ~0.5-1Hz, phase offset per character position
- **Dependencies**: SplitText characters
- **States**: Active (no cursor / mobile), inactive (cursor present)
- **Responsive**: Active on all viewports (primary interaction on mobile)
- **Integration Target**: Layer 0
- **Construction**: Reconstructed
- **Confidence**: PROBABLE

### KineticCursor
- **Source**: MICHAL
- **Purpose**: Controller for dual-tier cursor system
- **Visual**: None (delegates to Dot and AuraRing)
- **Behavioral**: Manages cursor position, velocity tracking (EMA β=0.75), dispatches state to children
- **Dependencies**: CursorPrecisionDot, CursorAuraRing, CursorStateMachine
- **States**: kinetic-hero, precision-drag, magnetic-dock, disabled
- **Responsive**: Active ≥768px + pointer device; disabled on touch
- **Integration Target**: Layer 7 (z-[9999])
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### CursorPrecisionDot
- **Source**: MICHAL
- **Purpose**: Zero-latency hardware-tracking cursor dot
- **Visual**: 4px radius circle, white, pointer-events: none
- **Behavioral**: Instantly follows mouse position (0ms lag)
- **Dependencies**: KineticCursor position
- **States**: Visible (desktop), hidden (mobile/touch)
- **Responsive**: Desktop only
- **Integration Target**: Layer 7
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### CursorAuraRing
- **Source**: MICHAL
- **Purpose**: Elastic trailing aura with difference blend
- **Visual**: 24-80px radius, mix-blend-mode: difference, 2px border
- **Behavioral**: Lerp follow (λ=0.15 at 60Hz), velocity-dependent radius, context-dependent shape
- **Dependencies**: KineticCursor, CursorStateMachine
- **States**: kinetic (full ring), collapsed (over drag handles, 100ms), squircle (over dock items)
- **Responsive**: Desktop only
- **Integration Target**: Layer 7
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### CursorStateMachine
- **Source**: MICHAL (logic module)
- **Purpose**: FSM determining cursor visual state based on DOM target
- **Behavioral**: Reads `data-cursor` attributes on hovered elements, transitions between kinetic/precision/magnetic/disabled
- **Dependencies**: DOM event listeners, data attributes on interactive elements
- **States**: See cursor context states in Michal analysis
- **Integration Target**: Logic (no visual)
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### MusicPlayerDockPill
- **Source**: NIDAL
- **Purpose**: Compact music player embedded in dock
- **Visual**: 120px base width, album art (28px), title (11px), equalizer bars, play/pause
- **Behavioral**: Click expands AudioDeckExpandedCard, play/pause toggles playback
- **Dependencies**: useMusicStore, Dock
- **States**: IDLE, PLAYING (eq animated), PAUSED (eq frozen)
- **Responsive**: In dock ≥768px; 44px sticky bar <768px
- **Integration Target**: Layer 4 (within Dock)
- **Construction**: Reconstructed from Nidal reference
- **Confidence**: CONFIRMED

### AudioDeckExpandedCard
- **Source**: NIDAL
- **Purpose**: Full glassmorphic music player modal
- **Visual**: ~340×480px, blur(32px), rounded 20px, vinyl disc, controls, scrubber
- **Behavioral**: Track playback controls, progress scrubbing, volume, shuffle/repeat, queue
- **Dependencies**: useMusicStore, VinylDiscAssembly, AudioVisualizerCanvas, InteractiveScrubber, GlobalAudioManager
- **States**: Hidden, visible (with track sub-states)
- **Responsive**: Positioned above dock ≥768px; fullscreen bottom sheet <768px
- **Integration Target**: Layer 5 (z-[9992])
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### VinylDiscAssembly
- **Source**: NIDAL
- **Purpose**: Spinning vinyl disc with album art center label
- **Visual**: 200px diameter, concentric groove rings, 60px center label
- **Behavioral**: 360° spin (3s linear infinite) when playing, paused when paused, slide ejection on track change
- **Dependencies**: useMusicStore.status
- **States**: Spinning, paused, ejecting
- **Integration Target**: Layer 5 (within AudioDeck)
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### AudioVisualizerCanvas
- **Source**: NIDAL
- **Purpose**: Real-time FFT frequency visualization
- **Visual**: Full-width canvas, 60px height, frequency bars with track accent color
- **Behavioral**: 60fps requestAnimationFrame loop reading AnalyserNode FFT data
- **Dependencies**: useMusicStore.analyserNode
- **States**: Active (playing), frozen (paused), blank (idle)
- **Integration Target**: Layer 5
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### InteractiveScrubber
- **Source**: NIDAL
- **Purpose**: Progress bar with drag-to-seek and hover timestamps
- **Visual**: 4px track (6px hover), accent fill, 12px handle on hover
- **Behavioral**: Click/drag seeks, hover shows timestamp tooltip
- **Dependencies**: useMusicStore.currentTime/duration/seekTo
- **States**: Default, hovering (handle visible), seeking (dragging)
- **Integration Target**: Layer 5
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### MediaSessionController
- **Source**: NIDAL (logic module)
- **Purpose**: W3C Media Session API integration for OS-level media controls
- **Behavioral**: Sets metadata, binds play/pause/next/prev/seekto handlers
- **Dependencies**: useMusicStore
- **Integration Target**: Logic (no visual)
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### GlobalAudioManager
- **Source**: NIDAL + BASE (singleton)
- **Purpose**: Unified audio routing — single AudioContext, music + FX gain nodes, ducking
- **Behavioral**: Creates singleton AudioContext on first user interaction, routes music through musicGain, FX through fxGain, auto-ducks music on UI sound (20% over 40ms, restore over 250ms)
- **Dependencies**: None (other systems depend on it)
- **States**: Uninitialized, ready, ducked
- **Integration Target**: Logic (singleton)
- **Construction**: New (merges Nidal streaming + Base procedural FX)
- **Confidence**: CONFIRMED

### SoundSynthesizer
- **Source**: BASE (MODIFIED)
- **Purpose**: Procedural Web Audio FX for OS interactions
- **Behavioral**: Generates window open/close/minimize sounds, trash empty, error chimes
- **Dependencies**: GlobalAudioManager.fxGain (routes through FX bus, not own AudioContext)
- **States**: Ready, muted
- **Integration Target**: Logic
- **Construction**: Modified (output routing changed)
- **Confidence**: CONFIRMED

### TerminalApp
- **Source**: BASE
- **Purpose**: Interactive CLI with Neofetch, command parser, Easter eggs
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### ProjectsApp
- **Source**: BASE
- **Purpose**: Filterable project gallery with spotlight cards
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### AboutApp
- **Source**: BASE
- **Purpose**: Bio, career timeline, skill radar, PDF resume viewer
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### FinderApp
- **Source**: BASE
- **Purpose**: Virtual filesystem tree explorer with file preview
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### SettingsApp
- **Source**: BASE (MODIFIED)
- **Purpose**: OS customization — wallpaper, theme, dock size, magnification, sound FX, kinetic sensitivity
- **Behavioral**: Added controls for: dock magnification toggle, ambient mode sensitivity, music player preferences
- **Construction**: Modified (additional preference panels)
- **Confidence**: CONFIRMED

### MailApp
- **Source**: BASE
- **Purpose**: Contact form with validation and paper airplane animation
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### MobileBottomSheet
- **Source**: BASE
- **Purpose**: iOS-style 92vh modal sheet for mobile app display
- **Visual**: Full-width, `calc(100dvh - 96px)` height, grab handle, rounded top corners
- **Behavioral**: Swipe down >140px to dismiss, internal scroll doesn't trigger dismiss when scrollTop > 0
- **Responsive**: Active only <768px
- **Integration Target**: Mobile Layer
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### MobileStickyAudioBar
- **Source**: NIDAL
- **Purpose**: Slim music player bar on mobile
- **Visual**: 44px height, mini artwork, title, play/pause
- **Behavioral**: Tap to expand fullscreen player sheet
- **Responsive**: Active only <768px, positioned above MobileTabBar
- **Integration Target**: Mobile Layer
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### MobileStatusBar
- **Source**: BASE
- **Purpose**: Compact iOS-style status bar on mobile
- **Visual**: 40px height, time + battery indicators
- **Responsive**: Active only <768px
- **Integration Target**: Mobile Layer
- **Construction**: Reconstructed
- **Confidence**: CONFIRMED

### MobileTabBar
- **Source**: BASE + LUCA (MODIFIED)
- **Purpose**: Bottom tab navigation replacing dock on mobile
- **Visual**: 52px + env(safe-area-inset-bottom), 5 core tabs
- **Behavioral**: Single tap to open app, no magnification
- **Responsive**: Active only <768px
- **Integration Target**: Mobile Layer
- **Construction**: Modified
- **Confidence**: CONFIRMED

### useOSStore
- **Source**: BASE (MODIFIED)
- **Purpose**: Central Zustand store for window manager and desktop state
- **Behavioral**: Added `desktopMode: 'workspace' | 'ambient-hero'` and `setDesktopMode` action
- **Construction**: Modified (new state fields)
- **Confidence**: CONFIRMED

### useMusicStore
- **Source**: NIDAL
- **Purpose**: Zustand store for audio playback state and playlist
- **Construction**: New
- **Confidence**: CONFIRMED

### ShortcutRegistry
- **Source**: BASE (MODIFIED)
- **Purpose**: Global keyboard shortcut dispatcher
- **Behavioral**: Added Cmd+Option+M for ambient mode toggle
- **Construction**: Modified
- **Confidence**: CONFIRMED

### GestureEngine
- **Source**: BASE (MODIFIED)
- **Purpose**: Touch swipe, pointer events, gyroscope handler
- **Behavioral**: Added touch ripple (Michal mobile), gyroscope forwarding, music player swipe
- **Construction**: Modified
- **Confidence**: CONFIRMED

