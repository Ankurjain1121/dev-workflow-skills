# ponytail-vps

Local fork of [ponytail](https://github.com/DietrichGebert/ponytail) (MIT, Dietrich Gebert).
One change: ladder rung 2 is **"already anywhere on this VPS?"** instead of "already in this codebase?".
`scripts/vps-find.sh` searches every skill dir, plugin cache, and project on the box; the skill tells the agent to copy and adapt what it finds before writing anything new.

## Install (once)
```
claude plugin marketplace add Ankurjain1121/dev-workflow-skills
claude plugin install ponytail-vps@dev-workflow-skills
bash ${CLAUDE_PLUGIN_ROOT}/scripts/vps-index.sh   # ~25s, builds ~/.cache/ponytail-vps/skills.tsv
```
Disable the upstream plugin (`ponytail@ponytail`) so the two do not both fire.

## Use
- Per session: `/ponytail-vps:ponytail ultra` (or `lite|full|off`). Default is off; `/ponytail-vps:ponytail default ultra` persists.
- Find reuse candidates by hand: `bash ${CLAUDE_PLUGIN_ROOT}/scripts/vps-find.sh <keyword> [keyword...]`
- Refresh the index after installing skills: `bash ${CLAUDE_PLUGIN_ROOT}/scripts/vps-index.sh`

## Layout
`hooks/` upstream Claude Code hooks (mode tracker patched for the `ponytail-vps:` namespace) · `skills/` upstream skills, main SKILL.md patched · `scripts/` the VPS finder · `tests/` upstream hook tests (`node --test tests/hooks.test.js`).

Hook edits need `claude plugin update ponytail-vps@dev-workflow-skills`; script edits apply live (the skill calls the repo path).
