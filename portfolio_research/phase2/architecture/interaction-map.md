# Interaction Map — Complete Interaction Matrix
## Phase 2 Architecture Document

---

## Desktop Interactions

| Component | Input | Condition | Action | Result | Confidence |
|-----------|-------|-----------|--------|--------|------------|
| DesktopCanvas | Single Click | Empty area | Clear all icon selections, dismiss menus | All icons deselected, context menu closed | CONFIRMED |
| DesktopCanvas | Right Click | Empty area | Show desktop context menu | Context menu at click position (clamped) | CONFIRMED |
| DesktopCanvas | Click + Drag | Empty area | Start selection marquee | Blue rubber-band rectangle, select intersecting icons | CONFIRMED |
| DesktopCanvas | Double Click | Empty area, ambient mode disabled | Toggle ambient/workspace mode | Windows fade, hero typography activates | PROBABLE |
| DesktopIcon | Single Click (desktop) | Default | Select icon | Highlight with bg-white/15, deselect others | CONFIRMED |
| DesktopIcon | Double Click (desktop) | Default | Launch app | Open window with spring animation (280ms) | CONFIRMED |
| DesktopIcon | Single Tap (mobile) | Touch device | Launch app directly | Open bottom sheet | CONFIRMED |
| DesktopIcon | Right Click | Selected | Show icon context menu | Context menu with Open, Get Info, Move to Trash | CONFIRMED |

## Window Interactions

| Component | Input | Condition | Action | Result | Confidence |
|-----------|-------|-----------|--------|--------|------------|
| WindowFrame | Click anywhere | Not focused | Focus window | z-index = max + 1, shadow transitions to active | CONFIRMED |
| Window Header | Pointer drag | Not maximized | Move window | Position updated with clamping (y≥28, partial overhang) | CONFIRMED |
| Window Header | Double click | Not maximized | Maximize | Fill viewport minus menu bar, radius → 0 | CONFIRMED |
| Window Header | Double click | Maximized | Restore | Return to prevBounds, radius → 12px | CONFIRMED |
| Traffic Light (Red) | Click | Window open | Close window | Scale [1→0.88], opacity → 0, blur, 180ms | CONFIRMED |
| Traffic Light (Yellow) | Click | Window open | Minimize | Scale → 0.1, y → dock, 320ms, focus shifts | CONFIRMED |
| Traffic Light (Green) | Click | Not maximized | Maximize | Fill screen, 320ms transition | CONFIRMED |
| Traffic Light (Green) | Click | Maximized | Restore | Return to previous bounds | CONFIRMED |
| Resize Handle (8-dir) | Pointer drag | Not maximized | Resize window | Min 360×240, clamped to viewport | CONFIRMED |
| Window Content | Scroll | Default | Internal scroll | Content viewport scrolls, window stays | CONFIRMED |

## Dock Interactions (Luca)

| Component | Input | Condition | Action | Result | Confidence |
|-----------|-------|-----------|--------|--------|------------|
| Dock Chassis | Mouse enter | Desktop (≥768px) | Activate magnification | Items begin responding to mouseX proximity | CONFIRMED |
| Dock Chassis | Mouse leave | Magnification active | Deactivate magnification | All items spring back to base size (44px) | CONFIRMED |
| DockItem | Mouse proximity | Distance d ≤ 150px | Magnify icon | Width: Cosine Bell W(d) = 44 + 24·(1+cos(πd/150))/2 | CONFIRMED |
| DockItem | Click | App not open | Launch app | Window opens with bounce animation | CONFIRMED |
| DockItem | Click | App open, not focused | Focus app | Window brought to front (z-index bump) | CONFIRMED |
| DockItem | Click | App minimized | Restore app | Window un-minimizes with reverse animation | CONFIRMED |
| DockItem | Click | App focused | Minimize app | Window minimizes to dock | PROBABLE |
| DockItem | Pointer down | Any | Press squash | Scale 0.88x with spring (stiff:600, damp:20) | CONFIRMED |
| DockItem | Pointer up | After press | Release spring | Scale returns to 1.0 | CONFIRMED |
| DockItem | Hover (static) | Desktop | Show tooltip | Pill label appears with spring entrance | CONFIRMED |
| DockItem | Leave | Tooltip visible | Hide tooltip | Tooltip fades out (100ms) | CONFIRMED |

## Music Player Interactions (Nidal)

| Component | Input | Condition | Action | Result | Confidence |
|-----------|-------|-----------|--------|--------|------------|
| MusicPill | Click | Deck closed | Expand deck | AudioDeckExpandedCard appears with spring | CONFIRMED |
| MusicPill PlayBtn | Click | Status: IDLE/PAUSED | Play | Music starts, AudioContext resume, eq animates | CONFIRMED |
| MusicPill PlayBtn | Click | Status: PLAYING | Pause | Music pauses, eq freezes, vinyl stops | CONFIRMED |
| Play/Pause (Deck) | Click | IDLE | First play | AudioContext created on user gesture, loading → playing | CONFIRMED |
| Previous Button | Click | currentTime > 3s | Restart track | Seek to 0 | CONFIRMED |
| Previous Button | Click | currentTime ≤ 3s | Previous track | Load previous track (or last if index 0) | CONFIRMED |
| Next Button | Click | Default | Next track | Load next track (shuffle-aware) | CONFIRMED |
| Shuffle Button | Click | Off | Enable shuffle | Shuffle playlist order, button tinted | CONFIRMED |
| Shuffle Button | Click | On | Disable shuffle | Restore original order | CONFIRMED |
| Repeat Button | Click | Off | Repeat All | Icon tinted, loop playlist | CONFIRMED |
| Repeat Button | Click | All | Repeat One | "1" badge, loop current track | CONFIRMED |
| Repeat Button | Click | One | Repeat Off | Icon dimmed | CONFIRMED |
| Progress Scrubber | Hover | Playing/Paused | Show handle + timestamp | 12px handle visible, tooltip with time | CONFIRMED |
| Progress Scrubber | Drag | Any | Seek | currentTime updates, audio seeks | CONFIRMED |
| Volume Slider | Drag | Any | Change volume | GainNode value updates | CONFIRMED |
| Mute Button | Click | Not muted | Mute | Volume → 0, icon changes | CONFIRMED |
| Mute Button | Click | Muted | Unmute | Volume restores, icon changes | CONFIRMED |
| Collapse Button | Click | Deck open | Close deck | Deck exits (y→12, opacity→0, 200ms) | CONFIRMED |

## Cursor Interactions (Michal)

| Component | Input | Condition | Action | Result | Confidence |
|-----------|-------|-----------|--------|--------|------------|
| KineticHeroStage | Mouse move | Ambient hero mode | Typography displacement | Characters displaced by spring forces within R=260px | CONFIRMED |
| KineticHeroStage | Mouse move | Workspace mode | Reduced physics | Characters barely move (reduced force multiplier) | PROBABLE |
| SplitText chars | Cursor within R | R=260px | Apply spring force | Gaussian falloff α(d), displacement up to 65px | CONFIRMED |
| SplitText chars | Cursor beyond R | d > 260px | No force | Characters return to rest via spring (k=280, c=24) | CONFIRMED |
| CursorAura | Over desktop/canvas | kinetic-hero variant | Full kinetic ring | 24-80px ring, difference blend, lerp follow | CONFIRMED |
| CursorAura | Over window resize/drag | precision-drag variant | Collapse aura | Scale→0, opacity→0 over 100ms | CONFIRMED |
| CursorAura | Over dock item | magnetic-dock variant | Squircle morph | Aura morphs to squircle, snaps to item bounds | CONFIRMED |
| Touch screen | Touch start | Mobile | Touch ripple | Ripple emanates from touch point | CONFIRMED |
| Gyroscope | Tilt | Mobile, permission granted | Parallax displacement | Characters shift based on β, γ angles | CONFIRMED |

## Keyboard Shortcuts

| Shortcut | Scope | Action | Confidence |
|----------|-------|--------|------------|
| `Cmd/Ctrl + K` | Global | Toggle Spotlight Search | CONFIRMED |
| `Cmd/Ctrl + W` | Focused Window | Close current window | CONFIRMED |
| `Cmd/Ctrl + M` | Focused Window | Minimize current window | CONFIRMED |
| `Cmd/Ctrl + Option + M` | Global | Toggle ambient/workspace mode | CONFIRMED |
| `Cmd/Ctrl + Shift + D` | Global | Toggle dark/light theme | CONFIRMED |
| `Cmd/Ctrl + Option + T` | Global | Open/focus Terminal | CONFIRMED |
| `Escape` | Global | Dismiss modals/menus/spotlight | CONFIRMED |
| `Tab / Shift+Tab` | Modal | Focus trap within active window | CONFIRMED |

## Mobile-Specific Interactions

| Component | Input | Condition | Action | Result | Confidence |
|-----------|-------|-----------|--------|--------|------------|
| MobileBottomSheet | Swipe down | scrollTop === 0 | Start dismiss | Sheet begins to follow finger | CONFIRMED |
| MobileBottomSheet | Release | Swipe distance > 140px | Dismiss | Sheet animates out, app closes | CONFIRMED |
| MobileBottomSheet | Release | Swipe distance ≤ 140px | Cancel | Sheet springs back to full | CONFIRMED |
| MobileTabBar | Tap icon | Default | Open app | App opens as bottom sheet | CONFIRMED |
| MobileStickyAudioBar | Tap | Default | Expand player | Fullscreen music sheet | CONFIRMED |
| Context Menu | Long press (500ms) | Any surface | Show context menu | Menu appears at press position | PROBABLE |

