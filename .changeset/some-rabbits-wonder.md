---
'@sl-design-system/callout': patch
---


New `callout` component, visually similar to the `inline-message` but with a different purpose:
it can be used to provide additional, non-interrupting information and may include actions (e.g. buttons).
It must not be shown/hidden dynamically in response to user actions (unlike the `inline-message`).
There is no ARIA role on this component as it is not meant to interrupt the user (no live region).