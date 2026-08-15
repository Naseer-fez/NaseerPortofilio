export function installDeviceOrientationMock(): void {
  if (typeof window !== 'undefined' && !(window as any).DeviceOrientationEvent) {
    (window as any).DeviceOrientationEvent = class DeviceOrientationEvent extends Event {
      alpha: number | null;
      beta: number | null;
      gamma: number | null;
      absolute: boolean;

      constructor(type: string, eventInitDict: any = {}) {
        super(type, eventInitDict);
        this.alpha = eventInitDict.alpha ?? 0;
        this.beta = eventInitDict.beta ?? 0;
        this.gamma = eventInitDict.gamma ?? 0;
        this.absolute = eventInitDict.absolute ?? false;
      }
    };
  }
}
