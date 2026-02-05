# UltraPlan Validation: {PROJECT_NAME}

> Generated: {TIMESTAMP}
> Phase: 5/6 - VALIDATE
> Requirements traced: {REQUIREMENTS_TRACED}
> Gaps found: {GAPS_FOUND}
> Scope creep items: {SCOPE_CREEP_COUNT}

---

## Traceability Matrix

<!-- Every requirement from Discovery mapped through PRD to Plan sections and tasks.
     Status values: Covered | MISSING | Scope Creep | Removed (by user) | Merged -->

| # | Requirement (from Discovery) | PRD Section | Plan Section | Task IDs | Status |
|---|------------------------------|-------------|--------------|----------|--------|
{TRACEABILITY_TABLE_ROWS}

### Coverage Summary

- **Total requirements extracted:** {TOTAL_REQUIREMENTS}
- **Fully covered:** {COVERED_COUNT}
- **Missing (gaps):** {MISSING_COUNT}
- **Scope creep (extra):** {SCOPE_CREEP_COUNT}
- **Removed by user:** {REMOVED_COUNT}
- **Merged into other sections:** {MERGED_COUNT}

**Coverage rate:** {COVERAGE_RATE}%

---

## Gap Resolution Log

<!-- Every requirement that was flagged as MISSING and how it was resolved.
     Resolution options: Added as new section | Merged into existing section |
     Marked out of scope | Removed (user changed mind) -->

| # | Missing Requirement | User Decision | Resolution | New Section/Task |
|---|---------------------|---------------|------------|-----------------|
{GAP_RESOLUTION_ROWS}

<!-- If no gaps: "No gaps detected. All discovery requirements trace to plan tasks." -->

---

## Scope Creep Detection

<!-- Tasks in the plan that don't trace back to any discovery requirement.
     These may be legitimate (infrastructure, setup, etc.) or unintended additions. -->

| # | Plan Task | Section | Justification | User Decision |
|---|-----------|---------|---------------|---------------|
{SCOPE_CREEP_ROWS}

<!-- If no scope creep: "No scope creep detected. All plan tasks trace to discovery requirements." -->

### Legitimate Additions

<!-- Tasks that are necessary for implementation but weren't explicitly requested
     (e.g., database setup, deployment config, error handling infrastructure).
     These are kept in the plan with documented justification. -->

{LEGITIMATE_ADDITIONS}

---

## Cross-Reference Checks

### PRD Completeness

<!-- Does every PRD section have corresponding plan sections? -->

| PRD Section | Plan Sections | Status |
|-------------|---------------|--------|
| What We're Building | {PRD1_SECTIONS} | {PRD1_STATUS} |
| The Problem | {PRD2_SECTIONS} | {PRD2_STATUS} |
| Who It's For | {PRD3_SECTIONS} | {PRD3_STATUS} |
| What It Does | {PRD4_SECTIONS} | {PRD4_STATUS} |
| How It Should Feel | {PRD5_SECTIONS} | {PRD5_STATUS} |
| What It Connects To | {PRD6_SECTIONS} | {PRD6_STATUS} |
| What It Does NOT Do | {PRD7_SECTIONS} | {PRD7_STATUS} |
| How We'll Know It Works | {PRD8_SECTIONS} | {PRD8_STATUS} |
| Business Model | {PRD9_SECTIONS} | {PRD9_STATUS} |
| Risks & Concerns | {PRD10_SECTIONS} | {PRD10_STATUS} |

### Dependency Integrity

<!-- Are there any circular dependencies? Missing dependencies? -->

- **Circular dependencies found:** {CIRCULAR_DEPS}
- **Missing dependency declarations:** {MISSING_DEPS}
- **Orphaned sections (no connections):** {ORPHANED_SECTIONS}

### Task Integrity

<!-- Are there any tasks with missing fields? Empty verification criteria? -->

- **Tasks with missing files:** {TASKS_MISSING_FILES}
- **Tasks with missing verification:** {TASKS_MISSING_VERIFY}
- **Tasks with missing done criteria:** {TASKS_MISSING_DONE}

---

## Final Approval Status

**Validation result:** {VALIDATION_RESULT}

<!-- Values: PASSED (all requirements covered, no unresolved gaps)
            PASSED WITH NOTES (minor items documented)
            FAILED (unresolved gaps or issues) -->

**Unresolved items:** {UNRESOLVED_COUNT}

### User Sign-off

**User approved:** {USER_APPROVED}
**Approval timestamp:** {APPROVAL_TIMESTAMP}
**User comments:** {USER_COMMENTS}

### Ready for Output

**Proceed to Phase 6 (OUTPUT):** {PROCEED_TO_OUTPUT}
