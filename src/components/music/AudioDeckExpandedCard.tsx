import React from 'react';
import { useMusicStore } from '@/hooks/useMusicStore';
import { VinylDiscAssembly } from './VinylDiscAssembly';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';
import { InteractiveScrubber } from './InteractiveScrubber';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ChevronDown,
} from 'lucide-react';

export function AudioDeckExpandedCard() {
  const isDeckExpanded = useMusicStore(state => state.isDeckExpanded);
  const toggleDeckExpanded = useMusicStore(state => state.toggleDeckExpanded);
  const playlist = useMusicStore(state => state.playlist);
  const currentIndex = useMusicStore(state => state.currentIndex);
  const status = useMusicStore(state => state.status);
  const togglePlay = useMusicStore(state => state.togglePlay);
  const nextTrack = useMusicStore(state => state.nextTrack);
  const previousTrack = useMusicStore(state => state.previousTrack);
  const volume = useMusicStore(state => state.volume);
  const setVolume = useMusicStore(state => state.setVolume);
  const isMuted = useMusicStore(state => state.isMuted);
  const toggleMute = useMusicStore(state => state.toggleMute);
  const isShuffled = useMusicStore(state => state.isShuffled);
  const toggleShuffle = useMusicStore(state => state.toggleShuffle);
  const repeatMode = useMusicStore(state => state.repeatMode);
  const cycleRepeat = useMusicStore(state => state.cycleRepeat);

  if (!isDeckExpanded) return null;

  const track = playlist[currentIndex] || {
    title: 'Unknown Track',
    artist: 'Unknown Artist',
    album: '',
    coverArt: '',
  };

  const isPlaying = status === 'playing';

  return (
    <div
      data-testid="audio-deck-expanded"
      className="fixed bottom-20 right-6 z-[9992] w-[340px] rounded-[20px] backdrop-blur-2xl bg-stone-900/90 text-white border border-white/20 shadow-2xl p-5 select-none transition-all duration-200 animate-in fade-in slide-in-from-bottom-5"
      style={{
        width: '340px',
        borderRadius: '20px',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        boxShadow: '0 24px 48px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.15)',
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
          Now Playing
        </span>
        <button
          data-testid="audio-deck-collapse-btn"
          aria-label="Collapse Audio Deck"
          onClick={toggleDeckExpanded}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Rotating Vinyl Assembly */}
      <VinylDiscAssembly />

      {/* Track Metadata */}
      <div className="text-center my-3">
        <h3 data-testid="music-track-title" className="text-base font-bold truncate">
          {track.title}
        </h3>
        <p data-testid="music-track-artist" className="text-xs text-white/60 truncate mt-0.5">
          {track.artist}
        </p>
      </div>

      {/* Visualizer Canvas */}
      <div className="my-3">
        <AudioVisualizerCanvas />
      </div>

      {/* Scrubber */}
      <div className="my-3">
        <InteractiveScrubber />
      </div>

      {/* Main Transport Controls */}
      <div className="flex items-center justify-between px-2 my-4">
        {/* Shuffle */}
        <button
          data-testid="music-shuffle-btn"
          aria-label="Toggle Shuffle"
          onClick={toggleShuffle}
          className={`p-2 rounded-full transition-colors ${
            isShuffled ? 'text-blue-400 bg-blue-500/20' : 'text-white/60 hover:text-white'
          }`}
        >
          <Shuffle size={16} />
        </button>

        {/* Previous */}
        <button
          data-testid="music-prev-btn"
          aria-label="Previous Track"
          onClick={previousTrack}
          className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
        >
          <SkipBack size={20} />
        </button>

        {/* Play / Pause */}
        <button
          data-testid="music-play-btn"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ width: '44px', height: '44px', borderRadius: '9999px' }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        {/* Next */}
        <button
          data-testid="music-next-btn"
          aria-label="Next Track"
          onClick={nextTrack}
          className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
        >
          <SkipForward size={20} />
        </button>

        {/* Repeat */}
        <button
          data-testid="music-repeat-btn"
          aria-label="Cycle Repeat Mode"
          onClick={cycleRepeat}
          className={`p-2 rounded-full transition-colors ${
            repeatMode !== 'off' ? 'text-blue-400 bg-blue-500/20' : 'text-white/60 hover:text-white'
          }`}
        >
          {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
        </button>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center space-x-2 px-2 pt-2 border-t border-white/10">
        <button
          data-testid="music-mute-btn"
          aria-label="Toggle Mute"
          onClick={toggleMute}
          className="text-white/70 hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <input
          data-testid="music-volume-slider"
          aria-label="Volume Control"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-[3px] accent-blue-500 cursor-pointer bg-white/20 rounded-full"
          style={{ height: '3px' }}
        />
      </div>
    </div>
  );
}
