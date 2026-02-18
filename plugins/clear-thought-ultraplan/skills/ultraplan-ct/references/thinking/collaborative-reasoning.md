# Collaborative Reasoning Framework

Multi-persona problem-solving with diverse expertise and structured debate.

## When to Use

- **Phase 4 (REVIEW)**: Multi-persona review of the plan (security expert, user advocate, devil's advocate)
- When a decision benefits from multiple perspectives
- When you suspect blind spots in your analysis

## Core Concept

Simulate a panel of experts with distinct perspectives, biases, and expertise areas. Each persona contributes observations, questions, and challenges. The goal is not consensus but synthesis: integrating the strongest insights from each perspective into a better outcome.

## Process

1. Define the topic or question to analyze
2. Create 3-5 personas with distinct expertise, perspective, and known biases
3. Progress through stages: problem-definition, ideation, critique, integration, decision, reflection
4. Each persona contributes with a labeled type: observation, question, insight, concern, suggestion, challenge, synthesis
5. Track consensus points and disagreements
6. Synthesize into final recommendation

## Stages

| Stage | Purpose | What Happens |
|-------|---------|-------------|
| Problem Definition | Align on what we are solving | Each persona frames the problem from their angle |
| Ideation | Generate approaches | Each persona proposes solutions from their expertise |
| Critique | Stress-test proposals | Each persona attacks proposals from their angle |
| Integration | Combine insights | Find the solution that addresses all critiques |
| Decision | Commit to an approach | Evaluate the integrated solution |
| Reflection | Check for blind spots | Final sweep for anything missed |

## Contribution Types

- **observation**: Neutral statement of fact
- **question**: Something that needs to be answered
- **insight**: Connection or pattern noticed
- **concern**: Risk or problem identified
- **suggestion**: Proposed action or improvement
- **challenge**: Direct pushback on an assumption or decision
- **synthesis**: Integration of multiple viewpoints

## Application Format

```
### Collaborative Review: [Topic]
**Stage:** [Current stage]

**Personas:**
| Name | Expertise | Perspective | Known Bias |
|------|-----------|-------------|------------|
| [Name] | [Domain] | [Viewpoint] | [Tendency] |
| [Name] | [Domain] | [Viewpoint] | [Tendency] |
| [Name] | [Domain] | [Viewpoint] | [Tendency] |

**Contributions:**
- **[Name]** [type]: "[Contribution]"
- **[Name]** [type]: "[Contribution]"
- **[Name]** [type]: "[Contribution]"

**Consensus:** [Points all personas agree on]
**Disagreements:** [Points of contention and why]
**Recommendation:** [Synthesized decision that addresses all perspectives]
```

## Example: Reviewing a Recipe App Architecture Plan

### Collaborative Review: Recipe App Technical Architecture

**Stage:** Critique

**Personas:**
| Name | Expertise | Perspective | Known Bias |
|------|-----------|-------------|------------|
| Security Expert | AppSec, threat modeling, auth | Risk-averse, worst-case thinking | Over-secures, adds friction |
| User Advocate | UX research, accessibility, mobile | User-first, experience-driven | Under-estimates technical constraints |
| Devil's Advocate | Systems architecture, distributed systems | Contrarian, finds failure modes | Finds problems without offering solutions |
| Pragmatist | Startup engineering, shipping fast | Ship-first, iterate later | Under-invests in foundations |

**Contributions:**

- **Security Expert** [concern]: "The auth section uses JWTs but does not mention refresh token rotation. If a token is stolen, the attacker has access until expiry. We need short-lived access tokens (15 min) with rotating refresh tokens."

- **User Advocate** [insight]: "The onboarding flow has 6 steps before a user can create their first recipe. Studies show each step loses 20% of users. We need to get to value in 3 steps max -- email, password, start cooking."

- **Devil's Advocate** [challenge]: "The plan assumes Supabase will handle real-time subscriptions for recipe collaboration. What happens when Supabase has an outage? There is no degradation strategy. Users will see a broken page."

- **Pragmatist** [suggestion]: "Recipe collaboration is a Phase 2 feature. Do not over-architect real-time for Phase 1. Use simple polling for the MVP and upgrade to WebSocket later. Ship faster."

- **Security Expert** [observation]: "Recipe images are uploaded directly to Supabase Storage. There is no file type validation or size limit mentioned. This is an attack vector for malicious file uploads."

- **User Advocate** [question]: "Has anyone considered offline access? Recipe apps are used in kitchens where Wi-Fi can be unreliable. Even basic caching would help."

- **Devil's Advocate** [challenge]: "The grocery list feature reads from the recipe ingredients table. But ingredient names are free-text. 'tomatoes', 'tomato', 'roma tomatoes' will all be separate line items. There is no normalization strategy."

**Consensus:**
- Auth needs refresh token rotation (all agree)
- Onboarding should be shortened (all agree)
- File upload validation is necessary (all agree)
- Ingredient normalization is a real problem (all agree)

**Disagreements:**
- Real-time architecture: Devil's Advocate and Pragmatist say defer it; Security Expert says if we build it, build it right; User Advocate wants collaborative features sooner
- Offline access: User Advocate says essential; Pragmatist says Phase 3 at earliest

**Recommendation:**
1. Add refresh token rotation to auth section (Security Expert wins)
2. Reduce onboarding to 3 steps (User Advocate wins)
3. Add file validation: type whitelist + 5MB limit (Security Expert wins)
4. Defer real-time to Phase 2, use polling in Phase 1 (Pragmatist wins)
5. Add ingredient normalization strategy to Phase 1: use a controlled ingredient database with fuzzy matching (Devil's Advocate raises issue, all agree on solution)
6. Add offline as Phase 3 stretch goal (Pragmatist wins on timing)

## Persona Templates

Use these as starting points and customize for the project:

| Persona | Good For |
|---------|----------|
| Security Expert | Any plan with auth, user data, or external APIs |
| User Advocate | Any user-facing product |
| Devil's Advocate | Every plan (always include one) |
| Pragmatist | Startup/MVP projects with time pressure |
| Performance Engineer | Data-heavy or high-traffic applications |
| Accessibility Advocate | Public-facing web applications |
| Domain Expert | Industry-specific applications (healthcare, finance, etc.) |
| Junior Developer | Checking if the plan is understandable and implementable |
