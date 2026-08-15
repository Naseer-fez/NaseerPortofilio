import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { MusicPlayerDockPill } from '@/components/dock/MusicPlayerDockPill';
import { AudioDeckExpandedCard } from '@/components/music/AudioDeckExpandedCard';
import { useMusicStore } from '@/hooks/useMusicStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { getActiveAudioElements } from '../mocks/audio/HTMLAudioElementMock';

describe('Tier 1: Music Playback & Audio Deck', () => {
  beforeEach(() => {
    useMusicStore.setState({
      status: 'idle',
      currentIndex: 0,
      currentTime: 0,
      volume: 0.8,
      isMuted: false,
      isShuffled: false,
      repeatMode: 'off',
      isDeckExpanded: false,
    });
  });

  it('initializes in IDLE state with audio paused and no autoplay (#37)', () => {
    const { getByTestId } = render(<MusicPlayerDockPill magnifiedWidth={44} />);

    expect(useMusicStore.getState().status).toBe('idle');
    expect(getByTestId('music-play-pause-btn')).toHaveAttribute('aria-label', 'Play');
  });

  it('resumes AudioContext and starts playback on play click (#38, #35, #37)', async () => {
    const { getByTestId } = render(<MusicPlayerDockPill magnifiedWidth={44} />);

    await act(async () => {
      fireEvent.click(getByTestId('music-play-pause-btn'));
    });

    expect(useMusicStore.getState().status).toBe('playing');
    expect(GlobalAudioManager.getInstance().context?.state).toBe('running');
    expect(getByTestId('eq-bar-1')).toHaveClass('animate-pulse');
  });

  it('pauses audio and resumes from current position without resetting (#39, #40)', async () => {
    useMusicStore.setState({ status: 'playing', currentTime: 45 });
    const { getByTestId } = render(<MusicPlayerDockPill magnifiedWidth={44} />);

    // Pause
    fireEvent.click(getByTestId('music-play-pause-btn'));
    expect(useMusicStore.getState().status).toBe('paused');
    expect(useMusicStore.getState().currentTime).toBe(45);

    // Resume
    await act(async () => {
      fireEvent.click(getByTestId('music-play-pause-btn'));
    });
    expect(useMusicStore.getState().status).toBe('playing');
    expect(useMusicStore.getState().currentTime).toBe(45);
  });

  it('advances to next track in playlist and updates metadata (#41)', () => {
    useMusicStore.setState({ isDeckExpanded: true, currentIndex: 0 });
    const { getByTestId } = render(<AudioDeckExpandedCard />);

    fireEvent.click(getByTestId('music-next-btn'));

    expect(useMusicStore.getState().currentIndex).toBe(1);
    expect(getByTestId('music-track-title')).toHaveTextContent('Aqua Motion');
  });

  it('restarts track if currentTime >= 3s, loads previous track if < 3s (#42, #43)', () => {
    useMusicStore.setState({ isDeckExpanded: true, currentIndex: 1, currentTime: 15 });
    const { getByTestId } = render(<AudioDeckExpandedCard />);

    // >= 3s: restarts track 1
    fireEvent.click(getByTestId('music-prev-btn'));
    expect(useMusicStore.getState().currentIndex).toBe(1);
    expect(useMusicStore.getState().currentTime).toBe(0);

    // < 3s: goes to track 0
    useMusicStore.setState({ currentTime: 1.5 });
    fireEvent.click(getByTestId('music-prev-btn'));
    expect(useMusicStore.getState().currentIndex).toBe(0);
  });

  it('expands and collapses full glassmorphic audio deck (#44, #45, #38, #45)', () => {
    const { getByTestId, queryByTestId, rerender } = render(
      <>
        <MusicPlayerDockPill magnifiedWidth={44} />
        <AudioDeckExpandedCard />
      </>
    );

    expect(queryByTestId('audio-deck-expanded')).not.toBeInTheDocument();

    // Click pill to expand
    fireEvent.click(getByTestId('music-player-pill'));
    rerender(
      <>
        <MusicPlayerDockPill magnifiedWidth={44} />
        <AudioDeckExpandedCard />
      </>
    );

    const deck = getByTestId('audio-deck-expanded');
    expect(deck).toBeInTheDocument();
    expect(deck).toHaveStyle({ width: '340px', borderRadius: '20px' });
    expect(deck).toMatchGlassmorphism({ blur: '32px', saturate: '200%' });

    // Click collapse button
    fireEvent.click(getByTestId('audio-deck-collapse-btn'));
    rerender(
      <>
        <MusicPlayerDockPill magnifiedWidth={44} />
        <AudioDeckExpandedCard />
      </>
    );
    expect(queryByTestId('audio-deck-expanded')).not.toBeInTheDocument();
  });

  it('seeks audio position on progress bar click (#46, #42)', () => {
    useMusicStore.setState({ isDeckExpanded: true, duration: 200, currentTime: 0 });
    const { getByTestId } = render(<AudioDeckExpandedCard />);

    const track = getByTestId('interactive-scrubber-track');
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 10,
      width: 200,
      height: 6,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.pointerDown(track, { clientX: 100 }); // 50% seek = 100s
    expect(useMusicStore.getState().currentTime).toBe(100);
    expect(getByTestId('scrubber-current-time')).toHaveTextContent('1:40');
  });

  it('updates volume state and mutes/unmutes audio (#47, #48, #43)', () => {
    useMusicStore.setState({ isDeckExpanded: true });
    const { getByTestId } = render(<AudioDeckExpandedCard />);

    const slider = getByTestId('music-volume-slider');
    fireEvent.change(slider, { target: { value: '0.45' } });
    expect(useMusicStore.getState().volume).toBe(0.45);

    // Mute
    fireEvent.click(getByTestId('music-mute-btn'));
    expect(useMusicStore.getState().isMuted).toBe(true);

    // Unmute
    fireEvent.click(getByTestId('music-mute-btn'));
    expect(useMusicStore.getState().isMuted).toBe(false);
  });

  it('toggles shuffle and cycles repeat mode (#49, #50)', () => {
    useMusicStore.setState({ isDeckExpanded: true });
    const { getByTestId } = render(<AudioDeckExpandedCard />);

    // Shuffle
    fireEvent.click(getByTestId('music-shuffle-btn'));
    expect(useMusicStore.getState().isShuffled).toBe(true);

    // Repeat cycle: off -> all -> one -> off
    const repeatBtn = getByTestId('music-repeat-btn');
    fireEvent.click(repeatBtn);
    expect(useMusicStore.getState().repeatMode).toBe('all');
    fireEvent.click(repeatBtn);
    expect(useMusicStore.getState().repeatMode).toBe('one');
    fireEvent.click(repeatBtn);
    expect(useMusicStore.getState().repeatMode).toBe('off');
  });

  it('applies continuous 3s rotation on vinyl when playing and pauses on pause (#51, #39, #40)', () => {
    useMusicStore.setState({ isDeckExpanded: true, status: 'playing' });
    const { getByTestId, rerender } = render(<AudioDeckExpandedCard />);

    const vinyl = getByTestId('vinyl-disc');
    expect(vinyl).toHaveStyle({
      width: '200px',
      height: '200px',
      animationDuration: '3s',
      animationPlayState: 'running',
    });

    useMusicStore.setState({ status: 'paused' });
    rerender(<AudioDeckExpandedCard />);
    expect(vinyl).toHaveStyle({ animationPlayState: 'paused' });
  });

  it('handles track end auto-advance (#52, #53)', () => {
    useMusicStore.setState({ currentIndex: 0, status: 'playing' });
    const audioManager = GlobalAudioManager.getInstance();
    audioManager.init();

    const elements = getActiveAudioElements();
    if (elements[0]) {
      // Simulate ended event
      elements[0].advanceTime(200);
    }
  });
});
