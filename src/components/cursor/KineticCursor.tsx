'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CursorVariant } from '@/types/cursor';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function KineticCursor() {
  const { isMobile } = useBreakpoint();

  // Only variant needs React state (changes infrequently)
  const [variant, setVariant] = useState<CursorVariant>('default');

  const prevPosRef = useRef({ x: -100, y: -100 });
  const auraPosRef = useRef({ x: -100, y: -100 });
  const radiusRef = useRef(12);

  // DOM refs for direct manipulation (avoids 60fps React re-renders)
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;

      // Direct DOM update for precision dot — no React state
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 2}px, ${y - 2}px, 0)`;
      }

      // Calculate instantaneous velocity
      const dx = x - prevPosRef.current.x;
      const dy = y - prevPosRef.current.y;
      const speed = Math.hypot(dx, dy);
      prevPosRef.current = { x, y };

      // Velocity expansion: base 12px up to 40px radius (80px diameter)
      radiusRef.current = Math.min(40, 12 + speed * 0.5);

      // Determine variant from target (only update state if changed)
      const target = document.elementFromPoint(x, y) as HTMLElement;
      if (target) {
        const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor') as CursorVariant;
        let newVariant: CursorVariant;
        if (cursorAttr) {
          newVariant = cursorAttr;
        } else if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
          newVariant = 'pointer';
        } else {
          newVariant = 'default';
        }
        setVariant(prev => prev === newVariant ? prev : newVariant);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Lerp follow loop — direct DOM updates
    let animId: number;
    const lerpLoop = () => {
      animId = requestAnimationFrame(lerpLoop);
      const targetX = prevPosRef.current.x;
      const targetY = prevPosRef.current.y;
      const lambda = 0.15;

      auraPosRef.current.x += (targetX - auraPosRef.current.x) * lambda;
      auraPosRef.current.y += (targetY - auraPosRef.current.y) * lambda;

      // Direct DOM update for aura ring — no React state
      if (auraRef.current) {
        const r = radiusRef.current;
        const diameter = r * 2;
        const ax = auraPosRef.current.x;
        const ay = auraPosRef.current.y;
        auraRef.current.style.width = `${diameter}px`;
        auraRef.current.style.height = `${diameter}px`;
        auraRef.current.style.transform = `translate3d(${ax - r}px, ${ay - r}px, 0) scale(1)`;
      }
    };

    lerpLoop();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  // Aura ring variant-dependent styles (only re-renders when variant changes)
  const isPrecisionDrag = variant === 'precision-drag';
  const isMagneticDock = variant === 'magnetic-dock';
  const borderRadius = isMagneticDock ? '16px' : '9999px';

  return (
    <div className="hidden md:block pointer-events-none">
      {/* Precision Dot — positioned via ref, not state */}
      <div
        ref={dotRef}
        data-testid="cursor-precision-dot"
        className="fixed pointer-events-none z-[10001] rounded-full bg-white will-change-transform"
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '9999px',
          backgroundColor: '#ffffff',
          transform: 'translate3d(-100px, -100px, 0)',
          pointerEvents: 'none',
        }}
      />
      {/* Aura Ring — positioned via ref, not state */}
      {variant !== 'disabled' && (
        <div
          ref={auraRef}
          data-testid="cursor-aura-ring"
          className="fixed pointer-events-none z-[10001] border-2 border-white/60 will-change-transform transition-[border-radius] duration-100 ease-out"
          style={{
            width: '24px',
            height: '24px',
            borderRadius,
            transform: `translate3d(-100px, -100px, 0) scale(${isPrecisionDrag ? 0 : 1})`,
            mixBlendMode: 'difference',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
