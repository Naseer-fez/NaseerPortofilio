import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LockScreen } from '@/components/os/LockScreen';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { WALLPAPERS } from '@/config/wallpapers';

describe('CHALLENGER-1: LockScreen Adversarial Stress & Boundary Suite', () => {
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
    vi.restoreAllMocks();
  });

  /* ========================================================================== */
  /* 1. RAPID CLICKS & CONCURRENT INTERACTION STRESS                            */
  /* ========================================================================== */
  describe('1. Rapid Clicks & High-Frequency Interaction Stress', () => {
    it('survives 100 rapid consecutive click events without crashing or corrupting store', () => {
      const playFxSpy = vi.spyOn(GlobalAudioManager.getInstance(), 'playFx');
      render(<LockScreen />);
      const lockOverlay = screen.getByTestId('lock-screen');

      // Rapidly fire 100 click events
      for (let i = 0; i < 100; i++) {
        fireEvent.click(lockOverlay);
      }

      expect(useOSStore.getState().isLocked).toBe(false);
      expect(playFxSpy).toHaveBeenCalled();
      expect(playFxSpy).toHaveBeenCalledWith('window-open');
    });

    it('gracefully handles sound FX failure when WebAudio throws on click', () => {
      vi.spyOn(GlobalAudioManager.getInstance(), 'playFx').mockImplementation(() => {
        throw new Error('AudioContext blocked by browser policy');
      });

      render(<LockScreen />);
      const lockOverlay = screen.getByTestId('lock-screen');

      // Click should still cleanly unlock despite audio failure
      expect(() => {
        fireEvent.click(lockOverlay);
      }).not.toThrow();

      expect(useOSStore.getState().isLocked).toBe(false);
    });

    it('does not trigger audio FX on unlock if soundEnabled is false', () => {
      useOSStore.setState({ soundEnabled: false });
      const playFxSpy = vi.spyOn(GlobalAudioManager.getInstance(), 'playFx');

      render(<LockScreen />);
      const lockOverlay = screen.getByTestId('lock-screen');
      fireEvent.click(lockOverlay);

      expect(useOSStore.getState().isLocked).toBe(false);
      expect(playFxSpy).not.toHaveBeenCalled();
    });
  });

  /* ========================================================================== */
  /* 2. KEYPRESS DISMISSALS & LISTENER LIFECYCLE                                */
  /* ========================================================================== */
  describe('2. Keypress Dismissals & Event Listener Lifecycle', () => {
    const keyMatrix = [
      { key: 'Enter', code: 'Enter' },
      { key: ' ', code: 'Space' },
      { key: 'Escape', code: 'Escape' },
      { key: 'Tab', code: 'Tab' },
      { key: 'Backspace', code: 'Backspace' },
      { key: 'Delete', code: 'Delete' },
      { key: 'Shift', code: 'ShiftLeft' },
      { key: 'Control', code: 'ControlLeft' },
      { key: 'Alt', code: 'AltLeft' },
      { key: 'Meta', code: 'MetaLeft' },
      { key: 'ArrowUp', code: 'ArrowUp' },
      { key: 'ArrowDown', code: 'ArrowDown' },
      { key: 'ArrowLeft', code: 'ArrowLeft' },
      { key: 'ArrowRight', code: 'ArrowRight' },
      { key: 'F1', code: 'F1' },
      { key: 'F12', code: 'F12' },
      { key: 'a', code: 'KeyA' },
      { key: 'Z', code: 'KeyZ' },
      { key: '1', code: 'Digit1' },
      { key: '!', code: 'Digit1' },
      { key: 'Process', code: 'Process' }, // IME
    ];

    keyMatrix.forEach(({ key, code }) => {
      it(`dismisses lock screen on '${key}' keydown`, () => {
        useOSStore.setState({ isLocked: true });
        const { unmount } = render(<LockScreen />);

        expect(useOSStore.getState().isLocked).toBe(true);
        fireEvent.keyDown(window, { key, code });
        expect(useOSStore.getState().isLocked).toBe(false);

        unmount();
      });
    });

    it('detaches keydown event listener immediately when unlocked to prevent listener leaks', () => {
      const playFxSpy = vi.spyOn(GlobalAudioManager.getInstance(), 'playFx');
      render(<LockScreen />);

      // Unlock via first keypress
      fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
      expect(useOSStore.getState().isLocked).toBe(false);
      const callCountAfterFirstUnlock = playFxSpy.mock.calls.length;

      // Fire 50 subsequent keydown events while unlocked
      for (let i = 0; i < 50; i++) {
        fireEvent.keyDown(window, { key: 'Space', code: 'Space' });
      }

      // No additional FX or unlocks should have occurred
      expect(playFxSpy.mock.calls.length).toBe(callCountAfterFirstUnlock);
      expect(useOSStore.getState().isLocked).toBe(false);
    });

    it('re-attaches keydown listener cleanly when system is re-locked', () => {
      const { rerender } = render(<LockScreen />);

      // 1. Unlock
      fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
      expect(useOSStore.getState().isLocked).toBe(false);

      // 2. Re-lock from store
      act(() => {
        useOSStore.getState().lock();
      });
      rerender(<LockScreen />);
      expect(useOSStore.getState().isLocked).toBe(true);

      // 3. Unlock again via keypress
      fireEvent.keyDown(window, { key: 'Space', code: 'Space' });
      expect(useOSStore.getState().isLocked).toBe(false);
    });
  });

  /* ========================================================================== */
  /* 3. UNLOCK / LOCK STATE TOGGLING STORM                                      */
  /* ========================================================================== */
  describe('3. Unlock / Lock State Toggling Storm', () => {
    it('survives 300 rapid alternating lock/unlock cycles maintaining state invariant', () => {
      const { rerender } = render(<LockScreen />);

      for (let i = 0; i < 300; i++) {
        act(() => {
          if (i % 2 === 0) {
            useOSStore.getState().unlock();
          } else {
            useOSStore.getState().lock();
          }
        });
        rerender(<LockScreen />);

        const expectedLocked = i % 2 !== 0;
        expect(useOSStore.getState().isLocked).toBe(expectedLocked);
      }

      // Final lock state check
      act(() => {
        useOSStore.getState().lock();
      });
      rerender(<LockScreen />);
      expect(screen.getByTestId('lock-screen')).toBeInTheDocument();

      // Final unlock state check with timers advance for exit transition
      act(() => {
        useOSStore.getState().unlock();
        vi.advanceTimersByTime(1000);
      });
      rerender(<LockScreen />);
      expect(useOSStore.getState().isLocked).toBe(false);
    });
  });

  /* ========================================================================== */
  /* 4. HYDRATION, CLOCK FORMATTING & TIMEZONE BOUNDARIES                       */
  /* ========================================================================== */
  describe('4. Hydration & Timestamp Boundary Formatting', () => {
    const boundaryDates = [
      {
        iso: '2026-01-01T00:00:00',
        expectedTime: '00:00',
        expectedDate: 'Thursday, January 1',
        label: 'Midnight on New Year',
      },
      {
        iso: '2026-07-04T09:05:00',
        expectedTime: '09:05',
        expectedDate: 'Saturday, July 4',
        label: 'Single digit hour and minute padding (09:05)',
      },
      {
        iso: '2026-08-15T12:00:00',
        expectedTime: '12:00',
        expectedDate: 'Saturday, August 15',
        label: 'Noon standard',
      },
      {
        iso: '2026-10-31T15:09:00',
        expectedTime: '15:09',
        expectedDate: 'Saturday, October 31',
        label: 'Afternoon single-digit minute (15:09)',
      },
      {
        iso: '2026-12-31T23:59:59',
        expectedTime: '23:59',
        expectedDate: 'Thursday, December 31',
        label: 'End of year late night (23:59)',
      },
      {
        iso: '2024-02-29T14:30:00',
        expectedTime: '14:30',
        expectedDate: 'Thursday, February 29',
        label: 'Leap day leap year (Feb 29)',
      },
    ];

    boundaryDates.forEach(({ iso, expectedTime, expectedDate, label }) => {
      it(`formats clock and date accurately for ${label}`, () => {
        vi.setSystemTime(new Date(iso));
        const { unmount } = render(<LockScreen />);

        const clock = screen.getByTestId('lock-screen-clock');
        const date = screen.getByTestId('lock-screen-date');

        expect(clock.textContent).toBe(expectedTime);
        expect(date.textContent).toBe(expectedDate);

        unmount();
      });
    });

    it('handles all 7 days of week and 12 months correctly in date string', () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      // Test one date for each month of 2026
      for (let m = 0; m < 12; m++) {
        const testDate = new Date(2026, m, 15, 10, 0, 0);
        vi.setSystemTime(testDate);

        const { unmount } = render(<LockScreen />);
        const dateEl = screen.getByTestId('lock-screen-date');

        const expectedDayName = days[testDate.getDay()];
        const expectedMonthName = months[m];
        expect(dateEl.textContent).toBe(`${expectedDayName}, ${expectedMonthName} 15`);

        unmount();
      }
    });
  });

  /* ========================================================================== */
  /* 5. CLOCK UPDATE INTERVALS & DRIFT RESILIENCE                               */
  /* ========================================================================== */
  describe('5. Clock Update Intervals & Timer Clearance', () => {
    it('increments time reliably across simulated minute rolls', () => {
      vi.setSystemTime(new Date('2026-08-15T11:59:58'));
      render(<LockScreen />);

      const clock = screen.getByTestId('lock-screen-clock');
      expect(clock.textContent).toBe('11:59');

      // Advance 2 seconds -> should flip to 12:00
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(clock.textContent).toBe('12:00');

      // Advance 60 seconds -> 12:01
      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(clock.textContent).toBe('12:01');
    });

    it('clears interval on unmount so no timer leaks occur', () => {
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
      const { unmount } = render(<LockScreen />);

      unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('advances across a full 24-hour cycle smoothly without interval degradation', () => {
      vi.setSystemTime(new Date('2026-08-15T00:00:00'));
      render(<LockScreen />);
      const clock = screen.getByTestId('lock-screen-clock');
      const date = screen.getByTestId('lock-screen-date');

      expect(clock.textContent).toBe('00:00');
      expect(date.textContent).toBe('Saturday, August 15');

      // Advance 24 hours in 1-hour chunks
      for (let h = 1; h <= 24; h++) {
        act(() => {
          vi.advanceTimersByTime(3600 * 1000);
        });
      }

      // Next day midnight
      expect(clock.textContent).toBe('00:00');
      expect(date.textContent).toBe('Sunday, August 16');
    });
  });

  /* ========================================================================== */
  /* 6. WALLPAPER CONFIG DYNAMIC SWITCHING & STYLING                            */
  /* ========================================================================== */
  describe('6. Wallpaper Dynamic Adaptation & Z-Index Layering', () => {
    it('dynamically adapts background gradient across all registered catalog wallpapers', () => {
      const { rerender } = render(<LockScreen />);

      WALLPAPERS.forEach((wp) => {
        act(() => {
          useOSStore.setState({ wallpaperId: wp.id });
        });
        rerender(<LockScreen />);

        const bg = screen.getByTestId('lock-screen-wallpaper');
        expect(bg.style.background).toBe(wp.fallbackGradient);
      });
    });

    it('falls back safely when wallpaperId is invalid or unknown', () => {
      useOSStore.setState({ wallpaperId: 'non-existent-wallpaper-xyz' });
      render(<LockScreen />);

      const bg = screen.getByTestId('lock-screen-wallpaper');
      expect(bg).toBeInTheDocument();
      // Should fall back to default catalog wallpaper (Sonoma Dark)
      expect(bg.style.background).toContain('radial-gradient');
    });

    it('maintains strict z-[10000] layer stacking invariant', () => {
      render(<LockScreen />);
      const lockScreen = screen.getByTestId('lock-screen');
      expect(lockScreen).toHaveClass('z-[10000]');
    });
  });
});
