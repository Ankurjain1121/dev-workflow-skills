# Design

Complete design thinking pipeline for UIs.

## Pipeline
1. **PRD Generation** - Product requirements from rough ideas
2. **9-Pass UX Analysis** - Comprehensive UX review
3. **UI Audit** - Audit existing interfaces
4. **Iteration** - Refine based on feedback

## Usage

```bash
/design "Create a dashboard for analytics"
/design:audit existing-component.tsx
/design:iterate  # Continue refining
```

## Installation

Enable in your Claude settings:
```json
{
  "enabledPlugins": {
    "dev-workflow-skills@design": true
  }
}
```
