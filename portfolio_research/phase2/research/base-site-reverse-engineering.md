# Base OS Reverse Engineering — Implementation-Ready Analysis
## Source: irfannaikwade.in | Phase 2 Specification Document

**Confidence Classification**: All values tagged [CONFIRMED] from Phase 1 DOM/CSS extraction unless noted.

---

## 1. Viewport & Spatial Architecture [CONFIRMED]

| Property | Value |
|----------|-------|
| Root Container | `100vw × 100vh`, `overflow: hidden`, `user-select: none` |
| Font Stack | `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif` |
| Mono Font | `"SF Mono", "JetBrains Mono", "Fira Code", Menlo, monospace` |
| Background | `#000000` (dark), `#f5f5f7` (light) |
| Antialiasing | `font-smoothing: antialiased` |

### Z-Index Layer Stack [CONFIRMED]

| Layer | Z-Index | Component | Pointer Events |
|-------|---------|-----------|----------------|
| 0 | `z-0` | Wallpaper + Tint Overlay | `none` |
| 1 | `z-10` | Desktop Canvas + Icon Grid | `auto` |
| 2 | `z-20 – z-39` | Inactive Windows | `auto` |
| 3 | `z-40` | Bottom Dock (original — **WILL BE REPLACED**) | `auto` |
| 4 | `z-41 – z-49` | Active Window (topmost) | `auto` |
| 5 | `z-50` | Top Menu Bar | `auto` |
| 6 | `z-60` | Menu Dropdowns & Control Center | `auto` |
| 7 | `z-70` | Context Menus | `auto` |
| 8 | `z-80` | Spotlight Search (Cmd+K) | `auto` |
| 9 | `z-90` | Notification Toasts | `auto` |
| 10 | `z-[9999]` | Lock Screen / Modal Alerts | `auto` |

**Phase 2 Revised Layer Stack** (incorporating Luca/Michal/Nidal):

| Layer | Z-Index | Component | Source |
|-------|---------|-----------|--------|
| 0 | `z-0` | Wallpaper + **Michal KineticHeroStage** | BASE + MICHAL |
| 1 | `z-10` | Desktop Canvas + Icon Grid | BASE (KEEP) |
| 2 | `z-20 – z-49` | Windows (inactive z-20..39, active z-45) | BASE (KEEP) |
| 3 | `z-50` | Top Menu Bar | BASE (KEEP) |
| 4 | `z-[9990]` | **Luca Dock** + **Nidal Music Pill** | LUCA + NIDAL (REPLACE) |
| 5 | `z-[9992]` | **Nidal Audio Deck Expanded** | NIDAL (ADD) |
| 6 | `z-[9995]` | Spotlight, Context Menus, Modals | BASE (KEEP) |
| 7 | `z-[9999]` | **Michal Kinetic Cursor** | MICHAL (ADD) |

---

## 2. Desktop Wallpaper System [CONFIRMED]

| Property | Value |
|----------|-------|
| Container | `absolute inset-0 z-0 pointer-events-none` |
| Image Format | `.webp` / `.avif` |
| Image Sizing | `w-full h-full object-cover` |
| Overlay (Dark) | `bg-black/25 backdrop-brightness-95` |
| Overlay (Light) | `bg-black/10 backdrop-brightness-95` |
| Transition | `duration-700 ease-out` on wallpaper swap |
| Selection | User-configurable via Settings app, persisted to localStorage |

---

## 3. Desktop Icon Grid [CONFIRMED]

| Property | Value |
|----------|-------|
| Grid Layout | `grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)]` |
| Gap | `gap-y-3 gap-x-2` (12px vertical, 8px horizontal) |
| Padding | `p-4` (16px all sides) |
| Container Height | `h-[calc(100vh-28px)]`, positioned `top-[28px]` |
| Icon Wrapper Size | `w-12 h-12` (48×48px) |
| Icon Drop Shadow | `drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]` |
| Icon Hover Scale | `scale-105`, `duration-150` |
| Label Font | `text-[11px] font-medium text-white` |
| Label Shadow | `drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]` |
| Label Max Width | `max-w-[84px] line-clamp-2` |
| Selection Highlight | `hover:bg-white/15 hover:border-white/10` |
| Active State | `active:bg-white/25` |
| Focus State | `focus:bg-white/30 focus:border-white/20` |
| Click Behavior | Single click: select. Double click: launch app (300ms disambiguation timer) |
| Touch Behavior | Single tap: launch directly (bypasses double-click) |

---

## 4. Window System [CONFIRMED]

### 4.1 Window Frame Structure

| Property | Value |
|----------|-------|
| Corner Radius | `rounded-xl` (12px) — `0px` when maximized |
| Border | `1px` — focused: `var(--os-window-border)`, unfocused: `rgba(255,255,255,0.08)` |
| Backdrop Filter | `blur(28px) saturate(180%)` |
| Body Background | Light: `rgba(255,255,255,0.96)`, Dark: `rgba(24,24,28,0.95)` |
| Header Height | `h-9` (36px) |
| Header Background | Light: `rgba(246,246,246,0.88)`, Dark: `rgba(36,36,40,0.85)` |
| Header Border | `border-b border-black/10 dark:border-white/10` |
| Header Cursor | `cursor-grab`, `active:cursor-grabbing` |
| Title Font | `text-[12px] font-semibold tracking-tight` |
| Title Icon | `w-4 h-4` (16×16px) |
| Content Padding | `p-4` (16px) |
| Content Font | `text-[13px] leading-relaxed` |
| Min Size | `360×240px` |
| Positioning | `absolute`, `left/top` in pixels |

### 4.2 Traffic Light Controls [CONFIRMED]

| Button | Color | Border | Hover Glyph | Glyph Color |
|--------|-------|--------|-------------|-------------|
| Close | `#FF5F56` | `#E0443E` | `✕` | `#4D0000` at 75% opacity |
| Minimize | `#FFBD2E` | `#DEA123` | `−` | `#995700` at 75% opacity |
| Maximize | `#27C93F` | `#1AAB29` | `⤢` | `#006400` at 75% opacity |

All buttons: `12px` diameter (`w-3 h-3`), `rounded-full`, `gap-2` (8px spacing). Glyphs hidden by default, visible on parent group hover.

### 4.3 Window Shadow System [CONFIRMED]

| State | Shadow Value |
|-------|-------------|
| Inactive (Light) | `0 10px 30px -5px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)` |
| Active (Light) | `0 25px 50px -12px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.12), 0 0 35px rgba(0,0,0,0.15)` |
| Inactive (Dark) | `0 10px 30px -5px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)` |
| Active (Dark) | `0 25px 60px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.2), 0 0 40px rgba(0,0,0,0.4)` |
| Focus Transition | `duration-200` ease |

### 4.4 Window Lifecycle Animations [CONFIRMED]

| Event | Properties | Duration | Easing | Spring Params |
|-------|-----------|----------|--------|---------------|
| Open | `scale: [0.85→1.0]`, `opacity: [0→1]`, `filter: blur(8px)→blur(0)` | 280ms | `cubic-bezier(0.16, 1, 0.3, 1)` | stiffness: 380, damping: 30, mass: 0.8 |
| Close | `scale: [1.0→0.88]`, `opacity: [1→0]`, `filter: blur(0)→blur(4px)` | 180ms | `cubic-bezier(0.4, 0, 0.6, 1)` | stiffness: 420, damping: 35 |
| Maximize | `x,y,width,height`, `border-radius: [12px→0]` | 320ms | `cubic-bezier(0.2, 0.9, 0.2, 1)` | stiffness: 300, damping: 26 |
| Minimize | `scale→0.1`, `opacity→0`, `y→dockY` | 320ms | `cubic-bezier(0.25, 1, 0.5, 1)` | — |
| Focus Change | `box-shadow` transition | 150ms | `ease-out` | — |

### 4.5 Window Drag Clamping [CONFIRMED]

```
x_clamped = max(-(width - 100), min(x, viewportWidth - 100))
y_clamped = max(28, min(y, viewportHeight - 60))
```
- Y ≥ 28px: prevents occlusion of top menu bar
- Partial overhang allowed: 100px minimum visible

### 4.6 Window Cascade Spawning [CONFIRMED]

```
spawnX = baseX + (N_open × 24) mod (viewportWidth - width)
spawnY = baseY + (N_open × 24) mod (viewportHeight - height - 28)
```

### 4.7 Resize Handles [CONFIRMED]

| Handle | Size | Cursor |
|--------|------|--------|
| N, S | `h-1.5` (6px), full width minus 8px inset | `ns-resize` |
| E, W | `w-1.5` (6px), full height minus 8px inset | `ew-resize` |
| NE, NW, SE, SW | `w-3 h-3` (12×12px) | `nesw-resize` / `nwse-resize` |

---

## 5. Top Menu Bar [CONFIRMED]

| Property | Value |
|----------|-------|
| Height | `h-7` (28px) |
| Position | `fixed top-0 left-0 right-0` |
| Z-Index | `z-50` |
| Padding | `px-3` (12px horizontal) |
| Layout | `flex items-center justify-between` |
| Background (Light) | `bg-white/70` |
| Background (Dark) | `bg-black/40` |
| Backdrop Filter | `backdrop-blur-2xl` |
| Border | `border-b border-black/5 dark:border-white/10` |
| Shadow | `shadow-sm` |
| Text Color | Light: `text-neutral-900`, Dark: `text-neutral-100` |
| Text Size | `text-[12px] font-medium` |
| Apple Logo | `w-3.5 h-3.5` (14×14px) SVG |
| Active App Title | `text-[12.5px] font-semibold tracking-tight` |
| Menu Items | `px-2 py-0.5 rounded`, hover: `bg-black/10 dark:bg-white/15` |
| Menu Items (Desktop) | File, Edit, View, Window, Help — hidden below `sm` breakpoint |
| Status Tray Gap | `gap-2.5` (10px) |
| Status Icons | `p-1 rounded`, hover: `bg-black/10 dark:bg-white/15` |
| Clock | `text-[12px] font-medium tracking-tight`, format: `Sat Aug 15 12:51 PM` |

---

## 6. Original Dock (TO BE REPLACED) [CONFIRMED]

| Property | Value |
|----------|-------|
| Position | `fixed bottom-3 left-1/2 -translate-x-1/2 z-40` |
| Layout | `flex items-end gap-2.5` |
| Padding | `px-3.5 py-2.5` |
| Border Radius | `rounded-2xl` (16px) |
| Background | Light: `bg-white/25`, Dark: `bg-black/30` |
| Backdrop Filter | `backdrop-blur-2xl` |
| Border | `border-white/20 dark:border-white/10` |
| Shadow | `0 15px 35px rgba(0,0,0,0.3)` |

> **INTEGRATION DECISION**: This dock is **REMOVED** entirely and **REPLACED** by the Luca Felix parabolic dock.

---

## 7. Applications [CONFIRMED]

| App ID | Title | Purpose | Default Size [PROBABLE] |
|--------|-------|---------|------------------------|
| `finder` | Finder | Virtual filesystem browser, folder tree, file preview | 700×500px |
| `terminal` | Terminal | Interactive CLI, Neofetch, command parser, Easter eggs | 640×400px |
| `projects` | Projects | Filterable gallery, spotlight cards, tech stack pills | 800×550px |
| `about` | About Me | Bio, career timeline, skill radar, PDF resume | 700×500px |
| `settings` | Settings | Wallpaper picker, theme toggle, dock size, sound FX | 600×450px |
| `mail` | Mail | Contact form, validation, paper airplane animation | 550×400px |

---

## 8. Responsive System [CONFIRMED]

### Breakpoint: ≥768px (Desktop)
- Full multi-window OS desktop
- Floating windows with drag/resize
- Dock with parabolic magnification
- Custom cursor active
- Right-click context menus
- Keyboard shortcuts active

### Breakpoint: <768px (Mobile) [CONFIRMED]
- Windows → 92vh bottom sheets with swipe-to-dismiss (140px threshold)
- Dock → Fixed bottom tab bar (52px + safe-area-inset-bottom)
- Magnification disabled (1.0× fixed)
- Desktop icons hidden (apps via tab bar)
- Top menu bar → Simplified status bar
- Context menus → Long-press activation
- Custom cursor → Disabled
- Spotlight → Search icon in header

---

## 9. Sound System [CONFIRMED]

| Event | Sound Type | Implementation |
|-------|-----------|---------------|
| Window Open | Pop/chime | Web Audio procedural synthesis |
| Window Close | Whoosh | Web Audio procedural synthesis |
| Trash Empty | Crumple | Web Audio procedural synthesis |
| Error | Error chime | Web Audio procedural synthesis |

AudioContext initialized on first user interaction (iOS Safari policy compliance).

---

## 10. Integration Impact Summary

### KEEP (Unchanged)
- Top Menu Bar (structure, styling, dynamic app binding)
- Window Frame system (drag, resize, traffic lights, z-index, animations)
- Desktop Canvas and Icon Grid
- All application components (Terminal, Projects, About, Finder, Settings, Mail)
- Context Menu system
- Spotlight Search
- Keyboard shortcut registry
- Selection Marquee
- Light/Dark theme system
- localStorage persistence

### REPLACE
- **Original Dock** → Luca Felix Parabolic Dock (z-40 → z-[9990])
- **Static Wallpaper** → Michal KineticHeroStage on Layer 0 (wallpaper image remains as fallback/tint)

### ADD
- Kinetic Cursor (Layer 7, z-[9999]) — from Michal
- Music Player Dock Pill (embedded in Luca Dock) — from Nidal
- Audio Deck Expanded Modal (z-[9992]) — from Nidal
- Ambient/Workspace dual-mode switching
- GlobalAudioManager (singleton AudioContext with ducking)

### MODIFY
- Z-index system: restructured to accommodate new layers
- Window minimize: animation target changes from old dock position to Luca dock position
- Desktop mode: now supports ambient-hero ↔ workspace transitions
- Audio system: procedural FX now route through GlobalAudioManager with ducking

