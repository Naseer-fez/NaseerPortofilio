import { create } from 'zustand';
import { MusicState, Track, RepeatMode } from '@/types/music';
import { mockPlaylist } from '../../tests/fixtures/playlist.fixture';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';

function getStoredVolume(): number {
  if (typeof window !== 'undefined' && window.localStorage) {
    const val = window.localStorage.getItem('music-volume');
    if (val !== null) {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) return Math.max(0, Math.min(1, parsed));
    }
  }
  return 0.8;
}

function getStoredCurrentTime(): number {
  if (typeof window !== 'undefined' && window.localStorage) {
    const val = window.localStorage.getItem('music-current-time');
    if (val !== null) {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) return Math.max(0, parsed);
    }
  }
  return 0;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  playlist: [...mockPlaylist],
  currentIndex: 0,
  status: 'idle',
  currentTime: getStoredCurrentTime(),
  duration: mockPlaylist[0]?.duration || 180,
  volume: getStoredVolume(),
  isMuted: false,
  isShuffled: false,
  repeatMode: 'off',
  isDeckExpanded: false,

  play: async () => {
    const state = get();
    if (state.playlist.length === 0) return;

    const audioManager = GlobalAudioManager.getInstance();
    await audioManager.init();

    const track = state.playlist[state.currentIndex];
    if (audioManager.audioElement && track) {
      if (!audioManager.audioElement.src || !audioManager.audioElement.src.includes(track.src)) {
        audioManager.audioElement.src = track.src;
      }
      try {
        await audioManager.audioElement.play();
      } catch {
        // Autoplay policy fallback
      }
    }

    set({ status: 'playing' });
  },

  pause: () => {
    const audioManager = GlobalAudioManager.getInstance();
    if (audioManager.audioElement) {
      audioManager.audioElement.pause();
    }
    set({ status: 'paused' });
  },

  togglePlay: async () => {
    const state = get();
    if (state.status === 'playing') {
      state.pause();
    } else {
      await state.play();
    }
  },

  nextTrack: () => {
    const state = get();
    if (state.playlist.length === 0) return;

    let nextIdx = state.currentIndex + 1;
    if (nextIdx >= state.playlist.length) {
      nextIdx = 0;
    }

    const nextTrack = state.playlist[nextIdx];
    set({
      currentIndex: nextIdx,
      currentTime: 0,
      duration: nextTrack ? nextTrack.duration : 180,
    });

    const audioManager = GlobalAudioManager.getInstance();
    if (audioManager.audioElement && nextTrack) {
      audioManager.audioElement.src = nextTrack.src;
      audioManager.audioElement.currentTime = 0;
      if (state.status === 'playing') {
        audioManager.audioElement.play();
      }
    }
  },

  previousTrack: () => {
    const state = get();
    if (state.playlist.length === 0) return;

    const audioManager = GlobalAudioManager.getInstance();

    if (state.currentTime >= 3) {
      set({ currentTime: 0 });
      if (audioManager.audioElement) {
        audioManager.audioElement.currentTime = 0;
      }
      return;
    }

    let prevIdx = state.currentIndex - 1;
    if (prevIdx < 0) {
      prevIdx = state.playlist.length - 1;
    }

    const prevTrack = state.playlist[prevIdx];
    set({
      currentIndex: prevIdx,
      currentTime: 0,
      duration: prevTrack ? prevTrack.duration : 180,
    });

    if (audioManager.audioElement && prevTrack) {
      audioManager.audioElement.src = prevTrack.src;
      audioManager.audioElement.currentTime = 0;
      if (state.status === 'playing') {
        audioManager.audioElement.play();
      }
    }
  },

  seekTo: (seconds: number) => {
    const state = get();
    const clamped = Math.max(0, Math.min(state.duration, seconds));
    set({ currentTime: clamped });

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('music-current-time', clamped.toString());
    }

    const audioManager = GlobalAudioManager.getInstance();
    if (audioManager.audioElement) {
      audioManager.audioElement.currentTime = clamped;
    }
  },

  setVolume: (level: number) => {
    const clamped = Math.max(0, Math.min(1, level));
    set({ volume: clamped, isMuted: clamped === 0 });

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('music-volume', clamped.toString());
    }

    const audioManager = GlobalAudioManager.getInstance();
    audioManager.setMusicVolume(clamped);
  },

  toggleMute: () => {
    const state = get();
    const nextMuted = !state.isMuted;
    set({ isMuted: nextMuted });

    const audioManager = GlobalAudioManager.getInstance();
    audioManager.setMusicVolume(nextMuted ? 0 : state.volume);
  },

  toggleShuffle: () => {
    set(state => ({ isShuffled: !state.isShuffled }));
  },

  cycleRepeat: () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const current = get().repeatMode;
    const nextIdx = (modes.indexOf(current) + 1) % modes.length;
    set({ repeatMode: modes[nextIdx] });
  },

  toggleDeckExpanded: () => {
    set(state => ({ isDeckExpanded: !state.isDeckExpanded }));
  },

  setDeckExpanded: (expanded: boolean) => {
    set({ isDeckExpanded: expanded });
  },

  setPlaylist: (tracks: Track[]) => {
    set({ playlist: tracks, currentIndex: 0, currentTime: 0 });
  },

  setCurrentIndex: (index: number) => {
    const state = get();
    if (index >= 0 && index < state.playlist.length) {
      const track = state.playlist[index];
      set({ currentIndex: index, currentTime: 0, duration: track.duration });
    }
  },
}));
