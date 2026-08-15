import React, { useRef, useEffect } from 'react';
import { SplitText } from './SplitText';
import { solveEulerStep, calculateGaussianFalloff, SpringState } from '@/lib/physics/eulerSolver';

export interface KineticBrandTitleProps {
  text?: string;
  className?: string;
  influenceRadius?: number;
  maxDisplacement?: number;
}

export function KineticBrandTitle({
  text = 'Naseer.dev',
  className = '',
  influenceRadius = 240,
  maxDisplacement = 45,
}: KineticBrandTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charStatesRef = useRef<
    Map<
      HTMLElement,
      {
        xState: SpringState;
        yState: SpringState;
        scaleState: SpringState;
        origin: { x: number; y: number };
      }
    >
  >(new Map());
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const charSpans = Array.from(container.querySelectorAll<HTMLElement>('[data-char]'));
    charStatesRef.current.clear();

    const updateOrigins = () => {
      charSpans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const existing = charStatesRef.current.get(span);
        const origin = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        if (existing) {
          existing.origin = origin;
        } else {
          charStatesRef.current.set(span, {
            xState: { x: 0, v: 0 },
            yState: { x: 0, v: 0 },
            scaleState: { x: 1.0, v: 0 },
            origin,
          });
        }
      });
    };

    updateOrigins();
    window.addEventListener('resize', updateOrigins);

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
          if (dist < influenceRadius && dist > 0) {
            const force = calculateGaussianFalloff(dist, influenceRadius, 70);
            const angle = Math.atan2(state.origin.y - mouseY, state.origin.x - mouseX);
            targetDx = Math.cos(angle) * force * maxDisplacement;
            targetDy = Math.sin(angle) * force * maxDisplacement - force * 20;

            // Dramatic Letter Zoom (magnifies up to 1.85x on hover)
            targetScale = 1.0 + force * 0.85;

            // Variable font weight displacement
            const weight = Math.round(300 + force * 600);
            const clampedWeight = Math.max(300, Math.min(900, weight));
            span.style.fontVariationSettings = `'wght' ${clampedWeight}`;
            span.style.textShadow = force > 0.05
              ? `0 0 ${force * 25}px rgba(255,255,255,0.9), 0 0 ${force * 50}px rgba(56,189,248,0.4)`
              : 'none';
          } else {
            span.style.fontVariationSettings = "'wght' 300";
            span.style.textShadow = 'none';
          }
        } else {
          // Subtle idle floating harmonic wave
          const charIndex = Array.from(charStatesRef.current.keys()).indexOf(span);
          targetDy = Math.sin(time * 2 + charIndex * 0.3) * 3;
          span.style.fontVariationSettings = "'wght' 300";
          span.style.textShadow = 'none';
        }

        // Solve 2D Euler physics step for position and scale
        const curX = state.xState || { x: 0, v: 0 };
        const curY = state.yState || { x: 0, v: 0 };
        const curScale = state.scaleState || { x: 1.0, v: 0 };

        state.xState = solveEulerStep(curX, targetDx, { k: 300, c: 22, m: 1.0 });
        state.yState = solveEulerStep(curY, targetDy, { k: 300, c: 22, m: 1.0 });
        state.scaleState = solveEulerStep(curScale, targetScale, { k: 340, c: 24, m: 1.0 });

        const scaleVal = typeof state.scaleState?.x === 'number' ? state.scaleState.x : 1.0;
        span.style.transform = `translate3d(${state.xState.x.toFixed(2)}px, ${state.yState.x.toFixed(2)}px, 0) scale(${scaleVal.toFixed(3)})`;
      });
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateOrigins);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [influenceRadius, maxDisplacement]);

  return (
    <div
      ref={containerRef}
      data-testid="lock-screen-brand"
      data-cursor="magnetic"
      className={`inline-block select-none cursor-pointer py-4 ${className}`}
    >
      <span
        className="font-serif italic font-light tracking-wide text-6xl sm:text-7xl md:text-8xl text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
        style={{
          fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
          display: 'inline-flex',
          gap: '0.05em',
        }}
      >
        <SplitText text={text} />
      </span>
    </div>
  );
}
