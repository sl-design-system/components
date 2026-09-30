---
name: sl-ds-tokens
description: |
  USE WHEN: user provides a Figma URL and says "extract tokens", "get tokens", "ściągnij tokeny", "pobierz tokeny z figmy", or follows /sl-ds-layout successfully, or any downstream skill (sl-ds-implement, sl-ds-verify) needs tokens that aren't cached.
  DOES: Extracts ALL design tokens from ALL visual node types via get_variable_defs (NOT 2-3 samples — exhaustive). Verifies (cross-node consistency, no fallback values, DS vocabulary check). Downloads icons + image assets. Cache-aware — skipped entirely if tokens-verified.json exists AND figmaLastModified unchanged.
  NEVER USE WHEN: tokens-verified.json exists AND figmaLastModified is the same as cached — there's nothing to do. Or when /sl-ds-layout hasn't run for a multi-screen file — layout decisions affect which screens we even tokenize.
version: 1.0.0
model: sonnet
tags: [sl-ds, figma, tokens, extract, verify, cache, icons, assets]
next:
  on_success: [sl-ds-plan]
  on_failure: [sl-ds-help, sl-ds-update]
  related: [sl-ds-layout, sl-ds-update]
requires:
  artifacts: [.sl-ds-config.yaml]
  skills_completed: [sl-ds-setup]
produces:
  artifacts:
    - .sl-ds-cache/sl-ds-impl/node-tree.json
    - .sl-ds-cache/sl-ds-impl/tokens-raw.json
    - .sl-ds-cache/sl-ds-impl/tokens-verified.json
    - .sl-ds-cache/sl-ds-impl/icons.json
    - .sl-ds-cache/sl-ds-impl/assets.json
    - .sl-ds-cache/sl-ds-impl/scope.json
  decisions: []
cache:
  invalidate_on: [figma_lastModified]
  reuse_if:
    - .sl-ds-cache/sl-ds-impl/tokens-verified.json
    - .sl-ds-cache/sl-ds-impl/node-tree.json
    - .sl-ds-cache/sl-ds-impl/icons.json
token_budget: "10-28K"
sub_agents:
  - name: token-extractor
    subagent_type: general-purpose
    model: sonnet
    purpose: Call get_variable_defs across ALL unique visual node types; write tokens-raw.json
  - name: token-verifier
    subagent_type: general-purpose
    model: sonnet
    purpose: Independent cross-check via get_design_context fallback comparison + consistency gates; writes tokens-verified.json
fe_standards_consulted:
  primary: [styling.md, sanoma-ds.md]
  rule_ids: [STYLE-1, STYLE-2, STYLE-3, STYLE-4, STYLE-5, SDS-5]
---

# DS Tokens — Extract & Verify (Cache-Aware)

## Purpose

Pulls design tokens from Figma in a way that survives. The naive approach — calling `get_variable_defs` on one node and trusting the result — silently fails when the file has theme overrides, when different node types use different token namespaces, or when Figma returns fallback CSS values instead of resolved tokens. This skill makes 5+ calls (one per visual node type), runs an independent verification pass, and applies hard gates that catch the failure modes. Cache discipline keeps re-runs near-free when Figma hasn't changed.

## When to use

- `/sl-ds-layout` just completed for this Figma URL → time to extract tokens
- User asked to re-extract tokens (`--force` flag)
- `tokens-verified.json` doesn't exist for this Figma URL
- `tokens-verified.json` exists but `figmaLastModified` is newer than the cached envelope

## When NOT to use

- Cache is fresh — `tokens-verified.json` exists, envelope matches current `figmaLastModified`. Skip and proceed to `/sl-ds-plan` (the skill itself enforces this in Step 1)
- Tokens not actually needed (e.g. user only wants to audit existing code) → `/sl-ds-audit` reads cached tokens, doesn't extract
- Figma file changed but user wants controlled migration → `/sl-ds-update` (orchestrates the diff first)

## Preconditions

| Required artifact | If missing |
|---|---|
| `.sl-ds-config.yaml` | STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.7 (producer: `/sl-ds-setup`) |
| `.sl-ds-cache/sl-ds-impl/codebase-analysis.json` | STOP per §4.7 (producer: `/sl-ds-setup`) |

`context/foundation/sl-ds-decisions/layout.md` is recommended but NOT required — single-screen files don't need `/sl-ds-layout` first.

## Inputs

**`$ARGUMENTS` (user-provided):**

| Field | Required | Description |
|---|---|---|
| `figmaUrl` | yes | Figma frame URL (specific screen) |
| `--force` flag | no | Skip cache check; re-extract even if fresh |

**Auto-detected:**

- `targetScope` — from `.sl-ds-config.yaml`
- `screenName` — from Figma frame name (kebab-case)

## Workflow

**Pre-flight:** scope fe-standards per [`../_shared/fe-standards-index.md`](../_shared/fe-standards-index.md) §3 (per frontmatter `fe_standards_consulted` — `styling.md` STYLE-1..5 + `sanoma-ds.md` SDS-5). Token-verifier sub-agent (Step 7) loads these in clean context to apply STYLE-2 (zero raw values) and SDS-5 (no-fallback) gates. Record `appliedRules` in tokens-verified envelope per `@_shared/cache-schema.md §8.2`.

### Step 1: Cache check (the most important step)

**Executor:** orchestrator on **sonnet**

Apply the dual-key cache check from [`@_shared/cache-schema.md`](../_shared/cache-schema.md) §2.2 against `.sl-ds-cache/sl-ds-impl/tokens-verified.json`:

1. Read cached envelope (`inputs.figmaLastModified`, `inputs.figmaUrl`, `inputs.nodeTreeHash`)
2. Call Figma `get_metadata` → current `lastModified`
3. If `cachedUrl != inputUrl` → refusal §4.3 (URL mismatch)
4. If `cachedLastModified < currentLastModified` → STOP, redirect to `/sl-ds-update` (Figma changed)
5. If `cachedLastModified == currentLastModified` → spawn lightweight node-tree fetch, compute `sha256(canonical-JSON(nodeTree))`, compare to `cachedNodeHash`:
   - Both match → **CACHE HIT.** Log savings, SKIP to Step 8.
   - Hash differs (Figma metadata lied) → STOP, redirect to `/sl-ds-update`
6. `--force` flag → bypass cache, proceed to Step 2

The cache check is THE feature of this skill. Logged loudly so the user sees the savings:

```text
> 💰 Cache HIT — tokens-verified.json fresh as of <cachedDate>. Figma unchanged (lastModified + node-tree hash both match).
> Skipping extraction (saved ~15K tokens). Next: `/sl-ds-plan`.
```

### Step 2: Build node tree

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — sub-agent, clean context

Pass: `figmaUrl`, reference to [`references/extraction-rules.md`](references/extraction-rules.md) §1.

Sub-agent calls `get_metadata` on the root node, captures ALL descendants with positions. Writes `.sl-ds-cache/sl-ds-impl/node-tree.json`. Sub-agent ALSO computes `nodeTreeHash = sha256(canonical-JSON(nodes-array-sorted-by-id))` and stores it in the envelope's `inputs.nodeTreeHash` field. This hash is reused by every downstream artifact's envelope.

### Step 3: Exhaustive token extraction

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — token-extractor sub-agent, clean context

Pass: `figmaUrl`, `node-tree.json` path, reference to [`references/extraction-rules.md`](references/extraction-rules.md) §2.

**Sub-agent calls `get_variable_defs` on at least 5 representative nodes** — one per visual category (root frame for layout, text node for typography, colored frame for backgrounds, button instance for interactive, card/bordered frame for borders). Merges + deduplicates by token path.

**Output:** `.sl-ds-cache/sl-ds-impl/tokens-raw.json`

### Step 4: Icon extraction

**Executor:** same sub-agent (token-extractor) — continued

For every icon node detected in `node-tree.json`:
1. Extract Figma name → search keyword
2. Call `search_design_system("icon <keyword>")`
3. If match → record DS icon name
4. If no match → download as SVG via `get_screenshot` (SVG format preferred)

**Output:** `.sl-ds-cache/sl-ds-impl/icons.json` — see [`references/extraction-rules.md`](references/extraction-rules.md) §3 for schema.

### Step 5: Image asset extraction

**Executor:** same sub-agent — continued

Decorative/image nodes from `node-tree.json` → download to `<targetScope>/public/images/`. Track in `.sl-ds-cache/sl-ds-impl/assets.json`.

### Step 6: Scope assessment

**Executor:** orchestrator on **sonnet**

Read `node-tree.json`, count:
- Unique node types
- Total visual nodes
- Estimated components

Classify:
- **SMALL:** <30 nodes, <5 components → minimal questions later
- **MEDIUM:** 30-80, 5-10 → standard
- **LARGE:** >80, >10 → warn about split

Write `.sl-ds-cache/sl-ds-impl/scope.json`.

### Step 7: Verify (independent sub-agent)

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — token-verifier sub-agent, **DIFFERENT** clean context (no carryover from extractor)

Pass: `tokens-raw.json` path, `figmaUrl`, reference to [`references/verification-gates.md`](references/verification-gates.md).

Verifier:
1. Calls `get_design_context` on root → gets CSS with fallback values
2. For each token in `tokens-raw.json`: compare resolved vs fallback
3. Cross-node consistency: same token, different `get_variable_defs` call sources → must match
4. DS vocabulary check: color pattern `color/<category>/<variant>`, weights numeric, font names plain strings
5. Gamut check: all hex 6-digit, no `#000`, no named colors

**Hard gates** (verifier fails the run):
- Empty or <5 tokens → FAIL (extraction was too shallow)
- ALL match fallbacks → FAIL (got defaults, not resolved theme)
- Cross-node inconsistency → FAIL (extraction bug — different calls returned different values)
- Invalid format → FAIL

**Output:** `.sl-ds-cache/sl-ds-impl/tokens-verified.json` — only written if all gates pass.

### Step 8: Summary

**Executor:** orchestrator on **sonnet**

Print:

```
> ✅ Tokens extracted + verified
>
> | Metric | Value |
> |---|---|
> | Tokens | 41 (color: 18, spacing: 8, typography: 9, border: 6) |
> | Theme overrides detected | 11 |
> | Icons mapped | 7 DS, 2 custom SVG |
> | Image assets | 3 downloaded |
> | Scope | MEDIUM (47 nodes, 6 components) |
> | Figma lastModified | 2026-06-08T10:00:00Z |
>
> Cache: .sl-ds-cache/sl-ds-impl/tokens-verified.json (fresh)
> Next: `/sl-ds-plan`
```

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-impl/node-tree.json` | Figma node tree with positions (for sl-ds-plan and sl-ds-verify) |
| `.sl-ds-cache/sl-ds-impl/tokens-raw.json` | Pre-verification token bag (debugging artifact) |
| `.sl-ds-cache/sl-ds-impl/tokens-verified.json` | **Source of truth for tokens** — only sl-ds-implement reads from here |
| `.sl-ds-cache/sl-ds-impl/icons.json` | Icon mapping (DS name or custom SVG path) |
| `.sl-ds-cache/sl-ds-impl/assets.json` | Downloaded image references |
| `.sl-ds-cache/sl-ds-impl/scope.json` | Size classification for downstream complexity scaling |

## Hard gates

See [`references/verification-gates.md`](references/verification-gates.md) for full list. Summary:

- **Token count < 5** → likely extraction failed (one node, no themed values)
- **All resolved values == fallback values** → got CSS fallbacks, not real tokens
- **Cross-node inconsistency** → same token has different values across calls (extractor bug)
- **Invalid token format** → `#000` shorthand, named colors, non-numeric weights, fonts with `:Style` suffix

On any gate failure: write `.sl-ds-cache/sl-ds-impl/failure-tokens.json` with diagnostic, STOP, apply [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §3 (hard-gate failure format).

## Resume

Resume per [`../_shared/resume-discipline.md`](../_shared/resume-discipline.md). Progress: `.sl-ds-cache/sl-ds-tokens/progress.json`. Checkpointed steps: Step 3 (per-node `get_variable_defs`), Step 4 (per-icon). Manual fallback table (if `progress.json` missing or corrupt):

| Artifact present | Resume hint |
|---|---|
| `tokens-verified.json` envelope `figmaLastModified` matches current Figma | Step 1 cache check → Step 8 summary, EXIT |
| `tokens-raw.json` exists, `tokens-verified.json` missing | Step 7 (verify only) — extraction already done |
| `node-tree.json` + `icons.json` + `assets.json` exist, `tokens-raw.json` missing | Step 3 (extract tokens) — node tree + icons already done |
| `failure-tokens.json` exists | Step 7 verifier failed previously; read failure, decide: re-extract (`--force`) or abort |
| Nothing | Step 1 (full flow) |

If `tokens-verified.json` exists but `figma_lastModified` in envelope < current Figma → STOP, redirect to `/sl-ds-update`.

## Next

After successful completion:

- **Most likely next:** `/sl-ds-plan` — propose component structure using these verified tokens
- **Alternative:** `/sl-ds-audit` if user just wanted tokens fresh and isn't building code

After hard-gate failure:

- **Most common recovery:** delete `.sl-ds-cache/sl-ds-impl/tokens-*.json`, re-run `/sl-ds-tokens --force`. If consistent failure → likely a Figma file issue (no variables defined, only raw CSS), user needs to fix the file.
- **Fallback:** `/sl-ds-help` for guidance.

## References

| File | Load when |
|---|---|
| [extraction-rules.md](references/extraction-rules.md) | Steps 2-5 — extractor sub-agent contract + Figma MCP call patterns |
| [verification-gates.md](references/verification-gates.md) | Step 7 — verifier sub-agent contract + hard gate definitions |
| [../_shared/cache-schema.md](../_shared/cache-schema.md) | Step 1 — cache envelope format |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Step 1 + hard gates — refusal scenarios §4.3, §3 |
