# Control run — A6 Itsl-Collab Shared folder (pass 2)

- **Case**: A6 Itsl-Collab Shared folder, second independent pass
- **Figma URL**: https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=4200-13792
- **Skill**: `implement-design:implement-design` (invoked via the Skill tool, argument block verbatim)
- **Start**: Sun Oct 4 20:17:29 CEST 2026
- **End**: Sun Oct 4 20:19:11 CEST 2026
- **Wall clock**: 1 min 42 s (102 s)

---

## 1. Stage reached + halt

**Halted in Stage 1 (Design ingestion), on the first and only agent spawn.**

`implement-design:design-analyst` returned the halt token:

```
BLOCKED_ON_CODE_CONNECT
```

Reason, verbatim from the agent:

> The `get_code_connect_map` response for node `4200:13792` (and verified independently on two of its
> descendants, `4573:9232` and `4200:13793`) returned an empty mapping (`{}`) with no entries at all —
> no non-null snippets anywhere in this subtree to use for the "sibling instance" or "child snippet"
> identification heuristics, and none of the instance names use the `sl-*` naming convention. Every
> component instance below is therefore genuinely unconnected.

Blocked-node list returned (25 nodes):

| node id    | name                |
| ---------- | ------------------- |
| 4200:13793 | Navigation          |
| 4200:13797 | PageHeader          |
| 4200:13803 | Label               |
| 4200:13809 | Label               |
| 4200:13813 | File element        |
| 4210:18675 | FileUpload (hidden) |
| 4411:11843 | Search              |
| 4411:11845 | Standalone link     |
| 4573:9232  | Button              |
| 4495:50572 | Button (hidden)     |
| 4495:50574 | Checkbox            |
| 4411:11854 | 🛠️ Row              |
| 4411:11855 | 🛠️ Row              |
| 4411:11856 | 🛠️ Row              |
| 4411:11857 | 🛠️ Row              |
| 4411:11858 | 🛠️ Row              |
| 4411:11859 | 🛠️ Row              |
| 4411:11860 | 🛠️ Row              |
| 4411:11861 | 🛠️ Row              |
| 4411:11862 | 🛠️ Row              |
| 4099:12638 | Dropdown            |
| 4411:11863 | Pagination          |
| 4994:15549 | settings summary    |
| 4571:8205  | Heading             |
| 4571:8212  | Heading             |

The skill's Stage 1 step 5 is unambiguous about what the coordinator does with this: _"the design has
unconnected component instances that need Code Connect mappings published in Figma — a human action the
pipeline can't do. **Halt** and report the blocked-node list."_ No retry is authorised for this token
(only `BLOCKED_ON_MCP` gets up to 2 re-spawns). I halted. **Stages 2–6 never ran.**

I confirmed the halt is grounded in the persisted artifact rather than an agent misreading: the raw
`figma-code-connect-map.json` the analyst wrote is literally `{}` (3 bytes). The remote `figma` server
returned a successful, empty response — not an error.

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** All four supplied answers (MCP server, framework, i18n, output location) covered Stage 0's four
questions exactly, one-for-one. The URL validated as a `figma.com/design/...` link, so the "ask for a
corrected URL" branch did not fire. No `AskUserQuestion` call was needed and none was made.

---

## 3. Everything I had to decide that the four answers did not cover

Even in a 102-second run that halted at the first agent, the skill left these to coordinator judgement:

1. **`<file-slug>` derivation when the URL slug is already partly kebab-cased.** The skill says
   "kebab-casing the Figma file name from the URL (e.g. `Test-CC` → `test-cc`)". The URL carries
   `Collaboration-folder`. I chose `collaboration-folder`. Note this slug is derived from the **file**
   name, so every run against any node in this Figma file collides into the same slug series —
   `collaboration-folder-1` already existed from an unrelated earlier run of a _different node_ in the
   same file. The slug therefore does not identify the design being implemented, only the file.

2. **Which `-N` suffix.** `collaboration-folder-1` existed, so I took `collaboration-folder-2`. The
   skill specifies this mechanically, but it also means the run folder name has no relationship to the
   output location I was given (`control-a6-itsl-collab-shared-r2/`). Two different naming schemes for
   one run, neither derivable from the other — I had to hold the mapping myself. There is also an
   older `.implement-design/a6-itsl-collab-shared-folder/` from a prior batch using a _third_ scheme.

3. **Whether to create the run folder myself or let the analyst do it.** The skill tells the
   coordinator to "Create it at the start" (Stage 1 step 3), but the analyst's own instructions tell it
   to `mkdir -p <run>` as its step 1. Harmless duplication, but it is an unresolved overlap of
   ownership; I created it, and told the analyst it already existed.

4. **Trailing slash on the `<run>` path passed to the agent.** Unspecified. I passed a trailing slash.

5. **Whether the `.gitignore` requirement was already satisfied.** The skill says to add
   `.implement-design/` to `.gitignore` "if it isn't". I had to go check (line 21 already has
   `.implement-design`, un-slashed). Deciding that an un-slashed entry satisfies a slashed requirement
   was my call.

6. **What "halt and report" means for cleanup.** The skill's final-report step (19) is written for a
   completed run. On an exceptional halt it is silent on whether to keep or remove the partial run
   folder. I kept it (it contains the evidence for the halt and the skill calls the folder the run's
   permanent artifact folder).

7. **Whether to run the final-report `git status` check on a halt.** Same silence — step 19 is under
   "Final report", and a halt produces a report but skips every stage that could have created strays.
   I ran it anyway. (Clean.)

Decisions I would have had to make but didn't reach, flagged because the first one was already live as
a _pre-existing_ condition before any code was generated:

8. **The Stage 3 hard gate "Type-check is clean (`tsc` exit 0)" is unsatisfiable in this repo as
   written.** I measured the baseline before Stage 1 finished:
   `npx tsc -p examples/lit/tsconfig.json --noEmit` exits **1** on a pristine tree, with two
   pre-existing errors in `packages/components/grid/src/grid.ts` (lines 1180 and 1361,
   `TS2322: Type 'number' is not assignable to type 'Timeout'`) pulled in through project references.
   Had the run reached Stage 3, the coordinator would have had to silently reinterpret the gate as
   "no _new_ errors attributable to this run's files" — a reinterpretation the skill does not
   authorise or even acknowledge. This is a real gap regardless of this run's outcome.

9. **`examples/lit/tsconfig.json` has `include: ["../../vite-env.d.ts", "index.ts", "src/**/*.ts"]`**,
   so the Stage 3 package-wide check type-checks **every previous run's generated code** under
   `src/_runs/` as well as this run's. A broken earlier run would block a later run's gate, and the
   skill's instruction to "route any errors back to the responsible implementer" has no answer for an
   error whose responsible implementer belongs to a different run entirely.

---

## 4. Wall clock

**1 min 42 s** (20:17:29 → 20:19:11 CEST). Analyst subagent itself: 59 s, 8 tool calls, ~32k tokens.

---

## 5. Artifacts

Run folder used: **`.implement-design/collaboration-folder-2/`**

What landed in it:

| file                          | bytes | note                                                                                  |
| ----------------------------- | ----- | ------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 6 501 | full structural tree of frame `4200:13792` "Shared folder - teacher view" (1280×1335) |
| `figma-code-connect-map.json` | 3     | literally `{}` — the empty response that caused the halt                              |

What did **not** land (correct per the analyst's protocol, which stops before these calls on a Code
Connect block):

- `screenshot.png`
- `figma-design-context.md`
- `figma-variable-defs.json`
- `manifest.md`
- `testing/`

`.implement-design/` is gitignored (`.gitignore` line 21), so nothing from this run is visible to git.

---

## 6. Components created, validator verdicts, tests, decomposer questions, punch list

**None of these exist — the run halted in Stage 1.**

- Components created: **none**. `examples/lit/src/_runs/control-a6-itsl-collab-shared-r2/` was never
  created; the path remains absent.
- Validator verdicts: n/a (Stage 4 never ran; **no dev server was started, so there was no port
  conflict to report**).
- Test results: n/a (Stage 5 never ran).
- Decomposer open questions + chosen defaults: n/a (`component-decomposer` was never spawned).
- `[MINOR]` punch list: n/a (`component-reviewer` was never spawned).

Agents actually spawned: **1 of 6** — `implement-design:design-analyst` only.

Working tree after the run is byte-identical to the pre-run snapshot — the same four untracked entries
(`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`) that were there at start.
Nothing was committed.

---

## 7. What surprised me about how the skill behaved

**a) An empty Code Connect map and a design with genuinely unmapped components are indistinguishable
to the analyst, and the skill treats them identically.** The remote `figma` server returned `{}` — not
`{"4200:13793": null, ...}` with per-node null entries, but an _entirely empty object_. The analyst's
step-3 heuristics are all written against a map that _has_ entries ("descendants with `null` mappings",
"a sibling/peer instance of the same component **in the map** has a non-`null` snippet"). With zero
entries, every heuristic vacuously fails and all 25 instances fall through to "genuinely unconnected".
But an empty map is much more consistent with _"this server can't read Code Connect for this file"_
than with _"a human forgot to publish 25 mappings"_ — and the skill's own Stage 0 text says so
outright: the `figma` remote server is described as the one where **"`get_code_connect_map` is
unreliable"**. The skill knowingly offers a server it has documented as unreliable for exactly this
call, then hard-halts on that call's unreliable result, and routes the user to the one remedy
(publish mappings in Figma) that would not fix an unreliable reader. There is no "empty map ⇒ suspect
the server, not the design" branch anywhere.

**b) The asymmetry between the two halt tokens is backwards for this failure.** `BLOCKED_ON_MCP` gets
up to **2 re-spawns** plus a suggestion to switch to the desktop app. `BLOCKED_ON_CODE_CONNECT` gets
**zero** retries and no server-switch suggestion — even though the skill itself names the server as the
likely cause for this specific call. A hard, unretryable halt is the stronger response, applied to the
weaker evidence.

**c) The halt fires before the screenshot is cached, so the run leaves behind almost nothing.** The
analyst's ordering (metadata → code-connect → _block_ → never reaches design-context/variables/
screenshot) means a Code Connect halt produces a run folder with no visual record of what was being
attempted at all. For a pipeline whose stated principle is "the Figma screenshot is ground truth
throughout", not capturing it before the one gate most likely to halt is a notable ordering choice —
it makes the halt harder for a human to triage, since they cannot see the design in the artifacts.

**d) 25 blocked nodes is the _whole_ design, including two hidden ones.** The list contains
`4210:18675 — FileUpload (hidden)` and `4495:50572 — Button (hidden)`. The protocol blocks on
component instances that are not even rendered. Nothing in the skill or the agent says hidden nodes
are exempt, so a human acting on this list would be asked to publish Code Connect mappings for
elements that never appear in the design.

**e) Three coexisting naming schemes for the same case.** `.implement-design/collaboration-folder-2/`
(skill-derived, file-scoped), `.implement-design/a6-itsl-collab-shared-folder/` (earlier batch),
and the supplied output path `control-a6-itsl-collab-shared-r2/`. The skill derives its folder name
from the Figma _file_, which for a multi-screen file like this one cannot distinguish two runs against
two different nodes — they differ only by an incrementing integer with no semantic content.

**f) The skill's "no further questions after Stage 0" promise held, but only because it halted.** The
run never reached a stage where a coordinator judgement call would have been visible to the user.
Items 1–7 in section 3 above were all decided silently; the skill has no mechanism for surfacing
coordinator-level defaults (unlike the decomposer's open questions, which it does require reporting).

**g) The `{}` response itself is worth recording as a reproducibility win.** Because the analyst
persists every Figma call verbatim _as it goes_, the 3-byte `figma-code-connect-map.json` is on disk
and the halt is independently verifiable without re-calling Figma. That part of the protocol worked
exactly as designed.

---

## Environment notes (separate from skill findings)

- **No port conflict.** Stage 4 was never reached, so no dev server was started.
- **Pre-existing `tsc` failure** in `packages/components/grid/src/grid.ts` (2× `TS2322` at lines 1180,
  1361), present on a clean tree before this run touched anything. Relevant to the Stage 3 gate
  (see section 3, item 8) but not caused by this run.
- Nothing was committed; no `git add`, no `git commit`, no PR.
