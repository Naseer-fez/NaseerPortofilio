'use client';

import React from 'react';
import { useMusicStore } from '@/hooks/useMusicStore';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Play, Pause } from 'lucide-react';

export function MobileStickyAudioBar() {
  const playlist = useMusicStore(state => state.playlist);
  const currentIndex = useMusicStore(state => state.currentIndex);
  const status = useMusicStore(state => state.status);
  const togglePlay = useMusicStore(state => state.togglePlay);
  const toggleDeckExpanded = useMusicStore(state => state.toggleDeckExpanded);

  const track = playlist[currentIndex] || { title: '', artist: '' };
  const isPlaying = status === 'playing';

  return (
    <div
      data-testid="mobile-sticky-audio-bar"
      onClick={toggleDeckExpanded}
      className="md:hidden fixed inset-x-2 z-40 h-11 bg-stone-900/90 backdrop-blur-xl border border-white/10 rounded-xl px-3 flex items-center justify-between shadow-lg"
      style={{
        bottom: 'calc(52px + env(safe-area-inset-bottom, 0px) + 8px)',
        height: '44px',
      }}
    >
      <div className="flex items-center space-x-2.5 truncate">
        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
          🎵
        </div>
        <span className="text-xs font-medium text-white truncate">
          {track.title || 'No Track Playing'}
        </span>
      </div>

      <button
        data-testid="mobile-audio-bar-play-btn"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={e => {
          e.stopPropagation();
          togglePlay();
        }}
        className="p-1.5 rounded-full bg-white/10 text-white"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </button>
    </div>
  );
}
