import { expect } from 'vitest';

interface CustomMatchers<R = unknown> {
  toBeInZIndexRange(min: number, max: number): R;
  toHaveZIndexOrder(belowElement: HTMLElement): R;
  toBeClampedWithinViewport(constraints?: { minY?: number; minOverhang?: number }): R;
  toMatchGlassmorphism(spec: { blur?: string; saturate?: string }): R;
  toHaveWindowBounds(expected: { x?: number; y?: number; width?: number; height?: number }): R;
  toHaveDockMagnification(expectedScale: number, tolerance?: number): R;
  toHaveDuckedVolume(expectedDuckLevel?: number, tolerance?: number): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toBeInZIndexRange(received: HTMLElement, min: number, max: number) {
    const rawZIndex = received.style.zIndex || window.getComputedStyle(received).zIndex || '0';
    const zIndex = parseInt(rawZIndex, 10) || 0;
    const pass = zIndex >= min && zIndex <= max;
    return {
      pass,
      message: () => `expected element z-index (${zIndex}) ${pass ? 'not ' : ''}to be between ${min} and ${max}`,
    };
  },

  toHaveZIndexOrder(received: HTMLElement, belowElement: HTMLElement) {
    const rawTopZ = received.style.zIndex || window.getComputedStyle(received).zIndex || '0';
    const rawBottomZ = belowElement.style.zIndex || window.getComputedStyle(belowElement).zIndex || '0';
    const topZ = parseInt(rawTopZ, 10) || 0;
    const bottomZ = parseInt(rawBottomZ, 10) || 0;
    const pass = topZ > bottomZ;
    return {
      pass,
      message: () => `expected element with z-index ${topZ} ${pass ? 'not ' : ''}to be above element with z-index ${bottomZ}`,
    };
  },

  toBeClampedWithinViewport(received: HTMLElement, constraints: { minY?: number; minOverhang?: number } = {}) {
    const minY = constraints.minY ?? 28;
    const minOverhang = constraints.minOverhang ?? 100;
    const rect = received.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const clampedTop = rect.top >= minY;
    const visibleX = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
    const visibleY = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));

    const pass = clampedTop && visibleX >= minOverhang && visibleY >= minOverhang;
    return {
      pass,
      message: () => `expected window bounds (${rect.left}, ${rect.top}, ${rect.width}x${rect.height}) ${pass ? 'not ' : ''}to satisfy clamping (minY: ${minY}, minOverhang: ${minOverhang}px, visible: ${visibleX}x${visibleY})`,
    };
  },

  toMatchGlassmorphism(received: HTMLElement, spec: { blur?: string; saturate?: string }) {
    const style = window.getComputedStyle(received);
    const backdrop = style.backdropFilter || (style as any).webkitBackdropFilter || received.style.backdropFilter || '';
    const className = received.className || '';
    
    let pass = true;
    if (spec.blur) {
      const hasBlurStyle = backdrop.includes(`blur(${spec.blur})`);
      const hasBlurClass = className.includes('backdrop-blur') || className.includes('blur-');
      if (!hasBlurStyle && !hasBlurClass) pass = false;
    }
    if (spec.saturate) {
      const hasSatStyle = backdrop.includes(`saturate(${spec.saturate})`);
      const hasSatClass = className.includes('saturate-') || className.includes('backdrop-saturate');
      if (!hasSatStyle && !hasSatClass) pass = false;
    }

    return {
      pass,
      message: () => `expected element backdrop "${backdrop}" with class "${className}" ${pass ? 'not ' : ''}to match glassmorphism spec (blur: ${spec.blur}, saturate: ${spec.saturate})`,
    };
  },

  toHaveWindowBounds(received: HTMLElement, expected: { x?: number; y?: number; width?: number; height?: number }) {
    const rect = received.getBoundingClientRect();
    let pass = true;
    const failures: string[] = [];

    if (expected.x !== undefined && Math.abs(rect.left - expected.x) > 2) {
      pass = false;
      failures.push(`x: expected ${expected.x}, got ${rect.left}`);
    }
    if (expected.y !== undefined && Math.abs(rect.top - expected.y) > 2) {
      pass = false;
      failures.push(`y: expected ${expected.y}, got ${rect.top}`);
    }
    if (expected.width !== undefined && Math.abs(rect.width - expected.width) > 2) {
      pass = false;
      failures.push(`width: expected ${expected.width}, got ${rect.width}`);
    }
    if (expected.height !== undefined && Math.abs(rect.height - expected.height) > 2) {
      pass = false;
      failures.push(`height: expected ${expected.height}, got ${rect.height}`);
    }

    return {
      pass,
      message: () => `expected window bounds to match: ${failures.join(', ')}`,
    };
  },

  toHaveDockMagnification(received: HTMLElement, expectedScale: number, tolerance: number = 0.08) {
    const rect = received.getBoundingClientRect();
    const baseSize = 44;
    const actualScale = (rect.width || baseSize) / baseSize;
    const pass = Math.abs(actualScale - expectedScale) <= tolerance;

    return {
      pass,
      message: () => `expected dock item scale (${actualScale.toFixed(3)}) ${pass ? 'not ' : ''}to be within ${tolerance} of ${expectedScale}`,
    };
  },

  toHaveDuckedVolume(receivedGain: any, expectedDuckLevel: number = 0.20, tolerance: number = 0.05) {
    const value = receivedGain?.gain?.value ?? receivedGain?.value ?? receivedGain;
    const num = typeof value === 'number' ? value : parseFloat(value);
    const pass = Math.abs(num - expectedDuckLevel) <= tolerance;
    return {
      pass,
      message: () => `expected music volume gain (${num}) ${pass ? 'not ' : ''}to duck to ${expectedDuckLevel} ± ${tolerance}`,
    };
  },
});
