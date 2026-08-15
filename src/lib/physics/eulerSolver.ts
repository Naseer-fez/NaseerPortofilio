export interface SpringState {
  x: number;
  v: number;
}

export interface SpringConfig {
  k: number; // spring stiffness (e.g. 280)
  c: number; // damping coefficient (e.g. 24)
  m: number; // mass (e.g. 1.0)
}

export function solveEulerStep(
  current: SpringState,
  targetX: number,
  config: SpringConfig,
  dt: number = 0.016
): SpringState {
  const displacement = current.x - targetX;
  const springForce = -config.k * displacement;
  const dampingForce = -config.c * current.v;
  const totalForce = springForce + dampingForce;
  const acceleration = totalForce / config.m;

  const nextV = current.v + acceleration * dt;
  const nextX = current.x + nextV * dt;

  return {
    x: nextX,
    v: nextV,
  };
}

export function calculateGaussianFalloff(
  distance: number,
  influenceRadius: number = 260,
  sigma: number = 100
): number {
  if (distance >= influenceRadius) return 0;
  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

export function getDampingRatio(k: number, c: number, m: number = 1.0): number {
  return c / (2 * Math.sqrt(k * m));
}
