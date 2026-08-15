import React from 'react';
import { useAudio } from '../../context/AudioContext';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, className = '' }) => {
  const { visualizerData } = useAudio();

  const bars = [
    { key: 'sub', height: isPlaying ? Math.max(0.2, visualizerData.subBass) : 0.15 },
    { key: 'low', height: isPlaying ? Math.max(0.2, visualizerData.lowMid) : 0.15 },
    { key: 'mid', height: isPlaying ? Math.max(0.2, visualizerData.highMid) : 0.15 },
    { key: 'high', height: isPlaying ? Math.max(0.2, visualizerData.treble) : 0.15 },
  ];

  return (
    <div
      className={`flex items-end space-x-1 h-5 px-1 ${className}`}
      role="img"
      aria-label="Real-time Audio Equalizer Visualizer"
    >
      {bars.map(bar => (
        <span
          key={bar.key}
          className="w-1 bg-primary-dark rounded-xs transition-all duration-75"
          style={{
            height: '100%',
            transform: `scaleY(${bar.height})`,
            transformOrigin: 'bottom center',
          }}
        />
      ))}
    </div>
  );
};
