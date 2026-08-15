import React from 'react';

interface VinylTurntableProps {
  size?: number;
  artworkUrl: string;
  isPlaying: boolean;
  angle: number;
}

export const VinylTurntable: React.FC<VinylTurntableProps> = ({
  size = 220,
  artworkUrl,
  angle,
}) => {
  const isMini = size <= 60;
  const labelSize = Math.round(size * 0.44);
  const spindleSize = Math.round(size * 0.14);

  return (
    <div
      className="relative rounded-full select-none shrink-0 shadow-product flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'radial-gradient(circle at center, #2a2a2e 0%, #151518 60%, #0a0a0c 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      {/* Spinning Disc Group */}
      <div
        className="w-full h-full rounded-full relative flex items-center justify-center"
        style={{
          transform: `rotate(${angle.toFixed(2)}deg)`,
          willChange: 'transform',
        }}
      >
        {/* Concentric Vinyl Grooves (for large display) */}
        {!isMini && (
          <div className="absolute inset-0 rounded-full pointer-events-none opacity-40">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
              <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.2" />
              <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
              <circle cx="100" cy="100" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* Center Album Art Label */}
        <div
          className="rounded-full overflow-hidden relative shadow-inner border border-white/20 flex items-center justify-center"
          style={{
            width: `${labelSize}px`,
            height: `${labelSize}px`,
          }}
        >
          <img
            src={artworkUrl}
            alt="Album Cover"
            className="w-full h-full object-cover select-none pointer-events-none"
            loading="lazy"
          />

          {/* Center Spindle Cutout */}
          <div
            className="absolute rounded-full bg-[#0a0a0c] border border-white/30 shadow-md flex items-center justify-center"
            style={{
              width: `${spindleSize}px`,
              height: `${spindleSize}px`,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
