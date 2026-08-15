# Interaction Validation Matrix — Functional QA Checklist
## Phase 2 QA Document

---

## Purpose
This matrix defines every testable interaction for functional QA. Each row is a discrete test case with input, expected result, and pass/fail criteria.

---

## Desktop Interactions

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 1 | Click empty desktop | Left-click on desktop surface | All icon selections cleared, context menus dismissed | No selected icons, no visible menus |
| 2 | Right-click desktop | Right-click on empty desktop | Context menu appears at click position | Menu visible, clamped within viewport |
| 3 | Selection marquee | Click+drag on empty desktop | Blue rubber-band rectangle appears | Rectangle follows mouse, releases on mouseup |
| 4 | Marquee multi-select | Drag marquee over multiple icons | Intersecting icons become selected | Selected icons show highlight bg |
| 5 | Double-click icon | Double-click desktop icon | App window opens with spring animation | Window appears, 280ms animation, focused |
| 6 | Single-click icon | Single click desktop icon (wait 300ms) | Icon selected, no app launch | Icon highlighted, no window opened |
| 7 | Icon hover | Mouse hover over desktop icon | Scale 1.05x, highlight background | Subtle grow + bg visible |

## Window Management

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 8 | Open window | Launch any app | Window opens with scale+opacity+blur animation | Smooth 280ms spring animation |
| 9 | Close window (traffic light) | Click red traffic light | Window closes with shrink+fade animation | 180ms, window removed from DOM |
| 10 | Close window (Cmd+W) | Press Cmd+W with focused window | Same as red traffic light | Window closes, focus shifts |
| 11 | Minimize window | Click yellow traffic light | Window shrinks toward dock | 320ms, window hidden, dot indicator remains |
| 12 | Minimize (Cmd+M) | Press Cmd+M with focused window | Same as yellow traffic light | Window minimizes |
| 13 | Maximize window | Click green traffic light | Window fills viewport minus menu bar, radius→0 | 320ms transition, no overshoot |
| 14 | Un-maximize window | Click green on maximized window | Window returns to previous bounds | Radius→12px, previous size/position |
| 15 | Maximize (double-click header) | Double-click window header | Same as green traffic light | Maximizes correctly |
| 16 | Drag window | Drag window header | Window follows cursor | Smooth tracking, no lag |
| 17 | Drag clamp Y | Drag window above menu bar | Window clamped at y=28 | Cannot cover menu bar |
| 18 | Drag overhang | Drag window mostly off-screen | 100px minimum visible | Window partially visible |
| 19 | Resize window (SE corner) | Drag SE corner resize handle | Window resizes from bottom-right | Smooth, cursor: nwse-resize |
| 20 | Resize minimum | Resize window very small | Enforced at 360×240px | Cannot go smaller |
| 21 | Focus window | Click on unfocused window | Window comes to front, shadow transitions | z-index bumped, 150ms shadow change |
| 22 | Cascade spawn | Open 3 windows of same app | Each offset by 24px | Visible cascade pattern |
| 23 | Traffic lights unfocused | Click elsewhere, observe traffic lights | Buttons become gray dots | No colored circles when unfocused |
| 24 | Traffic lights hover glyphs | Hover over traffic lights | ✕ − ⤢ glyphs appear | Glyphs visible only on hover |

## Dock

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 25 | Dock magnification | Move mouse across dock slowly | Icons smoothly grow/shrink based on proximity | Cosine bell curve, upward growth |
| 26 | Dock mouse leave | Move mouse away from dock | All icons spring back to 44px | Smooth spring animation |
| 27 | Dock click (app closed) | Click dock icon for closed app | App opens + launch bounce | Window appears, icon bounces |
| 28 | Dock click (app open, unfocused) | Click dock icon for open but unfocused app | App window comes to front | Window focused |
| 29 | Dock click (app minimized) | Click dock icon for minimized app | App window restores | Reverse minimize animation |
| 30 | Dock press squash | Pointer down on dock icon | Icon scales to 0.88x | Spring squash visible |
| 31 | Dock press release | Pointer up after press | Icon springs back to 1.0x | Spring recovery |
| 32 | Dock tooltip | Hover on dock icon (hold still) | Tooltip label appears above | Spring entrance animation |
| 33 | Dock tooltip dismiss | Move away from dock icon | Tooltip fades out | 100ms fade |
| 34 | Active dot visible | Open an app | Dot appears below dock icon | 3px white dot with glow |
| 35 | Active dot minimized | Minimize an app | Dot dims | Reduced opacity |
| 36 | Active dot removed | Close an app | Dot disappears | No dot below icon |

## Music Player

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 37 | No autoplay | Page load | Music player in IDLE state, no audio playing | Silence, play icon shown |
| 38 | First play click | Click play button | AudioContext created, music starts, eq animates | Audio audible, eq bars moving |
| 39 | Pause | Click pause button | Music pauses, eq freezes, vinyl stops | Audio stops, visual state frozen |
| 40 | Resume | Click play after pause | Music resumes from same position | Audio continues, animations resume |
| 41 | Next track | Click next | Next track loads and plays | New metadata displayed |
| 42 | Previous (>3s) | Click prev after 3+ seconds | Track restarts from beginning | currentTime resets to 0 |
| 43 | Previous (<3s) | Click prev within 3 seconds | Previous track loads | Previous track plays |
| 44 | Expand deck | Click music pill | AudioDeckExpandedCard appears | Spring entrance, vinyl visible |
| 45 | Collapse deck | Click collapse button | Deck animates out | 200ms exit animation |
| 46 | Progress scrub | Drag scrubber handle | Audio seeks to new position | currentTime updates, audio jumps |
| 47 | Volume change | Drag volume slider | Volume changes | Audible volume difference |
| 48 | Mute toggle | Click mute button | Audio muted/unmuted | Icon changes, audio silences |
| 49 | Shuffle toggle | Click shuffle button | Playlist order randomized | Button tinted, playback order changes |
| 50 | Repeat cycle | Click repeat 3 times | Off → All → One → Off | Icon changes for each state |
| 51 | Vinyl spin | Play music | Vinyl disc rotates at 3s period | Continuous rotation, pauses on pause |
| 52 | Track end | Let track finish | Auto-advances to next track (if repeat ≠ one) | Next track starts |
| 53 | Repeat one | Enable repeat one, let track end | Same track restarts | Track loops |

## Cursor

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 54 | Precision dot tracking | Move mouse | 4px white dot follows instantly | Zero visible lag |
| 55 | Aura ring lag | Move mouse quickly | Ring visibly trails behind dot | Noticeable lerp lag |
| 56 | Aura velocity expansion | Move mouse very fast | Ring grows larger (up to 80px) | Visible size increase |
| 57 | Aura difference blend | Move over dark and light areas | Ring inverts colors | White on dark, dark on light |
| 58 | Cursor over resize handle | Hover over window resize handle | Aura collapses, native cursor shown | Ring disappears over 100ms |
| 59 | Cursor over dock item | Hover over dock icon | Aura morphs to squircle | Shape change, magnetic snap |
| 60 | Cursor hidden mobile | Open on touch device | No cursor elements visible | Dot + aura both absent |

## Kinetic Typography

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 61 | Character displacement | Move cursor over hero text | Characters near cursor push away | Visible displacement, up to 65px |
| 62 | Spring return | Move cursor away | Characters spring back with overshoot | Underdamped oscillation visible |
| 63 | Gaussian falloff | Move cursor near edge of influence | Far characters barely move, close ones move strongly | Gradient of displacement |
| 64 | Variable font weight | Move cursor near text | Characters near cursor become bolder | Weight 400→900 visible |
| 65 | Workspace mode | Open a window | Hero text reduces to 35% opacity | Text dimmed behind windows |
| 66 | Ambient mode toggle | Press Cmd+Option+M | Windows fade, hero text goes to 100% | Mode switch visible |
| 67 | Ambient wave (idle) | Leave cursor off-screen | Characters gently wave | Subtle horizontal oscillation |
| 68 | 60fps performance | Move cursor rapidly | No dropped frames or stutter | DevTools frame rate ≥55fps |

## Keyboard Shortcuts

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 69 | Spotlight open | Cmd+K | Spotlight search modal appears | Modal visible, input focused |
| 70 | Spotlight dismiss | Escape (spotlight open) | Spotlight closes | Modal removed |
| 71 | Close window | Cmd+W (window focused) | Active window closes | Window gone |
| 72 | Minimize window | Cmd+M (window focused) | Active window minimizes | Window minimized |
| 73 | Theme toggle | Cmd+Shift+D | Dark↔Light theme toggle | All tokens swap |
| 74 | Ambient mode | Cmd+Option+M | Workspace↔Ambient toggle | Mode switches |

## Responsive / Mobile

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 75 | Mobile window → sheet | Resize to <768px | Windows become 92vh bottom sheets | Full-width, rounded top |
| 76 | Sheet swipe dismiss | Swipe down >140px on sheet | Sheet dismissed | Smooth dismiss animation |
| 77 | Sheet swipe cancel | Swipe down <140px on sheet | Sheet springs back | Returns to full position |
| 78 | Sheet scroll protection | Scroll content down, then swipe | No dismiss triggered | Internal scroll works |
| 79 | Tab bar visible | <768px viewport | Bottom tab bar with app icons | 52px + safe-area |
| 80 | Mobile music bar | <768px with music | 44px sticky bar above tab | Artwork, title, play/pause |
| 81 | Music bar expand | Tap mobile music bar | Fullscreen player sheet | Full controls visible |
| 82 | Dock hidden mobile | <768px viewport | No floating dock | Tab bar replaces dock |
| 83 | Icons hidden mobile | <768px viewport | No desktop icons | Apps via tab bar only |
| 84 | Touch single-tap launch | Single tap tab bar icon | App opens as bottom sheet | No double-click needed |

## Audio Ducking

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 85 | Music duck on UI sound | Play music, then open a window | Music briefly ducks to 20% | Volume dip audible, recovers in ~250ms |
| 86 | No duck when music off | Open window with no music | UI sound plays at normal volume | No silence/error |

## Theme Persistence

| # | Test Case | Input | Expected Result | Pass Criteria |
|---|-----------|-------|----------------|---------------|
| 87 | Theme persists | Set dark mode, reload page | Dark mode restored | No flash of wrong theme |
| 88 | Wallpaper persists | Change wallpaper, reload | Same wallpaper shown | Correct image |
| 89 | Music position persists | Play track to 1:30, reload | Track resumes near 1:30 | Within ±5s of saved position |
| 90 | Volume persists | Set volume to 30%, reload | Volume at 30% | Correct level |

