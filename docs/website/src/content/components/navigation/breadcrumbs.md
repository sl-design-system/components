---
title: Breadcrumbs
layout: docs
eleventyNavigation:
  key: Breadcrumbs
  parent: Navigation
---

`<sl-breadcrumbs>` shows the path to the current page and lets the user navigate back up the
hierarchy. By default it prepends a link to the home page.

Provide the trail as plain `<a>` elements in the default slot; the component adds the separators and,
on small screens, collapses the middle of the trail to save space.

## Usage

```html
<sl-breadcrumbs>
  <a href="/products">Products</a>
  <a href="/products/books">Books</a>
  <a href="/products/books/123">The Great Gatsby</a>
</sl-breadcrumbs>
```

## Examples

### Basic

A home link is shown first, followed by the breadcrumbs you provide.

```html {.example .show-source}
<sl-breadcrumbs>
  <a href="javascript:void(0)">Lorem</a>
  <a href="javascript:void(0)">Ipsum</a>
  <a href="javascript:void(0)">Dolor</a>
</sl-breadcrumbs>
```

### Without the home link

Add `no-home` to omit the automatic home link.

```html {.example .show-source}
<sl-breadcrumbs no-home>
  <a href="javascript:void(0)">Lorem</a>
  <a href="javascript:void(0)">Ipsum</a>
</sl-breadcrumbs>
```

### Hide the home label

Add `hide-home-label` to show only the home icon, without the "Home" text.

```html {.example .show-source}
<sl-breadcrumbs hide-home-label>
  <a href="javascript:void(0)">Lorem</a>
  <a href="javascript:void(0)">Ipsum</a>
</sl-breadcrumbs>
```

### Collapsing

When the trail is too long to fit, the middle items collapse behind a menu so the first and last
remain visible.

```html {.example .show-source}
<sl-breadcrumbs>
  <a href="javascript:void(0)">Lorem</a>
  <a href="javascript:void(0)">Ipsum</a>
  <a href="javascript:void(0)">Dolor</a>
  <a href="javascript:void(0)">Sit</a>
  <a href="javascript:void(0)">Amet</a>
  <a href="javascript:void(0)">Consectetur</a>
</sl-breadcrumbs>
```

### Inverted

Use the `inverted` attribute on dark backgrounds.

```html {.example .show-source}
<div style="background: var(--sl-color-palette-grey-900); padding: var(--sl-size-200);">
  <sl-breadcrumbs inverted>
    <a href="javascript:void(0)">Lorem</a>
    <a href="javascript:void(0)">Ipsum</a>
  </sl-breadcrumbs>
</div>
```

## API

See the [API reference](/api-reference/sl-breadcrumbs) for all attributes and properties.
