# /ultraplan - Design Specification

## Overview

**UltraPlan** is a single-command Claude Code plugin that takes a no-coder from a plain-English idea description to a complete, AI-executable implementation plan through 6 automated phases.

The user types `/ultraplan I want to build a recipe sharing app` and the system handles everything: exhaustive questioning, parallel research, structured planning with risk assessment, self-review, traceability validation, and dual-format output (human-readable PRD + AI-executable section files).

---

## Source Skills & Attribution

UltraPlan combines the best parts of 8 planning skills:

| # | Source Skill | What UltraPlan Takes From It |
|---|-------------|------------------------------|
| 1 | **CCPM** (Claude Code PM) | PRD structure, epic decomposition, GitHub-ready task format |
| 2 | **deep-plan** | Section splitting, TDD stubs, multi-phase planning pipeline, research protocols |
| 3 | **GSD** (Get Shit Done) | Context engineering, XML atomic tasks, state management, parallel subagents, session resume, progress tracking |
| 4 | **ralph-clarify** | Exhaustive 40-70 question discovery loop, 7 question categories, loop pressure against premature stopping |
| 5 | **requirements-builder** | Codebase-aware questioning, smart defaults, two-phase discovery, autonomous code analysis |
| 6 | **interview-me-for-plan** | Non-obvious refinement questions, plan deepening through targeted interviews |
| 7 | **/everything-claude-code:plan** | Risk assessment per section, step-by-step planning structure |
| 8 | **superpowers:brainstorming** | Approach comparison, incremental section-by-section design validation |

---

## Target User

- **No-coder** with zero coding or software planning knowledge
- Provides ideas in plain English
- Will hand the finished plan to an AI coding tool for execution
- Will regularly update and iterate on plans as requirements change

---

## Commands

| Command | Purpose |
|---------|---------|
| `/ultraplan [idea]` | Main entry point: full 6-phase planning pipeline |
| `/ultraplan update` | Non-destructive plan updates: asks what changed, regenerates affected sections |
| `/ultraplan status` | Show current progress if mid-session |

---

## Pipeline

```
UNDERSTAND --> RESEARCH --> PLAN --> REVIEW --> VALIDATE --> OUTPUT
  (Phase 1)    (Phase 2)   (Phase 3) (Phase 4)  (Phase 5)  (Phase 6)
```

---

## Phase 1: UNDERSTAND

**Purpose:** Exhaustively gather requirements from the no-coder through structured questioning.

**Sources:** ralph-clarify (loop structure, categories), requirements-builder (codebase awareness, smart defaults), brainstorming (approach comparison)

### Behavior

1. **Codebase Detection**
   - Auto-scan project directory for existing code
   - If codebase exists: analyze stack, patterns, conventions BEFORE asking questions
   - Adapt questions based on what's found (e.g., "I see you use React + Supabase. Should this feature follow the same patterns?")
   - If no codebase: proceed as greenfield

2. **Question Format**
   - All questions use `AskUserQuestion` with multiple-choice options
   - First option is always the recommended choice, marked "(Recommended)"
   - 2-4 options per question
   - Plain English, zero technical jargon
   - User always has "Other" option for custom input

3. **Question Pacing**
   - Questions asked in batches of 2-4 related questions per AskUserQuestion call
   - Each batch covers a coherent topic area
   - After each batch: auto-save to DISCOVERY.md

4. **Question Count**
   - Fixed exhaustive: 40-70 questions total (ralph-clarify approach)
   - System MUST NOT stop early unless user explicitly says "enough"
   - Loop pressure: continue questioning until all 9 categories are thoroughly covered

5. **Question Categories** (9 total)

   | # | Category | What It Covers |
   |---|----------|----------------|
   | 1 | Core Requirements | What must this do? Minimum viable version? What's out of scope? |
   | 2 | Users & Context | Who uses this? Skill level? Environment? Devices? |
   | 3 | Integration Points | What systems does this connect to? Data flows? APIs? |
   | 4 | Edge Cases | What happens when things go wrong? Boundary conditions? |
   | 5 | Quality Attributes | Performance needs? Security? Reliability? |
   | 6 | Existing Patterns | (If codebase exists) How do similar things work here? Conventions? |
   | 7 | Preferences & Tradeoffs | Strong opinions? Simplicity vs flexibility vs performance? |
   | 8 | Monetization & Business Model | Free/paid? Subscriptions? Ads? Revenue model? |
   | 9 | Visual & UX Vision | How should it look? Feel? Layout? Key screens? Interactions? |

6. **Follow-up Questions**
   - On complex or ambiguous answers: automatically ask 1-2 follow-up questions to go deeper
   - On clear/simple answers: move to next question without follow-up
   - Follow-up questions do NOT count toward the 40-70 question total (they are bonus depth, not core coverage)
   - Example: User picks "Real-time features: Yes" --> follow up: "What kind? Chat, live updates, notifications, or collaboration?"

7. **Progress Indicator**
   - After each batch, show: `Phase 1/6: UNDERSTAND [=====     ] 45% - Category: Edge Cases (6/9 categories)`

8. **Early Stop**
   - If user says "enough", "stop", "move on": summarize what's been gathered, note gaps, proceed to Phase 2
   - System must note which categories were NOT fully covered in DISCOVERY.md

### Output

- File: `.ultraplan/DISCOVERY.md`
- Content: Complete Q&A transcript organized by category
- Includes: questions asked, user answers, follow-up details, categories covered, categories skipped (if any)

### Resume Behavior

- If `.ultraplan/DISCOVERY.md` exists when `/ultraplan` is re-run:
  - Read existing discovery
  - Detect last completed category
  - Resume from next category automatically

---

## Phase 2: RESEARCH

**Purpose:** Investigate solutions, best practices, and technical approaches based on discovery findings.

**Sources:** deep-plan (codebase + web research protocols), GSD (parallel subagents, Context7 integration)

### Behavior

1. **Topic Extraction**
   - Read DISCOVERY.md
   - Auto-extract research topics: technologies mentioned, patterns needed, integrations required, competitor products
   - No user input needed for topic selection

2. **Parallel Subagent Research**
   - Spawn 3 subagents simultaneously in a single message:

   | Subagent | Type | Purpose |
   |----------|------|---------|
   | Codebase Researcher | `Task(subagent_type=Explore)` | Analyze existing code for patterns, conventions, relevant files |
   | Web Researcher | `Task(subagent_type=general-purpose)` | Search web for best practices, current approaches, ecosystem state |
   | Docs Researcher | `Task(subagent_type=general-purpose)` | Use Context7 MCP to fetch current library docs for technologies mentioned |

   - If greenfield (no codebase): Codebase Researcher does tech stack comparison + competitor analysis instead
   - All 3 run in parallel, results collected when all complete

3. **Greenfield-Specific Research**
   - Tech stack recommendations: compare 2-3 options with pros/cons
   - Competitor analysis: find 3-5 similar products, analyze their approach
   - Present recommendations with clear reasoning in plain English

4. **Conflict Detection**
   - If research contradicts user's discovery answers:
     - Flag each conflict plainly: "You mentioned X but research shows Y is a better approach because Z"
     - Ask user to decide: keep original choice or switch to researched alternative
     - Use AskUserQuestion with options for each conflict

5. **User Review**
   - After research completes, show plain-English summary of key findings
   - Ask user: "Does this research align with your vision? Proceed to planning?"
   - Use AskUserQuestion with options: "Looks good, proceed" / "Research more on [topic]" / "I have concerns"

### Output

- File: `.ultraplan/RESEARCH.md`
- Content: Findings from all 3 subagents, organized by topic
- Includes: tech stack analysis, best practices found, competitor insights, library recommendations with Context7 sources

### Resume Behavior

- If `.ultraplan/RESEARCH.md` exists: skip to Phase 3

---

## Phase 3: PLAN

**Purpose:** Create both a human-readable PRD and AI-executable technical plan with sections.

**Sources:** CCPM (PRD structure), deep-plan (section splitting, TDD stubs), everything-claude-code:plan (risk assessment), GSD (XML atomic tasks), brainstorming (incremental section validation)

### Behavior

#### Step 3a: Generate PRD

1. **Language**: Plain English, zero jargon
   - Instead of "OAuth2 SSO integration" write "Login with Google/GitHub so users don't need a new password"
   - Instead of "WebSocket real-time sync" write "Changes appear instantly for everyone without refreshing"

2. **PRD Sections** (from CCPM structure):

   | Section | Content |
   |---------|---------|
   | What We're Building | 3-5 sentence summary anyone can understand |
   | The Problem | What problem this solves, why it matters |
   | Who It's For | User types, their needs, their experience level |
   | What It Does | Feature list in plain English, organized by priority |
   | How It Should Feel | Visual/UX vision from discovery |
   | What It Connects To | Integrations, data sources, external services |
   | What It Does NOT Do | Explicit scope boundaries |
   | How We'll Know It Works | Success criteria in measurable terms |
   | Business Model | Monetization approach from discovery |
   | Risks & Concerns | Top 3-5 risks in plain language |

3. **Section-by-Section Approval** (from brainstorming):
   - Present each PRD section (200-300 words) to user via AskUserQuestion
   - Options: "Looks right" / "Change this part" / "Remove this section" / "Add something"
   - If user says "Change": ask what to change, regenerate that section, re-present
   - Move to next section only after approval
   - Progress indicator: `Phase 3/6: PLAN - PRD Section 4/10: What It Does`

#### Step 3b: Generate Technical Plan

After PRD is fully approved:

1. **Section Splitting** (from deep-plan):
   - Analyze PRD features and derive technical implementation sections
   - Each section is a self-contained implementation unit
   - Sections ordered by dependency, independent sections grouped into parallel batches

2. **Section Format** (hybrid deep-plan sections + GSD XML tasks):

   ```markdown
   # Section 01: User Authentication

   ## Overview
   [Plain English description of what this section builds]

   ## Risk: [green/yellow/red] - [one-line risk summary]

   ## Dependencies
   - Depends on: [none / section-XX]
   - Blocks: [section-XX, section-YY]
   - Parallel batch: [batch number]

   ## TDD Test Stubs
   - Test: User can sign up with email and password
   - Test: User cannot sign up with duplicate email
   - Test: User can log in after signing up
   - Test: Invalid password shows error message

   ## Tasks

   <task type="auto" id="01-01">
     <name>Create user database table</name>
     <files>src/db/schema.ts, src/db/migrations/001-users.sql</files>
     <action>
       Create users table with id, email, password_hash, created_at.
       Add unique constraint on email (case-insensitive).
       Create migration file.
     </action>
     <verify>Migration runs without errors. Table exists in database.</verify>
     <done>Users table created with all required columns and constraints.</done>
   </task>

   <task type="auto" id="01-02">
     <name>Build signup endpoint</name>
     <files>src/api/auth/signup.ts, src/lib/password.ts</files>
     <action>
       Create POST /api/auth/signup endpoint.
       Validate email format and password strength.
       Hash password before storing.
       Return success with session token.
     </action>
     <verify>POST /api/auth/signup with valid data returns 200 and token.</verify>
     <done>Users can sign up. Duplicate emails rejected. Passwords hashed.</done>
   </task>
   ```

3. **Risk Assessment** (from everything-claude-code:plan):
   - Every section gets a risk rating:
     - Green: Straightforward, well-understood patterns
     - Yellow: Some complexity, may need iteration
     - Red: High uncertainty, novel approach, critical path
   - Risk factors considered: complexity, dependencies, security sensitivity, third-party reliance

4. **Task Types**:
   - `type="auto"` - Standard implementation task, executed by AI automatically
   - `type="checkpoint"` - Human review gate, pauses execution for user verification
     - Use sparingly: only for deployment verification, external service setup, or visual review
     - Format: `<task type="checkpoint" id="NN-MM"><name>Verify X</name><verify>What user should check</verify></task>`

5. **Task Granularity**:
   - Small atomic tasks: each touches 1-3 files
   - Each task has: name, files, action, verify, done criteria
   - Each task gets its own git commit when executed

6. **Section Index** (from deep-plan):
   - `.ultraplan/sections/index.md` with manifest of all sections
   - Lists: section number, name, risk, batch, dependency chain

### Output

- `.ultraplan/PRD.md` - Human-readable product requirements (plain English)
- `.ultraplan/PLAN.md` - Master technical plan (overview, architecture, section index)
- `.ultraplan/sections/index.md` - Section manifest with dependency/batch info
- `.ultraplan/sections/section-01-*.md` through `section-NN-*.md` - AI-executable sections

### Resume Behavior

- If `PRD.md` exists but no sections: resume from Step 3b
- If sections exist: skip to Phase 4

---

## Phase 4: REVIEW

**Purpose:** Critical self-review of the plan + non-obvious refinement questions to the user.

**Sources:** interview-me-for-plan (non-obvious questions), everything-claude-code:plan (checklist methodology)

### Behavior

#### Step 4a: Self-Review Checklist

Run 8-category quality checklist against all plan documents:

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

- Auto-fix issues where possible (e.g., add missing error handling task)
- Flag issues that need user decision

#### Step 4b: Show Review Summary

Present to user in plain English:
- Number of issues found per category
- What was auto-fixed
- What needs user decision (if any)

#### Step 4c: User Refinement Questions (interview-me style)

Ask 5-10 non-obvious questions the user probably didn't think about:
- Questions derived from gaps found in self-review
- Questions about tricky edge cases
- Questions about user experience details
- Format: AskUserQuestion with multiple-choice options + recommendations

Examples:
- "What happens if a user uploads a 50MB recipe photo? Should there be a size limit?"
- "If two users edit the same recipe at the same time, who wins?"
- "Should deleted recipes be permanently gone or recoverable for 30 days?"

#### Step 4d: Update Plan

- Integrate user answers into affected sections
- Re-run quick consistency check on modified sections only

### Output

- Updated `.ultraplan/sections/*.md` files
- Review log appended to `.ultraplan/PLAN.md` as "Review Notes" section

### Resume Behavior

- If PLAN.md contains "Review Notes" section: skip to Phase 5

---

## Phase 5: VALIDATE

**Purpose:** Cross-reference alignment: verify every discovery requirement traces to a plan section and vice versa.

**Sources:** Custom (inspired by everything-claude-code:plan's verification approach)

### Behavior

1. **Build Traceability Matrix**
   - Read DISCOVERY.md: extract every distinct requirement/answer
   - Read all section files: extract every task
   - Map: Requirement --> PRD Section --> Plan Section --> Task IDs
   - Flag any requirement that doesn't trace to at least one task
   - Flag any task that doesn't trace to a requirement (scope creep)

2. **Gap Detection**
   - For each unmapped requirement:
     - Present to user via AskUserQuestion:
       - "Your requirement [X] from discovery isn't in the plan. What should we do?"
       - Options: "Add it as a new section" / "Merge into existing section [Y]" / "It was actually out of scope" / "I changed my mind, remove it"

3. **Scope Creep Detection**
   - For tasks that don't map to any requirement:
     - Present to user: "The plan includes [X] but you didn't ask for it. Keep or remove?"
     - Options: "Keep it, it's needed" / "Remove it"

4. **Generate Traceability Table**

   ```markdown
   | # | Requirement (from Discovery) | PRD Section | Plan Section | Task IDs | Status |
   |---|------------------------------|-------------|--------------|----------|--------|
   | 1 | Users can create accounts    | What It Does | section-01   | 01-01, 01-02 | Covered |
   | 2 | Recipe photo uploads         | What It Does | section-03   | 03-01, 03-02, 03-03 | Covered |
   | 3 | Social sharing               | What It Does | --           | --       | MISSING |
   ```

5. **Final User Approval**
   - Show traceability summary
   - Ask: "All requirements are covered. Ready to generate final output?"
   - Options: "Yes, finalize" / "I want to add something" / "I want to change something"

### Output

- `.ultraplan/VALIDATE.md` - Traceability matrix + gap resolution log

### Resume Behavior

- If `VALIDATE.md` exists: skip to Phase 6

---

## Phase 6: OUTPUT

**Purpose:** Produce all final deliverable files and present completion summary.

**Sources:** GSD (state management, completion UX), deep-plan (section index finalization)

### Behavior

1. **Finalize All Files**
   - Ensure all 8 output files are written and consistent
   - Update STATE.md with completion status
   - Write SUMMARY.md one-pager

2. **Generate SUMMARY.md** (cheat sheet):

   ```markdown
   # UltraPlan Summary

   ## What We're Building
   [3 sentences from PRD]

   ## Key Features
   - [Bullet list of top features]

   ## Tech Stack
   - [Recommended stack from research]

   ## Risk Areas
   - [Red] [risk description]
   - [Yellow] [risk description]

   ## Plan Structure
   - [N] sections, [M] total tasks
   - [X] parallel batches
   - [Y] sequential dependencies

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

3. **Present Completion**:

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
       section-01-*  - [section name] [risk color]
       section-02-*  - [section name] [risk color]
       ...

   Total: [N] sections, [M] tasks

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

### Output

Full file suite:

| File | Purpose | Reader |
|------|---------|--------|
| `.ultraplan/PRD.md` | Product requirements in plain English | Human (no-coder) |
| `.ultraplan/PLAN.md` | Master technical plan + architecture | AI executor + technical humans |
| `.ultraplan/RESEARCH.md` | Research findings, tech stack analysis | Reference |
| `.ultraplan/DISCOVERY.md` | Complete Q&A transcript (40-70 questions) | Audit trail |
| `.ultraplan/VALIDATE.md` | Traceability matrix: requirements --> tasks | Quality assurance |
| `.ultraplan/STATE.md` | Session state, current position, resume data | System (auto-resume) |
| `.ultraplan/SUMMARY.md` | One-page cheat sheet for sharing | Human (no-coder) |
| `.ultraplan/sections/index.md` | Section manifest with dependencies + batches | AI executor |
| `.ultraplan/sections/section-*.md` | AI-executable sections with XML tasks + TDD | AI executor |

---

## /ultraplan update Command

**Purpose:** Non-destructive plan updates when requirements change.

### Behavior

1. Read existing `.ultraplan/` files
2. Ask user: "What changed?" via AskUserQuestion
   - Options: "Add a new feature" / "Remove a feature" / "Change how something works" / "Change priorities" / "Other"
3. Based on answer, ask follow-up questions (5-10) about the specific change
4. Identify which sections are affected by the change
5. Regenerate ONLY affected sections + update PRD + update traceability
6. Show diff summary: "Changed sections: [list]. Unchanged: [list]."
7. Update STATE.md with change log

### Key Principle

- NEVER regenerate the entire plan
- Only touch what's affected
- Preserve all unaffected sections exactly as they are
- Log every change in STATE.md for audit trail

---

## STATE.md Format

```markdown
# UltraPlan State

## Current Position
Phase: [1-6] of 6
Status: [in_progress / complete]
Last activity: [date] - [description]

## Progress
[======    ] Phase 3/6: PLAN - Section 4/8

## Session History
| Date | Action | Details |
|------|--------|---------|
| 2026-02-05 | Created | /ultraplan recipe sharing app |
| 2026-02-05 | Phase 1 | UNDERSTAND complete: 52 questions, 9 categories |
| 2026-02-05 | Phase 2 | RESEARCH complete: 3 subagents, tech stack recommended |

## Change Log (from /ultraplan update)
| Date | What Changed | Sections Affected |
|------|-------------|-------------------|
| (empty until first update) |
```

---

## Plugin Structure

```
ultraplan/
  .claude-plugin/
    plugin.json               # Plugin metadata
    marketplace.json           # Marketplace listing
  skills/
    ultraplan/
      SKILL.md                 # Main skill definition (6 phases)
      references/
        understand-protocol.md  # Phase 1 detailed instructions
        research-protocol.md    # Phase 2 detailed instructions
        plan-writing.md         # Phase 3 plan generation rules
        prd-writing.md          # Phase 3 PRD generation rules
        review-checklist.md     # Phase 4 8-category checklist
        validate-protocol.md    # Phase 5 traceability rules
        output-format.md        # Phase 6 file format specs
        xml-task-format.md      # XML task schema reference
        update-protocol.md      # /ultraplan update behavior
      templates/
        discovery.md            # DISCOVERY.md template
        research.md             # RESEARCH.md template
        prd.md                  # PRD.md template
        plan.md                 # PLAN.md template
        section.md              # Section file template
        validate.md             # VALIDATE.md template
        state.md                # STATE.md template
        summary.md              # SUMMARY.md template
  agents/
    codebase-researcher.md      # Subagent: analyze existing code
    web-researcher.md           # Subagent: search web for best practices
    docs-researcher.md          # Subagent: fetch library docs via Context7
    section-writer.md           # Subagent: write individual sections (parallel)
  hooks/
    hooks.json                  # Session start/stop hooks for STATE.md
  README.md                     # Documentation
  LICENSE                       # MIT
  config.json                   # Default configuration
```

---

## Configuration (config.json)

```json
{
  "discovery": {
    "min_questions": 40,
    "max_questions": 70,
    "batch_size": 4,
    "categories": 9,
    "auto_followup": true,
    "codebase_detection": true
  },
  "research": {
    "parallel_subagents": 3,
    "web_search": true,
    "context7": true,
    "codebase_scan": true,
    "competitor_analysis": true
  },
  "plan": {
    "prd_language": "plain_english",
    "section_approval": "incremental",
    "tdd_stubs": true,
    "risk_assessment": true,
    "task_granularity": "atomic",
    "xml_tasks": true,
    "dependency_ordering": true,
    "parallel_batches": true
  },
  "review": {
    "checklist_categories": 8,
    "refinement_questions": {
      "min": 5,
      "max": 10
    },
    "show_changes": true
  },
  "validate": {
    "traceability_matrix": true,
    "flag_missing_requirements": true,
    "flag_scope_creep": true
  },
  "output": {
    "directory": ".ultraplan",
    "summary_cheatsheet": true,
    "state_management": true,
    "auto_resume": true
  },
  "progress": {
    "show_indicator": true,
    "format": "Phase {n}/6: {name} [{bar}] {pct}%"
  }
}
```

---

## Decision Log

All design decisions made during brainstorming session:

| # | Decision | Choice | Alternatives Considered |
|---|----------|--------|------------------------|
| 1 | Target user | No-coder, plain English input | Technical users, PMs |
| 2 | End goal | Complete plan doc for AI execution | Plan + code, Plan + GitHub issues |
| 3 | UX style | Structured from start, multiple-choice | Conversational, hybrid, template |
| 4 | Command model | Single command: /ultraplan | Two commands, multiple phases |
| 5 | Discovery depth | Fixed 40-70 exhaustive (ralph-style) | Adaptive 30-50, minimal 5-8 |
| 6 | LLM review | Self-review only | External LLM, optional review |
| 7 | Plan format | XML tasks + unified PRD/sections | Single format, epic decomposition |
| 8 | File location | .ultraplan/ in project root | .planning/, .claude/plans/ |
| 9 | Phase structure | 6 phases (added VALIDATE) | 5 phases, 7 phases |
| 10 | Question format | Multiple choice with recommendations | Yes/No, open-ended, mixed |
| 11 | Question pacing | Batches of 2-4 related questions | One at a time, all at once |
| 12 | Question categories | 9 (7 ralph + Monetization + Visual/UX) | 7 original, simplified 5 |
| 13 | Progress saving | Auto-save after each batch | End of phase, save + progress bar |
| 14 | Codebase awareness | Auto-detect and adapt | Always fresh, ask user |
| 15 | Follow-ups | On complex/ambiguous answers only | Never, always |
| 16 | Research trigger | Auto-detect topics from discovery | User picks, research everything |
| 17 | Research method | 3 parallel subagents | Sequential, web only |
| 18 | Greenfield research | Tech stack + competitor analysis | Stack only, competitors only |
| 19 | Research review | Show summary, ask to proceed | Full doc, skip review |
| 20 | Research conflicts | Flag issues, suggest alternatives | Silent adjust, list all |
| 21 | Research output | Separate RESEARCH.md file | Merged, both |
| 22 | PRD order | PRD first, then technical plan | Tech first, simultaneous |
| 23 | PRD language | Plain English, zero jargon | Business language, standard PRD |
| 24 | PRD review | Section-by-section approval | All at once, critical sections only |
| 25 | Tech plan format | Sections with XML tasks inside | Single file, epic decomposition |
| 26 | TDD stubs | Included per section | Separate file, no TDD |
| 27 | Risk assessment | Risk-rated per section (G/Y/R) | Overall only, no risk |
| 28 | Section ordering | Dependency-based with parallel batches | Priority order, auto-optimize |
| 29 | Task granularity | Small atomic (1-3 files each) | Medium, one per section |
| 30 | Self-review method | 8-category checklist + gap analysis | Adversarial, simple consistency |
| 31 | Review transparency | Show summary of changes | Full diff, don't show |
| 32 | Refinement questions | 5-10 non-obvious (interview-me style) | Only on gaps, no questions |
| 33 | Validate purpose | Cross-reference Discovery/PRD/Plan | Feasibility, user walkthrough, all 3 |
| 34 | Missing req action | Flag and ask user to decide | Auto-add, log as gap |
| 35 | Traceability matrix | Yes, table in VALIDATE.md | Embedded metadata, no matrix |
| 36 | Output files | Full 8-file suite | Essential 4, single mega-doc |
| 37 | Completion UX | Plain English summary + next steps | File list only, auto-suggest command |
| 38 | Update support | /ultraplan update command | Re-run from scratch, manual edit |
| 39 | Session resume | Auto-resume from last phase | Ask resume/fresh, no resume |
| 40 | Cheat sheet | SUMMARY.md one-pager | No extra file, ASCII diagram |
| 41 | Packaging | Claude Code plugin | Slash commands, both |
| 42 | Subagents | 3 parallel for research | Sequential, research + sections |
| 43 | Progress UX | Phase progress indicator | Phase transitions only, verbose |
| 44 | Follow-up counting | Follow-ups do NOT count toward 40-70 total | Count them, no follow-ups |
| 45 | Checkpoint task type | Supported (type="checkpoint") for human review gates | Auto-only tasks |
