/**
 * Unit tests for the theme resolver.
 *
 * This tool decides what every colour measurement downstream _means_, and its recorded failure mode
 * is a confident wrong answer rather than an error — a wrong product-name guess, and a three-way
 * tie reported where the right answer matched every token. So the assertions here are about the two
 * things that have actually gone wrong: whether an indirection resolves, and whether the tool is
 * willing to say it does not know.
 *
 * Expected values come from the documented rules and from the corpus, never from the code.
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, it } from 'node:test';

import {
  DEFAULT_THEMES_DIR,
  VariableDefs,
  colorTokensOf,
  decide,
  flattenDeclarations,
  hexesOf,
  loadThemeFrom,
  loadThemes,
  makeResolver,
  match,
  normalise,
  scalarTokensOf,
  scoreByName,
  scoreByScalar,
  scoreByValue,
  tiedAtTop,
  toCustomProperty
} from './theme-match.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(HERE, 'fixtures');
const CORPUS = join(HERE, '..');
const CLI = join(HERE, 'theme-match.mjs');
const exec = promisify(execFile);

/** @param {string} name */
const fixture = name => readFileSync(join(FIXTURES, name), 'utf8');
/** @param {string} slug */
const corpusDefs = slug => join(CORPUS, slug, 'figma-variable-defs.json');

/** A two-theme world, so a ranking can be asserted in full. */
const TEAL = `:root{--sl-color-foreground-bold:#0b7285;--sl-color-border-plain:#dee2e6;--sl-size-200:8px;}`;
const GREEN = `:root{--sl-color-foreground-bold:#2b8a3e;--sl-color-border-plain:#dee2e6;--sl-size-200:4px;}`;
const twoThemes = [
  { name: 'teal', theme: loadThemeFrom(TEAL) },
  { name: 'green', theme: loadThemeFrom(GREEN) }
];

/** Six colours, so the `compared >= 5` confidence bar can be reached and then missed by one. */
const SIX = `:root{
  --sl-color-a:#111111;--sl-color-b:#222222;--sl-color-c:#333333;
  --sl-color-d:#444444;--sl-color-e:#555555;--sl-color-f:#666666;}`;
const sixThemes = [{ name: 'six', theme: loadThemeFrom(SIX) }];
const SIX_EXACT = {
  'color/a': '#111111',
  'color/b': '#222222',
  'color/c': '#333333',
  'color/d': '#444444',
  'color/e': '#555555',
  'color/f': '#666666'
};

describe('flattenDeclarations — a value that wraps is still one value', () => {
  const declarations = flattenDeclarations(fixture('theme-wrapped-declaration.css'));

  it('joins a declaration that wraps across three lines into one line', () => {
    assert.equal(
      declarations.get('--sl-color-foreground-bold'),
      'var( --sl-brand-color-foreground-bold )'
    );
  });

  it('keeps the first declaration, so the light block wins over the dark one', () => {
    assert.equal(
      declarations.get('--sl-color-background-plain'),
      'var( --sl-brand-color-background-plain )'
    );
  });

  it('collapses the runs of whitespace a wrap leaves behind', () => {
    for (const value of declarations.values()) assert.doesNotMatch(value, /\s{2,}|\n/);
  });

  it('finds every property in the fixture, including the ones only referenced', () => {
    assert.ok(declarations.has('--sl-brand-color-foreground-bold'));
    assert.ok(declarations.has('--sl-alias-border'));
    assert.equal(declarations.has('--sl-nothing-declares-this'), false);
  });
});

describe('makeResolver — the chain, which is where the silent miss happened', () => {
  const resolve = makeResolver(flattenDeclarations(fixture('theme-wrapped-declaration.css')));

  it('resolves a wrapped reference, which the old reader left as written', () => {
    assert.equal(resolve('var( --sl-brand-color-foreground-bold )'), '#0b7285');
  });

  it('resolves two hops, the second one wrapped', () => {
    assert.equal(resolve('var(--sl-alias-border)'), '#dee2e6');
  });

  it('takes the fallback when the referenced property is declared nowhere', () => {
    assert.equal(resolve('var(--sl-nothing-declares-this, #adb5bd)'), '#adb5bd');
  });

  it('returns the reference untouched when there is no fallback either', () => {
    assert.equal(resolve('var(--sl-also-undeclared)'), 'var(--sl-also-undeclared)');
  });

  it('caps a cycle instead of looping', () => {
    assert.match(resolve('var(--sl-color-loop-a)'), /^var\(--sl-color-loop-[ab]\)$/);
  });

  it('leaves a literal alone', () => {
    assert.equal(resolve('#0b7285'), '#0b7285');
  });
});

describe('loadThemeFrom — the resolved theme', () => {
  const theme = loadThemeFrom(fixture('theme-wrapped-declaration.css'));

  it('resolves the wrapped declaration to its literal', () => {
    assert.equal(theme.get('--sl-color-foreground-bold'), '#0b7285');
  });

  it('resolves a forward reference, because the file is collected before anything resolves', () => {
    assert.equal(theme.get('--sl-color-background-plain'), '#ffffff');
  });

  it('REGRESSION: the old line-by-line read would leave these unresolved', () => {
    // The whole point of the fixture: every one of these is a `var()` in the source and a literal
    // after resolution. A resolver that failed to flatten returned the `var()` text and matched
    // nothing, which is how a three-way tie was reported for a design that matched one theme
    // exactly.
    for (const property of [
      '--sl-color-foreground-bold',
      '--sl-color-background-plain',
      '--sl-color-border-plain',
      '--sl-color-foreground-disabled'
    ])
      assert.match(
        String(theme.get(property)),
        /^#[0-9a-f]{6}$/,
        `${property} did not resolve to a literal`
      );
  });

  it('keeps a scalar with its unit', () => {
    assert.equal(theme.get('--sl-size-200'), '8px');
  });
});

describe('reading the design', () => {
  const defs = {
    'color/foreground/bold': '#0b7285',
    'color/background/plain': '#FFFFFF',
    'color/not-a-hex': 'rgba(0,0,0,.5)',
    'size/200': '8',
    'size/negative': '-4',
    'spacing/loose': '12.5',
    'font/family': 'Inter',
    count: 7
  };

  it('takes only colour tokens whose value is a hex', () => {
    assert.deepEqual(
      colorTokensOf(defs).map(([token]) => token),
      ['color/foreground/bold', 'color/background/plain']
    );
  });

  it('takes only non-colour tokens whose value is a bare number, signed or fractional', () => {
    assert.deepEqual(
      scalarTokensOf(defs).map(([token]) => token),
      ['size/200', 'size/negative', 'spacing/loose']
    );
  });

  it('collects distinct hexes, lowercased and stripped of alpha', () => {
    assert.deepEqual(hexesOf({ a: '#0B7285', b: '#0b7285ff', c: '#FFFFFF', d: 'Inter' }), [
      '#0b7285',
      '#ffffff'
    ]);
  });

  it('translates a Figma token path into the custom property a theme declares', () => {
    assert.equal(toCustomProperty('color/foreground/bold'), '--sl-color-foreground-bold');
  });

  it('compares values case- and whitespace-insensitively', () => {
    assert.equal(normalise('  #FFFFFF  '), '#ffffff');
    assert.equal(normalise('0 1px  2px'), '0 1px 2px');
  });

  it('accepts a flat object at the boundary', () => {
    assert.deepEqual(VariableDefs.parse({ 'color/x': '#fff' }), { 'color/x': '#fff' });
  });

  it('NEGATIVE CONTROL: rejects a defs file that is an array, not an object', () => {
    assert.throws(() => VariableDefs.parse([{ 'color/x': '#fff' }]));
  });
});

describe('scoreByName — only tokens both sides declare are compared', () => {
  it('scores a theme that agrees on everything at 1', () => {
    const [top] = scoreByName(
      [
        ['color/foreground/bold', '#0b7285'],
        ['color/border/plain', '#dee2e6']
      ],
      twoThemes
    );

    assert.deepEqual(top, {
      theme: 'teal',
      matched: 2,
      compared: 2,
      score: 1,
      mismatches: []
    });
  });

  it('counts a token the theme does not declare as neither matched nor compared', () => {
    const [top] = scoreByName([['color/unknown/token', '#0b7285']], twoThemes);

    assert.equal(top, undefined);
  });

  it('names the tokens it disagreed about, so the verdict can be audited', () => {
    const ranked = scoreByName([['color/foreground/bold', '#0b7285']], twoThemes),
      green = ranked.find(r => r.theme === 'green');

    assert.deepEqual(green?.mismatches, ['color/foreground/bold']);
    assert.equal(green?.score, 0);
  });

  it('orders by score, then by how much evidence there was', () => {
    assert.deepEqual(
      scoreByName(
        [
          ['color/foreground/bold', '#0b7285'],
          ['color/border/plain', '#dee2e6']
        ],
        twoThemes
      ).map(r => r.theme),
      ['teal', 'green']
    );
  });
});

describe('scoreByScalar — the evidence that separates colour-identical themes', () => {
  it('matches a bare number against a theme value carrying px', () => {
    const [top] = scoreByScalar([['size/200', '8']], twoThemes);

    assert.deepEqual(top, { theme: 'teal', matched: 1, compared: 1, score: 1 });
  });

  it('separates two themes that agree on every colour', () => {
    assert.deepEqual(
      scoreByScalar([['size/200', '4']], twoThemes).map(r => [r.theme, r.score]),
      [
        ['green', 1],
        ['teal', 0]
      ]
    );
  });
});

describe('scoreByValue — weaker evidence, used only when names fail', () => {
  it('scores the share of the design’s hexes a theme declares anywhere', () => {
    assert.deepEqual(
      scoreByValue(['#0b7285', '#dee2e6'], twoThemes).map(r => [r.theme, r.score]),
      [
        ['teal', 1],
        ['green', 0.5]
      ]
    );
  });

  it('counts how many of the design’s hexes the theme actually declares', () => {
    assert.deepEqual(
      scoreByValue(['#0b7285', '#dee2e6', '#000000'], twoThemes).map(r => [
        r.theme,
        r.matched,
        r.compared
      ]),
      [
        ['teal', 2, 3],
        ['green', 1, 3]
      ]
    );
  });

  it('scores zero rather than dividing by zero when the design has no hex at all', () => {
    for (const row of scoreByValue([], twoThemes)) assert.equal(row.score, 0);
  });
});

describe('tiedAtTop — a tie is two leaders, not a field of zeroes', () => {
  it('names every theme sharing the top score', () => {
    assert.deepEqual(
      tiedAtTop([
        { theme: 'a', matched: 1, compared: 1, score: 1 },
        { theme: 'b', matched: 1, compared: 1, score: 1 },
        { theme: 'c', matched: 0, compared: 1, score: 0 }
      ]),
      ['a', 'b']
    );
  });

  it('is not a tie when one theme leads', () => {
    assert.deepEqual(
      tiedAtTop([
        { theme: 'a', matched: 1, compared: 1, score: 1 },
        { theme: 'b', matched: 0, compared: 1, score: 0 }
      ]),
      []
    );
  });

  it('is an absence of evidence, not a tie, when everything scores zero', () => {
    assert.deepEqual(
      tiedAtTop([
        { theme: 'a', matched: 0, compared: 1, score: 0 },
        { theme: 'b', matched: 0, compared: 1, score: 0 }
      ]),
      []
    );
  });

  it('is not a tie with a single theme in the field', () => {
    assert.deepEqual(tiedAtTop([{ theme: 'a', matched: 1, compared: 1, score: 1 }]), []);
  });
});

describe('decide — what the tool is willing to assert', () => {
  /** @param {Record<string, unknown>} defs */
  const run = defs => decide({ defsPath: 'test', defs, themes: twoThemes });

  it('identifies a theme that agrees on every token it declares', () => {
    const report = run({ 'color/foreground/bold': '#0b7285', 'color/border/plain': '#dee2e6' });

    assert.equal(report.best, 'teal');
    assert.equal(report.outcome, 'identified');
    assert.equal(report.method, 'token-name');
    assert.equal(report.evidence, 'token names');
    assert.equal(report.absoluteAgreement, 1);
  });

  it('NEGATIVE CONTROL: refuses to break a tie by directory order', () => {
    // Both themes declare `--sl-color-border-plain: #dee2e6`, so name matching ties at 1.0 and
    // the design binds no scalar to separate them. Naming the first is naming an accident.
    const report = run({ 'color/border/plain': '#dee2e6' });

    assert.equal(report.best, null);
    assert.equal(report.outcome, 'tied');
    assert.deepEqual(report.tiedBetween, ['teal', 'green']);
    assert.equal(report.confident, false);
  });

  it('breaks that same tie once the design binds a scalar that separates them', () => {
    const report = run({ 'color/border/plain': '#dee2e6', 'size/200': '4' });

    assert.equal(report.best, 'green');
    assert.equal(report.outcome, 'identified');
    assert.equal(report.tieBrokenBy, 'scalar tokens: green 1/1');
    assert.equal(report.confident, true);
  });

  it('says so when the scalars do not separate them either', () => {
    const report = run({ 'color/border/plain': '#dee2e6', 'size/999': '4' });

    assert.equal(report.outcome, 'tied');
    assert.match(String(report.tieBrokenBy), /^not broken/);
  });

  it('NEGATIVE CONTROL: reports no evidence rather than naming the first theme', () => {
    const report = run({ '$brand--700': '#010203' });

    assert.equal(report.best, null);
    assert.equal(report.outcome, 'no-evidence');
    assert.equal(report.confident, false);
  });

  it('falls back to hex values when the design speaks another library’s vocabulary', () => {
    const report = run({ '$brand--700': '#0b7285', '$gray--100': '#dee2e6' });

    assert.equal(report.method, 'hex-value-fallback');
    assert.equal(report.evidence, 'hex values');
    assert.equal(report.best, 'teal');
    assert.match(String(report.note), /weaker evidence/);
  });

  it('is confident only when a name match is exact — five of six is not identified', () => {
    const exact = decide({ defsPath: 't', defs: SIX_EXACT, themes: sixThemes }),
      offByOne = decide({
        defsPath: 't',
        defs: { ...SIX_EXACT, 'color/f': '#999999' },
        themes: sixThemes
      });

    assert.equal(exact.confident, true);
    assert.equal(exact.absoluteAgreement, 1);

    // Six comparable tokens clears the evidence bar, and the design still disagrees with the
    // theme about one of them. A theme that is nearly right is a theme that is wrong.
    assert.equal(offByOne.confident, false);
    assert.equal(offByOne.absoluteAgreement, 0.833);
    assert.equal(offByOne.best, 'six');
  });

  it('falls back to hex values when the names are right and every value disagrees', () => {
    // The design binds design-system token names, so `colorTokensOf` is not empty and the
    // ranking is not empty — but the top score is zero, which is no evidence at all. Staying on
    // the name method here would report a theme the design agrees with about nothing.
    const report = decide({
      defsPath: 't',
      defs: { 'color/a': '#aaaaaa', 'color/b': '#bbbbbb', 'color/c': '#111111' },
      themes: sixThemes
    });

    assert.equal(report.method, 'hex-value-fallback');
    assert.equal(report.evidence, 'hex values');
    assert.equal(report.ranking[0].score, 0);
  });

  it('never calls a value match confident on thin evidence', () => {
    // The value bar is eight comparable hexes; two cannot clear it however well they agree.
    const report = run({ $a: '#0b7285', $b: '#dee2e6' });

    assert.equal(report.confident, false);
  });

  it('is not confident when a second theme also agrees on everything', () => {
    const report = run({ 'color/border/plain': '#dee2e6', 'size/200': '4' });

    assert.equal(report.ranking.filter(r => r.score === 1).length, 2);
    // Confident here only because the scalar broke the tie — never from the colour ranking.
    assert.equal(report.tieBrokenBy, 'scalar tokens: green 1/1');
  });
});

describe('the corpus: the pairing that overturned the product-name guess', () => {
  const themes = loadThemes(join(CORPUS, '..', 'packages', 'themes'));

  /** @param {string} slug */
  const report = slug =>
    decide({
      defsPath: slug,
      defs: VariableDefs.parse(JSON.parse(readFileSync(corpusDefs(slug), 'utf8'))),
      themes
    });

  it('a2-nsp-class-overview resolves to sanoma-learning, not the guessed sanoma-pro', () => {
    const r = report('2026-10-01-a2-nsp-class-overview');

    assert.equal(r.best, 'sanoma-learning');
    assert.equal(r.method, 'token-name');
    assert.equal(r.absoluteAgreement, 1);
    assert.equal(r.confident, true);
  });

  it('a8-nsp-group-list resolves to max — a different theme, same product', () => {
    const r = report('2026-10-01-a8-nsp-group-list');

    assert.equal(r.best, 'max');
    assert.equal(r.method, 'token-name');
    assert.equal(r.confident, true);
  });

  it('so the theme is not a property of the product name', () => {
    assert.notEqual(
      report('2026-10-01-a2-nsp-class-overview').best,
      report('2026-10-01-a8-nsp-group-list').best
    );
  });

  it('b-nsp-home agrees with a2, which is the same Figma file', () => {
    assert.equal(report('2026-10-01-b-nsp-home').best, 'sanoma-learning');
  });

  it('a3-myportal-digital-exercises is a colour tie the scalars do break', () => {
    const r = report('2026-10-01-a3-myportal-digital-exercises');

    assert.deepEqual(r.colourTiedBetween, ['bingel-dc', 'bingel-int']);
    assert.equal(r.best, 'bingel-int');
    assert.match(String(r.tieBrokenBy), /^scalar tokens: bingel-int/);
  });

  it('every theme in the repository that ships a theme.css is loaded', () => {
    assert.ok(themes.length >= 15, `only ${themes.length} themes loaded`);
    assert.ok(themes.every(t => t.theme.size > 0));
  });
});

describe('NEGATIVE CONTROL: the CLI leaves by a non-zero exit when it does not know', () => {
  it('exits 4 on a tie, after printing the report that names it', async () => {
    await assert.rejects(
      () => exec(process.execPath, [CLI, join(FIXTURES, 'variable-defs-tie.json')]),
      /** @param {any} error */ error => {
        assert.equal(error.code, 4);

        const report = JSON.parse(error.stdout);

        assert.equal(report.outcome, 'tied');
        assert.equal(report.best, null);
        assert.deepEqual(report.tiedBetween, ['bingel-dc', 'bingel-int']);
        return true;
      }
    );
  });

  it('exits 0 on that same tie when the operator accepts it', async () => {
    const { stdout } = await exec(process.execPath, [
      CLI,
      join(FIXTURES, 'variable-defs-tie.json'),
      '--allow-tie'
    ]);

    assert.equal(JSON.parse(stdout).outcome, 'tied');
  });

  it('exits 5 when no theme matches at all', async () => {
    await assert.rejects(
      () => exec(process.execPath, [CLI, join(FIXTURES, 'variable-defs-no-match.json')]),
      /** @param {any} error */ error => {
        assert.equal(error.code, 5);
        assert.equal(JSON.parse(error.stdout).outcome, 'no-evidence');
        return true;
      }
    );
  });

  it('exits 0 and names a theme for a run the evidence settles', async () => {
    const { stdout } = await exec(process.execPath, [
      CLI,
      corpusDefs('2026-10-01-a8-nsp-group-list')
    ]);

    assert.equal(JSON.parse(stdout).best, 'max');
  });

  it('exits 2 with usage when given no defs file', async () => {
    await assert.rejects(
      () => exec(process.execPath, [CLI]),
      /** @param {any} error */ error => {
        assert.equal(error.code, 2);
        assert.match(error.stderr, /usage:/);
        return true;
      }
    );
  });

  it('NEGATIVE CONTROL: exits 1 when the themes directory holds no theme at all', async () => {
    await assert.rejects(
      () =>
        exec(process.execPath, [
          CLI,
          corpusDefs('2026-10-01-a8-nsp-group-list'),
          '--themes',
          FIXTURES
        ]),
      /** @param {any} error */ error => {
        assert.equal(error.code, 1);
        assert.match(error.stderr, /no theme declares a theme\.css/);
        return true;
      }
    );
  });
});

describe('match — the boundary is validated before anything is scored', () => {
  it('NEGATIVE CONTROL: refuses a defs file that is a top-level array, naming the shape', () => {
    // `course-files-components.json` is a real capture, and it is a list. zod names what it
    // expected; the hand-written reader would have iterated its keys and scored zero.
    assert.throws(
      () => match({ defsPath: join(FIXTURES, 'course-files-components.json') }),
      error => {
        assert.ok(Array.isArray(/** @type {any} */ (error).issues), 'not a zod error');
        return true;
      }
    );
  });

  it('defaults the themes directory to the repository’s', () => {
    assert.equal(DEFAULT_THEMES_DIR, 'packages/themes');
  });
});
