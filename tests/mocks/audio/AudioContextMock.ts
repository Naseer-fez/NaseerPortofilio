import { vi } from 'vitest';

export interface ScheduledAudioParamEvent {
  type: 'setValueAtTime' | 'linearRamp' | 'exponentialRamp' | 'setTarget';
  targetValue: number;
  time: number;
  timeConstant?: number;
}

export class MockAudioParam {
  private _value: number;
  private _scheduledEvents: ScheduledAudioParamEvent[] = [];

  constructor(defaultValue: number = 1.0) {
    this._value = defaultValue;
  }

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
  }

  setValueAtTime(value: number, startTime: number): this {
    this._value = value;
    this._scheduledEvents.push({ type: 'setValueAtTime', targetValue: value, time: startTime });
    return this;
  }

  linearRampToValueAtTime(value: number, endTime: number): this {
    this._value = value;
    this._scheduledEvents.push({ type: 'linearRamp', targetValue: value, time: endTime });
    return this;
  }

  exponentialRampToValueAtTime(value: number, endTime: number): this {
    this._value = value;
    this._scheduledEvents.push({ type: 'exponentialRamp', targetValue: value, time: endTime });
    return this;
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number): this {
    this._value = target;
    this._scheduledEvents.push({ type: 'setTarget', targetValue: target, time: startTime, timeConstant });
    return this;
  }

  cancelScheduledValues(startTime: number): this {
    this._scheduledEvents = this._scheduledEvents.filter(e => e.time < startTime);
    return this;
  }

  getScheduledEvents(): ScheduledAudioParamEvent[] {
    return [...this._scheduledEvents];
  }

  reset(): void {
    this._value = 1.0;
    this._scheduledEvents = [];
  }
}

export class MockAudioNode {
  context: MockAudioContext;
  numberOfInputs: number = 1;
  numberOfOutputs: number = 1;
  channelCount: number = 2;
  channelCountMode: string = 'max';
  channelInterpretation: string = 'speakers';
  connectedNodes: MockAudioNode[] = [];

  constructor(context: MockAudioContext) {
    this.context = context;
  }

  connect(destination: MockAudioNode | AudioNode): MockAudioNode {
    this.connectedNodes.push(destination as MockAudioNode);
    return destination as MockAudioNode;
  }

  disconnect(): void {
    this.connectedNodes = [];
  }
}

export class MockGainNode extends MockAudioNode {
  gain: MockAudioParam;

  constructor(context: MockAudioContext, defaultGain: number = 1.0) {
    super(context);
    this.gain = new MockAudioParam(defaultGain);
  }
}

export class MockAnalyserNode extends MockAudioNode {
  fftSize: number = 64;
  frequencyBinCount: number = 32;
  minDecibels: number = -100;
  maxDecibels: number = -30;
  smoothingTimeConstant: number = 0.8;
  private _mockDataActive: boolean = true;

  constructor(context: MockAudioContext) {
    super(context);
  }

  getByteFrequencyData(array: Uint8Array): void {
    for (let i = 0; i < array.length; i++) {
      if (this._mockDataActive) {
        array[i] = Math.floor(Math.sin((i / array.length) * Math.PI) * 200 + 20);
      } else {
        array[i] = 0;
      }
    }
  }

  getByteTimeDomainData(array: Uint8Array): void {
    for (let i = 0; i < array.length; i++) {
      array[i] = 128;
    }
  }

  setMockDataActive(active: boolean): void {
    this._mockDataActive = active;
  }
}

export class MockMediaElementAudioSourceNode extends MockAudioNode {
  mediaElement: HTMLMediaElement;

  constructor(context: MockAudioContext, mediaElement: HTMLMediaElement) {
    super(context);
    this.mediaElement = mediaElement;
  }
}

export class MockAudioDestinationNode extends MockAudioNode {
  maxChannelCount: number = 2;
  constructor(context: MockAudioContext) {
    super(context);
  }
}

export class MockAudioContext {
  state: 'suspended' | 'running' | 'closed' = 'suspended';
  currentTime: number = 0;
  sampleRate: number = 44100;
  destination: MockAudioDestinationNode;
  
  gainNodes: MockGainNode[] = [];
  analyserNodes: MockAnalyserNode[] = [];
  sourceNodes: MockMediaElementAudioSourceNode[] = [];

  constructor() {
    this.destination = new MockAudioDestinationNode(this);
  }

  createGain(): MockGainNode {
    const gain = new MockGainNode(this);
    this.gainNodes.push(gain);
    return gain;
  }

  createAnalyser(): MockAnalyserNode {
    const analyser = new MockAnalyserNode(this);
    this.analyserNodes.push(analyser);
    return analyser;
  }

  createMediaElementSource(mediaElement: HTMLMediaElement): MockMediaElementAudioSourceNode {
    const source = new MockMediaElementAudioSourceNode(this, mediaElement);
    this.sourceNodes.push(source);
    return source;
  }

  createOscillator(): any {
    return {
      type: 'sine',
      frequency: new MockAudioParam(440),
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createBiquadFilter(): any {
    return {
      type: 'lowpass',
      frequency: new MockAudioParam(1000),
      Q: new MockAudioParam(1),
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }

  createBufferSource(): any {
    return {
      buffer: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  async resume(): Promise<void> {
    this.state = 'running';
  }

  async suspend(): Promise<void> {
    this.state = 'suspended';
  }

  async close(): Promise<void> {
    this.state = 'closed';
  }
}

let globalAudioContextInstance: MockAudioContext | null = null;

export function getMockAudioContext(): MockAudioContext {
  if (!globalAudioContextInstance) {
    globalAudioContextInstance = new MockAudioContext();
  }
  return globalAudioContextInstance;
}

export function installWebAudioMock(): void {
  (window as any).AudioContext = class extends MockAudioContext {
    constructor() {
      super();
      globalAudioContextInstance = this;
    }
  };
  (window as any).webkitAudioContext = (window as any).AudioContext;
}

export function resetWebAudioMock(): void {
  if (globalAudioContextInstance) {
    globalAudioContextInstance.state = 'suspended';
    globalAudioContextInstance.currentTime = 0;
    globalAudioContextInstance.gainNodes.forEach(g => g.gain.reset());
    globalAudioContextInstance.gainNodes = [];
    globalAudioContextInstance.analyserNodes = [];
    globalAudioContextInstance.sourceNodes = [];
  }
  globalAudioContextInstance = null;
}
