---
name: orchestrate
description: Contract-first parallel build on the Workflow tool. Freeze shared contracts, give every file set exactly one owner agent, verify each unit adversarially, then integrate until checks pass. Use for multi-file features that split into disjoint files joined by shared types. Invoking this skill is the opt-in to run a Workflow.
argument-hint: "[task] [--ultra] [--lane codex|vodax|agy]"
version: 2.0.0
---

# /orchestrate

Arguments: `$ARGUMENTS`

**ONE FILE = ONE OWNER. Owners meet only at frozen contracts.**

You (main loop) do the thinking: scout, write contracts, split files, pick lanes.
The bundled workflow does the typing, verifying and integrating — deterministically.

## When NOT to use

- Fewer than 3 units, or every file depends on every other → just do it yourself.
- The design is still open → `/spec` or `/plan` first. Contracts must be decidable now.

---

## Step 1 — Preflight

```bash
ROOT=$(git rev-parse --show-toplevel)
nproc      # Workflow runs min(16, CPUs-2) agents at once
```

Read if present: `specs/<feature>/design.md`, `.claude/contracts.json` (from `/contracts`), `AGENTS.md`.
On the default branch → create a branch first. Dirty files you must not lose → commit or stash first.

## Step 2 — Write the contracts

A contract is anything two owners both touch: types, interfaces, function signatures,
API request/response shapes, DB columns, event names, constants.

- Write each as **exact code** in `contracts[].spec`, not prose. Builders never see each other.
- Prefer **dependency injection** at seams: a consumer takes `deps: { priceOrder: PriceOrder }`
  typed by the contract, instead of importing the producer's module. The consumer can then
  be built and tested while the producer is still half-written.
- Contract files are written by one agent before any builder starts. After that, any change
  to them is flagged as `protected_files_changed`.

## Step 3 — Split into units

All paths are **repo-relative files**: no directories, no globs, no `..`. The script rejects anything else.

| Rule | Why |
|------|-----|
| A unit owns 1–3 files; its test file goes with its source | one owner per file, tests are not a second owner |
| A file two units need → make it a contract, or merge the units | the script throws on overlap |
| Barrels, route registries, DI wiring → one small `wiring` unit with **no check** | all units build at the same time, so wiring cannot be tested mid-build |
| The test that proves the real pieces fit → put its command in top-level `checks` | `checks` run only after every unit is done |
| Manifests, lockfiles, migration order → you, before the run | builders are forbidden to touch them |
| Give each non-wiring unit a scoped `check` (its own test file) | builders must not run whole-repo checks mid-build |

## Step 4 — Pick lanes (optional)

Default lane is `claude`. Only route out when it clearly fits:

| Lane | agentType | Use for |
|------|-----------|---------|
| `claude` | (default) | core logic, anything subtle |
| `codex` | `codex-driver` | careful single-file, type-driven work |
| `vodax` | `vodax-driver` | bulk mechanical code, boilerplate |
| `agy` | `agy-driver` | UI components |

Run `bash ~/.claude/skills/dhamaka/bin/preflight.sh` first. Route only to lanes reporting `ok`.
`DSH_PEAK=yes` → no `vodax`. A dead external-lane agent retries once on claude; the second fix always runs on claude.
`model` (sonnet / opus / haiku) applies only to the claude lane.

## Step 5 — Run

Cost measured on a 4-unit toy repo, 4 CPUs → 2 agents at once: `ultra` = 32 agents, ~2.1M subagent tokens, ~8 min.
Units never wait on each other, but the concurrency cap is real.

Rigor: `standard` (1 verifier per unit). Use `ultra` (3 lens verifiers — contract / correctness / security —
plus a completeness critic) when ultracode is on, `--ultra` is passed, or the code touches auth, money or data.

Record the baseline **immediately before** the call, after any manifest edits you made yourself:

```bash
git -C "$ROOT" status --porcelain --untracked-files=all | cut -c4- | sed 's/.* -> //'
```

Locate the script (it sits next to this file):

```bash
find ~/.claude/plugins -path '*orchestrate/skills/orchestrate/orchestrate.workflow.js' 2>/dev/null | head -1
```

Show the user the unit table (key · owns · lane) in one message, then call:

```
Workflow({
  scriptPath: "<path>/orchestrate.workflow.js",
  args: {
    root: "/abs/repo",
    goal: "one paragraph",
    context: "stack, import rules, test runner, house rules the builders need",
    contracts: [{ file: "src/types/order.ts", spec: "export interface Order { ... }" }],
    reads: ["package.json"],
    units: [
      { key: "pricing", owns: ["src/services/pricing.ts", "test/pricing.test.ts"],
        task: "exact behaviour + test cases", check: "node --test test/pricing.test.ts" },
      { key: "format", owns: ["src/format/inr.ts", "test/inr.test.ts"], lane: "codex", task: "...", check: "..." },
      { key: "wiring", owns: ["src/index.ts"], effort: "low", task: "..." }
    ],
    checks: ["npm run -s typecheck", "npm test"],
    baselineDirty: ["<output of the baseline command>"],
    rigor: "standard"
  }
})
```

Pass `args` as a JSON object, never a JSON string. Optional per unit: `reads`, `lane`, `model`, `effort`.
Optional top level: `maxFix` (default 2), `maxIntegrate` (default 2). Both must be integers ≥ 0.

What the workflow does:

1. **Contracts** — one agent writes all contract files and returns the frozen signatures. Then it hashes the contract and baseline files.
2. **Build** — `pipeline` per unit: build → verify → fix (≤ maxFix). Units never wait for each other.
   A reviewer issue in another unit's file goes to that owner. An issue in a contract becomes a contract gap.
3. **Integrate** — full `checks`. Each failure is routed to the owner of its **root cause** file.
   A cause in a contract or an unowned file (tsconfig, manifest) is returned to you, not fanned out.
   Ultra adds a completeness critic. A final `git status` + hash audit covers every stage.

## Step 6 — Act on the result

`status` is one of `green` · `unverified` (no checks given) · `needs_work` · `blocked`.

| Field | Do |
|-------|----|
| `status: green` | Re-run `checks` yourself and show the real output. Then `/contracts sync`. |
| `died` | Those units never finished. Re-run them. >50% died → the split is wrong; stop and re-plan. |
| `contract_gaps` | Fix the contract spec. Commit the first run's work (or add every file it changed to `baselineDirty`), then re-run with the **full** `contracts` list and only the affected units plus their consumers. |
| `unrouted_failures` | Root cause is in a contract or a file nobody owns — fix it yourself, once. |
| `open_issues` | Unfixed after maxFix (or `fix_died` on the unit). Fix or re-run those units. |
| `unreviewed` | A verifier died, so the unit was never fully checked. Re-run it or review it yourself. |
| `checks: "agent died — unverified"` | Run `checks` yourself before trusting anything. |
| `ownership.*` | A builder broke ownership or edited a protected file. Inspect the diff. Never auto-revert. |

To resume after editing the script: `Workflow({ scriptPath, resumeFromRunId })` — finished agents return from cache.

## Report format

```
ORCHESTRATE — <status>   rigor: <standard|ultra>
unit        owns                          lane    build  verify
pricing     src/services/pricing.ts +1    claude  done   pass
format      src/format/inr.ts +1          codex   done   pass
checks: <passed | N failures>   ownership: <clean | list>   gaps: <none | list>
```

## Maintaining the script

`node orchestrate.sim.mjs` (next to this file) runs the script against fake agents: dead agents,
dead checks, root-cause routing, ownership violations. Run it after every edit to the script.

## Fallback — no Workflow tool

(Subagent context, or Workflow disabled.) Send one `Agent` call per unit in a single message, each
prompt carrying: frozen contracts, `YOU OWN: <files>`, the task, and the same hard rules
(no whole-repo checks, no manifests, report contract gaps instead of working around them).
Then run `checks`, `git status`, and review yourself.
