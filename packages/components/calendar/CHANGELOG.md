# @sl-design-system/calendar

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
