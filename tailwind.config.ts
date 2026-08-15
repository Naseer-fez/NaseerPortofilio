import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        os: {
          bg: {
            desktop: 'var(--os-bg-desktop)',
          },
          menubar: {
            bg: 'var(--os-menubar-bg)',
            border: 'var(--os-menubar-border)',
            text: 'var(--os-menubar-text)',
            hover: 'var(--os-menubar-hover)',
          },
          window: {
            header: {
              bg: 'var(--os-window-header-bg)',
              border: 'var(--os-window-header-border)',
            },
            body: {
              bg: 'var(--os-window-body-bg)',
            },
            text: {
              DEFAULT: 'var(--os-window-text)',
              muted: 'var(--os-window-text-muted)',
            },
            border: 'var(--os-window-border)',
          },
          dock: {
            bg: 'var(--os-dock-bg)',
            border: 'var(--os-dock-border)',
          },
          accent: {
            blue: 'var(--os-accent-blue)',
            'blue-dark': '#2997ff',
            'blue-light': '#0071e3',
          },
          traffic: {
            red: '#FF5F56',
            'red-border': '#E0443E',
            yellow: '#FFBD2E',
            'yellow-border': '#DEA123',
            green: '#27C93F',
            'green-border': '#1AAB29',
          },
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      borderRadius: {
        'os-window': '12px',
        'os-dock': '9999px',
        'os-tooltip': '6px',
        'os-card': '20px',
        'os-pill': '12px',
        'os-menu-item': '4px',
      },
      boxShadow: {
        'os-menubar': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'os-window-inactive': 'var(--os-shadow-window-inactive)',
        'os-window-active': 'var(--os-shadow-window-active)',
        'os-dock': '0 12px 36px -4px rgba(0,0,0,0.55), 0 4px 16px -2px rgba(0,0,0,0.35)',
        'os-deck': '0 24px 48px -12px rgba(0,0,0,0.70)',
        'os-specular-dock': 'inset 0 1px 1px 0 rgba(255,255,255,0.22)',
        'os-specular-deck': 'inset 0 1px 1px 0 rgba(255,255,255,0.20)',
      },
      dropShadow: {
        'os-icon': '0 4px 6px rgba(0, 0, 0, 0.35)',
        'os-label': '0 1px 2px rgba(0, 0, 0, 0.85)',
      },
      backdropBlur: {
        'os-menubar': '40px',
        'os-window': '28px',
        'os-dock': '20px',
        'os-deck': '32px',
        'os-tooltip': '12px',
        'os-spotlight': '24px',
      },
      zIndex: {
        '0': '0',       // Layer 0: Wallpaper + KineticHeroStage
        '10': '10',     // Layer 1: DesktopCanvas + DesktopGrid + SelectionMarquee
        '20': '20',     // Layer 2: Inactive Window Base
        '45': '45',     // Layer 2: Active Window Focused
        '50': '50',     // Layer 3: TopMenuBar
        '9990': '9990', // Layer 4: Luca Dock + MusicPlayerDockPill
        '9992': '9992', // Layer 5: AudioDeckExpandedCard
        '9995': '9995', // Layer 6: SpotlightSearch + ContextMenu + ControlCenter
        '9999': '9999', // Layer 7: KineticCursor
      },
    },
  },
  plugins: [],
};

export default config;
