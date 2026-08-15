import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useOSStore } from '@/hooks/useOSStore';
import { simulateKeyboardShortcut } from '../helpers/keyboard';

function ShortcutsHarness() {
  useKeyboardShortcuts();
  return <div data-testid="shortcuts-harness" />;
}

describe('Tier 1: Keyboard Shortcuts Registry', () => {
  beforeEach(() => {
    useOSStore.setState({
      spotlightOpen: false,
      theme: 'dark',
      desktopMode: 'workspace',
      activeWindowId: null,
    });
    const windows = useOSStore.getState().windows;
    Object.keys(windows).forEach(k => {
      useOSStore.getState().closeWindow(k as any);
    });
  });

  it('opens and focuses Spotlight search modal on Cmd+K (#69)', () => {
    render(<ShortcutsHarness />);

    expect(useOSStore.getState().spotlightOpen).toBe(false);
    simulateKeyboardShortcut('Cmd+K');
    expect(useOSStore.getState().spotlightOpen).toBe(true);
  });

  it('dismisses Spotlight search modal on Escape (#70)', () => {
    useOSStore.setState({ spotlightOpen: true });
    render(<ShortcutsHarness />);

    simulateKeyboardShortcut('Escape');
    expect(useOSStore.getState().spotlightOpen).toBe(false);
  });

  it('closes currently active window on Cmd+W (#71)', () => {
    useOSStore.getState().openWindow('terminal');
    render(<ShortcutsHarness />);

    expect(useOSStore.getState().windows['terminal'].isOpen).toBe(true);
    simulateKeyboardShortcut('Cmd+W');
    expect(useOSStore.getState().windows['terminal'].isOpen).toBe(false);
  });

  it('minimizes currently active window on Cmd+M (#72)', () => {
    useOSStore.getState().openWindow('finder');
    render(<ShortcutsHarness />);

    expect(useOSStore.getState().windows['finder'].isMinimized).toBe(false);
    simulateKeyboardShortcut('Cmd+M');
    expect(useOSStore.getState().windows['finder'].isMinimized).toBe(true);
  });

  it('toggles theme between dark and light on Cmd+Shift+D (#73)', () => {
    useOSStore.setState({ theme: 'dark' });
    render(<ShortcutsHarness />);

    simulateKeyboardShortcut('Cmd+Shift+D');
    expect(useOSStore.getState().theme).toBe('light');

    simulateKeyboardShortcut('Cmd+Shift+D');
    expect(useOSStore.getState().theme).toBe('dark');
  });

  it('toggles desktopMode between workspace and ambient-hero on Cmd+Option+M (#74)', () => {
    useOSStore.setState({ desktopMode: 'workspace' });
    render(<ShortcutsHarness />);

    simulateKeyboardShortcut('Cmd+Option+M');
    expect(useOSStore.getState().desktopMode).toBe('ambient-hero');

    simulateKeyboardShortcut('Cmd+Option+M');
    expect(useOSStore.getState().desktopMode).toBe('workspace');
  });
});
