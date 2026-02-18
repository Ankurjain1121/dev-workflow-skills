# Sequential Thinking Framework

Structured step-by-step reasoning with revision and branching support.

## When to Use

- **Phase 5 (VALIDATE)**: Systematic requirement tracing through the plan -- walk through each requirement and verify it is addressed
- **Any phase**: When complex multi-step reasoning is needed and you want an auditable trail
- When a conclusion requires building on multiple premises in order

## Core Concept

Sequential thinking numbers each thought and builds on previous ones. Unlike free-form reasoning, it creates an auditable chain where each step explicitly references what came before. Critically, it supports REVISION (correcting earlier steps) and BRANCHING (exploring alternatives).

## Process

1. Number each thought sequentially (Thought 1, 2, 3...)
2. Estimate total thoughts needed upfront (can revise later)
3. Build each thought on previous ones -- state the connection explicitly
4. If a thought reveals a flaw in earlier reasoning: **REVISE** (mark which thought is being revised and why)
5. If a thought opens an alternative path: **BRANCH** (mark the branch point and label the branch)
6. Continue until conclusion is reached
7. Mark final thought as conclusion

## Features

- **Revision**: "Revising Thought 3 because..." -- Correct earlier reasoning without starting over. The revised thought replaces the original in the chain.
- **Branching**: "Branch from Thought 5: Alternative approach..." -- Explore alternatives without losing the main chain. Label branches as 5a, 5b, etc.
- **Recalibration**: "Originally estimated 8 thoughts, now need 12 because..." -- Adjust scope as understanding deepens.
- **Hypothesis tagging**: Mark thoughts as hypothesis, evidence, inference, or conclusion for clarity.

## Application Format

```
### Sequential Analysis: [Topic]
**Estimated thoughts:** [N]

**Thought 1:** [First observation or premise]
**Thought 2:** [Building on Thought 1...]
**Thought 3:** [Building on Thought 2...]
**Thought 3 (REVISED):** [Correcting Thought 3 because...]
**Thought 4:** [Continuing from revised Thought 3...]
**Thought 4a (BRANCH):** [Alternative path from Thought 4...]
**Thought 5:** [Continuing main chain...]
**Thought 6 (CONCLUSION):** [Final conclusion]

**Result:** [Summary of conclusion and key insights]
```

## Example: Validating Requirements Coverage

### Sequential Analysis: Does the recipe app plan cover all user requirements?

**Estimated thoughts:** 10

**Thought 1:** Requirement: "Users can create recipes with ingredients and steps." The plan has a "Recipe CRUD" section in Phase 1 with tasks for form creation, validation, and database schema. This requirement is covered.

**Thought 2:** Requirement: "Users can share recipes via link." The plan mentions a "Share" button in the Recipe Detail page task, but does not specify URL structure or whether shared recipes are public by default. Partially covered.

**Thought 3:** Requirement: "Users can search recipes by ingredient." The plan has a "Search" section but the tasks only mention title search. Ingredient search is not mentioned.

**Thought 3 (REVISED):** Looking more carefully at the Search section, Task 3.2 says "full-text search across title and ingredients." This requirement IS covered, but the implementation notes do not specify how ingredient search will work with structured data (ingredients are in a separate table). The requirement is addressed but the implementation plan is incomplete.

**Thought 4:** Requirement: "Users can scale recipes to different serving sizes." No task in the plan addresses this. Missing entirely.

**Thought 4a (BRANCH):** Should scaling be Phase 1 or Phase 2? It is a core cooking feature that users expect. If we defer it, the app feels incomplete. Branch conclusion: Add to Phase 1.

**Thought 5:** Requirement: "Users can save favorites." The plan has "Favorites" in Phase 2. Since this is a standard feature and not core to recipe creation, Phase 2 placement is reasonable.

**Thought 6:** Recalibrating: Originally estimated 10 thoughts, only need 8. Remaining requirements are all clearly covered.

**Thought 7:** Summary of gaps found: (1) Recipe sharing needs URL/privacy specification, (2) Ingredient search needs implementation detail, (3) Recipe scaling is missing entirely.

**Thought 8 (CONCLUSION):** The plan covers 4 of 5 core requirements, with 1 missing (scaling) and 2 needing more detail (sharing privacy, ingredient search implementation). Recommend adding these before finalizing.

**Result:** Three plan modifications needed: add recipe scaling to Phase 1, specify sharing URL structure and default privacy, detail ingredient search implementation against relational data.

## Tips for Effective Sequential Thinking

1. **Be explicit about connections**: "Building on Thought 3, which established that..." is better than just continuing.
2. **Revise freely**: Revision is a strength, not a weakness. It shows the reasoning is self-correcting.
3. **Branch sparingly**: Only branch when there is a genuine alternative worth exploring. Most reasoning is linear.
4. **Keep thoughts focused**: One idea per thought. If a thought tries to cover too much, split it.
5. **Conclude definitively**: The final thought should state a clear conclusion, not trail off.
