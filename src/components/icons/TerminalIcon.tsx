import React from 'react';

export const TerminalIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon-terminal-svg"
  >
    <defs>
      <linearGradient id="term-bg" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2c2d35" />
        <stop offset="100%" stopColor="#121318" />
      </linearGradient>
      <linearGradient id="term-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="term-header" x1="0" y1="0" x2="128" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3a3c48" />
        <stop offset="100%" stopColor="#262832" />
      </linearGradient>
    </defs>
    {/* Base squircle */}
    <rect
      x="4"
      y="4"
      width="120"
      height="120"
      rx="28"
      fill="url(#term-bg)"
      stroke="url(#term-border)"
      strokeWidth="2"
    />
    {/* Inner CLI display */}
    <rect
      x="14"
      y="14"
      width="100"
      height="100"
      rx="18"
      fill="#0c0d12"
      stroke="#ffffff"
      strokeOpacity="0.08"
      strokeWidth="1"
    />
    {/* Title bar */}
    <path
      d="M14 32 C14 20 20 14 32 14 L96 14 C108 14 114 20 114 32 L114 36 L14 36 Z"
      fill="url(#term-header)"
    />
    {/* Traffic dots */}
    <circle cx="26" cy="25" r="3.5" fill="#ff5f56" />
    <circle cx="37" cy="25" r="3.5" fill="#ffbd2e" />
    <circle cx="48" cy="25" r="3.5" fill="#27c93f" />
    {/* Chevron prompt > */}
    <path
      d="M30 52 L46 66 L30 80"
      stroke="#4ade80"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cursor block _ */}
    <rect x="56" y="74" width="22" height="6" rx="2" fill="#38bdf8" />
    {/* Top glass reflection */}
    <path
      d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 50 L4 70 Z"
      fill="white"
      fillOpacity="0.04"
    />
  </svg>
);
