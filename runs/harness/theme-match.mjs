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

  // Declarations wrap across lines — `--a: var(\n  --b\n);` is common in these files — so the
  // value has to be flattened before anything tries to read a `var()` reference out of it.
  // Missing this made the resolver fail silently on exactly the indirections that matter, and the
  // tool reported a three-way tie where the right answer matches every single token.
  for (const [, name, value] of readFileSync(file, 'utf8').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    if (!declarations.has(name)) declarations.set(name, value.replace(/\s+/g, ' ').trim());

  const resolve = (value, depth = 0) => {
    if (depth > 10) return value;

    // Whitespace inside `var( --name )` is normal once a wrapped declaration has been flattened;
    // requiring `var(--` matched none of them and quietly left every indirection unresolved.
    const reference = value.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+?))?\s*\)$/);
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
  // Name matching needs the design to speak the design system's vocabulary. Several designs in
  // this corpus do not — drawn against another library, they bind `$gray--900`, `Size/300`,
  // `$brand--700`. For those this tool reported `colorTokensInDesign: 0` and ranked nothing, and
  // a run had to identify its theme by hand. The raw values are weaker evidence per token, since
  // a hex can coincide, but across twenty of them it is decisive — and it is the only evidence a
  // non-SLDS design offers.
  anyHexes = [
    ...new Set(
      Object.values(defs)
        .filter(value => typeof value === 'string' && /^#[0-9a-fA-F]{6,8}$/.test(value))
        .map(value => value.toLowerCase().slice(0, 7))
    )
  ],
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

// Colour is not the only evidence, and sometimes it is not the deciding evidence. Two themes in
// this corpus are colour-identical and differ only in radii, border widths and fonts — a design
// bound 10 colour tokens, which tied, and 3 size tokens, which separated them 3:0. A run found
// that by hand after the tool reported an unbreakable tie.
const scalarTokens = Object.entries(defs).filter(
    ([token, value]) =>
      !token.startsWith('color/') && typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)
  ),
  byScalar = [];

for (const name of readdirSync(themesDir)) {
  const file = join(themesDir, name, 'theme.css');
  if (!existsSync(file)) continue;

  const theme = loadTheme(file),
    compared = [],
    matched = [];

  for (const [token, value] of scalarTokens) {
    const declared = theme.get(toCustomProperty(token));
    if (declared === undefined) continue;

    compared.push(token);
    // Themes write these with a unit; the design reports a bare number.
    if (normalise(declared).replace(/px$/, '') === normalise(value)) matched.push(token);
  }

  if (compared.length)
    byScalar.push({
      theme: name,
      matched: matched.length,
      compared: compared.length,
      score: Number((matched.length / compared.length).toFixed(3))
    });
}

byScalar.sort((a, b) => b.score - a.score || b.compared - a.compared);

// Only consulted when colour leaves a genuine tie at the top — colour is the stronger signal when
// it discriminates at all.
const colourTied =
    results.length > 1 && results[0].score > 0 && results[0].score === results[1].score,
  tiedThemes = colourTied
    ? results.filter(r => r.score === results[0].score).map(r => r.theme)
    : [],
  scalarAmongTied = byScalar.filter(r => tiedThemes.includes(r.theme)),
  tieBreak =
    colourTied && scalarAmongTied.length > 1 && scalarAmongTied[0].score > scalarAmongTied[1].score
      ? scalarAmongTied[0]
      : null;

// A name match is better evidence than a value match — a name carries intent, a hex does not — so
// this runs only when name matching produced nothing usable. "Nothing usable" has to include the
// case where the design *has* colour tokens but under another library's paths
// (`button/primary/outline/idle/background`), which no theme declares: that ranked zero themes
// and reported no theme at all, which is worse than weaker evidence.
const nameMatchFailed = !colorTokens.length || !results.length || results[0].score === 0,
  byValue = [];

if (nameMatchFailed)
  for (const name of readdirSync(themesDir)) {
    const file = join(themesDir, name, 'theme.css');
    if (!existsSync(file)) continue;

    const values = new Set(
        [...loadTheme(file).values()].map(value => normalise(value).slice(0, 7))
      ),
      matched = anyHexes.filter(hex => values.has(hex));

    byValue.push({
      theme: name,
      matched: matched.length,
      compared: anyHexes.length,
      score: anyHexes.length ? Number((matched.length / anyHexes.length).toFixed(3)) : 0
    });
  }

byValue.sort((a, b) => b.score - a.score);

console.log(
  JSON.stringify(
    {
      defs: defsPath,
      colorTokensInDesign: colorTokens.length,
      // Named so nobody reads a value match as if it were a name match.
      method: nameMatchFailed ? 'hex-value-fallback' : 'token-name',
      ...(!nameMatchFailed
        ? {}
        : {
            note:
              'Name matching found nothing: this design binds no design-system colour token names, ' +
              "or binds them under another library's paths. Ranked by raw hex agreement instead, " +
              'which is weaker evidence per token.',
            hexesInDesign: anyHexes.length,
            valueRanking: byValue.slice(0, 5)
          }),
      // No evidence must not produce a name. With zero comparable tokens every theme scores 0,
      // the sort is stable, and the first theme alphabetically came back as `best` — one run
      // adopted `itslearning` from exactly that and carried it through six stages. A ranking of
      // nothing has no winner.
      best:
        tieBreak?.theme ??
        (nameMatchFailed
          ? byValue[0]?.score > 0
            ? byValue[0].theme
            : null
          : results[0]?.score > 0
            ? results[0].theme
            : null) ??
        null,
      evidence: nameMatchFailed ? (anyHexes.length ? 'hex values' : 'none') : 'token names',
      ...(colourTied
        ? {
            colourTiedBetween: tiedThemes,
            scalarTokensInDesign: scalarTokens.length,
            scalarRankingAmongTied: scalarAmongTied.slice(0, 4),
            tieBrokenBy: tieBreak
              ? `scalar tokens: ${tieBreak.theme} ${tieBreak.matched}/${tieBreak.compared}`
              : 'not broken — scalar tokens do not separate these themes either'
          }
        : {}),
      marginOverSecond: (() => {
        const ranked = nameMatchFailed ? byValue : results;
        return ranked[1]
          ? Number((ranked[0].score / Math.max(ranked[1].score, 0.001)).toFixed(1))
          : null;
      })(),
      // A correct pairing matches *every* colour token — all three known-good pairings do. So the
      // test is exactness and uniqueness, not distance from the runner-up: a theme that agrees on
      // all of them, and is alone in doing so, has been identified even when another theme agrees
      // on most. An earlier margin-based rule was tuned against a broken resolver and would now
      // reject a perfect match that happens to have a close second.
      // Whichever method ran has to carry its own bar. A name match is identified by exactness
      // and uniqueness — every known-good pairing scores 1.0. A value match never reaches 1.0,
      // because a design always carries a few colours its theme does not define, so it is judged
      // on separation instead: decisive agreement and a runner-up nowhere near it.
      confident: tieBreak
        ? true
        : nameMatchFailed
          ? byValue[0]?.compared >= 8 &&
            byValue[0]?.score >= 0.8 &&
            byValue[0]?.score >= 3 * (byValue[1]?.score ?? 0)
          : results[0]?.compared >= 5 &&
            results[0]?.score === 1 &&
            !results.slice(1).some(other => other.score === 1),
      // Anything short of 1 means the design and the theme disagree about tokens they both claim
      // to define — worth reporting rather than rounding away.
      absoluteAgreement: (nameMatchFailed ? byValue[0]?.score : results[0]?.score) ?? null,
      ranking: results.slice(0, 5)
    },
    null,
    2
  )
);
