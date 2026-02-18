# Phase 3b: Plan Writing Protocol

> Phase 3 of 6, Part B - Technical implementation plan.
> Input: DISCOVERY.md, RESEARCH.md, PRD.md
> Output: PLAN.md, section-NN-slug.md files, INDEX.md

---

## Thinking Framework: Architecture Design

Before splitting the plan into sections, perform architecture analysis using design patterns.

### Step 0a: Read Design Patterns

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/design-patterns.md` and identify which patterns apply to this project.

### Step 0b: Pattern Selection

For each major system component, select the design pattern that best fits:

1. **Review the PRD** sections 4 (What It Does) and 6 (What It Connects To)
2. **Map components to patterns**:

```markdown
### Architecture Patterns

| Component | Pattern | Reason |
|-----------|---------|--------|
| API Layer | {REST/GraphQL/tRPC} | {WHY} |
| State Management | {Server State/Client State/URL State} | {WHY} |
| Auth | {JWT/Session/OAuth} | {WHY} |
| File Handling | {Queue-based/Direct/CDN} | {WHY} |
| Real-time | {WebSocket/SSE/Polling} | {WHY} |
| Code Organization | {Feature Modules/MVC/Clean Architecture} | {WHY} |
| Error Handling | {Boundary/Global/Per-route} | {WHY} |
| Testing | {TDD/Integration-first/E2E-first} | {WHY} |
```

3. **Document pattern choices** in the Architecture Overview section of PLAN.md
4. **Note pattern interactions**: Where do patterns need to work together? Any friction points?

### Step 0c: Architecture Decision Records

For each non-obvious pattern choice, write a brief ADR:

```markdown
### ADR: {DECISION_TITLE}
**Context:** {WHAT_PROBLEM_ARE_WE_SOLVING}
**Decision:** {WHAT_WE_CHOSE}
**Alternatives considered:** {WHAT_ELSE_WE_CONSIDERED}
**Consequences:** {WHAT_THIS_MEANS_FOR_THE_PROJECT}
```

---

## Step 1: Section Splitting Rules

Split the implementation plan into focused sections. Each section represents a coherent unit of work.

### Splitting Criteria

A section should:
- **Be independently completable**: Can be built and tested without other sections being done (within batch constraints)
- **Have clear boundaries**: Someone reading just this section knows exactly what to build
- **Contain 3-8 tasks**: Fewer than 3 means the section is too granular; more than 8 means it needs splitting
- **Touch a coherent set of files**: Files in a section should be related by feature or layer
- **Map to PRD features**: Every section should trace back to one or more PRD features

### Splitting Anti-Patterns

Do NOT create sections that:
- Mix unrelated features ("Auth and Image Upload")
- Are just a single file ("Create utils.ts")
- Span the entire codebase ("Update All Components")
- Have no clear done state ("Improve Performance")

### Naming Convention

Section files follow this pattern:
```
section-{NN}-{slug}.md
```

Where:
- `{NN}` is a two-digit number starting from 01
- `{slug}` is a kebab-case description (2-4 words)

### Example Section Split

For a recipe sharing app:

```
section-01-database-schema.md          (DB tables, types, migrations)
section-02-auth-setup.md               (Auth provider, login, signup, sessions)
section-03-recipe-crud.md              (Create, read, update, delete recipes)
section-04-recipe-search.md            (Search index, filters, results)
section-05-image-upload.md             (Photo upload, processing, storage)
section-06-sharing-permissions.md      (Share links, privacy, access control)
section-07-collections-tags.md         (Organize recipes into collections)
section-08-responsive-ui.md            (Mobile layout, responsive components)
section-09-testing-deployment.md       (Test suite, CI/CD, deployment config)
```

### Section Ordering

Order sections by dependency and implementation sequence:

1. **Infrastructure first**: Database, auth, config
2. **Core features next**: The main thing the app does
3. **Supporting features**: Features that enhance the core
4. **Polish last**: UI refinement, testing, deployment

---

## Step 2: Dependency Analysis

For every section, identify what it depends on and what depends on it.

### Dependency Types

1. **Hard dependency**: Cannot start until the dependency is complete
   - "Recipe CRUD depends on Database Schema" (need tables to write queries)

2. **Soft dependency**: Can start in parallel but needs the dependency to finish before completion
   - "Recipe Search can start building UI while Recipe CRUD builds the API"

3. **No dependency**: Completely independent
   - "Auth Setup and Database Schema can happen in parallel"

### Dependency Rules

- No circular dependencies (A depends on B depends on A)
- No transitive dependency chains longer than 3 (A -> B -> C -> D is too deep)
- If a chain is too deep, consider merging or reordering sections
- Hard dependencies must be in an earlier batch
- Soft dependencies can be in the same batch

### Dependency Documentation

For each section, document:

```markdown
## Dependencies

| Type | Section | Description |
|------|---------|-------------|
| Depends on | Section 01 | Need DB tables for recipe storage |
| Depends on | Section 02 | Need auth middleware for protected routes |
| Blocks | Section 04 | Search needs recipe data to index |
| Blocks | Section 06 | Sharing needs recipes to exist |

**Batch:** 2
**Parallel siblings:** Section 03, Section 05
```

---

## Step 3: Parallel Batch Grouping

Group sections into batches that can be executed in parallel.

### Batch Rules

1. **Batch 1**: Sections with NO dependencies (foundation work)
2. **Batch 2**: Sections that depend only on Batch 1
3. **Batch 3**: Sections that depend on Batch 1 and/or Batch 2
4. Continue until all sections are assigned

### Batch Optimization

- Minimize total batch count (fewer batches = faster overall execution)
- Balance batch sizes (avoid one batch with 5 sections and another with 1)
- Put high-risk sections earlier (discover problems sooner)
- Put sections with the most dependents earlier (unblock more work)

### Batch Presentation

```markdown
## Parallel Batch Groups

### Batch 1 (Start here - no dependencies)
- Section 01: Database Schema
- Section 02: Auth Setup

### Batch 2 (After Batch 1)
- Section 03: Recipe CRUD (depends on 01, 02)
- Section 05: Image Upload (depends on 01)

### Batch 3 (After Batch 2)
- Section 04: Recipe Search (depends on 03)
- Section 06: Sharing & Permissions (depends on 03)
- Section 07: Collections & Tags (depends on 03)

### Batch 4 (After Batch 3)
- Section 08: Responsive UI (depends on 03, 04, 06, 07)
- Section 09: Testing & Deployment (depends on all)
```

---

## Step 4: Risk Assessment

Assess risk for every section.

### Risk Colors

- **GREEN**: Low risk. Standard implementation. Well-understood patterns.
- **YELLOW**: Medium risk. Some complexity. Needs attention but manageable.
- **RED**: High risk. Complex integration, new technology, tight constraints, or many unknowns.

### Risk Factors

Score each section on these factors (1-3 scale):

| Factor | 1 (Low) | 2 (Medium) | 3 (High) |
|--------|---------|------------|----------|
| Complexity | Standard CRUD | Some logic | Complex algorithms |
| Novelty | Team knows this | Somewhat new | First time |
| Dependencies | 0-1 deps | 2-3 deps | 4+ deps |
| Integration | No external | One service | Multiple services |
| Data sensitivity | Public data | Personal data | Financial/medical |

- Score 5-7: GREEN
- Score 8-10: YELLOW
- Score 11-15: RED

### Risk Documentation

For each section:

```markdown
## Risk

| Aspect | Value |
|--------|-------|
| Color | YELLOW |
| Summary | Stripe integration adds payment processing complexity |
| Explanation | First time integrating Stripe. Webhook handling and idempotency are error-prone areas. |

### Risk Factors
- Integration complexity: Stripe API + webhooks + checkout session management
- Data sensitivity: Handling payment info (even tokenized) requires PCI awareness
- Error handling: Failed payments need graceful recovery

### Mitigation
- Use Stripe's hosted checkout page to minimize PCI scope
- Follow Stripe's official webhook verification guide
- Implement idempotency keys on all payment-related API calls
- Add extensive logging for payment flow debugging
```

---

## Thinking Framework: Paradigm Selection

Before writing individual section files, determine the best programming paradigm for each section.

### Step 4a: Read Paradigm Framework

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/programming-paradigms.md` and apply paradigm selection.

### Step 4b: Paradigm Assignment

For each section, determine which programming paradigm best fits the work:

| Section | Primary Paradigm | Secondary Paradigm | Rationale |
|---------|-----------------|-------------------|-----------|
| Database Schema | Declarative | Imperative (migrations) | Schema definitions are declarative; migrations are step-by-step |
| Auth Setup | Procedural | Event-driven (callbacks) | Request handlers are procedural; auth events use callbacks |
| Recipe CRUD | Functional | Declarative (UI) | Data transforms are functional; React components are declarative |
| Recipe Search | Declarative (queries) | Reactive (live results) | Search queries are declarative; live updates are reactive |
| Image Upload | Concurrent | Event-driven (progress) | Async upload processing; progress events for UI |

### Step 4c: Include in Section Files

Add the paradigm recommendation to each section's Notes:

```markdown
## Notes

### Recommended Paradigm
**Primary:** Functional - Data transformations for recipe scaling, nutrition calculation, and unit conversion should be pure functions.
**Secondary:** Declarative - React components for UI rendering.
**Rationale:** Pure functions make recipe data transforms independently testable and composable. Avoid mutation to prevent bugs when multiple views display the same recipe.
```

---

## Step 5: Write Section Files

Write each section file with full implementation detail.

### Section File Format

Use the section template from `{plugin_root}/skills/ultraplan-ct/templates/section.md` and populate every field.

### Required Content Per Section

Each section file must contain:

1. **Header**: Section number, name, project name, batch, task count, risk
2. **Overview**: 2-3 paragraph description of what this section accomplishes
3. **Risk**: Full risk assessment with factors and mitigation
4. **Dependencies**: Table of depends-on and blocks relationships
5. **TDD Test Stubs**: 4-8 test descriptions to write BEFORE implementing
6. **Files Touched**: Table of every file created or modified
7. **Tasks**: 3-8 tasks in XML format (see xml-task-format.md)
8. **Section Completion Criteria**: Checklist for when this section is done
9. **Notes**: Additional context, paradigm recommendations, gotchas

### Task Writing Rules

Each task must:
- Touch 1-3 files (atomic scope)
- Have clear acceptance criteria
- Reference a TDD test stub
- Include step-by-step implementation guidance
- Have a specific "done" state that can be verified

### TDD Stubs

Write test descriptions that can be turned into actual test code:

```markdown
## TDD Test Stubs

> Write these tests BEFORE implementing the tasks.

1. `createRecipe() should return the created recipe with an auto-generated ID`
2. `createRecipe() should reject recipes without a title`
3. `getRecipe(id) should return the recipe matching the given ID`
4. `getRecipe(id) should return null for non-existent IDs`
5. `updateRecipe() should return the updated recipe without modifying other fields`
6. `deleteRecipe() should remove the recipe and return void`
7. `listRecipes() should return paginated results with correct total count`
8. `listRecipes() should filter by tag when tag parameter is provided`
```

---

## Step 6: Write INDEX.md

Write an index file that lists all sections with quick-reference metadata.

### Index Format

```markdown
# UltraPlan Section Index: {PROJECT_NAME}

> Total sections: {N}
> Total tasks: {N}
> Total batches: {N}

| # | Section | File | Tasks | Risk | Batch | Depends On |
|---|---------|------|-------|------|-------|------------|
| 01 | Database Schema | section-01-database-schema.md | 5 | GREEN | 1 | - |
| 02 | Auth Setup | section-02-auth-setup.md | 4 | YELLOW | 1 | - |
| 03 | Recipe CRUD | section-03-recipe-crud.md | 7 | GREEN | 2 | 01, 02 |
| ... | | | | | | |

## Quick Start

1. Open Batch 1 sections (no dependencies)
2. Write TDD tests from stubs
3. Implement tasks in order
4. Run tests, verify, move to next batch
```

---

## Step 7: Write Master PLAN.md

Write the master plan file that ties everything together.

### Plan File Content

Use the plan template from `{plugin_root}/skills/ultraplan-ct/templates/plan.md` and populate:

1. **Project Overview**: Summary, goals, constraints
2. **Architecture Overview**: ASCII diagram + notes (from thinking framework)
3. **Architecture Decision Records**: Key pattern choices with rationale
4. **Tech Stack**: Full table with technology, version, and rationale per layer
5. **Section Index**: Full section table with descriptions, tasks, risk, batch
6. **Section Files**: File name mapping table
7. **Dependency Graph**: ASCII or indented list showing dependency tree
8. **Parallel Batch Groups**: Detailed batch listing with section names and dependencies
9. **Execution Order**: Simplified batch flow diagram
10. **Risk Summary**: Distribution + high/medium risk details with mitigations
11. **Review Notes**: Placeholder for Phase 4

---

## Thinking Framework: Visual Architecture

After writing the master plan, create visual representations to verify the architecture.

### Step 7a: Read Visual Reasoning

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/visual-reasoning.md` and apply visual analysis.

### Step 7b: Architecture Diagram

Create an ASCII architecture diagram for PLAN.md's Architecture Overview section:

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │  Pages   │  │  Forms  │  │ Search  │             │
│  └────┬─────┘  └────┬────┘  └────┬────┘             │
│       └──────────────┼───────────┘                   │
│                      │                                │
│              ┌───────▼────────┐                       │
│              │  React Query   │ (Server State)        │
│              └───────┬────────┘                       │
└──────────────────────┼───────────────────────────────┘
                       │ HTTPS
┌──────────────────────┼───────────────────────────────┐
│                 SERVER (Next.js)                       │
│              ┌───────▼────────┐                       │
│              │  API Routes    │                       │
│              └───────┬────────┘                       │
│       ┌──────────────┼───────────────┐               │
│  ┌────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐        │
│  │   Auth   │  │   CRUD    │  │  Search   │        │
│  │ (Clerk)  │  │ (Prisma)  │  │ (Index)   │        │
│  └──────────┘  └─────┬─────┘  └───────────┘        │
└──────────────────────┼───────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────────┐
│              ┌───────▼────────┐                       │
│              │  PostgreSQL    │ (Supabase)            │
│              └────────────────┘                       │
│                  DATA LAYER                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Tables  │  │  Storage │  │  Edge Fn │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└──────────────────────────────────────────────────────┘
```

### Step 7c: Data Flow Diagram

Create a data flow diagram showing how data moves through sections:

```
User Action → API Route → Validation → Business Logic → Database
                                                      ↓
User Display ← React Query ← API Response ← Query Result
```

For each major data flow (CRUD, search, file upload, auth), trace the path through the section boundaries. This reveals:
- **Bottlenecks**: Where does data slow down or queue?
- **Single points of failure**: If this component fails, what breaks?
- **Cross-section boundaries**: Where does data cross from one section's code to another's?

### Step 7d: Document Visual Findings

Add the diagrams and analysis to PLAN.md:

```markdown
## Architecture Overview

{ASCII_ARCHITECTURE_DIAGRAM}

### Architecture Notes
- {NOTE_FROM_PATTERN_ANALYSIS}
- {NOTE_FROM_VISUAL_ANALYSIS}

### Data Flow
{DATA_FLOW_DIAGRAM}

### Identified Bottlenecks
- {BOTTLENECK_1}: {MITIGATION}
- {BOTTLENECK_2}: {MITIGATION}

### Single Points of Failure
- {SPOF_1}: {MITIGATION}
- {SPOF_2}: {MITIGATION}
```

---

## Completion Criteria

Phase 3b is complete when:

1. All section files are written with complete content (no placeholders)
2. Every section has 3-8 tasks with full detail
3. Every section has TDD test stubs
4. Every section has risk assessment
5. Dependencies are documented and consistent across sections
6. Batch grouping is complete with no circular dependencies
7. INDEX.md is written
8. PLAN.md is written with architecture diagram and data flow
9. Architecture Decision Records are documented
10. Paradigm recommendations are included in section Notes

### Completion Actions

1. Write all section files to `{output_dir}/`
2. Write INDEX.md to `{output_dir}/INDEX.md`
3. Write PLAN.md to `{output_dir}/PLAN.md`
4. Update STATE.md with Phase 3 completion
5. Announce transition:
   ```
   Technical plan complete!
   - {N} sections across {M} batches
   - {T} total tasks
   - {R} high-risk sections identified
   - Architecture: {BRIEF_ARCHITECTURE_SUMMARY}

   Moving to Phase 4: REVIEW - I'll check the plan for gaps, risks, and improvements.
   ```
