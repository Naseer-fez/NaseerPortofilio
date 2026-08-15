# E2E Test Infrastructure Architecture & Runner Design

**Track**: E2E Testing Track (macOS-Style Portfolio Showcase)  
**Author**: Explorer 1  
**Target Milestone**: E2E-M1 Test Infrastructure & Runner Setup  
**Date**: 2026-08-15  
**Status**: APPROVED DESIGN SPECIFICATION  

---

## 1. Executive Summary

This specification establishes the complete, production-grade test runner and infrastructure architecture for the macOS-style portfolio desktop showcase. The design is strictly requirement-driven, opaque-box, and derived from:
- `PROJECT.md` (System architecture, store contracts, z-index layering)
- `portfolio_research/phase2/PHASE_2_MASTER_SPEC.md` (Master contract & constraints)
- `portfolio_research/phase2/qa/interaction-validation-matrix.md` (90 discrete functional test cases)
- `portfolio_research/phase2/qa/visual-reference-matrix.md` (64 visual comparison criteria)

The test infrastructure supports **Vitest + jsdom + React Testing Library** for lightning-fast deterministic in-memory execution across all 4 testing tiers (Tier 1 isolated features, Tier 2 boundary analysis, Tier 3 cross-feature interactions, and Tier 4 realistic end-to-end workflows).

---

## 2. Test Architecture & Runner Configuration

### 2.1 Vitest Configuration (`vitest.config.ts`)

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
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.agents/**',
    ],
    reporters: ['default', 'verbose'],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },
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

### 2.2 Global Test Setup (`tests/setup.ts`)

```typescript
import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Import All Browser API Mocks
import { installWebAudioMock, resetWebAudioMock } from './mocks/audio/AudioContextMock';
import { installHTMLAudioMock, resetHTMLAudioMock } from './mocks/audio/HTMLAudioElementMock';
import { installCanvas2DMock } from './mocks/dom/Canvas2DMock';
import { installResizeObserverMock, resetResizeObserverMock } from './mocks/dom/ResizeObserverMock';
import { installMatchMediaMock, resetMatchMediaMock } from './mocks/dom/MatchMediaMock';
import { installIntersectionObserverMock } from './mocks/dom/IntersectionObserverMock';
import { installPointerEventsMock } from './mocks/dom/PointerEventsMock';
import { installLocalStorageMock, resetLocalStorageMock } from './mocks/dom/LocalStorageMock';
import { installMediaSessionMock, resetMediaSessionMock } from './mocks/platform/MediaSessionMock';
import { installDeviceOrientationMock } from './mocks/platform/DeviceOrientationMock';
import { installRafMock, resetRafMock } from './mocks/dom/RafMock';

// Register Custom Matchers
import './helpers/matchers';

// Install all global browser mocks before any tests run
installWebAudioMock();
installHTMLAudioMock();
installCanvas2DMock();
installResizeObserverMock();
installMatchMediaMock();
installIntersectionObserverMock();
installPointerEventsMock();
installLocalStorageMock();
installMediaSessionMock();
installDeviceOrientationMock();
installRafMock();

beforeEach(() => {
  // Clear mock states and stores
  resetWebAudioMock();
  resetHTMLAudioMock();
  resetResizeObserverMock();
  resetMatchMediaMock();
  resetLocalStorageMock();
  resetMediaSessionMock();
  resetRafMock();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});
```

---

## 3. High-Fidelity Browser API Mocks

### 3.1 Web Audio API Mock (`tests/mocks/audio/AudioContextMock.ts`)

The Web Audio API mock faithfully models node connections, gain adjustments, FFT frequency bin population, and scheduled parameter automation for procedural audio synthesis and audio ducking.

```typescript
import { vi } from 'vitest';

export interface ScheduledAudioParamEvent {
  type: 'setValueAtTime' | 'linearRamp' | 'exponentialRamp' | 'setTarget';
  targetValue: number;
  time: number;
  timeConstant?: number;
}

export class MockAudioParam {
  private _value: number;
  private _scheduledEvents: ScheduledAudioParamEvent[] = [];

  constructor(defaultValue: number = 1.0) {
    this._value = defaultValue;
  }

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
  }

  setValueAtTime(value: number, startTime: number): this {
    this._value = value;
    this._scheduledEvents.push({ type: 'setValueAtTime', targetValue: value, time: startTime });
    return this;
  }

  linearRampToValueAtTime(value: number, endTime: number): this {
    this._value = value;
    this._scheduledEvents.push({ type: 'linearRamp', targetValue: value, time: endTime });
    return this;
  }

  exponentialRampToValueAtTime(value: number, endTime: number): this {
    this._value = value;
    this._scheduledEvents.push({ type: 'exponentialRamp', targetValue: value, time: endTime });
    return this;
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number): this {
    this._value = target;
    this._scheduledEvents.push({ type: 'setTarget', targetValue: target, time: startTime, timeConstant });
    return this;
  }

  cancelScheduledValues(startTime: number): this {
    this._scheduledEvents = this._scheduledEvents.filter(e => e.time < startTime);
    return this;
  }

  getScheduledEvents(): ScheduledAudioParamEvent[] {
    return [...this._scheduledEvents];
  }

  reset(): void {
    this._value = 1.0;
    this._scheduledEvents = [];
  }
}

export class MockAudioNode {
  context: MockAudioContext;
  numberOfInputs: number = 1;
  numberOfOutputs: number = 1;
  channelCount: number = 2;
  channelCountMode: string = 'max';
  channelInterpretation: string = 'speakers';
  connectedNodes: MockAudioNode[] = [];

  constructor(context: MockAudioContext) {
    this.context = context;
  }

  connect(destination: MockAudioNode | AudioNode): MockAudioNode {
    this.connectedNodes.push(destination as MockAudioNode);
    return destination as MockAudioNode;
  }

  disconnect(): void {
    this.connectedNodes = [];
  }
}

export class MockGainNode extends MockAudioNode {
  gain: MockAudioParam;

  constructor(context: MockAudioContext, defaultGain: number = 1.0) {
    super(context);
    this.gain = new MockAudioParam(defaultGain);
  }
}

export class MockAnalyserNode extends MockAudioNode {
  fftSize: number = 64;
  frequencyBinCount: number = 32;
  minDecibels: number = -100;
  maxDecibels: number = -30;
  smoothingTimeConstant: number = 0.8;
  private _mockDataActive: boolean = true;

  constructor(context: MockAudioContext) {
    super(context);
  }

  getByteFrequencyData(array: Uint8Array): void {
    for (let i = 0; i < array.length; i++) {
      if (this._mockDataActive) {
        // Deterministic pseudo-FFT harmonic curve for visualizer verification
        array[i] = Math.floor(Math.sin((i / array.length) * Math.PI) * 200 + 20);
      } else {
        array[i] = 0;
      }
    }
  }

  getByteTimeDomainData(array: Uint8Array): void {
    for (let i = 0; i < array.length; i++) {
      array[i] = 128;
    }
  }

  setMockDataActive(active: boolean): void {
    this._mockDataActive = active;
  }
}

export class MockMediaElementAudioSourceNode extends MockAudioNode {
  mediaElement: HTMLMediaElement;

  constructor(context: MockAudioContext, mediaElement: HTMLMediaElement) {
    super(context);
    this.mediaElement = mediaElement;
  }
}

export class MockAudioDestinationNode extends MockAudioNode {
  maxChannelCount: number = 2;
  constructor(context: MockAudioContext) {
    super(context);
  }
}

export class MockAudioContext {
  state: 'suspended' | 'running' | 'closed' = 'suspended';
  currentTime: number = 0;
  sampleRate: number = 44100;
  destination: MockAudioDestinationNode;
  
  // Tracked instances for test assertion
  gainNodes: MockGainNode[] = [];
  analyserNodes: MockAnalyserNode[] = [];
  sourceNodes: MockMediaElementAudioSourceNode[] = [];

  constructor() {
    this.destination = new MockAudioDestinationNode(this);
  }

  createGain(): MockGainNode {
    const gain = new MockGainNode(this);
    this.gainNodes.push(gain);
    return gain;
  }

  createAnalyser(): MockAnalyserNode {
    const analyser = new MockAnalyserNode(this);
    this.analyserNodes.push(analyser);
    return analyser;
  }

  createMediaElementSource(mediaElement: HTMLMediaElement): MockMediaElementAudioSourceNode {
    const source = new MockMediaElementAudioSourceNode(this, mediaElement);
    this.sourceNodes.push(source);
    return source;
  }

  createOscillator(): any {
    return {
      type: 'sine',
      frequency: new MockAudioParam(440),
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createBiquadFilter(): any {
    return {
      type: 'lowpass',
      frequency: new MockAudioParam(1000),
      Q: new MockAudioParam(1),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }

  createBufferSource(): any {
    return {
      buffer: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  async resume(): Promise<void> {
    this.state = 'running';
  }

  async suspend(): Promise<void> {
    this.state = 'suspended';
  }

  async close(): Promise<void> {
    this.state = 'closed';
  }
}

let globalAudioContextInstance: MockAudioContext | null = null;

export function getMockAudioContext(): MockAudioContext {
  if (!globalAudioContextInstance) {
    globalAudioContextInstance = new MockAudioContext();
  }
  return globalAudioContextInstance;
}

export function installWebAudioMock(): void {
  // Install AudioContext onto window
  (window as any).AudioContext = class extends MockAudioContext {
    constructor() {
      super();
      globalAudioContextInstance = this;
    }
  };
  (window as any).webkitAudioContext = (window as any).AudioContext;
}

export function resetWebAudioMock(): void {
  if (globalAudioContextInstance) {
    globalAudioContextInstance.state = 'suspended';
    globalAudioContextInstance.currentTime = 0;
    globalAudioContextInstance.gainNodes.forEach(g => g.gain.reset());
    globalAudioContextInstance.gainNodes = [];
    globalAudioContextInstance.analyserNodes = [];
    globalAudioContextInstance.sourceNodes = [];
  }
}
```

---

### 3.2 HTMLAudioElement Mock (`tests/mocks/audio/HTMLAudioElementMock.ts`)

```typescript
import { vi } from 'vitest';

export class MockAudioElement {
  src: string = '';
  currentTime: number = 0;
  duration: number = 180; // default 3 min
  volume: number = 1.0;
  muted: boolean = false;
  paused: boolean = true;
  ended: boolean = false;
  readyState: number = 4; // HAVE_ENOUGH_DATA
  networkState: number = 1; // NETWORK_IDLE
  playbackRate: number = 1.0;

  private _listeners: Record<string, Function[]> = {};

  addEventListener(event: string, callback: Function): void {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  }

  removeEventListener(event: string, callback: Function): void {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this._listeners[event.type] || [];
    listeners.forEach(cb => cb(event));
    return true;
  }

  async play(): Promise<void> {
    this.paused = false;
    this.ended = false;
    this.dispatchEvent(new Event('play'));
    this.dispatchEvent(new Event('playing'));
  }

  pause(): void {
    this.paused = true;
    this.dispatchEvent(new Event('pause'));
  }

  load(): void {
    this.dispatchEvent(new Event('loadstart'));
    this.dispatchEvent(new Event('loadedmetadata'));
    this.dispatchEvent(new Event('canplay'));
    this.dispatchEvent(new Event('canplaythrough'));
  }

  // Simulation test helper
  advanceTime(seconds: number): void {
    if (this.paused) return;
    this.currentTime = Math.min(this.duration, this.currentTime + seconds);
    this.dispatchEvent(new Event('timeupdate'));
    if (this.currentTime >= this.duration) {
      this.ended = true;
      this.paused = true;
      this.dispatchEvent(new Event('ended'));
    }
  }

  seek(seconds: number): void {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    this.dispatchEvent(new Event('seeking'));
    this.dispatchEvent(new Event('seeked'));
    this.dispatchEvent(new Event('timeupdate'));
  }
}

let activeAudioInstances: MockAudioElement[] = [];

export function getActiveAudioElements(): MockAudioElement[] {
  return activeAudioInstances;
}

export function installHTMLAudioMock(): void {
  activeAudioInstances = [];

  const mockAudioConstructor = function (src?: string) {
    const audio = new MockAudioElement();
    if (src) audio.src = src;
    activeAudioInstances.push(audio);
    return audio;
  };

  (window as any).Audio = mockAudioConstructor;
  
  // Also stub HTMLMediaElement prototype
  window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(async function () {
    this.paused = false;
    this.dispatchEvent(new Event('play'));
    this.dispatchEvent(new Event('playing'));
  });
  window.HTMLMediaElement.prototype.pause = vi.fn().mockImplementation(function () {
    this.paused = true;
    this.dispatchEvent(new Event('pause'));
  });
  window.HTMLMediaElement.prototype.load = vi.fn().mockImplementation(function () {
    this.dispatchEvent(new Event('canplay'));
  });
}

export function resetHTMLAudioMock(): void {
  activeAudioInstances = [];
}
```

---

### 3.3 HTMLCanvasElement 2D Context Mock (`tests/mocks/dom/Canvas2DMock.ts`)

```typescript
import { vi } from 'vitest';

export function installCanvas2DMock(): void {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
    if (contextId === '2d') {
      return {
        canvas: document.createElement('canvas'),
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
        putImageData: vi.fn(),
        createImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        fillText: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        strokeRect: vi.fn(),
        strokeText: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        arcTo: vi.fn(),
        bezierCurveTo: vi.fn(),
        quadraticCurveTo: vi.fn(),
        rect: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        translate: vi.fn(),
        transform: vi.fn(),
        resetTransform: vi.fn(),
        measureText: vi.fn().mockImplementation((text: string) => ({
          width: text.length * 8,
          actualBoundingBoxAscent: 10,
          actualBoundingBoxDescent: 2,
        })),
        createLinearGradient: vi.fn().mockReturnValue({
          addColorStop: vi.fn(),
        }),
        createRadialGradient: vi.fn().mockReturnValue({
          addColorStop: vi.fn(),
        }),
        createPattern: vi.fn(),
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        globalAlpha: 1.0,
        globalCompositeOperation: 'source-over',
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic',
        shadowBlur: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      };
    }
    return null;
  }) as any;
}
```

---

### 3.4 ResizeObserver Mock (`tests/mocks/dom/ResizeObserverMock.ts`)

```typescript
import { vi } from 'vitest';

type ResizeCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ObservedElementRecord {
  target: Element;
  callback: ResizeCallback;
}

const observedElements: ObservedElementRecord[] = [];

export class MockResizeObserver {
  private _callback: ResizeCallback;

  constructor(callback: ResizeCallback) {
    this._callback = callback;
  }

  observe(target: Element): void {
    observedElements.push({ target, callback: this._callback });
  }

  unobserve(target: Element): void {
    const idx = observedElements.findIndex(r => r.target === target);
    if (idx !== -1) observedElements.splice(idx, 1);
  }

  disconnect(): void {
    const toRemove = observedElements.filter(r => r.callback === this._callback);
    toRemove.forEach(r => {
      const idx = observedElements.indexOf(r);
      if (idx !== -1) observedElements.splice(idx, 1);
    });
  }

  static triggerResize(target: Element, contentRect: Partial<DOMRectReadOnly>): void {
    const match = observedElements.find(r => r.target === target);
    if (!match) return;

    const fullRect: DOMRectReadOnly = {
      x: contentRect.x ?? 0,
      y: contentRect.y ?? 0,
      width: contentRect.width ?? 100,
      height: contentRect.height ?? 100,
      top: contentRect.top ?? 0,
      right: (contentRect.x ?? 0) + (contentRect.width ?? 100),
      bottom: (contentRect.y ?? 0) + (contentRect.height ?? 100),
      left: contentRect.left ?? 0,
      toJSON: () => ({}),
    };

    const entry: ResizeObserverEntry = {
      target,
      contentRect: fullRect,
      borderBoxSize: [{ inlineSize: fullRect.width, blockSize: fullRect.height }],
      contentBoxSize: [{ inlineSize: fullRect.width, blockSize: fullRect.height }],
      devicePixelContentBoxSize: [{ inlineSize: fullRect.width, blockSize: fullRect.height }],
    };

    match.callback([entry], new MockResizeObserver(match.callback) as any);
  }
}

export function installResizeObserverMock(): void {
  (window as any).ResizeObserver = MockResizeObserver;
}

export function resetResizeObserverMock(): void {
  observedElements.length = 0;
}
```

---

### 3.5 MatchMedia & Viewport Controller (`tests/mocks/dom/MatchMediaMock.ts`)

```typescript
import { vi } from 'vitest';

export interface ViewportConfig {
  width: number;
  height: number;
  pointer: 'fine' | 'coarse';
  hover: 'hover' | 'none';
  theme: 'dark' | 'light';
  reducedMotion: boolean;
}

let currentViewport: ViewportConfig = {
  width: 1440,
  height: 900,
  pointer: 'fine',
  hover: 'hover',
  theme: 'dark',
  reducedMotion: false,
};

type MediaQueryListener = (e: MediaQueryListEvent) => void;
const registeredMediaQueries: { query: string; listeners: Set<MediaQueryListener> }[] = [];

function evaluateQuery(query: string, config: ViewportConfig): boolean {
  if (query.includes('(min-width: 768px)')) return config.width >= 768;
  if (query.includes('(max-width: 767px)') || query.includes('(max-width: 768px)')) return config.width < 768;
  if (query.includes('(min-width: 640px)')) return config.width >= 640;
  if (query.includes('(max-width: 639px)')) return config.width < 640;
  if (query.includes('(min-width: 1024px)')) return config.width >= 1024;
  if (query.includes('(pointer: fine)')) return config.pointer === 'fine';
  if (query.includes('(pointer: coarse)')) return config.pointer === 'coarse';
  if (query.includes('(hover: hover)')) return config.hover === 'hover';
  if (query.includes('(hover: none)')) return config.hover === 'none';
  if (query.includes('prefers-color-scheme: dark')) return config.theme === 'dark';
  if (query.includes('prefers-color-scheme: light')) return config.theme === 'light';
  if (query.includes('prefers-reduced-motion: reduce')) return config.reducedMotion;
  return false;
}

export function setViewport(updates: Partial<ViewportConfig>): void {
  currentViewport = { ...currentViewport, ...updates };

  // Set jsdom window dimensions
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: currentViewport.width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: currentViewport.height });

  // Dispatch change events to active listeners
  registeredMediaQueries.forEach(({ query, listeners }) => {
    const matches = evaluateQuery(query, currentViewport);
    const event = { matches, media: query } as MediaQueryListEvent;
    listeners.forEach(cb => cb(event));
  });

  window.dispatchEvent(new Event('resize'));
}

export function installMatchMediaMock(): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    let entry = registeredMediaQueries.find(e => e.query === query);
    if (!entry) {
      entry = { query, listeners: new Set() };
      registeredMediaQueries.push(entry);
    }

    const listeners = entry.listeners;

    return {
      get matches() {
        return evaluateQuery(query, currentViewport);
      },
      media: query,
      onchange: null,
      addListener: (cb: MediaQueryListener) => listeners.add(cb),
      removeListener: (cb: MediaQueryListener) => listeners.delete(cb),
      addEventListener: (_type: string, cb: MediaQueryListener) => listeners.add(cb),
      removeEventListener: (_type: string, cb: MediaQueryListener) => listeners.delete(cb),
      dispatchEvent: vi.fn(),
    };
  });
}

export function resetMatchMediaMock(): void {
  setViewport({
    width: 1440,
    height: 900,
    pointer: 'fine',
    hover: 'hover',
    theme: 'dark',
    reducedMotion: false,
  });
  registeredMediaQueries.length = 0;
}
```

---

### 3.6 PointerEvents & Capture Mock (`tests/mocks/dom/PointerEventsMock.ts`)

```typescript
import { vi } from 'vitest';

export function installPointerEventsMock(): void {
  if (!window.PointerEvent) {
    (window as any).PointerEvent = class PointerEvent extends MouseEvent {
      pointerId: number;
      pointerType: string;
      pressure: number;

      constructor(type: string, params: any = {}) {
        super(type, params);
        this.pointerId = params.pointerId ?? 1;
        this.pointerType = params.pointerType ?? 'mouse';
        this.pressure = params.pressure ?? 0;
      }
    };
  }

  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(true);
}
```

---

### 3.7 MediaSession API Mock (`tests/mocks/platform/MediaSessionMock.ts`)

```typescript
import { vi } from 'vitest';

export class MockMediaMetadata {
  title: string;
  artist: string;
  album: string;
  artwork: Array<{ src: string; sizes?: string; type?: string }>;

  constructor(init: any = {}) {
    this.title = init.title ?? '';
    this.artist = init.artist ?? '';
    this.album = init.album ?? '';
    this.artwork = init.artwork ?? [];
  }
}

export class MockMediaSession {
  metadata: MockMediaMetadata | null = null;
  playbackState: 'none' | 'paused' | 'playing' = 'none';
  private _actionHandlers: Map<string, (details: any) => void> = new Map();

  setActionHandler(action: string, handler: ((details: any) => void) | null): void {
    if (handler) {
      this._actionHandlers.set(action, handler);
    } else {
      this._actionHandlers.delete(action);
    }
  }

  // Helper for tests to simulate hardware/OS media keys
  triggerAction(action: string, details: any = {}): void {
    const handler = this._actionHandlers.get(action);
    if (handler) handler(details);
  }

  hasActionHandler(action: string): boolean {
    return this._actionHandlers.has(action);
  }
}

let globalMediaSessionInstance: MockMediaSession | null = null;

export function getMockMediaSession(): MockMediaSession {
  if (!globalMediaSessionInstance) {
    globalMediaSessionInstance = new MockMediaSession();
  }
  return globalMediaSessionInstance;
}

export function installMediaSessionMock(): void {
  (window as any).MediaMetadata = MockMediaMetadata;
  (navigator as any).mediaSession = getMockMediaSession();
}

export function resetMediaSessionMock(): void {
  if (globalMediaSessionInstance) {
    globalMediaSessionInstance.metadata = null;
    globalMediaSessionInstance.playbackState = 'none';
    (globalMediaSessionInstance as any)._actionHandlers.clear();
  }
}
```

---

### 3.8 Animation Frame Mock (`tests/mocks/dom/RafMock.ts`)

```typescript
import { vi } from 'vitest';

let frameIdCounter = 0;
const queuedCallbacks = new Map<number, (time: number) => void>();
let simulatedTime = 0;

export function installRafMock(): void {
  window.requestAnimationFrame = vi.fn().mockImplementation((callback: (time: number) => void) => {
    const id = ++frameIdCounter;
    queuedCallbacks.set(id, callback);
    return id;
  });

  window.cancelAnimationFrame = vi.fn().mockImplementation((id: number) => {
    queuedCallbacks.delete(id);
  });
}

export function advanceFrames(frameCount: number = 1, dt: number = 16.67): void {
  for (let i = 0; i < frameCount; i++) {
    simulatedTime += dt;
    const currentQueue = Array.from(queuedCallbacks.entries());
    queuedCallbacks.clear();
    for (const [, callback] of currentQueue) {
      callback(simulatedTime);
    }
  }
}

export function resetRafMock(): void {
  frameIdCounter = 0;
  queuedCallbacks.clear();
  simulatedTime = 0;
}
```

---

## 4. Test Utility Helpers Suite (`tests/helpers/`)

### 4.1 Drag & Selection Simulator (`tests/helpers/drag.ts`)

```typescript
import { fireEvent } from '@testing-library/react';

export interface DragOptions {
  from?: { x: number; y: number };
  to: { x: number; y: number };
  steps?: number;
  pointerType?: 'mouse' | 'touch';
}

export function simulateDrag(element: Element, options: DragOptions): void {
  const { from = { x: 0, y: 0 }, to, steps = 10, pointerType = 'mouse' } = options;

  fireEvent.pointerDown(element, {
    clientX: from.x,
    clientY: from.y,
    pointerId: 1,
    pointerType,
    buttons: 1,
  });

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const currentX = from.x + (to.x - from.x) * progress;
    const currentY = from.y + (to.y - from.y) * progress;

    fireEvent.pointerMove(element, {
      clientX: currentX,
      clientY: currentY,
      movementX: (to.x - from.x) / steps,
      movementY: (to.y - from.y) / steps,
      pointerId: 1,
      pointerType,
      buttons: 1,
    });
  }

  fireEvent.pointerUp(element, {
    clientX: to.x,
    clientY: to.y,
    pointerId: 1,
    pointerType,
    buttons: 0,
  });
}

export function simulateMarquee(
  desktopSurface: Element,
  options: { start: { x: number; y: number }; end: { x: number; y: number }; steps?: number }
): void {
  simulateDrag(desktopSurface, {
    from: options.start,
    to: options.end,
    steps: options.steps ?? 10,
    pointerType: 'mouse',
  });
}
```

---

### 4.2 Window Resize Simulator (`tests/helpers/resize.ts`)

```typescript
import { fireEvent } from '@testing-library/react';
import { simulateDrag } from './drag';

export type ResizeHandleDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export function simulateResizeHandle(
  windowFrame: HTMLElement,
  handle: ResizeHandleDirection,
  delta: { dx: number; dy: number },
  steps: number = 5
): void {
  const handleEl = windowFrame.querySelector(`[data-resize-handle="${handle}"]`);
  if (!handleEl) {
    throw new Error(`Resize handle "${handle}" not found on window frame.`);
  }

  const rect = handleEl.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  simulateDrag(handleEl, {
    from: { x: startX, y: startY },
    to: { x: startX + delta.dx, y: startY + delta.dy },
    steps,
  });
}
```

---

### 4.3 Keyboard Shortcut Simulator (`tests/helpers/keyboard.ts`)

```typescript
import { fireEvent } from '@testing-library/react';

export function simulateKeyboardShortcut(
  combo: string,
  options: { target?: Element } = {}
): void {
  const target = options.target || window;
  const parts = combo.split('+').map(p => p.trim());

  const hasMeta = parts.includes('Cmd') || parts.includes('Meta');
  const hasCtrl = parts.includes('Ctrl');
  const hasShift = parts.includes('Shift');
  const hasAlt = parts.includes('Alt') || parts.includes('Option');

  const keyPart = parts.find(p => !['Cmd', 'Meta', 'Ctrl', 'Shift', 'Alt', 'Option'].includes(p)) || '';

  const eventPayload = {
    key: keyPart.length === 1 ? keyPart.toLowerCase() : keyPart,
    code: keyPart.length === 1 ? `Key${keyPart.toUpperCase()}` : keyPart,
    metaKey: hasMeta,
    ctrlKey: hasCtrl,
    shiftKey: hasShift,
    altKey: hasAlt,
    bubbles: true,
    cancelable: true,
  };

  fireEvent.keyDown(target, eventPayload);
  fireEvent.keyUp(target, eventPayload);
}
```

---

### 4.4 Mobile Gesture Simulator (`tests/helpers/gesture.ts`)

```typescript
import { fireEvent } from '@testing-library/react';

export function simulateMobileSwipe(
  element: Element,
  options: { startY: number; deltaY: number; steps?: number }
): void {
  const { startY, deltaY, steps = 10 } = options;

  fireEvent.touchStart(element, {
    touches: [{ clientX: 100, clientY: startY }],
    changedTouches: [{ clientX: 100, clientY: startY }],
  });

  for (let i = 1; i <= steps; i++) {
    const currentY = startY + (deltaY * i) / steps;
    fireEvent.touchMove(element, {
      touches: [{ clientX: 100, clientY: currentY }],
      changedTouches: [{ clientX: 100, clientY: currentY }],
    });
  }

  fireEvent.touchEnd(element, {
    touches: [],
    changedTouches: [{ clientX: 100, clientY: startY + deltaY }],
  });
}
```

---

## 5. Custom Vitest Matchers & Visual Assertions (`tests/helpers/matchers.ts`)

Custom expect matchers ensure transparent, readable, and highly diagnostic assertions matching the visual and functional specifications.

```typescript
import { expect } from 'vitest';

interface CustomMatchers<R = unknown> {
  toBeInZIndexRange(min: number, max: number): R;
  toHaveZIndexOrder(belowElement: HTMLElement): R;
  toBeClampedWithinViewport(constraints?: { minY?: number; minOverhang?: number }): R;
  toMatchGlassmorphism(spec: { blur?: string; saturate?: string }): R;
  toHaveWindowBounds(expected: { x?: number; y?: number; width?: number; height?: number }): R;
  toHaveTrafficLightState(state: 'focused' | 'unfocused' | 'hover'): R;
  toHaveDockMagnification(expectedScale: number, tolerance?: number): R;
  toHaveDuckedVolume(expectedDuckLevel: number, tolerance?: number): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toBeInZIndexRange(received: HTMLElement, min: number, max: number) {
    const zIndex = parseInt(window.getComputedStyle(received).zIndex || '0', 10);
    const pass = zIndex >= min && zIndex <= max;
    return {
      pass,
      message: () => `expected element z-index (${zIndex}) ${pass ? 'not ' : ''}to be between ${min} and ${max}`,
    };
  },

  toHaveZIndexOrder(received: HTMLElement, belowElement: HTMLElement) {
    const topZ = parseInt(window.getComputedStyle(received).zIndex || '0', 10);
    const bottomZ = parseInt(window.getComputedStyle(belowElement).zIndex || '0', 10);
    const pass = topZ > bottomZ;
    return {
      pass,
      message: () => `expected element with z-index ${topZ} ${pass ? 'not ' : ''}to be above element with z-index ${bottomZ}`,
    };
  },

  toBeClampedWithinViewport(received: HTMLElement, constraints: { minY?: number; minOverhang?: number } = {}) {
    const minY = constraints.minY ?? 28;
    const minOverhang = constraints.minOverhang ?? 100;
    const rect = received.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const clampedTop = rect.top >= minY;
    const visibleX = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
    const visibleY = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));

    const pass = clampedTop && visibleX >= minOverhang && visibleY >= minOverhang;
    return {
      pass,
      message: () => `expected window bounds (${rect.left}, ${rect.top}, ${rect.width}x${rect.height}) ${pass ? 'not ' : ''}to satisfy clamping (minY: ${minY}, minOverhang: ${minOverhang}px, visible: ${visibleX}x${visibleY})`,
    };
  },

  toMatchGlassmorphism(received: HTMLElement, spec: { blur?: string; saturate?: string }) {
    const style = window.getComputedStyle(received);
    const backdrop = style.backdropFilter || (style as any).webkitBackdropFilter || '';
    
    let pass = true;
    if (spec.blur && !backdrop.includes(`blur(${spec.blur})`)) pass = false;
    if (spec.saturate && !backdrop.includes(`saturate(${spec.saturate})`)) pass = false;

    return {
      pass,
      message: () => `expected element backdrop-filter "${backdrop}" ${pass ? 'not ' : ''}to match glassmorphism spec (blur: ${spec.blur}, saturate: ${spec.saturate})`,
    };
  },

  toHaveWindowBounds(received: HTMLElement, expected: { x?: number; y?: number; width?: number; height?: number }) {
    const rect = received.getBoundingClientRect();
    let pass = true;
    const failures: string[] = [];

    if (expected.x !== undefined && Math.abs(rect.left - expected.x) > 2) {
      pass = false;
      failures.push(`x: expected ${expected.x}, got ${rect.left}`);
    }
    if (expected.y !== undefined && Math.abs(rect.top - expected.y) > 2) {
      pass = false;
      failures.push(`y: expected ${expected.y}, got ${rect.top}`);
    }
    if (expected.width !== undefined && Math.abs(rect.width - expected.width) > 2) {
      pass = false;
      failures.push(`width: expected ${expected.width}, got ${rect.width}`);
    }
    if (expected.height !== undefined && Math.abs(rect.height - expected.height) > 2) {
      pass = false;
      failures.push(`height: expected ${expected.height}, got ${rect.height}`);
    }

    return {
      pass,
      message: () => `expected window bounds to match: ${failures.join(', ')}`,
    };
  },

  toHaveDockMagnification(received: HTMLElement, expectedScale: number, tolerance: number = 0.05) {
    const rect = received.getBoundingClientRect();
    const baseSize = 44;
    const actualScale = rect.width / baseSize;
    const pass = Math.abs(actualScale - expectedScale) <= tolerance;

    return {
      pass,
      message: () => `expected dock item scale (${actualScale.toFixed(3)}) ${pass ? 'not ' : ''}to be within ${tolerance} of ${expectedScale}`,
    };
  },

  toHaveDuckedVolume(receivedGain: any, expectedDuckLevel: number = 0.20, tolerance: number = 0.01) {
    const value = receivedGain.gain?.value ?? receivedGain.value;
    const pass = Math.abs(value - expectedDuckLevel) <= tolerance;
    return {
      pass,
      message: () => `expected music volume gain (${value}) ${pass ? 'not ' : ''}to duck to ${expectedDuckLevel} ± ${tolerance}`,
    };
  },
});
```

---

## 6. Directory Layout & Test Suite Structure

```
tests/
├── setup.ts                                # Global test setup, registration of all mocks & matchers
├── vitest.config.ts                        # Vitest runner config
├── mocks/
│   ├── audio/
│   │   ├── AudioContextMock.ts             # Web Audio API mock (Gain, Analyser, MediaElementSource)
│   │   └── HTMLAudioElementMock.ts         # HTML5 Audio mock with time stepping
│   ├── dom/
│   │   ├── Canvas2DMock.ts                 # Canvas 2D context mock
│   │   ├── ResizeObserverMock.ts           # ResizeObserver mock
│   │   ├── MatchMediaMock.ts               # matchMedia & viewport switcher
│   │   ├── IntersectionObserverMock.ts     # IntersectionObserver mock
│   │   ├── PointerEventsMock.ts            # PointerEvents & PointerCapture mock
│   │   ├── LocalStorageMock.ts             # localStorage mock
│   │   └── RafMock.ts                      # requestAnimationFrame controller
│   └── platform/
│       ├── MediaSessionMock.ts             # navigator.mediaSession mock
│       └── DeviceOrientationMock.ts        # DeviceOrientationEvent mock
├── helpers/
│   ├── index.ts                            # Barrel exports
│   ├── drag.ts                             # simulateDrag & simulateMarquee
│   ├── resize.ts                           # simulateResizeHandle
│   ├── keyboard.ts                         # simulateKeyboardShortcut
│   ├── gesture.ts                          # simulateMobileSwipe
│   ├── viewport.ts                         # setViewport helper
│   ├── matchers.ts                         # Custom Vitest matchers
│   └── test-utils.tsx                      # Render wrapper with store providers
├── fixtures/
│   ├── playlist.fixture.ts                 # Sample tracks fixture
│   ├── wallpapers.fixture.ts               # Wallpapers fixture
│   └── apps.fixture.ts                     # App manifests fixture
├── tier1-features/                         # Tier 1: 90 interaction tests (isolated)
│   ├── desktop.test.tsx                    # Test cases 1-7
│   ├── window-management.test.tsx          # Test cases 8-24
│   ├── dock.test.tsx                       # Test cases 25-36
│   ├── music-player.test.tsx               # Test cases 37-53
│   ├── cursor.test.tsx                     # Test cases 54-60
│   ├── kinetic-typography.test.tsx         # Test cases 61-68
│   ├── keyboard-shortcuts.test.tsx         # Test cases 69-74
│   ├── responsive-mobile.test.tsx          # Test cases 75-84
│   ├── audio-ducking.test.tsx              # Test cases 85-86
│   └── persistence.test.tsx                # Test cases 87-90
├── tier2-boundaries/                       # Tier 2: Boundary value analysis & negative testing
│   ├── window-bounds-clamping.test.tsx     # Min size 360x240, title bar clamp y>=28, 100px overhang
│   ├── rapid-interactions.test.tsx         # Rapid toggle, fast drag, double click race conditions
│   └── audio-interruption.test.tsx         # Context suspension, track load failures, seek beyond duration
├── tier3-cross-feature/                    # Tier 3: Pairwise system integration tests
│   ├── window-dock-minimize.test.tsx       # Minimize to dock + restore + active dots
│   ├── audio-window-ducking.test.tsx       # Music ducking to 20% on window open/close procedural sounds
│   └── ambient-mode-transitions.test.tsx   # Cmd+Option+M: window fade out + hero opacity 0.35->1.0
├── tier4-scenarios/                        # Tier 4: Real-world multi-step workflows
│   ├── desktop-workflow.test.tsx           # Full user session: open terminal, run command, play track, switch theme
│   └── responsive-workflow.test.tsx        # Viewport resize desktop -> mobile -> bottom sheet -> sticky audio bar
└── visual-conformance/                     # Automated visual rules validation (64 criteria)
    ├── core-chrome.test.tsx                # Visual rules 1-9
    ├── window-system.test.tsx              # Visual rules 10-23
    ├── dock.test.tsx                       # Visual rules 24-34
    ├── music-player.test.tsx               # Visual rules 35-45
    ├── kinetic-typography.test.tsx         # Visual rules 46-52
    ├── cursor.test.tsx                     # Visual rules 53-58
    └── theme-responsive.test.tsx           # Visual rules 59-64
```

---

## 7. Package Scripts & Execution Semantics

The following npm scripts define the execution contract in `package.json`:

```json
{
  "scripts": {
    "test": "vitest run --reporter=verbose",
    "test:watch": "vitest",
    "test:tier1": "vitest run tests/tier1-features",
    "test:tier2": "vitest run tests/tier2-boundaries",
    "test:tier3": "vitest run tests/tier3-cross-feature",
    "test:tier4": "vitest run tests/tier4-scenarios",
    "test:visual": "vitest run tests/visual-conformance",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 8. Verification & Performance Validation

| Requirement | Target | Verification Method |
|---|---|---|
| In-Memory Execution Speed | < 5.0s for full suite | Vitest threads pool, jsdom environment, zero network dependencies |
| Autoplay Compliance | 0 AudioContext on mount | AudioContext mock verifies state is 'suspended' until first user click |
| Audio Ducking Precision | Duck to 20% in 40ms, restore in 250ms | `MockAudioParam.getScheduledEvents()` and `toHaveDuckedVolume` matcher |
| Responsive Boundary | Immediate switch at 768px | `setViewport({ width: 767 })` and `ResizeObserverMock.triggerResize` |
| Clamping Bounds | $y \ge 28$, Overhang $\ge 100px$ | `toBeClampedWithinViewport` custom matcher |
| Glassmorphism Tokens | `blur(28px) saturate(180%)` | `toMatchGlassmorphism` custom matcher |
