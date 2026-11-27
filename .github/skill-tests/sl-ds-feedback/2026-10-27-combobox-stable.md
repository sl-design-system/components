# sl-ds-feedback: a real request to make sl-combobox Stable

2026-10-27; VS Code Copilot Chat in Agent mode (model not noted); skill at `fed384d03`; run by a product developer in their own repository, scored afterwards from the transcript and GitHub.

## Case

| Case            | Kind                                                                   | Answer key                                                         |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| combobox-stable | Preview to Stable, with a question whether Preview is the only blocker | none; the real outcome is #3814 and a 👍 on #3298, #3382 and #3797 |

The developer asked whether Preview status is the only reason their product keeps a third-party select library, and to include any missing feature in the issue.

## Results

| Point              | Result | Notes                                                                                            |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------ |
| Setup check first  | pass   | 5 lines filled from calls; the team line was `n/a` and the agent proposed a team name itself     |
| Status and version | pass   | `preview`, 0.3.1 installed, 0.3.2 the newest                                                     |
| Search             | pass   | open and closed; found the three open matches and noted the two closed duplicates of #3382       |
| 👍 on matches      | pass   | #3298, #3382 and #3797; no comment, as nothing new was added                                     |
| New issue          | pass   | feature request form, all 8 fields in order, `triage` kept (the posting account has push access) |
| Marker             | pass   | `<!-- sl-ds-feedback -->` at the end, shown before sending                                       |
| No product detail  | pass   | only the team field; internal follow-ups stayed in the chat                                      |
| Confirmation       | pass   | the client's question tool returned no answer, and nothing was posted until the developer's yes  |

## Findings

- The team field was proposed by the agent instead of asked, because the setup line said "if the file exists" and `n/a` read as allowed.
  Fixed: the line now says "else ask the developer"; tested in `2026-10-27-storybook-and-team.md`.
- The Current Behavior claims (an empty listbox while loading, the no-match text only changeable globally) were read from the source and not marked as such.
  Fixed: a new setup line for the browser tool, and a rule that each claim about how a component behaves and the bug form's Storybook answer come from a run in the public Storybook, or say "read from the source, not run".
- Three new needs (readonly, loading state, no-match text) went into one issue next to the Stable request.
  Not changed: whether the team wants one issue per need, with the Stable request linking them, is their call.
