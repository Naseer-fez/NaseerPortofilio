# Original User Request

## 2026-08-15T07:29:23Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Wait for the teamwork system to execute the prompt

Deeply inspect, scrape, and reverse-engineer four reference websites to document their structure, visuals, assets, and animations for an OS-style portfolio, producing comprehensive documentation artifacts without writing any production application code.

Working directory: d:\CODE\Html\test
Integrity mode: benchmark

## Requirements

### R1. Document Base OS Website (irfannaikwade.in)
Reverse-engineer the desktop environment, window system, navigation, and mobile layout. Document structure, visuals, assets, animations, and interactions. *Execution Note: Use 2 agents for better accuracy.*

### R2. Document Taskbar Reference (luca-felix.com)
Reverse-engineer the animated taskbar/navigation behavior, measuring dimensions, spacing, hover states, cursor proximity scaling, and animation timing.

### R3. Document Home Screen Reference (michalgrzebisz.com)
Reverse-engineer the home-screen visual treatment and cursor-proximity text interaction, including cursor position mapping and influence radius.

### R4. Document Music Player Reference (nidal.dev)
Reverse-engineer the music-player widget, documenting size, hierarchy, playback controls, and audio behavior (no autoplay).

### R5. Cross-Site Research & Design Constraints
Perform responsive testing across 8 specific breakpoints. Identify technical stack, performance metrics, and source code behavior. Locate and follow the provided `design.md` (already in the workspace) as a strict constraint, documenting any conflicts and resolutions.

### R6. Deliverables & Handoff
Create a `research/` directory containing site-specific folders with `structure.md`, `interactions.md`, `animations.md`, `responsive.md`, `assets.md`, and `screenshots/`. Generate a `component-map.md`, `conflicts.md`, and a final `research-summary.md` answering the 7 handoff questions.

## Acceptance Criteria

### Directory and Artifact Structure
- [ ] The `research/` directory exists and contains subdirectories: `base-irfan`, `luca-felix`, `michal-grzebisz`, `nidal`.
- [ ] Each subdirectory contains non-empty markdown files for the requested categories (e.g., `structure.md`, `animations.md`).
- [ ] `research/component-map.md` exists and lists Source, Component, Role, Behavior, and Fidelity.
- [ ] `research/conflicts.md` exists and details conflicts with `design.md` or cross-site issues.
- [ ] `research/research-summary.md` exists and explicitly answers the 7 required handoff questions.

### Execution Constraints
- [ ] No production application code (e.g., React components, final HTML/CSS layouts) has been written.
- [ ] All measurements and discoveries are classified as CONFIRMED, INFERRED, ESTIMATED, or UNKNOWN.

---
*Next: resolve ambiguities → finalize prompt → delegate via invoke_subagent*

## 2026-08-15T09:09:40Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Build a high-performance OS-style web portfolio combining a multi-window desktop manager, proximity-scaling dock, kinetic typography hero, and a floating music player, strictly adhering to an Apple-inspired design system.

Working directory: d:/CODE/Html/test/os_portfolio
Integrity mode: benchmark

## Requirements

### R1. Base OS Shell & Window Management (React + Vite)
Build a React application that implements a virtual desktop environment (from irfannaikwade.in). It must include a top menu bar and a window manager supporting draggable, resizable windows with z-index focus promotion and macOS-style traffic light controls. The mock apps inside only need to be visual shells.

### R2. Proximity-Scaling Taskbar
Implement a floating dock (from luca-felix.com) with mathematical proximity scaling based on cursor distance.

### R3. Kinetic Typography Home Screen
Recreate a full-bleed hero canvas (from michalgrzebisz.com) featuring pointer-tracked variable font weight deformation.

### R4. Floating Music Player Widget
Build a dual-state music player widget (from nidal.dev) that toggles between a compact capsule and an expanded popover. It must strictly require a user gesture to initiate playback.

## Acceptance Criteria

### Build & Structure
- [ ] `npm run build` completes without errors.
- [ ] The application is built using React and Vite.

### OS & Window Management
- [ ] The desktop includes at least two mock windows that can be opened simultaneously.
- [ ] Windows can be dragged around the viewport via their header.
- [ ] Clicking an inactive window brings it to the front (highest z-index).

### Integrated Interactions
- [ ] Taskbar icons dynamically scale up when the cursor hovers near them.
- [ ] The kinetic typography hero text visually responds (e.g. changes font weight) when the pointer moves across it.
- [ ] The music player does not auto-play on page load; playback only starts after explicit user interaction.

