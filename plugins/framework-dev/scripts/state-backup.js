#!/usr/bin/env node
/**
 * State backup and session resume detection.
 * Used by SessionStart hook (command type).
 *
 * Usage: node scripts/state-backup.js
 *
 * Checks for .framework-blueprints/00-project-state.json and outputs
 * a summary if found. Exit code 0 always (informational only).
 */

const fs = require('fs');
const path = require('path');

const BLUEPRINT_DIR = '.framework-blueprints';
const STATE_FILE = path.join(BLUEPRINT_DIR, '00-project-state.json');

function main() {
  if (!fs.existsSync(STATE_FILE)) {
    // No state file - nothing to report
    process.exit(0);
  }

  try {
    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    const phase = state.currentPhase || '?';
    const phaseName = {
      1: 'Discovery', 2: 'Structure', 3: 'Planning',
      4: 'Assignment', 5: 'Execution', 6: 'Integration'
    }[phase] || 'Unknown';
    const progress = state.phases?.[String(phase)]?.progress || 0;
    const updated = state.updatedAt || 'unknown';

    console.log(`[framework-dev] Previous session found: "${state.projectName || 'Unnamed'}"`);
    console.log(`  Phase ${phase} (${phaseName}) - ${progress}% complete`);
    console.log(`  Last updated: ${updated}`);
    console.log(`  Use "/framework-dev resume" to continue or start fresh.`);
  } catch (e) {
    console.log(`[framework-dev] State file found but unreadable: ${e.message}`);
  }
}

main();
