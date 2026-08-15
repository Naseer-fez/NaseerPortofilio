import { act } from '@testing-library/react';

export function simulateKeyboardShortcut(
  combo: string,
  options: { target?: Element | Window } = {}
): void {
  const target = options.target || window;
  const parts = combo.split('+').map(p => p.trim());

  const hasMeta = parts.includes('Cmd') || parts.includes('Meta');
  const hasCtrl = parts.includes('Ctrl');
  const hasShift = parts.includes('Shift');
  const hasAlt = parts.includes('Alt') || parts.includes('Option');

  const keyPart = parts.find(p => !['Cmd', 'Meta', 'Ctrl', 'Shift', 'Alt', 'Option'].includes(p)) || '';

  const eventPayload: KeyboardEventInit = {
    key: keyPart.length === 1 ? keyPart.toLowerCase() : keyPart,
    code: keyPart.length === 1 ? `Key${keyPart.toUpperCase()}` : keyPart,
    metaKey: hasMeta,
    ctrlKey: hasCtrl || hasMeta, // Allow ctrlKey as well for Windows jsdom compatibility
    shiftKey: hasShift,
    altKey: hasAlt,
    bubbles: true,
    cancelable: true,
  };

  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', eventPayload));
    target.dispatchEvent(new KeyboardEvent('keyup', eventPayload));
  });
}
