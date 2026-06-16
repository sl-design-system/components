---
title: Badge
layout: component
eleventyNavigation:
  key: Badge
  parent: Status
---

```html {.example .show-source}
<sl-badge>Status</sl-badge>
```

## Usage

`<sl-badge>` is a small label used to highlight a status, category or count next to other content.
It draws attention to a short piece of information without taking up much space.

::: info
The `variant` attribute is deprecated. Use the `color` attribute instead — existing variants are
mapped to the matching color.
:::

## Examples

### Colors

Use the `color` attribute to convey meaning. Available colors are `blue`, `green`, `grey`,
`orange`, `purple`, `red`, `teal` and `yellow`.

```html {.example .show-source .horizontal}
<sl-badge color="blue">Blue</sl-badge>
<sl-badge color="green">Green</sl-badge>
<sl-badge color="grey">Grey</sl-badge>
<sl-badge color="orange">Orange</sl-badge>
<sl-badge color="purple">Purple</sl-badge>
<sl-badge color="red">Red</sl-badge>
<sl-badge color="teal">Teal</sl-badge>
<sl-badge color="yellow">Yellow</sl-badge>
```

### Emphasis

The `emphasis` attribute switches between a `subtle` (default) and a `bold` appearance.

```html {.example .show-source .horizontal}
<sl-badge color="green" emphasis="subtle">Subtle</sl-badge>
<sl-badge color="green" emphasis="bold">Bold</sl-badge>
```

### Sizes

Use the `size` attribute to pick `sm`, `md` or `lg`.

```html {.example .show-source .horizontal}
<sl-badge color="blue" size="sm">Small</sl-badge>
<sl-badge color="blue" size="md">Medium</sl-badge>
<sl-badge color="blue" size="lg">Large</sl-badge>
```

### Count and icon

A badge can also hold a number or a single icon, which makes it useful as a counter.

```html {.example .show-source .horizontal}
<sl-badge color="red" emphasis="bold">8</sl-badge>
<sl-badge color="green" emphasis="bold">
  <sl-icon name="check"></sl-icon>
</sl-badge>
<sl-badge color="blue" emphasis="bold">100</sl-badge>
```

## API

See the [API reference](/api-reference/sl-badge) for all attributes and properties.
