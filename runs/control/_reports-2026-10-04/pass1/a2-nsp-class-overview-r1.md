# Control run A2 — NSP class overview (r1)

**Case**: A2, the scale case (~10,900 nodes)
**Figma**: `https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2422-87039`
**Skill**: `implement-design:implement-design`, invoked via the Skill tool with the argument block verbatim
**Start**: `Sun Oct  4 18:58:54 CEST 2026`
**End**: `Sun Oct  4 19:04:50 CEST 2026`
**Wall clock**: ~5 min 56 s

---

## 1. Stage reached — HALTED IN STAGE 1

The run never left **Stage 1 (design ingestion)**. It halted on the skill's own rule 4:

> **`BLOCKED_ON_MCP`**: re-spawn the analyst up to 2 more times (brief waits). If still failing, **halt** and report the server is unreachable (this can't be resolved standalone) — show the error and suggest `claude mcp list` / re-auth / opening the desktop app.

`implement-design:design-analyst` was spawned **three times** (initial + the 2 permitted re-spawns). All three returned the same halt token and the same reason:

**Attempt 1:**

```
BLOCKED_ON_MCP
mcp__figma__get_code_connect_map@figma — Note: the Code Connect lookup timed out, so this response may be missing Code Connect data. (occurred on both the initial call and the one retry, per policy)
```

**Attempt 2:**

```
BLOCKED_ON_MCP
mcp__figma__get_code_connect_map@figma — "Note: the Code Connect lookup timed out, so this response may be missing Code Connect data." (empty `{}` result returned twice in a row, on initial call and one retry, for node 2422:87039 / fileKey sSrpLCZm302ces3khoBGls)
```

**Attempt 3:**

```
BLOCKED_ON_MCP
get_code_connect_map@figma — Note: the Code Connect lookup timed out, so this response may be missing Code Connect data.
```

Each analyst spawn internally retried the call once (per its own agent spec), so `get_code_connect_map` was actually issued **6 times**, with the identical outcome every time: HTTP-level success, body `{}`, plus the advisory note.

**Root cause of the halt is a classification rule, not an unreachable server.** `mcp__figma__get_code_connect_map` _succeeded_. It returned `{}` and appended the sentence "the Code Connect lookup timed out, so this response may be missing Code Connect data." The analyst agent spec (`tools/implement-design-plugin/agents/design-analyst.md`) says:

> If it returns a **transient connection error** — `MCP error -32000`, "transport dropped", or any message containing "connection lost", "connection error", "fetch failed", "socket hang up", "ECONNRESET", "ETIMEDOUT", or a 502/503/504/**timeout** — retry the **same call** on the **same server** once.

The advisory note contains "timed out", so a degraded-but-successful response was matched as a transient failure. The next sentence of the spec pushes the same way: "Do **not** treat a transient connection error as a legitimate tool result (e.g. don't read 'connection lost' as 'no Code Connect mappings')." The analyst did exactly what it was told.

Consequence: **deterministic, not flaky.** 3/3 identical. The skill's "re-spawn up to 2 more times" assumes transient flakiness; here it just spent ~4.5 of the ~6 minutes re-running a call guaranteed to fail the same way.

Also note: the halt advice the skill tells the coordinator to print ("suggest `claude mcp list` / re-auth / opening the desktop app") does not address this failure mode. The remote server is reachable and authenticated — `get_metadata` succeeded on all three attempts.

---

## 2. Did Stage 0 ask anything beyond the four supplied answers?

**No.** The four answers (MCP server, framework, i18n, output location) fully satisfied Stage 0's question batch, and the skill's "once answered, do not ask anything else" held — nothing else was asked of the user, including on the halt (the halt is a report, not a question).

Stage 0's URL validation passed: the URL is a `figma.com/design/...` link.

---

## 3. Everything I had to decide that the four answers did not cover

All of these are coordinator-level gaps — things the skill left to me, not to its agents.

1. **The run-folder slug, and its collision with existing convention.** The skill says: kebab-case the **Figma file name** from the URL → `NS-fundaments` → `ns-fundaments`, then smallest free `-N` → `.implement-design/ns-fundaments-1/`. But `.implement-design/` already holds 23 folders named by **case** (`a2-nsp-class-overview`, `a1-kampus-subchapter-feed`, …), _none_ of which follow the `<file-slug>-N` convention. I had to decide whether to follow the skill literally or match what's on disk. I followed the skill. A reader looking for this run's artifacts under `a2-nsp-class-overview` will not find them.

2. **No cache-reuse path across runs of the same file.** The `-N` uniqueness rule guarantees a fresh empty folder on every invocation, so a re-run of the _same_ Figma node cannot reuse the previous run's cached `figma-*.json` / `screenshot.png` — even though the skill explicitly justifies persisting them "for reproducibility". On a halt-and-re-run loop like this one, that means re-paying every Figma call. I had to decide not to pre-seed the new folder from a sibling (I changed nothing).

3. **Classifying the supplied output location.** Stage 0 enumerates exactly two options: the monorepo `packages/components/` or "an app/example path like `examples/`". The supplied answer, `examples/lit/src/_runs/control-a2-nsp-class-overview-r1/`, is neither literal; I had to classify it as the example/app shape (affects Stage 3 layout and Stage 5 scope — no `package.json`, no changeset, no website docs, story-only authoring).

4. **How the supplied path composes with the derived component folder.** Stage 3 step 9 says to resolve targets from "the **chosen output location** + the decomposition's nested defaults (root component's tag minus `sl-`, kebab-cased, as the folder)". With a path this specific it is ambiguous whether the root component folder is created _inside_ `…/control-a2-nsp-class-overview-r1/` or whether that directory _is_ the root component folder. Unresolved — Stage 3 was never reached, but it was an open decision from setup.

5. **Mapping "figma (remote)" to a tool family.** The answer carries a parenthetical. The analyst's contract expects a server token (`figma` vs `figma-desktop`), so I had to strip it and additionally spell out "use the `mcp__figma__*` tools" in the spawn prompt to be unambiguous.

6. **What "brief waits" means between re-spawns.** Rule 4 says "re-spawn the analyst up to 2 more times (brief waits)" without specifying a duration. I inserted no explicit sleep (each spawn took ~85 s anyway).

7. **Whether a re-spawned analyst should be told it is a retry.** Not specified. I told it (attempts 2 and 3 carried "this is a RETRY after a previous attempt returned BLOCKED_ON_MCP"). This is a real variable — a retry-aware analyst might behave differently from a naive one.

8. **Whether a re-spawned analyst may reuse the partial artifacts already in the run folder.** Not specified. I did not tell it to; all three re-ran `get_metadata` from scratch and overwrote `figma-metadata.json`.

9. **Whether to switch MCP servers after three failures.** The skill's halt text ends with "opening the desktop app", hinting at `figma-desktop`, but rule 4 prescribes only re-spawn-then-halt, and the analyst spec forbids the agent from switching ("Do not try the other server for these — server selection is the orchestrator's job, not yours"). Nowhere does the skill authorise the _orchestrator_ to switch mid-run either. I decided not to switch, and halted. (This is the gap in item 2 of §7 below.)

10. **`.gitignore`** — the skill asks the coordinator to ensure `.implement-design/` is ignored. It already was (line 21). Nothing to decide, but it's a coordinator-owned check the skill does not scope ("add it if it isn't" — to which `.gitignore`, in a monorepo?).

---

## 4. Wall clock

|           |                                 |
| --------- | ------------------------------- |
| Start     | `Sun Oct  4 18:58:54 CEST 2026` |
| End       | `Sun Oct  4 19:04:50 CEST 2026` |
| **Total** | **~5 min 56 s**                 |

Breakdown: ~90 s coordinator setup (read SKILL.md + `component-conventions.md`, check `.gitignore`, create run folder), then three analyst spawns at 89.6 s / 87.9 s / 82.2 s (≈ 260 s, 73 % of the run), then halt bookkeeping.

Subagent token usage: 28.0 k + 27.7 k + 25.5 k ≈ **81 k tokens burned on three identical failures**.

---

## 5. Artifacts

**Run folder used**: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/ns-fundaments-1/`
(derived per the skill from the Figma _file_ name, **not** from the case name — see gap 1)

What landed in it:

| File                          | Size       | Status                                                                                                                                           |
| ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `figma-metadata.json`         | 1 847 B    | written (3× overwritten, identical) — the node's structural tree                                                                                 |
| `figma-code-connect-map.json` | 3 B (`{}`) | written (3× overwritten) — empty map                                                                                                             |
| `figma-design-context.md`     | —          | **never written** (step 5 never reached)                                                                                                         |
| `figma-variable-defs.json`    | —          | **never written** (step 6 never reached)                                                                                                         |
| `screenshot.png`              | —          | **never written** (step 7 never reached)                                                                                                         |
| `screenshot-MISSING.txt`      | —          | not written either — the analyst's missing-screenshot marker only fires if `get_screenshot` itself fails, not if the run halts before calling it |
| `manifest.md`                 | —          | never written (Stage 2 never reached)                                                                                                            |
| `testing/`                    | —          | never created                                                                                                                                    |

**Artifact-integrity bug observed**: on attempt 1, `figma-code-connect-map.json` was written as the response _verbatim_ — i.e.

```
{}
Note: the Code Connect lookup timed out, so this response may be missing Code Connect data.
```

— which is **not valid JSON** in a `.json` file. The analyst spec says "preserving the response verbatim", which conflicts with the `.json` extension whenever the MCP server appends prose to the body. Later attempts happened to write bare `{}`.

**`get_metadata` content** (the one call that fully succeeded), for the record — the node is a 1280×1003 frame, 14 descendants:

```
frame 2422:87039 "class overview " 1280×1003
├─ instance 2422:87040 "Navigation" 1280×104
└─ frame "main wrapper" → "content-area-wrapper" → "content-area" → "cards"
   ├─ frame 2422:87221 "Frame 108" 350×91
   │  ├─ frame "Frame 106": text "Class code", text "D9981"
   │  └─ frame "Frame 105": 2× instance "sl-button-rectangular" 36×36
   └─ frame 2422:87047 "Frame 95" 1184×728
      ├─ text 2422:91203 "Students"
      ├─ instance 2422:87052  "sl-button-bar/Rectangle" 138×36
      ├─ instance 2422:91204  "sl-button-bar/Rectangle" 121×36
      └─ instance 2422:87812  "sl-grid-quick-grid" 1152×536
```

**The scale dimension of this case was never exercised.** `get_metadata` on the target node returned a compact 1.8 KB / 14-node tree. The ~10,900-node figure is the _file_, not this node, and the halt occurred before any of the calls that would actually feel the file size (`get_design_context`, `get_variable_defs`) or the node count (manifest synthesis). This run therefore says nothing about A2-as-scale-case; it only surfaced a Stage-1 gate.

**Working tree**: clean of stray artifacts. `git status --porcelain` shows only the four pre-existing untracked entries present at session start (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing was committed.

---

## 6. Components created / validator verdicts / tests / decomposer questions / punch list

**None of these exist.** The run halted in Stage 1, before Stage 2.

- Components created: **none**
- Stage 2 decomposer: **never spawned** → no component tree, no open questions, no defaults chosen
- Stage 3 implementers: **never spawned** → no type-check gate run
- Stage 4 visual-validator: **never spawned** → no verdicts, no `testing/` captures
- Stage 5 component-author: **never spawned** → no tests, no stories, no docs
- Stage 6 component-reviewer: **never spawned** → no `[CRITICAL]` / `[MINOR]` punch list

Agents actually spawned across the whole run: `implement-design:design-analyst` ×3. That is the complete list.

---

## 7. What surprised me about how the skill behaved

1. **A successful tool call was converted into a hard halt by substring matching.** The Figma MCP server returned a _200 with an advisory_: `{}` plus "the Code Connect lookup timed out, so this response may be missing Code Connect data." That is a legitimate, interpretable result — "I found no mappings, and here's a caveat about why that might be incomplete." The analyst's transient-error list includes the bare word "timeout"/"timed out", so the advisory tripped it. And the very next line of the spec — "don't read 'connection lost' as 'no Code Connect mappings'" — actively discourages the analyst from doing the other thing. The guard designed to prevent one false negative produces a guaranteed false positive on this server's own soft-degradation message. The spec distinguishes _error_ from _result_ but has no category for _result-with-warning_.

2. **The skill knowingly offers the failing path and gives it no recovery.** Stage 0's own wording for the remote server is "`figma` (remote; headless, but `get_code_connect_map` is unreliable)". The skill therefore _knows_ this exact call is unreliable on the server the user may choose — yet the only `get_code_connect_map` failure handling in the whole pipeline is "re-spawn twice, then halt". There is no "proceed without Code Connect data", no "fall back to `figma-desktop`" (explicitly forbidden to the analyst, never authorised for the orchestrator), and no "treat an empty map as zero mappings". Choosing the documented-unreliable option is a dead end with no documented exit.

3. **Retry-on-determinism.** "Re-spawn up to 2 more times (brief waits)" is sound for flaky transport, but the pipeline has no way to notice that attempt 2 failed _identically_ to attempt 1 and that attempt 3 is therefore pointless. 73 % of the wall clock and ~81 k subagent tokens went to re-running a deterministic failure.

4. **The halt's remedy text doesn't match the halt.** The skill instructs: "report the server is unreachable … suggest `claude mcp list` / re-auth / opening the desktop app". The server was _not_ unreachable — `get_metadata` succeeded six times across three spawns. Following the skill literally would have me hand the user a diagnosis that is simply wrong, and three remedies none of which touch the actual cause. I report it accurately here instead, but that is the skill under-specifying its own failure taxonomy: it has exactly one `BLOCKED_ON_MCP` bucket and one canned explanation for it.

5. **The partial run folder is a dead artifact, not a resumable cache.** Two of five expected files landed; the `-N` uniqueness rule means the next invocation starts a fresh empty `ns-fundaments-2`; and the analyst's own `screenshot-MISSING.txt` marker — its one mechanism for signalling incomplete ingestion to later stages — never fires on an early halt, so there is nothing in the folder saying _why_ it is incomplete. Reproducibility is claimed for the artifacts, but nothing makes them re-usable.

6. **`.json` filenames vs. "preserve the response verbatim".** These two instructions in the analyst spec are in direct conflict whenever the MCP server appends prose to a JSON body — and it did. Attempt 1 produced a syntactically invalid `figma-code-connect-map.json`. Any downstream `JSON.parse` of a run artifact is one chatty MCP note away from breaking.

7. **Run-folder naming is derived from the wrong noun for this workflow.** Slugging the _file_ name means every case in `NS-fundaments` (A2, A8, B-nsp-home, …) collides into `ns-fundaments-1/2/3/…`, distinguishable only by opening the artifacts. The existing 23 folders on disk are all named by case, which suggests the convention in the SKILL.md is not what anyone actually wants — but an unassisted coordinator following the skill literally produces the file-slug name.

8. **Stage 0's output-location options are narrower than reality.** The question offers two shapes and the answer in practice is an arbitrary path; the skill never says how to classify a path that is neither literal, nor how the derived component folder composes with a deep supplied path. Benign here, but it would have been a live guess in Stage 3.

9. **Minor: no scale signal reached the pipeline.** For a run billed as the scale case, nothing the pipeline did was scale-sensitive. The Stage-1 gate fires on call _order_ (`get_code_connect_map` is step 3 of 7, before design context, variable defs, and the screenshot), so a large design fails here identically to a tiny one. Whatever A2 was meant to stress is downstream of a gate that never let it through.
