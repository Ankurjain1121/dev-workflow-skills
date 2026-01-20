# Monorepo Commands Reference (Full Workspace)

Reference for running quality checks across the ENTIRE monorepo workspace.
Unlike `/fix-extreme` (affected-only), `/fix-hard` runs on ALL packages.

## Turborepo (Full Workspace)

```bash
# Run lint on ALL packages
turbo run lint

# Run type-check on ALL packages
turbo run type-check

# Run all quality tasks
turbo run lint type-check test build

# With concurrency control
turbo run lint --concurrency=4

# Output errors only (less noise)
turbo run lint --output-logs=errors-only

# Force run (ignore cache)
turbo run lint --force
```

## Nx (Full Workspace)

```bash
# Run lint on ALL projects
nx run-many -t lint --all --parallel=4

# Run type-check on ALL projects
nx run-many -t type-check --all --parallel=4

# Run multiple tasks
nx run-many -t lint type-check test build --all

# With specific parallelism
nx run-many -t lint --all --parallel=8

# Skip Nx cache
nx run-many -t lint --all --skip-nx-cache
```

## pnpm Workspaces (Full Workspace)

```bash
# Run lint in ALL packages
pnpm -r run lint

# Run type-check in ALL packages
pnpm -r run type-check

# With concurrency control
pnpm -r --workspace-concurrency=4 run lint

# Sequential (for debugging)
pnpm -r --workspace-concurrency=1 run lint

# Filter by package name pattern
pnpm -r --filter="@myorg/*" run lint
```

## Comparison: /fix-extreme vs /fix-hard

| Aspect | /fix-extreme | /fix-hard |
|--------|-------------|-----------|
| Scope | Affected only | ALL packages |
| Purpose | Fast PR validation | Full codebase cleanup |
| Turbo | `--filter=[main...HEAD]` | No filter (all) |
| Nx | `nx affected` | `nx run-many --all` |
| pnpm | `--filter='...[main]'` | `-r` (recursive all) |

## When to Use Full Workspace

- **Initial setup** - First-time fix-hard run on a project
- **Major refactors** - Changes that might affect unrelated packages
- **Release prep** - Ensuring entire codebase is clean
- **Scheduled CI** - Weekly full quality check

## Detection Script

```bash
#!/bin/bash
# Detect monorepo and set full workspace commands

if [ -f "turbo.json" ]; then
  echo "MONOREPO=turbo"
  echo "LINT_CMD='turbo run lint'"
  echo "TYPE_CMD='turbo run type-check'"
elif [ -f "nx.json" ]; then
  echo "MONOREPO=nx"
  echo "LINT_CMD='nx run-many -t lint --all --parallel=4'"
  echo "TYPE_CMD='nx run-many -t type-check --all --parallel=4'"
elif [ -f "pnpm-workspace.yaml" ]; then
  echo "MONOREPO=pnpm"
  echo "LINT_CMD='pnpm -r run lint'"
  echo "TYPE_CMD='pnpm -r run type-check'"
else
  echo "MONOREPO=none"
  echo "LINT_CMD='npm run lint -- --max-warnings 0'"
  echo "TYPE_CMD='npm run type-check'"
fi
```
