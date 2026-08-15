# E2E Test Suite Mapping Specification: Tier 1 Feature & Visual Coverage
**Explorer 2 Analysis Report**  
**Milestone**: E2E Testing Track — Tier 1 Feature Coverage (90 Interaction Tests + 64 Visual Verification Rules)  
**Target Date**: 2026-08-15  
**Working Directory**: `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_2\`

---

## 1. Executive Summary & Architecture Overview

This document establishes the exhaustive, requirement-driven test specification mapping for Tier 1 Feature Coverage and Visual Conformance in the macOS-style portfolio desktop showcase. Every single interaction test case (#1 to #90) from `interaction-validation-matrix.md` and every single visual reference rule (#1 to #64) from `visual-reference-matrix.md` is mapped 1-to-1 to 11 discrete test suite files.

### 1.1 Test Suite Directory Layout & Scope Allocation

| Test File Path | Target System / Domain | Interaction Test Cases Covered | Visual Verification Rules Covered | Total Coverage Items |
|---|---|---|---|---|
| `tests/tier1-features/desktop.test.tsx` | Desktop Canvas, Icons, Grid, Marquee | #1, #2, #3, #4, #5, #6, #7 (7 tests) | #6, #7, #8, #9 (4 rules) | 11 items |
| `tests/tier1-features/windows.test.tsx` | Window Manager, WindowFrame, TrafficLights, Drag/Resize, Cascade | #8, #9, #10, #11, #12, #13, #14, #15, #16, #17, #18, #19, #20, #21, #22, #23, #24 (17 tests) | #10, #11, #12, #13, #14, #15, #16, #17, #18, #19, #20, #21, #22, #23 (14 rules) | 31 items |
| `tests/tier1-features/dock.test.tsx` | Luca Parabolic Dock, Magnification, Active Dots, Tooltips | #25, #26, #27, #28, #29, #30, #31, #32, #33, #34, #35, #36 (12 tests) | #24, #25, #26, #27, #28, #29, #30, #31, #32, #33, #34 (11 rules) | 23 items |
| `tests/tier1-features/music.test.tsx` | Music Player Pill, Audio Deck Expanded, Vinyl, Scrubber, Controls | #37, #38, #39, #40, #41, #42, #43, #44, #45, #46, #47, #48, #49, #50, #51, #52, #53 (17 tests) | #35, #36, #37, #38, #39, #40, #41, #42, #43, #44, #45 (11 rules) | 28 items |
| `tests/tier1-features/typography.test.tsx` | Kinetic Hero Stage, SplitText, Euler Physics, Ambient Wave | #61, #62, #63, #64, #65, #66, #67, #68 (8 tests) | #46, #47, #48, #49, #50, #51, #52 (7 rules) | 15 items |
| `tests/tier1-features/cursor.test.tsx` | Dual-Tier Kinetic Cursor, Precision Dot, Aura Ring, FSM | #54, #55, #56, #57, #58, #59, #60 (7 tests) | #53, #54, #55, #56, #57, #58 (6 rules) | 13 items |
| `tests/tier1-features/shortcuts.test.tsx` | Shortcut Registry, Keyboard Combos (Spotlight, Window, Theme, Mode) | #69, #70, #71, #72, #73, #74 (6 tests) | — (Covered in functional flows) | 6 items |
| `tests/tier1-features/mobile.test.tsx` | Mobile Bottom Sheets, Tab Bar, Sticky Audio Bar, Touch Gestures | #75, #76, #77, #78, #79, #80, #81, #82, #83, #84 (10 tests) | #60, #61, #62, #63, #64 (5 rules) | 15 items |
| `tests/tier1-features/audio-ducking.test.tsx` | GlobalAudioManager, SoundSynthesizer FX, Web Audio Ducking Pipeline | #85, #86 (2 tests) | — (Verified via Web Audio GainNode params) | 2 items |
| `tests/tier1-features/persistence.test.tsx` | LocalStorage State Persistence (Theme, Wallpaper, Music, Volume) | #87, #88, #89, #90 (4 tests) | #59 (1 rule) | 5 items |
| `tests/visual-conformance/chrome.test.tsx` | Core OS Chrome, Top Menu Bar, Glassmorphism, Status Tray, Clock | — | #1, #2, #3, #4, #5 (5 rules) | 5 items |
| **TOTALS** | **11 Test Files** | **90 Interaction Tests (100%)** | **64 Visual Verification Rules (100%)** | **154 Total Test Specs** |

---

## 2. Complete Master Traceability Matrix (154 Specifications)

### 2.1 Interaction Test Cases (#1 to #90)

| Interaction # | Test Case Description | Target Test File | Test Suite `describe` / `it` Name | Input Simulation | State & DOM Assertions |
|---|---|---|---|---|---|
| **#1** | Click empty desktop clears selection & menus | `desktop.test.tsx` | `describe('Desktop Interactions') -> it('clears selections and dismisses context menu on empty click')` | `fireEvent.click(desktopCanvas)` | `selectedIconIds.length === 0`, `queryByTestId('context-menu') === null` |
| **#2** | Right-click desktop opens context menu | `desktop.test.tsx` | `describe('Desktop Interactions') -> it('opens context menu at clamped coordinates on right click')` | `fireEvent.contextMenu(desktopCanvas, { clientX: 300, clientY: 200 })` | `getByTestId('context-menu')` visible, style `top: 200px; left: 300px`, menu items rendered |
| **#3** | Selection marquee rectangle on drag | `desktop.test.tsx` | `describe('Desktop Marquee') -> it('renders marquee selection rectangle following pointer drag')` | `fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 })`, `fireEvent.pointerMove(window, { clientX: 250, clientY: 220 })` | `getByTestId('selection-marquee')` visible with `left: 100px; top: 100px; width: 150px; height: 120px` |
| **#4** | Marquee multi-select intersecting icons | `desktop.test.tsx` | `describe('Desktop Marquee') -> it('multi-selects intersecting icons and highlights background')` | `fireEvent.pointerDown(canvas, { clientX: 20, clientY: 20 })`, `pointerMove(window, { clientX: 200, clientY: 300 })` | Intersecting `DesktopIcon` elements have `aria-selected="true"` and class `bg-white/15` |
| **#5** | Double-click icon opens app window | `desktop.test.tsx` | `describe('Desktop App Launch') -> it('launches app window on double click with focus')` | `fireEvent.doubleClick(getByTestId('desktop-icon-terminal'))` | `useOSStore.getState().windows['terminal'].isOpen === true`, `activeWindowId === 'terminal'`, `getByTestId('window-terminal')` in DOM |
| **#6** | Single-click icon selects without launch | `desktop.test.tsx` | `describe('Desktop App Launch') -> it('selects icon on single click without launching window after debounce')` | `fireEvent.click(getByTestId('desktop-icon-projects'))`, `vi.advanceTimersByTime(350)` | `getByTestId('desktop-icon-projects')` has `aria-selected="true"`, `windows['projects'].isOpen === false` |
| **#7** | Desktop icon hover grow and highlight | `desktop.test.tsx` | `describe('Desktop Icon Visuals') -> it('scales to 1.05x and applies highlight background on hover')` | `fireEvent.pointerEnter(getByTestId('desktop-icon-about'))` | Icon container computed style `transform` contains `scale(1.05)`, background contains `rgba(255, 255, 255, 0.15)` |
| **#8** | Open window with scale/opacity spring | `windows.test.tsx` | `describe('Window Lifecycle') -> it('animates window entrance with spring scale and opacity')` | `useOSStore.getState().openWindow('terminal')` | `getByTestId('window-terminal')` rendered with `opacity: 1`, `transform: scale(1)`, `zIndex >= 20` |
| **#9** | Close window via red traffic light | `windows.test.tsx` | `describe('Window Controls') -> it('closes window and removes from DOM on red traffic light click')` | `fireEvent.click(getByTestId('traffic-light-close-terminal'))` | `useOSStore.getState().windows['terminal'].isOpen === false`, element removed after 180ms transition |
| **#10** | Close window via Cmd+W | `windows.test.tsx` | `describe('Window Controls') -> it('closes active window on Cmd+W and shifts focus')` | `fireEvent.keyDown(window, { key: 'w', metaKey: true })` | Active window closes, next top z-index window becomes `activeWindowId` |
| **#11** | Minimize window via yellow traffic light | `windows.test.tsx` | `describe('Window Controls') -> it('minimizes window to dock on yellow traffic light click')` | `fireEvent.click(getByTestId('traffic-light-minimize-terminal'))` | `useOSStore.getState().windows['terminal'].isMinimized === true`, `window-terminal` hidden (`display: none` or scale-down) |
| **#12** | Minimize window via Cmd+M | `windows.test.tsx` | `describe('Window Controls') -> it('minimizes focused window on Cmd+M')` | `fireEvent.keyDown(window, { key: 'm', metaKey: true })` | `windows['terminal'].isMinimized === true` |
| **#13** | Maximize window via green traffic light | `windows.test.tsx` | `describe('Window Controls') -> it('maximizes window to full viewport minus top menu bar on green traffic light')` | `fireEvent.click(getByTestId('traffic-light-maximize-terminal'))` | `windows['terminal'].isMaximized === true`, window style `top: 28px; left: 0px; width: 100vw; height: calc(100vh - 28px)`, `border-radius: 0px` |
| **#14** | Un-maximize window returns to previous bounds | `windows.test.tsx` | `describe('Window Controls') -> it('restores previous bounds and 12px radius when un-maximizing')` | `fireEvent.click(getByTestId('traffic-light-maximize-terminal'))` (second click) | `windows['terminal'].isMaximized === false`, position/size match `prevBounds`, `border-radius: 12px` |
| **#15** | Double-click window header toggles maximize | `windows.test.tsx` | `describe('Window Header') -> it('toggles maximize on header double click')` | `fireEvent.doubleClick(getByTestId('window-header-terminal'))` | `windows['terminal'].isMaximized` toggles `false -> true -> false` |
| **#16** | Drag window header updates position | `windows.test.tsx` | `describe('Window Dragging') -> it('updates window coordinates following header drag gesture')` | `fireEvent.pointerDown(header, { clientX: 200, clientY: 100 })`, `pointerMove(window, { clientX: 350, clientY: 250 })` | `windows['terminal'].position` updates to `{ x: 250 + offset.x, y: 250 + offset.y }` |
| **#17** | Drag clamp Y enforces menu bar clearance | `windows.test.tsx` | `describe('Window Dragging') -> it('clamps window Y position to at least y=28px')` | `fireEvent.pointerDown(header, { clientX: 200, clientY: 50 })`, `pointerMove(window, { clientX: 200, clientY: 5 })` | Window position `y >= 28`, cannot overlap menu bar (`top >= 28px`) |
| **#18** | Drag overhang preserves 100px visible bounds | `windows.test.tsx` | `describe('Window Dragging') -> it('maintains 100px overhang minimum visibility when dragged offscreen')` | `pointerMove(window, { clientX: window.innerWidth + 200, clientY: 400 })` | Window position `x <= window.innerWidth - 100`, `x >= -(window.width - 100)` |
| **#19** | Resize window via SE corner handle | `windows.test.tsx` | `describe('Window Resizing') -> it('resizes window width and height from bottom-right handle')` | `fireEvent.pointerDown(handleSE, { clientX: 500, clientY: 400 })`, `pointerMove(window, { clientX: 650, clientY: 550 })` | `windows['terminal'].size.width === 550`, `size.height === 450`, cursor is `nwse-resize` |
| **#20** | Enforce minimum window size (360×240px) | `windows.test.tsx` | `describe('Window Resizing') -> it('clamps window dimensions to minimum 360x240px')` | `fireEvent.pointerDown(handleSE, { clientX: 400, clientY: 300 })`, `pointerMove(window, { clientX: 50, clientY: 50 })` | `windows['terminal'].size.width >= 360`, `size.height >= 240` |
| **#21** | Focus window on click bumps zIndex & active shadow | `windows.test.tsx` | `describe('Window Focus') -> it('elevates clicked window to highest z-index and applies active deep shadow')` | `fireEvent.pointerDown(getByTestId('window-projects'))` | `activeWindowId === 'projects'`, `windows['projects'].zIndex > windows['terminal'].zIndex`, shadow matches `--os-shadow-window-active` |
| **#22** | Cascade spawn offsets multiple windows by 24px | `windows.test.tsx` | `describe('Window Cascade') -> it('offsets successively opened windows by 24px cascade delta')` | `openWindow('terminal')`, `openWindow('finder')`, `openWindow('about')` | `finder.pos.x === terminal.pos.x + 24`, `about.pos.x === finder.pos.x + 24`, `y` similarly offset by 24px |
| **#23** | Traffic lights show gray dots when unfocused | `windows.test.tsx` | `describe('Traffic Lights') -> it('renders gray muted dots when window loses focus')` | Focus different window or desktop | Unfocused window traffic light circles have class `bg-stone-500/40` or gray tokens, no vibrant red/yellow/green |
| **#24** | Traffic lights reveal ✕ − ⤢ glyphs on hover | `windows.test.tsx` | `describe('Traffic Lights') -> it('shows control glyphs on traffic lights group hover')` | `fireEvent.pointerEnter(getByTestId('traffic-lights-group-terminal'))` | Glyphs `✕`, `−`, `⤢` become visible (opacity: 1) inside respective circles |
| **#25** | Dock magnification Cosine Bell curve | `dock.test.tsx` | `describe('Dock Magnification') -> it('scales icons according to Cosine Bell proximity formula')` | `fireEvent.pointerMove(dockChassis, { clientX: iconCenter.x, clientY: iconCenter.y })` | Center icon width/height scales to 68px, adjacent icons scale according to $W(d) = 44 + 24 \cdot \frac{1+\cos(\pi d / 150)}{2}$ |
| **#26** | Dock mouse leave springs back to 44px | `dock.test.tsx` | `describe('Dock Magnification') -> it('restores all icon dimensions to 44px on mouse leave')` | `fireEvent.pointerLeave(dockChassis)` | All `DockItem` widths/heights return to 44px |
| **#27** | Dock click closed app launches with bounce | `dock.test.tsx` | `describe('Dock Item Actions') -> it('opens app and triggers bounce animation on closed app click')` | `fireEvent.click(getByTestId('dock-item-settings'))` | `windows['settings'].isOpen === true`, dock icon has bounce animation class/keyframes |
| **#28** | Dock click open unfocused app focuses window | `dock.test.tsx` | `describe('Dock Item Actions') -> it('focuses and raises open window to front on dock click')` | `fireEvent.click(getByTestId('dock-item-terminal'))` | `activeWindowId === 'terminal'`, window zIndex elevated |
| **#29** | Dock click minimized app restores window | `dock.test.tsx` | `describe('Dock Item Actions') -> it('un-minimizes and restores window on dock click')` | `fireEvent.click(getByTestId('dock-item-finder'))` | `windows['finder'].isMinimized === false`, window visible in viewport |
| **#30** | Dock press squash to 0.88x | `dock.test.tsx` | `describe('Dock Physics') -> it('squashes icon to scale 0.88 on pointer down')` | `fireEvent.pointerDown(getByTestId('dock-item-mail'))` | Icon container transform contains `scale(0.88)` |
| **#31** | Dock press release recovers to 1.0x | `dock.test.tsx` | `describe('Dock Physics') -> it('springs back to normal scale on pointer up')` | `fireEvent.pointerUp(getByTestId('dock-item-mail'))` | Icon scale returns to 1.0x (or magnified scale if hovered) |
| **#32** | Dock tooltip appears above hovered icon | `dock.test.tsx` | `describe('Dock Tooltip') -> it('displays animated label pill above hovered dock icon')` | `fireEvent.pointerEnter(getByTestId('dock-item-projects'))` | `getByRole('tooltip')` rendered containing "Projects", positioned above icon |
| **#33** | Dock tooltip dismisses on mouse exit | `dock.test.tsx` | `describe('Dock Tooltip') -> it('fades out tooltip when pointer leaves icon')` | `fireEvent.pointerLeave(getByTestId('dock-item-projects'))` | Tooltip element unmounts / fades out |
| **#34** | Active dot visible below open app | `dock.test.tsx` | `describe('Dock Active Dots') -> it('renders 3px glowing dot below open app icon')` | `openWindow('terminal')` | `getByTestId('dock-dot-terminal')` present with width 3px, height 3px, opacity 0.85 |
| **#35** | Active dot dims when app is minimized | `dock.test.tsx` | `describe('Dock Active Dots') -> it('dims active dot opacity when app is minimized')` | `minimizeWindow('terminal')` | `getByTestId('dock-dot-terminal')` has class `opacity-40` / reduced opacity |
| **#36** | Active dot removed when app is closed | `dock.test.tsx` | `describe('Dock Active Dots') -> it('removes active dot when app window is closed')` | `closeWindow('terminal')` | `queryByTestId('dock-dot-terminal') === null` |
| **#37** | Music player IDLE on page load (no autoplay) | `music.test.tsx` | `describe('Music Playback Initialization') -> it('initializes in IDLE state with audio paused and no autoplay')` | Mount component | `useMusicStore.getState().status === 'idle'`, audio element paused, play icon visible |
| **#38** | First play click creates AudioContext & plays | `music.test.tsx` | `describe('Music Playback Controls') -> it('resumes AudioContext, sets status playing, and starts audio on play click')` | `fireEvent.click(getByTestId('music-play-btn'))` | `GlobalAudioManager.getInstance().context.state === 'running'`, `status === 'playing'`, EQ bars animated |
| **#39** | Pause music freezes playback and visuals | `music.test.tsx` | `describe('Music Playback Controls') -> it('pauses audio, sets status paused, and freezes visualizer/vinyl')` | `fireEvent.click(getByTestId('music-pause-btn'))` | `status === 'paused'`, `audioElement.paused === true`, vinyl rotation class paused |
| **#40** | Resume music continues from current position | `music.test.tsx` | `describe('Music Playback Controls') -> it('resumes playback from paused timestamp')` | `fireEvent.click(getByTestId('music-play-btn'))` | `status === 'playing'`, `currentTime` preserved without resetting |
| **#41** | Next track advances playlist and loads metadata | `music.test.tsx` | `describe('Track Navigation') -> it('advances to next track in playlist and updates title/artist')` | `fireEvent.click(getByTestId('music-next-btn'))` | `currentIndex === 1`, title/artist DOM text matches `playlist[1]` |
| **#42** | Prev track (>3s) restarts current track | `music.test.tsx` | `describe('Track Navigation') -> it('restarts current track from beginning if currentTime >= 3s')` | `seekTo(15)`, `fireEvent.click(getByTestId('music-prev-btn'))` | `currentIndex === 1`, `currentTime === 0`, `audioElement.currentTime === 0` |
| **#43** | Prev track (<3s) loads previous track | `music.test.tsx` | `describe('Track Navigation') -> it('loads previous track if currentTime < 3s')` | `seekTo(1.5)`, `fireEvent.click(getByTestId('music-prev-btn'))` | `currentIndex === 0`, metadata updates to `playlist[0]` |
| **#44** | Expand audio deck from dock pill | `music.test.tsx` | `describe('Audio Deck Presentation') -> it('expands full glassmorphic audio deck on pill click')` | `fireEvent.click(getByTestId('music-player-pill'))` | `useMusicStore.getState().isDeckExpanded === true`, `getByTestId('audio-deck-expanded')` rendered |
| **#45** | Collapse audio deck | `music.test.tsx` | `describe('Audio Deck Presentation') -> it('collapses audio deck back into dock pill')` | `fireEvent.click(getByTestId('audio-deck-collapse-btn'))` | `isDeckExpanded === false`, deck element exits with fade/translate |
| **#46** | Scrubber seek updates currentTime | `music.test.tsx` | `describe('Interactive Scrubber') -> it('seeks audio position on progress bar drag/click')` | `fireEvent.click(scrubberTrack, { clientX: 100 })` (50% position) | `currentTime === duration * 0.5`, `audioElement.currentTime` updated |
| **#47** | Volume slider updates gain | `music.test.tsx` | `describe('Volume Control') -> it('updates volume state and audio gain on slider input')` | `fireEvent.change(volumeSlider, { target: { value: 0.35 } })` | `useMusicStore.getState().volume === 0.35`, `GlobalAudioManager.getInstance().musicGainNode.gain.value === 0.35` |
| **#48** | Mute toggle mutes and restores volume | `music.test.tsx` | `describe('Volume Control') -> it('toggles mute state and updates speaker icon')` | `fireEvent.click(getByTestId('music-mute-btn'))` | `isMuted === true`, effective gain is 0; clicking again restores `volume` |
| **#49** | Shuffle button toggles playlist randomization | `music.test.tsx` | `describe('Playback Modes') -> it('toggles shuffle mode and tints button')` | `fireEvent.click(getByTestId('music-shuffle-btn'))` | `useMusicStore.getState().isShuffled === true`, shuffle button has active accent tint |
| **#50** | Repeat button cycles off -> all -> one -> off | `music.test.tsx` | `describe('Playback Modes') -> it('cycles repeat mode through off, all, one, and off')` | `fireEvent.click(repeatBtn)` (x3) | `repeatMode` transitions `'off' -> 'all' -> 'one' -> 'off'`, icons update |
| **#51** | Vinyl disc rotates at 3s period when playing | `music.test.tsx` | `describe('Vinyl Assembly') -> it('applies continuous 3s rotation when playing and pauses on pause')` | `play()`, then `pause()` | Playing: `animation: spin 3s linear infinite`; Paused: `animation-play-state: paused` |
| **#52** | Track end auto-advances to next track | `music.test.tsx` | `describe('Track End Flow') -> it('auto-advances to next track when playback reaches end')` | `fireEvent.ended(audioElement)` | `currentIndex` increments from 0 to 1, next track begins playing |
| **#53** | Repeat one loops same track on ended | `music.test.tsx` | `describe('Track End Flow') -> it('restarts same track when repeatMode is one on track end')` | `setRepeatMode('one')`, `fireEvent.ended(audioElement)` | `currentIndex` stays at 0, `currentTime` resets to 0, playback continues |
| **#54** | Precision dot zero-latency tracking | `cursor.test.tsx` | `describe('Precision Dot') -> it('positions 4px dot immediately at cursor coordinates')` | `fireEvent.pointerMove(window, { clientX: 450, clientY: 320 })` | `getByTestId('cursor-precision-dot')` has `transform: translate3d(450px, 320px, 0)` |
| **#55** | Aura ring lerp follow lag | `cursor.test.tsx` | `describe('Aura Ring Follow') -> it('follows precision dot with lerp interpolation lag')` | `pointerMove(window, { clientX: 800, clientY: 600 })`, advance 1 frame (16ms) | Aura ring position is interpolated between old position and (800, 600) via $\lambda = 0.15$ |
| **#56** | Aura velocity expansion (24px to 80px) | `cursor.test.tsx` | `describe('Aura Velocity Dynamics') -> it('expands aura ring diameter up to 80px under high velocity')` | Rapid successive pointerMove events ($\Delta x = 100\text{px}/16\text{ms}$) | `getByTestId('cursor-aura-ring')` width/height increases from 24px to ~60-80px |
| **#57** | Aura difference blend mode | `cursor.test.tsx` | `describe('Aura Visual Blend') -> it('applies mix-blend-mode difference for color inversion')` | Inspect aura element style | `getByTestId('cursor-aura-ring')` has computed style `mix-blend-mode: difference` |
| **#58** | Aura collapse over resize handle | `cursor.test.tsx` | `describe('Cursor FSM Variants') -> it('collapses aura ring over resize handle and restores native cursor')` | `fireEvent.pointerEnter(resizeHandle)` (`data-cursor="precision-drag"`) | Cursor state `variant === 'precision-drag'`, aura ring style `transform: scale(0)` |
| **#59** | Aura magnetic morph over dock item | `cursor.test.tsx` | `describe('Cursor FSM Variants') -> it('morphs aura into squircle and snaps to dock item')` | `fireEvent.pointerEnter(dockItem)` (`data-cursor="magnetic-dock"`) | Cursor state `variant === 'magnetic-dock'`, aura radius matches dock item bounding box |
| **#60** | Cursor elements hidden on mobile/touch | `cursor.test.tsx` | `describe('Mobile Cursor Suppression') -> it('does not render cursor dot and aura when pointer is coarse')` | Mock `@media (pointer: coarse)` | `queryByTestId('cursor-precision-dot') === null`, `queryByTestId('cursor-aura-ring') === null` |
| **#61** | Kinetic typography character displacement | `typography.test.tsx` | `describe('Euler ODE Physics') -> it('displaces characters within 260px proximity by up to 65px')` | `pointerMove(stage, { clientX: charPos.x, clientY: charPos.y })` | Target character span transform `translate3d(dx, dy, 0)` with $\sqrt{dx^2+dy^2} > 0$ and $\le 65\text{px}$ |
| **#62** | Spring return with underdamped oscillation | `typography.test.tsx` | `describe('Euler ODE Physics') -> it('returns characters with underdamped spring overshoot')` | Move pointer away, step animation frames | Character displacement passes through 0 (overshoot) before settling ($\zeta \approx 0.717$) |
| **#63** | Gaussian falloff displacement curve | `typography.test.tsx` | `describe('Euler ODE Physics') -> it('applies Gaussian decay to displacement based on distance')` | Pointer at $(x_0, y_0)$; measure char at $d=50\text{px}$ vs $d=200\text{px}$ | Displacement at 50px is exponentially larger than displacement at 200px |
| **#64** | Variable font weight modulation (400->900) | `typography.test.tsx` | `describe('Variable Font Weight') -> it('increases font-weight variable axis from 400 to 900 near cursor')` | Pointer near character | Character span computed style `font-variation-settings` contains `'wght' 800` or higher |
| **#65** | Workspace mode dims hero text to 35% | `typography.test.tsx` | `describe('Desktop Modes') -> it('reduces hero text opacity to 0.35 when windows are open in workspace mode')` | `useOSStore.getState().openWindow('terminal')` | `getByTestId('kinetic-hero-stage')` computed opacity is `0.35` |
| **#66** | Ambient mode restores hero text to 100% | `typography.test.tsx` | `describe('Desktop Modes') -> it('fades windows and sets hero text opacity to 1.0 in ambient mode')` | `useOSStore.getState().setDesktopMode('ambient-hero')` | `getByTestId('kinetic-hero-stage')` opacity is `1.0`, windows container has `opacity: 0` |
| **#67** | Ambient harmonic wave idle oscillation | `typography.test.tsx` | `describe('Ambient Wave') -> it('oscillates character positions via sinusoidal wave during idle')` | Cursor idle offscreen, advance time by 1000ms | Character spans exhibit subtle phase-shifted sine wave vertical/horizontal displacement |
| **#68** | 60fps physics execution without React render lag | `typography.test.tsx` | `describe('Performance Physics Loop') -> it('updates transforms directly on RAF loop without triggering React component re-renders')` | Simulate 60 pointer moves in 1 second | React render count on `KineticHeroStage` remains 1 while characters animate |
| **#69** | Cmd+K opens Spotlight search | `shortcuts.test.tsx` | `describe('Keyboard Shortcuts') -> it('opens Spotlight search modal and focuses input on Cmd+K')` | `fireEvent.keyDown(window, { key: 'k', metaKey: true })` | `useOSStore.getState().spotlightOpen === true`, `getByPlaceholderText(/Search/i)` is focused |
| **#70** | Escape dismisses Spotlight search | `shortcuts.test.tsx` | `describe('Keyboard Shortcuts') -> it('dismisses Spotlight modal on Escape')` | `fireEvent.keyDown(window, { key: 'Escape' })` | `useOSStore.getState().spotlightOpen === false`, spotlight modal unmounted |
| **#71** | Cmd+W closes active window | `shortcuts.test.tsx` | `describe('Keyboard Shortcuts') -> it('closes currently focused window on Cmd+W')` | `focusWindow('terminal')`, `keyDown(window, { key: 'w', metaKey: true })` | `windows['terminal'].isOpen === false` |
| **#72** | Cmd+M minimizes active window | `shortcuts.test.tsx` | `describe('Keyboard Shortcuts') -> it('minimizes currently focused window on Cmd+M')` | `focusWindow('finder')`, `keyDown(window, { key: 'm', metaKey: true })` | `windows['finder'].isMinimized === true` |
| **#73** | Cmd+Shift+D toggles theme | `shortcuts.test.tsx` | `describe('Keyboard Shortcuts') -> it('toggles theme dark/light on Cmd+Shift+D')` | `keyDown(window, { key: 'd', metaKey: true, shiftKey: true })` | `theme` toggles `'dark' <-> 'light'`, document root class updates |
| **#74** | Cmd+Option+M toggles ambient mode | `shortcuts.test.tsx` | `describe('Keyboard Shortcuts') -> it('toggles desktopMode on Cmd+Option+M')` | `keyDown(window, { key: 'm', metaKey: true, altKey: true })` | `desktopMode` toggles `'workspace' <-> 'ambient-hero'` |
| **#75** | Mobile viewport transforms windows to 92vh sheets | `mobile.test.tsx` | `describe('Mobile Window Transformation') -> it('renders open windows as 92vh bottom sheets when viewport < 768px')` | Set viewport width to 390px, open 'about' | `getByTestId('mobile-bottom-sheet-about')` present with `height: 92vh; width: 100vw; border-top-left-radius: 16px` |
| **#76** | Sheet swipe down >140px dismisses | `mobile.test.tsx` | `describe('Mobile Sheet Gestures') -> it('dismisses sheet when dragged down beyond 140px threshold')` | `touchStart(handle, { y: 100 })`, `touchMove(handle, { y: 260 })`, `touchEnd()` | `windows['about'].isOpen === false`, sheet dismissed |
| **#77** | Sheet swipe down <140px cancels and springs back | `mobile.test.tsx` | `describe('Mobile Sheet Gestures') -> it('restores sheet to 92vh when swipe down is under 140px threshold')` | `touchStart(handle, { y: 100 })`, `touchMove(handle, { y: 180 })`, `touchEnd()` | `windows['about'].isOpen === true`, sheet translateY returns to 0 |
| **#78** | Sheet scroll protection when scrollTop > 0 | `mobile.test.tsx` | `describe('Mobile Sheet Gestures') -> it('prevents swipe-to-dismiss when sheet content is scrolled down')` | `content.scrollTop = 50`, `touchStart(content, { y: 200 })`, `touchMove(content, { y: 360 })` | Sheet dismiss NOT triggered; internal scroll handles movement |
| **#79** | Mobile bottom tab bar visible on small screen | `mobile.test.tsx` | `describe('Mobile Navigation') -> it('renders 52px fixed bottom tab bar on mobile viewport')` | Set viewport width to 390px | `getByTestId('mobile-tab-bar')` visible with height 52px + safe-area |
| **#80** | Mobile sticky audio bar rendered above tab bar | `mobile.test.tsx` | `describe('Mobile Audio Bar') -> it('renders 44px sticky audio bar above tab bar when audio loaded')` | Load music track on 390px viewport | `getByTestId('mobile-sticky-audio-bar')` visible at `bottom: calc(52px + env(safe-area-inset-bottom))` |
| **#81** | Mobile audio bar tap expands fullscreen player | `mobile.test.tsx` | `describe('Mobile Audio Bar') -> it('opens fullscreen player bottom sheet on sticky bar tap')` | `fireEvent.click(getByTestId('mobile-sticky-audio-bar'))` | Full player sheet opens with vinyl, transport controls, and volume |
| **#82** | Parabolic dock hidden on mobile | `mobile.test.tsx` | `describe('Mobile Layout Constraints') -> it('hides desktop floating dock on mobile screens')` | Viewport < 768px | `queryByTestId('desktop-dock') === null` |
| **#83** | Desktop icon grid hidden on mobile | `mobile.test.tsx` | `describe('Mobile Layout Constraints') -> it('hides desktop icon grid on mobile screens')` | Viewport < 768px | `queryByTestId('desktop-grid') === null` |
| **#84** | Single-tap launches app from tab bar | `mobile.test.tsx` | `describe('Mobile Tab Bar Actions') -> it('launches app bottom sheet on single tap without double-click')` | `fireEvent.click(getByTestId('tab-bar-item-projects'))` | `windows['projects'].isOpen === true`, sheet appears immediately |
| **#85** | Music ducks to 20% over 40ms on UI sound | `audio-ducking.test.tsx` | `describe('Audio Ducking Pipeline') -> it('ducks music gain to 0.20 over 40ms and restores over 250ms on UI sound')` | `playMusic()`, `GlobalAudioManager.getInstance().playFx('window-open')` | `musicGainNode.gain.setValueAtTime` called with 0.20 at t+0.04s, and 1.0 at t+0.29s |
| **#86** | No ducking or audio errors when music is idle | `audio-ducking.test.tsx` | `describe('Audio Ducking Pipeline') -> it('plays UI sound at normal fx gain without errors when music is idle')` | `musicStore.status = 'idle'`, `playFx('click')` | SoundSynthesizer triggers buffer playback on fxGainNode; no ducking ramp scheduled |
| **#87** | Theme persists across reload | `persistence.test.tsx` | `describe('State Persistence') -> it('persists theme selection in localStorage and restores on mount')` | `setTheme('dark')`, unmount, remount | `localStorage.getItem('os-theme') === 'dark'`, store initializes with `'dark'` |
| **#88** | Wallpaper selection persists across reload | `persistence.test.tsx` | `describe('State Persistence') -> it('persists selected wallpaperId and restores on mount')` | `setWallpaper('ventura-light')`, remount | `localStorage.getItem('os-wallpaper') === 'ventura-light'`, wallpaper rendered |
| **#89** | Music currentTime position persists (within +-5s) | `persistence.test.tsx` | `describe('State Persistence') -> it('persists music playback timestamp and restores on reload')` | `seekTo(120)`, unmount, remount | `localStorage.getItem('music-current-time') === '120'`, initial `currentTime` within 115-125s |
| **#90** | Music volume persists across reload | `persistence.test.tsx` | `describe('State Persistence') -> it('persists music volume level and restores on mount')` | `setVolume(0.42)`, unmount, remount | `localStorage.getItem('music-volume') === '0.42'`, `store.volume === 0.42` |

---

### 2.2 Visual Verification Rules (#1 to #64)

| Visual # | Visual Rule / Feature | Priority | Target Test File | Test Suite `describe` / `it` Name | Visual & DOM Assertion Criteria |
|---|---|---|---|---|---|
| **#1** | Menu bar height exactly 28px | **P0** | `chrome.test.tsx` | `describe('TopMenuBar Visual Conformance') -> it('verifies fixed height of exactly 28px')` | `getByTestId('top-menu-bar')` has computed style `height: 28px`, class contains `h-[28px]` or `fixed top-0` |
| **#2** | Menu bar glassmorphism blur(40px) | **P0** | `chrome.test.tsx` | `describe('TopMenuBar Visual Conformance') -> it('verifies backdrop-filter blur(40px) and tokenized opacity')` | Style includes `backdrop-filter: blur(40px)` (or `backdrop-blur-2xl`), background `rgba(26,26,26,0.65)` (dark) / `rgba(255,255,255,0.72)` (light) |
| **#3** | Menu bar clock format (Day Mon DD H:MM AM/PM) | **P1** | `chrome.test.tsx` | `describe('TopMenuBar Visual Conformance') -> it('formats clock string as Day Mon DD H:MM AM/PM')` | `getByTestId('menu-bar-clock').textContent` matches regex `/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2}\s\d{1,2}:\d{2}\s(AM|PM)$/` |
| **#4** | Menu bar dynamic app name updates on active window | **P0** | `chrome.test.tsx` | `describe('TopMenuBar Visual Conformance') -> it('renders active application title in bold 12.5px font')` | `getByTestId('menu-bar-active-app').textContent === 'Terminal'`, style `font-weight: 600; font-size: 12.5px` |
| **#5** | Status tray icons (Wi-Fi, Battery, Volume) 16x16 with 10px gap | **P1** | `chrome.test.tsx` | `describe('TopMenuBar Visual Conformance') -> it('renders status icons at 16x16px with 10px flex gap')` | Status SVGs have `width: 16px; height: 16px`, container has `gap: 10px` or `space-x-[10px]` |
| **#6** | Desktop background full-bleed object-cover | **P0** | `desktop.test.tsx` | `describe('Desktop Visual Conformance') -> it('renders full-bleed wallpaper with object-cover and tint')` | Wallpaper image/container has `inset-0`, `w-full h-full`, `object-fit: cover`, overlay `rgba(0,0,0,0.15)` |
| **#7** | Desktop icon grid column-first flow | **P0** | `desktop.test.tsx` | `describe('Desktop Visual Conformance') -> it('organizes icons in column-first grid with 92px cols and 104px rows')` | Grid container has CSS `grid-auto-flow: column`, `grid-template-columns: repeat(..., 92px)`, `grid-template-rows: repeat(..., 104px)` |
| **#8** | Desktop icon appearance (48x48, 11px white label, shadow, 2-line clamp) | **P1** | `desktop.test.tsx` | `describe('Desktop Visual Conformance') -> it('styles icon 48x48 with 11px text-shadowed 2-line clamped label')` | Icon image has `width: 48px; height: 48px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35))`, label has `font-size: 11px; max-width: 84px; line-clamp: 2` |
| **#9** | Desktop icon hover scale 1.05x & 150ms transition | **P1** | `desktop.test.tsx` | `describe('Desktop Visual Conformance') -> it('applies 150ms transition with scale 1.05x and white/15 highlight')` | Hover class includes `transition-transform duration-150`, `hover:scale-105`, `hover:bg-white/15` |
| **#10** | Window border radius 12px rounded (0px maximized) | **P0** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('enforces 12px radius when floating and 0px when maximized')` | Floating: `border-radius: 12px` (`rounded-xl`); Maximized: `border-radius: 0px` (`rounded-none`) |
| **#11** | Window glassmorphism blur(28px) saturate(180%) | **P0** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('applies blur(28px) saturate(180%) and theme background opacity')` | Window frame has `backdrop-filter: blur(28px) saturate(180%)`, Dark body: `rgba(24,24,28,0.95)`, Light body: `rgba(255,255,255,0.96)` |
| **#12** | Traffic light buttons 12px circles with RGB colors and 8px gap | **P0** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('renders 12px circles with #FF5F56, #FFBD2E, #27C93F and 8px gap')` | Red: `#FF5F56`, Yellow: `#FFBD2E`, Green: `#27C93F`, circle dimensions `12px × 12px`, container flex gap `8px` |
| **#13** | Traffic light hover glyphs (✕ − ⤢) on group hover | **P1** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('displays crisp glyphs in matching contrast on hover')` | Hovering group reveals glyph SVGs/symbols inside buttons with contrast text color |
| **#14** | Traffic lights unfocused gray dots | **P1** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('renders monochromatic gray dots when window is unfocused')` | When `isFocused === false`, button colors match `rgba(120,120,120,0.4)` / `bg-stone-500/40` |
| **#15** | Window active deep shadow | **P0** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('applies deep multi-layer active shadow')` | Active window style `box-shadow` matches `0 25px 60px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.2)` (dark) |
| **#16** | Window inactive lighter shadow | **P0** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('applies muted shadow to inactive windows')` | Inactive window style `box-shadow` matches `0 10px 30px -5px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)` (dark) |
| **#17** | Window open animation 280ms spring | **P0** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('animates open transition: scale 0.85->1, opacity 0->1, blur 8->0 over 280ms')` | Motion variants include `initial: { scale: 0.85, opacity: 0, filter: 'blur(8px)' }`, `animate: { scale: 1, opacity: 1, filter: 'blur(0px)' }`, duration `0.28s` |
| **#18** | Window close animation 180ms | **P0** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('animates close transition: scale 1->0.88, opacity 1->0, blur 0->4 over 180ms')` | Exit variant `exit: { scale: 0.88, opacity: 0, filter: 'blur(4px)', transition: { duration: 0.18 } }` |
| **#19** | Window maximize fills viewport minus menu bar (320ms) | **P1** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('transitions bounds to viewport minus 28px in 320ms')` | Maximized bounds `top: 28px; left: 0px; width: 100vw; height: calc(100vh - 28px)`, transition `320ms` |
| **#20** | Window minimize scale 0.1 towards dock (320ms) | **P1** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('animates scale to 0.1 towards dock position in 320ms')` | Minimized animation target `scale: 0.1, y: window.innerHeight - 60, opacity: 0`, transition `320ms` |
| **#21** | Window header drag grab cursor & clamp | **P0** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('displays grab/grabbing cursor on header with y>=28 clamp')` | Header CSS `cursor: grab; active:cursor-grabbing`, style top bounded by `min 28px` |
| **#22** | Window resize handles 8-direction with correct cursors | **P1** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('provides 8 edge/corner resize handles with appropriate resize cursors')` | Handles have cursors: `n-resize`, `s-resize`, `e-resize`, `w-resize`, `nw-resize`, `ne-resize`, `sw-resize`, `se-resize` |
| **#23** | Window cascade positioning 24px offset | **P2** | `windows.test.tsx` | `describe('Window Visual Conformance') -> it('positions consecutive windows with 24px diagonal offset')` | Window positions increment by `dx: 24px, dy: 24px` per spawned instance |
| **#24** | Dock pill shape centered bottom with 16px clearance | **P0** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('renders rounded-full pill centered at bottom with 16px bottom gap')` | Dock container style `fixed bottom-4 left-1/2 -translate-x-1/2`, `border-radius: 9999px` |
| **#25** | Dock glassmorphism blur(20px) saturate(190%) + specular hairline | **P0** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('applies blur(20px) saturate(190%) and inset specular highlight')` | Backdrop filter `blur(20px) saturate(190%) contrast(105%)`, box-shadow contains `inset 0 1px 1px 0 rgba(255,255,255,0.22)` |
| **#26** | Dock multi-layer deep shadow | **P1** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('applies multi-layer outer and inset shadow')` | Computed shadow includes `0 12px 36px -4px rgba(0,0,0,0.55), 0 4px 16px -2px rgba(0,0,0,0.35)` |
| **#27** | Dock magnification curve grows upward from baseline | **P0** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('aligns magnification growth upward from bottom baseline')` | Dock items styled with `origin-bottom` (`transform-origin: bottom center`) |
| **#28** | Dock magnification max ~1.55x (44->68px, R=150px) | **P0** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('magnifies base 44px icon to max 68px within 150px radius')` | Peak icon dimension is 68px, magnification radius threshold is 150px |
| **#29** | Dock spring physics (mass:0.1, stiff:420, damp:26) | **P0** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('configures spring physics parameters mass:0.1, stiffness:420, damping:26')` | Framer Motion / spring hook receives `{ mass: 0.1, stiffness: 420, damping: 26 }` |
| **#30** | Dock press squash 0.88x on pointer down | **P1** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('renders 0.88x scale squash on press')` | Active state CSS/motion variant contains `scale: 0.88` |
| **#31** | Dock tooltips pill label (blur(12px), 11.5px, 6px radius) | **P1** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('renders tooltip pill with blur(12px) and 11.5px typography')` | Tooltip style has `background: rgba(24,24,28,0.88); backdrop-filter: blur(12px); font-size: 11.5px; border-radius: 6px` |
| **#32** | Dock active dots 3px white dot with glow | **P1** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('renders 3px dot with 0 0 4px white glow below active icons')` | Dot style `width: 3px; height: 3px; border-radius: 9999px; box-shadow: 0 0 4px rgba(255,255,255,0.4)` |
| **#33** | Dock dividers 1px x 32px white/12% | **P2** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('renders 1px x 32px vertical divider between sections')` | Divider element has `width: 1px; height: 32px; background: rgba(255,255,255,0.12)` |
| **#34** | App launch bounce keyframes | **P2** | `dock.test.tsx` | `describe('Dock Visual Conformance') -> it('triggers vertical keyframe bounce when launching new app')` | Launch animation applies keyframes `y: [0, -12, 0, -6, 0]` |
| **#35** | Music pill in dock (120px with art, title, eq, play) | **P0** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('renders 120px pill with artwork, title, eq bars, and play button')` | Pill width is 120px, contains 28×28px artwork, 11px title, 2px eq bars, 24px play/pause button |
| **#36** | Music pill dock magnification (120->160px) | **P1** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('magnifies pill width up to 160px proportionally with dock')` | When hovered in dock, music pill width scales smoothly from 120px to 160px |
| **#37** | Equalizer bars animation (3 bars, staggered 4-16px) | **P1** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('animates 3 equalizer bars with staggered heights between 4px and 16px')` | 3 eq bar spans have `width: 2px; border-radius: 1px`, animating heights `[4px, 16px, 8px]` |
| **#38** | Expanded deck glassmorphism blur(32px) saturate(200%) | **P0** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('styles expanded card 340x480px with blur(32px) and 20px radius')` | Card dimensions `width: 340px; height: 480-520px; border-radius: 20px; backdrop-filter: blur(32px) saturate(200%); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.7)` |
| **#39** | Vinyl disc spin (200px, 3s linear infinite) | **P0** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('renders 200px vinyl disc rotating at 3s period when active')` | Vinyl disc element `width: 200px; height: 200px; border-radius: 9999px; animation: spin 3s linear infinite` |
| **#40** | Album art center overlay 60px circle on vinyl | **P1** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('centers 60px circular album artwork label on vinyl disc')` | Center label element `width: 60px; height: 60px; border-radius: 9999px; position: absolute; inset: 0; margin: auto` |
| **#41** | Transport controls sizing (play/pause 44px) | **P1** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('sizes play/pause button at 44px with surrounding transport icons')` | Play/pause button has `width: 44px; height: 44px; border-radius: 9999px`, prev/next/shuffle/repeat buttons rendered |
| **#42** | Progress scrubber 4px track (6px hover), 12px handle | **P1** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('renders 4px track expanding to 6px on hover with 12px handle')` | Track has `height: 4px; hover:height: 6px`, handle has `width: 12px; height: 12px; border-radius: 9999px` |
| **#43** | Volume slider 3px track, 10px handle | **P2** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('renders 3px volume slider track with 10px handle')` | Volume track has `height: 3px`, handle has `width: 10px; height: 10px` |
| **#44** | FFT visualizer real-time frequency bars in accent color | **P2** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('renders Canvas FFT visualizer bars matching theme accent')` | `<canvas>` element rendered in audio deck with 2D context drawing frequency columns |
| **#45** | Deck entrance spring from y:20 to y:0 with opacity | **P1** | `music.test.tsx` | `describe('Music Visual Conformance') -> it('animates deck entrance with spring transition from y:20 to y:0')` | Motion variants have `initial: { opacity: 0, y: 20 }`, `animate: { opacity: 1, y: 0 }` |
| **#46** | Hero text scale clamp(4.5rem, 14vw + 1rem, 18.5rem) uppercase full-bleed | **P0** | `typography.test.tsx` | `describe('Kinetic Typography Visuals') -> it('styles hero typography with full-bleed responsive clamp')` | Hero container has `font-size: clamp(4.5rem, 14vw + 1rem, 18.5rem); text-transform: uppercase; line-height: 0.85-1.0` |
| **#47** | Per-character displacement via SplitText | **P0** | `typography.test.tsx` | `describe('Kinetic Typography Visuals') -> it('wraps each character in discrete span for independent displacement')` | Each letter rendered in a separate `<span data-char="...">` with inline `transform: translate3d(...)` |
| **#48** | Underdamped spring physics feel (zeta ~ 0.717) | **P0** | `typography.test.tsx` | `describe('Kinetic Typography Visuals') -> it('adheres to underdamped ODE parameters k=280, c=24, m=1.0')` | Euler ODE solver parameters verify $c / (2\sqrt{km}) \approx 24 / (2\sqrt{280}) \approx 0.717$ |
| **#49** | Influence radius ~260px with Gaussian falloff | **P1** | `typography.test.tsx` | `describe('Kinetic Typography Visuals') -> it('applies influence threshold of 260px with Gaussian attenuation')` | Force is zero when cursor distance $d \ge 260\text{px}$, exponential decay $e^{-d^2 / (2\sigma^2)}$ for $d < 260\text{px}$ |
| **#50** | Variable font weight modulation 400->900 | **P1** | `typography.test.tsx` | `describe('Kinetic Typography Visuals') -> it('modulates font-variation-settings wght axis from 400 to 900')` | Characters modulate CSS `font-variation-settings: 'wght' N` where $400 \le N \le 900$ |
| **#51** | Ambient harmonic wave idle text oscillation | **P2** | `typography.test.tsx` | `describe('Kinetic Typography Visuals') -> it('applies subtle sinusoidal wave transforms when cursor is idle')` | Characters oscillate with $y = A \sin(\omega t + \phi_i)$ where $A \approx 4\text{px}$ |
| **#52** | Workspace mode 0.35 opacity behind frosted glass | **P0** | `typography.test.tsx` | `describe('Kinetic Typography Visuals') -> it('sets 0.35 opacity in workspace mode behind windows')` | Stage container style `opacity: 0.35; z-index: 0` |
| **#53** | Precision dot 4px white, zero latency, pointer-events none | **P0** | `cursor.test.tsx` | `describe('Cursor Visual Conformance') -> it('renders 4px white dot with pointer-events none at z-index 9999')` | Dot style `width: 4px; height: 4px; border-radius: 9999px; background: #ffffff; pointer-events: none; z-index: 9999` |
| **#54** | Aura ring follow 24-80px with visible lerp lag | **P0** | `cursor.test.tsx` | `describe('Cursor Visual Conformance') -> it('renders aura ring 24-80px with lerp trailing behavior')` | Ring base `width: 24px; height: 24px`, border `2px solid rgba(255,255,255,0.6)`, follows pointer via lerp |
| **#55** | Aura ring difference blend mode | **P0** | `cursor.test.tsx` | `describe('Cursor Visual Conformance') -> it('applies mix-blend-mode difference for color inversion')` | Ring computed style `mix-blend-mode: difference` |
| **#56** | Aura velocity expansion with speed | **P1** | `cursor.test.tsx` | `describe('Cursor Visual Conformance') -> it('expands ring radius proportionally with velocity')` | Ring radius scales up to 80px under high pointer speed |
| **#57** | Aura collapse on drag/resize | **P1** | `cursor.test.tsx` | `describe('Cursor Visual Conformance') -> it('collapses aura scale to 0 over 100ms when hovering drag/resize handles')` | When hovering `[data-cursor="precision-drag"]`, ring scale transitions to 0 over 100ms |
| **#58** | Aura magnetic snap morph to squircle | **P2** | `cursor.test.tsx` | `describe('Cursor Visual Conformance') -> it('morphs into rounded squircle snapping over dock icons')` | When hovering `[data-cursor="magnetic-dock"]`, ring adopts dock item dimensions and radius |
| **#59** | Dark/Light theme toggle token swap without flicker | **P0** | `persistence.test.tsx` | `describe('Theme Visual Conformance') -> it('swaps all CSS variable tokens cleanly on theme change')` | Theme toggle updates `:root.dark` / `:root.light` tokens (`--os-bg-desktop`, `--os-window-body-bg`, `--os-menubar-bg`) |
| **#60** | Mobile bottom sheets (92vh, rounded top) at <768px | **P0** | `mobile.test.tsx` | `describe('Mobile Visual Conformance') -> it('renders windows as 92vh bottom sheets with rounded top corners')` | Viewport < 768px: sheet container has `height: 92vh; width: 100vw; border-top-left-radius: 16px; border-top-right-radius: 16px` |
| **#61** | Mobile tab bar (52px + safe area) replacing dock | **P0** | `mobile.test.tsx` | `describe('Mobile Visual Conformance') -> it('renders 52px fixed tab bar with safe-area padding')` | Tab bar has `height: calc(52px + env(safe-area-inset-bottom)); position: fixed; bottom: 0; width: 100%` |
| **#62** | Mobile swipe down 140px threshold dismiss | **P1** | `mobile.test.tsx` | `describe('Mobile Visual Conformance') -> it('animates slide-down dismiss on 140px drag')` | Drag down beyond 140px triggers downward exit transition (`translateY: 100%`) |
| **#63** | Mobile sticky audio bar (44px above tab bar) | **P1** | `mobile.test.tsx` | `describe('Mobile Visual Conformance') -> it('renders 44px audio bar positioned directly above tab bar')` | Sticky audio bar has `height: 44px; position: fixed; bottom: calc(52px + env(safe-area-inset-bottom))` |
| **#64** | Cursor disabled on mobile/touch | **P0** | `mobile.test.tsx` | `describe('Mobile Visual Conformance') -> it('disables cursor elements when pointer is coarse')` | Coarse media query suppresses dot and aura elements |

---

## 3. Deep-Dive Test File Specifications (All 11 Files)

### 3.1 `tests/tier1-features/desktop.test.tsx`
- **Scope**: Desktop surface clicks, context menus, selection marquee, icon selection, double-click launch, icon visuals and grid layout.
- **Coverage**: Interaction #1, #2, #3, #4, #5, #6, #7 | Visual #6, #7, #8, #9.
- **Mock Requirements**:
  - `ResizeObserver` mock for `DesktopGrid` layout calculation.
  - Vitest fake timers (`vi.useFakeTimers()`) to test 300ms click debounce vs double-click launch.
- **Key Test Cases & Implementation Blueprint**:
  1. `it('clears selections and dismisses context menu on empty desktop click (#1)')`:
     - Arrange: Seed `useOSStore` with selected icons `['projects', 'about']` and `contextMenu: { x: 100, y: 100, items: [...] }`.
     - Act: Click on `data-testid="desktop-canvas"`.
     - Assert: `useOSStore.getState().contextMenu === null`, all desktop icons have `aria-selected="false"`.
  2. `it('opens context menu at clamped coordinates on right click (#2)')`:
     - Act: `fireEvent.contextMenu(desktopCanvas, { clientX: 250, clientY: 180 })`.
     - Assert: `getByTestId('context-menu')` visible, style `top: 180px; left: 250px`, includes menu items (New Folder, Change Wallpaper, Clean Up).
  3. `it('renders and tracks selection marquee rectangle (#3)')`:
     - Act: PointerDown at (50, 50), PointerMove to (200, 180).
     - Assert: `getByTestId('selection-marquee')` has `style="top: 50px; left: 50px; width: 150px; height: 130px;"`. On PointerUp, marquee element is unmounted.
  4. `it('multi-selects intersecting icons within marquee bounds (#4)')`:
     - Arrange: Icons positioned at (60, 60) [Terminal] and (60, 180) [Projects].
     - Act: Marquee from (20, 20) to (180, 250).
     - Assert: Both Terminal and Projects have `aria-selected="true"` and class `bg-white/15`.
  5. `it('launches app window and sets focus on double click (#5)')`:
     - Act: `fireEvent.doubleClick(getByTestId('desktop-icon-terminal'))`.
     - Assert: `useOSStore.getState().windows['terminal'].isOpen === true`, `activeWindowId === 'terminal'`.
  6. `it('selects icon on single click without launching window (#6)')`:
     - Act: `fireEvent.click(getByTestId('desktop-icon-terminal'))`, `vi.advanceTimersByTime(350)`.
     - Assert: Icon is selected (`aria-selected="true"`), `windows['terminal'].isOpen === false`.
  7. `it('verifies desktop background and icon grid visual specs (#6, #7, #8, #9)')`:
     - Assert: Wallpaper container has `object-fit: cover` and full-bleed bounds.
     - Assert: Grid container has `grid-auto-flow: column`, 92px column width, 104px row height.
     - Assert: Icon has 48×48px image, 11px label with text shadow.
     - Assert: Hover on icon applies `scale(1.05)` and `rgba(255,255,255,0.15)`.

---

### 3.2 `tests/tier1-features/windows.test.tsx`
- **Scope**: Window lifecycle (open, close, minimize, maximize), drag with coordinate clamping ($y \ge 28$, overhang $\ge 100\text{px}$), 8-direction resize with 360×240 minimum bounds, focus elevation, cascade spawn, and traffic lights state.
- **Coverage**: Interaction #8-#24 | Visual #10-#23.
- **Mock Requirements**:
  - Framer Motion animation controls mock or `AnimatePresence` sync harness.
  - Pointer capture API mocks (`setPointerCapture`, `releasePointerCapture`).
- **Key Test Cases & Implementation Blueprint**:
  1. `it('opens window with 280ms scale/opacity spring and 12px radius (#8, #10, #17)')`:
     - Act: `openWindow('terminal')`.
     - Assert: `getByTestId('window-terminal')` in DOM, `border-radius: 12px`, `backdrop-filter: blur(28px) saturate(180%)`, initial motion variants.
  2. `it('closes window and updates focus on red traffic light click (#9, #18)')`:
     - Act: `fireEvent.click(getByTestId('traffic-light-close-terminal'))`.
     - Assert: `windows['terminal'].isOpen === false`.
  3. `it('minimizes and restores window state on yellow traffic light (#11, #20)')`:
     - Act: `fireEvent.click(getByTestId('traffic-light-minimize-terminal'))`.
     - Assert: `windows['terminal'].isMinimized === true`, window element hidden/scaled towards dock.
  4. `it('maximizes window to full screen minus 28px menu bar with 0px radius (#13, #14, #15, #19)')`:
     - Act: `fireEvent.click(getByTestId('traffic-light-maximize-terminal'))`.
     - Assert: `windows['terminal'].isMaximized === true`, `top: 28px; left: 0px; width: 100vw; height: calc(100vh - 28px)`, `border-radius: 0px`.
     - Act 2: Click green light again or double click header.
     - Assert 2: Restores previous bounds and `border-radius: 12px`.
  5. `it('drags window header and clamps y >= 28px and 100px overhang (#16, #17, #18, #21)')`:
     - Act: Drag header up towards `y = -50px`.
     - Assert: Clamped position `y === 28px`.
     - Act 2: Drag window far right offscreen.
     - Assert 2: Window right coordinate maintains at least 100px visible in viewport.
  6. `it('resizes window in 8 directions and enforces 360x240 minimum size (#19, #20, #22)')`:
     - Act: Drag SE handle to shrink window to (100, 100).
     - Assert: `windows['terminal'].size.width === 360`, `size.height === 240`.
  7. `it('elevates active window z-index and renders deep shadow (#21, #15, #16)')`:
     - Arrange: Terminal and Projects open.
     - Act: Click Projects.
     - Assert: `activeWindowId === 'projects'`, `projects.zIndex > terminal.zIndex`, Projects has `--os-shadow-window-active`, Terminal has `--os-shadow-window-inactive`.
  8. `it('cascades successively spawned windows with 24px offset (#22, #23)')`:
     - Act: `openWindow('terminal')`, `openWindow('finder')`, `openWindow('about')`.
     - Assert: `finder.x === terminal.x + 24`, `about.x === finder.x + 24`.
  9. `it('renders traffic lights with gray dots when unfocused and glyphs on hover (#23, #24, #12, #13, #14)')`:
     - Assert unfocused: Traffic lights have muted gray color.
     - Act: Hover traffic light group.
     - Assert focused hover: Red (#FF5F56), Yellow (#FFBD2E), Green (#27C93F) circles display `✕`, `−`, `⤢` glyphs.

---

### 3.3 `tests/tier1-features/dock.test.tsx`
- **Scope**: Luca parabolic dock, Cosine Bell curve magnification, spring physics, click triggers (open, focus, restore), squash physics, active glowing dots, dividers, and tooltips.
- **Coverage**: Interaction #25-#36 | Visual #24-#34.
- **Mock Requirements**:
  - Pointer proximity dispatcher utility simulating continuous mouse movement across dock.
- **Key Test Cases & Implementation Blueprint**:
  1. `it('calculates parabolic Cosine Bell magnification upward from baseline (#25, #26, #27, #28, #29)')`:
     - Act: Dispatch pointerMove at center of dock item 2 ($x = 150$).
     - Assert: Item 2 width/height scales to 68px (1.55x). Neighbor items scale smoothly according to $W(d) = 44 + 24 \cdot \frac{1+\cos(\pi d / 150)}{2}$.
     - Assert: `transform-origin` is `bottom center` (upward growth).
     - Act 2: Dispatch pointerLeave.
     - Assert 2: All items spring back to 44px.
  2. `it('handles dock click lifecycle: launch bounce, focus, and restore (#27, #28, #29, #34)')`:
     - Closed app click: Launches app, adds launch bounce animation keyframes.
     - Open unfocused app click: Raises window to front, sets `activeWindowId`.
     - Minimized app click: Sets `isMinimized: false`, restores window.
  3. `it('squashes icon to scale 0.88x on pointer down and recovers on pointer up (#30, #31, #30)')`:
     - Act: `pointerDown(dockItem)`.
     - Assert: `transform` includes `scale(0.88)`.
     - Act: `pointerUp(dockItem)`.
     - Assert: Scale returns to normal.
  4. `it('renders animated dock tooltip on hover (#32, #33, #31)')`:
     - Act: `pointerEnter(dockItemProjects)`.
     - Assert: Tooltip pill appears above icon with `blur(12px)` and text "Projects". On `pointerLeave`, tooltip fades out.
  5. `it('tracks active dots: visible when open, dimmed when minimized, removed when closed (#34, #35, #36, #32)')`:
     - Open: Dot visible (3px white, 85% opacity, `0 0 4px` glow).
     - Minimize: Dot has class `opacity-40`.
     - Close: Dot removed from DOM.
  6. `it('verifies dock chassis glassmorphism, dividers, and pill shape (#24, #25, #26, #33)')`:
     - Assert: `rounded-full`, 16px bottom clearance, `blur(20px) saturate(190%)`, specular hairline `inset 0 1px 1px 0 rgba(255,255,255,0.22)`, 1px × 32px dividers.

---

### 3.4 `tests/tier1-features/music.test.tsx`
- **Scope**: Nidal music player, AudioContext user gesture initialization, play/pause/resume, track navigation, deck expansion, scrubbing, volume/mute, shuffle, repeat cycle, vinyl spinning, and track end transitions.
- **Coverage**: Interaction #37-#53 | Visual #35-#45.
- **Mock Requirements**:
  - Global `AudioContext` and `HTMLAudioElement` mock (`play()`, `pause()`, `load()`, `currentTime`, `duration`, `ended` event).
  - Web Audio `GainNode` and `AnalyserNode` mock.
- **Key Test Cases & Implementation Blueprint**:
  1. `it('initializes in IDLE state without autoplay (#37)')`:
     - Assert: `status === 'idle'`, audio element paused, play icon displayed in pill.
  2. `it('initializes AudioContext and starts playback on user click (#38, #39, #40)')`:
     - Act: Click play button.
     - Assert: `AudioContext.state === 'running'`, `status === 'playing'`, audio element playing, EQ bars animating.
     - Act 2: Click pause.
     - Assert 2: `status === 'paused'`, audio element paused, EQ bars frozen.
     - Act 3: Click play again.
     - Assert 3: Resumes from exact paused timestamp.
  3. `it('handles track navigation with 3s previous threshold (#41, #42, #43)')`:
     - Next: Advances `currentIndex` from 0 to 1, updates metadata.
     - Prev at $t = 10\text{s}$: Restarts current track (`currentTime === 0`).
     - Prev at $t = 1.5\text{s}$: Navigates to previous track (`currentIndex` decrements).
  4. `it('expands and collapses audio deck with glassmorphic styles (#44, #45, #38, #45)')`:
     - Act: Click music pill in dock.
     - Assert: `isDeckExpanded === true`, `getByTestId('audio-deck-expanded')` rendered with `340px × 480px`, `blur(32px) saturate(200%)`, rounded 20px.
     - Act 2: Click collapse button -> `isDeckExpanded === false`.
  5. `it('drags scrubber to seek audio position (#46, #42)')`:
     - Act: Click/drag scrubber to 50%.
     - Assert: `currentTime === duration * 0.5`, `audioElement.currentTime` updated.
  6. `it('controls volume and mute state (#47, #48, #43)')`:
     - Act: Drag volume slider to 0.40 -> `store.volume === 0.40`, GainNode gain === 0.40.
     - Act: Click mute -> `isMuted === true`, GainNode gain === 0. Click again -> restored to 0.40.
  7. `it('toggles shuffle and cycles repeat modes (#49, #50)')`:
     - Shuffle: `isShuffled` toggles `false <-> true`.
     - Repeat: Cycles `'off' -> 'all' -> 'one' -> 'off'`.
  8. `it('rotates vinyl disc at 3s period when playing and freezes when paused (#51, #39, #40)')`:
     - Assert playing: Vinyl element has `animation: spin 3s linear infinite`, centered 60px label artwork.
     - Assert paused: `animation-play-state: paused`.
  9. `it('handles track end auto-advance and repeat-one looping (#52, #53)')`:
     - Track end in 'off' / 'all': Auto-advances to next track.
     - Track end in 'one': Restarts same track at `currentTime = 0`.
  10. `it('verifies visual specs: dock pill, eq bars, transport controls, and canvas visualizer (#35, #36, #37, #41, #44)')`:
      - Pill: 120px base width, magnifies to 160px.
      - EQ: 3 bars with staggered heights (4-16px).
      - Controls: 44px play/pause button.
      - Visualizer: Canvas element present and connected to AnalyserNode.

---

### 3.5 `tests/tier1-features/typography.test.tsx`
- **Scope**: Michal kinetic typography wallpaper, per-character SplitText, semi-implicit Euler ODE solver ($k=280, c=24, m=1.0$), Gaussian influence radius (260px), variable font weight (400→900), workspace/ambient opacity modes, and ambient wave idle oscillation.
- **Coverage**: Interaction #61-#68 | Visual #46-#52.
- **Mock Requirements**:
  - `requestAnimationFrame` control mock.
  - MotionValues / Euler ODE calculation verification fixture.
- **Key Test Cases & Implementation Blueprint**:
  1. `it('displaces characters within 260px proximity by up to 65px (#61, #46, #47)')`:
     - Act: Move pointer to $(x_0, y_0)$ overlapping hero character span.
     - Assert: Character span has `transform: translate3d(dx, dy, 0)` with displacement $\le 65\text{px}$.
  2. `it('verifies underdamped spring return physics (zeta ~ 0.717) (#62, #48)')`:
     - Act: Move cursor away and step RAF loop.
     - Assert: Character velocity and position follow ODE $m \ddot{x} + c \dot{x} + k x = 0$, exhibiting underdamped oscillation overshoot before settling.
  3. `it('validates Gaussian falloff curve with distance (#63, #49)')`:
     - Pointer at distance $d_1 = 50\text{px}$ vs $d_2 = 200\text{px}$.
     - Assert: Force at $d_1$ is substantially larger than $d_2$, and zero for $d \ge 260\text{px}$.
  4. `it('modulates variable font weight axis from 400 to 900 near cursor (#64, #50)')`:
     - Act: Cursor near character.
     - Assert: Span style `font-variation-settings` contains `'wght' N` with $N \ge 800$.
  5. `it('swaps opacity between workspace mode (0.35) and ambient mode (1.0) (#65, #66, #52)')`:
     - Workspace mode (open window): Stage opacity is 0.35.
     - Ambient mode (Cmd+Option+M): Stage opacity is 1.0, window layer opacity fades to 0.
  6. `it('animates subtle ambient harmonic wave during cursor idle (#67, #51)')`:
     - Assert: When pointer is offscreen, characters oscillate with phase-shifted sinusoidal vertical wave.
  7. `it('runs physics loop outside React component render cycle (#68)')`:
     - Assert: Continuous RAF updates do not re-render parent `KineticHeroStage` React component.

---

### 3.6 `tests/tier1-features/cursor.test.tsx`
- **Scope**: Michal dual-tier cursor system, zero-latency precision dot, lerp trailing aura ring, velocity expansion, difference blend mode, and FSM variant states (`kinetic-hero`, `precision-drag`, `magnetic-dock`, `disabled`).
- **Coverage**: Interaction #54-#60 | Visual #53-#58.
- **Mock Requirements**:
  - Pointer position tracker mock.
  - Media query mock for `@media (pointer: coarse)`.
- **Key Test Cases & Implementation Blueprint**:
  1. `it('tracks precision dot at exact mouse coordinates without latency (#54, #53)')`:
     - Act: `pointerMove(window, { clientX: 400, clientY: 300 })`.
     - Assert: `getByTestId('cursor-precision-dot')` has `transform: translate3d(400px, 300px, 0)`, `width: 4px; height: 4px; pointer-events: none; z-index: 9999`.
  2. `it('interpolates aura ring position with lerp lag behind precision dot (#55, #54)')`:
     - Act: Pointer jumps from (100, 100) to (500, 500). Advance 1 frame (16ms).
     - Assert: Aura ring position is interpolated $(x \approx 160, y \approx 160)$ via $\lambda = 0.15$.
  3. `it('expands aura ring diameter up to 80px under high pointer velocity (#56, #56)')`:
     - Act: Successive high-speed pointer moves.
     - Assert: Aura ring size expands from base 24px up to 80px.
  4. `it('applies mix-blend-mode difference for inverted background blending (#57, #55)')`:
     - Assert: Aura ring has computed style `mix-blend-mode: difference`.
  5. `it('collapses aura ring over resize and drag handles (#58, #57)')`:
     - Act: Hover element with `data-cursor="precision-drag"`.
     - Assert: Cursor variant is `'precision-drag'`, aura ring scale transitions to 0 over 100ms.
  6. `it('morphs aura ring into magnetic squircle snapping to dock items (#59, #58)')`:
     - Act: Hover dock icon with `data-cursor="magnetic-dock"`.
     - Assert: Cursor variant is `'magnetic-dock'`, aura ring morphs into squircle matching dock icon bounds.
  7. `it('suppresses cursor elements on touch/coarse devices (#60, #64)')`:
     - Arrange: Set `window.matchMedia('(pointer: coarse)').matches = true`.
     - Assert: Precision dot and aura ring are not rendered.

---

### 3.7 `tests/tier1-features/shortcuts.test.tsx`
- **Scope**: Global keyboard shortcuts registered in `ShortcutRegistry` (Spotlight search, Window close/minimize, Theme toggle, Ambient mode).
- **Coverage**: Interaction #69-#74.
- **Key Test Cases & Implementation Blueprint**:
  1. `it('opens Spotlight search on Cmd+K and focuses search input (#69)')`:
     - Act: `fireEvent.keyDown(window, { key: 'k', metaKey: true })`.
     - Assert: `spotlightOpen === true`, Spotlight modal visible, search input focused.
  2. `it('dismisses Spotlight on Escape (#70)')`:
     - Act: `fireEvent.keyDown(window, { key: 'Escape' })`.
     - Assert: `spotlightOpen === false`, modal removed.
  3. `it('closes active window on Cmd+W (#71)')`:
     - Arrange: Terminal focused.
     - Act: `fireEvent.keyDown(window, { key: 'w', metaKey: true })`.
     - Assert: `windows['terminal'].isOpen === false`.
  4. `it('minimizes active window on Cmd+M (#72)')`:
     - Arrange: Terminal focused.
     - Act: `fireEvent.keyDown(window, { key: 'm', metaKey: true })`.
     - Assert: `windows['terminal'].isMinimized === true`.
  5. `it('toggles dark and light theme on Cmd+Shift+D (#73)')`:
     - Act: `fireEvent.keyDown(window, { key: 'd', metaKey: true, shiftKey: true })`.
     - Assert: `theme` toggles `'dark' <-> 'light'`, document class updates.
  6. `it('toggles ambient mode on Cmd+Option+M (#74)')`:
     - Act: `fireEvent.keyDown(window, { key: 'm', metaKey: true, altKey: true })`.
     - Assert: `desktopMode` toggles `'workspace' <-> 'ambient-hero'`.

---

### 3.8 `tests/tier1-features/mobile.test.tsx`
- **Scope**: Viewport < 768px responsive behavior, mobile bottom sheets (92vh, swipe-down 140px dismiss, scroll protection), fixed 52px tab bar, 44px sticky audio bar, dock and desktop icon suppression, single-tap launch.
- **Coverage**: Interaction #75-#84 | Visual #60-#64.
- **Mock Requirements**:
  - `window.innerWidth = 390` / `window.innerHeight = 844`.
  - Touch event dispatcher simulation (`touchStart`, `touchMove`, `touchEnd`).
- **Key Test Cases & Implementation Blueprint**:
  1. `it('renders open windows as 92vh bottom sheets on mobile (#75, #60)')`:
     - Act: Set viewport width 390px, open 'about'.
     - Assert: `getByTestId('mobile-bottom-sheet-about')` present with `height: 92vh; width: 100vw; border-top-left-radius: 16px`.
  2. `it('dismisses sheet on swipe down > 140px threshold (#76, #62)')`:
     - Act: Touch drag handle from $y=100$ to $y=260$ ($\Delta y = 160\text{px}$).
     - Assert: Sheet animates down and closes (`isOpen: false`).
  3. `it('restores sheet position on swipe down < 140px threshold (#77)')`:
     - Act: Touch drag handle from $y=100$ to $y=180$ ($\Delta y = 80\text{px}$).
     - Assert: Sheet springs back to full open position.
  4. `it('protects internal scroll from triggering sheet dismiss when scrollTop > 0 (#78)')`:
     - Act: Scroll sheet content to `scrollTop = 60`, then touch drag down.
     - Assert: Sheet dismiss is NOT triggered.
  5. `it('renders 52px fixed tab bar and suppresses desktop dock and icons (#79, #82, #83, #61)')`:
     - Assert: `getByTestId('mobile-tab-bar')` visible (52px + safe area).
     - Assert: `queryByTestId('desktop-dock') === null`, `queryByTestId('desktop-grid') === null`.
  6. `it('renders 44px sticky audio bar above tab bar and expands on tap (#80, #81, #63)')`:
     - Assert: `getByTestId('mobile-sticky-audio-bar')` rendered at `bottom: calc(52px + env(safe-area-inset-bottom))`.
     - Act: Tap sticky bar -> Fullscreen player sheet opens.
  7. `it('launches app on single tap from tab bar (#84)')`:
     - Act: Tap Projects tab item -> Projects bottom sheet opens immediately without requiring double-click.

---

### 3.9 `tests/tier1-features/audio-ducking.test.tsx`
- **Scope**: Unified audio pipeline, `GlobalAudioManager` singleton, procedural UI sound effects (`SoundSynthesizer`), automatic music ducking to 20% over 40ms, and restoration over 250ms.
- **Coverage**: Interaction #85, #86.
- **Mock Requirements**:
  - Web Audio `AudioContext`, `GainNode`, `AudioBufferSourceNode`, `AudioParam` timeline methods (`setValueAtTime`, `linearRampToValueAtTime`, `exponentialRampToValueAtTime`).
- **Key Test Cases & Implementation Blueprint**:
  1. `it('ducks music gain to 0.20 over 40ms and restores over 250ms when UI sound triggers (#85)')`:
     - Arrange: Music is playing (`status: 'playing'`, music gain = 1.0).
     - Act: Trigger `GlobalAudioManager.getInstance().playFx('window-open')`.
     - Assert: `musicGainNode.gain.setValueAtTime` / `linearRampToValueAtTime` is called scheduling gain to 0.20 at $t_0 + 0.04\text{s}$, and restoring to 1.0 at $t_0 + 0.29\text{s}$.
  2. `it('plays UI sound normally without ducking or errors when music is idle/paused (#86)')`:
     - Arrange: `useMusicStore.getState().status === 'idle'`.
     - Act: Trigger `playFx('click')`.
     - Assert: UI sound plays on fx bus; no ducking timeline ramps scheduled on music gain node.

---

### 3.10 `tests/tier1-features/persistence.test.tsx`
- **Scope**: `localStorage` state persistence and rehydration for Theme (`os-theme`), Wallpaper (`os-wallpaper`), Music CurrentTime (`music-current-time`), and Volume (`music-volume`), along with visual token swap verification.
- **Coverage**: Interaction #87-#90 | Visual #59.
- **Mock Requirements**:
  - Real or spy-wrapped `localStorage` in test environment.
- **Key Test Cases & Implementation Blueprint**:
  1. `it('persists theme selection across component re-mounts (#87, #59)')`:
     - Act: `useOSStore.getState().setTheme('dark')`.
     - Assert: `localStorage.getItem('os-theme') === 'dark'`, document root has class `dark`.
     - Act 2: Unmount and re-mount app.
     - Assert 2: Store initializes with `theme === 'dark'`, CSS variables swap without flash.
  2. `it('persists wallpaper choice across reload (#88)')`:
     - Act: `useOSStore.getState().setWallpaper('sonoma-light')`.
     - Assert: `localStorage.getItem('os-wallpaper') === 'sonoma-light'`. On re-mount, Sonoma light wallpaper is loaded.
  3. `it('persists music playback timestamp within +-5s (#89)')`:
     - Act: Set `musicStore.currentTime = 90`.
     - Assert: `localStorage.getItem('music-current-time') === '90'`. On re-mount, `musicStore.currentTime` is initialized to 90s (within $\pm 5\text{s}$).
  4. `it('persists volume setting across reload (#90)')`:
     - Act: Set `musicStore.volume = 0.30`.
     - Assert: `localStorage.getItem('music-volume') === '0.30'`. On re-mount, volume initializes to 0.30.

---

### 3.11 `tests/visual-conformance/chrome.test.tsx`
- **Scope**: Core OS Chrome visual rules: Top menu bar 28px height, `blur(40px)` glassmorphism, dynamic bold app name (12.5px, 600 weight), clock format `Day Mon DD H:MM AM/PM`, and 16×16px status tray icons with 10px flex gap.
- **Coverage**: Visual #1-#5.
- **Key Test Cases & Implementation Blueprint**:
  1. `it('verifies menu bar height of exactly 28px and fixed top positioning (#1)')`:
     - Assert: `getByTestId('top-menu-bar')` has computed height 28px, `fixed top-0 left-0 right-0 z-50`.
  2. `it('verifies backdrop-filter blur(40px) and tokenized opacity per theme (#2)')`:
     - Dark theme: Background `rgba(26,26,26,0.65)`, `backdrop-filter: blur(40px)`, border bottom `rgba(255,255,255,0.10)`.
     - Light theme: Background `rgba(255,255,255,0.72)`, border bottom `rgba(0,0,0,0.05)`.
  3. `it('formats clock string as Day Mon DD H:MM AM/PM (#3)')`:
     - Assert: `getByTestId('menu-bar-clock').textContent` matches `/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2}\s\d{1,2}:\d{2}\s(AM|PM)$/`.
  4. `it('updates dynamic app name in bold 12.5px font when active window changes (#4)')`:
     - Arrange: Focus Terminal -> Text is "Terminal".
     - Act: Focus Projects -> Text updates to "Projects".
     - Assert: Text element has `font-size: 12.5px; font-weight: 600; letter-spacing: -0.01em`.
  5. `it('renders status tray icons at 16x16px with 10px spacing (#5)')`:
     - Assert: Wi-Fi, Battery, Volume SVG icons have dimensions 16×16px, container flex gap is 10px (`space-x-[10px]`).

---

## 4. Visual Verification Methodology in Vitest & React Testing Library

To achieve automated visual rule validation within an in-memory testing runner (Vitest + JSDOM), we apply four complementary verification techniques:

1. **CSS Custom Property Token Introspection**:
   - Inspect computed CSS custom properties on `:root` and component containers (`--os-menubar-bg`, `--os-window-body-bg`, `--os-shadow-window-active`, `--os-shadow-window-inactive`).
2. **Backdrop Filter & Inline Style Assertions**:
   - Inspect computed styles and inline style attributes for exact glassmorphic declarations (`blur(28px) saturate(180%)`, `blur(20px) saturate(190%) contrast(105%)`, `blur(40px)`, `mix-blend-mode: difference`).
3. **SVG Geometry & Bounding Box Checks**:
   - Query SVG elements directly to verify attributes: `viewBox`, `width`, `height`, circle `r`, path coordinates, and flex layout gap classes (`gap-[10px]`, `gap-[8px]`).
4. **Media Query & Environmental Query Simulation**:
   - Use custom test environment helpers (`mockMatchMedia`, `setViewportSize`) to assert dynamic responsive token swapping and component branching between desktop ($\ge 768\text{px}$, `pointer: fine`) and mobile ($< 768\text{px}$, `pointer: coarse`).

---

## 5. Coverage Audit & Sign-Off Checklist

- [x] **Interaction Validation Matrix**: All 90 interaction test cases mapped to test files, describe blocks, input triggers, and assertions.
- [x] **Visual Reference Matrix**: All 64 visual verification rules mapped to test files, priority levels, and exact CSS/DOM criteria.
- [x] **File Assignment Conformance**:
  - `desktop.test.tsx`: 7 interactions + 4 visual rules
  - `windows.test.tsx`: 17 interactions + 14 visual rules
  - `dock.test.tsx`: 12 interactions + 11 visual rules
  - `music.test.tsx`: 17 interactions + 11 visual rules
  - `typography.test.tsx`: 8 interactions + 7 visual rules
  - `cursor.test.tsx`: 7 interactions + 6 visual rules
  - `shortcuts.test.tsx`: 6 interactions
  - `mobile.test.tsx`: 10 interactions + 5 visual rules
  - `audio-ducking.test.tsx`: 2 interactions
  - `persistence.test.tsx`: 4 interactions + 1 visual rule
  - `chrome.test.tsx`: 5 visual rules
- [x] **Zero Omissions**: 90 / 90 Interaction Cases (100%), 64 / 64 Visual Rules (100%).
