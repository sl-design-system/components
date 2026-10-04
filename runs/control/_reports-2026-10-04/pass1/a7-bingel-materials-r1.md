# Control run — A7 Bingel Materials / Overviews (r1)

- **Figma**: https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=15878-180439
- **Start**: Sun Oct 4 18:58:34 CEST 2026
- **End**: Sun Oct 4 19:02:51 CEST 2026
- **Wall clock**: 4 min 17 s (design-analyst itself: 220 s, 6 tool calls, 66 431 tokens)
- **Run folder**: `.implement-design/myportal-designs-2025-1/`
- **Stage 0 answers used**: server `figma` (remote), framework `lit`, i18n `no`, output `examples/lit/src/_runs/control-a7-bingel-materials-r1/`

---

## 1. Stage reached / halt

**Halted in Stage 1 (Design ingestion).** Stages 2–6 never ran. No code was generated.

Halt token returned by `implement-design:design-analyst`:

> `BLOCKED_ON_CODE_CONNECT`
>
> "The Code Connect map for this node returned an empty object (`{}`) — no node in the subtree has a resolved mapping."

The analyst's own triage: most instances were _inferrable_ as SLDS components from naming (`sl-breadcrumb`, `SL-card`, `sl-button`, `sl-avatar`, `sl-searchfield`, `sl-icon`, `sl-selectbox-theme`, `sl-button-theme`, and `badge` instances uniformly wrapped in `badge-base-theme [DRAFT]` / `sl-badge [DRAFT]`), but eight instances matched none of its three identification signals (not `sl-*` named, no child with a resolved CC snippet, no sibling instance with a non-null snippet):

| Node id      | Label         |
| ------------ | ------------- |
| 15878:180701 | main nav icon |
| 15878:180702 | main nav icon |
| 15878:180703 | main nav icon |
| 15878:180704 | main nav icon |
| 15878:180705 | main nav icon |
| 15878:180706 | main nav icon |
| 15878:180707 | main nav icon |
| 15878:180677 | chevron-down  |

Excluded by the analyst as not rendered: `Component 31` / `Component 32` / a second `sl-button-theme` under 24382:668428, 24382:668432, 24382:668466 — they sit inside `hidden="true"` frames.

Per SKILL.md Stage 1 step 5 ("**Halt** and report the blocked-node list so the user can publish mappings and re-run"), I stopped. I did not retry, did not substitute `figma-desktop`, and did not hand the analyst any hint.

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** All four supplied answers covered Stage 0 exactly — MCP server, framework, i18n, output location. No `AskUserQuestion` was needed and nothing else was requested of the user. Stage 0 is well-specified.

## 3. Decisions I had to make that the four answers did not cover

Gaps in the skill, smallest included:

1. **Run-folder slug is ambiguous against reality.** The skill says kebab-case _the Figma file name from the URL_, so I derived `myportal-designs-2025-1`. But every one of the 22 pre-existing folders under `.implement-design/` is named after the _case/screen_ (`a7-myportal-materials-overviews`, `b-nsp-home`, …), i.e. nobody has actually followed the documented rule. With one Figma file holding many screens, the documented rule collides: a second run against a _different node_ of the same file gets `-2`, indistinguishable from a re-run of the same node. The slug carries no node identity.
2. **Whether to pre-create `testing/`.** The skill lists `testing/` as part of the run folder but assigns its creation to visual-validator ("written by visual-validator"). I created it up front with the run folder; nothing says who owns `mkdir`.
3. **`.gitignore` check wording.** The skill says add `.implement-design/` if absent. The repo has `.implement-design` (no trailing slash) under a `# Build output` heading. Functionally equivalent, but the skill gives no "already covered, leave it" instruction — I had to judge that it matched.
4. **Which tsconfig the Stage 3 consolidated gate would use.** The skill prescribes `npx tsc -p <package>/tsconfig.json --noEmit`, but with an `examples/lit/src/_runs/...` output path, `<package>` is `examples/lit`, three levels above the component. I resolved it to `examples/lit/tsconfig.json` (whose `include` is `["../../vite-env.d.ts", "index.ts", "src/**/*.ts"]`, so it would have covered the run). The skill never defines how to walk up from an output location to its package root. Never exercised — the halt came first.
5. **Whether `_runs/` output should be exported from `examples/lit/src/index.ts`.** That barrel exports only the four real examples; no prior `_runs/*` component is exported. The skill says "reusing the example package's existing `index.ts`" (conventions doc), which reads as _do_ register. I would have had to pick. Never exercised.
6. **Nothing about retrying / downgrading a CC block.** The skill gives `BLOCKED_ON_MCP` an explicit retry budget (2 more spawns) but gives `BLOCKED_ON_CODE_CONNECT` none, and offers no "partial-manifest" path. The analyst's own report says most instances _were_ identifiable — so a run can be killed by 8 icons out of a large tree with no documented way to proceed. Deciding not to re-spawn was mine to make; the skill is silent.

## 4. Wall clock

4 min 17 s total (18:58:34 → 19:02:51). Essentially all of it is the single analyst spawn.

## 5. Artifacts

Folder used: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/myportal-designs-2025-1/`

| File                          | Size     | Notes              |
| ----------------------------- | -------- | ------------------ |
| `figma-metadata.json`         | 44 982 B | written by analyst |
| `figma-code-connect-map.json` | 3 B      | literally `{}`     |
| `testing/`                    | empty    | pre-created by me  |

**Not written** (analyst stopped "per protocol" before calling them): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`.

`git status --short` shows only the four pre-existing untracked entries from the start-of-session snapshot (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing from this run landed outside the gitignored run folder. No commits, no `git add`.

## 6. Components created / verdicts / punch list

**None.** No decomposition, no components, no validator verdicts, no tests, no decomposer open questions, no `[MINOR]` punch list. The run halted two stages before any of that.

Note for the experiment record: prior-run output for this same case already exists at `examples/lit/src/_runs/a7-myportal-materials-overviews/` and `.implement-design/a7-myportal-materials-overviews/`. My output path (`control-a7-bingel-materials-r1`) was never created, so there is no overlap or contamination either way.

## 7. What surprised me

1. **The screenshot — declared "ground truth" — is never captured on a CC halt.** The skill's own coordination notes say "The Figma screenshot is ground truth throughout". The analyst ordered `get_screenshot` _after_ the CC check and skipped it on block, so the halt report hands the user a node-id list with no visual at all. A human resolving "which chevron-down is 15878:180677?" has nothing to look at. Cheapest possible fix: take the screenshot first, unconditionally.
2. **`BLOCKED_ON_CODE_CONNECT` is all-or-nothing, and the blocking set is trivial.** Eight bare icons (seven nav icons + one chevron) stopped a whole page implementation. Icons are the one category the conventions doc already handles generically (`Icon.register(faX)`, `far-*`/`fas-*` prefixes) and that visual validation would catch anyway. The gate has no severity notion — an unmapped _icon_ costs exactly as much as an unmapped _data grid_.
3. **The empty `{}` map makes the whole gate moot.** `get_code_connect_map` on the remote `figma` server returned nothing for _any_ node, so the analyst fell back to heuristics (name sniffing, sibling inference, parent-wrapper patterns) it invented itself — none of which are in the skill. Stage 0's own help text admits this ("`figma` (remote; headless, but `get_code_connect_map` is unreliable)"), yet the skill offers remote as a first-class choice and then hard-halts on exactly the failure it predicted. The skill knows the gun is loaded and still lets you pick it.
4. **No `BLOCKED_ON_CODE_CONNECT` fallback at all, versus a retry budget for MCP.** Step 4 gives the MCP block three attempts and recovery advice (`claude mcp list`, re-auth, open the desktop app). Step 5 gives the CC block one word: halt. There's no "retry on `figma-desktop`", even though Stage 0's text names desktop as the fix for precisely this.
5. **The analyst's own output argues against its verdict.** It reported that the overwhelming majority of instances _were_ identifiable, listed its reasoning, and then blocked anyway — because the skill's contract gives it no way to say "blocked on these 8, manifest complete for the rest."
6. **The run-slug rule is dead letter.** 22 existing folders, zero following the documented naming. Either the rule changed and the doc didn't, or coordinators keep overriding it. Worth deciding which.
