#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TOOL = 'check-modern-angular';

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
      constructor_injection: [],
      legacy_inputs: [],
      legacy_outputs: [],
      legacy_control_flow: []
    }
  };
}

function pushUnique(array, value) {
  if (!array.includes(value)) array.push(value);
}

function lineFromIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '::DOUBLE_STAR::').replace(/\*/g, '[^/]*').replace(/\?/g, '.').replace(/::DOUBLE_STAR::/g, '.*');
  return new RegExp(`^${escaped}$`);
}

async function walk(dir, files = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (['.git', '.yarn', 'node_modules', 'dist', 'coverage', '.sl-ds-cache'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(fullPath, files);
    else if (/\.(ts|html)$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}

function addViolation(report, file, line, rule, severity, message, fixHint) {
  report.summary[severity === 'error' ? 'fail' : 'warn'] += 1;
  report.violations.push({ file, line, rule, severity, message, fix_hint: fixHint });
}

function ignoredLines(content) {
  const ignored = new Set();
  for (const [index, line] of content.split('\n').entries()) {
    if (line.includes('@quality-exception:')) {
      ignored.add(index + 1);
      ignored.add(index + 2);
    }
  }
  return ignored;
}

function warningSeverity(strict) {
  return strict ? 'error' : 'warn';
}

/**
 * Scan Angular source and template files for modern standalone and signal-based patterns using
 * regex-based heuristics. Exceptions are line-scoped via @quality-exception comments so teams can
 * document rare deviations while still enforcing Angular 21 defaults across generated code.
 */
async function main() {
  const args = parseArgs(process.argv);
  const project = args.project ? path.resolve(args.project) : null;
  const strict = Boolean(args.strict);
  const filters = args.files ? args.files.split(',').map(part => globToRegExp(part.trim().replace(/\\/g, '/'))) : [];
  const report = createReport();
  if (!project) throw new Error('Missing required --project <path> argument.');

  for (const file of await walk(project)) {
    const relativeFile = (path.relative(project, file) || path.basename(file)).replace(/\\/g, '/');
    if (file.endsWith('.spec.ts')) {
      report.summary.skip += 1;
      continue;
    }
    if (filters.length > 0 && !filters.some(regex => regex.test(relativeFile))) {
      report.summary.skip += 1;
      continue;
    }

    const content = await fs.readFile(file, 'utf8');
    const ignored = ignoredLines(content);
    const before = report.violations.length;

    if (file.endsWith('.component.ts') && /@Component\b/.test(content) && !/standalone\s*:\s*true/.test(content)) {
      addViolation(report, relativeFile, 1, 'ANG1', 'error', 'Component does not declare standalone: true.', 'Use standalone components instead of module-scoped declarations.');
    }
    for (const match of content.matchAll(/@NgModule\b/g)) {
      const line = lineFromIndex(content, match.index);
      if (!ignored.has(line)) addViolation(report, relativeFile, line, 'ANG1', 'error', 'NgModule usage detected.', 'Replace NgModule-based composition with standalone APIs.');
    }
    for (const match of content.matchAll(/constructor\s*\(([^)]*)\)/g)) {
      const line = lineFromIndex(content, match.index);
      if (ignored.has(line)) continue;
      const params = match[1].trim();
      if (params && (strict || /(private|public|protected|readonly|@Inject|@Optional|@Host|@Self|@SkipSelf)/.test(params))) {
        pushUnique(report.details.constructor_injection, `${relativeFile}:${line}`);
        addViolation(report, relativeFile, line, 'ANG2', warningSeverity(strict), 'Constructor dependency injection detected.', 'Prefer inject() for Angular dependencies and keep constructors parameter-free.');
      }
    }
    for (const match of content.matchAll(/@Input\b/g)) {
      const line = lineFromIndex(content, match.index);
      if (!ignored.has(line)) {
        pushUnique(report.details.legacy_inputs, `${relativeFile}:${line}`);
        addViolation(report, relativeFile, line, 'ANG3', warningSeverity(strict), '@Input() usage detected.', 'Use input() or input.required() signal-based inputs.');
      }
    }
    for (const match of content.matchAll(/@Output\b|\bEventEmitter\b/g)) {
      const line = lineFromIndex(content, match.index);
      if (!ignored.has(line)) {
        pushUnique(report.details.legacy_outputs, `${relativeFile}:${line}`);
        addViolation(report, relativeFile, line, 'ANG4', warningSeverity(strict), '@Output()/EventEmitter usage detected.', 'Use output() for signal-friendly outputs.');
      }
    }
    for (const match of content.matchAll(/\.subscribe\s*\(/g)) {
      const line = lineFromIndex(content, match.index);
      if (ignored.has(line)) continue;
      const window = content.slice(Math.max(0, match.index - 200), Math.min(content.length, match.index + 80));
      if (!/takeUntilDestroyed\s*\(/.test(window)) {
        addViolation(report, relativeFile, line, 'ANG5/ANG10', 'error', 'Subscription without takeUntilDestroyed() detected.', 'Pipe the observable through takeUntilDestroyed() before subscribing.');
      }
    }
    for (const match of content.matchAll(/\*ng(?:For|If|Switch[A-Za-z]*)/g)) {
      const line = lineFromIndex(content, match.index);
      if (!ignored.has(line)) {
        pushUnique(report.details.legacy_control_flow, `${relativeFile}:${line} ${match[0]}`);
        addViolation(report, relativeFile, line, 'ANG6', warningSeverity(strict), `Legacy structural directive \`${match[0]}\` detected.`, 'Use the @for/@if/@switch control flow syntax instead.');
      }
    }
    if (file.endsWith('.service.ts') && !/guard/i.test(file) && !/abstract\s+class/.test(content)) {
      for (const match of content.matchAll(/\bthrow\b/g)) {
        const line = lineFromIndex(content, match.index);
        if (!ignored.has(line)) addViolation(report, relativeFile, line, 'ANG7', 'error', 'Throw statement found in a domain service.', 'Return a Result type or mapped error value instead of throwing.');
      }
    }
    if (file.endsWith('.component.ts') && /@Component\b/.test(content) && !/changeDetection\s*:\s*ChangeDetectionStrategy\.OnPush/.test(content)) {
      addViolation(report, relativeFile, 1, 'ANG8', 'error', 'Component is missing ChangeDetectionStrategy.OnPush.', 'Add changeDetection: ChangeDetectionStrategy.OnPush to the component metadata.');
    }
    for (const match of content.matchAll(/\bCUSTOM_ELEMENTS_SCHEMA\b/g)) {
      const line = lineFromIndex(content, match.index);
      if (!ignored.has(line) && !file.endsWith('app.config.ts')) addViolation(report, relativeFile, line, 'ANG9', 'error', 'CUSTOM_ELEMENTS_SCHEMA is declared outside app.config.ts.', 'Move CUSTOM_ELEMENTS_SCHEMA registration to app.config.ts only.');
    }

    if (report.violations.length === before) report.summary.pass += 1;
  }

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.summary.fail > 0 ? 1 : 0);
}

main().catch(error => {
  const report = createReport();
  addViolation(report, '.', 1, 'tool-error', 'error', error.message, 'Check the project path, glob filters, and file permissions.');
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
});
