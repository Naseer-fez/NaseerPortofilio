import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { WindowManager } from '@/components/window/WindowManager';
import { useOSStore } from '@/hooks/useOSStore';
import { simulateDrag, simulateResizeHandle } from '../helpers';

describe('Tier 1: Window Management & Geometry', () => {
  beforeEach(() => {
    // Reset all windows
    const windows = useOSStore.getState().windows;
    Object.keys(windows).forEach(k => {
      useOSStore.getState().closeWindow(k as any);
    });
  });

  it('opens window with scale/opacity and 12px radius (#8, #10, #17)', () => {
    useOSStore.getState().openWindow('terminal');

    const { getByTestId } = render(<WindowManager />);
    const win = getByTestId('window-terminal');

    expect(win).toBeInTheDocument();
    expect(win).toHaveStyle({ borderRadius: '12px' });
    expect(win).toMatchGlassmorphism({ blur: '28px', saturate: '180%' });
    expect(win).toBeInZIndexRange(20, 49);
  });

  it('closes window and shifts focus on red traffic light click (#9, #18)', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().openWindow('projects');

    const { getByTestId, queryByTestId } = render(<WindowManager />);
    expect(getByTestId('window-projects')).toBeInTheDocument();

    fireEvent.click(getByTestId('traffic-light-close-projects'));

    expect(queryByTestId('window-projects')).not.toBeInTheDocument();
    expect(useOSStore.getState().activeWindowId).toBe('terminal');
  });

  it('minimizes window on yellow traffic light click (#11, #20)', () => {
    useOSStore.getState().openWindow('terminal');

    const { getByTestId, queryByTestId } = render(<WindowManager />);
    expect(getByTestId('window-terminal')).toBeInTheDocument();

    fireEvent.click(getByTestId('traffic-light-minimize-terminal'));

    expect(useOSStore.getState().windows['terminal'].isMinimized).toBe(true);
    expect(queryByTestId('window-terminal')).not.toBeInTheDocument();
  });

  it('maximizes and restores window bounds on green traffic light click (#13, #14, #19)', () => {
    useOSStore.getState().openWindow('terminal');

    const { getByTestId } = render(<WindowManager />);
    const greenBtn = getByTestId('traffic-light-maximize-terminal');
    const win = getByTestId('window-terminal');

    // Maximize
    fireEvent.click(greenBtn);
    expect(useOSStore.getState().windows['terminal'].isMaximized).toBe(true);
    expect(win).toHaveStyle({ borderRadius: '0px', top: '28px', left: '0px' });

    // Restore
    fireEvent.click(greenBtn);
    expect(useOSStore.getState().windows['terminal'].isMaximized).toBe(false);
    expect(win).toHaveStyle({ borderRadius: '12px' });
  });

  it('toggles maximize on window header double click (#15)', () => {
    useOSStore.getState().openWindow('terminal');

    const { getByTestId } = render(<WindowManager />);
    const header = getByTestId('window-header-terminal');

    fireEvent.doubleClick(header);
    expect(useOSStore.getState().windows['terminal'].isMaximized).toBe(true);

    fireEvent.doubleClick(header);
    expect(useOSStore.getState().windows['terminal'].isMaximized).toBe(false);
  });

  it('drags window header and clamps y >= 28px and overhang (#16, #17, #18, #21)', () => {
    useOSStore.getState().openWindow('terminal');

    const { getByTestId } = render(<WindowManager />);
    const header = getByTestId('window-header-terminal');

    // Drag upwards towards negative y
    simulateDrag(header, {
      from: { x: 200, y: 100 },
      to: { x: 200, y: -200 },
      steps: 5,
    });

    const winState = useOSStore.getState().windows['terminal'];
    expect(winState.position.y).toBe(28);
    expect(header).toHaveClass('cursor-grab');
  });

  it('resizes window in 8 directions and clamps minimum size 360x240 (#19, #20, #22)', () => {
    useOSStore.getState().openWindow('terminal');

    const { getByTestId } = render(<WindowManager />);
    const winFrame = getByTestId('window-terminal');

    // Resize via SE handle towards very small size
    simulateResizeHandle(winFrame, 'se', { dx: -600, dy: -500 });

    const winState = useOSStore.getState().windows['terminal'];
    expect(winState.size.width).toBeGreaterThanOrEqual(360);
    expect(winState.size.height).toBeGreaterThanOrEqual(240);
  });

  it('elevates active window z-index and applies deep shadow (#21, #15, #16)', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().openWindow('projects');

    const { getByTestId } = render(<WindowManager />);
    const termWin = getByTestId('window-terminal');
    const projWin = getByTestId('window-projects');

    // Focus terminal
    fireEvent.pointerDown(termWin);

    expect(useOSStore.getState().activeWindowId).toBe('terminal');
    expect(termWin).toHaveZIndexOrder(projWin);
    expect(termWin.style.boxShadow).toContain('0 25px 60px -10px');
    expect(projWin.style.boxShadow).toContain('0 10px 30px -5px');
  });

  it('cascades successively opened windows with 24px offset (#22, #23)', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().openWindow('finder');
    useOSStore.getState().openWindow('about');

    const wins = useOSStore.getState().windows;
    expect(wins['finder'].position.x).toBe(wins['terminal'].position.x + 24);
    expect(wins['finder'].position.y).toBe(wins['terminal'].position.y + 24);
    expect(wins['about'].position.x).toBe(wins['finder'].position.x + 24);
    expect(wins['about'].position.y).toBe(wins['finder'].position.y + 24);
  });

  it('renders traffic lights with gray dots when unfocused and glyphs on hover (#23, #24, #12, #13, #14)', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().openWindow('projects'); // projects is active, terminal is unfocused

    const { getByTestId } = render(<WindowManager />);
    const termCloseBtn = getByTestId('traffic-light-close-terminal');
    expect(termCloseBtn).toHaveClass('bg-stone-500/40');

    // Hover over traffic lights group on terminal
    const group = getByTestId('traffic-lights-group-terminal');
    fireEvent.mouseEnter(group);

    expect(termCloseBtn).toHaveTextContent('✕');
    expect(getByTestId('traffic-light-minimize-terminal')).toHaveTextContent('−');
    expect(getByTestId('traffic-light-maximize-terminal')).toHaveTextContent('⤢');
  });
});
