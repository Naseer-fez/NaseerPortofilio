# Luca Felix Taskbar — Implementation-Ready Analysis
## Source: luca-felix.com | Phase 2 Specification Document

**Confidence Classification**: All values tagged [CONFIRMED] from Phase 1 DOM/CSS/JS extraction unless noted.

---

## INTEGRATION MAPPING

```
BASE TASKBAR → REMOVE (Irfan's original dock at z-40 completely removed)
LUCA TASKBAR → INTEGRATE (replaces as primary dock/navigation at z-[9990])
```

**What Luca provides that base did not**: Cosine Bell proximity magnification, spring physics (Framer Motion), multi-layered glassmorphism with specular rim, tactile press squash, pill-shaped tooltips with spring entrance, divider separators.

**What base provided that Luca must preserve**: App launcher functionality (open/focus windows), running app indicators (active dots), app icon set, minimize/restore from dock click.

---

## 1. DOM Structure [CONFIRMED]

```
<nav dock-root-container>                     ← fixed, bottom, centered, pointer-events: none
  <div dock-wrapper>                          ← centering, bottom clearance, entrance animations
    <div dock-chassis>                        ← glassmorphic container, pointer-events: auto
      <div dock-item-wrapper>                 ← per-item container
        <div dock-tooltip>                    ← floating label (AnimatePresence)
          <span dock-tooltip-text/>
          <div dock-tooltip-arrow/>
        </div>
        <button dock-item-btn>               ← scalable icon surface
          <div dock-icon-surface>             ← squircle container
            <svg dock-icon-svg/>              ← icon
            <div dock-icon-gloss/>            ← specular overlay
          </div>
          <span dock-active-dot/>             ← running indicator
        </button>
      </div>
      <div dock-divider/>                     ← section separator
    </div>
  </div>
</nav>
```

---

## 2. Layout & Positioning [CONFIRMED]

| Property | Value |
|----------|-------|
| Root Position | `position: fixed; bottom: 0; left: 0; right: 0` |
| Root Z-Index | `z-index: 9990` |
| Root Pointer Events | `pointer-events: none` |
| Root Bottom Padding | `max(16px, env(safe-area-inset-bottom))` |
| Root Layout | `display: flex; justify-content: center` |
| Chassis Pointer Events | `pointer-events: auto` |
| Chassis Layout | `display: flex; flex-direction: row; align-items: flex-end` |
| Chassis Base Height | `58px` |
| Chassis Padding | `px: 12px, py: 8px` |
| Chassis Gap | `gap: 6px` [PROBABLE] |

> **Critical**: `align-items: flex-end` ensures items grow **upward** from shared baseline during magnification.

---

## 3. Glassmorphism Chassis [CONFIRMED]

| Property | Value |
|----------|-------|
| Background | `rgba(18, 18, 22, 0.70)` (dark), `rgba(255, 255, 255, 0.15)` (light) |
| Backdrop Filter | `blur(20px) saturate(190%) contrast(105%)` |
| Border | `1px solid rgba(255, 255, 255, 0.12)` |
| Border Radius | `9999px` (pill shape) |
| Inner Specular | `inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)` (top-edge highlight) |
| Box Shadow | `0 12px 36px -4px rgba(0,0,0,0.55), 0 4px 16px -2px rgba(0,0,0,0.35)` |
| Full Elevation | Combined: outer shadow + inner specular |

---

## 4. Dock Items [CONFIRMED]

| Property | Value |
|----------|-------|
| Base Width/Height | `44px × 44px` |
| Magnified Width/Height | `68px × 68px` (1.55× expansion) |
| Icon Surface Radius | `22%` (squircle approximation) |
| Icon Surface Background | Gradient or solid per-app accent |
| Icon SVG Size | `60%` of surface (≈26px at base) |
| Gloss Overlay | Linear gradient, `rgba(255,255,255,0.15)` top → transparent bottom |
| Cursor | `pointer` |

---

## 5. Proximity Magnification Math [CONFIRMED]

### Cosine Bell Formula

For each dock item $i$ with horizontal center $X_i$, distance to mouse $d_i = |X_{mouse} - X_i|$:

$$W(d_i) = \begin{cases} 
W_{base} + (W_{max} - W_{base}) \cdot \frac{1 + \cos(\frac{\pi d_i}{R})}{2}, & d_i \leq R \\
W_{base}, & d_i > R
\end{cases}$$

| Parameter | Value |
|-----------|-------|
| $W_{base}$ | `44px` |
| $W_{max}$ | `68px` |
| Expansion Ratio | `1.55×` |
| Influence Radius $R$ | `150px` |

### Anisotropic Formula for Non-Square Items (Music Pill)

$$d_{eff,i} = \max(0, |X_m - X_i| - \frac{W_{base,i} - W_{standard}}{2})$$

| Item | Base Width | Max Width |
|------|-----------|-----------|
| Standard Icon | 44px | 68px |
| Music Pill | 120px | 160px |

---

## 6. Spring Dynamics [CONFIRMED]

| Property | Value |
|----------|-------|
| Mass | `0.1` |
| Stiffness | `420` |
| Damping | `26` |
| Engine | Framer Motion `MotionValue` (outside React render) |

The width of each dock item is driven by a Framer Motion `useSpring` that subscribes to a shared `mouseX` MotionValue. This executes outside the React reconciliation loop for 60-120fps performance.

---

## 7. Tactile Interactions [CONFIRMED]

### Press Squash
| Property | Value |
|----------|-------|
| Transform | `scale(0.88)` on pointer down |
| Spring | `stiffness: 600, damping: 20` |
| Recovery | Spring back to `scale(1.0)` on pointer up |

### App Launch Bounce
| Property | Value |
|----------|-------|
| Trigger | Dock item click when app is not open |
| Effect | 3 bounces along Y axis |
| Implementation | Framer Motion keyframes `y: [0, -12, 0, -8, 0, -4, 0]` |
| Duration | ~600ms total [PROBABLE] |

### Active Dot Indicator [CONFIRMED]
| Property | Value |
|----------|-------|
| Size | `3px × 3px` |
| Shape | `rounded-full` |
| Color | `rgba(255, 255, 255, 0.85)` |
| Position | Centered below icon, `bottom: -6px` |
| Glow | `0 0 4px rgba(255, 255, 255, 0.4)` |
| States | Hidden (app closed), Visible (app open), Dimmed (app minimized) |

---

## 8. Tooltips [CONFIRMED]

| Property | Value |
|----------|-------|
| Position | Centered above hovered item |
| Y Offset | `-8px` above icon top edge |
| Background | `rgba(24, 24, 28, 0.88)` |
| Backdrop Filter | `blur(12px) saturate(160%)` |
| Border | `1px solid rgba(255, 255, 255, 0.12)` |
| Border Radius | `6px` (capsule) |
| Padding | `4px 10px` |
| Font | `11.5px`, weight `500`, `#f5f5f7` |
| Arrow | `5px` CSS triangle, matching background |
| Entrance | Spring: `y: [8, 0]`, `opacity: [0, 1]`, `scale: [0.9, 1]` |
| Exit | Fade out `opacity → 0`, `duration: 100ms` |
| Engine | `AnimatePresence` with `mode="wait"` |

---

## 9. Dividers [CONFIRMED]

| Property | Value |
|----------|-------|
| Width | `1px` |
| Height | `32px` [PROBABLE] |
| Color | `rgba(255, 255, 255, 0.12)` |
| Margin | `0 4px` |
| Role | `separator`, `aria-orientation="vertical"` |

---

## 10. Responsive Behavior [CONFIRMED]

### Desktop (≥768px)
- Full parabolic magnification active
- Floating glassmorphic chassis centered at bottom
- Spring physics enabled
- Tooltips on hover

### Mobile (<768px) [CONFIRMED]
- Magnification **disabled** (all items fixed at 1.0×)
- Converts to horizontal scroll bar: `scroll-snap-type: x mandatory`
- Touch drag interaction enabled
- Tooltips disabled (no hover on touch)
- Fixed at bottom with safe-area padding
- Becomes a tab bar (52px + env(safe-area-inset-bottom))

---

## 11. States Matrix [CONFIRMED]

| Component | State | Visual Change |
|-----------|-------|--------------|
| Dock Item | Default | Base size (44px) |
| Dock Item | Hover (proximity) | Magnified up to 68px |
| Dock Item | Pressed | Scale 0.88x squash |
| Dock Item | Active (app open) | Dot indicator visible |
| Dock Item | Minimized (app minimized) | Dot indicator dimmed |
| Dock Chassis | Mouse inside | Magnification active |
| Dock Chassis | Mouse outside | All items at base size |
| Tooltip | Hover on item | Spring entrance |
| Tooltip | Leave item | Fade exit |

