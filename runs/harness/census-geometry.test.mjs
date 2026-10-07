/**
 * The geometry census, tested the way the task demands: the admission rule against each of its
 * exclusion reasons and against a channel-halved reference that must still be admitted, the
 * partition sorted and complete over a hand-built census, the aggregate over hand-built summaries
 * including a zero-overlap run and a weighted mean computed by hand, a negative control where
 * nothing is admitted, and a schema round-trip. Expected values come from the rule and the
 * arithmetic, never from reading the script back. No browser is launched — `measureRun` is covered
 * by the CLI run, the comparator's own tests covering the Chromium path.
 *
 * Usage: node --test runs/harness/census-geometry.test.mjs
 */
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import {
  ADMISSION_RULE,
  CensusGeometry,
  admissions,
  admit,
  aggregate
} from './census-geometry.mjs';

/** A census run with the three admission facts, overridable per test. */
/** @param {Partial<import('./census-geometry.mjs').CensusRun>} [over] */
const run = (over = {}) => ({
  run: 'x',
  provenance: 'figma-bytes',
  renders: true,
  frameDeclared: true,
  reference: { state: 'exact' },
  ...over
});

describe('admit', () => {
  it('admits a figma-bytes run that renders with a declared frame', () => {
    assert.deepEqual(admit(run()), { admitted: true });
  });

  it('refuses prose provenance, naming the class', () => {
    const verdict = admit(run({ provenance: 'agent-prose' }));

    assert.equal(verdict.admitted, false);
    assert.match(verdict.reason, /agent-prose/);
  });

  it('refuses a hand-backfilled run, naming the class', () => {
    const verdict = admit(run({ provenance: 'hand-backfilled' }));

    assert.equal(verdict.admitted, false);
    assert.match(verdict.reason, /hand-backfilled/);
  });

  it('refuses a summarised run, naming the class', () => {
    const verdict = admit(run({ provenance: 'summarised' }));

    assert.equal(verdict.admitted, false);
    assert.match(verdict.reason, /summarised/);
  });

  it('refuses a run that does not render', () => {
    assert.deepEqual(admit(run({ renders: false })), {
      admitted: false,
      reason: 'no rendered boxes to measure'
    });
  });

  it('refuses a run whose frame is undeclared', () => {
    assert.deepEqual(admit(run({ frameDeclared: false })), {
      admitted: false,
      reason: 'frame undeclared; comparator refuses'
    });
  });

  it('admits a channel-halved reference — the comparator uses no raster', () => {
    assert.deepEqual(admit(run({ reference: { state: 'channel-halved' } })), { admitted: true });
  });
});

describe('admissions', () => {
  it('partitions and sorts by run name, complete over the census', () => {
    const census = {
      runs: [
        run({ run: 'c', provenance: 'figma-bytes' }),
        run({ run: 'a', provenance: 'agent-prose' }),
        run({ run: 'b', renders: false }),
        run({ run: 'd', provenance: 'figma-bytes' })
      ]
    };

    const { admitted, excluded } = admissions(census);

    assert.deepEqual(admitted, ['c', 'd']);
    assert.deepEqual(
      excluded.map(e => e.run),
      ['a', 'b']
    );
  });
});

describe('aggregate', () => {
  /** @param {string} name @param {Partial<import('./census-geometry.mjs').ComparatorSummary>} s */
  const summary = (name, s) => ({
    run: name,
    summary: {
      compared: 0,
      declaredOnly: 0,
      renderedOnly: 0,
      maxDistance: 0,
      meanDistance: 0,
      within1px: 0,
      within4px: 0,
      ...s
    }
  });

  it('weights the mean distance by compared and lists zero-overlap runs', () => {
    const perRun = [
      summary('p', {
        compared: 300,
        declaredOnly: 5,
        renderedOnly: 2,
        maxDistance: 10,
        meanDistance: 2,
        within1px: 100,
        within4px: 250
      }),
      summary('q', {
        compared: 100,
        declaredOnly: 1,
        renderedOnly: 0,
        maxDistance: 20,
        meanDistance: 6,
        within1px: 10,
        within4px: 40
      }),
      summary('z', { compared: 0, declaredOnly: 3 })
    ];

    const result = aggregate(perRun);

    assert.equal(result.n, 3);
    assert.equal(result.nWithOverlap, 2);
    assert.equal(result.totalCompared, 400);
    assert.equal(result.totalDeclaredOnly, 9);
    assert.equal(result.totalRenderedOnly, 2);
    assert.equal(result.maxDistance, 20);
    // (2*300 + 6*100) / 400 = 1200 / 400 = 3.
    assert.equal(result.meanDistanceWeighted, 3);
    assert.equal(result.within1px, 110);
    assert.equal(result.within4px, 290);
    assert.deepEqual(result.zeroOverlap, ['z']);
  });

  it('NEGATIVE CONTROL: nothing measured yields n 0 and zeroes rather than NaN', () => {
    const result = aggregate([]);

    assert.equal(result.n, 0);
    assert.equal(result.maxDistance, 0);
    assert.equal(result.meanDistanceWeighted, 0);
    assert.deepEqual(result.zeroOverlap, []);
  });
});

describe('CensusGeometry schema', () => {
  it('round-trips a report, including an empty runs array when nothing is admitted', () => {
    const report = {
      generatedBy: 'runs/harness/census-geometry.mjs',
      censusVersion: 1,
      index: 'captures-v2',
      comparatorVersion: 2,
      admissionRule: ADMISSION_RULE,
      admitted: [],
      excluded: [{ run: 'a1', reason: 'no rendered boxes to measure' }],
      runs: [],
      summary: aggregate([])
    };

    assert.doesNotThrow(() => CensusGeometry.parse(report));
  });

  it('round-trips a report with one measured run', () => {
    const report = {
      generatedBy: 'runs/harness/census-geometry.mjs',
      censusVersion: 1,
      index: 'captures-v2',
      comparatorVersion: 2,
      admissionRule: ADMISSION_RULE,
      admitted: ['a3'],
      excluded: [],
      runs: [
        {
          run: 'a3',
          provenance: 'figma-bytes',
          reference: { state: 'channel-halved' },
          frame: { id: '1:1', width: 1440, height: 1024 },
          summary: {
            compared: 330,
            declaredOnly: 10,
            renderedOnly: 2,
            maxDistance: 12.5,
            meanDistance: 3.2,
            within1px: 50,
            within4px: 200
          },
          placedWrappers: 40,
          duplicateIds: [],
          unplacedNodes: 0
        }
      ],
      summary: aggregate([
        {
          run: 'a3',
          summary: {
            compared: 330,
            declaredOnly: 10,
            renderedOnly: 2,
            maxDistance: 12.5,
            meanDistance: 3.2,
            within1px: 50,
            within4px: 200
          }
        }
      ])
    };

    const parsed = CensusGeometry.parse(report);

    assert.equal(parsed.runs[0].reference.state, 'channel-halved');
  });
});
