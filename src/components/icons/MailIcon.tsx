'use client';

import React from 'react';

export const MailIcon: React.FC<{ className?: string; size?: number }> = ({
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
    data-testid="icon-mail-svg"
  >
    <defs>
      <linearGradient id="mail-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="mail-border" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="mail-envelope" x1="0" y1="38" x2="0" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    <rect
      x="4"
      y="4"
      width="120"
      height="120"
      rx="28"
      fill="url(#mail-bg)"
      stroke="url(#mail-border)"
      strokeWidth="2"
    />
    {/* Envelope Body */}
    <rect
      x="20"
      y="38"
      width="88"
      height="54"
      rx="8"
      fill="url(#mail-envelope)"
      stroke="#cbd5e1"
      strokeWidth="1"
    />
    {/* Fold lines */}
    <path
      d="M22 40 L64 70 L106 40"
      stroke="#94a3b8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M22 90 L48 64" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
    <path d="M106 90 L80 64" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
    {/* Red Airmail Stamp */}
    <rect
      x="80"
      y="44"
      width="18"
      height="14"
      rx="2"
      fill="#ef4444"
      stroke="#ffffff"
      strokeWidth="1"
    />
    <circle cx="89" cy="51" r="3" fill="#ffffff" />
    <path
      d="M4 32 C4 16 16 4 32 4 L96 4 C112 4 124 16 124 32 L124 48 L4 68 Z"
      fill="white"
      fillOpacity="0.08"
    />
  </svg>
);
