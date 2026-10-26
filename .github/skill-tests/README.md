# Skill tests

Reports from testing the agent skills in `.github/skills/`.
Clients do not load anything from this folder, so the skills stay small; read it when you test or change a skill.

Each skill has its own folder with one file per test or finding, named `<YYYY-MM-DD>-<topic>.md`.
Add your own the same way, also when a run of a skill goes wrong in your daily work.

## Running a probe

1. Pick at least 5 cases of different kinds (for `sl-ds-ticket-to-plan`: a feature with a Figma link, a bug, a tokens or documentation issue, a spike, an open issue).
2. Where you can, use a closed issue with a merged pull request as the answer key, and run the skill on the code from before that pull request, without later history, so the fix is not in reach: `git archive <merge-commit>^ | tar -x -C <folder>`, then `git init` and one commit there.
3. Start the skill as a developer would (`/<skill> <argument>`), answer its questions as a developer would, and keep the transcript.
4. Note the client, its version, the model and the skill's commit.
5. Score against what the skill promises (its setup check, its stops, its output) and against the answer key.

## Report

```markdown
# <skill>: <topic>

Date, client and version, model, skill commit, who ran it.

## Cases

| Case | Kind | Answer key |

## Results

| Case | <one column per scored point> | Notes |

## Findings

- <what went wrong or could be better, how often, and the smallest change to SKILL.md that would fix it>
- <state whether the change was applied, and in which pull request>
```

This repository is public: no internal product names, ticket keys, links, customer data or unreleased designs in a report.
