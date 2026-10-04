# Control run — B-Sesame Group details (r1)

- **Case**: B-Sesame Group details
- **Figma**: https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2142-48093
- **Stage 0 answers supplied**: server `figma` (remote), framework `lit`, i18n `no`, output `examples/lit/src/_runs/control-b-sesame-group-details-r1/`
- **Start**: Sun Oct 4 20:48:16 CEST 2026
- **End**: Sun Oct 4 20:51:41 CEST 2026
- **Wall clock**: ~3 min 25 s

---

## 1. Stage reached / halt

**Halted in Stage 1 (design ingestion).** Never reached Stage 2.

Halt token returned by `implement-design:design-analyst`:

```
BLOCKED_ON_CODE_CONNECT
```

Analyst's stated reason, verbatim:

> The `get_code_connect_map` call for node `2142:48093` ("Group details") returned a completely empty mapping (`{}`) — no entries at all, not even null-valued ones. Applying the heuristic (rescue a node only if its name is `sl-*`, its sub-nodes carry a CC snippet, or a peer instance has a non-null snippet — none of which is possible here since the map has zero snippets anywhere), the following component-instance nodes cannot be identified as existing SLDS components and are genuinely unconnected.

I verified the persisted artifact: `figma-code-connect-map.json` is literally `{}` (3 bytes).

Skill step 5 mandates: _"**`BLOCKED_ON_CODE_CONNECT`**: … **Halt** and report the blocked-node list so the user can publish mappings and re-run."_ No retry is permitted for this token (retries are specified only for `BLOCKED_ON_MCP`). I halted as written and did not intervene.

**23 blocked nodes reported** (hidden-state / closed-dropdown internals were excluded by the analyst):

| Node       | Name                    |
| ---------- | ----------------------- |
| 2142:48105 | button secondary        |
| 2142:48111 | button secondary        |
| 2142:48118 | button secondary        |
| 2142:48136 | DEMO - Tab-switches     |
| 2142:48137 | DEMO - Tab-switches     |
| 2142:48138 | DEMO - Tab-switches     |
| 2142:48151 | menu item SU            |
| 2142:48152 | menu item SU            |
| 2142:48153 | menu item SU            |
| 2142:48154 | menu item SU            |
| 2142:48156 | avatar_SU               |
| 2142:48168 | button                  |
| 2142:48199 | select-box-down         |
| 2142:48332 | Focus ring              |
| 2142:48345 | select-box-down         |
| 3659:36698 | Accordion-multiple-view |
| 2142:48465 | button primary          |
| 2142:48471 | Empty ison              |
| 2142:48491 | menu item footer        |
| 2142:48492 | menu item footer        |
| 2142:48493 | menu item footer        |
| 2142:48494 | menu item footer        |
| 2142:48495 | menu item footer        |

The analyst also noted that nodes named `sl-text_input`, `sl-label-theme`, `sl_base-text_input`, `sl-base-selectbox`, `sl-radio_group-theme`, `sl-base-checkbox` were rescued **by name shape alone** and are not in the blocked list.

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** All four answers were supplied in the argument block, and the skill's Stage 0 is a single up-front batch. No `AskUserQuestion` was issued, and no agent asked a follow-up question. The run was fully unassisted from invocation to halt.

## 3. Decisions the four answers did not cover (skill gaps)

Every one of these I had to resolve myself; none is specified:

1. **Kebab-casing of the Figma file name.** The skill says derive `<file-slug>` by kebab-casing the file name from the URL. The URL segment is `MySesame-Redesign`, which kebab-cases ambiguously to either `mysesame-redesign` or `my-sesame-redesign`. I chose `mysesame-redesign` to match pre-existing folders. The skill's one worked example (`Test-CC` → `test-cc`) does not disambiguate an internal capital inside a word.
2. **The `-N` suffix identifies the _file_, not the _node_.** I got `-3` because `mysesame-redesign-1` and `-2` already existed — from runs of **different nodes in the same Figma file**. Nothing in the folder name (or any index) records that `-3` is node `2142-48093`. The skill's uniqueness rule makes artifacts un-attributable across runs of the same file.
3. **Pre-existing `.implement-design/b-sesame-group-details/` folder.** A folder named after this very case already exists, produced by some other process that names by case rather than by the skill's rule. The skill's naming rule therefore does not own `.implement-design/`, and I had to decide to ignore the collision and follow the skill literally.
4. **Creating `testing/` up front.** The skill describes `<run>/testing/` as "written by visual-validator" but also lists it as part of the run folder created "at the start". I created it empty at Stage 1; unspecified either way.
5. **Which concrete MCP tool names to hand the analyst.** The analyst agent has _both_ `mcp__figma__*` and `mcp__figma-desktop__*` tools available. The skill tells the coordinator to pass "the chosen server" but gives no wording, and the analyst cannot infer the prefix from the word "figma (remote)" alone without risk. I had to spell out the exact tool prefixes and the `get_screenshot`-always-remote carve-out in the spawn prompt. A different coordinator phrasing could silently route to the desktop server.
6. **Classifying the output location.** The supplied path `examples/lit/src/_runs/control-b-sesame-group-details-r1/` is neither of the two options the skill enumerates (`packages/components/` flat monorepo, or `examples/`). I classified it as an app/example path (lightweight set, no package.json/docs/changeset). This never became load-bearing — the halt came first.
7. **Whether an empty `{}` map deserves a retry.** The skill routes `BLOCKED_ON_CODE_CONNECT` straight to a non-retryable halt. I had to decide not to re-spawn on the desktop server despite the strong signal this was a server-side result, because the skill's retry budget is scoped to `BLOCKED_ON_MCP` only. (See surprises #1.)
8. **What the run folder should contain on a halt.** The skill lists six artifacts for the run folder with no statement about partial runs. I had to accept a folder with two of them and no `manifest.md`, and decided not to synthesize anything.

## 4. Wall clock

**3 min 25 s** total (20:48:16 → 20:51:41). The analyst subagent itself ran 2 min 51 s across 6 tool calls.

## 5. Artifacts

Run folder: **`/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/mysesame-redesign-3/`**

What landed:

| File                          | Size     | Note                                                             |
| ----------------------------- | -------- | ---------------------------------------------------------------- |
| `figma-metadata.json`         | 19,495 B | full node tree for frame `2142:48093` "Group details", 1280×2392 |
| `figma-code-connect-map.json` | 3 B      | literally `{}`                                                   |
| `testing/`                    | —        | empty (created by me at Stage 1, never used)                     |

**Not written** (analyst stopped before them, "per protocol"): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`.

`.implement-design` is already in `.gitignore` (line 21) — no gitignore edit was needed.

## 6. Components, validators, tests, decomposer, punch list

**None of these exist.** The run never reached Stage 2, so:

- Components created: **none**
- Validator verdicts: **n/a** (Stage 4 never ran; no dev server was started)
- Test results: **n/a**
- Decomposer open questions + defaults: **n/a** (decomposer never spawned)
- `[MINOR]` punch list: **n/a** (reviewer never spawned)

## 7. Surprises, ambiguities, contradictions

1. **Stage 0's own help text contradicts Stage 1's halt semantics — this is the headline finding.** Stage 0 describes the remote `figma` server as _"headless, but `get_code_connect_map` is unreliable"_, and recommends `figma-desktop` precisely because it is _"most reliable for `get_code_connect_map`"_. Stage 1 then treats a bare `get_code_connect_map` result as authoritative evidence that the **design** is missing human-published mappings, and halts non-retryably. So selecting the option the skill itself documents as unreliable for this exact call produces a deterministic halt that **misattributes a tool-reliability problem to the designer**. There is no branch anywhere for "empty map + remote server → inconclusive, retry on desktop, or degrade gracefully".
2. **`{}` and "entries present but null" are collapsed into one verdict.** A map with zero entries is a categorically different signal from a map that lists 23 instances each with a null snippet. The former usually means the call didn't resolve (auth, library permissions, server mode); the latter is real evidence of unconnected components. The analyst explicitly noted the map had _"no entries at all, not even null-valued ones"_ and still emitted the human-action halt. The skill gives it no way to say "inconclusive".
3. **Whether the run halts depends on the design's node _naming convention_, not its actual connectedness.** The rescue heuristic keeps anything named `sl-*` and blocks everything else. In this file that means `sl-base-selectbox` passes while `button primary`, `button secondary`, `avatar_SU`, `menu item SU` — all plainly SLDS primitives that almost certainly have real counterparts — block the run. A file whose designers happened to prefix differently would have halted on a different set, or not at all. Nothing in the skill acknowledges this coupling.
4. **The halt costs the run its ground truth for no reason.** `get_screenshot` is cheap, is explicitly called "ground truth" and "cached" throughout the skill, and uses a _different_ server than the one that failed. Ordering the Code Connect gate before the screenshot means a blocked run produces no visual artifact at all — the human who has to go publish 23 mappings gets a list of node ids and no picture of what they're looking at. The sequencing is under-specified; nothing says the gate must precede the capture.
5. **`Focus ring` and `Empty ison` are in the blocked list.** "Focus ring" is a design-time affordance, not a component, and "Empty ison" is a typo'd icon placeholder in the source file. Requiring Code Connect mappings for these before any code can be generated is a gate that can likely never be satisfied as literally stated. The analyst did filter hidden-state internals, so there _is_ a filter concept — it just doesn't cover non-component decorations.
6. **No stage defines the halt artifact contract.** The skill enumerates what the run folder holds on success and is silent on a partial run. The resulting folder is a 2-of-6 fragment with an empty `testing/`, and nothing in it records the Figma URL or node id in human-readable form. Re-running later, there is no way to tell `mysesame-redesign-3` apart from `-1` and `-2` without opening the JSON.
7. **Step 19's working-tree check is ambiguous about pre-existing dirt.** `git status` shows four untracked entries (`agents/`, `agents.zip`, `analiza-agent-plugin.md`, `analiza-projektu.md`). All four predate the run (they were in the starting status) — **nothing new landed outside the run folder, and I removed nothing**. But the skill phrases the check as "confirm nothing landed outside the intended trees … remove any that slipped out", which, read literally by an agent that didn't snapshot the tree first, invites deleting a user's unrelated untracked files.

**Environment note (separate from skill findings):** no port conflict. I checked 6006/6007/6008/8000/4200 at run start — no listeners. Stage 4 never ran, so no dev server was started by this run.

**Nothing was committed.** No `git add`, no `git commit`, no PR.
