#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TOOL = 'calculate-composite-score';
const REQUIRED = ['validate-tokens.json', 'check-component-status.json', 'validate-cem-usage.json', 'check-architecture.json', 'check-modern-angular.json'];
const OPTIONAL = ['a11y-report.json', 'eslint-report.json', 'coverage-report.json'];

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
    violations: []
  };
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function addViolation(report, file, line, rule, severity, message, fixHint) {
  report.summary[severity === 'error' ? 'fail' : 'warn'] += 1;
  report.violations.push({ file, line, rule, severity, message, fix_hint: fixHint });
}

function scoreFromReport(report) {
  if (!report) return null;
  const fail = Number(report.summary?.fail ?? 0);
  const warn = Number(report.summary?.warn ?? 0);
  const pass = Number(report.summary?.pass ?? 0);
  const bonus = pass > 0 ? Math.min(5, Math.round((pass / Math.max(1, pass + fail + warn)) * 5)) : 0;
  return clamp(100 - fail * 12 - warn * 5 + bonus);
}

function coverageScore(report) {
  if (!report) return null;
  const direct = report.details?.coverage ?? report.coverage ?? report.total ?? report.summary?.pass;
  return typeof direct === 'number' ? clamp(Math.round(direct)) : scoreFromReport(report);
}

function accessibilityScore(report) {
  if (!report) return 100;
  const critical = (report.violations ?? []).filter(violation => ['critical', 'serious', 'error'].includes(String(violation.severity).toLowerCase())).length;
  const warn = (report.violations ?? []).length - critical;
  return clamp(100 - critical * 10 - warn * 5);
}

function accessibilityScoreFromMetrics(report) {
  const violations = Number(report?.violations ?? 0);
  const warnings = Number(report?.warnings ?? 0);
  const passes = Number(report?.passes ?? 0);

  if (![violations, warnings, passes].every(Number.isFinite)) {
    throw new Error('Accessibility report must contain numeric violations, warnings, and passes fields.');
  }

  const bonus = passes > 0 ? Math.min(5, Math.round((passes / Math.max(1, passes + violations + warnings)) * 5)) : 0;
  return clamp(100 - violations * 12 - warnings * 4 + bonus);
}

function average(entries) {
  const valid = entries.filter(entry => typeof entry.score === 'number');
  const totalWeight = valid.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight === 0) return 100;
  const weighted = valid.reduce((sum, entry) => sum + entry.score * entry.weight, 0);
  return Math.round((weighted / totalWeight) * 10) / 10;
}

async function loadJson(file, required) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (required) throw error;
    return null;
  }
}

async function loadReport(reportDir, file, required) {
  const reportPath = path.join(reportDir, file);
  try {
    return JSON.parse(await fs.readFile(reportPath, 'utf8'));
  } catch {
    if (required) throw new Error(`Missing required report: ${file}`);
    return null;
  }
}

/**
 * Merge individual tool reports into group scores, apply weighted floors, and emit a single verdict
 * artifact for the DS pipeline. The scorer is deterministic: it only reads JSON files, converts
 * each report into a bounded 0-100 score, and then applies the canonical group weights.
 */
async function main() {
  const args = parseArgs(process.argv);
  const reportDir = args['report-dir'] ? path.resolve(args['report-dir']) : null;
  const output = args.output ? path.resolve(args.output) : null;
  const a11yReportPath = args['a11y-report'] ? path.resolve(args['a11y-report']) : null;
  const report = createReport();

  if (!reportDir || !output) throw new Error('Required arguments: --report-dir <path> --output <path>.');

  const loaded = {};
  for (const file of REQUIRED) loaded[file] = await loadReport(reportDir, file, true);
  for (const file of OPTIONAL) loaded[file] = await loadReport(reportDir, file, false);
  report.summary.skip = OPTIONAL.filter(file => !loaded[file] && !(file === 'a11y-report.json' && a11yReportPath)).length;

  const explicitA11yReport = a11yReportPath ? await loadJson(a11yReportPath, true) : null;
  if (!a11yReportPath) {
    addViolation(report, '.', 1, 'a11y-heuristic', 'warn', 'No dedicated accessibility report was provided; falling back to heuristic accessibility scoring.', 'Provide --a11y-report <path> with { violations, warnings, passes } metrics for deterministic accessibility scoring.');
  }

  const groupScores = {
    architecture: average([{ score: scoreFromReport(loaded['check-architecture.json']), weight: 100 }]),
    code_quality: average([
      { score: scoreFromReport(loaded['check-modern-angular.json']), weight: 70 },
      { score: scoreFromReport(loaded['eslint-report.json']), weight: 30 }
    ]),
    visual_fidelity: average([
      { score: scoreFromReport(loaded['validate-tokens.json']), weight: 55 },
      { score: scoreFromReport(loaded['validate-cem-usage.json']), weight: 45 }
    ]),
    accessibility: a11yReportPath ? accessibilityScoreFromMetrics(explicitA11yReport) : accessibilityScore(loaded['a11y-report.json']),
    ds_maintainability: average([
      { score: scoreFromReport(loaded['validate-tokens.json']), weight: 35 },
      { score: scoreFromReport(loaded['check-component-status.json']), weight: 35 },
      { score: coverageScore(loaded['coverage-report.json']), weight: 30 }
    ])
  };

  const composite = Math.round(((groupScores.architecture * 22 + groupScores.code_quality * 23 + groupScores.visual_fidelity * 25 + groupScores.accessibility * 18 + groupScores.ds_maintainability * 12) / 100) * 10) / 10;
  const floorsMet = Object.values(groupScores).every(score => score >= 90);
  const fatal = Object.values(loaded).filter(Boolean).some(loadedReport => (loadedReport.violations ?? []).some(violation => /draft|circular dependency|tool-error|unfixable/i.test(`${violation.rule} ${violation.message}`)));
  const repairCandidates = Object.entries(groupScores).filter(([, score]) => score < 90).map(([group]) => group);
  const verdict = !fatal && composite >= 95 && floorsMet ? 'pass' : 'fail';

  if (verdict === 'pass') report.summary.pass = 1;
  else report.summary.fail += 1;

  for (const [group, score] of Object.entries(groupScores)) {
    if (score < 90) {
      addViolation(report, group, 1, 'group-floor', 'error', `Quality floor missed for ${group}: ${score}.`, 'Raise the underlying tool scores until the group reaches at least 90.');
    }
  }

  const merged = {
    ...report,
    details: {
      composite,
      group_scores: groupScores,
      verdict,
      floors_met: floorsMet,
      repair_candidates: repairCandidates
    }
  };

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(merged, null, 2));
  console.log(JSON.stringify(merged, null, 2));
  process.exit(verdict === 'pass' ? 0 : 1);
}

main().catch(error => {
  const report = createReport();
  addViolation(report, '.', 1, 'tool-error', 'error', error.message, 'Check report paths and ensure required JSON inputs exist.');
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
});
