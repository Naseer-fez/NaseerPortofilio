# Music Player Visual Mockup & Structural Captures (`nidal.dev`)

**Target Reference**: `nidal.dev`  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`

---

## 1. Compact Mini-Player Capsule Wireframe `[CONFIRMED]`

```
+---------------------------------------------------------------------------------------------------------+
| [ (💽) ]   Midnight City Drive                            [⏮ 32px]   [ ⏯ 40px ]   [⏭ 32px]   [ ⌃ ]   | (h: 68px)
|  (44px)    Synthwave Collective — 01:24 / 03:45  [||||]                                                 |
| ════════════════════════════════════════════════════════════════════════════════════════════════════════| (Micro-scrubber 2px)
+---------------------------------------------------------------------------------------------------------+
 (w: 340px, rounded-full, backdrop-blur: 24px, fixed bottom: 24px, right: 24px)
```

---

## 2. Expanded Popover Modal Wireframe `[CONFIRMED]`

```
+---------------------------------------------------------------------------------+
| [ ▼ Minimize ]                    Now Playing                    [ ☰ Playlist ] | (Header 44px)
|                                                                                 |
|                                ┌───────────────┐                                |
|                                │  . - ~ ~ - .  │                                |
|                                │ /   ( O )   \ │                                |
|                                │ \  (Label)  / │                                |
|                                │  ' - _ _ - '  │                                |
|                                └───────────────┘                                |
|                            (220px Spinning Vinyl Disc)                          |
|                                                                                 |
|                            Midnight City Drive                                  | (SF Pro Bold 18px)
|                            Synthwave Collective                                 | (SF Pro Muted 14px)
|                                                                                 |
| 01:24 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●─────────────────────────────────── 03:45   | (Scrubber Track)
|                                                                                 |
|          [ 🔀 ]        [ ⏮ ]       [   ⏯ 52px   ]       [⏭]        [ 🔁 ]      | (Controls Cluster)
|                                                                                 |
| [ 🔈 ] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ [ 🔊 ]  | (Volume Slider)
+---------------------------------------------------------------------------------+
 (w: 380px, h: 520px, rounded-2xl, floating popover)
```
