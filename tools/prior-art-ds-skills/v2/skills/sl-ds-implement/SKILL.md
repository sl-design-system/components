---
name: sl-ds-implement
description: |
  USE WHEN: PLAN.md exists (from /sl-ds-plan), user says "implement", "wygeneruj", "napisz kod", "code it", "build phase X", or follows /sl-ds-plan.
  DOES: Phase-based code generation. Reads PLAN.md as PRIMARY input (NOT raw Figma). One sub-agent per phase with FULL phase context — implements all files of phase together for cohesion. Generates services with mock data layer (no hardcoded data in components). Follows fe-standards mandatory rules. Creates WIP commit per phase. NEVER invents content — if PLAN.md is ambiguous, emit [NEEDS_CLARIFICATION] and surface to user. Uses Code Connect snippets per sl-* component instance — eliminates invented icon names, button variants, slot structures.
  NEVER USE WHEN: PLAN.md missing (run /sl-ds-plan first). Or for read-only audit (/sl-ds-audit). Or for Figma-change patch (/sl-ds-update).
version: 2.2.0
model: sonnet
tags: [sl-ds, implement, code-generation, phase-based, plan-driven, data-layer]
next:
  on_success: [sl-ds-verify]
  on_failure: [sl-ds-help, sl-ds-plan]
  related: [sl-ds-tokens, sl-ds-audit, sl-ds-update]
requires:
  artifacts:
    - .sl-ds-cache/sl-ds-impl/PLAN.md
    - .sl-ds-cache/sl-ds-impl/tokens-verified.json
  skills_completed: [sl-ds-plan]
produces:
  artifacts:
    - .sl-ds-cache/sl-ds-impl/implementation-result.json
  files: "per PLAN.md filesToCreate[] in current phase"
cache:
  invalidate_on: [PLAN.md hash, figma_lastModified]
token_budget: "30-80K per phase"
sub_agents:
  - name: phase-implementer
    subagent_type: general-purpose
    model: sonnet
    purpose: Reads PLAN.md (phase X section only), implements all files of that phase with FULL context for cohesion. One sub-agent per phase, not per file.
lessons_read: true
fe_standards_consulted:
  primary: [angular.md, sanoma-ds.md, components.md, antipatterns.md, styling.md, errors.md]
  rule_ids: [NG-1, NG-4, NG-5, NG-7, NG-8, COMP-1, COMP-3, COMP-4, ARCH-1, ARCH-3, STYLE-1, STYLE-2, STYLE-5, SDS-1, SDS-2, SDS-3, SDS-4, SDS-5, AP-1, AP-3, AP-7]
---

# DS Implement — Phase-Based Code Generation from PLAN.md

## Purpose

Takes the PLAN.md (output of `/sl-ds-plan`) and writes actual code files **phase by phase**. The plan is the single source of truth — sub-agents do NOT read raw Figma, do NOT consult node-tree.json. They read the per-component SPEC inline in PLAN.md and write code deterministically.

**Key principle:** if PLAN.md doesn't explicitly say what something should be, sub-agent emits `[NEEDS_CLARIFICATION]` placeholder instead of inventing. This eliminates the "model makes things up" problem.

## When to use

- PLAN.md just approved by user via `/sl-ds-plan`
- User wants to implement Phase X (typically Phase 1 first, then incremental)
- Re-running after PLAN.md update (with `--force`)
- Resume from interrupted Phase N

## When NOT to use

- PLAN.md missing → run `/sl-ds-plan` first
- User wants to patch existing code from Figma change → `/sl-ds-update`
- User wants audit only → `/sl-ds-audit`

## Preconditions

| Required | If missing |
|---|---|
| `.sl-ds-cache/sl-ds-impl/PLAN.md` | STOP → `/sl-ds-plan` |
| `.sl-ds-cache/sl-ds-impl/tokens-verified.json` | STOP → `/sl-ds-tokens` (cache miss) |
| `.sl-ds-config.yaml` | STOP → `/sl-ds-setup` |

## Inputs

| Field | Required | Description |
|---|---|---|
| `phase` | no | "phase1" / "phase2" / "phase3" — implements specified phase. If omitted, implements next unimplemented phase. |
| `--all` | no | Implement all phases sequentially without user review between them |
| `--force` | no | Overwrite existing files for this phase |

## Workflow

**Pre-flight:**

1. **Schema validation (STOP on failure):** read PLAN.md frontmatter and check:
   - `plan_schema == "v2"` — if missing or not "v2": **STOP** with message: `"PLAN.md uses old schema (no plan_schema: 'v2'). Re-run /sl-ds-plan to generate a v2-compliant plan before implementing."`
   - Every phase in `phases[]` has `filesToCreate` array (may be empty, but field must exist) — if missing: **STOP** with message: `"PLAN.md phase <N> is missing filesToCreate[]. Re-run /sl-ds-plan."`
   - Every component in `phases[].components[]` has `nodeId` (non-null string) — if missing: **STOP** with message: `"PLAN.md component <name> in phase <N> has no nodeId. Re-run /sl-ds-plan."`
2. **Hash check:** verify `plan_hash` matches `last_implemented_plan_hash` (if `last_implemented_plan_hash` is non-empty and differs → warn user that plan was revised since last implementation run).

### Step 1: Phase selection

Read PLAN.md frontmatter:
- `phases: [phase1, phase2, phase3]`
- `current_phase` (resumable)

Determine which phase to implement:
- If user passed `phase: phase2` → that one
- If `current_phase: null` (fresh) → phase1
- If `current_phase: phase1` AND phase1 status=implemented → phase2
- If `--all` → loop phase1 → phase2 → phase3 sequentially

### Step 2: Pre-flight existence check

For all files listed in PLAN.md `phase<N>.filesToCreate`:

```bash
for f in $files; do
  test -f "$f" && EXISTS="$EXISTS $f"
done
```

If `$EXISTS` non-empty AND no `--force`:

Ask user via `AskUserQuestion`:
- ⭐ **Overwrite all** — replace existing files for this phase (recommended for regen)
- **Skip existing, write only new** — partial regen
- **Abort** — preserve as-is

### Step 3: Confidence gate

Scan the **current phase's SPEC sections only** for `⚠️ NEEDS_CLARIFICATION` markers placed inline by `/sl-ds-plan`.

Scope of scan: the components listed in `phases[N].components[]` (from PLAN.md frontmatter). For each component, read its `#### Component: <name> ⚠️` section in PLAN.md and look for `> ⚠️ NEEDS_CLARIFICATION:` blockquotes.

**Do NOT scan the full PLAN.md** — sub-agents receive only their phase sections, so questions placed in the "Open questions" footer are invisible to them. The inline `⚠️` pattern is the only reliable signal.

If any inline `⚠️ NEEDS_CLARIFICATION` found → STOP and present each question via `AskUserQuestion`:
- ⭐ Resolve before implementing — show me each unresolved spec (recommended)
- Proceed anyway — sub-agent will emit `[NEEDS_CLARIFICATION]` in code with TODO comments
- Abort

### Step 4: Phase implementation (single sub-agent, FULL phase context + Figma read access)

**Executor:** `Agent(subagent_type: "general-purpose", model: "sonnet")` — phase-implementer

**Critical change (v2.1):** Sub-agent has **MANDATORY Figma read access**. PLAN.md provides SHAPE (architecture, props, structure), Figma provides DETAILS (exact text content, icon names, asset URLs, visual states). This eliminates the "model invents details" problem that occurred when PLAN.md was treated as 100% complete.

**Critical change (v2.2):** Sub-agent performs a **MANDATORY Code Connect pre-flight** via `get_code_connect_map(fileKey, nodeId)` for every `sl-*` instance in the phase. Returned snippets are authoritative — sub-agent copies them verbatim (substituting Angular bindings for static values). This eliminates invented icon names, button variants, and slot structures.

**Sub-agent input (~50-80K tokens):**
- The phase X section of PLAN.md (verbatim) — all component SPECs for this phase
- Token CSS vars subset
- `.sl-ds-config.yaml`
- fe-standards: `angular.md`, `sanoma-ds.md`, `components.md`, `antipatterns.md`, `styling.md`, `errors.md`
- Lessons applicable (from sl-ds-lessons.md, severity: must-follow)
- **PLUS Figma MCP tools enabled:** `get_design_context`, `get_metadata`, `get_screenshot`, `search_design_system`, `get_code_connect_map`
- `codeConnectSnippets`: results of `get_code_connect_map` for every `sl-*` nodeId in this phase
  → Sub-agent uses these as authoritative templates
  → For nodes without Code Connect: fall back to `get_design_context` inference (`sl-card`, `sl-accordion` currently missing)

**Sub-agent task (per component):**

0. **Before writing template — for each `sl-*` node in component SPEC:**
   - Read its Code Connect snippet from `codeConnectSnippets` dict
   - If present: use snippet verbatim — copy icon names, variants, slot structure
   - If absent (`sl-card`, `sl-accordion`): use `get_design_context` fallback as before

1. **Before writing code:** call `mcp__claude_ai_Figma__get_design_context` for the component's Figma nodeId from PLAN.md. Extract:
   - Exact text content (titles, badges, descriptions) — copy verbatim
   - Exact icon names (from sl-icon entries) — verify against `node_modules/@sl-design-system/sanoma-learning/icons.js` if uncertain
   - Asset URLs — download via curl if image asset (e.g. Leefwereld) and write to `apps/<scope>/public/images/`
   - DS component variants (e.g. `<sl-button-bar fill="...">`, `<sl-card orientation="...">`) — copy verbatim
   - Color tokens — verify CSS var name matches Figma var

2. **Write `<component>.ts` + `<component>.html` + `<component>.css`** combining:
   - PLAN.md SPEC for structure (props, slots, layout)
   - get_design_context for content (text/icons/assets/variants)

3. **For elements not in PLAN.md SPEC but visible in design_context:** add them (don't skip). PLAN.md is the floor of completeness, design_context is the ceiling.

4. **If get_design_context returns ambiguous/incomplete output** for a specific element → emit `[NEEDS_CLARIFICATION]` and add to `needsClarification[]` output. Do NOT invent.

5. **For services + models + mocks** (data layer, not visual): work from PLAN.md only — no Figma needed for type definitions or service shapes.

**Sub-agent OUTPUT (per file written):**

```json
{
  "schemaVersion": "2.0.0",
  "phase": "phase1",
  "filesWritten": [
    {
      "path": "...",
      "kind": "component | service | model | mock | layout",
      "linesWritten": N,
      "sourceSpec": "PLAN.md#Component-max-topic-card",
      "tokensUsed": [...],
      "dsImports": [...],
      "violations": [],
      "needsClarification": []
    }
  ],
  "phaseTotal": { "files": N, "lines": N }
}
```

`violations` non-empty → orchestrator FAILs and re-runs with strict spec.
`needsClarification` non-empty → orchestrator surfaces to user before committing.

### Step 4.5: Post-generation integration (orchestrator, BEFORE commit)

After sub-agent returns and before committing, orchestrator applies these steps from `references/generation-rules.md` (these are **orchestrator** steps, not sub-agent steps):

1. **§3.10 Routing Integration** — if `<feature>.routes.ts` was generated: find `app.routes.ts` (via `codebase-analysis.json → appRoutesPath`), append lazy-loaded route entry if path not already present.
2. **§3.11 i18n Integration** — if `.sl-ds-config.yaml → i18n.active: true`: spawn `sl-ds-i18n` with generated file paths, apply key substitutions.
3. **§3.12 Barrel Export** — if a new `features/<feature>/` or `components/<group>/` directory was created: generate `index.ts` barrel, append to existing if present.

Files created/modified by §3.10/3.11/3.12 are **included in the WIP commit** (Step 5). Add them to the staged file set before committing.

### Step 5: WIP commit per phase

If `.sl-ds-config.yaml` → `pipeline.wip_commits: true`:

```bash
git add <all files for this phase>
git commit -m "wip(sl-ds): implement <phase-name> from PLAN.md [sl-ds-implement]"
```

NO per-file commits (one per phase). Easier review, cleaner history.

### Step 6: Update PLAN.md status

In PLAN.md frontmatter:
- `current_phase: phase1` → `phase2` (advance)
- Inside phase1 block: `status: planned` → `status: implemented`
- `last_implemented_plan_hash: <value of plan_hash field>` — write the current plan_hash into this field. This activates stale-plan detection for future runs: if PLAN.md is revised, plan_hash changes and the pre-flight will warn.

Write back to disk.

### Step 7: Summary + Next-Phase decision

```text
> ✅ Phase 1 implemented
> 
> | Metric | Value |
> |---|---|
> | Files created | N |
> | Files modified | N |
> | Lines written | N |
> | Services | N (with mock layer) |
> | Models | N |
> | Components | N |
> | WIP commit | <hash> |
> | Clarifications needed | N |
>
> Next: /sl-ds-verify (build + lint + pixelmatch)
> After verify success: /sl-ds-implement phase2
```

Ask user via `AskUserQuestion`:
- ⭐ **Run /sl-ds-verify on phase1 now** (recommended)
- **Implement phase2 immediately** (verify all phases at the end)
- **Pause for manual review** (you'll come back)

## Outputs

| Path | Purpose |
|---|---|
| `<targetScope>/src/**` | Code files per phase plan |
| `.sl-ds-cache/sl-ds-impl/implementation-result.json` | Phase summary + statistics |
| WIP commit `wip(sl-ds): implement <phase-name>` | Per phase, traceable |
| PLAN.md updated (`current_phase` advanced, phase status → implemented) | Persistent state |

## Hard gates (sub-agent self-FAIL)

These trigger sub-agent self-FAIL (returned with `violations[]`), orchestrator re-spawns with strict prompt:

1. **Hardcoded hex value where SPEC specifies token** — `#1727b6` instead of `var(--sl-color-foreground-primary-bold)` → FAIL (re-run reading STYLE-2 rule strictly)
2. **`schemas: [CUSTOM_ELEMENTS_SCHEMA]` absent from generated `@Component` with sl-* tags** → auto-add (do NOT FAIL — schema is always required per SDS-2; PLAN.md SPEC does not need to declare it; if missing after generation, orchestrator patches the file and continues)
3. **`sl-card` for layout** when SPEC classifies as `plain-div` → FAIL (SDS-3)
4. **DS Angular wrapper import in `imports: []`** for SLDS Web Component → FAIL (SDS-1 — use register.js side-effect import instead; imports[] must remain empty for sl-*)
5. **Hardcoded data in component** when SPEC says service consumer → FAIL (component must `inject(Service)`)
6. **Element in template not in SPEC** — sub-agent invented something not in PLAN.md → FAIL (rule #11 "never invent")
7. **Generated `sl-*` template differs from its Code Connect snippet** (when one exists) → FAIL. Re-run with the snippet as strict reference.

Auto-repair max 2 attempts. After 2 failures → STOP, surface to user.

## Resume

Resume per `_shared/resume-discipline.md`. Progress tracked in `.sl-ds-cache/sl-ds-implement/progress.json`:
- `progress.json` tracks phase + which files done
- If `current_phase: phase1` AND some files exist → ask user "continue phase1 from where left off / restart phase1?"
- PLAN.md `last_implemented_plan_hash` prevents implementing stale plan

## Mandatory rules (sub-agent must follow)

1. **PLAN.md is shape, Figma is details.** Read PLAN.md for structure, get_design_context for exact content (text, icons, assets, variants). Never invent — fetch Figma instead.
2. **Token values via CSS vars only.** No hex literals where token exists.
3. **DS components via `register.js`** + `CUSTOM_ELEMENTS_SCHEMA` (per project lesson).
4. **No hardcoded data in components.** Services inject + mock data in separate file.
5. **Smart container vs leaf:** smart components `inject()` services; leaves receive `input.required<T>()`.
6. **Standalone + signals + zoneless + OnPush** — Angular 17+ idioms.
7. **`@for`/`@if` control flow** — no `*ngFor`/`*ngIf`.
8. **No `@Input()`/`@Output()` decorators** — use signals (`input()`, `output()`).
9. **`inject()` for DI**, not constructor injection.
10. **WIP commit per phase**, not per file.
11. **NEVER invent.** Emit `[NEEDS_CLARIFICATION]` if SPEC ambiguous.
12. **Code Connect is authoritative.** For every `sl-*` tag emitted, verify it matches the official Code Connect snippet from `get_code_connect_map`. Invented attribute values (e.g. icon names not in the SLDS icon library) → FAIL.

## Next

After successful phase implementation:
- **Most likely:** `/sl-ds-verify` on this phase
- **Alternative:** `/sl-ds-implement phase<N+1>` if confident

After hard-gate failure (3 retries exhausted):
- **Recovery:** examine PLAN.md SPEC for the failing component; may need PLAN.md update via `/sl-ds-plan --revise`

## References

| File | Load when |
|---|---|
| `references/generation-rules.md` | Steps 4–4.5 — file-generator sub-agent contract + post-generation orchestration (§3.10 routing, §3.11 i18n, §3.12 barrel) |
| `../_shared/lessons-format.md` | Pre-flight — applicable lessons (must-follow severity) |
| `../../standards/fe/angular.md` | Per-component generation |
| `../../standards/fe/sanoma-ds.md` | SDS-* rules (especially SDS-7 register.js per lesson) |
| `../../standards/fe/components.md` | COMP-* component design |
| `../../standards/fe/antipatterns.md` | AP-* what to avoid |
| `../../standards/fe/styling.md` | STYLE-* token consumption |
| `../../standards/fe/errors.md` | ERR-* 4-state matrix |
| `../_shared/refusal-protocol.md` | Hard-gate failure format |
| `../_shared/cache-schema.md` | implementation-result.json schema |
| Figma Code Connect docs | https://www.figma.com/developers/code-connect | Authoritative snippet source for sl-* components |
