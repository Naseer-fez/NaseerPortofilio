import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';
import React from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { DesktopIcon } from '@/components/os/DesktopIcon';
import { DesktopCanvas } from '@/components/os/DesktopCanvas';
import { Wallpaper } from '@/components/os/Wallpaper';
import { TopMenuBar, LiveClock } from '@/components/os/TopMenuBar';
import { useOSStore } from '@/hooks/useOSStore';
import { DEFAULT_APPS, INITIAL_WINDOWS } from '@/lib/constants/apps';
import { WALLPAPERS } from '@/lib/constants/wallpapers';

describe('Adversarial Stress Testing: M1 Core OS UI & Interactions', () => {
  beforeEach(() => {
    // Reset OS store state to pristine baseline
    useOSStore.setState({
      windows: JSON.parse(JSON.stringify(INITIAL_WINDOWS)),
      activeWindowId: null,
      spotlightOpen: false,
      controlCenterOpen: false,
      contextMenu: null,
      theme: 'dark',
      wallpaperId: 'sonoma-dark',
      desktopMode: 'workspace',
      selectedIconIds: [],
    });
  });

  // =========================================================================
  // SUITE 1: useKeyboardShortcuts Adversarial Stress Test
  // =========================================================================
  describe('1. useKeyboardShortcuts Hook Stress Tests', () => {
    it('executes all 7 primary shortcut combinations when focused on standard document', () => {
      renderHook(() => useKeyboardShortcuts());

      // 1. Cmd+K -> Spotlight
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
      });
      expect(useOSStore.getState().spotlightOpen).toBe(true);

      // Reset Spotlight
      act(() => {
        useOSStore.getState().setSpotlightOpen(false);
      });

      // 2. Open window and test Cmd+W -> Close
      act(() => {
        useOSStore.getState().openWindow('terminal');
      });
      expect(useOSStore.getState().activeWindowId).toBe('terminal');
      expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', metaKey: true, bubbles: true }));
      });
      expect(useOSStore.getState().windows.terminal.isOpen).toBe(false);

      // 3. Open window and test Cmd+M -> Minimize
      act(() => {
        useOSStore.getState().openWindow('projects');
      });
      expect(useOSStore.getState().windows.projects.isOpen).toBe(true);
      expect(useOSStore.getState().windows.projects.isMinimized).toBe(false);

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', metaKey: true, bubbles: true }));
      });
      expect(useOSStore.getState().windows.projects.isMinimized).toBe(true);

      // 4. Cmd+Shift+D -> Toggle Theme
      expect(useOSStore.getState().theme).toBe('dark');
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'd', metaKey: true, shiftKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().theme).toBe('light');

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'd', metaKey: true, shiftKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().theme).toBe('dark');

      // 5. Cmd+Option+M -> Toggle Desktop Mode
      expect(useOSStore.getState().desktopMode).toBe('workspace');
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'm', metaKey: true, altKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().desktopMode).toBe('ambient-hero');

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'm', metaKey: true, altKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().desktopMode).toBe('workspace');

      // 6. Cmd+Option+T -> Open Terminal
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 't', metaKey: true, altKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);
      expect(useOSStore.getState().activeWindowId).toBe('terminal');

      // 7. Escape -> Closes Overlays individually (ContextMenu, Spotlight, ControlCenter)
      // 7a. ContextMenu
      act(() => {
        useOSStore.getState().setContextMenu({ x: 100, y: 100, items: [] });
      });
      expect(useOSStore.getState().contextMenu).not.toBeNull();
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });
      expect(useOSStore.getState().contextMenu).toBeNull();

      // 7b. Spotlight
      act(() => {
        useOSStore.getState().setSpotlightOpen(true);
      });
      expect(useOSStore.getState().spotlightOpen).toBe(true);
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });
      expect(useOSStore.getState().spotlightOpen).toBe(false);

      // 7c. Control Center
      act(() => {
        useOSStore.getState().setControlCenterOpen(true);
      });
      expect(useOSStore.getState().controlCenterOpen).toBe(true);
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });
      expect(useOSStore.getState().controlCenterOpen).toBe(false);
    });

    it('handles macOS option characters (µ for Option+M, † for Option+T)', () => {
      renderHook(() => useKeyboardShortcuts());

      // On macOS, Option+M sends key: 'µ', code: 'KeyM'
      expect(useOSStore.getState().desktopMode).toBe('workspace');
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'µ', code: 'KeyM', metaKey: true, altKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().desktopMode).toBe('ambient-hero');

      // On macOS, Option+T sends key: '†', code: 'KeyT'
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: '†', code: 'KeyT', metaKey: true, altKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);
    });

    it('rigorously tests suppression inside input, textarea, select, and contenteditable elements', () => {
      renderHook(() => useKeyboardShortcuts());

      const elementsToTest = [
        document.createElement('input'),
        document.createElement('textarea'),
        document.createElement('select'),
        (() => {
          const div = document.createElement('div');
          div.contentEditable = 'true';
          return div;
        })(),
      ];

      for (const element of elementsToTest) {
        document.body.appendChild(element);
        element.focus();

        // Ensure a window is open before each check
        act(() => {
          useOSStore.getState().openWindow('terminal');
        });
        expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);

        // Target-level suppression for Cmd+W (Close window)
        const closeEvt = new KeyboardEvent('keydown', { key: 'w', metaKey: true, bubbles: true });
        Object.defineProperty(closeEvt, 'target', { value: element, enumerable: true });
        act(() => {
          element.dispatchEvent(closeEvt);
        });
        expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);

        // Target-level suppression for Cmd+M (Minimize window)
        const minEvt = new KeyboardEvent('keydown', { key: 'm', metaKey: true, bubbles: true });
        Object.defineProperty(minEvt, 'target', { value: element, enumerable: true });
        act(() => {
          element.dispatchEvent(minEvt);
        });
        expect(useOSStore.getState().windows.terminal.isMinimized).toBe(false);

        // Target-level suppression for Cmd+Shift+D (Theme)
        const themeEvt = new KeyboardEvent('keydown', { key: 'd', metaKey: true, shiftKey: true, bubbles: true });
        Object.defineProperty(themeEvt, 'target', { value: element, enumerable: true });
        act(() => {
          element.dispatchEvent(themeEvt);
        });
        expect(useOSStore.getState().theme).toBe('dark');

        // EXCEPTIONS: Escape and Cmd+K MUST NOT be suppressed inside inputs
        const spotlightEvt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
        Object.defineProperty(spotlightEvt, 'target', { value: element, enumerable: true });
        act(() => {
          element.dispatchEvent(spotlightEvt);
        });
        expect(useOSStore.getState().spotlightOpen).toBe(true);

        const escEvt = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
        Object.defineProperty(escEvt, 'target', { value: element, enumerable: true });
        act(() => {
          element.dispatchEvent(escEvt);
        });
        expect(useOSStore.getState().spotlightOpen).toBe(false);

        document.body.removeChild(element);
      }
    });

    it('rejects ambiguous modifier combinations (e.g. Shift+Cmd+W or Alt+Cmd+W)', () => {
      renderHook(() => useKeyboardShortcuts());
      act(() => {
        useOSStore.getState().openWindow('terminal');
      });

      // Shift+Cmd+W should NOT trigger Cmd+W (closeWindow)
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'w', metaKey: true, shiftKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);

      // Alt+Cmd+W should NOT trigger Cmd+W
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'w', metaKey: true, altKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);

      // Shift+Cmd+K should NOT trigger Cmd+K
      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'k', metaKey: true, shiftKey: true, bubbles: true })
        );
      });
      expect(useOSStore.getState().spotlightOpen).toBe(false);
    });

    it('properly cleans up event listeners on unmount without ghost callbacks', () => {
      const { unmount } = renderHook(() => useKeyboardShortcuts());
      unmount();

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
      });
      // Spotlight should NOT open since hook was unmounted
      expect(useOSStore.getState().spotlightOpen).toBe(false);
    });

    it('survives rapid-fire sequential key hammering of 100 events', () => {
      renderHook(() => useKeyboardShortcuts());

      act(() => {
        for (let i = 0; i < 100; i++) {
          window.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: i % 2 === 0 ? 'k' : 'Escape',
              metaKey: i % 2 === 0,
              bubbles: true,
            })
          );
        }
      });

      // Ended on Escape -> spotlight should be closed
      expect(useOSStore.getState().spotlightOpen).toBe(false);
    });
  });

  // =========================================================================
  // SUITE 2: DesktopIcon Click Timing & Disambiguation Stress Test
  // =========================================================================
  describe('2. DesktopIcon 300ms Disambiguation & Interaction Stress Tests', () => {
    const mockApp = DEFAULT_APPS[0]; // Finder
    let onSelect: ReturnType<typeof vi.fn>;
    let onOpen: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      vi.useFakeTimers();
      onSelect = vi.fn();
      onOpen = vi.fn();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('100ms interval (<300ms): triggers onSelect on 1st click and onOpen on 2nd click (double click)', () => {
      render(<DesktopIcon app={mockApp} onSelect={onSelect} onOpen={onOpen} />);
      const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

      // Click 1 at t=0ms
      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledTimes(0);

      // Advance 100ms
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Click 2 at t=100ms
      fireEvent.click(iconButton);
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledWith(mockApp.id);
    });

    it('250ms interval (<300ms): triggers onOpen on 2nd click (double click)', () => {
      render(<DesktopIcon app={mockApp} onSelect={onSelect} onOpen={onOpen} />);
      const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(250);
      });

      fireEvent.click(iconButton);
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledWith(mockApp.id);
    });

    it('300ms interval (threshold expired): triggers onSelect on both clicks (no double click)', () => {
      render(<DesktopIcon app={mockApp} onSelect={onSelect} onOpen={onOpen} />);
      const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledTimes(0);

      // Advance exactly 300ms to allow timeout to expire
      act(() => {
        vi.advanceTimersByTime(300);
      });

      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onOpen).toHaveBeenCalledTimes(0);
    });

    it('400ms interval (>300ms): triggers two independent onSelect calls (no double click)', () => {
      render(<DesktopIcon app={mockApp} onSelect={onSelect} onOpen={onOpen} />);
      const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(400);
      });

      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onOpen).toHaveBeenCalledTimes(0);
    });

    it('multi-click hammering sequence: Click(0ms)->Click(100ms)->Click(250ms)->Click(350ms)', () => {
      render(<DesktopIcon app={mockApp} onSelect={onSelect} onOpen={onOpen} />);
      const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

      // Click 1 (0ms): First click -> Select
      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onOpen).toHaveBeenCalledTimes(0);

      // Click 2 (100ms): Second click -> Open
      act(() => {
        vi.advanceTimersByTime(100);
      });
      fireEvent.click(iconButton);
      expect(onOpen).toHaveBeenCalledTimes(1);

      // Click 3 (250ms, 150ms after Click 2): Since timer was reset on Open, this is a new First click -> Select
      act(() => {
        vi.advanceTimersByTime(150);
      });
      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onOpen).toHaveBeenCalledTimes(1);

      // Click 4 (350ms, 100ms after Click 3): Second click -> Open again
      act(() => {
        vi.advanceTimersByTime(100);
      });
      fireEvent.click(iconButton);
      expect(onOpen).toHaveBeenCalledTimes(2);
    });

    it('cleans up pending 300ms click timer when unmounted without error', () => {
      const { unmount } = render(<DesktopIcon app={mockApp} onSelect={onSelect} onOpen={onOpen} />);
      const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

      fireEvent.click(iconButton);
      expect(onSelect).toHaveBeenCalledTimes(1);

      // Unmount before 300ms timeout completes
      act(() => {
        vi.advanceTimersByTime(150);
      });
      unmount();

      // Advancing timer after unmount should not cause crash or state updates
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('handles Keyboard activation (Enter / Space keys) and onTouchEnd', () => {
      render(<DesktopIcon app={mockApp} onSelect={onSelect} onOpen={onOpen} />);
      const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

      // Enter key
      fireEvent.keyDown(iconButton, { key: 'Enter' });
      expect(onOpen).toHaveBeenCalledWith(mockApp.id);

      // Space key
      fireEvent.keyDown(iconButton, { key: ' ' });
      expect(onOpen).toHaveBeenCalledTimes(2);

      // Arrow key should not trigger open
      fireEvent.keyDown(iconButton, { key: 'ArrowDown' });
      expect(onOpen).toHaveBeenCalledTimes(2);

      // Touch tap
      fireEvent.touchEnd(iconButton);
      expect(onOpen).toHaveBeenCalledTimes(3);
    });

    it('clamps context menu coordinates inside viewport bounds', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 900, writable: true });

      render(<DesktopIcon app={mockApp} onSelect={onSelect} onOpen={onOpen} />);
      const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

      // Right click at bottom right corner (1430, 890)
      fireEvent.contextMenu(iconButton, { clientX: 1430, clientY: 890 });

      const ctx = useOSStore.getState().contextMenu;
      expect(ctx).not.toBeNull();
      // Should be clamped to <= 1440 - 200 = 1240, <= 900 - 150 = 750
      expect(ctx?.x).toBeLessThanOrEqual(1240);
      expect(ctx?.y).toBeLessThanOrEqual(750);
    });
  });

  // =========================================================================
  // SUITE 3: DesktopCanvas Marquee Selection Vectors Stress Test
  // =========================================================================
  describe('3. DesktopCanvas Marquee Selection & Vector Calculations', () => {
    it('calculates accurate marquee bounding boxes across all 4 drag vectors', () => {
      render(<DesktopCanvas />);
      const canvas = screen.getByTestId('desktop-canvas');

      // Vector 1: Top-Left to Bottom-Right (x: 100->300, y: 100->250)
      fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100, button: 0 });
      fireEvent.pointerMove(canvas, { clientX: 300, clientY: 250 });

      let marquee = screen.getByTestId('selection-marquee');
      expect(marquee.style.left).toBe('100px');
      expect(marquee.style.top).toBe('100px');
      expect(marquee.style.width).toBe('200px');
      expect(marquee.style.height).toBe('150px');

      fireEvent.pointerUp(canvas);
      expect(screen.queryByTestId('selection-marquee')).not.toBeInTheDocument();

      // Vector 2: Bottom-Right to Top-Left (x: 300->100, y: 250->100)
      fireEvent.pointerDown(canvas, { clientX: 300, clientY: 250, button: 0 });
      fireEvent.pointerMove(canvas, { clientX: 100, clientY: 100 });

      marquee = screen.getByTestId('selection-marquee');
      expect(marquee.style.left).toBe('100px');
      expect(marquee.style.top).toBe('100px');
      expect(marquee.style.width).toBe('200px');
      expect(marquee.style.height).toBe('150px');

      fireEvent.pointerUp(canvas);

      // Vector 3: Top-Right to Bottom-Left (x: 300->100, y: 100->250)
      fireEvent.pointerDown(canvas, { clientX: 300, clientY: 100, button: 0 });
      fireEvent.pointerMove(canvas, { clientX: 100, clientY: 250 });

      marquee = screen.getByTestId('selection-marquee');
      expect(marquee.style.left).toBe('100px');
      expect(marquee.style.top).toBe('100px');
      expect(marquee.style.width).toBe('200px');
      expect(marquee.style.height).toBe('150px');

      fireEvent.pointerUp(canvas);

      // Vector 4: Bottom-Left to Top-Right (x: 100->300, y: 250->100)
      fireEvent.pointerDown(canvas, { clientX: 100, clientY: 250, button: 0 });
      fireEvent.pointerMove(canvas, { clientX: 300, clientY: 100 });

      marquee = screen.getByTestId('selection-marquee');
      expect(marquee.style.left).toBe('100px');
      expect(marquee.style.top).toBe('100px');
      expect(marquee.style.width).toBe('200px');
      expect(marquee.style.height).toBe('150px');

      fireEvent.pointerUp(canvas);
    });

    it('handles zero-distance and out-of-bounds negative coordinates drag', () => {
      render(<DesktopCanvas />);
      const canvas = screen.getByTestId('desktop-canvas');

      // Zero-distance
      fireEvent.pointerDown(canvas, { clientX: 200, clientY: 200, button: 0 });
      fireEvent.pointerMove(canvas, { clientX: 200, clientY: 200 });

      const marquee = screen.getByTestId('selection-marquee');
      expect(marquee.style.left).toBe('200px');
      expect(marquee.style.top).toBe('200px');
      expect(marquee.style.width).toBe('0px');
      expect(marquee.style.height).toBe('0px');

      fireEvent.pointerUp(canvas);

      // Negative coordinates (dragging offscreen)
      fireEvent.pointerDown(canvas, { clientX: 50, clientY: 50, button: 0 });
      fireEvent.pointerMove(canvas, { clientX: -20, clientY: -30 });

      const negMarquee = screen.getByTestId('selection-marquee');
      expect(negMarquee.style.left).toBe('-20px');
      expect(negMarquee.style.top).toBe('-30px');
      expect(negMarquee.style.width).toBe('70px');
      expect(negMarquee.style.height).toBe('80px');

      fireEvent.pointerUp(canvas);
    });

    it('selects icons that intersect with the marquee rectangle', () => {
      render(<DesktopCanvas />);
      const canvas = screen.getByTestId('desktop-canvas');

      // Mock getBoundingClientRect on desktop icons
      const finderEl = document.querySelector(`[data-testid="desktop-icon-finder"]`);
      const terminalEl = document.querySelector(`[data-testid="desktop-icon-terminal"]`);

      if (finderEl) {
        vi.spyOn(finderEl, 'getBoundingClientRect').mockReturnValue({
          left: 50,
          right: 142,
          top: 50,
          bottom: 154,
          width: 92,
          height: 104,
          x: 50,
          y: 50,
          toJSON: () => {},
        });
      }

      if (terminalEl) {
        vi.spyOn(terminalEl, 'getBoundingClientRect').mockReturnValue({
          left: 500,
          right: 592,
          top: 500,
          bottom: 604,
          width: 92,
          height: 104,
          x: 500,
          y: 500,
          toJSON: () => {},
        });
      }

      // Drag over finder icon only (20, 20 -> 200, 200)
      fireEvent.pointerDown(canvas, { clientX: 20, clientY: 20, button: 0 });
      fireEvent.pointerMove(canvas, { clientX: 200, clientY: 200 });

      expect(useOSStore.getState().selectedIconIds).toContain('finder');
      expect(useOSStore.getState().selectedIconIds).not.toContain('terminal');

      fireEvent.pointerUp(canvas);
    });

    it('does not initiate marquee drag when interacting with buttons or context menus', () => {
      render(
        <DesktopCanvas>
          <button data-testid="test-btn">Test Button</button>
        </DesktopCanvas>
      );
      const testBtn = screen.getByTestId('test-btn');

      fireEvent.pointerDown(testBtn, { clientX: 100, clientY: 100, button: 0 });
      expect(screen.queryByTestId('selection-marquee')).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // SUITE 4: Wallpaper Switching & Crossfade Stress Test
  // =========================================================================
  describe('4. Wallpaper Rapid Switching & Crossfade Stress Tests', () => {
    it('rapidly cycles through all registered wallpapers without throwing or dropping DOM node', () => {
      const { rerender } = render(<Wallpaper />);
      const container = screen.getByTestId('wallpaper-container');
      expect(container).toBeInTheDocument();

      // Rapidly switch through all 7 wallpapers 5 times (35 transitions)
      for (let cycle = 0; cycle < 5; cycle++) {
        for (const wp of WALLPAPERS) {
          act(() => {
            useOSStore.setState({ wallpaperId: wp.id });
          });
          rerender(<Wallpaper />);

          const planes = screen.getAllByTestId('wallpaper-plane');
          expect(planes.length).toBeGreaterThan(0);
          expect(planes.some((p) => p.style.background === wp.fallbackGradient)).toBe(true);
        }
      }
    });

    it('gracefully falls back to default sonoma-dark for invalid wallpaper IDs', () => {
      render(<Wallpaper wallpaperId="non-existent-wallpaper-999" />);
      const planes = screen.getAllByTestId('wallpaper-plane');
      const plane = planes[planes.length - 1];
      expect(plane).toBeInTheDocument();
      // Should resolve to WALLPAPERS[0] (sonoma-dark) fallback gradient
      expect(plane.style.background).toContain('radial-gradient');
    });

    it('smoothly toggles dark/light overlay styles across theme flips', () => {
      const { rerender } = render(<Wallpaper />);

      act(() => {
        useOSStore.setState({ theme: 'dark', wallpaperId: 'sonoma-dark' });
      });
      rerender(<Wallpaper />);
      let overlay = screen.getByTestId('wallpaper-overlay');
      expect(overlay).toHaveClass('bg-black/25');

      act(() => {
        useOSStore.setState({ theme: 'light', wallpaperId: 'sonoma-dark' });
      });
      rerender(<Wallpaper />);
      overlay = screen.getByTestId('wallpaper-overlay');
      expect(overlay).toHaveClass('bg-black/10');
    });
  });

  // =========================================================================
  // SUITE 5: TopMenuBar Live Clock, Active App, & Apple Menu Stress Test
  // =========================================================================
  describe('5. TopMenuBar Live Clock & Interactions Stress Tests', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('formats live clock accurately across boundary hours, midnight, noon, and single-digit minutes', () => {
      // Set fixed system time: Saturday, Aug 15, 2026 at 09:05 AM
      vi.setSystemTime(new Date(2026, 7, 15, 9, 5, 0));

      render(<LiveClock />);
      let clock = screen.getByTestId('menu-bar-clock');
      expect(clock).toHaveTextContent('Sat Aug 15 9:05 AM');

      // Advance to Noon (12:00 PM)
      act(() => {
        vi.setSystemTime(new Date(2026, 7, 15, 12, 0, 0));
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('menu-bar-clock')).toHaveTextContent('Sat Aug 15 12:00 PM');

      // Advance to Midnight (12:00 AM next day Sun Aug 16)
      act(() => {
        vi.setSystemTime(new Date(2026, 7, 16, 0, 0, 0));
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('menu-bar-clock')).toHaveTextContent('Sun Aug 16 12:00 AM');

      // Advance 10 hours & 42 minutes (10:42 AM)
      act(() => {
        vi.setSystemTime(new Date(2026, 7, 16, 10, 42, 0));
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('menu-bar-clock')).toHaveTextContent('Sun Aug 16 10:42 AM');
    });

    it('clears clock timer interval on unmount without throwing', () => {
      const { unmount } = render(<LiveClock />);
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('resolves active application title accurately for all default apps and fallback', () => {
      const { rerender } = render(<TopMenuBar />);
      expect(screen.getByTestId('active-app-name')).toHaveTextContent('Finder');

      for (const app of DEFAULT_APPS) {
        act(() => {
          useOSStore.setState({ activeWindowId: app.id });
        });
        rerender(<TopMenuBar />);
        expect(screen.getByTestId('active-app-name')).toHaveTextContent(app.title);
      }

      // Null window -> Finder
      act(() => {
        useOSStore.setState({ activeWindowId: null });
      });
      rerender(<TopMenuBar />);
      expect(screen.getByTestId('active-app-name')).toHaveTextContent('Finder');
    });

    it('toggles Apple menu dropdown, executes menu actions, and dismisses on outside click', () => {
      render(<TopMenuBar />);
      const appleBtn = screen.getByTestId('apple-menu-button');

      // 1. Open
      fireEvent.click(appleBtn);
      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();

      // 2. Click "About This Portfolio"
      const aboutBtn = screen.getByText('About This Portfolio');
      fireEvent.click(aboutBtn);

      expect(useOSStore.getState().windows.about.isOpen).toBe(true);
      expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();

      // 3. Re-open and click "Sleep (Ambient Mode)"
      fireEvent.click(appleBtn);
      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();

      const sleepBtn = screen.getByText('Sleep (Ambient Mode)');
      fireEvent.click(sleepBtn);
      expect(useOSStore.getState().desktopMode).toBe('ambient-hero');
      expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();

      // 4. Outside click dismissal
      fireEvent.click(appleBtn);
      expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);
      expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();
    });

    it('switches between standard menu items (File, Edit, View, Window, Help)', () => {
      render(<TopMenuBar />);

      // Open "File"
      const fileBtn = screen.getByTestId('menu-item-file');
      fireEvent.click(fileBtn);
      expect(screen.getByText('Close Window')).toBeInTheDocument();

      // Switch directly to "View"
      const viewBtn = screen.getByTestId('menu-item-view');
      fireEvent.click(viewBtn);
      expect(screen.getByText('Toggle Ambient Mode')).toBeInTheDocument();
      expect(screen.queryByText('Close Window')).not.toBeInTheDocument();

      // Switch to "Window"
      const windowBtn = screen.getByTestId('menu-item-window');
      fireEvent.click(windowBtn);
      expect(screen.getByText('Zoom / Maximize')).toBeInTheDocument();

      // Switch to "Help"
      const helpBtn = screen.getByTestId('menu-item-help');
      fireEvent.click(helpBtn);
      expect(screen.getByText('Portfolio Help')).toBeInTheDocument();
    });
  });
});
