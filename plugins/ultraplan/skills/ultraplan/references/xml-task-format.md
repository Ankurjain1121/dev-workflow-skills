# XML Task Format Reference

This document defines the schema for XML tasks used inside UltraPlan section files. Every task in every section MUST follow this format exactly.

---

## Task Schema

```xml
<task type="[auto|checkpoint]" id="[section-task]">
  <name>[Short descriptive name, 3-8 words]</name>
  <files>[Comma-separated list of files to create or modify]</files>
  <action>
    [Detailed implementation instructions. 2-6 sentences.
    Specify exactly what to create, modify, or configure.
    Include specific function names, component names, or patterns when known.]
  </action>
  <verify>[How to verify this task is done. 1-2 sentences.
    Specific observable outcome, not vague "it works".]</verify>
  <done>[One sentence: what is true when this task is complete.
    Written in past tense as a statement of fact.]</done>
</task>
```

---

## Task Types

### `type="auto"`
- Default task type for most tasks
- Intended to be executed by an AI coding agent without human intervention
- The AI reads the `<action>` block and implements it
- After implementation, the AI checks the `<verify>` block to confirm success

### `type="checkpoint"`
- Used when human review or decision is needed before proceeding
- The AI should STOP and present the current state to the user
- Typically used for: UI design approval, architecture decision confirmation, security review, deployment

**When to use checkpoint:**
- After building a key UI screen (show it to the user)
- After setting up authentication (verify it works with the user)
- Before deploying to production
- When a task requires an API key or credentials the user must provide
- At the end of a section to confirm everything works together

**Example checkpoint task:**
```xml
<task type="checkpoint" id="02-06">
  <name>Verify authentication flow</name>
  <files>none</files>
  <action>
    Run the application and walk through the complete authentication flow:
    1. Sign up with a new email and password
    2. Verify email confirmation works
    3. Log out and log back in
    4. Test "forgot password" flow
    Present the results to the user for confirmation.
  </action>
  <verify>User confirms all authentication flows work correctly.</verify>
  <done>Authentication flow verified and approved by user.</done>
</task>
```

---

## Required Fields

Every task MUST have all 5 fields. No field may be empty or omitted.

| Field | Purpose | Rules |
|-------|---------|-------|
| `name` | Human-readable task label | 3-8 words. Starts with a verb. Describes WHAT, not HOW. |
| `files` | Files to create or modify | Comma-separated paths relative to project root. Max 3 files. Use `none` for checkpoint tasks that don't touch code. |
| `action` | Implementation instructions | 2-6 sentences. Specific and actionable. Include names of functions, components, tables, endpoints. |
| `verify` | How to check completion | 1-2 sentences. Observable outcome. Can be a command to run, a behavior to observe, or a test to pass. |
| `done` | Completion statement | 1 sentence in past tense. A factual statement of what exists now. |

---

## Granularity Rules

**The golden rule: 1-3 files per task.** A task that touches more than 3 files is too big. Split it.

**How to decide task size:**
- Each task should represent ONE logical change
- A task should be completable in 5-15 minutes of AI execution
- A task should result in ONE meaningful git commit
- If you can describe what the task does in one sentence, it's the right size
- If you need a paragraph to describe it, split it

**Splitting strategies:**
1. **By file type:** Separate database changes from API changes from UI changes
2. **By operation:** Separate "create" from "connect" from "style"
3. **By layer:** Separate backend from frontend
4. **By feature slice:** Separate the basic version from validations from edge cases

---

## Task ID Format

Format: `NN-MM` where:
- `NN` = section number (zero-padded, matches section file)
- `MM` = task number within section (zero-padded, sequential starting at 01)

Examples: `01-01`, `01-02`, `03-05`, `12-03`

Tasks within a section are assumed to be SEQUENTIAL unless explicitly noted otherwise. Task 01-02 depends on 01-01, and 01-03 depends on 01-02.

---

## Examples of Well-Written Tasks

### Example 1: Database schema task
```xml
<task type="auto" id="01-01">
  <name>Create user database table</name>
  <files>src/db/schema.ts, src/db/migrations/001-users.sql</files>
  <action>
    Create a users table with columns: id (UUID, primary key), email (text, unique, case-insensitive),
    password_hash (text, not null), display_name (text), avatar_url (text, nullable),
    created_at (timestamp, default now), updated_at (timestamp, default now).
    Add a unique index on lower(email). Create the corresponding migration file.
  </action>
  <verify>Run the migration. Query the database to confirm the users table exists with all columns and the unique index.</verify>
  <done>Users table created with all required columns, constraints, and migration file.</done>
</task>
```

### Example 2: API endpoint task
```xml
<task type="auto" id="03-02">
  <name>Build recipe creation endpoint</name>
  <files>src/api/recipes/create.ts, src/lib/validation/recipe.ts</files>
  <action>
    Create POST /api/recipes endpoint that accepts: title (required, max 200 chars),
    description (optional, max 2000 chars), ingredients (required, array of strings),
    instructions (required, array of strings), prep_time_minutes (optional, integer),
    cook_time_minutes (optional, integer). Validate all inputs. Associate recipe with
    the authenticated user. Return the created recipe with its ID.
  </action>
  <verify>POST /api/recipes with valid data returns 201 with recipe object. Invalid data returns 400 with specific error messages.</verify>
  <done>Recipe creation endpoint working with full input validation and user association.</done>
</task>
```

### Example 3: UI component task
```xml
<task type="auto" id="03-04">
  <name>Build recipe creation form</name>
  <files>src/components/recipes/recipe-form.tsx, src/hooks/use-recipe-form.ts</files>
  <action>
    Create a recipe creation form with fields matching the API: title, description,
    ingredients (dynamic add/remove list), instructions (dynamic ordered list),
    prep time, cook time. Use the existing form patterns from the project.
    Add client-side validation matching the API validation rules.
    On submit, call POST /api/recipes and redirect to the new recipe page on success.
    Show inline error messages on validation failure.
  </action>
  <verify>Fill out the form with valid data and submit. Recipe is created and user is redirected. Submit with missing title and verify error appears.</verify>
  <done>Recipe creation form built with all fields, client-side validation, API integration, and error handling.</done>
</task>
```

### Example 4: Configuration task
```xml
<task type="auto" id="01-03">
  <name>Configure environment variables</name>
  <files>.env.example, src/lib/env.ts</files>
  <action>
    Create .env.example with all required environment variables: DATABASE_URL,
    AUTH_SECRET, STORAGE_BUCKET, PUBLIC_URL. Create src/lib/env.ts that reads
    and validates all environment variables at startup, throwing a clear error
    message if any required variable is missing.
  </action>
  <verify>Start the app without .env file. Verify it throws a clear error listing missing variables. Add .env with all values. Verify app starts successfully.</verify>
  <done>Environment variable configuration with validation and example file created.</done>
</task>
```

---

## Examples of POORLY Written Tasks (Never Do This)

### Bad: Too vague
```xml
<task type="auto" id="01-01">
  <name>Set up the project</name>
  <files>various</files>
  <action>Set up the project with all necessary configuration.</action>
  <verify>Project works.</verify>
  <done>Project is set up.</done>
</task>
```
**Why it's bad:** "various" files, no specific instructions, "project works" is not verifiable. An AI agent would not know what to do.

### Bad: Too many files
```xml
<task type="auto" id="03-01">
  <name>Build complete recipe feature</name>
  <files>src/db/schema.ts, src/api/recipes/create.ts, src/api/recipes/read.ts, src/api/recipes/update.ts, src/api/recipes/delete.ts, src/components/recipe-form.tsx, src/components/recipe-list.tsx, src/components/recipe-detail.tsx</files>
  <action>Build the entire recipe CRUD system with database, API, and UI.</action>
  <verify>All recipe operations work.</verify>
  <done>Recipe system complete.</done>
</task>
```
**Why it's bad:** 8 files in one task. Should be 4-5 separate tasks. Action is one sentence for a massive amount of work.

### Bad: Missing verification detail
```xml
<task type="auto" id="02-03">
  <name>Add password hashing</name>
  <files>src/lib/password.ts</files>
  <action>Add bcrypt password hashing.</action>
  <verify>It works.</verify>
  <done>Done.</done>
</task>
```
**Why it's bad:** Action too brief (what function signatures? what rounds?). Verify says nothing useful. Done says nothing.

### Bad: Implementation in done field
```xml
<task type="auto" id="04-02">
  <name>Upload image to S3</name>
  <files>src/lib/storage.ts</files>
  <action>Create upload function.</action>
  <verify>Upload a test image.</verify>
  <done>Use aws-sdk v3, create PutObjectCommand, set ContentType, return the URL from the bucket.</done>
</task>
```
**Why it's bad:** The `done` field contains implementation details that belong in `action`. Done should state a completed fact, not instructions.

---

## Section-Level Task Ordering

Within a section, tasks are ordered by dependency:
1. Database/schema tasks first
2. Backend/API tasks second
3. Frontend/UI tasks third
4. Integration/connection tasks fourth
5. Testing/verification/checkpoint tasks last

This order ensures each task can build on the previous one.

---

## Checkpoint Placement Guidelines

Place checkpoints:
- After the last task of each section (optional, recommended for yellow/red risk sections)
- After any task that changes visible UI that the user should approve
- Before any task that requires user-provided credentials or API keys
- After security-critical tasks (authentication, authorization, payment)

Do NOT place checkpoints:
- After every single task (too many interruptions)
- For simple configuration or utility code
- For internal backend tasks with no user-visible effect
