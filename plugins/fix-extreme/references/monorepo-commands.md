# Monorepo Commands Reference

Quick reference for affected-only commands in different monorepo tools.

## Turborepo

```bash
# List affected packages
turbo ls --affected

# Lint only affected packages
turbo run lint --filter=[origin/main...HEAD]

# Type-check only affected
turbo run type-check --filter=[origin/main...HEAD]

# Build only affected
turbo run build --filter=[origin/main...HEAD]

# With specific base branch
TURBO_SCM_BASE=develop turbo run lint --affected
```

## Nx

```bash
# Lint affected projects
nx affected -t lint --parallel=4

# Type-check affected
nx affected -t type-check --parallel=4

# Run multiple tasks on affected
nx affected -t lint test build

# With specific base
nx affected -t lint --base=develop --head=HEAD
```

## pnpm Workspaces

```bash
# Lint only changed packages
pnpm -r --filter='...[origin/main]' run lint

# Type-check changed packages
pnpm -r --filter='...[origin/main]' run type-check

# With concurrency limit
pnpm -r --workspace-concurrency=4 --filter='...[origin/main]' run lint
```

## Detection Logic

```bash
# Detect monorepo type
if [ -f "turbo.json" ]; then
  echo "turbo"
elif [ -f "nx.json" ]; then
  echo "nx"
elif [ -f "pnpm-workspace.yaml" ]; then
  echo "pnpm"
else
  echo "none"
fi
```

## Why Affected-Only?

For `/fix-extreme`, we use affected-only scanning because:
1. **Speed** - Only scan what changed
2. **Focus** - Fix issues in your changes, not the whole repo
3. **CI-friendly** - Matches typical PR validation flow
