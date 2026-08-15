# Original User Request

## 2026-08-15T16:22:02Z

Analyze all publicly accessible GitHub repositories belonging to `https://github.com/Naseer-fez` and produce a portfolio dataset of the best 15–20 real projects formatted as structured JSON cards based on verified repository evidence.

Working directory: d:\CODE\Html\Showcase
Integrity mode: demo

## Requirements

### R1. Comprehensive Repository Enumeration & Deep Inspection
Enumerate every public repository under GitHub account `https://github.com/Naseer-fez`. Deeply inspect all repository assets—including READMEs, codebases, dependency configurations (`package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `CMakeLists.txt`, etc.), Docker/CI/CD configs, schema definitions, and commit histories. Identify actual functionality, architecture, and technology stacks without fabricating unsupported features or metrics.

### R2. Portfolio Selection & Technical Diversity
Rank and select the top 15–20 projects (or fewer if fewer than 15 genuinely qualified public repositories exist). Ensure high domain diversity across categories (`SYSTEMS`, `AI / ML`, `FULL STACK`, `BACKEND`, `DEVOPS`, `CREATIVE`, `DATABASE`, `CLOUD`). Eliminate redundant/similar projects in favor of technical breadth. Flag the top 3–5 flagship projects with `featured: true`.

### R3. Evidence-Based Structured Dataset Generation
Generate the final project portfolio dataset matching the required JSON schema:
```json
{
  "projects": [
    {
      "title": "Project name",
      "category": "SYSTEMS",
      "featured": true,
      "description": "Concise one-sentence description of what the project actually does.",
      "technologies": [
        "Rust",
        "Tokio",
        "gRPC",
        "Raft",
        "+2"
      ],
      "architecture": "Concise description of the important architecture and engineering design.",
      "metrics": [
        "Relevant verified metric",
        "Relevant verified metric"
      ],
      "githubUrl": "https://github.com/Naseer-fez/repository",
      "demoUrl": "https://actual-demo-url-if-found"
    }
  ]
}
```
Save the results to `portfolio_research/projects.json` and `src/data/projects.json`.

## Acceptance Criteria

### Data & Schema Integrity
- [ ] Output JSON in `portfolio_research/projects.json` and `src/data/projects.json` is syntactically valid and strictly conforms to the schema with 15–20 projects (ranked from strongest to weakest).
- [ ] Exactly 3–5 projects are flagged with `featured: true`.
- [ ] Visible `technologies` list contains 4–5 key technologies, with any remaining technologies represented as `+N`.

### Factuality & Link Verification
- [ ] 100% of listed `githubUrl` links correspond to real, public repositories under `https://github.com/Naseer-fez` and return HTTP status 200.
- [ ] Any populated `demoUrl` points to a verified live demo or package registry (e.g., PyPI, live web deployment) that returns HTTP status 200.
- [ ] Every item in `metrics` represents a verified technical feature/capability (e.g., `JWT authentication`, `Dockerized`, `WebSocket`, `Zero-Config`) or repository-proven metric, with zero fabricated traffic/user/latency statistics.

### Domain Diversity
- [ ] The final selection includes representations across multiple distinct technical domains without over-indexing on repetitive CRUD applications.
