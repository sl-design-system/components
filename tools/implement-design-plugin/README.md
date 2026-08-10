# implement-design plugin

Turn a Figma URL into fully implemented SLDS components — scaffolded, styled with design tokens, visually validated against the design, tested, documented, and reviewed. Supports **Lit** and **Angular**.

One plugin, three hosts: it uses the Claude Code plugin layout (`.claude-plugin/plugin.json`), which **Claude Code**, **GitHub Copilot CLI**, and **GitHub Copilot in VS Code** (agent plugins, preview) all read natively.

## What's inside

| Component                         | Purpose                                                                                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `skills/implement-design`         | The pipeline coordinator (`/implement-design <figma-url>`), plus the shared `component-conventions.md`, the `design-manifest.schema.md`, and the pipeline `vision.md`. |
| `skills/implement-design-lit`     | Lit implementation conventions, loaded on demand by the implementer/author agents.                                                                                     |
| `skills/implement-design-angular` | Angular implementation conventions, loaded on demand.                                                                                                                  |
| `agents/design-analyst`           | Stage 1 — ingests the Figma node via the Figma MCP server and produces a design manifest.                                                                              |
| `agents/component-decomposer`     | Stage 2 — proposes the component tree and per-component public APIs.                                                                                                   |
| `agents/component-implementer`    | Stage 3 — scaffolds and implements one component + a basic Storybook story.                                                                                            |
| `agents/visual-validator`         | Stage 4 — screenshots the built component with Playwright MCP and diffs it against the Figma reference.                                                                |
| `agents/component-author`         | Stage 5 — tests, enriched stories, docs, changeset (scoped to the output location).                                                                                    |
| `agents/component-reviewer`       | Stage 6 — read-only final review; emits a [CRITICAL]/[MINOR] punch list.                                                                                               |

The pipeline gathers all input up front (Figma MCP server, framework, i18n, output location), then runs to completion autonomously and presents one final report. Run artifacts (reference screenshot, manifest, validation captures) go to `.implement-design/<run>/` in the project you run it from — gitignore that folder.

## Prerequisites

The agents call MCP tools by these exact server names, so configure them in the host you use:

- **`figma`** — the remote Figma MCP server (`https://mcp.figma.com/mcp`). Always used to cache the reference screenshot; can also serve the design calls.
- **`figma-desktop`** — the Figma desktop app's local MCP server (`http://127.0.0.1:3845/mcp`). Recommended for the design calls (most reliable `get_code_connect_map`); requires the desktop app open with the file.
- **`playwright`** — the Playwright MCP server (`npx @playwright/mcp@latest`). Used by the visual validator for browser screenshots.

The target repository needs a runnable Storybook (or dev server for Angular) so Stage 4 can render the components.

## Install

All hosts can install directly from the GitHub repository — `sl-design-system/components` doubles as a plugin marketplace via the `.claude-plugin/marketplace.json` at its root. No local checkout needed.

### Claude Code

Register the GitHub repo as a marketplace, then install:

```shell
/plugin marketplace add sl-design-system/components
/plugin install implement-design@sl-design-system
```

For local development of the plugin itself:

```bash
claude --plugin-dir ./tools/implement-design-plugin
```

### GitHub Copilot CLI

Same flow as Claude Code:

```shell
copilot plugin marketplace add sl-design-system/components
copilot plugin install implement-design@sl-design-system
```

### GitHub Copilot in VS Code

Agent plugins require the `chat.plugins.enabled` setting (preview). To install from the GitHub repository, add the repo as a plugin marketplace in your settings:

```json
"chat.plugins.marketplaces": ["sl-design-system/components"]
```

then open the Extensions view, filter with `@agentPlugins`, and install **implement-design** from there.

Alternatives:

- install via the Copilot CLI (above) — VS Code auto-discovers plugins from `~/.copilot/installed-plugins/`, or
- point the `chat.pluginLocations` setting at a local checkout of `tools/implement-design-plugin` (for plugin development).

## Use

Invoke the skill with a Figma design URL:

```shell
/implement-design:implement-design https://www.figma.com/design/<fileKey>/<file>?node-id=<id>   # Claude Code (namespaced)
/implement-design https://www.figma.com/design/<fileKey>/<file>?node-id=<id>                   # Copilot CLI / VS Code
```

Answer the setup questions (Figma MCP server, framework, i18n, output location) and let it run. If the design contains component instances without published Code Connect mappings, the run halts with the node list — publish the mappings in Figma and re-run.

## Notes on cross-host compatibility

- Agent `tools:` frontmatter uses Claude Code tool names (`Read`, `Bash`, `mcp__figma__get_screenshot`, …). VS Code/Copilot ignore tool names they don't recognize, which can mean an agent runs with broader defaults there than the restricted set it has in Claude Code.
- Skill and agent bodies reference plugin files by paths the coordinator resolves at runtime, so nothing depends on where the plugin is installed.
