# Animated Taskbar & Dock Interaction Mechanics (`luca-felix.com`)

**Target Reference**: `luca-felix.com` (Interactive Taskbar / macOS Dock Navigation)  
**Document**: Cursor Hover, Press scale(0.95), Launch Jump, Active Dot Indicator & Tooltip Pill  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Pointer Proximity & Cursor Hover Tracking

- **Tracking Plane**: Proximity scaling tracks cursor position across the horizontal 1D axis ($X$-axis projection) `[CONFIRMED]`.
- **Event Flow**:
  - `onMouseMove` on the parent dock container continuously updates a shared `mouseX` Framer Motion value (`useMotionValue`) `[CONFIRMED]`.
  - When pointer leaves the dock (`onMouseLeave`), `mouseX.set(Infinity)`, triggering a smooth spring-driven return of all icons to base width ($40\text{px}$) `[CONFIRMED]`.
- **Zero Layout Thrashing**: Icon widths and positions animate via hardware-accelerated spring transformations without triggering DOM reflows `[CONFIRMED]`.

---

## 2. Active Press & App Launch Bounce Dynamics

### 2.1 Active Press Depression
- **Interaction Rule**: Pressing down on any dock icon (`:active` / `onPointerDown`) triggers instantaneous tactile depression `[CONFIRMED]`.
- **Transform**: `transform: scale(0.95)` (or `scale(0.92)`) `[CONFIRMED]`.
- **Timing**: `80ms` ease-out transition, perfectly adhering to `design.md` `{component.button-primary-active}` `[CONFIRMED]`.

### 2.2 macOS App Launch Jump (Bounce) `[ESTIMATED]`
When an icon is clicked to spawn a window, a vertical oscillation sequence executes:

```
Ascent (easeOut)        Descent (gravity easeIn)
      ▲                           │
 -16px│       *                   │
      │     *   *                 │
  -8px│   *       *               ▼
      │ *           *           *   *
   0px├───────────────*───────*───────* (Settles in ~650ms)
```

- **Keyframe Sequence**: $y: [0\text{px}, -16\text{px}, 0\text{px}, -8\text{px}, 0\text{px}, -3\text{px}, 0\text{px}]$ `[ESTIMATED]`.
- **Total Runtime**: $600\text{ms} - 750\text{ms}$ `[ESTIMATED]`.
- **Indicator Sync**: Running dot indicator fades and scales in simultaneously (`scale: [0, 1.4, 1.0]`, `opacity: [0, 1]`) `[CONFIRMED]`.

---

## 3. Running & Active App Indicators

Running applications display a subtle indicator dot centered beneath the icon tile:

| Indicator State | Visual Treatment | CSS Properties | Classification |
|---|---|---|---|
| **Inactive / Closed** | Unmounted / Transparent | `opacity: 0` | `[CONFIRMED]` |
| **Running (Background)** | Subtle solid dot, `opacity: 0.65` | `w-1 h-1 rounded-full bg-white/70` | `[CONFIRMED]` |
| **Active (Focused Window)** | Bright solid dot with subtle glow | `w-1.25 h-1.25 rounded-full bg-[#0066cc] dark:bg-[#2997ff] shadow-[0_0_6px_#0066cc]` | `[CONFIRMED]` |

- **Geometry**: $4\text{px} \times 4\text{px}$ circle (`rounded-full`), positioned `bottom: 2px, left: 50%, transform: translateX(-50%)` `[CONFIRMED]`.

---

## 4. Debounced Floating Tooltip Pill

When an icon is hovered, a descriptive label pill renders above the dock:

```
             ┌──────────┐
             │ Terminal │  <-- Tooltip Pill (SF Pro Text 12px, h: 24px)
             └────┬─────┘
                  │ bottom: calc(100% + 12px)
            ┌─────┴─────┐
            │  [ >_ ]   │  <-- Magnified Icon (Peak: 72px)
            └───────────┘
```

| Tooltip Attribute | Specification | Measurement Tag |
|---|---|---|
| **Vertical Placement** | `bottom: calc(100% + 12px)` (floats $12\text{px}$ above peak icon top) | `[CONFIRMED]` |
| **Horizontal Alignment** | `left: 50%; transform: translateX(-50%)` (centered over hovered icon) | `[CONFIRMED]` |
| **Typography** | `SF Pro Text`, `12px` font-size, `font-weight: 500`, tracking `-0.12px` | `[CONFIRMED]` |
| **Padding & Shape** | `padding: 4px 10px`, `border-radius: 6px` or `9999px` (`rounded.pill`) | `[CONFIRMED]` |
| **Background Fill** | `rgba(15, 15, 18, 0.85)` (Dark) / `rgba(255, 255, 255, 0.90)` (Light) with `backdrop-filter: blur(8px)` | `[CONFIRMED]` |
| **Hairline Border** | `1px solid rgba(255, 255, 255, 0.12)` (Dark) / `1px solid rgba(0, 0, 0, 0.08)` (Light) | `[CONFIRMED]` |
| **Hover Intent Debounce** | `140ms` enter delay (prevents tooltip flashing during rapid sweeps) | `[CONFIRMED]` |
| **Entrance Motion** | `opacity: [0, 1]`, `y: [6px, 0px]`, `scale: [0.94, 1.0]`, `duration: 150ms` | `[CONFIRMED]` |
| **Exit Motion** | `opacity: [1, 0]`, `y: [0px, 4px]`, `duration: 100ms` | `[CONFIRMED]` |
