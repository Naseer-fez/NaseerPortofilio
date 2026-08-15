export type PlaybackState = 'IDLE' | 'LOADING' | 'PLAYING' | 'PAUSED' | 'SEEKING' | 'ERROR';
export type RepeatMode = 'off' | 'all' | 'one';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl?: string;
  synthPreset?: 'synthwave' | 'chillhop' | 'ambient' | 'cyberpunk';
}

export interface AudioVisualizerData {
  subBass: number;   // 0.0 to 1.0
  lowMid: number;    // 0.0 to 1.0
  highMid: number;   // 0.0 to 1.0
  treble: number;    // 0.0 to 1.0
  rawBins?: Uint8Array;
}

export interface AudioContextValue {
  // Playback state
  playbackState: PlaybackState;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTrack: Track;
  currentTrackIndex: number;
  playlist: Track[];
  currentTime: number;
  duration: number;
  progress: number; // 0.0 to 1.0
  
  // Controls
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isExpanded: boolean;
  
  // Visualizer
  visualizerData: AudioVisualizerData;
  turntableAngle: number;
  
  // Actions
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => Promise<void>;
  seek: (seconds: number) => void;
  startSeeking: () => void;
  updateSeekPreview: (seconds: number) => void;
  endSeeking: (commitSeconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}
