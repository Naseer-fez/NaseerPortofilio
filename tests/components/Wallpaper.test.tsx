import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { Wallpaper } from '@/components/os/Wallpaper';
import { useOSStore } from '@/hooks/useOSStore';

describe('Wallpaper Component', () => {
  beforeEach(() => {
    useOSStore.setState({
      wallpaperId: 'sonoma-dark',
      theme: 'dark',
    });
  });

  it('should render container with z-0 and default wallpaper gradient', () => {
    render(<Wallpaper />);
    const container = screen.getByTestId('wallpaper-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('z-0');

    const plane = screen.getByTestId('wallpaper-plane');
    expect(plane).toBeInTheDocument();
    expect(plane.style.background).toContain('radial-gradient');
  });

  it('should reflect theme overlay changes between dark and light modes', () => {
    const { rerender } = render(<Wallpaper />);
    let overlay = screen.getByTestId('wallpaper-overlay');
    expect(overlay).toHaveClass('bg-black/25');

    act(() => {
      useOSStore.setState({ theme: 'light' });
    });
    rerender(<Wallpaper />);
    overlay = screen.getByTestId('wallpaper-overlay');
    expect(overlay).toHaveClass('bg-black/10');
  });

  it('should accept prop wallpaperId override', () => {
    render(<Wallpaper wallpaperId="sonoma-light" />);
    const plane = screen.getByTestId('wallpaper-plane');
    expect(plane.style.background).toContain('linear-gradient');
  });
});
