/**
 * Renders a design back from the metadata a run captured, as standalone HTML.
 *
 * This is a **completeness probe, not a fidelity target**. It asks one question nothing else in the
 * pipeline asks: is what we extracted from Figma enough to reconstruct the screen? If the answer is
 * yes the ingestion is sound; if it is no, the gap is visible rather than theoretical. It will
 * never match the reference pixel for pixel — text layout, font metrics and effects are not
 * reproducible this way — so it must never be scored against the PNG.
 *
 * Input is what the run already has:
 *
 * - `figma-design-context*.md` — fenced JSX with resolved values inline and `data-node-id` on every
 *   element. Figma did the hard part; this is a converter, not a renderer.
 * - `figma-metadata.txt` — the node tree with `x/y/width/height`, used to place regions, since
 *   `get_design_context` returns disjoint regions rather than one frame.
 *
 * Usage: node runs/harness/render-design.mjs --run runs/2026-10-01-<slug> [--out <file.html>]
 *
 *     [--index <dir>] [--allow-fabricated-frame]
 *
 * `--index` reads a re-normalised capture set — `captures-v2`, say — instead of `captures`, so a
 * repair can be counted against the original without replacing it.
 *
 * Every step below is an exported function with a unit test, because this probe produces the
 * survivorship figure the ingestion plan is judged by and nothing was checking it. The CLI at the
 * foot of the file is a shell over them and holds no logic of its own.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv, exit } from 'node:process';
import { transform } from 'esbuild';
import { z } from 'zod';

/** Every element is a string; components are plain functions, so composition needs no framework. */
const VOID = new Set([
  'img',
  'br',
  'hr',
  'input',
  'meta',
  'link',
  'source',
  'path',
  'circle',
  'rect'
]);

/** @param {unknown} value */
export const escape = value =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** @param {Record<string, unknown> | null | undefined} props */
export const renderAttributes = props =>
  Object.entries(props ?? {})
    .filter(
      ([key, value]) =>
        key !== 'children' && value !== undefined && value !== null && value !== false
    )
    .map(([key, value]) => {
      const name = key === 'className' ? 'class' : key === 'htmlFor' ? 'for' : key;

      if (value === true) return ` ${name}`;
      if (typeof value === 'object') return '';

      return ` ${name}="${escape(value)}"`;
    })
    .join('');

/**
 * Rendered markup has to be distinguishable from text, or a child element's HTML gets escaped into
 * the parent as literal angle brackets — the output looked plausible and was 100 KB of visible
 * source. A wrapper class carries the distinction; a bare string cannot.
 */
export class Html {
  /** @param {string} value */
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** @param {unknown[]} nodes */
export const flatten = nodes =>
  nodes
    .flat(Infinity)
    .filter(node => node !== null && node !== undefined && node !== false && node !== true)
    .map(node => (node instanceof Html ? node.value : escape(node)))
    .join('');

export const Fragment = Symbol('Fragment');

/**
 * @param {string | symbol | Function} tag
 * @param {Record<string, any> | null | undefined} props
 * @param {...unknown} children
 */
export const h = (tag, props, ...children) => {
  const kids = children.length ? children : props?.children !== undefined ? [props.children] : [];

  if (typeof tag === 'function') return tag({ ...props, children: kids.flat(Infinity) });
  if (tag === Fragment) return new Html(flatten(kids));

  const name = /** @type {string} */ (tag);

  return new Html(
    VOID.has(name)
      ? `<${name}${renderAttributes(props)}>`
      : `<${name}${renderAttributes(props)}>${flatten(kids)}</${name}>`
  );
};

/**
 * The class vocabulary is small — 175 distinct classes across the richest run, two thirds of them
 * arbitrary-value (`h-[50px]`), which translate mechanically. The rest is a short fixed list.
 */
export const FIXED = {
  relative: 'position:relative',
  absolute: 'position:absolute',
  'inset-0': 'inset:0',
  flex: 'display:flex',
  block: 'display:block',
  'inline-block': 'display:inline-block',
  'flex-col': 'flex-direction:column',
  'flex-row': 'flex-direction:row',
  'flex-wrap': 'flex-wrap:wrap',
  'flex-none': 'flex:none',
  'flex-1': 'flex:1 1 0%',
  'shrink-0': 'flex-shrink:0',
  grow: 'flex-grow:1',
  'items-start': 'align-items:flex-start',
  'items-center': 'align-items:center',
  'items-end': 'align-items:flex-end',
  'justify-start': 'justify-content:flex-start',
  'justify-center': 'justify-content:center',
  'justify-end': 'justify-content:flex-end',
  'justify-between': 'justify-content:space-between',
  'content-stretch': 'align-content:stretch',
  'self-stretch': 'align-self:stretch',
  'w-full': 'width:100%',
  'h-full': 'height:100%',
  'size-full': 'width:100%;height:100%',
  'min-w-px': 'min-width:1px',
  'min-h-px': 'min-height:1px',
  'max-w-none': 'max-width:none',
  'h-0': 'height:0',
  'w-px': 'width:1px',
  'h-px': 'height:1px',
  'overflow-clip': 'overflow:clip',
  'overflow-hidden': 'overflow:hidden',
  'overflow-auto': 'overflow:auto',
  'whitespace-nowrap': 'white-space:nowrap',
  'whitespace-pre': 'white-space:pre',
  'text-center': 'text-align:center',
  'text-left': 'text-align:left',
  'text-right': 'text-align:right',
  'not-italic': 'font-style:normal',
  italic: 'font-style:italic',
  'bg-white': 'background:#fff',
  'bg-black': 'background:#000',
  'border-solid': 'border-style:solid',
  border: 'border-width:1px',
  'rounded-full': 'border-radius:9999px',
  'cursor-pointer': 'cursor:pointer',
  'box-border': 'box-sizing:border-box',
  'pointer-events-none': 'pointer-events:none',
  'object-cover': 'object-fit:cover',
  'object-contain': 'object-fit:contain',
  'leading-none': 'line-height:1',
  uppercase: 'text-transform:uppercase',
  'font-normal': 'font-weight:400',
  'font-medium': 'font-weight:500',
  'font-semibold': 'font-weight:600',
  'font-bold': 'font-weight:700',
  'border-0': 'border-width:0',
  'border-t': 'border-top-width:1px',
  'border-b': 'border-bottom-width:1px',
  'border-l': 'border-left-width:1px',
  'border-r': 'border-right-width:1px',
  'bg-clip-padding': 'background-clip:padding-box',
  isolate: 'isolation:isolate',
  '-translate-x-1/2': 'translate:-50% 0',
  '-translate-y-1/2': 'translate:0 -50%',
  underline: 'text-decoration-line:underline',
  'decoration-solid': 'text-decoration-style:solid',
  'decoration-from-font': 'text-decoration-thickness:from-font',
  '[text-decoration-skip-ink:none]': 'text-decoration-skip-ink:none',
  '[text-underline-position:from-font]': 'text-underline-position:from-font',
  '[word-break:break-word]': 'word-break:break-word',
  'flex-[1_0_0]': 'flex:1 0 0',
  'left-0': 'left:0',
  'top-0': 'top:0',
  'right-0': 'right:0',
  'bottom-0': 'bottom:0',
  'left-1/2': 'left:50%',
  'top-1/2': 'top:50%',
  'min-w-full': 'min-width:100%',
  'opacity-50': 'opacity:.5',
  'text-ellipsis': 'text-overflow:ellipsis',
  'text-white': 'color:#fff',
  // Emitted by the probe itself, styled in the page shell rather than the generated sheet.
  'probe-codeconnect': ''
};

/** `prefix-[value]` → one or more declarations. @type {Record<string, (v: string) => string>} */
export const ARBITRARY = {
  w: v => `width:${v}`,
  h: v => `height:${v}`,
  'min-w': v => `min-width:${v}`,
  'min-h': v => `min-height:${v}`,
  'max-w': v => `max-width:${v}`,
  'max-h': v => `max-height:${v}`,
  size: v => `width:${v};height:${v}`,
  p: v => `padding:${v}`,
  px: v => `padding-inline:${v}`,
  py: v => `padding-block:${v}`,
  pt: v => `padding-top:${v}`,
  pr: v => `padding-right:${v}`,
  pb: v => `padding-bottom:${v}`,
  pl: v => `padding-left:${v}`,
  m: v => `margin:${v}`,
  mx: v => `margin-inline:${v}`,
  my: v => `margin-block:${v}`,
  mt: v => `margin-top:${v}`,
  mr: v => `margin-right:${v}`,
  mb: v => `margin-bottom:${v}`,
  ml: v => `margin-left:${v}`,
  gap: v => `gap:${v}`,
  'gap-x': v => `column-gap:${v}`,
  'gap-y': v => `row-gap:${v}`,
  bg: v => `background:${v}`,
  text: v => (/^#|^var|^rgb/.test(v) ? `color:${v}` : `font-size:${v}`),
  font: v => (/^\d+$/.test(v) ? `font-weight:${v}` : `font-family:${v}`),
  leading: v => `line-height:${v}`,
  tracking: v => `letter-spacing:${v}`,
  rounded: v => `border-radius:${v}`,
  border: v => (/^#|^var|^rgb/.test(v) ? `border-color:${v}` : `border-width:${v}`),
  top: v => `top:${v}`,
  right: v => `right:${v}`,
  bottom: v => `bottom:${v}`,
  left: v => `left:${v}`,
  inset: v => `inset:${v}`,
  z: v => `z-index:${v}`,
  opacity: v => `opacity:${v}`,
  shadow: v => `box-shadow:${v}`,
  grid: v => `grid:${v}`,
  order: v => `order:${v}`,
  'drop-shadow': v => `filter:drop-shadow(${v})`,
  translate: v => `translate:${v}`,
  rotate: v => `rotate:${v}`,
  '-rotate': v => `rotate:-${v}`,
  scale: v => `scale:${v}`,
  basis: v => `flex-basis:${v}`,
  aspect: v => `aspect-ratio:${v}`
};

/**
 * A token this probe cannot express is the finding, not a nuisance, so it is collected rather than
 * dropped. The sink is a parameter: a module-level set made the function untestable twice over —
 * two tests could not run in either order, and nothing could assert what a single call recorded.
 *
 * @param {string} token
 * @param {Set<string>} [unknown]
 */
export const classToCss = (token, unknown = new Set()) => {
  if (FIXED[/** @type {keyof typeof FIXED} */ (token)]) {
    return FIXED[/** @type {keyof typeof FIXED} */ (token)];
  }

  const degrees = token.match(/^(-?)rotate-(\d+)$/);
  if (degrees) return `rotate:${degrees[1]}${degrees[2]}deg`;

  const arbitrary = token.match(/^([a-z-]+)-\[(.+)\]$/);

  if (arbitrary) {
    const [, prefix, raw] = arbitrary,
      // Figma writes `var(--size\/250,20px)`; the escaped slash is for Tailwind, not for CSS.
      value = raw.replace(/\\/g, '').replace(/_/g, ' ');

    if (ARBITRARY[prefix]) return ARBITRARY[prefix](value);
  }

  unknown.add(token);
  return '';
};

/**
 * One class per rule keeps the output readable and the mapping auditable.
 *
 * @param {Iterable<string>} classes
 * @param {Set<string>} [unknown]
 */
export const buildStylesheet = (classes, unknown = new Set()) =>
  [...classes]
    .map(token => /** @type {[string, string]} */ ([token, classToCss(token, unknown)]))
    .filter(([, css]) => css)
    // Class names carry characters a selector must escape — brackets, slashes, dots, hashes,
    // percent signs. There is no `CSS.escape` outside a browser, so escape them here.
    .map(([token, css]) => `.${token.replace(/([^\w-])/g, '\\$1')}{${css}}`)
    .join('\n');

// ---------------------------------------------------------------------------------------------

/**
 * The read boundary. `index.json` is written by `normalise-captures.mjs` and read here; a shape
 * mismatch between them is how a measurement tool starts reporting a smaller number instead of an
 * error. `mode-decision.mjs` shipped exactly that fault behind twenty-three green tests.
 *
 * Deliberately permissive about unknown keys and strict about the ones this file dereferences.
 */
export const CaptureIndex = z.object({
  captures: z.array(
    z.object({
      file: z.string(),
      call: z.string(),
      part: z.string().optional(),
      label: z.string().optional(),
      nodeId: z.string().nullable().optional()
    })
  )
});

/** @typedef {{ file: string; label: string; nodeId?: string; source: string }} Region */

/**
 * Pick the design-context code captures out of a validated index.
 *
 * Filter on `part`, not on `call`. A `get_design_context` response carries a code block **and**
 * advisory blocks, and a backfill agent found that indexing the advisory text under its true call
 * name would make this reader feed prose to a TSX parser — so a correct `call` and a separate entry
 * were mutually exclusive. `part` separates them; `call` stays truthful.
 *
 * @param {z.infer<typeof CaptureIndex>} index
 */
export const codeCaptures = index =>
  index.captures.filter(
    capture => capture.call === 'get_design_context' && (capture.part ?? 'code') === 'code'
  );

/**
 * Pull the JSX blocks out of one original `figma-design-context*.md`, fenced or not. Kept for runs
 * that predate the normalised captures; four different shapes arrived, and reading them naively is
 * what made six runs look empty when they were only stored differently.
 *
 * @param {string} text
 */
export const blocksFromMarkdown = text => {
  const fenced = [
    ...text.matchAll(/```(?:jsx|tsx|ts|js|javascript|typescript)?\n([\s\S]*?)```/g)
  ].map(m => m[1]);

  if (fenced.length) return fenced;
  if (!/className=|data-node-id/.test(text)) return [];

  const start = text.search(/^(?:import |const |let |function |export |type |interface )/m);
  return start === -1 ? [] : [text.slice(start)];
};

/**
 * Prefer the normalised captures when a run has them: one format, one reader, no guessing. The
 * fallback reads the run's original files.
 *
 * @param {string} run
 * @param {string} [indexDir]
 * @returns {Region[]}
 */
export const readRegions = (run, indexDir = 'captures') => {
  const indexPath = join(run, indexDir, 'index.json'),
    /** @type {Region[]} */ regions = [];

  if (existsSync(indexPath)) {
    const index = CaptureIndex.parse(JSON.parse(readFileSync(indexPath, 'utf8')));

    for (const capture of codeCaptures(index))
      regions.push({
        file: capture.file,
        label: capture.label ?? capture.file,
        nodeId: capture.nodeId ?? undefined,
        source: readFileSync(join(run, capture.file), 'utf8')
      });

    return regions;
  }

  for (const name of readdirSync(run)
    .filter(entry => /^figma-design-context.*\.md$/.test(entry))
    .sort()) {
    const text = readFileSync(join(run, name), 'utf8'),
      blocks = blocksFromMarkdown(text);

    blocks.forEach((source, index) => {
      const heading = text.match(/^#\s*(.+)$/m);

      regions.push({
        file: blocks.length > 1 ? `${name}#${index + 1}` : name,
        label: heading?.[1] ?? name,
        nodeId:
          source.match(/data-node-id="([\d:]+)"/)?.[1] ??
          heading?.[1].match(/node\s+([\d:]+)/)?.[1],
        source
      });
    });
  }

  return regions;
};

/**
 * @typedef {{
 *   x: number;
 *   y: number;
 *   width: number;
 *   height: number;
 *   relative: { x: number; y: number };
 * }} Box
 */

/**
 * Node coordinates in `figma-metadata.txt` are **relative to the parent**, not absolute — the root
 * frame sits at (78, 248) on the canvas while its children report (0, 0). Placing a region
 * therefore means walking its ancestor chain and summing offsets, which needs the tree rather than
 * a flat scan. Reading the numbers without the nesting put the sidebar at a negative x.
 *
 * @param {string} text
 * @returns {Map<string, Box>}
 */
export const parseBoxes = text => {
  /** @type {Map<string, Box>} */
  const boxes = new Map();
  /** @type {{ id: string; x: number; y: number }[]} */
  const stack = [];

  for (const line of text.split('\n')) {
    const tag = line.match(
      /<(\w+)\s+id="([^"]+)"[^>]*?x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/
    );

    if (tag) {
      const [, , id, x, y, width, height] = tag,
        parent = stack[stack.length - 1],
        absolute = { x: (parent?.x ?? 0) + +x, y: (parent?.y ?? 0) + +y };

      boxes.set(id, { ...absolute, width: +width, height: +height, relative: { x: +x, y: +y } });

      if (!line.trimEnd().endsWith('/>')) stack.push({ id, ...absolute });
    }

    for (const _ of line.matchAll(/<\/\w+>/g)) stack.pop();
  }

  return boxes;
};

/** The frame substituted when the metadata declares none. Never a measurement — always a confession. */
export const FABRICATED_FRAME = { width: 1440, height: 1024 };

/**
 * @typedef {{
 *   frame: { id?: string; x?: number; y?: number; width: number; height: number };
 *   declared: boolean;
 *   line: number | null;
 * }} FrameResolution
 */

/**
 * Resolve the root frame, and say whether it was found or invented.
 *
 * Three real shapes defeated the original reader, which looked at line 0 only and only for
 * `<frame`: a prose or comment header pushes the root down the file (`a9`, `a4`, `b-nsp-home`,
 * `b-itsl-collab-add-element`), an MCP envelope escapes every quote (`a5`), and one root is a
 * `<symbol` (`b-sanna-account-creation`). All six were silently scored against a fabricated
 * `1440×1024`. The root is now searched for, and when it genuinely is not there the caller is told
 * rather than handed a number.
 *
 * @param {string} text
 * @param {Map<string, Box>} [boxes]
 * @returns {FrameResolution}
 */
export const resolveFrame = (text, boxes = new Map()) => {
  const lines = text.split('\n'),
    ROOT =
      /<(?:frame|symbol|section|component)\s+id=\\?"([^"\\]+)\\?"[^>]*?width=\\?"([\d.]+)\\?" height=\\?"([\d.]+)\\?"/;

  for (const [line, content] of lines.entries()) {
    const root = content.match(ROOT);

    if (root) {
      return {
        frame: { id: root[1], width: +root[2], height: +root[3], ...boxes.get(root[1]) },
        declared: true,
        line
      };
    }
  }

  return { frame: { ...FABRICATED_FRAME }, declared: false, line: null };
};

/**
 * @param {string} run
 * @returns {{ boxes: Map<string, Box> } & FrameResolution}
 */
export const readGeometry = run => {
  const metadataPath = join(run, 'figma-metadata.txt');

  if (!existsSync(metadataPath)) {
    return { boxes: new Map(), frame: { ...FABRICATED_FRAME }, declared: false, line: null };
  }

  const text = readFileSync(metadataPath, 'utf8'),
    boxes = parseBoxes(text);

  return { boxes, ...resolveFrame(text, boxes) };
};

// ---------------------------------------------------------------------------------------------

/**
 * Where Code Connect resolves, `get_design_context` substitutes a snippet reference instead of
 * markup — the same substitution that collapsed 91% of A2 into `<sl-grid></sl-grid>`. The probe
 * renders a visible placeholder so the hole is on screen rather than fatal.
 *
 * @param {Record<string, any>} [props]
 */
export const CodeConnectSnippet = props =>
  h(
    'div',
    {
      'data-code-connect': props?.name ?? props?.component ?? 'snippet',
      'data-node-id': props?.['data-node-id'],
      class: 'probe-codeconnect'
    },
    props?.name ?? props?.component ?? 'Code Connect snippet'
  );

/**
 * A capitalised JSX element is a component reference, and JSX evaluates children eagerly — so one
 * undefined name throws before any placeholder handler runs and takes the **whole region** with it.
 * `<Mask />` cost one capture 140 of its 179 nodes and the loss read as a shallow capture rather
 * than as this bug. Hyphenated elements compile to intrinsic strings and were never affected, which
 * is why it stayed hidden.
 *
 * So: find every capitalised element the block references, subtract the ones it defines, and return
 * the remainder for stubbing.
 *
 * @param {string} source
 */
export const undefinedComponentsIn = source => {
  const referenced = new Set([...source.matchAll(/<([A-Z][A-Za-z0-9_]*)/g)].map(m => m[1])),
    defined = new Set(
      [...source.matchAll(/(?:function|const|let|class)\s+([A-Z][A-Za-z0-9_]*)/g)].map(m => m[1])
    );

  return [...referenced].filter(
    name => !defined.has(name) && name !== 'Fragment' && name !== 'CodeConnectSnippet'
  );
};

/** @param {string[]} names */
export const stubSource = names =>
  names
    .map(
      name =>
        `const ${name} = props => h('div', { 'data-undefined-component': ${JSON.stringify(name)}, ` +
        `'data-node-id': props && props['data-node-id'], class: 'probe-undefined' }, ${JSON.stringify(name)});`
    )
    .join('\n');

/** @typedef {Region & { undefinedComponents?: string[]; html?: string; error?: string }} Rendered */

/**
 * Compile one region's JSX and evaluate it to HTML. The blocks are self-contained: they define
 * their helper components and export a default.
 *
 * @param {Region} region
 * @returns {Promise<Rendered>}
 */
export const renderRegion = async region => {
  try {
    let { code } = await transform(region.source, {
      loader: 'tsx',
      jsx: 'transform',
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      format: 'cjs'
    });

    /** The evaluated block assigns its component here; neither key exists until it runs. */
    const exports = /** @type {Record<string, unknown>} */ ({}),
      module = { exports };

    const undefinedComponents = undefinedComponentsIn(region.source),
      stubs = stubSource(undefinedComponents);

    if (stubs) {
      const { code: stubCode } = await transform(stubs, { loader: 'js', format: 'cjs' });

      code = `${stubCode}\n${code}`;
    }

    new Function('exports', 'module', 'require', 'h', 'Fragment', 'CodeConnectSnippet', code)(
      exports,
      module,
      () => ({}),
      h,
      Fragment,
      CodeConnectSnippet
    );

    const component = exports.default ?? module.exports?.default;

    return {
      ...region,
      // Carried on the region, not left as a loop-local: the summary reports it, and a report that
      // says "none" because it never looked is the batch's most-repeated fault.
      undefinedComponents,
      html: String(typeof component === 'function' ? component({}) : (component ?? ''))
    };
  } catch (error) {
    return { ...region, error: /** @type {Error} */ (error).message };
  }
};

/**
 * @param {Region[]} regions
 * @returns {Promise<Rendered[]>}
 */
export const renderRegions = async regions => {
  /** @type {Rendered[]} */
  const rendered = [];

  for (const region of regions) rendered.push(await renderRegion(region));

  return rendered;
};

/** @param {{ html?: string }[]} rendered */
export const classesIn = rendered => {
  /** @type {Set<string>} */
  const all = new Set();

  for (const region of rendered)
    for (const [, value] of (region.html ?? '').matchAll(/class="([^"]+)"/g))
      for (const token of value.split(/\s+/)) all.add(token);

  return all;
};

/**
 * Place a region against the frame origin, or mark it unplaceable. The origin is subtracted because
 * boxes are absolute on the Figma canvas and the page is not.
 *
 * @param {{ nodeId?: string }} region
 * @param {number} index
 * @param {Map<string, Box>} boxes
 * @param {{ x?: number; y?: number }} frame
 */
export const placeRegion = (region, index, boxes, frame) => {
  const box = region.nodeId ? boxes.get(region.nodeId) : undefined,
    origin = { x: frame.x ?? 0, y: frame.y ?? 0 };

  return box
    ? `position:absolute;left:${box.x - origin.x}px;top:${box.y - origin.y}px;width:${box.width}px;height:${box.height}px;`
    : `position:relative;outline:2px dashed #c0392b;margin:8px 0;` +
        `/* region ${index} has no box in the metadata */`;
};

/**
 * @param {{ label: string; nodeId?: string; html?: string; error?: string }[]} rendered
 * @param {Map<string, Box>} boxes
 * @param {{ x?: number; y?: number }} frame
 */
export const buildBody = (rendered, boxes, frame) =>
  rendered
    .map(
      (region, index) =>
        `<div data-region="${escape(region.label)}" data-node-id="${escape(region.nodeId ?? '')}" style="${placeRegion(region, index, boxes, frame)}">` +
        (region.error ? `<pre class="probe-error">${escape(region.error)}</pre>` : region.html) +
        `</div>`
    )
    .join('\n');

/**
 * @param {{
 *   run: string;
 *   frame: { width: number; height: number };
 *   body: string;
 *   stylesheet: string;
 * }} input
 */
export const buildDocument = ({ run, frame, body, stylesheet }) =>
  `<!doctype html>
<meta charset="utf-8">
<title>Design reconstruction — ${escape(run)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;border:0 solid transparent;font:inherit}
body{width:${frame.width}px;height:${frame.height}px;position:relative;background:#fff;
     font-family:system-ui,sans-serif;font-size:14px;color:#111}
img{max-width:100%;display:block}
.probe-error{background:#fdecea;color:#8b1a10;padding:8px;font:12px/1.4 ui-monospace,monospace;white-space:pre-wrap}
.probe-codeconnect{outline:2px dashed #b7791f;background:#fffaf0;color:#975a16;
                   font:11px/1.3 ui-monospace,monospace;padding:4px;min-height:16px}
.probe-undefined{outline:1px dotted #718096;background:#f7fafc;color:#4a5568;
                 font:10px/1.2 ui-monospace,monospace;padding:2px;min-height:8px}
${stylesheet}
</style>
${body}
`;

/**
 * @param {{
 *   run: string;
 *   out: string;
 *   document: string;
 *   frame: { width: number; height: number };
 *   frameDeclared: boolean;
 *   rendered: Rendered[];
 *   boxes: Map<string, Box>;
 *   classes: Set<string>;
 *   unknown: Set<string>;
 * }} input
 */
export const buildReport = ({
  run,
  out,
  document,
  frame,
  frameDeclared,
  rendered,
  boxes,
  classes,
  unknown
}) => ({
  run,
  out,
  frame,
  // The probe used to substitute `1440×1024` in silence, so six of nineteen runs reported a
  // geometry derived from a frame nobody declared. The flag travels with the number it qualifies.
  frameDeclared,
  regions: rendered.map(({ file, label, nodeId, html, error }) => ({
    file,
    label,
    nodeId,
    placed: !!(nodeId && boxes.get(nodeId)),
    bytes: html?.length ?? 0,
    error
  })),
  nodeIdsInOutput: [...document.matchAll(/data-node-id="/g)].length,
  classesSeen: classes.size,
  // The point of the probe: what the metadata could not express.
  classesUnmapped: [...unknown].sort(),
  // Named rather than silently stubbed: these are components the capture references and does not
  // define — almost always Code Connect substitutions.
  undefinedComponents: [
    ...new Set(rendered.flatMap(region => region.undefinedComponents ?? []))
  ].sort()
});

/** @param {{ run: string; indexDir?: string; out?: string }} options */
export const probe = async ({ run, indexDir = 'captures', out }) => {
  const regions = readRegions(run, indexDir);

  if (!regions.length) throw new Error(`no fenced design-context blocks found in ${run}`);

  const { boxes, frame, declared } = readGeometry(run),
    rendered = await renderRegions(regions),
    classes = classesIn(rendered),
    /** @type {Set<string>} */ unknown = new Set(),
    stylesheet = buildStylesheet(classes, unknown),
    body = buildBody(rendered, boxes, frame),
    target = out ?? join(run, 'design-reconstruction.html'),
    document = buildDocument({ run, frame, body, stylesheet });

  return {
    document,
    out: target,
    report: buildReport({
      run,
      out: target,
      document,
      frame,
      frameDeclared: declared,
      rendered,
      boxes,
      classes,
      unknown
    })
  };
};

// ---------------------------------------------------------------------------------------------

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

if (import.meta.main) {
  const run = arg('run');

  if (!run || !existsSync(run)) {
    console.error(
      'usage: render-design.mjs --run runs/2026-10-01-<slug> [--out file.html] [--index <dir>]' +
        ' [--allow-fabricated-frame]'
    );
    exit(2);
  }

  let result;

  try {
    result = await probe({ run, indexDir: arg('index') ?? 'captures', out: arg('out') });
  } catch (error) {
    console.error(/** @type {Error} */ (error).message);
    exit(1);
  }

  // A measurement tool that invents its own frame of reference reports a number instead of an
  // error, which is the one failure this harness has made repeatedly. Refuse by default.
  if (!result.report.frameDeclared && !argv.includes('--allow-fabricated-frame')) {
    console.error(
      `${run}: no root frame declared in figma-metadata.txt — refusing to score geometry against a ` +
        `fabricated ${FABRICATED_FRAME.width}×${FABRICATED_FRAME.height}. ` +
        `Pass --allow-fabricated-frame to measure anyway.`
    );
    exit(3);
  }

  writeFileSync(result.out, result.document);
  console.log(JSON.stringify(result.report, null, 2));
}
