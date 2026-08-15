export type WindowId = 'terminal' | 'projects' | 'about' | 'finder' | 'settings' | 'mail';

export interface AppManifest {
  id: WindowId;
  title: string;
  icon: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  dockPosition: number;
}

export const mockAppManifests: Record<WindowId, AppManifest> = {
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: 'terminal',
    defaultPosition: { x: 120, y: 80 },
    defaultSize: { width: 680, height: 440 },
    minSize: { width: 360, height: 240 },
    dockPosition: 0,
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: 'folder-git2',
    defaultPosition: { x: 180, y: 110 },
    defaultSize: { width: 780, height: 520 },
    minSize: { width: 360, height: 240 },
    dockPosition: 1,
  },
  about: {
    id: 'about',
    title: 'About Me',
    icon: 'user',
    defaultPosition: { x: 220, y: 130 },
    defaultSize: { width: 560, height: 480 },
    minSize: { width: 360, height: 240 },
    dockPosition: 2,
  },
  finder: {
    id: 'finder',
    title: 'Finder',
    icon: 'compass',
    defaultPosition: { x: 260, y: 150 },
    defaultSize: { width: 720, height: 460 },
    minSize: { width: 360, height: 240 },
    dockPosition: 3,
  },
  settings: {
    id: 'settings',
    title: 'System Settings',
    icon: 'sliders',
    defaultPosition: { x: 300, y: 170 },
    defaultSize: { width: 620, height: 460 },
    minSize: { width: 360, height: 240 },
    dockPosition: 4,
  },
  mail: {
    id: 'mail',
    title: 'Mail',
    icon: 'mail',
    defaultPosition: { x: 340, y: 190 },
    defaultSize: { width: 640, height: 420 },
    minSize: { width: 360, height: 240 },
    dockPosition: 5,
  },
};
