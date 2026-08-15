# Scope: Milestone 4 — Michal Kinetic Typography & Custom Cursor

## Objective
Implement layer 0 kinetic typography background driven by physics equations and custom dual-tier cursor:
1. `KineticHeroStage` (Layer 0, z-0, 100vw × 100vh, workspace mode 0.35 opacity, ambient mode 1.0 opacity).
2. `SplitText` & `PhysicsEngine`:
   - Per-character `<span>` elements with `will-change: transform`.
   - Semi-implicit Euler integration:
     `a = (-k(x - x0) - c·v + F_cursor) / m`
     `v += a · dt`, `x += v · dt` with k=280, c=24, m=1.0 (underdamped ζ ≈ 0.717).
   - Gaussian cursor force falloff: `α(d) = exp(-d² / 2σ²)`, R=260px, σ ≈ 104px.
   - Variable font modulation: Inter Variable (`font-weight` 400→900, `font-stretch` 100→125%, `font-style` slant -15°→+15°).
3. `AmbientHarmonicWave`:
   - Idle text oscillation: `dx = A · sin(2π·f·t + phase_i)`, A=2-4px, f=0.5-1Hz.
4. `KineticCursor`:
   - `CursorPrecisionDot`: 4px zero-lag white dot.
   - `CursorAuraRing`: 24-80px difference-blend ring (`mix-blend-mode: difference`), lerp follow (λ=0.15 at 60Hz), velocity EMA (β=0.75).
5. `CursorStateMachine`:
   - Context-aware FSM reading `data-cursor` attributes: `'kinetic-hero'`, `'precision-drag'`, `'magnetic-dock'`, `'disabled'`.
   - Magnetic dock snapping with squircle morphing (`spring(stiffness: 500, damping: 28)`).

## Specifications to Follow
- `d:\CODE\Html\Showcase\portfolio_research\phase2\PHASE_2_MASTER_SPEC.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\research\michal-interaction-analysis.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\design\motion-system.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\implementation\implementation-spec.md` (Sprint 4)
