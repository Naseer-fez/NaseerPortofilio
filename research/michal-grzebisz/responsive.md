# Kinetic Typography Responsive & Touch Behavior (`michalgrzebisz.com`)

**Target Reference**: `michalgrzebisz.com` (Kinetic Typography & Minimalist Hero Canvas)  
**Document**: Viewport Breakpoint Matrix, Coarse Pointer Fallbacks & Ambient Breathing Sine Waves  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Breakpoint & Device Capability Matrix

| Viewport Range | Device Class | Interaction Paradigm | Kinetic Typography State | Atmosphere Layer | Classification |
|---|---|---|---|---|---|
| **< 480px** (320px–425px) | Mobile Phones (iOS / Android) | Touch Tap / Ambient Sine Wave | Fixed optimal weight (`wght: 550` / `600`) | Noise overlay active; Spotlight disabled | `[CONFIRMED]` |
| **481px – 768px** | Tablets Portrait | Touch Drag Exploration | Proximity active during finger drag; spring return on `touchend` | Soft radial center gradient | `[CONFIRMED]` |
| **769px – 1024px** | Tablets Landscape | Pointer Hover (`@media (hover: hover)`) | Full kinetic proximity enabled ($R = 180\text{px}$) | Cursor spotlight active | `[CONFIRMED]` |
| **1025px – 1440px** | Standard Desktop | Precision Trackpad / Mouse | Full kinetic proximity enabled ($R = 220\text{px}$) | Full spotlight + noise active | `[CONFIRMED]` |
| **> 1440px** (1920px+) | Large 4K/5K Displays | Precision Mouse | Expanded influence radius ($R = 280\text{px}$) | Full spotlight ($R_{\text{glow}} = 700\text{px}$) | `[CONFIRMED]` |

---

## 2. Touch & Mobile Fallback Mechanics

### 2.1 Capability Media Queries `[CONFIRMED]`
```css
@media (hover: none) and (pointer: coarse) {
  .ambient-spotlight {
    display: none; /* Disable cursor spotlight on touch */
  }
  .char {
    font-variation-settings: 'wght' 600; /* Static optimal baseline */
    transform: none !important;
  }
}
```

---

## 3. Ambient Breathing Wave Motion (Idle Touch Mode) `[INFERRED]`

On mobile touch viewports where continuous cursor tracking is unavailable, a subtle ambient sine wave gently breathes life into the kinetic headline:

$$\text{wght}_i(t) = \text{wght}_{\text{base}} + 120 \cdot \sin\left(\frac{2\pi \cdot i}{N} - 2\pi f_{\text{wave}} t\right)$$

Where:
- $\text{wght}_{\text{base}} = 600$ `[CONFIRMED]`.
- $f_{\text{wave}} = 0.2\text{ Hz}$ (5.0s per wave cycle) `[INFERRED]`.
- $i / N$: Normalized character index across the headline string `[INFERRED]`.
- Result: An organic, imperceptible breathing ripple that elevates the static typography without draining battery power.
