'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';

// Layer 0: Wallpaper & Kinetic Hero Stage
import { Wallpaper } from '@/components/os/Wallpaper';
import { KineticHeroStage } from '@/components/typography/KineticHeroStage';

// Layer 1: Desktop Canvas & Grid
import { DesktopCanvas } from '@/components/os/DesktopCanvas';

// Layer 2: Window Manager
import { WindowManager, APP_REGISTRY } from '@/components/window/WindowManager';

// Layer 3: Top Menu Bar
import { TopMenuBar } from '@/components/os/TopMenuBar';

// Layer 4: Dock
import { Dock } from '@/components/dock/Dock';

// Layer 5: Retro Cassette Music Player
import { RetroCassettePlayer } from '@/components/music/RetroCassettePlayer';

// Layer 6: Spotlight Search & Context Menu
import { SpotlightSearch } from '@/components/os/SpotlightSearch';

// Layer 7: Lock Screen
import { LockScreen } from '@/components/os/LockScreen';

// Layer 8: Kinetic Cursor
import { KineticCursor } from '@/components/cursor/KineticCursor';

// Mobile
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { MobileTabBar } from '@/components/mobile/MobileTabBar';
import { MobileStickyAudioBar } from '@/components/mobile/MobileStickyAudioBar';

export default function DesktopPage() {
  const [mounted, setMounted] = useState(false);
  const windows = useOSStore((state) => state.windows);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-stone-950">
      {/* Layer 0 (z-0): Wallpaper & Kinetic Typography Stage */}
      <Wallpaper />
      <KineticHeroStage />

      {/* Client-Only Hydrated Layers */}
      {mounted ? (
        <>
          {/* Layer 1 (z-10): Desktop Canvas (Icon Grid, Marquee, Context Menu) */}
          <DesktopCanvas withWallpaper={false} />

          {/* Layer 2 (z-20..49): Window Manager */}
          <WindowManager />

          {/* Mobile Layer: Mobile Bottom Sheets for Open Windows */}
          <div className="md:hidden">
            {Object.values(windows || {}).map((win) => {
              if (!win.isOpen) return null;
              const AppComponent = APP_REGISTRY[win.id];
              return (
                <MobileBottomSheet key={win.id} windowState={win}>
                  {AppComponent ? <AppComponent /> : null}
                </MobileBottomSheet>
              );
            })}
          </div>

          {/* Layer 3 (z-50): Top Menu Bar */}
          <TopMenuBar />

          {/* Layer 4 (z-[9990]): Dock */}
          <Dock />

          {/* Mobile Sticky Audio Bar & Tab Bar */}
          <MobileStickyAudioBar />
          <MobileTabBar />

          {/* Layer 5 (z-[9992]): Retro SONY Cassette Music Player Widget */}
          <RetroCassettePlayer />

          {/* Layer 6 (z-[9995]): Spotlight Search */}
          <SpotlightSearch />
        </>
      ) : null}

      {/* Layer 7 (z-[10000]): Lock Screen Layer */}
      <LockScreen />

      {/* Layer 8 (z-[10001]): Kinetic Cursor */}
      <KineticCursor />
    </main>
  );
}
