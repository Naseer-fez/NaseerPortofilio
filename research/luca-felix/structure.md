# Animated Taskbar & macOS Dock Architecture (`luca-felix.com`)

**Target Reference**: `luca-felix.com` (Interactive Taskbar / macOS Dock Navigation)  
**Document**: Dock Container Pill Geometry, Floating Position, Base/Max Icon Dimensions & Frosted Glass  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Dock Container Geometry & Viewport Placement

The taskbar on `luca-felix.com` is a floating, glassmorphic capsule anchored along the bottom horizontal center of the viewport.

```
                              Viewport Width (100vw)
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                    ┌──────────────────────────────────────┐                     │
│                    │  (•)   (•)   (•)   (•)   (•)   (•)   │                     │
│                    └──────────────────────────────────────┘                     │
│                                  ▲                                              │
│                                  │ bottom: 16px - 24px                          │
└──────────────────────────────────┴──────────────────────────────────────────────┘
                                left: 50%
                         transform: translateX(-50%)
```

### 1.1 Viewport Pinning & Geometry Parameters `[CONFIRMED]`
- **Positioning**: `position: fixed` `[CONFIRMED]`.
- **Horizontal Alignment**: `left: 50%; transform: translateX(-50%)` (strictly centered) `[CONFIRMED]`.
- **Vertical Anchor**: `bottom: 16px` (desktop standard) to `bottom: 24px` (wide displays) `[CONFIRMED]`.
- **Mobile Safe Area**: `bottom: max(12px, env(safe-area-inset-bottom))` `[INFERRED]`.
- **Layer Stacking**: `z-index: 40` (or `z-index: 50` / `100`) floating cleanly above wallpaper and inactive windows `[CONFIRMED]`.

---

## 2. Container Box Model & Translucent Glassmorphism

| Property | Exact Value / Spec | Classification | Rationale & Token Mapping |
|---|---|---|---|
| **Base Height (Resting)** | `58px` - `64px` | `[CONFIRMED]` | Accommodates resting $40\text{px}$ icons + padding + indicator |
| **Expanded Height (Peak)** | `88px` - `96px` | `[CONFIRMED]` | Expands vertically upward as icons scale to $72\text{px}-80\text{px}$ |
| **Horizontal Inset Padding** | `12px` (`px-3`) | `[CONFIRMED]` | Container edge to first/last icon wrapper |
| **Vertical Inset Padding** | `8px` (`py-2`) | `[CONFIRMED]` | Container top/bottom edge to icon bounds |
| **Inter-Icon Pitch Gap** | `8px` - `10px` (`gap-2` to `gap-2.5`) | `[CONFIRMED]` | Spacing between adjacent unhovered icons |
| **Border Radius** | `9999px` (`{rounded.pill}`) | `[CONFIRMED]` | Full capsule geometry matching Apple design grammar |
| **Backdrop Filter Blur** | `blur(16px)` to `blur(20px)` | `[CONFIRMED]` | High-diffusion frosted glass effect |
| **Backdrop Saturation** | `saturate(180%)` | `[CONFIRMED]` | Standard Apple glassmorphism saturation boost |
| **Dark Glass Background** | `rgba(23, 23, 23, 0.55)` to `rgba(32, 32, 36, 0.70)` | `[CONFIRMED]` | Matches `{colors.surface-tile-1}` / `{colors.surface-black}` |
| **Light Glass Background** | `rgba(255, 255, 255, 0.45)` to `rgba(255, 255, 255, 0.65)` | `[CONFIRMED]` | Matches `{colors.canvas-parchment}` translucent fill |
| **Hairline Rim Border** | `1px solid rgba(255, 255, 255, 0.18)` (Dark) / `1px solid rgba(0, 0, 0, 0.08)` (Light) | `[CONFIRMED]` | Crisp boundary separation against wallpaper |
| **Ambient Elevation Shadow** | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)` | `[CONFIRMED]` | Soft ambient shadow providing floating depth |

---

## 3. Icon Dimensions & Composite DOM Hierarchy

```
<div class="dock-container rounded-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
  <div class="dock-item-wrapper" style={{ width: animatedWidth }}>
    <!-- Tooltip (Conditionally rendered on hover) -->
    <div class="dock-tooltip">Finder</div>
    
    <!-- Icon Action Button -->
    <button class="dock-icon-button" onClick={handleLaunch}>
      <img src="finder.svg" class="dock-icon-img" />
    </button>
    
    <!-- Active / Running Status Dot -->
    <div class="dock-indicator-dot is-running"></div>
  </div>
</div>
```

### 3.1 Icon Sizing Metrics `[CONFIRMED]`
- **Resting Base Dimension ($S_{base}$)**: `40px × 40px` `[CONFIRMED]`.
- **Peak Hover Dimension ($S_{max}$)**: `72px × 72px` to `80px × 80px` ($1.8\times - 2.0\times$ magnification) `[CONFIRMED]`.
- **Icon Border Radius**: `rounded-xl` (`12px`) or `rounded-2xl` (`16px`) for square app squircle icons `[CONFIRMED]`.
- **Internal Glyph Size**: `20px × 20px` at rest; dynamically scales with container to `36px - 40px` at peak magnification `[CONFIRMED]`.
- **Separators**: `1px × 28px` vertical hairline divider lines (`{colors.hairline}`) separating application groups from utilities `[CONFIRMED]`.
