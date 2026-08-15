## 2026-08-15T09:13:24Z

You are Worker 1 for the E2E Testing Track of the macOS-style portfolio desktop showcase.

Your working directory is: d:\CODE\Html\Showcase\.agents\sub_orch_e2e\worker_1\

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
Review the comprehensive architecture and specifications created by the 3 Explorers:
- `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_1\analysis.md` (Test Infrastructure, Vitest Config, Mocks & Test Helpers)
- `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_2\analysis.md` (Tier 1 Mapping: all 90 interaction test cases and 64 visual reference criteria)
- `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_3\analysis.md` (Tier 2 Boundaries, Tier 3 Cross-Feature, Tier 4 Scenarios, `TEST_INFRA.md` & `TEST_READY.md` blueprints)
- `d:\CODE\Html\Showcase\PROJECT.md`
- `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\SCOPE.md`

## Your Task
1. Implement the complete test infrastructure:
   - `vitest.config.ts` with React plugin, jsdom environment, setupFiles, path aliases (`@/` -> `src/`), coverage config.
   - `tests/setup.ts` with complete browser API mocks (Web Audio API: `AudioContext`, `AnalyserNode`, `GainNode`, `MediaElementAudioSourceNode`, `HTMLAudioElement`, `HTMLCanvasElement.getContext('2d')`, `ResizeObserver`, `matchMedia`, `IntersectionObserver`, `PointerEvent`, `MediaSession`, `requestAnimationFrame`/`cancelAnimationFrame`).
   - `tests/fixtures/` (mock playlists, wallpapers, app registry).
   - `tests/helpers/` (event simulation: `simulateDrag`, `simulateMarquee`, `simulateResizeHandle`, `simulateAudioPlayback`, `simulateKeyboardShortcut`, `simulateMobileSwipe`, custom assertions / matchers).

2. Implement the comprehensive test suites across all tiers:
   - **Tier 1 (Feature Coverage & Visual Conformance)**:
     - `tests/tier1-features/desktop.test.tsx` (Interactions #1-7, Visual #6-9)
     - `tests/tier1-features/windows.test.tsx` (Interactions #8-24, Visual #10-23)
     - `tests/tier1-features/dock.test.tsx` (Interactions #25-36, Visual #24-34)
     - `tests/tier1-features/music.test.tsx` (Interactions #37-53, Visual #35-45)
     - `tests/tier1-features/typography.test.tsx` (Interactions #61-68, Visual #46-52)
     - `tests/tier1-features/cursor.test.tsx` (Interactions #54-60, Visual #53-58)
     - `tests/tier1-features/shortcuts.test.tsx` (Interactions #69-74)
     - `tests/tier1-features/mobile.test.tsx` (Interactions #75-84, Visual #60-64)
     - `tests/tier1-features/audio-ducking.test.tsx` (Interactions #85-86)
     - `tests/tier1-features/persistence.test.tsx` (Interactions #87-90, Visual #59)
     - `tests/visual-conformance/chrome.test.tsx` (Visual #1-5)
   - **Tier 2 (Boundary & Negative Testing)**:
     - `tests/tier2-boundaries/geometry-bounds.test.tsx`
     - `tests/tier2-boundaries/audio-edge-cases.test.tsx`
     - `tests/tier2-boundaries/concurrency-races.test.tsx`
     - `tests/tier2-boundaries/pointer-viewport.test.tsx`
   - **Tier 3 (Cross-Feature Combinations)**:
     - `tests/tier3-cross-feature/cross-feature.test.tsx`
   - **Tier 4 (Real-World Application Scenarios)**:
     - `tests/tier4-scenarios/user-workflows.test.tsx`

3. Create Root Documents:
   - `d:\CODE\Html\Showcase\TEST_INFRA.md` (Detailed specification of the test runner, mock architecture, feature inventory, methodology, and commands).
   - `d:\CODE\Html\Showcase\TEST_READY.md` (Formal declaration that the E2E test suite is ready, summarizing test counts per tier, feature checklist, and verification instructions).

4. Run the test suite and verify execution:
   - Run tests using `run_command` with `npx vitest run` or equivalent.
   - Ensure tests are structured cleanly so when components are mounted they validate contracts properly or test isolated modules/stores/helpers cleanly.
   - Document commands, test counts, and results in `changes.md` and `handoff.md`.
