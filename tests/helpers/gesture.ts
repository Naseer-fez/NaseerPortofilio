import { fireEvent } from '@testing-library/react';

export function simulateMobileSwipe(
  element: Element,
  options: { startY: number; deltaY: number; startX?: number; deltaX?: number; steps?: number }
): void {
  const { startY, deltaY, startX = 100, deltaX = 0, steps = 10 } = options;

  fireEvent.touchStart(element, {
    touches: [{ clientX: startX, clientY: startY }],
    changedTouches: [{ clientX: startX, clientY: startY }],
  });

  for (let i = 1; i <= steps; i++) {
    const currentY = startY + (deltaY * i) / steps;
    const currentX = startX + (deltaX * i) / steps;
    fireEvent.touchMove(element, {
      touches: [{ clientX: currentX, clientY: currentY }],
      changedTouches: [{ clientX: currentX, clientY: currentY }],
    });
  }

  fireEvent.touchEnd(element, {
    touches: [],
    changedTouches: [{ clientX: startX + deltaX, clientY: startY + deltaY }],
  });
}
