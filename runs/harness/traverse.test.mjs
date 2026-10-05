/**
 * The traversal is the instrument that decides how much of a design is ever looked at, so the
 * question each test asks is not "does the function return something" but "would this test go red
 * if the stopping rule stopped working".
 *
 * Every fixture is a response that really arrived — the depth-limited canvas, the instance
 * boundary, the nested ids the server emits and then refuses, and the two Code Connect entry shapes
 * recorded across the nineteen corpus runs.
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { openSession, parseEnvelope } from './mcp.mjs';
import {
  DESCENT_REASON,
  LEAF_TAGS,
  PROBEABLE_TAGS,
  SLOW_MAP_MS,
  applyBudget,
  classifyMap,
  parseMetadata,
  probeTarget,
  readMap,
  traverse
} from './traverse.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/** @param {string} name */
const fixture = name => readFileSync(join(HERE, 'fixtures', name), 'utf8');

/** @param {string} text */
const answered = text => ({ text, isError: false, kind: 'ok' });

/** @param {string} text */
const refused = text => ({ text, isError: true, kind: 'tool-error' });

// =============================================================================================
// Node ids — the format the server emits and will not accept

describe('probeTarget — the id the server will answer about', () => {
  it('leaves a plain node id alone', () => {
    assert.deepEqual(probeTarget('4195:33202'), {
      id: '4195:33202',
      nested: false,
      within: null
    });
  });

  it('reduces a nested instance id to its enclosing instance', () => {
    // Measured 2026-10-05: `get_code_connect_map` answers `{}` for `4195:33202`, and
    // `No node could be found` for the last segment `1514:155394` — that segment addresses a
    // node inside a library component this document does not contain. Only the first is askable.
    assert.deepEqual(probeTarget('I4195:33202;1514:155394'), {
      id: '4195:33202',
      nested: true,
      within: ['4195:33202', '1514:155394']
    });
  });

  it('keeps the whole path when an instance is nested two deep', () => {
    assert.deepEqual(probeTarget('I334:20573;334:20668;1514:155394').within, [
      '334:20573',
      '334:20668',
      '1514:155394'
    ]);
  });

  it('does not treat an id that merely starts with I as nested', () => {
    assert.equal(probeTarget('I334:20573').nested, false);
  });
});

// =============================================================================================
// get_metadata

describe('parseMetadata — reading one metadata response', () => {
  it('reads the six sections a canvas reported, every one of them childless', () => {
    const canvas = parseMetadata(fixture('metadata-depth-limited.txt'));

    assert.equal(canvas.tag, 'canvas');
    assert.equal(canvas.id, '4193:16775');
    assert.equal(canvas.children.length, 6);
    assert.deepEqual(
      canvas.children.map(child => child.children.length),
      [0, 0, 0, 0, 0, 0]
    );
  });

  it('carries the hidden flag through', () => {
    const canvas = parseMetadata(fixture('metadata-depth-limited.txt')),
      feedback = canvas.children.find(child => child.id === '4834:45222');

    assert.equal(feedback?.hidden, true);
    assert.equal(canvas.children.filter(child => child.hidden).length, 1);
  });

  it('keeps an instance self-closed inside the frame that holds it', () => {
    const symbol = parseMetadata(fixture('metadata-instance-boundary.txt')),
      frame = symbol.children[0];

    assert.equal(frame.tag, 'frame');
    assert.deepEqual(
      frame.children.map(child => `${child.tag}:${child.id}`),
      ['text:4187:33829', 'instance:4187:33783']
    );
    assert.equal(frame.children[1].children.length, 0);
  });

  it('reads the nested ids the server emits inside an instance', () => {
    const instance = parseMetadata(fixture('metadata-nested-instance-ids.txt'));

    assert.deepEqual(
      instance.children.map(child => child.id),
      ['I4195:33202;1514:155951', 'I4195:33202;1550:6733']
    );
    assert.equal(instance.children[1].children.length, 2);
  });

  it('does not stop at a > inside an attribute value', () => {
    const frame = parseMetadata(
      '<frame id="1:1" name="Materials > Books"><text id="1:2" name="x" /></frame>'
    );

    assert.equal(frame.name, 'Materials > Books');
    assert.equal(frame.children.length, 1);
  });

  it('NEGATIVE CONTROL: refuses the prose the server answers a missing node with', () => {
    // Without this the traversal would read `No node could be found…` as a childless element and
    // record a leaf, which is the difference between "nothing is there" and "we never looked".
    assert.throws(() => parseMetadata(fixture('metadata-not-found.txt')), /carries no element/);
  });

  it('NEGATIVE CONTROL: refuses a response carrying two root elements', () => {
    assert.throws(
      () => parseMetadata('<frame id="1:1" /><frame id="1:2" />'),
      /more than one root element/
    );
  });

  it('NEGATIVE CONTROL: refuses an element with no id', () => {
    assert.throws(() => parseMetadata('<frame name="nameless" />'), /carries no id/);
  });
});

// =============================================================================================
// get_code_connect_map

describe('readMap — the boundary around the Code Connect response', () => {
  it('reads the entry shape thirty recorded probes returned', () => {
    const { entries, annotations } = readMap(fixture('code-connect-resolved.json'));

    assert.deepEqual(Object.keys(entries), ['334:20668']);
    assert.equal(entries['334:20668'].hasTemplate, true);
    assert.match(entries['334:20668'].snippet ?? '', /<sl-button/);
    assert.deepEqual(annotations, []);
  });

  it('accepts the identified entry that carries no snippet and no label', () => {
    // Five entries across a9-sanna-login, b-sanna-account-creation and a10-etsl-fam-users look
    // exactly like this. A schema demanding a snippet would refuse the one shape step 3 is about.
    const { entries } = readMap(fixture('code-connect-identified.json'));

    assert.equal(entries['0:3'].hasTemplate, false);
    assert.equal(entries['0:3'].snippet, undefined);
    assert.match(entries['0:3'].source, /label\.ts$/);
  });

  it('keeps a key that is not a node id instead of dropping it', () => {
    const { entries, annotations } = readMap(fixture('code-connect-annotated.json'));

    assert.deepEqual(annotations, ['_note']);
    assert.deepEqual(Object.keys(entries), ['334:20668']);
  });

  it('reads the empty map as no entries at all', () => {
    assert.deepEqual(readMap('{}'), { entries: {}, annotations: [] });
  });

  it('NEGATIVE CONTROL: refuses an entry whose hasTemplate is not a boolean', () => {
    assert.throws(
      () => readMap(fixture('code-connect-malformed.json')),
      /334:20668: the map entry is malformed/
    );
  });

  it('NEGATIVE CONTROL: refuses a response that is not an object keyed by node id', () => {
    assert.throws(() => readMap('[{"334:20668":{}}]'), /not an object keyed by node id/);
  });

  it('NEGATIVE CONTROL: refuses a response that is not JSON', () => {
    assert.throws(() => readMap('Invalid tool arguments: nodeId'), /not JSON/);
  });
});

describe('classifyMap — what one response says about one node', () => {
  it('calls a template with a snippet resolved, and keeps the snippet', () => {
    const verdict = classifyMap(answered(fixture('code-connect-resolved.json')), '334:20668');

    assert.equal(verdict.outcome, 'resolved');
    assert.equal(verdict.label, 'SL Design System');
    assert.match(verdict.snippet, /Join live lesson/);
  });

  it('calls an entry without a template identified, and names where it came from', () => {
    const verdict = classifyMap(answered(fixture('code-connect-identified.json')), '0:3');

    assert.equal(verdict.outcome, 'identified');
    assert.match(verdict.detail ?? '', /label\.ts$/);
  });

  it('calls an empty map empty', () => {
    assert.equal(classifyMap(answered('{}'), '4187:33783').outcome, 'empty');
  });

  it('calls a map that holds other nodes but not this one empty', () => {
    assert.equal(
      classifyMap(answered(fixture('code-connect-resolved.json')), '1:1').outcome,
      'empty'
    );
  });

  it('accepts the dashed spelling of the same node id', () => {
    assert.equal(
      classifyMap(
        answered('{"334-20668":{"source":"","version":"1","hasTemplate":false}}'),
        '334:20668'
      ).outcome,
      'identified'
    );
  });

  it('calls a refused call unreadable, and quotes what the server said', () => {
    const verdict = classifyMap(
      refused('[MCP server] Invalid tool arguments: nodeId must be "123:456"'),
      'I4195:33202;1514:155394'
    );

    assert.equal(verdict.outcome, 'unreadable');
    assert.match(verdict.detail ?? '', /Invalid tool arguments/);
  });

  it('NEGATIVE CONTROL: a refusal whose body happens to parse is still a refusal', () => {
    // The flag is the evidence, not the shape of the text beside it. A reader that only noticed
    // a refusal when the body failed to parse would read a refused `{}` as "nothing is mapped" —
    // the exact substitution of a failure for an absence this task exists to stop.
    const verdict = classifyMap(refused('{}'), '1:1');

    assert.equal(verdict.outcome, 'unreadable');
    assert.equal(verdict.detail, '{}');
  });

  it('NEGATIVE CONTROL: refuses a template that carries no snippet rather than guessing', () => {
    const verdict = classifyMap(
      answered('{"1:1":{"source":"","version":"1","hasTemplate":true}}'),
      '1:1'
    );

    assert.equal(verdict.outcome, 'unreadable');
    assert.match(verdict.detail ?? '', /declares hasTemplate and carries no snippet/);
  });
});

describe('applyBudget — an empty map that took too long is not an absence', () => {
  const empty = { outcome: /** @type {const} */ ('empty'), detail: null, label: null, snippet: '' };

  it('downgrades the thirty-one-second empty the Dev Mode server returns', () => {
    // Five samples on 2026-10-05: 30.6s, 30.8s, 31.0s, 31.0s, 31.1s — the same plateau for a
    // 36×36 button instance and for a symbol holding twenty nodes. A lookup whose cost does not
    // vary with what it looks through has not looked.
    const verdict = applyBudget(empty, 31_005);

    assert.equal(verdict.outcome, 'unreadable');
    assert.match(verdict.detail ?? '', /31005 ms/);
    assert.match(verdict.detail ?? '', /timed out/);
  });

  it('leaves a prompt empty alone — that one is evidence', () => {
    assert.equal(applyBudget(empty, 90).outcome, 'empty');
  });

  it('does not touch an answer that arrived, however slowly', () => {
    const resolved = { ...empty, outcome: /** @type {const} */ ('resolved'), snippet: '<sl-x/>' };

    assert.equal(applyBudget(resolved, 31_005).outcome, 'resolved');
  });

  it('treats the budget as inclusive, so a call sitting exactly on it is a timeout', () => {
    assert.equal(applyBudget(empty, SLOW_MAP_MS).outcome, 'unreadable');
  });
});

// =============================================================================================
// The traversal

/**
 * Builds the two fetchers from a map of node id → response text, counting every call so a test can
 * assert what was _not_ fetched.
 *
 * @param {{ metadata: Record<string, string>; maps?: Record<string, unknown> }} world
 */
const world = ({ metadata, maps = {} }) => {
  /** @type {string[]} */
  const metadataCalls = [];

  /** @type {string[]} */
  const mapCalls = [];

  return {
    metadataCalls,
    mapCalls,
    /** @param {string} id */
    getMetadata: async id => {
      metadataCalls.push(id);

      return metadata[id]
        ? answered(metadata[id])
        : refused(`No node could be found for the provided nodeId: ${id}.`);
    },
    /** @param {string} id */
    getMap: async id => {
      mapCalls.push(id);

      const answer = maps[id];

      if (typeof answer === 'function') return answer();

      return answered(typeof answer === 'string' ? answer : '{}');
    }
  };
};

describe('traverse — the stopping rule', () => {
  const design = {
    '1:1': '<frame id="1:1" name="root"><instance id="1:2" name="sl-button" /></frame>',
    '1:2': '<instance id="1:2" name="sl-button"><text id="I1:2;9:9" name="label" /></instance>'
  };

  const resolved = fixture('code-connect-resolved.json').replaceAll('334:20668', '1:2');

  it('does not fetch the subtree of a node Code Connect resolved', async () => {
    const w = world({ metadata: design, maps: { '1:2': resolved } }),
      report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    assert.deepEqual(w.metadataCalls, ['1:1']);
    assert.deepEqual(report.pruned, ['1:2']);
    assert.equal(report.counts.resolved, 1);
  });

  it('fetches that same subtree when the operator asks what pruning saved', async () => {
    const w = world({ metadata: design, maps: { '1:2': resolved } }),
      report = await traverse({
        rootId: '1:1',
        getMetadata: w.getMetadata,
        getMap: w.getMap,
        expandMapped: true
      });

    assert.deepEqual(w.metadataCalls, ['1:1', '1:2']);
    assert.deepEqual(report.pruned, []);
    assert.equal(report.expandedMapped, true);
  });

  it('counts the snippet it kept instead of the expansion it skipped', async () => {
    const w = world({ metadata: design, maps: { '1:2': resolved } }),
      report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    assert.equal(report.bytes.snippets > 0, true);
    assert.equal(report.bytes.metadata, design['1:1'].length);
  });
});

describe('traverse — every descent records why, and the reasons differ', () => {
  const design = {
    '1:1':
      '<frame id="1:1" name="root">' +
      '<instance id="1:2" name="unmapped" />' +
      '<instance id="1:3" name="unreadable" />' +
      '<instance id="1:4" name="identified" />' +
      '</frame>',
    '1:2': '<instance id="1:2" name="unmapped"><text id="I1:2;9:9" name="t" /></instance>',
    '1:3': '<instance id="1:3" name="unreadable"><text id="I1:3;9:9" name="t" /></instance>',
    '1:4': '<instance id="1:4" name="identified"><text id="I1:4;9:9" name="t" /></instance>'
  };

  const maps = {
    '1:2': '{}',
    '1:3': () => refused('[MCP server] the request timed out'),
    '1:4': fixture('code-connect-identified.json').replaceAll('0:3', '1:4')
  };

  it('tells a map that answered nothing from a map it could not read', async () => {
    const w = world({ metadata: design, maps }),
      report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    assert.deepEqual(report.descents, {
      'genuinely-unmapped': 1,
      'map-unreadable': 1,
      'identified-without-snippet': 1
    });
  });

  it('puts the reason on the node, not only in the totals', async () => {
    const w = world({ metadata: design, maps }),
      report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap }),
      reasons = Object.fromEntries(
        report.nodes
          .filter(node => node.disposition === 'descended')
          .map(node => [node.id, node.reason])
      );

    assert.deepEqual(reasons, {
      '1:2': 'genuinely-unmapped',
      '1:3': 'map-unreadable',
      '1:4': 'identified-without-snippet'
    });
  });

  it('descends in all three cases — failing closed would drop the content', async () => {
    const w = world({ metadata: design, maps });

    await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    assert.deepEqual(w.metadataCalls, ['1:1', '1:2', '1:3', '1:4']);
  });

  it('quotes what made the map unreadable, so the two are told apart by reading', async () => {
    const w = world({ metadata: design, maps }),
      report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap }),
      unreadable = report.nodes.find(node => node.reason === 'map-unreadable');

    assert.match(unreadable?.detail ?? '', /timed out/);
  });

  it('records a slow empty as unreadable, not as an absence', async () => {
    const slow = {
      ...maps,
      '1:2': () => new Promise(resolve => setTimeout(() => resolve(answered('{}')), 25))
    };

    const w = world({ metadata: design, maps: slow }),
      report = await traverse({
        rootId: '1:1',
        getMetadata: w.getMetadata,
        getMap: w.getMap,
        slowMapMs: 20
      });

    assert.equal(report.descents['genuinely-unmapped'], undefined);
    assert.equal(report.descents['map-unreadable'], 2);
    assert.equal(report.slowMapMs, 20);
  });
});

describe('traverse — a nested id is unaskable, not unmapped', () => {
  const design = {
    '1:1': '<frame id="1:1" name="root"><instance id="4195:33202" name="sl-select" /></frame>',
    '4195:33202': fixture('metadata-nested-instance-ids.txt')
  };

  it('never sends a semicolon id to the server', async () => {
    const w = world({ metadata: design });

    await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    assert.deepEqual(
      [...w.mapCalls, ...w.metadataCalls].filter(id => id.includes(';')),
      []
    );
  });

  it('records the nested nodes as nested rather than as descents', async () => {
    const w = world({ metadata: design }),
      report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap }),
      nested = report.nodes.filter(node => node.disposition === 'nested');

    assert.deepEqual(
      nested.map(node => node.id),
      ['I4195:33202;1550:6733', 'I4195:33202;1514:155394']
    );
    assert.equal(report.counts.nested, 2);
    assert.deepEqual(
      nested.map(node => node.reason),
      ['nested-id-not-probeable', 'nested-id-not-probeable']
    );
  });

  it('answers each nested node from the instance that encloses it', async () => {
    const w = world({ metadata: design }),
      report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap }),
      nested = report.nodes.filter(node => node.disposition === 'nested');

    assert.deepEqual(new Set(nested.map(node => node.probedAs)), new Set(['4195:33202']));
    assert.match(nested[0].detail ?? '', /answered by 4195:33202: empty/);
  });

  it('counts no nested node among the unmapped', async () => {
    const w = world({ metadata: design }),
      report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    // One descent only — the instance itself. Its two visible inner nodes are content.
    assert.equal(report.descents['genuinely-unmapped'], 1);
  });
});

describe('traverse — what it does with the rest of the tree', () => {
  it('fails open on a childless container, because the server is depth-limited', async () => {
    const w = world({
      metadata: {
        '4193:16775': fixture('metadata-depth-limited.txt'),
        '4197:31842':
          '<section id="4197:31842" name="Outside the group"><frame id="9:1" name="page" /></section>'
      }
    });

    await traverse({ rootId: '4193:16775', getMetadata: w.getMetadata, getMap: w.getMap });

    // The canvas, then five of its six sections — the sixth is hidden and excluded on purpose —
    // and then the frame that only appeared once a section was asked about by name. Believing
    // the first response would have stopped at the canvas and called the design six empty boxes.
    assert.deepEqual(w.metadataCalls, [
      '4193:16775',
      '4197:31842',
      '4438:4953',
      '4197:31843',
      '4438:5249',
      '5066:52606',
      '9:1'
    ]);
  });

  it('does not ask again about a childless leaf', async () => {
    const w = world({
      metadata: { '1:1': '<frame id="1:1" name="root"><text id="1:2" name="t" /></frame>' }
    });

    await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    assert.deepEqual(w.metadataCalls, ['1:1']);
  });

  it('records a hidden node and does not walk into it', async () => {
    const w = world({ metadata: { '4193:16775': fixture('metadata-depth-limited.txt') } }),
      report = await traverse({
        rootId: '4193:16775',
        getMetadata: w.getMetadata,
        getMap: w.getMap
      });

    assert.equal(report.counts.hidden, 1);
    assert.equal(w.metadataCalls.includes('4834:45222'), false);
    assert.equal(
      report.nodes.find(node => node.id === '4834:45222')?.reason,
      'hidden-in-the-design'
    );
  });

  it('records metadata it could not read instead of treating the node as a leaf', async () => {
    const w = world({
      metadata: {
        '1:1': '<frame id="1:1" name="root"><frame id="1:2" name="gone" /></frame>'
      }
    });

    const report = await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    assert.equal(report.counts.unreadableMetadata, 1);
    // The server's own sentence, not the parser's complaint about it. Both mention the node, and
    // only one of them says who could not find it.
    assert.match(
      report.nodes.find(node => node.disposition === 'unreadable-metadata')?.detail ?? '',
      /^No node could be found for the provided nodeId: 1:2\.$/
    );
  });

  it('says so when it ran out of budget rather than reporting a short design', async () => {
    const w = world({ metadata: { '4193:16775': fixture('metadata-depth-limited.txt') } }),
      report = await traverse({
        rootId: '4193:16775',
        getMetadata: w.getMetadata,
        getMap: w.getMap,
        maxNodes: 3
      });

    assert.equal(report.complete, false);
    assert.equal(report.nodes.length <= 3, true);
  });

  it('says so when the budget ran out between fetches, not only inside one', async () => {
    // Seven records fill the budget exactly — the canvas and its six children — and the five
    // sections it enqueued are still waiting. Nothing is mid-walk, so only the check between
    // fetches is left to notice that the design was not seen.
    const w = world({ metadata: { '4193:16775': fixture('metadata-depth-limited.txt') } }),
      report = await traverse({
        rootId: '4193:16775',
        getMetadata: w.getMetadata,
        getMap: w.getMap,
        maxNodes: 7
      });

    assert.equal(report.nodes.length, 7);
    assert.equal(report.complete, false);
  });

  it('visits a node once however many parents point at it', async () => {
    const w = world({
      metadata: {
        '1:1':
          '<frame id="1:1" name="root"><frame id="1:2" name="a" /><frame id="1:2" name="a" /></frame>',
        '1:2': '<frame id="1:2" name="a"><text id="1:3" name="t" /></frame>'
      }
    });

    await traverse({ rootId: '1:1', getMetadata: w.getMetadata, getMap: w.getMap });

    assert.deepEqual(w.metadataCalls, ['1:1', '1:2']);
  });

  it('probes every tag Code Connect can answer about, and no others', () => {
    assert.deepEqual([...PROBEABLE_TAGS].sort(), [
      'component',
      'component-set',
      'instance',
      'symbol'
    ]);
    assert.equal(LEAF_TAGS.has('frame'), false);
    assert.equal(LEAF_TAGS.has('section'), false);
  });

  it('names a reason for every outcome that descends', () => {
    assert.deepEqual(Object.keys(DESCENT_REASON).sort(), ['empty', 'identified', 'unreadable']);
  });
});

// =============================================================================================
// The transport

describe('parseEnvelope — two transports answer on the same endpoint', () => {
  const body = { result: { content: [{ type: 'text', text: '{}' }] }, jsonrpc: '2.0', id: 2 };

  it('reads the event stream the Dev Mode server answers with', () => {
    assert.deepEqual(parseEnvelope(`event: message\ndata: ${JSON.stringify(body)}\n\n`), {
      text: '{}',
      isError: false,
      kind: 'ok'
    });
  });

  it('reads the plain JSON the remote answers with', () => {
    assert.deepEqual(parseEnvelope(JSON.stringify(body)), {
      text: '{}',
      isError: false,
      kind: 'ok'
    });
  });

  it('joins several text parts rather than keeping the first', () => {
    assert.equal(
      parseEnvelope(
        JSON.stringify({
          result: {
            content: [
              { type: 'text', text: 'a' },
              { type: 'image', data: '…' },
              { type: 'text', text: 'b' }
            ]
          }
        })
      ).text,
      'a\nb'
    );
  });

  it('tells a tool that refused from a transport that broke', () => {
    assert.deepEqual(
      parseEnvelope(
        JSON.stringify({ result: { content: [{ type: 'text', text: 'nope' }], isError: true } })
      ),
      { text: 'nope', isError: true, kind: 'tool-error' }
    );
    assert.equal(
      parseEnvelope(
        JSON.stringify({ error: { code: -32_601, message: 'No matching discriminator' } })
      ).kind,
      'protocol-error'
    );
  });

  it('NEGATIVE CONTROL: refuses a body carrying no JSON-RPC message', () => {
    assert.throws(() => parseEnvelope('<html>502 Bad Gateway</html>'), /no JSON-RPC message/);
  });
});

/**
 * A server that speaks just enough MCP to answer a traversal, so the CLI and the session are
 * exercised over a real socket rather than around it.
 *
 * @param {Record<string, (args: Record<string, string>) => { text: string; isError?: boolean }>} tools
 */
const stubServer = tools =>
  new Promise(resolve => {
    const server = createServer((request, response) => {
      let body = '';

      request.on('data', chunk => (body += chunk));
      request.on('end', () => {
        /**
         * @type {{
         *   id?: number;
         *   method?: string;
         *   params?: { name: string; arguments: Record<string, string> };
         * }}
         */
        const message = JSON.parse(body || '{}');

        if (message.method === 'notifications/initialized') {
          response.writeHead(202).end();

          return;
        }

        const result =
          message.method === 'initialize'
            ? { protocolVersion: '2025-06-18', capabilities: {}, serverInfo: { name: 'stub' } }
            : (() => {
                const tool = tools[message.params?.name ?? ''];
                const answer = tool
                  ? tool(message.params?.arguments ?? {})
                  : { text: 'no such tool', isError: true };

                return { content: [{ type: 'text', text: answer.text }], isError: answer.isError };
              })();

        response.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'mcp-session-id': 'stub-session'
        });
        response.end(
          `event: message\ndata: ${JSON.stringify({ result, jsonrpc: '2.0', id: message.id })}\n\n`
        );
      });
    });

    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      resolve({
        url: `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/mcp`,
        close: () => new Promise(done => server.close(() => done(undefined)))
      });
    });
  });

describe('openSession — over a socket', () => {
  it('hands back what the tool said', async () => {
    const stub = await /** @type {Promise<{ url: string; close: () => Promise<unknown> }>} */ (
      stubServer({ get_metadata: () => ({ text: '<frame id="1:1" name="root" />' }) })
    );

    try {
      const session = await openSession({ endpoint: stub.url }),
        answer = await session.call('get_metadata', { nodeId: '1:1' });

      assert.deepEqual(answer, {
        text: '<frame id="1:1" name="root" />',
        isError: false,
        kind: 'ok'
      });
    } finally {
      await stub.close();
    }
  });
});

// =============================================================================================
// The CLI

const SCRIPT = join(HERE, 'traverse.mjs');

/** @param {string[]} args */
const run = args =>
  /** @type {Promise<{ code: number; stdout: string; stderr: string }>} */ (
    new Promise(resolve => {
      execFile(
        process.execPath,
        [SCRIPT, ...args],
        { maxBuffer: 1024 * 1024 * 8 },
        /** @param {any} error */ (error, stdout, stderr) =>
          resolve({ code: error?.code ?? 0, stdout, stderr })
      );
    })
  );

describe('NEGATIVE CONTROL: the CLI leaves by a non-zero exit when it does not know', () => {
  const design = '<frame id="1:1" name="root"><instance id="1:2" name="sl-button" /></frame>';

  it('exits 2 when no root is named', async () => {
    const { code, stderr } = await run([]);

    assert.equal(code, 2);
    assert.match(stderr, /usage: traverse\.mjs/);
  });

  it('exits 2 on a root the server could only reject', async () => {
    const { code } = await run(['--root', 'I4195:33202;1514:155394']);

    assert.equal(code, 2);
  });

  it('exits 4 when a descent happened because the map could not be read', async () => {
    const stub = await /** @type {Promise<{ url: string; close: () => Promise<unknown> }>} */ (
      stubServer({
        get_metadata: ({ nodeId }) => ({
          text: nodeId === '1:1' ? design : '<instance id="1:2" name="sl-button" />'
        }),
        get_code_connect_map: () => ({ text: 'the request timed out', isError: true })
      })
    );

    try {
      const { code, stdout } = await run(['--root', '1:1', '--endpoint', stub.url]);

      assert.equal(code, 4);
      assert.equal(JSON.parse(stdout).descents['map-unreadable'], 1);
    } finally {
      await stub.close();
    }
  });

  it('exits 0 on that same traversal when the operator accepts it', async () => {
    const stub = await /** @type {Promise<{ url: string; close: () => Promise<unknown> }>} */ (
      stubServer({
        get_metadata: ({ nodeId }) => ({
          text: nodeId === '1:1' ? design : '<instance id="1:2" name="sl-button" />'
        }),
        get_code_connect_map: () => ({ text: 'the request timed out', isError: true })
      })
    );

    try {
      const { code } = await run(['--root', '1:1', '--endpoint', stub.url, '--allow-unreadable']);

      assert.equal(code, 0);
    } finally {
      await stub.close();
    }
  });

  it('exits 3 when it ran out of node budget', async () => {
    const stub = await /** @type {Promise<{ url: string; close: () => Promise<unknown> }>} */ (
      stubServer({
        get_metadata: ({ nodeId }) => ({
          text: nodeId === '1:1' ? design : '<instance id="1:2" name="sl-button" />'
        }),
        get_code_connect_map: () => ({ text: '{}' })
      })
    );

    try {
      const { code, stdout } = await run([
        '--root',
        '1:1',
        '--endpoint',
        stub.url,
        '--max-nodes',
        '1'
      ]);

      assert.equal(code, 3);
      assert.equal(JSON.parse(stdout).complete, false);
    } finally {
      await stub.close();
    }
  });

  it('exits 0 and reports the walk when the evidence settles it', async () => {
    const stub = await /** @type {Promise<{ url: string; close: () => Promise<unknown> }>} */ (
      stubServer({
        get_metadata: ({ nodeId }) => ({
          text: nodeId === '1:1' ? design : '<instance id="1:2" name="sl-button" />'
        }),
        get_code_connect_map: () => ({
          text: fixture('code-connect-resolved.json').replaceAll('334:20668', '1:2')
        })
      })
    );

    try {
      const { code, stdout } = await run(['--root', '1:1', '--endpoint', stub.url]);
      const report = JSON.parse(stdout);

      assert.equal(code, 0);
      assert.deepEqual(report.pruned, ['1:2']);
      assert.equal(report.calls.metadata, 1);
    } finally {
      await stub.close();
    }
  });

  it('exits 1 when nothing is listening on the endpoint', async () => {
    const { code, stderr } = await run(['--root', '1:1', '--endpoint', 'http://127.0.0.1:1/mcp']);

    assert.equal(code, 1);
    assert.match(stderr, /^1:1: /);
  });
});
