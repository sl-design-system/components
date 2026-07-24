---
'@sl-design-system/tooltip': major
---

Rewrite of the tooltip component: the tooltip was the component responsible for the most bug reports and had a complex internal implementation. This rewrite significantly simplifies the component.

The complex internal positioning logic, `AnchorController`, `EventsController`, and `lazy()` static method have been removed in favour of native browser `popover` and CSS Anchor Positioning APIs.

> [!NOTE]
> CSS Anchor Positioning is not yet supported in all browsers. You may need to include the [CSS Anchor Positioning polyfill](https://anchor-positioning.oddbird.net/) in your application.

#### Breaking changes

- The `TooltipOptions` interface and `Tooltip.lazy()` static method have been removed. Use the `for` attribute to link a tooltip to its anchor instead.
- The `position`, `offset`, `maxWidth`, `arrowPadding`, and `viewportMargin` properties/statics have been removed.
- `hoverShowDelay` changed from `500ms` to `150ms` and `hoverHideDelay` changed from `200ms` to `0ms`.

#### New API

- `for` — links the tooltip to an anchor element by ID
- `type` — controls the ARIA relationship: `'label'` (`ariaLabelledByElements`, default) or `'description'` (`ariaDescribedByElements`)
- `trigger` — space-separated list of triggers: `'focus'`, `'hover'`, and/or `'click'` (default: `'focus hover'`)
- `disabled` — prevents the tooltip from showing
- `open` — shows or hides the tooltip programmatically, regardless of trigger; to check whether the tooltip is showing, use `matches(':popover-open')` instead
