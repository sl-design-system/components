---
topic: fe-standards-index
applies_to: [sl-ds, sl-ds-setup, sl-ds-layout, sl-ds-tokens, sl-ds-plan, sl-ds-implement, sl-ds-verify, sl-ds-update, sl-ds-audit, sl-ds-lesson]
last_updated: 2026-06-10
---

# FE Standards — Index for Sanoma Learning DS Skills

> **Purpose:** Cheap entry-point (~3K tokens) loaded by orchestrator BEFORE deciding which fe-standards files to consult. Maps skill → relevant rule files + IDs. Avoids loading the full 285K of fe-standards into every skill invocation. Lazy-loading discipline is the cost saver — see §3.
>
> **Source of truth:** `.agents/standards/fe/` (13 files, ~285K). **Never paraphrase the rules here** — only point at them. When this file disagrees with a rule body, the rule body wins.

## 1. Map of fe-standards files

Compressed view (full map with descriptions in `../../standards/fe/README.md` §3):

| File | Rule ID range | Scope |
|---|---|---|
| `architecture.md` | ARCH-1…8, NAME-1…5 | Module boundaries, layers, dependency direction, directory structure, naming |
| `components.md` | COMP-1…10 | Orchestrator vs sections, layout=skeleton, composition vs flags, library boundary |
| `data-and-state.md` | STATE-1…8, DATA-1…9 | Server state vs UI state, three addresses of view state, data layer, cache, policies |
| `styling.md` | STYLE-1…5 | Styling gradient, design tokens, named styles, prop filtering, RWD |
| `forms.md` | FORM-1…5 | Five form artifacts, data channel, server errors to fields, create/edit models |
| `errors.md` | ERR-1…8 | 4-state matrix, mutation feedback, domain error classes, silent rejection |
| `testing.md` | TEST-1…7 | Test IDs, behavioral doubles, edge-state factories, integration per role |
| `conventions-and-tooling.md` | I18N-1…5, TOOL-1…5, A11Y-1…4, SEC-1…4, PERF-1…4, DEPS-1…2, GIT-1…4 | i18n, lint/CI, accessibility, security, performance, dependencies, git/PR |
| `antipatterns.md` | AP-1…18 | Anti-pattern catalog (god component, type-cleverness, copy-paste, false abstraction…) |
| `refactoring.md` | REF-1…10 | Refactor mechanics: plan-before-change, strangler, delete, net-negative diff |
| `checklist.md` | CHK-1…3 | Day 0, team work rules, Definition of Done |
| `angular.md` | NG-1…18 | Rule mapping for Angular: standalone+zoneless+OnPush, signals, idioms |
| `sanoma-ds.md` | SDS-1…7 | SLDS imports discipline, CUSTOM_ELEMENTS_SCHEMA control, layout-vs-DS, max- prefix, token consumption, i18n active, version tracking |

## 2. Per-skill consultation guide

Every skill DECLARES its consulted fe-standards in frontmatter `fe_standards_consulted: { primary: [...], rule_ids: [...] }`. The table below is the default mapping — skills may narrow per-invocation.

### Discovery (Haiku — cheap, minimal load)

| Skill | Files | Rule IDs | Comment |
|---|---|---|---|
| `sl-ds` | (none — uses only this index) | — | Router; sub-agents may load on their own |
| `sl-ds-help` | (none) | — | Pure catalog presentation |

### Setup / Analysis

| Skill | Files | Rule IDs | Comment |
|---|---|---|---|
| `sl-ds-setup` | `checklist.md`, `conventions-and-tooling.md`, `sanoma-ds.md` | CHK-1, TOOL-1…5, SDS-7 | Day-0 foundation + lint/CI + SLDS version detection |
| `sl-ds-layout` | `architecture.md`, `components.md` | ARCH-1…8, NAME-1…5, COMP-2, COMP-3 | Module boundaries + layout=skeleton (not data bus) |
| `sl-ds-tokens` | `styling.md`, `sanoma-ds.md` | STYLE-1…5, SDS-5 | Design tokens gradient + no-fallback discipline |
| `sl-ds-plan` | `architecture.md`, `components.md`, `data-and-state.md`, `angular.md`, `sanoma-ds.md` | ARCH-1…8, COMP-1…10, STATE-1…8, DATA-1…9, NG-1…8, SDS-1, SDS-3, SDS-4 | Full architecture + Angular idioms + Sanoma Learning DS specialization |

### Implementation

| Skill | Files | Rule IDs | Comment |
|---|---|---|---|
| `sl-ds-implement` | `components.md`, `errors.md`, `forms.md`, `styling.md`, `angular.md`, `sanoma-ds.md`, `antipatterns.md` | COMP-1…10, ERR-1 (4-state matrix), FORM-1…5, STYLE-1…5, NG-1…18, SDS-1…7, AP-1…18 (what to avoid) | Widest consumer — generates code, must cover all dimensions |
| `sl-ds-verify` | `testing.md`, `checklist.md`, `sanoma-ds.md` | TEST-1…7, CHK-3 (Definition of Done), SDS-1, SDS-2, SDS-3 | Verification + DoD + Sanoma-specific gates |

### Maintenance

| Skill | Files | Rule IDs | Comment |
|---|---|---|---|
| `sl-ds-update` | `refactoring.md`, `testing.md` | REF-1…10, TEST-7 (plan BEFORE change) | Reconciliation = refactor; state inventory |
| `sl-ds-rebase` | (none) | — | Mechanical restore from archive; no rule consultation |
| `sl-ds-promote` | `sanoma-ds.md` | SDS-1…7 | Reads target file format to write new rule entries; lesson → rule graduation |
| `sl-ds-mock` | `data-and-state.md` | DATA-1…4, STATE-1, STATE-3 | Mock-data shaping must match production-shape contracts |
| `sl-ds-i18n` | `conventions-and-tooling.md` | I18N-1…5 | Key naming convention, default-text discipline |
| `sl-ds-audit` | `antipatterns.md`, `checklist.md`, `conventions-and-tooling.md`, `sanoma-ds.md` | AP-1…18, CHK-3, A11Y-1…4, PERF-1…4, SEC-1…4, SDS-1…7 | Read-only review catalog |
| `sl-ds-lesson` | `antipatterns.md` (duplicate detection only), `README.md` philosophy | AP-1…18 (for "this is already in fe-standards" detection) | DO NOT write a lesson that duplicates a fe-standards rule |

## 3. Loading discipline — THE POINT OF THIS INDEX

### 3.1 Orchestrator does NOT load full fe-standards files

Orchestrator (e.g. `sl-ds-plan` on Opus) loads:
1. This file (`fe-standards-index.md`) — ~3K
2. Its own frontmatter `fe_standards_consulted` declaration
3. NOT the full `architecture.md` or `components.md` in the main session

**Reason:** orchestrator does many things (cache check, framing, decision tree). Its context budget is tight. Loading 50K of rule prose leaves less room for actual reasoning.

### 3.2 Sub-agents load full files in clean context

When the orchestrator delegates (e.g. `sl-ds-plan` → `sl-ds-component-mapper`):

```text
Spawn Agent(subagent_type: general-purpose, model: sonnet) with:
  - Input: element spec, tokens-verified.json subset
  - Task: "Apply rules from .agents/standards/fe/components.md (COMP-1, COMP-3) + sanoma-ds.md (SDS-3). Use Read to load these files in your clean context. Return JSON with appliedRules: [<list of IDs>]."
```

The sub-agent in **clean context**:
- Reads `.agents/standards/fe/components.md` (~25K) — takes 50% of its context, which is OK
- Reads `.agents/standards/fe/sanoma-ds.md` (~10K)
- Applies the rules → returns concise JSON
- Orchestrator gets the result, NOT the full rule body

Net effect: orchestrator stays clean, sub-agent burns tokens on rules where they are cheaper and don't block the main session.

### 3.3 Scoping rule IDs to the sub-agent

The frontmatter `fe_standards_consulted` declares ALL rules the skill consults. In a specific sub-agent invocation, the orchestrator can **NARROW** to those rules that apply to THIS specific decision:

Example — `sl-ds-implement` writing `max-hero-section.ts`:
- Skill frontmatter: `fe_standards_consulted.rule_ids: [COMP-1..10, ERR-1..8, FORM-1..5, STYLE-1..5, NG-1..18, SDS-1..7, AP-1..18]`
- Per-file decision (hero-section is a leaf component without a form): orchestrator narrows to `[COMP-1, COMP-3, COMP-4, ERR-1, STYLE-2, NG-1, NG-7, SDS-1, SDS-4, SDS-5, AP-1]`
- Sub-agent receives only those 11 IDs to focus on in clean context, plus paths to two files (components.md + sanoma-ds.md), not all seven

Net effect: per-file generation runs in ~50K context instead of ~150K.

### 3.4 Cache appliedRules per artifact

Every artifact producer (architecture.json, generation-result.json, audit-report.json) MUST append `appliedRules: [<id>...]` for:
- Audit: which rules were applied at this decision point
- Drift detection: if rule X was supposed to apply but does not appear in appliedRules → bug
- Lesson capture (`/sl-ds-lesson`): easier to point at WHERE in the pipeline a deviation arose

## 4. Conflict resolution order

**Single source of truth: [`lessons-format.md`](lessons-format.md) §5.2.** Do not restate the priority here or in any skill — cite that section. When a sub-agent receives multiple rules that conflict, the orchestrator passes the priority-ordered list and instructs: *"apply in priority order; if conflict, higher priority wins; document the conflict in `appliedRules` with `priority_resolution: <source>` note."*

## 5. What this index is NOT

- ❌ Does not copy rules from fe-standards — only maps. Rule content lives in `.agents/standards/fe/`.
- ❌ Not authoritative. When this file says X about a rule but the rule body in fe-standards says Y → fe-standards wins.
- ❌ Not a replacement for the fe-standards README.md — that is the team's authored document. This file is the agent-facing meta-index.
- ❌ Not loaded into sub-agents. Only the orchestrator sees this file.
