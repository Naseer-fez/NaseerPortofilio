import React from 'react';
import { APPS } from '@/lib/constants/apps';
import { useOSStore } from '@/hooks/useOSStore';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function MobileTabBar() {
  const { isMobile } = useBreakpoint();
  const openWindow = useOSStore(state => state.openWindow);
  const activeWindowId = useOSStore(state => state.activeWindowId);

  if (!isMobile) return null;

  return (
    <nav
      data-testid="mobile-tab-bar"
      className="fixed bottom-0 inset-x-0 z-50 h-[52px] bg-stone-950/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2"
      style={{
        height: 'calc(52px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {APPS.map(app => {
        const isActive = activeWindowId === app.id;
        return (
          <button
            key={app.id}
            data-testid={`tab-bar-item-${app.id}`}
            onClick={() => openWindow(app.id)}
            className={`flex flex-col items-center justify-center p-1 text-xs ${
              isActive ? 'text-blue-400 font-semibold' : 'text-white/60'
            }`}
          >
            <span className="text-sm">{app.title.charAt(0)}</span>
            <span className="text-[10px] mt-0.5">{app.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
