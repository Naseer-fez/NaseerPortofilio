# Milestone 1: Adversarial Challenge Report — useOSStore & Window Management

## Challenge Summary

**Target Module**: `src/hooks/useOSStore.ts` & Window Management State Machine  
**Test Suite**: `tests/hooks/useOSStore.stress.test.ts` (24 adversarial stress tests)  
**Execution Command**: `npx vitest run tests/hooks/useOSStore.stress.test.ts`  
**Overall Risk Assessment**: MEDIUM  
**Verdict**: 24/24 stress tests passing (including empirical bug regression tests). 1 State Machine Bug Identified, 2 Edge Cases Cataloged.

---

## 1. Executive Summary & Verification Matrix

| Challenge Area | Test Scenarios | Result | Blast Radius |
|---|---|---|---|
| **1. Rapid Lifecycle Cycles** | 500-step randomized open/close fuzzing, 10 app-burst permutations, idempotent duplicate calls | **PASS** | State integrity maintained across rapid cycles. |
| **2. zIndex Compaction [20..49]** | 1,000 focus cycles, boundary saturation at 49, relative visual stacking order invariance | **PASS** | Normalization resets zIndex to `[20..25]` while strictly preserving relative layer order. |
| **3. Focus Delegation Chains** | 5-window cascade close/minimize, delegation skipping minimized windows, restore activation, background mutations | **PASS** | Topmost remaining unminimized window reliably inherits focus. |
| **4. Drag & Clamping Boundaries** | Extreme coordinates (`±999,999`), `y >= 28px`, 100px overhang bounds, minSize per app, maximize bounds restoration | **PASS** | macOS clamping rules enforced across all viewport dimensions. |
| **5. Storage & Persistence** | Corrupted JSON in localStorage, out-of-bounds volume values, key synchronization | **PASS** | Graceful fallback without unhandled parse exceptions. |

---

## 2. Empirical Findings & Bug Reports

### [MEDIUM] Finding 1: `toggleMaximize` on Minimized Window Creates Contradictory State (`BUG-M1-01`)
- **Observed Behavior**: When `toggleMaximize(id)` is invoked on a window that is open but minimized (`isOpen: true`, `isMinimized: true`), `useOSStore` sets `activeWindowId: id`, `isFocused: true`, and `isMaximized: true`, but **fails to set `isMinimized: false`**.
- **Impact / Blast Radius**: The window enters an illegal dual state (`isMinimized: true` AND `isFocused: true`). The `WindowManager` does not render minimized windows (`if (win.isMinimized) return null;`), yet the OS store treats it as the active, focused window. Keyboard shortcuts and focus delegation are redirected to a hidden window.
- **Root Cause** (`src/hooks/useOSStore.ts:234-298`):
  ```typescript
  // In toggleMaximize:
  windows[id] = {
    ...target, // Retains target.isMinimized: true!
    isMaximized: true,
    isFocused: true,
    zIndex: Math.min(nextZIndex, 49),
    ...
  };
  ```
- **Recommended Mitigation**:
  Either reject maximization when minimized:
  ```typescript
  if (!target || !target.isOpen || target.isMinimized) return;
  ```
  Or explicitly un-minimize when maximizing:
  ```typescript
  isMinimized: false,
  ```

---

### [LOW] Finding 2: `setSoundVolume(NaN)` Produces `NaN` in Store State (`EDGE-M1-02`)
- **Observed Behavior**: Calling `setSoundVolume(NaN)` results in `soundVolume: NaN` because `Math.max(0, Math.min(1, NaN))` evaluates to `NaN` in JavaScript.
- **Impact / Blast Radius**: Audio components consuming `soundVolume` could pass `NaN` to WebAudio `GainNode.gain.value`, throwing TypeError in strict WebAudio contexts.
- **Recommended Mitigation**:
  ```typescript
  setSoundVolume: (soundVolume: number) =>
    set({ soundVolume: Number.isFinite(soundVolume) ? Math.max(0, Math.min(1, soundVolume)) : 0.5 }),
  ```

---

### [LOW] Finding 3: `normalizeZIndices` Uncapped if App Registry Exceeds 29 Apps (`EDGE-M1-03`)
- **Observed Behavior**: `normalizeZIndices` assigns `20 + i` for each registered window (`src/hooks/useOSStore.ts:26`). If a user dynamically registers > 29 apps via `registerApp`, `20 + i` will exceed the macOS Layer 2 upper bound of 49.
- **Impact / Blast Radius**: Currently safe because default apps = 6 (indices 20..25), but unsafe under dynamic app extension.
- **Recommended Mitigation**:
  Clamp `Math.min(20 + i, 49)` during normalization loop.

---

## 3. Stress Test Logs & Evidence

### Test Suite Execution:
```bash
$ npx vitest run tests/hooks/useOSStore.stress.test.ts

 RUN  v2.1.9 D:/CODE/Html/Showcase

 ✓ tests/hooks/useOSStore.stress.test.ts (24 tests) 217ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  14:58:23
   Duration  2.31s
```

### Verified Test Cases:
1. `Task 1: handles sequential opening and reverse closing across all 6 default apps` (PASS)
2. `Task 1: handles rapid interleaved open/close cycles across all 6 apps (500 iterations)` (PASS)
3. `Task 1: handles rapid burst opening all 6 apps in 10 different permutations` (PASS)
4. `Task 1: handles rapid consecutive duplicate open/close calls idempotently` (PASS)
5. `Task 2: spawns/focuses windows repeatedly until zIndex reaches 49, verifying compaction to [20..49]` (PASS)
6. `Task 2: strictly maintains relative visual stacking order of background windows during compaction` (PASS)
7. `Task 2: survives 1,000 rapid focus cycles without zIndex leakage or state corruption` (PASS)
8. `Task 2: handles compaction at boundary maxZIndex = 49 when opening closed window` (PASS)
9. `Task 3: delegates focus down the 5-window chain as active windows are progressively closed` (PASS)
10. `Task 3: delegates focus down the 5-window chain as active windows are progressively minimized` (PASS)
11. `Task 3: delegates focus skipping already-minimized windows` (PASS)
12. `Task 3: restores minimized window and promotes it to active focus immediately` (PASS)
13. `Task 3: closing or minimizing a background (unfocused) window does not disrupt active window focus` (PASS)
14. `Task 4: clamps y strictly >= 28 (MENU_BAR_HEIGHT) under extreme negative coordinates` (PASS)
15. `Task 4: enforces 100px minimum overhang bounds on left and right viewport edges` (PASS)
16. `Task 4: clamps bottom drag so at least 40px of window header stays reachable in viewport` (PASS)
17. `Task 4: enforces minSize constraints across all 6 default apps during resize` (PASS)
18. `Task 4: un-maximizes window automatically when updatePosition or updateSize is invoked` (PASS)
19. `Task 4: maximizes to full viewport minus 28px and restores exact prevBounds on toggle` (PASS)
20. `Task 5: clamps soundVolume strictly to [0, 1] range on invalid or extreme inputs` (PASS)
21. `Task 5: recovers gracefully from corrupted JSON stored in localStorage` (PASS)
22. `Task 5: persists and updates os-theme and os-wallpaper keys in localStorage` (PASS)
23. `BUG-M1-01: toggleMaximize on a minimized window creates illegal dual isMinimized+isFocused state` (PASS - empirically verified)
24. `EDGE-M1-02: setSoundVolume with NaN results in NaN volume state instead of safe fallback` (PASS - empirically verified)
