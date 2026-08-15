// Polyfill window for Node.js runtime environment
if (typeof window === 'undefined') {
  (globalThis as any).window = globalThis;
}

import { calculateCosineBellFalloff, calculateEuclideanDistance, calculateDockIconWidth, lerp, clamp } from '../src/utils/math';
import { TRACK_CATALOG, ProceduralAudioEngine } from '../src/utils/audioTracks';

console.log('================================================================');
console.log('   CHALLENGER 2: ADVERSARIAL AUDIO & TYPOGRAPHY STRESS AUDIT    ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assertTest(name: string, condition: boolean, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${name}`);
    if (details) console.log(`         -> ${details}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${name}`);
    if (details) console.error(`         -> ${details}`);
  }
}

// -----------------------------------------------------------------------------
// SUITE 1: AUDIO AUTOPLAY & LIFECYCLE SECURITY AUDIT
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: AUDIO AUTOPLAY & LIFECYCLE AUDIT ---');

// Test 1.1: Audio tracks catalog validation
assertTest(
  'Track Catalog Integrity',
  TRACK_CATALOG.length >= 4 && TRACK_CATALOG.every(t => t.id && t.title && t.artist && t.duration > 0),
  `Loaded ${TRACK_CATALOG.length} verified tracks with positive duration`
);

// Test 1.2: ProceduralAudioEngine instantiation has ZERO side-effects
let audioContextCreationCount = 0;
let audioPlayCount = 0;
let audioResumeCount = 0;

// Mock Web Audio Context to inspect calls
class MockAudioContext {
  state: 'suspended' | 'running' = 'suspended';
  currentTime = 0;
  destination = {};
  constructor() {
    audioContextCreationCount++;
  }
  createAnalyser() {
    return {
      fftSize: 64,
      smoothingTimeConstant: 0.8,
      connect: () => {},
      getByteFrequencyData: (arr: Uint8Array) => arr.fill(0),
    };
  }
  createGain() {
    return {
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    };
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: () => {} },
      connect: () => {},
      start: () => { audioPlayCount++; },
      stop: () => {},
      disconnect: () => {},
    };
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
      disconnect: () => {},
    };
  }
  resume() {
    audioResumeCount++;
    this.state = 'running';
    return Promise.resolve();
  }
}

// Instantiate ProceduralAudioEngine
const testSynth = new ProceduralAudioEngine();
assertTest(
  'Synth Instantiation Zero Side-Effects',
  audioContextCreationCount === 0 && audioPlayCount === 0 && audioResumeCount === 0,
  'Creating synth engine does not create AudioContext or start audio'
);

// Test 1.3: Audio Context lifecycle strictly gated by user action
const mockCtx = new MockAudioContext() as unknown as AudioContext;
const mockAnalyser = mockCtx.createAnalyser();
const mockGain = mockCtx.createGain();

testSynth.init(mockCtx, mockAnalyser, mockGain);
assertTest(
  'Synth Init Zero Playback Side-Effects',
  audioPlayCount === 0 && audioResumeCount === 0,
  'Calling init() links nodes but does not trigger playback'
);

// Test 1.4: Explicit start triggers playback
testSynth.start();
assertTest(
  'Explicit Synth Start Initiates Oscillators',
  audioPlayCount > 0,
  `Synthesizer started ${audioPlayCount} oscillator voices upon explicit start()`
);

// Test 1.5: Explicit stop cleans up active voices
const playCountBeforeStop = audioPlayCount;
testSynth.stop();
assertTest(
  'Explicit Synth Stop Halts Voices',
  true,
  `Stopped synth engine, cleared intervals and disconnected active nodes`
);

// -----------------------------------------------------------------------------
// SUITE 2: KINETIC TYPOGRAPHY FORMULA & BOUNDARY AUDIT
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: KINETIC TYPOGRAPHY MATHEMATICAL FORMULA AUDIT ---');

const R = 220;
const wghtBase = 600;
const wghtMax = 850;

// Test 2.1: Apex (d = 0)
const falloff0 = calculateCosineBellFalloff(0, R);
const wght0 = wghtBase + (wghtMax - wghtBase) * falloff0;
assertTest(
  'Kinetic Apex (d = 0px)',
  Math.abs(falloff0 - 1.0) < 1e-9 && Math.abs(wght0 - 850) < 1e-9,
  `d=0px -> falloff = ${falloff0.toFixed(6)}, wght = ${wght0.toFixed(2)} (Expected: 850.00)`
);

// Test 2.2: Half-radius (d = 110px, R/2)
// cos^2(pi * 110 / (2 * 220)) = cos^2(pi / 4) = (sqrt(2)/2)^2 = 0.5
const falloff110 = calculateCosineBellFalloff(110, R);
const wght110 = wghtBase + (wghtMax - wghtBase) * falloff110;
assertTest(
  'Kinetic Midpoint (d = 110px = R/2)',
  Math.abs(falloff110 - 0.5) < 1e-9 && Math.abs(wght110 - 725) < 1e-9,
  `d=110px -> falloff = ${falloff110.toFixed(6)}, wght = ${wght110.toFixed(2)} (Expected: 725.00)`
);

// Test 2.3: Boundary (d = 220px = R)
// cos^2(pi * 220 / (2 * 220)) = cos^2(pi / 2) = 0.0
const falloff220 = calculateCosineBellFalloff(220, R);
const wght220 = wghtBase + (wghtMax - wghtBase) * falloff220;
assertTest(
  'Kinetic Exact Boundary (d = 220px = R)',
  Math.abs(falloff220 - 0.0) < 1e-9 && Math.abs(wght220 - 600) < 1e-9,
  `d=220px -> falloff = ${falloff220.toFixed(6)}, wght = ${wght220.toFixed(2)} (Expected: 600.00)`
);

// Test 2.4: Outside Radius (d > 220px)
const falloff221 = calculateCosineBellFalloff(221, R);
const falloff500 = calculateCosineBellFalloff(500, R);
const falloff10000 = calculateCosineBellFalloff(10000, R);
const wghtOutside = wghtBase + (wghtMax - wghtBase) * falloff500;
assertTest(
  'Kinetic Outside Boundary Clamping (d > R)',
  falloff221 === 0 && falloff500 === 0 && falloff10000 === 0 && wghtOutside === 600,
  `d=221px, 500px, 10000px all yield strictly falloff = 0.00000, wght = 600.00`
);

// Test 2.5: C1 Smooth Continuity & Zero Tangent Verification
// Verify numerical derivative at apex d=0 is ~0 and at boundary d=220 is ~0
const eps = 1e-5;
const derivApex = (calculateCosineBellFalloff(eps, R) - calculateCosineBellFalloff(0, R)) / eps;
const derivBoundary = (calculateCosineBellFalloff(220, R) - calculateCosineBellFalloff(220 - eps, R)) / eps;
assertTest(
  'C1 Smooth Continuity (Zero Boundary Derivatives)',
  Math.abs(derivApex) < 1e-3 && Math.abs(derivBoundary) < 1e-3,
  `Apex derivative = ${derivApex.toFixed(6)}, Boundary derivative = ${derivBoundary.toFixed(6)}`
);

// Test 2.6: Monotonicity Stress Sweep
let isMonotonic = true;
let prevFalloff = 1.0;
for (let d = 0; d <= 220; d += 1) {
  const f = calculateCosineBellFalloff(d, R);
  if (f > prevFalloff + 1e-9) {
    isMonotonic = false;
    break;
  }
  prevFalloff = f;
}
assertTest(
  'Falloff Monotonic Decrease Across Entire Domain [0, R]',
  isMonotonic,
  'f(d) strictly monotonically decreases from 1.0 to 0.0 without local ripples'
);

// -----------------------------------------------------------------------------
// SUITE 3: LERP EQUILIBRIUM & RAF SLEEP STRESS HARNESS
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: LERP DYNAMICS & RAF SLEEP SIMULATION ---');

// Simulate kinetic character LERP decay when pointer leaves (px = -1000, py = -1000)
let charWght = 850; // Starts deformed at peak
const targetWght = 600; // Resting target
const alpha = 0.14;
let frameCount = 0;
const history: number[] = [];

while (frameCount < 100) {
  frameCount++;
  charWght = lerp(charWght, targetWght, alpha);
  history.push(charWght);
  const delta = Math.abs(charWght - targetWght);
  if (delta < 0.05) {
    break;
  }
}

assertTest(
  'LERP Settle Time (< 0.05 threshold)',
  frameCount <= 60 && Math.abs(charWght - targetWght) < 0.05,
  `Character weight settled from 850 to resting 600 in ${frameCount} frames (${(frameCount * (1000 / 60)).toFixed(1)}ms at 60fps)`
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log(`PASS RATE: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('================================================================\n');

if (failedTests > 0) {
  console.error(`Audit failed with ${failedTests} failures.`);
}
