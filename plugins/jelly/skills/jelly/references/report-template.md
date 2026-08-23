# Jelly — prior art: <MODULE>

**Benchmarked:** <YYYY-MM-DD> · **Stack detected:** <e.g. TypeScript / Next.js App Router / Drizzle>
**Our implementation:** `<primary paths>`
**Channels used:** <gh search · grep.app · Exa> — **unavailable this run:** <none | which, and why>
**Citations verified:** <N/M passed `references/verify-citations.py` — see SKILL.md §9>

State channel availability honestly. A rate-limited channel is "could not look", never "nothing
found"; a reader cannot tell the difference from the results alone.

## The five

| # | Project | Stars | Licence | Last push | Stack | Why it made the cut |
|---|---|---|---|---|---|---|
| 1 | [owner/repo](url) | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

**Considered and cut:** <project — reason (archived 2023 / wrapper only, no own implementation /
feature not actually present, checked `path/file.ts`)>. List every one. A top five with no visible
floor cannot be argued with.

**Files actually read** — what separates a benchmark from a README summary. Permalinks pinned to a
commit SHA, never a branch:

- owner/repo — `path/to/schema.ts` L10-80, `path/to/core.ts` L120-260, `path/to/core.test.ts`
- …

Note any repo whose tree listing came back `truncated`, or any file skipped for size — an
incomplete read presented as a complete one is the failure mode this section exists to prevent.

## How each one solves it

### 1. owner/repo
- **Data model:** …
- **Core approach:** …
- **Edge cases it handles:** …
- **What it gets wrong / does not do:** …
- Evidence: `<permalink#L120-L160>` — **Confirmed**

*(repeat for 2–5, same shape, so the reader can diff them by eye)*

## Ours, on the same axes

| Axis | Ours | The field |
|---|---|---|
| Data model | | |
| Core algorithm | | |
| Edge cases | | |
| Failure modes | | |
| Tests | | |
| UX affordances | | |
| Security posture | | |

## Combined learnings

**Convergent — ≥3 of 5 do this and we do not.** Strongest signal in the report; independent teams
landing on the same structure usually means the problem forced it.

- … — seen in A, B, D. **Confirmed** (read in all three).

**Divergent — one project does it better.** A judgement call, so argue it rather than assert it.

- … — only C does this. Worth it because …

**We are ahead here.** The upstreamable list. Keep writing it — without this section the report
degenerates into a list of ways we are behind.

- …

**Convergent design we already share.** Confirmation a past decision holds up.

- …

## Gap to world-class

For the single most advanced candidate above (name it — usually #1, argue it if not):

**Feature-by-feature delta** — what it does that we do not, in product terms:

- …

**Product/UX maturity** — walk each explicitly for the leader vs. ours; "n/a" or "untested" is a
valid answer but do not skip the row:

| Dimension | The leader | Ours |
|---|---|---|
| Empty states | | |
| Error recovery | | |
| Keyboard / screen-reader support | | |
| Mobile behaviour | | |
| Onboarding | | |
| Bulk operations | | |
| Undo | | |
| Perceived speed | | |

**Staged path to world-class:**

- **First** (cheap, high impact): …
- **Next**: …
- **Eventually**: …

## Proposals

Ranked, highest value first. Verdicts are defined in `SKILL.md` §8 — **copy** / **port the idea**
/ **write fresh** — and a `copy` is licence-gated and needs human approval before anyone acts.

`ID` is `JY-<module>-<nn>`, assigned on first appearance and never reused. It is what survives
rephrasing between runs, so never renumber this column.

| ID | Proposal | Target | Evidence | Effort | Verdict | Status |
|---|---|---|---|---|---|---|
| JY-storage-01 | … | `src/lib/x.ts:42` | 3/5 repos — [A](url#L10), [B](url#L88) | S/M/L | port the idea | open |

`Status` is human-owned: `open` · `rejected: <reason>` · `done: <commit>` · `stale: evidence no
longer found`. A re-run refreshes evidence and wording but never resurrects a settled row and
never re-argues it.

## Sources

Every URL actually fetched, grouped by project — the list a reader uses to check the work, not
"further reading".

- owner/repo: <permalink>, <permalink>
- …
