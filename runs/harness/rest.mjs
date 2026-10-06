/**
 * The Figma REST transport — the half of the contract that `mcp.mjs` cannot reach.
 *
 * Probed 2026-10-06 with a personal access token: `mcp.figma.com` answers **401** and names the
 * header it wants, `api.figma.com` answers **200**. So the document model comes from here and the
 * interpreted views — `get_design_context`'s markup, Code Connect's snippets — stay with the
 * editor. Neither supersedes the other; this module exists so both sides can be on disk.
 *
 * Two disciplines are load-bearing and are the reason this is a module rather than a `curl`:
 *
 * 1. **A response is never returned, only located.** `getTo` streams the body to a file and hands back
 *    a record. A 287 MB document cannot pass through a context window, and a response that is read
 *    by something that _may_ summarise it eventually will be.
 * 2. **The hash is taken from the bytes as they are written**, not from a re-read, so the record
 *    attests to the write rather than to a second opinion about it.
 */
import { createWriteStream, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

/** The API that answered the token. `mcp.figma.com` refused it whatever its scopes. */
export const REST_BASE = 'https://api.figma.com/v1';

/**
 * Figma named this header back when it rejected `Authorization: Bearer` — _"figd_ tokens must be
 * passed via X-Figma-Token header"_. The token therefore never appears in a URL, which is what
 * makes a call record safe to commit.
 */
export const TOKEN_HEADER = 'X-Figma-Token';

/**
 * @typedef {{
 *   url: string;
 *   status: number;
 *   ok: boolean;
 *   ms: number;
 *   bytes: number;
 *   sha256: string | null;
 *   file: string | null;
 *   retryAfter: number | null;
 *   error: string | null;
 *   reused?: boolean;
 * }} CallRecord
 *   A stored response and everything needed to check it later without the token.
 */

/** @param {string} key */
const requireKey = key => {
  if (!key?.trim()) throw new Error('a file key is required; a blank one asks for nothing');

  return key.trim();
};

/**
 * `ids` is a comma-separated list on the wire, so an id containing a comma becomes two ids and the
 * response quietly answers a different question. That is exactly the class of fault this plan
 * exists to remove, so it is refused at the boundary.
 *
 * @param {string[]} ids
 */
const requireIds = ids => {
  if (!ids?.length) throw new Error('at least one node id is required');

  for (const id of ids) {
    if (!id?.trim()) throw new Error('a blank node id is not a node');
    if (id.includes(','))
      throw new Error(`"${id}" contains the separator and would become two ids`);
  }

  return ids.join(',');
};

/**
 * One frame and its complete subtree. **This is the call that matters**: for a8's frame it returned
 * 620 nodes where `get_metadata` reported 98, because REST descends through instance boundaries and
 * MCP stops at them.
 *
 * @param {string} fileKey
 * @param {string[]} ids
 * @param {{ base?: string; depth?: number; geometry?: string }} [options]
 */
export const nodesUrl = (fileKey, ids, { base = REST_BASE, depth, geometry } = {}) => {
  const query = new URLSearchParams({ ids: requireIds(ids) });

  if (depth !== undefined) query.set('depth', String(depth));
  if (geometry !== undefined) query.set('geometry', geometry);

  return `${base}/files/${requireKey(fileKey)}/nodes?${query}`;
};

/**
 * The whole document. Measured at **287 MB and 96 s for 200 248 nodes**, with no pagination and no
 * depth limit — worth taking once as ground truth and keeping out of git.
 *
 * @param {string} fileKey
 * @param {{ base?: string; depth?: number }} [options]
 */
export const fileUrl = (fileKey, { base = REST_BASE, depth } = {}) =>
  `${base}/files/${requireKey(fileKey)}${depth === undefined ? '' : `?depth=${depth}`}`;

/**
 * Version history. This is what turns `mode-decision.mjs`'s cache key from `<key>@unknown` into a
 * key, and makes "has it changed?" answerable without re-fetching the file.
 *
 * @param {string} fileKey
 * @param {{ base?: string }} [options]
 */
export const versionsUrl = (fileKey, { base = REST_BASE } = {}) =>
  `${base}/files/${requireKey(fileKey)}/versions`;

/**
 * Rendered images. The token-reachable equivalent of `download_assets`'s export, captured so the
 * two can be compared rather than assumed equal.
 *
 * @param {string} fileKey
 * @param {string[]} ids
 * @param {{ base?: string; format?: string; scale?: number }} [options]
 */
export const imagesUrl = (fileKey, ids, { base = REST_BASE, format = 'png', scale } = {}) => {
  const query = new URLSearchParams({ ids: requireIds(ids), format });

  if (scale !== undefined) query.set('scale', String(scale));

  return `${base}/images/${requireKey(fileKey)}?${query}`;
};

/**
 * Opens a token-bearing client.
 *
 * @param {{ base?: string; token?: string; fetchImpl?: typeof fetch }} [options]
 */
export const openRest = ({ base = REST_BASE, token, fetchImpl = fetch } = {}) => {
  /** @type {Record<string, string>} */
  const headers = token ? { [TOKEN_HEADER]: token } : {};

  /** @param {Response} response */
  const retryAfterOf = response => {
    const header = response.headers.get('retry-after'),
      seconds = header === null ? Number.NaN : Number(header);

    return Number.isFinite(seconds) ? seconds : null;
  };

  return {
    base,

    /**
     * Streams a response to `path` and returns what it did. The body is never assembled in memory
     * and never returned.
     *
     * A refusal writes **no file at all** rather than a file holding an error document: a zero-byte
     * or error-bodied capture that sits next to the real ones is how a failed run comes to look
     * like a thin design.
     *
     * @param {string} path
     * @param {string} url
     * @returns {Promise<CallRecord>}
     */
    getTo: async (path, url) => {
      const started = Date.now(),
        response = await fetchImpl(url, { headers });

      if (!response.ok || !response.body) {
        const body = await response.text().catch(() => '');

        return {
          url,
          status: response.status,
          ok: false,
          ms: Date.now() - started,
          bytes: 0,
          sha256: null,
          file: null,
          retryAfter: retryAfterOf(response),
          error: body.slice(0, 400) || response.statusText
        };
      }

      const hash = createHash('sha256');

      let bytes = 0;

      mkdirSync(dirname(path), { recursive: true });

      await pipeline(
        Readable.fromWeb(
          /** @type {import('node:stream/web').ReadableStream<Uint8Array>} */ (response.body)
        ),
        async function* (source) {
          for await (const chunk of source) {
            hash.update(chunk);
            bytes += chunk.length;
            yield chunk;
          }
        },
        createWriteStream(path)
      );

      return {
        url,
        status: response.status,
        ok: true,
        ms: Date.now() - started,
        bytes,
        sha256: hash.digest('hex'),
        file: path,
        retryAfter: null,
        error: null
      };
    }
  };
};
