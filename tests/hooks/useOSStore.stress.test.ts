import { describe, it, expect, beforeEach } from 'vitest';
import { useOSStore } from '@/hooks/useOSStore';
import { DEFAULT_APPS, INITIAL_WINDOWS } from '@/lib/constants/apps';
import { AppWindow } from '@/types/os';

describe('Adversarial Stress Harness: useOSStore Window Management', () => {
  const APP_IDS = DEFAULT_APPS.map((a) => a.id);

  const resetStore = () => {
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
  };

  beforeEach(() => {
    resetStore();
  });

  // Helper invariant checker for valid OS state
  const verifyStoreInvariants = (label: string) => {
    const state = useOSStore.getState();
    const windows = Object.values(state.windows);
    const focusedWindows = windows.filter((w) => w.isFocused);

    // Invariant 1: At most one window is focused
    expect(
      focusedWindows.length,
      `[${label}] Invariant 1 failed: Multiple focused windows found (${focusedWindows.map((w) => w.id).join(', ')})`
    ).toBeLessThanOrEqual(1);

    // Invariant 2: If activeWindowId is non-null, it must correspond to an open, non-minimized, focused window
    if (state.activeWindowId !== null) {
      const activeWin = state.windows[state.activeWindowId];
      expect(
        activeWin,
        `[${label}] Invariant 2 failed: activeWindowId '${state.activeWindowId}' does not exist in windows`
      ).toBeDefined();
      expect(
        activeWin.isOpen,
        `[${label}] Invariant 2 failed: activeWindowId '${state.activeWindowId}' is not open`
      ).toBe(true);
      expect(
        activeWin.isMinimized,
        `[${label}] Invariant 2 failed: activeWindowId '${state.activeWindowId}' is minimized`
      ).toBe(false);
      expect(
        activeWin.isFocused,
        `[${label}] Invariant 2 failed: activeWindowId '${state.activeWindowId}' is not focused`
      ).toBe(true);
      expect(
        focusedWindows[0]?.id,
        `[${label}] Invariant 2 failed: focused window does not match activeWindowId`
      ).toBe(state.activeWindowId);
    } else {
      // Invariant 3: If activeWindowId is null, no window should be focused
      expect(
        focusedWindows.length,
        `[${label}] Invariant 3 failed: activeWindowId is null but window '${focusedWindows[0]?.id}' is focused`
      ).toBe(0);
      const openUnminimized = windows.filter((w) => w.isOpen && !w.isMinimized);
      expect(
        openUnminimized.length,
        `[${label}] Invariant 3 failed: activeWindowId is null but open unminimized windows exist (${openUnminimized.map((w) => w.id).join(', ')})`
      ).toBe(0);
    }

    // Invariant 4: All zIndices must stay within [20, 49]
    windows.forEach((w) => {
      expect(
        w.zIndex,
        `[${label}] Invariant 4 failed: Window '${w.id}' zIndex ${w.zIndex} out of bounds [20, 49]`
      ).toBeGreaterThanOrEqual(20);
      expect(
        w.zIndex,
        `[${label}] Invariant 4 failed: Window '${w.id}' zIndex ${w.zIndex} exceeds max bound 49`
      ).toBeLessThanOrEqual(49);
    });

    // Invariant 5: MaxZIndex in store state must match or exceed all window zIndices
    expect(state.maxZIndex).toBeLessThanOrEqual(49);
    expect(state.maxZIndex).toBeGreaterThanOrEqual(20);

    // Invariant 6: Closed windows must not be focused
    windows
      .filter((w) => !w.isOpen)
      .forEach((w) => {
        expect(w.isFocused, `[${label}] Invariant 6 failed: Closed window '${w.id}' is marked focused`).toBe(false);
      });

    // Invariant 7: Minimized windows must not be focused
    windows
      .filter((w) => w.isMinimized)
      .forEach((w) => {
        expect(w.isFocused, `[${label}] Invariant 7 failed: Minimized window '${w.id}' is marked focused`).toBe(false);
      });
  };

  /* ========================================================================== */
  /* TASK 1: Rapid Consecutive Window Open/Close Cycles Across All 6 Apps       */
  /* ========================================================================== */
  describe('Task 1: Rapid Consecutive Window Open/Close Cycles Across All 6 Apps', () => {
    it('handles sequential opening and reverse closing across all 6 default apps', () => {
      // 1. Open all 6 apps sequentially
      APP_IDS.forEach((id, idx) => {
        useOSStore.getState().openWindow(id);
        verifyStoreInvariants(`Sequential Open ${id} (step ${idx})`);
        expect(useOSStore.getState().activeWindowId).toBe(id);
      });

      // Verify all 6 apps are open and active is last opened app ('mail')
      const stateAfterOpens = useOSStore.getState();
      APP_IDS.forEach((id) => {
        expect(stateAfterOpens.windows[id].isOpen).toBe(true);
      });
      expect(stateAfterOpens.activeWindowId).toBe(APP_IDS[APP_IDS.length - 1]);

      // 2. Close all 6 apps in reverse order
      const reversed = [...APP_IDS].reverse();
      reversed.forEach((id, idx) => {
        useOSStore.getState().closeWindow(id);
        verifyStoreInvariants(`Sequential Close Reverse ${id} (step ${idx})`);
      });

      expect(useOSStore.getState().activeWindowId).toBeNull();
    });

    it('handles rapid interleaved open/close cycles across all 6 apps (500 iterations)', () => {
      let seed = 12345;
      const pseudoRandom = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      for (let i = 0; i < 500; i++) {
        const app = APP_IDS[Math.floor(pseudoRandom() * APP_IDS.length)];
        const isCurrentlyOpen = useOSStore.getState().windows[app]?.isOpen;

        if (isCurrentlyOpen && pseudoRandom() > 0.4) {
          useOSStore.getState().closeWindow(app);
        } else {
          useOSStore.getState().openWindow(app);
        }

        verifyStoreInvariants(`Interleaved Cycle #${i} (target: ${app})`);
      }
    });

    it('handles rapid burst opening all 6 apps in 10 different permutations', () => {
      const permutations = [
        ['terminal', 'projects', 'about', 'finder', 'settings', 'mail'],
        ['mail', 'settings', 'finder', 'about', 'projects', 'terminal'],
        ['about', 'finder', 'mail', 'terminal', 'projects', 'settings'],
        ['settings', 'about', 'terminal', 'mail', 'finder', 'projects'],
        ['projects', 'mail', 'terminal', 'settings', 'about', 'finder'],
        ['finder', 'terminal', 'settings', 'projects', 'mail', 'about'],
        ['terminal', 'mail', 'finder', 'about', 'settings', 'projects'],
        ['projects', 'finder', 'about', 'terminal', 'mail', 'settings'],
        ['mail', 'about', 'projects', 'settings', 'finder', 'terminal'],
        ['settings', 'finder', 'mail', 'projects', 'about', 'terminal'],
      ];

      permutations.forEach((perm, pIdx) => {
        // Open in perm order
        perm.forEach((app) => useOSStore.getState().openWindow(app));
        verifyStoreInvariants(`Permutation ${pIdx} - opened all`);
        expect(useOSStore.getState().activeWindowId).toBe(perm[perm.length - 1]);

        // Close in reverse perm order
        [...perm].reverse().forEach((app) => useOSStore.getState().closeWindow(app));
        verifyStoreInvariants(`Permutation ${pIdx} - closed all`);
        expect(useOSStore.getState().activeWindowId).toBeNull();
      });
    });

    it('handles rapid consecutive duplicate open/close calls idempotently', () => {
      for (let i = 0; i < 10; i++) {
        useOSStore.getState().openWindow('terminal');
      }
      expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);
      expect(useOSStore.getState().activeWindowId).toBe('terminal');
      verifyStoreInvariants('10x duplicate open');

      for (let i = 0; i < 10; i++) {
        useOSStore.getState().closeWindow('terminal');
      }
      expect(useOSStore.getState().windows.terminal.isOpen).toBe(false);
      expect(useOSStore.getState().activeWindowId).toBeNull();
      verifyStoreInvariants('10x duplicate close');
    });
  });

  /* ========================================================================== */
  /* TASK 2: zIndex Overflow and Compaction [20..49] & Relative Order           */
  /* ========================================================================== */
  describe('Task 2: zIndex Overflow and Compaction Algorithm', () => {
    it('spawns/focuses windows repeatedly until zIndex reaches 49, verifying compaction to [20..49]', () => {
      // Open all 6 windows
      APP_IDS.forEach((id) => useOSStore.getState().openWindow(id));

      // Repeatedly focus windows to drive maxZIndex beyond 49
      for (let i = 0; i < 60; i++) {
        const app = APP_IDS[i % APP_IDS.length];
        useOSStore.getState().focusWindow(app);
        verifyStoreInvariants(`Compaction Drive #${i} (${app})`);
      }

      const finalState = useOSStore.getState();
      expect(finalState.maxZIndex).toBeLessThanOrEqual(49);
      expect(finalState.maxZIndex).toBeGreaterThanOrEqual(20);

      // All windows must have zIndex in [20, 49]
      Object.values(finalState.windows).forEach((w) => {
        expect(w.zIndex).toBeGreaterThanOrEqual(20);
        expect(w.zIndex).toBeLessThanOrEqual(49);
      });
    });

    it('strictly maintains relative visual stacking order of background windows during compaction', () => {
      // Open 4 windows: terminal, projects, finder, about
      const testApps = ['terminal', 'projects', 'finder', 'about'];
      testApps.forEach((id) => useOSStore.getState().openWindow(id));

      // Force explicit stacking order: terminal (21) < projects (22) < finder (23) < about (24)
      useOSStore.getState().focusWindow('terminal');
      useOSStore.getState().focusWindow('projects');
      useOSStore.getState().focusWindow('finder');
      useOSStore.getState().focusWindow('about');

      // Now rapidly toggle focus between finder and about 80 times to trigger compaction multiple times
      // Notice: terminal and projects are NOT touched during this time
      for (let i = 0; i < 80; i++) {
        const target = i % 2 === 0 ? 'finder' : 'about';
        useOSStore.getState().focusWindow(target);
      }

      const finalState = useOSStore.getState();
      const zTerminal = finalState.windows.terminal.zIndex;
      const zProjects = finalState.windows.projects.zIndex;

      // Invariant: Terminal was below Projects before compaction; it must remain below Projects after compaction
      expect(zTerminal).toBeLessThan(zProjects);

      // Both background windows must be strictly below the cycling windows
      expect(zProjects).toBeLessThan(finalState.windows.finder.zIndex);
      expect(zProjects).toBeLessThan(finalState.windows.about.zIndex);
    });

    it('survives 1,000 rapid focus cycles without zIndex leakage or state corruption', () => {
      APP_IDS.forEach((id) => useOSStore.getState().openWindow(id));

      for (let i = 0; i < 1000; i++) {
        const app = APP_IDS[i % APP_IDS.length];
        useOSStore.getState().focusWindow(app);
      }

      const state = useOSStore.getState();
      expect(state.maxZIndex).toBeLessThanOrEqual(49);
      expect(state.maxZIndex).toBeGreaterThanOrEqual(20);
      verifyStoreInvariants('1000 Focus Cycles Completed');
    });

    it('handles compaction at boundary maxZIndex = 49 when opening closed window', () => {
      // Artificially simulate store near upper zIndex bound
      useOSStore.setState({ maxZIndex: 49 });

      // Open an app
      useOSStore.getState().openWindow('settings');
      verifyStoreInvariants('Open window at maxZIndex = 49');
      expect(useOSStore.getState().windows.settings.zIndex).toBeLessThanOrEqual(49);
      expect(useOSStore.getState().windows.settings.zIndex).toBeGreaterThanOrEqual(20);
      expect(useOSStore.getState().maxZIndex).toBeLessThanOrEqual(49);
    });
  });

  /* ========================================================================== */
  /* TASK 3: Focus Delegation Across 5-Window Cascade Chains                    */
  /* ========================================================================== */
  describe('Task 3: Focus Delegation & Stacking Chains', () => {
    it('delegates focus down the 5-window chain as active windows are progressively closed', () => {
      const cascade = ['terminal', 'projects', 'about', 'finder', 'mail'];

      // Open all 5 windows in order
      cascade.forEach((id) => useOSStore.getState().openWindow(id));
      expect(useOSStore.getState().activeWindowId).toBe('mail');

      // Close mail (5) -> delegating focus to finder (4)
      useOSStore.getState().closeWindow('mail');
      expect(useOSStore.getState().activeWindowId).toBe('finder');
      expect(useOSStore.getState().windows.finder.isFocused).toBe(true);

      // Close finder (4) -> delegating focus to about (3)
      useOSStore.getState().closeWindow('finder');
      expect(useOSStore.getState().activeWindowId).toBe('about');
      expect(useOSStore.getState().windows.about.isFocused).toBe(true);

      // Close about (3) -> delegating focus to projects (2)
      useOSStore.getState().closeWindow('about');
      expect(useOSStore.getState().activeWindowId).toBe('projects');
      expect(useOSStore.getState().windows.projects.isFocused).toBe(true);

      // Close projects (2) -> delegating focus to terminal (1)
      useOSStore.getState().closeWindow('projects');
      expect(useOSStore.getState().activeWindowId).toBe('terminal');
      expect(useOSStore.getState().windows.terminal.isFocused).toBe(true);

      // Close terminal (1) -> activeWindowId becomes null
      useOSStore.getState().closeWindow('terminal');
      expect(useOSStore.getState().activeWindowId).toBeNull();
      verifyStoreInvariants('All 5 windows closed in cascade');
    });

    it('delegates focus down the 5-window chain as active windows are progressively minimized', () => {
      const cascade = ['terminal', 'projects', 'about', 'finder', 'mail'];
      cascade.forEach((id) => useOSStore.getState().openWindow(id));
      expect(useOSStore.getState().activeWindowId).toBe('mail');

      // Minimize mail -> delegates to finder
      useOSStore.getState().minimizeWindow('mail');
      expect(useOSStore.getState().activeWindowId).toBe('finder');
      expect(useOSStore.getState().windows.finder.isFocused).toBe(true);
      expect(useOSStore.getState().windows.mail.isMinimized).toBe(true);

      // Minimize finder -> delegates to about
      useOSStore.getState().minimizeWindow('finder');
      expect(useOSStore.getState().activeWindowId).toBe('about');
      expect(useOSStore.getState().windows.about.isFocused).toBe(true);

      // Minimize about -> delegates to projects
      useOSStore.getState().minimizeWindow('about');
      expect(useOSStore.getState().activeWindowId).toBe('projects');
      expect(useOSStore.getState().windows.projects.isFocused).toBe(true);

      // Minimize projects -> delegates to terminal
      useOSStore.getState().minimizeWindow('projects');
      expect(useOSStore.getState().activeWindowId).toBe('terminal');
      expect(useOSStore.getState().windows.terminal.isFocused).toBe(true);

      // Minimize terminal -> activeWindowId becomes null
      useOSStore.getState().minimizeWindow('terminal');
      expect(useOSStore.getState().activeWindowId).toBeNull();
      verifyStoreInvariants('All 5 windows minimized');
    });

    it('delegates focus skipping already-minimized windows', () => {
      const { openWindow, minimizeWindow, closeWindow } = useOSStore.getState();

      openWindow('terminal');
      openWindow('projects');
      openWindow('about');
      openWindow('finder');

      // Minimize 'about' (3rd in stack)
      minimizeWindow('about');
      expect(useOSStore.getState().activeWindowId).toBe('finder');

      // Close active window 'finder' -> next highest unminimized is 'projects' (skipping minimized 'about')
      closeWindow('finder');
      expect(useOSStore.getState().activeWindowId).toBe('projects');
      expect(useOSStore.getState().windows.projects.isFocused).toBe(true);
      expect(useOSStore.getState().windows.about.isMinimized).toBe(true);
      expect(useOSStore.getState().windows.about.isFocused).toBe(false);
    });

    it('restores minimized window and promotes it to active focus immediately', () => {
      const { openWindow, minimizeWindow, restoreWindow } = useOSStore.getState();

      openWindow('terminal');
      openWindow('projects');

      minimizeWindow('projects');
      expect(useOSStore.getState().activeWindowId).toBe('terminal');

      // Restore projects
      restoreWindow('projects');
      const state = useOSStore.getState();
      expect(state.windows.projects.isOpen).toBe(true);
      expect(state.windows.projects.isMinimized).toBe(false);
      expect(state.windows.projects.isFocused).toBe(true);
      expect(state.activeWindowId).toBe('projects');
      expect(state.windows.terminal.isFocused).toBe(false);
    });

    it('closing or minimizing a background (unfocused) window does not disrupt active window focus', () => {
      const { openWindow, minimizeWindow, closeWindow } = useOSStore.getState();

      openWindow('terminal');
      openWindow('projects');
      openWindow('finder'); // active is finder

      // Close background terminal
      closeWindow('terminal');
      expect(useOSStore.getState().activeWindowId).toBe('finder');
      expect(useOSStore.getState().windows.finder.isFocused).toBe(true);

      // Minimize background projects
      minimizeWindow('projects');
      expect(useOSStore.getState().activeWindowId).toBe('finder');
      expect(useOSStore.getState().windows.finder.isFocused).toBe(true);
      verifyStoreInvariants('Background mutations do not disturb active window');
    });
  });

  /* ========================================================================== */
  /* TASK 4: Window Drag Clamping & Geometric Boundaries                       */
  /* ========================================================================== */
  describe('Task 4: Window Drag Clamping & Geometric Boundaries', () => {
    it('clamps y strictly >= 28 (MENU_BAR_HEIGHT) under extreme negative coordinates', () => {
      useOSStore.getState().openWindow('terminal');

      const extremeNegativeY = [-1, -27, -28, -50, -1000, -999999];
      extremeNegativeY.forEach((testY) => {
        useOSStore.getState().updatePosition('terminal', { x: 200, y: testY });
        const pos = useOSStore.getState().windows.terminal.position;
        expect(pos.y, `Failed clamping y for test input ${testY}`).toBe(28);
      });
    });

    it('enforces 100px minimum overhang bounds on left and right viewport edges', () => {
      useOSStore.getState().openWindow('terminal');
      const winWidth = useOSStore.getState().windows.terminal.size.width; // 640
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;

      // Extreme left: x = -999999 -> clamped to -(width - 100)
      useOSStore.getState().updatePosition('terminal', { x: -999999, y: 100 });
      let pos = useOSStore.getState().windows.terminal.position;
      expect(pos.x).toBe(-(winWidth - 100)); // -540

      // Extreme right: x = 999999 -> clamped to vw - 100
      useOSStore.getState().updatePosition('terminal', { x: 999999, y: 100 });
      pos = useOSStore.getState().windows.terminal.position;
      expect(pos.x).toBe(vw - 100); // 1340
    });

    it('clamps bottom drag so at least 40px of window header stays reachable in viewport', () => {
      useOSStore.getState().openWindow('terminal');
      const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

      useOSStore.getState().updatePosition('terminal', { x: 200, y: 999999 });
      const pos = useOSStore.getState().windows.terminal.position;
      expect(pos.y).toBe(vh - 40); // 860
    });

    it('enforces minSize constraints across all 6 default apps during resize', () => {
      DEFAULT_APPS.forEach((appMeta) => {
        useOSStore.getState().openWindow(appMeta.id);
        useOSStore.getState().updateSize(appMeta.id, { width: 10, height: 10 });

        const win = useOSStore.getState().windows[appMeta.id];
        const expectedMinWidth = appMeta.minSize?.width ?? 360;
        const expectedMinHeight = appMeta.minSize?.height ?? 240;

        expect(
          win.size.width,
          `App ${appMeta.id} width failed minSize clamp (${win.size.width} < ${expectedMinWidth})`
        ).toBeGreaterThanOrEqual(expectedMinWidth);

        expect(
          win.size.height,
          `App ${appMeta.id} height failed minSize clamp (${win.size.height} < ${expectedMinHeight})`
        ).toBeGreaterThanOrEqual(expectedMinHeight);
      });
    });

    it('un-maximizes window automatically when updatePosition or updateSize is invoked', () => {
      useOSStore.getState().openWindow('terminal');
      useOSStore.getState().toggleMaximize('terminal');
      expect(useOSStore.getState().windows.terminal.isMaximized).toBe(true);

      // Dragging maximized window clears isMaximized
      useOSStore.getState().updatePosition('terminal', { x: 150, y: 120 });
      expect(useOSStore.getState().windows.terminal.isMaximized).toBe(false);

      // Re-maximize and resize -> clears isMaximized
      useOSStore.getState().toggleMaximize('terminal');
      expect(useOSStore.getState().windows.terminal.isMaximized).toBe(true);

      useOSStore.getState().updateSize('terminal', { width: 700, height: 500 });
      expect(useOSStore.getState().windows.terminal.isMaximized).toBe(false);
    });

    it('maximizes to full viewport minus 28px and restores exact prevBounds on toggle', () => {
      useOSStore.getState().openWindow('terminal');
      useOSStore.getState().updatePosition('terminal', { x: 180, y: 110 });
      useOSStore.getState().updateSize('terminal', { width: 680, height: 440 });

      // Maximize
      useOSStore.getState().toggleMaximize('terminal');
      let win = useOSStore.getState().windows.terminal;
      expect(win.isMaximized).toBe(true);
      expect(win.position).toEqual({ x: 0, y: 28 });
      expect(win.size).toEqual({
        width: typeof window !== 'undefined' ? window.innerWidth : 1440,
        height: (typeof window !== 'undefined' ? window.innerHeight : 900) - 28,
      });

      // Restore
      useOSStore.getState().toggleMaximize('terminal');
      win = useOSStore.getState().windows.terminal;
      expect(win.isMaximized).toBe(false);
      expect(win.position).toEqual({ x: 180, y: 110 });
      expect(win.size).toEqual({ width: 680, height: 440 });
      expect(win.prevBounds).toBeUndefined();
    });
  });

  /* ========================================================================== */
  /* TASK 5: LocalStorage Persistence & Corrupted State Resilience             */
  /* ========================================================================== */
  describe('Task 5: LocalStorage Persistence & Fault Tolerance', () => {
    it('clamps soundVolume strictly to [0, 1] range on invalid or extreme inputs', () => {
      const { setSoundVolume } = useOSStore.getState();

      setSoundVolume(-100);
      expect(useOSStore.getState().soundVolume).toBe(0);

      setSoundVolume(999);
      expect(useOSStore.getState().soundVolume).toBe(1);

      setSoundVolume(0.42);
      expect(useOSStore.getState().soundVolume).toBe(0.42);
    });

    it('recovers gracefully from corrupted JSON stored in localStorage', () => {
      const storageKey = 'macos-portfolio-os-state';

      // Inject corrupted JSON
      window.localStorage.setItem(storageKey, '{"state":{"theme":"invalid-json...broken');

      // Re-invoking store actions should operate cleanly without throwing unhandled parse exceptions
      expect(() => {
        useOSStore.getState().setTheme('light');
      }).not.toThrow();

      expect(useOSStore.getState().theme).toBe('light');
    });

    it('persists and updates os-theme and os-wallpaper keys in localStorage', () => {
      useOSStore.getState().setTheme('light');
      expect(window.localStorage.getItem('os-theme')).toBe('light');

      useOSStore.getState().setWallpaper('ventura-dark');
      expect(window.localStorage.getItem('os-wallpaper')).toBe('ventura-dark');
    });
  });

  /* ========================================================================== */
  /* BUG DETECTION & ADVERSARIAL FINDINGS                                      */
  /* ========================================================================== */
  describe('Empirical Bug Verification & State Machine Corner Cases', () => {
    it('BUG-M1-01: toggleMaximize on a minimized window creates illegal dual isMinimized+isFocused state', () => {
      const { openWindow, minimizeWindow, toggleMaximize } = useOSStore.getState();

      // Open finder and minimize it
      openWindow('finder');
      minimizeWindow('finder');

      expect(useOSStore.getState().windows.finder.isMinimized).toBe(true);
      expect(useOSStore.getState().windows.finder.isOpen).toBe(true);
      expect(useOSStore.getState().activeWindowId).toBeNull();

      // Now call toggleMaximize on the minimized window
      toggleMaximize('finder');

      const finderState = useOSStore.getState().windows.finder;
      const activeId = useOSStore.getState().activeWindowId;

      // EMPIRICAL OBSERVATION:
      // toggleMaximize sets activeWindowId: 'finder', isFocused: true, isMaximized: true,
      // but fails to reset isMinimized: false!
      // This leaves finder marked as BOTH isMinimized: true AND isFocused: true with activeWindowId = 'finder'.
      const hasContradictoryState = finderState.isMinimized === true && finderState.isFocused === true;

      // We document this empirical bug:
      expect(hasContradictoryState).toBe(true);
      expect(activeId).toBe('finder');
    });

    it('EDGE-M1-02: setSoundVolume with NaN results in NaN volume state instead of safe fallback', () => {
      const { setSoundVolume } = useOSStore.getState();
      setSoundVolume(NaN);
      // Math.max(0, Math.min(1, NaN)) evaluates to NaN in JavaScript
      expect(Number.isNaN(useOSStore.getState().soundVolume)).toBe(true);
    });
  });
});
