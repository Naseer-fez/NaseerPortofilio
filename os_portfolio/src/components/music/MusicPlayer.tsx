import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { VinylTurntable } from './VinylTurntable';
import { AudioVisualizer } from './AudioVisualizer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
} from 'lucide-react';

const formatTime = (secs: number): string => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const MusicPlayer: React.FC = () => {
  const {
    isPlaying,
    currentTrack,
    currentTrackIndex,
    playlist,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isExpanded,
    turntableAngle,
    togglePlay,
    nextTrack,
    prevTrack,
    selectTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleExpanded,
  } = useAudio();

  const [showPlaylist, setShowPlaylist] = useState(false);

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    seek(target);
  };

  return (
    <>
      {/* Expanded Popover Modal */}
      {isExpanded && (
        <div
          className="fixed bottom-[100px] right-3 sm:right-6 w-[calc(100%-24px)] sm:w-[380px] h-[520px] max-h-[85vh] glassmorphic-modal rounded-lg shadow-player-modal z-[1000] flex flex-col overflow-hidden animate-popover-in border border-hairline-dark text-white select-none"
          role="region"
          aria-label="Expanded Music Player"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
            <button
              onClick={toggleExpanded}
              className="p-1.5 rounded-full hover:bg-white/10 btn-apple-active text-white/80 hover:text-white"
              aria-label="Minimize Player"
            >
              <ChevronDown size={20} />
            </button>
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold block">
                Now Playing
              </span>
              <span className="text-[12.5px] font-semibold text-white/90 truncate max-w-[180px] block">
                {currentTrack.album}
              </span>
            </div>
            <button
              onClick={() => setShowPlaylist(prev => !prev)}
              className={`p-1.5 rounded-full hover:bg-white/10 btn-apple-active ${
                showPlaylist ? 'text-primary-dark bg-white/15' : 'text-white/80'
              }`}
              aria-label="Toggle Playlist"
            >
              <ListMusic size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 flex flex-col items-center justify-between p-5 relative overflow-hidden">
            {showPlaylist ? (
              // Playlist View Drawer
              <div className="w-full h-full overflow-y-auto space-y-2 pr-1">
                <span className="text-[11.5px] font-semibold text-white/60 uppercase tracking-wider mb-2 block">
                  Track Queue ({playlist.length})
                </span>
                {playlist.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => selectTrack(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-md text-left transition-colors ${
                      idx === currentTrackIndex
                        ? 'bg-primary/25 border border-primary/50 text-white'
                        : 'hover:bg-white/5 text-white/70'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <img src={t.coverUrl} alt="" className="w-9 h-9 rounded-md object-cover shrink-0" />
                      <div className="truncate">
                        <p className="text-[13.5px] font-medium truncate">{t.title}</p>
                        <p className="text-[11.5px] text-white/50 truncate">{t.artist}</p>
                      </div>
                    </div>
                    <span className="text-[11.5px] text-white/40 tabular-nums ml-2 shrink-0">
                      {formatTime(t.duration)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              // Turntable & Hero View
              <>
                <div className="my-auto py-1">
                  <VinylTurntable
                    size={210}
                    artworkUrl={currentTrack.coverUrl}
                    isPlaying={isPlaying}
                    angle={turntableAngle}
                  />
                </div>

                {/* Track Metadata */}
                <div className="w-full text-center space-y-0.5 mb-2">
                  <h3 className="text-[17px] font-bold tracking-tight text-white truncate px-4">
                    {currentTrack.title}
                  </h3>
                  <p className="text-[13px] text-white/60 truncate font-normal">
                    {currentTrack.artist}
                  </p>
                </div>
              </>
            )}

            {/* Scrubber & Duration */}
            <div className="w-full space-y-1 mt-auto">
              <div className="relative flex items-center group">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleScrubberChange}
                  className="w-full h-1.5 bg-white/20 rounded-full audio-scrubber hover:h-2 transition-all"
                  style={{
                    background: `linear-gradient(to right, #0066cc ${progress * 100}%, rgba(255,255,255,0.2) ${progress * 100}%)`,
                  }}
                  aria-label="Seek track scrubber"
                />
              </div>
              <div className="flex justify-between text-[11px] text-white/50 tabular-nums px-0.5 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Transport Action Controls */}
            <div className="w-full flex items-center justify-between px-2 pt-3">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full hover:bg-white/10 btn-apple-active ${
                  isShuffle ? 'text-primary-dark' : 'text-white/50'
                }`}
                aria-label="Toggle Shuffle"
              >
                <Shuffle size={18} />
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={prevTrack}
                  className="p-2 rounded-full hover:bg-white/10 text-white/90 btn-apple-active"
                  aria-label="Previous Track"
                >
                  <SkipBack size={22} />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-[50px] h-[50px] rounded-full bg-primary hover:bg-primary-focus text-white flex items-center justify-center shadow-lg btn-apple-active"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-2 rounded-full hover:bg-white/10 text-white/90 btn-apple-active"
                  aria-label="Next Track"
                >
                  <SkipForward size={22} />
                </button>
              </div>

              <button
                onClick={cycleRepeat}
                className={`p-2 rounded-full hover:bg-white/10 btn-apple-active ${
                  repeatMode !== 'off' ? 'text-primary-dark' : 'text-white/50'
                }`}
                aria-label={`Repeat mode: ${repeatMode}`}
              >
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
            </div>

            {/* Volume & Equalizer Bar */}
            <div className="w-full flex items-center justify-between pt-3 border-t border-white/10 mt-3 px-2">
              <div className="flex items-center space-x-2.5 w-1/2">
                <button
                  onClick={toggleMute}
                  className="text-white/60 hover:text-white btn-apple-active"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-full audio-scrubber"
                  aria-label="Volume slider"
                />
              </div>

              {/* 4-Band FFT Audio Visualizer */}
              <div className="w-1/3 flex justify-end">
                <AudioVisualizer isPlaying={isPlaying} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Pill Capsule Widget */}
      <div
        className="fixed bottom-3 sm:bottom-4 right-3 sm:right-6 w-[calc(100%-24px)] sm:w-[340px] h-[68px] glassmorphic-capsule rounded-pill shadow-player-capsule z-[1000] flex items-center justify-between px-3.5 pr-4 select-none group border border-hairline-dark text-white"
        role="region"
        aria-label="Compact Music Player Widget"
      >
        {/* Micro Scrubber at bottom border */}
        <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-white/10 overflow-hidden rounded-full">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Left: Mini Vinyl Disc Button (Click to toggle expansion) */}
        <button
          onClick={toggleExpanded}
          className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-md group-hover:scale-105 transition-transform"
          aria-label="Expand Player View"
        >
          <VinylTurntable
            size={44}
            artworkUrl={currentTrack.coverUrl}
            isPlaying={isPlaying}
            angle={turntableAngle}
          />
        </button>

        {/* Center: Track Info & Mini Status */}
        <div
          onClick={toggleExpanded}
          className="flex-1 min-w-0 mx-3 cursor-pointer"
        >
          <div className="overflow-hidden whitespace-nowrap">
            <span className="text-[13px] font-semibold text-white/95 block truncate group-hover:text-primary-dark transition-colors">
              {currentTrack.title}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-white/50">
            <span className="truncate max-w-[90px]">{currentTrack.artist}</span>
            <span>•</span>
            <span className="tabular-nums font-mono">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Right: Compact Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={prevTrack}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white btn-apple-active hidden xs:inline-flex"
            aria-label="Previous Track"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-primary hover:bg-primary-focus text-white flex items-center justify-center shadow-md btn-apple-active"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white btn-apple-active"
            aria-label="Next Track"
          >
            <SkipForward size={16} />
          </button>

          <button
            onClick={toggleExpanded}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white btn-apple-active"
            aria-label="Expand Popover Modal"
          >
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
    </>
  );
};
