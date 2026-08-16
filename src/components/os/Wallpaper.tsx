'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getWallpaperById } from '@/lib/constants/wallpapers';
import { useOSStore } from '@/hooks/useOSStore';

interface WallpaperProps {
  wallpaperId?: string;
  className?: string;
}

export const Wallpaper: React.FC<WallpaperProps> = ({
  wallpaperId: propWallpaperId,
  className,
}) => {
  const storeWallpaperId = useOSStore((state) => state.wallpaperId);
  const theme = useOSStore((state) => state.theme);
  const customWallpaperUrl = useOSStore((state) => state.customWallpaperUrl);

  const activeWallpaperId = propWallpaperId || storeWallpaperId || 'sonoma-dark';
  const currentWallpaper = getWallpaperById(activeWallpaperId);

  return (
    <div
      data-testid="wallpaper-container"
      className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none ${
        className || ''
      }`}
      aria-hidden="true"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={currentWallpaper.id}
          data-testid="wallpaper-plane"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
          style={{
            background: currentWallpaper.fallbackGradient,
          }}
        >
          {activeWallpaperId === 'custom' && customWallpaperUrl ? (
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
        </motion.div>
      </AnimatePresence>

      {/* Theme Tint Overlay */}
      <div
        data-testid="wallpaper-overlay"
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 backdrop-brightness-95 ${
          theme === 'light' ? currentWallpaper.lightOverlay : currentWallpaper.darkOverlay
        }`}
      />
    </div>
  );
};
