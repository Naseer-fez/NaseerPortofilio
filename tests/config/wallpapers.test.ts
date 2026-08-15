import { describe, it, expect } from 'vitest';
import {
  WALLPAPERS,
  getWallpaperById,
  getWallpaperPalette,
  DEFAULT_WALLPAPER_ID,
  getCassetteTheme,
} from '@/config/wallpapers';

describe('Wallpaper Configuration & Palettes', () => {
  it('contains at least 7 high-fidelity wallpaper configurations', () => {
    expect(WALLPAPERS.length).toBeGreaterThanOrEqual(7);
  });

  it('ensures each wallpaper definition has complete palette attributes', () => {
    WALLPAPERS.forEach((w) => {
      expect(w.id).toBeDefined();
      expect(w.name).toBeDefined();
      expect(w.fallbackGradient).toBeDefined();
      expect(w.accentColor).toBeDefined();
      expect(w.palette).toBeDefined();
      expect(w.palette.primary).toBeDefined();
      expect(w.palette.secondary).toBeDefined();
      expect(w.palette.accent).toBeDefined();
      expect(w.palette.surface).toBeDefined();
      expect(w.palette.border).toBeDefined();
      expect(w.palette.labelBg).toBeDefined();
      expect(w.palette.labelText).toBeDefined();
    });
  });

  it('falls back safely to default wallpaper when unknown id is supplied', () => {
    const fallback = getWallpaperById('non-existent-wallpaper');
    expect(fallback.id).toBe(DEFAULT_WALLPAPER_ID);

    const palette = getWallpaperPalette('non-existent-wallpaper');
    expect(palette.primary).toBe(fallback.palette.primary);
  });

  it('provides matching cassette theme for each wallpaper', () => {
    const sonomaDarkTheme = getCassetteTheme('sonoma-dark');
    expect(sonomaDarkTheme.bodyBg).toBe('#111420');
    expect(sonomaDarkTheme.accent).toBe('#3b82f6');
    expect(sonomaDarkTheme.ledGlow).toBe('#38bdf8');

    const sequoiaTheme = getCassetteTheme('sequoia-dark');
    expect(sequoiaTheme.bodyBg).toBe('#1c1815');
    expect(sequoiaTheme.accent).toBe('#f97316');
  });
});
