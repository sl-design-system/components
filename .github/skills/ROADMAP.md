# sl-ds agent skills: roadmap

## Planned

- An email to the teams within Sanoma with an overview of the skills, asking for feedback.
- Accessibility gate in `sl-ds-figma-to-code` and `sl-ds-ticket-to-plan`; its shape is still open.
- Compare `sl-ds-figma-to-code`: real designs vs screenshot path.
- A pilot with a product team.
- Finish Code Connect mappings for the packages that do not have one yet.
- More runs in VS Code Copilot and the Copilot CLI, with Opus; on the default model the plan was shallower.

## Open questions

- What happens to `tools/implement-design-plugin` next to `sl-ds-figma-to-code`? Both turn a Figma design into code?
- Does a local mapping of the Figma library save time or tokens when the agent works from a ticket and screenshots only?
- !!! How do we want to distribute skills to the rest of the company devs? (Open big unknown to answer)
- Where do `sl-ds-feedback` and `sl-ds-figma-to-code` live long term? This repository is their temporary home.
- How to gather feedback to the skills, we can selfimprove `sl-ds-ticket-to-plan` within the team but how should we do that for `sl-ds-feedback`, `sl-ds-figma-to-code` 

## Ideas

- A Figma design review skill `sl-ds-figma-review` to review other team designs in example: detached instances, other or custom design systems, not working Code Connect.
- `sl-ds-ticket-to-plan` goes on from the plan created by dev using`sl-ds-feedback` to the code change and a draft pull request within the repository.
