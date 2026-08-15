# Kinetic Typography Animation Dynamics & Performance Engine (`michalgrzebisz.com`)

**Target Reference**: `michalgrzebisz.com` (Kinetic Typography & Minimalist Hero Canvas)  
**Document**: Kinetic Deformation Dynamics, LERP Decay alpha=0.14, RAF Loop & 0% Idle CPU  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Temporal Smoothing & LERP Decay Physics

Instantaneous geometric target values are smoothed via a per-frame low-pass Linear Interpolation (LERP) filter to create silky elastic weight tracking:

$$\text{val}_i^{(k)} = \text{val}_i^{(k-1)} + \alpha \cdot \left(\text{val}_i^{\text{target}} - \text{val}_i^{(k-1)}\right)$$

| Smoothing Constant | Calibrated Value | Classification | Physical Effect |
|---|---|---|---|
| **Lerp Factor ($\alpha$)** | `0.14` ($\pm 0.02$) | `[ESTIMATED]` | Steps $14\%$ towards target per frame at 60Hz |
| **Half-Life Decay Time ($t_{1/2}$)** | $75\text{ms} - 90\text{ms}$ | `[INFERRED]` | Time required for $50\%$ displacement reduction |
| **Settling Time to Rest** | $350\text{ms} - 450\text{ms}$ | `[ESTIMATED]` | Time to fully return to baseline weight $\text{wght} = 600$ |
| **Settling Threshold ($\epsilon$)** | `0.05` | `[INFERRED]` | Motion delta cutoff for sleeping animation tick |

---

## 2. Decoupled RAF Render Loop & 0% Idle CPU Engine

To guarantee locked 60/120 FPS performance with zero battery drain when the user is idle:

```
[ Window 'pointermove' Event ] (Passive, updates mouseX & mouseY scalars only)
             │
             ▼
     [ Global State ]
             │ (triggers RAF loop if not running)
             ▼
┌──────────────────────────────────────────────────────────┐
│              RAF Animation Tick (16.67ms)                │
│                                                          │
│  1. Traverse cached character centroid array C_i         │
│  2. Compute Euclidean distance d_i = ||P - C_i||         │
│  3. Calculate Cosine falloff coefficient f(d_i)          │
│  4. Update lerped values: wght, scale, dx, dy            │
│  5. Mutate CSS Custom Properties / inline transform      │
│  6. If delta < 0.05 on all chars, SLEEP RAF LOOP         │
└──────────────────────────────────────────────────────────┘
             │
             ▼
[ 0% CPU Overhead at Equilibrium / Resting State ]
```

### 2.1 Reflow & Layout Thrashing Elimination `[CONFIRMED]`
- **Pre-Cached Centroids**: `getBoundingClientRect()` is **strictly prohibited** inside the per-frame animation loop `[CONFIRMED]`.
- Centroids are cached into a flat array during mounting and refreshed exclusively on debounced `window.resize` or `document.fonts.ready` `[CONFIRMED]`.
- **Hardware Acceleration**: Only `transform` and `--char-wght` CSS variables are mutated, isolating updates to the GPU Compositor thread `[CONFIRMED]`.
