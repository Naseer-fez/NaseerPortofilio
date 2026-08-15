# Home Screen Hero Canvas & Kinetic Typography Architecture (`michalgrzebisz.com`)

**Target Reference**: `michalgrzebisz.com` (Kinetic Typography & Minimalist Hero Canvas)  
**Document**: Full-Bleed 100vh Hero Canvas, 4-Corner Anchors, Negative Space Allocation & Dark Palette  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Full-Bleed 100vh Hero Canvas Layout

The hero screen of `michalgrzebisz.com` is an expansive, minimalist canvas designed as a gallery-grade single-screen viewport.

```
┌─────────────────────────────────────────────────────────────────────────────────┐ (0, 0)
│ [Identity Lockup & Descriptor]                         [Availability Beacon Chip]│ (Top Row)
│ Michał Grzebisz — Design Engineer                      ● Available for Projects │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                       K I N E T I C   T Y P O G R A P H Y                       │ (Center Stage)
│                        [ SF Pro Variable Hero Title ]                           │ (clamp(56px..112px))
│                                                                                 │
│                                                                                 │
│                                                                                 │
│ [Geospatial & Time Metadata]                           [Scroll Trigger / CTA]   │ (Bottom Row)
│ Warsaw, PL — 52.2297° N, 21.0122° E | 13:01 CET        Scroll to Explore ↓      │
└─────────────────────────────────────────────────────────────────────────────────┘ (100vw, 100vh)
```

### 1.1 Spatial Allocation & Negative Space Metrics
- **Viewport Constraints**: `100vw × 100vh` (`100dvh` on mobile), `position: relative; overflow: hidden;` `[CONFIRMED]`.
- **Negative Space Fraction**: $65\% - 75\%$ of total hero area is uncluttered active negative space `[ESTIMATED]`.
- **Structural Grid Framework**: 12-column CSS grid (`grid-template-columns: repeat(12, 1fr)`) with `column-gap: clamp(16px, 2vw, 32px)` `[INFERRED]`.

---

## 2. 4-Corner Metadata Anchoring System

The 4-corner framework creates balanced visual weight around the central kinetic headline:

1. **Top-Left (Col 1–4, Row 1)**: Identity lockup (`Michał Grzebisz — Design Engineer & Creative Technologist`) in `{typography.caption}` ($14\text{px} / 400$) `[CONFIRMED]`.
2. **Top-Right (Col 9–12, Row 1)**: Availability chip (`Available for Q3/Q4 projects`) featuring an emerald pulse indicator (`#30d158`) with `rgba(48, 209, 88, 0.4)` halo `[CONFIRMED]`.
3. **Bottom-Left (Col 1–4, Row 3)**: Geospatial coordinates and live local time (`Warsaw, PL — 52.2297° N, 21.0122° E | 13:01 CET`) in tabular monospace numbers (`font-variant-numeric: tabular-nums`) `[CONFIRMED]`.
4. **Bottom-Right (Col 9–12, Row 3)**: Interactive scroll CTA (`Scroll to Explore ↓`) with micro-magnetic pull on hover `[CONFIRMED]`.

---

## 3. Dark Palette & Atmospheric Layers

- **Canvas Background Fill**: Monochromatic obsidian `#0a0a0c` to `#101012` (`{colors.surface-black}` / `{colors.surface-tile-1}`) `[CONFIRMED]`.
- **Primary Kinetic Glyph Fill**: Pure off-white `#ffffff` / `#f5f5f7` (`{colors.body-on-dark}`) providing a $17.4:1$ WCAG AAA contrast ratio `[CONFIRMED]`.
- **Secondary Muted Metadata**: `#86868b` / `#7a7a7a` (`{colors.ink-muted-48}`) `[CONFIRMED]`.
- **High-Frequency SVG Grain Noise**: Translucent fixed overlay layer with `opacity: 0.042`, `mix-blend-mode: overlay`, eliminating 8-bit digital color banding `[CONFIRMED]`.
- **Ambient Pointer Spotlight**: Dynamic radial gradient tracking pointer coordinates $(x_m, y_m)$ with radius $R_{\text{glow}} \approx 500\text{px}-600\text{px}$ `[ESTIMATED]`.
