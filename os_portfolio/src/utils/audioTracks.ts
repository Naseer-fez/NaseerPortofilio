import { Track } from '../types/audio';

export const TRACK_CATALOG: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight City Drive',
    artist: 'Synthwave Collective',
    album: 'Neon Horizon',
    duration: 184,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    synthPreset: 'synthwave',
  },
  {
    id: 'track-2',
    title: 'Silicon Horizon',
    artist: 'Analog Dreams',
    album: 'Cybernetic Echoes',
    duration: 210,
    coverUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    synthPreset: 'chillhop',
  },
  {
    id: 'track-3',
    title: 'Obsidian Reverie',
    artist: 'Echo Chamber',
    album: 'Dark Matter',
    duration: 165,
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    synthPreset: 'ambient',
  },
  {
    id: 'track-4',
    title: 'Quantum Velocity',
    artist: 'Neural Nexus',
    album: 'Future Artifacts',
    duration: 195,
    coverUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    synthPreset: 'cyberpunk',
  },
];

/**
 * Procedural Web Audio Ambient Synthesizer Engine
 * Generates continuous, beautiful ambient lo-fi music with zero external audio assets required.
 */
export class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isRunning = false;
  private chordInterval: number | null = null;
  private currentStep = 0;
  private activeNodes: AudioNode[] = [];

  // Musical Scale Chords (Frequencies in Hz)
  // Dm9 -> G13 -> Cmaj9 -> Am7
  private chords = [
    [146.83, 220.00, 261.63, 329.63, 440.00], // Dm9 (D3, A3, C4, E4, A4)
    [98.00, 196.00, 246.94, 329.63, 392.00],  // G13 (G2, G3, B3, E4, G4)
    [130.81, 196.00, 246.94, 293.66, 392.00], // Cmaj9 (C3, G3, B3, D4, G4)
    [110.00, 164.81, 220.00, 261.63, 329.63], // Am7 (A2, E3, A3, C4, E4)
  ];

  public init(audioCtx: AudioContext, analyserNode: AnalyserNode, gainNode: GainNode) {
    this.ctx = audioCtx;
    this.analyser = analyserNode;
    this.masterGain = gainNode;
  }

  public start() {
    if (this.isRunning || !this.ctx || !this.masterGain) return;
    this.isRunning = true;
    this.playChordSequence();
    this.chordInterval = window.setInterval(() => {
      this.playChordSequence();
    }, 4000);
  }

  public stop() {
    this.isRunning = false;
    if (this.chordInterval !== null) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Safe disconnect
      }
    });
    this.activeNodes = [];
  }

  private playChordSequence() {
    if (!this.ctx || !this.masterGain || !this.isRunning) return;
    const now = this.ctx.currentTime;
    const chord = this.chords[this.currentStep % this.chords.length];
    this.currentStep++;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 2.0);
    filter.frequency.exponentialRampToValueAtTime(600, now + 3.9);
    filter.connect(this.masterGain);
    this.activeNodes.push(filter);

    chord.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.8, now); // Gentle micro-detune

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.08 / chord.length, now + 0.8);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      osc.connect(noteGain);
      noteGain.connect(filter);

      osc.start(now);
      osc.stop(now + 3.9);
      this.activeNodes.push(osc, noteGain);
    });
  }
}
