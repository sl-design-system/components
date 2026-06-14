---
title: Panel
layout: docs
eleventyNavigation:
  key: Panel
  parent: Layout
---

`<sl-panel>` is a container with a heading and an area for actions, used to group related content
into a labelled section. It can optionally be collapsed.

Set the heading with the `heading` attribute (or the `heading` slot for richer content), put the
content in the default slot, and place buttons in the `actions` slot.

## Usage

```html
<sl-panel heading="Panel heading">
  <sl-button fill="ghost" slot="actions" aria-label="Remove">
    <sl-icon name="far-trash"></sl-icon>
  </sl-button>
  Panel content goes here.
</sl-panel>
```

## Examples

### Basic

```html {.example .show-source}
<sl-panel heading="Panel heading">
  <sl-button fill="ghost" slot="actions" aria-label="Settings">
    <sl-icon name="far-gear"></sl-icon>
  </sl-button>
  Panel content goes here.
</sl-panel>
```

### Collapsible

Add `collapsible` to let the user expand and collapse the panel, and `collapsed` to have it start
collapsed.

```html {.example .show-source .vertical}
<sl-panel heading="Collapsible panel" collapsible>
  This panel can be collapsed by clicking its heading.
</sl-panel>
<sl-panel heading="Collapsed panel" collapsible collapsed>
  This panel starts collapsed.
</sl-panel>
```

### Prefix and suffix

Use the `prefix` and `suffix` slots to add content before or after the heading, such as an icon or a
badge.

```html {.example .show-source}
<sl-panel heading="With a prefix and suffix">
  <sl-icon slot="prefix" name="far-rocket"></sl-icon>
  <sl-badge slot="suffix" color="green">Active</sl-badge>
  Panel content goes here.
</sl-panel>
```

## API

See the [API reference](/api-reference/sl-panel) for all attributes, properties and slots.
