---
topic: refusal-protocol
applies_to: [sl-ds, sl-ds-setup, sl-ds-layout, sl-ds-tokens, sl-ds-plan, sl-ds-implement, sl-ds-verify, sl-ds-update, sl-ds-audit, sl-ds-lesson]
last_updated: 2026-06-10
---

# Refusal & Redirect Protocol

> **Purpose:** When a skill's preconditions aren't met, or a hard gate trips, the skill must STOP cleanly with an actionable redirect. No silent fallbacks to "best guess from chat history." This file defines exactly how to refuse, and pins the FAIL vs WARN vs STOP vocabulary used everywhere else.

## 0. Vocabulary — FAIL vs WARN vs STOP (pin this once)

The suite uses three severity verbs. Their meanings are fixed; do not improvise synonyms.

| Verb | Behaviour | When to use |
|---|---|---|
| **FAIL** | Stop the pipeline. Write diagnostic to `.sl-ds-cache/<skill>/failure.json`. Present user options (per §3). | Correctness issue. Cannot be ignored without producing wrong output. Examples: token count < 5, undocumented `CUSTOM_ELEMENTS_SCHEMA`, missing DS import for used `sl-*` tag. |
| **STOP** | Stop the pipeline cleanly with a refusal message. No diagnostic file needed. | Precondition not met. The skill cannot do useful work. Example: `.sl-ds-config.yaml` missing → STOP and redirect to `/sl-ds-setup`. |
| **WARN** | Log to stdout, continue execution. Surface in the final summary. | Recoverable condition or best-practice violation. Examples: catalog out of sync (validator), more than 50 active lessons, single-instance state-management evidence. |

**Never:**
- FAIL for a recoverable condition (creates noise that gets ignored).
- WARN for a correctness issue (ships bugs).
- STOP after work has been done — use FAIL with diagnostic so artifacts are preserved.

When a skill author is unsure, default to FAIL — false alarms cost less than silent corruption. Promote FAIL → WARN only after the gate has demonstrably produced too many false positives in real use.

## 1. Two failure modes

| Mode | Trigger | Response |
|---|---|---|
| **Precondition refusal (STOP)** | Required artifact / decision / config is missing before skill starts | STOP + redirect to the skill that produces it |
| **Hard-gate failure (FAIL)** | Mid-execution invariant violated (e.g. tokens < 5, geometric Δ > tolerance) | FAIL with diagnostic, ask user (overwrite/retry/abort) |

These are **different** — don't conflate them. Precondition is "I can't start." Hard gate is "I started but something is wrong."

## 2. Precondition refusal — exact format

```
> ❌ **{Skill name} cannot run yet.**
>
> Missing: `{exact file path or condition}`
> Reason: {one-line why it's needed}
>
> Next: invoke `/{prerequisite-skill}` first.
>
> _Artifacts preserved. Re-invoke `/{this-skill}` after the prerequisite completes._
```

Then **STOP**. Do not:
- Infer the missing input from earlier chat
- Run the prerequisite skill silently
- Ask the user for the missing input inline (the prerequisite skill is what asks)

If user invoked via `/sl-ds` router, return control to the router with `redirect_to: <prerequisite-skill>`. Router decides whether to auto-chain or ask user.

## 3. Hard-gate failure — exact format

```
> 🛑 **{Skill name} — hard gate failed at Step {N} ({step name}).**
>
> Expected: {what should have happened}
> Found:    {what actually happened}
> Why it matters: {one-line consequence}
>
> Diagnostic written to: `.sl-ds-cache/{skill-id}/failure.json`
>
> Options:
> ⭐ **Auto-fix attempt {M}/3** — {description of fix to try} (only if auto-repair budget remains)
> **Show full details** — display the captured diagnostic
> **Skip this gate** — record as `## Architectural exceptions` in sl-ds-decisions and proceed
> **Abort {skill}** — STOP, artifacts preserved for later resume
```

Default action when user picks nothing within reasonable wait: **Abort with preservation**, never proceed silently.

## 4. Standard refusal scenarios (catalog)

### 4.1 `.sl-ds-config.yaml` missing

```
❌ sl-ds-{*} cannot run — `.sl-ds-config.yaml` not found.
Next: invoke `/sl-ds-setup` first to scaffold project config.
```

### 4.2 No Figma URL provided

```
❌ sl-ds-tokens requires a Figma URL.
Provide as: /sl-ds-tokens https://www.figma.com/design/...
Or invoke via /sl-ds, which will ask for it.
```

### 4.3 Figma URL changed but cache exists for old URL

```
🛑 sl-ds-tokens — Figma URL mismatch.
Cached: https://figma.com/.../node-1
Requested: https://figma.com/.../node-2
Options:
⭐ Start fresh extraction for new URL (cache moved to `.sl-ds-cache/sl-ds-impl/_archive/`)
Use the cached extraction (treats requested URL as alias)
Abort
```

### 4.4 Framework not supported (v1 = Angular only)

```
❌ Sanoma Learning DS v1 supports Angular only.

Detected/declared framework: <react | vue | svelte | unknown>

This is a deliberate v1 scope decision — see `../../standards/fe/angular.md` (NG-*) for current Angular rules and `../../standards/fe/sanoma-ds.md` (SDS-*) for SLDS-specific scope.

Options:
  • Verify this is an Angular project (check `package.json` for `@angular/core`)
  • If multi-framework monorepo: invoke skills from Angular sub-project's directory
  • If genuinely react/vue/other: Sanoma Learning DS v1 is not the right tool today
```

No partial support, no stub workaround. Honest "wrong tool for the job" beats "half-working tool that breaks at step 7."

### 4.5 Schema version mismatch (cache older than skill)

```
🛑 sl-ds-{*} — cache schema v0.9 incompatible with skill v1.0.0.
Migration: not implemented for this version pair.
Options:
⭐ Invalidate `.sl-ds-cache/` and re-run pipeline from `/sl-ds-setup`
Abort
```

### 4.6 Pipeline state says step completed but artifact missing

```
🛑 sl-ds-{*} — `pipeline-state.json` says sl-ds-tokens completed at 2026-06-09T13:30 but `.sl-ds-cache/sl-ds-impl/tokens-verified.json` is missing.
Options:
⭐ Re-run sl-ds-tokens to regenerate the artifact
Trust the state, skip sl-ds-tokens (dangerous — downstream may break)
Abort
```

### 4.7 Required upstream artifact missing (generic precondition failure)

Any skill that declares `requires.artifacts` in its frontmatter MUST verify those artifacts exist before Step 1. If any required artifact is missing → STOP and emit this refusal, substituting the producing skill:

```
❌ {This skill name} cannot run yet.

Missing: `{exact path}`
Producer: `/{prerequisite-skill}` (the skill whose `produces.artifacts` includes this path)

Next: invoke `/{prerequisite-skill}` first.

_Re-invoke `/{this-skill}` once the prerequisite completes. No cache or partial state needs to be cleared._
```

**Mapping of artifact → producing skill** (canonical — every skill's `## Preconditions` cites this):

| Missing artifact | Producing skill |
|---|---|
| `.sl-ds-config.yaml` | `/sl-ds-setup` |
| `package.json` | (out of scope — initialize your frontend project first) |
| `.sl-ds-cache/sl-ds-impl/codebase-analysis.json` | `/sl-ds-setup` |
| `.sl-ds-cache/sl-ds-impl/layout-analysis.json` (optional, not all flows need it) | `/sl-ds-layout` |
| `.sl-ds-cache/sl-ds-impl/node-tree.json` | `/sl-ds-tokens` |
| `.sl-ds-cache/sl-ds-impl/tokens-verified.json` | `/sl-ds-tokens` |
| `.sl-ds-cache/sl-ds-impl/icons.json` | `/sl-ds-tokens` |
| `.sl-ds-cache/sl-ds-impl/architecture.json` | `/sl-ds-plan` |
| `.sl-ds-cache/sl-ds-impl/component-map.json` | `/sl-ds-plan` |
| `.sl-ds-cache/sl-ds-impl/build-result.json` | `/sl-ds-verify` |
| `.sl-ds-cache/sl-ds-impl/geometry-result.json` | `/sl-ds-verify` |
| `context/foundation/sl-ds-decisions/<screen>.md` | `/sl-ds-layout` (initial creation) or `/sl-ds-plan` / `/sl-ds-verify` (updates) |

Skills MUST NOT use `test -f X || REFUSE="..."` pseudo-bash for precondition checks — that string-assignment is non-executable and creates the illusion of a check. Instead, list preconditions explicitly in the `## Preconditions` section:

```markdown
## Preconditions

| Required artifact | If missing |
|---|---|
| `.sl-ds-config.yaml` | STOP per §4.7 (producer: `/sl-ds-setup`) |
| `.sl-ds-cache/sl-ds-impl/tokens-verified.json` | STOP per §4.7 (producer: `/sl-ds-tokens`) |
```

The orchestrator iterates this table at Step 0 (implicit) and emits the §4.7 refusal for the first missing artifact, before any sub-agent is spawned.

## 5. Refusal vs auto-recovery

Some "missing input" cases CAN be auto-recovered. Decision rule:

| Situation | Action |
|---|---|
| Auto-detectable from filesystem (e.g. framework, package versions) | Detect silently, log, proceed |
| Settled in a prior decision doc | Read decision, proceed |
| Genuine user input needed | Refuse OR ask via `AskUserQuestion` (skill's call) |
| Was previously cached but stale | Re-run only the producing skill, not the whole pipeline |

**The rule of thumb:** refuse when proceeding would require *guessing user intent*. Auto-recover when the answer is *already on disk* somewhere.

## 6. Never do these on refusal

- Run the prerequisite skill silently and try to continue
- Modify files outside `.sl-ds-cache/{skill-id}/`
- Delete artifacts from other skills
- Force a "best guess" path
- Commit anything
- Continue past a refusal because the user said "yes please continue" without picking an option

## 7. Diagnostic file format

`.sl-ds-cache/{skill-id}/failure.json`:

```json
{
  "schemaVersion": "1.0.0",
  "skill": "sl-ds-tokens",
  "step": "4 — verify tokens",
  "at": "2026-06-09T14:32:11Z",
  "kind": "hard-gate" | "precondition",
  "expected": "...",
  "found": "...",
  "captured": {
    "stdout": "...",
    "stderr": "...",
    "relevantFiles": [".sl-ds-cache/sl-ds-impl/tokens-raw.json"]
  },
  "attempts": [
    { "fix": "re-extract", "result": "same failure" }
  ]
}
```

Used by `sl-ds-audit` for retrospective reports, and by `/sl-ds` to surface the right recovery path.

## 8. Clipboard convenience (bootstrapper pattern)

When refusing with a redirect, optionally write the redirect command to clipboard so the user can just press paste:

```bash
echo -n "/sl-ds-setup" | pbcopy 2>/dev/null \
  || echo -n "/sl-ds-setup" | clip.exe 2>/dev/null \
  || echo -n "/sl-ds-setup" | xclip -selection clipboard 2>/dev/null \
  || true
```

Always silent failure on copy — the redirect message itself is enough.
