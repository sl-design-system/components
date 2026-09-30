---
type: spec
id: SPEC-document-schema
title: Document schema
description: The contract every knowledge document follows — frontmatter + body sections
jira: null
resource: null
status: current
owner: jane.doe
created: 2026-01-01T09:00:00Z
updated: 2026-01-01T09:00:00Z
tags: [meta, schema]
schema_version: 1
---

# Document schema

> **Authoritative source: the `sl-aipdlc-toolkit`.** The machine-readable JSON Schemas and
> the validators live in that repo (its own package), not here. This file is a
> human-readable summary; if it ever disagrees with the toolkit, the toolkit wins. Validate
> with `uvx --from <toolkit-git-url> sl-aipdlc validate .` (see CONVENTIONS.md § 9).

This is the **contract** every document follows so that **different people and different
tools** can edit the same files without clobbering each other. Two parts:

1. **Frontmatter** — validated by JSON Schema, one per type, defined in the toolkit.
2. **Body sections** — the required / optional `##` headings listed below.

## The tool contract (read this)

- **Patch sections, do not overwrite whole files.** A tool updating a document must edit
  only the sections it owns and leave the rest byte-for-byte intact.
- **Preserve unknown fields and sections.** If a tool does not recognise a frontmatter
  field or a heading, it keeps it. JSON Schema is intentionally open (no
  `additionalProperties: false`) to allow this.
- **`schema_version`** is in every document. A tool that does not support the document's
  `schema_version` must refuse to write it rather than downgrade it.
- **Bump `updated`** (ISO 8601) on every write.

## Required vs optional body sections

Required sections must be present (validated as `##` headings). Optional may be added.

| type           | required `##` sections                                  | optional |
|----------------|---------------------------------------------------------|----------|
| `analysis`     | Key questions · Findings · Conclusion / recommendation  | Context & background · Hypotheses · What would change our mind · Open questions · Leads to |
| `plan`         | Goal · Approach · Work breakdown · Acceptance · Approval | Scope · Risks & dependencies |
| `task`         | Objective · Steps · Acceptance criteria                 | Verification · Notes / work log |
| `use-case`     | Preconditions · Scenario · Result                       | Edge cases |
| `claim`        | *(none — coordination state, not knowledge)*            | Notes |
| `decision`     | Context · Options considered · Decision · Consequences  | What would invalidate this decision |
| `architecture` | Purpose · Overview                                      | Key decisions · Open questions / risks |
| `spec`         | Vision · Problem · Personas · Scope · Functional requirements · Non-functional requirements | Assumptions · Out of scope |
| `prototype`    | What it is · Screens · Content shown · Deliberately not implemented | Components used · Interactions · Notes |

> Meta files (`type: index`, `type: roadmap`) are **exempt** from body-section rules; they
> are directory listings, validated only for frontmatter basics.
>
> Generated mirrors (frontmatter `source: confluence`) are also **exempt** from body-section
> rules — the upstream tool controls their headings — but their frontmatter is still
> validated. See CONVENTIONS.md § 13.
>
> External hub stubs (frontmatter `location: external`) are **exempt** from body-section rules
> too, but **must set `resource`** (the full document's URL). See CONVENTIONS.md § 15.

## Frontmatter quick reference

Common (all types): `type`, `id`, `title`, `description`, `jira`, `resource`, `status`,
`owner`, `created`, `updated`, `tags`, `schema_version`. Optional everywhere:
`previous_owner` (handoff), `superseded_by` (archiving), `depends_on` (hard dependencies).

Per-type cross-links: `plan.source_analysis` (required), `task.source_plan`/`task.source`
(one required), `use-case.tests_task` (required), `claim.unit` (required),
`decision.supersedes`, `plan.slice`, `prototype.variant_of`.

Per-type workflow fields: `plan.phase` (**required** — `conceptual` | `approved` |
`execution` | `done`) with `plan.approved_by` / `plan.approved_date` / `plan.open_questions` —
the Discovery → Execution gate (CONVENTIONS.md § 4.1), enforced: a task whose `source_plan`
resolves to a `conceptual` plan is a validation error; `task.independent` (boolean — may the
task run in parallel with its siblings); `prototype.variant_of` + `prototype.change` — **a
document setting `variant_of` must also set a non-empty `change`**, enforced by the schema,
plus `prototype.artifact` (URL of the built bundle, which lives outside the context).

See the **sl-aipdlc-toolkit** repo for the authoritative machine-readable schemas, and
[CONVENTIONS.md](CONVENTIONS.md) for the human rules.
