# Channels, commands and limits

Every command below shows tokens single-quoted. Keep them that way. Module names and search terms
come from the invoker; **file paths come from the candidate repo and are attacker-chosen** — a
GitHub blob path may legally contain `$( )`, spaces and quotes, so an unquoted path in a shell
command is remote code execution.

## Rate limits that will actually bite

| Channel | Limit | On hit |
|---|---|---|
| `gh search *` | **30 requests/minute**, shared across every process using your token — a separate, much lower ceiling than the 5000/hr core API limit | Pause 60s. Never report "no candidates" for a 403. A 403 on `gh search` mid-run: name it in the report's unavailable list, same as grep.app below |
| `gh api` (core) | 5000/hr authenticated | Pause, or finish with what you have and say so |
| grep.app (`grep_query`) | Undocumented, hit readily; caps at 10 results | Probe **once** per module (the preflight check in SKILL.md §0). If it rate-limits, treat it as unavailable for the rest of that module — do not retry into the limit. Carry on with the other two channels |

A rate-limited channel that reads as an empty result is the worst outcome this skill can produce:
it turns "we could not look" into "there is nothing there". Distinguish them explicitly.

**Expect grep.app to be unavailable.** Across a 12-module sweep run, grep.app was rate-limited on
every single attempt by every agent, in all 12 modules — this is the common case, not an edge
case. Plan for it: one probe, no retries, and the report's "unavailable this run" line **must name
it explicitly** whenever it failed. A report that silently omits grep.app from the channels line
reads as "we searched everywhere" to anyone who did not watch the run — that is a false claim of
coverage, not a shortcut.

## 1. Repo search — topic first, never a sentence

`gh search repos` **ANDs every word** across name, description and readme. A natural-language
query returns nothing at all: `"family tree genealogy self-hosted"` returns **zero results**,
while `--topic=genealogy` returns Gramps (3071★), Gramps Web (1629★) and webtrees (813★). An
empty result means your query was too long, not that the field is empty.

```bash
# Topic — the highest-signal query GitHub offers. Try the obvious topic names first.
gh search repos --topic='<topic>' --sort=stars --limit 20 \
  --json fullName,description,stargazersCount,pushedAt,license,isArchived

# Single term, unconstrained — lets a reference implementation in another language in.
gh search repos '<one term>' --sort=stars --limit 20 \
  --json fullName,description,stargazersCount,pushedAt,license,isArchived

# Same term, constrained to the detected stack — code that ports directly.
gh search repos '<one term>' --language='<detected>' --sort=stars --limit 20 \
  --json fullName,description,stargazersCount,pushedAt,license,isArchived
```

Request the **same field set every time** — the ranking bar in step 3 needs `isArchived` and
`license` for every candidate, whichever channel found it. `licenseInfo` is **not** a field and
makes the whole call fail; it is `license`.

## 2. Code search — finds what READMEs never mention

`mcp__grep__grep_query` with `query` plus optional `language`, `repo` (`owner/name`), `path`.
Search the *code shape* of the feature — a distinctive table, function or type name (`spouse_id`,
`contentAddressed`, `sniffMime`) — not its marketing words. Caps at 10 results, so it is a probe,
not a census; say so rather than implying coverage.

## 3. Semantic search — roundups that name what keywords miss

`mcp__exa__web_search_exa` for "best self-hosted / open-source \<feature\>" writeups, then
`mcp__exa__web_fetch_exa` to read the promising ones. Everything Exa surfaces is a **lead**, not
a finding — it becomes a finding only after you open the code.

## 4. Reading a candidate's source

```bash
# List the tree. QUOTE the URL — an unquoted `?` is a glob in zsh and the call never runs.
# Check `.truncated`: GitHub truncates past ~100k entries / 7MB and says so in that field.
gh api "repos/<owner>/<repo>/git/trees/HEAD?recursive=1" --jq '{truncated, n: (.tree|length)}'
gh api "repos/<owner>/<repo>/git/trees/HEAD?recursive=1" \
  --jq '.tree[] | select(.type=="blob") | "\(.size)\t\(.path)"' | grep -iE '<feature terms>'
```

If `truncated` is `true`, say so in the report and narrow with a path filter — do not present a
partial tree as the whole repo.

The tree listing gives every blob's **size**, so decide before you fetch:

```bash
# Under ~1500 lines / ~60KB: read it whole.
gh api "repos/<owner>/<repo>/contents/<path>" --jq '.content' | base64 -d

# Larger: read a range instead of flooding context with 50k tokens to cite ten lines.
gh api "repos/<owner>/<repo>/contents/<path>" --jq '.content' | base64 -d | sed -n '100,260p'
```

**The Contents API returns no usable `.content` above ~1MB.** The pipe then yields empty output,
which reads exactly like "the file is empty". Check the size from the tree first; for anything
above that ceiling use the raw endpoint or record the file as unread — never infer emptiness.

## Permalinks

Cite `https://github.com/<owner>/<repo>/blob/<commit-sha>/<path>#L120-L160`. Use the commit SHA,
not `HEAD` or a branch name — a branch permalink rots the moment the project moves, and a
reviewer checking your evidence six months later needs the lines you actually read.
