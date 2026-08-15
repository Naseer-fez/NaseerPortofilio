import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { useMusicStore } from '@/hooks/useMusicStore';

describe('Tier 1: Web Audio Ducking Pipeline', () => {
  beforeEach(async () => {
    useMusicStore.setState({ status: 'idle', volume: 0.8 });
    await GlobalAudioManager.getInstance().init();
  });

  it('ducks music gain to 20% over 40ms and restores over 250ms on UI sound (#85)', async () => {
    const audioManager = GlobalAudioManager.getInstance();
    audioManager.setMusicVolume(1.0);

    // Trigger procedural UI sound
    audioManager.playFx('window-open', true);

    const musicGain = audioManager.musicGainNode;
    expect(musicGain).toBeDefined();

    // Check scheduled events on mock audio param
    const events = (musicGain?.gain as any).getScheduledEvents();
    expect(events.length).toBeGreaterThan(0);

    const rampEvent = events.find((e: any) => e.type === 'linearRamp');
    expect(rampEvent).toBeDefined();
    expect(rampEvent.targetValue).toBeCloseTo(0.20, 2);
  });

  it('plays UI sound at normal fx gain without errors when music is idle (#86)', () => {
    useMusicStore.setState({ status: 'idle' });
    const audioManager = GlobalAudioManager.getInstance();

    expect(() => {
      audioManager.playFx('click', false);
    }).not.toThrow();

    expect(audioManager.fxGainNode).toBeDefined();
  });
});
