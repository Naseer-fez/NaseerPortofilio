'use client';

import React, { useState, useRef } from 'react';
import { APPS } from '@/lib/constants/apps';
import { DockItem } from './DockItem';
import { calculateFisheyeWidth } from '@/lib/physics/springUtils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function Dock() {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    const x = e.clientX;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      setMouseX(x);
      rafRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setMouseX(null);
  };

  return (
    <div
      ref={dockRef}
      data-testid="desktop-dock"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="hidden md:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] items-end px-5 py-3 space-x-4 rounded-full backdrop-blur-2xl bg-black/40 border border-white/20 shadow-2xl select-none"
      style={{
        borderRadius: '9999px',
        backdropFilter: 'blur(24px) saturate(190%) contrast(105%)',
        WebkitBackdropFilter: 'blur(24px) saturate(190%) contrast(105%)',
        boxShadow:
          '0 16px 40px -4px rgba(0,0,0,0.65), 0 4px 16px -2px rgba(0,0,0,0.35), inset 0 1px 1px 0 rgba(255,255,255,0.25)',
      }}
    >
      {APPS.map((app, index) => {
        let width = 44;
        if (mouseX !== null && dockRef.current) {
          const itemEl = dockRef.current.querySelector(`[data-testid="dock-item-${app.id}"]`);
          if (itemEl) {
            const rect = itemEl.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const dist = mouseX - itemCenter;
            width = calculateFisheyeWidth(dist, {
              baseWidth: 44,
              maxScale: 2.0,
              radius: 160,
              exponent: 2.2,
            });
          }
        }

        return (
          <DockItem
            key={app.id}
            app={app}
            magnifiedWidth={width}
            isDockHovered={mouseX !== null}
            index={index}
          />
        );
      })}

      {/* Dock Divider */}
      <div
        data-testid="dock-divider"
        className="w-[1px] h-8 bg-white/15 my-auto mx-1"
        style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }}
      />
    </div>
  );
}
