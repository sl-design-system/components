# sl-ds-feedback: Storybook check and team question

2026-10-27; Claude Code 2.1.310 headless with Opus 5.5; skill content hash `cc9c211f` (on top of `fed384d03`), then `74ce09e0` for the B3 re-run; run by the skill's builder.
Two new-issue cases from the 2026-10-26 probe, with two changes to the method: no team given in advance, so the skill has to ask, and `playwright-cli` allowed, so it can run its claims in the public Storybook.
Nothing could be posted.

## Cases

| Case | Kind                                                                          | Answer key                                                                    |
| ---- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| B1   | bug: avatar initials show "undefined" with a trailing space in `display-name` | new bug report; "Yes" for Storybook only after a real run, with the story URL |
| B3   | Preview to Stable: `sl-number-field`                                          | new feature request; no product plans or internal links                       |

## Results

| Case  | Setup check | Team                                    | Storybook                                               | Claims marked                                            | Internal details out | Marker | Notes                                |
| ----- | ----------- | --------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- | -------------------- | ------ | ------------------------------------ |
| B1    | pass        | pass, asked (optional field left empty) | pass, reproduced with a story URL that works on its own | pass                                                     | pass                 | pass   | also found the leading-space variant |
| B3    | pass        | pass, asked                             | not run, line 6 `n/a`                                   | fail: "typing 11 makes the field invalid" stated as fact | pass                 | pass   |                                      |
| B3-r2 | pass        | pass, asked                             | not run, line 6 `n/a`                                   | pass                                                     | pass                 | pass   | after the rule change below          |

The builder opened B1's story URL in a separate browser: `displayName` "Alex " renders `Aundefined`.

## Findings

- B3: the Storybook rule covered only Current Behavior, so a behavior claim in Context went out unmarked; and "n/a is fine" let the agent mark the browser `n/a` without looking for one.
  Fixed: the rule now covers each claim about how a component behaves, and line 6 says `n/a` only when there is none.
  B3-r2 passed on the claims; it still marked line 6 `n/a`, meaning "not needed", while a browser tool was there.
  Minor, not changed.
- Both B3 runs took the product name from the developer's text for the team field, and asked to confirm it.
  Allowed by the form's Product/Team field and by the skill; the developer decides.
