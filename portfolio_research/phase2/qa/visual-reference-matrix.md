# Visual Reference Matrix — QA Comparison Criteria
## Phase 2 QA Document

---

## Purpose
This matrix defines what to visually verify against source websites during Phase 5 QA. Each row specifies a feature, its reference source, expected behavior, and visual priority (P0 = must match exactly, P1 = must match closely, P2 = approximate acceptable).

---

## Core OS Chrome

| # | Feature | Reference Source | Expected Behavior | Priority |
|---|---------|-----------------|-------------------|----------|
| 1 | Menu bar height | irfannaikwade.in | Exactly 28px, fixed top, full width | P0 |
| 2 | Menu bar glassmorphism | irfannaikwade.in | `blur(40px)`, bg opacity matches dark/light tokens | P0 |
| 3 | Menu bar clock format | irfannaikwade.in | `Day Mon DD H:MM AM/PM` (e.g. "Sat Aug 15 12:51 PM") | P1 |
| 4 | Menu bar dynamic app name | irfannaikwade.in | Bold app name updates when active window changes | P0 |
| 5 | Status tray icons | irfannaikwade.in | Wi-Fi, Battery, Volume icons, 16×16px, 10px gap | P1 |
| 6 | Desktop background | irfannaikwade.in | Full-bleed wallpaper, object-cover, tint overlay | P0 |
| 7 | Desktop icon grid | irfannaikwade.in | Column-first flow, 92px cols, 104px rows, correct positioning | P0 |
| 8 | Desktop icon appearance | irfannaikwade.in | 48×48 icon, 11px white label with text shadow, 2-line clamp | P1 |
| 9 | Desktop icon hover | irfannaikwade.in | Scale 1.05x, bg-white/15 highlight, 150ms | P1 |

## Window System

| # | Feature | Reference Source | Expected Behavior | Priority |
|---|---------|-----------------|-------------------|----------|
| 10 | Window border radius | irfannaikwade.in | 12px rounded, 0px when maximized | P0 |
| 11 | Window glassmorphism | irfannaikwade.in | `blur(28px) saturate(180%)`, correct bg-opacity per theme | P0 |
| 12 | Traffic light buttons | irfannaikwade.in | 12px circles, correct RGB colors, 8px gap | P0 |
| 13 | Traffic light hover glyphs | irfannaikwade.in | ✕ − ⤢ glyphs appear on group hover, correct glyph colors | P1 |
| 14 | Traffic light unfocused | irfannaikwade.in | Gray dots when window not focused | P1 |
| 15 | Window active shadow | irfannaikwade.in | Multi-layer deep shadow, distinctly heavier than inactive | P0 |
| 16 | Window inactive shadow | irfannaikwade.in | Lighter multi-layer shadow | P0 |
| 17 | Window open animation | irfannaikwade.in | Scale 0.85→1, opacity 0→1, blur 8→0, ~280ms spring | P0 |
| 18 | Window close animation | irfannaikwade.in | Scale 1→0.88, opacity 1→0, blur 0→4, ~180ms | P0 |
| 19 | Window maximize | irfannaikwade.in | Fills viewport minus menu bar, radius→0, 320ms | P1 |
| 20 | Window minimize | irfannaikwade.in | Scale→0.1, moves toward dock, 320ms | P1 |
| 21 | Window header drag | irfannaikwade.in | Smooth dragging, grab cursor, clamping y≥28 | P0 |
| 22 | Window resize handles | irfannaikwade.in | 8-direction, correct cursors, min 360×240 enforcement | P1 |
| 23 | Window cascade positioning | irfannaikwade.in | 24px offset per window | P2 |

## Dock (Luca)

| # | Feature | Reference Source | Expected Behavior | Priority |
|---|---------|-----------------|-------------------|----------|
| 24 | Dock pill shape | luca-felix.com | Pill (rounded-full), centered bottom, ~16px clearance | P0 |
| 25 | Dock glassmorphism | luca-felix.com | `blur(20px) saturate(190%)`, specular hairline (inset top) | P0 |
| 26 | Dock shadow | luca-felix.com | Multi-layer deep shadow (outer + inset specular) | P1 |
| 27 | Dock magnification curve | luca-felix.com | Smooth cosine bell, icons grow upward from baseline | P0 |
| 28 | Dock magnification max | luca-felix.com | ~1.55× (44→68px), radius 150px | P0 |
| 29 | Dock spring physics | luca-felix.com | Smooth spring follow (mass:0.1, stiff:420, damp:26), no jank | P0 |
| 30 | Dock press squash | luca-felix.com | Scale 0.88x on pointer down, spring recovery | P1 |
| 31 | Dock tooltips | luca-felix.com | Pill label above icon, spring entrance, fade exit | P1 |
| 32 | Dock active dots | luca-felix.com + irfannaikwade.in | 3px white dot with glow below active app icons | P1 |
| 33 | Dock dividers | luca-felix.com | 1px × 32px white/12% between sections | P2 |
| 34 | App launch bounce | luca-felix.com | Y-axis bounce keyframes when launching new app | P2 |

## Music Player (Nidal)

| # | Feature | Reference Source | Expected Behavior | Priority |
|---|---------|-----------------|-------------------|----------|
| 35 | Music pill in dock | nidal.dev | 120px pill with artwork, title, eq bars, play/pause | P0 |
| 36 | Music pill magnification | nidal.dev + luca-felix.com | Magnifies proportionally in dock (120→160px) | P1 |
| 37 | Equalizer bars animation | nidal.dev | 3 bars with staggered heights, animated when playing | P1 |
| 38 | Expanded deck glassmorphism | nidal.dev | ~340×480px, blur(32px), rounded 20px, deep shadow | P0 |
| 39 | Vinyl disc spin | nidal.dev | 200px disc, 3s rotation, spinning when playing, paused when paused | P0 |
| 40 | Album art overlay | nidal.dev | Centered on vinyl, 60px circle label | P1 |
| 41 | Transport controls | nidal.dev | Shuffle, prev, play/pause (44px), next, repeat — correct sizing | P1 |
| 42 | Progress scrubber | nidal.dev | 4px track, 6px on hover, 12px handle, timestamp tooltip | P1 |
| 43 | Volume slider | nidal.dev | 3px track, 10px handle | P2 |
| 44 | FFT visualizer | nidal.dev | Real-time frequency bars in accent color | P2 |
| 45 | Deck entrance animation | nidal.dev | Spring from y:20 to y:0 with opacity | P1 |

## Kinetic Typography (Michal)

| # | Feature | Reference Source | Expected Behavior | Priority |
|---|---------|-----------------|-------------------|----------|
| 46 | Hero text scale | michalgrzebisz.com | `clamp(4.5rem, 14vw, 18.5rem)`, uppercase, full-bleed | P0 |
| 47 | Per-character displacement | michalgrzebisz.com | Individual characters displace independently near cursor | P0 |
| 48 | Spring physics feel | michalgrzebisz.com | Underdamped (ζ≈0.717) — snappy return with subtle overshoot | P0 |
| 49 | Influence radius | michalgrzebisz.com | ~260px radius, Gaussian falloff | P1 |
| 50 | Variable font weight | michalgrzebisz.com | Characters near cursor become heavier (400→900) | P1 |
| 51 | Ambient wave | michalgrzebisz.com | Gentle horizontal wave when cursor absent | P2 |
| 52 | Workspace opacity | Integration spec | 0.35 opacity in workspace mode, behind frosted windows | P0 |

## Cursor (Michal)

| # | Feature | Reference Source | Expected Behavior | Priority |
|---|---------|-----------------|-------------------|----------|
| 53 | Precision dot | michalgrzebisz.com | 4px white dot, zero-latency, pointer-events: none | P0 |
| 54 | Aura ring follow | michalgrzebisz.com | 24-80px ring with visible lerp lag behind dot | P0 |
| 55 | Aura difference blend | michalgrzebisz.com | `mix-blend-mode: difference` — inverts underlying colors | P0 |
| 56 | Aura velocity expansion | michalgrzebisz.com | Ring expands with faster mouse movement | P1 |
| 57 | Aura collapse on drag | michalgrzebisz.com | Scale→0 when over window drag/resize handles | P1 |
| 58 | Aura magnetic snap | michalgrzebisz.com | Morphs to squircle on dock items | P2 |

## Theme & Responsiveness

| # | Feature | Reference Source | Expected Behavior | Priority |
|---|---------|-----------------|-------------------|----------|
| 59 | Dark/Light toggle | irfannaikwade.in | All tokens swap correctly, no flickering | P0 |
| 60 | Mobile bottom sheets | irfannaikwade.in | Windows → 92vh sheets at <768px | P0 |
| 61 | Mobile tab bar | irfannaikwade.in | 52px + safe-area tab bar replaces dock | P0 |
| 62 | Mobile swipe dismiss | irfannaikwade.in | Swipe down 140px+ dismisses sheet | P1 |
| 63 | Mobile music bar | nidal.dev | 44px sticky bar above tab bar | P1 |
| 64 | Cursor disabled mobile | michalgrzebisz.com | No cursor elements on touch devices | P0 |

