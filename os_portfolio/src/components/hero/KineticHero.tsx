import React, { useEffect, useRef, useState } from 'react';
import { MetadataAnchors } from './MetadataAnchors';
import { calculateEuclideanDistance, calculateCosineBellFalloff, lerp } from '../../utils/math';
import { CharCentroid } from '../../types/kinetic';

const HERO_WORDS = ['CREATIVE', 'SYSTEMS', 'ENGINEER'];

export const KineticHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<CharCentroid[]>([]);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const isSleepingRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);

  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });

  // Pre-cache character centroids
  const cacheCentroids = () => {
    if (!containerRef.current) return;
    const charElements = containerRef.current.querySelectorAll<HTMLElement>('.kinetic-char');
    const newChars: CharCentroid[] = [];

    charElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      newChars.push({
        element: el,
        char: el.getAttribute('data-char') || '',
        cx,
        cy,
        currentWght: 600,
        targetWght: 600,
        currentScale: 1.0,
        targetScale: 1.0,
        currentDx: 0,
        targetDx: 0,
        currentDy: 0,
        targetDy: 0,
      });
    });

    charsRef.current = newChars;
  };

  // RAF Animation Tick with 0% CPU Sleep Loop
  const startAnimationLoop = () => {
    if (!isSleepingRef.current) return;
    isSleepingRef.current = false;

    const tick = () => {
      const { x: px, y: py } = pointerPosRef.current;
      const radius = 220; // Calibrated influence radius
      let maxDelta = 0;

      charsRef.current.forEach(item => {
        const distance = calculateEuclideanDistance(px, py, item.cx, item.cy);
        const falloff = calculateCosineBellFalloff(distance, radius);

        // Calculate targets
        item.targetWght = 600 + (850 - 600) * falloff;
        item.targetScale = 1.0 + (1.10 - 1.0) * falloff;

        if (distance < radius && distance > 0.1) {
          const uX = (item.cx - px) / distance;
          const uY = (item.cy - py) / distance;
          item.targetDx = uX * 6.0 * falloff;
          item.targetDy = uY * 6.0 * falloff;
        } else {
          item.targetDx = 0;
          item.targetDy = 0;
        }

        // LERP values with alpha = 0.14
        item.currentWght = lerp(item.currentWght, item.targetWght, 0.14);
        item.currentScale = lerp(item.currentScale, item.targetScale, 0.14);
        item.currentDx = lerp(item.currentDx, item.targetDx, 0.14);
        item.currentDy = lerp(item.currentDy, item.targetDy, 0.14);

        // Apply style mutation directly without React re-render
        item.element.style.fontWeight = Math.round(item.currentWght).toString();
        item.element.style.transform = `translate3d(${item.currentDx.toFixed(2)}px, ${item.currentDy.toFixed(2)}px, 0) scale(${item.currentScale.toFixed(3)})`;

        const delta = Math.abs(item.currentWght - item.targetWght);
        if (delta > maxDelta) maxDelta = delta;
      });

      // If all characters have settled to resting equilibrium (< 0.05), sleep RAF loop!
      if (maxDelta < 0.05 && px === -1000) {
        isSleepingRef.current = true;
        rafIdRef.current = null;
        return; // HALT RAF LOOP (0% Idle CPU)
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    cacheCentroids();

    const handlePointerMove = (e: PointerEvent) => {
      pointerPosRef.current = { x: e.clientX, y: e.clientY };
      setSpotlightPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
      startAnimationLoop();
    };

    const handlePointerLeave = () => {
      pointerPosRef.current = { x: -1000, y: -1000 };
      startAnimationLoop();
    };

    const handleResize = () => {
      cacheCentroids();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden select-none"
    >
      {/* 600px Ambient Pointer-Following Radial Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(41, 151, 255, 0.06) 0%, rgba(0, 102, 204, 0.02) 35%, transparent 70%)`,
        }}
      />

      {/* Atmospheric High-Frequency SVG Grain Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 4-Corner Metadata Anchors */}
      <MetadataAnchors />

      {/* Center Stage Kinetic Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <h1
          aria-label="Creative Systems Engineer"
          className="text-white font-display tracking-tight text-[36px] sm:text-[54px] md:text-[76px] lg:text-[96px] leading-[1.04] space-y-1 sm:space-y-2 select-none"
        >
          {HERO_WORDS.map((word, wIdx) => (
            <div key={wIdx} className="word flex justify-center overflow-visible whitespace-nowrap">
              {word.split('').map((char, cIdx) => (
                <span
                  key={cIdx}
                  data-char={char}
                  className="kinetic-char inline-block will-change-transform cursor-default transition-colors text-white/90 hover:text-white"
                  style={{
                    fontWeight: 600,
                    transformOrigin: 'center center',
                  }}
                  aria-hidden="true"
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </h1>

        {/* Subtitle Descriptor */}
        <p className="text-[14px] sm:text-[16px] md:text-[18px] font-normal text-body-muted max-w-[620px] mt-6 leading-relaxed tracking-[-0.2px]">
          Operating System Simulation • High-Frequency DSP Web Audio • Proximity Physics
        </p>
      </div>
    </div>
  );
};
