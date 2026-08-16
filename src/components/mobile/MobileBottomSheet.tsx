'use client';

import React, { useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { WindowState } from '@/types/os';
import { X } from 'lucide-react';
import { motion, PanInfo } from 'framer-motion';

interface MobileBottomSheetProps {
  windowState: WindowState;
  children?: React.ReactNode;
}

export function MobileBottomSheet({ windowState, children }: MobileBottomSheetProps) {
  const closeWindow = useOSStore(state => state.closeWindow);

  if (!windowState.isOpen) return null;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 140 || info.velocity.y > 500) {
      closeWindow(windowState.id);
    }
  };

  return (
    <motion.div
      data-testid={`mobile-bottom-sheet-${windowState.id}`}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDragEnd={handleDragEnd}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 bg-stone-900 text-white rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
      style={{
        height: 'calc(100dvh - 28px)',
        top: '28px',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
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
      <div data-testid={`sheet-content-${windowState.id}`} className="flex-1 overflow-y-auto p-4">
        {children || (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{windowState.title}</h2>
            <p className="text-white/60">Mobile view for {windowState.title}.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
