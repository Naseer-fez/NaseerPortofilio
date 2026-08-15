'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useOSStore } from '@/hooks/useOSStore';
import { WindowFrame } from './WindowFrame';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// Code-split: each app only loads when its window opens
const TerminalApp = dynamic(() => import('@/components/apps/TerminalApp').then(m => ({ default: m.TerminalApp })), { ssr: false });
const ProjectsApp = dynamic(() => import('@/components/apps/ProjectsApp').then(m => ({ default: m.ProjectsApp })), { ssr: false });
const AboutApp = dynamic(() => import('@/components/apps/AboutApp').then(m => ({ default: m.AboutApp })), { ssr: false });
const FinderApp = dynamic(() => import('@/components/apps/FinderApp').then(m => ({ default: m.FinderApp })), { ssr: false });
const SettingsApp = dynamic(() => import('@/components/apps/SettingsApp').then(m => ({ default: m.SettingsApp })), { ssr: false });
const MailApp = dynamic(() => import('@/components/apps/MailApp').then(m => ({ default: m.MailApp })), { ssr: false });

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
