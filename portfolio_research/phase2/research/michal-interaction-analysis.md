# Michal Grzebisz Interaction — Implementation-Ready Analysis
## Source: michalgrzebisz.com | Phase 2 Specification Document

**Confidence Classification**: All values tagged [CONFIRMED] from Phase 1 mathematical model extraction unless noted.

---

## 1. Typography System [CONFIRMED]

### Full-Bleed Monumental Typography
| Property | Value |
|----------|-------|
| Font Size | `clamp(4.5rem, 14vw + 1rem, 18.5rem)` |
| Font Family | `"PP Neue Montreal", "Monument Extended", -apple-system, sans-serif` |
| Font Weight | Variable: `400 – 900` (driven by proximity) |
| Font Width | Variable: `100% – 125%` (driven by proximity) |
| Font Slant | Variable: `-15deg to +15deg` (driven by velocity) |
| Color | White `#ffffff` on dark backgrounds |
| Text Transform | Uppercase |
| Line Height | `0.85 – 1.0` (tight for monumental display) |
| Letter Spacing | `0.02em – 0.08em` (dynamically modulated) |
| Layout | Full-bleed `100vw × 100dvh` |
| Overflow | Hidden |

### Split-Text Architecture [CONFIRMED]
- Effect operates **PER CHARACTER** (not per word, block, or line)
- Each glyph is an independent physics-enabled particle
- Characters are split from source text and wrapped in individual `<span>` elements
- Each character maintains:
  - Rest anchor coordinates $(x_0, y_0)$ — cached on mount/resize
  - Current physics position $(x, y)$
  - Velocity vector $(v_x, v_y)$
  - Variable font axis values (wght, wdth, slant)

### Integration as Layer 0 [CONFIRMED from conflict resolution]
- Typography sits on **Layer 0** (z-0) as living wallpaper
- **Workspace Mode** (windows open): `opacity: 0.35`, visible through `backdrop-filter: blur(28px)` frosted windows
- **Ambient Hero Mode** (all minimized): `opacity: 1.0`, full interactive physics
- Mode Toggle: `Cmd+Option+M`, desktop double-click, or menu bar button

---

## 2. Dual-Tier Cursor System [CONFIRMED]

### Precision Dot
| Property | Value |
|----------|-------|
| Radius | `4px` |
| Shape | Circle |
| Tracking | Zero-latency (instant at mouse position, 0ms lag) |
| Color | White `#ffffff` |
| Blend Mode | `normal` |
| Z-Index | `z-[9999]` (topmost layer) |
| Pointer Events | `none` |
| Visibility | Desktop only (hidden on touch devices) |

### Aura Ring
| Property | Value |
|----------|-------|
| Base Radius | `24px` (resting) |
| Max Radius | `80px` (velocity-dependent: $r = 24 + 0.08 \cdot \|\mathbf{V}\|$) |
| Tracking | Frame-rate independent lerp (lags behind dot) |
| Lerp Factor | $\lambda_{ref} = 0.15$ at $\Delta t_{ref} = 16.67\text{ms}$ (60Hz) |
| Frame-Rate Correction | $\lambda_{\Delta t} = 1 - (1 - \lambda_{ref})^{\Delta t / \Delta t_{ref}}$ |
| Blend Mode | `mix-blend-mode: difference` |
| Color | White `#ffffff` (inverts underlying: `|C_{bg} - 255|`) |
| Border | `2px solid rgba(255,255,255,0.6)` [PROBABLE] |
| Z-Index | `z-[9999]` |
| Pointer Events | `none` |

### Cursor Context State Machine [CONFIRMED]

| State | Trigger | Dot | Aura Ring |
|-------|---------|-----|-----------|
| `kinetic-hero` | Over canvas/typography | r=4px visible | r=24-80px, difference blend, full lerp lag |
| `precision-drag` | Over window resize handle / drag header | r=4px visible | `scale(0), opacity(0)` over 100ms; native CSS cursor restored |
| `magnetic-dock` | Over dock item | r=4px visible | Morphs to squircle, snaps to dock item bounds (spring: stiffness 500, damping 28) |
| `disabled` | Touch device / mobile | Hidden | Hidden |

---

## 3. Spring-Mass-Damper Physics [CONFIRMED]

### Second-Order ODE

$$m \frac{d^2 \mathbf{x}_i(t)}{dt^2} + c \frac{d\mathbf{x}_i(t)}{dt} + k(\mathbf{x}_i(t) - \mathbf{x}_{0,i}) = \mathbf{F}_{cursor,i}(t)$$

| Parameter | Symbol | Value |
|-----------|--------|-------|
| Mass | $m$ | `1.0 kg` |
| Spring Stiffness | $k$ | `280 N/m` |
| Damping Coefficient | $c$ | `24 Ns/m` |
| Damping Ratio | $\zeta$ | `≈0.717` (underdamped — snappy settle with organic overshoot) |
| Natural Frequency | $\omega_n$ | `$\sqrt{k/m} = \sqrt{280} \approx 16.73$ rad/s` |

### Cursor Force Field [CONFIRMED]

$$\mathbf{F}_{cursor,i}(t) = k_{force} \cdot \alpha(d_i) \cdot \hat{\mathbf{u}}_i + \mathbf{F}_{velocity}$$

Where:
- $\alpha(d_i) = \exp(-d_i^2 / 2\sigma^2)$ — Gaussian falloff
- $\hat{\mathbf{u}}_i$ — unit vector from cursor to glyph
- $k_{force}$ — force multiplier [PROBABLE: ~50-100]

### Proximity Detection [CONFIRMED]

| Parameter | Value |
|-----------|-------|
| Influence Radius | $R = 260\text{px}$ |
| Falloff Function | Gaussian: $\alpha(d) = \exp(-d^2 / 2\sigma^2)$ |
| $\sigma$ | $R / 2.5 = 104\text{px}$ [PROBABLE] |
| Max Displacement | `65px` from rest position |

---

## 4. Numerical Integration [CONFIRMED]

### Semi-Implicit Euler Method (per frame, per character)

```
a_i(t) = (-k(x_i - x_0i) - c·v_i + F_cursor_i) / m
v_i(t + Δt) = v_i(t) + a_i(t) · Δt
x_i(t + Δt) = x_i(t) + v_i(t + Δt) · Δt
```

All updates run in `requestAnimationFrame` with frame-delta calculation for consistent behavior across 60/120/144Hz displays.

---

## 5. Variable Font Modulation [CONFIRMED]

| Axis | Rest Value | Proximity-Driven Range | Modulation Source |
|------|-----------|----------------------|-------------------|
| `font-weight` (wght) | `400` | `400 → 900` | Distance to cursor (closer = heavier) |
| `font-stretch` (wdth) | `100%` | `100% → 125%` | Distance to cursor |
| `font-style` (slant) | `0deg` | `-15deg → +15deg` | Cursor velocity direction |

---

## 6. Velocity Tracking (EMA) [CONFIRMED]

$$\mathbf{V}_{inst}(t) = \frac{\mathbf{P}_c(t) - \mathbf{P}_c(t - \Delta t)}{\Delta t}$$

$$\bar{\mathbf{V}}(t) = \beta \cdot \bar{\mathbf{V}}(t - \Delta t) + (1 - \beta) \cdot \mathbf{V}_{inst}(t)$$

| Parameter | Value |
|-----------|-------|
| Smoothing Factor $\beta$ | `0.75` |
| Speed magnitude | $\|\bar{\mathbf{V}}\|$ used for aura radius expansion and font slant |

---

## 7. Performance Optimization [CONFIRMED]

| Technique | Detail |
|-----------|--------|
| Geometry Cache | `Float32Array(count × 8)` — Struct-of-Arrays (SoA) contiguous buffer |
| BBox Calculation | Once on mount/resize, never in animation loop |
| DOM Updates | Only `transform: matrix3d(...)` and CSS custom properties |
| GPU Promotion | `will-change: transform; transform: translateZ(0)` on all character nodes |
| Paint Avoidance | Zero layout/reflow triggers in render loop |
| Frame Budget | <1.5ms JS execution per frame (leaves 6.83ms headroom at 120fps) |

---

## 8. Ambient Idle Wave [CONFIRMED]

When no cursor interaction (mouse left viewport or idle timeout):
- Characters undergo gentle harmonic wave oscillation
- Wave travels horizontally across text
- Amplitude: ~2-4px displacement [PROBABLE]
- Frequency: slow, ambient rhythm (~0.5-1Hz) [PROBABLE]
- Phase offset per character based on position in text

---

## 9. Mobile/Touch Fallback [CONFIRMED]

| Feature | Desktop | Mobile (<768px) |
|---------|---------|-----------------|
| Custom Cursor | Dual-tier (dot + aura) | Disabled |
| Text Interaction | Spring physics on `pointermove` | Touch ripple on `touchstart` |
| Ambient Motion | Idle harmonic wave | Gyroscope parallax (DeviceOrientation β, γ) |
| Variable Font | Proximity-driven modulation | Static or gyro-driven [PROBABLE] |
| Typography Scale | `clamp(4.5rem, 14vw, 18.5rem)` | Same clamp (scales down naturally) |

### Gyroscope Parallax [CONFIRMED]
- Uses `DeviceOrientationEvent` API
- iOS 13+ requires `DeviceOrientationEvent.requestPermission()` on first tap
- Tilt angles β (front-back) and γ (left-right) drive text displacement
- Fallback: ambient sinusoidal wave if permission denied

---

## 10. Color System [CONFIRMED]

| Element | Color | Blend Mode |
|---------|-------|------------|
| Typography | `#ffffff` | Normal |
| Cursor Aura | `#ffffff` | `mix-blend-mode: difference` |
| Result on dark bg | Aura appears white | `|0 - 255| = 255` |
| Result on light bg | Aura appears dark | `|255 - 255| = 0` → black |
| Desktop bg tint | `rgba(0,0,0,0.25)` overlay | Normal |

