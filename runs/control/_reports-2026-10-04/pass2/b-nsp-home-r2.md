# Control run — B-NSP home — pass 2 (r2)

- **Figma URL**: https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2095-44291
- **Run folder**: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/ns-fundaments-4/`
- **Intended output location**: `examples/lit/src/_runs/control-b-nsp-home-r2/` (never created)
- **Start**: Sun Oct 4 22:59:38 CEST 2026
- **End**: Sun Oct 4 23:06:01 CEST 2026
- **Wall clock**: 6 min 23 s

## 1) Stage reached + exact halt token/reason

**Halted in Stage 1 (design ingestion).** Halt token: `BLOCKED_ON_MCP`.

Exact error text returned by all three `design-analyst` spawns:

```
get_code_connect_map@figma — the Code Connect lookup timed out, so this response may be missing Code Connect data.
```

Sequence, per SKILL.md step 4 ("re-spawn the analyst up to 2 more times"):

| Attempt | Duration | Result                                                      |
| ------- | -------- | ----------------------------------------------------------- |
| 1       | ~102 s   | `BLOCKED_ON_MCP` — CC lookup timed out (two internal tries) |
| 2       | ~111 s   | `BLOCKED_ON_MCP` — same, both internal tries                |
| 3       | ~108 s   | `BLOCKED_ON_MCP` — same, both internal tries                |

Three spawns × two internal retries = six consecutive timed-out `get_code_connect_map` calls
against the remote `figma` server for `fileKey=sSrpLCZm302ces3khoBGls nodeId=2095:44291`.
Each returned a literal `{}` **plus** the timeout warning. Step 4 then mandates: halt and report
the server as unreachable. Stages 2–6 never ran.

Per SKILL.md step 4, the suggested user remedies are: `claude mcp list`, re-authenticate the
Figma MCP server, or open the Figma desktop app and re-run with `figma-desktop` (which the
Stage 0 question itself flags as "most reliable for `get_code_connect_map`").

### The analyst's judgement call (notable, and correct)

All three analysts explicitly refused to read `{}` as "this design has no Code Connect mappings".
Attempt 2 wrote the reasoning out: persisting a bare `{}` would let a later stage conclude the
design uses no existing SLDS components, when in fact the metadata shows ~11 component instances
(`sl-button-rectangular`, `sl-icon`, `media/Responsive`, `card-slot-header-badges`, `Content-block`,
`Navigation`). Attempt 2 therefore declined to write `figma-code-connect-map.json` at all;
attempt 3 wrote it **with an embedded note** explaining it is a timeout, not an empty result.
Two different analysts, two different disposals of the same artifact — see §7.

Note the halt token is `BLOCKED_ON_MCP`, not `BLOCKED_ON_CODE_CONNECT`. The latter means
"nodes exist with no published mappings" (a human action); here the lookup never completed,
so the analyst could not tell connected from unconnected. The distinction held up.

## 2) Did Stage 0 ask anything extra?

**No.** All four answers (MCP server, framework, i18n, output location) were supplied verbatim in
the invocation. Stage 0 consumed them, validated the URL as a `figma.com/design/...` link, and
proceeded without a single `AskUserQuestion`. The "all input up front" contract held.

## 3) Everything I decided that the four answers didn't cover

1. **Run folder name.** SKILL.md derives `<file-slug>` from the Figma _file_ name, not the case
   name: `NS-fundaments` → `ns-fundaments`. `ns-fundaments-1/2/3` already existed, so this run is
   `ns-fundaments-4`. Consequence worth flagging: the run folder is named after the Figma file,
   so **three unrelated cases from the same file share a slug family** and the run folder name
   carries no hint of which case it is. There is also a pre-existing `.implement-design/b-nsp-home/`
   from a non-pipeline run — the skill's naming rule cannot land there, so no collision, but also
   no continuity.
2. **`.gitignore`** — checked, already covers `.implement-design` (line 21). No edit needed.
3. **Model for the analyst spawns** — not specified by the skill; used `opus` for all three.
4. **Retry pacing** — the skill says "brief waits"; I spawned sequentially with no artificial
   delay beyond the ~2 min each attempt itself took (≈6 min of real elapsed spacing between the
   first and last call, which is a more-than-brief wait in practice).
5. **Stopping at three.** Step 4 caps re-spawns at 2 beyond the first. I did not try a fourth,
   and I did not switch to `figma-desktop` — switching would have overridden a Stage 0 answer
   and invalidated the control.

## 4) Wall clock

**6 min 23 s** (22:59:38 → 23:06:01 CEST). Roughly 5 min 21 s of that is the three analyst spawns;
the rest is setup, conventions read, environment probing and the step-19 check.

## 5) Artifacts

Inside the run folder `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/ns-fundaments-4/`:

| File                          | Size   | Note                                                                                                                                             |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `figma-metadata.json`         | 7.5 KB | Full structural tree for node `2095:44291` — frame "home", 1280×877. Written verbatim; the one Figma call that succeeded, on all three attempts. |
| `figma-code-connect-map.json` | 488 B  | `{}` + the timeout warning + an analyst note recording why the run stopped. Written by attempt 3 only.                                           |
| `testing/`                    | empty  | Created by me up front; Stage 4 never ran.                                                                                                       |

**Not produced** (calls never reached): `screenshot.png`, `figma-design-context.md`,
`figma-variable-defs.json`, `manifest.md`. No component code; `examples/lit/src/_runs/control-b-nsp-home-r2/`
does not exist.

Step 19 cleanliness check: `git status --porcelain` shows only the four pre-existing untracked
entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). **This run
created nothing outside `.implement-design/ns-fundaments-4/`**, which is gitignored. No scratch
files at the repo root.

## 6) Components / verdicts / tests / decomposer questions / [MINOR]

All empty — the pipeline halted before Stage 2.

- Components created: **none**
- Validator verdicts: **none** (Stage 4 not reached)
- Tests: **none** (Stage 5 not reached)
- Decomposer open questions + chosen defaults: **none** (Stage 2 not reached)
- `[MINOR]` punch list: **none** (Stage 6 not reached)

For reference, what the one successful call says the design contains (from `figma-metadata.json`),
i.e. what a decomposition would have had to cover: frame `home` 1280×877 → `Navigation` instance
(1280×56) + `main wrapper` → `content-area-wrapper` → `content-area` (1184×622) → `cards` →
a 712×570 `card` whose header is a "Classes" text + an `sl-button-rectangular` instance, alongside
~11 component instances total including `sl-icon`, `media/Responsive`, `card-slot-header-badges`
and `Content-block`.

## 7) What surprised me about the skill

1. **The retry budget is spent on the wrong axis.** Step 4 re-spawns _the whole analyst_ up to
   three times, but each analyst already retries the failing call internally. The run therefore
   burned six `get_code_connect_map` calls and ~5.5 minutes to learn what the first 30 seconds
   established, and re-paid for `get_metadata` three times over. A cheaper shape would be one
   analyst that reports the transient failure once, or a re-spawn that passes "metadata is already
   cached, resume from the CC call".
2. **One flaky call gates four independent ones.** `get_screenshot`, `get_variable_defs` and
   `get_design_context` were all reachable and all unattempted, because the analyst's ordering puts
   Code Connect first and treats its failure as fatal. The run ends with **no cached reference
   screenshot** — the artifact the skill elsewhere calls "ground truth throughout" — even though
   fetching it was free and would have survived the halt. If the analyst fetched the screenshot
   first, a re-run after re-auth would start warm.
3. **The two blocked-states are asymmetric in cost, and the cheaper one is unreachable here.**
   `BLOCKED_ON_CODE_CONNECT` is the informative halt — it hands the user a node list to go publish.
   `BLOCKED_ON_MCP` hands over nothing actionable about the design. Because the CC _lookup_ is the
   thing that's flaky, the pipeline's most common Figma failure degrades to its least informative
   halt. That is defensible (you genuinely cannot list unconnected nodes if the lookup never ran),
   but it means the remote-`figma` path has a failure mode with no partial credit.
4. **Stage 0 warns about exactly this and the pipeline can't act on it.** The MCP-server question
   literally says `figma` (remote) has unreliable `get_code_connect_map`. The user picks it, the
   predicted failure occurs, and the skill's only recourse is to halt and tell the user to go use
   `figma-desktop` — the thing the question already recommended. A standalone pipeline that knows
   the fallback cannot take it, because taking it would override a Stage 0 answer.
5. **Artifact disposal under a transient error is undefined, and two analysts disagreed.** Given
   the identical failure, attempt 2 refused to write `figma-code-connect-map.json` (reasoning:
   a persisted `{}` is a landmine for later stages); attempt 3 wrote it with an inline warning note.
   Both are sound; the skill specifies neither. If the file is meant to be the reproducible raw
   output, the behaviour should be pinned — a downstream stage reading a bare `{}` is precisely
   the misread attempt 2 was guarding against, and it is only luck that no later stage ran.
6. **Retry spacing is unspecified.** "brief waits" is the whole guidance. For a timeout that may
   be rate-limit-shaped, the difference between 2 s and 60 s of backoff decides whether the retry
   budget means anything.

## Environment notes (separate from skill findings)

| Known fact                                                                                                                                            | How it played out / how I resolved it                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc` has 2 pre-existing errors in `packages/components/grid/src/grid.ts` (1180, 1361)                                                                | **Not hit.** Stage 3's consolidated `tsc` gate never ran.                                                                                                                                                                                                                                                                                                                                                                   |
| `yarn <script>` dies without `FONT_AWESOME_AUTH_TOKEN`                                                                                                | **Confirmed and pre-solved, then not needed.** The var is unset in this shell and `.yarnrc.yml` interpolates it under `npmScopes.fortawesome.npmAuthToken`, so bare `yarn --version` fails. Prefixing `FONT_AWESOME_AUTH_TOKEN= ` (empty) makes yarn run — `node_modules` is already installed, so no fetch from the FA registry is attempted. Verified before Stage 4; Stage 4 never ran, so it was never used in anger.   |
| ~24 sibling folders in `examples/lit/src/_runs/` share one Storybook index; a duplicate story id kills the server; stale siblings can inject `TS2717` | **Not hit, but the collision was pre-loaded.** `.storybook/main.ts` globs `../examples/**/*.stories.ts` into one index, and the existing `examples/lit/src/_runs/b-nsp-home/` already publishes `Runs/B NSP Home/Home page`, `…/Top nav`, `…/Class card`, `…/Placeholder block`. A pass-2 implementer deriving its title from the same design name would very likely have collided. Nothing to resolve — Stage 3 never ran. |
| Scratch must live in `.implement-design/<slug>-N/testing/`                                                                                            | Honoured: `testing/` was created there and left empty; no scratch at the repo root.                                                                                                                                                                                                                                                                                                                                         |

Additional environment observation: no `.env` and no `FONT_AWESOME_AUTH_TOKEN` in the profile-initialised
shell, so the empty-token prefix is required for _any_ `yarn` invocation in this working copy, not just
`yarn start`.
