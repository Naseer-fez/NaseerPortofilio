import { vi } from 'vitest';

export class MockAudioElement {
  src: string = '';
  currentTime: number = 0;
  duration: number = 180;
  volume: number = 1.0;
  muted: boolean = false;
  paused: boolean = true;
  ended: boolean = false;
  readyState: number = 4;
  networkState: number = 1;
  playbackRate: number = 1.0;

  // eslint-disable-next-line @typescript-eslint/ban-types
  private _listeners: Record<string, Function[]> = {};

  // eslint-disable-next-line @typescript-eslint/ban-types
  addEventListener(event: string, callback: Function): void {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  removeEventListener(event: string, callback: Function): void {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this._listeners[event.type] || [];
    listeners.forEach(cb => cb(event));
    return true;
  }

  async play(): Promise<void> {
    this.paused = false;
    this.ended = false;
    this.dispatchEvent(new Event('play'));
    this.dispatchEvent(new Event('playing'));
  }

  pause(): void {
    this.paused = true;
    this.dispatchEvent(new Event('pause'));
  }

  load(): void {
    this.dispatchEvent(new Event('loadstart'));
    this.dispatchEvent(new Event('loadedmetadata'));
    this.dispatchEvent(new Event('canplay'));
    this.dispatchEvent(new Event('canplaythrough'));
  }

  advanceTime(seconds: number): void {
    if (this.paused) return;
    this.currentTime = Math.min(this.duration, this.currentTime + seconds);
    this.dispatchEvent(new Event('timeupdate'));
    if (this.currentTime >= this.duration) {
      this.ended = true;
      this.paused = true;
      this.dispatchEvent(new Event('ended'));
    }
  }

  seek(seconds: number): void {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    this.dispatchEvent(new Event('seeking'));
    this.dispatchEvent(new Event('seeked'));
    this.dispatchEvent(new Event('timeupdate'));
  }
}

let activeAudioInstances: MockAudioElement[] = [];

export function getActiveAudioElements(): MockAudioElement[] {
  return activeAudioInstances;
}

export function installHTMLAudioMock(): void {
  activeAudioInstances = [];

  const mockAudioConstructor = function (src?: string) {
    const audio = new MockAudioElement();
    if (src) audio.src = src;
    activeAudioInstances.push(audio);
    return audio;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).Audio = mockAudioConstructor;
  
  if (typeof window !== 'undefined' && window.HTMLMediaElement) {
    window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(async function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'));
      this.dispatchEvent(new Event('playing'));
    });
    window.HTMLMediaElement.prototype.pause = vi.fn().mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'));
    });
    window.HTMLMediaElement.prototype.load = vi.fn().mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('canplay'));
    });
  }
}

export function resetHTMLAudioMock(): void {
  activeAudioInstances = [];
}
