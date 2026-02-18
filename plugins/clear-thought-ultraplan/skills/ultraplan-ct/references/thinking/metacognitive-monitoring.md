# Metacognitive Monitoring Framework

Self-assessment of knowledge boundaries, confidence calibration, and bias detection.

## When to Use

- **Phase 1 (UNDERSTAND)**: Assess knowledge gaps before questioning the user. Know what you do not know.
- **Phase 4 (REVIEW)**: Confidence calibration on plan quality. How sure are you that this plan is complete and correct?
- **Any phase**: When uncertain about the reliability of an analysis. When something feels off but you cannot articulate why.

## Core Concept

Metacognition is thinking about thinking. This framework forces explicit assessment of what you know, what you infer, what you are guessing, and where your reasoning might be biased. It prevents false confidence and surfaces gaps before they become problems.

## Process

1. Identify the task or domain being assessed
2. Rate knowledge level honestly: expert / proficient / familiar / basic / minimal / none
3. For each claim or assertion, tag its status: **fact** / **inference** / **speculation** / **uncertain**
4. Evaluate reasoning steps for logical validity and potential biases
5. Identify specific areas of uncertainty
6. Determine recommended approach based on confidence level

## Knowledge Levels

| Level | Description | What It Means for the Plan |
|-------|-------------|---------------------------|
| Expert | Deep experience, can handle edge cases | Proceed with confidence, document assumptions |
| Proficient | Solid understanding, some gaps in edge cases | Proceed, flag edge cases for review |
| Familiar | General understanding, limited hands-on | Proceed with caution, add research tasks |
| Basic | Conceptual understanding only | Add spike/prototype tasks before committing |
| Minimal | Have heard of it, little understanding | Requires research phase before planning |
| None | No knowledge | Must research or recommend to user as requirement |

## Claim Status Tags

- **fact**: Verified from documentation, source code, or direct experience. High confidence (0.9+).
- **inference**: Logical conclusion drawn from known facts. Medium-high confidence (0.6-0.9).
- **speculation**: Educated guess based on patterns. Medium confidence (0.3-0.6).
- **uncertain**: Do not know. Low confidence (0.0-0.3). Must be investigated.

## Bias Detection Checklist

Run through this checklist when reviewing your own reasoning:

| Bias | Question to Ask | If Yes |
|------|----------------|--------|
| **Anchoring** | Am I over-relying on the first piece of information I encountered? | Seek alternative starting points |
| **Confirmation** | Am I only looking for evidence that supports my current view? | Actively seek disconfirming evidence |
| **Availability** | Am I overweighting recent or memorable examples? | Check base rates and broader data |
| **Dunning-Kruger** | Am I overconfident in an area I know little about? | Downgrade confidence, add research tasks |
| **Sunk Cost** | Am I continuing a path because of prior investment rather than merit? | Evaluate from scratch as if starting fresh |
| **Status Quo** | Am I defaulting to familiar patterns when better ones exist? | Explicitly consider at least one alternative |
| **Bandwagon** | Am I recommending this because it is popular, not because it is right? | Evaluate on project-specific criteria |
| **Optimism** | Am I underestimating effort, risk, or complexity? | Apply 1.5x multiplier to estimates |

## Application Format

```
### Metacognitive Check: [What am I assessing?]
**Domain knowledge:** [Level] - [Supporting evidence for this rating]
**Overall confidence:** [0.0-1.0]

**Claims and their status:**
| Claim | Status | Confidence | Evidence |
|-------|--------|------------|----------|
| [claim] | fact | 0.95 | [verified source] |
| [claim] | inference | 0.70 | [reasoning chain] |
| [claim] | speculation | 0.30 | [limited basis] |
| [claim] | uncertain | 0.10 | [no evidence] |

**Potential biases detected:**
- [Bias type]: [How it might affect this analysis]

**Uncertainty areas:**
- [What I don't know and should investigate]

**Recommendation:** [What to do given this confidence level]
```

## Example: Assessing Confidence in Auth Architecture

### Metacognitive Check: JWT + Refresh Token Auth Plan

**Domain knowledge:** Proficient - Have implemented JWT auth in multiple projects, but not with token rotation in edge function environments.

**Overall confidence:** 0.72

**Claims and their status:**
| Claim | Status | Confidence | Evidence |
|-------|--------|------------|----------|
| JWTs should be short-lived (15 min) | fact | 0.95 | OWASP recommendation, standard practice |
| Refresh tokens should rotate on use | fact | 0.90 | RFC 6749, Supabase docs |
| Supabase handles refresh rotation automatically | inference | 0.65 | Docs mention it, have not verified behavior |
| Edge functions can validate JWTs without network call | inference | 0.75 | JWTs are self-contained by design, but need to verify key distribution |
| Our session management will handle concurrent devices correctly | speculation | 0.35 | Have not designed this part yet |

**Potential biases detected:**
- **Status Quo**: Defaulting to JWT because it is what I have used before. Should consider session-based auth as an alternative.
- **Optimism**: Assuming Supabase handles refresh rotation "correctly" without verifying edge cases (concurrent refresh, race conditions).

**Uncertainty areas:**
- How does Supabase handle concurrent refresh token use from multiple devices?
- What happens if the refresh token rotation fails mid-request?
- How are JWTs verified in edge functions when the signing key rotates?

**Recommendation:** Confidence is above threshold (0.7) for the core JWT flow but below threshold for multi-device and edge function scenarios. Add two tasks: (1) spike on Supabase refresh token behavior with concurrent clients, (2) verify JWT validation in edge function environment.

## Confidence Thresholds for Action

| Confidence | Recommended Action |
|------------|-------------------|
| 0.9+ | Proceed. Document assumptions for future reference. |
| 0.7-0.9 | Proceed with caveats. Flag uncertain areas in the plan. |
| 0.5-0.7 | Add research or spike tasks before committing to this approach. |
| 0.3-0.5 | Do not commit. Present options to user with tradeoffs. |
| Below 0.3 | Requires investigation. Add as a prerequisite research task. |
