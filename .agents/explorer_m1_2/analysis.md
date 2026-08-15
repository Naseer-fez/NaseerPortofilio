# State & Interaction Specification Analysis — Milestone 1 (Core OS Framework)

**Date**: 2026-08-15  
**Explorer**: Explorer 2 (Milestone 1 — Core OS Framework)  
**Scope**: `types/os.ts`, `lib/constants/apps.ts`, `hooks/useOSStore.ts`, `hooks/useKeyboardShortcuts.ts`, and `lib/constants/shortcuts.ts`

---

## Executive Summary

This document establishes the concrete, production-ready specifications and complete TypeScript code implementations for the macOS-Style Portfolio OS state architecture and keyboard interaction system.

The core OS state is driven by a single unified **Zustand store** (`useOSStore`) with selective localStorage persistence, strict TypeScript type definitions, multi-window stacking and focus management with z-index orchestration, macOS window geometry clamping, cascading window positioning, and a cross-platform keyboard shortcut system (`useKeyboardShortcuts`).

---

## 1. Complete TypeScript Type Definitions (`types/os.ts`)

The OS system requires exhaustive type definitions governing window state, geometry, desktop modes, themes, context menus, shortcuts, and application metadata.

### Proposed Code for `types/os.ts`:

```typescript
/**
 * macOS Portfolio OS — Core Type Definitions
 * System Layer: State Architecture & Interface Contracts
 */

export type DesktopMode = 'workspace' | 'ambient' | 'ambient-hero';

export type ThemeMode = 'dark' | 'light' | 'system';

export type AppCategory = 'system' | 'portfolio' | 'utility';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

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
}

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

  // Audio Configuration
  soundEnabled: boolean;
  soundVolume: number;

  // Context Menu & Modals
  contextMenu: ContextMenuState | null;
  spotlightOpen: boolean;
  controlCenterOpen: boolean;

  // Desktop Selection
  selectedIconIds: string[];
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

  // Sound Actions
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;

  // Context Menu Actions
  setContextMenu: (menu: ContextMenuState | null) => void;
  closeContextMenu: () => void;

  // Modals & Overlays
  setSpotlightOpen: (open: boolean) => void;
  toggleSpotlight: () => void;
  setControlCenterOpen: (open: boolean) => void;
  toggleControlCenter: () => void;

  // Desktop Icon Selection
  selectIcon: (id: string, multiSelect?: boolean) => void;
  setSelectedIcons: (ids: string[]) => void;
  deselectAllIcons: () => void;

  // App Registry
  registerApp: (app: AppMetadata) => void;
}

export type OSStore = OSStoreState & OSStoreActions;
```

---

## 2. Initial Application Registry (`lib/constants/apps.ts`)

The application registry declares the 6 core macOS-style applications: **Terminal**, **Projects**, **About Me**, **Finder**, **Settings**, and **Mail**.

### Geometry Specifications

| App ID | Title | Icon | Category | Default Size (W×H) | Min Size (W×H) | Default Position (X, Y) |
|---|---|---|---|---|---|---|
| `finder` | Finder | Folder | System | 700 × 500 | 420 × 300 | 80, 60 |
| `terminal` | Terminal | Terminal | System | 640 × 400 | 380 × 240 | 120, 80 |
| `projects` | Projects | Briefcase | Portfolio | 800 × 550 | 450 × 320 | 160, 70 |
| `about` | About Me | User | Portfolio | 700 × 500 | 420 × 300 | 200, 100 |
| `settings` | Settings | Settings | System | 600 × 450 | 400 × 300 | 240, 120 |
| `mail` | Mail | Mail | Portfolio | 550 × 400 | 380 × 260 | 280, 90 |

### Proposed Code for `lib/constants/apps.ts`:

```typescript
import { AppMetadata, AppWindow, Position } from '@/types/os';

export const DEFAULT_APPS: AppMetadata[] = [
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
  },
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
  },
];

export const DEFAULT_APPS_MAP: Record<string, AppMetadata> = DEFAULT_APPS.reduce(
  (acc, app) => {
    acc[app.id] = app;
    return acc;
  },
  {} as Record<string, AppMetadata>
);

/**
 * Calculates a cascading spawn position to avoid exact window overlaps
 */
export function calculateCascadePosition(
  basePosition: Position,
  openCount: number,
  viewportWidth = 1440,
  viewportHeight = 900,
  windowWidth = 640,
  windowHeight = 400
): Position {
  const step = 26;
  const maxOffsetX = Math.max(50, viewportWidth - windowWidth - 100);
  const maxOffsetY = Math.max(50, viewportHeight - windowHeight - 120);

  const offsetX = (openCount * step) % maxOffsetX;
  const offsetY = (openCount * step) % maxOffsetY;

  return {
    x: Math.max(20, Math.min(basePosition.x + offsetX, viewportWidth - windowWidth - 20)),
    y: Math.max(32, Math.min(basePosition.y + offsetY, viewportHeight - windowHeight - 60)),
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
  const defaultPosition = meta.defaultPosition || { x: 100, y: 100 };
  const position = calculateCascadePosition(
    defaultPosition,
    openCount,
    typeof window !== 'undefined' ? window.innerWidth : 1440,
    typeof window !== 'undefined' ? window.innerHeight : 900,
    meta.defaultSize.width,
    meta.defaultSize.height
  );

  return {
    id: meta.id,
    title: meta.title,
    icon: meta.icon,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    zIndex,
    position,
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
```

---

## 3. Zustand OS Store (`hooks/useOSStore.ts`)

### Requirements & Architecture
1. **Separation of Concerns**: OS store exclusively manages windows, desktop mode, wallpaper, theme, and context menus. Audio streaming/playback is strictly isolated to `useMusicStore`.
2. **Selective Persistence**:
   - Persisted to `localStorage`: `theme`, `wallpaperId`, `soundEnabled`, `soundVolume`, `desktopMode`.
   - Ephemeral (page reload reset): `windows`, `activeWindowId`, `contextMenu`, `spotlightOpen`, `controlCenterOpen`, `selectedIconIds`.
3. **Z-Index Elevation**:
   - Base z-index starts at 20.
   - Focusing or opening a window increments `maxZIndex` and promotes that window above all other Layer 2 windows (up to z-49).
4. **Window Deactivation & Focus Delegation**:
   - When active window closes or minimizes, focus delegates automatically to the topmost remaining open, non-minimized window.
5. **Geometry Clamping**:
   - `y >= 28` (top menu bar safe clearance).
   - Horizontal clamping allows partial overhang with at least 100px visible.
   - Resizing enforces `width >= minSize.width` and `height >= minSize.height`.

### Proposed Code for `hooks/useOSStore.ts`:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  OSStore,
  AppWindow,
  DesktopMode,
  ThemeMode,
  Position,
  Size,
  ContextMenuState,
  AppMetadata,
} from '@/types/os';
import {
  DEFAULT_APPS_MAP,
  INITIAL_WINDOWS,
  calculateCascadePosition,
} from '@/lib/constants/apps';

const MENU_BAR_HEIGHT = 28;
const MIN_OVERHANG_VISIBLE = 100;

export const useOSStore = create<OSStore>()(
  persist(
    (set, get) => ({
      // State Properties
      windows: INITIAL_WINDOWS,
      activeWindowId: null,
      baseZIndex: 20,
      maxZIndex: 25,
      desktopMode: 'workspace',
      theme: 'dark',
      wallpaperId: 'sonoma-dark',
      soundEnabled: true,
      soundVolume: 0.5,
      contextMenu: null,
      spotlightOpen: false,
      controlCenterOpen: false,
      selectedIconIds: [],

      // Actions
      openWindow: (id: string, initialConfig?: Partial<AppWindow>) => {
        const state = get();
        const existingWindow = state.windows[id];
        const nextZIndex = Math.max(state.maxZIndex + 1, 21);

        const openCount = Object.values(state.windows).filter((w) => w.isOpen).length;

        // If window already exists in dictionary
        if (existingWindow) {
          const updatedWindows = { ...state.windows };

          // Unfocus all other windows
          Object.keys(updatedWindows).forEach((wId) => {
            updatedWindows[wId] = {
              ...updatedWindows[wId],
              isFocused: wId === id,
            };
          });

          // Position if opening from closed state
          let newPosition = existingWindow.position;
          if (!existingWindow.isOpen) {
            newPosition = calculateCascadePosition(
              existingWindow.defaultPosition || { x: 100, y: 100 },
              openCount,
              typeof window !== 'undefined' ? window.innerWidth : 1440,
              typeof window !== 'undefined' ? window.innerHeight : 900,
              existingWindow.size.width,
              existingWindow.size.height
            );
          }

          updatedWindows[id] = {
            ...existingWindow,
            ...initialConfig,
            isOpen: true,
            isMinimized: false,
            isFocused: true,
            zIndex: nextZIndex,
            position: initialConfig?.position || newPosition,
          };

          set({
            windows: updatedWindows,
            activeWindowId: id,
            maxZIndex: nextZIndex,
            contextMenu: null,
          });
          return;
        }

        // Window not yet in dictionary: create from metadata
        const meta = DEFAULT_APPS_MAP[id];
        const defaultSize = meta?.defaultSize || { width: 640, height: 400 };
        const minSize = meta?.minSize || { width: 360, height: 240 };
        const defaultPosition = meta?.defaultPosition || { x: 100, y: 100 };

        const cascadedPosition = calculateCascadePosition(
          defaultPosition,
          openCount,
          typeof window !== 'undefined' ? window.innerWidth : 1440,
          typeof window !== 'undefined' ? window.innerHeight : 900,
          defaultSize.width,
          defaultSize.height
        );

        const newWindow: AppWindow = {
          id,
          title: meta?.title || id.charAt(0).toUpperCase() + id.slice(1),
          icon: meta?.icon || 'AppWindow',
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          isFocused: true,
          zIndex: nextZIndex,
          position: cascadedPosition,
          size: defaultSize,
          minSize,
          maxSize: meta?.maxSize,
          defaultPosition,
          defaultSize,
          ...initialConfig,
        };

        const updatedWindows = { ...state.windows };
        Object.keys(updatedWindows).forEach((wId) => {
          updatedWindows[wId] = {
            ...updatedWindows[wId],
            isFocused: false,
          };
        });
        updatedWindows[id] = newWindow;

        set({
          windows: updatedWindows,
          activeWindowId: id,
          maxZIndex: nextZIndex,
          contextMenu: null,
        });
      },

      closeWindow: (id: string) => {
        const state = get();
        const target = state.windows[id];
        if (!target || !target.isOpen) return;

        const updatedWindows = {
          ...state.windows,
          [id]: {
            ...target,
            isOpen: false,
            isFocused: false,
            isMaximized: false,
          },
        };

        // Determine new active window if closed window was active
        let nextActiveId = state.activeWindowId;
        if (state.activeWindowId === id) {
          const remainingOpen = Object.values(updatedWindows).filter(
            (w) => w.id !== id && w.isOpen && !w.isMinimized
          );

          if (remainingOpen.length > 0) {
            remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
            nextActiveId = remainingOpen[0].id;
            updatedWindows[nextActiveId] = {
              ...updatedWindows[nextActiveId],
              isFocused: true,
            };
          } else {
            nextActiveId = null;
          }
        }

        set({
          windows: updatedWindows,
          activeWindowId: nextActiveId,
        });
      },

      minimizeWindow: (id: string) => {
        const state = get();
        const target = state.windows[id];
        if (!target || !target.isOpen || target.isMinimized) return;

        const updatedWindows = {
          ...state.windows,
          [id]: {
            ...target,
            isMinimized: true,
            isFocused: false,
          },
        };

        let nextActiveId = state.activeWindowId;
        if (state.activeWindowId === id) {
          const remainingOpen = Object.values(updatedWindows).filter(
            (w) => w.id !== id && w.isOpen && !w.isMinimized
          );

          if (remainingOpen.length > 0) {
            remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
            nextActiveId = remainingOpen[0].id;
            updatedWindows[nextActiveId] = {
              ...updatedWindows[nextActiveId],
              isFocused: true,
            };
          } else {
            nextActiveId = null;
          }
        }

        set({
          windows: updatedWindows,
          activeWindowId: nextActiveId,
        });
      },

      restoreWindow: (id: string) => {
        const state = get();
        const target = state.windows[id];
        if (!target) return;

        get().openWindow(id);
      },

      toggleMaximize: (id: string) => {
        const state = get();
        const target = state.windows[id];
        if (!target || !target.isOpen) return;

        const nextZIndex = Math.max(state.maxZIndex + 1, 21);
        const isCurrentlyMaximized = target.isMaximized;

        const updatedWindows = { ...state.windows };

        // Unfocus other windows
        Object.keys(updatedWindows).forEach((wId) => {
          updatedWindows[wId] = {
            ...updatedWindows[wId],
            isFocused: wId === id,
          };
        });

        if (isCurrentlyMaximized) {
          // Restore previous bounds
          const prev = target.prevBounds || {
            x: target.defaultPosition?.x ?? 100,
            y: target.defaultPosition?.y ?? 100,
            width: target.defaultSize.width,
            height: target.defaultSize.height,
          };

          updatedWindows[id] = {
            ...target,
            isMaximized: false,
            isFocused: true,
            zIndex: nextZIndex,
            position: { x: prev.x, y: prev.y },
            size: { width: prev.width, height: prev.height },
            prevBounds: undefined,
          };
        } else {
          // Save current bounds and maximize
          const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
          const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

          updatedWindows[id] = {
            ...target,
            isMaximized: true,
            isFocused: true,
            zIndex: nextZIndex,
            prevBounds: {
              x: target.position.x,
              y: target.position.y,
              width: target.size.width,
              height: target.size.height,
            },
            position: { x: 0, y: MENU_BAR_HEIGHT },
            size: { width: vw, height: vh - MENU_BAR_HEIGHT },
          };
        }

        set({
          windows: updatedWindows,
          activeWindowId: id,
          maxZIndex: nextZIndex,
        });
      },

      focusWindow: (id: string) => {
        const state = get();
        const target = state.windows[id];
        if (!target || !target.isOpen) return;

        if (state.activeWindowId === id && target.isFocused && !target.isMinimized) {
          return;
        }

        const nextZIndex = Math.max(state.maxZIndex + 1, 21);
        const updatedWindows = { ...state.windows };

        Object.keys(updatedWindows).forEach((wId) => {
          updatedWindows[wId] = {
            ...updatedWindows[wId],
            isFocused: wId === id,
            isMinimized: wId === id ? false : updatedWindows[wId].isMinimized,
          };
        });

        updatedWindows[id] = {
          ...target,
          isOpen: true,
          isMinimized: false,
          isFocused: true,
          zIndex: nextZIndex,
        };

        set({
          windows: updatedWindows,
          activeWindowId: id,
          maxZIndex: nextZIndex,
        });
      },

      updatePosition: (id: string, position: Position) => {
        const state = get();
        const target = state.windows[id];
        if (!target) return;

        const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

        // macOS Window drag clamping
        const clampedX = Math.max(
          -(target.size.width - MIN_OVERHANG_VISIBLE),
          Math.min(position.x, vw - MIN_OVERHANG_VISIBLE)
        );
        const clampedY = Math.max(
          MENU_BAR_HEIGHT,
          Math.min(position.y, vh - 40)
        );

        set({
          windows: {
            ...state.windows,
            [id]: {
              ...target,
              position: { x: clampedX, y: clampedY },
              isMaximized: false,
            },
          },
        });
      },

      updateSize: (id: string, size: Size) => {
        const state = get();
        const target = state.windows[id];
        if (!target) return;

        const clampedWidth = Math.max(size.width, target.minSize.width);
        const clampedHeight = Math.max(size.height, target.minSize.height);

        set({
          windows: {
            ...state.windows,
            [id]: {
              ...target,
              size: { width: clampedWidth, height: clampedHeight },
              isMaximized: false,
            },
          },
        });
      },

      // Desktop & Mode Actions
      setDesktopMode: (mode: DesktopMode) => set({ desktopMode: mode }),

      toggleDesktopMode: () => {
        const current = get().desktopMode;
        set({ desktopMode: current === 'workspace' ? 'ambient' : 'workspace' });
      },

      // Theme Actions
      setTheme: (theme: ThemeMode) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
          } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', systemPrefersDark);
          }
        }
      },

      toggleTheme: () => {
        const current = get().theme;
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
      },

      setWallpaper: (wallpaperId: string) => set({ wallpaperId }),

      // Sound Actions
      setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled }),
      setSoundVolume: (soundVolume: number) =>
        set({ soundVolume: Math.max(0, Math.min(1, soundVolume)) }),

      // Context Menu Actions
      setContextMenu: (contextMenu: ContextMenuState | null) => set({ contextMenu }),
      closeContextMenu: () => set({ contextMenu: null }),

      // Overlays Actions
      setSpotlightOpen: (spotlightOpen: boolean) =>
        set({ spotlightOpen, contextMenu: null }),
      toggleSpotlight: () =>
        set((state) => ({ spotlightOpen: !state.spotlightOpen, contextMenu: null })),

      setControlCenterOpen: (controlCenterOpen: boolean) =>
        set({ controlCenterOpen, contextMenu: null }),
      toggleControlCenter: () =>
        set((state) => ({ controlCenterOpen: !state.controlCenterOpen, contextMenu: null })),

      // Desktop Icon Selection
      selectIcon: (id: string, multiSelect = false) => {
        const { selectedIconIds } = get();
        if (multiSelect) {
          const isSelected = selectedIconIds.includes(id);
          set({
            selectedIconIds: isSelected
              ? selectedIconIds.filter((i) => i !== id)
              : [...selectedIconIds, id],
          });
        } else {
          set({ selectedIconIds: [id] });
        }
      },

      setSelectedIcons: (ids: string[]) => set({ selectedIconIds: ids }),

      deselectAllIcons: () => {
        if (get().selectedIconIds.length > 0) {
          set({ selectedIconIds: [] });
        }
      },

      registerApp: (app: AppMetadata) => {
        const state = get();
        if (state.windows[app.id]) return;

        const newWin = createInitialWindowState(app, state.maxZIndex + 1);
        set({
          windows: {
            ...state.windows,
            [app.id]: newWin,
          },
        });
      },
    }),
    {
      name: 'macos-portfolio-os-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        wallpaperId: state.wallpaperId,
        soundEnabled: state.soundEnabled,
        soundVolume: state.soundVolume,
        desktopMode: state.desktopMode,
      }),
    }
  )
);
```

---

## 4. Keyboard Shortcuts System (`lib/constants/shortcuts.ts` & `hooks/useKeyboardShortcuts.ts`)

### Shortcut Key Bindings Specification

| Key Combination | Scope | Target Action | Allow in Input? | `preventDefault` |
|---|---|---|---|---|
| `Cmd/Ctrl + K` | Global | Toggle Spotlight Search | YES | YES |
| `Cmd/Ctrl + W` | Focused Window | Close current active window | NO | YES |
| `Cmd/Ctrl + M` | Focused Window | Minimize current active window | NO | YES |
| `Cmd/Ctrl + Shift + D` | Global | Toggle Dark/Light Theme | NO | YES |
| `Cmd/Ctrl + Option + M` | Global | Toggle Ambient/Workspace mode | NO | YES |
| `Cmd/Ctrl + Option + T` | Global | Launch / Focus Terminal | NO | YES |
| `Escape` | Global | Dismiss ContextMenu, Spotlight, ControlCenter | YES | YES |

### Proposed Code for `lib/constants/shortcuts.ts`:

```typescript
export interface OSShortcutDefinition {
  id: string;
  keyLabel: string;
  description: string;
  category: 'system' | 'window' | 'navigation';
}

export const OS_SHORTCUTS: OSShortcutDefinition[] = [
  {
    id: 'spotlight',
    keyLabel: '⌘K / Ctrl+K',
    description: 'Toggle Spotlight Search command palette',
    category: 'navigation',
  },
  {
    id: 'close_window',
    keyLabel: '⌘W / Ctrl+W',
    description: 'Close active window',
    category: 'window',
  },
  {
    id: 'minimize_window',
    keyLabel: '⌘M / Ctrl+M',
    description: 'Minimize active window',
    category: 'window',
  },
  {
    id: 'toggle_theme',
    keyLabel: '⌘⇧D / Ctrl+Shift+D',
    description: 'Toggle Dark and Light theme',
    category: 'system',
  },
  {
    id: 'toggle_ambient',
    keyLabel: '⌘⌥M / Ctrl+Alt+M',
    description: 'Toggle Workspace and Ambient Hero mode',
    category: 'system',
  },
  {
    id: 'open_terminal',
    keyLabel: '⌘⌥T / Ctrl+Alt+T',
    description: 'Open or focus Terminal CLI',
    category: 'navigation',
  },
  {
    id: 'dismiss',
    keyLabel: 'Esc',
    description: 'Dismiss popups, context menus, and spotlight',
    category: 'system',
  },
];
```

### Proposed Code for `hooks/useKeyboardShortcuts.ts`:

```typescript
'use client';

import { useEffect } from 'react';
import { useOSStore } from './useOSStore';

function isInputElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    element.isContentEditable
  );
}

export function useKeyboardShortcuts() {
  const {
    activeWindowId,
    spotlightOpen,
    contextMenu,
    controlCenterOpen,
    closeWindow,
    minimizeWindow,
    toggleSpotlight,
    setSpotlightOpen,
    closeContextMenu,
    setControlCenterOpen,
    toggleTheme,
    toggleDesktopMode,
    openWindow,
  } = useOSStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const isAltOrOption = e.altKey;
      const isShift = e.shiftKey;
      const key = e.key.toLowerCase();
      const inInput = isInputElement(e.target);

      // 1. Escape: Dismiss overlay modals & menus (Always active, even in inputs)
      if (e.key === 'Escape') {
        if (contextMenu) {
          e.preventDefault();
          closeContextMenu();
          return;
        }
        if (spotlightOpen) {
          e.preventDefault();
          setSpotlightOpen(false);
          return;
        }
        if (controlCenterOpen) {
          e.preventDefault();
          setControlCenterOpen(false);
          return;
        }
      }

      // 2. Cmd/Ctrl + K: Spotlight Search toggle (Allowed inside inputs)
      if (isCmdOrCtrl && !isAltOrOption && !isShift && key === 'k') {
        e.preventDefault();
        toggleSpotlight();
        return;
      }

      // Remaining shortcuts are suppressed while actively typing in input fields
      if (inInput) return;

      // 3. Cmd/Ctrl + W: Close current active window
      if (isCmdOrCtrl && !isAltOrOption && !isShift && key === 'w') {
        if (activeWindowId) {
          e.preventDefault();
          closeWindow(activeWindowId);
        }
        return;
      }

      // 4. Cmd/Ctrl + M: Minimize current active window
      if (isCmdOrCtrl && !isAltOrOption && !isShift && key === 'm') {
        if (activeWindowId) {
          e.preventDefault();
          minimizeWindow(activeWindowId);
        }
        return;
      }

      // 5. Cmd/Ctrl + Shift + D: Toggle Dark/Light Theme
      if (isCmdOrCtrl && isShift && !isAltOrOption && key === 'd') {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // 6. Cmd/Ctrl + Option + M: Toggle Ambient/Workspace Mode
      if (isCmdOrCtrl && isAltOrOption && !isShift && key === 'm') {
        e.preventDefault();
        toggleDesktopMode();
        return;
      }

      // 7. Cmd/Ctrl + Option + T: Open/Focus Terminal
      if (isCmdOrCtrl && isAltOrOption && !isShift && key === 't') {
        e.preventDefault();
        openWindow('terminal');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeWindowId,
    spotlightOpen,
    contextMenu,
    controlCenterOpen,
    closeWindow,
    minimizeWindow,
    toggleSpotlight,
    setSpotlightOpen,
    closeContextMenu,
    setControlCenterOpen,
    toggleTheme,
    toggleDesktopMode,
    openWindow,
  ]);
}
```

---

## 5. Hydration & SSR Safety

When Next.js App Router renders on the server and mounts on the client with Zustand localStorage persistence:
- Initial SSR renders default theme/wallpaper.
- On mount, localStorage hydrates.
- To prevent hydration mismatch warnings when applying theme classes or wallpaper styling, we recommend a client-only mounting guard hook `useHydrated()` or initial theme applicator script in `src/app/layout.tsx`.

### Recommended Hook: `hooks/useHydrated.ts`
```typescript
'use client';

import { useState, useEffect } from 'react';

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
```

---

## 6. Implementation Action Plan for Implementer (Worker 2)

1. Create `src/types/os.ts` with all complete interfaces.
2. Create `src/lib/constants/apps.ts` with the 6 app definitions, geometry calculations, and initial state factories.
3. Create `src/lib/constants/shortcuts.ts` with shortcut metadata.
4. Create `src/hooks/useOSStore.ts` with complete Zustand store, actions, and persistence.
5. Create `src/hooks/useKeyboardShortcuts.ts` with keyboard event listener and input safeguards.
6. Create `src/hooks/useHydrated.ts` for SSR hydration safety.
7. Write unit tests for store actions: open, close, minimize, toggleMaximize, focus, cascade positioning, z-index elevation, and keyboard shortcut event handlers.
