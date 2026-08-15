export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  src: string;
  coverArt: string;
}

export const mockPlaylist: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight in Cupertino',
    artist: 'Synthesizer Society',
    album: 'Silicon Dreams',
    duration: 184,
    src: '/audio/midnight-cupertino.mp3',
    coverArt: '/images/covers/silicon-dreams.jpg',
  },
  {
    id: 'track-2',
    title: 'Aqua Motion',
    artist: 'Liquid Glass',
    album: 'Aqua Motion',
    duration: 210,
    src: '/audio/aqua-motion.mp3',
    coverArt: '/images/covers/aqua-motion.jpg',
  },
  {
    id: 'track-3',
    title: 'Kinetic Reverie',
    artist: 'Euler & The Waves',
    album: 'Physics of Sound',
    duration: 165,
    src: '/audio/kinetic-reverie.mp3',
    coverArt: '/images/covers/physics-sound.jpg',
  },
  {
    id: 'track-4',
    title: 'Parabolic Horizon',
    artist: 'Luca Cosine',
    album: 'Smooth Curves',
    duration: 198,
    src: '/audio/parabolic-horizon.mp3',
    coverArt: '/images/covers/smooth-curves.jpg',
  },
];
