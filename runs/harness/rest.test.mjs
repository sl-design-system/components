/**
 * The REST transport, against a stub that speaks the same shapes `api.figma.com` does.
 *
 * Nothing here reaches the network. The expected values come from this task's acceptance criteria —
 * "every stored response carries its call record and hash", "no file is written by any path that
 * could summarise it" — and from the probe recorded in the task, not from reading the module.
 */
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  REST_BASE,
  TOKEN_HEADER,
  fileUrl,
  imagesUrl,
  nodesUrl,
  openRest,
  versionsUrl
} from './rest.mjs';

// ---------------------------------------------------------------------------------------------

/**
 * @param {(request: import('node:http').IncomingMessage) => {
 *   status?: number;
 *   headers?: Record<string, string>;
 *   body: string;
 * }} handler
 */
const stubRest = handler =>
  /**
   * @type {Promise<{
   *   url: string;
   *   seen: { url: string; token: string | undefined }[];
   *   close: () => void;
   * }>}
   */ (
    new Promise(resolve => {
      /** @type {{ url: string; token: string | undefined }[]} */
      const seen = [],
        server = createServer((request, response) => {
          seen.push({
            url: request.url ?? '',
            token: /** @type {string | undefined} */ (request.headers['x-figma-token'])
          });

          const answer = handler(request);

          response
            .writeHead(answer.status ?? 200, {
              'Content-Type': 'application/json',
              ...answer.headers
            })
            .end(answer.body);
        });

      server.listen(0, '127.0.0.1', () => {
        const address = server.address();

        resolve({
          url: `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`,
          seen,
          close: () => server.close()
        });
      });
    })
  );

const scratch = () => mkdtempSync(join(tmpdir(), 'slds-rest-'));

// ---------------------------------------------------------------------------------------------

describe('the endpoints', () => {
  it('points at the API the probe reached, not the one that refused the token', () => {
    // `mcp.figma.com` answered the same token with 401. This base is the one that answered 200.
    assert.equal(REST_BASE, 'https://api.figma.com/v1');
    assert.equal(TOKEN_HEADER, 'X-Figma-Token');
  });

  it('asks for a frame by id, which is the call that returned 620 nodes where metadata said 98', () => {
    assert.equal(
      nodesUrl('4TdMrcnIVOn3Hrfj2OpVZU', ['334:20573']),
      'https://api.figma.com/v1/files/4TdMrcnIVOn3Hrfj2OpVZU/nodes?ids=334%3A20573'
    );
  });

  it('asks for several ids in one call', () => {
    assert.equal(
      nodesUrl('KEY', ['1:2', '3:4']),
      'https://api.figma.com/v1/files/KEY/nodes?ids=1%3A2%2C3%3A4'
    );
  });

  it('carries geometry only when it is asked for, because paths multiply the payload', () => {
    assert.ok(!nodesUrl('KEY', ['1:2']).includes('geometry'));
    assert.ok(nodesUrl('KEY', ['1:2'], { geometry: 'paths' }).endsWith('&geometry=paths'));
  });

  it('builds the whole-file, version and image calls', () => {
    assert.equal(fileUrl('KEY'), 'https://api.figma.com/v1/files/KEY');
    assert.equal(versionsUrl('KEY'), 'https://api.figma.com/v1/files/KEY/versions');
    assert.equal(
      imagesUrl('KEY', ['1:2'], { format: 'png', scale: 2 }),
      'https://api.figma.com/v1/images/KEY?ids=1%3A2&format=png&scale=2'
    );
  });

  it('honours an alternate base, so the tests never reach Figma', () => {
    assert.equal(
      nodesUrl('KEY', ['1:2'], { base: 'http://127.0.0.1:9/v1' }).startsWith(
        'http://127.0.0.1:9/v1/'
      ),
      true
    );
  });

  describe('NEGATIVE CONTROL: a request that cannot mean what it says is refused', () => {
    it('refuses an empty id list rather than asking for every node in the file', () => {
      assert.throws(() => nodesUrl('KEY', []), /at least one node id/);
    });

    it('refuses an id carrying the separator, which would silently become two ids', () => {
      assert.throws(() => nodesUrl('KEY', ['1:2,3:4']), /separator/);
    });

    it('refuses a blank file key', () => {
      assert.throws(() => fileUrl('  '), /file key/);
    });
  });
});

describe('a response reaches disk byte for byte', () => {
  it('writes exactly what the server sent, and hashes what it wrote', async () => {
    const payload = JSON.stringify({
        name: 'New Secondary',
        nodes: { '334:20573': { document: {} } }
      }),
      stub = await stubRest(() => ({ body: payload })),
      dir = scratch();

    try {
      const rest = openRest({ base: `${stub.url}/v1`, token: 'figd_stub' }),
        record = await rest.getTo(
          join(dir, 'nodes.json'),
          nodesUrl('KEY', ['334:20573'], { base: `${stub.url}/v1` })
        );

      // Verbatim is the whole point of this task: the bytes on disk are the bytes that arrived.
      assert.equal(readFileSync(join(dir, 'nodes.json'), 'utf8'), payload);
      assert.equal(record.bytes, Buffer.byteLength(payload));
      assert.equal(record.bytes, statSync(join(dir, 'nodes.json')).size);
      assert.equal(record.sha256, createHash('sha256').update(payload).digest('hex'));
      assert.equal(record.status, 200);
      assert.equal(record.ok, true);
      assert.equal(typeof record.ms, 'number');
    } finally {
      stub.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('sends the token in the header Figma named back, and never in the URL', async () => {
    const stub = await stubRest(() => ({ body: '{}' })),
      dir = scratch();

    try {
      const rest = openRest({ base: `${stub.url}/v1`, token: 'figd_stub' }),
        record = await rest.getTo(join(dir, 'a.json'), `${stub.url}/v1/files/KEY`);

      assert.equal(stub.seen[0].token, 'figd_stub');
      // Not only absent from the record — absent from the request line the server saw, which is
      // what a proxy, an access log or a crash dump would keep.
      assert.equal(stub.seen[0].url, '/v1/files/KEY');
      // A call record is committed to the repository. A token in it would be committed with it.
      assert.ok(!record.url.includes('figd_stub'));
      assert.ok(!JSON.stringify(record).includes('figd_stub'));
    } finally {
      stub.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('records a refusal as a refusal, with the body, instead of leaving a half file', async () => {
    const stub = await stubRest(() => ({ status: 403, body: '{"err":"Invalid scope(s)"}' })),
      dir = scratch();

    try {
      const rest = openRest({ base: `${stub.url}/v1`, token: 'figd_stub' }),
        record = await rest.getTo(join(dir, 'b.json'), `${stub.url}/v1/files/KEY`);

      assert.equal(record.ok, false);
      assert.equal(record.status, 403);
      assert.match(record.error ?? '', /Invalid scope/);
      assert.equal(record.file, null);
      assert.deepEqual(Object.keys(record).sort(), [
        'bytes',
        'error',
        'file',
        'ms',
        'ok',
        'retryAfter',
        'sha256',
        'status',
        'url'
      ]);
    } finally {
      stub.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('records Retry-After on a 429, so a run that waited does not look like one that did not', async () => {
    const stub = await stubRest(() => ({
        status: 429,
        headers: { 'Retry-After': '30' },
        body: 'slow down'
      })),
      dir = scratch();

    try {
      const rest = openRest({ base: `${stub.url}/v1`, token: 'figd_stub' }),
        record = await rest.getTo(join(dir, 'c.json'), `${stub.url}/v1/files/KEY`);

      assert.equal(record.status, 429);
      assert.equal(record.retryAfter, 30);
    } finally {
      stub.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  describe('NEGATIVE CONTROL: the writer cannot be handed a body it would summarise', () => {
    it('getTo returns a record and never the response text', async () => {
      const stub = await stubRest(() => ({ body: '{"secret":"the whole document"}' })),
        dir = scratch();

      try {
        const rest = openRest({ base: `${stub.url}/v1`, token: 'figd_stub' }),
          record = await rest.getTo(join(dir, 'd.json'), `${stub.url}/v1/files/KEY`);

        assert.ok(
          !Object.values(record).some(v => typeof v === 'string' && v.includes('whole document'))
        );

        // And the shape is closed, so a later edit cannot add a field that carries a body out.
        // The refusal path keeps 400 characters of the error body deliberately; nothing else
        // may carry a response at all.
        assert.deepEqual(Object.keys(record).sort(), [
          'bytes',
          'error',
          'file',
          'ms',
          'ok',
          'retryAfter',
          'sha256',
          'status',
          'url'
        ]);
      } finally {
        stub.close();
        rmSync(dir, { recursive: true, force: true });
      }
    });
  });
});
