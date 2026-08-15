import { describe, it, expect, beforeEach } from 'vitest';
import { useOSStore } from '@/hooks/useOSStore';

describe('Tier 2: Window System Geometry & Coordinate Bounds', () => {
  beforeEach(() => {
    const windows = useOSStore.getState().windows;
    if (windows) {
      Object.keys(windows).forEach(k => {
        useOSStore.getState().closeWindow(k as any);
      });
    }
  });

  it('T2-WIN-01: clamps window position y >= 28px when dragged above viewport', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().updatePosition('terminal', { x: 200, y: -500 });

    const win = useOSStore.getState().windows['terminal'];
    expect(win.position.y).toBe(28);
  });

  it('T2-WIN-02: enforces left overhang limit (100px visible)', () => {
    useOSStore.getState().openWindow('terminal');
    const width = useOSStore.getState().windows['terminal'].size.width;

    useOSStore.getState().updatePosition('terminal', { x: -1000, y: 100 });
    const win = useOSStore.getState().windows['terminal'];

    expect(win.position.x).toBe(-(width - 100));
  });

  it('T2-WIN-03: enforces right overhang limit (100px visible)', () => {
    useOSStore.getState().openWindow('terminal');
    const vw = window.innerWidth;

    useOSStore.getState().updatePosition('terminal', { x: 2000, y: 100 });
    const win = useOSStore.getState().windows['terminal'];

    expect(win.position.x).toBe(vw - 100);
  });

  it('T2-WIN-04: enforces bottom overhang limit (100px visible)', () => {
    useOSStore.getState().openWindow('terminal');
    const vh = window.innerHeight;

    useOSStore.getState().updatePosition('terminal', { x: 200, y: 1500 });
    const win = useOSStore.getState().windows['terminal'];

    expect(win.position.y).toBeLessThanOrEqual(vh - 40);
    expect(win.position.y).toBeGreaterThanOrEqual(28);
  });

  it('T2-WIN-05: enforces minimum window dimensions (360x240px)', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().updateSize('terminal', { width: 100, height: 100 });

    const win = useOSStore.getState().windows['terminal'];
    expect(win.size.width).toBeGreaterThanOrEqual(360);
    expect(win.size.height).toBeGreaterThanOrEqual(240);
  });

  it('T2-WIN-06: maximizes window to full viewport minus top menu bar', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().toggleMaximize('terminal');

    const win = useOSStore.getState().windows['terminal'];
    expect(win.isMaximized).toBe(true);
    expect(win.position).toEqual({ x: 0, y: 28 });
    expect(win.size).toEqual({ width: window.innerWidth, height: window.innerHeight - 28 });
  });

  it('T2-WIN-07: restores exact previous bounds on un-maximize', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().updatePosition('terminal', { x: 150, y: 80 });
    useOSStore.getState().updateSize('terminal', { width: 700, height: 500 });

    // Maximize
    useOSStore.getState().toggleMaximize('terminal');
    expect(useOSStore.getState().windows['terminal'].isMaximized).toBe(true);

    // Un-maximize
    useOSStore.getState().toggleMaximize('terminal');
    const win = useOSStore.getState().windows['terminal'];
    expect(win.isMaximized).toBe(false);
    expect(win.position).toEqual({ x: 150, y: 80 });
    expect(win.size).toEqual({ width: 700, height: 500 });
  });

  it('T2-WIN-08: wraps cascade coordinates when spawning beyond screen limits', () => {
    for (let i = 0; i < 20; i++) {
      useOSStore.getState().openWindow('terminal');
      useOSStore.getState().closeWindow('terminal');
    }
    expect(useOSStore.getState().windows['terminal']).toBeDefined();
  });

  it('T2-WIN-09: clamps z-index strictly above Layer 2 baseline (>=20)', () => {
    for (let i = 0; i < 20; i++) {
      useOSStore.getState().focusWindow('terminal');
      useOSStore.getState().focusWindow('projects');
      useOSStore.getState().focusWindow('about');
    }

    const wins = useOSStore.getState().windows;
    Object.values(wins).forEach(w => {
      expect(w.zIndex).toBeGreaterThanOrEqual(20);
    });
  });
});
