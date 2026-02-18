# Phase 6: OUTPUT Protocol

> Phase 6 of 6 - Finalize all files and present the completed plan.
> Input: All previous phase outputs
> Output: SUMMARY.md, STATE.md (final), completion banner

---

## Step 1: Finalize Files Checklist

Before generating output, verify all files exist and are complete.

### File Verification

| File | Required | Check |
|------|----------|-------|
| `DISCOVERY.md` | YES | Has all Q&A, summary, coverage table |
| `RESEARCH.md` | YES | Has tech stack, libraries, conflicts resolved |
| `PRD.md` | YES | All 10 sections populated, approved |
| `PLAN.md` | YES | Architecture, sections, batches, dependencies |
| `section-NN-*.md` | YES (all) | Each has tasks, TDD stubs, risk, files |
| `INDEX.md` | YES | Lists all sections with metadata |
| `VALIDATE.md` | YES | Traceability matrix, coverage, gaps resolved |
| `SUMMARY.md` | NO (generate now) | Quick reference cheat sheet |
| `STATE.md` | YES (update now) | Final state with all phases complete |

### Verification Process

1. Check each file exists in `{output_dir}/`
2. Verify each file has no placeholder text (no `{PLACEHOLDER}` tokens)
3. Verify cross-references are consistent (file names match, task IDs match)
4. If any file is missing or incomplete, go back to the relevant phase

---

## Thinking Framework: Summary Visualization

Before writing SUMMARY.md, create visual representations for the summary.

### Step 1a: Read Visual Reasoning

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/visual-reasoning.md` and apply visual thinking to the summary.

### Step 1b: Create Architecture Diagram

Create a simplified ASCII architecture diagram for SUMMARY.md. This should be simpler than the one in PLAN.md - just the key components:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend   │────▶│   Backend    │────▶│  Database    │
│  (Next.js)  │◀────│  (API Routes)│◀────│ (Supabase)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  Services   │
                    │ Clerk │ S3  │
                    └─────────────┘
```

Keep it to 8-12 lines maximum. Show only the major components and their connections.

### Step 1c: Create Batch Execution Flow

Create a visual batch execution flow for SUMMARY.md:

```
Batch 1 (foundation):
  ┌──────────────┐  ┌──────────────┐
  │ 01: Database  │  │ 02: Auth     │
  └──────┬───────┘  └──────┬───────┘
         └──────────┬──────┘
                    ▼
Batch 2 (core):
  ┌──────────────┐  ┌──────────────┐
  │ 03: CRUD     │  │ 05: Upload   │
  └──────┬───────┘  └──────┬───────┘
         └──────────┬──────┘
                    ▼
Batch 3 (features):
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ 04: Search   │  │ 06: Share    │  │ 07: Tags     │
  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
         └──────────┬──────┴──────────┘
                    ▼
Batch 4 (polish):
  ┌──────────────┐  ┌──────────────┐
  │ 08: UI       │  │ 09: Deploy   │
  └──────────────┘  └──────────────┘
```

### Step 1d: Include Both Diagrams in SUMMARY.md

Place the architecture diagram under "What We're Building" and the batch flow under "How to Execute."

---

## Step 2: Write SUMMARY.md

Write a quick-reference cheat sheet that summarizes the entire plan.

### SUMMARY.md Format

```markdown
# UltraPlan Summary: {PROJECT_NAME}

> Generated: {TIMESTAMP}
> Phase: 6/6 - OUTPUT
> This is your cheat sheet for executing the plan.

---

## What We're Building

{SENTENCE_1}. {SENTENCE_2}. {SENTENCE_3}.

### Architecture

{ASCII_ARCHITECTURE_DIAGRAM}

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

### Batch Execution Flow

{ASCII_BATCH_FLOW_DIAGRAM}

### Steps

1. **Read** `PLAN.md` for full architecture and dependency graph
2. **Start** with Batch 1 sections (no dependencies)
3. **Follow** TDD: write tests from stubs FIRST, then implement
4. **Complete** each section's tasks in order (task IDs are sequential)
5. **Move** to next batch only after current batch sections pass all tests
6. **Mark** tasks complete in section files as you go

### Batch Execution Detail

```
Batch 1 (start here):
  Section {NN}: {NAME}
  Section {NN}: {NAME}
  -> Run tests, verify, then proceed

Batch 2:
  Section {NN}: {NAME}
  Section {NN}: {NAME}
  -> Run tests, verify, then proceed

Batch 3:
  Section {NN}: {NAME}
  -> Final integration tests
```

---

## How to Update

- **Add a task:** Edit the relevant `section-NN-slug.md` file, add a new `<task>` block
- **Change priority:** Update `PLAN.md` batch ordering and dependency graph
- **Add a section:** Create new `section-NN-slug.md` from template, update `PLAN.md` index
- **Track progress:** Update `STATE.md` or re-run `/ultraplan-ct` to auto-detect
- **Major changes:** Run `/ultraplan-ct update` to regenerate affected sections

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
```

### Writing Rules for SUMMARY.md

1. **Maximum 150 lines**: This is a cheat sheet, not a document
2. **No jargon**: Same plain-language rules as the PRD
3. **Actionable**: Everything in this file should help someone START working
4. **Self-contained**: Someone reading only this file should understand the project
5. **Visual**: Include the architecture diagram and batch flow diagram

---

## Thinking Framework: Pareto Check

Before presenting the final output, apply the Pareto Principle to highlight what matters most.

### Step 2a: Read Mental Models

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/mental-models.md` and apply the **Pareto Principle (80/20)**.

### Step 2b: Identify High-Leverage Sections

Analyze the plan to identify which 20% of sections deliver 80% of the project's value:

1. **Map sections to PRD features**: Which sections implement P0 features?
2. **Count downstream dependencies**: Which sections unblock the most other work?
3. **Assess user impact**: Which sections, if done perfectly, would make users happiest?

### Step 2c: Score Sections

| Section | P0 Features | Downstream Deps | User Impact | Total Score |
|---------|------------|-----------------|-------------|-------------|
| {NN}: {NAME} | {0-5} | {0-5} | {0-5} | {SUM} |
| {NN}: {NAME} | {0-5} | {0-5} | {0-5} | {SUM} |

The top 20% of sections by score are the "Pareto sections."

### Step 2d: Highlight in WHAT TO DO NEXT

In the completion banner's "WHAT TO DO NEXT" section, emphasize the Pareto sections:

```
WHAT TO DO NEXT:

>> HIGHEST IMPACT (do these first, they deliver 80% of value):
   - Section {NN}: {NAME} - {WHY_HIGH_IMPACT}
   - Section {NN}: {NAME} - {WHY_HIGH_IMPACT}

>> Then continue with remaining batches:
   - Batch 1: {REMAINING_SECTIONS}
   - Batch 2: {SECTIONS}
   - Batch 3: {SECTIONS}
```

---

## Step 3: Write STATE.md (Final)

Update STATE.md to reflect plan completion.

### STATE.md Final Format

Use the state template from `{plugin_root}/skills/ultraplan-ct/templates/state.md` and populate with:

1. **Current Position**: Phase 6/6, COMPLETE
2. **Progress**: All phases at 100%
3. **Phase Details**: All phases populated with actual numbers
4. **Session History**: Full history of all sessions
5. **Change Log**: All changes made during review and validation
6. **Configuration Snapshot**: Settings used during this planning session
7. **File Manifest**: All files with EXISTS status and dates
8. **Resume Instructions**: Updated to say plan is complete

### Final State Values

```markdown
## Current Position

| Field | Value |
|-------|-------|
| Phase | 6/6 |
| Name | OUTPUT |
| Status | COMPLETE |
| Last activity | {TIMESTAMP} - Generated final output |

### Progress

```
[========================================] 100%
```

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 1 | UNDERSTAND | COMPLETE | 100% |
| 2 | RESEARCH | COMPLETE | 100% |
| 3 | PLAN | COMPLETE | 100% |
| 4 | REVIEW | COMPLETE | 100% |
| 5 | VALIDATE | COMPLETE | 100% |
| 6 | OUTPUT | COMPLETE | 100% |
```

---

## Step 4: Update PLAN.md Footer

Add a completion footer to PLAN.md:

```markdown
---

## Plan Status

| Attribute | Value |
|-----------|-------|
| Status | COMPLETE |
| Generated | {TIMESTAMP} |
| Validated | {TIMESTAMP} |
| Coverage | P0: 100% | P1: {PCT}% | P2: {PCT}% |
| Confidence | {SCORE}/1.0 |
| Sections | {N} |
| Tasks | {N} |
| Batches | {N} |

> This plan was generated by UltraPlan-CT. To update it, run `/ultraplan-ct update`.
```

---

## Step 5: Present Completion Banner

Display the final completion banner to the user. This is the last thing they see.

### Banner Format (exact)

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ULTRAPLAN COMPLETE                                         ║
║                                                              ║
║   Project: {PROJECT_NAME}                                    ║
║   Phases:  6/6 complete                                      ║
║                                                              ║
║   ┌────────────────────────────────────────────────────┐     ║
║   │  Discovery    ████████████████████████████  100%   │     ║
║   │  Research     ████████████████████████████  100%   │     ║
║   │  Plan         ████████████████████████████  100%   │     ║
║   │  Review       ████████████████████████████  100%   │     ║
║   │  Validate     ████████████████████████████  100%   │     ║
║   │  Output       ████████████████████████████  100%   │     ║
║   └────────────────────────────────────────────────────┘     ║
║                                                              ║
║   Files generated:                                           ║
║     DISCOVERY.md    - {N} questions across 9 categories      ║
║     RESEARCH.md     - {N} topics, {N} sources                ║
║     PRD.md          - 10 sections, all approved              ║
║     PLAN.md         - {N} sections, {N} tasks                ║
║     section-*.md    - {N} section files with TDD stubs       ║
║     VALIDATE.md     - {PCT}% coverage, {N} gaps resolved     ║
║     SUMMARY.md      - Quick reference cheat sheet            ║
║     STATE.md        - Session state (complete)               ║
║                                                              ║
║   Plan confidence: {SCORE}/1.0                               ║
║   Validation: P0 100% | P1 {PCT}% | P2 {PCT}%              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Step 6: Present Next Steps

After the banner, present actionable next steps.

### Next Steps Text

```
WHAT TO DO NEXT:

>> HIGHEST IMPACT (do these first - they deliver 80% of value):
   - Section {NN}: {NAME} - {WHY_HIGH_IMPACT}
   - Section {NN}: {NAME} - {WHY_HIGH_IMPACT}

>> EXECUTION ORDER:
   1. Open PLAN.md for the full architecture and dependency graph
   2. Start with Batch 1 sections (zero dependencies)
   3. For each section:
      a. Read the section file for full context
      b. Write TDD tests from the stubs FIRST
      c. Implement tasks in order (task IDs are sequential)
      d. Run tests and verify acceptance criteria
      e. Mark tasks complete in the section file
   4. Move to next batch only after current batch passes all tests
   5. After all batches: run full integration tests

>> TO UPDATE THE PLAN:
   - Run `/ultraplan-ct update` to modify sections after requirements change
   - See SUMMARY.md for quick-reference update instructions

>> FILES ARE LOCATED AT:
   {output_dir}/

All files are ready. Start building!
```

---

## Completion Criteria

Phase 6 (and the entire UltraPlan process) is complete when:

1. All files in the checklist exist and are populated
2. SUMMARY.md is written with architecture and batch flow diagrams
3. Pareto analysis identifies highest-impact sections
4. STATE.md is updated to COMPLETE
5. PLAN.md footer is added
6. Completion banner is displayed
7. Next steps are presented with Pareto priorities

### Final Verification

Before displaying the banner, do one final check:

- [ ] No file contains `{PLACEHOLDER}` tokens
- [ ] All file cross-references are valid (file names exist)
- [ ] All task IDs are unique and sequential within sections
- [ ] All section numbers are sequential and match file names
- [ ] Batch numbers in section files match batch grouping in PLAN.md
- [ ] Risk colors in section files match risk summary in PLAN.md
- [ ] Coverage percentages in VALIDATE.md are accurate
- [ ] Confidence score in review matches the one in the banner
