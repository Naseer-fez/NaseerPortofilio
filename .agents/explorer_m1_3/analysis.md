# Milestone 1: Visual, Layout & Component Analysis & Architecture Spec

## Executive Summary
This document defines the exact architecture, implementation specifications, and design contracts for the core visual and layout components of the macOS-style Portfolio OS:
1. `lib/constants/wallpapers.ts` & `components/os/Wallpaper.tsx` (Layer 0, `z-0`)
2. `components/os/DesktopCanvas.tsx` (Layer 1, `z-10`)
3. `components/os/DesktopGrid.tsx` & `components/os/DesktopIcon.tsx` (Layer 1, `z-10`)
4. `components/os/TopMenuBar.tsx` (Layer 3, `z-50`)
5. Integration in `src/app/layout.tsx` and `src/app/page.tsx`

---

## 1. Z-Index Layer Stack & Coordinate System

### 1.1 Layer Hierarchy
```
┌────────────────────────────────────────────────────────────┐
│ Layer 7 (z-[9999]): KineticCursor (PrecisionDot + AuraRing)│
├────────────────────────────────────────────────────────────┤
│ Layer 6 (z-[9995]): SpotlightSearch, ContextMenu, CC       │
├────────────────────────────────────────────────────────────┤
│ Layer 5 (z-[9992]): AudioDeckExpandedCard                  │
├────────────────────────────────────────────────────────────┤
│ Layer 4 (z-[9990]): Luca Parabolic Dock + MusicPill        │
├────────────────────────────────────────────────────────────┤
│ Layer 3 (z-50):     TopMenuBar (28px fixed bar)            │
├────────────────────────────────────────────────────────────┤
│ Layer 2 (z-20..49): WindowFrame Instances (Inactive/Active)│
├────────────────────────────────────────────────────────────┤
│ Layer 1 (z-10):     DesktopCanvas + DesktopGrid + Marquee  │
├────────────────────────────────────────────────────────────┤
│ Layer 0 (z-0):      Wallpaper + KineticHeroStage           │
└────────────────────────────────────────────────────────────┘
```

### 1.2 Viewport Bounds & Metrics
- Root Viewport: `100vw × 100vh` (or `100dvh`), `overflow: hidden`, `user-select: none`.
- Top Menu Bar: Height `28px` (`h-7`), fixed at `top: 0, left: 0, right: 0`.
- Desktop Surface: Positioned `top: 28px`, height `calc(100vh - 28px)` (`h-[calc(100vh-28px)]` or `h-[calc(100dvh-28px)]`).
- Windows Boundary Clamping: Header `y ≥ 28px` to prevent menu bar occlusion; minimum visible overhang 100px.

---

## 2. `lib/constants/wallpapers.ts`

### 2.1 Interface & Types
```typescript
export interface WallpaperItem {
  id: string;
  name: string;
  type: 'image' | 'gradient' | 'svg';
  src?: string;
  thumbnail?: string;
  fallbackGradient: string;
  darkOverlay: string; // Tailwind class
  lightOverlay: string; // Tailwind class
  themePreference?: 'dark' | 'light' | 'both';
  accentColor?: string;
}
```

### 2.2 Presets Catalog
```typescript
export const WALLPAPERS: WallpaperItem[] = [
  {
    id: 'sonoma-dark',
    name: 'macOS Sonoma (Dark)',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #0f172a 45%, #020617 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'dark',
    accentColor: '#3b82f6',
  },
  {
    id: 'sonoma-light',
    name: 'macOS Sonoma (Light)',
    type: 'gradient',
    fallbackGradient: 'linear-gradient(135deg, #a5b4fc 0%, #fbcfe8 50%, #fde047 100%)',
    darkOverlay: 'bg-black/20',
    lightOverlay: 'bg-white/10',
    themePreference: 'light',
    accentColor: '#6366f1',
  },
  {
    id: 'sequoia-dark',
    name: 'macOS Sequoia',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, #451a03 0%, #1c1917 50%, #09090b 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'dark',
    accentColor: '#f97316',
  },
  {
    id: 'ventura',
    name: 'macOS Ventura',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(circle at 70% 30%, #ea580c 0%, #2563eb 55%, #0f172a 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'both',
    accentColor: '#f97316',
  },
  {
    id: 'monterey',
    name: 'macOS Monterey',
    type: 'gradient',
    fallbackGradient: 'linear-gradient(135deg, #581c87 0%, #db2777 50%, #1e1b4b 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'both',
    accentColor: '#ec4899',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Horizon',
    type: 'gradient',
    fallbackGradient: 'linear-gradient(135deg, #090d16 0%, #701a75 50%, #0284c7 100%)',
    darkOverlay: 'bg-black/20',
    lightOverlay: 'bg-black/10',
    themePreference: 'dark',
    accentColor: '#06b6d4',
  },
  {
    id: 'minimal-noir',
    name: 'Minimalist Noir',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 60%, #000000 100%)',
    darkOverlay: 'bg-black/10',
    lightOverlay: 'bg-black/5',
    themePreference: 'dark',
    accentColor: '#a1a1aa',
  },
];

export const DEFAULT_WALLPAPER_ID = 'sonoma-dark';

export function getWallpaperById(id?: string): WallpaperItem {
  if (!id) return WALLPAPERS[0];
  const found = WALLPAPERS.find((w) => w.id === id);
  return found || WALLPAPERS[0];
}
```

---

## 3. `components/os/Wallpaper.tsx`

### 3.1 Requirements
- Layer 0 (`z-0`), fixed full-bleed container (`fixed inset-0 pointer-events-none overflow-hidden`).
- Smooth 700ms crossfade on wallpaper swap (`transition-opacity duration-700 ease-out`).
- Dual-theme tint overlay:
  - Dark mode: `bg-black/25 backdrop-brightness-95`
  - Light mode: `bg-black/10 backdrop-brightness-95`
- High resilience: renders fallback CSS mesh gradient immediately, overlaying high-res WebP/AVIF images when provided.

### 3.2 Implementation Architecture
```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getWallpaperById, WallpaperItem } from '@/lib/constants/wallpapers';
import { useOSStore } from '@/hooks/useOSStore';

interface WallpaperProps {
  wallpaperId?: string;
  className?: string;
}

export const Wallpaper: React.FC<WallpaperProps> = ({ wallpaperId: propWallpaperId, className }) => {
  const storeWallpaperId = useOSStore((state) => state.wallpaperId);
  const theme = useOSStore((state) => state.theme);
  
  const activeWallpaperId = propWallpaperId || storeWallpaperId || 'sonoma-dark';
  const currentWallpaper = getWallpaperById(activeWallpaperId);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none ${className || ''}`}
      aria-hidden="true"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={currentWallpaper.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
          style={{
            background: currentWallpaper.fallbackGradient,
          }}
        >
          {currentWallpaper.src && (
            <img
              src={currentWallpaper.src}
              alt={currentWallpaper.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Theme Tint Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 backdrop-brightness-95 ${
          theme === 'light' ? currentWallpaper.lightOverlay : currentWallpaper.darkOverlay
        }`}
      />
    </div>
  );
};
```

---

## 4. `components/os/DesktopCanvas.tsx`

### 4.1 Requirements
- Layer 1 (`z-10`), positioned `top-7` (28px from top), filling `h-[calc(100vh-28px)]` or `h-[calc(100dvh-28px)]`.
- Single click on empty desktop:
  - Deselects any selected desktop icons (`setSelectedIconId(null)`).
  - Dismisses active context menus (`setContextMenu(null)`).
- Right-click (`onContextMenu`):
  - Prevents native browser context menu (`e.preventDefault()`).
  - Dispatches desktop context menu to store with clamped coordinates.
- Double-click on empty desktop:
  - Toggles OS mode between `'workspace'` and `'ambient-hero'` via `useOSStore.getState().setDesktopMode()`.
- Rubber-band selection marquee preparation:
  - Pointer down on canvas starts drag box if not clicking an interactive icon or window.

### 4.2 Implementation Architecture
```tsx
'use client';

import React, { useCallback, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';

interface DesktopCanvasProps {
  children?: React.ReactNode;
  className?: string;
}

export const DesktopCanvas: React.FC<DesktopCanvasProps> = ({ children, className }) => {
  const desktopMode = useOSStore((state) => state.desktopMode);
  const setDesktopMode = useOSStore((state) => state.setDesktopMode);
  const setContextMenu = useOSStore((state) => state.setContextMenu);
  const openWindow = useOSStore((state) => state.openWindow);
  const toggleTheme = useOSStore((state) => state.toggleTheme);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only clear if clicking canvas backdrop, not child icons
      if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvasSurface) {
        useOSStore.setState({ activeWindowId: null });
        setContextMenu(null);
        // Custom event or callback to deselect desktop icons
        window.dispatchEvent(new CustomEvent('os:deselect-icons'));
      }
    },
    [setContextMenu]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      // Check if right click occurred on canvas surface
      const target = e.target as HTMLElement;
      if (target === e.currentTarget || target.dataset.canvasSurface) {
        const x = Math.min(e.clientX, window.innerWidth - 220);
        const y = Math.min(e.clientY, window.innerHeight - 260);

        setContextMenu({
          x,
          y,
          items: [
            {
              id: 'new-folder',
              label: 'New Folder',
              disabled: true,
            },
            { id: 'sep-1', label: '', separator: true },
            {
              id: 'toggle-mode',
              label: desktopMode === 'workspace' ? 'Switch to Ambient Mode' : 'Switch to Workspace Mode',
              shortcut: '⌘⌥M',
              action: () => setDesktopMode(desktopMode === 'workspace' ? 'ambient-hero' : 'workspace'),
            },
            {
              id: 'toggle-theme',
              label: 'Toggle Dark/Light Mode',
              shortcut: '⇧⌘D',
              action: () => toggleTheme(),
            },
            {
              id: 'change-wallpaper',
              label: 'Change Wallpaper...',
              action: () => openWindow('settings'),
            },
            { id: 'sep-2', label: '', separator: true },
            {
              id: 'system-info',
              label: 'About This Portfolio',
              action: () => openWindow('about'),
            },
          ],
        });
      }
    },
    [desktopMode, setDesktopMode, setContextMenu, openWindow, toggleTheme]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvasSurface) {
        const nextMode = desktopMode === 'workspace' ? 'ambient-hero' : 'workspace';
        setDesktopMode(nextMode);
      }
    },
    [desktopMode, setDesktopMode]
  );

  return (
    <div
      data-canvas-surface="true"
      onClick={handleCanvasClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      className={`fixed top-7 left-0 right-0 bottom-0 h-[calc(100vh-28px)] z-10 select-none overflow-hidden ${
        className || ''
      }`}
    >
      {children}
    </div>
  );
};
```

---

## 5. `components/os/DesktopGrid.tsx` & `components/os/DesktopIcon.tsx`

### 5.1 Layout & Grid Metrics
- Container: `absolute inset-0 p-4 pointer-events-none`
- Grid: `grid grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 h-full w-full overflow-hidden`
- Breakpoint Behavior: Visible on `≥768px` (`hidden md:grid`), hidden on mobile where navigation occurs via Dock/TabBar.
- Icons: Rendered from app registry (`lib/constants/apps.ts`).

### 5.2 DesktopIcon Visual & Behavioral Specification
- Wrapper Button: `w-[92px] h-[104px] p-2 rounded-xl flex flex-col items-center justify-start pointer-events-auto cursor-default transition-all duration-150 outline-none select-none`
- Hover State: `hover:bg-white/10`
- Selected State: `bg-white/15 border border-white/20 shadow-sm backdrop-blur-[2px]`
- Active Press: `active:bg-white/25`
- Icon Frame: `w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-105 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] active:scale-95`
- Label:
  - Font: `text-[11px] font-medium text-white text-center leading-tight tracking-normal`
  - Clamping: `max-w-[84px] line-clamp-2`
  - Shadow: `drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]`
  - Selected Highlight: subtle rounded selection container or high-contrast shadow.
- Disambiguation Timer:
  - Single click sets 300ms timeout for selection state.
  - Second click or native double click within 300ms cancels timeout and immediately launches the app (`openWindow(appId)`).
  - Touch interaction: `onTouchEnd` directly executes `openWindow(appId)` without double-click latency.
- Icon Right-Click (`onContextMenu`):
  - Shows icon context menu: `Open`, `Get Info`, etc.

### 5.3 Implementation Code
```tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { APPS, AppDefinition } from '@/lib/constants/apps';
import * as LucideIcons from 'lucide-react';

interface DesktopIconProps {
  app: AppDefinition;
  isSelected: boolean;
  onSelect: (appId: string) => void;
  onOpen: (appId: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ app, isSelected, onSelect, onOpen }) => {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setContextMenu = useOSStore((state) => state.setContextMenu);

  // Dynamic Lucide icon resolution
  const IconComponent = (LucideIcons as Record<string, any>)[app.icon] || LucideIcons.AppWindow;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimeoutRef.current) {
      // Second click within 300ms -> Double Click Launch
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      onOpen(app.id);
    } else {
      // First click -> select and start 300ms timer
      onSelect(app.id);
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    onOpen(app.id);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    onOpen(app.id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(app.id);

    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 150);

    setContextMenu({
      x,
      y,
      items: [
        {
          id: 'open-app',
          label: `Open ${app.title}`,
          action: () => onOpen(app.id),
        },
        { id: 'sep-1', label: '', separator: true },
        {
          id: 'get-info',
          label: 'Get Info',
          action: () => onOpen(app.id),
        },
      ],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(app.id);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col items-center justify-start w-[92px] h-[104px] p-2 rounded-xl transition-all duration-150 outline-none select-none pointer-events-auto cursor-default ${
        isSelected
          ? 'bg-white/15 border border-white/20 shadow-sm backdrop-blur-[2px]'
          : 'hover:bg-white/10 border border-transparent'
      }`}
      aria-label={`${app.title} application shortcut`}
    >
      {/* 48x48 Icon Frame */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-105 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] active:scale-95 shadow-inner"
        style={{
          background: app.gradient || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        }}
      >
        <IconComponent className="w-6 h-6 text-white drop-shadow" />
      </div>

      {/* 11px Two-Line Label */}
      <span className="mt-1.5 text-[11px] font-medium text-white text-center leading-tight max-w-[84px] line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] px-1 rounded">
        {app.title}
      </span>
    </button>
  );
};

export const DesktopGrid: React.FC = () => {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const openWindow = useOSStore((state) => state.openWindow);

  useEffect(() => {
    const handleDeselect = () => setSelectedIconId(null);
    window.addEventListener('os:deselect-icons', handleDeselect);
    return () => window.removeEventListener('os:deselect-icons', handleDeselect);
  }, []);

  return (
    <div className="hidden md:grid grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 p-4 h-full w-full pointer-events-none overflow-hidden">
      {APPS.map((app) => (
        <DesktopIcon
          key={app.id}
          app={app}
          isSelected={selectedIconId === app.id}
          onSelect={setSelectedIconId}
          onOpen={(id) => {
            setSelectedIconId(null);
            openWindow(id);
          }}
        />
      ))}
    </div>
  );
};
```

---

## 6. `components/os/TopMenuBar.tsx`

### 6.1 Requirements
- Height: `28px` (`h-7`). Fixed at `top: 0, left: 0, right: 0`, `z-50`.
- Glassmorphism & Style:
  - `backdrop-blur-2xl` (`blur(40px)`)
  - Light mode: `bg-white/70 border-b border-black/5 text-neutral-900`
  - Dark mode: `bg-black/40 border-b border-white/10 text-neutral-100`
  - Shadow: `shadow-sm`
  - Typography: `text-[12px] font-medium tracking-tight select-none`
- Sections:
  1. Left Cluster:
     - Apple Logo SVG (14×14) with system dropdown menu.
     - Dynamic Active App Name: Reads `activeWindowId` from `useOSStore`. If null, defaults to `'Finder'`.
     - Standard macOS menus: `File`, `Edit`, `View`, `Window`, `Help` (hidden on `<640px`).
  2. Right Cluster (Status Tray):
     - Gap: `gap-2.5` (10px).
     - Icons: WiFi, Battery (with percentage), Spotlight search icon (`Cmd+K`), Control Center toggle (`toggleControlCenter`).
     - LiveClock: Format `Sat Aug 15 12:51 PM`, ticking every second.
     - SSR Hydration-Safe rendering.

### 6.2 Implementation Architecture
```tsx
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { APPS } from '@/lib/constants/apps';
import {
  Wifi,
  BatteryCharging,
  Search,
  SlidersHorizontal,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';

// LiveClock Subcomponent with SSR Hydration Safety
export const LiveClock: React.FC = () => {
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      // Remove comma after day if needed: e.g. "Sat, Aug 15, 12:51 PM" -> "Sat Aug 15 12:51 PM"
      setFormattedTime(formatted.replace(/,/g, ''));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <span className="text-[12px] font-medium tracking-tight px-1.5">Sat Aug 15 12:51 PM</span>;
  }

  return (
    <button
      type="button"
      className="text-[12px] font-medium tracking-tight px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default"
      aria-label="Current date and time"
    >
      {formattedTime}
    </button>
  );
};

// Apple Logo SVG (14x14)
export const AppleLogo: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 170 170"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.83-11.97-14.34-6.42-9.78-11.45-20.87-15.08-33.28-3.63-12.4-5.45-23.9-5.45-34.52 0-14.34 3.59-26.3 10.77-35.88 7.18-9.58 16.2-14.48 27.06-14.7 4.79 0 10.33 1.3 16.63 3.9 6.3 2.61 10.38 3.96 12.24 4.05 1.52-.1 5.82-1.5 12.89-4.22 7.07-2.72 12.8-3.86 17.18-3.41 12.61 1.09 22.45 6.08 29.53 14.99-11.09 6.74-16.52 16.09-16.31 28.04.22 9.57 3.92 17.5 11.09 23.8 7.18 6.3 15.76 9.89 25.76 10.76-2.17 6.74-4.89 13.59-8.15 20.54zM119.22 31.02c0-7.18 2.61-13.91 7.83-20.21 5.22-6.3 11.85-10.22 19.9-11.74.22 1.3.33 2.5.33 3.59 0 7.17-2.72 14.02-8.16 20.54-5.43 6.52-12.17 10.43-20.21 11.74-.22-1.09-.33-2.4-.33-3.92z" />
  </svg>
);

export const TopMenuBar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const activeWindowId = useOSStore((state) => state.activeWindowId);
  const openWindow = useOSStore((state) => state.openWindow);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const setSpotlightOpen = useOSStore((state) => state.setSpotlightOpen);
  const desktopMode = useOSStore((state) => state.desktopMode);
  const setDesktopMode = useOSStore((state) => state.setDesktopMode);
  const theme = useOSStore((state) => state.theme);
  const toggleTheme = useOSStore((state) => state.toggleTheme);

  const menuRef = useRef<HTMLDivElement>(null);

  // Active App Name
  const activeApp = activeWindowId ? APPS.find((a) => a.id === activeWindowId) : null;
  const activeAppName = activeApp ? activeApp.title : 'Finder';

  const toggleMenuDropdown = (menuId: string) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      ref={menuRef}
      className="fixed top-0 left-0 right-0 h-7 z-50 px-3 flex items-center justify-between backdrop-blur-2xl bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10 shadow-sm text-neutral-900 dark:text-neutral-100 text-[12px] font-medium tracking-tight select-none transition-colors duration-200"
    >
      {/* Left Menu Section */}
      <div className="flex items-center gap-1">
        {/* Apple Logo Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenuDropdown('apple')}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
            aria-label="Apple Menu"
          >
            <AppleLogo />
          </button>

          {openMenu === 'apple' && (
            <div className="absolute top-7 left-0 w-56 rounded-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-2xl py-1 text-[13px] z-50 text-neutral-800 dark:text-neutral-200">
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  openWindow('about');
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>About This Portfolio</span>
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  openWindow('settings');
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>System Settings...</span>
              </button>
              <a
                href="https://github.com/irfannaikwade"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpenMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>App Store / GitHub...</span>
              </a>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  setDesktopMode(desktopMode === 'workspace' ? 'ambient-hero' : 'workspace');
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>Sleep (Ambient Mode)</span>
                <span className="text-xs opacity-60">⌘⌥M</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  window.location.reload();
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>Restart OS...</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic App Title */}
        <span className="text-[12.5px] font-semibold tracking-tight text-neutral-900 dark:text-white px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 cursor-default transition-colors">
          {activeAppName}
        </span>

        {/* Standard App Menus (hidden on <640px) */}
        <div className="hidden sm:flex items-center gap-0.5">
          {['File', 'Edit', 'View', 'Window', 'Help'].map((item) => (
            <div key={item} className="relative">
              <button
                type="button"
                onClick={() => toggleMenuDropdown(item)}
                className="px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default"
              >
                {item}
              </button>

              {openMenu === item && (
                <div className="absolute top-7 left-0 w-48 rounded-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-2xl py-1 text-[13px] z-50 text-neutral-800 dark:text-neutral-200">
                  {item === 'File' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          if (activeWindowId) closeWindow(activeWindowId);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
                      >
                        <span>Close Window</span>
                        <span className="text-xs opacity-60">⌘W</span>
                      </button>
                    </>
                  )}
                  {item === 'View' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          setDesktopMode(desktopMode === 'workspace' ? 'ambient-hero' : 'workspace');
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
                      >
                        <span>Toggle Ambient Mode</span>
                        <span className="text-xs opacity-60">⌘⌥M</span>
                      </button>
                    </>
                  )}
                  {item === 'Help' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          openWindow('about');
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white"
                      >
                        Portfolio Help
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Status Tray */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Battery Indicator */}
        <div
          className="flex items-center gap-1 px-1 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default text-[11px]"
          title="Battery: 100% (Plugged in)"
        >
          <span className="hidden sm:inline font-mono">100%</span>
          <BatteryCharging className="w-3.5 h-3.5" />
        </div>

        {/* WiFi Indicator */}
        <button
          type="button"
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default"
          title="Wi-Fi: Connected to Gigabit Fiber"
          aria-label="Wi-Fi Status"
        >
          <Wifi className="w-3.5 h-3.5" />
        </button>

        {/* Spotlight Trigger */}
        <button
          type="button"
          onClick={() => setSpotlightOpen(true)}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
          title="Spotlight Search (⌘K)"
          aria-label="Open Spotlight Search"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Control Center Toggle */}
        <button
          type="button"
          onClick={() => toggleTheme()}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode (⇧⌘D)`}
          aria-label="Toggle Control Center / Theme"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* LiveClock */}
        <LiveClock />
      </div>
    </header>
  );
};
```

---

## 7. Integration in `src/app/layout.tsx` & `src/app/page.tsx`

### 7.1 `src/app/layout.tsx` Architecture
- Typography: Inter Variable + JetBrains Mono.
- Root container styling: `h-screen w-screen overflow-hidden select-none bg-black font-sans antialiased text-neutral-100`.
- SSR-Safe Theme Hydration Script: Injected in `<head>` to read `localStorage.getItem('os-theme')` or `os-storage` before initial paint, preventing dark/light flash.
- Global Keyboard Listener component mounted in root.

```tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GlobalKeyboardListener } from '@/components/os/GlobalKeyboardListener';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Irfan Naikwade — Portfolio OS',
  description: 'A macOS-inspired portfolio OS showcase featuring kinetic typography, physics-driven dock, and glassmorphic window manager.',
  icons: {
    icon: '/favicon.ico',
  },
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('os-storage');
    var isDark = true;
    if (stored) {
      var parsed = JSON.parse(stored);
      if (parsed.state && parsed.state.theme) {
        isDark = parsed.state.theme === 'dark';
      }
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="h-screen w-screen overflow-hidden select-none bg-neutral-950 font-sans antialiased text-neutral-100">
        <GlobalKeyboardListener />
        {children}
      </body>
    </html>
  );
}
```

### 7.2 `src/app/page.tsx` Architecture
- Client Component assembling all OS layers in exact specified z-index order.

```tsx
'use client';

import React from 'react';
import { Wallpaper } from '@/components/os/Wallpaper';
import { TopMenuBar } from '@/components/os/TopMenuBar';
import { DesktopCanvas } from '@/components/os/DesktopCanvas';
import { DesktopGrid } from '@/components/os/DesktopGrid';
import { ContextMenu } from '@/components/os/ContextMenu';

export default function DesktopPage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden select-none">
      {/* Layer 0 (z-0): Wallpaper & Kinetic Typography Stage */}
      <Wallpaper />
      <div id="kinetic-hero-stage" className="absolute inset-0 z-0 pointer-events-none" />

      {/* Layer 1 (z-10): Desktop Canvas & Icon Grid */}
      <DesktopCanvas>
        <DesktopGrid />
      </DesktopCanvas>

      {/* Layer 2 (z-20..49): Window Manager (Sprint 2) */}
      <div id="window-layer" className="absolute inset-0 pointer-events-none z-20" />

      {/* Layer 3 (z-50): Top Menu Bar */}
      <TopMenuBar />

      {/* Layer 4 (z-[9990]): Dock Layer (Sprint 3) */}
      <div id="dock-layer" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] pointer-events-auto" />

      {/* Layer 5 (z-[9992]): Audio Deck Expanded (Sprint 3) */}
      <div id="audio-deck-layer" className="z-[9992] pointer-events-auto" />

      {/* Layer 6 (z-[9995]): Overlays / ContextMenu / Spotlight (Sprint 1 & 2) */}
      <ContextMenu />

      {/* Layer 7 (z-[9999]): Kinetic Cursor (Sprint 4) */}
      <div id="cursor-layer" className="z-[9999] pointer-events-none" />
    </main>
  );
}
```

---

## 8. Verification & Test Plan

### 8.1 Unit & Component Tests
- `tests/components/Wallpaper.test.tsx`:
  - Verify renders fallback gradient for default `sonoma-dark`.
  - Verify switches fallback gradients when `wallpaperId` prop or store state updates.
  - Verify overlay class is `bg-black/25` in dark mode and `bg-black/10` in light mode.
- `tests/components/DesktopCanvas.test.tsx`:
  - Verify single click on empty canvas calls `setContextMenu(null)` and dispatches deselect.
  - Verify right-click triggers `setContextMenu` with coordinates and valid items list.
  - Verify double-click triggers mode toggle between `'workspace'` and `'ambient-hero'`.
- `tests/components/DesktopIcon.test.tsx`:
  - Verify renders 48×48 icon container and 11px label.
  - Verify single click selects the icon.
  - Verify double click calls `openWindow(app.id)`.
  - Verify touch end calls `openWindow(app.id)`.
- `tests/components/TopMenuBar.test.tsx`:
  - Verify 28px height (`h-7`) and fixed top position.
  - Verify LiveClock renders formatted time and updates.
  - Verify dynamic app name displays active window title or 'Finder'.
  - Verify Apple menu opens on click and contains expected menu items.
