/**
 * The capture's five closure checks, and the control that shows three of them going red.
 *
 * Every expected value here comes from this task's acceptance criteria or from a measurement
 * recorded in it — **"`get_metadata` reported 98 nodes for a8's frame and REST reports 620"** — and
 * the artifacts named in the preconditions are real captures on disk, not invented shapes.
 */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  CAPTURE_SCHEMA_VERSION,
  captureDesign,
  carryForward,
  DISPOSITIONS,
  ASSET_CAP,
  collectNodes,
  coverage,
  declaredTruncations,
  designContextIds,
  determinism,
  figmaLinks,
  frontierClosure,
  matchTargets,
  metadataIds,
  readRestCapture,
  reconcile,
  budgetStop,
  rootOfRun,
  runChecks,
  verifyStored
} from './capture.mjs';

/**
 * The frame's document, as REST returned it. `nodes[id]` is nullable because REST answers `null`
 * for an id a file does not hold; here it is held, and the test says so once rather than at every
 * use.
 *
 * @param {ReturnType<typeof readRestCapture>} capture
 * @param {string} id
 */
const documentOf = (capture, id) => {
  const entry = capture.nodes[id];

  if (!entry) throw new Error(`the capture does not hold ${id}`);

  return /** @type {Record<string, any>} */ (entry.document);
};

const CAPTURE = 'runs/captures/a8-nsp-group-list',
  CORPUS = 'runs/2026-10-01-a8-nsp-group-list';

/** @param {string} path */
const read = path => readFileSync(path, 'utf8');

// ---------------------------------------------------------------------------------------------

describe('the target list', () => {
  it('reads a file key and a node id out of a design link', () => {
    assert.deepEqual(
      figmaLinks(
        'see https://www.figma.com/design/4TdMrcnIVOn3Hrfj2OpVZU/New-Secondary?node-id=334-20573 ok'
      ),
      [{ fileKey: '4TdMrcnIVOn3Hrfj2OpVZU', nodeId: '334:20573' }]
    );
  });

  it('accepts the colon form as well as the hyphen form a URL carries', () => {
    assert.deepEqual(figmaLinks('figma.com/design/KEYKEYKEYKEY/x?node-id=1:2'), [
      { fileKey: 'KEYKEYKEYKEY', nodeId: '1:2' }
    ]);
  });

  it('ignores a link with no node id, which names a file but not a design', () => {
    assert.deepEqual(
      figmaLinks('https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0'),
      []
    );
  });

  it('pairs a run with the file key whose link names its root node', () => {
    const { targets, unidentified } = matchTargets({
      runs: [
        { run: 'a8', rootNodeId: '334:20573', fileKey: null },
        { run: 'a5', rootNodeId: null, fileKey: null }
      ],
      links: [{ fileKey: '4TdMrcnIVOn3Hrfj2OpVZU', nodeId: '334:20573' }]
    });

    assert.deepEqual(targets, [
      {
        run: 'a8',
        rootNodeId: '334:20573',
        fileKey: '4TdMrcnIVOn3Hrfj2OpVZU',
        source: 'link',
        rootSource: 'index'
      }
    ]);
    assert.deepEqual(unidentified, [{ run: 'a5', reason: 'the run records no root node id' }]);
  });

  it('prefers the key the run already recorded, and says the two agreed', () => {
    const { targets } = matchTargets({
      runs: [{ run: 'a8', rootNodeId: '334:20573', fileKey: '4TdMrcnIVOn3Hrfj2OpVZU' }],
      links: [{ fileKey: '4TdMrcnIVOn3Hrfj2OpVZU', nodeId: '334:20573' }]
    });

    assert.equal(targets[0].source, 'index+link');
  });

  describe('NEGATIVE CONTROL: an ambiguous target is not guessed at', () => {
    it('refuses a run whose root node id two different files claim', () => {
      const { targets, unidentified } = matchTargets({
        runs: [{ run: 'x', rootNodeId: '1:2', fileKey: null }],
        links: [
          { fileKey: 'AAAAAAAAAAAA', nodeId: '1:2' },
          { fileKey: 'BBBBBBBBBBBB', nodeId: '1:2' }
        ]
      });

      assert.deepEqual(targets, []);
      assert.match(unidentified[0].reason, /two file keys|more than one/);
    });

    it('refuses a run whose root node no link mentions', () => {
      const { unidentified } = matchTargets({
        runs: [{ run: 'x', rootNodeId: '9:9', fileKey: null }],
        links: []
      });

      assert.match(unidentified[0].reason, /no link/);
    });
  });
});

describe('a run that did not record its own root', () => {
  // `runs/harness/fixtures/metadata-escaped-envelope.txt` **is** a5's metadata, kept as a
  // fixture by `render-design.mjs` for the same reason it matters here: every quote is escaped,
  // so `id="…"` appears nowhere in the file.
  const a5 = read('runs/harness/fixtures/metadata-escaped-envelope.txt');

  it('takes the root the index recorded when there is one', () => {
    assert.deepEqual(rootOfRun({ indexRoot: '334:20573', metadata: a5 }), {
      rootNodeId: '334:20573',
      rootSource: 'index'
    });
  });

  it("falls back to the root in the run's own capture", () => {
    assert.deepEqual(rootOfRun({ indexRoot: null, metadata: a5 }), {
      rootNodeId: '17214:103584',
      rootSource: 'capture'
    });
  });

  it('says so when neither knows', () => {
    assert.deepEqual(rootOfRun({ indexRoot: null, metadata: 'No node could be found' }), {
      rootNodeId: null,
      rootSource: 'none'
    });
  });

  describe('NEGATIVE CONTROL: a frame nobody declared is not a root', () => {
    it('refuses an id that came with a fabricated frame', () => {
      const verdict = rootOfRun({
        indexRoot: null,
        metadata: 'anything',
        resolve: () => ({
          frame: { id: '1:1', width: 1440, height: 1024 },
          declared: false,
          line: null
        })
      });

      assert.deepEqual(verdict, { rootNodeId: null, rootSource: 'none' });
    });
  });

  describe('NEGATIVE CONTROL: the escaped envelope defeats the obvious reader', () => {
    it('a reader that greps id="…" finds nothing in it, which is why one was not written', () => {
      assert.equal(/\bid="[^"]*"/.test(a5), false);
      assert.equal(metadataIds(a5).length, 0);
    });

    it('and the fallback finds the root anyway', () => {
      assert.equal(rootOfRun({ indexRoot: null, metadata: a5 }).rootNodeId, '17214:103584');
    });
  });
});

describe('the target list, when the resolver cannot do it alone', () => {
  it('takes an operator override, and marks it as one rather than as evidence', () => {
    const { targets, unidentified } = matchTargets({
      runs: [{ run: 'a5', rootNodeId: null, fileKey: null }],
      links: [],
      override: { run: 'a5', fileKey: 'S5QgDy8X9eqhvECPANSZMM', rootNodeId: '17214:103584' }
    });

    assert.deepEqual(unidentified, []);
    assert.deepEqual(targets, [
      {
        run: 'a5',
        rootNodeId: '17214:103584',
        fileKey: 'S5QgDy8X9eqhvECPANSZMM',
        source: 'override',
        rootSource: 'override'
      }
    ]);
  });

  it('records that a root came from the capture, which is weaker than the index saying it', () => {
    const { targets } = matchTargets({
      runs: [{ run: 'a5', rootNodeId: '17214:103584', fileKey: null, rootSource: 'capture' }],
      links: [{ fileKey: 'S5QgDy8X9eqhvECPANSZMM', nodeId: '17214:103584' }]
    });

    assert.equal(targets[0].rootSource, 'capture');
    assert.equal(targets[0].source, 'link');
  });

  describe('NEGATIVE CONTROL: an override for another run does not rescue this one', () => {
    it('leaves the run unidentified', () => {
      const { targets, unidentified } = matchTargets({
        runs: [{ run: 'a5', rootNodeId: null, fileKey: null }],
        links: [],
        override: { run: 'a8', fileKey: 'K', rootNodeId: '1:2' }
      });

      assert.deepEqual(targets, []);
      assert.equal(unidentified.length, 1);
    });
  });
});

describe('a run that is not resuming starts from nothing', () => {
  const target = { run: 'x', fileKey: 'K', rootNodeId: '1:2' },
    rest = {
      /** @param {string} path */
      getTo: async path => ({
        url: 'u',
        status: 200,
        ok: true,
        ms: 1,
        bytes: 2,
        sha256: 'h',
        file: path,
        retryAfter: null,
        error: null
      })
    };

  it('clears the design before capturing it', async () => {
    /** @type {string[]} */
    const cleared = [];

    await captureDesign({ rest, target, outDir: 'out/x', clear: dir => cleared.push(dir) });

    assert.deepEqual(cleared, ['out/x']);
  });

  it('stops before the call that would break the budget, not after it', async () => {
    /** @type {string[]} */
    const asked = [];

    const { records, stoppedBy } = await captureDesign({
      rest: {
        /** @param {string} path @param {string} url */
        getTo: async (path, url) => {
          asked.push(url);

          return {
            url,
            status: 200,
            ok: true,
            ms: 1,
            bytes: 2,
            sha256: 'h',
            file: path,
            retryAfter: null,
            error: null
          };
        }
      },
      target,
      outDir: 'out/x',
      maxCalls: 2
    });

    assert.equal(asked.length, 2);
    assert.equal(records.length, 2);
    assert.match(stoppedBy ?? '', /max-calls/);
  });

  describe('NEGATIVE CONTROL: resuming must not throw away what it is resuming from', () => {
    it('clears nothing when resuming', async () => {
      /** @type {string[]} */
      const cleared = [];

      await captureDesign({
        rest,
        target,
        outDir: 'out/x',
        resume: true,
        exists: () => false,
        clear: dir => cleared.push(dir)
      });

      assert.deepEqual(cleared, []);
    });
  });
});

describe('a resumed run keeps the records of what it did not re-fetch', () => {
  /** @param {string} path */
  const exists = path => path !== 'gone.json';

  it('carries forward a record for a file the run skipped', () => {
    const kept = carryForward({
      records: [{ file: 'a.json', sha256: 'a' }],
      previous: [
        { file: 'a.json', sha256: 'a' },
        { file: 'b.png', sha256: 'b' }
      ],
      exists
    });

    assert.deepEqual(
      kept.map(one => one.file),
      ['a.json', 'b.png']
    );
    assert.equal(kept[1].reused, true);
  });

  it('prefers the record this run made over the one it inherited', () => {
    const kept = carryForward({
      records: [{ file: 'a.json', sha256: 'fresh' }],
      previous: [{ file: 'a.json', sha256: 'stale' }],
      exists
    });

    assert.equal(kept.length, 1);
    assert.equal(kept[0].sha256, 'fresh');
  });

  describe('NEGATIVE CONTROL: a record is never carried for a file that is gone', () => {
    it('drops it rather than attesting to something that is not there', () => {
      const kept = carryForward({
        records: [],
        previous: [{ file: 'gone.json', sha256: 'x' }],
        exists
      });

      assert.deepEqual(kept, []);
    });

    it('and a file on disk with no record is what this prevents', () => {
      // Nineteen renders were on disk with no record saying what they should hash to, because a
      // resumed run rebuilt its manifest from the calls it made rather than from what it holds.
      const kept = carryForward({
        records: [{ file: 'a.json', sha256: 'a' }],
        previous: [{ file: 'render.png', sha256: 'r' }],
        exists
      });

      assert.ok(kept.some(one => one.file === 'render.png'));
    });
  });
});

describe('the per-design budget', () => {
  it('lets a capture through when it is inside both budgets', () => {
    assert.equal(budgetStop({ bytes: 10, calls: 1, maxBytes: 100, maxCalls: 5 }), null);
  });

  it('is off when no budget was set, which is what every capture so far ran under', () => {
    assert.equal(budgetStop({ bytes: 28_466_383, calls: 4 }), null);
  });

  describe('NEGATIVE CONTROL: a budget that bites names itself', () => {
    it('stops on bytes, naming the number', () => {
      // a2-nsp-class-overview pulled 28 MB in one call with nothing able to stop it.
      const stop = budgetStop({ bytes: 28_466_383, calls: 1, maxBytes: 8_000_000 });

      assert.match(stop ?? '', /max-bytes/);
      assert.match(stop ?? '', /8000000/);
    });

    it('stops on calls, naming the number', () => {
      const stop = budgetStop({ bytes: 1, calls: 6, maxCalls: 5 });

      assert.match(stop ?? '', /max-calls/);
      assert.match(stop ?? '', /5/);
    });

    it('makes the capture incomplete with the budget as the reason', () => {
      const report = runChecks({
        budget: { status: 'red', detail: 'the --max-bytes budget of 8000000 stopped it' }
      });

      assert.equal(report.complete, false);
      assert.match(report.reasons[0], /max-bytes/);
    });
  });
});

// ---------------------------------------------------------------------------------------------

describe('the corpus is nineteen designs', () => {
  it('captured all of them, and has nothing left unidentified', () => {
    const index = JSON.parse(read('runs/captures/index.json'));

    assert.equal(index.designs.length, 19);
    assert.deepEqual(index.unidentified, []);
  });

  it('holds the nineteenth, whose root its own run never recorded', () => {
    const a5 = JSON.parse(read('runs/captures/a5-etsl-metadata-usage-widget/manifest.json'));

    assert.equal(a5.rootNodeId, '17214:103584');
    assert.equal(a5.fileKey, 'S5QgDy8X9eqhvECPANSZMM');
    assert.equal(a5.rootSource, 'capture');
    assert.equal(a5.complete, true);
  });
});

// ---------------------------------------------------------------------------------------------

describe('the stored REST capture', () => {
  it('carries the four things MCP withholds', () => {
    const capture = readRestCapture(read(`${CAPTURE}/rest/nodes-334-20573.json`));

    // F10: Figma does not identify the design. In REST it does.
    assert.equal(capture.name, 'New Secondary');
    assert.equal(capture.lastModified, '2026-09-23T14:00:01Z');
    assert.equal(capture.version, '2402425610621681042');
    assert.ok(/** @type {string} */ (capture.version) !== 'unknown');
  });

  it('reports 620 nodes for the frame get_metadata called 98', () => {
    const capture = readRestCapture(read(`${CAPTURE}/rest/nodes-334-20573.json`)),
      nodes = collectNodes(documentOf(capture, '334:20573'));

    assert.equal(nodes.size, 620);
  });

  it('carries componentId and overrides on instances, which is what F3b asked for', () => {
    const capture = readRestCapture(read(`${CAPTURE}/rest/nodes-334-20573.json`)),
      nodes = [...collectNodes(documentOf(capture, '334:20573')).values()];

    assert.equal(nodes.filter(one => one.componentId).length, 252);
    assert.equal(nodes.filter(one => one.overrides).length, 252);
  });

  it('reads an omitted `visible` as visible, which is how REST says so', () => {
    // Measured on this capture: 121 nodes carry `visible: false` and the other 499 carry no
    // `visible` key at all. Reading absence as hidden would hide the entire design.
    const capture = readRestCapture(read(`${CAPTURE}/rest/nodes-334-20573.json`)),
      nodes = [...collectNodes(documentOf(capture, '334:20573')).values()];

    assert.equal(nodes.filter(one => one.visible).length, 499);
    assert.equal(nodes.filter(one => !one.visible).length, 121);
  });

  it('gives every node a bounding box, which is what makes the raster witness possible', () => {
    const capture = readRestCapture(read(`${CAPTURE}/rest/nodes-334-20573.json`)),
      nodes = [...collectNodes(documentOf(capture, '334:20573')).values()];

    assert.equal(nodes.filter(one => one.box).length, 620);
  });

  it('reads null as the answer it is — the file does not hold that node', () => {
    // Two corpus runs hold a `123-456.txt`, named after the server's error message template
    // rather than after a node. REST is what settles it, and it settles it with null.
    const capture = readRestCapture(
      '{"name":"f","lastModified":"t","version":"1","nodes":{"123:456":null}}'
    );

    assert.equal(capture.nodes['123:456'], null);
  });

  describe('NEGATIVE CONTROL: a response that is not a capture is refused', () => {
    it('refuses an error document, which is what a 403 body would leave behind', () => {
      assert.throws(
        () => readRestCapture('{"status":403,"err":"Invalid scope(s)"}'),
        /not a REST node response/
      );
    });

    it('refuses text that is not JSON rather than returning an empty document', () => {
      assert.throws(() => readRestCapture('No node could be found'), /JSON/);
    });
  });
});

// ---------------------------------------------------------------------------------------------

describe('check 3 — the three tools must agree about which nodes exist', () => {
  const rest = [
      ...collectNodes(
        documentOf(readRestCapture(read(`${CAPTURE}/rest/nodes-334-20573.json`)), '334:20573')
      ).keys()
    ],
    metadata = metadataIds(read(`${CORPUS}/captures/metadata/334-20573.txt`)),
    designContext = ['334-20574', '334-20578', '334-20684'].flatMap(id =>
      designContextIds(read(`${CORPUS}/captures/design-context/${id}.txt`))
    );

  it('reads the ids each tool emits', () => {
    assert.equal(rest.length, 620);
    assert.equal(new Set(metadata).size, 98);
    assert.equal(new Set(designContext).size, 176);
  });

  it('accounts for every id MCP saw — REST is the superset, measured', () => {
    const verdict = reconcile({ rest, metadata, designContext });

    assert.deepEqual(verdict.onlyMetadata, []);
    assert.deepEqual(verdict.onlyDesignContext, []);
    assert.equal(verdict.status, 'green');
  });

  it('counts the 412 nodes only REST saw, which is the ratio this task exists to expose', () => {
    const verdict = reconcile({ rest, metadata, designContext });

    assert.equal(verdict.onlyRest, 412);
  });

  describe('NEGATIVE CONTROL: disagreement is the detector, and it fires', () => {
    it('goes red when a tool names a node the capture does not hold', () => {
      const verdict = reconcile({ rest: ['1:1'], metadata: ['1:1', '9:9'], designContext: [] });

      assert.equal(verdict.status, 'red');
      assert.deepEqual(verdict.onlyMetadata, ['9:9']);
    });

    it('classifies a nested id rather than calling it a disagreement', () => {
      const verdict = reconcile({
        rest: ['1:1'],
        metadata: ['1:1', 'I1:1;2:2'],
        designContext: []
      });

      assert.equal(verdict.status, 'green');
      assert.deepEqual(verdict.nested, ['I1:1;2:2']);
    });
  });
});

// ---------------------------------------------------------------------------------------------

describe('the ids a tool emits', () => {
  it('reads the ids out of design-context markup', () => {
    assert.deepEqual(
      designContextIds('<div data-node-id="2034:6953"><b data-node-id="2034:6954">'),
      ['2034:6953', '2034:6954']
    );
  });

  describe("NEGATIVE CONTROL: the tool's own documentation is not design data", () => {
    it('ignores the example id in the preamble, which appears in four unrelated files', () => {
      // Verbatim text from `get_design_context`, which is why the id `1:2` turned up as a
      // phantom node in a2, a6, a10 and b-itsl-bookmk-deleted-course at once.
      const preamble =
        'Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.';

      assert.deepEqual(designContextIds(preamble), []);
      assert.deepEqual(designContextIds(`${preamble}<div data-node-id="9:9">`), ['9:9']);
    });
  });
});

describe('check 1 — the frontier closes', () => {
  it('is green when every node that entered left with a disposition the capture holds', () => {
    const verdict = frontierClosure({
      entered: ['1:1', '1:2'],
      dispositions: { '1:1': 'captured', '1:2': 'hidden' },
      present: ['1:1']
    });

    assert.equal(verdict.status, 'green');
  });

  it('names every disposition a node may leave by', () => {
    assert.deepEqual(
      [...DISPOSITIONS].sort(),
      ['captured', 'descended', 'excluded', 'failed', 'hidden', 'nested', 'resolved'].sort()
    );
  });

  describe('NEGATIVE CONTROL: a node with no disposition is a bug in the walk', () => {
    it('goes red when a node entered the frontier and never left it', () => {
      const verdict = frontierClosure({
        entered: ['1:1', '1:2'],
        dispositions: { '1:1': 'captured' },
        present: ['1:1']
      });

      assert.equal(verdict.status, 'red');
      assert.deepEqual(verdict.withoutDisposition, ['1:2']);
    });

    it('goes red when a node was called captured and is not on disk', () => {
      const verdict = frontierClosure({
        entered: ['1:1'],
        dispositions: { '1:1': 'captured' },
        present: []
      });

      assert.equal(verdict.status, 'red');
      assert.deepEqual(verdict.claimedButAbsent, ['1:1']);
    });

    it('goes red on a disposition nobody defined', () => {
      const verdict = frontierClosure({
        entered: ['1:1'],
        dispositions: { '1:1': 'probably-fine' },
        present: ['1:1']
      });

      assert.equal(verdict.status, 'red');
      assert.deepEqual(verdict.unknownDisposition, ['1:1']);
    });
  });
});

// ---------------------------------------------------------------------------------------------

describe('check 2 — nothing declared itself incomplete', () => {
  it('knows the cap download_assets reports at', () => {
    assert.equal(ASSET_CAP, 20);
  });

  it('is green when no response said it stopped early', () => {
    const verdict = declaredTruncations({
      assets: { rawImagesTruncated: false, svgAssetsTruncated: false }
    });

    assert.equal(verdict.status, 'green');
    assert.deepEqual(verdict.signals, []);
  });

  describe('NEGATIVE CONTROL: every tool that truncates says so, and it is heard', () => {
    it('hears rawImagesTruncated', () => {
      const verdict = declaredTruncations({ assets: { rawImagesTruncated: true } });

      assert.equal(verdict.status, 'red');
      assert.deepEqual(verdict.signals, [{ where: 'assets', signal: 'rawImagesTruncated' }]);
    });

    it('hears svgAssetsTruncated', () => {
      assert.equal(declaredTruncations({ assets: { svgAssetsTruncated: true } }).status, 'red');
    });

    it('hears the remote server appending its own timeout note to an empty map', () => {
      const verdict = declaredTruncations({ map: 'Note: the Code Connect lookup timed out' });

      assert.equal(verdict.status, 'red');
      assert.equal(verdict.signals[0].signal, 'the response says it timed out');
    });

    it('hears a list that arrived at exactly the cap, which cannot be told from a full one', () => {
      const verdict = declaredTruncations({
        assets: { svgAssets: Array.from({ length: 20 }, (_, i) => `s${i}`) }
      });

      assert.equal(verdict.status, 'red');
      assert.match(verdict.signals[0].signal, /cap of 20/);
    });
  });
});

// ---------------------------------------------------------------------------------------------

describe('check 4 — the geometry is an independent witness', () => {
  const frame = { x: 0, y: 0, width: 100, height: 100 };

  it('reports how much of the frame the captured nodes cover', () => {
    const verdict = coverage({ frame, boxes: [{ x: 0, y: 0, width: 100, height: 100 }], grid: 10 });

    assert.equal(verdict.ratio, 1);
    assert.equal(verdict.outside, 0);
    assert.equal(verdict.status, 'green');
  });

  it('is a differential check: it falls when a region stops being covered', () => {
    const whole = coverage({ frame, boxes: [{ x: 0, y: 0, width: 100, height: 100 }], grid: 10 }),
      half = coverage({
        frame,
        boxes: [{ x: 0, y: 0, width: 100, height: 50 }],
        grid: 10,
        baseline: whole.ratio
      });

    assert.equal(half.ratio, 0.5);
    assert.equal(half.status, 'red');
  });

  it('counts a box outside the frame without calling it a fault', () => {
    // Measured over all eighteen captures: a1-kampus has 920 such nodes because its root frame
    // clips a list that runs past the bottom. Red here would fire on 14 of 18 healthy designs.
    const verdict = coverage({
      frame,
      boxes: [
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 500, y: 500, width: 10, height: 10 }
      ],
      grid: 10
    });

    assert.equal(verdict.outside, 1);
    assert.equal(verdict.status, 'green');
  });

  describe('NEGATIVE CONTROL: the check can only speak against a baseline, and does', () => {
    it('stays green with no baseline, however little of the frame is covered', () => {
      assert.equal(coverage({ frame, boxes: [], grid: 10 }).status, 'green');
    });

    it('goes red the moment a baseline says the frame used to be better covered', () => {
      assert.equal(coverage({ frame, boxes: [], grid: 10, baseline: 0.01 }).status, 'red');
    });
  });
});

// ---------------------------------------------------------------------------------------------

describe('check 5 — a re-run produces the same hashes, or names what differed', () => {
  it('is green when both runs stored the same bytes', () => {
    const one = { records: [{ url: 'u', sha256: 'aaa', bytes: 10 }] },
      verdict = determinism(one, { records: [{ url: 'u', sha256: 'aaa', bytes: 10 }] });

    assert.equal(verdict.status, 'green');
    assert.deepEqual(verdict.differing, []);
  });

  describe('NEGATIVE CONTROL: a difference is named rather than averaged away', () => {
    it('names the call and the field that moved', () => {
      const verdict = determinism(
        { records: [{ url: 'u', sha256: 'aaa', bytes: 10 }] },
        { records: [{ url: 'u', sha256: 'bbb', bytes: 12 }] }
      );

      assert.equal(verdict.status, 'red');
      assert.deepEqual(verdict.differing, [
        { url: 'u', field: 'sha256', a: 'aaa', b: 'bbb' },
        { url: 'u', field: 'bytes', a: 10, b: 12 }
      ]);
    });

    it('names a call one run made and the other did not', () => {
      const verdict = determinism(
        { records: [{ url: 'u', sha256: 'a', bytes: 1 }] },
        { records: [] }
      );

      assert.equal(verdict.status, 'red');
      assert.deepEqual(verdict.onlyInA, ['u']);
    });
  });
});

// ---------------------------------------------------------------------------------------------

describe('THE DELETION CONTROL — a capture missing a subtree is caught', () => {
  const capture = readRestCapture(read(`${CAPTURE}/rest/nodes-334-20573.json`)),
    document = documentOf(capture, '334:20573'),
    full = collectNodes(document),
    frame = /** @type {import('./capture.mjs').Box} */ (document.absoluteBoundingBox);

  /** @param {Map<string, import('./capture.mjs').CapturedNode>} nodes */
  const boxesOf = nodes =>
    [...nodes.values()]
      .filter(one => one.box && one.id !== document.id)
      .map(one => /** @type {import('./capture.mjs').Box} */ (one.box));

  /**
   * Removes one real subtree, which is what a capture that stopped early looks like.
   *
   * @param {string} id
   */
  const without = id => {
    const clone = structuredClone(document);

    /** @param {Record<string, any>} node */
    const prune = node => {
      node.children = (node.children ?? []).filter(
        /** @param {{ id: string }} child */ child => child.id !== id
      );

      for (const child of node.children) prune(child);
    };

    prune(clone);

    return collectNodes(clone);
  };

  // `334:20578` is one of the frame's three direct children and holds 468 of its 620 nodes.
  const REGION = '334:20578',
    damaged = without(REGION);

  it('the control actually removes something', () => {
    assert.equal(full.size, 620);
    assert.equal(damaged.size, 152);
  });

  it('check 1 goes red: nodes the walk disposed of are no longer on disk', () => {
    const entered = [...full.keys()],
      verdict = frontierClosure({
        entered,
        dispositions: Object.fromEntries(entered.map(id => [id, 'captured'])),
        present: [...damaged.keys()]
      });

    assert.equal(verdict.status, 'red');
    assert.ok(verdict.claimedButAbsent.includes(REGION));
  });

  it('check 3 goes red: MCP still names nodes REST no longer holds', () => {
    const verdict = reconcile({
      rest: [...damaged.keys()],
      metadata: [...full.keys()].filter(id => !id.includes(';')),
      designContext: []
    });

    assert.equal(verdict.status, 'red');
    assert.ok(verdict.onlyMetadata.length > 0);
  });

  it('check 4 goes red: the frame has a region no captured node covers any more', () => {
    const before = coverage({ frame, boxes: boxesOf(full) }),
      after = coverage({ frame, boxes: boxesOf(damaged), baseline: before.ratio });

    assert.ok(
      after.ratio < before.ratio,
      `coverage did not fall: ${before.ratio} → ${after.ratio}`
    );
    assert.equal(after.status, 'red');
  });

  describe('and the blind spot the three reds must not be read as covering', () => {
    // An interior node's pixels are still covered by its ancestors' boxes, so geometry alone
    // cannot see it go. Measured rather than assumed, and bounded here so nobody reads check 4
    // as a guarantee that every missing node leaves a hole.
    // `334:20585` is "Frame 6", an interior frame holding 220 of the 620 nodes.
    const INTERIOR = '334:20585',
      subtle = without(INTERIOR);

    it('checks 1 and 3 still catch an interior subtree', () => {
      const entered = [...full.keys()];

      assert.equal(full.size - subtle.size, 220);
      assert.equal(
        frontierClosure({
          entered,
          dispositions: Object.fromEntries(entered.map(id => [id, 'captured'])),
          present: [...subtle.keys()]
        }).status,
        'red'
      );
      assert.equal(
        reconcile({ rest: [...subtle.keys()], metadata: [...full.keys()], designContext: [] })
          .status,
        'red'
      );
    });

    it('check 4 does not — 220 nodes vanish and the coverage does not move', () => {
      const before = coverage({ frame, boxes: boxesOf(full) }),
        after = coverage({ frame, boxes: boxesOf(subtle), baseline: before.ratio });

      assert.equal(after.ratio, before.ratio);
      assert.equal(after.status, 'green');
    });
  });
});

describe('verbatim is checked, not assumed', () => {
  /** @param {Buffer} bytes */
  const digest = bytes => `h:${bytes.toString()}`;

  /** @param {Record<string, string>} files */
  const world = files => ({
    /** @param {string} path */
    read: path => Buffer.from(files[path] ?? ''),
    /** @param {string} path */
    exists: path => path in files,
    digest
  });

  it('is green when the bytes on disk are the bytes the record attests to', () => {
    const verdict = verifyStored({
      records: [{ file: 'a.json', sha256: 'h:abc' }],
      ...world({ 'a.json': 'abc' })
    });

    assert.equal(verdict.status, 'green');
    assert.equal(verdict.checked, 1);
  });

  it('reports a file on disk that no record attests to', () => {
    const verdict = verifyStored({
      records: [{ file: 'a.json', sha256: 'h:abc' }],
      present: ['a.json', 'orphan.png'],
      ...world({ 'a.json': 'abc' })
    });

    assert.equal(verdict.status, 'red');
    assert.deepEqual(verdict.unattested, ['orphan.png']);
  });

  describe('NEGATIVE CONTROL: a file that changed under us is caught', () => {
    it('catches a reformatted capture, which is what the pre-commit hook did to all 71', () => {
      const verdict = verifyStored({
        records: [{ file: 'a.json', sha256: 'h:abc' }],
        ...world({ 'a.json': 'a b c' })
      });

      assert.equal(verdict.status, 'red');
      assert.match(verdict.failures[0].reason, /hash/);
    });

    it('catches a record whose file is gone', () => {
      const verdict = verifyStored({
        records: [{ file: 'a.json', sha256: 'h:abc' }],
        ...world({})
      });

      assert.equal(verdict.status, 'red');
      assert.equal(verdict.checked, 0);
      assert.match(verdict.failures[0].reason, /not there/);
    });
  });
});

// ---------------------------------------------------------------------------------------------

describe('the capture report', () => {
  it('carries its schema version', () => {
    assert.equal(CAPTURE_SCHEMA_VERSION, 1);
  });

  it('is complete only when all five checks are green', () => {
    const report = runChecks({
      closure: { status: 'green' },
      truncation: { status: 'green' },
      reconciliation: { status: 'green' },
      coverage: { status: 'green' },
      determinism: { status: 'skipped', detail: 'the design was captured once' }
    });

    assert.equal(report.complete, true);
    assert.deepEqual(report.reasons, []);
  });

  describe('NEGATIVE CONTROL: one red check is enough to make the capture incomplete', () => {
    it('says which check stopped it', () => {
      const report = runChecks({
        closure: { status: 'green' },
        truncation: { status: 'red', detail: 'svgAssetsTruncated' },
        reconciliation: { status: 'green' },
        coverage: { status: 'green' },
        determinism: { status: 'skipped' }
      });

      assert.equal(report.complete, false);
      assert.deepEqual(report.reasons, ['truncation: svgAssetsTruncated']);
    });
  });
});
