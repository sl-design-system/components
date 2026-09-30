# Changelog

Structural changes to this context — append-only, newest on top (CONVENTIONS § 6).

## 2026-09-30
- Approved P-NOJIRA-requirement-triage and added T-NOJIRA-requirement-triage-01..06 — marcin.ludwig
- Stated the Figma seat constraint precisely across A-NOJIRA-pipeline-staging and
  A-NOJIRA-designer-workflow: no Dev seat means no Figma MCP, so visual verification is
  available to developers and structured verification is not — marcin.ludwig
- Accessibility becomes its own plan rather than part of the HTML stage — marcin.ludwig
- Amendment 2 on P-NOJIRA-figma-to-code: the measurement tool is a bench serving both halves of
  the pipeline, renamed tools/sl-bench, with comparison across configurations and over time;
  added T-NOJIRA-figma-to-code-14 + UC-14, reconciled T-01 and T-06 — marcin.ludwig
- Corrected A-NOJIRA-pipeline-staging: developers do have Figma access; added versioned
  packages, the metadata document, and HTML-stage accessibility validation — marcin.ludwig
- Reframed A-NOJIRA-pipeline-staging and A-NOJIRA-designer-workflow around the handover
  boundary: the developer holds no Figma seat, so the artifact is a shipped package with a
  tool-generated attestation, and the two stages are separately distributed — marcin.ludwig
- Added A-NOJIRA-pipeline-staging (analyzes/NOJIRA-pipeline-staging) — the two-stage split and
  the intermediate-artifact decision — marcin.ludwig
- Added A-NOJIRA-requirement-backlog (analyzes/NOJIRA-requirement-backlog) — the 31 inherited
  requirements re-scored against this repository — marcin.ludwig
- Added P-NOJIRA-requirement-triage (plan/NOJIRA-requirement-triage) — marcin.ludwig
- Added context/README.md — the entry point for the knowledge base — marcin.ludwig
- Added AGENTS.md at the repository root pointing agents at context/ — marcin.ludwig
- Amendment 1 on P-NOJIRA-figma-to-code: cost and model-tier accounting as a third measured
  axis; added T-NOJIRA-figma-to-code-13 + UC-13, reconciled T-11 and T-12 — marcin.ludwig
- Moved the prior-art snapshot from tools/ to reference/ — it is evidence for comparison,
  not tooling to run — marcin.ludwig
- Added A-NOJIRA-designer-workflow (analyzes/NOJIRA-designer-workflow) — marcin.ludwig
- Added ARCH-prior-art-ds-skills (foundation/prior-art-ds-skills.md) — external stub for the
  frozen skill-set snapshot vendored to reference/prior-art-ds-skills/ — marcin.ludwig
- Pinned prior-art-ds-skills@2026-09-30 in .sl-aipdlc.yaml — marcin.ludwig
- Added A-NOJIRA-figma-to-code (analyzes/NOJIRA-figma-to-code) — marcin.ludwig
- Added P-NOJIRA-figma-to-code (plan/NOJIRA-figma-to-code), approved same day — marcin.ludwig
- Added plan/roadmap.md — marcin.ludwig
- Added T-NOJIRA-figma-to-code-01..12 (work/NOJIRA-figma-to-code) — marcin.ludwig
- Added UC-NOJIRA-figma-to-code-01..12 (tests/NOJIRA-figma-to-code) — marcin.ludwig
- Context scaffolded with `sl-aipdlc init`.
