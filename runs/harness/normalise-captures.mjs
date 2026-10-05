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
 * runs/harness/normalise-captures.mjs --all [--write] [--out-dir <name>]
 *
 * `--out-dir` writes a **new versioned artifact** rather than replacing `captures/`. The nineteen
 * indexes were already rebuilt once from the runs' own markdown — every `capturedAt` inside 64 ms —
 * and overwriting them would add a second undisclosed layer over the first.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { argv, exit } from 'node:process';
import { z } from 'zod';

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

const write = argv.includes('--write');

/** Never `captures` by default when re-normalising: see the note on versioned output above. */
const outDir = arg('out-dir') ?? 'captures';

/**
 * Every capture file is `.txt`, whatever it holds, and the index's `call` says how to read it.
 *
 * A raw capture must not carry a source extension. Named `.jsx`, the repository's own formatter
 * claimed these files and failed on them — they are Figma's output, not code anybody maintains, and
 * one of them even has a prose warning appended mid-file. It is the same fault as
 * `figma-metadata.json` holding XML, inverted: a name that invites the wrong tool.
 */

/** `25124:57173` → `25124-57173`, because a colon is awkward in a filename. */
/** @param {string} nodeId */
const safe = nodeId => nodeId.replace(/:/g, '-');

/**
 * The five advisory blocks `get_design_context` appends to the code, in the order the corpus shows
 * them. Figma sends them as discrete content blocks and they arrive **with no separator at all** —
 * `…instructs you to do so.Node ids have been added…` is the real byte sequence — so the only thing
 * that marks a boundary is the sentence each one opens with.
 *
 * The sentinels were read off the captures, not off documentation, because none exists.
 */
export const ADVISORIES = [
  {
    kind: 'stack-conversion',
    sentinel: 'SUPER CRITICAL: The generated React+Tailwind code MUST be converted'
  },
  { kind: 'node-ids', sentinel: 'Node ids have been added to the code as data attributes' },
  { kind: 'styles', sentinel: 'These styles are contained in the design:' },
  {
    kind: 'component-descriptions',
    sentinel: 'Component descriptions: The following components have usage descriptions'
  },
  { kind: 'assets', sentinel: 'Images and SVGs will be stored as constants' }
];

/** The five advisory kinds, derived from {@link ADVISORIES} so the two cannot disagree. */
export const ADVISORY_KINDS = /** @type {[string, ...string[]]} */ (
  ADVISORIES.map(advisory => advisory.kind)
);

/**
 * The index this script writes, validated **where it is produced** rather than where it is read.
 *
 * A reader cannot tell a malformed index from a thin one: `render-design.mjs` skipped entries it
 * could not use and reported a smaller number, which is how six runs looked empty when they were
 * only stored differently. Catching the shape here puts the error next to the code that caused it.
 *
 * `render-design.mjs` keeps its own, deliberately narrower, read-side schema: it validates only the
 * fields it dereferences, so an older or hand-written index still reads. The two are pinned
 * together by a test asserting this script's output satisfies that one — which is the only thing
 * that stops them drifting apart.
 */
export const CaptureSchema = z
  .object({
    call: z.string().min(1),
    // Absent on the reference entry — `get_screenshot` is neither code nor advisory, and carries
    // a `note` instead. A reader that wants code therefore has to default a missing `part`, which
    // is a defaulting rule the producer could have removed; left as it is because nineteen
    // committed indexes encode it, and changing it is a change to the artifact, not to the check.
    part: z.enum(['code', 'advisory']).optional(),
    // Set on the advisory entries only, naming which of the five sentinels opened the block.
    advisory: z.enum(ADVISORY_KINDS).optional(),
    // Set on a `-part2`/`-part3` continuation, naming the node the first part rooted at.
    continuationOf: z.string().min(1).optional(),
    nodeId: z.string().nullable(),
    label: z.string().nullable(),
    file: z.string().min(1),
    bytes: z.number().int().nonnegative(),
    capturedAt: z.iso.datetime(),
    truncated: z.boolean(),
    note: z.string().optional()
  })
  // Strict on purpose. A producer schema that tolerates unknown keys cannot tell a new field from
  // a typo, and a typo here is a field every reader silently never sees.
  .strict();

export const CaptureIndexSchema = z.object({
  schemaVersion: z.literal(1),
  run: z.string().min(1),
  figma: z.object({ rootNodeId: z.string().nullable() }),
  normalisedFrom: z.string().min(1),
  captures: z.array(CaptureSchema)
});

/**
 * Check an index against {@link CaptureIndexSchema} and throw naming the run and the field.
 *
 * Separate from `normalise` so it can be tested with a malformed index, which a correct producer
 * cannot be made to emit. A check that only ever runs on good input has not been tested.
 *
 * @param {unknown} index
 * @param {string} run
 */
export const validateIndex = (index, run) => {
  const validated = CaptureIndexSchema.safeParse(index);

  if (!validated.success) {
    const [issue] = validated.error.issues;

    throw new Error(
      `${run}: the index this run produced is malformed — ${issue.message} at ` +
        `${issue.path.join('.') || '(root)'}`
    );
  }

  return validated.data;
};

/** Every sentinel occurrence in a stretch of text, earliest first. One response repeats none. */
/**
 * @typedef {{ part: 'code' | 'advisory'; kind?: string; text: string }} Block
 *
 * @typedef {{
 *   call: string;
 *   part?: string;
 *   advisory?: string;
 *   nodeId: string | null;
 *   label: string | null;
 *   file: string;
 *   bytes: number;
 *   capturedAt: string;
 *   truncated: boolean;
 *   continuationOf?: string;
 *   note?: string;
 * }} Capture
 * @param {string} text
 * @returns {{ kind: string; at: number }[]}
 */
const advisoryHits = text => {
  const hits = [];

  for (const { kind, sentinel } of ADVISORIES) {
    let at = text.indexOf(sentinel);

    while (at !== -1) {
      hits.push({ kind, at });
      at = text.indexOf(sentinel, at + 1);
    }
  }

  return hits.sort((a, b) => a.at - b.at);
};

/**
 * Advisories inside a stretch of prose: each runs from its own sentinel to the next one, or to the
 * end. Whatever precedes the first sentinel is not an advisory and is left where it was.
 */
/** @param {string} text @returns {Block[]} */
const splitAdvisories = text =>
  advisoryHits(text).map(({ kind, at }, index, hits) => ({
    part: 'advisory',
    kind,
    text: text.slice(at, hits[index + 1]?.at)
  }));

/**
 * Cut the advisories off the end of a stretch of code. The code is whatever precedes the first
 * sentinel — never rewritten, only cut short — so a parser receives the same bytes it would have
 * received if Figma had sent a separator.
 */
/** @param {string} text @returns {{ code: string, advisories: Block[] }} */
export const splitAdvisoryTail = text => {
  const hits = advisoryHits(text);

  return {
    code: hits.length ? text.slice(0, hits[0].at) : text,
    advisories: splitAdvisories(text)
  };
};

/**
 * Pull the parts out of however the run happened to store it, as `{ part, kind, text }` entries.
 *
 * Measured across all nineteen runs: **no sentinel ever falls inside a fence.** So a fenced
 * response already keeps its code clean and merely discards the advisories — a real loss, since for
 * one design they carried itslearning's own usage rules with styleguide URLs — while an unfenced
 * one concatenates them onto the code, and that is what a TSX loader rejects.
 *
 * Both shapes are handled the same way: the code is what precedes the first sentinel, and each
 * advisory is its own entry. The code block's bytes are never rewritten, only cut short.
 */
/** @param {string} text @returns {Block[]} */
export const extractBlocks = text => {
  const fences = [...text.matchAll(/```(?:jsx|tsx|ts|js|javascript|typescript)?\n([\s\S]*?)```/g)];

  if (fences.length) {
    /** @type {Block[]} */
    const blocks = [];
    let cursor = 0;

    for (const fence of fences) {
      blocks.push(...splitAdvisories(text.slice(cursor, fence.index)), {
        part: 'code',
        text: fence[1]
      });
      cursor = fence.index + fence[0].length;
    }

    return [...blocks, ...splitAdvisories(text.slice(cursor))];
  }

  if (!/className=|data-node-id/.test(text)) return [];

  const start = text.search(/^(?:import |const |let |function |export |type |interface )/m);

  if (start === -1) return [];

  // One run's advisories arrived **ahead** of the code rather than behind it, and everything
  // before the first module construct was being discarded as commentary. It is commentary — but
  // two of the five blocks were in it.
  const { code, advisories } = splitAdvisoryTail(text.slice(start));

  return [...splitAdvisories(text.slice(0, start)), { part: 'code', text: code }, ...advisories];
};

/** The node a block describes: its own outermost `data-node-id`, else the heading's. */
/** @param {string} block @param {string} text @returns {string | undefined} */
const nodeIdFor = (block, text) =>
  block.match(/data-node-id="([\d:]+)"/)?.[1] ??
  text.match(/^#\s*(.+)$/m)?.[1].match(/node\s+([\d:]+)/)?.[1];

/** @param {string} text */
const labelFor = text => text.match(/^#\s*(.+)$/m)?.[1];

/** @param {string} run */
export const normalise = run => {
  /** @type {Capture[]} */
  const captures = [];
  const files = readdirSync(run);
  const stamp = statSync(run).mtime.toISOString();
  /**
   * Paths already written in this run, so a second response rooting at one node cannot silently
   * replace the first on disk while both stay in the index.
   */
  const taken = new Set();

  /**
   * @param {string} dir
   * @param {string | null | undefined} nodeId
   * @param {string} extension
   * @param {string} body
   * @param {string} call
   * @param {string | null} label
   * @param {number} index
   * @param {'code' | 'advisory'} [part]
   * @param {string} [kind]
   */
  const emit = (dir, nodeId, extension, body, call, label, index, part = 'code', kind) => {
    const stem = `${safe(nodeId ?? `unknown-${index}`)}${kind ? `.advisory.${kind}` : ''}`;
    let relative = `${dir}/${stem}${extension}`;

    // Two responses in one file can root at the same node. Before this, the second silently
    // replaced the first on disk while both stayed in the index, pointing at the same bytes.
    for (let n = 2; taken.has(relative); n++) relative = `${dir}/${stem}.${n}${extension}`;
    taken.add(relative);

    if (write) {
      mkdirSync(join(run, outDir, dir), { recursive: true });
      writeFileSync(join(run, outDir, relative), body);
    }

    captures.push({
      call,
      // Which part of the response this file holds. A design-context response has a code block
      // and advisory blocks; a reader that wants one must not be handed the other.
      part,
      ...(kind ? { advisory: kind } : {}),
      nodeId: nodeId ?? null,
      label: label ?? null,
      file: `${outDir}/${relative}`,
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
  /** @type {string | null} */
  let previous = null;

  for (const name of contextFiles) {
    const text = readFileSync(join(run, name), 'utf8'),
      opensAModule = /^\s*(?:#|import |const |let |function |export |type |interface |```)/.test(
        text
      ),
      blocks = extractBlocks(text);

    if (!opensAModule && previous) {
      // The advisories ride on the **last** of a split response's parts, which never reaches
      // `extractBlocks`. Repairing only the fenced and unfenced paths left two runs untouched.
      const { code, advisories } = splitAdvisoryTail(text),
        /** @type {string} */
        relative = `design-context/${safe(previous ?? 'unknown')}.part${captures.length}.txt`;

      if (write) {
        mkdirSync(join(run, outDir, 'design-context'), { recursive: true });
        writeFileSync(join(run, outDir, relative), code);
      }

      captures.push({
        call: 'get_design_context',
        part: 'code',
        nodeId: previous,
        label: `${name} (continuation)`,
        file: `${outDir}/${relative}`,
        bytes: code.length,
        capturedAt: stamp,
        truncated: false,
        continuationOf: previous
      });

      advisories.forEach((advisory, index) =>
        emit(
          'design-context',
          previous,
          '.txt',
          advisory.text,
          'get_design_context',
          `${name} (continuation)`,
          index,
          'advisory',
          advisory.kind
        )
      );

      continue;
    }

    // An advisory names no node of its own — it describes the code block it was appended to, so
    // it takes that block's id. Keyed on its own text it would land under `unknown-N` and a
    // reader could not tell which response it belongs to.
    /** @type {string | null} */
    let codeNode = null;

    blocks.forEach((block, index) => {
      const nodeId = block.part === 'code' ? nodeIdFor(block.text, text) : codeNode;

      if (block.part === 'code') codeNode = nodeId ?? null;
      previous = nodeId ?? previous;
      emit(
        'design-context',
        nodeId,
        '.txt',
        block.text,
        'get_design_context',
        labelFor(text) ?? name,
        index,
        block.part,
        block.kind
      );
    });
  }

  /** @type {[RegExp, string, string, string][]} */
  const others = [
    [/^figma-metadata\.(txt|json|xml)$/, 'metadata', '.txt', 'get_metadata'],
    [/^figma-variable-defs.*\.json$/, 'variables', '.txt', 'get_variable_defs'],
    [/^figma-code-connect-map.*\.(json|txt|md)$/, 'code-connect', '.txt', 'get_code_connect_map']
  ];

  for (const [pattern, dir, extension, call] of others)
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

  // Validated before it is written, and before it is returned to the summary: an index nobody can
  // read is worse than a run that produced none, because it counts.
  validateIndex(index, run);

  if (write) {
    mkdirSync(join(run, outDir), { recursive: true });
    writeFileSync(join(run, outDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
  }

  return index;
};

// Only when run, never when imported: the test loads `extractBlocks` from this module.
if (import.meta.main) {
  const runs = argv.includes('--all')
    ? readdirSync('runs')
        .filter(name => /^\d{4}-\d{2}-\d{2}-/.test(name))
        .map(name => join('runs', name))
    : [arg('run')].filter(Boolean);

  if (!runs.length) {
    console.error(
      'usage: normalise-captures.mjs --run <dir> | --all   [--write] [--out-dir <name>]'
    );
    exit(2);
  }

  const summary = runs.map(run => {
    const index = normalise(String(run));
    /** @type {Record<string, number>} */
    const byCall = {};

    for (const capture of index.captures) byCall[capture.call] = (byCall[capture.call] ?? 0) + 1;

    return { run: index.run, captures: index.captures.length, byCall };
  });

  console.log(JSON.stringify({ wrote: write, runs: summary }, null, 2));
}
