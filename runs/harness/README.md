# Render harness

Stage 4 of the pipeline needs the generated component on screen. `yarn start` cannot provide that
in this checkout, for **two** reasons — the runbook anticipated one of them.

| Cause                                                                                          | Anticipated?        | Fix                                   |
| ---------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------- |
| 33 stories import Font Awesome Pro from a private registry; no token                           | yes, in the runbook | a story glob that loads only the runs |
| No local workspace is linked into `node_modules/` — only `packages/components/*` was installed | **no**              | `link-workspaces.mjs`                 |

The second one is worth stating plainly: the repository Storybook never started here, and Font
Awesome was not the reason it didn't. Thirty-one workspaces — every theme, `locales`, and the Vite
plugin that makes `import … with { type: 'css' }` work — had no symlink, so their bare specifiers
did not resolve. A run that had blamed the token would have been wrong.

## Using it

```sh
runs/harness/start.sh          # once; leave it running
```

Then a story renders at:

```
http://localhost:6010/iframe.html?id=<storyId>&viewMode=story&globals=theme:<theme>
```

`http://localhost:6010/index.json` lists every story the harness knows about, which is the
reliable way to find a story id rather than deriving it from the title.

## What each piece does

**`link-workspaces.mjs`** symlinks every local workspace into `node_modules/`, which is what a
complete `yarn install` would have produced. It only links directories that already exist — nothing
is fetched, so no registry credential is involved. It is idempotent and `start.sh` runs it every
time, because a later `yarn install` will remove the links again.

**`.storybook-runs/`** is the repository's own Storybook configuration with one change: the story
glob covers only `examples/lit/src/_runs/**`. It reuses `.storybook/preview.ts` unchanged, so
themes, polyfills and locales behave exactly as they do in the real Storybook — the harness
measures the same rendering the design system ships, not a simplified stand-in.

**`assets/`** is served at `/assets`. The pipeline has no asset-export step, so a generated
component's `<img src="/assets/…">` normally 404s. That is left visible as a Stage 4 discrepancy
rather than hidden behind a placeholder: a harness that quietly substitutes content would make the
fidelity score describe the harness instead of the run.

## Capturing — `shoot.mjs`

Stage 4 must not drive a shared browser: eighteen runs capturing at once would contend for one
instance, and a fidelity number that moves with who clicked last is not a measurement. Each
capture launches and closes its own Chromium instead.

```sh
node runs/harness/shoot.mjs --story <id> --out <file.png> \
  [--theme <id>] [--width 1280] [--height 1024] [--full] [--wait 1500]
```

It writes `<file.png>` and `<file.png>.json`. The report carries the console errors, the failed
requests, and for every custom element on the page whether it is **registered**, whether it has a
**shadow root** and its **box size** — then a `verdict`, and a non-zero exit when nothing rendered.

That check exists because of the failure mode it was written against. An element that never
registered is still in the DOM: the story loads, nothing throws, the capture succeeds, and the
image is of an empty page. Presence proves nothing; a shadow root and a non-zero box do.

## Traversal — `traverse.mjs`, with Code Connect as the stopping rule

Code Connect is not a verification step after capture. It decides **how deep to go**:
`get_design_context` on a mapped node returned `<sl-grid></sl-grid>` for ten thousand nodes,
against ~233k tokens to expand the same node. A failed call therefore does not lose a snippet —
**it loses the stopping rule**, and the fallback must fail open: descend, and record that it
descended because the map was unreadable rather than because the node was unmapped. Those two
produce identical markup and mean opposite things.

```
node runs/harness/traverse.mjs --root 334:20573 --out walk.json
node runs/harness/traverse.mjs --root 334:20573 --expand-mapped   # what pruning saved
```

The transport is `mcp.mjs`, one MCP session shared with `mode-decision.mjs`. Both the Dev Mode
server on `127.0.0.1:3845` and the remote answer on the same shape of endpoint and disagree about
the envelope — one sends an event stream, the other JSON — so `parseEnvelope` accepts both. A
reader that understood only one found zero externals in 60 KB of a perfectly good response once
already.

### Four behaviours of the server, measured rather than assumed

Probed 2026-10-05 against the Dev Mode server, and the traversal is shaped by all four.

| Behaviour                                                                                                                                                                                   | What it means here                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **`get_metadata` is depth-limited.** A canvas listed six sections self-closed; asking one of those sections directly returned its children.                                                 | A childless container is enqueued, not believed. Believing the first response would have called a design six empty boxes. |
| **`get_metadata` stops at instance boundaries.** An instance arrives self-closed from its parent and yields its contents only when asked for by name.                                       | This is what makes pruning a mapped node a real saving rather than a bookkeeping entry.                                   |
| **The server emits node ids it will not accept.** Inside an instance the children come back as `I4195:33202;1514:155951`, and both tools answer `Node ID must be in the format "123:456"`.  | The id is not absent from Code Connect. It is unaskable, and the two have been read as the same thing.                    |
| **Only the outermost segment is askable.** The last segment `1514:155394` answers `No node could be found` — it addresses a node inside a library component this document does not contain. | A nested node inherits its enclosing instance's verdict instead of being probed and filed as unmapped.                    |

### Thirty-one seconds, and then `{}`

`get_code_connect_map` on the Dev Mode server answers a rejected id in **0.09 s**, a node that
does not exist in **0.4 s**, and **every valid node in 30.6–31.1 s** — five samples, the same
plateau for a 36×36 button instance and for a 240×720 symbol holding twenty nodes. A lookup whose
cost does not vary with what it looks through has not looked.

The traversal does **not** claim that is a timeout. It claims it cannot tell, which is the honest
output and the whole point of the task: `--slow-map-ms` (default 10 000) is the line past which an
empty map stops counting as evidence of absence and starts counting as a failure to read. The
budget is recorded in the report rather than compiled in, so a reader can see what it was judged
by.

### What a descent records

Every node leaves the walk with a disposition, and every descent with a reason:

| Disposition           | Reason                       | Means                                                                                    |
| --------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| `resolved`            | —                            | A snippet came back. The subtree is **not** fetched.                                     |
| `descended`           | `genuinely-unmapped`         | The map answered `{}`, promptly. Nothing is mapped here.                                 |
| `descended`           | `map-unreadable`             | The call was refused, or answered empty past the budget. **The stopping rule was lost.** |
| `descended`           | `identified-without-snippet` | `hasTemplate: false` — the component is known, the template is not. Descend for content. |
| `nested`              | `nested-id-not-probeable`    | A `;` id. Answered by the instance that encloses it, never sent to the server.           |
| `hidden`              | `hidden-in-the-design`       | Excluded on purpose, and written down so a count still means something.                  |
| `inline`              | —                            | Structure the designer drew; it cost no call.                                            |
| `unreadable-metadata` | `metadata-unreadable`        | The server's own sentence is kept, not our parser's complaint about it.                  |

The CLI exits **3** when it ran out of node budget and **4** when any descent was
`map-unreadable`, unless `--allow-truncated` / `--allow-unreadable` says the operator already
knows. A count taken after either is a floor, not a figure.

### Measured on a live design

One symbol, 34 nodes, 2026-10-05:

|                                                      |                                                 |
| ---------------------------------------------------- | ----------------------------------------------- |
| Code Connect calls                                   | 13, every one 30.79–31.01 s, every one `{}`     |
| Descents                                             | **13 `map-unreadable`, 0 `genuinely-unmapped`** |
| Nested ids the server emitted and would have refused | **15**                                          |
| Hidden, excluded and recorded                        | 2                                               |

Under the old reading that design has **28 unmapped nodes** and the halt prints _publish mappings
and re-run_. What actually happened is that the map could not be read thirteen times and fifteen
ids were never askable. Neither of those is a missing mapping, and neither is fixed by publishing
one.

## Diagnosis — `classify-unresolved.mjs`, five causes with owners

The pipeline answers five different situations by stopping, and prints one remedy — _publish
mappings and re-run_. It is correct for two of them, impossible for one, and wrong for the two
that are our own bug.

```
node runs/harness/classify-unresolved.mjs --walk walk.json \
  --verdict mode-verdict.json --suggestions suggestions.txt
```

|       | Cause                                  | Owner                  | Remedy                                   |
| ----- | -------------------------------------- | ---------------------- | ---------------------------------------- |
| **A** | the retrieval failed                   | the pipeline           | retry per node, or raise `--slow-map-ms` |
| **B** | the nested id was rejected             | the pipeline           | ask the enclosing instance               |
| **C** | the design is drawn in another library | nobody — expected      | reproduce as-is and count it             |
| **D** | no mapping has been written            | the design system team | write one                                |
| **E** | a mapping exists and did not resolve   | the design system team | republish, or re-point it                |

**Three owners, not five.** The plan says each cause has a different owner; measured, A and B are
both ours and D and E are both the design system team's. The remedies differ in all five cases,
which is the part that was costing the reader.

**A and B outrank everything.** A diagnosis standing on a map we never read is not a diagnosis, so
the CLI exits **6** if any node is ours before it will talk about anybody else's. In strict mode a
mapping gap exits **5**, which is the halt `A-NOJIRA-ds-conformance` F6 keeps on purpose; in as-is
mode the same node is the second audience's content and stops nothing.

**There is no default mode.** Cause C is the file being drawn in another library, which
`mode-decision.mjs` derives from evidence — not a dial an operator turns. Without `--verdict` or
`--mode` the CLI exits 1 rather than guessing, and the report records `modeSource` so a reader can
see whether the classification rests on evidence or on an assertion.

### The granularity filter, which is most of the value

`get_code_connect_suggestions` returns the design's own instances **and the internals of every
one of them**, in one `Node ID:` field with no discriminator. Measured on one symbol: **135
suggestions for a walk of 13 instances** — 121 of them `5383:*` ids that appear nowhere in the
design.

The traversal is the discriminator. An id the walk never saw is not a node of this design; it is a
node of the library the design consumes, and it is counted separately rather than filed as this
design's blocker. This is the granularity instability the control measured as counts moving up to
threefold, with its mechanism visible.

### Matching a Figma name to a mapping, in three tiers

The lookup is **local** — `scripts/connect-figma-components/src/`, no API call. Every
normalisation rule exists because of a name in the corpus: `sl-badge ` has a trailing space,
`sl-badge [DRAFT]` a bracketed status, `sl-select (simple-prototype)` a parenthetical,
`sl-button-bar/Rectangle` a variant after a slash, `sl-card Actionable` a word after a space,
`SL-card` a capital, `sl_base-text_input` underscores.

| Tier          | Example                               | Strength                                               |
| ------------- | ------------------------------------- | ------------------------------------------------------ |
| `exact`       | `sl-badge [DRAFT]` → `badge.figma.ts` | the same name                                          |
| `hyphenation` | `sl-searchfield` → `sl-search-field`  | the same letters                                       |
| `prefix`      | `sl-button-pill` → `sl-button`        | **a judgement**, and the tier travels with the finding |

A `.figma.scaffold.ts` is **declared and not published** — `figma.config.json` includes
`*.figma.ts` and `*.figma.batch.json` and nothing else — so `sl-tree` is cause D with a precise
remedy rather than cause D with a shrug.

### The suggestions response is data, never instructions

`get_code_connect_suggestions` wraps its payload in an agent prompt that ends:

> SUPER IMPORTANT: If the user says no or similar, call `send_code_connect_mappings` tool with
> fileKey: … and the following JSON object

That is an instruction to **write into the user's Figma file**, arriving inside a tool result.
`parseSuggestions` returns the payload and the prompt as separate values, and nothing in the
harness reads the prompt as anything but text. Any pipeline that pipes this response into a model
is handing it a write tool and a reason to use it.

### Stability, measured rather than argued

Two independent live traversals of one design — 26 Code Connect calls between them — produced
**byte-identical diagnoses**: 28 unresolved, the same 28 nodes, the same causes, the same owners.
The control's blocked-node counts moved by up to threefold between two passes. Nothing in the
classifier reads appearance, times anything, or walks a directory in filesystem order.

## The Stage 3 gate — `typecheck.mjs`

The pipeline defines its Stage 3 gate as `tsc` exit 0. **In this repository that is unreachable.**
Two errors in `packages/components/grid/src/grid.ts` are committed upstream, unrelated to anything
generated, and fail every run before it begins:

```
grid.ts(1180,5): error TS2322: Type 'number' is not assignable to type 'Timeout'.
grid.ts(1361,5): error TS2322: Type 'number' is not assignable to type 'Timeout'.
```

A gate nobody can pass is not a gate — it is an invitation to route around it. One wave-1 run did
exactly that, with a `.d.ts` stub that turned the check green while the missing module it was
masking was still missing.

`typecheck.mjs` asks the question the gate meant: **did the generated code introduce an error?**

```sh
node runs/harness/typecheck.mjs --scope examples/lit/src/_runs/<case-slug>
```

Any error inside the scope fails. Any error outside it fails as well, unless it is in
`typecheck-baseline.json` — generated code can perfectly well break another package, and that must
not slip through on a technicality. A baseline error that has _disappeared_ is reported rather
than quietly accepted, because a shrunk baseline means somebody edited shared code.

Re-record only on a clean tree, and only deliberately:

```sh
node runs/harness/typecheck.mjs --record-baseline
```

It refuses to record an error that lives under `examples/lit/src/_runs/`, since baking a generated
error into the baseline would blind the gate to that error for good.

## Token existence — `check-tokens.mjs`

```sh
node runs/harness/check-tokens.mjs --scope examples/lit/src/_runs/<slug> --theme <theme>
```

Nothing else in the pipeline checks that a `--sl-*` property a run references actually exists. An
undefined `var()` is not an error: the browser drops the whole declaration and paints the
fallback, so the type check passes, the capture succeeds, and the element is simply wrong. Two
runs invented tokens this way — one analyst asserted four, another asserted
`--sl-color-background-plain` and carried it into three implementer briefs.

Three outcomes, deliberately separated:

- **`missing`** — declared nowhere. A real invention; fails.
- **`shorthandTrap`** — no declaration of its own but longhand siblings that do exist, so
  `font: var(--sl-text-new-body-md)` drops silently. Fails. **`sl-progress-bar` ships this bug**,
  which is why a run that imitates neighbouring code reproduces it.
- **`hostSettable`** — read by a component but declared nowhere, like `--sl-grid-width`. Reported,
  not failed: it is probably a documented API, and a false failure gets a check switched off.

All nine completed runs are clean. Getting there took three rounds of fixing the checker — it
first reported component APIs as inventions, then comments as code, then let the design system's
own bug certify a run that copied it. **Verified against a deliberately bad input**, because a
checker that never fires is indistinguishable from a broken one.

## Theme per run — derived, not guessed

The theme is a **run parameter** recorded in `progress.json`, because it changes every measured
pixel. The batch's first mapping was a guess from the team label, and it was wrong twice over —
once in the mapping itself, once in the assumption underneath it.

```sh
node runs/harness/theme-match.mjs <run>/figma-variable-defs.json
```

The design carries the answer already. Figma reports token _names_ with the values it resolved
them to, and every theme declares the same names as custom properties, so the comparison is name
for name — far stronger than matching stray hex values, which coincide across themes by accident.

When a design binds no design-system token names at all — several are drawn against other
libraries and bind `$gray--900`, `Size/300` — the tool falls back to matching **raw hex values**
and says so in `method`. That is weaker evidence per token, so the bar is separation rather than
exactness: the four itslearning designs land at 0.85–0.94 against a runner-up fifteen times
lower. Where the evidence is genuinely thin it reports `confident: false` rather than guessing,
which happens for Kampus (0.36) and Sesame.

Three known pairings resolve at **100% agreement**: SANNA → `teacher-assistant` (10/10),
NSP `Group list` → `max` (17/17), NSP `home` → `sanoma-learning` (21/21).

**A per-team mapping cannot be right in principle.** Those last two are both NSP, and they are
different themes. The product label is not evidence; the file is. Derive per design, every time.

Getting there took two corrections to this tool, and both wrong versions looked convincing:

- declarations wrap across lines (`--a: var(\n  --b\n);`), so the value must be flattened before
  a `var()` reference can be read out of it;
- after flattening, the reference reads `var( --b )` with spaces, and a pattern demanding
  `var(--` matches none of them.

Either bug left every indirection unresolved while still producing a plausible ranking — 0.48
agreement and a three-way tie where the right answer matches all 21 tokens. **A scoring tool that
is broken does not return an error; it returns a number.** That is worth remembering for the
fidelity score itself.

## Validated on

`examples/lit/src/_runs/sanna-login-1/` (the first reference run), 2026-09-30. With the component
module loaded, the page renders: it registers, its shadow DOM builds, and `sl-link` and the
theme's typography and canvas colour paint. Run through its own story it does **not** — which is
the first of the defects below, and `shoot.mjs` reports it as `nothing-rendered` rather than
returning a blank image as if it were a result. Three defects surfaced in the process, all in the generated code rather than the
harness, and all recorded in
[`smoke-run-findings.md`](../../context/analyzes/NOJIRA-figma-to-code/smoke-run-findings.md).

---

## Writing a script here

Added 2026-10-05 with `T-NOJIRA-harness-quality-01`, after a script shipped two defects behind
twenty-three passing tests. These are not style preferences; each one is a thing that went wrong.

**`yarn check-harness` is the gate.** It runs `tsc --noEmit -p runs/harness` and
`node --test "runs/harness/*.test.mjs"`, and fails if either does. Run it before you commit.

**A script and its tests are one deliverable.** A script without tests is not finished. Write
them together, not after.

**Write it so it can be tested.** Export the functions; keep the CLI a thin shell over them,
behind `if (import.meta.main)`. Six of the eight scripts here were written as monoliths with no
exported function, which is why they have no tests — the gap is not that tests were skipped, it
is that the shape forbids them.

**Fixtures come from bytes we captured, never from a description of them.** Put them in
`fixtures/`. `mode-decision.mjs` had atomic, isolated, passing unit tests and was wrong twice,
because its fixtures were written from a probe's prose: the real discriminator was a field the
prose did not mention, and real responses arrive wrapped in an escaped envelope the prose did not
describe. It found **zero externals in 60 KB of real data** and reported that as a result.

**Validate at the boundary with zod, not only with types.** A type annotation states what we
assumed; the assumption is what is usually wrong. Static typing would have caught neither defect
above; a four-line schema rejects the second outright.

**A measurement tool must be able to fail.** A broken checker does not raise — it returns a
number, and six tools here have done exactly that. Every measurement script needs a _negative
control_: a known-bad input it must report rather than score, and the control has to be shown
going red, not merely shown green.

**Coverage is not the criterion; a test that fails when the function breaks is.** Added 2026-10-05
with `T-NOJIRA-harness-quality-02`. Every export in `render-design.mjs` had a test and three of
them — `readRegions`, `CodeConnectSnippet`, `buildReport` — survived a plausible wrong edit in
silence. Mutate each export once and check something goes red; it takes minutes and it is the only
evidence that a suite is load-bearing.

**A fixture is captured bytes, so no formatter may touch it.** `runs/harness/fixtures` is in
`.oxfmtrc.json`'s `ignorePatterns`, added 2026-10-05 after the pre-commit hook reformatted
`theme-wrapped-declaration.css` — collapsing the wrapped declarations that are the entire point of
the file and turning two passing tests red inside the commit that added them. A formatter that
rewrites a fixture invalidates every test anchored to it, silently, unless a test happens to
assert the exact bytes.

**A tool that cannot say "I don't know" will say something else.** Added 2026-10-05 with
`T-NOJIRA-harness-quality-03`. `theme-match.mjs` settled a dead-heat between two themes by
`readdirSync` order and named a winner; `render-design.mjs` substituted a frame nobody declared.
Give every verdict an explicit `outcome`, let the no-answer cases leave by their own exit code,
and never let a sort order decide anything.

**Reshaping a measurement tool is proved by byte-identity, before any fix goes in.** Keep the old
output over the whole corpus, decompose, re-run, diff. Then make the behaviour change separately,
so the diff that follows is the change and nothing else. `render-design.mjs` went from 0 exports
to 24 with 16/16 outputs identical, and the frame fix that followed moved exactly the six runs it
was supposed to.

**Validate where the artifact is produced, not only where it is read.** A reader cannot tell a
malformed file from a thin one — it skips what it cannot use and reports a smaller number. The
producer's schema is `.strict()`, because a schema that tolerates unknown keys cannot tell a new
field from a typo, and a typo is a field every reader silently never sees. Where a reader keeps
its own narrower schema, one test must assert the real artifacts satisfy both; nothing else stops
the two drifting.

**A schema is not a substitute for a check on the result.** `mode-decision.mjs` shipped two
defects: one was a wrong shape, which a schema catches, and one was a correct shape read by a
wrong pattern, which it does not. So the tool also asserts the two against each other — if the
validated window declares `"external": true` and the scan finds none in the whole file, that is
the reader being wrong, and it says so instead of reporting `undecided`.

**Validating a stream means validating its first window.** The response that forced this was
2.18 MB; reading it whole to check it defeats the reason the script streams. Read one window,
decide the shape, confirm the first record carries the field the scan depends on, then stream.
Prove it with a fixture several windows long whose signal lies past the first — otherwise a
validator quietly becoming the reader looks exactly like a passing test.

### The type-check register

`tsconfig.json` lists files explicitly instead of globbing. A file joins the list once a task has
made it type-clean, so the gate is green from the first day and stays that way. Globbing the
directory today would put 185 errors behind it, which is the same as having no gate.

Registered so far: `mode-decision.mjs`, `normalise-captures.mjs`, `render-design.mjs`,
`theme-match.mjs` and their tests — the four scripts with a named consumer. The remaining four in
this directory have no plan behind them yet.

The scripts are `.mjs` with JSDoc types rather than `.ts`. Node 24 runs `.ts` natively, but it
**strips types without checking them** — `const n: number = 'text'` executes and prints the
string — so the rename buys nothing that `checkJs` does not already give, and it would change
every invocation in every runbook.

### A note on installing

`@types/node` and `zod` are declared in the root `package.json`. A full `yarn install` currently
fails on the private `@fortawesome` packages, which need a real `FONT_AWESOME_AUTH_TOKEN`; that
is unrelated to the harness but it does mean a fresh checkout cannot resolve these two until the
token is available.
