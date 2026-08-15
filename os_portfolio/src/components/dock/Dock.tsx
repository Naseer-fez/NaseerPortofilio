import React, { useState, useRef } from 'react';
import { DockItem } from './DockItem';
import { DockItemConfig } from '../../types/dock';

const DOCK_ITEMS: DockItemConfig[] = [
  { id: 'finder', title: 'Finder', icon: 'Folder' },
  { id: 'projects', title: 'Projects', icon: 'FolderGit2' },
  { id: 'terminal', title: 'Terminal', icon: 'Terminal' },
  { id: 'about', title: 'About Me', icon: 'User' },
  { id: 'settings', title: 'Settings', icon: 'Settings', dividerAfter: true },
  { id: 'music', title: 'Music', icon: 'Music' },
];

export const Dock: React.FC = () => {
  const [mouseX, setMouseX] = useState<number>(Infinity);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseX(e.clientX);
  };

  const handleMouseLeave = () => {
    setMouseX(Infinity);
  };

  return (
    <div
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 select-none"
      role="toolbar"
      aria-label="Application Dock"
    >
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex items-end gap-2 px-3.5 py-2 glassmorphic-dock rounded-pill border border-hairline-dark shadow-dock transition-all"
        style={{
          height: mouseX === Infinity ? '64px' : '78px',
        }}
      >
        {DOCK_ITEMS.map(item => (
          <React.Fragment key={item.id}>
            <DockItem
              id={item.id}
              title={item.title}
              icon={item.icon}
              mouseX={mouseX}
              isSpecialMusicToggle={item.id === 'music'}
            />
            {item.dividerAfter && (
              <div className="w-[1px] h-9 bg-white/15 my-auto mx-1 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
