import React from 'react';

export type AppId = 'projects' | 'terminal' | 'about' | 'finder' | 'settings' | 'music' | 'notes';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInstance {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
  minSize: WindowSize;
  prevBounds?: WindowBounds;
  component: React.ComponentType;
}

export interface WindowContextValue {
  windows: Record<AppId, WindowInstance>;
  activeWindowId: AppId | null;
  minimizedWindows: AppId[];
  zStack: AppId[];
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  restoreWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updatePosition: (id: AppId, pos: WindowPosition) => void;
  updateSize: (id: AppId, bounds: WindowBounds) => void;
}

export interface DesktopIconItem {
  id: AppId;
  title: string;
  icon: string;
  gridRow?: number;
  gridCol?: number;
}
