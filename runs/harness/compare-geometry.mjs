/**
 * The first fidelity measurement in the effort, and it needs **no raster**: Figma's declared
 * geometry (the `figma-metadata.txt` boxes) against what actually rendered in the browser
 * (`getBoundingClientRect`), joined on node id, reporting per-node deltas.
 *
 * Why this is the _independent_ statement of position. The design context the build is generated
 * from carries the same `data-node-id`s, so comparing the build against it is close to a tautology.
 * The metadata is a separate declaration of where each node sits, authored by Figma, so a delta
 * between it and the rendered box is a real disagreement rather than an echo.
 *
 * **The placed-wrapper subtlety — the whole reason the number means anything.** `buildBody` in
 * `render-design.mjs` wraps each region in `<div data-region="…" data-node-id="…"
 * style="position:absolute;left:<box.x>px;…">` — that wrapper is positioned _straight from the
 * metadata_. Measuring it and comparing to the metadata would always match: the comparison would
 * score the harness's own arithmetic, not the layout. So every element that also carries a
 * `data-region` attribute is excluded from the comparison and its count reported separately as
 * `placedWrappers`, so the reader knows those elements existed and were deliberately not counted.
 * Only elements that came from the design-context markup itself — the inner ones, laid out by the
 * browser's CSS — are an independent measurement.
 *
 * Coordinates are compared **frame-relative**. The rendered page's origin is the root frame's
 * top-left (`buildDocument` sizes `body` to the frame and `placeRegion` subtracts the frame
 * origin), while the metadata boxes are absolute on the Figma canvas — so every declared box has
 * the frame's absolute `x/y` subtracted before the join.
 *
 * This task **measures, it does not judge**: it reports counts and deltas, no verdict and no score
 * threshold. It also refuses rather than inventing: an undeclared frame is a refusal, never scored
 * against `FABRICATED_FRAME`.
 *
 * Usage: node runs/harness/compare-geometry.mjs --run runs/2026-10-01-<slug> [--html <path>] [--out
 * <file.json>]
 *
 * `--html` defaults to `<run>/design-reconstruction.html` and the metadata to
 * `<run>/figma-metadata.txt`. The output carries no timestamp, so running it twice on the same
 * inputs produces identical bytes.
 *
 * Every step is an exported pure function with a unit test; the browser steps are tested against a
 * fixture with deliberately injected offsets. The CLI at the foot is a shell over them.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv, exit } from 'node:process';
import { chromium } from 'playwright';
import { z } from 'zod';

import { parseBoxes, resolveFrame } from './render-design.mjs';

/** Raised when the comparator refuses to measure. The CLI turns it into a non-zero exit. */
export class GeometryRefusal extends Error {}

/** @typedef {{ x: number; y: number; width: number; height: number }} Rect */

/**
 * @typedef {{
 *   frame: { id?: string; x?: number; y?: number; width: number; height: number };
 *   declared: boolean;
 *   boxes: Map<string, Rect>;
 * }} DeclaredBoxes
 */

/**
 * Resolve the metadata into frame-relative boxes keyed by node id, plus the frame it was resolved
 * against and whether that frame was declared.
 *
 * The root frame itself is dropped from the box map: it is the origin of the comparison, not a node
 * to compare. Every remaining box has the frame's absolute `x/y` subtracted, because the rendered
 * page's origin is the frame's top-left.
 *
 * @param {string} metadataText
 * @returns {DeclaredBoxes}
 */
export const declaredBoxes = metadataText => {
  const boxes = parseBoxes(metadataText),
    resolution = resolveFrame(metadataText, boxes),
    origin = { x: resolution.frame.x ?? 0, y: resolution.frame.y ?? 0 },
    /** @type {Map<string, Rect>} */ relative = new Map();

  for (const [id, box] of boxes) {
    if (id === resolution.frame.id) continue;

    relative.set(id, {
      x: box.x - origin.x,
      y: box.y - origin.y,
      width: box.width,
      height: box.height
    });
  }

  return { frame: resolution.frame, declared: resolution.declared, boxes: relative };
};

/**
 * @typedef {{
 *   id: string;
 *   declared: Rect;
 *   rendered: Rect;
 *   delta: { dx: number; dy: number; dwidth: number; dheight: number };
 *   distance: number;
 * }} Delta
 */

/** @typedef {{ compared: Delta[]; declaredOnly: string[]; renderedOnly: string[] }} Join */

/** @param {number} value */
const round2 = value => Math.round(value * 100) / 100;

/**
 * Join declared and rendered boxes on node id. A node present in both becomes a {@link Delta}
 * (rendered minus declared); a node present on only one side is **counted on that side rather than
 * dropped**, because a node the metadata declares and the build never rendered is itself the
 * finding.
 *
 * @param {Map<string, Rect>} declared
 * @param {Map<string, Rect>} rendered
 * @returns {Join}
 */
export const joinGeometry = (declared, rendered) => {
  /** @type {Delta[]} */ const compared = [],
    /** @type {string[]} */ declaredOnly = [],
    /** @type {string[]} */ renderedOnly = [];

  for (const [id, box] of declared) {
    const measured = rendered.get(id);

    if (!measured) {
      declaredOnly.push(id);
      continue;
    }

    const dx = round2(measured.x - box.x),
      dy = round2(measured.y - box.y),
      dwidth = round2(measured.width - box.width),
      dheight = round2(measured.height - box.height);

    compared.push({
      id,
      declared: box,
      rendered: measured,
      delta: { dx, dy, dwidth, dheight },
      distance: round2(Math.hypot(dx, dy))
    });
  }

  for (const id of rendered.keys()) if (!declared.has(id)) renderedOnly.push(id);

  return {
    compared: compared.sort((a, b) => a.id.localeCompare(b.id)),
    declaredOnly: declaredOnly.sort(),
    renderedOnly: renderedOnly.sort()
  };
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
 * }} Summary
 */

/**
 * Counts only — no verdict, no score threshold. `within1px`/`within4px` are the number of compared
 * nodes whose centre moved at most that far, the two bands a reader actually asks about.
 *
 * @param {Join} join
 * @returns {Summary}
 */
export const summarise = join => {
  const distances = join.compared.map(delta => delta.distance),
    total = distances.reduce((sum, value) => sum + value, 0);

  return {
    compared: join.compared.length,
    declaredOnly: join.declaredOnly.length,
    renderedOnly: join.renderedOnly.length,
    maxDistance: distances.length ? round2(Math.max(...distances)) : 0,
    meanDistance: distances.length ? round2(total / distances.length) : 0,
    within1px: distances.filter(value => value <= 1).length,
    within4px: distances.filter(value => value <= 4).length
  };
};

const RectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number()
});

export const GeometryReport = z.object({
  generatedBy: z.literal('runs/harness/compare-geometry.mjs'),
  frame: z.object({
    id: z.string().optional(),
    width: z.number(),
    height: z.number()
  }),
  frameDeclared: z.boolean(),
  placedWrappers: z.number(),
  duplicateIds: z.array(z.string()),
  compared: z.array(
    z.object({
      id: z.string(),
      declared: RectSchema,
      rendered: RectSchema,
      delta: z.object({
        dx: z.number(),
        dy: z.number(),
        dwidth: z.number(),
        dheight: z.number()
      }),
      distance: z.number()
    })
  ),
  declaredOnly: z.array(z.string()),
  renderedOnly: z.array(z.string()),
  summary: z.object({
    compared: z.number(),
    declaredOnly: z.number(),
    renderedOnly: z.number(),
    maxDistance: z.number(),
    meanDistance: z.number(),
    within1px: z.number(),
    within4px: z.number()
  })
});

/** @typedef {z.infer<typeof GeometryReport>} Report */

/**
 * Measure every `[data-node-id]` element in the page, keyed by its (non-empty) id. Elements that
 * also carry `data-region` are placed wrappers — positioned from the metadata, a tautology to
 * compare — so they are excluded from the measurement and only counted, as `placedWrappers`. Rects
 * are made document-relative by adding the scroll offset, so they do not drift with the viewport.
 * An id that appears on more than one element is ambiguous — the first occurrence is measured and
 * the id is listed in `duplicateIds`, so the collision is counted rather than resolved by whichever
 * element happened to come last.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<{
 *   rendered: Map<string, Rect>;
 *   placedWrappers: number;
 *   duplicateIds: string[];
 * }>}
 */
export const measureRendered = async page => {
  const measured = await page.evaluate(() => {
    // Runs in the browser, where `document`/`window` exist; tsc checks this file against the node
    // lib, which has neither, so the DOM is reached through a cast rather than pulling in `dom`.
    /** @type {any} */ const dom = globalThis;
    /** @type {{ id: string; x: number; y: number; width: number; height: number }[]} */
    const rects = [];
    let placedWrappers = 0;

    for (const element of dom.document.querySelectorAll('[data-node-id]')) {
      const id = element.getAttribute('data-node-id');

      if (!id) continue;

      if (element.hasAttribute('data-region')) {
        placedWrappers += 1;
        continue;
      }

      const box = element.getBoundingClientRect();

      rects.push({
        id,
        x: box.x + dom.scrollX,
        y: box.y + dom.scrollY,
        width: box.width,
        height: box.height
      });
    }

    return { rects, placedWrappers };
  });

  /** @type {Map<string, Rect>} */
  const rendered = new Map(),
    /** @type {Set<string>} */ duplicateIds = new Set();

  for (const { id, x, y, width, height } of measured.rects) {
    if (rendered.has(id)) {
      duplicateIds.add(id);
      continue;
    }

    rendered.set(id, {
      x: round2(x),
      y: round2(y),
      width: round2(width),
      height: round2(height)
    });
  }

  return {
    rendered,
    placedWrappers: measured.placedWrappers,
    duplicateIds: [...duplicateIds].sort()
  };
};

/**
 * The full comparison: resolve the declared boxes, render the markup in Chromium, measure, join and
 * summarise. Refuses — rather than inventing a frame — when the metadata declares none.
 *
 * @param {{
 *   html?: string;
 *   url?: string;
 *   metadataText: string;
 *   viewport?: { width: number; height: number };
 * }} input
 * @returns {Promise<Report>}
 */
export const compareDocument = async ({ html, url, metadataText, viewport }) => {
  const declared = declaredBoxes(metadataText);

  if (!declared.declared) {
    throw new GeometryRefusal(
      'frame-undeclared: metadata declares no root frame; refusing to measure'
    );
  }

  if (!html && !url) throw new GeometryRefusal('no-document: neither html nor url was given');

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: viewport ?? { width: declared.frame.width, height: declared.frame.height },
      deviceScaleFactor: 1
    });

    if (html) await page.setContent(html, { waitUntil: 'load' });
    else await page.goto(/** @type {string} */ (url), { waitUntil: 'load' });

    const { rendered, placedWrappers, duplicateIds } = await measureRendered(page),
      join = joinGeometry(declared.boxes, rendered);

    return {
      generatedBy: 'runs/harness/compare-geometry.mjs',
      frame: {
        ...(declared.frame.id ? { id: declared.frame.id } : {}),
        width: declared.frame.width,
        height: declared.frame.height
      },
      frameDeclared: declared.declared,
      placedWrappers,
      duplicateIds,
      compared: join.compared,
      declaredOnly: join.declaredOnly,
      renderedOnly: join.renderedOnly,
      summary: summarise(join)
    };
  } finally {
    await browser.close();
  }
};

/** @param {Report} report */
export const serialise = report => `${JSON.stringify(report, null, 2)}\n`;

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? undefined : argv[i + 1];
};

if (import.meta.main) {
  const run = arg('run'),
    out = arg('out');

  if (!run) {
    console.error(
      'usage: compare-geometry.mjs --run runs/2026-10-01-<slug> [--html <path>] [--out <file.json>]'
    );
    exit(2);
  }

  const htmlPath = arg('html') ?? join(/** @type {string} */ (run), 'design-reconstruction.html'),
    metadataPath = join(/** @type {string} */ (run), 'figma-metadata.txt');

  try {
    if (!existsSync(metadataPath)) {
      throw new GeometryRefusal(`metadata-missing: ${metadataPath}`);
    }

    if (!existsSync(htmlPath)) throw new GeometryRefusal(`html-missing: ${htmlPath}`);

    const report = await compareDocument({
      html: readFileSync(htmlPath, 'utf8'),
      metadataText: readFileSync(metadataPath, 'utf8')
    });

    const text = serialise(report);

    if (out) {
      writeFileSync(out, text);
      console.error(
        `${out}: compared ${report.summary.compared}, declaredOnly ${report.summary.declaredOnly}, ` +
          `renderedOnly ${report.summary.renderedOnly}, maxDistance ${report.summary.maxDistance}`
      );
    } else console.log(text);
  } catch (error) {
    if (error instanceof GeometryRefusal) {
      console.error(/** @type {Error} */ (error).message);
      exit(1);
    }

    throw error;
  }
}
