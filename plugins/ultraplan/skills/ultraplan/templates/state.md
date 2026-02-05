# UltraPlan State: {PROJECT_NAME}

> Auto-managed by UltraPlan. Do not edit manually.
> This file enables session resume and tracks all activity.

---

## Current Position

- **Phase:** {CURRENT_PHASE} of 6
- **Phase name:** {CURRENT_PHASE_NAME}
- **Status:** {CURRENT_STATUS}
- **Last activity:** {LAST_ACTIVITY_TIMESTAMP} - {LAST_ACTIVITY_DESCRIPTION}

<!-- Phase names: 1-UNDERSTAND, 2-RESEARCH, 3-PLAN, 4-REVIEW, 5-VALIDATE, 6-OUTPUT -->
<!-- Status values: not_started, in_progress, complete -->

---

## Progress

```
{PROGRESS_BAR}
```

**Phase breakdown:**

| Phase | Name | Status | Started | Completed |
|-------|------|--------|---------|-----------|
| 1 | UNDERSTAND | {PHASE_1_STATUS} | {PHASE_1_STARTED} | {PHASE_1_COMPLETED} |
| 2 | RESEARCH | {PHASE_2_STATUS} | {PHASE_2_STARTED} | {PHASE_2_COMPLETED} |
| 3 | PLAN | {PHASE_3_STATUS} | {PHASE_3_STARTED} | {PHASE_3_COMPLETED} |
| 4 | REVIEW | {PHASE_4_STATUS} | {PHASE_4_STARTED} | {PHASE_4_COMPLETED} |
| 5 | VALIDATE | {PHASE_5_STATUS} | {PHASE_5_STARTED} | {PHASE_5_COMPLETED} |
| 6 | OUTPUT | {PHASE_6_STATUS} | {PHASE_6_STARTED} | {PHASE_6_COMPLETED} |

---

## Phase Details

### Phase 1: UNDERSTAND

- **Questions asked:** {P1_QUESTIONS_ASKED}
- **Categories covered:** {P1_CATEGORIES_COVERED}/9
- **Last category:** {P1_LAST_CATEGORY}
- **Early stop:** {P1_EARLY_STOP}

### Phase 2: RESEARCH

- **Topics researched:** {P2_TOPICS_RESEARCHED}
- **Subagents completed:** {P2_SUBAGENTS_COMPLETED}/3
- **Conflicts found:** {P2_CONFLICTS_FOUND}
- **User reviewed:** {P2_USER_REVIEWED}

### Phase 3: PLAN

- **PRD status:** {P3_PRD_STATUS}
- **PRD sections approved:** {P3_PRD_SECTIONS_APPROVED}/10
- **Plan sections created:** {P3_PLAN_SECTIONS_CREATED}
- **Total tasks:** {P3_TOTAL_TASKS}
- **Parallel batches:** {P3_PARALLEL_BATCHES}

### Phase 4: REVIEW

- **Self-review complete:** {P4_SELF_REVIEW_COMPLETE}
- **Issues found:** {P4_ISSUES_FOUND}
- **Issues auto-fixed:** {P4_ISSUES_AUTO_FIXED}
- **Refinement questions asked:** {P4_REFINEMENT_QUESTIONS}
- **Sections updated:** {P4_SECTIONS_UPDATED}

### Phase 5: VALIDATE

- **Requirements traced:** {P5_REQUIREMENTS_TRACED}
- **Gaps found:** {P5_GAPS_FOUND}
- **Scope creep items:** {P5_SCOPE_CREEP}
- **User approved:** {P5_USER_APPROVED}

### Phase 6: OUTPUT

- **Files generated:** {P6_FILES_GENERATED}
- **Summary written:** {P6_SUMMARY_WRITTEN}

---

## Session History

| # | Date | Action | Details |
|---|------|--------|---------|
{SESSION_HISTORY_ROWS}

---

## Change Log

<!-- Populated by /ultraplan update command. Tracks every plan modification. -->

| # | Date | What Changed | Sections Affected | Details |
|---|------|-------------|-------------------|---------|
{CHANGE_LOG_ROWS}

<!-- If no updates yet: "(No updates yet. Use /ultraplan update to modify the plan.)" -->

---

## Configuration Snapshot

<!-- The configuration active when this plan was created. -->

```json
{CONFIG_SNAPSHOT}
```

---

## Resume Instructions

<!-- Used by UltraPlan to determine where to resume if interrupted -->

**Resume from:** {RESUME_PHASE}
**Resume action:** {RESUME_ACTION}
**Resume context:** {RESUME_CONTEXT}

<!-- Resume logic:
     - Phase 1: Resume from last completed category + 1
     - Phase 2: Skip if RESEARCH.md exists
     - Phase 3: If PRD exists but no sections, resume from Step 3b
     - Phase 4: If PLAN.md has "Review Notes", skip to Phase 5
     - Phase 5: Skip if VALIDATE.md exists
     - Phase 6: Re-run output generation
-->

---

## File Manifest

<!-- All files managed by this UltraPlan instance -->

| File | Status | Last Modified |
|------|--------|---------------|
| .ultraplan/DISCOVERY.md | {FILE_DISCOVERY_STATUS} | {FILE_DISCOVERY_MODIFIED} |
| .ultraplan/RESEARCH.md | {FILE_RESEARCH_STATUS} | {FILE_RESEARCH_MODIFIED} |
| .ultraplan/PRD.md | {FILE_PRD_STATUS} | {FILE_PRD_MODIFIED} |
| .ultraplan/PLAN.md | {FILE_PLAN_STATUS} | {FILE_PLAN_MODIFIED} |
| .ultraplan/VALIDATE.md | {FILE_VALIDATE_STATUS} | {FILE_VALIDATE_MODIFIED} |
| .ultraplan/STATE.md | {FILE_STATE_STATUS} | {FILE_STATE_MODIFIED} |
| .ultraplan/SUMMARY.md | {FILE_SUMMARY_STATUS} | {FILE_SUMMARY_MODIFIED} |
| .ultraplan/sections/index.md | {FILE_INDEX_STATUS} | {FILE_INDEX_MODIFIED} |
{SECTION_FILE_MANIFEST_ROWS}
