# Scope: Milestone 6 — Final Verification & Adversarial Hardening

## Objective
Execute complete verification against the E2E test suite and harden against edge cases:
1. **Phase 1: Pass 100% of E2E Test Suite (Tiers 1-4)**:
   - Poll for `TEST_READY.md`.
   - Run full test runner (`npm test` / Vitest / Playwright).
   - Ensure all 90 interaction test cases and 64 visual criteria pass with zero errors.
   - Decompose any failures by tier, fix with workers, verify with reviewers.
2. **Phase 2: Adversarial Coverage Hardening (Tier 5)**:
   - White-box code coverage and stress testing with Challengers.
   - Generate adversarial test cases targeting race conditions, rapid resizing/dragging, concurrent audio ducking events, touch/mouse mode transitions, window cascade boundary overflows.
   - Worker fixes and Reviewer sign-off.
3. **Phase 3: Forensic Audit & Victory Claim**:
   - Forensic Auditor verification.
   - Validate performance budget (60fps, Lighthouse >= 90).
   - Deliver final handoff and completion report to Sentinel.
