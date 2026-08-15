# Base OS Asset Catalog & Visual Styling Tokens (`irfannaikwade.in`)

**Target Reference**: `irfannaikwade.in` (macOS-style Virtual Desktop Environment)  
**Document**: Iconography Inventory, Wallpaper Specs, Typography, Blur Tokens, Hairlines & Palettes  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Application Iconography Inventory

All application icons utilize macOS standard $22.5\%$ rounded squircle geometry with multi-layered vector graphics:

| App ID | Icon Subject & Glyph | Format | Dimensions | Visual Treatment | Classification |
|---|---|---|---|---|---|
| `terminal` | Terminal Prompt `>_` | SVG / WebP | 64×64, 128×128 | Dark squircle, lime prompt glyph `#22c55e`, inner bevel | `[CONFIRMED]` |
| `projects` | Portfolio Folder / Grid | SVG / WebP | 64×64, 128×128 | macOS Blue folder gradient with project badge | `[CONFIRMED]` |
| `about` | User Profile Silhouette | SVG / WebP | 64×64, 128×128 | Indigo/violet gradient squircle, white user glyph | `[CONFIRMED]` |
| `skills` | Lightning Bolt / Code Tag | SVG / WebP | 64×64, 128×128 | Amber/gold radial gradient, lightning icon | `[CONFIRMED]` |
| `settings` | macOS System Gear | SVG / WebP | 64×64, 128×128 | Graphite metallic gear wheel with radial sheen | `[CONFIRMED]` |
| `contact` | Mail Envelope | SVG / WebP | 64×64, 128×128 | Apple Mail sky-blue gradient, floating envelope | `[CONFIRMED]` |
| `resume` | PDF Document Badge | SVG / WebP | 64×64, 128×128 | Crimson document with white "PDF" corner curl | `[CONFIRMED]` |
| `notes` | Yellow Notepad Sheet | SVG / WebP | 64×64, 128×128 | Ruled note paper with pencil glyph | `[CONFIRMED]` |
| `calculator` | Orange/Gray Keypad | SVG / WebP | 64×64, 128×128 | Dark grid with orange `= / +` operator keys | `[CONFIRMED]` |
| `browser` | Safari Compass Rose | SVG / WebP | 64×64, 128×128 | Blue radial compass with red/white needle | `[CONFIRMED]` |
| `music` | Orange Vinyl / Note | SVG / WebP | 64×64, 128×128 | Magenta/red gradient with double musical note | `[CONFIRMED]` |

---

## 2. Desktop Wallpapers & High-Resolution Assets

| Asset Name | Mode | Native Resolution | File Format | File Size | Description | Classification |
|---|---|---|---|---|---|---|
| `sonoma-dark.webp` | Dark (Default) | 3840 × 2160 (4K) | WebP | ~240 KB | Deep abstract organic ridges on dark obsidian | `[CONFIRMED]` |
| `ventura-light.webp` | Light | 3840 × 2160 (4K) | WebP | ~210 KB | Vibrant California poppy petals on parchment | `[CONFIRMED]` |
| `monterey-graphic.webp`| Dynamic | 3840 × 2160 (4K) | WebP | ~280 KB | Layered vector canyon dunes | `[CONFIRMED]` |
| `cyber-grid.webp` | Dark / Sci-Fi | 2560 × 1440 (2K) | WebP | ~185 KB | Deep blue/indigo isometric wireframe grid | `[CONFIRMED]` |
| `parchment-minimal.webp`| Light / Gallery | 3840 × 2160 (4K) | WebP | ~95 KB | Subtle off-white Apple museum canvas (`#f5f5f7`) | `[CONFIRMED]` |

---

## 3. Typography Specifications

| Context | Font Family | Size | Weight | Line Height | Tracking | Classification |
|---|---|---|---|---|---|---|
| **Window Titles** | `SF Pro Text, system-ui` | `12px` | 600 (Semibold) | 1.20 | `-0.12px` | `[CONFIRMED]` |
| **Top Menu Items**| `SF Pro Text, system-ui` | `12px` | 500 (Medium) | 1.00 | `-0.12px` | `[CONFIRMED]` |
| **Desktop Icons** | `SF Pro Text, system-ui` | `11px` | 500 (Medium) | 1.20 | `-0.01em` | `[CONFIRMED]` |
| **Terminal CLI** | `'JetBrains Mono', monospace` | `13px` | 400 (Regular) | 1.50 | `-0.01em` | `[CONFIRMED]` |
| **App Headlines** | `SF Pro Display, system-ui` | `40px` | 600 (Semibold) | 1.10 | `0px` (`display-lg`) | `[CONFIRMED]` |
| **App Body Copy** | `SF Pro Text, system-ui` | `17px` | 400 (Regular) | 1.47 | `-0.374px` (`body`) | `[CONFIRMED]` |

---

## 4. Visual Styling Tokens & CSS Parameters

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Visual Styling Specification                           │
├───────────────────┬─────────────────────────────────────────────────────────────┤
│ Backdrop Blur     │ • Top Menu Bar: backdrop-filter: blur(24px) saturate(180%) │
│                   │ • Window Chrome: backdrop-filter: blur(28px) saturate(180%)│
│                   │ • Control Center: backdrop-filter: blur(24px)               │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ Box Shadows       │ • Active Window: 0 20px 70px rgba(0,0,0,0.55), 0 0 0 1px ...│
│                   │ • Inactive Window: 0 10px 30px rgba(0,0,0,0.35)             │
│                   │ • Floating Dock: 0 8px 32px rgba(0,0,0,0.35)               │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ Border Hairlines  │ • Dark Stroke: 1px solid rgba(255, 255, 255, 0.12)          │
│                   │ • Light Stroke: 1px solid rgba(0, 0, 0, 0.08)               │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ Border Radii      │ • Windows: 18px ({rounded.lg})                              │
│                   │ • Cards / Modules: 18px ({rounded.lg})                      │
│                   │ • Control Pills: 9999px ({rounded.pill})                    │
│                   │ • Utility Buttons: 8px ({rounded.sm})                       │
└───────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 5. Token Harmonization Mapping to `design.md`

| OS Token | Canonical `design.md` Token | Hex / Value | Role in OS Desktop |
|---|---|---|---|
| Active Accent Blue | `{colors.primary}` | `#0066cc` | Selection marquee, active icon label, focus rings |
| Dark Surface Accent| `{colors.primary-on-dark}` | `#2997ff` | Dark mode links, active indicators |
| Keyboard Focus | `{colors.primary-focus}` | `#0071e3` | `outline: 2px solid #0071e3` on buttons |
| Primary Ink | `{colors.ink}` | `#1d1d1f` | Light mode window body text & headlines |
| Body on Dark | `{colors.body-on-dark}` | `#ffffff` | Dark mode window text & titlebar labels |
| Canvas Parchment | `{colors.canvas-parchment}` | `#f5f5f7` | Light mode window background fill |
| Dark Tile Surface 1| `{colors.surface-tile-1}` | `#272729` | Dark mode window body background |
| Dark Tile Surface 2| `{colors.surface-tile-2}` | `#2a2a2c` | Dark mode window titlebar header |
| Hairline Border | `{colors.hairline}` | `#e0e0e0` | Store card and window partition hairlines |
| Action Button Shape| `{rounded.pill}` | `9999px` | Traffic light buttons, filter pills, pill CTAs |
| Window Corner Shape| `{rounded.lg}` | `18px` | Window frames and project cards |
| Active Button Press| `{component.button-primary-active}` | `scale(0.95)` | Universally applied to all OS buttons |
