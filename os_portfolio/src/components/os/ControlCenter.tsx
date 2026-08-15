import React, { useState } from 'react';
import {
  Wifi,
  Bluetooth,
  Sun,
  Volume2,
  Moon,
  BatteryCharging,
  Sliders,
  Airplay,
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, onClose }) => {
  const { volume, setVolume, isPlaying, currentTrack } = useAudio();
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [brightness, setBrightness] = useState(100);

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to dismiss on click outside */}
      <div className="fixed inset-0 z-[60]" onClick={onClose} />

      <div
        className="fixed top-8 right-3 sm:right-6 w-[320px] p-4 glassmorphic-modal rounded-lg shadow-player-modal z-[70] text-white border border-hairline-dark select-none animate-popover-in space-y-3"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Control Center"
      >
        {/* Top Connectivity Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Wi-Fi & Bluetooth Block */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-3">
            <button
              onClick={() => setWifiEnabled(v => !v)}
              className="w-full flex items-center gap-2.5 text-left"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  wifiEnabled ? 'bg-primary text-white' : 'bg-white/15 text-white/50'
                }`}
              >
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[12.5px] font-semibold block">Wi-Fi</span>
                <span className="text-[10.5px] text-white/50">{wifiEnabled ? 'Connected (5G)' : 'Off'}</span>
              </div>
            </button>

            <button
              onClick={() => setBluetoothEnabled(v => !v)}
              className="w-full flex items-center gap-2.5 text-left"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  bluetoothEnabled ? 'bg-primary text-white' : 'bg-white/15 text-white/50'
                }`}
              >
                <Bluetooth className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[12.5px] font-semibold block">Bluetooth</span>
                <span className="text-[10.5px] text-white/50">{bluetoothEnabled ? 'AirPods Pro' : 'Off'}</span>
              </div>
            </button>
          </div>

          {/* Dark Mode & Battery Block */}
          <div className="flex flex-col justify-between gap-2">
            <button
              onClick={() => setDarkModeEnabled(v => !v)}
              className="flex-1 p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2.5 text-left hover:bg-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[12px] font-semibold block">Dark Mode</span>
                <span className="text-[10.5px] text-white/50">{darkModeEnabled ? 'On' : 'Off'}</span>
              </div>
            </button>

            <div className="flex-1 p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <BatteryCharging className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[12px] font-semibold block">Battery</span>
                <span className="text-[10.5px] text-emerald-400">100% · Power</span>
              </div>
            </div>
          </div>
        </div>

        {/* Display Brightness Slider */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11.5px] text-white/70 font-medium">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-primary-dark" />
              <span>Display</span>
            </span>
            <span>{brightness}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={e => setBrightness(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-full audio-scrubber"
          />
        </div>

        {/* Sound Volume Slider */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11.5px] text-white/70 font-medium">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-primary-dark" />
              <span>Sound Volume</span>
            </span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-full audio-scrubber"
          />
        </div>

        {/* Media Preview Mini */}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
          <img
            src={currentTrack.coverUrl}
            alt=""
            className="w-10 h-10 rounded-md object-cover"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[12px] font-semibold truncate block text-white">
              {currentTrack.title}
            </span>
            <span className="text-[10.5px] text-white/50 truncate block">
              {currentTrack.artist} • {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
