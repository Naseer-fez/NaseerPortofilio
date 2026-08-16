'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { DEFAULT_APPS } from '@/lib/constants/apps';
import { DesktopIcon } from './DesktopIcon';
import { Position } from '@/types/os';

export const DesktopGrid: React.FC = () => {
  const { isMobile } = useBreakpoint();
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const selectedIconIds = useOSStore((state) => state.selectedIconIds);
  const desktopIconPositions = useOSStore((state) => state.desktopIconPositions) || {};
  const updateIconPosition = useOSStore((state) => state.updateIconPosition);
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

  // Compute default grid position if not custom positioned
  const getDefaultPosition = (index: number): Position => {
    const col = Math.floor(index / 5);
    const row = index % 5;
    return {
      x: 20 + col * 104,
      y: 20 + row * 118,
    };
  };

  const handlePositionChange = useCallback(
    (appId: string, pos: Position) => {
      if (updateIconPosition) updateIconPosition(appId, pos);
    },
    [updateIconPosition]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedIconId(id);
      if (selectIcon) selectIcon(id);
    },
    [selectIcon]
  );

  const handleOpen = useCallback(
    (id: string) => {
      setSelectedIconId(id);
      if (selectIcon) selectIcon(id);
      if (openWindow) openWindow(id);
    },
    [selectIcon, openWindow]
  );

  return (
    <div
      data-testid="desktop-grid"
      style={{ gridAutoFlow: 'column' }}
      onPointerLeave={() => setHoveredAppId(null)}
      className="absolute inset-0 h-full w-full pointer-events-none overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:block md:overflow-hidden gap-y-4 gap-x-2 p-4 pt-12 md:p-0 select-none"
    >
      {DEFAULT_APPS.map((app, index) => {
        const isThisHovered = hoveredAppId === app.id;
        const isAnotherHovered = hoveredAppId !== null && !isThisHovered;
        const currentPos = desktopIconPositions[app.id] || getDefaultPosition(index);

        return (
          <div key={app.id} className="flex justify-center md:inline">
            <DesktopIcon
              app={app}
              index={index}
              position={currentPos}
              onPositionChange={(pos) => handlePositionChange(app.id, pos)}
              isHovered={isThisHovered}
              isOtherHovered={isAnotherHovered}
              onHoverChange={(hovered) => setHoveredAppId(hovered ? app.id : null)}
              isSelected={
                selectedIconIds?.includes(app.id) || selectedIconId === app.id
              }
              onSelect={handleSelect}
              onOpen={handleOpen}
            />
          </div>
        );
      })}
    </div>
  );
};
