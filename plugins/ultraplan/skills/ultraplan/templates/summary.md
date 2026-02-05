# UltraPlan Summary: {PROJECT_NAME}

> One-page cheat sheet | Generated: {TIMESTAMP}
> This is your quick reference. For details, see the full files in .ultraplan/

---

## What We're Building

{SUMMARY_WHAT_BUILDING}

<!-- 3 sentences max. Pulled from PRD Section 1. Plain English. -->

---

## Key Features

{KEY_FEATURES_LIST}

<!-- Bullet list of top features from PRD Section 4 (What It Does).
     Format:
     - Feature name: one-sentence description
     - Feature name: one-sentence description
-->

---

## Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
{TECH_STACK_SUMMARY_TABLE}

<!-- Simplified tech stack from RESEARCH.md / PLAN.md -->

---

## Risk Areas

<!-- Color-coded risk summary. Lists only Yellow and Red risk sections. -->

{RISK_AREAS_LIST}

<!-- Format:
     - [Red] Section name: risk description
     - [Yellow] Section name: risk description
     - If all green: "All sections are low risk (green). No major concerns."
-->

---

## Plan Structure

- **Sections:** {TOTAL_SECTIONS}
- **Total tasks:** {TOTAL_TASKS}
- **Parallel batches:** {TOTAL_BATCHES}
- **Sequential dependencies:** {SEQUENTIAL_DEPS}

### Batch Overview

{BATCH_OVERVIEW}

<!-- Format:
     Batch 1: Section 01 (name), Section 02 (name) -- run together
     Batch 2: Section 03 (name) -- depends on Batch 1
     Batch 3: Section 04 (name), Section 05 (name) -- run together, depends on Batch 2
-->

---

## How to Execute This Plan

<!-- Step-by-step instructions written for a no-coder who will hand this
     to an AI coding tool. Keep it dead simple. -->

1. Open any AI coding tool (Claude Code, Cursor, Copilot, etc.)
2. Share the `.ultraplan/` folder with it
3. Say: **"Read .ultraplan/PLAN.md and .ultraplan/sections/index.md, then execute section 1"**
4. After each section completes, say: **"Execute section [next number]"**
5. Sections in the same batch can be run in parallel (at the same time)
6. After all sections are done, run the tests to make sure everything works

### Batch Execution Guide

{BATCH_EXECUTION_GUIDE}

<!-- Format:
     Step 1: Execute Batch 1 (sections 01, 02) -- these can run at the same time
     Step 2: Wait for Batch 1 to finish
     Step 3: Execute Batch 2 (section 03)
     Step 4: Wait for Batch 2 to finish
     ...
-->

---

## How to Update This Plan

If your requirements change after this plan was created:

1. Run: **`/ultraplan update`**
2. Describe what changed (add feature, remove feature, change how something works)
3. UltraPlan will ask a few follow-up questions
4. Only the affected sections will be regenerated -- everything else stays the same
5. Check the Change Log in `.ultraplan/STATE.md` for a history of all updates

---

## Quick Links

| Document | What It Contains |
|----------|-----------------|
| `.ultraplan/PRD.md` | Product requirements in plain English |
| `.ultraplan/PLAN.md` | Full technical plan with architecture |
| `.ultraplan/RESEARCH.md` | Research findings and tech stack analysis |
| `.ultraplan/DISCOVERY.md` | Complete Q&A transcript ({TOTAL_QUESTIONS} questions) |
| `.ultraplan/VALIDATE.md` | Requirement traceability matrix |
| `.ultraplan/STATE.md` | Session state and change log |
| `.ultraplan/sections/index.md` | Section manifest with dependencies |
| `.ultraplan/sections/section-*.md` | Individual executable sections |
