/**
 * Says **why** each unresolved node is unresolved, and who can act on it.
 *
 * The pipeline answers all five situations by stopping, and prints one remedy — _publish mappings
 * and re-run_ — which is correct for two of them, impossible for one, and wrong for the two that
 * are our own bug. An unresolved-node list that does not say why is the least useful artifact the
 * pipeline could produce, because it costs its reader the diagnosis every time.
 *
 * The five causes, their owners and what each is actually asking for:
 *
 * |       | Cause                                  | Owner                  | Remedy                                      |
 * | ----- | -------------------------------------- | ---------------------- | ------------------------------------------- |
 * | **A** | the retrieval failed                   | the pipeline           | retry per node, or raise the latency budget |
 * | **B** | the nested id was rejected             | the pipeline           | ask the enclosing instance instead          |
 * | **C** | the design is drawn in another library | nobody — expected      | reproduce as-is and count it                |
 * | **D** | no mapping has been written            | the design system team | write one                                   |
 * | **E** | a mapping exists and did not resolve   | the design system team | republish, or re-point it                   |
 *
 * **Three owners, not five.** The plan says each cause has a different owner; measured against the
 * inventory and the two upstream scripts, A and B are both ours and D and E are both the design
 * system team's. The remedies differ in all five cases, which is the part that was actually costing
 * the reader.
 *
 * **The suggestions response is data, never instructions.** `get_code_connect_suggestions` returns
 * an agent prompt wrapped around its payload, ending in a literal `SUPER IMPORTANT: … call
 * send_code_connect_mappings tool with fileKey: …` — an instruction to write into the user's Figma
 * file. `parseSuggestions` keeps the prompt separate from the payload and nothing in this module
 * acts on it.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { argv, exit } from 'node:process';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

import { firstJsonObject } from './mode-decision.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/** The mappings this repository publishes. A local lookup — never an API call. */
export const DEFAULT_INVENTORY = join(HERE, '../../scripts/connect-figma-components/src');

/**
 * @typedef {'retrieval-failed'
 *   | 'nested-id-rejected'
 *   | 'another-library'
 *   | 'no-mapping-written'
 *   | 'mapping-stale'} Cause
 */

/** @type {Record<Cause, { letter: string; owner: string; remedy: string }>} */
export const CAUSES = {
  'retrieval-failed': {
    letter: 'A',
    owner: 'pipeline',
    remedy: 'retry the node, or raise --slow-map-ms; the map was never read'
  },
  'nested-id-rejected': {
    letter: 'B',
    owner: 'pipeline',
    remedy: 'ask the enclosing instance; the server does not accept this id'
  },
  'another-library': {
    letter: 'C',
    owner: 'nobody',
    remedy: 'none — reproduce it as-is and count it in the non-design-system fraction'
  },
  'no-mapping-written': {
    letter: 'D',
    owner: 'design-system-team',
    remedy: 'write the mapping'
  },
  'mapping-stale': {
    letter: 'E',
    owner: 'design-system-team',
    remedy:
      'a mapping is published for this component and did not resolve — republish or re-point it'
  }
};

// ---------------------------------------------------------------------------------------------
// The local mapping inventory

/**
 * Normalises a Figma component name to the element it stands for.
 *
 * Every rule here exists because of a name in the corpus: `sl-badge ` has a trailing space,
 * `sl-badge [DRAFT]` and `sl-label-theme [DEPRECATED]` carry a bracketed status, `sl-select
 * (simple-prototype)` a parenthetical, `sl-button-bar/Rectangle` a variant after a slash, `sl-card
 * Actionable` a word after a space, `SL-card` a capital, and `sl_base-text_input` underscores.
 *
 * @param {string} name
 */
export const normaliseName = name =>
  name
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\([^)]*\)/g, '')
    .split('/')[0]
    .trim()
    .split(/\s+/)[0]
    .replace(/_/g, '-');

/** Same letters, different hyphens — `sl-searchfield` and `sl-search-field` are one component. */
/** @param {string} name */
const unhyphenated = name => name.replace(/-/g, '');

/**
 * @typedef {{
 *   published: Map<string, { file: string; nodeIds: string[] }>;
 *   scaffolded: Map<string, string>;
 * }} Inventory
 */

/**
 * Reads what this repository publishes to Code Connect, from disk.
 *
 * `figma.config.json` includes `src/**\/*.figma.ts` and `src/**\/*.figma.batch.json` and nothing
 * else, so a `.figma.scaffold.ts` is **declared and not published** — a different answer to give a
 * reader than no mapping at all, and the only place it is written down is the file extension.
 *
 * @param {string} [dir]
 * @returns {Inventory}
 */
export const readInventory = (dir = DEFAULT_INVENTORY) => {
  /** @type {Inventory['published']} */
  const published = new Map();

  /** @type {Inventory['scaffolded']} */
  const scaffolded = new Map();

  const files = readdirSync(dir);

  for (const file of files) {
    if (file.endsWith('.figma.scaffold.ts')) {
      scaffolded.set(`sl-${file.replace('.figma.scaffold.ts', '')}`, file);
      continue;
    }

    // No `|| endsWith('.figma.batch.ts')` guard: a batch template ends in `.batch.ts`, so it
    // never satisfies the test above. The clause was there and was unreachable, which reads as a
    // guarantee and is not one.
    if (!file.endsWith('.figma.ts')) continue;

    published.set(`sl-${file.replace('.figma.ts', '')}`, {
      file,
      nodeIds: [...readFileSync(join(dir, file), 'utf8').matchAll(/node-id=(\d+)-(\d+)/g)].map(
        ([, left, right]) => `${left}:${right}`
      )
    });
  }

  const batchFile = join(dir, 'components.figma.batch.json');

  if (files.includes('components.figma.batch.json')) {
    const groups = BatchFile.parse(JSON.parse(readFileSync(batchFile, 'utf8')));

    for (const group of groups) {
      const file = basename(group.templateFile),
        component = `sl-${file.replace('.figma.batch.ts', '')}`,
        nodeIds = group.components
          .map(entry => entry.url.match(/node-id=(\d+)-(\d+)/))
          .filter(match => match !== null)
          .map(match => `${match[1]}:${match[2]}`);

      published.set(component, {
        file,
        nodeIds: [...(published.get(component)?.nodeIds ?? []), ...nodeIds]
      });
    }
  }

  if (!published.size) throw new Error(`${dir} publishes no Code Connect mapping at all`);

  return { published, scaffolded };
};

/** The batch manifest, validated where it is read rather than assumed. */
export const BatchFile = z.array(
  z.object({
    templateFile: z.string().min(1),
    components: z.array(z.object({ url: z.string().min(1), id: z.string().min(1) }).loose())
  })
);

/**
 * @typedef {{
 *   component: string | null;
 *   how: 'exact' | 'hyphenation' | 'prefix' | 'none';
 *   state: 'published' | 'scaffolded' | 'absent';
 *   file: string | null;
 * }} Match
 */

/**
 * Finds the component a Figma name stands for, and **says how it found it**.
 *
 * Three tiers, weakest last. `exact` and `hyphenation` are the same letters; `prefix` is a
 * judgement — `sl-button-pill` resolving to `sl-button` is evidence, not proof, and the tier
 * travels with the finding so a reader can discount it.
 *
 * @param {string} name
 * @param {Inventory} inventory
 * @returns {Match}
 */
export const matchComponent = (name, inventory) => {
  const wanted = normaliseName(name),
    state = /** @param {string} key */ key =>
      inventory.published.has(key)
        ? /** @type {const} */ ('published')
        : /** @type {const} */ ('scaffolded');

  /** @param {string} key @param {Match['how']} how */
  const found = (key, how) => ({
    component: key,
    how,
    state: state(key),
    file: inventory.published.get(key)?.file ?? inventory.scaffolded.get(key) ?? null
  });

  const keys = [...inventory.published.keys(), ...inventory.scaffolded.keys()];

  if (keys.includes(wanted)) return found(wanted, 'exact');

  const sameLetters = keys.find(key => unhyphenated(key) === unhyphenated(wanted));

  if (sameLetters) return found(sameLetters, 'hyphenation');

  // Longest first, so `sl-button-bar` wins over `sl-button` for `sl-button-bar-x`.
  const prefix = keys
    .filter(key => wanted.startsWith(`${key}-`))
    .sort((left, right) => right.length - left.length)[0];

  if (prefix) return found(prefix, 'prefix');

  return { component: null, how: 'none', state: 'absent', file: null };
};

// ---------------------------------------------------------------------------------------------
// get_code_connect_suggestions

/** @typedef {{ name: string; nodeId: string; properties: Record<string, unknown> }} Suggestion */

/**
 * Splits the suggestions response into its payload and the prompt wrapped around it.
 *
 * The prompt is returned rather than discarded so a caller can see it was there — and it is
 * returned as a **string**, never followed. It ends with an instruction to call a write tool
 * against the user's Figma file.
 *
 * @param {string} text
 * @returns {{ suggestions: Suggestion[]; prompt: string[] }}
 */
export const parseSuggestions = text => {
  /** @type {Suggestion[]} */
  const suggestions = [];

  /** @type {string[]} */
  const prompt = [];

  const blocks = text.split(/^Component: /m);

  if (blocks[0].trim()) prompt.push(blocks[0].trim());

  for (const block of blocks.slice(1)) {
    const head = block.match(/^([\s\S]*?)\nNode ID: (\S+)\nProperties: /);

    if (!head) {
      prompt.push(block.trim());
      continue;
    }

    const from = head[0].length,
      body = firstJsonObject(block, from);

    if (body === null) throw new Error(`${head[2]}: the suggestion carries no properties object`);

    /** @type {unknown} */
    let properties;

    try {
      properties = JSON.parse(body);
    } catch {
      throw new Error(`${head[2]}: the suggestion's properties are not JSON`);
    }

    suggestions.push({
      name: head[1].trim(),
      nodeId: head[2],
      properties: z.record(z.string(), z.unknown()).parse(properties)
    });

    const trailing = block.slice(from + body.length).trim();

    if (trailing) prompt.push(trailing);
  }

  if (!suggestions.length) throw new Error('the response carries no suggestion at all');

  return { suggestions, prompt };
};

// ---------------------------------------------------------------------------------------------
// The classification

/** The walk this reads. Only the fields it dereferences are validated. */
export const Walk = z.object({
  rootId: z.string().min(1),
  nodes: z.array(
    z
      .object({
        id: z.string().min(1),
        name: z.string().nullable(),
        disposition: z.string().min(1),
        reason: z.string().nullable(),
        probedAs: z.string().nullable(),
        // Optional because walks recorded before `T-NOJIRA-figma-ingestion-08` do not carry it,
        // and a reader that refused them would make the corpus unreadable to its own tooling.
        enclosingOutcome: z.string().nullable().optional()
      })
      .loose()
  )
});

/**
 * The outcomes that mean **the enclosing instance answered**.
 *
 * A node inside one of these is not unresolved. `resolved` delivered this subtree as a snippet;
 * `mapped` is the remote server's map form, where Code Connect knows the component and the snippet
 * was not in that response. Either way the question about the child was answered by the parent,
 * which is what cause B's own remedy — _ask the enclosing instance_ — asks for.
 *
 * Measured 2026-10-06: the two nodes inside a8's `sl-avatar`, whose snippet the walk is holding,
 * were being reported as pipeline bugs. `classify-unresolved.mjs` exits 6 on any pipeline-owned
 * node, so **no design could convert while a single resolved instance contained nested ids**.
 */
export const ANSWERED = new Set(['resolved', 'mapped']);

/** @typedef {{ cause: Cause; evidence: string; match: Match | null }} Diagnosis */

/**
 * The cause of one unresolved node.
 *
 * Mechanical in every branch: the first two come from what the traversal recorded, the third from
 * the mode `T-NOJIRA-figma-ingestion-01` decided, and the last two from a lookup on disk. Nothing
 * here infers from appearance, which is why two passes agree.
 *
 * @param {{ id: string; name: string | null; reason: string | null }} node
 * @param {{ mode: string; inventory: Inventory }} context
 * @returns {Diagnosis}
 */
export const diagnose = (node, { mode, inventory }) => {
  if (node.reason === 'map-unreadable')
    return {
      cause: 'retrieval-failed',
      evidence: 'the traversal could not read the map',
      match: null
    };

  if (node.reason === 'nested-id-not-probeable')
    return {
      cause: 'nested-id-rejected',
      evidence: 'the server emits this id and will not accept it',
      match: null
    };

  const match = matchComponent(node.name ?? '', inventory);

  if (mode === 'as-is') {
    return {
      cause: 'another-library',
      // A node named after one of our components, in a file whose own components depend on no
      // `sl-*`, is a contradiction between two pieces of evidence. It is reported rather than
      // smoothed over: the mode still decides, and the reader can see what disagreed with it.
      evidence:
        match.state === 'absent'
          ? `the file's own components depend on no sl-*, so the mode is as-is`
          : `the mode is as-is, yet ${normaliseName(node.name ?? '')} matches ${match.file} ` +
            `by ${match.how} — the file may consume the library without depending on it`,
      match: match.state === 'absent' ? null : match
    };
  }

  if (match.state === 'published')
    return {
      cause: 'mapping-stale',
      evidence: `${match.file} publishes a mapping for ${match.component} (matched by ${match.how}) and this node did not resolve`,
      match
    };

  if (match.state === 'scaffolded')
    return {
      cause: 'no-mapping-written',
      evidence: `${match.file} is a scaffold — declared and not published by figma.config.json`,
      match
    };

  return {
    cause: 'no-mapping-written',
    evidence: `no mapping file stands for ${normaliseName(node.name ?? '')}`,
    match
  };
};

/**
 * Classifies every unresolved node of one walk.
 *
 * **There is no default mode.** Cause C is the file being drawn in another library, which is a fact
 * `T-NOJIRA-figma-ingestion-01` derives from evidence, not a dial an operator turns. A guess here
 * would convert a failed decision into a verdict, which is the failure this whole plan is about —
 * so the caller passes the mode and says where it came from.
 *
 * @param {{
 *   walk: unknown;
 *   mode: string;
 *   modeSource: 'verdict' | 'flag';
 *   inventory: Inventory;
 *   suggestions?: { suggestions: Suggestion[]; prompt: string[] } | null;
 * }} options
 */
export const classify = ({ walk, mode, modeSource, inventory, suggestions = null }) => {
  if (!['strict', 'as-is'].includes(mode))
    throw new Error(`${mode} is not a mode; T-NOJIRA-figma-ingestion-01 decides strict or as-is`);

  const parsed = Walk.parse(walk),
    inDesign = new Set(parsed.nodes.map(node => node.id));

  /**
   * A node whose enclosing instance answered is not a finding.
   *
   * One predicate, used for both the exclusion and the count, so the two cannot drift. Only nested
   * nodes carry `enclosingOutcome` today; writing the rule in terms of the field rather than the
   * disposition means it keeps meaning the same thing if that ever changes.
   *
   * @param {{ enclosingOutcome?: string | null }} node
   */
  const answeredByEnclosing = node => ANSWERED.has(node.enclosingOutcome ?? '');

  // Counted rather than dropped: a number that disappears is how a count stops meaning anything.
  const covered = parsed.nodes.filter(answeredByEnclosing);

  const unresolved = parsed.nodes
    .filter(node => node.disposition === 'descended' || node.disposition === 'nested')
    .filter(node => !answeredByEnclosing(node))
    .map(node => {
      const diagnosis = diagnose(node, { mode, inventory });

      return {
        id: node.id,
        name: node.name,
        cause: diagnosis.cause,
        letter: CAUSES[diagnosis.cause].letter,
        owner: CAUSES[diagnosis.cause].owner,
        remedy: CAUSES[diagnosis.cause].remedy,
        evidence: diagnosis.evidence,
        match: diagnosis.match
      };
    });

  /** @param {string[]} values */
  const tally = values => {
    /** @type {Record<string, number>} */
    const counts = {};

    for (const value of values.sort()) counts[value] = (counts[value] ?? 0) + 1;

    return counts;
  };

  // **The granularity filter.** The suggestions call enumerates the internals of every instance
  // alongside the design's own nodes, in one field with no discriminator. The traversal is the
  // discriminator: a suggested id the walk never saw is not a node of this design, it is a node
  // of the library the design consumes. Counting those here is how one walk of thirteen
  // instances becomes a hundred and thirty-five findings.
  const suggested = suggestions?.suggestions ?? [],
    libraryInternal = suggested.filter(one => !inDesign.has(one.nodeId));

  return {
    schemaVersion: 1,
    rootId: parsed.rootId,
    mode,
    modeSource,
    counts: {
      unresolved: unresolved.length,
      coveredByEnclosing: covered.length,
      byCause: tally(unresolved.map(one => `${CAUSES[one.cause].letter} ${one.cause}`)),
      byOwner: tally(unresolved.map(one => one.owner))
    },
    suggestions: suggestions
      ? {
          total: suggested.length,
          inDesign: suggested.length - libraryInternal.length,
          libraryInternal: libraryInternal.length,
          libraryInternalIds: libraryInternal.map(one => one.nodeId),
          // Kept as a count and a string, never executed. See the module comment.
          promptBlocks: suggestions.prompt.length
        }
      : null,
    // Carried rather than silently absent, as the task requires.
    notes: {
      F3b:
        'carried, not detected. An overridden instance resolves normally and emits a clean ' +
        'snippet, so it cannot appear in this list at all. Probed: get_code_connect_suggestions ' +
        'returns a Properties object per node, so an override of a *declared component property* ' +
        'is visible in the fetched data; an override of a fill, a hidden layer or retyped text ' +
        'inside an instance is not. The pixel diff stays the only detector for the dangerous half.',
      F4:
        'rejected here. "Could have used a design system component and did not" has no structural ' +
        'signature, and this task is accepted on the count being stable across two passes. An ' +
        'inference layer cannot carry that, and the analysis says it must never gate. It belongs ' +
        'in a report of its own, with its uncertainty on the face of it.'
    },
    unresolved
  };
};

// ---------------------------------------------------------------------------------------------

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? undefined : argv[i + 1];
};

if (import.meta.main) {
  const walkPath = arg('walk');

  if (!walkPath) {
    console.error(
      'usage: classify-unresolved.mjs --walk <walk.json> [--mode strict|as-is] ' +
        '[--suggestions <response.txt>] [--inventory <dir>] [--out <file>] [--no-halt]'
    );
    exit(2);
  }

  let report;

  try {
    const verdictPath = arg('verdict'),
      flagged = arg('mode'),
      mode = flagged ?? (verdictPath ? JSON.parse(readFileSync(verdictPath, 'utf8')).mode : null);

    if (!mode)
      throw new Error(
        'the mode is not known — pass --verdict from mode-decision.mjs, or --mode to assert it. ' +
          'Guessing it would turn a failed decision into a verdict'
      );

    const suggestionsPath = arg('suggestions');

    report = classify({
      walk: JSON.parse(readFileSync(walkPath, 'utf8')),
      mode,
      modeSource: flagged ? 'flag' : 'verdict',
      inventory: readInventory(arg('inventory') ?? DEFAULT_INVENTORY),
      suggestions: suggestionsPath ? parseSuggestions(readFileSync(suggestionsPath, 'utf8')) : null
    });
  } catch (error) {
    console.error(`${walkPath}: ${/** @type {Error} */ (error).message}`);
    exit(1);
  }

  const out = arg('out'),
    json = JSON.stringify(report, null, 2);

  if (out) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${json}\n`);
    console.error(`${report.rootId}: ${report.counts.unresolved} unresolved → ${out}`);
  } else {
    console.log(json);
  }

  const ours = report.unresolved.filter(one => one.owner === 'pipeline').length,
    theirs = report.unresolved.filter(one => one.owner === 'design-system-team').length;

  // Ours first. A diagnosis standing on a map we never read is not a diagnosis, and reporting
  // it as a mapping gap would send the design system team after our own bug.
  if (ours) exit(6);

  // The halt the plan keeps on purpose: in strict mode an unresolved design system component is
  // a defect. In as-is mode the same node is the second audience's content and stops nothing.
  if (report.mode === 'strict' && theirs && !argv.includes('--no-halt')) exit(5);
}
