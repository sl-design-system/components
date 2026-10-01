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
    // `--pretty false` is load-bearing, not tidiness. tsc colourises its output even when stdout
    // is not a terminal, and the pretty format is `file:line:col - error TS…` where the plain one
    // is `file(line,col): error TS…`. The parser below reads the plain form, so without this flag
    // it matches nothing, every run reports zero errors, and the gate returns `clean`
    // unconditionally — which is exactly what it did for this entire batch until a run caught it.
    ({ stdout } = await run('npx', ['tsc', '-p', PROJECT, '--noEmit', '--pretty', 'false'], {
      maxBuffer: 32 * 1024 * 1024
    }));
  } catch (error) {
    stdout = error.stdout ?? '';
  }

  // tsc leaves an incremental cache behind even under --noEmit; it is gitignored but the tree
  // should come back the way it was found.
  rmSync('examples/lit/tsconfig.tsbuildinfo', { force: true });

  const lines = stdout.split('\n'),
    parsed = lines.filter(line => /\(\d+,\d+\): error TS\d+/.test(line)).map(line => line.trim());

  // If tsc clearly reported errors and the parser extracted none, the parser is broken — and a
  // broken parser must fail loudly rather than return an empty list that reads as a clean tree.
  if (!parsed.length && /error TS\d+/.test(stdout)) {
    console.error('typecheck parse failure: tsc reported errors this parser could not read.');
    console.error(stdout.slice(0, 600));
    exit(3);
  }

  return parsed;
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
  // While any file in the program has a *syntax* error, tsc stops emitting semantic diagnostics
  // program-wide — so the baseline errors disappear and `vanished` fills up with them. Its README
  // reads that as "somebody edited shared code", and in a parallel batch one sibling's half-written
  // file is enough to trigger it. A run nearly acted on that. The signal is only meaningful once
  // the program parses.
  syntaxErrors = errors.filter(line => /error TS1\d{3}:/.test(line)),
  diagnosticsSuppressed = syntaxErrors.length > 0,
  vanished = diagnosticsSuppressed ? [] : [...baseline].filter(line => !errors.includes(line));

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
  // Stated rather than implied: with the program unparseable, "no baseline errors" means nothing
  // was checked, not that nothing is wrong.
  ...(diagnosticsSuppressed
    ? {
        semanticDiagnosticsSuppressed: true,
        syntaxErrorsBlockingThem: syntaxErrors.slice(0, 5)
      }
    : {}),
  verdict: inScope.length === 0 && regressions.length === 0 ? 'clean' : 'failed'
};

console.log(JSON.stringify(report, null, 2));

if (diagnosticsSuppressed)
  console.error(
    `\nNote: ${syntaxErrors.length} syntax error(s) suppress every semantic diagnostic in the program. ` +
      'Baseline comparison is meaningless until the program parses.'
  );
else if (vanished.length)
  console.error(
    `\nNote: ${vanished.length} baseline error(s) no longer appear. Shared code changed — confirm that was intended and re-record.`
  );

exit(report.verdict === 'clean' ? 0 : 1);
