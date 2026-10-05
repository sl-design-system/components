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
 * Usage: node runs/harness/theme-match.mjs <path-to-figma-variable-defs.json> [--themes <dir>]
 *
 *     [--allow - tie];
 *
 * Every step is an exported function with a unit test. This tool decides what every colour
 * measurement downstream _means_, and its recorded failure mode is a confident wrong answer, not an
 * error — so the parts that can be wrong are the parts that are tested.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { argv, exit } from 'node:process';
import { z } from 'zod';

export const DEFAULT_THEMES_DIR = 'packages/themes';

// ---------------------------------------------------------------------------------------------
// Reading a theme

/**
 * Collect every custom-property declaration in a theme file.
 *
 * Declarations wrap across lines — `--a: var(\n --b\n);` is common in these files — so the value
 * has to be flattened before anything tries to read a `var()` reference out of it. Missing this
 * made the resolver fail silently on exactly the indirections that matter, and the tool reported a
 * three-way tie where the right answer matches every single token.
 *
 * Only the first declaration of each property is kept: the light values come first in the file and
 * the dark ones override later, and a design's variable defs are the light mode unless Figma says
 * otherwise.
 *
 * @param {string} css
 * @returns {Map<string, string>}
 */
export const flattenDeclarations = css => {
  /** @type {Map<string, string>} */
  const declarations = new Map();

  for (const [, name, value] of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    if (!declarations.has(name)) declarations.set(name, value.replace(/\s+/g, ' ').trim());

  return declarations;
};

/**
 * Follow a `var()` chain to the value it ends at.
 *
 * Whitespace inside `var( --name )` is normal once a wrapped declaration has been flattened;
 * requiring `var(--` matched none of them and quietly left every indirection unresolved. A chain
 * that does not terminate within ten hops is returned as it stands rather than looping.
 *
 * @param {Map<string, string>} declarations
 * @returns {(value: string, depth?: number) => string}
 */
export const makeResolver = declarations => {
  /** @type {(value: string, depth?: number) => string} */
  const resolve = (value, depth = 0) => {
    if (depth > 10) return value;

    const reference = value.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+?))?\s*\)$/);
    if (!reference) return value;

    const target = declarations.get(reference[1]);

    return target === undefined ? (reference[2] ?? value) : resolve(target.trim(), depth + 1);
  };

  return resolve;
};

/**
 * Themes indirect through brand layers (`--sl-color-x: var(--sl-brand-light-color-x)`), so a
 * literal comparison would miss everything. Resolve the chain.
 *
 * @param {string} css
 * @returns {Map<string, string>}
 */
export const loadThemeFrom = css => {
  const declarations = flattenDeclarations(css),
    resolve = makeResolver(declarations);

  return new Map([...declarations].map(([name, value]) => [name, resolve(value)]));
};

/** @param {string} file */
export const loadTheme = file => loadThemeFrom(readFileSync(file, 'utf8'));

/**
 * Every theme in the directory that actually ships a `theme.css`, in directory order — which is the
 * order a tie would otherwise be settled by, so it is never allowed to settle one.
 *
 * @param {string} themesDir
 * @returns {{ name: string; theme: Map<string, string> }[]}
 */
export const loadThemes = themesDir =>
  readdirSync(themesDir)
    .map(name => ({ name, file: join(themesDir, name, 'theme.css') }))
    .filter(({ file }) => existsSync(file))
    .map(({ name, file }) => ({ name, theme: loadTheme(file) }));

// ---------------------------------------------------------------------------------------------
// Reading the design

/**
 * The read boundary. Figma's variable defs are a flat object of token path → resolved value; the
 * values are strings for colours and sizes and may be numbers or objects for anything else, so the
 * schema fixes the shape and leaves the value type to the filters below.
 */
export const VariableDefs = z.record(z.string(), z.unknown());

/** @param {string} value */
export const normalise = value => value.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * `color/foreground/bold` is the same token as `--sl-color-foreground-bold`; Figma writes the path
 * with slashes and the theme writes it with dashes.
 *
 * @param {string} token
 */
export const toCustomProperty = token => `--sl-${token.replace(/\//g, '-')}`;

/** @param {Record<string, unknown>} defs @returns {[string, string][]} */
export const colorTokensOf = defs =>
  /** @type {[string, string][]} */ (
    Object.entries(defs).filter(
      ([token, value]) =>
        token.startsWith('color/') && typeof value === 'string' && value.startsWith('#')
    )
  );

/** @param {Record<string, unknown>} defs @returns {[string, string][]} */
export const scalarTokensOf = defs =>
  /** @type {[string, string][]} */ (
    Object.entries(defs).filter(
      ([token, value]) =>
        !token.startsWith('color/') && typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)
    )
  );

/**
 * Every distinct hex in the design, truncated to six digits so an alpha channel does not split one
 * colour into two.
 *
 * @param {Record<string, unknown>} defs
 */
export const hexesOf = defs => [
  ...new Set(
    Object.values(defs)
      .filter(value => typeof value === 'string' && /^#[0-9a-fA-F]{6,8}$/.test(value))
      .map(value => /** @type {string} */ (value).toLowerCase().slice(0, 7))
  )
];

// ---------------------------------------------------------------------------------------------
// Scoring

/** @typedef {{ name: string; theme: Map<string, string> }} LoadedTheme */
/** @typedef {{ theme: string; matched: number; compared: number; score: number }} Score */

/** @param {number} matched @param {number} compared */
const ratio = (matched, compared) => Number((matched / compared).toFixed(3));

/**
 * Name matching: the design and the theme both claim to define this token, so do they agree?
 *
 * @param {[string, string][]} colorTokens
 * @param {LoadedTheme[]} themes
 * @returns {(Score & { mismatches: string[] })[]}
 */
export const scoreByName = (colorTokens, themes) => {
  const results = [];

  for (const { name, theme } of themes) {
    /** @type {string[]} */ const compared = [];
    /** @type {string[]} */ const matched = [];

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
        score: ratio(matched.length, compared.length),
        mismatches: compared.filter(token => !matched.includes(token)).slice(0, 5)
      });
  }

  return results.sort((a, b) => b.score - a.score || b.compared - a.compared);
};

/**
 * Colour is not the only evidence, and sometimes it is not the deciding evidence. Two themes in
 * this corpus are colour-identical and differ only in radii, border widths and fonts — a design
 * bound 10 colour tokens, which tied, and 3 size tokens, which separated them 3:0. A run found that
 * by hand after the tool reported an unbreakable tie.
 *
 * @param {[string, string][]} scalarTokens
 * @param {LoadedTheme[]} themes
 * @returns {Score[]}
 */
export const scoreByScalar = (scalarTokens, themes) => {
  const results = [];

  for (const { name, theme } of themes) {
    /** @type {string[]} */ const compared = [];
    /** @type {string[]} */ const matched = [];

    for (const [token, value] of scalarTokens) {
      const declared = theme.get(toCustomProperty(token));
      if (declared === undefined) continue;

      compared.push(token);
      // Themes write these with a unit; the design reports a bare number.
      if (normalise(declared).replace(/px$/, '') === normalise(value)) matched.push(token);
    }

    if (compared.length)
      results.push({
        theme: name,
        matched: matched.length,
        compared: compared.length,
        score: ratio(matched.length, compared.length)
      });
  }

  return results.sort((a, b) => b.score - a.score || b.compared - a.compared);
};

/**
 * Raw hex agreement, the weaker evidence. Used only when name matching produced nothing usable:
 * several designs in this corpus were drawn against another library and bind `$gray--900`,
 * `Size/300`, `$brand--700`, which no theme declares. For those the tool used to rank nothing and
 * report no theme at all, which is worse than weaker evidence.
 *
 * @param {string[]} hexes
 * @param {LoadedTheme[]} themes
 * @returns {Score[]}
 */
export const scoreByValue = (hexes, themes) => {
  const results = [];

  for (const { name, theme } of themes) {
    const values = new Set([...theme.values()].map(value => normalise(value).slice(0, 7))),
      matched = hexes.filter(hex => values.has(hex));

    results.push({
      theme: name,
      matched: matched.length,
      compared: hexes.length,
      score: hexes.length ? ratio(matched.length, hexes.length) : 0
    });
  }

  return results.sort((a, b) => b.score - a.score);
};

/**
 * Every theme sharing the top score, when that score is above zero. A single leader is not a tie,
 * and a field of zeroes is not a tie either — it is an absence of evidence.
 *
 * @param {Score[]} ranked
 */
export const tiedAtTop = ranked =>
  ranked.length > 1 && ranked[0].score > 0 && ranked[0].score === ranked[1].score
    ? ranked.filter(r => r.score === ranked[0].score).map(r => r.theme)
    : [];

// ---------------------------------------------------------------------------------------------
// Deciding

/** @param {{ defsPath: string; defs: Record<string, unknown>; themes: LoadedTheme[] }} input */
export const decide = ({ defsPath, defs, themes }) => {
  const colorTokens = colorTokensOf(defs),
    scalarTokens = scalarTokensOf(defs),
    anyHexes = hexesOf(defs),
    results = scoreByName(colorTokens, themes),
    byScalar = scoreByScalar(scalarTokens, themes);

  // Only consulted when colour leaves a genuine tie at the top — colour is the stronger signal
  // when it discriminates at all.
  const tiedThemes = tiedAtTop(results),
    colourTied = tiedThemes.length > 0,
    scalarAmongTied = byScalar.filter(r => tiedThemes.includes(r.theme)),
    tieBreak =
      colourTied &&
      scalarAmongTied.length > 1 &&
      scalarAmongTied[0].score > scalarAmongTied[1].score
        ? scalarAmongTied[0]
        : null;

  // A name match is better evidence than a value match — a name carries intent, a hex does not —
  // so this runs only when name matching produced nothing usable. "Nothing usable" has to include
  // the case where the design *has* colour tokens but under another library's paths
  // (`button/primary/outline/idle/background`), which no theme declares: that ranked zero themes
  // and reported no theme at all, which is worse than weaker evidence.
  const nameMatchFailed = !colorTokens.length || !results.length || results[0].score === 0,
    byValue = nameMatchFailed ? scoreByValue(anyHexes, themes) : [];

  // A tie the evidence cannot break has no winner. The sort is stable and the themes arrive in
  // directory order, so naming the first of the tied set is naming an alphabetical accident: one
  // run adopted `itslearning` from exactly that and carried it through six stages.
  const valueTied = nameMatchFailed ? tiedAtTop(byValue) : [],
    unbrokenTie = colourTied && !tieBreak ? tiedThemes : valueTied.length ? valueTied : [];

  const best = unbrokenTie.length
    ? null
    : (tieBreak?.theme ??
      (nameMatchFailed
        ? byValue[0]?.score > 0
          ? byValue[0].theme
          : null
        : results[0]?.score > 0
          ? results[0].theme
          : null) ??
      null);

  return {
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
    // No evidence must not produce a name. With zero comparable tokens every theme scores 0, the
    // sort is stable, and the first theme alphabetically came back as `best`.
    best,
    // Two different reasons for `best: null`, and they ask for different things of a reader. No
    // evidence means go and look at the design; a tie means the evidence is there and does not
    // separate these themes.
    outcome: best ? 'identified' : unbrokenTie.length ? 'tied' : 'no-evidence',
    ...(unbrokenTie.length ? { tiedBetween: unbrokenTie } : {}),
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
    //
    // Whichever method ran has to carry its own bar. A value match never reaches 1.0, because a
    // design always carries a few colours its theme does not define, so it is judged on
    // separation instead: decisive agreement and a runner-up nowhere near it. A tie nothing broke
    // is never confident, whatever the scores say.
    //
    // The name bar used to also require that no other theme scored 1. That clause is now
    // unreachable — a second theme at 1.0 *is* a tie at the top, and a tie either gets broken by
    // the scalars above or lands in `unbrokenTie` and never reaches here. It was removed rather
    // than left in: an unreachable condition in a decision rule reads as a guarantee and is not
    // one, and a mutation test is the only thing that tells the two apart.
    confident: unbrokenTie.length
      ? false
      : tieBreak
        ? true
        : nameMatchFailed
          ? byValue[0]?.compared >= 8 &&
            byValue[0]?.score >= 0.8 &&
            byValue[0]?.score >= 3 * (byValue[1]?.score ?? 0)
          : results[0]?.compared >= 5 && results[0]?.score === 1,
    // Anything short of 1 means the design and the theme disagree about tokens they both claim to
    // define — worth reporting rather than rounding away.
    absoluteAgreement: (nameMatchFailed ? byValue[0]?.score : results[0]?.score) ?? null,
    ranking: results.slice(0, 5)
  };
};

/** @param {{ defsPath: string; themesDir?: string }} options */
export const match = ({ defsPath, themesDir = DEFAULT_THEMES_DIR }) => {
  const defs = VariableDefs.parse(JSON.parse(readFileSync(defsPath, 'utf8'))),
    themes = loadThemes(themesDir);

  if (!themes.length) throw new Error(`no theme declares a theme.css under ${themesDir}`);

  return decide({ defsPath, defs, themes });
};

// ---------------------------------------------------------------------------------------------

/** @param {string} name */
const arg = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

if (import.meta.main) {
  const defsPath = argv[2];

  if (!defsPath || defsPath.startsWith('--')) {
    console.error(
      'usage: theme-match.mjs <figma-variable-defs.json> [--themes <dir>] [--allow-tie]'
    );
    exit(2);
  }

  let report;

  try {
    report = match({ defsPath, themesDir: arg('themes') ?? DEFAULT_THEMES_DIR });
  } catch (error) {
    console.error(`${defsPath}: ${/** @type {Error} */ (error).message}`);
    exit(1);
  }

  console.log(JSON.stringify(report, null, 2));

  // Every colour figure downstream is taken under whatever this reports. A guess is worse than a
  // gap, so an answer the evidence does not carry leaves by a non-zero exit rather than as a
  // theme name a later stage will read as settled.
  if (report.outcome === 'tied' && !argv.includes('--allow-tie')) exit(4);
  if (report.outcome === 'no-evidence') exit(5);
}
