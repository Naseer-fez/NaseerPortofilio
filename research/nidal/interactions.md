# Music Player Interactions, FSM & Audio Lifecycle (`nidal.dev`)

**Target Reference**: `nidal.dev` (Music Player Widget Component)  
**Document**: 6-State FSM, Audio Controls, Scrubber Drag, Logarithmic Volume & Strict Autoplay Compliance  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Formal 6-State Playback Finite State Machine (FSM)

The audio player engine implements a deterministic state machine strictly adhering to browser media event lifecycles:

```
                          ┌───────────────────┐
                          │                   │
                          │     [ IDLE ]      │<────────────────────────┐
                          │                   │                         │
                          └─────────┬─────────┘                         │
                                    │ User Gesture: Click Play          │
                                    ▼                                   │
                          ┌───────────────────┐                         │
        ┌────────────────>│   [ LOADING ]     │                         │
        │                 │  (Buffering/Src)  │                         │
        │                 └─────────┬─────────┘                         │
        │                           │ canplaythrough                    │
        │                           ▼                                   │
   Select Track           ┌───────────────────┐                  Media Error
        │                 │   [ PLAYING ]     ├────────────────────────>│
        │                 │ (Audio Emitting)  │                         │
        │                 └───┬───────────┬───┘                         │
        │                     │           │                             │
        │          Click Pause│           │PointerDown Scrubber         │
        │                     ▼           ▼                             │
        │             ┌───────────┐   ┌───────────┐                     │
        └─────────────┤  PAUSED   │   │  SEEKING  │                     │
                      └─────┬─────┘   └─────┬─────┘                     │
                            │               │ Commit Seek (PointerUp)   │
                            ▼               ▼                           │
                      [ PLAYING / PAUSED ] ─────────────────────────────┘
```

### 1.1 State Transition Matrix `[CONFIRMED]`

| Current State | Trigger / Media Event | Target State | Internal Actions & Side Effects |
|---|---|---|---|
| `IDLE` | `PLAY_TRIGGERED` (User Click) | `LOADING` | Resumes `AudioContext`, loads `audio.src`, calls `audio.play()`. |
| `IDLE` | `SELECT_TRACK(i)` | `IDLE` | Updates track metadata, sets `audio.src`, sets `currentTime = 0`. |
| `LOADING` | `EVENT: canplaythrough` | `PLAYING` | Resolves play promise, starts vinyl spin, starts FFT visualizer loop. |
| `LOADING` | `EVENT: error` | `ERROR` | Sets error notice, logs diagnostic, provides fallback retry. |
| `PLAYING` | `PAUSE_TRIGGERED` | `PAUSED` | `audio.pause()`, decelerates vinyl rotation to halt, halts FFT loop. |
| `PLAYING` | `EVENT: waiting` (Buffer Underrun) | `LOADING` | Temporarily pauses visualizer, displays loading pulse. |
| `PLAYING` | `SEEK_START` (PointerDown) | `SEEKING` | Pauses `timeupdate` UI overrides, enters optimistic drag tracking. |
| `PLAYING` | `EVENT: ended` | `LOADING`/`PLAYING`/`IDLE`| Repeats track (`ONE`), advances track (`ALL`), or transitions to `IDLE`. |
| `PAUSED` | `PLAY_TRIGGERED` | `PLAYING` | `audio.play()`, resumes vinyl rotation from current angle, starts FFT. |
| `SEEKING` | `SEEK_UPDATE` (PointerMove) | `SEEKING` | Updates seek tooltip timestamp (`m:ss`) and progress fill width. |
| `SEEKING` | `SEEK_END` (PointerUp) | `PLAYING`/`PAUSED` | Sets `audio.currentTime = targetTime`, releases pointer capture. |
| `ERROR` | `RETRY` / `SELECT_TRACK` | `LOADING` | Clears error message, reloads audio source stream. |

---

## 2. Strict Autoplay Policy Compliance `[CONFIRMED]`

1. **Mandatory User Gesture**: Audio playback is **strictly prohibited from auto-starting** on initial page load.
2. **Initial Runtime State**: The widget initializes strictly in the `PAUSED` / `IDLE` state (`isPlaying = false`) `[CONFIRMED]`.
3. **Suspended AudioContext**: `AudioContext` is created in `'suspended'` state; `audioContext.resume()` is executed **only inside the explicit user click handler** of the Play button `[CONFIRMED]`.

---

## 3. Interactive Feature Mechanics

### 3.1 Seek Scrubber Drag Mathematics `[CONFIRMED]`
- **Seek Ratio**:
  $$\text{Ratio} = \text{clamp}\left(\frac{e.\text{clientX} - \text{rect.left}}{\text{rect.width}}, 0.0, 1.0\right)$$
  $$\text{TargetSeconds} = \text{Ratio} \times \text{audio.duration}$$
- **Pointer Capture**: `onPointerDown` captures pointer via `e.target.setPointerCapture(e.pointerId)` to ensure unbroken seeking even if the cursor moves outside the slider bounds `[CONFIRMED]`.

### 3.2 Logarithmic Volume Curve `[INFERRED]`
$$\text{Gain} = (\text{sliderValue})^2 \quad \text{where } \text{sliderValue} \in [0.0, 1.0]$$
- Accurately models the human ear's non-linear acoustic perception.
- Mute toggle preserves `lastVolume` for one-click restoration `[CONFIRMED]`.

### 3.3 Shuffle & Repeat Tri-State Modes `[CONFIRMED]`
- **Shuffle**: Implements in-memory Fisher-Yates index permutation without mutating the underlying playlist.
- **Repeat (`OFF` / `ALL` / `ONE`)**: Loops entire playlist continuously (`ALL`) or repeats active track indefinitely (`ONE`).
