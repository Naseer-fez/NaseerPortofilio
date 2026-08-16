'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronUp, Lock } from 'lucide-react';
import { useOSStore } from '@/hooks/useOSStore';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { getWallpaperById } from '@/config/wallpapers';
import { KineticBrandTitle } from '@/components/typography/KineticBrandTitle';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { PROFILE_DATA } from '@/data/profile';

export function LockScreen() {
  const { isMobile } = useBreakpoint();
  const isLocked = useOSStore((state) => state.isLocked);
  const unlock = useOSStore((state) => state.unlock);
  const wallpaperId = useOSStore((state) => state.wallpaperId);
  const customWallpaperUrl = useOSStore((state) => state.customWallpaperUrl);
  const loadCustomWallpaper = useOSStore((state) => state.loadCustomWallpaper);
  const soundEnabled = useOSStore((state) => state.soundEnabled);

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (wallpaperId === 'custom' && !customWallpaperUrl) {
      loadCustomWallpaper();
    }
  }, [wallpaperId, customWallpaperUrl, loadCustomWallpaper]);

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

    const handleKeyDown = (_e: KeyboardEvent) => {
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
          drag={!isMobile ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.7, bottom: 0.1 }}
          onDragEnd={(_e, info) => {
            if (info.offset.y < -50 || info.velocity.y < -200) {
              handleUnlock();
            }
          }}
          onClick={handleUnlock}
          className="fixed inset-0 z-[10000] w-screen h-screen overflow-hidden flex flex-col justify-between items-center select-none cursor-pointer touch-none p-6 sm:p-8"
        >
          {/* Background Wallpaper */}
          <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
            <div
              data-testid="lock-screen-wallpaper"
              className="w-full h-full transition-all duration-700"
              style={{ background: currentWallpaper.fallbackGradient }}
            >
              {wallpaperId === 'custom' && customWallpaperUrl ? (
                <img
                  src={customWallpaperUrl}
                  alt="Custom Wallpaper"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : currentWallpaper.src ? (
                <img
                  src={currentWallpaper.src}
                  alt={currentWallpaper.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : null}
            </div>
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[10px]" />
          </div>

          {/* TOP SECTION: Clock & Date Display */}
          <div className="flex flex-col items-center pointer-events-none mt-2 sm:mt-4">
            <div className="flex items-center gap-1.5 mb-2 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80 text-[11px] font-medium tracking-wide shadow-sm">
              <Lock className="w-3 h-3 text-white/70" />
              <span>NaseerOS Locked</span>
            </div>
            <span
              id="lock-screen-live-clock"
              data-testid="lock-screen-clock"
              suppressHydrationWarning
              className="text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-white/95 font-sans drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
            >
              {timeString}
            </span>
            <span
              id="lock-screen-live-date"
              data-testid="lock-screen-date"
              suppressHydrationWarning
              className="text-sm sm:text-base md:text-lg font-medium text-white/80 mt-0.5 drop-shadow-md"
            >
              {dateString}
            </span>
          </div>

          {/* MIDDLE SECTION: Interactive Kinetic Brand + macOS User Profile Card */}
          <div className="flex flex-col items-center justify-center my-auto text-center px-4 w-full max-w-sm gap-3 sm:gap-4">
            {/* Refined Welcome & Single-Line Kinetic Brand Title */}
            <div className="flex flex-col items-center">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-white/60 drop-shadow mb-0.5">
                Welcome to
              </p>
              <KineticBrandTitle
                text="Naseer.dev"
                textClassName="text-3xl sm:text-4xl md:text-[42px]"
                influenceRadius={200}
                maxDisplacement={30}
              />
            </div>

            {/* macOS User Avatar & Unlock Card - Instant rendering without pop-in */}
            <motion.div
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                handleUnlock();
              }}
              className="group relative w-full rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-2xl border border-white/20 hover:border-white/30 p-4 sm:p-5 shadow-2xl transition-all duration-200 flex flex-col items-center gap-2.5 cursor-pointer hover:shadow-cyan-500/10 hover:-translate-y-0.5"
            >
              {/* User Avatar with Glowing Ring */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-700 overflow-hidden group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/logo.png"
                  alt={PROFILE_DATA.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg sm:text-xl tracking-wider pointer-events-none -z-10">
                  SN
                </div>
              </div>

              {/* Name & Role */}
              <div className="flex flex-col items-center text-center">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow">
                  {PROFILE_DATA.name}
                </h2>
                <p className="text-[11px] text-white/70 font-medium tracking-wide mt-0.5">
                  Backend & Systems Engineer
                </p>
              </div>

              {/* Enter Desktop Button */}
              <button
                type="button"
                data-testid="lock-screen-unlock-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnlock();
                }}
                className="mt-0.5 w-full py-1.5 sm:py-2 px-4 rounded-xl bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md group-hover:bg-blue-600/80 group-hover:border-blue-400/50"
              >
                <span>Enter Desktop</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* BOTTOM SECTION: Subtle Unlock Prompt */}
          <div className="text-center pointer-events-none flex flex-col items-center gap-1 mb-1 sm:mb-2">
            <ChevronUp className="w-4 h-4 text-white/50 animate-bounce" />
            <p className="text-[10px] sm:text-[11px] text-white/60 tracking-widest uppercase animate-pulse drop-shadow">
              Click anywhere, press any key, or swipe up to unlock
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
