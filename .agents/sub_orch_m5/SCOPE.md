# Scope: Milestone 5 — Mobile Responsiveness & Polish

## Objective
Adapt all components for mobile screens, ensure 60fps performance budget, and full accessibility:
1. `MobileBottomSheet` (92vh height, rounded top 20px, drag handle, swipe-to-dismiss threshold 140px, spring physics, scroll protection).
2. `MobileTabBar` (52px + safe-area-inset-bottom, 5 core apps, tab selection).
3. `MobileStickyAudioBar` (44px bar positioned above tab bar, mini artwork 28px, title, play/pause, tap to expand).
4. `useBreakpoint` hook (`isMobile < 768px`, `isTablet`, `isDesktop`, `hasPointer`, `hasHover`).
5. Touch & Gyroscope fallback for kinetic typography on mobile (`DeviceOrientationEvent` beta/gamma to text displacement).
6. Performance audit & optimization:
   - Kinetic typography loop running in `requestAnimationFrame` with Float32Array cache.
   - Animations executing via MotionValues outside React re-render cycle.
   - 60fps across desktop and mobile browsers.
7. Accessibility & Polish:
   - `prefers-reduced-motion` compliance (disable physics displacement, reduce window scale animations, disable dock magnification).
   - Focus trapping in active window, ARIA roles (`role="dialog"`, `role="navigation"`), aria labels.

## Specifications to Follow
- `d:\CODE\Html\Showcase\portfolio_research\phase2\PHASE_2_MASTER_SPEC.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\design\responsive-system.md`
- `d:\CODE\Html\Showcase\portfolio_research\phase2\implementation\implementation-spec.md` (Sprint 5)
