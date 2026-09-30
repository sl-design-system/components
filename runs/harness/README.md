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

Three known pairings now resolve at **100% agreement**: SANNA → `teacher-assistant` (10/10),
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
