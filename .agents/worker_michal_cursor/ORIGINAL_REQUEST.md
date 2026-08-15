# Original Request

## 2026-08-15T07:21:03Z

TARGET WEBSITE: https://www.michalgrzebisz.com/
WORKING DIRECTORY: d:\CODE\Html\Showcase\.agents\worker_michal_cursor
RESEARCH OUTPUT TARGET: d:\CODE\Html\Showcase\portfolio_research\michal_cursor_homescreen_research.md

MISSION:
Deeply inspect, reverse-engineer, and document the Home Screen Layout and Cursor Interaction Mathematical Model of https://www.michalgrzebisz.com/.

KEY AREAS TO INVESTIGATE & DOCUMENT IN DETAIL:
1. Home Screen Layout & Typography System:
   - Hero layout architecture, grid/flex structure, full-bleed viewport handling
   - Giant typography specs: font family, font size (fluid clamp / vw / px), weight, letter-spacing, line-height, text color, blending modes (`mix-blend-mode: difference`, exclusion, etc.)
   - Dynamic text layout: split characters/words/lines, DOM breakdown of animated text spans
2. Cursor Interaction Mathematical & Physical Model:
   - Custom cursor architecture (trailing dot, magnetic ring, custom cursor canvas, lag/lerp follower)
   - Mathematical formulation of cursor-to-text / cursor-to-element interaction:
     * Distance calculation ($d = \sqrt{(x - x_0)^2 + (y - y_0)^2}$)
     * Influence radius ($R$) and falloff curve (inverse square, Gaussian, exponential decay, or linear clamp)
     * Displacement vector calculation ($(\Delta x, \Delta y) = \text{direction} \times \text{magnitude}$)
     * Magnetic attraction / repulsion physics: spring force ($F = -k \cdot x - c \cdot v$), damping coefficient, mass
     * Lerp interpolation equations ($\text{current} = \text{current} + (\text{target} - \text{current}) \times \text{factor}$)
   - Distortion / Warping / Kinetic typography effects: CSS variable binding, SVG displacement filter (`feDisplacementMap`), Canvas 2D / WebGL vertex shaders, or matrix3d transforms
3. Continuous Animation Loop & Event Handling:
   - `requestAnimationFrame` render loop lifecycle, mousemove event listener throttling / passive listeners
   - Velocity tracking: calculating mouse velocity ($\Delta pos / \Delta t$) and using velocity to scale deformation
4. Responsive & Mobile/Touch Fallback:
   - How cursor effects adapt on non-hover / touch devices (pointer: coarse / media hover: none)
   - Touch drag displacement vs gyroscope / device tilt vs subtle continuous idle wave animation
5. Performance & Rendering Budgets:
   - GPU compositing, memory footprint, paint counts, frame-rate stability.
