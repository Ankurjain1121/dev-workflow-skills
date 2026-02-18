# Scientific Method Framework

Rigorous hypothesis testing and evidence-based reasoning.

## When to Use

- **Phase 2 (RESEARCH)**: Form and test hypotheses about technology choices, architecture approaches, or user needs
- **Phase 5 (VALIDATE)**: Verify that plan hypotheses hold up against evidence
- When making claims that should be tested rather than assumed
- When two people disagree and you need a way to resolve it with evidence

## Core Concept

The scientific method replaces opinion with evidence. Instead of saying "I think Supabase is better," you form a testable hypothesis, define what evidence would confirm or refute it, gather that evidence, and reach a conclusion. This prevents cargo-cult technology choices and assumption-driven planning.

## Process (7 Stages)

### 1. Observation
What do we notice about the problem, the user's needs, or the technical landscape?

### 2. Question
What specific, answerable question does this raise? Narrow and precise questions lead to better hypotheses.

### 3. Hypothesis
What do we predict? State it as "If X, then Y" -- a falsifiable prediction.
- **Independent variable**: What we are changing or choosing
- **Dependent variable**: What we are measuring or evaluating
- **Controlled variables**: What stays the same across options
- **Assumptions**: What we are taking for granted (and should verify)

### 4. Experiment
How do we test this? What would we observe if the hypothesis is correct? What would we observe if it is wrong?

### 5. Analysis
What do the results tell us? Are they conclusive or ambiguous? Do they apply to our specific context?

### 6. Conclusion
Was the hypothesis supported, refuted, or does it need refinement? What is our updated belief?

### 7. Iteration
What new questions arise from the conclusion? What should we test next?

## Application Format

```
### Scientific Inquiry: [Topic]
**Stage:** [Current stage]

**Observation:** [What we noticed]
**Question:** [Specific question]
**Hypothesis:** If [condition], then [predicted outcome]
  - Independent variable: [What we're changing]
  - Dependent variable: [What we're measuring]
  - Controlled: [What stays the same]
  - Assumptions: [What we're taking for granted]

**Experiment:** [How we'll test]
  - If hypothesis is correct: [Expected result]
  - If hypothesis is wrong: [Alternative result]

**Results:** [What we found]
**Conclusion:** [Hypothesis supported / refuted / needs refinement]
**Next:** [What to investigate next]
```

## Example: Backend-as-a-Service Selection

### Scientific Inquiry: Database Architecture for Recipe App

**Observation:** The recipe app has relational data (recipes have many ingredients, users have many favorites). The user wants real-time features and fast development.

**Question:** Does a relational database (PostgreSQL via Supabase) outperform a document database (Firestore via Firebase) for this specific data model?

**Hypothesis:** If we use Supabase (PostgreSQL), then complex queries (e.g., "find recipes containing tomatoes AND cheese, sorted by rating, with pagination") will be simpler to write and faster to execute than in Firestore.

- Independent variable: Database choice (Supabase vs Firebase)
- Dependent variable: Query complexity (lines of code) and query performance (latency)
- Controlled: Same data set, same query requirements, same hosting region
- Assumptions: Both services are available and have comparable uptime

**Experiment:**
- Write the query in both systems for 3 test cases:
  1. Multi-ingredient search with sorting
  2. Aggregation: average rating per category
  3. Join: recipe details with author info and ingredient list
- If hypothesis is correct: Supabase queries will be 1-5 lines of SQL each; Firestore will require multiple queries, client-side joins, or denormalization
- If hypothesis is wrong: Firestore queries will be equally concise using its query API

**Results:**
1. Multi-ingredient search: Supabase = 4-line SQL with WHERE/IN. Firestore = requires array-contains-any (limited to 10 values) or denormalized ingredient index
2. Aggregation: Supabase = 1-line SQL with AVG/GROUP BY. Firestore = requires aggregation query (limited) or pre-computed field
3. Join: Supabase = 1 SQL query with JOIN. Firestore = 2-3 separate reads, client-side assembly

**Conclusion:** Hypothesis supported. PostgreSQL is significantly better for this relational data model. Firestore would require denormalization and multiple queries for operations that are single SQL statements in Supabase.

**Next:** Test Supabase real-time subscriptions to verify they meet the real-time collaboration requirement. This is Supabase's weaker area compared to Firebase.

## Example: Performance Hypothesis

### Scientific Inquiry: Image Loading Strategy

**Observation:** Recipe app will be image-heavy (recipe photos, step photos). Users are on mobile with variable connections.

**Question:** Will lazy loading images with blur placeholders reduce perceived load time compared to eager loading?

**Hypothesis:** If we implement lazy loading with blur-up placeholders (like Next.js Image component), then Largest Contentful Paint (LCP) will improve by at least 30% on 3G connections.

- Independent variable: Image loading strategy (lazy+blur vs eager)
- Dependent variable: LCP on simulated 3G
- Controlled: Same page, same images, same server
- Assumptions: Browser supports IntersectionObserver (99%+ support)

**Experiment:**
- Build two versions of the recipe list page
- Measure LCP using Lighthouse on simulated 3G
- If correct: LCP improves 30%+ with lazy loading
- If wrong: LCP is similar or worse (blur placeholder decode time offsets savings)

**Results:** [To be filled after implementation/testing]

**Conclusion:** [Pending]

**Next:** If confirmed, apply same strategy to step-by-step recipe photos. If refuted, investigate alternative strategies (progressive JPEG, AVIF format).

## When to Skip This Framework

Not every decision needs the scientific method. Use it when:
- The decision is irreversible or expensive to change
- Two reasonable people disagree on the answer
- The claim is testable with available evidence
- Assumptions are stacking up without verification

Skip it when:
- The decision is easily reversible (CSS library choice)
- The answer is well-documented and widely agreed upon
- Time pressure makes formal analysis impractical (use Decision Framework quick template instead)
