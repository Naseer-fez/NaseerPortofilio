# Scope: E2E Testing Track

## Architecture & Strategy
- **Framework**: Vitest (for blazing fast in-memory execution and component level contract testing) + Playwright (for full browser end-to-end user journey validation) + React Testing Library + `@testing-library/jest-dom` + Web Audio API mock / canvas mock
- **Philosophy**: Opaque-box, requirement-driven, derived strictly from `PROJECT.md`, `PHASE_2_MASTER_SPEC.md`, `portfolio_research/phase2/qa/visual-reference-matrix.md` (64 visual criteria), and `portfolio_research/phase2/qa/interaction-validation-matrix.md` (90 interaction test cases).
- **Directory Layout**:
  - `tests/setup.ts` (Global test setup, mocks for Web Audio API, Canvas, ResizeObserver, MatchMedia)
  - `tests/fixtures/` (Test assets, playlist mock data, wallpaper fixtures, mock app descriptors)
  - `tests/helpers/` (Test utilities, event dispatchers, drag simulation, audio event interceptors, custom assertions)
  - `tests/tier1-features/` (Isolated feature coverage: desktop, windows, dock, music player, cursor, kinetic typography, shortcuts, mobile)
  - `tests/tier2-boundaries/` (Edge cases, coordinate limits, audio interruption, minimum window sizes, overflow handling)
  - `tests/tier3-cross-feature/` (Pairwise feature interactions: drag + music playback, dock zoom + window minimize, ambient mode transitions, spotlight + multi-window)
  - `tests/tier4-scenarios/` (Full realistic user workflows: terminal command execution, audio deck flow, window tiling & cascade, responsive bottom sheet transition)
  - `tests/visual-conformance/` (Automated visual matrix rule checks against 64 criteria)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E-M1 | Test Infrastructure Setup | Vitest config, setup.ts, mocks (AudioContext, AnalyserNode, Canvas, ResizeObserver), helper libraries, npm test scripts | none | IN_PROGRESS |
| E2E-M2 | Tier 1 Feature Coverage Suite | 90 interaction test cases mapped to isolated feature tests + 64 visual rule tests | E2E-M1 | PLANNED |
| E2E-M3 | Tier 2 Boundary & Negative Suite | Boundary value analysis, drag clamping, resize constraints, extreme coordinates, rapid toggling, audio edge cases | E2E-M1 | PLANNED |
| E2E-M4 | Tier 3 Cross-Feature Interaction Suite | Pairwise combinatorial testing across window, audio, dock, typography, mobile, and shortcut systems | E2E-M2, E2E-M3 | PLANNED |
| E2E-M5 | Tier 4 Application Scenarios & Sign-Off | Real-world multi-step user workflows, `TEST_INFRA.md`, and `TEST_READY.md` publication | E2E-M1..E2E-M4 | PLANNED |

## Interface Contracts & Test Runner Semantics
- `npm test`: Runs full Vitest suite across all tiers with verbose reporter and pass/fail exit codes.
- `npm run test:e2e`: Runs E2E scenario suites.
- `npm run test:coverage`: Generates full coverage report.
