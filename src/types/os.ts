/**
 * macOS Portfolio OS — Core Type Definitions
 * System Layer: State Architecture & Interface Contracts
 */

export type DesktopMode = 'workspace' | 'ambient' | 'ambient-hero';

export type ThemeMode = 'dark' | 'light' | 'system';

export type AppCategory = 'system' | 'portfolio' | 'utility' | 'work' | 'info';

export type WindowId = string;

export interface Position {
  x: number;
  y: number;
}

export type WindowPosition = Position;

export interface Size {
  width: number;
  height: number;
}

export type WindowSize = Size;

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * App Window State Representation
 */
export interface AppWindow {
  /** Unique window and application identifier (e.g., 'terminal', 'projects') */
  id: string;
  /** Display title in window title bar and TopMenuBar when active */
  title: string;
  /** Lucide icon identifier string */
  icon: string;
  /** Whether the window is currently open (rendered in DOM) */
  isOpen: boolean;
  /** Whether the window is minimized to the dock */
  isMinimized: boolean;
  /** Whether the window is maximized to full viewport */
  isMaximized: boolean;
  /** Whether the window currently has active user focus */
  isFocused: boolean;
  /** Z-index layer for stacking order (z-20 to z-49) */
  zIndex: number;
  /** Current (x, y) coordinates on DesktopCanvas */
  position: Position;
  /** Current (width, height) in pixels */
  size: Size;
  /** Enforced minimum size (default: 360x240) */
  minSize: Size;
  /** Optional maximum size constraints */
  maxSize?: Size;
  /** Stored bounds prior to maximize/minimize for seamless restore */
  prevBounds?: Bounds;
  prevPosition?: Position;
  prevSize?: Size;
  /** Default spawn position */
  defaultPosition?: Position;
  /** Default initial spawn size */
  defaultSize: Size;
}

/** Backward compatibility alias */
export type WindowState = AppWindow;

/**
 * Application Registry Metadata
 */
export interface AppMetadata {
  id: string;
  title: string;
  description?: string;
  icon: string;
  category: AppCategory;
  defaultPosition: Position;
  defaultSize: Size;
  minSize?: Size;
  maxSize?: Size;
  showInDock?: boolean;
  showOnDesktop?: boolean;
  shortcut?: string;
  gradient?: string;
}

export type AppDefinition = AppMetadata;
export type AppConfig = AppMetadata;

/**
 * Context Menu Data Structures
 */
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
  children?: ContextMenuItem[];
}

export interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
  targetId?: string;
}

/**
 * Keyboard Shortcut Definition
 */
export interface ShortcutHandler {
  id: string;
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  handler: (e: KeyboardEvent) => void;
  global?: boolean;
  allowInInput?: boolean;
}

/**
 * Complete OS Zustand Store State and Action Interface
 */
export interface OSStoreState {
  // Window Management
  windows: Record<string, AppWindow>;
  activeWindowId: string | null;
  baseZIndex: number;
  maxZIndex: number;

  // Desktop Environment
  desktopMode: DesktopMode;
  theme: ThemeMode;
  wallpaperId: string;
  customWallpaperUrl: string | null;

  // Audio Configuration
  soundEnabled: boolean;
  soundVolume: number;

  // Context Menu & Modals
  contextMenu: ContextMenuState | null;
  spotlightOpen: boolean;
  controlCenterOpen: boolean;

  // Lock Screen State
  isLocked: boolean;

  // Desktop Selection & Movable Elements
  selectedIconIds: string[];
  desktopIconPositions: Record<string, Position>;
  cassettePosition: Position;
}

export interface OSStoreActions {
  // Window Actions
  openWindow: (id: string, initialConfig?: Partial<AppWindow>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, position: Position) => void;
  updateSize: (id: string, size: Size) => void;

  // Desktop Mode Actions
  setDesktopMode: (mode: DesktopMode) => void;
  toggleDesktopMode: () => void;

  // Theme & Appearance Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setWallpaper: (wallpaperId: string) => void;
  setCustomWallpaper: (file: File) => Promise<void>;
  loadCustomWallpaper: () => Promise<void>;
  clearCustomWallpaper: () => void;

  // Sound Actions
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;

  // Context Menu Actions
  setContextMenu: (menu: ContextMenuState | null) => void;
  openContextMenu: (menu: ContextMenuState) => void;
  closeContextMenu: () => void;

  // Modals & Overlays
  setSpotlightOpen: (open: boolean) => void;
  toggleSpotlight: () => void;
  setControlCenterOpen: (open: boolean) => void;
  toggleControlCenter: () => void;

  // Desktop Icon Selection & Movement
  selectIcon: (id: string, multiSelect?: boolean) => void;
  setSelectedIcons: (ids: string[]) => void;
  deselectAllIcons: () => void;
  clearSelectedIcons: () => void;
  updateIconPosition: (id: string, position: Position) => void;
  resetIconPositions: () => void;

  // Widget Position Actions
  updateCassettePosition: (position: Position) => void;
  resetCassettePosition: () => void;

  // Lock Screen Actions
  unlock: () => void;
  lock: () => void;

  // App Registry
  registerApp: (app: AppMetadata) => void;
}

export type OSStore = OSStoreState & OSStoreActions;
export type OSState = OSStore;
