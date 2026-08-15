import React from 'react';

export const ProjectsIcon: React.FC<{ className?: string; size?: number }> = ({
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
    data-testid="icon-projects-svg"
  >
    <defs>
      <linearGradient id="proj-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
      <linearGradient id="proj-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="proj-gold" x1="30" y1="30" x2="98" y2="98" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <rect
      x="4"
      y="4"
      width="120"
      height="120"
      rx="28"
      fill="url(#proj-bg)"
      stroke="url(#proj-border)"
      strokeWidth="2"
    />
    {/* Blueprint grid lines */}
    <line
      x1="24"
      y1="36"
      x2="104"
      y2="36"
      stroke="#ffffff"
      strokeOpacity="0.12"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="24"
      y1="64"
      x2="104"
      y2="64"
      stroke="#ffffff"
      strokeOpacity="0.12"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="24"
      y1="92"
      x2="104"
      y2="92"
      stroke="#ffffff"
      strokeOpacity="0.12"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="36"
      y1="24"
      x2="36"
      y2="104"
      stroke="#ffffff"
      strokeOpacity="0.12"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="64"
      y1="24"
      x2="64"
      y2="104"
      stroke="#ffffff"
      strokeOpacity="0.12"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="92"
      y1="24"
      x2="92"
      y2="104"
      stroke="#ffffff"
      strokeOpacity="0.12"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    {/* Briefcase Structure */}
    <rect x="28" y="44" width="72" height="50" rx="10" fill="#ffffff" fillOpacity="0.92" />
    <path
      d="M48 44 V36 C48 31 52 27 57 27 H71 C76 27 80 31 80 36 V44"
      stroke="#ffffff"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Center clasp */}
    <rect
      x="54"
      y="58"
      width="20"
      height="18"
      rx="4"
      fill="url(#proj-gold)"
      stroke="#b45309"
      strokeWidth="1"
    />
    <path d="M60 67 L68 67" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
    {/* Specular gloss */}
    <path
      d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z"
      fill="white"
      fillOpacity="0.08"
    />
  </svg>
);
