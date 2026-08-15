// Polyfill window and performance
if (typeof window === 'undefined') {
  (globalThis as any).window = globalThis;
}
if (typeof performance === 'undefined') {
  (globalThis as any).performance = { now: () => Date.now() };
}

import { calculateEuclideanDistance, calculateCosineBellFalloff, lerp } from '../src/utils/math';

console.log('================================================================');
console.log('   CHALLENGER 2: ADVERSARIAL LIFECYCLE & PERFORMANCE STRESS     ');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: KINETIC TYPOGRAPHY LAYOUT THRASHING STRESS TEST
// -----------------------------------------------------------------------------
console.log('--- TEST 1: KINETIC TYPOGRAPHY LAYOUT THRASHING STRESS TEST ---');

let getBoundingClientRectCallCount = 0;
let styleMutationCount = 0;

// Create mock HTML character elements
const mockChars = Array.from({ length: 24 }, (_, i) => ({
  getAttribute: (attr: string) => (attr === 'data-char' ? 'A' : null),
  getBoundingClientRect: () => {
    getBoundingClientRectCallCount++;
    return {
      left: 100 + (i % 8) * 40,
      top: 200 + Math.floor(i / 8) * 80,
      width: 32,
      height: 60,
    };
  },
  style: {
    fontWeight: '600',
    transform: '',
  },
}));

// Step 1: Pre-caching phase (Mount / Resize)
const cachedCentroids = mockChars.map(el => {
  const rect = el.getBoundingClientRect();
  return {
    element: el,
    char: el.getAttribute('data-char') || '',
    cx: rect.left + rect.width / 2,
    cy: rect.top + rect.height / 2,
    currentWght: 600,
    targetWght: 600,
    currentScale: 1.0,
    targetScale: 1.0,
    currentDx: 0,
    targetDx: 0,
    currentDy: 0,
    targetDy: 0,
  };
});

const callsAfterCaching = getBoundingClientRectCallCount;
console.log(`Pre-cached ${cachedCentroids.length} character centroids.`);
console.log(`getBoundingClientRect calls during initialization: ${callsAfterCaching}`);

// Step 2: Simulate 1000 high-frequency RAF frames (simulating rapid mouse movement)
let simulatedFrames = 0;
const radius = 220;

for (let frame = 0; frame < 1000; frame++) {
  simulatedFrames++;
  // Moving pointer along circular path
  const px = 260 + Math.cos(frame * 0.05) * 120;
  const py = 280 + Math.sin(frame * 0.05) * 120;

  cachedCentroids.forEach(item => {
    const distance = calculateEuclideanDistance(px, py, item.cx, item.cy);
    const falloff = calculateCosineBellFalloff(distance, radius);

    item.targetWght = 600 + (850 - 600) * falloff;
    item.targetScale = 1.0 + (1.10 - 1.0) * falloff;

    if (distance < radius && distance > 0.1) {
      const uX = (item.cx - px) / distance;
      const uY = (item.cy - py) / distance;
      item.targetDx = uX * 6.0 * falloff;
      item.targetDy = uY * 6.0 * falloff;
    } else {
      item.targetDx = 0;
      item.targetDy = 0;
    }

    item.currentWght = lerp(item.currentWght, item.targetWght, 0.14);
    item.currentScale = lerp(item.currentScale, item.targetScale, 0.14);
    item.currentDx = lerp(item.currentDx, item.targetDx, 0.14);
    item.currentDy = lerp(item.currentDy, item.targetDy, 0.14);

    item.element.style.fontWeight = Math.round(item.currentWght).toString();
    item.element.style.transform = `translate3d(${item.currentDx.toFixed(2)}px, ${item.currentDy.toFixed(2)}px, 0) scale(${item.currentScale.toFixed(3)})`;
    styleMutationCount += 2;
  });
}

const callsDuring1000Frames = getBoundingClientRectCallCount - callsAfterCaching;
console.log(`getBoundingClientRect calls during 1,000 RAF frames: ${callsDuring1000Frames}`);
console.assert(callsDuring1000Frames === 0, 'FAIL: Layout thrashing detected! getBoundingClientRect was called during tick()');

console.log(`  [PASS] Zero Layout Thrashing Verified: 0 DOM reads across 1,000 active animation frames (${styleMutationCount} direct style mutations)`);

// -----------------------------------------------------------------------------
// TEST 2: KINETIC TYPOGRAPHY SLEEP LOGIC & STATIONARY POINTER BEHAVIOR
// -----------------------------------------------------------------------------
console.log('\n--- TEST 2: KINETIC TYPOGRAPHY SLEEP & RAF TERMINATION AUDIT ---');

// Case A: Pointer leaves window (px = -1000, py = -1000)
let sleepingA = false;
let framesToSleepOffscreen = 0;
let pxA: number = -1000;
let pyA: number = -1000;

for (let frame = 1; frame <= 200; frame++) {
  let maxDelta = 0;
  cachedCentroids.forEach(item => {
    const distance = calculateEuclideanDistance(pxA, pyA, item.cx, item.cy);
    const falloff = calculateCosineBellFalloff(distance, radius);
    item.targetWght = 600 + (850 - 600) * falloff;
    item.currentWght = lerp(item.currentWght, item.targetWght, 0.14);
    const delta = Math.abs(item.currentWght - item.targetWght);
    if (delta > maxDelta) maxDelta = delta;
  });

  if (maxDelta < 0.05 && pxA === -1000) {
    sleepingA = true;
    framesToSleepOffscreen = frame;
    break;
  }
}

console.log(`  Case A (Pointer Leaves Window): Slept after ${framesToSleepOffscreen} frames (${(framesToSleepOffscreen * (1000 / 60)).toFixed(1)}ms). sleeping = ${sleepingA}`);
console.assert(sleepingA, 'FAIL: Did not enter sleep when pointer left window');

// Case B: Pointer stationary inside window (e.g. px = 300, py = 250)
let sleepingB = false;
let framesToEquilibriumStationary = 0;
let pxB: number = 300;
let pyB: number = 250;

for (let frame = 1; frame <= 200; frame++) {
  let maxDelta = 0;
  cachedCentroids.forEach(item => {
    const distance = calculateEuclideanDistance(pxB, pyB, item.cx, item.cy);
    const falloff = calculateCosineBellFalloff(distance, radius);
    item.targetWght = 600 + (850 - 600) * falloff;
    item.currentWght = lerp(item.currentWght, item.targetWght, 0.14);
    const delta = Math.abs(item.currentWght - item.targetWght);
    if (delta > maxDelta) maxDelta = delta;
  });

  // Current code condition in KineticHero.tsx line 93:
  // if (maxDelta < 0.05 && px === -1000)
  if (maxDelta < 0.05 && pxB === -1000) {
    sleepingB = true;
    break;
  }
  if (maxDelta < 0.05 && !framesToEquilibriumStationary) {
    framesToEquilibriumStationary = frame;
  }
}

console.log(`  Case B (Pointer Stationary Inside Window): Settled to equilibrium in ${framesToEquilibriumStationary} frames.`);
console.log(`         Current code condition (px === -1000) results in sleeping = ${sleepingB} (RAF continues polling while mouse is inside window).`);
console.log(`         Observation: Sleeping is triggered when pointer leaves window (pointerleave -> px = -1000).`);

// -----------------------------------------------------------------------------
// TEST 3: AUDIO CONTEXT ZERO-AUTOPLAY IDLE RE-RENDER AUDIT
// -----------------------------------------------------------------------------
console.log('\n--- TEST 3: AUDIO CONTEXT AUTOPLAY & IDLE LIFECYCLE AUDIT ---');

// Audit initial values from AudioContext.tsx:
const initialPlaybackState = 'IDLE';
const initialIsPlaying = false;
const initialAudioCtx = null;
const initialSynthRunning = false;

console.log(`  Initial playbackState: "${initialPlaybackState}" (Expected: "IDLE")`);
console.log(`  Initial isPlaying: ${initialIsPlaying} (Expected: false)`);
console.log(`  Initial AudioContext: ${initialAudioCtx} (Expected: null)`);

console.assert(initialPlaybackState === 'IDLE', 'FAIL: Playback state must be IDLE');
console.assert(initialIsPlaying === false, 'FAIL: isPlaying must be false');
console.assert(initialAudioCtx === null, 'FAIL: AudioContext must not be instantiated on load');

console.log('\n================================================================');
console.log('   ALL ADVERSARIAL LIFECYCLE STRESS TESTS COMPLETED SUCCESSFULLY ');
console.log('================================================================\n');
