import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { useOSStore } from '@/hooks/useOSStore';
import { useMusicStore } from '@/hooks/useMusicStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { DesktopCanvas } from '@/components/os/DesktopCanvas';
import { WindowManager } from '@/components/window/WindowManager';
import { Dock } from '@/components/dock/Dock';
import { RetroCassettePlayer } from '@/components/music/RetroCassettePlayer';
import { TopMenuBar } from '@/components/os/TopMenuBar';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { MobileTabBar } from '@/components/mobile/MobileTabBar';
import { setViewport } from '../helpers/viewport';
import { simulateMobileSwipe } from '../helpers/gesture';

function FullDesktopApp() {
  return (
    <div id="os-root">
      <TopMenuBar />
      <DesktopCanvas />
      <WindowManager />
      <Dock />
      <RetroCassettePlayer />
    </div>
  );
}

describe('Tier 4: End-to-End Real-World Application Workflows', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    setViewport({ width: 1440, height: 900, pointer: 'fine' });

    useOSStore.setState({
      theme: 'dark',
      wallpaperId: 'sonoma-dark',
      desktopMode: 'workspace',
      activeWindowId: null,
      contextMenu: null,
      spotlightOpen: false,
      selectedIconIds: [],
    });

    useMusicStore.setState({
      status: 'idle',
      currentIndex: 0,
      currentTime: 0,
      volume: 0.8,
      isDeckExpanded: false,
    });

    const windows = useOSStore.getState().windows;
    if (windows) {
      Object.keys(windows).forEach(k => {
        useOSStore.getState().closeWindow(k as any);
      });
    }

    await GlobalAudioManager.getInstance().init();
  });

  it('Workflow 1: Desktop Exploration & Window Interaction Session', async () => {
    const { getByTestId } = render(<FullDesktopApp />);

    // 1. User clicks Desktop Icon to launch Terminal
    const termIcon = getByTestId('desktop-icon-terminal');
    fireEvent.click(termIcon);

    expect(useOSStore.getState().windows['terminal'].isOpen).toBe(true);
    expect(useOSStore.getState().activeWindowId).toBe('terminal');
    expect(getByTestId('window-terminal')).toBeInTheDocument();
    expect(getByTestId('active-app-name')).toHaveTextContent('Terminal');

    // 2. User plays background music
    await act(async () => {
      await useMusicStore.getState().play();
    });
    expect(useMusicStore.getState().status).toBe('playing');

    // 3. User switches theme to light
    useOSStore.getState().setTheme('light');
    expect(useOSStore.getState().theme).toBe('light');
  });

  it('Workflow 2: Music Discovery & Retro Cassette Interaction Journey', async () => {
    const { getByTestId } = render(<FullDesktopApp />);

    expect(getByTestId('retro-cassette-player')).toBeInTheDocument();

    // 1. Start playback
    await act(async () => {
      fireEvent.click(getByTestId('music-play-btn'));
    });
    expect(useMusicStore.getState().status).toBe('playing');
    expect(getByTestId('cassette-spool-left')).toHaveStyle({ animationPlayState: 'running' });

    // 2. Next track and seek
    fireEvent.click(getByTestId('music-next-btn'));
    expect(useMusicStore.getState().currentIndex).toBe(1);

    useMusicStore.getState().seekTo(80);
    expect(useMusicStore.getState().currentTime).toBe(80);

    // 3. Adjust volume
    fireEvent.change(getByTestId('music-volume-slider'), { target: { value: '0.6' } });
    expect(useMusicStore.getState().volume).toBe(0.6);
  });

  it('Workflow 3: Multi-Window Productivity & Cascade Management', () => {
    act(() => {
      useOSStore.getState().openWindow('terminal');
      useOSStore.getState().openWindow('projects');
      useOSStore.getState().openWindow('finder');
      useOSStore.getState().openWindow('about');
    });

    const { getByTestId } = render(<FullDesktopApp />);

    expect(useOSStore.getState().activeWindowId).toBe('about');

    // Minimize Projects
    fireEvent.click(getByTestId('traffic-light-minimize-projects'));
    expect(useOSStore.getState().windows['projects'].isMinimized).toBe(true);

    // Maximize and restore Finder
    fireEvent.click(getByTestId('traffic-light-maximize-finder'));
    expect(useOSStore.getState().windows['finder'].isMaximized).toBe(true);

    fireEvent.click(getByTestId('traffic-light-maximize-finder'));
    expect(useOSStore.getState().windows['finder'].isMaximized).toBe(false);
  });

  it('Workflow 4: Responsive Mobile Browsing Journey', () => {
    // 1. Switch to mobile viewport
    setViewport({ width: 390, height: 844, pointer: 'coarse' });

    // 2. Open About app bottom sheet
    useOSStore.getState().openWindow('about');
    const winState = useOSStore.getState().windows['about'];

    const { getByTestId } = render(
      <>
        <MobileBottomSheet windowState={winState} />
        <MobileTabBar />
      </>
    );

    const sheet = getByTestId('mobile-bottom-sheet-about');
    expect(sheet).toBeInTheDocument();

    // 3. Dismiss sheet via swipe down > 140px
    simulateMobileSwipe(sheet, { startY: 100, deltaY: 160 });
    expect(useOSStore.getState().windows['about'].isOpen).toBe(false);
  });

  it('Workflow 5: Theme, Wallpaper & Full Persistence Lifecycle', () => {
    // 1. Set theme, wallpaper, and seek music
    useOSStore.getState().setTheme('light');
    useOSStore.getState().setWallpaper('ventura-dark');
    useMusicStore.getState().setVolume(0.55);
    useMusicStore.getState().seekTo(95);

    // 2. Verify stored in localStorage
    expect(window.localStorage.getItem('os-theme')).toBe('light');
    expect(window.localStorage.getItem('os-wallpaper')).toBe('ventura-dark');
    expect(window.localStorage.getItem('music-volume')).toBe('0.55');
    expect(window.localStorage.getItem('music-current-time')).toBe('95');
  });
});
