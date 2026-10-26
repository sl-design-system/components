# sl-figma-to-code: setup check with broken setups

2026-10-26; Claude Code 2.1.310 with Opus 5.5, and Copilot CLI 1.0.103 with its default model for one run; headless `/sl-figma-to-code check` in a copy of a product repository without installed dependencies; skill `96fcd3e5`.
Each run broke one part of the setup for that run only; the real configuration was untouched.

## Cases

| Case                     | Broken                           | Expected                                                                   |
| ------------------------ | -------------------------------- | -------------------------------------------------------------------------- |
| cc-check-1               | Figma signed out                 | Figma `failed` with the sign-in fix                                        |
| cp-check-2 (Copilot CLI) | Figma MCP not installed          | Figma `failed` with the install fix, and no context file draft             |
| s1                       | Figma plugin disabled            | Figma and the Figma skill `failed`, the screenshot path offered, not taken |
| s2                       | no MCP servers at all            | Jira `failed` with the `claude mcp add` fix                                |
| s3                       | nothing                          | Figma found by tool search, `whoami` called, the seat decides the path     |
| s4                       | no browser tool, app not running | App `failed` with the install fix; asks before starting anything           |
| s5                       | `gh` not installed               | Jira still `ok`; `gh` `failed` with the install fix                        |

## Results

| Case       | Checklist first | Failure named, with a fix                                                                                                           | No fallback taken on its own | Nothing left behind |
| ---------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------- |
| cc-check-1 | yes             | yes                                                                                                                                 | yes                          | yes                 |
| cp-check-2 | yes             | yes, after the check-only fix below                                                                                                 | yes                          | yes                 |
| s1         | yes             | yes; could not tell "not installed" from "not loaded", because the run's settings were not visible to it, and gave the fix for both | yes                          | yes                 |
| s2         | yes             | yes, both the sign-in and the `claude mcp add` fix with the v2 URL; Figma `failed` too, as expected with no servers                 | yes                          | yes                 |
| s3         | yes             | n/a; Dev seat, Figma path; commands `failed` because `node_modules` was missing, with `pnpm install` as the fix                     | yes                          | yes                 |
| s4         | yes             | yes, `npm install -g @playwright/cli@latest`; asked the developer to start the app                                                  | yes                          | yes                 |
| s5         | yes             | yes, `brew install gh && gh auth login`; said Jira tickets do not need it, only the `sl-ds-feedback` handoff                        | yes                          | yes                 |

Between 1 and 6 minutes per run; the 6 minutes were a Jira call that timed out.

## Findings

- Fixed before this probe (cp-check-2): in `check` mode the agent drafted the context file; the check-only line now ends with "and stop there: no context file draft."
- Minor, not changed: agents sometimes write their own status words (`ok*`, `ok/question`) next to the five the skill defines.
- s5 found a real conflict and asked instead of choosing: the product repository's own verification skill used one browser tool, the developer's own instructions another.
