# Phase 3b: Technical Plan Writing Protocol

You are executing Phase 3b of UltraPlan. Your job is to transform the approved PRD into a technical implementation plan with dependency-ordered sections, each containing atomic XML tasks. This phase does NOT require user approval for each section -- the PRD was already approved.

---

## Step 1: Section Splitting

Read `.ultraplan/PRD.md` and decompose it into implementation sections.

**Splitting rules:**
1. Each section is a self-contained implementation unit that delivers a visible piece of functionality
2. A section typically maps to one major feature or one infrastructure concern
3. Sections should be completable in 1-4 hours of AI execution time
4. Each section should have 3-8 atomic tasks inside it
5. A section should NOT try to do two unrelated things

**How to decompose:**
1. Read the "What It Does" section of the PRD -- each Must Have feature is typically one section
2. Add infrastructure sections that features depend on (database setup, auth, project scaffolding)
3. Add integration sections for external services
4. Add a final "polish" section for UX refinements, error handling, deployment

**Naming convention:** `section-NN-short-name.md`
- NN is zero-padded: 01, 02, 03, ... 15
- short-name is kebab-case, 2-4 words: `user-auth`, `recipe-crud`, `photo-uploads`

**Example decomposition for a recipe app:**
```
section-01-project-setup.md       (scaffolding, config, database)
section-02-user-auth.md           (signup, login, sessions)
section-03-recipe-crud.md         (create, read, update, delete recipes)
section-04-photo-uploads.md       (image upload, compression, storage)
section-05-recipe-collections.md  (organize recipes into folders)
section-06-social-sharing.md      (share links, public profiles)
section-07-search-discovery.md    (search, filters, browse)
section-08-notifications.md       (email, push notifications)
section-09-admin-dashboard.md     (content moderation, analytics)
section-10-polish-deploy.md       (error handling, loading states, deployment)
```

---

## Step 2: Dependency Analysis

After splitting, analyze dependencies between sections.

**Dependency types:**
- **Hard dependency:** Section B literally cannot be built without Section A existing first (e.g., recipe CRUD depends on project setup and user auth)
- **Soft dependency:** Section B works better after Section A but could be built independently with mocks/stubs

**Only track hard dependencies.** Soft dependencies are noted but do not affect ordering.

**Build a dependency graph:**
```
section-01 (project-setup)     -> [no dependencies]
section-02 (user-auth)         -> depends on: section-01
section-03 (recipe-crud)       -> depends on: section-01, section-02
section-04 (photo-uploads)     -> depends on: section-01, section-03
section-05 (collections)       -> depends on: section-03
section-06 (social-sharing)    -> depends on: section-02, section-03
section-07 (search-discovery)  -> depends on: section-03
section-08 (notifications)     -> depends on: section-02
section-09 (admin-dashboard)   -> depends on: section-02, section-03
section-10 (polish-deploy)     -> depends on: ALL previous
```

---

## Step 3: Parallel Batch Grouping

Group sections into batches that can be executed in parallel.

**Batching rules:**
1. Batch 1 always contains only sections with no dependencies
2. Subsequent batches contain sections whose dependencies are ALL satisfied by previous batches
3. Sections within the same batch can be executed simultaneously
4. The final batch typically contains the polish/deploy section

**Example batches:**
```
Batch 1: section-01 (project-setup)
Batch 2: section-02 (user-auth)
Batch 3: section-03 (recipe-crud), section-08 (notifications)
Batch 4: section-04 (photo-uploads), section-05 (collections), section-06 (social-sharing), section-07 (search-discovery)
Batch 5: section-09 (admin-dashboard)
Batch 6: section-10 (polish-deploy)
```

---

## Step 4: Risk Assessment

Assign a risk rating to every section.

**Risk levels:**
- **Green:** Straightforward implementation using well-known patterns. Standard CRUD, basic UI, simple config. Low chance of surprises.
- **Yellow:** Some complexity involved. Multiple integrations, business logic with edge cases, third-party API reliance, moderate security concerns. May need iteration.
- **Red:** High uncertainty. Novel approach without established patterns, critical security requirements, real-time systems, complex state management, payment processing, compliance requirements.

**Risk factors to evaluate:**
1. Complexity of business logic
2. Number and nature of dependencies
3. Security sensitivity (auth, payments, personal data)
4. Third-party API reliance (can break, rate limits, costs)
5. Performance requirements (real-time, large data)
6. Novelty (is this a well-trodden path or something unusual?)

---

## Step 5: Write Section Files

Write each section file to `.ultraplan/sections/section-NN-name.md`.

**Section file format:**

```markdown
# Section NN: [Human-Readable Name]

## Overview
[2-4 sentences in plain English describing what this section builds and why it matters.
Reference the PRD section this implements.]

## Risk: [green/yellow/red] - [One-line risk summary]
[1-2 sentences explaining the risk rating. What could go wrong? What makes this tricky or straightforward?]

## Dependencies
- **Depends on:** [none / section-NN (name), section-NN (name)]
- **Blocks:** [section-NN (name), section-NN (name)]
- **Parallel batch:** [batch number]

## TDD Test Stubs
[List of test descriptions in plain English. Each test is one sentence describing a behavior to verify.]
- Test: [User can do X and Y happens]
- Test: [When X occurs, the system does Y]
- Test: [Invalid input X results in error message Y]
- Test: [Edge case X is handled by doing Y]

[Aim for 4-8 tests per section. Cover: happy path, error cases, edge cases, security.]

## Tasks

[XML tasks go here -- see xml-task-format.md for detailed schema]

<task type="auto" id="NN-01">
  <name>[Short descriptive name]</name>
  <files>[file1.ts, file2.ts]</files>
  <action>
    [Detailed implementation instructions. Multiple sentences.
    Be specific about what to create, modify, or configure.
    Reference specific functions, components, or patterns.]
  </action>
  <verify>[How to verify this task is done correctly]</verify>
  <done>[One sentence: what is true when this task is complete]</done>
</task>

[More tasks...]
```

**Writing guidelines for section content:**
- Overview: Plain English, reference the PRD
- Risk: Honest assessment, not artificially inflated or deflated
- Dependencies: List exact section numbers and names
- TDD stubs: User-behavior focused, not implementation focused
- Tasks: Follow xml-task-format.md precisely

---

## Step 6: Write Index File

Write `.ultraplan/sections/index.md`:

```markdown
# UltraPlan Section Index

## Execution Order

| Batch | Section | Name | Risk | Dependencies | Tasks |
|-------|---------|------|------|--------------|-------|
| 1 | 01 | Project Setup | green | none | 5 |
| 2 | 02 | User Authentication | yellow | 01 | 6 |
| 3 | 03 | Recipe CRUD | green | 01, 02 | 7 |
| 3 | 08 | Notifications | yellow | 02 | 4 |
| 4 | 04 | Photo Uploads | yellow | 01, 03 | 5 |
| 4 | 05 | Collections | green | 03 | 4 |
| 4 | 06 | Social Sharing | yellow | 02, 03 | 5 |
| 4 | 07 | Search & Discovery | green | 03 | 5 |
| 5 | 09 | Admin Dashboard | yellow | 02, 03 | 6 |
| 6 | 10 | Polish & Deploy | green | all | 4 |

## Summary
- Total sections: [N]
- Total tasks: [M]
- Parallel batches: [X]
- Sequential steps: [Y] (minimum batches to complete)
- Risk breakdown: [G] green, [Y] yellow, [R] red

## Dependency Graph
```
Batch 1: [01]
Batch 2: [02]
Batch 3: [03] [08]
Batch 4: [04] [05] [06] [07]
Batch 5: [09]
Batch 6: [10]
```

## How to Execute
1. Start with Batch 1. Execute all sections in the batch.
2. When Batch 1 is complete, move to Batch 2.
3. Sections within the same batch can be run in parallel.
4. After each section, run its TDD test stubs to verify.
5. After all batches complete, run full integration test.
```

---

## Step 7: Write Master Plan File

Write `.ultraplan/PLAN.md`:

```markdown
# [Project Name] - Technical Plan

> Generated by UltraPlan | [Date]
> This document contains the technical implementation plan.
> For plain-English product requirements, see PRD.md.

## Architecture Overview
[3-5 sentences describing the overall technical architecture.
Mention the tech stack, major components, data flow, and deployment target.
This section CAN use technical language -- it's for AI executors.]

## Tech Stack
[From RESEARCH.md recommendations]
- Frontend: [framework]
- Backend: [framework/runtime]
- Database: [database]
- Auth: [approach]
- Hosting: [platform]
- Storage: [for files/images]

## Section Overview
[Brief list of all sections with one-line descriptions]

## Execution Strategy
- [N] sections across [X] parallel batches
- Estimated sequential steps: [Y]
- Start with: section-01 ([name])
- Critical path: [list of sections that are on the critical path]

## Risk Summary
- Red: [count] sections ([list])
- Yellow: [count] sections ([list])
- Green: [count] sections ([list])

## File Map
[List all files that will be created/modified across all sections, organized by directory]
```

---

## Completion

After writing all section files, index.md, and PLAN.md, display:
```
Phase 3/6: PLAN [==========] 100% - Complete!
Generated: [N] sections with [M] total tasks across [X] batches
Plan saved to .ultraplan/PLAN.md
Section files saved to .ultraplan/sections/
Moving to Phase 4: REVIEW...
```

Proceed to Phase 4.
