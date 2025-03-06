# @sl-design-system/toggle-button

## 0.0.5

### Patch Changes

- [#1602](https://github.com/sl-design-system/components/pull/1602) [`6866dd0`](https://github.com/sl-design-system/components/commit/6866dd0f47f7decf2938e62edc8e3f6a865e6f6b) - Fixed toggling `text-only` attribute.

- [#1807](https://github.com/sl-design-system/components/pull/1807) [`b0ac221`](https://github.com/sl-design-system/components/commit/b0ac22130da66c4f1ce68bf008a4e22a456ea768) - Incorporate the new contextual tokens and add new options:

  - add size `sm`
  - add shape `pill` | `square`
  - changed fill `ghost` `to solid`

  Toggle button now defaults to `solid` instead of `outline` fill, to match the behaviour of the regular button.

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652)]:
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/icon@1.1.0
  - @sl-design-system/tooltip@1.1.2

## 0.0.4

### Patch Changes

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`3ce1a3b`](https://github.com/sl-design-system/components/commit/3ce1a3b2c7c185ae6499b7dad22056d4de96a3a0), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/tooltip@1.1.1
  - @sl-design-system/shared@0.4.0

## 0.0.3

### Patch Changes

- [#1488](https://github.com/sl-design-system/components/pull/1488) [`b724cf6`](https://github.com/sl-design-system/components/commit/b724cf629b28ee7afb85ccc072a4a07c8aa0e6bc) - Fixed several issues in toggle button and group that were cause by not using the correct tokens.
  Also fixed an issue that would cause the `calc()` function to be missing in certain tokens.
- Updated dependencies [[`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d)]:
  - @sl-design-system/shared@0.3.2

## 0.0.2

### Patch Changes

- [#1479](https://github.com/sl-design-system/components/pull/1479) [`5c4063e`](https://github.com/sl-design-system/components/commit/5c4063ed63560ca3e07940492653d23a4ec009d8) - Add proper tooltip cleanup

- [#1454](https://github.com/sl-design-system/components/pull/1454) [`af62ce4`](https://github.com/sl-design-system/components/commit/af62ce4d0e65b1363b9cede48642bc22d1fc9365) - Refactor and make ready for use in toggle-group

- Updated dependencies [[`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`5c4063e`](https://github.com/sl-design-system/components/commit/5c4063ed63560ca3e07940492653d23a4ec009d8), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`3070e81`](https://github.com/sl-design-system/components/commit/3070e81b03ec83ef79149c84d3e5e7876b38591f), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/tooltip@1.1.0
  - @sl-design-system/shared@0.3.0

## 0.0.1

### Patch Changes

- [#1365](https://github.com/sl-design-system/components/pull/1365) [`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c) - Added tokens for toggle button and updated style for ghost button to match

- [#1365](https://github.com/sl-design-system/components/pull/1365) [`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c) - Added toggle button component
