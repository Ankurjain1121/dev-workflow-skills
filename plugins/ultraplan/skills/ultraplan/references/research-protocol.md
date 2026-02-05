# Phase 2: RESEARCH Protocol

You are executing Phase 2 of UltraPlan. Your job is to investigate solutions, best practices, and technical approaches based on what was learned in Phase 1 (DISCOVERY.md). This phase requires NO user input until the review step at the end.

---

## Step 1: Topic Extraction

Read `.ultraplan/DISCOVERY.md` and auto-extract research topics. Do NOT ask the user what to research.

**Extraction rules:**
1. Scan every answer for technology mentions (explicit or implied)
2. Identify integration needs (payments, auth, email, maps, etc.)
3. Note any competitor products the user mentioned
4. Identify architectural patterns needed (real-time, offline, multi-tenant, etc.)
5. List any domain-specific requirements (healthcare compliance, financial regulations, etc.)

**Build a topic list in this format:**
```
Research Topics:
1. [Technology/Framework] - Why: [user mentioned X in Category Y]
2. [Integration] - Why: [user wants payment processing]
3. [Pattern] - Why: [user needs real-time updates]
4. [Competitor] - Why: [user referenced this as inspiration]
5. [Compliance] - Why: [user's domain requires this]
```

Aim for 5-15 research topics. If fewer than 5, you missed something -- re-read DISCOVERY.md.

---

## Step 2: Spawn 3 Parallel Subagents

Launch all 3 subagents simultaneously in a single message using the Task tool. Do NOT run them sequentially.

### Subagent 1: Codebase Researcher

**Type:** `Task` with `subagent_type=Explore`

**If codebase exists, instruct it to:**
```
Read .ultraplan/DISCOVERY.md for context on what we are building.
Analyze the existing codebase for:
1. Current tech stack and versions
2. File organization patterns and naming conventions
3. State management approach
4. API patterns (REST, tRPC, GraphQL, etc.)
5. Database schema patterns
6. Authentication implementation
7. Testing patterns and frameworks
8. Build and deployment configuration
9. Any existing code that could be reused or extended for the new feature
10. Potential conflicts between existing patterns and new requirements

Output a structured report with findings for each item above.
Include specific file paths and code examples where relevant.
```

**If greenfield (no codebase), instruct it to:**
```
Read .ultraplan/DISCOVERY.md for context on what we are building.
This is a greenfield project. Perform:

1. TECH STACK COMPARISON
   Compare 2-3 viable tech stack options for this project.
   For each option, provide:
   - Stack components (frontend, backend, database, hosting)
   - Pros for THIS specific project
   - Cons for THIS specific project
   - Learning curve (important: user is a no-coder using AI tools)
   - Community size and AI tool support
   - Cost estimate (free tier availability)

   Recommend ONE stack with clear reasoning.

2. COMPETITOR ANALYSIS
   Find 3-5 similar existing products/apps.
   For each competitor:
   - Name and URL
   - What they do well
   - What they do poorly
   - Features relevant to our project
   - Technical approach (if publicly known)

Output a structured report covering both sections.
```

### Subagent 2: Web Researcher

**Type:** `Task` with `subagent_type=general-purpose`

```
Read .ultraplan/DISCOVERY.md for context on what we are building.

Research the following topics using web search:
[INSERT EXTRACTED TOPIC LIST HERE]

For each topic, find:
1. Current best practices (2025-2026)
2. Common pitfalls and how to avoid them
3. Recommended libraries or services
4. Any security considerations
5. Cost implications (free tiers, pricing)

Focus on practical, actionable findings.
Prefer well-maintained, popular solutions over cutting-edge experimental ones.
Note: The user is a no-coder who will execute this plan with AI tools.
Prioritize solutions that are well-documented and AI-friendly.

Output a structured report organized by topic.
```

### Subagent 3: Docs Researcher

**Type:** `Task` with `subagent_type=general-purpose`

```
Read .ultraplan/DISCOVERY.md for context on what we are building.

Use the Context7 MCP to fetch current documentation for the following technologies:
[INSERT RELEVANT TECHNOLOGIES FROM TOPIC LIST]

For each technology:
1. Call resolve-library-id first to get the correct library ID
2. Then call get-library-docs to fetch current documentation
3. Extract: setup instructions, key APIs, integration patterns, common patterns

Focus on:
- Getting started guides
- Integration with other tools in our stack
- Authentication/authorization patterns
- Database interaction patterns
- Deployment requirements

If Context7 does not have docs for a technology, note it as "Docs not available via Context7 - rely on web research."

Output a structured report organized by technology.
```

---

## Step 3: Collect and Merge Results

Wait for all 3 subagents to complete. Then merge their findings into a single coherent report.

**Merge rules:**
- Organize by topic, not by subagent
- When multiple subagents cover the same topic, combine their findings
- Note the source of each finding: [Codebase], [Web], [Docs]
- Highlight areas where subagents agree (high confidence)
- Flag areas where subagents disagree (needs resolution)

---

## Step 4: Conflict Detection and Resolution

Compare research findings against user's answers in DISCOVERY.md.

**Check for conflicts:**
1. User chose a technology, but research shows a better alternative
2. User assumed something is simple, but research shows it is complex
3. User's desired feature has legal/compliance implications they did not mention
4. User's timeline expectations conflict with project complexity
5. User's budget expectations conflict with required services/APIs

**For each conflict found:**
- Document it clearly in plain English
- Explain why the research suggests a different approach
- Prepare an AskUserQuestion with options:
  1. "[Research recommendation] (Recommended)" -- with explanation
  2. "[User's original choice]" -- noting the tradeoffs
  3. "Let me think about this" -- defer decision

**Present ALL conflicts to the user in a single batch.** Do not drip-feed them.

**If no conflicts found:** Skip this step and proceed to user review.

---

## Step 5: User Review

After research is complete (and conflicts resolved if any), present a plain-English summary.

**Summary format:**
```
## Research Summary

### Tech Stack Recommendation
[1-2 sentences about recommended stack and why]

### Key Findings
- [Finding 1: plain English, why it matters]
- [Finding 2: plain English, why it matters]
- [Finding 3: plain English, why it matters]
[3-7 findings total]

### Things to Watch Out For
- [Risk/concern 1]
- [Risk/concern 2]
[1-3 items]

### Competitor Insights (if greenfield)
- [Competitor 1]: [what we can learn from them]
- [Competitor 2]: [what we can learn from them]
```

**Then ask the user via AskUserQuestion:**
```
Question: "Does this research align with your vision? Ready to move to planning?"
Options:
1. "Looks good, let's start planning (Recommended)"
2. "I'd like you to research more about [specific topic]"
3. "I have some concerns I want to discuss"
4. "I want to change my mind about something from the earlier questions"
```

**If user picks option 2:** Spawn a single research subagent for the requested topic, append results, re-present summary.
**If user picks option 3:** Use AskUserQuestion to understand their concerns, address them, re-present summary.
**If user picks option 4:** Update DISCOVERY.md with the change, re-evaluate if research needs updating.

---

## Step 6: Write Research Output

Write the complete research report to `.ultraplan/RESEARCH.md`:

```markdown
# UltraPlan Research

## Research Topics
[List of topics extracted from discovery]

## Tech Stack Analysis
### Recommended Stack
[Stack recommendation with reasoning]

### Alternatives Considered
[Other stacks that were evaluated]

## Findings by Topic

### [Topic 1]
**Source:** [Codebase/Web/Docs]
[Findings]

### [Topic 2]
**Source:** [Codebase/Web/Docs]
[Findings]

...

## Competitor Analysis (if greenfield)
[Competitor findings]

## Library Documentation
[Key docs findings from Context7]

## Conflicts Detected
[List of conflicts and their resolutions, or "None detected"]

## User Review
- Status: Approved
- Additional research requested: [None / topic list]
- Concerns raised: [None / summary]
```

---

## Completion

After writing RESEARCH.md, display:
```
Phase 2/6: RESEARCH [==========] 100% - Complete!
3 research subagents completed. Findings saved to .ultraplan/RESEARCH.md
Moving to Phase 3: PLAN...
```

Proceed to Phase 3.
