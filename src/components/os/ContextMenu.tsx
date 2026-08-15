'use client';

import React, { useEffect, useRef } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { AnimatePresence, motion } from 'framer-motion';

export const ContextMenu: React.FC = () => {
  const contextMenu = useOSStore((state) => state.contextMenu);
  const closeContextMenu = useOSStore((state) => state.closeContextMenu);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    if (contextMenu) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu, closeContextMenu]);

  if (!contextMenu) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        data-testid="context-menu"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.12 }}
        className="fixed z-[9995] w-56 rounded-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-2xl py-1 text-[13px] text-neutral-800 dark:text-neutral-200 select-none pointer-events-auto"
        style={{
          top: `${contextMenu.y}px`,
          left: `${contextMenu.x}px`,
        }}
      >
        {contextMenu.items.map((item) => {
          if (item.separator) {
            return (
              <div
                key={item.id}
                className="h-px bg-black/10 dark:bg-white/10 my-1 mx-1"
              />
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              data-testid={`context-menu-item-${item.id}`}
              disabled={item.disabled}
              onClick={() => {
                closeContextMenu();
                if (item.action) item.action();
              }}
              className={`w-full text-left px-3 py-1 flex items-center justify-between transition-colors ${
                item.disabled
                  ? 'opacity-40 cursor-default'
                  : 'hover:bg-blue-600 hover:text-white cursor-pointer'
              } ${item.danger ? 'text-red-500 hover:bg-red-600 hover:text-white' : ''}`}
            >
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="text-xs opacity-60 font-mono">
                  {item.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};
