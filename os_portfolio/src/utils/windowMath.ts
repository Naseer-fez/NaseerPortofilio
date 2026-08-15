/**
 * Mathematical utilities for window dragging and 8-direction resizing
 */

export type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface ResizeDeltaParams {
  handle: ResizeHandle;
  startPos: { x: number; y: number };
  startSize: { width: number; height: number };
  deltaX: number;
  deltaY: number;
  minWidth?: number;
  minHeight?: number;
  menuBarHeight?: number;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Clamps window (x, y) coordinates within viewport boundaries:
 * - y >= 28px (prevents window header from slipping behind top menu bar)
 * - Horizontal overhang allows at least 100px of header to remain visible
 * - y <= viewportHeight - 60px (prevents window from vanishing below bottom)
 */
export function clampWindowPosition(
  proposedX: number,
  proposedY: number,
  winWidth: number,
  winHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  menuBarHeight = 28,
  minVisibleHeader = 100
): { x: number; y: number } {
  const minX = -(winWidth - minVisibleHeader);
  const maxX = viewportWidth - minVisibleHeader;
  const minY = menuBarHeight;
  const maxY = Math.max(minY, viewportHeight - 60);

  return {
    x: Math.max(minX, Math.min(proposedX, maxX)),
    y: Math.max(minY, Math.min(proposedY, maxY)),
  };
}

/**
 * 8-Direction Resizing Delta Engine
 * Calculates new bounds (x, y, width, height) based on active handle and pointer deltas
 */
export function computeResizeBounds({
  handle,
  startPos,
  startSize,
  deltaX,
  deltaY,
  minWidth = 360,
  minHeight = 240,
  menuBarHeight = 28,
  viewportWidth,
  viewportHeight,
}: ResizeDeltaParams): { x: number; y: number; width: number; height: number } {
  let { x, y } = startPos;
  let { width, height } = startSize;

  // 1. East resizing (width growth to the right)
  if (handle.includes('e')) {
    const candidateW = startSize.width + deltaX;
    width = Math.max(minWidth, Math.min(candidateW, viewportWidth - x));
  }

  // 2. West resizing (width growth to the left, shifts x origin)
  if (handle.includes('w')) {
    const proposedWidth = startSize.width - deltaX;
    const proposedX = startPos.x + deltaX;
    if (proposedWidth >= minWidth && proposedX >= -(minWidth - 100)) {
      width = proposedWidth;
      x = proposedX;
    } else if (proposedWidth < minWidth) {
      width = minWidth;
      x = startPos.x + (startSize.width - minWidth);
    }
  }

  // 3. South resizing (height growth downward)
  if (handle.includes('s')) {
    const candidateH = startSize.height + deltaY;
    height = Math.max(minHeight, Math.min(candidateH, viewportHeight - y));
  }

  // 4. North resizing (height growth upward, shifts y origin, respects menu bar)
  if (handle.includes('n')) {
    const proposedHeight = startSize.height - deltaY;
    const proposedY = startPos.y + deltaY;
    if (proposedHeight >= minHeight && proposedY >= menuBarHeight) {
      height = proposedHeight;
      y = proposedY;
    } else if (proposedHeight < minHeight) {
      height = minHeight;
      y = startPos.y + (startSize.height - minHeight);
    } else if (proposedY < menuBarHeight) {
      y = menuBarHeight;
      height = startPos.y + startSize.height - menuBarHeight;
    }
  }

  return { x, y, width, height };
}
