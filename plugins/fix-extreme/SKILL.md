---
name: fix-extreme
description: Fast build-focused code quality enforcement. Fixes only BLOCKING errors using parallel agents. Supports monorepos (Turbo/Nx/pnpm) with affected-only scanning.
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, Task, TodoWrite
---

# Fix Extreme - Zero Tolerance Mode

A ruthless code quality enforcement skill that spawns specialized parallel agents to fix ALL blocking errors. No mercy, no warnings-only passes.

## Step 0: Performance Cache Check

**Run FIRST before any quality checks:**

```bash
# Calculate hash of source files
CURRENT_HASH=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs sha256sum 2>/dev/null | sha256sum | cut -d' ' -f1)
CACHE_FILE=".fix-extreme-cache"

if [ -f "$CACHE_FILE" ] && [ "$(cat $CACHE_FILE)" = "$CURRENT_HASH" ]; then
  echo "=== CACHE HIT - Already clean, no changes since last run ==="
  exit 0
fi
```

If cache hit, report success and STOP. Otherwise, continue to Step 0.5.

## Step 0.5: Detect Monorepo

Check for monorepo tools and use affected-only commands for SPEED:

```
IF turbo.json EXISTS:
  MONOREPO="turbo"
  TYPE_CMD="turbo run type-check --filter=[origin/main...HEAD]"
  LINT_CMD="turbo run lint --filter=[origin/main...HEAD]"

ELSE IF nx.json EXISTS:
  MONOREPO="nx"
  TYPE_CMD="nx affected -t type-check --parallel=4"
  LINT_CMD="nx affected -t lint --parallel=4"

ELSE IF pnpm-workspace.yaml EXISTS:
  MONOREPO="pnpm"
  TYPE_CMD="pnpm -r --filter='...[origin/main]' run type-check"
  LINT_CMD="pnpm -r --filter='...[origin/main]' run lint"

ELSE:
  MONOREPO="none"
  TYPE_CMD="npm run type-check"
  LINT_CMD="npm run lint"
```

Use the detected commands in Step 1 instead of the default npm commands.

## Step 1: Run All Quality Checks

Execute these commands and capture FULL output:

```bash
# TypeScript - capture all errors
npm run type-check 2>&1 || true

# ESLint - capture all errors (not just warnings)
npm run lint 2>&1 || true

# Prettier - check for format violations
npx prettier --check "src/**/*.{ts,tsx,js,jsx}" 2>&1 || true
```

**CRITICAL:** Capture the EXACT output. Do not summarize. Count errors precisely.

## Step 2: Classify Errors Into Domains

Parse output and categorize:

| Domain | Pattern | Example |
|--------|---------|---------|
| **TYPE** | `TS2xxx`, `error TS`, type mismatch | `TS2322: Type 'string' is not assignable` |
| **LINT** | `eslint`, rule violations with `error` | `@typescript-eslint/no-unused-vars` |
| **FORMAT** | `prettier`, `Forgot to run Prettier` | `src/file.tsx` (in prettier check output) |
| **IMPORT** | `Cannot find module`, `Module not found` | `TS2307: Cannot find module '@/lib/foo'` |

**Count errors per domain.** If ZERO errors total: Report `=== CLEAN ===` and STOP.

## Step 3: Valid Fix Criteria (Zero Tolerance)

A fix is ONLY valid if the error is:

1. **BLOCKING** - Build/compilation fails without fix
2. **BROKEN** - Will cause runtime errors
3. **DANGEROUS** - Type safety violations that hide bugs

**NOT valid to fix (ignore these):**
- Warnings that don't fail the build (unless project uses `--max-warnings 0`)
- Style suggestions without actual errors
- "Could be better" recommendations
- Working code that just isn't pretty

## Step 3.5: Security Scan (Critical Only)

**ONLY scan for vulnerabilities that BLOCK the build or cause runtime failures:**

```bash
# Semgrep with ERROR severity only
semgrep scan --config "p/security-audit" --severity ERROR --json 2>&1 || true
```

Parse output for CRITICAL issues:
- SQL injection in production code
- Command injection
- Path traversal
- Hardcoded secrets (if CI fails on them)

IF CRITICAL_SECURITY_ERRORS > 0:
  Add to error categories, spawn security-fixer agent in Step 4

## Step 4: Spawn Parallel Fixer Agents

**CRITICAL:** Spawn agents in a SINGLE response with MULTIPLE Task tool calls.

Only spawn agents for domains WITH errors:

### Agent: Type Fixer (if TYPE errors > 0)
```
subagent_type: general-purpose
prompt: |
  You are a TypeScript compiler error specialist.

  ERRORS TO FIX:
  [PASTE EXACT TYPE ERRORS HERE]

  RULES:
  1. Read the file BEFORE editing
  2. Understand WHY the type error occurs
  3. Fix with PROPER typing - NEVER use `any` or `as any`
  4. Prefer type narrowing, generics, or proper interfaces
  5. After each fix, verify locally with: npx tsc --noEmit [file]

  OUTPUT FORMAT:
  [FIXED] file:line - TS2xxx description
  Applied: What you actually changed
```

### Agent: Lint Fixer (if LINT errors > 0)
```
subagent_type: general-purpose
prompt: |
  You are an ESLint error specialist.

  ERRORS TO FIX:
  [PASTE EXACT LINT ERRORS HERE]

  RULES:
  1. Read the file BEFORE editing
  2. Apply the STANDARD fix for each rule
  3. Do NOT add eslint-disable comments unless absolutely necessary
  4. After each fix, verify with: npx eslint [file]

  OUTPUT FORMAT:
  [FIXED] file:line - rule-name description
  Applied: What you actually changed
```

### Agent: Format Fixer (if FORMAT errors > 0)
```
subagent_type: general-purpose
prompt: |
  You are a Prettier format specialist.

  FILES TO FORMAT:
  [PASTE LIST OF UNFORMATTED FILES]

  RULES:
  1. Just run: npx prettier --write [files]
  2. Verify with: npx prettier --check [files]

  OUTPUT FORMAT:
  [FORMATTED] file - Applied prettier
```

### Agent: Import Fixer (if IMPORT errors > 0)
```
subagent_type: general-purpose
prompt: |
  You are a module resolution specialist.

  IMPORT ERRORS TO FIX:
  [PASTE EXACT IMPORT ERRORS HERE]

  RULES:
  1. Check if the module EXISTS at the path
  2. Check if the EXPORT exists in the module
  3. Fix path aliases (@/ vs relative)
  4. Check for typos in import names
  5. Verify the fix compiles: npx tsc --noEmit [file]

  OUTPUT FORMAT:
  [FIXED] file:line - Module 'X' resolution
  Applied: Corrected import from X to Y
```

### Agent: Security Fixer (if CRITICAL security errors > 0)
```
subagent_type: general-purpose
prompt: |
  You are a CRITICAL security vulnerability specialist.

  ERRORS TO FIX:
  [PASTE CRITICAL SECURITY ERRORS]

  RULES:
  1. ONLY fix vulnerabilities that BLOCK build or cause runtime failures
  2. Parameterize SQL queries
  3. Sanitize shell command inputs
  4. Fix path traversal issues
  5. Remove hardcoded secrets if CI checks for them

  OUTPUT FORMAT:
  [FIXED] file:line - Vulnerability type
  Applied: What you changed
```

## Step 5: Verify All Fixes

After ALL agents complete, run the FULL check again:

```bash
npm run type-check 2>&1
npm run lint 2>&1
npx prettier --check "src/**/*.{ts,tsx,js,jsx}" 2>&1
```

### If errors remain:
- List remaining errors with exact `file:line`
- Spawn retry round (max 3 iterations total)
- On iteration 3 failure: Report remaining as UNFIXABLE

### If all pass:
- Report success with summary
- Save cache hash for next run:

```bash
# Save cache hash for next run
echo "$CURRENT_HASH" > .fix-extreme-cache
```

## Output Format

### Per-Fix Report:
```
[TYPE|LINT|FORMAT|IMPORT] file:line - Error description
Fixed: What was done
```

### Final Report:
```
=== FIX-EXTREME RESULTS ===
Starting errors: X type, Y lint, Z format, W import
Fixed: A type, B lint, C format, D import
Remaining: N errors (list them) OR CLEAN
Iterations: N/3
Verdict: CLEAN | PARTIAL (list unfixed) | FAILED (critical remaining)
```

## Retry Logic

| Iteration | Action |
|-----------|--------|
| 1 | Run all agents in parallel |
| 2 | Re-run ONLY for remaining errors, different approach |
| 3 | Final attempt, more aggressive fixes allowed |
| After 3 | Report UNFIXABLE with explanations |

## Quick Reference

```bash
# Manual verification commands
npm run type-check    # TypeScript
npm run lint          # ESLint
npx prettier --check "src/**/*.{ts,tsx,js,jsx}"  # Prettier
```

## Monorepo Quick Reference

| Tool | Affected-Only Lint Command |
|------|---------------------------|
| Turborepo | `turbo run lint --filter=[origin/main...HEAD]` |
| Nx | `nx affected -t lint --parallel=4` |
| pnpm | `pnpm -r --filter='...[origin/main]' run lint` |

## Cache Management

```bash
# Clear cache to force full re-scan
rm .fix-extreme-cache
```
