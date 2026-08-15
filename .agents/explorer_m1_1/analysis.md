# Milestone 1: Core OS Framework — Architectural & Configuration Analysis

**Agent**: Explorer 1 (`explorer_m1_1`)  
**Target Milestone**: Milestone 1 (Core OS Framework)  
**Date**: 2026-08-15  
**Working Directory**: `d:\CODE\Html\Showcase\.agents\explorer_m1_1\`

---

## 1. Executive Summary

Milestone 1 establishes the foundational infrastructure for the macOS Portfolio OS Showcase. This document provides concrete, copy-paste ready configurations, design token specifications, typography integration, and testing framework setup required by Sprint 1 of the implementation plan and `PROJECT.md`.

### Core Requirements Matrix
| Requirement Area | Specification Target | Status / Strategy |
|---|---|---|
| **Framework & App Router** | Next.js 14+ (App Router), React 18+, TypeScript 5+ | Full App Router directory structure in `src/app/` with strict type checking and path aliases (`@/*`). |
| **Styling & OS Tokens** | Tailwind CSS 3.4+ + PostCSS + CSS Custom Properties | Semantic variables mapped in `:root` and `.dark` in `src/app/globals.css`, extended via `tailwind.config.ts`. |
| **macOS Glassmorphism** | `blur(28px) saturate(180%)`, multi-layer active/inactive window shadows | Custom backdrop-blur and box-shadow tokens defined in Tailwind theme. |
| **Typography** | Inter Variable (`--font-sans`) + JetBrains Mono (`--font-mono`) | Optimized zero-layout-shift font loading via `next/font/google`. |
| **Testing Engine** | Vitest + React Testing Library + jsdom | Lightning-fast unit and component testing with comprehensive browser API mocks (`matchMedia`, `ResizeObserver`, `AudioContext`). |

---

## 2. Project File Structure & Core Configurations

The project must strictly comply with the layout specified in `PROJECT.md`.

### 2.1 Complete File Structure Overview
```
d:/CODE/Html/Showcase/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.mjs
├── vitest.config.ts
├── vitest.setup.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── os/
│   │   │   ├── DesktopCanvas.tsx
│   │   │   ├── DesktopGrid.tsx
│   │   │   ├── DesktopIcon.tsx
│   │   │   ├── TopMenuBar.tsx
│   │   │   ├── ControlCenter.tsx
│   │   │   ├── SpotlightSearch.tsx
│   │   │   └── ContextMenu.tsx
│   │   ├── window/
│   │   │   ├── WindowManager.tsx
│   │   │   ├── WindowFrame.tsx
│   │   │   └── TrafficLights.tsx
│   │   ├── apps/
│   │   │   ├── TerminalApp.tsx
│   │   │   ├── ProjectsApp.tsx
│   │   │   ├── AboutApp.tsx
│   │   │   ├── FinderApp.tsx
│   │   │   ├── SettingsApp.tsx
│   │   │   └── MailApp.tsx
│   │   ├── dock/
│   │   │   ├── Dock.tsx
│   │   │   ├── DockItem.tsx
│   │   │   ├── DockTooltip.tsx
│   │   │   ├── ActiveDotIndicator.tsx
│   │   │   └── MusicPlayerDockPill.tsx
│   │   ├── music/
│   │   │   ├── AudioDeckExpandedCard.tsx
│   │   │   ├── VinylDiscAssembly.tsx
│   │   │   ├── AudioVisualizerCanvas.tsx
│   │   │   ├── InteractiveScrubber.tsx
│   │   │   └── MediaSessionController.tsx
│   │   ├── typography/
│   │   │   ├── KineticHeroStage.tsx
│   │   │   ├── SplitText.tsx
│   │   │   └── AmbientHarmonicWave.tsx
│   │   ├── cursor/
│   │   │   ├── KineticCursor.tsx
│   │   │   ├── CursorPrecisionDot.tsx
│   │   │   └── CursorAuraRing.tsx
│   │   └── mobile/
│   │       ├── MobileBottomSheet.tsx
│   │       ├── MobileTabBar.tsx
│   │       └── MobileStickyAudioBar.tsx
│   ├── hooks/
│   │   ├── useOSStore.ts
│   │   ├── useMusicStore.ts
│   │   ├── useBreakpoint.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── usePhysicsTypography.ts
│   ├── lib/
│   │   ├── audio/
│   │   │   ├── GlobalAudioManager.ts
│   │   │   └── SoundSynthesizer.ts
│   │   ├── physics/
│   │   │   ├── eulerSolver.ts
│   │   │   └── springUtils.ts
│   │   ├── constants/
│   │   │   ├── apps.ts
│   │   │   ├── shortcuts.ts
│   │   │   └── wallpapers.ts
│   │   └── utils/
│   │       └── cn.ts
│   └── types/
│       ├── os.ts
│       ├── music.ts
│       ├── apps.ts
│       └── cursor.ts
```

---

### 2.2 `package.json` Specification

```json
{
  "name": "macos-portfolio-showcase",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^11.3.28",
    "lucide-react": "^0.428.0",
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.2",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4",
    "vitest": "^2.0.5"
  }
}
```

---

### 2.3 `tsconfig.json` Specification

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "vitest.setup.ts"
  ],
  "exclude": ["node_modules"]
}
```

---

### 2.4 `postcss.config.js` Specification

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

### 2.5 `next.config.mjs` Specification

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // Recommended for static image assets / portable builds
  },
};

export default nextConfig;
```

---

## 3. Tailwind Theme Extension & macOS OS Tokens

The Tailwind configuration maps all design tokens from `visual-system.md` and layer specifications from `PROJECT.md`.

### 3.1 `tailwind.config.ts` Specification

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        os: {
          bg: {
            desktop: 'var(--os-bg-desktop)',
          },
          menubar: {
            bg: 'var(--os-menubar-bg)',
            border: 'var(--os-menubar-border)',
            text: 'var(--os-menubar-text)',
            hover: 'var(--os-menubar-hover)',
          },
          window: {
            header: {
              bg: 'var(--os-window-header-bg)',
              border: 'var(--os-window-header-border)',
            },
            body: {
              bg: 'var(--os-window-body-bg)',
            },
            text: {
              DEFAULT: 'var(--os-window-text)',
              muted: 'var(--os-window-text-muted)',
            },
            border: 'var(--os-window-border)',
          },
          dock: {
            bg: 'var(--os-dock-bg)',
            border: 'var(--os-dock-border)',
          },
          accent: {
            blue: 'var(--os-accent-blue)',
            'blue-dark': '#2997ff',
            'blue-light': '#0071e3',
          },
          traffic: {
            red: '#FF5F56',
            'red-border': '#E0443E',
            yellow: '#FFBD2E',
            'yellow-border': '#DEA123',
            green: '#27C93F',
            'green-border': '#1AAB29',
          },
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      borderRadius: {
        'os-window': '12px',
        'os-dock': '9999px',
        'os-tooltip': '6px',
        'os-card': '20px',
        'os-pill': '12px',
        'os-menu-item': '4px',
      },
      boxShadow: {
        'os-menubar': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'os-window-inactive': 'var(--os-shadow-window-inactive)',
        'os-window-active': 'var(--os-shadow-window-active)',
        'os-dock': '0 12px 36px -4px rgba(0,0,0,0.55), 0 4px 16px -2px rgba(0,0,0,0.35)',
        'os-deck': '0 24px 48px -12px rgba(0,0,0,0.70)',
        'os-specular-dock': 'inset 0 1px 1px 0 rgba(255,255,255,0.22)',
        'os-specular-deck': 'inset 0 1px 1px 0 rgba(255,255,255,0.20)',
      },
      dropShadow: {
        'os-icon': '0 4px 6px rgba(0, 0, 0, 0.35)',
        'os-label': '0 1px 2px rgba(0, 0, 0, 0.85)',
      },
      backdropBlur: {
        'os-menubar': '40px',
        'os-window': '28px',
        'os-dock': '20px',
        'os-deck': '32px',
        'os-tooltip': '12px',
        'os-spotlight': '24px',
      },
      zIndex: {
        '0': '0',       // Wallpaper + KineticHeroStage
        '10': '10',     // DesktopCanvas + DesktopGrid + SelectionMarquee
        '20': '20',     // Inactive Window Base
        '45': '45',     // Active Window Focused
        '50': '50',     // TopMenuBar
        '9990': '9990', // Luca Dock + MusicPlayerDockPill
        '9992': '9992', // AudioDeckExpandedCard
        '9995': '9995', // SpotlightSearch + ContextMenu + ControlCenter
        '9999': '9999', // KineticCursor
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 4. `globals.css` with CSS Custom Properties

The CSS custom properties define the dynamic light/dark theming layer according to `visual-system.md`.

### 4.1 `src/app/globals.css` Complete Specification

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Desktop & Canvas */
  --os-bg-desktop: #f5f5f7;
  
  /* Top Menu Bar */
  --os-menubar-bg: rgba(255, 255, 255, 0.72);
  --os-menubar-border: rgba(0, 0, 0, 0.08);
  --os-menubar-text: #1d1d1f;
  --os-menubar-hover: rgba(0, 0, 0, 0.06);

  /* Window Chrome */
  --os-window-header-bg: rgba(246, 246, 246, 0.88);
  --os-window-header-border: rgba(0, 0, 0, 0.12);
  --os-window-body-bg: rgba(255, 255, 255, 0.96);
  --os-window-text: #1d1d1f;
  --os-window-text-muted: #6e6e73;
  --os-window-border: rgba(0, 0, 0, 0.14);

  /* Dock (Base Reference / Light Theme) */
  --os-dock-bg: rgba(255, 255, 255, 0.35);
  --os-dock-border: rgba(255, 255, 255, 0.45);

  /* Window Shadows */
  --os-shadow-window-inactive: 0 10px 30px -5px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08);
  --os-shadow-window-active: 0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.12), 0 0 35px rgba(0, 0, 0, 0.15);

  /* Accent & Selection */
  --os-accent-blue: #0071e3;
  --os-selection-bg: rgba(0, 113, 227, 0.25);
  --os-selection-border: rgba(0, 113, 227, 0.5);
  --os-selection-text: inherit;
}

.dark {
  /* Desktop & Canvas */
  --os-bg-desktop: #000000;

  /* Top Menu Bar */
  --os-menubar-bg: rgba(26, 26, 26, 0.65);
  --os-menubar-border: rgba(255, 255, 255, 0.12);
  --os-menubar-text: #f5f5f7;
  --os-menubar-hover: rgba(255, 255, 255, 0.12);

  /* Window Chrome */
  --os-window-header-bg: rgba(36, 36, 40, 0.85);
  --os-window-header-border: rgba(255, 255, 255, 0.10);
  --os-window-body-bg: rgba(24, 24, 28, 0.95);
  --os-window-text: #f5f5f7;
  --os-window-text-muted: #a1a1a6;
  --os-window-border: rgba(255, 255, 255, 0.15);

  /* Dock (Dark Theme) */
  --os-dock-bg: rgba(20, 20, 20, 0.45);
  --os-dock-border: rgba(255, 255, 255, 0.18);

  /* Window Shadows */
  --os-shadow-window-inactive: 0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08);
  --os-shadow-window-active: 0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 40px rgba(0, 0, 0, 0.4);

  /* Accent & Selection */
  --os-accent-blue: #2997ff;
  --os-selection-bg: rgba(41, 151, 255, 0.35);
  --os-selection-border: rgba(41, 151, 255, 0.6);
  --os-selection-text: #ffffff;
}

/* Base OS Viewport Reset & Typography Locks */
html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--os-bg-desktop);
  color: var(--os-window-text);
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}

/* Discreet macOS Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.5);
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* Selection */
::selection {
  background-color: var(--os-selection-bg);
  color: var(--os-selection-text);
}

/* Kinetic Cursor Hide Rule for Fine Pointers */
@media (pointer: fine) {
  body.custom-cursor-active,
  body.custom-cursor-active * {
    cursor: none !important;
  }
}
```

---

## 5. Typography Strategy & Font Loading

### 5.1 Next.js Google Font Integration (`src/app/layout.tsx`)

Inter Variable provides the primary sans-serif font stack (replacing the proprietary PP Neue Montreal as per spec rule 6), supporting continuous variable weights (100–900). JetBrains Mono provides the terminal and monospace font stack.

```typescript
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Portfolio OS — macOS Interactive Desktop',
  description: 'A macOS-inspired desktop operating system portfolio built with Next.js, Tailwind CSS, Framer Motion, and Web Audio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-os-bg-desktop text-os-window-text h-screen w-screen overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
```

---

## 6. Testing Infrastructure (Vitest + Testing Library)

### 6.1 `vitest.config.ts` Specification

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/types/**/*',
        'src/app/layout.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

### 6.2 `vitest.setup.ts` Specification

This file mocks browser environments necessary for Next.js App Router, Web Audio, Framer Motion, and CSS media queries.

```typescript
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// 1. Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 2. Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 3. Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 4. Mock Web Audio API
class AudioContextMock {
  state = 'suspended';
  sampleRate = 44100;
  destination = {};
  currentTime = 0;

  createGain() {
    return {
      gain: {
        value: 1,
        setTargetAtTime: vi.fn(),
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }

  createAnalyser() {
    return {
      fftSize: 64,
      frequencyBinCount: 32,
      getByteFrequencyData: vi.fn((arr: Uint8Array) => arr.fill(0)),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }

  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        value: 440,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createMediaElementSource() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }

  resume = vi.fn().mockResolvedValue(undefined);
  suspend = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockResolvedValue(undefined);
}

// Attach to window and global
// @ts-expect-error Mocking AudioContext
window.AudioContext = AudioContextMock;
// @ts-expect-error Mocking webkitAudioContext
window.webkitAudioContext = AudioContextMock;

// 5. Mock HTMLMediaElement play/pause
window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = vi.fn();
window.HTMLMediaElement.prototype.load = vi.fn();

// 6. Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

---

## 7. Utility Helper (`src/lib/utils/cn.ts`)

Standard Tailwind class merger utility used throughout all components:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 8. Step-by-Step Guidance for Milestone 1 Implementers

### Step 1: Initialize Project Configuration Files
1. Write `package.json`, `tsconfig.json`, `postcss.config.js`, `next.config.mjs`.
2. Write `vitest.config.ts` and `vitest.setup.ts`.
3. Run `npm install` to install all dependencies.

### Step 2: Set Up Styling & Typography
1. Write `src/app/globals.css` with complete `:root` and `.dark` variables.
2. Write `tailwind.config.ts` extending colors, shadows, backdrop blur, z-index, and border radii.
3. Write `src/lib/utils/cn.ts`.
4. Write `src/app/layout.tsx` loading `Inter` and `JetBrains_Mono` with variable axes.

### Step 3: Implement Store & Contracts (`useOSStore.ts`)
1. Create `src/types/os.ts` defining `AppWindow`, `WindowState`, `OSState`, `OSActions`.
2. Create `src/hooks/useOSStore.ts` using Zustand with persistence middleware for theme, wallpaper, desktopMode, soundEnabled.
3. Add unit test `src/hooks/__tests__/useOSStore.test.ts` verifying window open/close/focus, z-index bumping, and mode switching.

### Step 4: Implement Core UI Layers
1. **DesktopCanvas** (`src/components/os/DesktopCanvas.tsx`): Layer 1, `z-10`, `h-[calc(100vh-28px)] top-[28px]`.
2. **Wallpaper** (`src/components/os/Wallpaper.tsx`): Layer 0, `z-0`, 700ms crossfade, dark/light tint overlays (`bg-black/25` / `bg-black/10`).
3. **DesktopGrid & DesktopIcon** (`src/components/os/DesktopGrid.tsx`, `DesktopIcon.tsx`): Auto-flow columns (92px cols, 104px rows, 48x48 icons, 300ms double-click disambiguation).
4. **TopMenuBar** (`src/components/os/TopMenuBar.tsx`): 28px fixed bar, blur-2xl, Apple logo, active app title, live clock (`Sat Aug 15 12:51 PM`).
5. **ShortcutRegistry** (`src/hooks/useKeyboardShortcuts.ts`): Cmd+K, Cmd+W, Cmd+M, Escape, Cmd+Shift+D, Cmd+Option+M.

### Step 5: Verification & Testing
1. Run `npm run test` (Vitest unit tests).
2. Run `npm run build` (Next.js production compilation).
3. Validate layout compliance against `PROJECT.md`.
