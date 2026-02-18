# Phase 2: RESEARCH Protocol

> Phase 2 of 6 - Technical research using parallel subagents.
> Input: DISCOVERY.md
> Output: RESEARCH.md

---

## Thinking Framework: Research Hypothesis Formation

Before spawning any research subagents, perform structured hypothesis formation.

### Step 0a: Scientific Method Setup

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/scientific-method.md` and apply the scientific method to the research phase.

1. **Observe**: Review all discovery findings. What patterns, constraints, and requirements emerge?
2. **Question**: What are the key technical decisions that need evidence?
3. **Hypothesize**: Form 3-5 testable hypotheses about the best technical approach.

### Step 0b: Form Hypotheses

Based on discovery findings, write 3-5 hypotheses. Each must be:
- **Specific**: Names a technology, pattern, or approach
- **Testable**: Can be confirmed or refuted by research
- **Relevant**: Directly impacts a key architecture decision

Example hypotheses:
```
H1: "Next.js App Router will be the best framework choice because the project needs
     SSR for SEO, API routes for backend, and the team knows React."

H2: "Supabase will be better than Firebase for the database because the project needs
     complex relational queries and row-level security."

H3: "A queue-based architecture for image processing will be necessary because
     synchronous processing would timeout at the expected file sizes."

H4: "Clerk will be the most cost-effective auth solution for the expected user count
     and required social login providers."

H5: "A monorepo structure will slow down the team because the project is small enough
     to fit in a single package."
```

### Step 0c: Assign Hypotheses to Subagents

Map each hypothesis to a research subagent:
- **Codebase Researcher**: H1, H5 (architecture, structure decisions)
- **Web Researcher**: H2, H3, H4 (technology comparisons, best practices)
- **Docs Researcher**: H1, H2, H4 (API capabilities, integration details)

Each subagent should gather evidence FOR and AGAINST the assigned hypotheses.

### Step 0d: Document in RESEARCH.md

Add a "Research Hypotheses" section at the top of RESEARCH.md:

```markdown
## Research Hypotheses

| # | Hypothesis | Evidence For | Evidence Against | Verdict |
|---|-----------|-------------|-----------------|---------|
| H1 | {HYPOTHESIS} | {EVIDENCE} | {EVIDENCE} | {CONFIRMED/REFUTED/MODIFIED} |
| H2 | {HYPOTHESIS} | {EVIDENCE} | {EVIDENCE} | {CONFIRMED/REFUTED/MODIFIED} |
| H3 | {HYPOTHESIS} | {EVIDENCE} | {EVIDENCE} | {CONFIRMED/REFUTED/MODIFIED} |
```

---

## Step 1: Topic Extraction

Extract research topics from DISCOVERY.md.

### Extraction Process

1. Read DISCOVERY.md completely
2. For each category of answers, identify:
   - Technologies mentioned or implied
   - Decisions that need technical validation
   - Unknowns flagged during discovery
   - Comparisons needed (build vs buy, tech A vs tech B)

3. Build a prioritized topic list:

| Priority | Topic Type | Example |
|----------|-----------|---------|
| HIGH | Blocking decision | "Which database: PostgreSQL vs MongoDB for recipe data?" |
| HIGH | Core tech validation | "Can Next.js App Router handle our real-time requirements?" |
| MEDIUM | Integration feasibility | "Stripe integration with our planned auth approach" |
| MEDIUM | Best practices | "Image upload and processing patterns for recipe photos" |
| LOW | Nice-to-know | "SEO optimization techniques for recipe content" |

4. Assign each topic to a research source:
   - **CODEBASE**: Existing code analysis (if codebase exists)
   - **WEB**: Internet research for best practices, comparisons, ecosystem state
   - **DOCS**: Library documentation via Context7

### Topic Limits

- Minimum: 5 topics
- Maximum: 15 topics
- At least 2 HIGH priority topics
- No more than 5 LOW priority topics

---

## Step 2: Spawn Parallel Subagents

Launch up to 3 subagents in parallel using the Task tool. Each subagent has a specific role, tools, and output format.

### Subagent 1: Codebase Researcher

**Agent file:** `{plugin_root}/agents/codebase-researcher.md`

**Task prompt:**
```
You are the Codebase Researcher for an UltraPlan research phase.

## Context
{PASTE DISCOVERY SUMMARY HERE}

## Your Job

### If existing codebase detected:
Analyze the codebase at {ROOT_DIR} for:
1. Current tech stack and versions
2. Architecture patterns in use
3. Code conventions (naming, imports, error handling)
4. Files relevant to the planned feature/project
5. Conflicts between current patterns and planned approach
6. Technical debt that may impact implementation

### If greenfield:
1. Compare 2-3 viable tech stacks for this project
2. Score each on: language, framework, DB, auth, hosting, learning curve, community, cost
3. Analyze 3-5 competitors or similar projects
4. Recommend skeleton project or boilerplate if applicable

## Research Hypotheses to Investigate
{LIST HYPOTHESES ASSIGNED TO THIS AGENT}
For each hypothesis, gather evidence for AND against.

## Tools Available
- Glob (find files by pattern)
- Grep (search file contents)
- Read (read specific files)

## Output Format
Return your findings as a structured markdown report following the format in your agent instructions.
Include a "Hypothesis Evidence" section at the end.
```

### Subagent 2: Web Researcher

**Agent file:** `{plugin_root}/agents/web-researcher.md`

**Task prompt:**
```
You are the Web Researcher for an UltraPlan research phase.

## Context
{PASTE DISCOVERY SUMMARY HERE}

## Research Topics (prioritized)
{LIST OF WEB RESEARCH TOPICS WITH PRIORITIES}

## Your Job
1. Research each topic using WebSearch (use current year in queries)
2. For each topic, find:
   - Best practice with source URL
   - Common pitfalls with source URL
   - Relevant tools/libraries with source URL
   - Security considerations
   - Cost implications
3. Cross-reference findings across sources
4. Flag conflicting advice

## Research Hypotheses to Investigate
{LIST HYPOTHESES ASSIGNED TO THIS AGENT}
For each hypothesis, gather evidence for AND against. Cite sources.

## Tools Available
- WebSearch (search the web)
- WebFetch (fetch and analyze specific pages)

## Output Format
Return your findings as a structured markdown report following the format in your agent instructions.
Include a "Hypothesis Evidence" section at the end.

## Rules
- Every claim must cite a URL
- Use current year in all search queries
- Prefer stable/proven over bleeding-edge
- Rate confidence: HIGH/MEDIUM/LOW per finding
- Include cost estimates where applicable
```

### Subagent 3: Docs Researcher

**Agent file:** `{plugin_root}/agents/docs-researcher.md`

**Task prompt:**
```
You are the Docs Researcher for an UltraPlan research phase.

## Context
{PASTE DISCOVERY SUMMARY HERE}

## Technologies to Research
{LIST OF TECHNOLOGIES FROM DISCOVERY AND CODEBASE RESEARCH}

## Your Job
1. For each technology, resolve the Context7 library ID
2. Fetch documentation focused on project-relevant topics
3. Extract: version, setup, key APIs, gotchas, integration notes, code examples, limitations
4. For libraries not in Context7, use WebSearch/WebFetch as fallback

## Research Hypotheses to Investigate
{LIST HYPOTHESES ASSIGNED TO THIS AGENT}
For each hypothesis, check documentation for evidence for AND against.

## Tools Available
- Context7 MCP (resolve-library-id, get-library-docs)
- WebSearch (fallback)
- WebFetch (fallback)

## Output Format
Return your findings as a structured markdown report following the format in your agent instructions.
Include a "Hypothesis Evidence" section at the end.

## Rules
- ALWAYS call resolve-library-id before get-library-docs
- Try multiple name variations if first lookup fails
- Focus on APIs and patterns this project will actually use
- Include at least one code example per library
- Note gotchas prominently
```

---

## Step 3: Collect and Merge Results

After all subagents complete, merge their findings.

### Merge Process

1. **Collect all three reports** from subagent outputs
2. **Deduplicate findings**: If multiple agents found the same information, keep the most detailed version with the best source
3. **Resolve hypothesis verdicts**: For each hypothesis, combine evidence from all agents:
   - If all evidence supports: **CONFIRMED**
   - If evidence is mixed: **MODIFIED** (state the modification)
   - If evidence contradicts: **REFUTED** (state what replaces it)
4. **Build unified tech stack recommendation**: Combine codebase analysis + web best practices + library docs into a single recommendation
5. **Compile library table**: Merge docs researcher library findings with web researcher ecosystem state

### Merge Conflicts

When agents provide contradictory findings:

1. Note the conflict explicitly
2. Check source reliability (official docs > blog post > Stack Overflow)
3. Check recency (2026 source > 2024 source)
4. If still ambiguous, flag for user resolution

---

## Thinking Framework: Technology Evaluation

When evaluating competing technologies (tech stack, libraries, approaches), apply structured decision analysis.

### Step 3a: Read Decision Framework

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/decision-framework.md` and apply **Weighted Criteria Analysis**.

### Step 3b: Build Decision Matrix

For each technology decision that has 2+ viable options:

1. **Define criteria** from discovery requirements:
   - Performance requirements
   - Developer experience / learning curve
   - Community and ecosystem maturity
   - Cost (monetary + opportunity)
   - Integration with other chosen technologies
   - Scalability trajectory
   - Security track record

2. **Assign weights** based on project priorities (from Category 7 tradeoffs):
   - Must-have criteria: weight 3
   - Important criteria: weight 2
   - Nice-to-have criteria: weight 1

3. **Score each option** (1-5) against each criterion with evidence from research

4. **Calculate weighted scores** and present:

```markdown
### Technology Decision: {DECISION_NAME}

| Criterion | Weight | Option A | Score | Option B | Score | Option C | Score |
|-----------|--------|----------|-------|----------|-------|----------|-------|
| {CRITERION_1} | {W} | {EVIDENCE} | {1-5} | {EVIDENCE} | {1-5} | {EVIDENCE} | {1-5} |
| {CRITERION_2} | {W} | {EVIDENCE} | {1-5} | {EVIDENCE} | {1-5} | {EVIDENCE} | {1-5} |
| **Weighted Total** | | | **{TOTAL}** | | **{TOTAL}** | | **{TOTAL}** |

**Recommendation:** {OPTION} (score: {TOTAL})
**Reasoning:** {WHY_THIS_WON}
**Risk:** {WHAT_COULD_GO_WRONG_WITH_THIS_CHOICE}
```

### Step 3c: Present to User

During conflict resolution (Step 4), present the decision matrix to the user. Let them:
- Adjust weights if priorities differ from your assumptions
- Override scores if they have personal experience
- Choose a different option with justification

---

## Step 4: Conflict Detection

Identify conflicts across all research findings.

### Types of Conflicts

1. **Technology conflict**: Two recommended tools don't work well together
   - Example: "React Query recommends X pattern, but our auth library expects Y pattern"

2. **Approach conflict**: Web research suggests one approach, codebase uses another
   - Example: "Best practice is server components, but existing codebase uses client-side rendering throughout"

3. **Version conflict**: Required library versions are incompatible
   - Example: "Library A requires React 19, but Library B only supports React 18"

4. **Cost conflict**: Recommended approach exceeds stated budget
   - Example: "Best auth solution costs $100/mo but user said $50/mo budget"

5. **Complexity conflict**: Recommended approach is more complex than user wants
   - Example: "Best architecture is microservices, but user wants to ship fast with minimal complexity"

### Conflict Resolution

For each conflict:

1. Describe the conflict clearly
2. List the options with pros/cons
3. State which option the research favors and why
4. Present to the user for final decision (see Step 5)

---

## Step 5: User Review

Present all research findings and unresolved conflicts to the user.

### Presentation Format

```
Research complete! Here's what I found:

**Tech Stack Recommendation:**
{BRIEF_STACK_SUMMARY}

**Key Findings:**
1. {FINDING_1}
2. {FINDING_2}
3. {FINDING_3}

**Research Hypotheses:**
- H1: {HYPOTHESIS} -> {CONFIRMED/REFUTED/MODIFIED}
- H2: {HYPOTHESIS} -> {CONFIRMED/REFUTED/MODIFIED}
...

**Needs Your Decision:**
{LIST_CONFLICTS_NEEDING_RESOLUTION}

**Risks:**
- {RISK_1}
- {RISK_2}

Does this direction look right? Any concerns or preferences I should adjust?
```

### Approval Checklist

Track user approval on each item:

| Item | Status |
|------|--------|
| Tech stack approved | PENDING/APPROVED |
| Architecture approach approved | PENDING/APPROVED |
| Libraries approved | PENDING/APPROVED |
| Conflicts resolved | PENDING/APPROVED |
| Risks acknowledged | PENDING/APPROVED |
| Ready for PRD | PENDING/APPROVED |

Do not proceed to Phase 3 until all items are APPROVED.

---

## Step 6: Write RESEARCH.md

Write the complete research output file.

### File Structure

Use the research template from `{plugin_root}/skills/ultraplan-ct/templates/research.md` and populate every section:

1. **Research Hypotheses** (from thinking framework)
   - All hypotheses with evidence and verdicts

2. **Research Topics**
   - Full topic table with priorities and status

3. **Codebase Analysis** (from Subagent 1)
   - Stack detection, architecture, conventions, relevant files

4. **Tech Stack Comparison** (from Subagent 1 if greenfield)
   - Full comparison table with scores and recommendation

5. **Web Research** (from Subagent 2)
   - Best practices, current approaches, ecosystem state

6. **Competitor Analysis** (from Subagent 2 if greenfield)
   - Competitor table with strengths, weaknesses, relevance

7. **Library Documentation** (from Subagent 3)
   - Library table with versions, APIs, gotchas

8. **Technology Decision Matrices** (from thinking framework)
   - Weighted criteria analysis for each major decision

9. **Conflicts Found**
   - All conflicts with resolutions

10. **Summary and Recommendations**
    - Final tech stack, architecture decisions, library choices, risks

11. **User Review Status**
    - Approval checklist

### Writing Rules

- Every recommendation must cite evidence from research
- Every conflict must have a resolution or be flagged for user decision
- Every library must include version, gotchas, and at least one code example
- Hypothesis verdicts must reference specific evidence
- Decision matrices must show the math (weights x scores)

---

## Completion Criteria

Phase 2 is complete when:

1. All HIGH priority topics are researched
2. At least 80% of MEDIUM priority topics are researched
3. All hypotheses have verdicts (confirmed, refuted, or modified)
4. All technology decisions have decision matrices
5. All conflicts are resolved
6. User has approved all items in the review checklist
7. RESEARCH.md is written and saved

### Completion Actions

1. Write RESEARCH.md to `{output_dir}/RESEARCH.md`
2. Update STATE.md with Phase 2 completion
3. Announce transition:
   ```
   Research complete!
   - {N} topics researched across {M} sources
   - {H} hypotheses tested: {CONFIRMED} confirmed, {REFUTED} refuted, {MODIFIED} modified
   - Tech stack: {BRIEF_STACK}

   Moving to Phase 3: PLAN - I'll write the PRD and technical plan.
   ```
