import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DesktopGrid } from '@/components/os/DesktopGrid';
import { DEFAULT_APPS } from '@/lib/constants/apps';
import { useOSStore } from '@/hooks/useOSStore';

describe('DesktopGrid Component', () => {
  beforeEach(() => {
    useOSStore.setState({
      windows: useOSStore.getInitialState().windows,
      selectedIconIds: [],
    });
  });

  it('should render all 6 core default applications in the vertical grid', () => {
    render(<DesktopGrid />);
    const grid = screen.getByTestId('desktop-grid');
    expect(grid).toBeInTheDocument();

    DEFAULT_APPS.forEach((app) => {
      expect(screen.getByTestId(`desktop-icon-${app.id}`)).toBeInTheDocument();
    });
  });

  it('should open window when clicked from grid', () => {
    render(<DesktopGrid />);
    const terminalIcon = screen.getByTestId('desktop-icon-terminal');

    fireEvent.click(terminalIcon);
    expect(useOSStore.getState().windows.terminal.isOpen).toBe(true);
    expect(useOSStore.getState().activeWindowId).toBe('terminal');
  });
});
