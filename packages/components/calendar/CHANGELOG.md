# @sl-design-system/calendar

## 0.0.10

### Patch Changes

- [#3381](https://github.com/sl-design-system/components/pull/3381) [`b40a00a`](https://github.com/sl-design-system/components/commit/b40a00a7d2987aebe11982476f5dd6f158eab3b1) - Accessibility improvements in calendar: improved keyboard navigation for select-month and select-year.

- [#3507](https://github.com/sl-design-system/components/pull/3507) [`3031653`](https://github.com/sl-design-system/components/commit/3031653700af857a00bc49770a36a52f72f3fcaf) - Fix focus management when selecting a year from the year view after opening it from the month view. Focus now returns to the active month selector instead of the hidden day selector, so keyboard users land on the first selectable month.

- Updated dependencies [[`ab43bd7`](https://github.com/sl-design-system/components/commit/ab43bd715bfb51b1a007bf2acb87e7061ae8ad19), [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340)]:
  - @sl-design-system/icon@1.4.3

## 0.0.9

### Patch Changes

- [#3448](https://github.com/sl-design-system/components/pull/3448) [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6) - Update `@open-wc/scoped-elements` due to typing fix

  This update fixes the export of the typings, which causes errors due to missing `override` keywords in the components. This is a patch update, as it only contains a fix for the export of the typings and does not introduce any breaking changes.

- Updated dependencies [[`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6), [`7f08962`](https://github.com/sl-design-system/components/commit/7f08962d1e7313a87b58729d64c88e283c686e68)]:
  - @sl-design-system/tooltip@2.0.1
  - @sl-design-system/button@2.1.1

## 0.0.8

### Patch Changes

- [#3361](https://github.com/sl-design-system/components/pull/3361) [`6882876`](https://github.com/sl-design-system/components/commit/6882876fb35019f2b69d30dadb23780d577bb591) - Fix accidental global `<sl-tooltip>` register

- Updated dependencies [[`78e7333`](https://github.com/sl-design-system/components/commit/78e733338fd67ef59797b3e02b22907fe0f5c638), [`7163d4e`](https://github.com/sl-design-system/components/commit/7163d4ee4cb47e4db591aceba2e3978f8f31b2c7), [`7163d4e`](https://github.com/sl-design-system/components/commit/7163d4ee4cb47e4db591aceba2e3978f8f31b2c7)]:
  - @sl-design-system/button@2.1.0

## 0.0.7

### Patch Changes

- [#3084](https://github.com/sl-design-system/components/pull/3084) [`a0cf57d`](https://github.com/sl-design-system/components/commit/a0cf57dc9617a8d484b89e6fe3b21770f4e0856e) - Align calendar and date-field spacing, padding and width behavior with the updated picker layout

- Updated dependencies [[`cf96680`](https://github.com/sl-design-system/components/commit/cf966804d9b39e98af54dbd6331c6a269e2da333), [`7156788`](https://github.com/sl-design-system/components/commit/71567885f818c1725916456bda135c08a8f7abef), [`53cdac2`](https://github.com/sl-design-system/components/commit/53cdac2ee98ebfe90587479a9c101c1e0d248c5b)]:
  - @sl-design-system/button@2.0.1
  - @sl-design-system/tooltip@2.0.0

## 0.0.6

### Patch Changes

- Updated dependencies [[`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538), [`b68dbc8`](https://github.com/sl-design-system/components/commit/b68dbc853697b015be8ab99a89c936dd627a9de4), [`7fe0989`](https://github.com/sl-design-system/components/commit/7fe09894e806c3817599e6b0e53b749a01111117)]:
  - @sl-design-system/button@2.0.0
  - @sl-design-system/tooltip@1.4.0
  - @sl-design-system/format-date@0.1.6

## 0.0.5

### Patch Changes

- [#3075](https://github.com/sl-design-system/components/pull/3075) [`6470631`](https://github.com/sl-design-system/components/commit/64706319468be7753a04742dd0d0920912076eec) - Added helper text when `min`, `max` or both are set, showing the allowed date range. The helper text is also linked to the focused button via `ariaDescribedByElements` to improve accessibility.

- [#3021](https://github.com/sl-design-system/components/pull/3021) [`192a51d`](https://github.com/sl-design-system/components/commit/192a51d63689cca9d91cdee60c7d4389905d8257) - Remove aria-selected attributes from grid cells

- [#3082](https://github.com/sl-design-system/components/pull/3082) [`3dd4bf8`](https://github.com/sl-design-system/components/commit/3dd4bf8c1f0fd0d94494f741e95ad8ddd5613fe4) - Fix bug where `showCurrent` wasn't set for select month & year

- [#3012](https://github.com/sl-design-system/components/pull/3012) [`2f8d8bf`](https://github.com/sl-design-system/components/commit/2f8d8bf32ca6e90eb9d117c1fcc434a59905769c) - Fix `autofocus` behavior

  This fix ensures that when a calendar is focused, it focuses the correct day. By default it will focus the current day, but if a date is already selected it will focus that one instead.

- [#2955](https://github.com/sl-design-system/components/pull/2955) [`ed7376b`](https://github.com/sl-design-system/components/commit/ed7376b4aa21c5df7d50119d839000abbab1cbcf) - Fix code formatting issues.

- Updated dependencies [[`a4a0c23`](https://github.com/sl-design-system/components/commit/a4a0c23a5341a2026c23e6e7fdf05cfdd44dc16c), [`716e305`](https://github.com/sl-design-system/components/commit/716e305a7cc5cbafb5dd97b16c9f70e4320d45e4), [`1eb362d`](https://github.com/sl-design-system/components/commit/1eb362dd94930ce7c1cf028f3cfa7a3eec903ab2), [`9e361f4`](https://github.com/sl-design-system/components/commit/9e361f40a25242652c3f7878851fbfd2a75c8f3d), [`330e06f`](https://github.com/sl-design-system/components/commit/330e06ff36c7a5c96cf313b60a5013d6307477c7), [`16de6e2`](https://github.com/sl-design-system/components/commit/16de6e28a36896904a0da7e6e72f0e859d5ed351)]:
  - @sl-design-system/button@1.3.4
  - @sl-design-system/tooltip@1.3.2
  - @sl-design-system/icon@1.4.2
  - @sl-design-system/format-date@0.1.5

## 0.0.4

### Patch Changes

- [#2636](https://github.com/sl-design-system/components/pull/2636) [`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d) - New version of the calendar component. Improved styling and accessibility.

- Updated dependencies []:
  - @sl-design-system/button@1.3.3
  - @sl-design-system/format-date@0.1.4
  - @sl-design-system/tooltip@1.3.1

## 0.0.3

### Patch Changes

- [#2481](https://github.com/sl-design-system/components/pull/2481) [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb) - Changed token used for the width of the focusring

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- [#2548](https://github.com/sl-design-system/components/pull/2548) [`5db3329`](https://github.com/sl-design-system/components/commit/5db33293ac0ac53dcb13c607a4df76500eca7141) - Fixed wrong token for bold font-weight

- Updated dependencies [[`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7)]:
  - @sl-design-system/button@1.2.5
  - @sl-design-system/icon@1.3.0
  - @sl-design-system/format-date@0.1.3

## 0.0.2

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- Updated dependencies []:
  - @sl-design-system/button@1.2.4
  - @sl-design-system/format-date@0.1.2

## 0.0.1

### Patch Changes

- [#1593](https://github.com/sl-design-system/components/pull/1593) [`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8) - New `<sl-calendar>` component:
  - Uses the `Intl` APIs for date formatting and localization
  - Supports quick navigation to different months and years
  - Supports swiping to navigate between months
  - Ability to customize rendering of days
  - Ability to change the first day of the week
  - Toggles for week numbers and highlighting today's date
  - Separate `<sl-month-view>` component for rendering individual months
- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36)]:
  - @sl-design-system/format-date@0.1.0
  - @sl-design-system/button@1.2.1
