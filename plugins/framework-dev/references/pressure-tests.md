# Pressure Test Scenarios

Use these scenarios to validate the framework-dev plugin handles edge cases correctly.

---

## Scenario 1: Context Compaction Mid-Phase

**Setup:** Start Phase 3, define 8 API endpoints with specific status codes and non-standard paths.
**Trigger:** Simulate context compaction (run `/checkpoint` then continue).
**Verify:**
- [ ] All 8 endpoints are correctly recalled from `api-contracts.md`
- [ ] Non-standard paths are preserved in state summary
- [ ] No endpoint guessing occurs after checkpoint

---

## Scenario 2: Phase 4 Skip (Solo Mode)

**Setup:** Complete Phases 1-3 for a medium project.
**Trigger:** Run `/framework-dev --solo` or say "I'm working alone with just Claude."
**Verify:**
- [ ] Phase 4 is automatically skipped
- [ ] State jumps from Phase 3 to Phase 5
- [ ] No LLM assignment prompts appear
- [ ] Execution phase works without agent assignment data

---

## Scenario 3: Resume After Crash

**Setup:** Complete Phases 1-2, start Phase 3, create 3 of 6 API endpoints.
**Trigger:** Close session, start new session.
**Verify:**
- [ ] SessionStart hook detects existing state
- [ ] Correct phase and progress displayed
- [ ] State summary files are read
- [ ] Work continues from endpoint 4, not endpoint 1

---

## Scenario 4: Conflicting User Request

**Setup:** Complete Phase 3 with PostgreSQL decision documented.
**Trigger:** User says "Actually, let's use MongoDB instead."
**Verify:**
- [ ] UserPromptSubmit hook detects conflict
- [ ] Warning shown about existing PostgreSQL decision
- [ ] ADR created for the change (SUPERSEDED status on old)
- [ ] All downstream references updated (api-contracts, module hierarchy)

---

## Scenario 5: Large Project (15+ Modules)

**Setup:** Start a project with 15+ modules and 40+ API endpoints.
**Trigger:** Complete full 6-phase workflow.
**Verify:**
- [ ] State file handles 15+ modules without truncation
- [ ] Progress tracker stays accurate
- [ ] 50% checkpoint captures all critical details
- [ ] Final report includes all modules
- [ ] No "forgot about module X" errors

---

## Scenario 6: Export Without Pandoc

**Setup:** Complete a project with all phases.
**Trigger:** Run `/export pdf` on a system without pandoc installed.
**Verify:**
- [ ] Graceful fallback to HTML export
- [ ] User informed about pandoc alternative
- [ ] HTML output is complete and readable
- [ ] No crash or error state

---

## Running Pressure Tests

1. Create a test project directory
2. Run each scenario manually
3. Check all verify items
4. Document any failures in `references/pressure-test-results.md`
