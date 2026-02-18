# Visual Reasoning Framework

Diagrammatic representation and spatial reasoning for system design.

## When to Use

- **Phase 3 (PLAN)**: Architecture diagrams, data flow visualization, component relationship maps
- **Phase 6 (OUTPUT)**: Summary diagrams in the final deliverables
- When communicating system structure visually is clearer than prose
- When you need to identify bottlenecks, cycles, or missing connections

## Core Concept

Visual reasoning uses diagrams to reveal properties of a system that are hard to see in text: bottlenecks, circular dependencies, isolated components, missing connections, and single points of failure. Drawing a system forces precision about what connects to what.

## Diagram Types

### Graph
Nodes and edges showing relationships. General-purpose diagram for any system of connected entities.

**Best for:** Service dependencies, database relationships, module coupling analysis

### Flowchart
Process flow with decision points. Shows how execution moves through a system.

**Best for:** User flows, API request lifecycle, CI/CD pipelines, business logic

### State Diagram
States and transitions. Shows all possible states of an entity and what triggers transitions.

**Best for:** Order status, user session lifecycle, feature flags, form wizard steps

### Concept Map
Concepts and their labeled relationships. Shows how ideas relate to each other.

**Best for:** Domain modeling, requirement mapping, feature relationship analysis

### Tree Diagram
Hierarchical structure with parent-child relationships.

**Best for:** File/folder structure, component hierarchy, organizational charts, navigation menus

### Data Flow
How data moves through the system, including transformations at each step.

**Best for:** Request/response cycles, ETL pipelines, event propagation, cache strategies

## Process

1. Choose the right diagram type for what you are communicating
2. Identify elements: nodes, edges, containers, annotations
3. Define relationships and directions (arrows)
4. Draw the diagram using ASCII art
5. Look for patterns: clusters, bottlenecks, isolated nodes, cycles
6. Derive insights from the visual structure
7. Document observations and any hypotheses they suggest

## Application Format

```
### Visual Analysis: [What we're diagramming]
**Diagram Type:** [Type]

**Diagram:**
[ASCII diagram here]

**Elements:**
| Element | Type | Properties |
|---------|------|------------|
| [name] | node | [key properties] |
| [name] | edge | [direction, label] |

**Observations:**
- [What the diagram reveals]
- [Patterns noticed]
- [Bottlenecks or concerns]

**Insight:** [What we learn from the visual representation]
```

## ASCII Diagram Techniques

### Boxes and Arrows
```
+----------+     +----------+     +----------+
|  Client  | --> |   API    | --> | Database |
+----------+     +----------+     +----------+
```

### Flow with Decision Points
```
[Start] --> [Validate Input]
                |
          +-----+-----+
          |           |
        [Valid]    [Invalid]
          |           |
     [Process]   [Return Error]
          |
       [Return OK]
```

### Layered Architecture
```
+--------------------------------------------------+
|                  Client (Browser)                 |
+--------------------------------------------------+
          |                         ^
          v                         |
+--------------------------------------------------+
|              Next.js (SSR + API)                  |
+--------------------------------------------------+
     |              |              |
     v              v              v
+---------+   +-----------+   +----------+
| Supabase|   | Supabase  |   | Supabase |
|   DB    |   |  Storage  |   |   Auth   |
+---------+   +-----------+   +----------+
```

### Data Flow with Labels
```
User Input                      Display
    |                              ^
    v                              |
[Form Validation] --valid--> [API Handler] --success--> [Cache Update]
         |                       |                          |
       invalid                 error                     invalidate
         |                       |                          |
         v                       v                          v
    [Show Errors]          [Error Handler]           [Refetch Query]
```

### Sequence (Time Flows Down)
```
Client          API           Database        Cache
  |               |               |              |
  |--POST /api--->|               |              |
  |               |--INSERT------>|              |
  |               |<--row---------|              |
  |               |--invalidate------------------>|
  |<--201---------|               |              |
  |               |               |              |
```

## Example: Recipe App Data Flow

### Visual Analysis: Recipe Creation Data Flow

**Diagram Type:** Data Flow

**Diagram:**
```
User (Browser)
    |
    | [1] Submit recipe form (title, ingredients[], steps[], photo)
    v
+------------------+
| Next.js API      |
| /api/recipes     |
+------------------+
    |          |
    |          | [2] Upload photo
    |          v
    |    +---------------+
    |    | Supabase      |
    |    | Storage       |---> [CDN] ---> Browser Cache
    |    +---------------+
    |          |
    |          | [3] Return photo URL
    |          v
    | [4] INSERT recipe with photo_url
    v
+------------------+
| Supabase DB      |
| recipes table    |
| ingredients tbl  |
+------------------+
    |
    | [5] Return created recipe
    v
+------------------+
| Next.js API      |---> [6] Invalidate React Query cache
+------------------+          for ['recipes'] key
    |
    | [7] Return 201 + recipe data
    v
User (Browser)
    |
    | [8] Redirect to /recipes/[id]
    v
Recipe Detail Page (SSR)
```

**Elements:**
| Element | Type | Properties |
|---------|------|------------|
| User Browser | node | Entry and exit point |
| Next.js API | node | Orchestrates the flow |
| Supabase Storage | node | Handles binary file uploads |
| CDN | node | Caches and serves images |
| Supabase DB | node | Stores structured recipe data |
| React Query Cache | node | Client-side data cache |

**Observations:**
- All requests funnel through the Next.js API layer -- single orchestration point
- Photo upload (step 2) and database insert (step 4) are sequential, not parallel. The photo URL is needed for the recipe record.
- Cache invalidation (step 6) happens server-side after the DB write. If it fails, the user will see stale data until the cache expires.
- There is no error handling shown for photo upload failure. If step 2 fails, step 4 should not proceed.

**Insight:** The flow has a potential optimization: parallelize photo upload and recipe metadata validation (validate the rest of the form while the photo uploads). Also, add rollback logic: if DB insert fails after photo upload, the orphaned photo should be cleaned up.

## Example: State Diagram for Recipe Publishing

### Visual Analysis: Recipe Publication States

**Diagram Type:** State Diagram

**Diagram:**
```
                    +----------+
     create ------->|  Draft   |
                    +----------+
                      |      ^
              publish |      | unpublish
                      v      |
                    +----------+
                    | Published |
                    +----------+
                      |      |
              archive |      | feature
                      v      |
                    +----------+
                    | Archived |
                    +----------+
                      |
              delete  |
                      v
                    +----------+
                    | Deleted  | (soft delete, 30-day retention)
                    +----------+
```

**Observations:**
- Published recipes can be featured (highlighted on homepage) or archived
- Archived recipes can be deleted but not directly published (must go through Draft first?)
- Missing transition: Can an archived recipe be restored to Draft? If not, archiving is semi-permanent.
- The "featured" transition stays in Published state (it is a flag, not a separate state)

**Insight:** Add a "restore" transition from Archived to Draft. Also, consider whether Featured should be a separate state (with its own transitions) or just a boolean flag on Published recipes.

## Tips

1. **Start simple**: Begin with the major nodes and primary edges. Add detail in subsequent iterations.
2. **Label everything**: Unnamed arrows are ambiguous. Label with the action, data, or event.
3. **Number sequences**: When order matters, number the steps.
4. **Show failure paths**: The happy path is easy to diagram. Show what happens when things fail.
5. **Keep it readable**: If the ASCII diagram is wider than 80 characters or taller than 30 lines, split it into multiple diagrams.
