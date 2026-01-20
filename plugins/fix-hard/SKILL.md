---
name: fix-hard
description: Zero-tolerance code quality enforcement. Fixes ALL errors, warnings, suppressions, and security issues. Includes mutation testing, intelligent suppression audit, and optional hook generation. No mercy, no shortcuts.
argument-hint: "[scope]"
---

# /fix-hard - Zero Tolerance Error Enforcer

**Philosophy**: No warnings, no shortcuts, no excuses. Every suppression comment is a failure. Every `any` type is a crime. Every warning is an error in disguise.

## Prerequisites

Before running, ensure you have access to:
- Project root with package.json, pyproject.toml, go.mod, or Cargo.toml
- The TodoWrite tool for tracking progress
- The Task tool for spawning parallel fix agents

## Scope Argument

If `$ARGUMENTS` is provided, use it as the scope:
- `src/` - Only check src directory
- `src/components/` - Only check components
- `.` or empty - Check entire project

Default scope: Project root (`.`)

---

## STEP 0: PERFORMANCE CACHE

```bash
# Calculate hash of all source files
CURRENT_HASH=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" -o -name "*.rs" 2>/dev/null | grep -v node_modules | xargs sha256sum 2>/dev/null | sha256sum | cut -d' ' -f1)
CACHE_FILE=".fix-hard-cache"

if [ -f "$CACHE_FILE" ] && [ "$(cat $CACHE_FILE)" = "$CURRENT_HASH" ]; then
  echo "=== CACHE HIT - Codebase unchanged since last clean run ==="
  exit 0
fi
```

**Note:** Unlike /fix-extreme, /fix-hard runs on the ENTIRE codebase, not just affected files.

---

## STEP 0.5: DETECT MONOREPO (Full Workspace)

Check for monorepo tools. Unlike /fix-extreme, we run on ALL packages:

```
IF turbo.json EXISTS:
  MONOREPO="turbo"
  LINT_CMD="turbo run lint"  # ALL packages
  TYPE_CMD="turbo run type-check"

ELSE IF nx.json EXISTS:
  MONOREPO="nx"
  LINT_CMD="nx run-many -t lint --all --parallel=4"
  TYPE_CMD="nx run-many -t type-check --all --parallel=4"

ELSE IF pnpm-workspace.yaml EXISTS:
  MONOREPO="pnpm"
  LINT_CMD="pnpm -r run lint"
  TYPE_CMD="pnpm -r run type-check"

ELSE:
  MONOREPO="none"
  LINT_CMD="npm run lint -- --max-warnings 0"
  TYPE_CMD="npm run type-check"
```

---

## STEP 1: DETECT STACK

Detect the project stack by checking for config files:

```
IF package.json EXISTS AND (tsconfig.json EXISTS OR *.ts files):
  STACK = "typescript"
ELSE IF package.json EXISTS:
  STACK = "javascript"
ELSE IF pyproject.toml EXISTS OR requirements.txt EXISTS:
  STACK = "python"
ELSE IF go.mod EXISTS:
  STACK = "go"
ELSE IF Cargo.toml EXISTS:
  STACK = "rust"
ELSE:
  STACK = "unknown" → ASK USER
```

Use Bash to check:
```bash
ls package.json tsconfig.json pyproject.toml requirements.txt go.mod Cargo.toml 2>/dev/null
```

---

## STEP 2: SCAN FOR SUPPRESSIONS (Critical Pre-Check)

**Before ANY fixes, count all suppression comments.** These are considered ERRORS and MUST be removed.

Run this scan:
```bash
# TypeScript/JavaScript
grep -rn "@ts-ignore\|@ts-expect-error\|eslint-disable\|eslint-disable-next-line\|eslint-disable-line" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ 2>/dev/null | wc -l

# Python
grep -rn "# type: ignore\|# noqa\|# pylint: disable\|# mypy: ignore" --include="*.py" src/ 2>/dev/null | wc -l

# Go
grep -rn "//nolint\|// nolint" --include="*.go" . 2>/dev/null | wc -l

# Rust
grep -rn "#\[allow(\|// SAFETY:" --include="*.rs" src/ 2>/dev/null | wc -l
```

Store the count as `SUPPRESSION_COUNT`. This number MUST reach 0.

---

## STEP 2.5: INTELLIGENT SUPPRESSION AUDIT

**Don't just remove suppressions - CLASSIFY them first:**

```
FOR EACH suppression comment found:
  1. Read 10 lines of surrounding context
  2. Classify into:

  LEGITIMATE (Keep but document):
    - Third-party library type issues
    - Known framework quirks with linked issue
    - Test files with intentional mocking
    - Generated code markers

  EVASION (Must fix):
    - Lazy `as any` to avoid proper typing
    - Unused variable warnings hidden
    - console.log kept with disable
    - Complex types avoided with @ts-ignore

  UNKNOWN (Flag for human):
    - Architectural typing decisions
    - Complex generic issues
    - Legacy code needing major refactor

IF EVASION: Fix the root cause, spawn appropriate fixer agent
IF LEGITIMATE: Keep comment, add WHY explanation
IF UNKNOWN: Add to report for human review
```

**SPAWN suppression-auditor agent to classify.**

---

## STEP 3: RUN STRICT CHECKS

Reference: `$SKILL_DIR/references/stack-commands.md` for full command list.

### TypeScript/JavaScript
```bash
# Type checking with strict mode
npx tsc --noEmit --strict 2>&1 | tee /tmp/type-errors.txt
TYPE_ERRORS=$(grep -c "error TS" /tmp/type-errors.txt || echo 0)

# Lint with zero warnings tolerance
npm run lint -- --max-warnings 0 2>&1 | tee /tmp/lint-errors.txt
LINT_ERRORS=$(grep -cE "error|warning" /tmp/lint-errors.txt || echo 0)
```

### Python
```bash
# Type checking with strict mode
mypy . --strict 2>&1 | tee /tmp/type-errors.txt
TYPE_ERRORS=$(grep -c "error:" /tmp/type-errors.txt || echo 0)

# Lint with unsafe fixes enabled
ruff check . 2>&1 | tee /tmp/lint-errors.txt
LINT_ERRORS=$(grep -c "Found" /tmp/lint-errors.txt || echo 0)
```

### Go
```bash
# Vet for suspicious constructs
go vet ./... 2>&1 | tee /tmp/vet-errors.txt
VET_ERRORS=$(wc -l < /tmp/vet-errors.txt)

# golangci-lint with all linters
golangci-lint run 2>&1 | tee /tmp/lint-errors.txt
LINT_ERRORS=$(grep -c ":" /tmp/lint-errors.txt || echo 0)
```

### Rust
```bash
# Clippy with warnings as errors
cargo clippy -- -D warnings 2>&1 | tee /tmp/clippy-errors.txt
CLIPPY_ERRORS=$(grep -c "error\[" /tmp/clippy-errors.txt || echo 0)

# Format check
cargo fmt --check 2>&1 | tee /tmp/fmt-errors.txt
FMT_ERRORS=$(grep -c "Diff" /tmp/fmt-errors.txt || echo 0)
```

---

## STEP 3.5: COMPREHENSIVE SECURITY SCAN

Run full security analysis (unlike /fix-extreme which only checks critical):

```bash
# Semgrep with ALL severities and cross-file analysis
semgrep scan --config auto --pro --json 2>&1 | tee /tmp/security.json

# Parse results
CRITICAL=$(jq '[.results[] | select(.extra.severity == "ERROR")] | length' /tmp/security.json)
HIGH=$(jq '[.results[] | select(.extra.severity == "WARNING")] | length' /tmp/security.json)
MEDIUM=$(jq '[.results[] | select(.extra.severity == "INFO")] | length' /tmp/security.json)
SECURITY_TOTAL=$((CRITICAL + HIGH + MEDIUM))
```

**Categories scanned:**
- `p/security-audit` - General security
- `p/owasp-top-ten` - OWASP vulnerabilities
- `p/secrets` - Hardcoded secrets
- `p/supply-chain` - Dependency issues

IF SECURITY_TOTAL > 0: SPAWN security-fixer agent

---

## STEP 3.6: MUTATION TESTING

**Detect "fake" test coverage where tests pass but don't actually verify behavior:**

```bash
# Run Stryker mutation testing (incremental for speed)
npx stryker run --incremental 2>&1 | tee /tmp/mutation.txt

# Extract mutation score
MUTATION_SCORE=$(grep "Mutation score" /tmp/mutation.txt | grep -oP '\d+\.\d+' || echo "0")
```

| Score | Status | Action |
|-------|--------|--------|
| >= 80% | EXCELLENT | Continue |
| 60-79% | WARNING | Report, continue |
| < 60% | DANGER | SPAWN mutation-fixer agent |

**Mutation fixer focuses on:**
- Survived mutants (tests didn't catch the bug)
- BooleanLiteral mutations
- ConditionalExpression mutations

---

## STEP 4: CATEGORIZE ERRORS

Create a summary table:

| Category | Count | Severity | Agent |
|----------|-------|----------|-------|
| Type Errors | $TYPE_ERRORS | CRITICAL | type-fixer |
| Lint Errors | $LINT_ERRORS | MAJOR | lint-fixer |
| Import Errors | $IMPORT_ERRORS | MAJOR | import-fixer |
| Suppressions | $SUPPRESSION_COUNT | CRITICAL | lint-fixer |
| **TOTAL** | $TOTAL | | |

Reference: `$SKILL_DIR/references/strict-rules.md` for error classification.

---

## STEP 5: SPAWN PARALLEL FIX AGENTS

**CRITICAL**: Spawn ALL applicable agents in a SINGLE message using the Task tool.

```
IF TYPE_ERRORS > 0:
  SPAWN type-fixer agent with instructions from $SKILL_DIR/agents/type-fixer.md

IF LINT_ERRORS > 0 OR SUPPRESSION_COUNT > 0:
  SPAWN lint-fixer agent with instructions from $SKILL_DIR/agents/lint-fixer.md

IF IMPORT_ERRORS > 0:
  SPAWN import-fixer agent with instructions from $SKILL_DIR/agents/import-fixer.md

IF FORMAT_ERRORS > 0:
  SPAWN format-fixer agent with instructions from $SKILL_DIR/agents/format-fixer.md

IF SECURITY_TOTAL > 0:
  SPAWN security-fixer agent with instructions from $SKILL_DIR/agents/security-fixer.md

IF MUTATION_SCORE < 60:
  SPAWN mutation-fixer agent with instructions from $SKILL_DIR/agents/mutation-fixer.md

IF SUPPRESSION_COUNT > 0:
  SPAWN suppression-auditor agent with instructions from $SKILL_DIR/agents/suppression-auditor.md
```

### Agent Task Prompts

**type-fixer**:
```
You are a TYPE ERROR SPECIALIST. Your mission:
1. Fix ALL type errors in the codebase
2. Remove ALL `any` types - replace with proper types
3. Remove ALL @ts-ignore and @ts-expect-error comments
4. Enable strict null checks compliance

Stack: $STACK
Scope: $SCOPE
Error file: /tmp/type-errors.txt

Rules from: $SKILL_DIR/agents/type-fixer.md

Report: List all files modified with error count fixed.
```

**lint-fixer**:
```
You are a LINT ERROR SPECIALIST. Your mission:
1. Fix ALL lint errors and warnings
2. Remove ALL suppression comments (eslint-disable, noqa, nolint)
3. Fix unused variables (delete or use them)
4. Fix formatting issues
5. Remove console.log statements (use proper logging or delete)

Stack: $STACK
Scope: $SCOPE
Error file: /tmp/lint-errors.txt

Rules from: $SKILL_DIR/agents/lint-fixer.md

Report: List all files modified with error count fixed.
```

**import-fixer**:
```
You are an IMPORT ERROR SPECIALIST. Your mission:
1. Fix ALL import/module resolution errors
2. Fix path aliases (@/ paths)
3. Add missing dependencies to package.json if needed
4. Remove unused imports

Stack: $STACK
Scope: $SCOPE

Rules from: $SKILL_DIR/agents/import-fixer.md

Report: List all files modified with error count fixed.
```

**format-fixer**:
```
You are a FORMAT SPECIALIST. Your mission:
1. Fix ALL formatting inconsistencies
2. Apply Prettier/ESLint formatting rules
3. Fix indentation, spacing, and line endings
4. Ensure consistent code style across the codebase

Stack: $STACK
Scope: $SCOPE
Error file: /tmp/fmt-errors.txt

Rules from: $SKILL_DIR/agents/format-fixer.md

Report: List all files modified with formatting fixes applied.
```

**security-fixer**:
```
You are a SECURITY SPECIALIST. Your mission:
1. Fix ALL security vulnerabilities found by Semgrep
2. Address OWASP Top 10 issues
3. Remove hardcoded secrets and credentials
4. Fix injection vulnerabilities, XSS, CSRF issues
5. Address supply-chain security concerns

Stack: $STACK
Scope: $SCOPE
Error file: /tmp/security.json

Rules from: $SKILL_DIR/agents/security-fixer.md

Report: List all security issues fixed with severity levels.
```

**mutation-fixer**:
```
You are a TEST QUALITY SPECIALIST. Your mission:
1. Improve tests that failed mutation testing
2. Add assertions for survived mutants
3. Cover BooleanLiteral mutation gaps
4. Cover ConditionalExpression mutation gaps
5. Ensure tests actually verify behavior, not just coverage

Stack: $STACK
Scope: $SCOPE
Error file: /tmp/mutation.txt

Rules from: $SKILL_DIR/agents/mutation-fixer.md

Report: List tests improved and mutation score impact.
```

**suppression-auditor**:
```
You are a SUPPRESSION AUDITOR. Your mission:
1. Classify all suppression comments (LEGITIMATE, EVASION, UNKNOWN)
2. For EVASION: Fix the root cause and remove suppression
3. For LEGITIMATE: Add WHY explanation comment
4. For UNKNOWN: Add to report for human review
5. Never blindly remove suppressions without understanding context

Stack: $STACK
Scope: $SCOPE

Rules from: $SKILL_DIR/agents/suppression-auditor.md

Report: List suppressions classified and actions taken.
```

---

## STEP 6: VERIFICATION LOOP

**Maximum iterations: 5**

```
iteration = 1
WHILE iteration <= 5:

  # Re-run all strict checks
  RUN STEP 3 (strict checks)
  RUN STEP 2 (suppression scan)

  TOTAL = TYPE_ERRORS + LINT_ERRORS + IMPORT_ERRORS + SUPPRESSION_COUNT

  IF TOTAL == 0:
    BREAK → SUCCESS

  IF iteration < 5:
    # Spawn agents for remaining errors
    RUN STEP 5 (spawn agents)

  iteration++

IF iteration == 5 AND TOTAL > 0:
  → FAILURE (report remaining issues)
```

---

## STEP 7: FINAL REPORT

Generate the final verdict:

### SUCCESS TEMPLATE
```markdown
## /fix-hard Results: PASS

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Type Errors | $INITIAL_TYPE | 0 | CLEAN |
| Lint Errors | $INITIAL_LINT | 0 | CLEAN |
| Import Errors | $INITIAL_IMPORT | 0 | CLEAN |
| Suppressions | $INITIAL_SUPPRESS | 0 | CLEAN |
| **TOTAL** | **$INITIAL_TOTAL** | **0** | **PASS** |

**Iterations**: $ITERATION/5
**Files Modified**: $FILES_MODIFIED
**Time**: $ELAPSED

The codebase is now CLEAN. Zero tolerance achieved.
```

### FAILURE TEMPLATE
```markdown
## /fix-hard Results: FAIL

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Type Errors | $INITIAL_TYPE | $FINAL_TYPE | $STATUS |
| Lint Errors | $INITIAL_LINT | $FINAL_LINT | $STATUS |
| Import Errors | $INITIAL_IMPORT | $FINAL_IMPORT | $STATUS |
| Suppressions | $INITIAL_SUPPRESS | $FINAL_SUPPRESS | $STATUS |
| **TOTAL** | **$INITIAL_TOTAL** | **$FINAL_TOTAL** | **FAIL** |

**Iterations**: 5/5 (MAX REACHED)
**Files Modified**: $FILES_MODIFIED

### Remaining Issues
[List specific errors that couldn't be fixed]

### Manual Action Required
[List files and issues requiring human intervention]
```

---

## STEP 7.5: HOOK GENERATION (Optional)

If `$ARGUMENTS` contains `--setup-hooks`:

Generate PostToolUse hooks for continuous enforcement:

```bash
mkdir -p .claude/hooks
cat > .claude/hooks/post-edit-lint.sh << 'EOF'
#!/bin/bash
# Auto-lint after every edit
FILE="$1"
if [[ "$FILE" == *.ts || "$FILE" == *.tsx || "$FILE" == *.js || "$FILE" == *.jsx ]]; then
  npx eslint "$FILE" --fix --max-warnings 0 2>/dev/null
  npx prettier "$FILE" --write 2>/dev/null
fi
EOF
chmod +x .claude/hooks/post-edit-lint.sh
```

Report: "Hooks installed. Every edit will now be auto-linted."

---

## STRICT ENFORCEMENT RULES

Reference: `$SKILL_DIR/references/strict-rules.md`

| Rule | Enforcement |
|------|-------------|
| Warnings = Errors | ALL warnings treated as errors |
| No `@ts-ignore` | Remove or fix, NEVER suppress |
| No `eslint-disable` | Remove or fix the root cause |
| No `any` type | MUST be typed properly |
| No unused vars | Delete or use them |
| No implicit any | Enable strict mode |
| No console.log | Remove or use proper logging |
| No type assertions | Use type guards instead |

---

## COMPARISON: /fix vs /fix-extreme vs /fix-hard

| Aspect | /fix | /fix-extreme | /fix-hard |
|--------|------|--------------|-----------|
| Warnings | Ignore | Ignore | ERRORS |
| Suppressions | Allow | Allow | AUDIT + REMOVE |
| `any` types | Allow | Block | MUST FIX |
| Security scan | No | Critical only | Comprehensive |
| Mutation testing | No | No | Stryker |
| Monorepo | No | Affected-only | Full workspace |
| Max iterations | 3 | 3 | 5 |
| Hook generation | No | No | Optional |
| Philosophy | "Good enough" | "Build works" | "Zero tolerance" |

---

## EXAMPLES

### Example 1: TypeScript Project
```
User: /fix-hard src/