---
topic: merge-modes
applies_to: [sl-ds-update]
last_updated: 2026-06-09
---

# Merge Modes — Action Catalog Per Category

> **Purpose:** Loaded by `/sl-ds-update` Step 5 (presenting options) and Step 6 (applying actions). Defines what `overwrite`, `update`, `redo`, and `skip` mean for each diff category, and the exact mechanics of each action.

## 1. The three primary modes

| Mode | Blast radius | When to use | Preserves manual edits? |
|---|---|---|---|
| **update** | Surgical | Small diffs; you want to preserve manual code customizations | Mostly yes |
| **overwrite** | Wide | Confident about regen; ok to lose manual CSS/code tweaks | No |
| **redo** | Full pipeline | Big structural changes; clean slate desired | No, and most expensive |
| **skip** | None | Acknowledge Figma diverges; not syncing this category | Yes (no changes) |

Always present these in this order: `update` (default for tokens-only/layout-only), `overwrite` (default for structural with clean code), `redo` (when overwrite isn't enough), `skip`.

## 2. Per-category × per-mode action matrix

### 2.1 Tokens-only

| Mode | Action |
|---|---|
| **update** | Patch `tokens-verified.json`: apply `added` + `removed` + `changed`. Edit `styles.scss` to update CSS custom property values. Add new CSS vars for `added`. Remove for `removed`. WIP commit. Code beyond styles.scss is untouched. |
| **overwrite** | Replace `tokens-verified.json` entirely with fresh values. Delete `styles.scss` and re-run `/sl-ds-implement` for that file only. Other code files unchanged. |
| **redo** | Delete `.sl-ds-cache/sl-ds-impl/tokens-*.json`. Invoke `/sl-ds-tokens --force`. Then invoke `/sl-ds-implement --force` (regenerates styles + all components that may reference changed CSS vars). |
| **skip** | Log to update-result.json: `{ category: "tokens-only", action: "skip", note: "Code now uses cached tokens; Figma diverges." }`. No file modification. |

### 2.2 Layout-only (nodes moved/resized, no add/remove)

| Mode | Action |
|---|---|
| **update** | For each `moved`/`resized` node, find the corresponding component's SCSS file (via `component-map.json` → nodeId → component selector → `.scss` path). Patch the geometric values (width/height/margin/padding tokens). WIP commit per file. |
| **overwrite** | Regenerate ALL `.scss` files in this screen via `/sl-ds-implement --files=scss-only`. Custom CSS lost. |
| **redo** | Re-run `/sl-ds-plan --force` (might re-decide nesting) + `/sl-ds-implement --force`. |
| **skip** | Log + no action. |

### 2.3 Assets-only (icons/images changed)

| Mode | Action |
|---|---|
| **update** | For each `added` icon: try `search_design_system`; if match → patch template to use new `<sl-icon name>`. If no match → download SVG, patch template. For `removed`: warn user but don't auto-remove (icon may still be in use legitimately). |
| **overwrite** | Replace `icons.json` entirely. Regenerate the components that use icons (per `component-map.json`). |
| **redo** | Equivalent to overwrite for assets. |
| **skip** | Log + no action. |

### 2.4 Structural (nodes added/removed)

| Mode | Action |
|---|---|
| **update** | Per-node plan:<br>• `added` node → propose new component file + spot in parent component's template. User reviews/approves each.<br>• `removed` node → propose deletion of the corresponding component file + removal from parent template. User confirms.<br>This is interactive and slow — for users who don't want a full regen. |
| **overwrite** | Invoke `/sl-ds-plan --force` (rebuilds `architecture.json` + `component-map.json` from fresh tree) then `/sl-ds-implement --force` (regenerates all code). Manual code edits lost. |
| **redo** | Same as overwrite for structural — there's no meaningful difference since structural changes require architecture re-thinking. |
| **skip** | Log + warn — code structure now diverges from Figma. Subsequent `/sl-ds-verify` will likely fail geometric for added regions. |

### 2.5 Mixed

`mixed` means multiple non-empty categories. Strategy:
- Ask per category in the order: structural > layout > tokens > assets
- Each category can have its own mode
- If user picks `redo` for any category → other categories implicitly get redone too (offer to chain)

### 2.6 Renames

Handled separately (see [`diff-strategy.md`](diff-strategy.md) §4). Modes:

| Mode | Action |
|---|---|
| **stable** (default) | Update cached name mapping; don't touch code |
| **refactor** | Run code refactor: rename files + selectors + imports. Show diff before applying. |
| **decide** | Loop through each rename, ask user per item |

## 3. Action mechanics — concrete steps

### 3.1 Update tokens-only example

```bash
# Step A: Patch tokens-verified.json
node -e "
  const fs = require('fs');
  const tv = JSON.parse(fs.readFileSync('.sl-ds-cache/sl-ds-impl/tokens-verified.json'));
  const diff = JSON.parse(fs.readFileSync('.sl-ds-cache/sl-ds-impl/update-diff.json'));

  for (const c of diff.tokens.changed) {
    tv.tokens[c.path].value = c.to;
  }
  for (const a of diff.tokens.added) {
    tv.tokens[a.path] = { value: a.value, themeOverride: true, evidenceNodeIds: [] };
  }
  for (const r of diff.tokens.removed) {
    delete tv.tokens[r.path];
  }
  tv.inputs.figmaLastModified = diff.figmaLastModifiedTo;

  fs.writeFileSync('.sl-ds-cache/sl-ds-impl/tokens-verified.json', JSON.stringify(tv, null, 2));
"

# Step B: Patch styles.scss
# Open styles.scss, locate each CSS var, update value
# (Use grep + sed, or have a sub-agent edit the file)

# Step C: WIP commit
git add .sl-ds-cache/sl-ds-impl/tokens-verified.json <targetScope>/src/.../styles.scss
git commit -m "wip(sl-ds): update tokens [sl-ds-update]"
```

### 3.2 Overwrite tokens-only example

```bash
# Step A: Replace tokens-verified.json with fresh snapshot
cp .sl-ds-cache/sl-ds-impl/figma-snapshot.json .sl-ds-cache/sl-ds-impl/tokens-verified.json
# (Re-envelope it to match tokens-verified schema if needed)

# Step B: Delete styles.scss
rm <targetScope>/src/.../styles.scss

# Step C: Invoke /sl-ds-implement (it'll recreate styles.scss from new tokens)
# (Via Skill tool or instruct user to run it)
```

### 3.3 Redo structural example

```bash
# Step A: Invalidate downstream caches
rm .sl-ds-cache/sl-ds-impl/{architecture,component-map}.json

# Step B: Invoke /sl-ds-plan --force
# Step C: Invoke /sl-ds-implement --force
# Step D: Invoke /sl-ds-verify
```

## 4. Recommended defaults per category (the ⭐ option)

Based on user safety + cost balance:

| Category | Recommended | Why |
|---|---|---|
| tokens-only | ⭐ **update** | Smallest blast radius; tokens are mechanical |
| layout-only | ⭐ **update** | Geometric tweaks rarely need code restructure |
| assets-only | ⭐ **update** | Icon swap is local |
| structural | ⭐ **redo** | Structural changes need architecture re-thinking; surgical update is error-prone |
| mixed | per-category recommended above | Compose |
| renames | ⭐ **stable** | Code naming should be intentional, not Figma-driven |

The orchestrator MUST present these as the starred option. User can pick differently — but the default is the safest choice for that category.

## 5. Rollback mechanics

Always available because Step 1 of /sl-ds-update archives state:

```bash
# Print at end of update-result.json
echo "To rollback this update:"
echo "  cp .sl-ds-cache/sl-ds-impl/_archive/<ts>/*.json .sl-ds-cache/sl-ds-impl/"
echo "  # Then manually revert code changes via: git revert <commits>"
```

The orchestrator should include this command literally in the summary. User decides if they need it.

**Note:** rollback restores `.sl-ds-cache/` but NOT the code files. To fully undo, also `git revert` the WIP commits this skill created (their SHAs are in `update-result.json`).

## 6. What NOT to do

- ❌ Don't apply actions silently — every category needs explicit user choice
- ❌ Don't auto-rename code files just because Figma renamed nodes — that's a separate refactor decision
- ❌ Don't skip the archive (Step 1) "to save time" — the archive is the safety net
- ❌ Don't combine `redo structural` with `update tokens` — if you're doing structural redo, tokens come along for the ride
- ❌ Don't write code edits without WIP commits — traceability vanishes
- ❌ Don't leave `.sl-ds-cache/_archive/` to grow forever — `/sl-ds-setup --reset` (or a periodic cleanup) prunes archives older than 30 days (TBD, not MVP)
