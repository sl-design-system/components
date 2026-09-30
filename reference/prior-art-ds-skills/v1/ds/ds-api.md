---
name: ds-api
type: sub-agent
prefix: ds
version: 1.0.0
description: CEM fetch, cache, and query service for SLDS component API knowledge
called_by:
  - ds-mapper
  - ds-docs
  - ds-migrate
  - ds-impl
invokes: []
token_budget: "500–5K"
---

# ds-api

Provides **versioned SLDS component API knowledge** to all agents that need to understand
component properties, events, slots, and composition rules.

## Purpose

Other agents should never fetch or parse SLDS source directly. `ds-api` is the single
gateway to component API data. It ensures:

1. **One fetch per version** — source is fetched from GitHub once and cached.
2. **Deterministic parsing** — the same source always produces the same API object.
3. **Version isolation** — multiple SLDS versions coexist in cache without conflict.

## Input

```json
{
  "version": "2.0.1",
  "action": "fetch | query | list",
  "component": "sl-button"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `version` | Yes | Resolved SLDS version (exact, from lockfile) |
| `action` | Yes | `fetch` = populate cache for all components; `query` = return one component API; `list` = return component index |
| `component` | Only for `query` | Component tag (e.g., `sl-button`) or package name (e.g., `@sl-design-system/button`) |

## Output

```json
{
  "version": "2.0.1",
  "action": "query",
  "source": "cache",
  "cachePath": ".ds-cache/ds-api/2.0.1/sl-button.json",
  "componentApi": { "..." }
}
```

| Field | Description |
|-------|-------------|
| `version` | SLDS version used |
| `action` | Action that was executed |
| `source` | `cache` \| `github-source` \| `hosted-api` |
| `cachePath` | File path that was read/written |
| `componentApi` | Full API object (for `query`) |
| `components` | String array of tags (for `list`) |

## Behavior

### Action: `fetch`

Populates the local cache for ALL components at the given version.

```
1. Check .ds-cache/ds-api/{version}/_index.json exists
   → YES: return immediately (cache hit)
   → NO: proceed to step 2

2. Fetch source TypeScript from GitHub
   URL pattern per component:
     https://raw.githubusercontent.com/sl-design-system/components/
     @sl-design-system/{component}@{version}/packages/components/{component}/src/{component}.ts

   Also fetch:
     - packages/components/{component}/package.json (status, version)
     - packages/components/{component}/CHANGELOG.md (breaking changes)

3. Parse each source file with lightweight parser (ts-morph preferred, tree-sitter fallback):
   Extract:
     - @property() decorators → properties table
     - export type / union types → valid property values
     - @event() decorators → events table
     - JSDoc @slot annotations → slots
     - JSDoc @csspart annotations → CSS parts
     - package.json["status"] → stable | preview | draft

4. Write parsed API to .ds-cache/ds-api/{version}/{component}.json
5. Write index to .ds-cache/ds-api/{version}/_index.json
6. Return { action: "fetch", source: "github-source", cachePath: "..." }
```

### Action: `query`

Returns the API object for a single component.

```
1. Check .ds-cache/ds-api/{version}/{component}.json exists
   → YES: read and return (cache hit)
   → NO: run single-component fetch (step 2-4 of `fetch` flow)

2. Return { action: "query", source: "cache"|"github-source", componentApi: {...} }
```

### Action: `list`

Returns the component index.

```
1. Check .ds-cache/ds-api/{version}/_index.json exists
   → YES: return component list from index
   → NO: run full `fetch` first, then return list

2. Return { action: "list", components: ["sl-button", "sl-card", ...] }
```

## Cache Structure

```
.ds-cache/
  ds-api/
    2.0.1/
      _index.json              ← component list + metadata
      sl-button.json           ← parsed API for sl-button
      sl-card.json
      sl-form-field.json
      ...
    1.4.2/
      _index.json
      sl-button.json           ← different API for migration scenarios
    _breaking-changes/
      1.4.2-to-2.0.1.json     ← breaking change diff
```

### Component API Object Format

```json
{
  "version": "2.0.1",
  "generated": "2026-01-15T10:00:00Z",
  "source": "github:sl-design-system/components@sl-design-system/button@2.0.1",
  "component": "sl-button",
  "status": "stable",
  "package": "@sl-design-system/button",
  "registerImport": "@sl-design-system/button/register.js",
  "properties": [
    { "name": "variant", "type": "'default'|'primary'|'success'|'warning'|'danger'", "default": "'default'" },
    { "name": "fill", "type": "'solid'|'outline'|'ghost'", "default": "'solid'" },
    { "name": "disabled", "type": "boolean", "default": "false" },
    { "name": "size", "type": "'sm'|'md'|'lg'", "default": "'md'" }
  ],
  "events": [
    { "name": "sl-focus", "type": "SlFocusEvent" },
    { "name": "sl-blur", "type": "SlBlurEvent" }
  ],
  "slots": [
    { "name": "", "description": "Button label text or icon content" }
  ],
  "cssParts": [],
  "cssProperties": [],
  "composition": {
    "validParents": ["sl-button-bar"],
    "validChildren": ["sl-icon"],
    "patterns": ["Use inside sl-button-bar for grouped actions"]
  }
}
```

## Breaking Changes Detection

For migration scenarios, `ds-api` compares two version caches:

```
Input:  two cached versions (e.g., 1.4.2 and 2.0.1)
Source: CHANGELOG.md per component at each git tag
Output: .ds-cache/ds-api/_breaking-changes/{from}-to-{to}.json
```

Used by `ds-migrate` to generate migration plans.

## Failure Modes

| Failure | Detection | Recovery |
|---------|-----------|----------|
| GitHub rate limit | HTTP 403 + `x-ratelimit-remaining: 0` | Honor `x-ratelimit-reset`; backoff 10s/20s/40s/80s (max 4). Use cache if available. |
| GitHub auth failure | HTTP 401/403 without rate-limit header | Abort fetch. Try `gh auth token`. Prompt user for credentials. |
| Tag/version not found | HTTP 404 for `refs/tags/{version}` | Try `v{version}` alias. If still 404, abort and ask for `--ds-version` override. |
| Source file missing | Partial 404 on component source | Mark component as `unknown-api`. Continue with remaining components. |
| Parser failure | ts-morph throws on source file | Retry with tree-sitter. If both fail, use stale cache + `stale_schema=true` flag. |
| Corrupt cache | JSON parse error or checksum mismatch | Delete corrupt file, re-fetch from source. |

## Confidence Scoring

| Condition | Confidence |
|-----------|-----------|
| All components fetched and parsed successfully | 95–100 |
| Cache hit (fresh, checksums valid) | 90–100 |
| Some components failed parse, stale fallback used | 60–75 |
| Version not found, no cache exists | 0 (abort) |

## Configuration

No direct user configuration. Version is always provided by the calling agent
(resolved by `ds-version`).

Optional override: `--ds-version 2.0.1` bypasses detection.

## Design Decisions

1. **Why not use full CEM analyzer?** The full `@custom-elements-manifest/analyzer` takes
   ~30s for all components and requires Node.js dependencies. The lightweight parser
   (~2s, ~90% accuracy) is sufficient for API knowledge and avoids dependency bloat.

2. **Why cache per version?** Multiple SLDS versions may coexist in an NX monorepo.
   Each version has its own API surface. Cache isolation prevents stale data.

3. **Why GitHub source, not npm?** The CEM is not committed to the DS repo and not
   published as a standalone artifact. Source TypeScript at git tags is the only
   guaranteed available API description.
