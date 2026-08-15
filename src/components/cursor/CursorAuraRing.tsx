'use client';

import React from 'react';
import { CursorVariant } from '@/types/cursor';

interface CursorAuraRingProps {
  x: number;
  y: number;
  variant: CursorVariant;
  radius: number;
}

export function CursorAuraRing({ x, y, variant, radius }: CursorAuraRingProps) {
  if (variant === 'disabled') return null;

  const isPrecisionDrag = variant === 'precision-drag';
  const isMagneticDock = variant === 'magnetic-dock';

  const diameter = isMagneticDock ? 56 : radius * 2;
  const borderRadius = isMagneticDock ? '16px' : '9999px';
  const scale = isPrecisionDrag ? 0 : 1;

  return (
    <div
      data-testid="cursor-aura-ring"
      className="fixed pointer-events-none z-[10001] border-2 border-white/60 will-change-transform transition-[border-radius,transform] duration-100 ease-out"
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius,
        transform: `translate3d(${x - diameter / 2}px, ${y - diameter / 2}px, 0) scale(${scale})`,
        mixBlendMode: 'difference',
        pointerEvents: 'none',
      }}
    />
  );
}
