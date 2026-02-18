# Clear Thought UltraPlan - Design Specification

## Overview

**Clear Thought UltraPlan** merges UltraPlan's 6-phase planning pipeline with Clear Thought MCP Server's 11 structured thinking frameworks into a single Claude Code plugin. The thinking frameworks are embedded as markdown reference files (not an MCP server), making the plugin self-contained with zero runtime dependencies.

---

## Source Projects

| Project | Author | What We Take | License |
|---------|--------|-------------|---------|
| **UltraPlan** | UltraPlan Contributors | 6-phase pipeline, templates, agents, hooks, session management, XML task format | MIT |
| **Clear Thought MCP Server** | Chirag Singhal | 11 thinking frameworks (mental models, design patterns, collaborative reasoning, etc.) | MIT |

---

## Key Design Decision: Skill Enhancement, Not MCP Hybrid

We chose to embed Clear Thought's frameworks as markdown references inside the skill rather than keeping the MCP server. Reasons:

| Factor | MCP Server | Markdown References (chosen) |
|--------|-----------|------------------------------|
| Runtime dependency | Requires Node.js server running | None - just markdown files |
| Installation | Complex (npm install, server config) | Simple (clone repo, add plugin) |
| Latency | Tool call overhead per framework use | Direct file read, faster |
| Flexibility | Fixed tool schemas | Claude adapts framework to context |
| Maintenance | TypeScript code to maintain | Markdown files, easy to edit |
| Offline use | Server must be running | Always available |

---

## Thinking Framework → Phase Mapping

| Phase | Frameworks | Rationale |
|-------|-----------|-----------|
| 1. UNDERSTAND | Mental Models + Metacognitive Monitoring | First Principles decomposes the idea before questioning. Metacognition identifies knowledge gaps for better questions. |
| 2. RESEARCH | Scientific Method + Decision Framework | Hypotheses make research targeted. Weighted criteria make tech evaluations rigorous. |
| 3. PLAN | Design Patterns + Programming Paradigms + Visual Reasoning + Structured Argumentation | Patterns inform architecture. Paradigms guide implementation. Diagrams reveal structure. Arguments justify decisions. |
| 4. REVIEW | Collaborative Reasoning + Debugging Approaches + Metacognitive Monitoring | Multiple perspectives catch different issues. Pre-mortem prevents failures. Confidence calibration adds honesty. |
| 5. VALIDATE | Scientific Method + Sequential Thinking | Hypothesis verification ensures research→plan alignment. Sequential tracing catches gaps. |
| 6. OUTPUT | Visual Reasoning + Mental Models | Diagrams make summaries actionable. Pareto identifies highest-value sections. |

---

## What Changed from Original UltraPlan

### New Steps Added
- Phase 1: Step 1.0 Pre-Discovery Thinking (First Principles + Metacognition)
- Phase 2: Step 2.0 Research Hypotheses + Step 2.4 Decision Framework + Step 2.6 Hypothesis Verification
- Phase 3: Step 3b.0 Design Pattern Selection + Step 3b.4 Architecture Visualization + Step 3b.6 Decision Justification
- Phase 4: Step 4.0 Multi-Persona Setup + Step 4b Pre-Mortem Debugging + Step 4e Confidence Assessment
- Phase 5: Step 5.0 Systematic Tracing Setup + Step 5.4 Hypothesis Verification
- Phase 6: Enhanced SUMMARY.md with diagrams + Pareto prioritization

### New Files Added
- `skills/ultraplan-ct/references/thinking/` directory with 11 framework files
- Enhanced protocol references with thinking framework integration sections

### Unchanged from UltraPlan
- All 8 templates (discovery, research, prd, plan, section, validate, state, summary)
- All 4 agents (codebase-researcher, web-researcher, docs-researcher, section-writer)
- Hooks (session start/end)
- Config structure (with new thinking_frameworks section added)
- XML task format
- Update and Status commands
- Resume/compaction behavior

### Skill Rename
- Original: `/ultraplan`
- New: `/ultraplan-ct` (CT = Clear Thought)

---

## Decision Log

| # | Decision | Choice | Alternatives Considered |
|---|----------|--------|------------------------|
| 1 | Integration approach | Markdown references (skill enhancement) | MCP hybrid, unified MCP server, plugin with embedded MCP |
| 2 | Framework selection per phase | Map by cognitive fit | All frameworks every phase, user selects, random |
| 3 | Skill naming | ultraplan-ct | clear-thought-plan, ultra-thought, thinking-plan |
| 4 | Template changes | None (keep original) | Add thinking output sections to templates |
| 5 | Agent changes | None (keep original) | Add thinking-focused agents |
| 6 | Framework file format | Practical guide with examples | Academic reference, tool schema replica |
| 7 | Thinking output location | Embedded in existing output files | Separate thinking log file |
| 8 | Number of review personas | 3 (Security, UX, Devil's Advocate) | 5 personas, 2 personas, user-defined |
| 9 | Hypothesis count | 3-5 per research phase | Fixed 5, unlimited, 1 per topic |
| 10 | Confidence rating | 0.0-1.0 per section + overall | Pass/fail, letter grade, no rating |
