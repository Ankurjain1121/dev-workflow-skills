# Phase 6: OUTPUT Protocol

You are executing Phase 6 of UltraPlan. Your job is to finalize all output files, ensure consistency, write the summary cheat sheet, update state, and present the completion banner. This phase requires NO user input.

---

## Step 1: Finalize All Files

Verify that all 8 output files exist and are consistent with each other.

**File checklist:**

| # | File | Status Check |
|---|------|-------------|
| 1 | `.ultraplan/DISCOVERY.md` | Should exist from Phase 1. Do not modify. |
| 2 | `.ultraplan/RESEARCH.md` | Should exist from Phase 2. Do not modify. |
| 3 | `.ultraplan/PRD.md` | Should exist from Phase 3a. Do not modify unless validation added content. |
| 4 | `.ultraplan/PLAN.md` | Should exist from Phase 3b. Append final section count and completion timestamp. |
| 5 | `.ultraplan/VALIDATE.md` | Should exist from Phase 5. Do not modify. |
| 6 | `.ultraplan/STATE.md` | Create or update with final state. |
| 7 | `.ultraplan/SUMMARY.md` | Create now. |
| 8 | `.ultraplan/sections/index.md` | Should exist from Phase 3b. Update with final section/task counts if changed during review/validate. |
| 9 | `.ultraplan/sections/section-*.md` | Should exist from Phase 3b, possibly modified during review/validate. |

**Consistency check:**
- Section count in index.md matches actual section files
- Task count in index.md matches tasks in section files
- Risk ratings in index.md match ratings in section files
- Section names in index.md match section file headers
- All file references in PLAN.md point to files that exist

If any inconsistency is found, fix it silently. Do not ask the user.

---

## Step 2: Write SUMMARY.md

Create `.ultraplan/SUMMARY.md` as a one-page cheat sheet the user can share or reference quickly.

**Format:**

```markdown
# UltraPlan Summary

> One-page overview of your project plan. Generated [date].

## What We're Building
[Copy the first 3 sentences from PRD.md "What We're Building" section verbatim]

## Key Features
[Bullet list of features from PRD.md "What It Does" section -- Must Have items only]
- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]
- [Feature 5]
[5-10 bullet points maximum]

## Tech Stack
[From RESEARCH.md or PLAN.md]
- **Frontend:** [framework/library]
- **Backend:** [framework/runtime]
- **Database:** [database]
- **Auth:** [approach]
- **Hosting:** [platform]
- **Storage:** [service] (if applicable)
- **Payments:** [service] (if applicable)

## Risk Areas
[From PLAN.md risk summary, ordered by severity]
- [Red] [section name]: [one-line risk description]
- [Yellow] [section name]: [one-line risk description]
- [Yellow] [section name]: [one-line risk description]
- [Green sections not listed -- only red and yellow]

## Plan Structure
- **[N]** sections, **[M]** total tasks
- **[X]** parallel batches
- **[Y]** sequential dependencies (minimum steps to complete)
- **Critical path:** [list section names on the longest dependency chain]

## How to Execute This Plan
1. Open any AI coding tool (Claude Code, Cursor, Windsurf, Copilot, etc.)
2. Share the `.ultraplan/` folder with the AI
3. Say: "Read `.ultraplan/sections/index.md` and execute section 1"
4. After each section completes, say: "Execute section [next number]"
5. Sections in the same batch can be run in parallel if your tool supports it
6. After each section, the AI should run the TDD test stubs to verify

## How to Update This Plan
Run `/ultraplan update` and describe what changed.
Only affected sections will be regenerated. Everything else stays as-is.

## Files in This Plan
| File | What It Contains | Who It's For |
|------|-----------------|--------------|
| `PRD.md` | Product requirements in plain English | You (the human) |
| `PLAN.md` | Technical implementation plan | AI coding tool |
| `RESEARCH.md` | Research findings and recommendations | Reference |
| `DISCOVERY.md` | Complete Q&A transcript | Audit trail |
| `VALIDATE.md` | Requirement traceability matrix | Quality check |
| `STATE.md` | Session state for resume/updates | System (automatic) |
| `SUMMARY.md` | This file -- one-page cheat sheet | You (the human) |
| `sections/index.md` | Section manifest with execution order | AI coding tool |
| `sections/section-*.md` | Individual implementation sections | AI coding tool |
```

**Rules for SUMMARY.md:**
- Keep it to ONE page (roughly 50-80 lines of markdown)
- Use bullet points, not paragraphs
- No technical jargon in the "What We're Building" and "Key Features" sections
- Technical terms are okay in "Tech Stack" since it's informational
- The "How to Execute" section must be dead simple -- 6 steps maximum

---

## Step 3: Write STATE.md

Create or update `.ultraplan/STATE.md` with the final session state.

**Format:**

```markdown
# UltraPlan State

## Current Position
- **Phase:** 6 of 6
- **Status:** complete
- **Last activity:** [YYYY-MM-DD] - Plan generation complete

## Progress
[==========] Phase 6/6: OUTPUT - Complete!

## Plan Statistics
- Sections: [N]
- Tasks: [M]
- Parallel batches: [X]
- Risk breakdown: [G] green, [Y] yellow, [R] red
- Requirements traced: [N] of [N]
- Gaps resolved: [count]
- Review issues fixed: [count]

## Session History
| Date | Phase | Action | Details |
|------|-------|--------|---------|
| [date] | 1 | UNDERSTAND | [N] questions asked across [M] categories |
| [date] | 2 | RESEARCH | 3 subagents completed, tech stack: [stack] |
| [date] | 3a | PLAN (PRD) | 10 PRD sections approved |
| [date] | 3b | PLAN (Sections) | [N] sections, [M] tasks generated |
| [date] | 4 | REVIEW | [X] issues found, [Y] auto-fixed, [Z] refinement questions |
| [date] | 5 | VALIDATE | [N] requirements traced, [M] gaps resolved |
| [date] | 6 | OUTPUT | All files finalized |

## Change Log
| Date | What Changed | Sections Affected | Trigger |
|------|-------------|-------------------|---------|
| (populated by /ultraplan update) | | | |

## Resume Data
- discovery_complete: true
- discovery_categories: [list of completed categories]
- research_complete: true
- prd_complete: true
- prd_sections_approved: [list of section numbers]
- plan_complete: true
- review_complete: true
- validate_complete: true
- output_complete: true
```

**STATE.md rules:**
- Always use the current date for timestamps
- Session History should have one row per completed phase
- Change Log starts empty and is populated by `/ultraplan update`
- Resume Data is used by the system to determine where to resume if re-run

---

## Step 4: Update PLAN.md Footer

Append a completion footer to `.ultraplan/PLAN.md` if not already present:

```markdown
---

## Completion
- Generated: [date]
- Total sections: [N]
- Total tasks: [M]
- All requirements validated: Yes
- Review issues resolved: Yes
- Ready for execution: Yes
```

---

## Step 5: Present Completion Banner

Display the following completion banner to the user. This is the final output of the entire UltraPlan process.

```
================================================================
ULTRAPLAN COMPLETE
================================================================

Your plan is ready! Here's what was created:

.ultraplan/
  PRD.md          - Your product requirements (plain English)
  PLAN.md         - Technical implementation plan
  RESEARCH.md     - Research findings
  DISCOVERY.md    - Complete Q&A transcript
  VALIDATE.md     - Requirement traceability matrix
  STATE.md        - Session state (for resume/updates)
  SUMMARY.md      - One-page cheat sheet
  sections/
    index.md      - Section manifest with execution order
    section-01-*  - [section name] [risk color]
    section-02-*  - [section name] [risk color]
    section-03-*  - [section name] [risk color]
    [... list ALL sections with names and risk colors ...]

Total: [N] sections, [M] tasks across [X] batches

----------------------------------------------------------------
WHAT TO DO NEXT
----------------------------------------------------------------

To start building:
  Give the .ultraplan/ folder to any AI coding tool and say:
  "Read .ultraplan/sections/index.md and execute section 1"

To update this plan later:
  Run: /ultraplan update

To view the quick summary:
  Read: .ultraplan/SUMMARY.md
================================================================
```

**Banner rules:**
- List EVERY section file with its name and risk color
- Use exact file names (not abbreviated)
- Include the total counts
- The "WHAT TO DO NEXT" section is critical -- it tells the user exactly what to do
- Keep the formatting exact -- the `====` and `----` lines create visual structure

---

## Step 6: Next Steps Text

After the banner, add a brief conversational closing:

```
Your plan covers [N] requirements across [M] sections. The critical path
runs through [list critical sections], so those should be executed first.

[If red risk sections exist:]
Watch out for [red section names] -- those have higher complexity and may
need extra attention during implementation.

[If greenfield:]
Since this is a new project, section 1 (project setup) will establish the
foundation. Everything else builds on top of it.

[Always:]
If anything changes -- new features, removed features, different priorities --
just run /ultraplan update and I'll adjust the plan without starting over.
```

---

## Completion

Phase 6 is the final phase. After displaying the banner and next steps, the UltraPlan session is complete. No further action is needed unless the user invokes `/ultraplan update` or `/ultraplan status`.
