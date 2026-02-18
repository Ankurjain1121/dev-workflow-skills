# Decision Framework

Structured multi-criteria decision analysis for evaluating options.

## When to Use

- **Phase 2 (RESEARCH)**: Evaluate competing technologies, libraries, or approaches
- When choosing between 2 or more options with multiple tradeoff dimensions
- When a decision is important enough to justify formal analysis rather than gut feel

## Analysis Types

### Pros-Cons
Simple list of advantages and disadvantages. Use for low-stakes decisions with 2 options.

### Weighted Criteria
Score options against criteria with importance weights. Use for medium-to-high-stakes decisions with 2-5 options.

### Decision Tree
Map out conditional paths and outcomes. Use when the decision depends on uncertain future events.

### Expected Value
Probability multiplied by value analysis. Use when outcomes can be quantified and probabilities estimated.

### Scenario Analysis
Best-case, worst-case, most-likely evaluation. Use when outcomes are uncertain and you want to stress-test resilience.

## Process

1. State the decision clearly (what needs to be decided and why)
2. List all viable options with brief descriptions
3. Choose the analysis type appropriate to the complexity and stakes
4. Define evaluation criteria with weights (importance from 1-5)
5. Evaluate each option against each criteria (score 1-10)
6. Consider stakeholders, constraints, and risk tolerance
7. Calculate weighted scores
8. Make recommendation with rationale
9. Document risks and mitigation strategies

## Application Format

```
### Decision: [What needs to be decided?]
**Analysis Type:** [Pros-Cons / Weighted Criteria / Decision Tree / Expected Value / Scenario Analysis]
**Risk Tolerance:** [Low / Medium / High]
**Time Constraint:** [When must this be decided?]

**Options:**
1. [Option A]: [Brief description]
2. [Option B]: [Brief description]
3. [Option C]: [Brief description]

**Criteria (weighted):**
| Criteria | Weight | Option A | Option B | Option C |
|----------|--------|----------|----------|----------|
| [Criteria 1] | [1-5] | [1-10] | [1-10] | [1-10] |
| [Criteria 2] | [1-5] | [1-10] | [1-10] | [1-10] |

**Weighted Scores:** A: [total], B: [total], C: [total]
**Recommendation:** [Option] because [rationale]
**Risks:** [What could go wrong with this choice]
**Mitigation:** [How to address the risks]
**Reversibility:** [How hard is it to switch if this turns out wrong?]
```

## Example: Choosing a Backend-as-a-Service

### Decision: Which BaaS for the recipe sharing app?

**Analysis Type:** Weighted Criteria
**Risk Tolerance:** Medium (startup, can pivot but prefer stability)
**Time Constraint:** Must decide in Phase 2 before planning begins

**Options:**
1. **Supabase**: Open-source, PostgreSQL-based, real-time subscriptions, auth, storage
2. **Firebase**: Google-backed, NoSQL (Firestore), real-time, auth, hosting, mature ecosystem
3. **Convex**: TypeScript-native, reactive queries, built-in real-time, newer ecosystem

**Criteria (weighted):**
| Criteria | Weight | Supabase | Firebase | Convex |
|----------|--------|----------|----------|--------|
| SQL / query flexibility | 5 | 9 | 4 | 7 |
| Real-time support | 3 | 7 | 9 | 9 |
| Auth built-in | 3 | 8 | 9 | 6 |
| TypeScript DX | 4 | 7 | 6 | 9 |
| Pricing at scale | 4 | 8 | 5 | 6 |
| Community / docs | 3 | 7 | 9 | 5 |
| Vendor lock-in risk | 3 | 9 | 4 | 6 |

**Weighted Scores:**
- Supabase: (5x9)+(3x7)+(3x8)+(4x7)+(4x8)+(3x7)+(3x9) = 45+21+24+28+32+21+27 = **198**
- Firebase: (5x4)+(3x9)+(3x9)+(4x6)+(4x5)+(3x9)+(3x4) = 20+27+27+24+20+27+12 = **157**
- Convex: (5x7)+(3x9)+(3x6)+(4x9)+(4x6)+(3x5)+(3x6) = 35+27+18+36+24+15+18 = **173**

**Recommendation:** Supabase (198 points) because SQL flexibility is the highest-weighted criteria and recipe data has relational structure (recipes -> ingredients, users -> favorites). PostgreSQL gives us full query power.

**Risks:**
- Supabase real-time is less mature than Firebase
- Supabase edge functions are newer than Firebase Cloud Functions

**Mitigation:**
- Use React Query for data fetching; only add real-time subscriptions for specific features (like collaborative editing) where it is worth the complexity
- Edge function limitations can be worked around with Vercel/Cloudflare serverless functions

**Reversibility:** Medium. Data is in PostgreSQL, which is portable. Auth migration would be the hardest part (user sessions, password hashes).

## Quick Decision Template (For Low-Stakes Choices)

When the decision is small (which CSS library, which icon set, etc.), use this abbreviated format:

```
### Quick Decision: [What?]
**Options:** A vs B
**A wins on:** [1-2 points]
**B wins on:** [1-2 points]
**Pick:** [Choice] because [one sentence reason]
```

## Anti-Patterns to Avoid

- **Analysis paralysis**: If you have been evaluating for more than 10 minutes on a reversible decision, just pick one
- **Ignoring reversibility**: A reversible decision (which CSS framework) deserves less analysis than an irreversible one (which database)
- **Anchoring on the first option**: Evaluate all options before scoring any of them
- **Equal weighting**: If all criteria have the same weight, you are not being honest about priorities. Force-rank them.
