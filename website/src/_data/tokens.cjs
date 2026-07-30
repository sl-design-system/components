'use strict';

const { readFile } = require('fs/promises');
const { join } = require('path');

const coreCssDir = join(__dirname, '../../../scripts/export/core-css');

/**
 * Parse CSS custom properties from CSS source text into a Map of name → value.
 * Handles multi-line values (e.g. multi-line var() references).
 */
const parseCssProps = css => {
  const props = new Map();
  const lines = css.split('\n');
  let currentProp = null;
  let currentValueParts = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (currentProp) {
      // Accumulate continuation lines
      const stripped = trimmed.replace(/;$/, '').trim();
      currentValueParts.push(stripped);

      if (trimmed.endsWith(';')) {
        props.set(currentProp, currentValueParts.join(' ').trim());
        currentProp = null;
        currentValueParts = [];
      }
    } else {
      const match = trimmed.match(/^(--[a-z][a-z0-9-]*):\s*(.*?)(;?)$/);
      if (match) {
        const [, name, value, semi] = match;
        const propName = name.slice(2); // strip leading --
        if (semi === ';') {
          props.set(propName, value.trim());
        } else if (value.trim()) {
          currentProp = propName;
          currentValueParts = [value.trim()];
        }
      }
    }
  }

  return props;
};

const TSHIRT_ORDER = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

/** Sort an array by the last `-`-separated segment, numerically or by t-shirt size order. */
const sortBySuffix = (arr, getSuffix) =>
  [...arr].sort((a, b) => {
    const suffixA = getSuffix(a),
      suffixB = getSuffix(b);
    const numA = Number(suffixA),
      numB = Number(suffixB);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    const tA = TSHIRT_ORDER.indexOf(suffixA),
      tB = TSHIRT_ORDER.indexOf(suffixB);
    if (tA !== -1 && tB !== -1) return tA - tB;
    return suffixA.localeCompare(suffixB);
  });

/** Sort an array of { token, ... } objects by the suffix of the token name. */
const sortByTokenSuffix = arr => sortBySuffix(arr, item => item.token.split('-').at(-1));

/** Recursively resolve a single var(--name) reference; stops after 10 hops. */
const resolveVar = (value, props, depth = 0) => {
  if (depth > 10) return value;
  const m = value.match(/^var\(--(sl-[a-z0-9-]+)\)$/);
  if (m && props.has(m[1])) {
    return resolveVar(props.get(m[1]), props, depth + 1);
  }
  return value;
};

module.exports = async function () {
  const [brandCss, systemCss] = await Promise.all([
    readFile(join(coreCssDir, 'brand/sanoma-learning.css'), 'utf-8'),
    readFile(join(coreCssDir, 'system/default.css'), 'utf-8'),
  ]);

  const brandProps = parseCssProps(brandCss);
  const systemProps = parseCssProps(systemCss);

  // Merge both maps so we can resolve cross-file references
  const allProps = new Map([...systemProps, ...brandProps]);

  // --- Palette: brand light color palette, grouped by color name ---
  const paletteMap = new Map();
  for (const [name, value] of brandProps) {
    const m = name.match(/^sl-brand-light-color-palette-([a-z]+)-(\d+)$/);
    if (m) {
      const [, color, step] = m;
      if (!paletteMap.has(color)) paletteMap.set(color, []);
      paletteMap.get(color).push({ token: `--${name}`, step, value: resolveVar(value, allProps) });
    }
  }
  const palette = [...paletteMap.entries()].map(([color, entries]) => [color, sortByTokenSuffix(entries)]);

  // --- Size scale: --sl-size-<number> tokens (direct px values) ---
  const sizeRaw = [];
  for (const [name, value] of systemProps) {
    if (/^sl-size-\d+$/.test(name)) {
      sizeRaw.push({ token: `--${name}`, value: resolveVar(value, allProps) });
    }
  }
  const size = sortByTokenSuffix(sizeRaw);

  // --- Space scale: --sl-space-<number> tokens ---
  const spaceRaw = [];
  for (const [name, value] of systemProps) {
    if (/^sl-space-\d+$/.test(name)) {
      spaceRaw.push({ token: `--${name}`, value: resolveVar(value, allProps) });
    }
  }
  const space = sortByTokenSuffix(spaceRaw);

  // --- Opacity: --sl-opacity-new-<step> tokens ---
  const opacityRaw = [];
  for (const [name, value] of systemProps) {
    if (/^sl-opacity-new-[a-z0-9]+$/.test(name)) {
      const step = name.replace('sl-opacity-new-', '');
      opacityRaw.push({ token: `--${name}`, step, value: resolveVar(value, allProps) });
    }
  }
  const opacity = sortByTokenSuffix(opacityRaw);

  // --- Border radius: --sl-size-border-radius-* tokens ---
  const borderRadiusRaw = [];
  for (const [name, value] of systemProps) {
    if (/^sl-size-border-radius-/.test(name)) {
      borderRadiusRaw.push({ token: `--${name}`, label: name.replace('sl-size-border-radius-', ''), value: resolveVar(value, allProps) });
    }
  }
  const borderRadius = sortByTokenSuffix(borderRadiusRaw);

  // --- Typography typesets: --sl-typography-<typeset>-<property> ---
  // Group by typeset name; each entry gets font-size, font-weight, line-height, etc.
  const typographyMap = new Map();
  for (const [name, value] of systemProps) {
    const m = name.match(/^sl-typography-(.+)-(font-family|font-size|font-weight|line-height|letter-spacing)$/);
    if (m) {
      const [, typeset, prop] = m;
      if (!typographyMap.has(typeset)) typographyMap.set(typeset, {});
      typographyMap.get(typeset)[prop] = { token: `--${name}`, value: resolveVar(value, allProps) };
    }
  }
  const typography = [...typographyMap.entries()].sort((a, b) => {
    const partsA = a[0].split('-'),
      partsB = b[0].split('-');
    const baseA = partsA.slice(0, -1).join('-'),
      baseB = partsB.slice(0, -1).join('-');
    if (baseA !== baseB) return baseA.localeCompare(baseB);
    // Same base name: sort the size suffix within the group
    const suffixA = partsA.at(-1),
      suffixB = partsB.at(-1);
    const numA = Number(suffixA),
      numB = Number(suffixB);
    if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
    const tA = TSHIRT_ORDER.indexOf(suffixA),
      tB = TSHIRT_ORDER.indexOf(suffixB);
    if (tA !== -1 && tB !== -1) return tB - tA;
    return suffixA.localeCompare(suffixB);
  });

  return {
    palette,
    size,
    space,
    opacity,
    border: { radius: borderRadius },
    typography,
  };
};
