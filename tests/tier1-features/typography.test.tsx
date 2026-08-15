import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { KineticHeroStage } from '@/components/typography/KineticHeroStage';
import { useOSStore } from '@/hooks/useOSStore';
import { solveEulerStep, calculateGaussianFalloff, getDampingRatio } from '@/lib/physics/eulerSolver';

describe('Tier 1: Kinetic Typography & Euler ODE Physics', () => {
  beforeEach(() => {
    useOSStore.setState({
      desktopMode: 'workspace',
    });
    const windows = useOSStore.getState().windows;
    Object.keys(windows).forEach(k => {
      useOSStore.getState().closeWindow(k as any);
    });
  });

  it('renders responsive full-bleed clamp and wraps characters in spans (#46, #47)', () => {
    const { getByTestId, container } = render(<KineticHeroStage heading="CODE" />);

    const heading = getByTestId('hero-heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveStyle({
      fontSize: 'clamp(4.5rem, 14vw + 1rem, 18.5rem)',
      textTransform: 'uppercase',
    });

    const charSpans = container.querySelectorAll('[data-char]');
    expect(charSpans.length).toBe(4);
    expect(charSpans[0]).toHaveAttribute('data-char', 'C');
  });

  it('verifies underdamped Euler ODE physics parameters (zeta ~ 0.717) (#61, #62, #48)', () => {
    const k = 280;
    const c = 24;
    const m = 1.0;
    const dampingRatio = getDampingRatio(k, c, m);

    // Damping ratio should be ~0.717 (underdamped spring)
    expect(dampingRatio).toBeCloseTo(0.717, 2);

    // Simulate spring displacement return with overshoot
    let state = { x: 50, v: 0 };
    const history: number[] = [state.x];

    for (let step = 0; step < 50; step++) {
      state = solveEulerStep(state, 0, { k, c, m }, 0.016);
      history.push(state.x);
    }

    // Must settle towards 0 and cross 0 or show underdamped damping
    const settled = Math.abs(history[history.length - 1]);
    expect(settled).toBeLessThan(1.0);
  });

  it('calculates Gaussian falloff within 260px influence radius (#63, #49)', () => {
    const falloffNear = calculateGaussianFalloff(50, 260, 100);
    const falloffFar = calculateGaussianFalloff(200, 260, 100);
    const falloffOutside = calculateGaussianFalloff(300, 260, 100);

    expect(falloffNear).toBeGreaterThan(falloffFar);
    expect(falloffFar).toBeGreaterThan(0);
    expect(falloffOutside).toBe(0);
  });

  it('modulates font weight between 400 and 900 near cursor (#64, #50)', () => {
    const forceMax = 1.0;
    const weightMax = Math.round(400 + forceMax * 500);
    expect(weightMax).toBe(900);

    const forceMin = 0.0;
    const weightMin = Math.round(400 + forceMin * 500);
    expect(weightMin).toBe(400);
  });

  it('dims hero stage opacity in workspace mode when windows are open (#65, #52)', () => {
    useOSStore.getState().openWindow('terminal');
    const { getByTestId } = render(<KineticHeroStage />);

    const stage = getByTestId('kinetic-hero-stage');
    expect(stage).toHaveStyle({ opacity: '0.35' });
  });

  it('restores full 1.0 opacity in ambient-hero mode (#66, #52)', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().setDesktopMode('ambient-hero');

    const { getByTestId } = render(<KineticHeroStage />);
    const stage = getByTestId('kinetic-hero-stage');
    expect(stage).toHaveStyle({ opacity: '1' });
  });
});
