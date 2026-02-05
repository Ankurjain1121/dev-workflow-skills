# Section {SECTION_NUMBER}: {SECTION_NAME}

> Part of: UltraPlan for {PROJECT_NAME}
> Risk: {RISK_COLOR} | Batch: {BATCH_NUMBER} | Tasks: {TASK_COUNT}
> Generated: {TIMESTAMP}

---

## Overview

<!-- Plain English description of what this section builds. A no-coder should be able
     to understand what this section accomplishes and why it matters. -->

{SECTION_OVERVIEW}

---

## Risk: {RISK_COLOR} - {RISK_SUMMARY}

<!-- Risk rating explanation -->

**Rating:** {RISK_COLOR}
**Why:** {RISK_EXPLANATION}

**Risk factors:**
{RISK_FACTORS}

**Mitigation:**
{RISK_MITIGATION}

---

## Dependencies

- **Depends on:** {DEPENDS_ON}
- **Blocks:** {BLOCKS}
- **Parallel batch:** {BATCH_NUMBER}
- **Can run simultaneously with:** {PARALLEL_SIBLINGS}

<!-- Dependency explanation: why this section needs its dependencies and
     why it blocks the sections it blocks -->

{DEPENDENCY_EXPLANATION}

---

## TDD Test Stubs

<!-- Tests that should pass when this section is fully implemented.
     Written in plain English so the AI executor knows what "done" looks like.
     Each test should be independently verifiable. -->

- Test: {TEST_STUB_1}
- Test: {TEST_STUB_2}
- Test: {TEST_STUB_3}
- Test: {TEST_STUB_4}
{REMAINING_TEST_STUBS}

---

## Files Touched

<!-- Summary of all files created or modified in this section -->

| File | Action | Purpose |
|------|--------|---------|
{FILES_TABLE}

---

## Tasks

<!-- Each task is an atomic unit of work. Execute them in order.
     Each task should result in one git commit when done.
     Tasks within a section are SEQUENTIAL (do them in order). -->

<task type="auto" id="{SECTION_NUMBER}-01">
  <name>{TASK_1_NAME}</name>
  <files>{TASK_1_FILES}</files>
  <action>
{TASK_1_ACTION}
  </action>
  <verify>{TASK_1_VERIFY}</verify>
  <done>{TASK_1_DONE}</done>
</task>

<task type="auto" id="{SECTION_NUMBER}-02">
  <name>{TASK_2_NAME}</name>
  <files>{TASK_2_FILES}</files>
  <action>
{TASK_2_ACTION}
  </action>
  <verify>{TASK_2_VERIFY}</verify>
  <done>{TASK_2_DONE}</done>
</task>

{REMAINING_TASKS}

<!-- Template for additional tasks:

<task type="auto" id="{SECTION_NUMBER}-{TASK_NUMBER}">
  <name>{TASK_NAME}</name>
  <files>{FILE_LIST}</files>
  <action>
    {INSTRUCTIONS}
  </action>
  <verify>{VERIFICATION}</verify>
  <done>{DONE_CRITERIA}</done>
</task>

-->

---

## Section Completion Criteria

<!-- All of the following must be true for this section to be considered complete -->

1. All {TASK_COUNT} tasks are done
2. All TDD test stubs pass
3. No lint or type errors introduced
4. Code committed with descriptive message per task
5. {ADDITIONAL_COMPLETION_CRITERIA}

---

## Notes

<!-- Any additional context, warnings, or tips for the AI executor -->

{SECTION_NOTES}
