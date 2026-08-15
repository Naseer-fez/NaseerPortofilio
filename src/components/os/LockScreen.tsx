'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/hooks/useOSStore';
import { getWallpaperById } from '@/config/wallpapers';
import { KineticBrandTitle } from '@/components/typography/KineticBrandTitle';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';

export function LockScreen() {
  const isLocked = useOSStore((state) => state.isLocked);
  const unlock = useOSStore((state) => state.unlock);
  const wallpaperId = useOSStore((state) => state.wallpaperId);
  const soundEnabled = useOSStore((state) => state.soundEnabled);

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentWallpaper = getWallpaperById(wallpaperId);

  const handleUnlock = useCallback(() => {
    if (soundEnabled) {
      try {
        GlobalAudioManager.getInstance().playFx('window-open');
      } catch {
        // Safe fallback
      }
    }
    unlock();
  }, [soundEnabled, unlock]);

  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Unlock on any interactive keypress
      handleUnlock();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, handleUnlock]);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

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
  const dateString = `${days[currentTime.getDay()]}, ${months[currentTime.getMonth()]} ${currentTime.getDate()}`;

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          key="lock-screen-overlay"
          data-testid="lock-screen"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{
            y: '-100%',
            opacity: 0.95,
            transition: {
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          onClick={handleUnlock}
          className="fixed inset-0 z-[10000] w-screen h-screen overflow-hidden flex flex-col justify-between items-center select-none cursor-pointer"
        >
          {/* Background Wallpaper */}
          <div className="absolute inset-0 -z-10 w-full h-full">
            <div
              data-testid="lock-screen-wallpaper"
              className="w-full h-full"
              style={{ background: currentWallpaper.fallbackGradient }}
            />
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[4px]" />
          </div>

          {/* Top Clock & Date Display */}
          <div className="pt-14 sm:pt-20 flex flex-col items-center pointer-events-none">
            <span
              data-testid="lock-screen-clock"
              suppressHydrationWarning
              className="text-7xl sm:text-8xl md:text-9xl font-semibold tracking-tight text-white/95 font-sans drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
            >
              {timeString}
            </span>
            <span
              data-testid="lock-screen-date"
              suppressHydrationWarning
              className="text-lg sm:text-xl md:text-2xl font-medium text-white/85 mt-2 drop-shadow-md"
            >
              {dateString}
            </span>
          </div>

          {/* Center Brand Showcase with Kinetic Physics */}
          <div className="flex flex-col items-center justify-center my-auto text-center px-4">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-white/70 mb-3 drop-shadow">
              Welcome to
            </p>
            <KineticBrandTitle text="Irfan.dev" />
          </div>

          {/* Bottom Unlock Prompt */}
          <div className="pb-10 text-center pointer-events-none">
            <p className="text-xs sm:text-sm text-white/60 tracking-widest uppercase animate-pulse drop-shadow">
              Click anywhere or press any key to unlock
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
