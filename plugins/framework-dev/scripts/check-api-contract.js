#!/usr/bin/env node
/**
 * PreToolUse hook: check if Write/Edit targets align with API contracts.
 * Command-type hook - no LLM call. Uses fs.existsSync for zero-cost skip.
 *
 * Reads tool input from stdin (JSON), checks if the target file
 * references API endpoints that should exist in api-contracts.md.
 *
 * Exit 0 = continue normally (no validation needed or passed)
 * Exit 2 = block with error message (contract violation)
 */

const fs = require('fs');
const path = require('path');

const BLUEPRINT_DIR = '.framework-blueprints';
const CONTRACTS_FILE = path.join(BLUEPRINT_DIR, '03-api-planning', 'api-contracts.md');

// Fast exit if no blueprint directory - this is the common case
if (!fs.existsSync(BLUEPRINT_DIR)) {
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

    // Only check source files, not blueprint files or configs
    if (!filePath.includes('src/') && !filePath.includes('routes/')) {
      process.exit(0);
    }

    // Check if contracts file exists
    if (!fs.existsSync(CONTRACTS_FILE)) {
      process.exit(0);
    }

    // Output a reminder as systemMessage
    const output = JSON.stringify({
      hookSpecificOutput: {
        additionalContext: 'Reminder: API endpoints must match .framework-blueprints/03-api-planning/api-contracts.md. Verify endpoint paths, methods, and response schemas before writing.'
      }
    });
    process.stdout.write(output);
    process.exit(0);
  } catch {
    // Parse error or any issue - don't block
    process.exit(0);
  }
});

// Handle no stdin (shouldn't happen but be safe)
setTimeout(() => process.exit(0), 3000);
