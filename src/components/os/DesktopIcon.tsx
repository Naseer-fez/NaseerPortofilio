'use client';

import React, { useState, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { AppMetadata, Position } from '@/types/os';
import { AppIcon } from '@/components/icons/AppIcon';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export interface DesktopIconProps {
  app: AppMetadata;
  isSelected?: boolean;
  onSelect?: (appId: string) => void;
  onOpen?: (appId: string) => void;
  index?: number;
  isHovered?: boolean;
  isOtherHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  position?: Position;
  onPositionChange?: (position: Position) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  app,
  isSelected: propIsSelected,
  onSelect: propOnSelect,
  onOpen: propOnOpen,
  index = 0,
  isHovered: propIsHovered,
  isOtherHovered: propIsOtherHovered,
  onHoverChange,
  position,
  onPositionChange,
}) => {
  const selectedIconIds = useOSStore((state) => state.selectedIconIds);
  const selectIcon = useOSStore((state) => state.selectIcon);
  const openWindow = useOSStore((state) => state.openWindow);
  const setContextMenu = useOSStore((state) => state.setContextMenu);
  const openContextMenu = useOSStore((state) => state.openContextMenu);

  const [internalHovered, setInternalHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { isMobile } = useBreakpoint();

  const startPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragActiveRef = useRef(false);
  const hasMovedRef = useRef(false);

  const isActuallyHovered = propIsHovered !== undefined ? propIsHovered : internalHovered;
  const isActuallyOtherHovered = propIsOtherHovered !== undefined ? propIsOtherHovered : false;

  const isSelected =
    propIsSelected !== undefined
      ? propIsSelected
      : selectedIconIds.includes(app.id);

  const handleSelect = propOnSelect || ((id: string) => selectIcon(id));
  const handleOpen = propOnOpen || ((id: string) => openWindow(id));

  // Single-Click Launch with Immediate Selection and Audio Feedback
  const triggerLaunch = () => {
    try {
      GlobalAudioManager.getInstance().playFx('dock-bounce');
    } catch {
      // Safe fallback
    }
    handleSelect(app.id);
    handleOpen(app.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMovedRef.current) {
      triggerLaunch();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMovedRef.current) {
      triggerLaunch();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!hasMovedRef.current) {
      triggerLaunch();
    }
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
      triggerLaunch();
    }
  };

  const handleMouseEnter = () => {
    setInternalHovered(true);
    if (onHoverChange) onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setInternalHovered(false);
    if (!isDragActiveRef.current) {
      setIsPressed(false);
    }
    if (onHoverChange) onHoverChange(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left button for drag
    e.stopPropagation();
    setIsPressed(true);
    hasMovedRef.current = false;
    isDragActiveRef.current = true;
    startPointerRef.current = { x: e.clientX, y: e.clientY };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDragActiveRef.current) return;
      const dx = moveEvent.clientX - startPointerRef.current.x;
      const dy = moveEvent.clientY - startPointerRef.current.y;
      if (!hasMovedRef.current && Math.hypot(dx, dy) > 4) {
        hasMovedRef.current = true;
        setIsDragging(true);
        handleSelect(app.id);
        try {
          GlobalAudioManager.getInstance().playFx('window-grab');
        } catch {}
      }
      if (hasMovedRef.current) {
        setDragOffset({ x: dx, y: dy });
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      isDragActiveRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setIsPressed(false);

      if (hasMovedRef.current && position && onPositionChange) {
        const dx = upEvent.clientX - startPointerRef.current.x;
        const dy = upEvent.clientY - startPointerRef.current.y;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
        const newX = Math.max(8, Math.min(vw - 110, position.x + dx));
        const newY = Math.max(8, Math.min(vh - 180, position.y + dy));
        onPositionChange({ x: Math.round(newX), y: Math.round(newY) });
        try {
          GlobalAudioManager.getInstance().playFx('window-drop');
        } catch {}
      }

      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const isIdle = !isActuallyHovered && !isActuallyOtherHovered && !isPressed && !isDragging;

  const currentX = (position?.x || 0) + dragOffset.x;
  const currentY = (position?.y || 0) + dragOffset.y;

  return (
    <button
      type="button"
      data-testid={`desktop-icon-${app.id}`}
      data-cursor="magnetic-dock"
      tabIndex={0}
      role="button"
      aria-selected={isSelected ? 'true' : 'false'}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group flex flex-col items-center justify-start w-[94px] h-[108px] p-2 rounded-2xl transition-transform duration-150 hover:scale-105 transition-all duration-200 ease-out outline-none select-none pointer-events-auto cursor-pointer ${isMobile ? 'relative' : 'absolute'} ${
        isIdle ? 'animate-dock-breathe' : ''
      } ${
        isDragging
          ? 'scale-110 z-50 shadow-[0_24px_48px_rgba(0,0,0,0.7)] bg-white/20 border-white/30 cursor-grabbing opacity-100'
          : isPressed
          ? 'scale-90 z-40'
          : isActuallyHovered
          ? 'scale-[1.22] -translate-y-2 bg-white/25 border-white/40 shadow-[0_16px_36px_rgba(0,0,0,0.6)] backdrop-blur-lg z-30 opacity-100'
          : isActuallyOtherHovered
          ? 'scale-[0.82] opacity-70 border-transparent z-10'
          : isSelected
          ? 'scale-100 bg-white/15 border-white/20 shadow-md backdrop-blur-[4px] opacity-100 z-20'
          : 'scale-100 hover:bg-white/15 border-transparent opacity-100 z-10'
      } border`}
      style={{
        left: position && !isMobile ? `${currentX}px` : undefined,
        top: position && !isMobile ? `${currentY}px` : undefined,
        animationDelay: isIdle ? `${index * 0.15}s` : undefined,
        transformOrigin: 'center center',
      }}
      aria-label={`${app.title} application shortcut`}
    >
      {/* 48x48 Squircle AppIcon Frame with Dynamic Glow */}
      <div
        data-testid={`desktop-icon-image-${app.id}`}
        className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
          isActuallyHovered
            ? 'scale-115 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]'
            : isActuallyOtherHovered
            ? 'scale-95 opacity-80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
            : 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]'
        }`}
      >
        <AppIcon appId={app.id} iconName={app.icon} className="w-12 h-12" />
      </div>

      {/* 11px Crisp Label with Text Glow */}
      <span
        data-testid={`desktop-icon-label-${app.id}`}
        style={{
          fontSize: '11px',
          maxWidth: '86px',
        }}
        className={`mt-1.5 text-[11px] font-medium text-center leading-tight max-w-[86px] line-clamp-2 px-1.5 py-0.5 rounded transition-all duration-150 ${
          isActuallyHovered
            ? 'text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-black/50'
            : isActuallyOtherHovered
            ? 'text-white/60 text-[10px]'
            : isSelected
            ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-blue-600/60'
            : 'text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
        }`}
      >
        {app.title}
      </span>
    </button>
  );
};
