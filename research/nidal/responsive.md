# Music Player Responsive Adaptation Matrix (`nidal.dev`)

**Target Reference**: `nidal.dev` (Music Player Widget Component)  
**Document**: Fixed Desktop Floating vs Docked Mobile Pill & 8-Breakpoint Strategy  
**Classification Standard**: `[CONFIRMED]`, `[INFERRED]`, `[ESTIMATED]`, `[UNKNOWN]`  
**Design System Anchor**: `d:\CODE\Html\test\design.md`

---

## 1. Responsive Viewport Adaptation Matrix (8 Breakpoints)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Responsive Adaptation Matrix                                                                       │
│                                                                                                    │
│ Viewport Width     Layout Mode      Anchor / Placement        Widget Dimensions    Controls Visible│
│ -----------------  ---------------  ------------------------  -------------------  --------------  │
│ 320px              Docked Pill      Bottom: 12px, Centered    calc(100%-24px)×58px Compact (Play/N)│
│ 375px              Docked Pill      Bottom: 12px, Centered    calc(100%-24px)×60px Compact (Play/N)│
│ 425px              Docked Pill      Bottom: 16px, Centered    380px max × 64px     Compact + Prev  │
│ 640px              Floating Capsule Bottom: 16px, Right: 16px 300px × 64px         Compact Full    │
│ 768px              Floating Capsule Bottom: 20px, Right: 20px 320px × 68px         Full Compact    │
│ 1024px             Floating Capsule Bottom: 24px, Right: 24px 340px × 68px         Full Compact+Vol│
│ 1440px             Floating Capsule Bottom: 24px, Right: 24px 340px × 68px         Full Standard   │
│ 1920px             Locked Floating  Bottom: 32px, Right: 32px 360px × 72px         Full Standard   │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Breakpoint Mechanics

1. **320px – 425px (Mobile Phones)** `[CONFIRMED]`:
   - Capsule docks horizontally: `left: 12px; right: 12px; bottom: 12px; width: calc(100% - 24px)` `[CONFIRMED]`.
   - Artwork scales to `36px × 36px` on 320px.
   - Expanded player renders as an $85\text{vh}$ bottom sheet modal with downward swipe-to-dismiss gesture `[INFERRED]`.

2. **640px – 768px (Tablets & Foldables)** `[CONFIRMED]`:
   - Shifts from docked bar to floating bottom-right capsule: `bottom: 20px; right: 20px; width: 320px; height: 68px` `[CONFIRMED]`.
   - Expanded mode renders as a floating popover card `[CONFIRMED]`.

3. **1024px – 1920px (Desktop Displays)** `[CONFIRMED]`:
   - Fixed floating capsule locked at `bottom: 24px; right: 24px; width: 340px; height: 68px` `[CONFIRMED]`.
   - Popover card ($380\text{px} \times 520\text{px}$) floats `12px` above capsule with spring physics `[CONFIRMED]`.
