export interface WallpaperItem {
  id: string;
  name: string;
  type: 'image' | 'gradient' | 'svg';
  src?: string;
  thumbnail?: string;
  fallbackGradient: string;
  darkOverlay: string; // Tailwind class
  lightOverlay: string; // Tailwind class
  themePreference?: 'dark' | 'light' | 'both';
  accentColor?: string;
}

export type WallpaperConfig = WallpaperItem;

export const WALLPAPERS: WallpaperItem[] = [
  {
    id: 'sonoma-dark',
    name: 'macOS Sonoma (Dark)',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #0f172a 45%, #020617 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'dark',
    accentColor: '#3b82f6',
  },
  {
    id: 'sonoma-light',
    name: 'macOS Sonoma (Light)',
    type: 'gradient',
    fallbackGradient: 'linear-gradient(135deg, #a5b4fc 0%, #fbcfe8 50%, #fde047 100%)',
    darkOverlay: 'bg-black/20',
    lightOverlay: 'bg-white/10',
    themePreference: 'light',
    accentColor: '#6366f1',
  },
  {
    id: 'sequoia-dark',
    name: 'macOS Sequoia',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(circle at 50% 20%, #451a03 0%, #1c1917 50%, #09090b 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'dark',
    accentColor: '#f97316',
  },
  {
    id: 'ventura',
    name: 'macOS Ventura',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(circle at 70% 30%, #ea580c 0%, #2563eb 55%, #0f172a 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'both',
    accentColor: '#f97316',
  },
  {
    id: 'monterey',
    name: 'macOS Monterey',
    type: 'gradient',
    fallbackGradient: 'linear-gradient(135deg, #581c87 0%, #db2777 50%, #1e1b4b 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'both',
    accentColor: '#ec4899',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Horizon',
    type: 'gradient',
    fallbackGradient: 'linear-gradient(135deg, #090d16 0%, #701a75 50%, #0284c7 100%)',
    darkOverlay: 'bg-black/20',
    lightOverlay: 'bg-black/10',
    themePreference: 'dark',
    accentColor: '#06b6d4',
  },
  {
    id: 'minimal-noir',
    name: 'Minimalist Noir',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 60%, #000000 100%)',
    darkOverlay: 'bg-black/10',
    lightOverlay: 'bg-black/5',
    themePreference: 'dark',
    accentColor: '#a1a1aa',
  },
];

export const DEFAULT_WALLPAPER_ID = 'sonoma-dark';

export function getWallpaperById(id?: string): WallpaperItem {
  if (!id) return WALLPAPERS[0];
  const found = WALLPAPERS.find((w) => w.id === id);
  return found || WALLPAPERS[0];
}
