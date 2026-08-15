import React, { useState, useRef } from 'react';
import { useWindowManager } from '../../context/WindowContext';
import { DesktopIcon } from './DesktopIcon';
import { WindowFrame } from './WindowFrame';
import { LassoSelection } from './LassoSelection';
import { AppId, DesktopIconItem } from '../../types/os';

const DESKTOP_ICONS: DesktopIconItem[] = [
  { id: 'projects', title: 'Projects', icon: 'FolderGit2' },
  { id: 'terminal', title: 'Terminal', icon: 'Terminal' },
  { id: 'about', title: 'About Me', icon: 'User' },
  { id: 'finder', title: 'Finder', icon: 'Folder' },
];

export const Desktop: React.FC = () => {
  const { windows, openWindow } = useWindowManager();
  const [selectedIconId, setSelectedIconId] = useState<AppId | null>(null);

  // Lasso rubberband marquee state
  const [lasso, setLasso] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isActive: boolean;
  }>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
  });

  const desktopRef = useRef<HTMLDivElement>(null);

  const handleDesktopPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only trigger if clicked directly on desktop background (not on window or icon)
    if (e.target !== desktopRef.current) return;

    setSelectedIconId(null);
    setLasso({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isActive: true,
    });
  };

  const handleDesktopPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!lasso.isActive) return;
    setLasso(prev => ({
      ...prev,
      currentX: e.clientX,
      currentY: e.clientY,
    }));
  };

  const handleDesktopPointerUp = () => {
    if (lasso.isActive) {
      setLasso(prev => ({ ...prev, isActive: false }));
    }
  };

  return (
    <div
      ref={desktopRef}
      onPointerDown={handleDesktopPointerDown}
      onPointerMove={handleDesktopPointerMove}
      onPointerUp={handleDesktopPointerUp}
      className="fixed inset-0 w-screen h-screen overflow-hidden select-none bg-surface-obsidian"
      style={{
        paddingTop: '28px', // Space for top menu bar
      }}
    >
      {/* Subtle macOS Sonoma / Obsidian Mesh Aura Wallpaper */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vh] rounded-full bg-blue-900/15 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vh] rounded-full bg-indigo-900/10 blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[50vh] rounded-full bg-cyan-900/10 blur-[130px]" />
      </div>

      {/* Desktop Column-First Icon Grid (Left Edge) */}
      <div
        className="relative z-10 p-4 grid gap-y-3 gap-x-2 w-max"
        style={{
          gridAutoFlow: 'column',
          gridTemplateRows: 'repeat(auto-fill, 104px)',
          height: 'calc(100vh - 120px)',
        }}
      >
        {DESKTOP_ICONS.map(icon => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            title={icon.title}
            icon={icon.icon}
            isSelected={selectedIconId === icon.id}
            onSelect={setSelectedIconId}
            onOpen={openWindow}
          />
        ))}
      </div>

      {/* Multi-Window Render Tree */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {Object.values(windows).map(win => (
          <div key={win.id} className="pointer-events-auto">
            <WindowFrame window={win} />
          </div>
        ))}
      </div>

      {/* Rubberband Lasso Selection Box */}
      <LassoSelection
        startX={lasso.startX}
        startY={lasso.startY}
        currentX={lasso.currentX}
        currentY={lasso.currentY}
        isVisible={lasso.isActive}
      />
    </div>
  );
};
