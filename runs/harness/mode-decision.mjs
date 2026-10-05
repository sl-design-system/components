/**
 * Decides, once per Figma file, whether a design is ours to render strictly or someone else's.
 *
 * A design drawn in another library is not a blocked run; it is the second audience. The batch
 * decided that from the product name and was wrong both times it guessed — two NSP designs resolve
 * to two different themes. The file itself carries the answer: **what its own components depend
 * on**. A file whose components depend on `sl-button-pill` consumes the design system; one whose
 * components depend on `Cell` consumes itslearning's.
 *
 * Probed 2026-10-05 and recorded in `code-connect-explained.md`: Course-files publishes 13
 * components depending on `Cell`, `.Main menu`, `.Navigation item`, `your-files` and **zero
 * `sl-*`**; SANNA publishes 153 depending on **24 distinct `sl-*`**. Neither file publishes an
 * `sl-*` component itself, which is right — product files consume a library, they do not republish
 * it. So the discriminator is `dependencies[].name`, never the component list.
 *
 * **The response is never read whole.** It was 2.18 MB on SANNA's 153 components. It streams to
 * disk and is scanned in 64 KiB windows, so neither this process nor a context window ever holds
 * it. That is a hard requirement, not an optimisation.
 *
 * Usage: node runs/harness/mode-decision.mjs --file <fileKey> [--version <v>] [--endpoint <url>]
 * node runs/harness/mode-decision.mjs --from <components.json> --file <fileKey> [--version <v>]
 * node runs/harness/mode-decision.mjs --from <f> --file <k> --json
 */
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { argv, env, exit } from 'node:process';
import { open } from 'node:fs/promises';
import { z } from 'zod';

/**
 * @typedef {Map<string, number>} Externals External component name → how many of the file's
 *   components depend on it.
 *
 * @typedef {{
 *   slds: string[];
 *   sldsCount: number;
 *   other: string[];
 *   otherCount: number;
 *   dependents: Record<string, number>;
 * }} Evidence
 *
 * @typedef {{ mode: 'strict' | 'as-is' | 'undecided'; reason: string; evidence: Evidence }} Verdict
 */

const HERE = dirname(fileURLToPath(import.meta.url));

/** Twelve files hold the nineteen designs, so a cache turns nineteen calls into twelve. */
export const CACHE_DIR = join(HERE, '.mode-cache');

/** The Dev Mode server on this machine. It does not publish the per-file call; the remote does. */
export const DEFAULT_ENDPOINT = 'http://127.0.0.1:3845/mcp';

export const TOOL = 'list_file_components_for_code_connect';

/**
 * A dependency entry is `{ name, external, assetKey }`; a component entry has a `name` and an
 * `assetKey` but no `external`. So **`external: true` is the discriminator** — it separates "the
 * file depends on `Cell`" from "the file publishes a component called `courses`", which is the
 * distinction the whole decision rests on.
 *
 * Two things here were wrong on the first attempt, both found by reading live responses rather than
 * the probe's prose about them:
 *
 * - The pattern paired `name` directly with `assetKey`, and `external` sits between them;
 * - It only understood bare JSON, while a response arrives **wrapped in the MCP content envelope with
 *   the payload as an escaped string** — `\"name\": \"sl-avatar\"`, and `\n` for the newlines. It
 *   found zero externals in 60 KB of real response.
 *
 * So quotes are optionally backslash-escaped and gaps accept literal `\n` as well as whitespace.
 * Both key orders are accepted, because the field order is not promised anywhere.
 */
const QUOTE = String.raw`\\?"`,
  GAP = String.raw`(?:\s|\\[nrt])*`,
  NAME = String.raw`([^"\\]+)`,
  EXTERNAL = new RegExp(
    `${QUOTE}name${QUOTE}${GAP}:${GAP}${QUOTE}${NAME}${QUOTE}${GAP},${GAP}${QUOTE}external${QUOTE}${GAP}:${GAP}true` +
      `|${QUOTE}external${QUOTE}${GAP}:${GAP}true${GAP},${GAP}${QUOTE}name${QUOTE}${GAP}:${GAP}${QUOTE}${NAME}${QUOTE}`,
    'g'
  );

/** Enough to span any single dependency entry, so no match is lost on a window boundary. */
const OVERLAP = 4096;

/** The window the scanner reads in, and the only part of a response that is ever validated. */
export const WINDOW = 65536;

// ---------------------------------------------------------------------------------------------
// The boundary
//
// The response is never read whole — 2.18 MB on SANNA's 153 components — so a schema over the
// parsed document is not available to us and never will be. What *is* available is the first
// window, and it is enough to answer the two questions whose wrong answers shipped: which of the
// two shapes is this, and do its components carry `dependencies[].external` at all.
//
// This is a deliberately narrow contract. It does not certify the response; it refuses one the
// reader would otherwise scan to a confident zero.

/** One component as this tool needs it: a name, and dependencies that declare externality. */
export const ComponentEntry = z
  .object({
    name: z.string(),
    dependencies: z.array(z.object({ name: z.string(), external: z.boolean() }).loose())
  })
  .loose();

/** The MCP content envelope, whose payload is the components JSON as an escaped string. */
export const EnvelopePart = z.object({ type: z.literal('text'), text: z.string() }).loose();

/**
 * Undo the escaping the MCP envelope applies to its payload.
 *
 * This is the half of the boundary that matters most: a response in this shape was scanned as
 * though it were bare JSON and **found zero externals in 60 KB**, which reads downstream as "this
 * file has no dependencies".
 *
 * @param {string} text
 */
export const unescapePayload = text => {
  let out = '';

  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '\\') {
      out += text[i];
      continue;
    }

    const next = text[++i];

    out += next === 'n' ? '\n' : next === 't' ? '\t' : next === 'r' ? '\r' : (next ?? '');
  }

  return out;
};

/**
 * The first balanced `{…}` in a string, or `null` when the window ends before it closes. Strings
 * and their escapes are respected, so a brace inside a value never ends the object.
 *
 * @param {string} text
 * @param {number} [from]
 */
export const firstJsonObject = (text, from = 0) => {
  const start = text.indexOf('{', from);

  if (start === -1) return null;

  let depth = 0,
    inString = false;

  for (let i = start; i < text.length; i++) {
    const character = text[i];

    if (inString) {
      if (character === '\\') i++;
      else if (character === '"') inString = false;
      continue;
    }

    if (character === '"') inString = true;
    else if (character === '{') depth++;
    else if (character === '}' && --depth === 0) return text.slice(start, i + 1);
  }

  return null;
};

/** @typedef {{ shape: 'bare' | 'envelope'; declaresExternals: boolean; firstComponent: string }} Shape */

/**
 * Decide which shape the response is in and confirm its components are the thing this tool scans
 * for. Throws, naming what was expected, when it is neither.
 *
 * Only the window is examined. Nothing here grows with the size of the response.
 *
 * @param {string} window The first {@link WINDOW} bytes of the response
 * @returns {Shape}
 */
export const inspectFirstWindow = window => {
  const expected =
    'expected either a bare JSON array of components, or the MCP envelope ' +
    '[{"type":"text","text":"<escaped components JSON>"}]';

  if (!window.trim()) throw new Error(`empty response: ${expected}`);

  const head = firstJsonObject(window);

  // An envelope's first object is the content part, whose `text` holds the whole payload — so it
  // does not close inside the window, and `firstJsonObject` returning null is itself the signal.
  const envelopeKey = window.match(/"type"\s*:\s*"text"\s*,\s*"text"\s*:\s*"/);

  if (envelopeKey) {
    EnvelopePart.parse({ type: 'text', text: '' });

    const payload = unescapePayload(window.slice((envelopeKey.index ?? 0) + envelopeKey[0].length)),
      first = firstJsonObject(payload);

    if (!first) throw new Error(`MCP envelope carries no component object in its first window`);

    const parsed = ComponentEntry.safeParse(JSON.parse(first));

    if (!parsed.success)
      throw new Error(
        `MCP envelope payload is not a component list: ${parsed.error.issues[0].message} at ` +
          `${parsed.error.issues[0].path.join('.') || '(root)'}`
      );

    return {
      shape: 'envelope',
      declaresExternals: /\\?"external\\?"\s*:\s*true/.test(window),
      firstComponent: parsed.data.name
    };
  }

  if (!head) throw new Error(`no JSON object in the first ${WINDOW} bytes: ${expected}`);

  let candidate;

  try {
    candidate = JSON.parse(head);
  } catch {
    throw new Error(`the first JSON object is unparseable: ${expected}`);
  }

  const parsed = ComponentEntry.safeParse(candidate);

  if (!parsed.success)
    throw new Error(
      `${parsed.error.issues[0].message} at ${parsed.error.issues[0].path.join('.') || '(root)'} — ${expected}`
    );

  return {
    shape: 'bare',
    declaresExternals: /"external"\s*:\s*true/.test(window),
    firstComponent: parsed.data.name
  };
};

/**
 * The first {@link WINDOW} bytes of a file, and not one byte more.
 *
 * @param {string} path
 */
export const readFirstWindow = async path => {
  const handle = await open(path, 'r');

  try {
    const buffer = Buffer.alloc(WINDOW),
      { bytesRead } = await handle.read(buffer, 0, WINDOW, 0);

    return buffer.subarray(0, bytesRead).toString('utf8');
  } finally {
    await handle.close();
  }
};

/**
 * Every external the file's components depend on, with how many components depend on each.
 *
 * Streams. A 2.18 MB response is read in 64 KiB windows that overlap by `OVERLAP` bytes, and
 * matches are de-duplicated by absolute offset so the overlap never double-counts.
 */
/** @param {string} path @returns {Promise<Externals>} */
export const externalsOf = async path => {
  const externals = new Map(),
    seen = new Set();
  let tail = '',
    base = 0;

  for await (const chunk of createReadStream(path, { encoding: 'utf8', highWaterMark: 65536 })) {
    const window = tail + chunk;

    for (const match of window.matchAll(EXTERNAL)) {
      const at = base + match.index;

      if (seen.has(at)) continue;
      seen.add(at);

      const name = match[1] ?? match[2];

      externals.set(name, (externals.get(name) ?? 0) + 1);
    }

    const keep = Math.min(OVERLAP, window.length);

    base += window.length - keep;
    tail = window.slice(window.length - keep);
  }

  return externals;
};

/** @param {string} name */
const isSlds = name => name.startsWith('sl-');

/**
 * Strict when the file's components depend on ours, as-is when they depend on another library's.
 *
 * **No externals at all is `undecided`, never `as-is`.** An empty Code Connect result is five
 * causes wearing one symptom — retrieval failure, a rejected nested id, another library, an
 * unwritten mapping, a stale one — and only the third means "someone else's design". Reading it as
 * a verdict turns a failed call into a decision, which is the exact mistake the batch made.
 */
/** @param {Externals} externals @returns {Verdict} */
export const classify = externals => {
  const slds = [...externals.keys()].filter(isSlds).sort(),
    other = [...externals.keys()].filter(name => !isSlds(name)).sort(),
    evidence = {
      slds,
      sldsCount: slds.length,
      other,
      otherCount: other.length,
      dependents: Object.fromEntries([...externals].sort(([a], [b]) => a.localeCompare(b)))
    };

  if (slds.length)
    return {
      mode: 'strict',
      reason: `${slds.length} distinct sl-* externals, e.g. ${slds.slice(0, 3).join(', ')}`,
      evidence
    };

  if (other.length)
    return {
      mode: 'as-is',
      reason: `no sl-* externals; depends on ${other.slice(0, 3).join(', ')}`,
      evidence
    };

  return {
    mode: 'undecided',
    reason:
      'no externals were found — an empty result is five causes wearing one symptom and is not evidence of another library',
    evidence
  };
};

/** @param {string} cache @param {string} fileKey @param {string} version @param {string} extension */
const cacheFile = (cache, fileKey, version, extension) =>
  join(cache, `${fileKey}@${version}${extension}`);

/**
 * Calls the tool and writes the response straight to `path`, byte by byte. The body is never
 * assembled in memory and never returned, only its location.
 */
/**
 * @param {string} path
 * @param {{ fileKey: string; endpoint?: string; token?: string }} options
 * @returns {Promise<string>} Where the response was written — never its contents
 */
export const fetchComponentsTo = async (path, { fileKey, endpoint = DEFAULT_ENDPOINT, token }) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const handshake = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'slds-harness', version: '0.1.0' }
      }
    })
  });

  if (!handshake.ok) throw new Error(`${endpoint} refused the handshake: ${handshake.status}`);

  const session = handshake.headers.get('mcp-session-id');

  await handshake.body?.cancel();

  const withSession = { ...headers, ...(session ? { 'mcp-session-id': session } : {}) };

  await fetch(endpoint, {
    method: 'POST',
    headers: withSession,
    body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })
  }).then(response => response.body?.cancel());

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: withSession,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: TOOL, arguments: { fileKey } }
    })
  });

  if (!response.ok) throw new Error(`${TOOL} failed: ${response.status} ${response.statusText}`);
  if (!response.body) throw new Error(`${TOOL} returned no body`);

  mkdirSync(dirname(path), { recursive: true });
  await pipeline(Readable.fromWeb(response.body), createWriteStream(path));

  return path;
};

/**
 * The verdict for one file and version, from cache when there is one.
 *
 * Nineteen designs sit in twelve files, so the second design from a file costs nothing.
 */
/**
 * @param {{
 *   fileKey: string;
 *   version?: string;
 *   from?: string;
 *   cache?: string;
 *   endpoint?: string;
 *   token?: string;
 *   fetchTo?: (
 *     path: string,
 *     options: { fileKey: string; endpoint?: string; token?: string }
 *   ) => Promise<string>;
 * }} options
 * @returns {Promise<
 *   Verdict & {
 *     fileKey: string;
 *     version: string;
 *     shape: 'bare' | 'envelope';
 *     source: string;
 *     tool: string;
 *     decidedAt: string;
 *     cached: boolean;
 *   }
 * >}
 */
export const decide = async ({
  fileKey,
  version = 'unknown',
  from,
  cache = CACHE_DIR,
  endpoint,
  token,
  fetchTo = fetchComponentsTo
}) => {
  const verdictPath = cacheFile(cache, fileKey, version, '.verdict.json');

  if (existsSync(verdictPath))
    return { ...JSON.parse(readFileSync(verdictPath, 'utf8')), cached: true };

  const source =
    from ??
    (await fetchTo(cacheFile(cache, fileKey, version, '.json'), { fileKey, endpoint, token }));

  // Validate the shape before scanning, and never after: a scan of the wrong shape does not fail,
  // it succeeds at finding nothing.
  const shape = inspectFirstWindow(await readFirstWindow(source)),
    externals = await externalsOf(source);

  // The exact defect that shipped, turned into a check. The window declared externals and the
  // scanner found none across the whole file — that is the reader being broken, not the file
  // having no dependencies, and the two are indistinguishable in the output.
  if (shape.declaresExternals && externals.size === 0)
    throw new Error(
      `${source}: the response declares "external": true in its first ${WINDOW} bytes and the ` +
        `scanner found none in the whole file — the reader is wrong, not the file`
    );

  const verdict = {
    fileKey,
    version,
    shape: shape.shape,
    ...classify(externals),
    source,
    tool: TOOL,
    decidedAt: new Date().toISOString()
  };

  mkdirSync(cache, { recursive: true });
  writeFileSync(verdictPath, `${JSON.stringify(verdict, null, 2)}\n`);

  return { ...verdict, cached: false };
};

// Only when run, never when imported: the test loads the classifier from this module.
if (import.meta.main) {
  /** @param {string} name */
  const arg = name => {
    const i = argv.indexOf(`--${name}`);

    return i === -1 ? undefined : argv[i + 1];
  };

  const fileKey = arg('file');

  if (!fileKey) {
    console.error(
      'usage: mode-decision.mjs --file <fileKey> [--version <v>] [--from <components.json>] [--endpoint <url>] [--json]'
    );
    exit(2);
  }

  const verdict = await decide({
    fileKey,
    version: arg('version') ?? 'unknown',
    from: arg('from'),
    cache: arg('cache') ?? CACHE_DIR,
    endpoint: arg('endpoint'),
    token: arg('token') ?? env.FIGMA_MCP_TOKEN
  });

  if (argv.includes('--json')) console.log(JSON.stringify(verdict, null, 2));
  else {
    console.log(`${verdict.fileKey}@${verdict.version}  ${verdict.mode.toUpperCase()}`);
    console.log(`  because ${verdict.reason}`);
    console.log(
      `  sl-*  (${verdict.evidence.sldsCount}): ${verdict.evidence.slds.join(', ') || '—'}`
    );
    console.log(
      `  other (${verdict.evidence.otherCount}): ${verdict.evidence.other.join(', ') || '—'}`
    );
    console.log(`  ${verdict.cached ? 'from cache' : 'decided now'}, source ${verdict.source}`);
  }

  if (verdict.mode === 'undecided') exit(1);
}
