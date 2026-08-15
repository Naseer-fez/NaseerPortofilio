# Music Player Visual Motion & Audio Visualizer Physics (`nidal.dev`)

**Target Reference**: `nidal.dev` (Music Player Widget Component)  
**Document**: 33.3 RPM Vinyl Rotation, Momentum Deceleration, 4-Band FFT Equalizer & Ticker Marquee  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Vinyl Disc Turntable Rotation Physics

```
            . - ~ ~ ~ - .
        . '       _ _       ' .
      /       . '     ' .       \
     /       /     O     \       \
    |       |   (Label)   |       |    Rotation: 360° per 4.0s (33.3 RPM simulation)
     \       \     _     /       /     CSS Animation: @keyframes vinyl-rotate
      \       ' . _ _ . '       /
        ' .                   ' .
            ' - ~ ~ ~ - '
```

### 1.1 CSS Rotation Keyframe `[CONFIRMED]`
```css
@keyframes vinyl-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.vinyl-disc {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: radial-gradient(circle at center, #1a1a1a 0%, #111111 70%, #000000 100%);
  animation: vinyl-rotate 4s linear infinite;
  animation-play-state: paused;
  will-change: transform;
}

.vinyl-disc.is-playing {
  animation-play-state: running;
}
```

---

### 1.2 Momentum Inertia Deceleration Model `[INFERRED]`
When pausing audio, instead of freezing instantly, physical inertia is simulated via an angular velocity decay equation:

$$\theta_{t+1} = \theta_t + \omega_t \cdot \Delta t$$
$$\omega_{t+1} = \omega_t \cdot \mu \quad (\text{where friction coefficient } \mu = 0.94) \quad [INFERRED]$$

```javascript
class VinylMomentumAnimator {
  constructor(element) {
    this.el = element;
    this.angle = 0;
    this.velocity = 0;
    this.targetVelocity = 0;
    this.maxVelocity = 0.09; // deg/ms (360 deg / 4000 ms)
  }

  play() {
    this.targetVelocity = this.maxVelocity;
    this.tick();
  }

  pause() {
    this.targetVelocity = 0;
  }

  tick() {
    this.velocity += (this.targetVelocity - this.velocity) * 0.08;
    this.angle = (this.angle + this.velocity * 16.67) % 360;
    this.el.style.transform = `rotate(${this.angle.toFixed(2)}deg)`;
    if (this.velocity > 0.0001 || this.targetVelocity > 0) {
      requestAnimationFrame(() => this.tick());
    }
  }
}
```

---

## 2. 4-Band Audio Equalizer Visualizer

Kinetic feedback visualizer indicating active audio stream emission:

```
[Bar 1: Sub]   [Bar 2: Low]   [Bar 3: Mid]   [Bar 4: High]
     ||             ||||            ||            |||||
     ||             ||||            ||            |||||
```

### 2.1 CSS Keyframe Fallback Mode `[CONFIRMED]`
```css
@keyframes eq-1 { 0%, 100% { transform: scaleY(0.2); } 50% { transform: scaleY(0.9); } }
@keyframes eq-2 { 0%, 100% { transform: scaleY(0.7); } 50% { transform: scaleY(0.3); } }
@keyframes eq-3 { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1.0); } }
@keyframes eq-4 { 0%, 100% { transform: scaleY(0.8); } 50% { transform: scaleY(0.4); } }

.player-mini-equalizer .eq-bar {
  width: 3px;
  height: 14px;
  background-color: var(--color-primary, #0066cc);
  border-radius: 2px;
  display: inline-block;
  transform-origin: bottom center;
  margin: 0 1px;
}

.player-mini-equalizer.is-active .eq-bar-1 { animation: eq-1 0.80s ease-in-out infinite; }
.player-mini-equalizer.is-active .eq-bar-2 { animation: eq-2 0.65s ease-in-out infinite 0.15s; }
.player-mini-equalizer.is-active .eq-bar-3 { animation: eq-3 0.90s ease-in-out infinite 0.30s; }
.player-mini-equalizer.is-active .eq-bar-4 { animation: eq-4 0.75s ease-in-out infinite 0.10s; }
```

---

## 3. Track Title Marquee Ticker

When a track title exceeds the $120\text{px}$ text container width, a smooth alternating marquee animation activates `[CONFIRMED]`:

```css
@keyframes marquee-scroll {
  0%, 15% { transform: translateX(0%); }
  85%, 100% { transform: translateX(calc(-100% + 120px)); }
}

.player-title-marquee.is-overflowing {
  display: inline-block;
  animation: marquee-scroll 8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
}
```
