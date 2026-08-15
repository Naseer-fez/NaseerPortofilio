import React from 'react';
import { useMusicStore } from '@/hooks/useMusicStore';

export function VinylDiscAssembly() {
  const playlist = useMusicStore(state => state.playlist);
  const currentIndex = useMusicStore(state => state.currentIndex);
  const status = useMusicStore(state => state.status);

  const track = playlist[currentIndex] || { title: '', artist: '', coverArt: '' };
  const isPlaying = status === 'playing';

  return (
    <div className="relative flex items-center justify-center my-6">
      {/* Vinyl Disc */}
      <div
        data-testid="vinyl-disc"
        className={`w-[200px] h-[200px] rounded-full bg-stone-950 border-4 border-stone-800 shadow-2xl flex items-center justify-center relative overflow-hidden ${
          isPlaying ? 'animate-spin' : ''
        }`}
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '9999px',
          animationDuration: '3s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: isPlaying ? 'running' : 'paused',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 0 10px rgba(255,255,255,0.1)',
        }}
      >
        {/* Grooves */}
        <div className="absolute inset-4 rounded-full border border-stone-800/80 pointer-events-none" />
        <div className="absolute inset-8 rounded-full border border-stone-800/60 pointer-events-none" />
        <div className="absolute inset-12 rounded-full border border-stone-800/40 pointer-events-none" />

        {/* Center Album Art Label */}
        <div
          data-testid="vinyl-center-art"
          className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-inner relative z-10 border-2 border-stone-900"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '9999px',
          }}
        >
          <span className="text-white text-xs font-bold select-none">
            {track.title.charAt(0) || '🎵'}
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800 absolute inset-0 m-auto" />
        </div>
      </div>
    </div>
  );
}
