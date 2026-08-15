type ResizeCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ObservedElementRecord {
  target: Element;
  callback: ResizeCallback;
}

const observedElements: ObservedElementRecord[] = [];

export class MockResizeObserver {
  private _callback: ResizeCallback;

  constructor(callback: ResizeCallback) {
    this._callback = callback;
  }

  observe(target: Element): void {
    observedElements.push({ target, callback: this._callback });
  }

  unobserve(target: Element): void {
    const idx = observedElements.findIndex(r => r.target === target);
    if (idx !== -1) observedElements.splice(idx, 1);
  }

  disconnect(): void {
    const toRemove = observedElements.filter(r => r.callback === this._callback);
    toRemove.forEach(r => {
      const idx = observedElements.indexOf(r);
      if (idx !== -1) observedElements.splice(idx, 1);
    });
  }

  static triggerResize(target: Element, contentRect: Partial<DOMRectReadOnly>): void {
    const matches = observedElements.filter(r => r.target === target);
    if (matches.length === 0) return;

    const fullRect: DOMRectReadOnly = {
      x: contentRect.x ?? 0,
      y: contentRect.y ?? 0,
      width: contentRect.width ?? 100,
      height: contentRect.height ?? 100,
      top: contentRect.top ?? 0,
      right: (contentRect.x ?? 0) + (contentRect.width ?? 100),
      bottom: (contentRect.y ?? 0) + (contentRect.height ?? 100),
      left: contentRect.left ?? 0,
      toJSON: () => ({}),
    };

    const entry: ResizeObserverEntry = {
      target,
      contentRect: fullRect,
      borderBoxSize: [{ inlineSize: fullRect.width, blockSize: fullRect.height }],
      contentBoxSize: [{ inlineSize: fullRect.width, blockSize: fullRect.height }],
      devicePixelContentBoxSize: [{ inlineSize: fullRect.width, blockSize: fullRect.height }],
    };

    matches.forEach(match => {
      match.callback([entry], new MockResizeObserver(match.callback) as any);
    });
  }
}

export function installResizeObserverMock(): void {
  (window as any).ResizeObserver = MockResizeObserver;
}

export function resetResizeObserverMock(): void {
  observedElements.length = 0;
}
