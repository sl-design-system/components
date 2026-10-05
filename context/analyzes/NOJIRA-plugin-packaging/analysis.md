---
type: analysis
schema_version: 1
id: A-NOJIRA-plugin-packaging
title: "Packaging the design system as a Claude Code plugin, modelled on Spotify's Ads API"
description: 'How Spotify structures a plugin without compiled code, why they rejected MCP, and what the design system would have to publish before the same shape works here'
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [plugin, packaging, claude-code, distribution, reference]
references:
  - https://engineering.atspotify.com/2026/5/spotify-ads-api-claude-plugins # the source article
  - https://github.com/spotify/ads-agentic-tools # their plugin repository
  - https://claude.com/plugins/spotify-ads-api # the published marketplace entry
---

# Packaging the design system as a Claude Code plugin, modelled on Spotify's Ads API

> Translated from `analiza-agent-plugin.md`. Written as a study of someone else's plugin, it ends
> as an implementation plan with three named blockers — the first of which is the same gap the
> architecture survey recorded independently as **P12**.

## Key questions

1. How is a Claude Code plugin actually structured, by someone who ships one?
2. Why did they choose a plugin over MCP, and does that reasoning transfer?
3. What would the design system have to publish before the same shape could work here?

## Hypotheses

That a plugin needs compiled code, a build step and a tool registry — **all three turn out to be
false** in Spotify's case, and the document is largely an account of discovering that.

## Context & background

Spotify's plugin lets a user manage ad campaigns in natural language:

> _"Create an audio campaign called Back to School Promo targeting 25-44 year olds in the US with
> $100/day budget"_

The plugin decomposes that into a sequence of API calls — look up geo IDs, convert dollars to
micro-units, validate audience size, POST campaign, POST ad set, POST ad.

**The analogy that motivates the whole document:**

> _"Create a login form with email, password fields and a submit button using SLDS components"_

which would decompose into `sl-form` + `sl-text-field[type=email]` +
`sl-text-field[type=password]` + `sl-button[variant=primary]`, with correct structure and
accessibility.

## Findings

### F1 — The repository layout

```
ads-agentic-tools/
 .claude-plugin/
   └── plugin.json          ← metadata: name, version, description
 skills/                   ← slash commands (/spotify-ads-api:build-campaign)
   ├── build-campaign/
   │   └── SKILL.md         ← what the command does, which API calls it makes
   ├── campaigns/
   │   └── SKILL.md
   ├── api-reference/       ← API documentation (source of truth)
   │   ├── SKILL.md
   │   └── references/      ← Markdown docs per endpoint
   └── ...
 agents/
   └── spotify-ads-request-builder.md  ← agent for natural language
 hooks/
   ├── hooks.json           ← configuration: PreToolUse → check-token.sh
   └── check-token.sh       ← OAuth token refresh
 settings.json            ← plugin settings schema
 templates/               ← templates
```

### F2 — Four component types

| Type         | What it does                             | Format                        |
| ------------ | ---------------------------------------- | ----------------------------- |
| **Skills**   | slash commands (`/plugin-name:command`)  | `SKILL.md` in a directory     |
| **Agents**   | natural language, invoked automatically  | `.md` with YAML frontmatter   |
| **Hooks**    | intercept tool calls (e.g. `PreToolUse`) | `hooks.json` + a shell script |
| **Settings** | per-user configuration (gitignored)      | a local `.md` file            |

```json
{
  "name": "spotify-ads-api",
  "version": "1.2.0",
  "description": "Manage Spotify ad campaigns with natural language...",
  "author": { "name": "Alex Murphy" },
  "homepage": "https://github.com/spotify/ads-claude-plugin",
  "license": "Apache-2.0"
}
```

An agent is YAML frontmatter plus prose:

```markdown
---
name: spotify-ads-request-builder
description: 'Use this agent when the user describes an advertising task in natural language...'
model: inherit
color: cyan
tools: ['Read', 'Bash', 'Grep', 'Glob', 'AskUserQuestion']
---

<example>
user: "Create a campaign called Summer Sale with a reach objective"
assistant: "I'll use the api-request-builder agent..."
</example>

You are a Spotify Ads API specialist that translates natural language...

**Your Core Responsibilities:**

1. Interpret the user's intent and map it to the correct API endpoint(s)
2. ...
```

A hook is configuration plus a script:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/check-token.sh" }
        ]
      }
    ]
  }
}
```

Installation:

```bash
# From the marketplace (recommended)
claude plugin i spotify-ads-api

# From a local repository (dev/testing)
claude --plugin-dir /path/to/plugin
```

### F3 — Why they chose a plugin over MCP

Spotify made this choice deliberately:

> _"The API surface is too large for static tool definitions. Defining each as an MCP tool would
> produce a massive tool registry consuming significant context window space in every
> interaction, whether or not the user needs those endpoints."_

With a plugin the agent loads documentation **only when it needs it**.

### F4 — Why Markdown rather than code

> _"There is no compiled code in this plugin. There is no build step, no package manager, no
> bundler, no transpiler."_

The maintenance consequences are the argument: fixing an API quirk means **adding a sentence to a
`.md` file**; every component is human-readable and diffable; and maintaining it requires no
TypeScript or Node expertise.

### F5 — A specification file is the source of truth

Spotify ships the raw **OpenAPI spec** (`external-v3.yaml`, roughly 8,600 lines) inside the
plugin. The agent reads it when it needs detail.

**The equivalent here:** `custom-elements.json` per component is the design system's OpenAPI
spec.

### F6 — OpenAPI Links encode a workflow graph

Spotify uses OpenAPI Links to express relationships between resources:

```
campaign (POST) → [link] → ad_set (POST, uses campaign_id)
ad_set (POST) → [link] → ad (POST, uses ad_set_id)
```

**The equivalent here** is parent/child component composition:

```
sl-form → [contains] → sl-form-field → [contains] → sl-text-field
sl-tabs → [contains] → sl-tab-group → [contains] → sl-tab
```

### F7 — How they run it day to day

The plugin lives in a **separate public repository**, with a lifecycle independent of the Ads API
— each can be updated without the other. The current version is `1.2.0`, and the changelog shows
iteration since `1.0.0`. Spotify watch for _"common patterns and decomposition bottlenecks"_ and
tune the system prompts accordingly.

Version awareness has four parts: the plugin is registered in the **Claude Plugins marketplace**;
the user runs `claude plugin update spotify-ads-api`; the version in
`.claude-plugin/plugin.json` tells Claude Code when to bump; and the agent reads that file at
startup — _"Read `.claude-plugin/plugin.json` to get the plugin version. Set
`SDK_HEADER="X-Spotify-Ads-Sdk: claude-code-plugin/$PLUGIN_VERSION"`"_.

### F8 — What the design system publishes today, and what it does not

**Public:**

| Resource                  | URL                                                             |
| ------------------------- | --------------------------------------------------------------- |
| Documentation site        | https://sanomalearning.design                                   |
| GitHub Pages              | https://sl-design-system.github.io/components/                  |
| API docs (human-readable) | https://sanomalearning.design/categories/components/button/code |
| GitHub Releases           | github.com/sl-design-system/components/releases                 |

**Not available:**

| Resource                      | Problem                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `custom-elements.json`        | not committed, not deployed — generated only by `yarn dist`    |
| npm packages                  | private, on the GitHub registry, requiring auth                |
| Storybook                     | Azure Static Web Apps, URL unknown, probably behind a firewall |
| machine-readable API manifest | no public JSON endpoint of any kind                            |

**The conclusion drawn:** the design system has nothing today that could serve as the plugin's
OpenAPI spec. It has to be generated and published first.

### F9 — The proposed implementation, in four steps

**Step 1 — generate and publish the spec**, by extending the website workflow:

```yaml
# add to .github/workflows/website.yml
- name: Generate component manifests
  run: |
    node scripts/build-styles.js 'packages/components/**/*.scss'
    node scripts/build-packages.js components
    node scripts/build-metadata.js   # → packages/components/*/custom-elements.json

- name: Generate AI docs
  run: node scripts/generate-ai-docs.js # ← TO BE WRITTEN

- name: Deploy to GitHub Pages
  run: cp -r dist/ai-docs website/dist/api/
```

giving `https://sanomalearning.design/api/components.json` and
`https://sanomalearning.design/api/components/button.md`.

**Step 2 — the plugin structure**, either a separate repository or `.claude/` inside this one:

```
sl-design-system-plugin/
 .claude-plugin/
   └── plugin.json            ← { "name": "sl-design-system", "version": "1.0.0" }
 skills/
   ├── get-component/         ← /sl-design-system:get-component button
   ├── create-form/
   ├── create-layout/
   └── list-components/
 agents/
   └── sl-design-system-builder.md
 api-docs/                  ← generated Markdown docs per component
    ├── button.md
    ├── form.md
    └── ...
```

**Step 3 — the agent.** Its responsibilities, as drafted: translate UI intent into correct
markup; select components, properties and variants; handle composition; ensure accessibility;
and **respect component status, preferring stable over draft**. Its source of truth is
`api-docs/{component}.md`, read on demand, for properties and types, valid enum values, required
slots, related components and status. Its startup sequence reads an index of stable components
first and pulls individual docs only as needed. Its output is always the markup, the required
imports, a brief explanation of the component choices, and any accessibility notes.

**Step 4 — the skills.** `get-component` reads one doc and displays it, **warning when the
component is draft or preview**. `create-form` reads `form.md`, `form-field.md` and
`text-field.md`, builds the nesting, applies labels and validation attributes, and outputs HTML
plus imports.

### F10 — Generating the docs in CI

A `scripts/generate-ai-docs.js` would read each `custom-elements.json` alongside its
`package.json` for status and version, optionally parse `*.stories.ts` for examples and enum
values, write one Markdown file per component, and aggregate an index and a `components.json`.

The target format per component carries status, version and package in a header line, then usage
examples, a properties table with attribute names and types, events, slots, and **related
components** — the composition information CEM does not hold.

### F11 — The two approaches side by side

|                  | Spotify Ads Plugin             | SLDS Plugin                                  |
| ---------------- | ------------------------------ | -------------------------------------------- |
| Format           | Markdown files                 | Markdown files                               |
| Source of truth  | OpenAPI YAML (8,600 lines)     | `custom-elements.json` + generated Markdown  |
| Skills           | build-campaign, report, assets | create-form, create-layout, get-component    |
| Agent            | NL → API calls                 | NL → HTML/component markup                   |
| Auth             | OAuth + hooks                  | none (read-only)                             |
| Hosting          | Claude Plugins marketplace     | Claude Plugins marketplace / GitHub          |
| Update mechanism | `claude plugin update`         | `claude plugin update` + CI doc regeneration |
| Build step       | none (pure Markdown)           | generating docs from CEM (one command)       |

### F12 — Three blockers, in order

**Blocker 1 — `custom-elements.json` must be available.** Add `node scripts/build-metadata.js` to
CI and deploy it to GitHub Pages. Without it there is no source of truth for the plugin.

**Blocker 2 — status must be in CEM.** Add a CEM plugin that injects `status` and `version` from
`package.json` into each manifest.

**Blocker 3 — component relationships.** CEM does not describe parent/child requirements — that
`sl-form` requires `sl-form-field`. The proposal is an `api-docs/patterns.md` describing
composition, the same role OpenAPI Links play for Spotify.

**Optional:** registering in the Claude Plugins marketplace so users can
`claude plugin i sl-design-system`, which requires submission to Anthropic. The alternative for
internal teams is `claude --plugin-dir /path/to/sl-design-system-plugin`.

## What would change our mind

The Spotify observations are quotations from a published article and a public repository, so they
age rather than being wrong — the version numbers and the changelog state will drift. The
availability table in F8 is the part most likely to be stale: it is a snapshot of what the design
system published on one day.

The transferability argument rests on the two surfaces being alike in the way that mattered to
Spotify — too large for a static tool registry, and better read on demand. Fifty-four components
with full API surfaces is plausibly that, but nobody has measured it.

## Conclusion / recommendation

**The shape transfers, and the obstacle is not the plugin — it is that the design system
publishes nothing machine-readable.** Spotify's three structural decisions (no compiled code, a
raw spec as the source of truth, documentation loaded on demand) all depend on having a spec to
ship. Blocker 1 is therefore the whole of the near-term work, and it is one line in a CI
workflow.

## Open questions

1. Separate repository or `.claude/` inside this one? Spotify chose separate, for independent
   lifecycle; that argument is weaker when the plugin's source of truth is generated from the
   same repository it would live in.
2. Is the component surface genuinely too large for MCP, or is that inherited from Spotify's case
   without being checked here?
3. Who maintains `patterns.md`, given that composition rules are the one part CEM cannot
   generate?

## Leads to

**This becomes relevant when it is decided whether the Figma-to-code toolkit moves to the aipdlc
team's repository** — a question deliberately deferred until there is working code to move rather
than a specification. See
[`what-to-do-next.md`](../NOJIRA-figma-to-code/what-to-do-next.md). The packaging question and
the relocation question are the same question asked twice, and this document is the research for
both.

**Blocker 1 is the same gap the architecture survey recorded independently** as risk **P12** —
`custom-elements.json` is generated by `yarn dist` and absent from the repository. Two documents
reaching it separately is the strongest signal in either that it is worth fixing. See
[`A-NOJIRA-design-system-architecture`](../NOJIRA-design-system-architecture/analysis.md) F6
and F8.

**F3's reasoning bears on a live decision.** `P-NOJIRA-ingestion-hardening` task 02 has to choose
between the documented REST API and the undocumented MCP surface. Spotify's argument is about
registry size rather than documentation quality, so it does not settle that choice — but it is
the only recorded reasoning we have about when MCP is the wrong shape, and it should be read
before that task decides.
