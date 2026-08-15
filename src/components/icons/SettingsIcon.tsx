import React from 'react';

export const SettingsIcon: React.FC<{ className?: string; size?: number }> = ({
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
    data-testid="icon-settings-svg"
  >
    <defs>
      <linearGradient id="settings-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="50%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="settings-gear" x1="30" y1="30" x2="98" y2="98" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="50%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="settings-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect
      x="4"
      y="4"
      width="120"
      height="120"
      rx="28"
      fill="url(#settings-bg)"
      stroke="url(#settings-border)"
      strokeWidth="2"
    />
    {/* Machined Gear Assembly */}
    <g transform="translate(64, 64)">
      <path
        d="M-8,-38 L8,-38 L10,-28 Q18,-25 24,-18 L34,-22 L42,-8 L34,-2 Q35,6 34,14 L42,20 L34,34 L24,30 Q18,37 10,40 L8,50 L-8,50 L-10,40 Q-18,37 -24,30 L-34,34 L-42,20 L-34,14 Q-35,6 -34,-2 L-42,-8 L-34,-22 L-24,-18 Q-18,-25 -10,-28 Z"
        fill="url(#settings-gear)"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <circle cx="0" cy="0" r="14" fill="#334155" stroke="#1e293b" strokeWidth="2" />
      <circle cx="0" cy="0" r="6" fill="#f8fafc" />
    </g>
    <path
      d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z"
      fill="white"
      fillOpacity="0.08"
    />
  </svg>
);
