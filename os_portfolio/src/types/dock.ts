import { AppId } from './os';

export interface DockItemConfig {
  id: AppId;
  title: string;
  icon: string; // Lucide icon name
  badge?: number | string;
  dividerAfter?: boolean;
}

export interface DockSpringConfig {
  mass: number;     // 0.15
  stiffness: number;// 200
  damping: number;  // 18
  restDelta: number;// 0.001
}

export interface DockState {
  mouseX: number;
  hoveredItemId: AppId | null;
  bouncingItemId: AppId | null;
}
