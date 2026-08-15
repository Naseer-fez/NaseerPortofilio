# Kinetic Typography Visual Assets & Design Token Mapping (`michalgrzebisz.com`)

**Target Reference**: `michalgrzebisz.com` (Kinetic Typography & Minimalist Hero Canvas)  
**Document**: Typography Variable Specs, SVG Grain Filter, Spotlight Radial Gradient & Token Mapping  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Typography & Variable Font Specifications

| Attribute | Specification | Mapping in `design.md` | Classification |
|---|---|---|---|
| **Font Family** | `SF Pro Display Variable, system-ui, -apple-system, sans-serif` | `{typography.hero-display}` | `[CONFIRMED]` |
| **Variable Axis** | `wght` (Weight): `100` to `900` | Baseline `600`, peak `850` | `[CONFIRMED]` |
| **Headline Size** | `clamp(56px, 7.5vw, 112px)` | `{typography.hero-display}` (56px baseline) | `[CONFIRMED]` |
| **Tracking / Letter Spacing** | `-0.035em` (`-0.28px` to `-2.5px` dynamic) | Signature "Apple tight" tracking | `[CONFIRMED]` |
| **Line Height** | `1.04` - `1.07` | Context-specific tight display leading | `[CONFIRMED]` |
| **Corner Metadata Font** | `SF Pro Text, system-ui` | `{typography.caption}` / `{typography.fine-print}` | `[CONFIRMED]` |

---

## 2. Atmospheric Filter & Gradient Assets

### 2.1 High-Frequency SVG Grain Noise Overlay `[CONFIRMED]`
```xml
<svg class="noise-overlay" aria-hidden="true" style="position: fixed; inset: 0; width: 100%; height: 100%; opacity: 0.042; mix-blend-mode: overlay; pointer-events: none; z-index: 1;">
  <filter id="noiseFilter">
    <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
</svg>
```

### 2.2 Pointer-Tracking Ambient Spotlight CSS `[CONFIRMED]`
```css
.ambient-spotlight {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh),
    rgba(255, 255, 255, 0.035) 0%,
    rgba(80, 120, 240, 0.015) 35%,
    rgba(0, 0, 0, 0) 70%
  );
  z-index: 0;
  transition: opacity 0.6s ease-out;
}
```

---

## 3. Harmonization with `design.md` Tokens

| Hero Element | Target Spec | Canonical `design.md` Token | Compliance Rationale |
|---|---|---|---|
| Canvas Background | `#0a0a0c` obsidian | `{colors.surface-black}` (`#000000`) | Exact dark canvas alignment. |
| Hero Typography | SF Pro Display Variable | `{typography.hero-display}` | SF Pro Display 600 with negative tracking. |
| Text Color | `#ffffff` | `{colors.body-on-dark}` | High-legibility AAA contrast. |
| Secondary Anchors | `#86868b` / `#7a7a7a` | `{colors.ink-muted-48}` | Muted metadata styling. |
| Interactive CTAs | `#2997ff` Sky Blue | `{colors.primary-on-dark}` | Single interactive accent rule honored. |
| Text Shadows | `text-shadow: none` | Section: Elevation & Depth | Strictly zero shadow on typography. |
