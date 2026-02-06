#!/usr/bin/env node
/**
 * Create a checkpoint backup of the current blueprint state.
 * Cross-platform Node.js script (no bash dependencies).
 *
 * Usage: node scripts/checkpoint.js [description]
 */

const fs = require('fs');
const path = require('path');

const BLUEPRINT_DIR = '.framework-blueprints';
const STATE_FILE = path.join(BLUEPRINT_DIR, '00-project-state.json');
const BACKUP_DIR = path.join(BLUEPRINT_DIR, 'backups');

function main() {
  if (!fs.existsSync(STATE_FILE)) {
    console.log('No state file found. Nothing to checkpoint.');
    process.exit(0);
  }

  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Read current state
  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const description = process.argv.slice(2).join(' ') || 'manual';

  // Create backup
  const backupName = `state-${timestamp}-${description.replace(/\s+/g, '-').substring(0, 30)}.json`;
  const backupPath = path.join(BACKUP_DIR, backupName);
  fs.writeFileSync(backupPath, JSON.stringify(state, null, 2));

  // Update state with checkpoint record
  if (!state.checkpoints) state.checkpoints = [];
  state.checkpoints.push({
    timestamp: new Date().toISOString(),
    description,
    backup: backupPath,
    phase: state.currentPhase,
    progress: state.phases?.[String(state.currentPhase)]?.progress || 0
  });
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  console.log(`Checkpoint created: ${backupName}`);
  console.log(`Phase: ${state.currentPhase}, Project: ${state.projectName}`);
  console.log(`Backup: ${backupPath}`);
}

main();
