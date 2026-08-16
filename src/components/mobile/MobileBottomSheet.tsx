'use client';

import React, { useState, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { WindowState } from '@/types/os';
import { X } from 'lucide-react';

interface MobileBottomSheetProps {
  windowState: WindowState;
  children?: React.ReactNode;
}

export function MobileBottomSheet({ windowState, children }: MobileBottomSheetProps) {
  const closeWindow = useOSStore(state => state.closeWindow);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!windowState.isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop > 0) {
      return;
    }
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (contentRef.current && contentRef.current.scrollTop > 0) {
      return;
    }
    const currentY = e.touches[0].clientY;
    const dy = Math.max(0, currentY - startYRef.current);
    setTranslateY(dy);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (translateY > 140) {
      closeWindow(windowState.id);
    }
    setTranslateY(0);
  };

  return (
    <div
      data-testid={`mobile-bottom-sheet-${windowState.id}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-x-0 bottom-0 z-40 bg-stone-900 text-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-200"
      style={{
        height: '92vh',
        width: '100vw',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        transform: `translateY(${translateY}px)`,
        zIndex: windowState.zIndex || 40,
      }}
    >
      {/* Handle Bar */}
      <div
        data-testid={`sheet-drag-handle-${windowState.id}`}
        className="w-full py-3 flex flex-col items-center justify-center cursor-grab"
      >
        <div className="w-10 h-1 bg-white/30 rounded-full mb-2" />
        <div className="w-full px-4 flex items-center justify-between">
          <span className="text-sm font-semibold">{windowState.title}</span>
          <button
            data-testid={`sheet-close-btn-${windowState.id}`}
            onClick={() => closeWindow(windowState.id)}
            className="p-1 rounded-full bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        data-testid={`sheet-content-${windowState.id}`}
        className="flex-1 overflow-y-auto p-4"
      >
        {children || (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{windowState.title}</h2>
            <p className="text-white/60">Mobile view for {windowState.title}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
