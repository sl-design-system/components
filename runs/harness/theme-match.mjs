/**
 * Picks the theme a design was drawn against, by evidence rather than by product name.
 *
 * The batch's first theme mapping was a guess from the team label, and at least one entry was
 * wrong: NSP was mapped to `sanoma-pro`, whose tokens resolve green, while the design's own
 * variables are teal — the exact values `packages/themes/max` resolves them to. Every colour pixel
 * measured under the wrong theme describes the wrong theme, so the guess has to go.
 *
 * The design already carries the answer. `figma-variable-defs.json` gives token _names_ with the
 * values Figma resolved them to, and each theme declares the same names as custom properties. So
 * compare name for name: `color/foreground/bold` against `--sl-color-foreground-bold`. Matching
 * names is far stronger evidence than matching stray hex values, which can coincide across themes.
 *
 * Usage: node runs/harness/theme-match.mjs <path-to-figma-variable-defs.json>
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { argv, exit } from 'node:process';

const defsPath = argv[2];

if (!defsPath) {
  console.error('usage: theme-match.mjs <figma-variable-defs.json>');
  exit(2);
}

/**
 * Themes indirect through brand layers (`--sl-color-x: var(--sl-brand-light-color-x)`), so a
 * literal comparison would miss everything. Resolve the chain. Only the first declaration of each
 * property is kept: the light values come first in the file and the dark ones override later, and a
 * design's variable defs are the light mode unless Figma says otherwise.
 */
const loadTheme = file => {
  const declarations = new Map();

  for (const [, name, value] of readFileSync(file, 'utf8').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    if (!declarations.has(name)) declarations.set(name, value.trim());

  const resolve = (value, depth = 0) => {
    if (depth > 10) return value;

    const reference = value.match(/^var\((--[\w-]+)(?:\s*,\s*(.+))?\)$/);
    if (!reference) return value;

    const target = declarations.get(reference[1]);

    return target === undefined ? (reference[2] ?? value) : resolve(target.trim(), depth + 1);
  };

  return new Map([...declarations].map(([name]) => [name, resolve(declarations.get(name))]));
};

const normalise = value => value.trim().toLowerCase().replace(/\s+/g, ' '),
  // `color/foreground/bold` is the same token as `--sl-color-foreground-bold`; Figma writes the
  // path with slashes and the theme writes it with dashes.
  toCustomProperty = token => `--sl-${token.replace(/\//g, '-')}`;

const defs = JSON.parse(readFileSync(defsPath, 'utf8')),
  colorTokens = Object.entries(defs).filter(
    ([token, value]) =>
      token.startsWith('color/') && typeof value === 'string' && value.startsWith('#')
  ),
  themesDir = 'packages/themes',
  results = [];

for (const name of readdirSync(themesDir)) {
  const file = join(themesDir, name, 'theme.css');
  if (!existsSync(file)) continue;

  const theme = loadTheme(file),
    compared = [],
    matched = [];

  for (const [token, value] of colorTokens) {
    const declared = theme.get(toCustomProperty(token));
    if (declared === undefined) continue;

    compared.push(token);
    if (normalise(declared) === normalise(value)) matched.push(token);
  }

  if (compared.length)
    results.push({
      theme: name,
      matched: matched.length,
      compared: compared.length,
      score: Number((matched.length / compared.length).toFixed(3)),
      mismatches: compared.filter(token => !matched.includes(token)).slice(0, 5)
    });
}

results.sort((a, b) => b.score - a.score || b.compared - a.compared);

console.log(
  JSON.stringify(
    {
      defs: defsPath,
      colorTokensInDesign: colorTokens.length,
      best: results[0]?.theme ?? null,
      // What identifies a theme is the *margin* over the runner-up, not the absolute score.
      // Absolute agreement is poor even for a known-correct pairing — the theme packages do not
      // reproduce everything Figma resolved — so a 0.9 bar would reject every correct answer.
      // A best that beats second place several times over is still a clear identification.
      marginOverSecond: results[1]
        ? Number((results[0].score / Math.max(results[1].score, 0.001)).toFixed(1))
        : null,
      confident:
        results.length > 1 && results[0].compared >= 5 && results[0].score >= 2 * results[1].score,
      // Low absolute agreement is a finding in its own right, not noise to round away: it means
      // the design and the theme package disagree about tokens they both claim to define.
      absoluteAgreement: results[0]?.score ?? null,
      ranking: results.slice(0, 5)
    },
    null,
    2
  )
);
