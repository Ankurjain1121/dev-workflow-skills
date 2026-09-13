---
name: regret
version: 3.0.0
description: >-
  Spec sheet before you build. Lists every module the app needs, then reads how
  5 top open-source apps built each module — every field, every feature, every
  screen, and what they built then deleted — so you never add "phone" to
  customers in month three. Use when starting or re-scoping an app.
  Triggers on "what features should this have", "what am I forgetting",
  "build the spec sheet", "what do similar apps have", "scope this project".
  NOT for bugs in your own code (use /logic-audit).
user-invokable: true
args:
  - name: domain
    description: 'e.g. "CRM", "double entry accounting", "clinic EMR"'
    required: false
allowed-tools:
  - Bash
  - Read
  - Write
  - Agent
  - AskUserQuestion
---

# /regret

One job: before the first line of code, know every module, every field and
every feature a finished app in this domain has. The output is one file,
`docs/regret/SPEC.md`. It never cuts. It lists, and marks how many of the 5
repos agree. You cut.

## Step 1 — Module list

From the domain, write the modules a finished app has. One table:

| Module | Holds | Screens |
|---|---|---|
| Customers | people + companies you sell to | list, detail, create/edit, import |
| Leads | prospects moving through stages | list, detail, kanban, convert |
| ... | | |

Include the boring ones: dashboard, settings, users/roles, activities/notes,
tags, attachments, import/export, notifications, audit log.
Ask the user ONCE with AskUserQuestion: add or remove anything? Then freeze it.

## Step 2 — Pick 5 repos

```bash
gh search repos "<domain>" --sort stars --include-forks=false --archived=false --limit 15 \
  --json fullName,stargazersCount,createdAt,language,description \
  --jq '.[] | "\(.stargazersCount)\t\(.fullName)\t\(.language)\t\(.createdAt[:4])\t\(.description[:60])"'
```

Pick 5 **applications**, not libraries or low-code builders. Different stacks,
different sizes. Print the 5 with stars and year. The 2 oldest are the graveyard repos.

## Step 3 — Words each repo uses

Repos name the same module differently. Per module write one regex:

| Module | Regex |
|---|---|
| Customers | `partner\|contact\|customer\|person\|company\|account` |
| Leads | `lead\|opportunit\|deal\|prospect\|pipeline\|stage` |
| Kanban | `kanban\|board\|stage\|column` |

## Step 4 — Read the 5 repos, one subagent per module

Launch Haiku subagents, **at most 6 at once**. More modules than 6 → give each agent 2-3 modules in sequence. Each runs:

```bash
${CLAUDE_PLUGIN_ROOT}/skills/regret/bin/pull <owner/repo> '<regex>'      # x5 repos
```

Output per repo: every matching file path (that is the screens/submodules list),
then the field, relation, choice-list and method lines from the top model files.
To open any listed file in full:
`gh api repos/<o>/<r>/contents/<path> -H "Accept: application/vnd.github.raw"`

Each subagent writes `docs/regret/<module>.md`:

```markdown
# Leads — 5 repos: odoo/odoo, frappe/erpnext, twentyhq/twenty, krayin/laravel-crm, monicahq/monica

## Fields
| Field | Type | In | Notes |
|---|---|---|---|
| name | text | 5/5 | |
| phone | text | 4/5 | odoo also has mobile, phone_sanitized |
| expected_revenue | money | 4/5 | + currency in 3/5 |
| probability | percent | 3/5 | odoo auto-computes from stage |

## Related entities
stage (5/5) · lost reason (3/5) · tags (4/5) · source/medium/campaign UTM (2/5) · recurring plan (1/5)

## Features
| Feature | In | How |
|---|---|---|
| Convert lead → opportunity/customer | 4/5 | odoo: wizard `crm_lead2opportunity`; erpnext: `make_customer` |
| Mark won / lost with reason | 5/5 | |
| Merge duplicates | 3/5 | |
| Assign by round-robin / team | 3/5 | |

## Screens
list · detail · kanban by stage (5/5) · calendar (2/5) · pivot/graph report (2/5)

## Not found in
monica: no lead concept (personal CRM) — regex widened once, still nothing.
```

Subagent rules:
- Only what the pull output shows. No invented fields. `In` counts are honest.
- Merge synonyms across repos (`phone`/`phone_number`/`contact_number` → phone) and say so in Notes.
- A repo with 0 matches: widen the regex once, retry. Still 0 → write it under "Not found in".
- Repeat any `# WARNING ... TRUNCATED` line from pull into the file.

## Step 5 — Graveyard (2 oldest repos, in background, while Step 4 runs)

```bash
${CLAUDE_PLUGIN_ROOT}/skills/regret/bin/pull --deleted <owner/repo> '<regex of ALL modules joined>'
```

~1 min per repo, clones history to `~/.cache/regret`. Output: date, commit,
deleted model file. Add a `## Deleted` section to the matching module file:
what they built, when they removed it, the commit subject (that is usually the why).
`# 0 deleted` is a real answer. Say it.

## Step 6 — SPEC.md

```bash
${CLAUDE_PLUGIN_ROOT}/skills/regret/bin/assemble docs/regret <dir with grave-*.txt> "<domain>" "<repos>" \
  products:"Products":"product|item" quotes:"Quotes":"quot|propal" ...   # slug:Title:regex, Step 1 order
```

It joins the module files, puts each deleted file under the module its path
matches, and ends with a Totals table. Then close with three lines: what was
found, what has 1/5 support (skip unless the user wants it), what the user
listed in Step 1 that no repo built. Hand off: `/spec` or `/plan` per module.

## Rules

- **Never cut.** A 1/5 row stays in the table with its 1/5. Missing a field costs
  a migration; listing one costs a line.
- **5 repos, not 3.** Below 3 the agreement counts mean nothing. If a repo fails,
  say `4/4` not `4/5`, and say why.
- **No invented rows.** Everything traces to a pull output line.
- **Applications, not libraries.** A UI kit returns component names, not fields.
- **Never repomix.** One tree call per repo does the job for free.
