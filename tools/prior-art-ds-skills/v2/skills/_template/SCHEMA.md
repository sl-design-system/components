# Sanoma Learning DS Skill — Format Schema

**Version:** 1.5.0
**Last updated:** 2026-06-10 (v1.5 — adapted 10x-rule-review methodology baked into validator: W10 length bands, W11 vague-language scan with false-positive guards, W12 hard-gates coverage; v1.4 workflow discipline; v1.3 Resume; v1.2 fe_standards_consulted; v1.1 subagent_type/confidence/Resume/lessons_read)
**Authority:** This file is the canonical contract for every skill under `.agents/skills/sl-ds*`. If `SKILL_TEMPLATE.md` and this schema disagree, **this schema wins** — regenerate the template.

> **For maintainers:** changing the schema means re-running `validate-skill.js` against all skills and updating any that drift. Bump the schema `version` and note breaking changes at the bottom.

---

## 1. Why a separate schema file

The user wants the format to be **regeneratable**. That means the structure must live as data, not be implicit in example skills. When the schema changes (e.g. add a `cache` field), one place is touched; the template inherits; the validator catches drift.

---

## 2. Directory layout per skill

```
.agents/skills/<skill-id>/
 ├─ SKILL.md            ← REQUIRED — entry point (frontmatter + body)
 └─ references/         ← OPTIONAL — lazy-loaded large content
    └─ <name>.md
```

**Rules:**
- `<skill-id>` is the **kebab-case** name, matches `name:` in frontmatter
- All Sanoma Learning DS skills use the `sl-ds` or `sl-ds-` prefix (`sl-ds` for the router, `sl-ds-*` for the rest)
- `references/` is for content that would bloat `SKILL.md` (>50 lines of dense material). Loaded only when needed.
- No nested skill dirs. No code beyond `references/*.md` inside a skill dir.

---

## 3. Frontmatter contract

YAML between `---` markers at the top of `SKILL.md`. Fields:

### 3.1 Identity (required)

| Field | Type | Description |
|---|---|---|
| `name` | string | Kebab-case, matches directory name. Example: `sl-ds-tokens` |
| `description` | string (multi-line, `\|`) | First line MUST start with `USE WHEN:` listing trigger phrases (EN + PL). Second line `DOES:` one-liner. Third line `NEVER USE WHEN:` anti-triggers. Used by Claude Code matcher and `/sl-ds` router. |
| `version` | semver | Starts at `1.0.0`. Bump on contract changes. |
| `model` | enum | `haiku` \| `sonnet` \| `opus`. Primary executor model. See `_shared/model-routing.md`. |

### 3.2 Routing & flow (required)

| Field | Type | Description |
|---|---|---|
| `tags` | string[] | For `/sl-ds` router matching. Example: `[figma, tokens, extract, cache]`. |
| `next.on_success` | string[] | Skills to suggest after this one succeeds. Order = preference. |
| `next.on_failure` | string[] | Fallback skills (e.g. on cache miss, on schema error). |
| `next.related` | string[] | "See also" — not part of linear flow. |

### 3.3 Preconditions & outputs (required)

| Field | Type | Description |
|---|---|---|
| `requires.artifacts` | string[] | Paths/globs that must exist. If missing → refuse with redirect (see `_shared/refusal-protocol.md`). |
| `requires.skills_completed` | string[] | Skill IDs whose artifact-marker must exist. Empty list `[]` if none. |
| `produces.artifacts` | string[] | Paths this skill writes. Used by validator + router for state detection. |
| `produces.decisions` | string[] | Paths under `context/foundation/sl-ds-decisions/` that this skill creates/updates. |

### 3.4 Caching (required if skill is expensive)

| Field | Type | Description |
|---|---|---|
| `cache.invalidate_on` | string[] | Signals that bust the cache. Standard values: `figma_lastModified`, `.sl-ds-config.yaml`, `package.json`. |
| `cache.reuse_if` | string[] | If these artifacts exist and aren't invalidated → skip work, reuse. Triggers cache-hit path. |

Skills that are **cheap and stateless** (e.g. `sl-ds-help`) may omit `cache:` entirely.

### 3.5 Cost discipline (required)

| Field | Type | Description |
|---|---|---|
| `token_budget` | string | Range, e.g. `"5-15K"`. Inherited from `.agents/sl-ds/*.md` convention. |
| `sub_agents` | object[] | If skill spawns sub-agents — list them with `name`, `subagent_type`, `model`, `purpose`. Forces explicit cost AND cognitive-task choice. |

**Sub-agent field shape (v1.1):**

```yaml
sub_agents:
  - name: <id>                # e.g. "state-detector"
    subagent_type: <enum>     # "Explore" (fast file/grep search) | "general-purpose" (deep multi-step reasoning)
    model: <enum>             # haiku | sonnet | opus
    purpose: <one-liner>
```

**`subagent_type` semantics (the cognitive-task choice):**
- `Explore` — fast read-only search agent. Optimized for "find files matching pattern", "grep for symbol", "list files referencing X". DOES NOT do multi-step reasoning across many files. Use when the sub-task is file discovery / pattern lookup. **Cheaper to invoke** than general-purpose for this work.
- `general-purpose` — full reasoning agent. Use when sub-agent must read multiple files, synthesize findings, make non-trivial decisions. Mandatory for any sub-task that writes files or calls external APIs (Figma MCP).

The validator (`validate-skill.js`) checks `subagent_type` is one of these two values.

### 3.6 Lessons reading discipline (v1.1, optional)

| Field | Type | Description |
|---|---|---|
| `lessons_read` | boolean | If `true`, the skill MUST read `context/foundation/sl-ds-lessons.md` (if it exists) at start and apply applicable lessons. If absent or `false`, the skill does not consult lessons. Default: omit (interpreted as `false`). |

Recommended `true` for skills that make architectural decisions (`sl-ds-layout`, `sl-ds-plan`, `sl-ds-update`, `sl-ds-implement`) — these benefit from accumulated team rules. Cheap/mechanical skills (`sl-ds-help`, `sl-ds-tokens`, `sl-ds-audit`) may safely omit.

The `/sl-ds-lesson` skill is the only one that WRITES to `sl-ds-lessons.md`. All others are read-only consumers.

### 3.7 FE Standards consultation (v1.2, optional but recommended)

| Field | Type | Description |
|---|---|---|
| `fe_standards_consulted.primary` | string[] | List of `.agents/standards/fe/*.md` filenames the skill consults. Empty `[]` if skill doesn't apply FE rules. |
| `fe_standards_consulted.rule_ids` | string[] | List of specific rule IDs (e.g. `ARCH-1`, `COMP-3`, `SDS-1`). May use wildcards (e.g. `NG-*`) to indicate "all rules from this file." |

The skill orchestrator reads `_shared/fe-standards-index.md` (~3K) at start, then per workflow step delegates loading of full rule files to sub-agents in clean context (per the lazy-loading discipline in fe-standards-index.md §3).

**Recommended `fe_standards_consulted` for each skill type:**
- Architectural decision skills (sl-ds-layout, sl-ds-plan) — wide set across architecture/components/data-and-state/angular
- Code-writing skills (sl-ds-implement) — widest set including all the above + errors/forms/styling/sanoma-ds + antipatterns
- Verification skills (sl-ds-verify, sl-ds-audit) — testing + antipatterns + sanoma-ds for SLDS-specific gates
- Mechanical skills (sl-ds-help, sl-ds, sl-ds-tokens) — empty `[]` is fine; sub-agents may load on their own

**Conflict resolution priority:** see [`_shared/lessons-format.md`](../_shared/lessons-format.md) §5.2 — the single source of truth. Do not restate here.

---

## 4. Body sections (required, in order)

Every `SKILL.md` body must include these H2 sections in this order:

1. `# <Title> — <Tagline>` (H1, once)
2. `## Purpose` — one paragraph, max 4 sentences
3. `## When to use` — bullet list of concrete trigger scenarios
4. `## When NOT to use` — bullet list of cases that redirect elsewhere
5. `## Preconditions` — explicit check; STOP+redirect if not met
6. `## Inputs` — `$ARGUMENTS` schema + auto-detected fields
7. `## Workflow` — numbered steps; each step starts with `**Executor:** <model> [orchestrator|sub-agent]`
8. `## Outputs` — exact paths written (must match `produces.artifacts` in frontmatter)
9. `## Hard gates` — FAIL conditions that abort the skill (cache miss is NOT a hard gate — it's a path)
10. `## Resume` (v1.1, required) — recipe for "where am I" after crash/interruption. Maps existing artifacts → step number. May be `_N/A — stateless skill._` for skills like `sl-ds-help` and `sl-ds`.
11. `## Next` — flow guidance (must match `next.*` in frontmatter)
12. `## References` — table of `references/*.md` files with "load when" trigger

**Section discipline:**
- No optional sections. If you have nothing for a section, write `_None._` or `_N/A._`
- No prose outside these sections (no preamble between H1 and `## Purpose`)
- Code blocks fenced with triple backticks + language hint

**Workflow section discipline (v1.4 — applies to `## Workflow`):**

- **Forbidden: prose preflight blocks** restating frontmatter fields. If `lessons_read: true` OR `fe_standards_consulted` is non-empty, the workflow MUST open with a single one-liner of the form:

  > *"Pre-flight: read applicable lessons per `@_shared/lessons-format.md §5.1` (if `lessons_read: true`); scope fe-standards per `@_shared/fe-standards-index.md §3` (per frontmatter `fe_standards_consulted`)."*

  Multi-paragraph preflight blocks (>3 lines) that restate frontmatter content are **forbidden** — the frontmatter IS the consultation contract; the shared references document the discipline.

- **Forbidden: inline JSON envelope schemas** for any artifact whose schema is documented in `_shared/cache-schema.md`. The Outputs section MUST cite `@_shared/cache-schema.md §1.1 — <producer>` instead of inlining the envelope. Inline JSON examples ≤ 5 lines for clarity (e.g. a structural shape hint) are acceptable; full envelopes are not.

- **Forbidden: full Framing skeleton inline** when the skill cites `_shared/framing-discipline.md`. Use the form:

  > *"Apply the canonical skeleton from `@_shared/framing-discipline.md §6`, filled with these specifics: Observation: <bullets>; Interpretation: <bullets>; Proposed direction: <bullets>; Confidence: <rationale>."*

  This replaces 20-30 lines of skeleton-with-placeholders with a 5-line "fill these specifics" form.

- **Resume section discipline:** retain the per-skill manual-fallback table (varies by skill) but trim the four-paragraph boilerplate (Active progress write / Checkpoints / Step 0 protocol / Manual fallback). Replace boilerplate with one citation: *"Resume per `@_shared/resume-discipline.md`. Progress file: `.sl-ds-cache/<skill-id>/progress.json`. Checkpointed steps: <list>. Manual fallback table:"*. The shared file documents the protocol; the SKILL.md documents the per-skill specifics only.

**`## Resume` shape (v1.1):**

```markdown
## Resume

If interrupted, determine the resume point from existing artifacts:

| Artifact present | Resume at step |
|---|---|
| `.sl-ds-cache/<skill>/_step1.json` exists, but `_step2.json` does not | Step 2 |
| All step artifacts exist + `produces.artifacts` complete | Already finished; print summary, EXIT |
| `failure.json` exists | Inspect kind, see hard gate recovery in §X |

Validator will warn if `## Resume` exists but doesn't reference any of the skill's `produces.artifacts`.
```

---

## 5. Routing semantics

The `/sl-ds` router (Haiku) reads each skill's frontmatter to decide dispatch. The contract:

1. Router collects all `name`, `tags`, `description.USE_WHEN`, `requires.*`, `produces.*` from every `sl-ds*` skill
2. Router examines project state: `.sl-ds-cache/`, `context/foundation/sl-ds-decisions/`, `git status`, `package.json`
3. For each skill: check if `requires.*` are met AND `produces.*` are missing → candidate
4. Among candidates: rank by user intent match (trigger phrases) and dependency order
5. If ambiguous → ask 1-3 structured questions (see `_shared/questions-format.md`)
6. Dispatch via `Agent(subagent_type: <skill>)` or instruct user to invoke `/<skill>`

---

## 6. References pattern

`references/<name>.md` should be **single-topic** and **load-triggered**:

```markdown
## References (in SKILL.md)
| File | Load when |
|---|---|
| [extraction-rules.md](references/extraction-rules.md) | Step 3a — before calling get_variable_defs |
| [verification-gates.md](references/verification-gates.md) | Step 4 — before deciding pass/fail |
```

**Rules for `references/`:**
- One topic per file
- Start with frontmatter `--- topic: <slug> ---` + a 1-line summary
- No frontmatter fields beyond `topic`, `applies_to`, `last_updated`
- Cross-reference other refs with relative paths, no absolute paths

---

## 7. Cross-skill linking

Use `[[skill-id]]` syntax in prose for cross-references. The validator (`validate-skill.js`) checks that every `[[X]]` resolves to a real skill directory.

In frontmatter, use plain skill IDs (no `[[ ]]`): `next.on_success: [sl-ds-tokens, sl-ds-plan]`.

---

## 8. Versioning & migration

- Schema v1.1.0 — current. Backward compatible with v1.0 (new fields are optional/added; existing skills get warnings, not failures, until updated).
- Schema breaking change → bump major (e.g. `2.0.0`) → write migration note here:

### Migration log

**v1.0 → v1.1 (2026-06-09):**
- Added `sub_agents[].subagent_type` field (`Explore` | `general-purpose`) — optional, defaults to `general-purpose` if missing (warning emitted by validator)
- Added `lessons_read: boolean` frontmatter field (optional, defaults to `false`)
- Added `## Resume` as required body section (validator emits warning, not error, during v1.1 transition — will be hard requirement in v1.2)
- Added `confidence` field to cache envelopes — see `_shared/cache-schema.md` §2.1

**v1.1 → v1.2 (2026-06-09):**
- Added `fe_standards_consulted.{primary, rule_ids}` frontmatter field — declarative consultation contract with `.agents/standards/fe/` rule set; orchestrator reads `_shared/fe-standards-index.md` (~3K) for lazy-loading discipline
- DELETED `_shared/framework-rules/` directory (cheat sheet for Angular) — content scaled or moved to `.agents/standards/fe/sanoma-ds.md` (SDS-*)
- DELETED `_shared/fe-best-practices.md` — content overlapped with `fe-standards/conventions-and-tooling.md` (A11Y/PERF/SEC/I18N) and `fe-standards/sanoma-ds.md`
- Conflict resolution order: lessons (must-follow) → sanoma-ds (SDS-*) → angular (NG-*) → generic fe-standards → defaults

**v1.2 → v1.3 (2026-06-10):**
- Strengthened `## Resume` from a passive artifact-inference table to an active progress-write discipline per [`_shared/resume-discipline.md`](../_shared/resume-discipline.md):
  - Every multi-step skill writes `.sl-ds-cache/<skill-id>/progress.json` at step boundaries (atomic via temp+rename)
  - Long-running steps (multi-call: sl-ds-tokens Step 3, sl-ds-implement Step 4, sl-ds-verify Step 3, sl-ds-update Step 2, sl-ds-plan Step 3) write checkpoints per unit
  - Re-invocation reads `progress.json` first as Step 0 (resume check); asks user to resume / fresh / show details
  - `pipeline-state.json` master index actively maintained (lastInvocation, completed/failed sections updated)
  - Atomic skills (`/sl-ds-help`, `/sl-ds-rebase`, `/sl-ds-lesson`) explicitly declare `_atomic — no resume needed_` in `## Resume`
- Validator v1.3: WARN when multi-step skill's `## Resume` doesn't reference progress.json; WARN when multi-unit step has no declared checkpoint discipline

**v1.3 → v1.4 (2026-06-10) — Workflow-section discipline (from 10x-rule-review Step 2 findings):**
- **Forbidden: prose preflight blocks** restating `lessons_read` / `fe_standards_consulted` frontmatter. Must collapse to one citation line.
- **Forbidden: inline JSON envelope schemas** when `_shared/cache-schema.md §1.1` documents the producer's envelope. Cite instead.
- **Forbidden: full Framing skeleton inline** when citing `_shared/framing-discipline.md`. Use the "fill these specifics" form (5 lines, not 20-30).
- **Resume boilerplate trim:** keep per-skill manual-fallback table; drop the 4-paragraph protocol restatement.
- Net effect: ~425 lines reclaimed suite-wide across 15 SKILL.md files with zero loss of rule content (all deletions are redirects to existing shared references).
- Validator v1.4: WARN on prose preflight blocks restating frontmatter; WARN on inline JSON envelopes >5 lines in `## Outputs`; WARN on inline Framing skeleton when `framing-discipline.md` is referenced.

**v1.4 → v1.5 (2026-06-10) — Adapted 10x-rule-review methodology baked into validator:**
- **W10 — Length bands** (10x-rule-review Check 1 adapted for SKILL.md on-demand loading):
  - 0-250 contentful body lines: OK
  - 251-450: WARN
  - 451+: FAIL (split into references/ or consolidate)
  - "Contentful" excludes blank lines and pure separators (---, ===, ***). Frontmatter NOT counted.
- **W11 — Vague-language scan** (10x-rule-review Check 3 adapted with false-positive guards):
  - Flags multi-word imperative vague intent: "write clean code", "follow best practices", "be consistent", "use modern patterns", "make it readable/maintainable/robust", "care about quality", "handle errors properly", "keep things simple", "write good/maintainable code", "just be careful", "use your judgment".
  - Guards (do NOT flag): scare-quoted occurrences (`"..."` as anti-pattern callout), human/machine-readable qualifier, code spans, Strength:/Tradeoff: tradeoff labels, anti-pattern markers (❌/Don't/Anti-pattern/Never), meta-sections like `## What NOT to do` / `## Anti-patterns`.
- **W12 — Hard-gates coverage** (10x-rule-review Check 5 adapted for fixed schema):
  - Within fixed sections, every interactive STOP/FAIL gate in `## Workflow` should have a corresponding bullet in `## Hard gates`. Catches buried-gate failure mode (e.g. sl-ds-update Step 4.5 not surfaced).
  - Triggers WARN when `## Workflow` has >3 STOP/FAIL markers but `## Hard gates` has <2 bullets.
- All 15 skills PASS v1.5 with zero warnings — the manual cleanup from Fala 13 already complied with the codified rules.
- Drift prevention: future SKILL.md edits that re-introduce length bloat, vague language, or buried gates trip the validator in CI.

---

## 9. Validator contract

`validate-skill.js` enforces (v1.1):

**Errors (FAIL):**
1. Directory name matches `name:` in frontmatter
2. All required frontmatter fields present + correct type
3. All required body sections present in order
4. `produces.artifacts` is non-empty (unless skill is pure-routing like `sl-ds`)
5. `requires.skills_completed` references existing skill IDs
6. `next.*` references existing skill IDs
7. `[[X]]` cross-references resolve
8. No `references/` files orphaned (every one is mentioned in `## References` table)
9. Every `sl-ds-*/` directory has a `### /<skill-id>` section in `sl-ds-help/references/skill-catalog.md` (catalog sync check)
10. If `sub_agents` is present, each entry has `subagent_type` in `{Explore, general-purpose}` and `model` in `{haiku, sonnet, opus}`

**Warnings (PASS with notice, will become errors in v1.2):**
- `## Resume` section missing
- `sub_agents[].subagent_type` omitted (assumed `general-purpose`)
- Skills making architectural decisions (`sl-ds-layout`, `sl-ds-plan`, `sl-ds-update`, `sl-ds-implement`) without `lessons_read: true`

Run: `node .agents/skills/_template/validate-skill.js [skill-id-or-all]`
Output: `PASS`, `WARN: <message>`, `FAIL: <message>`. Exit 0 (all pass, warnings allowed), 1 (any error), 2 (validator bug).

## 10. Quality checks codified from 10x-rule-review (v1.5)

Three quality dimensions from `.github/skills/10x-rule-review/SKILL.md` are adapted and enforced by the validator. Their thresholds and false-positive guards are tuned for SKILL.md files (on-demand loaded by slash command) rather than always-loaded artifacts like CLAUDE.md.

### 10.1 Length (W10)

Count contentful body lines: total body lines minus blank lines minus pure separator lines (`---`, `===`, `***`). Frontmatter is NOT counted.

| Lines | Verdict | Action |
|---|---|---|
| 0-250 | OK | No action |
| 251-450 | WARN | Consider moving inline content to `references/` or `_shared/` |
| 451+ | FAIL | Split into references — file is large enough to bloat sub-agent context |

**Why bands differ from 10x defaults (0-200 / 201-500 / 501+):** SKILL.md is loaded on-demand by the slash command, not always-loaded like CLAUDE.md. The "crowds out user prompt" rationale is weaker; the cost is sub-agent context budget when the orchestrator passes the file to a clean-context sub-agent, plus maintainer cognitive load. Lower bands reflect that on-demand loading is forgiving but not infinite.

### 10.2 Vague language (W11)

Phrases flagged (case-insensitive whole-word match):

`write clean code`, `follow best practices`, `be consistent`, `use modern patterns`, `make it readable`, `make it maintainable`, `make it robust`, `care about quality`, `handle errors properly`, `keep things simple`, `write good code`, `write maintainable code`, `just be careful`, `use your judgment`.

When matched, propose a testable alternative grounded in project context. Never suggest "just delete it" — the author put the line there for a reason; translate the intent into something a reviewer can check against a diff.

**False-positive guards (do NOT flag):**

1. **Scare-quoted:** `"write clean code"` inside matching quotes within ~30 chars — typically appears as an anti-pattern example
2. **`human-readable` / `machine-readable` qualifier** in surrounding context — descriptive property, not vague advice
3. **Inside backtick code spans** (odd count of `` ` `` characters before the match on the same line)
4. **Strength:/Tradeoff: labels** within ~30 chars before the match — tradeoff-table prose, not vague rule
5. **Anti-pattern markers** at line start: `❌`, `Don't`, `Anti-pattern`, `NOT`, `Never`
6. **Meta-sections:** match falls under an H2 like `## What NOT to do`, `## Anti-patterns`, `## When NOT to use`, `## Forbidden`, `## Deprecated`

Add new phrases to the list as the team's anti-vague vocabulary grows; do not remove the guards.

### 10.3 Hard-gates coverage (W12)

10x-rule-review's Check 5 (rule ordering) adapted for fixed schema:

- We cannot reorder top-level sections (locked per SCHEMA §4 v1.4).
- Instead, check that every interactive STOP/FAIL gate mentioned in `## Workflow` has a corresponding bullet in `## Hard gates`. Catches the "buried gate" failure mode where a critical safety mechanism (e.g. manual-edit detection in `/sl-ds-update` Step 4.5) is invoked mid-workflow but invisible to a reader scanning `## Hard gates`.

**Trigger:**
- `## Workflow` section has >3 occurrences of `STOP` or `FAIL` as own words
- AND `## Hard gates` section has <2 bullets (`-` or `*` at line start)

When triggered, surface the count mismatch. Resolution: add a one-line summary of each interactive STOP/FAIL gate to `## Hard gates`, even if the mechanics live in a workflow step. The gate section becomes a true index of safety mechanisms.

### 10.4 Skipped from 10x's original methodology

Two checks from `.github/skills/10x-rule-review/SKILL.md` are intentionally NOT codified:

- **Check 2 — Direct code/config snippets (full):** partially covered by W8 (JSON envelopes in `## Outputs`). Bash and TypeScript snippets are kept inline when they're truly the skill's contract (e.g. sl-ds-tokens cache-check sequence). Full automation would over-trigger.
- **Check 4 — Redundant knowledge:** subjective ("did the agent know this from training?"). Code can't reliably distinguish "framework default" from "project-specific pattern that happens to be common."

These remain advisory — run a manual 10x-rule-review pass periodically (semi-annually or when sl-ds-lessons.md crosses 50 entries) to catch what static checks miss.
