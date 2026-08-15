import { describe, it, expect, beforeEach } from 'vitest';
import { useOSStore } from '@/hooks/useOSStore';
import { useMusicStore } from '@/hooks/useMusicStore';

describe('Tier 1: LocalStorage State Persistence & Theme Tokens', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists theme selection in localStorage and restores on mount (#87, #59)', () => {
    useOSStore.getState().setTheme('light');
    expect(window.localStorage.getItem('os-theme')).toBe('light');

    useOSStore.getState().setTheme('dark');
    expect(window.localStorage.getItem('os-theme')).toBe('dark');
  });

  it('persists selected wallpaperId and restores on mount (#88)', () => {
    useOSStore.getState().setWallpaper('ventura-dark');
    expect(window.localStorage.getItem('os-wallpaper')).toBe('ventura-dark');

    useOSStore.getState().setWallpaper('sonoma-light');
    expect(window.localStorage.getItem('os-wallpaper')).toBe('sonoma-light');
  });

  it('persists music currentTime position in localStorage (#89)', () => {
    useMusicStore.getState().seekTo(120);
    expect(window.localStorage.getItem('music-current-time')).toBe('120');
  });

  it('persists music volume level in localStorage (#90)', () => {
    useMusicStore.getState().setVolume(0.42);
    expect(window.localStorage.getItem('music-volume')).toBe('0.42');
  });
});
