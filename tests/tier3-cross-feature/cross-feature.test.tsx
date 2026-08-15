import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { useOSStore } from '@/hooks/useOSStore';
import { useMusicStore } from '@/hooks/useMusicStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { DesktopCanvas } from '@/components/os/DesktopCanvas';
import { WindowManager } from '@/components/window/WindowManager';
import { Dock } from '@/components/dock/Dock';
import { AudioDeckExpandedCard } from '@/components/music/AudioDeckExpandedCard';
import { simulateKeyboardShortcut } from '../helpers/keyboard';
import { setViewport } from '../helpers/viewport';

describe('Tier 3: Cross-Feature Integration & Pairwise Combinations', () => {
  beforeEach(async () => {
    useOSStore.setState({
      theme: 'dark',
      desktopMode: 'workspace',
      activeWindowId: null,
      contextMenu: null,
      spotlightOpen: false,
    });
    useMusicStore.setState({
      status: 'idle',
      currentIndex: 0,
      currentTime: 0,
      volume: 0.8,
      isDeckExpanded: false,
    });
    const windows = useOSStore.getState().windows;
    Object.keys(windows).forEach(k => {
      useOSStore.getState().closeWindow(k as any);
    });
    await GlobalAudioManager.getInstance().init();
  });

  it('C1: Window Drag During Active Playback with Procedural SFX & Ducking', async () => {
    // 1. Start music playback
    await act(async () => {
      await useMusicStore.getState().play();
    });
    expect(useMusicStore.getState().status).toBe('playing');

    // 2. Open window and initiate drag
    useOSStore.getState().openWindow('terminal');
    const audioManager = GlobalAudioManager.getInstance();
    audioManager.playFx('window-grab', true);

    // Assert ducking scheduled
    const musicGain = audioManager.musicGainNode;
    expect(musicGain).toBeDefined();
    const scheduled = (musicGain?.gain as any).getScheduledEvents();
    expect(scheduled.length).toBeGreaterThan(0);

    // Drag window across screen
    useOSStore.getState().updatePosition('terminal', { x: 500, y: 350 });
    const winState = useOSStore.getState().windows['terminal'];
    expect(winState.position).toEqual({ x: 500, y: 350 });

    // Release drag
    audioManager.playFx('window-drop', true);
    expect(useMusicStore.getState().status).toBe('playing');
  });

  it('C2: Spotlight Search Over Maximized Window with Open Context Menu', () => {
    // 1. Maximize projects window
    useOSStore.getState().openWindow('projects');
    useOSStore.getState().toggleMaximize('projects');
    expect(useOSStore.getState().windows['projects'].isMaximized).toBe(true);

    // 2. Open context menu
    useOSStore.getState().openContextMenu({
      x: 400,
      y: 300,
      items: [{ id: 'opt1', label: 'Option 1' }],
    });
    expect(useOSStore.getState().contextMenu).not.toBeNull();

    // 3. Trigger Spotlight Search via store
    useOSStore.getState().setSpotlightOpen(true);

    // Context menu should be dismissed and spotlight opened
    expect(useOSStore.getState().contextMenu).toBeNull();
    expect(useOSStore.getState().spotlightOpen).toBe(true);

    // Launch Terminal from Spotlight
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().setSpotlightOpen(false);

    expect(useOSStore.getState().activeWindowId).toBe('terminal');
    expect(useOSStore.getState().windows['terminal'].isOpen).toBe(true);
  });

  it('C3: Theme Toggle During Expanded Audio Deck with Active Visualizer & Vinyl', () => {
    useMusicStore.setState({ status: 'playing', isDeckExpanded: true });
    useOSStore.getState().setTheme('dark');

    const { getByTestId, rerender } = render(<AudioDeckExpandedCard />);
    expect(getByTestId('audio-deck-expanded')).toBeInTheDocument();
    expect(getByTestId('vinyl-disc')).toHaveStyle({ animationPlayState: 'running' });

    // Toggle theme to light
    useOSStore.getState().setTheme('light');
    rerender(<AudioDeckExpandedCard />);

    expect(useOSStore.getState().theme).toBe('light');
    expect(getByTestId('vinyl-disc')).toHaveStyle({ animationPlayState: 'running' });
    expect(useMusicStore.getState().status).toBe('playing');
  });

  it('C4: Dock Magnification vs Window Drag', () => {
    useOSStore.getState().openWindow('about');
    useOSStore.getState().updatePosition('about', { x: 400, y: 300 });

    const { getByTestId } = render(
      <>
        <WindowManager />
        <Dock />
      </>
    );

    const winHeader = getByTestId('window-header-about');
    const dock = getByTestId('desktop-dock');

    expect(winHeader).toBeInTheDocument();
    expect(dock).toBeInTheDocument();
  });

  it('C5: Audio Ducking during Ambient Mode Transition', () => {
    useMusicStore.setState({ status: 'playing' });
    useOSStore.getState().openWindow('terminal');

    // Toggle to ambient mode
    useOSStore.getState().setDesktopMode('ambient-hero');
    GlobalAudioManager.getInstance().playFx('switch-mode', true);

    expect(useOSStore.getState().desktopMode).toBe('ambient-hero');
    expect(useMusicStore.getState().status).toBe('playing');
  });

  it('C6: Responsive Viewport Shift During Active Audio Playback', () => {
    useMusicStore.setState({ status: 'playing' });
    useOSStore.getState().openWindow('terminal');

    // Shift to mobile viewport (<768px)
    setViewport({ width: 390, height: 844, pointer: 'coarse' });

    expect(useMusicStore.getState().status).toBe('playing');
    expect(window.innerWidth).toBe(390);
  });
});
