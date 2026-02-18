# Debugging Approaches Framework

Systematic debugging and pre-mortem analysis strategies.

## When to Use

- **Phase 4 (REVIEW)**: Pre-mortem debugging of potential issues in the plan before implementation begins
- When investigating why something might fail before it is built
- When a plan section feels risky and needs stress-testing

## Available Approaches

### Binary Search
Narrow down the problem space by halving. Eliminate half the possible causes with each test.

**Best for:** "It works in A but not in B" problems, narrowing down which commit broke something, finding which config value causes a failure.

### Reverse Engineering
Start from the desired outcome, work backward to identify what must be true at each step.

**Best for:** Understanding complex systems, figuring out why a third-party tool produces certain output, validating that a plan will actually produce the desired result.

### Divide and Conquer
Break a complex issue into isolated sub-problems. Solve each independently.

**Best for:** Multi-symptom failures, complex features that seem to fail "everywhere," debugging distributed systems.

### Backtracking
Systematically try paths, undo when stuck, try the next path.

**Best for:** Configuration issues (try each setting), permission problems (check each layer), finding which combination of factors causes a bug.

### Cause Elimination
List all possible causes, eliminate one by one with evidence.

**Best for:** Pre-mortem analysis ("what could go wrong?"), root cause analysis of production incidents, systematic risk assessment of a plan.

### Program Slicing
Trace data or control flow through specific paths. Follow one piece of data from input to output.

**Best for:** Data corruption issues, understanding how a value gets transformed, finding where bad state enters the system.

## Process

1. Name the approach
2. Describe the issue or potential failure being investigated
3. Walk through diagnostic steps systematically
4. Document findings at each step
5. State the resolution or recommendation

## Application Format (Pre-Mortem Style)

```
### Debugging Approach: [Approach Name]
**Potential Issue:** [What could go wrong in this section/task?]
**Diagnostic Steps:**
1. [Step to investigate]
2. [Step to investigate]
3. [Step to investigate]
**Findings:** [What the analysis reveals]
**Resolution:** [How to prevent or handle this in the plan]
```

## Example: Cause Elimination on "Payment Failures"

**Potential Issue:** Users cannot complete checkout in the e-commerce section of the plan.

**Diagnostic Steps:**
1. Could it be Stripe API key misconfigured? -- Add env validation task at startup
2. Could it be webhook endpoint unreachable? -- Add health check task and monitoring
3. Could it be currency mismatch between frontend display and Stripe charge? -- Add currency validation at API boundary
4. Could it be session expiry during long payment flow? -- Add session refresh before payment submission
5. Could it be 3D Secure redirect losing state? -- Add payment intent ID to URL params for recovery

**Findings:** 5 failure modes identified. None are currently addressed in the plan. All are common in production payment systems.

**Resolution:** Add an error handling section to the payment epic covering all 5 modes. Add a payment integration test task that simulates each failure.

## Example: Reverse Engineering on "User Sees Stale Data"

**Potential Issue:** After editing a recipe, the user navigates back to the list and sees the old version.

**Diagnostic Steps (working backward from desired outcome):**
1. User sees updated recipe in list -- list must re-fetch or cache must be invalidated
2. Cache is invalidated -- mutation hook must call invalidateQueries(['recipes'])
3. Mutation succeeds -- API returns updated data, mutation hook fires onSuccess
4. API updates database -- Supabase UPDATE returns the new row
5. User submits edit -- form sends correct payload to API

**Findings:** The chain breaks at step 2 if cache invalidation is not explicitly configured. React Query does not automatically invalidate related queries.

**Resolution:** Add cache invalidation to every mutation hook in the plan. Document the invalidation strategy: which queries to invalidate for each mutation.

## Example: Divide and Conquer on "Complex Feature Failure"

**Potential Issue:** The meal planning feature involves recipes, calendar, grocery lists, and notifications. It feels fragile.

**Diagnostic Steps (isolate each sub-system):**
1. Recipes sub-system: Can a user select recipes independently? -- Yes, this is existing functionality
2. Calendar sub-system: Can a user add/remove items from dates independently? -- Test with dummy data, no recipe dependency
3. Grocery list sub-system: Can it aggregate ingredients from a hardcoded list? -- Test without calendar dependency
4. Notifications sub-system: Can it fire at scheduled times independently? -- Test with cron/queue in isolation

**Findings:** Each sub-system can be built and tested independently. The integration points are: calendar calls recipes (read-only), grocery list reads calendar entries, notifications read calendar entries.

**Resolution:** Plan each sub-system as a separate task with its own tests. Add integration tasks that connect them. Test each in isolation before integrating.

## Pre-Mortem Checklist

Use this checklist during Phase 4 (REVIEW) to systematically stress-test a plan:

| Category | Question | Approach to Use |
|----------|----------|-----------------|
| Data | What happens with malformed input? | Program Slicing |
| Auth | What if tokens expire mid-flow? | Reverse Engineering |
| Network | What if an API call fails or times out? | Cause Elimination |
| State | What if cached data is stale? | Reverse Engineering |
| Concurrency | What if two users edit simultaneously? | Cause Elimination |
| Scale | What happens with 10x expected load? | Divide and Conquer |
| Dependencies | What if a third-party service is down? | Cause Elimination |
| Deployment | What if the migration fails halfway? | Backtracking |
