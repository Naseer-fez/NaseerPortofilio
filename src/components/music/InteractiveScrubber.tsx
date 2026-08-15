import React, { useRef, useState } from 'react';
import { useMusicStore } from '@/hooks/useMusicStore';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export function InteractiveScrubber() {
  const currentTime = useMusicStore(state => state.currentTime);
  const duration = useMusicStore(state => state.duration);
  const seekTo = useMusicStore(state => state.seekTo);

  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(percentage * duration);

    const onMove = (ev: PointerEvent) => {
      const moveX = ev.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, moveX / rect.width));
      seekTo(pct * duration);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="w-full space-y-1 select-none">
      <div
        ref={trackRef}
        data-testid="interactive-scrubber-track"
        onPointerDown={handlePointerDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-1 hover:h-1.5 bg-white/20 rounded-full cursor-pointer transition-all duration-150 group"
        style={{ height: isHovered ? '6px' : '4px' }}
      >
        <div
          data-testid="scrubber-progress-fill"
          className="absolute top-0 left-0 bottom-0 bg-white rounded-full pointer-events-none"
          style={{ width: `${progress}%` }}
        />
        <div
          data-testid="scrubber-handle"
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md pointer-events-none transition-transform group-hover:scale-110"
          style={{
            left: `${progress}%`,
            width: '12px',
            height: '12px',
            borderRadius: '9999px',
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-white/60 font-mono">
        <span data-testid="scrubber-current-time">{formatTime(currentTime)}</span>
        <span data-testid="scrubber-duration">{formatTime(duration)}</span>
      </div>
    </div>
  );
}
