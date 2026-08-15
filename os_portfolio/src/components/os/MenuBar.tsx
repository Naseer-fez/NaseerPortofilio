import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowContext';
import { useAudio } from '../../context/AudioContext';
import { ControlCenter } from './ControlCenter';
import {
  Wifi,
  BatteryCharging,
  Sliders,
  Music as MusicIcon,
} from 'lucide-react';

const MENU_DATA: Record<string, string[]> = {
  File: ['New Window', 'Open...', 'Close Window', 'Save As...', 'Quick Look'],
  Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Select All'],
  View: ['as Icons', 'as List', 'as Columns', 'Clean Up', 'Sort By...'],
  Window: ['Minimize', 'Zoom', 'Bring All to Front', 'Next Window'],
  Help: ['Portfolio OS Help', 'Keyboard Shortcuts', 'Source Code on GitHub'],
};

export const MenuBar: React.FC = () => {
  const { windows, activeWindowId, openWindow, toggleMaximize, closeWindow } = useWindowManager();
  const { isPlaying, currentTrack, toggleExpanded } = useAudio();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [timeString, setTimeString] = useState('');

  // Live system clock updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      setTimeString(now.toLocaleString('en-US', options).replace(/,/g, ''));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeApp = activeWindowId ? windows[activeWindowId] : null;
  const activeTitle = activeApp ? activeApp.title.split('—')[0].trim() : 'Finder';

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(prev => (prev === menuName ? null : menuName));
    setShowAppleMenu(false);
  };

  const handleAppleMenuClick = () => {
    setShowAppleMenu(prev => !prev);
    setActiveMenu(null);
  };

  const handleMenuItemAction = (menu: string, item: string) => {
    setActiveMenu(null);
    setShowAppleMenu(false);

    if (item === 'Close Window' && activeWindowId) {
      closeWindow(activeWindowId);
    } else if (item === 'Zoom' && activeWindowId) {
      toggleMaximize(activeWindowId);
    } else if (item === 'New Window' || item === 'Open...') {
      openWindow('projects');
    } else if (item === 'Source Code on GitHub') {
      window.open('https://github.com', '_blank');
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full h-7 glassmorphic-menubar z-50 flex items-center justify-between px-3 text-[12px] text-white/90 select-none"
        role="banner"
      >
        {/* Left Navigation Cluster */}
        <div className="flex items-center space-x-3.5">
          {/* Apple Crest Logo Button */}
          <div className="relative">
            <button
              onClick={handleAppleMenuClick}
              className="p-1 rounded hover:bg-white/15 transition-colors flex items-center justify-center font-bold text-[14px] leading-none"
              aria-label="Apple Menu"
            >
              
            </button>

            {/* Apple Menu Dropdown */}
            {showAppleMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAppleMenu(false)}
                />
                <div className="absolute top-7 left-0 w-52 py-1 glassmorphic-modal rounded-md shadow-player-modal z-50 text-[12.5px] border border-white/10 text-white/90 animate-popover-in">
                  <button
                    onClick={() => {
                      setShowAppleMenu(false);
                      openWindow('about');
                    }}
                    className="w-full text-left px-3 py-1 hover:bg-primary hover:text-white"
                  >
                    About This Portfolio
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    onClick={() => {
                      setShowAppleMenu(false);
                      openWindow('projects');
                    }}
                    className="w-full text-left px-3 py-1 hover:bg-primary hover:text-white"
                  >
                    Flagship Projects
                  </button>
                  <button
                    onClick={() => {
                      setShowAppleMenu(false);
                      openWindow('terminal');
                    }}
                    className="w-full text-left px-3 py-1 hover:bg-primary hover:text-white"
                  >
                    System Terminal
                  </button>
                  <button
                    onClick={() => {
                      setShowAppleMenu(false);
                      openWindow('finder');
                    }}
                    className="w-full text-left px-3 py-1 hover:bg-primary hover:text-white"
                  >
                    File System Explorer
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full text-left px-3 py-1 hover:bg-primary hover:text-white"
                  >
                    Restart Portfolio OS...
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Active Application Name */}
          <span className="font-bold tracking-tight text-white px-1">
            {activeTitle}
          </span>

          {/* Application Standard Menus (File, Edit, View, Window, Help) */}
          <nav className="hidden sm:flex items-center space-x-1">
            {Object.keys(MENU_DATA).map(menu => (
              <div key={menu} className="relative">
                <button
                  onClick={() => handleMenuClick(menu)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    activeMenu === menu
                      ? 'bg-white/20 text-white font-medium'
                      : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                >
                  {menu}
                </button>

                {/* Menu Dropdown */}
                {activeMenu === menu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setActiveMenu(null)}
                    />
                    <div className="absolute top-6 left-0 w-48 py-1 glassmorphic-modal rounded-md shadow-player-modal z-50 text-[12px] border border-white/10 text-white/90 animate-popover-in">
                      {MENU_DATA[menu].map(item => (
                        <button
                          key={item}
                          onClick={() => handleMenuItemAction(menu, item)}
                          className="w-full text-left px-3 py-1 hover:bg-primary hover:text-white transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Status Tray */}
        <div className="flex items-center space-x-3 text-white/80">
          {/* Music Playback Status Indicator */}
          {isPlaying && (
            <button
              onClick={toggleExpanded}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary-dark text-[11px] transition-colors"
              aria-label="Now Playing"
            >
              <MusicIcon className="w-3 h-3 animate-pulse" />
              <span className="max-w-[100px] truncate hidden md:inline">{currentTrack.title}</span>
            </button>
          )}

          {/* Battery Status */}
          <div className="flex items-center gap-1 text-[11.5px] tabular-nums" title="Battery: 100% Power Adapter">
            <span>100%</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          {/* Wi-Fi Status */}
          <div title="Wi-Fi: Connected">
            <Wifi className="w-3.5 h-3.5 text-white/70" />
          </div>

          {/* Control Center Trigger */}
          <button
            onClick={() => setShowControlCenter(v => !v)}
            className={`p-1 rounded hover:bg-white/15 transition-colors ${
              showControlCenter ? 'bg-white/20 text-white' : 'text-white/80'
            }`}
            aria-label="Control Center"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* System Date & Clock */}
          <span className="text-[12px] font-medium text-white/90 tabular-nums px-1">
            {timeString || 'Sat Aug 15 14:44'}
          </span>
        </div>
      </header>

      {/* Control Center Popover */}
      <ControlCenter
        isOpen={showControlCenter}
        onClose={() => setShowControlCenter(false)}
      />
    </>
  );
};
