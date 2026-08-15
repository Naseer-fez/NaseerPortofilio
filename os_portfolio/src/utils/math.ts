/**
 * Mathematical utilities for Proximity Scaling Dock and Kinetic Typography
 */

/**
 * 1D Cosine Proximity Scaling for Taskbar Dock (R2)
 * Evaluated on the 1D horizontal projection d = |mouseX - iconCenterX| with radius R = 150px
 * W_i(x) = S_base + (S_max - S_base)/2 * [1 + cos(pi * min(d, R) / R)]
 */
export function calculateDockIconWidth(
  mouseX: number,
  iconCenterX: number,
  baseWidth: number = 40,
  maxWidth: number = 72,
  radius: number = 150
): number {
  if (mouseX === Infinity || isNaN(mouseX)) return baseWidth;
  const distance = Math.abs(mouseX - iconCenterX);
  if (distance >= radius) return baseWidth;
  const cosineFactor = (1 + Math.cos((Math.PI * distance) / radius)) / 2;
  return baseWidth + (maxWidth - baseWidth) * cosineFactor;
}

/**
 * 2D Euclidean Distance
 */
export function calculateEuclideanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 2D Cosine Bell Falloff for Kinetic Typography (R3)
 * f(d) = cos^2(pi * min(d, R) / (2 * R)) = 0.5 * (1 + cos(pi * min(d, R) / R))
 */
export function calculateCosineBellFalloff(
  distance: number,
  radius: number = 220
): number {
  if (distance >= radius) return 0;
  const halfCos = Math.cos((Math.PI * distance) / (2 * radius));
  return halfCos * halfCos;
}

/**
 * Linear Interpolation (LERP) filter
 */
export function lerp(start: number, end: number, alpha: number): number {
  return start + (end - start) * alpha;
}

/**
 * Clamp a number within inclusive [min, max] range
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
