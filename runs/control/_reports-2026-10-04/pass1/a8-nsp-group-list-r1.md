# Control run — A8 NSP Group list (r1)

- **Case**: A8 NSP Group list
- **Figma**: https://www.figma.com/design/4TdMrcnIVOn3Hrfj2OpVZU/New-Secondary?node-id=334-20573
- **Stage 0 answers supplied**: server `figma` (remote), framework `lit`, i18n `no`, output `examples/lit/src/_runs/control-a8-nsp-group-list-r1/`
- **Start**: Sun Oct 4 18:58:43 CEST 2026
- **End**: Sun Oct 4 19:06 CEST 2026
- **Wall clock**: ~7 minutes

---

## 1. Stage reached / halt

**Halted in Stage 1 (design ingestion).** The `design-analyst` returned the halt token:

```
BLOCKED_ON_CODE_CONNECT

- `334:20668` — Action 1
- `364:19522` — Action 2
- `334:20669` — Action 3
- `334:20685` — Frame 26
```

Analyst's stated reason, verbatim:

> Most component instances are identifiable by name per the heuristic (`sl-badge`, `sl-avatar`, `sl-card Actionable` ×6) despite the null map. But four instances are genuinely unidentifiable — not `sl-*` named, no exposed children to inspect, and no resolved peer to borrow from.

Root cause: `get_code_connect_map` on the **remote** `figma` server returned literally `{}` — an empty map, no mappings at all for the whole frame. The analyst's name-based fallback heuristic rescued most instances but not these four, whose Figma layer names are generic (`Action 1/2/3`, `Frame 26`).

Per SKILL.md Stage 1 step 5, `BLOCKED_ON_CODE_CONNECT` is an unconditional halt ("a human action the pipeline can't do"). I halted and did not intervene. Stages 2–6 never ran.

Note the asymmetry in the skill: `BLOCKED_ON_MCP` gets up to 2 retries; `BLOCKED_ON_CODE_CONNECT` gets zero. Yet the empty-`{}` map here is arguably an MCP-server symptom (Stage 0's own question text says `get_code_connect_map` is "unreliable" on the remote server) — it surfaced as the non-retryable token.

## 2. Did Stage 0 ask anything beyond the four answers?

No. The four supplied answers covered every Stage 0 question exactly. The URL validated as a `figma.com/design/...` link on the first check. No `AskUserQuestion` was needed.

## 3. Everything I had to decide that the four answers did not cover

Even in ~7 minutes before the halt, the skill left these to me:

1. **Run-folder slug, in conflict with repo practice.** The skill says kebab-case _the Figma file name_ → `new-secondary`, then smallest free `-N` → `.implement-design/new-secondary-1/`. But every one of the 22 existing folders in `.implement-design/` is named after the _case_ (`a8-nsp-group-list`, `b-nsp-home`, …), and `.implement-design/a8-nsp-group-list/` already exists for this very case. I followed the skill literally (`new-secondary-1`). A second case from the same Figma file would collide into `new-secondary-2` with nothing in the name to say which case it is. The skill's slug rule and the repo's actual convention disagree, and the skill does not acknowledge it.
2. **Whether to pre-create `testing/`.** The skill lists `testing/` as part of the run folder but assigns its creation to visual-validator ("written by visual-validator"). I created it up front with the run folder. Unspecified.
3. **How to pass the node id to the analyst.** The skill says "spawn design-analyst with the URL". The analyst needs a node id in `334:20573` colon form, while the URL carries `334-20573` dash form. I supplied both plus the file key. The skill never says who normalizes this.
4. **Plugin path resolution.** `<skill-dir>`/`<skills>` are described relatively; I had to locate the install myself (`tools/implement-design-plugin/skills/…`) and convert to absolute paths. Mechanical, but uninstructed.
5. **Whether the Stage 0 output-location answer is a path to create or a path that must exist.** `examples/lit/src/_runs/control-a8-nsp-group-list-r1/` did not exist. The skill never says. (Moot — halted before Stage 3.)
6. **How to detect sub-agent completion.** Not a skill gap per se, but worth logging: the agent runs async and the skill's "spawn … then" sequencing assumes synchronous returns.

## 4. Wall clock

~7 minutes total (18:58:43 → ~19:06). The analyst itself ran 205 s with 6 tool calls.

## 5. Artifacts

Run folder used: **`.implement-design/new-secondary-1/`** (newly created; `.implement-design` was already in `.gitignore` at line 21, so no gitignore edit was needed).

What landed:

| File                          | Size     | Notes                                                                                                                                                                                                                                              |
| ----------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 12 054 B | **Contains XML, not JSON** — starts `<frame id="334:20573" name="Group list" …>`. `json.load()` fails on it. The skill and the analyst agree on the `.json` extension; the remote MCP server returns XML. Nothing in the pipeline reconciles this. |
| `figma-code-connect-map.json` | 3 B      | Literally `{}` — the empty map that caused the halt.                                                                                                                                                                                               |
| `testing/`                    | empty    | created by me, never used                                                                                                                                                                                                                          |

**Missing** (the skill requires all four raw-call files): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`. The analyst halted after `get_metadata` + `get_code_connect_map` and never made the `get_design_context` / `get_variable_defs` / `get_screenshot` calls. So **the run produced no ground-truth screenshot at all** — a re-run after the user publishes Code Connect mappings would have to refetch everything; nothing is cached for reuse.

`git status` is clean of pipeline output — only the four pre-existing untracked items from before the run (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing was committed.

## 6. Components created / validator / tests / decomposer / punch list

**None.** Stage 2 onward never ran:

- No components created.
- No validator verdicts.
- No test results.
- No decomposer open questions or defaults.
- No `[MINOR]` punch list.
- No `manifest.md` written (Stage 2 step 7 is where that happens).

## 7. What surprised me

1. **`get_code_connect_map` returned `{}` for the entire frame** on the remote server — not partial coverage, zero. Stage 0's question text warns the remote server is "unreliable" for exactly this call and still offers it as a choice, and Stage 1 then treats the resulting empty map as a _human-action_ blocker rather than as the server-choice consequence Stage 0 predicted. The skill knows about this failure mode in Stage 0 and does not connect it to Stage 1's halt. A sensible behavior — "empty CC map on the remote server → retry on `figma-desktop`, or tell the user their server choice is the cause" — is nowhere in the skill.
2. **A partial-identification result has no expression in the protocol.** The analyst resolved most instances by name (`sl-badge`, `sl-avatar`, 6× `sl-card Actionable`) and was blocked only by four generically-named layers. The manifest schema's "Existing SLDS Components Used" section explicitly supports `(identified)` rows for null-mapped nodes — so the schema anticipates exactly this situation — but the analyst's return contract is ternary (manifest | BLOCKED_ON_CODE_CONNECT | BLOCKED_ON_MCP) with no "manifest with N unresolved nodes" option. 90%-resolved and 0%-resolved produce the same halt, and the 90% of work already done is discarded.
3. **The blocked nodes are plausibly not components at all.** `334:20685` "Frame 26" is 1200×40 and `334:20668/20669/364:19522` "Action 1/2/3" are 206×36 stacked at y=0/52/104 — that reads like a menu/overflow list, i.e. probably genuinely new content, not an unmapped SLDS instance. The halt asks the user to "publish Code Connect mappings" for nodes that may have nothing to map to. The skill offers no way for the analyst to say "these are net-new, not unconnected" — even though the manifest schema has a whole **Net-New Primitive Candidates** section for precisely that. The blocker check and the schema's net-new section are not wired to each other.
4. **The halt leaves the run folder as an unusable stub.** Two of six expected artifacts, one of them a 3-byte `{}`, one of them mislabelled `.json` while holding XML, and no screenshot. The skill's premise that the run folder is a reproducibility record does not survive an early halt; there is no cleanup or "mark this run aborted" step.
5. **`figma-metadata.json` holding XML** is a straightforward contract bug between the skill's filename list and what the Figma MCP actually returns. Any downstream consumer that parses it as JSON will fail.
6. **Retry asymmetry.** Stage 1 gives `BLOCKED_ON_MCP` three attempts, `BLOCKED_ON_CODE_CONNECT` one. Given that the CC map is the call the skill itself flags as flaky, the retry budget is allocated to the more reliable of the two failure modes.
