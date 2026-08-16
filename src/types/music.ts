export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  src: string;
  coverArt: string;
}

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'loading' | 'error';
export type RepeatMode = 'off' | 'all' | 'one';

export interface MusicState {
  playlist: Track[];
  currentIndex: number;
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  isDeckExpanded: boolean;
  isMobileAudioBarVisible: boolean;

  // Actions
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (level: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleDeckExpanded: () => void;
  setDeckExpanded: (expanded: boolean) => void;
  setMobileAudioBarVisible: (visible: boolean) => void;
  setPlaylist: (tracks: Track[]) => void;
  setCurrentIndex: (index: number) => void;
}
