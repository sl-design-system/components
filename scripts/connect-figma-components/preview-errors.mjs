import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { validateMappingNames } from './validate-mapping-names.mjs';
import { validateSnippet } from './validate-snippet.mjs';

const inputArgs = process.argv.slice(2),
  showAll = inputArgs.includes('--all'),
  reportPath = getReportPath(inputArgs),
  args = stripWrapperArgs(inputArgs),
  hyperlink = (label, url) => `\x1b]8;;${url}\x07${label}\x1b]8;;\x07`,
  batchCases = new Map();

function getReportPath(args) {
  const reportArg = args.find(argument => argument.startsWith('--report='));
  if (reportArg) return reportArg.slice('--report='.length);

  const reportIndex = args.indexOf('--report');
  return reportIndex === -1 ? undefined : args[reportIndex + 1];
}

function stripWrapperArgs(args) {
  const stripped = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--all' || argument.startsWith('--report=')) continue;
    if (argument === '--report') {
      index += 1;
      continue;
    }

    stripped.push(argument);
  }

  return stripped;
}

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

function mappingNameWarnings(result, batchCase) {
  const filePath = batchCase?.templateFile
    ? join(dirname(result.filePath), batchCase.templateFile)
    : result.filePath;

  return validateMappingNames(filePath);
}

// Only successful mappings produce a snippet to check against the real component API.
function codeIssues(result) {
  return result.success ? validateSnippet(result.snippet ?? '') : [];
}

function markdownEscape(text) {
  return String(text).replaceAll('|', '\\|').replaceAll('\n', '<br>');
}

function markdownList(label, items) {
  if (!items || items.length === 0) return [];

  return items
    .filter(item => (item || '').trim() !== '')
    .map(item => `${label} ${markdownEscape(item)}`);
}

function writeReport(filePath, annotated, failures) {
  const warnings = annotated.filter(({ warnings }) => warnings.length > 0),
    invalidCode = annotated.filter(({ invalidCode }) => invalidCode.length > 0),
    sorted = [...annotated].sort((a, b) =>
      componentName(a.result, a.batchCase).localeCompare(
        componentName(b.result, b.batchCase),
        undefined,
        {
          sensitivity: 'base'
        }
      )
    ),
    rows = sorted.map(({ batchCase, result, warnings, invalidCode }) => {
      const name = componentName(result, batchCase),
        status = result.success && invalidCode.length === 0 ? 'PASS' : 'FAIL',
        template = batchCase?.templateFile,
        errors = result.success
          ? []
          : [
              result.error === 'Failed to render snippet' && batchCase
                ? 'Figma failed to render this batch case'
                : result.error
            ],
        notices = [
          ...markdownList('⛔️', errors),
          ...markdownList('⚠️', warnings),
          ...markdownList('🖥️', invalidCode)
        ].join('<br>');

      return `| ${status === 'PASS' ? (warnings.length > 0 ? '🟡' : '🟢') : '🔴'} | [${markdownEscape(name)}](${result.url}) | ${template ? markdownEscape(template) : markdownEscape(result.filePath)} | ${notices} |`;
    });

  const report = [
    '# Figma Code Connect Preview Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    `- Mappings checked: ${annotated.length}`,
    `- Issues: ${failures.length}`,
    `- Mappings with warnings: ${warnings.length}`,
    `- Mappings with invalid design system code: ${invalidCode.length}`,
    '',
    '## Results',
    '',
    '| | Component | File | Notice |',
    '| --- | --- | --- | --- |',
    ...(rows.length > 0 ? rows : ['| PASS | No mapping issues found |  |  |']),
    ''
  ].join('\n');

  writeFileSync(resolve(process.cwd(), filePath), report);
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

  const annotated = results.map(result => {
      const batchCase = getBatchCase(result);

      return {
        batchCase,
        result,
        warnings: [...previewWarnings(result), ...mappingNameWarnings(result, batchCase)],
        invalidCode: codeIssues(result)
      };
    }),
    failures = annotated.filter(
      ({ result, invalidCode }) => !result.success || invalidCode.length > 0
    ),
    displayedResults = showAll
      ? annotated
      : annotated.filter(
          ({ result, warnings, invalidCode }) =>
            !result.success || warnings.length > 0 || invalidCode.length > 0
        );

  if (displayedResults.length === 0) {
    console.log('No mapping issues found.');
  }

  if (reportPath) {
    writeReport(reportPath, annotated, failures);
    console.log(`Markdown report written to ${reportPath}`);
  }

  for (const { batchCase, result, warnings, invalidCode } of displayedResults) {
    const name = hyperlink(componentName(result, batchCase), result.url),
      template = batchCase?.templateFile;
    const status =
        result.success && invalidCode.length === 0 ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✕\x1b[0m',
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
      if (invalidCode.length > 0) {
        console.log(`  \x1b[31mInvalid design system code (${invalidCode.length}):\x1b[0m`);
        for (const issue of invalidCode) console.log(`    ${issue}`);
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
  process.exit(failures.length > 0 ? 1 : (code ?? 0));
});
