# Section {NN}: {SECTION_NAME}

> Part of: {PROJECT_NAME} UltraPlan
> Batch: {BATCH_NUMBER}
> Tasks: {TASK_COUNT}
> Risk: {RISK_COLOR} {RISK_LEVEL}

---

## Overview

{SECTION_OVERVIEW_PARAGRAPH}

---

## Risk

| Aspect | Value |
|--------|-------|
| Color | {GREEN/YELLOW/RED} |
| Summary | {ONE_LINE_RISK_SUMMARY} |
| Explanation | {WHY_THIS_RISK_LEVEL} |

### Risk Factors
- {FACTOR_1}
- {FACTOR_2}

### Mitigation
- {MITIGATION_1}
- {MITIGATION_2}

---

## Dependencies

| Type | Section | Description |
|------|---------|-------------|
| Depends on | {SECTION_NN} | {WHY} |
| Blocks | {SECTION_NN} | {WHY} |

**Batch:** {BATCH_NUMBER}
**Parallel siblings:** {SECTION_NN}, {SECTION_NN}

---

## TDD Test Stubs

> Write these tests BEFORE implementing the tasks.

1. `{TEST_DESCRIPTION_1}`
2. `{TEST_DESCRIPTION_2}`
3. `{TEST_DESCRIPTION_3}`
4. `{TEST_DESCRIPTION_4}`
5. `{TEST_DESCRIPTION_5}`
6. `{TEST_DESCRIPTION_6}`

---

## Files Touched

| File | Action | Description |
|------|--------|-------------|
| `{FILE_PATH}` | {CREATE/MODIFY/DELETE} | {DESCRIPTION} |
| `{FILE_PATH}` | {CREATE/MODIFY/DELETE} | {DESCRIPTION} |

---

## Tasks

<task id="{NN}.1" title="{TASK_TITLE}" status="pending">
**Description:** {DETAILED_DESCRIPTION}

**Files:**
- `{FILE_PATH}` ({CREATE/MODIFY})

**Steps:**
1. {STEP_1}
2. {STEP_2}
3. {STEP_3}

**Acceptance criteria:**
- {CRITERION_1}
- {CRITERION_2}

**Test:** {RELATED_TDD_STUB}
</task>

<task id="{NN}.2" title="{TASK_TITLE}" status="pending">
**Description:** {DETAILED_DESCRIPTION}

**Files:**
- `{FILE_PATH}` ({CREATE/MODIFY})

**Steps:**
1. {STEP_1}
2. {STEP_2}
3. {STEP_3}

**Acceptance criteria:**
- {CRITERION_1}
- {CRITERION_2}

**Test:** {RELATED_TDD_STUB}
</task>

<task id="{NN}.3" title="{TASK_TITLE}" status="pending">
**Description:** {DETAILED_DESCRIPTION}

**Files:**
- `{FILE_PATH}` ({CREATE/MODIFY})

**Steps:**
1. {STEP_1}
2. {STEP_2}
3. {STEP_3}

**Acceptance criteria:**
- {CRITERION_1}
- {CRITERION_2}

**Test:** {RELATED_TDD_STUB}
</task>

---

## Section Completion Criteria

- [ ] All tasks marked complete
- [ ] All TDD stubs have passing tests
- [ ] No lint or type errors
- [ ] Code reviewed
- [ ] {CUSTOM_CRITERION}

---

## Notes

{ADDITIONAL_NOTES}
