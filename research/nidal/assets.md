# Music Player Visual Assets & Token Mapping (`nidal.dev`)

**Target Reference**: `nidal.dev` (Music Player Widget Component)  
**Document**: Album Artwork, Vinyl Textures, Control Icons, Blur Tokens & Token Mapping  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Vinyl Record & Artwork Assets

| Asset Name | Format | Dimensions | Visual Description | Classification |
|---|---|---|---|---|
| `vinyl-disc-base` | SVG / CSS | 44×44px / 220×220px | Concentric dark groove rings, radial gradient `#1a1a1a` to `#000000` | `[CONFIRMED]` |
| `album-art-default.webp` | WebP | 512×512px | Ambient electronic album art, centered in spindle label | `[CONFIRMED]` |
| `vinyl-spindle-hole` | CSS | 36×36px | Circular transparent punch hole with metallic center rim | `[CONFIRMED]` |

---

## 2. Harmonization with `design.md` Tokens

| Player Element | Observed Spec | Canonical `design.md` Token | Compliance Rationale |
|---|---|---|---|
| **Player Capsule** | Rounded pill container | `{rounded.pill}` (`9999px`) | Matches Apple pill CTA grammar. |
| **Control Buttons** | Circular action chips | `{component.button-icon-circular}` (40px/52px) | Matches Apple circular button specification. |
| **Active Press State** | Scale down on pointer down | `{component.button-primary-active}` (`scale(0.95)`) | Standard system micro-interaction. |
| **Active Accent Color** | Action Blue | `{colors.primary}` (`#0066cc`) / `{colors.primary-on-dark}` (`#2997ff`)| Single interactive accent rule honored. |
| **Frosted Glass Backdrop**| Blur filter | `backdrop-filter: blur(24px) saturate(180%)` | Matches Apple frosted glass recipe. |
| **Hairline Rim** | 1px semi-translucent border| `{colors.hairline}` (`#e0e0e0`) | Crisp perimeter edge definition. |
| **Surface Drop Shadow** | Soft ambient drop | Section: Elevation & Depth | Permitted for floating UI widget. |
