# Original User Request

## 2026-08-15T07:20:00Z

You are the Project Orchestrator for Phase 1: Reference Website Reverse Engineering & Research for an OS-style Portfolio Website.

Your working directory is: d:\CODE\Html\Showcase\.agents\orchestrator
The project workspace root is: d:\CODE\Html\Showcase
The research output target directory is: d:\CODE\Html\Showcase\portfolio_research

Please read the user request at d:\CODE\Html\Showcase\.agents\ORIGINAL_REQUEST.md.

Key requirements & constraints:
1. Phase 1 is strictly research, inspection, reverse-engineering, and documentation. DO NOT write any production implementation code.
2. Teamwork Architecture Requirement:
   - Use an individual agent for each reference website:
     * Luca Felix (https://luca-felix.com/ - Taskbar focus)
     * Michal Grzebisz (https://www.michalgrzebisz.com/ - Home Screen / Cursor Interaction mathematical model)
     * Nidal (https://www.nidal.dev/ - Music Player focus)
   - Use 2 individual agents for the base website (https://irfannaikwade.in/ - Irfan Naikwade OS-like base experience) for higher accuracy and deep breakdown.
3. Thoroughly analyze DOM structure, exact measurements/colors/typography, animation triggers/timing/easing, interactive states, responsive viewports (Desktop/Tablet/Mobile), continuous animations/perf considerations.
4. Output comprehensive component extraction map, conflict analysis, well-named screenshots of relevant states, and a final research-summary.md report in d:\CODE\Html\Showcase\portfolio_research.
5. Maintain your BRIEFING.md and progress.md in your agent directory (d:\CODE\Html\Showcase\.agents\orchestrator).
6. When all research milestones are complete, report victory back to the Sentinel with a clear completion summary.

## 2026-08-15T16:22:13Z

You are the Project Orchestrator for this task.

Your working directory is: d:\CODE\Html\Showcase\.agents\orchestrator
Workspace root: d:\CODE\Html\Showcase
Original request file: d:\CODE\Html\Showcase\.agents\ORIGINAL_REQUEST.md

Please read the user request from `d:\CODE\Html\Showcase\.agents\ORIGINAL_REQUEST.md`.
Maintain your `BRIEFING.md`, `plan.md`, `progress.md`, and `context.md` in `d:\CODE\Html\Showcase\.agents\orchestrator`.

Your mission:
1. Deconstruct the requirements from ORIGINAL_REQUEST.md into detailed milestones and phases.
2. Spawn specialists / subagents to comprehensively enumerate and inspect all public repositories of `https://github.com/Naseer-fez`.
3. Select and rank the top 15–20 real projects ensuring domain diversity across categories (SYSTEMS, AI / ML, FULL STACK, BACKEND, DEVOPS, CREATIVE, DATABASE, CLOUD).
4. Strictly verify all GitHub repository URLs (HTTP 200), demo/package URLs (HTTP 200), and extract factual metrics directly from repository evidence (no hallucinated traffic/latency stats).
5. Generate and validate the output JSON in both `portfolio_research/projects.json` and `src/data/projects.json` strictly matching the required schema.
6. When all milestones are complete, send a message back to report completion/victory claim with summary evidence.
