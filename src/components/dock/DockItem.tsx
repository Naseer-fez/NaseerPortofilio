'use client';

import React, { useState, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { AppMetadata } from '@/types/os';
import { DockTooltip } from './DockTooltip';
import { ActiveDotIndicator } from './ActiveDotIndicator';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { AppIcon } from '@/components/icons/AppIcon';

interface DockItemProps {
  app: AppMetadata;
  magnifiedWidth: number;
  isDockHovered?: boolean;
  index?: number;
}

export const DockItem = React.memo(function DockItem({
  app,
  magnifiedWidth,
  isDockHovered = false,
  index = 0,
}: DockItemProps) {
  const windowState = useOSStore((state) => state.windows[app.id] || { isOpen: false, isMinimized: false });
  const activeWindowId = useOSStore((state) => state.activeWindowId);
  const openWindow = useOSStore((state) => state.openWindow);
  const focusWindow = useOSStore((state) => state.focusWindow);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBouncing(true);
    try {
      GlobalAudioManager.getInstance().playFx('dock-bounce');
    } catch {
      // Safe fallback
    }
    openWindow(app.id);
    setTimeout(() => setIsBouncing(false), 800);
  };

  const currentScale = isPressed ? 0.88 : magnifiedWidth / 44;
  const isIdle = !isDockHovered && !isHovered && !isBouncing && !isPressed;

  return (
    <div
      ref={itemRef}
      data-testid={`dock-item-${app.id}`}
      data-cursor="magnetic-dock"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      className={`relative flex items-center justify-center cursor-pointer select-none origin-bottom transition-transform duration-100 ${
        isBouncing ? 'animate-bounce' : isIdle ? 'animate-dock-breathe' : ''
      }`}
      style={{
        width: `${magnifiedWidth}px`,
        height: `${magnifiedWidth}px`,
        transform: `scale(${currentScale})`,
        transformOrigin: 'bottom center',
        animationDelay: isIdle ? `${index * 0.15}s` : undefined,
      }}
    >
      <div
        data-testid={`dock-icon-${app.id}`}
        className="w-full h-full flex items-center justify-center"
      >
        <AppIcon appId={app.id} iconName={app.icon} className="w-full h-full" />
      </div>

      {isHovered && <DockTooltip title={app.title} />}
      <ActiveDotIndicator
        windowId={app.id}
        isOpen={windowState.isOpen}
        isMinimized={windowState.isMinimized}
      />
    </div>
  );
});
