import React, { useRef, useState, useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { WindowState } from '@/types/os';
import { TrafficLights } from './TrafficLights';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';

interface WindowFrameProps {
  windowState: WindowState;
  children?: React.ReactNode;
}

export function WindowFrame({ windowState, children }: WindowFrameProps) {
  const activeWindowId = useOSStore(state => state.activeWindowId);
  const focusWindow = useOSStore(state => state.focusWindow);
  const updatePosition = useOSStore(state => state.updatePosition);
  const updateSize = useOSStore(state => state.updateSize);
  const toggleMaximize = useOSStore(state => state.toggleMaximize);

  const isFocused = activeWindowId === windowState.id;
  const frameRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    focusWindow(windowState.id);
    if (windowState.isMaximized) return;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: windowState.position.x,
      startY: windowState.position.y,
    };
    GlobalAudioManager.getInstance().playFx('window-grab');
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      updatePosition(windowState.id, {
        x: dragStartRef.current.startX + dx,
        y: dragStartRef.current.startY + dy,
      });
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        GlobalAudioManager.getInstance().playFx('window-drop');
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, updatePosition, windowState.id]);

  const handleResizeStart = (handle: string, e: React.PointerEvent) => {
    e.stopPropagation();
    focusWindow(windowState.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = windowState.size.width;
    const startH = windowState.size.height;
    const startPosX = windowState.position.x;
    const startPosY = windowState.position.y;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let nextW = startW;
      let nextH = startH;
      let nextX = startPosX;
      let nextY = startPosY;

      if (handle.includes('e')) nextW = startW + dx;
      if (handle.includes('s')) nextH = startH + dy;
      if (handle.includes('w')) {
        nextW = startW - dx;
        nextX = startPosX + dx;
      }
      if (handle.includes('n')) {
        nextH = startH - dy;
        nextY = startPosY + dy;
      }

      updateSize(windowState.id, { width: nextW, height: nextH });
      if (nextX !== startPosX || nextY !== startPosY) {
        updatePosition(windowState.id, { x: nextX, y: nextY });
      }
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  if (!windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const activeShadow = '0 25px 60px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.2)';
  const inactiveShadow = '0 10px 30px -5px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)';

  return (
    <div
      ref={frameRef}
      data-testid={`window-${windowState.id}`}
      onPointerDown={() => focusWindow(windowState.id)}
      className={`fixed flex flex-col backdrop-blur-2xl bg-stone-900/90 text-white overflow-hidden select-none transition-all duration-150 ${
        windowState.isMaximized ? 'rounded-none' : 'rounded-xl'
      }`}
      style={{
        top: `${windowState.position.y}px`,
        left: `${windowState.position.x}px`,
        width: `${windowState.size.width}px`,
        height: `${windowState.size.height}px`,
        zIndex: windowState.zIndex,
        borderRadius: windowState.isMaximized ? '0px' : '12px',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        boxShadow: isFocused ? activeShadow : inactiveShadow,
      }}
    >
      {/* Header Bar */}
      <div
        data-testid={`window-header-${windowState.id}`}
        onPointerDown={handleHeaderPointerDown}
        onDoubleClick={() => toggleMaximize(windowState.id)}
        className="h-9 px-3 flex items-center justify-between border-b border-white/10 bg-white/5 cursor-grab active:cursor-grabbing"
      >
        <TrafficLights windowId={windowState.id} isFocused={isFocused} />
        <span className="text-xs font-semibold tracking-tight text-white/80 select-none">
          {windowState.title}
        </span>
        <div className="w-12" />
      </div>

      {/* Body Content */}
      <div
        data-testid={`window-body-${windowState.id}`}
        className="flex-1 overflow-hidden relative flex flex-col p-0 bg-stone-950/85 text-white select-text"
      >
        {children || (
          <div className="p-4 space-y-3">
            <h2 className="text-base font-semibold">{windowState.title}</h2>
            <p className="text-white/60">Application window content for {windowState.title}.</p>
          </div>
        )}
      </div>

      {/* 8-Direction Resize Handles */}
      {!windowState.isMaximized && (
        <>
          <div data-resize-handle="n" data-cursor="precision-drag" onPointerDown={e => handleResizeStart('n', e)} className="absolute top-0 left-2 right-2 h-1.5 cursor-n-resize" />
          <div data-resize-handle="s" data-cursor="precision-drag" onPointerDown={e => handleResizeStart('s', e)} className="absolute bottom-0 left-2 right-2 h-1.5 cursor-s-resize" />
          <div data-resize-handle="w" data-cursor="precision-drag" onPointerDown={e => handleResizeStart('w', e)} className="absolute top-2 bottom-2 left-0 w-1.5 cursor-w-resize" />
          <div data-resize-handle="e" data-cursor="precision-drag" onPointerDown={e => handleResizeStart('e', e)} className="absolute top-2 bottom-2 right-0 w-1.5 cursor-e-resize" />
          <div data-resize-handle="nw" data-cursor="precision-drag" onPointerDown={e => handleResizeStart('nw', e)} className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" />
          <div data-resize-handle="ne" data-cursor="precision-drag" onPointerDown={e => handleResizeStart('ne', e)} className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" />
          <div data-resize-handle="sw" data-cursor="precision-drag" onPointerDown={e => handleResizeStart('sw', e)} className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" />
          <div data-resize-handle="se" data-cursor="precision-drag" onPointerDown={e => handleResizeStart('se', e)} className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" />
        </>
      )}
    </div>
  );
}
