/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand & Accent Colors
        primary: {
          DEFAULT: '#0066cc',    // Action Blue (primary interactive color)
          focus: '#0071e3',      // Focus Blue (keyboard focus rings)
          dark: '#2997ff',       // Sky Link Blue (in-copy links on dark surfaces)
        },
        // Surfaces & Canvases
        canvas: {
          DEFAULT: '#ffffff',    // Pure White canvas
          parchment: '#f5f5f7',  // Apple signature off-white parchment
        },
        surface: {
          pearl: '#fafafc',      // Near-white for secondary ghost buttons
          tile1: '#272729',      // Near-Black Tile 1 (primary dark tile)
          tile2: '#2a2a2c',      // Near-Black Tile 2 (micro-step lighter)
          tile3: '#252527',      // Near-Black Tile 3 (micro-step darker / player frame)
          black: '#000000',      // Pure Black void
          chip: 'rgba(210, 210, 215, 0.64)', // Translucent Chip Gray
          obsidian: '#0a0a0c',   // Deep Obsidian Hero Canvas
        },
        // Text Colors
        ink: {
          DEFAULT: '#1d1d1f',    // Near-Black Ink for headlines/body
          muted80: '#333333',    // Ink Muted 80 (Pearl button text)
          muted48: '#7a7a7a',    // Ink Muted 48 (Disabled / fine-print)
        },
        body: {
          DEFAULT: '#1d1d1f',    // Default body text
          dark: '#ffffff',       // Body On Dark (white)
          muted: '#cccccc',      // Secondary copy on dark tiles
        },
        // Borders & Dividers
        hairline: {
          DEFAULT: '#e0e0e0',    // 1px hairline border
          dark: 'rgba(255, 255, 255, 0.12)', // Hairline on dark glass
        },
        divider: {
          soft: '#f0f0f0',       // Soft divider ring
        },
        // Semantic Accents
        status: {
          online: '#30d158',     // Emerald green online status beacon
          warning: '#ff9f0a',    // Amber warning
          error: '#ff453a',      // macOS red traffic light
          minimize: '#ffbd2e',   // macOS yellow traffic light
          maximize: '#27c93f',   // macOS green traffic light
        }
      },
      fontFamily: {
        sans: [
          'SF Pro Text',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Menlo',
          'Monaco',
          'Courier New',
          'monospace',
        ],
      },
      fontSize: {
        'hero-display': ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }],
        'display-lg': ['40px', { lineHeight: '1.10', letterSpacing: '0px', fontWeight: '600' }],
        'display-md': ['34px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '600' }],
        'lead': ['28px', { lineHeight: '1.14', letterSpacing: '0.196px', fontWeight: '400' }],
        'lead-airy': ['24px', { lineHeight: '1.50', letterSpacing: '0px', fontWeight: '300' }],
        'tagline': ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
        'body-strong': ['17px', { lineHeight: '1.24', letterSpacing: '-0.374px', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '400' }],
        'dense-link': ['17px', { lineHeight: '2.41', letterSpacing: '0px', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.43', letterSpacing: '-0.224px', fontWeight: '400' }],
        'caption-strong': ['14px', { lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '600' }],
        'button-large': ['18px', { lineHeight: '1.0', letterSpacing: '0px', fontWeight: '300' }],
        'button-utility': ['14px', { lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '400' }],
        'fine-print': ['12px', { lineHeight: '1.0', letterSpacing: '-0.12px', fontWeight: '400' }],
        'micro-legal': ['10px', { lineHeight: '1.3', letterSpacing: '-0.08px', fontWeight: '400' }],
        'nav-link': ['12px', { lineHeight: '1.0', letterSpacing: '-0.12px', fontWeight: '400' }],
      },
      borderRadius: {
        'none': '0px',
        'xs': '5px',
        'sm': '8px',
        'md': '11px',
        'lg': '18px',
        'pill': '9999px',
        'full': '9999px',
      },
      spacing: {
        'xxs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '17px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
        'section': '80px',
      },
      boxShadow: {
        'product': 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px', // The single Apple signature drop shadow
        'dock': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        'window': '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'player-capsule': '0 12px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        'player-modal': '0 24px 64px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.15)',
      },
      keyframes: {
        'vinyl-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'eq-bar-1': {
          '0%, 100%': { transform: 'scaleY(0.25)' },
          '50%': { transform: 'scaleY(0.95)' },
        },
        'eq-bar-2': {
          '0%, 100%': { transform: 'scaleY(0.85)' },
          '50%': { transform: 'scaleY(0.30)' },
        },
        'eq-bar-3': {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1.0)' },
        },
        'eq-bar-4': {
          '0%, 100%': { transform: 'scaleY(0.90)' },
          '50%': { transform: 'scaleY(0.40)' },
        },
        'beacon-pulse': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(48, 209, 88, 0.6)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(48, 209, 88, 0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(48, 209, 88, 0)' },
        },
        'popover-enter': {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(12px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'vinyl-spin': 'vinyl-spin 4s linear infinite',
        'eq-1': 'eq-bar-1 0.80s ease-in-out infinite',
        'eq-2': 'eq-bar-2 0.65s ease-in-out infinite 0.15s',
        'eq-3': 'eq-bar-3 0.90s ease-in-out infinite 0.30s',
        'eq-4': 'eq-bar-4 0.75s ease-in-out infinite 0.10s',
        'beacon': 'beacon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'popover-in': 'popover-enter 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
