# LLM Selection Decision Framework

> **Do NOT hardcode model capabilities.** Models update faster than this file.
> Always use WebSearch to verify current specs before assigning tasks.

---

## Decision Protocol

### Step 1: Ask the User
```
Which LLMs/tools do you have available?
What's your budget constraint? (none / moderate / tight)
```

### Step 2: Research Current Capabilities
For EACH LLM the user mentions:
```
WebSearch: "[Model Name] capabilities benchmarks [current year]"
WebSearch: "[Model Name] pricing API [current year]"
```

Verify:
- Context window (exact size)
- Pricing (input/output per 1M tokens)
- Strengths (from official docs or reputable benchmarks)
- Known limitations

### Step 3: Match Tasks to LLMs

Use this decision matrix:

| Task Type | Prioritize | Avoid |
|-----------|-----------|-------|
| Architecture & system design | Strongest reasoning model | Fast/cheap models |
| Backend implementation | Good code + fast iteration | Overkill reasoning |
| Frontend / UI | Vision-capable, UI-aware | Code-only models |
| Testing | Thorough + cost-effective | Expensive flagship |
| Documentation | Large context + clear writing | Small context |
| DevOps / CI/CD | Broad knowledge | Narrow specialists |
| Refactoring | Code-focused, pattern-aware | Conversational models |

### Step 4: Consider Constraints

| Constraint | Strategy |
|------------|----------|
| Budget limited | Use cheaper models for bulk, flagship for architecture only |
| Time critical | Use fastest-responding models |
| Quality critical | Use flagship for all phases |
| Large codebase | Prioritize largest context window |
| Single developer | Skip Phase 4; use one model for everything |

### Step 5: Generate Assignment Matrix

```markdown
| Agent ID | LLM | Tasks | Est. Cost | Rationale |
|----------|-----|-------|-----------|-----------|
| [ID] | [Model] | [Tasks] | [Est] | [Why this model] |
```

---

## Anti-Patterns

- **Never hardcode model scores** - they change with every release
- **Never assume pricing** - always verify current rates
- **Never skip research** - "I think Model X is good at Y" is not evidence
- **Never ignore user experience** - their hands-on experience > benchmarks

---

## Quick Reference: Model Families (verify before using)

| Family | Provider | Typical Strengths |
|--------|----------|-------------------|
| Claude | Anthropic | Reasoning, code quality, long context |
| GPT | OpenAI | Multimodal, structured output, broad knowledge |
| Gemini | Google | Massive context, multimodal, speed |
| DeepSeek | DeepSeek | Code generation, cost-effective |
| Qwen | Alibaba | Code-focused, open weights, self-hostable |
| Llama | Meta | Open source, customizable, no API costs |

> These are general tendencies, not guarantees. **Always WebSearch for current data.**
