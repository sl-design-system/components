---
title: Switch
layout: docs
eleventyNavigation:
  key: Switch
  parent: Actions
---

`<sl-switch>` is a single on/off toggle. Use it for settings that take effect immediately, such as
enabling a feature. When the choice is part of a form that is submitted later, a
[checkbox](/components/form/checkbox) is usually more appropriate.

The label goes in the default slot.

## Usage

```html
<sl-switch>Enable notifications</sl-switch>
```

## Examples

### Basic

```html {.example .show-source}
<sl-switch>Toggle me</sl-switch>
```

### Checked

```html {.example .show-source}
<sl-switch checked>On by default</sl-switch>
```

### Reverse

Add `reverse` to place the label before the toggle (for example to align it with other controls).

```html {.example .show-source}
<sl-switch reverse>Label on the left</sl-switch>
```

### Disabled

```html {.example .show-source .vertical}
<sl-switch disabled>Off</sl-switch>
<sl-switch disabled checked>On</sl-switch>
```

### Custom icons

Use the `icon-on` and `icon-off` attributes to show an icon inside the toggle for each state.

```html {.example .show-source}
<sl-switch icon-on="fas-moon-stars" icon-off="fas-sun-bright" aria-label="Dark mode"></sl-switch>
```

## API

See the [API reference](/api-reference/sl-switch) for all attributes and properties.
