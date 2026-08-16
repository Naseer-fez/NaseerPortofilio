export interface WallpaperPalette {
  primary: string; // Main theme accent (e.g. #3b82f6)
  secondary: string; // Secondary harmonic tone (e.g. #1e1b4b)
  accent: string; // High-contrast button/spoke accent (e.g. #60a5fa)
  surface: string; // Cassette chassis / card surface (e.g. rgba(15, 23, 42, 0.90))
  border: string; // Highlight / glass rim border (e.g. rgba(59, 130, 246, 0.35))
  labelBg: string; // Cassette label background (e.g. #0f172a)
  labelText: string; // Cassette label text (e.g. #93c5fd)
  shadow?: string;
}

export interface CassetteTheme {
  bodyBg: string;
  bodyBorder: string;
  accent: string;
  labelBg: string;
  labelBorder: string;
  labelText: string;
  spoolColor: string;
  tapeColor: string;
  ledGlow: string;
}

export interface WallpaperItem {
  id: string;
  name: string;
  type: 'image' | 'gradient' | 'svg';
  src?: string;
  thumbnail?: string;
  fallbackGradient: string;
  darkOverlay: string; // Tailwind CSS class
  lightOverlay: string; // Tailwind CSS class
  themePreference?: 'dark' | 'light' | 'both';
  accentColor: string;
  palette: WallpaperPalette;
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
    palette: {
      primary: '#3b82f6',
      secondary: '#1e1b4b',
      accent: '#60a5fa',
      surface: 'rgba(15, 23, 42, 0.92)',
      border: 'rgba(59, 130, 246, 0.35)',
      labelBg: '#f1f5f9',
      labelText: '#0f172a',
      shadow: '0 25px 50px -12px rgba(15, 23, 42, 0.75)',
    },
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
    palette: {
      primary: '#6366f1',
      secondary: '#f472b6',
      accent: '#8b5cf6',
      surface: 'rgba(255, 255, 255, 0.92)',
      border: 'rgba(99, 102, 241, 0.3)',
      labelBg: '#fdfbf7',
      labelText: '#18181b',
      shadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
    },
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
    palette: {
      primary: '#f97316',
      secondary: '#451a03',
      accent: '#f97316',
      surface: 'rgba(28, 25, 23, 0.92)',
      border: 'rgba(249, 115, 22, 0.35)',
      labelBg: '#fef3c7',
      labelText: '#451a03',
      shadow: '0 25px 50px -12px rgba(69, 26, 3, 0.75)',
    },
  },
  {
    id: 'ventura',
    name: 'macOS Ventura',
    type: 'gradient',
    fallbackGradient: 'radial-gradient(circle at 70% 30%, #ea580c 0%, #2563eb 55%, #0f172a 100%)',
    darkOverlay: 'bg-black/25',
    lightOverlay: 'bg-black/10',
    themePreference: 'both',
    accentColor: '#ea580c',
    palette: {
      primary: '#ea580c',
      secondary: '#2563eb',
      accent: '#ea580c',
      surface: 'rgba(15, 23, 42, 0.92)',
      border: 'rgba(234, 88, 12, 0.35)',
      labelBg: '#f8fafc',
      labelText: '#0f172a',
      shadow: '0 25px 50px -12px rgba(234, 88, 12, 0.4)',
    },
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
    palette: {
      primary: '#ec4899',
      secondary: '#581c87',
      accent: '#ec4899',
      surface: 'rgba(30, 27, 75, 0.92)',
      border: 'rgba(236, 72, 153, 0.35)',
      labelBg: '#faf5ff',
      labelText: '#3b0764',
      shadow: '0 25px 50px -12px rgba(236, 72, 153, 0.4)',
    },
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
    palette: {
      primary: '#06b6d4',
      secondary: '#701a75',
      accent: '#06b6d4',
      surface: 'rgba(9, 13, 22, 0.94)',
      border: 'rgba(6, 182, 212, 0.4)',
      labelBg: '#0f172a',
      labelText: '#38bdf8',
      shadow: '0 25px 50px -12px rgba(6, 182, 212, 0.4)',
    },
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
    palette: {
      primary: '#a1a1aa',
      secondary: '#18181b',
      accent: '#a1a1aa',
      surface: 'rgba(24, 24, 27, 0.94)',
      border: 'rgba(161, 161, 170, 0.25)',
      labelBg: '#f4f4f5',
      labelText: '#18181b',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
    },
  },
  {
    id: 'custom',
    name: 'Custom Wallpaper',
    type: 'image',
    fallbackGradient: 'radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 60%, #000000 100%)',
    darkOverlay: 'bg-black/30',
    lightOverlay: 'bg-black/20',
    themePreference: 'dark',
    accentColor: '#60a5fa',
    palette: {
      primary: '#60a5fa',
      secondary: '#1e1b4b',
      accent: '#60a5fa',
      surface: 'rgba(15, 23, 42, 0.90)',
      border: 'rgba(59, 130, 246, 0.35)',
      labelBg: '#f1f5f9',
      labelText: '#0f172a',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
    },
  },
];

export const DEFAULT_WALLPAPER_ID = 'sonoma-dark';

export function getWallpaperById(id?: string): WallpaperItem {
  if (!id) return WALLPAPERS[0];
  const found = WALLPAPERS.find(w => w.id === id);
  return found || WALLPAPERS[0];
}

export function getWallpaperPalette(id?: string): WallpaperPalette {
  return getWallpaperById(id).palette;
}

export const CASSETTE_THEMES: Record<string, CassetteTheme> = {
  'sonoma-dark': {
    bodyBg: '#111420',
    bodyBorder: '#3b82f6',
    accent: '#3b82f6',
    labelBg: '#f1f5f9',
    labelBorder: '#cbd5e1',
    labelText: '#0f172a',
    spoolColor: '#f8fafc',
    tapeColor: '#221812',
    ledGlow: '#38bdf8',
  },
  'sonoma-light': {
    bodyBg: '#2b2638',
    bodyBorder: '#8b5cf6',
    accent: '#8b5cf6',
    labelBg: '#fdfbf7',
    labelBorder: '#e2e8f0',
    labelText: '#18181b',
    spoolColor: '#ffffff',
    tapeColor: '#221812',
    ledGlow: '#ec4899',
  },
  'sequoia-dark': {
    bodyBg: '#1c1815',
    bodyBorder: '#f97316',
    accent: '#f97316',
    labelBg: '#fef3c7',
    labelBorder: '#fde68a',
    labelText: '#451a03',
    spoolColor: '#fffbeb',
    tapeColor: '#221812',
    ledGlow: '#fbbf24',
  },
  'ventura': {
    bodyBg: '#161a29',
    bodyBorder: '#ea580c',
    accent: '#ea580c',
    labelBg: '#f8fafc',
    labelBorder: '#e2e8f0',
    labelText: '#0f172a',
    spoolColor: '#f8fafc',
    tapeColor: '#221812',
    ledGlow: '#f97316',
  },
  'monterey': {
    bodyBg: '#1f132b',
    bodyBorder: '#ec4899',
    accent: '#ec4899',
    labelBg: '#faf5ff',
    labelBorder: '#f3e8ff',
    labelText: '#3b0764',
    spoolColor: '#fdf4ff',
    tapeColor: '#221812',
    ledGlow: '#f472b6',
  },
  'cyberpunk-neon': {
    bodyBg: '#0b0f19',
    bodyBorder: '#06b6d4',
    accent: '#06b6d4',
    labelBg: '#0f172a',
    labelBorder: '#1e293b',
    labelText: '#38bdf8',
    spoolColor: '#e2e8f0',
    tapeColor: '#221812',
    ledGlow: '#10b981',
  },
  'minimal-noir': {
    bodyBg: '#121214',
    bodyBorder: '#a1a1aa',
    accent: '#a1a1aa',
    labelBg: '#f4f4f5',
    labelBorder: '#e4e4e7',
    labelText: '#18181b',
    spoolColor: '#fafafa',
    tapeColor: '#221812',
    ledGlow: '#ffffff',
  },
  'custom': {
    bodyBg: '#111420',
    bodyBorder: '#3b82f6',
    accent: '#3b82f6',
    labelBg: '#f1f5f9',
    labelBorder: '#cbd5e1',
    labelText: '#0f172a',
    spoolColor: '#f8fafc',
    tapeColor: '#221812',
    ledGlow: '#38bdf8',
  },
};

export function getCassetteTheme(id?: string): CassetteTheme {
  if (id && CASSETTE_THEMES[id]) {
    return CASSETTE_THEMES[id];
  }
  return CASSETTE_THEMES[DEFAULT_WALLPAPER_ID];
}
