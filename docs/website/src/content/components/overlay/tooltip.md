---
title: Tooltip
layout: component
eleventyNavigation:
  key: Tooltip
  parent: Overlay
---

```html {.example .show-source}
<sl-button aria-describedby="tip">Hover me</sl-button>
<sl-tooltip id="tip">This is a tooltip</sl-tooltip>
```

## Usage

`<sl-tooltip>` shows a small label when the user hovers over or focuses an element. Use it for short,
supplementary hints. Because tooltips only appear on hover/focus, never put essential information or
interactive content in them.

Associate a tooltip with its trigger by giving the trigger an `aria-describedby` (or, for icon-only
controls, `aria-labelledby`) that matches the tooltip's `id`.

## Examples

### Basic

Hover or focus the button to reveal the tooltip.

```html {.example .show-source}
<sl-button aria-describedby="tip-basic">Hover me</sl-button>
<sl-tooltip id="tip-basic">This is the tooltip message</sl-tooltip>
```

### Positions

Use the `position` attribute to place the tooltip relative to its trigger. Besides `top`, `right`,
`bottom` and `left`, each side also has `-start` and `-end` variants.

```html {.example .show-source .horizontal}
<sl-button aria-describedby="tip-top">Top</sl-button>
<sl-tooltip id="tip-top" position="top">Tooltip on top</sl-tooltip>

<sl-button aria-describedby="tip-right">Right</sl-button>
<sl-tooltip id="tip-right" position="right">Tooltip on the right</sl-tooltip>

<sl-button aria-describedby="tip-bottom">Bottom</sl-button>
<sl-tooltip id="tip-bottom" position="bottom">Tooltip on the bottom</sl-tooltip>

<sl-button aria-describedby="tip-left">Left</sl-button>
<sl-tooltip id="tip-left" position="left">Tooltip on the left</sl-tooltip>
```

### Labelling an icon-only button

For a button with only an icon, use `aria-labelledby` so the tooltip also acts as the button's
accessible name.

```html {.example .show-source}
<sl-button aria-labelledby="tip-icon" fill="outline">
  <sl-icon name="far-gear"></sl-icon>
</sl-button>
<sl-tooltip id="tip-icon" position="top">Settings</sl-tooltip>
```

## API

See the [API reference](/api-reference/sl-tooltip) for all attributes and properties.
