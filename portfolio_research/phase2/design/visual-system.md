# Visual System — Component Visual Specifications
## Phase 2 Design Document

All values from Phase 1 research. Confidence: [CONFIRMED] unless noted.

---

## Color Tokens

### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| `--os-bg-desktop` | `#f5f5f7` | Desktop background |
| `--os-menubar-bg` | `rgba(255,255,255,0.72)` | Menu bar |
| `--os-menubar-border` | `rgba(0,0,0,0.08)` | Menu bar bottom |
| `--os-menubar-text` | `#1d1d1f` | Menu bar text |
| `--os-menubar-hover` | `rgba(0,0,0,0.06)` | Menu item hover |
| `--os-window-header-bg` | `rgba(246,246,246,0.88)` | Window title bar |
| `--os-window-header-border` | `rgba(0,0,0,0.12)` | Window header border |
| `--os-window-body-bg` | `rgba(255,255,255,0.96)` | Window content |
| `--os-window-text` | `#1d1d1f` | Window body text |
| `--os-window-text-muted` | `#6e6e73` | Secondary text |
| `--os-window-border` | `rgba(0,0,0,0.14)` | Window frame border |
| `--os-dock-bg` | `rgba(255,255,255,0.35)` | Original dock (reference) |
| `--os-dock-border` | `rgba(255,255,255,0.45)` | Original dock border |
| `--os-shadow-window-inactive` | `0 10px 30px -5px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)` | Unfocused window |
| `--os-shadow-window-active` | `0 25px 50px -12px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.12), 0 0 35px rgba(0,0,0,0.15)` | Focused window |

### Dark Mode
| Token | Value | Usage |
|-------|-------|-------|
| `--os-bg-desktop` | `#000000` | Desktop background |
| `--os-menubar-bg` | `rgba(26,26,26,0.65)` | Menu bar |
| `--os-menubar-border` | `rgba(255,255,255,0.12)` | Menu bar bottom |
| `--os-menubar-text` | `#f5f5f7` | Menu bar text |
| `--os-menubar-hover` | `rgba(255,255,255,0.12)` | Menu item hover |
| `--os-window-header-bg` | `rgba(36,36,40,0.85)` | Window title bar |
| `--os-window-header-border` | `rgba(255,255,255,0.1)` | Window header border |
| `--os-window-body-bg` | `rgba(24,24,28,0.95)` | Window content |
| `--os-window-text` | `#f5f5f7` | Window body text |
| `--os-window-text-muted` | `#a1a1a6` | Secondary text |
| `--os-window-border` | `rgba(255,255,255,0.15)` | Window frame border |
| `--os-dock-bg` | `rgba(20,20,20,0.45)` | Original dock (reference) |
| `--os-dock-border` | `rgba(255,255,255,0.18)` | Original dock border |
| `--os-shadow-window-inactive` | `0 10px 30px -5px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)` | Unfocused |
| `--os-shadow-window-active` | `0 25px 60px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.2), 0 0 40px rgba(0,0,0,0.4)` | Focused |

### Accent Colors
| Token | Value | Usage |
|-------|-------|-------|
| Action Blue | `#0071e3` (light) / `#2997ff` (dark) | Selection, focus, progress fills |
| Traffic Red | `#FF5F56` (border: `#E0443E`) | Close button |
| Traffic Yellow | `#FFBD2E` (border: `#DEA123`) | Minimize button |
| Traffic Green | `#27C93F` (border: `#1AAB29`) | Maximize button |

---

## Component Specifications

### Top Menu Bar

| Property | Value |
|----------|-------|
| Height | 28px |
| Position | `fixed top-0 left-0 right-0` |
| Z-Index | 50 |
| Padding | 0 12px |
| Background | Light: `rgba(255,255,255,0.72)`, Dark: `rgba(26,26,26,0.65)` |
| Backdrop Filter | `blur(40px)` (blur-2xl) |
| Border Bottom | Light: `rgba(0,0,0,0.05)`, Dark: `rgba(255,255,255,0.10)` |
| Shadow | `0 1px 2px rgba(0,0,0,0.05)` |
| Text Size | 12px |
| Text Weight | 500 (Medium) |
| Letter Spacing | -0.01em |
| Apple Logo | 14×14px SVG |
| Active App Title | 12.5px, weight 600, tracking -0.01em |
| Menu Items | padding 8px 2px, rounded 4px |
| Status Tray Gap | 10px |
| Clock | 12px, weight 500, tracking -0.01em |

### Window Frame

| Property | Value |
|----------|-------|
| Border Radius | 12px (0 when maximized) |
| Border | 1px solid (color varies by focus) |
| Backdrop Filter | `blur(28px) saturate(180%)` |
| Header Height | 36px |
| Header Padding | 0 12px |
| Title Font | 12px, weight 600, tracking -0.01em |
| Title Icon | 16×16px |
| Traffic Lights | 12px diameter, 8px gap |
| Content Padding | 16px |
| Content Font | 13px, weight 400, line-height 1.5 |
| Min Size | 360×240px |
| Resize Handle (edge) | 6px wide |
| Resize Handle (corner) | 12×12px |

### Dock (Luca)

| Property | Value |
|----------|-------|
| Z-Index | 9990 |
| Position | fixed, bottom center, 16px clearance |
| Chassis Background | Dark: `rgba(18,18,22,0.70)`, Light: `rgba(255,255,255,0.15)` |
| Chassis Backdrop | `blur(20px) saturate(190%) contrast(105%)` |
| Chassis Border | `1px solid rgba(255,255,255,0.12)` |
| Chassis Radius | 9999px (pill) |
| Specular Highlight | `inset 0 1px 1px 0 rgba(255,255,255,0.22)` |
| Chassis Shadow | `0 12px 36px -4px rgba(0,0,0,0.55), 0 4px 16px -2px rgba(0,0,0,0.35)` |
| Chassis Padding | 12px 12px 8px 12px |
| Item Base Size | 44×44px |
| Item Max Size | 68×68px |
| Item Gap | 6px [PROBABLE] |
| Squircle Radius | 22% |
| Tooltip BG | `rgba(24,24,28,0.88)` with `blur(12px)` |
| Tooltip Font | 11.5px, weight 500 |
| Tooltip Radius | 6px |
| Tooltip Padding | 4px 10px |
| Divider | 1px × 32px, `rgba(255,255,255,0.12)` |
| Active Dot | 3px, white 85%, glow `0 0 4px rgba(255,255,255,0.4)` |

### Music Player Pill (in Dock)

| Property | Value |
|----------|-------|
| Base Width | 120px |
| Max Width | 160px (magnified) |
| Height | Matches dock item (44-68px) |
| Background | `rgba(18,18,22,0.85)` [PROBABLE] |
| Border Radius | 12px |
| Artwork | 28×28px, rounded 6px |
| Title Font | 11px, weight 500, white |
| Artist Font | 10px, weight 400, `rgba(235,235,245,0.65)` |
| EQ Bar Width | 2px |
| EQ Bar Height | 4-16px animated |
| Play/Pause | 24×24px |

### Audio Deck Expanded

| Property | Value |
|----------|-------|
| Z-Index | 9992 |
| Width | 340px [PROBABLE] |
| Height | 480-520px [PROBABLE] |
| Background | `rgba(18,18,22,0.70)` |
| Backdrop Filter | `blur(32px) saturate(200%)` |
| Border | `1px solid rgba(255,255,255,0.12)` |
| Border Radius | 20px |
| Shadow | `0 24px 48px -12px rgba(0,0,0,0.70)` |
| Specular | `inset 0 1px 1px 0 rgba(255,255,255,0.20)` |
| Track Title | 16px, weight 600, `#f5f5f7` |
| Artist/Album | 13px, weight 400, `rgba(235,235,245,0.65)` |
| Vinyl Disc | 200×200px, rounded-full |
| Progress Track | 4px (6px hover) |
| Scrub Handle | 12px circle |
| Time Labels | 11px, weight 400 |

### Kinetic Hero Stage

| Property | Value |
|----------|-------|
| Z-Index | 0 |
| Size | 100vw × 100dvh |
| Font Size | `clamp(4.5rem, 14vw + 1rem, 18.5rem)` |
| Font Family | Inter Variable (fallback for PP Neue Montreal) |
| Font Weight | Variable 400-900 |
| Color | `#ffffff` |
| Text Transform | Uppercase |
| Line Height | 0.85-1.0 |
| Opacity (workspace) | 0.35 |
| Opacity (ambient) | 1.0 |

### Cursor

| Property | Value |
|----------|-------|
| Z-Index | 9999 |
| Dot Radius | 4px |
| Dot Color | `#ffffff` |
| Aura Base Radius | 24px |
| Aura Max Radius | 80px |
| Aura Border | 2px solid `rgba(255,255,255,0.6)` [PROBABLE] |
| Aura Blend | `mix-blend-mode: difference` |
| Pointer Events | none |

### Desktop Icons

| Property | Value |
|----------|-------|
| Column Width | 92px |
| Row Height | 104px |
| Gap | 8px horizontal, 12px vertical |
| Icon Size | 48×48px |
| Icon Shadow | `drop-shadow(0 4px 6px rgba(0,0,0,0.35))` |
| Label Font | 11px, weight 500, white |
| Label Shadow | `drop-shadow(0 1px 2px rgba(0,0,0,0.85))` |
| Label Max Width | 84px, 2-line clamp |
| Hover BG | `rgba(255,255,255,0.15)` |

