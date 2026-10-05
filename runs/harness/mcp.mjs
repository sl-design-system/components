/**
 * One MCP session over streamable HTTP — the transport every harness script shares.
 *
 * It was extracted from `mode-decision.mjs`, which needed exactly one tool and streamed its 2.18 MB
 * response straight to disk. The traversal needs many small calls and needs their answers in
 * memory, so the session now offers both shapes and neither script owns a second copy of the
 * handshake.
 *
 * Two transports answer on the same endpoint and the difference is not announced: the Dev Mode
 * server on this machine replies `text/event-stream`, the remote replies JSON. `parseEnvelope`
 * accepts both, because a reader that understood only one found nothing in a perfectly good
 * response — that is how `mode-decision.mjs` read zero externals out of 60 KB of real data.
 */
import { createWriteStream, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

/** The Dev Mode server on this machine. It publishes the traversal's two tools; not task 01's. */
export const DEFAULT_ENDPOINT = 'http://127.0.0.1:3845/mcp';

export const PROTOCOL_VERSION = '2025-06-18';

/**
 * @typedef {'ok' | 'tool-error' | 'protocol-error'} ResultKind A tool that refused is not the same
 *   event as a transport that broke, and the traversal records which it was.
 *
 * @typedef {{ text: string; isError: boolean; kind: ResultKind }} ToolResult
 */

/**
 * Pulls the tool's text out of whichever envelope arrived.
 *
 * An SSE body is a sequence of `event:`/`data:` pairs; the JSON-RPC answer is the last `data:` line
 * that parses. A JSON body is the answer itself. Anything else is a transport we do not understand,
 * and saying so is better than returning an empty string a caller will read as an empty map.
 *
 * @param {string} body
 * @returns {ToolResult}
 */
export const parseEnvelope = body => {
  const lines = body.split('\n').filter(line => line.startsWith('data: '));

  /** @type {Record<string, unknown> | null} */
  let message = null;

  for (const line of lines.length ? lines : [`data: ${body}`]) {
    try {
      message = JSON.parse(line.slice('data: '.length));
    } catch {
      // A `data:` line that is not JSON is a keep-alive or a partial frame, not the answer.
    }
  }

  if (!message) throw new Error(`the response carried no JSON-RPC message: ${body.slice(0, 200)}`);

  const error = /** @type {{ message?: string; code?: number } | undefined} */ (message.error);

  if (error) {
    return {
      text: `${error.code ?? 'error'}: ${error.message ?? 'no message'}`,
      isError: true,
      kind: 'protocol-error'
    };
  }

  const result = /** @type {{ content?: unknown; isError?: boolean } | undefined} */ (
      message.result
    ),
    content = Array.isArray(result?.content) ? result.content : [];

  return {
    text: content
      .filter(
        /** @returns {part is { type: string; text: string }} */
        part =>
          typeof part === 'object' &&
          part !== null &&
          /** @type {{ type?: unknown }} */ (part).type === 'text'
      )
      .map(part => part.text)
      .join('\n'),
    isError: Boolean(result?.isError),
    kind: result?.isError ? 'tool-error' : 'ok'
  };
};

/**
 * Opens a session and returns the two ways of using it.
 *
 * The handshake is per session rather than per call: the traversal makes one call per node and a
 * fresh handshake on each would be most of its cost.
 *
 * @param {{ endpoint?: string; token?: string }} [options]
 */
export const openSession = async ({ endpoint = DEFAULT_ENDPOINT, token } = {}) => {
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
        protocolVersion: PROTOCOL_VERSION,
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

  let id = 1;

  /** @param {string} tool @param {Record<string, unknown>} args */
  const post = (tool, args) =>
    fetch(endpoint, {
      method: 'POST',
      headers: withSession,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: (id += 1),
        method: 'tools/call',
        params: { name: tool, arguments: args }
      })
    });

  return {
    endpoint,

    /**
     * Calls a tool and returns its text. For the many small calls a traversal makes.
     *
     * @param {string} tool
     * @param {Record<string, unknown>} args
     * @returns {Promise<ToolResult>}
     */
    call: async (tool, args) => {
      const response = await post(tool, args);

      if (!response.ok)
        throw new Error(`${tool} failed: ${response.status} ${response.statusText}`);

      return parseEnvelope(await response.text());
    },

    /**
     * Calls a tool and writes the response straight to `path`, byte by byte. The body is never
     * assembled in memory and never returned, only its location.
     *
     * @param {string} path
     * @param {string} tool
     * @param {Record<string, unknown>} args
     * @returns {Promise<string>} Where the response was written — never its contents
     */
    callTo: async (path, tool, args) => {
      const response = await post(tool, args);

      if (!response.ok)
        throw new Error(`${tool} failed: ${response.status} ${response.statusText}`);
      if (!response.body) throw new Error(`${tool} returned no body`);

      mkdirSync(dirname(path), { recursive: true });
      await pipeline(Readable.fromWeb(response.body), createWriteStream(path));

      return path;
    }
  };
};
