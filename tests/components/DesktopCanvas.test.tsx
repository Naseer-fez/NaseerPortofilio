import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DesktopCanvas } from '@/components/os/DesktopCanvas';
import { useOSStore } from '@/hooks/useOSStore';

describe('DesktopCanvas Component', () => {
  beforeEach(() => {
    useOSStore.setState({
      activeWindowId: 'terminal',
      desktopMode: 'workspace',
      contextMenu: null,
      selectedIconIds: ['terminal'],
    });
  });

  it('should render Layer 1 surface with z-10 and top-7', () => {
    render(<DesktopCanvas />);
    const canvas = screen.getByTestId('desktop-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('z-10');
    expect(canvas).toHaveClass('top-7');
  });

  it('should clear activeWindowId, contextMenu, and selected icons on canvas click', () => {
    render(<DesktopCanvas />);
    const canvas = screen.getByTestId('desktop-canvas');

    fireEvent.click(canvas);

    expect(useOSStore.getState().activeWindowId).toBeNull();
    expect(useOSStore.getState().contextMenu).toBeNull();
    expect(useOSStore.getState().selectedIconIds).toEqual([]);
  });

  it('should spawn context menu on right click', () => {
    render(<DesktopCanvas />);
    const canvas = screen.getByTestId('desktop-canvas');

    fireEvent.contextMenu(canvas, { clientX: 300, clientY: 400 });

    const state = useOSStore.getState();
    expect(state.contextMenu).not.toBeNull();
    expect(state.contextMenu?.x).toBe(300);
    expect(state.contextMenu?.y).toBe(400);
    expect(state.contextMenu?.items.length).toBeGreaterThan(0);
  });

  it('should toggle desktop mode on double click', () => {
    render(<DesktopCanvas />);
    const canvas = screen.getByTestId('desktop-canvas');

    fireEvent.doubleClick(canvas);
    expect(useOSStore.getState().desktopMode).toBe('ambient-hero');

    fireEvent.doubleClick(canvas);
    expect(useOSStore.getState().desktopMode).toBe('workspace');
  });
});
