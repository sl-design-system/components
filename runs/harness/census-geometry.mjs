/**
 * Joins the two strands of the corpus census slice: the census says which runs are admissible, the
 * geometry comparator says what their layout does, and this file publishes the figures **with their
 * N and the comparator version** so no figure is read without the population behind it.
 *
 * **The admission rule — the rule every figure here is published under.** A run is admitted iff all
 * three hold:
 *
 * - `provenance === 'figma-bytes'` — prose, hand-backfilled and summarised captures are not Figma
 *   output, so a geometry delta against them measures the agent that wrote them, not the layout.
 *   Their provenance class is named in the exclusion reason rather than lumped together.
 * - `renders === true` — a run that does not render has no boxes to measure.
 * - `frameDeclared === true` — the comparator refuses to score against a frame nobody declared.
 *
 * **The reference-screenshot state does not gate admission.** The geometry comparator uses no
 * raster at all — it compares Figma's declared boxes against the browser's `getBoundingClientRect`
 * — so a `channel-halved`, `downscaled` or `mismatched` reference, which would refuse _raster_
 * work, is irrelevant here. `a3` is channel-halved and refused for raster fidelity; it IS admitted
 * for geometry, and its reference state is carried through into the per-run output rather than
 * hidden, so the reader sees exactly which runs would and would not survive a raster comparison.
 *
 * This file **measures, it does not judge**: `aggregate` reports counts, distances and bands, with
 * no verdict and no pass/fail threshold. It also carries no timestamp, so running it twice on the
 * same inputs produces byte-identical output.
 *
 * Usage: node runs/harness/census-geometry.mjs --census runs/census.json --runs runs --out
 * runs/census-geometry.json [--index captures-v2]
 *
 * `--index` defaults to the index the census measured against (`census.json` `summary.index`); a
 * `--index` that disagrees with it is a loud failure, never a silent re-measurement against a
 * different index. Each admitted run's full comparator report — the per-node deltas too — is
 * written to `runs/census-geometry/<run>.json`; the summary file keeps only the per-run summaries
 * so it stays readable.
 *
 * Every step is an exported pure function with a unit test; the browser step (`measureRun`) is
 * exercised by the CLI run, the comparator's own tests already covering the Chromium path. The CLI
 * at the foot is a shell over them.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { argv, exit } from 'node:process';
import { z } from 'zod';

import {
  COMPARATOR_VERSION,
  GeometryReport,
  compareDocument,
  serialise as serialiseReport
} from './compare-geometry.mjs';
import { probe } from './render-design.mjs';

/** Raised when the publication cannot be built. The CLI turns it into a non-zero exit naming why. */
export class CensusGeometryRefusal extends Error {}

/** The admission rule, one sentence, published alongside the figures it qualifies. */
export const ADMISSION_RULE =
  'A run is admitted iff its provenance is figma-bytes, it renders, and its frame is declared; the ' +
  'reference-screenshot state does not gate admission because the geometry comparator uses no raster.';

/** @param {number} value */
const round2 = value => Math.round(value * 100) / 100;

/**
 * @typedef {{
 *   run: string;
 *   provenance: string;
 *   renders: boolean;
 *   frameDeclared: boolean;
 *   reference: { state: string };
 * }} CensusRun
 */

/**
 * Admit one census run, or refuse it by a reason that names the class. The order mirrors the three
 * clauses of {@link ADMISSION_RULE}: provenance first (it names the class), then renders, then the
 * declared frame. The reference state is deliberately not consulted — it does not gate geometry.
 *
 * @param {CensusRun} censusRun
 * @returns {{ admitted: true } | { admitted: false; reason: string }}
 */
export const admit = censusRun => {
  if (censusRun.provenance !== 'figma-bytes') {
    return {
      admitted: false,
      reason: `provenance ${censusRun.provenance}: not Figma output, a geometry delta would measure the agent, not the layout`
    };
  }

  if (censusRun.renders === false)
    return { admitted: false, reason: 'no rendered boxes to measure' };

  if (censusRun.frameDeclared === false) {
    return { admitted: false, reason: 'frame undeclared; comparator refuses' };
  }

  return { admitted: true };
};

/**
 * Partition a census into the admitted run names and the excluded ones with their reasons, both
 * sorted by run name so the output is stable regardless of the census's own ordering.
 *
 * @param {{ runs: CensusRun[] }} census
 * @returns {{ admitted: string[]; excluded: { run: string; reason: string }[] }}
 */
export const admissions = census => {
  const sorted = [...census.runs].sort((a, b) => a.run.localeCompare(b.run)),
    /** @type {string[]} */ admitted = [],
    /** @type {{ run: string; reason: string }[]} */ excluded = [];

  for (const run of sorted) {
    const verdict = admit(run);

    if (verdict.admitted) admitted.push(run.run);
    else excluded.push({ run: run.run, reason: verdict.reason });
  }

  return { admitted, excluded };
};

/**
 * @typedef {{
 *   compared: number;
 *   declaredOnly: number;
 *   renderedOnly: number;
 *   maxDistance: number;
 *   meanDistance: number;
 *   within1px: number;
 *   within4px: number;
 * }} ComparatorSummary
 */

/**
 * The publication summary over the admitted runs' comparator summaries. `n` is how many runs were
 * measured; `meanDistanceWeighted` weights each run's mean distance by its `compared` count so a
 * run with two overlapping nodes does not swing the figure a run with three hundred earns. The mean
 * distance of a run with no overlap is undefined and excluded from the weighting; such runs are
 * named in `zeroOverlap` instead. No verdict, no threshold — this measures.
 *
 * @param {{ run: string; summary: ComparatorSummary }[]} perRun
 */
export const aggregate = perRun => {
  const totalCompared = perRun.reduce((sum, { summary }) => sum + summary.compared, 0),
    weightedDistance = perRun.reduce(
      (sum, { summary }) => sum + summary.meanDistance * summary.compared,
      0
    ),
    distances = perRun.map(({ summary }) => summary.maxDistance),
    zeroOverlap = perRun
      .filter(({ summary }) => summary.compared === 0)
      .map(({ run }) => run)
      .sort();

  return {
    n: perRun.length,
    nWithOverlap: perRun.filter(({ summary }) => summary.compared > 0).length,
    totalCompared,
    totalDeclaredOnly: perRun.reduce((sum, { summary }) => sum + summary.declaredOnly, 0),
    totalRenderedOnly: perRun.reduce((sum, { summary }) => sum + summary.renderedOnly, 0),
    maxDistance: distances.length ? round2(Math.max(...distances)) : 0,
    meanDistanceWeighted: totalCompared ? round2(weightedDistance / totalCompared) : 0,
    within1px: perRun.reduce((sum, { summary }) => sum + summary.within1px, 0),
    within4px: perRun.reduce((sum, { summary }) => sum + summary.within4px, 0),
    zeroOverlap
  };
};

const ReferenceStateSchema = z.object({ state: z.string() }).passthrough();

export const CensusGeometry = z.object({
  generatedBy: z.literal('runs/harness/census-geometry.mjs'),
  censusVersion: z.number(),
  index: z.string(),
  comparatorVersion: z.literal(2),
  admissionRule: z.string(),
  admitted: z.array(z.string()),
  excluded: z.array(z.object({ run: z.string(), reason: z.string() })),
  runs: z.array(
    z.object({
      run: z.string(),
      provenance: z.string(),
      reference: ReferenceStateSchema,
      frame: z.object({
        id: z.string().optional(),
        width: z.number(),
        height: z.number()
      }),
      summary: z.object({
        compared: z.number(),
        declaredOnly: z.number(),
        renderedOnly: z.number(),
        maxDistance: z.number(),
        meanDistance: z.number(),
        within1px: z.number(),
        within4px: z.number()
      }),
      placedWrappers: z.number(),
      duplicateIds: z.array(z.string()),
      unplacedNodes: z.number()
    })
  ),
  summary: z.object({
    n: z.number(),
    nWithOverlap: z.number(),
    totalCompared: z.number(),
    totalDeclaredOnly: z.number(),
    totalRenderedOnly: z.number(),
    maxDistance: z.number(),
    meanDistanceWeighted: z.number(),
    within1px: z.number(),
    within4px: z.number(),
    zeroOverlap: z.array(z.string())
  })
});

/** @typedef {z.infer<typeof CensusGeometry>} CensusGeometryReport */

/**
 * Measure one admitted run: render it through the probe without writing anything (`probe` returns
 * the document, the CLI is what persists), then compare that document against the run's declared
 * metadata. Returns the trimmed per-run record for the summary file alongside the full comparator
 * report, so the caller can publish the per-node deltas separately without bloating the summary.
 *
 * @param {{ runsDir: string; run: string; indexDir: string }} input
 * @returns {Promise<{
 *   record: {
 *     run: string;
 *     frame: z.infer<typeof GeometryReport>['frame'];
 *     summary: ComparatorSummary;
 *     placedWrappers: number;
 *     duplicateIds: string[];
 *     unplacedNodes: number;
 *   };
 *   report: z.infer<typeof GeometryReport>;
 * }>}
 */
export const measureRun = async ({ runsDir, run, indexDir }) => {
  const runDir = join(runsDir, `2026-10-01-${run}`),
    { document } = await probe({ run: runDir, indexDir }),
    metadataPath = join(runDir, 'figma-metadata.txt');

  if (!existsSync(metadataPath)) {
    throw new CensusGeometryRefusal(`metadata-missing: ${metadataPath}`);
  }

  const report = await compareDocument({
    html: document,
    metadataText: readFileSync(metadataPath, 'utf8')
  });

  return {
    record: {
      run,
      frame: report.frame,
      summary: report.summary,
      placedWrappers: report.placedWrappers,
      duplicateIds: report.duplicateIds,
      unplacedNodes: report.unplacedIds.length
    },
    report
  };
};

/** @param {CensusGeometryReport} report */
export const serialise = report => `${JSON.stringify(report, null, 2)}\n`;

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? undefined : argv[i + 1];
};

if (import.meta.main) {
  const censusPath = arg('census') ?? 'runs/census.json',
    runsDir = arg('runs') ?? 'runs',
    out = arg('out') ?? 'runs/census-geometry.json',
    requestedIndex = arg('index');

  try {
    if (!existsSync(censusPath)) {
      throw new CensusGeometryRefusal(`census-missing: ${censusPath}`);
    }

    const census = JSON.parse(readFileSync(censusPath, 'utf8')),
      index = census.summary.index;

    if (requestedIndex && requestedIndex !== index) {
      throw new CensusGeometryRefusal(
        `index-mismatch: --index ${requestedIndex} disagrees with the census's ${index}; ` +
          'the figures must be measured against the index the census measured against'
      );
    }

    const { admitted, excluded } = admissions(census),
      byRun = new Map(census.runs.map(/** @param {CensusRun} run */ run => [run.run, run])),
      reportDir = join(dirname(out), 'census-geometry'),
      /** @type {CensusGeometryReport['runs']} */ runs = [],
      /** @type {{ run: string; summary: ComparatorSummary }[]} */ measured = [];

    mkdirSync(reportDir, { recursive: true });

    for (const run of admitted) {
      const { record, report } = await measureRun({ runsDir, run, indexDir: index }),
        censusRun = byRun.get(run);

      writeFileSync(join(reportDir, `${run}.json`), serialiseReport(report));

      runs.push({
        run,
        provenance: censusRun.provenance,
        reference: { state: censusRun.reference.state },
        frame: record.frame,
        summary: record.summary,
        placedWrappers: record.placedWrappers,
        duplicateIds: record.duplicateIds,
        unplacedNodes: record.unplacedNodes
      });
      measured.push({ run, summary: record.summary });
    }

    const report = CensusGeometry.parse({
        generatedBy: 'runs/harness/census-geometry.mjs',
        censusVersion: census.summary.censusVersion,
        index,
        comparatorVersion: COMPARATOR_VERSION,
        admissionRule: ADMISSION_RULE,
        admitted,
        excluded,
        runs,
        summary: aggregate(measured)
      }),
      text = serialise(report);

    writeFileSync(out, text);
    console.error(
      `${out}: ${report.summary.n} admitted and measured, ${excluded.length} excluded, ` +
        `totalCompared ${report.summary.totalCompared}, maxDistance ${report.summary.maxDistance}`
    );
  } catch (error) {
    if (error instanceof CensusGeometryRefusal) {
      console.error(/** @type {Error} */ (error).message);
      exit(1);
    }

    throw error;
  }
}
