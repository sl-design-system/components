# @sl-design-system/combobox

## 0.1.3

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- [#2067](https://github.com/sl-design-system/components/pull/2067) [`68ea3c8`](https://github.com/sl-design-system/components/commit/68ea3c849b07a3a9b4e5071447794ac658937e44) - Fixes issue that showed incorrect validity when using multiple mode and the field was required.

- Updated dependencies [[`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`0ce2293`](https://github.com/sl-design-system/components/commit/0ce22939899889ab60bdd387ff88a10fa9d7f84e), [`094e4c7`](https://github.com/sl-design-system/components/commit/094e4c7d9e975e7e7a2d28e80d1c6980786492da)]:
  - @sl-design-system/form@1.2.3
  - @sl-design-system/tag@0.1.5
  - @sl-design-system/text-field@1.6.4
  - @sl-design-system/listbox@0.1.3

## 0.1.2

### Patch Changes

- [#1869](https://github.com/sl-design-system/components/pull/1869) [`0b9a134`](https://github.com/sl-design-system/components/commit/0b9a134a6d1752f40245e72e9e01fc918b09a5a6) - Various fixes:
  - Fix the placeholder being visible in Safari when multiple values are selected
  - Fix resize observer loop on FF when it keeps toggling the stack visibility
- Updated dependencies [[`0db4860`](https://github.com/sl-design-system/components/commit/0db48604f9cbae73af25a08437a806dc7566273e), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`4b68034`](https://github.com/sl-design-system/components/commit/4b680344816bb1cefb66a6bc9fac7f9501f18ace), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/form@1.2.1
  - @sl-design-system/listbox@0.1.1
  - @sl-design-system/tag@0.1.1
  - @sl-design-system/text-field@1.6.2

## 0.1.1

### Patch Changes

- [#1833](https://github.com/sl-design-system/components/pull/1833) [`b37b9a2`](https://github.com/sl-design-system/components/commit/b37b9a26dd9b0b0fe2f412a08803e75168cc4f1c) - Combobox improvements:
  - Show hover style on combobox, similar to text-field
  - Remove create-custom-option when you select an option
  - Use built-in plus icon instead of importing it
  - Fix styling of `<sl-combobox-create-custom-option>`
  - Add hidden placeholder for the selected items when in multiple mode
  - Start keyboard navigation on the selected item when in single mode
  - Hide popover when the focus leaves the combobox
  - Reset the text to the selected option when focus leaves the combobox
  - Show the popover immediately and only fade-out when hiding it
- Updated dependencies [[`94ec687`](https://github.com/sl-design-system/components/commit/94ec687d8d37f12dd569c902dd777b965ae3a029), [`b37b9a2`](https://github.com/sl-design-system/components/commit/b37b9a26dd9b0b0fe2f412a08803e75168cc4f1c)]:
  - @sl-design-system/text-field@1.6.1

## 0.1.0

### Minor Changes

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Increase the padding for `md` from `32px` to `36px` and for `lg` from `40px` to `48px`.

- [#1791](https://github.com/sl-design-system/components/pull/1791) [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9) - Replace `--sl-size-borderWidth-subtle` with `--sl-size-borderWidth-default`

- [#1664](https://github.com/sl-design-system/components/pull/1664) [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb) - Use `--sl-size-borderWidth-subtle` instead of the old "default" token

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

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

- [#1642](https://github.com/sl-design-system/components/pull/1642) [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39) - Various combobox fixes:

  - Add `aria-owns` for linking the input to the listbox
  - Add `aria-posinset` and `aria-setsize` to the listbox options for virtual lists
  - Add focus style to tags
  - Remove `aria-current` from the listbox options (invalid usage of the attribute)
  - Improve keyboard navigation between the input and the tags using the left/right arrow keys
  - Fix the listbox popover not having the correct size on WebKit
  - Fix VoiceOver not announcing any option navigation after the first/last selection

- [#1813](https://github.com/sl-design-system/components/pull/1813) [`7b2fdc6`](https://github.com/sl-design-system/components/commit/7b2fdc6ee42af1b096b6f019b0f9e9daba5ed950) - Disable the stack tag when the combobox is disabled

- Updated dependencies [[`7b2fdc6`](https://github.com/sl-design-system/components/commit/7b2fdc6ee42af1b096b6f019b0f9e9daba5ed950), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`e68df34`](https://github.com/sl-design-system/components/commit/e68df344917a8d0bdc6a4c92f59079a247c6e7a9), [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`4e80437`](https://github.com/sl-design-system/components/commit/4e804374c3a02e88b04e4c1df662967740461f7c), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`a62dee4`](https://github.com/sl-design-system/components/commit/a62dee4a381450cca44c647a54d850290e5b0f11), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`99482e3`](https://github.com/sl-design-system/components/commit/99482e31dfee77fb99bf74a4fe325c3ccc08f6e6), [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd)]:
  - @sl-design-system/tag@0.1.0
  - @sl-design-system/text-field@1.6.0
  - @sl-design-system/form@1.2.0
  - @sl-design-system/listbox@0.1.0
  - @sl-design-system/icon@1.1.0

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
