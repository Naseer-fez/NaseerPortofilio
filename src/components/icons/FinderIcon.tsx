import React from 'react';

export const FinderIcon: React.FC<{ className?: string; size?: number }> = ({
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
    data-testid="icon-finder-svg"
  >
    <defs>
      <linearGradient id="finder-left" x1="0" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="finder-right" x1="64" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="finder-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>
      <clipPath id="finder-clip">
        <rect x="4" y="4" width="120" height="120" rx="28" />
      </clipPath>
    </defs>
    <g clipPath="url(#finder-clip)">
      <rect x="4" y="4" width="60" height="120" fill="url(#finder-left)" />
      <rect x="64" y="4" width="60" height="120" fill="url(#finder-right)" />
      {/* Center partition line */}
      <path
        d="M64 4 Q61 36 67 64 Q73 92 64 124"
        stroke="#0f172a"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eyes */}
      <ellipse cx="44" cy="50" rx="4.5" ry="6" fill="#0f172a" />
      <ellipse cx="84" cy="50" rx="4.5" ry="6" fill="#0f172a" />
      <circle cx="43" cy="48" r="1.5" fill="#ffffff" />
      <circle cx="83" cy="48" r="1.5" fill="#ffffff" />
      {/* Smile */}
      <path
        d="M38 78 Q64 104 90 78"
        stroke="#0f172a"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Gloss */}
      <path
        d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z"
        fill="white"
        fillOpacity="0.12"
      />
    </g>
    <rect
      x="4"
      y="4"
      width="120"
      height="120"
      rx="28"
      stroke="url(#finder-border)"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);
