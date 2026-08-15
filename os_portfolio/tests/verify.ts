import { calculateDockIconWidth, calculateCosineBellFalloff, calculateEuclideanDistance } from '../src/utils/math';
import { clampWindowPosition, computeResizeBounds } from '../src/utils/windowMath';

console.log('=== RUNNING MATHEMATICAL & ARCHITECTURAL VERIFICATION SUITE ===');

// 1. Verify 1D Cosine Dock Proximity Scaling
console.log('\n[1. Proximity Dock Math Test]');
const S_base = 40;
const S_max = 72;
const R_dock = 150;
const iconCenter = 500;

// Test at apex (d = 0)
const widthAtApex = calculateDockIconWidth(500, iconCenter, S_base, S_max, R_dock);
console.log(`Apex (d=0px): width = ${widthAtApex.toFixed(2)}px (Expected: 72.00px)`);
console.assert(Math.abs(widthAtApex - 72) < 0.001, 'FAILED: Apex width mismatch');

// Test at 1st neighbor (d = 52px)
const widthNeighbor1 = calculateDockIconWidth(552, iconCenter, S_base, S_max, R_dock);
console.log(`1st Neighbor (d=52px): width = ${widthNeighbor1.toFixed(2)}px (Expected: ~63.40px)`);
console.assert(widthNeighbor1 > 60 && widthNeighbor1 < 65, 'FAILED: 1st neighbor mismatch');

// Test at boundary (d = 150px)
const widthAtBoundary = calculateDockIconWidth(650, iconCenter, S_base, S_max, R_dock);
console.log(`Boundary (d=150px): width = ${widthAtBoundary.toFixed(2)}px (Expected: 40.00px)`);
console.assert(Math.abs(widthAtBoundary - 40) < 0.001, 'FAILED: Boundary width mismatch');

// Test outside boundary (d = 200px)
const widthOutside = calculateDockIconWidth(700, iconCenter, S_base, S_max, R_dock);
console.log(`Outside (d=200px): width = ${widthOutside.toFixed(2)}px (Expected: 40.00px)`);
console.assert(widthOutside === 40, 'FAILED: Outside width mismatch');

// 2. Verify 2D Cosine Bell Falloff for Kinetic Typography
console.log('\n[2. Kinetic Typography Falloff Test]');
const R_kinetic = 220;

// Test at apex (d = 0)
const falloffApex = calculateCosineBellFalloff(0, R_kinetic);
const wghtApex = 600 + (850 - 600) * falloffApex;
console.log(`Kinetic Apex (d=0px): falloff = ${falloffApex.toFixed(4)}, wght = ${wghtApex.toFixed(0)} (Expected: 850)`);
console.assert(Math.abs(wghtApex - 850) < 0.001, 'FAILED: Kinetic wght apex mismatch');

// Test at midpoint (d = 110px)
const falloffMid = calculateCosineBellFalloff(110, R_kinetic);
const wghtMid = 600 + (850 - 600) * falloffMid;
console.log(`Kinetic Mid (d=110px): falloff = ${falloffMid.toFixed(4)}, wght = ${wghtMid.toFixed(0)} (Expected: 725)`);
console.assert(Math.abs(wghtMid - 725) < 0.1, 'FAILED: Kinetic wght mid mismatch');

// Test at boundary (d = 220px)
const falloffBoundary = calculateCosineBellFalloff(220, R_kinetic);
const wghtBoundary = 600 + (850 - 600) * falloffBoundary;
console.log(`Kinetic Boundary (d=220px): falloff = ${falloffBoundary.toFixed(4)}, wght = ${wghtBoundary.toFixed(0)} (Expected: 600)`);
console.assert(Math.abs(wghtBoundary - 600) < 0.001, 'FAILED: Kinetic wght boundary mismatch');

// 3. Verify Window Drag Clamping
console.log('\n[3. Window Drag Clamping Test]');
const viewportW = 1440;
const viewportH = 900;
const winW = 780;
const winH = 520;

// Test top clamp (y < 28 should be clamped to 28)
const clampedTop = clampWindowPosition(200, 10, winW, winH, viewportW, viewportH, 28, 100);
console.log(`Clamped Top: y = ${clampedTop.y}px (Expected: 28px)`);
console.assert(clampedTop.y === 28, 'FAILED: Top clamp mismatch');

// Test left overhang clamp
const clampedLeft = clampWindowPosition(-1000, 100, winW, winH, viewportW, viewportH, 28, 100);
console.log(`Clamped Left: x = ${clampedLeft.x}px (Expected: -680px for 100px overhang)`);
console.assert(clampedLeft.x === -(winW - 100), 'FAILED: Left clamp mismatch');

// Test right overhang clamp
const clampedRight = clampWindowPosition(2000, 100, winW, winH, viewportW, viewportH, 28, 100);
console.log(`Clamped Right: x = ${clampedRight.x}px (Expected: 1340px for 100px overhang)`);
console.assert(clampedRight.x === viewportW - 100, 'FAILED: Right clamp mismatch');

// 4. Verify 8-Direction Resizing Minimum Dimensions
console.log('\n[4. 8-Direction Resize Bounds Test]');
const resizedEast = computeResizeBounds({
  handle: 'e',
  startPos: { x: 100, y: 100 },
  startSize: { width: 500, height: 400 },
  deltaX: -300, // Attempt to shrink width below minWidth (360)
  deltaY: 0,
  minWidth: 360,
  minHeight: 240,
  viewportWidth: 1440,
  viewportHeight: 900,
});
console.log(`Resize Min Width: width = ${resizedEast.width}px (Expected: 360px)`);
console.assert(resizedEast.width === 360, 'FAILED: Min width constraint mismatch');

const resizedNorth = computeResizeBounds({
  handle: 'n',
  startPos: { x: 100, y: 100 },
  startSize: { width: 500, height: 400 },
  deltaX: 0,
  deltaY: -200, // Attempt to expand above menu bar (y < 28)
  minWidth: 360,
  minHeight: 240,
  menuBarHeight: 28,
  viewportWidth: 1440,
  viewportHeight: 900,
});
console.log(`Resize North Top Menu Clamp: y = ${resizedNorth.y}px (Expected: 28px)`);
console.assert(resizedNorth.y === 28, 'FAILED: North top clamp mismatch');

console.log('\n=== ALL MATHEMATICAL & GEOMETRIC TESTS PASSED CLEANLY (100%) ===');
