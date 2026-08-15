# Comprehensive Architecture & Implementation Blueprint
**Explorer 1: Lock Screen, Kinetic Typography, Portable Cursor, and Modular Wallpaper Configuration**

---

## Executive Summary
This document defines the architectural specifications, component interfaces, mathematical physics integration, state management, and test suites for:
1. **Lock Screen System (`LockScreen.tsx`)**: High-fidelity fullscreen macOS-style lock screen at `z-[10000]`, with dynamic live time/date, script typography, wallpaper background, magnetic kinetic interactivity, and smooth physics-driven slide-up dismissal.
2. **Kinetic Typography & Magnetic Cursor Portability**: Generalization of Euler ODE spring physics (`solveEulerStep`), Gaussian falloff, and magnetic cursor state machine across both Lock Screen ("Irfan.dev") and Desktop (`KineticHeroStage.tsx`).
3. **Modular Wallpaper & Dynamic Palette Architecture**: Central configuration in `src/config/wallpapers.ts` (with backward compatibility in `src/lib/constants/wallpapers.ts`) exposing structured dominant color palettes (primary, secondary, accent, surface, border, labelBg, labelText) to power dynamic UI tinting for the Retro Cassette Player and OS components.
4. **Comprehensive Test Suite Blueprint**: Vitest & React Testing Library test cases covering component rendering, clock intervals, dismissal triggers, kinetic font variations, and config validation.

---

## 1. Lock Screen Architecture & Lifecycle

### 1.1 Layering and Stacking Context
- **Layer Coordinate**: `z-[10000]`, rendered as the uppermost UI layer in `src/app/page.tsx`.
- **Cursor Stacking Order**:
  - `KineticCursor` (`CursorPrecisionDot` and `CursorAuraRing`) should be updated to `z-[10001]` (or `z-[99999]`) so the custom magnetic cursor remains visible and interactive above the lock screen (`z-[10000]`).
  - Update `tailwind.config.ts` `zIndex` definitions:
    ```ts
    zIndex: {
      '0': '0',         // Layer 0: Desktop Wallpaper & KineticHeroStage
      '10': '10',       // Layer 1: DesktopCanvas + DesktopGrid
      '20': '20',       // Layer 2: Inactive Windows
      '45': '45',       // Layer 2: Active Focused Window
      '50': '50',       // Layer 3: TopMenuBar
      '9990': '9990',   // Layer 4: Dock
      '9992': '9992',   // Layer 5: Retro Cassette Music Player
      '9995': '9995',   // Layer 6: SpotlightSearch + ContextMenu
      '10000': '10000', // Layer 7: Lock Screen
      '10001': '10001', // Layer 8: Kinetic Cursor
    }
    ```

### 1.2 State Management & Lock/Unlock Lifecycle
- **Zustand State in `useOSStore.ts`**:
  ```ts
  export interface OSStore {
    // ...existing props
    isLocked: boolean;
    unlock: () => void;
    lock: () => void;
  }
  ```
  - Default initial state: `isLocked: true`.
  - On page load / initial visit, `isLocked` is `true`, presenting the Lock Screen immediately.
  - Action `unlock: () => set({ isLocked: false })` dismisses the lock screen.
  - Action `lock: () => set({ isLocked: true })` allows re-locking from the Apple Menu or keyboard shortcuts (`Cmd+Ctrl+Q` or `Ctrl+Cmd+Q`).
  - In `persist` middleware partialize: `isLocked` should either default to `true` on reload or be omitted from persistence so fresh visitors experience the lock screen.

### 1.3 Real-Time Clock & Date Subsystem
- **Clock Hook / Logic**:
  ```ts
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Align with second boundary for crisp updates
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hr format e.g. "17:41"
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }); // e.g. "Saturday, August 15"
  ```
- **SSR Hydration Protection**:
  Use a `mounted` state flag (`const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), []);`) to prevent hydration mismatch between server rendering time and client local time.

### 1.4 Visual Typography & Brand Layout
1. **Clock Display**:
   - Giant, crisp SF Pro / Inter display typography: `text-7xl sm:text-8xl md:text-9xl font-semibold tracking-tight text-white/95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]`.
2. **Date Display**:
   - `text-lg sm:text-xl md:text-2xl font-medium text-white/80 tracking-wide mt-2 drop-shadow-md`.
3. **Header & Brand Typography**:
   - Subtitle: `"Welcome to"` in tracked small-caps: `text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-white/60 mb-2`.
   - Brand Title: `"Irfan.dev"` styled in a signature script / serif font (e.g. `font-serif italic font-light tracking-wide text-5xl sm:text-7xl text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]`) with kinetic letter displacement and magnetic hover interaction.
4. **Unlock Hint**:
   - Bottom prompt: `"Click anywhere or press any key to unlock"` with subtle breathing animation (`text-xs text-white/50 tracking-wider animate-pulse select-none pb-8`).

### 1.5 Motion & Dismissal Animation
- **Slide-up Physics**:
  Wrapped in Framer Motion `<AnimatePresence>`:
  ```tsx
  <AnimatePresence>
    {isLocked && (
      <motion.div
        key="lock-screen-overlay"
        data-testid="lock-screen"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{
          y: '-100%',
          opacity: 0.95,
          transition: {
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1], // snappy Apple cubic-bezier
          },
        }}
        onClick={handleUnlock}
        className="fixed inset-0 z-[10000] w-screen h-screen overflow-hidden flex flex-col justify-between items-center select-none cursor-pointer"
      >
        {/* Background Wallpaper */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <div
            className="w-full h-full"
            style={{ background: currentWallpaper.fallbackGradient }}
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        </div>

        {/* Top Spacer / Status */}
        <div className="pt-16 sm:pt-20 flex flex-col items-center">
          <span className="text-7xl sm:text-8xl md:text-9xl font-semibold tracking-tight text-white/95 font-sans">
            {timeString}
          </span>
          <span className="text-lg sm:text-xl font-medium text-white/80 mt-2">
            {dateString}
          </span>
        </div>

        {/* Center: Brand Showcase with Kinetic Physics */}
        <div className="flex flex-col items-center justify-center my-auto text-center px-4">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-white/60 mb-2">
            Welcome to
          </p>
          <KineticBrandTitle text="Irfan.dev" />
        </div>

        {/* Bottom Hint */}
        <div className="pb-8 text-center">
          <p className="text-xs text-white/50 tracking-widest uppercase animate-pulse">
            Click anywhere or press any key to unlock
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
  ```
- **Global Keydown Dismissal**:
  Attach keydown listener to document when locked to dismiss on `Space`, `Enter`, `Escape`, or any standard keypress.
- **Audio Feedback**:
  Trigger `GlobalAudioManager.getInstance().playFx('window-open')` (or bespoke click) on unlock when `soundEnabled` is active.

---

## 2. Kinetic Typography & Magnetic Cursor Portability

### 2.1 Reusable Kinetic Typography Architecture
Currently, `KineticHeroStage.tsx` hardcodes full-screen fixed layout for `"CREATIVE DEVELOPER"`.
To make kinetic typography completely portable across both Lock Screen and Desktop:

1. **Modular Kinetic Typography Core**:
   Extract or create `KineticBrandTitle.tsx` / `KineticText.tsx`:
   - Wraps `SplitText` with an active Euler ODE animation loop (`solveEulerStep`).
   - Accepts configurable props:
     ```ts
     export interface KineticTextProps {
       text: string;
       className?: string;
       fontSizeClamp?: string;
       springConfig?: SpringConfig; // defaults to { k: 280, c: 24, m: 1.0 }
       influenceRadius?: number;    // defaults to 220px
       maxDisplacement?: number;    // defaults to 50px
       cursorVariant?: CursorVariant; // defaults to 'kinetic-hero'
       fontStyle?: 'script' | 'sans' | 'mono';
     }
     ```
2. **Physics Execution Model**:
   - Each character span with `data-char` tracks its origin `(originX, originY)` and 2D spring state `{ xState: { x, v }, yState: { x, v } }`.
   - Pointer coordinates `(mouseX, mouseY)` calculate distance $d = \sqrt{(mouseX - originX)^2 + (mouseY - originY)^2}$.
   - If $d < influenceRadius$:
     - $force = \exp(-d^2 / (2 \cdot \sigma^2))$ (Gaussian falloff with $\sigma = 90$).
     - $\theta = \operatorname{atan2}(originY - mouseY, originX - mouseX)$.
     - Target displacement: $targetDx = \cos(\theta) \cdot force \cdot maxDisplacement$, $targetDy = \sin(\theta) \cdot force \cdot maxDisplacement$.
     - Variable weight: $weight = \operatorname{clamp}(300, 900, \operatorname{round}(400 + force \cdot 500))$.
   - If inactive / far:
     - Target displacement decays to harmonic idle wave or 0.
   - Euler step updates position: `xState = solveEulerStep(xState, targetDx, config)`.

### 2.2 Magnetic Cursor Integration
1. **Cursor Variant Expansion in `src/types/cursor.ts`**:
   ```ts
   export type CursorVariant =
     | 'default'
     | 'pointer'
     | 'text'
     | 'precision-drag'
     | 'magnetic-dock'
     | 'kinetic-hero'
     | 'magnetic'
     | 'disabled';
   ```
2. **Magnetic Cursor Behavior**:
   - `LockScreen` brand container has `data-cursor="magnetic"` or `data-cursor="kinetic-hero"`.
   - When hovering over "Irfan.dev", `KineticCursor` detects `[data-cursor]` from `document.elementFromPoint(x, y)`:
     - `CursorAuraRing` expands or morphs with smooth mix-blend-mode difference.
     - `CursorPrecisionDot` remains precisely under the pointer.
3. **Cursor Stacking Order**:
   - Set `CursorPrecisionDot` and `CursorAuraRing` to `z-[10001]` so the cursor is rendered above the Lock Screen (`z-[10000]`).

---

## 3. Wallpaper Configuration Architecture

### 3.1 Modular Configuration Schema (`src/config/wallpapers.ts`)
To meet R1 and R2 requirements (Lock Screen wallpaper + Retro Cassette dynamic color extraction), create a central wallpaper config in `src/config/wallpapers.ts` and re-export in `src/lib/constants/wallpapers.ts`.

```ts
export interface WallpaperPalette {
  primary: string;      // Main theme accent (e.g. #3b82f6)
  secondary: string;    // Secondary harmonic tone (e.g. #1e1b4b)
  accent: string;       // High-contrast button/spoke accent (e.g. #60a5fa)
  surface: string;      // Cassette chassis / card surface (e.g. rgba(15, 23, 42, 0.90))
  border: string;       // Highlight / glass rim border (e.g. rgba(59, 130, 246, 0.35))
  labelBg: string;      // Cassette label background (e.g. #0f172a)
  labelText: string;    // Cassette label text (e.g. #93c5fd)
}

export interface WallpaperItem {
  id: string;
  name: string;
  type: 'gradient' | 'image' | 'svg';
  src?: string;
  thumbnail?: string;
  fallbackGradient: string;
  darkOverlay: string;  // Tailwind CSS overlay class
  lightOverlay: string; // Tailwind CSS overlay class
  themePreference?: 'dark' | 'light' | 'both';
  accentColor: string;
  palette: WallpaperPalette;
}
```

### 3.2 Defined Wallpaper Catalog
```ts
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
    palette: {
      primary: '#3b82f6',
      secondary: '#1e1b4b',
      accent: '#60a5fa',
      surface: 'rgba(15, 23, 42, 0.92)',
      border: 'rgba(59, 130, 246, 0.35)',
      labelBg: '#0f172a',
      labelText: '#93c5fd',
    },
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
    palette: {
      primary: '#6366f1',
      secondary: '#f472b6',
      accent: '#eab308',
      surface: 'rgba(255, 255, 255, 0.92)',
      border: 'rgba(99, 102, 241, 0.3)',
      labelBg: '#fdf4ff',
      labelText: '#4c1d95',
    },
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
    palette: {
      primary: '#f97316',
      secondary: '#451a03',
      accent: '#fb923c',
      surface: 'rgba(28, 25, 23, 0.92)',
      border: 'rgba(249, 115, 22, 0.35)',
      labelBg: '#1c1917',
      labelText: '#fed7aa',
    },
  },
  {
    id: 'ventura',
    name: 'macOS Ventura',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(circle at 70% 30%, #ea580c 0%, #2563eb 55%, #0f172a 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'both',
    accentColor: '#ea580c',
    palette: {
      primary: '#ea580c',
      secondary: '#2563eb',
      accent: '#38bdf8',
      surface: 'rgba(15, 23, 42, 0.92)',
      border: 'rgba(234, 88, 12, 0.35)',
      labelBg: '#1e293b',
      labelText: '#fdba74',
    },
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
    palette: {
      primary: '#ec4899',
      secondary: '#581c87',
      accent: '#f472b6',
      surface: 'rgba(30, 27, 75, 0.92)',
      border: 'rgba(236, 72, 153, 0.35)',
      labelBg: '#2e1065',
      labelText: '#fbcfe8',
    },
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
    palette: {
      primary: '#06b6d4',
      secondary: '#701a75',
      accent: '#22d3ee',
      surface: 'rgba(9, 13, 22, 0.94)',
      border: 'rgba(6, 182, 212, 0.4)',
      labelBg: '#0f172a',
      labelText: '#67e8f9',
    },
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
    palette: {
      primary: '#a1a1aa',
      secondary: '#18181b',
      accent: '#e4e4e7',
      surface: 'rgba(24, 24, 27, 0.94)',
      border: 'rgba(161, 161, 170, 0.25)',
      labelBg: '#18181b',
      labelText: '#d4d4d8',
    },
  },
];

export const DEFAULT_WALLPAPER_ID = 'sonoma-dark';

export function getWallpaperById(id?: string): WallpaperItem {
  if (!id) return WALLPAPERS[0];
  const found = WALLPAPERS.find(w => w.id === id);
  return found || WALLPAPERS[0];
}

export function getWallpaperPalette(id?: string): WallpaperPalette {
  return getWallpaperById(id).palette;
}
```

---

## 4. Test Strategy & Test Suite Specifications

### 4.1 Unit & Integration Tests: Lock Screen (`tests/components/LockScreen.test.tsx`)
```ts
import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LockScreen } from '@/components/os/LockScreen';
import { useOSStore } from '@/hooks/useOSStore';

describe('Lock Screen Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-15T10:30:00Z'));
    useOSStore.setState({
      isLocked: true,
      wallpaperId: 'sonoma-dark',
      soundEnabled: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders fullscreen container at z-[10000] with live clock and date', () => {
    render(<LockScreen />);
    const lockScreen = screen.getByTestId('lock-screen');
    expect(lockScreen).toBeInTheDocument();
    expect(lockScreen).toHaveClass('z-[10000]');

    const clock = screen.getByTestId('lock-screen-clock');
    expect(clock).toBeInTheDocument();
    // Verify 2-digit:2-digit format
    expect(clock.textContent).toMatch(/^\d{2}:\d{2}$/);

    const date = screen.getByTestId('lock-screen-date');
    expect(date).toBeInTheDocument();
    // Verify "Weekday, Month DD" format
    expect(date.textContent).toMatch(/^[A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2}$/);
  });

  it('renders "Welcome to" header and "Irfan.dev" script brand title', () => {
    render(<LockScreen />);
    expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
    
    const brand = screen.getByTestId('lock-screen-brand');
    expect(brand).toBeInTheDocument();
    expect(brand.textContent).toContain('Irfan.dev');
  });

  it('updates live clock every second', () => {
    render(<LockScreen />);
    const clock = screen.getByTestId('lock-screen-clock');
    const initialTime = clock.textContent;

    act(() => {
      vi.advanceTimersByTime(60000); // Advance 1 minute
    });

    expect(clock.textContent).not.toBe(initialTime);
  });

  it('dismisses lock screen on user click', () => {
    render(<LockScreen />);
    const lockScreen = screen.getByTestId('lock-screen');
    
    fireEvent.click(lockScreen);
    expect(useOSStore.getState().isLocked).toBe(false);
  });

  it('dismisses lock screen on keyboard keydown (Space, Enter, Escape)', () => {
    render(<LockScreen />);
    expect(useOSStore.getState().isLocked).toBe(true);

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    expect(useOSStore.getState().isLocked).toBe(false);
  });

  it('loads wallpaper styling dynamically from active wallpaperId', () => {
    useOSStore.setState({ wallpaperId: 'sequoia-dark' });
    render(<LockScreen />);
    const bg = screen.getByTestId('lock-screen-wallpaper');
    expect(bg.style.background).toContain('radial-gradient');
  });
});
```

### 4.2 Unit Tests: Wallpaper Config & Palettes (`tests/config/wallpapers.test.ts`)
```ts
import { describe, it, expect } from 'vitest';
import { WALLPAPERS, getWallpaperById, getWallpaperPalette, DEFAULT_WALLPAPER_ID } from '@/config/wallpapers';

describe('Wallpaper Configuration & Palettes', () => {
  it('contains at least 7 high-fidelity wallpaper configurations', () => {
    expect(WALLPAPERS.length).toBeGreaterThanOrEqual(7);
  });

  it('ensures each wallpaper definition has complete palette attributes', () => {
    WALLPAPERS.forEach(w => {
      expect(w.id).toBeDefined();
      expect(w.name).toBeDefined();
      expect(w.fallbackGradient).toBeDefined();
      expect(w.accentColor).toBeDefined();
      expect(w.palette).toBeDefined();
      expect(w.palette.primary).toMatch(/^#[0-9a-fA-F]{6}$|^rgba?\(/);
      expect(w.palette.secondary).toMatch(/^#[0-9a-fA-F]{6}$|^rgba?\(/);
      expect(w.palette.accent).toMatch(/^#[0-9a-fA-F]{6}$|^rgba?\(/);
      expect(w.palette.surface).toBeDefined();
      expect(w.palette.border).toBeDefined();
      expect(w.palette.labelBg).toBeDefined();
      expect(w.palette.labelText).toBeDefined();
    });
  });

  it('falls back safely to default wallpaper when unknown id is supplied', () => {
    const fallback = getWallpaperById('non-existent-wallpaper');
    expect(fallback.id).toBe(DEFAULT_WALLPAPER_ID);

    const palette = getWallpaperPalette('non-existent-wallpaper');
    expect(palette.primary).toBe(fallback.palette.primary);
  });
});
```

---

## 5. File Modification & Creation Roadmap

| Action | Path | Description |
|---|---|---|
| **CREATE** | `src/config/wallpapers.ts` | Central modular wallpaper configuration and dynamic color palette extractor |
| **UPDATE** | `src/lib/constants/wallpapers.ts` | Re-export from `src/config/wallpapers.ts` to ensure 100% backward compatibility |
| **CREATE** | `src/components/os/LockScreen.tsx` | Fullscreen Lock Screen component at `z-[10000]` with live clock, script font brand, kinetic displacement, wallpaper background, and dismiss transition |
| **CREATE** | `src/components/typography/KineticBrandTitle.tsx` | Portable kinetic typography component with Euler ODE spring loop and magnetic cursor interaction |
| **UPDATE** | `src/hooks/useOSStore.ts` | Add `isLocked: boolean`, `unlock: () => void`, `lock: () => void` |
| **UPDATE** | `src/app/page.tsx` | Mount `LockScreen` component and ensure proper layering |
| **UPDATE** | `src/components/cursor/CursorPrecisionDot.tsx` & `CursorAuraRing.tsx` | Elevate z-index to `z-[10001]` to float over Lock Screen `z-[10000]` |
| **UPDATE** | `tailwind.config.ts` | Extend `zIndex` with `'10000'` and `'10001'` |
| **CREATE** | `tests/components/LockScreen.test.tsx` | Comprehensive unit tests for lock screen render, clock updates, dismiss triggers |
| **CREATE** | `tests/config/wallpapers.test.ts` | Unit tests for wallpaper config and palette validity |
