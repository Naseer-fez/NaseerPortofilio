# Responsive System — Breakpoint Behavior Matrix
## Phase 2 Design Document

---

## Breakpoints

| Name | Range | Primary Paradigm |
|------|-------|-----------------|
| Desktop XL | >1440px | Full OS desktop, all features |
| Desktop | 1069-1440px | Full OS desktop |
| Laptop | 1024-1068px | Full OS, slightly constrained |
| Tablet Landscape | 834-1023px | OS desktop, constrained windows |
| Tablet Portrait | 768-833px | OS desktop, minimal features |
| Mobile | 420-767px | iOS-style sheets + tab bar |
| Small Phone | <420px | Compact iOS-style |

**Critical Threshold: 768px** — Above = desktop OS paradigm. Below = mobile sheet paradigm.

---

## Component Responsive Matrix

### Top Menu Bar

| Breakpoint | Behavior |
|-----------|----------|
| ≥640px | Full: Apple logo, app name, File/Edit/View/Window/Help menus, status tray, clock |
| <640px | Simplified: Apple logo, app name, status icons, clock. Menus hidden (`hidden sm:flex`) |
| <768px | May become simplified iOS-style status bar with centered clock |

### Desktop Icons

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px | Visible: grid-flow-col, 92px columns, 104px rows, full interaction (click/double-click/select/marquee) |
| <768px | **Hidden**. Apps accessed via MobileTabBar instead |

### Windows

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px | Floating windows: drag, resize, minimize, maximize, focus, z-index, traffic lights, cascade spawn |
| <768px | **92vh bottom sheets**: full-width, swipe-down dismiss (140px threshold), rounded top corners, grab handle. No drag. No resize. No traffic lights (close via swipe or X button). Internal scroll doesn't trigger dismiss when `scrollTop > 0` |

### Dock (Luca)

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px | Floating glassmorphic pill, Cosine Bell magnification (R=150px, 44→68px), spring physics, tooltips on hover, music pill embedded |
| <768px | **Fixed bottom tab bar**: 52px + `env(safe-area-inset-bottom)`, 5 core app icons, no magnification (all 1.0×), no tooltips, music pill becomes separate MobileStickyAudioBar above tab bar. `scroll-snap-type: x mandatory` if icons overflow. |

### Music Player

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px | **Dock Pill** (120px): embedded in Luca dock chassis. Click → AudioDeckExpandedCard positioned above dock. Full vinyl, controls, visualizer, scrubber. |
| <768px | **Sticky Audio Bar** (44px): positioned above MobileTabBar (`bottom: 52px + safe-area`). Shows mini artwork (28px), title, play/pause. Tap → fullscreen bottom sheet with full player controls. |

### Kinetic Typography (Hero Stage)

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px + pointer:fine | Full interaction: cursor-driven spring physics (k=280, c=24), variable font modulation, dual-tier cursor |
| ≥768px + pointer:coarse | Ambient harmonic wave only (no cursor tracking on tablet with no mouse) |
| <768px | **Touch ripple** on `touchstart` + **ambient harmonic wave** + **gyroscope parallax** via DeviceOrientation (β, γ). Typography still renders at `clamp(4.5rem, 14vw, 18.5rem)` — scales down naturally. Variable font may be static or gyro-driven [PROBABLE]. |

### Custom Cursor

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px + pointer:fine | Full dual-tier: precision dot (4px) + aura ring (24-80px, difference blend). Context FSM: kinetic-hero, precision-drag, magnetic-dock. |
| ≥768px + pointer:coarse | **Disabled**. No cursor rendering on touch tablets. |
| <768px | **Disabled**. No cursor elements rendered. Native cursor restored. |

**Detection**: Use `@media (pointer: fine)` and `@media (hover: hover)` rather than width alone.

### Context Menus

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px | Right-click → glassmorphic context menu at clamped position |
| <768px | **Long-press (500ms)** → context menu or action sheet [PROBABLE] |

### Spotlight Search

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px | `Cmd/Ctrl+K` → centered modal overlay with search input |
| <768px | Search icon in mobile header → full-screen search sheet |

### Selection Marquee

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px | Click+drag on empty desktop → rubber-band selection rectangle |
| <768px | **Disabled**. No desktop surface interaction on mobile. |

### Control Center

| Breakpoint | Behavior |
|-----------|----------|
| ≥768px | Popover from status tray icons |
| <768px | Full-screen or half-sheet modal [PROBABLE] |

---

## Mouse Interaction → Mobile Equivalent

| Desktop Interaction | Mobile Equivalent | Status |
|--------------------|-------------------|--------|
| Mouse hover dock → magnification | N/A | **Disabled** |
| Mouse proximity → typography displacement | Touch ripple + gyroscope parallax | **Adapted** |
| Right-click → context menu | Long-press (500ms) | **Adapted** |
| Double-click icon → launch app | Single tap tab → launch app | **Adapted** |
| Window drag | N/A (bottom sheets) | **Replaced** |
| Window resize | N/A (full-width sheets) | **Replaced** |
| Hover → tooltip | N/A | **Disabled** |
| Cmd+K spotlight | Search icon tap | **Adapted** |
| Selection marquee | N/A | **Disabled** |
| Custom cursor | N/A | **Disabled** |
| Scroll within window | Scroll within bottom sheet | **Same** |
| Swipe gestures | Swipe to dismiss sheet (140px) | **Native mobile** |

---

## Touch-Specific Features (Mobile Only)

| Feature | Spec |
|---------|------|
| Safe Area Insets | `env(safe-area-inset-top/bottom)` on all fixed elements |
| 100dvh | Use `100dvh` / `100svh` to handle mobile URL bar |
| Touch Target Size | Minimum 44×44px for all interactive elements (Apple HIG) |
| Overscroll Behavior | `overscroll-behavior: contain` on bottom sheets |
| Momentum Scrolling | `-webkit-overflow-scrolling: touch` on scroll containers |
| iOS Permission | `DeviceOrientationEvent.requestPermission()` for gyroscope on iOS 13+ |

