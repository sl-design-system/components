# Code Connect reachability from Copilot CLI — 2026-10-07 12:20 CEST

Client: GitHub Copilot CLI 1.0.92, Figma MCP server (remote). User: marcin.ludwig@sanoma.com, Dev seat on "Sanoma Learning" org (whoami).

Replay of a recorded probe-04 call that returned a mapping from Claude Code on 2026-10-06:
- record: runs/probe-04/code-connect/a10-etsl-fam-users__17264-29106__child-1086-nodes.json (1907 bytes, map keyed 17557:100187 → sl-form-field/sl-select snippet, label "SL Design System", hasTemplate: true)

| call | fileKey | nodeId | result from Copilot CLI |
|---|---|---|---|
| get_code_connect_map | S5QgDy8X9eqhvECPANSZMM | 17264:29106 | `{}` |
| get_code_connect_map (codeConnectLabel="SL Design System") | S5QgDy8X9eqhvECPANSZMM | 17264:29106 | `{}` |
| get_code_connect_map | S5QgDy8X9eqhvECPANSZMM | 17557:100187 | `{}` |
| get_metadata | S5QgDy8X9eqhvECPANSZMM | 17264:29106 | full XML tree (file access OK) |
| get_design_context | S5QgDy8X9eqhvECPANSZMM | 17557:100187 | full React+Tailwind reconstruction, component descriptions, **no Code Connect snippet** |

Conclusion: file access and design context work; Code Connect data is not served to this client. Same user, same node, same server as the 2026-10-06 Claude Code capture that did resolve. Consistent with the probe-04 finding that Code Connect is only answered for clients in Figma's MCP Catalog. The remaining two probe designs (a4, a5) cannot be walked from Copilot CLI with the same instrument.

## Two constraints from Figma's documentation (developers.figma.com, rate-limits-access, read 2026-10-07)

- Only clients listed in the Figma MCP Catalog can connect at all. Copilot CLI connects and gets design context, so the empty Code Connect map is a narrower restriction than catalogue membership — either Code Connect is served per client, or the mappings changed between 2026-10-06 and 2026-10-07. Only a Claude Code replay of the same call can tell the two apart.
- Dev seat on an Organization plan: **200 tool calls per day, 20 per minute** (exempt: `add_code_connect_map`, `create_new_file`, `whoami`). The remaining two probe designs need roughly 500 Code Connect calls, so they take at least three calendar days on one seat whichever client runs them — unless the walk asks enclosing nodes instead of every instance.

## Replay from a Copilot CLI subagent — 12:37 CEST

Yesterday's twelve designs were walked by Claude Code subagents, one per design, so the same shape was tried here: a Copilot CLI subagent (separate context, same MCP connection) called `whoami` and then `get_code_connect_map` on `S5QgDy8X9eqhvECPANSZMM/17264:29106`, `CHpKrPIdXdbV2u7X8vizKI/1514:156507` (the `sl-select` component set in the Components 2.0 library, whose mapping is published from `scripts/connect-figma-components`) and `S5QgDy8X9eqhvECPANSZMM/17557:100187`. All three returned `{}`; `whoami` matched. Main agent, subagent and script differ in nothing that Figma sees — the client is Copilot CLI in all three cases. The 2026-10-06 results came from a different client (Claude Code), and that is the variable.
