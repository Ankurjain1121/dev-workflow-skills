# UltraPlan State: {PROJECT_NAME}

> Last updated: {TIMESTAMP}
> Session ID: {SESSION_ID}

---

## Current Position

| Field | Value |
|-------|-------|
| Phase | {PHASE_NUMBER}/6 |
| Name | {PHASE_NAME} |
| Status | {NOT_STARTED/IN_PROGRESS/COMPLETE/BLOCKED} |
| Last activity | {TIMESTAMP} - {ACTIVITY_DESCRIPTION} |

### Progress

```
[{PROGRESS_BAR}] {PERCENTAGE}%
```

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 1 | UNDERSTAND | {STATUS} | {PCT}% |
| 2 | RESEARCH | {STATUS} | {PCT}% |
| 3 | PLAN | {STATUS} | {PCT}% |
| 4 | REVIEW | {STATUS} | {PCT}% |
| 5 | VALIDATE | {STATUS} | {PCT}% |
| 6 | OUTPUT | {STATUS} | {PCT}% |

---

## Phase Details

### Phase 1: UNDERSTAND
- Questions asked: {N}/{TARGET}
- Categories covered: {N}/9
- Discovery file: {EXISTS/MISSING}
- Early stop: {YES/NO}

### Phase 2: RESEARCH
- Codebase analysis: {DONE/PENDING/SKIPPED}
- Web research: {DONE/PENDING/SKIPPED}
- Docs research: {DONE/PENDING/SKIPPED}
- Competitor analysis: {DONE/PENDING/SKIPPED}
- Conflicts resolved: {N}

### Phase 3: PLAN
- PRD written: {YES/NO}
- PRD approved: {YES/NO}
- Sections planned: {N}/{TOTAL}
- Sections written: {N}/{TOTAL}
- Total tasks: {N}
- Batch groups: {N}

### Phase 4: REVIEW
- Review questions asked: {N}
- Changes made: {N}
- Checklist items passed: {N}/{TOTAL}
- Review approved: {YES/NO}

### Phase 5: VALIDATE
- Requirements traced: {N}/{TOTAL}
- Gaps found: {N}
- Gaps resolved: {N}
- Scope creep items: {N}
- Validation passed: {YES/NO}

### Phase 6: OUTPUT
- Summary generated: {YES/NO}
- State saved: {YES/NO}
- Files manifest complete: {YES/NO}

---

## Session History

| # | Session ID | Date | Phase | Activity |
|---|-----------|------|-------|----------|
| 1 | {ID} | {DATE} | {PHASE} | {ACTIVITY} |
| 2 | {ID} | {DATE} | {PHASE} | {ACTIVITY} |

---

## Change Log

| Date | Phase | Change | Reason |
|------|-------|--------|--------|
| {DATE} | {PHASE} | {CHANGE} | {REASON} |

---

## Configuration Snapshot

| Setting | Value |
|---------|-------|
| Discovery questions | {MIN}-{MAX} |
| Research subagents | {N} |
| PRD language | {LANG} |
| TDD stubs | {ENABLED/DISABLED} |
| XML tasks | {ENABLED/DISABLED} |
| Output directory | {DIR} |

---

## Resume Instructions

> To resume this planning session:
>
> 1. Run `/ultraplan-ct` or invoke the ultraplan-ct skill
> 2. The skill will detect this STATE.md and offer to resume
> 3. Current position: Phase {PHASE_NUMBER} - {PHASE_NAME}
> 4. Next action: {NEXT_ACTION}
>
> To start fresh, delete the `.ultraplan/` directory.

---

## File Manifest

| File | Status | Last Modified |
|------|--------|---------------|
| `DISCOVERY.md` | {EXISTS/MISSING} | {DATE} |
| `RESEARCH.md` | {EXISTS/MISSING} | {DATE} |
| `PRD.md` | {EXISTS/MISSING} | {DATE} |
| `PLAN.md` | {EXISTS/MISSING} | {DATE} |
| `section-{NN}-{SLUG}.md` | {EXISTS/MISSING} | {DATE} |
| `VALIDATE.md` | {EXISTS/MISSING} | {DATE} |
| `SUMMARY.md` | {EXISTS/MISSING} | {DATE} |
| `STATE.md` | {EXISTS} | {DATE} |
