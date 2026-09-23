// POC: compare the design tokens a component's Figma node is actually bound to
// against the `--sl-*` custom properties used in that component's stylesheet.
//
// Usage:
//   FIGMA_TOKEN=<figma-personal-access-token> node scripts/check-token-drift.js <component>
//
// Example:
//   FIGMA_TOKEN=figd_xxx node scripts/check-token-drift.js badge
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

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const figmaConnectDir = join(root, 'scripts/connect-figma-components/src');
const componentsDir = join(root, 'packages/components');

const componentName = process.argv[2];
const figmaToken = process.env.FIGMA_TOKEN;

if (!componentName) {
  console.error('Usage: node scripts/check-token-drift.js <component>');
  process.exit(1);
}

if (!figmaToken) {
  console.error('Missing FIGMA_TOKEN environment variable (Figma personal access token).');
  process.exit(1);
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

async function figmaGet(path) {
  const response = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': figmaToken }
  });

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

/** Fetch the Figma variable names bound anywhere in the given node's subtree. */
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

  const { meta } = await figmaGet(`/files/${fileKey}/variables/local`);
  return [...variableIds].map(id => meta.variables[id]?.name).filter(Boolean);
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

async function main() {
  const figmaUrl = findFigmaNodeUrl(componentName);
  const { fileKey, nodeId } = parseFigmaUrl(figmaUrl);
  const stylesheetPath = findStylesheet(componentName);

  console.log(`Component:  ${componentName}`);
  console.log(`Figma node: ${figmaUrl}`);
  console.log(`Stylesheet: ${stylesheetPath}\n`);

  const [figmaTokens, codeTokens] = await Promise.all([
    fetchFigmaTokens(fileKey, nodeId),
    Promise.resolve(extractCodeTokens(stylesheetPath))
  ]);

  const { matched, figmaOnly, codeOnly } = diffTokens(figmaTokens, codeTokens);

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
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
