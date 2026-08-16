import { get, set, del } from 'idb-keyval';

const CUSTOM_WALLPAPER_KEY = 'portfolio-os-custom-wallpaper';

export const wallpaperStorage = {
  /**
   * Save a custom wallpaper Blob/File to IndexedDB
   */
  async saveWallpaper(file: File | Blob): Promise<void> {
    await set(CUSTOM_WALLPAPER_KEY, file);
  },

  /**
   * Retrieve the custom wallpaper Blob from IndexedDB
   */
  async getWallpaper(): Promise<Blob | undefined> {
    return await get<Blob>(CUSTOM_WALLPAPER_KEY);
  },

  /**
   * Clear the custom wallpaper from IndexedDB
   */
  async clearWallpaper(): Promise<void> {
    await del(CUSTOM_WALLPAPER_KEY);
  }
};
