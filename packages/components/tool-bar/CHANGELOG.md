# @sl-design-system/tool-bar

## 0.3.0

### Minor Changes

- [#3477](https://github.com/sl-design-system/components/pull/3477) [`0dfc899`](https://github.com/sl-design-system/components/commit/0dfc899ea8a7596850cec225ff5c73362e7314ee) - Toolbar improvements:

  - Child buttons and menu-buttons inherit `fill`, and get `variant="inverted"` when the toolbar is `inverted`.
  - Buttons and menu-buttons inside the toolbar can now have different variants and fills mixed together.

  **Backwards compatibility:**
  Buttons and menu-buttons used in the toolbar that already have an explicit `fill` or `variant` attribute set will keep their own value — the toolbar only propagates these attributes to elements that don't have them set explicitly.
  Please check the updated Storybook examples for guidance on how to use the new features and updated [toolbar documentation](https://sanomalearning.design/categories/components/tool-bar/code/#fill-inheritance-and-variants).

### Patch Changes

- Updated dependencies [[`d5d17f8`](https://github.com/sl-design-system/components/commit/d5d17f8859fc663af83f6e2dd47286b87bd96a48), [`ab43bd7`](https://github.com/sl-design-system/components/commit/ab43bd715bfb51b1a007bf2acb87e7061ae8ad19), [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340)]:
  - @sl-design-system/menu@0.4.0
  - @sl-design-system/icon@1.4.3

## 0.2.5

### Patch Changes

- [#3383](https://github.com/sl-design-system/components/pull/3383) [`b19dbe7`](https://github.com/sl-design-system/components/commit/b19dbe7d6bffbf3f7e1373f4bcc5693b4352c3ba) - Expose `aria-disabled="true"` on disabled menu items so assistive technologies announce them as unavailable. Toolbar overflow menu items now preserve disabled semantics with `aria-disabled` instead of rendering hard-disabled menu items, keeping them reachable while preventing activation. Forwarded `ariaDisabled` now clears correctly through nested proxy targets

- [#3448](https://github.com/sl-design-system/components/pull/3448) [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6) - Update `@open-wc/scoped-elements` due to typing fix

  This update fixes the export of the typings, which causes errors due to missing `override` keywords in the components. This is a patch update, as it only contains a fix for the export of the typings and does not introduce any breaking changes.

- Updated dependencies [[`f2d2914`](https://github.com/sl-design-system/components/commit/f2d2914f4622de01b49e49b78abc17956e7438d3), [`db96be2`](https://github.com/sl-design-system/components/commit/db96be26709e837b1a4e3e6ea176b75c0823be2a), [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6), [`b19dbe7`](https://github.com/sl-design-system/components/commit/b19dbe7d6bffbf3f7e1373f4bcc5693b4352c3ba), [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6), [`7f08962`](https://github.com/sl-design-system/components/commit/7f08962d1e7313a87b58729d64c88e283c686e68)]:
  - @sl-design-system/menu@0.3.4
  - @sl-design-system/toggle-button@0.0.16
  - @sl-design-system/toggle-group@0.0.16
  - @sl-design-system/button@2.1.1

## 0.2.4

### Patch Changes

- [#3259](https://github.com/sl-design-system/components/pull/3259) [`e19736a`](https://github.com/sl-design-system/components/commit/e19736a4334f6b260c521da7b6f77da485468ddd) - Fix missing labels for `sl-menu-button` items rendered in the tool-bar overflow menu when mapping happens before ARIA forwarding is ready (e.g. nested slot scenarios such as Grid bulk actions).

  The overflow mapping now falls back from forwarded ARIA name/description to host `aria-labelledby` / `aria-label`, and finally to `slot="button"` text content, ensuring labels remain visible

- [#3241](https://github.com/sl-design-system/components/pull/3241) [`af5594c`](https://github.com/sl-design-system/components/commit/af5594c2bece0792652e17a7f5088532aacc9411) - Fix overflow behavior:

  - Refactor overflow logic to more accurately calculate visible items, reserve space for the menu button, and handle the menu button margin correctly when all items are hidden.
  - Update `tool-bar.ts` to use the new measurement utilities (`measureMenuButtonWidth` and `measureConstrainedWidth`) for more reliable overflow calculations.
  - Update toolbar styles to prevent layout shifts during measurement and ensure correct sizing in flexible containers.

- [#3265](https://github.com/sl-design-system/components/pull/3265) [`f7ad9c9`](https://github.com/sl-design-system/components/commit/f7ad9c907f7661a542889c7140e9161774d9dc86) - Fix a bug where `sl-menu-item` click handlers did not fire from the toolbar overflow menu.

  When a toolbar was collapsed, submenu actions originating from `sl-menu-button` were rendered in overflow but did not forward clicks to the original menu items. This change adds click proxying so selecting an overflow submenu item triggers the original item's click handler, restoring expected behavior in components such as Grid bulk actions.

- Updated dependencies [[`cf96680`](https://github.com/sl-design-system/components/commit/cf966804d9b39e98af54dbd6331c6a269e2da333), [`3e439d2`](https://github.com/sl-design-system/components/commit/3e439d24a4905b82143fe571e198e77375df7aa0)]:
  - @sl-design-system/button@2.0.1
  - @sl-design-system/menu@0.3.2
  - @sl-design-system/toggle-button@0.0.15
  - @sl-design-system/toggle-group@0.0.15

## 0.2.3

### Patch Changes

- Updated dependencies [[`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538), [`5773ea6`](https://github.com/sl-design-system/components/commit/5773ea6399073ba3f212b5fbfdbab3138b8d1894)]:
  - @sl-design-system/button@2.0.0
  - @sl-design-system/toggle-button@0.0.14
  - @sl-design-system/menu@0.3.1
  - @sl-design-system/toggle-group@0.0.14

## 0.2.2

### Patch Changes

- [#3022](https://github.com/sl-design-system/components/pull/3022) [`a4a0c23`](https://github.com/sl-design-system/components/commit/a4a0c23a5341a2026c23e6e7fdf05cfdd44dc16c) - Updates ToolBar disabled behavior to prefer aria-disabled for accessibility while preserving keyboard navigation and interaction semantics.
  ToolBar now sets/removes aria-disabled (instead of disabled) when the toolbar is disabled, and adjusts roving tabindex logic accordingly.
  ToolBarDivider now has aria-hidden="true" to prevent screen readers from announcing it as "blank".

- [#3001](https://github.com/sl-design-system/components/pull/3001) [`a7ac909`](https://github.com/sl-design-system/components/commit/a7ac90987881881bd0cb916c583e68c785b52622) - Improved the color contrast in the inverted toolbar by using the new elevation.surface.raised.primary token.

- Updated dependencies [[`a4a0c23`](https://github.com/sl-design-system/components/commit/a4a0c23a5341a2026c23e6e7fdf05cfdd44dc16c), [`86ea95d`](https://github.com/sl-design-system/components/commit/86ea95defd6ecf26eec20a46fd4545efd386951f), [`a7ac909`](https://github.com/sl-design-system/components/commit/a7ac90987881881bd0cb916c583e68c785b52622), [`a4a0c23`](https://github.com/sl-design-system/components/commit/a4a0c23a5341a2026c23e6e7fdf05cfdd44dc16c), [`fd4a0d7`](https://github.com/sl-design-system/components/commit/fd4a0d79b4c0d9a1438b437bc7a1122f03d08c11), [`9e361f4`](https://github.com/sl-design-system/components/commit/9e361f40a25242652c3f7878851fbfd2a75c8f3d), [`330e06f`](https://github.com/sl-design-system/components/commit/330e06ff36c7a5c96cf313b60a5013d6307477c7), [`1eb362d`](https://github.com/sl-design-system/components/commit/1eb362dd94930ce7c1cf028f3cfa7a3eec903ab2)]:
  - @sl-design-system/button@1.3.4
  - @sl-design-system/menu@0.3.0
  - @sl-design-system/icon@1.4.2
  - @sl-design-system/toggle-button@0.0.13
  - @sl-design-system/toggle-group@0.0.13

## 0.2.1

### Patch Changes

- Updated dependencies []:
  - @sl-design-system/button@1.3.3
  - @sl-design-system/menu@0.2.8
  - @sl-design-system/toggle-button@0.0.12
  - @sl-design-system/toggle-group@0.0.12

## 0.2.0

### Minor Changes

- [#2867](https://github.com/sl-design-system/components/pull/2867) [`198b92f`](https://github.com/sl-design-system/components/commit/198b92f8ef43283e9809b80e348e03ed45103fe9) - **Breaking Changes:**

  - Removed `fill` property - use `type` property instead. If you were using `fill="outline"`, change it to `type="outline"`. If you were using `fill="ghost"`, change it to `type="ghost"`.
  - Removed `no-border` property - border now only shows in `contained` variant (except when `inverted`).

  **New Features:**

  - Added `contained` property to enable contained mode
  - Added keyboard navigation support for arrow keys when toolbar is focused
  - Added `inverted` property to the divider component

  **Improvements:**

  - Improved overall styling and fixed overflow behavior issues

### Patch Changes

- [#2917](https://github.com/sl-design-system/components/pull/2917) [`73fbd20`](https://github.com/sl-design-system/components/commit/73fbd2021c53a4729d9bbe5dcb697c0449a33a75) - Reverted the breaking change from the previous version; the `fill` property is now supported again as it was in earlier versions.

## 0.1.2

### Patch Changes

- Updated dependencies [[`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`d807cb2`](https://github.com/sl-design-system/components/commit/d807cb22702dc5ac1399cf0528f9ceeeb1f09f60), [`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`ef77be3`](https://github.com/sl-design-system/components/commit/ef77be3c11c6811d2f220c898847bd351c657435)]:
  - @sl-design-system/toggle-button@0.0.11
  - @sl-design-system/icon@1.4.1
  - @sl-design-system/toggle-group@0.0.11
  - @sl-design-system/menu@0.2.7
  - @sl-design-system/button@1.3.2

## 0.1.1

### Patch Changes

- [#2757](https://github.com/sl-design-system/components/pull/2757) [`2af40f7`](https://github.com/sl-design-system/components/commit/2af40f78d9d0f07f3c15c1d9f7926ceca48f12f9) - Propagate the `aria-disabled` state to the overflow menu.

- [#2788](https://github.com/sl-design-system/components/pull/2788) [`55e879d`](https://github.com/sl-design-system/components/commit/55e879d6553fe93d5a811754d83edf79a2b18b6c) - Fix changes in the nested bulk actions slot in `<sl-grid>` not propagating to `<sl-tool-bar>`

  The bulk actions `<slot>` is nested in the default slot of `<sl-tool-bar>`. This means that changes to the bulk actions slot are not automatically observed by the tool-bar. To work around this, we explicitly call `refresh()` on the tool-bar when the bulk actions slot changes. `refresh()` will update the mapping of the tool-bar actions.

- Updated dependencies [[`d01fc71`](https://github.com/sl-design-system/components/commit/d01fc710e95210aa7c76b0fd68e849b988840dd9), [`1e7b6f6`](https://github.com/sl-design-system/components/commit/1e7b6f629f79d77576c2cb19d20f8884bb2f30c4)]:
  - @sl-design-system/button@1.3.1
  - @sl-design-system/icon@1.4.0

## 0.1.0

### Minor Changes

- [#2694](https://github.com/sl-design-system/components/pull/2694) [`9afb9ff`](https://github.com/sl-design-system/components/commit/9afb9fffc65bdeb70e85747ffb3ca6e2fdf14463) - Add support for `<sl-menu-button>`

- [#2667](https://github.com/sl-design-system/components/pull/2667) [`0964af6`](https://github.com/sl-design-system/components/commit/0964af6411a6a6175d4cf104ad2411c7ac71b33a) - Adds support for buttons with tooltips (connected via `aria-labelledby`) so they also work in the overflow menu.

### Patch Changes

- [#2674](https://github.com/sl-design-system/components/pull/2674) [`9b9a724`](https://github.com/sl-design-system/components/commit/9b9a72437620de637c42ec3884173cf7d25286b5) - Changed toolbar background to transparent so it can be used on any background color

- [#2690](https://github.com/sl-design-system/components/pull/2690) [`1603ff3`](https://github.com/sl-design-system/components/commit/1603ff3e291dc95100de65627d26dd45067f86d7) - Fix issue where changing disabled state of buttons wasn't reflected in the menu items.

- [#2646](https://github.com/sl-design-system/components/pull/2646) [`f025c0f`](https://github.com/sl-design-system/components/commit/f025c0f3cbb83b72c80563e9d989402608add193) - - Fix missing `aria-disabled="true"` support for buttons
  - Fix behavior due to `slotchange` events from nested slots
- Updated dependencies [[`659a92a`](https://github.com/sl-design-system/components/commit/659a92af4732d339f9830368b1e0e3bd48221714), [`bd0fa20`](https://github.com/sl-design-system/components/commit/bd0fa20294b989bab05e142f8f5346d3d919bbb3), [`f025c0f`](https://github.com/sl-design-system/components/commit/f025c0f3cbb83b72c80563e9d989402608add193), [`c76f3c8`](https://github.com/sl-design-system/components/commit/c76f3c86cc289be16bdf7ad4ec09baf910d67361), [`e2543df`](https://github.com/sl-design-system/components/commit/e2543df011b9d65b8e11a07323b3712f52859e0e)]:
  - @sl-design-system/menu@0.2.6
  - @sl-design-system/button@1.3.0
  - @sl-design-system/toggle-button@0.0.10
  - @sl-design-system/icon@1.3.1
  - @sl-design-system/toggle-group@0.0.10

## 0.0.11

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- Updated dependencies [[`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16), [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9)]:
  - @sl-design-system/button@1.2.5
  - @sl-design-system/menu@0.2.5
  - @sl-design-system/toggle-button@0.0.9
  - @sl-design-system/toggle-group@0.0.9
  - @sl-design-system/icon@1.3.0

## 0.0.10

### Patch Changes

- [#2091](https://github.com/sl-design-system/components/pull/2091) [`0fd9ced`](https://github.com/sl-design-system/components/commit/0fd9ced50957e6afee406b2557705fc0ccc886d5) - Fix focus outline clipping when aligned to the end

## 0.0.9

### Patch Changes

- [#2081](https://github.com/sl-design-system/components/pull/2081) [`604dc17`](https://github.com/sl-design-system/components/commit/604dc17be38f77fa099ffc890fcbe8f3768755a6) - Various improvements:

  - Add `ellipsis-vertical` icon to the icon set
  - Add `inverted` boolean property so the menu button can be inverted
  - Fix overflow calculation so we never have an unnecessary menu button
  - Fix 1 too many horizontal divider in the menu
  - Fix missing menu item label for icon only buttons with tooltip

- [#1998](https://github.com/sl-design-system/components/pull/1998) [`4943f52`](https://github.com/sl-design-system/components/commit/4943f5217ec0d2ba4a1902c2841daa729b6426bd) - Fixes incorrect margin when menu button is visible

- [#1975](https://github.com/sl-design-system/components/pull/1975) [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664) - Improve styling for use within grid

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- [#2034](https://github.com/sl-design-system/components/pull/2034) [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0) - Fix console warning when an `<sl-tooltip>` is slotted

- Updated dependencies []:
  - @sl-design-system/button@1.2.4
  - @sl-design-system/menu@0.2.4
  - @sl-design-system/toggle-button@0.0.8
  - @sl-design-system/toggle-group@0.0.8

## 0.0.8

### Patch Changes

- [#1956](https://github.com/sl-design-system/components/pull/1956) [`0265764`](https://github.com/sl-design-system/components/commit/0265764ac709697377017147b065afc016187128) - Added `fill` that can be used for the `menu-button`, some styling improvements.

- Updated dependencies [[`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8), [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8)]:
  - @sl-design-system/icon@1.2.0
  - @sl-design-system/menu@0.2.3

## 0.0.7

### Patch Changes

- Updated dependencies [[`c4c3ba2`](https://github.com/sl-design-system/components/commit/c4c3ba21ef185ff2fa08f7ed0f04dc17029c2d6b)]:
  - @sl-design-system/toggle-button@0.0.7
  - @sl-design-system/button@1.2.2
  - @sl-design-system/menu@0.2.2
  - @sl-design-system/toggle-group@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @sl-design-system/button@1.2.1
  - @sl-design-system/menu@0.2.1
  - @sl-design-system/toggle-button@0.0.6
  - @sl-design-system/toggle-group@0.0.6

## 0.0.5

### Patch Changes

- [#1688](https://github.com/sl-design-system/components/pull/1688) [`168ac9f`](https://github.com/sl-design-system/components/commit/168ac9f449f4f4094d807fd29810a853f987a2f8) - - Improved wrapping,
  - Added `aria-label` to the `sl-menu-button`.
- Updated dependencies [[`67f5b81`](https://github.com/sl-design-system/components/commit/67f5b810558d124289f26e3cc3fb2c59da97bb5f), [`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`6866dd0`](https://github.com/sl-design-system/components/commit/6866dd0f47f7decf2938e62edc8e3f6a865e6f6b), [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`b0ac221`](https://github.com/sl-design-system/components/commit/b0ac22130da66c4f1ce68bf008a4e22a456ea768), [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39)]:
  - @sl-design-system/menu@0.2.0
  - @sl-design-system/button@1.2.0
  - @sl-design-system/icon@1.1.0
  - @sl-design-system/toggle-button@0.0.5
  - @sl-design-system/toggle-group@0.0.5

## 0.0.4

### Patch Changes

- [#1563](https://github.com/sl-design-system/components/pull/1563) [`ae44384`](https://github.com/sl-design-system/components/commit/ae44384129f1a787a82fd35262f3f24e0883df58) - Fix missing types in NPM package

- Updated dependencies [[`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/button@1.1.0
  - @sl-design-system/menu@0.1.3
  - @sl-design-system/toggle-button@0.0.4
  - @sl-design-system/toggle-group@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies [[`563dccc`](https://github.com/sl-design-system/components/commit/563dccce29fc961ef46147c41a8f9f82bd2db384), [`26f8251`](https://github.com/sl-design-system/components/commit/26f825194432eee04ca8c67869dcddc1781b565e), [`b724cf6`](https://github.com/sl-design-system/components/commit/b724cf629b28ee7afb85ccc072a4a07c8aa0e6bc)]:
  - @sl-design-system/menu@0.1.1
  - @sl-design-system/toggle-group@0.0.3
  - @sl-design-system/toggle-button@0.0.3

## 0.0.2

### Patch Changes

- [#1454](https://github.com/sl-design-system/components/pull/1454) [`af62ce4`](https://github.com/sl-design-system/components/commit/af62ce4d0e65b1363b9cede48642bc22d1fc9365) - Adjust for button-group -> toggle-group renaming

- Updated dependencies [[`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56), [`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`5c4063e`](https://github.com/sl-design-system/components/commit/5c4063ed63560ca3e07940492653d23a4ec009d8), [`347418f`](https://github.com/sl-design-system/components/commit/347418fa98477365f5bc0aef1c70c9da4579f2a4), [`af62ce4`](https://github.com/sl-design-system/components/commit/af62ce4d0e65b1363b9cede48642bc22d1fc9365), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`af62ce4`](https://github.com/sl-design-system/components/commit/af62ce4d0e65b1363b9cede48642bc22d1fc9365)]:
  - @sl-design-system/menu@0.1.0
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/toggle-button@0.0.2
  - @sl-design-system/button@1.0.3
  - @sl-design-system/toggle-group@0.0.2

## 0.0.1

### Patch Changes

- [#1416](https://github.com/sl-design-system/components/pull/1416) [`63ac9a9`](https://github.com/sl-design-system/components/commit/63ac9a93d3e339878f9da819e52ff1e1c3a66e59) - New tool-bar component

- Updated dependencies [[`b8c611a`](https://github.com/sl-design-system/components/commit/b8c611a2c48f6b3b175080183075e64bcf364a6e), [`1647361`](https://github.com/sl-design-system/components/commit/1647361aba7af478745fc30a8067154debff0808), [`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c), [`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c)]:
  - @sl-design-system/button-group@0.0.1
  - @sl-design-system/icon@1.0.1
  - @sl-design-system/toggle-button@0.0.1
  - @sl-design-system/button@1.0.2
