# Small Circle Enforcement

> Imported during Phase 5 (Execution). Prevents scope sprawl.

## Sequential Task Verification
You are **FORBIDDEN** from starting Task B until Task A is verified as "Working" via:
- A successful test run (automated)
- Manual confirmation from user
- Build/lint passing

**NO EXCEPTIONS. One task at a time.**

## PR-Sized Chunks
If a user asks for a feature that spans multiple modules:
1. Break it into the smallest possible PR-sized chunks
2. Each chunk must be independently testable
3. Update `progress-tracker.md` after EACH chunk
4. Get user confirmation before moving to next chunk

## State Snapshot at 50%
When any Phase reaches 50% completion:
1. Generate `state-summary-phase-N.md` with critical details
2. Include: variable names, port numbers, non-standard paths, API quirks
3. This survives chat compaction
