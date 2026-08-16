'use client';

import React from 'react';
import { APPS } from '@/lib/constants/apps';
import { useOSStore } from '@/hooks/useOSStore';
import { AppIcon } from '@/components/icons/AppIcon';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';

export function MobileTabBar() {
  const openWindow = useOSStore(state => state.openWindow);
  const closeWindow = useOSStore(state => state.closeWindow);
  const activeWindowId = useOSStore(state => state.activeWindowId);
  const windows = useOSStore(state => state.windows);

  const handleAppClick = (appId: string) => {
    GlobalAudioManager.getInstance().playFx('click');
    
    // Close other windows on mobile so apps never stack in the background
    if (windows) {
      Object.keys(windows).forEach(id => {
        if (id !== appId && windows[id]?.isOpen) {
          closeWindow(id as any);
        }
      });
    }
    
    openWindow(appId as any);
  };

  return (
    <nav
      data-testid="mobile-tab-bar"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 h-[52px] bg-stone-950/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-1 select-none"
      style={{
        height: 'calc(52px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {APPS.map(app => {
        const isActive = activeWindowId === app.id && windows?.[app.id]?.isOpen;
        return (
          <button
            key={app.id}
            data-testid={`tab-bar-item-${app.id}`}
            onClick={() => handleAppClick(app.id)}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-200 ${
              isActive
                ? 'scale-105 opacity-100'
                : 'opacity-70 hover:opacity-100 active:scale-95'
            }`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[8px] overflow-hidden shadow-sm flex items-center justify-center transition-all ${
              isActive ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-stone-950 shadow-blue-500/30' : ''
            }`}>
              <AppIcon appId={app.id} className="w-full h-full" />
            </div>
            <span className={`text-[9.5px] mt-0.5 tracking-tight truncate max-w-[52px] ${
              isActive ? 'text-blue-400 font-semibold' : 'text-white/80'
            }`}>
              {app.title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
