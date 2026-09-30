# Conventions

The rules for this knowledge context. Read this before adding or changing anything.
The goals are: **easy to navigate**, **consistent for humans and AI agents**, and
**resistant to Git conflicts** when many people edit in parallel.

> Scaffolded by `sl-aipdlc init`. In **standalone** mode these rules govern the whole
> repository; in **embedded** mode they govern the context directory declared in
> `.sl-aipdlc.yaml` (the marker at the context root). One rule — the code boundary,
> § 17 — applies to standalone repos only.

---

## 1. One concept per file

Every analysis, plan, task, use case, decision, design doc, and spec is its **own file**.
The file path is the concept's identity. This is what lets people work in parallel without
touching each other's lines.

- **Small item** → a single file: `analyzes/ABC-123-adaptive-learning.md`
- **Larger item** (multiple supporting docs, diagrams, sub-notes) → a folder with its own
  `index.md`: `analyzes/ABC-123-adaptive-learning/index.md` + `analysis.md` + assets.

Use the folder form once an item needs more than one file.

---

## 2. Identity is Jira-first (no shared counter)

The **Jira number** (assigned by Jira, e.g. `ABC-123`) is the unique ID and the sort key
for every layer. The same Jira number is the **join key** that links an analysis, its
plan, its tasks, and its use cases together across the folders.

| Layer       | Folder / file name           | Frontmatter `id` | Example                                   |
|-------------|------------------------------|------------------|--------------------------------------------|
| analysis    | `<JIRA>-<slug>/` or `.md`    | `A-<JIRA>`       | `A-ABC-123`                                |
| plan        | `<JIRA>-<slug>/` or `.md`    | `P-<JIRA>`       | `P-ABC-123`                                |
| task        | `T-<JIRA>-NN-<slug>.md`      | `T-<JIRA>-NN`    | `T-ABC-123-01`                             |
| use-case    | `UC-<JIRA>-NN-<slug>.md`     | `UC-<JIRA>-NN`   | `UC-ABC-123-01`                            |
| claim       | `board/CL-<JIRA>-NN-<slug>.md` | `CL-<JIRA>-NN` | `CL-ABC-123-01` (§ 19)                     |
| decision    | `architecture/decisions/<JIRA>/AD-<id>-<slug>.md` (ticket) or `architecture/decisions/AD-<slug>.md` (repo-wide) | `AD-<id>` | `AD-ABC-123`, `AD-token-storage` |
| design doc  | `<slug>.md`                  | `ARCH-<slug>`    | `ARCH-system-overview`                     |
| spec        | `product/<slug>.md`          | `SPEC-<slug>`    | `SPEC-<product-slug>`                      |
| prototype   | `prototypes/<JIRA>-<slug>/PT-<JIRA>-NN-<slug>.md` | `PT-<JIRA>-NN` | `PT-ABC-123-01` (§ 21)          |

- `<slug>` is short, lowercase, hyphen-separated (`adaptive-learning`).
- **Architecture placement (decisions vs design docs).**
  - **Decisions (ADR)** — every `type: decision` file lives under
    **`architecture/decisions/`** (the single ADR home, enforced in CI — § 18), named
    `AD-<id>-<slug>.md`. **Ticket-tied** ADRs (`jira: <JIRA>`, id `AD-<JIRA>[-NN]`) go in
    the ticket's subfolder **`architecture/decisions/<JIRA>/`** — one place to find every
    decision of a ticket. **Repo-wide** ADRs (`jira: null`, id `AD-<slug>`) stay flat at
    the `decisions/` root.
  - **Design docs** — a design doc that serves one Jira ticket / feature lives in that
    ticket's folder `architecture/<JIRA>-<slug>/` with `jira: <JIRA>` (id `ARCH-<slug>`);
    genuinely repo-wide design docs stay flat at the root of `architecture/`.
  - **Creating an ADR is gated on its analysis being approved** — see § 18.
- `NN` is a **two-digit, per-ticket** counter for tasks and use cases (`01`, `02`, …).
  Its scope is a single Jira ticket, usually owned by one person, so collisions are rare.
  If two people do collide, renumber the newer one in the PR — it is local and cheap.
- **There is deliberately no global counter** across tickets. Jira already gives you a
  unique, monotonic number; reuse it.

### Items without a Jira ticket
Bugfixes and ad-hoc work that have no ticket use a `NOJIRA-<slug>` id and `jira: null`:
- `work/NOJIRA-login-crash/T-NOJIRA-login-crash-01-fix-null-token.md`

If a ticket is created later, rename the item to the Jira id and update the links.

---

## 3. Frontmatter schema

Every `.md` knowledge file starts with YAML frontmatter. The **only hard requirement is
`type`** (OKF). The rest are standard and should be filled in. Field names and the
`description` / `resource` / ISO-8601 timestamps follow the
[Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing).

```yaml
---
type: analysis            # analysis | plan | task | use-case | decision | architecture | spec | claim  (REQUIRED)
schema_version: 1         # contract version (REQUIRED) — see § 9
id: A-ABC-123             # see identity table above
title: Adaptive learning research
description: One-line summary, used for search/recall (OKF standard field)
jira: ABC-123             # the ticket, or null
resource: https://<your-instance>.atlassian.net/browse/ABC-123   # authoritative source (OKF), null if NOJIRA
status: draft             # see status vocab below
owner: jane.doe           # who currently owns it
created: 2026-01-01T09:00:00Z   # ISO 8601, set once
updated: 2026-01-01T09:00:00Z   # ISO 8601, bump on every edit (staleness signal)
tags: [adaptive-learning, research]
# --- optional, any type ---
# previous_owner: john.doe        # set on handover (§ 11)
# superseded_by: A-ABC-199        # set when archiving (§ 12)
# depends_on: [P-ABC-190]         # hard dependencies (§ 10)
# --- cross-links (per type, see below) ---
# source_analysis: A-ABC-123
# source_plan: P-ABC-123
# tests_task: T-ABC-123-01
---
```

`resource` is the OKF "authoritative source" field — the full Jira URL
(adjust the base to your instance). For `NOJIRA` items set both `jira: null` and
`resource: null`.

### Cross-link fields (link upward)
| In a…    | Field             | Points to        |
|----------|-------------------|------------------|
| plan     | `source_analysis` | the analysis id  |
| task     | `source_plan`     | the plan id      |
| task     | `source`          | `bugfix`, `support`, `ad-hoc` … when there is no plan |
| use-case | `tests_task`      | the task id      |
| claim    | `unit`            | the task / use-case id it claims (§ 19) |

Always also add a **relative markdown link** in the body, e.g.
`Derived from [A-ABC-123](../../analyzes/ABC-123-adaptive-learning/analysis.md).`
Frontmatter is for machines; the body link is for humans and is greppable on rename.

---

## 4. Status vocabularies

| Type         | Allowed statuses                                          |
|--------------|-----------------------------------------------------------|
| analysis     | `draft` → `in-review` → `done` → `superseded`             |
| plan         | `proposed` → `approved` → `in-progress` → `done` → `on-hold` |
| task         | `todo` → `in-progress` → `blocked` → `done` → `cancelled` |
| use-case     | `draft` → `ready` → `passing` → `failing`                 |
| claim        | `claimed` → `in-progress` → `released` / `done`           |
| decision     | `proposed` → `accepted` → `superseded` → `deprecated` → `rejected` |
| architecture | `draft` → `current` → `superseded`                        |
| spec         | `draft` → `current` → `superseded`                        |

### 4.1 Plan phase — the Discovery → Execution gate

A plan carries **two orthogonal axes**, both defined in the toolkit schema — don't conflate
them:

- **`status`** — the coarse lifecycle position (the table above).
- **`phase`** — which of the two working modes the plan is in, and the **gate that controls
  task creation**: `conceptual` → `approved` → `execution` → `done`. **Required on every plan.**

**`phase`, not `status`, is the gate.** Tasks must not be created in `work/` until the plan is
`phase: approved`. A plan in `phase: conceptual` is still being decided — converge on the
decision first (Conceptual mode), execute as parallel atomic tasks second (Execution mode).
A task whose `source_plan` points at a `conceptual` plan is a **validation error**, so the gate
is enforced by the contract rather than by memory.

| `phase`      | meaning                                              | matching `status` |
|--------------|------------------------------------------------------|-------------------|
| `conceptual` | Discovery — still forming the decision               | `proposed`        |
| `approved`   | gate passed — execution may start                    | `approved`        |
| `execution`  | atomic, independent tasks worked in parallel         | `in-progress`     |
| `done`       | delivered                                            | `done`            |

**Four checks to leave Discovery** — all four are visible in the plan file, so all four are
checkable:

1. The plan is complete as a plan — `## Goal`, `## Approach`, `## Work breakdown`, `## Acceptance`.
2. It is signed — `approved_by` + `approved_date`, and the `## Approval` section written out.
3. **Every entry in `open_questions` is either answered *or* converted into a named task.**
   Clearing `open_questions` while a question is still genuinely open is a contract violation;
   carrying one into `T-<JIRA>-NN` is a legitimate exit — some answers need the work.
4. `phase: approved` is set in the **same commit** as the sign-off, so the crossing is one
   atomic, reviewable event.

Deliberately **not** required: that every question be answered before starting (that is a freeze,
and it rebuilds waterfall), or that tasks be created at all (`phase: approved` permits atomisation,
it does not mandate it — a plan can be delivered another way and say so in `## Work breakdown`).

**Crossing back is normal, not an exception.** Three paths, by how deep the wrongness goes:

| Trigger | Mechanism | Does `phase` move? |
|---------|-----------|--------------------|
| A detail changed; the goal and the work breakdown survive | **`### Amendment N` on the approved plan** — What changed / What did not change / Judgement, signed | No — execution continues |
| The plan is right, the decomposition was wrong | **Task reconciliation** — re-diff plan against tasks; follow-ups for `done` work, never edit a done task | No |
| The goal itself is wrong | **Hold and re-scope** — `status: on-hold`, `phase: conceptual`, open questions left standing; superseded by a sibling plan | Yes — back to Discovery |

Prefer the amendment. An approved plan that changes quietly is worse than one that was never
approved — but demoting `approved → conceptual` while tasks are in flight freezes work to satisfy
bookkeeping, which is the very reflex this gate is shaped to avoid.

Keep the gate **light** — a one-line sign-off, not a waterfall stage-gate. It is light because the
sign-off is one line, and non-skippable because a validator reads the file.

---

## 5. Indexes and the roadmap

- **`index.md` in every directory** is a table, **one row per item**, kept in
  **Jira-number order**. Adding an item adds one predictable, well-separated line — this is
  what keeps merges clean. Do not reflow or re-sort existing rows in the same PR.
- **`plan/roadmap.md`** groups plans by status (one row per plan). It is the single
  high-level view of what is planned, in progress, and done.
- Keep index rows minimal (id, title, jira, status, updated). The file itself is the
  source of truth — the index is just a directory listing.

---

## 6. Append-only changelog

`CHANGELOG.md` at the context root records **structural** changes (items added/moved/removed,
convention changes). It is **append-only with the newest entry on top**. Because everyone
appends at the top, conflicts are rare and trivially resolved by keeping both entries.
Do not rewrite history in it.

Format:
```
## 2026-01-01
- Added P-ABC-123 (plan/ABC-123-adaptive-learning) — jane.doe
```

---

## 7. Conflict-avoidance rules (summary)

1. Identity comes from **Jira**, never a shared global counter.
2. **One concept per file** — parallel editors touch different files.
3. `CHANGELOG.md` is **append-only, newest on top**.
4. `index.md` / `roadmap.md` are **tables, one row per item, in Jira order** — don't re-sort.
5. Cross-reference with **relative links + frontmatter ids** so renames stay greppable.
6. Bump **`updated`** on every edit.
7. Prefer **small, single-item PRs**.
8. Tools **patch sections, never overwrite files**, and **preserve unknown fields/sections**
   (§ 9) — the schema contract is what stops one tool clobbering another.

---

## 8. Templates

Copy from `_templates/` when creating a new item:
- `_templates/analysis.md`
- `_templates/plan.md`
- `_templates/task.md`
- `_templates/use-case.md`
- `_templates/claim.md`        # board claim — who owns which unit (§ 19)
- `_templates/decision.md`     # architecture decision record (ADR/MADR)
- `_templates/architecture.md` # design / overview doc
- `_templates/spec.md`         # product spec (vision, problem, persona, FR/NFR)
- `_templates/external-stub.md` # hub stub for a document that lives in another repo (§ 15)

---

## 9. Document schema & validation

Every document follows a **contract** so different people and tools can edit the same files
safely. The contract — the JSON Schemas and the validators — is **owned by the
`sl-aipdlc-toolkit`** (its own repo); this context keeps no copy. [SCHEMA.md](SCHEMA.md) is a
human-readable summary.

- **Frontmatter** → JSON Schema per type (2020-12, shared base). `schema_version: 1` is
  required on every document.
- **Body** → the required `##` sections per type (see SCHEMA.md). Meta files (`index`,
  `roadmap`) and generated mirrors (`source: confluence`) are exempt.

The **tool contract**: tools **patch sections, never overwrite whole files**, **preserve
unknown fields/sections**, refuse to write an unsupported `schema_version`, and bump
`updated`. This is what stops one tool from clobbering another's work.

Validate locally with the toolkit CLI (no copy needed — `uvx` fetches and caches it):

```bash
TOOLKIT="git+ssh://git@bitbucket.org/sl-technology/sl-aipdlc-toolkit.git"
uvx --from "$TOOLKIT" sl-aipdlc validate .
uvx --from "$TOOLKIT" sl-aipdlc check-language .
```

CI runs the same on every push/PR via the pipeline scaffolded by `sl-aipdlc init`
(standalone: `bitbucket-pipelines.yml`; embedded: a step snippet scoped to the context dir).

---

## 10. Dependencies

When one item cannot start until another lands, declare it with **`depends_on: [<id>, …]`**
(plans and tasks). This is a **hard** dependency — distinct from provenance links
(`source_plan`, `source_analysis`, `tests_task`) which do not block.

- The validator checks every `depends_on` id exists and that the graph has **no cycles**.
- Items with no dependency path between them can run **in parallel** — this is what the
  roadmap's slices and dependency graph visualise (`plan/roadmap.md`).
- A task also carries **`independent: true|false`** — an at-a-glance signal of whether it is
  safe to work alongside its sibling tasks. `false` ⇒ explain the coupling in `depends_on` or
  the Notes. `depends_on` is the machine-checked constraint; `independent` is the human intent.

---

## 11. Handoff (passing work between people / tools)

The file in Git is the single source of truth — not any one tool. To hand work over (e.g.
before holidays):

1. Set `owner` to the new person; copy the old value to `previous_owner`.
2. Add a dated entry in the item's **Notes / work log**: current state, next step, blockers.
3. Bump `updated` and commit (small commits keep merges clean).
4. If the unit is claimed on the board (§ 19), update the claim's `owner` too.

The new owner resumes from the work log. Because everything is plain markdown + frontmatter,
any OKF-aware tool can pick it up.

---

## 12. Archiving (never delete, rarely move)

Knowledge keeps its value as history, so:

- **Archive by status, not by deletion.** Set `status` to `superseded` / `deprecated` /
  `done` / `cancelled` and add `superseded_by: <id>` when something replaces it. Indexes
  filter by status, so the active view stays clean while links and history survive.
- **Avoid moving files** — identity is the path, and relative links would break. Only move
  to `archive/<year>/` if the context genuinely needs a smaller active surface, and then
  update the links and record it in `CHANGELOG.md`.
- **Never `rm`.** Git history is not a substitute for a discoverable `superseded_by` trail.

---

## 13. Generated mirrors

Some files may be **generated** from an upstream tool (frontmatter `source: confluence`),
not authored here. Rules:

- **Do not hand-edit** a file with `source: confluence` — edit the upstream page and re-run
  your sync tooling; local edits are overwritten. Each generated file should carry a
  `GENERATED … DO NOT EDIT` header and `resource:` = the source page URL.
- Generated mirrors are **exempt from the body-section rules** (§ 9) — we do not control the
  upstream headings — but their frontmatter is still schema-validated.
- The upstream tool is the **source of truth** for these; the context is a versioned copy.

---

## 14. Language: English only

All markdown prose is written in **English**. This is enforced automatically:

- `sl-aipdlc check-language .` (run via `uvx`, see § 9) flags any `.md` whose prose
  is confidently non-English (it ignores frontmatter, code, links, and short files). CI runs
  it on every push/PR alongside the schema validator.
- If a file is **intentionally** non-English, opt it out with a `lang: <code>` frontmatter
  field (e.g. `lang: pl`).
- In Claude Code or Copilot CLI, the `sl-aipdlc-validate` skill (from the toolkit plugin)
  runs both checks.

---

## 15. Federated knowledge (hub-and-spoke)

Not all knowledge has to live here. Implementation-level plans/analyses may be authored in
the repo they belong to (next to the code), while this context stays the **hub** that always
knows about them. This is also how **cross-context references** work: ids resolve only
within one context root, so a reference to a document in another context/repo is always an
external stub, never a bare `depends_on` across roots.

- **Central (`location: central` or omitted)** — full content lives here. Use for
  cross-cutting work: product spec, roadmap, system-wide analyses and ADRs.
- **External stub (`location: external`)** — the full document lives in another repo; here
  we keep only a **stub**: normal frontmatter (same `type`, Jira-first `id`) + a one-paragraph
  summary + `resource:` pointing at the full document's URL. A stub is **exempt from the body
  -section rules** but **must set `resource`** (enforced by the toolkit). Copy
  [`_templates/external-stub.md`](_templates/external-stub.md).
- **The hub always registers a stub.** Every external document has a stub here, so this
  context is the single discovery surface. The **Jira number is the cross-repo join key** —
  the same `A-ABC-123` may be a stub here and the full analysis in a spoke repo.
- **Stub vs source of truth.** The stub never duplicates content — it summarizes and links.
  The spoke is canonical for the full document; the hub is canonical for the registry.
- Spoke repos use the **same contract** by running the `sl-aipdlc-toolkit` (§ 9), so
  distributed documents stay in the same OKF format.

---

## 16. External references (`references:` frontmatter)

Every **analysis**, **architecture** item, and **product** doc that draws on external
sources — Confluence pages, Bitbucket repositories, web pages, Jira tickets, inspected
runtime systems (cloud accounts, clusters, APIs) — lists them in a **`references:`
frontmatter field**, so provenance travels with the document and is greppable across the
context. Inline source citations inside the body remain mandatory; `references:` is the
aggregated per-document view.

```yaml
references:   # external sources this document was built from
  - https://<your-instance>.atlassian.net/wiki/spaces/XX/pages/123456   # <what it is>, read 2026-01-01
  - https://bitbucket.org/<workspace>/<repo>                            # read-only source scan
```

- **External links only** — full URLs or system identifiers, never context-internal `.md`
  links (internal provenance is the body's relative links and cross-link fields, § 3).
- Use a YAML end-of-line comment for the title / accessed date / read-only note.
- Append entries; do not re-sort. Never delete one — annotate it if it proved wrong or
  superseded (§ 12).
- `references:` lists **sources used**; it does not replace `resource:` (the single
  authoritative source of the document itself, § 3).
- Decisions (ADRs) normally inherit their sources from the driving analysis (§ 18) and
  do not repeat the list.

---

## 17. Code boundary (standalone repos only — knowledge only, no task/product code)

**Applies to standalone knowledge repos only.** An embedded context lives inside a product
repo, where code is expected — this rule is not scaffolded there.

A standalone knowledge repository holds the thinking around the code, never the working
code itself. Committing runnable code for a ticket or product — dev-environment setups,
seed scripts, local servers, application code — is **blocked in CI**
(`scripts/check-code-boundary.sh` runs before validation on every push/PR).

When a task produces working code:

1. **Create a separate repository** for it (its own project, its own CI).
2. **Keep the knowledge here**: the analysis/plan stays in this repo, plus an **external
   stub** (`location: external` + `resource:` = the code repo URL, § 15 /
   [`_templates/external-stub.md`](_templates/external-stub.md)) so the hub still registers
   the work. The Jira number remains the cross-repo join key.

Allowed code locations in a standalone repo (the guard's allowlist):

- **`scripts/<file>` (flat, no subfolders)** — tooling that operates *this repo itself*
  (sync, onboarding bootstrap, CI checks). Per-ticket subfolders under `scripts/` are not
  allowed.
- **`**/assets/**`** — diagram/figure sources embedded in knowledge docs (e.g. `diagrams`
  Python files next to an architecture note).

---

## 18. ADR gate (decisions require an approved analysis)

Architecture **decisions are conclusions of analyses** — they must not precede them.
Enforced in CI by `scripts/check-adr-gate.sh` on every push/PR (the script takes the
context root as its first argument, so it works in both modes):

1. **One ADR home.** Every `type: decision` file lives under **`architecture/decisions/`**
   — ticket-tied ADRs in the ticket's subfolder `architecture/decisions/<JIRA>/`, repo-wide
   ADRs (`jira: null`) flat at the root. Nowhere else in the context.
2. **Approved analysis first.** An ADR with `jira: <JIRA>` may only exist once its driving
   analysis (`analyzes/<JIRA>-*/analysis.md`) has **`status: done`**. Until then,
   `architecture/` may hold only **general system overviews and draft proposals**
   (`type: architecture`, e.g. `ARCH-<slug>.md`, `status: draft`) — never a decision.

When blocked, the guard suggests exactly that: capture the current thinking as a
`type: architecture` draft (or finish the analysis), and create the ADR from
[`_templates/decision.md`](_templates/decision.md) once the analysis is approved.

Exempt from the analysis gate (never from the location rule): context-wide governance ADRs
(`jira: null`) and generated mirrors (`source: confluence`, § 13).

---

## 19. Claim board (who owns which unit)

`board/` is the lightweight **coordination substrate** for parallel execution: humans and
agents are peers, and a participant **claims** a unit of work (a task or use case) before
touching it — so two participants never collide, and "who owns this right now" is always
answerable from Git alone.

- One claim per unit: `board/CL-<JIRA>-NN-<slug>.md` (copy
  [`_templates/claim.md`](_templates/claim.md)). The claim's `unit:` field points at the
  task / use-case id; the validator checks it resolves.
- The claim's `owner` is the claimant. Statuses: `claimed` → `in-progress` →
  `released` (gave it back) or `done` (delivered).
- Claims are schema-validated like every other document, but need no body sections — a
  claim is coordination state, not knowledge.
- Before starting a unit, check the board; if the unit is claimed by someone else, talk to
  the owner instead of starting. Release your claims when you stop working.

---

## 20. Foundation mount (department-owned context)

`foundation/` is the **mount point for organization-level foundation bundles** —
infrastructure and architecture patterns, security/privacy baselines, design-system
guidance. The process **consumes** these as authoritative input; it never authors or forks
them here.

- Each foundation domain is **owned and maintained by the responsible department**; this
  context only pins versions of the bundles it builds against.
- The pinned bundle references live in the `.sl-aipdlc.yaml` marker at the context root,
  so a later foundation change does not silently invalidate in-flight work.
- Foundation files are machine-readable and live in this one conventional location so
  skills load them automatically instead of guessing.
- Deviating from a foundation constraint requires an explicit, justified ADR (§ 18) and a
  heads-up to the owning department.

See [`foundation/README.md`](foundation/README.md).

---

## 21. Prototype descriptions (generated, not authored)

`prototypes/` holds a description **per prototype that was built** —
`prototypes/<JIRA>-<slug>/PT-<JIRA>-NN-<slug>.md`, id `PT-<JIRA>-NN`, two-digit per-ticket
counter as for tasks and use cases.

It is the one layer that is **generated rather than authored**. A tool describes a prototype
after it exists and re-runs when it changes, so:

- **Do not hand-edit.** A stale description is a re-run, not a rewrite.
- **Content is transcribed verbatim**, never summarised. A description that paraphrases what a
  prototype shows reads perfectly well and cannot be rebuilt from — the rebuild produces
  something *similar*, which is the failure this layer exists to prevent.

**Variants are siblings, not nested folders.** A variant sets `variant_of` (the prototype it
came from) and `change` (the single declared difference). The schema **rejects `variant_of`
without a non-empty `change`**: a variant that cannot say what it changed cannot be diffed
against its source, and lineage without a delta is decoration.

**Descriptions live here; built bundles do not.** A prototype bundle is runnable code and the
code boundary (§ 17) rejects it. The `artifact` field carries the URL of wherever it is served.

See [`prototypes/README.md`](prototypes/README.md).
