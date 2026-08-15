import { describe, it, expect, beforeEach } from 'vitest';
import { useOSStore } from '@/hooks/useOSStore';
import { DEFAULT_APPS, INITIAL_WINDOWS } from '@/lib/constants/apps';

describe('useOSStore', () => {
  beforeEach(() => {
    // Deep clone initial windows to ensure clean slate
    const freshWindows = JSON.parse(JSON.stringify(INITIAL_WINDOWS));
    useOSStore.setState({
      windows: freshWindows,
      activeWindowId: null,
      baseZIndex: 20,
      maxZIndex: 25,
      desktopMode: 'workspace',
      theme: 'dark',
      wallpaperId: 'sonoma-dark',
      soundEnabled: true,
      soundVolume: 0.5,
      contextMenu: null,
      spotlightOpen: false,
      controlCenterOpen: false,
      selectedIconIds: [],
    });
  });

  it('should initialize with default apps registered and closed', () => {
    const state = useOSStore.getState();
    expect(state.windows).toBeDefined();
    DEFAULT_APPS.forEach((app) => {
      expect(state.windows[app.id]).toBeDefined();
      expect(state.windows[app.id].isOpen).toBe(false);
    });
    expect(state.activeWindowId).toBeNull();
    expect(state.desktopMode).toBe('workspace');
    expect(state.theme).toBe('dark');
  });

  it('should open a window, set isFocused, and elevate zIndex', () => {
    const { openWindow } = useOSStore.getState();
    openWindow('terminal');

    const state = useOSStore.getState();
    expect(state.windows.terminal.isOpen).toBe(true);
    expect(state.windows.terminal.isFocused).toBe(true);
    expect(state.windows.terminal.isMinimized).toBe(false);
    expect(state.activeWindowId).toBe('terminal');
    expect(state.windows.terminal.zIndex).toBeGreaterThanOrEqual(21);
  });

  it('should manage focus and z-index elevation across multiple opened windows', () => {
    const { openWindow } = useOSStore.getState();
    openWindow('terminal');
    openWindow('projects');

    let state = useOSStore.getState();
    expect(state.activeWindowId).toBe('projects');
    expect(state.windows.projects.isFocused).toBe(true);
    expect(state.windows.terminal.isFocused).toBe(false);
    expect(state.windows.projects.zIndex).toBeGreaterThan(state.windows.terminal.zIndex);

    // Refocus terminal
    useOSStore.getState().focusWindow('terminal');
    state = useOSStore.getState();
    expect(state.activeWindowId).toBe('terminal');
    expect(state.windows.terminal.isFocused).toBe(true);
    expect(state.windows.projects.isFocused).toBe(false);
    expect(state.windows.terminal.zIndex).toBeGreaterThan(state.windows.projects.zIndex);
  });

  it('should delegate active window focus to next topmost open window on close', () => {
    const { openWindow, closeWindow } = useOSStore.getState();
    openWindow('finder');
    openWindow('terminal');
    openWindow('projects');

    // Currently projects is topmost
    expect(useOSStore.getState().activeWindowId).toBe('projects');

    // Close projects -> should focus terminal
    closeWindow('projects');
    let state = useOSStore.getState();
    expect(state.windows.projects.isOpen).toBe(false);
    expect(state.activeWindowId).toBe('terminal');
    expect(state.windows.terminal.isFocused).toBe(true);

    // Close terminal -> should focus finder
    closeWindow('terminal');
    state = useOSStore.getState();
    expect(state.activeWindowId).toBe('finder');
    expect(state.windows.finder.isFocused).toBe(true);

    // Close finder -> activeWindowId should be null
    closeWindow('finder');
    state = useOSStore.getState();
    expect(state.activeWindowId).toBeNull();
  });

  it('should minimize window and delegate active focus', () => {
    const { openWindow, minimizeWindow } = useOSStore.getState();
    openWindow('finder');
    openWindow('terminal');

    minimizeWindow('terminal');
    const state = useOSStore.getState();
    expect(state.windows.terminal.isMinimized).toBe(true);
    expect(state.windows.terminal.isFocused).toBe(false);
    expect(state.activeWindowId).toBe('finder');
    expect(state.windows.finder.isFocused).toBe(true);
  });

  it('should toggle maximize and properly save/restore prevBounds', () => {
    const { openWindow, toggleMaximize } = useOSStore.getState();
    openWindow('terminal');

    const originalPos = { ...useOSStore.getState().windows.terminal.position };
    const originalSize = { ...useOSStore.getState().windows.terminal.size };

    // Maximize
    toggleMaximize('terminal');
    let state = useOSStore.getState();
    expect(state.windows.terminal.isMaximized).toBe(true);
    expect(state.windows.terminal.position.y).toBe(28); // MENU_BAR_HEIGHT
    expect(state.windows.terminal.prevBounds).toEqual({
      x: originalPos.x,
      y: originalPos.y,
      width: originalSize.width,
      height: originalSize.height,
    });

    // Restore
    toggleMaximize('terminal');
    state = useOSStore.getState();
    expect(state.windows.terminal.isMaximized).toBe(false);
    expect(state.windows.terminal.position).toEqual(originalPos);
    expect(state.windows.terminal.size).toEqual(originalSize);
    expect(state.windows.terminal.prevBounds).toBeUndefined();
  });

  it('should clamp position during window dragging according to macOS rules', () => {
    const { openWindow, updatePosition } = useOSStore.getState();
    openWindow('terminal');

    // Try moving above menubar (y < 28)
    updatePosition('terminal', { x: 100, y: -50 });
    let state = useOSStore.getState();
    expect(state.windows.terminal.position.y).toBe(28);

    // Try moving too far left
    updatePosition('terminal', { x: -1000, y: 100 });
    state = useOSStore.getState();
    expect(state.windows.terminal.position.x).toBeGreaterThan(-1000);
  });

  it('should enforce minSize during window resizing', () => {
    const { openWindow, updateSize } = useOSStore.getState();
    openWindow('terminal');
    const minSize = useOSStore.getState().windows.terminal.minSize;

    updateSize('terminal', { width: 100, height: 100 });
    const state = useOSStore.getState();
    expect(state.windows.terminal.size.width).toBe(minSize.width);
    expect(state.windows.terminal.size.height).toBe(minSize.height);
  });

  it('should toggle and set desktop mode and theme', () => {
    const { toggleDesktopMode, setDesktopMode, toggleTheme, setTheme, setWallpaper } =
      useOSStore.getState();

    toggleDesktopMode();
    expect(useOSStore.getState().desktopMode).toBe('ambient-hero');

    setDesktopMode('workspace');
    expect(useOSStore.getState().desktopMode).toBe('workspace');

    toggleTheme();
    expect(useOSStore.getState().theme).toBe('light');

    setTheme('dark');
    expect(useOSStore.getState().theme).toBe('dark');

    setWallpaper('sequoia-dark');
    expect(useOSStore.getState().wallpaperId).toBe('sequoia-dark');
  });

  it('should manage sound, context menus, modals, and icon selections', () => {
    const {
      setSoundEnabled,
      setSoundVolume,
      setContextMenu,
      closeContextMenu,
      toggleSpotlight,
      toggleControlCenter,
      selectIcon,
      clearSelectedIcons,
    } = useOSStore.getState();

    setSoundEnabled(false);
    expect(useOSStore.getState().soundEnabled).toBe(false);

    setSoundVolume(1.5); // should clamp to 1
    expect(useOSStore.getState().soundVolume).toBe(1);

    setContextMenu({ x: 100, y: 100, items: [{ id: 'test', label: 'Test' }] });
    expect(useOSStore.getState().contextMenu).not.toBeNull();

    closeContextMenu();
    expect(useOSStore.getState().contextMenu).toBeNull();

    toggleSpotlight();
    expect(useOSStore.getState().spotlightOpen).toBe(true);

    toggleControlCenter();
    expect(useOSStore.getState().controlCenterOpen).toBe(true);

    selectIcon('terminal');
    expect(useOSStore.getState().selectedIconIds).toEqual(['terminal']);

    selectIcon('finder', true); // multiSelect
    expect(useOSStore.getState().selectedIconIds).toEqual(['terminal', 'finder']);

    clearSelectedIcons();
    expect(useOSStore.getState().selectedIconIds).toEqual([]);
  });
});
