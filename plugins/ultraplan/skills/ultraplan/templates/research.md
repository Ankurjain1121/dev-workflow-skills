# UltraPlan Research: {PROJECT_NAME}

> Generated: {TIMESTAMP}
> Phase: 2/6 - RESEARCH
> Research topics extracted: {TOPIC_COUNT}
> Subagents deployed: 3 (Codebase, Web, Docs)

---

## Research Topics

<!-- Auto-extracted from DISCOVERY.md. These are the topics that need investigation. -->

| # | Topic | Source Category | Priority |
|---|-------|-----------------|----------|
{TOPIC_TABLE_ROWS}

---

## Codebase Analysis

<!-- Subagent: Codebase Researcher -->
<!-- If greenfield: this section contains tech stack comparison + competitor analysis instead -->

**Type:** {CODEBASE_TYPE}

<!-- Use the appropriate sub-section based on codebase type -->

### Existing Codebase Findings

<!-- Only populated if codebase was detected in Phase 1 -->

**Stack detected:** {EXISTING_STACK}

#### Patterns Found

<!-- Architectural patterns, component patterns, state management patterns, etc. -->

{PATTERNS_FOUND}

#### Conventions

<!-- Naming conventions, file organization, code style, testing patterns -->

{CONVENTIONS_FOUND}

#### Relevant Existing Code

<!-- Files and modules that relate to the new feature/project -->

| File/Module | Relevance | Notes |
|-------------|-----------|-------|
{RELEVANT_CODE_TABLE}

#### Reusable Components

<!-- Existing code that can be reused or extended -->

{REUSABLE_COMPONENTS}

### Tech Stack Comparison

<!-- Only populated for greenfield projects. Compare 2-3 viable options. -->

#### Option A: {STACK_OPTION_A_NAME} (Recommended)

- **What it is:** {STACK_A_DESCRIPTION}
- **Why it fits:** {STACK_A_PROS}
- **Downsides:** {STACK_A_CONS}
- **Best for:** {STACK_A_BEST_FOR}

#### Option B: {STACK_OPTION_B_NAME}

- **What it is:** {STACK_B_DESCRIPTION}
- **Why it fits:** {STACK_B_PROS}
- **Downsides:** {STACK_B_CONS}
- **Best for:** {STACK_B_BEST_FOR}

#### Option C: {STACK_OPTION_C_NAME}

- **What it is:** {STACK_C_DESCRIPTION}
- **Why it fits:** {STACK_C_PROS}
- **Downsides:** {STACK_C_CONS}
- **Best for:** {STACK_C_BEST_FOR}

**Recommendation:** {STACK_RECOMMENDATION}
**Reasoning:** {STACK_REASONING}

---

## Web Research

<!-- Subagent: Web Researcher -->
<!-- Best practices, current approaches, ecosystem state for the identified topics -->

### Best Practices Found

{BEST_PRACTICES}

### Current Approaches

<!-- How are people building similar things right now? -->

{CURRENT_APPROACHES}

### Ecosystem State

<!-- Maturity, community support, recent changes for relevant technologies -->

{ECOSYSTEM_STATE}

---

## Competitor Analysis

<!-- Only populated for greenfield projects -->

| # | Product | What It Does | Strengths | Weaknesses | What We Can Learn |
|---|---------|-------------|-----------|------------|-------------------|
{COMPETITOR_TABLE_ROWS}

### Key Differentiators for Our Project

{KEY_DIFFERENTIATORS}

---

## Library Documentation

<!-- Subagent: Docs Researcher (via Context7 MCP) -->

### Libraries Investigated

| # | Library | Version | Purpose | Context7 Source |
|---|---------|---------|---------|-----------------|
{LIBRARY_TABLE_ROWS}

### Key Findings

<!-- Important API details, configuration patterns, known gotchas from docs -->

{LIBRARY_FINDINGS}

### Integration Notes

<!-- How the recommended libraries work together, any compatibility concerns -->

{INTEGRATION_NOTES}

---

## Conflicts Found

<!-- Any contradictions between user's discovery answers and research findings -->

| # | User Said | Research Shows | Recommendation | User Decision |
|---|-----------|---------------|----------------|---------------|
{CONFLICT_TABLE_ROWS}

<!-- If no conflicts: "No conflicts detected between discovery answers and research findings." -->

---

## Summary and Recommendations

### Recommended Tech Stack

{FINAL_STACK_RECOMMENDATION}

### Key Architecture Decisions

1. {ARCHITECTURE_DECISION_1}
2. {ARCHITECTURE_DECISION_2}
3. {ARCHITECTURE_DECISION_3}

### Libraries and Tools

| Purpose | Recommended | Alternative | Why |
|---------|-------------|-------------|-----|
{TOOLS_TABLE_ROWS}

### Risks Identified in Research

1. {RESEARCH_RISK_1}
2. {RESEARCH_RISK_2}
3. {RESEARCH_RISK_3}

### Unanswered Questions

<!-- Questions that research could not fully answer, to be addressed in Phase 4 (Review) -->

1. {UNANSWERED_1}
2. {UNANSWERED_2}

---

**User Review Status:** {USER_REVIEW_STATUS}
**User Feedback:** {USER_REVIEW_FEEDBACK}
**Proceed to Planning:** {PROCEED_TO_PLANNING}
