export interface CharCentroid {
  element: HTMLElement;
  char: string;
  cx: number;
  cy: number;
  currentWght: number;
  targetWght: number;
  currentScale: number;
  targetScale: number;
  currentDx: number;
  targetDx: number;
  currentDy: number;
  targetDy: number;
}

export interface KineticConfig {
  influenceRadius: number; // 220
  baseWeight: number;      // 600
  maxWeight: number;       // 850
  maxScale: number;        // 1.12
  maxDisplacement: number; // 8.0
  lerpAlpha: number;       // 0.14
  settleThreshold: number; // 0.05
}

export interface HeroMetadata {
  identity: {
    name: string;
    role: string;
  };
  status: {
    text: string;
    isAvailable: boolean;
  };
  location: {
    coordinates: string;
    timezone: string;
  };
  cta: {
    label: string;
    targetAppId: string;
  };
}
