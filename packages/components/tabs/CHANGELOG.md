# @sl-design-system/tabs

## 1.2.3

### Patch Changes

- [#2616](https://github.com/sl-design-system/components/pull/2616) [`dfb4ed6`](https://github.com/sl-design-system/components/commit/dfb4ed65687c54d8052faeae3243ba6ced8b0995) - Fixes selecting tab (and showing the selected tab) for Safari and Firefox (when zooming in/out as well).

## 1.2.2

### Patch Changes

- [#2481](https://github.com/sl-design-system/components/pull/2481) [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb) - Changed token used for the width of the focusring

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- [#2548](https://github.com/sl-design-system/components/pull/2548) [`5db3329`](https://github.com/sl-design-system/components/commit/5db33293ac0ac53dcb13c607a4df76500eca7141) - Fixed wrong token for bold font-weight

- Updated dependencies [[`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/menu@0.2.5
  - @sl-design-system/shared@0.9.0
  - @sl-design-system/icon@1.3.0

## 1.2.1

### Patch Changes

- [#2013](https://github.com/sl-design-system/components/pull/2013) [`03717fb`](https://github.com/sl-design-system/components/commit/03717fb7956b888ea04f4f2dc5334c1fc9ab7f34) - Fixes issue where the gradient overlay doesn't match the background color set on the tabs with a ::part(container) selector.

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/menu@0.2.4

## 1.2.0

### Minor Changes

- [#1985](https://github.com/sl-design-system/components/pull/1985) [`6d38852`](https://github.com/sl-design-system/components/commit/6d38852f320d63deb1bd43c431e7d8987f41e073) - The background color is no longer set on the whole tab component, but only for the tabs, for cases where the tab panels need to blend in with the background color of the containing page. The background-color of the tab panel wrapper can be set using `[part='panels'] `

### Patch Changes

- [#1991](https://github.com/sl-design-system/components/pull/1991) [`dab7775`](https://github.com/sl-design-system/components/commit/dab77759f328b5bfe679df2b0b3412e302abdebf) - Fixes triggering of `sl-tab` clicks when selecting `sl-menu-item` in the `sl-menu`. Also fixes triggering `[routerLink]` when selecting a tab from the menu.

- Updated dependencies [[`fc934eb`](https://github.com/sl-design-system/components/commit/fc934eba9f2049fda27d1e3f7c879789eea6254c)]:
  - @sl-design-system/shared@0.7.2

## 1.1.2

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/menu@0.2.2

## 1.1.1

### Patch Changes

- [#1856](https://github.com/sl-design-system/components/pull/1856) [`ba69c17`](https://github.com/sl-design-system/components/commit/ba69c17e206de8724c247ee52fd99158df62d230) - Fix triggering tabs from `sl-menu-button` with links (routerLink).

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/menu@0.2.1

## 1.1.0

### Minor Changes

- [#1791](https://github.com/sl-design-system/components/pull/1791) [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9) - Replace `--sl-size-borderWidth-subtle` with `--sl-size-borderWidth-default`

- [#1798](https://github.com/sl-design-system/components/pull/1798) [`99a9ad9`](https://github.com/sl-design-system/components/commit/99a9ad9503a6dcf1b92838e46aafd2f1c5d3dc58) - Tabs improvements

  Features:
  - Refactor styling to use new contextual tokens
  - Add activation property for auto or manual activation (see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
  - Simplify `<sl-tab>` styling using grid layout; makes the tab more flexible

  Fixes:
  - Scroll to the focused tab when using the keyboard
  - Make sure the selected tab is fully visible on initial render and doesn't smooth scroll
  - Fix bug where the RovingTabIndexController on `<sl-tab-group>` caused the inability to focus anything other than a tab
  - Fix bug where the `<a href>` could get focus when pressing TAB when the `<sl-tab>` had focus

### Patch Changes

- [#1637](https://github.com/sl-design-system/components/pull/1637) [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6) - Fix accessibility issues:
  - Fix NVDA accessibility issues: tab component with only one focusable element, that contains role and aria attributes
  - Fix keyboard navigation.
- Updated dependencies [[`67f5b81`](https://github.com/sl-design-system/components/commit/67f5b810558d124289f26e3cc3fb2c59da97bb5f), [`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39)]:
  - @sl-design-system/menu@0.2.0
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/icon@1.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/shared@0.4.0
  - @sl-design-system/menu@0.1.3

## 1.0.0

### Major Changes

- [#1535](https://github.com/sl-design-system/components/pull/1535) [`a11f679`](https://github.com/sl-design-system/components/commit/a11f679fc6ce89efccd852c69935494749199523) - Stable version release

### Patch Changes

- Updated dependencies [[`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d), [`563dccc`](https://github.com/sl-design-system/components/commit/563dccce29fc961ef46147c41a8f9f82bd2db384)]:
  - @sl-design-system/shared@0.3.2
  - @sl-design-system/menu@0.1.1

## 0.1.13

### Patch Changes

- Updated dependencies [[`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56), [`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/menu@0.1.0
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/shared@0.3.0

## 0.1.12

### Patch Changes

- [#1354](https://github.com/sl-design-system/components/pull/1354) [`07d4437`](https://github.com/sl-design-system/components/commit/07d443778cf46b80c0f89fb2e7fdc8d11b5c335a) - Various improvements:
  - Fix tab group to not always select a tab by default
  - Fix tab group component to allow for removing the selected attribute from a tab
  - Fade in the selected tab indicator on first selected tab
  - Change styling to account for icon-only tabs

- [#1353](https://github.com/sl-design-system/components/pull/1353) [`ab2a09b`](https://github.com/sl-design-system/components/commit/ab2a09ba9073f52c0c920d7eac4e38a02ee9c83f) - Fix unnecessary padding if there are no panels

## 0.1.11

### Patch Changes

- Updated dependencies [[`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805)]:
  - @sl-design-system/icon@1.0.0
  - @sl-design-system/menu@0.0.10

## 0.1.10

### Patch Changes

- [#1208](https://github.com/sl-design-system/components/pull/1208) [`b48b108`](https://github.com/sl-design-system/components/commit/b48b108c4873b6bbbea7636988a663f92c0ee242) - Improvements and bug fixes:
  - Add possibility of changing tab with URL by keyboard
  - Add missing background for `container` part: `--_tablist-background: var(--sl-color-tab-tabbar-background)`
  - Fix scrolling - only horizontally
  - Fix updating selected tab - tab only, not all elements with `selected` attribute inside

- [#994](https://github.com/sl-design-system/components/pull/994) [`4ae94ae`](https://github.com/sl-design-system/components/commit/4ae94aea4efb84f631b3d45faf76fbb32aed4a0f) - Fixing selecting tabs, when there are nested tabs.

- Updated dependencies [[`6dbe047`](https://github.com/sl-design-system/components/commit/6dbe047d690a069a16c1d96172accce6fa2980cb), [`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b)]:
  - @sl-design-system/menu@0.0.9
  - @sl-design-system/shared@0.2.11

## 0.1.9

### Patch Changes

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`9961697`](https://github.com/sl-design-system/components/commit/99616972eaef783779417d65c1b237dff801ad1f), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`9961697`](https://github.com/sl-design-system/components/commit/99616972eaef783779417d65c1b237dff801ad1f)]:
  - @sl-design-system/shared@0.2.10
  - @sl-design-system/icon@0.0.10
  - @sl-design-system/menu@0.0.8

## 0.1.8

### Patch Changes

- [#1086](https://github.com/sl-design-system/components/pull/1086) [`276fd1c`](https://github.com/sl-design-system/components/commit/276fd1ceab3d7054e6ade999245d74f86ff551be) - Fix size of active tab indicator with vertical orientation

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9
  - @sl-design-system/menu@0.0.7

## 0.1.7

### Patch Changes

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8
  - @sl-design-system/menu@0.0.6

## 0.1.6

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7
  - @sl-design-system/button@0.0.24

## 0.1.5

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b), [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/button@0.0.23
  - @sl-design-system/icon@0.0.9

## 0.1.4

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/shared@0.2.6
  - @sl-design-system/icon@0.0.8
  - @sl-design-system/button@0.0.22

## 0.1.3

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5
  - @sl-design-system/button@0.0.21

## 0.1.2

### Patch Changes

- [#985](https://github.com/sl-design-system/components/pull/985) [`9c88751`](https://github.com/sl-design-system/components/commit/9c887516bacb0a335d8d2283e47d9a78f359a334) - Missing fill for tab icon in the default state added

- [#985](https://github.com/sl-design-system/components/pull/985) [`9c88751`](https://github.com/sl-design-system/components/commit/9c887516bacb0a335d8d2283e47d9a78f359a334) - Added tokens for Tab component

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/shared@0.2.4
  - @sl-design-system/button@0.0.20

## 0.1.1

### Patch Changes

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3
  - @sl-design-system/button@0.0.19

## 0.1.0

### Minor Changes

- [#921](https://github.com/sl-design-system/components/pull/921) [`31e6adb`](https://github.com/sl-design-system/components/commit/31e6adb4272490837d9adb4aec2343b960edd436) - Added tabs component

## 0.0.16

### Patch Changes

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2

## 0.0.15

### Patch Changes

- Updated dependencies [[`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373)]:
  - @sl-design-system/shared@0.2.1

## 0.0.14

### Patch Changes

- [#790](https://github.com/sl-design-system/components/pull/790) [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82) - Upgrade to latest `@open-wc/scoped-elements` to track the standards spec

- Updated dependencies [[`198c7c2`](https://github.com/sl-design-system/components/commit/198c7c277787d48276d402522f94f2d0d5132152), [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d)]:
  - @sl-design-system/shared@0.2.0

## 0.0.13

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

- Updated dependencies [[`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0), [`199a2fc`](https://github.com/sl-design-system/components/commit/199a2fc0b3f0efb54c06429fd91fa09071b337de), [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0)]:
  - @sl-design-system/shared@0.1.9

## 0.0.12

### Patch Changes

- Updated dependencies [[`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448), [`5208fa3`](https://github.com/sl-design-system/components/commit/5208fa38b4d702f9939a2b6c19065bc7a6ffa2cb)]:
  - @sl-design-system/shared@0.1.8

## 0.0.11

### Patch Changes

- Updated dependencies [[`34696fb`](https://github.com/sl-design-system/components/commit/34696fb6c288a8c6101b7a5b80cef1240229a522)]:
  - @sl-design-system/shared@0.1.7

## 0.0.10

### Patch Changes

- Updated dependencies [[`c901f6c`](https://github.com/sl-design-system/components/commit/c901f6c5409367d19f2ced63c486f820af834faf), [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1), [`b9a0b33`](https://github.com/sl-design-system/components/commit/b9a0b338b4e4047dbd809e501c163fa97a39130e)]:
  - @sl-design-system/shared@0.1.6

## 0.0.9

### Patch Changes

- Updated dependencies [[`6f125e6`](https://github.com/sl-design-system/components/commit/6f125e6886f85fcfb8521e656f682e7385fe8aff)]:
  - @sl-design-system/shared@0.1.5

## 0.0.8

### Patch Changes

- Updated dependencies [[`46c49dd`](https://github.com/sl-design-system/components/commit/46c49dd2e281d7efbeed40c9ee1e22b44265bc1a)]:
  - @sl-design-system/shared@0.1.4

## 0.0.7

### Patch Changes

- Updated dependencies [[`13aa7e7`](https://github.com/sl-design-system/components/commit/13aa7e75e2f26262261dba498fde3412d4259939)]:
  - @sl-design-system/shared@0.1.3

## 0.0.6

### Patch Changes

- Updated dependencies [[`8a53d80`](https://github.com/sl-design-system/components/commit/8a53d800564073f7840a9f6365b234df3351c44f)]:
  - @sl-design-system/shared@0.1.2

## 0.0.5

### Patch Changes

- Updated dependencies [[`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb)]:
  - @sl-design-system/shared@0.1.1

## 0.0.4

### Patch Changes

- Updated dependencies [[`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17)]:
  - @sl-design-system/shared@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies [[`d45dbfa`](https://github.com/sl-design-system/components/commit/d45dbfa4289439cdfba237190dbf910478f282db)]:
  - @sl-design-system/shared@0.0.3

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

- Updated dependencies [[`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb)]:
  - @sl-design-system/shared@0.0.2

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`

- Updated dependencies [[`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb)]:
  - @sl-design-system/shared@0.0.1
