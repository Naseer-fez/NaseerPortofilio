# Motion System — Animation Specifications
## Phase 2 Design Document

All values from Phase 1 research. [CONFIRMED] unless noted.

---

## CSS Easing Tokens

```css
--ease-apple-spring: cubic-bezier(0.16, 1, 0.3, 1);
--ease-apple-close: cubic-bezier(0.4, 0, 0.6, 1);
--ease-apple-maximize: cubic-bezier(0.2, 0.9, 0.2, 1);
--ease-apple-minimize: cubic-bezier(0.25, 1, 0.5, 1);
```

---

## Window Animations

### Window Open
| Property | Value |
|----------|-------|
| Trigger | `openWindow(appId)` / dock click / desktop double-click |
| Properties | `scale`, `opacity`, `filter` |
| Initial | `scale(0.85)`, `opacity: 0`, `filter: blur(8px)` |
| Final | `scale(1)`, `opacity: 1`, `filter: blur(0)` |
| Duration | 280ms |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Spring Alt | stiffness: 380, damping: 30, mass: 0.8 |
| Interruptible | Yes (closing during open cancels) |
| Reset | Fully removed from DOM or reset to initial on re-open |

### Window Close
| Property | Value |
|----------|-------|
| Trigger | Traffic light red click / Cmd+W |
| Properties | `scale`, `opacity`, `filter` |
| Initial | `scale(1)`, `opacity: 1`, `filter: blur(0)` |
| Final | `scale(0.88)`, `opacity: 0`, `filter: blur(4px)` |
| Duration | 180ms |
| Easing | `cubic-bezier(0.4, 0, 0.6, 1)` |
| Spring Alt | stiffness: 420, damping: 35 |
| Interruptible | No (commits to close) |
| Reset | Component unmounted after animation |

### Window Maximize
| Property | Value |
|----------|-------|
| Trigger | Traffic light green click / header double-click |
| Properties | `x`, `y`, `width`, `height`, `border-radius` |
| Initial | Current bounds, `border-radius: 12px` |
| Final | `x:0, y:0, width: 100vw, height: calc(100vh-28px)`, `border-radius: 0` |
| Duration | 320ms |
| Easing | `cubic-bezier(0.2, 0.9, 0.2, 1)` |
| Spring Alt | stiffness: 300, damping: 26 |
| Interruptible | Yes (can toggle mid-animation) |
| Reset | Restores `prevBounds` on un-maximize |

### Window Minimize
| Property | Value |
|----------|-------|
| Trigger | Traffic light yellow click / Cmd+M |
| Properties | `scale`, `opacity`, `y` |
| Initial | Current state |
| Final | `scale(0.1)`, `opacity: 0`, `y: dockIconY` |
| Duration | 320ms |
| Easing | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Interruptible | No |
| Reset | Reverse animation on restore from dock |

### Window Focus
| Property | Value |
|----------|-------|
| Trigger | Click on window / dock click |
| Properties | `box-shadow` |
| Initial | `--shadow-window-inactive` |
| Final | `--shadow-window-active` |
| Duration | 150ms |
| Easing | `ease-out` |
| Interruptible | Yes |

---

## Dock Animations

### Proximity Magnification
| Property | Value |
|----------|-------|
| Trigger | Mouse movement within dock chassis |
| Property | `width`, `height` of each DockItem |
| Formula | Cosine Bell: `W(d) = 44 + 24·(1+cos(πd/150))/2` for `d ≤ 150px` |
| Spring | mass: 0.1, stiffness: 420, damping: 26 |
| Engine | Framer Motion `useSpring` on MotionValue |
| Interruptible | Yes (continuous tracking) |

### Press Squash
| Property | Value |
|----------|-------|
| Trigger | Pointer down on dock item |
| Property | `scale` |
| Initial | `1.0` |
| Final | `0.88` |
| Spring | stiffness: 600, damping: 20 |
| Reset | Spring back to `1.0` on pointer up |

### App Launch Bounce
| Property | Value |
|----------|-------|
| Trigger | Dock click when app not open |
| Property | `y` (translateY) |
| Keyframes | `[0, -12, 0, -8, 0, -4, 0]` |
| Duration | ~600ms [PROBABLE] |
| Interruptible | No |

### Tooltip Entrance
| Property | Value |
|----------|-------|
| Trigger | Hover on dock item (static) |
| Properties | `y`, `opacity`, `scale` |
| Initial | `y: 8`, `opacity: 0`, `scale: 0.9` |
| Final | `y: 0`, `opacity: 1`, `scale: 1` |
| Engine | Spring (AnimatePresence) |
| Exit | `opacity: 0`, duration 100ms |

### Active Dot Appear
| Property | Value |
|----------|-------|
| Trigger | App opens for first time |
| Property | `scale` |
| Initial | `0` |
| Final | `1` |
| Engine | Spring |

---

## Cursor Animations

### Aura Follow
| Property | Value |
|----------|-------|
| Trigger | Continuous mouse movement |
| Property | `x`, `y` position |
| Method | Frame-rate independent lerp: `x(t+Δt) = x_target + (x(t) - x_target) · exp(-κ·Δt)` |
| λ_ref | 0.15 at 16.67ms (60Hz) |
| Spring Alt | mass: 0.15, stiffness: 350, damping: 28 |

### Aura Collapse (Drag Mode)
| Property | Value |
|----------|-------|
| Trigger | Cursor enters window drag/resize handle |
| Properties | `scale`, `opacity` |
| Initial | Current aura state |
| Final | `scale: 0`, `opacity: 0` |
| Duration | 100ms |
| Reset | Reverse when cursor leaves handle |

### Magnetic Dock Snap
| Property | Value |
|----------|-------|
| Trigger | Cursor enters dock item bounds |
| Property | Aura morphs to squircle shape, snaps to item center |
| Spring | stiffness: 500, damping: 28 |

---

## Typography Physics

### Spring-Mass-Damper
| Property | Value |
|----------|-------|
| Trigger | Cursor within R=260px of character |
| Properties | `transform: translate(dx, dy)`, `font-variation-settings` |
| Physics | m=1.0, k=280, c=24, ζ≈0.717 |
| Integration | Semi-implicit Euler per frame |
| Max Displacement | 65px from rest |
| Reset | Spring returns to rest when cursor leaves R |

### Ambient Idle Wave
| Property | Value |
|----------|-------|
| Trigger | No cursor interaction / mobile |
| Property | `translate(dx, 0)` per character |
| Amplitude | 2-4px [PROBABLE] |
| Frequency | 0.5-1Hz [PROBABLE] |
| Phase | Offset by character position |
| Loop | Infinite |

---

## Music Player Animations

### Vinyl Spin
| Property | Value |
|----------|-------|
| Trigger | Status === PLAYING |
| Property | `rotate` |
| From/To | `0deg → 360deg` |
| Duration | 3s |
| Easing | `linear` |
| Loop | Infinite |
| Pause | `animation-play-state: paused` when PAUSED |

### Audio Deck Entrance
| Property | Value |
|----------|-------|
| Trigger | Pill click / expand |
| Properties | `y`, `opacity` |
| Initial | `y: 20`, `opacity: 0` |
| Final | `y: 0`, `opacity: 1` |
| Engine | Spring |

### Audio Deck Exit
| Property | Value |
|----------|-------|
| Trigger | Collapse button / outside click |
| Properties | `y`, `opacity` |
| Initial | `y: 0`, `opacity: 1` |
| Final | `y: 12`, `opacity: 0` |
| Duration | 200ms |

### Equalizer Bars
| Property | Value |
|----------|-------|
| Trigger | Status === PLAYING |
| Property | `height` per bar |
| Bar 1 | 4px → 14px → 4px, 0.8s |
| Bar 2 | 8px → 10px → 8px, 1.2s |
| Bar 3 | 6px → 16px → 6px, 0.6s |
| Easing | ease-in-out |
| Loop | Infinite (paused when not PLAYING) |

---

## Desktop Animations

### Icon Hover
| Property | Value |
|----------|-------|
| Trigger | Mouse enter desktop icon |
| Property | `scale` |
| Initial | `1.0` |
| Final | `1.05` |
| Duration | 150ms |
| Easing | ease |

### Wallpaper Transition
| Property | Value |
|----------|-------|
| Trigger | Wallpaper change in Settings |
| Property | `opacity` (crossfade) |
| Duration | 700ms |
| Easing | ease-out |

### Desktop Mode Transition
| Property | Value |
|----------|-------|
| Trigger | Cmd+Option+M / double-click desktop |
| Properties | Window opacity/scale, hero opacity |
| Workspace→Ambient | Windows: scale(0.95) + opacity(0), Hero: opacity(0.35→1.0) |
| Ambient→Workspace | Windows: scale(1.0) + opacity(1), Hero: opacity(1.0→0.35) |
| Duration | 400ms [PROBABLE] |

### Context Menu Enter
| Property | Value |
|----------|-------|
| Trigger | Right-click / long-press |
| Properties | `scale`, `opacity` |
| Initial | `scale(0.95)`, `opacity: 0` |
| Final | `scale(1)`, `opacity: 1` |
| Duration | 150ms [PROBABLE] |

### Mobile Sheet Swipe
| Property | Value |
|----------|-------|
| Trigger | Swipe down on bottom sheet (scrollTop === 0) |
| Property | `translateY` follows finger |
| Threshold | 140px to dismiss |
| Dismiss | Spring to `translateY(100vh)` |
| Cancel | Spring back to `translateY(0)` |

