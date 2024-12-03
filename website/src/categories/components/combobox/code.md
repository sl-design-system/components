---
title: Combobox code
tags: code
APIdescription: {
  sl-combobox: "DESCRIPTION"
}
eleventyNavigation:
  parent: Combobox
  key: ComboboxCode
---

<section>

<div class="ds-example">

<sl-combobox multiple value='["0","3"]'>
  <sl-listbox>
    <sl-option-group label="Math">
      <sl-option value="0">Algebra</sl-option>
      <sl-option value="1">Geometry</sl-option>
      <sl-option value="2">Calculus</sl-option>
    </sl-option-group>
    <sl-option-group label="Languages">
      <sl-option value="3">English</sl-option>
      <sl-option value="4">German</sl-option>
      <sl-option value="5">French</sl-option>
      <sl-option value="6">Spanish</sl-option>
      <sl-option value="7">Chinese</sl-option>
    </sl-option-group>
  </sl-listbox>
</sl-combobox>

</div>

<div class="ds-code">

  ```html
  <sl-combobox multiple value='["0","1"]'>
    <sl-listbox>
      <sl-option-group label="Math">
        <sl-option value="0">Algebra</sl-option>
        <sl-option value="1">Geometry</sl-option>
        <sl-option value="2">Calculus</sl-option>
      </sl-option-group>
      <sl-option-group label="Languages">
        <sl-option value="3">English</sl-option>
        <sl-option value="4">German</sl-option>
        <sl-option value="5">French</sl-option>
        <sl-option value="6">Spanish</sl-option>
        <sl-option value="7">Chinese</sl-option>
      </sl-option-group>
    </sl-listbox>
  </sl-combobox>
  ```

</div>

</section>

<section>

## Listbox

Unlike the native `<select>` element, you have to wrap the options in an `sl-listbox` element. This is because the listbox needs to be associated with the `<input>` element of the embedded text field for accessibility purposes (`aria-controls`, `aria-expanded` and `aria-haspopup`). That can only be done if the listbox is in the same shadow root as the input.

If you are not rendering the options yourself (see below), the combobox component will automatically wrap the options in an `sl-listbox` element for you.

</section>

<section>

## Options

There are two ways you can define the options for the combobox:
1. By using the `sl-option` element inside the `sl-listbox` element yourself
2. By using the `options` property on the `sl-combobox` element

There is no difference in behavior of the combobox between the two methods.

### Using `sl-option` elements

Use this method if you have a small to medium number of options and you want to define them directly in your HTML.

```html
<sl-combobox>
  <sl-listbox>
    <sl-option value="0">Mathematics</sl-option>
    <sl-option value="1">Geography</sl-option>
    <sl-option value="2">Physics</sl-option>
    <sl-option value="3">History</sl-option>
  </sl-listbox>
</sl-combobox>
```

This is usually the simpler method, but it can become a performance issue if you have a large number of options (more than 100 options).

### Using the `options` property

Use this method if you have a large number of options. This method is more performant because it only renders the options that are currently visible. This method can be used with *thousands* of options, without any degradation in performance (this does not mean you should use the combobox component if you have thousands of options, but there are cases where the amount of options is determined by outside factors).

```js
const options = [
  { value: "0", label: "Mathematics" },
  { value: "1", label: "Geography" },
  { value: "2", label: "Physics" },
  { value: "3", label: "History" }
];
```

```html
<sl-combobox
  .options=${options}
  option-label-path="label"
  option-value-path="value"
></sl-combobox>
```

By using the `option-group-path`, `option-label-path`, `option-selected-path` and `option-value-path` properties, you can specify which properties on the option objects should be used to render the options.

If you only specify a string array as the `options` property, the combobox will use the strings as both the label and value.

</section>

<section>

## Grouping options

You can group options using the `sl-option-group` element. This element can contain `sl-option` elements. It is not recommended to have nested `sl-option-group` elements.

```html
<sl-combobox>
  <sl-listbox>
    <sl-option-group label="Math">
      <sl-option value="0">Algebra</sl-option>
      <sl-option value="1">Geometry</sl-option>
      <sl-option value="2">Calculus</sl-option>
   </sl-option-group>
    <sl-option-group label="Languages">
      <sl-option value="3">English</sl-option>
      <sl-option value="4">German</sl-option>
      <sl-option value="5">French</sl-option>
      <sl-option value="6">Spanish</sl-option>
      <sl-option value="7">Chinese</sl-option>
    </sl-option-group>
  </sl-listbox>
</sl-combobox>
```

If you are using the `options` property, you can group options by setting the `option-group-path` property. The component will automatically group options based on the value of the specified property. The value of the group property will be used to label the group.

```js
const options = [
  { value: "0", label: "Algebra", group: "Math" },
  { value: "1", label: "Geometry", group: "Math" },
  { value: "2", label: "Calculus", group: "Math" },
  { value: "3", label: "English", group: "Languages" },
  { value: "4", label: "German", group: "Languages" },
  { value: "5", label: "French", group: "Languages" },
  { value: "6", label: "Spanish", group: "Languages" },
  { value: "7", label: "Chinese", group: "Languages" }
];
```

```html
<sl-combobox
  .options=${options}
  option-group-path="group"
  option-label-path="label"
  option-value-path="value"
></sl-combobox>
```

</section>

<section>

## Selected

There are two ways you can set the selected options for the combobox:
1. By using the `value` property on the `sl-combobox` element
2. By using the `selected` property on the `sl-option` elements

It is sometimes easier to set the `selected` property since you are already rendering the options yourself. If you are not rendering the options yourself, you can specify the `group-selected-path` property instead.

In both cases you could also use the `value` property on the `sl-combobox` element to set the selected options.

Do not use both methods at the same time.

</section>

<ds-install-info link-in-navigation package="combobox"></ds-install-info>
{% include "../component-table.njk" %}
