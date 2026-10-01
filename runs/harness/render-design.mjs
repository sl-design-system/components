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
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv, exit } from 'node:process';
import { transform } from 'esbuild';

const arg = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

const run = arg('run');

if (!run || !existsSync(run)) {
  console.error('usage: render-design.mjs --run runs/2026-10-01-<slug> [--out file.html]');
  exit(2);
}

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

const escape = value =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderAttributes = props =>
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
class Html {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

const flatten = nodes =>
  nodes
    .flat(Infinity)
    .filter(node => node !== null && node !== undefined && node !== false && node !== true)
    .map(node => (node instanceof Html ? node.value : escape(node)))
    .join('');

const h = (tag, props, ...children) => {
  const kids = children.length ? children : props?.children !== undefined ? [props.children] : [];

  if (typeof tag === 'function') return tag({ ...props, children: kids.flat(Infinity) });
  if (tag === Fragment) return new Html(flatten(kids));

  return new Html(
    VOID.has(tag)
      ? `<${tag}${renderAttributes(props)}>`
      : `<${tag}${renderAttributes(props)}>${flatten(kids)}</${tag}>`
  );
};

const Fragment = Symbol('Fragment');

/**
 * The class vocabulary is small — 175 distinct classes across the richest run, two thirds of them
 * arbitrary-value (`h-[50px]`), which translate mechanically. The rest is a short fixed list.
 */
const FIXED = {
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

/** `prefix-[value]` → one or more declarations. */
const ARBITRARY = {
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

const unknown = new Set();

const classToCss = token => {
  if (FIXED[token]) return FIXED[token];

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

/** One class per rule keeps the output readable and the mapping auditable. */
const buildStylesheet = classes =>
  [...classes]
    .map(token => [token, classToCss(token)])
    .filter(([, css]) => css)
    // Class names carry characters a selector must escape — brackets, slashes, dots, hashes,
    // percent signs. There is no `CSS.escape` outside a browser, so escape them here.
    .map(([token, css]) => `.${token.replace(/([^\w-])/g, '\\$1')}{${css}}`)
    .join('\n');

// ---------------------------------------------------------------------------------------------

/**
 * Prefer the normalised captures when a run has them: one format, one reader, no guessing. The
 * fallback below reads the run's original files, which arrived in four different shapes — and
 * reading those is what made six runs look empty when they were only stored differently.
 */
const indexPath = join(run, 'captures', 'index.json'),
  regions = [];

if (existsSync(indexPath)) {
  for (const capture of JSON.parse(readFileSync(indexPath, 'utf8')).captures)
    if (capture.call === 'get_design_context')
      regions.push({
        file: capture.file,
        label: capture.label ?? capture.file,
        nodeId: capture.nodeId ?? undefined,
        source: readFileSync(join(run, capture.file), 'utf8')
      });
} else {
  for (const name of readdirSync(run)
    .filter(entry => /^figma-design-context.*\.md$/.test(entry))
    .sort()) {
    const text = readFileSync(join(run, name), 'utf8'),
      fenced = [
        ...text.matchAll(/```(?:jsx|tsx|ts|js|javascript|typescript)?\n([\s\S]*?)```/g)
      ].map(m => m[1]),
      unfenced = (() => {
        if (fenced.length || !/className=|data-node-id/.test(text)) return [];

        const start = text.search(/^(?:import |const |let |function |export |type |interface )/m);
        return start === -1 ? [] : [text.slice(start)];
      })(),
      blocks = fenced.length ? fenced : unfenced;

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
}

if (!regions.length) {
  console.error(`no fenced design-context blocks found in ${run}`);
  exit(1);
}

/** Node boxes, so disjoint regions can be placed where the design puts them. */
const metadataPath = join(run, 'figma-metadata.txt'),
  boxes = new Map();

let frame = { width: 1440, height: 1024 };

if (existsSync(metadataPath)) {
  // Node coordinates in this file are **relative to the parent**, not absolute — the root frame
  // sits at (78, 248) on the canvas while its children report (0, 0). Placing a region therefore
  // means walking its ancestor chain and summing offsets, which needs the tree rather than a flat
  // scan. Reading the numbers without the nesting put the sidebar at a negative x.
  const lines = readFileSync(metadataPath, 'utf8').split('\n'),
    stack = [];

  for (const line of lines) {
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

  const root = lines[0].match(/<frame id="([^"]+)"[^>]*width="([\d.]+)" height="([\d.]+)"/);
  if (root) frame = { id: root[1], width: +root[2], height: +root[3], ...boxes.get(root[1]) };
}

const rendered = [];

for (const region of regions) {
  try {
    const { code } = await transform(region.source, {
      loader: 'tsx',
      jsx: 'transform',
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      format: 'cjs'
    });

    const exports = {},
      module = { exports };

    // The blocks are self-contained: they define their helper components and export a default.
    // Where Code Connect resolves, `get_design_context` substitutes a snippet reference instead of
    // markup — the same substitution that collapsed 91% of A2 into `<sl-grid></sl-grid>`. The
    // probe renders a visible placeholder so the hole is on screen rather than fatal.
    const CodeConnectSnippet = props =>
      h(
        'div',
        {
          'data-code-connect': props?.name ?? props?.component ?? 'snippet',
          'data-node-id': props?.['data-node-id'],
          class: 'probe-codeconnect'
        },
        props?.name ?? props?.component ?? 'Code Connect snippet'
      );

    new Function('exports', 'module', 'require', 'h', 'Fragment', 'CodeConnectSnippet', code)(
      exports,
      module,
      () => ({}),
      h,
      Fragment,
      CodeConnectSnippet
    );

    const component = exports.default ?? module.exports?.default;

    rendered.push({
      ...region,
      html: String(typeof component === 'function' ? component({}) : (component ?? ''))
    });
  } catch (error) {
    rendered.push({ ...region, error: error.message });
  }
}

const allClasses = new Set();

for (const region of rendered)
  for (const [, value] of (region.html ?? '').matchAll(/class="([^"]+)"/g))
    for (const token of value.split(/\s+/)) allClasses.add(token);

const absolute = (region, index) => {
  const box = region.nodeId && boxes.get(region.nodeId),
    origin = { x: frame.x ?? 0, y: frame.y ?? 0 };

  return box
    ? `position:absolute;left:${box.x - origin.x}px;top:${box.y - origin.y}px;width:${box.width}px;height:${box.height}px;`
    : `position:relative;outline:2px dashed #c0392b;margin:8px 0;` +
        `/* region ${index} has no box in the metadata */`;
};

const body = rendered
  .map(
    (region, index) =>
      `<div data-region="${escape(region.label)}" data-node-id="${escape(region.nodeId ?? '')}" style="${absolute(region, index)}">` +
      (region.error ? `<pre class="probe-error">${escape(region.error)}</pre>` : region.html) +
      `</div>`
  )
  .join('\n');

const out = arg('out') ?? join(run, 'design-reconstruction.html');

writeFileSync(
  out,
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
${buildStylesheet(allClasses)}
</style>
${body}
`
);

const report = {
  run,
  out,
  frame,
  regions: rendered.map(({ file, label, nodeId, html, error }) => ({
    file,
    label,
    nodeId,
    placed: !!(nodeId && boxes.get(nodeId)),
    bytes: html?.length ?? 0,
    error
  })),
  nodeIdsInOutput: [...readFileSync(out, 'utf8').matchAll(/data-node-id="/g)].length,
  classesSeen: allClasses.size,
  // The point of the probe: what the metadata could not express.
  classesUnmapped: [...unknown].sort()
};

console.log(JSON.stringify(report, null, 2));
