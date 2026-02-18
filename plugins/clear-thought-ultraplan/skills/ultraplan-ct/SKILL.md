---
name: ultraplan-ct
description: Enhanced planning system combining UltraPlan's 6-phase pipeline with Clear Thought's 11 structured thinking frameworks. Takes a plain-English idea and produces a complete, AI-executable implementation plan with rigorous thinking at every phase.
license: MIT
compatibility: Claude Code (any version with Task tool and AskUserQuestion support)
---

# UltraPlan CT (Clear Thought) Skill

Single-command planning pipeline: `/ultraplan-ct [idea]`

Orchestrates 6 phases with integrated thinking frameworks:
UNDERSTAND --> RESEARCH --> PLAN --> REVIEW --> VALIDATE --> OUTPUT

Also supports: `/ultraplan-ct update` and `/ultraplan-ct status`

---

## What Makes This Different from UltraPlan

This skill enhances UltraPlan with 11 structured thinking frameworks from Clear Thought, applied at specific moments in each phase:

| Phase | Thinking Frameworks | Purpose |
|-------|--------------------|---------|
| 1. UNDERSTAND | Mental Models + Metacognitive Monitoring | Decompose idea before questioning, assess knowledge gaps |
| 2. RESEARCH | Scientific Method + Decision Framework | Form testable hypotheses, evaluate options with weighted criteria |
| 3. PLAN | Design Patterns + Programming Paradigms + Visual Reasoning + Structured Argumentation | Select patterns, choose paradigms, create diagrams, justify decisions |
| 4. REVIEW | Collaborative Reasoning + Debugging Approaches + Metacognitive Monitoring | Multi-persona review, pre-mortem analysis, confidence calibration |
| 5. VALIDATE | Scientific Method + Sequential Thinking | Verify hypotheses, systematic tracing |
| 6. OUTPUT | Visual Reasoning + Mental Models | Architecture diagrams, Pareto prioritization |

Thinking framework references are in: `{plugin_root}/skills/ultraplan-ct/references/thinking/`

---

## CRITICAL: First Actions

**BEFORE doing anything else**, follow these steps in exact order:

### 1. Detect Command Variant

Parse the user's input to determine which command was invoked:

- **`/ultraplan-ct [idea text]`** --> Main pipeline (go to Step 2)
- **`/ultraplan-ct update`** --> Update mode (jump to "UPDATE COMMAND" section at bottom)
- **`/ultraplan-ct status`** --> Status mode (jump to "STATUS COMMAND" section at bottom)

### 2. Print Intro Banner

Print this immediately:

```
================================================================
ULTRAPLAN CT: Clear Thought Enhanced Planning
================================================================
UNDERSTAND --> RESEARCH --> PLAN --> REVIEW --> VALIDATE --> OUTPUT

Your idea will go through 6 phases with structured thinking:
  Phase 1: UNDERSTAND  - First Principles analysis + discovery (40-70 questions)
  Phase 2: RESEARCH    - Hypothesis-driven parallel research
  Phase 3: PLAN        - PRD + technical plan with design patterns & diagrams
  Phase 4: REVIEW      - Multi-persona review + pre-mortem debugging
  Phase 5: VALIDATE    - Systematic requirement tracing & verification
  Phase 6: OUTPUT      - Visual summaries + Pareto-prioritized guide

11 thinking frameworks active. All output saved to: .ultraplan/
================================================================
```

### 3. Store Plugin Root

Determine `{plugin_root}` by locating the directory containing this SKILL.md file. The plugin root is two levels up from the SKILL.md location (i.e., the `clear-thought-ultraplan/` directory that contains `skills/`, `agents/`, `hooks/`, etc.).

Store `{plugin_root}` for use throughout the workflow. All reference file paths use this variable.

### 4. Detect Existing .ultraplan/ Directory (Resume Detection)

Check if `.ultraplan/` directory exists in the current working directory.

**If `.ultraplan/` does NOT exist:**
- This is a fresh run
- Create the `.ultraplan/` directory and `.ultraplan/sections/` subdirectory
- Initialize `.ultraplan/STATE.md` using the template from `{plugin_root}/skills/ultraplan-ct/templates/state.md`
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

- If the user typed just `/ultraplan-ct` with no idea text:

```
================================================================
ULTRAPLAN CT: Idea Required
================================================================

Please provide your idea in plain English. Examples:

  /ultraplan-ct I want to build a recipe sharing app
  /ultraplan-ct Build me a task management tool with team features
  /ultraplan-ct Create an online store for handmade jewelry

Just describe what you want to build - no technical knowledge needed!
================================================================
```

**Do not continue. Wait for user to re-invoke with an idea.**

- If idea text is present: record it in STATE.md and proceed to Phase 1.

---

## Phase 1: UNDERSTAND

**Purpose:** Exhaustively gather requirements through structured questioning, guided by First Principles analysis.

**Progress format:** `Phase 1/6: UNDERSTAND [=====     ] 45% - Category: Edge Cases (6/9 categories)`

### Before Starting

1. Read `{plugin_root}/skills/ultraplan-ct/references/understand-protocol.md` for detailed question examples and category guidance.
2. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/mental-models.md` -- Apply **First Principles Thinking** to decompose the user's idea into fundamental truths before asking any questions.
3. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/metacognitive-monitoring.md` -- Assess what you know and don't know about this domain to prioritize deeper exploration.

### Step 1.0: Pre-Discovery Thinking (NEW - Clear Thought Enhancement)

Before asking any questions, apply two thinking frameworks:

**First Principles Analysis:**
- Decompose the user's idea into its fundamental truths
- What are the core things this system MUST do?
- What are the absolute minimum components?
- Strip away assumptions from similar products

**Metacognitive Assessment:**
- Rate your domain knowledge (expert/proficient/familiar/basic/minimal/none)
- Identify what you DON'T know about this domain
- Flag areas where you might have biases (e.g., defaulting to familiar tech stacks)

Document this analysis at the top of `.ultraplan/DISCOVERY.md` under a "## Pre-Discovery Analysis" section. Use this analysis to prioritize which question categories need deeper exploration.

### Step 1.1: Codebase Detection

Scan the current project directory for existing code:

- Look for: `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `*.csproj`, `pubspec.yaml`, `Gemfile`, `pom.xml`, `build.gradle`, or any `src/`, `app/`, `lib/` directories
- Look for: `.git/` directory, README files, configuration files

**If codebase exists:**
- Analyze the tech stack, frameworks, patterns, and conventions
- Note findings for use in questions
- Category 6 (Existing Patterns) will be heavily used
- Record codebase analysis in a variable for use throughout Phase 1

**If no codebase (greenfield):**
- Skip Category 6 (Existing Patterns) entirely
- Add greenfield-specific questions about tech stack preferences to Category 7
- Note this is a greenfield project

### Step 1.2: Initialize Discovery Document

Create `.ultraplan/DISCOVERY.md` using the template from `{plugin_root}/skills/ultraplan-ct/templates/discovery.md`. Include the Pre-Discovery Analysis from Step 1.0.

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
| 6 | Existing Patterns | (If codebase) How do similar things work here? Conventions? |
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
3. After each user response, evaluate if follow-up is needed
4. After each batch: append the Q&A to `.ultraplan/DISCOVERY.md`
5. Show progress indicator after each batch

**Question count enforcement:**
- Target: 40-70 questions total across all categories
- System MUST NOT stop early unless user explicitly says "enough", "stop", or "move on"
- Aim for 4-8 questions per category

**Early stop handling:**
- If user says "enough", "stop", or "move on":
  1. Summarize what has been gathered so far
  2. List which categories were NOT fully covered
  3. Append a "Gaps & Skipped Categories" section to DISCOVERY.md
  4. Proceed to Phase 2

### Step 1.4: Finalize Discovery

After all 9 categories are covered:

1. Append a summary section to `.ultraplan/DISCOVERY.md`
2. Update `.ultraplan/STATE.md`
3. Print phase completion and proceed to Phase 2

### Resume Behavior (Phase 1)

If `.ultraplan/DISCOVERY.md` exists when resuming:
- Read the file, count completed categories
- Resume from the NEXT category

---

## Phase 2: RESEARCH

**Purpose:** Investigate solutions using hypothesis-driven research with weighted evaluation.

**Progress format:** `Phase 2/6: RESEARCH [===       ] 30% - Launching subagents...`

### Before Starting

1. Read `{plugin_root}/skills/ultraplan-ct/references/research-protocol.md` for detailed research guidance.
2. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/scientific-method.md` -- Form testable hypotheses before spawning research agents.
3. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/decision-framework.md` -- Prepare weighted criteria for evaluating options.

### Step 2.0: Form Research Hypotheses (NEW - Clear Thought Enhancement)

Before extracting topics, apply the Scientific Method:

1. Based on DISCOVERY.md, form 3-5 testable hypotheses about the best technical approach
2. Each hypothesis should be: "We believe [X] because [Y], which we can verify by [Z]"
3. Document hypotheses in RESEARCH.md
4. Task the research subagents with gathering evidence for/against these hypotheses

### Step 2.1: Extract Research Topics

1. Read `.ultraplan/DISCOVERY.md`
2. Auto-extract research topics (technologies, patterns, integrations, competitors)
3. No user input needed for topic selection

### Step 2.2: Launch Parallel Research Subagents

Spawn 3 subagents simultaneously in a SINGLE message (all 3 Task tool calls in one response):

**Subagent 1: Codebase Researcher** -- Analyze existing code or do tech stack comparison
**Subagent 2: Web Researcher** -- Search web for best practices and approaches
**Subagent 3: Docs Researcher** -- Fetch library docs via Context7 MCP

**IMPORTANT:** Launch all 3 in a single message so they run in parallel.

### Step 2.3: Collect and Write Research

After all 3 subagents complete, merge findings into `.ultraplan/RESEARCH.md`.

### Step 2.4: Evaluate with Decision Framework (NEW - Clear Thought Enhancement)

When comparing technology options:
- Apply Weighted Criteria analysis from the Decision Framework
- Create a decision matrix scoring each option against criteria
- Include the matrix in RESEARCH.md
- Present to user during conflict resolution

### Step 2.5: Conflict Detection and User Review

Compare research findings against user's discovery answers. Present conflicts via `AskUserQuestion`. Get user approval to proceed.

### Step 2.6: Verify Hypotheses (NEW - Clear Thought Enhancement)

After research is complete:
- Revisit each hypothesis from Step 2.0
- Mark as: supported / refuted / needs refinement
- Document verdict in RESEARCH.md under "Hypothesis Verification" section

### Step 2.7: Finalize Research

Update STATE.md and proceed to Phase 3.

### Resume Behavior (Phase 2)

If `.ultraplan/RESEARCH.md` exists: skip entirely to Phase 3.

---

## Phase 3: PLAN

**Purpose:** Create PRD and technical plan with design pattern selection and architecture visualization.

**Progress format:** `Phase 3/6: PLAN - PRD Section 4/10: What It Does`

### Before Starting

1. Read `{plugin_root}/skills/ultraplan-ct/references/prd-writing.md` for PRD generation rules.
2. Read `{plugin_root}/skills/ultraplan-ct/references/plan-writing.md` for technical plan generation rules.
3. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/design-patterns.md` -- Identify applicable patterns.
4. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/programming-paradigms.md` -- Select paradigms per section.
5. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/visual-reasoning.md` -- Plan architecture diagrams.

### Step 3a: Generate PRD (Section-by-Section with User Approval)

Generate the PRD one section at a time, getting user approval for each section before moving to the next. Follow the 10-section structure (What We're Building, The Problem, Who It's For, What It Does, How It Should Feel, What It Connects To, What It Does NOT Do, How We'll Know It Works, Business Model, Risks & Concerns).

For the Risks & Concerns section:
- Read `{plugin_root}/skills/ultraplan-ct/references/thinking/structured-argumentation.md`
- Use thesis-antithesis-synthesis to evaluate each risk
- Present risks as structured arguments with mitigations

### Step 3b: Generate Technical Plan

Read `{plugin_root}/skills/ultraplan-ct/references/xml-task-format.md` for XML task schema.

**Step 3b.0: Design Pattern Selection (NEW - Clear Thought Enhancement)**

Before splitting sections:
- Apply Design Patterns framework to identify architecture patterns
- Apply Programming Paradigms framework to note best paradigm per section type
- Document pattern choices in PLAN.md Architecture Overview

**Step 3b.1: Derive Sections from PRD**
- Decompose PRD features into implementation sections
- Order by dependency, group into parallel batches
- Assign risk ratings (green/yellow/red)

**Step 3b.2: Write Section Index** -- `.ultraplan/sections/index.md`

**Step 3b.3: Write Individual Section Files** -- Each with overview, risk, dependencies, TDD stubs, XML tasks

**Step 3b.4: Create Architecture Visualization (NEW - Clear Thought Enhancement)**

Apply Visual Reasoning:
- Create ASCII architecture diagram for PLAN.md
- Create data flow diagram showing how data moves through sections
- Identify bottlenecks or single points of failure

**Step 3b.5: Write Master Plan** -- `.ultraplan/PLAN.md` with architecture diagrams included

**Step 3b.6: Justify Key Decisions (NEW - Clear Thought Enhancement)**

Apply Structured Argumentation for the top 3 most important technical decisions:
- Present thesis (our choice), antithesis (alternatives), synthesis (why our choice wins)
- Include in PLAN.md under "Architecture Decisions" section

### Step 3b.7: Finalize Phase 3

Update STATE.md and proceed to Phase 4.

### Resume Behavior (Phase 3)

- If `.ultraplan/PRD.md` exists but `.ultraplan/sections/` is empty: resume from Step 3b
- If `.ultraplan/sections/` contains section files: skip to Phase 4

---

## Phase 4: REVIEW

**Purpose:** Multi-perspective critical review with pre-mortem analysis and confidence calibration.

**Progress format:** `Phase 4/6: REVIEW [====      ] 40% - Running checklist: Security (4/8)`

### Before Starting

1. Read `{plugin_root}/skills/ultraplan-ct/references/review-checklist.md` for the 8-category quality checklist.
2. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/collaborative-reasoning.md` -- Set up review personas.
3. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/debugging-approaches.md` -- Prepare pre-mortem analysis.
4. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/metacognitive-monitoring.md` -- Prepare confidence assessment.

### Step 4.0: Multi-Persona Review Setup (NEW - Clear Thought Enhancement)

Create 3 review personas:

| Persona | Expertise | Focus | Known Bias |
|---------|-----------|-------|------------|
| Security Expert | AppSec, threat modeling | Auth, data protection, input validation | Over-secures, may add unnecessary complexity |
| User Advocate | UX research, accessibility | User flows, onboarding, error messages | Under-estimates technical constraints |
| Devil's Advocate | Systems architecture | Failure modes, edge cases, scalability | Finds problems without always providing solutions |

Each persona reviews the plan independently. Their findings are combined with the standard checklist.

### Step 4a: Self-Review Checklist

Run the 8-category quality checklist against ALL plan documents:

| # | Category | What to Check |
|---|----------|---------------|
| 1 | Completeness | Does every discovery answer map to a plan section? |
| 2 | Consistency | Do sections contradict each other? Naming consistent? |
| 3 | Feasibility | Can each task actually be implemented as described? |
| 4 | Security | Are auth, validation, access control addressed? |
| 5 | Scalability | Will this architecture handle growth? |
| 6 | Edge Cases | Are error states, empty states, boundaries handled? |
| 7 | User Experience | Does the plan deliver the UX vision? Accessibility? |
| 8 | Cost & Complexity | Is the plan over-engineered? |

Auto-fix where possible, flag issues needing user decision.

### Step 4b: Pre-Mortem Debugging (NEW - Clear Thought Enhancement)

For each yellow/red risk section:
- Apply Cause Elimination from Debugging Approaches
- Identify the top 3 failure modes for each section
- Add preventive tasks for each identified failure mode
- Document in review notes

### Step 4c: Show Review Summary

Present results to user in plain English with the multi-persona findings.

### Step 4d: User Refinement Questions (Interview-Me Style)

Ask 5-10 NON-OBVIOUS questions the user probably didn't think about.

### Step 4e: Confidence Assessment (NEW - Clear Thought Enhancement)

Apply Metacognitive Monitoring:
- Rate overall plan confidence (0.0-1.0)
- Rate confidence per section
- Identify lowest-confidence areas
- Include confidence ratings in review notes

### Step 4f: Update Plan with Review Findings

Integrate all findings (checklist + personas + pre-mortem + user answers) into affected sections. Append "Review Notes" to PLAN.md including confidence ratings.

### Step 4g: Finalize Phase 4

Update STATE.md and proceed to Phase 5.

### Resume Behavior (Phase 4)

If `.ultraplan/PLAN.md` contains a "Review Notes" section: skip to Phase 5.

---

## Phase 5: VALIDATE

**Purpose:** Systematic requirement tracing with hypothesis verification.

**Progress format:** `Phase 5/6: VALIDATE [======    ] 60% - Building traceability matrix...`

### Before Starting

1. Read `{plugin_root}/skills/ultraplan-ct/references/validate-protocol.md` for traceability rules.
2. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/sequential-thinking.md` -- For systematic tracing.
3. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/scientific-method.md` -- For hypothesis verification.

### Step 5.0: Systematic Tracing Setup (NEW - Clear Thought Enhancement)

Apply Sequential Thinking:
- Use numbered thoughts to trace each requirement: Discovery → PRD → Plan → Tasks
- If a thought reveals a gap, mark it as a REVISION point
- If a requirement could be traced multiple ways, use BRANCHING

### Step 5.1: Build Traceability Matrix

Extract requirements from DISCOVERY.md, extract tasks from section files, build the mapping.

### Step 5.2: Resolve Gaps

For each unmapped requirement, present options to user via `AskUserQuestion`.

### Step 5.3: Resolve Scope Creep

For each unmapped task, verify with user.

### Step 5.4: Hypothesis Verification (NEW - Clear Thought Enhancement)

Revisit hypotheses from Phase 2:
- For each hypothesis marked "supported", verify the plan actually implements the recommended approach
- For each hypothesis marked "refuted", verify the plan uses the alternative approach
- Document any misalignment

### Step 5.5: Generate Traceability Table

Write `.ultraplan/VALIDATE.md` with full traceability matrix and hypothesis verification results.

### Step 5.6: Final User Approval

Present summary and get approval to proceed.

### Step 5.7: Finalize Phase 5

Update STATE.md and proceed to Phase 6.

### Resume Behavior (Phase 5)

If `.ultraplan/VALIDATE.md` exists: skip to Phase 6.

---

## Phase 6: OUTPUT

**Purpose:** Produce final deliverables with visual summaries and prioritized execution guide.

**Progress format:** `Phase 6/6: OUTPUT [========  ] 80% - Writing summary...`

### Before Starting

1. Read `{plugin_root}/skills/ultraplan-ct/references/output-format.md` for file format specifications.
2. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/visual-reasoning.md` -- For summary diagrams.
3. Read `{plugin_root}/skills/ultraplan-ct/references/thinking/mental-models.md` -- For Pareto prioritization.

### Step 6.1: Finalize All Files

Ensure every output file exists and is internally consistent.

### Step 6.2: Generate SUMMARY.md with Diagrams (ENHANCED)

Create `.ultraplan/SUMMARY.md` using the template, PLUS:

**Visual Enhancement:**
- Include a simple ASCII architecture diagram
- Include a batch execution flow diagram

**Pareto Enhancement:**
- Apply Pareto Principle (80/20) to identify the 20% of sections that deliver 80% of value
- Highlight these as "Critical Path - Build These First" in the execution guide

### Step 6.3: Finalize STATE.md

Update with completion status and full session history.

### Step 6.4: Present Completion

Print the completion banner:

```
================================================================
ULTRAPLAN CT COMPLETE
================================================================

Your plan is ready! Enhanced with 11 thinking frameworks.

.ultraplan/
  PRD.md          - Your product requirements (plain English)
  PLAN.md         - Technical plan + architecture diagrams
  RESEARCH.md     - Research findings + decision matrices
  DISCOVERY.md    - Pre-discovery analysis + Q&A transcript
  VALIDATE.md     - Traceability matrix + hypothesis verification
  STATE.md        - Session state (for resume/updates)
  SUMMARY.md      - One-page cheat sheet with diagrams
  sections/
    index.md      - Section manifest
    section-01-*  - {section 1 name} [{risk color}]
    section-02-*  - {section 2 name} [{risk color}]
    ...

Total: {N} sections, {M} tasks
Thinking frameworks applied: 11

----------------------------------------------------------------
WHAT TO DO NEXT
----------------------------------------------------------------

CRITICAL PATH (highest-value sections):
  {list of Pareto-identified sections}

To start building:
  Give the .ultraplan/ folder to any AI coding tool and say:
  "Read .ultraplan/sections/index.md and execute section 1"

To update this plan:
  Run: /ultraplan-ct update

To view the summary:
  Read: .ultraplan/SUMMARY.md
================================================================
```

### Resume Behavior (Phase 6)

If `.ultraplan/SUMMARY.md` exists: the plan is already complete. Show the completion banner again.

---

## UPDATE COMMAND

**Triggered by:** `/ultraplan-ct update`

### Before Starting

1. Check if `.ultraplan/` directory exists. If not, tell user to run `/ultraplan-ct` first.
2. Check if STATE.md shows "complete" status. If not, suggest resuming.
3. Read `{plugin_root}/skills/ultraplan-ct/references/update-protocol.md` for detailed update behavior.

### Behavior

1. Ask what changed via `AskUserQuestion`
2. Gather change details (3-8 follow-up questions)
3. Identify affected sections (direct + dependency impact)
4. Regenerate ONLY affected sections (never regenerate the entire plan)
5. Update traceability in VALIDATE.md
6. Log change in STATE.md
7. Regenerate SUMMARY.md
8. Present change summary

---

## STATUS COMMAND

**Triggered by:** `/ultraplan-ct status`

Read `.ultraplan/STATE.md` and present current status with progress bar, file manifest, and session history.

---

## Resuming After Compaction

**CRITICAL:** When resuming after context compaction:

1. **ALWAYS read STATE.md first** to determine current position
2. **ALWAYS read the reference file for your current phase before proceeding**
   - Phase 1: Read understand-protocol.md + mental-models.md + metacognitive-monitoring.md
   - Phase 2: Read research-protocol.md + scientific-method.md + decision-framework.md
   - Phase 3: Read prd-writing.md + plan-writing.md + design-patterns.md + programming-paradigms.md + visual-reasoning.md
   - Phase 4: Read review-checklist.md + collaborative-reasoning.md + debugging-approaches.md + metacognitive-monitoring.md
   - Phase 5: Read validate-protocol.md + sequential-thinking.md + scientific-method.md
   - Phase 6: Read output-format.md + visual-reasoning.md + mental-models.md
3. **NEVER skip phases**
4. **Use file existence to determine resume point**
5. **Get `{plugin_root}` by locating this SKILL.md file**
6. **All user interactions use `AskUserQuestion`** with multiple-choice options

---

## Key Rules (Always Apply)

1. **Plain English everywhere.** The target user is a no-coder. Never use technical jargon in user-facing text.

2. **AskUserQuestion for ALL user input.** Always provide multiple-choice with a recommended first option.

3. **Auto-save after every batch/step.** Never lose progress.

4. **Progress indicators after every meaningful step.**

5. **Non-destructive updates.** `/ultraplan-ct update` NEVER regenerates the full plan.

6. **Sections are the atomic unit.** Each section is self-contained with XML tasks, TDD stubs, risk rating, and dependency info.

7. **Discovery is exhaustive.** 40-70 questions across 9 categories.

8. **Research is parallel.** Always launch 3 subagents simultaneously.

9. **PRD approval is incremental.** One section at a time.

10. **Review is multi-perspective.** 3 review personas + 8-category checklist + pre-mortem debugging.

11. **Validation is bidirectional.** Requirements-to-tasks AND tasks-to-requirements.

12. **State is always saved.** STATE.md is the source of truth for resume.

13. **Thinking frameworks are applied, not just read.** When a phase says to use a framework, produce the structured output format defined in the framework reference file.
