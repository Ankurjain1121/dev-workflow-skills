# Dev Workflow Skills Marketplace

A curated collection of Claude Code plugins for development workflows - orchestration, code review, design, React development, and more.

## Available Plugins

| Plugin | Description | Category |
|--------|-------------|----------|
| **[orchestrate](./plugins/orchestrate)** | Multi-agent parallel execution with file ownership | Development |
| **[brutal-review](./plugins/brutal-review)** | Zero-tolerance multi-agent code review | Code Quality |
| **[design](./plugins/design)** | Complete design thinking pipeline for UIs | Design |
| **[react-development](./plugins/react-development)** | Comprehensive React with hooks and state management | Development |
| **[frontend-design](./plugins/frontend-design)** | Production-grade frontend interfaces | Design |
| **[framework-dev](./plugins/framework-dev)** | Project framework orchestrator (6-phase workflow) | Planning |

## Installation

Add to your `~/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "dev-workflow-skills": {
      "source": {
        "source": "github",
        "repo": "Ankurjain1121/dev-workflow-skills"
      }
    }
  },
  "enabledPlugins": {
    "dev-workflow-skills@orchestrate": true,
    "dev-workflow-skills@brutal-review": true,
    "dev-workflow-skills@design": true,
    "dev-workflow-skills@react-development": true,
    "dev-workflow-skills@frontend-design": true,
    "dev-workflow-skills@framework-dev": true
  }
}
```

Or install individual plugins by only enabling the ones you need.

## Plugin Details

### orchestrate
**Multi-agent parallel execution with file ownership**

Fast parallel execution for large projects. One file = One owner. Supports multi-terminal mode with Claude/Gemini/Qwen.

```bash
/orchestrate add authentication with login, signup, and password reset
/orchestrate --multi  # For 10+ files
```

### brutal-review
**Zero-tolerance multi-agent code review**

5 specialized agents (Security, Architecture, Quality, Performance, Style) with weighted scoring. 95+ to pass.

```bash
/brutal-review src/
```

### design
**Complete design thinking pipeline for UIs**

Transforms rough ideas into PRDs, runs 9-pass UX analysis, audits existing UIs, and iterates based on feedback.

```bash
/design "Create a dashboard for analytics"
```

### react-development
**Comprehensive React development**

Hooks, components, state management, context, effects, and performance optimization based on official React documentation.

```bash
/react-development  # Then ask React questions
```

### frontend-design
**Production-grade frontend interfaces**

Create distinctive, polished code that avoids generic AI aesthetics. Anti-slop rules for high design quality.

```bash
/frontend-design "Build a landing page"
```

### framework-dev
**Project framework orchestrator**

6-phase workflow from discovery to integration. Research-backed recommendations, multi-agent coordination, context hygiene.

```bash
/framework-dev "Help me plan my new SaaS project"
```

## Requirements

- [Claude Code](https://claude.ai/code) CLI installed
- Active Claude subscription

## License

MIT License - see [LICENSE](LICENSE) file

## Author

Built by Ankur Jain with Claude Code
