'use client';

import React from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { WindowFrame } from './WindowFrame';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// 6 Dedicated Applications
import { TerminalApp } from '@/components/apps/TerminalApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { FinderApp } from '@/components/apps/FinderApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { MailApp } from '@/components/apps/MailApp';

export const APP_REGISTRY: Record<string, React.ComponentType<any>> = {
  terminal: TerminalApp,
  projects: ProjectsApp,
  about: AboutApp,
  finder: FinderApp,
  settings: SettingsApp,
  mail: MailApp,
};

export function WindowManager() {
  const windows = useOSStore(state => state.windows);
  const desktopMode = useOSStore(state => state.desktopMode);

  const windowList = Object.values(windows || {});

  return (
    <div
      data-testid="window-manager"
      className={`hidden md:block fixed inset-0 pointer-events-none z-20 transition-opacity duration-300 ${
        desktopMode === 'ambient-hero' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-auto">
        {windowList.map(win => {
          if (!win.isOpen || win.isMinimized) return null;
          const AppComponent = APP_REGISTRY[win.id];

          return (
            <WindowFrame key={win.id} windowState={win}>
              {AppComponent ? (
                <AppComponent />
              ) : (
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-white">{win.title}</h3>
                  <p className="text-white/60 text-sm">Application content unavailable.</p>
                </div>
              )}
            </WindowFrame>
          );
        })}
      </div>
    </div>
  );
}
