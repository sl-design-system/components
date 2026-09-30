---
topic: extraction-patterns
applies_to: [sl-ds-i18n]
last_updated: 2026-06-10
---

# I18n Extraction Patterns — Sub-Agent Contracts

> **Purpose:** Loaded by `/sl-ds-i18n` Steps 2-3. Defines grep patterns per pipe library, Figma-node → key-path mapping algorithm for default-text inference, and orphan-detection rules.

## 1. Grep patterns per pipe (Step 2 — key-extractor)

The `.sl-ds-config.yaml` declares `i18n.pipe_name`. Per pipe, the grep pattern differs:

### 1.1 `angular-i18next` (`I18NextPipe`, pipe alias `i18nextEager` / `i18next`)

```bash
# In templates (.html, inline template strings):
grep -rEo "\{\{\s*['\"]([a-zA-Z0-9._-]+)['\"]\s*\|\s*i18next(Eager)?" <targetScope>/src/

# In TypeScript (i18n service calls):
grep -rEo "i18n\.t\(['\"]([a-zA-Z0-9._-]+)['\"]" <targetScope>/src/
grep -rEo "this\.i18nService\.t\(['\"]([a-zA-Z0-9._-]+)['\"]" <targetScope>/src/
```

### 1.2 `@ngx-translate/core` (`TranslatePipe`, pipe alias `translate`)

```bash
# Templates:
grep -rEo "\{\{\s*['\"]([a-zA-Z0-9._-]+)['\"]\s*\|\s*translate" <targetScope>/src/

# TypeScript:
grep -rEo "this\.translate\.(instant|get)\(['\"]([a-zA-Z0-9._-]+)['\"]" <targetScope>/src/
```

### 1.3 Generic fallback

If the pipe name in `.sl-ds-config.yaml` doesn't match either above, build the pattern dynamically:

```bash
PIPE_NAME=<from-config>
grep -rEo "\{\{\s*['\"]([a-zA-Z0-9._-]+)['\"]\s*\|\s*${PIPE_NAME}" <targetScope>/src/
```

Document the configured pipe in the sub-agent output (`pipeName` field) for traceability.

## 2. Key collection + deduplication

Each grep match yields a key path (e.g. `dashboard.greeting.title`). Collect:

```json
{
  "key": "dashboard.greeting.title",
  "usages": [
    { "file": "<path>", "line": <N>, "context": "<the matched line>" }
  ]
}
```

Deduplicate by `key`. Same key may appear in multiple files (legitimately reused) — combine usages into one entry.

## 3. Default-text inference (Step 3 — default-text-inferrer)

For each unique key, find the corresponding Figma source text.

### 3.1 Strategy: data-figma-id mapping

If the generated template emits `data-figma-id="<nodeId>"` (per `sl-ds-implement/references/generation-rules.md` §3.7), the inferrer can map directly:

```text
Template line: <h1 data-figma-id="1:186">{{ 'dashboard.greeting.title' | translate }}</h1>
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                          key:                Figma node:
                                          dashboard.greeting.title  1:186 → "Witaj z powrotem"
```

Look up `node-tree.json` for `nodeId === "1:186"` → read its `characters` / `text` content → that becomes `defaultText`. Confidence: `high`.

### 3.2 Fallback: class-name + parent context

If `data-figma-id` missing (legacy generated code), use the surrounding template context to identify the parent component, then look up the component's owning Figma node in `component-map.json`, then walk its descendants in `node-tree.json` looking for a TEXT node with `characters` close to the key's leaf segment.

Example: key = `dashboard.greeting.title`. Look in the `max-hero-section` component (per `architecture.componentTree`) for a TEXT node whose name or characters include "greeting" or "title". Confidence: `medium`.

### 3.3 Last-resort: key-path-based default

If neither strategy yields a result, infer from the key path semantics:

| Key suffix | Default text (PL) | Default text (EN) |
|---|---|---|
| `.save` | "Zapisz" | "Save" |
| `.cancel` | "Anuluj" | "Cancel" |
| `.confirm` | "Potwierdź" | "Confirm" |
| `.delete` | "Usuń" | "Delete" |
| `.edit` | "Edytuj" | "Edit" |
| `.add` | "Dodaj" | "Add" |
| `.next` | "Dalej" | "Next" |
| `.back` | "Wstecz" | "Back" |
| `.close` | "Zamknij" | "Close" |
| `.loading` | "Ładowanie..." | "Loading..." |
| `.error.generic` | "Coś poszło nie tak" | "Something went wrong" |
| `.empty.generic` | "Brak danych" | "No data" |
| `.success.generic` | "Gotowe" | "Done" |

Confidence: `low`. The summary surfaces these so the user knows which keys deserve real translator attention first.

## 4. Orphan detection (Step 2 extension)

After collecting all unique keys USED in code, scan existing translation files to find keys present in JSON but never used:

```python
keys_in_code = set(usages.keys())
for locale_file in existing_locale_files:
  translations = read_json(locale_file)
  keys_in_file = flatten_keys(translations)  # e.g. {dashboard: {greeting: {title: "..."}}} → {"dashboard.greeting.title"}
  orphans = keys_in_file - keys_in_code
  for orphan in orphans:
    report.orphanedKeys.append({
      "key": orphan,
      "presentIn": [locale_file_name],
      "reason": "Not found in any generated template or TS file"
    })
```

`/sl-ds-i18n` v1 only REPORTS orphans; deletion is manual. Future `/sl-ds-i18n --clean-orphans` could automate.

## 5. JSON file formatting conventions

When writing translation files (Step 4 in SKILL.md), preserve / enforce these conventions:

- 2-space indent
- LF line endings (no CRLF)
- Trailing newline at EOF
- No trailing whitespace
- Keys ordered: if existing file is alphabetized → keep alphabetized; if structured by feature → append new keys to their feature section
- Nested structure preferred over flat dot-separated keys:
  ```json
  // YES (nested — matches key path)
  { "dashboard": { "greeting": { "title": "..." } } }

  // NO (flat — harder to maintain at scale)
  { "dashboard.greeting.title": "..." }
  ```
  The translation library handles both; nesting is cleaner for review and translator tooling.

## 6. Performance budget

| Operation | Tokens |
|---|---|
| Grep across `<targetScope>/src/<screen>/` | <2K |
| Read translation files (typical 5-50K JSON) | 5-30K |
| Default-text inference per key (with data-figma-id) | ~100 tokens each |
| Default-text inference fallback (class-name walk) | ~500 tokens each |
| Total sub-agent | 5-12K |

If translation files are very large (>100K) → orchestrator should chunk: process keys-to-add in batches of 50.

## 7. What NOT to do

- ❌ Don't overwrite human-translated text (anything beyond `--policy` defaults)
- ❌ Don't delete orphaned keys automatically — surface them, let user decide
- ❌ Don't fabricate translations for unfamiliar locales — if Figma source isn't available and key-path heuristic doesn't match, use `--policy=todo` ("TODO: translate") rather than guessing
- ❌ Don't change existing key structure (flat vs nested) — match the file's current convention
- ❌ Don't run real translation services (no DeepL/Google API calls) — placeholders only; humans translate
