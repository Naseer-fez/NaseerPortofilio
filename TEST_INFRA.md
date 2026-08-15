# E2E Test Infrastructure Specification

**Project**: macOS-Style Portfolio Showcase  
**Track**: E2E Testing Track  
**Environment**: Vitest + jsdom + React Testing Library + TypeScript  
**Status**: ACTIVE & VERIFIED  

---

## 1. Architecture Overview & Runner Configuration

The E2E Test Infrastructure is built for fast, deterministic, in-memory execution of the entire macOS-style desktop operating system showcase. It provides exhaustive opaque-box validation across 4 testing tiers without requiring external browser binaries.

### 1.1 Core Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/tier1-features/**/*.test.{ts,tsx}',
      'tests/tier2-boundaries/**/*.test.{ts,tsx}',
      'tests/tier3-cross-feature/**/*.test.{ts,tsx}',
      'tests/tier4-scenarios/**/*.test.{ts,tsx}',
      'tests/visual-conformance/**/*.test.{ts,tsx}',
      'tests/**/*.test.{ts,tsx}',
      'src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.agents/**',
    ],
    reporters: ['default'],
    testTimeout: 10000,
    hookTimeout: 10000,
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/types/**/*',
        'src/app/layout.tsx',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    },
  },
});
```

---

## 2. Global Test Setup & Browser API Mocks

The test runner initializes all browser API polyfills and high-fidelity mocks in `tests/setup.ts`.

### 2.1 Mock Inventory

| Mock Module | Path | Purpose & Capabilities |
|---|---|---|
| `AudioContextMock` | `tests/mocks/audio/AudioContextMock.ts` | Complete Web Audio API mock (`AudioContext`, `GainNode`, `AnalyserNode`, `MediaElementAudioSourceNode`, parameter automation tracking with `setValueAtTime`, `linearRampToValueAtTime`). |
| `HTMLAudioElementMock` | `tests/mocks/audio/HTMLAudioElementMock.ts` | Full HTML5 Audio element simulation with time advancement (`advanceTime`), seeking, and event dispatching (`play`, `pause`, `timeupdate`, `ended`). |
| `Canvas2DMock` | `tests/mocks/dom/Canvas2DMock.ts` | 2D canvas rendering context with paths, gradients, measurements, and clear methods for the real-time FFT audio visualizer. |
| `ResizeObserverMock` | `tests/mocks/dom/ResizeObserverMock.ts` | Element observation tracking with programmatic resize trigger (`triggerResize`) for layout responsiveness. |
| `MatchMediaMock` | `tests/mocks/dom/MatchMediaMock.ts` | Responsive viewport controller (`setViewport`) supporting breakpoints (768px, 1024px), pointer capability (`fine` vs `coarse`), and dark/light themes. |
| `IntersectionObserverMock` | `tests/mocks/dom/IntersectionObserverMock.ts` | Element visibility observer for scroll and viewport detection. |
| `PointerEventsMock` | `tests/mocks/dom/PointerEventsMock.ts` | Pointer events and capture API (`setPointerCapture`, `releasePointerCapture`) for smooth drag and resize interactions. |
| `LocalStorageMock` | `tests/mocks/dom/LocalStorageMock.ts` | In-memory key-value store with state tracking for theme, wallpaper, and music playback persistence. |
| `RafMock` | `tests/mocks/dom/RafMock.ts` | `requestAnimationFrame` controller with discrete step simulator (`advanceFrames`) for Euler ODE physics and kinetic typography. |
| `MediaSessionMock` | `tests/mocks/platform/MediaSessionMock.ts` | Hardware/OS media key action handlers (`navigator.mediaSession`) for global playback integration. |
| `DeviceOrientationMock` | `tests/mocks/platform/DeviceOrientationMock.ts` | Device gyroscope and orientation events for mobile 3D tilt effects. |

---

## 3. Test Fixtures & Simulation Helpers

### 3.1 Fixtures (`tests/fixtures/`)
- `playlist.fixture.ts`: 4 curated audio tracks with full metadata and duration.
- `wallpapers.fixture.ts`: Dynamic and static wallpapers (Sonoma Dark, Sonoma Light, Ventura Dark, Ventura Light).
- `apps.fixture.ts`: App manifests for 6 core applications (Terminal, Projects, About Me, Finder, System Settings, Mail).

### 3.2 Simulation Utilities (`tests/helpers/`)
- `simulateDrag(element, options)`: Multi-step continuous pointer dragging with coordinate interpolation.
- `simulateMarquee(element, options)`: Rectangular selection marquee drag simulation.
- `simulateResizeHandle(windowFrame, handle, delta)`: 8-direction window resize simulation (`n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`).
- `simulateKeyboardShortcut(combo, options)`: Dispatcher for keyboard shortcuts (`Cmd+K`, `Cmd+W`, `Cmd+M`, `Cmd+Shift+D`, `Cmd+Option+M`, `Escape`).
- `simulateMobileSwipe(element, options)`: Touch gesture swipe simulator with threshold tracking.
- `simulateAudioPlayback(seconds)`: Time step simulation across all active audio elements and context.

---

## 4. Custom Vitest Matchers (`tests/helpers/matchers.ts`)

| Custom Matcher | Assertion Goal |
|---|---|
| `toBeInZIndexRange(min, max)` | Verifies element z-index adheres to layer constraints (e.g. windows in Layer 2: 20..49). |
| `toHaveZIndexOrder(belowElement)` | Verifies active window elevation above background windows. |
| `toBeClampedWithinViewport(constraints)` | Enforces title bar clearance ($y \ge 28$) and minimum visible overhang ($\ge 100\text{px}$). |
| `toMatchGlassmorphism(spec)` | Verifies `backdrop-filter` blur and saturation tokens. |
| `toHaveWindowBounds(expected)` | Validates window position $\{x, y\}$ and size $\{width, height\}$ with subpixel tolerance. |
| `toHaveDockMagnification(expectedScale)` | Validates Parabolic Cosine Bell icon growth. |
| `toHaveDuckedVolume(expectedDuckLevel)` | Validates Web Audio GainNode ducking to 20% on UI sound effects. |

---

## 5. Test Execution Commands

```bash
# Run full E2E test suite
npx vitest run

# Run specific testing tiers
npx vitest run tests/tier1-features
npx vitest run tests/tier2-boundaries
npx vitest run tests/tier3-cross-feature
npx vitest run tests/tier4-scenarios
npx vitest run tests/visual-conformance

# Watch mode for interactive development
npx vitest

# Code coverage report
npx vitest run --coverage
```
