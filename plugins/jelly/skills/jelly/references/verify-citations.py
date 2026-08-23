#!/usr/bin/env python3
"""Verify every github.com/<owner>/<repo>/blob/<sha>/<path> citation in a jelly report.

Usage: references/verify-citations.py docs/benchmarks/<module>.md

For each citation:
  1. `gh api repos/<owner>/<repo>/git/trees/<sha>?recursive=1` must resolve (valid commit SHA).
  2. The cited path must appear in that tree (path actually exists at that SHA).

A citation failing either check is reported, never silently guessed at or auto-fixed — SKILL.md
§9 requires removing it from the report or re-fetching the real permalink.

Path regex note: a path cited inside `` `code spans` `` or followed by markdown punctuation
(backtick, `.,;:)]>*_`) needs that punctuation stripped before the tree lookup, or every such
citation false-misses. Strip both leading quote/backtick and trailing markdown punctuation.
"""
import re
import subprocess
import sys


def gh(args):
    r = subprocess.run(["gh", "api"] + args, capture_output=True, text=True)
    return (r.returncode == 0, r.stdout)


def main():
    if len(sys.argv) != 2:
        print("usage: verify-citations.py <report.md>", file=sys.stderr)
        sys.exit(2)

    path = sys.argv[1]
    text = open(path, encoding="utf-8").read()

    raw = re.findall(
        r'github\.com/([^/\s)]+)/([^/\s)]+)/blob/([0-9a-f]{40})/([^\s)#,]+)', text
    )

    links = set()
    for owner, repo, sha, p in raw:
        # strip markdown/punctuation that abuts a path: `code`, trailing . , ; : ) ] " ' * _
        p = p.strip('`"\'').rstrip('`.,;:)]>*_')
        links.add((owner, repo, sha, p))

    trees = {}
    bad_sha, bad_path, ok = [], [], []
    for owner, repo, sha, p in sorted(links):
        full = f"{owner}/{repo}"
        key = (full, sha)
        if key not in trees:
            good, out = gh([f"repos/{full}/git/trees/{sha}?recursive=1", "--jq", ".tree[].path"])
            trees[key] = set(out.splitlines()) if good else None
        tree = trees[key]
        if tree is None:
            bad_sha.append((full, sha, p))
            continue
        (ok if p in tree else bad_path).append((full, sha, p))

    print(f"  citations checked: {len(links)}")
    print(f"  OK:                {len(ok)}")
    print(f"  INVALID SHA:       {len(bad_sha)}")
    print(f"  PATH NOT AT SHA:   {len(bad_path)}")
    for f, s, p in bad_sha:
        print(f"    INVALID-SHA  {f}@{s[:8]}  {p}")
    for f, s, p in bad_path:
        print(f"    PATH-MISS    {f}@{s[:8]}  {p}")

    branch = len(re.findall(r'blob/(?:master|main|HEAD)/', text))
    print(f"  branch-pinned links (should be 0): {branch}")

    sys.exit(1 if (bad_sha or bad_path or branch) else 0)


if __name__ == "__main__":
    main()
