#!/usr/bin/env node
/**
 * Sanoma Learning DS Skill validator.
 *
 * Enforces the contract in SCHEMA.md against every skill under .agents-v2/skills/sl-ds*.
 *
 * Usage:
 *   node .agents-v2/skills/_template/validate-skill.js          # validate all
 *   node .agents-v2/skills/_template/validate-skill.js sl-ds-tokens  # validate one
 *
 * Exit codes:
 *   0 — all valid
 *   1 — one or more skills failed validation
 *   2 — internal error (script bug)
 */

const fs = require('fs');
const path = require('path');

const SKILLS_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SKILLS_ROOT, '../..');
const FE_STANDARDS_DIR = path.join(REPO_ROOT, '.agents-v2/standards/fe');
const SCHEMA_VERSION = '1.5.0';

// W10 length bands (per 10x-rule-review adapted for SKILL.md — see SCHEMA §10)
const LENGTH_OK = 250;
const LENGTH_WARN = 450;

// W11 vague-language phrases (case-insensitive whole-word match).
// Only multi-word imperative-style vague intent — bare "good code" / "best practices"
// over-trigger on "bad/good code pair" / "industry best practices for X" etc.
const VAGUE_PHRASES = [
  'write clean code', 'follow best practices', 'be consistent',
  'use modern patterns', 'make it readable', 'make it maintainable',
  'make it robust', 'care about quality', 'handle errors properly',
  'keep things simple', 'write good code', 'write maintainable code',
  'just be careful', 'use your judgment',
];

// Skills declared atomic (no resume needed) — must contain "atomic" marker in ## Resume
const ATOMIC_SKILLS = new Set(['sl-ds-help', 'sl-ds-rebase', 'sl-ds-lesson']);

// Required frontmatter top-level keys
const REQUIRED_FRONTMATTER = [
  'name',
  'description',
  'version',
  'model',
  'tags',
  'next',
  'requires',
  'produces',
  'token_budget',
];

// Required body sections in order (H2 except H1 title)
const REQUIRED_SECTIONS = [
  '## Purpose',
  '## When to use',
  '## When NOT to use',
  '## Preconditions',
  '## Inputs',
  '## Workflow',
  '## Outputs',
  '## Hard gates',
  '## Next',
  '## References',
];

// v1.1 — sections that emit WARN (not FAIL) until v1.2 makes them hard
const WARN_IF_MISSING_SECTIONS = [
  '## Resume',
];

// Skills that SHOULD declare lessons_read: true (warn if missing)
const LESSONS_RECOMMENDED = new Set([
  'sl-ds-layout', 'sl-ds-plan', 'sl-ds-update', 'sl-ds-implement',
]);

const VALID_MODELS = new Set(['haiku', 'sonnet', 'opus']);
const VALID_SUBAGENT_TYPES = new Set(['Explore', 'general-purpose']);
const CATALOG_PATH = path.join(SKILLS_ROOT, 'sl-ds-help', 'references', 'skill-catalog.md');

function fail(skillId, msg) {
  return { skillId, ok: false, warnings: [], msg };
}
function pass(skillId, warnings = []) {
  return { skillId, ok: true, warnings };
}

function listSkillDirs() {
  return fs
    .readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith('sl-ds'))
    .map((d) => d.name);
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]+?)\n---\n/);
  if (!m) return null;
  return m[1];
}

function extractField(fm, key) {
  // Minimal YAML field extractor — handles `key: value`, `key: [a, b]`, `key:\n  sub: val`
  const re = new RegExp(`^${key}\\s*:\\s*(.*)$`, 'm');
  const m = fm.match(re);
  if (!m) return undefined;
  return m[1].trim();
}

function hasNestedField(fm, parent, child) {
  // Look for `parent:\n  child:` pattern
  const re = new RegExp(`^${parent}\\s*:\\s*\\n(?:\\s+[^\\n]*\\n)*?\\s+${child}\\s*:`, 'm');
  return re.test(fm);
}

function validateSkill(skillId) {
  const dir = path.join(SKILLS_ROOT, skillId);
  const skillPath = path.join(dir, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    return fail(skillId, `Missing SKILL.md at ${skillPath}`);
  }

  const text = fs.readFileSync(skillPath, 'utf8');
  const fm = parseFrontmatter(text);
  if (!fm) {
    return fail(skillId, 'No YAML frontmatter (--- ... ---) at top of SKILL.md');
  }

  // 1. Required top-level fields present
  for (const key of REQUIRED_FRONTMATTER) {
    const re = new RegExp(`^${key}\\s*:`, 'm');
    if (!re.test(fm)) {
      return fail(skillId, `Missing required frontmatter field: ${key}`);
    }
  }

  // 2. name matches directory
  const nameVal = extractField(fm, 'name');
  if (nameVal !== skillId) {
    return fail(skillId, `Frontmatter name="${nameVal}" does not match directory "${skillId}"`);
  }

  // 3. model is valid
  const modelVal = extractField(fm, 'model');
  if (!VALID_MODELS.has(modelVal)) {
    return fail(skillId, `Invalid model "${modelVal}" (must be one of: haiku, sonnet, opus)`);
  }

  // 4. Nested required fields
  const nestedChecks = [
    ['next', 'on_success'],
    ['next', 'on_failure'],
    ['requires', 'artifacts'],
    ['requires', 'skills_completed'],
    ['produces', 'artifacts'],
  ];
  for (const [parent, child] of nestedChecks) {
    if (!hasNestedField(fm, parent, child)) {
      return fail(skillId, `Missing required nested field: ${parent}.${child}`);
    }
  }

  // 5. Body sections present in order
  const body = text.slice(text.indexOf('---\n', 4) + 4);
  let cursor = 0;
  for (const section of REQUIRED_SECTIONS) {
    const idx = body.indexOf(section, cursor);
    if (idx === -1) {
      return fail(skillId, `Missing required section: ${section}`);
    }
    cursor = idx + section.length;
  }

  // 6. references/ orphan check — every file mentioned in ## References table OR not present
  const refsDir = path.join(dir, 'references');
  if (fs.existsSync(refsDir)) {
    const refFiles = fs.readdirSync(refsDir).filter((f) => f.endsWith('.md'));
    const refsSection = body.slice(body.indexOf('## References'));
    for (const refFile of refFiles) {
      if (!refsSection.includes(refFile)) {
        return fail(skillId, `Reference file references/${refFile} not mentioned in ## References table`);
      }
    }
  }

  // 7. [[skill-id]] cross-references resolve
  const crossRefs = [...text.matchAll(/\[\[([a-z0-9-]+)\]\]/g)].map((m) => m[1]);
  const allSkills = new Set(listSkillDirs());
  for (const ref of crossRefs) {
    if (!allSkills.has(ref)) {
      return fail(skillId, `Cross-reference [[${ref}]] does not match any skill directory`);
    }
  }

  // 8. sub_agents — validate subagent_type and model if present (v1.1)
  // Parse the sub_agents YAML block loosely (regex; full YAML parser would be overkill here)
  const subAgentsMatch = fm.match(/^sub_agents\s*:\s*\n((?:\s+-?\s*\w+\s*:.*\n?)+)/m);
  if (subAgentsMatch) {
    const block = subAgentsMatch[1];
    // Extract subagent_type values
    const typeMatches = [...block.matchAll(/^\s+subagent_type\s*:\s*([\w-]+)/gm)];
    for (const m of typeMatches) {
      if (!VALID_SUBAGENT_TYPES.has(m[1])) {
        return fail(skillId, `Invalid subagent_type "${m[1]}" (must be one of: ${[...VALID_SUBAGENT_TYPES].join(', ')})`);
      }
    }
    // Extract model values
    const modelMatches = [...block.matchAll(/^\s+model\s*:\s*(\w+)/gm)];
    for (const m of modelMatches) {
      if (!VALID_MODELS.has(m[1])) {
        return fail(skillId, `Invalid sub_agent model "${m[1]}" (must be one of: haiku, sonnet, opus)`);
      }
    }
  }

  // Collect warnings (v1.1 transition — these become errors in v1.2)
  const warnings = [];

  // W1. ## Resume section
  for (const section of WARN_IF_MISSING_SECTIONS) {
    if (!body.includes(section)) {
      warnings.push(`Missing recommended section: ${section} (will become required in v1.2)`);
    }
  }

  // W2. sub_agents present but missing subagent_type
  if (subAgentsMatch) {
    const block = subAgentsMatch[1];
    // Count sub-agents (lines starting with "- name:")
    const subAgentCount = (block.match(/^\s+-\s*name\s*:/gm) || []).length;
    const typeCount = (block.match(/^\s+subagent_type\s*:/gm) || []).length;
    if (subAgentCount > typeCount) {
      warnings.push(`${subAgentCount - typeCount} sub_agent(s) missing subagent_type field (assumed general-purpose; declare explicitly in v1.2)`);
    }
  }

  // W3. Architectural-decision skills should declare lessons_read: true
  if (LESSONS_RECOMMENDED.has(skillId)) {
    const lessonsReadMatch = fm.match(/^lessons_read\s*:\s*(true|false)/m);
    if (!lessonsReadMatch || lessonsReadMatch[1] !== 'true') {
      warnings.push(`Skill makes architectural decisions; recommended: lessons_read: true (currently ${lessonsReadMatch ? 'false' : 'omitted'})`);
    }
  }

  // W4. Catalog sync — skill must appear in sl-ds-help/references/skill-catalog.md
  if (fs.existsSync(CATALOG_PATH)) {
    const catalog = fs.readFileSync(CATALOG_PATH, 'utf8');
    // Look for a heading like "### `/<skill-id>`" or "### /<skill-id>"
    const skillHeading = new RegExp(`^###\\s+\`?/?${skillId}\`?\\b`, 'm');
    if (!skillHeading.test(catalog)) {
      warnings.push(`Not mentioned in sl-ds-help/references/skill-catalog.md (catalog drift — add a ### /${skillId} section)`);
    }
  }

  // W6. Resume discipline (v1.3) — multi-step skills must reference progress.json
  // Skip if skill explicitly declares atomic
  const resumeSection = body.match(/## Resume\s*\n([\s\S]*?)(?=\n## |$)/);
  if (resumeSection) {
    const resumeBody = resumeSection[1].toLowerCase();
    const isAtomic = ATOMIC_SKILLS.has(skillId) || resumeBody.includes('atomic') || resumeBody.includes('stateless') || resumeBody.includes('n/a');
    if (!isAtomic) {
      // Count workflow steps to know if this is multi-step
      const stepHeaders = body.match(/^### Step \d/gm) || [];
      if (stepHeaders.length > 2 && !resumeBody.includes('progress.json')) {
        warnings.push(`## Resume does not reference progress.json (multi-step skill should follow resume-discipline.md per v1.3 — will be error in v1.4)`);
      }
    }
  }

  // W7 (v1.4). Prose preflight blocks restating frontmatter — forbidden by SCHEMA §4 workflow discipline
  const preflightProseMatch = body.match(/\*\*Pre-flight — (applicable lessons|fe-standards consultation)/);
  if (preflightProseMatch) {
    warnings.push(`Workflow has prose preflight block "Pre-flight — ${preflightProseMatch[1]}" — must collapse to one-line citation per SCHEMA.md §4 (v1.4)`);
  }

  // W8 (v1.4). Inline JSON envelopes >5 lines in ## Outputs section — should cite cache-schema.md §8
  const outputsMatch = body.match(/## Outputs\s*\n([\s\S]*?)(?=\n## |$)/);
  if (outputsMatch) {
    const outputsSection = outputsMatch[1];
    const jsonBlocks = [...outputsSection.matchAll(/```json\s*\n([\s\S]*?)\n```/g)];
    for (const block of jsonBlocks) {
      const lines = block[1].split('\n').length;
      if (lines > 5) {
        warnings.push(`## Outputs contains a ${lines}-line JSON envelope — cite @_shared/cache-schema.md §8.<n> instead (SCHEMA.md §4 v1.4)`);
      }
    }
  }

  // W9 (v1.4). Inline Framing skeleton when framing-discipline.md is referenced
  if (text.includes('framing-discipline.md')) {
    // Look for markdown headed code blocks containing "## ... — Framing" pattern
    const framingSkeletonMatch = body.match(/```markdown\s*\n>\s*## .* — Framing\s*\n(?:>[\s\S]*?\n){10,}```/);
    if (framingSkeletonMatch) {
      warnings.push(`Workflow inlines a full Framing skeleton (>10 lines) — cite @framing-discipline.md §6 "fill these specifics" form instead (SCHEMA.md §4 v1.4)`);
    }
  }

  // W10 (v1.5). Length (10x-rule-review Check 1 adapted for SKILL.md): count
  // contentful body lines (no frontmatter, no blanks, no separator-only lines).
  // Adapted bands: 0-250 OK / 251-450 WARN / 451+ FAIL.
  // Rationale: SKILL.md is loaded on-demand by the slash command, not always-
  // loaded like CLAUDE.md, so "crowds out user prompt" is weaker. Cost is sub-
  // agent context budget when the orchestrator passes the file to a clean-
  // context sub-agent, plus maintainer cognitive load.
  const contentful = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[-=*]{3,}$/.test(l));
  const bodyLines = contentful.length;
  if (bodyLines > LENGTH_WARN) {
    return fail(skillId, `Length: ${bodyLines} contentful body lines exceeds ${LENGTH_WARN} (W10 FAIL — split into references/ or consolidate per SCHEMA §10)`);
  }
  if (bodyLines > LENGTH_OK) {
    warnings.push(`W10 Length: ${bodyLines} contentful body lines (band 251-${LENGTH_WARN} = WARN; ≤${LENGTH_OK} = OK). Consider moving inline content to references/`);
  }

  // W11 (v1.5). Vague language scan (10x-rule-review Check 3 adapted).
  // False-positive guards: skip scare-quoted occurrences ("vague" inside
  // quotation marks as anti-pattern callout); skip inside table cells with
  // "machine-readable" / "human-readable" qualifier; skip in `code` spans;
  // skip Strength: / Tradeoff: tradeoff labels.
  for (const phrase of VAGUE_PHRASES) {
    const re = new RegExp(`\\b${phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const matches = [...body.matchAll(re)];
    for (const m of matches) {
      // Find the surrounding context (~80 chars before)
      const start = Math.max(0, m.index - 80);
      const end = Math.min(body.length, m.index + phrase.length + 40);
      const context = body.slice(start, end);
      // Guard 1: scare-quoted (between matching quotes within ~30 chars)
      const beforeMatch = body.slice(Math.max(0, m.index - 30), m.index);
      const afterMatch = body.slice(m.index + phrase.length, Math.min(body.length, m.index + phrase.length + 30));
      if (/["']\s*[^"'\n]*$/.test(beforeMatch) && /^[^"'\n]*\s*["']/.test(afterMatch)) continue;
      // Guard 2: "human-readable" / "machine-readable" qualifier
      if (/(machine|human)-readable/i.test(context)) continue;
      // Guard 3: inside backtick code span
      const lineStart = body.lastIndexOf('\n', m.index) + 1;
      const lineEnd = body.indexOf('\n', m.index);
      const line = body.slice(lineStart, lineEnd === -1 ? body.length : lineEnd);
      const tickCountBefore = (line.slice(0, m.index - lineStart).match(/`/g) || []).length;
      if (tickCountBefore % 2 === 1) continue;
      // Guard 4: Strength:/Tradeoff: label
      if (/(Strength|Tradeoff)\s*:/i.test(line.slice(Math.max(0, m.index - lineStart - 30), m.index - lineStart))) continue;
      // Guard 5: anti-pattern marker (line starts with "❌" or "Don't" or "Anti-pattern" or "NOT")
      if (/^(\s*[-*]?\s*)?(❌|don'?t |anti-pattern|NOT |never )/i.test(line)) continue;
      // Guard 6: meta-discussion section header (e.g. "## What NOT to do" section)
      const lineIdx = body.slice(0, m.index).split('\n').length;
      const allLines = body.split('\n');
      let inMetaSection = false;
      for (let i = Math.max(0, lineIdx - 30); i < lineIdx; i++) {
        if (/^##+ .*(not to do|anti-patterns?|forbidden|deprecated|when NOT to)/i.test(allLines[i] || '')) {
          inMetaSection = true;
          break;
        }
        if (/^## /.test(allLines[i] || '')) {
          inMetaSection = false; // hit a new H2 before reaching the meta section
        }
      }
      if (inMetaSection) continue;

      warnings.push(`W11 Vague language: "${phrase}" at line ~${lineIdx} — propose a testable alternative grounded in project context (10x-rule-review Check 3)`);
    }
  }

  // W12 (v1.5). Hard-gates coverage (10x-rule-review Check 5 adapted).
  // Within fixed schema we can't reorder sections, but we can check that every
  // interactive STOP/FAIL gate mentioned in ## Workflow also appears in
  // ## Hard gates. Catches the sl-ds-update Step 4.5 buried-gate failure mode.
  const workflowMatch = body.match(/## Workflow\s*\n([\s\S]*?)(?=\n## (?:Outputs|Hard gates))/);
  const hardGatesMatch = body.match(/## Hard gates\s*\n([\s\S]*?)(?=\n## )/);
  if (workflowMatch && hardGatesMatch) {
    const workflow = workflowMatch[1];
    const hardGates = hardGatesMatch[1];
    // Find STOP-like markers in workflow: "STOP", "FAIL" as own words
    const stopMarkers = [...workflow.matchAll(/\b(STOP|FAIL)\b/g)];
    // Roughly: if workflow has > 3 STOP/FAIL markers, hard gates should have at least 2 bullets
    if (stopMarkers.length > 3) {
      const hardGatesBullets = (hardGates.match(/^[-*] /gm) || []).length;
      if (hardGatesBullets < 2) {
        warnings.push(`W12 Hard-gates coverage: ## Workflow has ${stopMarkers.length} STOP/FAIL markers but ## Hard gates has only ${hardGatesBullets} bullet(s) — important gates may be buried mid-workflow (10x-rule-review Check 5)`);
      }
    }
  }

  // W5. fe_standards_consulted — if declared, verify primary files exist in .agents-v2/standards/fe/
  const feStandardsMatch = fm.match(/^fe_standards_consulted\s*:\s*\n((?:\s+\w+\s*:.*\n?)+)/m);
  if (feStandardsMatch) {
    const block = feStandardsMatch[1];
    // Extract primary file list — handle inline `primary: [a.md, b.md]` or YAML list
    const primaryInline = block.match(/^\s+primary\s*:\s*\[([^\]]*)\]/m);
    const primaryFiles = primaryInline
      ? primaryInline[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
      : [];
    if (fs.existsSync(FE_STANDARDS_DIR)) {
      for (const f of primaryFiles) {
        const filePath = path.join(FE_STANDARDS_DIR, f);
        if (!fs.existsSync(filePath)) {
          warnings.push(`fe_standards_consulted.primary references missing file: .agents/standards/fe/${f}`);
        }
      }
    } else {
      warnings.push(`fe_standards_consulted declared but .agents/standards/fe/ not found`);
    }
  }

  return pass(skillId, warnings);
}

function main() {
  const target = process.argv[2];
  const skills = target ? [target] : listSkillDirs();

  if (skills.length === 0) {
    console.log('No sl-ds* skills found under', SKILLS_ROOT);
    process.exit(0);
  }

  console.log(`Sanoma Learning DS Skill validator — schema v${SCHEMA_VERSION}`);
  console.log(`Checking ${skills.length} skill(s)...\n`);

  const results = skills.map(validateSkill);
  const failures = results.filter((r) => !r.ok);
  const totalWarnings = results.reduce((s, r) => s + (r.warnings ? r.warnings.length : 0), 0);

  for (const r of results) {
    if (r.ok) {
      const warnCount = r.warnings ? r.warnings.length : 0;
      if (warnCount > 0) {
        console.log(`  PASS  ${r.skillId}  (${warnCount} warning${warnCount > 1 ? 's' : ''})`);
        for (const w of r.warnings) {
          console.log(`         WARN: ${w}`);
        }
      } else {
        console.log(`  PASS  ${r.skillId}`);
      }
    } else {
      console.log(`  FAIL  ${r.skillId}: ${r.msg}`);
    }
  }

  console.log('');
  if (failures.length === 0) {
    if (totalWarnings > 0) {
      console.log(`All ${results.length} skill(s) passed. ${totalWarnings} warning(s) — will become errors in schema v1.2.`);
    } else {
      console.log(`All ${results.length} skill(s) passed.`);
    }
    process.exit(0);
  } else {
    console.log(`${failures.length}/${results.length} skill(s) failed.`);
    process.exit(1);
  }
}

try {
  main();
} catch (err) {
  console.error('Validator crashed:', err);
  process.exit(2);
}
