import { MUSIC_PLAYLIST, MusicTrackConfig } from '@/config/music';

export type Track = MusicTrackConfig;
export const mockPlaylist: Track[] = [...MUSIC_PLAYLIST];
