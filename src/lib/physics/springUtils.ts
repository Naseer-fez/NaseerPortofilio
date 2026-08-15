export interface CosineBellConfig {
  baseWidth: number;
  maxWidth: number;
  radius: number;
}

export function calculateCosineBellWidth(
  distance: number,
  config: CosineBellConfig = { baseWidth: 44, maxWidth: 68, radius: 150 }
): number {
  const { baseWidth, maxWidth, radius } = config;
  const absDist = Math.abs(distance);
  if (absDist >= radius) {
    return baseWidth;
  }
  const delta = maxWidth - baseWidth;
  const cosineFactor = (1 + Math.cos((Math.PI * absDist) / radius)) / 2;
  return baseWidth + delta * cosineFactor;
}

export interface DockFisheyeConfig {
  baseWidth: number;
  maxScale: number;
  radius: number;
  exponent: number;
}

export function calculateFisheyeWidth(
  distance: number,
  config: Partial<DockFisheyeConfig> = {}
): number {
  const {
    baseWidth = 44,
    maxScale = 2.0,
    radius = 140,
    exponent = 2.2,
  } = config;

  const absDist = Math.abs(distance);
  if (absDist >= radius) {
    return baseWidth;
  }

  const factor = Math.cos((absDist / radius) * (Math.PI / 2));
  const curve = Math.pow(factor, exponent);
  const scale = 1.0 + (maxScale - 1.0) * curve;
  return baseWidth * scale;
}

export const DOCK_SPRING_PHYSICS = {
  mass: 0.1,
  stiffness: 420,
  damping: 26,
};
