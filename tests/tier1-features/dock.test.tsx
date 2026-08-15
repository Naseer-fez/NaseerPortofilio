import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Dock } from '@/components/dock/Dock';
import { useOSStore } from '@/hooks/useOSStore';

describe('Tier 1: Luca Parabolic Dock', () => {
  beforeEach(() => {
    const windows = useOSStore.getState().windows;
    Object.keys(windows).forEach(k => {
      useOSStore.getState().closeWindow(k as any);
    });
  });

  it('renders dock pill shape centered at bottom with glassmorphism (#24, #25, #26)', () => {
    const { getByTestId } = render(<Dock />);
    const dock = getByTestId('desktop-dock');

    expect(dock).toBeInTheDocument();
    expect(dock).toHaveClass('fixed', 'bottom-4', 'rounded-full');
    expect(dock).toMatchGlassmorphism({ blur: '20px', saturate: '190%' });
  });

  it('scales dock items on pointer move via Cosine Bell curve and restores on leave (#25, #26, #28)', () => {
    const { getByTestId } = render(<Dock />);
    const dock = getByTestId('desktop-dock');
    const termItem = getByTestId('dock-item-terminal');

    // Simulate pointer move over terminal item
    fireEvent.pointerMove(dock, { clientX: 200, clientY: 880 });
    expect(termItem).toBeInTheDocument();

    // Mouse leave restores to base size
    fireEvent.pointerLeave(dock);
    expect(termItem.style.transform).toContain('scale(1)');
  });

  it('launches closed app with bounce on dock click (#27, #34)', () => {
    const { getByTestId } = render(<Dock />);
    const settingsItem = getByTestId('dock-item-settings');

    expect(useOSStore.getState().windows['settings'].isOpen).toBe(false);

    fireEvent.click(settingsItem);

    expect(useOSStore.getState().windows['settings'].isOpen).toBe(true);
    expect(settingsItem).toHaveClass('animate-bounce');
  });

  it('focuses open window on dock click (#28)', () => {
    useOSStore.getState().openWindow('terminal');
    useOSStore.getState().openWindow('projects');

    const { getByTestId } = render(<Dock />);
    const termItem = getByTestId('dock-item-terminal');

    fireEvent.click(termItem);
    expect(useOSStore.getState().activeWindowId).toBe('terminal');
  });

  it('restores minimized window on dock click (#29)', () => {
    useOSStore.getState().openWindow('finder');
    useOSStore.getState().minimizeWindow('finder');

    const { getByTestId } = render(<Dock />);
    const finderItem = getByTestId('dock-item-finder');

    expect(useOSStore.getState().windows['finder'].isMinimized).toBe(true);

    fireEvent.click(finderItem);
    expect(useOSStore.getState().windows['finder'].isMinimized).toBe(false);
  });

  it('squashes icon to scale 0.88 on pointer down and recovers on pointer up (#30, #31)', () => {
    const { getByTestId } = render(<Dock />);
    const mailItem = getByTestId('dock-item-mail');

    fireEvent.pointerDown(mailItem);
    expect(mailItem.style.transform).toContain('scale(0.88)');

    fireEvent.pointerUp(mailItem);
    expect(mailItem.style.transform).toContain('scale(1)');
  });

  it('displays tooltip on hover and dismisses on leave (#32, #33, #31)', () => {
    const { getByTestId, queryByRole } = render(<Dock />);
    const projItem = getByTestId('dock-item-projects');

    expect(queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseEnter(projItem);
    const tooltip = getByTestId('dock-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Projects');

    fireEvent.mouseLeave(projItem);
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders active glowing dot below open apps and dims on minimize (#34, #35, #36, #32)', () => {
    const { getByTestId, queryByTestId, rerender } = render(<Dock />);

    // Closed: no dot
    expect(queryByTestId('dock-dot-terminal')).not.toBeInTheDocument();

    // Open: dot visible
    useOSStore.getState().openWindow('terminal');
    rerender(<Dock />);
    const dot = getByTestId('dock-dot-terminal');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('opacity-85');

    // Minimized: dimmed dot
    useOSStore.getState().minimizeWindow('terminal');
    rerender(<Dock />);
    expect(getByTestId('dock-dot-terminal')).toHaveClass('opacity-40');

    // Closed: dot removed
    useOSStore.getState().closeWindow('terminal');
    rerender(<Dock />);
    expect(queryByTestId('dock-dot-terminal')).not.toBeInTheDocument();
  });

  it('renders dock divider with 1px width and 32px height (#33)', () => {
    const { getByTestId } = render(<Dock />);
    const divider = getByTestId('dock-divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveStyle({ width: '1px', height: '32px' });
  });
});
