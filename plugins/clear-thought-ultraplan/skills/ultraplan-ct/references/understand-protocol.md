# Phase 1: UNDERSTAND Protocol

> Phase 1 of 6 - Discovery and requirements gathering through structured questioning.
> Target: 40-70 questions across 9 categories.
> Output: DISCOVERY.md

---

## Thinking Framework: Pre-Discovery Analysis

Before asking ANY questions, perform a structured thinking analysis to prime the discovery process.

### Step 0a: First Principles Decomposition

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/mental-models.md` and apply **First Principles Thinking**.

1. Take the user's initial idea/description
2. Strip away all assumptions about implementation, technology, and existing solutions
3. Identify the fundamental truths:
   - What problem actually exists? (not what the user said, but what is irreducibly true)
   - What must be true for a solution to work?
   - What are the atomic units of value this project delivers?
4. Rebuild from fundamentals: what is the simplest possible thing that addresses these truths?

### Step 0b: Metacognitive Assessment

Read `{plugin_root}/skills/ultraplan-ct/references/thinking/metacognitive-monitoring.md` and apply **Metacognitive Monitoring**.

Assess your knowledge state across these dimensions:

| Dimension | Know Well | Know Partially | Don't Know |
|-----------|-----------|----------------|------------|
| Problem domain | | | |
| Target users | | | |
| Technical feasibility | | | |
| Existing solutions | | | |
| Business model | | | |
| Scale requirements | | | |
| Security concerns | | | |
| Integration landscape | | | |

For each "Don't Know" and "Know Partially" item, flag the corresponding question category for deeper exploration.

### Step 0c: Document the Analysis

Write a "Pre-Discovery Analysis" section at the top of DISCOVERY.md:

```markdown
## Pre-Discovery Analysis

### First Principles Decomposition
- **Fundamental truth 1:** {TRUTH}
- **Fundamental truth 2:** {TRUTH}
- **Fundamental truth 3:** {TRUTH}
- **Simplest viable solution:** {DESCRIPTION}

### Knowledge Assessment
- **Strong knowledge areas:** {AREAS} - will ask fewer questions here
- **Partial knowledge areas:** {AREAS} - targeted questions needed
- **Knowledge gaps:** {AREAS} - deep exploration required

### Category Priority Order
1. {CATEGORY} (knowledge gap - explore deeply)
2. {CATEGORY} (knowledge gap - explore deeply)
3. {CATEGORY} (partial knowledge - targeted questions)
4. {CATEGORY} (partial knowledge - targeted questions)
5. {CATEGORY} (strong knowledge - confirm assumptions)
...
```

### Step 0d: Prioritize Categories

Use the metacognitive assessment to reorder the 9 categories. Categories where you have the least knowledge should receive the most questions (6-8). Categories where you have strong knowledge need only confirmation questions (3-4).

---

## Step 1: Codebase Detection

Before asking any questions, silently detect if an existing codebase is present.

### Detection Method

1. Check the current working directory for project indicators:
   - `package.json` (Node.js/JavaScript)
   - `Cargo.toml` (Rust)
   - `go.mod` (Go)
   - `requirements.txt` / `pyproject.toml` (Python)
   - `Gemfile` (Ruby)
   - `pom.xml` / `build.gradle` (Java)
   - `*.csproj` / `*.sln` (C#/.NET)
   - `composer.json` (PHP)

2. If found, scan for:
   - Framework (Next.js, SvelteKit, Express, Django, Rails, etc.)
   - Directory structure (src/, lib/, app/, pages/)
   - Config files (.eslintrc, tsconfig.json, .prettierrc, etc.)
   - Test setup (jest.config, vitest.config, pytest.ini)
   - Database (prisma/, drizzle/, migrations/)

3. Record findings silently. Do NOT ask about tech stack if already detected.

### Detection Output

Store internally (do not show user yet):

```
Codebase: YES/NO
Root: {PATH}
Language: {LANG}
Framework: {FRAMEWORK}
Package Manager: {PM}
Key Config: {FILES}
```

### Codebase Impact on Questions

- If **existing codebase**: Skip Category 6 (Existing Patterns) questions that can be answered by reading code. Instead, focus on what the user WANTS that differs from current patterns.
- If **greenfield**: Ask all Category 6 questions about preferences and conventions.

---

## Step 2: Question Format Rules

Every question must follow these rules precisely.

### Rule 1: One Question at a Time

Ask exactly ONE question per message. Never bundle multiple questions.

**Good:**
```
What is the primary problem this project solves for its users?
```

**Bad:**
```
What is the primary problem? And who are the main users? Also, what tech stack are you thinking about?
```

### Rule 2: Start Broad, Then Narrow

Begin each category with an open-ended question. Follow with specific questions based on the answer.

**Good sequence:**
```
Q1: "Tell me about the users who will use this - who are they and what do they need?"
Q2: (after answer mentions "small business owners")
    "How tech-savvy are these small business owners? Do they need hand-holding or are they power users?"
```

**Bad sequence:**
```
Q1: "Will the users be between ages 25-45?"
Q2: "Do they prefer mobile or desktop?"
```

### Rule 3: Offer Options for Complex Questions

When a question has many possible answers, provide 3-5 options plus "other."

**Good:**
```
How should users sign in?
  a) Email + password
  b) Social login (Google, GitHub, etc.)
  c) Magic link (passwordless email)
  d) SSO for enterprise
  e) No authentication needed
  f) Other: ___
```

**Bad:**
```
What authentication method do you want?
```

### Rule 4: Use Plain Language

No jargon. No technical terms the user might not know. If a technical concept is unavoidable, explain it inline.

**Good:**
```
Should the app work offline (like when you have no internet on a plane), or does it always need an internet connection?
```

**Bad:**
```
Do you need PWA capabilities with service worker caching for offline-first architecture?
```

### Rule 5: Reference Previous Answers

Connect new questions to what the user already told you. This shows you listened and builds context.

**Good:**
```
You mentioned that recipe creators should be able to set their recipes as private. Who should be able to see private recipes - just the creator, or also people they explicitly share with?
```

**Bad:**
```
What are the privacy settings for the application?
```

### Rule 6: Accept "I Don't Know"

If the user says they don't know or haven't decided, acknowledge it and move on. Record it as an open question.

**Good response to "I don't know":**
```
That's fine - we'll flag this as an open question and the research phase will help us figure it out. Let me move to the next topic.
```

**Bad response to "I don't know":**
```
You need to decide this before we can continue. Here are the options...
```

---

## Step 3: Question Pacing

Control the rhythm of questioning to avoid user fatigue.

### Pacing Rules

1. **Batch intro**: At the start of each category, tell the user what you're exploring and roughly how many questions to expect.

   ```
   Now I want to understand your users - who they are and how they'll use this. I have about 4-6 questions here.
   ```

2. **Progress updates**: After every 10-15 questions, show a brief progress summary.

   ```
   Progress: 15/~50 questions | Categories covered: 2/9
   We've covered core requirements and users. Next up: integrations and external services.
   ```

3. **Energy check**: After every 20 questions, ask if the user wants to continue or take a break.

   ```
   We're about halfway through discovery. Want to keep going, or should we pause and pick this up later? I'll save everything we've covered.
   ```

4. **Category transitions**: Clearly signal when moving to a new category.

   ```
   Great, I have a solid picture of the integrations. Let's talk about what could go wrong - edge cases and error handling.
   ```

---

## Step 4: The 9 Question Categories

### Category 1: Core Requirements

> What does this project need to do?

Ask 5-8 questions from this pool (adapt based on the user's idea):

1. "In one sentence, what does this project do?" (always ask first)
2. "What is the single most important thing it must do well?"
3. "Walk me through the main thing a user would do, step by step."
4. "What would make this project a failure even if it technically works?"
5. "Is this replacing something that exists today, or is it brand new?"
6. "If you could only ship three features, which three?"
7. "What's the minimum viable version - what's the smallest thing that would be useful?"
8. "Are there any hard deadlines or time constraints?"

**Follow-up triggers:**
- If user mentions multiple features: "Let's rank those. Which is most critical?"
- If user is vague: "Can you give me a specific example of how someone would use this?"
- If user mentions replacement: "What does the current solution get wrong?"

---

### Category 2: Users & Context

> Who uses this and in what context?

Ask 4-6 questions from this pool:

1. "Who is the main person using this? Describe them."
2. "Are there other types of users besides the main one? (admins, viewers, etc.)"
3. "How tech-savvy are these users?"
4. "When and where do they use this? (desk, phone, on-the-go, at work)"
5. "How often would they use it? (daily, weekly, occasionally)"
6. "How many users do you expect in the first 3 months? First year?"
7. "Is this for a specific company/team, or for the general public?"
8. "Do users need to collaborate with each other, or is it solo use?"

**Follow-up triggers:**
- If multiple user types: "Which user type is the priority for v1?"
- If enterprise users: "Do they need team management, roles, or permissions?"
- If high user count: "How important is performance under load?"

---

### Category 3: Integration Points

> What does this connect to?

Ask 4-6 questions from this pool:

1. "Does this need to connect to any external services? (payment, email, storage, AI, etc.)"
2. "Does it need to pull data from or push data to any other system?"
3. "Do users need to sign in? If so, how? (email, Google, SSO, etc.)"
4. "Does it need to send notifications? (email, SMS, push, in-app)"
5. "Does it need to handle file uploads? What types and sizes?"
6. "Does it need to work with any APIs you already use?"
7. "Does it need real-time features? (live updates, chat, collaboration)"
8. "Does it need to import or export data in any format?"

**Follow-up triggers:**
- If payment mentioned: "What payment provider? Stripe, PayPal, etc.?"
- If file uploads: "What's the max file size? Any processing needed (resize, convert)?"
- If real-time: "What needs to be real-time? Everything, or just specific features?"

---

### Category 4: Edge Cases

> What could go wrong or be unusual?

Ask 4-6 questions from this pool:

1. "What happens if two users try to edit the same thing at the same time?"
2. "What if the user's internet drops in the middle of an action?"
3. "What should happen when something fails? (show error, retry, save draft)"
4. "Are there any limits? (max items, max file size, max users)"
5. "What if someone tries to misuse or abuse the system?"
6. "Are there any legal or compliance requirements? (GDPR, HIPAA, etc.)"
7. "What happens to user data if they delete their account?"
8. "What if the external services you depend on go down?"

**Follow-up triggers:**
- If data deletion mentioned: "Soft delete or hard delete? Retention period?"
- If compliance mentioned: "Which specific regulations? Any audit trail requirements?"
- If abuse mentioned: "Rate limiting? Content moderation? Reporting?"

---

### Category 5: Quality Attributes

> Performance, security, reliability, accessibility requirements?

Ask 4-6 questions from this pool:

1. "How fast does it need to be? Any specific page load or response time targets?"
2. "How important is uptime? Can users tolerate occasional downtime?"
3. "How sensitive is the data? (public, personal, financial, medical)"
4. "Does it need to be accessible to users with disabilities?"
5. "Does it need to work in multiple languages or regions?"
6. "How important is SEO? Does it need to rank in search engines?"
7. "Does it need to work offline or with poor connectivity?"
8. "What's the data backup and recovery requirement?"

**Follow-up triggers:**
- If sensitive data: "Do you need encryption at rest? Audit logging?"
- If multi-language: "Which languages? Right-to-left support needed?"
- If SEO important: "Which pages specifically need SEO? Blog, product pages, landing?"

---

### Category 6: Existing Patterns

> What conventions or patterns already exist?

**If existing codebase detected:** Focus on what the user WANTS to change or add, not what exists (you already scanned that).

1. "Are there any patterns in the current codebase you want to keep? Any you want to change?"
2. "How do you feel about the current code quality and structure?"
3. "Are there any technical debt items that should be addressed as part of this project?"
4. "Any past architectural decisions you regret?"

**If greenfield project:**

1. "Have you worked with any frameworks or languages before that you prefer?"
2. "Any coding conventions or style preferences? (TypeScript vs JavaScript, tabs vs spaces, etc.)"
3. "Have you seen any apps whose code organization you admire?"
4. "Do you have any strong opinions on testing? (TDD, unit tests, e2e tests)"
5. "Any past projects where the architecture went wrong? What would you do differently?"
6. "Do you have preferences on file organization? (by feature, by type, flat, nested)"

**Follow-up triggers:**
- If TypeScript mentioned: "Strict mode? Or gradual adoption with loose settings?"
- If testing preferences: "What coverage target feels right to you?"
- If past regrets: "What specifically went wrong? How would you prevent it?"

---

### Category 7: Preferences & Tradeoffs

> What tradeoffs are acceptable? What does the user prefer?

Ask 4-6 questions from this pool:

1. "Speed vs polish: ship fast with rough edges, or take longer for a polished v1?"
2. "Build vs buy: build features yourself, or use third-party services where possible?"
3. "Simple vs flexible: a focused tool that does one thing, or a flexible platform?"
4. "Cost vs performance: minimize hosting costs, or pay more for better performance?"
5. "Open source vs proprietary: any preference on the tools and libraries used?"
6. "Monolith vs services: one big app, or separate services that talk to each other?"
7. "Server-rendered vs client-rendered: does the page need to load with content (SEO), or is a loading spinner okay?"
8. "What's more important: adding new features quickly, or having rock-solid stability?"

**Follow-up triggers:**
- If "ship fast": "What's the target launch date?"
- If "use services": "Budget for third-party services per month?"
- If "stability": "How will you measure stability? Error rate, uptime, user complaints?"

---

### Category 8: Monetization & Business Model

> How does this make money or deliver value?

Ask 3-5 questions from this pool:

1. "How does this project make money? Or is it internal/free?"
2. "If paid: subscription, one-time purchase, freemium, or usage-based?"
3. "What features are free vs paid?"
4. "What does success look like in business terms? Revenue target? User count?"
5. "Who is the buyer? (the user themselves, their employer, a different department)"
6. "What's the pricing range you're thinking about?"
7. "Are there any partnerships or affiliate models planned?"
8. "What's the cost of running this per user per month?"

**Follow-up triggers:**
- If subscription: "Monthly, annual, or both? Trial period?"
- If freemium: "What's the conversion trigger? What makes free users want to upgrade?"
- If internal tool: "How many people will use it? What's the ROI calculation?"

---

### Category 9: Visual & UX Vision

> How should it look, feel, and behave?

Ask 4-6 questions from this pool:

1. "Are there any apps or websites whose look and feel you want to emulate?"
2. "What's the overall mood? (professional, playful, minimal, data-dense, etc.)"
3. "Dark mode, light mode, or both?"
4. "Mobile-first, desktop-first, or equal priority?"
5. "Any specific colors, fonts, or brand guidelines to follow?"
6. "How should data-heavy screens be presented? (tables, cards, lists, charts)"
7. "What interaction style? (lots of modals, inline editing, page navigation, wizard)"
8. "Any accessibility requirements beyond basics? (high contrast, screen reader, keyboard nav)"

**Follow-up triggers:**
- If reference apps mentioned: "What specifically do you like about their UI?"
- If data-dense: "How much data on one screen? Pagination, infinite scroll, or load-all?"
- If mobile-first: "Is there a native mobile app plan, or just responsive web?"

---

## Step 5: Follow-up Trigger Rules

Follow-up questions are critical for depth. Apply these rules:

### When to Follow Up

1. **Vague answer**: The user gave a general answer that needs specifics
   - User: "It should be fast"
   - Follow-up: "Fast as in loads in under 1 second? Or fast as in the whole workflow is quick?"

2. **Assumption detected**: The user assumed something that should be explicit
   - User: "Users can share recipes with their friends"
   - Follow-up: "Share how? A link? Inside the app? Both?"

3. **Scope ambiguity**: The answer could mean a small feature or a massive one
   - User: "It needs search"
   - Follow-up: "Basic text search, or advanced search with filters like cuisine, cook time, ingredients?"

4. **Contradiction**: The answer conflicts with a previous answer
   - User said "minimal" but now describes a complex feature
   - Follow-up: "Earlier you mentioned wanting a minimal v1. This feature sounds fairly complex. Should it be in v1 or a later version?"

5. **Critical path**: The answer affects many other decisions
   - User: "It needs to work offline"
   - Follow-up: "Offline is a big architectural decision. Which features specifically need to work offline? All of them, or just reading?"

### When NOT to Follow Up

1. **Clear, specific answer**: The user gave enough detail. Move on.
2. **Low-impact topic**: The answer doesn't significantly affect the plan.
3. **User fatigue signals**: Short answers, "I don't know," "whatever you think."
4. **Already answered**: The information was already covered in a previous answer.

### Maximum Follow-ups Per Question

- 0-1 for simple topics
- 1-2 for medium complexity
- 2-3 for critical decisions (auth, data model, real-time)
- Never more than 3 follow-ups on the same question

---

## Step 6: Progress Indicator

Show a progress indicator after every question using this format:

```
[Category N: {NAME}] Question {M} of ~{TOTAL_ESTIMATE}
Overall: {TOTAL_ASKED}/~{TARGET} questions | Categories: {COVERED}/9
```

Example:
```
[Category 3: Integration Points] Question 2 of ~5
Overall: 14/~50 questions | Categories: 3/9
```

### Progress Milestone Messages

At these milestones, provide additional context:

- **10 questions**: "Good start. We've covered the basics. Now going deeper."
- **25 questions**: "Halfway through. The picture is getting clearer."
- **40 questions**: "Strong foundation. A few more categories to explore."
- **50+ questions**: "Thorough discovery. Wrapping up the remaining areas."

---

## Step 7: Early Stop Handling

Discovery can end before reaching 70 questions if ALL of these are true:

### Early Stop Criteria

1. All 9 categories have at least 2 answered questions
2. Total questions asked >= 40
3. No critical gaps remain (P0 features are fully understood)
4. User signals readiness through any of:
   - Explicit: "That's enough," "Let's move on," "I'm ready"
   - Implicit: Increasingly short answers, "same as before," "you decide"

### Early Stop Procedure

1. Tell the user you have enough to proceed:
   ```
   I think I have a solid understanding. Here's what I know so far:
   [Brief summary of key findings]

   Any major gaps you see? Or are you ready to move to research?
   ```

2. If user confirms, proceed to completion (Step 9)
3. If user adds information, incorporate and re-check criteria

### User-Initiated Early Stop

If the user says "enough" or "let's move on" before criteria are met:

1. Check which categories have gaps
2. Inform the user:
   ```
   We can move on, but I have gaps in these areas:
   - {CATEGORY}: No information about {TOPIC}
   - {CATEGORY}: Unclear about {TOPIC}

   These gaps might cause issues later. Want to quickly address them (2-3 more questions), or should I make reasonable assumptions?
   ```

3. If user says proceed anyway, document the gaps as "ASSUMPTION" in DISCOVERY.md
4. If user answers the gap questions, fill them in and proceed

---

## Step 8: Auto-Save Protocol

Save progress after every category completion and at key milestones.

### Save Triggers

1. **After each category is complete**: Write all Q&A pairs for that category to DISCOVERY.md
2. **After every 10 questions**: Update the progress summary in DISCOVERY.md
3. **On early stop**: Save everything collected so far
4. **On user pause**: Save with a resume marker

### Save Format

Write to `{output_dir}/DISCOVERY.md` using the discovery template. Each save overwrites the file with the full current state (not appending).

### Resume Detection

When the skill starts, check for an existing DISCOVERY.md:

1. If it exists and has answers, offer to resume:
   ```
   I found an existing discovery session with {N} questions answered across {M} categories.
   Want to continue where we left off, or start fresh?
   ```

2. If resuming, read the file, reconstruct state, and continue from the next unanswered category

---

## Step 9: Completion Criteria

Discovery is complete when:

1. **Minimum questions**: At least 40 questions asked and answered
2. **Category coverage**: All 9 categories have at least 2 answered questions
3. **Critical clarity**: The following are clearly understood:
   - What the project does (Core Requirements)
   - Who uses it (Users & Context)
   - How it makes money or delivers value (Business Model)
   - What the top 3 risks are (Edge Cases + Quality)
4. **No blocking unknowns**: Every "I don't know" answer has been flagged for research
5. **User confirmation**: User has agreed discovery is complete

### Completion Actions

When all criteria are met:

1. Write final DISCOVERY.md with all questions, answers, and summary
2. Generate the Discovery Summary section with:
   - Coverage table (questions per category)
   - Key themes (3-5 recurring patterns from answers)
   - Critical requirements (must-have items)
   - Open questions (items flagged for research)
3. Present the summary to the user for confirmation
4. Update STATE.md with Phase 1 completion
5. Announce transition to Phase 2:
   ```
   Discovery complete! I asked {N} questions across all 9 categories.

   Key themes:
   1. {THEME_1}
   2. {THEME_2}
   3. {THEME_3}

   Moving to Phase 2: RESEARCH - I'll investigate the technical landscape and validate our approach.
   ```
