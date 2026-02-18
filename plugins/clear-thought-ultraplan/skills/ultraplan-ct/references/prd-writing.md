# Phase 3a: PRD Writing Protocol

> Phase 3 of 6, Part A - Product Requirements Document.
> Input: DISCOVERY.md, RESEARCH.md
> Output: PRD.md

---

## Step 1: Zero Jargon Rule

The PRD is written for anyone to understand. No technical jargon without translation.

### Translation Table

Before writing, build a translation table for any technical terms that must appear:

| Technical Term | Plain English Translation | Use In PRD |
|---------------|--------------------------|------------|
| API | A way for two programs to talk to each other | Use translation |
| SSR | Pages load with content already visible (good for Google) | Use translation |
| WebSocket | A live connection that pushes updates instantly | Use translation |
| OAuth | Signing in with your Google/GitHub account | Use translation |
| JWT | A digital pass that proves you're logged in | Avoid, use "login session" |
| ORM | A tool that translates code into database commands | Avoid entirely |
| Middleware | Code that runs between receiving a request and sending a response | Use "processing step" |
| Schema | The structure/shape of data | Use "data structure" |
| Migration | A scripted change to the database structure | Use "database update" |
| Webhook | An automatic notification sent to another service when something happens | Use translation |
| CRUD | Create, read, update, and delete operations | Spell out the operations |
| Regex | A pattern for matching text | Use "text pattern" |
| Cron | A scheduled recurring task | Use "scheduled task" |
| CDN | A network of servers that delivers content fast from a location near the user | Use "content delivery network" or translation |
| CI/CD | Automated testing and deployment | Use translation |

### Application Rule

When writing any PRD section:
1. Write the content naturally
2. Scan for jargon
3. Replace every jargon term with its plain English equivalent
4. If a technical term is absolutely necessary, include the translation in parentheses on first use

---

## Step 2: The 10 PRD Sections

Write each section following these content guidelines and examples.

### Section 1: What We're Building

**Content guidelines:**
- Project name and type (web app, API, CLI, mobile, library)
- One-liner: describe it in one sentence a stranger would understand
- 2-3 paragraph description that paints the full picture
- No features list here - just the vision

**Example:**
```markdown
## 1. What We're Building

**Project:** RecipeVault
**One-liner:** A web app where home cooks create, organize, and share their recipe collections.
**Type:** Web Application

RecipeVault helps home cooks who are tired of scattered recipes across bookmarks, screenshots,
and sticky notes. It gives them a single place to save all their recipes, organize them into
collections, and share them with friends and family.

Think of it as a personal cookbook that lives in the cloud. Users can type in their own recipes,
import recipes from URLs, and organize everything with tags and collections. When they want to
cook, they get a clean, distraction-free view optimized for the kitchen.
```

### Section 2: The Problem

**Content guidelines:**
- Describe the current state (how people solve this problem today)
- Explain why it matters (the pain, the cost, the frustration)
- List 2-3 existing solutions and why they fall short
- Use concrete, specific examples

**Quality check:** Would a non-technical person nod along while reading this? If not, rewrite.

### Section 3: Who It's For

**Content guidelines:**
- Primary user persona with a name and description
- Secondary user personas if applicable
- User needs table mapping needs to priorities and features
- Use "they" language, not "the user"

**Quality check:** Can you picture a real person fitting each persona?

### Section 4: What It Does

**Content guidelines:**
- Features grouped by priority: P0 (must-have), P1 (should-have), P2 (nice-to-have)
- Each feature: checkbox + name + one-line description
- P0 features come directly from Critical Requirements in DISCOVERY.md
- P1 features come from important but non-blocking requirements
- P2 features come from "nice to have" answers and research suggestions
- Maximum 8 P0 features, 6 P1 features, 5 P2 features

**Quality check:** If you cut all P1 and P2 features, would the product still be useful? If not, a P1 should be P0.

### Section 5: How It Should Feel

**Content guidelines:**
- Visual description (mood, style, examples)
- Key screens/views table
- Interaction patterns (how users navigate, how actions feel)
- References to apps the user mentioned in Category 9

**Quality check:** Could a designer start working from this description?

### Section 6: What It Connects To

**Content guidelines:**
- External services table (service, purpose, auth method, required?)
- Data sources list
- Import/export capabilities
- Every integration maps back to a feature in Section 4

**Quality check:** Are there any features in Section 4 that need an integration not listed here?

### Section 7: What It Does NOT Do

**Content guidelines:**
- Explicit out-of-scope items
- Each item has a reason (prevents scope creep arguments later)
- Derived from discovery answers about tradeoffs and preferences
- Include anything the user explicitly said "not now" or "later" about

**Quality check:** Are there any features someone might reasonably assume are included? If so, explicitly exclude them here.

### Section 8: How We'll Know It Works

**Content guidelines:**
- Success metrics table with targets and measurement methods
- Definition of Done checklist
- Metrics should be measurable, not vague ("page loads in < 2s" not "page loads fast")

**Quality check:** Could you write an automated test for each metric?

### Section 9: Business Model

**Content guidelines:**
- Revenue model (subscription, one-time, freemium, free/internal)
- Pricing details if applicable
- Cost table (hosting, services, etc.)
- Based directly on Category 8 discovery answers

**Quality check:** Does the math work? Revenue projections > cost estimates?

### Section 10: Risks & Concerns

**Content guidelines:**
- Risk table with likelihood, impact, and mitigation
- Derived from Category 4 (Edge Cases) and Category 5 (Quality Attributes)
- Include technical risks, business risks, and user risks
- Every risk must have a mitigation strategy

---

## Thinking Framework: Structured Justification

For Section 10 (Risks & Concerns), apply structured argumentation to ensure thorough risk analysis.

### Step 2a: Read Argumentation Framework

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/structured-argumentation.md` and apply **Thesis-Antithesis-Synthesis**.

### Step 2b: Evaluate Each Risk

For every risk identified during discovery:

1. **Thesis**: State the risk and why it matters
   - "User data could be exposed through an SQL injection attack. This matters because we store personal recipes and email addresses."

2. **Antithesis**: State why this risk might be overblown or manageable
   - "We're using an ORM that parameterizes queries by default. The attack surface is limited to custom queries."

3. **Synthesis**: Arrive at a balanced assessment with concrete mitigation
   - "MEDIUM likelihood, HIGH impact. Mitigation: Use parameterized queries exclusively, add input validation at API boundaries with Zod, run SQL injection tests in CI."

### Step 2c: Risk Presentation Format

Present each risk in the PRD using this enriched format:

```markdown
| Risk | Likelihood | Impact | Analysis | Mitigation |
|------|-----------|--------|----------|------------|
| SQL injection | MEDIUM | HIGH | ORM provides default protection, but custom queries exist in reporting module | Parameterized queries only + Zod validation + CI security tests |
| Auth service outage | LOW | HIGH | Clerk has 99.99% uptime SLA, but no local fallback exists | Implement token caching so existing sessions survive a 1-hour outage |
```

### Step 2d: Risk Categories Checklist

Ensure risks are evaluated across all categories:

- [ ] **Security risks**: Data breaches, auth bypass, injection, XSS
- [ ] **Performance risks**: Slow queries, memory leaks, traffic spikes
- [ ] **Integration risks**: API changes, service outages, rate limits
- [ ] **Business risks**: Low adoption, competitor moves, pricing issues
- [ ] **User risks**: Confusion, data loss, privacy concerns
- [ ] **Technical risks**: Framework limitations, migration complexity, scaling walls
- [ ] **Operational risks**: Deployment failures, monitoring gaps, on-call burden

---

## Step 3: Section-by-Section Approval

Write each section one at a time, presenting it to the user for approval before moving to the next.

### Approval Process

For each section:

1. **Write the section** following the content guidelines above
2. **Present to user**:
   ```
   Here's Section {N}: {NAME}

   {SECTION_CONTENT}

   Does this capture everything correctly? Any changes needed?
   ```
3. **Handle feedback**:
   - If approved: Move to next section
   - If changes requested: Revise and re-present
   - If major disagreement: Discuss, update understanding, revise
4. **Record approval**: Mark section as approved in PRD file

### Approval Tracking

Track in the PRD footer:

```markdown
## PRD Approval Status

| Section | Status | Date | Notes |
|---------|--------|------|-------|
| 1. What We're Building | APPROVED | {DATE} | - |
| 2. The Problem | APPROVED | {DATE} | Added competitor X |
| 3. Who It's For | CHANGES_REQUESTED | {DATE} | Need to add admin persona |
| ... | | | |
```

### Batch Approval Option

If the user signals impatience ("just write it all"), offer batch approval:

```
I can write all remaining sections at once and you can review the full PRD.
This is faster but means reviewing more at once. Want to do that?
```

If accepted, write all remaining sections, then present the full PRD.

---

## Step 4: Write PRD.md

### File Location

Write to `{output_dir}/PRD.md`

### File Format

Use the PRD template from `{plugin_root}/skills/ultraplan-ct/templates/prd.md` and populate every section with the approved content.

### Writing Rules

1. **No placeholder text**: Every section must contain real content, not template placeholders
2. **Internal consistency**: Features in Section 4 must trace to problems in Section 2 and users in Section 3
3. **External consistency**: Tech choices must align with RESEARCH.md recommendations
4. **Completeness**: Every discovery answer should be reflected somewhere in the PRD
5. **Priority accuracy**: P0 features are truly must-have. Err on the side of moving things to P1.
6. **Measurable success**: Section 8 metrics must have numeric targets

### Cross-Reference Checks

Before finalizing:

- [ ] Every P0 feature traces to a critical requirement from DISCOVERY.md
- [ ] Every integration in Section 6 traces to a feature in Section 4
- [ ] Every risk in Section 10 has a specific mitigation
- [ ] Section 7 (Not Doing) doesn't contradict Section 4 (Doing)
- [ ] Business model in Section 9 is consistent with pricing questions from discovery
- [ ] User personas in Section 3 match the users described in discovery
- [ ] Success metrics in Section 8 are achievable with the planned tech stack

---

## Completion Criteria

Phase 3a is complete when:

1. All 10 PRD sections are written with real content
2. All sections are approved by the user (or batch-approved)
3. Cross-reference checks pass
4. PRD.md is saved to the output directory
5. No unresolved "CHANGES_REQUESTED" items remain

### Completion Actions

1. Write PRD.md to `{output_dir}/PRD.md`
2. Update STATE.md with PRD completion
3. Transition to Phase 3b:
   ```
   PRD complete and approved!
   - {N} features across P0/P1/P2
   - {N} integrations identified
   - {N} risks with mitigations

   Now writing the technical implementation plan...
   ```
