---
name: ultraplan
description: Takes a plain-English idea and produces a complete, AI-executable implementation plan through 6 automated phases (UNDERSTAND, RESEARCH, PLAN, REVIEW, VALIDATE, OUTPUT). Designed for no-coders who want to hand a finished plan to an AI coding tool.
license: MIT
compatibility: Claude Code (any version with Task tool and AskUserQuestion support)
---

# UltraPlan Skill

Single-command planning pipeline: `/ultraplan [idea]`

Orchestrates 6 phases: UNDERSTAND --> RESEARCH --> PLAN --> REVIEW --> VALIDATE --> OUTPUT

Also supports: `/ultraplan update` and `/ultraplan status`

---

## CRITICAL: First Actions

**BEFORE doing anything else**, follow these steps in exact order:

### 1. Detect Command Variant

Parse the user's input to determine which command was invoked:

- **`/ultraplan [idea text]`** --> Main pipeline (go to Step 2)
- **`/ultraplan update`** --> Update mode (jump to "UPDATE COMMAND" section at bottom)
- **`/ultraplan status`** --> Status mode (jump to "STATUS COMMAND" section at bottom)

### 2. Print Intro Banner

Print this immediately:

```
================================================================
ULTRAPLAN: From Idea to AI-Executable Plan
================================================================
UNDERSTAND --> RESEARCH --> PLAN --> REVIEW --> VALIDATE --> OUTPUT

Your idea will go through 6 phases:
  Phase 1: UNDERSTAND  - Thorough discovery questions (40-70 questions)
  Phase 2: RESEARCH    - Parallel research on best approaches
  Phase 3: PLAN        - PRD + technical plan with executable sections
  Phase 4: REVIEW      - Self-review + refinement questions
  Phase 5: VALIDATE    - Requirement traceability verification
  Phase 6: OUTPUT      - Final deliverables + summary

All output will be saved to: .ultraplan/
================================================================
```

### 3. Store Plugin Root

Determine `{plugin_root}` by locating the directory containing this SKILL.md file. The plugin root is two levels up from the SKILL.md location (i.e., the `ultraplan/` directory that contains `skills/`, `agents/`, `hooks/`, etc.).

Store `{plugin_root}` for use throughout the workflow. All reference file paths use this variable.

### 4. Detect Existing .ultraplan/ Directory (Resume Detection)

Check if `.ultraplan/` directory exists in the current working directory.

**If `.ultraplan/` does NOT exist:**
- This is a fresh run
- Create the `.ultraplan/` directory and `.ultraplan/sections/` subdirectory
- Initialize `.ultraplan/STATE.md` using the template from `{plugin_root}/skills/ultraplan/templates/state.md`
- Set the idea text from the user's input into STATE.md
- Proceed to Phase 1

**If `.ultraplan/` DOES exist:**
- Read `.ultraplan/STATE.md` to determine current position
- Print resume information:

```
================================================================
EXISTING PLAN DETECTED
================================================================
Resuming from: Phase {N}/6 - {PHASE_NAME}
Last activity: {last_activity from STATE.md}

To start fresh, delete the .ultraplan/ directory and re-run.
================================================================
```

- Apply resume logic (see Resume Behavior in each phase below)
- Skip to the appropriate phase based on what files exist:
  - `.ultraplan/DISCOVERY.md` exists AND is complete (all 9 categories) --> Skip Phase 1
  - `.ultraplan/RESEARCH.md` exists --> Skip Phase 2
  - `.ultraplan/sections/` contains section files --> Skip Phase 3
  - `.ultraplan/PLAN.md` contains "Review Notes" section --> Skip Phase 4
  - `.ultraplan/VALIDATE.md` exists --> Skip Phase 5
  - `.ultraplan/SUMMARY.md` exists --> Already complete, show completion banner

If DISCOVERY.md exists but is incomplete (not all 9 categories covered), resume Phase 1 from the next uncovered category.

If PRD.md exists but no section files exist, resume Phase 3 from Step 3b (technical plan generation).

### 5. Validate Idea Input

If this is a fresh run (not resume), verify the user provided an idea:

- If the user typed just `/ultraplan` with no idea text:

```
================================================================
ULTRAPLAN: Idea Required
================================================================

Please provide your idea in plain English. Examples:

  /ultraplan I want to build a recipe sharing app
  /ultraplan Build me a task management tool with team features
  /ultraplan Create an online store for handmade jewelry

Just describe what you want to build - no technical knowledge needed!
================================================================
```

**Do not continue. Wait for user to re-invoke with an idea.**

- If idea text is present: record it in STATE.md and proceed to Phase 1.

---

## Phase 1: UNDERSTAND

**Purpose:** Exhaustively gather requirements through structured questioning.

**Progress format:** `Phase 1/6: UNDERSTAND [=====     ] 45% - Category: Edge Cases (6/9 categories)`

### Before Starting

Read `{plugin_root}/skills/ultraplan/references/understand-protocol.md` for detailed question examples and category guidance.

### Step 1.1: Codebase Detection

Scan the current project directory for existing code:

- Look for: `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `*.csproj`, `pubspec.yaml`, `Gemfile`, `pom.xml`, `build.gradle`, or any `src/`, `app/`, `lib/` directories
- Look for: `.git/` directory, README files, configuration files

**If codebase exists:**
- Analyze the tech stack, frameworks, patterns, and conventions
- Note findings for use in questions (e.g., "I see you're using React + Supabase. Should this feature follow the same patterns?")
- Category 6 (Existing Patterns) will be heavily used
- Record codebase analysis in a variable for use throughout Phase 1

**If no codebase (greenfield):**
- Skip Category 6 (Existing Patterns) entirely
- Add greenfield-specific questions about tech stack preferences to Category 7 (Preferences & Tradeoffs)
- Note this is a greenfield project

### Step 1.2: Initialize Discovery Document

Create `.ultraplan/DISCOVERY.md` with header:

```markdown
# UltraPlan Discovery

## Project Idea
[User's original idea text]

## Codebase Context
[Greenfield / Existing codebase summary]

## Discovery Q&A

<!-- Categories: 9 total -->
<!-- Progress is tracked per category -->
```

### Step 1.3: Run Question Loop

Execute the question loop across all 9 categories. For each category:

**Categories (must cover ALL 9):**

| # | Category | Focus |
|---|----------|-------|
| 1 | Core Requirements | What must this do? Minimum viable version? What's out of scope? |
| 2 | Users & Context | Who uses this? Skill level? Environment? Devices? |
| 3 | Integration Points | What systems does this connect to? Data flows? APIs? |
| 4 | Edge Cases | What happens when things go wrong? Boundary conditions? |
| 5 | Quality Attributes | Performance needs? Security? Reliability? |
| 6 | Existing Patterns | (If codebase) How do similar things work here? Conventions? (If greenfield) Tech preferences? |
| 7 | Preferences & Tradeoffs | Strong opinions? Simplicity vs flexibility vs performance? |
| 8 | Monetization & Business Model | Free/paid? Subscriptions? Ads? Revenue model? |
| 9 | Visual & UX Vision | How should it look? Feel? Layout? Key screens? Interactions? |

**For each category:**

1. Ask questions in batches of 2-4 related questions per `AskUserQuestion` call
2. Every question MUST use `AskUserQuestion` with multiple-choice options:
   - First option is always the recommended choice, marked "(Recommended)"
   - Include 2-4 options total
   - Always include an "Other (let me describe)" option as the last choice
   - Use plain English, zero technical jargon
3. After each user response, evaluate:
   - If the answer is complex or ambiguous: ask 1-2 follow-up questions to go deeper
   - If the answer is clear and simple: move to the next question
4. After each batch: append the Q&A to `.ultraplan/DISCOVERY.md` under the current category heading
5. Show progress indicator after each batch:
   ```
   Phase 1/6: UNDERSTAND [=====     ] {pct}% - Category: {category_name} ({N}/9 categories)
   ```

**Question count enforcement:**
- Target: 40-70 questions total across all categories
- System MUST NOT stop early unless user explicitly says "enough", "stop", or "move on"
- Aim for 4-8 questions per category (varies by complexity)
- If approaching 40 questions and not all categories are covered, reduce remaining category depth but still cover them

**Early stop handling:**
- If user says "enough", "stop", or "move on":
  1. Summarize what has been gathered so far
  2. List which categories were NOT fully covered
  3. Append a "Gaps & Skipped Categories" section to DISCOVERY.md
  4. Proceed to Phase 2

### Step 1.4: Finalize Discovery

After all 9 categories are covered (or user triggered early stop):

1. Append a summary section to `.ultraplan/DISCOVERY.md`:

```markdown
## Discovery Summary
- Total questions asked: {count}
- Categories fully covered: {list}
- Categories partially covered: {list}
- Categories skipped: {list}
- Key themes identified: {bullet list}
```

2. Update `.ultraplan/STATE.md`:
   - Phase: 2 of 6
   - Status: in_progress
   - Last activity: Phase 1 UNDERSTAND complete: {N} questions, {M}/9 categories

3. Print:
```
Phase 1/6: UNDERSTAND [==========] 100% - COMPLETE
{N} questions asked across {M} categories.
Proceeding to Phase 2: RESEARCH...
```

### Resume Behavior (Phase 1)

If `.ultraplan/DISCOVERY.md` exists when resuming:
- Read the file
- Count which categories have Q&A content
- Identify the last completed category
- Resume from the NEXT category
- Print: `Resuming Phase 1: UNDERSTAND - picking up from Category {N}: {name}`

---

## Phase 2: RESEARCH

**Purpose:** Investigate solutions, best practices, and technical approaches based on discovery findings.

**Progress format:** `Phase 2/6: RESEARCH [===       ] 30% - Launching subagents...`

### Before Starting

Read `{plugin_root}/skills/ultraplan/references/research-protocol.md` for detailed research guidance.

### Step 2.1: Extract Research Topics

1. Read `.ultraplan/DISCOVERY.md`
2. Auto-extract research topics:
   - Technologies mentioned or implied
   - Patterns and approaches needed
   - Integrations required (payment, auth, email, etc.)
   - Competitor or similar products mentioned
   - Tech stack decisions that need research
3. No user input needed for topic selection

Print:
```
Phase 2/6: RESEARCH [==        ] 20% - Topics extracted
Research topics identified:
  - {topic 1}
  - {topic 2}
  - ...

Launching parallel research subagents...
```

### Step 2.2: Launch Parallel Research Subagents

Spawn 3 subagents simultaneously in a SINGLE message (all 3 Task tool calls in one response):

**Subagent 1: Codebase Researcher**
- Tool: `Task` with `subagent_type="Explore"` (if codebase exists)
- Tool: `Task` with general purpose (if greenfield -- do tech stack comparison instead)
- Prompt: Include the research topics, discovery summary, and specific questions about code patterns
- If codebase exists: "Analyze the existing codebase for patterns, conventions, file structure, tech stack, and any relevant existing implementations that relate to: {topics}"
- If greenfield: "Compare 2-3 tech stack options for building {idea}. For each option, provide pros, cons, learning curve, and community support. Also find 3-5 similar products and analyze their approach."

**Subagent 2: Web Researcher**
- Tool: `Task` with general purpose
- Prompt: "Research current best practices, common approaches, and ecosystem state for: {topics}. Search the web for recent articles, tutorials, and community discussions. Focus on practical, proven approaches suitable for a project built by AI."

**Subagent 3: Docs Researcher**
- Tool: `Task` with general purpose
- Prompt: "Use Context7 MCP (resolve-library-id first, then get-library-docs) to fetch current documentation for these technologies: {tech list from topics}. Focus on: setup guides, key APIs, integration patterns, and any gotchas or breaking changes."

**IMPORTANT:** Launch all 3 in a single message so they run in parallel. Do NOT wait for one to finish before starting the next.

### Step 2.3: Collect and Write Research

After all 3 subagents complete:

1. Combine their findings into `.ultraplan/RESEARCH.md` using the template from `{plugin_root}/skills/ultraplan/templates/research.md`
2. Organize by topic area, not by subagent
3. Include:
   - Tech stack analysis and recommendation
   - Best practices found
   - Competitor insights (if greenfield)
   - Library recommendations with sources
   - Relevant code patterns from existing codebase (if applicable)

Print:
```
Phase 2/6: RESEARCH [=======   ] 70% - Research collected. Checking for conflicts...
```

### Step 2.4: Conflict Detection

Compare research findings against user's discovery answers:

- If research contradicts any user preference or assumption:
  - For each conflict, use `AskUserQuestion`:
    - Question: "Research finding vs. your preference: {plain English description of conflict}"
    - Options:
      - "Keep my original choice"
      - "Switch to the researched alternative (Recommended)" (only mark recommended if research strongly supports it)
      - "Let me think about this"
  - Record each resolution in RESEARCH.md

- If no conflicts found: note "No conflicts detected between discovery and research."

### Step 2.5: User Review of Research

Present a plain-English summary of key research findings (5-10 bullet points, no jargon).

Use `AskUserQuestion`:
- Question: "Here's what our research found. Does this align with your vision?"
- Options:
  - "Looks good, proceed to planning (Recommended)"
  - "Research more on a specific topic"
  - "I have concerns about some findings"

If user wants more research: ask which topic, spawn another subagent for that topic only, then re-present.

If user has concerns: ask follow-up questions to understand, update RESEARCH.md.

### Step 2.6: Finalize Research

1. Ensure `.ultraplan/RESEARCH.md` is complete and saved
2. Update `.ultraplan/STATE.md`:
   - Phase: 3 of 6
   - Status: in_progress
   - Last activity: Phase 2 RESEARCH complete: 3 subagents, {N} topics researched

3. Print:
```
Phase 2/6: RESEARCH [==========] 100% - COMPLETE
Proceeding to Phase 3: PLAN...
```

### Resume Behavior (Phase 2)

If `.ultraplan/RESEARCH.md` exists: skip entirely to Phase 3.

---

## Phase 3: PLAN

**Purpose:** Create a human-readable PRD and AI-executable technical plan with sections.

**Progress format:** `Phase 3/6: PLAN - PRD Section 4/10: What It Does`

### Before Starting

Read `{plugin_root}/skills/ultraplan/references/prd-writing.md` for PRD generation rules.
Read `{plugin_root}/skills/ultraplan/references/plan-writing.md` for technical plan generation rules.

### Step 3a: Generate PRD (Section-by-Section with User Approval)

Generate the PRD one section at a time, getting user approval for each section before moving to the next.

**PRD Sections (10 total):**

| # | Section | Content |
|---|---------|---------|
| 1 | What We're Building | 3-5 sentence summary anyone can understand |
| 2 | The Problem | What problem this solves, why it matters |
| 3 | Who It's For | User types, their needs, their experience level |
| 4 | What It Does | Feature list in plain English, organized by priority |
| 5 | How It Should Feel | Visual/UX vision from discovery |
| 6 | What It Connects To | Integrations, data sources, external services |
| 7 | What It Does NOT Do | Explicit scope boundaries |
| 8 | How We'll Know It Works | Success criteria in measurable terms |
| 9 | Business Model | Monetization approach from discovery |
| 10 | Risks & Concerns | Top 3-5 risks in plain language |

**For each PRD section:**

1. Generate the section content (200-300 words) using:
   - DISCOVERY.md answers as primary source
   - RESEARCH.md findings as supporting context
   - Plain English, ZERO jargon (see prd-writing.md for rules)
2. Present the section to the user via `AskUserQuestion`:
   - Question: "Here's the '{section_name}' section of your PRD:\n\n{section_content}\n\nDoes this look right?"
   - Options:
     - "Looks right, move on (Recommended)"
     - "Change this part"
     - "Remove this section"
     - "Add something to this"
3. Handle responses:
   - "Looks right": Move to next section
   - "Change this part": Ask what to change, regenerate section, re-present for approval
   - "Remove this section": Note removal, move to next
   - "Add something": Ask what to add, regenerate, re-present
4. After approval, append section to `.ultraplan/PRD.md`
5. Show progress:
   ```
   Phase 3/6: PLAN - PRD Section {N}/10: {section_name}
   ```

After all PRD sections are approved, write the final `.ultraplan/PRD.md` using the template from `{plugin_root}/skills/ultraplan/templates/prd.md`.

Print:
```
Phase 3/6: PLAN [====      ] 40% - PRD complete. Generating technical plan...
```

### Step 3b: Generate Technical Plan

Read `{plugin_root}/skills/ultraplan/references/plan-writing.md` for constraints and format rules.
Read `{plugin_root}/skills/ultraplan/references/xml-task-format.md` for XML task schema.

**Step 3b.1: Derive Sections from PRD**

1. Analyze the approved PRD features
2. Derive technical implementation sections - each is a self-contained implementation unit
3. Order sections by dependency:
   - Independent sections grouped into parallel batches
   - Dependent sections ordered sequentially
4. Assign risk ratings to each section:
   - **green**: Straightforward, well-understood patterns
   - **yellow**: Some complexity, may need iteration
   - **red**: High uncertainty, novel approach, critical path, security-sensitive
   - Risk factors: complexity, dependencies, security sensitivity, third-party reliance

**Step 3b.2: Write Section Index**

Create `.ultraplan/sections/index.md` with a manifest of all sections:

```markdown
# Section Index

## Overview
Total sections: {N}
Total tasks: {M}
Parallel batches: {X}

## Batch Execution Order

### Batch 1 (parallel)
- Section 01: {name} [green/yellow/red]
- Section 02: {name} [green/yellow/red]

### Batch 2 (parallel, depends on Batch 1)
- Section 03: {name} [green/yellow/red]

...

## Section Manifest

| # | Section | Risk | Batch | Depends On | Blocks |
|---|---------|------|-------|------------|--------|
| 01 | {name} | green | 1 | none | 03, 04 |
| 02 | {name} | yellow | 1 | none | 05 |
| 03 | {name} | green | 2 | 01 | 06 |
...
```

**Step 3b.3: Write Individual Section Files**

For each section, create `.ultraplan/sections/section-{NN}-{slug}.md` using the template from `{plugin_root}/skills/ultraplan/templates/section.md`.

Each section file MUST contain:

```markdown
# Section {NN}: {Name}

## Overview
[Plain English description of what this section builds]

## Risk: [{green/yellow/red}] - {one-line risk summary}

## Dependencies
- Depends on: {none / section-XX}
- Blocks: {section-XX, section-YY}
- Parallel batch: {batch number}

## TDD Test Stubs
- Test: {human-readable test description}
- Test: {human-readable test description}
- Test: {human-readable test description}
...

## Tasks

<task type="auto" id="{NN}-01">
  <name>{task name}</name>
  <files>{file paths this task touches}</files>
  <action>
    {Step-by-step instructions for what to implement.
    Written for an AI coding tool to execute.
    Clear, specific, no ambiguity.}
  </action>
  <verify>{How to verify this task is done correctly}</verify>
  <done>{Definition of done - what state the code should be in}</done>
</task>

<task type="auto" id="{NN}-02">
  ...
</task>
```

**Task granularity rules:**
- Each task touches 1-3 files maximum
- Each task represents roughly one git commit of work
- Each task has: name, files, action, verify, done
- Tasks within a section are ordered sequentially
- Action text is written for an AI coding tool (clear instructions, no jargon)

**Step 3b.4: Write Master Plan**

Create `.ultraplan/PLAN.md` using the template from `{plugin_root}/skills/ultraplan/templates/plan.md`:
- Architecture overview
- Tech stack (from research)
- Section index reference
- Dependency graph (text-based)
- Parallel batch execution order
- Total section and task counts

### Step 3b.5: Finalize Phase 3

1. Update `.ultraplan/STATE.md`:
   - Phase: 4 of 6
   - Status: in_progress
   - Last activity: Phase 3 PLAN complete: {N} sections, {M} tasks, PRD approved

2. Print:
```
Phase 3/6: PLAN [==========] 100% - COMPLETE
PRD: 10 sections approved
Technical Plan: {N} sections, {M} tasks, {X} parallel batches
Proceeding to Phase 4: REVIEW...
```

### Resume Behavior (Phase 3)

- If `.ultraplan/PRD.md` exists but `.ultraplan/sections/` is empty: resume from Step 3b
- If `.ultraplan/sections/` contains section files: skip to Phase 4

---

## Phase 4: REVIEW

**Purpose:** Critical self-review of the plan + non-obvious refinement questions.

**Progress format:** `Phase 4/6: REVIEW [====      ] 40% - Running checklist: Security (4/8)`

### Before Starting

Read `{plugin_root}/skills/ultraplan/references/review-checklist.md` for the 8-category quality checklist details.

### Step 4a: Self-Review Checklist

Run the 8-category quality checklist against ALL plan documents (PRD.md, PLAN.md, all section files):

| # | Category | What to Check |
|---|----------|---------------|
| 1 | Completeness | Does every discovery answer map to a plan section? Are all features covered? |
| 2 | Consistency | Do sections contradict each other? Are naming conventions consistent? |
| 3 | Feasibility | Can each task actually be implemented as described? Are there impossible steps? |
| 4 | Security | Are auth, data protection, input validation, and access control addressed? |
| 5 | Scalability | Will this architecture handle growth? Are there bottlenecks? |
| 6 | Edge Cases | Are error states, empty states, and boundary conditions handled? |
| 7 | User Experience | Does the plan deliver the UX vision from discovery? Accessibility? |
| 8 | Cost & Complexity | Is the plan over-engineered? Can anything be simplified? |

For each category:
1. Review all relevant documents
2. Log findings: issues found, severity (minor/major/critical)
3. Auto-fix where possible:
   - Missing error handling task --> add a task to the relevant section
   - Missing input validation --> add validation step to relevant task
   - Inconsistent naming --> standardize across sections
4. Flag issues that require user decision (cannot auto-fix)
5. Show progress:
   ```
   Phase 4/6: REVIEW [===       ] {pct}% - Checklist: {category} ({N}/8)
   ```

### Step 4b: Show Review Summary

Present results to user in plain English:

```
================================================================
REVIEW RESULTS
================================================================
Issues found:  {total}
Auto-fixed:    {auto_fixed_count}
Need decision: {needs_decision_count}

Category Breakdown:
  [pass] Completeness: No issues
  [pass] Consistency: 1 minor issue (auto-fixed)
  [WARN] Feasibility: 2 issues (1 auto-fixed, 1 needs your input)
  [pass] Security: No issues
  [pass] Scalability: No issues
  [WARN] Edge Cases: 3 issues (2 auto-fixed, 1 needs your input)
  [pass] User Experience: No issues
  [pass] Cost & Complexity: No issues
================================================================
```

If there are issues needing user decision, present each one via `AskUserQuestion`:
- Question: "{plain English description of the issue and why it matters}"
- Options: Contextual options relevant to the specific issue + "Skip this for now"

### Step 4c: User Refinement Questions (Interview-Me Style)

Ask 5-10 NON-OBVIOUS questions the user probably did not think about. These are derived from:
- Gaps found during self-review
- Tricky edge cases specific to their product
- UX details that matter but are easy to miss

Format: `AskUserQuestion` with multiple-choice options + "(Recommended)" on first option.

Example questions:
- "What happens if a user uploads a 50MB recipe photo? Should there be a size limit?"
- "If two users edit the same recipe at the same time, who wins?"
- "Should deleted recipes be permanently gone or recoverable for 30 days?"
- "If payment fails mid-checkout, should the cart be saved or reset?"
- "What happens when a user's internet connection drops while they're filling out a long form?"

### Step 4d: Update Plan with Review Findings

1. Integrate auto-fixes and user answers into affected section files
2. Re-run a quick consistency check on modified sections only (not full 8-category again)
3. Append "Review Notes" section to `.ultraplan/PLAN.md`:

```markdown
## Review Notes

### Review Date: {date}

### Self-Review Results
- Total issues found: {N}
- Auto-fixed: {M}
- User decisions: {K}

### Category Results
{table of pass/warn/fail per category}

### Refinement Questions Asked
{list of questions and user answers}

### Sections Modified
{list of sections that were updated and what changed}
```

### Step 4e: Finalize Phase 4

1. Update `.ultraplan/STATE.md`:
   - Phase: 5 of 6
   - Status: in_progress
   - Last activity: Phase 4 REVIEW complete: {N} issues found, {M} auto-fixed, {K} user decisions

2. Print:
```
Phase 4/6: REVIEW [==========] 100% - COMPLETE
{N} issues found, {M} auto-fixed, {K} resolved by you.
{J} refinement questions answered.
Proceeding to Phase 5: VALIDATE...
```

### Resume Behavior (Phase 4)

If `.ultraplan/PLAN.md` contains a "Review Notes" section: skip to Phase 5.

---

## Phase 5: VALIDATE

**Purpose:** Cross-reference alignment: verify every discovery requirement traces to a plan section and vice versa.

**Progress format:** `Phase 5/6: VALIDATE [======    ] 60% - Building traceability matrix...`

### Before Starting

Read `{plugin_root}/skills/ultraplan/references/validate-protocol.md` for traceability rules.

### Step 5.1: Build Traceability Matrix

1. Read `.ultraplan/DISCOVERY.md`: extract every distinct requirement and user answer that implies a feature or behavior
2. Read all `.ultraplan/sections/section-*.md` files: extract every task ID and its purpose
3. Read `.ultraplan/PRD.md`: extract each feature listed in "What It Does" and other sections
4. Build the mapping:

```
Requirement (from Discovery) --> PRD Section --> Plan Section --> Task IDs
```

5. Identify:
   - **Unmapped requirements**: Requirements from discovery that do NOT trace to any task
   - **Unmapped tasks**: Tasks that do NOT trace to any discovery requirement (potential scope creep)

Print:
```
Phase 5/6: VALIDATE [====      ] 40% - Traceability matrix built
  Requirements found: {N}
  Tasks found: {M}
  Fully covered: {K}
  Gaps detected: {G}
  Potential scope creep: {S}
```

### Step 5.2: Resolve Gaps

For each unmapped requirement, use `AskUserQuestion`:
- Question: "Your requirement '{requirement description}' from discovery isn't covered in the plan. What should we do?"
- Options:
  - "Add it as a new section (Recommended)"
  - "Merge it into an existing section"
  - "It was actually out of scope, skip it"
  - "I changed my mind, remove it"

If user picks "Add as new section": create a new section file and update the index.
If user picks "Merge into existing": ask which section, add tasks to that section.

### Step 5.3: Resolve Scope Creep

For each unmapped task (task exists but no matching requirement), use `AskUserQuestion`:
- Question: "The plan includes '{task description}' but you didn't specifically ask for it. It was added because {reason}. Keep or remove?"
- Options:
  - "Keep it, it's needed (Recommended)" (if it supports a related requirement)
  - "Remove it"

If user says remove: delete the task from its section file. If the section becomes empty, remove the section and update the index.

### Step 5.4: Generate Traceability Table

Write `.ultraplan/VALIDATE.md` using the template from `{plugin_root}/skills/ultraplan/templates/validate.md`:

```markdown
# Traceability Matrix

## Summary
- Total requirements from discovery: {N}
- Total tasks in plan: {M}
- Requirements fully covered: {K}
- Requirements partially covered: {P}
- Requirements excluded (user choice): {E}
- Tasks added beyond requirements (approved): {A}

## Requirement-to-Task Mapping

| # | Requirement (from Discovery) | PRD Section | Plan Section | Task IDs | Status |
|---|------------------------------|-------------|--------------|----------|--------|
| 1 | {requirement} | {prd section} | section-{NN} | {NN}-01, {NN}-02 | Covered |
| 2 | {requirement} | {prd section} | section-{NN} | {NN}-01 | Covered |
| 3 | {requirement} | {prd section} | -- | -- | Excluded (user choice) |
...

## Gap Resolution Log
| # | Gap Type | Description | Resolution | Date |
|---|----------|-------------|------------|------|
| 1 | Missing requirement | {desc} | Added to section-{NN} | {date} |
| 2 | Scope creep | {desc} | Kept (user approved) | {date} |
...
```

### Step 5.5: Final User Approval

Present the traceability summary to the user via `AskUserQuestion`:
- Question: "All requirements have been verified against the plan. {N} requirements covered, {E} excluded by your choice. Ready to generate final output?"
- Options:
  - "Yes, finalize the plan (Recommended)"
  - "I want to add something"
  - "I want to change something"

If user wants to add/change: handle the addition/change, update affected files, re-validate the changed portion only, then ask again.

### Step 5.6: Finalize Phase 5

1. Update `.ultraplan/STATE.md`:
   - Phase: 6 of 6
   - Status: in_progress
   - Last activity: Phase 5 VALIDATE complete: {N} requirements traced, {E} excluded

2. Print:
```
Phase 5/6: VALIDATE [==========] 100% - COMPLETE
All requirements verified. Proceeding to Phase 6: OUTPUT...
```

### Resume Behavior (Phase 5)

If `.ultraplan/VALIDATE.md` exists: skip to Phase 6.

---

## Phase 6: OUTPUT

**Purpose:** Produce all final deliverable files and present completion summary.

**Progress format:** `Phase 6/6: OUTPUT [========  ] 80% - Writing summary...`

### Before Starting

Read `{plugin_root}/skills/ultraplan/references/output-format.md` for file format specifications.

### Step 6.1: Finalize All Files

Ensure every output file exists and is internally consistent:

1. `.ultraplan/PRD.md` - Verify complete (should exist from Phase 3)
2. `.ultraplan/PLAN.md` - Verify includes Review Notes (from Phase 4)
3. `.ultraplan/RESEARCH.md` - Verify complete (from Phase 2)
4. `.ultraplan/DISCOVERY.md` - Verify complete (from Phase 1)
5. `.ultraplan/VALIDATE.md` - Verify complete (from Phase 5)
6. `.ultraplan/sections/index.md` - Verify section count matches actual files
7. `.ultraplan/sections/section-*.md` - Verify all listed in index exist

Fix any inconsistencies found (e.g., index references a section that doesn't exist).

### Step 6.2: Generate SUMMARY.md

Create `.ultraplan/SUMMARY.md` using the template from `{plugin_root}/skills/ultraplan/templates/summary.md`:

```markdown
# UltraPlan Summary

## What We're Building
[3 sentences from PRD "What We're Building" section]

## Key Features
- [Bullet list of top features from PRD "What It Does"]

## Tech Stack
- [Recommended stack from RESEARCH.md]

## Risk Areas
- [{color}] {risk description}
- [{color}] {risk description}

## Plan Structure
- {N} sections, {M} total tasks
- {X} parallel batches
- {Y} sequential dependencies

## How to Execute This Plan
1. Open any AI coding tool (Claude Code, Cursor, etc.)
2. Share the .ultraplan/ folder
3. Say: "Read .ultraplan/sections/index.md and execute section 1"
4. After each section completes, say: "Execute section [next]"
5. Sections in the same batch can be run in parallel

## How to Update This Plan
Run: /ultraplan update
Describe what changed, and only affected sections will be regenerated.
```

### Step 6.3: Finalize STATE.md

Update `.ultraplan/STATE.md` to completion state:

```markdown
# UltraPlan State

## Current Position
Phase: 6 of 6
Status: complete
Last activity: {date} - Plan finalized

## Progress
[==========] Phase 6/6: OUTPUT - COMPLETE

## Session History
| Date | Action | Details |
|------|--------|---------|
| {date} | Created | /ultraplan {idea} |
| {date} | Phase 1 | UNDERSTAND complete: {N} questions, {M}/9 categories |
| {date} | Phase 2 | RESEARCH complete: 3 subagents, {topics} researched |
| {date} | Phase 3 | PLAN complete: PRD approved, {N} sections, {M} tasks |
| {date} | Phase 4 | REVIEW complete: {issues} issues, {fixed} auto-fixed |
| {date} | Phase 5 | VALIDATE complete: {reqs} requirements traced |
| {date} | Phase 6 | OUTPUT complete: all files finalized |

## Change Log (from /ultraplan update)
| Date | What Changed | Sections Affected |
|------|-------------|-------------------|
| (none yet) |
```

### Step 6.4: Present Completion

Print the completion banner:

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
    index.md      - Section manifest
    section-01-*  - {section 1 name} [{risk color}]
    section-02-*  - {section 2 name} [{risk color}]
    ...

Total: {N} sections, {M} tasks

----------------------------------------------------------------
WHAT TO DO NEXT
----------------------------------------------------------------

To start building:
  Give the .ultraplan/ folder to any AI coding tool and say:
  "Read .ultraplan/sections/index.md and execute section 1"

To update this plan:
  Run: /ultraplan update

To view the summary:
  Read: .ultraplan/SUMMARY.md
================================================================
```

### Resume Behavior (Phase 6)

If `.ultraplan/SUMMARY.md` exists: the plan is already complete. Show the completion banner again and remind about `/ultraplan update`.

---

## UPDATE COMMAND

**Triggered by:** `/ultraplan update`

### Before Starting

1. Check if `.ultraplan/` directory exists. If not:
```
================================================================
ULTRAPLAN: No Plan Found
================================================================
No .ultraplan/ directory found. Run /ultraplan [your idea] first.
================================================================
```
Stop and wait.

2. Check if `.ultraplan/STATE.md` shows "complete" status. If not:
```
================================================================
ULTRAPLAN: Plan Not Complete
================================================================
Your plan is still in progress (Phase {N}/6).
Run /ultraplan to continue, or delete .ultraplan/ to start fresh.
================================================================
```
Stop and wait.

3. Read `{plugin_root}/skills/ultraplan/references/update-protocol.md` for detailed update behavior.

### Step U.1: Ask What Changed

Use `AskUserQuestion`:
- Question: "What changed about your plan? Pick the type of change:"
- Options:
  - "Add a new feature"
  - "Remove a feature"
  - "Change how something works"
  - "Change priorities or ordering"
  - "Other (let me describe)"

### Step U.2: Gather Change Details

Based on the change type, ask 5-10 follow-up questions via `AskUserQuestion` to understand the specific change. Use plain English, multiple choice with recommendations.

### Step U.3: Identify Affected Sections

1. Read all section files and the PRD
2. Determine which sections are affected by the change
3. Present to user:
```
Affected sections:
  - Section {NN}: {name} - {reason for change}
  - Section {MM}: {name} - {reason for change}

Unchanged sections ({X} of {Y}):
  - All other sections remain exactly as they are
```

### Step U.4: Regenerate Affected Sections ONLY

**Key principle: NEVER regenerate the entire plan. Only touch what's affected.**

1. Regenerate only the affected section files
2. Update `.ultraplan/PRD.md` if the change affects product requirements
3. Update `.ultraplan/sections/index.md` if sections were added/removed or dependencies changed
4. Run a quick consistency check on modified sections
5. Update traceability in `.ultraplan/VALIDATE.md` for affected requirements

### Step U.5: Log the Change

Update `.ultraplan/STATE.md` Change Log:

```markdown
| {date} | {change description} | section-{NN}, section-{MM} |
```

### Step U.6: Show Update Summary

```
================================================================
ULTRAPLAN UPDATE COMPLETE
================================================================
Changed: {list of changed sections}
Added:   {list of new sections, if any}
Removed: {list of removed sections, if any}
Unchanged: {count} sections preserved

Change logged in STATE.md.

To review changes: Read the affected section files
To update again: /ultraplan update
================================================================
```

---

## STATUS COMMAND

**Triggered by:** `/ultraplan status`

### Behavior

1. Check if `.ultraplan/` directory exists. If not:
```
No plan in progress. Run /ultraplan [your idea] to start.
```
Stop.

2. Read `.ultraplan/STATE.md`
3. Present current status:

```
================================================================
ULTRAPLAN STATUS
================================================================
{progress bar from STATE.md}

Phase: {current phase}/6 - {phase name}
Status: {in_progress / complete}
Last activity: {date} - {description}

Files:
  [exists/missing] PRD.md
  [exists/missing] PLAN.md
  [exists/missing] RESEARCH.md
  [exists/missing] DISCOVERY.md
  [exists/missing] VALIDATE.md
  [exists/missing] SUMMARY.md
  [exists/missing] sections/index.md
  [{N} files]      sections/section-*.md

Session History:
{table from STATE.md}

To continue: /ultraplan
To update:   /ultraplan update
================================================================
```

---

## Resuming After Compaction

**CRITICAL:** When resuming this workflow after context compaction, the detailed instructions from this SKILL.md file are lost. Follow these rules:

1. **ALWAYS read STATE.md first** to determine current position
   - `Phase` tells you where you are
   - `Status` tells you if the plan is complete or in-progress
   - `Last activity` tells you what was done last

2. **ALWAYS read the reference file for your current phase before proceeding**
   - Phase 1: Read `{plugin_root}/skills/ultraplan/references/understand-protocol.md`
   - Phase 2: Read `{plugin_root}/skills/ultraplan/references/research-protocol.md`
   - Phase 3: Read `{plugin_root}/skills/ultraplan/references/prd-writing.md` AND `{plugin_root}/skills/ultraplan/references/plan-writing.md`
   - Phase 4: Read `{plugin_root}/skills/ultraplan/references/review-checklist.md`
   - Phase 5: Read `{plugin_root}/skills/ultraplan/references/validate-protocol.md`
   - Phase 6: Read `{plugin_root}/skills/ultraplan/references/output-format.md`

3. **NEVER skip phases** - follow the pipeline order exactly:
   UNDERSTAND --> RESEARCH --> PLAN --> REVIEW --> VALIDATE --> OUTPUT

4. **Use file existence to determine resume point:**
   - No DISCOVERY.md --> Start at Phase 1
   - DISCOVERY.md exists, no RESEARCH.md --> Start at Phase 2
   - RESEARCH.md exists, no section files --> Start at Phase 3
   - Section files exist, PLAN.md has no "Review Notes" --> Start at Phase 4
   - PLAN.md has "Review Notes", no VALIDATE.md --> Start at Phase 5
   - VALIDATE.md exists, no SUMMARY.md --> Start at Phase 6
   - SUMMARY.md exists --> Plan is complete

5. **Get `{plugin_root}` by locating this SKILL.md file** - search for it if needed:
   - It is the grandparent directory of this file
   - Or look for a directory containing `skills/ultraplan/SKILL.md`

6. **All user interactions use `AskUserQuestion`** with multiple-choice options
   - First option is always the recommended choice marked "(Recommended)"
   - Last option is always "Other" for custom input
   - Plain English, zero jargon

---

## Key Rules (Always Apply)

1. **Plain English everywhere.** The target user is a no-coder. Never use technical jargon in user-facing text. Technical details go in section files (read by AI executors, not users).

2. **AskUserQuestion for ALL user input.** Never ask open-ended questions without options. Always provide multiple-choice with a recommended first option.

3. **Auto-save after every batch/step.** Never lose progress. Write to disk frequently.

4. **Progress indicators after every meaningful step.** The user should always know where they are in the 6-phase pipeline.

5. **Non-destructive updates.** The `/ultraplan update` command NEVER regenerates the full plan. Only affected sections are touched.

6. **Sections are the atomic unit.** Each section is a self-contained, AI-executable implementation unit with XML tasks, TDD stubs, risk rating, and dependency info.

7. **Discovery is exhaustive.** 40-70 questions across 9 categories. Do not stop early unless the user explicitly requests it.

8. **Research is parallel.** Always launch 3 subagents simultaneously in a single message.

9. **PRD approval is incremental.** One section at a time, user must approve before moving on.

10. **Review is self-critical.** Run the 8-category checklist honestly. Auto-fix what you can, flag what you cannot.

11. **Validation is bidirectional.** Check requirements-to-tasks AND tasks-to-requirements. Catch both gaps and scope creep.

12. **State is always saved.** STATE.md is the source of truth for resume. Update it at every phase transition.
