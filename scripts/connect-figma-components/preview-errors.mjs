import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const inputArgs = process.argv.slice(2),
  showAll = inputArgs.includes('--all'),
  args = inputArgs.filter(argument => argument !== '--all'),
  hyperlink = (label, url) => `\x1b]8;;${url}\x07${label}\x1b]8;;\x07`,
  batchCases = new Map();

function loadBatchManifest(filePath) {
  try {
    const manifest = JSON.parse(readFileSync(resolve(process.cwd(), filePath), 'utf8'));
    for (const entry of manifest) {
      for (const component of entry.components ?? []) {
        const nodeId = new URL(component.url).searchParams.get('node-id')?.replace('-', ':');
        if (nodeId) {
          batchCases.set(nodeId, { ...component, templateFile: entry.templateFile });
        }
      }
    }
  } catch {
    // Keep the original preview result when a manifest cannot be read.
  }
}

function getBatchCase(result) {
  if (result.filePath?.endsWith('.figma.batch.json')) {
    if (!batchCases.size) loadBatchManifest(result.filePath);
    return batchCases.get(result.nodeId);
  }
}

function componentName(result, batchCase) {
  if (batchCase?.id) {
    const parameters = Object.entries(batchCase)
      .filter(([key]) => !['id', 'url', 'templateFile'].includes(key))
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');
    return parameters ? `${batchCase.id} (${parameters})` : batchCase.id;
  }

  return (
    result.component ||
    result.templateFile ||
    result.filePath
      ?.split('/')
      .pop()
      ?.replace(/\.figma(?:\.batch)?\.ts$/, '') ||
    'Unknown component'
  );
}

function previewWarnings(result) {
  return [...(result.snippet ?? '').matchAll(/<!--\s*(.*?)\s*-->/g)]
    .map(match => match[1])
    .filter(Boolean);
}

if (!args.includes('--output')) {
  args.push('--output', 'json');
}

const child = spawn('npx', ['figma', 'connect', 'preview', ...args], {
  stdio: ['inherit', 'pipe', 'inherit']
});

let stdout = '';
child.stdout.on('data', chunk => {
  stdout += chunk;
});

child.on('close', code => {
  let results;
  try {
    results = JSON.parse(stdout);
  } catch {
    process.stdout.write(stdout);
    process.exit(code ?? 1);
  }

  const failures = results.filter(result => !result.success),
    displayedResults = showAll
      ? results
      : results.filter(result => !result.success || previewWarnings(result).length > 0);

  if (displayedResults.length === 0) {
    console.log('No mapping issues found.');
  }

  for (const result of displayedResults) {
    const batchCase = getBatchCase(result),
      name = hyperlink(componentName(result, batchCase), result.url),
      template = batchCase?.templateFile,
      warnings = previewWarnings(result);
    const status = result.success ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✕\x1b[0m',
      details = template ? `\n  template: ${template}` : '';

    console.log(`\n${status} ${name}`);
    console.log(`  file: ${result.filePath}`);
    if (details) console.log(details);
    if (result.success) {
      console.log('  Preview succeeded');
      if (warnings.length > 0) {
        console.log(`  \x1b[33mWarning(s): ${warnings.length}\x1b[0m`);
        for (const warning of warnings) console.log(`    ${warning.trim()}`);
      }
    } else {
      const error =
        result.error === 'Failed to render snippet' && batchCase
          ? 'Figma failed to render this batch case'
          : result.error;
      console.log(`  Error: ${error}`);
      if (result.error?.includes("reading 'sections'")) {
        console.log(
          '  Diagnosis: Figma returned no render sections while evaluating this mapping. Check the findInstance/getString lookups and whether the referenced layers still exist.'
        );
      }
    }
  }

  console.log(`\n${failures.length} issue(s) found out of ${results.length} mapping(s).`);
  process.exit(code ?? (failures.length > 0 ? 1 : 0));
});
