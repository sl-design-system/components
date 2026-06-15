---
title: Search field
layout: component
eleventyNavigation:
  key: Search field
  parent: Form
---

```html {.example .show-source}
<sl-search-field aria-label="Search" placeholder="Search…"></sl-search-field>
```

## Usage

`<sl-search-field>` is a text input tailored for searching. It shows a magnifying-glass icon and a
clear button, and emits a debounced `sl-search` event as the user types (and immediately on Enter).

Always give the field an accessible name with `aria-label` (or a label via
[`<sl-form-field>`](/components/form/form-field)).

## Examples

### Basic

Type to see the clear button appear; clearing emits an `sl-clear` event.

```html {.example .show-source}
<sl-search-field aria-label="Search" placeholder="Search…"></sl-search-field>
```

### With a value

```html {.example .show-source}
<sl-search-field aria-label="Search" value="Design system"></sl-search-field>
```

### Custom icon

Override the default icon through the `prefix` slot.

```html {.example .show-source}
<sl-search-field aria-label="Search">
  <sl-icon slot="prefix" name="far-magnifying-glass"></sl-icon>
</sl-search-field>
```

### Disabled

```html {.example .show-source}
<sl-search-field aria-label="Search" placeholder="Search…" disabled></sl-search-field>
```

## Events

`sl-search`
: Emitted (debounced) as the user types, and immediately when Enter is pressed. The query string is
  in `event.detail`.

`sl-clear`
: Emitted when the field is cleared.

## API

See the [API reference](/api-reference/sl-search-field) for all attributes, properties and events.
