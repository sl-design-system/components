# @sanomalearning/slds-kampus

## 0.2.5

### Patch Changes

- [#2081](https://github.com/sl-design-system/components/pull/2081) [`604dc17`](https://github.com/sl-design-system/components/commit/604dc17be38f77fa099ffc890fcbe8f3768755a6) - Add new `ellipsis-vertical` icon

## 0.2.4

### Patch Changes

- [#1956](https://github.com/sl-design-system/components/pull/1956) [`0265764`](https://github.com/sl-design-system/components/commit/0265764ac709697377017147b065afc016187128) - Added new `size.700` primitive token.

- [#1965](https://github.com/sl-design-system/components/pull/1965) [`cae9352`](https://github.com/sl-design-system/components/commit/cae9352f9d9fef34ef29fec1a475d0e4225d69e3) - Tweak hover/pressed state colors

- Updated dependencies [[`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8)]:
  - @sl-design-system/icon@1.2.0

## 0.2.3

### Patch Changes

- [#1836](https://github.com/sl-design-system/components/pull/1836) [`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad) - Add missing `color` prefix to `blanket` token

- [#1933](https://github.com/sl-design-system/components/pull/1933) [`6072e05`](https://github.com/sl-design-system/components/commit/6072e05d3d8e2c928608071fcbd4cf6f21daf70c) - Add missing `selected - subtlest` tokens.

- [#1905](https://github.com/sl-design-system/components/pull/1905) [`cfcd262`](https://github.com/sl-design-system/components/commit/cfcd262dd65859170196af041f1f6bdceefaf4f5) - Refactored tooltip and popover to use new tokens

- [#1902](https://github.com/sl-design-system/components/pull/1902) [`c4c3ba2`](https://github.com/sl-design-system/components/commit/c4c3ba21ef185ff2fa08f7ed0f04dc17029c2d6b) - Improved contrast between selected and unselected toggle button

## 0.2.2

### Patch Changes

- [#1842](https://github.com/sl-design-system/components/pull/1842) [`b5c43d4`](https://github.com/sl-design-system/components/commit/b5c43d44a7d0ecebd9e72cdebd3a5c6ce56d2a70) - added global.css with global link styling

## 0.2.1

### Patch Changes

- [#1834](https://github.com/sl-design-system/components/pull/1834) [`584cc4e`](https://github.com/sl-design-system/components/commit/584cc4e50fa27d60c30e91b1c545fb81fb855f0f) - Fix missing contextual tokens in `css/base.css` and `css/<variant>.css` files

## 0.2.0

### Minor Changes

- [#1710](https://github.com/sl-design-system/components/pull/1710) [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e) - Overhaul of how (custom) icons are maintained in figma and exported to be used in the packages.

  The following icons have changed:

  - `circle` has been renamed to `circle-solid`

  The following icons have been added:

  - `badge-available`
  - `badge-away`
  - `badge-donotdisturb`
  - `badge-offline`
  - `error`
  - `info`

  The following items have been removed (mainly in cleaning up, they were never meant to be there)

  - `svg-sort`
  - `svg-sort-down`
  - `svg-sort-up`

- [#1607](https://github.com/sl-design-system/components/pull/1607) [`e184512`](https://github.com/sl-design-system/components/commit/e1845127a49819b7ab8d5a0a6a246576195cbe81) - Add new contextual tokens

  This adds new contextual tokens for all themes. The old tokens are still here and are still in use. When the old tokens are no longer used throughout the design system, they will be removed. If you are starting something new, please use the new contextual tokens.

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refine new contextual tokens further

### Patch Changes

- [#1497](https://github.com/sl-design-system/components/pull/1497) [`dd63dd8`](https://github.com/sl-design-system/components/commit/dd63dd88f83f81316dd133b2eb9383454dae0b2f) - New paginator tokens, new `ellipsis-down` icon.

- [#1710](https://github.com/sl-design-system/components/pull/1710) [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e) - Changed the Font Awesome style for outline icons to 'light' (instead of regular) so it better matches the custom icons.

- Updated dependencies [[`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee)]:
  - @sl-design-system/icon@1.1.0

## 0.1.17

### Patch Changes

- [#1524](https://github.com/sl-design-system/components/pull/1524) [`26f8251`](https://github.com/sl-design-system/components/commit/26f825194432eee04ca8c67869dcddc1781b565e) - Feature/1163 toggle group make available in all themes

- [#1488](https://github.com/sl-design-system/components/pull/1488) [`b724cf6`](https://github.com/sl-design-system/components/commit/b724cf629b28ee7afb85ccc072a4a07c8aa0e6bc) - Fixed several issues in toggle button and group that were cause by not using the correct tokens.
  Also fixed an issue that would cause the `calc()` function to be missing in certain tokens.

- [#1538](https://github.com/sl-design-system/components/pull/1538) [`7dc68cf`](https://github.com/sl-design-system/components/commit/7dc68cff7e5d4616d79cf9f313fe37477dc1fb1d) - Fix missing `px` unit in token that breaks calculation in checkbox

- [#1521](https://github.com/sl-design-system/components/pull/1521) [`7615d0e`](https://github.com/sl-design-system/components/commit/7615d0e3ebfddd733505a90a6ea9a39bcad25919) - Change the bottom padding of the field label

## 0.1.16

### Patch Changes

- [#1459](https://github.com/sl-design-system/components/pull/1459) [`ff8751a`](https://github.com/sl-design-system/components/commit/ff8751a79e3f1c0091eddbd702e706f8784dbb38) - Updated styling of tag component

## 0.1.15

### Patch Changes

- [#1484](https://github.com/sl-design-system/components/pull/1484) [`56ddcea`](https://github.com/sl-design-system/components/commit/56ddcea15cb6b9711b3735f60abe8a723ac831c0) - Added tokens for new avatar size: `4xl`

## 0.1.14

### Patch Changes

- [#1454](https://github.com/sl-design-system/components/pull/1454) [`af62ce4`](https://github.com/sl-design-system/components/commit/af62ce4d0e65b1363b9cede48642bc22d1fc9365) - - Improve toggle button and group tokens

  - Add a `check-solid` icon for use in the `toggle-button` component

- [#1414](https://github.com/sl-design-system/components/pull/1414) [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c) - Update icons to the latest fontawesome release (6.6.0)

- [#1422](https://github.com/sl-design-system/components/pull/1422) [`2833861`](https://github.com/sl-design-system/components/commit/28338611d0fccf175c3e22eb268fc5892522dc78) - Added first part of tag tokens

- Updated dependencies [[`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c)]:
  - @sl-design-system/icon@1.0.2

## 0.1.13

### Patch Changes

- [#1389](https://github.com/sl-design-system/components/pull/1389) [`f03971b`](https://github.com/sl-design-system/components/commit/f03971b7b338a4248df292060b91b6b903b6c8ed) - Minor style fixes:

  - Fix the title and subtitle text being cutoff for certain characters due not enough line-height
  - Use a different color for the subtitle text

- [#1395](https://github.com/sl-design-system/components/pull/1395) [`1647361`](https://github.com/sl-design-system/components/commit/1647361aba7af478745fc30a8067154debff0808) - Fixed issues where icons did not apply the color set on the parent element or in the `--sl-icon-fill-default` property

- [#1365](https://github.com/sl-design-system/components/pull/1365) [`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c) - Added tokens for toggle button and updated style for ghost button to match

- [#1392](https://github.com/sl-design-system/components/pull/1392) [`fdf3644`](https://github.com/sl-design-system/components/commit/fdf36446ce68afe58d10ace6706258a46c822579) - Add new tokens for message-dialog on mobile

- [#1377](https://github.com/sl-design-system/components/pull/1377) [`91a81b1`](https://github.com/sl-design-system/components/commit/91a81b1ceb72df0c7a1c149dc9a7b73aabd08fd0) - Added progress bar tokens

- Updated dependencies [[`1647361`](https://github.com/sl-design-system/components/commit/1647361aba7af478745fc30a8067154debff0808)]:
  - @sl-design-system/icon@1.0.1

## 0.1.12

### Patch Changes

- [#1374](https://github.com/sl-design-system/components/pull/1374) [`836d6d5`](https://github.com/sl-design-system/components/commit/836d6d54ff835b81378d996deb8bf6cb8a108b43) - Reduce dialog padding from 30px to 24px (and from 24px to 16px on mobile)

## 0.1.11

### Patch Changes

- [#1368](https://github.com/sl-design-system/components/pull/1368) [`ff1e558`](https://github.com/sl-design-system/components/commit/ff1e5585b2f30cf2c3cb8e8ad96e074ae3c49990) - Added `--sl-size-tab-indicator` token to `core.json`

## 0.1.10

### Patch Changes

- [#1323](https://github.com/sl-design-system/components/pull/1323) [`7053c6b`](https://github.com/sl-design-system/components/commit/7053c6b766a6254d852c2bba52ee4fc0a5020f4a) - Update badge tokens

## 0.1.9

### Patch Changes

- [#1251](https://github.com/sl-design-system/components/pull/1251) [`a3da76c`](https://github.com/sl-design-system/components/commit/a3da76c7df521c2241b565dc22025715f1231e9c) - New search icon

- [#1234](https://github.com/sl-design-system/components/pull/1234) [`fe047da`](https://github.com/sl-design-system/components/commit/fe047da265a3d657d74ee26df95ebd73f2d7ef7f) - - Enhanced the color contrast of buttons when used on slightly darker backgrounds across all themes.

  - Enhanced the color contrast of inline messages to match our buttons.

- [#1234](https://github.com/sl-design-system/components/pull/1234) [`fe047da`](https://github.com/sl-design-system/components/commit/fe047da265a3d657d74ee26df95ebd73f2d7ef7f) - Fix missing triangle-exclamation-solid icon

- Updated dependencies [[`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805)]:
  - @sl-design-system/icon@1.0.0

## 0.1.8

### Patch Changes

- [#1215](https://github.com/sl-design-system/components/pull/1215) [`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d) - Use circle-exclamation icon for form validation messages instead of triangle.

- [#1242](https://github.com/sl-design-system/components/pull/1242) [`ab122ec`](https://github.com/sl-design-system/components/commit/ab122ec672a515ae2ca7dce88c7344c1b209d538) - Fix missing `calc()` functions in theme parts.

- [#1225](https://github.com/sl-design-system/components/pull/1225) [`ad297ab`](https://github.com/sl-design-system/components/commit/ad297ab817ab998253b9c2a90033c72dcc686893) - Updated/added tokens:

  - Button bar available in all themes
  - Fixed accordion border
  - Button fixes
  - Dialog border radius fix

- [#1220](https://github.com/sl-design-system/components/pull/1220) [`a693012`](https://github.com/sl-design-system/components/commit/a693012020b5d4a07bdde5739ce19d0a020c27bb) - Change tokens related to moving the hint above the form-field:
  - Included hint colors tokens
  - Include hint font tokens in all themes
  - Fix token naming for hints
  - Fix label font sizing and spacing
  - Fix helper (validation message) fonts sizing and spacing
  - Fix field label (label & tag) fonts sizing in all themes
  - Fix helper (validation message) font sizes
  - Fix Magister font tokens for label and tags
  - Update MAX field label padding bottom to 4px and padding bottom lg to 8px in CORE
  - Change field label padding bottom to 8px (sm)
  - New gap form token (24px)

## 0.1.7

### Patch Changes

- [#1141](https://github.com/sl-design-system/components/pull/1141) [`d46ea29`](https://github.com/sl-design-system/components/commit/d46ea294dd5da531a1ff0a748961d2ed7551465b) - Updated button padding and background

- [#1107](https://github.com/sl-design-system/components/pull/1107) [`ee7d9f7`](https://github.com/sl-design-system/components/commit/ee7d9f79ced5d189c8d1a54055535211222c00d4) - Tokens changes - improved color contrast

- [#1092](https://github.com/sl-design-system/components/pull/1092) [`b4aeccc`](https://github.com/sl-design-system/components/commit/b4aeccc033b8827d1d0bfa80a410c3290bf9fb94) - Added breadcrumbs component

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/icon@0.0.10

## 0.1.6

### Patch Changes

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b), [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/icon@0.0.9

## 0.1.5

### Patch Changes

- [#988](https://github.com/sl-design-system/components/pull/988) [`33c28c7`](https://github.com/sl-design-system/components/commit/33c28c7ec1d8782610d6cd4c36a3b9c8c4d9e712) - Added tokens for card, spinner and skeleton

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/icon@0.0.8

## 0.1.4

### Patch Changes

- [#985](https://github.com/sl-design-system/components/pull/985) [`9c88751`](https://github.com/sl-design-system/components/commit/9c887516bacb0a335d8d2283e47d9a78f359a334) - Added tokens for Tab component

## 0.1.3

### Patch Changes

- [#921](https://github.com/sl-design-system/components/pull/921) [`31e6adb`](https://github.com/sl-design-system/components/commit/31e6adb4272490837d9adb4aec2343b960edd436) - Added missing tabs tokens

## 0.1.2

### Patch Changes

- [#883](https://github.com/sl-design-system/components/pull/883) [`b941f99`](https://github.com/sl-design-system/components/commit/b941f9943782a5a823bac0bf8433bb77c664e752) - Several small changes:
  - Hide subheader on horizontal orientation and size small.
  - Show tooltip with full name when name is truncated
  - Changed font size to improve readability
- Updated dependencies [[`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/icon@0.0.7

## 0.1.1

### Patch Changes

- [#892](https://github.com/sl-design-system/components/pull/892) [`c9c1395`](https://github.com/sl-design-system/components/commit/c9c1395c60eeb958dd25098e85c94818fac635bc) - removed focus state tokens, they are no longer used; the focusring is being used

## 0.1.0

### Minor Changes

- [#845](https://github.com/sl-design-system/components/pull/845) [`db815f7`](https://github.com/sl-design-system/components/commit/db815f7be2efe533d347c6508cc60a98dc459fd2) - Added dialog tokens, added inline message tokens, added badge tokens, theme fixing

- [#734](https://github.com/sl-design-system/components/pull/734) [`dd885e7`](https://github.com/sl-design-system/components/commit/dd885e7be09821cac9f66d60ef463017677703bc) - Added skeleton tokens

- [#860](https://github.com/sl-design-system/components/pull/860) [`25064d3`](https://github.com/sl-design-system/components/commit/25064d3adbcc324851768f1fe91637b98f2a702e) - Added tabs tokens

### Patch Changes

- [#853](https://github.com/sl-design-system/components/pull/853) [`555c301`](https://github.com/sl-design-system/components/commit/555c301f416a7a35dad4f167b21b91f0c735ce51) - Link button styling changes, link button tokens changes, itsLearning color values of solid button and focus ring changes

- [#792](https://github.com/sl-design-system/components/pull/792) [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f) - Added badge component, added smaller icon.

- [#835](https://github.com/sl-design-system/components/pull/835) [`3cb1452`](https://github.com/sl-design-system/components/commit/3cb1452546a717f475c628077301ce218165cb9e) - Linked to the correct custom icons page in Figma so some new/changed icons are available.

- [#857](https://github.com/sl-design-system/components/pull/857) [`f74c08c`](https://github.com/sl-design-system/components/commit/f74c08ce722574ec4b14b80f300340bc34fc3160) - Added spinner component

- Updated dependencies [[`a05db1d`](https://github.com/sl-design-system/components/commit/a05db1dcc19153ce0c843782c6d5aff46a992acf), [`bbf18f7`](https://github.com/sl-design-system/components/commit/bbf18f7453debffe8f3bebf096a0552b8df60500), [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f)]:
  - @sl-design-system/icon@0.0.6

## 0.0.10

### Patch Changes

- [#755](https://github.com/sl-design-system/components/pull/755) [`b657079`](https://github.com/sl-design-system/components/commit/b657079044ed53a9b49d4374a08bdc3a32179eeb) - Added tokens for popover

- [#748](https://github.com/sl-design-system/components/pull/748) [`3961d01`](https://github.com/sl-design-system/components/commit/3961d017961898dd5a2a951d31d4730d01e06bb9) - Added tokens for selectbox

- [#796](https://github.com/sl-design-system/components/pull/796) [`338f362`](https://github.com/sl-design-system/components/commit/338f3629828a9d9d833f510eb35e549257a0dabe) - popover font size changes

- [#724](https://github.com/sl-design-system/components/pull/724) [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d) - Added avatar + added token for focus ring offset

- Updated dependencies [[`4ca7b20`](https://github.com/sl-design-system/components/commit/4ca7b20ee7d09ee2ccfcf2743fd48f00a8207e39), [`4ca7b20`](https://github.com/sl-design-system/components/commit/4ca7b20ee7d09ee2ccfcf2743fd48f00a8207e39), [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82)]:
  - @sl-design-system/icon@0.0.5

## 0.0.9

### Patch Changes

- [#739](https://github.com/sl-design-system/components/pull/739) [`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0) - Fix for incorrect box shadow values

- [#723](https://github.com/sl-design-system/components/pull/723) [`dae8cd3`](https://github.com/sl-design-system/components/commit/dae8cd300a29df1f52eb0560bfc79574424e2b72) - Added tokens for Avatar component

- Updated dependencies [[`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0)]:
  - @sl-design-system/icon@0.0.4

## 0.0.8

### Patch Changes

- [#545](https://github.com/sl-design-system/components/pull/545) [`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448) - changed focus indicator to outline instead of box shadow

- [#641](https://github.com/sl-design-system/components/pull/641) [`0bee2dc`](https://github.com/sl-design-system/components/commit/0bee2dcaeff1b0648cfb2da397e7e8046007bea9) - added tokens for tooltip

- [#563](https://github.com/sl-design-system/components/pull/563) [`7fc4823`](https://github.com/sl-design-system/components/commit/7fc482392ab89ca8cb15f0c9254b6758f6171baa) - added tokens for size of the icon in the checkbox

## 0.0.7

### Patch Changes

- [#499](https://github.com/sl-design-system/components/pull/499) [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1) - Added tokens for select component.

- [#478](https://github.com/sl-design-system/components/pull/478) [`b9a0b33`](https://github.com/sl-design-system/components/commit/b9a0b338b4e4047dbd809e501c163fa97a39130e) - added textfield, text area and switch

## 0.0.6

### Patch Changes

- [#480](https://github.com/sl-design-system/components/pull/480) [`abb5964`](https://github.com/sl-design-system/components/commit/abb5964e20773add8d8f7a2837bb3fc84018f9ac) - Added tokens for select component.

## 0.0.5

### Patch Changes

- [#477](https://github.com/sl-design-system/components/pull/477) [`e4f0843`](https://github.com/sl-design-system/components/commit/e4f0843778230329aefe67d55e047e46ee9d188c) - Component finetuning

- [#496](https://github.com/sl-design-system/components/pull/496) [`cbab43b`](https://github.com/sl-design-system/components/commit/cbab43b434bd82ea4cacf490034960f554bccc28) - Fix missing types in theme packages

## 0.0.4

### Patch Changes

- [#420](https://github.com/sl-design-system/components/pull/420) [`81f448f`](https://github.com/sl-design-system/components/commit/81f448f5e00897ab4aac32961fe301f2657709a3) - Restructuring of tokens

## 0.0.3

### Patch Changes

- [#407](https://github.com/sl-design-system/components/pull/407) [`3da64be`](https://github.com/sl-design-system/components/commit/3da64be6a356b05ce8ff087f5ef9af15e85e7090) - Checkbox and radio button tokens added

- [#426](https://github.com/sl-design-system/components/pull/426) [`41663ef`](https://github.com/sl-design-system/components/commit/41663efecec6241a17aa262b4b8c7d52609f16dd) - Added a way to have custom icons on core SLDS level, so we can serve those along with FontAwesome tokens to all themes

- Updated dependencies [[`d0eae48`](https://github.com/sl-design-system/components/commit/d0eae48a112ec6c096ca6f3804cb248a390f04c8)]:
  - @sl-design-system/icon@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [[`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb)]:
  - @sl-design-system/icon@0.0.2

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`

- Updated dependencies [[`9391d10`](https://github.com/sl-design-system/components/commit/9391d109252e5038e7eae7d8b42e305a49ef8e9f), [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb)]:
  - @sl-design-system/icon@0.0.1

## 0.0.1

### Patch Changes

- [#326](https://github.com/sl-design-system/components/pull/326) [`22336cf`](https://github.com/sl-design-system/components/commit/22336cf0935399d3e50306e1a9cfcc0d1d2f8b5d) - Setup for FontAwesome and custom icons

- [#353](https://github.com/sl-design-system/components/pull/353) [`8d20cdb`](https://github.com/sl-design-system/components/commit/8d20cdbf6f0c592dd675767305de3191c6064798) - changed text_field to textField to avoid problems in figma, added tokens for text field and area

- [#357](https://github.com/sl-design-system/components/pull/357) [`ec9f239`](https://github.com/sl-design-system/components/commit/ec9f23992855782c948cdc6962c638522fbbfe54) - changed Kampus colours
