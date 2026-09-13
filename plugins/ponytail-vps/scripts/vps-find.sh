#!/usr/bin/env bash
# Ladder rung 2, VPS-wide: "does this already exist anywhere on this box?"
# usage: vps-find.sh <keyword> [keyword...]   (terms are OR-ed, case-insensitive)
set -uo pipefail
[ $# -gt 0 ] || { echo "usage: vps-find.sh <keyword> [keyword...]" >&2; exit 2; }
idx=${PONYTAIL_VPS_INDEX:-$HOME/.cache/ponytail-vps/skills.tsv}
lim=${PONYTAIL_VPS_LIMIT:-15}
[ -s "$idx" ] || "$(dirname "$0")/vps-index.sh" >&2
q=$(printf '%s|' "$@"); q=${q%|}
echo "## skills (name | dir | description)"
rg -i --no-line-number --no-filename "$q" "$idx" | head -n "$lim" \
  | awk -F'\t' '{d=$1; sub(/\/SKILL\.md$/,"",d); printf "%s | %s | %s\n",$2,d,substr($3,1,120)}'
echo
echo "## code by file name (~/projects ~/tools ~/code)"
fdfind -i -t f -E node_modules -E dist -E build -E '*lock*' -E '*.min.*' -E '*.map' "$q" "$HOME/projects" "$HOME/tools" "$HOME/code" 2>/dev/null | head -n "$lim"
echo
echo "## code by content"
rg -il --max-count 1 "$q" "$HOME/projects" "$HOME/tools" "$HOME/code" \
  -g '!node_modules' -g '!dist' -g '!build' -g '!.git' -g '!*lock*' -g '!*.min.*' -g '!*.map' -g '!*.svg' 2>/dev/null | head -n "$lim"
echo
echo "reuse: cp -r <skill-dir> ./.claude/skills/<name>    or    cp <file> <dest>   (then adapt, don't rewrite)"
