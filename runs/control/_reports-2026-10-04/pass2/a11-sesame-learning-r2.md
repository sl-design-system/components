# Control run — A11 Sesame Learning materials (pass 2)

- **Case**: A11 Sesame Learning materials (mobile, 360px)
- **Figma**: https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=116-19049
- **Start**: Sun Oct 4 20:17:16 CEST 2026
- **End**: Sun Oct 4 20:19:37 CEST 2026
- **Wall clock**: ~2 min 21 s
- **Invocation**: Skill tool unavailable for `implement-design:implement-design`; per instructions I read
  `tools/implement-design-plugin/skills/implement-design/SKILL.md` and acted as its coordinator literally.

## 1. Stage reached / halt

**Halted in Stage 1 (design ingestion).** No stage past 1 ran.

The `implement-design:design-analyst` agent returned the halt token:

```
BLOCKED_ON_CODE_CONNECT
```

Reason, in the analyst's own words: it called `get_code_connect_map` on the top node (`116:19049`)
and got `{}`, then double-checked two specific instance nodes directly (`116:19053` "Button",
`116:19051` "top bar") — both also `{}`. None of the instances are named as `sl-*` elements and
there are no siblings/children with non-null snippets to borrow from, so by its heuristic they are
all genuinely unconnected. It stopped **before** calling `get_design_context` or `get_screenshot`.

Blocked node list returned (19 nodes):

| Node      | Name             |
| --------- | ---------------- |
| 116:19051 | top bar          |
| 116:19053 | Button           |
| 116:19054 | Frame 26851      |
| 116:19060 | external-link    |
| 116:19078 | external-link    |
| 116:19096 | external-link    |
| 116:19101 | Platform tag     |
| 116:19106 | external-link    |
| 116:19111 | Platform tag     |
| 116:19116 | external-link    |
| 116:19121 | Platform tag     |
| 116:19126 | external-link    |
| 116:19151 | external-link    |
| 116:19322 | menu item footer |
| 116:19323 | menu item footer |
| 116:19324 | menu item footer |
| 116:19325 | menu item footer |
| 116:19326 | menu item footer |
| 116:19327 | Component 2      |

Per SKILL.md Stage 1 step 5 this is a hard halt ("a human action the pipeline can't do. **Halt**
and report the blocked-node list so the user can publish mappings and re-run"). Unlike
`BLOCKED_ON_MCP`, the skill grants **no retries** here, so I did not re-spawn and did not work
around it.

## 2. Did Stage 0 ask anything beyond the four answers?

No. All four Stage 0 questions (MCP server, framework, i18n, output location) were covered by the
supplied answers, and nothing else was asked of the user. Stage 0's only other instruction —
validate the URL is a `figma.com/design/...` link — passed without interaction.

Note: Stage 0 is written for an interactive `AskUserQuestion` batch. With the answers supplied up
front there is no written guidance on how a coordinator should "consume" pre-supplied answers; I
treated them as the answers to the four questions verbatim.

## 3. Decisions the four answers did not cover (skill gaps)

Every judgement call I had to make, however small:

1. **Slug derivation is ambiguous for camelCase file names.** SKILL.md: "kebab-casing the Figma
   file name from the URL (e.g. `Test-CC` → `test-cc`)". The file is `MySesame-Redesign`. A literal
   lowercase gives `mysesame-redesign`; actual kebab-casing of camelCase gives `my-sesame-redesign`.
   The worked example only lowercases, so I chose `mysesame-redesign`. A different coordinator would
   plausibly produce a **different run folder** for the same input — the artifact location is not
   deterministic from the skill text.
2. **The run slug is per-FILE, not per-NODE.** Two different node-ids in the same Figma file land in
   sibling numbered folders (`mysesame-redesign-1`, `-2`) with nothing in the contract recording
   which node each covers. I had to accept `-2` without knowing what `-1` was (and was instructed
   not to look). The skill never says to record the node-id in the run folder.
3. **No guidance on an existing folder for the same file.** `mysesame-redesign-1` already existed.
   The "smallest N that doesn't exist" rule gave me `-2`, but the skill never says whether a prior
   run of the same file should be reused, consulted, or ignored.
4. **Output location didn't fit either named shape.** Stage 0 frames the answer as a binary:
   `packages/components/` (flat) **or** "an app/example path like `examples/`". The supplied value,
   `examples/lit/src/_runs/control-a11-sesame-learning-r2/`, is a deep path under `examples/`. I had
   to decide it counts as the "app/example path" branch and that Stage 3's "nested under a root
   folder" derivation applies _beneath_ that path rather than at `examples/`. Never exercised
   (halt came first), but it was an unguided call.
5. **Create-then-spawn ordering.** Step 3 reads "Create the unique `<run>` folder. Spawn
   `design-analyst`…" — I created it first, so an empty folder now exists for a halted run.
6. **No cleanup policy on a halt.** The skill does not say whether the run folder should be removed,
   marked, or left behind when Stage 1 halts. I left it (the instruction was to change nothing).
   Consequence: a re-run after the human publishes Code Connect mappings will, by the same
   smallest-N rule, create `-3` and **orphan the partially-populated `-2`**.
7. **Whether to re-verify a Code Connect block at all.** `BLOCKED_ON_MCP` gets up to 2 re-spawns;
   `BLOCKED_ON_CODE_CONNECT` gets zero. I had to decide not to re-spawn or try the other MCP server.
   See the contradiction in §7 — this is the decision most likely to change the run's outcome.
8. **`.gitignore` check.** The skill instructs the coordinator to add `.implement-design/` to the
   project `.gitignore` "if it isn't". It already is (line 21), so no write. Worth flagging that the
   skill directs a coordinator to modify a tracked repo file outside the run folder as a side effect.
9. **Agent namespace.** Agents are listed as `implement-design:design-analyst`; the skill's
   Coordination notes cover this, so it resolved cleanly — noted only for completeness.

## 4. Wall clock

**~2 min 21 s** (20:17:16 → 20:19:37, Sun Oct 4 2026). Of that, the design-analyst subagent itself
ran 112 s across 9 tool calls.

## 5. Artifacts

Run folder used: `.implement-design/mysesame-redesign-2/` (absolute:
`/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/mysesame-redesign-2/`).

What landed in it:

| File                          | Size     | Note                               |
| ----------------------------- | -------- | ---------------------------------- |
| `figma-metadata.json`         | 12,333 B | full node metadata for the subtree |
| `figma-code-connect-map.json` | 2 B      | literally `{}`                     |

**Missing** vs. the SKILL.md working-directory contract: `screenshot.png`, `figma-design-context.md`,
`figma-variable-defs.json`, `manifest.md`, `testing/`. The analyst stopped before those calls by its
own protocol.

Working tree: `git status` shows only the four pre-existing untracked entries from before the run
(`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing from this run
escaped the gitignored `.implement-design/` folder. No commits, no `git add`, no PR.

## 6. Components created / validator verdicts / tests / decomposer questions / punch list

**None of these exist** — the run halted in Stage 1, before decomposition (Stage 2), implementation
(Stage 3), validation (Stage 4), authoring (Stage 5) and review (Stage 6).

- Components created: none.
- Validator verdicts: none — `visual-validator` never spawned.
- Test results: none — `component-author` never spawned.
- Decomposer open questions + defaults: none — `component-decomposer` never spawned.
- [MINOR] punch list: none — `component-reviewer` never spawned.

Agents actually spawned this run: **`implement-design:design-analyst` only** (one spawn, no retry).

## 7. Surprises, ambiguities, contradictions

1. **The biggest one: Stage 0 warns the chosen server is unreliable at exactly the call that then
   halts the run.** Stage 0's own question text describes the remote `figma` server as "headless,
   but `get_code_connect_map` is unreliable", and recommends `figma-desktop` precisely because it is
   "most reliable for `get_code_connect_map`". Stage 1 then treats an empty map from that
   acknowledged-unreliable call as a **hard, human-action-required halt with no retry and no
   fallback to the other server**. The skill knows the signal is unreliable and still makes it
   terminal. A coordinator following the skill literally cannot distinguish "the design genuinely
   has no Code Connect mappings" from "the remote server didn't return them" — and the skill offers
   no step to disambiguate.
2. **Retry asymmetry is unjustified.** `BLOCKED_ON_MCP` → 2 retries with waits. `BLOCKED_ON_CODE_CONNECT`
   → 0. Given (1), the retry budget is arguably on the wrong block.
3. **The artifact contract and the analyst's ordering contradict each other.** SKILL.md's
   working-directory section promises `screenshot.png` as "the cached Figma reference (ground truth)"
   and names all four raw Figma outputs as written by the analyst. On a Code Connect halt the analyst
   stops before `get_screenshot`, so the halt report reaches the user with **no visual of the design
   at all** — the one thing that would let a human judge whether the 19 flagged nodes are worth
   publishing mappings for. Caching the screenshot first would cost nothing and is strictly more
   useful on a halt.
4. **A 19-node blocked list with generic names is poor handoff.** Six of the nineteen are called
   `external-link`, five `menu item footer`, one `Frame 26851`, one `Component 2`. Without a
   screenshot or any parent/path context, the list is close to unactionable for the human who is
   supposed to go publish the mappings. The skill specifies "report the blocked-node list" and
   nothing richer.
5. **This is a whole-run halt for what may be a partial problem.** All 19 nodes are leaf/instance
   chrome (links, tags, footer menu items, a top bar). The skill has no notion of degrading — e.g.
   proceeding with the connected portion, or implementing unconnected instances from raw design
   context — so one unmapped icon-link pattern blocks the entire pipeline.
6. **Stage 0 is written assuming interactivity.** There is no path described for running the pipeline
   with answers supplied up front, even though that is the only way to run it unattended.
7. **Non-determinism in the artifact path** (see gap §3.1) was unexpected in a skill that otherwise
   specifies the run folder very precisely.

## Environment notes (NOT skill findings)

- Several other `.implement-design/*-N` folders were created by concurrent runs during this window
  (`editorial-suite-designs-2`, `myportal-designs-2025-2`, `new-secondary-2`, `ns-fundaments-2`,
  `sanna-ready-for-development-3`, all timestamped 20:16–20:17). They did not collide with
  `mysesame-redesign-2` and had no effect on this run.
- **No dev-server / port conflict occurred** — Stage 4 was never reached, so no server was started.
