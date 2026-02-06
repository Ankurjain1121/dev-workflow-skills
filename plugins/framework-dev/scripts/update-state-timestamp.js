#!/usr/bin/env node
/**
 * PostToolUse hook: update state file timestamp when blueprint files are modified.
 * Command-type hook - no LLM call. Uses fs.existsSync for zero-cost skip.
 *
 * Exit 0 = always (informational only, never blocks)
 */

const fs = require('fs');
const path = require('path');

const BLUEPRINT_DIR = '.framework-blueprints';
const STATE_FILE = path.join(BLUEPRINT_DIR, '00-project-state.json');

// Fast exit if no state file
if (!fs.existsSync(STATE_FILE)) {
  process.exit(0);
}

// Read tool input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input?.file_path || data.tool_input?.filePath || '';

    // Only update timestamp if a blueprint file was modified
    if (!filePath.includes('.framework-blueprints/')) {
      process.exit(0);
    }

    // Don't update state file when we're the ones writing it (avoid loop)
    if (filePath.endsWith('00-project-state.json')) {
      process.exit(0);
    }

    // Update timestamp
    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    state.updatedAt = new Date().toISOString();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch {
    // Any error - don't block
  }
  process.exit(0);
});

setTimeout(() => process.exit(0), 3000);
