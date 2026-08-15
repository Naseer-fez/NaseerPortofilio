export class MockMediaMetadata {
  title: string;
  artist: string;
  album: string;
  artwork: Array<{ src: string; sizes?: string; type?: string }>;

  constructor(init: any = {}) {
    this.title = init.title ?? '';
    this.artist = init.artist ?? '';
    this.album = init.album ?? '';
    this.artwork = init.artwork ?? [];
  }
}

export class MockMediaSession {
  metadata: MockMediaMetadata | null = null;
  playbackState: 'none' | 'paused' | 'playing' = 'none';
  private _actionHandlers: Map<string, (details: any) => void> = new Map();

  setActionHandler(action: string, handler: ((details: any) => void) | null): void {
    if (handler) {
      this._actionHandlers.set(action, handler);
    } else {
      this._actionHandlers.delete(action);
    }
  }

  triggerAction(action: string, details: any = {}): void {
    const handler = this._actionHandlers.get(action);
    if (handler) handler(details);
  }

  hasActionHandler(action: string): boolean {
    return this._actionHandlers.has(action);
  }
}

let globalMediaSessionInstance: MockMediaSession | null = null;

export function getMockMediaSession(): MockMediaSession {
  if (!globalMediaSessionInstance) {
    globalMediaSessionInstance = new MockMediaSession();
  }
  return globalMediaSessionInstance;
}

export function installMediaSessionMock(): void {
  (window as any).MediaMetadata = MockMediaMetadata;
  (navigator as any).mediaSession = getMockMediaSession();
}

export function resetMediaSessionMock(): void {
  if (globalMediaSessionInstance) {
    globalMediaSessionInstance.metadata = null;
    globalMediaSessionInstance.playbackState = 'none';
    (globalMediaSessionInstance as any)._actionHandlers.clear();
  }
}
