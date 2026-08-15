import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { KineticCursor } from '@/components/cursor/KineticCursor';
import { CursorPrecisionDot } from '@/components/cursor/CursorPrecisionDot';
import { CursorAuraRing } from '@/components/cursor/CursorAuraRing';
import { setViewport } from '../helpers/viewport';

describe('Tier 1: Dual-Tier Kinetic Cursor', () => {
  beforeEach(() => {
    setViewport({ width: 1440, height: 900, pointer: 'fine' });
  });

  it('renders precision dot 4px white with pointer-events none at z-9999 (#54, #53)', () => {
    const { getByTestId } = render(<CursorPrecisionDot x={450} y={320} />);
    const dot = getByTestId('cursor-precision-dot');

    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({
      width: '4px',
      height: '4px',
      backgroundColor: '#ffffff',
      pointerEvents: 'none',
      transform: 'translate3d(448px, 318px, 0)',
    });
  });

  it('renders aura ring with mix-blend-mode difference and lerp follow (#55, #57, #54, #55)', () => {
    const { getByTestId } = render(<CursorAuraRing x={450} y={320} variant="default" radius={12} />);
    const aura = getByTestId('cursor-aura-ring');

    expect(aura).toBeInTheDocument();
    expect(aura).toHaveStyle({
      width: '24px',
      height: '24px',
      mixBlendMode: 'difference',
    });
  });

  it('expands aura ring up to 80px diameter under high velocity (#56, #56)', () => {
    const { getByTestId } = render(<CursorAuraRing x={450} y={320} variant="default" radius={40} />);
    const aura = getByTestId('cursor-aura-ring');

    expect(aura).toHaveStyle({
      width: '80px',
      height: '80px',
    });
  });

  it('collapses aura ring scale to 0 over resize handle (#58, #57)', () => {
    const { getByTestId } = render(<CursorAuraRing x={450} y={320} variant="precision-drag" radius={12} />);
    const aura = getByTestId('cursor-aura-ring');

    expect(aura.style.transform).toContain('scale(0)');
  });

  it('morphs aura into rounded squircle snapping over dock item (#59, #58)', () => {
    const { getByTestId } = render(<CursorAuraRing x={450} y={320} variant="magnetic-dock" radius={12} />);
    const aura = getByTestId('cursor-aura-ring');

    expect(aura).toHaveStyle({
      borderRadius: '16px',
    });
  });

  it('suppresses cursor rendering on mobile/touch screen (#60, #64)', () => {
    setViewport({ width: 390, height: 844, pointer: 'coarse' });
    const { queryByTestId } = render(<KineticCursor />);

    expect(queryByTestId('cursor-precision-dot')).not.toBeInTheDocument();
    expect(queryByTestId('cursor-aura-ring')).not.toBeInTheDocument();
  });
});
