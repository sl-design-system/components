// POC: compare the design tokens a component's Figma node is actually bound to
// against the `--sl-*` custom properties used in that component's stylesheet.
//
// Usage:
//   FIGMA_TOKEN=<figma-personal-access-token> node scripts/check-token-drift.js [component]
//
// Examples:
//   FIGMA_TOKEN=figd_xxx node scripts/check-token-drift.js badge   # single component
//   FIGMA_TOKEN=figd_xxx node scripts/check-token-drift.js         # every mapped component
//
// If the Variables API isn't available (e.g. no Enterprise plan), pass --paste with a single
// component and pipe in variable names copied from Figma Dev Mode's Inspect panel instead —
// no FIGMA_TOKEN or network call needed, one name per line or comma-separated:
//   pbpaste | node scripts/check-token-drift.js badge --paste
//
// Notes / limitations (this is a proof of concept, not a CI gate):
// - Requires a Figma personal access token with read access to the design file
//   (https://www.figma.com/developers/api#access-tokens). The repo already has
//   FIGMA_AUTH_TOKEN wired into CI as a secret for other Figma jobs.
// - Figma variable names (e.g. `color/foreground/accent/grey/onBold`) and our
//   `--sl-*` custom property names (e.g. `--sl-color-foreground-accent-grey-onBold`)
//   are produced by two independent processes (Token Studio sync vs. style-dictionary),
//   so this script does a normalized "bag of words" comparison rather than an exact
//   string match. Treat "no match" results as leads to investigate, not proven bugs.
// - Runs informationally: it never exits non-zero, since a mismatch here isn't
//   proof of a bug given the fuzzy matching above.

import { appendFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const figmaConnectDir = join(root, 'scripts/connect-figma-components/src');
const componentsDir = join(root, 'packages/components');

const requestedComponent = process.argv[2];
const pasteMode = process.argv.includes('--paste');
const figmaToken = process.env.FIGMA_TOKEN;
// Once true, stop retrying the Variables API for the rest of the run (same token, same outcome).
let variablesApiUnavailable = false;

if (pasteMode && !requestedComponent) {
  console.error(
    '--paste requires a single component: node scripts/check-token-drift.js <component> --paste'
  );
  process.exit(1);
}

if (!pasteMode && !figmaToken) {
  console.error('Missing FIGMA_TOKEN environment variable (Figma personal access token).');
  process.exit(1);
}

/** Read Figma variable names pasted via stdin, one per line or comma-separated. */
function readPastedTokens() {
  return readFileSync(0, 'utf8')
    .split(/[\n,]/)
    .map(token => token.trim())
    .filter(Boolean);
}

/**
 * Every component with a single-instance Code Connect mapping (`*.figma.ts`, not
 * `.figma.batch.ts`).
 */
function discoverComponents() {
  return readdirSync(figmaConnectDir)
    .filter(file => file.endsWith('.figma.ts') && !file.endsWith('.figma.batch.ts'))
    .map(file => file.replace(/\.figma\.ts$/, ''))
    .sort();
}

/** Find the `// url=...` Figma node URL for a component's Code Connect file. */
function findFigmaNodeUrl(name) {
  const candidate = join(figmaConnectDir, `${name}.figma.ts`);
  let contents;
  try {
    contents = readFileSync(candidate, 'utf8');
  } catch {
    throw new Error(`No Code Connect file found for "${name}" at ${candidate}`);
  }

  const match = contents.match(/\/\/\s*url=(\S+)/);
  if (!match) {
    throw new Error(`No "// url=" comment found in ${candidate}`);
  }

  return match[1];
}

/** Parse a Figma design URL into a file key and dash-separated node id. */
function parseFigmaUrl(url) {
  const { pathname, searchParams } = new URL(url);
  const fileKey = pathname
    .split('/')
    .find((_segment, index, segments) => segments[index - 1] === 'design');
  const nodeId = searchParams.get('node-id');

  if (!fileKey || !nodeId) {
    throw new Error(`Could not parse file key / node id from ${url}`);
  }

  return { fileKey, nodeId: nodeId.replace('-', ':') };
}

/** Find the component's stylesheet source (.scss preferred, falls back to .css). */
function findStylesheet(name) {
  const srcDir = join(componentsDir, name, 'src');
  const files = readdirSync(srcDir);
  const stylesheet =
    files.find(file => file === `${name}.scss`) ?? files.find(file => file === `${name}.css`);

  if (!stylesheet) {
    throw new Error(`No stylesheet found for "${name}" in ${srcDir}`);
  }

  return join(srcDir, stylesheet);
}

/** Extract every unique `--sl-*` custom property referenced via var(...). */
function extractCodeTokens(stylesheetPath) {
  const contents = readFileSync(stylesheetPath, 'utf8');
  const matches = contents.matchAll(/var\(\s*(--sl-[\w-]+)/g);
  return [...new Set([...matches].map(([, token]) => token))];
}

/** Thrown for 401/403 responses, which indicate a bad/scoped token rather than a per-node problem. */
class FigmaAuthError extends Error {}

async function figmaGet(path) {
  const response = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': figmaToken }
  });

  if (response.status === 401 || response.status === 403) {
    throw new FigmaAuthError(
      `Figma API ${path} responded with ${response.status} ${response.statusText}. ` +
        'Check that FIGMA_TOKEN is set, has "File content: Read" scope, and its owner has access to this file.'
    );
  }

  if (!response.ok) {
    throw new Error(`Figma API ${path} responded with ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/** Recursively collect every variable id bound anywhere within a Figma node. */
function collectBoundVariableIds(node, ids = new Set()) {
  if (node?.boundVariables) {
    for (const binding of Object.values(node.boundVariables)) {
      for (const entry of Array.isArray(binding) ? binding : [binding]) {
        if (entry?.id) ids.add(entry.id);
      }
    }
  }

  for (const child of node?.children ?? []) {
    collectBoundVariableIds(child, ids);
  }

  return ids;
}

/**
 * Fetch the Figma variable names bound anywhere in the given node's subtree. Falls back to raw
 * `unresolved:<id>` entries if the Variables API isn't accessible (e.g. a non-Enterprise plan),
 * instead of failing the whole run.
 */
async function fetchFigmaTokens(fileKey, nodeId) {
  const { nodes } = await figmaGet(`/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`);
  const node = nodes[nodeId]?.document;
  if (!node) {
    throw new Error(`Node ${nodeId} not found in file ${fileKey}`);
  }

  const variableIds = collectBoundVariableIds(node);
  if (variableIds.size === 0) {
    return [];
  }

  if (variablesApiUnavailable) {
    return [...variableIds].map(id => `unresolved:${id}`);
  }

  try {
    const { meta } = await figmaGet(`/files/${fileKey}/variables/local`);
    return [...variableIds].map(id => meta.variables[id]?.name ?? `unresolved:${id}`);
  } catch (error) {
    if (!(error instanceof FigmaAuthError)) throw error;
    variablesApiUnavailable = true;
    console.error(
      'Warning: Variables API is not accessible (requires Enterprise plan + "Variables: Read" scope). ' +
        'Falling back to reporting unresolved variable IDs — matching against code tokens will not be possible.\n'
    );
    return [...variableIds].map(id => `unresolved:${id}`);
  }
}

/**
 * Normalize a token name (Figma `color/foreground/onBold` or CSS `--sl-color-foreground-onBold`)
 * into a sorted, lowercased bag of words so the two naming schemes can be compared loosely.
 */
function normalize(tokenName) {
  return tokenName
    .replace(/^--sl-/, '')
    .split(/[\s/.-]+/)
    .flatMap(segment => segment.split(/(?<=[a-z0-9])(?=[A-Z])/))
    .map(word => word.toLowerCase())
    .filter(Boolean)
    .sort()
    .join('-');
}

function diffTokens(figmaTokens, codeTokens) {
  const figmaByNormalized = new Map(figmaTokens.map(token => [normalize(token), token]));
  const codeByNormalized = new Map(codeTokens.map(token => [normalize(token), token]));

  const matched = [];
  const figmaOnly = [];
  const codeOnly = [];

  for (const [key, figmaToken] of figmaByNormalized) {
    const codeToken = codeByNormalized.get(key);
    if (codeToken) {
      matched.push([figmaToken, codeToken]);
    } else {
      figmaOnly.push(figmaToken);
    }
  }

  for (const [key, codeToken] of codeByNormalized) {
    if (!figmaByNormalized.has(key)) {
      codeOnly.push(codeToken);
    }
  }

  return { matched, figmaOnly, codeOnly };
}

/** Run the drift check for a single component. Returns null (and logs why) if it can't be checked. */
async function checkComponent(name) {
  const figmaUrl = findFigmaNodeUrl(name);
  const stylesheetPath = findStylesheet(name);
  const codeTokens = extractCodeTokens(stylesheetPath);

  const figmaTokens = pasteMode
    ? readPastedTokens()
    : await fetchFigmaTokens(...Object.values(parseFigmaUrl(figmaUrl)));

  return { name, figmaUrl, stylesheetPath, ...diffTokens(figmaTokens, codeTokens) };
}

function printReport({ name, figmaUrl, stylesheetPath, matched, figmaOnly, codeOnly }) {
  console.log(`## ${name}`);
  console.log(`Figma node: ${figmaUrl}`);
  console.log(`Stylesheet: ${stylesheetPath}\n`);

  console.log(`Matched (${matched.length}):`);
  for (const [figmaToken, codeToken] of matched) {
    console.log(`  ${figmaToken}  <->  ${codeToken}`);
  }

  console.log(`\nBound in Figma but not found in code (${figmaOnly.length}):`);
  for (const token of figmaOnly) {
    console.log(`  ${token}`);
  }

  console.log(`\nUsed in code but not bound in this Figma node (${codeOnly.length}):`);
  for (const token of codeOnly) {
    console.log(`  ${token}`);
  }
  console.log('');
}

/** Append a GitHub Actions step summary when running in CI (no-op locally). */
function writeStepSummary(results, failures) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  const rows = results.map(
    ({ name, matched, figmaOnly, codeOnly }) =>
      `| ${name} | ${matched.length} | ${figmaOnly.length} | ${codeOnly.length} |`
  );
  const failureRows = failures.map(({ name, error }) => `| ${name} | ${error} |`);

  appendFileSync(
    summaryPath,
    [
      '# Token drift report',
      '',
      '| Component | Matched | Figma only | Code only |',
      '| --- | --- | --- | --- |',
      ...rows,
      '',
      ...(failureRows.length
        ? ['## Skipped', '', '| Component | Reason |', '| --- | --- |', ...failureRows]
        : [])
    ].join('\n') + '\n'
  );
}

async function main() {
  const componentNames = requestedComponent ? [requestedComponent] : discoverComponents();
  const results = [];
  const failures = [];

  for (const name of componentNames) {
    try {
      const result = await checkComponent(name);
      printReport(result);
      results.push(result);
    } catch (error) {
      if (error instanceof FigmaAuthError) {
        // Same token for every component, so this will fail identically for all of them — stop early.
        throw error;
      }
      console.error(`Skipping "${name}": ${error.message}\n`);
      failures.push({ name, error: error.message });
    }
  }

  writeStepSummary(results, failures);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
