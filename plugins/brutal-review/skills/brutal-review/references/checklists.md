# Mandatory Checklists

All checklists MUST be completed before scoring. No shortcuts.

---

## Security Checklist (70 points → normalize to 100)

| # | Check | Score (0-10) | Notes |
|---|-------|--------------|-------|
| 1 | Input sanitization on ALL user inputs | /10 | |
| 2 | No secrets/env vars exposed in code | /10 | |
| 3 | Parameterized queries (no string concat SQL) | /10 | |
| 4 | XSS prevention (output encoding, CSP) | /10 | |
| 5 | Auth/authz properly implemented | /10 | |
| 6 | CORS configured correctly | /10 | |
| 7 | Rate limiting present on sensitive endpoints | /10 | |
| **Security Subtotal** | /70 → normalize to /100 | |

### Additional Security Checks
- [ ] CSRF tokens on state-changing operations
- [ ] Secure session management
- [ ] Password hashing with strong algorithm (bcrypt, argon2)
- [ ] HTTPS enforced
- [ ] Security headers present (HSTS, X-Frame-Options, etc.)
- [ ] No dangerous code execution with user input
- [ ] File upload validation
- [ ] Dependency vulnerabilities checked

---

## Architecture Checklist (60 points → normalize to 100)

| # | Check | Score (0-10) | Notes |
|---|-------|--------------|-------|
| 1 | Files under 300 lines of code* | /10 | |
| 2 | JSDoc headers present | /10 | |
| 3 | Single responsibility per file | /10 | |
| 4 | Domain-based naming (not utils2.js) | /10 | |
| 5 | No circular dependencies | /10 | |
| 6 | Proper separation of concerns | /10 | |
| **Architecture Subtotal** | /60 → normalize to /100 | |

*Exempt: test files, config files, generated files

### Additional Architecture Checks
- [ ] Clear module boundaries
- [ ] Dependency direction flows correctly
- [ ] Configuration isolated from code
- [ ] Tests mirror source structure
- [ ] No god modules
- [ ] Clean public interfaces (index.ts exports)
- [ ] Consistent project structure

---

## Code Quality Checklist (70 points → normalize to 100)

| # | Check | Score (0-10) | Notes |
|---|-------|--------------|-------|
| 1 | No god objects (>5 responsibilities) | /10 | |
| 2 | No deep nesting (>3 levels) | /10 | |
| 3 | No magic numbers (use constants) | /10 | |
| 4 | No dead code (unused functions/vars) | /10 | |
| 5 | Error handling present | /10 | |
| 6 | Edge cases considered | /10 | |
| 7 | Tests exist and pass | /10 | |
| **Code Quality Subtotal** | /70 → normalize to /100 | |

### Additional Quality Checks
- [ ] No empty catch blocks
- [ ] Proper null/undefined handling
- [ ] No silent failures
- [ ] Logging present for errors
- [ ] Input validation on functions
- [ ] Return types consistent
- [ ] No TODO/FIXME in production code

---

## Performance Checklist (50 points → normalize to 100)

| # | Check | Score (0-10) | Notes |
|---|-------|--------------|-------|
| 1 | No obvious N+1 queries | /10 | |
| 2 | Proper async/await usage | /10 | |
| 3 | No blocking operations in hot paths | /10 | |
| 4 | Efficient data structures used | /10 | |
| 5 | No memory leaks (cleanup present) | /10 | |
| **Performance Subtotal** | /50 → normalize to /100 | |

### Additional Performance Checks
- [ ] Pagination on large datasets
- [ ] Connection pooling for databases
- [ ] Caching where appropriate
- [ ] Lazy loading for heavy resources
- [ ] No SELECT * queries
- [ ] Indexes on frequently queried columns
- [ ] Bundle size optimized (frontend)
- [ ] No unnecessary re-renders (React)

---

## Style & Standards Checklist (50 points → normalize to 100)

| # | Check | Score (0-10) | Notes |
|---|-------|--------------|-------|
| 1 | Consistent naming conventions | /10 | |
| 2 | Proper formatting/indentation | /10 | |
| 3 | Comments where logic isn't obvious | /10 | |
| 4 | No linter warnings | /10 | |
| 5 | Follows project conventions | /10 | |
| **Style Subtotal** | /50 → normalize to /100 | |

### Additional Style Checks
- [ ] Import organization (grouped, sorted)
- [ ] Consistent quote style
- [ ] Line length under limit (100-120)
- [ ] No mixed tabs/spaces
- [ ] JSDoc on public APIs
- [ ] Meaningful variable names
- [ ] No abbreviations unless standard

---

## Checklist Completion Rules

1. **Score EVERY item** - No blanks allowed
2. **Add notes** for any score below 8
3. **0 = Complete failure** of the check
4. **10 = Perfect** compliance
5. **Partial compliance** = proportional score (e.g., 7/10 inputs sanitized = 7)

---

## Quick Reference: What Scores Mean

| Score | Meaning |
|-------|---------|
| 10 | Perfect - no issues found |
| 8-9 | Good - minor issues only |
| 6-7 | Acceptable - some issues |
| 4-5 | Below standard - multiple issues |
| 2-3 | Poor - serious issues |
| 0-1 | Failed - fundamental problems |
