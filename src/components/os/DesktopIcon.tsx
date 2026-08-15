'use client';

import React, { useEffect, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { AppMetadata } from '@/types/os';
import * as LucideIcons from 'lucide-react';

export interface DesktopIconProps {
  app: AppMetadata;
  isSelected?: boolean;
  onSelect?: (appId: string) => void;
  onOpen?: (appId: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  app,
  isSelected: propIsSelected,
  onSelect: propOnSelect,
  onOpen: propOnOpen,
}) => {
  const selectedIconIds = useOSStore((state) => state.selectedIconIds);
  const selectIcon = useOSStore((state) => state.selectIcon);
  const openWindow = useOSStore((state) => state.openWindow);
  const setContextMenu = useOSStore((state) => state.setContextMenu);
  const openContextMenu = useOSStore((state) => state.openContextMenu);

  const isSelected =
    propIsSelected !== undefined
      ? propIsSelected
      : selectedIconIds.includes(app.id);

  const handleSelect = propOnSelect || ((id: string) => selectIcon(id));
  const handleOpen = propOnOpen || ((id: string) => openWindow(id));

  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic Lucide icon resolution
  const iconsMap = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  const IconComponent = iconsMap[app.icon] || LucideIcons.AppWindow;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (clickTimeoutRef.current) {
      // Second click within 300ms -> Double Click Launch
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleOpen(app.id);
    } else {
      // First click -> select and start 300ms timer
      handleSelect(app.id);
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    handleOpen(app.id);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleOpen(app.id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelect(app.id);

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const x = Math.min(e.clientX, vw - 200);
    const y = Math.min(e.clientY, vh - 150);

    const menuPayload = {
      x,
      y,
      items: [
        {
          id: 'open-app',
          label: `Open ${app.title}`,
          action: () => handleOpen(app.id),
        },
        { id: 'sep-1', label: '', separator: true },
        {
          id: 'get-info',
          label: 'Get Info',
          action: () => handleOpen(app.id),
        },
      ],
    };

    if (openContextMenu) openContextMenu(menuPayload);
    else if (setContextMenu) setContextMenu(menuPayload);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen(app.id);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      data-testid={`desktop-icon-${app.id}`}
      tabIndex={0}
      role="button"
      aria-selected={isSelected ? 'true' : 'false'}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col items-center justify-start w-[92px] h-[104px] p-2 rounded-xl transition-transform duration-150 hover:scale-105 outline-none select-none pointer-events-auto cursor-default ${
        isSelected
          ? 'bg-white/15 border border-white/20 shadow-sm backdrop-blur-[2px]'
          : 'hover:bg-white/10 border border-transparent'
      }`}
      aria-label={`${app.title} application shortcut`}
    >
      {/* 48x48 Icon Frame */}
      <div
        data-testid={`desktop-icon-image-${app.id}`}
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-105 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] active:scale-95 shadow-inner"
        style={{
          width: '48px',
          height: '48px',
          background:
            app.gradient || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        }}
      >
        <IconComponent className="w-6 h-6 text-white drop-shadow" />
      </div>

      {/* 11px Two-Line Label */}
      <span
        data-testid={`desktop-icon-label-${app.id}`}
        style={{
          fontSize: '11px',
          maxWidth: '84px',
        }}
        className="mt-1.5 text-[11px] font-medium text-white text-center leading-tight max-w-[84px] line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] px-1 rounded"
      >
        {app.title}
      </span>
    </button>
  );
};
