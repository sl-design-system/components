# Control run — A2 NSP class overview, pass 2 (r2)

Unassisted execution of `/implement-design` (`implement-design:implement-design`), coordinator role played literally,
all stage work delegated to the plugin's own agents via the Agent tool.

- **Figma node**: `https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2422-87039`
- **Start**: `Sun Oct  4 20:16:53 CEST 2026`
- **End**: `Sun Oct  4 20:25:13 CEST 2026`
- **Wall clock**: ~8 min 20 s

---

## 1. Stage reached + halt

**Halted in Stage 1 (design ingestion). Never reached Stage 2.**

Halt token, verbatim from `design-analyst`:

```
BLOCKED_ON_CODE_CONNECT

- `2422:87040` — Navigation
```

Reason given by the analyst: `Navigation` fails all three of its identification routes —
its own scoped `get_code_connect_map` returns a **clean `{}` with no timeout note** (so a
genuine null mapping, not a transient failure), its node name is not `sl-*`, and no peer
instance carries a snippet. The analyst also verified against `packages/components` that SLDS
has no navigation/header/nav-link component. It is an app-level chrome shell (56 px global bar +
48 px secondary bar) holding `Logo`, 8× `Link-nav`, `sl-search-field`, a hidden `sl-button-pill`
and `profile` — all likewise unmapped.

Per SKILL.md Stage 1 step 5 (_"Halt and report the blocked-node list so the user can publish
mappings and re-run"_) I stopped. No Stage 2+ agents were spawned.

### The halt took three analyst spawns, and the first two were a different halt

| Spawn             | Duration | Result                                                                                                                                               |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 (initial)       | 92 s     | `BLOCKED_ON_MCP` — `get_code_connect_map@figma` returned `{}` + _"the Code Connect lookup timed out"_ on the initial call and its own internal retry |
| 2 (skill retry 1) | 109 s    | `BLOCKED_ON_MCP` — identical, two more calls                                                                                                         |
| 3 (skill retry 2) | 235 s    | `BLOCKED_ON_CODE_CONNECT`                                                                                                                            |

Spawn 3 did **not** get a better MCP response. The whole-tree lookup on `2422:87039` timed out
a fifth and sixth time. The agent invented a workaround on its own initiative: it re-scoped
**the same tool on the same server** to each instance node individually, which returned real data.
That is the only reason this run produced a Code Connect verdict at all. The agent explicitly
recommended the fallback be adopted as standard:

> Recommend the analyst agent adopt per-instance scoping as the standard fallback when a
> whole-tree CC lookup times out.

**This makes the halt outcome non-deterministic across identical runs.** Spawns 1 and 2 would
have halted the pipeline on `BLOCKED_ON_MCP` (unreachable-server advice: `claude mcp list`, re-auth,
open the desktop app) — advice that is wrong for this failure, since the server was reachable
throughout and `get_metadata` succeeded every time. Only the third spawn's improvisation surfaced
the real blocker. Had the skill's retry budget been 1 instead of 2, this case would have been
recorded as an MCP outage rather than a Code Connect gap.

### Components the analyst did resolve (not blockers)

| Node       | Name                    | Mapped to                                                                                              |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| 2422:87226 | sl-button-rectangular   | `<sl-button fill="ghost">` + `<sl-icon name="far-copy">`                                               |
| 2422:87227 | sl-button-rectangular   | `<sl-button fill="ghost">` + `<sl-icon name="far-share">`                                              |
| 2422:87052 | sl-button-bar/Rectangle | `<sl-button-bar fill="outline">` → `<sl-button variant="primary">` "Add students"                      |
| 2422:91204 | sl-button-bar/Rectangle | `<sl-button-bar fill="outline">` → `<sl-button fill="outline">` "Create groups"                        |
| 2422:87812 | sl-grid-quick-grid      | `<sl-grid>` — its own scoped lookup _also_ timed out twice; resolved by the `sl-*` name heuristic only |

Note the asymmetry: `sl-grid-quick-grid` was treated as connected purely because its name starts
with `sl-`, even though its Code Connect data is just as unavailable as the whole tree's. One
timed-out lookup is forgiven by a naming convention; another is a hard halt. That is a real
semantic difference in the agent's protocol, but it is worth flagging that the design's single
largest component (the grid) entered the "connected" column without a verified snippet.

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** Stage 0 consumed the four supplied answers (server `figma`, framework `lit`, i18n `no`,
output `examples/lit/src/_runs/control-a2-nsp-class-overview-r2/`) and asked nothing. No
`AskUserQuestion` was issued. The skill's "all user input up front" contract held — though the run
never got far enough to test whether later stages would have stayed silent.

---

## 3. Everything I had to decide that the four answers did not cover

Every item below is a gap in the skill — a decision the coordinator had to make without
instruction. Listing all of them, including the trivial ones.

1. **Run-folder slug derivation collides with the experiment's own naming.** SKILL.md says
   kebab-case the **Figma file name** → `ns-fundaments`, then the smallest free `-N`. That gave
   `ns-fundaments-2`. But `.implement-design/` already contains a folder named
   `a2-nsp-class-overview` from earlier work, and the output location I was handed is
   `control-a2-nsp-class-overview-r2`. So the run artifacts and the generated code live under
   **two unrelated names**, with nothing linking them. Nothing in the skill ties the run folder to
   the output location or records the node id in the folder. Finding this run's artifacts later
   requires knowing the Figma file name, not the case name.
2. **Slug derivation is also ambiguous for multi-node files.** One Figma file = one slug family.
   Two different nodes from `NS-fundaments` produce `ns-fundaments-1` and `ns-fundaments-2`, which
   are indistinguishable without opening them. The skill offers no node-id or title component.
3. **`-N` numbering silently inherits unrelated history.** I picked `-2` because `-1` existed —
   but `-1` is from a different node and possibly a different experiment. The skill gives no way
   to tell "this is attempt 2 of the same thing" from "this is a different thing, second folder".
4. **Pre-creating `testing/`.** The skill lists `testing/` as part of the run folder but doesn't
   say who creates it or when. I created it up front with the run folder. An agent might equally
   have expected to create it. Harmless here, but undefined.
5. **Whether to kill the pre-existing `a2-nsp-class-overview` run folder.** The task said run fresh
   and not reuse; the skill says pick an unused `-N`. The two are compatible only by accident.
   I left the old folder alone.
6. **Which `tsconfig.json` the Stage 3 consolidated gate would use.** The skill says
   `npx tsc -p <package>/tsconfig.json --noEmit`, but for an `examples/` output location the
   "package" is `examples/lit`, whose tsconfig is `composite: true`. `--noEmit` with `composite`
   is a known TS conflict. The skill never names the tsconfig for the example case, nor
   acknowledges the composite interaction. (Not exercised — halted before Stage 3 — but I had to
   resolve it in advance to know what the gate even was.)
7. **How many analyst spawns "up to 2 more times" means.** I read it as 3 total (initial + 2).
   It could equally be read as 2 retries _per failure mode_ or as 2 beyond the agent's own internal
   retries — and the agent does its own retrying inside each spawn, so the actual call count was
   6 whole-tree lookups, not 3. The skill's retry budget and the agent's are uncoordinated and
   multiply.
8. **What "brief waits" between analyst retries means.** No duration given. I re-spawned
   immediately. If the timeout is rate-limit-driven, immediate re-spawn is exactly wrong.
9. **Whether a `BLOCKED_ON_MCP` that is clearly _not_ an unreachable server still triggers the
   skill's unreachable-server advice.** Step 4 prescribes "report the server is unreachable" and
   suggests `claude mcp list` / re-auth / opening the desktop app. That advice would have been
   actively misleading here: `get_metadata` succeeded on every spawn, so the server was plainly
   up. I had no instruction for a _partial_ MCP failure — one tool degraded, the rest fine.
10. **Whether the analyst's own protocol deviation (per-instance scoping) counts as "the pipeline
    as written".** It isn't in SKILL.md. I let it stand because the agent chose it unprompted and
    I was told to change nothing — but a stricter reading of "execute the skill exactly as written"
    would have rejected spawn 3's result as off-protocol.
11. **Whether `BLOCKED_ON_CODE_CONNECT` on an app-chrome node is a real blocker at all.** The
    analyst itself offered an escape hatch I had to decline: _"the implementation targets only the
    `main wrapper` subtree (2422:87041), which is fully resolved and would let Stage 1 complete
    as-is."_ The skill has no notion of scoping a run to a subtree, or of marking a node
    out-of-scope, so an unconnectable page-chrome element halts the whole page. I halted per the
    letter of step 5.
12. **Whether to create the output directory before halting.** I did not —
    `examples/lit/src/_runs/control-a2-nsp-class-overview-r2/` does not exist. The skill never says
    when the output location is materialised.
13. **Whether the step-19 cleanliness check applies on a halt.** Step 19 sits under "Final report",
    after Stage 6. On an exceptional halt the skill says only "halt and report". I ran `git status`
    anyway. (Clean — see §5.)
14. **Report shape on a halt.** The skill specifies the final-report contents for a _completed_ run
    (components, validator verdicts, punch list…). It says nothing about what a halt report must
    contain beyond "the blocked-node list".

---

## 4. Wall clock

**~8 min 20 s** (20:16:53 → 20:25:13 CEST, 2026-10-04).

Breakdown: ~1 min coordinator setup and reading `component-conventions.md`; ~7 min across three
`design-analyst` spawns (92 s + 109 s + 235 s of agent time, plus spawn overhead).

Coordinator-side note, not a skill finding: my first attempts to wait on the background agent used
`run_in_background` sleeps, which return immediately and do not block. That inflated my turn count
but **not** the wall clock — the elapsed-time figure above is from `date` at both ends and is
accurate.

---

## 5. Artifacts

Run folder used: **`.implement-design/ns-fundaments-2/`** (created by me at Stage 1;
`.implement-design` was already covered by `.gitignore:21`).

| File                                 | Size   | Notes                                                                                                                                                                         |
| ------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-metadata.json`                | 4.6 KB | Both `get_metadata` responses — root frame + Navigation subtree. Valid.                                                                                                       |
| `figma-code-connect-map.json`        | 3.3 KB | Whole-tree timeout record + all six scoped lookups + the resolved snippets. Written only on spawn 3.                                                                          |
| `figma-code-connect-map-TIMEOUT.txt` | 1.4 KB | Failure record from spawns 1–2. The analyst deliberately refused to write a `.json` holding the empty map, so a timed-out `{}` could not later be mistaken for "no mappings". |
| `testing/`                           | empty  | Pre-created; never used.                                                                                                                                                      |

**Not written** (pipeline blocked first): `screenshot.png`, `figma-design-context.md`,
`figma-variable-defs.json`, `manifest.md`.

The missing `screenshot.png` matters beyond this run: it is the ground truth for Stage 4 and is
declared a run-folder staple, yet the analyst's ordering puts the Code Connect gate _before_ the
screenshot. A blocked run therefore leaves no visual record of what was being built — a human
re-running after publishing mappings starts from nothing.

`git status --porcelain` at end is byte-identical to its state at session start (`agents.zip`,
`agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md` — all pre-existing untracked). No stray
screenshots or scratch files anywhere. Nothing committed, nothing staged, no PR.

---

## 6. Components created / validator / tests / decomposer / punch list

**None of it.** The run never left Stage 1.

- Components created: **none**. `examples/lit/src/_runs/control-a2-nsp-class-overview-r2/` does not
  exist.
- Validator verdicts: **n/a** — `visual-validator` never spawned; Storybook never started
  (so no port conflict arose; see §8).
- Test results: **n/a** — `component-author` never spawned.
- Decomposer open questions + defaults: **n/a** — `component-decomposer` never spawned.
- `[MINOR]` punch list: **n/a** — `component-reviewer` never spawned.

Agents actually exercised this run: `implement-design:design-analyst` ×3. The other five pipeline
agents were never reached.

---

## 7. Surprises, ambiguities, contradictions

1. **The headline finding: the halt verdict depends on how many times you retry.** Same input, same
   server, same agent definition — spawns 1 and 2 said "MCP is broken", spawn 3 said "Code Connect
   is missing on node X". These route to completely different human remediations (fix your MCP
   connection vs. publish a Figma mapping). A pipeline whose diagnosis flips on retry count is
   reporting noise as signal. The skill's cap of 2 retries happens to be exactly enough here; it
   would not have been with a cap of 1.

2. **An agent improvised a protocol fix mid-run, and that improvisation is now load-bearing.**
   Per-instance Code Connect scoping is nowhere in SKILL.md or (apparently) in the analyst's own
   instructions — the agent reasoned its way there after the whole-tree call failed for the fourth
   time. It worked. But it means this run's result is not reproducible from the written skill, and
   the agent said as much by recommending the fallback be adopted. **This is a concrete, free
   improvement the skill should absorb**: whole-tree `get_code_connect_map` on a page-sized node
   appears to reliably time out on the remote `figma` server, and per-instance scoping is the
   working path.

3. **`BLOCKED_ON_MCP` conflates "server down" with "one tool degraded".** The skill's step-4
   remedy — check `claude mcp list`, re-auth, open the desktop app — assumes an unreachable server.
   Here `get_metadata` worked flawlessly on all three spawns while `get_code_connect_map` timed out
   on all six attempts. Following the skill's advice would have sent a user chasing a connection
   problem that does not exist. The skill needs a third category: _tool-level degradation_.

4. **An empty `{}` means two opposite things, and only a prose note distinguishes them.** The
   analyst's whole discrimination between "no mappings exist" and "lookup failed" rests on whether
   the MCP response carries the sentence _"the Code Connect lookup timed out"_. That is a string
   match against an unversioned human-readable note. If Figma reworded it, every timed-out lookup
   would silently become a confident "no Code Connect mappings" — and the pipeline would sail into
   Stage 2 with five `sl-*` components it believed were unconnected. The analyst flagged exactly
   this in its artifact: _"The empty object is NOT a valid 'no mappings' result."_ Fragile.

5. **A tooling gap the analyst found and the skill cannot route around.** `get_code_connect_map`'s
   `nodeId` parameter enforces `^\d+[:-]\d+$`, so **nested** instance ids like
   `I2422:87040;2071:589` are rejected outright. That structurally disables the "do the children
   carry a snippet?" rescue heuristic for any nested instance — which is precisely where the
   Navigation shell's `Link-nav` / `Logo` / `profile` children live. The heuristic exists but
   cannot be executed on the case that needs it.

6. **The halting node is app chrome, which arguably should never have been in scope.** `Navigation`
   is a global top bar — the kind of thing the conventions file elsewhere tells generated components
   _not_ to own (_"Never use the `<main>` element… the same caution applies to other page-level
   singleton landmarks the host owns (e.g. a single top-level `<nav>` banner)"_). The skill tells
   components not to implement page chrome, then halts the entire pipeline because page chrome has
   no Code Connect mapping. Those two positions sit badly together. The analyst spotted the
   resolution (_target the `main wrapper` subtree_) but the skill gives the coordinator no mechanism
   to act on it.

7. **"Five of six are `sl-*` named, so an empty map is implausible"** — the analyst's own reasoning,
   written into the timeout artifact. It is good reasoning, and it is reasoning the skill never asked
   for. The quality of this run's diagnosis came from the agent's judgement, not the skill's
   instructions. That is a dependency worth knowing about when evaluating reproducibility.

8. **Code Connect is gated before the screenshot.** A blocked Stage 1 produces no visual reference
   at all, even though `get_screenshot` is a cheap independent call that would have succeeded. The
   human who publishes the mapping and re-runs has nothing to look at in the meantime.

9. **`sl-grid-quick-grid` passed on a name while the tree failed on a timeout.** Both had
   unavailable Code Connect data. One was waved through by the `sl-*` prefix heuristic, the other
   halted the pipeline. Defensible per the analyst's protocol, but it means the design's biggest
   and most complex component — the grid — entered the "resolved" column with no verified snippet,
   and nothing in the eventual report would have flagged that to a reviewer.

---

## 8. Environment notes (not skill findings)

- **No port conflict.** Checked `6006 / 6007 / 6008 / 8000 / 4200` at the start — nothing listening.
  Stage 4 was never reached, so no dev server was started and the question is moot for this run.
- **Background-wait mechanics.** `run_in_background` returns immediately and does not block the
  coordinator; foreground `sleep` is blocked by the harness. Reliable waiting required a
  backgrounded `until`-loop. This cost turns, not wall-clock time, and did not affect the run's
  outcome. Worth knowing for anyone scripting this harness.
- `.implement-design/` was already in `.gitignore` (line 21); no gitignore edit was needed.
