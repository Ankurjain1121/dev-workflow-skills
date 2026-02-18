# Clear Thought UltraPlan

**UltraPlan's 6-phase planning pipeline + Clear Thought's 11 thinking frameworks.**

From plain-English idea to AI-executable implementation plan, with structured thinking at every step.

---

## What It Does

This Claude Code plugin transforms your idea into a complete, ready-to-build plan. It combines:

- **UltraPlan**: 6-phase planning pipeline (UNDERSTAND → RESEARCH → PLAN → REVIEW → VALIDATE → OUTPUT) with exhaustive discovery, parallel research, structured planning, self-review, and traceability validation
- **Clear Thought**: 11 structured thinking frameworks (mental models, design patterns, collaborative reasoning, etc.) applied at the right moment in each phase

The result: plans that are not just thorough, but *well-reasoned*.

---

## How Thinking Frameworks Enhance Each Phase

| Phase | Thinking Frameworks Used | What They Add |
|-------|-------------------------|---------------|
| **1. UNDERSTAND** | Mental Models + Metacognitive Monitoring | First Principles decomposition of the idea before questions. Knowledge gap assessment for better questioning. |
| **2. RESEARCH** | Scientific Method + Decision Framework | Form testable hypotheses about tech choices. Weighted criteria evaluation for competing options. |
| **3. PLAN** | Design Patterns + Programming Paradigms + Visual Reasoning + Structured Argumentation | Select architecture patterns. Choose paradigms per section. Create architecture diagrams. Justify decisions with structured arguments. |
| **4. REVIEW** | Collaborative Reasoning + Debugging Approaches + Metacognitive Monitoring | Multi-persona review (security expert, user advocate, devil's advocate). Pre-mortem failure analysis. Confidence calibration. |
| **5. VALIDATE** | Scientific Method + Sequential Thinking | Verify hypotheses against plan evidence. Systematic step-by-step requirement tracing. |
| **6. OUTPUT** | Visual Reasoning + Mental Models | Architecture summary diagrams. Pareto check on highest-value sections. |

---

## The 11 Thinking Frameworks

| # | Framework | Origin | Purpose |
|---|-----------|--------|---------|
| 1 | Mental Models | Clear Thought | First Principles, Pareto, Occam's Razor, Rubber Duck Debugging |
| 2 | Design Patterns | Clear Thought | Modular architecture, API patterns, state management, security |
| 3 | Programming Paradigms | Clear Thought | OOP, functional, reactive, event-driven, concurrent |
| 4 | Debugging Approaches | Clear Thought | Binary search, cause elimination, divide & conquer |
| 5 | Sequential Thinking | Clear Thought | Step-by-step reasoning with revision and branching |
| 6 | Collaborative Reasoning | Clear Thought | Multi-persona debate, consensus building |
| 7 | Decision Framework | Clear Thought | Weighted criteria, decision trees, scenario analysis |
| 8 | Metacognitive Monitoring | Clear Thought | Confidence calibration, bias detection, uncertainty tracking |
| 9 | Scientific Method | Clear Thought | Hypothesis testing, variable identification, evidence evaluation |
| 10 | Structured Argumentation | Clear Thought | Thesis-antithesis-synthesis, premise evaluation |
| 11 | Visual Reasoning | Clear Thought | Architecture diagrams, data flow, bottleneck detection |

---

## Quick Start

```
/ultraplan-ct I want to build a recipe sharing app
```

What happens:
1. **Pre-Discovery Analysis**: First Principles decomposition + knowledge assessment
2. **Discovery**: 40-70 multiple-choice questions across 9 categories
3. **Research**: 3 parallel agents + hypothesis testing + weighted evaluation
4. **Planning**: PRD + technical plan with design patterns + architecture diagrams
5. **Review**: Multi-persona review + pre-mortem debugging + confidence rating
6. **Validation**: Sequential tracing + hypothesis verification
7. **Output**: Visual summaries + Pareto-prioritized execution guide

---

## Commands

| Command | What It Does |
|---------|-------------|
| `/ultraplan-ct [your idea]` | Full 6-phase planning with thinking frameworks |
| `/ultraplan-ct update` | Change an existing plan (only affected sections regenerated) |
| `/ultraplan-ct status` | Show current progress |

---

## Installation

### Manual Installation

```bash
git clone https://github.com/Ankurjain1121/clear-thought-ultraplan.git
```

Add the plugin path to your Claude Code settings.json under the plugins array.

---

## What It Produces

```
.ultraplan/
    SUMMARY.md           One-page cheat sheet (start here)
    PRD.md               Product requirements in plain English
    PLAN.md              Master technical plan + architecture diagrams
    RESEARCH.md          Research findings with decision matrices
    DISCOVERY.md         Complete Q&A transcript with pre-discovery analysis
    VALIDATE.md          Requirement traceability matrix
    STATE.md             Session data (for resume and updates)
    sections/
        index.md         Section manifest with execution order
        section-01-*.md  First build section
        section-02-*.md  Second build section
        ...
```

---

## Attribution

This project merges two open-source projects:

- **[UltraPlan](https://github.com/ultraplan/ultraplan)** by UltraPlan Contributors - The 6-phase planning pipeline, templates, agents, and session management
- **[Clear Thought MCP Server](https://github.com/chirag127/Clear-Thought-MCP-server)** by Chirag Singhal - The 11 structured thinking frameworks

Both are MIT licensed. This merged project is also MIT licensed.

---

## License

MIT
