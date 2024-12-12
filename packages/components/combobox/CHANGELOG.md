# @sl-design-system/combobox

## 0.1.0

### Minor Changes

- [#1664](https://github.com/sl-design-system/components/pull/1664) [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb) - Use `--sl-size-borderWidth-subtle` instead of the old "default" token

### Patch Changes

- [#1632](https://github.com/sl-design-system/components/pull/1632) [`e68df34`](https://github.com/sl-design-system/components/commit/e68df344917a8d0bdc6a4c92f59079a247c6e7a9) - Toggle the listbox when clicking the chevron button

- [#1632](https://github.com/sl-design-system/components/pull/1632) [`e68df34`](https://github.com/sl-design-system/components/commit/e68df344917a8d0bdc6a4c92f59079a247c6e7a9) - Add the ability to render the options using a virtual list:

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

- Updated dependencies [[`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`e68df34`](https://github.com/sl-design-system/components/commit/e68df344917a8d0bdc6a4c92f59079a247c6e7a9), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`99482e3`](https://github.com/sl-design-system/components/commit/99482e31dfee77fb99bf74a4fe325c3ccc08f6e6), [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd)]:
  - @sl-design-system/form@1.1.1
  - @sl-design-system/listbox@0.1.0
  - @sl-design-system/icon@1.0.3
  - @sl-design-system/text-field@1.5.1

## 0.0.3

### Patch Changes

- [#1599](https://github.com/sl-design-system/components/pull/1599) [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b) - Various a11y related fixes/improvements:

  - The label was associated with the `<sl-combobox>` element instead of the `<input>` element
  - `aria-selected="false"` was missing on the non-selected options
  - `aria-multiselectable="true"` was missing on the listbox when the multiple property is set
  - Add an `aria-label` to the `<sl-tag-list>` with value `"Selected options"`
  - Fix validation message not being translated
  - Remove Form Associated Custom Element code in favor of native form association with `<input>`

- [#1551](https://github.com/sl-design-system/components/pull/1551) [`99d6174`](https://github.com/sl-design-system/components/commit/99d6174945e6189125271d30a79028134c4ebeae) - Hide the placeholder when there is a selection in multiple mode

- [#1563](https://github.com/sl-design-system/components/pull/1563) [`ae44384`](https://github.com/sl-design-system/components/commit/ae44384129f1a787a82fd35262f3f24e0883df58) - Fix missing types in NPM package

- Updated dependencies [[`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6), [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6), [`ae44384`](https://github.com/sl-design-system/components/commit/ae44384129f1a787a82fd35262f3f24e0883df58)]:
  - @sl-design-system/text-field@1.5.0
  - @sl-design-system/tag@0.0.4
  - @sl-design-system/form@1.1.0
  - @sl-design-system/listbox@0.0.2

## 0.0.2

### Patch Changes

- [#1539](https://github.com/sl-design-system/components/pull/1539) [`48cd7d6`](https://github.com/sl-design-system/components/commit/48cd7d60f994fb9517b89c3c4d2d674c5491aa30) - Show a message when there are no filter matches

## 0.0.1

### Patch Changes

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - New `<sl-combobox>` component

- [#1536](https://github.com/sl-design-system/components/pull/1536) [`d79c397`](https://github.com/sl-design-system/components/commit/d79c3977b15cf55c8a83db94fc4ab98a1fe7e328) - Fix combobox, radio-group and select not focusing the form control when clicking the label

- Updated dependencies [[`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d), [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d), [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d), [`000723a`](https://github.com/sl-design-system/components/commit/000723a8e42cb468383fa0b968eb31a672b95e80), [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d)]:
  - @sl-design-system/text-field@1.4.0
  - @sl-design-system/listbox@0.0.1
  - @sl-design-system/form@1.0.4
  - @sl-design-system/tag@0.0.3
