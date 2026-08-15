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
  createInitialWindowState,
} from '@/lib/constants/apps';

const MENU_BAR_HEIGHT = 28;
const MIN_OVERHANG_VISIBLE = 100;

function normalizeZIndices(windows: Record<string, AppWindow>): number {
  const sorted = Object.values(windows).sort((a, b) => a.zIndex - b.zIndex);
  sorted.forEach((w, i) => {
    windows[w.id] = { ...w, zIndex: 20 + i };
  });
  return 20 + sorted.length;
}

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
      isLocked: true,
      selectedIconIds: [],
      desktopIconPositions: {},
      cassettePosition: { x: 0, y: 0 },

      // Actions
      openWindow: (id: string, initialConfig?: Partial<AppWindow>) => {
        const state = get();
        const windows = { ...(state.windows || INITIAL_WINDOWS) };
        const existingWindow = windows[id];
        let nextZIndex = state.maxZIndex + 1;
        if (nextZIndex > 49) {
          nextZIndex = normalizeZIndices(windows);
        }
        const openCount = Object.values(windows).filter((w) => w.isOpen).length;

        // If window already exists in dictionary
        if (existingWindow) {
          // Unfocus all other windows
          Object.keys(windows).forEach((wId) => {
            windows[wId] = {
              ...windows[wId],
              isFocused: wId === id,
            };
          });

          // Position if opening from closed state
          let newPosition = existingWindow.position;
          if (!existingWindow.isOpen) {
            newPosition = calculateCascadePosition(
              existingWindow.defaultPosition || { x: 120, y: 80 },
              openCount,
              typeof window !== 'undefined' ? window.innerWidth : 1440,
              typeof window !== 'undefined' ? window.innerHeight : 900,
              existingWindow.size.width,
              existingWindow.size.height
            );
          }

          windows[id] = {
            ...existingWindow,
            ...initialConfig,
            isOpen: true,
            isMinimized: false,
            isFocused: true,
            zIndex: Math.min(nextZIndex, 49),
            position: initialConfig?.position || newPosition,
          };

          set({
            windows,
            activeWindowId: id,
            maxZIndex: Math.min(nextZIndex, 49),
            contextMenu: null,
            desktopMode: 'workspace',
          });
          return;
        }

        // Window not yet in dictionary: create from metadata
        const meta = DEFAULT_APPS_MAP[id];
        const defaultSize = meta?.defaultSize || { width: 640, height: 400 };
        const minSize = meta?.minSize || { width: 360, height: 240 };
        const defaultPosition = meta?.defaultPosition || { x: 120, y: 80 };

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
          zIndex: Math.min(nextZIndex, 49),
          position: cascadedPosition,
          size: defaultSize,
          minSize,
          maxSize: meta?.maxSize,
          defaultPosition,
          defaultSize,
          ...initialConfig,
        };

        Object.keys(windows).forEach((wId) => {
          windows[wId] = {
            ...windows[wId],
            isFocused: false,
          };
        });
        windows[id] = newWindow;

        set({
          windows,
          activeWindowId: id,
          maxZIndex: Math.min(nextZIndex, 49),
          contextMenu: null,
          desktopMode: 'workspace',
        });
      },

      closeWindow: (id: string) => {
        const state = get();
        const windows = { ...(state.windows || INITIAL_WINDOWS) };
        const target = windows[id];
        if (!target || !target.isOpen) return;

        windows[id] = {
          ...target,
          isOpen: false,
          isFocused: false,
          isMaximized: false,
        };

        // Determine new active window if closed window was active
        let nextActiveId = state.activeWindowId;
        if (state.activeWindowId === id) {
          const remainingOpen = Object.values(windows).filter(
            (w) => w.id !== id && w.isOpen && !w.isMinimized
          );

          if (remainingOpen.length > 0) {
            remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
            nextActiveId = remainingOpen[0].id;
            windows[nextActiveId] = {
              ...windows[nextActiveId],
              isFocused: true,
            };
          } else {
            nextActiveId = null;
          }
        }

        set({
          windows,
          activeWindowId: nextActiveId,
        });
      },

      minimizeWindow: (id: string) => {
        const state = get();
        const windows = { ...(state.windows || INITIAL_WINDOWS) };
        const target = windows[id];
        if (!target || !target.isOpen || target.isMinimized) return;

        windows[id] = {
          ...target,
          isMinimized: true,
          isFocused: false,
        };

        let nextActiveId = state.activeWindowId;
        if (state.activeWindowId === id) {
          const remainingOpen = Object.values(windows).filter(
            (w) => w.id !== id && w.isOpen && !w.isMinimized
          );

          if (remainingOpen.length > 0) {
            remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
            nextActiveId = remainingOpen[0].id;
            windows[nextActiveId] = {
              ...windows[nextActiveId],
              isFocused: true,
            };
          } else {
            nextActiveId = null;
          }
        }

        set({
          windows,
          activeWindowId: nextActiveId,
        });
      },

      restoreWindow: (id: string) => {
        const state = get();
        const windows = state.windows || INITIAL_WINDOWS;
        const target = windows[id];
        if (!target) return;

        get().openWindow(id);
      },

      toggleMaximize: (id: string) => {
        const state = get();
        const windows = { ...(state.windows || INITIAL_WINDOWS) };
        const target = windows[id];
        if (!target || !target.isOpen) return;

        let nextZIndex = state.maxZIndex + 1;
        if (nextZIndex > 49) {
          nextZIndex = normalizeZIndices(windows);
        }
        const isCurrentlyMaximized = target.isMaximized;

        // Unfocus other windows
        Object.keys(windows).forEach((wId) => {
          windows[wId] = {
            ...windows[wId],
            isFocused: wId === id,
          };
        });

        if (isCurrentlyMaximized) {
          // Restore previous bounds
          const prev = target.prevBounds || {
            x: target.defaultPosition?.x ?? 120,
            y: target.defaultPosition?.y ?? 80,
            width: target.defaultSize.width,
            height: target.defaultSize.height,
          };

          windows[id] = {
            ...target,
            isMaximized: false,
            isFocused: true,
            zIndex: Math.min(nextZIndex, 49),
            position: { x: prev.x, y: prev.y },
            size: { width: prev.width, height: prev.height },
            prevBounds: undefined,
          };
        } else {
          // Save current bounds and maximize
          const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
          const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

          windows[id] = {
            ...target,
            isMaximized: true,
            isFocused: true,
            zIndex: Math.min(nextZIndex, 49),
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
          windows,
          activeWindowId: id,
          maxZIndex: Math.min(nextZIndex, 49),
        });
      },

      focusWindow: (id: string) => {
        const state = get();
        const windows = { ...(state.windows || INITIAL_WINDOWS) };
        const target = windows[id];
        if (!target || !target.isOpen) return;

        let nextZIndex = state.maxZIndex + 1;
        if (nextZIndex > 49) {
          nextZIndex = normalizeZIndices(windows);
        }

        Object.keys(windows).forEach((wId) => {
          windows[wId] = {
            ...windows[wId],
            isFocused: wId === id,
            isMinimized: wId === id ? false : windows[wId].isMinimized,
          };
        });

        windows[id] = {
          ...target,
          isOpen: true,
          isMinimized: false,
          isFocused: true,
          zIndex: Math.min(nextZIndex, 49),
        };

        set({
          windows,
          activeWindowId: id,
          maxZIndex: Math.min(nextZIndex, 49),
          desktopMode: 'workspace',
        });
      },

      updatePosition: (id: string, position: Position) => {
        const state = get();
        const windows = state.windows || INITIAL_WINDOWS;
        const target = windows[id];
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
            ...windows,
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
        const windows = state.windows || INITIAL_WINDOWS;
        const target = windows[id];
        if (!target) return;

        const minWidth = target.minSize?.width ?? 360;
        const minHeight = target.minSize?.height ?? 240;

        const clampedWidth = Math.max(size.width, minWidth);
        const clampedHeight = Math.max(size.height, minHeight);

        set({
          windows: {
            ...windows,
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
        set({ desktopMode: current === 'workspace' ? 'ambient-hero' : 'workspace' });
      },

      // Theme Actions
      setTheme: (theme: ThemeMode) => {
        set({ theme });
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('os-theme', theme);
        }
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

      setWallpaper: (wallpaperId: string) => {
        set({ wallpaperId });
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('os-wallpaper', wallpaperId);
        }
      },

      // Sound Actions
      setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled }),
      setSoundVolume: (soundVolume: number) =>
        set({ soundVolume: Math.max(0, Math.min(1, soundVolume)) }),

      // Context Menu Actions
      setContextMenu: (contextMenu: ContextMenuState | null) => set({ contextMenu }),
      openContextMenu: (contextMenu: ContextMenuState) => set({ contextMenu }),
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

      clearSelectedIcons: () => {
        if (get().selectedIconIds.length > 0) {
          set({ selectedIconIds: [] });
        }
      },

      updateIconPosition: (id: string, position: Position) => {
        const current = get().desktopIconPositions || {};
        set({
          desktopIconPositions: {
            ...current,
            [id]: position,
          },
        });
      },

      resetIconPositions: () => {
        set({ desktopIconPositions: {} });
      },

      updateCassettePosition: (position: Position) => {
        const maxX = typeof window !== 'undefined' ? Math.max(300, window.innerWidth - 380) : 1000;
        const maxY = typeof window !== 'undefined' ? Math.max(300, window.innerHeight - 340) : 800;
        const clamped = {
          x: Math.max(-maxX, Math.min(100, position.x || 0)),
          y: Math.max(-maxY, Math.min(100, position.y || 0)),
        };
        set({ cassettePosition: clamped });
      },

      resetCassettePosition: () => {
        set({ cassettePosition: { x: 0, y: 0 } });
      },

      // Lock Screen Actions
      unlock: () => set({ isLocked: false }),
      lock: () => set({ isLocked: true }),

      registerApp: (app: AppMetadata) => {
        const state = get();
        const windows = state.windows || INITIAL_WINDOWS;
        if (windows[app.id]) return;

        const newWin = createInitialWindowState(app, Math.min(state.maxZIndex + 1, 49));
        set({
          windows: {
            ...windows,
            [app.id]: newWin,
          },
        });
      },
    }),
    {
      name: 'macos-portfolio-os-state-v4',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        wallpaperId: state.wallpaperId,
        soundEnabled: state.soundEnabled,
        soundVolume: state.soundVolume,
        desktopMode: state.desktopMode,
        desktopIconPositions: state.desktopIconPositions,
        cassettePosition: state.cassettePosition,
      }),
    }
  )
);
