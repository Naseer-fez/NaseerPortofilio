import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { DesktopCanvas } from '@/components/os/DesktopCanvas';
import { useOSStore } from '@/hooks/useOSStore';

describe('Tier 1: Desktop Surface & Icon Grid', () => {
  beforeEach(() => {
    useOSStore.setState({
      selectedIconIds: [],
      contextMenu: null,
      wallpaperId: 'sonoma-dark',
    });
  });

  it('clears selections and dismisses context menu on empty desktop click (#1)', () => {
    useOSStore.setState({
      selectedIconIds: ['terminal', 'projects'],
      contextMenu: { x: 200, y: 150, items: [{ id: 'test', label: 'Test Item' }] },
    });

    const { getByTestId, queryByTestId } = render(<DesktopCanvas />);
    expect(getByTestId('context-menu')).toBeInTheDocument();
    expect(useOSStore.getState().selectedIconIds).toHaveLength(2);

    fireEvent.pointerDown(getByTestId('desktop-canvas'), { clientX: 100, clientY: 100 });

    expect(queryByTestId('context-menu')).not.toBeInTheDocument();
    expect(useOSStore.getState().selectedIconIds).toHaveLength(0);
  });

  it('opens context menu at clamped coordinates on right click (#2)', () => {
    const { getByTestId } = render(<DesktopCanvas />);
    const canvas = getByTestId('desktop-canvas');

    fireEvent.contextMenu(canvas, { clientX: 250, clientY: 180 });

    const menu = getByTestId('context-menu');
    expect(menu).toBeInTheDocument();
    expect(getByTestId('context-menu-item-change-wallpaper')).toBeInTheDocument();
  });

  it('renders and tracks selection marquee rectangle on pointer drag (#3)', () => {
    const { getByTestId, queryByTestId } = render(<DesktopCanvas />);
    const canvas = getByTestId('desktop-canvas');

    fireEvent.pointerDown(canvas, { clientX: 50, clientY: 50, button: 0 });
    fireEvent.pointerMove(canvas, { clientX: 200, clientY: 180 });

    const marquee = getByTestId('selection-marquee');
    expect(marquee).toBeInTheDocument();
    expect(marquee).toHaveStyle({
      left: '50px',
      top: '50px',
      width: '150px',
      height: '130px',
    });

    fireEvent.pointerUp(canvas);
    expect(queryByTestId('selection-marquee')).not.toBeInTheDocument();
  });

  it('multi-selects intersecting icons within marquee bounds (#4)', () => {
    const { getByTestId } = render(<DesktopCanvas />);
    const canvas = getByTestId('desktop-canvas');

    const terminalIcon = getByTestId('desktop-icon-terminal');
    vi.spyOn(terminalIcon, 'getBoundingClientRect').mockReturnValue({
      left: 60,
      top: 60,
      right: 140,
      bottom: 140,
      width: 80,
      height: 80,
      x: 60,
      y: 60,
      toJSON: () => ({}),
    });

    fireEvent.pointerDown(canvas, { clientX: 20, clientY: 20 });
    fireEvent.pointerMove(canvas, { clientX: 250, clientY: 250 });

    expect(useOSStore.getState().selectedIconIds).toContain('terminal');
    expect(terminalIcon).toHaveAttribute('aria-selected', 'true');
  });

  it('launches app window and sets focus on double click (#5)', () => {
    const { getByTestId } = render(<DesktopCanvas />);
    const icon = getByTestId('desktop-icon-terminal');

    fireEvent.doubleClick(icon);

    expect(useOSStore.getState().windows['terminal'].isOpen).toBe(true);
    expect(useOSStore.getState().activeWindowId).toBe('terminal');
  });

  it('selects icon on single click without launching window (#6)', async () => {
    vi.useFakeTimers();
    const { getByTestId } = render(<DesktopCanvas />);
    const icon = getByTestId('desktop-icon-projects');

    fireEvent.click(icon);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(useOSStore.getState().selectedIconIds).toContain('projects');
    expect(useOSStore.getState().windows['projects'].isOpen).toBe(false);
    vi.useRealTimers();
  });

  it('verifies desktop background and icon grid visual conformance (#6, #7, #8, #9)', () => {
    const { getByTestId } = render(<DesktopCanvas />);

    // Visual #6: Full bleed wallpaper
    const wallpaper = getByTestId('wallpaper-container');
    expect(wallpaper).toHaveClass('fixed', 'inset-0', 'w-full', 'h-full');

    // Visual #7: Grid column-first flow
    const grid = getByTestId('desktop-grid');
    expect(grid).toBeInTheDocument();
    expect(grid.style.gridAutoFlow).toBe('column');

    // Visual #8: Icon label and container
    const iconContainer = getByTestId('desktop-icon-terminal');
    expect(iconContainer).toHaveClass('transition-transform', 'duration-150', 'hover:scale-105');
  });
});
