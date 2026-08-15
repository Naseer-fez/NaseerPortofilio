'use client';

import React from 'react';

interface CursorPrecisionDotProps {
  x: number;
  y: number;
}

export const CursorPrecisionDot = React.memo(function CursorPrecisionDot({ x, y }: CursorPrecisionDotProps) {
  return (
    <div
      data-testid="cursor-precision-dot"
      className="fixed pointer-events-none z-[10001] rounded-full bg-white will-change-transform"
      style={{
        width: '4px',
        height: '4px',
        borderRadius: '9999px',
        backgroundColor: '#ffffff',
        transform: `translate3d(${x - 2}px, ${y - 2}px, 0)`,
        pointerEvents: 'none',
      }}
    />
  );
});
