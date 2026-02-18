# XML Task Format Reference

> Defines the task format used in section files.
> Tasks are the atomic units of work in an UltraPlan.

---

## Task Schema

Each task is an XML block within a section file:

```xml
<task id="{SECTION_NN}.{TASK_M}" type="{auto|checkpoint}" title="{TASK_TITLE}" status="pending">
**Description:** {DETAILED_DESCRIPTION}

**Files:**
- `{FILE_PATH}` ({CREATE/MODIFY})
- `{FILE_PATH}` ({CREATE/MODIFY})

**Steps:**
1. {STEP_1}
2. {STEP_2}
3. {STEP_3}

**Acceptance criteria:**
- {CRITERION_1}
- {CRITERION_2}

**Test:** {RELATED_TDD_STUB}
</task>
```

---

## Task Types

### Type: auto

Tasks that can be executed without user input. The implementer can complete these independently by following the steps and acceptance criteria.

**When to use:**
- Standard code implementation
- Configuration changes
- File creation with clear specifications
- Database migrations with defined schema
- Test writing with clear assertions

**Example:**
```xml
<task id="01.2" type="auto" title="Create recipe database table" status="pending">
**Description:** Create the Prisma schema for the recipes table with all required fields from the PRD.

**Files:**
- `prisma/schema.prisma` (MODIFY)

**Steps:**
1. Add Recipe model to schema.prisma
2. Define fields: id (uuid), title (string), description (text), ingredients (json), steps (json), servings (int), cookTime (int), createdAt, updatedAt
3. Add index on title for search
4. Add foreign key to User model

**Acceptance criteria:**
- Recipe model exists in schema with all specified fields
- Types match the expected data types
- Index exists on title field
- Foreign key relationship to User is defined

**Test:** `Recipe model should have all required fields with correct types`
</task>
```

### Type: checkpoint

Tasks that require user verification, decision, or testing before continuing. The plan pauses at checkpoints for review.

**When to use:**
- Integration testing with external services (verify Stripe webhooks work)
- UI review (verify the layout matches expectations)
- Performance verification (verify page load meets target)
- Security review (verify auth flow is correct)
- Any task where "it works" requires human judgment

**Example:**
```xml
<task id="06.4" type="checkpoint" title="Verify Stripe checkout flow end-to-end" status="pending">
**Description:** Test the complete payment flow from product selection through Stripe checkout to confirmation page. Requires Stripe test mode credentials.

**Files:**
- No file changes (verification task)

**Steps:**
1. Start the development server
2. Navigate to a premium recipe
3. Click "Subscribe" to trigger Stripe checkout
4. Complete checkout with Stripe test card (4242 4242 4242 4242)
5. Verify redirect to success page
6. Verify webhook received and subscription recorded in database
7. Verify user now has premium access

**Acceptance criteria:**
- Checkout flow completes without errors
- Webhook fires and processes correctly
- Database records the subscription
- User can access premium content after subscribing
- Failed payment shows appropriate error message

**Test:** `Complete Stripe checkout flow should grant premium access`
</task>
```

---

## Required Fields

Every task must include these 5 fields:

| Field | Required | Rules |
|-------|----------|-------|
| `name` (title attribute) | YES | Short, action-oriented. Starts with a verb. 5-10 words. |
| `files` | YES | List of files this task creates or modifies. 1-3 files per task. Use "No file changes" for verification-only tasks. |
| `action` (steps) | YES | Numbered steps to complete the task. 2-6 steps. Each step is a single action. |
| `verify` (acceptance criteria) | YES | How to know this task is done. Testable statements. At least 2 criteria. |
| `done` (test) | YES | The TDD test stub this task relates to. Must reference a specific test from the section's TDD stubs. |

### Field Rules

**name (title):**
- Good: "Create recipe API route for CRUD operations"
- Bad: "Recipes" (too vague)
- Bad: "Create the main recipe API route handler that accepts POST requests with JSON body containing title, description, ingredients array, and steps array, validates the input using Zod schema, inserts into database using Prisma, and returns the created recipe with a 201 status code" (too long)

**files:**
- Good: `src/app/api/recipes/route.ts` (CREATE)
- Bad: `src/` (too broad)
- Bad: No file listed (missing)
- Rule: Maximum 3 files per task. If more are needed, split the task.

**action (steps):**
- Good: "1. Create route handler file. 2. Add POST handler with Zod validation. 3. Add Prisma insert call."
- Bad: "1. Implement the recipe API" (too vague, single step)
- Bad: Steps that include implementation details that belong in code (actual code in the steps)
- Rule: Steps describe WHAT to do, not the exact code to write.

**verify (acceptance criteria):**
- Good: "POST /api/recipes with valid body returns 201 and the created recipe"
- Bad: "It works" (not testable)
- Bad: "The code is clean" (subjective)
- Rule: Each criterion should be verifiable with a test or manual check.

**done (test):**
- Good: `createRecipe() should return 201 with the created recipe for valid input`
- Bad: "Tests pass" (not specific)
- Rule: Must reference a specific TDD stub from the section header. The done field should NOT contain implementation instructions.

---

## Granularity Rules

### File Count

- **1 file**: Ideal for focused tasks (create one component, modify one route)
- **2 files**: Acceptable for related pairs (component + test, route + middleware)
- **3 files**: Maximum. Only when files are tightly coupled (schema + migration + seed)
- **4+ files**: SPLIT THE TASK. This task is too large.

### Splitting Strategies

When a task touches too many files, split by:

1. **By layer**: Separate API route creation from UI component creation
2. **By operation**: Separate create from read from update from delete
3. **By concern**: Separate data fetching from data display from data validation
4. **By file type**: Separate configuration from implementation from tests

### Examples of Good Splitting

**Before (too broad):**
```
Task: Implement recipe CRUD
Files: route.ts, RecipeForm.tsx, RecipeList.tsx, RecipeCard.tsx, recipe.test.ts
```

**After (well split):**
```
Task 03.1: Create recipe API routes
Files: route.ts

Task 03.2: Build recipe creation form
Files: RecipeForm.tsx

Task 03.3: Build recipe list with cards
Files: RecipeList.tsx, RecipeCard.tsx

Task 03.4: Write recipe CRUD tests
Files: recipe.test.ts
```

---

## Task ID Format

Task IDs follow the pattern: `{NN}-{MM}` or `{NN}.{MM}`

Where:
- `{NN}` is the section number (two digits, zero-padded): 01, 02, 03, ...
- `{MM}` is the task number within that section (sequential): 1, 2, 3, ...

### ID Rules

- Task numbers are sequential within a section (no gaps)
- Task numbers start at 1 for each section
- When tasks are added during review, append to the end (don't renumber)
- Task IDs are globally unique across the entire plan

### Examples

```
01.1  - Section 01, Task 1
01.2  - Section 01, Task 2
02.1  - Section 02, Task 1
03.1  - Section 03, Task 1
03.2  - Section 03, Task 2
03.3  - Section 03, Task 3
```

---

## Examples of Well-Written Tasks

### Example 1: Database Task

```xml
<task id="01.1" type="auto" title="Create database schema with Prisma" status="pending">
**Description:** Define the complete database schema for the recipe application using Prisma ORM. Includes User, Recipe, Tag, and Collection models with all relationships.

**Files:**
- `prisma/schema.prisma` (CREATE)

**Steps:**
1. Create prisma/schema.prisma with PostgreSQL datasource pointing to DATABASE_URL env var
2. Define User model (id, email, name, avatarUrl, createdAt, updatedAt)
3. Define Recipe model (id, title, description, ingredients as Json, steps as Json, servings, cookTimeMinutes, imageUrl, isPublic, userId FK, createdAt, updatedAt)
4. Define Tag model (id, name unique) with many-to-many relation to Recipe
5. Define Collection model (id, name, description, userId FK) with many-to-many relation to Recipe
6. Add indexes on Recipe.title, Recipe.userId, Tag.name

**Acceptance criteria:**
- Schema file parses without errors (`npx prisma validate`)
- All 4 models are defined with correct field types
- Foreign key relationships are correct (Recipe -> User, Collection -> User)
- Many-to-many relationships use explicit join tables
- Indexes exist on frequently queried fields

**Test:** `Prisma schema should validate and generate client without errors`
</task>
```

### Example 2: API Task

```xml
<task id="03.1" type="auto" title="Create recipe CRUD API routes" status="pending">
**Description:** Implement REST API routes for recipe create, read, update, and delete operations with input validation and auth middleware.

**Files:**
- `src/app/api/recipes/route.ts` (CREATE)
- `src/app/api/recipes/[id]/route.ts` (CREATE)

**Steps:**
1. Create route.ts with GET (list with pagination) and POST (create) handlers
2. Create [id]/route.ts with GET (single), PUT (update), and DELETE handlers
3. Add Zod validation schemas for create and update request bodies
4. Add auth middleware check (require authenticated user)
5. Add error handling: 400 for validation, 401 for unauth, 404 for not found, 500 for server error

**Acceptance criteria:**
- GET /api/recipes returns paginated list with total count
- POST /api/recipes creates recipe and returns 201
- GET /api/recipes/[id] returns single recipe or 404
- PUT /api/recipes/[id] updates recipe and returns 200
- DELETE /api/recipes/[id] deletes recipe and returns 204
- All mutation routes require authentication
- Invalid input returns 400 with Zod error details

**Test:** `Recipe API should handle all CRUD operations with proper status codes and validation`
</task>
```

### Example 3: UI Task

```xml
<task id="03.3" type="auto" title="Build recipe creation form with validation" status="pending">
**Description:** Create a multi-step recipe form using React Hook Form with Zod validation. Includes fields for title, description, ingredients (dynamic list), steps (dynamic list), servings, cook time, and image upload.

**Files:**
- `src/features/recipes/components/RecipeForm.tsx` (CREATE)

**Steps:**
1. Create RecipeForm component with React Hook Form + Zod resolver
2. Build Step 1: Basic info (title, description, servings, cook time)
3. Build Step 2: Ingredients (dynamic array with add/remove)
4. Build Step 3: Steps (dynamic array with reorder)
5. Build Step 4: Review and submit
6. Add client-side validation matching API schema
7. Connect form submission to recipe create API

**Acceptance criteria:**
- Form renders with all 4 steps and navigation between them
- Validation errors display inline under each field
- Dynamic ingredient list supports add, remove, and reorder
- Dynamic steps list supports add, remove, and reorder
- Submitting valid form calls API and redirects to recipe page
- Submitting invalid form shows errors without calling API

**Test:** `RecipeForm should validate all fields and submit valid recipes to the API`
</task>
```

### Example 4: Configuration Task

```xml
<task id="09.1" type="auto" title="Configure CI/CD pipeline with GitHub Actions" status="pending">
**Description:** Set up GitHub Actions workflow for automated testing, linting, and deployment on push to main branch.

**Files:**
- `.github/workflows/ci.yml` (CREATE)

**Steps:**
1. Create workflow file triggered on push to main and pull requests
2. Add job: install dependencies (pnpm install --frozen-lockfile)
3. Add job: lint (pnpm lint)
4. Add job: type check (pnpm tsc --noEmit)
5. Add job: test (pnpm test -- --coverage)
6. Add job: build (pnpm build)
7. Add deployment step (Vercel CLI) triggered only on main branch pushes

**Acceptance criteria:**
- Workflow runs on every push to main and every PR
- Failed lint/type/test blocks deployment
- Successful main branch push triggers deployment
- Test coverage report is uploaded as artifact
- Workflow completes in under 5 minutes

**Test:** `CI pipeline should run all checks and deploy on successful main branch push`
</task>
```

---

## Examples of Poorly-Written Tasks (and fixes)

### Bad Example 1: Too Vague

```xml
<!-- BAD -->
<task id="03.1" type="auto" title="Add recipe features" status="pending">
**Description:** Implement the recipe features.

**Files:**
- `src/` (MODIFY)

**Steps:**
1. Build the recipe feature

**Acceptance criteria:**
- Recipes work

**Test:** Tests pass
</task>
```

**Problems:** Vague title, no specific files, one-step instruction, untestable criteria, no specific test.

**Fix:** Split into 3-4 specific tasks (API routes, form, list display, tests).

### Bad Example 2: Too Many Files

```xml
<!-- BAD -->
<task id="03.1" type="auto" title="Create recipe system" status="pending">
**Description:** Build the complete recipe system including API, database queries, form, list, card, detail view, and search.

**Files:**
- `src/app/api/recipes/route.ts` (CREATE)
- `src/app/api/recipes/[id]/route.ts` (CREATE)
- `src/features/recipes/components/RecipeForm.tsx` (CREATE)
- `src/features/recipes/components/RecipeList.tsx` (CREATE)
- `src/features/recipes/components/RecipeCard.tsx` (CREATE)
- `src/features/recipes/components/RecipeDetail.tsx` (CREATE)
- `src/features/recipes/hooks/useRecipes.ts` (CREATE)

**Steps:**
1. Create all API routes
2. Create all components
3. Create hooks

**Acceptance criteria:**
- All recipe features work

**Test:** Recipe feature tests pass
</task>
```

**Problems:** 7 files (max is 3), steps are too broad, criteria are untestable.

**Fix:** Split by concern - API task (2 files), Form task (1 file), List task (2 files), Hooks task (1 file), Detail task (1 file).

### Bad Example 3: Missing Verification

```xml
<!-- BAD -->
<task id="02.1" type="auto" title="Set up Clerk authentication" status="pending">
**Description:** Install and configure Clerk for authentication.

**Files:**
- `src/middleware.ts` (CREATE)
- `.env.local` (MODIFY)

**Steps:**
1. Install @clerk/nextjs
2. Add CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to .env.local
3. Create middleware.ts with Clerk auth middleware
4. Wrap app in ClerkProvider

**Acceptance criteria:**
- Clerk is installed

**Test:** Auth works
</task>
```

**Problems:** Only one acceptance criterion, and it's trivially true. Test is vague.

**Fix:** Add specific criteria - "Unauthenticated request to /api/recipes returns 401", "Login page renders at /sign-in", "ClerkProvider wraps the root layout", "Middleware protects /api/* routes".

### Bad Example 4: Implementation in Done

```xml
<!-- BAD -->
<task id="01.1" type="auto" title="Create database schema" status="pending">
**Description:** Create the Prisma schema.

**Files:**
- `prisma/schema.prisma` (CREATE)

**Steps:**
1. Create the schema file
2. Add models

**Acceptance criteria:**
- Schema exists

**Test:** After creating the schema, run `npx prisma generate` and then `npx prisma db push` to apply the schema to the database, then verify by running `npx prisma studio` to open the database GUI and check that all tables exist.
</task>
```

**Problems:** The "Test" field contains implementation instructions, not a test description. Steps are too vague.

**Fix:** Test should be `Schema validates and Prisma client generates without errors`. Move the prisma commands into the Steps field.

---

## Section-Level Task Ordering

Within a section, tasks should follow this general order:

### Standard Ordering

1. **Schema / Types**: Define data structures first
2. **Database**: Create tables, migrations, seed data
3. **Backend**: API routes, server functions, middleware
4. **Frontend**: Components, pages, hooks
5. **Integration**: Connect frontend to backend
6. **Testing**: Write and run tests (if not TDD within each task)

### Cross-Section Ordering

Sections in the plan follow this general order:

```
Database / Schema (Section 01-02)
  ↓
Backend / API (Section 03-05)
  ↓
Frontend / UI (Section 06-08)
  ↓
Integration / Wiring (Section 09-10)
  ↓
Testing / Deployment (Section 11-12)
```

This is a guideline. Specific projects may vary based on dependencies.

---

## Checkpoint Placement Guidelines

Place checkpoint tasks at these points:

### Mandatory Checkpoints

1. **After database setup**: Verify schema and migrations work
2. **After auth setup**: Verify login/logout/signup flow
3. **After core feature**: Verify the main feature works end-to-end
4. **After payment integration**: Verify payment flow works with test credentials
5. **Before deployment**: Verify all tests pass and build succeeds

### Optional Checkpoints

1. After each batch completion (verify batch integrity)
2. After complex UI components (verify visual correctness)
3. After performance-critical sections (verify load times)
4. After security-sensitive sections (verify access controls)

### Checkpoint Frequency

- Minimum: 1 checkpoint per batch
- Maximum: 1 checkpoint per 3 tasks
- Too few checkpoints = problems discovered late
- Too many checkpoints = slow progress, decision fatigue

### Checkpoint Tasks Are Not Implementation

Checkpoint tasks verify, they don't build:
- No file changes (or minimal test files)
- Steps are "verify X", "test Y", "confirm Z"
- Acceptance criteria are pass/fail observations
- These tasks pause progress for human review
