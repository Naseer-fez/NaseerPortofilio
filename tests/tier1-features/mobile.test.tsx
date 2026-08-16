import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { MobileTabBar } from '@/components/mobile/MobileTabBar';
import { MobileStickyAudioBar } from '@/components/mobile/MobileStickyAudioBar';
import { Dock } from '@/components/dock/Dock';
import { DesktopGrid } from '@/components/os/DesktopGrid';
import { useOSStore } from '@/hooks/useOSStore';
import { useMusicStore } from '@/hooks/useMusicStore';
import { setViewport } from '../helpers/viewport';
import { simulateMobileSwipe } from '../helpers/gesture';
import { fireEvent, act } from '@testing-library/react';

describe('Tier 1: Responsive Mobile Paradigm & Touch Gestures', () => {
  beforeEach(() => {
    setViewport({ width: 390, height: 844, pointer: 'coarse' });
    const windows = useOSStore.getState().windows;
    if (windows) {
      Object.keys(windows).forEach(k => {
        useOSStore.getState().closeWindow(k as any);
      });
    }
  });

  it('renders open window as 92vh bottom sheet with rounded top corners (#75, #60)', () => {
    useOSStore.getState().openWindow('about');
    const winState = useOSStore.getState().windows['about'];

    const { getByTestId } = render(<MobileBottomSheet windowState={winState} />);
    const sheet = getByTestId('mobile-bottom-sheet-about');

    expect(sheet).toBeInTheDocument();
    expect(sheet).toHaveStyle({
      height: '92vh',
      width: '100vw',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    });
  });

  it('dismisses bottom sheet when dragged down beyond 140px threshold (#76, #62)', () => {
    useOSStore.getState().openWindow('about');
    const winState = useOSStore.getState().windows['about'];

    const { getByTestId } = render(<MobileBottomSheet windowState={winState} />);
    const sheet = getByTestId('mobile-bottom-sheet-about');

    simulateMobileSwipe(sheet, { startY: 100, deltaY: 180 });

    expect(useOSStore.getState().windows['about'].isOpen).toBe(false);
  });

  it('cancels dismiss and springs back when swipe down is < 140px (#77)', () => {
    useOSStore.getState().openWindow('about');
    const winState = useOSStore.getState().windows['about'];

    const { getByTestId } = render(<MobileBottomSheet windowState={winState} />);
    const sheet = getByTestId('mobile-bottom-sheet-about');

    simulateMobileSwipe(sheet, { startY: 100, deltaY: 80 });

    expect(useOSStore.getState().windows['about'].isOpen).toBe(true);
  });

  it('protects against swipe-to-dismiss when content is scrolled down (#78)', () => {
    useOSStore.getState().openWindow('about');
    const winState = useOSStore.getState().windows['about'];

    const { getByTestId } = render(<MobileBottomSheet windowState={winState} />);
    const content = getByTestId('sheet-content-about');
    Object.defineProperty(content, 'scrollTop', { value: 60, writable: true });

    simulateMobileSwipe(content, { startY: 200, deltaY: 200 });

    expect(useOSStore.getState().windows['about'].isOpen).toBe(true);
  });

  it('renders 52px fixed mobile tab bar replacing desktop dock (#79, #82, #61)', () => {
    const { getByTestId } = render(
      <>
        <MobileTabBar />
        <Dock />
      </>
    );

    const tabBar = getByTestId('mobile-tab-bar');
    expect(tabBar).toBeInTheDocument();
    expect(tabBar).toHaveClass('fixed', 'bottom-0', 'h-[52px]');
  });

  it('renders 44px sticky audio bar above tab bar and expands on tap (#80, #81, #63)', () => {
    useMusicStore.setState({ currentIndex: 0, isDeckExpanded: false });

    const { getByTestId } = render(<MobileStickyAudioBar />);
    const audioBar = getByTestId('mobile-sticky-audio-bar');

    expect(audioBar).toBeInTheDocument();
    expect(audioBar).toHaveStyle({ height: '44px' });

    fireEvent.click(audioBar);
    expect(useMusicStore.getState().isDeckExpanded).toBe(true);
  });

  it('renders desktop icon grid on mobile screen (#83)', () => {
    const { getByTestId } = render(<DesktopGrid />);
    expect(getByTestId('desktop-grid')).toBeInTheDocument();
  });

  it('launches app bottom sheet on single tap from mobile tab bar (#84)', () => {
    const { getByTestId } = render(<MobileTabBar />);
    const tabItem = getByTestId('tab-bar-item-projects');

    fireEvent.click(tabItem);
    expect(useOSStore.getState().windows['projects'].isOpen).toBe(true);
  });
});
