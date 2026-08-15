'use client';

import React, { useRef, useEffect } from 'react';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { useMusicStore } from '@/hooks/useMusicStore';
import { useOSStore } from '@/hooks/useOSStore';

export function AudioVisualizerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const status = useMusicStore(state => state.status);
  const theme = useOSStore(state => state.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const analyser = GlobalAudioManager.getInstance().getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animId = requestAnimationFrame(renderFrame);

      if (analyser && status === 'playing') {
        analyser.getByteFrequencyData(dataArray);
      } else {
        dataArray.fill(0);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let x = 0;

      const accentColor = theme === 'dark' ? '#38bdf8' : '#0284c7';

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = accentColor;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    renderFrame();
    return () => cancelAnimationFrame(animId);
  }, [status, theme]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="audio-visualizer-canvas"
      width={280}
      height={48}
      className="w-full h-12 rounded-lg bg-black/20"
    />
  );
}
