# Phase 3a: PRD Writing Protocol

You are executing Phase 3a of UltraPlan. Your job is to generate a human-readable Product Requirements Document (PRD) from the discovery and research findings. The PRD is written for the USER (a no-coder). It must be 100% plain English with zero technical jargon.

---

## The Zero Jargon Rule

This is the most important rule for the PRD. The user is a no-coder. Every sentence must be understandable by someone who has never written code.

**Jargon-to-plain-English translations (examples):**

| Never Write This | Write This Instead |
|-------------------|-------------------|
| OAuth2 SSO integration | Login with Google/GitHub so users don't need a new password |
| WebSocket real-time sync | Changes appear instantly for everyone without refreshing |
| RESTful API endpoints | Ways for the app to send and receive data |
| PostgreSQL with row-level security | A secure database that only shows users their own data |
| CI/CD pipeline | Automatic testing and publishing when changes are made |
| Microservices architecture | The app is built as separate pieces that work together |
| Redis caching layer | A speed boost that remembers frequently requested information |
| JWT token authentication | A secure way to keep users logged in |
| Responsive design | Works well on phones, tablets, and computers |
| CRUD operations | Creating, viewing, editing, and deleting things |
| Middleware | Behind-the-scenes checks that happen automatically |
| Webhook integration | Automatic notifications sent to other apps when something happens |

**Self-check:** After writing each section, re-read it and ask: "Would my non-technical friend understand every sentence?" If not, rewrite.

---

## The 10 PRD Sections

Generate each section one at a time. Present each to the user for approval before moving to the next.

### Section 1: What We're Building
**Content:** 3-5 sentences that any person could understand. What is this thing? What does it do at the highest level?
**Length:** 50-100 words
**Sources:** DISCOVERY.md Category 1 (Core Requirements), user's original idea description

**Example:**
> We're building a recipe sharing app where home cooks can save their favorite recipes, share them with friends and family, and discover new dishes from other cooks. Think of it as a personal cookbook that's also a social network for food lovers. Users can upload photos of their dishes, organize recipes into collections, and follow other cooks whose taste they enjoy.

### Section 2: The Problem
**Content:** What problem does this solve? Why does it matter? Why do existing solutions fall short?
**Length:** 50-100 words
**Sources:** DISCOVERY.md Category 1, competitor insights from RESEARCH.md

**Example:**
> Home cooks currently scatter their recipes across bookmarks, screenshots, handwritten notes, and various apps. There's no single place to keep everything organized AND share with others. Existing recipe apps are either too simple (just a list) or too complex (designed for professional chefs). We need something in the middle: easy to use, beautiful to look at, and built for sharing with the people you actually cook for.

### Section 3: Who It's For
**Content:** User types, their needs, their experience level. Be specific and human.
**Length:** 75-150 words
**Sources:** DISCOVERY.md Category 2 (Users & Context)

**Example:**
> **Home Cooks** (primary): People who cook at home regularly and want to organize and share their recipes. They range from beginners following YouTube tutorials to experienced cooks with family recipes passed down through generations. They use their phones while cooking and their computers for browsing.
>
> **Recipe Browsers** (secondary): People who don't cook often but want to find and save recipes from others. They mostly browse and save, rarely create.
>
> **Family/Friends** (passive): People who receive shared recipes but may not have accounts. They just need to view the recipe clearly.

### Section 4: What It Does
**Content:** Feature list in plain English, organized by priority (Must Have, Should Have, Nice to Have).
**Length:** 150-300 words
**Sources:** DISCOVERY.md Category 1 + 3 (Core Requirements + Integration Points)

**Format:**
```markdown
### Must Have (Launch Day)
- [Feature]: [One-sentence description of what the user can do]

### Should Have (Soon After Launch)
- [Feature]: [One-sentence description]

### Nice to Have (Future)
- [Feature]: [One-sentence description]
```

### Section 5: How It Should Feel
**Content:** Visual and UX vision. Describe the experience, not the implementation.
**Length:** 75-150 words
**Sources:** DISCOVERY.md Category 9 (Visual & UX Vision)

### Section 6: What It Connects To
**Content:** External services, integrations, data flows -- all in plain English.
**Length:** 50-100 words
**Sources:** DISCOVERY.md Category 3 (Integration Points), RESEARCH.md

### Section 7: What It Does NOT Do
**Content:** Explicit scope boundaries. This is critical for preventing scope creep later.
**Length:** 50-100 words
**Sources:** DISCOVERY.md Category 1 (out-of-scope answers), Category 7 (tradeoffs)

**Example:**
> - This app does NOT include meal planning or grocery lists (that's a separate product)
> - No video recipes -- photos and text only for now
> - No built-in cooking timer or step-by-step cooking mode
> - Not a marketplace -- users cannot sell recipes or products

### Section 8: How We'll Know It Works
**Content:** Success criteria in measurable terms. What does "done" look like?
**Length:** 50-100 words
**Sources:** DISCOVERY.md Category 5 (Quality Attributes), overall vision

**Example:**
> - A user can go from opening the app to saving their first recipe in under 2 minutes
> - Shared recipe links load correctly for people without accounts
> - The app loads in under 3 seconds on a normal phone connection
> - Users can find any of their saved recipes within 10 seconds

### Section 9: Business Model
**Content:** How this makes money (or doesn't). Clear and honest.
**Length:** 50-100 words
**Sources:** DISCOVERY.md Category 8 (Monetization & Business Model)

### Section 10: Risks & Concerns
**Content:** Top 3-5 risks in plain language. What could go wrong? What's tricky?
**Length:** 75-150 words
**Sources:** RESEARCH.md risks, DISCOVERY.md Category 4 (Edge Cases) + 5 (Quality Attributes)

**Example:**
> 1. **Photo storage costs**: If many users upload high-resolution food photos, storage costs could grow quickly. We'll need to compress images and set reasonable size limits.
> 2. **Content moderation**: If the app grows, we'll need a way to handle inappropriate content or spam recipes.
> 3. **Recipe copyright**: Users might copy recipes from cookbooks or other websites. We should add a "source" field and terms of use.

---

## Section-by-Section Approval Protocol

For each of the 10 sections:

1. **Generate** the section following the guidelines above
2. **Present** it to the user with a progress indicator:
   ```
   Phase 3/6: PLAN - PRD Section 4/10: What It Does
   ```
3. **Ask for approval** via AskUserQuestion:
   ```
   Question: "Here's the '[Section Name]' section of your product requirements. How does it look?"
   Options:
   1. "Looks right, move on (Recommended)"
   2. "Change something in this section"
   3. "Remove this section entirely"
   4. "Add something I forgot to mention"
   ```
4. **Handle feedback:**
   - "Looks right": Save section, move to next
   - "Change something": Ask what to change (use AskUserQuestion or let them type freely), regenerate ONLY that section, re-present for approval
   - "Remove": Remove section, note removal, move to next
   - "Add something": Ask what to add, incorporate into section, re-present for approval
5. **Loop** until approved, then move to next section

**Maximum revision rounds per section:** 3. After 3 rounds, accept and move on (user can always come back with /ultraplan update).

---

## Writing the PRD File

After all 10 sections are approved, write the complete PRD to `.ultraplan/PRD.md`:

```markdown
# [Project Name] - Product Requirements

> Generated by UltraPlan | [Date]
> This document describes what we're building in plain English.
> For the technical implementation plan, see PLAN.md.

## What We're Building
[Approved section 1]

## The Problem
[Approved section 2]

## Who It's For
[Approved section 3]

## What It Does
[Approved section 4]

## How It Should Feel
[Approved section 5]

## What It Connects To
[Approved section 6]

## What It Does NOT Do
[Approved section 7]

## How We'll Know It Works
[Approved section 8]

## Business Model
[Approved section 9]

## Risks & Concerns
[Approved section 10]
```

---

## Completion

After writing PRD.md, display:
```
Phase 3/6: PLAN - PRD [==========] 100% - All 10 sections approved!
PRD saved to .ultraplan/PRD.md
Now generating technical plan (Step 3b)...
```

Proceed to Phase 3b (plan-writing.md).
