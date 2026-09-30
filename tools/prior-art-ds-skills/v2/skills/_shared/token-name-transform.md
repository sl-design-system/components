---
topic: token-name-transform
applies_to: [sl-ds-implement, sl-ds-audit, sl-ds-verify, sl-ds-tokens]
last_updated: 2026-06-13
---

# Token Name Transform — Figma Path → CSS Custom Property

> **Canonical rule.** Every skill that emits CSS custom properties for SLDS design tokens MUST follow this document.
> Cite it as: `@_shared/token-name-transform.md`

## Rule

```
Figma token path  →  CSS custom property name
─────────────────────────────────────────────
Step 1:  Prepend  "--sl-"
Step 2:  Replace  "/"  with  "-"  (all occurrences)
Step 3:  Preserve original casing from Figma token path — do NOT force lowercase.
         SLDS light.css preserves camelCase segments (e.g., borderRadius, fontFamily, fontWeight, semiBold, onBold).
```

> ⚠️ Step 3 note: "already lowercase in practice" was wrong. ALWAYS verify casing against light.css before emitting.

**Examples:**

| Figma token path | CSS custom property | Notes |
|---|---|---|
| `color/foreground/primary/bold` | `--sl-color-foreground-primary-bold` | all lowercase ✓ |
| `color/border/bold` | `--sl-color-border-bold` | all lowercase ✓ |
| `color/background/neutral/subtle` | `--sl-color-background-neutral-subtle` | all lowercase ✓ |
| `size/borderRadius/default` | `--sl-size-borderRadius-default` | camelCase preserved ✓ |
| `size/borderRadius/lg` | `--sl-size-borderRadius-lg` | camelCase preserved ✓ |
| `text-new/typeset/fontFamily/body` | `--sl-text-new-typeset-fontFamily-body` | camelCase preserved ✓ |
| `text-new/typeset/fontWeight/semiBold` | `--sl-text-new-typeset-fontWeight-semiBold` | camelCase preserved ✓ |
| `color/foreground/primary/onBold` | `--sl-color-foreground-primary-onBold` | camelCase preserved ✓ |

## Category exceptions

Some Figma token categories map to a **different CSS category prefix**:

| Figma category | CSS category | Example |
|---|---|---|
| `space/*` | `--sl-size-*` | `space/300` → `--sl-size-300` |
| `size/text-new/*` | `--sl-size-text-new-*` | `size/text-new/heading/md` → `--sl-size-text-new-heading-md` |
| `size/borderRadius/*` | `--sl-size-borderRadius-*` | `size/borderRadius/lg` → `--sl-size-borderRadius-lg` |

The `space/*` exception exists because SLDS v2 merges space and size tokens under `--sl-size-*`.

## Verification (mandatory)

Before emitting a CSS var in generated code, verify it exists in the SLDS theme file:

```bash
grep -c "<var-name>" node_modules/@sl-design-system/sanoma-learning/light.css
```

- Count > 0 → var exists, safe to emit
- Count = 0 → var does NOT exist in current SLDS version

**If var not found:**
1. Log: `⚠️ [MISSING_TOKEN: <figma-path> → <computed-var-name>]`
2. Emit: `var(<computed-var-name>, <fallback>)` where fallback = `tokens-verified.json["data"]["tokens"][<figma-path>]["value"]`
3. Do NOT invent an alternative var name

## Source of truth

`tokens-verified.json` stores Figma token paths as-is (e.g. `"color/foreground/primary/bold"`). The transform above is applied **on-demand** when emitting CSS — paths in JSON are never pre-converted.

## Fallback values

Fallback hex/value MUST come from `tokens-verified.json["data"]["tokens"][<figma-path>]["value"]`.

- ✅ `var(--sl-color-foreground-primary-bold, #1727b6)` — fallback from tokens-verified.json
- ❌ `var(--sl-color-foreground-primary-bold, blue)` — invented fallback
- ❌ `#1727b6` — hardcoded without var() wrapper

## Who uses this

- `sl-ds-tokens` — when writing tokens-verified.json (stores paths as-is)
- `sl-ds-implement` (via `generation-rules.md §5`) — when emitting CSS vars in generated `.scss`
- `sl-ds-audit` — when checking generated code against SLDS theme
- `sl-ds-verify` — when computing token score in composite fidelity metric
