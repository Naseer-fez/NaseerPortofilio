'use client';

import React, { useRef, useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { SplitText } from './SplitText';
import { solveEulerStep, calculateGaussianFalloff, SpringState } from '@/lib/physics/eulerSolver';

interface KineticHeroStageProps {
  heading?: string;
  subheading?: string;
}

export function KineticHeroStage({
  heading = 'CREATIVE DEVELOPER',
  subheading = 'BACKEND & SYSTEMS ARCHITECT',
}: KineticHeroStageProps) {
  const desktopMode = useOSStore(state => state.desktopMode);
  const windows = useOSStore(state => state.windows);
  const stageRef = useRef<HTMLDivElement>(null);

  const charStatesRef = useRef<Map<HTMLElement, { xState: SpringState; yState: SpringState; scaleState: SpringState; origin: { x: number; y: number }; charIndex: number }>>(new Map());
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  // Has any open window
  const hasOpenWindows = Object.values(windows).some(w => w.isOpen && !w.isMinimized);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const charSpans = Array.from(stage.querySelectorAll<HTMLElement>('[data-char]'));
    charStatesRef.current.clear();

    charSpans.forEach((span, idx) => {
      const rect = span.getBoundingClientRect();
      charStatesRef.current.set(span, {
        xState: { x: 0, v: 0 },
        yState: { x: 0, v: 0 },
        scaleState: { x: 1.0, v: 0 },
        origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        charIndex: idx,
      });
    });

    const handlePointerMove = (e: PointerEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handlePointerLeave = () => {
      mousePosRef.current = { x: -1000, y: -1000, active: false };
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);

    let animId: number;
    let time = 0;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      time += 0.016;

      const { x: mouseX, y: mouseY, active } = mousePosRef.current;

      charStatesRef.current.forEach((state, span) => {
        let targetDx = 0;
        let targetDy = 0;
        let targetScale = 1.0;

        if (active) {
          const dist = Math.hypot(mouseX - state.origin.x, mouseY - state.origin.y);
          if (dist < 260 && dist > 0) {
            const force = calculateGaussianFalloff(dist, 260, 100);
            const maxDisplacement = 65;
            const angle = Math.atan2(state.origin.y - mouseY, state.origin.x - mouseX);
            targetDx = Math.cos(angle) * force * maxDisplacement;
            targetDy = Math.sin(angle) * force * maxDisplacement;
            targetScale = 1.0 + force * 0.35;

            // Variable font weight modulation
            const weight = Math.round(400 + force * 500);
            const clampedWeight = Math.max(400, Math.min(900, weight));
            span.style.fontVariationSettings = `'wght' ${clampedWeight}`;
          } else {
            span.style.fontVariationSettings = "'wght' 400";
          }
        } else {
          // Ambient harmonic wave idle oscillation
          const charIndex = state.charIndex;
          targetDy = Math.sin(time * 2 + charIndex * 0.2) * 4;
          span.style.fontVariationSettings = "'wght' 400";
        }

        // Solve Euler physics step
        const curX = state.xState || { x: 0, v: 0 };
        const curY = state.yState || { x: 0, v: 0 };
        const curScale = state.scaleState || { x: 1.0, v: 0 };

        state.xState = solveEulerStep(curX, targetDx, { k: 280, c: 24, m: 1.0 });
        state.yState = solveEulerStep(curY, targetDy, { k: 280, c: 24, m: 1.0 });
        state.scaleState = solveEulerStep(curScale, targetScale, { k: 300, c: 24, m: 1.0 });

        const scaleVal = typeof state.scaleState?.x === 'number' ? state.scaleState.x : 1.0;
        span.style.transform = `translate3d(${state.xState.x.toFixed(2)}px, ${state.yState.x.toFixed(2)}px, 0) scale(${scaleVal.toFixed(3)})`;
      });
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  const isAmbient = desktopMode === 'ambient-hero';
  const stageOpacity = isAmbient ? 1.0 : hasOpenWindows ? 0.35 : 1.0;

  return (
    <div
      ref={stageRef}
      data-testid="kinetic-hero-stage"
      data-cursor="kinetic-hero"
      className="fixed inset-0 z-0 flex flex-col items-center justify-center pointer-events-none select-none transition-opacity duration-500"
      style={{
        opacity: stageOpacity,
      }}
    >
      <div className="text-center px-4 max-w-7xl pointer-events-none">
        <h1
          data-testid="hero-heading"
          className="font-black tracking-tighter uppercase leading-[0.88] text-white/90 pointer-events-none"
          style={{
            fontSize: 'clamp(4.5rem, 14vw + 1rem, 18.5rem)',
            textTransform: 'uppercase',
          }}
        >
          <SplitText text={heading} />
        </h1>

        <p
          data-testid="hero-subheading"
          className="mt-6 text-sm sm:text-base font-semibold tracking-widest uppercase text-white/60 font-mono pointer-events-none"
        >
          {subheading}
        </p>
      </div>
    </div>
  );
}
