---
title: Icon
layout: component
eleventyNavigation:
  key: Icon
  parent: Utilities
---

```html {.example .show-source}
<sl-icon name="far-gear"></sl-icon>
```

## Usage

`<sl-icon>` renders a single icon, either from Font Awesome or a custom icon coming from Figma.
Icons use `currentColor` by default, so they take the text color of their container.

The `name` attribute refers to an icon in the registry. Theme icons are registered automatically;
additional Font Awesome icons can be added with `Icon.register(...)`.

## Examples

### Sizes

Use the `size` attribute to choose from `2xs`, `xs`, `sm`, `md` (default), `lg`, `xl`, `2xl`, `3xl`
and `4xl`. By default the icon matches the surrounding font size.

```html {.example .show-source .horizontal}
<sl-icon name="far-gear" size="sm"></sl-icon>
<sl-icon name="far-gear" size="md"></sl-icon>
<sl-icon name="far-gear" size="lg"></sl-icon>
<sl-icon name="far-gear" size="xl"></sl-icon>
<sl-icon name="far-gear" size="2xl"></sl-icon>
```

### Color

Icons inherit the current text color, so you can style them with the `color` CSS property or the
`--sl-icon-fill-default` custom property.

```html {.example .show-source .horizontal}
<sl-icon name="far-rocket" style="color: var(--sl-color-foreground-accent-blue-bold)"></sl-icon>
<sl-icon name="far-trash" style="color: var(--sl-color-foreground-error-bold)"></sl-icon>
<sl-icon name="far-pen" style="color: var(--sl-color-foreground-success-bold)"></sl-icon>
```

### Styles

Many icons are available in multiple Font Awesome styles, selected through the name prefix — for
example `far-` (regular) and `fas-` (solid).

```html {.example .show-source .horizontal}
<sl-icon name="far-gear" size="xl"></sl-icon>
<sl-icon name="fas-gear" size="xl"></sl-icon>
```

## Accessibility

By default an icon is purely presentational and hidden from assistive technologies. When the icon
conveys meaning on its own, give it a `label` so it is announced.

```html {.example .show-source .horizontal}
<sl-icon name="far-trash" label="Delete"></sl-icon>
```

## API

See the [API reference](/api-reference/sl-icon) for all attributes and properties.
