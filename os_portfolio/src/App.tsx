import React from 'react';
import { WindowProvider } from './context/WindowContext';
import { AudioProvider } from './context/AudioContext';
import { Desktop } from './components/os/Desktop';
import { MenuBar } from './components/os/MenuBar';
import { Dock } from './components/dock/Dock';
import { KineticHero } from './components/hero/KineticHero';
import { MusicPlayer } from './components/music/MusicPlayer';

export const App: React.FC = () => {
  return (
    <WindowProvider>
      <AudioProvider>
        <div className="relative w-screen h-screen overflow-hidden bg-surface-obsidian text-body-dark select-none">
          {/* 1. Base OS Virtual Desktop with Multi-Window Workspace */}
          <Desktop />

          {/* 2. Kinetic Typography Hero Surface (Mounted behind windows on desktop surface) */}
          <KineticHero />

          {/* 3. Top Menu Bar (h-7 / 28px, z-50) */}
          <MenuBar />

          {/* 4. Proximity-Scaling Taskbar Dock (z-40) */}
          <Dock />

          {/* 5. Floating Music Player Widget (z-1000) */}
          <MusicPlayer />
        </div>
      </AudioProvider>
    </WindowProvider>
  );
};

export default App;
