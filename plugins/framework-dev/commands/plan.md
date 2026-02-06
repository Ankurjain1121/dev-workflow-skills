---
description: Quick 3-step planning for smaller projects. Skips the full 6-phase ceremony when you need a lightweight plan.
argument-hint: "[project description]"
allowed-tools: WebSearch, WebFetch, Read, Write, AskUserQuestion, TodoWrite
---

# Quick Plan Command

A condensed planning workflow for smaller projects that don't need full 6-phase orchestration.

## When to Use

- Small to medium projects (1-3 modules)
- Solo developer (no multi-agent coordination needed)
- Time-constrained planning sessions
- Projects where you already know the tech stack

For larger projects, use `/framework-dev` instead.

## 3-Step Workflow

$ARGUMENTS

### Step 1: Discover & Decide (5 min)

Ask the user:
1. What problem does this solve and who uses it?
2. What's your preferred tech stack? (or should I recommend one?)

Then:
- Research any uncertain technology choices with WebSearch
- Create `specs/[project]/design.md` with:
  - Vision statement
  - Core modules (keep it to 3-5)
  - Tech stack with rationale
  - Key decisions with sources

### Step 2: Define Contracts (10 min)

- Define API endpoints (contract-first)
- Create `specs/[project]/api-contracts.md`
- List all modules with file paths in `specs/[project]/modules.md`
- **Get user approval before proceeding**

### Step 3: Plan Implementation (5 min)

- Order tasks by dependencies
- Create `specs/[project]/implementation-order.md`
- Suggest: use `/orchestrate` or `/implement` to execute

## Output

```
specs/[project]/
├── design.md
├── api-contracts.md
├── modules.md
└── implementation-order.md
```

Compatible with `/orchestrate` and `/implement`.

## Example

```
/plan Build a bookmark manager with tagging and search
```
