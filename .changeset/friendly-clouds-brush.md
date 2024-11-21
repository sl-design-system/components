---
'@sl-design-system/combobox': patch
---

Add the ability to render the options using a virtual list:

You can already render the options yourself by doing

```html
<sl-combobox>
  <sl-listbox>
    <sl-option>Option 1</sl-option>
    <sl-option>Option 2</sl-option>
    <sl-option>Option 3</sl-option>
  </sl-listbox>
</sl-combobox>
```

But for large numbers of options, this can be slow. You can now use the `options` property to have the combobox render the options for you:

```html
<sl-combobox .options=${['Option 1', 'Option 2', 'Option 3', ...]}></sl-combobox>
```

You can customize the rendering of each option by using:
- `optionLabelPath` to specify the path to the label in each option object
- `optionValuePath` to specify the path to the value in each option object

You can also group the options by using `optionGroupPath`. This will group the options by the value of the property specified in `optionGroupPath`. The value is also used as the label for the group.

There is no difference how the options are rendered in the DOM. You can customize
the options in both scenarios by using the `sl-option { ... }` selector.
