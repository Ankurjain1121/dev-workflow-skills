# Phase 5: VALIDATE Protocol

You are executing Phase 5 of UltraPlan. Your job is to cross-reference every requirement from DISCOVERY.md against the plan, verify complete coverage, detect scope creep, and get final user approval before output.

---

## Step 1: Extract Requirements from DISCOVERY.md

Read `.ultraplan/DISCOVERY.md` and extract every distinct requirement the user stated.

**Extraction rules:**
1. A "requirement" is any statement about what the app should DO, LOOK LIKE, SUPPORT, or CONNECT TO
2. Ignore meta-answers (user saying "I don't know" or "whatever you think")
3. Combine duplicates (same requirement stated in different categories)
4. Separate compound requirements (if user said "it should do X and Y", that's two requirements)
5. Include explicit "not" requirements (things the user said to exclude)
6. Include quality/non-functional requirements (performance, security, accessibility)
7. Include business model requirements (pricing, billing, free tier)

**Requirement format:**
```
REQ-01: Users can create accounts with email and password
REQ-02: Users can log in with Google
REQ-03: Users can create recipes with title, ingredients, and instructions
REQ-04: Users can upload photos for recipes
REQ-05: Recipes can be organized into collections
REQ-06: Users can share recipes via link
REQ-07: App should NOT include meal planning
REQ-08: App should load in under 3 seconds
REQ-09: Free tier with premium subscription option
...
```

Aim for 20-60 requirements depending on project complexity. If you extract fewer than 15, re-read DISCOVERY.md more carefully -- you are missing implicit requirements.

**Implicit requirement detection:**
- If user said "I want payments" -> that implies: payment form, payment processing, receipts, error handling for failed payments, subscription management (if subscription model)
- If user said "user accounts" -> that implies: signup, login, logout, password reset, profile page, account deletion
- If user said "mobile support" -> that implies: responsive design, touch-friendly interactions, mobile navigation

Extract both explicit AND implicit requirements.

---

## Step 2: Extract Tasks from Section Files

Read every section file in `.ultraplan/sections/` and extract every task.

**Task format for mapping:**
```
TASK 01-01: Create project scaffolding (section-01)
TASK 01-02: Configure database connection (section-01)
TASK 02-01: Create user database table (section-02)
TASK 02-02: Build signup endpoint (section-02)
...
```

---

## Step 3: Build Traceability Matrix

Map every requirement to its corresponding PRD section, plan section, and specific task IDs.

**Mapping procedure:**
1. For each requirement, find which PRD section covers it
2. For each requirement, find which plan section(s) implement it
3. For each requirement, find which specific task(s) deliver it
4. Mark the mapping status: Covered, Partial, or Missing

**Traceability table format:**

```markdown
## Traceability Matrix

| # | Requirement | Source | PRD Section | Plan Section | Task IDs | Status |
|---|-------------|--------|-------------|--------------|----------|--------|
| REQ-01 | Users can create accounts with email and password | Category 2, Q3 | What It Does | section-02 | 02-01, 02-02, 02-03 | Covered |
| REQ-02 | Users can log in with Google | Category 2, Q3 | What It Does | section-02 | 02-04 | Covered |
| REQ-03 | Users can create recipes | Category 1, Q2 | What It Does | section-03 | 03-01, 03-02, 03-03 | Covered |
| REQ-04 | Users can upload recipe photos | Category 1, Q3 | What It Does | section-04 | 04-01, 04-02, 04-03 | Covered |
| REQ-05 | Recipes organized into collections | Category 1, Q4 | What It Does | section-05 | 05-01, 05-02 | Covered |
| REQ-06 | Share recipes via link | Category 3, Q2 | What It Does | section-06 | 06-01, 06-02 | Covered |
| REQ-07 | NO meal planning | Category 1, Q7 | What It Does NOT Do | -- | -- | Excluded (by design) |
| REQ-08 | Load time under 3 seconds | Category 5, Q1 | How We'll Know It Works | section-10 | 10-02 | Covered |
| REQ-09 | Free tier with premium subscription | Category 8, Q1 | Business Model | -- | -- | MISSING |
| REQ-10 | Social login (implied by REQ-02) | Category 2, Q3 | What It Does | section-02 | 02-04 | Covered |
```

**Status definitions:**
- **Covered:** Requirement has at least one task that directly addresses it
- **Partial:** Requirement is mentioned in a task but not fully addressed (e.g., task says "add auth" but doesn't specify the Google login part)
- **Missing:** No task addresses this requirement at all
- **Excluded:** This is a "NOT" requirement -- it should NOT appear in any task

---

## Step 4: Gap Detection

For each requirement marked as MISSING or PARTIAL:

**Present to user via AskUserQuestion:**
```
Question: "Your requirement '[REQ-XX: description]' from our earlier conversation isn't fully covered in the plan. What should we do?"
Options:
1. "Add it as a new section (Recommended)"
2. "Add it as tasks in an existing section: [suggest most relevant section]"
3. "It's actually out of scope now -- remove it"
4. "I changed my mind about this -- skip it"
```

**Handle each response:**
- "Add as new section": Create a new section file following plan-writing.md rules. Add to index.md. Update dependency graph.
- "Add to existing section": Add tasks to the specified section. Update task IDs sequentially.
- "Out of scope": Move requirement to the "What It Does NOT Do" section in PRD.md. Mark as "Excluded" in matrix.
- "Changed mind": Mark as "Removed by user" in matrix. No plan changes needed.

**Present ALL gaps in a single batch.** Do not ask one at a time.

---

## Step 5: Scope Creep Detection

For each task in the plan, verify it maps to at least one requirement.

**Scan for tasks that don't map to any requirement:**
- These are things the plan includes that the user never asked for
- Common examples: analytics dashboards, admin panels, advanced caching, complex deployment pipelines

**For each unmapped task, present to user:**
```
Question: "The plan includes '[task name]' but you didn't specifically ask for it. This was added because [reason]. Should we keep it?"
Options:
1. "Keep it -- it's useful (Recommended)"
2. "Remove it -- I don't need that"
3. "Keep it but make it lower priority"
```

**Handle responses:**
- "Keep it": Add a corresponding requirement to the matrix as "Added during planning"
- "Remove it": Delete the task from its section. If the section becomes empty, remove the section.
- "Lower priority": Move it to a "Nice to Have" section or the polish section.

**Note:** Some tasks are legitimate infrastructure that the user would not think to ask for (database setup, environment config, project scaffolding). Do NOT flag these as scope creep. Only flag tasks that represent features or capabilities the user might not want.

**Tasks that are NEVER scope creep (do not flag these):**
- Project scaffolding and setup
- Database schema and migrations
- Environment variable configuration
- Basic error handling
- Authentication infrastructure (if auth was requested)
- Deployment configuration (if the user wants the app to work)

---

## Step 6: Generate Traceability Report

After resolving all gaps and scope creep, write `.ultraplan/VALIDATE.md`:

```markdown
# UltraPlan Validation Report

## Summary
- Total requirements extracted: [N]
- Requirements covered: [X]
- Requirements partially covered: [Y] (now resolved)
- Requirements missing: [Z] (now resolved)
- Scope creep items found: [W]
- Final status: All requirements traced to plan tasks

## Traceability Matrix

[Full table from Step 3, updated with resolutions]

## Gap Resolution Log

| # | Requirement | Original Status | Resolution | Action Taken |
|---|-------------|-----------------|------------|--------------|
| REQ-09 | Free tier with premium subscription | MISSING | Added as new section | Created section-11-billing.md |
| REQ-12 | Email notifications | PARTIAL | Added tasks to section-08 | Added tasks 08-04, 08-05 |
| REQ-15 | Dark mode | MISSING | Removed by user | User decided to skip for now |

## Scope Creep Resolution Log

| Task | Description | Resolution |
|------|-------------|------------|
| 09-03 | Admin analytics dashboard | Kept -- user approved |
| 10-04 | CDN configuration | Removed -- user didn't want it |

## Validation Verdict
[All requirements are covered / X requirements remain unresolved]
```

---

## Step 7: Final User Approval Gate

Present the validation summary to the user and ask for final approval.

**Format:**
```
## Validation Complete

All [N] requirements from your discovery session have been traced to the plan.

- [X] requirements fully covered
- [Y] gaps found and resolved
- [Z] scope creep items addressed

The plan is ready for final output.
```

**Ask via AskUserQuestion:**
```
Question: "All requirements are accounted for. Ready to generate your final plan files?"
Options:
1. "Yes, finalize everything (Recommended)"
2. "I want to add one more thing"
3. "I want to change something before we finalize"
4. "Let me review the full traceability table first"
```

**Handle responses:**
- "Yes": Proceed to Phase 6 (OUTPUT)
- "Add something": Ask what to add, create tasks/section, re-validate, re-ask
- "Change something": Ask what to change, update plan, re-validate, re-ask
- "Review table": Show the full traceability matrix, then re-ask the approval question

---

## Completion

After user approves, display:
```
Phase 5/6: VALIDATE [==========] 100% - Complete!
[N] requirements traced, [Y] gaps resolved, [Z] scope items addressed
Validation saved to .ultraplan/VALIDATE.md
Moving to Phase 6: OUTPUT...
```

Proceed to Phase 6.
