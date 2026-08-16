'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { Wallpaper } from './Wallpaper';
import { DesktopGrid } from './DesktopGrid';
import { ContextMenu } from './ContextMenu';
import { DEFAULT_APPS } from '@/lib/constants/apps';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface DesktopCanvasProps {
  children?: React.ReactNode;
  className?: string;
  withWallpaper?: boolean;
}

export const DesktopCanvas: React.FC<DesktopCanvasProps> = ({
  children,
  className,
  withWallpaper = true,
}) => {
  const { isMobile } = useBreakpoint();
  const desktopMode = useOSStore((state) => state.desktopMode);
  const setDesktopMode = useOSStore((state) => state.setDesktopMode);
  const setContextMenu = useOSStore((state) => state.setContextMenu);
  const openContextMenu = useOSStore((state) => state.openContextMenu);
  const openWindow = useOSStore((state) => state.openWindow);
  const toggleTheme = useOSStore((state) => state.toggleTheme);
  const clearSelectedIcons = useOSStore((state) => state.clearSelectedIcons);
  const setSelectedIcons = useOSStore((state) => state.setSelectedIcons);

  const [marquee, setMarquee] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button === 2) return; // Right click handled by onContextMenu

      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('[data-testid="context-menu"]') ||
        target.closest('[data-testid="window-frame"]')
      ) {
        return;
      }

      useOSStore.setState({ activeWindowId: null });
      if (setContextMenu) setContextMenu(null);
      if (clearSelectedIcons) clearSelectedIcons();
      window.dispatchEvent(new CustomEvent('os:deselect-icons'));

      if (isMobile) return;

      setMarquee({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });
    },
    [setContextMenu, clearSelectedIcons, isMobile]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!marquee || isMobile) return;
      setMarquee((prev) =>
        prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null
      );

      const left = Math.min(marquee.startX, e.clientX);
      const top = Math.min(marquee.startY, e.clientY);
      const right = Math.max(marquee.startX, e.clientX);
      const bottom = Math.max(marquee.startY, e.clientY);

      const selected: string[] = [];
      DEFAULT_APPS.forEach((app) => {
        const el = document.querySelector(`[data-testid="desktop-icon-${app.id}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            selected.push(app.id);
          }
        }
      });

      if (selected.length > 0 && setSelectedIcons) {
        setSelectedIcons(selected);
      }
    },
    [marquee, setSelectedIcons, isMobile]
  );

  const handlePointerUp = useCallback(() => {
    setMarquee(null);
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (
        target === e.currentTarget ||
        target.dataset.canvasSurface === 'true' ||
        target.closest('[data-testid="wallpaper-container"]') ||
        target.closest('[data-testid="desktop-grid"]')
      ) {
        e.preventDefault();
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
        const x = Math.min(e.clientX, vw - 220);
        const y = Math.min(e.clientY, vh - 260);

        const menuPayload = {
          x,
          y,
          items: [
            {
              id: 'new-folder',
              label: 'New Folder',
              disabled: true,
            },
            {
              id: 'clean-up-icons',
              label: 'Clean Up / Align to Grid',
              action: () => useOSStore.getState().resetIconPositions(),
            },
            { id: 'sep-1', label: '', separator: true },
            {
              id: 'change-wallpaper',
              label: 'Change Wallpaper',
              action: () => openWindow('settings'),
            },
            {
              id: 'toggle-mode',
              label:
                desktopMode === 'workspace'
                  ? 'Switch to Ambient Mode'
                  : 'Switch to Workspace Mode',
              shortcut: '⌘⌥M',
              action: () =>
                setDesktopMode(
                  desktopMode === 'workspace' ? 'ambient-hero' : 'workspace'
                ),
            },
            {
              id: 'toggle-theme',
              label: 'Toggle Dark/Light Mode',
              shortcut: '⇧⌘D',
              action: () => toggleTheme(),
            },
            { id: 'sep-2', label: '', separator: true },
            {
              id: 'system-info',
              label: 'About This Portfolio',
              action: () => openWindow('about'),
            },
          ],
        };

        if (openContextMenu) openContextMenu(menuPayload);
        else if (setContextMenu) setContextMenu(menuPayload);
      }
    },
    [desktopMode, setDesktopMode, setContextMenu, openContextMenu, openWindow, toggleTheme]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (
        target === e.currentTarget ||
        target.dataset.canvasSurface === 'true' ||
        target.closest('[data-testid="wallpaper-container"]')
      ) {
        const nextMode = desktopMode === 'workspace' ? 'ambient-hero' : 'workspace';
        setDesktopMode(nextMode);
      }
    },
    [desktopMode, setDesktopMode]
  );

  const marqueeStyle = marquee
    ? {
        left: `${Math.min(marquee.startX, marquee.currentX)}px`,
        top: `${Math.min(marquee.startY, marquee.currentY)}px`,
        width: `${Math.abs(marquee.currentX - marquee.startX)}px`,
        height: `${Math.abs(marquee.currentY - marquee.startY)}px`,
      }
    : undefined;

  return (
    <div
      ref={canvasRef}
      data-testid="desktop-canvas"
      data-canvas-surface="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target === e.currentTarget || target.dataset.canvasSurface === 'true') {
          useOSStore.setState({ activeWindowId: null });
          if (setContextMenu) setContextMenu(null);
          if (clearSelectedIcons) clearSelectedIcons();
          window.dispatchEvent(new CustomEvent('os:deselect-icons'));
        }
      }}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      className={`fixed top-7 left-0 right-0 bottom-0 h-[calc(100vh-28px)] h-[calc(100dvh-28px)] z-10 select-none overflow-hidden ${
        className || ''
      }`}
    >
      {/* Background wallpaper layer (optional) */}
      {withWallpaper && <Wallpaper />}

      {/* Grid layer */}
      {children || <DesktopGrid />}

      {/* Selection Marquee rectangle */}
      {marquee && (
        <div
          data-testid="selection-marquee"
          className="fixed border border-blue-400 bg-blue-500/20 pointer-events-none z-20"
          style={marqueeStyle}
        />
      )}

      {/* Context menu */}
      <ContextMenu />
    </div>
  );
};
