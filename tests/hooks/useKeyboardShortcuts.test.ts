import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useOSStore } from '@/hooks/useOSStore';
import { INITIAL_WINDOWS } from '@/lib/constants/apps';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    useOSStore.setState({
      windows: JSON.parse(JSON.stringify(INITIAL_WINDOWS)),
      activeWindowId: null,
      spotlightOpen: false,
      controlCenterOpen: false,
      contextMenu: null,
      theme: 'dark',
      desktopMode: 'workspace',
    });
  });

  it('should toggle spotlight on Cmd/Ctrl+K even inside input', () => {
    renderHook(() => useKeyboardShortcuts());

    // Trigger Cmd+K
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(useOSStore.getState().spotlightOpen).toBe(true);
  });

  it('should close active window on Cmd/Ctrl+W', () => {
    useOSStore.getState().openWindow('terminal');
    expect(useOSStore.getState().activeWindowId).toBe('terminal');

    renderHook(() => useKeyboardShortcuts());

    const event = new KeyboardEvent('keydown', {
      key: 'w',
      ctrlKey: true,
      bubbles: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(useOSStore.getState().windows.terminal.isOpen).toBe(false);
  });

  it('should NOT close active window on Cmd/Ctrl+W when focus is inside an input', () => {
    useOSStore.getState().openWindow('terminal');

    renderHook(() => useKeyboardShortcuts());

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'w',
      ctrlKey: true,
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: input, enumerable: true });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);
    document.body.removeChild(input);
  });

  it('should minimize active window on Cmd/Ctrl+M', () => {
    useOSStore.getState().openWindow('terminal');

    renderHook(() => useKeyboardShortcuts());

    const event = new KeyboardEvent('keydown', {
      key: 'm',
      ctrlKey: true,
      bubbles: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(useOSStore.getState().windows.terminal.isMinimized).toBe(true);
  });

  it('should toggle theme on Cmd/Ctrl+Shift+D', () => {
    renderHook(() => useKeyboardShortcuts());
    expect(useOSStore.getState().theme).toBe('dark');

    const event = new KeyboardEvent('keydown', {
      key: 'd',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(useOSStore.getState().theme).toBe('light');
  });

  it('should toggle desktop mode on Cmd/Ctrl+Option+M', () => {
    renderHook(() => useKeyboardShortcuts());
    expect(useOSStore.getState().desktopMode).toBe('workspace');

    const event = new KeyboardEvent('keydown', {
      key: 'm',
      ctrlKey: true,
      altKey: true,
      bubbles: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(useOSStore.getState().desktopMode).toBe('ambient-hero');
  });

  it('should open terminal on Cmd/Ctrl+Option+T', () => {
    renderHook(() => useKeyboardShortcuts());

    const event = new KeyboardEvent('keydown', {
      key: 't',
      ctrlKey: true,
      altKey: true,
      bubbles: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);
    expect(useOSStore.getState().activeWindowId).toBe('terminal');
  });

  it('should dismiss context menu, spotlight, and control center on Escape', () => {
    renderHook(() => useKeyboardShortcuts());

    // 1. ContextMenu
    act(() => {
      useOSStore.getState().setContextMenu({ x: 10, y: 10, items: [] });
    });
    expect(useOSStore.getState().contextMenu).not.toBeNull();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(useOSStore.getState().contextMenu).toBeNull();

    // 2. Spotlight
    act(() => {
      useOSStore.getState().setSpotlightOpen(true);
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(useOSStore.getState().spotlightOpen).toBe(false);

    // 3. Control Center
    act(() => {
      useOSStore.getState().setControlCenterOpen(true);
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(useOSStore.getState().controlCenterOpen).toBe(false);
  });
});
