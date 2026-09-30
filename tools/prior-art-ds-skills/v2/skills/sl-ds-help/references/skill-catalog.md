---
topic: skill-catalog
applies_to: [sl-ds-help, sl-ds]
last_updated: 2026-06-09
---

# Sanoma Learning DS Skills — Canonical Catalog

> **Purpose:** Hand-curated catalog of all `sl-ds-*` skills with phase grouping, "when to use" hints, and typical chains. The single source of truth for `/sl-ds-help` output and `/sl-ds` router's "show menu" fallback. The validator (`_template/validate-skill.js`) cross-checks that every existing `.agents/skills/sl-ds*/` directory is mentioned here.

## Pipeline mental model

```
       ┌─────────────────────────────────────────────────────────────┐
       │                  Sanoma Learning DS Pipeline                          │
       └─────────────────────────────────────────────────────────────┘

  Setup (once)        Per-screen flow              Maintenance
  ───────────         ─────────────────────────    ───────────────────
  /sl-ds-setup    →      /sl-ds-layout                   /sl-ds-update (Figma changed)
                       ↓                            /sl-ds-audit  (read-only check)
                      /sl-ds-tokens
                       ↓
                      /sl-ds-plan
                       ↓
                      /sl-ds-implement
                       ↓
                      /sl-ds-verify

  Discovery (anytime)
  ───────────────────
  /sl-ds        ← auto-router: figures out what to run
  /sl-ds-help   ← this catalog
```

## Phase 0: Discovery & routing (Haiku — cheap)

### `/sl-ds` — Auto-router

**When:** You don't know which skill you need. Just typed `/sl-ds` with or without a Figma URL.
**What:** Reads project state, matches your intent, dispatches OR asks 1-3 questions if unsure.
**Tags:** `router, dispatch, state-detection`
**Cost:** ~1-5K tokens on Haiku
**Typically followed by:** the skill `/sl-ds` recommends

### `/sl-ds-help` — Catalog

**When:** You want the full picture before doing anything.
**What:** Prints this catalog. Optionally filtered by keyword.
**Tags:** `help, catalog, discovery`
**Cost:** ~1-3K tokens on Haiku

---

## Phase 1: Setup (Sonnet — once per project)

### `/sl-ds-setup`

**When:**
- First time using DS skills in this project
- `.sl-ds-config.yaml` is missing or out of date
- Framework changed (e.g. project upgraded Angular major version)

**What:** Detects stack (Angular/React/Vue, SLDS version, i18n library, state management), writes `.sl-ds-config.yaml`, ensures `.gitignore` covers `.sl-ds-cache/`. Refuses non-Angular frameworks per v1 scope (see `.agents/standards/fe/sanoma-ds.md` SDS-7).

**Tags:** `setup, config, detection, framework`
**Cost:** ~3-8K tokens on Sonnet
**Produces:** `.sl-ds-config.yaml`, `.sl-ds-cache/sl-ds-impl/codebase-analysis.json`
**Typically followed by:** `/sl-ds-layout` (new screen) or `/sl-ds-audit` (existing code)

---

## Phase 2: Design analysis (per Figma file/screen)

### `/sl-ds-layout` — Opus

**When:**
- Starting a new screen
- Multi-screen Figma file — need to identify shared shell (topbar, navigation, footer)
- Existing layout in code might conflict with Figma design

**What:** Analyzes all Figma pages (not just one frame), proposes shared shell structure, compares against any existing layout in code, writes decisions doc.

**Tags:** `figma, layout, multi-screen, shell, navigation`
**Cost:** ~10-25K tokens on Opus
**Produces:** `context/foundation/sl-ds-decisions/layout.md`
**Typically followed by:** `/sl-ds-tokens`

### `/sl-ds-tokens` — Sonnet

**When:**
- Need design tokens (colors, spacing, typography) from Figma
- Tokens may already be cached — let the skill check

**What:** Extracts tokens via `get_variable_defs` across ALL visual node types (not 2-3 samples). Verifies (cross-node consistency, no fallback values, DS vocabulary check). Downloads icons and image assets.

**Tags:** `figma, tokens, extract, verify, cache`
**Cost:** ~10-28K tokens on Sonnet (cache-hit: 0)
**Cache:** Skipped if `tokens-verified.json` exists AND `figmaLastModified` unchanged
**Produces:** `tokens-verified.json`, `icons.json`, `assets.json`, `node-tree.json`
**Typically followed by:** `/sl-ds-plan`

### `/sl-ds-plan` — Opus

**When:**
- Tokens verified, layout decided — time to plan component structure
- Need to decide data approach (mock service / signal store / static)

**What:** Scans codebase for existing patterns (state mgmt, dir structure, DS usage). Presents codebase-informed recommendations. Asks 2-3 structured questions. Builds component dependency tree.

**Tags:** `architecture, components, state-management, codebase`
**Cost:** ~8-20K tokens on Opus
**Produces:** `architecture.json`, `component-map.json`
**Typically followed by:** `/sl-ds-implement`

---

## Phase 3: Implementation

### `/sl-ds-implement` — Sonnet

**When:** Architecture decided, tokens verified — write the actual code.

**What:** Generates code following:
- Framework-rules file (Angular: signals, inject, @if/@for, sl-* imports)
- Tokens from `tokens-verified.json` (never fallbacks)
- Icons from `icons.json` (DS or custom SVG)
- DOM hierarchy from `node-tree.json`
- Component map from `architecture.json`

Creates WIP commit after each major file (configurable in `.sl-ds-config.yaml`).

**Tags:** `generate, code, angular, components, sl-ds-imports`
**Cost:** ~15-40K tokens on Sonnet
**Produces:** Actual code files (in `apps/<project>/` or wherever `targetScope` points)
**Typically followed by:** `/sl-ds-verify`

### `/sl-ds-verify` — Sonnet

**When:** Code generated — verify it builds, lints, matches Figma geometrically.

**What:**
1. `nx build` + `nx lint` — zero errors
2. Pattern checks (no `@Input()`, no `*ngFor`, all selectors prefixed)
3. Start dev server, measure DOM positions, compare to Figma (±2px tolerance, ±4px for text)
4. Auto-repair up to 3 attempts per failure
5. Cleanup (stop server)

**Tags:** `verify, build, lint, geometric, pixel-perfect`
**Cost:** ~5-30K tokens on Sonnet (depending on repair cycles)
**Produces:** `build-result.json`, `geometry-result.json`
**Typically followed by:** finalize commit OR `/sl-ds-update` (if user finds issues later)

---

## Phase 4: Maintenance

### `/sl-ds-update` — Opus

**When:**
- Figma design changed (someone updated the file)
- Need to reconcile code with new design
- User explicitly invokes after Figma edit

**What:** Fetches current Figma state, diffs against cached `tokens-verified.json` + `node-tree.json`. Categorizes changes (tokens only, layout only, structural). Asks user per category: **overwrite** (replace cache + regenerate), **update** (incremental patch), or **redo** (clear cache, full re-run).

**Tags:** `update, figma, diff, reconcile, maintenance`
**Cost:** ~10-30K tokens on Opus
**Produces:** Updated cache, optionally updated code
**Typically followed by:** `/sl-ds-verify`

### `/sl-ds-rebase` — Sonnet

**When:**
- Last `/sl-ds-update` went wrong; you want to restore pre-update state
- Need to revert WIP commits a recent update created

**What:** Lists `_archive/<timestamp>/` snapshots from `/sl-ds-update` runs, restores cache files, optionally reverts the WIP commits. Single-shot recovery — no diff, no decisions, just restore. Conflict-on-revert → user resolves manually.

**Tags:** `rebase, restore, archive, rollback, recovery`
**Cost:** ~2-5K tokens on Sonnet
**Produces:** Restored `.sl-ds-cache/`, optional `git revert` commits
**Typical use:** after a bad update, before re-running with different choices

### `/sl-ds-promote` — Opus

**When:**
- `sl-ds-lessons.md` has 20+ active lessons OR `/sl-ds-lesson` emitted a 50+-lessons WARN
- Quarterly housekeeping pass on lessons
- A specific lesson has been active 6+ months, broadly applied, never contradicted

**What:** Scores active lessons by (age × scope × severity × applications × stability). Surfaces candidates above threshold. User picks per-lesson — promoted lessons MOVE to `.agents/standards/fe/` as new rule IDs (typically SDS-* for SLDS-flavored), with cross-reference in the now-expired lesson entry.

**Tags:** `promote, lessons, fe-standards, graduation, lifecycle`
**Cost:** ~5-15K tokens on Opus
**Produces:** New rule IDs in fe-standards; expired entries in `sl-ds-lessons.md` with cross-ref
**Typical use:** semi-annual or when lessons file gets crowded

### `/sl-ds-mock` — Sonnet

**When:**
- `/sl-ds-implement` produced service.ts / store.ts with empty mock signatures
- New screen added; service needs realistic seed data
- User says "generate mocks", "fill in seed data", "wygeneruj mocki"

**What:** Reads `node-tree.json` + `component-map.json`, infers realistic mock-data shapes from Figma text/data nodes (group cards with student counts, dashboard insights with progress percentages), populates the service/store mock arrays. Idempotent — preserves hand-tuned values; adds only missing fields. Locale-aware (PL/EN); never generates real PII.

**Tags:** `mock, data, fixtures, service, store, codegen`
**Cost:** ~5-15K tokens on Sonnet
**Produces:** Modified service/store + optional `<component>.fixtures.ts`
**Typical use:** right after `/sl-ds-implement`, before `/sl-ds-verify`

### `/sl-ds-i18n` — Sonnet

**When:**
- `/sl-ds-implement` produced templates with `{{ 'key' | translate }}` markers
- New locale added; need to seed missing keys
- `.sl-ds-config.yaml` declares `i18n.active: true` but translation files lag

**What:** Scans generated templates + TS for translation pipe usage, extracts all unique keys, generates placeholder entries in `pl.json`/`en.json`/.../. Default text inferred from Figma source nodes when `data-figma-id` is emitted. Idempotent — preserves human-translated text. Reports orphaned keys.

**Tags:** `i18n, translation, locale, codegen, extract`
**Cost:** ~5-12K tokens on Sonnet
**Produces:** Seeded translation files; audit of orphaned keys
**Typical use:** right after `/sl-ds-implement` for any i18n-active project

### `/sl-ds-lesson` — Sonnet

**When:**
- After a `/sl-ds-plan` decision where you overrode the recommendation with a feature-specific rule
- After an incident that should never repeat (record the rule + reason)
- After a design review where a convention was settled
- To expire a stale lesson via `--expire <lesson-id>`

**What:** Captures team/project-specific rules into `context/foundation/sl-ds-lessons.md` with structured metadata (applies_to, scope, severity, rule, why). Future runs of `/sl-ds-layout`, `/sl-ds-plan`, `/sl-ds-update`, `/sl-ds-implement` read and apply applicable lessons in their framing blocks. **Single writer** — keeps format consistent.

**Tags:** `lesson, capture, learning, ledger, rules`
**Cost:** ~2-5K tokens on Sonnet
**Produces:** `context/foundation/sl-ds-lessons.md` (committed to git for team sharing)
**Typical use:** invoked after another skill finishes, capturing what was learned

NOT for framework-universal rules (those belong in `.agents/standards/fe/` — NG-* / SDS-* / COMP-* etc.), nor for vague preferences ("write good code"). Must be actionable + have a stated reason.

### `/sl-ds-audit` — Sonnet

**When:**
- Read-only check of code health
- Before review / before release
- Suspect drift between Figma and code

**What:**
- Compares code against `tokens-verified.json` (token usage, no hardcoded hex)
- Checks fe-standards compliance (NG-* Angular idioms: signals, inject, control flow; SDS-* SLDS: imports, layout-vs-DS; AP-* antipatterns)
- Checks DS import discipline (every `sl-*` imported)
- Optionally fetches Figma to flag geometric drift
- **Does NOT modify anything.** Output is a report.

**Tags:** `audit, check, read-only, compliance, drift`
**Cost:** ~5-15K tokens on Sonnet
**Produces:** `audit-report.json` (and prints summary to user)
**Typically followed by:** `/sl-ds-implement` (fix issues) or `/sl-ds-update` (Figma diverged)

---

## Typical chains

### New project, new screen
```
/sl-ds-setup → /sl-ds-layout → /sl-ds-tokens → /sl-ds-plan → /sl-ds-implement → /sl-ds-verify
```

### Existing project, new screen
```
/sl-ds-layout → /sl-ds-tokens → /sl-ds-plan → /sl-ds-implement → /sl-ds-verify
```

### Same screen, Figma updated
```
/sl-ds-update → (user picks scope) → /sl-ds-verify
```

### Just curious / sanity check
```
/sl-ds-audit
```

### Lost
```
/sl-ds → (it figures it out)
```

---

## Quick reference table

| Skill | Model | Phase | Cost (est.) | Reads cache? | Writes code? |
|---|---|---|---|---|---|
| `/sl-ds` | Haiku | Routing | 1-5K | yes | no |
| `/sl-ds-help` | Haiku | Discovery | 1-3K | no | no |
| `/sl-ds-setup` | Sonnet | Setup | 3-8K | no | no (writes config) |
| `/sl-ds-layout` | Opus | Analysis | 10-25K | no | no (writes decisions) |
| `/sl-ds-tokens` | Sonnet | Analysis | 10-28K | **yes** (skip if fresh) | no |
| `/sl-ds-plan` | Opus | Analysis | 8-20K | yes (tokens) | no |
| `/sl-ds-implement` | Sonnet | Impl | 15-40K | yes (all) | **yes** |
| `/sl-ds-verify` | Sonnet | Impl | 5-30K | yes (all) | maybe (auto-repair) |
| `/sl-ds-update` | Opus | Maint | 10-30K | **yes** | maybe (user decides) |
| `/sl-ds-rebase` | Sonnet | Maint | 2-5K | restores cache | maybe (git revert) |
| `/sl-ds-promote` | Opus | Maint | 5-15K | no | no (writes fe-standards + lessons) |
| `/sl-ds-mock` | Sonnet | Maint | 5-15K | yes | **yes** (service/store mocks) |
| `/sl-ds-i18n` | Sonnet | Maint | 5-12K | no | **yes** (translation files) |
| `/sl-ds-audit` | Sonnet | Maint | 5-15K | yes | **no** (read-only) |
| `/sl-ds-lesson` | Sonnet | Maint | 2-5K | no | no (writes sl-ds-lessons.md) |

---

## Maintenance notes

- This file is hand-curated. When a skill is added/removed/renamed, update here.
- The validator (`_template/validate-skill.js`) checks: every directory `.agents/skills/sl-ds*/` must appear in a `###` header in this file. Mismatches fail the validator.
- Cost estimates are guidelines; actual depends on screen size, repair cycles, and codebase scale.
