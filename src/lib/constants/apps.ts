import { AppMetadata, AppWindow, Position } from '@/types/os';

export const DEFAULT_APPS: AppMetadata[] = [
  {
    id: 'terminal',
    title: 'Terminal',
    description: 'Interactive CLI, Neofetch System Info, Command Interpreter',
    icon: 'Terminal',
    category: 'system',
    defaultSize: { width: 640, height: 400 },
    minSize: { width: 380, height: 240 },
    defaultPosition: { x: 120, y: 80 },
    showInDock: true,
    showOnDesktop: true,
    shortcut: 'Cmd+Option+T',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Portfolio Showcase Gallery with Category Filtering',
    icon: 'Briefcase',
    category: 'portfolio',
    defaultSize: { width: 800, height: 550 },
    minSize: { width: 450, height: 320 },
    defaultPosition: { x: 160, y: 70 },
    showInDock: true,
    showOnDesktop: true,
    shortcut: 'Cmd+2',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  },
  {
    id: 'about',
    title: 'About Me',
    description: 'Biography, Career Timeline, Skills Radar, Resume PDF',
    icon: 'User',
    category: 'portfolio',
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 420, height: 300 },
    defaultPosition: { x: 200, y: 100 },
    showInDock: true,
    showOnDesktop: true,
    shortcut: 'Cmd+3',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
  },
  {
    id: 'finder',
    title: 'Finder',
    description: 'System File Browser and Navigation Tree',
    icon: 'Folder',
    category: 'system',
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 420, height: 300 },
    defaultPosition: { x: 80, y: 60 },
    showInDock: true,
    showOnDesktop: true,
    shortcut: 'Cmd+1',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'OS Customization: Wallpapers, Themes, Audio, Docks',
    icon: 'Settings',
    category: 'system',
    defaultSize: { width: 600, height: 450 },
    minSize: { width: 400, height: 300 },
    defaultPosition: { x: 240, y: 120 },
    showInDock: true,
    showOnDesktop: true,
    shortcut: 'Cmd+,',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
  {
    id: 'mail',
    title: 'Mail',
    description: 'Interactive Contact Form with Validation & Dispatch',
    icon: 'Mail',
    category: 'portfolio',
    defaultSize: { width: 550, height: 400 },
    minSize: { width: 380, height: 260 },
    defaultPosition: { x: 280, y: 90 },
    showInDock: true,
    showOnDesktop: true,
    shortcut: 'Cmd+4',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  },
];

export const APPS = DEFAULT_APPS;

export const DEFAULT_APPS_MAP: Record<string, AppMetadata> = DEFAULT_APPS.reduce(
  (acc, app) => {
    acc[app.id] = app;
    return acc;
  },
  {} as Record<string, AppMetadata>
);

/**
 * Calculates a cascading spawn position with 24px step
 */
export function calculateCascadePosition(
  basePosition: Position,
  openCount: number,
  viewportWidth = 1440,
  viewportHeight = 900,
  windowWidth = 640,
  windowHeight = 400
): Position {
  const step = 24;
  const startX = 120;
  const startY = 80;

  if (openCount === 0) {
    return basePosition || { x: startX, y: startY };
  }

  const maxOffsetX = Math.max(50, viewportWidth - windowWidth - 100);
  const maxOffsetY = Math.max(50, viewportHeight - windowHeight - 120);

  const offsetX = (openCount * step) % maxOffsetX;
  const offsetY = (openCount * step) % maxOffsetY;

  return {
    x: startX + offsetX,
    y: startY + offsetY,
  };
}

/**
 * Creates an initial AppWindow state from metadata
 */
export function createInitialWindowState(
  meta: AppMetadata,
  zIndex = 20,
  openCount = 0
): AppWindow {
  const defaultPosition = meta.defaultPosition || { x: 120, y: 80 };

  return {
    id: meta.id,
    title: meta.title,
    icon: meta.icon,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex,
    position: { ...defaultPosition },
    size: { ...meta.defaultSize },
    minSize: meta.minSize || { width: 360, height: 240 },
    maxSize: meta.maxSize,
    defaultPosition: meta.defaultPosition,
    defaultSize: { ...meta.defaultSize },
  };
}

/**
 * Prepopulated initial windows record
 */
export const INITIAL_WINDOWS: Record<string, AppWindow> = DEFAULT_APPS.reduce(
  (acc, app, index) => {
    acc[app.id] = createInitialWindowState(app, 20 + index, 0);
    return acc;
  },
  {} as Record<string, AppWindow>
);
