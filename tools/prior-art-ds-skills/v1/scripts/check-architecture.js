#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TOOL = 'check-architecture';
const DEFAULT_FORMAT = 'json';

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
      smart_components: [],
      dumb_components: [],
      store_violations: [],
      circular_dependencies: []
    }
  };
}

function pushUnique(array, value) {
  if (!array.includes(value)) array.push(value);
}

function lineFromIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, matcher, files = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (['.git', '.yarn', 'node_modules', 'dist', 'coverage', '.ds-cache'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(fullPath, matcher, files);
    else if (matcher(fullPath)) files.push(fullPath);
  }
  return files;
}

function addViolation(report, file, line, rule, message, fixHint) {
  report.summary.fail += 1;
  report.violations.push({ file, line, rule, severity: 'error', message, fix_hint: fixHint });
}

async function resolveRoots(project, nxProject) {
  if (!nxProject) return [project];
  const roots = [];
  for (const projectFile of await walk(project, file => file.endsWith('project.json'))) {
    const json = JSON.parse(await fs.readFile(projectFile, 'utf8'));
    if (json.name === nxProject) roots.push(path.dirname(projectFile));
  }
  return roots.length > 0 ? roots : [project];
}

function resolveImportEntries(file, content, knownFiles) {
  const imports = [];
  for (const match of content.matchAll(/import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g)) {
    const specifier = match[1];
    let resolved = null;
    if (specifier.startsWith('.')) {
      const base = path.resolve(path.dirname(file), specifier);
      const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')];
      resolved = candidates.find(candidate => knownFiles.has(candidate)) ?? null;
    }
    imports.push({ specifier, resolved, line: lineFromIndex(content, match.index) });
  }
  return imports;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function readTemplate(content, file) {
  const inline = content.match(/template\s*:\s*`([\s\S]*?)`/);
  if (inline) return inline[1];
  const templateUrl = content.match(/templateUrl\s*:\s*['"]([^'"]+)['"]/);
  if (!templateUrl) return '';
  const templatePath = path.resolve(path.dirname(file), templateUrl[1]);
  return (await exists(templatePath)) ? fs.readFile(templatePath, 'utf8') : '';
}

function isStoreImport(entry) {
  return entry.resolved?.endsWith('.store.ts') || /(^|\/)(store|stores)(\/|$)/i.test(entry.specifier) || /\.store(?:\.[cm]?[jt]s)?$/i.test(entry.specifier);
}

function renderText(report) {
  const lines = [
    `${report.tool} v${report.version}`,
    `Summary: pass=${report.summary.pass} fail=${report.summary.fail} warn=${report.summary.warn} skip=${report.summary.skip}`,
    `Smart components: ${report.details.smart_components.length}`,
    `Dumb components: ${report.details.dumb_components.length}`,
    `Store violations: ${report.details.store_violations.length}`,
    `Circular dependencies: ${report.details.circular_dependencies.length}`
  ];

  if (report.violations.length > 0) {
    lines.push('', 'Violations:');
    for (const violation of report.violations) {
      lines.push(`- ${violation.rule} ${violation.file}:${violation.line} ${violation.message}`);
    }
  }

  return lines.join('\n');
}

function emitReport(report, format) {
  console.log(format === 'text' ? renderText(report) : JSON.stringify(report, null, 2));
}

/**
 * Inspect Angular component files to infer smart versus dumb roles from injected services, local
 * store files, template composition, and state ownership. The same pass also builds a lightweight
 * import graph so circular dependencies and direct store-layer breaches can be reported.
 */
async function main() {
  const args = parseArgs(process.argv);
  const project = args.project ? path.resolve(args.project) : null;
  const format = args.format === 'text' ? 'text' : DEFAULT_FORMAT;
  const report = createReport();
  if (!project) throw new Error('Missing required --project <path> argument.');

  const roots = await resolveRoots(project, args['nx-project']);
  const componentFiles = (await Promise.all(roots.map(root => walk(root, file => file.endsWith('.component.ts'))))).flat();
  const tsFiles = (await Promise.all(roots.map(root => walk(root, file => file.endsWith('.ts') && !file.endsWith('.spec.ts'))))).flat();
  const knownFiles = new Set(tsFiles);
  const components = [];

  for (const file of componentFiles) {
    const before = report.violations.length;
    const content = await fs.readFile(file, 'utf8');
    const relativeFile = path.relative(project, file) || path.basename(file);
    const importEntries = resolveImportEntries(file, content, knownFiles);
    const storeImports = importEntries.filter(isStoreImport);
    const injects = [...content.matchAll(/inject\s*\(\s*([A-Za-z0-9_$.]+)/g)].map(match => match[1].split('.').pop());
    const serviceInjects = injects.filter(name => name && !/(Logger|Pipe|Formatter)$/i.test(name));
    const baseFile = file.replace(/\.component\.ts$/, '');
    const storeFile = `${baseFile}.store.ts`;
    const hasStore = await exists(storeFile);
    const hasState = /\b(signal|computed|model|BehaviorSubject|ReplaySubject|WritableSignal)\s*(<|\()/m.test(content);
    const isContainerByName = /(page|container)\.component\.ts$/i.test(file);
    const isSmart = serviceInjects.length > 0 || hasStore;
    const selector = content.match(/selector\s*:\s*['"]([^'"]+)['"]/)?.[1] ?? null;
    const onPush = /changeDetection\s*:\s*ChangeDetectionStrategy\.OnPush/.test(content);
    const template = await readTemplate(content, file);

    if (isSmart) pushUnique(report.details.smart_components, relativeFile);
    else pushUnique(report.details.dumb_components, relativeFile);

    if (!isSmart && storeImports.length > 0) {
      for (const entry of storeImports) {
        const detail = `${relativeFile}:${entry.line} -> ${entry.specifier}`;
        pushUnique(report.details.store_violations, detail);
        addViolation(report, relativeFile, entry.line, 'A10', `Dumb component imports store-layer dependency \`${entry.specifier}\`.`, 'Move store access into a smart/container component and pass state to this component via inputs.');
      }
    }
    if (serviceInjects.length > 0 && !hasStore && !isContainerByName) {
      addViolation(report, relativeFile, lineFromIndex(content, content.indexOf('inject(')), 'A1', `Presentational-looking component injects non-UI services: ${serviceInjects.join(', ')}.`, 'Move orchestration to a smart/container component or introduce a sibling *.store.ts.');
    }
    if (isSmart && hasState && !hasStore) {
      addViolation(report, relativeFile, 1, 'A2', 'Smart component owns state but has no sibling *.store.ts file.', 'Extract route or domain state into a colocated store file.');
    }
    if (!isSmart && !onPush) {
      addViolation(report, relativeFile, 1, 'A8', 'Dumb component must use ChangeDetectionStrategy.OnPush.', 'Add changeDetection: ChangeDetectionStrategy.OnPush to the component metadata.');
    }
    if (report.violations.length === before) report.summary.pass += 1;

    components.push({ file, relativeFile, selector, template, isSmart });
  }

  const smartComponents = components.filter(component => component.isSmart && component.selector);
  for (const parent of smartComponents) {
    for (const child of smartComponents) {
      if (parent.file === child.file) continue;
      if (new RegExp(`<\\s*${escapeRegExp(child.selector)}\\b`, 'i').test(parent.template)) {
        addViolation(report, parent.relativeFile, 1, 'A9', `Smart component nests another smart component via \`${child.selector}\`.`, 'Flatten orchestration so smart components own dumb children or route shells only.');
      }
    }
  }

  const graph = new Map();
  for (const file of tsFiles) {
    const content = await fs.readFile(file, 'utf8');
    graph.set(file, resolveImportEntries(file, content, knownFiles).map(entry => entry.resolved).filter(Boolean));
  }

  const visited = new Set();
  const stack = [];
  const reported = new Set();
  const visit = file => {
    if (stack.includes(file)) {
      const cycle = [...stack.slice(stack.indexOf(file)), file].map(item => path.relative(project, item));
      const detail = cycle.join(' -> ');
      if (!reported.has(detail)) {
        reported.add(detail);
        pushUnique(report.details.circular_dependencies, detail);
        addViolation(report, cycle[0], 1, 'A3', `Circular dependency detected: ${detail}.`, 'Break the cycle with a boundary abstraction, shared utility, or dependency inversion.');
      }
      return;
    }
    if (visited.has(file)) return;
    visited.add(file);
    stack.push(file);
    for (const dependency of graph.get(file) ?? []) visit(dependency);
    stack.pop();
  };
  for (const file of graph.keys()) visit(file);

  emitReport(report, format);
  process.exit(report.summary.fail > 0 ? 1 : 0);
}

main().catch(error => {
  const args = parseArgs(process.argv);
  const format = args.format === 'text' ? 'text' : DEFAULT_FORMAT;
  const report = createReport();
  addViolation(report, '.', 1, 'tool-error', error.message, 'Check the project path, NX project name, and file permissions.');
  emitReport(report, format);
  process.exit(2);
});
