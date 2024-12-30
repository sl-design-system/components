# @sl-design-system/combobox

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
