# Orchestrate

Contract-first parallel builds on the Claude Code Workflow tool.

## Features
- **One File = One Owner** — the workflow refuses a plan where two units own the same file
- **Frozen contracts** — shared types are written first; builders code against them and never edit them
- **Per-unit pipeline** — build → adversarial verify → fix, with no unit waiting on another
- **Integration loop** — ownership audit via `git status`, full checks, failures routed back to the owning unit
- **Lanes** — route a unit to Codex, DeepSeek (vodax) or Antigravity via driver agents
- **Ultra rigor** — three lens verifiers per unit plus a completeness critic
- **Contract Registry** — `/contracts` keeps `.claude/contracts.json` for faster planning

## Usage

```bash
/orchestrate add order pricing, INR formatting and a receipt
/orchestrate --ultra add password reset flow
```

## Included
- `skills/orchestrate/SKILL.md` — planning steps for the main loop
- `skills/orchestrate/orchestrate.workflow.js` — the workflow script
- `skills/contracts/SKILL.md` — contract registry

## Installation

```bash
claude plugin install orchestrate@dev-workflow-skills
```
