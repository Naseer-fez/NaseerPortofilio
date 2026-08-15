import { AppMetadata, WindowId } from './os';

export type AppConfig = AppMetadata;

export interface LegacyAppConfig {
  id: WindowId;
  title: string;
  icon: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  category: 'system' | 'work' | 'info' | 'portfolio' | 'utility';
}
