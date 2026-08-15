export interface ShortcutDefinition {
  combo: string;
  description: string;
  actionName: string;
}

export const SHORTCUTS: ShortcutDefinition[] = [
  { combo: 'Cmd+K', description: 'Open Spotlight Search', actionName: 'toggleSpotlight' },
  { combo: 'Cmd+W', description: 'Close Active Window', actionName: 'closeActiveWindow' },
  { combo: 'Cmd+M', description: 'Minimize Active Window', actionName: 'minimizeActiveWindow' },
  { combo: 'Cmd+Shift+D', description: 'Toggle Dark / Light Theme', actionName: 'toggleTheme' },
  { combo: 'Cmd+Option+M', description: 'Toggle Desktop Mode', actionName: 'toggleDesktopMode' },
  { combo: 'Escape', description: 'Dismiss Modal / Clear Selection', actionName: 'dismissModal' },
];
