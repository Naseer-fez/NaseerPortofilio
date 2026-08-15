import { fireEvent } from '@testing-library/react';

export interface DragOptions {
  from?: { x: number; y: number };
  to: { x: number; y: number };
  steps?: number;
  pointerType?: 'mouse' | 'touch';
}

export function simulateDrag(element: Element, options: DragOptions): void {
  const { from = { x: 0, y: 0 }, to, steps = 10, pointerType = 'mouse' } = options;

  fireEvent.pointerDown(element, {
    clientX: from.x,
    clientY: from.y,
    pointerId: 1,
    pointerType,
    buttons: 1,
  });

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const currentX = from.x + (to.x - from.x) * progress;
    const currentY = from.y + (to.y - from.y) * progress;

    fireEvent.pointerMove(window, {
      clientX: currentX,
      clientY: currentY,
      movementX: (to.x - from.x) / steps,
      movementY: (to.y - from.y) / steps,
      pointerId: 1,
      pointerType,
      buttons: 1,
    });
  }

  fireEvent.pointerUp(window, {
    clientX: to.x,
    clientY: to.y,
    pointerId: 1,
    pointerType,
    buttons: 0,
  });
}

export function simulateMarquee(
  desktopSurface: Element,
  options: { start: { x: number; y: number }; end: { x: number; y: number }; steps?: number }
): void {
  simulateDrag(desktopSurface, {
    from: options.start,
    to: options.end,
    steps: options.steps ?? 10,
    pointerType: 'mouse',
  });
}
