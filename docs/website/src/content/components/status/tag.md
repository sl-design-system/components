---
title: Tag
layout: docs
eleventyNavigation:
  key: Tag
  parent: Status
---

`<sl-tag>` is a compact label that represents a keyword, filter or selection. Tags are often
removable, so users can clear individual selections. To show several tags together, use the
[tag list](/components/status/tag-list).

The tag's text goes in the default slot.

## Usage

```html
<sl-tag>Tag label</sl-tag>
```

## Examples

### Variants

The `variant` attribute switches between the `default` and `info` appearance.

```html {.example .show-source .horizontal}
<sl-tag>Default</sl-tag>
<sl-tag variant="info">Info</sl-tag>
```

### Sizes

Use the `size` attribute to choose `md` (default) or `lg`.

```html {.example .show-source .horizontal}
<sl-tag size="md">Medium</sl-tag>
<sl-tag size="lg">Large</sl-tag>
```

### Removable

Add the `removable` attribute to show a remove button. The tag emits an event when the user removes
it.

```html {.example .show-source .horizontal}
<sl-tag removable>Removable</sl-tag>
```

### Disabled

Add the `disabled` attribute to make a tag non-interactive.

```html {.example .show-source .horizontal}
<sl-tag disabled>Disabled</sl-tag>
<sl-tag disabled removable>Disabled</sl-tag>
```

## API

See the [API reference](/api-reference/sl-tag) for all attributes, properties and events.
