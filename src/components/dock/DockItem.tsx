import React, { useState, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { AppConfig } from '@/types/apps';
import { DockTooltip } from './DockTooltip';
import { ActiveDotIndicator } from './ActiveDotIndicator';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';

interface DockItemProps {
  app: AppConfig;
  magnifiedWidth: number;
}

export function DockItem({ app, magnifiedWidth }: DockItemProps) {
  const windowState = useOSStore(state => state.windows[app.id]);
  const activeWindowId = useOSStore(state => state.activeWindowId);
  const openWindow = useOSStore(state => state.openWindow);
  const focusWindow = useOSStore(state => state.focusWindow);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!windowState.isOpen) {
      setIsBouncing(true);
      GlobalAudioManager.getInstance().playFx('dock-bounce');
      openWindow(app.id);
      setTimeout(() => setIsBouncing(false), 800);
    } else if (windowState.isMinimized) {
      focusWindow(app.id);
    } else if (activeWindowId !== app.id) {
      focusWindow(app.id);
    }
  };

  const currentScale = isPressed ? 0.88 : (magnifiedWidth / 44);

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
      className={`relative flex items-center justify-center cursor-pointer select-none origin-bottom transition-all duration-100 ${
        isBouncing ? 'animate-bounce' : ''
      }`}
      style={{
        width: `${magnifiedWidth}px`,
        height: `${magnifiedWidth}px`,
        transform: `scale(${currentScale})`,
        transformOrigin: 'bottom center',
      }}
    >
      <div
        data-testid={`dock-icon-${app.id}`}
        className="w-full h-full rounded-2xl flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md text-white font-bold text-base"
      >
        {app.title.charAt(0)}
      </div>

      {isHovered && <DockTooltip title={app.title} />}
      <ActiveDotIndicator
        windowId={app.id}
        isOpen={windowState.isOpen}
        isMinimized={windowState.isMinimized}
      />
    </div>
  );
}
