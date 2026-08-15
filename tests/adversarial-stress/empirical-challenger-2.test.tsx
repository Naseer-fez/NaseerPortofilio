import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { calculateFisheyeWidth, calculateCosineBellWidth } from '@/lib/physics/springUtils';
import {
  TerminalIcon,
  ProjectsIcon,
  AboutIcon,
  FinderIcon,
  SettingsIcon,
  MailIcon,
  AppleLogo,
  AppIcon,
} from '@/components/icons';
import { DesktopIcon } from '@/components/os/DesktopIcon';
import { DesktopCanvas } from '@/components/os/DesktopCanvas';
import { DesktopGrid } from '@/components/os/DesktopGrid';
import { Dock } from '@/components/dock/Dock';
import { DockItem } from '@/components/dock/DockItem';
import { useOSStore } from '@/hooks/useOSStore';
import { DEFAULT_APPS, APPS } from '@/lib/constants/apps';

describe('EMPIRICAL CHALLENGER 2: Dock Physics, Icon Geometry & Interaction Stress Suite', () => {
  beforeEach(() => {
    useOSStore.setState({
      activeWindowId: null,
      windows: {},
      selectedIconIds: [],
      contextMenu: null,
      desktopMode: 'workspace',
      isLocked: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  // =========================================================================
  // 1. DOCK FISHEYE MAGNIFICATION MATHEMATICAL & EMPIRICAL BOUNDS
  // =========================================================================
  describe('1. Dock Fisheye Magnification Physics across 0 to 1000px', () => {
    const config = {
      baseWidth: 44,
      maxScale: 2.0,
      radius: 140,
      exponent: 2.2,
    };

    it('validates hovered icon peak scale is exactly 2.0x (88px) at distance 0px', () => {
      const width = calculateFisheyeWidth(0, config);
      const scale = width / config.baseWidth;

      expect(width).toBeCloseTo(88.0, 4);
      expect(scale).toBeCloseTo(2.0, 4);
      expect(scale).toBeGreaterThanOrEqual(1.8);
      expect(scale).toBeLessThanOrEqual(2.2);
    });

    it('verifies exact cosine-power scale curve at immediate neighbor spacing (~50px)', () => {
      const width = calculateFisheyeWidth(50, config);
      const scale = width / config.baseWidth;

      // Mathematical derivation:
      // dist = 50, radius = 140
      // factor = cos((50 / 140) * (PI / 2)) = cos(0.17857 * PI) = cos(32.1428 deg) ~= 0.84672
      // curve = factor^2.2 = 0.84672^2.2 ~= 0.69238 (~0.70 relative curve step)
      // scale = 1.0 + (2.0 - 1.0) * 0.69238 = 1.69238
      // width = 44 * 1.69238 = 74.465px
      const factor = Math.cos((50 / 140) * (Math.PI / 2));
      const expectedCurve = Math.pow(factor, 2.2);
      const expectedScale = 1.0 + (2.0 - 1.0) * expectedCurve;
      const expectedWidth = 44 * expectedScale;

      expect(width).toBeCloseTo(expectedWidth, 3);
      expect(expectedCurve).toBeGreaterThan(0.68);
      expect(expectedCurve).toBeLessThan(0.71); // ~0.70 curve step
      expect(scale).toBeGreaterThan(1.68);
      expect(scale).toBeLessThan(1.71);
      expect(width).toBeGreaterThan(74.0);
      expect(width).toBeLessThan(75.0);
    });

    it('verifies exact cosine-power scale curve at next neighbor spacing (~100px)', () => {
      const width = calculateFisheyeWidth(100, config);
      const scale = width / config.baseWidth;

      // Mathematical derivation:
      // dist = 100, radius = 140
      // factor = cos((100 / 140) * (PI / 2)) = cos(64.2857 deg) ~= 0.43388
      // curve = factor^2.2 = 0.43388^2.2 ~= 0.15835
      // scale = 1.0 + 0.15835 = 1.15835 (~1.16x scale)
      // width = 44 * 1.15835 = 50.967px
      const factor = Math.cos((100 / 140) * (Math.PI / 2));
      const expectedCurve = Math.pow(factor, 2.2);
      const expectedScale = 1.0 + (2.0 - 1.0) * expectedCurve;
      const expectedWidth = 44 * expectedScale;

      expect(width).toBeCloseTo(expectedWidth, 3);
      expect(scale).toBeGreaterThan(1.15);
      expect(scale).toBeLessThan(1.17);
      expect(width).toBeGreaterThan(50.5);
      expect(width).toBeLessThan(51.5);
    });

    it('confirms hard boundary cutoff at distance >= radius (140px) across entire 140px to 1000px range', () => {
      for (let d = 140; d <= 1000; d += 10) {
        const width = calculateFisheyeWidth(d, config);
        expect(width).toBe(44);
      }
    });

    it('empirically sweeps 10,000 pointer positions from -1000px to +1000px checking monotonicity, symmetry, and bounds', () => {
      let prevWidth = 88.0;
      const step = 0.2; // 10,000 steps across [-1000, 1000]

      for (let d = 0; d <= 1000; d += step) {
        const widthPos = calculateFisheyeWidth(d, config);
        const widthNeg = calculateFisheyeWidth(-d, config);

        // 1. Perfect bilateral symmetry
        expect(widthPos).toBe(widthNeg);

        // 2. Strict scale bounds [44px, 88px]
        expect(widthPos).toBeGreaterThanOrEqual(44.0);
        expect(widthPos).toBeLessThanOrEqual(88.0);
        expect(Number.isFinite(widthPos)).toBe(true);
        expect(Number.isNaN(widthPos)).toBe(false);

        // 3. Monotonic non-increasing decay from center outwards
        expect(widthPos).toBeLessThanOrEqual(prevWidth + 1e-9);

        // 4. Exact rest width beyond 140px
        if (d >= 140) {
          expect(widthPos).toBe(44.0);
        }

        prevWidth = widthPos;
      }
    });

    it('verifies fallback behavior and robustness on extreme / non-finite distances', () => {
      expect(calculateFisheyeWidth(1000000, config)).toBe(44);
      expect(calculateFisheyeWidth(-1000000, config)).toBe(44);
      expect(calculateFisheyeWidth(Number.POSITIVE_INFINITY, config)).toBe(44);
      expect(calculateFisheyeWidth(Number.NEGATIVE_INFINITY, config)).toBe(44);
    });

    it('verifies C1 derivative smoothness at boundary (derivative reaches 0 at distance = radius)', () => {
      const epsilon = 1e-4;
      const r = config.radius; // 140
      const widthAtR = calculateFisheyeWidth(r, config);
      const widthJustBeforeR = calculateFisheyeWidth(r - epsilon, config);
      const derivative = (widthAtR - widthJustBeforeR) / epsilon;

      // Numerical derivative should be virtually 0 (< 1e-3)
      expect(Math.abs(derivative)).toBeLessThan(1e-3);
    });

    it('verifies DockItem styling, compounded flex layout footprint and visual transform scale', () => {
      const app = DEFAULT_APPS[0];
      const { rerender } = render(
        <DockItem app={app} magnifiedWidth={88} isDockHovered={true} index={0} />
      );

      const dockItemEl = screen.getByTestId(`dock-item-${app.id}`);
      expect(dockItemEl).toBeInTheDocument();
      expect(dockItemEl.style.width).toBe('88px');
      expect(dockItemEl.style.height).toBe('88px');
      expect(dockItemEl.style.transform).toBe('scale(2)');

      // Unmagnified rest state
      rerender(
        <DockItem app={app} magnifiedWidth={44} isDockHovered={false} index={0} />
      );
      expect(dockItemEl.style.width).toBe('44px');
      expect(dockItemEl.style.height).toBe('44px');
      expect(dockItemEl.style.transform).toBe('scale(1)');
      expect(dockItemEl).toHaveClass('animate-dock-breathe');

      // Pressed state scale
      fireEvent.pointerDown(dockItemEl);
      expect(dockItemEl.style.transform).toBe('scale(0.88)');
      fireEvent.pointerUp(dockItemEl);
      expect(dockItemEl.style.transform).toBe('scale(1)');
    });
  });

  // =========================================================================
  // 2. DESKTOP INTERACTION STRESS: SINGLE-CLICK vs MARQUEE vs CONTEXT MENU
  // =========================================================================
  describe('2. Desktop Interaction Stress Testing & Race Conditions', () => {
    it('launches app immediately on single click and prevents event bubbling to canvas', () => {
      render(<DesktopCanvas />);

      const terminalIcon = screen.getByTestId('desktop-icon-terminal');
      expect(terminalIcon).toBeInTheDocument();

      // Single click launches app immediately
      fireEvent.click(terminalIcon);

      const state = useOSStore.getState();
      expect(state.selectedIconIds).toContain('terminal');
      expect(state.windows['terminal']?.isOpen).toBe(true);
      expect(state.activeWindowId).toBe('terminal');
      expect(state.contextMenu).toBeNull();
    });

    it('isolates marquee pointer drag on canvas without triggering false app launches', () => {
      render(<DesktopCanvas />);

      const canvas = screen.getByTestId('desktop-canvas');

      // Start drag marquee from empty canvas at (10, 10)
      fireEvent.pointerDown(canvas, {
        clientX: 10,
        clientY: 10,
        button: 0,
        target: canvas,
      });

      // Drag marquee across area to (300, 300)
      fireEvent.pointerMove(canvas, {
        clientX: 300,
        clientY: 300,
        button: 0,
      });

      expect(screen.getByTestId('selection-marquee')).toBeInTheDocument();

      // Release pointer on canvas
      fireEvent.pointerUp(canvas, {
        clientX: 300,
        clientY: 300,
      });

      // Marquee should be cleared
      expect(screen.queryByTestId('selection-marquee')).not.toBeInTheDocument();

      // Ensure no app was falsely launched during canvas marquee selection
      const state = useOSStore.getState();
      Object.keys(state.windows).forEach((appId) => {
        expect(state.windows[appId]?.isOpen).toBeFalsy();
      });
    });

    it('distinguishes right-click on icon (app menu) vs right-click on canvas (system menu)', () => {
      render(<DesktopCanvas />);

      const terminalIcon = screen.getByTestId('desktop-icon-terminal');
      const canvas = screen.getByTestId('desktop-canvas');

      // 1. Right click on DesktopIcon
      fireEvent.contextMenu(terminalIcon, { clientX: 120, clientY: 150 });
      let state = useOSStore.getState();
      expect(state.contextMenu).not.toBeNull();
      expect(state.contextMenu?.items.some((item) => item.label.includes('Open Terminal'))).toBe(true);
      expect(state.selectedIconIds).toContain('terminal');
      expect(state.windows['terminal']?.isOpen).toBeFalsy(); // Right click should not open window directly

      // 2. Right click on Canvas surface
      fireEvent.contextMenu(canvas, { clientX: 400, clientY: 300 });
      state = useOSStore.getState();
      expect(state.contextMenu).not.toBeNull();
      expect(state.contextMenu?.items.some((item) => item.label.includes('Change Wallpaper'))).toBe(true);
      expect(state.contextMenu?.items.some((item) => item.label.includes('About This Portfolio'))).toBe(true);
    });

    it('handles marquee drag starting on canvas and pointerup releasing over an icon without launching', () => {
      render(<DesktopCanvas />);

      const canvas = screen.getByTestId('desktop-canvas');
      const terminalIcon = screen.getByTestId('desktop-icon-terminal');

      // Drag starts on empty canvas
      fireEvent.pointerDown(canvas, {
        clientX: 5,
        clientY: 5,
        button: 0,
        target: canvas,
      });

      // Drag moves over icon area
      fireEvent.pointerMove(canvas, {
        clientX: 100,
        clientY: 100,
      });

      // Pointer released over icon element
      fireEvent.pointerUp(terminalIcon, {
        clientX: 100,
        clientY: 100,
      });

      // App should NOT be opened since this was a marquee gesture, not a click
      const state = useOSStore.getState();
      expect(state.windows['terminal']?.isOpen).toBeFalsy();
    });

    it('launches app via keyboard Enter and Space keys with accessible attributes', () => {
      render(<DesktopCanvas />);

      const projectsIcon = screen.getByTestId('desktop-icon-projects');
      expect(projectsIcon).toHaveAttribute('role', 'button');
      expect(projectsIcon).toHaveAttribute('tabIndex', '0');

      // Enter key
      fireEvent.keyDown(projectsIcon, { key: 'Enter' });
      expect(useOSStore.getState().activeWindowId).toBe('projects');
      expect(useOSStore.getState().windows['projects']?.isOpen).toBe(true);

      // Deselect
      fireEvent.click(screen.getByTestId('desktop-canvas'));
      expect(useOSStore.getState().activeWindowId).toBeNull();

      // Space key
      fireEvent.keyDown(projectsIcon, { key: ' ' });
      expect(useOSStore.getState().activeWindowId).toBe('projects');
      expect(useOSStore.getState().windows['projects']?.isOpen).toBe(true);
    });

    it('stress tests 200 rapid alternating interactions without race conditions or state corruption', () => {
      render(<DesktopCanvas />);

      const canvas = screen.getByTestId('desktop-canvas');
      const apps = DEFAULT_APPS;

      for (let i = 0; i < 200; i++) {
        const app = apps[i % apps.length];
        const iconEl = screen.getByTestId(`desktop-icon-${app.id}`);

        const actionType = i % 5;
        if (actionType === 0) {
          // Single Click launch
          fireEvent.click(iconEl);
          expect(useOSStore.getState().activeWindowId).toBe(app.id);
          expect(useOSStore.getState().windows[app.id]?.isOpen).toBe(true);
        } else if (actionType === 1) {
          // Canvas Click (deselects)
          fireEvent.click(canvas);
          expect(useOSStore.getState().activeWindowId).toBeNull();
          expect(useOSStore.getState().contextMenu).toBeNull();
        } else if (actionType === 2) {
          // Icon Context Menu
          fireEvent.contextMenu(iconEl, { clientX: 100 + i, clientY: 100 + i });
          expect(useOSStore.getState().contextMenu).not.toBeNull();
        } else if (actionType === 3) {
          // Canvas Marquee gesture
          fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10, button: 0, target: canvas });
          fireEvent.pointerMove(canvas, { clientX: 150, clientY: 150 });
          fireEvent.pointerUp(canvas, { clientX: 150, clientY: 150 });
          expect(screen.queryByTestId('selection-marquee')).not.toBeInTheDocument();
        } else if (actionType === 4) {
          // Keyboard activation (Enter key)
          fireEvent.keyDown(iconEl, { key: 'Enter' });
          expect(useOSStore.getState().windows[app.id]?.isOpen).toBe(true);
        }
      }
    });
  });

  // =========================================================================
  // 3. SVG SQUIRCLE ICONS & APPLE LOGO GEOMETRY VALIDATION
  // =========================================================================
  describe('3. macOS Squircle Icons & AppleLogo Geometric Validation', () => {
    const coreIcons = [
      { id: 'terminal', name: 'Terminal', component: TerminalIcon, testId: 'icon-terminal-svg', prefix: 'term-' },
      { id: 'projects', name: 'Projects', component: ProjectsIcon, testId: 'icon-projects-svg', prefix: 'proj-' },
      { id: 'about', name: 'About', component: AboutIcon, testId: 'icon-about-svg', prefix: 'about-' },
      { id: 'finder', name: 'Finder', component: FinderIcon, testId: 'icon-finder-svg', prefix: 'finder-' },
      { id: 'settings', name: 'Settings', component: SettingsIcon, testId: 'icon-settings-svg', prefix: 'settings-' },
      { id: 'mail', name: 'Mail', component: MailIcon, testId: 'icon-mail-svg', prefix: 'mail-' },
    ];

    it.each(coreIcons)(
      'validates $name icon squircle viewBox, base dimensions, and corner curvature (rx=28)',
      ({ component: Icon, testId }) => {
        const { container } = render(<Icon size={64} className="test-squircle" />);
        const svg = container.querySelector('svg');

        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
        expect(svg).toHaveAttribute('width', '64');
        expect(svg).toHaveAttribute('height', '64');
        expect(svg).toHaveAttribute('data-testid', testId);

        // Verify base squircle rect geometry
        const baseRects = container.querySelectorAll('rect');
        let squircleBaseFound = false;
        baseRects.forEach((rect) => {
          if (
            rect.getAttribute('width') === '120' &&
            rect.getAttribute('height') === '120' &&
            rect.getAttribute('rx') === '28'
          ) {
            squircleBaseFound = true;
          }
        });
        expect(squircleBaseFound).toBe(true);
      }
    );

    it('validates AppleLogo SVG vector path, viewBox, and dynamic theme fill', () => {
      const { container } = render(<AppleLogo size={18} className="text-white" />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 170 170');
      expect(svg).toHaveAttribute('width', '18');
      expect(svg).toHaveAttribute('height', '18');
      expect(svg).toHaveAttribute('fill', 'currentColor');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('data-testid', 'apple-logo-svg');

      const path = svg?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path?.getAttribute('d')?.length).toBeGreaterThan(50);
    });

    it('ensures zero gradient ID clashes across all 6 core app icons', () => {
      const allDefsIds = new Set<string>();
      const duplicateIds: string[] = [];

      coreIcons.forEach(({ component: Icon }) => {
        const { container } = render(<Icon size={128} />);
        const defs = container.querySelectorAll('defs [id]');
        defs.forEach((el) => {
          const id = el.getAttribute('id');
          if (id) {
            if (allDefsIds.has(id)) {
              duplicateIds.push(id);
            }
            allDefsIds.add(id);
          }
        });
        cleanup();
      });

      expect(duplicateIds).toEqual([]);
      expect(allDefsIds.size).toBeGreaterThanOrEqual(15);
    });

    it('renders all 6 icons concurrently in DOM without shader crosstalk or clipping', () => {
      const { container } = render(
        <div data-testid="all-icons-container">
          <TerminalIcon size={48} />
          <ProjectsIcon size={48} />
          <AboutIcon size={48} />
          <FinderIcon size={48} />
          <SettingsIcon size={48} />
          <MailIcon size={48} />
          <AppleLogo size={20} />
        </div>
      );

      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBe(7);
      svgs.forEach((svg) => {
        expect(svg).toBeVisible();
      });
    });

    it('tests AppIcon dispatcher case-insensitivity, unknown fallback, and iconName routing', () => {
      // 1. Case-insensitivity
      const { container: c1 } = render(<AppIcon appId="TeRmInAl" />);
      expect(c1.querySelector('[data-testid="icon-terminal-svg"]')).toBeInTheDocument();
      cleanup();

      const { container: c2 } = render(<AppIcon appId="FINDER" />);
      expect(c2.querySelector('[data-testid="icon-finder-svg"]')).toBeInTheDocument();
      cleanup();

      // 2. Lucide Icon Fallback when appId is unmapped
      const { container: c3 } = render(<AppIcon appId="custom-audio" iconName="Music" />);
      expect(c3.querySelector('svg')).toBeInTheDocument();
      cleanup();

      // 3. AppWindow fallback when neither appId nor iconName is valid
      const { container: c4 } = render(<AppIcon appId="unknown-xyz" />);
      expect(c4.querySelector('svg')).toBeInTheDocument();
      cleanup();
    });
  });
});
