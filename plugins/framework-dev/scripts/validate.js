#!/usr/bin/env node
/**
 * Validate framework blueprints.
 * Cross-platform Node.js script (no bash dependencies).
 *
 * Usage: node scripts/validate.js [contracts|links|state|all]
 */

const fs = require('fs');
const path = require('path');

const BLUEPRINT_DIR = '.framework-blueprints';
const STATE_FILE = path.join(BLUEPRINT_DIR, '00-project-state.json');
const CONTRACTS_FILE = path.join(BLUEPRINT_DIR, '03-api-planning', 'api-contracts.md');

function fileExists(filePath) {
  try { fs.accessSync(filePath); return true; } catch { return false; }
}

function validateState() {
  console.log('\n== State Validation ==');
  if (!fileExists(STATE_FILE)) {
    console.log('SKIP: No state file found');
    return { status: 'skip', issues: 0 };
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  const required = ['projectName', 'version', 'currentPhase', 'phases', 'decisions', 'modules'];
  let issues = 0;

  for (const field of required) {
    if (!(field in state)) {
      console.log(`  FAIL: Missing required field: ${field}`);
      issues++;
    }
  }

  // Check phase consistency
  const current = state.currentPhase;
  for (let i = 1; i < current; i++) {
    const phase = state.phases?.[String(i)];
    if (phase && phase.status !== 'completed') {
      console.log(`  WARN: Phase ${i} should be completed (current is ${current})`);
      issues++;
    }
  }

  // Check decisions have sources
  (state.decisions || []).forEach((d, i) => {
    if (!d.source) {
      console.log(`  WARN: Decision ${i} missing source URL`);
      issues++;
    }
  });

  console.log(`  Result: ${issues === 0 ? 'PASS' : `${issues} issues found`}`);
  return { status: issues === 0 ? 'pass' : 'fail', issues };
}

function validateContracts() {
  console.log('\n== Contract Validation ==');
  if (!fileExists(CONTRACTS_FILE)) {
    console.log('SKIP: No contracts file found');
    return { status: 'skip', issues: 0 };
  }

  const content = fs.readFileSync(CONTRACTS_FILE, 'utf8');
  const endpointPattern = /\|\s*(GET|POST|PUT|PATCH|DELETE)\s*\|\s*([^\|]+)\|/g;
  const endpoints = [];
  let match;

  while ((match = endpointPattern.exec(content)) !== null) {
    endpoints.push({ method: match[1].trim(), path: match[2].trim() });
  }

  console.log(`  Found ${endpoints.length} endpoints in contract`);

  // Check for common issues
  let issues = 0;
  const paths = endpoints.map(e => e.path);
  const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
  if (duplicates.length > 0) {
    console.log(`  WARN: Duplicate paths: ${[...new Set(duplicates)].join(', ')}`);
    issues++;
  }

  console.log(`  Result: ${issues === 0 ? 'PASS' : `${issues} issues found`}`);
  return { status: issues === 0 ? 'pass' : 'fail', issues };
}

function validateLinks() {
  console.log('\n== Link Validation ==');
  if (!fileExists(BLUEPRINT_DIR)) {
    console.log('SKIP: No blueprint directory found');
    return { status: 'skip', issues: 0 };
  }

  let issues = 0;
  const fileRefPattern = /`([^`]*\.(ts|js|tsx|jsx|md|json))`/g;

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        let match;
        while ((match = fileRefPattern.exec(content)) !== null) {
          const ref = match[1];
          if (ref.startsWith('src/') && !fileExists(ref)) {
            console.log(`  WARN: ${path.relative(BLUEPRINT_DIR, fullPath)} references missing: ${ref}`);
            issues++;
          }
        }
      }
    }
  }

  scanDir(BLUEPRINT_DIR);
  console.log(`  Result: ${issues === 0 ? 'PASS' : `${issues} broken links found`}`);
  return { status: issues === 0 ? 'pass' : 'fail', issues };
}

// Main
const mode = process.argv[2] || 'all';
console.log(`Framework Blueprint Validator (mode: ${mode})`);
console.log('='.repeat(40));

const results = {};
if (mode === 'state' || mode === 'all') results.state = validateState();
if (mode === 'contracts' || mode === 'all') results.contracts = validateContracts();
if (mode === 'links' || mode === 'all') results.links = validateLinks();

const totalIssues = Object.values(results).reduce((sum, r) => sum + r.issues, 0);
console.log(`\n${'='.repeat(40)}`);
console.log(`Total issues: ${totalIssues}`);
process.exit(totalIssues > 0 ? 1 : 0);
