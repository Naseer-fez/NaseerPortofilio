import React from 'react';

interface LassoSelectionProps {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isVisible: boolean;
}

export const LassoSelection: React.FC<LassoSelectionProps> = ({
  startX,
  startY,
  currentX,
  currentY,
  isVisible,
}) => {
  if (!isVisible) return null;

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  if (width < 2 && height < 2) return null;

  return (
    <div
      className="absolute pointer-events-none z-15 bg-primary/20 border border-primary/60 rounded-xs"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
};
