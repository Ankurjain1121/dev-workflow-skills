# UltraPlan Summary: {PROJECT_NAME}

> Generated: {TIMESTAMP}
> Phase: 6/6 - OUTPUT
> This is your cheat sheet for executing the plan.

---

## What We're Building

{SENTENCE_1}. {SENTENCE_2}. {SENTENCE_3}.

---

## Key Features

- {FEATURE_1}
- {FEATURE_2}
- {FEATURE_3}
- {FEATURE_4}
- {FEATURE_5}

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| {LAYER} | {TECH} |
| {LAYER} | {TECH} |
| {LAYER} | {TECH} |
| {LAYER} | {TECH} |

---

## Risk Areas

- {RISK_1}: {MITIGATION_1}
- {RISK_2}: {MITIGATION_2}
- {RISK_3}: {MITIGATION_3}

---

## Plan Structure

| Metric | Value |
|--------|-------|
| Sections | {N} |
| Tasks | {N} |
| Batches | {N} |
| Dependencies | {N} |

### Batch Overview

| Batch | Sections | Can parallelize? |
|-------|----------|-----------------|
| 1 | {SECTIONS} | Yes (no deps) |
| 2 | {SECTIONS} | Yes (within batch) |
| 3 | {SECTIONS} | {YES/NO} |

---

## How to Execute

1. **Read** `PLAN.md` for full architecture and dependency graph
2. **Start** with Batch 1 sections (no dependencies)
3. **Follow** TDD: write tests from stubs FIRST, then implement
4. **Complete** each section's tasks in order (task IDs are sequential)
5. **Move** to next batch only after current batch sections pass all tests
6. **Mark** tasks complete in section files as you go

### Batch Execution

```
Batch 1 (start here):
  Section {NN}: {NAME}
  Section {NN}: {NAME}
  → Run tests, verify, then proceed

Batch 2:
  Section {NN}: {NAME}
  Section {NN}: {NAME}
  → Run tests, verify, then proceed

Batch 3:
  Section {NN}: {NAME}
  → Final integration tests
```

---

## How to Update

- **Add a task:** Edit the relevant `section-NN-slug.md` file, add a new `<task>` block
- **Change priority:** Update `PLAN.md` batch ordering and dependency graph
- **Add a section:** Create new `section-NN-slug.md` from template, update `PLAN.md` index
- **Track progress:** Update `STATE.md` or re-run `/ultraplan-ct` to auto-detect

---

## Quick Links

| Document | Purpose |
|----------|---------|
| `DISCOVERY.md` | Original questions and answers |
| `RESEARCH.md` | Technical research findings |
| `PRD.md` | Product requirements document |
| `PLAN.md` | Master plan with architecture |
| `section-*.md` | Individual section details and tasks |
| `VALIDATE.md` | Traceability and gap analysis |
| `SUMMARY.md` | This file - quick reference |
| `STATE.md` | Session state for resuming |
