import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { RetroCassettePlayer } from '@/components/music/RetroCassettePlayer';
import { useMusicStore } from '@/hooks/useMusicStore';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';

describe('RetroCassettePlayer Component', () => {
  beforeEach(() => {
    useMusicStore.setState({
      status: 'idle',
      currentIndex: 0,
      currentTime: 0,
      duration: 184,
      volume: 0.8,
      isMuted: false,
      isShuffled: false,
      repeatMode: 'off',
      isDeckExpanded: true,
    });
    useOSStore.setState({
      wallpaperId: 'sonoma-dark',
    });
  });

  it('renders retro SONY Walkman cassette player structure', () => {
    const { getByTestId, getByText } = render(<RetroCassettePlayer />);

    expect(getByTestId('retro-cassette-player')).toBeInTheDocument();
    expect(getByTestId('cassette-body')).toBeInTheDocument();
    expect(getByTestId('cassette-label')).toBeInTheDocument();
    expect(getByTestId('cassette-window')).toBeInTheDocument();
    expect(getByTestId('cassette-reel-left')).toBeInTheDocument();
    expect(getByTestId('cassette-reel-right')).toBeInTheDocument();
    expect(getByText('SONY')).toBeInTheDocument();
    expect(getByText('SIDE A')).toBeInTheDocument();
  });

  it('displays track title and artist on vintage sticker label', () => {
    const { getByTestId } = render(<RetroCassettePlayer />);

    expect(getByTestId('music-track-title')).toHaveTextContent('Midnight in Cupertino');
    expect(getByTestId('music-track-artist')).toHaveTextContent('Synthesizer Society');
  });

  it('animates tape reels ONLY when isPlaying is true', () => {
    useMusicStore.setState({ status: 'playing' });
    const { getByTestId, rerender } = render(<RetroCassettePlayer />);

    const leftSpool = getByTestId('cassette-spool-left');
    expect(leftSpool).toHaveStyle({ animationPlayState: 'running' });

    useMusicStore.setState({ status: 'paused' });
    rerender(<RetroCassettePlayer />);
    expect(leftSpool).toHaveStyle({ animationPlayState: 'paused' });
  });

  it('calculates dynamic tape thickness between feed and take-up spools', () => {
    // At start (currentTime = 0): Left spool thick, Right spool thin
    useMusicStore.setState({ currentTime: 0, duration: 184 });
    const { getByTestId, rerender } = render(<RetroCassettePlayer />);

    const leftTapeStart = getByTestId('cassette-tape-left');
    const rightTapeStart = getByTestId('cassette-tape-right');
    const leftStartWidth = parseFloat(leftTapeStart.style.width);
    const rightStartWidth = parseFloat(rightTapeStart.style.width);

    expect(leftStartWidth).toBeGreaterThan(rightStartWidth);

    // At end (currentTime = 184): Right spool thick, Left spool thin
    useMusicStore.setState({ currentTime: 184, duration: 184 });
    rerender(<RetroCassettePlayer />);

    const leftTapeEnd = getByTestId('cassette-tape-left');
    const rightTapeEnd = getByTestId('cassette-tape-right');
    const leftEndWidth = parseFloat(leftTapeEnd.style.width);
    const rightEndWidth = parseFloat(rightTapeEnd.style.width);

    expect(rightEndWidth).toBeGreaterThan(leftEndWidth);
  });

  it('toggles playback and triggers sound FX on play button click', async () => {
    const playFxSpy = vi.spyOn(GlobalAudioManager.getInstance(), 'playFx');
    const { getByTestId } = render(<RetroCassettePlayer />);

    await act(async () => {
      fireEvent.click(getByTestId('music-play-btn'));
    });

    expect(useMusicStore.getState().status).toBe('playing');
    expect(playFxSpy).toHaveBeenCalledWith('click');
  });

  it('dynamically matches color palette when active wallpaper changes', () => {
    const { getByTestId, rerender } = render(<RetroCassettePlayer />);

    // Default sonoma-dark (#111420 = rgb(17, 20, 32))
    expect(getByTestId('cassette-body')).toHaveStyle({ backgroundColor: 'rgb(17, 20, 32)' });

    // Switch to sequoia-dark (#1c1815 = rgb(28, 24, 21))
    useOSStore.setState({ wallpaperId: 'sequoia-dark' });
    rerender(<RetroCassettePlayer />);
    expect(getByTestId('cassette-body')).toHaveStyle({ backgroundColor: 'rgb(28, 24, 21)' });
  });
});
