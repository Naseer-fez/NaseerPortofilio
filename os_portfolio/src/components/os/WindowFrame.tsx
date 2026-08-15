import React, { useRef, useCallback } from 'react';
import { WindowInstance } from '../../types/os';
import { useWindowManager } from '../../context/WindowContext';
import { ResizeHandles } from './ResizeHandles';
import { clampWindowPosition, computeResizeBounds, ResizeHandle } from '../../utils/windowMath';
import {
  FolderGit2,
  Terminal,
  User,
  Folder,
  Settings,
  Music,
  FileText,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  FolderGit2,
  Terminal,
  User,
  Folder,
  Settings,
  Music,
  FileText,
};

interface WindowFrameProps {
  window: WindowInstance;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win }) => {
  const {
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updatePosition,
    updateSize,
  } = useWindowManager();

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; winX: number; winY: number }>({
    pointerX: 0,
    pointerY: 0,
    winX: 0,
    winY: 0,
  });

  const isResizingRef = useRef(false);
  const resizeHandleRef = useRef<ResizeHandle | null>(null);
  const resizeStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    startPos: { x: number; y: number };
    startSize: { width: number; height: number };
  }>({
    pointerX: 0,
    pointerY: 0,
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
  });

  // Handle pointer down on titlebar for dragging
  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return; // Ignore traffic lights
    focusWindow(win.id);
    if (win.isMaximized) return; // Cannot drag maximized window

    isDraggingRef.current = true;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      winX: win.position.x,
      winY: win.position.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.pointerX;
    const deltaY = e.clientY - dragStartRef.current.pointerY;

    const proposedX = dragStartRef.current.winX + deltaX;
    const proposedY = dragStartRef.current.winY + deltaY;

    const clamped = clampWindowPosition(
      proposedX,
      proposedY,
      win.size.width,
      win.size.height,
      window.innerWidth,
      window.innerHeight,
      28, // Top Menu Bar height 28px
      100 // Min visible header 100px
    );

    updatePosition(win.id, clamped);
  };

  const handleHeaderPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe release
      }
    }
  };

  // Handle Resize Start
  const handleResizeStart = useCallback(
    (handle: ResizeHandle, e: React.PointerEvent) => {
      e.stopPropagation();
      focusWindow(win.id);
      if (win.isMaximized) return;

      isResizingRef.current = true;
      resizeHandleRef.current = handle;
      resizeStartRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        startPos: { x: win.position.x, y: win.position.y },
        startSize: { width: win.size.width, height: win.size.height },
      };

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      const handlePointerMove = (moveEvt: PointerEvent) => {
        if (!isResizingRef.current || !resizeHandleRef.current) return;

        const deltaX = moveEvt.clientX - resizeStartRef.current.pointerX;
        const deltaY = moveEvt.clientY - resizeStartRef.current.pointerY;

        const bounds = computeResizeBounds({
          handle: resizeHandleRef.current,
          startPos: resizeStartRef.current.startPos,
          startSize: resizeStartRef.current.startSize,
          deltaX,
          deltaY,
          minWidth: win.minSize.width,
          minHeight: win.minSize.height,
          menuBarHeight: 28,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        });

        updateSize(win.id, bounds);
      };

      const handlePointerUp = (upEvt: PointerEvent) => {
        isResizingRef.current = false;
        resizeHandleRef.current = null;
        try {
          target.releasePointerCapture(upEvt.pointerId);
        } catch {
          // Safe release
        }
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [win.id, win.isMaximized, win.position, win.size, win.minSize, focusWindow, updateSize]
  );

  const IconComponent = ICON_MAP[win.icon] || Folder;
  const AppComponent = win.component;

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  return (
    <div
      className={`absolute flex flex-col select-none transition-shadow duration-150 ${
        win.isMaximized ? 'rounded-none' : 'rounded-lg'
      }`}
      style={{
        transform: `translate3d(${win.position.x}px, ${win.position.y}px, 0)`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        background: 'rgba(39, 39, 41, 0.88)', // surface-tile-1 base with 88% opacity
        border: win.isFocused
          ? '1px solid rgba(255, 255, 255, 0.20)'
          : '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: win.isFocused
          ? '0 25px 60px -10px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,102,204,0.3)'
          : '0 15px 35px -8px rgba(0,0,0,0.45)',
      }}
      onPointerDown={() => focusWindow(win.id)}
      role="region"
      aria-label={`${win.title} Window`}
    >
      {/* Draggable Titlebar Header (36px, h-9) */}
      <div
        className="h-9 px-3 flex items-center justify-between border-b border-white/10 bg-white/5 cursor-default select-none shrink-0"
        onPointerDown={handleHeaderPointerDown}
        onPointerMove={handleHeaderPointerMove}
        onPointerUp={handleHeaderPointerUp}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        {/* macOS Traffic Lights Cluster with Synchronized 3-Dot Group Hover */}
        <div className="flex items-center gap-2 group/lights">
          {/* Red Close */}
          <button
            onClick={() => closeWindow(win.id)}
            className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
              win.isFocused
                ? 'bg-[#FF5F56] border border-[#E0443E] text-[#4D0000]'
                : 'bg-white/20 border border-white/20 text-transparent group-hover/lights:bg-[#FF5F56] group-hover/lights:border-[#E0443E] group-hover/lights:text-[#4D0000]'
            }`}
            aria-label="Close Window"
          >
            <span className="opacity-0 group-hover/lights:opacity-100 transition-opacity">✕</span>
          </button>

          {/* Yellow Minimize */}
          <button
            onClick={() => minimizeWindow(win.id)}
            className={`w-3 h-3 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
              win.isFocused
                ? 'bg-[#FFBD2E] border border-[#DEA123] text-[#995700]'
                : 'bg-white/20 border border-white/20 text-transparent group-hover/lights:bg-[#FFBD2E] group-hover/lights:border-[#DEA123] group-hover/lights:text-[#995700]'
            }`}
            aria-label="Minimize Window"
          >
            <span className="opacity-0 group-hover/lights:opacity-100 transition-opacity">−</span>
          </button>

          {/* Green Maximize / Restore */}
          <button
            onClick={() => toggleMaximize(win.id)}
            className={`w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-bold transition-all ${
              win.isFocused
                ? 'bg-[#27C93F] border border-[#1AAB29] text-[#006400]'
                : 'bg-white/20 border border-white/20 text-transparent group-hover/lights:bg-[#27C93F] group-hover/lights:border-[#1AAB29] group-hover/lights:text-[#006400]'
            }`}
            aria-label="Toggle Maximize"
          >
            <span className="opacity-0 group-hover/lights:opacity-100 transition-opacity">⤢</span>
          </button>
        </div>

        {/* Window Title (Center) */}
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-white/90 tracking-[-0.12px] truncate max-w-[60%]">
          <IconComponent className="w-3.5 h-3.5 text-white/70 shrink-0" />
          <span className="truncate">{win.title}</span>
        </div>

        {/* Right Balance Spacer */}
        <div className="w-14" />
      </div>

      {/* Scrollable Application Viewport */}
      <div className="flex-1 overflow-hidden relative bg-[#1d1d1f]/40">
        <AppComponent />
      </div>

      {/* 8-Direction Resize Handle Overlay (Hidden when maximized) */}
      {!win.isMaximized && <ResizeHandles onResizeStart={handleResizeStart} />}
    </div>
  );
};
