# Plan: GitHub Portfolio Dataset Generation (Naseer-fez)

## Objective
Analyze all public repositories of `https://github.com/Naseer-fez` and generate an evidence-backed, schema-compliant portfolio dataset of the top 15–20 real projects in `portfolio_research/projects.json` and `src/data/projects.json`.

## Milestone Decomposition

### Milestone 1: Comprehensive Repository Enumeration & Deep Inspection
- **Explorer 1 (Systems, Low-Level, Utilities, Performance & Algorithms)**:
  - Inspect repositories: `Api_RateLimiter`, `Dates`, `Taskbarengine`, `Livewallpaper`, `DSA-Journey`, `Minesweeper_game`, `Tetris`, `Phone-Contract`, `Student_Records`, `ToDoList`, `Restaurant_Management_Demo`, `Hosplital_Managment`.
  - Extract: exact technologies, architecture, concurrency models, verified metrics (e.g. 100k simulated clients, 64-thread workloads, PyPI package, 0 temp disk writes), verified GitHub/PyPI URLs.
- **Explorer 2 (AI / ML, Data Science, Math Models & Automation)**:
  - Inspect repositories: `Credit_Score_Predictor`, `Real-Estate-Pipeline`, `music_rec`, `Project_Jarvis`, `Simple_ChatBot`, `Ordinary-Least-Squares-`, `Whisper` dictation.
  - Extract: model architectures (Random Forest, Ridge Regression, OLS matrix inversion, content-based filtering, regex NLP, speech recognition), training datasets, verified metrics, repo URLs.
- **Explorer 3 (Full Stack, Cloud, Backend, Creative & Desktop OS)**:
  - Inspect repositories: `PersonalDrive` (NasCloud), `TapNap-Backend`, `TapNap`, `NaseerPortofilio` (Showcase OS), `Fitness_Tracker`, `Pass_Gen`, `Messaging-Portal`, `My-Codes`.
  - Extract: streaming pipelines, Cloudflare tunneling, JWT auth, WebSockets, Next.js 14 / Euler physics / Web Audio, verified metrics, live demo URLs.

### Milestone 2: Synthesis, Ranking, Diversity Optimization & JSON Dataset Generation
- **Worker (Dataset Synthesizer & Generator)**:
  - Aggregate all evidence from Explorers 1, 2, and 3.
  - Select and rank 15–20 top projects based on technical depth, novelty, completeness, and domain breadth.
  - Assign strict domain categories (`SYSTEMS`, `AI / ML`, `FULL STACK`, `BACKEND`, `DEVOPS`, `CREATIVE`, `DATABASE`, `CLOUD`).
  - Flag top 3–5 flagship projects as `featured: true`.
  - Format `technologies` array (4-5 key visible techs + `+N` for rest).
  - Format concise 1-sentence `description` and architecture summary.
  - Populate 100% verified `githubUrl` and `demoUrl` (e.g. PyPI `https://pypi.org/project/apirlpy/`).
  - Write formatted JSON to `portfolio_research/projects.json` and `src/data/projects.json`.

### Milestone 3: Verification, Adversarial Challenge & Forensic Integrity Audit
- **Reviewer 1 & Reviewer 2**:
  - Independent schema validation, JSON syntax checking, count verification (15-20), featured count (3-5), technologies format (4-5 + `+N`).
  - Cross-check domain diversity across required categories.
- **Challenger 1 & Challenger 2**:
  - Adversarial URL verification (check GitHub URL format and existence against Naseer-fez repositories).
  - Fact-check every single metric against repository source code to ensure 0 fabricated statistics.
- **Forensic Auditor**:
  - Perform static analysis, anti-hallucination check, and integrity validation.
  - Issue clean integrity verdict.

### Milestone 4: Final Victory Reporting
- Report results, summary table, and evidence back to caller agent via `send_message`.
