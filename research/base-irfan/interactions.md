# Base OS Interaction Systems & Mechanics (`irfannaikwade.in`)

**Target Reference**: `irfannaikwade.in` (macOS-style Virtual Desktop Environment)  
**Document**: Icon Click/Double-Click/Lasso, Window Drag Clamping, 8-Direction Resize, Snap, Context Menu & Focus Stacking  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Desktop Icon Interactions & Selection Mechanics

### 1.1 Single-Click vs Double-Click Disambiguation
- **Single-Click / Pointer Down**:
  - Highlights icon (`selected = true`) `[CONFIRMED]`.
  - Sets visual selection: background `rgba(255, 255, 255, 0.25)`, border `1px solid rgba(255, 255, 255, 0.20)`, label background `{colors.primary}` (`#0066cc`) with `rounded-[3px]` `[CONFIRMED]`.
  - Initiates double-click timer window ($300\text{ms}$) `[CONFIRMED]`.
- **Double-Click (< 300ms)**:
  - Launches application: if window is unmounted, instantiates with `isOpen: true, isMinimized: false, isFocused: true, zIndex: maxZ + 1` `[CONFIRMED]`.
  - If window already exists: restores if minimized, promotes z-index, and assigns focus `[CONFIRMED]`.
  - **Touch/Mobile Fallback**: Single tap immediately executes launch; double-click threshold is bypassed `[CONFIRMED]`.

### 1.2 Lasso Selection Box (Rubberband Marquee)
When dragging on the desktop canvas surface (`e.target === desktopCanvas`):
- **Bounding Box Math**:
  $$x_{\text{box}} = \min(x_{\text{start}}, x_{\text{current}}), \quad y_{\text{box}} = \min(y_{\text{start}}, y_{\text{current}}) \quad [CONFIRMED]$$
  $$w_{\text{box}} = |x_{\text{current}} - x_{\text{start}}|, \quad h_{\text{box}} = |y_{\text{current}} - y_{\text{start}}| \quad [CONFIRMED]$$
- **Styling**: `background: rgba(0, 102, 204, 0.20); border: 1px solid rgba(0, 102, 204, 0.65); backdrop-filter: blur(1px);` `[CONFIRMED]`.
- **Intersection Collision Test (AABB)**:
  $$\text{Selected}_i \iff (x_{\text{box}} < x_i + w_i) \land (x_{\text{box}} + w_{\text{box}} > x_i) \land (y_{\text{box}} < y_i + h_i) \land (y_{\text{box}} + h_{\text{box}} > y_i) \quad [CONFIRMED]$$
- **Multi-Select Modifier**: Holding `Shift` or `Cmd` adds collided icons to existing selection set `[INFERRED]`.

---

## 2. Window Dragging & Viewport Boundary Clamping

### 2.1 Drag Lifecycle & Event Capture
1. `pointerdown` on `.window-header` captures initial pointer $(p_{x0}, p_{y0})$ and window origin $(w_{x0}, w_{y0})$ `[CONFIRMED]`.
2. Invokes `e.currentTarget.setPointerCapture(e.pointerId)` `[CONFIRMED]`.
3. Dispatches coordinate updates via `requestAnimationFrame` applying `transform: translate3d(x, y, 0)` to prevent React layout thrashing `[CONFIRMED]`.

### 2.2 Boundary Clamping Formulation `[CONFIRMED]`
$$\Delta x = e.\text{clientX} - p_{x0}, \quad \Delta y = e.\text{clientY} - p_{y0}$$
$$x_{\text{proposed}} = w_{x0} + \Delta x, \quad y_{\text{proposed}} = w_{y0} + \Delta y$$
$$x_{\text{clamped}} = \max\left(-(W_{\text{win}} - 100), \min\left(x_{\text{proposed}}, W_{\text{viewport}} - 100\right)\right) \quad [CONFIRMED]$$
$$y_{\text{clamped}} = \max\left(28, \min\left(y_{\text{proposed}}, H_{\text{viewport}} - 60\right)\right) \quad [CONFIRMED]$$

- **Menu Bar Protection**: Clamping $y \ge 28\text{px}$ guarantees window titlebar never slips behind the top menu bar `[CONFIRMED]`.
- **Edge Overhang Protection**: Margin of $100\text{px}$ guarantees the titlebar is always grab-able at screen edges `[CONFIRMED]`.

---

## 3. 8-Direction Window Resizing Engine

8 invisible resize handles along window edges and corners capture drag deltas.

```
(nw) [━━━━━ Top Handle (n) ━━━━━] (ne)
 │                                │
[w]          Window Frame        [e]
 │                                │
(sw) [━━━━ Bottom Handle (s) ━━━] (se)
```

### 3.1 Handle Dimensions & Cursors `[CONFIRMED]`
- **Cardinal Handles (`n`, `s`)**: `height: 6px`, `cursor: ns-resize` `[CONFIRMED]`.
- **Cardinal Handles (`e`, `w`)**: `width: 6px`, `cursor: ew-resize` `[CONFIRMED]`.
- **Corner Handles (`ne`, `sw`)**: `12px × 12px`, `cursor: nesw-resize` `[CONFIRMED]`.
- **Corner Handles (`nw`, `se`)**: `12px × 12px`, `cursor: nwse-resize` `[CONFIRMED]`.

### 3.2 8-Direction Coordinate Delta Algorithm `[CONFIRMED]`
```typescript
interface ResizeResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function computeResizeBounds(
  handle: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw',
  startPos: { x: number; y: number },
  startSize: { width: number; height: number },
  deltaX: number,
  deltaY: number,
  minW = 360,
  minH = 240,
  topBarH = 28
): ResizeResult {
  let { x, y } = startPos;
  let { width, height } = startSize;

  if (handle.includes('e')) {
    width = Math.max(minW, startSize.width + deltaX);
  }
  if (handle.includes('w')) {
    const candidateW = startSize.width - deltaX;
    if (candidateW >= minW) {
      width = candidateW;
      x = startPos.x + deltaX;
    }
  }
  if (handle.includes('s')) {
    height = Math.max(minH, startSize.height + deltaY);
  }
  if (handle.includes('n')) {
    const candidateH = startSize.height - deltaY;
    const proposedY = startPos.y + deltaY;
    if (candidateH >= minH && proposedY >= topBarH) {
      height = candidateH;
      y = proposedY;
    }
  }

  return { x, y, width, height };
}
```

---

## 4. Window Snapping & Split-Screen Mechanics

- **Edge Detection Threshold**: Dragging the window titlebar within $\le 12\text{px}$ of left, right, or top viewport edges triggers snapping preview overlays `[INFERRED]`.
- **Snap Zones & Targets**:
  - **Left Half Snap**: $x = 0, y = 28\text{px}, w = W_{\text{viewport}} / 2, h = H_{\text{viewport}} - 28\text{px}$ `[INFERRED]`.
  - **Right Half Snap**: $x = W_{\text{viewport}} / 2, y = 28\text{px}, w = W_{\text{viewport}} / 2, h = H_{\text{viewport}} - 28\text{px}$ `[INFERRED]`.
  - **Top Edge (Maximize)**: $x = 0, y = 28\text{px}, w = W_{\text{viewport}}, h = H_{\text{viewport}} - 28\text{px}$ `[CONFIRMED]`.
- **Visual Feedback**: Semi-transparent blue overlay (`bg-[#0066cc]/15 border border-[#0066cc]/40 backdrop-blur-sm rounded-xl`) previews target snapped geometry before release `[INFERRED]`.

---

## 5. Desktop Context Menu System

### 5.1 Event Interception & Menu Actions
`window.addEventListener('contextmenu', e => e.preventDefault())` intercepts standard browser context menus `[CONFIRMED]`.

- **Desktop Context Menu Actions**:
  1. 🖼️ **Change Wallpaper...** $\to$ Spawns Settings app on Wallpaper tab `[CONFIRMED]`.
  2. 🧹 **Clean Up / Sort By** $\to$ Sorts icons by Name / Date / Kind `[INFERRED]`.
  3. 💻 **Open in Terminal** $\to$ Spawns Terminal.app at `~/Desktop` `[CONFIRMED]`.
  4. ℹ️ **Get Info** $\to$ Opens About app `[CONFIRMED]`.
- **Icon Context Menu Actions**:
  1. 🚀 **Open** $\to$ Launches application `[CONFIRMED]`.
  2. ℹ️ **Get Info** $\to$ Shows metadata sheet `[CONFIRMED]`.
  3. 🗑️ **Move to Trash** $\to$ Removes item to Trash folder `[CONFIRMED]`.

### 5.2 Viewport Boundary Clamping Formulas `[CONFIRMED]`
$$x_{\text{clamped}} = \max\left(8, \min\left(x_{\text{click}}, W_{\text{viewport}} - W_{\text{menu}} - 8\right)\right) \quad [CONFIRMED]$$
$$y_{\text{clamped}} = \max\left(36, \min\left(y_{\text{click}}, H_{\text{viewport}} - H_{\text{menu}} - H_{\text{dock}} - 8\right)\right) \quad [CONFIRMED]$$
Where $W_{\text{menu}} = 220\text{px}$, $H_{\text{menu}} \approx 240\text{px}$, $H_{\text{dock}} = 70\text{px}$ `[CONFIRMED]`.

---

## 6. Z-Index Promotion & Focus Stacking Manager

### 6.1 Click-to-Front Focus Elevation
When `pointerdown` occurs on any window:
$$\text{currentMaxZ} = \max\left(\max_{w \in \text{Windows}} w.\text{zIndex}, 20\right) \quad [CONFIRMED]$$
$$\text{targetWindow}.\text{zIndex} = \text{currentMaxZ} + 1 \quad [CONFIRMED]$$
$$\text{targetWindow}.\text{isFocused} = \text{true}, \quad \forall w \neq \text{targetWindow}, \; w.\text{isFocused} = \text{false} \quad [CONFIRMED]$$

### 6.2 Cascade Spawning Formula `[CONFIRMED]`
When a new window opens without stored coordinates:
$$\text{spawnX} = \text{baseX} + (N_{\text{open}} \times 24)\pmod{W_{\text{viewport}} - W_{\text{win}}} \quad [CONFIRMED]$$
$$\text{spawnY} = \text{baseY} + (N_{\text{open}} \times 24)\pmod{H_{\text{viewport}} - H_{\text{win}} - 28} \quad [CONFIRMED]$$
Where $\text{baseX} = 120\text{px}$, $\text{baseY} = 70\text{px}$ `[CONFIRMED]`.

---

## 7. Keyboard Navigation & Shortcuts

| Shortcut Key | Scope / Context | Action Executed | Classification |
|---|---|---|---|
| `ArrowUp` / `Down` | Desktop Icons | Moves selection across vertical column | `[INFERRED]` |
| `ArrowLeft` / `Right` | Desktop Icons | Moves selection across adjacent columns | `[INFERRED]` |
| `Enter` / `Space` | Desktop Icons | Launches currently selected icon app | `[INFERRED]` |
| `Escape` | Global Desktop | Deselects all icons / Closes active context menu | `[CONFIRMED]` |
| `Cmd/Ctrl + W` | Active Window | Closes focused window | `[CONFIRMED]` |
| `Cmd/Ctrl + M` | Active Window | Minimizes focused window to dock | `[CONFIRMED]` |
| `Cmd/Ctrl + Space` | Global Desktop | Toggles Spotlight search command palette | `[CONFIRMED]` |
