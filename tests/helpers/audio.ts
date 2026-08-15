import { getActiveAudioElements } from '../mocks/audio/HTMLAudioElementMock';
import { getMockAudioContext } from '../mocks/audio/AudioContextMock';

export function simulateAudioPlayback(seconds: number): void {
  const elements = getActiveAudioElements();
  elements.forEach(el => el.advanceTime(seconds));
  const ctx = getMockAudioContext();
  ctx.currentTime += seconds;
}

export function simulateTrackEnd(): void {
  const elements = getActiveAudioElements();
  elements.forEach(el => {
    el.currentTime = el.duration;
    el.ended = true;
    el.paused = true;
    el.dispatchEvent(new Event('ended'));
  });
}
