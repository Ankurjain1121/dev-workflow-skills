# Phase 4: REVIEW Protocol

> Phase 4 of 6 - Systematic plan review and refinement.
> Input: PLAN.md, all section files, PRD.md
> Output: Updated PLAN.md and section files with review notes

---

## Thinking Framework: Multi-Persona Review

Before running the 8-category checklist, apply multi-perspective review.

### Step 0a: Read Collaborative Reasoning

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/collaborative-reasoning.md` and apply **Multi-Persona Review**.

### Step 0b: Create Review Personas

Create 3 review personas that will each review the plan from a different perspective:

#### Persona 1: Security Expert

**Focus areas:**
- Authentication and authorization flows
- Data validation at every boundary
- Secrets management and exposure
- API security (rate limiting, CORS, input sanitization)
- Data privacy and compliance
- Third-party service trust boundaries

**Review questions:**
- "Where can an attacker inject malicious data?"
- "What happens if a JWT/token is stolen?"
- "Which endpoints are exposed without authentication?"
- "Is sensitive data encrypted at rest and in transit?"
- "Are there any admin-only operations accessible to regular users?"

#### Persona 2: User Advocate

**Focus areas:**
- User experience during happy path
- Error states and recovery
- Loading states and perceived performance
- Accessibility and inclusivity
- Onboarding flow
- Mobile experience

**Review questions:**
- "What does the user see when something fails?"
- "How long does the user wait for each action?"
- "Can a screen-reader user complete the core workflow?"
- "What happens if the user closes their browser mid-action?"
- "Is the first-time experience intuitive without a tutorial?"

#### Persona 3: Devil's Advocate

**Focus areas:**
- Assumptions that might be wrong
- Edge cases not covered
- Scale scenarios not planned for
- What if key dependencies disappear?
- What if requirements change significantly?

**Review questions:**
- "What if this technology gets abandoned in 6 months?"
- "What if we get 100x the expected users on day one?"
- "What if the user's answer in discovery was wrong about X?"
- "Where is the plan most fragile?"
- "What's the most expensive thing to change later?"

### Step 0c: Run Persona Reviews

For each persona, review the entire plan:

1. Read PLAN.md and all section files through that persona's lens
2. Document findings as:
   ```markdown
   ### {PERSONA_NAME} Findings

   | # | Section | Finding | Severity | Recommendation |
   |---|---------|---------|----------|----------------|
   | 1 | 02-auth | No rate limiting on login endpoint | HIGH | Add rate limit task to section 02 |
   | 2 | 05-upload | No max file size validation | MEDIUM | Add client + server validation |
   | 3 | 03-crud | No optimistic locking for concurrent edits | LOW | Add version field to recipe schema |
   ```

3. Merge persona findings with the 8-category checklist (Step 4a below)

---

## Step 4a: The 8-Category Review Checklist

Systematically review the plan across 8 dimensions.

### Category 1: Completeness

- [ ] Every P0 feature from PRD is covered by at least one task
- [ ] Every P1 feature from PRD is covered by at least one task
- [ ] Every integration from PRD Section 6 has implementation tasks
- [ ] Every risk from PRD Section 10 has a mitigation task
- [ ] Auth flow is complete (signup, login, logout, password reset, session management)
- [ ] Error handling is specified for every API endpoint
- [ ] Loading states are specified for every async operation
- [ ] Empty states are designed for every list/collection view
- [ ] Database migrations cover all required schema changes
- [ ] Environment configuration is documented (env vars, secrets)

### Category 2: Consistency

- [ ] File paths are consistent across all section files
- [ ] Naming conventions are consistent (same casing, same patterns)
- [ ] API patterns are consistent (same response format, same error format)
- [ ] State management approach is consistent across features
- [ ] Component patterns are consistent (same prop patterns, same composition approach)
- [ ] Testing patterns are consistent (same mocking strategy, same assertion style)
- [ ] Error handling is consistent (same error types, same recovery patterns)
- [ ] All sections reference the same tech stack versions

### Category 3: Dependencies

- [ ] No circular dependencies between sections
- [ ] All hard dependencies are in earlier batches
- [ ] Soft dependencies are in the same or earlier batches
- [ ] No orphaned sections (unreachable from any path)
- [ ] Dependency graph matches the batch grouping
- [ ] Shared utilities and types are in the earliest possible section
- [ ] No task references files from a later-batch section
- [ ] Database schema section is in Batch 1

### Category 4: Risk

- [ ] Every RED risk section has at least 2 mitigation tasks
- [ ] Every YELLOW risk section has at least 1 mitigation task
- [ ] High-risk sections are in early batches (fail fast)
- [ ] Risk assessments are realistic (not all GREEN for a complex project)
- [ ] External integration risks are acknowledged
- [ ] Performance risks are acknowledged for data-heavy features
- [ ] Security risks are acknowledged for auth and data features
- [ ] No section has unmitigated HIGH risks

### Category 5: Atomicity

- [ ] Every task touches 1-3 files (not more)
- [ ] Every task has clear acceptance criteria
- [ ] Every task can be verified independently
- [ ] No task is "implement the entire feature"
- [ ] Tasks within a section can be done sequentially without confusion
- [ ] Each task has a clear starting point and ending point
- [ ] Complex tasks are split into smaller subtasks

### Category 6: Testability

- [ ] Every section has TDD test stubs
- [ ] TDD stubs cover happy path, error path, and edge cases
- [ ] Test stubs are specific enough to write actual tests from
- [ ] Integration points have integration test stubs
- [ ] Critical user flows have E2E test stubs
- [ ] Test stubs reference specific functions/components
- [ ] No task says "add tests" without specifying what to test

### Category 7: Performance

- [ ] Database queries are indexed for expected access patterns
- [ ] Pagination is specified for all list endpoints
- [ ] Image/file handling includes optimization (resize, compress)
- [ ] Caching strategy is specified where applicable
- [ ] Bundle size considerations for frontend (lazy loading, code splitting)
- [ ] API response times have targets
- [ ] Real-time features have connection management strategy
- [ ] Large data operations have batch processing strategy

### Category 8: Deployment

- [ ] Environment variables are listed
- [ ] Database migration strategy is defined
- [ ] Deployment target is specified (Vercel, Railway, AWS, etc.)
- [ ] CI/CD pipeline tasks exist
- [ ] Rollback strategy is mentioned for risky deployments
- [ ] Monitoring and logging are planned
- [ ] DNS/domain configuration is addressed
- [ ] SSL/TLS is handled (usually by hosting provider)

---

## Thinking Framework: Pre-Mortem Debugging

After the checklist, apply pre-mortem analysis to anticipate failures.

### Step 4b: Read Debugging Approaches

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/debugging-approaches.md` and apply **Cause Elimination**.

### Step 4c: Pre-Mortem for Yellow/Red Sections

For each section with YELLOW or RED risk:

1. **Assume the section has failed.** The feature doesn't work. Tests fail. Users are affected.
2. **Work backwards**: What could have caused the failure?
3. **Apply Cause Elimination**:
   - List all possible causes (exhaustive list)
   - For each cause, determine if the current plan prevents it
   - If not prevented, add a preventive task

### Pre-Mortem Template

```markdown
### Pre-Mortem: Section {NN} - {NAME}

**Scenario:** This section has failed in production. What went wrong?

| # | Possible Cause | Currently Prevented? | Preventive Action |
|---|---------------|---------------------|-------------------|
| 1 | Stripe webhook signature verification skipped | NO | Add signature verification task |
| 2 | Payment amount mismatch between client and server | NO | Add server-side price validation |
| 3 | Race condition on concurrent purchases | NO | Add database-level locking |
| 4 | User sees success but payment actually failed | PARTIAL | Add webhook confirmation step |
| 5 | Refund flow breaks when original payment method expired | NO | Add refund error handling task |

**New tasks to add:**
- Task {NN}.X: {TASK_DESCRIPTION} (prevents cause #{N})
- Task {NN}.Y: {TASK_DESCRIPTION} (prevents cause #{N})
```

### Step 4d: Add Preventive Tasks

For each unmitigated cause identified:
1. Create a new task in the relevant section
2. Mark it as a mitigation task (reference the pre-mortem)
3. Verify the task has clear acceptance criteria
4. Update the section's task count

---

## Step 4e: Review Summary

Compile all review findings into a structured summary.

### Review Summary Format

```markdown
## Review Summary

### Statistics
- Categories checked: 8/8
- Checks passed: {N}/{TOTAL}
- Checks failed: {N}/{TOTAL}
- Persona findings: {N} total ({HIGH} high, {MEDIUM} medium, {LOW} low)
- Pre-mortem causes found: {N}
- New tasks added: {N}

### Critical Issues (must fix before proceeding)
1. {ISSUE}: {LOCATION} - {FIX}
2. {ISSUE}: {LOCATION} - {FIX}

### Important Issues (should fix)
1. {ISSUE}: {LOCATION} - {FIX}
2. {ISSUE}: {LOCATION} - {FIX}

### Minor Issues (nice to fix)
1. {ISSUE}: {LOCATION} - {FIX}

### Persona Review Highlights
- **Security Expert**: {KEY_FINDING}
- **User Advocate**: {KEY_FINDING}
- **Devil's Advocate**: {KEY_FINDING}
```

---

## Thinking Framework: Confidence Assessment

Before presenting review results to the user, perform a calibrated confidence assessment.

### Step 4f: Read Metacognitive Monitoring

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/metacognitive-monitoring.md` and apply **Confidence Calibration**.

### Step 4g: Rate Confidence

Rate overall confidence in the plan on a 0.0-1.0 scale:

| Dimension | Confidence | Reason |
|-----------|-----------|--------|
| Completeness | {0.0-1.0} | {WHY} |
| Technical feasibility | {0.0-1.0} | {WHY} |
| Risk assessment accuracy | {0.0-1.0} | {WHY} |
| Effort estimation | {0.0-1.0} | {WHY} |
| Dependency correctness | {0.0-1.0} | {WHY} |
| **Overall** | **{AVERAGE}** | **{SUMMARY}** |

### Confidence Thresholds

- **0.8-1.0**: High confidence. Plan is solid. Proceed to validation.
- **0.6-0.8**: Moderate confidence. Some areas need attention. Address critical issues.
- **0.4-0.6**: Low confidence. Significant gaps. Recommend additional research or user input.
- **Below 0.4**: Very low confidence. Major rework needed. Do not proceed.

### Low-Confidence Areas

For any dimension below 0.6, document specifically:
- What is uncertain
- What additional information would increase confidence
- Whether proceeding is safe (will validation catch the issue?)

### Include in Review Summary

```markdown
### Confidence Assessment

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Completeness | 0.85 | All P0 features covered, some P2 gaps |
| Technical feasibility | 0.75 | Stripe integration untested, may need adjustments |
| Risk assessment | 0.70 | Image processing scale uncertain |
| Effort estimation | 0.60 | First time with this stack, estimates may be low |
| Dependencies | 0.90 | Clean dependency graph, well-ordered |
| **Overall** | **0.76** | **Moderate-high confidence. Proceed with caution on effort estimates.** |

**Lowest confidence area:** Effort estimation (0.60)
- Uncertain because the team hasn't used Supabase Edge Functions before
- Recommendation: Add buffer time to Section 05 (Image Upload) tasks
- Will validation catch this? Partially - traceability will verify coverage but not time estimates
```

---

## Step 5: Refinement Questions

Based on review findings, ask the user 3-8 targeted questions.

### Question Format

```
Based on my review of the plan, I have {N} questions:

1. **{TOPIC}**: {QUESTION}
   Context: {WHY_THIS_MATTERS}

2. **{TOPIC}**: {QUESTION}
   Context: {WHY_THIS_MATTERS}

3. ...
```

### Example Refinement Questions

1. **Concurrent editing**: The plan doesn't address what happens when two users edit the same recipe. Should we add optimistic locking, or is this unlikely enough to defer?
   Context: Section 03 (Recipe CRUD) has no conflict resolution.

2. **Image processing**: The plan processes images synchronously during upload. For images over 5MB, this could take 3-5 seconds. Should we add background processing?
   Context: Section 05 (Image Upload) has no async processing task.

3. **Search indexing**: The plan uses PostgreSQL full-text search. If you expect more than 100K recipes, we may want to consider a dedicated search service (Algolia, Meilisearch). Current expectation?
   Context: Section 04 (Recipe Search) assumes built-in search is sufficient.

### Handling Answers

For each answer:
1. Update the relevant section file
2. Add/remove/modify tasks as needed
3. Update risk assessments if the answer changes the risk profile
4. Document the change in the Review Notes section of PLAN.md

---

## Step 6: Update Plan

Apply all review findings and user answers to the plan.

### Update Procedure

1. **Critical issues**: Fix immediately in the affected section files
2. **Important issues**: Fix unless user explicitly defers
3. **Minor issues**: Note in the section's Notes for later
4. **New tasks**: Add to the correct section with proper task IDs
5. **Removed tasks**: Delete from section files, update task counts
6. **Risk changes**: Update risk color and assessment in section files
7. **Dependency changes**: Update dependency tables and batch grouping

### Update Tracking

Record all changes in PLAN.md's Review Notes section:

```markdown
## Review Notes

### Refinement Questions
1. "Should we add optimistic locking?" - User: "Yes, add it to v1"
2. "Background image processing?" - User: "No, sync is fine for now"
3. "Dedicated search service?" - User: "Start with PostgreSQL, migrate later if needed"

### Changes Made During Review
| Change | Section | Reason |
|--------|---------|--------|
| Added optimistic locking task | 03-recipe-crud | User requested |
| Added rate limiting task | 02-auth-setup | Security review finding |
| Changed risk from GREEN to YELLOW | 05-image-upload | Pre-mortem revealed unhandled errors |
| Added webhook signature verification | 06-payment | Security expert persona finding |

### Review Checklist
- [x] All sections have clear task breakdowns
- [x] Dependencies are accurate and complete
- [x] Risk assessments are realistic
- [x] TDD stubs cover critical paths
- [x] No gaps between PRD and plan
- [x] Batch ordering is optimal
- [ ] Effort estimates are reasonable (low confidence)
- [x] No circular dependencies
```

---

## Completion Criteria

Phase 4 is complete when:

1. All 8 checklist categories are reviewed
2. All 3 persona reviews are complete
3. Pre-mortem is done for all YELLOW/RED sections
4. Confidence assessment is documented
5. All critical issues are resolved
6. Refinement questions are asked and answered
7. Plan is updated with all changes
8. Review Notes section of PLAN.md is populated
9. Overall confidence is at least 0.6

### Completion Actions

1. Update all affected section files
2. Update PLAN.md Review Notes
3. Update STATE.md with Phase 4 completion
4. Announce transition:
   ```
   Review complete!
   - {N} checks passed across 8 categories
   - {N} issues found and resolved
   - {N} new tasks added
   - Overall confidence: {SCORE}

   Moving to Phase 5: VALIDATE - Final traceability check between PRD and plan.
   ```
