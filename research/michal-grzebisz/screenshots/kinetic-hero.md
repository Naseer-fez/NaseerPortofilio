# Kinetic Hero Visual Mockup & Structural Captures (`michalgrzebisz.com`)

**Target Reference**: `michalgrzebisz.com`  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`

---

## 1. Full-Bleed Kinetic Hero Viewport Structural Wireframe `[CONFIRMED]`

```
+-----------------------------------------------------------------------------------------------------------------------------+ (0, 0)
| Michał Grzebisz                                                                                    ● Available for Projects | (Top Row)
| Design Engineer & Creative Technologist                                                              (Emerald Pulse Beacon) |
|                                                                                                                             |
|                                                                                                                             |
|                                                                                                                             |
|                                                    [ Pointer (x, y) ]                                                       |
|                                                            │                                                                |
|                                                            ▼                                                                |
|                           M  i  c  h  a  ł      G  r  z  e  b  i  s  z                                                      |
|                          (300)(350)(450)(650)(850) (850)(700)(500)(350)(300)                                                |
|                          └─── Dynamic Weight Swelling wght: 300 -> 850 ───┘                                                 |
|                                                                                                                             |
|                                                                                                                             |
|                                                                                                                             |
| Warsaw, PL — 52.2297° N, 21.0122° E                                                                     Scroll to Explore ↓ | (Bottom Row)
| 13:01 CET (Local Tabular Time)                                                                       (Magnetic Micro-Pull)  |
+-----------------------------------------------------------------------------------------------------------------------------+ (W, H)
```

---

## 2. Kinetic Deformation Field Diagram `[CONFIRMED]`

```
                                 [ Cursor Point (xm, ym) ]
                                             │
                       ◄────── Influence Radius R = 220px ──────►
                                             │
      Char (i-2)             Char (i-1)      │      Char (i)             Char (i+1)
  ┌────────────────┐      ┌─────────────┐    │   ┌────────────┐       ┌─────────────┐
  │      'a'       │      │     'ł'     │    │   │    'G'     │       │     'r'     │
  │   wght: 420    │      │  wght: 720  │    │   │ wght: 850  │       │  wght: 680  │
  │  scale: 1.02   │      │ scale: 1.08 │    │   │scale: 1.12 │       │ scale: 1.07 │
  │  disp: -2.1px  │      │ disp: -5.4px│    │   │disp: +1.2px│       │ disp: +4.8px│
  └────────────────┘      └─────────────┘    │   └────────────┘       └─────────────┘
                                             │
                                             ▼
                      [ Cosine Bell Falloff Curve f(d) = cos^2(pi*d/2R) ]
```
