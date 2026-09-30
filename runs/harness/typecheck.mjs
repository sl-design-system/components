/**
 * The Stage 3 type-check gate, made satisfiable.
 *
 * The pipeline defines the gate as `tsc` exit 0. In this repository that is unreachable: two
 * pre-existing errors in `packages/components/grid/src/grid.ts` — committed upstream, unrelated to
 * anything generated — fail every run before it starts. A gate nobody can pass is not a gate; it is
 * an invitation to work around it, and one run already did, with a `.d.ts` stub that turned the
 * check green while the problem it existed to catch was still there.
 *
 * So the gate asks the question it actually meant: **did the generated code introduce an error?**
 *
 * - Any error inside `--scope` fails, always;
 * - Any error outside it fails too, unless it is in the recorded baseline — generated code is
 *   perfectly capable of breaking another package, and that must not slip through;
 * - A baseline error that has disappeared is reported, not tolerated silently, because a shrunk
 *   baseline means somebody changed shared code.
 *
 * Usage: node runs/harness/typecheck.mjs --scope examples/lit/src/_runs/<case-slug> node
 * runs/harness/typecheck.mjs --record-baseline # supervisor only, on a clean tree
 */
import { execFile } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { argv, exit } from 'node:process';
import { promisify } from 'node:util';

const run = promisify(execFile),
  BASELINE = 'runs/harness/typecheck-baseline.json',
  PROJECT = 'examples/lit/tsconfig.json',
  arg = name => {
    const i = argv.indexOf(`--${name}`);
    return i === -1 ? undefined : argv[i + 1];
  };

const typecheck = async () => {
  let stdout = '';

  try {
    ({ stdout } = await run('npx', ['tsc', '-p', PROJECT, '--noEmit'], {
      maxBuffer: 32 * 1024 * 1024
    }));
  } catch (error) {
    stdout = error.stdout ?? '';
  }

  // tsc leaves an incremental cache behind even under --noEmit; it is gitignored but the tree
  // should come back the way it was found.
  rmSync('examples/lit/tsconfig.tsbuildinfo', { force: true });

  return stdout
    .split('\n')
    .filter(line => /\(\d+,\d+\): error TS\d+/.test(line))
    .map(line => line.trim());
};

const errors = await typecheck();

if (argv.includes('--record-baseline')) {
  // A baseline is what the repository owes before the batch touches it. Recording a generated
  // error into it would make the gate permanently blind to that error.
  const generated = errors.filter(line => line.startsWith('examples/lit/src/_runs/'));

  if (generated.length) {
    console.error(
      `refusing to record: ${generated.length} error(s) are in generated runs:\n${generated.join('\n')}`
    );
    exit(2);
  }

  writeFileSync(BASELINE, `${JSON.stringify({ project: PROJECT, errors }, null, 2)}\n`);
  console.log(`recorded ${errors.length} baseline error(s) to ${BASELINE}`);
  exit(0);
}

const RUNS = 'examples/lit/src/_runs/';

const scope = arg('scope');

if (!scope) {
  console.error('usage: typecheck.mjs --scope <path> | --record-baseline');
  exit(2);
}

const baseline = existsSync(BASELINE)
    ? new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).errors)
    : new Set(),
  inScope = errors.filter(line => line.startsWith(scope)),
  // Every run shares one tsconfig and the batch runs them in parallel, so without this a sibling
  // run's half-written component counts as a regression here and fails a gate on code this run
  // never touched. Runs failing each other was observed, not hypothesised. Errors belonging to
  // another run's directory are attributed to that run and reported, never charged to this one.
  otherRuns = errors.filter(line => line.startsWith(RUNS) && !line.startsWith(scope)),
  outOfScope = errors.filter(line => !line.startsWith(scope) && !line.startsWith(RUNS)),
  regressions = outOfScope.filter(line => !baseline.has(line)),
  vanished = [...baseline].filter(line => !errors.includes(line));

const report = {
  scope,
  totalErrors: errors.length,
  inScope,
  // Not this run's responsibility and not its failure; listed so a run never reports a clean
  // tree while the shared project is broken in a sibling's directory.
  errorsInOtherRuns: otherRuns,
  regressionsOutsideScope: regressions,
  baselineErrorsStillPresent: outOfScope.length - regressions.length,
  baselineErrorsNoLongerReported: vanished,
  verdict: inScope.length === 0 && regressions.length === 0 ? 'clean' : 'failed'
};

console.log(JSON.stringify(report, null, 2));

if (vanished.length)
  console.error(
    `\nNote: ${vanished.length} baseline error(s) no longer appear. Shared code changed — confirm that was intended and re-record.`
  );

exit(report.verdict === 'clean' ? 0 : 1);
