#!/usr/bin/env bash
# Build the VPS skill index: path<TAB>name<TAB>description (one line per SKILL.md).
# ~25s on this box. Output: ~/.cache/ponytail-vps/skills.tsv. Re-run after installing skills.
set -uo pipefail
out=${PONYTAIL_VPS_INDEX:-$HOME/.cache/ponytail-vps/skills.tsv}
mkdir -p "$(dirname "$out")"
# order = preference: first hit wins when name+description repeat across plugin cache versions
read -r -a roots <<< "${PONYTAIL_VPS_ROOTS:-$HOME/.claude/skills $HOME/.agents/skills $HOME/.claude/plugins/marketplaces $HOME/.claude/plugins/cache $HOME/.codex/skills $HOME/.hermes/skills $HOME/gbrain/skills $HOME/projects $HOME/tools $HOME/code}"
tmp=$(mktemp)
for r in "${roots[@]}"; do
  [ -d "$r" ] || continue
  find "$r" -xdev -name SKILL.md -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/.tmp/*' -not -path '*/backups/*' -not -path '*/test/*' -not -path '*/tests/*' 2>/dev/null
done | while IFS= read -r f; do
  awk -v f="$f" '
    NR==1 && $0!="---" {exit}
    NR>1  && $0=="---" {exit}
    /^name:/        {n=$0; sub(/^name:[ \t]*/,"",n); ind=0; next}
    /^description:/ {d=$0; sub(/^description:[ \t]*[>|]?-?[ \t]*/,"",d); ind=1; next}
    ind && /^[ \t]+/ {s=$0; gsub(/^[ \t]+|[ \t]+$/,"",s); d=d" "s; next}
    {ind=0}
    END {gsub(/\t/," ",d); gsub(/^"|"$/,"",d); if(n=="") {m=f; sub(/\/SKILL\.md$/,"",m); sub(/.*\//,"",m); n=m}
         printf "%s\t%s\t%s\n", f, n, substr(d,1,300)}' "$f"
done | awk -F'\t' '!seen[$2 "\t" $3]++' > "$tmp"
mv "$tmp" "$out"
echo "indexed $(wc -l < "$out") skills -> $out"
