import { describe, it, expect } from 'vitest';
import { MUSIC_PLAYLIST, DEFAULT_TRACK_INDEX } from '@/config/music';

describe('Music Playlist Configuration', () => {
  it('contains at least 5 curated music tracks with full metadata', () => {
    expect(MUSIC_PLAYLIST.length).toBeGreaterThanOrEqual(5);
    expect(DEFAULT_TRACK_INDEX).toBe(0);
  });

  it('ensures each track has valid title, artist, duration, src, and coverArt', () => {
    MUSIC_PLAYLIST.forEach((track) => {
      expect(track.id).toBeDefined();
      expect(track.title).toBeTruthy();
      expect(track.artist).toBeTruthy();
      expect(track.duration).toBeGreaterThan(0);
      expect(track.src).toMatch(/\.mp3$/);
      expect(track.coverArt).toBeTruthy();
    });
  });

  it('has Midnight in Cupertino as the default opening track', () => {
    const firstTrack = MUSIC_PLAYLIST[0];
    expect(firstTrack.title).toBe('Midnight in Cupertino');
    expect(firstTrack.artist).toBe('Synthesizer Society');
    expect(firstTrack.duration).toBe(184);
  });
});
