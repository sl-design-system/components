/**
 * The geometry comparator, tested the way the task's Verification demands: a fixture with
 * deliberately injected offsets, and the assertion that the comparator finds _exactly_ those.
 *
 * The oracle is the pair of fixtures, not the implementation read back:
 *
 * - `fixtures/geometry-metadata.txt` — a root frame at a non-zero canvas origin (78, 248) with
 *   parent-relative children, so the test exercises the frame-relative subtraction.
 * - `fixtures/geometry-rendered.html` — the same nodes, some placed exactly and some shifted by the
 *   offsets pinned below as constants, plus a placed wrapper, a rendered-but-undeclared node and an
 *   empty id that must be ignored.
 *
 * The injected offsets (see the HTML fixture's comments):
 *
 * - `1:4` shifted dx = +7, dy = -3
 * - `1:5` width + 12 (position exact)
 * - `1:3` placed exactly: delta 0, distance 0
 *
 * Pure functions are unit-tested with hand-built Maps and against the fixture without a browser;
 * the browser path shares one Chromium across the suite. A negative control pins the no-shared-ids
 * case and the undeclared-frame refusal.
 *
 * Usage: node --test runs/harness/compare-geometry.test.mjs
 */
import { strict as assert } from 'node:assert';
import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { after, before, describe, it } from 'node:test';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

import {
  GeometryReport,
  GeometryRefusal,
  compareDocument,
  declaredBoxes,
  joinGeometry,
  measureRendered,
  summarise
} from './compare-geometry.mjs';

const execFileAsync = promisify(execFile),
  here = fileURLToPath(new URL('.', import.meta.url)),
  metadataText = readFileSync(new URL('./fixtures/geometry-metadata.txt', import.meta.url), 'utf8'),
  renderedHtml = readFileSync(
    new URL('./fixtures/geometry-rendered.html', import.meta.url),
    'utf8'
  );

/** The deliberately injected offsets, written down so the test owns them, not the code. */
const OFFSET = {
  '1:4': { dx: 7, dy: -3, dwidth: 0, dheight: 0 },
  '1:5': { dx: 0, dy: 0, dwidth: 12, dheight: 0 },
  '1:3': { dx: 0, dy: 0, dwidth: 0, dheight: 0 }
};

describe('declaredBoxes', () => {
  it('resolves 1:3 to frame-relative x=30, y=40 (20+10, 30+10) — not 78+20+10', () => {
    const { boxes } = declaredBoxes(metadataText),
      box = boxes.get('1:3');

    assert.deepEqual(box, { x: 30, y: 40, width: 100, height: 50 });
  });

  it('subtracts the frame origin for a direct child (1:2 at 20, 30)', () => {
    const { boxes } = declaredBoxes(metadataText);

    assert.deepEqual(boxes.get('1:2'), { x: 20, y: 30, width: 400, height: 200 });
  });

  it('drops the root frame from the comparable boxes', () => {
    const { boxes, frame, declared } = declaredBoxes(metadataText);

    assert.equal(declared, true);
    assert.equal(frame.id, '1:1');
    assert.equal(boxes.has('1:1'), false);
  });

  it('reports declared=false when the metadata has no root frame', () => {
    const { declared } = declaredBoxes('<rect id="2:3" x="1" y="1" width="2" height="2"/>');

    assert.equal(declared, false);
  });
});

describe('joinGeometry', () => {
  it('reports rendered-minus-declared deltas and Euclidean distance', () => {
    const declared = new Map([['a', { x: 10, y: 10, width: 100, height: 50 }]]),
      rendered = new Map([['a', { x: 13, y: 6, width: 100, height: 50 }]]),
      join = joinGeometry(declared, rendered),
      [delta] = join.compared;

    assert.deepEqual(delta.delta, { dx: 3, dy: -4, dwidth: 0, dheight: 0 });
    assert.equal(delta.distance, 5);
  });

  it('counts declared-only and rendered-only ids separately rather than dropping them', () => {
    const declared = new Map([
        ['shared', { x: 0, y: 0, width: 1, height: 1 }],
        ['gone', { x: 0, y: 0, width: 1, height: 1 }]
      ]),
      rendered = new Map([
        ['shared', { x: 0, y: 0, width: 1, height: 1 }],
        ['extra', { x: 0, y: 0, width: 1, height: 1 }]
      ]),
      join = joinGeometry(declared, rendered);

    assert.deepEqual(
      join.compared.map(delta => delta.id),
      ['shared']
    );
    assert.deepEqual(join.declaredOnly, ['gone']);
    assert.deepEqual(join.renderedOnly, ['extra']);
  });

  it('NEGATIVE CONTROL: no shared ids yields compared: 0 and both sides intact', () => {
    const declared = new Map([['x', { x: 0, y: 0, width: 1, height: 1 }]]),
      rendered = new Map([['y', { x: 0, y: 0, width: 1, height: 1 }]]),
      join = joinGeometry(declared, rendered);

    assert.equal(join.compared.length, 0);
    assert.deepEqual(join.declaredOnly, ['x']);
    assert.deepEqual(join.renderedOnly, ['y']);
  });
});

describe('summarise', () => {
  it('reduces a join to counts, max/mean distance and the within-bands', () => {
    const declared = new Map([
        ['a', { x: 0, y: 0, width: 1, height: 1 }],
        ['b', { x: 0, y: 0, width: 1, height: 1 }],
        ['c', { x: 0, y: 0, width: 1, height: 1 }]
      ]),
      rendered = new Map([
        ['a', { x: 0, y: 0, width: 1, height: 1 }],
        ['b', { x: 3, y: 4, width: 1, height: 1 }],
        ['c', { x: 0, y: 0.5, width: 1, height: 1 }]
      ]),
      summary = summarise(joinGeometry(declared, rendered));

    assert.deepEqual(summary, {
      compared: 3,
      declaredOnly: 0,
      renderedOnly: 0,
      maxDistance: 5,
      meanDistance: 1.83,
      within1px: 2,
      within4px: 2
    });
  });

  it('reports zeroes for an empty join rather than NaN', () => {
    const summary = summarise({ compared: [], declaredOnly: [], renderedOnly: [] });

    assert.equal(summary.maxDistance, 0);
    assert.equal(summary.meanDistance, 0);
  });
});

describe('measureRendered + compareDocument (browser)', () => {
  /** @type {import('playwright').Browser} */ let browser;

  before(async () => {
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    await browser.close();
  });

  it('excludes placed wrappers from the measurement and counts them', async () => {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    await page.setContent(renderedHtml, { waitUntil: 'load' });

    const { rendered, placedWrappers } = await measureRendered(page);
    await page.close();

    assert.equal(placedWrappers, 1);
    // 1:2 only rendered as a wrapper, so it is not a measurable node; the empty id is ignored.
    assert.equal(rendered.has('1:2'), false);
    assert.equal(rendered.has(''), false);
    assert.deepEqual([...rendered.keys()].sort(), ['1:3', '1:4', '1:5', '9:9']);
  });

  it('counts a repeated id instead of letting the last element win', async () => {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    await page.setContent(
      '<style>body{margin:0}div{position:absolute}</style>' +
        '<div data-node-id="d:1" style="left:10px;top:10px;width:20px;height:20px"></div>' +
        '<div data-node-id="d:1" style="left:90px;top:90px;width:20px;height:20px"></div>' +
        '<div data-node-id="d:2" style="left:0;top:0;width:5px;height:5px"></div>',
      { waitUntil: 'load' }
    );

    const { rendered, duplicateIds } = await measureRendered(page);
    await page.close();

    assert.deepEqual(duplicateIds, ['d:1']);
    assert.equal(rendered.size, 2);
    assert.deepEqual(rendered.get('d:1'), { x: 10, y: 10, width: 20, height: 20 });
  });

  it('finds exactly the injected offsets and nothing else', async () => {
    const report = await compareDocument({
      html: renderedHtml,
      metadataText,
      viewport: { width: 800, height: 600 }
    });

    assert.doesNotThrow(() => GeometryReport.parse(report));

    const byId = Object.fromEntries(report.compared.map(delta => [delta.id, delta]));

    assert.deepEqual(report.compared.map(delta => delta.id).sort(), ['1:3', '1:4', '1:5']);
    assert.equal(report.summary.compared, 3);

    for (const [id, offset] of Object.entries(OFFSET)) {
      assert.deepEqual(byId[id].delta, offset, `delta for ${id}`);
    }

    // The exactly-placed nodes report distance 0.
    assert.equal(byId['1:3'].distance, 0);
    assert.equal(byId['1:5'].distance, 0);
    // 1:4 moved sqrt(7^2 + 3^2) = sqrt(58) ≈ 7.62.
    assert.equal(byId['1:4'].distance, 7.62);

    // 1:2 rendered only as a wrapper, so it joins declaredOnly alongside the never-rendered 1:9.
    assert.deepEqual(report.declaredOnly, ['1:2', '1:9']);
    assert.deepEqual(report.renderedOnly, ['9:9']);
    assert.equal(report.placedWrappers, 1);
    assert.deepEqual(report.duplicateIds, []);
    assert.equal(report.frameDeclared, true);
    assert.equal(report.frame.id, '1:1');
  });

  it('refuses rather than measuring against a fabricated frame', async () => {
    await assert.rejects(
      () =>
        compareDocument({
          html: renderedHtml,
          metadataText: '<rect id="2:3" x="1" y="1" width="2" height="2"/>'
        }),
      GeometryRefusal
    );
  });
});

describe('CLI', () => {
  /** @param {string[]} args */
  const runCli = args => execFileAsync('node', ['compare-geometry.mjs', ...args], { cwd: here });

  it('NEGATIVE CONTROL: exits non-zero naming the undeclared frame', async () => {
    await assert.rejects(
      () => runCli(['--run', 'fixtures/geometry-run-noframe']),
      /** @param {{ code: number; stderr: string }} error */ error => {
        assert.equal(error.code, 1);
        assert.match(error.stderr, /frame-undeclared/);
        return true;
      }
    );
  });

  it('exits non-zero when the metadata is missing', async () => {
    await assert.rejects(
      () => runCli(['--run', 'fixtures/does-not-exist']),
      /** @param {{ code: number; stderr: string }} error */ error => {
        assert.equal(error.code, 1);
        assert.match(error.stderr, /metadata-missing/);
        return true;
      }
    );
  });
});
