# Control run — B-NSP home, r1

**Pipeline**: `/implement-design` (invoked via Skill tool, `implement-design:implement-design`)
**Figma**: https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2095-44291
**Start**: Sun Oct 4 20:48:06 CEST 2026
**End**: Sun Oct 4 20:54:02 CEST 2026
**Wall clock**: 5 min 56 s

---

## 1. Stage reached — HALTED IN STAGE 1

The run never got past Stage 1 (design ingestion). It halted on the skill's own
Stage 1 blocker path, step 4.

**Halt token**: `BLOCKED_ON_MCP`

**Reason, as returned by the three analyst spawns (verbatim):**

- Attempt 1: `get_code_connect_map@figma — "Note: the Code Connect lookup timed
out, so this response may be missing Code Connect data." (empty {} returned
after retry; treated as transient timeout per policy, not a legitimate "no
mappings" result)`
- Attempt 2: `get_code_connect_map@figma — Note: the Code Connect lookup timed
out, so this response may be missing Code Connect data. (returned {} on both
the initial call and the one retry, for node 2095:44291 in file
sSrpLCZm302ces3khoBGls)` … `per protocol, get_code_connect_map must resolve
before get_design_context or get_screenshot are attempted, and a second
consecutive timeout on the same tool/server means stopping rather than
retrying further.`
- Attempt 3: `mcp__figma__get_code_connect_map@figma — "Note: the Code Connect
lookup timed out, so this response may be missing Code Connect data."
(returned {} on both the initial call and the one retry, per the
transient-error retry policy; stopping here rather than switching servers)`

Skill step 4 allows "re-spawn the analyst up to 2 more times", so 3 total
spawns, all of which failed identically → "**halt** and report the server is
unreachable". I halted. Stages 2–6 never ran.

**Important nuance**: the server is _not_ unreachable. `claude mcp list` at halt
time reports `figma: https://mcp.figma.com/mcp (HTTP) - ✔ Connected`, and
`get_metadata` succeeded on every attempt (7.5 KB of real node tree written).
Exactly one tool — `get_code_connect_map` — times out, consistently, 6 calls out
of 6. The skill's prescribed halt advice ("server is unreachable … suggest
`claude mcp list` / re-auth / opening the desktop app") does not describe the
actual failure.

## 2. Did Stage 0 ask anything beyond the four answers?

No. The four supplied answers (MCP server, framework, i18n, output location) are
exactly the four questions Stage 0 enumerates, and the skill explicitly caps it
at one batch of up to four. Nothing additional was asked, and the URL validated
as a `figma.com/design/...` link without comment.

But Stage 0 being complete is not the same as the run being fully specified —
see the next section.

## 3. Everything I had to decide that the four answers did not cover

Listing all of them, including ones that only would have bitten later:

1. **Run-folder slug collides across cases.** The skill derives `<file-slug>`
   from the _Figma file name_ (`NS-fundaments` → `ns-fundaments`), not from the
   case. `.implement-design/ns-fundaments-1` and `-2` already existed from
   earlier, unrelated work on the same Figma file, so this run got
   `ns-fundaments-3`. Meanwhile the harness's own naming convention is visible
   right next to it — `.implement-design/b-nsp-home` already exists. The skill's
   scheme and the experiment's scheme disagree and the skill gives no way to
   name a run after the case. I followed the skill literally.
2. **Whether the output location is the component folder or its parent.** The
   supplied location is `examples/lit/src/_runs/control-b-nsp-home-r1/`. Stage 0
   describes only two shapes — flat `packages/components/`, or "an app/example
   path like `examples/`" — and Stage 3 step 9 then says to use "the root
   component's tag minus `sl-`, kebab-cased, as the folder". So a deep,
   already-run-specific path like this one would get _another_ folder level
   nested inside it. The skill never says whether a caller-supplied leaf path
   should be treated as final. Undecided in practice (never reached Stage 3),
   but it is a real gap.
3. **Breakpoints are never defined anywhere.** Stage 4 step 13 instructs the
   coordinator to pass "the breakpoints" to `visual-validator`, but neither
   Stage 0 nor any other part of the skill establishes what they are. The
   coordinator has to invent them.
4. **Dev-server port / conflict handling.** Stage 4 step 12 says "Start the app
   once (Lit: `yarn start` Storybook) in the background and wait until ready" —
   no port, no readiness criterion, no instruction for a port already in use (a
   live hazard here, since parallel runs of this experiment exist). Not reached.
5. **What "brief waits" means between analyst re-spawns.** Step 4 says re-spawn
   "up to 2 more times (brief waits)". No duration. I spawned back-to-back with
   no deliberate sleep; each spawn took ~100 s of its own, so there was ~0 s of
   explicit backoff. A different coordinator could legitimately have waited
   minutes, which changes the outcome of a transient failure.
6. **Whether a re-spawn is a fresh agent or a resumed one, and whether it should
   be told about the prior failure.** The skill says only "re-spawn the
   analyst". I spawned fresh agents and told each that the previous attempt had
   timed out on `get_code_connect_map`. Telling it is arguably already a hint
   the skill did not ask me to give.
7. **Whose retry budget is "up to 2 more times".** The analyst agent has its own
   internal single-retry policy on a transient tool error. Stacked with the
   coordinator's 3 spawns, `get_code_connect_map` was actually called 6 times.
   The skill never reconciles the two retry budgets, so the real attempt count
   is an emergent accident rather than a designed number.
8. **Whether to fall back to the other Figma MCP server.** This is the big one.
   `figma-desktop` is configured and reports Connected. Attempt 3's analyst
   explicitly chose "stopping here rather than switching servers". The skill
   gives the coordinator no fallback rule either — Stage 0 pins one server for
   the whole run and nothing downstream may revisit it. I did not switch,
   because switching would have been me correcting the pipeline.
9. **`.gitignore` check.** The skill tells the coordinator to ensure
   `.implement-design/` is ignored. It already was (line 21). No decision
   needed, but it is coordinator work the skill assigns without saying what to
   do if the file is absent or if the repo is not the git root.

## 4. Wall clock

**5 min 56 s** (20:48:06 → 20:54:02). Breakdown: ~1 min of coordinator setup
(reading SKILL.md + `component-conventions.md`, creating the run folder), then
three analyst spawns at 96 s, 101 s and 110 s.

## 5. Artifacts

Run folder used: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/ns-fundaments-3/`

What landed in it — two files, both from the analyst, both partial:

| File                          | Size    | State                                                                                                                                                                                                                                                              |
| ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `figma-metadata.json`         | 7,550 B | Real content. The `get_metadata` call succeeded every time; it is an XML-ish frame tree (`<frame id="2095:44291" name="home" width="1280" height="877">` → Navigation instance, main wrapper, content-area-wrapper, content-area …) despite the `.json` extension. |
| `figma-code-connect-map.json` | 212 B   | `{}` followed by two prose "Note (call N): the Code Connect lookup timed out" lines.                                                                                                                                                                               |

Not written (the analyst halts before these calls): `screenshot.png`,
`figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`,
`testing/`.

Two artifact-hygiene defects worth recording:

- **`figma-code-connect-map.json` is not valid JSON.** It is `{}` plus appended
  prose; `json.load` fails with `Extra data: line 2 column 1`. Any downstream
  consumer parsing it as JSON would crash. The analyst is writing the MCP tool's
  _display text_, note and all, rather than its payload.
- **`figma-metadata.json` is not JSON either** — it holds an XML frame tree. The
  skill prescribes the `.json` filename, the tool returns XML, and nothing
  reconciles the two.

Working tree: clean of pipeline strays. `git status --short` at halt shows only
the four pre-existing untracked entries that were there before the run
(`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`).
`.implement-design/` is gitignored. Nothing was committed.

## 6. Components created / validator verdicts / tests / decomposer questions / [MINOR] list

**None of these exist.** The run halted in Stage 1, before decomposition. No
component tree, no files under `examples/lit/src/_runs/control-b-nsp-home-r1/`
(the directory was never created), no validator spawns, no tests, no decomposer
open questions, no punch list.

## 7. What surprised me

1. **The skill knows this exact failure mode and still has no path through it.**
   Stage 0's own wording for the remote server reads: "`figma` (remote;
   headless, but `get_code_connect_map` is unreliable)". The pipeline documents
   that this specific call on this specific server is unreliable, offers it as a
   choice, and then has precisely one response when it proves unreliable: hard
   halt. There is no degrade-without-Code-Connect path and no automatic
   fallback to `figma-desktop`, even though `figma-desktop` was Connected the
   whole time. Choosing the documented-unreliable option is effectively
   choosing a coin-flip run.
2. **`BLOCKED_ON_MCP` is the wrong classification, and its remediation advice
   misleads.** The skill treats `BLOCKED_ON_MCP` as "the server is unreachable"
   and tells the user to run `claude mcp list`, re-auth, or open the desktop
   app. Here the server is connected, authenticated, and answering — one tool
   times out. A user following the printed advice would check three things that
   are all already fine. There is no token for "one Figma tool is degraded".
3. **A timeout and a legitimately empty map are indistinguishable.** The remote
   server returns `{}` in both cases and distinguishes them only by an advisory
   sentence in prose. The analyst made the defensible call (treat it as
   transient, not as "no mappings") — but that decision rests on string-matching
   an English note, and the skill never says which reading is correct. Read the
   other way, the same response is `BLOCKED_ON_CODE_CONNECT` (a different halt,
   with a different message to the user) or a clean "nothing is connected,
   proceed".
4. **Retrying an identical deterministic failure three times costs 5 of the
   run's 6 minutes.** All three attempts failed in the same way at the same
   step. The skill's retry rule assumes transience and has no notion of "this
   failure is identical to the last one, stop early". ~85% of this run's wall
   clock was spent re-confirming a known result.
5. **Stage 1 is strictly serialized behind the flakiest call.** The analyst's
   protocol requires `get_code_connect_map` to resolve _before_
   `get_design_context` or `get_screenshot` are attempted. So the one unreliable
   call gates the two that produce the run's most valuable and most reusable
   artifact — the ground-truth `screenshot.png`. Three full attempts, and the
   pipeline still has no cached screenshot. Fetching the screenshot first would
   have cost nothing and left the run resumable.
6. **The coordinator is told to read `component-conventions.md` "once up front …
   so you can sanity-check agent output"** — a 32 KB document — before Stage 1
   has produced anything to sanity-check. On a Stage 1 halt that read is pure
   waste, and it is the single largest context cost the coordinator paid in this
   run.
