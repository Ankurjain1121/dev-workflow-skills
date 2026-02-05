# /ultraplan update Protocol

You are executing the `/ultraplan update` command. Your job is to non-destructively update an existing plan when the user's requirements change. You must NEVER regenerate the entire plan. Only touch what is affected by the change.

---

## Precondition Check

Before doing anything, verify the plan exists:

1. Check for `.ultraplan/STATE.md`
2. If it does NOT exist: tell the user "No existing plan found. Run `/ultraplan` first to create a plan." and stop.
3. If it exists: read STATE.md to understand the current plan state
4. Read `.ultraplan/sections/index.md` to understand the section structure
5. Read `.ultraplan/PRD.md` to understand current requirements

If the plan is incomplete (STATE.md shows a phase is still in progress), warn the user:
```
"Your plan is currently in Phase [N] and isn't finished yet.
Would you like to:"
Options:
1. "Resume where I left off (Recommended)"
2. "Update anyway -- I know what I want to change"
```

---

## Step 1: Ask What Changed

Use AskUserQuestion to understand the change:

```
Question: "What changed since the last version of your plan?"
Options:
1. "I want to add a new feature"
2. "I want to remove a feature"
3. "I want to change how something works"
4. "I want to change priorities (what gets built first)"
5. "Something external changed (new constraint, deadline, budget)"
6. "Other (let me explain)"
```

---

## Step 2: Gather Change Details

Based on the user's answer, ask 3-8 follow-up questions to fully understand the change. Use AskUserQuestion with multiple-choice options.

### If "Add a new feature":
- "Describe the new feature in a sentence or two"
- "How important is it? Must-have for launch, should-have soon after, or nice-to-have?"
- "Does it connect to any existing features?" (list current sections as options)
- "Does it need any new integrations? (payments, email, external services)"
- "Any specific visual/UX requirements for this feature?"

### If "Remove a feature":
- Show current feature list from PRD.md "What It Does" section
- "Which feature(s) do you want to remove?" (multiple-choice from feature list)
- "Why are you removing it? This helps me clean up related pieces."
- "Should I move it to 'Nice to Have' (future) instead of removing completely?"

### If "Change how something works":
- "Which part of the app are you changing?" (multiple-choice from section list)
- "What's wrong with the current approach?"
- "How should it work instead?"
- "Does this change affect other parts of the app?"

### If "Change priorities":
- Show current section order from index.md
- "What should be built first now?" (multiple-choice from sections)
- "What can be moved to later?"
- "Did any Must-Have features become Nice-to-Have, or vice versa?"

### If "External change":
- "What changed? (new deadline, budget constraint, team change, legal requirement)"
- "How does this affect what we're building?"
- "Do we need to cut scope, change approach, or add something?"

### If "Other":
- "Tell me what changed (type your answer)"
- Follow up with clarifying questions based on their response

---

## Step 3: Detect Affected Sections

After understanding the change, determine which files need updating.

**Impact analysis procedure:**

1. **Direct impact:** Which sections directly implement the changed feature?
   - Read each section file's Overview and Task names
   - Match against the user's change description

2. **Dependency impact:** Which sections depend on the directly affected sections?
   - Read index.md dependency graph
   - If section-03 changes and section-05 depends on section-03, check if section-05's tasks reference anything that changed in section-03

3. **PRD impact:** Which PRD sections need updating?
   - "What It Does" if features added/removed/changed
   - "What It Does NOT Do" if something moved to out-of-scope
   - "Risks & Concerns" if the change introduces new risks
   - "How We'll Know It Works" if success criteria change

4. **Index impact:** Does the section order, dependency graph, or batch grouping change?
   - New sections added -> update index
   - Sections removed -> update index
   - Dependency changes -> recalculate batches

**Output of impact analysis:**
```
Impact Analysis:
- Directly affected: section-03 (recipe-crud), section-06 (social-sharing)
- Dependency affected: section-07 (search-discovery) -- uses recipe data model
- PRD sections to update: "What It Does", "Risks & Concerns"
- Index update needed: Yes (new section added)
- Unaffected (preserved as-is): section-01, section-02, section-04, section-05, section-08, section-09, section-10
```

Present this analysis to the user before making changes:
```
Question: "Here's what I think needs to change. Does this look right?"
Options:
1. "Yes, update those sections (Recommended)"
2. "You're missing something -- [section X] is also affected"
3. "That's too much -- only update [specific sections]"
```

---

## Step 4: Non-Destructive Regeneration Rules

**The cardinal rule: NEVER regenerate unaffected sections.**

**What you CAN change:**
- Section files listed as directly or dependency affected
- PRD sections listed as affected
- index.md (section list, dependencies, batches)
- VALIDATE.md (traceability matrix)
- SUMMARY.md (must reflect current state)
- STATE.md (change log)

**What you MUST NOT change:**
- DISCOVERY.md (append new Q&A but never modify existing content)
- RESEARCH.md (append new research but never modify existing)
- Section files not in the affected list
- Task IDs in unaffected sections (external references must remain stable)

**Regeneration procedure for affected sections:**

1. **Adding a new feature:**
   - Create a new section file: `section-NN-name.md`
   - Assign the next available section number
   - Write tasks following xml-task-format.md
   - Add to index.md in the correct batch position
   - Update dependency graph
   - Add feature to PRD.md "What It Does"

2. **Removing a feature:**
   - Delete the section file
   - Remove from index.md
   - Update dependency graph (ensure no broken dependencies)
   - Move feature to PRD.md "What It Does NOT Do"
   - Check if any remaining sections referenced the deleted section

3. **Changing a feature:**
   - Read the existing section file
   - Modify ONLY the tasks that are affected by the change
   - Preserve unchanged tasks exactly as they are (same task IDs, same content)
   - If new tasks are needed, add them with sequential IDs after existing tasks
   - Update the section Overview if the change is significant
   - Update risk rating if the change affects complexity

4. **Changing priorities:**
   - Reorder sections in index.md
   - Recalculate batch assignments
   - Update dependency graph if ordering constraints changed
   - Do NOT modify section file contents (just their position in the index)

---

## Step 5: Update Traceability

After modifying sections, update `.ultraplan/VALIDATE.md`:

1. If new requirements were added: add rows to the traceability matrix
2. If requirements were removed: mark as "Removed in update [date]"
3. If tasks were added/removed: update task ID mappings
4. Re-verify: every requirement maps to at least one task
5. Flag any new gaps

If new gaps are found, resolve them with the user following the same gap detection protocol from validate-protocol.md.

---

## Step 6: Update STATE.md Change Log

Append to the Change Log table in STATE.md:

```markdown
| [date] | [What changed - short description] | [Comma-separated list of affected sections] | /ultraplan update |
```

**Examples:**
```markdown
| 2026-02-05 | Added recipe rating feature | section-03, section-07, new section-11 | /ultraplan update |
| 2026-02-06 | Removed social sharing | removed section-06, updated section-03 | /ultraplan update |
| 2026-02-07 | Changed auth to social-only | section-02 | /ultraplan update |
```

Also update the Session History:
```markdown
| [date] | UPDATE | /ultraplan update | [Short description of change] |
```

And update the Resume Data section to reflect current state.

---

## Step 7: Regenerate SUMMARY.md

SUMMARY.md must always reflect the current state of the plan. Regenerate it entirely using the output-format.md protocol. This is the ONE file that is always fully regenerated during updates, because it's a summary of everything else.

---

## Step 8: Present Change Summary

Show the user what was changed:

```
================================================================
ULTRAPLAN UPDATE COMPLETE
================================================================

What changed:
  [1-2 sentence description of the change]

Sections modified:
  - section-03-recipe-crud.md    [updated 2 tasks, added 1 task]
  - section-07-search-discovery  [updated 1 task]

Sections added:
  - section-11-ratings.md        [new, 5 tasks, yellow risk]

Sections removed:
  (none)

Sections unchanged (preserved):
  - section-01-project-setup.md
  - section-02-user-auth.md
  - section-04-photo-uploads.md
  - section-05-collections.md
  - section-06-social-sharing.md
  - section-08-notifications.md
  - section-09-admin-dashboard.md
  - section-10-polish-deploy.md

Updated totals: [N] sections, [M] tasks across [X] batches

Other files updated:
  - PRD.md         (updated "What It Does" section)
  - VALIDATE.md    (added 3 new requirement mappings)
  - SUMMARY.md     (regenerated)
  - STATE.md       (change logged)
  - sections/index.md (updated section list and batches)
================================================================
```

**Rules for the change summary:**
- List EVERY section and whether it was modified, added, removed, or unchanged
- Show specific task-level changes (how many tasks updated/added/removed per section)
- List all non-section files that were updated
- Include updated totals

---

## Edge Cases

### Multiple updates in sequence
- Each update appends to the change log -- never overwrites
- Task IDs from previous updates are preserved
- Section numbers are never reused (if section-06 was deleted, the next new section is section-11, not section-06)

### Update conflicts with review notes
- If PLAN.md has Review Notes from Phase 4, preserve them
- Add a new "Update Notes" section for each update

### Update that affects everything
- If the user's change is so fundamental that it affects all sections (e.g., "change the entire tech stack"), warn them:
  ```
  "This change affects every section. It might be faster to run /ultraplan from scratch.
  Would you like to:"
  Options:
  1. "Start fresh with /ultraplan (Recommended for this type of change)"
  2. "Update section by section anyway"
  ```

### Partial update (user stops midway)
- Save progress to STATE.md after each section is updated
- If the user runs `/ultraplan update` again, detect the incomplete update and offer to resume
