'use client';

import React, { useEffect, useState } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { DEFAULT_APPS } from '@/lib/constants/apps';
import { DesktopIcon } from './DesktopIcon';

export const DesktopGrid: React.FC = () => {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const selectedIconIds = useOSStore((state) => state.selectedIconIds);
  const openWindow = useOSStore((state) => state.openWindow);
  const selectIcon = useOSStore((state) => state.selectIcon);
  const clearSelectedIcons = useOSStore((state) => state.clearSelectedIcons);

  useEffect(() => {
    const handleDeselect = () => {
      setSelectedIconId(null);
      if (clearSelectedIcons) clearSelectedIcons();
    };
    window.addEventListener('os:deselect-icons', handleDeselect);
    return () => window.removeEventListener('os:deselect-icons', handleDeselect);
  }, [clearSelectedIcons]);

  return (
    <div
      data-testid="desktop-grid"
      style={{ gridAutoFlow: 'column' }}
      className="hidden md:grid grid-flow-col auto-cols-[92px] grid-rows-[repeat(auto-fill,104px)] gap-y-3 gap-x-2 p-4 h-full w-full pointer-events-none overflow-hidden"
    >
      {DEFAULT_APPS.map((app) => (
        <DesktopIcon
          key={app.id}
          app={app}
          isSelected={
            selectedIconIds?.includes(app.id) || selectedIconId === app.id
          }
          onSelect={(id) => {
            setSelectedIconId(id);
            if (selectIcon) selectIcon(id);
          }}
          onOpen={(id) => {
            setSelectedIconId(null);
            if (clearSelectedIcons) clearSelectedIcons();
            if (openWindow) openWindow(id);
          }}
        />
      ))}
    </div>
  );
};
