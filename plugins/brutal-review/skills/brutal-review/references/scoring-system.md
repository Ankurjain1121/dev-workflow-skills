# Zero Tolerance Scoring System

## Weighted Category Scoring

### Standard Weights (FULL Mode)

| Category | Weight | Agent |
|----------|--------|-------|
| Security | 30% | brutal-security |
| Architecture | 25% | brutal-architecture |
| Code Quality | 20% | brutal-quality |
| Performance | 15% | brutal-performance |
| Style & Standards | 10% | brutal-style |
| **TOTAL** | 100% | |

### Final Score Calculation

```
FINAL = (Security × 0.30) + (Architecture × 0.25) + (Quality × 0.20) + (Performance × 0.15) + (Style × 0.10)
```

---

## Zero Tolerance Thresholds

| Mode | Threshold | Rationale |
|------|-----------|-----------|
| FULL | 95+ | Near-perfection required |
| SECURITY | 98+ | No security compromises |
| PR | 90+ | Changes must be clean |
| ARCHITECTURE | 95+ | Structure must be solid |
| PERFORMANCE | 95+ | No performance regressions |
| QUICK | 85+ | Just catch blockers |
| FRONTEND | 95+ | UI/UX quality matters |
| COMPARE | N/A | Comparison, not pass/fail |

### Verdict Logic

```javascript
function getVerdict(score, mode) {
  const thresholds = {
    full: 95,
    security: 98,
    pr: 90,
    arch: 95,
    perf: 95,
    quick: 85,
    frontend: 95,
    compare: null
  };

  if (mode === 'compare') return 'COMPARISON';
  return score >= thresholds[mode] ? 'PASS' : 'FAIL';
}
```

---

## Multi-Category Deduction Rules

### When One Flaw Affects Multiple Categories

A single flaw can (and should) deduct from ALL affected categories.

**Example: SQL Injection Vulnerability**

| Category | Deduction | Reason |
|----------|-----------|--------|
| Security | -25 | Direct vulnerability |
| Code Quality | -15 | Shows lack of defensive coding |
| Architecture | -10 | Missing input validation layer |

**Example: God File (500+ lines, multiple responsibilities)**

| Category | Deduction | Reason |
|----------|-----------|--------|
| Architecture | -15 | File too large, multiple responsibilities |
| Code Quality | -10 | Maintenance nightmare |
| Style | -5 | Violates organization conventions |

### Deduction Mapping

| Flaw Type | Primary | Secondary | Tertiary |
|-----------|---------|-----------|----------|
| Security vulnerability | Security -25 | Quality -15 | Arch -10 |
| God file | Arch -15 | Quality -10 | Style -5 |
| Empty catch block | Quality -20 | Security -10 | - |
| N+1 query | Perf -20 | Quality -5 | - |
| No tests | Quality -15 | - | - |
| Magic numbers | Quality -5 | Style -3 | - |
| Poor naming | Style -5 | Quality -3 | - |

---

## Score Normalization

Each category checklist has different total points. Normalize to 100.

### Security (70 points → 100)
```
normalized = (raw / 70) × 100
```

### Architecture (60 points → 100)
```
normalized = (raw / 60) × 100
```

### Code Quality (70 points → 100)
```
normalized = (raw / 70) × 100
```

### Performance (50 points → 100)
```
normalized = (raw / 50) × 100
```

### Style (50 points → 100)
```
normalized = (raw / 50) × 100
```

---

## Automatic Failure Conditions

Regardless of final score, automatic FAIL if:

| Condition | Reason |
|-----------|--------|
| ANY CATASTROPHIC security issue | Zero tolerance for security |
| Empty catch blocks exist | Unacceptable error handling |
| Hardcoded secrets in code | Security non-negotiable |
| N+1 queries in production code | Performance disaster |
| No error handling on critical paths | Reliability concern |

---

## Score Interpretation

| Score Range | Interpretation | Action |
|-------------|----------------|--------|
| 98-100 | Exceptional | Ship it |
| 95-97 | Excellent | Minor polish possible |
| 90-94 | Good | Address noted issues |
| 85-89 | Acceptable | Significant improvement needed |
| 80-84 | Below standard | Major rework required |
| 70-79 | Poor | Substantial rewrite needed |
| 60-69 | Bad | Architecture concerns |
| 50-59 | Very bad | Fundamental problems |
| 0-49 | Catastrophic | Start over |

---

## Aggregation Process

1. **Collect raw scores** from each brutal agent
2. **Apply deductions** including multi-category impacts
3. **Normalize** each category to 100
4. **Apply weights** based on mode
5. **Calculate final** weighted average
6. **Check automatic failures**
7. **Compare to threshold** for verdict
