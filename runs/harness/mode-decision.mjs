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

/**
 * Every external the file's components depend on, with how many components depend on each.
 *
 * Streams. A 2.18 MB response is read in 64 KiB windows that overlap by `OVERLAP` bytes, and
 * matches are de-duplicated by absolute offset so the overlap never double-counts.
 */
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

const isSlds = name => name.startsWith('sl-');

/**
 * Strict when the file's components depend on ours, as-is when they depend on another library's.
 *
 * **No externals at all is `undecided`, never `as-is`.** An empty Code Connect result is five
 * causes wearing one symptom — retrieval failure, a rejected nested id, another library, an
 * unwritten mapping, a stale one — and only the third means "someone else's design". Reading it as
 * a verdict turns a failed call into a decision, which is the exact mistake the batch made.
 */
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

const cacheFile = (cache, fileKey, version, extension) =>
  join(cache, `${fileKey}@${version}${extension}`);

/**
 * Calls the tool and writes the response straight to `path`, byte by byte. The body is never
 * assembled in memory and never returned, only its location.
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

  const verdict = {
    fileKey,
    version,
    ...classify(await externalsOf(source)),
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
