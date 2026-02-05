# UltraPlan

**From plain-English idea to AI-executable implementation plan.**

---

## What It Does

UltraPlan is a Claude Code plugin that turns your idea into a complete, ready-to-build plan -- all from a single command. You describe what you want in everyday language, and UltraPlan asks you thorough questions, researches the best approaches, writes a detailed plan, reviews it for gaps, and hands you a set of files that any AI coding tool can follow to build your project. No coding knowledge required. No technical jargon. Just your idea and your answers.

---

## How It Works

```
  UNDERSTAND       RESEARCH         PLAN           REVIEW         VALIDATE        OUTPUT
      |                |              |               |               |              |
  Ask you 40-70    Investigate    Write your      Check the      Make sure       Hand you
  questions to     best tools,    product spec    plan for       every single    the finished
  deeply learn     practices,     and step-by-    gaps, edge     requirement     files, ready
  what you want    and similar    step build      cases, and     is covered      to build
                   products       instructions    ask you the    in the plan
                                                  tricky
                                                  questions
```

**What you do:** Answer multiple-choice questions and approve sections as they are written. Every question comes with a recommended answer, so you can move quickly even if you are unsure.

**What the system does:** Everything else -- research, writing, reviewing, and organizing. You get a complete set of planning files at the end.

---

## Quick Start

```
/ultraplan I want to build a recipe sharing app
```

Here is what happens next:

1. **Discovery questions begin.** UltraPlan asks you 40-70 multiple-choice questions across 9 topic areas: what the app does, who uses it, how it should look, how you want to make money, and more. Each question has a recommended answer you can pick if you are not sure.

2. **Research runs automatically.** Three research agents work in parallel -- one scans your existing code (if any), one searches the web for best practices, and one pulls up-to-date library documentation. You review a plain-English summary of findings before moving on.

3. **Your plan is written section by section.** First a product spec in plain English, then a technical plan broken into small, ordered sections. You approve each part before the next one is written.

4. **The plan is reviewed and stress-tested.** The system checks for missing features, edge cases, security issues, and over-complexity. Then it asks you 5-10 tricky "what if" questions you probably had not thought about.

5. **Every requirement is validated.** A traceability check confirms that every answer you gave maps to a specific part of the plan. Nothing is forgotten. Nothing extra sneaks in.

6. **You receive your finished files.** A complete `.ultraplan/` folder with everything an AI coding tool needs to start building.

---

## Installation

### Via Marketplace (Recommended)

```
/plugin marketplace add ultraplan
/plugin install ultraplan
/plugin enable ultraplan
```

### Manual Installation

```
git clone https://github.com/ultraplan/ultraplan.git /path/to/ultraplan
```

Then add the plugin path to your Claude Code `settings.json` under the `plugins` array.

---

## Commands

| Command | What It Does |
|---------|-------------|
| `/ultraplan [your idea]` | Start a full planning session from scratch. Runs all 6 phases. |
| `/ultraplan update` | Change an existing plan. Asks what changed and only regenerates the parts that are affected -- everything else stays exactly the same. |
| `/ultraplan status` | Show where you left off if you are in the middle of a session. |

---

## What It Produces

When UltraPlan finishes, you will find a `.ultraplan/` folder in your project with these files:

```
.ultraplan/
    SUMMARY.md           One-page cheat sheet (start here)
    PRD.md               Your product requirements in plain English
    PLAN.md              Master technical plan and architecture overview
    RESEARCH.md          Research findings and recommendations
    DISCOVERY.md         Complete record of all questions and your answers
    VALIDATE.md          Proof that every requirement is covered in the plan
    STATE.md             Session data (used for resume and updates)
    sections/
        index.md         List of all sections with order and dependencies
        section-01-*.md  First build section
        section-02-*.md  Second build section
        ...              One file per section
```

---

## Output File Descriptions

| File | What Is Inside | Who Should Read It |
|------|----------------|-------------------|
| **SUMMARY.md** | A one-page overview of your entire project: what it is, key features, risk areas, and step-by-step instructions for how to start building. | You (start here). |
| **PRD.md** | Your product requirements written in everyday language. Covers what you are building, who it is for, what it does, what it does not do, and how you will know it works. | You, and anyone you want to share the vision with. |
| **PLAN.md** | The master technical plan with architecture decisions, section index, and review notes. | The AI coding tool that will build your project. |
| **RESEARCH.md** | Everything learned during the research phase: technology recommendations, best practices, competitor insights, and library documentation. | Reference -- check this if you want to understand why certain tools were recommended. |
| **DISCOVERY.md** | The complete transcript of all questions asked and answers given, organized by topic area. | Audit trail -- useful if you want to remember why a decision was made. |
| **VALIDATE.md** | A traceability table that maps every requirement from discovery to a specific section and task in the plan. Shows that nothing was missed. | Quality check -- glance at this to confirm full coverage. |
| **STATE.md** | Session tracking data: which phase you are on, session history, and a log of any updates made. | The system uses this for auto-resume. You do not need to read it. |
| **sections/index.md** | A manifest listing every section by number, name, risk level, and which sections depend on which. | The AI coding tool reads this to know what to build and in what order. |
| **sections/section-NN-*.md** | Individual build sections containing step-by-step tasks, test cases, file lists, and completion criteria. Each section is a self-contained unit of work. | The AI coding tool executes these one at a time. |

---

## Configuration

UltraPlan ships with sensible defaults in `config.json`. Here are the key settings you might want to know about:

| Setting | Default | What It Controls |
|---------|---------|-----------------|
| `discovery.min_questions` | 40 | Minimum number of questions asked during discovery |
| `discovery.max_questions` | 70 | Maximum number of questions asked during discovery |
| `discovery.batch_size` | 4 | How many related questions are asked at a time |
| `discovery.categories` | 9 | Number of topic areas covered in discovery |
| `research.parallel_subagents` | 3 | Number of research agents that run simultaneously |
| `plan.section_approval` | incremental | Whether you approve the plan section by section |
| `plan.risk_assessment` | true | Whether each section gets a risk rating (green/yellow/red) |
| `review.refinement_questions.min` | 5 | Minimum "what if" questions asked during review |
| `review.refinement_questions.max` | 10 | Maximum "what if" questions asked during review |
| `output.directory` | .ultraplan | Folder name where all output files are saved |
| `output.auto_resume` | true | Whether the system picks up where you left off automatically |

See `config.json` in the plugin root for the full list of options.

---

## Source Skills

UltraPlan was built by combining the best ideas from 8 existing planning skills:

| # | Source Skill | What UltraPlan Takes From It |
|---|-------------|------------------------------|
| 1 | **CCPM** (Claude Code PM) | Product requirements structure, feature grouping, task format ready for development tools |
| 2 | **deep-plan** | Splitting plans into sections, test-first design, multi-phase pipeline, research protocols |
| 3 | **GSD** (Get Shit Done) | Smart context handling, small atomic tasks, saving progress, running agents in parallel, session resume |
| 4 | **ralph-clarify** | The thorough 40-70 question discovery loop, 7 question categories, pressure to keep asking until coverage is complete |
| 5 | **requirements-builder** | Awareness of existing code, smart default answers, two-phase discovery, automatic code analysis |
| 6 | **interview-me-for-plan** | Non-obvious follow-up questions that catch things you would not think to mention |
| 7 | **everything-claude-code:plan** | Risk rating per section (green/yellow/red), step-by-step planning structure |
| 8 | **superpowers:brainstorming** | Comparing different approaches, approving the plan one section at a time |

---

## FAQ

**How long does planning take?**
It depends on the complexity of your idea. A simple app might take 20-30 minutes. A complex platform with many features could take 60-90 minutes. Most of that time is you answering discovery questions (40-70 of them). The research, planning, and review phases run mostly on their own.

**Can I stop in the middle and come back later?**
Yes. UltraPlan saves your progress automatically after every batch of questions. When you run `/ultraplan` again, it picks up exactly where you left off. No work is lost.

**Can I change the plan after it is finished?**
Yes. Run `/ultraplan update` and describe what changed. The system will ask you a few follow-up questions, then regenerate only the affected sections. Everything else stays exactly as it was.

**What if I do not know the answer to a question?**
Every question comes with a recommended option clearly marked. If you are unsure, just pick the recommended one. You can always change your mind later with `/ultraplan update`.

**Do I need to know how to code?**
No. Everything is written in plain English. The technical details are handled automatically and placed in files designed for AI coding tools to read -- not you.

**What do I do with the plan once it is finished?**
Open any AI coding tool (Claude Code, Cursor, Windsurf, etc.), share the `.ultraplan/` folder, and say: "Read `.ultraplan/sections/index.md` and execute section 1." Then work through sections one at a time. The SUMMARY.md file has full instructions.

**Does it work with an existing project or only new ones?**
Both. If you already have code, UltraPlan detects it automatically, analyzes your existing patterns and tools, and adapts its questions and plan to fit what you already have.

**What are the 9 question categories?**
Core Requirements, Users & Context, Integration Points, Edge Cases, Quality Attributes, Existing Patterns, Preferences & Tradeoffs, Monetization & Business Model, and Visual & UX Vision.

---

## License

MIT
