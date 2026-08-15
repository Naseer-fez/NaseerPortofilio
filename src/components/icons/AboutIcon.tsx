import React from 'react';

export const AboutIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-full h-full',
  size,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon-about-svg"
  >
    <defs>
      <linearGradient id="about-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
      <linearGradient id="about-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
      </linearGradient>
      <radialGradient id="about-glow" cx="64" cy="50" r="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect
      x="4"
      y="4"
      width="120"
      height="120"
      rx="28"
      fill="url(#about-bg)"
      stroke="url(#about-border)"
      strokeWidth="2"
    />
    <circle cx="64" cy="50" r="45" fill="url(#about-glow)" />
    {/* Avatar profile */}
    <circle cx="64" cy="46" r="18" fill="#ffffff" />
    <path d="M34 92 C34 76 46 68 64 68 C82 68 94 76 94 92 Z" fill="#ffffff" />
    {/* Verified badge */}
    <circle cx="86" cy="38" r="8" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
    <path
      d="M83 38 L85 40 L89 36"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z"
      fill="white"
      fillOpacity="0.08"
    />
  </svg>
);
