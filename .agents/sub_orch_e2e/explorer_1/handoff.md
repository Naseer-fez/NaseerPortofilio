# E2E Test Infrastructure Architecture & Runner - Handoff Report

**Agent**: Explorer 1 (E2E Test Infrastructure Architect)  
**Recipient**: Sub-Orchestrator E2E (`sub_orch_e2e`) / Main Agent  
**Date**: 2026-08-15  
**Deliverable**: Complete Test Runner & Infrastructure Architecture Design  

---

## 1. Observation

Direct observations from the codebase and Phase 2 specification documents:

1. **Test Scope & Contracts**:
   - `d:\CODE\Html\Showcase\PROJECT.md:11` specifies: `Vitest + React Testing Library / Playwright for E2E testing`.
   - `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\SCOPE.md:6-15` defines directory layout: `tests/setup.ts`, `tests/fixtures/`, `tests/helpers/`, `tests/tier1-features/`, `tests/tier2-boundaries/`, `tests/tier3-cross-feature/`, `tests/tier4-scenarios/`, and `tests/visual-conformance/`.
   - `d:\CODE\Html\Showcase\portfolio_research\phase2\PHASE_2_MASTER_SPEC.md:290-298` establishes the dual QA requirements: 64 visual criteria (`visual-reference-matrix.md`) and 90 functional test cases (`interaction-validation-matrix.md`).

2. **Audio Pipeline & Ducking Requirements**:
   - `PHASE_2_MASTER_SPEC.md:52-56` and `portfolio_research/phase2/research/nidal-player-analysis.md:238-245` specify exact audio ducking behavior: procedural UI audio triggers automatic ducking of music track to 20% over 40ms ($\tau_{duck} = 0.040s$), restoring over 250ms ($\tau_{restore} = 0.250s$).
   - `PHASE_2_MASTER_SPEC.md:207, 328` mandates: `Audio must not auto-start — AudioContext created inside user gesture handler only`.

3. **Motion, Physics & Visual Contracts**:
   - `portfolio_research/phase2/design/motion-system.md:92` defines the Luca dock proximity magnification: Cosine Bell formula $W(d) = 44 + 24 \cdot (1 + \cos(\pi d / 150)) / 2$ for $d \le 150px$.
   - `portfolio_research/phase2/research/michal-interaction-analysis.md:84-95` specifies kinetic typography physics: second-order spring-mass-damper ODE ($m=1.0, k=280, c=24, \zeta \approx 0.717$), Semi-implicit Euler integration.
   - `portfolio_research/phase2/design/visual-system.md:81-98` specifies window bounds clamping: title bar $y \ge 28$, minimum size $360 \times 240px$, minimum visible overhang $100px$.
   - `portfolio_research/phase2/design/responsive-system.md:18` defines critical threshold at `768px` (desktop floating windows vs mobile 92vh bottom sheets).

---

## 2. Logic Chain

1. **Step 1 (Runner Strategy)**: Because the test suite must execute all 90 interaction test cases and 64 visual rules with rapid feedback (<5s) in CI and development, an in-memory Vitest runner with `jsdom` environment is required for component and store contracts.
2. **Step 2 (Mocking Completeness)**: Standard `jsdom` lacks implementations for `AudioContext`, `HTMLAudioElement.play()`, `CanvasRenderingContext2D`, `ResizeObserver`, `matchMedia`, `IntersectionObserver`, `PointerEvent.setPointerCapture`, `navigator.mediaSession`, and `DeviceOrientationEvent`. Without custom, high-fidelity mocks for each of these APIs, the OS desktop, audio engine, canvas visualizer, dock magnification, and mobile responsive sheets will fail to execute or verify.
3. **Step 3 (Audio Ducking Simulation)**: To verify rule #85 (`Music duck on UI sound`), `MockAudioParam` must track scheduled automation events (`setTargetAtTime` and `setValueAtTime`), and `MockAudioContext` must support `createGain()`, `createAnalyser()`, and `createMediaElementSource()`.
4. **Step 4 (Test Helpers & Custom Matchers)**: Realistic simulation of user interactions (drag, marquee, resize handles, keyboard shortcuts, mobile swipes) requires dedicated helper dispatchers in `tests/helpers/`. Custom assertions (`toBeClampedWithinViewport`, `toMatchGlassmorphism`, `toHaveDockMagnification`, `toHaveDuckedVolume`, `toBeInZIndexRange`) abstract complex DOM and style calculations into declarative, fail-fast test assertions.
5. **Step 5 (Architecture Synthesis)**: The resulting test infrastructure documented in `analysis.md` provides complete coverage of all functional and visual requirements with zero external runtime dependencies.

---

## 3. Caveats

- **WebGL / 3D Canvas**: The current mock focuses on `CanvasRenderingContext2D` (used for the audio FFT visualizer and particle canvas). If 3D WebGL rendering is introduced in later phases, `webgl` context mocking will need to be added to `Canvas2DMock.ts`.
- **True Cross-Browser Pixel Rasterization**: Vitest in `jsdom` tests DOM elements, computed styles, CSS variables, and layout event geometry. Pixel-perfect rasterization diffing across physical GPU rendering engines (e.g. WebKit vs Chromium font rasterization) should be complemented by Playwright in Milestone 6 if visual regression screenshots are required.
- **No caveats** regarding core OS state, windowing, audio pipeline, dock physics, or responsive sheet testing.

---

## 4. Conclusion

The test infrastructure architecture and runner design is complete, fully specified, and ready for worker implementation:
1. `vitest.config.ts` configured for `jsdom`, alias `@/*` resolution, and v8 coverage.
2. `tests/setup.ts` and 10 high-fidelity browser API mocks designed.
3. Comprehensive test helper suite (`simulateDrag`, `simulateMarquee`, `simulateResizeHandle`, `simulateKeyboardShortcut`, `simulateMobileSwipe`, `simulateAudioPlayback`) designed.
4. Custom Vitest matchers designed for glassmorphism, z-index hierarchy, window bounds clamping, dock magnification, and audio ducking.
5. Directory layout and npm scripts established for Tier 1-4 suites and visual conformance tests.

Detailed specification is published at:
`d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_1\analysis.md`

---

## 5. Verification Method

1. **File Inspection**:
   - Inspect `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_1\analysis.md` for full implementation code and type signatures.
   - Verify all 90 interaction cases from `portfolio_research/phase2/qa/interaction-validation-matrix.md` and 64 visual rules from `portfolio_research/phase2/qa/visual-reference-matrix.md` have corresponding runner and mock capabilities.
2. **Implementation Verification**:
   - When workers implement `vitest.config.ts`, `tests/setup.ts`, `tests/mocks/`, and `tests/helpers/`, verify with:
     ```bash
     npx vitest --run
     ```
   - Verify 0 unhandled browser API errors (e.g. `AudioContext is not defined`, `ResizeObserver is not defined`, `matchMedia is not a function`).
