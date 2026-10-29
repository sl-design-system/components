# sl-ds-ticket-to-plan: first probe

2026-10-26; Claude Code 2.1.310 with Opus 5.5 and Copilot CLI 1.0.103 with its default model; the first version of the skill (before the locale line was added); headless runs, setup questions answered in the prompt.

## Cases

| Case                                                    | Kind                                                                                   | Answer key                  |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------- |
| #3722 Toggle group chips                                | feature with a Figma link, its own acceptance criteria, one comment with a requirement | PR #3756                    |
| #3229 Date field action buttons close the calendar      | feature, no acceptance criteria                                                        | PR #3740                    |
| #3132 Search field clear button not keyboard accessible | accessibility bug                                                                      | PR #3684                    |
| #3728 Tabs scroller focusable in Firefox                | accessibility bug, open                                                                | none; run on current `main` |

Closed cases ran on the code from before the merged pull request, without later history; pull-request lookups and fetching were blocked there so the answer key stayed out of reach.
Each run had two turns: `/sl-ds-ticket-to-plan <n>`, then "Confirmed as drafted. Make the plan."
Figma was signed out, so #3722 also tested that failure.

## Results

| Run                                | Setup first, failures named                    | Stopped for confirmation | Files named vs the answer key                                               | Approach vs the merged fix                                                                                                                  |
| ---------------------------------- | ---------------------------------------------- | ------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| #3722, Claude Code                 | yes, Figma sign-in named with the fix          | yes                      | 7 of 7 (component, styles, spec, stories, package.json, locales, changeset) | same, including the two `msg()` ids of the merged code; the comment's `role="group"` and description requirement was picked up              |
| #3229, Claude Code                 | yes                                            | yes                      | 4 of 4                                                                      | same design (attribute found through `composedPath()`, then `hidePicker()`); the attribute name differed and was flagged as a team decision |
| #3132, Claude Code                 | yes                                            | yes                      | 5 of 5, including the website `accessibility.md`                            | same three changes: remove `tabindex="-1"`, hide on `readonly`, keep the host's Enter handler off the button                                |
| #3728, Claude Code                 | yes, with a real fetch and pull-request search | yes                      | no answer key                                                               | found the open PR #3753 for the issue and advised reviewing it instead of a second pull request                                             |
| #3132, Copilot CLI (default model) | yes                                            | yes                      | 4 of 5, missed `accessibility.md`                                           | partly: tabindex and focus ring, but missed the Enter handler conflict and `readonly`                                                       |

About 2 minutes per issue in Claude Code.

## Findings

- The #3722 plan named only one translation, while the merged change added every locale; fixed: the skill now asks for a translation in every locale (a `<target>` in every `.xlf` file).
- On Copilot's default model the plan was shallower (one run); to be retested with an Opus model before changing the skill.
- Agents tried to download issue images with `curl`; left to the developer at run time.
