'use client';

import { useEffect } from 'react';
import { useOSStore } from './useOSStore';

function isInputElement(element: EventTarget | null): boolean {
  const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
  const isInputOrEditable = (el: any): boolean => {
    if (!el || typeof el !== 'object') return false;
    const tag = el.tagName ? String(el.tagName).toLowerCase() : '';
    const contentEditable = el.contentEditable ?? el.getAttribute?.('contenteditable');
    return (
      tag === 'input' ||
      tag === 'textarea' ||
      tag === 'select' ||
      Boolean(el.isContentEditable) ||
      contentEditable === true ||
      contentEditable === 'true' ||
      contentEditable === ''
    );
  };

  return isInputOrEditable(element) || isInputOrEditable(activeEl);
}

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useOSStore.getState();
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const isAltOrOption = e.altKey;
      const isShift = e.shiftKey;
      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';
      const inInput = isInputElement(e.target);

      // 1. Escape: Dismiss overlay modals & menus (Always active, even in inputs)
      if (e.key === 'Escape') {
        let dismissed = false;
        if (state.contextMenu) {
          e.preventDefault();
          state.closeContextMenu();
          dismissed = true;
        }
        if (state.spotlightOpen) {
          e.preventDefault();
          state.setSpotlightOpen(false);
          dismissed = true;
        }
        if (state.controlCenterOpen) {
          e.preventDefault();
          state.setControlCenterOpen(false);
          dismissed = true;
        }
        if (dismissed) return;
      }

      // 2. Cmd/Ctrl + K: Spotlight Search toggle (Allowed inside inputs)
      if (isCmdOrCtrl && !isAltOrOption && !isShift && (key === 'k' || code === 'KeyK')) {
        e.preventDefault();
        state.toggleSpotlight();
        return;
      }

      // Remaining shortcuts are suppressed while actively typing in input fields
      if (inInput) return;

      // 3. Cmd/Ctrl + W: Close current active window
      if (isCmdOrCtrl && !isAltOrOption && !isShift && (key === 'w' || code === 'KeyW')) {
        if (state.activeWindowId) {
          e.preventDefault();
          state.closeWindow(state.activeWindowId);
        }
        return;
      }

      // 4. Cmd/Ctrl + M: Minimize current active window
      if (isCmdOrCtrl && !isAltOrOption && !isShift && (key === 'm' || code === 'KeyM')) {
        if (state.activeWindowId) {
          e.preventDefault();
          state.minimizeWindow(state.activeWindowId);
        }
        return;
      }

      // 5. Cmd/Ctrl + Shift + D: Toggle Dark/Light Theme
      if (isCmdOrCtrl && isShift && !isAltOrOption && (key === 'd' || code === 'KeyD')) {
        e.preventDefault();
        state.toggleTheme();
        return;
      }

      // 6. Cmd/Ctrl + Option + M: Toggle Ambient/Workspace Mode
      if (
        isCmdOrCtrl &&
        isAltOrOption &&
        !isShift &&
        (key === 'm' || key === 'µ' || code === 'KeyM')
      ) {
        e.preventDefault();
        state.toggleDesktopMode();
        return;
      }

      // 7. Cmd/Ctrl + Option + T: Open/Focus Terminal
      if (
        isCmdOrCtrl &&
        isAltOrOption &&
        !isShift &&
        (key === 't' || key === '†' || code === 'KeyT')
      ) {
        e.preventDefault();
        state.openWindow('terminal');
        return;
      }

      // 8. Cmd/Ctrl + Ctrl/Alt + Q or Cmd/Ctrl + Alt + L: Lock Screen
      if (
        (isCmdOrCtrl && isAltOrOption && (key === 'l' || code === 'KeyL' || key === 'q' || code === 'KeyQ')) ||
        (e.metaKey && e.ctrlKey && (key === 'q' || code === 'KeyQ'))
      ) {
        e.preventDefault();
        state.lock();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
