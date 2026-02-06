---
name: deployment-pipeline-design
description: Use when designing CI/CD pipelines or creating GitHub Actions / GitLab CI configuration.
allowed-tools: Read, Write, WebSearch, Bash
---

# Deployment Pipeline Design

This skill guides CI/CD pipeline design during framework planning, providing templates and best practices for automated build, test, and deployment workflows.

---

## Pipeline Stages Overview

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  Build  │──▶│  Test   │──▶│  Scan   │──▶│  Stage  │──▶│  Prod   │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
    │             │             │             │             │
    ▼             ▼             ▼             ▼             ▼
 Compile      Unit Tests    Security     Deploy to    Deploy to
 Lint         Integration   SAST/DAST    Staging      Production
 Type Check   E2E Tests     Deps Audit   Smoke Test   Health Check
```

---

## GitHub Actions Template

See `references/github-actions-template.yml` for the complete pipeline configuration. The template includes jobs for build (lint, type-check, compile), test (unit + integration with coverage), security (audit + SAST), and deployments to staging/production with artifact management and environment-specific smoke tests.

---

## GitLab CI Template

See `references/gitlab-ci-template.yml` for the complete pipeline configuration. The template includes 5 stages (build, test, security, staging, production) with service containers for integration tests (postgres, redis), coverage reporting, and branch-based deployment rules with manual approval for production.

---

## Environment Strategy

### Environment Progression

```
Feature Branch → develop → staging → main → production
      │             │          │         │         │
      ▼             ▼          ▼         ▼         ▼
   PR Tests    Integration   QA Test   Final    Live
                  Tests      Manual    Review
```

### Environment Configuration

| Environment | Purpose | Data | Access |
|-------------|---------|------|--------|
| Development | Local dev | Fake/seed | Developer |
| CI | Automated tests | Test fixtures | CI only |
| Staging | Pre-production | Anonymized prod | Team |
| Production | Live | Real | Restricted |

---

## Deployment Strategies

### Blue-Green Deployment

```
        ┌─────────────┐
        │  Load       │
        │  Balancer   │
        └──────┬──────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐ ┌──────▼──────┐
│   Blue      │ │   Green     │
│  (v1.0)     │ │  (v1.1)     │
│  [ACTIVE]   │ │  [STANDBY]  │
└─────────────┘ └─────────────┘

1. Deploy to Green (standby)
2. Test Green
3. Switch traffic to Green
4. Blue becomes standby
```

### Canary Deployment

```
        ┌─────────────┐
        │  Load       │
        │  Balancer   │
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼ (90%)    ▼ (10%)    │
┌───────────┐ ┌───────────┐
│  Stable   │ │  Canary   │
│  (v1.0)   │ │  (v1.1)   │
└───────────┘ └───────────┘

1. Deploy canary with 10% traffic
2. Monitor metrics
3. Gradually increase to 100%
4. Rollback if issues
```

### Rolling Deployment

```
Time 0: [v1] [v1] [v1] [v1]
Time 1: [v2] [v1] [v1] [v1]
Time 2: [v2] [v2] [v1] [v1]
Time 3: [v2] [v2] [v2] [v1]
Time 4: [v2] [v2] [v2] [v2]
```

---

## Secrets Management

### GitHub Secrets

```yaml
# Use in workflow
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}

# Or per-step
- name: Deploy
  env:
    TOKEN: ${{ secrets.DEPLOY_TOKEN }}
  run: deploy.sh
```

### Required Secrets

| Secret | Environment | Purpose |
|--------|-------------|---------|
| `DATABASE_URL` | staging, production | Database connection |
| `JWT_SECRET` | staging, production | Token signing |
| `DEPLOY_TOKEN` | CI | Deployment auth |
| `CODECOV_TOKEN` | CI | Coverage reporting |

---

## Pipeline Checklist

Before deploying:
- [ ] All tests pass
- [ ] Lint clean
- [ ] Type check passes
- [ ] Security scan clean
- [ ] Build succeeds
- [ ] Staging smoke tests pass

---

## Integration with Framework Developer

During Phase 3 (Planning) or Phase 6 (Integration):
1. Choose CI/CD platform
2. Define environment strategy
3. Create pipeline configuration
4. Set up secrets management
5. Configure deployment targets
6. Document in final report
