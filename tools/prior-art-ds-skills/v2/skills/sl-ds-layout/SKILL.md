---
name: sl-ds-layout
description: |
  USE WHEN: user provides a Figma URL with a multi-screen design, says "rozbij layout", "analyze layout", "shared shell", "topbar + sidebar", "design system layout", or is starting a new screen and a layout decision hasn't been made yet for this Figma file.
  DOES: Analyzes ALL pages in the Figma file (not just one frame), identifies shared elements (topbar, navigation, footer) across screens, compares against any existing layout/shell in code, proposes shared shell structure, writes decisions doc.
  NEVER USE WHEN: layout for this Figma file is already decided in sl-ds-decisions/layout.md AND covers the requested screen — use /sl-ds-tokens directly. Or when project has no .sl-ds-config.yaml — use /sl-ds-setup first.
version: 1.0.0
model: opus
tags: [sl-ds, figma, layout, multi-screen, shell, navigation, architecture]
next:
  on_success: [sl-ds-tokens]
  on_failure: [sl-ds-help, sl-ds-setup]
  related: [sl-ds-plan, sl-ds-update]
requires:
  artifacts: [.sl-ds-config.yaml, .sl-ds-cache/sl-ds-impl/codebase-analysis.json]
  skills_completed: [sl-ds-setup]
produces:
  artifacts: [.sl-ds-cache/sl-ds-impl/layout-analysis.json]
  decisions: [context/foundation/sl-ds-decisions/layout.md]
cache:
  invalidate_on: [figma_lastModified]
  reuse_if: [context/foundation/sl-ds-decisions/layout.md]
token_budget: "10-25K"
sub_agents:
  - name: figma-multi-screen
    subagent_type: general-purpose
    model: sonnet
    purpose: Call get_metadata on Figma file root + each page; extract names and frame IDs only (no token extraction)
lessons_read: true
fe_standards_consulted:
  primary: [architecture.md, components.md]
  rule_ids: [ARCH-1, ARCH-2, ARCH-3, ARCH-4, ARCH-5, ARCH-6, ARCH-7, ARCH-8, NAME-1, NAME-2, NAME-3, NAME-4, NAME-5, COMP-2, COMP-3]
---

# DS Layout — Multi-Screen Analysis & Shared Shell

## Purpose

Before generating code for any single screen, decide what's shared across screens (topbar, sidebar, footer, navigation). Looking at one Figma frame misses this — `/sl-ds-layout` looks at the whole Figma file, identifies repeated structures, and proposes a shared shell. The decision is persisted so subsequent `/sl-ds-implement` calls for other screens reuse the shell instead of duplicating it. This is the highest-leverage architectural decision in the pipeline.

## When to use

- Starting a new screen, Figma file you haven't analyzed before
- User pastes a Figma URL that points to a frame in a multi-page file
- `/sl-ds` router routed here from `configured` state
- Existing code has a layout/shell but you suspect it doesn't match what Figma shows

## When NOT to use

- `context/foundation/sl-ds-decisions/layout.md` exists AND covers the requested screen → skip, run `/sl-ds-tokens` directly (this skill is idempotent but adds no value)
- Figma file is single-frame and clearly standalone (e.g. landing page experiment) → still safe to run but overhead unjustified; `/sl-ds-plan` is sufficient
- User wants to redo the layout from scratch because of a Figma update → use `/sl-ds-update` (it knows how to diff)

## Preconditions

| Required artifact | If missing |
|---|---|
| `.sl-ds-config.yaml` | STOP per [`../_shared/refusal-protocol.md`](../_shared/refusal-protocol.md) §4.7 (producer: `/sl-ds-setup`) |
| `.sl-ds-cache/sl-ds-impl/codebase-analysis.json` | STOP per §4.7 (producer: `/sl-ds-setup`) |

Both required — the layout decision is codebase-informed.

## Inputs

**`$ARGUMENTS` (user-provided):**

| Field | Required | Description |
|---|---|---|
| `figmaUrl` | yes | Figma file or frame URL. If frame URL, derive file root for multi-screen analysis. |
| `screenName` | no | Short kebab-case name for THIS screen (e.g. `teacher-dashboard`). Derived from Figma frame name if absent. |

**Auto-detected:**

- `targetScope` — from `.sl-ds-config.yaml` → `project.target_scope`
- `framework` — from `.sl-ds-config.yaml`
- Existing layout components — from `codebase-analysis.json` and direct file system check

## Workflow

**Pre-flight:** read applicable lessons per [`../_shared/lessons-format.md`](../_shared/lessons-format.md) §5.1; scope fe-standards per [`../_shared/fe-standards-index.md`](../_shared/fe-standards-index.md) §3 (per frontmatter `fe_standards_consulted` — `architecture.md` ARCH-1..8 + NAME-1..5, `components.md` COMP-2/COMP-3). Step 5 framing may spawn a sub-agent with the rule subset if scope is MEDIUM/LARGE per `scope.json` OR existing layout conflicts with Figma analysis. Record `appliedRules` + `appliedLessons` in `layout-analysis.json` per `@_shared/cache-schema.md §8.3`.

### Step 1: Check for prior layout decision

**Executor:** orchestrator on **opus**

```bash
test -f context/foundation/sl-ds-decisions/layout.md && cat context/foundation/sl-ds-decisions/layout.md | head -30
```

If layout.md exists AND lists the requested screen under `## Screens covered`:

```
> ✅ Layout already decided for this Figma file. Strategy: <existing-strategy>.
> Shell at: <existing-shell-path>
> Skipping sl-ds-layout. Next: `/sl-ds-tokens`.
```

EXIT successfully. Otherwise → continue.

### Step 2: Scan existing layout in code

**Executor:** orchestrator on **opus**

Read [`references/multi-screen-analysis.md`](references/multi-screen-analysis.md) §1 for exact grep patterns. Look for:

- Routing config: `*.routes.ts`, `app.routes.ts`
- Shell/layout components: `*-shell*.ts`, `*-layout*.ts`, `*-navigation*.ts`, `*-topbar*.ts`, `*-sidebar*.ts`
- Their templates and selectors

Build a picture of what layout structure already exists in code (if any).

**Output (in-memory):** `existingLayout: { hasShell, shellPath, topbar, sidebar, footer, contentSlot }`

### Step 3: Spawn Figma multi-screen sub-agent

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — sub-agent, clean context

Pass to sub-agent:
- `figmaUrl` (file root, not frame)
- Reference: [`references/multi-screen-analysis.md`](references/multi-screen-analysis.md) §2 (Figma MCP call patterns)
- Task: list all pages, identify top 5 by likely-importance (size, name keywords), call `get_metadata` on each, return structure summary

**Sub-agent returns:**

```json
{
  "fileId": "abc123",
  "lastModified": "2026-06-08T10:00:00Z",
  "pages": [
    {
      "name": "Teacher Dashboard",
      "nodeId": "1:185",
      "topElements": [
        { "type": "topbar", "nodeId": "1:186", "h": 64, "matchesOtherPages": true },
        { "type": "content", "nodeId": "1:200", "h": 987, "matchesOtherPages": false },
        { "type": "footer", "nodeId": "1:300", "h": 48, "matchesOtherPages": true }
      ]
    }
  ],
  "sharedElements": [
    { "type": "topbar", "appearsOn": ["Teacher Dashboard", "Student View", "Settings"], "consistency": "exact" },
    { "type": "sidebar", "appearsOn": ["Settings", "Profile"], "consistency": "exact" }
  ]
}
```

`consistency`: `"exact"` (same nodeId / same structure), `"variant"` (similar but with differences), `"unique"`.

**Output:** `.sl-ds-cache/sl-ds-impl/layout-analysis.json`

### Step 4: Compare existing vs Figma

**Executor:** orchestrator on **opus**

For each Figma shared element:
- Is there a matching code shell?
- If yes — does structure match (e.g. Figma topbar has a searchbar, code topbar doesn't)?
- If no — should we add it now (it'll be reused by other screens) or defer?

Build comparison table:

| Element | Figma | Code | Status |
|---|---|---|---|
| topbar | yes (h=64, has searchbar) | yes (h=64, no searchbar) | NEEDS_UPDATE |
| sidebar | yes (only on Settings) | no | NEW (this screen doesn't use it though) |
| footer | yes | no | NEW |

### Step 5: Decide strategy (interactive — uses framing discipline)

**Executor:** orchestrator on **opus**

Apply the three-layer framing pattern from [`../_shared/framing-discipline.md`](../_shared/framing-discipline.md). The user gets to challenge at observation, interpretation, OR proposal level — not just binary yes/no.

#### 5a. Present the framing block

Apply the canonical skeleton from [`../_shared/framing-discipline.md`](../_shared/framing-discipline.md) §6, filled with these specifics for layout strategy:

- **Observation bullets:** Figma page count + page names; pages with shared "Topbar" frame at exact dimensions (list nodeIds); pages with "Sidebar" + "Footer"; existing code shell path + selector + slots; prior `layout.md` coverage status.
- **Interpretation bullets:** whether identical dimensions imply shared-shell candidate (not cosmetic dup); per-screen unique elements (e.g. searchbar); existing shell partial match → which new slots; OR unsuitable existing shell → new variant.
- **Proposed direction:** ONE strategy (`reuse-extend` | `new-variant` | `standalone`) with concrete code locations, cost estimate (~lines), blast radius (other pages affected).
- **Confidence:** HIGH / MEDIUM / LOW per `@_shared/cache-schema.md §2.1` — rationale if not HIGH.

#### 5b. The reframe question

Immediately after the framing block, ask via `AskUserQuestion` (universal four-axis reframe):

```
> Where do you disagree (if anywhere)?
>
> ⭐ All three layers are right — proceed with <Proposed direction>
> The OBSERVATION is incomplete or wrong — I'll tell you what's missing
> The INTERPRETATION is off — facts are right but conclusion wrong
> The PROPOSAL needs adjustment — analysis right, different action preferred
```

#### 5c. Route by axis (handle reframe correctly)

Per [`../_shared/framing-discipline.md`](../_shared/framing-discipline.md) §3:

| User picks | Action |
|---|---|
| All three right | Proceed; record `layoutStrategy` |
| Observation wrong | Ask "What did I miss or get wrong?" (free-form). Update observation set. Re-derive interpretation + proposal. Re-present framing block. |
| Interpretation off | Ask "What's the correct interpretation?" (free-form). Re-derive proposal from user's interp. Skip re-observation. |
| Proposal needs adjustment | Present the original three options (`reuse-extend` / `new-variant` / `standalone`) as a follow-up structured Q with same trade-off prose. Accept user's pick. Observation + interpretation stand. |

Record final decision as `layoutStrategy: "reuse-extend" | "new-variant" | "standalone"`. Persist any user corrections to observation/interpretation in `layout-analysis.json` under `userCorrections: [...]`.

### Step 6: Write decisions doc

**Executor:** orchestrator on **opus**

Write/update `context/foundation/sl-ds-decisions/layout.md`:

```markdown
---
figma_url: <file-root-url>
figma_lastModified: <iso>
target: <targetScope>
created: 2026-06-09
updated: 2026-06-09
pipeline_version: "1.0"
status: in-progress
screens_covered:
  - teacher-dashboard
---

# Layout Decisions

## Strategy
<reuse-extend | new-variant | standalone>

## Shared shell
- path: <apps/<scope>/src/app/layout/shell.ts | "none">
- selector: <max-app-shell | "none">
- imports: <list>

## Shared elements
| Element | Source | DS component | Slot/condition |
|---|---|---|---|
| topbar | shell | sl-navigation, sl-avatar, sl-button, sl-icon | named slot `searchbar` (per-screen) |
| sidebar | settings-shell-variant | sl-navigation | — |
| footer | shell | — | — |

## Screens covered

### teacher-dashboard
- shell: `<max-app-shell>` with `searchbar` slot
- additional: hero, insights, groups, grading

## Per-screen differences

### teacher-dashboard
- searchbar in topbar slot
- hero section (unique)

## Architectural exceptions
_None._
```

### Step 7: Summary + Next

**Executor:** orchestrator on **opus**

Print:

```
> ✅ Layout decided — strategy: <strategy>
>
> Shared shell: <path or "none">
> This screen will use: <shell + slots / standalone>
> Other screens covered: <list>
>
> Decisions written to: context/foundation/sl-ds-decisions/layout.md
> Next: `/sl-ds-tokens` <figmaUrl>
```

## Outputs

| Path | Purpose |
|---|---|
| `.sl-ds-cache/sl-ds-impl/layout-analysis.json` | Machine-readable Figma multi-screen scan |
| `context/foundation/sl-ds-decisions/layout.md` | Human-readable strategy decision (committed) |

## Hard gates

- Figma MCP refuses access (auth issue, URL wrong) → STOP with refusal pointing at Figma config
- Sub-agent (figma-multi-screen) returns 0 pages → likely wrong URL → STOP, ask user to confirm URL
- Existing `layout.md` has `status: completed` but lacks the requested screen → ask user: extend / new-variant / treat as new file
- Strategy chosen is `reuse-extend` but no existing shell found → contradiction, ask user

## Resume

Resume per [`../_shared/resume-discipline.md`](../_shared/resume-discipline.md). Progress: `.sl-ds-cache/sl-ds-layout/progress.json`. Checkpointed steps: Step 3 (per-page figma-multi-screen, up to 6 pages). Step 5 framing is interactive — restart on interrupt. Manual fallback table (if `progress.json` missing or corrupt):

| Artifact present | Resume hint |
|---|---|
| `context/foundation/sl-ds-decisions/layout.md` covers requested screen + `figma_lastModified` matches | Step 1 detects this → idempotent EXIT with summary |
| `.sl-ds-cache/sl-ds-impl/layout-analysis.json` exists, `layout.md` missing or incomplete | Step 4 (compare existing vs Figma) — fresh Figma fetch already done |
| Nothing | Step 1 (fresh) |

If `layout.md` exists but its `figma_lastModified` is older than current Figma → STOP, redirect to `/sl-ds-update` (layout may need reconciling).

If the cached `confidence.level === "low"` in `layout-analysis.json` → re-run fresh fetch regardless of cache; low confidence implies the prior analysis is suspect.

## Next

After successful completion:

- **Most likely next:** `/sl-ds-tokens` with the same Figma URL — extract design tokens
- **Alternative:** if user is editing layout decisions only and not building, may stop here

After hard-gate failure:

- **Recovery:** `/sl-ds-help` for guidance, or re-invoke `/sl-ds-layout` with corrected Figma URL

## References

| File | Load when |
|---|---|
| [multi-screen-analysis.md](references/multi-screen-analysis.md) | Step 2 (grep patterns) + Step 3 (Figma MCP contract for sub-agent) |
| [../_shared/framing-discipline.md](../_shared/framing-discipline.md) | Step 5a/5b/5c — three-layer framing + reframe routing for layout strategy decision |
| [../_shared/lessons-format.md](../_shared/lessons-format.md) | Workflow pre-flight — read sl-ds-lessons.md, filter applicable lessons, carry forward into Step 5 framing |
| [../_shared/questions-format.md](../_shared/questions-format.md) | Step 5 — strategy question (universal four-axis reframe) |
| [../_shared/refusal-protocol.md](../_shared/refusal-protocol.md) | Hard gates |
| [../_shared/cache-schema.md](../_shared/cache-schema.md) | Step 3 + Step 6 — artifact envelopes |
