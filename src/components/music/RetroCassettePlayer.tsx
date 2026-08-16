'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMusicStore } from '@/hooks/useMusicStore';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { CassetteReel } from './CassetteReel';
import { InteractiveScrubber } from './InteractiveScrubber';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  GripHorizontal,
} from 'lucide-react';
import { getCassetteTheme } from '@/config/wallpapers';

export function RetroCassettePlayer() {
  const { isMobile } = useBreakpoint();
  const playlist = useMusicStore((state) => state.playlist);
  const currentIndex = useMusicStore((state) => state.currentIndex);
  const status = useMusicStore((state) => state.status);
  const togglePlay = useMusicStore((state) => state.togglePlay);
  const pause = useMusicStore((state) => state.pause);
  const seekTo = useMusicStore((state) => state.seekTo);
  const nextTrack = useMusicStore((state) => state.nextTrack);
  const previousTrack = useMusicStore((state) => state.previousTrack);
  const volume = useMusicStore((state) => state.volume);
  const setVolume = useMusicStore((state) => state.setVolume);
  const isMuted = useMusicStore((state) => state.isMuted);
  const toggleMute = useMusicStore((state) => state.toggleMute);
  const isShuffled = useMusicStore((state) => state.isShuffled);
  const toggleShuffle = useMusicStore((state) => state.toggleShuffle);
  const repeatMode = useMusicStore((state) => state.repeatMode);
  const cycleRepeat = useMusicStore((state) => state.cycleRepeat);
  const currentTime = useMusicStore((state) => state.currentTime);
  const duration = useMusicStore((state) => state.duration);

  const wallpaperId = useOSStore((state) => state.wallpaperId);
  const cassettePosition = useOSStore((state) => state.cassettePosition);
  const updateCassettePosition = useOSStore((state) => state.updateCassettePosition);
  const theme = getCassetteTheme(wallpaperId);

  const track = playlist[currentIndex] || {
    title: 'Midnight in Cupertino',
    artist: 'Synthesizer Society',
    album: '',
    duration: 184,
    src: '/audio/midnight-cupertino.mp3',
    coverArt: '',
  };

  if (isMobile) return null;

  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';
  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  const handleButtonClick = (action: () => void) => {
    try {
      GlobalAudioManager.getInstance().playFx('click');
    } catch {
      // Safe fallback
    }
    action();
  };

  const handleStop = () => {
    handleButtonClick(() => {
      pause();
      seekTo(0);
    });
  };

  return (
    <motion.div
      data-testid="retro-cassette-player"
      drag
      dragMomentum={false}
      dragElastic={0.08}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      whileDrag={{
        scale: 1.02,
        cursor: 'grabbing',
        boxShadow: '0 32px 64px -12px rgba(0,0,0,0.85)',
      }}
      onDragStart={() => {
        try {
          GlobalAudioManager.getInstance().playFx('window-grab');
        } catch {
          // Safe fallback
        }
      }}
      onDragEnd={(_e, info) => {
        try {
          GlobalAudioManager.getInstance().playFx('window-drop');
        } catch {
          // Safe fallback
        }
        if (updateCassettePosition && (info.offset.x !== 0 || info.offset.y !== 0)) {
          const current = cassettePosition || { x: 0, y: 0 };
          updateCassettePosition({
            x: current.x + info.offset.x,
            y: current.y + info.offset.y,
          });
        }
      }}
      className="hidden md:block fixed bottom-28 right-8 z-[9992] select-none cursor-grab active:cursor-grabbing"
      style={{
        width: '370px',
        x: cassettePosition?.x || 0,
        y: cassettePosition?.y || 0,
      }}
    >
      {/* 3D Cassette Deck Body with Wallpaper-Harmonized Metallic Casing */}
      <div
        data-testid="cassette-body"
        className="rounded-[16px] p-2.5 border-2 text-white shadow-2xl relative overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: theme.bodyBg,
          borderColor: theme.bodyBorder,
          boxShadow:
            '0 28px 56px -12px rgba(0,0,0,0.85), inset 0 2px 2px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.8)',
        }}
      >
        {/* Top Mechanical Piano Push Buttons Bar */}
        <div className="rounded-t-lg bg-black/40 p-1 mb-2 border border-black/60 shadow-inner">
          <div className="grid grid-cols-5 gap-[2px] bg-stone-900/80 rounded p-[2px]">
            {/* 1. Stop Button (■) */}
            <button
              type="button"
              data-testid="music-stop-btn"
              aria-label="Stop Playback"
              onClick={handleStop}
              className={`h-11 flex flex-col items-center justify-center rounded-[3px] bg-[#f5efe6] text-stone-900 hover:bg-[#eae3d7] active:bg-[#ded5c8] transition-all border-t border-white/80 border-b border-stone-400 ${
                !isPlaying && currentTime === 0
                  ? 'shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)] translate-y-[2px] bg-[#dfd7ca]'
                  : 'shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
              }`}
            >
              <Square size={13} className="fill-stone-900 text-stone-900" />
            </button>

            {/* 2. Rewind / Prev Track (◀◀) */}
            <button
              type="button"
              data-testid="music-prev-btn"
              aria-label="Previous Track"
              onClick={() => handleButtonClick(previousTrack)}
              className="h-11 flex flex-col items-center justify-center rounded-[3px] bg-[#f5efe6] text-stone-900 hover:bg-[#eae3d7] active:bg-[#ded5c8] active:translate-y-[2px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-all border-t border-white/80 border-b border-stone-400"
            >
              <SkipBack size={15} className="fill-stone-900 text-stone-900" />
            </button>

            {/* 3. Play Button (▶) */}
            <button
              type="button"
              data-testid="music-play-btn"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={() => handleButtonClick(togglePlay)}
              className={`h-11 flex flex-col items-center justify-center rounded-[3px] bg-[#f5efe6] text-stone-900 hover:bg-[#eae3d7] active:bg-[#ded5c8] transition-all border-t border-white/80 border-b border-stone-400 ${
                isPlaying
                  ? 'shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] translate-y-[2px] bg-[#dfd7ca]'
                  : 'shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
              }`}
            >
              <Play size={15} className="fill-stone-900 text-stone-900 ml-0.5" />
            </button>

            {/* 4. Fast Forward / Next Track (▶▶) */}
            <button
              type="button"
              data-testid="music-next-btn"
              aria-label="Next Track"
              onClick={() => handleButtonClick(nextTrack)}
              className="h-11 flex flex-col items-center justify-center rounded-[3px] bg-[#f5efe6] text-stone-900 hover:bg-[#eae3d7] active:bg-[#ded5c8] active:translate-y-[2px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-all border-t border-white/80 border-b border-stone-400"
            >
              <SkipForward size={15} className="fill-stone-900 text-stone-900" />
            </button>

            {/* 5. Pause Button (❚❚) */}
            <button
              type="button"
              data-testid="music-pause-btn"
              aria-label="Pause"
              onClick={() => handleButtonClick(togglePlay)}
              className={`h-11 flex flex-col items-center justify-center rounded-[3px] bg-[#f5efe6] text-stone-900 hover:bg-[#eae3d7] active:bg-[#ded5c8] transition-all border-t border-white/80 border-b border-stone-400 ${
                isPaused && currentTime > 0
                  ? 'shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] translate-y-[2px] bg-[#dfd7ca]'
                  : 'shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
              }`}
            >
              <Pause size={15} className="fill-stone-900 text-stone-900" />
            </button>
          </div>
        </div>

        {/* Sunken Main Faceplate with Beveled Perimeter */}
        <div
          className="rounded-xl p-3 border border-black/50 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.15) 100%)',
            boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.6)',
          }}
        >
          {/* Centered Acrylic Glass Cassette Window */}
          <div
            data-testid="cassette-window"
            className="relative w-full h-[100px] rounded-xl bg-stone-950 border border-white/20 overflow-hidden flex items-center justify-between px-5 my-1 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)]"
          >
            {/* Realistic Diagonal Specular Glass Reflection */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background:
                  'linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 42%, rgba(255,255,255,0.08) 100%)',
              }}
            />

            {/* Left Feed Spool */}
            <CassetteReel
              isPlaying={isPlaying}
              progress={progress}
              isLeft={true}
              spoolColor={theme.spoolColor}
              tapeColor={theme.tapeColor}
            />

            {/* Center Retro Pixel / Monospace LCD Text Overlay */}
            <div className="flex flex-col items-center justify-center text-center z-10 select-none px-2 max-w-[150px]">
              <div className="flex items-center space-x-1 text-white font-mono text-[11px] font-bold tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,1)] truncate max-w-full">
                <span data-testid="music-track-title" className="truncate">
                  {track.title}
                </span>
                <span className="opacity-60">—</span>
                <span data-testid="music-track-artist" className="truncate opacity-85 text-[10px]">
                  {track.artist}
                </span>
              </div>
              <div className="text-[9px] font-mono text-white/70 tracking-widest mt-1 drop-shadow">
                Track {currentIndex + 1} of {playlist.length}
              </div>
            </div>

            {/* Right Take-up Spool */}
            <CassetteReel
              isPlaying={isPlaying}
              progress={progress}
              isLeft={false}
              spoolColor={theme.spoolColor}
              tapeColor={theme.tapeColor}
            />

            {/* Magnetic Tape Ribbon */}
            <div
              data-testid="cassette-tape-ribbon"
              className="absolute bottom-1.5 left-14 right-14 h-[3px] rounded-sm pointer-events-none"
              style={{ backgroundColor: theme.tapeColor }}
            />
          </div>

          {/* Vintage Label Badge (SIDE A / Type I) */}
          <div
            data-testid="cassette-label"
            className="flex items-center justify-between px-2 pt-2 text-[9px] font-mono opacity-80"
          >
            <div className="flex items-center space-x-2">
              <span
                className="font-black px-1.5 py-0.5 rounded text-white tracking-wider"
                style={{ backgroundColor: theme.accent }}
              >
                SIDE A
              </span>
              <span className="text-white/60">STEREO AUTO-REVERSE</span>
            </div>

            {/* LED Glow Indicator */}
            <div className="flex items-center space-x-1.5">
              <span
                data-testid="cassette-led"
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  backgroundColor: theme.ledGlow,
                  boxShadow: isPlaying ? `0 0 8px ${theme.ledGlow}` : 'none',
                }}
              />
              <span className="text-[8px] uppercase text-white/60">
                {isPlaying ? 'PLAY' : 'STOP'}
              </span>
            </div>
          </div>

          {/* Scrubber Timeline */}
          <div className="my-2 px-1">
            <InteractiveScrubber />
          </div>

          {/* Bottom Branding & Audio Utility Controls */}
          <div className="flex items-center justify-between pt-2 px-1 border-t border-white/10">
            {/* Bottom Left: SONY Brand Logo */}
            <div className="font-serif font-black text-xl tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              SONY
            </div>

            {/* Middle Controls (Shuffle, Repeat, Volume) */}
            <div className="flex items-center space-x-2">
              {/* Shuffle */}
              <button
                type="button"
                data-testid="music-shuffle-btn"
                aria-label="Toggle Shuffle"
                onClick={() => handleButtonClick(toggleShuffle)}
                className={`p-1 rounded transition-colors ${
                  isShuffled ? 'text-white bg-white/20' : 'text-white/40 hover:text-white'
                }`}
              >
                <Shuffle size={12} />
              </button>

              {/* Repeat */}
              <button
                type="button"
                data-testid="music-repeat-btn"
                aria-label="Cycle Repeat Mode"
                onClick={() => handleButtonClick(cycleRepeat)}
                className={`p-1 rounded transition-colors ${
                  repeatMode !== 'off' ? 'text-white bg-white/20' : 'text-white/40 hover:text-white'
                }`}
              >
                {repeatMode === 'one' ? <Repeat1 size={12} /> : <Repeat size={12} />}
              </button>

              {/* Volume & Mute */}
              <div className="flex items-center space-x-1 pl-1 border-l border-white/10">
                <button
                  type="button"
                  data-testid="music-mute-btn"
                  aria-label="Toggle Mute"
                  onClick={() => handleButtonClick(toggleMute)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>

                <input
                  data-testid="music-volume-slider"
                  aria-label="Volume Control"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-14 h-1 accent-white cursor-pointer bg-white/20 rounded-full"
                />
              </div>
            </div>

            {/* Bottom Right: IRFAN.DEV / Portfolio Branding */}
            <div className="font-mono font-bold text-xs tracking-wider text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              IRFAN.DEV
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
