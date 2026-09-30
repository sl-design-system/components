#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TOOL = 'validate-tokens';
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g;
const SPACING_RE = /(^|[^-\w])((?:margin(?:-[a-z]+)?|padding(?:-[a-z]+)?|gap|row-gap|column-gap|top|right|bottom|left))\s*:\s*(-?\d+(?:\.\d+)?)(px|rem|em)\b/gim;
const TYPO_RE = /(?:font-size|font-weight|line-height)\s*:\s*([^;\n}]+)/gi;
const INLINE_STYLE_RE = /<\s*(sl-[a-z0-9-]+)\b[^>]*\bstyle\s*=\s*(["'])([\s\S]*?)\2/gi;
const TOKEN_RE = /var\(\s*(--sl-[a-z0-9-]+)/gi;
const VALID_TOKEN_PREFIXES = ['--sl-color-', '--sl-space-', '--sl-text-', '--sl-size-', '--sl-border-', '--sl-shadow-', '--sl-elevation-'];

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith('--')) continue;
    const key = part.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      args[key] = true;
    } else {
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
      hardcoded_colors: 0,
      hardcoded_spacing: 0,
      token_alias_mismatches: 0
    }
  };
}

function padMatch(text) {
  return text.replace(/[^\n]/g, ' ');
}

function stripComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, padMatch).replace(/<!--[\s\S]*?-->/g, padMatch);
}

function exceptionRanges(content) {
  return [...content.matchAll(/\/\*[\s\S]*?@quality-exception:[\s\S]*?\*\//g), ...content.matchAll(/<!--[\s\S]*?@quality-exception:[\s\S]*?-->/g)].map(match => ({
    start: match.index,
    end: match.index + match[0].length
  }));
}

function lineFromIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

function inRange(index, ranges) {
  return ranges.some(range => index >= range.start && index < range.end);
}

function globToRegExp(glob) {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '::DOUBLE_STAR::')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '.')
    .replace(/::DOUBLE_STAR::/g, '.*');
  return new RegExp(`^${escaped}$`);
}

function normalizePath(value) {
  return String(value).replace(/\\/g, '/');
}

async function loadExceptionMatchers(project, file) {
  if (!file) return [];

  const raw = JSON.parse(await fs.readFile(path.resolve(file), 'utf8'));
  const entries = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.paths)
      ? raw.paths
      : Array.isArray(raw.files)
        ? raw.files
        : Array.isArray(raw.exceptions)
          ? raw.exceptions
          : [];

  return entries
    .map(entry => typeof entry === 'string' ? entry : entry?.path)
    .filter(Boolean)
    .map(entry => {
      const normalized = normalizePath(path.isAbsolute(entry) ? path.relative(project, entry) : entry);
      return globToRegExp(normalized);
    });
}

function matchesPattern(relativeFile, patterns) {
  return patterns.some(pattern => pattern.test(relativeFile));
}

async function walk(dir, files = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (['.git', '.yarn', 'node_modules', 'dist', 'coverage'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, files);
    } else if (/\.(scss|css|html)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function addViolation(report, file, line, rule, message, fixHint) {
  report.summary.fail += 1;
  report.violations.push({
    file,
    line,
    rule,
    severity: 'error',
    message,
    fix_hint: fixHint
  });
}

function tokenHint(rule, value) {
  if (rule === 'DS2') return `Replace ${value} with the nearest color token such as var(--sl-color-*) or semantic background token.`;
  if (rule === 'DS3') return `Replace ${value} with the nearest spacing token such as var(--sl-size-100), var(--sl-size-200), or var(--sl-size-*).`;
  if (rule === 'DS4') return `Use a documented SLDS token with one of these prefixes: ${VALID_TOKEN_PREFIXES.join(', ')}.`;
  if (rule === 'DS7') return `Replace ${value} with the nearest typography token such as var(--sl-text-*) or a semantic font token.`;
  return 'Move the inline style into a class and use the nearest var(--sl-*) design token.';
}

/**
 * Walk every style and template file, remove comment bodies while preserving indexes, and then
 * match hardcoded design values against deterministic regexes. Matches inside annotated quality
 * exceptions are skipped, and an optional exception registry can exclude known file paths.
 */
async function main() {
  const args = parseArgs(process.argv);
  const project = args.project ? path.resolve(args.project) : null;
  const filters = args.files ? args.files.split(',').map(part => globToRegExp(normalizePath(part.trim()))) : [];
  const report = createReport();

  if (!project) throw new Error('Missing required --project <path> argument.');
  const files = await walk(project);
  const exceptionMatchers = await loadExceptionMatchers(project, args['allow-exceptions']);

  for (const file of files) {
    const relativeFile = normalizePath(path.relative(project, file) || path.basename(file));

    if (filters.length > 0 && !matchesPattern(relativeFile, filters)) {
      report.summary.skip += 1;
      continue;
    }
    if (matchesPattern(relativeFile, exceptionMatchers)) {
      report.summary.skip += 1;
      continue;
    }
    if (file.includes('.generated.')) {
      report.summary.skip += 1;
      continue;
    }

    const before = report.violations.length;
    const original = await fs.readFile(file, 'utf8');
    const content = stripComments(original);
    const ranges = exceptionRanges(original);

    for (const match of content.matchAll(COLOR_RE)) {
      if (inRange(match.index, ranges)) continue;
      report.details.hardcoded_colors += 1;
      addViolation(report, relativeFile, lineFromIndex(content, match.index), 'DS2', `Hardcoded color value \`${match[0]}\` found.`, tokenHint('DS2', match[0]));
    }

    for (const match of content.matchAll(SPACING_RE)) {
      const value = `${match[3]}${match[4]}`;
      if (inRange(match.index, ranges) || value === '0' || value === '0px' || value === '0rem' || value === '0em') continue;
      report.details.hardcoded_spacing += 1;
      addViolation(report, relativeFile, lineFromIndex(content, match.index), 'DS3', `Hardcoded spacing value \`${value}\` used in \`${match[2]}\`.`, tokenHint('DS3', value));
    }

    for (const match of content.matchAll(TOKEN_RE)) {
      const token = match[1];
      if (inRange(match.index, ranges) || VALID_TOKEN_PREFIXES.some(prefix => token.startsWith(prefix))) continue;
      report.details.token_alias_mismatches += 1;
      addViolation(report, relativeFile, lineFromIndex(content, match.index), 'DS4', `Unknown or unsupported design token \`${token}\` found.`, tokenHint('DS4', token));
    }

    for (const match of content.matchAll(TYPO_RE)) {
      const value = match[1].trim();
      if (inRange(match.index, ranges) || /^var\(/.test(value) || /^(normal|inherit|initial|unset|none)$/i.test(value)) continue;
      addViolation(report, relativeFile, lineFromIndex(content, match.index), 'DS7', `Hardcoded typography value \`${value}\` found.`, tokenHint('DS7', value));
    }

    for (const match of content.matchAll(INLINE_STYLE_RE)) {
      if (inRange(match.index, ranges)) continue;
      addViolation(report, relativeFile, lineFromIndex(content, match.index), 'DS8', `Inline style attribute found on \`${match[1]}\`.`, tokenHint('DS8', 'style attribute'));
    }

    if (report.violations.length === before) report.summary.pass += 1;
  }

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.summary.fail > 0 ? 1 : 0);
}

main().catch(error => {
  const report = createReport();
  addViolation(report, '.', 1, 'tool-error', error.message, 'Check the project path, exception registry, and file permissions, then rerun the tool.');
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
});
