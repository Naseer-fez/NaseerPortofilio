import React from 'react';
import { useMusicStore } from '@/hooks/useMusicStore';
import { Play, Pause } from 'lucide-react';

interface MusicPlayerDockPillProps {
  magnifiedWidth: number;
}

export function MusicPlayerDockPill({ magnifiedWidth }: MusicPlayerDockPillProps) {
  const playlist = useMusicStore(state => state.playlist);
  const currentIndex = useMusicStore(state => state.currentIndex);
  const status = useMusicStore(state => state.status);
  const togglePlay = useMusicStore(state => state.togglePlay);
  const toggleDeckExpanded = useMusicStore(state => state.toggleDeckExpanded);

  const currentTrack = playlist[currentIndex] || {
    title: 'No Track',
    artist: 'Select a track',
    coverArt: '',
  };

  const isPlaying = status === 'playing';
  const pillWidth = Math.max(120, Math.min(160, (magnifiedWidth / 44) * 120));

  return (
    <div
      data-testid="music-player-pill"
      onClick={toggleDeckExpanded}
      className="relative flex items-center px-2 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 shadow-lg cursor-pointer select-none origin-bottom transition-all duration-100"
      style={{
        width: `${pillWidth}px`,
        height: '44px',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Artwork */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold mr-2">
        🎵
      </div>

      {/* Info & EQ */}
      <div className="flex-1 min-w-0 mr-1 flex flex-col justify-center">
        <span className="text-[11px] font-medium text-white truncate leading-tight">
          {currentTrack.title}
        </span>
        <div className="flex items-center space-x-0.5 mt-0.5" style={{ gap: '2px' }}>
          <span
            data-testid="eq-bar-1"
            className={`w-0.5 bg-white/80 rounded-full transition-all duration-200 ${
              isPlaying ? 'h-3 animate-pulse' : 'h-1'
            }`}
            style={{ width: '2px' }}
          />
          <span
            data-testid="eq-bar-2"
            className={`w-0.5 bg-white/80 rounded-full transition-all duration-200 ${
              isPlaying ? 'h-4 animate-pulse' : 'h-1'
            }`}
            style={{ width: '2px' }}
          />
          <span
            data-testid="eq-bar-3"
            className={`w-0.5 bg-white/80 rounded-full transition-all duration-200 ${
              isPlaying ? 'h-2 animate-pulse' : 'h-1'
            }`}
            style={{ width: '2px' }}
          />
        </div>
      </div>

      {/* Play / Pause Button */}
      <button
        data-testid="music-play-pause-btn"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={e => {
          e.stopPropagation();
          togglePlay();
        }}
        className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
      >
        {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
      </button>
    </div>
  );
}
