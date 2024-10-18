# @sl-design-system/tag

## 0.0.4

### Patch Changes

- [#1599](https://github.com/sl-design-system/components/pull/1599) [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b) - Various a11y related fixes

  `<sl-tag-list>`:

  - Use `aria-labelledby` for the tooltip instead of `aria-describedby`
  - Do not set an `aria-label` on the host element; `role="list"` provides enough information

  `<sl-tag>`:

  - Add ability to use Delete or Backspace keys to remove the tag
  - Use `aria-description` to describe how to remove the tag using the keyboard
  - Make the delete button have `aria-hidden="true"`
  - Remove `tabindex` from the `.wrapper` element in the shadow DOM

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`3ce1a3b`](https://github.com/sl-design-system/components/commit/3ce1a3b2c7c185ae6499b7dad22056d4de96a3a0), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/tooltip@1.1.1
  - @sl-design-system/shared@0.4.0

## 0.0.3

### Patch Changes

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - Fix tag list width calculation

- Updated dependencies [[`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d)]:
  - @sl-design-system/shared@0.3.2

## 0.0.2

### Patch Changes

- [#1484](https://github.com/sl-design-system/components/pull/1484) [`56ddcea`](https://github.com/sl-design-system/components/commit/56ddcea15cb6b9711b3735f60abe8a723ac831c0) - Fixed tag translations

## 0.0.1

### Patch Changes

- [#1422](https://github.com/sl-design-system/components/pull/1422) [`2833861`](https://github.com/sl-design-system/components/commit/28338611d0fccf175c3e22eb268fc5892522dc78) - Added tag and tag list component

- Updated dependencies [[`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`5c4063e`](https://github.com/sl-design-system/components/commit/5c4063ed63560ca3e07940492653d23a4ec009d8), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`3070e81`](https://github.com/sl-design-system/components/commit/3070e81b03ec83ef79149c84d3e5e7876b38591f), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/tooltip@1.1.0
  - @sl-design-system/shared@0.3.0
