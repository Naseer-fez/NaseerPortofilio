import React, { useRef, useState, useEffect } from 'react';
import { AppId } from '../../types/os';
import { useWindowManager } from '../../context/WindowContext';
import { useAudio } from '../../context/AudioContext';
import { calculateDockIconWidth } from '../../utils/math';
import {
  FolderGit2,
  Terminal,
  User,
  Folder,
  Settings,
  Music,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  FolderGit2,
  Terminal,
  User,
  Folder,
  Settings,
  Music,
};

interface DockItemProps {
  id: AppId;
  title: string;
  icon: string;
  mouseX: number;
  isSpecialMusicToggle?: boolean;
}

export const DockItem: React.FC<DockItemProps> = ({
  id,
  title,
  icon,
  mouseX,
  isSpecialMusicToggle,
}) => {
  const { windows, openWindow, minimizeWindow, restoreWindow, focusWindow } = useWindowManager();
  const { toggleExpanded, isPlaying } = useAudio();

  const itemRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const tooltipTimeoutRef = useRef<number | null>(null);

  const win = windows[id];
  const isOpen = win?.isOpen || (isSpecialMusicToggle && isPlaying);
  const isFocused = win?.isFocused;
  const isMinimized = win?.isMinimized;

  // Calculate dynamic width using exact Cosine Proximity formula
  const [iconWidth, setIconWidth] = useState(40);

  useEffect(() => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      const targetWidth = calculateDockIconWidth(mouseX, iconCenterX, 40, 72, 150);
      setIconWidth(targetWidth);
    }
  }, [mouseX]);

  // Debounced Tooltip (140ms enter delay)
  const handleMouseEnter = () => {
    setIsHovered(true);
    tooltipTimeoutRef.current = window.setTimeout(() => {
      setShowTooltip(true);
    }, 140);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
  };

  const handleClick = () => {
    if (isSpecialMusicToggle) {
      toggleExpanded();
      return;
    }

    if (!win) return;

    if (!win.isOpen) {
      // Trigger launch bounce
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 650);
      openWindow(id);
    } else if (win.isMinimized) {
      restoreWindow(id);
    } else if (win.isFocused) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const IconComponent = ICON_MAP[icon] || Folder;

  return (
    <div
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative flex flex-col items-center justify-end group select-none cursor-pointer"
      style={{
        width: `${iconWidth}px`,
        height: '100%',
        transition: mouseX === Infinity ? 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }}
    >
      {/* Debounced Tooltip Pill */}
      {showTooltip && (
        <div
          className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-pill bg-[#0f0f12]/90 border border-white/15 backdrop-blur-md shadow-lg pointer-events-none z-50 whitespace-nowrap animate-popover-in"
        >
          <span className="text-[11.5px] font-medium text-white tracking-[-0.12px]">
            {title}
          </span>
        </div>
      )}

      {/* Main Icon Button */}
      <button
        className={`w-full aspect-square rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 duration-100 ${
          isBouncing ? 'animate-bounce' : ''
        }`}
        style={{
          width: `${iconWidth}px`,
          height: `${iconWidth}px`,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: isHovered
            ? '0 12px 24px -4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.3)'
            : '0 8px 16px -4px rgba(0,0,0,0.35)',
        }}
        aria-label={`Open ${title}`}
      >
        <IconComponent
          className="text-white drop-shadow transition-all"
          style={{
            width: `${Math.round(iconWidth * 0.52)}px`,
            height: `${Math.round(iconWidth * 0.52)}px`,
          }}
        />
      </button>

      {/* Active Running Status Dot */}
      <div className="h-1.5 flex items-center justify-center mt-1">
        {isOpen && (
          <span
            className={`w-1 h-1 rounded-full transition-all duration-200 ${
              isFocused
                ? 'bg-primary-dark shadow-[0_0_6px_rgba(41,151,255,0.9)] scale-125'
                : isMinimized
                ? 'bg-white/40'
                : 'bg-white/70'
            }`}
          />
        )}
      </div>
    </div>
  );
};
