import { vi } from 'vitest';

export function installPointerEventsMock(): void {
  if (typeof window !== 'undefined') {
    (window as any).PointerEvent = class PointerEvent extends MouseEvent {
      pointerId: number;
      pointerType: string;
      pressure: number;

      constructor(type: string, params: any = {}) {
        super(type, params);
        this.pointerId = params.pointerId ?? 1;
        this.pointerType = params.pointerType ?? 'mouse';
        this.pressure = params.pressure ?? 0;
      }
    };
  }

  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(true);
}
