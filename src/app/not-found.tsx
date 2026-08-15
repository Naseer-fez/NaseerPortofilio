import React from 'react';
import Link from 'next/link';
import { Home, Compass, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      data-testid="not-found-container"
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-stone-950 text-os-window-text select-none"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, rgba(41, 151, 255, 0.15), transparent 70%), radial-gradient(ellipse at 80% 80%, rgba(147, 51, 234, 0.1), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(236, 72, 153, 0.08), transparent 60%)',
      }}
    >
      {/* Subtle Desktop Wallpaper Backdrop Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* macOS Centered Alert Dialog Card */}
      <div
        data-testid="not-found-card"
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-white/15 dark:border-white/10 bg-white/80 dark:bg-stone-900/85 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* macOS Window Header with Traffic Lights */}
        <div
          data-testid="not-found-window-header"
          className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5"
        >
          <div className="flex items-center space-x-2">
            <span
              data-testid="traffic-light-close"
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-sm"
              aria-hidden="true"
            />
            <span
              data-testid="traffic-light-minimize"
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-sm"
              aria-hidden="true"
            />
            <span
              data-testid="traffic-light-maximize"
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-sm"
              aria-hidden="true"
            />
          </div>
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 select-none">
            Finder — System Alert
          </span>
          <div className="w-12" aria-hidden="true" />
        </div>

        {/* Window Content Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Icon Badge */}
          <div
            data-testid="not-found-icon-badge"
            className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-5 shadow-inner"
          >
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          {/* 404 Pill Badge */}
          <div
            data-testid="not-found-error-code"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>ERROR 404</span>
          </div>

          {/* Friendly Message */}
          <h1
            data-testid="not-found-title"
            className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-2"
          >
            Location Not Found
          </h1>
          <p
            data-testid="not-found-message"
            className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mb-6"
          >
            The requested application or path could not be located in this macOS workspace. It may have been moved, closed, or does not exist.
          </p>

          {/* Return to Desktop Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <Link
              data-testid="return-to-desktop-btn"
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-600 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <Home className="w-4 h-4" />
              <span>Return to Desktop</span>
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-6 flex items-center gap-1">
            <span>macOS Portfolio OS</span>
            <span>•</span>
            <span>Finder 14.2</span>
          </p>
        </div>
      </div>
    </div>
  );
}
