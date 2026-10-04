# Control run A3 — Bingel Chapter / Digital Exercises (r1)

- **Case**: A3 Bingel Chapter / Digital Exercises
- **Figma**: https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=25124-56828
- **Skill**: `implement-design:implement-design`, invoked via the Skill tool with the four Stage 0 answers supplied verbatim
- **Start**: Sun Oct 4 22:50:35 CEST 2026
- **End**: Sun Oct 4 22:57:11 CEST 2026
- **Wall clock**: 6 min 36 s
- **Outcome**: HALTED in Stage 1. Stages 2–6 never ran.

---

## 1. Stage reached and the halt

Reached **Stage 1 (design ingestion)**. Halted at **step 4** of the skill.

Halt token: **`BLOCKED_ON_MCP`**, returned by `design-analyst` on all three permitted spawns.

Reason, quoted from the agent returns:

> attempt 1: `get_code_connect_map@figma` — "Code Connect lookup timed out, so this response may be missing Code Connect data." (returned empty `{}` on both the initial call and the retry; treating this as an unreliable/transient result rather than a legitimate "no mappings" response, since the design visibly contains many component instances — `sl-breadcrumb`, `sl-button`, `sl-avatar`, `sl-select`, `sl-icon`, `sl-badge`, `sl-searchfield`, `main nav icon`, `sl-selectbox-theme`, etc. — that a genuine empty map would be implausible for)

> attempt 2: `mcp__figma__get_code_connect_map@figma` — "Note: the Code Connect lookup timed out, so this response may be missing Code Connect data." (empty `{}` map returned both on initial call and on the single permitted retry)

> attempt 3: `get_code_connect_map@figma` — "the Code Connect lookup timed out, so this response may be missing Code Connect data" (returned `{}` on both the initial call and the single retry for this attempt, identical to attempts 1 and 2)

Step 4 prescribes the terminal action for this: re-spawn up to 2 more times, then _"**halt** and report the server is unreachable (this can't be resolved standalone) — show the error and suggest `claude mcp list` / re-auth / opening the desktop app."_ That is what happened. Per the experiment protocol I did not intervene, did not switch servers, and did not perform the ingestion myself.

Note the actual Figma call count was **6**, not 3: each `design-analyst` spawn performs its own internal retry of the failing call before returning, and the orchestrator's budget of 3 spawns sits on top of that.

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** No `AskUserQuestion` was issued and no clarification was requested at any point. All four answers (server `figma` remote, framework `lit`, i18n `no`, output `examples/lit/src/_runs/control-a3-bingel-exercises-r1/`) were supplied up front and were sufficient to enter Stage 1.

One nuance worth recording: step 2 is written **unconditionally** — "Ask **all** setup questions in one batch". There is no clause saying "skip the batch if the answers were supplied with the invocation." I inferred the skip from the surrounding framing ("All user input is gathered up front in Stage 0"). A literal reading of step 2 would have me re-ask four questions I already had answers to.

## 3. Everything I had to decide that the four answers did not cover

Each of these is a gap in the skill, listed smallest to largest.

1. **`.gitignore` check outcome.** Step 3 tells the coordinator to "make sure `.implement-design/` is ignored — add it to the project's `.gitignore` if it isn't". It already is (line 21). No action, but the skill assumes the coordinator will verify rather than blindly append — which it would, producing a duplicate line, if read literally.

2. **Run-folder slug and suffix.** Derived `myportal-designs-2025` from the file name per step 3. `-1` and `-2` already existed, so I used **`myportal-designs-2025-3`**. The deeper gap: the run folder is keyed to the **Figma file**, not the **node**. This file holds many unrelated designs, so three runs of three completely different screens land in `-1`, `-2`, `-3` with nothing in the folder name indicating which node each covers. There is also **no link whatsoever** between the derived run folder (`myportal-designs-2025-3`) and the user-supplied output location (`control-a3-bingel-exercises-r1`) — nothing written anywhere ties the artifacts to the components they produced.

3. **"Brief waits" between retries (step 4) are unquantified** — and in this harness foreground `sleep` is blocked, so I could not implement a wait at all. All three spawns went out back-to-back. The skill offers no backoff figure and no alternative for environments that cannot sleep.

4. **Retry arithmetic.** "re-spawn the analyst up to 2 more times" is ambiguous between 2 total and 3 total spawns. I read it as 1 initial + 2 more = **3 spawns**. Compounding this, the agent's own internal retry is defined independently of the orchestrator's budget, and the two multiply silently (3 × 2 = 6 calls). Neither document acknowledges the other's retries.

5. **How to classify a degraded (not failed) MCP response.** This was the consequential one. The Figma call did not error — it returned HTTP-success with an empty `{}` map plus an advisory prose note. The skill models exactly two blocked states: `BLOCKED_ON_MCP` (server unreachable) and `BLOCKED_ON_CODE_CONNECT` (nodes genuinely have no published mappings). A _timed-out lookup returning an empty map_ is **neither**, and is indistinguishable from a legitimately empty map by inspection. The analyst had to invent the classification by plausibility reasoning ("a genuine empty map would be implausible for a design containing `sl-breadcrumb`, `sl-button`, `sl-avatar`…"). That inference was sound here, but the skill supplies no rule — and the two candidate classifications lead to _different_ halt messages and different user remedies.

6. **Whether to clear or keep the partial run folder on a halt.** Step 19's cleanup check is written only for the success path ("Before reporting, verify the working tree is clean of stray artifacts"). On a halt the skill is silent on whether partial artifacts should survive. I left them in place.

7. **Stage 4 breakpoints** (not reached, but undefined). Step 13 says to pass "the breakpoints" to the validator; the only source is the manifest's Responsive Breakpoints section, which for a single-frame design reads `_Single breakpoint: <width>px._`. Nothing says what the validator should test when there is only one.

## 4. Wall clock

**6 minutes 36 seconds** — 22:50:35 → 22:57:11 CEST, 2026-10-04. Roughly 5m 40s of that was the three analyst spawns (179s + 81s + 79s); ~117k subagent tokens across 19 tool uses.

## 5. Artifacts

Run folder used: **`/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/myportal-designs-2025-3/`**

| File                          | Size     | Status                                                                                                                                         |
| ----------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 46,876 B | Written (attempt 1). Complete node tree for frame `25124:56828`, "Chapter / Digital Exercises / Exercises", 1440×1024.                         |
| `figma-code-connect-map.json` | 223 B    | Written (attempt 3 only). **Content is the literal string `{}` followed by two lines of English prose.** Not valid JSON despite the extension. |
| `testing/`                    | —        | Created empty by the coordinator; never used.                                                                                                  |
| `screenshot.png`              | —        | **MISSING** — never captured.                                                                                                                  |
| `figma-design-context.md`     | —        | **MISSING** — call never made.                                                                                                                 |
| `figma-variable-defs.json`    | —        | **MISSING** — call never made.                                                                                                                 |
| `manifest.md`                 | —        | **MISSING** — Stage 2 never ran.                                                                                                               |

Working tree: clean of stray artifacts from this run. `git status --porcelain` shows only the four pre-existing untracked entries (`agents/`, `agents.zip`, `analiza-agent-plugin.md`, `analiza-projektu.md`), untouched. Nothing was written at the repo root. The output location `examples/lit/src/_runs/control-a3-bingel-exercises-r1/` was **never created**.

## 6. Components, verdicts, tests, open questions, punch list

**All empty.** No components created, no validator verdicts, no tests run, no decomposer open questions or defaults chosen, no `[MINOR]` punch list. The pipeline never left Stage 1.

## 7. What surprised me about the skill's behavior

**a. The whole ingestion is gated behind the single least-reliable Figma call.** `get_code_connect_map` runs before `get_screenshot`, `get_design_context` and `get_variable_defs`, and its failure forfeits all of them. The screenshot in particular is cheap, independent, and — by the skill's own Stage 0 text — served by a different path ("`get_screenshot` **always** uses the remote `figma` server"). Three spawns and 5m40s produced one metadata file and no ground-truth reference. There is no partial-progress model: attempt 3 re-fetched metadata it already had rather than resuming.

**b. The skill predicts this exact failure at setup and then has no branch for it.** Stage 0's own server question warns that on the remote `figma` server "`get_code_connect_map` is unreliable." The run then chose that server, hit precisely that unreliability, and the skill's only response is to retry the call it already labelled unreliable three times and halt. The remedy step 4 prints — _"suggest `claude mcp list` / re-auth / opening the desktop app"_ — is advice to undo the server choice Stage 0 deliberately offered, and it is also simply wrong as a diagnosis here: the server was reachable throughout (`get_metadata` succeeded, repeatedly). Reporting "the server is unreachable" when one sub-lookup timed out is a misleading halt message. The obviously missing branch is a **degrade** path: proceed without the CC map (treating every instance as unmapped and resolving `sl-*` components by node name, which the analyst's own heuristic already supports), or fall back to `figma-desktop` for that one call.

**c. Degraded-vs-empty is unresolvable from the response, and the skill leaves it to improvisation.** See gap 5 above. Three independent analyst spawns all reached the same classification, so the heuristic is at least stable — but it is the agent's invention, not the skill's instruction, and the two available halt tokens send the user down different remediation paths.

**d. Identical attempts produced non-identical artifacts.** Attempt 1 explicitly declined to persist the failed call — _"not written, since both attempts returned an unreliable/empty result; no data worth persisting"_ — while attempt 3 wrote `figma-code-connect-map.json`. The skill says the analyst "writes the raw output of each Figma call … for reproducibility" but never says what to write when a call fails, so the agent is free to choose, and it chose differently on different runs. Worse, the file attempt 3 wrote is **malformed**: JSON `{}` with human prose appended after it. Any downstream `JSON.parse` on a `.json` artifact would throw. "For reproducibility" is exactly the use case this breaks.

**e. Retry budgets compose multiplicatively and invisibly.** The orchestrator thinks it allowed 3 attempts; 6 calls were made. Neither the skill nor the agent definition mentions the other's retry behavior.

## Environment notes (separate from skill findings)

- **No dev server was started.** Stage 4 was never reached, so there was no contention for port 6006 and no opportunity for a duplicate Storybook story id in `examples/lit/src/_runs/` (which currently holds 23 sibling run folders sharing one index).
- No scratch files were written outside the run folder, so no sibling run could have been clobbered by this one.
- Nothing was committed; no `git add`, no `git commit`, no PR.
