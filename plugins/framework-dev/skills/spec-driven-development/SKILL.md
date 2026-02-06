---
name: spec-driven-development
description: Use when generating specs/ compatible output after Phase 3, enabling handoff to /orchestrate or /implement workflows.
allowed-tools: Read, Write, Glob
---

# Spec-Driven Development Integration

After Phase 3 (Planning) produces API contracts and a coding sequence, this skill generates a `specs/` directory compatible with `/orchestrate` and `/implement` workflows.

---

## When to Use

Invoke after Phase 3 approval when the user wants to:
- Hand off implementation to `/orchestrate` for parallel execution
- Generate a structured spec for `/implement` to follow
- Create a standalone design document for external teams

---

## Output Structure

Generate `specs/[project-name]/` with:

```
specs/[project-name]/
├── design.md              # Architecture overview + key decisions
├── api-contracts.md       # Copy of 03-api-planning/api-contracts.md
├── modules.md             # Module list with file ownership
├── implementation-order.md # From coding-sequence.md
└── constraints.md         # Non-standard paths, API quirks, env vars
```

---

## design.md Template

```markdown
# [Project Name] - Design Specification

## Overview
[One paragraph from Phase 1 vision statement]

## Architecture
[Pattern chosen in Phase 2 with rationale]

## Modules

| Module | Purpose | Owner | Files |
|--------|---------|-------|-------|
| [name] | [purpose] | [agent/unassigned] | [file paths] |

## Key Decisions
| ID | Decision | Rationale | Source |
|----|----------|-----------|--------|
| D001 | [decision] | [why] | [URL] |

## Constraints
- [Non-standard paths]
- [API quirks]
- [Required environment variables]
```

---

## modules.md Template

```markdown
# Module Ownership

> ONE FILE = ONE OWNER. No shared ownership.

| File Path | Module | Owner | Status |
|-----------|--------|-------|--------|
| src/auth/middleware.ts | Auth | unassigned | pending |
| src/users/controller.ts | Users | unassigned | pending |
```

---

## Generation Steps

1. Read `01-discovery/outline-v1.md` for vision
2. Read `01-discovery/decisions-log.md` for key decisions
3. Read `02-structure/module-hierarchy.md` for module list
4. Read `03-api-planning/api-contracts.md` for API specs
5. Read `03-api-planning/coding-sequence.md` for implementation order
6. Read `00-project-state.json` for critical details
7. Generate all spec files

---

## Compatibility

The generated specs are compatible with:
- `/orchestrate` - reads `modules.md` for file ownership, `implementation-order.md` for sequencing
- `/implement` - reads `design.md` for architecture context, `api-contracts.md` for endpoints
- External teams - standalone documentation that doesn't require framework-dev plugin
