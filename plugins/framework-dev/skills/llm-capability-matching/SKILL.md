---
name: llm-capability-matching
description: Use when assigning development tasks to different LLMs or estimating costs for multi-agent work.
allowed-tools: Read, Write, WebSearch
---

# LLM Capability Matching for Multi-Agent Development

Assign tasks to the most suitable LLMs based on **live research**, user budget, and task requirements.

> **Do NOT rely on hardcoded model scores.** Models and pricing change frequently.
> Always use WebSearch to verify current capabilities before making assignments.
> See `references/llm-strengths.md` for the full decision protocol.

---

## Workflow

### Step 1: Ask Available LLMs
```
Which LLMs/tools do you have available?
What's your budget constraint? (none / moderate / tight)
```

### Step 2: Research Current Capabilities (WebSearch-First)

For EACH LLM the user mentions:
```
WebSearch: "[Model Name] capabilities benchmarks pricing [current year]"
```

Verify from official sources:
- Context window (exact size)
- Pricing (input/output per 1M tokens)
- Strengths (from benchmarks, not assumptions)
- Known limitations

**Present findings WITH source URLs. Never guess.**

### Step 3: Categorize Tasks

| Category | Prioritize | Avoid |
|----------|-----------|-------|
| Architecture & system design | Strongest reasoning model | Fast/cheap models |
| Backend implementation | Good code + fast iteration | Overkill reasoning |
| Frontend / UI | Vision-capable, UI-aware | Code-only models |
| Testing | Thorough + cost-effective | Expensive flagship |
| Documentation | Large context + clear writing | Small context |
| DevOps / CI/CD | Broad knowledge | Narrow specialists |
| Refactoring | Code-focused, pattern-aware | Conversational models |

### Step 4: Consider Constraints

| Constraint | Strategy |
|------------|----------|
| Budget limited | Use cheaper models for bulk, flagship for architecture only |
| Time critical | Use fastest-responding models |
| Quality critical | Use flagship for all phases |
| Large codebase | Prioritize largest context window |
| Single developer | Skip Phase 4; use one model for everything |

### Step 5: Generate Assignment Matrix

```markdown
| Agent ID | LLM | Tasks | Est. Cost | Rationale |
|----------|-----|-------|-----------|-----------|
| [ID] | [Model - verified] | [Tasks] | [Est - from live pricing] | [Why this model - with source] |
```

---

## Cost Estimation

### Token Estimates by Task Type

| Task Type | Est. Input | Est. Output |
|-----------|-----------|------------|
| Architecture design | 5,000 | 3,000 |
| API endpoint (each) | 2,000 | 1,500 |
| React component | 3,000 | 2,000 |
| Unit test file | 1,500 | 2,000 |
| Integration test | 3,000 | 2,500 |
| Documentation page | 2,000 | 3,000 |
| Refactor module | 4,000 | 3,000 |

```
Total Cost = Sum(task_input_tokens * input_price + task_output_tokens * output_price)
```

---

## Session Splitting Strategy

| Scenario | Recommendation |
|----------|----------------|
| > 50K tokens expected | Split into phases |
| Context loss risk | Checkpoint every 20K |
| Multiple modules | One session per module |
| Complex dependencies | Sequential sessions |

---

## Assignment Review Checklist

- [ ] All tasks have an assigned LLM
- [ ] Cost estimates from **live pricing** (not hardcoded)
- [ ] Token estimates reasonable
- [ ] Handoff points defined
- [ ] Session splitting planned
- [ ] User has approved assignments

---

## Anti-Patterns

- **Never hardcode model scores** - they change with every release
- **Never assume pricing** - always verify current rates via WebSearch
- **Never skip research** - "I think Model X is good at Y" is not evidence
- **Never ignore user experience** - their hands-on experience > benchmarks
