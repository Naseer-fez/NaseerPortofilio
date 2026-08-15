import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { TopMenuBar } from '@/components/os/TopMenuBar';
import { useOSStore } from '@/hooks/useOSStore';

describe('TopMenuBar Component', () => {
  beforeEach(() => {
    useOSStore.setState({
      activeWindowId: null,
      spotlightOpen: false,
      theme: 'dark',
      desktopMode: 'workspace',
    });
  });

  it('should render 28px fixed bar with Apple menu, default app name Finder, and status tray', () => {
    render(<TopMenuBar />);
    const bar = screen.getByTestId('top-menu-bar');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveClass('h-7');
    expect(bar).toHaveClass('fixed');

    expect(screen.getByTestId('apple-menu-button')).toBeInTheDocument();
    expect(screen.getByTestId('active-app-name')).toHaveTextContent('Finder');

    expect(screen.getByTestId('battery-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('wifi-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('spotlight-button')).toBeInTheDocument();
    expect(screen.getByTestId('control-center-button')).toBeInTheDocument();
    expect(screen.getByTestId('live-clock')).toBeInTheDocument();
  });

  it('should update active app name when activeWindowId changes', () => {
    const { rerender } = render(<TopMenuBar />);
    expect(screen.getByTestId('active-app-name')).toHaveTextContent('Finder');

    act(() => {
      useOSStore.setState({ activeWindowId: 'terminal' });
    });
    rerender(<TopMenuBar />);
    expect(screen.getByTestId('active-app-name')).toHaveTextContent('Terminal');

    act(() => {
      useOSStore.setState({ activeWindowId: 'projects' });
    });
    rerender(<TopMenuBar />);
    expect(screen.getByTestId('active-app-name')).toHaveTextContent('Projects');
  });

  it('should open and close Apple menu dropdown on click', () => {
    render(<TopMenuBar />);
    const appleBtn = screen.getByTestId('apple-menu-button');

    // Open dropdown
    fireEvent.click(appleBtn);
    expect(screen.getByTestId('apple-menu-dropdown')).toBeInTheDocument();
    expect(screen.getByText('About This Portfolio')).toBeInTheDocument();
    expect(screen.getByText('System Settings...')).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(appleBtn);
    expect(screen.queryByTestId('apple-menu-dropdown')).not.toBeInTheDocument();
  });

  it('should trigger spotlight search on spotlight icon click', () => {
    render(<TopMenuBar />);
    const spotlightBtn = screen.getByTestId('spotlight-button');

    fireEvent.click(spotlightBtn);
    expect(useOSStore.getState().spotlightOpen).toBe(true);
  });

  it('should toggle theme on control center / theme button click', () => {
    render(<TopMenuBar />);
    const ccBtn = screen.getByTestId('control-center-button');

    expect(useOSStore.getState().theme).toBe('dark');
    fireEvent.click(ccBtn);
    expect(useOSStore.getState().theme).toBe('light');
  });
});
