# Base OS Animation Dynamics & Transition Physics (`irfannaikwade.in`)

**Target Reference**: `irfannaikwade.in` (macOS-style Virtual Desktop Environment)  
**Document**: Window Open/Close/Minimize Spring Curves, Suction Vectors, Timing Curves & Duration  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Master Animation & Transition Parameter Matrix

All window state transitions, modals, and desktop visual effects are governed by calibrated duration and cubic-bezier / spring physics:

| Lifecycle Event | Target Properties | Duration | Easing Curve / Function | Framer Motion Spring Config | Classification |
|---|---|---|---|---|---|
| **Window Open** | `scale: [0.86, 1.0]`, `opacity: [0, 1]`, `blur: [6px, 0px]` | `280ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | `stiffness: 380, damping: 30, mass: 0.8` | `[CONFIRMED]` |
| **Window Close** | `scale: [1.0, 0.88]`, `opacity: [1, 0]`, `blur: [0px, 6px]` | `180ms` | `cubic-bezier(0.4, 0, 0.6, 1)` | `stiffness: 420, damping: 35` | `[CONFIRMED]` |
| **Maximize / Zoom** | `x, y, width, height`, `borderRadius: [18px, 0px]` | `320ms` | `cubic-bezier(0.2, 0.9, 0.2, 1)` | `stiffness: 300, damping: 26` | `[CONFIRMED]` |
| **Restore from Max**| `x, y, width, height`, `borderRadius: [0px, 18px]` | `300ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | `stiffness: 320, damping: 28` | `[CONFIRMED]` |
| **Minimize to Dock**| `x: Δx_dock, y: Δy_dock, scale: 0.08, opacity: 0` | `320ms` | `cubic-bezier(0.25, 1, 0.5, 1)` | `stiffness: 340, damping: 28` | `[CONFIRMED]` |
| **Restore from Dock**| `x: 0, y: 0, scale: [0.08, 1.0], opacity: [0, 1]` | `300ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | `stiffness: 360, damping: 29` | `[CONFIRMED]` |
| **Focus Transition**| `box-shadow`, `border-color` | `150ms` | `ease-out` (CSS transition) | N/A | `[CONFIRMED]` |
| **Wallpaper Swap** | `opacity: [0, 1]`, `filter: brightness` | `700ms` | `ease-out` (CSS transition) | N/A | `[INFERRED]` |
| **Control Center Pop**| `opacity: [0, 1]`, `y: [-8px, 0px]`, `scale: [0.96, 1]` | `200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | `stiffness: 400, damping: 30` | `[CONFIRMED]` |

---

## 2. Window Open & Close Dynamics

```
Window Open (280ms cubic-bezier(0.16, 1, 0.3, 1)):
Scale:   0.86 ─────────────> 1.00 (Snappy expansion without overshoot)
Opacity: 0.00 ───────> 1.00 (Rapid linear fade-in)
Blur:    6px ─────────> 0px (Crisp focus convergence)
```

- **Open Transition**:
  - The window mounts at $86\%$ scale and expands smoothly into resting bounds over `280ms` `[CONFIRMED]`.
  - Fast ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`) imparts instant responsiveness while preventing sluggishness.
- **Close Transition**:
  - Drops scale from $1.00$ to $0.88$ over `180ms` while fading out `[CONFIRMED]`.
  - Asymmetric timing (closing is $100\text{ms}$ faster than opening) aligns with standard desktop operating system UX heuristics.

---

## 3. Dock Minimize Suction Physics

Minimizing a window simulates a targeted 2D suction vector pulling the window into its corresponding dock icon coordinate.

```
Window Origin (wx0, wy0)
       \
        \  Suction Vector (Δx, Δy)
         \  Scale: 1.0 -> 0.08, Opacity: 1.0 -> 0.0
          ▼
     [ Dock Icon ] (dx, dy)
```

### 3.1 Vector Formulation `[CONFIRMED]`
Let $(w_x, w_y)$ be the window top-left and $(w_w, w_h)$ its current dimensions.  
Let $(d_x, d_y)$ be the viewport center coordinate of the matching dock icon.

$$\text{Target Center}_x = d_x, \quad \text{Target Center}_y = d_y$$
$$\Delta x = \text{Target Center}_x - \left(w_x + \frac{w_w}{2}\right)$$
$$\Delta y = \text{Target Center}_y - \left(w_y + \frac{w_h}{2}\right)$$

During the `320ms` minimize sequence:
$$\text{transform} = \text{translate3d}(\Delta x \cdot t, \Delta y \cdot t, 0) \cdot \text{scale}(1.0 - 0.92t) \quad \text{for } t \in [0, 1]$$

---

## 4. Maximize & Restore Interpolation

- **Bounds Interpolation**: Maximize smoothly morphs four dimensions concurrently $(x, y, \text{width}, \text{height})$ from saved floating bounds `prevBounds` to full desktop coordinates $(0, 28\text{px}, W_{\text{viewport}}, H_{\text{viewport}} - 28\text{px})$ `[CONFIRMED]`.
- **Corner Radius Morph**: `border-radius` transitions smoothly from `18px` (`{rounded.lg}`) down to `0px` (`{rounded.none}`) over `320ms` `[CONFIRMED]`.
- **Double Click Titlebar Header**: Triggers instant toggle between Maximized and Restored geometries with zero layout popping `[CONFIRMED]`.

---

## 5. Focus & Elevation Micro-Transitions

- **Shadow Elevation Shift**: When a window gains focus, its box-shadow transitions from inactive (`0 10px 30px rgba(0,0,0,0.35)`) to active (`0 20px 70px rgba(0,0,0,0.55)`) via a `150ms ease-out` CSS transition `[CONFIRMED]`.
- **Border Hairline Luminance**: Inactive border `rgba(255, 255, 255, 0.08)` upgrades to focused `rgba(255, 255, 255, 0.18)` `[CONFIRMED]`.
- **Traffic Light Dimming**: Inactive windows dim traffic light colors to neutral gray (`#6b7280`) at $50\%$ opacity `[INFERRED]`.
