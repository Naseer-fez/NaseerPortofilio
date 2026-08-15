'use client';

import React, { useState } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { WindowId } from '@/types/os';

interface TrafficLightsProps {
  windowId: WindowId;
  isFocused: boolean;
}

export const TrafficLights = React.memo(function TrafficLights({ windowId, isFocused }: TrafficLightsProps) {
  const closeWindow = useOSStore(state => state.closeWindow);
  const minimizeWindow = useOSStore(state => state.minimizeWindow);
  const toggleMaximize = useOSStore(state => state.toggleMaximize);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      data-testid={`traffic-lights-group-${windowId}`}
      className="flex items-center space-x-2"
      style={{ gap: '8px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Close Button */}
      <button
        data-testid={`traffic-light-close-${windowId}`}
        aria-label="Close Window"
        onClick={e => {
          e.stopPropagation();
          closeWindow(windowId);
        }}
        className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold transition-colors ${
          isFocused || isHovered
            ? 'bg-[#FF5F56] text-black/70'
            : 'bg-stone-500/40 text-transparent'
        }`}
        style={{ width: '12px', height: '12px' }}
      >
        {isHovered && <span>✕</span>}
      </button>

      {/* Minimize Button */}
      <button
        data-testid={`traffic-light-minimize-${windowId}`}
        aria-label="Minimize Window"
        onClick={e => {
          e.stopPropagation();
          minimizeWindow(windowId);
        }}
        className={`w-3 h-3 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
          isFocused || isHovered
            ? 'bg-[#FFBD2E] text-black/70'
            : 'bg-stone-500/40 text-transparent'
        }`}
        style={{ width: '12px', height: '12px' }}
      >
        {isHovered && <span>−</span>}
      </button>

      {/* Maximize Button */}
      <button
        data-testid={`traffic-light-maximize-${windowId}`}
        aria-label="Maximize Window"
        onClick={e => {
          e.stopPropagation();
          toggleMaximize(windowId);
        }}
        className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold transition-colors ${
          isFocused || isHovered
            ? 'bg-[#27C93F] text-black/70'
            : 'bg-stone-500/40 text-transparent'
        }`}
        style={{ width: '12px', height: '12px' }}
      >
        {isHovered && <span>⤢</span>}
      </button>
    </div>
  );
});
