export interface Wallpaper {
  id: string;
  name: string;
  thumbnail: string;
  src: string;
  category: 'dynamic' | 'light' | 'dark' | 'abstract';
}

export const mockWallpapers: Wallpaper[] = [
  {
    id: 'sonoma-dark',
    name: 'macOS Sonoma Dark',
    thumbnail: '/wallpapers/thumbs/sonoma-dark.jpg',
    src: '/wallpapers/sonoma-dark.webp',
    category: 'dark',
  },
  {
    id: 'sonoma-light',
    name: 'macOS Sonoma Light',
    thumbnail: '/wallpapers/thumbs/sonoma-light.jpg',
    src: '/wallpapers/sonoma-light.webp',
    category: 'light',
  },
  {
    id: 'ventura-dark',
    name: 'macOS Ventura Graphic',
    thumbnail: '/wallpapers/thumbs/ventura-dark.jpg',
    src: '/wallpapers/ventura-dark.webp',
    category: 'dark',
  },
  {
    id: 'sequoia-abstract',
    name: 'macOS Sequoia Abstract',
    thumbnail: '/wallpapers/thumbs/sequoia.jpg',
    src: '/wallpapers/sequoia.webp',
    category: 'abstract',
  },
];
