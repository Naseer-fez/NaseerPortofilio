import { vi } from 'vitest';

let frameIdCounter = 0;
const queuedCallbacks = new Map<number, (time: number) => void>();
let simulatedTime = 0;

export function installRafMock(): void {
  window.requestAnimationFrame = vi.fn().mockImplementation((callback: (time: number) => void) => {
    const id = ++frameIdCounter;
    queuedCallbacks.set(id, callback);
    return id;
  });

  window.cancelAnimationFrame = vi.fn().mockImplementation((id: number) => {
    queuedCallbacks.delete(id);
  });
}

export function advanceFrames(frameCount: number = 1, dt: number = 16.67): void {
  for (let i = 0; i < frameCount; i++) {
    simulatedTime += dt;
    const currentQueue = Array.from(queuedCallbacks.entries());
    queuedCallbacks.clear();
    for (const [, callback] of currentQueue) {
      callback(simulatedTime);
    }
  }
}

export function resetRafMock(): void {
  frameIdCounter = 0;
  queuedCallbacks.clear();
  simulatedTime = 0;
}
