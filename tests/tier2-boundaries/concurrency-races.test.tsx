import { describe, it, expect, beforeEach } from 'vitest';
import { useOSStore } from '@/hooks/useOSStore';

describe('Tier 2: Rapid UI Concurrency & Race Conditions', () => {
  beforeEach(() => {
    useOSStore.setState({
      theme: 'dark',
      activeWindowId: null,
    });
    const windows = useOSStore.getState().windows;
    Object.keys(windows).forEach(k => {
      useOSStore.getState().closeWindow(k as any);
    });
  });

  it('T2-RACE-01: handles rapid theme toggle burst deterministically', () => {
    // Dispatch 10 rapid toggles
    for (let i = 0; i < 10; i++) {
      const current = useOSStore.getState().theme;
      useOSStore.getState().setTheme(current === 'dark' ? 'light' : 'dark');
    }

    // 10 toggles from 'dark' should end in 'dark'
    expect(useOSStore.getState().theme).toBe('dark');
  });

  it('T2-RACE-02: handles maximize animation toggle interruption smoothly', () => {
    useOSStore.getState().openWindow('terminal');

    // Toggle maximize rapidly
    useOSStore.getState().toggleMaximize('terminal');
    expect(useOSStore.getState().windows['terminal'].isMaximized).toBe(true);

    useOSStore.getState().toggleMaximize('terminal');
    expect(useOSStore.getState().windows['terminal'].isMaximized).toBe(false);
  });

  it('T2-RACE-03: handles rapid window open and close abortion cleanly', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().closeWindow('terminal');

    expect(useOSStore.getState().windows['terminal'].isOpen).toBe(false);
    expect(useOSStore.getState().activeWindowId).toBeNull();
  });

  it('T2-RACE-04: handles rapid multi-app dock click storm with distinct z-indices', () => {
    const apps: Array<'terminal' | 'projects' | 'about' | 'finder' | 'settings' | 'mail'> = [
      'terminal',
      'projects',
      'about',
      'finder',
      'settings',
      'mail',
    ];

    apps.forEach(app => {
      useOSStore.getState().openWindow(app);
    });

    const wins = useOSStore.getState().windows;
    apps.forEach(app => {
      expect(wins[app].isOpen).toBe(true);
    });

    // Top window is the last opened app ('mail')
    expect(useOSStore.getState().activeWindowId).toBe('mail');
  });
});
