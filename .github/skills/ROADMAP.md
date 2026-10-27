# sl-ds agent skills: roadmap

## Planned

- An email to the teams within Sanoma with an overview of the skills, asking for feedback.
- Accessibility gate in `sl-ds-figma-to-code` and `sl-ds-ticket-to-plan`; its shape is still open.
- Benchmark `sl-ds-figma-to-code` on real designs, on the Figma and the screenshot path.
- More runs in VS Code Copilot and the Copilot CLI, with Opus; on the default model the plan was shallower.
- A pilot with a product team.
- A workflow that adds the `triage` label to new issues; GitHub drops the form's labels for reporters without write access.

## Open questions

- What happens to `tools/implement-design-plugin` next to `sl-ds-figma-to-code`? Both turn a Figma design into code.
- Does a local mapping of the Figma library save time or tokens when the agent works from a ticket and screenshots only?
- Where do `sl-ds-feedback` and `sl-ds-figma-to-code` live long term? This repository is their temporary home.

## Ideas

- A Figma design review skill for the design-system team: detached instances, other or custom design systems, working Code Connect.
- A self-improve step, like the one in `sl-ds-ticket-to-plan`, in the other two skills, sending findings to the design-system team through `sl-ds-feedback`.
- Code Connect mappings for the packages that do not have one yet.
- `sl-ds-ticket-to-plan` goes on from the plan to the code change and a draft pull request, after the developer's yes, so an issue from `sl-ds-feedback` can end in a fix; whether product developers open such pull requests is the design-system team's call.
