#!/usr/bin/env node
/**
 * Generate a state summary from current blueprint state.
 * Cross-platform Node.js script (no bash dependencies).
 *
 * Usage: node scripts/state-summary.js
 */

const fs = require('fs');
const path = require('path');

const BLUEPRINT_DIR = '.framework-blueprints';
const STATE_FILE = path.join(BLUEPRINT_DIR, '00-project-state.json');

function main() {
  if (!fs.existsSync(STATE_FILE)) {
    console.log('No state file found.');
    process.exit(0);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  const phaseNames = {
    1: 'Discovery', 2: 'Structure', 3: 'Planning',
    4: 'Agent Assignment', 5: 'Execution', 6: 'Integration'
  };

  console.log(`\nProject: ${state.projectName || '(unnamed)'}`);
  console.log(`Phase: ${state.currentPhase} - ${phaseNames[state.currentPhase] || 'Unknown'}`);
  console.log(`Updated: ${state.updatedAt || 'N/A'}`);
  console.log('');

  // Phase progress
  console.log('Phase Progress:');
  for (let i = 1; i <= 6; i++) {
    const phase = state.phases?.[String(i)];
    const status = phase?.status || 'pending';
    const progress = phase?.progress || 0;
    const icon = status === 'completed' ? '[x]' : status === 'in_progress' ? '[~]' : '[ ]';
    console.log(`  ${icon} Phase ${i}: ${phaseNames[i]} (${progress}%)`);
  }

  // Decisions
  if (state.decisions?.length > 0) {
    console.log(`\nDecisions: ${state.decisions.length}`);
    state.decisions.slice(-5).forEach(d => {
      console.log(`  - ${d.id || '?'}: ${d.topic || d.choice || '(no description)'}`);
    });
  }

  // Modules
  if (state.modules?.length > 0) {
    console.log(`\nModules: ${state.modules.length}`);
    state.modules.forEach(m => {
      console.log(`  - ${m.name || m}: ${m.status || 'defined'}`);
    });
  }

  // Critical details
  if (state.criticalDetails) {
    const cd = state.criticalDetails;
    if (cd.envVars?.length > 0) {
      console.log(`\nEnvironment Variables: ${cd.envVars.length}`);
    }
    if (Object.keys(cd.nonStandardPaths || {}).length > 0) {
      console.log(`Non-Standard Paths: ${Object.keys(cd.nonStandardPaths).length}`);
    }
    if (cd.apiQuirks?.length > 0) {
      console.log(`API Quirks: ${cd.apiQuirks.length}`);
    }
  }

  // Checkpoints
  if (state.checkpoints?.length > 0) {
    console.log(`\nCheckpoints: ${state.checkpoints.length}`);
  }
}

main();
