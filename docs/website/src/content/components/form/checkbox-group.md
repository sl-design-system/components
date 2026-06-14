---
title: Checkbox group
layout: docs
eleventyNavigation:
  key: Checkbox group
  parent: Form
---

`<sl-checkbox-group>` groups several [checkboxes](/components/form/checkbox) so they are labelled and
validated together, and so their values are collected into a single array. Use it when the user can
select more than one option from a set.

Place `<sl-checkbox>` elements in the default slot, each with a `value`.

## Usage

```html
<sl-form-field label="Toppings">
  <sl-checkbox-group>
    <sl-checkbox value="cheese">Cheese</sl-checkbox>
    <sl-checkbox value="mushroom">Mushroom</sl-checkbox>
    <sl-checkbox value="pepperoni">Pepperoni</sl-checkbox>
  </sl-checkbox-group>
</sl-form-field>
```

## Examples

### Basic

```html {.example .show-source}
<sl-checkbox-group>
  <sl-checkbox value="0">Option 1</sl-checkbox>
  <sl-checkbox value="1">Option 2</sl-checkbox>
  <sl-checkbox value="2">Option 3</sl-checkbox>
  <sl-checkbox value="3" disabled>Option 4</sl-checkbox>
</sl-checkbox-group>
```

### Preselected values

Set the group's `value` to an array of the values that should be checked.

```html {.example .show-source}
<sl-checkbox-group id="cbg">
  <sl-checkbox value="0">Option 1</sl-checkbox>
  <sl-checkbox value="1">Option 2</sl-checkbox>
  <sl-checkbox value="2">Option 3</sl-checkbox>
</sl-checkbox-group>

<script type="module">
  document.getElementById('cbg').value = ['0', '2'];
</script>
```

### Required

Inside an `<sl-form>`, a required group needs at least one checked option.

```html {.example .show-source}
<sl-form>
  <sl-form-field label="Pick at least one">
    <sl-checkbox-group required>
      <sl-checkbox value="1">Option 1</sl-checkbox>
      <sl-checkbox value="2">Option 2</sl-checkbox>
      <sl-checkbox value="3">Option 3</sl-checkbox>
    </sl-checkbox-group>
  </sl-form-field>
</sl-form>
```

## API

See the [API reference](/api-reference/sl-checkbox-group) for all attributes and properties.
