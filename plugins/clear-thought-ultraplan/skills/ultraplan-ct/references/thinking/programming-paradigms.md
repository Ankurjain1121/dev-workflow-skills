# Programming Paradigms Framework

Select the right programming paradigm for different parts of the system.

## When to Use

- **Phase 3 (PLAN)**: Choose implementation paradigms for different sections of the codebase
- When deciding between OOP, functional, reactive, etc. for a specific module
- When the default paradigm feels wrong for a particular problem

## Available Paradigms

### Imperative
Step-by-step instructions that change program state. Best for scripts, migrations, setup procedures.

**Characteristics:** Sequential execution, explicit control flow, mutable state
**Good for:** Build scripts, database migrations, CLI tools, setup wizards
**Watch out for:** Spaghetti code in large programs, hard to test, state tracking becomes complex

### Procedural
Organized procedures and functions that operate on data. Best for utilities and helpers.

**Characteristics:** Functions as primary organization unit, data passed between functions
**Good for:** Utility libraries, data transformations, validation functions
**Watch out for:** Lacks encapsulation, data and behavior are separated

### Object-Oriented
Classes, inheritance, and encapsulation. Best for complex domain models with behavior.

**Characteristics:** Objects with state and methods, inheritance hierarchies, polymorphism
**Good for:** Complex domain models (e-commerce orders, game entities), plugin systems, frameworks
**Watch out for:** Over-engineering with deep hierarchies, God objects, tight coupling

### Functional
Pure functions, immutability, and composition. Best for data transformations and predictable logic.

**Characteristics:** Pure functions (no side effects), immutable data, function composition, higher-order functions
**Good for:** Data pipelines, reducers, middleware chains, validation, testing
**Watch out for:** Performance with deep copies, steeper learning curve, awkward for stateful I/O

### Declarative
Describe WHAT not HOW. Best for UI, queries, and configuration.

**Characteristics:** Describe desired outcome, runtime figures out how to achieve it
**Good for:** React JSX, SQL queries, CSS, infrastructure-as-code (Terraform), GraphQL schemas
**Watch out for:** Less control over execution, debugging can be opaque

### Event-Driven
Event emitters, listeners, pub/sub. Best for real-time features and loose coupling.

**Characteristics:** Publishers emit events, subscribers react independently, loose coupling
**Good for:** Real-time features, webhooks, user interaction handling, microservice communication
**Watch out for:** Hard to trace execution flow, event ordering issues, memory leaks from unsubscribed listeners

### Reactive
Observable streams and automatic propagation. Best for live data and UI state.

**Characteristics:** Data streams, automatic updates when sources change, backpressure handling
**Good for:** Live dashboards, search-as-you-type, collaborative editing, complex UI state
**Watch out for:** Steep learning curve (RxJS), hard to debug stream compositions, memory management

### Concurrent
Parallel execution, async/await, workers. Best for background processing.

**Characteristics:** Multiple execution contexts, message passing, shared-nothing architecture
**Good for:** Background processing, CPU-intensive tasks (image processing), parallel API calls
**Watch out for:** Race conditions, deadlocks, debugging difficulty, overhead for simple tasks

## Process

1. Name the paradigm
2. State the problem it addresses in THIS project
3. Describe HOW the paradigm approaches the problem (3-5 steps)
4. List benefits for this specific use case
5. List limitations and when it breaks down

## Application Format

```
### Paradigm: [Name]
**Problem:** [What part of our project this addresses]
**Approach:**
1. [How this paradigm tackles it]
2. [How this paradigm tackles it]
3. [How this paradigm tackles it]
**Benefits:** [Specific advantages here]
**Limitations:** [When this doesn't work well]
**Languages/Tools:** [Best supported by]
```

## Example: Functional for Recipe Data Transformations

**Problem:** Recipe app needs to convert between units (metric/imperial), scale ingredient quantities, calculate nutrition totals, and format for display.

**Approach:**
1. Define pure functions: `scaleIngredient(ingredient, factor) => newIngredient`
2. Compose transformations: `pipe(scaleAll(2), convertToMetric, calculateNutrition)`
3. Keep original data immutable; each function returns new data
4. Use map/filter/reduce on ingredient arrays instead of loops

**Benefits:**
- Each transformation is independently testable (pure function = deterministic output)
- Composable: chain transformations in any order
- No mutation means no bugs from shared state between recipe views

**Limitations:**
- Creating new objects for every transformation uses more memory (negligible for recipe data)
- Developers unfamiliar with functional patterns may find `pipe()` and `compose()` confusing

**Languages/Tools:** TypeScript with fp-ts, Ramda, or native Array methods

## Paradigm Selection Guide

| Part of System | Recommended Paradigm | Reason |
|---------------|---------------------|--------|
| UI Components | Declarative (React/JSX) | Describe what to render |
| Data transformations | Functional | Testable, composable |
| API routes/handlers | Procedural | Clear request/response flow |
| Complex domain logic | OOP or Functional | Encapsulation or composition |
| Real-time features | Event-driven + Reactive | Loose coupling, streams |
| Background jobs | Concurrent + Imperative | Parallel execution, clear steps |
| Database queries | Declarative (SQL/ORM) | Describe what data you want |
| Build/deploy scripts | Imperative | Step-by-step process |

## Mixing Paradigms

Most real projects use multiple paradigms. The key is choosing the right paradigm for each layer:

```
UI Layer:          Declarative (JSX) + Reactive (state management)
Business Logic:    Functional (pure transforms) + OOP (domain models)
API Layer:         Procedural (request handlers) + Event-driven (webhooks)
Infrastructure:    Imperative (scripts) + Declarative (config files)
```

Do not force a single paradigm across the entire codebase. Let the problem guide the paradigm choice.
