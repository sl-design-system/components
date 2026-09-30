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

## Theme per run

The theme is a **run parameter**, recorded in `progress.json`, because it changes every measured
pixel. Mapping used by the batch:

| Product                                          | `globals=theme:`                              |
| ------------------------------------------------ | --------------------------------------------- |
| Kampus                                           | `kampus`                                      |
| NSP                                              | `sanoma-pro`                                  |
| SANNA                                            | `teacher-assistant`                           |
| ETSL (Editorial Suite)                           | `editorial-suite`                             |
| Itsl-Bookmk / Itsl-Collab / Itsl-Course / Sesame | `itslearning`                                 |
| MyPortal                                         | `sanoma-learning` — **unresolved**, see below |

MyPortal has no obvious theme package. `sanoma-learning` is the design system's base theme and the
Storybook default, so it is the honest fallback — but any colour or type difference on A3 and A7
may be the theme rather than the run, and must not be read as a fidelity result until the mapping
is settled.

## Validated on

`examples/lit/src/_runs/sanna-login-1/` (the first reference run), 2026-09-30. With the component
module loaded, the page renders: it registers, its shadow DOM builds, and `sl-link` and the
theme's typography and canvas colour paint. Run through its own story it does **not** — which is
the first of the defects below, and `shoot.mjs` reports it as `nothing-rendered` rather than
returning a blank image as if it were a result. Three defects surfaced in the process, all in the generated code rather than the
harness, and all recorded in
[`smoke-run-findings.md`](../../context/analyzes/NOJIRA-figma-to-code/smoke-run-findings.md).
