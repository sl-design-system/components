/**
 * Checks that every `--sl-*` custom property a run references actually exists in its theme.
 *
 * Nothing else in the pipeline does. An undefined `var(--sl-nonexistent)` is not an error: the
 * browser drops the whole declaration and paints the fallback, so the type check passes, the
 * capture succeeds, and the element is simply the wrong colour or size. Two runs invented tokens
 * this way — one analyst asserted four that do not exist, another asserted
 * `--sl-color-background-plain` and carried it into three implementer briefs before the
 * implementers caught it by hand.
 *
 * This is the same failure shape as the `font:` shorthand drop, and it is mechanically checkable,
 * which is the whole argument for checking it mechanically.
 *
 * Usage: node runs/harness/check-tokens.mjs --scope examples/lit/src/_runs/<slug> --theme <theme>
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { argv, exit } from 'node:process';

const arg = name => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

const scope = arg('scope'),
  theme = arg('theme');

if (!scope || !theme) {
  console.error('usage: check-tokens.mjs --scope <path> --theme <theme-name>');
  exit(2);
}

const walk = dir =>
  readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

// A declaration may wrap across lines, and so may a reference — `var(\n  --sl-x\n)`. Flattening
// first is not cosmetic: without it the matcher reads a truncated name and reports a token that
// does exist as invented. The theme matcher had the identical bug, which is why it is worth
// naming twice.
const flatten = text => text.replace(/\s+/g, ' ');

// Comments routinely *name* a token in order to warn against it — one run's CSS carries
// `font: var(--sl-text-new-*)` inside a comment explaining why not to write it. Scanning comments
// turns that warning into a false accusation, so strip them first.
const stripComments = text => text.replace(/\/\*[\s\S]*?\*\//g, ' ');

// Two legitimate sources declare `--sl-*` names: the theme, and a component's own CSS, where
// properties like `--sl-icon-size` are a documented part of the component's API. Checking only
// the theme reports every component API as invented.
const themeFile = `packages/themes/${theme}/theme.css`,
  declared = new Set();

for (const [, name] of flatten(stripComments(readFileSync(themeFile, 'utf8'))).matchAll(
  /(--sl-[\w-]+)\s*:/g
))
  declared.add(name);

const componentsDir = 'packages/components',
  componentReads = new Set();

for (const pkg of readdirSync(componentsDir)) {
  const src = join(componentsDir, pkg, 'src');
  if (!existsSync(src)) continue;

  for (const file of walk(src).filter(path => path.endsWith('.css'))) {
    const css = flatten(stripComments(readFileSync(file, 'utf8')));

    for (const [, name] of css.matchAll(/(--sl-[\w-]+)\s*:/g)) declared.add(name);

    // A component may only ever *read* a property, expecting its host to set it —
    // `--sl-grid-width` is declared nowhere and consumed by `sl-grid`. That is a real part of the
    // component's contract. But it cannot be a blanket amnesty: two shipped components read a
    // bare `--sl-text-new-*` family that does not exist, so treating every component read as
    // valid would let the design system's own bug certify a run that copied it. Kept separate.
    for (const [, name] of css.matchAll(/var\(\s*(--sl-[\w-]+)/g)) componentReads.add(name);
  }
}

const files = walk(scope).filter(path => /\.(css|ts)$/.test(path)),
  referenced = new Map();

// `var(--a, var(--b))` is only a problem if **neither** resolves. Reading just the first name
// would convict `sl-checkbox`, which guards its new-namespace token with an older one — and
// absolve nothing, since here the guard is undefined too. Either way the distinction has to be
// made by looking, not assumed.
const resolvableNames = reference => {
  const names = [...reference.matchAll(/(--sl-[\w-]+)/g)].map(m => m[1]);
  return { names, anyDeclared: names.some(name => declared.has(name)) };
};

for (const file of files) {
  const css = flatten(stripComments(readFileSync(file, 'utf8')));

  // Match a whole `var(...)` including a nested fallback, so the fallback travels with the name.
  for (const [, body] of css.matchAll(/var\((\s*--sl-[\w-]+[^;{}]*?)\)(?=[;\s)}])/g)) {
    const { names, anyDeclared } = resolvableNames(body);
    if (anyDeclared || !names.length) continue;

    const token = names[0],
      entry = referenced.get(token) ?? referenced.set(token, []).get(token);

    entry.push(file);
  }
}

const undeclared = [...referenced];

// The most repeated defect in the batch, and the one worth naming rather than lumping in: the
// theme declares `--sl-text-new-body-md-fontSize` and friends but no bare `--sl-text-new-body-md`,
// so `font: var(--sl-text-new-body-md)` silently drops the entire declaration. A token with
// longhand siblings and no declaration of its own is this trap, never a host-settable API.
const hasLonghandSiblings = token => [...declared].some(name => name.startsWith(`${token}-`));

const shorthandTrap = undeclared
    .filter(([token]) => hasLonghandSiblings(token))
    .map(([token, where]) => ({
      token,
      longhands: [...declared].filter(name => name.startsWith(`${token}-`)).slice(0, 4),
      files: [...new Set(where)]
    })),
  trapped = new Set(shorthandTrap.map(entry => entry.token)),
  // Read by a component but declared nowhere: most likely a host-settable API, so reported rather
  // than failed — a reviewer can tell which in seconds, and a false failure gets a check ignored.
  hostSettable = undeclared
    .filter(([token]) => !trapped.has(token) && componentReads.has(token))
    .map(([token]) => token),
  missing = undeclared
    .filter(([token]) => !trapped.has(token) && !componentReads.has(token))
    .map(([token, where]) => ({ token, files: [...new Set(where)] }));

const report = {
  scope,
  theme,
  themeFile,
  tokensReferenced: referenced.size,
  missing,
  shorthandTrap,
  hostSettable,
  verdict: missing.length ? 'invented-tokens' : shorthandTrap.length ? 'shorthand-trap' : 'clean'
};

console.log(JSON.stringify(report, null, 2));
exit(missing.length || shorthandTrap.length ? 1 : 0);
