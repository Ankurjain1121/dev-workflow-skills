# Phase 1: UNDERSTAND Protocol

You are executing Phase 1 of UltraPlan. Your job is to exhaustively gather requirements from the user through structured questioning. The user is a no-coder. Use plain English at all times. Never use technical jargon.

---

## Step 1: Codebase Detection

Before asking any questions, scan the project directory for existing code.

**Detection procedure:**
1. Run `ls` on the project root to check for code files
2. Look for: `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `*.csproj`, `pubspec.yaml`, `Gemfile`, or any `src/`, `app/`, `lib/` directories
3. If code files found: use Grep and Glob to identify the tech stack, frameworks, patterns, and conventions
4. Record findings as context for adapting questions

**If codebase exists:**
- Note the stack (e.g., "React + Next.js + Supabase")
- Note patterns (e.g., "uses tRPC for API, Zustand for state")
- Note conventions (e.g., "kebab-case file names, barrel exports")
- Adapt questions to reference what you found: "I see you use React with Next.js. Should this new feature follow the same patterns?"
- Enable Category 6 (Existing Patterns) questions

**If no codebase (greenfield):**
- Skip Category 6 entirely
- Add greenfield-specific questions about tech stack preferences in Category 7
- Proceed with all other categories normally

---

## Step 2: Question Format Rules

Every question MUST use `AskUserQuestion` with multiple-choice options.

**Format requirements:**
- 2-4 options per question (never more, never fewer)
- First option is ALWAYS the recommended choice, marked with "(Recommended)" suffix
- Last option is ALWAYS "Other (tell me what you have in mind)" for custom input
- All options written in plain English, no technical terms
- Each option includes a brief explanation of what it means

**Example of a well-formatted question:**
```
Question: "How should users log into your app?"
Options:
1. "Email and password - classic login with email verification (Recommended)"
2. "Social login only - sign in with Google, Apple, or GitHub"
3. "Both email and social login options"
4. "Other (tell me what you have in mind)"
```

**Example of a POORLY formatted question (never do this):**
```
Question: "What auth provider?"
Options:
1. "OAuth2"
2. "JWT"
3. "Session-based"
```
This is bad because: uses jargon, no explanations, no recommendation, no "Other" option.

---

## Step 3: Question Pacing

- Ask questions in batches of 2-4 RELATED questions per `AskUserQuestion` call
- Each batch covers a single coherent topic within a category
- Never mix categories in the same batch
- After each batch: immediately append answers to `.ultraplan/DISCOVERY.md`

**Batch structure:**
```
Batch 1: Core Requirements - What the app does (3 questions)
Batch 2: Core Requirements - Minimum viable version (2 questions)
Batch 3: Core Requirements - What's out of scope (2 questions)
Batch 4: Users & Context - Who the users are (3 questions)
...
```

---

## Step 4: The 9 Question Categories

You MUST cover all 9 categories (or 8 if greenfield, skipping Category 6). Ask 4-8 questions per category. Total should reach 40-70 questions.

### Category 1: Core Requirements (6-8 questions)
Example questions:
- "In one sentence, what is the main thing your app should do?"
- "If your app could only do ONE thing on launch day, what would it be?"
- "What are the 3-5 most important features you want?"
- "Is there anything similar to what you want that already exists? What do you like/dislike about it?"
- "What would make someone choose your app over alternatives?"
- "What features are nice-to-have but NOT essential for launch?"
- "Is there anything you definitely do NOT want the app to do?"
- "How soon do you need a working version? Days, weeks, or months?"

### Category 2: Users & Context (5-7 questions)
Example questions:
- "Who will use this app? Describe your ideal user."
- "How tech-savvy are your users? Beginners, intermediate, or experts?"
- "Will people use this on their phone, computer, or both?"
- "How many users do you expect at launch? Dozens, hundreds, thousands?"
- "Will users need to create accounts, or can they use it without logging in?"
- "Are there different types of users with different permissions? (e.g., admins vs regular users)"
- "Where are your users located? One country or worldwide?"

### Category 3: Integration Points (5-7 questions)
Example questions:
- "Does this need to connect to any other apps or services? (e.g., payment, email, maps)"
- "Will users need to import or export data? What format?"
- "Should the app send emails or notifications? When?"
- "Do you need to accept payments? One-time, subscription, or marketplace?"
- "Should this work with any social media platforms?"
- "Do you need to store files like images, videos, or documents?"
- "Does this need to work offline or always require internet?"

### Category 4: Edge Cases (5-7 questions)
Example questions:
- "What should happen if something goes wrong? (e.g., payment fails, upload fails)"
- "What if two people try to edit the same thing at the same time?"
- "What happens when a user's account is deleted? What about their data?"
- "Should there be limits? (e.g., max file size, max items, rate limits)"
- "What if someone tries to misuse the app? How should it be prevented?"
- "What happens when the app is empty (brand new user, no content yet)?"
- "Should users be able to undo or reverse their actions?"

### Category 5: Quality Attributes (5-7 questions)
Example questions:
- "How fast should pages load? Instant, a couple seconds, or doesn't matter much?"
- "How important is security? Are you handling sensitive data like health records or finances?"
- "Should the app work 24/7 without downtime, or is some maintenance downtime okay?"
- "Do you need to track what users do in the app? (analytics, activity logs)"
- "Should the app support multiple languages?"
- "How important is accessibility? (screen readers, keyboard navigation, color contrast)"
- "Do you need the app to handle sudden traffic spikes? (e.g., viral social media post)"

### Category 6: Existing Patterns (4-6 questions) -- SKIP IF GREENFIELD
Example questions:
- "I see your project uses [framework]. Should this new feature follow the same patterns?"
- "Your codebase uses [state management]. Should we continue with that or try something different?"
- "I notice you have [authentication] set up. Should the new feature use the same login system?"
- "Your project structure puts files in [pattern]. Should we follow that?"
- "I see existing [API pattern]. Should new endpoints follow the same style?"
- "Are there any parts of the current codebase you'd like to change or improve while we're at it?"

### Category 7: Preferences & Tradeoffs (5-7 questions)
Example questions:
- "When you have to choose: simpler with fewer features, or more powerful but more complex?"
- "Do you prefer a clean minimal look or a feature-rich interface with lots of options visible?"
- "Is it more important to launch fast with basic features, or take longer for a polished product?"
- "How do you feel about using third-party services (like Google Maps, Stripe) vs building everything custom?"
- "If the app grows popular, is it more important to keep costs low or handle unlimited users?"
- "Do you have strong preferences about how the app should be built? Any tools or platforms you prefer?"
- "Are you planning to maintain this yourself, hire developers, or keep using AI tools?"

### Category 8: Monetization & Business Model (5-6 questions)
Example questions:
- "How do you plan to make money with this? (free, paid, freemium, ads, marketplace)"
- "If paid, what price range are you thinking? Per month, per year, or one-time?"
- "Should there be a free tier? What features would be free vs paid?"
- "Do you need a way to manage subscriptions and billing?"
- "Will you need invoices, receipts, or tax handling?"
- "Are there any legal requirements for your industry? (GDPR, HIPAA, etc.)"

### Category 9: Visual & UX Vision (5-8 questions)
Example questions:
- "Describe the look and feel you want. Modern and minimal? Bold and colorful? Professional and corporate?"
- "Are there any apps or websites whose design you love? What do you like about them?"
- "What are the 3-4 most important screens or pages in your app?"
- "Should the app use a dark mode, light mode, or let users choose?"
- "How should the main navigation work? Sidebar, top bar, bottom tabs, or something else?"
- "Do you have brand colors, a logo, or specific fonts you want to use?"
- "What should a user see the very first time they open the app?"
- "How should the app feel to use? Fast and snappy? Calm and relaxed? Fun and playful?"

---

## Step 5: Follow-up Trigger Rules

After each user answer, evaluate whether follow-up is needed:

**Trigger follow-up when:**
- User picks a complex option (e.g., "Real-time features: Yes" -> ask what kind)
- User picks "Other" and gives a vague custom answer
- User's answer contradicts a previous answer
- User's answer opens a new topic area not yet covered
- User mentions something with multiple sub-options

**Skip follow-up when:**
- User gives a clear, unambiguous answer
- User picks a simple yes/no option
- Follow-up would be redundant with upcoming category questions

**Follow-up rules:**
- Maximum 2 follow-up questions per batch
- Follow-ups are part of the current batch, not a separate batch
- Follow-ups do NOT count toward the 40-70 question total

---

## Step 6: Progress Indicator

After every batch, display progress in this exact format:

```
Phase 1/6: UNDERSTAND [=====     ] 45% - Category: Edge Cases (5/9 categories)
Questions asked: 28/~55 | Current batch: 7
```

Calculate percentage as: (categories_completed / total_categories) * 100

---

## Step 7: Early Stop Handling

If the user says "enough", "stop asking", "move on", "let's proceed", "skip ahead", or similar:

1. Acknowledge their request immediately
2. List which categories have been covered and which have NOT
3. Note in DISCOVERY.md under a "## Gaps" section which categories were skipped
4. Add reasonable defaults for skipped categories (mark them as "[DEFAULT - not confirmed by user]")
5. Proceed to Phase 2

**Never push back against early stop.** Respect the user's time. But do inform them of what was missed.

---

## Step 8: Auto-Save Protocol

After EVERY batch of questions (not after every single question), append to `.ultraplan/DISCOVERY.md`:

```markdown
### [Category Name] - Batch [N]

**Q: [Question text]**
A: [User's answer]
[Follow-up if any]

**Q: [Question text]**
A: [User's answer]
```

**First batch also creates the file header:**
```markdown
# UltraPlan Discovery

## Project Idea
[User's original idea description]

## Codebase Detection
- Codebase found: [Yes/No]
- Stack: [detected stack or "Greenfield"]
- Patterns: [detected patterns or "N/A"]

## Discovery Q&A

### Core Requirements - Batch 1
...
```

---

## Step 9: Completion Criteria

Phase 1 is complete when:
- All 9 categories (or 8 for greenfield) have been covered with at least 4 questions each
- Total questions asked is between 40-70
- User has not triggered early stop
- All answers are saved to `.ultraplan/DISCOVERY.md`

**DO NOT stop early on your own.** The system is designed for exhaustive questioning. If you feel you have "enough" information, you are wrong. Keep asking until all categories are covered. The user will tell you if they want to stop.

After completion, display:
```
Phase 1/6: UNDERSTAND [==========] 100% - Complete!
Questions asked: [N] across 9 categories
Discovery saved to .ultraplan/DISCOVERY.md
Moving to Phase 2: RESEARCH...
```
