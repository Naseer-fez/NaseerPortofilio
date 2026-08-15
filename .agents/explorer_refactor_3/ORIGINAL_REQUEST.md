## 2026-08-15T12:11:09Z
You are Explorer 3 on the macOS Portfolio OS UX & Visual Refactor project.
Working directory: d:/CODE/Html/Showcase/.agents/explorer_refactor_3/
Project root: d:/CODE/Html/Showcase

Read:
- d:/CODE/Html/Showcase/.agents/ORIGINAL_REQUEST.md
- d:/CODE/Html/Showcase/.agents/orchestrator_refactor/plan.md
- d:/CODE/Html/Showcase/.agents/orchestrator_refactor/context.md
- d:/CODE/Html/Showcase/src/components/dock/Dock.tsx
- d:/CODE/Html/Showcase/src/components/dock/DockItem.tsx
- d:/CODE/Html/Showcase/src/components/os/DesktopGrid.tsx
- d:/CODE/Html/Showcase/src/components/os/DesktopIcon.tsx
- d:/CODE/Html/Showcase/src/components/os/TopMenuBar.tsx
- d:/CODE/Html/Showcase/src/lib/constants/apps.ts
- Existing tests in `tests/` directory (e.g. `tests/components/DesktopIcon.test.tsx`, `tests/tier1-features/dock.test.tsx`, etc.)

Investigate and produce a detailed analysis and implementation blueprint in `d:/CODE/Html/Showcase/.agents/explorer_refactor_3/analysis.md` and `d:/CODE/Html/Showcase/.agents/explorer_refactor_3/handoff.md` covering:
1. macOS-Style Squircle SVG Icons Overhaul:
   - Dedicated SVG icon components for 6 core apps: Terminal, Projects, About, Finder, Settings, Mail.
   - Visual styling: Continuous squircle curve (Superellipse / rounded-2xl), multi-stop gradients, subtle drop shadows, inner border glow, rich iconography with depth.
2. Desktop Interaction Update:
   - Change desktop icon opening behavior from double-click (`onDoubleClick`) to single-click (`onClick`), while preserving selection marquee and selection state.
3. Parabolic Dock Fisheye Magnification & Idle Breathing:
   - Implementation of exact fisheye magnification hover effect:
     - Hovered icon scales 1.8x - 2.2x.
     - Immediate neighbor icons scale ~0.7x (relative step / calculated curve).
     - Next neighbor icons scale ~0.85x.
   - Idle breathing animation for all dock icons when dock is not hovered (gentle, rhythmic y-float or scale pulse at 60fps).
4. Core System Updates:
   - Replace top menu bar Apple logo with a swappable SVG icon component (`src/components/icons/AppleLogo.tsx` or similar).
   - Central icon configuration system in `src/config/apps.ts` or `src/config/icons.ts`.
5. Comprehensive Test Audit & New Test Suite Design:
   - Identify all existing tests in `tests/` that assert `onDoubleClick` or old dock/audio components and need updates.
   - Design new tests for squircle icon rendering, single-click desktop launch, dock fisheye scale factors, and idle breathing state.

Write your report to `d:/CODE/Html/Showcase/.agents/explorer_refactor_3/handoff.md` and send a completion message back to orchestrator.
