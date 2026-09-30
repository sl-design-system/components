#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TOOL = 'validate-cem-usage';
const TAG_RE = /<\s*(sl-[a-z0-9-]+)\b([^>]*?)>/gims;
const ATTR_RE = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
const HTML_TAG_RE = /<\/?\s*([a-z0-9-]+)\b([^>]*)>/gims;
const SLOT_ATTR_RE = /\bslot\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
const GLOBAL_ATTRS = new Set(['class', 'id', 'style', 'slot', 'part', 'role', 'tabindex', 'title', 'lang', 'dir']);
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

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
      checked_components: 0,
      unknown_props: [],
      invalid_events: [],
      invalid_slots: []
    }
  };
}

function pushUnique(array, value) {
  if (!array.includes(value)) array.push(value);
}

function normalizeName(value) {
  return String(value ?? '').replace(/[\[\](){}]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
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
    if (['.git', '.yarn', 'node_modules', 'dist', 'coverage', '.ds-cache'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(fullPath, files);
    else if (entry.name.endsWith('.html') && !entry.name.includes('.generated.')) files.push(fullPath);
  }
  return files;
}

function addViolation(report, file, line, rule, severity, message, fixHint) {
  report.summary[severity === 'error' ? 'fail' : 'warn'] += 1;
  report.violations.push({ file, line, rule, severity, message, fix_hint: fixHint });
}

function enumValues(type) {
  const values = [];
  for (const match of String(type ?? '').matchAll(/'([^']+)'|"([^"]+)"/g)) values.push(match[1] ?? match[2]);
  return values;
}

function closest(name, candidates) {
  const normalized = normalizeName(name);
  return candidates.map(candidate => ({
    candidate,
    score: (candidate.startsWith(name) ? 3 : 0) + (normalizeName(candidate).includes(normalized) ? 2 : 0) + [...normalizeName(candidate)].filter(char => normalized.includes(char)).length
  })).sort((left, right) => right.score - left.score)[0]?.candidate;
}

function extractSlots(api) {
  const names = [];
  let hasSlotInfo = false;
  const collect = slots => {
    hasSlotInfo = true;
    for (const slot of slots) {
      const name = typeof slot === 'string' ? slot : slot?.name;
      if (name !== undefined && name !== null) names.push(String(name));
    }
  };

  if (Array.isArray(api.slots)) collect(api.slots);
  if (Array.isArray(api.declarations)) {
    for (const declaration of api.declarations) {
      if (Array.isArray(declaration?.slots)) collect(declaration.slots);
    }
  }
  if (Array.isArray(api.customElement?.slots)) collect(api.customElement.slots);

  return {
    hasSlotInfo,
    names: [...new Set(names.map(name => name.trim()).filter(Boolean))]
  };
}

function describeUsage(file, line, tag, name) {
  return `${file}:${line} ${tag}.${name}`;
}

function resolveSlotName(attrs) {
  const match = attrs.match(SLOT_ATTR_RE);
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim();
}

function popStack(stack, tag) {
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    if (stack[index].tag === tag) {
      stack.splice(index, 1);
      return;
    }
  }
}

/**
 * Parse cached component API JSON files, then walk Angular HTML templates to validate attribute,
 * event, and slot names on sl-* elements. Static values are checked against enum-like property
 * unions so the report can flag invalid API usage before generation reaches runtime.
 */
async function main() {
  const args = parseArgs(process.argv);
  const project = args.project ? path.resolve(args.project) : null;
  const version = args.version;
  const filters = args.files ? args.files.split(',').map(part => globToRegExp(part.trim().replace(/\\/g, '/'))) : [];
  const report = createReport();

  if (!project || !version) throw new Error('Required arguments: --project <path> --version <slds-version>.');

  const cacheDir = path.join(project, '.ds-cache', 'ds-api', version);
  const components = new Map();

  for (const entry of await fs.readdir(cacheDir)) {
    if (!entry.endsWith('.json') || entry === '_index.json') continue;
    const api = JSON.parse(await fs.readFile(path.join(cacheDir, entry), 'utf8'));
    const props = new Map((api.properties ?? api.members ?? []).map(prop => [normalizeName(prop.name), { name: prop.name, enum: enumValues(prop.type), type: String(prop.type ?? '') }]));
    const events = new Map((api.events ?? []).map(event => [normalizeName(event.name), event.name]));
    const slots = extractSlots(api);
    components.set(String(api.component ?? entry.replace(/\.json$/, '')).toLowerCase(), { props, events, slots });
  }

  for (const file of await walk(project)) {
    const relativeFile = (path.relative(project, file) || path.basename(file)).replace(/\\/g, '/');
    if (filters.length > 0 && !filters.some(regex => regex.test(relativeFile))) {
      report.summary.skip += 1;
      continue;
    }

    const content = await fs.readFile(file, 'utf8');
    const missingSlotWarnings = new Set();

    for (const tagMatch of content.matchAll(TAG_RE)) {
      const tag = tagMatch[1].toLowerCase();
      const api = components.get(tag);
      const line = lineFromIndex(content, tagMatch.index);
      if (!api) {
        addViolation(report, relativeFile, line, 'DS5', 'warn', `No cached CEM entry found for \`${tag}\`.`, 'Refresh .ds-cache/ds-api for the selected version before validating template usage.');
        continue;
      }

      report.details.checked_components += 1;

      for (const attrMatch of tagMatch[2].matchAll(ATTR_RE)) {
        const rawName = attrMatch[1];
        const value = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
        if (!rawName || rawName === tag || rawName === '/' || rawName.startsWith('#') || rawName.startsWith('*') || rawName.startsWith('let-')) continue;
        if (rawName.startsWith('(') && rawName.endsWith(')')) {
          const eventName = rawName.slice(1, -1);
          if (!eventName.startsWith('sl-')) continue;
          if (!api.events.has(normalizeName(eventName))) {
            pushUnique(report.details.invalid_events, describeUsage(relativeFile, line, tag, eventName));
            addViolation(report, relativeFile, line, 'DS5', 'error', `Unknown SLDS event \`${eventName}\` on \`${tag}\`.`, `Use one of: ${[...api.events.values()].join(', ') || 'no supported events'}.`);
          } else {
            report.summary.pass += 1;
          }
          continue;
        }

        const propertyName = rawName.startsWith('[(') && rawName.endsWith(')]') ? rawName.slice(2, -2) : rawName.startsWith('[') && rawName.endsWith(']') ? rawName.slice(1, -1) : rawName;
        if (propertyName.startsWith('attr.') || propertyName.startsWith('class.') || propertyName.startsWith('style.') || propertyName.startsWith('aria-') || propertyName.startsWith('data-') || GLOBAL_ATTRS.has(propertyName)) continue;

        const property = api.props.get(normalizeName(propertyName));
        if (!property) {
          pushUnique(report.details.unknown_props, describeUsage(relativeFile, line, tag, propertyName));
          addViolation(report, relativeFile, line, 'DS5', 'error', `Unknown SLDS property \`${propertyName}\` on \`${tag}\`.`, `Did you mean \`${closest(propertyName, [...api.props.values()].map(prop => prop.name)) ?? 'a documented property'}\`?`);
          continue;
        }

        const isBound = rawName.startsWith('[');
        if (!isBound && property.enum.length > 0 && value && !property.enum.includes(value) && !value.includes('{{')) {
          addViolation(report, relativeFile, line, 'DS5', 'error', `Invalid value \`${value}\` for \`${property.name}\` on \`${tag}\`.`, `Use one of: ${property.enum.join(', ')}.`);
        } else {
          report.summary.pass += 1;
        }
      }
    }

    const stack = [];
    for (const tagMatch of content.matchAll(HTML_TAG_RE)) {
      const fullTag = tagMatch[0];
      const tag = tagMatch[1].toLowerCase();
      const attrs = tagMatch[2] ?? '';
      const line = lineFromIndex(content, tagMatch.index);
      const closing = /^<\//.test(fullTag);

      if (closing) {
        if (tag.startsWith('sl-')) popStack(stack, tag);
        continue;
      }

      const slotName = resolveSlotName(attrs);
      if (slotName && stack.length > 0) {
        const parent = stack[stack.length - 1];
        if (!parent.api.slots.hasSlotInfo) {
          const warningKey = `${relativeFile}:${parent.tag}`;
          if (!missingSlotWarnings.has(warningKey)) {
            missingSlotWarnings.add(warningKey);
            addViolation(report, relativeFile, line, 'DS5', 'warn', `Slot metadata is unavailable for \`${parent.tag}\`; slot usage could not be fully validated.`, 'Refresh the CEM cache with slot metadata to enable slot-name validation.');
          }
        } else if (!parent.api.slots.names.includes(slotName)) {
          pushUnique(report.details.invalid_slots, describeUsage(relativeFile, line, parent.tag, slotName));
          addViolation(report, relativeFile, line, 'DS5', 'error', `Unknown slot \`${slotName}\` provided to \`${parent.tag}\`.`, `Use one of: ${parent.api.slots.names.join(', ') || 'the default slot only'}.`);
        } else {
          report.summary.pass += 1;
        }
      }

      if (!tag.startsWith('sl-')) continue;
      const api = components.get(tag);
      if (!api) continue;

      if (!fullTag.endsWith('/>') && !VOID_ELEMENTS.has(tag)) {
        stack.push({ tag, api });
      }
    }
  }

  console.log(JSON.stringify(report, null, 2));
  process.exit(report.summary.fail > 0 ? 1 : 0);
}

main().catch(error => {
  const report = createReport();
  addViolation(report, '.', 1, 'tool-error', 'error', error.message, 'Check .ds-cache/ds-api contents, version, and template paths.');
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
});
