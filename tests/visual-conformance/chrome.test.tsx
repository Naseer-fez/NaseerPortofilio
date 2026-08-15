import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { TopMenuBar } from '@/components/os/TopMenuBar';
import { useOSStore } from '@/hooks/useOSStore';

describe('Visual Conformance: Core OS Chrome & TopMenuBar', () => {
  beforeEach(() => {
    useOSStore.setState({ activeWindowId: null });
  });

  it('verifies fixed height of exactly 28px (#1)', () => {
    const { getByTestId } = render(<TopMenuBar />);
    const menuBar = getByTestId('top-menu-bar');

    expect(menuBar).toBeInTheDocument();
    expect(menuBar).toHaveStyle({ height: '28px' });
    expect(menuBar).toHaveClass('fixed', 'top-0');
  });

  it('verifies backdrop-filter blur(40px) and tokenized opacity (#2)', () => {
    const { getByTestId } = render(<TopMenuBar />);
    const menuBar = getByTestId('top-menu-bar');

    expect(menuBar).toMatchGlassmorphism({ blur: '40px' });
  });

  it('formats clock string as Day Mon DD H:MM AM/PM (#3)', () => {
    const { getByTestId } = render(<TopMenuBar />);
    const clock = getByTestId('menu-bar-clock');

    const clockRegex = /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2}\s\d{1,2}:\d{2}\s(AM|PM)$/;
    expect(clock.textContent).toMatch(clockRegex);
  });

  it('renders active application title in bold 12.5px font (#4)', () => {
    useOSStore.setState({ activeWindowId: 'terminal' });
    const { getByTestId } = render(<TopMenuBar />);

    const appTitle = getByTestId('active-app-name');
    expect(appTitle).toHaveTextContent('Terminal');
    expect(appTitle).toHaveStyle({
      fontSize: '12.5px',
      fontWeight: '600',
    });
  });

  it('renders status icons at 16x16px with 10px flex gap (#5)', () => {
    const { getByTestId } = render(<TopMenuBar />);
    const tray = getByTestId('status-tray-icons');

    expect(tray).toHaveStyle({ gap: '10px' });

    const wifi = getByTestId('tray-icon-wifi');
    const volume = getByTestId('tray-icon-volume');
    const battery = getByTestId('tray-icon-battery');

    expect(wifi).toHaveStyle({ width: '16px', height: '16px' });
    expect(volume).toHaveStyle({ width: '16px', height: '16px' });
    expect(battery).toHaveStyle({ width: '16px', height: '16px' });
  });
});
