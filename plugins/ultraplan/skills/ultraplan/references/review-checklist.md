# Phase 4: REVIEW Protocol

You are executing Phase 4 of UltraPlan. Your job is to critically self-review the plan, fix what you can, flag what needs user input, and ask non-obvious refinement questions the user probably did not think about.

---

## Step 4a: Self-Review Checklist

Run the following 8-category checklist against ALL plan documents: PRD.md, PLAN.md, and every section file in `.ultraplan/sections/`.

### Category 1: Completeness

**Check:** Does every requirement from DISCOVERY.md appear somewhere in the plan?

| # | Check | Pass Criteria | Fail Action |
|---|-------|---------------|-------------|
| 1.1 | Feature coverage | Every feature from "What It Does" in the PRD has at least one section and task | Add missing section or task |
| 1.2 | Edge case coverage | Every edge case from DISCOVERY.md Category 4 is addressed in at least one task | Add edge case handling task to relevant section |
| 1.3 | Integration coverage | Every integration from DISCOVERY.md Category 3 has a corresponding section or task | Add integration task or section |
| 1.4 | Empty states | The plan includes tasks for what users see when data is empty (no recipes, no followers, etc.) | Add empty state tasks to relevant UI sections |
| 1.5 | Error handling | Every API endpoint has error handling defined in its task | Add error handling to task action blocks |
| 1.6 | Loading states | UI tasks mention loading indicators for async operations | Add loading state requirements to UI tasks |

**Auto-fix:** Add missing tasks to the most appropriate existing section. If no section fits, create a new section.

### Category 2: Consistency

**Check:** Do sections and tasks agree with each other and with the PRD?

| # | Check | Pass Criteria | Fail Action |
|---|-------|---------------|-------------|
| 2.1 | Naming consistency | Same concept uses the same name everywhere (e.g., "recipe" not sometimes "dish") | Standardize naming across all files |
| 2.2 | File path consistency | Files referenced in tasks use consistent path conventions | Fix paths to match project structure |
| 2.3 | Data model consistency | Database columns/fields referenced in different tasks match | Align all references to the schema task |
| 2.4 | API consistency | Endpoint paths and methods are consistent between backend and frontend tasks | Fix mismatches |
| 2.5 | Dependency consistency | Section dependency claims match actual task content | Fix dependency declarations |

**Auto-fix:** Standardize all naming and references. Choose the most common/logical variant.

### Category 3: Feasibility

**Check:** Can each task actually be implemented as described?

| # | Check | Pass Criteria | Fail Action |
|---|-------|---------------|-------------|
| 3.1 | Task independence | Each task can be completed with only its listed files and previous tasks | Add missing file references or reorder tasks |
| 3.2 | Realistic scope | No single task requires more than ~15 minutes of AI execution | Split oversized tasks |
| 3.3 | Available APIs | Third-party APIs referenced in tasks actually exist and do what's claimed | Verify or replace with alternatives |
| 3.4 | Tech compatibility | Libraries and tools referenced are compatible with each other and the chosen stack | Flag incompatibilities for user decision |
| 3.5 | No circular deps | Section dependencies form a DAG (no cycles) | Restructure sections to break cycles |

**Auto-fix:** Split oversized tasks, fix ordering. Flag tech compatibility issues for user.

### Category 4: Security

**Check:** Are authentication, authorization, data protection, and input validation addressed?

| # | Check | Pass Criteria | Fail Action |
|---|-------|---------------|-------------|
| 4.1 | Auth on endpoints | Every API endpoint that needs authentication has auth check in its task | Add auth requirement to task action |
| 4.2 | Input validation | Every endpoint that accepts user input has validation in its task | Add validation to task action |
| 4.3 | Data access control | Tasks specify WHO can access WHAT data (not just that data exists) | Add access control to task action |
| 4.4 | Sensitive data | Passwords are hashed, tokens are secure, PII is protected | Add security requirements to relevant tasks |
| 4.5 | Environment secrets | API keys and secrets are loaded from environment, never hardcoded | Add env var tasks if missing |

**Auto-fix:** Add missing auth/validation requirements to task actions. Add security tasks if completely absent.

### Category 5: Scalability

**Check:** Will the architecture handle growth?

| # | Check | Pass Criteria | Fail Action |
|---|-------|---------------|-------------|
| 5.1 | Database indexing | Tasks creating database queries include index considerations | Add index notes to schema tasks |
| 5.2 | Pagination | List endpoints include pagination in their task descriptions | Add pagination to query tasks |
| 5.3 | File size limits | Upload tasks specify size limits and compression | Add limits to upload tasks |
| 5.4 | N+1 queries | Data fetching tasks avoid fetching in loops | Note optimization needs in task actions |

**Auto-fix:** Add pagination, indexing, and size limit notes. These are simple additions.

### Category 6: Edge Cases

**Check:** Are error states, empty states, and boundary conditions handled?

| # | Check | Pass Criteria | Fail Action |
|---|-------|---------------|-------------|
| 6.1 | Network failures | UI tasks handle API call failures gracefully | Add error handling to UI tasks |
| 6.2 | Concurrent access | Tasks involving shared data address concurrent modification | Add concurrency notes where relevant |
| 6.3 | Boundary values | Tasks validate boundary inputs (zero, negative, max length, special chars) | Add boundary validation |
| 6.4 | Deleted references | Tasks handle what happens when referenced data is deleted | Add cascade/cleanup logic |

**Auto-fix:** Add error handling and boundary validation notes to relevant tasks.

### Category 7: User Experience

**Check:** Does the plan deliver the UX vision from the PRD?

| # | Check | Pass Criteria | Fail Action |
|---|-------|---------------|-------------|
| 7.1 | UX vision match | UI tasks reference the visual style described in "How It Should Feel" | Add UX notes to UI tasks |
| 7.2 | Accessibility | At least one task per UI section mentions accessibility (keyboard nav, screen readers, contrast) | Add accessibility requirements |
| 7.3 | Mobile support | If responsive design was requested, UI tasks specify mobile behavior | Add responsive requirements |
| 7.4 | Feedback loops | User actions have visible feedback (success messages, loading indicators, confirmations) | Add feedback UI to tasks |

**Auto-fix:** Add accessibility and responsive notes. Flag UX vision mismatches for user.

### Category 8: Cost & Complexity

**Check:** Is the plan over-engineered? Can anything be simplified?

| # | Check | Pass Criteria | Fail Action |
|---|-------|---------------|-------------|
| 8.1 | Over-engineering | No section builds something more complex than the PRD requires | Simplify or flag for user |
| 8.2 | Unnecessary deps | No tasks introduce libraries/services not needed by the PRD | Remove unnecessary dependencies |
| 8.3 | Section count | Total sections is reasonable (5-15 for typical project) | Merge small sections or split bloated ones |
| 8.4 | Cost awareness | Tasks using paid services note the cost implications | Add cost notes |

**Auto-fix:** Remove unnecessary dependencies. Flag over-engineering for user decision.

---

## Step 4b: Review Summary

After running all 8 categories, present a plain-English summary to the user.

**Format:**
```
## Plan Review Results

### Issues Found: [total count]

| Category | Issues | Auto-Fixed | Needs Your Input |
|----------|--------|------------|------------------|
| Completeness | 3 | 2 | 1 |
| Consistency | 1 | 1 | 0 |
| Feasibility | 0 | 0 | 0 |
| Security | 2 | 2 | 0 |
| Scalability | 1 | 1 | 0 |
| Edge Cases | 2 | 2 | 0 |
| User Experience | 1 | 0 | 1 |
| Cost & Complexity | 0 | 0 | 0 |

### What I Fixed Automatically
- Added pagination to recipe list endpoint (section-03, task 03-03)
- Added password hashing to signup task (section-02, task 02-02)
- Added empty state handling for recipe list (section-03, task 03-05)
- [...]

### Needs Your Decision
1. [Issue description + question with AskUserQuestion]
2. [Issue description + question with AskUserQuestion]
```

For items needing user decision, use AskUserQuestion with clear options and a recommendation.

---

## Step 4c: Refinement Questions (Interview-Me Style)

After the self-review, ask 5-10 NON-OBVIOUS questions the user probably did not think about. These are NOT questions about gaps found in the review -- they are deeper thinking questions about the product.

**How to generate refinement questions:**
1. Look for implicit assumptions in the plan that were never confirmed
2. Think about edge cases in the user's specific domain
3. Consider growth scenarios and what breaks
4. Think about the user's users (end-users) and their potential frustrations
5. Consider competitive differentiation questions

**Question format:** Use AskUserQuestion with multiple-choice options. Include a recommendation.

**Question categories to draw from:**

- **Data lifecycle:** What happens to data over time? Archival? Deletion policies? Export?
- **User conflict:** What if users disagree? Report content? Block users? Disputes?
- **Growth boundaries:** At what point does the current design break? 1K users? 100K?
- **Recovery:** What if data is lost? Backups? User-initiated recovery?
- **Operational:** Who handles support tickets? How are bugs reported by users?
- **Legal/compliance:** Terms of service? Privacy policy? Cookie consent? Data residency?
- **Migration:** What if the user wants to switch platforms later? Data portability?

**Example refinement questions:**

1. "If a user deletes their account, should their shared recipes stay visible to others, or disappear?"
   - "Keep recipes visible but show 'by deleted user' (Recommended)"
   - "Delete everything they created"
   - "Let the user choose when deleting"
   - "Other"

2. "What if someone uploads a recipe with a photo they don't own? Who's responsible?"
   - "Add a 'report' button and terms of use saying users must own their photos (Recommended)"
   - "Don't worry about it for now"
   - "Require users to confirm they own the photo before uploading"
   - "Other"

3. "How should the app handle recipe versions? If someone edits a recipe that others have saved, do saved copies update?"
   - "Saved copies stay as they were when saved (Recommended)"
   - "Saved copies always show the latest version"
   - "Show a notification that the original was updated"
   - "Other"

4. "If your app goes viral and gets 10,000 users in a week, what's most important?"
   - "Keep it working even if it's slow (Recommended)"
   - "Keep it fast even if some features break"
   - "Stop new signups until we can scale"
   - "Other"

5. "Do you need analytics to understand how people use the app?"
   - "Yes, basic analytics like page views and popular recipes (Recommended)"
   - "Yes, detailed analytics with user behavior tracking"
   - "No, I don't need analytics right now"
   - "Other"

**Ask ALL refinement questions in a single batch** (or two batches if more than 5 questions).

---

## Step 4d: Update Plan

After receiving user answers to refinement questions:

1. Identify which sections are affected by the new answers
2. Update ONLY the affected section files
3. Re-run a QUICK consistency check on modified sections only (Categories 2 and 5 only)
4. Append a "Review Notes" section to PLAN.md:

```markdown
## Review Notes

### Self-Review Summary
- Date: [date]
- Issues found: [count]
- Auto-fixed: [count]
- User decisions: [count]

### Auto-Fixed Items
- [Item 1]
- [Item 2]

### User Decisions
- [Decision 1]: [User's choice]
- [Decision 2]: [User's choice]

### Refinement Questions & Answers
- Q: [Question] | A: [Answer]
- Q: [Question] | A: [Answer]

### Sections Modified During Review
- section-NN: [what changed]
- section-NN: [what changed]
```

---

## Completion

After updating the plan, display:
```
Phase 4/6: REVIEW [==========] 100% - Complete!
[X] issues found, [Y] auto-fixed, [Z] user decisions made
[N] refinement questions answered
[M] sections updated
Moving to Phase 5: VALIDATE...
```

Proceed to Phase 5.
