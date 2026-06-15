---
title: Listbox
layout: component
eleventyNavigation:
  key: Listbox
  parent: Utilities
---

```html {.example .show-source}
<sl-listbox>
  <sl-option>Option 1</sl-option>
  <sl-option selected>Option 2</sl-option>
  <sl-option>Option 3</sl-option>
</sl-listbox>
```

## Usage

`<sl-listbox>` is a scrollable container for a list of selectable options. It is a low-level
building block used by components such as select and combobox, but it can also be used on its own
wherever you need a list of options.

Options are provided either as slotted `<sl-option>` (and `<sl-option-group>`) elements, or
declaratively through the `options` property for very large, data-driven lists.

## Examples

### Basic

Use `<sl-option>` for each item; add the `selected` attribute to mark the current selection and
`disabled` to make an option unavailable.

```html {.example .show-source}
<sl-listbox style="border: 1px solid var(--sl-color-border-plain); border-radius: var(--sl-size-borderRadius-default); max-block-size: 12rem;">
  <sl-option disabled>Option 1</sl-option>
  <sl-option selected>Option 2</sl-option>
  <sl-option>Option 3</sl-option>
</sl-listbox>
```

### Groups and dividers

Group related options with `<sl-option-group>`, and separate options with a horizontal rule.

```html {.example .show-source}
<sl-listbox style="border: 1px solid var(--sl-color-border-plain); border-radius: var(--sl-size-borderRadius-default); max-block-size: 16rem;">
  <sl-option-group label="Group 1">
    <sl-option>Option 1</sl-option>
    <sl-option>Option 2</sl-option>
  </sl-option-group>
  <sl-option>I am not in a group</sl-option>
  <hr />
  <sl-option-group label="Group 2">
    <sl-option>Option 3</sl-option>
    <sl-option>Option 4</sl-option>
  </sl-option-group>
</sl-listbox>
```

### Emphasis

Use the `emphasis` attribute (`subtle` or `bold`) to change how the selected option is highlighted.

```html {.example .show-source}
<sl-listbox emphasis="bold" style="border: 1px solid var(--sl-color-border-plain); border-radius: var(--sl-size-borderRadius-default); max-block-size: 12rem;">
  <sl-option>Option 1</sl-option>
  <sl-option selected>Option 2</sl-option>
  <sl-option>Option 3</sl-option>
</sl-listbox>
```

### Large, data-driven lists

For very large lists, pass an array to the `options` property instead of slotting elements. The
listbox virtualizes the options so only the visible ones are rendered. Use the `option*Path`
properties to tell the listbox how to read each item.

```html
<sl-listbox id="listbox"></sl-listbox>

<script type="module">
  const listbox = document.getElementById('listbox');

  listbox.optionLabelPath = 'label';
  listbox.optionValuePath = 'value';
  listbox.optionSelectedPath = 'selected';
  listbox.options = Array.from({ length: 10000 }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: i,
    selected: i === 0
  }));
</script>
```

## API

`<sl-listbox>` works together with `<sl-option>` and `<sl-option-group>`. See the
[source on GitHub](https://github.com/sl-design-system/components/tree/main/packages/components/listbox)
for the full API.
