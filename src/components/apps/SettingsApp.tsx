'use client';

import React, { useState } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import { WALLPAPERS } from '@/lib/constants/wallpapers';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import {
  Image,
  SunMoon,
  Volume2,
  Sliders,
  Monitor,
  Info,
  Check,
  Sparkles,
  VolumeX,
  Play,
} from 'lucide-react';

type SettingsSection = 'wallpaper' | 'appearance' | 'dock' | 'sound' | 'displays' | 'about';

export function SettingsApp() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('wallpaper');
  const [dockMagnify, setDockMagnify] = useState(true);
  const [dockScale, setDockScale] = useState(1.4);
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const wallpaperId = useOSStore(state => state.wallpaperId);
  const setWallpaper = useOSStore(state => state.setWallpaper);
  const setCustomWallpaper = useOSStore(state => state.setCustomWallpaper);
  const clearCustomWallpaper = useOSStore(state => state.clearCustomWallpaper);
  const theme = useOSStore(state => state.theme);
  const setTheme = useOSStore(state => state.setTheme);
  const soundEnabled = useOSStore(state => state.soundEnabled);
  const setSoundEnabled = useOSStore(state => state.setSoundEnabled);
  const soundVolume = useOSStore(state => state.soundVolume);
  const setSoundVolume = useOSStore(state => state.setSoundVolume);
  const desktopMode = useOSStore(state => state.desktopMode);
  const toggleDesktopMode = useOSStore(state => state.toggleDesktopMode);

  const handleSectionChange = (section: SettingsSection) => {
    GlobalAudioManager.getInstance().playFx('click');
    setActiveSection(section);
  };

  const handleWallpaperChange = (id: string) => {
    GlobalAudioManager.getInstance().playFx('click');
    setWallpaper(id);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 10MB.');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }
    
    setUploadError(null);
    GlobalAudioManager.getInstance().playFx('click');
    await setCustomWallpaper(file);
  };

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    GlobalAudioManager.getInstance().playFx('click');
    setTheme(newTheme);
  };

  return (
    <div
      data-testid="settings-app"
      className="flex-1 w-full h-full bg-stone-950/90 text-white flex flex-col sm:flex-row overflow-hidden select-none"
    >
      {/* Left Sidebar Navigation */}
      <div className="w-full sm:w-52 border-b sm:border-b-0 sm:border-r border-white/10 bg-white/[0.02] p-2 sm:p-3 flex sm:flex-col overflow-x-auto space-x-2 sm:space-x-0 sm:space-y-1 no-scrollbar shrink-0">
        <div className="hidden sm:block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
          Settings
        </div>

        <button
          data-testid="settings-nav-wallpaper"
          onClick={() => handleSectionChange('wallpaper')}
          className={`flex-shrink-0 w-auto sm:w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSection === 'wallpaper'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Image size={15} />
          <span className="hidden sm:inline">Wallpaper</span>
          <span className="sm:hidden">Wallpaper</span>
        </button>

        <button
          data-testid="settings-nav-appearance"
          onClick={() => handleSectionChange('appearance')}
          className={`flex-shrink-0 w-auto sm:w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSection === 'appearance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <SunMoon size={15} />
          <span className="hidden sm:inline">Appearance</span>
          <span className="sm:hidden">Appearance</span>
        </button>

        <button
          data-testid="settings-nav-dock"
          onClick={() => handleSectionChange('dock')}
          className={`flex-shrink-0 w-auto sm:w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSection === 'dock'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Sliders size={15} />
          <span className="hidden sm:inline">Dock & Taskbar</span>
          <span className="sm:hidden">Dock</span>
        </button>

        <button
          data-testid="settings-nav-sound"
          onClick={() => handleSectionChange('sound')}
          className={`flex-shrink-0 w-auto sm:w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSection === 'sound'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Volume2 size={15} />
          <span className="hidden sm:inline">Sound & Audio</span>
          <span className="sm:hidden">Sound</span>
        </button>

        <button
          data-testid="settings-nav-displays"
          onClick={() => handleSectionChange('displays')}
          className={`flex-shrink-0 w-auto sm:w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSection === 'displays'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Monitor size={15} />
          <span className="hidden sm:inline">Displays & Ambient</span>
          <span className="sm:hidden">Displays</span>
        </button>

        <button
          data-testid="settings-nav-about"
          onClick={() => handleSectionChange('about')}
          className={`flex-shrink-0 w-auto sm:w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSection === 'about'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Info size={15} />
          <span className="hidden sm:inline">About System</span>
          <span className="sm:hidden">About</span>
        </button>
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 overflow-y-auto p-5 select-text">
        {/* 1. WALLPAPER SECTION */}
        {activeSection === 'wallpaper' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Desktop Wallpapers</h3>
              <p className="text-xs text-white/60">Choose a dynamic wallpaper for your desktop background</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {WALLPAPERS.map(w => {
                const isSelected = wallpaperId === w.id;
                return (
                  <div
                    key={w.id}
                    data-testid={`settings-wallpaper-${w.id}`}
                    onClick={() => handleWallpaperChange(w.id)}
                    className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 shadow-md ${
                      isSelected
                        ? 'border-blue-500 scale-[1.02] shadow-blue-500/20'
                        : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                    }`}
                  >
                    {/* Wallpaper Preview Canvas */}
                    <div
                      className="w-full h-24 sm:h-28"
                      style={{ background: w.fallbackGradient }}
                    />

                    {/* Active Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                        <Check size={14} />
                      </div>
                    )}

                    {/* Title Banner */}
                    <div className="p-2 bg-stone-900/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-white/90 truncate">
                        {w.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/60 font-mono capitalize">
                        {w.themePreference || 'dark'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 mt-6">
              <h4 className="text-sm font-bold text-white">Custom Wallpaper</h4>
              <p className="text-[11px] text-white/60 mb-3">Upload a custom image (max 10MB)</p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
                    <Image size={14} />
                    <span>Choose Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload} 
                    />
                  </label>
                  
                  {wallpaperId === 'custom' && (
                    <button 
                      onClick={() => {
                        GlobalAudioManager.getInstance().playFx('click');
                        clearCustomWallpaper();
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-white/10 hover:border-red-500/30"
                    >
                      Remove Custom
                    </button>
                  )}
                </div>
                
                {uploadError && (
                  <p className="text-xs text-red-400">{uploadError}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. APPEARANCE SECTION */}
        {activeSection === 'appearance' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-white">Appearance & Theme</h3>
              <p className="text-xs text-white/60">Select your preferred window and menu interface appearance</p>
            </div>

            {/* Theme Mode Selector Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'Dark', bg: 'bg-stone-900 border-white/20' },
                { id: 'light', label: 'Light', bg: 'bg-stone-200 text-black border-stone-400' },
                { id: 'system', label: 'Auto', bg: 'bg-gradient-to-r from-stone-900 to-stone-200 border-white/20' },
              ].map(t => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    data-testid={`settings-theme-${t.id}`}
                    onClick={() => handleThemeChange(t.id as any)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className={`w-full h-14 rounded-lg mb-2 ${t.bg} shadow-inner flex items-center justify-center`}>
                      {isSelected && <Check size={18} className="text-blue-500 drop-shadow" />}
                    </div>
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Accent Color Palette */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <h4 className="text-xs font-semibold text-white/80">Accent Color</h4>
              <div className="flex items-center space-x-3">
                {['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#64748b'].map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      GlobalAudioManager.getInstance().playFx('click');
                      setAccentColor(c);
                    }}
                    className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                      accentColor === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-stone-950' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {accentColor === c && <Check size={14} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. DOCK & TASKBAR SECTION */}
        {activeSection === 'dock' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-white">Dock & Taskbar</h3>
              <p className="text-xs text-white/60">Configure Luca parabolic magnification and desktop dock behavior</p>
            </div>

            <div className="space-y-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              {/* Magnification Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Magnification</div>
                  <div className="text-[11px] text-white/50">Magnify icons on mouse hover using Cosine Bell curve</div>
                </div>
                <input
                  type="checkbox"
                  checked={dockMagnify}
                  onChange={e => {
                    GlobalAudioManager.getInstance().playFx('click');
                    setDockMagnify(e.target.checked);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Magnification Size Slider */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Magnification Scale</span>
                  <span className="font-mono text-blue-400 font-semibold">{dockScale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="1.6"
                  step="0.05"
                  value={dockScale}
                  disabled={!dockMagnify}
                  onChange={e => setDockScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Active Dot Indicators */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <div className="text-xs font-semibold text-white">Show indicators for open applications</div>
                  <div className="text-[11px] text-white/50">Display glowing dot beneath running dock icons</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. SOUND & AUDIO SECTION */}
        {activeSection === 'sound' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-white">Sound & Audio Synthesis</h3>
              <p className="text-xs text-white/60">Configure Web Audio sound effects and dynamic background ducking</p>
            </div>

            <div className="space-y-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              {/* Sound FX Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Play User Interface Sound Effects</div>
                  <div className="text-[11px] text-white/50">Procedural audio synthesis on click, drag, and window actions</div>
                </div>
                <input
                  data-testid="settings-sound-toggle"
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={e => {
                    GlobalAudioManager.getInstance().playFx('click');
                    setSoundEnabled(e.target.checked);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* UI Volume Slider */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">UI Sound Effects Volume</span>
                  <span className="font-mono text-blue-400 font-semibold">{Math.round(soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={e => setSoundVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Ducking Info Banner */}
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
                <div className="font-semibold text-blue-300 flex items-center space-x-1.5">
                  <Volume2 size={14} />
                  <span>Automatic Dynamic Range Ducking</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  During UI interactions, background music automatically ducks to 20% volume over 40ms to keep clicks and transitions crystal clear.
                </p>
              </div>

              {/* Test Sound FX Buttons */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-xs font-semibold text-white/80">Test Audio Synthesizer:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => GlobalAudioManager.getInstance().playFx('click')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium flex items-center space-x-1.5"
                  >
                    <Play size={11} />
                    <span>Click FX</span>
                  </button>
                  <button
                    onClick={() => GlobalAudioManager.getInstance().playFx('window-open')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium flex items-center space-x-1.5"
                  >
                    <Play size={11} />
                    <span>Window Open</span>
                  </button>
                  <button
                    onClick={() => GlobalAudioManager.getInstance().playFx('window-close')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium flex items-center space-x-1.5"
                  >
                    <Play size={11} />
                    <span>Window Close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. DISPLAYS & AMBIENT SECTION */}
        {activeSection === 'displays' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-white">Displays & Ambient Mode</h3>
              <p className="text-xs text-white/60">Configure typography physics and ambient hero mode</p>
            </div>

            <div className="space-y-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              {/* Ambient Hero Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Ambient Typography Mode</div>
                  <div className="text-[11px] text-white/50">Fades application windows to highlight the kinetic hero canvas</div>
                </div>
                <input
                  data-testid="settings-ambient-toggle"
                  type="checkbox"
                  checked={desktopMode === 'ambient-hero'}
                  onChange={() => {
                    GlobalAudioManager.getInstance().playFx('click');
                    toggleDesktopMode();
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Physics Spec Info */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                <div className="font-semibold text-purple-300 flex items-center space-x-1.5">
                  <Sparkles size={14} />
                  <span>Semi-Implicit Euler ODE Solver</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Kinetic typography letters react to mouse pointer displacement with spring physics ($k=280$, $c=24$, $m=1.0$) and variable font weight modulation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. ABOUT SYSTEM SECTION */}
        {activeSection === 'about' && (
          <div className="space-y-5 max-w-xl">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 shadow-xl overflow-hidden">
                <img
                  src="/name.png"
                  alt="Naseer Logo"
                  className="w-full h-auto object-contain select-none"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">macOS Sonoma Portfolio OS</h3>
                <p className="text-xs text-white/60">Version 2.4.0 (Web Edition)</p>
                <p className="text-[11px] text-blue-400 mt-0.5">Built with Next.js 14, Tailwind CSS & Web Audio</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/50">Host Architecture:</span>
                <span className="font-mono text-white/90">Darwin 24.2.0 (x86_64 / arm64)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/50">Rendering Engine:</span>
                <span className="font-mono text-white/90">WebKit / Blink Hardware Accelerated</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/50">Physics Integrator:</span>
                <span className="font-mono text-white/90">Euler ODE Spring Solver (60 FPS)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/50">Audio Synthesizer:</span>
                <span className="font-mono text-white/90">Web Audio API Procedural Node Graph</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
