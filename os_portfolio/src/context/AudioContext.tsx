import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Track, PlaybackState, RepeatMode, AudioVisualizerData, AudioContextValue } from '../types/audio';
import { TRACK_CATALOG, ProceduralAudioEngine } from '../utils/audioTracks';

const AudioContext = createContext<AudioContextValue | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Playback state - STRICT AUTOPLAY PROHIBITION: initial state is IDLE / not playing
  const [playbackState, setPlaybackState] = useState<PlaybackState>('IDLE');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(TRACK_CATALOG[0].duration);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isExpanded, setIsExpanded] = useState(false);
  const [turntableAngle, setTurntableAngle] = useState(0);
  const [visualizerData, setVisualizerData] = useState<AudioVisualizerData>({
    subBass: 0,
    lowMid: 0,
    highMid: 0,
    treble: 0,
  });

  // Audio References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const synthEngineRef = useRef<ProceduralAudioEngine>(new ProceduralAudioEngine());

  // Turntable and Visualizer RAF Loop Refs
  const rafVisualizerRef = useRef<number | null>(null);
  const turntableAngleRef = useRef(0);
  const turntableVelocityRef = useRef(0);
  const isSeekingRef = useRef(false);
  const previousVolumeRef = useRef(0.8);

  const currentTrack = TRACK_CATALOG[currentTrackIndex];

  // Initialize Web Audio graph strictly on user interaction
  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * volume, ctx.currentTime);

      gainNode.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      gainNodeRef.current = gainNode;

      synthEngineRef.current.init(ctx, analyser, gainNode);
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, [volume]);

  // Turntable & Visualizer animation loop
  useEffect(() => {
    let lastTimestamp = performance.now();
    const dataArray = new Uint8Array(32);

    const tick = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      // Turntable rotation physics
      if (isPlaying) {
        turntableVelocityRef.current += (0.09 - turntableVelocityRef.current) * 0.08;
      } else {
        turntableVelocityRef.current *= 0.94; // Deceleration inertia
      }

      if (turntableVelocityRef.current > 0.0005 || isPlaying) {
        turntableAngleRef.current = (turntableAngleRef.current + turntableVelocityRef.current * 360 * delta) % 360;
        setTurntableAngle(turntableAngleRef.current);
      }

      // Visualizer FFT extraction
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const sub = (dataArray[0] + dataArray[1]) / (2 * 255);
        const low = (dataArray[3] + dataArray[4] + dataArray[5]) / (3 * 255);
        const mid = (dataArray[7] + dataArray[8] + dataArray[9] + dataArray[10]) / (4 * 255);
        const high = (dataArray[15] + dataArray[16] + dataArray[17]) / (3 * 255);

        setVisualizerData({
          subBass: Math.min(1, sub * 1.3),
          lowMid: Math.min(1, low * 1.3),
          highMid: Math.min(1, mid * 1.3),
          treble: Math.min(1, high * 1.3),
        });
      } else if (!isPlaying) {
        setVisualizerData(prev => ({
          subBass: prev.subBass * 0.9,
          lowMid: prev.lowMid * 0.9,
          highMid: prev.highMid * 0.9,
          treble: prev.treble * 0.9,
        }));
      }

      rafVisualizerRef.current = requestAnimationFrame(tick);
    };

    rafVisualizerRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafVisualizerRef.current) cancelAnimationFrame(rafVisualizerRef.current);
    };
  }, [isPlaying]);

  // Synthetic time ticker when using procedural synth
  useEffect(() => {
    let timer: number;
    if (isPlaying && !isSeekingRef.current) {
      timer = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            // Track finished
            if (repeatMode === 'one') {
              return 0;
            } else if (repeatMode === 'all' || currentTrackIndex < TRACK_CATALOG.length - 1) {
              setCurrentTrackIndex(idx => (idx + 1) % TRACK_CATALOG.length);
              return 0;
            } else {
              setIsPlaying(false);
              setPlaybackState('IDLE');
              synthEngineRef.current.stop();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration, repeatMode, currentTrackIndex]);

  // Actions
  const play = useCallback(async () => {
    ensureAudioContext();
    setPlaybackState('PLAYING');
    setIsPlaying(true);
    synthEngineRef.current.start();
  }, [ensureAudioContext]);

  const pause = useCallback(() => {
    setPlaybackState('PAUSED');
    setIsPlaying(false);
    synthEngineRef.current.stop();
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  const selectTrack = useCallback(async (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setDuration(TRACK_CATALOG[index].duration);
    await play();
  }, [play]);

  const nextTrack = useCallback(() => {
    const nextIdx = (currentTrackIndex + 1) % TRACK_CATALOG.length;
    selectTrack(nextIdx);
  }, [currentTrackIndex, selectTrack]);

  const prevTrack = useCallback(() => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      const prevIdx = (currentTrackIndex - 1 + TRACK_CATALOG.length) % TRACK_CATALOG.length;
      selectTrack(prevIdx);
    }
  }, [currentTime, currentTrackIndex, selectTrack]);

  const seek = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clamped);
  }, [duration]);

  const startSeeking = useCallback(() => {
    isSeekingRef.current = true;
    setPlaybackState('SEEKING');
  }, []);

  const updateSeekPreview = useCallback((seconds: number) => {
    setCurrentTime(seconds);
  }, []);

  const endSeeking = useCallback((commitSeconds: number) => {
    isSeekingRef.current = false;
    seek(commitSeconds);
    setPlaybackState(isPlaying ? 'PLAYING' : 'PAUSED');
  }, [isPlaying, seek]);

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(clamped * clamped, audioCtxRef.current.currentTime);
    }
    if (clamped > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(previousVolumeRef.current || 0.8);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume, setVolume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <AudioContext.Provider
      value={{
        playbackState,
        isPlaying,
        isBuffering,
        currentTrack,
        currentTrackIndex,
        playlist: TRACK_CATALOG,
        currentTime,
        duration,
        progress,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        isExpanded,
        visualizerData,
        turntableAngle,
        play,
        pause,
        togglePlay,
        nextTrack,
        prevTrack,
        selectTrack,
        seek,
        startSeeking,
        updateSeekPreview,
        endSeeking,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        toggleExpanded,
        setExpanded: setIsExpanded,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
