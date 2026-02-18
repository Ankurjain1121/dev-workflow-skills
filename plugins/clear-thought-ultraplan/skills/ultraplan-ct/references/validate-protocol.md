# Phase 5: VALIDATE Protocol

> Phase 5 of 6 - Traceability validation between PRD requirements and plan tasks.
> Input: PRD.md, PLAN.md, all section files
> Output: VALIDATE.md

---

## Thinking Framework: Systematic Tracing

Before building the traceability matrix, apply sequential thinking to trace each requirement methodically.

### Step 0a: Read Sequential Thinking

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/sequential-thinking.md` and apply **Numbered Sequential Thoughts**.

### Step 0b: Trace Each Requirement

For every requirement in the PRD, use numbered sequential thoughts to trace its path through the plan:

```markdown
### Tracing Requirement: "{REQUIREMENT_TEXT}"

**Thought 1:** This requirement appears in PRD Section {N} ({SECTION_NAME}) as a {P0/P1/P2} item.

**Thought 2:** The requirement implies these implementation needs:
- {NEED_1}: {DESCRIPTION}
- {NEED_2}: {DESCRIPTION}

**Thought 3:** Searching the plan sections for coverage:
- Section {NN} task {NN.M}: covers {NEED_1} via "{TASK_DESCRIPTION}"
- Section {NN} task {NN.M}: covers {NEED_2} via "{TASK_DESCRIPTION}"

**Thought 4:** Coverage assessment:
- {NEED_1}: COVERED by task {NN.M}
- {NEED_2}: PARTIAL - task exists but doesn't address {SPECIFIC_GAP}

**Thought 5:** Revision needed: Add acceptance criterion to task {NN.M} to cover {SPECIFIC_GAP}.

**Revision applied:** YES/NO
```

### Step 0c: Revision Points

During tracing, if any requirement reveals an issue:

1. **Document the revision point** - What was found, where, and what needs to change
2. **Apply the fix immediately** - Update the section file
3. **Log the revision** - Add to the validation change log

This makes validation an active process, not just a passive checklist.

---

## Step 1: Extract Requirements

Extract every testable requirement from the PRD.

### Extraction Rules

1. **From Section 4 (What It Does):**
   - Every P0 feature is a requirement
   - Every P1 feature is a requirement
   - P2 features are optional (trace them but don't flag gaps)

2. **From Section 3 (Who It's For):**
   - Every user need in the needs table is a requirement

3. **From Section 6 (What It Connects To):**
   - Every external service integration is a requirement
   - Every import/export capability is a requirement

4. **From Section 8 (How We'll Know It Works):**
   - Every success metric is a requirement
   - Every Definition of Done item is a requirement

5. **From Section 5 (How It Should Feel):**
   - Each key screen is a requirement
   - Each interaction pattern is a requirement (SOFT - acceptable as implicit)

### Requirement Format

```markdown
| # | Requirement | Source | Priority | Type |
|---|-------------|--------|----------|------|
| R01 | Users can create a recipe with title, ingredients, and steps | PRD 4.P0 | P0 | Feature |
| R02 | Users can search recipes by keyword | PRD 4.P0 | P0 | Feature |
| R03 | System integrates with Stripe for payments | PRD 6 | P0 | Integration |
| R04 | Page loads in under 2 seconds | PRD 8 | P0 | Performance |
| R05 | Recipe sharing via shareable link | PRD 4.P1 | P1 | Feature |
```

### Requirement Count Expectations

- P0 requirements: 5-15
- P1 requirements: 3-10
- P2 requirements: 2-8
- Integration requirements: 1-5
- Performance requirements: 1-3
- Total: 15-40 requirements

---

## Step 2: Extract Tasks

Build a task inventory from all section files.

### Task Extraction

For each section file, extract:
- Task ID (e.g., 03.2)
- Task title
- Files affected
- Section number and name

### Task Format

```markdown
| Task ID | Title | Section | Files |
|---------|-------|---------|-------|
| 01.1 | Create database schema | 01 - Database | schema.prisma |
| 01.2 | Write migration files | 01 - Database | migrations/ |
| 02.1 | Configure auth provider | 02 - Auth | auth.config.ts |
| 03.1 | Create recipe API routes | 03 - CRUD | api/recipes/ |
| 03.2 | Build recipe form component | 03 - CRUD | RecipeForm.tsx |
```

---

## Step 3: Build Traceability Matrix

Map every requirement to one or more tasks.

### Matrix Construction

For each requirement:
1. Search all task titles and descriptions for coverage
2. Assess coverage level:
   - **COVERED**: At least one task fully implements this requirement
   - **PARTIAL**: Tasks exist but don't fully cover the requirement
   - **GAP**: No task addresses this requirement

### Matrix Format

```markdown
## Traceability Matrix

| # | Requirement | PRD Section | Plan Section(s) | Task IDs | Status |
|---|-------------|-------------|-----------------|----------|--------|
| R01 | Create recipe | 4.P0 | 01, 03 | 01.1, 03.1, 03.2 | COVERED |
| R02 | Search recipes | 4.P0 | 04 | 04.1, 04.2, 04.3 | COVERED |
| R03 | Stripe integration | 6 | 06 | 06.1, 06.2, 06.3 | COVERED |
| R04 | Page load < 2s | 8 | 08 | 08.3 | PARTIAL |
| R05 | Share via link | 4.P1 | 06 | 06.4 | COVERED |
| R06 | Export to PDF | 4.P2 | - | - | GAP |
```

---

## Step 4: Gap Detection

Identify and resolve gaps in coverage.

### Gap Types

1. **Missing feature**: A PRD requirement has no corresponding task
2. **Partial coverage**: Tasks exist but don't fully implement the requirement
3. **Missing test**: Requirement is implemented but has no test coverage
4. **Missing error handling**: Happy path covered but error cases aren't
5. **Missing integration**: Feature works standalone but integration isn't tested

---

## Thinking Framework: Hypothesis Verification

When gaps are found, apply scientific method to determine if they are real omissions.

### Step 4a: Read Scientific Method

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/scientific-method.md` and apply **Hypothesis Testing**.

### Step 4b: Verify Each Gap

For each gap found, form and test a hypothesis:

```markdown
### Gap Verification: {GAP_DESCRIPTION}

**Hypothesis:** "This gap is a real omission because {REASON}"

**Test 1 - Implicit coverage check:**
Could this requirement be implicitly covered by another task?
- Check if the task's implementation would naturally include this
- Check if the framework/library handles this automatically
- Result: {COVERED_IMPLICITLY / NOT_COVERED}

**Test 2 - Scope check:**
Is this requirement actually in scope?
- Check PRD Section 7 (What It Does NOT Do) for explicit exclusions
- Check if this was a P2 feature that could be deferred
- Result: {IN_SCOPE / OUT_OF_SCOPE / DEFERRED}

**Test 3 - Dependency check:**
Could this be handled by a dependency?
- Check if the chosen library/framework provides this out of the box
- Check if a planned integration handles this
- Result: {HANDLED_BY_DEPENDENCY / NOT_HANDLED}

**Verdict:** {REAL_GAP / FALSE_POSITIVE / DEFERRED}
**Action:** {ADD_TASK / NO_ACTION / ADD_TO_BACKLOG}
```

### Step 4c: Resolve Real Gaps

For each confirmed real gap:

1. Determine which section should own the fix
2. Create a new task in that section
3. Assign a task ID following the section's numbering
4. Update the traceability matrix to show coverage
5. Log the resolution in the Gap Resolution Log

---

## Step 5: Scope Creep Detection

Identify tasks in the plan that do NOT trace to any PRD requirement.

### Detection Process

1. For every task in the task inventory, check if it traces to a requirement
2. Tasks that don't trace fall into one of these categories:

| Category | Action | Example |
|----------|--------|---------|
| Infrastructure | KEEP | Database migrations, CI/CD setup, env config |
| Testing | KEEP | Test setup, E2E configuration |
| Security | KEEP | Rate limiting, input validation, CORS |
| Developer Experience | KEEP | Linting, formatting, TypeScript config |
| Gold plating | REMOVE | Fancy animation, extra admin features |
| Out of scope | REMOVE | Features not in PRD |
| Deferred | DEFER | P2+ features moved to backlog |

### Scope Creep Report

```markdown
## Scope Creep Detection

| Item | Plan Location | Verdict | Reason |
|------|--------------|---------|--------|
| CI/CD pipeline setup | Section 09, Task 09.3 | KEEP | Infrastructure |
| Admin dashboard | Section 08, Task 08.5 | REMOVE | Not in PRD |
| Dark mode toggle | Section 08, Task 08.4 | DEFER | P2 feature, not critical |

### Legitimate Additions
- "CI/CD pipeline setup": Required infrastructure not explicitly in PRD but necessary
- "Rate limiting on auth endpoints": Security best practice, aligns with PRD Section 10
```

---

## Step 6: Generate Validation Report

Compile all validation findings into VALIDATE.md.

### Report Sections

1. **Traceability Matrix**: Full requirement-to-task mapping
2. **Coverage Summary**: Table showing coverage percentages by priority
3. **Gap Resolution Log**: All gaps found, their verification, and resolution
4. **Scope Creep Detection**: Items flagged and their verdicts
5. **Cross-Reference Checks**: PRD completeness, dependency integrity, task integrity
6. **Sequential Tracing Log**: Key revision points from systematic tracing
7. **Final Approval Status**: Pass/fail for each validation dimension

### Coverage Targets

| Priority | Minimum Coverage |
|----------|-----------------|
| P0 (Must-have) | 100% (every requirement must be covered) |
| P1 (Should-have) | 90% (minor gaps acceptable if documented) |
| P2 (Nice-to-have) | 50% (deferred items acceptable) |
| Overall | 85% |

### Validation Failure

If P0 coverage is below 100%:
1. STOP - do not proceed to Phase 6
2. Identify the uncovered P0 requirements
3. Create tasks to cover them
4. Re-run validation
5. Only proceed when P0 = 100%

---

## Step 7: Final Approval

Present validation results to the user.

### Presentation Format

```
Validation complete! Here are the results:

**Coverage:**
- P0 features: {N}/{N} covered (100%)
- P1 features: {N}/{N} covered ({PCT}%)
- P2 features: {N}/{N} covered ({PCT}%)
- Overall: {PCT}%

**Gaps found and resolved:** {N}
**Scope creep items removed:** {N}
**Scope creep items kept (infrastructure):** {N}

**Tracing revisions applied:** {N}

Does this look correct? Ready to finalize the plan?
```

### User Decisions

The user may:
1. **Approve**: Proceed to Phase 6
2. **Request changes**: Modify specific items and re-validate
3. **Add requirements**: Add new PRD items (triggers re-validation)
4. **Remove scope**: Downgrade P1 items to P2 or remove entirely

---

## Completion Criteria

Phase 5 is complete when:

1. All requirements are extracted from PRD
2. All tasks are extracted from section files
3. Traceability matrix is complete
4. P0 coverage = 100%
5. P1 coverage >= 90%
6. All gaps are resolved (fixed, deferred, or justified)
7. Scope creep items are addressed (kept, removed, or deferred)
8. Sequential tracing is complete with revisions applied
9. VALIDATE.md is written
10. User has approved validation results

### Completion Actions

1. Write VALIDATE.md to `{output_dir}/VALIDATE.md`
2. Update STATE.md with Phase 5 completion
3. Announce transition:
   ```
   Validation complete!
   - {N} requirements traced
   - {PCT}% overall coverage
   - {N} gaps found and resolved
   - {N} tracing revisions applied
   - P0: 100% | P1: {PCT}% | P2: {PCT}%

   Moving to Phase 6: OUTPUT - Generating final summary and deliverables.
   ```
