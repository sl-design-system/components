---
'@sl-design-system/checkbox': minor
---

`sl-checkbox` now uses `ForwardAriaMixin` instead of `ObserveAttributesMixin` to forward ARIA to the
`<input>` element. Reference attributes (`aria-labelledby` and `aria-describedby`) are resolved to
elements and forwarded via `ariaLabelledByElements`/`ariaDescribedByElements`, so relationships that
are set as element references — such as an `sl-tooltip` labelling or describing the checkbox — now
reach the `<input>`. Previously only the attribute value was copied, which meant a tooltip anchored
to an `sl-checkbox` did not label the actual control.

All `aria-*` attributes set on the host are now forwarded, rather than a fixed list. This means
`aria-describedby` reaches the `<input>` as well; it used to stay on the host.
