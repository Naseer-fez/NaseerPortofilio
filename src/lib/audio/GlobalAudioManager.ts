import { SoundSynthesizer, SoundEffectType } from './SoundSynthesizer';

export class GlobalAudioManager {
  private static instance: GlobalAudioManager | null = null;

  public context: AudioContext | null = null;
  public masterGainNode: GainNode | null = null;
  public musicGainNode: GainNode | null = null;
  public fxGainNode: GainNode | null = null;
  public analyserNode: AnalyserNode | null = null;
  public audioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private synthesizer: SoundSynthesizer | null = null;

  private currentMusicVolume: number = 1.0;
  private isDucked: boolean = false;
  private duckRestoreTimeout: any = null;

  private constructor() {}

  public static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  public async init(): Promise<void> {
    if (this.context && this.context.state === 'running') {
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.context && AudioCtx) {
        this.context = new AudioCtx();
      }

      if (this.context) {
        if (this.context.state === 'suspended') {
          await this.context.resume();
        }

        if (!this.masterGainNode) {
          this.masterGainNode = this.context.createGain();
          this.masterGainNode.gain.setValueAtTime(1.0, this.context.currentTime);
          this.masterGainNode.connect(this.context.destination);

          this.analyserNode = this.context.createAnalyser();
          this.analyserNode.fftSize = 64;
          this.analyserNode.connect(this.masterGainNode);

          this.musicGainNode = this.context.createGain();
          this.musicGainNode.gain.setValueAtTime(this.currentMusicVolume, this.context.currentTime);
          this.musicGainNode.connect(this.analyserNode);

          this.fxGainNode = this.context.createGain();
          this.fxGainNode.gain.setValueAtTime(0.8, this.context.currentTime);
          this.fxGainNode.connect(this.masterGainNode);

          this.synthesizer = new SoundSynthesizer(this.context, this.fxGainNode);
        }
      }

      if (!this.audioElement && typeof window !== 'undefined') {
        this.audioElement = new window.Audio();
        if (this.context && this.musicGainNode && !this.mediaSourceNode) {
          try {
            this.mediaSourceNode = this.context.createMediaElementSource(this.audioElement);
            this.mediaSourceNode.connect(this.musicGainNode);
          } catch {
            // MediaElementSource fallback
          }
        }
      }
    } catch {
      // AudioContext init error handling
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public setMusicVolume(volume: number): void {
    this.currentMusicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode && this.context && !this.isDucked) {
      this.musicGainNode.gain.setValueAtTime(this.currentMusicVolume, this.context.currentTime);
    }
  }

  public duckMusic(duckRatio: number = 0.20, rampDownTime: number = 0.04, holdTime: number = 0.25): void {
    if (!this.musicGainNode || !this.context) return;

    if (this.duckRestoreTimeout) {
      clearTimeout(this.duckRestoreTimeout);
      this.duckRestoreTimeout = null;
    }

    this.isDucked = true;
    const now = this.context.currentTime;
    const targetDuckValue = this.currentMusicVolume * duckRatio;

    this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, now);
    this.musicGainNode.gain.linearRampToValueAtTime(targetDuckValue, now + rampDownTime);

    this.duckRestoreTimeout = setTimeout(() => {
      if (!this.musicGainNode || !this.context) return;
      const restoreNow = this.context.currentTime;
      this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, restoreNow);
      this.musicGainNode.gain.linearRampToValueAtTime(this.currentMusicVolume, restoreNow + 0.25);
      this.isDucked = false;
      this.duckRestoreTimeout = null;
    }, (rampDownTime + holdTime) * 1000);
  }

  public playFx(type: SoundEffectType, duck: boolean = true): void {
    if (!this.context || this.context.state !== 'running') {
      this.init().then(() => {
        if (duck) this.duckMusic();
        this.synthesizer?.playFx(type);
      });
      return;
    }

    if (duck) {
      this.duckMusic();
    }
    this.synthesizer?.playFx(type);
  }
}
