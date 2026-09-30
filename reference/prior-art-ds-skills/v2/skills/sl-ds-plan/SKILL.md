---
name: sl-ds-plan
description: |
  USE WHEN: tokens-verified.json exists for current Figma URL, user wants to plan the implementation (component structure + data flow + visual specs) before generating code, or says "plan", "rozplanuj", "architecture", "decompose", or follows /sl-ds-tokens successfully.
  DOES: Combined planning skill — reads codebase + tokens + node-tree, fetches get_design_context per major Figma node, performs CLUSTER DETECTION (similar Figma instances → 1 template), plans DATA LAYER (services, mocks, consumers), writes per-component SPEC inline. Output: ONE PLAN.md (human-readable, reviewable, persistent) + machine cache. Adaptive granularity by scope (SMALL = 1 phase, LARGE = N phases). Replaces sl-ds-architecture + spec generation in one skill.
  NEVER USE WHEN: sl-ds-tokens hasn't run yet — there's nothing to plan against. Or when user wants to write code directly — that's /sl-ds-implement (which reads PLAN.md as its primary input).
version: 2.1.0
model: opus
tags: [sl-ds, plan, planning, architecture, cluster-detection, data-layer, spec, components]
next:
  on_success: [sl-ds-implement]
  on_failure: [sl-ds-help, sl-ds-tokens]
  related: [sl-ds-layout, sl-ds-audit]
requires:
  artifacts:
    - .sl-ds-cache/sl-ds-impl/codebase-analysis.json
    - .sl-ds-cache/sl-ds-impl/tokens-verified.json
    - .sl-ds-cache/sl-ds-impl/node-tree.json
  skills_completed: [sl-ds-setup, sl-ds-tokens]
produces:
  artifacts:
    - .sl-ds-cache/sl-ds-impl/PLAN.md
    - .sl-ds-cache/sl-ds-impl/architecture.json
    - .sl-ds-cache/sl-ds-impl/component-map.json
  decisions: [context/foundation/sl-ds-decisions/<screen>.md]
cache:
  invalidate_on: [figma_lastModified]
  reuse_if:
    - .sl-ds-cache/sl-ds-impl/PLAN.md
    - .sl-ds-cache/sl-ds-impl/architecture.json
token_budget: "30-60K"
sub_agents:
  - name: cluster-detector
    subagent_type: general-purpose
    model: sonnet
    purpose: Detect similar Figma instances by signature; group as templates with N instances. Optional for SMALL scope.
  - name: data-flow-planner
    subagent_type: general-purpose
    model: sonnet
    purpose: Identify services needed + consumer hierarchy. Plans mock data + real-API migration path.
  - name: ds-component-mapper
    subagent_type: general-purpose
    model: sonnet
    purpose: Call search_design_system per element type; classify each as sl-ds-component / plain-div / html-text / asset-image
lessons_read: true
fe_standards_consulted:
  primary: [architecture.md, components.md, data-and-state.md]
  rule_ids: [ARCH-1, ARCH-3, ARCH-4, COMP-1, COMP-3, COMP-4, STATE-1, STATE-2, STATE-3, DATA-1, DATA-3]
---

# DS Plan — Combined Planning (Architecture + Cluster + Data Layer + Spec)

## Purpose

The bridge between "Figma analyzed" and "code written." Combines into ONE step:
1. **Architecture decisions** — structure, routing, layout strategy
2. **Cluster detection** — similar Figma instances → 1 reusable component template
3. **Data layer plan** — services, mocks, consumer hierarchy with real-API migration path
4. **Per-component SPEC** — visual spec from get_design_context (the primary source of truth for visual fidelity)

Output: ONE `PLAN.md` file (human-readable, reviewable, git-committed) + machine cache. The Plan is the **single source of truth** that `/sl-ds-implement` reads when generating code — sub-agent implementers do NOT read raw Figma, they read PLAN.md.

**Why combined:** v4 monolithic worked well because sub-agent had FULL context. Granular split (cluster + data + spec as separate skills) fragmented context, sub-agents lost cross-component coherence. This skill restores cohesion by planning everything in one orchestrator session.

## When to use

- `/sl-ds-tokens` just completed → time to plan code
- User explicitly invokes `/sl-ds-plan`
- `/sl-ds` router routed here from `tokens-done` state
- Re-running after Figma change (`--force` flag)

## When NOT to use

- `PLAN.md` exists for current `figmaLastModified` → skip, proceed to `/sl-ds-implement`
- User wants to write code → `/sl-ds-implement` (reads PLAN.md)
- Tokens not verified → run `/sl-ds-tokens` first (refuses without)

## Preconditions

| Required | If missing |
|---|---|
| `.sl-ds-cache/sl-ds-impl/codebase-analysis.json` | STOP → `/sl-ds-setup` |
| `.sl-ds-cache/sl-ds-impl/tokens-verified.json` | STOP → `/sl-ds-tokens` |
| `.sl-ds-cache/sl-ds-impl/node-tree.json` | STOP → `/sl-ds-tokens` |

## Inputs

| Field | Required | Description |
|---|---|---|
| `figmaUrl` | yes | Screen URL with node-id |
| `screenName` | no | Kebab-case ID; defaults to derived |
| `--force` | no | Bypass cache, full re-plan |

## Workflow

**Pre-flight:** read applicable lessons from `context/foundation/sl-ds-lessons.md`. Scope fe-standards per primary `architecture.md` + `components.md`.

### Step 1: Cache check

If `PLAN.md` exists AND `figmaLastModified` unchanged AND no `--force` → CACHE HIT, print summary, EXIT.

### Step 2: Scope assessment (drives granularity)

Read `scope.json` (from `/sl-ds-tokens`):
- `nodeCount < 30` → **SMALL scope** — single phase, minimal sub-agents
- `30 <= nodeCount < 80` → **MEDIUM** — 2-3 phases, 2-3 sub-agents
- `nodeCount >= 80` → **LARGE** — 3+ phases, full sub-agent split

Stored as `planSize: 'small' | 'medium' | 'large'`.

### Step 3: DS component mapping (per element type)

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — ds-component-mapper

Same as before — call `search_design_system` per element type, classify each node:
- `sl-ds-component` (with exact slot structure)
- `plain-div` (layout container)
- `html-text` (h1, p, span)
- `asset-image` (img with downloaded asset)
- `sl-ds-icon` (sl-icon with name)
- `custom-svg` (no DS match)

**Output:** `component-map.json` (machine). Must complete before Step 4.

### Step 4: Cluster detection (for MEDIUM+ only)

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — cluster-detector

For SMALL: orchestrator does inline (no sub-agent needed).

Sub-agent reads `node-tree.json` + `component-map.json` (produced by Step 3), computes signature per visual instance:

```
signature(instance) = {
  dimensions: round(w/10)*10 × round(h/10)*10,   // bucket 10px
  dsComponent: 'sl-card' | 'sl-button' | ...,
  slotStructure: hashOrderedList([slot names present]),
  orientation: 'horizontal' | 'vertical' | null,
}
```

Group instances by signature:
- **Multi-instance cluster** (≥ 2 instances) → ONE template + N data rows
- **Single-instance cluster** → unique component

Edge cases:
- Same signature but **different visual content** (different text/badge color) → STILL 1 template + data variations
- Same signature but **different parent context** (one in topbar, one in content) → 2 templates (semantic distinction)
- Slight dimension diff (>10% off bucket) → 2 templates

**Output:** `clusters.json` + `clusters.md` (human-readable list).

### Step 5: Data layer plan

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — data-flow-planner

Per data type in node-tree (book covers, chapters, topics, users, etc.):

```json
{
  "services": [{
    "name": "ChapterService",
    "path": "apps/<scope>/src/app/services/chapter.service.ts",
    "model": "Chapter",
    "methods": [
      { "name": "getById", "params": "id: string", "returns": "signal<Chapter | null>" },
      { "name": "list", "params": "bookId: string", "returns": "signal<readonly Chapter[]>" }
    ],
    "stateType": "signal",
    "mockDataPath": "apps/<scope>/src/app/services/mocks/chapter.mock.ts",
    "realApiMigration": "Replace mock import with inject(HttpClient); methods → http.get<T>(...)"
  }],
  "consumers": {
    "<page>": {
      "isSmartContainer": true,
      "injects": ["ChapterService", "BookService"],
      "passesToChildren": { "max-book-card": "book", "max-topic-grid": "chapter.topics" }
    },
    "<leaf-component>": {
      "isSmartContainer": false,
      "receivesProps": ["topic: Topic"],
      "viaInputSignal": true
    }
  }
}
```

**Mandatory rules:**
- **NO hardcoded data in components.** Smart containers inject services. Leaves receive `input.required<T>()` signals.
- **Mock data lives in separate `mocks/*.ts` files** — easy swap when real API ready
- **Services use `signal<T>` state** for reactivity + Angular zoneless compatibility

**Output:** `data-plan.json` + `data-plan.md` (human-readable).

### Step 6: Per-component SPEC inline (orchestrator + design_context)

**Executor:** orchestrator on **opus**

For each component in cluster list (Step 4 output):

1. Identify representative Figma node (first instance of cluster)
2. Call `mcp__claude_ai_Figma__get_design_context` for that node
3. **ALSO read absolute position from `node-tree.json`** for that node — include `x`, `y`, `w`, `h`, and `parent_node` in the spec
4. **Inline NEEDS_CLARIFICATION (MANDATORY):** whenever an ambiguity or open question arises for a specific component (e.g. `get_design_context` returned incomplete data, slot structure unclear, icon name unknown), inject it **inline** directly under the component's heading as:
   ```
   > ⚠️ NEEDS_CLARIFICATION: <question>
   ```
   AND add the component heading a ` ⚠️` suffix (e.g. `#### Component: max-topic-card ⚠️`).
   The "Open questions" section at the bottom of PLAN.md is a duplicate for human review — it is NOT the primary location. Sub-agents in `/sl-ds-implement` scan inline `⚠️` only (they receive only their phase sections, not the whole file).
5. Generate inline SPEC entry in PLAN.md:

   **CSS var naming — TWO formats, strict separation:**

   | Context | Format | Example |
   |---|---|---|
   | SPEC description text (Visual spec section) | Raw Figma token path with `/` | `padding: var(--space/300, 24px)` |
   | Template structure / CSS code snippets | Fully transformed `--sl-*` name | `padding: var(--sl-size-300, 24px)` |

   Apply `token-name-transform.md` exactly: prepend `--sl-`, replace `/` with `-`. Exceptions: `space/*` → `--sl-size-*`; `size/borderRadius/*` → `--sl-size-borderRadius-*` (capital R); font tokens → `--sl-text-new-typeset-fontFamily-*` (capital F), `--sl-size-text-new-*`.

   > ⚠️ **HARD GATE — legacy codebase CSS is FORBIDDEN as a token source:**
   > DO NOT read existing CSS files (`styles.css`, `secondary-view-page.css`, `desktop-*.css`, component CSS files) for token naming convention. The codebase contains LEGACY wrong tokens (`--color-*`, `--space-new-*`, `--font-family-*`, `--elevation-*`, `--border-radius-*`) that do NOT have `--sl-` prefix and resolve to OUTDATED values.
   > Every CSS var name in Template structure / code snippets MUST be verified against light.css:
   > `grep -c "<var-name>" node_modules/@sl-design-system/sanoma-learning/light.css`
   > Count 0 → var does NOT exist — use fallback value directly instead.

```markdown
#### Component: max-topic-card

**Source:** Figma 118:22516 (1 of 9 instances in cluster `topic-card-default`)
**Reusable:** YES — 9 instances per chapter, varies by data (title + badge)

**Figma position:**
- node: 118:22516 (within parent 118:22572 grid container)
- x: 24px (relative to parent grid)
- y: 24px
- w: 405px
- h: 104px
- tolerance: ±0px (DS card, dimensions fixed by design)

### Props
- `topic: Topic` — required, via input signal

### Visual spec (from get_design_context)

- Dimensions: 100% width × 104px height (no explicit max)
- Padding: var(--space/300, 24px)
- Border: 1px solid var(--color/border/plain, #d0d9e0)
- Border radius: var(--size/borderRadius/default, 4px)
- Title font: var(--text-new/typeset/fontFamily/heading) Roboto Medium 500
- Title size: var(--size/text-new/heading/md, 16px)
- Title color: var(--color/foreground/bold, #222)

### Figma absolute position (REQUIRED in v2.1)
- x: <from node-tree.json>
- y: <from node-tree.json>
- w: <from node-tree.json>
- h: <from node-tree.json>
- parent_node: <id of parent frame for relative positioning context>

### Position tolerance
- Δx: ±2px (layout containers), ±0px (DS components)
- Δy: ±2px (layout containers), ±0px (DS components)
- Δw: ±2px (responsive width allowed), ±0px (fixed components)
- Δh: ±2px (content-driven height allowed), ±0px (icons)

### DS components used

- sl-card (default vertical orientation, no `orientation` attr)
- sl-badge (color from data, size="lg")

### Template structure (Angular adapted from React reference)

\`\`\`html
<sl-card data-figma-id="118:22516">
  {{ topic().title }}
  <sl-badge slot="header" [attr.color]="topic().badgeColor" size="lg">
    {{ topic().badgeLabel }}
  </sl-badge>
</sl-card>
\`\`\`

### NOT included (explicit absences)

- ❌ No icon/media slot (Figma has none)
- ❌ No subtitle, body, actions
- ❌ No inline hover effect (sl-card handles)

### Example data variations

| variant | title | badgeLabel | badgeColor |
|---|---|---|---|
| knowledge | "Opdracht 1" | "Kennis" | yellow |
| skill | "Opdracht 3" | "Vaardigheid" | blue |
| test | "Quiz 1" | "Toets" | red |

### Grid position note (Leefwereld example)
- Figma y=504 for the Leefwereld feature card means it is **row 5 within the parent grid** — NOT appended after all topic cards
- Implementer MUST place this card at its correct grid row (interleaved between topic cards), not at the end of the list
```

Repeat for every component identified. Each SPEC section in PLAN.md is **self-contained** — `/sl-ds-implement` can implement that component reading just its section.

> ⚠️ **MANDATORY: every component MUST have a `### CSS` block.** If Figma data is insufficient to derive all values, generate a best-effort block from SLDS defaults. An absent CSS block forces the implementer to invent styles — this produces wrong colours/spacing. Minimum content: `:host { display: block; }` + any layout, colour, or spacing rules visible in the SPEC. Use `### CSS (transformed --sl-* names, verified against light.css)` as the heading.

---

#### sl-card API reference (load when any component uses sl-card)

**Slots** (top → bottom in rendered output):

| Slot name | Position | Typical content |
|---|---|---|
| `slot="media"` | Top/left (depends on orientation) | `<img>` — confirmed in SLDS source |
| default slot | Title row | Primary text / heading |
| `slot="header"` | Below title | Badges, meta chips — renders **after** default slot |
| `slot="body"` | Body text row | Longer description |
| `slot="actions"` | Bottom | `<sl-button>` action(s) |

> ⚠️ `slot="header"` renders **below the title** (default slot), NOT above. Name is misleading. Correct for badges that should appear under the title.

**CSS custom properties** (use these to override sl-card styles from outside):

| Property | Effect |
|---|---|
| `--sl-card-media-size` | Width of media area in horizontal cards (e.g., `240px`) |

**`::part()` — NOT available.** `sl-card` does not export `::part(base)`, `::part(body)`, or any named CSS parts. Do NOT write `sl-card::part(base) { ... }` — it silently has no effect. Card background, border, and padding come from sl-card's internal use of `--sl-*` tokens and cannot be overridden via `::part()`. To override card styling, set the relevant `--sl-*` token on a host ancestor.

**Badge/chip width in `slot="header"`**: by default `slot="header"` renders as block, stretching slotted content to full card width. To make badges hug their content, wrap them:
```html
<div class="card-badges" slot="header">
  <sl-badge color="yellow" size="lg">Kennis</sl-badge>
</div>
```
```css
.card-badges { display: flex; gap: var(--sl-size-050, 4px); }
```

---

### Step 7: Phase split (for LARGE scope only)

For SMALL/MEDIUM: skip — PLAN.md is one phase.

For LARGE: orchestrator on opus groups SPECs into 2-3 phases:

```markdown
## Phase 1: Foundation (1-3 hours of work)
- Layout files (shell, primary-layout, secondary-layout)
- Models (Book, Chapter, Topic)
- Services (mock data)
- Smart container page (orchestrates services + passes data)

## Phase 2: Content components
- max-book-card, max-chapter-accordion, max-chapter-header
- max-topic-grid, max-topic-card
- (Verify after Phase 2 — user reviews + decides if Phase 3 needed)

## Phase 3 (optional): Feature variants
- max-feature-card-image (Leefwereld variant)
- max-cta-card (Test jezelf variant)
- Polish + edge cases
```

User can opt-in phase-by-phase. After Phase 1 → user reviews → continue or revise plan.

### Step 8: Write PLAN.md (consolidated)

**Executor:** orchestrator on opus

Combine all into ONE `.sl-ds-cache/sl-ds-impl/PLAN.md`:

```markdown
---
plan_version: "2.1"
plan_schema: "v2"
plan_hash: "<sha256-of-this-file-content-computed-after-writing>"
last_implemented_plan_hash: ""
figma_url: <url>
figma_file_key: <key>
figma_last_modified: <iso>
target_scope: apps/<scope>
screen_name: <kebab-case>
plan_size: small | medium | large
phases:
  - id: 1
    name: "<Phase name, e.g. Foundation>"
    status: planned
    filesToCreate:
      - path: "apps/<scope>/src/app/features/<feature>/<file>.ts"
        type: component|service|model|route|barrel
    components:
      - id: "MaxComponentName"
        nodeId: "118:22516"
        status: pending
clusters_detected: <N>
components_total: <N>
services_total: <N>
position_strategy: "absolute" | "relative" | "flex-grid"
created: <date>
status: planned | in-progress | implemented | verified
---

<!-- position_strategy values:
  absolute  = uses Figma x/y exactly (rare, fixed-position layouts)
  relative  = positioned in container's natural flow
  flex-grid = via CSS grid/flex (most components — default)
-->

# PLAN — <Screen Name>

## Overview
<one-paragraph summary>

## Architecture decisions
- Structure: per-feature / per-type / hybrid
- State approach: signal-store / service / static
- Routing: lazy / eager
- Layout strategy: new-variant / reuse-extend / standalone

## Cluster detection summary
<table of clusters: signature → template → instance count>

## Data layer plan
<services + consumers from data-plan.json>

## Components (specs inline)

### Phase 1
#### Component: max-app-shell
<full spec per Step 6 above>

#### Component: max-secondary-layout
<full spec>

#### Service: ChapterService
<full spec including method signatures + mock file path>

### Phase 2
#### Component: max-book-card
<full spec>

[... etc ...]

## Open questions / clarifications needed
- <if get_design_context returned ambiguous results, list here for user to confirm>

## Verification thresholds (for /sl-ds-verify)
- Pixelmatch global: < 0.5% diff
- Strict zones (layout, colors): 0% diff
- Relaxed zones (text rendering): < 5% diff
```

**plan_schema v2 fields (MANDATORY):**

- `plan_schema: "v2"` — signals to `/sl-ds-implement` that the contract is met; pre-flight will STOP without this field.
- `plan_hash` — compute SHA-256 of the full PLAN.md content after writing; write the hex string into this field. Purpose: `/sl-ds-implement` uses this to detect stale plans. **Two-pass:** first write the file with `plan_hash: ""` (empty placeholder), compute hash over that content, then overwrite only the `plan_hash` field with the computed hex. This avoids the circular dependency where the hash field is part of the hashed content.
- `last_implemented_plan_hash: ""` — left empty; `/sl-ds-implement` writes its own hash here on first run.
- `phases[].filesToCreate[]` — MANDATORY per phase; list every file this phase will create with `path` (repo-relative) and `type`. Array may be empty `[]` if a phase creates no files (rare), but the field MUST exist.
- `phases[].components[].nodeId` — MANDATORY per component; the Figma node ID as a string (e.g. `"118:22516"`). DO NOT omit or set to null.

Also write decision doc to `context/foundation/sl-ds-decisions/<screen>.md` (high-level summary for git history).

### Step 9: User review gate (interactive)

Print PLAN.md summary + ask user via `AskUserQuestion`:

```
"PLAN.md ready (X components, Y services, Z phases). Review?"
  ⭐ Approve — proceed to /sl-ds-implement
  Review PLAN.md myself (terminal/editor) — I'll wait
  Revise specific section — tell me which
  Abort — exit
```

If "Approve" → return summary + redirect to `/sl-ds-implement`.

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-impl/PLAN.md` | **Primary output** — human-readable, reviewable, source of truth |
| `.sl-ds-cache/sl-ds-impl/architecture.json` | Machine-readable summary |
| `.sl-ds-cache/sl-ds-impl/component-map.json` | DS component classification per node |
| `.sl-ds-cache/sl-ds-impl/clusters.json` | Cluster signatures + instance lists |
| `.sl-ds-cache/sl-ds-impl/data-plan.json` | Service definitions + consumer hierarchy |
| `context/foundation/sl-ds-decisions/<screen>.md` | High-level decision summary (committed) |

## Hard gates

- Codebase non-Angular → STOP (v1 = Angular only)
- get_design_context fails for a cluster representative → re-try with smaller node; if persistent failure → mark cluster as NEEDS_CLARIFICATION in PLAN.md
- More than 50% nodes classified as `custom-svg`/`plain-div` (DS coverage <50%) → WARN, suggest verifying SLDS version
- User picks "Revise" but doesn't say what → STOP, ask follow-up
- A component spec missing Figma absolute position → STOP (re-fetch from node-tree.json)
- A component placed outside its Figma parent frame in PLAN.md → STOP (architectural mismatch)
- **NEEDS_CLARIFICATION about slot names or component API** → resolve BEFORE writing PLAN.md by reading `node_modules/@sl-design-system/<pkg>/src/<pkg>.js` (grep for `slot name=`) or calling `get_code_connect_map`. A `NEEDS_CLARIFICATION` left unresolved in the published plan forces the implementer to guess — this produces wrong HTML structure. Slot names confirmed by source: `sl-card`: media / default / header / body / actions; `sl-button`: prefix / suffix / default.
- **NEEDS_CLARIFICATION about icon names** → check the sanoma-learning registry BEFORE writing: `grep -o '"[a-z][a-z-]*"' node_modules/@sl-design-system/sanoma-learning/icons.js`. If a required icon is absent, flag it as an icon-registration task in PLAN.md (not as NEEDS_CLARIFICATION) with a resolution note: "Register via `Icon.register()` in `main.ts` — see `generation-rules.md §6`."

## Component Scope Mode

Triggered when dispatched from `/sl-ds` with `scope: "component"` (explicit `--scope=component` flag, or auto-detected `COMPONENT` / `COMPONENT_SET` node type).

**Modified preconditions:** `codebase-analysis.json`, `tokens-verified.json`, and `node-tree.json` still required — but only for the target nodeId (not a full screen scan).

**Step differences from normal flow:**

| Step | Normal mode | Component scope mode |
|---|---|---|
| Step 2 (Scope assessment) | Uses `scope.json` nodeCount | Always `SMALL` — skip threshold check |
| Step 3 (DS component mapping) | Full node-tree | Only target nodeId + direct children |
| Step 4 (Cluster detection) | Groups similar instances | **SKIPPED** — single component has no clusters |
| Step 5 (Data layer plan) | Full service hierarchy | **SKIPPED** — no cross-component service hierarchy needed |
| Step 6 (SPEC generation) | All components in cluster list | Directly for target `nodeId` only |
| Step 7 (Phase split) | For LARGE scope | **SKIPPED** — always single phase |
| Step 8 (Write PLAN.md) | Multi-component, multi-phase | 1 phase, 1 component, `services_total: 0` |

The resulting PLAN.md has `plan_size: small`, one phase, one component. `/sl-ds-implement` receives it as a normal Phase 1.

## Resume

Resume per `_shared/resume-discipline.md`. Checkpoints:
- After Step 3 (component-map.json exists) → resume Step 4
- After Step 4 (clusters.json exists) → resume Step 5
- After Step 5 (data-plan.json exists) → resume Step 6
- After Step 8 (PLAN.md exists, status=planned) → resume Step 9 (user review)

If `PLAN.md` exists with `status: in-progress` → orchestrator detects and asks user: continue planning or restart?

## Next

After successful completion:
- **Most likely next:** `/sl-ds-implement` — reads PLAN.md and writes code
- **Alternative:** `/sl-ds-audit` if user only wanted to plan, not yet build

## References

| File | Load when |
|---|---|
| `references/codebase-scan.md` | Step 3 — DS component mapping rules |
| `../_shared/framing-discipline.md` | Step 9 — user review gate |
| `../_shared/lessons-format.md` | Pre-flight — applicable lessons |
| `../../standards/fe/architecture.md` | Steps 2-4 — ARCH-* rules |
| `../../standards/fe/components.md` | Step 3 — COMP-* rules |
| `../../standards/fe/data-and-state.md` | Step 5 — STATE-* + DATA-* rules |
| `../_shared/cache-schema.md` | Step 8 — PLAN.md schema |
| `../_shared/token-name-transform.md` | Step 6 — CSS var naming context (SPEC uses raw names; transform applied by /sl-ds-implement) |
