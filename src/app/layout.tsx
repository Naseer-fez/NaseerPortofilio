import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GlobalKeyboardListener } from '@/components/os/GlobalKeyboardListener';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0c0a09',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Naseer Portfolio',
  description:
    'A macOS-inspired desktop operating system portfolio showcase built with Next.js, Tailwind CSS, Framer Motion, and Web Audio.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

const themeScript = `
(function() {
  try {
    var rawTheme = localStorage.getItem('os-theme');
    var stored = localStorage.getItem('macos-portfolio-os-state-v4') || localStorage.getItem('macos-portfolio-os-state');
    var isDark = true;
    if (rawTheme) {
      isDark = rawTheme === 'dark';
    } else if (stored) {
      var parsed = JSON.parse(stored);
      if (parsed.state && parsed.state.theme) {
        isDark = parsed.state.theme === 'dark';
      }
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased bg-os-bg-desktop text-os-window-text h-screen w-screen overflow-hidden select-none">
        <GlobalKeyboardListener />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
