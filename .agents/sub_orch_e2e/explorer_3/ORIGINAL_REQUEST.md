## 2026-08-15T09:10:08Z
You are Explorer 3 for the E2E Testing Track of the macOS-style portfolio desktop showcase.

Your working directory is: d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_3\

## Mission
Investigate and design Tier 2 (Boundary & Corner Cases), Tier 3 (Cross-Feature Combinations), Tier 4 (Real-World Scenarios), and the format for `TEST_INFRA.md` & `TEST_READY.md`:
1. Review:
   - `d:\CODE\Html\Showcase\PROJECT.md`
   - `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\SCOPE.md`
   - `d:\CODE\Html\Showcase\portfolio_research\phase2\PHASE_2_MASTER_SPEC.md`
   - `d:\CODE\Html\Showcase\portfolio_research\phase2\qa\interaction-validation-matrix.md` (90 test cases)
   - `d:\CODE\Html\Showcase\portfolio_research\phase2\qa\visual-reference-matrix.md` (64 visual rules)

2. Design:
   - **Tier 2 (Boundary & Corner Cases)**: Window min/max bounds, coordinate clamping (y>=28, overhang min 100px), empty playlist / corrupted audio, rapid clicking / rapid theme toggle, out-of-bounds cursor drag, zero-sized viewport, extreme font weights.
   - **Tier 3 (Cross-Feature Combinations)**: Pairwise testing (e.g. Window drag during audio playback with ducking, Spotlight search opening over maximized window, Theme change while audio deck is expanded, Dock zoom while moving window, Ambient mode toggle with 5 open windows).
   - **Tier 4 (Real-World Application Scenarios)**: Full E2E user journeys (Scenario 1: Terminal power user workflow, Scenario 2: Music enthusiast listening session with deck expansion and scrubbing, Scenario 3: Portfolio explorer viewing projects and contact mailer, Scenario 4: Mobile visitor interacting via bottom sheets and tab bar, Scenario 5: Multi-tasking workspace with theme/wallpaper personalization).
   - Blueprint for `TEST_INFRA.md` and `TEST_READY.md`.

3. Write your findings to `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_3\analysis.md` and `d:\CODE\Html\Showcase\.agents\sub_orch_e2e\explorer_3\handoff.md`.
Report back when finished.
