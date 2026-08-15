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

export const DOCK_SPRING_PHYSICS = {
  mass: 0.1,
  stiffness: 420,
  damping: 26,
};
