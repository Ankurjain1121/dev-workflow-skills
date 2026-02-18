# Update Protocol

> Used when updating an existing UltraPlan after requirements change.
> Invoked via `/ultraplan-ct update` or when the user says "update the plan."
> Cardinal rule: Never regenerate unaffected sections.

---

## Precondition Check

Before starting any update, verify the plan exists and is valid.

### Step 0: Verify Plan Exists

1. Check for `{output_dir}/PLAN.md`
   - If missing: "No plan found. Run `/ultraplan-ct` first to create one."
   - If exists: Continue

2. Check for `{output_dir}/STATE.md`
   - If missing: "STATE.md is missing. I can see PLAN.md but can't determine plan state. Want me to reconstruct state from the existing files?"
   - If exists: Read current state

3. Verify plan is complete (Phase 6 = COMPLETE)
   - If not complete: "The plan isn't finished yet (currently at Phase {N}). Want to resume the plan instead of updating it?"
   - If complete: Continue to update

4. Read the current state:
   - How many sections exist?
   - What's the current batch structure?
   - What's the validation status?
   - When was the plan last modified?

### State Summary

Present the current state to the user:

```
Found an existing plan:
- Project: {PROJECT_NAME}
- Sections: {N}
- Tasks: {N}
- Last modified: {DATE}
- Status: COMPLETE

What changed?
```

---

## Step 1: Ask What Changed

Use AskUserQuestion to understand what the user wants to change.

### Change Type Options

```
What type of change do you need?

a) Add a new feature (new section or tasks)
b) Remove a feature (delete section or tasks)
c) Change an existing feature (modify requirements)
d) Change the tech stack (different technology choice)
e) Reorder priorities (change P0/P1/P2 assignments)
f) Other (describe what changed)
```

### Handling Each Option

**Option a) Add a feature:**
- Will need new tasks and possibly a new section
- Must check dependencies (does the new feature depend on existing sections?)
- Must check if existing sections depend on this new feature
- May require new batch or insertion into existing batch

**Option b) Remove a feature:**
- Must identify all tasks related to the feature
- Must check what depends on the removed feature
- Must update dependency graph
- May simplify batch structure

**Option c) Change a feature:**
- Must identify which sections and tasks are affected
- Must determine if the change is additive (add tasks) or reductive (remove tasks) or transformative (rewrite tasks)
- Must check if the change affects other sections

**Option d) Change tech stack:**
- Major change. Most sections may need updates.
- Must re-evaluate research findings
- Must update architecture diagrams
- Must update all affected tasks

**Option e) Reorder priorities:**
- Update PRD Section 4
- May move tasks between sections or change batch ordering
- May affect risk assessments

**Option f) Other:**
- Ask follow-up questions to understand the change

---

## Step 2: Gather Change Details

Ask 3-8 follow-up questions based on the change type.

### For Adding a Feature (option a)

1. "Describe the new feature in detail. What does it do?"
2. "Which existing features does it interact with?"
3. "Is this a P0, P1, or P2 feature?"
4. "Does it need any new external services or integrations?"
5. "Does it have any new edge cases or risks?"
6. "Should it be its own section, or added to an existing section?"
7. "What's the testing requirement for this feature?"
8. "Does it change any existing user flows?"

### For Removing a Feature (option b)

1. "Which feature are you removing?"
2. "Are there related features that should also be removed?"
3. "Are there tasks that were only needed because of this feature?"
4. "Does removing this change the risk profile of any other section?"
5. "Should the PRD be updated to move this to 'What It Does NOT Do'?"

### For Changing a Feature (option c)

1. "Which feature is changing?"
2. "What specifically is different about it now?"
3. "Does the change affect the data model?"
4. "Does the change affect the UI?"
5. "Does the change affect integrations?"
6. "Are the existing tests still valid, or do they need updating?"
7. "Does this change the risk level of the section?"
8. "Does this change affect any other features?"

### For Changing Tech Stack (option d)

1. "What technology are you replacing?"
2. "What are you replacing it with?"
3. "Why the change? (performance, cost, preference, constraint)"
4. "How far along is implementation? (none, some, mostly done)"
5. "Are there any data migrations needed?"
6. "Does this affect hosting or deployment?"

### For Reordering Priorities (option e)

1. "Which features are changing priority?"
2. "What's driving the priority change? (user feedback, deadline, resource constraint)"
3. "Does the new priority affect the batch order?"

---

## Step 3: Detect Affected Sections

Analyze which parts of the plan need to change.

### Impact Analysis

For the described change, identify:

1. **Direct impact**: Sections/tasks that directly implement the changed feature
   - These sections will be regenerated

2. **Dependency impact**: Sections that depend on or are depended upon by changed sections
   - These sections may need dependency table updates
   - Check if batch ordering changes

3. **PRD impact**: Which PRD sections need updating
   - Section 4 (features) almost always changes
   - Section 6 (integrations) if new services are involved
   - Section 7 (not doing) if features are removed
   - Section 10 (risks) if risk profile changes

4. **Index impact**: Does the INDEX.md need updating?
   - New section: add row
   - Removed section: remove row
   - Changed section: update metadata (task count, risk)

### Impact Table

Present the impact analysis to the user:

```markdown
### Impact Analysis

| Scope | Items Affected | Type of Change |
|-------|---------------|----------------|
| Direct | Section 04 (Recipe Search) | REGENERATE - new search requirements |
| Dependency | Section 03 (Recipe CRUD) | UPDATE - new field added to recipe model |
| Dependency | Section 08 (Responsive UI) | UPDATE - new search UI component |
| PRD | Section 4 (What It Does) | UPDATE - add new P0 feature |
| PRD | Section 10 (Risks) | UPDATE - new integration risk |
| Index | INDEX.md | UPDATE - task count change |
| Plan | PLAN.md | UPDATE - dependency graph change |
```

### Confirm Before Proceeding

```
This change affects:
- {N} sections directly
- {N} sections via dependencies
- {N} PRD sections
- PLAN.md and INDEX.md

Sections that will NOT be touched: {LIST_UNAFFECTED_SECTIONS}

Proceed with the update?
```

---

## Step 4: Non-Destructive Regeneration

### The Cardinal Rule

**NEVER regenerate sections that are not affected by the change.**

This is the most important rule of the update protocol. Reasons:
- Unaffected sections may already have implementation progress
- Regeneration risks introducing inconsistencies
- Users trust that stable sections remain stable
- Minimizing change scope reduces error risk

### Procedure: Add Feature

1. **Create new section file** (if new section needed):
   - Assign next available section number
   - Follow section file format from plan-writing protocol
   - Include TDD stubs, risk assessment, tasks
   - Determine batch placement based on dependencies

2. **Or add tasks to existing section** (if extending existing section):
   - Add new tasks at the end of the section (don't renumber)
   - Update section header metadata (task count)
   - Add new TDD stubs for the new tasks
   - Update risk assessment if needed

3. **Update dependencies**:
   - Add dependency entries in new/modified section
   - Update dependency entries in sections that now depend on or are depended by the changed section
   - Do NOT open unaffected section files

4. **Update PLAN.md**:
   - Add new section to Section Index table
   - Add to Dependency Graph
   - Update Parallel Batch Groups
   - Update Execution Order
   - Update Risk Summary if needed

5. **Update PRD.md**:
   - Add feature to Section 4
   - Add integration to Section 6 if needed
   - Update risks in Section 10 if needed

6. **Update INDEX.md**:
   - Add new section row or update existing section metadata

### Procedure: Remove Feature

1. **Delete section file** (if removing entire section):
   - Remove the section-NN-slug.md file
   - Do NOT renumber remaining sections (leave the gap)

2. **Or remove tasks from section** (if partial removal):
   - Remove the task XML blocks
   - Update section header metadata (task count)
   - Remove related TDD stubs
   - Update risk assessment if needed
   - Do NOT renumber remaining tasks

3. **Update dependencies**:
   - Remove dependency entries that referenced the removed section/tasks
   - Check for newly orphaned sections (sections that only existed because of the removed feature)
   - Update batch grouping if a batch is now empty

4. **Update PLAN.md**:
   - Remove section from Section Index
   - Remove from Dependency Graph
   - Update Batch Groups
   - Update Execution Order
   - Update Risk Summary

5. **Update PRD.md**:
   - Move feature from Section 4 to Section 7 (What It Does NOT Do)
   - Remove integration from Section 6 if no longer needed
   - Update risks in Section 10

6. **Update INDEX.md**:
   - Remove section row or update existing section metadata

### Procedure: Change Feature

1. **Identify changed tasks**:
   - Which tasks need modification?
   - Which tasks need deletion?
   - Which new tasks are needed?

2. **Modify section file**:
   - Update task descriptions, steps, acceptance criteria
   - Add new tasks at the end (don't renumber)
   - Remove obsolete tasks (leave ID gap)
   - Update TDD stubs
   - Update risk assessment

3. **Check downstream**:
   - Do any other sections reference the changed tasks?
   - Do any sections depend on outputs that changed?
   - Update those sections minimally (dependency tables, not full regeneration)

4. **Update PLAN.md and INDEX.md**: Only metadata that changed

5. **Update PRD.md**: Only sections that changed

### Procedure: Reorder Priorities

1. **Update PRD.md Section 4**: Move features between P0/P1/P2
2. **Update batch ordering if needed**: Higher priority features should be in earlier batches
3. **Update risk assessments if needed**: Priority change may affect risk
4. **Do NOT regenerate section files**: Task content doesn't change, only priority labels

---

## Step 5: Update Traceability

After making changes, re-run a targeted validation.

### Targeted Validation

Only validate the changed items:

1. For added features: Verify new requirements have task coverage
2. For removed features: Verify removed tasks don't leave gaps in other requirements
3. For changed features: Verify modified tasks still cover the requirement
4. For reordered priorities: Verify P0 features still have 100% coverage

### Update VALIDATE.md

1. Add changed requirements to the traceability matrix
2. Remove deleted requirements
3. Update coverage percentages
4. Note the change in the Gap Resolution Log

### Do NOT re-validate unchanged items. Trust the existing validation.

---

## Step 6: Update STATE.md Change Log

Add the update to the STATE.md change log.

### Change Log Entry

```markdown
| Date | Phase | Change | Reason |
|------|-------|--------|--------|
| {DATE} | UPDATE | Added Section 10: Email Notifications | User requested email feature for recipe sharing |
| {DATE} | UPDATE | Removed Task 04.5: Advanced search filters | Deprioritized to post-launch |
| {DATE} | UPDATE | Modified Section 03: Added recipe draft support | User needs auto-save for long recipes |
```

### State Update

Update STATE.md's session history:

```markdown
| # | Session ID | Date | Phase | Activity |
|---|-----------|------|-------|----------|
| {N} | {ID} | {DATE} | UPDATE | {CHANGE_SUMMARY} |
```

---

## Step 7: Regenerate SUMMARY.md

SUMMARY.md must always reflect the current plan state.

### Regeneration Rules

1. Re-read all section files to get current task counts
2. Re-read PLAN.md to get current batch structure
3. Update all numbers and lists in SUMMARY.md
4. Update the architecture diagram if tech stack changed
5. Update the batch flow diagram if batches changed
6. Rerun Pareto analysis for updated "WHAT TO DO NEXT"

### SUMMARY.md is the one file that IS fully regenerated on every update.

This is because it's a derivative document (summarizes other documents) and must stay accurate.

---

## Step 8: Present Change Summary

After all updates are applied, present a summary to the user.

### Change Summary Banner

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ULTRAPLAN UPDATED                                          ║
║                                                              ║
║   Project: {PROJECT_NAME}                                    ║
║   Change: {CHANGE_SUMMARY}                                   ║
║                                                              ║
║   Files modified:                                            ║
║     {FILE_1}  - {WHAT_CHANGED}                               ║
║     {FILE_2}  - {WHAT_CHANGED}                               ║
║     {FILE_3}  - {WHAT_CHANGED}                               ║
║                                                              ║
║   Files NOT modified (unchanged):                            ║
║     {FILE_1}, {FILE_2}, {FILE_3}, ...                        ║
║                                                              ║
║   Current state:                                             ║
║     Sections: {N} (was {OLD_N})                              ║
║     Tasks: {N} (was {OLD_N})                                 ║
║     Batches: {N} (was {OLD_N})                               ║
║     Coverage: P0 {PCT}% | P1 {PCT}% | P2 {PCT}%             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Edge Cases

### Edge Case 1: Multiple Updates in One Session

If the user wants to make multiple changes:

1. Process each change sequentially
2. After each change, verify plan consistency
3. Do NOT batch multiple unrelated changes into one update
4. If changes conflict with each other, warn the user before applying the second change

```
You want to add a feature that requires PostgreSQL extensions,
but you also want to switch from PostgreSQL to MongoDB.
These changes conflict. Which should I apply?
```

### Edge Case 2: Review Note Conflicts

During Phase 4 review, notes were added to PLAN.md. An update might contradict those notes.

1. Read the Review Notes section before applying changes
2. If the update contradicts a review note, flag it:
   ```
   During review, we noted: "Keep recipe schema simple - avoid JSON fields."
   This new feature requires a JSON field for custom metadata.
   Should I proceed (overriding the review note) or adjust the approach?
   ```
3. If proceeding, update the review note to reflect the new decision

### Edge Case 3: Update That Affects Everything

Some changes affect every section (e.g., "switch from JavaScript to TypeScript"):

1. Acknowledge the scale:
   ```
   This change affects all {N} sections and {N} tasks.
   A full regeneration is needed. This is equivalent to re-running the plan phase.
   Want to proceed, or would you rather start a new plan?
   ```

2. If proceeding:
   - Regenerate all section files (this is the one exception to the cardinal rule)
   - Preserve task structure (same sections, same ordering)
   - Update implementation details (file extensions, types, etc.)
   - Re-run validation

3. Track as a "full regeneration" in the change log

### Edge Case 4: Partial Update (User Changes Mind)

If the user starts an update but changes their mind:

1. Ask: "Want to cancel this update? No changes have been saved yet."
2. If canceling: Revert to the pre-update state (no files changed)
3. If continuing with modifications: Adjust the change scope and proceed

### Edge Case 5: Update During Implementation

If some tasks are already marked complete:

1. Never modify or delete completed tasks
2. Warn if the change affects a completed section:
   ```
   Section 03 has 4/7 tasks completed. The change would modify tasks 03.2 and 03.5.
   Task 03.2 is already complete. Should I:
   a) Add a new task to adjust 03.2's output (preserving the completed work)
   b) Mark 03.2 as needing rework (it will need to be redone)
   ```
3. Prefer adding new tasks over modifying completed ones

### Edge Case 6: Cascading Dependencies

When a change in one section cascades through dependencies:

1. Trace the full dependency chain
2. List all affected sections
3. Determine which need regeneration vs. just dependency table updates
4. Present the full cascade to the user before proceeding:
   ```
   Changing Section 01 (Database) cascades to:
   - Section 03 (CRUD) - task modifications needed
   - Section 04 (Search) - index schema changes
   - Section 06 (Sharing) - permission model changes
   - Section 08 (UI) - form field updates

   Sections NOT affected:
   - Section 02 (Auth) - no database dependency
   - Section 09 (Deploy) - infrastructure unchanged

   Proceed?
   ```
