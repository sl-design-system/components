# Kept runs

A curated reference per pipeline run **worth keeping** — not every run.

The distinction matters. `.implement-design/` is where the pipeline writes, and it stays ignored:
experiments, false starts and repeats do not belong in the repository. A run is **promoted** here
when it is something later work will be compared against.

Keeping them is not tidiness. A run costs hundreds of thousands of tokens and tens of minutes, so
re-running one to recover a number nobody kept is the most expensive mistake available. Comparison
over time is the whole method, and it needs the earlier point to still exist.

## What a kept run holds

| File                            | What it is                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `manifest.md`                   | the design manifest, the decomposition, and the open questions with the defaults the orchestrator chose |
| `figma-*.json` / `.txt` / `.md` | the raw output of every Figma call, so the run can be re-read without re-fetching                       |
| `screenshot.png`                | the cached Figma reference                                                                              |
| `generated/`                    | a snapshot of the code the run produced                                                                 |

`generated/` is a snapshot, not a working tree. The live copy stays under `examples/lit/src/_runs/`
and stays ignored, because committing generated code into a compiled and linted tree would put
placeholder asset paths and unreviewed output through CI. What is here is evidence of what the
pipeline emitted — inert, and nothing builds it.

## The runs

| Run                         | Case                                               | Outcome                                                                                                                                                                                                                   |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2026-10-01-a9-sanna-login` | A9 SANNA Login 1 — the simplest case in the corpus | Stages 1–3 complete, type-check clean; Stage 4 blocked on a missing registry credential. 372,844 tokens, ~27 minutes. Findings: [`smoke-run-findings.md`](../context/analyzes/NOJIRA-figma-to-code/smoke-run-findings.md) |

**One rename against the pipeline's own naming.** The pipeline instructs its analyst to write
`get_metadata`'s output to `figma-metadata.json`, but on the remote server that call returns plain
text, not JSON — the first line is `Currently selected nodes:`. The file is kept here as
`figma-metadata.txt`, named for what it is. Anything that trusted the extension and parsed it would
fail, which is a small defect in the pipeline's artifact naming rather than in this run.

Once the bench exists, a kept run also carries its scored result and the identity that makes it
comparable — pipeline commit, corpus freeze stamp, model tier per stage.
