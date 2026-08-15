import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DesktopIcon } from '@/components/os/DesktopIcon';
import { DEFAULT_APPS } from '@/lib/constants/apps';
import { useOSStore } from '@/hooks/useOSStore';

describe('DesktopIcon Component', () => {
  const mockApp = DEFAULT_APPS[0]; // Terminal
  const onSelect = vi.fn();
  const onOpen = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
    onOpen.mockClear();
  });

  it('should render icon frame, title, and label properly', () => {
    render(
      <DesktopIcon
        app={mockApp}
        isSelected={false}
        onSelect={onSelect}
        onOpen={onOpen}
      />
    );

    const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);
    expect(iconButton).toBeInTheDocument();
    expect(screen.getByText(mockApp.title)).toBeInTheDocument();
  });

  it('should apply selected styling when isSelected is true', () => {
    const { rerender } = render(
      <DesktopIcon
        app={mockApp}
        isSelected={false}
        onSelect={onSelect}
        onOpen={onOpen}
      />
    );
    let iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);
    expect(iconButton).not.toHaveClass('bg-white/15');

    rerender(
      <DesktopIcon
        app={mockApp}
        isSelected={true}
        onSelect={onSelect}
        onOpen={onOpen}
      />
    );
    iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);
    expect(iconButton).toHaveClass('bg-white/15');
  });

  it('should call onSelect and onOpen immediately on single click', () => {
    render(
      <DesktopIcon
        app={mockApp}
        isSelected={false}
        onSelect={onSelect}
        onOpen={onOpen}
      />
    );

    const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);

    // Single click launches app immediately
    fireEvent.click(iconButton);
    expect(onSelect).toHaveBeenCalledWith(mockApp.id);
    expect(onOpen).toHaveBeenCalledWith(mockApp.id);
  });

  it('should launch app directly on touch tap (onTouchEnd)', () => {
    render(
      <DesktopIcon
        app={mockApp}
        isSelected={false}
        onSelect={onSelect}
        onOpen={onOpen}
      />
    );

    const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);
    fireEvent.touchEnd(iconButton);
    expect(onOpen).toHaveBeenCalledWith(mockApp.id);
  });

  it('should trigger context menu on right click', () => {
    render(
      <DesktopIcon
        app={mockApp}
        isSelected={false}
        onSelect={onSelect}
        onOpen={onOpen}
      />
    );

    const iconButton = screen.getByTestId(`desktop-icon-${mockApp.id}`);
    fireEvent.contextMenu(iconButton, { clientX: 150, clientY: 200 });

    expect(onSelect).toHaveBeenCalledWith(mockApp.id);
    expect(useOSStore.getState().contextMenu).not.toBeNull();
  });
});
