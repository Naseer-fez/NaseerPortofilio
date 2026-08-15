# Portfolio Dataset Generation Changes

## Overview
Generated the comprehensive 18-project portfolio dataset matching the required JSON schema and specifications, saving it identically to both target locations:
1. `d:\CODE\Html\Showcase\portfolio_research\projects.json`
2. `d:\CODE\Html\Showcase\src\data\projects.json`

## Specification & Validation Breakdown
- **Total Projects**: Exactly 18 real, verified engineering projects.
- **Featured Projects**: Exactly 5 projects flagged with `featured: true`:
  1. NasCloud (PersonalDrive) — `CLOUD`
  2. apirlpy (API Rate Limiter) — `SYSTEMS`
  3. TapNap Ephemeral Sharing — `FULL STACK`
  4. macOS Portfolio OS — `CREATIVE`
  5. Project Jarvis AI Desktop OS — `AI / ML`
- **Remaining Specialized Projects**: 13 projects with `featured: false` across `AI / ML`, `SYSTEMS`, `CREATIVE`, `DATABASE`, and `DEVOPS`.
- **Domain Coverage**:
  - `SYSTEMS`: 6 projects (apirlpy, Taskbar Engine, Dates C-Extension Engine, Secure Password Generator, Phone Contact Manager, DSA Journey)
  - `AI / ML`: 4 projects (Project Jarvis, Credit Score Predictor, Real Estate Pipeline, Spotify Music Recommendation Engine)
  - `FULL STACK`: 1 project (TapNap Ephemeral Sharing)
  - `CLOUD`: 1 project (NasCloud)
  - `CREATIVE`: 2 projects (macOS Portfolio OS, LiveWallpaper Engine)
  - `DATABASE`: 3 projects (Student Records System, Hospital Ward Management, Fitness Tracker CLI & Analytics)
  - `DEVOPS`: 1 project (My-Codes Multi-Repo Orchestrator)
- **Visible Technologies & Tagging**: Visible technologies array formatted with 4-5 key technologies and `+N` indicator where appropriate.
- **Links & Metrics**:
  - 100% of `githubUrl` links point to verified `https://github.com/Naseer-fez/...` repositories.
  - `demoUrl` links point to valid PyPI or repository endpoints.
  - Zero fabricated metrics; all metrics represent verified technical features and capabilities.

## Verification & Integrity
- Syntactically validated via Node.js script comparing ASTs and field constraints.
- Confirmed full identical hash between `portfolio_research/projects.json` and `src/data/projects.json`.
- Full project test suite ran: 38 test suites passed (399 tests passing).
