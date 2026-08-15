import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getMockAudioContext, MockAudioParam, MockAudioContext } from '../mocks/audio/AudioContextMock';
import { getActiveAudioElements, MockAudioElement, installHTMLAudioMock, resetHTMLAudioMock } from '../mocks/audio/HTMLAudioElementMock';
import { MockResizeObserver, resetResizeObserverMock } from '../mocks/dom/ResizeObserverMock';
import { setViewport, resetMatchMediaMock } from '../mocks/dom/MatchMediaMock';
import { advanceFrames, resetRafMock } from '../mocks/dom/RafMock';
import { localStorageMock, resetLocalStorageMock } from '../mocks/dom/LocalStorageMock';
import { getMockMediaSession, resetMediaSessionMock } from '../mocks/platform/MediaSessionMock';
import { simulateDrag, simulateMarquee } from '../helpers/drag';
import { simulateKeyboardShortcut } from '../helpers/keyboard';
import { simulateMobileSwipe } from '../helpers/gesture';
import { simulateAudioPlayback, simulateTrackEnd } from '../helpers/audio';
import { useOSStore } from '@/hooks/useOSStore';
import { useMusicStore } from '@/hooks/useMusicStore';
import { calculateCosineBellWidth } from '@/lib/physics/springUtils';
import { solveEulerStep, calculateGaussianFalloff } from '@/lib/physics/eulerSolver';

describe('CHALLENGER-1: Adversarial Custom Matchers Stress Tests', () => {
  describe('toBeInZIndexRange matcher', () => {
    it('passes when zIndex is within the specified range', () => {
      const el = document.createElement('div');
      el.style.zIndex = '15';
      expect(el).toBeInZIndexRange(10, 20);
    });

    it('passes at exact range boundaries', () => {
      const elMin = document.createElement('div');
      elMin.style.zIndex = '10';
      expect(elMin).toBeInZIndexRange(10, 20);

      const elMax = document.createElement('div');
      elMax.style.zIndex = '20';
      expect(elMax).toBeInZIndexRange(10, 20);
    });

    it('fails when zIndex is strictly below min', () => {
      const el = document.createElement('div');
      el.style.zIndex = '9';
      expect(() => {
        expect(el).toBeInZIndexRange(10, 20);
      }).toThrow(/expected element z-index \(9\) to be between 10 and 20/);
    });

    it('fails when zIndex is strictly above max', () => {
      const el = document.createElement('div');
      el.style.zIndex = '21';
      expect(() => {
        expect(el).toBeInZIndexRange(10, 20);
      }).toThrow(/expected element z-index \(21\) to be between 10 and 20/);
    });

    it('supports negation (.not.toBeInZIndexRange)', () => {
      const el = document.createElement('div');
      el.style.zIndex = '50';
      expect(el).not.toBeInZIndexRange(10, 20);
    });

    it('defaults un-styled or non-numeric zIndex to 0', () => {
      const el = document.createElement('div');
      expect(el).toBeInZIndexRange(0, 10);
      expect(el).not.toBeInZIndexRange(10, 20);

      el.style.zIndex = 'invalid';
      expect(el).toBeInZIndexRange(0, 10);
    });

    it('handles negative z-index ranges correctly', () => {
      const el = document.createElement('div');
      el.style.zIndex = '-5';
      expect(el).toBeInZIndexRange(-10, -1);
      expect(el).not.toBeInZIndexRange(0, 10);
    });
  });

  describe('toHaveZIndexOrder matcher', () => {
    it('passes when top element has higher z-index than bottom element', () => {
      const top = document.createElement('div');
      top.style.zIndex = '30';
      const bottom = document.createElement('div');
      bottom.style.zIndex = '20';

      expect(top).toHaveZIndexOrder(bottom);
    });

    it('fails when top element has lower z-index than bottom element', () => {
      const top = document.createElement('div');
      top.style.zIndex = '10';
      const bottom = document.createElement('div');
      bottom.style.zIndex = '20';

      expect(() => {
        expect(top).toHaveZIndexOrder(bottom);
      }).toThrow(/expected element with z-index 10 to be above element with z-index 20/);
    });

    it('fails when both elements have identical z-index', () => {
      const elA = document.createElement('div');
      elA.style.zIndex = '25';
      const elB = document.createElement('div');
      elB.style.zIndex = '25';

      expect(() => {
        expect(elA).toHaveZIndexOrder(elB);
      }).toThrow(/expected element with z-index 25 to be above element with z-index 25/);
    });

    it('supports negation (.not.toHaveZIndexOrder)', () => {
      const top = document.createElement('div');
      top.style.zIndex = '10';
      const bottom = document.createElement('div');
      bottom.style.zIndex = '20';

      expect(top).not.toHaveZIndexOrder(bottom);
    });
  });

  describe('toBeClampedWithinViewport matcher', () => {
    beforeEach(() => {
      setViewport({ width: 1440, height: 900 });
    });

    it('passes when window bounds are fully within viewport and respect minY (28px)', () => {
      const win = document.createElement('div');
      win.getBoundingClientRect = () => ({
        top: 50,
        left: 100,
        bottom: 550,
        right: 800,
        width: 700,
        height: 500,
        x: 100,
        y: 50,
        toJSON: () => ({}),
      });

      expect(win).toBeClampedWithinViewport();
    });

    it('fails when window violates top menu bar clearance (top < 28px)', () => {
      const win = document.createElement('div');
      win.getBoundingClientRect = () => ({
        top: 20, // Violation: < 28
        left: 100,
        bottom: 520,
        right: 800,
        width: 700,
        height: 500,
        x: 100,
        y: 20,
        toJSON: () => ({}),
      });

      expect(() => {
        expect(win).toBeClampedWithinViewport();
      }).toThrow(/to satisfy clamping/);
    });

    it('fails when window violates left overhang (<100px visible)', () => {
      const win = document.createElement('div');
      // width 700, left -650 -> visibleX = 50px (< 100px)
      win.getBoundingClientRect = () => ({
        top: 50,
        left: -650,
        bottom: 550,
        right: 50,
        width: 700,
        height: 500,
        x: -650,
        y: 50,
        toJSON: () => ({}),
      });

      expect(() => {
        expect(win).toBeClampedWithinViewport();
      }).toThrow(/to satisfy clamping/);
    });

    it('fails when window violates right overhang (<100px visible in 1440px viewport)', () => {
      const win = document.createElement('div');
      // left 1390, right 2090 in 1440vw -> visibleX = 50px (< 100px)
      win.getBoundingClientRect = () => ({
        top: 50,
        left: 1390,
        bottom: 550,
        right: 2090,
        width: 700,
        height: 500,
        x: 1390,
        y: 50,
        toJSON: () => ({}),
      });

      expect(() => {
        expect(win).toBeClampedWithinViewport();
      }).toThrow(/to satisfy clamping/);
    });

    it('fails when window is completely off-screen', () => {
      const win = document.createElement('div');
      win.getBoundingClientRect = () => ({
        top: -1000,
        left: -1000,
        bottom: -500,
        right: -300,
        width: 700,
        height: 500,
        x: -1000,
        y: -1000,
        toJSON: () => ({}),
      });

      expect(win).not.toBeClampedWithinViewport();
    });

    it('allows custom constraints override', () => {
      const win = document.createElement('div');
      win.getBoundingClientRect = () => ({
        top: 15,
        left: 100,
        bottom: 515,
        right: 800,
        width: 700,
        height: 500,
        x: 100,
        y: 15,
        toJSON: () => ({}),
      });

      // With custom minY = 10, top=15 passes
      expect(win).toBeClampedWithinViewport({ minY: 10, minOverhang: 50 });
    });
  });

  describe('toMatchGlassmorphism matcher', () => {
    it('passes when inline backdropFilter style satisfies spec', () => {
      const el = document.createElement('div');
      el.style.backdropFilter = 'blur(20px) saturate(180%)';

      expect(el).toMatchGlassmorphism({ blur: '20px', saturate: '180%' });
    });

    it('fails when element lacks both backdrop-filter style and glassmorphic classes', () => {
      const el = document.createElement('div');
      el.className = 'bg-white text-black';

      expect(() => {
        expect(el).toMatchGlassmorphism({ blur: '20px' });
      }).toThrow(/to match glassmorphism spec/);
    });

    it('passes when tailwind backdrop-blur class is present', () => {
      const el = document.createElement('div');
      el.className = 'backdrop-blur-md backdrop-saturate-150';

      expect(el).toMatchGlassmorphism({ blur: '12px', saturate: '150%' });
    });

    it('AUDIT NOTE: checks class token presence when style is uncomputed', () => {
      const el = document.createElement('div');
      el.className = 'backdrop-blur-xl';
      // Verifies class-based matching fallback for jsdom
      expect(el).toMatchGlassmorphism({ blur: '20px' });
    });
  });

  describe('toHaveWindowBounds matcher', () => {
    it('passes when bounding rect matches expected bounds within 2px tolerance', () => {
      const el = document.createElement('div');
      el.getBoundingClientRect = () => ({
        left: 101, // 1px difference from expected 100
        top: 49,  // 1px difference from expected 50
        width: 600,
        height: 400,
        right: 701,
        bottom: 449,
        x: 101,
        y: 49,
        toJSON: () => ({}),
      });

      expect(el).toHaveWindowBounds({ x: 100, y: 50, width: 600, height: 400 });
    });

    it('fails when coordinate deviation exceeds 2px tolerance', () => {
      const el = document.createElement('div');
      el.getBoundingClientRect = () => ({
        left: 105, // 5px difference (> 2px)
        top: 50,
        width: 600,
        height: 400,
        right: 705,
        bottom: 450,
        x: 105,
        y: 50,
        toJSON: () => ({}),
      });

      expect(() => {
        expect(el).toHaveWindowBounds({ x: 100, y: 50, width: 600, height: 400 });
      }).toThrow(/x: expected 100, got 105/);
    });
  });

  describe('toHaveDockMagnification matcher', () => {
    it('passes when scale matches expected within tolerance', () => {
      const item = document.createElement('div');
      // baseSize 44, width 66 -> scale 1.5
      item.getBoundingClientRect = () => ({
        width: 66,
        height: 66,
        top: 0,
        left: 0,
        bottom: 66,
        right: 66,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      expect(item).toHaveDockMagnification(1.5, 0.05);
    });

    it('fails when scale is outside tolerance', () => {
      const item = document.createElement('div');
      item.getBoundingClientRect = () => ({
        width: 44, // scale 1.0 vs expected 1.5
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 44,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      expect(() => {
        expect(item).toHaveDockMagnification(1.5, 0.05);
      }).toThrow(/expected dock item scale \(1.000\) to be within 0.05 of 1.5/);
    });
  });

  describe('toHaveDuckedVolume matcher', () => {
    it('passes when GainNode gain.value is close to duck level (0.20)', () => {
      const mockGainNode = { gain: { value: 0.20 } };
      expect(mockGainNode).toHaveDuckedVolume(0.20, 0.02);
    });

    it('passes with raw numeric duck value', () => {
      expect(0.21).toHaveDuckedVolume(0.20, 0.05);
    });

    it('fails when gain value is not ducked (e.g. 0.80)', () => {
      const mockGainNode = { gain: { value: 0.80 } };
      expect(() => {
        expect(mockGainNode).toHaveDuckedVolume(0.20, 0.05);
      }).toThrow(/expected music volume gain \(0.8\) to duck to 0.2/);
    });
  });
});

describe('CHALLENGER-1: Mock Fidelity & Simulation Helper Stress Tests', () => {
  describe('Web Audio & MockAudioParam Fidelity', () => {
    it('records all scheduled parameter events with correct parameters', () => {
      const param = new MockAudioParam(1.0);
      param.setValueAtTime(0.8, 1.0);
      param.linearRampToValueAtTime(0.2, 1.04);
      param.exponentialRampToValueAtTime(0.01, 1.5);
      param.setTargetAtTime(0.5, 2.0, 0.1);

      const events = param.getScheduledEvents();
      expect(events).toHaveLength(4);
      expect(events[0]).toEqual({ type: 'setValueAtTime', targetValue: 0.8, time: 1.0 });
      expect(events[1]).toEqual({ type: 'linearRamp', targetValue: 0.2, time: 1.04 });
      expect(events[2]).toEqual({ type: 'exponentialRamp', targetValue: 0.01, time: 1.5 });
      expect(events[3]).toEqual({ type: 'setTarget', targetValue: 0.5, time: 2.0, timeConstant: 0.1 });
    });

    it('cancels scheduled values after specified start time', () => {
      const param = new MockAudioParam(1.0);
      param.setValueAtTime(0.8, 1.0);
      param.linearRampToValueAtTime(0.2, 2.0);
      param.linearRampToValueAtTime(0.8, 3.0);

      param.cancelScheduledValues(2.0);
      const events = param.getScheduledEvents();
      expect(events).toHaveLength(1);
      expect(events[0].time).toBe(1.0);
    });

    it('resets AudioParam state and events cleanly', () => {
      const param = new MockAudioParam(0.5);
      param.linearRampToValueAtTime(0.1, 1.0);
      param.reset();

      expect(param.value).toBe(1.0);
      expect(param.getScheduledEvents()).toHaveLength(0);
    });

    it('MockAnalyserNode provides frequency data and respects active toggle', () => {
      const ctx = new MockAudioContext();
      const analyser = ctx.createAnalyser();
      const buffer = new Uint8Array(analyser.frequencyBinCount);

      analyser.getByteFrequencyData(buffer);
      const sumActive = buffer.reduce((a, b) => a + b, 0);
      expect(sumActive).toBeGreaterThan(0);

      analyser.setMockDataActive(false);
      analyser.getByteFrequencyData(buffer);
      const sumInactive = buffer.reduce((a, b) => a + b, 0);
      expect(sumInactive).toBe(0);
    });
  });

  describe('HTMLAudioElementMock Fidelity', () => {
    beforeEach(() => {
      installHTMLAudioMock();
    });

    it('tracks active audio instances and playback state transitions', async () => {
      const audio = new (window as any).Audio('test.mp3');
      const instances = getActiveAudioElements();
      expect(instances).toContain(audio);

      const playSpy = vi.fn();
      const pauseSpy = vi.fn();
      audio.addEventListener('play', playSpy);
      audio.addEventListener('pause', pauseSpy);

      await audio.play();
      expect(audio.paused).toBe(false);
      expect(playSpy).toHaveBeenCalled();

      audio.pause();
      expect(audio.paused).toBe(true);
      expect(pauseSpy).toHaveBeenCalled();
    });

    it('advances playback time, triggers timeupdate, and fires ended at duration', () => {
      const audio = new MockAudioElement();
      audio.duration = 10;
      audio.play();

      const timeUpdateSpy = vi.fn();
      const endedSpy = vi.fn();
      audio.addEventListener('timeupdate', timeUpdateSpy);
      audio.addEventListener('ended', endedSpy);

      audio.advanceTime(5);
      expect(audio.currentTime).toBe(5);
      expect(timeUpdateSpy).toHaveBeenCalled();
      expect(endedSpy).not.toHaveBeenCalled();

      audio.advanceTime(10); // Exceeds duration
      expect(audio.currentTime).toBe(10);
      expect(audio.ended).toBe(true);
      expect(audio.paused).toBe(true);
      expect(endedSpy).toHaveBeenCalled();
    });

    it('does not advance time when paused', () => {
      const audio = new MockAudioElement();
      audio.currentTime = 5;
      audio.pause();

      audio.advanceTime(10);
      expect(audio.currentTime).toBe(5);
    });

    it('handles seek events properly', () => {
      const audio = new MockAudioElement();
      audio.duration = 100;

      const seekingSpy = vi.fn();
      const seekedSpy = vi.fn();
      audio.addEventListener('seeking', seekingSpy);
      audio.addEventListener('seeked', seekedSpy);

      audio.seek(42);
      expect(audio.currentTime).toBe(42);
      expect(seekingSpy).toHaveBeenCalled();
      expect(seekedSpy).toHaveBeenCalled();

      // Clamping bounds
      audio.seek(-20);
      expect(audio.currentTime).toBe(0);

      audio.seek(500);
      expect(audio.currentTime).toBe(100);
    });
  });

  describe('ResizeObserverMock Fidelity', () => {
    beforeEach(() => {
      resetResizeObserverMock();
    });

    it('dispatches resize entries to multiple registered observers on target', () => {
      const el = document.createElement('div');
      const callbackA = vi.fn();
      const callbackB = vi.fn();

      const observerA = new MockResizeObserver(callbackA);
      const observerB = new MockResizeObserver(callbackB);

      observerA.observe(el);
      observerB.observe(el);

      MockResizeObserver.triggerResize(el, { width: 800, height: 600 });

      expect(callbackA).toHaveBeenCalledTimes(1);
      expect(callbackB).toHaveBeenCalledTimes(1);

      const entryA = callbackA.mock.calls[0][0][0];
      expect(entryA.target).toBe(el);
      expect(entryA.contentRect.width).toBe(800);
      expect(entryA.contentRect.height).toBe(600);
    });

    it('unobserves and disconnects targets cleanly', () => {
      const el = document.createElement('div');
      const callback = vi.fn();
      const observer = new MockResizeObserver(callback);

      observer.observe(el);
      observer.unobserve(el);

      MockResizeObserver.triggerResize(el, { width: 500, height: 500 });
      expect(callback).not.toHaveBeenCalled();
    });

    it('disconnect removes all observed targets for that observer', () => {
      const el1 = document.createElement('div');
      const el2 = document.createElement('div');
      const callback = vi.fn();
      const observer = new MockResizeObserver(callback);

      observer.observe(el1);
      observer.observe(el2);
      observer.disconnect();

      MockResizeObserver.triggerResize(el1, { width: 100, height: 100 });
      MockResizeObserver.triggerResize(el2, { width: 100, height: 100 });
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('MatchMediaMock & Viewport Dispatch Fidelity', () => {
    beforeEach(() => {
      resetMatchMediaMock();
    });

    it('evaluates responsive width breakpoints correctly', () => {
      setViewport({ width: 1200 });
      expect(window.matchMedia('(min-width: 1024px)').matches).toBe(true);
      expect(window.matchMedia('(max-width: 1023px)').matches).toBe(false);

      setViewport({ width: 800 });
      expect(window.matchMedia('(min-width: 1024px)').matches).toBe(false);
      expect(window.matchMedia('(min-width: 768px)').matches).toBe(true);
      expect(window.matchMedia('(max-width: 767px)').matches).toBe(false);

      setViewport({ width: 500 });
      expect(window.matchMedia('(max-width: 639px)').matches).toBe(true);
    });

    it('evaluates pointer, hover, theme, and reducedMotion queries', () => {
      setViewport({ pointer: 'coarse', hover: 'none', theme: 'light', reducedMotion: true });

      expect(window.matchMedia('(pointer: coarse)').matches).toBe(true);
      expect(window.matchMedia('(pointer: fine)').matches).toBe(false);
      expect(window.matchMedia('(hover: none)').matches).toBe(true);
      expect(window.matchMedia('(hover: hover)').matches).toBe(false);
      expect(window.matchMedia('(prefers-color-scheme: light)').matches).toBe(true);
      expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false);
      expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
    });

    it('triggers registered media query listeners when viewport changes', () => {
      const listener = vi.fn();
      const mql = window.matchMedia('(min-width: 1024px)');
      mql.addEventListener('change', listener);

      setViewport({ width: 800 });
      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0];
      expect(event.matches).toBe(false);
    });
  });

  describe('RafMock Fidelity & Recursive Loops', () => {
    beforeEach(() => {
      resetRafMock();
    });

    it('advances single and multiple animation frames with accumulated time', () => {
      const timestamps: number[] = [];
      window.requestAnimationFrame((t) => timestamps.push(t));

      advanceFrames(1, 16.67);
      expect(timestamps).toHaveLength(1);
      expect(timestamps[0]).toBeCloseTo(16.67, 1);
    });

    it('handles recursive requestAnimationFrame loops across multi-frame advance', () => {
      let loopCount = 0;
      function loop(time: number) {
        loopCount++;
        if (loopCount < 10) {
          window.requestAnimationFrame(loop);
        }
      }

      window.requestAnimationFrame(loop);
      advanceFrames(5, 16.67);
      expect(loopCount).toBe(5);

      advanceFrames(5, 16.67);
      expect(loopCount).toBe(10);
    });

    it('supports cancelAnimationFrame', () => {
      const cb = vi.fn();
      const id = window.requestAnimationFrame(cb);
      window.cancelAnimationFrame(id);

      advanceFrames(1);
      expect(cb).not.toHaveBeenCalled();
    });
  });

  describe('Simulation Helpers Stress Tests', () => {
    it('simulateDrag fires sequential pointerDown, pointerMove, pointerUp events with correct coords', () => {
      const el = document.createElement('div');
      const events: string[] = [];
      const coords: Array<{ x: number; y: number }> = [];

      el.addEventListener('pointerdown', (e: any) => {
        events.push('pointerdown');
        coords.push({ x: e.clientX, y: e.clientY });
      });

      window.addEventListener('pointermove', (e: any) => {
        events.push('pointermove');
        coords.push({ x: e.clientX, y: e.clientY });
      });

      window.addEventListener('pointerup', (e: any) => {
        events.push('pointerup');
        coords.push({ x: e.clientX, y: e.clientY });
      });

      simulateDrag(el, {
        from: { x: 10, y: 20 },
        to: { x: 50, y: 100 },
        steps: 4,
      });

      expect(events[0]).toBe('pointerdown');
      expect(events[events.length - 1]).toBe('pointerup');
      expect(coords[0]).toEqual({ x: 10, y: 20 });
      expect(coords[coords.length - 1]).toEqual({ x: 50, y: 100 });
    });

    it('simulateKeyboardShortcut dispatches keydown and keyup with modifier flags', () => {
      const events: KeyboardEvent[] = [];
      const handler = (e: Event) => events.push(e as KeyboardEvent);

      window.addEventListener('keydown', handler);
      window.addEventListener('keyup', handler);

      simulateKeyboardShortcut('Cmd+Shift+K');

      expect(events).toHaveLength(2);
      expect(events[0].key).toBe('k');
      expect(events[0].metaKey).toBe(true);
      expect(events[0].shiftKey).toBe(true);

      window.removeEventListener('keydown', handler);
      window.removeEventListener('keyup', handler);
    });

    it('simulateMobileSwipe dispatches touchstart, touchmove, and touchend', () => {
      const el = document.createElement('div');
      const touchEvents: string[] = [];

      el.addEventListener('touchstart', () => touchEvents.push('touchstart'));
      el.addEventListener('touchmove', () => touchEvents.push('touchmove'));
      el.addEventListener('touchend', () => touchEvents.push('touchend'));

      simulateMobileSwipe(el, { startY: 100, deltaY: 200, steps: 3 });

      expect(touchEvents).toContain('touchstart');
      expect(touchEvents).toContain('touchmove');
      expect(touchEvents).toContain('touchend');
    });

    it('simulateAudioPlayback and simulateTrackEnd advance audio state', () => {
      const audio = new (window as any).Audio();
      audio.duration = 100;
      audio.play();

      const endedSpy = vi.fn();
      audio.addEventListener('ended', endedSpy);

      simulateAudioPlayback(30);
      expect(audio.currentTime).toBe(30);

      simulateTrackEnd();
      expect(audio.ended).toBe(true);
      expect(audio.paused).toBe(true);
      expect(endedSpy).toHaveBeenCalled();
    });
  });
});

describe('CHALLENGER-1: Rapid Concurrency & Physics Stress Tests', () => {
  beforeEach(() => {
    useOSStore.setState({
      activeWindowId: null,
      theme: 'dark',
    });
  });

  it('handles 100 rapid concurrent window operations without state corruption', () => {
    const apps: Array<'terminal' | 'projects' | 'about' | 'finder' | 'settings' | 'mail'> = [
      'terminal', 'projects', 'about', 'finder', 'settings', 'mail'
    ];

    for (let i = 0; i < 100; i++) {
      const app = apps[i % apps.length];
      if (i % 3 === 0) {
        useOSStore.getState().openWindow(app);
      } else if (i % 3 === 1) {
        useOSStore.getState().focusWindow(app);
      } else {
        useOSStore.getState().updatePosition(app, { x: 50 + (i % 200), y: 30 + (i % 150) });
      }
    }

    const state = useOSStore.getState();
    expect(state.windows).toBeDefined();
    // Verify all open windows have valid coordinates clamped >= 28
    Object.values(state.windows).forEach(win => {
      if (win.isOpen) {
        expect(win.position.y).toBeGreaterThanOrEqual(28);
        expect(win.zIndex).toBeGreaterThanOrEqual(20);
      }
    });
  });

  it('evaluates spring & Euler solver physics across extreme boundary inputs', () => {
    // Extreme coordinates & velocity
    const extremeEuler = solveEulerStep({ x: 1e6, v: -5e5 }, 0, { k: 500, c: 50, m: 0.5 });
    expect(Number.isFinite(extremeEuler.x)).toBe(true);
    expect(Number.isFinite(extremeEuler.v)).toBe(true);

    // Extreme Gaussian distances
    const gZero = calculateGaussianFalloff(0, 300, 150);
    expect(gZero).toBeCloseTo(1.0, 3);

    const gFar = calculateGaussianFalloff(10000, 300, 150);
    expect(gFar).toBeCloseTo(0.0, 3);
  });

  it('handles rapid audio ducking storm without race corruption', () => {
    useMusicStore.setState({ volume: 0.8, status: 'playing' });

    for (let i = 0; i < 50; i++) {
      useMusicStore.getState().setVolume(i % 2 === 0 ? 0.2 : 0.8);
      useMusicStore.getState().seekTo(i * 3);
    }

    expect(useMusicStore.getState().volume).toBe(0.8);
    expect(useMusicStore.getState().currentTime).toBeLessThanOrEqual(useMusicStore.getState().duration);
  });
});
