# Zero Tolerance Rules by Category

## Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| CRITICAL | Blocks all progress | Must fix immediately |
| MAJOR | Serious quality issue | Must fix before completion |
| MINOR | Style/preference | Fix if time permits |

**Note**: In /fix-hard, MINOR issues are promoted to MAJOR.

---

## TypeScript/JavaScript Rules

### Type Errors (CRITICAL)

| Code | Description | Fix Strategy |
|------|-------------|--------------|
| TS2322 | Type mismatch | Add proper type annotation |
| TS2345 | Argument type mismatch | Cast or fix function signature |
| TS2339 | Property doesn't exist | Add to interface or use optional chaining |
| TS2531 | Possibly null | Add null check or assertion |
| TS2571 | Object is unknown | Add type guard |
| TS7006 | Implicit any | Add explicit type |
| TS7053 | Index signature | Add proper index type |

### Suppression Comments (CRITICAL - MUST REMOVE)

| Pattern | Violation | Fix |
|---------|-----------|-----|
| `@ts-ignore` | Silences all errors | Remove and fix underlying issue |
| `@ts-expect-error` | Expects error to occur | Remove and fix the code |
| `eslint-disable` | Disables lint rule | Remove and fix violation |
| `eslint-disable-next-line` | Single line disable | Remove and fix |
| `eslint-disable-line` | Inline disable | Remove and fix |

### Banned Types (CRITICAL)

| Type | Why Banned | Replacement |
|------|------------|-------------|
| `any` | Type safety escape hatch | Proper type or `unknown` |
| `object` | Too broad | Specific interface |
| `Function` | No signature | Specific function type |
| `{}` | Empty object type | `Record<string, unknown>` or specific |

### Lint Errors (MAJOR)

| Rule | Description | Fix |
|------|-------------|-----|
| no-unused-vars | Unused variable | Delete or use it |
| no-console | Console statement | Remove or use logger |
| no-explicit-any | Explicit any type | Add proper type |
| prefer-const | Var could be const | Change to const |
| no-var | Using var | Change to let/const |

---

## Python Rules

### Type Errors (CRITICAL)

| Error | Description | Fix |
|-------|-------------|-----|
| Incompatible types | Type mismatch | Fix annotation or cast |
| Missing return | No return type | Add return annotation |
| Arg missing | Missing argument | Add or make optional |
| Cannot infer | Type cannot be inferred | Add explicit annotation |

### Suppression Comments (CRITICAL - MUST REMOVE)

| Pattern | Fix |
|---------|-----|
| `# type: ignore` | Remove and fix type error |
| `# noqa` | Remove and fix lint error |
| `# pylint: disable` | Remove and fix violation |
| `# mypy: ignore-errors` | Remove and fix all errors |

### Lint Errors (MAJOR)

| Rule | Description | Fix |
|------|-------------|-----|
| F401 | Unused import | Remove import |
| F841 | Unused variable | Remove or use |
| E501 | Line too long | Break line |
| W503 | Line break before operator | Reformat |

---

## Go Rules

### Vet Errors (CRITICAL)

| Error | Description | Fix |
|-------|-------------|-----|
| unreachable code | Dead code | Remove it |
| shadowed variable | Variable shadows another | Rename |
| composite literal | Missing field names | Add field names |

### Suppression Comments (CRITICAL - MUST REMOVE)

| Pattern | Fix |
|---------|-----|
| `//nolint` | Remove and fix lint error |
| `// nolint:` | Remove and fix specific lint |
| `//lint:ignore` | Remove and fix |

### Lint Errors (MAJOR)

| Linter | Common Issues | Fix |
|--------|---------------|-----|
| errcheck | Unchecked error | Check the error |
| ineffassign | Ineffective assign | Remove or use |
| staticcheck | Various issues | Follow suggestion |

---

## Rust Rules

### Clippy Errors (CRITICAL)

| Lint | Description | Fix |
|------|-------------|-----|
| needless_return | Explicit return | Remove return keyword |
| clone_on_copy | Clone on Copy type | Remove clone |
| redundant_closure | Unnecessary closure | Use function directly |

### Suppression Comments (CRITICAL - MUST REMOVE)

| Pattern | Fix |
|---------|-----|
| `#[allow(..)]` | Remove and fix the warning |
| `#![allow(..)]` | Remove crate-level allow |

**Exception**: `// SAFETY:` comments for unsafe blocks are ALLOWED but must explain why.

### Lint Errors (MAJOR)

| Category | Fix |
|----------|-----|
| Formatting | Run `cargo fmt` |
| Dead code | Remove or use |
| Unused imports | Remove |

---

## Universal Rules (All Stacks)

### Always Remove

1. All suppression comments (except Rust SAFETY)
2. All TODO/FIXME comments that are actually fixed
3. All commented-out code
4. All debug statements (console.log, print, fmt.Println for debug)

### Always Fix

1. Type errors - no exceptions
2. Unused variables - delete or use
3. Unused imports - delete
4. Unreachable code - delete
5. Shadowed variables - rename

### Never Add

1. New suppression comments
2. New `any` types
3. New type assertions (use type guards)
4. New `// @ts-ignore` or equivalents
