# Structured Argumentation Framework

Formal dialectical reasoning using thesis-antithesis-synthesis.

## When to Use

- **Phase 3 (PLAN)**: Justify technical decisions with structured arguments that consider both sides
- When evaluating competing positions or defending a recommendation
- When a decision is contentious and the reasoning needs to be explicit and auditable

## Core Concept

Structured argumentation forces you to consider the opposing view before committing to a position. The thesis-antithesis-synthesis pattern originates from dialectical reasoning: state your position, state the strongest counter-position, then find a higher-order position that integrates insights from both. This prevents one-sided analysis.

## Argument Components

| Component | Description | Purpose |
|-----------|-------------|---------|
| **Thesis** | Initial position or claim | What you believe and why |
| **Antithesis** | Counter-argument or opposing view | The strongest case against your thesis |
| **Synthesis** | Integration that resolves the tension | A better position informed by both sides |
| **Objection** | Specific challenge to a premise | Targets a specific weak point |
| **Rebuttal** | Defense against an objection | Addresses the challenge directly |

## Process

1. State the main claim clearly and completely
2. List supporting premises with evidence
3. Draw the logical conclusion that follows from the premises
4. Construct the strongest counter-argument (antithesis) -- not a strawman
5. List the antithesis premises with their own evidence
6. Evaluate strengths and weaknesses of both positions honestly
7. Synthesize into a stronger position that addresses both
8. Assign a confidence level to the synthesis

## Application Format

```
### Argument: [Topic]
**Type:** Thesis -> Antithesis -> Synthesis

**THESIS:** [Main claim]
- Premise 1: [Supporting point with evidence]
- Premise 2: [Supporting point with evidence]
- Premise 3: [Supporting point with evidence]
- Conclusion: [What follows logically from premises]
- Confidence: [0.0-1.0]

**ANTITHESIS:** [Counter-position -- make it strong, not a strawman]
- Premise 1: [Counter-point with evidence]
- Premise 2: [Counter-point with evidence]
- Premise 3: [Counter-point with evidence]
- Conclusion: [What follows from counter-premises]
- Confidence: [0.0-1.0]

**SYNTHESIS:** [Resolution that integrates both]
- Strengths retained from thesis: [What survives]
- Strengths retained from antithesis: [What survives]
- Weaknesses addressed: [What is resolved]
- Final position: [The integrated claim]
- Confidence: [0.0-1.0]
```

## Example: Server-Side vs Client-Side Rendering

### Argument: Rendering Strategy for Recipe App

**THESIS:** "We should use server-side rendering (SSR) for all pages"
- Premise 1: SSR provides fast initial page loads because HTML is ready on first request (evidence: web.dev Core Web Vitals guidelines)
- Premise 2: SSR is essential for SEO because search engine crawlers reliably index server-rendered HTML (evidence: Google Search Central documentation)
- Premise 3: SSR simplifies the mental model -- one rendering path, no hydration mismatches
- Conclusion: SSR everywhere gives the best user experience and developer experience
- Confidence: 0.55

**ANTITHESIS:** "We should use client-side rendering (CSR) for interactive pages"
- Premise 1: CSR enables richer interactivity -- recipe editor with drag-and-drop steps, live preview, and instant feedback (evidence: complex UIs like Figma, Notion are CSR)
- Premise 2: CSR reduces server costs because rendering happens on the client (evidence: AWS/Vercel pricing for serverless SSR functions)
- Premise 3: After initial load, CSR page transitions are instant (no round-trip to server)
- Conclusion: CSR is better for the interactive parts of the app (dashboard, editor, meal planner)
- Confidence: 0.60

**SYNTHESIS:** "Use SSR for public/SEO pages, CSR for authenticated interactive pages"
- Strengths retained from thesis: SEO-critical pages (recipe detail, search results, homepage) get SSR benefits -- fast initial load, reliable indexing
- Strengths retained from antithesis: Interactive pages (recipe editor, dashboard, meal planner) get CSR benefits -- rich interactivity, instant transitions
- Weaknesses addressed: SSR's poor interactivity is avoided where it matters; CSR's poor SEO is avoided where it matters
- Final position: Next.js hybrid approach -- static generation for recipe pages (ISR with revalidation), server components for data-heavy pages, client components for interactive features. The rendering strategy is chosen per-page based on its requirements, not globally.
- Confidence: 0.85

## Example: Monolith vs Microservices

### Argument: Architecture Scale for MVP

**THESIS:** "Start with a monolith"
- Premise 1: Faster to build -- no network boundaries, shared database, single deployment
- Premise 2: Easier to refactor -- rename a function and it changes everywhere
- Premise 3: The recipe app is a single-team project with no need for independent scaling
- Conclusion: Monolith is the right choice for an MVP
- Confidence: 0.80

**ANTITHESIS:** "Start with modular services"
- Premise 1: Recipe image processing (resizing, optimization) has different scaling needs than recipe CRUD
- Premise 2: A modular architecture now prevents a painful migration later when the app grows
- Premise 3: Serverless functions are already "micro" -- each API route is an independent function
- Conclusion: Modular services give better future flexibility
- Confidence: 0.45

**SYNTHESIS:** "Modular monolith with clear boundaries"
- Strengths retained from thesis: Single deployment, shared database, fast development
- Strengths retained from antithesis: Clear module boundaries that CAN be extracted later
- Final position: Build a monolith but organize code into feature modules (recipes/, users/, meal-planning/) with explicit boundaries. Each module has its own types, API routes, and database queries. No cross-module imports except through public interfaces. This gives monolith speed now and microservice extraction capability later.
- Confidence: 0.88

## Guidelines for Strong Arguments

1. **Steel-man the antithesis**: Make the counter-argument as strong as possible. If you can only think of weak counter-arguments, you are not trying hard enough.
2. **Cite evidence**: "Studies show" is weak. "Google's Core Web Vitals report from 2024 shows LCP targets of under 2.5s" is strong.
3. **Assign honest confidence**: If thesis confidence is 0.9 and antithesis is 0.2, you are probably not being fair to the antithesis.
4. **Synthesis is not compromise**: Synthesis is not "do a little of both." It is a higher-order position that resolves the tension. Sometimes synthesis is "thesis wins, but with modifications from antithesis."
5. **Know when to stop**: Not every argument needs synthesis. Sometimes the thesis is clearly right and the antithesis is useful only for identifying risks.
