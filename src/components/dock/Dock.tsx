import React, { useState, useRef } from 'react';
import { APPS } from '@/lib/constants/apps';
import { DockItem } from './DockItem';
import { MusicPlayerDockPill } from './MusicPlayerDockPill';
import { calculateCosineBellWidth } from '@/lib/physics/springUtils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function Dock() {
  const { isMobile } = useBreakpoint();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  if (isMobile) return null;

  const handlePointerMove = (e: React.PointerEvent) => {
    setMouseX(e.clientX);
  };

  const handlePointerLeave = () => {
    setMouseX(null);
  };

  return (
    <div
      ref={dockRef}
      data-testid="desktop-dock"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] flex items-end px-3 py-2 space-x-2.5 rounded-full backdrop-blur-2xl bg-black/35 border border-white/20 shadow-2xl select-none"
      style={{
        borderRadius: '9999px',
        backdropFilter: 'blur(20px) saturate(190%) contrast(105%)',
        WebkitBackdropFilter: 'blur(20px) saturate(190%) contrast(105%)',
        boxShadow: '0 12px 36px -4px rgba(0,0,0,0.55), 0 4px 16px -2px rgba(0,0,0,0.35), inset 0 1px 1px 0 rgba(255,255,255,0.22)',
      }}
    >
      {APPS.map(app => {
        let width = 44;
        if (mouseX !== null && dockRef.current) {
          const itemEl = dockRef.current.querySelector(`[data-testid="dock-item-${app.id}"]`);
          if (itemEl) {
            const rect = itemEl.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const dist = mouseX - itemCenter;
            width = calculateCosineBellWidth(dist, { baseWidth: 44, maxWidth: 68, radius: 150 });
          }
        }

        return <DockItem key={app.id} app={app} magnifiedWidth={width} />;
      })}

      {/* Dock Divider */}
      <div
        data-testid="dock-divider"
        className="w-[1px] h-8 bg-white/15 my-auto mx-1"
        style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }}
      />

      {/* Music Player Dock Pill */}
      <MusicPlayerDockPill
        magnifiedWidth={
          mouseX !== null
            ? calculateCosineBellWidth(50, { baseWidth: 44, maxWidth: 68, radius: 150 })
            : 44
        }
      />
    </div>
  );
}
