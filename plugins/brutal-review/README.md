# Brutal Review

Zero-tolerance multi-agent code review with 5 specialized agents.

## Agents
1. **Security Agent** - Vulnerabilities, OWASP, injection attacks
2. **Architecture Agent** - SOLID, patterns, coupling
3. **Quality Agent** - Clean code, complexity, naming
4. **Performance Agent** - Memory, CPU, algorithms
5. **Style Agent** - Consistency, formatting, conventions

## Scoring
- **95+ to pass** - Brutally honest feedback
- Weighted scoring with zero tolerance thresholds
- Detailed deduction explanations

## Usage

```bash
/brutal-review src/
/brutal-review --quick src/components/  # Faster, less thorough
```

## Installation

Enable in your Claude settings:
```json
{
  "enabledPlugins": {
    "dev-workflow-skills@brutal-review": true
  }
}
```
