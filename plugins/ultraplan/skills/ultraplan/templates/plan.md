# UltraPlan: {PROJECT_NAME} - Master Technical Plan

> Generated: {TIMESTAMP}
> Phase: 3/6 - PLAN (Step 3b: Technical Plan)
> Sections: {TOTAL_SECTIONS} | Tasks: {TOTAL_TASKS} | Parallel Batches: {TOTAL_BATCHES}

---

## Project Overview

<!-- Derived from the approved PRD. Summarizes what we're building in technical terms
     while remaining accessible. This is the bridge between the PRD (plain English)
     and the technical implementation sections. -->

### Summary

{PROJECT_SUMMARY}

### Goals

1. {GOAL_1}
2. {GOAL_2}
3. {GOAL_3}

### Constraints

<!-- Technical constraints, timeline constraints, budget constraints, platform constraints -->

{CONSTRAINTS}

---

## Architecture Overview

<!-- ASCII diagram showing the high-level architecture. Keep it simple and readable.
     Show the main components and how they connect. -->

```
{ARCHITECTURE_DIAGRAM}
```

### Architecture Notes

{ARCHITECTURE_NOTES}

---

## Tech Stack

<!-- Final tech stack from Research phase. Lists every technology and its purpose. -->

| Layer | Technology | Purpose |
|-------|-----------|---------|
{TECH_STACK_TABLE}

### Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
{KEY_LIBRARIES_TABLE}

---

## Section Index

<!-- Master table of all implementation sections. This is the roadmap for execution. -->

| # | Section | Risk | Batch | Depends On | Blocks | Tasks | Est. Complexity |
|---|---------|------|-------|------------|--------|-------|-----------------|
{SECTION_INDEX_TABLE}

### Section Files

<!-- Links to individual section files -->

| # | File | Section Name |
|---|------|-------------|
{SECTION_FILES_TABLE}

---

## Dependency Graph

<!-- Shows which sections must be completed before others can start.
     Sections with no dependencies can run in parallel (same batch). -->

```
{DEPENDENCY_GRAPH}
```

### Dependency Notes

{DEPENDENCY_NOTES}

---

## Parallel Batch Groups

<!-- Sections grouped by when they can be executed. Within a batch,
     all sections are independent and can run simultaneously. -->

### Batch {BATCH_1_NUMBER}: {BATCH_1_NAME}

<!-- Foundation / prerequisites that everything else depends on -->

| Section | Name | Risk | Tasks |
|---------|------|------|-------|
{BATCH_1_SECTIONS}

**Execute together:** Yes, all sections in this batch are independent.
**Must complete before:** Batch {BATCH_1_NEXT}

{REMAINING_BATCHES}

---

## Execution Order

<!-- Step-by-step guide for executing this plan. Written so a no-coder can
     hand this to an AI coding tool section by section. -->

1. {EXECUTION_STEP_1}
2. {EXECUTION_STEP_2}
3. {EXECUTION_STEP_3}
{REMAINING_EXECUTION_STEPS}

---

## Risk Summary

<!-- Aggregate of all section risks. Provides a quick overview of where
     the hard parts are in this plan. -->

### Risk Distribution

- **Green (Low Risk):** {GREEN_COUNT} sections
- **Yellow (Medium Risk):** {YELLOW_COUNT} sections
- **Red (High Risk):** {RED_COUNT} sections

### High-Risk Sections

<!-- Only sections rated Red. These need extra attention during execution. -->

| Section | Risk Summary | Mitigation |
|---------|-------------|------------|
{HIGH_RISK_TABLE}

### Medium-Risk Sections

<!-- Sections rated Yellow. May need iteration. -->

| Section | Risk Summary | Mitigation |
|---------|-------------|------------|
{MEDIUM_RISK_TABLE}

---

## Review Notes

<!-- This section is populated during Phase 4 (REVIEW). Left empty during initial generation. -->
<!-- DO NOT fill this section during Phase 3. It is written by the review process. -->

### Self-Review Results

<!-- Populated in Phase 4a -->

| # | Category | Issues Found | Auto-Fixed | Needs Decision |
|---|----------|-------------|------------|----------------|
| 1 | Completeness | {REVIEW_1_ISSUES} | {REVIEW_1_FIXED} | {REVIEW_1_DECISION} |
| 2 | Consistency | {REVIEW_2_ISSUES} | {REVIEW_2_FIXED} | {REVIEW_2_DECISION} |
| 3 | Feasibility | {REVIEW_3_ISSUES} | {REVIEW_3_FIXED} | {REVIEW_3_DECISION} |
| 4 | Security | {REVIEW_4_ISSUES} | {REVIEW_4_FIXED} | {REVIEW_4_DECISION} |
| 5 | Scalability | {REVIEW_5_ISSUES} | {REVIEW_5_FIXED} | {REVIEW_5_DECISION} |
| 6 | Edge Cases | {REVIEW_6_ISSUES} | {REVIEW_6_FIXED} | {REVIEW_6_DECISION} |
| 7 | User Experience | {REVIEW_7_ISSUES} | {REVIEW_7_FIXED} | {REVIEW_7_DECISION} |
| 8 | Cost & Complexity | {REVIEW_8_ISSUES} | {REVIEW_8_FIXED} | {REVIEW_8_DECISION} |

**Total issues found:** {REVIEW_TOTAL_ISSUES}
**Auto-fixed:** {REVIEW_TOTAL_FIXED}
**Needs user decision:** {REVIEW_TOTAL_DECISIONS}

### User Refinement Questions

<!-- Populated in Phase 4c: 5-10 non-obvious questions and user answers -->

{REFINEMENT_QA}

### Changes Made During Review

<!-- Log of all modifications made to sections during Phase 4 -->

{REVIEW_CHANGES_LOG}
