# Animated Taskbar Responsive & Touch Adaptation (`luca-felix.com`)

**Target Reference**: `luca-felix.com` (Interactive Taskbar / macOS Dock Navigation)  
**Document**: Touchscreen Proximity Deactivation, >=44px Touch Targets & 8-Breakpoint Strategy  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Touch Device Strategy & Pointer Coarse Deactivation

On touch devices, fingers produce discrete tap events without continuous hover vectors, making proximity scaling disruptive and causing layout hopping under the user's hand.

### 1.1 Deactivation Rules `[CONFIRMED]`
- **Media Query**: Evaluated via `@media (pointer: coarse)` and `window.matchMedia("(pointer: coarse)").matches` `[CONFIRMED]`.
- **Scaling Mode**: Dynamic spring proximity scaling is **strictly disabled** `[CONFIRMED]`.
- **Icon Sizing**: All icons lock to static dimensions $44\text{px} \times 44\text{px}$ (or $40\text{px}$ on small phones), fully adhering to Apple's minimum $44\text{px}$ touch target guideline `[CONFIRMED]`.
- **Tooltips**: Hover tooltips are suppressed on touch devices to prevent stuck UI overlays `[CONFIRMED]`.

---

## 2. 8-Breakpoint Viewport Adaptation Matrix

| Breakpoint Name | Viewport Width | Dock Geometry & Anchor | Icon Size | Scaling Mode | Tooltip Status | Classification |
|---|---|---|---|---|---|---|
| **1. Ultra-Wide Desktop** | `1920px` | Centered pill, `bottom: 24px` | `44px` base / `80px` peak | Full Spring Proximity ($R = 160\text{px}$) | Enabled (`120ms` delay) | `[CONFIRMED]` |
| **2. Standard Desktop** | `1440px` | Centered pill, `bottom: 20px` | `40px` base / `72px` peak | Full Spring Proximity ($R = 150\text{px}$) | Enabled (`120ms` delay) | `[CONFIRMED]` |
| **3. Small Desktop / Laptop** | `1280px` | Centered pill, `bottom: 16px` | `40px` base / `72px` peak | Full Spring Proximity ($R = 140\text{px}$) | Enabled (`120ms` delay) | `[CONFIRMED]` |
| **4. Tablet Landscape** | `1024px` | Centered pill, `bottom: 16px` | `40px` base / `68px` peak | Enabled on mouse; Disabled on touch | Mouse only | `[CONFIRMED]` |
| **5. Tablet Portrait** | `768px` | Compact floating pill, `bottom: 12px` | `40px` fixed | **Disabled** (Fixed scale) | Disabled | `[CONFIRMED]` |
| **6. Large Phone** | `425px` | Horizontal scrollable dock | `38px` fixed | **Disabled** | Disabled | `[CONFIRMED]` |
| **7. Medium Phone** | `375px` | Bottom bar with safe area insets | `36px` fixed | **Disabled** | Disabled | `[CONFIRMED]` |
| **8. Small Phone** | `320px` | Pinned compact nav bar (max 5 icons)| `32px` - `34px` fixed | **Disabled** | Disabled | `[CONFIRMED]` |

---

## 3. Mobile Horizontal Overflow & Scroll Containment

On narrow mobile viewports ($< 480\text{px}$):
- If the icon count exceeds the viewport width, the dock container enables touch-friendly horizontal scrolling:
  ```css
  @media (max-width: 480px) {
    .dock-container {
      max-width: calc(100vw - 24px);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .dock-container::-webkit-scrollbar {
      display: none;
    }
  }
  ```
- Alternatively, secondary utility icons are relocated into an expandable overflow menu sheet to keep the mobile bottom bar pristine `[INFERRED]`.
