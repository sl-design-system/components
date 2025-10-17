import { css } from 'lit';

export default css`
  /**
   * Copyright 2025 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */

  /**
   * Copyright 2025 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */

  /**
   * Copyright 2025 Sanoma Learning
   * SPDX-License-Identifier: Apache-2.0
   */
  :host {
    --sl-icon-core-fav: star; /** icon.core.fav */
    --sl-icon-core-menu: bars; /** icon.core.menu */
    --sl-icon-core-plus: plus; /** icon.core.plus */
    --sl-icon-core-check: check; /** icon.core.check */
    --sl-icon-core-clock: clock; /** icon.core.clock */
    --sl-icon-core-minus: minus; /** icon.core.minus */
    --sl-icon-core-xmark: xmark; /** icon.core.xmark */
    --sl-icon-core-pinata: pinata; /** icon.core.pinata */
    --sl-icon-core-search: magnifying-glass; /** icon.core.search */
    --sl-icon-core-calendar: calendar; /** icon.core.calendar */
    --sl-icon-core-ellipsis: ellipsis; /** icon.core.ellipsis */
    --sl-icon-core-angle-down: angle-down; /** icon.core.angle-down */
    --sl-icon-core-dash-solid: dash; /** icon.core.dash-solid */
    --sl-icon-core-face-smile: face-smile; /** icon.core.face-smile */
    --sl-icon-core-grip-lines: grip-lines; /** icon.core.grip-lines */
    --sl-icon-core-home-blank: home-blank; /** icon.core.home-blank */
    --sl-icon-core-check-solid: check; /** icon.core.check-solid */
    --sl-icon-core-chevron-down: chevron-down; /** icon.core.chevron-down */
    --sl-icon-core-chevron-left: chevron-left; /** icon.core.chevron-left */
    --sl-icon-core-circle-solid: circle; /** icon.core.circle */
    --sl-icon-core-circle-xmark: circle-xmark; /** icon.core.circle-xmark */
    --sl-icon-core-pinata-solid: pinata; /** icon.core.pinata */
    --sl-icon-core-chevron-right: chevron-right; /** icon.core.chevron-right */
    --sl-icon-core-caret-down-solid: caret-down; /** icon.core.caret-down-solid */
    --sl-icon-core-caret-left-solid: caret-left; /** icon.core.caret-left-solid */
    --sl-icon-core-caret-right-solid: caret-right; /** icon.core.caret-right-solid */
    --sl-icon-core-ellipsis-vertical: ellipsis-vertical; /** icon.core.ellipsis-vertical */
    --sl-icon-core-circle-check-solid: circle-check; /** icon.core.circle-check-solid */
    --sl-icon-core-circle-xmark-solid: circle-xmark; /** icon.core.circle-xmark-solid */
    --sl-icon-core-breadcrumb-separator: slash-forward; /** icon.core.breadcrumb-separator */
    --sl-icon-core-circle-exclamation-solid: circle-exclamation; /** icon.core.circle-exclamation-solid */
    --sl-icon-core-diamond-exclamation-solid: diamond-exclamation; /** icon.core.diamond-exclamation-solid */
    --sl-icon-core-octagon-exclamation-solid: octagon-exclamation; /** icon.core.octagon-exclamation-solid */
    --sl-icon-core-triangle-exclamation-solid: triangle-exclamation; /** icon.core.triangle-exclamation-solid */
    --sl-icon-typeset-font-size-2xs: 10px; /** icon.typeset.fontSize.xs */
    --sl-icon-typeset-fontFamily-sharp: font-awesome-7-sharp;
    --sl-icon-typeset-fontFamily-classic: font-awesome-7-pro;
    --sl-icon-typeset-fontWeight-icon-thin: 100;
    --sl-icon-typeset-fontWeight-icon-light: 300;
    --sl-icon-typeset-fontWeight-icon-solid: solid;
    --sl-icon-typeset-fontWeight-icon-regular: 400;
    --sl-icon-font-family-sharp: font-awesome-6-sharp;
    --sl-icon-font-family-classic: font-awesome-6-pro;
    --sl-size-100: 8px;
    --sl-size-125: 10px;
    --sl-size-150: 12px;
    --sl-size-175: 14px;
    --sl-size-200: 16px;
    --sl-size-250: 20px;
    --sl-size-300: 24px;
    --sl-size-350: 28px;
    --sl-size-400: 32px;
    --sl-size-450: 36px;
    --sl-size-500: 40px;
    --sl-size-600: 48px;
    --sl-size-700: 56px;
    --sl-size-800: 64px;
    --sl-size-1000: 80px;
    --sl-size-lg: 20px; /** size.lg */
    --sl-size-md: 16px; /** size.md */
    --sl-size-sm: 14px; /** size.sm */
    --sl-size-xl: 24px; /** size.xl */
    --sl-size-xs: 12px; /** size.xs */
    --sl-size-2xl: 32px; /** size.2xl */
    --sl-size-2xs: 8px; /** size.2xs */
    --sl-size-3xl: 48px; /** size.3xl */
    --sl-size-3xs: 4px; /** size.3xs */
    --sl-size-4xl: 64px; /** size.4xl */
    --sl-size-4xs: 2px; /** size.4xs */
    --sl-size-icon-2xs: 10px;
    --sl-size-icon-3xs: 5px;
    --sl-size-none: 0px;
    --sl-size-avatar-lg: 40px;
    --sl-size-avatar-xl: 52px;
    --sl-size-avatar-3xl: 80px;
    --sl-size-avatar-4xl: 160px;
    --sl-size-dialog-max: 960px; /** size.input.lg */
    --sl-size-dialog-min: 400px; /** size.input.md */
    --sl-size-dialog-full: 100%; /** size.input.lg */
    --sl-size-dialog-message-mobile-min: 300px; /** size.input.md */
    --sl-size-paginator-select-min-width: 80px; /** we are using a raw value, needs to be changed to a token in the future */
    --sl-size-paginator-page-button-min-width: 40px; /** we are using a raw value, needs to be changed to a token in the future */
    --sl-size-010: 1px;
    --sl-size-025: 2px;
    --sl-size-050: 4px;
    --sl-size-075: 6px;
    --sl-size-full: 50rem;
    --sl-size-tabbar-vertical-maxwidth: 200px;
    --sl-size-accordion-icon-height: 28px;
    --sl-text-typeset-font-size-lg: 16px; /** text.typeset.fontSize.lg */
    --sl-text-typeset-font-size-md: 14px; /** text.typeset.fontSize.md */
    --sl-text-typeset-font-size-sm: 12px; /** text.typeset.fontSize.sm */
    --sl-text-typeset-font-size-xl: 18px; /** text.typeset.fontSize.xl */
    --sl-text-typeset-font-size-xs: 10px; /** text.typeset.fontSize.xs */
    --sl-text-typeset-font-size-2xl: 24px; /** text.typeset.fontSize.2xl */
    --sl-text-typeset-font-size-3xl: 32px; /** text.typeset.fontSize.3xl */
    --sl-text-typeset-font-size-4xl: 48px; /** text.typeset.fontSize.4xl */
    --sl-text-typeset-font-size-5xl: 54px; /** text.typeset.fontSize.5xl */
    --sl-text-typeset-text-case-none: none; /** text.typeset.textCase.none */
    --sl-text-typeset-text-case-lowercase: lowercase; /** text.typeset.textCase.lowercase */
    --sl-text-typeset-text-case-uppercase: uppercase; /** text.typeset.textCase.uppercase */
    --sl-text-typeset-text-case-capitalize: capitalize; /** text.typeset.textCase.capitalize */
    --sl-text-typeset-font-family-body: roboto; /** text.typeset.fontFamily.body */
    --sl-text-typeset-font-family-heading: roboto; /** text.typeset.fontFamily.heading */
    --sl-text-typeset-font-weight-bold: 700; /** text.typeset.fontWeight.bold */
    --sl-text-typeset-font-weight-regular: 400; /** text.typeset.fontWeight.regular */
    --sl-text-typeset-font-weight-demibold: 600;
    --sl-text-typeset-font-weight-icon-thin: 100; /** text.typeset.fontWeight.icon-thin */
    --sl-text-typeset-font-weight-icon-light: 300; /** text.typeset.fontWeight.icon-light */
    --sl-text-typeset-font-weight-icon-solid: solid; /** text.typeset.fontWeight.icon-solid */
    --sl-text-typeset-font-weight-icon-regular: 400; /** text.typeset.fontWeight.icon-regular */
    --sl-text-typeset-line-height-lg: 24px; /** text.typeset.lineHeight.lg */
    --sl-text-typeset-line-height-md: 20px; /** text.typeset.lineHeight.md */
    --sl-text-typeset-line-height-sm: 16px; /** text.typeset.lineHeight.sm */
    --sl-text-typeset-line-height-xl: 28px; /** text.typeset.lineHeight.xl */
    --sl-text-typeset-line-height-xs: 14px; /** text.typeset.lineHeight.xs */
    --sl-text-typeset-line-height-2xl: 34px; /** text.typeset.lineHeight.2xl */
    --sl-text-typeset-line-height-3xl: 42px; /** text.typeset.lineHeight.3xl */
    --sl-text-typeset-line-height-4xl: 58px; /** text.typeset.lineHeight.4xl */
    --sl-text-typeset-line-height-5xl: 64px; /** text.typeset.lineHeight.5xl */
    --sl-text-typeset-line-height-xxs: 12px; /** text.typeset.lineHeight.xs */
    --sl-text-typeset-letter-spacing-lg: 0.01em; /** text.typeset.letterSpacing.lg */
    --sl-text-typeset-letter-spacing-md: 0em; /** text.typeset.letterSpacing.md */
    --sl-text-typeset-letter-spacing-sm: -0.01em; /** text.typeset.letterSpacing.sm */
    --sl-text-typeset-letter-spacing-xl: 0.02em; /** text.typeset.letterSpacing.xl */
    --sl-text-typeset-letter-spacing-xs: -0.02em; /** text.typeset.letterSpacing.xs */
    --sl-text-typeset-letter-spacing-none: 0em; /** text.typeset.letterSpacing.none */
    --sl-text-typeset-text-decoration-none: none; /** text.typeset.textDecoration.none */
    --sl-text-typeset-text-decoration-underline: underline; /** text.typeset.textDecoration.underline */
    --sl-text-typeset-text-decoration-strikethrough: strikethrough; /** text.typeset.textDecoration.strikethrough */
    --sl-text-typeset-paragraph-spacing-lg: 24px; /** text.typeset.paragraphSpacing.lg */
    --sl-text-typeset-paragraph-spacing-md: 22px; /** text.typeset.paragraphSpacing.md */
    --sl-text-typeset-paragraph-spacing-sm: 18px; /** text.typeset.paragraphSpacing.sm */
    --sl-text-typeset-paragraph-spacing-xl: 28px; /** text.typeset.paragraphSpacing.xl */
    --sl-text-typeset-paragraph-spacing-xs: 14px; /** text.typeset.paragraphSpacing.xs */
    --sl-text-typeset-paragraph-spacing-2xl: 34px; /** text.typeset.paragraphSpacing.2xl */
    --sl-text-typeset-paragraph-spacing-3xl: 42px; /** text.typeset.paragraphSpacing.3xl */
    --sl-text-typeset-paragraph-spacing-4xl: 58px; /** text.typeset.paragraphSpacing.4xl */
    --sl-text-typeset-paragraph-spacing-5xl: 64px; /** text.typeset.paragraphSpacing.5xl */
    --sl-text-typeset-paragraph-spacing-none: 0; /** text.typeset.paragraphSpacing.none */
    --sl-text-text-field: [object object];
    --sl-space-lg: 16px; /** space.lg */
    --sl-space-md: 12px; /** space.md */
    --sl-space-sm: 8px; /** space.sm */
    --sl-space-xl: 24px; /** space.xl */
    --sl-space-xs: 4px; /** space.xs */
    --sl-space-2xl: 30px; /** space.2xl */
    --sl-space-2xs: 2px; /** space.2xs */
    --sl-space-3xl: 40px; /** space.3xl */
    --sl-space-badge-icon-block-lg: 1px;
    --sl-space-badge-icon-inline-lg: 1px;
    --sl-space-badge-label-inline-lg: 3px;
    --sl-space-badge-label-inline-md: 3px;
    --sl-space-badge-label-inline-xl: 3px;
    --sl-space-dialog-message-mobile-container-inline: 100%;
    --sl-border-width-lg: 4px; /** border.width.lg */
    --sl-border-width-md: 3px; /** border.width.md */
    --sl-border-width-sm: 2px; /** border.width.sm */
    --sl-border-width-xl: 5px; /** border.width.xl */
    --sl-border-width-xs: 1px; /** border.width.xs */
    --sl-border-width-2xl: 6px; /** border.width.2xl */
    --sl-border-width-2xs: 0.5px; /** 2xs */
    --sl-border-width-none: 0px; /** border.width.none */
    --sl-border-radius-lg: 12px; /** border.radius.lg */
    --sl-border-radius-md: 10px; /** border.radius.md */
    --sl-border-radius-sm: 8px; /** border.radius.sm */
    --sl-border-radius-xl: 14px; /** border.radius.xl */
    --sl-border-radius-xs: 6px; /** border.radius.xs */
    --sl-border-radius-2xl: 16px;
    --sl-border-radius-2xs: 4px; /** border.radius.2xs */
    --sl-border-radius-3xl: 18px; /** border.radius.3xl */
    --sl-border-radius-3xs: 2px; /** border.radius.3xs */
    --sl-border-radius-full: 50rem; /** border.radius.full */
    --sl-border-radius-none: 0; /** border.radius.none */
    --sl-opacity-50: 0.02; /** opacity.50 */
    --sl-opacity-100: 0.04; /** opacity.100 */
    --sl-opacity-150: 0.06; /** opacity.150 */
    --sl-opacity-200: 0.08; /** opacity.200 */
    --sl-opacity-300: 0.12; /** opacity.300 */
    --sl-opacity-400: 0.16; /** opacity.400 */
    --sl-opacity-500: 0.2; /** opacity.500 */
    --sl-opacity-600: 0.32; /** opacity.600 */
    --sl-opacity-700: 0.48; /** opacity.700 */
    --sl-opacity-800: 0.64; /** opacity.800 */
    --sl-opacity-900: 0.8; /** opacity.900 */
    --sl-opacity-1000: 1; /** opacity.1000 */
    --sl-opacity-transparent: 0; /** opacity.transparent */
    --sl-animation-easing-ease-in-out: ease-in-out; /** animation.easing.ease-in-out */
    --sl-animation-duration-fast: 90ms; /** animation.duration.fast */
    --sl-animation-duration-slow: 500ms; /** animation.duration.slow */
    --sl-animation-duration-normal: 200ms; /** animation.duration.normal */
    --sl-flex-direction-row: row;
    --sl-flex-direction-column: column;
    --sl-flex-direction-row-reverse: row-reverse;
    --sl-flex-direction-column-reverse: column-reverse;
    --sl-justify-content-end: end;
    --sl-justify-content-start: start;
    --sl-justify-content-space-between: space-between;
    --sl-color-black: #000; /** Solid black */
    --sl-color-white: #fff; /** Solid White */
    --sl-color-transparent: rgb(0 0 0 / 0%);
    --sl-color-palette-info-50: #f0f5ff; /** color.palette.info.50 */
    --sl-color-palette-info-100: #e0eaff; /** color.palette.info.100 */
    --sl-color-palette-info-150: #ccdbff; /** color.palette.info.150 */
    --sl-color-palette-info-200: #9ebaff; /** color.palette.info.200 */
    --sl-color-palette-info-300: #5985ff; /** color.palette.info.300 */
    --sl-color-palette-info-500: #2351db; /** color.palette.info.500 */
    --sl-color-palette-info-600: #1138ad; /** color.palette.info.600 */
    --sl-color-palette-info-700: #09298e; /** color.palette.info.700 */
    --sl-color-palette-info-800: #00175f; /** color.palette.info.800 */
    --sl-color-palette-info-900: #000d33; /** color.palette.info.900 */
    --sl-color-palette-info-base: #36f; /** color.palette.info.base */
    --sl-color-palette-black-base: #222; /** color.palette.black.base */
    --sl-color-palette-white-base: #fefefe; /** color.palette.white.base */
    --sl-color-palette-accent-50: #edf2fc; /** color.palette.accent.50 */
    --sl-color-palette-accent-100: #e0eaff; /** color.palette.accent.100 */
    --sl-color-palette-accent-150: #ccdbff; /** color.palette.accent.150 */
    --sl-color-palette-accent-200: #9ebaff; /** color.palette.accent.200 */
    --sl-color-palette-accent-300: #5985ff; /** color.palette.accent.300 */
    --sl-color-palette-accent-500: #2351db; /** color.palette.accent.500 */
    --sl-color-palette-accent-600: #1138ad; /** color.palette.accent.600 */
    --sl-color-palette-accent-700: #09298e; /** color.palette.accent.700 */
    --sl-color-palette-accent-800: #00175f; /** color.palette.accent.800 */
    --sl-color-palette-accent-900: #000d33; /** color.palette.accent.900 */
    --sl-color-palette-accent-base: #36f; /** color.palette.accent.base */
    --sl-color-palette-danger-50: #ffedeb; /** color.palette.danger.50 */
    --sl-color-palette-danger-100: #ffd6d1; /** color.palette.danger.100 */
    --sl-color-palette-danger-150: #ffbcb8; /** color.palette.danger.150 */
    --sl-color-palette-danger-200: #ff8e8a; /** color.palette.danger.200 */
    --sl-color-palette-danger-400: #e5454a; /** color.palette.danger.400 */
    --sl-color-palette-danger-500: #c73434; /** color.palette.danger.500 */
    --sl-color-palette-danger-600: #992224; /** color.palette.danger.600 */
    --sl-color-palette-danger-700: #6b1313; /** color.palette.danger.700 */
    --sl-color-palette-danger-800: #470d0d; /** color.palette.danger.800 */
    --sl-color-palette-danger-900: #260808; /** color.palette.danger.900 */
    --sl-color-palette-danger-base: #ff575c; /** color.palette.danger.base */
    --sl-color-palette-neutral-50: #f3f3f3; /** color.palette.neutral.50 */
    --sl-color-palette-neutral-100: #eaeaea; /** color.palette.neutral.100 */
    --sl-color-palette-neutral-150: #d5d5d5; /** color.palette.neutral.150 */
    --sl-color-palette-neutral-200: #bcbcbc; /** color.palette.neutral.200 */
    --sl-color-palette-neutral-300: #a2a1a1; /** color.palette.neutral.300 */
    --sl-color-palette-neutral-400: #898989; /** color.palette.neutral.400 */
    --sl-color-palette-neutral-500: #737373; /** color.palette.neutral.500 */
    --sl-color-palette-neutral-600: #605f5f; /** color.palette.neutral.600 */
    --sl-color-palette-neutral-700: #4e4e4e; /** color.palette.neutral.700 */
    --sl-color-palette-neutral-800: #3e3d3d; /** color.palette.neutral.800 */
    --sl-color-palette-neutral-900: #2e2e2e; /** color.palette.neutral.900 */
    --sl-color-palette-neutral-base: #222; /** color.palette.neutral.base */
    --sl-color-palette-primary-50: #fefefe; /** color.palette.primary.50 */
    --sl-color-palette-primary-100: #eaeaea; /** color.palette.primary.100 */
    --sl-color-palette-primary-150: #d5d5d5; /** color.palette.primary.150 */
    --sl-color-palette-primary-200: #bcbcbc; /** color.palette.primary.200 */
    --sl-color-palette-primary-300: #a2a1a1; /** color.palette.primary.300 */
    --sl-color-palette-primary-400: #898989; /** color.palette.primary.400 */
    --sl-color-palette-primary-500: #737373; /** color.palette.primary.500 */
    --sl-color-palette-primary-600: #605f5f; /** color.palette.primary.600 */
    --sl-color-palette-primary-700: #4e4e4e; /** color.palette.primary.700 */
    --sl-color-palette-primary-800: #3e3d3d; /** color.palette.primary.800 */
    --sl-color-palette-primary-900: #262626; /** color.palette.primary.900 */
    --sl-color-palette-primary-base: #222; /** color.palette.primary.base */
    --sl-color-palette-success-50: #ebf5ee; /** color.palette.success.50 */
    --sl-color-palette-success-100: #d7f5e1; /** color.palette.success.100 */
    --sl-color-palette-success-150: #aeebc4;
    --sl-color-palette-success-200: #70e09d; /** color.palette.success.200 */
    --sl-color-palette-success-400: #39b26c; /** color.palette.success.400 */
    --sl-color-palette-success-500: #28854e; /** color.palette.success.500 */
    --sl-color-palette-success-600: #1b6137; /** color.palette.success.600 */
    --sl-color-palette-success-700: #114224; /** color.palette.success.700 */
    --sl-color-palette-success-800: #0b331a; /** color.palette.success.800 */
    --sl-color-palette-success-900: #082613; /** color.palette.success.900 */
    --sl-color-palette-success-base: #45cc80; /** color.palette.success.base */
    --sl-color-palette-warning-50: #fffdf9; /** color.palette.warning.50 */
    --sl-color-palette-warning-100: #fff8e8; /** color.palette.warning.100 */
    --sl-color-palette-warning-150: #ffefcb; /** color.palette.warning.150 */
    --sl-color-palette-warning-200: #ffe2a3; /** color.palette.warning.200 */
    --sl-color-palette-warning-300: #ffd170; /** color.palette.warning.300 */
    --sl-color-palette-warning-400: #ffae00; /** color.palette.warning.400 */
    --sl-color-palette-warning-500: #c70; /** color.palette.warning.500 */
    --sl-color-palette-warning-600: #a66100; /** color.palette.warning.600 */
    --sl-color-palette-warning-700: #804b00; /** color.palette.warning.700 */
    --sl-color-palette-warning-800: #593400; /** color.palette.warning.800 */
    --sl-color-palette-warning-900: #331e00; /** color.palette.warning.900 */
    --sl-color-palette-warning-base: #ffae00; /** color.palette.warning.base */
    --sl-color-palette-transparent-base: rgb(0 0 0 / 0%); /** color.palette.transparent.base */
    --sl-space-new-toggleButton-nonActive-lg: 36px;
    --sl-space-new-toggleButton-nonActive-md: 27px;
    --sl-space-new-toggleButton-nonActive-sm: 23px;
    --sl-fontWeight-100: 100; /** hairline, thin */
    --sl-fontWeight-200: 200; /** extra light, ultra, light */
    --sl-fontWeight-300: 300; /** light */
    --sl-fontWeight-400: 400; /** regular, normal, book */
    --sl-fontWeight-500: 500; /** medium */
    --sl-fontWeight-600: 600; /** semi bold, demi bold */
    --sl-fontWeight-700: 700; /** bold */
    --sl-fontWeight-800: 800; /** extra bold, ultra bold */
    --sl-fontWeight-900: 900; /** black, heavy, super */
    --sl-fontWeight-950: 950; /** ultra, ultra black, extra black */
    --sl-text-new-typeset-fontFamily-body: roboto;
    --sl-text-new-typeset-fontFamily-heading: roboto;
    --sl-icon-typeset-font-size-lg: var(--sl-size-lg); /** icon.typeset.fontSize.lg */
    --sl-icon-typeset-font-size-md: var(--sl-size-md); /** icon.typeset.fontSize.md */
    --sl-icon-typeset-font-size-sm: var(--sl-size-sm); /** icon.typeset.fontSize.sm */
    --sl-icon-typeset-font-size-xl: var(--sl-size-xl); /** icon.typeset.fontSize.xl */
    --sl-icon-typeset-font-size-xs: var(--sl-size-xs); /** icon.typeset.fontSize.xs */
    --sl-icon-typeset-font-size-2xl: var(--sl-size-2xl); /** icon.typeset.fontSize.2xl */
    --sl-icon-typeset-font-size-3xl: var(--sl-size-3xl); /** icon.typeset.fontSize.3xl */
    --sl-icon-typeset-font-size-4xl: var(--sl-size-4xl); /** icon.typeset.fontSize.4xl */
    --sl-icon-typeset-fontWeight-solid: var(--sl-icon-typeset-fontWeight-icon-solid);
    --sl-icon-typeset-fontWeight-regular: var(--sl-icon-typeset-fontWeight-icon-regular);
    --sl-icon-style-solid: var(--sl-text-typeset-font-weight-icon-solid);
    --sl-icon-style-outline: var(--sl-text-typeset-font-weight-icon-regular);
    --sl-size-tab-indicator: var(--sl-size-4xs);
    --sl-size-tag-lg: var(--sl-size-2xl);
    --sl-size-tag-md: var(--sl-size-xl);
    --sl-size-icon-lg: var(--sl-size-lg);
    --sl-size-icon-md: var(--sl-size-md);
    --sl-size-icon-sm: var(--sl-size-sm);
    --sl-size-icon-xl: var(--sl-size-xl);
    --sl-size-icon-xs: var(--sl-size-xs);
    --sl-size-icon-2xl: var(--sl-size-2xl);
    --sl-size-icon-3xl: var(--sl-size-3xl);
    --sl-size-icon-4xl: var(--sl-size-4xl);
    --sl-size-badge-lg: var(--sl-size-lg);
    --sl-size-badge-md: var(--sl-size-md);
    --sl-size-badge-sm: var(--sl-size-2xs);
    --sl-size-input-option-lg: var(--sl-size-2xl); /** size.input.lg */
    --sl-size-input-option-md: var(--sl-size-xl); /** size.input.md */
    --sl-size-input-option-sm: var(--sl-size-lg);
    --sl-size-input-switch-handle-lg: calc(
      var(--sl-size-2xl) - (2 * var(--sl-space-input-switch-padding-controller))
    ); /** size.input.md */
    --sl-size-input-switch-handle-md: calc(
      var(--sl-size-xl) - (2 * var(--sl-space-input-switch-padding-controller))
    ); /** size.input.md */
    --sl-size-input-switch-handle-sm: calc(
      var(--sl-size-md) - (2 * var(--sl-space-input-switch-padding-controller))
    ); /** size.input.md */
    --sl-size-input-switch-controller-width-lg: var(--sl-size-4xl); /** size.switch.controller.lg */
    --sl-size-input-switch-controller-width-md: var(--sl-size-3xl); /** size.switch.controller.md */
    --sl-size-input-switch-controller-width-sm: var(--sl-size-2xl); /** size.switch.controller.sm */
    --sl-size-input-switch-controller-height-lg: var(--sl-size-2xl); /** size.switch.controller.lg */
    --sl-size-input-switch-controller-height-md: var(--sl-size-xl); /** size.switch.controller.md */
    --sl-size-input-switch-controller-height-sm: var(--sl-size-md); /** size.switch.controller.sm */
    --sl-size-avatar-md: var(--sl-size-2xl);
    --sl-size-avatar-sm: var(--sl-size-xl);
    --sl-size-avatar-2xl: var(--sl-size-4xl);
    --sl-size-avatar-badge-lg: var(--sl-size-lg);
    --sl-size-avatar-badge-md: var(--sl-size-md);
    --sl-size-avatar-badge-sm: var(--sl-size-2xs);
    --sl-size-button-icon-container-inline-lg: var(--sl-size-md);
    --sl-size-button-icon-container-inline-md: var(--sl-size-sm);
    --sl-size-button-icon-container-inline-sm: var(--sl-size-xs);
    --sl-size-button-icon-container-icon-only-lg: var(--sl-size-xl);
    --sl-size-button-icon-container-icon-only-md: var(--sl-size-md);
    --sl-size-button-icon-container-icon-only-sm: var(--sl-size-md);
    --sl-size-spinner-lg: var(--sl-size-lg);
    --sl-size-spinner-md: var(--sl-size-md);
    --sl-size-spinner-sm: var(--sl-size-sm);
    --sl-size-spinner-xl: var(--sl-size-xl);
    --sl-size-spinner-xs: var(--sl-size-xs);
    --sl-size-spinner-2xl: var(--sl-size-2xl);
    --sl-size-spinner-3xl: var(--sl-size-3xl);
    --sl-size-spinner-4xl: var(--sl-size-4xl);
    --sl-size-skeleton-min-height: var(--sl-size-2xs);
    --sl-size-breadcrumb: var(--sl-size-2xl);
    --sl-size-progressbar: var(--sl-size-3xs);
    --sl-size-font-150: var(--sl-size-150);
    --sl-size-font-175: var(--sl-size-175);
    --sl-size-font-200: var(--sl-size-200);
    --sl-size-font-250: var(--sl-size-250);
    --sl-size-font-300: var(--sl-size-300);
    --sl-size-font-400: var(--sl-size-400);
    --sl-size-font-500: var(--sl-size-500);
    --sl-size-font-600: var(--sl-size-600);
    --sl-size-font-800: var(--sl-size-800);
    --sl-size-font-1000: var(--sl-size-1000);
    --sl-size-lineHeight-150: var(--sl-size-150);
    --sl-size-lineHeight-175: var(--sl-size-175);
    --sl-size-lineHeight-200: var(--sl-size-200);
    --sl-size-lineHeight-250: var(--sl-size-250);
    --sl-size-lineHeight-300: var(--sl-size-300);
    --sl-size-lineHeight-400: var(--sl-size-400);
    --sl-size-lineHeight-500: var(--sl-size-500);
    --sl-size-lineHeight-600: var(--sl-size-600);
    --sl-size-lineHeight-800: var(--sl-size-800);
    --sl-size-lineHeight-1000: var(--sl-size-1000);
    --sl-size-borderWidth-bold: var(--sl-size-025); /** A bold border, applied to UI elements that need to stand out. */
    --sl-size-borderWidth-none: var(
      --sl-size-none
    ); /** A heavy border for impactful elements where heavy emphasis is needed. */
    --sl-size-borderWidth-heavy: var(
      --sl-size-050
    ); /** A heavy border for impactful elements where heavy emphasis is needed. */
    --sl-size-borderWidth-subtle: var(
      --sl-size-010
    ); /** A subtle border, applied to UI elements where subtle emphasis is needed. */
    --sl-size-borderWidth-focusRing: var(--sl-size-025);
    --sl-size-borderRadius-lg: var(--sl-size-100); /** size.borderRadius.lg */
    --sl-size-borderRadius-md: var(--sl-size-050); /** size.borderRadius.md */
    --sl-size-borderRadius-sm: var(--sl-size-025); /** size.borderRadius.sm */
    --sl-size-borderRadius-xl: var(--sl-size-150); /** size.borderRadius.xl */
    --sl-size-borderRadius-full: var(
      --sl-size-full
    ); /** Use for pill-shaped elements like badges, and circular rounding for components with equal width and height, such as icon buttons and avatars. */
    --sl-size-borderRadius-none: var(--sl-size-none); /** size.borderRadius.none */
    --sl-size-outlineOffset-default: calc(
      var(--sl-size-050) - var(--sl-size-010)
    ); /** Defines the default offset for focus indicators. */
    --sl-size-select-indicator: var(--sl-size-3xs);
    --sl-size-inline-message-start: var(--sl-size-3xs);
    --sl-text-badge-text-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-badge-text-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body);
    --sl-text-typeset-font-family-icon: var(--sl-icon-font-family-classic); /** text.typeset.fontFamily.fontIcon */
    --sl-text-tab-title: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-tab-subtitle: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-tag-close-lg: var(--sl-text-typeset-font-weight-icon-solid) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-icon);
    --sl-text-tag-close-md: var(--sl-text-typeset-font-weight-icon-solid) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-icon);
    --sl-text-tag-label-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-tag-label-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body);
    --sl-text-body-lg-bold: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** text.typeset.body.lg.bold */
    --sl-text-body-lg-normal: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** text.typeset.body.lg.normal */
    --sl-text-body-lg-demibold: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** text.typeset.body.lg.demibold */
    --sl-text-body-md-bold: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** text.typeset.body.md.bold */
    --sl-text-body-md-normal: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** text.typeset.body.md.normal */
    --sl-text-body-md-demibold: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** text.typeset.body.md.demibold */
    --sl-text-body-sm-bold: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body); /** text.typeset.body.sm.bold */
    --sl-text-body-sm-normal: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body); /** text.typeset.body.sm.normal */
    --sl-text-body-sm-demibold: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body); /** text.typeset.body.sm.demibold */
    --sl-text-href-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-sm: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-idle-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-idle-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-idle-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-hover-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-hover-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-hover-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-active-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-active-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-active-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-disabled-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-disabled-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-href-disabled-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-icon-font-icon-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-icon-font-icon-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-list-sm-normal: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-slds-checklist-body: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body);
    --sl-text-slds-checklist-heading: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-xl) var(--sl-text-typeset-font-family-heading);
    --sl-text-slds-checklist-listitem: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body);
    --sl-text-input-helper-text-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-input-helper-text-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-helper-text-sm: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-option-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** Is use in Radio and Checkbox */
    --sl-text-input-option-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** Is use in Radio and Checkbox */
    --sl-text-input-switch-input-field-bold-lg: var(--sl-text-typeset-font-weight-demibold)
      var(--sl-text-typeset-font-size-xl) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** Font size xl is 18px need to be change to 20px to match 4-Grid layout. */
    --sl-text-input-switch-input-field-bold-md: var(--sl-text-typeset-font-weight-demibold)
      var(--sl-text-typeset-font-size-lg) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-switch-input-field-bold-sm: var(--sl-text-typeset-font-weight-demibold)
      var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-switch-input-field-regular-lg: var(--sl-text-typeset-font-weight-regular)
      var(--sl-text-typeset-font-size-xl) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** Font size xl is 18px need to be change to 20px to match 4-Grid layout. */
    --sl-text-input-switch-input-field-regular-md: var(--sl-text-typeset-font-weight-regular)
      var(--sl-text-typeset-font-size-lg) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-switch-input-field-regular-sm: var(--sl-text-typeset-font-weight-regular)
      var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-text-field-text-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body);
    --sl-text-input-text-field-text-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-field-label-hint-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** Font size xl is 18px need to be change to 20px to match 4-Grid layout. */
    --sl-text-input-field-label-hint-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-field-label-hint-sm: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-field-label-label-lg: var(--sl-text-typeset-font-weight-demibold)
      var(--sl-text-typeset-font-size-lg) / var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body); /** Font size xl is 18px need to be change to 20px to match 4-Grid layout. */
    --sl-text-input-field-label-label-md: var(--sl-text-typeset-font-weight-demibold)
      var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-input-field-label-label-sm: var(--sl-text-typeset-font-weight-demibold)
      var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-avatar-icon-lg: var(--sl-icon-style-outline) var(--sl-text-typeset-font-size-xl)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-avatar-icon-md: var(--sl-icon-style-outline) var(--sl-text-typeset-font-size-lg)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-avatar-icon-sm: var(--sl-icon-style-outline) var(--sl-text-typeset-font-size-md)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-avatar-icon-xl: var(--sl-icon-style-outline) var(--sl-text-typeset-font-size-2xl)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-avatar-header-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-header-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-header-sm: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-header-xl: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-header-2xl: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-header-3xl: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-initials-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-initials-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-initials-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-xs) /
      var(--sl-text-typeset-line-height-xs) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-initials-xl: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-xl) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-initials-2xl: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-2xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-subheader-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-subheader-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-sm) / 18px
      var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-subheader-sm: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-subheader-xl: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-subheader-2xl: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-subheader-3xl: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 18px
      var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-subheader-4xl: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-idle-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-idle-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-idle-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-hover-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-hover-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-hover-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-active-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      24px var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-active-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      16px var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-active-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      16px var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-disabled-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      24px var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-disabled-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      16px var(--sl-text-typeset-font-family-body);
    --sl-text-button-link-disabled-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      16px var(--sl-text-typeset-font-family-body);
    --sl-text-button-text-lg: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 24px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-text-md: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-text-sm: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-button-font-icon-lg: var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-sm) sans-serif;
    --sl-text-button-font-icon-md: var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-xs) sans-serif;
    --sl-text-button-font-icon-sm: var(--sl-text-typeset-font-size-md) / var(--sl-text-typeset-line-height-xxs) sans-serif;
    --sl-text-select-selectbox-text-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body);
    --sl-text-select-selectbox-text-md: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body); /** UPDATED - Line height md from 22px to 20px */
    --sl-text-heading-0: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-4xl) /
      var(--sl-text-typeset-line-height-4xl) var(--sl-text-typeset-font-family-heading); /** text.typeset.heading.0 */
    --sl-text-heading-1: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-3xl) /
      var(--sl-text-typeset-line-height-3xl) var(--sl-text-typeset-font-family-heading); /** text.typeset.heading.1 */
    --sl-text-heading-2: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-2xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-font-family-heading); /** text.typeset.heading.2 */
    --sl-text-heading-3: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-xl) var(--sl-text-typeset-font-family-heading); /** text.typeset.heading.3 */
    --sl-text-heading-4: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-lg) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-heading); /** text.typeset.heading.4 */
    --sl-text-popover-text-text: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-popover-text-title: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-tooltip-text-tip: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-sm) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-tooltip-text-title: var(--sl-text-typeset-font-weight-demibold) var(--sl-text-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body);
    --sl-text-accordion-body: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-accordion-title: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-xl) var(--sl-text-typeset-font-family-heading);
    --sl-text-breadcrumb-link: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-breadcrumb-current: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-text-breadcrumb-disabled: var(--sl-text-typeset-font-weight-regular) var(--sl-text-typeset-font-size-md) / 16px
      var(--sl-text-typeset-font-family-body);
    --sl-space-100: var(--sl-size-100);
    --sl-space-125: var(--sl-size-125);
    --sl-space-150: var(--sl-size-150);
    --sl-space-175: var(--sl-size-175);
    --sl-space-200: var(--sl-size-200);
    --sl-space-250: var(--sl-size-250);
    --sl-space-300: var(--sl-size-300);
    --sl-space-400: var(--sl-size-400);
    --sl-space-500: var(--sl-size-500);
    --sl-space-600: var(--sl-size-600);
    --sl-space-700: var(--sl-size-700);
    --sl-space-800: var(--sl-size-800);
    --sl-space-1000: var(--sl-size-1000);
    --sl-space-tab-gap: var(--sl-space-sm);
    --sl-space-tab-more-block: var(--sl-space-sm);
    --sl-space-tab-more-inline: var(--sl-space-md);
    --sl-space-tab-block: var(--sl-space-md);
    --sl-space-tab-inline: var(--sl-space-xl);
    --sl-space-tab-content-vertical-gap: var(--sl-space-xl);
    --sl-space-tab-content-vertical-block: var(--sl-space-sm);
    --sl-space-tab-content-vertical-inline: var(--sl-space-xl);
    --sl-space-tab-content-horizontal-gap: var(--sl-space-xl);
    --sl-space-tab-content-horizontal-block: var(--sl-space-xl);
    --sl-space-tab-content-horizontal-inline: var(--sl-space-xl);
    --sl-space-tag-gap-lg: var(--sl-space-md); /** 8px */
    --sl-space-tag-gap-md: var(--sl-space-sm); /** 4px */
    --sl-space-tag-list-lg: calc(var(--sl-space-xs) + var(--sl-space-2xs));
    --sl-space-tag-list-md: var(--sl-space-xs);
    --sl-space-tag-block-lg: var(--sl-space-sm); /** space.button.solid.block.lg */
    --sl-space-tag-block-md: var(--sl-space-xs); /** space.button.solid.block.md */
    --sl-space-tag-inline-lg: var(--sl-space-md); /** space.button.solid.inline.lg */
    --sl-space-tag-inline-md: var(--sl-space-sm); /** space.button.solid.inline.md */
    --sl-space-card-media-margins: var(--sl-space-sm);
    --sl-space-card-content-inline: var(--sl-space-xl);
    --sl-space-card-content-block: var(--sl-space-xl);
    --sl-space-card-vertical-block: var(--sl-space-xl);
    --sl-space-card-horizontal-block: var(--sl-space-xl);
    --sl-space-card-slotheader-badges-gap: var(--sl-space-sm);
    --sl-space-card-slotheader-badges-block: var(--sl-space-xs);
    --sl-space-card-gap-content-block: var(--sl-space-lg);
    --sl-space-card-gap-content-inline: var(--sl-space-sm);
    --sl-space-form-gap: var(--sl-space-xl);
    --sl-space-menu-item-gap: var(--sl-space-sm);
    --sl-space-menu-item-block: var(--sl-space-sm);
    --sl-space-menu-item-inline: var(--sl-space-sm);
    --sl-space-menu-container-gap: var(--sl-space-xs);
    --sl-space-menu-container-block: var(--sl-space-sm);
    --sl-space-menu-container-inline: var(--sl-space-sm);
    --sl-space-none: var(--sl-size-none);
    --sl-space-badge-gap-lg: var(--sl-space-xs);
    --sl-space-badge-gap-md: var(--sl-space-xs);
    --sl-space-badge-gap-sm: var(--sl-space-2xs);
    --sl-space-badge-icon-block-xl: var(--sl-space-2xs);
    --sl-space-badge-icon-inline-xl: var(--sl-space-2xs);
    --sl-space-badge-block-lg: var(--sl-space-2xs);
    --sl-space-badge-block-md: var(--sl-space-2xs);
    --sl-space-badge-block-sm: var(--sl-space-2xs);
    --sl-space-badge-label-inline-sm: var(--sl-space-2xs);
    --sl-space-badge-label-inline-xs: var(--sl-space-2xs);
    --sl-space-badge-label-inline-2xs: var(--sl-space-2xs);
    --sl-space-badge-inline-lg: var(--sl-space-sm);
    --sl-space-badge-inline-md: var(--sl-space-sm);
    --sl-space-badge-inline-sm: var(--sl-space-2xs);
    --sl-space-group-lg: var(--sl-space-sm);
    --sl-space-group-md: var(--sl-space-xs);
    --sl-space-group-sm: var(--sl-space-2xs);
    --sl-space-group-xl: var(--sl-space-sm);
    --sl-space-input-helper-gap-lg: var(--sl-space-xs); /** 8px */
    --sl-space-input-helper-gap-md: var(--sl-space-xs); /** 4px */
    --sl-space-input-helper-gap-sm: var(--sl-space-xs); /** 4px */
    --sl-space-input-helper-padding-top-lg: var(--sl-space-xs); /** 8px */
    --sl-space-input-helper-padding-top-md: var(--sl-space-xs); /** 4px */
    --sl-space-input-helper-padding-top-sm: var(--sl-space-xs); /** 4px */
    --sl-space-input-option-gap-lg: var(--sl-space-sm); /** 8px */
    --sl-space-input-option-gap-md: var(--sl-space-sm); /** 4px */
    --sl-space-input-option-gap-sm: var(--sl-space-sm); /** 4px */
    --sl-space-input-option-block-lg: var(--sl-space-xs); /** space.button.solid.block.lg */
    --sl-space-input-option-block-md: var(--sl-space-xs); /** space.button.solid.block.md */
    --sl-space-input-switch-margin-top-lg: var(--sl-space-sm); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-top-md: var(--sl-space-sm); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-top-sm: var(--sl-space-sm); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-left: var(--sl-space-sm); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-bottom-md: var(--sl-space-xs); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-container: var(--sl-space-xs); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-controller: var(--sl-space-2xs); /** space.switch.padding.outer */
    --sl-space-input-text-field-gap-lg: var(--sl-space-sm); /** 8px */
    --sl-space-input-text-field-gap-md: var(--sl-space-sm); /** 4px */
    --sl-space-input-text-field-block-lg: calc(
      var(--sl-space-sm) - var(--sl-conceptual-border-width-default)
    ); /** space.button.solid.block.lg */
    --sl-space-input-text-field-block-md: calc(
      var(--sl-space-xs) + var(--sl-conceptual-border-width-default)
    ); /** space.button.solid.block.md */
    --sl-space-input-text-field-inline-lg: calc(
      var(--sl-space-lg) - var(--sl-conceptual-border-width-default)
    ); /** space.button.solid.inline.lg */
    --sl-space-input-text-field-inline-md: calc(
      var(--sl-space-md) - var(--sl-conceptual-border-width-default)
    ); /** space.button.solid.inline.md */
    --sl-space-input-field-label-gap-lg: var(--sl-space-sm); /** 8px */
    --sl-space-input-field-label-gap-md: var(--sl-space-xs); /** 4px */
    --sl-space-input-field-label-gap-sm: var(--sl-space-xs); /** 4px */
    --sl-space-input-field-label-icon-lg: var(--sl-space-xs); /** 4px */
    --sl-space-input-field-label-icon-md: var(--sl-space-2xs); /** 4px */
    --sl-space-input-field-label-padding-bottom-lg: var(--sl-space-sm); /** 4px */
    --sl-space-input-field-label-padding-bottom-md: var(--sl-space-xs); /** 4px */
    --sl-space-input-field-label-padding-bottom-sm: var(--sl-space-sm); /** 4px */
    --sl-space-avatar-badge-inset-lg: calc(var(--sl-space-xs) * -1);
    --sl-space-avatar-badge-inset-sm: calc(var(--sl-space-2xs) * -1);
    --sl-space-avatar-badge-inset-xl: calc(var(--sl-space-2xs) * -1);
    --sl-space-avatar-badge-inset-2xl: calc(var(--sl-space-2xs) * -1);
    --sl-space-avatar-badge-inset-3xl: var(--sl-space-2xs);
    --sl-space-avatar-badge-inset-4xl: calc(var(--sl-space-md) + 2px);
    --sl-space-avatar-badge-margin: var(--sl-space-2xs);
    --sl-space-avatar-block-lg: var(--sl-space-sm);
    --sl-space-avatar-block-md: var(--sl-space-sm);
    --sl-space-avatar-block-sm: var(--sl-space-sm);
    --sl-space-avatar-block-xl: var(--sl-space-sm);
    --sl-space-avatar-block-2xl: var(--sl-space-sm);
    --sl-space-avatar-block-3xl: var(--sl-space-sm);
    --sl-space-avatar-inline-lg: var(--sl-space-lg);
    --sl-space-avatar-inline-md: var(--sl-space-sm);
    --sl-space-avatar-inline-sm: var(--sl-space-sm);
    --sl-space-avatar-inline-xl: var(--sl-space-lg);
    --sl-space-avatar-inline-2xl: var(--sl-space-lg);
    --sl-space-avatar-inline-3xl: var(--sl-space-lg);
    --sl-space-button-gap-lg: var(--sl-space-sm); /** 8px */
    --sl-space-button-gap-md: var(--sl-space-xs); /** 4px */
    --sl-space-button-gap-sm: var(--sl-space-xs); /** 4px */
    --sl-space-button-link-block-lg: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-link)
    ); /** space.button.solid.block.lg */
    --sl-space-button-link-block-md: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-link)
    ); /** space.button.solid.block.md */
    --sl-space-button-link-block-sm: calc(
      var(--sl-space-xs) - var(--sl-border-width-button-link)
    ); /** space.button.solid.block.sm */
    --sl-space-button-link-icon-only-lg: calc(var(--sl-space-sm) - var(--sl-border-width-button-link));
    --sl-space-button-link-icon-only-md: calc(var(--sl-space-sm) - var(--sl-border-width-button-link));
    --sl-space-button-link-icon-only-sm: calc(var(--sl-space-xs) - var(--sl-border-width-button-link));
    --sl-space-button-ghost-block-lg: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.block.lg */
    --sl-space-button-ghost-block-md: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.block.md */
    --sl-space-button-ghost-block-sm: calc(
      var(--sl-space-xs) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.block.sm */
    --sl-space-button-ghost-inline-lg: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.inline.lg */
    --sl-space-button-ghost-inline-md: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.inline.md */
    --sl-space-button-ghost-inline-sm: calc(
      var(--sl-space-lg) - var(--sl-border-width-button-ghost)
    ); /** space.button.solid.inline.sm */
    --sl-space-button-ghost-icon-only-lg: calc(var(--sl-space-sm) - var(--sl-border-width-button-ghost));
    --sl-space-button-ghost-icon-only-md: calc(var(--sl-space-sm) - var(--sl-border-width-button-ghost));
    --sl-space-button-ghost-icon-only-sm: calc(var(--sl-space-xs) - var(--sl-border-width-button-ghost));
    --sl-space-button-solid-block-lg: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.block.lg */
    --sl-space-button-solid-block-md: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.block.md */
    --sl-space-button-solid-block-sm: calc(
      var(--sl-space-xs) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.block.sm */
    --sl-space-button-solid-inline-lg: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.inline.lg */
    --sl-space-button-solid-inline-md: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.inline.md */
    --sl-space-button-solid-inline-sm: calc(
      var(--sl-space-lg) - var(--sl-border-width-button-solid)
    ); /** space.button.solid.inline.sm */
    --sl-space-button-solid-icon-only-lg: calc(var(--sl-space-sm) - var(--sl-border-width-button-solid));
    --sl-space-button-solid-icon-only-md: calc(var(--sl-space-sm) - var(--sl-border-width-button-solid));
    --sl-space-button-solid-icon-only-sm: calc(var(--sl-space-xs) - var(--sl-border-width-button-solid));
    --sl-space-button-outline-block-lg: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.block.lg */
    --sl-space-button-outline-block-md: calc(
      var(--sl-space-sm) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.block.md */
    --sl-space-button-outline-block-sm: calc(
      var(--sl-space-xs) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.block.sm */
    --sl-space-button-outline-inline-lg: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.inline.lg */
    --sl-space-button-outline-inline-md: calc(
      var(--sl-space-xl) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.inline.md */
    --sl-space-button-outline-inline-sm: calc(
      var(--sl-space-lg) - var(--sl-border-width-button-outline)
    ); /** space.button.solid.inline.sm */
    --sl-space-button-outline-inline-text-only-lg: var(--sl-space-2xl);
    --sl-space-button-outline-inline-text-only-md: var(--sl-space-2xl);
    --sl-space-button-outline-icon-only-lg: calc(var(--sl-space-sm) - var(--sl-border-width-button-outline));
    --sl-space-button-outline-icon-only-md: calc(var(--sl-space-sm) - var(--sl-border-width-button-outline));
    --sl-space-button-outline-icon-only-sm: calc(var(--sl-space-xs) - var(--sl-border-width-button-outline));
    --sl-space-dialog-mobile-body-gap: var(--sl-space-lg); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-body-block: var(--sl-space-lg); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-body-inline: var(--sl-space-lg); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-container-padding-top: calc(var(--sl-space-xl) * 2); /** space.button.solid.block.md */
    --sl-space-dialog-desktop-body-gap: var(--sl-space-xl); /** space.dialog.desktop.body.gap */
    --sl-space-dialog-desktop-body-block: var(--sl-space-xl); /** space.dialog.desktop.body.block */
    --sl-space-dialog-desktop-body-inline: var(--sl-space-xl); /** space.dialog.desktop.body.inline */
    --sl-space-dialog-desktop-container-inline: var(--sl-space-xl); /** space.dialog.desktop.container.inline */
    --sl-space-dialog-desktop-container-padding-top: var(--sl-space-xl); /** space.dialog.desktop.container.paddingTop */
    --sl-space-dialog-desktop-container-padding-bottom: var(
      --sl-space-xl
    ); /** space.dialog.desktop.container.paddingBottom */
    --sl-space-dialog-message-mobile-container-padding-left: var(--sl-space-xl);
    --sl-space-dialog-message-mobile-container-padding-right: var(--sl-space-xl);
    --sl-space-dialog-subtitle-padding-bottom: var(--sl-space-xs); /** space.button.solid.block.md */
    --sl-space-select-divider-gap-lg: var(--sl-space-sm);
    --sl-space-select-divider-gap-md: var(--sl-space-sm);
    --sl-space-select-divider-line-lg: var(--sl-space-sm);
    --sl-space-select-divider-line-md: var(--sl-space-sm);
    --sl-space-select-divider-block-lg: var(--sl-space-sm);
    --sl-space-select-divider-block-md: var(--sl-space-sm);
    --sl-space-select-divider-inline-lg: var(--sl-space-md);
    --sl-space-select-divider-inline-md: var(--sl-space-md);
    --sl-space-select-listbox-gap-lg: var(--sl-space-xs);
    --sl-space-select-listbox-gap-md: var(--sl-space-xs);
    --sl-space-select-listbox-block-lg: calc(var(--sl-space-sm) - var(--sl-border-width-xs));
    --sl-space-select-listbox-block-md: calc(var(--sl-space-sm) - var(--sl-border-width-xs));
    --sl-space-select-listbox-inline-lg: calc(var(--sl-space-sm) - var(--sl-border-width-xs));
    --sl-space-select-listbox-inline-md: calc(var(--sl-space-sm) - var(--sl-border-width-xs));
    --sl-space-popover-gap: var(--sl-space-xs); /** space.popover.gap */
    --sl-space-popover-block: var(--sl-space-sm); /** space.button.solid.block.md */
    --sl-space-popover-links-gap: var(--sl-space-sm);
    --sl-space-popover-links-block: var(--sl-space-xs);
    --sl-space-popover-inline: var(--sl-space-md); /** space.button.solid.inline.md */
    --sl-space-popover-offset: var(--sl-space-xs);
    --sl-space-popover-arrow-offset: var(--sl-space-lg);
    --sl-space-tooltip-gap: var(--sl-space-xs);
    --sl-space-tooltip-block: var(--sl-space-sm); /** space.button.solid.block.md */
    --sl-space-tooltip-inline: var(--sl-space-sm); /** space.button.solid.inline.md */
    --sl-space-tooltip-offset: var(--sl-space-xs);
    --sl-space-tooltip-arrow-offset: var(--sl-space-sm);
    --sl-space-button-bar-gap-default-block: var(--sl-space-sm);
    --sl-space-button-bar-gap-ghost-icon-block: var(--sl-space-xs);
    --sl-space-paginator-gap: var(--sl-space-sm);
    --sl-space-breadcrumb-gap-full: var(--sl-space-lg);
    --sl-space-breadcrumb-gap-home: var(--sl-space-xs);
    --sl-space-breadcrumb-gap-short: var(--sl-space-sm);
    --sl-space-progressbar-vertical-gap: var(--sl-space-sm);
    --sl-space-progressbar-horizontal-gap: var(--sl-space-lg);
    --sl-space-inline-message-gap: var(--sl-space-lg);
    --sl-space-inline-message-block: var(--sl-space-md); /** space.inline-message.block.md */
    --sl-space-inline-message-inline-end: var(--sl-space-md); /** space.inline-message.inline.end */
    --sl-space-inline-message-inline-start: calc(
      var(--sl-space-lg) + var(--sl-size-inline-message-start)
    ); /** space.inline-message.inline.start */
    --sl-space-inline-message-content-gap: var(--sl-space-xs);
    --sl-space-010: var(--sl-size-010);
    --sl-space-025: var(--sl-size-025);
    --sl-space-050: var(--sl-size-050);
    --sl-space-075: var(--sl-size-075);
    --sl-space-full: var(--sl-size-full);
    --sl-space-accordion-gap: var(--sl-space-md);
    --sl-space-accordion-block: var(--sl-space-lg);
    --sl-space-accordion-title-gap: var(--sl-space-sm);
    --sl-space-accordion-title-block: var(--sl-space-lg);
    --sl-space-accordion-title-inline: var(--sl-space-sm);
    --sl-space-accordion-inline: var(--sl-space-3xl);
    --sl-space-accordion-content-block: var(--sl-space-lg);
    --sl-space-accordion-content-inline: var(--sl-space-3xl);
    --sl-border-width-card-border: var(--sl-border-width-xs);
    --sl-border-width-slds-checklist: var(--sl-border-width-xs);
    --sl-border-width-input-none: var(--sl-border-width-none); /** border.width.button.default */
    --sl-border-width-input-option: var(--sl-border-width-xs); /** border.width.button.outline */
    --sl-border-width-border-tab: var(--sl-border-width-xs);
    --sl-border-width-border-tabbar: var(--sl-border-width-xs);
    --sl-border-width-dialog-default: var(--sl-border-width-none);
    --sl-border-width-divider: var(--sl-border-width-xs);
    --sl-border-width-popover-none: var(--sl-border-width-none); /** border.width.button.default */
    --sl-border-width-popover-border: var(--sl-border-width-xs); /** border.width.button.outline */
    --sl-border-width-tooltip-none: var(--sl-border-width-none); /** border.width.button.default */
    --sl-border-width-tooltip-border: var(--sl-border-width-xs); /** border.width.button.outline */
    --sl-border-width-focusring-inside: var(--sl-border-width-xs);
    --sl-border-width-focusring-offset: var(--sl-border-width-sm);
    --sl-border-width-focusring-default: var(--sl-border-width-sm);
    --sl-border-width-inline-message-start: var(--sl-border-width-lg);
    --sl-button-label-lg: var(--sl-text-typeset-line-height-lg);
    --sl-button-label-md: var(--sl-text-typeset-line-height-sm);
    --sl-button-label-sm: var(--sl-text-typeset-line-height-sm);
    --sl-opacity-spinner-shadow: var(--sl-opacity-600);
    --sl-animation-button-easing: var(--sl-animation-easing-ease-in-out); /** animation.button.easing */
    --sl-animation-button-duration: var(--sl-animation-duration-normal); /** animation.button.duration */
    --sl-box-shadow-slds-checklist:
      0 0 4px 0 rgb(34 34 34 / var(--sl-opacity-50)), 0 4px 8px 0 rgb(34 34 34 / var(--sl-opacity-150));
    --sl-elevation-shadow-lg:
      0 0 4px 0 rgb(34 34 34 / var(--sl-opacity-100)), 0 8px 16px 0 rgb(34 34 34 / var(--sl-opacity-200));
    --sl-elevation-shadow-md:
      0 0 4px 0 rgb(34 34 34 / var(--sl-opacity-50)), 0 4px 8px 0 rgb(34 34 34 / var(--sl-opacity-150));
    --sl-elevation-shadow-sm:
      0 0 6px 0 rgb(34 34 34 / var(--sl-opacity-50)), 0 2px 4px 0 rgb(34 34 34 / var(--sl-opacity-200));
    --sl-elevation-shadow-none: var(--sl-opacity-transparent) 0 0 0 rgb(34 34 34 / 0%);
    --sl-elevation-shadow-overlay:
      0 var(--sl-size-075) var(--sl-size-150) -3px var(--sl-color-shadow-overlay1),
      0 var(--sl-size-150) var(--sl-size-200) var(--sl-color-shadow-overlay2);
    --sl-elevation-shadow-overflow: 0 0 var(--sl-size-200) var(--sl-color-shadow-overflow1);
    --sl-border-radius-focusring-full: var(--sl-border-radius-full);
    --sl-border-radius-slds-checklist: var(--sl-border-radius-2xl);
    --sl-border-radius-badge-full: var(--sl-border-radius-full);
    --sl-border-radius-button-lg: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-md: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-sm: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-icon-only-lg: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-icon-only-md: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-button-icon-only-sm: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-circle: var(--sl-border-radius-full); /** borderRadius.button */
    --sl-border-radius-dialog-mobile: var(--sl-border-radius-none);
    --sl-border-radius-select-item: var(--sl-border-radius-3xs);
    --sl-border-radius-select-listbox: var(--sl-border-radius-2xs);
    --sl-border-radius-select-indicator: var(--sl-border-radius-3xs);
    --sl-border-radius-default: var(--sl-border-radius-3xs); /** borderRadius.button */
    --sl-border-radius-checkbox: var(--sl-border-radius-3xs);
    --sl-color-palette-info-400: var(--sl-color-palette-info-base); /** color.palette.info.400 */
    --sl-color-palette-accent-400: var(--sl-color-palette-accent-base); /** color.palette.accent.400 */
    --sl-color-palette-danger-300: var(--sl-color-palette-danger-base); /** color.palette.danger.300 */
    --sl-color-palette-success-300: var(--sl-color-palette-success-base); /** color.palette.success.300 */
    --sl-size-new-icon-lg: var(--sl-size-250);
    --sl-size-new-icon-md: var(--sl-size-200);
    --sl-size-new-icon-sm: var(--sl-size-175);
    --sl-size-new-icon-xl: var(--sl-size-300);
    --sl-size-new-icon-xs: var(--sl-size-150);
    --sl-size-new-icon-2xl: var(--sl-size-400);
    --sl-size-new-icon-3xl: var(--sl-size-600);
    --sl-size-new-icon-4xl: var(--sl-size-800);
    --sl-space-new-toggleButton-nonActive-lg-2: var(--sl-size-300) + ((var(--sl-size-100) + var(--sl-size-new-icon-md))/2);
    --sl-space-new-toggleButton-nonActive-md-2: var(--sl-size-200) + ((var(--sl-size-100) + var(--sl-size-new-icon-md))/2);
    --sl-dialog-footer-flex-direction: var(--sl-flex-direction-row);
    --sl-dialog-footer-justify-content: var(--sl-justify-content-end);
    --sl-dialog-header-flex-direction: var(--sl-flex-direction-column);
    --sl-text-case-badge-text-transform: var(--sl-text-typeset-text-case-uppercase);
    --sl-component-button-lg: [object object];
    --sl-component-button-md: [object object];
    --sl-conceptual-border-width-default: var(--sl-border-width-xs); /** Conceptual Theme Border Token */
    --sl-text-new-icon-solid: var(--sl-icon-typeset-fontWeight-icon-solid) 16px var(--sl-icon-typeset-fontFamily-classic);
    --sl-text-new-icon-outline: var(--sl-icon-typeset-fontWeight-icon-regular) 16px
      var(--sl-icon-typeset-fontFamily-classic);
    --sl-text-new-typeset-fontFamily-icon: var(--sl-icon-typeset-fontFamily-classic);
    --sl-text-new-typeset-fontWeight-regular: var(--sl-fontWeight-400);
    --sl-text-new-typeset-fontWeight-semiBold: var(--sl-fontWeight-500);
    --sl-size-tag-counter: calc(var(--sl-border-radius-default) + var(--sl-border-radius-default));
    --sl-size-icon-font-lg: var(--sl-size-new-icon-lg);
    --sl-size-icon-font-md: var(--sl-size-new-icon-md);
    --sl-size-icon-font-sm: var(--sl-size-new-icon-sm);
    --sl-size-icon-font-xl: var(--sl-size-new-icon-xl);
    --sl-size-icon-font-xs: var(--sl-size-new-icon-xs);
    --sl-size-icon-font-2xl: var(--sl-size-new-icon-2xl);
    --sl-size-icon-font-3xl: var(--sl-size-new-icon-3xl);
    --sl-size-icon-font-4xl: var(--sl-size-new-icon-4xl);
    --sl-size-input-option-checkbox-icon-lg: var(--sl-size-icon-lg); /** size.input.lg */
    --sl-size-input-option-checkbox-icon-md: var(--sl-size-icon-md); /** size.input.md */
    --sl-size-input-option-checkbox-icon-sm: var(--sl-size-icon-xs);
    --sl-size-borderWidth-action: var(
      --sl-size-borderWidth-subtle
    ); /** Sets the standard border width for action components. */
    --sl-size-borderWidth-default: var(
      --sl-size-borderWidth-subtle
    ); /** Sets the standard border width for UI elements. */
    --sl-size-borderRadius-child: calc(
      var(--sl-size-borderRadius-md) / 2
    ); /** The standard border radius for most components. Use for elements that need subtle rounding without emphasizing their shape. */
    --sl-size-borderRadius-default: var(
      --sl-size-borderRadius-md
    ); /** The standard border radius for most components. Use for elements that need subtle rounding without emphasizing their shape. */
    --sl-size-outlineWidth-default: var(
      --sl-size-borderWidth-bold
    ); /** Sets the standard outline width for UI elements. */
    --sl-size-text-new-body-lg: var(--sl-size-font-200);
    --sl-size-text-new-body-md: var(--sl-size-font-175); /** default text size for body */
    --sl-size-text-new-body-sm: var(--sl-size-font-150);
    --sl-size-text-new-heading-lg: var(--sl-size-font-300);
    --sl-size-text-new-heading-md: var(--sl-size-font-200);
    --sl-size-text-new-heading-sm: var(--sl-size-font-175);
    --sl-size-text-new-heading-xl: var(--sl-size-font-400);
    --sl-size-text-new-heading-2xl: var(--sl-size-font-600);
    --sl-text-dialog-message-mobile-heading: var(--sl-text-typeset-font-weight-demibold)
      var(--sl-icon-typeset-font-size-md) / var(--sl-text-typeset-line-height-md)
      var(--sl-text-typeset-font-family-heading);
    --sl-text-dialog-message-mobile-subheading: var(--sl-text-typeset-font-weight-demibold)
      var(--sl-icon-typeset-font-size-sm) / var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-body);
    --sl-text-dialog-heading: var(--sl-text-typeset-font-weight-demibold) var(--sl-icon-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-font-family-heading);
    --sl-text-dialog-subheading: var(--sl-text-typeset-font-weight-demibold) var(--sl-icon-typeset-font-size-md) /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-body);
    --sl-text-card-body: var(--sl-text-body-md-normal);
    --sl-text-card-title: var(--sl-text-heading-3);
    --sl-text-card-subtitle: var(--sl-text-body-lg-normal);
    --sl-text-icon-font-icon-sm: var(--sl-text-typeset-font-weight-regular) var(--sl-icon-typeset-font-size-xs)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-input-helper-font-icon-lg: var(--sl-text-typeset-font-weight-icon-solid) 15px /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-icon);
    --sl-text-input-helper-font-icon-md: var(--sl-text-typeset-font-weight-icon-solid) 15px /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-icon);
    --sl-text-input-text-field-font-icon-lg: var(--sl-text-typeset-font-weight-icon-solid) 18px /
      var(--sl-text-typeset-line-height-md) var(--sl-text-typeset-font-family-icon);
    --sl-text-input-text-field-font-icon-md: var(--sl-text-typeset-font-weight-icon-solid) 15px /
      var(--sl-text-typeset-line-height-sm) var(--sl-text-typeset-font-family-icon);
    --sl-text-avatar-icon-2xl: var(--sl-icon-style-outline) var(--sl-icon-typeset-font-size-2xl)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-avatar-icon-3xl: var(--sl-icon-style-outline) var(--sl-icon-typeset-font-size-2xl)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-avatar-icon-4xl: var(--sl-icon-style-outline) var(--sl-icon-typeset-font-size-4xl)
      var(--sl-text-typeset-font-family-icon);
    --sl-text-avatar-header-4xl: var(--sl-text-typeset-font-weight-regular) var(--sl-icon-typeset-font-size-xl) /
      var(--sl-text-typeset-line-height-lg) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-initials-3xl: var(--sl-text-typeset-font-weight-demibold) var(--sl-icon-typeset-font-size-2xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-font-family-body);
    --sl-text-avatar-initials-4xl: var(--sl-text-typeset-font-weight-demibold) var(--sl-icon-typeset-font-size-4xl) /
      var(--sl-text-typeset-line-height-2xl) var(--sl-text-typeset-font-family-body);
    --sl-text-select-selectbox-title-lg: var(--sl-text-typeset-font-weight-regular) var(--sl-icon-typeset-font-size-sm) /
      var(--sl-text-typeset-line-height-xs) var(--sl-text-typeset-font-family-body);
    --sl-text-select-selectbox-title-md: var(--sl-text-typeset-font-weight-regular) var(--sl-icon-typeset-font-size-xs) /
      var(--sl-text-typeset-line-height-xxs) var(--sl-text-typeset-font-family-body);
    --sl-space-tag-counter-gap: calc(-1 * var(--sl-border-radius-default) / 2);
    --sl-space-card-media-full: var(--sl-space-none);
    --sl-space-card-vertical-gap: var(--sl-space-none);
    --sl-space-card-vertical-inline: var(--sl-space-none);
    --sl-space-card-horizontal-gap: var(--sl-space-none);
    --sl-space-card-horizontal-inline: var(--sl-space-none);
    --sl-space-card-slotheader-badges-inline: var(--sl-space-none);
    --sl-space-card-gap-header-block: var(--sl-space-none);
    --sl-space-card-gap-header-inline: var(--sl-space-none);
    --sl-space-badge-icon-block-md: var(--sl-space-none);
    --sl-space-badge-icon-block-sm: var(--sl-space-none);
    --sl-space-badge-icon-block-xs: var(--sl-space-none);
    --sl-space-badge-icon-block-2xs: var(--sl-space-none);
    --sl-space-badge-icon-inline-md: var(--sl-space-none);
    --sl-space-badge-icon-inline-sm: var(--sl-space-none);
    --sl-space-badge-icon-inline-xs: var(--sl-space-none);
    --sl-space-badge-icon-inline-2xs: var(--sl-space-none);
    --sl-space-focus-gap: calc(var(--sl-border-width-focusring-default) + var(--sl-border-width-focusring-offset));
    --sl-space-input-helper-padding-top-none: var(--sl-space-none); /** 8px */
    --sl-space-input-option-block-sm: var(--sl-space-none); /** space.button.solid.block.md */
    --sl-space-input-option-inline-lg: var(--sl-space-none); /** space.button.solid.inline.lg */
    --sl-space-input-option-inline-md: var(--sl-space-none); /** space.button.solid.inline.md */
    --sl-space-input-option-inline-sm: var(--sl-space-none); /** space.button.solid.inline.md */
    --sl-space-input-switch-gap: var(--sl-space-none); /** space.input.switch.padding.gap */
    --sl-space-input-switch-margin-top-none: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-bottom-lg: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-bottom-sm: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-switch-margin-bottom-none: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-row-lg: calc(
      var(--sl-space-input-switch-margin-left) + var(--sl-size-input-switch-controller-width-lg) +
        (var(--sl-space-input-switch-padding-container) * 2)
    ); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-row-md: calc(
      var(--sl-space-input-switch-margin-left) + var(--sl-size-input-switch-controller-width-md) +
        (var(--sl-space-input-switch-padding-container) * 2)
    ); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-row-sm: calc(
      var(--sl-space-input-switch-margin-left) + var(--sl-size-input-switch-controller-width-sm) +
        (var(--sl-space-input-switch-padding-container) * 2)
    ); /** space.switch.padding.outer */
    --sl-space-input-switch-padding-row-none: var(--sl-space-none); /** space.switch.padding.outer */
    --sl-space-input-field-label-gap-none: var(--sl-space-none); /** 8px */
    --sl-space-input-field-label-padding-bottom-none: var(--sl-space-none); /** 8px */
    --sl-space-avatar-badge-inset-md: var(--sl-space-none);
    --sl-space-button-link-inline-lg: var(--sl-space-none); /** space.button.solid.inline.lg */
    --sl-space-button-link-inline-md: var(--sl-space-none); /** space.button.solid.inline.md */
    --sl-space-button-link-inline-sm: var(--sl-space-none); /** space.button.solid.inline.sm */
    --sl-space-dialog-gap-header: var(--sl-space-none); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-container-inline: var(--sl-space-none); /** space.button.solid.block.md */
    --sl-space-dialog-mobile-container-padding-bottom: var(--sl-space-none); /** space.button.solid.block.md */
    --sl-space-select-item-gap-lg: var(--sl-space-input-text-field-gap-lg); /** 8px */
    --sl-space-select-item-gap-md: var(--sl-space-input-text-field-gap-md); /** 4px */
    --sl-space-select-item-block-lg: var(--sl-space-input-text-field-block-lg); /** space.button.solid.block.lg */
    --sl-space-select-item-block-md: var(--sl-space-input-text-field-block-md); /** space.button.solid.block.md */
    --sl-space-select-item-inline-lg: var(--sl-space-input-text-field-inline-lg); /** space.button.solid.inline.lg */
    --sl-space-select-item-inline-md: var(--sl-space-input-text-field-inline-md); /** space.button.solid.inline.md */
    --sl-space-select-selectbox-gap-lg: var(--sl-space-input-text-field-gap-lg); /** 8px */
    --sl-space-select-selectbox-gap-md: var(--sl-space-input-text-field-gap-md); /** 4px */
    --sl-space-select-selectbox-block-lg: var(--sl-space-input-text-field-block-lg); /** space.button.solid.block.lg */
    --sl-space-select-selectbox-block-md: var(--sl-space-input-text-field-block-md); /** space.button.solid.block.md */
    --sl-space-select-selectbox-inline-lg: var(--sl-space-input-text-field-inline-lg); /** space.button.solid.inline.lg */
    --sl-space-select-selectbox-inline-md: var(--sl-space-input-text-field-inline-md); /** space.button.solid.inline.md */
    --sl-space-button-bar-gap-default-inline: var(--sl-space-button-bar-gap-default-block);
    --sl-space-button-bar-gap-ghost-icon-inline: var(--sl-space-button-bar-gap-ghost-icon-block);
    --sl-space-offset-default: var(--sl-space-075); /** Defines the standard spacing offset. */
    --sl-border-width-input-border: var(--sl-conceptual-border-width-default); /** border.width.button.outline */
    --sl-border-width-button-link: var(--sl-conceptual-border-width-default); /** border.width.button.link */
    --sl-border-width-button-ghost: var(--sl-conceptual-border-width-default); /** border.width.button.ghost */
    --sl-border-width-button-solid: var(--sl-conceptual-border-width-default); /** border.width.button.solid */
    --sl-border-width-button-outline: var(--sl-conceptual-border-width-default); /** border.width.button.outline */
    --sl-border-width-select-listbox: var(--sl-conceptual-border-width-default); /** border.width.button.default */
    --sl-border-width-inline-message-default: var(--sl-conceptual-border-width-default);
    --sl-border-radius-focusring-inside: calc(var(--sl-border-radius-default) - 1px);
    --sl-border-radius-focusring-default: calc(var(--sl-border-radius-default) + 1px);
    --sl-border-radius-focusring-checkbox: calc(var(--sl-border-radius-checkbox) - 1px);
    --sl-border-radius-card-default: var(--sl-border-radius-default);
    --sl-border-radius-card-image-margin: var(--sl-border-radius-default);
    --sl-border-radius-avatar-square: var(--sl-border-radius-default);
    --sl-border-radius-dialog-desktop: var(--sl-border-radius-default);
    --sl-border-radius-popover-default: var(--sl-border-radius-default); /** borderRadius.button */
    --sl-border-radius-skeleton-default: var(--sl-border-radius-default);
    --sl-border-radius-inline-message-default: var(--sl-border-radius-default); /** borderRadius.button */
    --sl-color-shadow-overlay1: color-mix(in srgb, var(--sl-elevation-surface-shadow) 4%, transparent);
    --sl-color-shadow-overlay2: color-mix(in srgb, var(--sl-elevation-surface-shadow) 12%, transparent);
    --sl-color-shadow-overflow1: color-mix(in srgb, var(--sl-elevation-surface-shadow) 16%, transparent);
    --sl-space-new-lg: var(--sl-space-200); /** Use when components are 'casual friends' */
    --sl-space-new-md: var(--sl-space-100); /** Use when components are 'family' */
    --sl-space-new-sm: var(--sl-space-075); /** Use when components are 'besties' */
    --sl-space-new-xl: var(--sl-space-300); /** Use when components are 'acquaintances' */
    --sl-space-new-xs: var(--sl-space-050);
    --sl-space-new-2xl: var(--sl-space-400); /** Use when components are 'strangers' */
    --sl-space-new-2xs: var(--sl-space-025);
    --sl-space-new-3xl: var(--sl-space-800);
    --sl-space-new-grid-vertical: var(--sl-space-175);
    --sl-space-new-grid-horizontal: var(--sl-space-200);
    --sl-space-new-none: var(--sl-space-none);
    --sl-size-borderRadius-focusRing-inside: calc(
      var(--sl-size-borderRadius-default) - 1px
    ); /** Use for focusring inside of component when outside focus ring is not possible */
    --sl-size-borderRadius-focusRing-outside: calc(
      var(--sl-size-borderRadius-default) + 2px
    ); /** Use for focusring outside of component */
    --sl-space-new-input-vertical: calc(var(--sl-space-new-xs) - var(--sl-size-010));
    --sl-space-new-input-horizontal: calc(var(--sl-space-new-md) - var(--sl-size-010));
    --sl-text-new-body-lg: var(--sl-text-new-typeset-fontWeight-regular) var(--sl-size-text-new-body-lg) / 24px
      var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-body-md: var(--sl-text-new-typeset-fontWeight-regular) var(--sl-size-text-new-body-md) / 20px
      var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-body-sm: var(--sl-text-new-typeset-fontWeight-regular) var(--sl-size-text-new-body-sm) / 16px
      var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-input-lg: var(--sl-size-text-new-body-md) / 32px var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-input-md: var(--sl-size-text-new-body-md) / 24px var(--sl-text-new-typeset-fontFamily-body);
    --sl-text-new-heading-lg: var(--sl-size-text-new-heading-lg) / 32px var(--sl-text-new-typeset-fontFamily-heading);
    --sl-text-new-heading-md: var(--sl-size-text-new-heading-md) / 20px var(--sl-text-new-typeset-fontFamily-heading);
    --sl-text-new-heading-sm: var(--sl-size-text-new-heading-sm) / 20px var(--sl-text-new-typeset-fontFamily-heading);
    --sl-text-new-heading-xl: var(--sl-size-text-new-heading-xl) / 40px var(--sl-text-new-typeset-fontFamily-heading);
    --sl-text-new-heading-2xl: var(--sl-size-text-new-heading-2xl) / 48px var(--sl-text-new-typeset-fontFamily-heading);
  }

  @media (prefers-color-scheme: light) {
    :host {
      --sl-opacity-bold: 1;
      --sl-opacity-muted: 0;
      --sl-opacity-subtle: 0.2;
      --sl-opacity-moderate: 0.8;
      --sl-opacity-subtlest: 0.1;
      --sl-opacity-interactive-bold-idle: 0;
      --sl-opacity-interactive-bold-hover: 0.2;
      --sl-opacity-interactive-bold-active: 0.4;
      --sl-opacity-interactive-plain-idle: 0;
      --sl-opacity-interactive-plain-hover: 0.15;
      --sl-opacity-interactive-plain-active: 0.25;
      --sl-opacity-interactive-reversed-idle: 0.8;
      --sl-opacity-interactive-reversed-hover: 0.9;
      --sl-opacity-interactive-reversed-active: 1;
      --sl-color-palette-red-100: #ffe1e2;
      --sl-color-palette-red-150: #ffc7c9;
      --sl-color-palette-red-200: #ffa0a3;
      --sl-color-palette-red-300: #ff575c;
      --sl-color-palette-red-400: #f83b41;
      --sl-color-palette-red-500: #e51d23;
      --sl-color-palette-red-600: #c11419;
      --sl-color-palette-red-700: #a01418;
      --sl-color-palette-red-800: #84181b;
      --sl-color-palette-red-900: #480709;
      --sl-color-palette-red-050: #fff1f1;
      --sl-color-palette-blue-100: #d9e5ff;
      --sl-color-palette-blue-150: #bcd2ff;
      --sl-color-palette-blue-200: #8eb6ff;
      --sl-color-palette-blue-300: #598eff;
      --sl-color-palette-blue-400: #36f;
      --sl-color-palette-blue-500: #1b43f5;
      --sl-color-palette-blue-600: #142fe1;
      --sl-color-palette-blue-700: #1727b6;
      --sl-color-palette-blue-800: #19288f;
      --sl-color-palette-blue-900: #141a57;
      --sl-color-palette-blue-050: #eef4ff;
      --sl-color-palette-grey-100: #f0f2f5;
      --sl-color-palette-grey-150: #e0e6ea;
      --sl-color-palette-grey-200: #dae0e7;
      --sl-color-palette-grey-300: #d0d9e0;
      --sl-color-palette-grey-400: #c8d1da;
      --sl-color-palette-grey-500: #818b98;
      --sl-color-palette-grey-600: #59636e;
      --sl-color-palette-grey-700: #393f46;
      --sl-color-palette-grey-800: #25292f;
      --sl-color-palette-grey-900: #222;
      --sl-color-palette-grey-000: #fff;
      --sl-color-palette-grey-050: #f6f8fa;
      --sl-color-palette-teal-100: #c5fffa;
      --sl-color-palette-teal-150: #8bfff5;
      --sl-color-palette-teal-200: #4afef0;
      --sl-color-palette-teal-300: #15ece2;
      --sl-color-palette-teal-400: #00d0c9;
      --sl-color-palette-teal-500: #00a8a5;
      --sl-color-palette-teal-600: #008080;
      --sl-color-palette-teal-700: #066769;
      --sl-color-palette-teal-800: #0a5757;
      --sl-color-palette-teal-900: #003235;
      --sl-color-palette-teal-050: #eefffc;
      --sl-color-palette-green-100: #d3f8de;
      --sl-color-palette-green-150: #abefc3;
      --sl-color-palette-green-200: #75e0a1;
      --sl-color-palette-green-300: #45cc80;
      --sl-color-palette-green-400: #1aaf60;
      --sl-color-palette-green-500: #0d8e4c;
      --sl-color-palette-green-600: #0b7140;
      --sl-color-palette-green-700: #0b5a34;
      --sl-color-palette-green-800: #0a4a2c;
      --sl-color-palette-green-900: #042a19;
      --sl-color-palette-green-050: #edfcf2;
      --sl-color-palette-orange-100: #fff0d4;
      --sl-color-palette-orange-150: #ffdda8;
      --sl-color-palette-orange-200: #ffc471;
      --sl-color-palette-orange-300: #ff9d33;
      --sl-color-palette-orange-400: #fe8211;
      --sl-color-palette-orange-500: #ef6707;
      --sl-color-palette-orange-600: #c64c08;
      --sl-color-palette-orange-700: #9d3d0f;
      --sl-color-palette-orange-800: #7e3410;
      --sl-color-palette-orange-900: #441706;
      --sl-color-palette-orange-050: #fff8ed;
      --sl-color-palette-purple-100: #ece7ff;
      --sl-color-palette-purple-150: #d9d2ff;
      --sl-color-palette-purple-200: #bfaeff;
      --sl-color-palette-purple-300: #9f80ff;
      --sl-color-palette-purple-400: #824dff;
      --sl-color-palette-purple-500: #7b33ff;
      --sl-color-palette-purple-600: #6616eb;
      --sl-color-palette-purple-700: #5512c5;
      --sl-color-palette-purple-800: #4711a1;
      --sl-color-palette-purple-900: #29076e;
      --sl-color-palette-purple-050: #f4f2ff;
      --sl-color-palette-yellow-100: #fff7c5;
      --sl-color-palette-yellow-150: #fff085;
      --sl-color-palette-yellow-200: #ffe146;
      --sl-color-palette-yellow-300: #ffcf1b;
      --sl-color-palette-yellow-400: #ffae00;
      --sl-color-palette-yellow-500: #e28400;
      --sl-color-palette-yellow-600: #bb5c02;
      --sl-color-palette-yellow-700: #984708;
      --sl-color-palette-yellow-800: #7c3a0b;
      --sl-color-palette-yellow-900: #481d00;
      --sl-color-palette-yellow-050: #fffdea;
      --sl-theme-name: sanoma learning light;
      --sl-elevation-surface-base-default: var(
        --sl-color-palette-grey-000
      ); /** The default, flat surface level. Used for primary content backgrounds or non-interactive UI regions. */
      --sl-elevation-surface-raised-sunken: var(
        --sl-color-palette-grey-050
      ); /** Background for components that create a sunken effect, typically used for grouping related items. */
      --sl-elevation-surface-raised-default: var(
        --sl-color-palette-grey-000
      ); /** Background of elevated components like cards, grids, or dropdowns that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-inverted: var(
        --sl-color-palette-grey-900
      ); /** Background of elevated components with an inverted background color like tooltips that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-alternative: var(
        --sl-color-palette-grey-100
      ); /** An alternate surface color used for visual differentiation in components like tables or lists, providing contrast between consecutive items (e.g., zebra striping). */
      --sl-elevation-surface-shadow: var(--sl-color-palette-grey-900); /** Used as color for shadows. */
      --sl-color-skeleton-plain: var(--sl-color-palette-grey-100); /** Use for skeleton loading states. */
      --sl-color-skeleton-subtle: var(
        --sl-color-palette-grey-050
      ); /** Use for the pulse or shimmer effect in skeleton loading states. */
      --sl-color-link-hover: var(--sl-color-palette-blue-600); /** Use for links in hover state. */
      --sl-color-link-active: var(--sl-color-palette-blue-700); /** Use for links in active state. */
      --sl-color-link-focused-idle: var(
        --sl-color-palette-blue-700
      ); /** Used for the linkcolor of navigation aids in idle state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-hover: var(
        --sl-color-palette-blue-800
      ); /** Used for the linkcolor of navigation aids in hovered state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-active: var(
        --sl-color-palette-blue-900
      ); /** Used for the linkcolor of navigation aids in pressed state, such as skip links, when they are focused or visible. */
      --sl-color-link-inverted-hover: var(--sl-color-palette-blue-100); /** Use for inverted links in hover state. */
      --sl-color-link-inverted-active: var(--sl-color-palette-blue-150); /** Use for inverted links in active state. */
      --sl-color-border-info-subtle: var(
        --sl-color-palette-blue-100
      ); /** Use for subtle borders on color.background.info background colors. */
      --sl-color-border-accent-grey-bold: var(
        --sl-color-palette-grey-500
      ); /** Use for bold grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-faint: var(
        --sl-color-palette-grey-150
      ); /** Use for faint grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-heavy: var(
        --sl-color-palette-grey-900
      ); /** Use for heavy grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-plain: var(
        --sl-color-palette-grey-300
      ); /** Use for plain grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-focused: var(
        --sl-color-palette-blue-400
      ); /** Use for focus rings of elements in a focus state. */
      --sl-color-border-neutral-subtle: var(
        --sl-color-palette-grey-200
      ); /** Use for subtle borders on color.background.neutral background colors. */
      --sl-color-border-inverted: var(--sl-color-palette-grey-000); /** Use for borders on bold backgrounds. */
      --sl-color-blanket-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-moderate) * 100%),
        transparent
      ); /** Use for screen overlay that appears with dialogs or drawers. */
      --sl-color-background-input-plain: var(
        --sl-color-palette-grey-000
      ); /** Use for backgrounds of form UI elements, such as text fields, checkboxes, and radio buttons. */
      --sl-color-background-accent-red-bold: var(
        --sl-color-palette-red-500
      ); /** A vibrant red background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-red-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle red background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-red-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest red background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-interactive-bold: var(
        --sl-color-palette-red-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-red-interactive-plain: var(
        --sl-color-palette-red-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-bold: var(
        --sl-color-palette-blue-400
      ); /** A vibrant blue background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-interactive-bold: var(
        --sl-color-palette-blue-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-interactive-plain: var(
        --sl-color-palette-blue-300
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-bold: var(
        --sl-color-palette-grey-150
      ); /** A vibrant grey background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle grey background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest grey background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-interactive-bold: var(
        --sl-color-palette-grey-500
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-interactive-plain: var(
        --sl-color-palette-grey-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-bold: var(
        --sl-color-palette-teal-600
      ); /** A vibrant teal background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-teal-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle teal background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-teal-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest teal background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-interactive-bold: var(
        --sl-color-palette-teal-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-interactive-plain: var(
        --sl-color-palette-teal-400
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-bold: var(
        --sl-color-palette-green-600
      ); /** A vibrant green background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-green-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle green background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-green-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest green background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-interactive-bold: var(
        --sl-color-palette-green-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-interactive-plain: var(
        --sl-color-palette-green-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-bold: var(
        --sl-color-palette-orange-600
      ); /** A vibrant orange background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-orange-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle orange background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-orange-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest orange background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-interactive-bold: var(
        --sl-color-palette-orange-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-interactive-plain: var(
        --sl-color-palette-orange-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-bold: var(
        --sl-color-palette-purple-600
      ); /** A vibrant purple background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-purple-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle purple background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-purple-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest purple background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-interactive-bold: var(
        --sl-color-palette-purple-900
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-interactive-plain: var(
        --sl-color-palette-purple-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-bold: var(
        --sl-color-palette-yellow-400
      ); /** A vibrant yellow background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle yellow background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest yellow background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-interactive-bold: var(
        --sl-color-palette-yellow-800
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-interactive-plain: var(
        --sl-color-palette-yellow-400
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-subtlest: var(
        --sl-color-palette-grey-050
      ); /** The subtlest background in the neutral action color. */
      --sl-color-background-disabled: var(
        --sl-color-palette-grey-100
      ); /** Use for backgrounds of elements in disabled state. */
      --sl-color-background-inverted-bold: var(--sl-color-palette-grey-000); /** A solid inverted background option. */
      --sl-color-background-inverted-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle inverted background option. */
      --sl-color-background-inverted-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest inverted background option. */
      --sl-color-background-inverted-interactive-bold: var(
        --sl-color-palette-grey-800
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-inverted-interactive-plain: var(
        --sl-color-palette-grey-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-foreground-accent-red-bold: var(
        --sl-color-palette-red-800
      ); /** Use for red text on 'color.background.accent.red.muted' or 'color.background.accent.red.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-blue-bold: var(
        --sl-color-palette-blue-700
      ); /** Use for blue text on 'color.background.accent.blue.muted' or 'color.background.accent.blue.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-bold: var(
        --sl-color-palette-grey-900
      ); /** Use for bold grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-faint: var(
        --sl-color-palette-grey-300
      ); /** Use for faint text on neutral backgrounds, providing low contrast. Not intended for primary content, as it does not meet WCAG 2.2 AA contrast requirements. Use sparingly where accessibility isn't a critical concern. */
      --sl-color-foreground-accent-grey-plain: var(
        --sl-color-palette-grey-800
      ); /** Use for plain grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-subtle: var(
        --sl-color-palette-grey-700
      ); /** Use for subtle grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-subtlest: var(
        --sl-color-palette-grey-600
      ); /** Use for muted grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-teal-bold: var(
        --sl-color-palette-teal-800
      ); /** Use for teal text on 'color.background.accent.teal.muted' or 'color.background.accent.teal.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-bold: var(
        --sl-color-palette-green-700
      ); /** Use for green text on 'color.background.accent.green.muted' or 'color.background.accent.green.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-bold: var(
        --sl-color-palette-orange-800
      ); /** Use for orange text on 'color.background.accent.orange.muted' or 'color.background.accent.orange.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-bold: var(
        --sl-color-palette-purple-800
      ); /** Use for purple text on 'color.background.accent.purple.muted' or 'color.background.accent.purple.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-bold: var(
        --sl-color-palette-yellow-800
      ); /** Use for yellow text on 'color.background.accent.yellow.muted' or 'color.background.accent.yellow.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-plain: var(
        --sl-color-palette-yellow-600
      ); /** Use for yellow text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-disabled: var(--sl-color-palette-grey-500); /** Use for text in a disabled state. */
      --sl-color-foreground-inverted-bold: var(
        --sl-color-palette-grey-000
      ); /** Use for inverted text on 'color.background.inverted.subtlest', and 'color.background.inverted.subtle'. */
      --sl-color-foreground-inverted-plain: var(--sl-color-palette-grey-000); /** Use for plain inverted text. */
      --sl-color-foreground-inverted-onBold: var(
        --sl-color-palette-grey-900
      ); /** Use for inverted text on 'color.background.inverted.bold'. */
      --sl-color-link-muted-idle: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for muted links in idle state. */
      --sl-color-link-muted-hover: var(--sl-color-link-hover); /** Use for muted links in hover state. */
      --sl-color-link-muted-active: var(--sl-color-link-active); /** Use for muted links in active state. */
      --sl-color-link-inverted-idle: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for inverted links in idle state. */
      --sl-color-border-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** A neutral border option that passes min 3:1 contrast ratios. */
      --sl-color-border-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use to visually group or seperate UI elements, such as card, tabs or side panel dividers. */
      --sl-color-border-accent-red-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for bold red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-red-plain: var(
        --sl-color-background-accent-red-bold
      ); /** Use for plain red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for bold blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-plain: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for plain blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-bold: var(
        --sl-color-foreground-accent-teal-bold
      ); /** Use for bold teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-plain: var(
        --sl-color-background-accent-teal-bold
      ); /** Use for plain teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for bold green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-plain: var(
        --sl-color-background-accent-green-bold
      ); /** Use for plain green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-bold: var(
        --sl-color-foreground-accent-orange-bold
      ); /** Use for bold orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-plain: var(
        --sl-color-background-accent-orange-bold
      ); /** Use for plain orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-bold: var(
        --sl-color-foreground-accent-purple-bold
      ); /** Use for bold purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-plain: var(
        --sl-color-background-accent-purple-bold
      ); /** Use for plain purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for bold yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for plain yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-neutral-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** Use for borders that highlight neutral actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-neutral-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight neutral actions or messages on elevation.surface background colors. */
      --sl-color-border-disabled: var(
        --sl-color-border-accent-grey-faint
      ); /** Use for borders of elements in a disabled state. */
      --sl-color-border-secondary-bold: var(
        --sl-color-border-accent-grey-heavy
      ); /** Use for borders that highlight secondary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-secondary-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight secondary actions or messages on elevation.surface background colors. */
      --sl-color-background-info-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for the background of actions with bold emphasis related to informative messages. */
      --sl-color-background-info-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-info-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-input-interactive: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the input background to indicate the hover state. */
      --sl-color-background-accent-blue-subtle: color-mix(
        in srgb,
        var(--sl-color-background-accent-blue-bold) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle blue background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-subtlest: color-mix(
        in srgb,
        var(--sl-color-background-accent-blue-bold) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest blue background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for backgrounds of elements in a neutral state with subtle emphasis. */
      --sl-color-background-caution-bold: var(
        --sl-color-background-accent-yellow-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate caution. */
      --sl-color-background-caution-subtle: var(
        --sl-color-background-accent-yellow-subtle
      ); /** A subtle background option to communicate caution to prevent errors. */
      --sl-color-background-caution-subtlest: var(
        --sl-color-background-accent-yellow-subtlest
      ); /** The subtlest background option to communicate caution to prevent errors. */
      --sl-color-background-caution-interactive-bold: var(
        --sl-color-background-accent-yellow-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-caution-interactive-plain: var(
        --sl-color-background-accent-yellow-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for neutral actions. */
      --sl-color-background-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the neutral action color. */
      --sl-color-background-neutral-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-neutral-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-primary-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** A vibrant background option used for primary actions. */
      --sl-color-background-primary-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-primary-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-negative-bold: var(
        --sl-color-background-accent-red-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtle: var(
        --sl-color-background-accent-red-subtle
      ); /** A subtle background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtlest: var(
        --sl-color-background-accent-red-subtlest
      ); /** The subtlest background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-interactive-bold: var(
        --sl-color-background-accent-red-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-negative-interactive-plain: var(
        --sl-color-background-accent-red-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-positive-bold: var(
        --sl-color-background-accent-green-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate a positive outcome. */
      --sl-color-background-positive-subtle: var(
        --sl-color-background-accent-green-subtle
      ); /** A subtle background option for communicating a positive outcome. */
      --sl-color-background-positive-subtlest: var(
        --sl-color-background-accent-green-subtlest
      ); /** The subtlest background option for communicating a positive outcome. */
      --sl-color-background-positive-interactive-bold: var(
        --sl-color-background-accent-green-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-positive-interactive-plain: var(
        --sl-color-background-accent-green-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-selected-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for backgrounds of elements in selected state with bold emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-selected-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-secondary-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for secondary actions. */
      --sl-color-background-secondary-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the secondary action color. */
      --sl-color-background-secondary-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the secondary action color. */
      --sl-color-background-secondary-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-secondary-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-foreground-bold: var(--sl-color-foreground-accent-grey-bold); /** Use for headers and labels. */
      --sl-color-foreground-info-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-plain: var(--sl-color-foreground-accent-grey-plain); /** Use for body copy and menu items. */
      --sl-color-foreground-accent-red-plain: var(
        --sl-color-background-accent-red-bold
      ); /** Use for red text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-red-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.red.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-blue-plain: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for blue text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-blue-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-plain: var(
        --sl-color-background-accent-teal-bold
      ); /** Use for teal text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-teal-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-plain: var(
        --sl-color-background-accent-green-bold
      ); /** Use for green text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-green-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.green.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-plain: var(
        --sl-color-background-accent-orange-bold
      ); /** Use for orange text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-orange-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.orange.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-plain: var(
        --sl-color-background-accent-purple-bold
      ); /** Use for purple text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-purple-onBold: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for text on 'color.background.accent.purple.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-subtle: var(--sl-color-foreground-accent-grey-subtle); /** Use for subheadings. */
      --sl-color-foreground-caution-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for text that communicates caution to prevent mistakes or errors on caution backgrounds, such as 'color.background.caution.muted', and 'color.background.caution.subtle'. */
      --sl-color-foreground-caution-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for text that communicates caution to prevent mistakes or errors on neutral backgrounds. */
      --sl-color-foreground-neutral-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-neutral-plain: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-primary-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for primary actions on 'color.background.primary.muted' and 'color.background.primary.subtle'. */
      --sl-color-foreground-negative-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-foreground-positive-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
      --sl-color-foreground-selected-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-subtlest: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for placeholders and hints. */
      --sl-color-foreground-secondary-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-color-link-idle: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for links in their default or hovered state. */
      --sl-color-border-info-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight informative actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-info-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight informative actions or messages on elevation.surface background colors. */
      --sl-color-border-input: var(
        --sl-color-border-bold
      ); /** Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons. */
      --sl-color-border-caution-bold: var(
        --sl-color-border-accent-yellow-bold
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on muted, subtlest and subtle background colors. */
      --sl-color-border-caution-plain: var(
        --sl-color-border-accent-yellow-plain
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on elevation.surface background colors. */
      --sl-color-border-primary-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight primary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-primary-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight primary actions or messages on elevation.surface background colors. */
      --sl-color-border-negative-bold: var(
        --sl-color-border-accent-red-bold
      ); /** Use for borders that highlight negative or serious error states on muted, subtlest and subtle background colors. */
      --sl-color-border-negative-plain: var(
        --sl-color-border-accent-red-plain
      ); /** Use for borders that highlight negative or serious error states on elevation.surface background colors. */
      --sl-color-border-positive-bold: var(
        --sl-color-border-accent-green-bold
      ); /** Use for borders that highlight a favorable outcome on muted, subtlest and subtle background colors. */
      --sl-color-border-positive-plain: var(
        --sl-color-border-accent-green-plain
      ); /** Use for borders that highlight a favorable outcome on elevation.surface background colors. */
      --sl-color-border-selected: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that emphasize selected states, such as tabs or menu items. */
      --sl-color-background-bold: var(
        --sl-color-border-bold
      ); /** Use for backgrounds of elements in a neutral state that require a bold emphasis or a minimum color contrast of 3:1, such as switch backgrounds. */
      --sl-color-background-info-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background for informative messages. */
      --sl-color-background-info-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background for informative messages. */
      --sl-color-background-primary-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background in the primary action color. */
      --sl-color-background-primary-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-selected-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** Use for backgrounds of elements in selected state with subtle emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-interactive-bold: var(
        --sl-color-background-neutral-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-interactive-plain: var(
        --sl-color-background-neutral-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-foreground-info-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for text that communicates informative messages the user needs to be aware of on neutral backgrounds. */
      --sl-color-foreground-info-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.bold'. */
      --sl-color-foreground-brand: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for non-interactive brand-reinforcing text. */
      --sl-color-foreground-accent-grey-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.grey.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-onInverted: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.inverted', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.yellow.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-primary-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for primary actions on 'color.background.primary.bold' */
      --sl-color-foreground-negative-plain: var(
        --sl-color-foreground-accent-red-plain
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on neutral backgrounds. */
      --sl-color-foreground-negative-onBold: var(
        --sl-color-foreground-accent-red-onBold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.bold'. */
      --sl-color-foreground-positive-plain: var(
        --sl-color-foreground-accent-green-plain
      ); /** Use for text that communicates a favorable outcome on neutral backgrounds.' */
      --sl-color-foreground-positive-onBold: var(
        --sl-color-foreground-accent-green-onBold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.bold'. */
      --sl-color-foreground-selected-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Used as selected foreground color on white backgrounds. */
      --sl-color-foreground-selected-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-caution-onBold: var(
        --sl-color-foreground-accent-yellow-onBold
      ); /** Use for text that communicates caution to prevent mistakes or errors on 'color.background.caution.bold'. */
      --sl-color-foreground-neutral-onBold: var(
        --sl-color-foreground-accent-grey-onBold
      ); /** Use for neutral actions on 'color.background.neutral.bold' */
      --sl-color-foreground-secondary-onBold: var(
        --sl-color-foreground-accent-grey-onBold
      ); /** Use for secondary actions on 'color.background.secondary.bold' */
    }
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --sl-opacity-bold: 1;
      --sl-opacity-muted: 0;
      --sl-opacity-subtle: 0.35;
      --sl-opacity-moderate: 0.8;
      --sl-opacity-subtlest: 0.25;
      --sl-opacity-interactive-bold-idle: 0;
      --sl-opacity-interactive-bold-hover: 0.2;
      --sl-opacity-interactive-bold-active: 0.4;
      --sl-opacity-interactive-plain-idle: 0;
      --sl-opacity-interactive-plain-hover: 0.25;
      --sl-opacity-interactive-plain-active: 0.35;
      --sl-opacity-interactive-reversed-idle: 0.8;
      --sl-opacity-interactive-reversed-hover: 0.9;
      --sl-opacity-interactive-reversed-active: 1;
      --sl-color-palette-red-100: #84181b;
      --sl-color-palette-red-150: #a01418;
      --sl-color-palette-red-200: #c11419;
      --sl-color-palette-red-300: #e51d23;
      --sl-color-palette-red-400: #f83b41;
      --sl-color-palette-red-500: #ff575c;
      --sl-color-palette-red-600: #ffa0a3;
      --sl-color-palette-red-700: #ffc7c9;
      --sl-color-palette-red-800: #ffe1e2;
      --sl-color-palette-red-900: #fff1f1;
      --sl-color-palette-red-050: #480709;
      --sl-color-palette-blue-100: #19288f;
      --sl-color-palette-blue-150: #1727b6;
      --sl-color-palette-blue-200: #142fe1;
      --sl-color-palette-blue-300: #1b43f5;
      --sl-color-palette-blue-400: #36f;
      --sl-color-palette-blue-500: #598eff;
      --sl-color-palette-blue-600: #8eb6ff;
      --sl-color-palette-blue-700: #bcd2ff;
      --sl-color-palette-blue-800: #d9e5ff;
      --sl-color-palette-blue-900: #eef4ff;
      --sl-color-palette-blue-050: #141a57;
      --sl-color-palette-grey-100: #393f46;
      --sl-color-palette-grey-150: #59636e;
      --sl-color-palette-grey-200: #818b98;
      --sl-color-palette-grey-300: #c8d1da;
      --sl-color-palette-grey-400: #d0d9e0;
      --sl-color-palette-grey-500: #dae0e7;
      --sl-color-palette-grey-600: #e0e6ea;
      --sl-color-palette-grey-700: #f0f2f5;
      --sl-color-palette-grey-800: #f6f8fa;
      --sl-color-palette-grey-900: #fff;
      --sl-color-palette-grey-000: #222;
      --sl-color-palette-grey-050: #25292f;
      --sl-color-palette-teal-100: #0a5757;
      --sl-color-palette-teal-150: #066769;
      --sl-color-palette-teal-200: #008080;
      --sl-color-palette-teal-300: #00a8a5;
      --sl-color-palette-teal-400: #00d0c9;
      --sl-color-palette-teal-500: #15ece2;
      --sl-color-palette-teal-600: #4afef0;
      --sl-color-palette-teal-700: #8bfff5;
      --sl-color-palette-teal-800: #c5fffa;
      --sl-color-palette-teal-900: #eefffc;
      --sl-color-palette-teal-050: #003235;
      --sl-color-palette-green-100: #0a4a2c;
      --sl-color-palette-green-150: #0b5a34;
      --sl-color-palette-green-200: #0b7140;
      --sl-color-palette-green-300: #0d8e4c;
      --sl-color-palette-green-400: #1aaf60;
      --sl-color-palette-green-500: #45cc80;
      --sl-color-palette-green-600: #75e0a1;
      --sl-color-palette-green-700: #abefc3;
      --sl-color-palette-green-800: #d3f8de;
      --sl-color-palette-green-900: #edfcf2;
      --sl-color-palette-green-050: #042a19;
      --sl-color-palette-orange-100: #7e3410;
      --sl-color-palette-orange-150: #9d3d0f;
      --sl-color-palette-orange-200: #c64c08;
      --sl-color-palette-orange-300: #ef6707;
      --sl-color-palette-orange-400: #fe8211;
      --sl-color-palette-orange-500: #ff9d33;
      --sl-color-palette-orange-600: #ffc471;
      --sl-color-palette-orange-700: #ffdda8;
      --sl-color-palette-orange-800: #fff0d4;
      --sl-color-palette-orange-900: #fff8ed;
      --sl-color-palette-orange-050: #441706;
      --sl-color-palette-purple-100: #4711a1;
      --sl-color-palette-purple-150: #5512c5;
      --sl-color-palette-purple-200: #6616eb;
      --sl-color-palette-purple-300: #7b33ff;
      --sl-color-palette-purple-400: #824dff;
      --sl-color-palette-purple-500: #9f80ff;
      --sl-color-palette-purple-600: #bfaeff;
      --sl-color-palette-purple-700: #d9d2ff;
      --sl-color-palette-purple-800: #ece7ff;
      --sl-color-palette-purple-900: #f4f2ff;
      --sl-color-palette-purple-050: #29076e;
      --sl-color-palette-yellow-100: #7c3a0b;
      --sl-color-palette-yellow-150: #984708;
      --sl-color-palette-yellow-200: #bb5c02;
      --sl-color-palette-yellow-300: #e28400;
      --sl-color-palette-yellow-400: #ffae00;
      --sl-color-palette-yellow-500: #ffcf1b;
      --sl-color-palette-yellow-600: #ffe146;
      --sl-color-palette-yellow-700: #fff085;
      --sl-color-palette-yellow-800: #fff7c5;
      --sl-color-palette-yellow-900: #fffdea;
      --sl-color-palette-yellow-050: #481d00;
      --sl-theme-name: sanoma learning dark;
      --sl-elevation-surface-base-default: var(
        --sl-color-palette-grey-000
      ); /** The default, flat surface level. Used for primary content backgrounds or non-interactive UI regions. */
      --sl-elevation-surface-raised-sunken: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 5%,
        transparent
      ); /** Background for components that create a sunken effect, typically used for grouping related items. */
      --sl-elevation-surface-raised-default: var(
        --sl-color-palette-grey-050
      ); /** Background of elevated components like cards, grids, or dropdowns that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-inverted: var(
        --sl-color-palette-grey-500
      ); /** Background of elevated components with an inverted background color like tooltips that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'. */
      --sl-elevation-surface-raised-alternative: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 10%,
        transparent
      ); /** An alternate surface color used for visual differentiation in components like tables or lists, providing contrast between consecutive items (e.g., zebra striping). */
      --sl-elevation-surface-shadow: var(--sl-color-transparent); /** Used as color for shadows. */
      --sl-color-skeleton-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 5%,
        transparent
      ); /** Use for skeleton loading states. */
      --sl-color-skeleton-subtle: var(
        --sl-color-palette-grey-000
      ); /** Use for the pulse or shimmer effect in skeleton loading states. */
      --sl-color-link-hover: var(--sl-color-palette-blue-700); /** Use for links in hover state. */
      --sl-color-link-active: var(--sl-color-palette-blue-800); /** Use for links in active state. */
      --sl-color-link-focused-idle: var(
        --sl-color-palette-blue-700
      ); /** Used for the linkcolor of navigation aids in idle state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-hover: var(
        --sl-color-palette-blue-800
      ); /** Used for the linkcolor of navigation aids in hovered state, such as skip links, when they are focused or visible. */
      --sl-color-link-focused-active: var(
        --sl-color-palette-blue-900
      ); /** Used for the linkcolor of navigation aids in pressed state, such as skip links, when they are focused or visible. */
      --sl-color-link-inverted-hover: var(--sl-color-palette-blue-400); /** Use for inverted links in hover state. */
      --sl-color-link-inverted-active: var(--sl-color-palette-blue-300); /** Use for inverted links in active state. */
      --sl-color-border-accent-red-plain: var(
        --sl-color-palette-red-400
      ); /** Use for plain red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-plain: var(
        --sl-color-palette-blue-500
      ); /** Use for plain blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-bold: var(
        --sl-color-palette-grey-200
      ); /** Use for bold grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-faint: var(
        --sl-color-palette-grey-100
      ); /** Use for faint grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-grey-plain: var(
        --sl-color-palette-grey-100
      ); /** Use for plain grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-plain: var(
        --sl-color-palette-teal-300
      ); /** Use for plain teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-plain: var(
        --sl-color-palette-green-400
      ); /** Use for plain green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-plain: var(
        --sl-color-palette-orange-300
      ); /** Use for plain orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-plain: var(
        --sl-color-palette-purple-500
      ); /** Use for plain purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-plain: var(
        --sl-color-palette-yellow-300
      ); /** Use for plain yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-inverted: var(--sl-color-palette-grey-000); /** Use for borders on bold backgrounds. */
      --sl-color-blanket-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) calc(var(--sl-opacity-moderate) * 100%),
        transparent
      ); /** Use for screen overlay that appears with dialogs or drawers. */
      --sl-color-background-input-plain: var(
        --sl-color-palette-grey-050
      ); /** Use for backgrounds of form UI elements, such as text fields, checkboxes, and radio buttons. */
      --sl-color-background-accent-red-bold: var(
        --sl-color-palette-red-200
      ); /** A vibrant red background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-red-150) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle red background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-red-150) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest red background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-red-interactive-bold: var(
        --sl-color-palette-red-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-red-interactive-plain: var(
        --sl-color-palette-red-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-bold: var(
        --sl-color-palette-blue-300
      ); /** A vibrant blue background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-blue-300) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle blue background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-blue-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest blue background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-blue-interactive-bold: var(
        --sl-color-palette-grey-000
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-blue-interactive-plain: var(
        --sl-color-palette-blue-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-bold: var(
        --sl-color-palette-grey-300
      ); /** A vibrant grey background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle grey background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-400) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest grey background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-grey-interactive-bold: var(
        --sl-color-palette-grey-150
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-grey-interactive-plain: var(
        --sl-color-palette-grey-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-bold: var(
        --sl-color-palette-teal-150
      ); /** A vibrant teal background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-teal-150) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle teal background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-teal-150) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest teal background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-teal-interactive-bold: var(
        --sl-color-palette-teal-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-teal-interactive-plain: var(
        --sl-color-palette-teal-200
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-bold: var(
        --sl-color-palette-green-200
      ); /** A vibrant green background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-green-200) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle green background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-green-200) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest green background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-green-interactive-bold: var(
        --sl-color-palette-green-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-green-interactive-plain: var(
        --sl-color-palette-green-400
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-bold: var(
        --sl-color-palette-orange-150
      ); /** A vibrant orange background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-orange-200) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle orange background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-orange-200) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest orange background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-orange-interactive-bold: var(
        --sl-color-palette-orange-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-orange-interactive-plain: var(
        --sl-color-palette-orange-300
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-bold: var(
        --sl-color-palette-purple-200
      ); /** A vibrant purple background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-purple-200) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle purple background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-purple-200) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest purple background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-purple-interactive-bold: var(
        --sl-color-palette-purple-050
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-purple-interactive-plain: var(
        --sl-color-palette-purple-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-bold: var(
        --sl-color-palette-yellow-400
      ); /** A vibrant yellow background option, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-150) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle yellow background option in idle state, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-yellow-150) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest yellow background option for interactive elements, applied purely for stylistic purposes without specific meaning. */
      --sl-color-background-accent-yellow-interactive-bold: var(
        --sl-color-palette-yellow-100
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-accent-yellow-interactive-plain: var(
        --sl-color-palette-yellow-300
      ); /** Used as transparent layer on top of the subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-bold: var(
        --sl-color-palette-grey-100
      ); /** A vibrant background option used for neutral actions. */
      --sl-color-background-neutral-interactive-plain: var(
        --sl-color-palette-grey-200
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-disabled: var(
        --sl-color-palette-grey-100
      ); /** Use for backgrounds of elements in disabled state. */
      --sl-color-background-inverted-bold: var(--sl-color-palette-grey-000); /** A solid inverted background option. */
      --sl-color-background-inverted-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtle) * 100%),
        transparent
      ); /** A subtle inverted background option. */
      --sl-color-background-inverted-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-000) calc(var(--sl-opacity-subtlest) * 100%),
        transparent
      ); /** The subtlest inverted background option. */
      --sl-color-background-inverted-interactive-bold: var(
        --sl-color-palette-grey-150
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-inverted-interactive-plain: var(
        --sl-color-palette-grey-900
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-selected-bold: var(
        --sl-color-palette-blue-500
      ); /** Use for backgrounds of elements in selected state with bold emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-interactive-bold: var(
        --sl-color-palette-blue-700
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-foreground-accent-red-bold: var(
        --sl-color-palette-red-600
      ); /** Use for red text on 'color.background.accent.red.muted' or 'color.background.accent.red.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-red-plain: var(
        --sl-color-palette-red-500
      ); /** Use for red text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-blue-bold: var(
        --sl-color-palette-blue-700
      ); /** Use for blue text on 'color.background.accent.blue.muted' or 'color.background.accent.blue.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-blue-plain: var(
        --sl-color-palette-blue-600
      ); /** Use for blue text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-bold: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 87%,
        transparent
      ); /** Use for bold grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-faint: var(
        --sl-color-palette-grey-300
      ); /** Use for faint text on neutral backgrounds, providing low contrast. Not intended for primary content, as it does not meet WCAG 2.2 AA contrast requirements. Use sparingly where accessibility isn't a critical concern. */
      --sl-color-foreground-accent-grey-plain: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 80%,
        transparent
      ); /** Use for plain grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text on 'color.background.accent.grey.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-subtle: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 60%,
        transparent
      ); /** Use for subtle grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-grey-subtlest: color-mix(
        in srgb,
        var(--sl-color-palette-grey-900) 47%,
        transparent
      ); /** Use for subtlest grey text for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-teal-bold: var(
        --sl-color-palette-teal-500
      ); /** Use for teal text on 'color.background.accent.teal.muted' or 'color.background.accent.teal.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-plain: var(
        --sl-color-palette-teal-400
      ); /** Use for teal text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-green-bold: var(
        --sl-color-palette-green-700
      ); /** Use for green text on 'color.background.accent.green.muted' or 'color.background.accent.green.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-plain: var(
        --sl-color-palette-green-500
      ); /** Use for green text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-orange-bold: var(
        --sl-color-palette-orange-700
      ); /** Use for orange text on 'color.background.accent.orange.muted' or 'color.background.accent.orange.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-plain: var(
        --sl-color-palette-orange-500
      ); /** Use for orange text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-purple-bold: var(
        --sl-color-palette-purple-600
      ); /** Use for purple text on 'color.background.accent.purple.muted' or 'color.background.accent.purple.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-plain: var(
        --sl-color-palette-purple-600
      ); /** Use for purple text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-yellow-bold: var(
        --sl-color-palette-yellow-500
      ); /** Use for yellow text on 'color.background.accent.yellow.muted' or 'color.background.accent.yellow.subtle', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-yellow-plain: var(
        --sl-color-palette-yellow-400
      ); /** Use for yellow text on neutral backgrounds for purely stylistic purposes with no specific meaning. */
      --sl-color-foreground-accent-yellow-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text on 'color.background.accent.yellow.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-inverted-bold: var(
        --sl-color-palette-grey-000
      ); /** Use for inverted text on 'color.background.inverted.subtlest', and 'color.background.inverted.subtle'. */
      --sl-color-foreground-inverted-plain: var(--sl-color-palette-grey-000); /** Use for plain inverted text. */
      --sl-color-foreground-selected-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-secondary-onBold: var(
        --sl-color-palette-grey-000
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-color-link-idle: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for links in their default or hovered state. */
      --sl-color-link-muted-idle: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for muted links in idle state. */
      --sl-color-link-muted-hover: var(--sl-color-link-hover); /** Use for muted links in hover state. */
      --sl-color-link-muted-active: var(--sl-color-link-active); /** Use for muted links in active state. */
      --sl-color-link-inverted-idle: var(
        --sl-color-foreground-inverted-plain
      ); /** Use for inverted links in idle state. */
      --sl-color-border-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** A neutral border option that passes min 3:1 contrast ratios. */
      --sl-color-border-info-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight informative actions or messages on elevation.surface background colors. */
      --sl-color-border-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use to visually group or seperate UI elements, such as card, tabs or side panel dividers. */
      --sl-color-border-accent-red-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for bold red borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-blue-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for bold blue borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-teal-bold: var(
        --sl-color-foreground-accent-teal-bold
      ); /** Use for bold teal borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-green-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for bold green borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-orange-bold: var(
        --sl-color-foreground-accent-orange-bold
      ); /** Use for bold orange borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-purple-bold: var(
        --sl-color-foreground-accent-purple-bold
      ); /** Use for bold purple borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-accent-yellow-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for bold yellow borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-caution-plain: var(
        --sl-color-border-accent-yellow-plain
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on elevation.surface background colors. */
      --sl-color-border-focused: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for focus rings of elements in a focus state. */
      --sl-color-border-neutral-bold: var(
        --sl-color-border-accent-grey-bold
      ); /** Use for borders that highlight neutral actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-neutral-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight neutral actions or messages on elevation.surface background colors. */
      --sl-color-border-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for subtle borders on color.background.neutral background colors. */
      --sl-color-border-primary-plain: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that highlight primary actions or messages on elevation.surface background colors. */
      --sl-color-border-negative-plain: var(
        --sl-color-border-accent-red-plain
      ); /** Use for borders that highlight negative or serious error states on elevation.surface background colors. */
      --sl-color-border-positive-plain: var(
        --sl-color-border-accent-green-plain
      ); /** Use for borders that highlight a favorable outcome on elevation.surface background colors. */
      --sl-color-border-selected: var(
        --sl-color-border-accent-blue-plain
      ); /** Use for borders that emphasize selected states, such as tabs or menu items. */
      --sl-color-border-secondary-plain: var(
        --sl-color-border-accent-grey-plain
      ); /** Use for borders that highlight secondary actions or messages on elevation.surface background colors. */
      --sl-color-background-info-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** Use for the background of actions with bold emphasis related to informative messages. */
      --sl-color-background-info-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background for informative messages. */
      --sl-color-background-info-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background for informative messages. */
      --sl-color-background-info-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-info-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-input-interactive: var(
        --sl-color-background-neutral-interactive-plain
      ); /** Used as transparent layer on top of the input background to indicate the hover state. */
      --sl-color-background-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** Use for backgrounds of elements in a neutral state with subtle emphasis. */
      --sl-color-background-caution-bold: var(
        --sl-color-background-accent-yellow-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate caution. */
      --sl-color-background-caution-subtle: var(
        --sl-color-background-accent-yellow-subtle
      ); /** A subtle background option to communicate caution to prevent errors. */
      --sl-color-background-caution-subtlest: var(
        --sl-color-background-accent-yellow-subtlest
      ); /** The subtlest background option to communicate caution to prevent errors. */
      --sl-color-background-caution-interactive-bold: var(
        --sl-color-background-accent-yellow-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-caution-interactive-plain: var(
        --sl-color-background-accent-yellow-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-neutral-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the neutral action color. */
      --sl-color-background-neutral-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the neutral action color. */
      --sl-color-background-neutral-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-primary-bold: var(
        --sl-color-background-accent-blue-bold
      ); /** A vibrant background option used for primary actions. */
      --sl-color-background-primary-subtle: var(
        --sl-color-background-accent-blue-subtle
      ); /** A subtle background in the primary action color. */
      --sl-color-background-primary-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-primary-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-primary-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-negative-bold: var(
        --sl-color-background-accent-red-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtle: var(
        --sl-color-background-accent-red-subtle
      ); /** A subtle background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-subtlest: var(
        --sl-color-background-accent-red-subtlest
      ); /** The subtlest background option to communicate negative or serious error states (e.g., validation errors or irreversible actions). */
      --sl-color-background-negative-interactive-bold: var(
        --sl-color-background-accent-red-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-negative-interactive-plain: var(
        --sl-color-background-accent-red-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-positive-bold: var(
        --sl-color-background-accent-green-bold
      ); /** Use for the background of actions with bold emphasis related to messages that communicate a positive outcome. */
      --sl-color-background-positive-subtle: var(
        --sl-color-background-accent-green-subtle
      ); /** A subtle background option for communicating a positive outcome. */
      --sl-color-background-positive-subtlest: var(
        --sl-color-background-accent-green-subtlest
      ); /** The subtlest background option for communicating a positive outcome. */
      --sl-color-background-positive-interactive-bold: var(
        --sl-color-background-accent-green-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-positive-interactive-plain: var(
        --sl-color-background-accent-green-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-selected-subtle: var(
        --sl-color-background-accent-blue-subtlest
      ); /** Use for backgrounds of elements in selected state with subtle emphasis, such as in opened dropdowns. */
      --sl-color-background-selected-subtlest: var(
        --sl-color-background-accent-blue-subtlest
      ); /** The subtlest background in the primary action color. */
      --sl-color-background-selected-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-secondary-bold: var(
        --sl-color-background-accent-grey-bold
      ); /** A vibrant background option used for secondary actions. */
      --sl-color-background-secondary-subtle: var(
        --sl-color-background-accent-grey-subtle
      ); /** A subtle background in the secondary action color. */
      --sl-color-background-secondary-subtlest: var(
        --sl-color-background-accent-grey-subtlest
      ); /** The subtlest background in the secondary action color. */
      --sl-color-background-secondary-interactive-bold: var(
        --sl-color-background-accent-grey-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-secondary-interactive-plain: var(
        --sl-color-background-accent-grey-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-background-interactive-bold: var(
        --sl-color-background-accent-blue-interactive-bold
      ); /** Used as transparent layer on top of the bold background to indicate the hover and pressed state. */
      --sl-color-background-interactive-plain: var(
        --sl-color-background-accent-blue-interactive-plain
      ); /** Used as transparent layer on top of the muted, subtlest and subtle background to indicate the hover and pressed state. */
      --sl-color-foreground-bold: var(--sl-color-foreground-accent-grey-bold); /** Use for headers and labels. */
      --sl-color-foreground-info-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-info-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for text that communicates informative messages the user needs to be aware of on neutral backgrounds. */
      --sl-color-foreground-brand: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Use for non-interactive brand-reinforcing text. */
      --sl-color-foreground-plain: var(--sl-color-foreground-accent-grey-plain); /** Use for body copy and menu items. */
      --sl-color-foreground-subtle: var(--sl-color-foreground-accent-grey-subtle); /** Use for subheadings. */
      --sl-color-foreground-caution-bold: var(
        --sl-color-foreground-accent-yellow-bold
      ); /** Use for text that communicates caution to prevent mistakes or errors on caution backgrounds, such as 'color.background.caution.muted', and 'color.background.caution.subtle'. */
      --sl-color-foreground-caution-plain: var(
        --sl-color-foreground-accent-yellow-plain
      ); /** Use for text that communicates caution to prevent mistakes or errors on neutral backgrounds. */
      --sl-color-foreground-caution-onBold: var(
        --sl-color-foreground-accent-yellow-onBold
      ); /** Use for text that communicates caution to prevent mistakes or errors on 'color.background.caution.bold'. */
      --sl-color-foreground-neutral-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-neutral-plain: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for neutral actions on 'color.background.neutral.muted' and 'color.background.secondary.subtle'. */
      --sl-color-foreground-primary-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for primary actions on 'color.background.primary.muted' and 'color.background.primary.subtle'. */
      --sl-color-foreground-disabled: var(
        --sl-color-foreground-accent-grey-faint
      ); /** Use for foreground in a disabled state. */
      --sl-color-foreground-inverted-onBold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for inverted text on 'color.background.inverted.bold'. */
      --sl-color-foreground-negative-bold: var(
        --sl-color-foreground-accent-red-bold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-foreground-negative-plain: var(
        --sl-color-foreground-accent-red-plain
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on neutral backgrounds. */
      --sl-color-foreground-positive-bold: var(
        --sl-color-foreground-accent-green-bold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
      --sl-color-foreground-positive-plain: var(
        --sl-color-foreground-accent-green-plain
      ); /** Use for text that communicates a favorable outcome on neutral backgrounds.' */
      --sl-color-foreground-selected-bold: var(
        --sl-color-foreground-accent-blue-bold
      ); /** Use for text in selected states (e.g., tabs or menu items). */
      --sl-color-foreground-selected-plain: var(
        --sl-color-foreground-accent-blue-plain
      ); /** Used as selected foreground color on white backgrounds. */
      --sl-color-foreground-subtlest: var(
        --sl-color-foreground-accent-grey-subtlest
      ); /** Use for placeholders and hints. */
      --sl-color-foreground-secondary-bold: var(
        --sl-color-foreground-accent-grey-bold
      ); /** Use for secondary actions on 'color.background.secondary.muted' and 'color.background.secondary.subtle'. */
      --sl-color-border-info-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight informative actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-info-subtle: var(
        --sl-color-background-info-subtle
      ); /** Use for subtle borders on color.background.info background colors. */
      --sl-color-border-input: var(
        --sl-color-border-bold
      ); /** Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons. */
      --sl-color-border-accent-grey-heavy: var(
        --sl-color-foreground-bold
      ); /** Use for heavy grey borders for purely stylistic purposes with no specific meaning. */
      --sl-color-border-caution-bold: var(
        --sl-color-border-accent-yellow-bold
      ); /** Use for borders that highlight caution to help prevent mistakes or errors on muted, subtlest and subtle background colors. */
      --sl-color-border-primary-bold: var(
        --sl-color-border-accent-blue-bold
      ); /** Use for borders that highlight primary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-border-disabled: var(
        --sl-color-foreground-disabled
      ); /** Use for borders of elements in a disabled state. */
      --sl-color-border-negative-bold: var(
        --sl-color-border-accent-red-bold
      ); /** Use for borders that highlight negative or serious error states on muted, subtlest and subtle background colors. */
      --sl-color-border-positive-bold: var(
        --sl-color-border-accent-green-bold
      ); /** Use for borders that highlight a favorable outcome on muted, subtlest and subtle background colors. */
      --sl-color-border-secondary-bold: var(
        --sl-color-background-secondary-bold
      ); /** Use for borders that highlight secondary actions or messages on muted, subtlest and subtle background colors. */
      --sl-color-background-bold: var(
        --sl-color-border-bold
      ); /** Use for backgrounds of elements in a neutral state that require a bold emphasis or a minimum color contrast of 3:1, such as switch backgrounds. */
      --sl-color-foreground-accent-red-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.red.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-blue-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-grey-onInverted: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.inverted', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-teal-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.blue.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-green-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.green.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-orange-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.orange.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-accent-purple-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for text on 'color.background.accent.purple.bold', when used purely for stylistic purposes without specific meaning. */
      --sl-color-foreground-neutral-onBold: var(
        --sl-color-foreground-bold
      ); /** Use for neutral actions on 'color.background.neutral.bold' */
      --sl-color-foreground-info-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for text that communicates informative messages the user needs to be aware of on info backgrounds, such as 'color.background.info.muted' and 'color.background.info.subtle'. */
      --sl-color-foreground-primary-onBold: var(
        --sl-color-foreground-accent-blue-onBold
      ); /** Use for primary actions on 'color.background.primary.bold' */
      --sl-color-foreground-negative-onBold: var(
        --sl-color-foreground-accent-red-onBold
      ); /** Use for text that communicates negative or serious error states (e.g., validation errors or irreversible actions) on 'color.background.negative.muted', and 'color.background.negative.subtle'. */
      --sl-color-foreground-positive-onBold: var(
        --sl-color-foreground-accent-green-onBold
      ); /** Use for text that communicates a favorable outcome on positive backgrounds, such as 'color.background.positive.muted', and 'color.background.positive.subtle'. */
    }
  }
`;
