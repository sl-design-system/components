/**
 * Converts a run's existing Figma captures into the layout `CAPTURE-PROTOCOL.md` defines.
 *
 * It fetches nothing. Four runs stored the same kind of output four different ways — `jsx` fences,
 * `tsx` fences, unfenced code pasted into markdown, and prose — and six runs hold data a reader
 * built for the job could not read. That is a storage problem, not a collection problem, and it is
 * fixable for free.
 *
 * What it will not do is invent. A run that captured nothing comes out with nothing; the index says
 * so, and whether to re-fetch is a separate decision with a separate date on it.
 *
 * Usage: node runs/harness/normalise-captures.mjs --run runs/2026-10-01-<slug> [--write] node
 * runs/harness/normalise-captures.mjs --all [--write]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { argv, exit } from 'node:process';

const arg = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

const write = argv.includes('--write');

/**
 * Every capture file is `.txt`, whatever it holds, and the index's `call` says how to read it.
 *
 * A raw capture must not carry a source extension. Named `.jsx`, the repository's own formatter
 * claimed these files and failed on them — they are Figma's output, not code anybody maintains, and
 * one of them even has a prose warning appended mid-file. It is the same fault as
 * `figma-metadata.json` holding XML, inverted: a name that invites the wrong tool.
 */

/** `25124:57173` → `25124-57173`, because a colon is awkward in a filename. */
const safe = nodeId => nodeId.replace(/:/g, '-');

/**
 * Pull the code out of however the run happened to store it. Fenced in any language, or unfenced
 * with markdown prose above it — in which case everything before the first module-level construct
 * is commentary and must not reach a parser.
 */
const extractBlocks = text => {
  const fenced = [
    ...text.matchAll(/```(?:jsx|tsx|ts|js|javascript|typescript)?\n([\s\S]*?)```/g)
  ].map(m => m[1]);

  if (fenced.length) return fenced;
  if (!/className=|data-node-id/.test(text)) return [];

  const start = text.search(/^(?:import |const |let |function |export |type |interface )/m);

  return start === -1 ? [] : [text.slice(start)];
};

/** The node a block describes: its own outermost `data-node-id`, else the heading's. */
const nodeIdFor = (block, text) =>
  block.match(/data-node-id="([\d:]+)"/)?.[1] ??
  text.match(/^#\s*(.+)$/m)?.[1].match(/node\s+([\d:]+)/)?.[1];

const labelFor = text => text.match(/^#\s*(.+)$/m)?.[1];

const normalise = run => {
  const captures = [],
    files = readdirSync(run),
    stamp = statSync(run).mtime.toISOString(),
    emit = (dir, nodeId, extension, body, call, label, index) => {
      const name = `${safe(nodeId ?? `unknown-${index}`)}${extension}`,
        relative = `${dir}/${name}`;

      if (write) {
        mkdirSync(join(run, 'captures', dir), { recursive: true });
        writeFileSync(join(run, 'captures', relative), body);
      }

      captures.push({
        call,
        // Which part of the response this file holds. A design-context response has a code block
        // and advisory blocks; a reader that wants one must not be handed the other.
        part: 'code',
        nodeId: nodeId ?? null,
        label: label ?? null,
        file: `captures/${relative}`,
        bytes: body.length,
        capturedAt: stamp,
        // The run's own files are what it saw; this step only moves bytes.
        truncated: /\[(?:table subtree )?omitted\]|truncated for brevity/i.test(body)
      });
    };

  // Files in the order they were written: the base name, then `-part2`, `-part3`. An alphabetical
  // sort puts `-part2` before `.md`, because a hyphen precedes a dot, and silently reverses them.
  const contextFiles = files
    .filter(f => /^figma-design-context.*\.md$/.test(f))
    .map(name => ({ name, part: Number(name.match(/-part(\d+)\.md$/)?.[1] ?? 1) }))
    .sort((a, b) => a.part - b.part)
    .map(entry => entry.name);

  // One run split a single response across three files **mid-syntax**: parts two and three begin
  // with `<p className=` and cannot be parsed alone. An earlier version of this script concatenated
  // such files and guessed where the boundaries were — which recovered one run and broke another.
  //
  // So it records the fact instead of acting on it. Each file becomes its own capture, and one
  // that does not open a module is marked `continuationOf` the previous. A consumer joins them if
  // it needs to and knows exactly which, rather than inheriting a guess made here.
  let previous = null;

  for (const name of contextFiles) {
    const text = readFileSync(join(run, name), 'utf8'),
      opensAModule = /^\s*(?:#|import |const |let |function |export |type |interface |```)/.test(
        text
      ),
      blocks = extractBlocks(text);

    if (!opensAModule && previous) {
      const relative = `design-context/${safe(previous)}.part${captures.length}.txt`;

      if (write) writeFileSync(join(run, 'captures', relative), text);

      captures.push({
        call: 'get_design_context',
        nodeId: previous,
        label: `${name} (continuation)`,
        file: `captures/${relative}`,
        bytes: text.length,
        capturedAt: stamp,
        truncated: false,
        continuationOf: previous
      });

      continue;
    }

    blocks.forEach((block, index) => {
      const nodeId = nodeIdFor(block, text);

      previous = nodeId ?? previous;
      emit(
        'design-context',
        nodeId,
        '.txt',
        block,
        'get_design_context',
        labelFor(text) ?? name,
        index
      );
    });
  }

  for (const [pattern, dir, extension, call] of [
    [/^figma-metadata\.(txt|json|xml)$/, 'metadata', '.txt', 'get_metadata'],
    [/^figma-variable-defs.*\.json$/, 'variables', '.txt', 'get_variable_defs'],
    [/^figma-code-connect-map.*\.(json|txt|md)$/, 'code-connect', '.txt', 'get_code_connect_map']
  ])
    for (const name of files.filter(f => pattern.test(f))) {
      const body = readFileSync(join(run, name), 'utf8'),
        rootNode = body.match(/id="([\d:]+)"/)?.[1] ?? body.match(/"([\d:]+)"/)?.[1];

      emit(dir, rootNode, extension, body, call, name, 0);
    }

  if (existsSync(join(run, 'screenshot.png'))) {
    const bytes = statSync(join(run, 'screenshot.png')).size;

    captures.push({
      call: 'get_screenshot',
      nodeId: null,
      label: 'reference',
      file: 'screenshot.png',
      bytes,
      capturedAt: stamp,
      truncated: false,
      // Recorded, never corrected — see CAPTURE-PROTOCOL.md.
      note: 'reference integrity not asserted at capture time; see batch-findings on get_screenshot distortions'
    });
  }

  const metadata = files.find(f => /^figma-metadata\./.test(f)),
    rootNodeId = metadata
      ? readFileSync(join(run, metadata), 'utf8').match(/id="([\d:]+)"/)?.[1]
      : undefined;

  const index = {
    schemaVersion: 1,
    run: basename(run).replace(/^\d{4}-\d{2}-\d{2}-/, ''),
    figma: { rootNodeId: rootNodeId ?? null },
    normalisedFrom: "the run's own files; nothing was fetched",
    captures
  };

  if (write) {
    mkdirSync(join(run, 'captures'), { recursive: true });
    writeFileSync(join(run, 'captures', 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
  }

  return index;
};

const runs = argv.includes('--all')
  ? readdirSync('runs')
      .filter(name => /^\d{4}-\d{2}-\d{2}-/.test(name))
      .map(name => join('runs', name))
  : [arg('run')].filter(Boolean);

if (!runs.length) {
  console.error('usage: normalise-captures.mjs --run <dir> | --all   [--write]');
  exit(2);
}

const summary = runs.map(run => {
  const index = normalise(run),
    byCall = {};

  for (const capture of index.captures) byCall[capture.call] = (byCall[capture.call] ?? 0) + 1;

  return { run: index.run, captures: index.captures.length, byCall };
});

console.log(JSON.stringify({ wrote: write, runs: summary }, null, 2));
