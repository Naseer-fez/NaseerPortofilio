import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LockScreen } from '@/components/os/LockScreen';
import { useOSStore } from '@/hooks/useOSStore';

describe('Lock Screen Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-15T10:30:00Z'));
    useOSStore.setState({
      isLocked: true,
      wallpaperId: 'sonoma-dark',
      soundEnabled: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders fullscreen container at z-[10000] with live clock and date', () => {
    render(<LockScreen />);
    const lockScreen = screen.getByTestId('lock-screen');
    expect(lockScreen).toBeInTheDocument();
    expect(lockScreen).toHaveClass('z-[10000]');

    const clock = screen.getByTestId('lock-screen-clock');
    expect(clock).toBeInTheDocument();
    // Verify 2-digit:2-digit format
    expect(clock.textContent).toMatch(/^\d{2}:\d{2}$/);

    const date = screen.getByTestId('lock-screen-date');
    expect(date).toBeInTheDocument();
    // Verify "Weekday, Month DD" format
    expect(date.textContent).toMatch(/^[A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2}$/);
  });

  it('renders "Welcome to" header and "Naseer.dev" brand title and Enter Desktop button', () => {
    render(<LockScreen />);
    expect(screen.getByText(/welcome to/i)).toBeInTheDocument();

    const brand = screen.getByTestId('lock-screen-brand');
    expect(brand).toBeInTheDocument();
    expect(brand.textContent).toContain('Naseer.dev');

    const unlockBtn = screen.getByTestId('lock-screen-unlock-btn');
    expect(unlockBtn).toBeInTheDocument();
  });

  it('dismisses lock screen on Enter Desktop button click', () => {
    render(<LockScreen />);
    const unlockBtn = screen.getByTestId('lock-screen-unlock-btn');

    fireEvent.click(unlockBtn);
    expect(useOSStore.getState().isLocked).toBe(false);
  });

  it('updates live clock every second', () => {
    render(<LockScreen />);
    const clock = screen.getByTestId('lock-screen-clock');
    const initialTime = clock.textContent;

    act(() => {
      vi.advanceTimersByTime(60000); // Advance 1 minute
    });

    expect(clock.textContent).not.toBe(initialTime);
  });

  it('dismisses lock screen on user click', () => {
    render(<LockScreen />);
    const lockScreen = screen.getByTestId('lock-screen');

    fireEvent.click(lockScreen);
    expect(useOSStore.getState().isLocked).toBe(false);
  });

  it('dismisses lock screen on keyboard keydown', () => {
    render(<LockScreen />);
    expect(useOSStore.getState().isLocked).toBe(true);

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    expect(useOSStore.getState().isLocked).toBe(false);
  });

  it('loads wallpaper styling dynamically from active wallpaperId', () => {
    useOSStore.setState({ wallpaperId: 'sequoia-dark' });
    render(<LockScreen />);
    const bg = screen.getByTestId('lock-screen-wallpaper');
    expect(bg.style.background).toContain('radial-gradient');
  });
});
