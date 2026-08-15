# Nidal Music Player — Implementation-Ready Analysis
## Source: nidal.dev | Phase 2 Specification Document

**Confidence Classification**: All values tagged [CONFIRMED] from Phase 1 DOM/CSS/Audio API extraction unless noted.

---

## 1. Dual-State Layout System [CONFIRMED]

### Compact Pill (Dock-Integrated)
| Property | Value |
|----------|-------|
| Base Width | `120px` (in dock) |
| Max Width (magnified) | `160px` |
| Height | Matches dock item height (44px base, 68px magnified) |
| Position | Embedded in Luca dock chassis, after divider |
| Background | `rgba(18, 18, 22, 0.85)` with inner gradient [PROBABLE] |
| Border Radius | `12px` (rounded rectangle within pill dock) |
| Layout | `flex row` — artwork, track info, equalizer, play/pause |

### Expanded Audio Deck
| Property | Value |
|----------|-------|
| Z-Index | `z-[9992]` |
| Width | `340px` [PROBABLE] |
| Height | `480px – 520px` [PROBABLE] |
| Position | Anchored above dock, centered on pill |
| Background | `rgba(18, 18, 22, 0.70)` |
| Backdrop Filter | `blur(32px) saturate(200%)` |
| Border | `1px solid rgba(255, 255, 255, 0.12)` |
| Border Radius | `20px` |
| Shadow | `0 24px 48px -12px rgba(0,0,0,0.70), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 1px 0 rgba(255,255,255,0.20)` |
| Entrance | Spring: `y: [20, 0]`, `opacity: [0, 1]` |
| Exit | `y: [0, 12]`, `opacity: [1, 0]`, `duration: 200ms` |

---

## 2. Pill Component Details [CONFIRMED]

| Element | Spec |
|---------|------|
| Artwork Thumbnail | `28px × 28px`, `rounded-md` (6px), object-cover |
| Track Title | `11px`, weight `500`, `#f5f5f7`, single-line truncate with ellipsis |
| Artist Name | `10px`, weight `400`, `rgba(235,235,245,0.65)` |
| Equalizer Bars | 3 bars, `2px` wide, `8-16px` height, animated |
| Play/Pause Button | `24px × 24px`, SVG morph icon |
| Layout Gap | `6px` between elements |

### Equalizer Animation [CONFIRMED]
```css
@keyframes eq-bar-1 { 0%, 100% { height: 4px; } 50% { height: 14px; } }
@keyframes eq-bar-2 { 0%, 100% { height: 8px; } 50% { height: 10px; } }
@keyframes eq-bar-3 { 0%, 100% { height: 6px; } 50% { height: 16px; } }
```
- Duration: `0.8s, 1.2s, 0.6s` (staggered per bar)
- Timing: `ease-in-out`
- Loop: infinite (when playing)
- Paused: bars freeze at current height

---

## 3. Expanded Deck Structure [CONFIRMED]

### Header
| Element | Spec |
|---------|------|
| "NOW PLAYING" Badge | Animated dot (`3px`, green pulse) + label `10px` uppercase, letter-spacing `0.1em` |
| Queue Toggle | `24px` icon button |
| Collapse Button | Chevron-down `24px` icon button |

### Vinyl Disc Assembly [CONFIRMED]
| Property | Value |
|----------|-------|
| Disc Size | `200px × 200px` [PROBABLE] |
| Shape | `rounded-full` |
| Grooves | Concentric rings via radial-gradient |
| Center Label | Album art, `60px × 60px` circle |
| Spin Speed | `360°` per `3s` (`animation: spin 3s linear infinite`) |
| Spin State | Spinning when PLAYING, paused when PAUSED |
| Ejection | Slide transition when changing tracks: `translateX(-20px)`, `opacity: 0` → `translateX(0)`, `opacity: 1` |

### Album Art Card [CONFIRMED]
| Property | Value |
|----------|-------|
| Size | `200px × 200px` [PROBABLE] |
| Border Radius | `12px` |
| Shadow | `0 8px 24px rgba(0,0,0,0.4)` |
| Position | Overlapping vinyl disc (layered in front) |

### Track Metadata [CONFIRMED]
| Element | Spec |
|---------|------|
| Track Title | `16px`, weight `600`, `#f5f5f7` |
| Artist/Album | `13px`, weight `400`, `rgba(235,235,245,0.65)` |
| Alignment | Center-aligned below artwork |

---

## 4. Controls [CONFIRMED]

### Transport Controls
| Button | Size | Icon | Behavior |
|--------|------|------|----------|
| Shuffle | `20px` | Shuffle icon | Toggle on/off, tint when active |
| Previous | `28px` | Skip-back | Previous track (or restart if >3s elapsed) |
| Play/Pause | `44px` | Play ↔ Pause SVG morph | Toggle playback |
| Next | `28px` | Skip-forward | Next track |
| Repeat | `20px` | Repeat icon | Cycle: off → all → one |

### Progress Scrubber [CONFIRMED]
| Property | Value |
|----------|-------|
| Track Height | `4px` (default), `6px` (hover) |
| Track Color | `rgba(255,255,255,0.15)` |
| Progress Fill | Accent color (track `themeColor` or `#0a84ff`) |
| Scrub Handle | `12px` circle, visible on hover |
| Hover Tooltip | Timestamp at cursor position (e.g., "01:45") |
| Time Labels | `11px`, weight `400`, left: elapsed, right: remaining |
| Seeking | Drag scrub handle updates `currentTime` in real-time |

### Volume Slider [CONFIRMED]
| Property | Value |
|----------|-------|
| Track Height | `3px` |
| Track Color | `rgba(255,255,255,0.12)` |
| Fill Color | `rgba(255,255,255,0.65)` |
| Handle | `10px` circle |
| Range | `0.0 – 1.0` |
| Mute Button | Volume icon, click toggles mute |

---

## 5. Audio Pipeline [CONFIRMED]

### Hybrid Architecture
```
HTML5 <audio> element (streaming, hardware decode)
    │
    ├──► MediaElementSourceNode
    │       │
    │       ├──► GainNode (music volume) ──┐
    │       │                               │
    │       └──► AnalyserNode (FFT) ────────┤
    │                                       │
    └──────────────────────────────────────► MasterGainNode ──► AudioContext.destination
```

### AudioContext Setup [CONFIRMED]
| Component | Purpose |
|-----------|---------|
| `AudioContext` | Singleton — shared with Irfan procedural FX via GlobalAudioManager |
| `MediaElementSourceNode` | Bridges HTML5 `<audio>` to Web Audio graph |
| `AnalyserNode` | FFT data for canvas visualizer (fftSize: 64) |
| `GainNode` (music) | Volume control + ducking target |
| `GainNode` (master) | Global master volume |

### Canvas FFT Visualizer [CONFIRMED]
| Property | Value |
|----------|-------|
| Canvas Size | Full width of deck, `60px` height [PROBABLE] |
| FFT Size | `64` (32 frequency bins) |
| Render | `requestAnimationFrame` loop |
| Bar Width | `canvas.width / binCount` |
| Bar Color | Track accent color at varying opacity |
| Frame Rate | 60fps |

---

## 6. States [CONFIRMED]

| State | Visual Indicator | Behavior |
|-------|-----------------|----------|
| IDLE | Play icon, no artwork rotation | No audio loaded or playback never started |
| LOADING | Spinner or pulse animation | Audio source loading/buffering |
| BUFFERING | Brief spinner | Network stall during playback |
| PLAYING | Pause icon, vinyl spinning, equalizer animated | Audio playing |
| PAUSED | Play icon, vinyl paused, equalizer frozen | Audio paused |
| ENDED | Play icon, vinyl stopped | Track completed, advance to next (unless repeat-one) |
| ERROR | Error icon, muted colors | Audio load/decode failure |

### State Transitions
```
IDLE ──[play]──► LOADING ──[canplay]──► PLAYING
PLAYING ──[pause]──► PAUSED ──[play]──► PLAYING
PLAYING ──[ended]──► ENDED ──[auto-next]──► LOADING
PLAYING ──[stall]──► BUFFERING ──[resume]──► PLAYING
ANY ──[error]──► ERROR
```

---

## 7. Persistence (localStorage) [CONFIRMED]

| Key | Value | Purpose |
|-----|-------|---------|
| `music_currentIndex` | Number | Resume at same track |
| `music_currentTime` | Number (seconds) | Resume at same position |
| `music_volume` | Number (0-1) | Restore volume |
| `music_isMuted` | Boolean | Restore mute state |
| `music_isShuffle` | Boolean | Restore shuffle |
| `music_repeatMode` | `"off" \| "all" \| "one"` | Restore repeat mode |

---

## 8. Media Session API [CONFIRMED]

```javascript
navigator.mediaSession.metadata = new MediaMetadata({
  title: track.title,
  artist: track.artist,
  album: track.album,
  artwork: [{ src: track.coverArt, sizes: '512x512', type: 'image/png' }]
});

navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
navigator.mediaSession.setActionHandler('seekto', (details) => seekTo(details.seekTime));
```

---

## 9. Mobile Behavior [CONFIRMED]

| Viewport | Component | Spec |
|----------|-----------|------|
| <768px | Compact Player | `44px` sticky bar above tab bar |
| <768px | Bar Position | `bottom: 52px + env(safe-area-inset-bottom)` |
| <768px | Bar Content | Mini artwork (28px), title, play/pause button |
| <768px | Expand | Tap bar → fullscreen bottom sheet |
| <768px | Vinyl/Visualizer | Available in expanded sheet |

---

## 10. Audio Ducking Integration [CONFIRMED]

| Event | Music Gain Target | Duration | Time Constant |
|-------|-------------------|----------|---------------|
| UI sound trigger | `0.20 × G_rest` (duck to 20%) | 40ms | $\tau_{duck} = 0.040s$ |
| UI sound complete | Restore to `G_rest` | 250ms | $\tau_{restore} = 0.250s$ |

$$G_{music}(t) = G_{ducked} + (G_{rest} - G_{ducked}) \cdot (1 - e^{-(t-t_1)/\tau_{restore}})$$

---

## 11. Critical Constraint

> **Audio MUST NOT auto-start.** The music player initializes in IDLE state. Playback requires explicit user interaction (click/tap on play button). AudioContext is created/resumed inside the first user gesture handler to comply with browser autoplay policies (especially iOS Safari).

