import React, { useState, useEffect, useRef } from 'react';
import { CursorPrecisionDot } from './CursorPrecisionDot';
import { CursorAuraRing } from './CursorAuraRing';
import { CursorVariant } from '@/types/cursor';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function KineticCursor() {
  const { isMobile } = useBreakpoint();

  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [auraPos, setAuraPos] = useState({ x: -100, y: -100 });
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [auraRadius, setAuraRadius] = useState(12);

  const prevPosRef = useRef({ x: -100, y: -100 });
  const auraPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (isMobile) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      setPos({ x, y });

      // Calculate instantaneous velocity
      const dx = x - prevPosRef.current.x;
      const dy = y - prevPosRef.current.y;
      const speed = Math.hypot(dx, dy);
      prevPosRef.current = { x, y };

      // Velocity expansion: base 12px up to 40px radius (80px diameter)
      const dynamicRadius = Math.min(40, 12 + speed * 0.5);
      setAuraRadius(dynamicRadius);

      // Determine variant from target
      const target = document.elementFromPoint(x, y) as HTMLElement;
      if (target) {
        const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor') as CursorVariant;
        if (cursorAttr) {
          setVariant(cursorAttr);
        } else if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
          setVariant('pointer');
        } else {
          setVariant('default');
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Lerp follow loop
    let animId: number;
    const lerpLoop = () => {
      animId = requestAnimationFrame(lerpLoop);
      const targetX = prevPosRef.current.x;
      const targetY = prevPosRef.current.y;
      const lambda = 0.15;

      auraPosRef.current.x += (targetX - auraPosRef.current.x) * lambda;
      auraPosRef.current.y += (targetY - auraPosRef.current.y) * lambda;

      setAuraPos({
        x: auraPosRef.current.x,
        y: auraPosRef.current.y,
      });
    };

    lerpLoop();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [isMobile]);

  // If mobile or coarse pointer, do not render cursor
  if (isMobile) return null;

  return (
    <>
      <CursorPrecisionDot x={pos.x} y={pos.y} />
      <CursorAuraRing x={auraPos.x} y={auraPos.y} variant={variant} radius={auraRadius} />
    </>
  );
}
