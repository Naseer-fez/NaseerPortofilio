import { simulateDrag } from './drag';

export type ResizeHandleDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export function simulateResizeHandle(
  windowFrame: HTMLElement,
  handle: ResizeHandleDirection,
  delta: { dx: number; dy: number },
  steps: number = 5
): void {
  const handleEl = windowFrame.querySelector(`[data-resize-handle="${handle}"]`);
  if (!handleEl) {
    throw new Error(`Resize handle "${handle}" not found on window frame.`);
  }

  const rect = handleEl.getBoundingClientRect();
  const startX = rect.left + (rect.width || 10) / 2;
  const startY = rect.top + (rect.height || 10) / 2;

  simulateDrag(handleEl, {
    from: { x: startX, y: startY },
    to: { x: startX + delta.dx, y: startY + delta.dy },
    steps,
  });
}
