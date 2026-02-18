# UltraPlan Master Plan: {PROJECT_NAME}

> Generated: {TIMESTAMP}
> Phase: 3/6 - PLAN (Master Plan)
> Sections: {TOTAL_SECTIONS}
> Tasks: {TOTAL_TASKS}
> Estimated effort: {EFFORT_ESTIMATE}

---

## Project Overview

### Summary
{PROJECT_SUMMARY}

### Goals
1. {GOAL_1}
2. {GOAL_2}
3. {GOAL_3}

### Constraints
- {CONSTRAINT_1}
- {CONSTRAINT_2}
- {CONSTRAINT_3}

---

## Architecture Overview

```
{ASCII_ARCHITECTURE_DIAGRAM}
```

**Architecture notes:**
- {NOTE_1}
- {NOTE_2}
- {NOTE_3}

---

## Tech Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Language | {TECH} | {VER} | {REASON} |
| Framework | {TECH} | {VER} | {REASON} |
| Database | {TECH} | {VER} | {REASON} |
| Auth | {TECH} | {VER} | {REASON} |
| Hosting | {TECH} | {VER} | {REASON} |
| Testing | {TECH} | {VER} | {REASON} |
| Styling | {TECH} | {VER} | {REASON} |
| Build | {TECH} | {VER} | {REASON} |

---

## Section Index

| # | Section | Description | Tasks | Risk | Batch |
|---|---------|-------------|-------|------|-------|
| {NN} | {SECTION_NAME} | {DESCRIPTION} | {N} | {COLOR} | {BATCH_N} |
| {NN} | {SECTION_NAME} | {DESCRIPTION} | {N} | {COLOR} | {BATCH_N} |

---

## Section Files

| Section | File |
|---------|------|
| Section {NN} | `section-{NN}-{SLUG}.md` |
| Section {NN} | `section-{NN}-{SLUG}.md` |

---

## Dependency Graph

```
{SECTION_NN} ({NAME})
  └── depends on: {SECTION_NN} ({NAME})
  └── blocks: {SECTION_NN} ({NAME})

{SECTION_NN} ({NAME})
  └── depends on: none (root)
  └── blocks: {SECTION_NN} ({NAME}), {SECTION_NN} ({NAME})
```

---

## Parallel Batch Groups

### Batch 1 (Start here - no dependencies)
- Section {NN}: {NAME}
- Section {NN}: {NAME}

### Batch 2 (After Batch 1)
- Section {NN}: {NAME} (depends on {NN})
- Section {NN}: {NAME} (depends on {NN})

### Batch 3 (After Batch 2)
- Section {NN}: {NAME} (depends on {NN}, {NN})

---

## Execution Order

```
Batch 1: [{NN}, {NN}] (parallel)
  ↓
Batch 2: [{NN}, {NN}] (parallel)
  ↓
Batch 3: [{NN}] (sequential)
```

---

## Risk Summary

### Distribution
- High risk sections: {N}
- Medium risk sections: {N}
- Low risk sections: {N}

### High Risk Items

| Section | Risk | Mitigation |
|---------|------|------------|
| {NN}: {NAME} | {RISK_DESCRIPTION} | {MITIGATION} |

### Medium Risk Items

| Section | Risk | Mitigation |
|---------|------|------------|
| {NN}: {NAME} | {RISK_DESCRIPTION} | {MITIGATION} |

---

## Review Notes

> This section is populated during Phase 4 (REVIEW).

### Refinement Questions
1. {QUESTION} - {ANSWER}
2. {QUESTION} - {ANSWER}

### Changes Made During Review
| Change | Section | Reason |
|--------|---------|--------|
| {CHANGE} | {SECTION} | {REASON} |

### Review Checklist
- [ ] All sections have clear task breakdowns
- [ ] Dependencies are accurate and complete
- [ ] Risk assessments are realistic
- [ ] TDD stubs cover critical paths
- [ ] No gaps between PRD and plan
- [ ] Batch ordering is optimal
- [ ] Effort estimates are reasonable
- [ ] No circular dependencies
