'use client';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export const GlobalKeyboardListener: React.FC = () => {
  useKeyboardShortcuts();
  return null;
};
