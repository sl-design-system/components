---
name: sl-ds-i18n
description: |
  USE WHEN: `/sl-ds-implement` produced templates with `{{ 'key.path' | translate }}` markers, OR user says "extract i18n", "seed translation files", "wygeneruj tłumaczenia", "uzupełnij pl.json", OR `.sl-ds-config.yaml` declares `i18n.active: true` but translation files don't yet have entries for the generated keys.
  DOES: Scans generated templates + TypeScript for translation pipe usage (`I18NextPipe`, `TranslatePipe`, or custom configured pipe), extracts all unique translation keys, generates placeholder entries in pl.json + en.json with English-default text inferred from Figma source. Idempotent — only adds missing keys; preserves existing translations.
  NEVER USE WHEN: `i18n.active: false` in config — no translation files needed. Or when `/sl-ds-implement` hasn't run yet — no templates to scan.
version: 1.0.0
model: sonnet
tags: [sl-ds, i18n, translation, locale, codegen, extract]
next:
  on_success: [sl-ds-verify, sl-ds-audit]
  on_failure: [sl-ds-help, sl-ds-implement]
  related: [sl-ds-implement]
requires:
  artifacts:
    - .sl-ds-config.yaml
    - .sl-ds-cache/sl-ds-impl/architecture.json
  skills_completed: [sl-ds-setup, sl-ds-tokens, sl-ds-plan, sl-ds-implement]
produces:
  artifacts: [.sl-ds-cache/sl-ds-impl/i18n-result.json]
  decisions: []
token_budget: "5-12K"
sub_agents:
  - name: key-extractor
    subagent_type: Explore
    model: sonnet
    purpose: Grep across generated templates for translation pipe patterns; collect unique keys + usage contexts
  - name: default-text-inferrer
    subagent_type: general-purpose
    model: sonnet
    purpose: For each key, infer the source English text from Figma node-tree.json + component-map.json
lessons_read: false
fe_standards_consulted:
  primary: [conventions-and-tooling.md]
  rule_ids: [I18N-1, I18N-2, I18N-3, I18N-4, I18N-5]
---

# DS I18n — Extract Translation Keys + Seed Translation Files

## Purpose

`/sl-ds-implement` emits templates with `{{ 'dashboard.greeting' | i18nextEager }}` (or equivalent for the configured pipe), but the actual translation files (`pl.json`, `en.json`, ...) are NOT populated. Without this skill, every new screen leaves an empty trail of broken translations the user fills by hand. This skill scans generated code, extracts the keys, and seeds the translation files with English-default text inferred from Figma source nodes. Idempotent — preserves existing translations; adds only missing keys.

## When to use

- `/sl-ds-implement` just completed for a project with `i18n.active: true`
- New translation locale added (`en` added to a previously PL-only project) — seed `en.json` from existing `pl.json` keys
- Periodic housekeeping — audit which keys are used in code vs which are in translation files (find orphaned keys)

## When NOT to use

- `.sl-ds-config.yaml` → `i18n.active: false` — no translation files exist; nothing to seed. STOP cleanly.
- Code uses literal strings without pipe (i18n was never wired up) — that's a `/sl-ds-audit` finding, not this skill's job
- Production translations (real, reviewed by translators) — this skill produces PLACEHOLDERS; never replace human-vetted strings

## Preconditions

| Required artifact | If missing |
|---|---|
| `.sl-ds-config.yaml` | STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.7 (producer: `/sl-ds-setup`) |
| `.sl-ds-cache/sl-ds-impl/architecture.json` | STOP per §4.7 (producer: `/sl-ds-plan`) |
| Generated code exists per `architecture.componentTree[].path` | STOP per §4.7 (producer: `/sl-ds-implement`) |

Plus: `.sl-ds-config.yaml` MUST declare `i18n.active: true` with a `pipe_name` (e.g. `I18NextPipe`, `TranslatePipe`). If `false` → refuse cleanly.

## Inputs

**`$ARGUMENTS` (all optional):**

| Field | Description |
|---|---|
| `--locales=pl,en,...` | Which locale files to seed (default: detect existing locales in `i18n/` or `assets/i18n/` directory; if none, default to `pl,en`) |
| `--default-locale=pl\|en` | Which locale gets meaningful default text (others get same text or empty string per `--policy`). Default: `pl` for Sanoma projects |
| `--policy=copy\|empty\|todo` | Behavior for non-default locales: `copy` = same text as default; `empty` = empty string; `todo` = `"TODO: translate"` prefix. Default: `copy` (so untranslated UI still renders something) |
| `--dry-run` | List extracted keys + proposed defaults without writing files |

## Workflow

### Step 1: Discover translation files

**Executor:** orchestrator on **sonnet**

```bash
# Common locations
find . -type f -name "*.json" \
  -path "*/i18n/*" -o -path "*/assets/i18n/*" -o -path "*/locales/*" \
  2>/dev/null | head -20
```

Or read from `.sl-ds-config.yaml` if user added an `i18n.translations_path` field.

Determine existing locales (filename without `.json` is the locale code). If none found → propose path based on framework conventions (Angular i18next typically `src/assets/i18n/<locale>.json`).

### Step 2: Spawn key-extractor sub-agent

**Executor:** `Agent(subagent_type: "Explore", model: "sonnet")` — Explore is correct for pure grep.

**Sub-agent inputs:** path to generated code (`<targetScope>/src/.../<screen>/`), configured pipe name from `.sl-ds-config.yaml`, reference to [`references/extraction-patterns.md`](references/extraction-patterns.md).

**Sub-agent output schema** (inline contract):

```json
{
  "schemaVersion": "1.2.0",
  "producedBy": "sl-ds-i18n/key-extractor",
  "producedAt": "<iso>",
  "pipeName": "I18NextPipe",
  "uniqueKeys": [
    {
      "key": "dashboard.greeting.title",
      "usages": [
        { "file": "features/.../teacher-dashboard-page.ts", "line": 24, "context": "<h1>{{ 'dashboard.greeting.title' | translate }}</h1>" }
      ]
    }
  ],
  "totalUsages": <int>,
  "uniqueKeyCount": <int>,
  "orphanedKeys": [
    { "key": "old.unused.string", "presentIn": ["pl.json"], "reason": "Not found in any template/TS" }
  ]
}
```

`orphanedKeys` lists translation entries that exist in JSON files but no longer have a usage in code (typically left over after refactoring). User can decide to clean them up.

### Step 3: Spawn default-text-inferrer sub-agent

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — clean context.

**Sub-agent inputs:** unique-keys list from Step 2, `node-tree.json` path, `--default-locale`, reference to extraction-patterns.md §3.

**Sub-agent task:** for each key, find the source text in Figma. Strategy:
1. Look at usage context (the template surrounding the key) → identify the corresponding Figma node by class name or `data-figma-id`
2. Read that node's text content from `node-tree.json`
3. That text becomes the default-locale value

**Sub-agent output schema:**

```json
{
  "schemaVersion": "1.2.0",
  "producedBy": "sl-ds-i18n/default-text-inferrer",
  "producedAt": "<iso>",
  "defaultLocale": "pl",
  "translations": [
    {
      "key": "dashboard.greeting.title",
      "defaultText": "Witaj z powrotem",
      "sourceFigmaNode": "1:186",
      "confidence": "high"
    },
    {
      "key": "actions.save",
      "defaultText": "Zapisz",
      "sourceFigmaNode": null,
      "confidence": "low",
      "fallbackReason": "No Figma node mapped to this key; inferred from key path semantics"
    }
  ]
}
```

### Step 4: Merge into translation files

**Executor:** orchestrator on **sonnet**

For each existing locale file (`pl.json`, `en.json`, ...):

1. Read file → parse JSON
2. For each `(key, defaultText)` from Step 3:
   - If key already present in this locale → preserve (do not overwrite human-translated text)
   - If missing → add per `--policy`:
     - Default locale: use `defaultText`
     - Other locales (`copy` policy): use `defaultText` (acts as fallback in UI)
     - Other locales (`empty`): empty string
     - Other locales (`todo`): `"TODO: translate \"<defaultText>\""`
3. Preserve existing key order; new keys append at the end (or alphabetically if existing file is alphabetized)
4. Write file back with consistent formatting (2-space indent, no trailing whitespace)

For orphaned keys (Step 2 output): SURFACE in summary; do NOT auto-delete. User decides via follow-up.

### Step 5: Generate missing locale files (if any)

If `--locales=pl,en` declared but only `pl.json` exists → create `en.json` with the per-policy values from Step 4.

### Step 6: Summary

```text
> ✅ Translation files seeded
>
> | Locale | Existing keys | Added | Final count |
> |---|---|---|---|
> | pl.json | 47 | 12 | 59 (default-locale, real text) |
> | en.json | 47 | 12 | 59 (copy from pl per --policy=copy) |
>
> Orphaned keys (in JSON but not in code): 3
>   - dashboard.old.unused
>   - cart.legacy.checkout-flow
>   - settings.deprecated.notification
> Run `/sl-ds-i18n --clean-orphans` to remove (not implemented in v1; manual deletion for now)
>
> Next:
> - Translators review en.json; the copies from pl are placeholders for translation
> - `/sl-ds-verify` to confirm build still passes (TypeScript may complain if translation-key types are strict)
```

Write `.sl-ds-cache/sl-ds-impl/i18n-result.json` per [`@_shared/cache-schema.md`](../_shared/cache-schema.md) §8.12 (envelope with `pipeName`, `localesProcessed[]`, `addedKeys` per locale, `preservedKeys` per locale, `orphanedKeys[]`, `appliedRules[]`).

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-impl/i18n-result.json` | Audit trail (counts, applied rules, orphaned keys) |
| `<locale>.json` files | Seeded / merged translation files |

## Hard gates

- `i18n.active: false` in config → STOP cleanly. *"i18n is disabled per .sl-ds-config.yaml. Templates do not use a translation pipe. Nothing to extract. Set `i18n.active: true` first if you want i18n."*
- Translation files exist but contain malformed JSON → STOP. Do NOT overwrite — the user might have hand-edited and made a syntax error. Surface the parse error.
- Default-text-inferrer returns `confidence: low` for > 50% of keys → WARN (not FAIL) — many keys lack Figma source mapping. User may want to add `data-figma-id` upstream (per generation-rules.md §3.7) for better defaults next time.
- `--policy=copy` and target locale has identical text already (no new translation) — no-op for that key.

## Resume

Resume per [`../_shared/resume-discipline.md`](../_shared/resume-discipline.md). Progress: `.sl-ds-cache/sl-ds-i18n/progress.json`. Checkpointed steps: Step 3 (per-key default-text inference), Step 4 (per-locale file merge). Translation file edits are idempotent — resume is safe even with partial Step 4 completion. Manual fallback table (if `progress.json` missing or corrupt):

| State on disk | Resume hint |
|---|---|
| `i18n-result.json` exists + matches generated-code git hash | Already done; print summary, EXIT |
| Translation files partially merged (some keys added, some missing) | Step 4 idempotent merge — fill remaining only |
| Nothing | Step 1 (discover files) |

## Next

After successful seeding:

- **Translators take over** — `en.json` contains placeholders that need real translation. This skill cannot translate; it only seeds the keys.
- **`/sl-ds-verify`** — confirm build still passes (some i18n configs do strict key-type checking)
- **If many orphaned keys** — manual cleanup of stale translation entries

## References

| File | Load when |
|---|---|
| [extraction-patterns.md](references/extraction-patterns.md) | Step 2 + Step 3 — grep patterns per pipe, Figma-node → key mapping algorithm |
| [../../standards/fe/conventions-and-tooling.md](../../standards/fe/conventions-and-tooling.md) | Step 2 — I18N-* rules (key naming convention, default-text discipline) |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Preconditions + hard gates (i18n.active false, malformed JSON) |
