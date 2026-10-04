# Control run — B-Kampus Notes panel (r1)

- **Figma**: https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5308-32158
- **Start**: Sun Oct 4 20:49:03 CEST 2026
- **End**: Sun Oct 4 20:50:49 CEST 2026
- **Wall clock**: 1 min 46 s
- **Skill**: `implement-design:implement-design`, invoked via the Skill tool with the four answers supplied verbatim.

---

## 1. Stage reached / halt

**Halted in Stage 1 (design ingestion).** Never reached Stage 2.

Halt token returned by `implement-design:design-analyst`:

```
BLOCKED_ON_CODE_CONNECT
```

Reason, as reported by the analyst verbatim:

> I checked the Code Connect map both at the top-level node and on individual descendant instances (`Header-navigation`, `subchapter-card`) — all return `{}`. I also pulled the internal structure of two representative instances (`Header-navigation` → `top-navi-item-light` / `top-navi-item-icon`; `subchapter-card` → `🏗️ subchapter-link-card_base`) to check for the identification heuristics (sl-\* naming, child snippets, peer snippets). None qualify: no node is named `sl-*`, no child resolves to a Code Connect snippet, and no peer instance of the same component has a non-null mapping anywhere in this map.
>
> Per the blocking rule, I stopped before calling `get_design_context` or `get_screenshot`.

Blocked-node list (18 nodes):

| Node ID    | Name                                |
| ---------- | ----------------------------------- |
| 5308:32159 | Fullscreen toggle                   |
| 5308:32161 | Table of contents - Elements basics |
| 5308:32162 | notes-sidepanel                     |
| 5308:32164 | breadcrumb-2023                     |
| 5308:32165 | Chapter page title                  |
| 5308:32167 | Student view                        |
| 5308:32170 | subchapter-card                     |
| 5308:32171 | subchapter-card                     |
| 5308:32172 | subchapter-card                     |
| 5308:32174 | subchapter-card                     |
| 5308:32175 | subchapter-card                     |
| 5308:32176 | subchapter-card                     |
| 5308:32178 | subchapter-card                     |
| 5308:32179 | subchapter-card                     |
| 5308:32181 | Student view                        |
| 5308:32182 | Left-toolbar                        |
| 5308:32183 | Header-navigation                   |
| 5308:34107 | Number annotation                   |

**Coordinator handling**: the skill's step 4 grants up to 2 retries, but only for `BLOCKED_ON_MCP`. Step 5 grants none for `BLOCKED_ON_CODE_CONNECT` — "**Halt** and report the blocked-node list so the user can publish mappings and re-run." I halted on the first return, with no retry and no intervention.

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** All four answers (MCP server, framework, i18n, output location) were supplied in the argument block, and Stage 0 needed nothing else before Stage 1. No `AskUserQuestion` call was made.

Caveat worth recording: the skill's step 2 is phrased as an **unconditional** instruction ("Ask **all** setup questions in one batch"). There is no "if the answers are already supplied, skip the ask" clause. I inferred the skip. A coordinator following the text literally would re-ask four questions it already has answers to.

---

## 3. Decisions the four answers did not cover

Every gap encountered before the halt, however small:

1. **Run-folder name vs. the case being built.** The skill derives `<run>` by kebab-casing the **Figma file name**, not the node: `New-content-view` → `new-content-view`, then smallest free `-N`. `-1` and `-2` existed, so I used `.implement-design/new-content-view-3/`. The folder therefore carries **no information about which design inside the file was built** — this is the "B-Kampus Notes panel" case, and nothing in the folder name says so. It also doesn't match the output location name the user gave (`control-b-kampus-notes-r1`). Two different nodes in the same Figma file are distinguished only by an opaque integer.

2. **A complete prior run for this exact node already exists and the skill says nothing about it.** `.implement-design/b-kampus-notes-panel/` (dated Oct 1) holds `screenshot.png`, `manifest.md`, `IMPL-BRIEF.md`, `token-map.md`, `progress.json`, `slds-api.md`, `testing/` (35 entries) and all four Figma raw-output files, from an earlier run that used a **different, node-based folder-naming scheme**. The skill has no resume/reuse/cache rule and no step that checks whether this node has been ingested before, so the pipeline refetches from zero. I did not reuse any of it (the skill does not authorize that). Two consequences: the earlier run's naming scheme and the skill's current one disagree, and a cached ground-truth screenshot for this exact node sat unused one directory away while Stage 1 halted.

3. **Translating "Figma MCP server: figma (remote)" into tool names.** The answer names a _server_; the analyst agent is granted both `mcp__figma__*` and `mcp__figma-desktop__*` tool families. The skill tells me to pass "the chosen server" but not in what form. I had to spell out the four concrete tool names in the spawn prompt. An agent handed just the word "figma" could plausibly reach for either family.

4. **Whether an all-`{}` Code Connect map is a genuine block or a known limitation of the chosen server.** Stage 0's own question text warns that on the remote `figma` server "`get_code_connect_map` is **unreliable**". Stage 1 step 5 then treats an empty map as a hard, human-action-required halt. The skill provides **no rule for telling the two apart**. I followed the literal halt, but this was a real judgement call, not a mechanical step — see §7.

5. **Breakpoints are never defined.** Stage 4 step 13 says to pass the validator "the breakpoints", but no stage — Stage 0 included — ever establishes what they are. Not reached this run, but it is a hole in the four-answer set.

6. **When the output-location directory gets created.** The skill never says. `examples/lit/src/_runs/control-b-kampus-notes-r1/` was never created (correct here, since we halted before Stage 3), but the timing is unspecified.

7. **`.gitignore` step was a no-op.** Step "make sure `.implement-design/` is ignored" — already present (line 21), as is `examples/lit/src/_runs/` (line 66). No action needed; noting it so the no-op isn't mistaken for a skipped step.

---

## 4. Wall clock

**1 minute 46 seconds** (20:49:03 → 20:50:49 CEST). The analyst subagent itself ran 73.9 s across 9 tool calls / ~32.5k tokens.

---

## 5. Artifacts

Run folder used: **`/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/new-content-view-3/`**

What landed in it:

| File                          | Size   | Note                                                                                                                                                       |
| ----------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 2763 B | **Contains XML, not JSON** — `<frame id="5308:32158" name="Chapter page – Notes side panel – With notes" …>`. The skill names the file but not its format. |
| `figma-code-connect-map.json` | 3 B    | Literally `{}` — the empty map that triggered the halt.                                                                                                    |

**Not written** (the analyst's blocking rule fires before those calls): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`. The `testing/` subfolder was never created.

Working tree is clean of pipeline output. `git status` shows only pre-existing untracked items unrelated to this run (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing committed, no `git add`.

---

## 6. Components created, verdicts, tests, open questions, punch list

**None of it.** The run halted in Stage 1, before decomposition. Therefore:

- **Components created**: none. `examples/lit/src/_runs/control-b-kampus-notes-r1/` does not exist.
- **Validator verdicts**: none — Stage 4 never ran.
- **Test results**: none — Stage 5 never ran.
- **Decomposer open questions + defaults**: none — Stage 2 never ran, no decomposition exists.
- **[MINOR] punch list**: empty — Stage 6 never ran.

---

## 7. What surprised me about how the skill behaved

1. **Stage 0's recommendation and Stage 1's halt condition work against each other.** Stage 0 tells the user the remote `figma` server's `get_code_connect_map` is _unreliable_ and recommends `figma-desktop` instead. Stage 1 then converts exactly that unreliable call's empty result into a terminal halt attributed to a **human action in Figma** ("publish mappings and re-run"). Picking the non-recommended-but-offered option therefore makes a **false halt** structurally likely, and the skill never cross-checks the two: it does not downgrade the halt, does not suggest retrying on `figma-desktop`, and does not caveat the blocked-node list with "or your server can't read the map." The diagnosis handed to the user ("publish Code Connect mappings") may well be wrong, and the run has no way to tell.

2. **Asymmetric retry policy, with the retries on the wrong failure.** `BLOCKED_ON_MCP` — a transport failure the analyst can clearly identify — gets 3 attempts. `BLOCKED_ON_CODE_CONNECT` — which on this server is _also_ frequently a transport/permission artifact — gets 0. The retry budget is spent on the unambiguous failure and withheld from the ambiguous one.

3. **Stage 1's artifact list is written as unconditional but is conditional in practice.** The skill states the analyst "caches the screenshot there **and** writes the raw output of each Figma call", naming all four files. On a Code Connect halt only two of the four ever exist, because the analyst blocks before `get_design_context` / `get_variable_defs` / `get_screenshot`. A reader of the skill would expect a reference screenshot on disk after Stage 1; there isn't one.

4. **No awareness of prior runs on the same node.** The pre-existing `b-kampus-notes-panel/` folder has a cached `screenshot.png` and a full `manifest.md` for this exact node. The skill's uniqueness rule actively _avoids_ that folder (always picks a fresh `-N`), so prior ingestion is invisible to the pipeline by construction. Combined with gap §3.1, the run-folder scheme is write-only: it guarantees a fresh directory but makes "has this design been done before?" unanswerable from the folder names.

5. **`figma-metadata.json` holds XML.** Minor, but it means any downstream consumer that `JSON.parse`s the file by its extension will fail. The skill specifies the filename and not the payload format, so the analyst is not strictly wrong.

6. **The halt arrives with no partial value.** 18 nodes were identified by name and ID, and the analyst even walked two instances' internals — but because the block fires before `get_screenshot`, the run produced no reference image, no tokens, and no design context. A halt that still cached the screenshot would at least leave the next attempt cheaper.

---

## Environment notes (separate from skill findings)

- **No port conflict.** Checked at start: nothing listening on 6006/6007/6008/8000/5173. Stage 4 was never reached, so no dev server was started.
- `.implement-design/` and `examples/lit/src/_runs/` are both gitignored, so pipeline output never appears in `git status`.
