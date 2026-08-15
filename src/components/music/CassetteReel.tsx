import React from 'react';

export interface CassetteReelProps {
  isPlaying: boolean;
  progress: number; // 0 to 1
  isLeft: boolean;
  spoolColor?: string;
  tapeColor?: string;
}

export function CassetteReel({
  isPlaying,
  progress,
  isLeft,
  spoolColor = '#f8fafc',
  tapeColor = '#221812',
}: CassetteReelProps) {
  // Constant area conservation formula
  const rMin = 13;
  const rMax = 29;
  const tapeWeight = isLeft ? 1 - progress : progress;
  const clampedWeight = Math.max(0, Math.min(1, tapeWeight));
  const currentRadius = Math.sqrt(rMin * rMin + (rMax * rMax - rMin * rMin) * clampedWeight);

  return (
    <div
      data-testid={isLeft ? 'cassette-reel-left' : 'cassette-reel-right'}
      className="relative flex items-center justify-center select-none pointer-events-none"
      style={{ width: '64px', height: '64px' }}
    >
      {/* Tape Cake Wound on Spool with concentric vinyl grooves */}
      <div
        data-testid={isLeft ? 'cassette-tape-left' : 'cassette-tape-right'}
        className="rounded-full absolute transition-all duration-300 pointer-events-none overflow-hidden"
        style={{
          width: `${(currentRadius * 2).toFixed(1)}px`,
          height: `${(currentRadius * 2).toFixed(1)}px`,
          backgroundColor: tapeColor,
          backgroundImage:
            'radial-gradient(circle, transparent 28%, rgba(255,255,255,0.1) 29%, transparent 30%, transparent 44%, rgba(255,255,255,0.1) 45%, transparent 46%, transparent 59%, rgba(255,255,255,0.1) 60%, transparent 61%, transparent 74%, rgba(255,255,255,0.1) 75%, transparent 76%, transparent 89%, rgba(255,255,255,0.1) 90%, transparent 91%)',
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)',
        }}
      />

      {/* 6-Toothed Star Drive Spool Hub */}
      <div
        data-testid={isLeft ? 'cassette-spool-left' : 'cassette-spool-right'}
        className="w-[28px] h-[28px] rounded-full relative z-10 flex items-center justify-center pointer-events-none"
        style={{
          backgroundColor: spoolColor,
          animation: 'spin-spool-ccw 2.4s linear infinite',
          animationPlayState: isPlaying ? 'running' : 'paused',
          boxShadow: '0 0 2px rgba(0,0,0,0.4), inset 0 0 2px rgba(0,0,0,0.3)',
        }}
      >
        {/* 6 Radial Teeth / Splines */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute w-[3px] h-[6px] bg-stone-700/60 rounded-sm"
            style={{
              transform: `rotate(${deg}deg) translateY(-8px)`,
            }}
          />
        ))}

        {/* 3 Cutout Spoke Windows */}
        {[0, 120, 240].map((deg) => (
          <div
            key={`spoke-${deg}`}
            className="absolute w-[4px] h-[4px] rounded-full bg-stone-900/40"
            style={{
              transform: `rotate(${deg}deg) translateY(-5px)`,
            }}
          />
        ))}

        {/* Center Capstan Hole */}
        <div className="w-[10px] h-[10px] rounded-full bg-stone-950 border border-stone-800 absolute inset-0 m-auto" />
      </div>
    </div>
  );
}
