# Mental Models Framework

Apply named mental models to decompose and analyze problems.

## Available Models

- **First Principles Thinking**: Break down to fundamental truths, rebuild from there. Strip away assumptions and conventions to find what is irreducibly true, then reason upward.
- **Opportunity Cost Analysis**: What are you giving up by choosing this path? Every choice has a next-best alternative that is sacrificed.
- **Error Propagation Understanding**: How do small errors compound through a system? A wrong assumption in layer 1 cascades into larger failures at layers 2, 3, and beyond.
- **Rubber Duck Debugging**: Explain the problem step by step to reveal hidden assumptions. The act of articulating forces precision.
- **Pareto Principle (80/20)**: Which 20% of effort produces 80% of results? Identify the high-leverage items and prioritize them.
- **Occam's Razor**: Prefer the simplest explanation that fits the facts. Do not multiply entities beyond necessity.

## When to Use

- **Phase 1 (UNDERSTAND)**: First Principles to decompose the user's idea before questioning. Strip away what they said they want and find what they actually need.
- **Phase 6 (OUTPUT)**: Pareto check on what matters most in the final summary. Ensure the plan emphasizes the 20% that delivers 80% of value.
- **Any phase**: When stuck, facing a complex decision, or when reasoning feels muddled.

## Process

1. Name the model you are applying
2. State the problem being analyzed
3. Walk through the model's steps explicitly
4. State the reasoning connecting steps to conclusion
5. State the conclusion or insight gained

## Application Format

```
### Mental Model: [Model Name]
**Problem:** [What are we analyzing?]
**Steps:**
1. [Step applying the model]
2. [Step applying the model]
3. [Step applying the model]
**Reasoning:** [How steps lead to conclusion]
**Conclusion:** [Insight gained]
```

## Examples

### First Principles on "Recipe Sharing App"

**Problem:** What does a recipe sharing app fundamentally need?

**Steps:**
1. Strip away assumptions: forget existing apps like AllRecipes, Cookpad, etc.
2. Core truth: People have recipes (structured data: ingredients + steps)
3. Core truth: People want others to see their recipes (sharing mechanism)
4. Core truth: People want to find recipes (discovery mechanism)

**Reasoning:** Every feature should serve one of these three truths. Anything else is optional enhancement. Social features, comments, ratings, and meal planning all layer on top of these fundamentals.

**Conclusion:** MVP = create recipe + share link + search. Everything else is enhancement.

### Opportunity Cost on "Build vs Buy Auth"

**Problem:** Should we build custom authentication or use a service like Clerk/Auth0?

**Steps:**
1. Building custom auth costs ~2-3 weeks of development time
2. That time could instead be spent on core product features
3. The opportunity cost = 2-3 weeks of feature development lost
4. Auth services cost $25-100/month but save those weeks

**Reasoning:** Unless auth IS your product, the time spent building it is time not spent on what makes your product unique. The monetary cost of a service is far less than the opportunity cost of delayed features.

**Conclusion:** Use an auth service. Redirect the 2-3 weeks toward core differentiating features.

### Error Propagation on "Unvalidated User Input"

**Problem:** What happens if we skip input validation on the recipe creation form?

**Steps:**
1. Layer 1: User submits malformed ingredient quantities ("two cups" instead of structured data)
2. Layer 2: Database stores inconsistent data types
3. Layer 3: Recipe scaling calculations break (can't multiply "two cups" by 2)
4. Layer 4: Exported grocery lists show garbage data
5. Layer 5: Users lose trust in the entire platform

**Reasoning:** A small omission at the input layer propagates through every downstream system. Each layer amplifies the error.

**Conclusion:** Input validation is not optional. Add structured input with validation at the form level, and add database constraints as a safety net.

## Combining Models

Models are most powerful when combined:
- Use **First Principles** to identify what matters, then **Pareto** to prioritize
- Use **Rubber Duck** to articulate the problem, then **Occam's Razor** to find the simplest solution
- Use **Opportunity Cost** to evaluate options, then **Error Propagation** to check for hidden risks in the chosen path
