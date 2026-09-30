#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TOOL = 'check-component-status';
const TAG_RE = /<\s*(sl-[a-z0-9-]+)/gi;
const IMPORT_RE = /import\s+(?:[\s\S]*?\s+from\s+)?["']@sl-design-system\/([^"'/]+)(?:\/[^"']*)?["']/g;

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith('--')) continue;
    const key = part.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) args[key] = true;
    else {
      args[key] = value;
      index += 1;
    }
  }
  return args;
}

function createReport() {
  return {
    tool: TOOL,
    version: '1.0',
    timestamp: new Date().toISOString(),
    summary: { pass: 0, fail: 0, warn: 0, skip: 0 },
    violations: [],
    details: {
      stable: [],
      preview: [],
      draft: []
    }
  };
}

function pushUnique(array, value) {
  if (!array.includes(value)) array.push(value);
}

function normalizeTag(value) {
  const tag = String(value ?? '').trim();
  return tag.startsWith('sl-') ? tag.toLowerCase() : `sl-${tag.toLowerCase()}`;
}

function lineFromIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

async function walk(dir, files = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (['.git', '.yarn', 'node_modules', 'dist', 'coverage', '.sl-ds-cache'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(fullPath, files);
    else if (/\.(html|ts)$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}

function addViolation(report, file, line, rule, severity, message, fixHint) {
  report.summary[severity === 'error' ? 'fail' : 'warn'] += 1;
  report.violations.push({ file, line, rule, severity, message, fix_hint: fixHint });
}

function indexEntries(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.components)) return raw.components;
  if (raw.components && typeof raw.components === 'object') return Object.values(raw.components);
  if (Array.isArray(raw.items)) return raw.items;
  return [];
}

function trackStatus(report, tag, status) {
  if (status === 'stable') pushUnique(report.details.stable, tag);
  if (status === 'preview') pushUnique(report.details.preview, tag);
  if (status === 'draft') pushUnique(report.details.draft, tag);
}

function handleUsage(report, relativeFile, line, tag, status, allowPreview) {
  trackStatus(report, tag, status);

  if (status === 'stable') {
    report.summary.pass += 1;
  } else if (status === 'draft') {
    addViolation(report, relativeFile, line, 'DS6', 'error', `Draft component \`${tag}\` is not allowed in production code.`, 'Replace it with a stable SLDS component or update the design mapping.');
  } else if (status === 'preview') {
    addViolation(report, relativeFile, line, 'DS6', allowPreview ? 'warn' : 'error', `Preview component \`${tag}\` is in use.`, allowPreview ? 'Keep the preview usage documented and recheck before release.' : 'Use --allow-preview only for approved experiments, or replace the component.');
  } else {
    addViolation(report, relativeFile, line, 'DS6', 'warn', `Unknown SLDS component \`${tag}\` was not found in the DS API index.`, 'Refresh the .sl-ds-cache/sl-ds-api index or replace the element with a known stable component.');
  }
}

/**
 * Load the versioned DS API index and compare discovered sl-* element usage to the cached component
 * status. Both template tags and direct @sl-design-system package imports are scanned so wrapper and
 * raw web-component usage are validated consistently.
 */
async function main() {
  const args = parseArgs(process.argv);
  const project = args.project ? path.resolve(args.project) : null;
  const version = args.version;
  const allowPreview = Boolean(args['allow-preview']);
  const report = createReport();

  if (!project || !version) throw new Error('Required arguments: --project <path> --version <slds-version>.');

  const indexPath = path.join(project, '.sl-ds-cache', 'sl-ds-api', version, '_index.json');
  const rawIndex = JSON.parse(await fs.readFile(indexPath, 'utf8'));
  const statusMap = new Map(indexEntries(rawIndex).map(entry => [normalizeTag(entry.component ?? entry.tag ?? entry.name), String(entry.status ?? 'unknown').toLowerCase()]));

  for (const file of await walk(project)) {
    const content = await fs.readFile(file, 'utf8');
    const relativeFile = path.relative(project, file) || path.basename(file);

    for (const match of content.matchAll(TAG_RE)) {
      const tag = match[1].toLowerCase();
      handleUsage(report, relativeFile, lineFromIndex(content, match.index), tag, statusMap.get(tag), allowPreview);
    }

    if (file.endsWith('.ts')) {
      for (const match of content.matchAll(IMPORT_RE)) {
        const tag = normalizeTag(match[1]);
        if (!statusMap.has(tag)) continue;
        handleUsage(report, relativeFile, lineFromIndex(content, match.index), tag, statusMap.get(tag), allowPreview);
      }
    }
  }

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.summary.fail > 0 ? 1 : 0);
}

main().catch(error => {
  const report = createReport();
  addViolation(report, '.', 1, 'tool-error', 'error', error.message, 'Check the versioned .sl-ds-cache/sl-ds-api index and CLI arguments.');
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
});
