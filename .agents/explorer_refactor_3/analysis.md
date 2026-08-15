# Technical Analysis & Implementation Blueprint: macOS Squircle Icons, Single-Click Desktop UX, Fisheye Dock & Test Audit

**Author**: Explorer 3 (Visual & Interaction Architecture)  
**Target Milestone**: macOS Portfolio OS UX & Visual Refactor  
**Date**: 2026-08-15  
**Project Root**: `d:/CODE/Html/Showcase`  
**Baseline Test Status**: 28 test suites, 281 tests passing (100%)

---

## 1. Executive Summary & Problem Decomposition

The visual and interaction overhaul of the macOS Portfolio OS requires elevating the visual fidelity, responsive physics, and desktop usability from a basic prototype to an authentic macOS Sonoma / Sequoia experience. This report investigates and provides precise specifications for five interconnected areas:

1. **Squircle SVG Icon Suite**: Replace basic single-letter divs (`app.title.charAt(0)`) and generic Lucide icons with bespoke, layered macOS squircle SVG components for the 6 core applications (`Terminal`, `Projects`, `About`, `Finder`, `Settings`, `Mail`).
2. **Desktop Single-Click Interaction**: Transition desktop icon activation from double-click (`300ms` disambiguation delay) to responsive single-click execution, while keeping selection state, multi-select marquee dragging, keyboard navigation (`Enter`/`Space`), and context menus intact.
3. **Parabolic Fisheye Dock & Idle Breathing**:
   - Precise magnification math: Hovered icon scales to `1.8x - 2.2x` (nominal `2.0x`), immediate neighbors scale to `~0.7x` relative curve step, next neighbors scale to `~0.85x`.
   - Gentle, rhythmic idle breathing animation at 60fps across dock items when the dock is not hovered (`mouseX === null`).
4. **Top Menu Bar & Central Configuration**:
   - Replace embedded SVG with a dedicated, swappable `AppleLogo` component in `src/components/icons/AppleLogo.tsx`.
   - Establish unified icon dispatching and app configurations in `src/config/icons.ts` and `src/config/apps.ts`.
5. **Comprehensive Test Audit & Test Suite Design**:
   - Audit all 28 test files and 281 tests to identify all tests requiring updates for single-click launches.
   - Design a dedicated new test suite for squircle icon rendering, fisheye magnification physics, and idle breathing.

---

## 2. macOS-Style Squircle SVG Icons Overhaul

### 2.1 Visual Geometry & Lighting Model
Authentic macOS app icons follow a continuous curvature squircle (Lamé curve / Superellipse $|x/a|^n + |y/b|^n = 1$ with $n \approx 4.5$). In standard SVG coordinate space (`0 0 128 128`):
- **Base Geometry**: Rounded rectangle `<rect x="4" y="4" width="120" height="120" rx="28" ry="28" />` ($23.3\%$ radius) with anti-aliasing margin.
- **Lighting & Layer Hierarchy**:
  1. **Drop Shadow Filter**: Soft ambient contact shadow (`drop-shadow(0 4px 10px rgba(0,0,0,0.35))`).
  2. **Base Gradient Layer**: Multi-stop linear/radial gradient defining the app's thematic color profile.
  3. **Inner Border & Bevel Glow**: `1.5px` stroke with linear gradient from `rgba(255,255,255,0.45)` at the top to `rgba(255,255,255,0.08)` at the bottom.
  4. **Specular Top Glass Arc**: Top highlight path (`fill="white" fillOpacity="0.08-0.12"`).
  5. **Glyph / Artwork Layer**: Crisp, multi-layered vector emblem featuring inner shadows, metallic accents, and distinct macOS branding.

### 2.2 Core Icon Component Specifications

#### A. Terminal Icon (`src/components/icons/TerminalIcon.tsx`)
- **Theme**: Dark slate / obsidian CLI window (`#2c2d35` $\to$ `#121318`).
- **Details**: Inner matte black viewport (`#0c0d12`), top window header bar (`#3a3c48` $\to$ `#262832`), macOS window traffic light dots (Red `#ff5f56`, Yellow `#ffbd2e`, Green `#27c93f`), glowing emerald CLI prompt chevron `>` (`#4ade80` with `drop-shadow(0 0 4px #22c55e)`), and cyan terminal cursor block `_` (`#38bdf8`).
- **Code Blueprint**:
```tsx
import React from 'react';

export const TerminalIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon-terminal-svg"
  >
    <defs>
      <linearGradient id="term-bg" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2c2d35" />
        <stop offset="100%" stopColor="#121318" />
      </linearGradient>
      <linearGradient id="term-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="term-header" x1="0" y1="0" x2="128" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3a3c48" />
        <stop offset="100%" stopColor="#262832" />
      </linearGradient>
    </defs>
    {/* Base squircle */}
    <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#term-bg)" stroke="url(#term-border)" strokeWidth="2" />
    {/* Inner CLI display */}
    <rect x="14" y="14" width="100" height="100" rx="18" fill="#0c0d12" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
    {/* Title bar */}
    <path d="M14 32 C14 20 20 14 32 14 L96 14 C108 14 114 20 114 32 L114 36 L14 36 Z" fill="url(#term-header)" />
    {/* Traffic dots */}
    <circle cx="26" cy="25" r="3.5" fill="#ff5f56" />
    <circle cx="37" cy="25" r="3.5" fill="#ffbd2e" />
    <circle cx="48" cy="25" r="3.5" fill="#27c93f" />
    {/* Chevron prompt > */}
    <path d="M30 52 L46 66 L30 80" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    {/* Cursor block _ */}
    <rect x="56" y="74" width="22" height="6" rx="2" fill="#38bdf8" />
    {/* Top glass reflection */}
    <path d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 50 L4 70 Z" fill="white" fillOpacity="0.04" />
  </svg>
);
```

#### B. Projects Icon (`src/components/icons/ProjectsIcon.tsx`)
- **Theme**: Developer Studio / Portfolio Showcase with violet-to-indigo gradient (`#a855f7` $\to$ `#7c3aed` $\to$ `#4f46e5`).
- **Details**: Blueprint architectural coordinate grid overlay, glossy white portfolio briefcase casing, 3D golden buckle emblem (`#fef08a` $\to$ `#d97706`), and code tag `/` glyph.
- **Code Blueprint**:
```tsx
import React from 'react';

export const ProjectsIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon-projects-svg"
  >
    <defs>
      <linearGradient id="proj-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
      <linearGradient id="proj-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="proj-gold" x1="30" y1="30" x2="98" y2="98" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#proj-bg)" stroke="url(#proj-border)" strokeWidth="2" />
    {/* Blueprint grid lines */}
    <line x1="24" y1="36" x2="104" y2="36" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="24" y1="64" x2="104" y2="64" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="24" y1="92" x2="104" y2="92" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="36" y1="24" x2="36" y2="104" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="64" y1="24" x2="64" y2="104" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="92" y1="24" x2="92" y2="104" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
    {/* Briefcase Structure */}
    <rect x="28" y="44" width="72" height="50" rx="10" fill="#ffffff" fillOpacity="0.92" />
    <path d="M48 44 V36 C48 31 52 27 57 27 H71 C76 27 80 31 80 36 V44" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
    {/* Center clasp */}
    <rect x="54" y="58" width="20" height="18" rx="4" fill="url(#proj-gold)" stroke="#b45309" strokeWidth="1" />
    <path d="M60 67 L68 67" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
    {/* Specular gloss */}
    <path d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z" fill="white" fillOpacity="0.08" />
  </svg>
);
```

#### C. About Icon (`src/components/icons/AboutIcon.tsx`)
- **Theme**: Sunset Rose / ID Profile (`#f43f5e` $\to$ `#ec4899` $\to$ `#fb923c`).
- **Details**: Soft ambient radial glow, minimalist frosted glass silhouette (head & shoulder arc), verified badge accent with checkmark.
- **Code Blueprint**:
```tsx
import React from 'react';

export const AboutIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon-about-svg"
  >
    <defs>
      <linearGradient id="about-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
      <linearGradient id="about-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
      </linearGradient>
      <radialGradient id="about-glow" cx="64" cy="50" r="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#about-bg)" stroke="url(#about-border)" strokeWidth="2" />
    <circle cx="64" cy="50" r="45" fill="url(#about-glow)" />
    {/* Avatar profile */}
    <circle cx="64" cy="46" r="18" fill="#ffffff" />
    <path d="M34 92 C34 76 46 68 64 68 C82 68 94 76 94 92 Z" fill="#ffffff" />
    {/* Verified badge */}
    <circle cx="86" cy="38" r="8" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
    <path d="M83 38 L85 40 L89 36" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z" fill="white" fillOpacity="0.08" />
  </svg>
);
```

#### D. Finder Icon (`src/components/icons/FinderIcon.tsx`)
- **Theme**: Classic macOS Finder Split Smile with Sky Blue left (`#7dd3fc` $\to$ `#0284c7`) and Cobalt Blue right (`#38bdf8` $\to$ `#1d4ed8`).
- **Details**: Distinct curved partition line, expressive almond eyes with specular white reflections, friendly smile curve, crisp inner bevel border.
- **Code Blueprint**:
```tsx
import React from 'react';

export const FinderIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon-finder-svg"
  >
    <defs>
      <linearGradient id="finder-left" x1="0" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="finder-right" x1="64" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="finder-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>
      <clipPath id="finder-clip">
        <rect x="4" y="4" width="120" height="120" rx="28" />
      </clipPath>
    </defs>
    <g clipPath="url(#finder-clip)">
      <rect x="4" y="4" width="60" height="120" fill="url(#finder-left)" />
      <rect x="64" y="4" width="60" height="120" fill="url(#finder-right)" />
      {/* Center partition line */}
      <path d="M64 4 Q61 36 67 64 Q73 92 64 124" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <ellipse cx="44" cy="50" rx="4.5" ry="6" fill="#0f172a" />
      <ellipse cx="84" cy="50" rx="4.5" ry="6" fill="#0f172a" />
      <circle cx="43" cy="48" r="1.5" fill="#ffffff" />
      <circle cx="83" cy="48" r="1.5" fill="#ffffff" />
      {/* Smile */}
      <path d="M38 78 Q64 104 90 78" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Gloss */}
      <path d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z" fill="white" fillOpacity="0.12" />
    </g>
    <rect x="4" y="4" width="120" height="120" rx="28" stroke="url(#finder-border)" strokeWidth="2" fill="none" />
  </svg>
);
```

#### E. Settings Icon (`src/components/icons/SettingsIcon.tsx`)
- **Theme**: Machined Titanium / Space Gray (`#64748b` $\to$ `#475569` $\to$ `#1e293b`).
- **Details**: Specular metallic gear assembly (`#f1f5f9` $\to$ `#cbd5e1` $\to$ `#94a3b8`), 8 precision teeth with chamfered edges, dark center axle bearing, and center pin highlight.
- **Code Blueprint**:
```tsx
import React from 'react';

export const SettingsIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon-settings-svg"
  >
    <defs>
      <linearGradient id="settings-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="50%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="settings-gear" x1="30" y1="30" x2="98" y2="98" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="50%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="settings-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#settings-bg)" stroke="url(#settings-border)" strokeWidth="2" />
    {/* Machined Gear Assembly */}
    <g transform="translate(64, 64)">
      <path
        d="M-8,-38 L8,-38 L10,-28 Q18,-25 24,-18 L34,-22 L42,-8 L34,-2 Q35,6 34,14 L42,20 L34,34 L24,30 Q18,37 10,40 L8,50 L-8,50 L-10,40 Q-18,37 -24,30 L-34,34 L-42,20 L-34,14 Q-35,6 -34,-2 L-42,-8 L-34,-22 L-24,-18 Q-18,-25 -10,-28 Z"
        fill="url(#settings-gear)"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <circle cx="0" cy="0" r="14" fill="#334155" stroke="#1e293b" strokeWidth="2" />
      <circle cx="0" cy="0" r="6" fill="#f8fafc" />
    </g>
    <path d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z" fill="white" fillOpacity="0.08" />
  </svg>
);
```

#### F. Mail Icon (`src/components/icons/MailIcon.tsx`)
- **Theme**: Oceanic Cyan to Royal Blue (`#38bdf8` $\to$ `#2563eb` $\to$ `#1d4ed8`).
- **Details**: Crisp white frosted letter envelope (`#ffffff` $\to$ `#e2e8f0`), folded flap crease lines, crimson postage stamp badge with miniature seal.
- **Code Blueprint**:
```tsx
import React from 'react';

export const MailIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon-mail-svg"
  >
    <defs>
      <linearGradient id="mail-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="mail-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="mail-envelope" x1="0" y1="38" x2="0" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#mail-bg)" stroke="url(#mail-border)" strokeWidth="2" />
    {/* Envelope Body */}
    <rect x="20" y="38" width="88" height="54" rx="8" fill="url(#mail-envelope)" stroke="#cbd5e1" strokeWidth="1" />
    {/* Fold lines */}
    <path d="M22 40 L64 70 L106 40" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M22 90 L48 64" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
    <path d="M106 90 L80 64" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
    {/* Red Airmail Stamp */}
    <rect x="80" y="44" width="18" height="14" rx="2" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
    <circle cx="89" cy="51" r="3" fill="#ffffff" />
    <path d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z" fill="white" fillOpacity="0.08" />
  </svg>
);
```

#### G. Central Dispatcher (`src/components/icons/AppIcon.tsx`)
```tsx
import React from 'react';
import { TerminalIcon } from './TerminalIcon';
import { ProjectsIcon } from './ProjectsIcon';
import { AboutIcon } from './AboutIcon';
import { FinderIcon } from './FinderIcon';
import { SettingsIcon } from './SettingsIcon';
import { MailIcon } from './MailIcon';
import * as LucideIcons from 'lucide-react';

export const APP_ICONS: Record<string, React.FC<{ className?: string; size?: number }>> = {
  terminal: TerminalIcon,
  projects: ProjectsIcon,
  about: AboutIcon,
  finder: FinderIcon,
  settings: SettingsIcon,
  mail: MailIcon,
};

export interface AppIconProps {
  appId: string;
  iconName?: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({
  appId,
  iconName,
  className = 'w-full h-full',
  size,
}) => {
  const IconComponent = APP_ICONS[appId.toLowerCase()];
  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }

  const LucideMap = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  const FallbackLucide = (iconName && LucideMap[iconName]) || LucideIcons.AppWindow;
  return <FallbackLucide className={className} />;
};
```

---

## 3. Desktop Interaction: Single-Click Launch & Selection Architecture

### 3.1 UX Requirement & Rationale
In web-based portfolio operating systems, requiring a double-click to open desktop icons introduces friction and causes users to perceive the interface as unresponsive. Updating to **single-click** launch while preserving desktop selection marquee ensures instant responsiveness.

### 3.2 State Flow & Concurrency
- **Single Click (`onClick`)**:
  1. Calls `handleSelect(app.id)` $\to$ sets `selectedIconIds = [app.id]`.
  2. Calls `handleOpen(app.id)` $\to$ invokes `openWindow(app.id)` in Zustand store, focuses the window, and plays opening sound/feedback.
  3. No `300ms` timer is required!
- **Double Click (`onDoubleClick`)**:
  - Maintained as an idempotent fallback calling `handleOpen(app.id)`. Rapid double-clicks simply ensure the window is open and focused without duplicate window spawning.
- **Selection Marquee on Canvas**:
  - In `DesktopCanvas.tsx`, `onPointerDown` contains:
    ```ts
    if (
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('[data-testid="context-menu"]') ||
      target.closest('[data-testid="window-frame"]')
    ) {
      return;
    }
    ```
  - Therefore, clicking directly on a `DesktopIcon` (which is a `<button role="button">`) will **never** trigger marquee creation.
  - When dragging starts on the empty wallpaper canvas, marquee coordinates are calculated, selecting all intersecting `DesktopIcon` elements via `setSelectedIcons(selected)`.
  - Clicking empty canvas triggers `handleDeselect`, clearing `selectedIconIds`.

### 3.3 Proposed Code Changes in `src/components/os/DesktopIcon.tsx`
```tsx
  // Single-Click Launch with Immediate Selection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelect(app.id);
    handleOpen(app.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpen(app.id);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleSelect(app.id);
    handleOpen(app.id);
  };
```
In the JSX:
```tsx
  {/* Replace line 140-151 with squircle AppIcon component */}
  <div
    data-testid={`desktop-icon-image-${app.id}`}
    className="w-12 h-12 flex items-center justify-center transition-transform duration-150 group-hover:scale-105 active:scale-95"
  >
    <AppIcon appId={app.id} iconName={app.icon} className="w-12 h-12" />
  </div>
```

---

## 4. Parabolic Dock Fisheye Magnification & Idle Breathing

### 4.1 Fisheye Magnification Physics Derivation
The macOS Dock uses a parabolic cosine bell / Gaussian magnification curve centered at the cursor's horizontal coordinate $x_{\text{mouse}}$.

#### Mathematical Model
Let:
- $w_{\text{base}} = 44\text{px}$ (base width/height)
- $S_{\text{max}} = 2.0$ (hovered icon scale, range $1.8\text{x} - 2.2\text{x}$)
- $w_{\text{max}} = w_{\text{base}} \times S_{\text{max}} = 88\text{px}$
- $R = 140\text{px}$ (magnification influence radius)
- $d = |x_{\text{mouse}} - x_{\text{item\_center}}|$

The parabolic scaling formula is:
$$S(d) = 1.0 + (S_{\text{max}} - 1.0) \times \left[\cos\left(\frac{\min(d, R)}{R} \cdot \frac{\pi}{2}\right)\right]^p$$
where $p = 2.2$ shapes the parabolic taper.

#### Computed Values at Standard 54px Spacing:
1. **Hovered Center Icon ($d = 0\text{px}$)**:
   $$\cos(0) = 1 \implies S(0) = 1.0 + 1.0 \times 1.0 = \mathbf{2.00\text{x}} \quad (\text{Width: } 88\text{px})$$
2. **Immediate Neighbors ($d = 50 - 54\text{px}$)**:
   $$\cos\left(\frac{50}{140} \cdot 90^\circ\right) = \cos(32.14^\circ) = 0.8467 \implies 0.8467^{2.2} \approx 0.692 \approx \mathbf{0.70}$$
   $$S(50) = 1.0 + 1.0 \times 0.692 = \mathbf{1.69\text{x}} \quad (\text{Relative Step to Peak: } 1.69/2.0 \approx 0.85\text{x}, \text{ Boost Ratio: } 0.70\text{x})$$
3. **Next Neighbors ($d = 95 - 108\text{px}$)**:
   $$\cos\left(\frac{100}{140} \cdot 90^\circ\right) = \cos(64.28^\circ) = 0.4338 \implies 0.4338^{2.2} \approx 0.159 \approx \mathbf{0.16}$$
   $$S(100) = 1.0 + 1.0 \times 0.159 = \mathbf{1.16\text{x}} \quad (\text{Smooth landing toward base})$$
4. **Distant Icons ($d \ge 140\text{px}$)**:
   $$S(d) = \mathbf{1.00\text{x}} \quad (\text{Width: } 44\text{px})$$

#### Implementation in `src/lib/physics/springUtils.ts`:
```ts
export interface DockFisheyeConfig {
  baseWidth: number;
  maxScale: number;
  radius: number;
  exponent: number;
}

export function calculateFisheyeWidth(
  distance: number,
  config: Partial<DockFisheyeConfig> = {}
): number {
  const {
    baseWidth = 44,
    maxScale = 2.0,
    radius = 140,
    exponent = 2.2,
  } = config;

  const absDist = Math.abs(distance);
  if (absDist >= radius) {
    return baseWidth;
  }

  const factor = Math.cos((absDist / radius) * (Math.PI / 2));
  const curve = Math.pow(factor, exponent);
  const scale = 1.0 + (maxScale - 1.0) * curve;
  return baseWidth * scale;
}
```

### 4.2 Idle Breathing Animation
When the user's cursor is outside the dock (`mouseX === null`), all dock icons participate in an organic, gentle idle breathing animation:
- **Motion**: Subtle vertical floating oscillation ($\Delta y = -2\text{px}$ to $0\text{px}$) and micro scale pulse ($1.00\text{x} \to 1.02\text{x}$).
- **Frequency**: 4.0s duration, sinusoidal ease-in-out curve.
- **Phase Offset**: Each icon receives a slight stagger offset `animationDelay: ${index * 0.15}s` creating a calm harmonic wave.
- **Immediate Pause on Hover**: When `mouseX !== null`, breathing animation is disabled (`animation: none`), allowing instant, jitter-free cursor tracking at 60fps.

#### Tailwind / CSS Keyframe Specification:
```css
@keyframes dock-breathe {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-2.5px) scale(1.025);
  }
}

.animate-dock-breathe {
  animation: dock-breathe 4s ease-in-out infinite;
}
```

#### Implementation in `src/components/dock/DockItem.tsx`:
```tsx
export function DockItem({ app, magnifiedWidth, isDockHovered, index = 0 }: DockItemProps) {
  // ...
  const currentScale = isPressed ? 0.88 : (magnifiedWidth / 44);
  const isIdle = !isDockHovered && !isHovered && !isBouncing && !isPressed;

  return (
    <div
      ref={itemRef}
      data-testid={`dock-item-${app.id}`}
      data-cursor="magnetic-dock"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      className={`relative flex items-center justify-center cursor-pointer select-none origin-bottom transition-transform duration-100 ${
        isBouncing ? 'animate-bounce' : isIdle ? 'animate-dock-breathe' : ''
      }`}
      style={{
        width: `${magnifiedWidth}px`,
        height: `${magnifiedWidth}px`,
        transform: `scale(${currentScale})`,
        transformOrigin: 'bottom center',
        animationDelay: isIdle ? `${index * 0.15}s` : undefined,
      }}
    >
      <div
        data-testid={`dock-icon-${app.id}`}
        className="w-full h-full flex items-center justify-center"
      >
        <AppIcon appId={app.id} iconName={app.icon} className="w-full h-full" />
      </div>

      {isHovered && <DockTooltip title={app.title} />}
      <ActiveDotIndicator
        windowId={app.id}
        isOpen={windowState.isOpen}
        isMinimized={windowState.isMinimized}
      />
    </div>
  );
}
```

---

## 5. Core System Updates: Apple Logo & Central Configuration

### 5.1 Swappable `AppleLogo` Component
Create `src/components/icons/AppleLogo.tsx`:
```tsx
import React from 'react';

export interface AppleLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const AppleLogo: React.FC<AppleLogoProps> = ({
  className = 'w-3.5 h-3.5',
  size,
  ...props
}) => (
  <svg
    viewBox="0 0 170 170"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
    data-testid="apple-logo-svg"
    {...props}
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.83-11.97-14.34-6.42-9.78-11.45-20.87-15.08-33.28-3.63-12.4-5.45-23.9-5.45-34.52 0-14.34 3.59-26.3 10.77-35.88 7.18-9.58 16.2-14.48 27.06-14.7 4.79 0 10.33 1.3 16.63 3.9 6.3 2.61 10.38 3.96 12.24 4.05 1.52-.1 5.82-1.5 12.89-4.22 7.07-2.72 12.8-3.86 17.18-3.41 12.61 1.09 22.45 6.08 29.53 14.99-11.09 6.74-16.52 16.09-16.31 28.04.22 9.57 3.92 17.5 11.09 23.8 7.18 6.3 15.76 9.89 25.76 10.76-2.17 6.74-4.89 13.59-8.15 20.54zM119.22 31.02c0-7.18 2.61-13.91 7.83-20.21 5.22-6.3 11.85-10.22 19.9-11.74.22 1.3.33 2.5.33 3.59 0 7.17-2.72 14.02-8.16 20.54-5.43 6.52-12.17 10.43-20.21 11.74-.22-1.09-.33-2.4-.33-3.92z" />
  </svg>
);
```
In `src/components/os/TopMenuBar.tsx`:
Export / import `AppleLogo` from `@/components/icons/AppleLogo` while preserving the existing test IDs (`apple-menu-button`, `menu-bar-apple-logo`).

### 5.2 Central App & Icon Configuration
Structure `src/config/apps.ts` or `src/lib/constants/apps.ts` to export:
```ts
export interface AppDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'system' | 'portfolio' | 'utility';
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  showInDock: boolean;
  showOnDesktop: boolean;
  shortcut: string;
}
```

---

## 6. Comprehensive Test Audit & Migration Matrix

### 6.1 Audit of Existing Test Files
A forensic audit was performed across all 28 test suites in `tests/`:

| Test File | Current Assertion | Required Migration Action | Risk Level |
|---|---|---|---|
| `tests/components/DesktopIcon.test.tsx` | Line 62: Asserting `onSelect` on click 1 and `onOpen` on click 2 within 300ms. | Update test to assert immediate `onSelect` + `onOpen` on single click. Retain keyboard (`Enter`, `Space`) and touch tests. | **High** |
| `tests/components/DesktopGrid.test.tsx` | Line 26: `should open window when double clicked from grid` (`fireEvent.doubleClick`) | Update test to `should open window when single clicked from grid` (`fireEvent.click`). | **Medium** |
| `tests/tier1-features/desktop.test.tsx` | Line 87: `launches app window on double click (#5)`. Line 97: `selects icon on single click without launching (#6)` | Update Line 87 to single click (`fireEvent.click`). Update Line 97 to assert immediate launch + selection. | **High** |
| `tests/stress/ui-interactions-stress.test.tsx` | Suite 2 (Lines 297-454): 8 tests stressing the 300ms double-click disambiguation timer. | Update Suite 2 to test instant single-click launch, rapid click idempotency, touch/keyboard, and bounding box safety. | **High** |
| `tests/tier4-scenarios/user-workflows.test.tsx` | Line 67: `fireEvent.doubleClick(termIcon)` | Change `fireEvent.doubleClick` to `fireEvent.click`. | **Low** |
| `tests/tier1-features/dock.test.tsx` | Asserts dock scaling, bounce, dots, and divider. | Verify compatibility with new `calculateFisheyeWidth` and add tests for idle breathing and SVG icon render. | **Medium** |
| `tests/components/TopMenuBar.test.tsx` | Asserts Apple menu button and dropdown. | None (already tests button/menu; verify `AppleLogo` component renders correctly). | **Low** |
| `tests/visual-conformance/chrome.test.tsx` | Asserts 28px height, 40px blur, clock, and 16px tray icons. | None (passes untouched). | **Low** |

### 6.2 New Test Suite Design

#### 1. `tests/components/SquircleIcons.test.tsx`
- Verifies all 6 core icon components (`TerminalIcon`, `ProjectsIcon`, `AboutIcon`, `FinderIcon`, `SettingsIcon`, `MailIcon`) and `AppleLogo`.
- Asserts presence of SVG root, viewBox `0 0 128 128` (or `0 0 170 170`), linear gradients, drop shadow classes, and data-testid attributes.
- Tests `AppIcon` dispatcher fallback logic when an unmapped `appId` or custom Lucide name is provided.

#### 2. `tests/dock/fisheye-magnification.test.ts`
- Unit tests for `calculateFisheyeWidth` in `src/lib/physics/springUtils.ts`:
  - $d = 0\text{px} \implies 88\text{px}$ ($2.0\text{x}$ base $44\text{px}$).
  - $d = 50\text{px} \implies \sim 74.4\text{px}$ ($1.69\text{x}$ base).
  - $d = 100\text{px} \implies \sim 51\text{px}$ ($1.16\text{x}$ base).
  - $d \ge 140\text{px} \implies 44\text{px}$ ($1.0\text{x}$ base).
- Tests idle breathing state toggle when `mouseX` changes between `null` and integer coordinates.

---

## 7. Implementation Checklist for Worker

- [ ] Create `src/components/icons/` directory.
- [ ] Implement `TerminalIcon.tsx`, `ProjectsIcon.tsx`, `AboutIcon.tsx`, `FinderIcon.tsx`, `SettingsIcon.tsx`, `MailIcon.tsx`.
- [ ] Implement `AppleLogo.tsx` and `AppIcon.tsx` (central dispatcher).
- [ ] Implement `src/components/icons/index.ts` re-exports.
- [ ] Update `src/lib/physics/springUtils.ts` with `calculateFisheyeWidth` (or enhanced `calculateCosineBellWidth`).
- [ ] Update `src/components/dock/Dock.tsx` and `src/components/dock/DockItem.tsx` to use `AppIcon`, fisheye scaling, and idle breathing class.
- [ ] Update `src/components/os/DesktopIcon.tsx` to open on single click and use `AppIcon`.
- [ ] Update `src/components/os/DesktopGrid.tsx` and `TopMenuBar.tsx` to import new icons and support single click.
- [ ] Update affected test files (`DesktopIcon.test.tsx`, `DesktopGrid.test.tsx`, `desktop.test.tsx`, `ui-interactions-stress.test.tsx`, `user-workflows.test.tsx`).
- [ ] Add new test suite `tests/components/SquircleIcons.test.tsx`.
- [ ] Execute `npx vitest run` to verify 100% test pass.
