# Floating Music Player Architecture & Structural Hierarchy (`nidal.dev`)

**Target Reference**: `nidal.dev` (Music Player Widget Component)  
**Document**: Compact 340px Capsule vs 380px Popover Modal vs 85vh Mobile Sheet, Layout & Scrubber  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Dual-State Physical Geometry & Viewport Placement

The music player operates in two primary display configurations: a floating mini-player capsule and an expanded popover/modal view.

```
Compact Mini-Player Capsule (340px × 68px):
┌───────────────────────────────────────────────────────────────────────────────┐
│ [Disc 44px] [ Track Title (Marquee)  ] [⏮ 32px] [ ⏯ 40px ] [⏭ 32px] [⛶/▼]   │
│             [ Artist - 01:24 / 03:45 ]                                        │
│ ══════════════════════════════════════════════════════════════════════════════│ (Micro-scrubber 2px)
└───────────────────────────────────────────────────────────────────────────────┘
Anchor: Fixed bottom: 24px, right: 24px | z-index: 1000 | Radius: 9999px (pill)
```

```
Expanded View State Modal / Drawer (380px × 520px):
┌───────────────────────────────────────────────────────────────────────────────┐
│ [ ▼ Minimize ]             Now Playing                 [ ☰ Queue / Playlist ] │
│                                                                               │
│                            ┌───────────────────┐                              │
│                            │   ( ( ( 💽 ) ) )   │                              │
│                            │   220px × 220px   │                              │
│                            │    Vinyl Record   │                              │
│                            └───────────────────┘                              │
│                                                                               │
│                      Track Title (18px SF Pro Bold)                           │
│                      Artist Name (14px SF Pro Muted)                          │
│                                                                               │
│ 01:24 ━━━━━━━━━━━━━━━━━━━━━●───────────────────────────────────────── 03:45   │
│                                                                               │
│          [ 🔀 ]     [ ⏮ ]      [   ⏯ 52px   ]      [⏭]      [ 🔁 ]            │
│                                                                               │
│ [ 🔈 ] ━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━ [ 🔊 ]         │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Comprehensive Geometry Specifications Matrix

| Dimensional Metric | Value | Classification | Context & Notes |
|---|---|---|---|
| **Mini-Player Width (Desktop)** | `340px` | `[CONFIRMED]` | Fixed capsule width at viewports $\ge 1024\text{px}$ |
| **Mini-Player Height (Desktop)** | `68px` | `[CONFIRMED]` | Compact single-row height containing disc and controls |
| **Mini-Player Bottom Anchor** | `24px` | `[CONFIRMED]` | Fixed offset from bottom viewport edge |
| **Mini-Player Right Anchor** | `24px` | `[CONFIRMED]` | Fixed offset from right viewport edge |
| **Mini-Player Border Radius** | `9999px` (`{rounded.pill}`) | `[CONFIRMED]` | Full pill capsule matching Apple design tokens |
| **Expanded Modal Width** | `380px` | `[CONFIRMED]` | Desktop popover card width |
| **Expanded Modal Height** | `520px` | `[CONFIRMED]` | Desktop popover card height |
| **Expanded Modal Radius** | `18px` (`{rounded.lg}`) | `[CONFIRMED]` | Rounded popover corners matching store cards |
| **Mobile Bottom Sheet Height** | `85vh` | `[INFERRED]` | Height on viewports $\le 640\text{px}$ |
| **Vinyl Disc Diameter (Compact)** | `44px` | `[CONFIRMED]` | Mini spinning disc container |
| **Vinyl Disc Diameter (Expanded)** | `220px` | `[CONFIRMED]` | Hero spinning vinyl turntable platter |
| **Center Spindle Hole** | `36px` | `[CONFIRMED]` | Center label and spindle cutout (`border-radius: 50%`) |
| **Play/Pause Button (Compact)** | `40px × 40px` | `[CONFIRMED]` | Circular action button `{component.button-icon-circular}` |
| **Play/Pause Button (Expanded)** | `52px × 52px` | `[CONFIRMED]` | Primary action circular chip |
| **Secondary Control Buttons** | `32px × 32px` | `[CONFIRMED]` | Previous, Next, Shuffle, Repeat buttons |
| **Micro Progress Bar Height** | `2px` | `[CONFIRMED]` | Pinned to bottom capsule border |
| **Expanded Scrubber Track Height** | `4px` (`6px` on hover) | `[CONFIRMED]` | Interactive scrubbable progress line |
| **Scrubber Thumb Diameter** | `12px` | `[INFERRED]` | Circular thumb indicator expanding on hover/drag |

---

## 3. Internal Layout & DOM Tree Hierarchy

```html
<div class="music-player-widget mini-mode" role="region" aria-label="Audio Player">
  <!-- Micro Progress Bar -->
  <div class="player-progress-micro" role="progressbar" aria-valuenow="42" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar-fill" style="width: 42.5%;"></div>
  </div>

  <!-- Left: Vinyl Record / Artwork Container -->
  <div class="player-disc-container" role="button" aria-label="Expand Player">
    <div class="vinyl-disc is-spinning" style="animation-play-state: running;">
      <div class="vinyl-grooves"></div>
      <div class="vinyl-center-label">
        <img src="album-art.webp" alt="Album Art" class="album-cover" />
      </div>
      <div class="vinyl-spindle-hole"></div>
    </div>
  </div>

  <!-- Center: Metadata & Equalizer -->
  <div class="player-meta-container">
    <div class="player-title-marquee-wrapper">
      <span class="track-title">Midnight City Drive</span>
    </div>
    <div class="player-sub-meta">
      <span class="artist-name">Synthwave Collective</span>
      <span class="time-display">01:24 / 03:45</span>
      <div class="player-mini-equalizer is-active">
        <span class="eq-bar eq-bar-1"></span>
        <span class="eq-bar eq-bar-2"></span>
        <span class="eq-bar eq-bar-3"></span>
        <span class="eq-bar eq-bar-4"></span>
      </div>
    </div>
  </div>

  <!-- Right: Control Actions -->
  <div class="player-controls-cluster">
    <button class="btn-control btn-prev" aria-label="Previous Track">⏮</button>
    <button class="btn-control btn-play-pause is-playing" aria-label="Pause">⏸</button>
    <button class="btn-control btn-next" aria-label="Next Track">⏭</button>
    <button class="btn-control btn-expand" aria-label="Expand View">⌃</button>
  </div>
</div>
```
