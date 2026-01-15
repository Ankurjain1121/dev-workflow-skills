# Orchestrate

Multi-agent parallel execution with file ownership.

## Features
- **One File = One Owner** - No two agents edit the same file
- **Parallel Execution** - All agents spawn in ONE message
- **Multi-Terminal Mode** - Support for 10+ files with Claude/Gemini/Qwen
- **Contract Registry** - Manage type contracts for faster agent assignment

## Usage

```bash
# Medium tasks (5-9 files)
/orchestrate add user authentication with login, signup, password reset

# Large tasks (10+ files)
/orchestrate --multi build dashboard with charts, filters, export
```

## Included Skills
- `orchestrate` - Main orchestration skill
- `contracts` - Type contract management (bundled)

## Installation

Enable in your Claude settings:
```json
{
  "enabledPlugins": {
    "dev-workflow-skills@orchestrate": true
  }
}
```
