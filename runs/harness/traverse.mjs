/**
 * Walks a Figma design, using Code Connect as the rule for how deep to go.
 *
 * Code Connect is not a verification step after capture — it decides **where to stop**.
 * `get_design_context` on a mapped node returned `<sl-grid></sl-grid>` for ten thousand nodes,
 * against ~233k tokens to expand the same node. So a call that fails does not lose a snippet. **It
 * loses the stopping rule**, and the fallback must fail open: descend, and record that it descended
 * because the map was unreadable rather than because the node was unmapped. Those two produce
 * identical markup and mean opposite things.
 *
 * Four behaviours of the Dev Mode server were measured on 2026-10-05 and the traversal is shaped by
 * all four:
 *
 * 1. **`get_metadata` is depth-limited, not subtree-complete.** A canvas listed six sections
 *    self-closed; asking one of those sections directly returned its children. A reader that
 *    treated the first response as the whole tree would have walked six empty boxes. So a childless
 *    container is enqueued rather than believed.
 * 2. **`get_metadata` stops at instance boundaries.** An instance arrives self-closed from its parent
 *    and yields its contents only when asked for by name — which is what makes pruning a mapped
 *    node a real saving rather than a bookkeeping entry.
 * 3. **The server emits node ids it will not accept.** Inside an instance the children come back as
 *    `I4195:33202;1514:155951`, and both tools reject that with `Node ID must be in the format
 *    "123:456"`. The id is not absent from Code Connect; it is unaskable, and the two have been
 *    read as the same thing.
 * 4. **Only the enclosing instance is askable.** Probed: the last segment `1514:155394` answers `No
 *    node could be found`, because it addresses a node inside a library component this document
 *    does not contain. The outermost segment answers.
 *
 * Usage: node runs/harness/traverse.mjs --root <nodeId> [--endpoint <url>] [--out <file>] node
 * runs/harness/traverse.mjs --root <nodeId> --expand-mapped # measures what pruning saved
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { argv, env, exit } from 'node:process';
import { z } from 'zod';

import { DEFAULT_ENDPOINT, openSession } from './mcp.mjs';

export { DEFAULT_ENDPOINT };

export const METADATA_TOOL = 'get_metadata';
export const MAP_TOOL = 'get_code_connect_map';

/** The only id shape either tool accepts — its own rejection message quotes this pattern. */
export const NODE_ID = /^\d+[:-]\d+$/;

/**
 * Tags that cannot have children, so a childless one is a leaf rather than a depth limit.
 *
 * The list is short **on purpose**: step 4 of the task is fail open, and anything not named here
 * that comes back childless gets a call of its own rather than a silent assumption.
 */
export const LEAF_TAGS = new Set([
  'text',
  'vector',
  'rectangle',
  'ellipse',
  'line',
  'polygon',
  'star',
  'image',
  'slice'
]);

/** Tags Code Connect can answer about. Everything else is structure the designer drew. */
export const PROBEABLE_TAGS = new Set(['instance', 'symbol', 'component', 'component-set']);

/**
 * @typedef {{
 *   tag: string;
 *   id: string;
 *   name: string | null;
 *   hidden: boolean;
 *   width: number;
 *   height: number;
 *   children: FigmaNode[];
 * }} FigmaNode
 *
 * @typedef {{ text: string; isError: boolean; kind: string }} ToolResult
 */

// ---------------------------------------------------------------------------------------------
// Node ids

/**
 * Splits a node id into the part the server will answer about and the path within it.
 *
 * `I4195:33202;1514:155951` is instance `4195:33202` and, inside it, the main component's node
 * `1514:155951`. Only the first segment exists in this document, so only the first is askable —
 * measured, not assumed: the last segment answers `No node could be found`.
 *
 * @param {string} id
 * @returns {{ id: string; nested: boolean; within: string[] | null }}
 */
export const probeTarget = id => {
  if (!id.startsWith('I') || !id.includes(';')) return { id, nested: false, within: null };

  const within = id.slice(1).split(';');

  return { id: within[0], nested: true, within };
};

// ---------------------------------------------------------------------------------------------
// Metadata

/**
 * Attribute values may contain `>`, so the tag reader skips over quoted runs rather than stopping
 * at the first `>` it meets.
 */
const TAG = /<(\/?)([\w-]+)((?:[^>"]|"[^"]*")*)>/g,
  ATTRIBUTE = /([\w-]+)="([^"]*)"/g;

/** @param {string} source @returns {Record<string, string>} */
const attributesOf = source =>
  Object.fromEntries([...source.matchAll(ATTRIBUTE)].map(([, name, value]) => [name, value]));

/**
 * Reads one `get_metadata` response into a tree.
 *
 * **A response with no element in it throws.** The server answers failures in prose — `No node
 * could be found for the provided nodeId` — and a parser that returned an empty tree for that would
 * report a leaf where the truth is that we never saw the node.
 *
 * @param {string} xml
 * @returns {FigmaNode}
 */
export const parseMetadata = xml => {
  /** @type {FigmaNode[]} */
  const stack = [];

  /** @type {FigmaNode | null} */
  let root = null;

  for (const [, closing, tag, source] of xml.matchAll(TAG)) {
    if (closing) {
      stack.pop();
      continue;
    }

    const attributes = attributesOf(source);

    if (!attributes.id) throw new Error(`<${tag}> carries no id`);

    /** @type {FigmaNode} */
    const node = {
      tag,
      id: attributes.id,
      name: attributes.name ?? null,
      hidden: attributes.hidden === 'true',
      width: Number(attributes.width ?? 0),
      height: Number(attributes.height ?? 0),
      children: []
    };

    if (stack.length) stack[stack.length - 1].children.push(node);
    else if (root) throw new Error(`the response carries more than one root element: <${tag}>`);
    else root = node;

    if (!source.trimEnd().endsWith('/')) stack.push(node);
  }

  if (!root) throw new Error(`the response carries no element: ${xml.slice(0, 120).trim()}`);

  return root;
};

// ---------------------------------------------------------------------------------------------
// The Code Connect map

/**
 * One entry as the tool really returns it.
 *
 * `snippet` and `label` are **optional** because five recorded entries across three corpus runs
 * carry neither: `{ componentName: null, source: ".../label.ts", version: "unknown", hasTemplate:
 * false }` is the identified-without-a-snippet case, and a schema that demanded a snippet would
 * have refused the exact shape step 3 of this task is about.
 */
export const MapEntry = z
  .object({
    source: z.string(),
    version: z.string(),
    hasTemplate: z.boolean(),
    label: z.string().optional(),
    snippet: z.string().optional(),
    componentName: z.string().nullable().optional()
  })
  .loose();

/** The tool answers with an object keyed by node id — `{}` when it resolves nothing. */
export const CodeConnectMap = z.record(z.string(), z.unknown());

/**
 * Splits a map response into entries the tool produced and keys it did not.
 *
 * Keys that are not node ids are kept as `annotations` rather than dropped: a recorded capture
 * carries `_note` alongside its probes, and silently ignoring unknown keys is how a reader stops
 * noticing that the format moved.
 *
 * @param {string} text
 * @returns {{ entries: Record<string, z.infer<typeof MapEntry>>; annotations: string[] }}
 */
export const readMap = text => {
  /** @type {unknown} */
  let body;

  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`the map is not JSON: ${text.slice(0, 120).trim()}`);
  }

  const parsed = CodeConnectMap.safeParse(body);

  if (!parsed.success) throw new Error(`the map is not an object keyed by node id`);

  /** @type {Record<string, z.infer<typeof MapEntry>>} */
  const entries = {};

  /** @type {string[]} */
  const annotations = [];

  for (const [key, value] of Object.entries(parsed.data)) {
    if (!NODE_ID.test(key)) {
      annotations.push(key);
      continue;
    }

    const entry = MapEntry.safeParse(value);

    if (!entry.success) {
      const [issue] = entry.error.issues;

      throw new Error(
        `${key}: the map entry is malformed — ${issue.message} at ${issue.path.join('.') || '(root)'}`
      );
    }

    entries[key] = entry.data;
  }

  return { entries, annotations };
};

/**
 * @typedef {{
 *   outcome: 'resolved' | 'mapped' | 'identified' | 'empty' | 'unreadable';
 *   detail: string | null;
 *   label: string | null;
 *   snippet: string;
 *   resolvedBy: string | null;
 *   entries: number;
 * }} Verdict
 *   `resolved` and `mapped` both mean Code Connect knows this node. They differ in whether a
 *   snippet came with the answer, which decides whether the traversal may stop here — and
 *   `resolvedBy` says which id answered, because it is often not the one that was asked.
 */

/** @param {string} text */
const firstLine = text => text.split('\n')[0].slice(0, 160).trim();

/**
 * Every key a node id might be looked up under.
 *
 * A node inside an instance arrives as `I334:20594;334:20605`, and the map keys the same node by
 * its **last segment**, `334:20605`. Comparing the two forms directly finds nothing — which is how
 * a map full of answers was read as empty.
 *
 * @param {string} id
 * @returns {string[]}
 */
const keysFor = id => {
  const plain = id.startsWith('I') ? id.slice(1) : id,
    segments = plain.split(';');

  return [...new Set([id, plain, ...segments, ...segments.map(one => one.replace(':', '-'))])];
};

/**
 * What one map response says about a node — **and about its subtree**.
 *
 * Probed 2026-10-06 on the remote server: `get_code_connect_map(334:20594)`, an `sl-avatar`,
 * returns entries for `334:20605`, `334:20610` and `334:20609` — Mask, Mask and Base/Icon, all
 * _inside_ the instance — and **nothing for `334:20594` itself**. Each entry carries `hasTemplate:
 * true` with **no `snippet` key**, which is the remote tool's map form; the snippet arrives only
 * when the exact node is asked for.
 *
 * A reader that looked up one id and demanded a snippet called that response empty and filed
 * `genuinely-unmapped`. In strict mode the classifier then sent **cause E** — _a mapping is
 * published and did not resolve_ — to the design system team, about an instance whose internals the
 * map had just resolved three of. Two successful answers, read as two absences.
 *
 * @param {ToolResult} answer
 * @param {string} nodeId
 * @param {string[]} [descendants] Ids below this node, in the form the metadata emits them
 * @returns {Verdict}
 */
export const classifyMap = (answer, nodeId, descendants = []) => {
  /** @type {Verdict} */
  const base = {
    outcome: 'empty',
    detail: null,
    label: null,
    snippet: '',
    resolvedBy: null,
    entries: 0
  };

  if (answer.isError) return { ...base, outcome: 'unreadable', detail: firstLine(answer.text) };

  /** @type {ReturnType<typeof readMap>} */
  let map;

  try {
    map = readMap(answer.text);
  } catch (error) {
    return { ...base, outcome: 'unreadable', detail: /** @type {Error} */ (error).message };
  }

  base.entries = Object.keys(map.entries).length;

  /** @param {string} id */
  const lookup = id => {
    for (const key of keysFor(id)) if (map.entries[key]) return { key, entry: map.entries[key] };

    return null;
  };

  const own = lookup(nodeId);

  if (own) {
    const { entry } = own;

    if (!entry.hasTemplate)
      return { ...base, outcome: 'identified', detail: entry.source, resolvedBy: own.key };

    // **The map form is not a contradiction.** `hasTemplate: true` with no snippet is what the
    // remote server sends, and the only honest reading is that the node is mapped and the
    // snippet was not in this response.
    if (!entry.snippet)
      return {
        ...base,
        outcome: 'mapped',
        detail: entry.source,
        label: entry.label ?? null,
        resolvedBy: own.key
      };

    return {
      ...base,
      outcome: 'resolved',
      label: entry.label ?? null,
      snippet: entry.snippet,
      resolvedBy: own.key
    };
  }

  // Nothing for the node itself. A descendant with a template still means Code Connect knows this
  // subtree — but only a template: `hasTemplate: false` below a node says nothing about the node,
  // and promoting it would be the same substitution in the other direction.
  for (const descendant of descendants) {
    const below = lookup(descendant);

    if (below?.entry.hasTemplate)
      return {
        ...base,
        outcome: 'mapped',
        detail: `answered by ${below.key}: ${below.entry.source}`,
        label: below.entry.label ?? null,
        resolvedBy: below.key
      };
  }

  return base;
};

/**
 * How long an honest empty map is allowed to take.
 *
 * Measured 2026-10-05 against the Dev Mode server: a rejected id answers in 0.09 s, a node that
 * does not exist in 0.4 s, and **every valid node answers `{}` after 30.6–31.1 s** — five samples,
 * the same plateau for a 36×36 button instance and for a 240×720 symbol holding twenty nodes. A
 * lookup whose cost does not vary with what it is looking through is not a lookup. It is a timeout,
 * and `{}` is what the timeout returns.
 *
 * This is the task's own distinction arriving in the wild: the markup is identical and the meanings
 * are opposite. The budget is the only thing that separates them, so it is a parameter and it is
 * recorded in the report rather than compiled in as a constant nobody can see.
 */
export const SLOW_MAP_MS = 10_000;

/**
 * Downgrades an empty map that took too long from an absence to a failure.
 *
 * @param {Verdict} verdict
 * @param {number} ms
 * @param {number} [budget]
 * @returns {Verdict}
 */
export const applyBudget = (verdict, ms, budget = SLOW_MAP_MS) =>
  verdict.outcome === 'empty' && ms >= budget
    ? {
        ...verdict,
        outcome: 'unreadable',
        detail:
          `the map answered empty after ${ms} ms, at or past the ${budget} ms budget — ` +
          `a call that slow has timed out, and a timeout is not an absence`
      }
    : verdict;

/**
 * Why the traversal went deeper. `genuinely-unmapped` and `map-unreadable` produce identical markup
 * and mean opposite things, which is the whole reason the reason is recorded.
 */
export const DESCENT_REASON = /** @type {Record<string, string>} */ ({
  empty: 'genuinely-unmapped',
  unreadable: 'map-unreadable',
  identified: 'identified-without-snippet'
});

// ---------------------------------------------------------------------------------------------
// The traversal

/**
 * @typedef {{
 *   id: string;
 *   tag: string;
 *   name: string | null;
 *   disposition:
 *     | 'root'
 *     | 'resolved'
 *     | 'mapped'
 *     | 'descended'
 *     | 'inline'
 *     | 'nested'
 *     | 'hidden'
 *     | 'unreadable-metadata';
 *   reason: string | null;
 *   probedAs: string | null;
 *   resolvedBy: string | null;
 *   detail: string | null;
 *   snippetBytes: number;
 *   ms: number;
 * }} Record_
 */

/** @type {(node: Pick<FigmaNode, 'id' | 'tag' | 'name'>, fields: Partial<Record_>) => Record_} */
const record = (node, fields) => ({
  id: node.id,
  tag: node.tag,
  name: node.name,
  disposition: 'inline',
  reason: null,
  probedAs: null,
  resolvedBy: null,
  detail: null,
  snippetBytes: 0,
  ms: 0,
  ...fields
});

/**
 * Walks the design and returns what it decided about every node it met.
 *
 * The two fetchers are injected so the traversal can be run against a live session, a recorded
 * corpus, or a stub that fails on cue — the last being the only way to prove that an unreadable map
 * is recorded as unreadable rather than as an absence.
 *
 * @param {{
 *   rootId: string;
 *   getMetadata: (id: string) => Promise<ToolResult>;
 *   getMap: (id: string) => Promise<ToolResult>;
 *   expandMapped?: boolean;
 *   maxNodes?: number;
 *   slowMapMs?: number;
 *   endpoint?: string | null;
 * }} options
 */
export const traverse = async ({
  rootId,
  getMetadata,
  getMap,
  expandMapped = false,
  maxNodes = 2000,
  slowMapMs = SLOW_MAP_MS,
  endpoint = null
}) => {
  /** @type {{ id: string; within: { id: string; outcome: string } | null }[]} */
  const frontier = [{ id: rootId, within: null }];

  const queued = new Set([rootId]),
    seen = new Set(),
    calls = { metadata: 0, map: 0 };

  /** @type {Record_[]} */
  const records = [];

  let metadataBytes = 0,
    snippetBytes = 0,
    truncated = false;

  /**
   * One metadata call per node, however many times the walk wants it.
   *
   * It exists because of the defect this task fixes: deciding whether a map answered about a node's
   * subtree needs that subtree's ids, and at an instance boundary `get_metadata` has not produced
   * them yet. The children are fetched at the moment the question is asked — which is the same call
   * the frontier was about to make — and the cache keeps it one call.
   *
   * @type {Map<string, ToolResult>}
   */
  const metadataCache = new Map();

  /** @param {string} id */
  const metadataOf = async id => {
    const cached = metadataCache.get(id);

    if (cached) return cached;

    calls.metadata += 1;

    const answer = await getMetadata(id);

    metadataCache.set(id, answer);
    metadataBytes += answer.text.length;

    return answer;
  };

  /** @param {string} id @param {{ id: string; outcome: string } | null} within */
  const enqueue = (id, within) => {
    if (queued.has(id)) return;

    queued.add(id);
    frontier.push({ id, within });
  };

  /** @param {FigmaNode} node @param {{ id: string; outcome: string } | null} within */
  const visit = async (node, within) => {
    if (seen.has(node.id)) return;
    if (records.length >= maxNodes) {
      truncated = true;

      return;
    }

    seen.add(node.id);

    // A hidden subtree is excluded, and the exclusion is written down. Dropping it quietly is how
    // a count of what was captured stops meaning anything.
    if (node.hidden) {
      records.push(record(node, { disposition: 'hidden', reason: 'hidden-in-the-design' }));

      return;
    }

    const target = probeTarget(node.id);

    // Unaskable, not unmapped. The enclosing instance already answered for this node, and that
    // answer is carried here rather than replaced by a `{}` the server never sent.
    if (target.nested) {
      records.push(
        record(node, {
          disposition: 'nested',
          reason: 'nested-id-not-probeable',
          probedAs: within?.id ?? target.id,
          detail: within ? `answered by ${within.id}: ${within.outcome}` : null
        })
      );

      for (const child of node.children) await visit(child, within);

      return;
    }

    if (PROBEABLE_TAGS.has(node.tag)) {
      calls.map += 1;

      // The map is asked about this node and answers about its subtree, so the subtree's ids are
      // what settle it. They are not in hand here: `get_metadata` stops at instance boundaries,
      // which is exactly where this matters, so they are fetched below — once, and only when
      // there is something to settle.
      /** @type {string[]} */
      const below = [];

      /** @param {FigmaNode} one */
      const collect = one => {
        for (const child of one.children) {
          below.push(child.id);
          collect(child);
        }
      };

      const started = Date.now(),
        answer = await getMap(target.id),
        ms = Date.now() - started;

      let verdict = applyBudget(classifyMap(answer, target.id, below), ms, slowMapMs);

      // **The map held answers and none of them was this node.** At an instance boundary `below`
      // is empty, because metadata stops there — so the children that would settle it have to be
      // asked for. Only when there is something to settle: an empty map needs no second call.
      if (verdict.outcome === 'empty' && verdict.entries > 0 && !below.length) {
        const deeper = await metadataOf(target.id);

        if (!deeper.isError) {
          try {
            collect(parseMetadata(deeper.text));
          } catch {
            // An unreadable expansion leaves the first verdict standing; it is not evidence.
          }

          if (below.length)
            verdict = applyBudget(classifyMap(answer, target.id, below), ms, slowMapMs);
        }
      }

      if (verdict.outcome === 'mapped') {
        // Mapped, and no snippet to stop with. The node is **not** a descent — nothing about it
        // is unresolved — but its content still has to come from somewhere, so the walk goes on.
        records.push(
          record(node, {
            disposition: 'mapped',
            probedAs: target.id,
            resolvedBy: verdict.resolvedBy,
            detail: verdict.detail,
            ms
          })
        );

        enqueue(node.id, { id: target.id, outcome: verdict.outcome });

        for (const child of node.children)
          await visit(child, { id: target.id, outcome: verdict.outcome });

        return;
      }

      if (verdict.outcome === 'resolved') {
        snippetBytes += verdict.snippet.length;

        records.push(
          record(node, {
            disposition: 'resolved',
            probedAs: target.id,
            resolvedBy: verdict.resolvedBy,
            detail: verdict.label,
            snippetBytes: verdict.snippet.length,
            ms
          })
        );

        // **The stopping rule.** The snippet is the node's content; expanding it would buy the
        // same markup at four orders of magnitude more tokens.
        if (!expandMapped) return;
      } else {
        records.push(
          record(node, {
            disposition: 'descended',
            reason: DESCENT_REASON[verdict.outcome],
            probedAs: target.id,
            resolvedBy: null,
            detail: verdict.detail,
            ms
          })
        );
      }

      enqueue(node.id, { id: target.id, outcome: verdict.outcome });

      for (const child of node.children)
        await visit(child, { id: target.id, outcome: verdict.outcome });

      return;
    }

    records.push(record(node, { disposition: 'inline' }));

    // Fail open. A container that came back childless is either empty or past the server's depth
    // limit, and only a call of its own tells the two apart.
    if (!node.children.length && !LEAF_TAGS.has(node.tag)) enqueue(node.id, within);

    for (const child of node.children) await visit(child, within);
  };

  while (frontier.length) {
    if (records.length >= maxNodes) {
      truncated = true;
      break;
    }

    const next = /** @type {{ id: string; within: { id: string; outcome: string } | null }} */ (
      frontier.shift()
    );

    const answer = await metadataOf(next.id);

    if (answer.isError) {
      records.push({
        id: next.id,
        tag: 'unknown',
        name: null,
        disposition: 'unreadable-metadata',
        reason: 'metadata-unreadable',
        probedAs: next.id,
        resolvedBy: null,
        detail: firstLine(answer.text),
        snippetBytes: 0,
        ms: 0
      });

      continue;
    }

    /** @type {FigmaNode} */
    let root;

    try {
      root = parseMetadata(answer.text);
    } catch (error) {
      records.push({
        id: next.id,
        tag: 'unknown',
        name: null,
        disposition: 'unreadable-metadata',
        reason: 'metadata-unreadable',
        probedAs: next.id,
        resolvedBy: null,
        detail: /** @type {Error} */ (error).message,
        snippetBytes: 0,
        ms: 0
      });

      continue;
    }

    if (next.id === rootId) {
      seen.add(root.id);
      records.push(record(root, { disposition: 'root' }));
    }

    for (const child of root.children) await visit(child, next.within);
  }

  /** @param {Record_['disposition']} disposition */
  const countOf = disposition => records.filter(entry => entry.disposition === disposition).length;

  /** @type {Record<string, number>} */
  const descents = {};

  for (const entry of records.filter(one => one.disposition === 'descended')) {
    if (entry.reason) descents[entry.reason] = (descents[entry.reason] ?? 0) + 1;
  }

  return {
    schemaVersion: 1,
    rootId,
    // **Which server answered.** Two servers publish the same tool names and do not answer the
    // same way; a report that does not say which one spoke cannot be compared with another.
    endpoint,
    expandedMapped: expandMapped,
    slowMapMs,
    complete: !truncated,
    calls,
    bytes: { metadata: metadataBytes, snippets: snippetBytes },
    counts: {
      root: countOf('root'),
      resolved: countOf('resolved'),
      mapped: countOf('mapped'),
      descended: countOf('descended'),
      inline: countOf('inline'),
      nested: countOf('nested'),
      hidden: countOf('hidden'),
      unreadableMetadata: countOf('unreadable-metadata')
    },
    descents,
    pruned: expandMapped
      ? []
      : records.filter(one => one.disposition === 'resolved').map(one => one.id),
    nodes: records
  };
};

// ---------------------------------------------------------------------------------------------

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? undefined : argv[i + 1];
};

if (import.meta.main) {
  const rootId = arg('root'),
    endpoint = arg('endpoint');

  const usage =
    'usage: traverse.mjs --root <nodeId as 123:456> --endpoint <url> [--out <file>] ' +
    '[--expand-mapped] [--max-nodes <n>] [--slow-map-ms <ms>] [--allow-truncated] ' +
    `[--allow-unreadable]\n  the Dev Mode server on this machine is ${DEFAULT_ENDPOINT}`;

  if (!rootId || !NODE_ID.test(rootId)) {
    console.error(usage);
    exit(2);
  }

  // **No default endpoint.** Two servers publish these tool names and do not answer the same
  // way: the Dev Mode server on this machine answers every valid node `{}` after ~31 s and
  // publishes neither task 01's tool nor the remote map form, and the remote one publishes both
  // and needs an OAuth credential. A default silently picks one of those worlds, and the report
  // that comes out cannot be compared with one from the other.
  if (!endpoint) {
    console.error(`traverse.mjs: --endpoint is required, and has no default.\n${usage}`);
    exit(2);
  }

  let report;

  try {
    const session = await openSession({ endpoint, token: env.FIGMA_MCP_TOKEN });

    report = await traverse({
      rootId,
      endpoint: session.endpoint,
      getMetadata: id => session.call(METADATA_TOOL, { nodeId: id }),
      getMap: id => session.call(MAP_TOOL, { nodeId: id }),
      expandMapped: argv.includes('--expand-mapped'),
      maxNodes: Number(arg('max-nodes') ?? 2000),
      slowMapMs: Number(arg('slow-map-ms') ?? SLOW_MAP_MS)
    });
  } catch (error) {
    console.error(`${rootId}: ${/** @type {Error} */ (error).message}`);
    exit(1);
  }

  const out = arg('out'),
    json = JSON.stringify(report, null, 2);

  if (out) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${json}\n`);
    console.error(`${rootId}: ${report.nodes.length} nodes → ${out}`);
  } else {
    console.log(json);
  }

  // A traversal that ran out of budget has not seen the design, and a descent that happened
  // because the map could not be read has lost the stopping rule rather than found an absence.
  // Either one makes every count downstream a floor, not a figure, so it leaves by a non-zero
  // exit unless the operator says they already know.
  if (!report.complete && !argv.includes('--allow-truncated')) exit(3);
  if (report.descents['map-unreadable'] && !argv.includes('--allow-unreadable')) exit(4);
}
