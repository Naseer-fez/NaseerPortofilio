# Project: High-Performance OS-Style Web Portfolio

## Architecture & Scope
Implementation of a production-grade, Apple-inspired OS-style web portfolio combining:
1. **Base OS Shell & Multi-Window Desktop Manager**: Virtual desktop, top menu bar (height 28px, z-50), window manager supporting draggable, 8-way resizable windows, click-to-front z-index promotion, macOS traffic light controls (close, minimize, maximize), and rich mock application visual shells (Projects, Terminal, About, Finder, Settings).
2. **Proximity-Scaling Taskbar**: Floating glassmorphic dock pill centered at bottom with mathematical cosine proximity scaling ($R=150\text{px}$, $S_{base}=40\text{px} \to S_{max}=72\text{px}$), tooltip tags, running indicator dots, and smooth spring physics.
3. **Kinetic Typography Home Screen**: Full-bleed hero canvas with pointer-tracked variable font weight deformation ($\text{wght} \in [600, 850]$, Cosine bell falloff $R=220\text{px}$), 4-corner metadata anchors, ambient radial spotlight, and 0% idle CPU footprint.
4. **Floating Music Player Widget**: Dual-state glassmorphic widget toggling between compact pill ($340\times 68\text{px}$) and expanded popover ($380\times 520\text{px}$), strictly requiring explicit user gesture to initialize/play audio (ZERO autoplay on load), vinyl disc rotation with inertia deceleration, audio scrubber, and visualizer.
5. **Apple Design System Alignment**: Full compliance with `design.md` color palette (Action Blue `#0066cc`, Obsidian `#0a0a0c`, SF Pro typography, glassmorphism, exact border radii and elevation shadows).

Target Directory: `d:/CODE/Html/test/os_portfolio`
Stack: React + Vite + TypeScript / Tailwind CSS / Lucide Icons / Web Audio API.

## Implementation Milestones
| # | Milestone Name | Scope | Dependencies | Status |
|---|----------------|-------|--------------|--------|
| 1 | Scaffolding & Design System Foundations | Vite+React+TS setup, Tailwind config matching `design.md`, Lucide icons, audio assets, shared window/dock state stores | none | DONE |
| 2 | Base OS Shell & Multi-Window Desktop Manager | Top Menu Bar, Desktop Icon Grid, Draggable/Resizable Window Chrome with Traffic Lights, Multi-Window Focus Z-Index promotion, Mock Apps (Projects, Terminal, About, Finder) | M1 | DONE |
| 3 | Proximity-Scaling Taskbar Dock | Floating dock capsule, Cosine proximity magnification math, dynamic spring interpolation, tooltip pills, window toggle integration | M1, M2 | DONE |
| 4 | Kinetic Typography Hero Home Screen | Full-bleed hero canvas, variable font pointer tracking with cosine bell falloff, 4-corner metadata chips, ambient spotlight | M1 | DONE |
| 5 | Floating Music Player Widget | Dual-mode capsule/popover, strict zero autoplay on load, user-gesture audio unlock, vinyl rotation animation, waveform visualizer | M1 | DONE |
| 6 | Integration, Build & E2E Verification | Multi-window interaction testing, dock hover validation, hero kinetic response, audio autoplay audit, `npm run build` execution | M1-M5 | DONE |
| 7 | Independent Review, Challenge & Forensic Audit | 2 Reviewers, 2 Challengers, and Forensic Integrity Auditor sign-off | M6 | DONE |

## Verification & Audit Sign-Off
- Forensic Integrity Auditor Verdict: **CLEAN (GENUINE IMPLEMENTATION VERIFIED)**
- Reviewer 1 Verdict: **APPROVE (Architecture, Window Manager, 8-way resize, Visual Shells verified)**
- Reviewer 2 Verdict: **APPROVE (Apple design tokens, Dock math, Kinetic Typography, Zero-autoplay audio verified)**
- Challenger 1 Verdict: **PASS (119 test assertions passed: 100% boundary clamping, C1 continuity dock math, resize limits)**
- Challenger 2 Verdict: **PASS (100% Zero-autoplay security, 0% CPU sleep loop, layout thrashing elimination verified)**
- Build Verification: **PASS (`npm run build` completes with Exit Code 0, 0 TypeScript errors)**


## Interface Contracts & Data Standards
- **Window State Machine**:
  ```ts
  interface WindowInstance {
    id: string;
    title: string;
    icon: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isFocused: boolean;
    zIndex: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    prevBounds?: { x: number; y: number; width: number; height: number };
    component: React.ComponentType;
  }
  ```
- **Proximity Scaling Formula**:
  $$W_i(x) = S_{base} + \frac{S_{max} - S_{base}}{2} \cdot \left[1 + \cos\left(\frac{\pi \cdot \min(|x - x_i|, R)}{R}\right)\right]$$
  where $S_{base}=40\text{px}$, $S_{max}=72\text{px}$, $R=150\text{px}$.
- **Kinetic Typography Formula**:
  $$f(d_i) = \cos^2\left(\frac{\pi \cdot \min(d_i, R)}{2R}\right), \quad \text{wght}_i = 600 + (850 - 600) \cdot f(d_i)$$
  where $R=220\text{px}$, $d_i = \sqrt{(x - cx_i)^2 + (y - cy_i)^2}$.
- **Audio Lifecycle Contract**:
  - Initial state must be `IDLE` / `PAUSED`.
  - No `AudioContext` resumption or `.play()` calls in `useEffect`, `componentDidMount`, or module loading.
  - Playback triggered purely on explicit click of Play button or track selection.

## Code Layout
```
os_portfolio/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── os.ts
│   │   └── audio.ts
│   ├── context/
│   │   ├── WindowContext.tsx
│   │   └── AudioContext.tsx
│   ├── components/
│   │   ├── os/
│   │   │   ├── MenuBar.tsx
│   │   │   ├── Desktop.tsx
│   │   │   ├── WindowFrame.tsx
│   │   │   └── DesktopIcon.tsx
│   │   ├── dock/
│   │   │   ├── Dock.tsx
│   │   │   └── DockItem.tsx
│   │   ├── hero/
│   │   │   ├── KineticHero.tsx
│   │   │   └── MetadataAnchors.tsx
│   │   ├── music/
│   │   │   ├── MusicPlayer.tsx
│   │   │   ├── VinylTurntable.tsx
│   │   │   └── AudioVisualizer.tsx
│   │   └── apps/
│   │       ├── ProjectsApp.tsx
│   │       ├── TerminalApp.tsx
│   │       ├── AboutApp.tsx
│   │       └── FinderApp.tsx
│   └── utils/
│       ├── math.ts
│       └── audioTracks.ts
```

