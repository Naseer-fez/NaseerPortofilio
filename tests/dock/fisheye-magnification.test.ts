import { describe, it, expect } from 'vitest';
import { calculateFisheyeWidth } from '@/lib/physics/springUtils';

describe('Parabolic Fisheye Magnification Physics', () => {
  it('magnifies center hovered icon to 2.0x base width (88px for 44px base)', () => {
    const width = calculateFisheyeWidth(0, {
      baseWidth: 44,
      maxScale: 2.0,
      radius: 140,
      exponent: 2.2,
    });
    expect(width).toBeCloseTo(88, 1);
  });

  it('scales immediate neighbor at ~50px distance to ~74.4px (~1.69x scale, ~0.70 relative curve step)', () => {
    const width = calculateFisheyeWidth(50, {
      baseWidth: 44,
      maxScale: 2.0,
      radius: 140,
      exponent: 2.2,
    });
    // At d=50: cos(50/140 * PI/2)^2.2 = 0.8467^2.2 ~= 0.692 -> 44 * (1 + 0.692) ~= 74.45px
    expect(width).toBeGreaterThan(70);
    expect(width).toBeLessThan(78);
  });

  it('scales next neighbor at ~100px distance to ~51px (~1.16x scale)', () => {
    const width = calculateFisheyeWidth(100, {
      baseWidth: 44,
      maxScale: 2.0,
      radius: 140,
      exponent: 2.2,
    });
    expect(width).toBeGreaterThan(48);
    expect(width).toBeLessThan(56);
  });

  it('returns unmagnified base width (44px) when cursor distance >= radius (140px)', () => {
    const widthAtBoundary = calculateFisheyeWidth(140, {
      baseWidth: 44,
      maxScale: 2.0,
      radius: 140,
      exponent: 2.2,
    });
    expect(widthAtBoundary).toBe(44);

    const widthFar = calculateFisheyeWidth(300, {
      baseWidth: 44,
      maxScale: 2.0,
      radius: 140,
      exponent: 2.2,
    });
    expect(widthFar).toBe(44);
  });
});
