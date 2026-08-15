'use client';

import React from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// Layer 0: Wallpaper & Kinetic Hero Stage
import { Wallpaper } from '@/components/os/Wallpaper';
import { KineticHeroStage } from '@/components/typography/KineticHeroStage';

// Layer 1: Desktop Canvas & Grid
import { DesktopCanvas } from '@/components/os/DesktopCanvas';
import { DesktopGrid } from '@/components/os/DesktopGrid';

// Layer 2: Window Manager
import { WindowManager, APP_REGISTRY } from '@/components/window/WindowManager';

// Layer 3: Top Menu Bar
import { TopMenuBar } from '@/components/os/TopMenuBar';

// Layer 4: Dock
import { Dock } from '@/components/dock/Dock';

// Layer 5: Audio Deck Expanded
import { AudioDeckExpandedCard } from '@/components/music/AudioDeckExpandedCard';

// Layer 6: Spotlight Search & Context Menu
import { SpotlightSearch } from '@/components/os/SpotlightSearch';
import { ContextMenu } from '@/components/os/ContextMenu';

// Layer 7: Kinetic Cursor
import { KineticCursor } from '@/components/cursor/KineticCursor';

// Global & Mobile
import { GlobalKeyboardListener } from '@/components/os/GlobalKeyboardListener';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { MobileTabBar } from '@/components/mobile/MobileTabBar';
import { MobileStickyAudioBar } from '@/components/mobile/MobileStickyAudioBar';

export default function DesktopPage() {
  const windows = useOSStore(state => state.windows);
  const { isMobile } = useBreakpoint();

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-stone-950">
      {/* Global Keyboard Shortcuts Listener */}
      <GlobalKeyboardListener />

      {/* Layer 0 (z-0): Wallpaper & Kinetic Typography Stage */}
      <Wallpaper />
      <KineticHeroStage />

      {/* Layer 1 (z-10): Desktop Canvas & Icon Grid */}
      <DesktopCanvas>
        <DesktopGrid />
      </DesktopCanvas>

      {/* Layer 2 (z-20..49): Window Manager */}
      <WindowManager />

      {/* Mobile Layer: Mobile Bottom Sheets for Open Windows */}
      {isMobile &&
        Object.values(windows || {}).map(win => {
          if (!win.isOpen) return null;
          const AppComponent = APP_REGISTRY[win.id];
          return (
            <MobileBottomSheet key={win.id} windowState={win}>
              {AppComponent ? <AppComponent /> : null}
            </MobileBottomSheet>
          );
        })}

      {/* Layer 3 (z-50): Top Menu Bar */}
      <TopMenuBar />

      {/* Layer 4 (z-[9990]): Dock */}
      <Dock />

      {/* Mobile Sticky Audio Bar & Tab Bar */}
      <MobileStickyAudioBar />
      <MobileTabBar />

      {/* Layer 5 (z-[9992]): Audio Deck Expanded Card */}
      <AudioDeckExpandedCard />

      {/* Layer 6 (z-[9995]): Spotlight Search & Context Menu */}
      <SpotlightSearch />
      <ContextMenu />

      {/* Layer 7 (z-[9999]): Kinetic Cursor */}
      <KineticCursor />
    </main>
  );
}
