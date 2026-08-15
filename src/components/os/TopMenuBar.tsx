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

function formatMenuBarTime(now: Date = new Date()): string {
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
  return `${day} ${month} ${date} ${hours}:${minutes} ${ampm}`;
}

// LiveClock Subcomponent with SSR Hydration Safety
export const LiveClock: React.FC = () => {
  const [timeString, setTimeString] = useState<string>(() => formatMenuBarTime());

  useEffect(() => {
    setTimeString(formatMenuBarTime());
    // Check every second but only trigger re-render when minute changes
    const interval = setInterval(() => {
      const next = formatMenuBarTime();
      setTimeString(prev => prev === next ? prev : next);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      type="button"
      data-testid="live-clock"
      className="text-[12px] font-medium tracking-tight px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-default"
      aria-label="Current date and time"
    >
      <span data-testid="menu-bar-clock" suppressHydrationWarning>
        {timeString}
      </span>
    </button>
  );
};

import { AppleLogo } from '@/components/icons/AppleLogo';
export { AppleLogo };

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
  const lock = useOSStore((state) => state.lock);

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
        {/* Custom Logo System Menu */}
        <div className="relative">
          <button
            type="button"
            data-testid="apple-menu-button"
            onClick={() => toggleMenuDropdown('apple')}
            className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors flex items-center justify-center"
            aria-label="System Menu"
          >
            <span data-testid="menu-bar-apple-logo" className="flex items-center">
              <img
                src="/name.png"
                alt="Naseer"
                className="h-[18px] w-auto max-h-[18px] object-contain select-none transition-transform hover:scale-105"
              />
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
                data-testid="apple-menu-lock-screen"
                onClick={() => {
                  setOpenMenu(null);
                  if (lock) lock();
                }}
                className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>Lock Screen</span>
                <span className="text-xs opacity-60">⌘⌃Q</span>
              </button>
              <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
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
                    <>
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
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          useOSStore.getState().resetIconPositions();
                          useOSStore.getState().resetCassettePosition();
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between"
                      >
                        <span>Reset Layout</span>
                        <span className="text-xs opacity-60">⌘R</span>
                      </button>
                    </>
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
