'use client';

import React from 'react';

interface DockTooltipProps {
  title: string;
}

export const DockTooltip = React.memo(function DockTooltip({ title }: DockTooltipProps) {
  return (
    <div
      role="tooltip"
      data-testid="dock-tooltip"
      className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md text-[11.5px] font-medium text-white shadow-lg pointer-events-none select-none whitespace-nowrap border border-white/10"
      style={{
        background: 'rgba(24, 24, 28, 0.88)',
        backdropFilter: 'blur(12px)',
        fontSize: '11.5px',
        borderRadius: '6px',
      }}
    >
      {title}
    </div>
  );
});
