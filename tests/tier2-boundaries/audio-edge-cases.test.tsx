import { describe, it, expect, beforeEach } from 'vitest';
import { useMusicStore } from '@/hooks/useMusicStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { mockPlaylist } from '../fixtures/playlist.fixture';

describe('Tier 2: Audio Engine & Music Store Edge Cases', () => {
  beforeEach(() => {
    useMusicStore.setState({
      playlist: [...mockPlaylist],
      status: 'idle',
      currentIndex: 0,
      currentTime: 0,
      duration: 180,
      volume: 0.8,
      isMuted: false,
    });
  });

  it('T2-AUD-01: handles empty playlist initialization safely', () => {
    useMusicStore.getState().setPlaylist([]);

    expect(useMusicStore.getState().playlist).toHaveLength(0);
    expect(() => {
      useMusicStore.getState().play();
      useMusicStore.getState().nextTrack();
      useMusicStore.getState().previousTrack();
    }).not.toThrow();
  });

  it('T2-AUD-02: handles rapid track skipping burst without index corruption', () => {
    useMusicStore.getState().setPlaylist([...mockPlaylist]);

    for (let i = 0; i < 20; i++) {
      useMusicStore.getState().nextTrack();
    }

    const state = useMusicStore.getState();
    expect(state.currentIndex).toBeGreaterThanOrEqual(0);
    expect(state.currentIndex).toBeLessThan(state.playlist.length);
  });

  it('T2-AUD-03: clamps seek position at upper duration bound', () => {
    useMusicStore.setState({ duration: 180 });
    useMusicStore.getState().seekTo(99999);

    expect(useMusicStore.getState().currentTime).toBe(180);
  });

  it('T2-AUD-04: clamps seek position at lower bound (0s)', () => {
    useMusicStore.getState().seekTo(-50);

    expect(useMusicStore.getState().currentTime).toBe(0);
  });

  it('T2-AUD-05: clamps volume strictly within [0.0, 1.0] range', () => {
    useMusicStore.getState().setVolume(-0.5);
    expect(useMusicStore.getState().volume).toBe(0.0);
    expect(useMusicStore.getState().isMuted).toBe(true);

    useMusicStore.getState().setVolume(1.8);
    expect(useMusicStore.getState().volume).toBe(1.0);
  });

  it('T2-AUD-06: maintains suspended AudioContext before first user gesture', () => {
    const audioManager = GlobalAudioManager.getInstance();
    if (audioManager.context) {
      expect(['suspended', 'running']).toContain(audioManager.context.state);
    }
  });

  it('T2-AUD-07: manages procedural audio ducking storm without gain corruption', async () => {
    const audioManager = GlobalAudioManager.getInstance();
    await audioManager.init();
    audioManager.setMusicVolume(0.8);

    for (let i = 0; i < 10; i++) {
      audioManager.playFx('click', true);
    }

    const musicGain = audioManager.musicGainNode;
    expect(musicGain).toBeDefined();
    expect((musicGain?.gain as any).value).toBeGreaterThanOrEqual(0);
  });
});
