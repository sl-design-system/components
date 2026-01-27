# @sl-design-system/date-field

## 0.0.5

### Patch Changes

- [#2636](https://github.com/sl-design-system/components/pull/2636) [`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d) - Make a date-field working with dates (not dates and hours).

- Updated dependencies [[`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d)]:
  - @sl-design-system/calendar@0.0.4
  - @sl-design-system/form@1.3.3
  - @sl-design-system/text-field@1.6.7

## 0.0.4

### Patch Changes

- [#2481](https://github.com/sl-design-system/components/pull/2481) [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb) - Changed token used for the width of the focusring

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- [#2331](https://github.com/sl-design-system/components/pull/2331) [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16) - Fixes the issue where pressing the `Escape` key inside the date picker (calendar) closes parent containers (such as dialogs).
  Prevents the Escape key event from bubbling up, so pressing Escape inside the date field does not close the dialog (or other parent container).
- Updated dependencies [[`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`5db3329`](https://github.com/sl-design-system/components/commit/5db33293ac0ac53dcb13c607a4df76500eca7141)]:
  - @sl-design-system/text-field@1.6.6
  - @sl-design-system/calendar@0.0.3
  - @sl-design-system/form@1.3.0
  - @sl-design-system/icon@1.3.0

## 0.0.3

### Patch Changes

- [#2131](https://github.com/sl-design-system/components/pull/2131) [`919f116`](https://github.com/sl-design-system/components/commit/919f1168712569c5022a4ad6840fbce692ce6ea0) - Fixes showing/removing invalid state for required validation.

- Updated dependencies [[`e973712`](https://github.com/sl-design-system/components/commit/e973712439e562714aa0dfe427f88288a8ab78eb), [`5748337`](https://github.com/sl-design-system/components/commit/574833761ff5d1965f21ded94c26f1ff42272420), [`7371487`](https://github.com/sl-design-system/components/commit/7371487bd75cfceca454c243d199c572378d726f), [`919f116`](https://github.com/sl-design-system/components/commit/919f1168712569c5022a4ad6840fbce692ce6ea0)]:
  - @sl-design-system/icon@1.2.1
  - @sl-design-system/form@1.2.4
  - @sl-design-system/text-field@1.6.5

## 0.0.2

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- Updated dependencies [[`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e)]:
  - @sl-design-system/calendar@0.0.2
  - @sl-design-system/form@1.2.3
  - @sl-design-system/text-field@1.6.4

## 0.0.1

### Patch Changes

- [#1593](https://github.com/sl-design-system/components/pull/1593) [`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8) - New `<sl-date-field>` component:
  - Uses the `Intl` APIs for date formatting and localization
  - Integrates with other form field components
  - Allows for custom date formatting
  - Supports `select-only` mode, which disables text editing
  - Reuses `<sl-calendar>` in the popover
- Updated dependencies [[`0db4860`](https://github.com/sl-design-system/components/commit/0db48604f9cbae73af25a08437a806dc7566273e), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/form@1.2.1
  - @sl-design-system/calendar@0.0.1
  - @sl-design-system/text-field@1.6.2
