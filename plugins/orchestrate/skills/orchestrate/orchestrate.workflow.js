export const meta = {
  name: 'orchestrate',
  description: 'Contract-first parallel build: freeze contracts, one owner per file set, verify each unit, integrate until green',
  whenToUse: 'Multi-file work that splits into disjoint file sets joined by shared types, interfaces or API shapes',
  phases: [
    { title: 'Contracts', detail: 'write and freeze shared contracts before anyone builds' },
    { title: 'Build', detail: 'one owner per file set: build, verify, fix — per unit, no barrier' },
    { title: 'Integrate', detail: 'full checks, failures routed to the owner of the root cause, ownership audit' },
  ],
}

// ---- args ------------------------------------------------------------------
// {
//   root: '/abs/repo', goal: 'one paragraph', context: 'stack + house rules',
//   contracts: [{ file: 'src/types/user.ts', spec: 'exact code' }],   // optional
//   reads: ['src/lib/db.ts'],                  // read-only files every unit may need
//   units: [{ key, owns: [files], task, reads?, check?, lane?, model?, effort? }],
//   checks: ['npx tsc --noEmit', 'npx vitest run'],   // run in Integrate, in order
//   baselineDirty: ['files already modified before the run'],
//   rigor: 'standard' | 'ultra',  maxFix: 2,  maxIntegrate: 2,
// }
// All paths: repo-relative FILES. No directories, no globs. './x' and '<root>/x' are normalised.
// model is a Claude tier and applies only to the claude lane.

const A = args ?? {}
const RIGOR = A.rigor === 'ultra' ? 'ultra' : 'standard'
const MAX_FIX = A.maxFix ?? 2
const MAX_INTEGRATE = A.maxIntegrate ?? 2
const LANES = { claude: undefined, codex: 'codex-driver', vodax: 'vodax-driver', agy: 'agy-driver' }

const norm = p => {
  let s = String(p ?? '').trim()
  if (A.root && s.startsWith(`${A.root}/`)) s = s.slice(A.root.length + 1)
  while (s.startsWith('./')) s = s.slice(2)
  return s
}
const badPath = s => !s || s.startsWith('/') || s.endsWith('/') || /[*?[\]]/.test(s) || s.split('/').includes('..')

function validate() {
  const errs = []
  if (typeof A.root !== 'string' || !A.root.startsWith('/')) errs.push('root must be an absolute path')
  if (!A.goal) errs.push('goal is required')
  if (!Array.isArray(A.units) || A.units.length === 0) errs.push('units must be a non-empty array')
  for (const [k, v] of [['maxFix', MAX_FIX], ['maxIntegrate', MAX_INTEGRATE]]) {
    if (!Number.isInteger(v) || v < 0) errs.push(`${k} must be an integer >= 0`)
  }
  const units = (A.units ?? []).map(u => ({ ...u, owns: (u.owns ?? []).map(norm), reads: (u.reads ?? []).map(norm) }))
  const contracts = (A.contracts ?? []).map(c => ({ ...c, file: norm(c.file) }))
  const owner = new Map()
  const keys = new Set()
  for (const u of units) {
    if (!u.key || keys.has(u.key) || String(u.key).startsWith('#')) errs.push(`unit key missing, duplicate or reserved: ${u.key}`)
    keys.add(u.key)
    if (u.owns.length === 0) errs.push(`unit ${u.key} owns no files`)
    if (!u.task) errs.push(`unit ${u.key} has no task`)
    if (u.lane && !(u.lane in LANES)) errs.push(`unit ${u.key} has unknown lane ${u.lane}`)
    for (const f of u.owns) {
      if (badPath(f)) errs.push(`unit ${u.key}: "${f}" is not a repo-relative file path`)
      if (owner.has(f)) errs.push(`ONE FILE = ONE OWNER violated: ${f} owned by ${owner.get(f)} and ${u.key}`)
      owner.set(f, u.key)
    }
  }
  const claimed = [...owner.keys(), ...contracts.map(c => c.file)]
  for (const p of claimed) {
    const nested = claimed.find(q => q.startsWith(`${p}/`))
    if (nested) errs.push(`"${p}" looks like a directory containing "${nested}" — own files, not directories`)
  }
  for (const c of contracts) {
    if (badPath(c.file)) errs.push(`contract "${c.file}" is not a repo-relative file path`)
    if (!c.spec) errs.push(`contract ${c.file} has no spec`)
    if (owner.has(c.file)) errs.push(`contract file ${c.file} is also owned by unit ${owner.get(c.file)}`)
  }
  if (errs.length) throw new Error(`orchestrate: bad plan\n- ${errs.join('\n- ')}`)
  return { units, contracts, owner }
}

const { units: UNITS, contracts: CONTRACTS, owner: OWNER } = validate()
const CONTRACT_FILES = CONTRACTS.map(c => c.file)
const BASELINE = (A.baselineDirty ?? []).map(norm)
const clip = (s, n) => String(s ?? '').slice(0, n)
const list = xs => (xs?.length ? xs.map(x => `  - ${x}`).join('\n') : '  (none)')
const laneOf = u => LANES[u.lane ?? 'claude']
const modelOf = u => (laneOf(u) ? undefined : u.model)

const SHARED = `REPO: ${A.root}
GOAL (whole run): ${A.goal}
${A.context ? `CONTEXT:\n${A.context}\n` : ''}`

// ---- schemas ---------------------------------------------------------------
const CONTRACTS_OUT = {
  type: 'object',
  properties: {
    files_written: { type: 'array', items: { type: 'string' } },
    frozen: { type: 'string', description: 'Exact exported signatures of every contract file, verbatim' },
    notes: { type: 'string' },
  },
  required: ['files_written', 'frozen', 'notes'],
}
const BUILD = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['done', 'blocked'] },
    files_changed: { type: 'array', items: { type: 'string' }, description: 'Repo-relative paths' },
    contract_gap: { type: 'string', description: 'Exact contract change needed; empty string if none' },
    checks_run: { type: 'string', description: 'Commands you ran and their real result' },
    notes: { type: 'string' },
  },
  required: ['status', 'files_changed', 'contract_gap', 'checks_run', 'notes'],
}
const REVIEW = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'issues'] },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
          file: { type: 'string', description: 'Repo-relative path the defect is in' },
          problem: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'file', 'problem', 'fix'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['verdict', 'issues', 'summary'],
}
const HASHES = {
  type: 'object',
  properties: {
    changed: { type: 'array', items: { type: 'string' } },
    hashes: {
      type: 'array',
      items: {
        type: 'object',
        properties: { path: { type: 'string' }, hash: { type: 'string' } },
        required: ['path', 'hash'],
      },
    },
  },
  required: ['changed', 'hashes'],
}
const CHECKS = {
  type: 'object',
  properties: {
    passed: { type: 'boolean' },
    failures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string', description: 'Repo-relative path the error is reported in, empty if none' },
          root_cause_file: { type: 'string', description: 'Repo-relative path that must change to fix it — may differ from file (tsconfig.json, package.json, a contract). Several failures can share one.' },
          command: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['file', 'root_cause_file', 'command', 'message'],
      },
    },
    output_tail: { type: 'string' },
  },
  required: ['passed', 'failures', 'output_tail'],
}
const CRITIC = {
  type: 'object',
  properties: { complete: { type: 'boolean' }, gaps: { type: 'array', items: { type: 'string' } } },
  required: ['complete', 'gaps'],
}

const gitSnapshot = (label, paths) => agent(`Run from ${A.root}, do nothing else:
  git -C ${A.root} status --porcelain --untracked-files=all
  git -C ${A.root} hash-object -- <each path below>
Return "changed" = every path from git status (repo-relative; for renames the new path).
Return "hashes" = one entry per path below; hash "missing" if the file does not exist.
${list(paths)}`, { label, phase: label === 'snapshot' ? 'Contracts' : 'Integrate', schema: HASHES, effort: 'low' })

// ---- phase 1: contracts ----------------------------------------------------
phase('Contracts')
let frozen = ''
if (CONTRACTS.length) {
  const c = await agent(`${SHARED}
You are the CONTRACT author. Parallel builders start the moment you finish and will code against exactly what you write. Nobody may change these files after you.

Write these contract files (create or edit):
${CONTRACTS.map(x => `### ${x.file}\n${x.spec}`).join('\n\n')}

Rules:
- Types, interfaces, function signatures, constants, API/DB shapes only. No implementation logic.
- Match the repo's existing style and import conventions. Read neighbouring files first.
- The files must parse. Run the narrowest syntax/type check that covers only these files if the toolchain allows it.
- Touch no other file.

Return every exported signature verbatim in "frozen" — builders will not re-read the files.`,
    { label: 'contracts', phase: 'Contracts', schema: CONTRACTS_OUT, effort: 'high' })
  if (!c) throw new Error('orchestrate: contract agent failed — nothing was built')
  frozen = clip(c.frozen, 16000)
  log(`contracts frozen: ${c.files_written.join(', ')}`)
} else {
  log('no contracts to write — units rely on args.reads')
}

// hashes of files nobody may edit from here on: contracts + pre-existing dirty files
const PROTECTED = [...CONTRACT_FILES, ...BASELINE]
const before = PROTECTED.length ? await gitSnapshot('snapshot', PROTECTED) : { hashes: [] }
if (!before) log('snapshot agent died — contract/baseline tamper check disabled')

// ---- phase 2: build --------------------------------------------------------
const buildPrompt = u => `${SHARED}
FROZEN CONTRACTS (import them; never edit, copy or redefine them):
${frozen || '(none this run)'}
${CONTRACT_FILES.length ? `Contract files: ${CONTRACT_FILES.join(', ')}` : ''}

YOU OWN — the ONLY files you may create or edit:
${list(u.owns)}

READ-ONLY references:
${list([...(A.reads ?? []), ...u.reads])}

YOUR TASK (unit "${u.key}"):
${u.task}

HARD RULES:
- Other agents are editing other files in this repo right now. Their files may be half-written. Never edit them, never "fix" them.
- Do NOT run whole-repo build, typecheck or lint — you will see their in-progress errors. ${u.check ? `Run only: ${u.check}` : 'Run only checks scoped to your own files.'}
- Do NOT install packages, edit manifests or lockfiles, or run repo-wide formatters.
- Contract missing something you need? Do NOT work around it (no local copy of the type, no any/unknown casts). Set status "blocked" and write the exact change in contract_gap.
- files_changed must list every file you touched, repo-relative, truthfully.`

const lensPrompt = (u, build, lens) => `${SHARED}
Adversarially review unit "${u.key}" in ${A.root}. Assume it is wrong until the code proves otherwise.
Owned files: ${u.owns.join(', ')}
Task: ${u.task}
Frozen contracts:
${frozen || '(none)'}
Builder report: ${clip(JSON.stringify(build), 2500)}

LENS: ${lens}

Read the real files. ${u.check ? `Run: ${u.check} and report the real result.` : ''} Do not run whole-repo checks — other units are mid-edit.
Report only defects worth an edit, each pinned to a repo-relative file. If the defect is really in a contract file, pin it to that contract file. No style preferences, no speculative abstractions. Sound → verdict "pass", empty issues.`

const LENSES = {
  standard: ['ALL: task fully done; contracts used exactly (no redefined or widened types, no casts around them); edits stay inside owned files; obvious runtime breakage; error paths handled.'],
  ultra: [
    'CONTRACT FIDELITY: every import/usage of the frozen contracts matches exactly; no redefined, widened or cast-around types; edits stay inside owned files.',
    'CORRECTNESS: task fully done; edge cases (empty, null, concurrent, partial failure); would it actually run; tests assert real behaviour.',
    'SECURITY + DATA SAFETY: input validation at trust boundaries, injection, authz gaps, secrets, destructive paths.',
  ],
}

async function review(u, build, round) {
  const votes = await parallel(LENSES[RIGOR].map((lens, i) => () =>
    agent(lensPrompt(u, build, lens), { label: `verify${round ? round + 1 : ''}:${u.key}${RIGOR === 'ultra' ? `:${i}` : ''}`, phase: 'Build', schema: REVIEW })))
  const ok = votes.filter(Boolean)
  const issues = ok.flatMap(v => v.issues.map(i => ({ ...i, file: norm(i.file) })))
  const complete = ok.length === LENSES[RIGOR].length
  return { verdict: !complete ? 'unreviewed' : issues.length ? 'issues' : 'pass', ran: ok.length, issues, summary: ok.map(v => v.summary).join(' | ') }
}

const fixPrompt = (u, issues) => `${buildPrompt(u)}

A reviewer found these defects in YOUR files. Fix every one, then re-run your scoped check:
${issues.map(i => `- [${i.severity}] ${i.file}: ${i.problem} → ${i.fix}`).join('\n')}`

// agent on the unit's lane; a dead external-lane agent retries once on claude
async function onLane(u, prompt, label, laneOverride) {
  const lane = laneOverride === undefined ? laneOf(u) : laneOverride
  const opts = { label, phase: 'Build', schema: BUILD, effort: u.effort }
  const first = await agent(prompt, { ...opts, agentType: lane || undefined, model: lane ? undefined : u.model })
  if (first || !lane) return first
  log(`${label} died on lane ${u.lane} — retrying on claude`)
  return agent(prompt, { ...opts, label: `${label}-retry` })
}

phase('Build')
const results = await pipeline(
  UNITS,
  u => onLane(u, buildPrompt(u), `build:${u.key}`),
  async (build, u) => {
    let b = build
    let rev = null
    let fixDied = false
    const touched = [...(build?.files_changed ?? [])]
    for (let round = 0; b && b.status === 'done'; round++) {
      rev = await review(u, b, round)
      const mine = rev.issues.filter(i => i.severity !== 'low' && u.owns.includes(i.file))
      if (!mine.length || round >= MAX_FIX) break
      // first fix stays on the unit's lane, later fixes escalate to claude
      const next = await onLane(u, fixPrompt(u, mine), `fix${round + 1}:${u.key}`, round === 0 ? laneOf(u) : null)
      if (!next) { fixDied = true; break }
      touched.push(...next.files_changed)
      b = next
    }
    return { unit: u, build: b, review: rev, fixDied, touched: touched.map(norm) }
  },
)

// ---- phase 3: integrate (barrier: needs every unit's result) --------------
phase('Integrate')
const done = results.filter(Boolean)
const died = UNITS.filter((u, i) => !results[i] || !results[i].build).map(u => u.key)
const gaps = done.filter(r => r.build?.status === 'blocked')
  .map(r => ({ unit: r.unit.key, gap: r.build.contract_gap || '(blocked, no gap given)' }))
if (died.length) log(`units lost: ${died.join(', ')}`)
if (gaps.length) log(`blocked on contracts: ${gaps.map(g => g.unit).join(', ')}`)

// reviewer issues outside the unit's own files: contract → gap, other unit → that owner's open issue
const openIssues = []
for (const r of done) {
  for (const i of (r.review?.issues ?? []).filter(x => x.severity !== 'low')) {
    if (r.unit.owns.includes(i.file)) openIssues.push({ unit: r.unit.key, ...i })
    else if (CONTRACT_FILES.includes(i.file)) gaps.push({ unit: r.unit.key, gap: `reviewer: ${i.file}: ${i.problem}` })
    else openIssues.push({ unit: OWNER.get(i.file) ?? '#unowned', found_by: r.unit.key, ...i })
  }
}
const unreviewed = done.filter(r => r.build?.status === 'done' && (!r.review || r.review.verdict === 'unreviewed')).map(r => r.unit.key)
if (unreviewed.length) log(`not fully reviewed (verifier died): ${unreviewed.join(', ')}`)

let lastChecks = null
let unrouted = []
const intFixes = []
const checksRequested = Boolean(A.checks?.length)
if (checksRequested) {
  for (let round = 0; round <= MAX_INTEGRATE; round++) {
    const c = await agent(`All parallel work in ${A.root} is finished. Run these commands in order from the repo root, even if one fails:
${A.checks.map(x => `  $ ${x}`).join('\n')}
Report every distinct failure with the repo-relative file it points at AND the root_cause_file that must change to fix it. When many errors share one cause (a missing tsconfig option, a manifest, a contract), give them all that same root_cause_file. Do NOT edit anything.`,
      { label: `checks${round + 1}`, phase: 'Integrate', schema: CHECKS })
    if (!c) { log(`checks${round + 1} agent died — result unverified`); break }
    lastChecks = c
    unrouted = []
    if (c.passed) break
    // route by root cause, not by where the error surfaced: one unowned cause must not fan out into N symptom patches
    const byOwner = new Map()
    for (const f of c.failures) {
      const cause = norm(f.root_cause_file || f.file)
      const key = OWNER.get(cause) ?? (CONTRACT_FILES.includes(cause) ? '#contract' : '#orphan')
      byOwner.set(key, [...(byOwner.get(key) ?? []), { ...f, root_cause_file: cause }])
    }
    unrouted = [...(byOwner.get('#contract') ?? []), ...(byOwner.get('#orphan') ?? [])]
    const fixable = UNITS.filter(u => byOwner.has(u.key))
    log(`checks round ${round + 1}: ${c.failures.length} failures → ${[...byOwner.keys()].join(', ')}`)
    if (!fixable.length || round === MAX_INTEGRATE) break
    const fixed = await parallel(fixable.map(u => () =>
      agent(`${buildPrompt(u)}

Integration checks now run on the whole repo. The root cause of these failures is in YOUR files. The error may surface in another unit's file — fix the cause in your file, never the surfacing file. You may now run the full checks to confirm, but still edit only your files:
${byOwner.get(u.key).map(f => `- cause: ${f.root_cause_file} (surfaced in ${f.file || 'n/a'}, ${f.command}): ${clip(f.message, 600)}`).join('\n')}`,
        { label: `int-fix${round + 1}:${u.key}`, phase: 'Integrate', schema: BUILD, model: modelOf(u) })))
    fixed.forEach((f, i) => {
      const u = fixable[i]
      intFixes.push({ round: round + 1, unit: u.key, status: f?.status ?? 'died', files_changed: (f?.files_changed ?? []).map(norm) })
      if (f?.status === 'blocked') gaps.push({ unit: u.key, gap: f.contract_gap || '(blocked in integration, no gap given)' })
    })
  }
} else {
  log('no checks provided — result is unverified')
}

let critic = null
if (RIGOR === 'ultra') {
  critic = await agent(`${SHARED}
Completeness critic. The goal above was split into units:
${UNITS.map(u => `${u.key} (${u.owns.join(', ')}): ${clip(u.task, 300)}`).join('\n')}
Read the repo. What part of the GOAL is not implemented by any unit — a missing wiring step, route registration, migration, export, test, or error path that fell between owners? Only real gaps.`,
    { label: 'completeness', phase: 'Integrate', schema: CRITIC, effort: 'high' })
  if (!critic) log('completeness critic died')
}

// ownership audit runs LAST so integration fixers are covered too
const after = await gitSnapshot('ownership-audit', PROTECTED)
const allowed = new Set([...OWNER.keys(), ...CONTRACT_FILES, ...BASELINE])
const stray = after ? after.changed.map(norm).filter(p => !allowed.has(p)) : ['(audit agent died — run git status yourself)']
const hashOf = (snap, p) => snap?.hashes.find(h => norm(h.path) === p)?.hash
const tampered = before && after ? PROTECTED.filter(p => hashOf(before, p) !== hashOf(after, p)) : []
const crossed = [
  ...done.flatMap(r => r.touched.filter(p => !r.unit.owns.includes(p)).map(p => ({ unit: r.unit.key, file: p, stage: 'build' }))),
  ...intFixes.flatMap(f => f.files_changed.filter(p => !UNITS.find(u => u.key === f.unit).owns.includes(p)).map(p => ({ unit: f.unit, file: p, stage: 'integrate' }))),
]
if (stray.length) log(`files changed outside every owner: ${stray.join(', ')}`)
if (tampered.length) log(`protected files changed during run: ${tampered.join(', ')}`)
if (crossed.length) log(`units touched files they do not own: ${crossed.map(c => `${c.unit}→${c.file}`).join(', ')}`)

const checksOk = checksRequested && lastChecks?.passed === true
const criticOk = RIGOR !== 'ultra' || (critic && critic.complete && critic.gaps.length === 0)
const status = died.length || gaps.length ? 'blocked'
  : (checksRequested && !checksOk) || stray.length || tampered.length || crossed.length || openIssues.length || unreviewed.length || !criticOk ? 'needs_work'
  : !checksRequested ? 'unverified'
  : 'green'

return {
  status,
  rigor: RIGOR,
  units: done.map(r => ({
    key: r.unit.key, owns: r.unit.owns, lane: r.unit.lane ?? 'claude', build: r.build?.status ?? 'died',
    verdict: !r.review ? 'skipped' : r.review.verdict === 'unreviewed' ? `unreviewed (${r.review.ran}/${LENSES[RIGOR].length} lenses)`
      : r.review.issues.some(i => i.severity !== 'low') ? 'issues' : 'pass',
    low_notes: (r.review?.issues ?? []).filter(i => i.severity === 'low').length,
    fix_died: r.fixDied,
    checks_run: clip(r.build?.checks_run, 400),
  })),
  died,
  contract_gaps: gaps,
  open_issues: openIssues,
  unreviewed,
  ownership: { stray_files: stray, protected_files_changed: tampered, cross_owner_edits: crossed },
  checks: !checksRequested ? 'not requested' : lastChecks ? { passed: lastChecks.passed, failures: lastChecks.failures, tail: clip(lastChecks.output_tail, 2000) } : 'agent died — unverified',
  unrouted_failures: unrouted,
  integration_fixes: intFixes,
  completeness: RIGOR === 'ultra' ? (critic ?? 'critic died') : 'n/a',
}
