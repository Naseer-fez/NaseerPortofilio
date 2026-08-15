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
  if (query.includes('(min-width: 1024px)')) return config.width >= 1024;
  if (query.includes('(max-width: 1023px)')) return config.width < 1024;
  if (query.includes('(min-width: 768px)')) return config.width >= 768;
  if (query.includes('(max-width: 767px)') || query.includes('(max-width: 768px)')) return config.width < 768;
  if (query.includes('(min-width: 640px)')) return config.width >= 640;
  if (query.includes('(max-width: 639px)')) return config.width < 640;
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

  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: currentViewport.width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: currentViewport.height });

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
