/**
 * The census, tested two ways: the detectors against synthetic fixtures with a known answer, and
 * the corpus against the runs the render-failure taxonomy already named — `a1` prose, `a3`
 * channel-halved, the three hand-backfilled runs, the four agent-prose runs, and the nine that
 * render. Expected values come from the taxonomy and the plan, never from reading the script back.
 *
 * Usage: node --test runs/harness/census.test.mjs
 */
import { strict as assert } from 'node:assert';
import { existsSync } from 'node:fs';
import { describe, it } from 'node:test';
import { PNG } from 'pngjs';

import {
  CensusRefusal,
  HALF_CHANNEL,
  buildCensus,
  capturedAtSpreadMs,
  channelMax,
  classifyProvenance,
  detectProseMarker,
  isTruncated,
  referenceState,
  serialise
} from './census.mjs';

/** A decoded-PNG stand-in: one solid colour, so `channelMax` has a known answer. */
/** @param {number} r @param {number} g @param {number} b @param {number} [size] */
const solidPng = (r, g, b, size = 4) => {
  const png = new PNG({ width: size, height: size });

  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = r;
    png.data[i + 1] = g;
    png.data[i + 2] = b;
    png.data[i + 3] = 255;
  }

  return png;
};

describe('detectProseMarker', () => {
  it('names the ellipsis-param stub a1 holds', () => {
    assert.equal(detectProseMarker('function IconButton({ ... })')?.label, 'ellipsis-param');
  });

  it('names the html placeholder a9 holds', () => {
    assert.equal(detectProseMarker('<!-- Insert options here -->')?.label, 'html-placeholder');
  });

  it('names the brevity truncation a11 holds', () => {
    assert.equal(
      detectProseMarker('the full JSX tree; truncated here for brevity')?.label,
      'brevity-truncation'
    );
  });

  it('names the transcript pointer', () => {
    assert.equal(
      detectProseMarker('See conversation transcript for the exact code payload')?.label,
      'transcript-pointer'
    );
  });

  it('names lorem-ipsum', () => {
    assert.equal(detectProseMarker('{lorem-ipsum description}')?.label, 'lorem-ipsum');
  });

  it('finds nothing in real design-context output', () => {
    assert.equal(
      detectProseMarker('const assetPathPrefix = "x";\n<div data-node-id="1:2" className="p-4">'),
      null
    );
  });
});

describe('classifyProvenance', () => {
  const real = 'const assetPathPrefix="x";\n<div data-node-id="1:2" className="p-4">hi</div>';

  it('refuses a run with no captures rather than defaulting', () => {
    assert.throws(
      () =>
        classifyProvenance({
          captureRegions: 0,
          normalisedRegions: 0,
          source: '',
          designContextBytes: 0,
          metadataBytes: 10
        }),
      CensusRefusal
    );
  });

  it('calls captures the re-normalisation drops hand-backfilled', () => {
    assert.equal(
      classifyProvenance({
        captureRegions: 3,
        normalisedRegions: 0,
        source: real,
        designContextBytes: real.length,
        metadataBytes: 100
      }).provenance,
      'hand-backfilled'
    );
  });

  it('calls a prose stub agent-prose even when captures survive', () => {
    assert.equal(
      classifyProvenance({
        captureRegions: 1,
        normalisedRegions: 1,
        source: 'function IconButton({ ... })',
        designContextBytes: 999999,
        metadataBytes: 100
      }).provenance,
      'agent-prose'
    );
  });

  it('calls a context tiny in both senses summarised', () => {
    assert.equal(
      classifyProvenance({
        captureRegions: 1,
        normalisedRegions: 1,
        source: '<div data-node-id="1:2">x</div>',
        designContextBytes: 3000,
        metadataBytes: 60000
      }).provenance,
      'summarised'
    );
  });

  it('calls real tool output figma-bytes, not summarised, when the context is terse but not tiny relative to metadata', () => {
    assert.equal(
      classifyProvenance({
        captureRegions: 1,
        normalisedRegions: 1,
        source: real,
        designContextBytes: 9000,
        metadataBytes: 3000
      }).provenance,
      'figma-bytes'
    );
  });

  it('calls JSX without data-node-id reconstructed', () => {
    assert.equal(
      classifyProvenance({
        captureRegions: 1,
        normalisedRegions: 1,
        source: '<div className="p-4">x</div>',
        designContextBytes: 50000,
        metadataBytes: 1000
      }).provenance,
      'reconstructed'
    );
  });
});

describe('channelMax', () => {
  it('reads a halved reference as 128', () => {
    assert.equal(channelMax(solidPng(128, 64, 100)), 128);
  });

  it('reads a full reference as 255', () => {
    assert.equal(channelMax(solidPng(10, 255, 10)), 255);
  });
});

describe('referenceState', () => {
  const frame = { width: 1000, height: 800 };

  it('refuses a channel-halved reference whatever its size', () => {
    const state = referenceState({
      frame,
      file: 'screenshot.png',
      width: 1000,
      height: 800,
      maxChannel: HALF_CHANNEL
    });

    assert.equal(state.state, 'channel-halved');
    assert.equal(state.refused, true);
  });

  it('calls an equal reference exact', () => {
    assert.equal(
      referenceState({ frame, file: 'r.png', width: 1000, height: 800, maxChannel: 255 }).state,
      'exact'
    );
  });

  it('absorbs one-pixel rounding into exact', () => {
    assert.equal(
      referenceState({ frame, file: 'r.png', width: 1001, height: 800, maxChannel: 255 }).state,
      'exact'
    );
  });

  it('calls a uniform shrink downscaled with its factor', () => {
    const state = referenceState({
      frame,
      file: 'r.png',
      width: 800,
      height: 640,
      maxChannel: 255
    });

    assert.equal(state.state, 'downscaled');
    assert.equal(state.factor, 0.8);
    assert.equal(state.uniform, true);
  });

  it('flags a non-uniform shrink as downscaled but not uniform', () => {
    const state = referenceState({
      frame,
      file: 'r.png',
      width: 677,
      height: 728,
      maxChannel: 255
    });

    assert.equal(state.state, 'downscaled');
    assert.equal(state.uniform, false);
  });

  it('calls a stretched reference a mismatch', () => {
    assert.equal(
      referenceState({ frame, file: 'r.png', width: 1200, height: 700, maxChannel: 255 }).state,
      'mismatched'
    );
  });

  it('does not let a percentage swallow a reference trimmed by a few rows', () => {
    // b-itsl-bookmk-deleted-course: 1280×1073 against a declared 1280×1082 — width exact, height
    // nine rows short. Under a 1 % ratio this read as exact; it is neither exact nor a downscale.
    const state = referenceState({
      frame: { width: 1280, height: 1082 },
      file: 'r.png',
      width: 1280,
      height: 1073,
      maxChannel: 255
    });

    assert.equal(state.state, 'mismatched');
    assert.equal(state.width, 1280);
    assert.equal(state.height, 1073);
  });
});

describe('capturedAtSpreadMs', () => {
  it('is the gap between the earliest and latest stamp', () => {
    assert.equal(capturedAtSpreadMs(['2026-10-01T16:18:26.096Z', '2026-10-01T16:18:26.166Z']), 70);
  });

  it('is zero for a single stamp', () => {
    assert.equal(capturedAtSpreadMs(['2026-10-01T16:18:26.096Z']), 0);
  });
});

describe('isTruncated', () => {
  it('is true for an element that never closed', () => {
    assert.equal(isTruncated('Unexpected end of file before a closing "div" tag'), true);
  });

  it('is true for a stray brace inside JSX', () => {
    assert.equal(isTruncated('The character "}" is not valid inside a JSX element'), true);
  });

  it('is false for a clean render', () => {
    assert.equal(isTruncated(null), false);
  });
});

// --- The corpus, against the taxonomy's named runs -------------------------------------------

const RUNS = 'runs';
const hasCorpus = existsSync(`${RUNS}/2026-10-01-a1-kampus-subchapter-feed`);
const corpus = { skip: hasCorpus ? false : 'runs/2026-10-01-* not present' };

describe('census over the nineteen runs', corpus, () => {
  /** @type {import('./census.mjs').Census} */
  let census;

  it('builds all nineteen with no unknown provenance', async () => {
    census = await buildCensus(RUNS);

    assert.equal(census.summary.runs, 19);
    assert.equal(census.runs.length, 19);

    for (const run of census.runs)
      assert.ok(
        ['figma-bytes', 'reconstructed', 'summarised', 'agent-prose', 'hand-backfilled'].includes(
          run.provenance
        ),
        `${run.run} has provenance ${run.provenance}`
      );
  });

  const find = /** @param {string} slug */ slug => census.runs.find(run => run.run === slug);

  it('nine of nineteen render', () => {
    assert.equal(census.summary.renders, 9);
  });

  it('names the four agent-prose runs', () => {
    for (const slug of [
      'a1-kampus-subchapter-feed',
      'a11-sesame-learning-materials',
      'a9-sanna-login',
      'b-itsl-bookmk-course-files'
    ])
      assert.equal(find(slug)?.provenance, 'agent-prose', slug);

    assert.equal(census.summary.byProvenance['agent-prose'], 4);
  });

  it('names the three hand-backfilled runs', () => {
    for (const slug of ['a8-nsp-group-list', 'b-itsl-course-course-files', 'b-kampus-notes-panel'])
      assert.equal(find(slug)?.provenance, 'hand-backfilled', slug);

    assert.equal(census.summary.byProvenance['hand-backfilled'], 3);
  });

  it('refuses the channel-halved a3 reference', () => {
    const a3 = find('a3-myportal-digital-exercises');

    assert.equal(a3?.reference.state, 'channel-halved');
    assert.equal(a3?.reference.refused, true);
    assert.deepEqual(census.summary.refused, ['a3-myportal-digital-exercises']);
  });

  it('scores no run against a fabricated frame', () => {
    assert.equal(census.summary.frameUndeclared, 0);

    for (const run of census.runs) assert.equal(run.frameDeclared, true, run.run);
  });

  it('records truncation on b-nsp-home and a6, which do not render', () => {
    for (const slug of ['b-nsp-home', 'a6-itsl-collab-shared-folder']) {
      const run = find(slug);

      assert.equal(run?.renders, false, slug);
      assert.equal(run?.truncated, true, slug);
    }
  });

  it('records the emoji-property render error on a5', () => {
    const a5 = find('a5-etsl-metadata-usage-widget');

    assert.equal(a5?.renders, false);
    assert.match(a5?.renderError ?? '', /↕/);
  });

  it('confesses the capturedAt is normalisation time', () => {
    assert.ok(census.summary.capturedAtSpreadMs < 1000);
    assert.equal(census.summary.capturedAtIsNormalisationTime, true);
  });

  it('is deterministic — same inputs, identical bytes', async () => {
    const again = await buildCensus(RUNS);

    assert.equal(serialise(census), serialise(again));
  });
});
