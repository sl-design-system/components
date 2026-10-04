# Control run — A1 Kampus Subchapter feed (pass 2, R2)

- **Case**: A1 Kampus Subchapter feed
- **Figma URL**: https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5311-37116
- **Pipeline**: `/implement-design` (plugin skill `implement-design:implement-design`)
- **Start**: Sun Oct 4 20:17:39 CEST 2026
- **End**: Sun Oct 4 20:19:54 CEST 2026
- **Wall clock**: ~2 min 15 s

---

## 1. Stage reached / halt

**Reached Stage 1 (Design ingestion). Halted there.**

The `design-analyst` agent returned the halt token:

```
BLOCKED_ON_CODE_CONNECT
```

Analyst's stated reason, verbatim:

> Both files are persisted. The Code Connect map for this node (and for spot-checks on `Header-navigation` and `Exercise-card-UPDATE` individually) returned `{}` — no mappings anywhere in this subtree, at any depth. None of the component-instance descendants are named `sl-*`, and with zero non-null entries in the map there is no peer or child snippet to borrow from. Every instance in the tree is therefore genuinely unconnected per the heuristic, so per protocol I'm stopping here without calling `get_design_context` or `get_screenshot`.

Per SKILL.md Stage 1 step 5 — _"`BLOCKED_ON_CODE_CONNECT`: … **Halt** and report the blocked-node list so the user can publish mappings and re-run."_ — the coordinator halted. No retry is specified for this token (retries are specified only for `BLOCKED_ON_MCP`), so none was attempted.

Stages 2–6 did not run. No decomposer, implementer, validator, author, or reviewer agent was spawned.

### Blocked node list (23 nodes, as returned)

| Node id    | Name                                          |
| ---------- | --------------------------------------------- |
| 5311:37117 | Fullscreen toggle                             |
| 5311:37119 | Table of contents - proto/feed (hidden layer) |
| 5311:37120 | Table of contents - Elements basics           |
| 5311:37122 | breadcrumb-2023                               |
| 5311:37123 | Feed headings (2023)                          |
| 5311:37124 | Feed filters                                  |
| 5311:37125 | Student view                                  |
| 5311:37126 | Feed headings (2023)                          |
| 5311:37127 | Theory-card-UPDATE                            |
| 5311:37131 | Exercise-card-UPDATE                          |
| 5311:37132 | Exercise-card-UPDATE                          |
| 5311:37135 | Exercise-card-UPDATE                          |
| 5311:37136 | Exercise-card-UPDATE                          |
| 5311:37137 | Feed headings (2023)                          |
| 5311:37138 | Theory-card-UPDATE                            |
| 5311:37139 | Theory-card-UPDATE                            |
| 5311:37140 | Feed headings (2023)                          |
| 5311:37143 | Exercise-card-UPDATE                          |
| 5311:37144 | Exercise-card-UPDATE                          |
| 5311:37147 | Exercise-card-UPDATE                          |
| 5311:37148 | Exercise-card-UPDATE                          |
| 5311:37150 | Left-toolbar                                  |
| 5311:37151 | Header-navigation                             |

---

## 2. Did Stage 0 ask anything beyond the four supplied answers?

**No.** The URL validated as a `figma.com/design/...` link, and the four Stage 0 answers (MCP server, framework, i18n, output location) covered every question the skill lists. No `AskUserQuestion` was needed. Stage 0 cost effectively zero time.

---

## 3. Everything the four answers did not cover (coordinator had to decide)

All of these are gaps in the skill as written — small but real, each one a decision the skill leaves to the coordinator:

1. **Which `<file-slug>` to use.** The skill says kebab-case "the Figma file name from the URL". The URL segment is `New-content-view`, so the slug is `new-content-view`. But the case is _named_ "A1 Kampus Subchapter feed" and `.implement-design/` already contains a hand-named `a1-kampus-subchapter-feed` folder (and 10 similar `aN-*` folders) alongside machine-derived `new-content-view-1`. The skill's rule and the folder's existing content disagree on naming convention; I followed the skill literally → **`new-content-view-2`**.
2. **Whether `-N` collision scanning should consider the semantically-equivalent prior folder.** `new-content-view-1` existed, so `-2` was picked. The skill gives no guidance on whether a prior run for the _same node_ should be reused, resumed, or ignored. I treated the run as fresh, per the experiment brief.
3. **Whether to pre-create `<run>/testing/`.** The skill describes `testing/` as "written by visual-validator" but also says to create the run folder "at the start". I created `testing/` up front. Ambiguous; harmless either way.
4. **Where `<skill-dir>` actually is.** The skill says agents can't guess the plugin install path and the coordinator must pass absolute paths. The Skill tool supplied a base directory, so this resolved cleanly — but nothing in the skill says _how_ the coordinator learns it if the tool doesn't volunteer one.
5. **Whether `get_screenshot` is in scope for the analyst even on a Code Connect block.** The skill says `screenshot.png` is a run artifact the analyst "caches there **and**" writes raw Figma outputs. The analyst chose to skip both `get_design_context` and `get_screenshot` on detecting the block. The skill never says whether the reference screenshot should still be captured before halting — so the run folder has **no `screenshot.png`**, which would make any later resume start from scratch. I did not intervene.
6. **What "project root" means for `.implement-design/`.** The skill says "at the project root". The git root is `/Users/marcin.ludwig/Repo/sl-design-system/components`, which is itself a subdirectory of the `sl-design-system` checkout. I used the git root.
7. **Output-location sub-shape.** The supplied answer `examples/lit/src/_runs/control-a1-kampus-subchapter-r2/` is neither of the two shapes the skill names (`packages/components/` flat, or `examples/`). It is an _example_ path three levels deeper. The skill's Stage 3 step 9 rule ("root component's tag minus `sl-`, kebab-cased, as the folder") would have added _another_ nesting level under the supplied path — I would have had to decide whether the supplied folder _is_ the root folder or its parent. Never exercised (halted first), but the ambiguity is real and would have bitten Stage 3. Neighbour `control-a9-sanna-login-r1/` suggests the supplied folder is the root folder itself.
8. **`examples/lit/src/index.ts` does not re-export anything under `_runs/`.** The skill/conventions say an example reuses "the example package's existing `index.ts`". None of the 20 existing `_runs/*` components are exported from it. Would the implementer have been expected to add an export? Unspecified. Not exercised.
9. **No retry policy for `BLOCKED_ON_CODE_CONNECT`.** `BLOCKED_ON_MCP` gets "re-spawn up to 2 more times". Code Connect gets an immediate halt. Given the Stage 0 answer explicitly warns that the **remote `figma` server's `get_code_connect_map` is unreliable**, deciding _not_ to retry (or not to re-try via `figma-desktop`) was a judgement call the skill does not make for you — see §7.

---

## 4. Wall clock

**~2 min 15 s** total (20:17:39 → 20:19:54 CEST). Of that, the design-analyst subagent took **97 s** (10 tool calls, ~35.8k subagent tokens).

---

## 5. Artifacts

Run folder used: **`.implement-design/new-content-view-2/`** (git root relative; absolute `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/new-content-view-2/`).

What landed in it:

| File                          | Size      | Note                                                                   |
| ----------------------------- | --------- | ---------------------------------------------------------------------- |
| `figma-metadata.json`         | 3.7 KB    | Full node tree of frame `5311:37116` "Subchapter feed page" (1280×720) |
| `figma-code-connect-map.json` | 3 B       | Literally `{}` — the empty map that triggered the halt                 |
| `testing/`                    | empty dir | Pre-created by the coordinator; nothing written                        |

**Not** written (analyst halted before those calls):

- `screenshot.png` — **absent**, so the run has no cached ground truth
- `figma-design-context.md` — absent
- `figma-variable-defs.json` — absent
- `manifest.md` — absent (Stage 2 never ran)

`.implement-design` is already in `.gitignore` (line 21), so nothing needed adding. `git status --short` shows only the four pre-existing untracked entries from before the run (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`) — **no stray artifacts, nothing committed, no dev server started**.

---

## 6. Components, verdicts, tests, open questions, punch list

**None of the above.** The run halted in Stage 1.

- Components created: **none**
- Validator verdicts: **n/a** (Stage 4 never reached; no dev server started, so no port conflict to report either)
- Test results: **n/a** (Stage 5 never reached)
- Decomposer open questions + defaults: **n/a** (Stage 2 never reached)
- `[MINOR]` punch list: **n/a** (Stage 6 never reached)

---

## 7. What surprised me / under-specification

1. **The halt is a hard dead end with a remote server the skill itself calls unreliable.** Stage 0 literally offers `figma` with the caveat "_`get_code_connect_map` is unreliable_". The pipeline then treats an empty map from that very server as conclusive proof the design is unconnected, and halts with no retry and no suggestion to switch to `figma-desktop`. The skill _does_ suggest "opening the desktop app" — but only in the `BLOCKED_ON_MCP` branch, not here, where it would be the most obvious remedy. An operator answering Stage 0 with `figma` has, in effect, chosen a configuration the pipeline can dead-end on without telling them that's what happened.
2. **The halt costs the run its ground truth.** The analyst skipped `get_screenshot` on blocking. The screenshot is described in SKILL.md as _"the cached Figma reference (ground truth)"_ and a run-root artifact. Capturing it is cheap, it's unaffected by Code Connect state, and having it would let a human eyeball what was blocked and let a re-run skip a fetch. The skill doesn't say either way, so this came down to the agent's own protocol.
3. **`{}` vs. "unconnected instances" are conflated.** An empty map is indistinguishable from "the server couldn't answer". The analyst explicitly spot-checked two individual nodes to reduce that risk (good), but there is no distinct token for "the Code Connect map came back empty and I can't tell why" — it collapses into the same halt as "I enumerated 23 genuinely unmapped instances."
4. **The blocked list is a list of Figma component names, not of things a human can act on directly.** Names like `Exercise-card-UPDATE` repeat 8 times across the list; `Feed headings (2023)` 4 times. The halt report dutifully lists each instance id, but the actionable unit for a human publishing mappings is the _component_ (5 or 6 distinct ones), not the 23 instances. The skill says "report the blocked-node list" and that's what you get — more noise than signal for the human action it's asking for.
5. **One blocked node is a hidden layer.** `5311:37119 — Table of contents - proto/feed` is marked `hidden="true"` in the metadata. The pipeline counts hidden layers toward the block. A design can therefore be held up by a layer that would never render. Nothing in the skill says hidden instances should be excluded.
6. **No partial-progress path.** The page's chrome (frames, layout, text) is fully available from `get_metadata`; only the Code Connect snippets are missing. The skill has no "proceed without Code Connect, flag the gaps" mode — it's all-or-nothing, even though the conventions doc already instructs implementers to go read SLDS component sources when a snippet is unhelpful.
7. **The naming rule vs. reality.** The skill derives the run folder from the _Figma file name_, but the file `New-content-view` holds many unrelated cases. Every run against a different node in the same file collides into `new-content-view-N` and the folder name tells you nothing about which node was built. The existing hand-named `a1-kampus-subchapter-feed` folder in `.implement-design/` shows someone already worked around this.
