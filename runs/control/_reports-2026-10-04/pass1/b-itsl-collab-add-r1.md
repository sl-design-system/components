# Control run — B-Itsl-Collab Add element (r1)

**Case**: `https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=5006-43051`
**Pipeline**: `/implement-design` (plugin skill), invoked via the Skill tool, Stage 0 answers supplied up front.
**Start**: Sun Oct 4 20:48:28 CEST 2026
**End**: Sun Oct 4 20:50:21 CEST 2026
**Wall clock**: ~1 min 53 s

---

## 1. Stage reached / halt

**Halted in Stage 1 (design ingestion).** Never reached Stage 2.

The `design-analyst` returned the halt token:

> `BLOCKED_ON_CODE_CONNECT`

with the blocked-node list:

| Node ID    | Name       |
| ---------- | ---------- |
| 5006:43052 | Navigation |
| 5006:43056 | PageHeader |
| 5006:43058 | Button     |
| 5006:43059 | Button     |
| 5006:43065 | xlsx       |
| 5006:43070 | pptx       |
| 5006:43075 | docx       |
| 5006:43080 | page       |

Analyst's reason, verbatim:

> `get_code_connect_map` returned `{}` for the whole subtree (`5006:43051`), and I confirmed this isn't a node-batching artifact by re-querying it directly on representative instances (`5006:43058` Button, `5006:43052` Navigation, `5006:43065` xlsx icon) — all came back `{}` too. None of the instances carry an `sl-*` node name, and with the map empty there's no child or sibling snippet to borrow from, so none qualify as "identified" under the heuristic. The list above excludes instances inside `hidden="true"` content-blocks (e.g. the duplicate `file`, `google-doc`, `google-slides`, `google-sheets` icon instances under the three hidden `Content-block` variants) since those aren't part of the rendered frame.
>
> Per the blocking protocol, `get_design_context` and `get_screenshot` were not called.

Skill Stage 1 step 5 makes this a hard halt by design: _"the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list."_ I followed it — no retry, no workaround, no hint supplied.

Note this halt is **not** the `BLOCKED_ON_MCP` path, so the "re-spawn up to 2 more times" rule in step 4 did not apply. The MCP server was reachable and answered; it simply has no Code Connect mappings for this file.

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** The four supplied answers (server = `figma` remote, framework = `lit`, i18n = no, output location = `examples/lit/src/_runs/control-b-itsl-collab-add-r1/`) covered every question Stage 0 defines. No `AskUserQuestion` was needed; the URL validated as a `figma.com/design/...` link.

## 3. Decisions the four answers did not cover (skill gaps)

All are small because the run died early — but all of them are real under-specifications that a coordinator must resolve unaided:

1. **Run-folder slug derivation vs. the actual repo state.** The skill says kebab-case the _Figma file name from the URL_ → `collaboration-folder`, then smallest unused `-N`. That gave `collaboration-folder-3`. But `.implement-design/` already contains folders named after _cases_, not files (`b-itsl-collab-add-element/`, `a6-itsl-collab-shared-folder/`, alongside `collaboration-folder-1/` and `-2/`). The skill's rule and the folder's lived convention disagree; I followed the skill literally. A coordinator with less discipline would "helpfully" name it after the case and break the rule.
2. **Which `.gitignore` entry counts as satisfying the ignore requirement.** The skill says "make sure `.implement-design/` is ignored — add it to the project's `.gitignore` if it isn't". The repo has a bare `.implement-design` (no trailing slash) on line 21 plus a `.claude/implement-design` on line 20. I judged line 21 sufficient and added nothing. The skill doesn't say what form to check for.
3. **Output location is neither of the two shapes the skill names.** Stage 0 offers "the SLDS monorepo `packages/components/`" or "an app/example path like `examples/`". The supplied value `examples/lit/src/_runs/control-b-itsl-collab-add-r1/` is four levels deeper than either and is itself a leaf folder, not a root to nest a derived component name under. Stage 3 step 9 says to derive the folder from "the root component's tag minus `sl-`, kebab-cased" — so it is undefined whether the component goes _at_ the supplied path or in a derived subfolder _under_ it. I did not have to resolve this (halted first), but it was already pending.
4. **Nothing tells the coordinator what to pass the analyst about the blocking protocol.** The analyst's own definition carries it; the skill's spawn instruction (step 3) lists four inputs (URL, server, run path, schema path). I passed exactly those. Whether the breakpoint list, i18n decision, or output location should also reach the analyst is unstated — it turned out not to matter.
5. **"Read `component-conventions.md` once up front yourself so you can sanity-check agent output"** — no criteria given for what sanity-checking means or when to apply it. I read it; it had no bearing on a Stage 1 halt.
6. **No instruction on what to do with a partially-populated run folder after a halt.** The folder now holds two of the five promised artifacts. The skill doesn't say whether to clean up, leave it, or mark it. I left it intact.

## 4. Wall clock

**~1 min 53 s** total (20:48:28 → 20:50:21). The analyst subagent itself ran 81.5 s across 9 tool calls.

## 5. Artifacts

Run folder used: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/collaboration-folder-3/`

What landed in it:

| File                          | Size     | Note                                                                                      |
| ----------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 10,951 B | The full node tree for `5006:43051` ("Add element [3rd implementation]", 1280×768 frame). |
| `figma-code-connect-map.json` | 3 B      | Literally `{}`.                                                                           |

**Not written** (correctly, per the analyst's blocking protocol — it stops before those calls): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`, `testing/`.

Working tree is clean of anything this run produced — `git status --short` shows only the four pre-existing untracked items from before the run (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing committed; no `git add`/`commit`/PR.

## 6. Components created / validator verdicts / tests / decomposer questions / punch list

**None of the above exist.** The run halted before Stage 2, so: no decomposition, no open questions, no defaults chosen, no components, no story ids, no validator verdicts, no tests, no `[MINOR]` punch list. No dev server was started, so **no port conflict arose** — the Stage 4 port caveat never came into play.

## 7. Surprises, ambiguities, contradictions

1. **`figma-metadata.json` is not JSON.** The remote `figma` MCP's `get_metadata` returns **XML** (`<frame id="5006:43051" name="…"><instance …/></frame>`), and the analyst persisted it verbatim into a file the skill names `.json`. Any downstream consumer that `JSON.parse`s it by extension will fail. The skill names all four raw-output files with extensions that assume a format the server does not necessarily return.
2. **The skill offers a server choice that predicts this exact failure, then provides no path through it.** Stage 0's own copy says the remote `figma` server is one where "`get_code_connect_map` is unreliable" and recommends `figma-desktop` instead. The run was pinned to the unreliable option and halted on precisely that unreliability — but the skill's Stage 1 treats the halt as "a human must publish Code Connect mappings in Figma", which is a _different diagnosis_ from "you picked the server whose CC map is unreliable". A coordinator cannot distinguish "no mappings exist" from "this transport can't see them" with anything the skill provides. The honest answer here is unknown: an empty `{}` is consistent with both, and the skill never says to re-try on the other server before declaring a human-action block.
3. **The analyst's blocking protocol costs the run its ground truth.** Because it halts before `get_screenshot`, `screenshot.png` is absent — so even a human who wanted to inspect what the pipeline saw has only the node tree. Capturing the screenshot is cheap and independent of Code Connect; stopping before it makes the halt less diagnosable than it needs to be.
4. **Step 4's retry budget is attached to the wrong failure.** `BLOCKED_ON_MCP` gets three attempts; `BLOCKED_ON_CODE_CONNECT` gets zero. Given that an empty CC map is the _most likely_ symptom of a transport/auth problem on the remote server, the retry budget is allocated to the failure mode that announces itself clearly and withheld from the one that is ambiguous.
5. **The analyst's heuristic has no escape hatch when the map is entirely empty.** The schema's "(identified)" path works by borrowing a child's or peer's resolved snippet — which presupposes at least one successful mapping. With `{}` across the board there is nothing to borrow from, so the heuristic degenerates to "block" by construction. `Navigation`, `PageHeader`, `Button` are near-certainly SLDS components by name alone, but the skill gives the analyst no licence to say so.
6. **The analyst did more diligence than the skill asked for** — it re-queried three representative instances individually to rule out a node-batching artifact before declaring the block. That is good behavior, but it comes from the agent definition, not from `SKILL.md`, which simply says the analyst "returns … `BLOCKED_ON_CODE_CONNECT` + node list".
7. **A measurement-harness note, not a skill finding**: the environment blocks `sleep`-based waiting in Bash, so the "wait for the completion notification" discipline is enforced rather than merely advised. No polling loops were run.
