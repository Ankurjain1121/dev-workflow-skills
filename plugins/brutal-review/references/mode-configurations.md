# Mode Configurations

## Mode Overview

| Mode | Argument | Description | Default Target |
|------|----------|-------------|----------------|
| FULL | (none) / `full` | Complete 5-category review | Current directory |
| SECURITY | `security` | Security-focused review | Current directory |
| PR | `pr` / `pr #123` | Pull request review | Changed files |
| ARCHITECTURE | `arch` | Architecture-focused review | Current directory |
| PERFORMANCE | `perf` | Performance-focused review | Current directory |
| QUICK | `quick` | Blockers only, fast | Current directory |
| FRONTEND | `frontend` | UI/UX/accessibility focus | Frontend files |
| COMPARE | `compare [repo]` | Compare against reference | Current directory |

---

## FULL Mode

**Usage:** `/brutal-review` or `/brutal-review full`

### Weights
| Category | Weight |
|----------|--------|
| Security | 30% |
| Architecture | 25% |
| Code Quality | 20% |
| Performance | 15% |
| Style & Standards | 10% |

### Threshold: 95+

### Agents Spawned
All 5 agents in parallel:
- brutal-security
- brutal-architecture
- brutal-quality
- brutal-performance
- brutal-style

### MCP Usage
- context7: Framework best practices
- grep: Real-world patterns
- exa: Latest research
- sequential-thinking: Pre-analysis

---

## SECURITY Mode

**Usage:** `/brutal-review security`

### Weights
| Category | Weight |
|----------|--------|
| Security | 60% |
| Code Quality | 20% |
| Architecture | 10% |
| Performance | 5% |
| Style & Standards | 5% |

### Threshold: 98+ (Zero tolerance)

### Agents Spawned
- brutal-security (primary, detailed)
- brutal-quality (security-focused checks)

### MCP Usage
- exa: Latest CVEs, security advisories, OWASP updates
- context7: Security best practices for framework
- grep: Vulnerability patterns in open source

### Special Focus
- OWASP Top 10 complete audit
- Dependency vulnerability scan
- Auth/authz deep dive
- Input validation audit

---

## PR Mode

**Usage:** `/brutal-review pr` or `/brutal-review pr #123`

### Weights
Adaptive based on changed file types:
- If security-related files changed: Security 40%
- If architecture changed: Architecture 35%
- Otherwise: Standard weights

### Threshold: 90+

### Agents Spawned
All 5 agents, but focused on changed files only

### Target Files
- Get changed files from `git diff --name-only`
- If PR number provided: `gh pr diff #123`
- Include related test files

### MCP Usage
- grep: Compare patterns with existing codebase
- context7: Framework patterns for changed code

### Special Focus
- Regression risk assessment
- Pattern consistency with existing code
- Test coverage for changes

---

## ARCHITECTURE Mode

**Usage:** `/brutal-review arch`

### Weights
| Category | Weight |
|----------|--------|
| Architecture | 50% |
| Code Quality | 25% |
| Style & Standards | 15% |
| Security | 5% |
| Performance | 5% |

### Threshold: 95+

### Agents Spawned
- brutal-architecture (primary, detailed)
- brutal-quality (architecture-focused)
- brutal-style (naming/organization focus)

### MCP Usage
- context7: Architecture patterns for framework
- grep: How top repos structure similar code
- sequential-thinking: Dependency analysis

### Special Focus
- File organization audit
- Dependency graph analysis
- Module boundary evaluation
- Naming convention audit

---

## PERFORMANCE Mode

**Usage:** `/brutal-review perf`

### Weights
| Category | Weight |
|----------|--------|
| Performance | 50% |
| Code Quality | 25% |
| Architecture | 15% |
| Security | 5% |
| Style & Standards | 5% |

### Threshold: 95+

### Agents Spawned
- brutal-performance (primary, detailed)
- brutal-quality (performance-related checks)

### MCP Usage
- exa: Latest optimization techniques, benchmarks
- context7: Performance patterns for framework
- grep: Efficient implementations in top repos

### Special Focus
- N+1 query detection
- Memory leak hunting
- Async/await audit
- Bundle size analysis (frontend)

---

## QUICK Mode

**Usage:** `/brutal-review quick`

### Weights
| Category | Weight |
|----------|--------|
| Security | 40% |
| Code Quality | 40% |
| Performance | 10% |
| Architecture | 5% |
| Style & Standards | 5% |

### Threshold: 85+ (Looser, just catch blockers)

### Agents Spawned
- brutal-security (blockers only)
- brutal-quality (blockers only)

### MCP Usage
Minimal - no research phase, just review

### Special Focus
- CATASTROPHIC issues only
- Security vulnerabilities
- Empty catch blocks
- Critical bugs
- Skip style/minor issues

### Time Target
Fast execution - under 2 minutes

---

## FRONTEND Mode

**Usage:** `/brutal-review frontend`

### Weights
| Category | Weight |
|----------|--------|
| Code Quality | 40% |
| Style & Standards | 25% |
| Performance | 20% |
| Security | 10% |
| Architecture | 5% |

### Threshold: 95+

### Agents Spawned
- brutal-quality (frontend focus)
- brutal-style (UI consistency)
- brutal-performance (frontend perf)

### MCP Usage
- context7: React/Vue/etc. best practices
- grep: UI patterns in popular repos
- exa: Core Web Vitals, accessibility

### Special Focus
- Accessibility (a11y) audit
- Component structure
- State management patterns
- Re-render optimization
- Bundle size

### File Filter
Focus on:
- `*.tsx`, `*.jsx`
- `*.vue`, `*.svelte`
- `*.css`, `*.scss`
- Component directories

---

## COMPARE Mode

**Usage:** `/brutal-review compare facebook/react`

### Weights
Standard weights, but for comparison (no pass/fail)

### Threshold: N/A (Comparison only)

### Agents Spawned
All 5 agents with comparison focus

### MCP Usage
- grep: Fetch patterns from reference repo
- context7: Best practices for comparison

### Output Format
| Aspect | Your Code | Reference | Gap |
|--------|-----------|-----------|-----|
| File organization | X | Y | Δ |
| Security patterns | X | Y | Δ |
| etc. | | | |

### Special Focus
- Pattern comparison
- Structure comparison
- Convention differences
- Improvement suggestions

---

## Mode Detection Logic

```javascript
function detectMode(args) {
  if (!args || args === 'full') return 'full';
  if (args.startsWith('security')) return 'security';
  if (args.startsWith('pr')) return 'pr';
  if (args.startsWith('arch')) return 'arch';
  if (args.startsWith('perf')) return 'perf';
  if (args.startsWith('quick')) return 'quick';
  if (args.startsWith('frontend')) return 'frontend';
  if (args.startsWith('compare')) return 'compare';
  return 'full'; // Default
}
```

---

## Argument Parsing

| Input | Mode | Target | Extra |
|-------|------|--------|-------|
| `/brutal-review` | full | . | - |
| `/brutal-review security` | security | . | - |
| `/brutal-review pr` | pr | git diff | - |
| `/brutal-review pr #123` | pr | PR #123 | - |
| `/brutal-review arch src/` | arch | src/ | - |
| `/brutal-review perf` | perf | . | - |
| `/brutal-review quick` | quick | . | - |
| `/brutal-review frontend` | frontend | frontend files | - |
| `/brutal-review compare owner/repo` | compare | . | ref: owner/repo |
