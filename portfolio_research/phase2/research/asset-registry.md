# Asset Registry
## Phase 2 Research Document

---

## Asset Classification Legend
- **Source**: BASE / LUCA / MICHAL / NIDAL / NEW
- **Programmatic**: YES = can be rendered via CSS/SVG/Canvas without external file

---

## Wallpapers & Backgrounds

| Asset | Source | Type | Format | Dimensions | Purpose | Programmatic | License | Destination |
|-------|--------|------|--------|------------|---------|-------------|---------|-------------|
| macOS Sonoma Dark wallpaper | BASE | Image | WebP/AVIF | 3840×2160 (4K) | Default dark theme desktop background | NO | SELF-CREATED (use similar) | `/public/wallpapers/` |
| macOS Sonoma Light wallpaper | BASE | Image | WebP/AVIF | 3840×2160 | Default light theme desktop background | NO | SELF-CREATED | `/public/wallpapers/` |
| Additional wallpapers (3-5) | NEW | Image | WebP/AVIF | 3840×2160 | User-selectable wallpapers in Settings | NO | OPEN (Unsplash/Pexels) | `/public/wallpapers/` |
| Wallpaper overlay tint | BASE | CSS | — | — | Dark: `bg-black/25`, Light: `bg-black/10` | YES | — | CSS |

## Icons

| Asset | Source | Type | Format | Dimensions | Purpose | Programmatic | License | Destination |
|-------|--------|------|--------|------------|---------|-------------|---------|-------------|
| Apple logo | BASE | SVG | SVG | 14×14px | Menu bar left icon | YES (inline SVG) | — | Inline component |
| Finder icon | BASE | SVG | SVG | 48×48px (desktop) / 26px (dock) | Finder app launcher | PARTIAL (can use emoji/SVG) | — | `/public/icons/` or inline |
| Terminal icon | BASE | SVG | SVG | 48×48 / 26px | Terminal app launcher | YES (CSS/SVG) | — | Inline |
| Projects icon | BASE | SVG | SVG | 48×48 / 26px | Projects app launcher | YES (Lucide icon) | OPEN | Inline |
| About Me icon | BASE | SVG | SVG | 48×48 / 26px | About app launcher | YES (Lucide icon) | OPEN | Inline |
| Settings icon | BASE | SVG | SVG | 48×48 / 26px | Settings app launcher | YES (Lucide icon) | OPEN | Inline |
| Mail icon | BASE | SVG | SVG | 48×48 / 26px | Mail/Contact app launcher | YES (Lucide icon) | OPEN | Inline |
| Trash icon | BASE | SVG | SVG | 48×48 / 26px | Trash desktop icon | YES (Lucide icon) | OPEN | Inline |
| Battery icon | BASE | SVG | SVG | 16×16px | Status tray | YES (SVG) | — | Inline |
| Wi-Fi icon | BASE | SVG | SVG | 16×16px | Status tray | YES (Lucide) | OPEN | Inline |
| Volume icon | BASE | SVG | SVG | 16×16px | Status tray + music player | YES (Lucide) | OPEN | Inline |
| Play/Pause icon | NIDAL | SVG | SVG | 24×24px | Music controls | YES (SVG morph) | — | Inline |
| Skip forward/back | NIDAL | SVG | SVG | 28×28px | Music transport | YES (Lucide) | OPEN | Inline |
| Shuffle icon | NIDAL | SVG | SVG | 20×20px | Music shuffle | YES (Lucide) | OPEN | Inline |
| Repeat icon | NIDAL | SVG | SVG | 20×20px | Music repeat | YES (Lucide) | OPEN | Inline |
| Queue icon | NIDAL | SVG | SVG | 24×24px | Playlist toggle | YES (Lucide) | OPEN | Inline |
| Chevron down | NIDAL | SVG | SVG | 24×24px | Collapse deck | YES (Lucide) | OPEN | Inline |
| Search icon | BASE | SVG | SVG | 16×16px | Spotlight search | YES (Lucide) | OPEN | Inline |

## Fonts

| Asset | Source | Type | Format | Purpose | Programmatic | License | Destination |
|-------|--------|------|--------|---------|-------------|---------|-------------|
| SF Pro Display / Text | BASE | Font | System font (not bundled) | Primary UI font | N/A — system font stack | Apple System | CSS font-family fallback |
| Inter Variable | BASE/MICHAL | Font | WOFF2 | Web fallback for SF Pro + hero typography | NO — download from Google Fonts | OPEN (OFL) | `/public/fonts/` or CDN |
| JetBrains Mono | BASE | Font | WOFF2 | Terminal/code monospace | NO — download | OPEN (OFL) | `/public/fonts/` or CDN |
| PP Neue Montreal | MICHAL | Font | WOFF2 | Kinetic hero ideal font | NO — proprietary license | PROPRIETARY — use Inter variable as fallback | N/A (use Inter) |

> **Resolution**: PP Neue Montreal / Monument Extended are proprietary. Use **Inter Variable** as the web-safe alternative for kinetic typography. Inter supports variable weight (100-900) which enables proximity-driven font-weight modulation.

## Audio

| Asset | Source | Type | Format | Duration | Purpose | Programmatic | License | Destination |
|-------|--------|------|--------|----------|---------|-------------|---------|-------------|
| Sample track 1 (Lofi ambient) | NEW | Audio | MP3 + WebM | 2-4 min | Development music playback | NO | OPEN (royalty-free) | `/public/audio/tracks/` |
| Sample track 2 | NEW | Audio | MP3 + WebM | 2-4 min | Development playlist | NO | OPEN | `/public/audio/tracks/` |
| Sample track 3 | NEW | Audio | MP3 + WebM | 2-4 min | Development playlist | NO | OPEN | `/public/audio/tracks/` |
| Album artwork 1-3 | NEW | Image | WebP | 512×512px | Track cover art for vinyl + pill | NO | OPEN/SELF-CREATED | `/public/audio/artwork/` |
| Window open sound | BASE | Audio | Procedural | ~100ms | Window open chime | YES (Web Audio oscillator) | — | Code |
| Window close sound | BASE | Audio | Procedural | ~80ms | Window close whoosh | YES (Web Audio) | — | Code |
| Trash empty sound | BASE | Audio | Procedural | ~150ms | Trash crumple | YES (Web Audio) | — | Code |
| Error sound | BASE | Audio | Procedural | ~200ms | Error chime | YES (Web Audio) | — | Code |

## Dock Elements (Programmatic)

| Asset | Source | Type | Purpose | Programmatic |
|-------|--------|------|---------|-------------|
| Dock chassis glassmorphism | LUCA | CSS | Backdrop blur + border + specular | YES |
| Icon squircle surface | LUCA | CSS | 22% border-radius gradient background | YES |
| Icon gloss overlay | LUCA | CSS | Linear gradient top-light effect | YES |
| Active dot indicator | LUCA | CSS | 3px circle with glow | YES |
| Tooltip arrow | LUCA | CSS | 5px triangle via borders | YES |
| Divider line | LUCA | CSS | 1px × 32px rgba line | YES |

## Music Player Elements (Programmatic)

| Asset | Source | Type | Purpose | Programmatic |
|-------|--------|------|---------|-------------|
| Vinyl disc grooves | NIDAL | CSS | Concentric rings via radial-gradient | YES |
| Vinyl center hole | NIDAL | CSS | Small circle overlay | YES |
| Equalizer bars | NIDAL | CSS | 3 animated bars via keyframes | YES |
| Progress track/fill | NIDAL | CSS | Horizontal bar with accent fill | YES |
| Scrub handle | NIDAL | CSS | 12px circle | YES |
| Volume slider | NIDAL | CSS | 3px track with handle | YES |

## Cursor Elements (Programmatic)

| Asset | Source | Type | Purpose | Programmatic |
|-------|--------|------|---------|-------------|
| Precision dot | MICHAL | CSS/Canvas | 4px white circle | YES |
| Aura ring | MICHAL | CSS/Canvas | 24-80px ring, difference blend | YES |
| Touch ripple | MICHAL | CSS | Expanding circle on touch | YES |

## Metadata Assets

| Asset | Source | Type | Format | Purpose | Destination |
|-------|--------|------|--------|---------|-------------|
| Favicon | NEW | Image | ICO/SVG | Browser tab icon | `/public/favicon.ico` |
| OG Image | NEW | Image | PNG | Social sharing preview | `/public/og-image.png` |
| Apple touch icon | NEW | Image | PNG | iOS home screen | `/public/apple-touch-icon.png` |

---

## Summary

| Category | External Files Needed | Programmatic (No File) |
|----------|----------------------|----------------------|
| Wallpapers | 4-6 images | 0 |
| Icons | 0 (all SVG/Lucide inline) | ~18 |
| Fonts | 2 (Inter Variable, JetBrains Mono) | 0 |
| Audio Tracks | 3 sample tracks | 0 |
| Audio FX | 0 | 4 (procedural) |
| Album Art | 3 placeholder images | 0 |
| Dock/Player UI | 0 | ~12 elements |
| Cursor | 0 | 3 elements |
| Metadata | 3 (favicon, OG, apple-touch) | 0 |
| **TOTAL** | **~15 external files** | **~37 programmatic** |

