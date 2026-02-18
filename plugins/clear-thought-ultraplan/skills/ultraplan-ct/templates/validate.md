# UltraPlan Validation: {PROJECT_NAME}

> Generated: {TIMESTAMP}
> Phase: 5/6 - VALIDATE
> Requirements traced: {TOTAL_REQUIREMENTS}
> Gaps found: {TOTAL_GAPS}
> Scope creep items: {TOTAL_CREEP}

---

## Traceability Matrix

| # | Requirement | PRD Section | Plan Section | Task IDs | Status |
|---|-------------|-------------|-------------|----------|--------|
| R1 | {REQUIREMENT} | {PRD_SECTION} | {PLAN_SECTION} | {TASK_IDS} | {COVERED/GAP/PARTIAL} |
| R2 | {REQUIREMENT} | {PRD_SECTION} | {PLAN_SECTION} | {TASK_IDS} | {COVERED/GAP/PARTIAL} |
| R3 | {REQUIREMENT} | {PRD_SECTION} | {PLAN_SECTION} | {TASK_IDS} | {COVERED/GAP/PARTIAL} |

---

## Coverage Summary

| Priority | Total | Covered | Gaps | Coverage |
|----------|-------|---------|------|----------|
| P0 (Must-have) | {N} | {N} | {N} | {PCT}% |
| P1 (Should-have) | {N} | {N} | {N} | {PCT}% |
| P2 (Nice-to-have) | {N} | {N} | {N} | {PCT}% |
| **Total** | **{N}** | **{N}** | **{N}** | **{PCT}%** |

---

## Gap Resolution Log

| Gap # | Requirement | Resolution | Section/Task Added | Status |
|-------|-------------|------------|--------------------|--------|
| G1 | {REQUIREMENT} | {RESOLUTION} | {SECTION_TASK} | {RESOLVED/DEFERRED/WONTFIX} |
| G2 | {REQUIREMENT} | {RESOLUTION} | {SECTION_TASK} | {RESOLVED/DEFERRED/WONTFIX} |

---

## Scope Creep Detection

> Items in the plan that do NOT trace back to any PRD requirement.

| Item | Plan Location | Verdict | Reason |
|------|--------------|---------|--------|
| {ITEM} | Section {NN}, Task {ID} | {REMOVE/KEEP/DEFER} | {REASON} |
| {ITEM} | Section {NN}, Task {ID} | {REMOVE/KEEP/DEFER} | {REASON} |

### Legitimate Additions

> Items flagged as scope creep but justified (infrastructure, testing, etc.)

- {ITEM}: {JUSTIFICATION}
- {ITEM}: {JUSTIFICATION}

---

## Cross-Reference Checks

### PRD Completeness

| PRD Section | Has plan coverage? | Notes |
|-------------|--------------------|-------|
| 1. What We're Building | {YES/NO/PARTIAL} | {NOTES} |
| 2. The Problem | {N/A} | Context only |
| 3. Who It's For | {YES/NO/PARTIAL} | {NOTES} |
| 4. What It Does | {YES/NO/PARTIAL} | {NOTES} |
| 5. How It Should Feel | {YES/NO/PARTIAL} | {NOTES} |
| 6. What It Connects To | {YES/NO/PARTIAL} | {NOTES} |
| 7. What It Does NOT Do | {VERIFIED} | {NOTES} |
| 8. How We'll Know It Works | {YES/NO/PARTIAL} | {NOTES} |
| 9. Business Model | {N/A or YES/NO} | {NOTES} |
| 10. Risks & Concerns | {ADDRESSED} | {NOTES} |

### Dependency Integrity

- [ ] No circular dependencies
- [ ] All dependencies reference existing sections
- [ ] Batch ordering respects all dependencies
- [ ] No orphaned sections (unreachable)

### Task Integrity

- [ ] Every task has clear acceptance criteria
- [ ] Every task references specific files
- [ ] Every task has 1-3 files (atomic)
- [ ] All file paths are consistent across sections
- [ ] No duplicate work across tasks

---

## Final Approval Status

| Check | Status |
|-------|--------|
| All P0 requirements covered | {PASS/FAIL} |
| All P1 requirements covered | {PASS/FAIL} |
| No unjustified scope creep | {PASS/FAIL} |
| Dependencies valid | {PASS/FAIL} |
| Task integrity confirmed | {PASS/FAIL} |
| User approved | {PENDING/APPROVED} |
| **Overall** | **{PASS/FAIL}** |
