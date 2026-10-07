/**
 * Establishes what the nineteen `runs/2026-10-01-*` folders actually are, one entry per run.
 *
 * Two plans were approved assuming nineteen usable runs. Nine render. This census is the record of
 * the gap: for each run it states a **provenance class** (whose bytes the design context is),
 * whether it **renders** after the task-01 advisory repair, and the **reference** screenshot's
 * integrity — refusing a channel-halved reference rather than scoring against it.
 *
 * It does not re-derive the render-failure classification. It **starts from**
 * `context/analyzes/NOJIRA-figma-to-code/render-failure-taxonomy.md`, whose named runs are the
 * oracle the tests pin the detectors against, and it reuses `render-design.mjs` for the render
 * probe and the frame resolution rather than reimplementing either.
 *
 * The five provenance classes, and how each is decided — from the committed `captures/` source, so
 * the class describes the artifact, not the repaired copy:
 *
 * - `hand-backfilled` — `captures/` holds real design-context regions that re-normalisation
 *   (`captures-v2`) does not reproduce, because a backfill agent wrote them by hand. Detected as
 *   `captures/` regions present while `captures-v2` has none. (`a8`, `b-itsl-course-course-files`,
 *   `b-kampus-notes-panel`.)
 * - `agent-prose` — the source carries a prose marker where code should be: a `{ ... }` ellipsis, an
 *   `<!-- … -->` placeholder, "See conversation transcript", "truncated here for brevity", or a
 *   `{lorem-ipsum …}`. (`a1`, `a11`, `a9`, `b-itsl-bookmk-course-files`.)
 * - `summarised` — the design context is tiny both in absolute terms (< {@link SUMMARY_BYTES} B) and
 *   relative to the metadata (< {@link SUMMARY_RATIO} of it): a summary, not the bytes.
 * - `figma-bytes` — real `get_design_context` output, carrying `data-node-id` on its elements.
 * - `reconstructed` — JSX-like markup with no `data-node-id`, i.e. rebuilt rather than captured.
 *
 * A run whose class cannot be determined is **refused by name**, never defaulted to `unknown`.
 *
 * The reference is read from `reference-normalised.png` when present, else `screenshot.png`, for
 * its dimensions; the channel-halving check always reads the raw `screenshot.png`, because a
 * normalised copy derived from a halved capture masks the defect it cannot losslessly invert.
 *
 * Usage: node runs/harness/census.mjs --runs runs --out runs/census.json node
 * runs/harness/census.mjs --run runs/2026-10-01-<slug> # one run, to stdout, for debugging node
 * runs/harness/census.mjs --runs runs --index captures-v2 --out runs/census.json
 *
 * `--index` is the index the render probe measures against; it defaults to `captures-v2`, the
 * repaired re-normalisation task 01 produced and the taxonomy measured its nine against.
 *
 * Every step is an exported pure function with a unit test. The CLI at the foot is a shell over
 * them.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { argv, exit } from 'node:process';
import { PNG } from 'pngjs';
import { z } from 'zod';

import { probe, readGeometry, readRegions } from './render-design.mjs';

/** The index the render probe measures against — the repaired re-normalisation, not the original. */
export const DEFAULT_INDEX = 'captures-v2';

/** A design context smaller than this, in bytes, is a summary rather than the bytes themselves. */
export const SUMMARY_BYTES = 10240;

/** …and it must also be this small a fraction of the metadata, so a terse-but-real capture is not. */
export const SUMMARY_RATIO = 0.25;

/** A reference whose brightest channel is this or darker has been halved — lossy, not invertible. */
export const HALF_CHANNEL = 128;

/**
 * How many pixels a dimension may differ from the frame and still count as exact — rounding,
 * nothing more.
 */
export const EXACT_PIXEL_TOLERANCE = 1;

/** How far the two axis ratios of a downscale may differ and still count as uniform. */
export const UNIFORM_TOLERANCE = 0.01;

/** Raised when a run cannot be classified. The CLI turns it into a non-zero exit naming the run. */
export class CensusRefusal extends Error {}

/** @param {number} value */
const round3 = value => Math.round(value * 1000) / 1000;

/**
 * The prose markers that mean "a human summarised the response and stored the summary as code".
 * Each carries a label so the evidence names _why_ a run is prose, not merely that it is.
 */
export const PROSE_MARKERS = [
  { label: 'ellipsis-param', re: /\{\s*\.\.\.\s*\}/ },
  { label: 'html-placeholder', re: /<!--/ },
  { label: 'transcript-pointer', re: /See conversation transcript/i },
  { label: 'brevity-truncation', re: /truncated here for brevity/i },
  { label: 'lorem-ipsum', re: /lorem-ipsum/i }
];

/**
 * The first prose marker in a source, with the fragment that matched, or `null` when there is none.
 *
 * @param {string} source
 * @returns {{ label: string; match: string } | null}
 */
export const detectProseMarker = source => {
  for (const { label, re } of PROSE_MARKERS) {
    const found = source.match(re);

    if (found) return { label, match: found[0].slice(0, 120) };
  }

  return null;
};

/**
 * Classify one run's provenance from what it holds, never defaulting. The order is deliberate:
 * hand-backfill is a property of the _pair_ of indexes and is tested first; prose beats a size test
 * because a prose stub can be any size; `data-node-id` is the real-output marker and is tested last
 * before the refusal, so only a run with neither marker nor size signal is refused.
 *
 * @param {{
 *   captureRegions: number;
 *   normalisedRegions: number;
 *   source: string;
 *   designContextBytes: number;
 *   metadataBytes: number;
 * }} input
 * @returns {{ provenance: string; provenanceEvidence: string }}
 */
export const classifyProvenance = ({
  captureRegions,
  normalisedRegions,
  source,
  designContextBytes,
  metadataBytes
}) => {
  if (captureRegions === 0)
    throw new CensusRefusal('no design-context captures to classify provenance from');

  if (normalisedRegions === 0)
    return {
      provenance: 'hand-backfilled',
      provenanceEvidence: `${captureRegions} committed design-context region(s) that re-normalisation (${DEFAULT_INDEX}) does not reproduce — written by a backfill agent`
    };

  const prose = detectProseMarker(source);

  if (prose)
    return { provenance: 'agent-prose', provenanceEvidence: `${prose.label}: "${prose.match}"` };

  if (designContextBytes < SUMMARY_BYTES && designContextBytes < metadataBytes * SUMMARY_RATIO)
    return {
      provenance: 'summarised',
      provenanceEvidence: `design-context ${designContextBytes} B is ${round3(designContextBytes / Math.max(metadataBytes, 1))} of metadata ${metadataBytes} B — a summary, not the bytes`
    };

  if (/data-node-id/.test(source))
    return {
      provenance: 'figma-bytes',
      provenanceEvidence: 'data-node-id on elements — real get_design_context output'
    };

  if (/className=/.test(source))
    return {
      provenance: 'reconstructed',
      provenanceEvidence: 'JSX markup without data-node-id — rebuilt rather than captured'
    };

  throw new CensusRefusal(
    'source carries no provenance marker — neither prose, nor data-node-id, nor className'
  );
};

/**
 * The brightest R/G/B channel over a decoded PNG. Alpha is skipped: a fully transparent image is
 * not a dark one.
 *
 * @param {{ data: Buffer | Uint8Array }} png
 */
export const channelMax = png => {
  let max = 0;

  for (let i = 0; i < png.data.length; i += 4)
    for (let k = 0; k < 3; k++) if (png.data[i + k] > max) max = png.data[i + k];

  return max;
};

/**
 * @typedef {{
 *   state:
 *     | 'exact'
 *     | 'downscaled'
 *     | 'channel-halved'
 *     | 'undeclared-frame'
 *     | 'missing'
 *     | 'mismatched';
 *   file: string | null;
 *   width: number | null;
 *   height: number | null;
 *   maxChannel?: number;
 *   factor?: number;
 *   uniform?: boolean;
 *   refused?: boolean;
 *   reason?: string;
 * }} ReferenceState
 */

/**
 * The reference's state against the declared frame. Channel-halving is checked first and refuses
 * regardless of dimensions, because the loss is in the pixels, not the geometry. Then: equal within
 * one pixel on both axes is exact, strictly smaller on both axes is downscaled with its factor,
 * anything else — one axis equal and the other trimmed, or a stretch — is a declared mismatch
 * carrying both sizes. The exact tolerance is deliberately pixels, not a ratio: a percentage would
 * silently absorb a reference cropped by a few rows, which is exactly the kind of thing the census
 * exists to name.
 *
 * @param {{
 *   frame: { width: number; height: number };
 *   file: string;
 *   width: number;
 *   height: number;
 *   maxChannel: number;
 * }} input
 * @returns {ReferenceState}
 */
export const referenceState = ({ frame, file, width, height, maxChannel }) => {
  if (maxChannel <= HALF_CHANNEL)
    return {
      state: 'channel-halved',
      file,
      width,
      height,
      maxChannel,
      refused: true,
      reason: `brightest channel ${maxChannel} ≤ ${HALF_CHANNEL}: the reference is channel-halved, which is lossy and not invertible — refused`
    };

  const wr = width / frame.width,
    hr = height / frame.height,
    exactW = Math.abs(width - frame.width) <= EXACT_PIXEL_TOLERANCE,
    exactH = Math.abs(height - frame.height) <= EXACT_PIXEL_TOLERANCE;

  if (exactW && exactH) return { state: 'exact', file, width, height, maxChannel };

  if (!exactW && !exactH && wr < 1 && hr < 1)
    return {
      state: 'downscaled',
      file,
      width,
      height,
      factor: round3(wr),
      uniform: Math.abs(wr - hr) <= UNIFORM_TOLERANCE,
      maxChannel
    };

  return { state: 'mismatched', file, width, height, maxChannel };
};

/** The largest gap, in milliseconds, between the earliest and latest of a set of ISO timestamps. */
/** @param {string[]} timestamps */
export const capturedAtSpreadMs = timestamps => {
  const ms = timestamps.map(value => Date.parse(value)).filter(value => !Number.isNaN(value));

  if (ms.length === 0) return 0;

  return Math.max(...ms) - Math.min(...ms);
};

/**
 * The normalisation pass's own stamp for a run, read from its original `captures/index.json`. It is
 * taken from the captures the script always writes — metadata, variables, code-connect — and never
 * from a `get_design_context` entry, because those are exactly the ones a backfill agent may have
 * stamped by hand (a midnight placeholder, or a later re-run). What is left is the one pass that
 * stamped all nineteen within 64 ms, which is the confession the census carries.
 *
 * @param {string} run
 * @returns {string | null}
 */
export const capturedAtOf = run => {
  const indexPath = join(run, 'captures', 'index.json');

  if (!existsSync(indexPath)) return null;

  const captures = JSON.parse(readFileSync(indexPath, 'utf8')).captures ?? [],
    times = captures
      .filter(/** @param {{ call?: string }} c */ c => c.call !== 'get_design_context')
      .map(/** @param {{ capturedAt?: string }} c */ c => c.capturedAt)
      .filter(Boolean);

  return times.length ? times.sort()[0] : null;
};

const ReferenceSchema = z.object({
  state: z.enum([
    'exact',
    'downscaled',
    'channel-halved',
    'undeclared-frame',
    'missing',
    'mismatched'
  ]),
  file: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  maxChannel: z.number().optional(),
  factor: z.number().optional(),
  uniform: z.boolean().optional(),
  refused: z.boolean().optional(),
  reason: z.string().optional()
});

export const RunSchema = z.object({
  run: z.string(),
  provenance: z.enum([
    'figma-bytes',
    'reconstructed',
    'summarised',
    'agent-prose',
    'hand-backfilled'
  ]),
  provenanceEvidence: z.string(),
  renders: z.boolean(),
  regionsTotal: z.number(),
  regionsRendered: z.number(),
  renderError: z.string().nullable(),
  truncated: z.boolean(),
  frameDeclared: z.boolean(),
  frame: z.object({ width: z.number(), height: z.number() }),
  reference: ReferenceSchema,
  capturedAt: z.string().nullable()
});

export const CensusSchema = z.object({
  summary: z.object({
    generatedBy: z.literal('runs/harness/census.mjs'),
    censusVersion: z.literal(1),
    index: z.string(),
    runs: z.number(),
    renders: z.number(),
    byProvenance: z.record(z.string(), z.number()),
    byReference: z.record(z.string(), z.number()),
    refused: z.array(z.string()),
    frameDeclared: z.number(),
    frameUndeclared: z.number(),
    capturedAtSpreadMs: z.number(),
    capturedAtIsNormalisationTime: z.boolean()
  }),
  runs: z.array(RunSchema)
});

/** @typedef {z.infer<typeof CensusSchema>} Census */

/**
 * Read a reference PNG's state. The dimensions come from `reference-normalised.png` when it exists,
 * the channel check always from the raw `screenshot.png`, and an undeclared frame or an absent
 * screenshot is a recorded state rather than a guess.
 *
 * @param {string} run
 * @param {{ frame: { width: number; height: number }; frameDeclared: boolean }} geometry
 * @returns {ReferenceState}
 */
export const readReference = (run, { frame, frameDeclared }) => {
  const dimensionFile = ['reference-normalised.png', 'screenshot.png'].find(name =>
      existsSync(join(run, name))
    ),
    screenshot = join(run, 'screenshot.png');

  if (!dimensionFile) return { state: 'missing', file: null, width: null, height: null };

  const chosen = PNG.sync.read(readFileSync(join(run, dimensionFile))),
    rawMax = existsSync(screenshot)
      ? channelMax(PNG.sync.read(readFileSync(screenshot)))
      : channelMax(chosen);

  if (rawMax <= HALF_CHANNEL)
    return referenceState({
      frame,
      file: existsSync(screenshot) ? 'screenshot.png' : dimensionFile,
      width: chosen.width,
      height: chosen.height,
      maxChannel: rawMax
    });

  if (!frameDeclared)
    return {
      state: 'undeclared-frame',
      file: dimensionFile,
      width: chosen.width,
      height: chosen.height,
      maxChannel: rawMax
    };

  return referenceState({
    frame,
    file: dimensionFile,
    width: chosen.width,
    height: chosen.height,
    maxChannel: rawMax
  });
};

/**
 * Run the render probe and reduce it to the three facts the census carries. A probe that throws is
 * a run that does not render — its message is the render error — not an error to propagate.
 *
 * @param {string} run
 * @param {string} indexDir
 * @param {typeof probe} [probeImpl]
 * @returns {Promise<{
 *   renders: boolean;
 *   regionsTotal: number;
 *   regionsRendered: number;
 *   renderError: string | null;
 * }>}
 */
export const renderOutcome = async (run, indexDir, probeImpl = probe) => {
  try {
    const { report } = await probeImpl({
        run,
        indexDir,
        out: join(tmpdir(), 'census-render.html')
      }),
      rendered = report.regions.filter(region => !region.error),
      failed = report.regions.find(region => region.error);

    return {
      renders: report.regions.length > 0 && rendered.length === report.regions.length,
      regionsTotal: report.regions.length,
      regionsRendered: rendered.length,
      renderError: failed?.error ?? null
    };
  } catch (error) {
    return {
      renders: false,
      regionsTotal: 0,
      regionsRendered: 0,
      renderError: /** @type {Error} */ (error).message
    };
  }
};

/** A render failed by an element that opened and never closed — truncation, not a provenance class. */
/** @param {string | null} renderError */
export const isTruncated = renderError =>
  !!renderError &&
  /Unexpected end of file|is not valid inside a JSX|before a closing|Unterminated/i.test(
    renderError
  );

/**
 * Build one run's entry: provenance from the committed captures, render from the probe, reference
 * from the screenshot, frame from the geometry reader.
 *
 * @param {string} run
 * @param {{ indexDir?: string; probeImpl?: typeof probe }} [options]
 * @returns {Promise<z.infer<typeof RunSchema>>}
 */
export const buildRunEntry = async (run, { indexDir = DEFAULT_INDEX, probeImpl = probe } = {}) => {
  const slug = run.replace(/.*\//, '').replace(/^2026-10-01-/, ''),
    captureRegions = safeRegions(run, 'captures'),
    normalisedRegions = safeRegions(run, indexDir),
    source = captureRegions.map(region => region.source).join('\n'),
    metadataPath = join(run, 'figma-metadata.txt'),
    metadataBytes = existsSync(metadataPath) ? statSync(metadataPath).size : 0;

  let provenance, provenanceEvidence;

  try {
    ({ provenance, provenanceEvidence } = classifyProvenance({
      captureRegions: captureRegions.length,
      normalisedRegions: normalisedRegions.length,
      source,
      designContextBytes: Buffer.byteLength(source, 'utf8'),
      metadataBytes
    }));
  } catch (error) {
    throw new CensusRefusal(`${slug}: ${/** @type {Error} */ (error).message}`);
  }

  const geometry = readGeometry(run),
    frameDeclared = geometry.declared,
    frame = { width: geometry.frame.width, height: geometry.frame.height },
    render = await renderOutcome(run, indexDir, probeImpl),
    reference = readReference(run, { frame, frameDeclared });

  return {
    run: slug,
    provenance: /** @type {z.infer<typeof RunSchema>['provenance']} */ (provenance),
    provenanceEvidence,
    renders: render.renders,
    regionsTotal: render.regionsTotal,
    regionsRendered: render.regionsRendered,
    renderError: render.renderError,
    truncated: isTruncated(render.renderError),
    frameDeclared,
    frame,
    reference,
    capturedAt: capturedAtOf(run)
  };
};

/** @param {string} run @param {string} indexDir */
const safeRegions = (run, indexDir) => {
  try {
    return readRegions(run, indexDir);
  } catch {
    return [];
  }
};

/** @param {string[]} values */
const tally = values => {
  /** @type {Record<string, number>} */
  const counts = {};

  for (const value of values.sort()) counts[value] = (counts[value] ?? 0) + 1;

  return counts;
};

/**
 * The census over a directory of runs, sorted by slug with a summary that confesses what the
 * figures qualify. No generation timestamp lives inside it, so running it twice on the same inputs
 * produces identical bytes.
 *
 * @param {string} runsDir
 * @param {{ indexDir?: string; probeImpl?: typeof probe }} [options]
 * @returns {Promise<Census>}
 */
export const buildCensus = async (
  runsDir,
  { indexDir = DEFAULT_INDEX, probeImpl = probe } = {}
) => {
  const slugs = readdirSync(runsDir)
      .filter(entry => /^2026-10-01-/.test(entry))
      .sort(),
    /** @type {z.infer<typeof RunSchema>[]} */ runs = [];

  for (const slug of slugs)
    runs.push(await buildRunEntry(join(runsDir, slug), { indexDir, probeImpl }));

  const capturedAt = runs
      .map(run => run.capturedAt)
      .filter(/** @returns {value is string} */ value => !!value),
    spread = capturedAtSpreadMs(capturedAt);

  return {
    summary: {
      generatedBy: 'runs/harness/census.mjs',
      censusVersion: 1,
      index: indexDir,
      runs: runs.length,
      renders: runs.filter(run => run.renders).length,
      byProvenance: tally(runs.map(run => run.provenance)),
      byReference: tally(runs.map(run => run.reference.state)),
      refused: runs.filter(run => run.reference.refused).map(run => run.run),
      frameDeclared: runs.filter(run => run.frameDeclared).length,
      frameUndeclared: runs.filter(run => !run.frameDeclared).length,
      capturedAtSpreadMs: spread,
      capturedAtIsNormalisationTime: capturedAt.length > 1 && spread < 1000
    },
    runs
  };
};

/** @param {Census} census */
export const serialise = census => `${JSON.stringify(census, null, 2)}\n`;

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? undefined : argv[i + 1];
};

if (import.meta.main) {
  const single = arg('run'),
    runsDir = arg('runs'),
    indexDir = arg('index') ?? DEFAULT_INDEX,
    out = arg('out');

  if (!single && !runsDir) {
    console.error(
      'usage: census.mjs --runs runs --out runs/census.json [--index captures-v2]\n' +
        '       census.mjs --run runs/2026-10-01-<slug> [--index captures-v2]'
    );
    exit(2);
  }

  try {
    if (single) {
      const entry = await buildRunEntry(single, { indexDir });

      console.log(JSON.stringify(entry, null, 2));
    } else {
      const census = await buildCensus(/** @type {string} */ (runsDir), { indexDir }),
        text = serialise(census);

      if (out) {
        writeFileSync(out, text);
        console.error(
          `${out}: ${census.summary.runs} runs, ${census.summary.renders} render, refused [${census.summary.refused.join(', ')}]`
        );
      } else console.log(text);
    }
  } catch (error) {
    if (error instanceof CensusRefusal) {
      console.error(/** @type {Error} */ (error).message);
      exit(1);
    }

    throw error;
  }
}
