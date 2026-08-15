# Base OS Architecture & Structural Specification (`irfannaikwade.in`)

**Target Reference**: `irfannaikwade.in` (macOS-style Virtual Desktop Environment)  
**Document**: Desktop Layout, Coordinate Space, Window Container Hierarchy, Menu Bar, App Grid & Z-Index Layering  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Spatial Layout & Coordinate System

The Base OS implements a non-scrolling Single-Page Virtual Desktop Environment (VDE) pinned to the viewport bounds.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐ (0, 0)
│   Finder   File   Edit   View   Window   Help                 [100%] Sat Aug 15 12:51 │  <-- Top Menu Bar (h: 28px, z-index: 50)
├────────────────────────────────────────────────────────────────────────────────────────┤ (0, 28px)
│  [Desktop Canvas / Usable Workspace: 100vw × calc(100vh - 28px)]                       │
│                                                                                        │
│  ┌──────────┐  ┌──────────┐                                                            │
│  │ Projects │  │ Terminal │                                                            │
│  └──────────┘  └──────────┘         ┌───────────────────────────────────────┐          │
│  ┌──────────┐  ┌──────────┐         │ 🔴 🟡 🟢  Projects — IrfanOS          │          │  <-- Active Window (z-index: 41..49)
│  │  About   │  │ Settings │         ├───────────────────────────────────────┤          │
│  └──────────┘  └──────────┘         │ Glassmorphic Container                │          │
│  ┌──────────┐                       │ backdrop-filter: blur(28px)           │          │
│  │  Finder  │                       │ 1px hairline border                   │          │
│  └──────────┘                       └───────────────────────────────────────┘          │
│                                                                                        │
│                    ┌──────────────────────────────────────┐                            │
│                    │  [Finder] [Term] [Apps] [Mail] [Set] │                            │  <-- Bottom Dock (z-index: 40)
└────────────────────┴──────────────────────────────────────┴────────────────────────────┘ (W_viewport, H_viewport)
```

### 1.1 Viewport Parameters & Coordinate Math
- **Viewport Bounds**: `100vw × 100vh` (`100dvh` on mobile) `[CONFIRMED]`.
- **Root Scroll Locking**: `overflow: hidden; user-select: none; position: fixed; inset: 0;` `[CONFIRMED]`.
- **Coordinate Origin $(0, 0)$**: Top-left of the viewport.
- **Top Menu Bar Inset**: $H_{\text{menubar}} = 28\text{px}$ (`h-7`) `[CONFIRMED]`.
- **Usable Desktop Workspace**:
  $$\text{Workspace Top} = 28\text{px} \quad [CONFIRMED]$$
  $$\text{Workspace Width} = W_{\text{viewport}} \quad [CONFIRMED]$$
  $$\text{Workspace Height} = H_{\text{viewport}} - 28\text{px} \quad [CONFIRMED]$$
- **Wallpaper Canvas**: Dedicated backdrop layer at `z-index: 0` using `object-fit: cover; object-position: center; width: 100%; height: 100%;` `[CONFIRMED]`. Ambient brightness overlay: `bg-black/10` (light mode) / `bg-black/25 backdrop-brightness-95` (dark mode) `[CONFIRMED]`.

---

## 2. Desktop Icon Grid Layout

Desktop icons populate in a vertical column-first orientation mirroring classic Unix/macOS desktop file systems.

```
Desktop Inset: 16px
┌──────────────┐  ┌──────────────┐
│ [Icon 48px]  │  │ [Icon 48px]  │
│  Projects    │  │  Terminal    │  Cell Width: 92px
│ (Cell: 104px)│  │ (Cell: 104px)│  Cell Height: 104px
└──────────────┘  └──────────────┘  Col Gap: 8px, Row Gap: 12px
┌──────────────┐  ┌──────────────┐
│ [Icon 48px]  │  │ [Icon 48px]  │
│    About     │  │   Settings   │
└──────────────┘  └──────────────┘
```

### 2.1 CSS Grid Specification `[CONFIRMED]`
- **Auto-Flow Mode**: `grid-auto-flow: column` (populates top-to-bottom before creating next column to the right) `[CONFIRMED]`.
- **Column Dimensions**: `auto-cols-[92px]` ($W_{\text{cell}} = 92\text{px}$) `[CONFIRMED]`.
- **Row Dimensions**: `grid-rows-[repeat(auto-fill, 104px)]` ($H_{\text{cell}} = 104\text{px}$) `[CONFIRMED]`.
- **Column Gap ($x$)**: `8px` (`gap-x-2`) `[CONFIRMED]`.
- **Row Gap ($y$)**: `12px` (`gap-y-3`) `[CONFIRMED]`.
- **Outer Padding**: `16px` (`p-4`) `[CONFIRMED]`.

### 2.2 Icon Item Box Model `[CONFIRMED]`
- **Item Container**: Button element `84px × 96px` with `display: flex; flex-direction: column; align-items: center; justify-content: center;` `[CONFIRMED]`.
- **Graphic Glyph**: `48px × 48px` (`w-12 h-12`) SVG / WebP squircle `[CONFIRMED]`.
- **Graphic Elevation**: `filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35))` `[CONFIRMED]`.
- **Text Label**: `11px` font size, `font-weight: 500` (Medium), `line-height: 1.2`, `letter-spacing: -0.01em`, color `#ffffff` with `text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85)` `[CONFIRMED]`.
- **Selection State**: Background `rgba(255, 255, 255, 0.25)`, border `1px solid rgba(255, 255, 255, 0.20)`, label background `{colors.primary}` (`#0066cc`) with `rounded-[3px]` `[CONFIRMED]`.

---

## 3. Window Container Hierarchy & DOM Architecture

Each window operates in isolated DOM subtrees, separating chrome headers, control actions, and scrollable content viewports.

```
<div class="window-frame" data-window-id="{id}" data-focused="{bool}">
  ├── <div class="window-header" data-drag-handle="true">
  │     ├── <div class="traffic-lights"> (Close, Minimize, Maximize)
  │     ├── <div class="window-title-container"> (Icon + App Title)
  │     └── <div class="window-header-actions"> (Search, Tabs, Tools)
  ├── <div class="window-content-viewport">
  │     └── <AppSpecificComponent /> (Sandboxed View)
  └── <div class="resize-handle-grid"> (8 cardinal & corner handles)
</div>
```

### 3.1 Window Chrome Dimensions & Properties `[CONFIRMED]`
- **Titlebar Header Height**: `36px` (`h-9`) `[CONFIRMED]`.
- **Titlebar Header Background**: `rgba(246, 246, 246, 0.88)` (Light) / `rgba(36, 36, 40, 0.85)` (Dark) `[CONFIRMED]`.
- **Header Border Bottom**: `1px solid rgba(0, 0, 0, 0.10)` (Light) / `1px solid rgba(255, 255, 255, 0.10)` (Dark) `[CONFIRMED]`.
- **Window Corner Radius**: `12px` - `16px` (`{rounded.lg}` / `18px` in harmonized design tokens) `[CONFIRMED]`.
- **Window Body Backdrop Filter**: `backdrop-filter: blur(28px) saturate(180%)` `[CONFIRMED]`.
- **Window Default Min Bounds**: `min-width: 360px`, `min-height: 240px` (Terminal: `400px × 260px`, Finder: `450px × 320px`) `[CONFIRMED]`.

### 3.2 Traffic Light Control Geometry `[CONFIRMED]`
- **Dot Diameter**: `12px × 12px` (`w-3 h-3`) `[CONFIRMED]`.
- **Inter-Dot Gap**: `8px` (`gap-2`) `[CONFIRMED]`.
- **Left Margin**: `12px` (`px-3`) `[CONFIRMED]`.
- **Close Dot (Red)**: Background `#FF5F56`, border `1px solid #E0443E`, hover glyph `✕` (#4D0000) `[CONFIRMED]`.
- **Minimize Dot (Yellow)**: Background `#FFBD2E`, border `1px solid #DEA123`, hover glyph `−` (#995700) `[CONFIRMED]`.
- **Maximize Dot (Green)**: Background `#27C93F`, border `1px solid #1AAB29`, hover glyph `⤢` (#006400) `[CONFIRMED]`.
- **Simultaneous Group Hover**: Hovering any dot exposes glyphs on all 3 dots simultaneously via `.group-hover/lights:opacity-100` `[CONFIRMED]`.

---

## 4. Top Menu Bar Architecture

Pinned `28px` top strip managing global application status and OS utilities.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Finder  File  Edit  View  Go  Window  Help           [ 100% 🔋 ] [ 📶 ] [ Sat 12:51 ]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Height**: Fixed `28px` (`h-7`), full width `100vw`, `position: fixed; top: 0; left: 0;` `[CONFIRMED]`.
- **Styling**: `bg-white/70 dark:bg-[#1a1a1a]/65 backdrop-blur-2xl border-b border-black/5 dark:border-white/10` `[CONFIRMED]`.
- **Typography**: `-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`, `12px` font size, `font-weight: 500` `[CONFIRMED]`.
- **Left Navigation Cluster**:
  - Apple Crest Logo (`14px × 14px` SVG) with dropdown menu (About This Mac, System Settings, App Store, Restart, Lock Screen) `[CONFIRMED]`.
  - Active Application Name (`font-semibold text-[12.5px]`) dynamically bound to focused window `[CONFIRMED]`.
  - Global Context Menus (`File`, `Edit`, `View`, `Go`, `Window`, `Help`) `[CONFIRMED]`.
- **Right Status Tray**:
  - Battery indicator (`100%` + SVG battery glyph) `[CONFIRMED]`.
  - Wi-Fi connection indicator SVG `[CONFIRMED]`.
  - Audio/Volume quick switch `[CONFIRMED]`.
  - Control Center toggle icon (`w-4 h-4`) spawning 300px popover modal at `top: 36px, right: 12px` `[CONFIRMED]`.
  - Real-time Date/Clock updated at `1000ms` intervals `[CONFIRMED]`.

---

## 5. Z-Index Layering Hierarchy

Strict layering hierarchy prevents overlapping collisions between windows, dock, context menus, and modals:

| Layer Level | Z-Index Range | Elements / Containers | Classification |
|---|---|---|---|
| **Layer 0: Background** | `z-0` | Wallpaper image, day/night overlay, ambient canvas filters | `[CONFIRMED]` |
| **Layer 1: Desktop Surface** | `z-10` | Desktop icon grid, lasso selection box marquee | `[CONFIRMED]` |
| **Layer 2: Inactive Windows** | `z-20` to `z-39` | Unfocused open background windows (ordered by historical click index) | `[CONFIRMED]` |
| **Layer 3: Floating Dock** | `z-40` | Bottom macOS dock container and magnified icons | `[CONFIRMED]` |
| **Layer 4: Active Window** | `z-41` to `z-49` | Current focused/topmost window and active resize bounding box | `[CONFIRMED]` |
| **Layer 5: Top Menu Bar** | `z-50` | Pinned top menu bar and system clock | `[CONFIRMED]` |
| **Layer 6: Menus & Popovers** | `z-60` to `z-70` | Desktop context menus, menu bar dropdowns, Control Center popover | `[CONFIRMED]` |
| **Layer 7: Modals & Overlays** | `z-80` to `z-100` | Spotlight command palette, alert dialogs, full-screen lockscreen | `[CONFIRMED]` |

---

## 6. Layout Compliance with `design.md`

1. **Top Nav Height Conflict**: `design.md` defines `{component.global-nav}` at `44px` in pure black `#000000`. Base OS desktop mode uses native macOS `28px` (`h-7`) translucent menu bar. **Resolution**: Maintain `28px` menu bar in Desktop Mode; switch to `44px` `{component.global-nav}` on mobile viewports ($\le 768\text{px}$).
2. **Typography**: SF Pro Text `12px` with negative tracking `-0.12px` (`{typography.nav-link}`) perfectly satisfies menu bar links.
3. **Corner Radii**: Window frame corners map to `{rounded.lg}` (`18px`) in accordance with `design.md`.
