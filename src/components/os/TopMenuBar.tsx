'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { DEFAULT_APPS } from '@/lib/constants/apps';
import {
  Wifi,
  Battery,
  Volume2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

// LiveClock Subcomponent with SSR Hydration Safety
export const LiveClock: React.FC = () => {
  const [timeString, setTimeString] = useState<string>('Sat Aug 15 12:51 PM');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const day = days[now.getDay()];
      const month = months[now.getMonth()];
      const date = now.getDate();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeString(`${day} ${month} ${date} ${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <span
        data-testid="menu-bar-clock"
        className="text-[12px] font-medium tracking-tight px-1.5"
      >
        Sat Aug 15 12:51 PM
      </span>
    );
  }

  return (
    <button
      type="button"
      data-testid="live-clock"
      className="text-[12px] font-medium tracking-tight px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default"
      aria-label="Current date and time"
    >
      <span data-testid="menu-bar-clock">{timeString}</span>
    </button>
  );
};

// Apple Logo SVG (14x14)
export const AppleLogo: React.FC<{ className?: string }> = ({
  className = 'w-3.5 h-3.5',
}) => (
  <svg
    viewBox="0 0 170 170"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.83-11.97-14.34-6.42-9.78-11.45-20.87-15.08-33.28-3.63-12.4-5.45-23.9-5.45-34.52 0-14.34 3.59-26.3 10.77-35.88 7.18-9.58 16.2-14.48 27.06-14.7 4.79 0 10.33 1.3 16.63 3.9 6.3 2.61 10.38 3.96 12.24 4.05 1.52-.1 5.82-1.5 12.89-4.22 7.07-2.72 12.8-3.86 17.18-3.41 12.61 1.09 22.45 6.08 29.53 14.99-11.09 6.74-16.52 16.09-16.31 28.04.22 9.57 3.92 17.5 11.09 23.8 7.18 6.3 15.76 9.89 25.76 10.76-2.17 6.74-4.89 13.59-8.15 20.54zM119.22 31.02c0-7.18 2.61-13.91 7.83-20.21 5.22-6.3 11.85-10.22 19.9-11.74.22 1.3.33 2.5.33 3.59 0 7.17-2.72 14.02-8.16 20.54-5.43 6.52-12.17 10.43-20.21 11.74-.22-1.09-.33-2.4-.33-3.92z" />
  </svg>
);

export const TopMenuBar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const activeWindowId = useOSStore((state) => state.activeWindowId);
  const openWindow = useOSStore((state) => state.openWindow);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const setSpotlightOpen = useOSStore((state) => state.setSpotlightOpen);
  const desktopMode = useOSStore((state) => state.desktopMode);
  const setDesktopMode = useOSStore((state) => state.setDesktopMode);
  const theme = useOSStore((state) => state.theme);
  const toggleTheme = useOSStore((state) => state.toggleTheme);

  const menuRef = useRef<HTMLDivElement>(null);

  // Active App Name resolution
  const activeApp = activeWindowId
    ? DEFAULT_APPS.find((a) => a.id === activeWindowId)
    : null;
  const activeAppName = activeApp ? activeApp.title : 'Finder';

  const toggleMenuDropdown = (menuId: string) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      ref={menuRef}
      data-testid="top-menu-bar"
      className="fixed top-0 left-0 right-0 h-[28px] h-7 z-50 px-3 flex items-center justify-between backdrop-blur-2xl bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10 shadow-sm text-neutral-900 dark:text-neutral-100 text-[12px] font-medium tracking-tight select-none transition-colors duration-200"
      style={{
        height: '28px',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
      }}
    >
      {/* Left Menu Section */}
      <div className="flex items-center gap-1">
        {/* Apple Logo Menu */}
        <div className="relative">
          <button
            type="button"
            data-testid="apple-menu-button"
            onClick={() => toggleMenuDropdown('apple')}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
            aria-label="Apple Menu"
          >
            <span data-testid="menu-bar-apple-logo">
              <AppleLogo />
            </span>
          </button>

          {openMenu === 'apple' && (
            <div
              data-testid="apple-menu-dropdown"
              className="absolute top-7 left-0 w-56 rounded-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-2xl py-1 text-[13px] z-50 text-neutral-800 dark:text-neutral-200"
            >
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  if (openWindow) openWindow('about');
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>About This Portfolio</span>
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  if (openWindow) openWindow('settings');
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>System Settings...</span>
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpenMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>App Store / GitHub...</span>
              </a>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  if (setDesktopMode) {
                    setDesktopMode(
                      desktopMode === 'workspace' ? 'ambient-hero' : 'workspace'
                    );
                  }
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>Sleep (Ambient Mode)</span>
                <span className="text-xs opacity-60">⌘⌥M</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>Restart OS...</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic App Title */}
        <span
          data-testid="active-app-name"
          style={{ fontSize: '12.5px', fontWeight: 600 }}
          className="text-[12.5px] font-semibold tracking-tight text-neutral-900 dark:text-white px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 cursor-default transition-colors"
        >
          <span
            data-testid="menu-bar-active-app"
            style={{ fontSize: '12.5px', fontWeight: 600 }}
          >
            {activeAppName}
          </span>
        </span>

        {/* Standard App Menus (hidden on <640px) */}
        <div className="hidden sm:flex items-center gap-0.5">
          {['File', 'Edit', 'View', 'Window', 'Help'].map((item) => (
            <div key={item} className="relative">
              <button
                type="button"
                data-testid={`menu-item-${item.toLowerCase()}`}
                onClick={() => toggleMenuDropdown(item)}
                className="px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default"
              >
                {item}
              </button>

              {openMenu === item && (
                <div className="absolute top-7 left-0 w-48 rounded-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-2xl py-1 text-[13px] z-50 text-neutral-800 dark:text-neutral-200">
                  {item === 'File' && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);
                        if (activeWindowId && closeWindow) closeWindow(activeWindowId);
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
                    >
                      <span>Close Window</span>
                      <span className="text-xs opacity-60">⌘W</span>
                    </button>
                  )}
                  {item === 'Edit' && (
                    <button
                      type="button"
                      disabled
                      className="w-full text-left px-3 py-1 opacity-40 cursor-default flex items-center justify-between"
                    >
                      <span>Undo</span>
                      <span className="text-xs opacity-60">⌘Z</span>
                    </button>
                  )}
                  {item === 'View' && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);
                        if (setDesktopMode) {
                          setDesktopMode(
                            desktopMode === 'workspace' ? 'ambient-hero' : 'workspace'
                          );
                        }
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
                    >
                      <span>Toggle Ambient Mode</span>
                      <span className="text-xs opacity-60">⌘⌥M</span>
                    </button>
                  )}
                  {item === 'Window' && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);
                        if (activeWindowId) {
                          useOSStore.getState().toggleMaximize(activeWindowId);
                        }
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
                    >
                      <span>Zoom / Maximize</span>
                    </button>
                  )}
                  {item === 'Help' && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);
                        if (openWindow) openWindow('about');
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white"
                    >
                      <span>Portfolio Help</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Status Tray */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Status tray icons container */}
        <div
          data-testid="status-tray-icons"
          style={{ gap: '10px' }}
          className="flex items-center space-x-[10px]"
        >
          {/* WiFi Indicator */}
          <button
            type="button"
            data-testid="wifi-indicator"
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default flex items-center justify-center"
            title="Wi-Fi: Connected to Gigabit Fiber"
            aria-label="Wi-Fi Status"
          >
            <Wifi
              data-testid="tray-icon-wifi"
              style={{ width: '16px', height: '16px' }}
              className="w-4 h-4"
            />
          </button>

          {/* Volume Indicator */}
          <div
            data-testid="tray-icon-volume"
            style={{ width: '16px', height: '16px' }}
            className="flex items-center justify-center cursor-default opacity-90"
            title="Volume: 100%"
          >
            <Volume2 className="w-4 h-4" />
          </div>

          {/* Battery Indicator */}
          <div
            data-testid="battery-indicator"
            className="flex items-center gap-1 px-1 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default text-[11px]"
            title="Battery: 100% (Plugged in)"
          >
            <span className="hidden sm:inline font-mono">100%</span>
            <Battery
              data-testid="tray-icon-battery"
              style={{ width: '16px', height: '16px' }}
              className="w-4 h-4"
            />
          </div>
        </div>

        {/* Spotlight Trigger */}
        <button
          type="button"
          data-testid="spotlight-button"
          onClick={() => {
            if (setSpotlightOpen) setSpotlightOpen(true);
          }}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
          title="Spotlight Search (⌘K)"
          aria-label="Open Spotlight Search"
        >
          <span data-testid="tray-btn-search">
            <Search className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* Control Center Toggle / Theme Toggle */}
        <button
          type="button"
          data-testid="control-center-button"
          onClick={() => {
            if (toggleTheme) toggleTheme();
          }}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode (⇧⌘D)`}
          aria-label="Toggle Control Center / Theme"
        >
          <span data-testid="tray-btn-control-center">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* LiveClock */}
        <LiveClock />
      </div>
    </header>
  );
};
