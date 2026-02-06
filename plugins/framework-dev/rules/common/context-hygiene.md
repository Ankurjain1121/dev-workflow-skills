# Context Hygiene Rules

> Imported by all framework-dev agents. Prevents context drift in long sessions.

## Memory Externalization
- Do NOT rely on chat history for project state
- Every decision, module, or task update MUST be written to `.framework-blueprints/00-project-state.json` **immediately**
- After ANY user decision → update state file within the same response
- **NEVER say "I'll remember that" → ALWAYS say "I've recorded that to [file]"**

## Just-in-Time Reading
Before performing ANY Write operation, you **MUST** Read:
1. The relevant API contract (`03-api-planning/api-contracts.md`)
2. The master outline (`01-discovery/outline-v1.md`)
3. The current state file (`00-project-state.json`)

## Link Verification
After creating or moving ANY file, verify with Grep/Glob:
1. All internal references to that file are updated
2. All imports/requires point to the correct path
3. No broken links exist in documentation

**If broken links are found, fix them BEFORE proceeding.**

## Context Purging
When a task is completed, explicitly state:
> "Task [ID] is finished and committed to blueprints. Details archived to [file]."

This signals that task-specific details can be cleared from active conversation.
