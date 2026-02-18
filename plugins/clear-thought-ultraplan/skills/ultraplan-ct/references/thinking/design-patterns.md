# Design Patterns Framework

Select and apply proven software design patterns for architecture decisions.

## When to Use

- **Phase 3 (PLAN)**: Choose architecture patterns for the technical plan
- When designing system structure, API patterns, or component organization
- When deciding how modules communicate, how state is managed, or how data flows

## Process

1. Name the pattern being considered
2. Describe the specific context where it applies in THIS project
3. List implementation steps for applying the pattern
4. List benefits for THIS project (not generic benefits)
5. List tradeoffs and compromises
6. Optionally include a code example or applicable languages

## Available Pattern Categories

### Modular Architecture
- **Feature Modules**: Group code by feature/domain, not by type (components/, utils/, etc.)
- **Barrel Exports**: Use index.ts files to control public API of each module
- **Dependency Injection**: Pass dependencies in rather than importing them directly
- **Plugin Architecture**: Allow features to be added without modifying core code

### API Integration Patterns
- **REST with Resource Naming**: /api/recipes/:id, /api/recipes/:id/ingredients
- **GraphQL**: Single endpoint, client-driven queries (good for complex data relationships)
- **tRPC**: End-to-end type safety between client and server (TypeScript projects)
- **WebSocket**: Persistent connections for real-time features
- **API Gateway**: Single entry point that routes to multiple services

### State Management
- **Server State (React Query/SWR)**: Cache server data, handle loading/error states
- **Client State (Zustand/Jotai)**: Minimal client-only state (UI state, preferences)
- **URL State**: Use URL params for shareable/bookmarkable state (filters, pagination)
- **Form State (React Hook Form)**: Dedicated form state management with validation

### Asynchronous Processing
- **Queue-Based**: Offload slow tasks to background queues (email sending, image processing)
- **Event-Driven**: Publish events, let subscribers react independently
- **Saga/Orchestrator**: Coordinate multi-step async workflows with rollback support
- **Optimistic Updates**: Update UI immediately, reconcile with server response

### Scalability Considerations
- **Horizontal Scaling**: Stateless services behind a load balancer
- **Edge Computing**: Run logic close to users (Cloudflare Workers, Vercel Edge)
- **Caching Layers**: Browser cache, CDN, application cache, database cache
- **Database Patterns**: Read replicas, connection pooling, query optimization

### Security Best Practices
- **Auth Patterns**: JWT + refresh tokens, session-based, OAuth2 flows
- **Input Validation**: Zod schemas at API boundaries, never trust client data
- **CORS/CSP**: Whitelist origins, restrict content sources
- **Rate Limiting**: Protect endpoints from abuse (per-user, per-IP)

### Agentic Design Patterns
- **Tool Use**: Give agents access to specific tools with clear interfaces
- **Multi-Agent Coordination**: Specialized agents that collaborate on subtasks
- **Human-in-the-Loop**: Agent proposes, human approves critical actions
- **Reflection/Self-Critique**: Agent reviews its own output before finalizing

## Application Format

```
### Design Pattern: [Pattern Name]
**Context:** [Where this applies in our project]
**Implementation:**
1. [Step to apply the pattern]
2. [Step to apply the pattern]
3. [Step to apply the pattern]
**Benefits:** [Why this helps our project specifically]
**Tradeoffs:** [What we give up or accept]
**Code Example:** (optional)
```

## Example: Server State with React Query

**Context:** Recipe app needs to fetch, cache, and update recipes from Supabase. Multiple components display recipe data and need to stay in sync.

**Implementation:**
1. Install @tanstack/react-query
2. Create query hooks: useRecipe(id), useRecipes(filters), useSearchRecipes(query)
3. Create mutation hooks: useCreateRecipe(), useUpdateRecipe(), useDeleteRecipe()
4. Configure stale time (5 min for recipe lists, 10 min for individual recipes)
5. Use invalidateQueries after mutations to keep data fresh

**Benefits:**
- Automatic caching eliminates redundant fetches when navigating between pages
- Loading/error states handled consistently across all data fetching
- Optimistic updates make the UI feel instant for recipe edits

**Tradeoffs:**
- Additional dependency (~13kb gzipped)
- Learning curve for cache invalidation strategies
- Overfetching if stale times are too aggressive

## Example: Feature Module Structure

**Context:** Recipe app has recipes, users, and meal planning as distinct domains.

**Implementation:**
```
src/
  features/
    recipes/
      components/     # RecipeCard, RecipeForm, RecipeList
      hooks/          # useRecipe, useRecipes, useCreateRecipe
      api/            # recipe.api.ts (server calls)
      types/          # recipe.types.ts
      index.ts        # Public API barrel export
    users/
      ...
    meal-planning/
      ...
```

**Benefits:** Each feature is self-contained. A developer working on recipes rarely needs to touch other directories. Easy to delete or extract a feature.

**Tradeoffs:** Some shared utilities need a separate shared/ directory. Cross-feature imports require careful dependency management.

## Pattern Selection Guide

| Situation | Recommended Pattern |
|-----------|-------------------|
| Complex data relationships | GraphQL or tRPC |
| Real-time updates needed | WebSocket + event-driven |
| SEO-critical pages | SSR with caching |
| Heavy background processing | Queue-based async |
| Multi-tenant SaaS | Row-level security + feature modules |
| Rapid prototyping | tRPC + Zustand + feature modules |
