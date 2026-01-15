# Deduction Reference

## Severity Levels

| Severity | Points | Description |
|----------|--------|-------------|
| **CATASTROPHIC** | -25 to -30 | Critical flaws that must be fixed immediately |
| **MAJOR** | -15 to -20 | Significant issues requiring attention |
| **MODERATE** | -8 to -12 | Notable problems that should be addressed |
| **MINOR** | -3 to -5 | Small issues for polish |

---

## Auto-Deductions (Non-Negotiable)

These deductions apply automatically when detected. No exceptions.

### Security Auto-Deductions

| Violation | Deduction | Multi-Category |
|-----------|-----------|----------------|
| Hardcoded secrets (API keys, passwords) | -30 | Security |
| SQL string concatenation (injection risk) | -25 | Security, Quality |
| No input validation on user input | -20 | Security, Architecture |
| eval/exec with user input | -30 | Security |
| Missing authentication on sensitive route | -25 | Security, Architecture |
| Wildcard CORS (*) in production | -15 | Security |
| HTTP instead of HTTPS | -15 | Security |
| Disabled security features | -20 | Security |
| Storing passwords in plaintext | -30 | Security |

### Architecture Auto-Deductions

| Violation | Deduction | Multi-Category |
|-----------|-----------|----------------|
| File > 300 lines (non-exempt) | -15 | Architecture, Quality |
| Generic filename (utils.js, helpers.ts) | -10 | Architecture, Style |
| Circular dependency | -15 | Architecture |
| No separation of concerns | -20 | Architecture, Quality |
| Mixed layer responsibilities | -15 | Architecture |
| Missing module boundaries | -15 | Architecture, Quality |

### Code Quality Auto-Deductions

| Violation | Deduction | Multi-Category |
|-----------|-----------|----------------|
| Empty catch block | -20 | Quality, Security |
| God object (>5 responsibilities) | -15 | Quality, Architecture |
| Deep nesting (>3 levels) | -10 | Quality |
| console.log in production code | -5 | Quality |
| Unused imports | -3 each | Quality, Style |
| TODO/FIXME comments left | -5 each | Quality |
| No error handling on async | -15 | Quality, Security |
| Missing null checks | -10 | Quality |
| Dead code (unused functions) | -5 each | Quality |
| Swallowed exception (log and ignore) | -10 | Quality |

### Performance Auto-Deductions

| Violation | Deduction | Multi-Category |
|-----------|-----------|----------------|
| N+1 query pattern | -20 | Performance |
| Sync I/O in request handler | -15 | Performance, Quality |
| Unbounded query (no LIMIT) | -15 | Performance, Security |
| Memory leak (missing cleanup) | -15 | Performance, Quality |
| No connection pooling | -10 | Performance |
| SELECT * instead of columns | -5 | Performance |
| Missing indexes on FK | -10 | Performance |
| O(n²) when O(n) possible | -10 | Performance |

### Style Auto-Deductions

| Violation | Deduction | Multi-Category |
|-----------|-----------|----------------|
| Missing JSDoc header (non-exempt) | -10 | Style |
| Inconsistent naming convention | -5 each | Style |
| Linter warnings present | -3 each | Style, Quality |
| Mixed quote styles | -5 | Style |
| Unorganized imports | -5 | Style |
| Lines > 120 characters | -3 each | Style |
| Tabs mixed with spaces | -10 | Style |

---

## OWASP-Specific Deductions

### A01: Broken Access Control

| Issue | Deduction |
|-------|-----------|
| Missing function-level access control | -25 |
| IDOR vulnerability | -25 |
| Privilege escalation possible | -30 |
| Path traversal vulnerability | -25 |

### A02: Cryptographic Failures

| Issue | Deduction |
|-------|-----------|
| Sensitive data in plaintext | -25 |
| Weak algorithms (MD5, SHA1 for passwords) | -20 |
| Hardcoded encryption keys | -30 |

### A03: Injection

| Issue | Deduction |
|-------|-----------|
| SQL injection | -30 |
| NoSQL injection | -25 |
| Command injection | -30 |
| XSS vulnerability | -25 |

### A04-A10

| Category | Typical Deduction |
|----------|-------------------|
| Insecure Design | -15 to -20 |
| Security Misconfiguration | -10 to -20 |
| Vulnerable Components | -15 to -25 |
| Auth Failures | -20 to -30 |
| Software/Data Integrity | -15 to -25 |
| Logging Failures | -10 to -15 |
| SSRF | -20 to -30 |

---

## Cumulative Deduction Rules

### Maximum Deduction Per Category
No single category can go below 0. If deductions exceed 100, cap at 0.

### Multi-Category Impact
When a single issue affects multiple categories:
1. Apply FULL deduction to primary category
2. Apply 60% deduction to secondary categories
3. Apply 40% deduction to tertiary categories

**Example: SQL Injection**
- Primary: Security -25 (full)
- Secondary: Quality -15 (60% of -25 = -15)
- Tertiary: Architecture -10 (40% of -25 = -10)

### Stacking
Multiple instances of the same issue stack deductions:
- First instance: Full deduction
- Second instance: 75% deduction
- Third+ instances: 50% deduction each

**Example: 3 empty catch blocks**
- First: -20
- Second: -15
- Third: -10
- Total: -45

---

## Positive Adjustments (Rare)

In exceptional cases, small positive adjustments may apply:

| Achievement | Adjustment |
|-------------|------------|
| Comprehensive test coverage (>90%) | +5 Quality |
| Exceptional error handling | +3 Quality |
| Outstanding documentation | +3 Style |
| Innovative security measures | +5 Security |

**Note:** Positive adjustments are RARE and should not exceed +10 total.
