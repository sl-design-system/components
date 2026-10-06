/**
 * Capture what Figma actually returns, and five checks that can tell a capture from a summary.
 *
 * Measured across the nineteen corpus runs on 2026-10-06: only **three** carry verbatim metadata,
 * Code Connect and design context together. The agents described what they saw instead of recording
 * what they received, and the instruction to "preserve the response verbatim" existed the whole
 * time. The remedy is a script, because an agent that _may_ summarise sometimes will.
 *
 * **There is no denominator.** `get_metadata` stops at instance boundaries, so the universe is
 * discovered rather than declared and a completeness ratio would be invented. What replaces it is
 * five independently falsifiable checks, each with a control that shows it going red:
 *
 * | #   | Check                              | Red when                                                            |
 * | --- | ---------------------------------- | ------------------------------------------------------------------- |
 * | 1   | frontier closure                   | a node entered and never left, or was called captured and is absent |
 * | 2   | nothing declared itself incomplete | a response reported its own truncation                              |
 * | 3   | cross-tool reconciliation          | a tool names a node the capture does not hold                       |
 * | 4   | the geometry witness               | a box lies outside the frame, or coverage fell against a baseline   |
 * | 5   | re-run determinism                 | two runs stored different bytes for the same call                   |
 *
 * **What none of them catches**, said plainly so the five are not read as a guarantee: a node Figma
 * never mentions in any tool's output and which covers no visible pixels is invisible to all five.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { argv, env, exit } from 'node:process';
import { join } from 'node:path';
import { z } from 'zod';

import { REST_BASE, TOKEN_HEADER, imagesUrl, nodesUrl, openRest, versionsUrl } from './rest.mjs';
// `resolveFrame` is the harness's reader for a metadata capture's root, and it already survives
// the six shapes the corpus actually contains — a prose header, a comment header, an MCP
// envelope with every quote escaped, a `<symbol` root. Importing it across the layer is the
// cheaper mistake: writing a third reader of Figma metadata here is how the two that already
// exist drifted apart once.
import { resolveFrame } from './render-design.mjs';

export const CAPTURE_SCHEMA_VERSION = 1;

/** `download_assets` returns at most twenty raw images and twenty SVGs, and says when it did. */
export const ASSET_CAP = 20;

/** Every way a node may leave the frontier. Anything else is a bug in the walk, not a gap. */
export const DISPOSITIONS = new Set([
  'captured',
  'resolved',
  'descended',
  'nested',
  'hidden',
  'excluded',
  'failed'
]);

// ---------------------------------------------------------------------------------------------
// The target list — which file holds which design

/**
 * A design link carries both halves of the identity the corpus is missing. `A-NOJIRA-figma-
 * metadata-contract` **F10** found no file key, no file name and no `lastModified` anywhere in the
 * nineteen capture trees; the links in the run notes are where the operator left them.
 */
const LINK = /figma\.com\/(?:design|file)\/([A-Za-z0-9]{10,})[^\s)"'`\]]*?node-id=(\d+[:-]\d+)/g;

/**
 * @param {string} text
 * @returns {{ fileKey: string; nodeId: string }[]}
 */
export const figmaLinks = text =>
  [...text.matchAll(LINK)].map(([, fileKey, nodeId]) => ({
    fileKey,
    nodeId: nodeId.replace('-', ':')
  }));

/**
 * The root node id of a run, and where it came from.
 *
 * `T-NOJIRA-figma-ingestion-06` reported a5-etsl-metadata-usage-widget as unidentifiable because
 * `captures/index.json` records `rootNodeId: null` for it — the one run of nineteen where that
 * field is empty. **The root was in the run the whole time**, as `<frame id="17214:103584"
 * name="Metadata usage widget">` at the top of its own metadata capture, and a link already in this
 * repository named that node in a file the token reaches.
 *
 * The two sources are not equal evidence, so which one answered travels with the target: an index
 * that records the root was written by the operator about the design, and a capture's root element
 * is the design as the server described it.
 *
 * @param {{
 *   indexRoot?: string | null;
 *   metadata?: string | null;
 *   resolve?: typeof resolveFrame;
 * }} input
 * @returns {{ rootNodeId: string | null; rootSource: 'index' | 'capture' | 'none' }}
 */
export const rootOfRun = ({ indexRoot, metadata, resolve = resolveFrame }) => {
  if (indexRoot) return { rootNodeId: indexRoot, rootSource: 'index' };

  if (metadata) {
    const { frame, declared } = resolve(metadata);

    // `declared: false` means `resolveFrame` fabricated a 1440x1024 default. Today that frame
    // carries no id, so this guard is belt and braces — the reader is injectable precisely so
    // the belt can be shown holding, rather than trusted because of how a neighbour behaves.
    if (declared && frame.id) return { rootNodeId: frame.id, rootSource: 'capture' };
  }

  return { rootNodeId: null, rootSource: 'none' };
};

/**
 * Whether a budget has been reached, and which one.
 *
 * Step 8 of `T-NOJIRA-figma-ingestion-06` asked for this and it was not delivered, so that task's
 * criterion — _a design that could not be captured whole says so, with which budget or cap stopped
 * it_ — passed with nothing able to stop anything. a2-nsp-class-overview pulled **28 MB in one
 * call**.
 *
 * Off by default, because every capture so far ran without one and turning a budget on by surprise
 * would make eighteen complete captures incomplete.
 *
 * @param {{ bytes: number; calls: number; maxBytes?: number; maxCalls?: number }} input
 * @returns {string | null}
 */
export const budgetStop = ({ bytes, calls, maxBytes, maxCalls }) => {
  if (maxBytes !== undefined && bytes >= maxBytes)
    return `the --max-bytes budget of ${maxBytes} stopped it at ${bytes} bytes`;

  if (maxCalls !== undefined && calls >= maxCalls)
    return `the --max-calls budget of ${maxCalls} stopped it at ${calls} calls`;

  return null;
};

/**
 * Everything this run holds, not only what it fetched.
 *
 * A resumed run rebuilt its manifest from the calls it made, so the records for files it skipped
 * vanished — **nineteen renders sat on disk with nothing saying what they should hash to.**
 * `--verify` still reported zero failures, over fewer files, which is the same vacuous pass this
 * plan keeps finding: a check that examines less is not a check that found less.
 *
 * A record is carried only while its file is there. Attesting to a file that is gone is the other
 * half of the same mistake.
 *
 * @template {{ file?: string | null }} T
 * @param {{ records: T[]; previous: T[]; exists: (path: string) => boolean }} input
 * @returns {(T & { reused?: boolean })[]}
 */
export const carryForward = ({ records, previous, exists }) => {
  const made = new Set(records.map(one => one.file).filter(Boolean));

  return [
    ...records,
    ...previous
      .filter(one => one.file && !made.has(one.file) && exists(one.file))
      .map(one => ({ ...one, reused: true }))
  ];
};

/**
 * Pairs each run with the file that holds it.
 *
 * **A run whose root two files claim is not guessed at.** Capturing the wrong file would produce a
 * complete, hash-checked, entirely wrong design, and every check above would pass on it.
 *
 * @param {{
 *   runs: {
 *     run: string;
 *     rootNodeId: string | null;
 *     fileKey?: string | null;
 *     rootSource?: string;
 *   }[];
 *   links: { fileKey: string; nodeId: string }[];
 *   override?: { run: string; fileKey: string; rootNodeId: string } | null;
 * }} input
 */
export const matchTargets = ({ runs, links, override = null }) => {
  /** @type {Map<string, Set<string>>} */
  const byNode = new Map();

  for (const { fileKey, nodeId } of links) {
    if (!byNode.has(nodeId)) byNode.set(nodeId, new Set());
    byNode.get(nodeId)?.add(fileKey);
  }

  /**
   * @type {{
   *   run: string;
   *   rootNodeId: string;
   *   fileKey: string;
   *   source: string;
   *   rootSource: string;
   * }[]}
   */
  const targets = [];

  /** @type {{ run: string; reason: string }[]} */
  const unidentified = [];

  for (const one of runs) {
    // **An override is an assertion, not evidence**, and is labelled as one so a later reader
    // can tell a design the resolver identified from one an operator named.
    if (override && override.run === one.run) {
      targets.push({
        run: one.run,
        rootNodeId: override.rootNodeId,
        fileKey: override.fileKey,
        source: 'override',
        rootSource: 'override'
      });

      continue;
    }

    if (!one.rootNodeId) {
      unidentified.push({ run: one.run, reason: 'the run records no root node id' });
      continue;
    }

    const linked = [...(byNode.get(one.rootNodeId) ?? [])];

    if (linked.length > 1 && !one.fileKey) {
      unidentified.push({
        run: one.run,
        reason: `two file keys claim ${one.rootNodeId}: ${linked.join(', ')}`
      });
      continue;
    }

    const fileKey = one.fileKey ?? linked[0];

    if (!fileKey) {
      unidentified.push({ run: one.run, reason: `no link names ${one.rootNodeId}` });
      continue;
    }

    targets.push({
      run: one.run,
      rootNodeId: one.rootNodeId,
      fileKey,
      source: one.fileKey ? (linked.includes(one.fileKey) ? 'index+link' : 'index') : 'link',
      rootSource: one.rootSource ?? 'index'
    });
  }

  return { targets, unidentified };
};

// ---------------------------------------------------------------------------------------------
// The stored REST capture

/**
 * Loose on purpose below the top level: the point of a verbatim capture is that fields nobody
 * anticipated survive to be read later. Strict where it matters — a document with no `nodes` is an
 * error body, and reading it as an empty design is the exact fault this plan exists to remove.
 */
export const RestCapture = z
  .object({
    name: z.string(),
    lastModified: z.string(),
    version: z.string(),
    // **`null` is an answer, not a malformed response.** REST returns `nodes: { "123:456": null }`
    // for an id the file does not hold, which is the authoritative way to tell a node that is
    // missing from our capture apart from one that was never in the design. Two corpus runs
    // contain a `123-456.txt` — a prose probe log an agent named after the server's own error
    // message template — and this is what tells us so rather than a guess about filenames.
    nodes: z.record(
      z.string(),
      z
        .object({ document: z.record(z.string(), z.unknown()) })
        .loose()
        .nullable()
    )
  })
  .loose();

/**
 * @param {string | unknown} source
 * @returns {z.infer<typeof RestCapture>}
 */
export const readRestCapture = source => {
  /** @type {unknown} */
  let parsed = source;

  if (typeof source === 'string') {
    try {
      parsed = JSON.parse(source);
    } catch {
      throw new Error(`the capture is not JSON: ${source.slice(0, 80).trim()}`);
    }
  }

  const verdict = RestCapture.safeParse(parsed);

  if (!verdict.success) {
    const issue = verdict.error.issues[0];

    throw new Error(
      `the capture is not a REST node response: ${issue.path.join('.') || 'root'} ${issue.message}`
    );
  }

  return verdict.data;
};

/**
 * @typedef {{
 *   x: number;
 *   y: number;
 *   width: number;
 *   height: number;
 * }} Box
 *
 * @typedef {{
 *   id: string;
 *   name: string | null;
 *   type: string | null;
 *   box: Box | null;
 *   componentId: string | null;
 *   overrides: unknown;
 *   componentProperties: unknown;
 *   visible: boolean;
 *   nested: boolean;
 *   childCount: number;
 * }} CapturedNode
 */

/**
 * Flattens the document REST returned.
 *
 * REST descends **through** instances, which is the whole difference: for a8's frame this yields
 * 620 nodes where `get_metadata` reported 98, and 504 of the 620 carry the `;` ids the MCP tools
 * emit and then refuse.
 *
 * @param {Record<string, unknown>} document
 * @returns {Map<string, CapturedNode>}
 */
export const collectNodes = document => {
  /** @type {Map<string, CapturedNode>} */
  const nodes = new Map();

  /** @param {Record<string, unknown>} node */
  const walk = node => {
    const id = typeof node.id === 'string' ? node.id : null;

    if (!id) throw new Error('the document holds a node with no id');

    const children = Array.isArray(node.children)
      ? /** @type {Record<string, unknown>[]} */ (node.children)
      : [];

    nodes.set(id, {
      id,
      name: typeof node.name === 'string' ? node.name : null,
      type: typeof node.type === 'string' ? node.type : null,
      box: /** @type {Box | null} */ (node.absoluteBoundingBox ?? null),
      componentId: typeof node.componentId === 'string' ? node.componentId : null,
      overrides: node.overrides ?? null,
      componentProperties: node.componentProperties ?? null,
      // REST omits `visible` when it is true, so absence is visible and only `false` is hidden.
      visible: node.visible !== false,
      nested: id.includes(';'),
      childCount: children.length
    });

    for (const child of children) walk(child);
  };

  walk(document);

  return nodes;
};

// ---------------------------------------------------------------------------------------------
// What the MCP tools emit

const METADATA_ID = /\bid="([^"]*)"/g,
  CONTEXT_ID = /\bdata-node-id="([^"]*)"/g,
  /**
   * `get_design_context` prefixes its markup with instructions to the agent, and those instructions
   * contain an **example node id in backticks**:
   *
   * > Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
   *
   * A reader that scrapes every `data-node-id` finds `1:2` in four different designs across four
   * different files and reports a node that does not exist anywhere. That is a documentation
   * example being counted as design data — the fourth measurement fault of this shape in this
   * harness, and the only one caught before it was believed rather than after.
   */
  BACKTICKED = /`[^`]*`/g;

/** @param {string} xml @returns {string[]} */
export const metadataIds = xml => [...xml.matchAll(METADATA_ID)].map(([, id]) => id);

/** @param {string} markup @returns {string[]} */
export const designContextIds = markup =>
  [...markup.replace(BACKTICKED, '').matchAll(CONTEXT_ID)].map(([, id]) => id);

// ---------------------------------------------------------------------------------------------
// Check 3 — cross-tool reconciliation

/**
 * Three tools see the same tree from different angles and must agree about which nodes exist.
 *
 * **This is the strongest of the five, and it is known to be able to fire**: F11 measured 16 of 84
 * design-context captures rooted at a different node than the one queried. REST is treated as the
 * superset because it descends through instance boundaries — so an id only REST holds is reported,
 * not red, while an id a tool named and REST does not hold is a disagreement.
 *
 * A `;` id MCP emitted is **classified, not counted against the capture**: the server emits that
 * form and then refuses it, so its absence from a document keyed by plain ids is expected.
 *
 * @param {{ rest: string[]; metadata: string[]; designContext: string[] }} input
 */
export const reconcile = ({ rest, metadata, designContext }) => {
  const held = new Set(rest),
    /** @type {string[]} */
    nested = [],
    missing = {
      /** @type {string[]} */ metadata: [],
      /** @type {string[]} */ designContext: []
    };

  for (const [where, ids] of /** @type {const} */ ([
    ['metadata', metadata],
    ['designContext', designContext]
  ])) {
    for (const id of new Set(ids)) {
      if (held.has(id)) continue;
      if (id.includes(';')) nested.push(id);
      else missing[where].push(id);
    }
  }

  const seen = new Set([...metadata, ...designContext]);

  return {
    status: missing.metadata.length || missing.designContext.length ? 'red' : 'green',
    rest: held.size,
    metadata: new Set(metadata).size,
    designContext: new Set(designContext).size,
    onlyRest: [...held].filter(id => !seen.has(id)).length,
    onlyMetadata: missing.metadata.sort(),
    onlyDesignContext: missing.designContext.sort(),
    nested: nested.sort()
  };
};

// ---------------------------------------------------------------------------------------------
// Check 1 — frontier closure

/**
 * Every node that entered the frontier left it with a recorded disposition, and a node the walk
 * called `captured` is on disk.
 *
 * The second half is what makes this a check on the capture rather than on the walk's bookkeeping:
 * a walk can be internally consistent about a file it never wrote.
 *
 * @param {{ entered: string[]; dispositions: Record<string, string>; present: string[] }} input
 */
export const frontierClosure = ({ entered, dispositions, present }) => {
  const held = new Set(present),
    /** @type {string[]} */
    withoutDisposition = [],
    /** @type {string[]} */
    unknownDisposition = [],
    /** @type {string[]} */
    claimedButAbsent = [];

  for (const id of new Set(entered)) {
    const disposition = dispositions[id];

    if (!disposition) {
      withoutDisposition.push(id);
      continue;
    }

    if (!DISPOSITIONS.has(disposition)) unknownDisposition.push(id);
    if ((disposition === 'captured' || disposition === 'resolved') && !held.has(id))
      claimedButAbsent.push(id);
  }

  return {
    status:
      withoutDisposition.length || unknownDisposition.length || claimedButAbsent.length
        ? 'red'
        : 'green',
    entered: new Set(entered).size,
    withoutDisposition: withoutDisposition.sort(),
    unknownDisposition: unknownDisposition.sort(),
    claimedButAbsent: claimedButAbsent.sort()
  };
};

// ---------------------------------------------------------------------------------------------
// Check 2 — nothing declared itself incomplete

const TIMED_OUT = /Code Connect lookup timed out|response (?:was )?truncated|output limit/i;

/**
 * Complete means **no response declared itself partial**, not that the walk finished.
 *
 * A list that arrived at exactly the cap counts as a signal on its own: twenty of twenty is
 * indistinguishable from a complete twenty, and treating the ambiguous case as complete is how a
 * truncated asset list becomes a design with no icons.
 *
 * @param {Record<string, unknown>} payloads
 */
export const declaredTruncations = payloads => {
  /** @type {{ where: string; signal: string }[]} */
  const signals = [];

  for (const [where, payload] of Object.entries(payloads)) {
    if (typeof payload === 'string') {
      if (TIMED_OUT.test(payload))
        signals.push({ where, signal: 'the response says it timed out' });
      continue;
    }

    if (typeof payload !== 'object' || payload === null) continue;

    for (const [key, value] of Object.entries(payload)) {
      if (key.endsWith('Truncated') && value === true) signals.push({ where, signal: key });
      if (Array.isArray(value) && value.length === ASSET_CAP)
        signals.push({ where, signal: `${key} arrived at the cap of ${ASSET_CAP}` });
    }
  }

  return { status: signals.length ? 'red' : 'green', signals };
};

// ---------------------------------------------------------------------------------------------
// Check 4 — the geometry witness

/**
 * The raster is produced by Figma and owes nothing to our traversal, so the geometry of what we
 * captured can be held against it.
 *
 * **Neither the ratio nor the count outside the frame is a pass/fail**, and the first draft of this
 * function got that wrong in both directions — which is why it was run against all eighteen
 * captures before being believed:
 *
 * - **`ratio` is not completeness.** Four designs cover 0.72-0.83 of their frame with `outside` at
 *   zero. That is whitespace, and calling it a miss would fire on healthy designs.
 * - **`outside` is not an error.** It fired on 14 of 18, up to **920 nodes in a1-kampus**, whose root
 *   frame is `clipsContent: true` and 720px tall while its table of contents runs past 11443. Those
 *   nodes are real, captured, and deliberately not visible. The number is worth reporting precisely
 *   because it measures what the raster **cannot** witness.
 *
 * So one thing is decidable here: coverage that **fell** against a baseline is a region we stopped
 * seeing. Comparing the uncovered region against the raster's own pixels is
 * `T-NOJIRA-corpus-census-03`'s comparator, not this.
 *
 * @param {{ frame: Box; boxes: (Box | null)[]; grid?: number; baseline?: number }} input
 */
export const coverage = ({ frame, boxes, grid = 32, baseline }) => {
  const present = /** @type {Box[]} */ (boxes.filter(Boolean));

  let outside = 0,
    covered = 0;

  for (const box of present) {
    if (
      box.x + box.width <= frame.x ||
      box.y + box.height <= frame.y ||
      box.x >= frame.x + frame.width ||
      box.y >= frame.y + frame.height
    )
      outside += 1;
  }

  for (let row = 0; row < grid; row += 1) {
    for (let column = 0; column < grid; column += 1) {
      const x = frame.x + ((column + 0.5) * frame.width) / grid,
        y = frame.y + ((row + 0.5) * frame.height) / grid;

      if (
        present.some(
          box => x >= box.x && x < box.x + box.width && y >= box.y && y < box.y + box.height
        )
      )
        covered += 1;
    }
  }

  const cells = grid * grid,
    ratio = covered / cells;

  return {
    status: baseline !== undefined && ratio < baseline ? 'red' : 'green',
    cells,
    covered,
    uncovered: cells - covered,
    ratio,
    outside,
    baseline: baseline ?? null
  };
};

// ---------------------------------------------------------------------------------------------
// Check 5 — re-run determinism

/**
 * @typedef {{ url: string; sha256?: string | null; bytes?: number }} ComparableRecord
 * @param {{ records: ComparableRecord[] }} a
 * @param {{ records: ComparableRecord[] }} b
 */
export const determinism = (a, b) => {
  const index = /** @param {{ records: ComparableRecord[] }} run */ run =>
      new Map(run.records.map(one => [one.url, one])),
    left = index(a),
    right = index(b);

  /** @type {{ url: string; field: string; a: unknown; b: unknown }[]} */
  const differing = [];

  for (const [url, one] of left) {
    const other = right.get(url);

    if (!other) continue;

    for (const field of /** @type {const} */ (['sha256', 'bytes'])) {
      if (one[field] !== other[field])
        differing.push({ url, field, a: one[field], b: other[field] });
    }
  }

  const onlyInA = [...left.keys()].filter(url => !right.has(url)),
    onlyInB = [...right.keys()].filter(url => !left.has(url));

  return {
    status: differing.length || onlyInA.length || onlyInB.length ? 'red' : 'green',
    differing,
    onlyInA,
    onlyInB
  };
};

// ---------------------------------------------------------------------------------------------

/**
 * Rolls the five into one verdict. A capture is **complete only when nothing went red** — a skipped
 * check is not a pass and is reported as skipped rather than counted.
 *
 * @param {Record<string, { status: string; detail?: string }>} checks
 */
export const runChecks = checks => {
  const reasons = Object.entries(checks)
    .filter(([, check]) => check.status === 'red')
    .map(([name, check]) => `${name}${check.detail ? `: ${check.detail}` : ''}`);

  return {
    schemaVersion: CAPTURE_SCHEMA_VERSION,
    checks,
    complete: reasons.length === 0,
    reasons
  };
};

// ---------------------------------------------------------------------------------------------
// The capture itself

/**
 * One design's REST capture: the frame's whole subtree, the file's identity, its version history
 * and a render.
 *
 * Each call is streamed to disk by `rest.getTo` and **never returned**, so nothing on this path can
 * summarise a response. What comes back is the list of what was written.
 *
 * @param {{
 *   rest: { getTo: (path: string, url: string) => Promise<import('./rest.mjs').CallRecord> };
 *   target: { run: string; fileKey: string; rootNodeId: string };
 *   outDir: string;
 *   base?: string;
 *   resume?: boolean;
 *   exists?: (path: string) => boolean;
 *   previous?: import('./rest.mjs').CallRecord[];
 *   extraIds?: string[];
 *   read?: (path: string) => string;
 *   maxBytes?: number;
 *   maxCalls?: number;
 *   clear?: (dir: string) => void;
 * }} input
 */
export const captureDesign = async ({
  rest,
  target,
  outDir,
  base,
  resume = false,
  exists,
  previous = [],
  extraIds = [],
  read,
  maxBytes,
  maxCalls,
  clear
}) => {
  // **A run that is not resuming starts from nothing.** Otherwise it reads files an earlier run
  // left — `nodes-named.json` was being used to satisfy the reconciliation and then not fetched,
  // so fourteen designs held a file this run depended on and did not attest to.
  if (!resume) clear?.(outDir);

  const { fileKey, rootNodeId } = target,
    slug = rootNodeId.replace(':', '-'),
    options = base ? { base } : {},
    plan = /** @type {const} */ ([
      [`${outDir}/rest/nodes-${slug}.json`, nodesUrl(fileKey, [rootNodeId], options)],
      [`${outDir}/rest/versions.json`, versionsUrl(fileKey, options)],
      [
        `${outDir}/rest/images-${slug}.json`,
        imagesUrl(fileKey, [rootNodeId], { ...options, scale: 2 })
      ],
      // The corpus queried `get_design_context` at roots the frame's subtree does not contain —
      // 30 of them across thirteen designs, which is F11 arriving as node ids. They are part of
      // what the design work actually looked at, so they are captured rather than explained away.
      ...(extraIds.length
        ? /** @type {[string, string][]} */ ([
            [`${outDir}/rest/nodes-extra.json`, nodesUrl(fileKey, extraIds, options)]
          ])
        : [])
    ]);

  /** @type {import('./rest.mjs').CallRecord[]} */
  const records = [];

  /** @type {string | null} */
  let stoppedBy = null;

  /** The budget is checked **before** each call, so the one that would exceed it is not made. */
  const overBudget = () =>
    budgetStop({
      bytes: records.reduce((sum, one) => sum + one.bytes, 0),
      calls: records.length,
      maxBytes,
      maxCalls
    });

  /**
   * The render Figma produced for this node. `/v1/images` answers with a **short-lived S3 URL**, so
   * a capture that stored only the URL would hold a 404 within the week — and the raster is check
   * 4's independent witness, which makes it part of the capture rather than a nicety.
   *
   * @param {string} source
   */
  const render = async source => {
    const images =
        /** @type {{ images?: Record<string, string | null> }} */ (JSON.parse(source)).images ?? {},
      url = images[rootNodeId];

    return url ? [await rest.getTo(`${outDir}/assets/${slug}.png`, url)] : [];
  };

  for (const [path, url] of plan) {
    stoppedBy = overBudget();

    if (stoppedBy) break;

    if (resume && exists?.(path)) {
      // A checkpoint is only a checkpoint if it carries the earlier call's record forward.
      // Dropping it would make a resumed run indistinguishable from one that captured nothing.
      const earlier = previous.find(one => one.file === path);

      if (earlier) {
        records.push({ ...earlier, reused: true });
        continue;
      }
    }

    records.push(await rest.getTo(path, url));
  }

  const imageCall = records.find(one => one.file?.includes('/images-'));

  stoppedBy ??= overBudget();

  if (
    !stoppedBy &&
    imageCall?.file &&
    read &&
    (!resume || !exists?.(`${outDir}/assets/${slug}.png`))
  )
    records.push(...(await render(read(imageCall.file))));

  return {
    records: exists ? carryForward({ records, previous, exists }) : records,
    stoppedBy
  };
};

/**
 * What the token actually reaches, stored with the run.
 *
 * REST publishes no `tools/list`, so the equivalent is the status each endpoint class answered
 * with. It is worth keeping because the answers are not obvious: the same token that gets 200 from
 * `api.figma.com` gets **401 from `mcp.figma.com`**, and a later reader looking at a capture with
 * no Code Connect in it should be able to see why rather than infer it.
 *
 * @param {{
 *   probe: (url: string) => Promise<{ status: number; ok: boolean }>;
 *   fileKey: string;
 *   base?: string;
 * }} input
 */
export const probeReach = async ({ probe, fileKey, base = REST_BASE }) => {
  /** @type {Record<string, number>} */
  const reach = {};

  for (const [name, url] of /** @type {const} */ ([
    ['files', `${base}/files/${fileKey}?depth=1`],
    ['versions', versionsUrl(fileKey, { base })],
    ['me', `${base}/me`]
  ])) {
    try {
      reach[name] = (await probe(url)).status;
    } catch (error) {
      reach[name] = -1;
    }
  }

  return reach;
};

// ---------------------------------------------------------------------------------------------

/**
 * Re-hashes what is on disk against what the call record says was written.
 *
 * This exists because it fired. The pre-commit formatter reformatted **71 of 71** stored JSON
 * captures on their first commit — pretty-printing is a perfectly reasonable thing for a formatter
 * to do and a fatal thing to do to evidence. Nothing about the files looked wrong afterwards; only
 * the hashes did. `verbatim` is a property that has to be checked, not a property a directory can
 * have by being called one.
 *
 * **It checks both directions.** A record whose file changed is one failure; a file no record names
 * is the other, and it is the one that hid for a whole task: a resumed run rebuilt its manifest
 * from the calls it made, nineteen renders lost their records, and `--verify` went on reporting
 * zero failures over twenty-seven fewer files. A check that examines less has not found less.
 *
 * @param {{
 *   records: { file?: string | null; sha256?: string | null }[];
 *   read: (path: string) => Buffer;
 *   exists: (path: string) => boolean;
 *   digest: (bytes: Buffer) => string;
 *   present?: string[];
 * }} input
 */
export const verifyStored = ({ records, read, exists, digest, present = [] }) => {
  /** @type {{ file: string; reason: string }[]} */
  const failures = [];

  let checked = 0;

  for (const record of records) {
    if (!record.file || !record.sha256) continue;

    if (!exists(record.file)) {
      failures.push({ file: record.file, reason: 'the record names a file that is not there' });
      continue;
    }

    checked += 1;

    const actual = digest(read(record.file));

    if (actual !== record.sha256)
      failures.push({
        file: record.file,
        reason: `the bytes on disk hash to ${actual.slice(0, 12)}, the record says ${record.sha256.slice(0, 12)}`
      });
  }

  const named = new Set(records.map(one => one.file).filter(Boolean)),
    unattested = present.filter(path => !named.has(path)).sort();

  return {
    status: failures.length || unattested.length ? 'red' : 'green',
    checked,
    failures,
    unattested
  };
};

/**
 * Every node id the design's stored REST documents hold, across all of them, plus the ids Figma
 * answered `null` for.
 *
 * @param {string} dir
 * @returns {{ held: Set<string>; absentFromFile: string[] }}
 */
export const heldNodes = dir => {
  /** @type {Set<string>} */
  const held = new Set();

  /** @type {string[]} */
  const absentFromFile = [];

  if (!existsSync(dir)) return { held, absentFromFile };

  for (const name of readdirSync(dir)) {
    if (!name.startsWith('nodes-') || !name.endsWith('.json')) continue;

    for (const [asked, entry] of Object.entries(
      readRestCapture(readFileSync(join(dir, name), 'utf8')).nodes
    )) {
      if (!entry) {
        absentFromFile.push(asked);
        continue;
      }

      for (const id of collectNodes(entry.document).keys()) held.add(id);
    }
  }

  return { held, absentFromFile: [...new Set(absentFromFile)].sort() };
};

/**
 * Node ids the corpus's own capture filenames name. A name may carry a suffix the operator added —
 * `.part1`, `.advisory` — so the id is taken from the front rather than the whole stem.
 *
 * @param {string} runsDir
 * @param {string} run
 * @param {string} kind
 */
const capturedRoots = (runsDir, run, kind) => {
  const dated = readdirSync(runsDir).find(name => name.endsWith(run));

  if (!dated) return [];

  const dir = join(runsDir, dated, 'captures', kind);

  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap(name => {
    const id = /^(\d+)-(\d+)/.exec(name);

    return id ? [`${id[1]}:${id[2]}`] : [];
  });
};

/**
 * Check 3 against the MCP captures the corpus already holds, which is where it has teeth: the three
 * tools see the same tree from different angles and must agree about which nodes exist.
 *
 * @param {string} runsDir
 * @param {string} run
 * @param {string[]} restIds
 */
const mcpIds = (runsDir, run, restIds) => {
  /**
   * @type {(
   *   verdict: Record<string, unknown> & { status: string }
   * ) => Record<string, unknown> & { status: string; detail?: string }}
   */
  const asCheck = verdict => verdict;

  const dated = readdirSync(runsDir).find(name => name.endsWith(run));

  if (!dated || !restIds.length)
    return asCheck({ status: 'skipped', detail: 'no MCP capture to reconcile against' });

  // These call the exported readers rather than repeating their patterns. An earlier draft
  // inlined the two regexes here and the preamble fix never reached the code that runs, which
  // is how `1:2` survived being removed.
  /** @param {string} kind @param {(text: string) => string[]} reader */
  const idsIn = (kind, reader) => {
    const dir = join(runsDir, dated, 'captures', kind);

    if (!existsSync(dir)) return [];

    return readdirSync(dir).flatMap(name => reader(readFileSync(join(dir, name), 'utf8')));
  };

  return asCheck(
    reconcile({
      rest: restIds,
      metadata: idsIn('metadata', metadataIds),
      designContext: idsIn('design-context', designContextIds)
    })
  );
};

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? undefined : argv[i + 1];
};

if (import.meta.main) {
  const runsDir = arg('runs') ?? 'runs',
    outRoot = arg('out') ?? 'runs/captures',
    only = arg('only'),
    token = env.FIGMA_READ_TOKEN;

  if (argv.includes('--verify')) {
    let checked = 0,
      bad = 0;

    for (const entry of existsSync(outRoot) ? readdirSync(outRoot) : []) {
      const manifest = join(outRoot, entry, 'manifest.json');

      if (!existsSync(manifest)) continue;

      /** @param {string} dir @returns {string[]} */
      const filesUnder = dir =>
        !existsSync(dir)
          ? []
          : readdirSync(dir, { withFileTypes: true }).flatMap(one =>
              one.isDirectory() ? filesUnder(join(dir, one.name)) : [join(dir, one.name)]
            );

      const verdict = verifyStored({
        records: /** @type {{ records: import('./rest.mjs').CallRecord[] }} */ (
          JSON.parse(readFileSync(manifest, 'utf8'))
        ).records,
        read: path => readFileSync(path),
        exists: path => existsSync(path),
        digest: bytes => createHash('sha256').update(bytes).digest('hex'),
        // Everything the design holds except the manifest, which describes the rest and cannot
        // describe itself.
        present: filesUnder(join(outRoot, entry)).filter(path => path !== manifest)
      });

      checked += verdict.checked;
      bad += verdict.failures.length + verdict.unattested.length;

      for (const failure of verdict.failures) console.error(`${failure.file}: ${failure.reason}`);
      for (const path of verdict.unattested)
        console.error(`${path}: no record attests to this file`);
    }

    console.error(`${checked} stored responses checked, ${bad} no longer verbatim`);
    exit(bad ? 4 : 0);
  }

  if (!token) {
    console.error(
      'capture.mjs needs FIGMA_READ_TOKEN in the environment.\n' +
        'usage: capture.mjs [--runs <dir>] [--out <dir>] [--only <run>] [--scan <dir>]... ' +
        '[--resume] [--verify]'
    );
    exit(2);
  }

  // The target list: every run's root node, and every design link anywhere in the repository.
  /** @type {{ run: string; rootNodeId: string | null; fileKey: string | null }[]} */
  const runs = [];

  for (const entry of readdirSync(runsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const index = join(runsDir, entry.name, 'captures', 'index.json');

    if (!existsSync(index)) continue;

    const figma = /** @type {{ figma?: { fileKey?: string; rootNodeId?: string } }} */ (
      JSON.parse(readFileSync(index, 'utf8'))
    ).figma;

    const metadataPath = join(runsDir, entry.name, 'figma-metadata.txt'),
      root = rootOfRun({
        indexRoot: figma?.rootNodeId ?? null,
        metadata: existsSync(metadataPath) ? readFileSync(metadataPath, 'utf8') : null
      });

    runs.push({
      run: entry.name.replace(/^\d{4}-\d{2}-\d{2}-/, ''),
      fileKey: figma?.fileKey ?? null,
      ...root
    });
  }

  /** @type {{ fileKey: string; nodeId: string }[]} */
  const links = [];

  /** @param {string} dir */
  const scan = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) scan(path);
      else if (/\.(md|json|txt|html|mjs)$/.test(entry.name))
        links.push(...figmaLinks(readFileSync(path, 'utf8')));
    }
  };

  for (const dir of argv
    .flatMap((a, i) => (a === '--scan' ? [argv[i + 1]] : []))
    .concat(argv.includes('--scan') ? [] : [runsDir, 'context']))
    if (existsSync(dir)) scan(dir);

  const overrideKey = arg('file-key'),
    overrideRoot = arg('root');

  if ((overrideKey || overrideRoot) && !(overrideKey && overrideRoot && only)) {
    console.error('capture.mjs: --file-key and --root must be given together, with --only <run>');
    exit(2);
  }

  const { targets, unidentified } = matchTargets({
      runs,
      links,
      override:
        overrideKey && overrideRoot && only
          ? { run: only, fileKey: overrideKey, rootNodeId: overrideRoot }
          : null
    }),
    wanted = only ? targets.filter(one => one.run === only) : targets;

  if (!wanted.length) {
    console.error(
      `no target matched${only ? ` --only ${only}` : ''}; ${unidentified.length} run(s) unidentified`
    );
    exit(1);
  }

  const rest = openRest({ token }),
    resume = argv.includes('--resume'),
    maxBytes = arg('max-bytes') === undefined ? undefined : Number(arg('max-bytes')),
    maxCalls = arg('max-calls') === undefined ? undefined : Number(arg('max-calls')),
    started = new Date().toISOString();

  /** @type {Record<string, unknown>[]} */
  const perDesign = [];

  for (const target of wanted) {
    const outDir = join(outRoot, target.run),
      restDir = join(outDir, 'rest'),
      manifestPath = join(outDir, 'manifest.json'),
      previous =
        resume && existsSync(manifestPath)
          ? (/** @type {{ records?: import('./rest.mjs').CallRecord[] }} */ (
              JSON.parse(readFileSync(manifestPath, 'utf8'))
            ).records ?? [])
          : [],
      { records, stoppedBy } = await captureDesign({
        rest,
        target,
        outDir,
        resume,
        previous,
        exists: path => existsSync(path),
        read: path => readFileSync(path, 'utf8'),
        clear: dir => {
          for (const sub of ['rest', 'assets'])
            rmSync(join(dir, sub), { recursive: true, force: true });
        },
        maxBytes,
        maxCalls,
        extraIds: [
          ...new Set(
            ['design-context', 'metadata', 'code-connect'].flatMap(kind =>
              capturedRoots(runsDir, target.run, kind)
            )
          )
        ].filter(id => id !== target.rootNodeId)
      });

    const nodesFile = join(restDir, `nodes-${target.rootNodeId.replace(':', '-')}.json`);

    /** @type {Record<string, unknown>} */
    let identity = {};

    /** @type {Record<string, unknown> & { status: string; detail?: string }} */
    let closure = { status: 'skipped', detail: 'the capture wrote no document' };

    /** @type {Record<string, unknown> & { status: string; detail?: string }} */
    let witness = { status: 'skipped', detail: 'the capture wrote no document' };

    /** @type {Record<string, unknown> & { status: string; detail?: string }} */
    let agreement = { status: 'skipped', detail: 'no MCP capture to reconcile against' };

    if (existsSync(nodesFile)) {
      const capture = readRestCapture(readFileSync(nodesFile, 'utf8')),
        document = capture.nodes[target.rootNodeId]?.document,
        frameNodes = document ? collectNodes(document) : new Map();

      // **A second pass, because the first one has a question Figma can answer.** Reconciliation
      // leaves ids a tool named and the capture does not hold; asking REST for them settles what
      // they are. Measured on a2: all 49 resolved — local COMPONENT definitions on another page
      // of the same file, outside the design frame. They are captured, not explained away. An id
      // that comes back `null` is Figma saying it is not in this file, which is an answer too.
      for (let pass = 0; pass < 2; pass += 1) {
        const { held, absentFromFile } = heldNodes(restDir);

        agreement = mcpIds(runsDir, target.run, [...held]);

        const unaccounted = [
          .../** @type {string[]} */ (agreement.onlyMetadata ?? []),
          .../** @type {string[]} */ (agreement.onlyDesignContext ?? [])
        ];

        identity = {
          name: capture.name,
          lastModified: capture.lastModified,
          version: capture.version,
          frameNodes: frameNodes.size,
          nodeCount: held.size,
          nestedIds: [...frameNodes.values()].filter(one => one.nested).length,
          withComponentId: [...frameNodes.values()].filter(one => one.componentId).length,
          absentFromFile
        };

        closure = frontierClosure({
          entered: [...held],
          dispositions: Object.fromEntries([...held].map(id => [id, 'captured'])),
          present: [...held]
        });

        const frame = /** @type {Box | undefined} */ (document?.absoluteBoundingBox);

        if (frame)
          witness = coverage({
            frame,
            boxes: [...frameNodes.values()]
              .filter(one => one.id !== target.rootNodeId)
              .map(one => one.box)
          });

        if (pass === 1 || !unaccounted.length) break;

        records.push(
          await rest.getTo(join(restDir, 'nodes-named.json'), nodesUrl(target.fileKey, unaccounted))
        );
      }
    }

    const report = runChecks({
      closure,
      truncation: declaredTruncations({ rest: records.map(one => one.error ?? '').join('\n') }),
      reconciliation: agreement,
      coverage: witness,
      determinism: { status: 'skipped', detail: 'this design was captured once' },
      budget: stoppedBy
        ? { status: 'red', detail: stoppedBy }
        : { status: 'green', detail: maxBytes || maxCalls ? 'inside the budget' : 'no budget set' }
    });

    const manifest = {
      ...target,
      capturedAt: started,
      identity,
      reach: await probeReach({
        probe: url => fetch(url, { headers: { [TOKEN_HEADER]: token } }),
        fileKey: target.fileKey
      }),
      records,
      ...report
    };

    mkdirSync(outDir, { recursive: true });
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    perDesign.push(manifest);
    console.error(
      `${target.run}: ${identity.nodeCount ?? 0} nodes, ` +
        `${records.reduce((sum, one) => sum + one.bytes, 0)} bytes, ` +
        `${report.complete ? 'complete' : `incomplete — ${report.reasons.join('; ')}`}`
    );
  }

  const index = {
    schemaVersion: CAPTURE_SCHEMA_VERSION,
    capturedAt: started,
    source: REST_BASE,
    note:
      'Verbatim REST captures. Nothing here was read by anything that could summarise it; ' +
      'every byte is as api.figma.com sent it.',
    designs: perDesign.map(one => ({
      run: one.run,
      fileKey: one.fileKey,
      rootNodeId: one.rootNodeId,
      source: one.source,
      identity: one.identity,
      complete: one.complete,
      reasons: one.reasons
    })),
    unidentified
  };

  mkdirSync(outRoot, { recursive: true });
  writeFileSync(join(outRoot, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);

  // A capture that could not be identified is the operator's problem, not a silent zero.
  if (unidentified.length && !argv.includes('--allow-unidentified')) {
    console.error(
      `${unidentified.length} run(s) unidentified: ${unidentified.map(one => one.run).join(', ')}`
    );
    exit(5);
  }

  if (perDesign.some(one => !one.complete) && !argv.includes('--allow-incomplete')) exit(3);
}
