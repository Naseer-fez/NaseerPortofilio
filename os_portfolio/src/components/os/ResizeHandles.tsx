import React from 'react';
import { ResizeHandle } from '../../utils/windowMath';

interface ResizeHandlesProps {
  onResizeStart: (handle: ResizeHandle, e: React.PointerEvent) => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResizeStart }) => {
  return (
    <>
      {/* 4 Cardinal Handles */}
      {/* North */}
      <div
        className="absolute top-0 left-3 right-3 h-1.5 cursor-ns-resize z-30"
        onPointerDown={e => onResizeStart('n', e)}
      />
      {/* South */}
      <div
        className="absolute bottom-0 left-3 right-3 h-1.5 cursor-ns-resize z-30"
        onPointerDown={e => onResizeStart('s', e)}
      />
      {/* East */}
      <div
        className="absolute right-0 top-3 bottom-3 w-1.5 cursor-ew-resize z-30"
        onPointerDown={e => onResizeStart('e', e)}
      />
      {/* West */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1.5 cursor-ew-resize z-30"
        onPointerDown={e => onResizeStart('w', e)}
      />

      {/* 4 Diagonal Corner Handles */}
      {/* North-West */}
      <div
        className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-40"
        onPointerDown={e => onResizeStart('nw', e)}
      />
      {/* North-East */}
      <div
        className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-40"
        onPointerDown={e => onResizeStart('ne', e)}
      />
      {/* South-West */}
      <div
        className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-40"
        onPointerDown={e => onResizeStart('sw', e)}
      />
      {/* South-East */}
      <div
        className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize z-40"
        onPointerDown={e => onResizeStart('se', e)}
      />
    </>
  );
};
