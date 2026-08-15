import React from 'react';
import { WindowId } from '@/types/os';

interface ActiveDotIndicatorProps {
  windowId: WindowId;
  isOpen: boolean;
  isMinimized: boolean;
}

export function ActiveDotIndicator({ windowId, isOpen, isMinimized }: ActiveDotIndicatorProps) {
  if (!isOpen) return null;

  return (
    <div
      data-testid={`dock-dot-${windowId}`}
      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white transition-opacity ${
        isMinimized ? 'opacity-40' : 'opacity-85'
      }`}
      style={{
        width: '3px',
        height: '3px',
        borderRadius: '9999px',
        boxShadow: '0 0 4px rgba(255, 255, 255, 0.4)',
      }}
    />
  );
}
