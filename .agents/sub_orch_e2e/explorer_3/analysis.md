# Comprehensive Analysis & Test Specification: Tiers 2, 3, 4 & Test Blueprints
## E2E Testing Track — Explorer 3 Report

---

## 1. Executive Summary & Scope Definition

This report provides the exhaustive specification for:
- **Tier 2: Boundary & Corner Cases Suite**: Edge cases, coordinate clamping ($y \ge 28$, overhang $\ge 100\text{px}$), minimum window sizing ($360 \times 240\text{px}$), audio stream anomalies, rapid UI concurrency storms, out-of-bounds pointer dragging, extreme viewport scaling, and variable font limit clamps.
- **Tier 3: Cross-Feature Combinations Suite**: Combinatorial pairwise testing across concurrent subsystems (Window System, Luca Parabolic Dock, Web Audio Pipeline & Ducking, Kinetic Typography ODE Engine, Spotlight Command Palette, Theme Switching, and Responsive Layout Engine).
- **Tier 4: Real-World Application Scenarios**: 5 complete end-to-end user journeys replicating real human usage patterns across desktop and mobile paradigms.
- **Blueprints for `TEST_INFRA.md` and `TEST_READY.md`**: Complete architectural blueprints defining runner setup, global mock specifications, custom Vitest matchers, helper utilities, Sprint quality gates, and automated validation command sets.

All test designs are strictly aligned with:
1. `PROJECT.md` (System contracts, z-index hierarchy, state stores)
2. `portfolio_research/phase2/PHASE_2_MASTER_SPEC.md` (Implementation contract)
3. `portfolio_research/phase2/qa/interaction-validation-matrix.md` (90 functional test cases)
4. `portfolio_research/phase2/qa/visual-reference-matrix.md` (64 visual reference rules)

---

## 2. Tier 2: Boundary & Corner Cases Suite Specification

Tier 2 verifies negative conditions, boundary values, race conditions, hardware event cancellations, and extreme stress inputs to prevent crashes, layout corruption, audio clipping, or state desynchronization.

### 2.1 Window System Boundaries & Geometry Constraints

| Test ID | Test Case Name | Boundary Condition | Input / Event Simulation | Expected State / DOM Assertion |
|---|---|---|---|---|
| **T2-WIN-01** | Top Menu Bar Boundary Clamping ($y \ge 28\text{px}$) | Window dragged above viewport | Drag header to $(x=200, y=-500)$ | Window position clamped: `position.y === 28`. Header never obscures TopMenuBar (`z-50`). |
| **T2-WIN-02** | Left Overhang Limit ($100\text{px}$ visible) | Window dragged past left edge | Drag window (width $600\text{px}$) to $x = -1000$ | Window position clamped: `position.x === -(600 - 100) = -500`. Exactly $100\text{px}$ remains visible inside viewport. |
| **T2-WIN-03** | Right Overhang Limit ($100\text{px}$ visible) | Window dragged past right edge | Viewport width $1280\text{px}$, drag to $x = 2000$ | Window position clamped: `position.x === 1280 - 100 = 1180`. Exactly $100\text{px}$ remains visible inside viewport. |
| **T2-WIN-04** | Bottom Overhang Limit ($100\text{px}$ visible) | Window dragged past bottom edge | Viewport height $800\text{px}$, drag to $y = 1500$ | Window position clamped: `position.y === 800 - 100 = 700`. Header remains reachable. |
| **T2-WIN-05** | Minimum Window Size Enforcement ($360 \times 240\text{px}$) | Drag SE corner handle towards origin $(0,0)$ | Start with $600 \times 400$, drag handle by $\Delta x = -500, \Delta y = -350$ | `size.width === 360`, `size.height === 240`. Window content scrollable, chrome layout intact, no CSS overflow distortion. |
| **T2-WIN-06** | Maximum Window Bounds on Maximize | Click green traffic light on $1440 \times 900$ viewport | Trigger `toggleMaximize(id)` | `position === {x: 0, y: 28}`, `size === {width: 1440, height: 872}`, `borderRadius === '0px'`. Menu bar ($28\text{px}$) remains visible. |
| **T2-WIN-07** | Restore from Maximize Integrity | Un-maximize after window was moved prior to maximize | Move to $(150, 80, 700, 500)$, maximize, un-maximize | `prevBounds` restored exactly: `position === {x: 150, y: 80}`, `size === {width: 700, height: 500}`, `borderRadius === '12px'`. |
| **T2-WIN-08** | Cascade Spawn Edge Wrap-around | Open 20 windows sequentially | Loop `openWindow('terminal')` 20 times | Cascade offset $+24\text{px}$ per instance. When $x + \text{width} > \text{viewportWidth} - 100$ or $y + \text{height} > \text{viewportHeight} - 100$, coordinate resets to $(40, 60)$ cascade root. |
| **T2-WIN-09** | Z-Index Layer Overflow Protection | Focus windows 1000 times | Rapid alternating clicks across 5 open windows | Window z-index remains strictly within Layer 2 range ($z \in [20, 49]$). Never breaches MenuBar ($z=50$) or Dock ($z=9990$). Relative ordering preserved. |

### 2.2 Audio Engine & Music Store Edge Cases

| Test ID | Test Case Name | Boundary Condition | Input / Event Simulation | Expected State / DOM Assertion |
|---|---|---|---|---|
| **T2-AUD-01** | Empty Playlist Initialization | `playlist: []` in store | Initialize `useMusicStore` with empty array | `status === 'idle'`, `currentIndex === -1`, playback controls disabled, Scrubber at 0%, no runtime exceptions. |
| **T2-AUD-02** | Corrupted Audio / 404 Source Handling | Invalid `audioSrc` (404 URL or invalid MIME) | Select track with invalid URL, trigger `play()` | `HTMLAudioElement` fires `error` event -> store transitions to `status === 'error'`. Error toast/badge shown in AudioDeck. Next track button remains clickable. |
| **T2-AUD-03** | Rapid Track Skipping Burst | 10 rapid `nextTrack()` calls in $150\text{ms}$ | Fire 10 click events on Next button with $15\text{ms}$ interval | Store updates `currentIndex` safely without out-of-bounds error. `HTMLAudioElement.src` updates to final target track. AudioContext buffer source nodes cleanly garbage collected, no memory leak. |
| **T2-AUD-04** | Out-of-Bounds Seek Clamp (Upper Bound) | `seekTo(99999)` where duration is $180\text{s}$ | Call `seekTo(99999)` | `currentTime` clamped to `duration` ($180\text{s}$). Triggers track end handler (advances to next track or loops if repeatMode === 'one'). |
| **T2-AUD-05** | Out-of-Bounds Seek Clamp (Negative) | `seekTo(-50)` | Call `seekTo(-50)` | `currentTime` clamped to $0\text{s}$. Playback continues from beginning. |
| **T2-AUD-06** | Volume Boundary Clamping | `setVolume(-0.5)` and `setVolume(1.5)` | Call `setVolume` with extreme floats | `volume` strictly clamped in range $[0.0, 1.0]$. `GainNode.gain.value` matches clamped store value. |
| **T2-AUD-07** | Zero-Gesture AudioContext Enforcement | Page load before any user interaction | Inspect `GlobalAudioManager.getInstance()` on mount | `AudioContext.state === 'suspended'`, no sound emitted, no browser autoplay policy rejection logged. `init()` resolves on first pointerdown. |
| **T2-AUD-08** | Procedural Audio Ducking Storm | 10 simultaneous UI sounds triggered | Trigger `playFx('click')` 10 times in $20\text{ms}$ while music is playing | Music `GainNode` ducks to $0.20$ (20%), does not stack to negative or sub-20% levels. Duck timer cancels previous resets and restores to $1.0$ over $250\text{ms}$ after the final FX completes. |

### 2.3 Rapid UI Interaction & Concurrency Races

| Test ID | Test Case Name | Boundary Condition | Input / Event Simulation | Expected State / DOM Assertion |
|---|---|---|---|---|
| **T2-RACE-01** | Rapid Theme Toggle Burst | 10 `Cmd+Shift+D` triggers in $100\text{ms}$ | Dispatch 10 keydown events in rapid succession | Store `theme` alternates deterministically; final CSS class on `<html>` matches `useOSStore.getState().theme`. No leftover transition lock classes. |
| **T2-RACE-02** | Double-Click vs Single-Click Race | Single click vs double click on desktop icon | (A) Click once, wait $320\text{ms}$ -> (B) Click twice within $180\text{ms}$ | (A) Icon selected, no window opened. (B) Exactly one window instance launched, icon selection cleared. |
| **T2-RACE-03** | Maximize Animation Interruption | Click green traffic light, then click again at $80\text{ms}$ (mid-transition) | Green click -> wait $80\text{ms}$ -> Green click | Window smoothly reverses back to `prevBounds` without freezing in intermediate bounding box or corrupting radius. |
| **T2-RACE-04** | Rapid Window Open / Close Abortion | Click red traffic light $30\text{ms}$ after launch | Open window -> red button click at $30\text{ms}$ | Open spring animation aborted, 180ms close animation takes over. Component unmounts cleanly from DOM; `activeWindowId` shifts to next available window. |
| **T2-RACE-05** | Rapid Multi-App Dock Click Storm | Click 6 different dock icons in $100\text{ms}$ | Rapid pointerdown/up on Terminal, Projects, About, Finder, Settings, Mail | Launch bounce animations trigger on respective dock items without jank. 6 windows spawn with proper cascade coordinates and distinct z-indices. Top window is the 6th app. |

### 2.4 Pointer & Viewport Boundaries

| Test ID | Test Case Name | Boundary Condition | Input / Event Simulation | Expected State / DOM Assertion |
|---|---|---|---|---|
| **T2-PTR-01** | Window Header Drag Out-of-Window Release | Cursor dragged outside browser window during drag | `pointerdown` on header -> `pointermove` to $(x=-200, y=-200)$ -> `pointercancel` / window blur | Drag state safely terminated (`isDragging: false`). Window remains clamped at $(x=-500, y=28)$. Cursor resets to default. |
| **T2-PTR-02** | Scrubber Drag Beyond Scrubber Bounds | Scrubbing audio with mouse moving to screen corners | `pointerdown` on Scrubber thumb -> `pointermove` to $(x=2000, y=2000)$ -> `pointerup` | Scrubber calculates clamped percentage $100\%$; seek position set to track duration. No pointer capture leak. |
| **T2-PTR-03** | Zero-Sized / Extreme Viewport Resize | Viewport resized to $10 \times 10\text{px}$ and $4000 \times 2500\text{px}$ | Trigger `window.resizeTo(10, 10)` | Euler ODE physics solver and Dock cosine bell formula handle edge dimensions without `NaN`, `Infinity`, or division-by-zero errors. |
| **T2-PTR-04** | Variable Font Weight Limit Clamping | Cursor placed directly on character ($d = 0$) vs infinity | Move cursor to character center ($d=0$), then $d=1000\text{px}$ | Font weight clamped in range $[400, 900]$ (e.g. `font-variation-settings: 'wght' 900` at $d=0$, `'wght' 400` at $d > 260\text{px}$). |
| **T2-PTR-05** | Selection Marquee Boundary Constraints | Marquee drag started at $(-50, -50)$ extending to $(2000, 2000)$ | Pointer drag outside viewport | Visual selection marquee box clamped within DesktopCanvas bounds $(0, 0, \text{vw}, \text{vh})$. Intersecting desktop icons correctly computed. |

---

## 3. Tier 3: Cross-Feature Combinations Suite Specification

Tier 3 executes combinatorial pairwise testing to verify that state mutations, animations, and audio events in one subsystem do not degrade or corrupt concurrent behaviors in another subsystem.

### 3.1 Pairwise Interaction Matrix

```
                      [Window Drag] [Maximized Win] [Expanded Deck] [Dock Zoom] [Ambient Mode] [Mobile Resize] [Input Focus]
[Active Audio Ducking]     C1              -               C3           -             C5             C6             -
[Spotlight Search]          -              C2              -            -             -              -             C7
[Window Drag / Dock]        -              -               -           C4             -              -              -
[Selection Marquee]         C8              -               -            -             -              -              -
```

### 3.2 Combination Deep Dives

#### Combination 1: Window Drag During Active Playback with Procedural SFX & Ducking (C1)
- **Subsystems**: Window System + Web Audio Engine (`GlobalAudioManager`) + Procedural Sound Synthesis (`SoundSynthesizer`) + Luca Parabolic Dock.
- **Initial State**:
  - `useMusicStore`: `status: 'playing'`, `volume: 0.8`, `currentTime: 42.0`
  - `GlobalAudioManager`: `musicGainNode.gain.value: 0.8`, `AudioContext.state: 'running'`
  - Window 'terminal' open and focused at $(200, 150)$.
- **Action Sequence**:
  1. User initiates `pointerdown` on Terminal window header.
  2. Procedural UI sound `playFx('window-grab')` dispatched.
  3. `GlobalAudioManager` triggers ducking: `musicGainNode` ramps down from $0.8$ to $0.8 \times 0.2 = 0.16$ over $40\text{ms}$.
  4. User moves cursor continuously across screen $(200, 150) \to (600, 400)$.
  5. User releases pointer (`pointerup`) at $(600, 400)$.
  6. Procedural UI sound `playFx('window-drop')` dispatched.
  7. Ducking timer completes: `musicGainNode` ramps smoothly back to $0.8$ over $250\text{ms}$.
- **Expected Assertions**:
  - Window position updates smoothly to $(600, 400)$.
  - Music playback is never interrupted or paused during the drag operation (`status === 'playing'`).
  - FFT AnalyserNode continues streaming non-zero frequency spectrum data without buffer underruns.
  - Final gain value returns exactly to $0.8$ (pre-drag volume level).

#### Combination 2: Spotlight Search Over Maximized Window with Open Context Menu (C2)
- **Subsystems**: Window Management + Context Menu Overlay + Spotlight Search (`z-9995`) + TopMenuBar Dynamic Title.
- **Initial State**:
  - Window 'projects' is maximized (`isMaximized: true`, bounds: $0, 28, \text{vw}, \text{vh}-28$).
  - TopMenuBar displays "**Projects**" as active app name.
- **Action Sequence**:
  1. User right-clicks on maximized window surface $\to$ `useOSStore.contextMenu` opens at $(400, 300)$ (`z-9995`).
  2. User presses `Cmd+K` keyboard shortcut.
- **Expected Assertions**:
  - Open `contextMenu` is immediately dismissed (`contextMenu === null`).
  - `SpotlightSearch` modal opens centered on screen with backdrop blur.
  - Spotlight search input automatically gains focus.
  - User types `"terminal"` and hits `Enter`:
    - Spotlight modal dismisses (`spotlightOpen: false`).
    - Terminal app window launches/focuses in front of the maximized Projects window.
    - `activeWindowId` transitions to `'terminal'`.
    - TopMenuBar updates dynamic app title to "**Terminal**".

#### Combination 3: Theme Toggle During Expanded Audio Deck with Active Visualizer & Vinyl Spin (C3)
- **Subsystems**: Theme Engine (CSS Custom Properties) + Audio Deck (`AudioDeckExpandedCard`, `z-9992`) + Vinyl Disc Assembly + Audio Visualizer Canvas.
- **Initial State**:
  - `theme: 'dark'`, dark tokens applied (`--bg-glass: rgba(18,18,22,0.85)`).
  - Music is playing (`status: 'playing'`).
  - Audio Deck is expanded (`isDeckExpanded: true`).
  - Vinyl disc rotating via CSS animation `animation: spin 3s linear infinite`.
  - Visualizer canvas running `requestAnimationFrame` loop rendering frequency bars in dark theme accent (`#38bdf8`).
- **Action Sequence**:
  1. User presses `Cmd+Shift+D` to switch theme to `'light'`.
- **Expected Assertions**:
  - Document root class swaps from `.dark` to `.light`.
  - Audio Deck glassmorphism background smoothly transitions to light token (`rgba(255,255,255,0.75)` with `backdrop-filter: blur(32px)`).
  - Vinyl disc rotation animation continues spinning at exact current angle without resetting to $0^\circ$.
  - Visualizer canvas updates bar stroke/fill palette to light theme accent (`#0284c7`) on next animation frame.
  - Audio playback state, volume, and scrubber position remain unaffected.

#### Combination 4: Dock Magnification vs Window Drag Pointer Capture (C4)
- **Subsystems**: Luca Parabolic Dock (`z-9990`) + Window Frame Dragging (`z-20..49`) + Kinetic Cursor State Machine.
- **Initial State**:
  - Dock positioned at bottom center ($y \approx \text{vh} - 70$).
  - Window 'about' focused at $(400, 300)$.
- **Action Sequence**:
  1. User initiates drag on About window header.
  2. Cursor state machine transitions to `variant: 'precision-drag'` (Aura ring collapses to $0\text{px}$).
  3. Dragging pointer moves across the dock region ($y \in [\text{vh} - 80, \text{vh}]$).
- **Expected Assertions**:
  - Window frame retains pointer capture; window follows cursor across the dock.
  - Dock icons do **NOT** expand under the dragged window cursor (magnification is disabled or ignored during active window drag to eliminate jitter).
  - Releasing pointer over dock area drops the window at that coordinate ($y$ clamped so overhang rules hold); does **NOT** trigger an accidental dock app launch.
  - Cursor state machine transitions back to `variant: 'kinetic-hero'` or `'precision-default'`.

#### Combination 5: Ambient Mode Transition with Multiple Open Windows & Active Music Stream (C5)
- **Subsystems**: `useOSStore` Desktop Mode (`workspace` $\leftrightarrow$ `ambient-hero`) + Window System Opacity + Kinetic Typography Stage (`KineticHeroStage`, `z-0`) + SplitText Physics Engine.
- **Initial State**:
  - `desktopMode: 'workspace'`.
  - 4 windows open (Terminal, Finder, About, Projects) at various $(x,y)$ coordinates.
  - `KineticHeroStage` rendering at reduced workspace opacity ($0.35$).
  - Music is playing.
- **Action Sequence**:
  1. User presses `Cmd+Option+M`.
- **Expected Assertions**:
  - `useOSStore.desktopMode` transitions to `'ambient-hero'`.
  - All 4 open windows animate opacity $1.0 \to 0.0$ (or translate off-screen) over $400\text{ms}$ with `pointer-events: none`.
  - `KineticHeroStage` opacity transitions from $0.35 \to 1.0$.
  - Moving cursor over hero text produces full-amplitude particle displacement ($\Delta \le 65\text{px}$) with active spring recovery.
  - Music playback continues without audio interruption.
  - User presses `Cmd+Option+M` again:
    - `desktopMode` transitions back to `'workspace'`.
    - All 4 windows restore opacity to $1.0$, restoring their exact previous positions, sizes, and z-index stack.

#### Combination 6: Real-time Responsive Resize Across 768px Threshold (C6)
- **Subsystems**: Responsive Engine + Window Manager $\leftrightarrow$ MobileBottomSheet + Luca Dock $\leftrightarrow$ MobileTabBar + Music Pill $\leftrightarrow$ MobileStickyAudioBar.
- **Initial State**:
  - Viewport width: $1024\text{px}$ (Desktop paradigm).
  - Window 'finder' open and focused.
  - Music playing via Dock Pill.
- **Action Sequence**:
  1. Viewport dynamically resized to $390\text{px}$ (Mobile paradigm).
- **Expected Assertions**:
  - Floating `WindowFrame` unmounts/hides; `MobileBottomSheet` mounts at $92\text{vh}$ displaying Finder app content.
  - Desktop icon grid and Luca Parabolic Dock unmount/hide.
  - `MobileTabBar` ($52\text{px}$) mounts at bottom with core navigation icons.
  - `MobileStickyAudioBar` ($44\text{px}$) mounts directly above tab bar displaying current track artwork, title, and mini play/pause button.
  - `useMusicStore.status` remains `'playing'`; `currentTime` advances uninterrupted.
  - Custom `KineticCursor` unmounts (`pointer: coarse` / mobile mode).

#### Combination 7: Keyboard Shortcut Isolation During Active Input Focus (C7)
- **Subsystems**: Shortcut Registry (`useKeyboardShortcuts`) + Terminal CLI Input / Mail Form Fields + Window Management.
- **Initial State**:
  - TerminalApp open with active command prompt `<input autofocus />`.
- **Action Sequence**:
  1. User types characters that match shortcut keys without modifiers: `"w"`, `"m"`, `"k"`, `"d"`.
  2. User presses `Cmd+W`.
- **Expected Assertions**:
  - Bare keystrokes (`"w"`, `"m"`, `"k"`, `"d"`) are received by the Terminal `<input>` field (`input.value === "wmkd"`).
  - No global actions (close window, minimize, spotlight, theme toggle) are triggered by bare keys.
  - Pressing `Cmd+W` (with modifier) correctly closes the active Terminal window.

#### Combination 8: Selection Marquee Interaction with Window Layer Interception (C8)
- **Subsystems**: DesktopCanvas (`z-10`) + SelectionMarquee (`z-10`) + DesktopIcon Grid (`z-10`) + WindowFrame (`z-20..49`).
- **Initial State**:
  - Desktop icons present at $(92\text{px}, 104\text{px})$ grid coordinates.
  - Window 'about' positioned over a subset of desktop icons.
- **Action Sequence**:
  1. User begins dragging marquee from empty desktop $(50, 50)$ across the screen to $(600, 600)$, crossing over the About window.
- **Expected Assertions**:
  - Selection marquee rectangle draws on DesktopCanvas (`z-10`).
  - Desktop icons whose bounding boxes intersect the marquee become selected (`isSelected: true`).
  - The WindowFrame (`z-20`) sits above the marquee layer visually; clicking inside the window content does not trigger marquee selection.

---

## 4. Tier 4: Real-World End-to-End User Scenarios

Tier 4 defines 5 multi-step, realistic user workflows that validate the complete application under human-like usage journeys.

### 4.1 Scenario 1: Terminal Power User Workflow

```
[Dock Launch] ──► [Terminal Open] ──► [help Command] ──► [projects Command] ──► [theme light] ──► [clear & exit]
```

- **Objective**: Verify CLI parsing, dynamic app launching via terminal, live theme modification via CLI, terminal viewport management, and clean window teardown.
- **Step-by-step Execution & Assertions**:
  1. **Launch**: User clicks the Terminal icon in the Luca Dock.
     - *Assertion*: Dock icon performs launch bounce; Terminal `WindowFrame` opens within $280\text{ms}$ with active glassmorphic shadow; dynamic menu bar displays "**Terminal**".
  2. **Prompt Verification**: Terminal prompt renders with `visitor@macos-portfolio:~$ ` and blinking caret.
     - *Assertion*: CLI input is automatically focused (`document.activeElement === terminalInput`).
  3. **Help Command**: User types `help` and hits `Enter`.
     - *Assertion*: Terminal displays formatted command list (`about`, `projects`, `skills`, `theme <dark|light>`, `audio <play|pause|next>`, `clear`, `contact`, `exit`).
  4. **Launch App via CLI**: User types `projects` and hits `Enter`.
     - *Assertion*: Projects window opens in cascade $(x_0 + 24, y_0 + 24)$; `activeWindowId` shifts to `'projects'`; dynamic menu bar updates to "**Projects**".
  5. **Theme Switch via CLI**: User clicks back into Terminal, types `theme light`, and hits `Enter`.
     - *Assertion*: `useOSStore.theme` updates to `'light'`; document root applies `.light`; both Terminal and Projects windows update glassmorphic theme styling without flicker.
  6. **Clear Scrollback**: User types `clear` and hits `Enter`.
     - *Assertion*: Terminal history is cleared, displaying a fresh prompt at the top.
  7. **Exit & Teardown**: User types `exit` and hits `Enter`.
     - *Assertion*: Terminal window plays $180\text{ms}$ close animation and unmounts; focus automatically shifts to the Projects window.

### 4.2 Scenario 2: Music Enthusiast Listening Session

```
[Music Pill Click] ──► [Playback Start] ──► [Deck Expand] ──► [Scrubbing & Volume] ──► [Track Next] ──► [Shuffle/Repeat] ──► [Collapse]
```

- **Objective**: Verify AudioContext gesture initialization, Dock pill magnification, full AudioDeck expansion, vinyl rotation, FFT visualizer animation, interactive scrubbing, volume attenuation, and deck collapse.
- **Step-by-step Execution & Assertions**:
  1. **First Gesture Init**: User clicks the `MusicPlayerDockPill` in the Luca Dock.
     - *Assertion*: `GlobalAudioManager` initializes `AudioContext` (`state: 'running'`); track 1 begins playing; equalizer mini-bars animate in dock pill.
  2. **Deck Expansion**: User clicks the expanded card trigger on the dock pill.
     - *Assertion*: `AudioDeckExpandedCard` enters with spring animation ($y: 20 \to 0$, opacity $0 \to 1$); vinyl disc assembly ($200\text{px}$) begins 3-second continuous rotation; album artwork renders sharply.
  3. **Visualizer Rendering**: FFT AnalyserNode streams frequency data to `AudioVisualizerCanvas`.
     - *Assertion*: Real-time frequency bars animate with non-zero heights corresponding to audio amplitude.
  4. **Interactive Scrubbing**: User clicks and drags the `InteractiveScrubber` handle from $10\%$ to $60\%$ of track duration ($1:48$).
     - *Assertion*: Timestamp tooltip displays `"1:48"`; on pointer release, `currentTime` updates to $108\text{s}$; audio stream jumps cleanly without clicks or pops.
  5. **Volume Adjustment**: User drags volume slider to $40\%$.
     - *Assertion*: `useMusicStore.volume === 0.4`; audio output attenuates proportionally; volume icon reflects low-medium state.
  6. **Next Track & Metadata Update**: User clicks "Next Track" button.
     - *Assertion*: Track 2 loads; title, artist, and cover art crossfade smoothly; vinyl disc maintains spin; visualizer continues animating.
  7. **Shuffle & Repeat**: User clicks Shuffle (active tint applies) and clicks Repeat twice (cycles `off` $\to$ `all` $\to$ `one`).
     - *Assertion*: Store states `isShuffled: true`, `repeatMode: 'one'` update and persist to `localStorage`.
  8. **Collapse Deck**: User clicks the deck collapse button.
     - *Assertion*: `AudioDeckExpandedCard` exits with $200\text{ms}$ animation; dock pill returns to compact view with playing state intact.

### 4.3 Scenario 3: Portfolio Explorer & Contact Mailer Journey

```
[Desktop Icon Open] ──► [Filter Projects] ──► [Open Detail] ──► [Launch Mail] ──► [Form Submit] ──► [Toast & Close]
```

- **Objective**: Verify desktop icon double-click launch, Projects gallery filtering, modal detail overlay, inter-app communication launching MailApp, form validation, and simulated submission.
- **Step-by-step Execution & Assertions**:
  1. **Launch Projects**: User double-clicks "Projects" desktop icon.
     - *Assertion*: Projects window opens ($680 \times 480\text{px}$, centered); grid of project cards renders with cover images and tech tags.
  2. **Filter by Tag**: User clicks "TypeScript" filter pill.
     - *Assertion*: Project grid filters with smooth layout transition; only projects tagged with "TypeScript" remain visible.
  3. **Open Project Detail**: User clicks on "macOS Portfolio Showcase" card.
     - *Assertion*: Project detail modal expands within window showing full case study, architecture diagrams, and action buttons ("Live Demo", "Source", "Contact Me").
  4. **Trigger Contact**: User clicks "Contact Me" button inside project detail.
     - *Assertion*: `MailApp` window launches and focuses in front of Projects window (`zIndex` higher); `subject` field pre-populated with `"Inquiry regarding macOS Portfolio Showcase"`.
  5. **Form Interaction & Validation**: User enters Name `"Jane Doe"`, Email `"jane@example.com"`, and Message `"Great work! Let's connect."`.
     - *Assertion*: Form inputs validate in real-time; "Send Message" button becomes active.
  6. **Submission**: User clicks "Send Message".
     - *Assertion*: Button enters loading state with spinner; resolves after $500\text{ms}$; displays success checkmark and toast notification; form resets.
  7. **Close Mail & Refocus**: User clicks red traffic light on Mail window.
     - *Assertion*: Mail window closes; Projects window regains focus with active shadow.

### 4.4 Scenario 4: Mobile Visitor Journey (<768px Viewport)

```
[Mobile Viewport] ──► [Tab Bar Nav] ──► [92vh BottomSheet] ──► [Internal Scroll] ──► [Swipe Dismiss] ──► [Mobile Audio Bar]
```

- **Objective**: Verify complete mobile responsive paradigm, bottom sheet navigation, gesture-based swipe dismissal ($140\text{px}$ threshold), scroll protection, and mobile sticky audio controls.
- **Step-by-step Execution & Assertions**:
  1. **Mobile Initialization**: Test environment sets viewport to $390 \times 844\text{px}$ with touch event simulation.
     - *Assertion*: Desktop icons and Luca Dock are hidden; `MobileTabBar` ($52\text{px}$) mounts at bottom; `KineticCursor` is disabled.
  2. **Open Bottom Sheet**: User single-taps "About" icon on `MobileTabBar`.
     - *Assertion*: `MobileBottomSheet` slides up from bottom to $92\text{vh}$ height with rounded top corners ($16\text{px}$) and grab handle.
  3. **Scroll Protection Validation**: User scrolls down within the About content to $y = 300\text{px}$, then drags downward $80\text{px}$.
     - *Assertion*: Sheet content scrolls normally; because `scrollTop > 0`, the bottom sheet does **NOT** dismiss or translate downward.
  4. **Swipe-to-Dismiss**: User scrolls back to $y = 0$, then drags the grab handle downward by $160\text{px}$ and releases.
     - *Assertion*: Drag exceeds the $140\text{px}$ threshold; sheet smoothly animates off-screen and unmounts.
  5. **Mobile Music Interaction**: User taps Play on `MobileStickyAudioBar` ($44\text{px}$, positioned above tab bar).
     - *Assertion*: Audio starts; mini artwork rotates; tapping the bar opens full-screen mobile music player sheet with full transport controls.

### 4.5 Scenario 5: Multi-Tasking Workspace & System Personalization

```
[4 Concurrent Windows] ──► [Z-Index Reordering] ──► [Settings Personalization] ──► [Ambient Mode Toggle] ──► [Workspace Restore]
```

- **Objective**: Verify multi-window concurrency, cascade positioning, focus management, settings persistence (wallpaper, sounds, dock), and seamless transitions between Workspace and Ambient Hero modes.
- **Step-by-step Execution & Assertions**:
  1. **Spawn 4 Apps**: User opens Finder, About, Settings, and Terminal.
     - *Assertion*: 4 distinct windows render in DOM; each positioned with $+24\text{px}$ cascade offset; Terminal is top-most (`zIndex: 23`, `isFocused: true`).
  2. **Focus Reordering**: User clicks on Finder window body.
     - *Assertion*: Finder `zIndex` promoted to $24$; active shadow applied; Terminal shadow transitions to inactive ($150\text{ms}$).
  3. **Settings Personalization**: User focuses SettingsApp:
     - Selects wallpaper `"Sonoma Dark"` $\to$ `useOSStore.wallpaperId` updates; wallpaper layer updates; saved to `localStorage`.
     - Toggles "Dock Magnification" to `false` $\to$ dock magnification curve disabled in store.
     - Toggles "Sound Effects" to `false` $\to$ `soundEnabled: false`.
  4. **Ambient Hero Switch**: User presses `Cmd+Option+M`.
     - *Assertion*: `desktopMode` switches to `'ambient-hero'`; all 4 windows fade out smoothly ($400\text{ms}$); `KineticHeroStage` gains full $100\%$ opacity; typography reacts to pointer physics.
  5. **Workspace Restore**: User presses `Cmd+Option+M` again.
     - *Assertion*: `desktopMode` switches back to `'workspace'`; all 4 windows fade back in with exact previous coordinates, sizes, and z-index ordering intact.

---

## 5. Blueprint for `TEST_INFRA.md`

`TEST_INFRA.md` is the engineering blueprint for the test runner, browser API mocks, custom Vitest matchers, and simulation utilities.

### 5.1 Architecture Overview
- **Runner**: Vitest (v1.6+) in `jsdom` environment.
- **Assertions**: Vitest built-ins + `@testing-library/jest-dom` + Custom Domain Matchers.
- **Coverage Provider**: `@vitest/coverage-v8` with strict thresholds ($>90\%$ lines, $>85\%$ branches).

### 5.2 Global Mocks Specification (`tests/setup.ts`)

```typescript
// Web Audio API Mock Suite
export class MockAudioContext {
  state: AudioContextState = 'suspended';
  sampleRate = 44100;
  currentTime = 0;
  destination = {};

  createGain() {
    return {
      gain: {
        value: 1.0,
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }

  createAnalyser() {
    return {
      fftSize: 64,
      frequencyBinCount: 32,
      getByteFrequencyData: vi.fn((array: Uint8Array) => array.fill(128)),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }

  createMediaElementSource() {
    return { connect: vi.fn(), disconnect: vi.fn() };
  }

  resume = vi.fn(async () => { this.state = 'running'; });
  suspend = vi.fn(async () => { this.state = 'suspended'; });
  close = vi.fn(async () => { this.state = 'closed'; });
}

// Canvas 2D Context Mock
export function mockCanvasContext() {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    drawImage: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  })) as any;
}

// DOM Observers Mock
export function mockDOMObservers() {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}
```

### 5.3 Custom Matchers Specification (`tests/helpers/matchers.ts`)

- `toHaveGlassmorphism(expectedBlur, expectedSaturation)`: Verifies `backdrop-filter` contains `blur(Xpx)` and `saturate(Y%)`.
- `toBeWithinViewportBounds(viewport)`: Asserts element rect satisfies $y \ge 28$, $x \ge -(w-100)$, $x \le \text{vw}-100$, $y \le \text{vh}-100$.
- `toHaveZIndexLayer(layerName)`: Asserts z-index matches assigned system layer (`Layer 0: 0`, `Layer 1: 10`, `Layer 2: 20-49`, `Layer 3: 50`, `Layer 4: 9990`, `Layer 5: 9992`, `Layer 6: 9995`, `Layer 7: 9999`).
- `toHaveDuckedGain(expectedDuckLevel, tolerance)`: Asserts Web Audio gain node equals $0.20 \pm 0.01$.

### 5.4 Test Simulation Helpers (`tests/helpers/simulation.ts`)

- `simulateDrag(element: HTMLElement, from: {x, y}, to: {x, y}, steps = 10)`: Dispatches sequence of `pointerdown`, interpolated `pointermove`, and `pointerup` events with proper coordinates and pointer capture.
- `simulateResize(handle: HTMLElement, delta: {x, y})`: Dispatches drag events on window resize handle with `nwse-resize` / `nesw-resize` targets.
- `simulateMarquee(canvas: HTMLElement, start: {x, y}, end: {x, y})`: Dispatches desktop surface drag to trigger selection box.
- `simulateShortcut(key: string, modifiers: { meta?, shift?, alt?, ctrl? })`: Dispatches standardized `keydown` events with accurate `key`, `code`, and modifier flags.
- `simulateSwipe(element: HTMLElement, deltaY: number)`: Dispatches `touchstart`, `touchmove`, and `touchend` events for mobile sheet dismissal.

---

## 6. Blueprint for `TEST_READY.md`

`TEST_READY.md` serves as the operational gate and verification contract for Phase 3 implementation sprints.

### 6.1 Phase 3 Sprint Quality Gate Mapping

| Sprint | Milestones Tested | Required Test Suites | Passing Criteria |
|---|---|---|---|
| **Sprint 1** | Core OS Framework (Desktop, Wallpaper, MenuBar, Shortcuts, Theme) | `tests/tier1-features/desktop.test.tsx`, `shortcuts.test.tsx`, `persistence.test.tsx`, `visual-conformance/chrome.test.tsx` | $100\%$ pass on Desktop #1-7, Shortcuts #69-74, Visual #1-9, #59 |
| **Sprint 2** | Window Management & 6 Apps (TrafficLights, Drag/Resize, Cascade) | `tests/tier1-features/windows.test.tsx`, `tests/tier2-boundaries/windows.test.tsx` | $100\%$ pass on Windows #8-24, Boundaries T2-WIN-01..09, Visual #10-23 |
| **Sprint 3** | Parabolic Dock & Audio Pipeline (Luca Dock, Music Player, Ducking) | `tests/tier1-features/dock.test.tsx`, `music.test.tsx`, `audio-ducking.test.tsx`, `tier2-boundaries/audio.test.tsx`, `tier3-cross-feature/audio-window.test.tsx` | $100\%$ pass on Dock #25-36, Music #37-53, Ducking #85-86, T2-AUD-01..08, C1, C3, C4, Visual #24-45 |
| **Sprint 4** | Kinetic Typography & Cursor FSM (SplitText, Euler ODE, Aura Ring) | `tests/tier1-features/typography.test.tsx`, `cursor.test.tsx`, `tier2-boundaries/pointer.test.tsx`, `tier3-cross-feature/ambient.test.tsx` | $100\%$ pass on Cursor #54-60, Typography #61-68, T2-PTR-01..05, C5, Visual #46-58 |
| **Sprint 5** | Mobile Responsive, E2E Scenarios & Final Sign-Off | `tests/tier1-features/mobile.test.tsx`, `tier3-cross-feature/responsive.test.tsx`, `tier4-scenarios/*.test.tsx` | $100\%$ pass on Mobile #75-84, Scenarios 1-5, C6-C8, Visual #60-64 |

### 6.2 Test Command Execution Index

```bash
# Full test suite execution across all tiers
npm test

# Feature-specific tier runs
npm run test:tier1          # Run Tier 1 Feature Coverage (90 functional tests)
npm run test:tier2          # Run Tier 2 Boundary & Negative Suite
npm run test:tier3          # Run Tier 3 Cross-Feature Combination Suite
npm run test:tier4          # Run Tier 4 Real-World E2E Scenarios
npm run test:visual         # Run Visual Conformance Criteria (64 visual rules)

# End-to-End browser execution (Playwright)
npm run test:e2e

# Coverage analysis and reporting
npm run test:coverage
```

### 6.3 Pass/Fail Tolerance Thresholds & Regression Protocol

- **Animation Durations**: Measured via `performance.now()` in mock timers; tolerance $\pm 25\text{ms}$.
- **Coordinate Clamping**: Exact pixel matching ($y = 28\text{px}$, overhang minimum $100\text{px}$).
- **Audio Ducking Level**: $0.20 \pm 0.01$ (within $1\%$ gain tolerance).
- **Parabolic Magnification**: Cosine bell curve deviation $< 0.5\text{px}$ across $150\text{px}$ radius.
- **Zero-Tolerance Regressions**: Any failure in Tier 1 (#1-90) or Tier 2 boundary clamping blocks pull requests and sprint progression.

---

## 7. Conclusion & Next Steps

This analysis provides the complete design, test cases, and architectural blueprints for Tiers 2, 3, 4 and test infrastructure documentation. Together with Explorer 1 (Runner/Mocks) and Explorer 2 (Tier 1 Mapping), the E2E Testing Track is fully specified and ready for test file generation.
