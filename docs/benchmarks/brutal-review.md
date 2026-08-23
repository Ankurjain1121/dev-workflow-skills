# Jelly — prior art: brutal-review

**Benchmarked:** 2026-08-23 · **Stack detected:** Claude Code plugin — markdown skill + 5 bundled
subagent definitions, no runtime code
**Our implementation:** `plugins/brutal-review/skills/brutal-review/SKILL.md`, `agents/*.md`,
`references/*.md`, `assets/report-template.md`
**Channels used:** `gh search repos` (topic + term) · Exa — **unavailable this run:** grep.app,
not attempted (it rate-limited earlier in this session, and I did not re-probe). Treat code-search
coverage as absent, not empty.

## The five

| # | Project | Stars | Licence | Last push | Stack | Why it made the cut |
|---|---|---|---|---|---|---|
| 1 | [The-PR-Agent/pr-agent](https://github.com/The-PR-Agent/pr-agent) | 12672 | MIT | 2026-08-23 | Python | The reference implementation of LLM PR review. Prompt-driven like ours, so its prompts port |
| 2 | [sourcery-ai/sourcery](https://github.com/sourcery-ai/sourcery) | 1857 | MIT | 2026-08-21 | Python | Longest-running production reviewer in the set |
| 3 | [kodustech/kodus-ai](https://github.com/kodustech/kodus-ai) | 1321 | other | 2026-08-22 | TypeScript | Self-hosted multi-agent review platform — closest product analogue |
| 4 | [imbue-ai/vet](https://github.com/imbue-ai/vet) | 573 | **AGPL-3.0** | 2026-06-10 | Python | Verification of *coding-agent behaviour* specifically. Read-only: AGPL, never paste |
| 5 | [yeameen/claude-code-review-council](https://github.com/yeameen/claude-code-review-council) | 17 | MIT | 2026-07-16 | **Claude Code skill** | Same stack, same architecture — a council of Claude specialists. **Fails the "really used" bar at 17★**; admitted on portability alone |

**Considered and cut:**
- `villesau/ai-codereviewer` (1036★, MIT) — last push 2024-08-19, ~2 years stale. Fails "alive".
- `codedog-ai/codedog` (192★) — **archived**.
- `trolit/Patchron` (19★) — archived.
- `mimo-x/Code-Review-GPT-Gitlab` (819★) — GitLab-specific; the platform coupling is most of the repo.
- `TrafficGuard/typedai` (1193★) — general agent platform, review is one feature, not the subject.
- `kodustech/awesome-ai-code-review` — a link list, not an implementation. Used as a lead source only.

**Files actually read:**
- The-PR-Agent/pr-agent — `pr_agent/settings/code_suggestions/pr_code_suggestions_reflect_prompts.toml`
  L1-45 (the self-reflection pass); tree listing for `settings/` (not truncated)
- yeameen/claude-code-review-council — `skills/review-council/SKILL.md`, full file, 25KB
- imbue-ai/vet — `README.md` (README-level only)
- sourcery-ai/sourcery, kodustech/kodus-ai — `README.md` keyword scan only; **neither read at source
  level.** Their rows below are weaker than 1, 4, 5 and are marked accordingly.

No repo reported a truncated tree. No file exceeded the size ceiling.

## How each one solves it

### 1. The-PR-Agent/pr-agent — a second model pass that scores findings *down*
Generation and judgement are separate steps. A dedicated reflection prompt re-reads every generated
suggestion against the diff and scores it 0–10, with hard caps written into the prompt: score **0**
for suggestions that "Overlook crucial details in the PR code" or contradict the PR; score **0** for
whole categories — adding docstrings, type hints or comments, removing unused imports, adding missing
imports, more specific exception types; **max 7** if the suggestion merely asks the user to "verify
or ensure"; **max 8** for error-handling or type-checking suggestions; **max 7** if `existing_code`
equals `improved_code`. Explicit instruction: "Avoid inflating scores for suggestions that, while
correct, offer only marginal improvements."
Evidence: [reflect prompts L18-42](https://github.com/The-PR-Agent/pr-agent/blob/main/pr_agent/settings/code_suggestions/pr_code_suggestions_reflect_prompts.toml#L18-L42) — **Confirmed**

### 2. yeameen/claude-code-review-council — synthesis is the product, not the panel
Runs seven streams (Codex, Gemini, five Claude specialists) and states plainly that the panel is not
the value: "they also produce false positives that look authoritative. The value is in the
**synthesis**: dedupe across all seven streams, verify each claim by reading the code… and use the
resume / re-prompt mechanisms to push back on dubious findings rather than blindly applying them."
Concretely: source-tags each finding with every reviewer that raised it; **re-rates** the reviewers'
own P0–P3 ("starting points, not gospel"); surfaces disagreements; interrogates a suspicious finding
by asking the original reviewer to defend it; ships a **"Dismissed (false positives)"** section in
its report. It also warns that agreement is not proof — "verify even the unanimous ones, because
shared blindspots happen too." Separately, it briefs reviewers with the change's *intent* and
A/B-verified the effect: prompt-mode caught 3 P1s including a stated-rule violation that no-prompt
mode could not surface.
Evidence: [SKILL.md L12, L161-171, L234](https://github.com/yeameen/claude-code-review-council/blob/main/skills/review-council/SKILL.md) — **Confirmed**

### 3. imbue-ai/vet — verification as a standalone product
Ships as `verify-everything` on PyPI; describes itself as "a standalone verification tool for code
changes **and coding agent behavior**." The existence of a funded, separately-packaged tool for
verifying agent output is itself the datapoint: the field treats unverified agent findings as a
problem worth its own product. **AGPL-3.0 — read only, never paste.**
Evidence: [README L14, L87](https://github.com/imbue-ai/vet/blob/main/README.md) — **Confirmed**
(README-level: a claim about positioning, which a README is a valid source for)

### 4. sourcery-ai/sourcery · 5. kodustech/kodus-ai
Not read at source level this run. Keyword scans of their READMEs for false-positive/confidence
language returned nothing, which is **not** evidence of absence — it is evidence I did not look
properly. **Unconfirmed**; excluded from the convergence count below.

## Ours, on the same axes

| Axis | Ours | The field |
|---|---|---|
| Data model | 5 fixed categories, weighted 30/25/20/15/10, single 0–100 score | Per-finding severity (P0–P3) or per-suggestion score; no aggregate gate |
| Core algorithm | Spawn 5 → collect → weight → threshold | Generate → **verify/dedupe/re-rate** → report |
| Edge cases | None specified | Whole categories pre-scored to zero; caps per suggestion type |
| Failure modes | Unaddressed | False positives named as *the* failure mode, by both source-read projects |
| Tests | None | pr-agent ships `pr_evaluate_prompt_response.toml`; council A/B-tested prompt-mode |
| UX affordances | Score + PASS/FAIL verdict | Source tags, disagreements surfaced, dismissed-findings section |
| Security posture | No untrusted-input guidance | Not assessed in the field either — no finding either way |

## Combined learnings

**Convergent — 2 of 2 source-read projects do this and we do not.** Both separate *generation* from
*judgement*, and the judgement step exists specifically to throw findings away. pr-agent hard-codes
zero-scores for entire suggestion classes; council dedupes, re-rates, interrogates and publishes what
it dismissed. brutal-review has no verification stage at all: an agent's deduction goes straight into
the weighted total. Labelled honestly: this is **2 of 2 read**, not 3 of 5 — I did not read sourcery
or kodus at source level, so I cannot claim the stronger number.

**Divergent — nobody else gates on an aggregate score.** pr-agent scores individual suggestions;
council uses per-finding severity. Neither computes one weighted number with a pass/fail threshold.
Our own run of brutal-review against `jelly` showed why that shape misleads: two CATASTROPHIC security
findings floored that category to 0/100, and since security carries 30% weight, 30 points vanished as
a *framework artefact* rather than a measurement. The finding list was informative; the number was not.

**Direct evidence from this session, not from GitHub.** Running brutal-review against `jelly` required
injecting anti-padding calibration into all five agent prompts by hand ("returning nothing is a
legitimate answer — do not manufacture deductions"). The skill's own framing — zero tolerance, every
deduction needs a location, no mercy — pushes agents toward finding *something*. pr-agent's prompt
pushes the opposite way. That is the gap, observed live.

**We are ahead here.** The bundled per-axis specialist agents and the 8 mode configurations are
genuinely more structured than anything in the set except council, and council independently validates
the multi-specialist premise ("a focused specialist prompt finds issues that a holistic prompt sails
past"). The architecture is right. The missing half is what happens after the specialists report.

## Proposals

Verdicts defined in `SKILL.md` §7. A `copy` is licence-gated and needs human approval.

| ID | Proposal | Target | Evidence | Effort | Verdict | Status |
|---|---|---|---|---|---|---|
| JY-brutal-review-01 | Add a verification pass between STEP 3 and STEP 4: re-read each agent's findings against the code, drop the unsupported ones, and require the dismissals be shown | `SKILL.md` STEP 3→4 boundary | 2/2 source-read — [pr-agent reflect](https://github.com/The-PR-Agent/pr-agent/blob/main/pr_agent/settings/code_suggestions/pr_code_suggestions_reflect_prompts.toml#L18-L42), [council L161-171](https://github.com/yeameen/claude-code-review-council/blob/main/skills/review-council/SKILL.md) | M | port the idea | open |
| JY-brutal-review-02 | Add "returning no findings is a legitimate answer" to all five agent prompts, plus pr-agent-style zero-score categories (docstrings, unused imports, type hints) | `agents/brutal-*.md` | pr-agent scores those classes 0; observed live — this session needed the calibration injected by hand | S | port the idea | open |
| JY-brutal-review-03 | Add a "Dismissed (false positives)" section to the report | `assets/report-template.md` | [council L234](https://github.com/yeameen/claude-code-review-council/blob/main/skills/review-council/SKILL.md) | S | copy (MIT — attribute) | open |
| JY-brutal-review-04 | Report the finding list as the verdict; make the weighted score advisory, or state when a floor rather than a measurement produced it | `SKILL.md` STEP 4-5 | No project in the set gates on an aggregate; failure observed in the `jelly` run | M | write fresh — no one has our aggregate model to copy | open |
| JY-brutal-review-05 | Accept an intent brief (PR description, conventions, deliberately-out-of-scope items) and pass it to every agent | `SKILL.md` STEP 1-3 | [council L56, L69, L81](https://github.com/yeameen/claude-code-review-council/blob/main/skills/review-council/SKILL.md) — A/B verified, 3 extra P1s | M | port the idea | open |
| JY-brutal-review-06 | Tag each finding with which agents raised it; surface disagreements instead of merging them | `SKILL.md` STEP 4 | [council L161-163](https://github.com/yeameen/claude-code-review-council/blob/main/skills/review-council/SKILL.md) | S | port the idea | open |

`Status` is human-owned: `open` · `rejected: <reason>` · `done: <commit>` · `stale: evidence no
longer found`. A re-run refreshes evidence but never resurrects a settled row.

## Sources

- The-PR-Agent/pr-agent: `pr_agent/settings/code_suggestions/pr_code_suggestions_reflect_prompts.toml`, tree listing of `pr_agent/settings/`
- yeameen/claude-code-review-council: `skills/review-council/SKILL.md`, tree listing
- imbue-ai/vet: `README.md`, tree listing
- sourcery-ai/sourcery: `README.md` (keyword scan only)
- kodustech/kodus-ai: `README.md` (keyword scan only)
- Discovery: `gh search repos --topic=ai-code-review|code-review-bot|llm-code-review`, term searches
  `pr-agent`, `code review gpt`, `ai code reviewer`; Exa roundup query
