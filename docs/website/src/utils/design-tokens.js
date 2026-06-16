import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the design token source JSON files. */
const TOKENS_DIR = resolve(__dirname, '../../../../packages/tokens/src/tokens');

/**
 * Token sets that are *documented*. Their tokens end up on the generated pages.
 * `wrapper` is an optional top-level key to unwrap (theme files nest everything
 * under a variant id such as `I-A`).
 *
 * The order matters: when the same token name appears in multiple sets, the
 * first occurrence wins (so each token is documented only once).
 */
const DOCUMENTED_SETS = [
  { file: 'primitives.json', wrapper: null },
  { file: 'system.json', wrapper: null },
  { file: 'sanoma-learning/base-new.json', wrapper: 'I-A' },
  { file: 'sanoma-learning/theme-new.json', wrapper: 'I-A' }
];

/**
 * Token sets that are only used to *resolve* references (their values back the
 * documented theme tokens) but are not documented themselves. They are merged
 * with their wrappers intact, because references point at the wrapped names
 * (e.g. `{sanoma-learning.color.link.idle}`).
 */
const RESOLUTION_ONLY_SETS = [{ file: 'sanoma-learning/light-new.json' }];

/**
 * Display metadata per category. Categories not listed fall back to a
 * title-cased name. Pages are ordered alphabetically by title (see below), so
 * no explicit order is needed here.
 */
const CATEGORY_META = {
  color: { title: 'Color', icon: 'palette' },
  size: { title: 'Size', icon: 'ruler' },
  space: { title: 'Space', icon: 'arrows-left-right' },
  fontWeight: { title: 'Font weight', icon: 'font' },
  text: { title: 'Typography', icon: 'text-height' },
  opacity: { title: 'Opacity', icon: 'circle-half-stroke' },
  elevation: { title: 'Elevation', icon: 'layer-group' },
  icon: { title: 'Icon', icon: 'icons' }
};

/**
 * Categories whose tokens are split into `<h2>` subgroups (by the segment after
 * the category, e.g. `color.link.*` -> "Link"). Other categories render as a
 * single flat table.
 */
const GROUPED_CATEGORIES = new Set(['color']);

/**
 * Subgroups (by the segment after the category) that should not get their own
 * heading. Their tokens are listed at the top of the page without a heading.
 */
const UNGROUPED_SEGMENTS = new Set(['black', 'transparent', 'white']);

/**
 * Token namespaces that are theme specific. Aliases pointing into these (e.g.
 * `sanoma-learning.color.*`, the `I-A` theme variant) are not shown, since they
 * only exist within a single theme; the resolved value is shown instead.
 */
const THEME_NAMESPACES = new Set(['sanoma-learning', 'I-A']);

/** The set of FontAwesome icon names used by the generated token pages. */
export const designTokenIcons = Object.values(CATEGORY_META).map(meta => meta.icon);

const REFERENCE = /\{([^}]+)\}/g;

function loadJson(file) {
  return JSON.parse(readFileSync(join(TOKENS_DIR, file), 'utf-8'));
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (
      key in target &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key]) &&
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }

  return target;
}

function getToken(tree, path) {
  let node = tree;

  for (const segment of path.split('.')) {
    if (node && typeof node === 'object' && segment in node) {
      node = node[segment];
    } else {
      return undefined;
    }
  }

  return node;
}

/** Recursively resolves token references ({...}) in strings, arrays and objects. */
function resolveValue(value, tree, depth = 0) {
  if (depth > 50) {
    return value;
  }

  if (typeof value === 'string') {
    const exact = value.trim().match(/^\{([^}]+)\}$/);

    if (exact) {
      const token = getToken(tree, exact[1]);

      return token && typeof token === 'object' && '$value' in token
        ? resolveValue(token.$value, tree, depth + 1)
        : value;
    }

    // Inline references, e.g. `rgba({color.x}, {opacity.y})`.
    return value.replace(REFERENCE, (match, ref) => {
      const token = getToken(tree, ref);

      if (token && typeof token === 'object' && '$value' in token) {
        const resolved = resolveValue(token.$value, tree, depth + 1);

        return typeof resolved === 'string' ? resolved : match;
      }

      return match;
    });
  }

  if (Array.isArray(value)) {
    return value.map(item => resolveValue(item, tree, depth + 1));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, resolveValue(val, tree, depth + 1)])
    );
  }

  return value;
}

/** Collects all `$value` leaves with their dotted path. */
function flatten(node, path, out) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if ('$value' in node) {
    out.push({ path, token: node });
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) {
      continue;
    }

    flatten(value, [...path, key], out);
  }
}

/** Normalises transitional `-new` category names (e.g. `size-new` -> `size`). */
function normalizeSegment(segment) {
  return segment.replace(/-new$/, '');
}

/**
 * Splits a category's tokens into subgroups by the segment after the category
 * (e.g. `color.link.*` -> "Link"). Groups and the tokens within them are sorted
 * alphabetically. Tokens whose segment is in `UNGROUPED_SEGMENTS` are returned
 * separately as `lead` (shown at the top without a heading).
 */
function groupTokens(tokens) {
  const groups = new Map(),
    lead = [];

  for (const token of tokens) {
    const segment = token.name.split('.')[1] ?? '';

    if (UNGROUPED_SEGMENTS.has(segment)) {
      lead.push(token);
      continue;
    }

    const title = segment.charAt(0).toUpperCase() + segment.slice(1);

    if (!groups.has(title)) {
      groups.set(title, []);
    }

    groups.get(title).push(token);
  }

  return {
    lead: lead.sort((a, b) => a.name.localeCompare(b.name)),
    groups: [...groups.entries()]
      .map(([title, groupTokens]) => ({
        title,
        tokens: groupTokens.sort((a, b) => a.name.localeCompare(b.name))
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
  };
}

/**
 * Some tokens resolve to `rgba(#rrggbb, NN%)`, which is not valid CSS (a hex
 * color inside `rgba()`). Rewrite those to a valid `rgba(r, g, b, a)` so the
 * previews render correctly.
 */
function fixColors(value) {
  return value.replace(
    /rgba\(\s*#([0-9a-fA-F]{6})\s*,\s*([\d.]+)%\s*\)/g,
    (_match, hex, percentage) => {
      const r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

      return `rgba(${r}, ${g}, ${b}, ${Number(percentage) / 100})`;
    }
  );
}

/** Builds a single CSS box-shadow declaration from a resolved shadow array. */
function shadowToCss(shadows) {
  return shadows
    .map(shadow => {
      const inset = shadow.type === 'innerShadow' ? 'inset ' : '';

      return `${inset}${shadow.x ?? '0'} ${shadow.y ?? '0'} ${shadow.blur ?? '0'} ${shadow.spread ?? '0'} ${shadow.color ?? ''}`.trim();
    })
    .join(', ');
}

/** Produces a human-readable, resolved value plus an optional color swatch. */
function describeValue(type, rawValue, resolved) {
  if (type === 'color') {
    const color = typeof resolved === 'string' ? fixColors(resolved) : null;

    return { text: color ?? '', swatch: color };
  }

  if (type === 'boxShadow' && Array.isArray(resolved)) {
    const css = fixColors(shadowToCss(resolved));

    return { text: css, shadow: css };
  }

  if (type === 'typography' && resolved && typeof resolved === 'object') {
    const { fontSize, fontFamily, fontWeight, lineHeight } = resolved;

    return {
      text: [fontWeight, fontSize && `${fontSize}`, fontFamily, lineHeight && `/ ${lineHeight}`]
        .filter(Boolean)
        .join(' ')
    };
  }

  if (typeof resolved === 'string') {
    return { text: resolved };
  }

  return { text: JSON.stringify(resolved) };
}

/**
 * Loads the configured token sets and returns the documented tokens grouped by
 * category, ready to drive page generation. Each token is documented only once.
 */
export function buildDesignTokens() {
  // Resolution tree: every set merged with wrappers intact so references that
  // use the wrapped names (e.g. `{sanoma-learning.color.x}`) resolve.
  const tree = {};

  for (const { file } of [...DOCUMENTED_SETS, ...RESOLUTION_ONLY_SETS]) {
    deepMerge(tree, loadJson(file));
  }

  // The build pipeline hoists the active theme/mode namespaces into the root,
  // so some tokens reference theme tokens without the wrapper prefix
  // (e.g. `{elevation.surface.shadow}`). Replicate that for resolution.
  for (const wrapper of ['I-A', 'sanoma-learning']) {
    if (tree[wrapper]) {
      deepMerge(tree, structuredClone(tree[wrapper]));
    }
  }

  const categories = new Map();
  const seen = new Set();

  for (const { file, wrapper } of DOCUMENTED_SETS) {
    const root = wrapper ? (loadJson(file)[wrapper] ?? {}) : loadJson(file),
      leaves = [];

    flatten(root, [], leaves);

    for (const { path, token } of leaves) {
      const category = normalizeSegment(path[0]);

      // `theme-name` is theme metadata, not a real token category.
      if (category === 'theme-name') {
        continue;
      }

      const name = [category, ...path.slice(1)].join('.');

      // Document each token only once (first set wins).
      if (seen.has(name)) {
        continue;
      }
      seen.add(name);

      const rawValue = token.$value,
        resolved = resolveValue(rawValue, tree),
        alias =
          typeof rawValue === 'string'
            ? (rawValue.trim().match(/^\{([^}]+)\}$/)?.[1] ?? null)
            : null,
        // Only show the alias if it isn't theme specific.
        reference = alias && THEME_NAMESPACES.has(alias.split('.')[0]) ? null : alias,
        { text, swatch, shadow } = describeValue(token.$type, rawValue, resolved);

      if (!categories.has(category)) {
        categories.set(category, []);
      }

      categories.get(category).push({
        name,
        cssVariable: `--sl-${name.replace(/\./g, '-')}`,
        type: token.$type ?? '',
        reference,
        value: text,
        swatch: swatch ?? null,
        shadow: shadow ?? null,
        description: token.$description || ''
      });
    }
  }

  return [...categories.entries()]
    .map(([category, tokens]) => {
      const meta = CATEGORY_META[category] ?? {
        title: category.charAt(0).toUpperCase() + category.slice(1),
        icon: 'palette'
      };

      const result = { category, slug: category.toLowerCase(), tokens, ...meta };

      if (GROUPED_CATEGORIES.has(category)) {
        const { lead, groups } = groupTokens(tokens);

        result.leadTokens = lead;
        result.groups = groups;
      }

      return result;
    })
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((category, index) => ({ ...category, order: index + 1 }));
}
