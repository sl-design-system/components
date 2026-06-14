---
title: Tag list
layout: docs
eleventyNavigation:
  key: Tag list
  parent: Status
---

`<sl-tag-list>` displays a collection of [tags](/components/status/tag) together. It handles
overflow for you: tags that don't fit are collapsed behind a counter, and you can optionally stack
them to save space.

Place `<sl-tag>` elements in the default slot.

## Usage

```html
<sl-tag-list>
  <sl-tag>Tag 1</sl-tag>
  <sl-tag>Tag 2</sl-tag>
  <sl-tag>Tag 3</sl-tag>
</sl-tag-list>
```

## Examples

### Basic

When there are more tags than fit on a single line, the remainder is collapsed behind a counter.

```html {.example .show-source}
<sl-tag-list>
  <sl-tag>Design</sl-tag>
  <sl-tag>Development</sl-tag>
  <sl-tag>Research</sl-tag>
  <sl-tag>Accessibility</sl-tag>
  <sl-tag>Testing</sl-tag>
  <sl-tag>Documentation</sl-tag>
  <sl-tag>Localization</sl-tag>
</sl-tag-list>
```

### Variants and sizes

The `variant` (`neutral` or `info`) and `size` (`md` or `lg`) attributes apply to all tags in the
list.

```html {.example .show-source .vertical}
<sl-tag-list variant="info">
  <sl-tag>Info 1</sl-tag>
  <sl-tag>Info 2</sl-tag>
  <sl-tag>Info 3</sl-tag>
</sl-tag-list>
<sl-tag-list size="lg">
  <sl-tag>Large 1</sl-tag>
  <sl-tag>Large 2</sl-tag>
  <sl-tag>Large 3</sl-tag>
</sl-tag-list>
```

### Removable

Make the tags removable through the list.

```html {.example .show-source}
<sl-tag-list>
  <sl-tag removable>Design</sl-tag>
  <sl-tag removable>Development</sl-tag>
  <sl-tag removable>Research</sl-tag>
</sl-tag-list>
```

### Stacked

Add the `stacked` attribute to overlap the tags into a compact group with a counter.

```html {.example .show-source}
<sl-tag-list stacked>
  <sl-tag>Tag 1</sl-tag>
  <sl-tag>Tag 2</sl-tag>
  <sl-tag>Tag 3</sl-tag>
  <sl-tag>Tag 4</sl-tag>
  <sl-tag>Tag 5</sl-tag>
</sl-tag-list>
```

## API

See the [API reference](/api-reference/sl-tag-list) for all attributes and properties.
