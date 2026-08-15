export interface MusicTrackConfig {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  src: string; // MP3 audio asset path
  coverArt: string; // Album artwork image path
  cassetteSide?: 'A' | 'B';
  trackNumber?: number;
}

export type Track = MusicTrackConfig;

export const MUSIC_PLAYLIST: MusicTrackConfig[] = [
  {
    id: 'track-1',
    title: 'Midnight in Cupertino',
    artist: 'Synthesizer Society',
    album: 'Silicon Dreams',
    duration: 184,
    src: '/audio/midnight-cupertino.mp3',
    coverArt: '/images/covers/silicon-dreams.jpg',
    cassetteSide: 'A',
    trackNumber: 1,
  },
  {
    id: 'track-2',
    title: 'Aqua Motion',
    artist: 'Liquid Glass',
    album: 'Aqua Motion',
    duration: 210,
    src: '/audio/aqua-motion.mp3',
    coverArt: '/images/covers/aqua-motion.jpg',
    cassetteSide: 'A',
    trackNumber: 2,
  },
  {
    id: 'track-3',
    title: 'Kinetic Reverie',
    artist: 'Euler & The Waves',
    album: 'Physics of Sound',
    duration: 165,
    src: '/audio/kinetic-reverie.mp3',
    coverArt: '/images/covers/physics-sound.jpg',
    cassetteSide: 'A',
    trackNumber: 3,
  },
  {
    id: 'track-4',
    title: 'Parabolic Horizon',
    artist: 'Luca Cosine',
    album: 'Smooth Curves',
    duration: 198,
    src: '/audio/parabolic-horizon.mp3',
    coverArt: '/images/covers/smooth-curves.jpg',
    cassetteSide: 'B',
    trackNumber: 4,
  },
  {
    id: 'track-5',
    title: 'Tape Deck Memories',
    artist: '80s Walkman Boy',
    album: 'Cassette Nostalgia',
    duration: 225,
    src: '/audio/tape-deck-memories.mp3',
    coverArt: '/images/covers/cassette-nostalgia.jpg',
    cassetteSide: 'B',
    trackNumber: 5,
  },
];

export const DEFAULT_TRACK_INDEX = 0;
