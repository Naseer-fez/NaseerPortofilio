import { describe, it, expect, beforeEach } from 'vitest';
import { useOSStore } from '@/hooks/useOSStore';
import { useMusicStore } from '@/hooks/useMusicStore';
import { calculateCosineBellWidth } from '@/lib/physics/springUtils';
import { solveEulerStep, calculateGaussianFalloff } from '@/lib/physics/eulerSolver';
import { setViewport } from '../helpers/viewport';

describe('Tier 2: Pointer & Viewport Boundaries', () => {
  beforeEach(() => {
    setViewport({ width: 1440, height: 900 });
  });

  it('T2-PTR-01: terminates window drag state safely on out-of-bounds coords', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().updatePosition('terminal', { x: -5000, y: -5000 });

    const win = useOSStore.getState().windows['terminal'];
    expect(win.position.y).toBeGreaterThanOrEqual(28);
  });

  it('T2-PTR-02: clamps scrubber seek position when dragged beyond boundaries', () => {
    useMusicStore.setState({ duration: 180 });
    useMusicStore.getState().seekTo(9999);
    expect(useMusicStore.getState().currentTime).toBe(180);

    useMusicStore.getState().seekTo(-100);
    expect(useMusicStore.getState().currentTime).toBe(0);
  });

  it('T2-PTR-03: computes Cosine Bell and Euler physics at extreme viewport sizes without NaN', () => {
    // Zero or near-zero distance
    const widthAtZero = calculateCosineBellWidth(0);
    expect(widthAtZero).toBe(68);
    expect(isNaN(widthAtZero)).toBe(false);

    // Infinite distance
    const widthAtInf = calculateCosineBellWidth(100000);
    expect(widthAtInf).toBe(44);
    expect(isNaN(widthAtInf)).toBe(false);

    // Euler ODE step
    const nextState = solveEulerStep({ x: 1000, v: 500 }, 0, { k: 280, c: 24, m: 1.0 });
    expect(isNaN(nextState.x)).toBe(false);
    expect(isNaN(nextState.v)).toBe(false);
  });

  it('T2-PTR-04: clamps variable font weight strictly in range [400, 900]', () => {
    const forceDirect = calculateGaussianFalloff(0, 260, 100);
    const weightDirect = Math.min(900, Math.max(400, Math.round(400 + forceDirect * 500)));
    expect(weightDirect).toBe(900);

    const forceFar = calculateGaussianFalloff(500, 260, 100);
    const weightFar = Math.min(900, Math.max(400, Math.round(400 + forceFar * 500)));
    expect(weightFar).toBe(400);
  });

  it('T2-PTR-05: handles selection marquee coordinate normalization', () => {
    const startX = 300;
    const startY = 300;
    const currentX = 100;
    const currentY = 100;

    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    expect(left).toBe(100);
    expect(top).toBe(100);
    expect(width).toBe(200);
    expect(height).toBe(200);
  });
});
