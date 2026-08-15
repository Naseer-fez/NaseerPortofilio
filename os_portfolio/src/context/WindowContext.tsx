import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AppId, WindowInstance, WindowBounds, WindowPosition, WindowContextValue } from '../types/os';
import { ProjectsApp } from '../components/apps/ProjectsApp';
import { TerminalApp } from '../components/apps/TerminalApp';
import { AboutApp } from '../components/apps/AboutApp';
import { FinderApp } from '../components/apps/FinderApp';

const WindowContext = createContext<WindowContextValue | null>(null);

const INITIAL_WINDOWS: Record<AppId, WindowInstance> = {
  projects: {
    id: 'projects',
    title: 'Projects — Portfolio',
    icon: 'FolderGit2',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    isFocused: true, // Focused on startup
    zIndex: 22,
    position: { x: 120, y: 64 },
    size: { width: 780, height: 520 },
    minSize: { width: 440, height: 320 },
    component: ProjectsApp,
  },
  terminal: {
    id: 'terminal',
    title: 'guest@portfolio:~ (zsh)',
    icon: 'Terminal',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    isFocused: false, // Second window open in background
    zIndex: 21,
    position: { x: 360, y: 140 },
    size: { width: 580, height: 380 },
    minSize: { width: 400, height: 260 },
    component: TerminalApp,
  },
  about: {
    id: 'about',
    title: 'About — Developer Profile',
    icon: 'User',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex: 20,
    position: { x: 200, y: 90 },
    size: { width: 740, height: 500 },
    minSize: { width: 440, height: 320 },
    component: AboutApp,
  },
  finder: {
    id: 'finder',
    title: 'Finder — Macintosh HD',
    icon: 'Folder',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex: 20,
    position: { x: 240, y: 100 },
    size: { width: 720, height: 460 },
    minSize: { width: 450, height: 320 },
    component: FinderApp,
  },
  settings: {
    id: 'settings',
    title: 'System Settings',
    icon: 'Settings',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex: 20,
    position: { x: 280, y: 110 },
    size: { width: 560, height: 400 },
    minSize: { width: 400, height: 300 },
    component: AboutApp,
  },
  music: {
    id: 'music',
    title: 'Music Player',
    icon: 'Music',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex: 20,
    position: { x: 300, y: 120 },
    size: { width: 400, height: 520 },
    minSize: { width: 340, height: 480 },
    component: AboutApp,
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    icon: 'FileText',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex: 20,
    position: { x: 320, y: 130 },
    size: { width: 520, height: 400 },
    minSize: { width: 380, height: 280 },
    component: AboutApp,
  },
};

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Record<AppId, WindowInstance>>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>('projects');
  const [spawnCounter, setSpawnCounter] = useState(2);

  // Focus Window (Click-to-front z-index promotion)
  const focusWindow = useCallback((id: AppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;

      // Calculate max z-index across active windows
      const currentMaxZ = Math.max(...Object.values(prev).map(w => w.zIndex), 20);
      const newZ = target.isFocused ? target.zIndex : currentMaxZ + 1;

      const updated: Record<AppId, WindowInstance> = { ...prev };
      Object.keys(updated).forEach(k => {
        const appKey = k as AppId;
        if (appKey === id) {
          updated[appKey] = {
            ...updated[appKey],
            isFocused: true,
            isMinimized: false,
            zIndex: newZ,
          };
        } else {
          updated[appKey] = {
            ...updated[appKey],
            isFocused: false,
          };
        }
      });
      return updated;
    });
    setActiveWindowId(id);
  }, []);

  // Open Window (spawns with cascade if unopened, or brings to front)
  const openWindow = useCallback((id: AppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;

      const currentMaxZ = Math.max(...Object.values(prev).map(w => w.zIndex), 20);
      const newZ = currentMaxZ + 1;

      let newPos = target.position;
      if (!target.isOpen) {
        // Cascade spawning offset
        const offsetX = 100 + (spawnCounter % 6) * 28;
        const offsetY = 60 + (spawnCounter % 6) * 28;
        newPos = { x: offsetX, y: offsetY };
        setSpawnCounter(c => c + 1);
      }

      const updated: Record<AppId, WindowInstance> = { ...prev };
      Object.keys(updated).forEach(k => {
        const appKey = k as AppId;
        if (appKey === id) {
          updated[appKey] = {
            ...updated[appKey],
            isOpen: true,
            isMinimized: false,
            isFocused: true,
            zIndex: newZ,
            position: newPos,
          };
        } else {
          updated[appKey] = {
            ...updated[appKey],
            isFocused: false,
          };
        }
      });
      return updated;
    });
    setActiveWindowId(id);
  }, [spawnCounter]);

  // Close Window
  const closeWindow = useCallback((id: AppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;

      const updated = {
        ...prev,
        [id]: {
          ...target,
          isOpen: false,
          isFocused: false,
          isMinimized: false,
        },
      };

      // Shift active focus to topmost remaining open window
      const remainingOpen = Object.values(updated)
        .filter(w => w.isOpen && !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex);

      if (remainingOpen.length > 0) {
        const nextActive = remainingOpen[0].id;
        updated[nextActive] = {
          ...updated[nextActive],
          isFocused: true,
        };
        setActiveWindowId(nextActive);
      } else {
        setActiveWindowId(null);
      }

      return updated;
    });
  }, []);

  // Minimize Window
  const minimizeWindow = useCallback((id: AppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;

      const updated = {
        ...prev,
        [id]: {
          ...target,
          isMinimized: true,
          isFocused: false,
        },
      };

      // Shift focus
      const remainingOpen = Object.values(updated)
        .filter(w => w.isOpen && !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex);

      if (remainingOpen.length > 0) {
        const nextActive = remainingOpen[0].id;
        updated[nextActive] = {
          ...updated[nextActive],
          isFocused: true,
        };
        setActiveWindowId(nextActive);
      } else {
        setActiveWindowId(null);
      }

      return updated;
    });
  }, []);

  // Restore Window (un-minimize or restore size)
  const restoreWindow = useCallback((id: AppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;

      const currentMaxZ = Math.max(...Object.values(prev).map(w => w.zIndex), 20);
      return {
        ...prev,
        [id]: {
          ...target,
          isOpen: true,
          isMinimized: false,
          isFocused: true,
          zIndex: currentMaxZ + 1,
        },
      };
    });
    setActiveWindowId(id);
  }, []);

  // Maximize Window
  const maximizeWindow = useCallback((id: AppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;

      const prevBounds: WindowBounds = {
        x: target.position.x,
        y: target.position.y,
        width: target.size.width,
        height: target.size.height,
      };

      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      return {
        ...prev,
        [id]: {
          ...target,
          isMaximized: true,
          prevBounds,
          position: { x: 0, y: 28 },
          size: { width: viewportW, height: viewportH - 28 },
        },
      };
    });
    focusWindow(id);
  }, [focusWindow]);

  // Toggle Maximize / Restore
  const toggleMaximize = useCallback((id: AppId) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;

      if (target.isMaximized) {
        const restored = target.prevBounds || {
          x: 140,
          y: 80,
          width: 780,
          height: 520,
        };
        return {
          ...prev,
          [id]: {
            ...target,
            isMaximized: false,
            position: { x: restored.x, y: restored.y },
            size: { width: restored.width, height: restored.height },
          },
        };
      } else {
        const prevBounds: WindowBounds = {
          x: target.position.x,
          y: target.position.y,
          width: target.size.width,
          height: target.size.height,
        };
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        return {
          ...prev,
          [id]: {
            ...target,
            isMaximized: true,
            prevBounds,
            position: { x: 0, y: 28 },
            size: { width: viewportW, height: viewportH - 28 },
          },
        };
      }
    });
    focusWindow(id);
  }, [focusWindow]);

  // Update Position (with clamping)
  const updatePosition = useCallback((id: AppId, pos: WindowPosition) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          position: pos,
        },
      };
    });
  }, []);

  // Update Size & Bounds
  const updateSize = useCallback((id: AppId, bounds: WindowBounds) => {
    setWindows(prev => {
      const target = prev[id];
      if (!target) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          position: { x: bounds.x, y: bounds.y },
          size: { width: bounds.width, height: bounds.height },
        },
      };
    });
  }, []);

  const minimizedWindows = useMemo(() => {
    return (Object.keys(windows) as AppId[]).filter(id => windows[id].isOpen && windows[id].isMinimized);
  }, [windows]);

  const zStack = useMemo(() => {
    return (Object.keys(windows) as AppId[])
      .filter(id => windows[id].isOpen)
      .sort((a, b) => windows[a].zIndex - windows[b].zIndex);
  }, [windows]);

  return (
    <WindowContext.Provider
      value={{
        windows,
        activeWindowId,
        minimizedWindows,
        zStack,
        openWindow,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        maximizeWindow,
        toggleMaximize,
        focusWindow,
        updatePosition,
        updateSize,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowManager = (): WindowContextValue => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowProvider');
  }
  return context;
};
