// Deterministic simulation of orchestrate.workflow.js with fake agents. No tokens spent.
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const SRC = readFileSync(new URL('./orchestrate.workflow.js', import.meta.url), 'utf8')
  .replace(/^export const meta/m, 'const meta')
const AsyncFn = Object.getPrototypeOf(async () => {}).constructor
const script = new AsyncFn('args', 'agent', 'parallel', 'pipeline', 'phase', 'log', SRC)

const parallel = async thunks => Promise.all(thunks.map(t => t().catch(() => null)))
const pipeline = async (items, ...stages) => Promise.all(items.map(async (it, i) => {
  try { let r = it; for (const [n, s] of stages.entries()) r = await s(n === 0 ? it : r, it, i); return r } catch { return null }
}))

const BASE = {
  root: '/repo', goal: 'g', contracts: [{ file: 'src/types.ts', spec: 'export type X = 1' }],
  units: [
    { key: 'a', owns: ['src/a.ts', 'test/a.test.ts'], task: 't', lane: 'codex' },
    { key: 'b', owns: ['./src/b.ts'], task: 't' },
    { key: 'c', owns: ['/repo/src/c.ts'], task: 't' },
  ],
  checks: ['tsc'], rigor: 'standard',
}
const ok = key => ({ status: 'done', files_changed: BASE.units.find(u => u.key === key).owns, contract_gap: '', checks_run: 'pass', notes: '' })
const pass = { verdict: 'pass', issues: [], summary: 'ok' }
const snap = changed => ({ changed, hashes: [{ path: 'src/types.ts', hash: 'h1' }] })
const CHANGED = ['src/types.ts', 'src/a.ts', 'test/a.test.ts', 'src/b.ts', 'src/c.ts']

// handlers: label -> result (or function(prompt, opts, callIndex))
async function run(argsOver, handlers) {
  const calls = []
  const counts = {}
  const agent = async (prompt, opts) => {
    calls.push(opts)
    const l = opts.label
    counts[l] = (counts[l] ?? 0) + 1
    const h = Object.entries(handlers).find(([k]) => k === l) ?? Object.entries(handlers).find(([k]) => l.startsWith(k))
    if (!h) throw new Error(`unhandled agent ${l}`)
    return typeof h[1] === 'function' ? h[1](prompt, opts, counts[l]) : structuredClone(h[1])
  }
  const logs = []
  const result = await script({ ...BASE, ...argsOver }, agent, parallel, pipeline, () => {}, m => logs.push(m))
  return { result, calls, logs }
}
const common = {
  contracts: { files_written: ['src/types.ts'], frozen: 'export type X = 1', notes: '' },
  snapshot: snap([]),
  'build:a': ok('a'), 'build:b': ok('b'), 'build:c': ok('c'),
  'verify': pass,
  'checks': { passed: true, failures: [], output_tail: '' },
  'ownership-audit': snap(CHANGED),
}

const tests = {
  async happyPathGreenAndPathsNormalised() {
    const { result, calls } = await run({}, common)
    assert.equal(result.status, 'green')
    assert.deepEqual(result.ownership, { stray_files: [], protected_files_changed: [], cross_owner_edits: [] })
    assert.equal(calls.find(c => c.label === 'build:a').agentType, 'codex-driver')
    assert.equal(calls.find(c => c.label === 'build:b').agentType, undefined)
  },
  async overlapThrows() {
    await assert.rejects(run({ units: [{ key: 'a', owns: ['x.ts'], task: 't' }, { key: 'b', owns: ['./x.ts'], task: 't' }] }, common), /ONE FILE = ONE OWNER/)
    await assert.rejects(run({ units: [{ key: 'a', owns: ['src'], task: 't' }, { key: 'b', owns: ['src/x.ts'], task: 't' }] }, common), /directory/)
    await assert.rejects(run({ maxFix: -1 }, common), /maxFix/)
  },
  async checksAgentDiesIsNotGreen() {
    const { result } = await run({}, { ...common, checks: null })
    assert.equal(result.status, 'needs_work')
    assert.equal(result.checks, 'agent died — unverified')
  },
  async deadBuilderIsDiedNotContractGap() {
    const { result, calls } = await run({}, { ...common, 'build:a': null })
    assert.ok(calls.some(c => c.label === 'build:a-retry' && c.agentType === undefined), 'dead lane retries on claude')
    assert.deepEqual(result.died, ['a'])
    assert.deepEqual(result.contract_gaps, [])
    assert.equal(result.status, 'blocked')
  },
  async verifierDiesIsUnreviewed() {
    const { result } = await run({}, { ...common, 'verify:b': null })
    assert.deepEqual(result.unreviewed, ['b'])
    assert.equal(result.status, 'needs_work')
  },
  async ultraPartialLensesIsUnreviewed() {
    const { result } = await run({ rigor: 'ultra' }, { ...common, 'verify:c:2': null, completeness: { complete: true, gaps: [] } })
    assert.deepEqual(result.unreviewed, ['c'])
  },
  async criticDiesIsNotGreen() {
    const { result } = await run({ rigor: 'ultra' }, { ...common, completeness: null })
    assert.equal(result.status, 'needs_work')
  },
  async fixLoopEscalatesAndFiltersForeignIssues() {
    const bad = { verdict: 'issues', summary: 'x', issues: [
      { severity: 'high', file: 'src/a.ts', problem: 'p', fix: 'f' },
      { severity: 'high', file: 'src/types.ts', problem: 'contract wrong', fix: 'f' },
      { severity: 'high', file: 'src/b.ts', problem: 'b wrong', fix: 'f' },
    ] }
    const { result, calls } = await run({}, { ...common, 'verify:a': bad, 'verify2:a': bad, 'verify3:a': pass, 'fix1:a': ok('a'), 'fix2:a': ok('a') })
    assert.equal(calls.find(c => c.label === 'fix1:a').agentType, 'codex-driver')
    assert.equal(calls.find(c => c.label === 'fix2:a').agentType, undefined, 'second fix escalates to claude')
    assert.ok(result.contract_gaps.length === 0, 'final review passed, so no leftover gaps')
    const { result: r2 } = await run({ maxFix: 0 }, { ...common, 'verify:a': bad })
    assert.ok(r2.contract_gaps.some(g => g.gap.includes('contract wrong')))
    assert.ok(r2.open_issues.some(i => i.unit === 'b' && i.found_by === 'a'))
    assert.ok(r2.open_issues.some(i => i.unit === 'a'))
  },
  async fixAgentDiesKeepsBuild() {
    const bad = { verdict: 'issues', summary: 'x', issues: [{ severity: 'high', file: 'src/b.ts', problem: 'p', fix: 'f' }] }
    const { result } = await run({}, { ...common, 'verify:b': bad, 'fix1:b': null })
    assert.deepEqual(result.died, [])
    assert.equal(result.units.find(u => u.key === 'b').fix_died, true)
    assert.equal(result.status, 'needs_work')
  },
  async sharedRootCauseDoesNotFanOut() {
    const fail = { passed: false, output_tail: '', failures: ['src/a.ts', 'src/b.ts', 'src/c.ts'].map(f => ({ file: f, root_cause_file: 'tsconfig.json', command: 'tsc', message: 'm' })) }
    const { result, calls } = await run({}, { ...common, checks: fail })
    assert.equal(calls.filter(c => c.label.startsWith('int-fix')).length, 0)
    assert.equal(result.unrouted_failures.length, 3)
    assert.equal(result.status, 'needs_work')
  },
  async routesToCauseOwnerThenGoesGreen() {
    const fail = { passed: false, output_tail: '', failures: [{ file: 'src/c.ts', root_cause_file: './src/b.ts', command: 'tsc', message: 'm' }] }
    const { result, calls } = await run({}, { ...common, checks: (p, o) => (o.label === 'checks1' ? fail : { passed: true, failures: [], output_tail: '' }), 'int-fix1:b': ok('b') })
    assert.deepEqual(calls.filter(c => c.label.startsWith('int-fix')).map(c => c.label), ['int-fix1:b'])
    assert.equal(result.status, 'green')
  },
  async intFixBlockedBecomesGap() {
    const fail = { passed: false, output_tail: '', failures: [{ file: 'src/b.ts', root_cause_file: 'src/b.ts', command: 'tsc', message: 'm' }] }
    const { result } = await run({}, { ...common, checks: fail, 'int-fix1:b': { ...ok('b'), status: 'blocked', contract_gap: 'need Y' } })
    assert.ok(result.contract_gaps.some(g => g.gap === 'need Y'))
    assert.equal(result.status, 'blocked')
  },
  async ownershipViolationsCaught() {
    const { result } = await run({}, {
      ...common,
      'build:c': { ...ok('c'), files_changed: ['src/c.ts', 'src/a.ts'] },
      'ownership-audit': { changed: [...CHANGED, 'package.json'], hashes: [{ path: 'src/types.ts', hash: 'CHANGED' }] },
    })
    assert.deepEqual(result.ownership.stray_files, ['package.json'])
    assert.deepEqual(result.ownership.protected_files_changed, ['src/types.ts'])
    assert.deepEqual(result.ownership.cross_owner_edits, [{ unit: 'c', file: 'src/a.ts', stage: 'build' }])
    assert.equal(result.status, 'needs_work')
  },
  async noChecksIsUnverified() {
    const { result } = await run({ checks: [] }, common)
    assert.equal(result.status, 'unverified')
  },
}

let failed = 0
for (const [name, t] of Object.entries(tests)) {
  try { await t(); console.log(`ok   ${name}`) } catch (e) { failed++; console.log(`FAIL ${name}: ${e.message}`) }
}
console.log(failed ? `${failed} FAILED` : 'ALL PASS')
process.exit(failed ? 1 : 0)
