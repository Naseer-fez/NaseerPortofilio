import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { useWindowManager } from '../../context/WindowContext';

export const MetadataAnchors: React.FC = () => {
  const { openWindow } = useWindowManager();
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 1. TOP-LEFT: Identity & Title Anchor */}
      <div className="absolute top-12 left-6 md:left-10 z-20 select-none pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-white tracking-tight">Jane Doe</span>
          <span className="text-white/40">•</span>
          <span className="text-[12.5px] text-body-muted font-normal">Design Engineer & Systems Architect</span>
        </div>
        <p className="text-[11.5px] text-white/50 font-mono mt-0.5">
          Specializing in High-Performance Web OS Interfaces & DSP Audio
        </p>
      </div>

      {/* 2. TOP-RIGHT: Status Availability Beacon */}
      <div className="absolute top-12 right-6 md:right-10 z-20 select-none pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-emerald-500/10 border border-emerald-500/25 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[12px] font-medium text-emerald-400 tracking-tight">
            Available for Select Projects
          </span>
        </div>
      </div>

      {/* 3. BOTTOM-LEFT: Geospatial Coordinates & Tabular Time */}
      <div className="absolute bottom-24 left-6 md:left-10 z-20 select-none pointer-events-auto text-[11.5px] font-mono text-white/50 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-white/70">GEO:</span>
          <span>37.7749° N, 122.4194° W</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white/70">LOCAL:</span>
          <span className="tabular-nums text-white/80">{localTime || '14:44:00'} PST</span>
        </div>
      </div>

      {/* 4. BOTTOM-RIGHT: Explore CTA Anchor */}
      <div className="absolute bottom-24 right-6 md:right-10 z-20 select-none pointer-events-auto hidden md:block">
        <button
          onClick={() => openWindow('projects')}
          className="group flex items-center gap-2 px-4 py-2 rounded-pill bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-white/80 hover:text-white transition-all active:scale-95 shadow-sm backdrop-blur-md"
          aria-label="Explore Projects"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-dark group-hover:rotate-12 transition-transform" />
          <span className="text-[12.5px] font-medium">Explore Projects</span>
          <ArrowDown className="w-3.5 h-3.5 text-primary-dark group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </>
  );
};
