# Control run — B-Itsl-Bookmk Deleted course - content (r1)

- **Figma**: https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4549-8339
- **Start**: Sun Oct 4 18:59:45 CEST 2026
- **End**: Sun Oct 4 19:02:55 CEST 2026
- **Wall clock**: 3m 10s (of which the design-analyst subagent was 154s / 10 tool calls)
- **Skill invoked**: `implement-design:implement-design` via the Skill tool, argument block verbatim.

---

## 1. Stage reached + halt

**Reached Stage 1 (design ingestion). Halted there.** Stages 2–6 never ran.

`design-analyst` returned the halt token:

> `BLOCKED_ON_CODE_CONNECT`

…followed by a 55-entry node list. Per SKILL.md step 5 this is an unconditional halt — unlike `BLOCKED_ON_MCP` (step 4) there are **no retries**:

> **`BLOCKED_ON_CODE_CONNECT`**: the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run.

I halted without re-spawning, as written.

### Blocked-node list as returned (55 nodes)

Top-level instances: `4549:8340` Navigation · `4549:8343` PageHeader · `4549:8349` Banner · `4549:8358` Search · `4573:8406` Button · `4571:16720` Bulk actions panel · `4549:8425` Pagination

Nested-inside-an-instance icons/buttons: `I4549:8349;23112:4891` circle-info (in Banner) · `I4549:8349;17344:7058` Button (in Banner) · `I4573:8406;1902:3218` caret-down (in Button)

Table cells — 45 separate `Cell` entries, i.e. 5 header cells + 8 rows × 5 cells:
header `4549:8363`, `4571:16848`, `4549:8364`, `4549:8365`, `4549:8366`;
row 1 `4549:8370`, `4571:16763`, `4549:8371`, `4549:8372`, `4549:8373`;
row 2 `4549:8377`, `4571:16773`, `4549:8378`, `4549:8379`, `4549:8380`;
row 3 `4549:8384`, `4571:16779`, `4549:8385`, `4549:8386`, `4549:8387`;
row 4 `4549:8391`, `4571:16787`, `4549:8392`, `4549:8393`, `4549:8394`;
row 5 `4549:8398`, `4571:16808`, `4549:8399`, `4549:8400`, `4549:8401`;
row 6 `4549:8405`, `4571:16814`, `4549:8406`, `4549:8407`, `4549:8408`;
row 7 `4549:8412`, `4571:16829`, `4549:8413`, `4549:8414`, `4549:8415`;
row 8 `4549:8419`, `4571:16841`, `4549:8420`, `4549:8421`, `4549:8422`

**Root cause as observed:** `get_code_connect_map` on the remote `figma` server returned literally `{}` — an empty map, zero mappings for the whole file. The analyst correctly concluded "every instance is unconnected" from that. See §7 for why that's a skill problem, not a design problem.

---

## 2. Did Stage 0 ask anything beyond the four supplied answers?

**No.** The four answers (server, framework, i18n, output location) covered Stage 0 exactly; I made no `AskUserQuestion` call and the pipeline needed nothing else before Stage 1.

Caveat worth recording: the skill _mandates_ the question batch ("Ask **all** setup questions in one batch … a single `AskUserQuestion` call"). It has **no written provision for answers being supplied up front** — skipping the call is an undocumented deviation I had to decide on. A literal reading would have had me re-ask four questions whose answers I already held.

---

## 3. Decisions the four answers did not cover

Everything below is a gap in the skill. Listing all of them, including trivial ones.

1. **Run-folder slug.** Skill: kebab-case the Figma _file_ name → `Bookmarks` → `bookmarks`, smallest free `-N` → `.implement-design/bookmarks-1/`. But `.implement-design/` already contains 29 folders named after _cases_, not files — including `b-itsl-bookmk-deleted-course` (this very case) and `b-itsl-bookmk-course-files` (a different node in the _same_ `Bookmarks` file). So the documented rule and the repo's actual history disagree, and the rule actively **collides different designs from one Figma file into one slug family** (`bookmarks-1`, `bookmarks-2`, …) with nothing in the folder name saying which node it was. I followed the skill literally and used `bookmarks-1`.
2. **No link between the run slug and the output location.** The supplied output location is `control-b-itsl-bookmk-deleted-r1`; the derived run folder is `bookmarks-1`. The skill never relates the two, so run artifacts and generated code end up under unrelated names with no cross-reference recorded anywhere.
3. **Which MCP namespace "figma (remote)" means.** The analyst has _three_ candidate toolsets visible in this environment (`mcp__figma__*`, `mcp__figma-desktop__*`, and `mcp__MCP_DOCKER__get_*` which also exposes `get_design_context`/`get_code_connect_map`). The skill names servers as `figma` / `figma-desktop` only. I instructed the analyst to use `mcp__figma__*`.
4. **`<run>` = path or folder name?** The skill writes "`.implement-design/<run>/` … where `<run>` is a unique folder" and later "pass `<run>` to any agent". Ambiguous. I passed the absolute path.
5. **Skipping the mandated `AskUserQuestion`** (see §2).
6. **`.gitignore`** — the skill tells me to add `.implement-design/` if absent. It was already present (line 21). No decision needed, but I had to go check.
7. **Not yet reached, but already ambiguous — Stage 3 path resolution.** The supplied output location is neither of the skill's two named shapes (`packages/components/` or `examples/`); it is a deep path `examples/lit/src/_runs/control-…/`. Stage 3 says to derive the folder from "the root component's tag minus `sl-`, kebab-cased". So: is the supplied path _the_ root component folder, or the _parent_ that a derived folder goes inside? Neighbouring runs (`_runs/b-itsl-bookmk-course-files/`) put files **directly** in the case folder, i.e. the supplied path is the root — but the skill as written says otherwise. Never resolved; the run halted first.
8. **Nothing in the skill says what to do with a half-written run folder on halt** (see §5).

---

## 4. Wall clock

**3 minutes 10 seconds** end to end. Stage 1 analyst: 154s.

---

## 5. Artifacts

Folder used: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/bookmarks-1/`

What actually landed:

| File                          | Status                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `figma-metadata.json`         | written, 10,181 B — a real node tree for frame `4549:8339` "Deleted course - content", 1280×1082 |
| `figma-code-connect-map.json` | written, **3 bytes** — the literal content is `{}`                                               |
| `figma-design-context.md`     | **missing**                                                                                      |
| `figma-variable-defs.json`    | **missing**                                                                                      |
| `screenshot.png`              | **missing** — the ground-truth reference was never cached                                        |
| `testing/`                    | not created (Stage 4 never ran)                                                                  |

`git status` is unchanged from the session start — the only untracked entries are the four that pre-existed (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). No stray artifacts, nothing committed, nothing staged.

---

## 6. Components created, verdicts, open questions, punch list

**None of it.** The halt was at Stage 1, so:

- Components created: **none**
- Validator verdicts: **n/a** (Stage 4 never ran)
- Test results: **n/a** (Stage 5 never ran)
- Decomposer open questions + defaults: **n/a** (Stage 2 never ran — no manifest to decompose)
- `[MINOR]` punch list: **n/a** (Stage 6 never ran)
- `manifest.md`: **never written**
- Output location `examples/lit/src/_runs/control-b-itsl-bookmk-deleted-r1/`: **never created**

---

## 7. What surprised me

**a) Stage 0 knows the chosen server breaks Stage 1, and Stage 1 blames the designer anyway.** Stage 0's own text says of the remote server: "`get_code_connect_map` is **unreliable**". The run was given `figma` (remote). `get_code_connect_map` then returned `{}`. Stage 1 has no branch for "empty map on the server we already documented as unreliable" — it routes straight to `BLOCKED_ON_CODE_CONNECT`, whose prescribed remedy is a **human action in Figma** ("publish mappings and re-run"). So the skill diagnoses a _design_ defect from what its own Stage 0 predicted would be a _tool_ defect. The obvious missing branch — retry `get_code_connect_map` against `figma-desktop`, or treat a wholly-empty map as `BLOCKED_ON_MCP` (which _does_ get 2 retries) rather than as unconnected nodes — does not exist. A run configured exactly as the skill permits is therefore steered into its only unrecoverable halt.

**b) An empty map and a genuinely unconnected design are indistinguishable to Stage 1.** `{}` means "no mappings returned". That is the same observation whether nobody ever published mappings, or the server failed to serve them. The skill never asks the analyst to distinguish these, e.g. by checking whether _any_ node in _any_ file resolves, or by cross-checking the repo's own `*.figma.ts` Code Connect files. It just reports every instance as blocked.

**c) The blocked list is not an actionable to-do.** 45 of the 55 entries are individual table `Cell` instances — the same component repeated 5 columns × 9 rows. Three more are _nested_ instance paths (`I4549:8349;23112:4891`, a circle-info icon living inside the Banner instance) which a human cannot "publish a mapping for" independently of their parent. The skill's framing — "so the user can publish mappings and re-run" — implies a list of distinct components to connect; what it hands back is a flattened instance census. A deduplicated list of ~8 component _definitions_ would be actionable; this isn't.

**d) The halt leaves the run folder in a state that poisons the re-run it asks for.** The analyst halted mid-sequence, having written `figma-metadata.json` and the empty `figma-code-connect-map.json` but **not `screenshot.png`** — the file the skill repeatedly calls "ground truth" and that Stage 4 reads from `<run>/screenshot.png`. The skill says nothing about cleaning up or completing a partial run folder on halt. Worse, the slug rule guarantees the re-run the skill requests will pick `bookmarks-2`, orphaning `bookmarks-1` as permanent junk. Caching the screenshot _before_ the Code Connect probe would cost nothing and leave a usable artifact.

**e) `BLOCKED_ON_CODE_CONNECT` gets zero retries while `BLOCKED_ON_MCP` gets two.** Given (a), the retry budget is allocated to the _less_ likely failure mode for the remote-server configuration.

**f) The skill never tells the coordinator to record the halt anywhere.** Steps 4 and 5 say "halt and report" to the user; step 19's artifact-hygiene check and the final-report contract live only on the success path. Nothing writes a halt record into `<run>/`, so the folder carries no evidence of why it stopped.

**g) Minor: `vision.md` is referenced in the skill's first line but I was never told to read it**, and its content isn't part of any stage. Unclear whether a coordinator is expected to.
