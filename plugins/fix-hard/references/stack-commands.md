# Stack Commands Reference

Commands for each stack with STRICT flags enabled.

---

## TypeScript/JavaScript (Node)

### Type Checking
```bash
# Standard strict check
npx tsc --noEmit --strict

# With specific strict flags
npx tsc --noEmit --strict --noImplicitAny --strictNullChecks --strictFunctionTypes

# Check specific directory
npx tsc --noEmit --strict --project tsconfig.json
```

### Linting
```bash
# ESLint with zero warnings
npm run lint -- --max-warnings 0

# ESLint with auto-fix
npm run lint -- --fix --max-warnings 0

# Direct ESLint call
npx eslint . --ext .ts,.tsx --max-warnings 0

# With fix
npx eslint . --ext .ts,.tsx --fix --max-warnings 0
```

### Suppression Scan
```bash
grep -rn "@ts-ignore\|@ts-expect-error\|eslint-disable" --include="*.ts" --include="*.tsx" src/
```

---

## Python

### Type Checking
```bash
# MyPy strict mode
mypy . --strict

# With specific options
mypy . --strict --warn-return-any --warn-unused-ignores --disallow-any-generics

# Check specific directory
mypy src/ --strict
```

### Linting
```bash
# Ruff check
ruff check .

# Ruff with auto-fix (safe)
ruff check . --fix

# Ruff with unsafe fixes (aggressive)
ruff check . --fix --unsafe-fixes

# Ruff format check
ruff format --check .

# Ruff format apply
ruff format .
```

### Suppression Scan
```bash
grep -rn "# type: ignore\|# noqa\|# pylint: disable" --include="*.py" .
```

---

## Go

### Vet Check
```bash
# Standard vet
go vet ./...

# With shadow check
go vet -vettool=$(which shadow) ./...
```

### Linting
```bash
# golangci-lint default
golangci-lint run

# With all linters
golangci-lint run --enable-all

# With auto-fix
golangci-lint run --fix

# Aggressive mode
golangci-lint run --enable-all --fix --timeout 5m
```

### Format Check
```bash
# Check formatting
gofmt -l .

# Apply formatting
gofmt -w .

# With imports
goimports -l .
goimports -w .
```

### Suppression Scan
```bash
grep -rn "//nolint\|// nolint" --include="*.go" .
```

---

## Rust

### Clippy (Lint)
```bash
# Clippy with warnings as errors
cargo clippy -- -D warnings

# Clippy with all lints
cargo clippy -- -D warnings -W clippy::all -W clippy::pedantic

# Clippy with fix
cargo clippy --fix -- -D warnings
```

### Format Check
```bash
# Check formatting
cargo fmt --check

# Apply formatting
cargo fmt
```

### Build Check
```bash
# Check compilation
cargo check

# Check with all features
cargo check --all-features
```

### Suppression Scan
```bash
grep -rn "#\[allow(" --include="*.rs" src/
```

---

## Error Counting Commands

### TypeScript
```bash
# Count type errors
npx tsc --noEmit 2>&1 | grep -c "error TS" || echo 0

# Count lint errors
npm run lint 2>&1 | grep -cE "^\s+\d+:\d+\s+(error|warning)" || echo 0
```

### Python
```bash
# Count mypy errors
mypy . 2>&1 | grep -c "error:" || echo 0

# Count ruff errors
ruff check . 2>&1 | grep -c "error\|warning" || echo 0
```

### Go
```bash
# Count vet errors
go vet ./... 2>&1 | wc -l

# Count lint errors
golangci-lint run 2>&1 | grep -c ":" || echo 0
```

### Rust
```bash
# Count clippy errors
cargo clippy 2>&1 | grep -c "error\[" || echo 0

# Count format issues
cargo fmt --check 2>&1 | grep -c "Diff" || echo 0
```
